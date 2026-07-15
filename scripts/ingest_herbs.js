// scripts/ingest_herbs.js
// REAL herb ingestion — no fabrication.
// Sources (all public, verifiable):
//   1. Wikipedia "List of plants used in herbalism" -> real candidate plant titles
//   2. Wikipedia REST summary per plant -> real description
//   3. PubMed eutils -> REAL publication counts (never invented)
// Output: data/herbs_ingested.json (committed so it's available at runtime on Vercel)
//
// Usage: node scripts/ingest_herbs.js
// This is a BUILD/TIME ingest, not run on every request.

const fs = require('fs');
const path = require('path');
const https = require('https');

const OUT = path.join(__dirname, '..', 'data', 'herbs_ingested.json');
const CONC = 6; // be gentle to Wikipedia/PubMed

function get(url, timeoutMs = 12000) {
  return new Promise((resolve, reject) => {
    const c = setTimeout(() => reject(new Error('timeout')), timeoutMs);
    const req = https.request(url, { headers: { 'User-Agent': 'AyurDash/1.0 (educational research; contact admin)' } }, r => {
      let d = ''; r.on('data', x => d += x); r.on('end', () => { clearTimeout(c); resolve({ code: r.statusCode, body: d }); });
    });
    req.on('error', e => { clearTimeout(c); reject(e); });
    req.end();
  });
}
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }
async function wikiLinks() {
  const sets = new Set();
  for (const page of ['List_of_plants_used_in_herbalism', 'List_of_Ayurvedic_herbs']) {
    const u = 'https://en.wikipedia.org/w/api.php?action=parse&page=' + encodeURIComponent(page) + '&prop=links&format=json&pllimit=500';
    try { const r = await get(u); const j = JSON.parse(r.body); (j.parse && j.parse.links || []).forEach(l => { if (l['*'] && !/^(List|Category|Help|File|Template|Portal):/.test(l['*'])) sets.add(l['*']); }); } catch (e) {}
    await sleep(400);
  }
  return [...sets];
}
// Batched summary fetch via Action API (50 titles/request) — avoids REST rate limits.
async function wikiSummaries(titles) {
  const map = {};
  for (let i = 0; i < titles.length; i += 50) {
    const batch = titles.slice(i, i + 50);
    const u = 'https://en.wikipedia.org/w/api.php?action=query&prop=extracts&exintro&explaintext&exlimit=max&titles=' + encodeURIComponent(batch.join('|')) + '&format=json';
    let r;
    for (let attempt = 0; attempt < 4; attempt++) {
      try { r = await get(u); if (r.code === 429) { await sleep(3000 * (attempt + 1)); continue; } break; }
      catch (e) { if (attempt === 3) throw e; await sleep(2000); }
    }
    if (r && r.code === 200) {
      const j = JSON.parse(r.body); const pages = (j.query && j.query.pages) || {};
      Object.values(pages).forEach(pg => { if (pg.title && pg.extract) map[pg.title] = pg.extract; });
    }
    await sleep(2000);
  }
  return map;
}
async function pubmedCount(term) {
  const u = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&retmode=json&term=' + encodeURIComponent(term + ' ayurveda OR herbal medicine');
  try { const r = await get(u); if (r.code !== 200) return null; const j = JSON.parse(r.body); const n = j.esearchresult && j.esearchresult.count; return n != null ? parseInt(n, 10) : null; } catch (e) { return null; }
}
function isPlantTitle(t) {
  // Initial cheap filter to drop obvious non-plants; the real filter is the
  // summary-content check in the worker (must read like a plant article).
  const nonPlant = /(vulgaris|acne|syndrome|disease|disorder|cancer$|therapy|medicine \(|health|law|diet|quality|pollution|alternative treatment|history of)/i;
  if (nonPlant.test(t)) return false;
  return true;
}
function looksLikePlant(summary) {
  if (!summary) return false;
  const s = summary.toLowerCase();
  return /(plant|herb|species|genus|leaf|leaves|root|bark|shrub|tree|medicinal|botanical|cultivat|perennial|annual|flowering)/.test(s);
}
function mapWithConcurrency(items, worker, conc) {
  const res = new Array(items.length); let i = 0;
  async function next() { while (i < items.length) { const cur = i++; res[cur] = await worker(items[cur], cur).catch(e => null); } }
  return Promise.all(Array.from({ length: Math.min(conc, items.length) }, next)).then(() => res);
}
// Normalize a plant into our herb schema; treatment/uses derived from the real summary text.
function normalize(title, summary, cites) {
  const name = title;
  const latin = /^[A-Z][a-z]+ [a-z]+$/.test(title) ? title : null;
  const conditions = []; const uses = [];
  if (summary) {
    const low = summary.toLowerCase();
    ['inflammation', 'anxiety', 'diabetes', 'arthritis', 'insomnia', 'digestion', 'immunity', 'immune', 'respiratory', 'skin', 'liver', 'fever', 'cough', 'wound', 'cancer', 'memory', 'stress', 'pain', 'infection', 'hypertension', 'cholesterol', 'asthma', 'bronchitis', 'cold', 'flu', 'headache', 'depression', 'fatigue', 'ulcer', 'constipation', 'diarrhea', 'menstrual', 'fertility', 'thyroid', 'allergy', 'eczema', 'psoriasis', 'anemia', 'jaundice', 'urinary', 'kidney', 'heart', 'blood sugar', 'blood pressure', 'weight']
      .forEach(k => { if (low.includes(k)) { const label = k.replace(/\b\w/g, c => c.toUpperCase()); if (!conditions.includes(label)) conditions.push(label); } });
    ['anti-inflammatory', 'antioxidant', 'antimicrobial', 'antiviral', 'analgesic', 'diuretic', 'carminative', 'expectorant']
      .forEach(k => { if (low.includes(k)) uses.push(k); });
  }
  return {
    name, botanicalName: latin, commonNames: [], family: null,
    category: 'Medicinal Plant', partUsed: null, rasa: [], guna: [], virya: null, vipaka: null,
    doshaEffect: null, primaryUses: uses.length ? uses : (summary ? ['Traditional medicine'] : []),
    healthConditions: conditions, formulations: [], dosage: null, bestTime: null, precautions: null,
    researchCitations: cites, evidenceLevel: cites != null ? (cites > 1000 ? 'High' : cites > 100 ? 'Moderate' : 'Preliminary') : null,
    description: summary, source: 'Wikipedia + PubMed', ingested: true
  };
}
(async () => {
  console.log('Fetching candidate plant list from Wikipedia...');
  const titles = await wikiLinks();
  console.log('Candidates:', titles.length);
  const plants = titles.filter(isPlantTitle);
  console.log('Filtered plant-like:', plants.length);

  console.log('Batch-fetching Wikipedia summaries (batched, rate-limit safe)...');
  const summaries = await wikiSummaries(plants);
  console.log('Real plant summaries fetched:', Object.keys(summaries).length);

  console.log('Enriching matched plants with live PubMed counts (concurrency ' + CONC + ')...');
  const out = [];
  const kept = plants.filter(t => looksLikePlant(summaries[t]));
  const merged = await mapWithConcurrency(kept, async (t) => {
    const cites = await pubmedCount(t).catch(() => null);
    return normalize(t, summaries[t], cites);
  }, CONC);
  merged.forEach(m => { if (m) out.push(m); });

  // Merge with the existing 98 curated real herbs (dedupe by name)
  let base = [];
  try { base = require('../data/herbs').herbs || []; } catch (e) {}
  const seen = new Set(out.map(h => (h.name || '').toLowerCase()));
  base.forEach(h => { const k = (h.name || '').toLowerCase(); if (!seen.has(k)) { out.push(Object.assign({ source: 'curated', ingested: false }, h)); seen.add(k); } });

  fs.writeFileSync(OUT, JSON.stringify(out, null, 1));
  console.log('Wrote', out.length, 'REAL herbs to', OUT);
})().catch(e => { console.error('INGEST FAILED:', e.message); process.exit(1); });
