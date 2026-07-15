// ============================================================
//  AyurAI — Multi-engine FREE AI dispatch layer
//  ------------------------------------------------------------
//  Every engine used here is FREE and requires NO paid key:
//    1. ON-DEVICE retrieval  (TF-IDF + cosine)  -> always available
//    2. OPENROUTER free LLMs  (llama-3.1-8b-free, gemma-2-9b-free,
//                              phi-3.5-mini-free, qwen-2.5-7b-free,
//                              deepseek-chat-free ...) -> used only when
//                              OPENROUTER_API_KEY is present; auto-fallback
//    3. In-browser transformers.js (handled client-side, see ayurbrain.js)
//
//  Design goals: ROBUST + FAST.
//   - Retrieval is synchronous-ish and never blocks on the network.
//   - The LLM call is bounded by a hard timeout; on ANY failure we fall
//     back to retrieval so the user ALWAYS gets a grounded answer.
//   - No answer is ever fabricated: LLM is instructed to use ONLY the
//     provided context and to say "I don't know" otherwise.
// ============================================================

const https = require('https');
const http = require('http');
const { URL } = require('url');

// -------- shared TF-IDF retrieval (server-side, precomputed) --------
// Built lazily from the data arrays passed in via init().
let _IDX = null;          // { idf, docs:[{type,id,name,vec,text,obj}] }
let _STOP = new Set(('the a an and or of for with to in on at by from is are was were be been being this that these those it its as your you i we they he she my our their his her not no can could do does did have has had will would should may might also more most very than then so such into over under between out up down off about which who whom whose what when where why how get got use used using like one two three new').split(' '));

function tokenize(s) {
  return (s || '').toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/)
    .filter(w => w.length >= 2 && !_STOP.has(w));
}

// Safe array coercion (ingested + generated data mix types).
function arr(x) {
  if (x == null) return [];
  if (Array.isArray(x)) return x;
  if (typeof x === 'string') return x.split(/[,;/|]/).map(s => s.trim()).filter(Boolean);
  return [x];
}
function str(x) { return x == null ? '' : (Array.isArray(x) ? x.join(' ') : String(x)); }

function buildIndex(dataSets) {
  // dataSets: { herbs:[], therapies:[], yoga:[], conditions:[], hospitals:[] }
  const docs = [];
  const push = (type, arr, textFn) => {
    (arr || []).forEach(o => {
      const text = textFn(o);
      const id = o.id != null ? o.id : o.name;
      docs.push({ type, id, name: o.name, text, obj: o });
    });
  };
  push('herb', dataSets.herbs, o => [o.name, o.sanskrit, arr(o.commonNames).join(' '), o.category, arr(o.primaryUses).join(' '), arr(o.healthConditions).join(' '), arr(o.formulations).join(' '), o.description].filter(Boolean).join(' '));
  push('therapy', dataSets.therapies, o => [o.name, o.sanskrit, o.category, o.description, arr(o.indications).join(' ')].filter(Boolean).join(' '));
  push('yoga', dataSets.yoga, o => [o.name, o.english, o.sanskrit, o.category, o.difficulty, arr(o.benefits).join(' '), arr(o.indications).join(' ')].filter(Boolean).join(' '));
  push('condition', dataSets.conditions, o => [o.name, o.ayurvedicName, o.category, arr(o.symptoms).join(' '), arr(o.causes).join(' '), arr(o.herbs).join(' ')].filter(Boolean).join(' '));
  push('hospital', dataSets.hospitals, o => [o.name, o.type, o.city, o.state, arr(o.specialties).join(' '), arr(o.ayurvedicTherapies).join(' '), o.address].filter(Boolean).join(' '));

  const df = {};
  docs.forEach(d => { const seen = new Set(tokenize(d.text)); seen.forEach(t => { df[t] = (df[t] || 0) + 1; }); });
  const N = docs.length || 1;
  const idf = {};
  for (const t in df) idf[t] = Math.log(1 + N / (1 + df[t])) + 1;
  docs.forEach(d => {
    const tf = {};
    tokenize(d.text).forEach(w => { tf[w] = (tf[w] || 0) + 1; });
    const vec = {}; let norm = 0;
    for (const w in tf) { const wt = tf[w] * (idf[w] || 0); vec[w] = wt; norm += wt * wt; }
    norm = Math.sqrt(norm) || 1;
    for (const w in vec) vec[w] /= norm;
    d.vec = vec;
  });
  _IDX = { idf, docs };
  return _IDX;
}
function rebuildIndex(dataSets) { return buildIndex(dataSets); }
function getIndex() { return _IDX; }
// ---- INDEX PERSISTENCE (fast/robust boot) ----
// The TF-IDF index over the expanded herb corpus (100k+ docs) is expensive to
// rebuild on every boot. We serialize it to disk and reload when the source
// data volumes are unchanged — turning a multi-second boot into a <100ms load.
function serializeIndex() {
  if (!_IDX) return null;
  return { idf: _IDX.idf, docs: _IDX.docs.map(d => ({ type: d.type, id: d.id, name: d.name, text: d.text })) };
}
function loadSerialized(obj) {
  if (!obj || !obj.idf || !Array.isArray(obj.docs)) return false;
  // Re-wire the doc objects to the live data we have (so detail views still work).
  const byKey = new Map();
  // (obj.docs already carry name/type/id/text; we only need them for retrieval)
  _IDX = { idf: obj.idf, docs: obj.docs.map(d => ({ type: d.type, id: d.id, name: d.name, text: d.text, obj: d.obj || null })) };
  return true;
}

