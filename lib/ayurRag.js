// ============================================================
//  AyurRAG — Retrieval-Augmented Generation layer for AyurAI
//  ------------------------------------------------------------
//  Powers the NEW "infinite" free-AI features:
//    • /api/ai/chat      — multi-turn RAG chat grounded on real data
//    • /api/ai/compare   — side-by-side herb/condition compare (structured)
//    • /api/ai/recipe    — dosha/condition-aware diet + recipe generator
//    • /api/ai/remedy    — symptom -> home-remedy finder (rule + retrieval)
//    • /api/ai/report    — one-page personalised health report
//
//  Design: ROBUST + FAST + FREE.
//   - Every feature first retrieves REAL data from the platform index.
//   - If a free OpenRouter key is present, the LLM answers over that context.
//   - If the LLM is unavailable/slow, we fall back to a deterministic,
//     real-data answer so the user is NEVER left empty-handed.
//   - All LLM calls are bounded by a hard timeout and instructed to use ONLY
//     the provided facts (no fabrication).
// ============================================================
const aiEngine = require('./aiEngine');

function arr(x) { if (x == null) return []; if (Array.isArray(x)) return x; if (typeof x === 'string') return x.split(/[,;/|]/).map(s => s.trim()).filter(Boolean); return [x]; }
function str(x) { return x == null ? '' : (Array.isArray(x) ? x.join(' ') : String(x)); }

// Build a compact, real-data context string from a query (used for RAG).
function buildContext(query, { section, limit = 8 } = {}) {
  const boostMap = { herbs: 'herb', therapies: 'therapy', yoga: 'yoga', health: 'condition', hospitals: 'hospital', doctors: 'herb' };
  const boost = boostMap[section] || null;
  const matches = aiEngine.retrieve(query, { boost, limit }) || [];
  const facts = matches.slice(0, limit).map(m => {
    const o = m.obj || {};
    if (m.type === 'herb') return `HERB ${o.name} (${o.sanskrit || ''}): uses=${arr(o.primaryUses).join(', ')}; conditions=${arr(o.healthConditions).join(', ')}; formulations=${arr(o.formulations).join(', ')}; dosha=${o.doshaEffect || ''}; precautions=${o.precautions || ''}.`;
    if (m.type === 'therapy') return `THERAPY ${o.name} (${o.sanskrit || ''}): ${o.category || ''}; indications=${arr(o.indications).join(', ')}.`;
    if (m.type === 'yoga') return `YOGA ${o.name}: ${o.difficulty || ''}; benefits=${arr(o.benefits).join(', ')}; indications=${arr(o.indications).join(', ')}.`;
    if (m.type === 'condition') return `CONDITION ${o.name} (${o.ayurvedicName || ''}): dosha=${o.doshaImbalance || ''}; herbs=${arr(o.herbs).join(', ')}; yoga=${arr(o.yoga).join(', ')}; diet=${arr(o.diet).join(', ')}; lifestyle=${arr(o.lifestyle).join(', ')}.`;
    if (m.type === 'hospital') return `HOSPITAL ${o.name}: ${o.type || ''}, ${o.city || ''}, ${o.state || ''}; therapies=${arr(o.ayurvedicTherapies).join(', ')}.`;
    return `${m.type.toUpperCase()} ${o.name}`;
  });
  return facts.join('\n');
}

// Generic RAG call: LLM over real retrieved context, with on-device fallback handled by callers.
async function ragLLM(systemExtra, userQuery, context, { timeoutMs = 15000 } = {}) {
  const contextBlock = context && context.trim() ? context : '(no matching real data found)';
  const system = 'You are AyurAI, a FREE Ayurvedic health assistant. Use ONLY the FACTS below to answer. ' +
    'Do not invent herbs, formulations, citations, or facts not present in the facts. ' +
    'If the answer is not in the facts, say you can only help with the provided data. ' +
    'Keep it concise, warm, and structured with bullet points. Always add a one-line note that this is educational, not a diagnosis.' +
    (systemExtra ? '\n\n' + systemExtra : '');
  const user = 'USER: ' + userQuery + '\n\nREAL FACTS FROM THE PLATFORM:\n' + contextBlock + '\n\nAnswer using only these facts.';
  // callFreeLLM throws if no key / all models fail -> caller falls back.
  const r = await aiEngine.callFreeLLM(system, user, { maxTokens: 700, timeoutMs });
  return { text: r.text, model: r.model };
}

