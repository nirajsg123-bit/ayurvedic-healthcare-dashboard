// ============================================================
//  AyurAI — WORLD-CLASS free-AI tools (additive, 100% free/no-key)
//  ------------------------------------------------------------
//  Features competitors don't offer as FREE, grounded in the
//  platform's REAL local datasets (no scraping, no API keys):
//    1) Recipe/Cooking generator  (real dishes from condition.diet)
//    2) Full 12-question Dosha Quiz -> constitution + routine bundle
//    3) Red/Amber/Green symptom triage
//    4) Ranked "near me" clinic/doctor finder (city/state + rating)
//    5) Expanded herb–drug interaction lexicon
//    6) Prakriti daily routine bundle (diet+yoga+herbs by dosha)
//  Every output is deterministic & grounded — never fabricated.
// ============================================================
function arr(x) { if (x == null) return []; if (Array.isArray(x)) return x; if (typeof x === 'string') return x.split(/[,;/|]/).map(s => s.trim()).filter(Boolean); return [x]; }
function findHerbs(herbs, names) {
  const pick = (n) => {
    const all = herbs.filter(h => h.name.toLowerCase().includes(n.toLowerCase()) || arr(h.commonNames).some(c => c.toLowerCase().includes(n.toLowerCase())));
    return all.find(h => h.variant === 'Standard' || !h.variant) || all[0];
  };
  return names.map(pick).filter(Boolean).slice(0, 6);
}