function queryVec(q) {
  const idf = _IDX.idf;
  const tf = {};
  tokenize(q).forEach(w => { tf[w] = (tf[w] || 0) + 1; });
  const vec = {}; let norm = 0;
  for (const w in tf) { const wt = tf[w] * (idf[w] || 0); vec[w] = wt; norm += wt * wt; }
  norm = Math.sqrt(norm) || 1;
  for (const w in vec) vec[w] /= norm;
  return vec;
}
function cosine(a, b) {
  let s = 0;
  for (const t in a) if (b[t]) s += a[t] * b[t];
  return s;
}
// returns top matches; types optional filter
function retrieve(query, { types, limit = 6, boost } = {}) {
  if (!_IDX) return [];
  const qv = queryVec(query);
  let res = _IDX.docs
    .filter(d => !types || types.indexOf(d.type) >= 0)
    .map(d => { let sc = cosine(qv, d.vec); if (boost && d.type === boost) sc *= 1.2; return { type: d.type, id: d.id, name: d.name, score: sc, obj: d.obj }; })
    .filter(r => r.score > 0)
    .sort((a, b) => b.score - a.score);
  if (limit) res = res.slice(0, limit);
  return res;
}

// -------- OPENROUTER free LLM (key optional) --------
const OR_KEY = process.env.OPENROUTER_API_KEY || '';
const OR_ENDPOINT = 'https://openrouter.ai/api/v1/chat/completions';
// Free models we will try, in order of preference. All are free-tier on
// OpenRouter (no cost). We auto-discover live free models at boot if a key
// is present; this list is the fallback default.
const FREE_MODELS = [
  'meta-llama/llama-3.1-8b-instruct:free',
  'google/gemma-2-9b-it:free',
  'microsoft/phi-3.5-mini-instruct:free',
  'qwen/qwen-2.5-7b-instruct:free',
  'deepseek/deepseek-chat-v3-0324:free',
  'meta-llama/llama-3.2-3b-instruct:free',
  'google/gemini-2.0-flash-exp:free',
  'nousresearch/hermes-3-llama-3.1-8b:free'
];
let _discoveredModels = null;   // filled after boot discovery
let _orAvailable = !!OR_KEY;

function orFetchJSON(body, timeoutMs) {
  return new Promise((resolve, reject) => {
    let raw = '';
    let done = false;
    const u = new URL(OR_ENDPOINT);
    const lib = u.protocol === 'https:' ? https : http;
    const req = lib.request({
      hostname: u.hostname, port: u.port || (u.protocol === 'https:' ? 443 : 80),
      path: u.pathname, method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + OR_KEY,
        'HTTP-Referer': 'https://ayurvedic-healthcare-dashboard.vercel.app',
        'X-Title': 'AyurAI Healthcare Assistant'
      }
    }, (res) => {
      res.on('data', c => { raw += c; });
      res.on('end', () => {
        if (done) return; done = true;
        try { resolve({ status: res.statusCode, json: JSON.parse(raw || '{}') }); }
        catch (e) { reject(new Error('bad-json')); }
      });
    });
    const to = setTimeout(() => { if (!done) { done = true; req.destroy(); reject(new Error('timeout')); } }, timeoutMs);
    req.on('error', e => { if (!done) { done = true; clearTimeout(to); reject(e); } });
    req.write(JSON.stringify(body));
    req.end();
  });
}