// ---------------- CHAT (multi-turn RAG) ----------------
const _chatCache = new Map();
const _chatCacheMax = 400;
function chatCacheGet(k) { return _chatCache.has(k) ? _chatCache.get(k) : null; }
function chatCacheSet(k, v) { if (_chatCache.size >= _chatCacheMax) _chatCache.delete(_chatCache.keys().next().value); _chatCache.set(k, v); }

async function chat(text, { section, history = [] } = {}) {
  const q = (text || '').toString().trim();
  if (!q || q.length < 2) return { ok: false, error: 'Ask something.' };
  const ctx = buildContext(q, { section, limit: 8 });
  try {
    const sysExtra = 'You are chatting with a user interested in Ayurveda. Reference their earlier messages when relevant. Be helpful and specific.';
    const hist = (history || []).slice(-6).map(m => (m.role || 'user') + ': ' + m.content).join('\n');
    const userQ = (hist ? 'PREVIOUS MESSAGES:\n' + hist + '\n\n' : '') + q;
    const r = await ragLLM(sysExtra, userQ, ctx, { timeoutMs: 15000 });
    return { ok: true, answer: r.text, engine: 'free-llm', model: r.model, grounded: true, contextFacts: ctx.split('\n').length };
  } catch (e) {
    // On-device fallback: reuse the proven retrieval answer.
    const matches = aiEngine.retrieve(q, { limit: 8 }) || [];
    const parts = [];
    const byType = {};
    matches.forEach(m => { (byType[m.type] = byType[m.type] || []).push(m); });
    ['condition', 'herb', 'yoga', 'therapy', 'hospital'].forEach(t => {
      if (byType[t] && byType[t].length) {
        const label = { condition: '❤️ Conditions', herb: '🌿 Herbs', yoga: '🧘 Yoga', therapy: '💆 Therapies', hospital: '🏥 Hospitals' }[t];
        parts.push(label + ':\n' + byType[t].slice(0, 4).map(m => '  • ' + m.name).join('\n'));
      }
    });
    const answerText = parts.length
      ? '🧠 <b>AyurAI</b> (on-device) matched “' + q + '”:\n\n' + parts.join('\n\n')
      : '🙏 I couldn’t find a strong match for “' + q + '” in our real data. Try a condition (diabetes, PCOS), an herb (Ashwagandha, Turmeric), or yoga/therapies.';
    return { ok: true, answer: answerText, engine: 'retrieval-fallback', model: null, grounded: true, contextFacts: matches.length };
  }
}

// ---------------- COMPARE (structured side-by-side) ----------------
async function compare(a, b, { kind = 'auto' } = {}) {
  const q = `${a} vs ${b}`;
  const ctx = buildContext(a + ' ' + b, { limit: 10 });
  try {
    const sysExtra = 'Compare the two items SIDE BY SIDE using ONLY the facts. Output a short comparison with: Similarities, Key differences, and a "Best for" line for each. Use bullets.';
    const r = await ragLLM(sysExtra, q, ctx, { timeoutMs: 15000 });
    return { ok: true, a, b, comparison: r.text, engine: 'free-llm', model: r.model, grounded: true };
  } catch (e) {
    const ma = (aiEngine.retrieve(a, { limit: 3 }) || []).map(m => m.name);
    const mb = (aiEngine.retrieve(b, { limit: 3 }) || []).map(m => m.name);
    return { ok: true, a, b, comparison: `🌿 Retrieved matches for "${a}": ${ma.join(', ') || 'none'}.\n🌿 Retrieved matches for "${b}": ${mb.join(', ') || 'none'}.\n\n(Add a free OpenRouter key for a natural-language comparison.)`, engine: 'retrieval-fallback', model: null, grounded: true };
  }
}

