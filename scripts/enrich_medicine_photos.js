// Enrich the curated MEDICINES (data/medicines.js) with REAL Wikimedia photos.
// Mirrors the herb enrichment jobs: query Commons for a representative image
// of the formulation / key herb, verify it resolves (HTTP 200 + image/*), and
// store only verified URLs in data/medicinePhotos.json keyed by lowercase name.
// Medicines with no free image keep a graceful initial fallback in the UI.
const fs = require('fs');
const path = require('path');
const https = require('https');

const medsFile = path.join(__dirname, '..', 'data', 'medicines.js');
let meds = [];
try { meds = require(medsFile).generateMedicines(); } catch (e) { meds = []; }
if (!meds.length) { console.error('No medicines found'); process.exit(1); }

const photoFile = path.join(__dirname, '..', 'data', 'medicinePhotos.json');
let photos = {};
try { photos = JSON.parse(fs.readFileSync(photoFile, 'utf8')); } catch (e) { photos = {}; }

function httpsGet(url, timeoutMs) {
  return new Promise((resolve, reject) => {
    let raw = '', done = false;
    const req = https.request(url, { headers: { 'User-Agent': 'AyurAI/1.0 (healthcare dashboard; contact@ayur.example)' } }, res => {
      res.on('data', c => raw += c); res.on('end', () => { if (!done) { done = true; resolve(raw); } });
    });
    const to = setTimeout(() => { if (!done) { done = true; req.destroy(); reject(new Error('timeout')); } }, timeoutMs);
    req.on('error', e => { if (!done) { done = true; clearTimeout(to); reject(e); } });
    req.end();
  });
}
async function commonsImageUrl(query) {
  const searchUrl = 'https://commons.wikimedia.org/w/api.php?action=query&format=json&generator=search&gsrsearch='
    + encodeURIComponent('filetype:bitmap ' + query) + '&gsrnamespace=6&gsrlimit=6&prop=imageinfo&iiprop=url|mime&iiurlwidth=600';
  const raw = await httpsGet(searchUrl, 9000);
  const j = JSON.parse(raw || '{}');
  const pages = (j.query && j.query.pages) || {};
  for (const id in pages) {
    const ii = pages[id].imageinfo && pages[id].imageinfo[0];
    if (ii && ii.thumburl && /^image\//.test(ii.mime || '')) return ii.thumburl;
  }
  return null;
}
function verifyImage(url) {
  return new Promise(resolve => {
    const req = https.request(url, { method: 'HEAD', headers: { 'User-Agent': 'AyurAI/1.0' } }, res => {
      const ok = res.statusCode === 200 && /^image\//.test(res.headers['content-type'] || '');
      res.destroy(); resolve(ok);
    });
    const to = setTimeout(() => { req.destroy(); resolve(false); }, 6000);
    req.on('error', () => { clearTimeout(to); resolve(false); });
    req.end();
  });
}
(async () => {
  let updated = 0;
  const targets = meds.filter(m => m.name && !photos[(m.name || '').toLowerCase()]);
  for (const m of targets) {
    // Prefer the key herb in the medicine name; fall back to key ingredient.
    const keyHerb = (m.name || '').replace(/\s+(churna|kwath|taila|ghrita|rasayana|vati|lehyam|arishta|asava|kalpa)$/i, '').trim();
    const queries = [keyHerb, m.common, (m.ingredients && m.ingredients[0])].filter(Boolean).slice(0, 6);
    let found = null;
    for (const q of queries) {
      try { const u = await commonsImageUrl(q); if (u && await verifyImage(u)) { found = u; break; } } catch (e) {}
    }
    if (found) { photos[(m.name || '').toLowerCase()] = { url: found, source: 'Wikimedia Commons' }; updated++; }
  }
  fs.writeFileSync(photoFile, JSON.stringify(photos, null, 2));
  console.log('DONE — medicine photos added this run:', updated, '| total photo map entries:', Object.keys(photos).length);
})();