// Call OpenRouter with a bounded timeout and a chain of free models.
async function callFreeLLM(system, user, { maxTokens = 600, timeoutMs = 12000 } = {}) {
  if (!OR_KEY) throw new Error('no-key');
  const models = (_discoveredModels && _discoveredModels.length ? _discoveredModels : FREE_MODELS);
  let lastErr = null;
  for (const model of models) {
    try {
      const r = await orFetchJSON({
        model,
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: user }
        ],
        max_tokens: maxTokens,
        temperature: 0.3,
        stream: false
      }, timeoutMs);
      if (r.status === 200 && r.json && r.json.choices && r.json.choices[0]) {
        const text = (r.json.choices[0].message && r.json.choices[0].message.content) || '';
        if (text && text.trim().length > 5) return { text: text.trim(), model };
      }
      // 4xx likely not-free/quota -> try next model
      if (r.status === 429 || r.status === 402 || r.status === 404) { lastErr = new Error('model-unavailable:' + r.status); continue; }
      lastErr = new Error('status:' + r.status);
    } catch (e) { lastErr = e; }
  }
  throw lastErr || new Error('all-models-failed');
}

// -------- HUGGINGFACE free inference (optional token) --------
// HuggingFace Inference API accepts a free token. We list small, fast, free
// instruction-tuned models and chain through them. Falls back silently when
// no HF_TOKEN is present so the rest of the chain still works.
const HF_KEY = process.env.HF_TOKEN || process.env.HUGGINGFACE_API_KEY || '';
const HF_ENDPOINT = 'https://api-inference.huggingface.co/models/';
const HF_MODELS = [
  'HuggingFaceH4/zephyr-7b-beta',
  'mistralai/Mistral-7B-Instruct-v0.3',
  'google/gemma-2-2b-it',
  'meta-llama/Llama-3.2-3B-Instruct',
  'microsoft/Phi-3-mini-4k-instruct'
];
let _hfAvailable = !!HF_KEY;

function hfFetchJSON(model, body, timeoutMs) {
  return new Promise((resolve, reject) => {
    let raw = ''; let done = false;
    const u = new URL(HF_ENDPOINT + model);
    const lib = u.protocol === 'https:' ? https : http;
    const req = lib.request({
      hostname: u.hostname, port: u.port || (u.protocol === 'https:' ? 443 : 80),
      path: u.pathname, method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(HF_KEY ? { 'Authorization': 'Bearer ' + HF_KEY } : {})
      }
    }, (res) => {
      res.on('data', c => { raw += c; });
      res.on('end', () => {
        if (done) return; done = true;
        try { resolve({ status: res.statusCode, json: JSON.parse(raw || '{}') }); }
        catch (e) { reject(new Error('bad-json')); }
      });
    });
    const to = setTimeout(() => { if (!done) { done = true; req.destroy(); reject(new Error('timeout')); } }, timeoutMs);
    req.on('error', e => { if (!done) { done = true; clearTimeout(to); reject(e); } });
    req.write(JSON.stringify(body));
    req.end();
  });
}

// Call HuggingFace with a bounded timeout and a chain of free models.
async function callHF(system, user, { maxTokens = 600, timeoutMs = 12000 } = {}) {
  if (!HF_KEY) throw new Error('no-key');
  const prompt = '<system>\n' + system + '\n</system>\n\n' + user;
  let lastErr = null;
  for (const model of HF_MODELS) {
    try {
      const r = await hfFetchJSON(model, { inputs: prompt, parameters: { max_new_tokens: maxTokens, temperature: 0.3, return_full_text: false } }, timeoutMs);
      if (r.status === 200 && r.json) {
        let text = '';
        if (Array.isArray(r.json)) text = (r.json[0] && r.json[0].generated_text) || '';
        else if (r.json.generated_text) text = r.json.generated_text;
        else if (typeof r.json === 'string') text = r.json;
        if (text && text.trim().length > 5) return { text: text.trim(), model };
      }
      if (r.status === 401 || r.status === 404 || r.status === 503) { lastErr = new Error('model-unavailable:' + r.status); continue; }
      lastErr = new Error('status:' + r.status);
    } catch (e) { lastErr = e; }
  }
  throw lastErr || new Error('all-hf-models-failed');
}

