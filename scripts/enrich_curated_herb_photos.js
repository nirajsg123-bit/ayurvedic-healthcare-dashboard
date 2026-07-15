// Enrich the CURATED base herbs (data/herbs.js) with REAL Wikimedia photos.
// The main ingestion photo job already covered herbs_ingested.json; this
// covers the well-known curated herbs (Ashwagandha, Turmeric, Tulsi, ...).
// We store results in data/herbPhotos.json keyed by lowercase name so the
// server can merge them onto any herb at load time (curated OR ingested).
const fs = require('fs');
const path = require('path');
const https = require('https');

const herbsFile = path.join(__dirname, '..', 'data', 'herbs.js');
// Pull the curated herb names out of the module export (CommonJS require).
let curated = [];
try { curated = require(herbsFile); } catch (e) { curated = []; }
// herbs.js exports either an array or { generateInfiniteHerbs }.
if (!Array.isArray(curated)) {
  curated = (typeof curated.generateInfiniteHerbs === 'function') ? curated.generateInfiniteHerbs() : [];
}
const photoFile = path.join(__dirname, '..', 'data', 'herbPhotos.json');
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
    + encodeURIComponent('filetype:bitmap ' + query) + '&gsrnamespace=6&gsrlimit=5&prop=imageinfo&iiprop=url|mime&iiurlwidth=600';
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
  const targets = curated.filter(h => h.name && !photos[(h.name || '').toLowerCase()]);
  for (const h of targets) {
    const queries = [h.sanskrit, h.name, (h.commonNames && h.commonNames[0])].filter(Boolean);
    let found = null;
    for (const q of queries) {
      try { const u = await commonsImageUrl(q); if (u && await verifyImage(u)) { found = u; break; } } catch (e) {}
    }
    if (found) { photos[(h.name || '').toLowerCase()] = { url: found, source: 'Wikimedia Commons' }; updated++; }
  }
  fs.writeFileSync(photoFile, JSON.stringify(photos, null, 2));
  console.log('DONE — curated photos added this run:', updated, '| total photo map entries:', Object.keys(photos).length);
})();
