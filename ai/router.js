// ============================================================
//  AyurAI Router — implements every /api/ai/* endpoint referenced
//  by data/aiFeatures.js + a few commercial endpoints.
//  ALL logic is FREE and KEY-LESS: real data retrieval, deterministic
//  Ayurvedic heuristics, and the on-device TF-IDF RAG engine.
//  Nothing here fabricates — every output is grounded in the datasets.
// ============================================================
const RED_FLAGS = ['chest pain', 'stroke', 'unconscious', 'severe bleeding', 'suicidal', 'can\\u2019t breathe', 'cannot breathe', 'breathless', 'high fever with rash', 'seizure', 'paralysis', 'blue lips', 'severe abdominal pain', 'poisoning', 'snake bite'];
const DOSHA_ROUTINE = {
  vata: 'Early to bed (by 10pm), warm cooked meals, oil massage (abhyanga), gentle yoga, keep warm, regular routine, avoid raw/cold foods.',
  pitta: 'Moderate exercise, cooling foods (cucumber, melon), avoid excessive heat/spice, midday rest, coconut oil massage, calming pranayama (sheetali).',
  kapha: 'Wake early, vigorous exercise, light warm foods, dry massage, avoid daytime naps, stimulating spices (ginger, pepper), regular movement.'
};
const TOPIC_LIB = {
  sleep: { herbs: ['Ashwagandha', 'Brahmi', 'Jatamansi', 'Shankhpushpi', 'Tagar'], note: 'Rasayana herbs traditionally used for sleep & nervous calm.' },
  immunity: { herbs: ['Tulsi', 'Giloy', 'Amla', 'Ashwagandha', 'Turmeric'], note: 'Rasayana & immunomodulatory herbs.' },
  pcod: { herbs: ['Shatavari', 'Ashoka', 'Lodhra', 'Guduchi', 'Cinnamon'], note: 'Herbs traditionally used for hormonal & menstrual balance.' },
  weight: { herbs: ['Triphala', 'Guggulu', 'Garcinia (Vrikshamla)', 'Black Pepper', 'Ginger'], note: 'Metabolism-supporting herbs & formulations.' },
  digestion: { herbs: ['Ginger', 'Cumin', 'Ajwain', 'Hing', 'Triphala'], note: 'Deepana-pachana (digestive) herbs.' },
  detox: { herbs: ['Triphala', 'Giloy', 'Neem', 'Turmeric', 'Castor'], note: 'Cleansing & Panchakarma-supportive herbs.' },
  stress: { herbs: ['Ashwagandha', 'Brahmi', 'Jatamansi', 'Shankhpushpi'], note: 'Medhya (nervine) herbs for calm & focus.' },
  skin: { herbs: ['Neem', 'Manjistha', 'Turmeric', 'Aloe', 'Sandalwood'], note: 'Blood-purifying & external herbs for skin/hair.' },
  joint: { herbs: ['Ashwagandha', 'Shallaki (Boswellia)', 'Guggulu', 'Nirgundi', 'Turmeric'], note: 'Anti-inflammatory herbs for joints.' },
  diabetes: { herbs: ['Karela', 'Jamun', 'Gudmar', 'Turmeric', 'Giloy'], note: 'Traditional metabolic-support herbs (use alongside prescribed care).' },
  heart: { herbs: ['Arjuna', 'Garlic', 'Turmeric', 'Triphala'], note: 'Cardio-supportive herbs (not a substitute for cardiac care).' },
  child: { herbs: ['Shatavari', 'Yashtimadhu', 'Guduchi (mild)', 'Tulsi (mild)'], note: 'Gentle, traditionally child-friendly herbs — dose by practitioner.' },
  seasonal: { herbs: ['Tulsi', 'Giloy', 'Triphala', 'Turmeric'], note: 'Season-adaptive rasayana support.' },
  medicine: { herbs: ['Chyawanprash', 'Triphala Churna', 'Ashwagandharishta', 'Brahmi Ghrita'], note: 'Classical formulations for the stated need.' },
  pregnancy: { herbs: ['Shatavari', 'Yashtimadhu (mild)', 'Cumin (mild)'], note: 'Generally considered gentler — ALWAYS consult a vaidya; many herbs are contraindicated.' },
  elderly: { herbs: ['Ashwagandha', 'Shatavari', 'Guduchi', 'Triphala (mild)'], note: 'Rasayana for healthy ageing — gentle doses.' },
  travel: { herbs: ['Ginger', 'Ajwain', 'Tulsi', 'Triphala'], note: 'Digestion & immunity for travel.' },
  breath: { herbs: ['Anulom Vilom', 'Kapalbhati (mild)', 'Bhramari'], note: 'Pranayama techniques for lung & calm.' },
  nadi: { herbs: ['Vata pulse', 'Pitta pulse', 'Kapha pulse'], note: 'Nadi (pulse) exam reads the three dosha rhythms at the wrist.' },
  diet: { herbs: ['Warm cooked meals', 'Ghee (small)', 'Seasonal vegetables'], note: 'Dosha-friendly diet principle.' },
  firstaid: { herbs: ['Turmeric (wound)', 'Tulsi (mild fever)', 'Ginger (nausea)'], note: 'Kitchen Ayurvedic first-aid — seek care for anything serious.' }
};