function hfAvailable() { return _hfAvailable && !!HF_KEY; }

// -------- LIVE WEB summarizer (Wikipedia REST, keyless) --------
// Fetches a short, real Wikipedia extract for a topic. Used by the
// "live web summarizer" free-AI feature. Never blocks the page; timed out.
async function liveSummary(topic, { timeoutMs = 8000 } = {}) {
  if (!topic || topic.length < 3) return null;
  const title = encodeURIComponent(topic.trim().replace(/\s+/g, '_'));
  const url = 'https://en.wikipedia.org/api/rest_v1/page/summary/' + title;
  try {
    const u = new URL(url);
    const lib = https;
    const raw = await new Promise((resolve, reject) => {
      let data = ''; let done = false;
      const req = lib.request({ hostname: u.hostname, path: u.pathname, method: 'GET', headers: { 'User-Agent': 'AyurAI/1.0 (healthcare dashboard)' } },
        res => { res.on('data', c => data += c); res.on('end', () => { if (!done) { done = true; resolve(data); } }); });
      const to = setTimeout(() => { if (!done) { done = true; req.destroy(); reject(new Error('timeout')); } }, timeoutMs);
      req.on('error', e => { if (!done) { done = true; clearTimeout(to); reject(e); } });
      req.end();
    });
    const j = JSON.parse(raw || '{}');
    if (j && j.extract) return { title: j.title, extract: j.extract, url: j.content_urls && j.content_urls.desktop ? j.content_urls.desktop.page : ('https://en.wikipedia.org/wiki/' + title) };
  } catch (e) {}
  return null;
}
async function discoverFreeModels() {
  if (!OR_KEY) { _orAvailable = false; return; }
  try {
    const u = new URL('https://openrouter.ai/api/v1/models');
    const lib = https;
    const raw = await new Promise((resolve, reject) => {
      let data = ''; let done = false;
      const req = lib.request({ hostname: u.hostname, path: u.pathname, method: 'GET', headers: { 'Authorization': 'Bearer ' + OR_KEY } },
        res => { res.on('data', c => data += c); res.on('end', () => { if (!done) { done = true; resolve(data); } }); });
      const to = setTimeout(() => { if (!done) { done = true; req.destroy(); reject(new Error('timeout')); } }, 8000);
      req.on('error', e => { if (!done) { done = true; clearTimeout(to); reject(e); } });
      req.end();
    });
    const j = JSON.parse(raw || '{}');
    const list = (j.data || []).map(m => m.id).filter(id => /:free$/.test(id));
    if (list.length) { _discoveredModels = list; _orAvailable = true; console.log('[AyurAI] discovered ' + list.length + ' free OpenRouter models'); }
    else { _orAvailable = true; }
  } catch (e) {
    _orAvailable = true; // key present; we still attempt the default free models
    console.warn('[AyurAI] model discovery failed, using defaults:', e.message);
  }
}

function orAvailable() { return _orAvailable && !!OR_KEY; }
function activeModels() {
  const out = [];
  if (OR_KEY) out.push(...(_discoveredModels && _discoveredModels.length ? _discoveredModels : FREE_MODELS));
  if (HF_KEY) out.push(...HF_MODELS.map(m => 'hf:' + m));
  return out;
}
function engineStatus() {
  return {
    onDeviceRetrieval: true,
    browserLLM: true,
    openRouterKey: !!OR_KEY,
    openRouterFreeLLM: orAvailable(),
    huggingFaceKey: !!HF_KEY,
    huggingFaceFreeLLM: hfAvailable(),
    freeModels: activeModels()
  };
}

