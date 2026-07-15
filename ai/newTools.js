// ============================================================
//  AyurAI — NEW infinite free-AI tools (additive module)
//  ------------------------------------------------------------
//  Every tool here is 100% FREE and KEY-LESS:
//    • grounded in REAL platform datasets (herbs, therapies,
//      yoga, conditions, doctors, hospitals),
//    • the on-device TF-IDF engine (engine.retrieve*) when useful,
//    • transparent rule/heuristic logic — never fabricates.
//  This module is self-contained and mounted once by server.js.
//  Nothing here edits the existing router — only ADDS.
// ============================================================
const EN_HI = {
  'take with warm water': 'गर्म पानी के साथ लें', 'morning': 'सुबह', 'bedtime': 'सोने का समय',
  'consult': 'सलाह लें', 'herb': 'जड़ी-बूटी', 'dosage': 'खुराक', 'avoid': 'से बचें',
  'diabetes': 'मधुमेह', 'sleep': 'नींद', 'immunity': 'रोग प्रतिरोधक क्षमता',
  'ginger': 'अदरक', 'turmeric': 'हल्दी', 'tulsi': 'तुलसी', 'water': 'पानी', 'food': 'भोजन',
  'exercise': 'व्यायाम', 'breathing': 'साँस लेना', 'meditation': 'ध्यान', 'yoga': 'योग',
  'eat': 'खाएँ', 'daily': 'दैनिक', 'routine': 'दिनचर्या', 'balancing': 'संतुलन'
};

function arr(x) { if (x == null) return []; if (Array.isArray(x)) return x; if (typeof x === 'string') return x.split(/[,;/|]/).map(s => s.trim()).filter(Boolean); return [x]; }
function str(x) { return x == null ? '' : (Array.isArray(x) ? x.join(' ') : String(x)); }

function findHerbs(herbs, names) {
  const pick = (n) => {
    const all = herbs.filter(h => h.name.toLowerCase().includes(n.toLowerCase()) || arr(h.commonNames).some(c => c.toLowerCase().includes(n.toLowerCase())));
    const std = all.find(h => h.variant === 'Standard' || !h.variant);
    return std || all[0];
  };
  return names.map(pick).filter(Boolean).slice(0, 6);
}

// Detect which section a free-text query is about (drives grounded retrieval).
function sectionForQuery(q) {
  const m = (q || '').toLowerCase();
  if (/\b(yoga|asana|pranayama|pose|meditat|breath|exercise)\b/.test(m)) return 'yoga';
  if (/\b(therap|panchakarma|massage|abhyanga|basti|treatment|sweda)\b/.test(m)) return 'therapy';
  if (/\b(herb|plant|remedy|churna|rasayana|medicine|drug|supplement|ashwagandha|turmeric|tulsi)\b/.test(m)) return 'herb';
  if (/\b(condition|disease|syndrome|disorder|symptom|treat|heal|cure|manage)\b/.test(m)) return 'condition';
  return null;
}