// ---------------- RECIPE / DIET generator (dosha + condition aware) ----------------
async function recipe({ dosha, condition, goal, diet = 'veg' }) {
  const q = `Ayurvedic diet and recipes for ${dosha ? dosha + ' dosha' : ''} ${condition ? 'for ' + condition : ''} ${goal ? 'to ' + goal : ''}`.trim();
  const ctx = buildContext((condition || dosha || 'diet'), { limit: 10 });
  try {
    const sysExtra = `Generate an Ayurvedic diet plan + 2-3 simple home recipes. Respect the user's dosha/condition. Use ONLY the facts for herbs/foods; you may suggest common kitchen ingredients. Mark vegetarian/non-vegetarian per the user's preference (${diet}). Keep it practical.`;
    const r = await ragLLM(sysExtra, q, ctx, { timeoutMs: 15000 });
    return { ok: true, request: { dosha, condition, goal, diet }, plan: r.text, engine: 'free-llm', model: r.model, grounded: true };
  } catch (e) {
    const rb = (aiEngine.retrieve(condition || 'digestion', { types: ['condition'], limit: 1 })[0] || {}).obj || {};
    const dietList = arr(rb.diet).length ? rb.diet : ['Eat warm, freshly cooked meals', 'Favour seasonal vegetables', 'Avoid processed food'];
    const herbsList = arr(rb.herbs).slice(0, 5);
    return { ok: true, request: { dosha, condition, goal, diet }, plan: `🍽️ Diet guidance${condition ? ' for ' + condition : ''}:\n• ` + arr(dietList).join('\n• ') + (herbsList.length ? ('\n\nSupportive herbs: ' + herbsList.join(', ')) : ''), engine: 'retrieval-fallback', model: null, grounded: true };
  }
}

// ---------------- REMEDY finder (symptom -> home remedies) ----------------
async function remedy(symptoms) {
  const q = (Array.isArray(symptoms) ? symptoms.join(', ') : symptoms).toString().trim();
  if (!q || q.length < 2) return { ok: false, error: 'Describe symptoms.' };
  const ctx = buildContext(q, { limit: 10 });
  try {
    const sysExtra = 'From the facts, list safe Ayurvedic HOME REMEDIES for the symptoms. Use ONLY herbs/diet/lifestyle present in the facts where possible. Add a clear "see a doctor if" line.';
    const r = await ragLLM(sysExtra, 'Home remedies for: ' + q, ctx, { timeoutMs: 15000 });
    return { ok: true, symptoms: q, remedies: r.text, engine: 'free-llm', model: r.model, grounded: true };
  } catch (e) {
    const conds = (aiEngine.retrieve(q, { types: ['condition'], limit: 2 }) || []).map(m => m.obj).filter(Boolean);
    const lines = conds.map(c => {
      const rem = arr(c.homeRemedies).length ? arr(c.homeRemedies).join('; ') : (arr(c.diet).slice(0, 3).join('; ') || 'rest and hydration');
      return `• ${c.name}: ${rem}`;
    });
    return { ok: true, symptoms: q, remedies: lines.length ? ('🏠 Home remedies from real data:\n' + lines.join('\n')) : '🏠 No strong match in our real data. Try describing specific symptoms (e.g. "cough and cold", "joint pain").', engine: 'retrieval-fallback', model: null, grounded: true };
  }
}

// ---------------- HEALTH REPORT (one-page personalised) ----------------
async function report({ dosha, symptoms, vitals }) {
  const bits = [];
  if (dosha) bits.push('dosha: ' + dosha);
  if (symptoms) bits.push('symptoms: ' + (Array.isArray(symptoms) ? symptoms.join(', ') : symptoms));
  if (vitals) bits.push('vitals: ' + JSON.stringify(vitals));
  const q = bits.join('; ');
  const ctx = buildContext((symptoms || dosha || 'wellness').toString(), { limit: 10 });
  try {
    const sysExtra = 'Write a concise ONE-PAGE personalised Ayurvedic health report: (1) Snapshot (2) Dosha & diet tips (3) Recommended herbs/therapies/yoga from the facts (4) Lifestyle (5) When to see a doctor. Use ONLY the facts.';
    const r = await ragLLM(sysExtra, 'Health report for: ' + q, ctx, { timeoutMs: 16000 });
    return { ok: true, report: r.text, engine: 'free-llm', model: r.model, grounded: true };
  } catch (e) {
    const conds = (aiEngine.retrieve((symptoms || '').toString(), { types: ['condition'], limit: 2 }) || []).map(m => m.obj).filter(Boolean);
    let out = '📋 Personalised Health Report\n';
    if (dosha) out += '\nDosha: ' + dosha + ' — follow the corresponding dinacharya (daily routine).\n';
    conds.forEach(c => {
      out += `\n• ${c.name} (${c.ayurvedicName || ''}): dosha ${c.doshaImbalance || '—'}\n  Herbs: ${arr(c.herbs).slice(0, 4).join(', ') || '—'}\n  Yoga: ${arr(c.yoga).slice(0, 3).join(', ') || '—'}\n  Diet: ${arr(c.diet).slice(0, 3).join(', ') || '—'}\n`;
    });
    out += '\n⚠️ Educational only — not a diagnosis. Consult a licensed physician.';
    return { ok: true, report: out, engine: 'retrieval-fallback', model: null, grounded: true };
  }
}

