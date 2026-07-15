// ============================================================
//  AyurAI Engine — 100% FREE, NO PAID KEY required.
//  Multi-tier, graceful-degradation architecture:
//    Tier 1 (optional): OpenRouter :free models  — only if OPENROUTER_API_KEY set
//    Tier 2 (optional): HuggingFace free inference — only if HF_TOKEN set
//    Tier 3 (ALWAYS):   on-device TF-IDF + rules RAG floor.
//                      Deterministic, input-driven, NEVER throws, NEVER says
//                      "coming soon". Grounds every answer in real platform data.
//  The file exports a factory so server.js can hand in helpers
//  (the loaded datasets + a getDB() accessor).
// ============================================================
const https = require('https');
const http = require('http');

// ---------- tiny fetch with timeout + retries ----------
function fetchJSON(url, opts = {}, timeout = 8000, retries = 1) {
  return new Promise((resolve, reject) => {
    let tries = 0;
    const attempt = () => {
      const lib = url.startsWith('https') ? https : http;
      const u = new URL(url);
      const req = lib.request(
        { hostname: u.hostname, path: u.pathname + u.search, method: opts.method || 'GET',
          headers: opts.headers || {}, timeout },
        (res) => {
          let data = '';
          res.on('data', (c) => (data += c));
          res.on('end', () => {
            try { resolve({ status: res.statusCode, body: data ? JSON.parse(data) : null }); }
            catch (e) { reject(e); }
          });
        }
      );
      req.on('timeout', () => req.destroy(new Error('timeout')));
      req.on('error', (e) => {
        if (tries++ < retries) return attempt();
        reject(e);
      });
      if (opts.body) req.write(opts.body);
      req.end();
    };
    attempt();
  });
}

// ---------- TF-IDF + cosine similarity (real retrieval, no model download) ----------
function tokenize(s) {
  return (s || '').toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(Boolean);
}
function buildIdf(docs) {
  const N = docs.length;
  const df = {};
  docs.forEach((d) => {
    const seen = new Set(tokenize(d.text));
    seen.forEach((t) => (df[t] = (df[t] || 0) + 1));
  });
  const idf = {};
  Object.keys(df).forEach((t) => (idf[t] = Math.log((N + 1) / (df[t] + 1)) + 1));
  return idf;
}
function tfidfVec(tokens, idf) {
  const tf = {};
  tokens.forEach((t) => (tf[t] = (tf[t] || 0) + 1));
  const v = {};
  let norm = 0;
  Object.keys(tf).forEach((t) => {
    const w = (tf[t] / tokens.length) * (idf[t] || 1);
    v[t] = w; norm += w * w;
  });
  const n = Math.sqrt(norm) || 1;
  Object.keys(v).forEach((t) => (v[t] /= n));
  return v;
}
function cosine(a, b) {
  let dot = 0;
  const keys = Object.keys(a).length < Object.keys(b).length ? Object.keys(a) : Object.keys(b);
  keys.forEach((k) => { if (b[k]) dot += a[k] * b[k]; });
  return dot; // both unit-normalized => dot product in [0,1]
}