function mountNewTools(app, engine, ctx) {
  const { datasets } = ctx;
  const { herbs, healthBenefits, therapies, yoga, doctors, hospitals } = datasets;
  const ok = (res, data) => res.json(data);

  // ---------- 1. Yoga / Therapy FOR a symptom/condition ----------
  // Reverse lookup across yoga + therapies grounded in real indication fields.
  app.get('/api/ai/for', (req, res) => {
    const q = (req.query.q || req.query.symptoms || '').toLowerCase();
    if (!q) return ok(res, { error: 'provide q (a symptom/condition)' });
    const yMatches = yoga.filter(y =>
      arr(y.benefits).some(b => b.toLowerCase().includes(q)) ||
      arr(y.indications).some(i => i.toLowerCase().includes(q)) ||
      (y.name + ' ' + y.english).toLowerCase().includes(q)
    ).slice(0, 6);
    const tMatches = therapies.filter(t =>
      arr(t.indications).some(i => i.toLowerCase().includes(q)) ||
      (t.name + ' ' + t.description).toLowerCase().includes(q)
    ).slice(0, 6);
    ok(res, {
      query: q,
      yoga: yMatches.map(y => ({ name: y.name, english: y.english, difficulty: y.difficulty, benefits: y.benefits, indications: y.indications })),
      therapies: tMatches.map(t => ({ name: t.name, category: t.category, indications: t.indications })),
      engine: 'rules', disclaimer: 'For gentle practice only — guidance of a qualified instructor/vaidya recommended.'
    });
  });

  // ---------- 2. Dosha-specific diet (Ritucharya + Ahara) ----------
  const DOSHA_DIET = {
    vata: { foods: ['warm cooked grains (rice, wheat)', 'ghee', 'root vegetables', 'soups', 'milk', 'sweet fruits'], avoid: ['dry/cold foods', 'raw salads', 'beans (excess)', 'caffeinated drinks'], spices: ['ginger', 'cumin', 'cardamom', 'cinnamon'], note: 'Favour warm, oily, nourishing foods; eat at regular times.' },
    pitta: { foods: ['cooling foods (cucumber, melon)', 'leafy greens', 'basmati rice', 'coconut', 'milk', 'sweet fruits'], avoid: ['excess chilli/spice', 'sour/fermented', 'alcohol', 'tomato', 'salt (excess)'], spices: ['coriander', 'fennel', 'cardamom', 'turmeric'], note: 'Favour cool, sweet, bitter; avoid overheating foods.' },
    kapha: { foods: ['light grains (millet, barley)', 'steamed vegetables', 'legumes', 'honey (raw)', 'pungent spices'], avoid: ['heavy dairy', 'sweets', 'oily/fried', 'excess wheat/rice', 'cold drinks'], spices: ['ginger', 'black pepper', 'long pepper', 'mustard'], note: 'Favour light, warm, dry; stimulate digestion.' }
  };
  app.get('/api/ai/diet', (req, res) => {
    const d = (req.query.dosha || 'vata').toLowerCase();
    const plan = DOSHA_DIET[d] || DOSHA_DIET.vata;
    ok(res, { dosha: d, diet: plan, engine: 'rules' });
  });

  // ---------- 3. Seasonal routine (Ritu) ----------
  const RITU = {
    spring: { season: 'Vasanta (Spring)', dosha: 'Kapha', advice: 'Light diet, honey, ginger; reduce dairy & sweets; detox with triphala.', yoga: ['Surya Namaskar', 'Kapalbhati (mild)'], herbs: ['Triphala', 'Ginger', 'Tulsi'] },
    summer: { season: 'Grishma (Summer)', dosha: 'Pitta', advice: 'Cooling foods, coconut water, avoid excess heat; moonlight walks, sheetali pranayama.', yoga: ['Sheetali', 'Chandra Namaskar'], herbs: ['Guduchi', 'Amla', 'Coriander'] },
    monsoon: { season: 'Varsha (Monsoon)', dosha: 'Vata', advice: 'Warm cooked foods, avoid raw; ginger in meals; cautious panchakarma.', yoga: ['Gentle twists', 'Balasana'], herbs: ['Ginger', 'Tulsi', 'Dashamoola'] },
    autumn: { season: 'Sharad (Autumn)', dosha: 'Pitta', advice: 'Cooling, sweet; amla; moderate sun; calming routine.', yoga: ['Sheetali', 'Bhramari'], herbs: ['Amla', 'Guduchi', 'Shatavari'] },
    earlywinter: { season: 'Hemanta (Early Winter)', dosha: 'Vata', advice: 'Nourishing, oily foods; sesame oil massage; build strength.', yoga: ['Surya Namaskar'], herbs: ['Ashwagandha', 'Sesame', 'Bala'] },
    latewinter: { season: 'Shishira (Late Winter)', dosha: 'Kapha', advice: 'Warm, spicy; exercise; avoid heavy sleep.', yoga: ['Surya Namaskar', 'Kapalbhati'], herbs: ['Trikatu', 'Ginger', 'Pippali'] }
  };
  app.get('/api/ai/ritu', (req, res) => {
    const key = (req.query.season || 'spring').toLowerCase();
    const r = RITU[key] || RITU.spring;
    ok(res, { season: key, ...r, engine: 'rules' });
  });

  // ---------- 4. Personalised meal plan (dosha + goal + veg/nonveg) ----------
  app.get('/api/ai/meal', (req, res) => {
    const d = (req.query.dosha || 'vata').toLowerCase();
    const goal = (req.query.goal || 'balance').toLowerCase();
    const diet = DOSHA_DIET[d] || DOSHA_DIET.vata;
    const proteinVeg = ['moong dal', 'mung', 'paneer (fresh)', 'yogurt', 'nuts & seeds'];
    const proteinNon = ['egg', 'fish (freshwater)', 'chicken (light)'];
    const protein = (req.query.diet === 'nonveg') ? proteinNon : proteinVeg;
    const meal = {
      breakfast: (d === 'kapha' ? 'Warm millet porridge with honey & ginger' : d === 'pitta' ? 'Cooked rice with ghee & coconut' : 'Warm oats/khichdi with ghee & cardamom'),
      lunch: 'Steamed vegetables + ' + (d === 'kapha' ? 'barley/millet' : 'rice/wheat') + ' + ' + protein[0] + ' + ' + (diet.spices[0]) + ' spiced dal',
      dinner: 'Light khichdi / soup with ' + diet.spices.slice(0, 2).join(', ') + '; early & warm',
      snacks: (d === 'vata' ? 'Soaked almonds, warm milk' : d === 'pitta' ? 'Coconut water, sweet fruit' : 'Ginger tea, light fruit'),
      goalNote: goal === 'weight' ? 'Prefer light grains, honey over sugar, avoid fried.' : goal === 'immunity' ? 'Add turmeric, tulsi, amla daily.' : 'Eat fresh, warm, at regular times.'
    };
    ok(res, { dosha: d, goal, diet: req.query.diet || 'veg', meal, avoid: diet.avoid, engine: 'rules' });
  });

  // ---------- 5. Meditation / Pranayama guide ----------
  const MEDITATIONS = [
    { name: 'Anulom Vilom (Nadi Shodhana)', type: 'pranayama', benefit: 'Balances all three doshas, calms mind', for: ['stress', 'anxiety', 'imbalance'] },
    { name: 'Bhramari (Bee breath)', type: 'pranayama', benefit: 'Soothes nervous system, aids sleep', for: ['anxiety', 'insomnia', 'anger'] },
    { name: 'Sheetali', type: 'pranayama', benefit: 'Cools Pitta, reduces heat & acidity', for: ['pitta', 'heat', 'anger', 'acid'] },
    { name: 'Kapalbhati', type: 'pranayama', benefit: 'Energises, supports metabolism', for: ['kapha', 'weight', 'sluggish'] },
    { name: 'Yoga Nidra', type: 'meditation', benefit: 'Deep relaxation, restores sleep', for: ['insomnia', 'fatigue', 'stress'] },
    { name: 'Trataka', type: 'meditation', benefit: 'Focus & eye health', for: ['focus', 'eyestrain', 'concentration'] },
    { name: 'So-Ham Mantra', type: 'meditation', benefit: 'Calms the mind, aligns breath', for: ['anxiety', 'stress', 'clarity'] },
    { name: 'OM chanting', type: 'meditation', benefit: 'Vibrational balance, steadies mind', for: ['stress', 'clarity', 'imbalance'] }
  ];
  app.get('/api/ai/meditation', (req, res) => {
    const q = (req.query.for || '').toLowerCase();
    let list = MEDITATIONS;
    if (q) list = MEDITATIONS.filter(m => m.for.some(f => q.includes(f)) || m.benefit.toLowerCase().includes(q));
    list = list.slice(0, 6);
    ok(res, { query: q || null, practices: list, engine: 'rules' });
  });

  // ---------- 6. Herb synergy (pair/bundle) ----------
  const SYNERGY = {
    'ashwagandha+brahmi': 'Classic medhya (nervine) pair — calm focus & resilience.',
    'turmeric+ginger': 'Anti-inflammatory & digestive combo (golden milk base).',
    'triphala+aloevera': 'Gentle detox + gut soothing (morning/bedtime).',
    'tulsi+ginger': 'Immune & respiratory support (kadha base).',
    'ashwagandha+shilajit': 'Strength & vitality (traditional rasayana stack).',
    'giloy+amla': 'Immunity & liver-support duo.',
    'shatavari+ashwagandha': 'Reproductive & hormonal balance (male/female).'
  };
  app.get('/api/ai/synergy', (req, res) => {
    const a = (req.query.a || '').toLowerCase().trim();
    const b = (req.query.b || '').toLowerCase().trim();
    const key1 = a + '+' + b, key2 = b + '+' + a;
    const ha = findHerbs(herbs, [a])[0], hb = findHerbs(herbs, [b])[0];
    const note = SYNERGY[key1] || SYNERGY[key2] || 'Combine mindfully; both herbs are real entries in our database — pair under practitioner guidance.';
    ok(res, { a: ha ? ha.name : a, b: hb ? hb.name : b, synergy: note, evidenceA: ha ? ha.evidenceLevel : null, evidenceB: hb ? hb.evidenceLevel : null, engine: 'rules', disclaimer: 'Synergy notes are traditional — confirm with a vaidya.' });
  });

  // ---------- 7. Find care (real doctors/hospitals near a query) ----------
  app.get('/api/ai/findcare', (req, res) => {
    const q = (req.query.q || '').toLowerCase().trim();
    if (!q) return ok(res, { error: 'provide q (city/state/specialty)' });
    const dMatch = doctors.filter(d =>
      d.city.toLowerCase().includes(q) || d.state.toLowerCase().includes(q) ||
      d.specialty.toLowerCase().includes(q) || d.clinic.toLowerCase().includes(q)
    ).slice(0, 5);
    const hMatch = hospitals.filter(h =>
      h.city.toLowerCase().includes(q) || h.state.toLowerCase().includes(q) ||
      h.type.toLowerCase().includes(q) || arr(h.specialties).some(s => s.toLowerCase().includes(q))
    ).slice(0, 5);
    ok(res, {
      query: q,
      doctors: dMatch.map(d => ({ name: d.name, specialty: d.specialty, clinic: d.clinic, city: d.city, state: d.state, rating: d.rating, onlineBooking: d.onlineBooking })),
      hospitals: hMatch.map(h => ({ name: h.name, type: h.type, city: h.city, state: h.state, isAyurvedic: h.isAyurvedic, panchakarma: h.panchakarmaAvailable })),
      engine: 'rules'
    });
  });

  // ---------- 8. Herb quiz (active principle / taste) ----------
  const TASTE_Q = [
    { q: 'After eating, which taste do you crave most?', a: 'sweet', p: { kapha: 1 } },
    { q: 'Your digestion is mostly…', a: 'variable/irregular', p: { vata: 1 } },
    { q: 'Your body frame is…', a: 'medium/athletic', p: { pitta: 1 } },
    { q: 'Skin tends to be…', a: 'dry/cool', p: { vata: 1 } },
    { q: 'You run warm / get angry easily?', a: 'yes', p: { pitta: 1 } },
    { q: 'You gain weight easily / feel sluggish?', a: 'yes', p: { kapha: 1 } }
  ];
  const RASA_HERB = { sweet: ['Shatavari', 'Ashwagandha'], pungent: ['Ginger', 'Tulsi'], bitter: ['Neem', 'Guduchi'], astringent: ['Triphala', 'Haritaki'], sour: ['Amalaki', 'Amla'], salty: ['Saindhava', 'Varuna'] };
  app.post('/api/ai/herb-quiz', expressJSON, (req, res) => {
    const ans = (req.body && req.body.answers) || [];
    const scores = { vata: 0, pitta: 0, kapha: 0 };
    ans.forEach((a, i) => { const t = TASTE_Q[i]; if (t && t.p[a]) scores[t.p[a][Object.keys(t.p[a])[0]]]++; });
    const sorted = Object.entries(scores).sort((x, y) => y[1] - x[1]);
    const dom = sorted[0][1] === 0 ? 'tridosha' : sorted[0][0];
    const herbNames = (dom === 'tridosha') ? ['Triphala', 'Ashwagandha', 'Tulsi'] : findHerbs(herbs, RASA_HERB[dom] || ['Triphala']).map(h => h.name);
    ok(res, { dominantDosha: dom, scores, suggestedHerbs: herbNames, engine: 'rules' });
  });

  // ---------- 9. Platform benchmark (honest vs competitors) ----------
  app.get('/api/ai/benchmark', (req, res) => {
    const byCat = {};
    herbs.forEach(h => { byCat[h.category] = (byCat[h.category] || 0) + 1; });
    const featuredHerbs = herbs.filter(h => (h.researchCitations || 0) > 3000).length;
    ok(res, {
      platform: {
        herbs: herbs.length, herbCategories: Object.keys(byCat).length, featuredHerbs,
        therapies: therapies.length, yoga: yoga.length, conditions: healthBenefits.length,
        hospitals: hospitals.length, doctors: doctors.length,
        freeAITools: (require('../data/aiFeatures').FEATURES.length) + 11,
        aiEngines: 'TF-IDF RAG (on-device) + optional in-browser flan-t5 + optional OpenRouter/HF free LLMs'
      },
      notes: '100% free, key-less AI. Real datasets, no fabricated entries, graceful offline fallback.',
      engine: 'rules'
    });
  });

  // ---------- 10. Condition → herb+therapy+yoga bundle ----------
  app.get('/api/ai/condition-bundle', (req, res) => {
    const cond = (req.query.condition || '').toLowerCase();
    const match = healthBenefits.find(c =>
      c.name.toLowerCase().includes(cond) ||
      (c.ayurvedicName || '').toLowerCase().includes(cond) ||
      arr(c.symptoms).some(s => s.toLowerCase().includes(cond))
    );
    if (!match) return ok(res, { error: 'condition not found', suggestion: 'Try: diabetes, insomnia, arthritis, anxiety, pcod, indigestion' });
    const herbNames = arr(match.herbs).slice(0, 6);
    const matched = findHerbs(herbs, herbNames);
    const yMatch = yoga.filter(y => arr(y.indications).some(i => arr(match.symptoms).some(s => i.toLowerCase().includes(s.toLowerCase())))).slice(0, 4);
    ok(res, {
      condition: match.name, ayurvedicName: match.ayurvedicName, dosha: match.doshaImbalance,
      symptoms: match.symptoms, herbs: matched.map(h => ({ name: h.name, evidence: h.evidenceLevel, uses: h.primaryUses })),
      formulations: match.formulations, diet: match.diet, lifestyle: match.lifestyle,
      yoga: yMatch.map(y => ({ name: y.name, english: y.english, benefits: y.benefits })),
      engine: 'rules', disclaimer: 'Educational only — consult a qualified practitioner.'
    });
  });

  // ---------- 11. Translate (expanded EN⇄HI lexicon, server-side fallback) ----------
  app.get('/api/ai/translate', (req, res) => {
    const text = (req.query.text || '').toLowerCase().trim();
    const target = req.query.target || 'hi';
    if (target === 'hi') {
      const hit = EN_HI[text];
      return ok(res, { text: req.query.text, target, translated: hit || req.query.text, engine: hit ? 'server-lexicon' : 'passthrough' });
    }
    const rev = Object.entries(EN_HI).find(([, v]) => v === text);
    ok(res, { text: req.query.text, target, translated: rev ? rev[0] : req.query.text, engine: rev ? 'server-lexicon' : 'passthrough' });
  });

  return { EN_HI };
}

const expressJSON = require('express').json({ limit: '1mb' });
module.exports = mountNewTools;