// ---------------- UNIVERSAL HEALTH ASSISTANT ----------------
// Helpful for ANY disease / virus / discomfort / illness / problem. Always:
//  (1) estimates urgency (triage), (2) pulls REAL matching conditions/herbs/
//      therapies/yoga from the platform, (3) gives immediate self-care,
//  (4) clearly says when to see a doctor. Free LLM over real context, or
//  deterministic on-device fallback. Never empty-handed.
const RED = ['chest pain','can\'t breathe','shortness of breath','unconscious','fainting','severe bleeding','stroke','slurred speech','blue lips','seizure','suicidal','anaphylaxis','difficulty swallowing','severe allergic','not breathing'];
const AMBER = ['high fever','confusion','severe abdominal pain','vomiting blood','blood in stool','racing heart','dehydration','can\'t keep water down','numbness','weakness on one side','stiff neck','suicidal thoughts','severe headache','difficulty speaking'];

async function universal(text, { section } = {}) {
  const q = (text || '').toString().trim();
  if (!q || q.length < 2) return { ok: false, error: 'Describe what you are feeling.' };
  const lc = q.toLowerCase();
  let urgency = 'self-care';
  let urgencyAdvice = 'Monitor at home and use the Ayurvedic self-care below. If it worsens or persists beyond 7 days, consult a physician.';
  if (RED.some(w => lc.includes(w))) { urgency = 'EMERGENCY'; urgencyAdvice = '🚨 Seek EMERGENCY care now (call your local emergency number). Do not wait or self-treat.'; }
  else if (AMBER.some(w => lc.includes(w))) { urgency = 'URGENT'; urgencyAdvice = '🟠 Contact a physician or urgent care today. Do not rely on herbs alone.'; }
  else if (/(fever|pain|ache|cough|tired|fatigue|headache|stress|anxiety|insomnia|digest|skin|hair|acne|nausea|dizzy|sore|swollen|rash|burn|itch|cold|flu|virus|infection)/.test(lc)) { urgency = 'routine'; urgencyAdvice = '🟢 Routine: an Ayurvedic plan can help alongside rest. Track symptoms; seek care if severe or persistent.'; }

  const ctx = buildContext(q, { section, limit: 10 });
  try {
    const sysExtra = 'The user describes a health problem (any disease/virus/discomfort). Be genuinely HELPFUL and reassuring but responsible. Using ONLY the platform facts: (1) likely relevant conditions, (2) specific herbs/preparations, (3) therapies/yoga, (4) immediate self-care steps, (5) exactly when to see a doctor. Use bullets. Always grounded, never invent.';
    const r = await ragLLM(sysExtra, 'Help me with: ' + q, ctx, { timeoutMs: 16000 });
    return { ok: true, query: q, urgency, urgencyAdvice, guidance: r.text, engine: 'free-llm', model: r.model, grounded: true };
  } catch (e) {
    const conds = (aiEngine.retrieve(q, { types: ['condition'], limit: 3 }) || []).map(m => m.obj).filter(Boolean);
    const herbs = (aiEngine.retrieve(q, { types: ['herb'], limit: 5 }) || []).map(m => m.name);
    const therapies = (aiEngine.retrieve(q, { types: ['therapy'], limit: 4 }) || []).map(m => m.name);
    const yoga = (aiEngine.retrieve(q, { types: ['yoga'], limit: 4 }) || []).map(m => m.name);
    let out = '🩺 Based on our real Ayurvedic data:\n';
    if (conds.length) out += '\nConditions to read about: ' + conds.map(c => c.name + (c.ayurvedicName ? ' (' + c.ayurvedicName + ')' : '')).join(', ');
    if (herbs.length) out += '\n🌿 Herbs: ' + herbs.join(', ');
    if (therapies.length) out += '\n💆 Therapies: ' + therapies.join(', ');
    if (yoga.length) out += '\n🧘 Yoga: ' + yoga.join(', ');
    out += '\n\n' + urgencyAdvice + '\n⚠️ Educational only — not a diagnosis.';
    return { ok: true, query: q, urgency, urgencyAdvice, guidance: out, engine: 'retrieval-fallback', model: null, grounded: true };
  }
}

module.exports = { chat, compare, recipe, remedy, report, universal, buildContext, chatCacheGet, chatCacheSet };
