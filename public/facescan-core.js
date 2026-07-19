/* ============================================================
   Face Skin Lab — CORE (camera + free on-device AI + detectors)
   No API key. Browser-only. TensorFlow.js + face-landmarks-detection
   (free models auto-downloaded from tfhub/jsdelivr). Everything is
   layered on a deterministic pixel analysis that ALWAYS works offline.
   ============================================================ */
(function () {
  'use strict';

  const CDN_TFJS = 'https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@4.22.0/dist/tf.min.js';
  const CDN_LANDMARKS = 'https://cdn.jsdelivr.net/npm/@tensorflow-models/face-landmarks-detection@1.0.6/dist/face-landmarks-detection.min.js';

  const S = {
    video: null, canvas: null, ctx: null,
    stream: null, raf: null,
    tfReady: false, model: null,
    cdnStatus: 'loading', // loading | live | error
    running: false, lastFull: null
  };

  // ---- tiny pub/sub so html + advice can hook events ----
  const listeners = {};
  function emit(evt, payload) { (listeners[evt] || []).forEach(fn => { try { fn(payload); } catch (e) { console.warn(e); } }); }
  function on(evt, fn) { (listeners[evt] = listeners[evt] || []).push(fn); }

  // =================== CDN LOADING (async, never block UI) ===================
  function loadScript(src) {
    return new Promise((res, rej) => {
      const s = document.createElement('script');
      s.src = src; s.async = true;
      s.onload = () => res();
      s.onerror = () => rej(new Error('Failed to load ' + src));
      document.head.appendChild(s);
    });
  }

  async function ensureTF() {
    if (S.tfReady) return true;
    if (window.tf && window.faceLandmarksDetection) {
      S.tfReady = true; S.cdnStatus = 'live'; return true;
    }
    try {
      if (!window.tf) await loadScript(CDN_TFJS);
      if (!window.faceLandmarksDetection) await loadScript(CDN_LANDMARKS);
      await window.tf.ready();
      S.tfReady = true; S.cdnStatus = 'live';
      emit('cdn', 'live');
      return true;
    } catch (e) {
      console.warn('TFJS CDN load failed:', e);
      S.cdnStatus = 'error';
      emit('cdn', 'error');
      return false;
    }
  }

  // Poll for CDN so the status pill updates even if first use was offline.
  function watchCDN(timeoutMs) {
    const start = Date.now();
    const iv = setInterval(() => {
      if (S.tfReady) { clearInterval(iv); return; }
      if (window.tf && window.faceLandmarksDetection) { ensureTF(); clearInterval(iv); return; }
      if (Date.now() - start > (timeoutMs || 45000)) {
        clearInterval(iv);
        if (!S.tfReady) { S.cdnStatus = 'error'; emit('cdn', 'error'); }
      }
    }, 1500);
  }

  // =================== CAMERA ===================
  async function startCamera() {
    if (S.stream) return true;
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw new Error('Camera API not available in this browser/context. Use https or localhost and grant permission.');
    }
    S.stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
      audio: false
    });
    S.video.srcObject = S.stream;
    await new Promise(r => { S.video.onloadedmetadata = () => r(); });
    await S.video.play();
    return true;
  }

  function stopCamera() {
    if (S.stream) { S.stream.getTracks().forEach(t => t.stop()); S.stream = null; }
  }

  // =================== FACE LANDMARKS (optional, free) ===================
  async function loadFaceModel() {
    if (S.model) return S.model;
    const ok = await ensureTF();
    if (!ok) return null;
    const det = window.faceLandmarksDetection;
    S.model = await det.createDetector(det.SupportedModels.MediaPipeFaceMesh, {
      runtime: 'tfjs',
      refineLandmarks: false,
      maxFaces: 1
    });
    return S.model;
  }

  async function detectFace() {
    if (!S.model || !S.video) return null;
    const faces = await S.model.estimateFaces(S.video, { flipHorizontal: false });
    if (!faces || !faces.length) return null;
    return faces[0];
  }

  // =================== PIXEL ANALYSIS (always works) ===================
  // Draws current video frame to an offscreen canvas and computes skin metrics.
  function sampleFrame(w, h) {
    const c = document.createElement('canvas');
    c.width = w; c.height = h;
    const cx = c.getContext('2d');
    cx.drawImage(S.video, 0, 0, w, h);
    return cx;
  }

  // Convert RGB->HSV, return h(0..360),s,v(0..1)
  function rgb2hsv(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    const mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn;
    let h = 0;
    if (d !== 0) {
      if (mx === r) h = ((g - b) / d) % 6;
      else if (mx === g) h = (b - r) / d + 2;
      else h = (r - g) / d + 4;
      h *= 60; if (h < 0) h += 360;
    }
    const s = mx === 0 ? 0 : d / mx;
    const v = mx;
    return { h, s, v };
  }

  // Bounding box helper for a face detected via landmarks (468 pts) or provided box
  function faceBounds(face, vw, vh) {
    if (face && face.box) {
      const b = face.box;
      return { x: b.xMin, y: b.yMin, w: b.width, h: b.height };
    }
    // fallback: center 60% width, 45%-85% height
    const w = vw * 0.62, h = vh * 0.42;
    return { x: (vw - w) / 2, y: vh * 0.46, w, h };
  }

  // Analyse the face region. Returns raw signals + labelled defects.
  function analyzeFace(face) {
    const vw = S.video.videoWidth || 1280;
    const vh = S.video.videoHeight || 720;
    const b = faceBounds(face, vw, vh);
    const sw = 256, sh = Math.max(1, Math.round(256 * (b.h / b.w)));
    const cx = sampleFrame(sw, sh);
    const img = cx.getImageData(0, 0, sw, sh).data;

    // Map face box to sample coords
    const fx = Math.round(b.x * (sw / vw));
    const fy = Math.round(b.y * (sh / vh));
    const fw = Math.round(b.w * (sw / vw));
    const fh = Math.round(b.h * (sh / vh));

    let n = 0, sr = 0, sg = 0, sb = 0;
    let redPx = 0, brownPx = 0, darkPx = 0, brightPx = 0, yellowPx = 0;
    let minV = 1, maxV = 0;
    const xs = [], ys = [];
    for (let y = fy; y < fy + fh; y++) {
      for (let x = fx; x < fx + fw; x++) {
        const i = (y * sw + x) * 4;
        const r = img[i], g = img[i + 1], bl = img[i + 2];
        sr += r; sg += g; sb += bl; n++;
        const { h, s, v } = rgb2hsv(r, g, bl);
        if (v < minV) minV = v; if (v > maxV) maxV = v;
        // reddish acne / inflammation: warm hue, decent saturation, mid-high value
        if (h < 25 && s > 0.28 && v > 0.45 && v < 0.95) redPx++;
        // brown spots: low-med saturation, low value, warm hue
        if (h > 15 && h < 55 && s > 0.12 && s < 0.5 && v > 0.18 && v < 0.6) brownPx++;
        // dark patches: very low value
        if (v < 0.22) darkPx++;
        // bright/highlight (oily sheen): high value, low saturation
        if (v > 0.92 && s < 0.08) brightPx++;
        // yellowish dullness: hue 40-70, mid sat
        if (h > 38 && h < 72 && s > 0.15 && s < 0.55) yellowPx++;
        xs.push(x); ys.push(y);
      }
    }
    const ar = sr / n, ag = sg / n, ab = sb / n;
    const redFrac = redPx / n;
    const brownFrac = brownPx / n;
    const darkFrac = darkPx / n;
    const brightFrac = brightPx / n;
    const yellowFrac = yellowPx / n;
    const evenness = 1 - (maxV - minV); // 0..1, higher = more even
    const warmth = (ar - ab) / 255; // + warm, - cool

    // Dark circles: compare under-eye band (below eye line ~65-78% of face height)
    // vs upper cheek average luminance.
    const eyeY = Math.round(fy + fh * 0.66);
    const eyeH = Math.max(2, Math.round(fh * 0.12));
    let eyeLum = 0, eyeN = 0, cheekLum = 0, cheekN = 0;
    for (let y = fy + Math.round(fh * 0.30); y < fy + Math.round(fh * 0.55); y++) {
      for (let x = fx; x < fx + fw; x++) {
        const i = (y * sw + x) * 4;
        cheekLum += (img[i] + img[i + 1] + img[i + 2]) / 3; cheekN++;
      }
    }
    for (let y = eyeY; y < eyeY + eyeH; y++) {
      for (let x = fx + Math.round(fw * 0.2); x < fx + Math.round(fw * 0.8); x++) {
        const i = (y * sw + x) * 4;
        eyeLum += (img[i] + img[i + 1] + img[i + 2]) / 3; eyeN++;
      }
    }
    const darkCircleContrast = cheekN ? ((cheekLum / cheekN) - (eyeLum / eyeN)) / 255 : 0;

    // Wrinkle proxy: edge density via simple luminance gradient in mid-face
    const eY0 = fy + Math.round(fh * 0.30), eY1 = fy + Math.round(fh * 0.62);
    let edges = 0, eN = 0;
    for (let y = eY0 + 1; y < eY1 - 1; y++) {
      for (let x = fx + 1; x < fx + fw - 1; x++) {
        const i = (y * sw + x) * 4;
        const here = (img[i] + img[i + 1] + img[i + 2]) / 3;
        const right = (img[i + 4] + img[i + 5] + img[i + 6]) / 3;
        const dImg = (img[(y + 1) * sw + x] + img[(y + 1) * sw + x + 1] + img[(y + 1) * sw + x + 2]) / 3;
        const g = Math.abs(here - right) + Math.abs(here - dImg);
        if (g > 42) edges++;
        eN++;
      }
    }
    const edgeFrac = eN ? edges / eN : 0;

    // ============ DEFECT SCORING (0..100 severity) ============
    const defects = [];
    const push = (key, label, sev, ev) => defects.push({ key, label, severity: Math.max(0, Math.min(100, Math.round(sev))), evidence: ev });

    // Acne / redness
    let sev = redFrac * 900; // ~11% red area => 100
    if (sev > 8) push('acne', 'Acne / Redness', sev, (redFrac * 100).toFixed(1) + '% reddish inflamed pixels');

    // Dark spots / hyperpigmentation
    sev = brownFrac * 700;
    if (sev > 8) push('spots', 'Dark Spots / Pigmentation', sev, (brownFrac * 100).toFixed(1) + '% brown-pigmented pixels');

    // Dark circles
    sev = darkCircleContrast * 320;
    if (sev > 10) push('darkcircles', 'Dark Circles', sev, 'under-eye darker than cheeks by ' + (darkCircleContrast * 100).toFixed(0) + '%');

    // Oily / shine
    sev = brightFrac * 520;
    if (sev > 12) push('oily', 'Oily / Shine', sev, (brightFrac * 100).toFixed(1) + '% specular highlight');

    // Dull / uneven tone
    sev = (yellowFrac * 380) + ((1 - evenness) * 60);
    if (sev > 14) push('dull', 'Dull / Uneven Tone', sev, 'tone evenness ' + (evenness * 100).toFixed(0) + '%');

    // Dryness proxy: low saturation + low value variance (matte, ashen)
    const dryProxy = (1 - (ar > 0 ? Math.min(1, (ar - ab) / 40) : 0)) * 55 + (warmth < -0.02 ? 25 : 0);
    if (darkFrac > 0.06 || dryProxy > 45) push('dry', 'Dry / Rough', Math.max(dryProxy, darkFrac * 300), (darkFrac * 100).toFixed(1) + '% very dark pixels');

    // Wrinkles / fine lines
    sev = edgeFrac * 2400;
    if (sev > 10) push('wrinkles', 'Fine Lines / Wrinkles', sev, 'edge density ' + (edgeFrac * 100).toFixed(1) + '%');

    // Overall skin score (higher = healthier)
    let penalty = 0;
    defects.forEach(d => { penalty += d.severity * (d.key === 'wrinkles' || d.key === 'dry' ? 0.5 : 0.9); });
    const skinScore = Math.max(20, Math.min(100, Math.round(100 - penalty * 0.5 - (1 - evenness) * 20)));

    return {
      metrics: {
        avgRGB: [Math.round(ar), Math.round(ag), Math.round(ab)],
        evenness: Math.round(evenness * 100),
        warmth: +warmth.toFixed(3),
        redFrac: +redFrac.toFixed(4),
        brownFrac: +brownFrac.toFixed(4),
        darkCircleContrast: +darkCircleContrast.toFixed(3),
        brightFrac: +brightFrac.toFixed(4),
        edgeFrac: +edgeFrac.toFixed(4)
      },
      defects,
      skinScore
    };
  }

  // =================== LIVE DRAW LOOP ===================
  function drawOverlay(face) {
    if (!S.ctx) return;
    const w = S.canvas.width, h = S.canvas.height;
    S.ctx.clearRect(0, 0, w, h);
    const vw = S.video.videoWidth, vh = S.video.videoHeight;
    if (!vw) return;
    const sx = w / vw, sy = h / vh;
    // face box
    const b = faceBounds(face, vw, vh);
    S.ctx.strokeStyle = 'rgba(34,197,94,0.9)';
    S.ctx.lineWidth = 2;
    S.ctx.strokeRect(b.x * sx, b.y * sy, b.w * sx, b.h * sy);
    if (face && face.keypoints) {
      S.ctx.fillStyle = 'rgba(34,197,94,0.55)';
      for (const k of face.keypoints) {
        if (k.x < b.x || k.x > b.x + b.w || k.y < b.y || k.y > b.y + b.h) continue;
        S.ctx.beginPath();
        S.ctx.arc(k.x * sx, k.y * sy, 1.4, 0, Math.PI * 2);
        S.ctx.fill();
      }
    }
  }

  function loop(face) {
    if (!S.running) return;
    drawOverlay(face);
    S.raf = requestAnimationFrame(() => step());
  }

  async function step() {
    if (!S.running) return;
    let face = null;
    if (S.model) { try { face = await detectFace(); } catch (e) {} }
    drawOverlay(face);
    S.raf = requestAnimationFrame(() => step());
  }

  function startLive() {
    S.running = true;
    step();
  }
  function stopLive() {
    S.running = false;
    if (S.raf) cancelAnimationFrame(S.raf);
    S.raf = null;
    if (S.ctx) S.ctx.clearRect(0, 0, S.canvas.width, S.canvas.height);
  }

  // One-shot full analysis (used by "Analyze" + auto-interval)
  async function capture(opts) {
    opts = opts || {};
    const face = (S.model && !opts.skipModel) ? await detectFace() : null;
    const result = analyzeFace(face);
    result.faceDetected = !!face;
    result.modelUsed = !!(S.model && face);
    result.timestamp = Date.now();
    if (opts.draw !== false) drawOverlay(face);
    S.lastFull = result;
    emit('result', result);
    return result;
  }

  // =================== PUBLIC API ===================
  window.FaceScan = {
    init(video, canvas) {
      S.video = video; S.canvas = canvas;
      S.ctx = canvas.getContext('2d');
      watchCDN(45000);
    },
    async startCamera() { await startCamera(); },
    stopCamera,
    async enableFaceAI() { await loadFaceModel(); return !!S.model; },
    startLive, stopLive, capture, analyzeFace,
    getModelState() { return { tfReady: S.tfReady, cdnStatus: S.cdnStatus, hasModel: !!S.model }; },
    isCameraOn() { return !!S.stream; },
    on,
    getLast() { return S.lastFull; }
  };

  // Auto-expose CDN readiness for the UI pill
  window.addEventListener('load', () => { watchCDN(45000); });
})();
