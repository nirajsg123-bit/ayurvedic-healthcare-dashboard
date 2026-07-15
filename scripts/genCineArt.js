// ============================================================
//  AyurAI — Cinematic art generator (FREE, NO KEY, NO DEPENDENCIES)
//  ------------------------------------------------------------
//  Generates 12 real SVG "cinematic still" artworks, one per section,
//  using only Node's fs module (no network, no API, no packages).
//  Each scene is a layered, themed composition: filmic sky gradient,
//  a recognizable silhouette/motif, drifting particles, and a soft
//  glow. The browser then plays them with Ken Burns + grain + letterbox
//  (see cine.css / cine.js) so they feel like living cinematic video.
//
//  Run:  node scripts/genCineArt.js
// ============================================================
const fs = require('fs');
const path = require('path');

const OUT = path.join(__dirname, '..', 'public', 'cine-art');
if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true });

// ---- helpers ----
function rnd(seed) { // deterministic PRNG so art is stable across runs
  let s = seed % 2147483647; if (s <= 0) s += 2147483646;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}
function stars(r, n, w, h, col, rmin, rmax) {
  let o = '';
  for (let i = 0; i < n; i++) {
    const x = (r() * w).toFixed(1), y = (r() * h).toFixed(1);
    const rad = (rmin + r() * (rmax - rmin)).toFixed(1);
    o += `<circle cx="${x}" cy="${y}" r="${rad}" fill="${col}" opacity="${(0.3 + r() * 0.6).toFixed(2)}"/>`;
  }
  return o;
}
function particles(r, n, w, h, col) {
  let o = '';
  for (let i = 0; i < n; i++) {
    const x = (r() * w).toFixed(1), y = (r() * h).toFixed(1);
    const rad = (1 + r() * 3).toFixed(1);
    o += `<circle cx="${x}" cy="${y}" r="${rad}" fill="${col}" opacity="${(0.15 + r() * 0.5).toFixed(2)}"/>`;
  }
  return o;
}
// cinematic 2.39:1 letterbox-safe viewport
const W = 1200, H = 500;