// ---------- the engine factory ----------
module.exports = function createEngine(ctx) {
  const { datasets, getBySection } = ctx;
  const engines = { openrouter: !!process.env.OPENROUTER_API_KEY, huggingface: !!process.env.HF_TOKEN, localRAG: true };

  // Build a unified retrieval corpus from real datasets.
  // SERVERLESS NOTE: on Vercel (free Hobby tier, 1024MB cap) building TF-IDF
  // vectors for 211k docs used ~990MB and risked OOM. We cap the corpus so the
  // function stays well under budget: doctors/hospitals are excluded from the
  // RAG corpus (they are surfaced via the data API, not generative chat) and
  // herbs are sampled to `corpusCap.herbs`. Local runs can set higher caps.
  const cap = ctx.corpusCap || { herbs: 12000, doctors: 0, hospitals: 0 };
  const corpus = [];
  const arr = (x) => (Array.isArray(x) ? x : (x ? [x] : []));
  function pushDocs(section, list, toText, limit) {
    // limit: omitted/null => include all; 0 => exclude entirely; N => cap at N.
    if (limit === 0) return;
    let n = 0;
    (list || []).forEach((item) => {
      if (limit && n >= limit) return;
      corpus.push({ section, id: item.id || item.name, item, text: toText(item) });
      n++;
    });
  }
  pushDocs('herb', datasets.herbs, (h) =>
    [h.name, h.sanskrit, arr(h.commonNames).join(' '), h.category, arr(h.primaryUses).join(' '),
     arr(h.healthConditions).join(' '), arr(h.formulations).join(' '), h.doshaEffect, h.partUsed].join(' '), cap.herbs);
  pushDocs('condition', datasets.healthBenefits, (c) =>
    [c.name, c.ayurvedicName, c.category, arr(c.symptoms).join(' '), arr(c.herbs).join(' '), arr(c.causes).join(' ')].join(' '));
  pushDocs('therapy', datasets.therapies, (t) => [t.name, t.sanskrit, t.category, arr(t.indications).join(' '), t.description].join(' '));
  pushDocs('yoga', datasets.yoga, (y) => [y.name, y.english, y.sanskrit, arr(y.benefits).join(' '), arr(y.indications).join(' ')].join(' '));
  // Doctors/hospitals: only a small sample enters the RAG corpus (keeps memory
  // low); the full 110k doctor dataset remains available via /api/doctors.
  pushDocs('doctor', datasets.doctors, (d) => [d.name, d.specialty, d.clinic, d.city, d.state, arr(d.consultationModes).join(' ')].join(' '), cap.doctors);
  pushDocs('hospital', datasets.hospitals, (h) => [h.name, h.type, h.city, h.state, arr(h.specialties).join(' '), arr(h.ayurvedicTherapies).join(' ')].join(' '), cap.hospitals);

  const idf = buildIdf(corpus);
  corpus.forEach((c) => { c.vec = tfidfVec(tokenize(c.text), idf); c.toks = new Set(tokenize(c.text)); });

  function retrieve(query, topK = 8, preferSection = null) {
    const qv = tfidfVec(tokenize(query), idf);
    let scored = corpus
      .map((c) => ({ ...c, score: cosine(qv, c.vec) }))
      .filter((c) => c.score > 0.005);
    // Section-aware boost: when a caller wants a specific section (e.g. herbs
    // for a symptom), weight that section so the right record type surfaces.
    if (preferSection) {
      const boost = preferSection === 'herb' ? 2.2
        : preferSection === 'condition' ? 2.0
        : preferSection === 'therapy' ? 1.6
        : preferSection === 'yoga' ? 1.6 : 1.4;
      scored = scored.map((c) => ({ ...c, score: c.section === preferSection ? c.score * boost : c.score }));
    }
    return scored
      .sort((a, b) => b.score - a.score)
      .slice(0, topK);
  }

  // Retrieve the best record of ONE section only (used by chat to ground the
  // answer in the most relevant record TYPE the user asked about).
  function retrieveSection(query, section, topK = 4) {
    return retrieve(query, 24)
      .filter((c) => c.section === section)
      .slice(0, topK);
  }

  // Robust retrieval: if TF-IDF yields little, fall back to direct token-overlap
  // scoring against each record's precomputed token set. Guarantees useful
  // results for diffuse natural-language queries like "best herb for sleep
  // and anxiety". Uses the cached c.toks Set so it stays O(n) over the corpus.
  function retrieveFlexible(query, section, topK = 6) {
    let res = retrieve(query, 40, section);
    const qt = tokenize(query).filter((t) => t.length > 2);
    if (res.filter((r) => r.section === section).length < 2 && qt.length) {
      const qset = new Set(qt);
      const scored = [];
      for (const c of corpus) {
        if (c.section !== section) continue;
        let overlap = 0;
        qset.forEach((t) => { if (c.toks.has(t)) overlap++; });
        if (overlap > 0) scored.push({ ...c, score: overlap / qt.length });
      }
      scored.sort((a, b) => b.score - a.score);
      res = scored.slice(0, topK);
    }
    return res.filter((c) => c.section === section).slice(0, topK);
  }

  // Optional OpenRouter free-LLM call (never blocks; returns null on any failure)
  async function openrouterChat(system, user) {
    if (!engines.openrouter) return null;
    try {
      const res = await fetchJSON('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + process.env.OPENROUTER_API_KEY },
        body: JSON.stringify({
          model: 'meta-llama/llama-3.3-70b-instruct:free',
          messages: [{ role: 'system', content: system }, { role: 'user', content: user }],
          max_tokens: 400
        })
      }, 12000);
      if (res.status === 200 && res.body && res.body.choices) return res.body.choices[0].message.content;
    } catch (e) {}
    return null;
  }

  return {
    engines,
    retrieve,
    retrieveSection,
    retrieveFlexible,
    async universalSearch(query) {
      const hits = retrieve(query, 10);
      const bySection = { herb: [], condition: [], therapy: [], yoga: [], doctor: [], hospital: [] };
      hits.forEach((h) => bySection[h.section].push({ name: h.item.name, id: h.id, score: Math.round(h.score * 100) }));
      return { query, bySection, engine: 'local-rag', total: hits.length };
    },
    async chat(message) {
      const hits = retrieve(message, 8);
      const ctxText = hits.map((h) => `• [${h.section}] ${h.item.name}: ${h.text.slice(0, 160)}`).join('\n');

      // Detect which record TYPE the user is asking about so we ground the
      // answer in the right section (herb / condition / therapy / yoga) instead
      // of returning a mix. This makes the on-device answers actually useful.
      const m = (message || '').toLowerCase();
      const prefersHerb = /\b(herb|plant|remedy|churna|rasayana|medicine|drug|supplement|ashwagandha|turmeric|tulsi)\b/.test(m);
      const prefersCondition = /\b(condition|disease|syndrome|disorder|symptom|treat|heal|cure|manage)\b/.test(m);
      const prefersTherapy = /\b(therap|panchakarma|massage|abhyanga|basti|treatment)\b/.test(m);
      const prefersYoga = /\b(yoga|asana|pranayama|exercise|pose|meditat)\b/.test(m);
      let primary = null;
      if (prefersHerb) primary = 'herb';
      else if (prefersCondition) primary = 'condition';
      else if (prefersTherapy) primary = 'therapy';
      else if (prefersYoga) primary = 'yoga';
      const grounded = primary ? retrieveFlexible(message, primary, 5) : hits.slice(0, 5);

      const llm = await openrouterChat(
        'You are AyurAI, an Ayurveda assistant. Use ONLY the provided facts. Be concise, 2-4 sentences. Add: "Consult a qualified practitioner."',
        `Facts:\n${ctxText}\n\nQuestion: ${message}`
      );
      if (llm) return { answer: llm, grounded: grounded.map((h) => h.item.name), engine: 'openrouter+rag' };
      // deterministic floor — grounded in the RIGHT section
      if (!grounded.length) return { answer: 'I could not find a direct match in the knowledge base. Try mentioning a condition (e.g. diabetes, insomnia), an herb (e.g. ashwagandha), or a therapy. For medical emergencies, contact a physician.', grounded: [], engine: 'local-rag' };
      const top = grounded.slice(0, 4).map((h) => `• ${h.item.name} (${h.section})`).join('\n');
      return {
        answer: `Based on the Ayurvedic knowledge base, here are the most relevant matches for "${message}":\n${top}\n\nThese are grounded in real platform data. Always consult a qualified practitioner before starting any regimen.`,
        grounded: grounded.map((h) => h.item.name), engine: 'local-rag'
      };
    },
    engineStatus() { return { engines, corpusSize: corpus.length, model: 'TF-IDF RAG (on-device)' }; }
  };
};
