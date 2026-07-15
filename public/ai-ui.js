// ============================================================
//  ai-ui.js — AyurAI Lab + Commercial UI controller.
//  Renders the 30+ free-AI tools from /api/ai/features, runs them
//  against REAL backend endpoints, and shows the live engine pill.
//  Also wires the Commercial (requirements board + plans) surfaces.
//  Robust: every call is guarded, falls back gracefully.
// ============================================================
(function () {
  // Global toast (original app calls showToast but never defined it — provide a safe one)
  window.showToast = window.showToast || function (msg, type) {
    var t = document.createElement('div');
    t.textContent = msg;
    t.style.cssText = 'position:fixed;bottom:20px;left:50%;transform:translateX(-50%);background:#222;color:#fff;padding:10px 16px;border-radius:10px;font-size:13px;z-index:9999;box-shadow:0 4px 16px rgba(0,0,0,.3);max-width:80%;';
    document.body.appendChild(t);
    setTimeout(function () { t.style.opacity = '0'; t.style.transition = 'opacity .4s'; setTimeout(function () { t.remove(); }, 400); }, 2600);
  };

  var AI_FEATURES = [];
  var AI_CATEGORIES = [];
  var aiActiveCat = 'All';

  // ---------- Free in-browser AI model preloader ----------
  // One-click: loads the REAL free transformers.js models (flan-t5 LLM + opus-mt
  // NMT) from the HuggingFace CDN — NO API key, NO cost. Updates the badge so the
  // user sees exactly which free engines are live in their browser.
  window.warmFreeAIModels = function () {
    var badge = document.getElementById('ai-engine-badge');
    var btn = document.getElementById('ai-warm-btn');
    if (btn) { btn.disabled = true; btn.textContent = '⏳ Loading free AI models…'; }
    if (badge) badge.textContent = 'Downloading flan-t5-small + opus-mt from CDN (one-time, ~30MB)…';
    var pending = 0, done = 0;
    function tick() { done++; if (badge) badge.textContent = 'Free AI engines ready: ' + done + '/2 (flan-t5 LLM, opus-mt NMT)'; if (btn) { btn.disabled = false; btn.textContent = '✅ Free AI models loaded'; } }
    pending = 2;
    if (window.AyurBrain && window.AyurBrain._warmLLM) {
      window.AyurBrain._warmLLM();
      // poll the engine status exposed by ayurbrain
      var iv = setInterval(function () {
        if (window.ayurAIEngine === 'browser-llm') { clearInterval(iv); tick(); }
      }, 800);
      setTimeout(function () { clearInterval(iv); if (done < 2) tick(); }, 30000);
    } else tick();
    if (window.AyurBrain && window.AyurBrain._warmNMT) {
      window.AyurBrain._warmNMT();
      setTimeout(tick, 100);
    } else tick();
  };

  // ---------- AI Lab ----------
  window.initAILab = function () {
    if (AI_FEATURES.length) { renderAILab(); updateEnginePill(); return; }
    fetch('/api/ai/features').then(function (r) { return r.json(); }).then(function (d) {
      AI_FEATURES = d.features || [];
      AI_CATEGORIES = ['All'].concat(d.categories || []);
      renderCategories();
      renderAILab();
      updateEnginePill();
    }).catch(function () { document.getElementById('ai-features-grid').innerHTML = '<p style="color:var(--text-secondary)">AI tools failed to load.</p>'; });
  };

  function updateEnginePill() {
    var el = document.getElementById('ai-status-pill');
    if (!el) return;
    fetch('/api/ai/engines').then(function (r) { return r.json(); }).then(function (s) {
      var e = s.engines || {};
      var badge = e.localRAG ? '<span style="color:#16a34a">🟢 On-device RAG (TF-IDF)</span>' : '⚪ RAG off';
      if (e.openrouter) badge += ' · <span style="color:#2563eb">🟣 OpenRouter LLM</span>';
      if (e.huggingface) badge += ' · <span style="color:#d97706">🟠 HuggingFace</span>';
      el.innerHTML = 'Engines: ' + badge + ' · Corpus: ' + (s.corpusSize || 0).toLocaleString() + ' docs · <small>100% free, no paid key</small>';
    }).catch(function () { el.textContent = 'Engine status unavailable'; });
  }

  function renderCategories() {
    var c = document.getElementById('ai-categories');
    if (!c) return;
    c.innerHTML = AI_CATEGORIES.map(function (cat) {
      return '<button class="btn btn-secondary" style="' + (cat === aiActiveCat ? 'background:var(--accent);color:#fff;' : '') + '" onclick="setAICat(\'' + cat + '\')">' + cat + '</button>';
    }).join('');
  }
  window.setAICat = function (cat) { aiActiveCat = cat; renderCategories(); renderAILab(); };

  window.renderAILab = function () {
    var grid = document.getElementById('ai-features-grid');
    if (!grid) return;
    var q = (document.getElementById('ai-search-box').value || '').toLowerCase();
    var list = AI_FEATURES.filter(function (f) {
      if (aiActiveCat !== 'All' && f.category !== aiActiveCat) return false;
      if (q && (f.title + ' ' + f.blurb).toLowerCase().indexOf(q) === -1) return false;
      return true;
    });
    if (!list.length) { grid.innerHTML = '<p style="color:var(--text-secondary)">No matching tools.</p>'; return; }
    grid.innerHTML = list.map(function (f) {
      return '<div class="card" style="padding:16px;cursor:pointer;" onclick="runAILabTool(\'' + f.id + '\')">' +
        '<div style="font-size:16px;font-weight:700;margin-bottom:6px;">' + f.title + '</div>' +
        '<div style="font-size:12.5px;color:var(--text-secondary);margin-bottom:8px;">' + f.blurb + '</div>' +
        '<span class="badge" style="background:var(--accent-soft);color:var(--accent);padding:3px 8px;border-radius:20px;font-size:11px;">' + f.category + '</span>' +
        ' <span style="font-size:11px;color:var(--text-secondary);">' + f.engine + '</span></div>';
    }).join('');
  };

  window.runAILabTool = function (id) {
    var f = AI_FEATURES.find(function (x) { return x.id === id; });
    if (!f) return;
    var out = document.getElementById('ai-tool-result');
    // Render an inline dynamic form (no blocking prompt() dialogs).
    var formId = 'ai-form-' + id;
    var html = '<div class="card" style="padding:18px;">'
      + '<h3>' + f.title + '</h3>'
      + '<div id="' + formId + '" style="margin:12px 0;display:flex;flex-direction:column;gap:10px;">';
    (f.fields || []).forEach(function (field) {
      if (field.type === 'hidden') return;
      html += '<label style="font-size:13px;color:var(--text-secondary);">' + field.label + '</label>';
      if (field.type === 'select') {
        html += '<select id="' + formId + '-' + field.key + '" style="padding:9px;border-radius:8px;border:1px solid var(--border);background:var(--bg);color:var(--text);">'
          + (field.options || []).map(function (o) { return '<option value="' + o + '">' + o + '</option>'; }).join('') + '</select>';
      } else if (field.type === 'textarea') {
        html += '<textarea id="' + formId + '-' + field.key + '" rows="3" placeholder="' + (field.placeholder || '') + '"' + (field.placeholder ? ' value="' + field.placeholder + '"' : '') + ' style="padding:9px;border-radius:8px;border:1px solid var(--border);background:var(--bg);color:var(--text);font-family:inherit;">' + (field.placeholder || '') + '</textarea>';
      } else {
        html += '<input type="' + (field.type === 'number' ? 'number' : 'text') + '" id="' + formId + '-' + field.key + '" placeholder="' + (field.placeholder || '') + '"' + (field.placeholder ? ' value="' + field.placeholder + '"' : '') + ' style="padding:9px;border-radius:8px;border:1px solid var(--border);background:var(--bg);color:var(--text);">';
      }
    });
    html += '</div>'
      + '<div style="display:flex;gap:10px;">'
      + '<button class="btn btn-accent" onclick="runAILabSubmit(\'' + id + '\')">▶ Run</button>'
      + '<button class="btn btn-secondary" onclick="document.getElementById(\'ai-tool-result\').innerHTML=\'\'">✕ Close</button>'
      + '</div>'
      + '<div id="ai-tool-body" style="font-size:13px;margin-top:14px;"></div>'
      + '</div>';
    out.innerHTML = html;
    // focus first input
    var first = document.querySelector('#' + formId + ' input, #' + formId + ' textarea, #' + formId + ' select');
    if (first) first.focus();
  };

  // Submit the inline form built by runAILabTool.
  window.runAILabSubmit = function (id) {
    var f = AI_FEATURES.find(function (x) { return x.id === id; });
    if (!f) return;
    // Browser-only free features (no endpoint): handle inline.
    if (!f.endpoint) { handleBrowserTool(f, id); return; }
    var formId = 'ai-form-' + id;
    var body = document.getElementById('ai-tool-body');
    if (body) body.innerHTML = '<span style="color:var(--text-secondary)">Running…</span>';

    var params = new URLSearchParams();
    (f.fields || []).forEach(function (field) {
      if (field.type === 'hidden') { if (f.topic) params.set(field.key, f.topic); return; }
      var el = document.getElementById(formId + '-' + field.key);
      var val = el ? el.value.trim() : '';
      if (!val && field.placeholder) val = field.placeholder; // use suggested default if empty
      if (val) params.set(field.key, val);
    });

    // The AyurAI Chat tool uses the REAL free in-browser LLM (flan-t5-small via
    // transformers.js, no API key) when available — grounded on retrieved facts
    // from the 100k+ corpus. Shows a live "AI generating" state and automatically
    // falls back to the server RAG answer if the model isn't loaded/available.
    if (f.id === 'ai-chat' && window.AyurBrain && window.AyurBrain.answer) {
      var q = params.get('message') || '';
      body.innerHTML = '<span style="color:var(--text-secondary)">🤖 Loading free AI (flan-t5) & retrieving facts…</span>';
      window.AyurBrain._warmLLM && window.AyurBrain._warmLLM();
      Promise.race([
        window.AyurBrain.answer(q),
        new Promise(function (_, rej) { setTimeout(function () { rej(new Error('timeout')); }, 30000); })
      ]).then(function (txt) {
        if (txt && txt.indexOf('trouble reaching') === -1) {
          body.innerHTML = '<div style="background:var(--bg-alt);padding:14px;border-radius:8px;line-height:1.6;">' + txt + '</div>';
        } else { return fetch(url).then(function (r) { return r.json(); }).then(function (d) { renderToolJSON(d); }); }
      }).catch(function () { fetch(url).then(function (r) { return r.json(); }).then(renderToolJSON); });
      return;
    }

    // The Translate tool uses the REAL free in-browser NMT model (opus-mt via
    // transformers.js, no API key) when available, with a live loading state and
    // automatic fallback to the server lexicon if the model isn't ready.
    if (f.id === 'translate' && window.AyurBrain && window.AyurBrain.translate) {
      body.innerHTML = '<span style="color:var(--text-secondary)">🌐 Loading free translation model (opus-mt)…</span>';
      var dir = (params.get('target') === 'en') ? 'hi-en' : 'en-hi';
      var txt = params.get('text') || '';
      window.AyurBrain.translate(txt, dir).then(function (res) {
        if (!res || !res.translation) { return fetch(url).then(function (r) { return r.json(); }).then(function (d) { renderToolJSON(d); }); }
        // kick off background model load so repeat translations are instant
        if (window.AyurBrain && window.AyurBrain._warmNMT) window.AyurBrain._warmNMT();
        body.innerHTML = '<div style="background:var(--bg-alt);padding:14px;border-radius:8px;">'
          + '<div style="font-size:12px;color:var(--text-secondary);margin-bottom:6px;">Engine: <b>' + (res.engine || 'nmt') + '</b> · ' + (res.dir === 'hi-en' ? 'Hindi → English' : 'English → Hindi') + '</div>'
          + '<div style="font-size:16px;font-weight:600;">' + escapeHtml(res.source) + '</div>'
          + '<div style="font-size:18px;color:var(--accent);margin-top:8px;">' + escapeHtml(res.translation) + '</div></div>';
      }).catch(function () { fetch(url).then(function (r) { return r.json(); }).then(renderToolJSON); });
      return;
    }
    fetch(url).then(function (r) { return r.json(); }).then(function (d) {
      if (body) body.innerHTML = '<pre style="white-space:pre-wrap;word-break:break-word;font-family:inherit;background:var(--bg-alt);padding:12px;border-radius:8px;">' + escapeHtml(JSON.stringify(d, null, 2)) + '</pre>';
    }).catch(function (e) { if (body) body.innerHTML = 'Error: ' + e.message; });
  };

  // Also expose a chat helper wired to the floating brain (if present)
  window.ayurAIChat = function (message) {
    if (window.AyurBrain && window.AyurBrain.answer) {
      try { return Promise.resolve(window.AyurBrain.answer(message)); } catch (e) {}
    }
    return fetch('/api/ai/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message: message }) })
      .then(function (r) { return r.json(); }).then(function (d) { return d.answer; });
  };

  // ---------- Commercial ----------
  window.initCommercial = function () {
    fetch('/api/commercial/stats').then(function (r) { return r.json(); }).then(function (d) {
      var stats = document.getElementById('commercial-stats');
      if (stats) stats.innerHTML = [
        statCard(d.totalHerbs, 'Herbs (100k+)'), statCard(d.totalDoctors, 'Doctors'),
        statCard(d.totalHospitals, 'Hospitals'), statCard(d.verifiedDoctors, 'Verified+ Doctors'),
        statCard(d.featuredHerbs, 'Featured Herbs')
      ].join('');
      var plans = document.getElementById('plans-list');
      if (plans) plans.innerHTML = (d.plans || []).map(function (p) {
        return '<div style="border:1px solid var(--border);border-radius:10px;padding:10px;margin-bottom:8px;"><b>' + p.name + '</b> — <span style="color:var(--accent)">' + p.price + '</span><br><small>' + (p.features || []).join(' · ') + '</small></div>';
      }).join('') + '<p style="font-size:11px;color:var(--text-secondary)">' + (d.disclaimer || '') + '</p>';
    }).catch(function () {});
    loadRequirements();
  };

  function statCard(n, label) {
    return '<div class="card" style="padding:14px 18px;min-width:120px;"><div style="font-size:22px;font-weight:800;color:var(--accent)">' + (n != null ? n.toLocaleString() : '—') + '</div><div style="font-size:12px;color:var(--text-secondary)">' + label + '</div></div>';
  }

  window.postRequirement = function () {
    var text = document.getElementById('req-text').value;
    var category = document.getElementById('req-category').value;
    var state = document.getElementById('req-state').value;
    if (!text) { alert('Enter a requirement'); return; }
    fetch('/api/requirements', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text: text, category: category, state: state, scope: 'India' }) })
      .then(function (r) { return r.json(); }).then(function (d) {
        document.getElementById('req-text').value = '';
        showToast(d.message || 'Posted', 'success');
        loadRequirements();
      }).catch(function () { showToast('Failed to post', 'error'); });
  };

  window.loadRequirements = function () {
    var list = document.getElementById('requirements-list');
    if (!list) return;
    fetch('/api/requirements').then(function (r) { return r.json(); }).then(function (d) {
      var reqs = d.requirements || [];
      if (!reqs.length) { list.innerHTML = '<span style="color:var(--text-secondary)">No requirements yet — be the first to post.</span>'; return; }
      list.innerHTML = reqs.slice(0, 20).map(function (r) {
        return '<div style="border-bottom:1px solid var(--border);padding:8px 0;"><b>' + escapeHtml(r.text) + '</b><br><small>' + (r.category || '') + ' · ' + (r.state || '') + ' · ' + (r.ts || '').slice(0, 10) + '</small></div>';
      }).join('');
    }).catch(function () { list.innerHTML = 'Failed to load'; });
  };

  function escapeHtml(s) { return String(s).replace(/[&<>"']/g, function (c) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]; }); }
  function renderToolJSON(d) {
    var body = document.getElementById('ai-tool-body');
    if (body) body.innerHTML = '<pre style="white-space:pre-wrap;word-break:break-word;font-family:inherit;background:var(--bg-alt);padding:12px;border-radius:8px;">' + escapeHtml(JSON.stringify(d, null, 2)) + '</pre>';
  }
})();
