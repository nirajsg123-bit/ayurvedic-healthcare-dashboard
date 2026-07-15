// Enrich herbs with REAL photos from Wikimedia Commons (keyless, no fabrication).
// For each herb we query the Commons API for a representative image of the
// plant (by botanical name + common name) and store the direct image URL.
// We only store images that actually resolve (HTTP 200 + image content-type),
// so the UI never shows a broken/placeholder image for a "fake" photo.
const fs = require('fs');
const path = require('path');
const https = require('https');

const herbsFile = path.join(__dirname, '..', 'data', 'herbs_ingested.json');
let herbs = [];
try { herbs = require(herbsFile); } catch (e) { herbs = []; }
if (!herbs.length) { console.error('No ingested herbs found'); process.exit(1); }

function httpsGet(url, timeoutMs) {
  return new Promise((resolve, reject) => {
    let raw = '', done = false;
    const req = https.request(url, { headers: { 'User-Agent': 'AyurAI/1.0 (healthcare dashboard; contact@ayur.example)' } }, res => {
      res.on('data', c => raw += c);
      res.on('end', () => { if (!done) { done = true; resolve(raw); } });
    });
    const to = setTimeout(() => { if (!done) { done = true; req.destroy(); reject(new Error('timeout')); } }, timeoutMs);
    req.on('error', e => { if (!done) { done = true; clearTimeout(to); reject(e); } });
    req.end();
  });
}

// Wikimedia Commons: get a thumbnail URL for the first image matching the title.
async function commonsImageUrl(query, maxBytes) {
  const t = encodeURIComponent(query.trim().replace(/\s+/g, ' '));
  // Search Commons for images, prefer exact-ish plant titles.
  const searchUrl = 'https://commons.wikimedia.org/w/api.php?action=query&format=json&generator=search&gsrsearch='
    + encodeURIComponent('filetype:bitmap ' + query) + '&gsrnamespace=6&gsrlimit=5&prop=imageinfo&iiprop=url|mime&iiurlwidth=600';
  const raw = await httpsGet(searchUrl, 9000);
  const j = JSON.parse(raw || '{}');
  const pages = (j.query && j.query.pages) || {};
  for (const id in pages) {
    const p = pages[id];
    const ii = p.imageinfo && p.imageinfo[0];
    if (ii && ii.thumburl && /^image\//.test(ii.mime || '')) return ii.thumburl;
  }
  return null;
}

async function verifyImage(url) {
  return new Promise(resolve => {
    const req = https.request(url, { method: 'HEAD', headers: { 'User-Agent': 'AyurAI/1.0' } }, res => {
      const ok = res.statusCode === 200 && /^image\//.test(res.headers['content-type'] || '');
      res.destroy();
      resolve(ok);
    });
    const to = setTimeout(() => { req.destroy(); resolve(false); }, 6000);
    req.on('error', () => { clearTimeout(to); resolve(false); });
    req.end();
  });
}

(async () => {
  let updated = 0, skipped = 0, failed = 0;
  for (const h of herbs) {
    if (h.imageUrl) { skipped++; continue; }
    const queries = [h.botanicalName, h.name, (h.commonNames && h.commonNames[0])].filter(Boolean);
    let found = null;
    for (const q of queries) {
      try {
        const u = await commonsImageUrl(q);
        if (u && await verifyImage(u)) { found = u; break; }
      } catch (e) {}
    }
    if (found) { h.imageUrl = found; h.imageSource = 'Wikimedia Commons'; updated++; }
    else { failed++; }
    if ((updated + failed) % 10 === 0) console.log(`progress: ${updated} ok, ${failed} missing, ${skipped} cached`);
  }
  fs.writeFileSync(herbsFile, JSON.stringify(herbs, null, 2));
  console.log(`\nDONE — photos added: ${updated}, missing: ${failed}, already had: ${skipped}, total herbs: ${herbs.length}`);
})();