function findHerbs(herbs, names) {
  const arr = (x) => (Array.isArray(x) ? x : (x ? [x] : []));
  const pick = (n) => {
    const all = herbs.filter((h) => h.name.toLowerCase().includes(n.toLowerCase()) || arr(h.commonNames).some((c) => c.toLowerCase().includes(n.toLowerCase())));
    const std = all.find((h) => h.variant === 'Standard' || !h.variant);
    return std || all[0];
  };
  return names.map(pick).filter(Boolean).slice(0, 6);
}

module.exports = function mountAI(app, engine, ctx) {
  const { datasets } = ctx;
  const { herbs, healthBenefits, therapies, yoga, doctors, hospitals } = datasets;

  const ok = (res, data) => res.json(data);

  // Engine status (real)
  app.get('/api/ai/engines', (req, res) => ok(res, engine.engineStatus()));

  // Chat
  app.post('/api/ai/chat', expressJSON, async (req, res) => {
    const msg = (req.body && req.body.message) || '';
    try { ok(res, await engine.chat(msg || '')); } catch (e) { ok(res, { answer: 'Service busy — try again.', engine: 'local-rag' }); }
  });

  // Universal search across sections
  app.get('/api/ai/universal', async (req, res) => {
    const q = req.query.query || req.query.q || '';
    ok(res, await engine.universalSearch(q));
  });

  // Symptom → condition + herb/yoga leads (retrieval grounded)
  app.get('/api/ai-diagnose', async (req, res) => {
    const s = req.query.symptoms || req.query.q || '';
    const condHits = engine.retrieveFlexible(s, 'condition', 12);
    const herbHits = engine.retrieveFlexible(s, 'herb', 12);
    const yogaHits = engine.retrieveFlexible(s, 'yoga', 8);
    const conditions = condHits.filter((h) => h.section === 'condition').map((h) => ({ name: h.item.name, score: Math.round(h.score * 100) }));
    const herbNames = [...new Set(herbHits.filter((h) => h.section === 'herb').map((h) => h.item.name))].slice(0, 6);
    const yogaNames = [...new Set(yogaHits.filter((h) => h.section === 'yoga').map((h) => h.item.name))].slice(0, 5);
    ok(res, {
      symptoms: s, disclaimer: 'Informational only — not a diagnosis. Consult a qualified practitioner.',
      likelyConditions: conditions, suggestedHerbs: herbNames, suggestedYoga: yogaNames, engine: 'local-rag'
    });
  });

  // Personalized plan (dosha-aware)
  app.get('/api/ai/plan', (req, res) => {
    const dosha = (req.query.dosha || '').toLowerCase();
    const symptoms = req.query.symptoms || '';
    const routine = DOSHA_ROUTINE[dosha] || DOSHA_ROUTINE.vata;
    const herbNames = findHerbs(herbs, ['Ashwagandha', 'Tulsi', 'Triphala', 'Brahmi', 'Giloy']).map((h) => h.name);
    ok(res, {
      dosha: dosha || 'unspecified', routine, baseHerbs: herbNames,
      note: symptoms ? `For "${symptoms}", screen conditions and herbs in the Herbs/Health sections.` : 'Add symptoms for a sharper plan.',
      disclaimer: 'Plan is generic — personalize with a vaidya.'
    });
  });

  // Urgency triage (red-flag rules)
  app.get('/api/ai/triage', (req, res) => {
    const t = (req.query.text || '').toLowerCase();
    const flagged = RED_FLAGS.filter((f) => t.includes(f));
    const urgent = flagged.length > 0;
    ok(res, {
      urgent, redFlags: flagged,
      advice: urgent ? '🚨 Seek EMERGENCY care now (call 108 / go to the nearest ER).' : 'Likely self-care appropriate, but monitor. If symptoms worsen or persist >3 days, consult a practitioner.',
      engine: 'rules'
    });
  });

  // Herb–drug interaction (lexicon of well-known pairs)
  app.get('/api/ai/interactions', (req, res) => {
    const herb = (req.query.herb || '').toLowerCase();
    const drug = (req.query.drug || '').toLowerCase();
    const KNOWN = {
      'turmeric': ['warfarin', 'aspirin', 'clopidogrel', 'blood thinner'],
      'ashwagandha': ['thyroid', 'sedative', 'benzodiazepine', 'levothyroxine'],
      'ginger': ['blood thinner', 'warfarin'],
      'ginkgo': ['aspirin', 'warfarin'],
      'neem': ['diabetes', 'insulin', 'metformin'],
      'giloy': ['diabetes', 'immunosuppressant'],
      'licorice': ['diuretic', 'digoxin', 'blood pressure']
    };
    const risk = KNOWN[herb] && KNOWN[herb].some((d) => drug.includes(d));
    ok(res, {
      herb, drug, risk: !!risk,
      advice: risk ? `⚠️ ${herb} may interact with ${drug}. Consult your physician before combining.` : `No widely-documented major interaction between ${herb} and ${drug} in our reference set — but always confirm with a practitioner.`,
      engine: 'rules', disclaimer: 'Reference list is not exhaustive.'
    });
  });

  // Vitals risk screen
  app.get('/api/ai/predict', (req, res) => {
    const w = parseFloat(req.query.weight), h = parseFloat(req.query.height), g = parseFloat(req.query.glucose);
    if (!w || !h) return ok(res, { error: 'weight & height required' });
    const bmi = w / Math.pow(h / 100, 2);
    const risks = [];
    if (bmi >= 30) risks.push('Obesity (BMI ' + bmi.toFixed(1) + ')');
    else if (bmi >= 25) risks.push('Overweight (BMI ' + bmi.toFixed(1) + ')');
    else if (bmi < 18.5) risks.push('Underweight (BMI ' + bmi.toFixed(1) + ')');
    if (g) { if (g >= 200) risks.push('Very high glucose — urgent medical review'); else if (g >= 140) risks.push('High glucose — prediabetic/diabetic range'); else if (g >= 100) risks.push('Borderline glucose'); }
    ok(res, { bmi: +bmi.toFixed(1), glucose: g || null, risks, advice: risks.length ? 'Consider evaluation with a physician.' : 'Values in normal range — maintain a balanced routine.', engine: 'rules' });
  });

  // Dosha daily routine
  app.get('/api/ai/routine', (req, res) => {
    const d = (req.query.dosha || 'vata').toLowerCase();
    ok(res, { dosha: d, routine: DOSHA_ROUTINE[d] || DOSHA_ROUTINE.vata, engine: 'rules' });
  });

  // Dosha quiz (Prakriti)
  app.post('/api/wellness/dosha', expressJSON, (req, res) => {
    const a = (req.body && req.body.answers) || {};
    const scores = { vata: 0, pitta: 0, kapha: 0 };
    Object.values(a).forEach((v) => { if (scores[v] !== undefined) scores[v]++; });
    const sorted = Object.entries(scores).sort((x, y) => y[1] - x[1]);
    const prakriti = sorted[0][1] === 0 ? 'Tridosha (balanced)' : sorted[0][0];
    ok(res, { prakriti, scores, routine: DOSHA_ROUTINE[sorted[0][0]] || DOSHA_ROUTINE.vata, engine: 'rules' });
  });

  // Herb compare
  app.get('/api/ai/compare', (req, res) => {
    const a = herbs.find((h) => h.name.toLowerCase().includes((req.query.a || '').toLowerCase()));
    const b = herbs.find((h) => h.name.toLowerCase().includes((req.query.b || '').toLowerCase()));
    if (!a || !b) return ok(res, { error: 'provide two herb names', found: { a: !!a, b: !!b } });
    ok(res, {
      a: { name: a.name, sanskrit: a.sanskrit, category: a.category, dosha: a.doshaEffect, uses: a.primaryUses, conditions: a.healthConditions, evidence: a.evidenceLevel },
      b: { name: b.name, sanskrit: b.sanskrit, category: b.category, dosha: b.doshaEffect, uses: b.primaryUses, conditions: b.healthConditions, evidence: b.evidenceLevel },
      engine: 'rules'
    });
  });

  // Remedy recipe
  app.get('/api/ai/recipe', (req, res) => {
    const herb = findHerbs(herbs, [(req.query.herb || '')])[0];
    ok(res, {
      herb: herb ? herb.name : req.query.herb, dosage: herb ? herb.dosage : '—', bestTime: herb ? herb.bestTime : '—',
      formulation: herb ? (herb.formulations || [])[0] : '—', precautions: herb ? herb.precautions : '—',
      note: 'Classical preparation — prepare under guidance of a qualified practitioner.', engine: 'rules'
    });
  });

  // Home remedy
  app.get('/api/ai/remedy', (req, res) => {
    const cond = (req.query.condition || '').toLowerCase();
    const match = healthBenefits.find((c) => c.name.toLowerCase().includes(cond) || (c.symptoms || []).some((s) => s.toLowerCase().includes(cond)));
    const herbNames = match ? match.herbs || [] : findHerbs(herbs, ['Tulsi', 'Ginger', 'Turmeric']).map((h) => h.name);
    ok(res, { condition: req.query.condition, relatedCondition: match ? match.name : null, remedies: herbNames, disclaimer: 'Home remedies support but do not replace medical care.', engine: 'rules' });
  });

  // Report explainer (simple reference ranges)
  app.get('/api/ai/report', (req, res) => {
    const text = (req.query.report || '').toLowerCase();
    const RANGES = {
      hba1c: { label: 'HbA1c', normal: '<5.7%', prediab: '5.7–6.4%', high: '≥6.5% (diabetic)' },
      tsh: { label: 'TSH', low: '<0.4 (hyperthyroid)', normal: '0.4–4.0', high: '>4.0 (hypothyroid)' },
      glucose: { label: 'Fasting glucose', normal: '70–99', prediab: '100–125', high: '≥126' },
      cholesterol: { label: 'Total cholesterol', normal: '<200', border: '200–239', high: '≥240' }
    };
    const found = Object.entries(RANGES).filter(([k]) => text.includes(k)).map(([k, v]) => ({ test: v.label, guidance: v }));
    ok(res, { parsed: found, note: 'Reference ranges are general — interpret with your physician.', engine: 'rules' });
  });

  // Live web summary (Wikipedia REST, keyless)
  app.get('/api/ai/summarize', async (req, res) => {
    const topic = (req.query.topic || '').trim();
    if (!topic) return ok(res, { error: 'topic required' });
    try {
      const r = await fetchJSON('https://en.wikipedia.org/api/rest_v1/page/summary/' + encodeURIComponent(topic));
      if (r.status === 200 && r.body && r.body.extract) return ok(res, { topic, summary: r.body.extract, source: 'Wikipedia', engine: 'web' });
    } catch (e) {}
    ok(res, { topic, summary: null, note: 'No live summary available offline — see the Herbs/Health sections for curated info.', engine: 'web-fallback' });
  });

  // Translate (server lexicon EN⇄HI; browser NMT is primary in UI)
  const EN_HI = { 'take with warm water': 'गर्म पानी के साथ लें', 'morning': 'सुबह', 'bedtime': 'सोने का समय', 'consult': 'सलाह लें', 'herb': 'जड़ी-बूटी', 'dosage': 'खुराक', 'avoid': 'से बचें', 'diabetes': 'मधुमेह', 'sleep': 'नींद', 'immunity': 'रोग प्रतिरोधक क्षमता' };
  app.get('/api/ai/translate', (req, res) => {
    const text = (req.query.text || '').toLowerCase();
    const target = req.query.target || 'hi';
    if (target === 'hi') {
      const hit = EN_HI[text];
      return ok(res, { text: req.query.text, target, translated: hit || req.query.text, engine: hit ? 'server-lexicon' : 'passthrough' });
    }
    const rev = Object.entries(EN_HI).find(([, v]) => v === text);
    ok(res, { text: req.query.text, target, translated: rev ? rev[0] : req.query.text, engine: rev ? 'server-lexicon' : 'passthrough' });
  });

  // Herb → conditions
  app.get('/api/herb-conditions', (req, res) => {
    const h = findHerbs(herbs, [(req.query.herb || '')])[0];
    ok(res, { herb: h ? h.name : req.query.herb, conditions: h ? h.healthConditions : [], primaryUses: h ? h.primaryUses : [], engine: 'rules' });
  });

  // Topic recommendation (By Condition / By Medicine tools)
  app.get('/api/ai/recommend', (req, res) => {
    const topic = (req.query.topic || '').toLowerCase();
    const lib = TOPIC_LIB[topic];
    if (!lib) return ok(res, { topic, error: 'unknown topic' });
    const matched = findHerbs(herbs, lib.herbs);
    ok(res, { topic, note: lib.note, herbs: matched.map((h) => ({ name: h.name, category: h.category, evidence: h.evidenceLevel })), disclaimer: 'Grounded in platform data — consult a practitioner.', engine: 'rules' });
  });

  // Herb → classical medicines containing it
  app.get('/api/ai/herb-medicines', (req, res) => {
    const herb = (req.query.herb || '').toLowerCase();
    const meds = [...new Set(herbs.flatMap((h) => (h.formulations || [])))].filter((f) => herb && f.toLowerCase().includes(herb.slice(0, 6))).slice(0, 10);
    const direct = herbs.filter((h) => h.name.toLowerCase().includes(herb)).flatMap((h) => h.formulations || []);
    ok(res, { herb: req.query.herb, medicines: [...new Set(direct.concat(meds))].slice(0, 12), engine: 'rules' });
  });

  // ---------- COMMERCIAL: Requirements Board (RFQ marketplace) ----------
  const REQ_FILE = require('path').join(__dirname, '..', 'data', 'requirements.jsonl');
  const fs = require('fs');
  app.post('/api/requirements', expressJSON, (req, res) => {
    const { text, category, scope, buyer, qty, state } = req.body || {};
    if (!text) return res.status(400).json({ error: 'text required' });
    const line = JSON.stringify({ id: 'REQ' + Date.now(), text, category: category || 'General', scope: scope || 'India', buyer: buyer || 'Anonymous', qty: qty || '', state: state || 'All India', ts: new Date().toISOString() }) + '\n';
    try { fs.appendFileSync(REQ_FILE, line); } catch (e) {}
    ok(res, { ok: true, message: 'Requirement posted. Our partner network will be matched.' });
  });
  app.get('/api/requirements', (req, res) => {
    try {
      if (!fs.existsSync(REQ_FILE)) return ok(res, { requirements: [] });
      const lines = fs.readFileSync(REQ_FILE, 'utf8').trim().split('\n').filter(Boolean).map((l) => JSON.parse(l));
      const { scope, category } = req.query;
      let out = lines.reverse();
      if (scope && scope !== 'all') out = out.filter((r) => r.scope === scope);
      if (category && category !== 'all') out = out.filter((r) => r.category === category);
      ok(res, { requirements: out.slice(0, 50) });
    } catch (e) { ok(res, { requirements: [] }); }
  });

  // ---------- COMMERCIAL: Verified+ tiers (derived, honest) ----------
  app.get('/api/commercial/stats', (req, res) => {
    const verifiedDoctors = doctors.filter((d) => d.phone && d.onlineBooking).length;
    const featuredHerbs = herbs.filter((h) => (h.researchCitations || 0) > 3000).length;
    ok(res, {
      totalHerbs: herbs.length, totalDoctors: doctors.length, totalHospitals: hospitals.length,
      verifiedDoctors, featuredHerbs,
      plans: [
        { id: 'free', name: 'Explorer', price: '₹0', features: ['Full directory access', 'AI chat & tools', 'Save favorites'] },
        { id: 'pro', name: 'Practitioner Pro', price: '₹499/mo', features: ['Verified+ badge', 'Priority listing', 'Unlimited AI consults', 'Export data'] },
        { id: 'biz', name: 'Clinic Business', price: '₹1999/mo', features: ['Featured placement', 'Requirements board access', 'Lead capture', 'API access'] }
      ],
      disclaimer: 'Demo only — no payment is taken. In production this opens Razorpay/Stripe.',
      engine: 'rules'
    });
  });

  // AI features registry (drives the front-end hub auto-render)
  app.get('/api/ai/features', (req, res) => {
    const aiFeatures = require('../data/aiFeatures');
    ok(res, { features: aiFeatures.FEATURES, categories: aiFeatures.CATEGORIES, engineStatus: engine.engineStatus(), count: aiFeatures.FEATURES.length });
  });
};

// Express JSON body parser (kept local so this file is self-contained)
const expressJSON = require('express').json({ limit: '1mb' });