function frame(inner, defs = '') {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice" width="${W}" height="${H}">
<defs>${defs}</defs>${inner}</svg>`;
}
function sky(id, c1, c2, c3) {
  return `<linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="${c1}"/><stop offset="0.55" stop-color="${c2}"/><stop offset="1" stop-color="${c3}"/></linearGradient>`;
}
function vignette() {
  return `<rect width="${W}" height="${H}" fill="url(#vig)"/>
  <radialGradient id="vig" cx="50%" cy="42%" r="75%">
    <stop offset="55%" stop-color="#000" stop-opacity="0"/>
    <stop offset="100%" stop-color="#000" stop-opacity="0.55"/></radialGradient>`;
}

// ---- SCENES ----
const scenes = {
  doctors: (r) => frame(
    `<rect width="${W}" height="${H}" fill="url(#g)"/>
     <circle cx="930" cy="120" r="70" fill="#bfeaff" opacity="0.5"/>
     ${stars(r, 60, W, H * 0.7, '#cfefff', 0.5, 1.8)}
     <!-- skyline of a healing city -->
     <g fill="#04181d" opacity="0.92">
       <rect x="40" y="320" width="90" height="160"/><rect x="150" y="270" width="70" height="210"/>
       <rect x="240" y="300" width="110" height="180"/><rect x="370" y="250" width="80" height="230"/>
       <rect x="470" y="300" width="120" height="180"/><rect x="610" y="280" width="70" height="200"/>
       <rect x="700" y="320" width="100" height="160"/><rect x="820" y="260" width="90" height="220"/>
       <rect x="930" y="300" width="120" height="180"/><rect x="1070" y="280" width="90" height="200"/>
     </g>
     <g fill="#0a3a44" opacity="0.5">
       ${Array.from({length:40},()=>`<rect x="${(40+r()*1120).toFixed(0)}" y="${(260+r()*240).toFixed(0)}" width="6" height="8"/>`).join('')}
     </g>
     ${vignette()}`,
    sky('g', '#06303a', '#0a4a52', '#0b2a30')),

  hospitals: (r) => frame(
    `<rect width="${W}" height="${H}" fill="url(#g)"/>
     <!-- classical ayurvedic hospital / temple arch -->
     <g fill="#1a1030">
       <rect x="420" y="200" width="360" height="260" rx="6"/>
       <path d="M420 200 q180 -90 360 0 Z"/>
     </g>
     <g fill="#2e1d54" opacity="0.8">
       <rect x="470" y="250" width="60" height="210"/><rect x="570" y="250" width="60" height="210"/>
       <rect x="670" y="250" width="60" height="210"/><rect x="760" y="250" width="60" height="210"/>
     </g>
     <circle cx="600" cy="150" r="46" fill="#ffe6a8" opacity="0.7"/>
     ${particles(r, 50, W, H, '#d9c6ff')}
     ${vignette()}`,
    sky('g', '#1a1030', '#2e1d54', '#120a26')),

  herbs: (r) => frame(
    `<rect width="${W}" height="${H}" fill="url(#g)"/>
     <circle cx="300" cy="130" r="80" fill="#eaffd0" opacity="0.45"/>
     <!-- rolling garden hills -->
     <path d="M0 380 Q300 300 600 360 T1200 340 V500 H0 Z" fill="#0a2a14" opacity="0.95"/>
     <path d="M0 420 Q350 360 700 410 T1200 400 V500 H0 Z" fill="#073d1c" opacity="0.95"/>
     <!-- stylized herb plants -->
     <g stroke="#7ee08a" stroke-width="4" fill="none" opacity="0.9">
       ${Array.from({length:9},(_,i)=>{const x=80+i*130;return `<path d="M${x} 470 C${x-20} 400 ${x-10} 360 ${x} 320"/><path d="M${x} 400 q-30 -10 -40 -30"/><path d="M${x} 370 q30 -10 40 -30"/>`;}).join('')}
     </g>
     ${particles(r, 40, W, H, '#bff5c4')}
     ${vignette()}`,
    sky('g', '#06210f', '#0f3d1d', '#082a16')),

  therapies: (r) => frame(
    `<rect width="${W}" height="${H}" fill="url(#g)"/>
     <!-- shirodhara oil stream + flowing spiral -->
     <circle cx="600" cy="200" r="60" fill="#aebfff" opacity="0.4"/>
     <path d="M600 200 Q580 320 600 420" stroke="#9fc0ff" stroke-width="6" fill="none" opacity="0.8"/>
     <g fill="none" stroke="#7e9bff" stroke-width="3" opacity="0.7">
       ${Array.from({length:5},(_,i)=>`<path d="M${600} ${260+i*30} a${20+i*18} ${20+i*18} 0 1 1 -${20+i*18} ${20+i*18}"/>`).join('')}
     </g>
     ${particles(r, 50, W, H, '#b9c8ff')}
     ${vignette()}`,
    sky('g', '#101a3a', '#26327a', '#0c1330')),

  yoga: (r) => frame(
    `<rect width="${W}" height="${H}" fill="url(#g)"/>
     <circle cx="600" cy="170" r="90" fill="#ffd28a" opacity="0.5"/>
     <!-- sun + lotus -->
     <g fill="none" stroke="#ffcf8f" stroke-width="4" opacity="0.85">
       <circle cx="600" cy="170" r="46"/>
       ${Array.from({length:12},(_,i)=>{const a=i*30*Math.PI/180;return `<line x1="${600+Math.cos(a)*52}" y1="${170+Math.sin(a)*52}" x2="${600+Math.cos(a)*74}" y2="${170+Math.sin(a)*74}"/>`;}).join('')}
     </g>
     <path d="M600 470 C500 380 440 320 470 300 C540 330 580 390 600 430 C620 390 660 330 730 300 C760 320 700 380 600 470 Z" fill="#ffb968" opacity="0.9"/>
     ${particles(r, 40, W, H, '#ffe0b0')}
     ${vignette()}`,
    sky('g', '#3a2206', '#7a4410', '#2a1605')),

  health: (r) => frame(
    `<rect width="${W}" height="${H}" fill="url(#g)"/>
     <circle cx="600" cy="220" r="70" fill="#ff9bb0" opacity="0.4"/>
     <!-- heart pulse line -->
     <path d="M0 260 H420 L460 180 L520 340 L580 220 L640 300 L700 260 H1200" stroke="#ff7d96" stroke-width="5" fill="none" opacity="0.9"/>
     <path d="M560 230 C520 180 500 150 540 130 C580 112 600 150 600 160 C600 150 620 112 660 130 C700 150 680 180 640 230 Z" fill="#ff5d7e" opacity="0.85"/>
     ${particles(r, 45, W, H, '#ffc2d0')}
     ${vignette()}`,
    sky('g', '#3a0612', '#7a1024', '#2a0810')),

  analytics: (r) => frame(
    `<rect width="${W}" height="${H}" fill="url(#g)"/>
     <circle cx="600" cy="250" r="60" fill="#9fe0ff" opacity="0.4"/>
     <!-- bar chart -->
     <g fill="#3fa7d6" opacity="0.9">
       ${Array.from({length:10},(_,i)=>{const h=60+r()*200;return `<rect x="${120+i*100}" y="${460-h}" width="56" height="${h}" rx="4"/>`;}).join('')}
     </g>
     <polyline points="${Array.from({length:10},(_,i)=>`${148+i*100},${300-r()*180}`).join(' ')}" fill="none" stroke="#bff0ff" stroke-width="4" opacity="0.9"/>
     ${vignette()}`,
    sky('g', '#04203a', '#0a4a7a', '#06203a')),

  appointments: (r) => frame(
    `<rect width="${W}" height="${H}" fill="url(#g)"/>
     <circle cx="600" cy="190" r="64" fill="#9affd6" opacity="0.4"/>
     <!-- calendar grid -->
     <g fill="none" stroke="#7ef0c4" stroke-width="3" opacity="0.85">
       ${Array.from({length:4},(_,y)=>Array.from({length:7},(_,x)=>`<rect x="${300+x*60}" y="${280+y*60}" width="50" height="50" rx="6"/>`).join('')).join('')}
     </g>
     <rect x="360" y="280" width="50" height="50" rx="6" fill="#7ef0c4" opacity="0.6"/>
     ${particles(r, 40, W, H, '#b6ffe0')}
     ${vignette()}`,
    sky('g', '#0a2a2e', '#0f5a55', '#08302c')),

  tracker: (r) => frame(
    `<rect width="${W}" height="${H}" fill="url(#g)"/>
     <circle cx="600" cy="220" r="60" fill="#d4ff7e" opacity="0.4"/>
     <!-- upward trend line + dots -->
     <polyline points="${Array.from({length:11},(_,i)=>`${120+i*95},${440-i*30-r()*20}`).join(' ')}" fill="none" stroke="#c4f56a" stroke-width="5" opacity="0.95"/>
     ${Array.from({length:11},(_,i)=>`<circle cx="${120+i*95}" cy="${440-i*30}" r="6" fill="#e6ff9c"/>`).join('')}
     ${particles(r, 40, W, H, '#dcff9c')}
     ${vignette()}`,
    sky('g', '#1a2a06', '#3d6a10', '#122606')),

  ailab: (r) => frame(
    `<rect width="${W}" height="${H}" fill="url(#g)"/>
     <circle cx="600" cy="230" r="80" fill="#d9b6ff" opacity="0.45"/>
     <!-- neural nodes -->
     <g stroke="#c79bff" stroke-width="2" opacity="0.7" fill="none">
       ${Array.from({length:8},(_,i)=>{const x1=200+r()*200,y1=150+r()*200,x2=700+r()*200,y2=150+r()*200;return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>`;}).join('')}
     </g>
     <g fill="#e6ccff">
       ${Array.from({length:12},()=>`<circle cx="${(200+r()*800).toFixed(0)}" cy="${(120+r()*260).toFixed(0)}" r="${(4+r()*6).toFixed(0)}"/>`).join('')}
     </g>
     ${vignette()}`,
    sky('g', '#16063a', '#4a1f7a', '#100a30')),

  commercial: (r) => frame(
    `<rect width="${W}" height="${H}" fill="url(#g)"/>
     <circle cx="600" cy="190" r="70" fill="#ffe08a" opacity="0.45"/>
     <!-- coins / handshake motif -->
     <g fill="#ffcf5c" opacity="0.9">
       ${Array.from({length:7},(_,i)=>`<circle cx="${260+i*90}" cy="${360+(i%2)*40}" r="34"/>`).join('')}
     </g>
     <g fill="none" stroke="#ffe9a8" stroke-width="3" opacity="0.8">
       ${Array.from({length:7},(_,i)=>`<circle cx="${260+i*90}" cy="${360+(i%2)*40}" r="22"/>`).join('')}
     </g>
     ${particles(r, 40, W, H, '#ffe9a8')}
     ${vignette()}`,
    sky('g', '#2a1c02', '#7a5a10', '#1f1402')),

  compare: (r) => frame(
    `<rect width="${W}" height="${H}" fill="url(#g)"/>
     <circle cx="600" cy="220" r="70" fill="#9fe0ff" opacity="0.4"/>
     <!-- balance scale -->
     <g fill="none" stroke="#bfe6ff" stroke-width="4" opacity="0.9">
       <line x1="600" y1="160" x2="600" y2="360"/>
       <line x1="430" y1="220" x2="770" y2="220"/>
       <path d="M430 220 q-50 60 0 90 q50 -30 0 -90"/>
       <path d="M770 220 q-50 60 0 90 q50 -30 0 -90"/>
     </g>
     ${particles(r, 45, W, H, '#bfe6ff')}
     ${vignette()}`,
    sky('g', '#04203a', '#0a4a6a', '#2a1605'))
};

let count = 0;
for (const [name, fn] of Object.entries(scenes)) {
  const r = rnd(name.split('').reduce((a, c) => a + c.charCodeAt(0), 7));
  const svg = fn(r);
  fs.writeFileSync(path.join(OUT, name + '.svg'), svg);
  count++;
}
console.log('Generated ' + count + ' cinematic SVG artworks in ' + OUT);
