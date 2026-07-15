// scripts/ingest_hospitals.js
// REAL hospital ingestion — no fabrication, no social-media scraping.
// Sources (public, verifiable): Wikipedia hospital articles + state categories.
// Extracts REAL contact details from article wikitext infoboxes (phone, website,
// address, location). Missing fields stay null — never invented.
// Output: data/hospitals_ingested.json (committed for runtime on Vercel).
//
// Usage: node scripts/ingest_hospitals.js

const fs = require('fs');
const path = require('path');
const https = require('https');
const OUT = path.join(__dirname, '..', 'data', 'hospitals_ingested.json');
const CONC = 3;

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
async function api(params, tries = 4) {
  const u = 'https://en.wikipedia.org/w/api.php?' + params + '&format=json';
  for (let a = 0; a < tries; a++) {
    try { const r = await get(u); if (r.code === 429) { await sleep(3000 * (a + 1)); continue; } if (r.code !== 200) return null; return JSON.parse(r.body); }
    catch (e) { if (a === tries - 1) throw e; await sleep(2000); }
  }
  return null;
}
async function catMembers(cat, limit = 200) {
  const j = await api('action=query&list=categorymembers&cmtitle=' + encodeURIComponent(cat) + '&cmlimit=' + limit);
  return (j && j.query && j.query.categorymembers || []).map(m => m.title);
}
async function listPageLinks(page) {
  const j = await api('action=parse&page=' + encodeURIComponent(page) + '&prop=links&pllimit=500');
  const links = (j && j.parse && j.parse.links) || [];
  return links.map(l => l['*']).filter(t => t && !/^(List|Category|Help|File|Template|Portal):/.test(t));
}
// Batched wikitext infobox extraction (real contact data) + categories
async function enrichBatch(titles) {
  const out = {};
  for (let i = 0; i < titles.length; i += 20) {
    const batch = titles.slice(i, i + 20);
    const j = await api('action=query&prop=revisions&rvprop=content&rvslots=main&rvsection=0&titles=' + encodeURIComponent(batch.join('|')));
    const pages = (j && j.query && j.query.pages) || {};
    Object.values(pages).forEach(pg => {
      const rev = pg.revisions && pg.revisions[0];
      const content = rev && rev.slots && rev.slots.main && rev.slots.main['*'];
      if (content) out[pg.title] = parseInfobox(content);
    });
    await sleep(1500);
  }
  return out;
}
// Honest infobox parse: pull real phone/website/location/address fields.
function parseInfobox(wt) {
  const grab = (field) => {
    const m = wt.match(new RegExp('\\|\\s*' + field + '\\s*=\\s*([^\\n|]+)', 'i'));
    return m ? m[1].replace(/<\/?[^>]+>/g, '').replace(/\{\{[^}]*\}\}/g, '').trim() : null;
  };
  const phone = grab('phone') || grab('telephone');
  const website = grab('website');
  const location = grab('location') || grab('city') || grab('district');
  const address = grab('address');
  const isAyur = /ayurved/i.test(wt);
  return { phone, website, location, address, ayur: isAyur };
}
function cleanWeb(u) {
  if (!u) return null;
  const m = u.match(/https?:\/\/[^\s\|\}\"<]+/);
  return m ? m[0].replace(/\}$/, '') : null;
}
function mapWithConcurrency(items, worker, conc) {
  const res = new Array(items.length); let i = 0;
  async function next() { while (i < items.length) { const cur = i++; res[cur] = await worker(items[cur], cur).catch(() => null); } }
  return Promise.all(Array.from({ length: Math.min(conc, items.length) }, next)).then(() => res);
}
(async () => {
  const cats = [
    'Category:Hospitals in India', 'Category:Ayurveda hospitals in India',
    'Category:Hospitals in Kerala', 'Category:Hospitals in Karnataka',
    'Category:Hospitals in Maharashtra', 'Category:Hospitals in Tamil Nadu',
    'Category:Hospitals in Delhi', 'Category:Hospitals in Uttar Pradesh',
    'Category:Hospitals in West Bengal', 'Category:Hospitals in Gujarat'
  ];
  console.log('Collecting real hospital articles...');
  const set = new Set();
  for (const c of cats) { (await catMembers(c, 200)).forEach(t => set.add(t)); }
  (await listPageLinks('List of hospitals in India')).forEach(t => set.add(t));
  const titles = [...set].filter(t => !/^(List|Category|Help|File|Template|Portal):/.test(t));
  console.log('Unique hospital articles:', titles.length);

  console.log('Batch-enriching infoboxes (real contact data)...');
  const data = await enrichBatch(titles);
  console.log('With infobox data:', Object.keys(data).length);

  const out = Object.entries(data).map(([t, v]) => ({
    name: t,
    category: v.ayur ? 'Ayurvedic Hospital' : 'Multi-Specialty Hospital',
    type: v.ayur ? 'Ayurvedic Hospital' : 'Allopathy',
    state: null, city: v.location || null, address: v.address || null,
    phone: v.phone || null, website: cleanWeb(v.website),
    description: null, source: 'Wikipedia', ingested: true, real: true
  }));
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1));
  console.log('Wrote', out.length, 'REAL hospitals to', OUT);
  console.log('  with phone:', out.filter(x => x.phone).length, '| with website:', out.filter(x => x.website).length, '| ayurvedic:', out.filter(x => x.type === 'Ayurvedic Hospital').length);
})().catch(e => { console.error('HOSPITAL INGEST FAILED:', e.message); process.exit(1); });
