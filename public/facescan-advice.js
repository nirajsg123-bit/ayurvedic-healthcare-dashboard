/* ============================================================
   Face Skin Lab — ADVICE ENGINE (Ayurvedic, data-driven, free)
   Maps detected defects -> dosha imbalance -> REAL herbs/therapies
   fetched live from /api/herbs & /api/therapies (real curated data).
   Also: diet, lifestyle, yoga & pranayama pointers (tie to platform).
   ============================================================ */
(function () {
  'use strict';

  // Defect -> likely dosha + key concepts + keyword hints used to match herbs/therapies
  const DEFECT_MAP = {
    acne: {
      dosha: 'Pitta', label: 'Acne / Redness',
      diet: 'Cooling foods: cucumber, melon, coconut water, coriander, fennel. Avoid chilies, fried & sour foods, excess salt.',
      lifestyle: 'Reduce sun/heat exposure; gentle cleansing twice daily; avoid popping; manage stress (Pitta fires up under pressure).',
      yoga: ['Sheetali Pranayama (cooling breath)', 'Chandra Bhedana', 'Shitali', 'forward bends to calm Pitta'],
      herbKw: ['blood purifier', 'anti-inflammatory', 'cooling', 'skin', 'detox', 'antibacterial', 'pitta'],
      therapyKw: ['Pitta', 'skin', 'blood', 'detox', 'cooling']
    },
    spots: {
      dosha: 'Pitta/Kapha', label: 'Dark Spots / Pigmentation',
      diet: 'Vitamin-C & antioxidants: amla, citrus, leafy greens, turmeric in warm milk. Limit sugar & refined carbs.',
      lifestyle: 'Daily SPF; lemon-honey ubtan (patch test); consistent night routine; stay hydrated.',
      yoga: ['Kapalabhati (clears complexion)', 'Anulom Vilom', 'twists to support liver detox'],
      herbKw: ['pigmentation', 'complexion', 'antioxidant', 'liver', 'blood purifier', 'skin brightening'],
      therapyKw: ['skin', 'Panchakarma', 'blood', 'detox']
    },
    darkcircles: {
      dosha: 'Vata/Pitta', label: 'Dark Circles',
      diet: 'Iron & sleep: dates, pomegranate, sesame, leafy greens, warm milk with turmeric at night.',
      lifestyle: '7–8h regular sleep; cool compresses (rose water); limit screens before bed; stay hydrated.',
      yoga: ['Shavasana', 'Balasana (child pose)', 'Anulom Vilom', 'eye exercises (palming)'],
      herbKw: ['cooling', 'blood', 'rejuvenation', 'rasayana', 'iron', 'skin'],
      therapyKw: ['eye', 'Panchakarma', 'rasayana', 'stress']
    },
    oily: {
      dosha: 'Kapha', label: 'Oily / Shine',
      diet: 'Light, warm, dry foods: steamed veg, moong dal, barley, ginger tea. Cut dairy, sugar & fried foods.',
      lifestyle: 'Cleanse 2x/day with mild herbal face wash; clay/neem masks; avoid heavy creams.',
      yoga: ['Kapalabhati', 'Surya Namaskar', 'twists', 'Bhastrika'],
      herbKw: ['oil control', 'antibacterial', 'detox', 'blood purifier', 'neem', 'kapha'],
      therapyKw: ['Kapha', 'skin', 'detox', 'blood']
    },
    dull: {
      dosha: 'Kapha/Pitta', label: 'Dull / Uneven Tone',
      diet: 'Bright produce + hydration; triphala at night; avoid processed food.',
      lifestyle: 'Weekly ubtan exfoliation; gentle facial massage; regular exercise for circulation.',
      yoga: ['Surya Namaskar', 'Anulom Vilom', 'backbends for glow'],
      herbKw: ['complexion', 'blood purifier', 'antioxidant', 'rasayana', 'skin brightening'],
      therapyKw: ['skin', 'detox', 'blood', 'Panchakarma']
    },
    dry: {
      dosha: 'Vata', label: 'Dry / Rough',
      diet: 'Healthy fats: ghee, sesame/olive oil, avocado, nuts, warm cooked meals; ample water.',
      lifestyle: 'Rich moisturisers (aloe, rose); humidify; avoid hot long showers; abhyanga self-massage.',
      yoga: ['gentle restorative poses', 'Anulom Vilom', 'Bhramari', 'Balasana'],
      herbKw: ['moisturising', 'rasayana', 'rejuvenation', 'vata', 'skin', 'nourishing'],
      therapyKw: ['Vata', 'Abhyanga', 'rasayana', 'skin']
    },
    wrinkles: {
      dosha: 'Vata', label: 'Fine Lines / Wrinkles',
      diet: 'Collagen support: bone broth, sesame, ghee, amla, plenty of antioxidants & water.',
      lifestyle: 'Daily abhyanga with warm oil; sun protection; no smoking; quality sleep; facial yoga.',
      yoga: ['Simhasana (lion)', 'Jivha Bandha', 'Bhramari', 'gentle inversions'],
      herbKw: ['rejuvenation', 'rasayana', 'anti-aging', 'antioxidant', 'vata', 'skin'],
      therapyKw: ['Vata', 'Abhyanga', 'rasayana', 'Shirodhara', 'rejuvenation']
    }
  };

  // Generic fallback remedies by dosha (always available)
  const DOSHA_REMEDY = {
    Vata: { herbs: ['Ashwagandha', 'Sesame oil', 'Ghee', 'Bala', 'Amla'], therapies: ['Abhyanga', 'Shirodhara', 'Basti'] },
    Pitta: { herbs: ['Amla', 'Neem', 'Coriander', 'Aloe Vera', 'Manjistha'], therapies: ['Virechana', 'Sheetali', 'Panchakarma'] },
    Kapha: { herbs: ['Turmeric', 'Ginger', 'Triphala', 'Neem', 'Black Pepper'], therapies: ['Vamana', 'Kapalabhati', 'Udvartana'] }
  };

  let _cache = { herbs: null, therapies: null, ts: 0 };

  // Real data vocabulary (verified against /api/herbs & /api/therapies).
  // Each defect lists token fragments that actually appear in the herb/therapy text.
  const HERB_KW = {
    acne: ['acne', 'pimple', 'rash', 'blood', 'detox', 'anti', 'pitta', 'neem', 'turmeric', 'manjistha', 'skin'],
    spots: ['pigment', 'complexion', 'glow', 'blood', 'detox', 'anti', 'manjistha', 'turmeric', 'aml', 'skin'],
    darkcircles: ['blood', 'skin', 'rasayana', 'aml', 'rejuvenation', 'iron', 'cool', 'eye'],
    oily: ['neem', 'turmeric', 'detox', 'blood', 'anti', 'kapha', 'pitta', 'skin'],
    dull: ['complexion', 'blood', 'detox', 'anti', 'rasayana', 'aml', 'glow', 'skin'],
    dry: ['rasayana', 'rejuvenation', 'vata', 'skin', 'glow', 'moistur', 'nourish', 'aml', 'bala'],
    wrinkles: ['rasayana', 'rejuvenation', 'anti', 'vata', 'aml', 'skin', 'glow', 'collagen']
  };
  const THERAPY_KW = {
    acne: ['skin', 'pitta', 'blood', 'panchakarma', 'detox', 'rakta'],
    spots: ['skin', 'blood', 'panchakarma', 'detox', 'raktamokshana'],
    darkcircles: ['eye', 'rasayana', 'rejuvenation', 'shirodhara', 'skin'],
    oily: ['kapha', 'skin', 'panchakarma', 'detox', 'udvartana'],
    dull: ['skin', 'panchakarma', 'detox', 'blood', 'abhyanga'],
    dry: ['vata', 'abhyanga', 'rasayana', 'shirodhara', 'sneha', 'skin'],
    wrinkles: ['vata', 'abhyanga', 'rasayana', 'shirodhara', 'rejuvenation', 'sneha']
  };

  async function loadData() {
    if (_cache.herbs && Date.now() - _cache.ts < 5 * 60000) return _cache;
    const [h, t] = await Promise.all([
      fetch('/api/herbs?limit=2000').then(r => r.json()).catch(() => ({ data: [] })),
      fetch('/api/therapies?limit=400').then(r => r.json()).catch(() => ({ data: [] }))
    ]);
    _cache = { herbs: (h.data || []), therapies: (t.data || []), ts: Date.now() };
    return _cache;
  }

  // Coerce a field (could be a string OR an array) into one lowercase string.
  function B(v) {
    if (v == null) return '';
    if (Array.isArray(v)) return v.join(' ').toLowerCase();
    return String(v).toLowerCase();
  }

  // Collapse regional variants ("Neem (Cultivated)") to base name, keep canonical.
  function dedupeItems(list) {
    const seen = new Set(); const out = [];
    for (const h of list) {
      const base = (h.name || '').replace(/\s*\(.*\)\s*$/, '').trim().toLowerCase();
      if (seen.has(base)) continue;
      seen.add(base); out.push(h);
    }
    return out;
  }

  function matchHerbs(defectList, pool, limit) {
    const kw = [];
    defectList.forEach(d => { const m = HERB_KW[d.key]; if (m) kw.push(...m); });
    const scored = pool.map(hb => {
      const blob = [B(hb.name), B(hb.sanskrit), B(hb.primaryUses), B(hb.healthConditions),
        B(hb.category), B(hb.doshaEffect), B(hb.commonNames), B(hb.commonTags)].join(' ');
      let score = 0; const seen = new Set();
      kw.forEach(k => { const t = k.toLowerCase(); if (blob.includes(t) && !seen.has(t)) { score += 2; seen.add(t); } });
      if (/\brasayana\b/.test(blob)) score += 1;
      if (/detox|blood/.test(blob)) score += 1;
      return { hb, score };
    }).filter(x => x.score > 0).sort((a, b) => b.score - a.score);
    return scored.slice(0, limit || 8).map(x => x.hb);
  }

  function matchTherapies(defectList, pool, limit) {
    const kw = [];
    defectList.forEach(d => { const m = THERAPY_KW[d.key]; if (m) kw.push(...m); });
    const scored = pool.map(th => {
      const blob = [B(th.name), B(th.sanskrit), B(th.indications), B(th.category),
        B(th.type), B(th.benefits), B(th.description)].join(' ');
      let score = 0; const seen = new Set();
      kw.forEach(k => { const t = k.toLowerCase(); if (blob.includes(t) && !seen.has(t)) { score += 2; seen.add(t); } });
      if (/skin/.test(blob)) score += 1;
      return { th, score };
    }).filter(x => x.score > 0).sort((a, b) => b.score - a.score);
    return scored.slice(0, limit || 6).map(x => x.th);
  }

  function topDoshas(defects) {
    const tally = {};
    defects.forEach(d => {
      const m = DEFECT_MAP[d.key]; if (!m) return;
      const parts = m.dosha.split('/');
      parts.forEach((p, i) => { tally[p] = (tally[p] || 0) + (i === 0 ? 2 : 1); });
    });
    return Object.keys(tally).sort((a, b) => tally[b] - tally[a]);
  }

  async function buildAdvice(result, data) {
    const defects = (result && result.defects) || [];
    const dList = defects.slice().sort((a, b) => b.severity - a.severity);
    const doshas = topDoshas(defects);
    const primary = doshas[0] || 'Pitta';

    const pool = data || (await loadData());
    const rawHerbs = matchHerbs(dList, pool.herbs || [], 20);
    const herbs = dedupeItems(rawHerbs).slice(0, 8);
    const rawTherapies = matchTherapies(dList, pool.therapies || [], 24);
    const therapies = dedupeItems(rawTherapies).slice(0, 6);

    // If nothing matched, fall back to dosha general remedies (looked up in pool)
    let fallbackHerbs = [];
    if (!herbs.length) {
      const gen = DOSHA_REMEDY[primary] || DOSHA_REMEDY.Pitta;
      fallbackHerbs = (pool.herbs || []).filter(hb => gen.herbs.some(g => (hb.name || '').toLowerCase().includes(g.toLowerCase()))).slice(0, 6);
    }
    let fallbackTherapies = [];
    if (!therapies.length) {
      const gen = DOSHA_REMEDY[primary] || DOSHA_REMEDY.Pitta;
      fallbackTherapies = (pool.therapies || []).filter(th => gen.therapies.some(g => (th.name || '').toLowerCase().includes(g.toLowerCase()))).slice(0, 4);
    }

    const diet = dList.map(d => DEFECT_MAP[d.key] && DEFECT_MAP[d.key].diet).filter(Boolean);
    const lifestyle = dList.map(d => DEFECT_MAP[d.key] && DEFECT_MAP[d.key].lifestyle).filter(Boolean);
    const yoga = [];
    dList.forEach(d => { const m = DEFECT_MAP[d.key]; if (m) m.yoga.forEach(y => { if (!yoga.includes(y)) yoga.push(y); }); });

    return {
      primaryDosha: primary,
      doshas,
      defects: dList,
      skinScore: result ? result.skinScore : null,
      herbs, fallbackHerbs, therapies, fallbackTherapies,
      diet: [...new Set(diet)],
      lifestyle: [...new Set(lifestyle)],
      yoga
    };
  }

  window.FaceAdvice = {
    DEFECT_MAP,
    loadData,
    buildAdvice,
    // convenience for html: render a plain-text report
    toReport(advice) {
      const L = [];
      L.push('AYURVEDIC FACE SKIN REPORT');
      L.push('==========================');
      L.push('Skin health score: ' + (advice.skinScore != null ? advice.skinScore + '/100' : 'n/a'));
      L.push('Primary dosha imbalance: ' + advice.primaryDosha);
      L.push('');
      L.push('DETECTED ISSUES:');
      if (!advice.defects.length) L.push('  No major issues detected — skin looks balanced.');
      advice.defects.forEach(d => L.push('  - ' + d.label + ' (severity ' + d.severity + '/100)'));
      L.push('');
      L.push('RECOMMENDED HERBS (from live herb library):');
      (advice.herbs.length ? advice.herbs : advice.fallbackHerbs).forEach(h => L.push('  - ' + (h.name || h) + (h.sanskrit ? ' (' + h.sanskrit + ')' : '') + ((h.primaryUses && h.primaryUses.length) ? ' — ' + h.primaryUses.slice(0, 3).join(', ') : '')));
      L.push('');
      L.push('RECOMMENDED THERAPIES (Panchakarma / treatments):');
      (advice.therapies.length ? advice.therapies : advice.fallbackTherapies).forEach(t => L.push('  - ' + (t.name || t) + (t.sanskrit ? ' (' + t.sanskrit + ')' : '') + ((t.indications && t.indications.length) ? ' — ' + t.indications.slice(0, 3).join(', ') : '')));
      L.push('');
      L.push('DIET GUIDANCE:');
      advice.diet.forEach(d => L.push('  - ' + d));
      L.push('');
      L.push('LIFESTYLE:');
      advice.lifestyle.forEach(d => L.push('  - ' + d));
      L.push('');
      L.push('YOGA & PRANAYAMA:');
      advice.yoga.forEach(y => L.push('  - ' + y));
      L.push('');
      L.push('Disclaimer: Educational only — not a medical diagnosis. Consult an Ayurvedic physician.');
      return L.join('\n');
    }
  };
})();