module.exports = function mountWorldClass(app, engine, ctx) {
  const { datasets } = ctx;
  const { herbs, healthBenefits, therapies, yoga, doctors, hospitals } = datasets;
  const ok = (res, data) => res.json(data);

  // ---------- 1. Recipe / cooking generator ----------
  // Turns a condition (or dosha/goal) into concrete, named dishes from the
  // REAL diet arrays in the dataset + a free recipe lexicon.
  const DISH = {
    'khichdi': 'Moong & rice khichdi with ghee, cumin & turmeric',
    'warm water': 'Warm lemon-water through the day',
    'ginger tea': 'Fresh ginger-tea with a pinch of black pepper',
    'buttermilk': 'Spiced buttermilk (chaas) with roasted cumin & mint',
    'warm cooked foods': 'Warm veg stew with ghee & mild spices',
    'vegetable soup': 'Seasonal veg soup with ginger & coriander',
    'cooked rice': 'Steamed rice with moong dal & ghee',
    'ghee': 'Ghee-roasted root vegetables',
    'leafy greens': 'Lightly sautéed greens with cumin & garlic',
    'basmati rice': 'Basmati rice with mung dal & turmeric',
    'coconut': 'Coconut-milk veg curry (mild)',
    'milk': 'Warm turmeric milk (golden milk) at bedtime',
    'sweet fruits': 'Stewed apple/pear with cardamom',
    'honey': 'Warm water with raw honey (morning)',
    'yogurt': 'Homemade curd with rice (noon)',
    'bitter gourd': 'Stir-fried bitter gourd (karela) with spices',
    'fenugreek': 'Fenugreek (methi) paratha or soaked methi water',
    'cinnamon': 'Cinnamon-infused warm water / oatmeal',
    'bitter foods': 'Bitter-leaf sauté (methi/dandelion) with ghee',
    'high fiber': 'Whole moong sprouts salad with lemon & cumin',
    'low glycemic': 'Millet (bajra/jowar) roti with veg',
    'turmeric': 'Golden milk (haldi doodh) at bedtime'
  };
  const UNIVERSAL = [
    'Moong & rice khichdi with ghee, cumin & turmeric',
    'Fresh ginger-tea with a pinch of black pepper',
    'Warm turmeric milk (golden milk) at bedtime',
    'Spiced buttermilk (chaas) with roasted cumin & mint',
    'Seasonal veg soup with ginger & coriander'
  ];
  app.get('/api/ai/recipe-gen', (req, res) => {
    const q = (req.query.condition || req.query.dosha || '').toLowerCase();
    const goal = (req.query.goal || 'balance').toLowerCase();
    const match = healthBenefits.find(c => c.name.toLowerCase().includes(q) || (c.ayurvedicName || '').toLowerCase().includes(q));
    const dietList = match ? arr(match.diet) : (req.query.dosha === 'pitta' ? ['coconut', 'leafy greens', 'basmati rice', 'milk'] : req.query.dosha === 'kapha' ? ['warm cooked foods', 'ginger tea', 'honey', 'vegetable soup'] : ['khichdi', 'ginger tea', 'ghee', 'warm water']);
    const dishes = [];
    dietList.forEach(item => {
      // match any DISH key that appears inside the diet item (substring)
      Object.keys(DISH).forEach(k => { if (item.toLowerCase().includes(k)) dishes.push(DISH[k]); });
    });
    const unique = [...new Set(dishes)];
    // ensure at least 4 real dishes
    while (unique.length < 4) { const u = UNIVERSAL[unique.length % UNIVERSAL.length]; if (!unique.includes(u)) unique.push(u); else unique.push(UNIVERSAL[(unique.length + 2) % UNIVERSAL.length]); }
    const herbNames = match ? findHerbs(herbs, arr(match.herbs).slice(0, 4)).map(h => h.name) : ['Turmeric', 'Ginger', 'Tulsi'];
    ok(res, {
      for: match ? match.name : (req.query.dosha || 'wellness'),
      goal, dishes: unique.slice(0, 6),
      supportiveHerbs: herbNames,
      note: 'Traditional Ayurvedic cooking — adapt to taste & practitioner advice.',
      engine: 'rules', disclaimer: 'Educational only — not a prescription.'
    });
  });

  // ---------- 2. Full Dosha Quiz (12 questions) ----------
  const QUIZ = [
    { id: 'frame', q: 'Your natural body frame is…', map: { 'thin/light': 'vata', 'medium/athletic': 'pitta', 'large/solid': 'kapha' } },
    { id: 'skin', q: 'Your skin tends to be…', map: { 'dry/cool': 'vata', 'warm/reddish': 'pitta', 'cool/oily': 'kapha' } },
    { id: 'hair', q: 'Your hair is typically…', map: { 'dry/frizzy': 'vata', 'fine/early grey': 'pitta', 'thick/oily': 'kapha' } },
    { id: 'temp', q: 'Your temperature preference…', map: { 'always cold': 'vata', 'always warm': 'pitta', 'tolerate cold well': 'kapha' } },
    { id: 'appetite', q: 'Your appetite is…', map: { 'variable': 'vata', 'strong/sharp': 'pitta', 'slow/steady': 'kapha' } },
    { id: 'digestion', q: 'Digestion is mostly…', map: { 'irregular': 'vata', 'fast/gassy': 'pitta', 'slow/heavy': 'kapha' } },
    { id: 'energy', q: 'Your energy comes in…', map: { 'bursts/tires fast': 'vata', 'steady/high': 'pitta', 'slow/enduring': 'kapha' } },
    { id: 'sleep', q: 'Your sleep is…', map: { 'light/fitful': 'vata', 'moderate': 'pitta', 'deep/long': 'kapha' } },
    { id: 'mind', q: 'Your mind is…', map: { 'quick/anxious': 'vata', 'focused/sharp': 'pitta', 'calm/slow': 'kapha' } },
    { id: 'speech', q: 'You speak…', map: { 'fast/many ideas': 'vata', 'precise/debate': 'pitta', 'slow/measured': 'kapha' } },
    { id: 'weight', q: 'Your weight is…', map: { 'hard to gain': 'vata', 'easy to gain/lose': 'pitta', 'easy to gain': 'kapha' } },
    { id: 'mood', q: 'Under stress you…', map: { 'worry/fear': 'vata', 'irritate/angry': 'pitta', 'withdraw/attach': 'kapha' } }
  ];
  const DOSHA_ROUTINE = {
    vata: 'Early to bed, warm cooked meals, daily abhyanga (oil massage), gentle yoga, keep warm, regular routine, avoid raw/cold foods.',
    pitta: 'Moderate exercise, cooling foods (cucumber, melon), avoid excess heat/spice, midday rest, coconut-oil massage, sheetali pranayama.',
    kapha: 'Wake early, vigorous exercise, light warm foods, dry massage, avoid daytime naps, stimulating spices, regular movement.'
  };
  app.post('/api/ai/dosha-quiz-full', expressJSON, (req, res) => {
    const ans = (req.body && req.body.answers) || [];
    const scores = { vata: 0, pitta: 0, kapha: 0 };
    ans.forEach((a, i) => { const t = QUIZ[i]; if (t && t.map[a]) scores[t.map[a]]++; });
    const sorted = Object.entries(scores).sort((x, y) => y[1] - x[1]);
    let prakriti, dual = null;
    if (sorted[0][1] === 0) prakriti = 'Tridosha (balanced)';
    else if (sorted[1][1] > 0 && (sorted[0][1] - sorted[1][1]) <= 2) { prakriti = sorted[0][0] + '-' + sorted[1][0]; dual = [sorted[0][0], sorted[1][0]]; }
    else prakriti = sorted[0][0];
    const main = dual ? dual[0] : (prakriti === 'Tridosha (balanced)' ? 'vata' : prakriti);
    const routine = DOSHA_ROUTINE[main];
    const herbNames = findHerbs(herbs, main === 'vata' ? ['Ashwagandha', 'Brahmi', 'Sesame'] : main === 'pitta' ? ['Guduchi', 'Amla', 'Coriander'] : ['Triphala', 'Ginger', 'Tulsi']).map(h => h.name);
    const yogaMatch = yoga.filter(y => main === 'vata' ? y.difficulty === 'Beginner' : main === 'kapha' ? (y.difficulty === 'Intermediate' || y.difficulty === 'Advanced') : true).slice(0, 4).map(y => y.name);
    ok(res, {
      prakriti, scores, routine,
      supportiveHerbs: herbNames, suggestedYoga: yogaMatch,
      note: 'Self-assessment only — consult a vaidya for a clinical Prakriti exam (Nadi pariksha).',
      engine: 'rules'
    });
  });
  // expose quiz questions to the UI
  app.get('/api/ai/dosha-quiz-questions', (req, res) => ok(res, { questions: QUIZ.map(q => ({ id: q.id, q: q.q, options: Object.values(q.map) })), engine: 'rules' }));

  // ---------- 3. Red / Amber / Green triage ----------
  const RED = ['chest pain', 'can\'t breathe', 'shortness of breath', 'unconscious', 'fainting', 'severe bleeding', 'stroke', 'slurred speech', 'blue lips', 'seizure', 'suicidal', 'anaphylaxis', 'not breathing', 'severe allergic'];
  const AMBER = ['high fever', 'confusion', 'severe abdominal pain', 'vomiting blood', 'blood in stool', 'racing heart', 'dehydration', 'numbness', 'weakness on one side', 'stiff neck', 'severe headache', 'difficulty swallowing'];
  app.get('/api/ai/triage-full', (req, res) => {
    const t = (req.query.text || '').toLowerCase();
    let level = 'green', advice = 'Likely self-care appropriate. Monitor; if symptoms worsen or persist >3 days, consult a practitioner.';
    if (RED.some(w => t.includes(w))) { level = 'red'; advice = '🚨 EMERGENCY — call 108 / go to the nearest ER now. Do not self-treat.'; }
    else if (AMBER.some(w => t.includes(w))) { level = 'amber'; advice = '🟠 URGENT — contact a physician or urgent care today. Do not rely on herbs alone.'; }
    ok(res, { level, advice, redFlags: RED.filter(w => t.includes(w)), engine: 'rules' });
  });

  // ---------- 4. Ranked "near me" finder ----------
  app.get('/api/nearme', (req, res) => {
    const city = (req.query.city || '').toLowerCase().trim();
    const state = (req.query.state || '').toLowerCase().trim();
    const specialty = (req.query.specialty || '').toLowerCase().trim();
    if (!city && !state) return ok(res, { error: 'provide city or state' });
    const score = (o) => {
      let s = 0;
      if (city && o.city.toLowerCase().includes(city)) s += 5;
      if (state && o.state.toLowerCase().includes(state)) s += 3;
      if (specialty && (o.specialty || '').toLowerCase().includes(specialty)) s += 4;
      s += (o.rating || 0) / 2; // rating nudge
      return s;
    };
    const dMatch = doctors.map(o => ({ ...o, _s: score(o) })).filter(o => o._s > 0).sort((a, b) => b._s - a._s).slice(0, 8);
    const hMatch = hospitals.map(o => ({ ...o, _s: score(o) })).filter(o => o._s > 0).sort((a, b) => b._s - a._s).slice(0, 8);
    ok(res, {
      city: city || null, state: state || null, specialty: specialty || null,
      doctors: dMatch.map(d => ({ name: d.name, specialty: d.specialty, clinic: d.clinic, city: d.city, state: d.state, rating: d.rating, onlineBooking: d.onlineBooking, score: Math.round(d._s * 10) / 10 })),
      hospitals: hMatch.map(h => ({ name: h.name, type: h.type, city: h.city, state: h.state, rating: h.rating, isAyurvedic: h.isAyurvedic, panchakarma: h.panchakarmaAvailable, score: Math.round(h._s * 10) / 10 })),
      engine: 'rules'
    });
  });

  // ---------- 5. Expanded herb–drug interactions ----------
  const KNOWN = {
    'turmeric': ['warfarin', 'aspirin', 'clopidogrel', 'blood thinner', 'nsaid'],
    'ashwagandha': ['thyroid', 'sedative', 'benzodiazepine', 'levothyroxine', 'immunosuppressant'],
    'ginger': ['blood thinner', 'warfarin', 'aspirin'],
    'ginkgo': ['aspirin', 'warfarin', 'ssri'],
    'neem': ['diabetes', 'insulin', 'metformin'],
    'giloy': ['diabetes', 'immunosuppressant', 'cyclosporine'],
    'licorice': ['diuretic', 'digoxin', 'blood pressure', 'warfarin'],
    'guggulu': ['thyroid', 'levothyroxine'],
    'triphala': ['diabetes', 'lithium'],
    'aloe': ['diabetes', 'digoxin', 'diuretic'],
    'fenugreek': ['diabetes', 'warfarin'],
    'tulsi': ['blood thinner', 'thyroid'],
    'brahmi': ['thyroid', 'sedative'],
    'shankhpushpi': ['sedative', 'thyroid'],
    'arjuna': ['blood pressure', 'beta blocker', 'digoxin']
  };
  app.get('/api/ai/interactions-x', (req, res) => {
    const herb = (req.query.herb || '').toLowerCase().trim();
    const drug = (req.query.drug || '').toLowerCase().trim();
    const risk = KNOWN[herb] && KNOWN[herb].some(d => drug.includes(d));
    const allHerbsHit = herb ? (KNOWN[herb] ? KNOWN[herb] : []) : [];
    ok(res, {
      herb, drug, risk: !!risk,
      advice: risk ? `⚠️ ${herb} may interact with ${drug}. Consult your physician before combining.` : `No widely-documented major interaction between ${herb} and ${drug} in our reference set — but always confirm with a practitioner.`,
      herbInteractsWith: allHerbsHit,
      engine: 'rules', disclaimer: 'Reference list is not exhaustive; verify with a pharmacist.'
    });
  });

  // ---------- 6. Prakriti daily routine bundle ----------
  app.get('/api/ai/prakriti-bundle', (req, res) => {
    const d = (req.query.dosha || 'vata').toLowerCase();
    const routine = DOSHA_ROUTINE[d] || DOSHA_ROUTINE.vata;
    const herbNames = findHerbs(herbs, d === 'vata' ? ['Ashwagandha', 'Brahmi', 'Sesame'] : d === 'pitta' ? ['Guduchi', 'Amla', 'Coriander'] : ['Triphala', 'Ginger', 'Tulsi']).map(h => h.name);
    const yogaMatch = yoga.filter(y => d === 'vata' ? y.difficulty === 'Beginner' : d === 'kapha' ? (y.difficulty === 'Intermediate' || y.difficulty === 'Advanced') : true).slice(0, 4).map(y => ({ name: y.name, english: y.english }));
    const dietFoods = d === 'vata' ? ['warm cooked grains', 'ghee', 'root veg', 'soups', 'milk'] : d === 'pitta' ? ['cooling foods', 'cucumber', 'melon', 'leafy greens', 'coconut'] : ['light grains', 'steamed veg', 'legumes', 'honey', 'pungent spices'];
    ok(res, { dosha: d, routine, herbs: herbNames, yoga: yogaMatch, diet: dietFoods, engine: 'rules' });
  });

  return {};
};

const expressJSON = require('express').json({ limit: '1mb' });
