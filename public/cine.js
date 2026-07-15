/* ============================================================
   AyurAI — Cinematic Visual Engine (client side)
   Injects a living "cinematic video" banner into EVERY section.
   Pure CSS/SVG motion — no external images/videos, never breaks.
   ============================================================ */
(function () {
  // One themed cinematic definition per section.
  // motif: tiny inline SVG pattern drawn with currentColor (cheap, scalable).
  var SECTIONS = [
    { id:'doctors', kicker:'Practitioners', title:'Find Ayurvedic & Allopathic Doctors',
      desc:'Across 36 states & 700+ districts — filter by specialty, consultation mode, and more.',
      motif:'stethoscope' },
    { id:'hospitals', kicker:'Care Centres', title:'Hospitals, Panchakarma & Wellness Resorts',
      desc:'Multi-specialty, Ayurvedic, eye & maternity centres with real facilities.',
      motif:'building' },
    { id:'herbs', kicker:'Botanical Intelligence', title:'The Living Herb Library',
      desc:'100,000+ Ayurvedic herbs with rasa, guna, virya, formulations & research.',
      motif:'leaf' },
    { id:'therapies', kicker:'Healing Arts', title:'Panchakarma & Therapies',
      desc:'Classical detox and rejuvenation — Vamana, Basti, Shirodhara and more.',
      motif:'spiral' },
    { id:'yoga', kicker:'Movement & Breath', title:'Yoga, Pranayama & Meditation',
      desc:'Asanas, breathing and mudras for every body and every intention.',
      motif:'lotus' },
    { id:'health', kicker:'Whole-Person Care', title:'Health Conditions — The Ayurvedic View',
      desc:'Causes, herbs, diet, yoga and lifestyle for common conditions.',
      motif:'heart' },
    { id:'analytics', kicker:'Data Stories', title:'Advanced Analytics & Insights',
      desc:'Distribution, capacity, research trends and demand across India.',
      motif:'chart' },
    { id:'appointments', kicker:'Your Schedule', title:'Appointment Management',
      desc:'Book, track and manage consultations with doctors and hospitals.',
      motif:'calendar' },
    { id:'tracker', kicker:'Your Journey', title:'Personal Health Tracker',
      desc:'Weight, BP, sugar, sleep and more — visualise your trends over time.',
      motif:'pulse' },
    { id:'ailab', kicker:'Free AI', title:'AyurAI Lab — Infinite Free AI Tools',
      desc:'Real, key-less AI over the platform’s 100k+ knowledge base. Every tool is free.',
      motif:'spark' },
    { id:'commercial', kicker:'Partner Network', title:'Commercial & Partner Network',
      desc:'Post sourcing needs, browse verified practitioners and explore plans.',
      motif:'handshake' },
    { id:'compare', kicker:'Honest Benchmark', title:'AyurAI vs Similar Platforms',
      desc:'How our free, data-grounded AI compares with leading Ayurveda sites.',
      motif:'scale' }
  ];

  // Tiny SVG motifs (currentColor). Keep small.
  var MOTIFS = {
    leaf:'<svg viewBox="0 0 100 100"><path d="M50 8 C20 30 18 70 50 92 C82 70 80 30 50 8 Z" fill="none" stroke="white" stroke-width="2"/><path d="M50 12 L50 88" stroke="white" stroke-width="2"/></svg>',
    building:'<svg viewBox="0 0 100 100"><rect x="22" y="20" width="56" height="64" fill="none" stroke="white" stroke-width="2"/><path d="M30 32h10M60 32h10M30 48h10M60 48h10M30 64h10M60 64h10M44 84v-20h12v20" fill="none" stroke="white" stroke-width="2"/></svg>',
    spiral:'<svg viewBox="0 0 100 100"><path d="M50 50 m0 0 a8 8 0 1 1 -8 8 a18 18 0 1 1 18 -18 a30 30 0 1 1 -30 30 a42 42 0 1 1 42 -42" fill="none" stroke="white" stroke-width="2"/></svg>',
    lotus:'<svg viewBox="0 0 100 100"><path d="M50 78 C30 60 18 40 22 30 C36 38 46 52 50 64 C54 52 64 38 78 30 C82 40 70 60 50 78 Z" fill="none" stroke="white" stroke-width="2"/><path d="M50 80 C40 66 40 44 50 32 C60 44 60 66 50 80 Z" fill="none" stroke="white" stroke-width="2"/></svg>',
    heart:'<svg viewBox="0 0 100 100"><path d="M50 82 C20 60 14 38 30 28 C42 20 50 32 50 38 C50 32 58 20 70 28 C86 38 80 60 50 82 Z" fill="none" stroke="white" stroke-width="2"/></svg>',
    chart:'<svg viewBox="0 0 100 100"><path d="M20 80 L20 20 M20 80 L84 80 M32 80 L32 56 M46 80 L46 40 M60 80 L60 62 M74 80 L74 30" fill="none" stroke="white" stroke-width="2"/></svg>',
    calendar:'<svg viewBox="0 0 100 100"><rect x="20" y="22" width="60" height="58" rx="4" fill="none" stroke="white" stroke-width="2"/><path d="M20 36h60M34 14v12M66 14v12M34 54h12M54 54h12M34 68h12" fill="none" stroke="white" stroke-width="2"/></svg>',
    pulse:'<svg viewBox="0 0 100 100"><path d="M10 52 L34 52 L42 30 L52 74 L62 42 L70 52 L90 52" fill="none" stroke="white" stroke-width="2"/></svg>',
    spark:'<svg viewBox="0 0 100 100"><path d="M54 14 L40 54 L54 54 L46 86 L66 42 L52 42 Z" fill="none" stroke="white" stroke-width="2"/></svg>',
    handshake:'<svg viewBox="0 0 100 100"><path d="M18 50 L34 42 L48 52 L58 44 L74 52 M18 56 L34 64 L48 56 L58 64 L74 58" fill="none" stroke="white" stroke-width="2"/></svg>',
    scale:'<svg viewBox="0 0 100 100"><path d="M50 18 L50 80 M22 80 L78 80 M50 28 L26 40 M50 28 L74 40 M22 40 L22 56 M78 40 L78 56" fill="none" stroke="white" stroke-width="2"/></svg>',
    stethoscope:'<svg viewBox="0 0 100 100"><path d="M34 20 v18 a16 16 0 0 0 32 0 v-18 M50 54 v14 a10 10 0 0 0 10 10" fill="none" stroke="white" stroke-width="2"/></svg>'
  };

  function bannerHTML(s) {
    var motif = MOTIFS[s.motif] || MOTIFS.leaf;
    // real generated cinematic still (FREE, no key — local SVG file)
    var art = '<img class="cine-art" src="/cine-art/' + s.id + '.svg" alt="" loading="lazy" />';
    // a few drifting orbs with varied positions/colours
    var orbs = '';
    var pos = [[12,18,'#9fe6b0'],[72,30,'#ffd28a'],[44,64,'#a9c4ff'],[84,72,'#ff9ec0'],[28,80,'#c8a9ff']];
    pos.forEach(function (p, i) {
      var size = 60 + (i % 3) * 36;
      orbs += '<span class="cine-orb" style="left:'+p[0]+'%;top:'+p[1]+'%;width:'+size+'px;height:'+size+'px;background:radial-gradient(circle at 30% 30%,'+p[2]+',transparent 60%);animation-delay:'+(-i*2.2)+'s"></span>';
    });
    // decorative motif layers (screen blend) drifting
    var layer = '<div class="cine-layer" style="background-image:url(\'data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22340%22 height=%22340%22>'+encodeURIComponent(motif).replace(/'/g,'%22')+'</svg>\');opacity:.06"></div>';
    var layerB = '<div class="cine-layer b" style="background-image:url(\'data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22260%22 height=%22260%22>'+encodeURIComponent(motif).replace(/'/g,'%22')+'</svg>\');opacity:.05"></div>';
    return ''+
      '<div class="cine-banner" aria-hidden="true">'+
        art + layer + layerB +
        orbs +
        '<div class="cine-grain"></div>'+
        '<div class="cine-bars top"></div><div class="cine-bars bottom"></div>'+
        '<div class="cine-caption">'+
          '<div class="cine-kicker">'+s.kicker+'</div>'+
          '<h2>'+s.title+'</h2>'+
          '<p>'+s.desc+'</p>'+
        '</div>'+
      '</div>';
  }

  window.injectCinematicBanners = function () {
    SECTIONS.forEach(function (s) {
      var sec = document.getElementById('section-' + s.id);
      if (!sec) return;
      if (sec.querySelector('.cine-banner')) return; // idempotent
      // Insert as first child of the section (after the hero for the first one)
      var hero = sec.querySelector('.hero') || sec.querySelector('.section-header') || sec.firstElementChild;
      if (hero && hero.parentNode === sec) sec.insertBefore(htmlToNode(bannerHTML(s)), hero);
      else sec.insertBefore(htmlToNode(bannerHTML(s)), sec.firstChild);
    });
  };

  function htmlToNode(html) {
    var t = document.createElement('template');
    t.innerHTML = html.trim();
    return t.content.firstChild;
  }

  // Run after DOM ready (index.html calls this from init)
  if (document.readyState !== 'loading') {
    setTimeout(window.injectCinematicBanners, 0);
  } else {
    document.addEventListener('DOMContentLoaded', function () { setTimeout(window.injectCinematicBanners, 0); });
  }
})();