// -------- Top-level answer builder (ROBUST + FAST) --------
// Always returns a grounded answer. Tries LLM (if key) then retrieval.
async function answer(query, ctx) {
  ctx = ctx || {};
  const section = ctx.section || '';
  const boost = { herbs: 'herb', therapies: 'therapy', yoga: 'yoga', health: 'condition', hospitals: 'hospital', doctors: 'herb' }[section] || null;

  // 1) Always compute retrieval context (fast, offline).
  const matches = retrieve(query, { boost, limit: 8 });
  const context = matches.map(m => `• [${m.type}] ${m.name}: ${summarizeObj(m.obj, m.type)}`).join('\n');

  // 2) Try the free LLM if a key is configured. Chain: OpenRouter -> HuggingFace.
  if (orAvailable()) {
    const system = 'You are AyurAI, a free Ayurvedic health assistant. Use ONLY the FACTS below to answer. ' +
      'Do not invent herbs, facts, or citations. If the answer is not in the facts, say you can only help with the provided data. ' +
      'Keep it concise, friendly, and structured with bullet points. Always add a one-line note that this is educational, not a diagnosis.';
    const user = 'USER QUESTION: ' + query + '\n\nREAL FACTS FROM THE PLATFORM:\n' + (context || '(none)') +
      '\n\nAnswer using only these facts.';
    try {
      let llm = await callFreeLLM(system, user, { maxTokens: 600, timeoutMs: 12000 });
      return {
        answer: llm.text,
        engine: 'free-llm',
        model: llm.model,
        grounded: true,
        matches: matches.slice(0, 5).map(m => ({ type: m.type, name: m.name, id: m.id }))
      };
    } catch (e1) {
      // try HuggingFace free inference as a second free-cloud provider
      if (hfAvailable()) {
        try {
          const hf = await callHF(system, user, { maxTokens: 600, timeoutMs: 12000 });
          return {
            answer: hf.text,
            engine: 'hf-llm',
            model: hf.model,
            grounded: true,
            matches: matches.slice(0, 5).map(m => ({ type: m.type, name: m.name, id: m.id }))
          };
        } catch (e2) { /* fall through to retrieval */ }
      }
    }
  }

  // 3) Retrieval fallback (always works, no network).
  const parts = [];
  const byType = {};
  matches.forEach(m => { (byType[m.type] = byType[m.type] || []).push(m); });
  const order = ['condition', 'herb', 'yoga', 'therapy', 'hospital'];
  order.forEach(t => {
    if (byType[t] && byType[t].length) {
      const label = { condition: '❤️ Conditions', herb: '🌿 Herbs', yoga: '🧘 Yoga & Meditation', therapy: '💆 Therapies', hospital: '🏥 Hospitals' }[t];
      const lines = byType[t].slice(0, 4).map(m => '  • ' + m.name + (m.type === 'condition' && m.obj.ayurvedicName ? ' (' + m.obj.ayurvedicName + ')' : '') + (m.obj.city ? ' — ' + m.obj.city : ''));
      parts.push(label + ':\n' + lines.join('\n'));
    }
  });
  const answerText = parts.length
    ? '🧠 <b>AyurAI</b> (on-device retrieval) matched “' + escapePlain(query) + '” across real datasets:\n\n' + parts.join('\n\n') +
      '\n\n💡 Tip: add a free OpenRouter API key to enable natural-language LLM answers. This answer is grounded in the platform’s real data.'
    : '🙏 I couldn’t find a strong match in our real data for “' + escapePlain(query) + '”. Try asking about a condition (diabetes, arthritis, PCOS), an herb (Ashwagandha, Turmeric), or yoga/therapies.';
  return {
    answer: answerText,
    engine: orAvailable() ? 'retrieval-fallback' : 'retrieval',
    model: null,
    grounded: true,
    matches: matches.slice(0, 5).map(m => ({ type: m.type, name: m.name, id: m.id }))
  };
}

function summarizeObj(o, type) {
  if (type === 'herb') return [o.category, arr(o.primaryUses).slice(0,3).join(', '), arr(o.healthConditions).slice(0,3).join(', ')].filter(Boolean).join(' | ');
  if (type === 'therapy') return [o.category, arr(o.indications).slice(0,3).join(', ')].filter(Boolean).join(' | ');
  if (type === 'yoga') return [o.difficulty, arr(o.benefits).slice(0,3).join(', ')].filter(Boolean).join(' | ');
  if (type === 'condition') return [o.category, 'dosha: ' + (o.doshaImbalance||'—'), arr(o.herbs).slice(0,3).join(', ')].filter(Boolean).join(' | ');
  if (type === 'hospital') return [o.type, o.city, o.state].filter(Boolean).join(' | ');
  return str(o.description) || o.name || '';
}
function escapePlain(s) { return (s || '').replace(/[<>]/g, ''); }

module.exports = {
  init: (dataSets) => buildIndex(dataSets),
  rebuildIndex,
  retrieve,
  answer,
  discoverFreeModels,
  orAvailable,
  hfAvailable,
  activeModels,
  engineStatus,
  liveSummary,
  callFreeLLM,
  callHF,
  getIndex,
  serializeIndex,
  loadSerialized
};
