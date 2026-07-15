// ============================================================
//  AyurAI Features Registry — "infinite" free-AI feature hub.
//  ------------------------------------------------------------
//  This is the single source of truth for the AI Tools hub. Every AI
//  feature is ONE declarative entry here. The server exposes the whole
//  registry (so the UI auto-renders cards), and each entry maps to a
//  real, already-implemented backend endpoint in server.js (or a new
//  lightweight rule-based one). Adding a new free-AI tool = add ONE
//  entry here + ensure an endpoint exists — no UI rewrite needed.
//
//  ALL engines used are FREE and require NO paid key:
//   - on-device TF-IDF retrieval  (always available, offline)
//   - in-browser transformers.js LLM/NMT (ayurbrain.js)
//   - OpenRouter free models (only if OPENROUTER_API_KEY present)
//   - HuggingFace free inference (only if HF_TOKEN present)
//   - rule-based medical heuristics over REAL datasets (no LLM)
//  Nothing is fabricated: every answer is grounded in real platform data.
// ============================================================

const FEATURES = [
  {
    id: 'symptom-checker',
    title: '🩺 Symptom Checker',
    blurb: 'Describe symptoms, get grounded Ayurvedic condition matches + herb/yoga leads from real data.',
    engine: 'retrieval+llm',
    endpoint: '/api/ai-diagnose',
    fields: [
      { key: 'symptoms', label: 'Symptoms', type: 'textarea', placeholder: 'e.g. joint pain, fatigue, frequent urination' }
    ],
    category: 'Diagnose'
  },
  {
    id: 'personalized-plan',
    title: '🌿 Personalized Plan',
    blurb: 'Build a dosha-aware daily plan (herbs, diet, yoga) from your symptoms.',
    engine: 'retrieval+llm',
    endpoint: '/api/ai/plan',
    fields: [
      { key: 'dosha', label: 'Dosha', type: 'select', options: ['', 'vata', 'pitta', 'kapha'] },
      { key: 'symptoms', label: 'Symptoms', type: 'text', placeholder: 'low appetite, bloating' }
    ],
    category: 'Plan'
  },
  {
    id: 'urgency-triage',
    title: '🚨 Urgency Triage',
    blurb: 'Red-flag screen: tells you when to seek emergency care vs self-care.',
    engine: 'rules',
    endpoint: '/api/ai/triage',
    fields: [{ key: 'text', label: 'Symptoms', type: 'text', placeholder: 'chest pain, high fever' }],
    category: 'Safety'
  },
  {
    id: 'herb-drug',
    title: '💊 Herb–Drug Check',
    blurb: 'Safety check for interactions between an Ayurvedic herb and a conventional drug.',
    engine: 'rules',
    endpoint: '/api/ai/interactions',
    fields: [
      { key: 'herb', label: 'Herb', type: 'text', placeholder: 'turmeric' },
      { key: 'drug', label: 'Drug', type: 'text', placeholder: 'warfarin' }
    ],
    category: 'Safety'
  },
  {
    id: 'vitals-risk',
    title: '📈 Vitals Risk Screen',
    blurb: 'BMI / glucose-based risk screening across real condition data.',
    engine: 'rules',
    endpoint: '/api/ai/predict',
    fields: [
      { key: 'weight', label: 'Weight (kg)', type: 'number' },
      { key: 'height', label: 'Height (cm)', type: 'number' },
      { key: 'glucose', label: 'Glucose (mg/dL)', type: 'number' }
    ],
    category: 'Screen'
  },
  {
    id: 'dosha-routine',
    title: '☀️ Dosha Daily Routine',
    blurb: 'A Dinacharya (daily routine) tailored to your dominant dosha.',
    engine: 'rules',
    endpoint: '/api/ai/routine',
    fields: [{ key: 'dosha', label: 'Dosha', type: 'select', options: ['', 'vata', 'pitta', 'kapha'] }],
    category: 'Plan'
  },
  {
    id: 'dosha-quiz',
    title: '🧬 Dosha Quiz (Prakriti)',
    blurb: 'Find your mind-body constitution and get matched real herbs/yoga/therapies.',
    engine: 'rules',
    endpoint: '/api/wellness/dosha',
    fields: [{ key: 'answers', label: 'Quiz answers', type: 'hidden' }],
    category: 'Plan'
  },
  {
    id: 'ai-chat',
    title: '🤖 AyurAI Chat',
    blurb: 'Ask anything; grounded answers from the 100k+ doc retrieval index.',
    engine: 'retrieval+llm',
    endpoint: '/api/ai/chat',
    fields: [{ key: 'message', label: 'Ask AyurAI', type: 'textarea', placeholder: 'Best herbs for sleep and anxiety?' }],
    category: 'Assist'
  },
  {
    id: 'herb-compare',
    title: '⚖️ Herb Compare',
    blurb: 'Compare two herbs side-by-side (properties, uses, evidence).',
    engine: 'rules',
    endpoint: '/api/ai/compare',
    fields: [
      { key: 'a', label: 'Herb A', type: 'text', placeholder: 'ashwagandha' },
      { key: 'b', label: 'Herb B', type: 'text', placeholder: 'brahmi' }
    ],
    category: 'Compare'
  },
  {
    id: 'recipe',
    title: '🍲 Remedy Recipe',
    blurb: 'A classical preparation recipe for a herb or condition.',
    engine: 'rules',
    endpoint: '/api/ai/recipe',
    fields: [{ key: 'herb', label: 'Herb / Condition', type: 'text', placeholder: 'tulsi' }],
    category: 'Plan'
  },
  {
    id: 'home-remedy',
    title: '🩹 Home Remedy',
    blurb: 'Safe home remedies for common ailments from real herb data.',
    engine: 'rules',
    endpoint: '/api/ai/remedy',
    fields: [{ key: 'condition', label: 'Condition', type: 'text', placeholder: 'cough' }],
    category: 'Plan'
  },
  {
    id: 'report-explainer',
    title: '📄 Report Explainer',
    blurb: 'Plain-language explanation of a lab/health report value.',
    engine: 'retrieval+llm',
    endpoint: '/api/ai/report',
    fields: [{ key: 'report', label: 'Paste report text', type: 'textarea', placeholder: 'HbA1c 7.2%, TSH 5.1...' }],
    category: 'Assist'
  },
  {
    id: 'universal-search',
    title: '🔎 Universal Health Search',
    blurb: 'One box → herbs, conditions, therapies, hospitals, yoga from across the platform.',
    engine: 'retrieval',
    endpoint: '/api/ai/universal',
    fields: [{ key: 'query', label: 'Search', type: 'text', placeholder: 'diabetes metabolism' }],
    category: 'Assist'
  },
  {
    id: 'live-summary',
    title: '🌐 Live Web Summary',
    blurb: 'Real Wikipedia extract for any herb/condition/topic (keyless).',
    engine: 'web',
    endpoint: '/api/ai/summarize',
    fields: [{ key: 'topic', label: 'Topic', type: 'text', placeholder: 'Ashwagandha' }],
    category: 'Assist'
  },
  {
    id: 'translate',
    title: '🌍 Translate (EN⇄HI)',
    blurb: 'Free in-browser NMT or server lexicon to translate health text.',
    engine: 'nmt',
    endpoint: '/api/ai/translate',
    fields: [
      { key: 'text', label: 'Text', type: 'text', placeholder: 'Take with warm water' },
      { key: 'target', label: 'Target', type: 'select', options: ['hi', 'en'] }
    ],
    category: 'Assist'
  },
  {
    id: 'herb-conditions',
    title: '🔁 Herb → Conditions',
    blurb: 'Reverse lookup: what conditions a herb traditionally addresses.',
    engine: 'rules',
    endpoint: '/api/herb-conditions',
    fields: [{ key: 'herb', label: 'Herb', type: 'text', placeholder: 'giloy' }],
    category: 'Lookup'
  },
  {
    id: 'engine-status',
    title: '⚙️ Engine Status',
    blurb: 'Live view of which free AI engines are active right now.',
    engine: 'status',
    endpoint: '/api/ai/engines',
    fields: [],
    category: 'Assist'
  },

  // ---- Topic-based recommendation tools (one grounded endpoint, many tools) ----
  { id: 'sleep', title: '😴 Sleep & Insomnia', blurb: 'Real herbs, yoga & routines for better sleep — grounded in platform data.', engine: 'rules', endpoint: '/api/ai/recommend', fields: [{ key: 'topic', label: 'Focus', type: 'hidden' }], topic: 'sleep', category: 'By Condition' },
  { id: 'immunity', title: '🛡️ Immunity Booster', blurb: 'Ayurvedic rasayana & herbs to build natural immunity.', engine: 'rules', endpoint: '/api/ai/recommend', fields: [{ key: 'topic', label: 'Focus', type: 'hidden' }], topic: 'immunity', category: 'By Condition' },
  { id: 'pcod', title: '🌸 PCOD / PCOS Care', blurb: 'Herbs, therapies & yoga traditionally used for hormonal balance.', engine: 'rules', endpoint: '/api/ai/recommend', fields: [{ key: 'topic', label: 'Focus', type: 'hidden' }], topic: 'pcod', category: 'By Condition' },
  { id: 'weight', title: '⚖️ Weight & Metabolism', blurb: 'Real herbs & routines for healthy weight management.', engine: 'rules', endpoint: '/api/ai/recommend', fields: [{ key: 'topic', label: 'Focus', type: 'hidden' }], topic: 'weight', category: 'By Condition' },
  { id: 'digestion', title: '🍽️ Digestion & Gut', blurb: 'Herbs & formulations for digestion, acidity & gut health.', engine: 'rules', endpoint: '/api/ai/recommend', fields: [{ key: 'topic', label: 'Focus', type: 'hidden' }], topic: 'digestion', category: 'By Condition' },
  { id: 'detox', title: '🧹 Detox & Panchakarma', blurb: 'Cleansing routines & therapies from classical Ayurveda.', engine: 'rules', endpoint: '/api/ai/recommend', fields: [{ key: 'topic', label: 'Focus', type: 'hidden' }], topic: 'detox', category: 'By Condition' },
  { id: 'stress', title: '🧘 Stress & Anxiety', blurb: 'Herbs, pranayama & meditations for calm and focus.', engine: 'rules', endpoint: '/api/ai/recommend', fields: [{ key: 'topic', label: 'Focus', type: 'hidden' }], topic: 'stress', category: 'By Condition' },
  { id: 'skin', title: '✨ Skin & Hair', blurb: 'Herbs & external therapies for skin and hair health.', engine: 'rules', endpoint: '/api/ai/recommend', fields: [{ key: 'topic', label: 'Focus', type: 'hidden' }], topic: 'skin', category: 'By Condition' },
  { id: 'joints', title: '🦴 Joint & Arthritis', blurb: 'Herbs, oils & yoga for joint pain and mobility.', engine: 'rules', endpoint: '/api/ai/recommend', fields: [{ key: 'topic', label: 'Focus', type: 'hidden' }], topic: 'joint', category: 'By Condition' },
  { id: 'diabetes', title: '🩸 Sugar / Diabetes', blurb: 'Traditional herbs & diet for metabolic support.', engine: 'rules', endpoint: '/api/ai/recommend', fields: [{ key: 'topic', label: 'Focus', type: 'hidden' }], topic: 'diabetes', category: 'By Condition' },
  { id: 'heart', title: '❤️ Heart & Circulation', blurb: 'Herbs & lifestyle for cardiovascular wellness.', engine: 'rules', endpoint: '/api/ai/recommend', fields: [{ key: 'topic', label: 'Focus', type: 'hidden' }], topic: 'heart', category: 'By Condition' },
  { id: 'child', title: '🧒 Child & Family Health', blurb: 'Gentle Ayurvedic care for children and family.', engine: 'rules', endpoint: '/api/ai/recommend', fields: [{ key: 'topic', label: 'Focus', type: 'hidden' }], topic: 'child', category: 'By Condition' },
  { id: 'seasonal', title: '🌞 Seasonal Routine (Ritu)', blurb: 'Dinacharya & diet tuned to the season and your dosha.', engine: 'rules', endpoint: '/api/ai/recommend', fields: [{ key: 'topic', label: 'Focus', type: 'hidden' }], topic: 'seasonal', category: 'By Condition' },

  // ---- NEW FREE-AI TOOLS (infinite hub keeps growing) ----
  { id: 'medicine-finder', title: '💊 Medicine Finder', blurb: 'Find a real classical Ayurvedic formulation for your need (immunity, sleep, digestion...).', engine: 'rules', endpoint: '/api/ai/recommend', fields: [{ key: 'topic', label: 'Focus', type: 'hidden' }], topic: 'medicine', category: 'By Medicine' },
  { id: 'herb-to-medicine', title: '🌿→💊 Herb → Medicine', blurb: 'Given a herb, show which classical medicines contain it.', engine: 'rules', endpoint: '/api/ai/herb-medicines', fields: [{ key: 'herb', label: 'Herb', type: 'text', placeholder: 'ashwagandha' }], category: 'By Medicine' },
  { id: 'pregnancy-safe', title: '🤰 Pregnancy-Safe', blurb: 'Herbs & routines generally considered safe in pregnancy (with cautions).', engine: 'rules', endpoint: '/api/ai/recommend', fields: [{ key: 'topic', label: 'Focus', type: 'hidden' }], topic: 'pregnancy', category: 'By Condition' },
  { id: 'kids', title: '🧒 Kids & Family', blurb: 'Gentle Ayurvedic care for children — herbs, foods & routines.', engine: 'rules', endpoint: '/api/ai/recommend', fields: [{ key: 'topic', label: 'Focus', type: 'hidden' }], topic: 'child', category: 'By Condition' },
  { id: 'elderly', title: '🧓 Elder Care (Vriddha)', blurb: 'Rasayana & gentle support for healthy ageing.', engine: 'rules', endpoint: '/api/ai/recommend', fields: [{ key: 'topic', label: 'Focus', type: 'hidden' }], topic: 'elderly', category: 'By Condition' },
  { id: 'travel', title: '✈️ Travel Wellness', blurb: 'Herbs & tips for digestion, immunity & jet-lag on the move.', engine: 'rules', endpoint: '/api/ai/recommend', fields: [{ key: 'topic', label: 'Focus', type: 'hidden' }], topic: 'travel', category: 'By Condition' },
  { id: 'breath', title: '🫁 Breath & Pranayama', blurb: 'Real pranayama techniques for calm, energy & lung health.', engine: 'rules', endpoint: '/api/ai/recommend', fields: [{ key: 'topic', label: 'Focus', type: 'hidden' }], topic: 'breath', category: 'By Condition' },
  { id: 'nadi', title: '💓 Pulse (Nadi) Guide', blurb: 'Understand the three dosha pulses & what an Ayurvedic exam checks.', engine: 'rules', endpoint: '/api/ai/recommend', fields: [{ key: 'topic', label: 'Focus', type: 'hidden' }], topic: 'nadi', category: 'Lookup' },
  { id: 'food-tip', title: '🍽️ Food & Diet Tip', blurb: 'A dosha-friendly food/diet suggestion grounded in Ayurvedic principles.', engine: 'rules', endpoint: '/api/ai/recommend', fields: [{ key: 'topic', label: 'Focus', type: 'hidden' }], topic: 'diet', category: 'Plan' },
  { id: 'first-aid', title: '🚑 Home First-Aid', blurb: 'Safe kitchen/kit Ayurvedic first-aid for minor issues (with red-flag cautions).', engine: 'rules', endpoint: '/api/ai/recommend', fields: [{ key: 'topic', label: 'Focus', type: 'hidden' }], topic: 'firstaid', category: 'Safety' },

  // ---- NEW INFINITE FREE-AI TOOLS (Batch 2) — grounded in real datasets ----
  { id: 'for-symptom', title: '🎯 Yoga & Therapy FOR…', blurb: 'Reverse-lookup: real yoga asanas & therapies that address a symptom/condition.', engine: 'rules', endpoint: '/api/ai/for', fields: [{ key: 'q', label: 'Symptom / condition', type: 'text', placeholder: 'back pain' }], category: 'Lookup' },
  { id: 'dosha-diet', title: '🍎 Dosha Diet (Ahara)', blurb: 'Foods to favour & avoid for your dominant dosha (Vata/Pitta/Kapha).', engine: 'rules', endpoint: '/api/ai/diet', fields: [{ key: 'dosha', label: 'Dosha', type: 'select', options: ['', 'vata', 'pitta', 'kapha'] }], category: 'Plan' },
  { id: 'seasonal', title: '🌦️ Seasonal Routine (Ritu)', blurb: 'Dinacharya & diet tuned to the Indian season and its dominant dosha.', engine: 'rules', endpoint: '/api/ai/ritu', fields: [{ key: 'season', label: 'Season', type: 'select', options: ['spring', 'summer', 'monsoon', 'autumn', 'earlywinter', 'latewinter'] }], category: 'Plan' },
  { id: 'meal-plan', title: '🍽️ Meal Planner', blurb: 'A dosha + goal aware daily meal plan (veg / non-veg) from Ayurvedic principles.', engine: 'rules', endpoint: '/api/ai/meal', fields: [{ key: 'dosha', label: 'Dosha', type: 'select', options: ['', 'vata', 'pitta', 'kapha'] }, { key: 'goal', label: 'Goal', type: 'select', options: ['balance', 'weight', 'immunity', 'sleep'] }, { key: 'diet', label: 'Diet', type: 'select', options: ['veg', 'nonveg'] }], category: 'Plan' },
  { id: 'meditation', title: '🧘 Meditation & Pranayama', blurb: 'Real breathing & meditation practices matched to what you want to calm.', engine: 'rules', endpoint: '/api/ai/meditation', fields: [{ key: 'for', label: 'For', type: 'text', placeholder: 'stress, sleep, focus' }], category: 'Plan' },
  { id: 'synergy', title: '🔗 Herb Synergy', blurb: 'How two real herbs pair together (traditional combos).', engine: 'rules', endpoint: '/api/ai/synergy', fields: [{ key: 'a', label: 'Herb A', type: 'text', placeholder: 'ashwagandha' }, { key: 'b', label: 'Herb B', type: 'text', placeholder: 'brahmi' }], category: 'Compare' },
  { id: 'find-care', title: '📍 Find Care Near Me', blurb: 'Real doctors & Ayurvedic hospitals matching a city/state/specialty.', engine: 'rules', endpoint: '/api/ai/findcare', fields: [{ key: 'q', label: 'City / State / Specialty', type: 'text', placeholder: 'Kerala panchakarma' }], category: 'Lookup' },
  { id: 'herb-quiz', title: '🌿 Herb Quiz', blurb: 'Answer a few taste/body questions → herbs that suit your constitution.', engine: 'rules', endpoint: '/api/ai/herb-quiz', fields: [{ key: 'answers', label: 'Answers', type: 'hidden' }], category: 'Plan' },
  { id: 'condition-bundle', title: '🎁 Condition Care Bundle', blurb: 'Full Ayurvedic bundle for a condition: herbs + formulations + diet + yoga.', engine: 'rules', endpoint: '/api/ai/condition-bundle', fields: [{ key: 'condition', label: 'Condition', type: 'text', placeholder: 'diabetes' }], category: 'Lookup' },
  { id: 'benchmark', title: '📊 Platform Benchmark', blurb: 'Honest count of our real data + free-AI tool coverage vs competitors.', engine: 'rules', endpoint: '/api/ai/benchmark', fields: [], category: 'Assist' },
  { id: 'translate-hi', title: '🌍 Translate (EN⇄HI)', blurb: 'Free server lexicon + in-browser NMT to translate health text.', engine: 'nmt', endpoint: '/api/ai/translate', fields: [{ key: 'text', label: 'Text', type: 'text', placeholder: 'take with warm water' }, { key: 'target', label: 'Target', type: 'select', options: ['hi', 'en'] }], category: 'Assist' },

  // ---- WORLD-CLASS FREE-AI TOOLS (Batch 3) — features competitors lack, 100% free ----
  { id: 'recipe-gen', title: '🍳 Ayurvedic Recipe Gen', blurb: 'Real dishes from a condition or dosha’s traditional diet plan.', engine: 'rules', endpoint: '/api/ai/recipe-gen', fields: [{ key: 'condition', label: 'Condition / Dosha', type: 'text', placeholder: 'diabetes' }, { key: 'goal', label: 'Goal', type: 'select', options: ['balance', 'immunity', 'weight', 'sleep'] }], category: 'Plan' },
  { id: 'dosha-quiz-full', title: '🧬 Full Dosha Quiz (12 Q)', blurb: 'A proper Prakriti assessment → constitution + routine + herbs + yoga.', engine: 'rules', endpoint: '/api/ai/dosha-quiz-full', fields: [{ key: 'answers', label: 'Answers', type: 'hidden' }], category: 'Plan' },
  { id: 'triage-full', title: '🚦 Red/Amber/Green Triage', blurb: 'Instant urgency level with clear emergency vs self-care advice.', engine: 'rules', endpoint: '/api/ai/triage-full', fields: [{ key: 'text', label: 'Symptoms', type: 'text', placeholder: 'chest pain, high fever' }], category: 'Safety' },
  { id: 'nearme', title: '📍 Near-Me Finder', blurb: 'Ranked real doctors & hospitals near a city/state — by relevance + rating.', engine: 'rules', endpoint: '/api/nearme', fields: [{ key: 'city', label: 'City', type: 'text', placeholder: 'Kerala' }, { key: 'state', label: 'State', type: 'text', placeholder: 'Kerala' }, { key: 'specialty', label: 'Specialty', type: 'text', placeholder: 'Panchakarma' }], category: 'Lookup' },
  { id: 'interactions-x', title: '💊 Interaction Checker+', blurb: 'Expanded herb–drug interaction lexicon (15+ herbs, free).', engine: 'rules', endpoint: '/api/ai/interactions-x', fields: [{ key: 'herb', label: 'Herb', type: 'text', placeholder: 'ashwagandha' }, { key: 'drug', label: 'Drug', type: 'text', placeholder: 'warfarin' }], category: 'Safety' },
  { id: 'prakriti-bundle', title: '🌟 Prakriti Routine', blurb: 'Full daily routine bundle for your dosha: diet + yoga + herbs.', engine: 'rules', endpoint: '/api/ai/prakriti-bundle', fields: [{ key: 'dosha', label: 'Dosha', type: 'select', options: ['', 'vata', 'pitta', 'kapha'] }], category: 'Plan' },
  { id: 'tts', title: '🔊 Read Aloud (TTS)', blurb: 'Free in-browser text-to-speech — AyurAI reads any answer aloud (no API).', engine: 'browser-tts', endpoint: null, fields: [], category: 'Assist' },
  { id: 'speech-input', title: '🎙️ Speak to AyurAI', blurb: 'Free Web Speech recognition — talk to the AI assistant instead of typing.', engine: 'browser-stt', endpoint: null, fields: [], category: 'Assist' },
  { id: 'export-report', title: '📄 Export Health Report', blurb: 'Free client-side printable/PDF export of any condition or plan.', engine: 'browser-print', endpoint: null, fields: [], category: 'Assist' }
];

// Lightweight categories for the hub UI.
const CATEGORIES = ['Diagnose', 'Plan', 'Safety', 'Screen', 'Assist', 'Compare', 'Lookup', 'By Condition', 'By Medicine'];

module.exports = { FEATURES, CATEGORIES };
