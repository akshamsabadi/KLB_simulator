// KLB Simulator — Procedural Analytical Spectra/Gels, 6 Wet-Lab Minigames & 4-Slide Vijay Auditor
// Classic browser script attaching to window.KLB.Spectra, window.KLB.Minigames, window.KLB.SlideBuilder
window.KLB = window.KLB || {};

(() => {
  // ==================== DETERMINISTIC SEEDED PRNG ====================
  function hashString(str) {
    let h = 2166136261 >>> 0;
    const s = String(str || 'klb_default');
    for (let i = 0; i < s.length; i++) {
      h ^= s.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  }

  function makeRng(seedStr) {
    let a = hashString(seedStr) || 123456789;
    return () => {
      a |= 0;
      a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function clamp(v, lo, hi) {
    const n = Number(v);
    return Number.isFinite(n) ? Math.max(lo, Math.min(hi, n)) : lo;
  }

  function playSfxSafe(name) {
    if (window.KLB && window.KLB.Audio && typeof window.KLB.Audio.playSfx === 'function') {
      window.KLB.Audio.playSfx(name);
    }
  }

  function iconSvg(name, size = 14, extraClass = '') {
    if (window.KLB && window.KLB.Icons && typeof window.KLB.Icons.svg === 'function') {
      return window.KLB.Icons.svg(name, size, extraClass);
    }
    return '';
  }

  function escHtml(str) {
    return String(str == null ? '' : str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function parseYieldPct(item, roundVal = true) {
    if (!item || item.yieldPct === undefined || item.yieldPct === null || item.yieldPct === '') return null;
    const n = Number(item.yieldPct);
    if (!Number.isFinite(n)) return null;
    const clamped = clamp(n, 0, 100);
    return roundVal ? Math.round(clamped) : clamped;
  }

  function formatFigureMetrics(fig) {
    if (!fig) return '';
    const q = Math.round(getQuality(fig, 0));
    const y = parseYieldPct(fig, true);
    return y !== null ? `Quality ${q}% / Yield ${y}%` : `Quality ${q}%`;
  }

  function drawTopMetaMetrics(ctx, w, item, compact, yPos, padR) {
    const q = Math.round(getQuality(item, 85));
    const yieldPct = parseYieldPct(item, true);
    const qText = `Quality: ${q}%`;
    const yText = yieldPct !== null ? `Yield: ${yieldPct}%` : '';
    const qCol = q >= 80 ? '#86efac' : q >= 78 ? '#fde68a' : '#fca5a5';
    const yCol = yieldPct !== null ? (yieldPct >= 75 ? '#86efac' : yieldPct >= 60 ? '#93c5fd' : '#fde68a') : '#94a3b8';

    ctx.save();
    ctx.font = `bold ${compact ? 8.5 : 10.5}px Consolas, monospace`;
    ctx.textAlign = 'right';
    let cursorX = w - padR;

    if (yText) {
      ctx.fillStyle = yCol;
      ctx.fillText(yText, cursorX, yPos);
      cursorX -= ctx.measureText(yText).width + (compact ? 6 : 8);

      ctx.fillStyle = '#64748b';
      ctx.fillText('|', cursorX, yPos);
      cursorX -= ctx.measureText('|').width + (compact ? 6 : 8);
    }

    ctx.fillStyle = qCol;
    ctx.fillText(qText, cursorX, yPos);
    ctx.restore();
  }

  // Vector canvas indicator helpers (emoji-free crisp geometry for analytical spectra & minigames)
  function drawVectorWarning(ctx, cx, cy, r = 4.5, fillCol = '#f59e0b', markCol = '#090d16') {
    ctx.save();
    ctx.fillStyle = fillCol;
    ctx.beginPath();
    ctx.moveTo(cx, cy - r);
    ctx.lineTo(cx + r * 0.95, cy + r * 0.8);
    ctx.lineTo(cx - r * 0.95, cy + r * 0.8);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = markCol;
    ctx.fillRect(cx - 0.8, cy - r * 0.38, 1.6, r * 0.65);
    ctx.fillRect(cx - 0.8, cy + r * 0.38, 1.6, r * 0.25);
    ctx.restore();
  }

  function drawVectorCheck(ctx, cx, cy, r = 5, col = '#22c55e') {
    ctx.save();
    ctx.strokeStyle = col;
    ctx.lineWidth = 1.7;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(cx - r * 0.65, cy);
    ctx.lineTo(cx - r * 0.15, cy + r * 0.5);
    ctx.lineTo(cx + r * 0.7, cy - r * 0.55);
    ctx.stroke();
    ctx.restore();
  }

  function drawVectorProhibited(ctx, cx, cy, r = 5.5, col = '#ef4444') {
    ctx.save();
    ctx.strokeStyle = col;
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.moveTo(cx - r * 0.7, cy - r * 0.7);
    ctx.lineTo(cx + r * 0.7, cy + r * 0.7);
    ctx.stroke();
    ctx.restore();
  }

  function drawVectorDiamond(ctx, cx, cy, r = 4, col = '#86efac') {
    ctx.save();
    ctx.fillStyle = col;
    ctx.beginPath();
    ctx.moveTo(cx, cy - r);
    ctx.lineTo(cx + r * 0.8, cy);
    ctx.lineTo(cx, cy + r);
    ctx.lineTo(cx - r * 0.8, cy);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  function drawVectorDownArrow(ctx, cx, cy, r = 4, col = '#86efac') {
    ctx.save();
    ctx.fillStyle = col;
    ctx.beginPath();
    ctx.moveTo(cx - r, cy - r * 0.6);
    ctx.lineTo(cx + r, cy - r * 0.6);
    ctx.lineTo(cx, cy + r * 0.75);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  // =========================================================================
  // A. PROCEDURAL SPECTRA & GEL RENDERER (window.KLB.Spectra)
  // =========================================================================
  function setupHiDpiCanvas(canvas, cssW, cssH) {
    if (!canvas) return { ctx: null, dpr: 1, w: Number(cssW) || 680, h: Number(cssH) || 300 };
    const dpr = Math.min(2, (typeof window !== 'undefined' && window.devicePixelRatio) || 1);
    const w = Math.max(1, Number(cssW) || 680);
    const h = Math.max(1, Number(cssH) || 300);
    const backW = Math.round(w * dpr);
    const backH = Math.round(h * dpr);
    canvas.width = backW;
    canvas.height = backH;
    canvas._klbCssW = w;
    canvas._klbCssH = h;
    canvas._klbBackW = backW;
    canvas._klbBackH = backH;
    if (canvas.style) {
      canvas.style.imageRendering = 'auto';
      if (!canvas.style.width) canvas.style.width = `${w}px`;
      if (!canvas.style.height) canvas.style.height = `${h}px`;
    }
    const ctx = canvas.getContext ? canvas.getContext('2d') : null;
    if (ctx && typeof ctx.setTransform === 'function') {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    return { ctx, dpr, w, h };
  }

  function fitCanvasText(ctx, text, maxWidth) {
    const raw = String(text || '');
    if (!ctx || typeof ctx.measureText !== 'function' || maxWidth <= 0) return raw;
    if (ctx.measureText(raw).width <= maxWidth) return raw;
    let out = raw;
    while (out.length > 2 && ctx.measureText(`${out}…`).width > maxWidth) {
      out = out.slice(0, -1);
    }
    return `${out}…`;
  }

  function renderToCanvas(canvas, rawItem, opts) {
    if (!canvas || !canvas.getContext) return;
    const item = Object.assign({
      id: 'spec_preview',
      type: 'nmr',
      label: 'Raw Analytical Sample',
      productPeak: 'Target Product',
      quality: 85,
      hasSolventPeak: false,
      hasAdduct: false,
      hasOverReduction: false,
      hasBlueDyeMishap: false,
      notes: ''
    }, rawItem || {});

    const sameBack = canvas._klbCssW && canvas.width === canvas._klbBackW && canvas.height === canvas._klbBackH;
    const cssW = (opts && Number(opts.width)) || (sameBack ? canvas._klbCssW : (Number(canvas.width) || 680));
    const cssH = (opts && Number(opts.height)) || (sameBack ? canvas._klbCssH : (Number(canvas.height) || 300));
    const { ctx, w, h } = setupHiDpiCanvas(canvas, cssW, cssH);
    if (!ctx) return;

    ctx.save();
    ctx.clearRect(0, 0, w, h);

    const rng = makeRng(`${item.id}|${item.type}|${item.label}|${item.quality}`);
    const t = String(item.type || 'nmr').toLowerCase();

    if (t === 'tlc') {
      drawTlcPlate(ctx, w, h, item, rng);
    } else if (t === 'gel') {
      drawSdsPageGel(ctx, w, h, item, rng);
    } else if (t === 'nmr') {
      drawBrukerNmr(ctx, w, h, item, rng);
    } else {
      drawMaxEntLcms(ctx, w, h, item, rng);
    }

    ctx.restore();
  }

  function getQuality(item, fallback = 85) {
    if (!item || item.quality === undefined || item.quality === null || item.quality === '') return fallback;
    const n = Number(item.quality);
    return Number.isFinite(n) ? clamp(n, 0, 100) : fallback;
  }

  // -------------------- 1. TLC / LATERAL-FLOW / ELLMAN DTNB UV-VIS --------------------
  function drawTlcPlate(ctx, w, h, item, rng) {
    const compact = w < 440;
    const q = getQuality(item, 80);
    const poor = q < 78;
    const tlcMeta = `${item.stain || ''} ${item.label || ''} ${item.productPeak || ''} ${item.notes || ''} ${item.metricLabel || ''}`;

    // 1A) Lateral-Flow Nitrocellulose Strip (dan_step_5)
    if (/lateral.?flow|nc-?95/i.test(tlcMeta)) {
      ctx.fillStyle = '#090e1a';
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
      ctx.fillRect(0, 0, w, compact ? 20 : 26);
      ctx.fillStyle = '#cbd5e1';
      ctx.font = `bold ${compact ? 9.5 : 11.5}px Consolas, monospace`;
      ctx.textAlign = 'left';
      ctx.fillText(
        compact ? 'NC-95 Lateral Flow' : 'NC-95 Lateral-Flow Strip Array • HER2 (0–50 nM)',
        10,
        compact ? 14 : 18
      );
      drawTopMetaMetrics(ctx, w, item, compact, compact ? 14 : 18, compact ? 8 : 12);

      const strips = [
        { title: '50 nM HER2', y: compact ? 36 : 52, sh: compact ? 34 : 58, hasTest: true, testInt: poor ? 0.42 : 0.95 },
        { title: '0 nM Blank', y: compact ? 84 : 136, sh: compact ? 34 : 58, hasTest: poor, testInt: poor ? 0.35 : 0 }
      ];
      const sx = compact ? 14 : 26;
      const sw = w - sx - (compact ? 114 : 200);
      const padW = sw * 0.17;
      const conjW = sw * 0.14;
      const wickW = sw * 0.17;
      const ncX = sx + padW + conjW;
      const ncW = sw - padW - conjW - wickW;

      strips.forEach(st => {
        // Cassette backing
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(sx - 4, st.y - 4, sw + 8, st.sh + 8);
        // Sample pad
        ctx.fillStyle = '#cbd5e1';
        ctx.fillRect(sx, st.y, padW, st.sh);
        // AuNP conjugate pad
        ctx.fillStyle = '#fda4af';
        ctx.fillRect(sx + padW, st.y, conjW, st.sh);
        // White NC-95 nitrocellulose strip
        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(ncX, st.y, ncW, st.sh);
        // Absorbent wick
        ctx.fillStyle = '#e2e8f0';
        ctx.fillRect(ncX + ncW, st.y, wickW, st.sh);

        if (poor) {
          ctx.fillStyle = 'rgba(190, 18, 60, 0.16)';
          ctx.fillRect(ncX, st.y, ncW, st.sh);
        }

        // Test line (T) at 38% across NC-95, Control line (C) at 72%
        const tX = ncX + ncW * 0.38;
        const cX = ncX + ncW * 0.72;
        const lineW = compact ? 4 : 6;
        if (st.hasTest && st.testInt > 0) {
          ctx.fillStyle = `rgba(190, 18, 60, ${st.testInt})`;
          ctx.fillRect(tX - lineW / 2, st.y + 2, lineW, st.sh - 4);
        }
        ctx.fillStyle = 'rgba(185, 28, 28, 0.94)';
        ctx.fillRect(cX - lineW / 2, st.y + 2, lineW, st.sh - 4);

        ctx.fillStyle = '#334155';
        ctx.font = `bold ${compact ? 8 : 9.5}px Consolas, monospace`;
        ctx.textAlign = 'center';
        ctx.fillText('T', tX, st.y + st.sh + (compact ? 9 : 13));
        ctx.fillText('C', cX, st.y + st.sh + (compact ? 9 : 13));

        // Right callout inside < w - 6
        const rx = sx + sw + 10;
        const maxRW = w - 6 - rx;
        ctx.textAlign = 'left';
        ctx.fillStyle = '#e2e8f0';
        ctx.font = `bold ${compact ? 8.5 : 10.5}px Consolas, monospace`;
        ctx.fillText(fitCanvasText(ctx, st.title, maxRW), rx, st.y + (compact ? 11 : 18));
        ctx.fillStyle = st.title.includes('Blank')
          ? (poor ? '#fca5a5' : '#86efac')
          : (poor ? '#fde68a' : '#fda4af');
        ctx.font = `${compact ? 8 : 9.5}px Consolas, monospace`;
        const statusTxt = st.title.includes('Blank')
          ? (poor ? 'False T bleed!' : 'Clean (C only)')
          : (poor ? 'Weak T / smear' : 'Ruby T+C (85 pM)');
        ctx.fillText(fitCanvasText(ctx, statusTxt, maxRW), rx, st.y + (compact ? 24 : 36));
      });

      if (!compact) {
        ctx.fillStyle = '#94a3b8';
        ctx.font = '10px Consolas, monospace';
        ctx.textAlign = 'left';
        ctx.fillText('Running buffer: Serum + 0.1% Tween 20 on NC-95 nitrocellulose', 26, h - 18);
      }
      return;
    }

    // 1B) Ellman DTNB UV-Vis 412 nm Absorbance Audit (antoine_step_2)
    if (/ellman|dtnb|a412/i.test(tlcMeta)) {
      ctx.fillStyle = '#090f1d';
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = '#13203b';
      ctx.fillRect(0, 0, w, compact ? 20 : 26);
      ctx.fillStyle = '#fde68a';
      ctx.font = `bold ${compact ? 9.5 : 11.5}px Consolas, monospace`;
      ctx.textAlign = 'left';
      ctx.fillText(
        compact ? 'Ellman DTNB (412 nm)' : 'Ellman DTNB UV-Vis Assay • 412 nm Free-Thiol Audit',
        10,
        compact ? 14 : 18
      );
      drawTopMetaMetrics(ctx, w, item, compact, compact ? 14 : 18, compact ? 8 : 12);

      const padL = compact ? 34 : 46;
      const padR = 14;
      const padB = compact ? 24 : 32;
      const plotTop = compact ? 30 : 42;
      const baseY = h - padB;
      const plotW = Math.max(1, w - padL - padR);
      const plotH = Math.max(1, baseY - plotTop);
      const wlMin = 320, wlMax = 520;
      const wlToX = wl => padL + ((wl - wlMin) / (wlMax - wlMin)) * plotW;

      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(padL, plotTop);
      ctx.lineTo(padL, baseY);
      ctx.lineTo(w - padR, baseY);
      ctx.stroke();

      // 412 nm vertical marker
      const x412 = wlToX(412);
      ctx.setLineDash([4, 3]);
      ctx.strokeStyle = 'rgba(250, 204, 21, 0.55)';
      ctx.beginPath();
      ctx.moveTo(x412, plotTop);
      ctx.lineTo(x412, baseY);
      ctx.stroke();
      ctx.setLineDash([]);

      // Unconjugated thiol reference trace (dashed amber)
      ctx.strokeStyle = 'rgba(251, 191, 36, 0.50)';
      ctx.lineWidth = 1.4;
      ctx.setLineDash([4, 3]);
      ctx.beginPath();
      for (let i = 0; i <= plotW; i++) {
        const wl = wlMin + (i / plotW) * (wlMax - wlMin);
        const refVal = 0.72 * Math.exp(-0.5 * Math.pow((wl - 412) / 21, 2)) + 0.08 * Math.exp(-0.5 * Math.pow((wl - 332) / 14, 2));
        const y = baseY - refVal * plotH * 0.88;
        if (i === 0) ctx.moveTo(padL + i, y);
        else ctx.lineTo(padL + i, y);
      }
      ctx.stroke();
      ctx.setLineDash([]);

      // Sample trace (flat A412 = 0.002 when clean; strong 412 nm TNB2- peak when poor)
      const samplePeak = poor ? 0.34 : 0.004;
      ctx.strokeStyle = poor ? '#f87171' : '#38bdf8';
      ctx.lineWidth = 2.0;
      ctx.beginPath();
      for (let i = 0; i <= plotW; i++) {
        const wl = wlMin + (i / plotW) * (wlMax - wlMin);
        const dtnb = 0.14 * Math.exp(-0.5 * Math.pow((wl - 326) / 11, 2));
        const tnb = samplePeak * Math.exp(-0.5 * Math.pow((wl - 412) / 21, 2));
        const val = dtnb + tnb + (rng() - 0.5) * 0.004;
        const y = baseY - clamp(val, 0, 1) * plotH * 0.88;
        if (i === 0) ctx.moveTo(padL + i, y);
        else ctx.lineTo(padL + i, y);
      }
      ctx.stroke();

      ctx.fillStyle = '#fde68a';
      ctx.font = `${compact ? 8.5 : 10}px Consolas, monospace`;
      ctx.textAlign = 'left';
      ctx.fillText(compact ? 'Ref (-SH)' : 'Reduced mAb Ctrl (A412 = 0.68)', x412 + 6, plotTop + 14);
      ctx.fillStyle = poor ? '#fca5a5' : '#86efac';
      ctx.font = `bold ${compact ? 9 : 11}px Consolas, monospace`;
      ctx.fillText(
        poor ? 'Sample A412 = 0.245 (Free -SH!)' : 'Sample A412 = 0.002 (0.0 -SH)',
        clamp(x412 + 6, padL + 4, w - (compact ? 165 : 220)),
        baseY - (poor ? samplePeak * plotH * 0.88 + 8 : 16)
      );

      ctx.fillStyle = '#cbd5e1';
      ctx.font = `${compact ? 8.5 : 10}px Consolas, monospace`;
      ctx.textAlign = 'center';
      [340, 380, 412, 460, 500].forEach(wl => {
        const tx = wlToX(wl);
        ctx.fillText(`${wl}`, tx, baseY + (compact ? 14 : 17));
      });
      ctx.textAlign = 'right';
      ctx.fillStyle = '#94a3b8';
      ctx.fillText('λ (nm)', w - padR, baseY + (compact ? 22 : 28));
      return;
    }

    // 1C) Silica / RP-TLC Plate (UV 254 nm or KMnO4 Permanganate)
    const isKmno4 = /kmno4|permanganate|char/i.test(tlcMeta);
    const isRpTlc = /rp-?tlc/i.test(tlcMeta);
    const isPlga = /plga|nile-?red|encapsulat/i.test(tlcMeta);

    // Dark Lab 230 UV Viewing Cabinet backdrop
    const bgGrad = ctx.createRadialGradient(w * 0.5, h * 0.15, 10, w * 0.5, h * 0.5, w * 0.7);
    bgGrad.addColorStop(0, isKmno4 ? '#1e1624' : '#16112b');
    bgGrad.addColorStop(1, '#070a12');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, w, h);

    if (!isKmno4) {
      const uvGlow = ctx.createLinearGradient(0, 0, 0, h * 0.22);
      uvGlow.addColorStop(0, 'rgba(168, 85, 247, 0.36)');
      uvGlow.addColorStop(1, 'rgba(168, 85, 247, 0)');
      ctx.fillStyle = uvGlow;
      ctx.fillRect(0, 0, w, h * 0.22);
    }

    // Top metadata strip & header text
    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    ctx.fillRect(0, 0, w, compact ? 20 : 26);
    ctx.fillStyle = '#cbd5e1';
    ctx.font = `bold ${compact ? 9.5 : 11.5}px Consolas, monospace`;
    ctx.textAlign = 'left';
    const headerTitle = isRpTlc
      ? (compact ? 'RP-TLC (254 nm)' : 'RP-TLC C18 Plate • λ = 254 nm')
      : isKmno4
        ? (compact ? 'KMnO4 + UV TLC' : 'KMnO4 Dip + Heat-Gun Char TLC')
        : (compact ? 'UV 254 nm TLC Plate' : 'CAMAG UV Cabinet • λ = 254 nm (Silica 60 F254)');
    ctx.fillText(headerTitle, 10, compact ? 14 : 18);
    drawTopMetaMetrics(ctx, w, item, compact, compact ? 14 : 18, compact ? 8 : 12);

    // Aluminium-backed Silica Plate positioned so right labels fit cleanly inside < w - 6
    const pw = compact ? Math.min(126, w * 0.38) : Math.min(w * 0.42, h * 0.92);
    const ph = compact ? h * 0.76 : h * 0.80;
    const px = compact ? 14 : Math.round((w - pw) * 0.38);
    const py = compact ? Math.round(h * 0.17) : Math.round(h * 0.13);

    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(px - 2, py - 2, pw + 4, ph + 4);

    const plateGrad = ctx.createLinearGradient(px, py, px + pw, py + ph);
    if (isKmno4) {
      plateGrad.addColorStop(0, '#9d3b72');
      plateGrad.addColorStop(1, '#7e2a59');
    } else if (isRpTlc) {
      plateGrad.addColorStop(0, '#8fe3a8');
      plateGrad.addColorStop(1, '#68c488');
    } else {
      plateGrad.addColorStop(0, '#9ef58a');
      plateGrad.addColorStop(0.5, '#86ef74');
      plateGrad.addColorStop(1, '#6fd95e');
    }
    ctx.fillStyle = plateGrad;
    ctx.fillRect(px, py, pw, ph);

    ctx.fillStyle = isKmno4 ? 'rgba(255,220,240,0.06)' : 'rgba(20,60,25,0.06)';
    for (let i = 0; i < 80; i++) {
      ctx.fillRect(px + rng() * pw, py + rng() * ph, 1.5, 1.5);
    }

    const frontY = py + ph * 0.14;
    const baseY = py + ph * 0.84;
    const runDist = baseY - frontY;

    ctx.strokeStyle = isKmno4 ? 'rgba(255,255,255,0.55)' : 'rgba(30, 41, 59, 0.65)';
    ctx.lineWidth = 1.1;
    ctx.setLineDash([4, 3]);
    ctx.beginPath();
    ctx.moveTo(px + 6, frontY);
    ctx.lineTo(px + pw - 6, frontY);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.beginPath();
    ctx.moveTo(px + 6, baseY);
    ctx.lineTo(px + pw - 6, baseY);
    ctx.stroke();

    const lanes = isPlga
      ? [
          { lbl: 'Dye', x: px + pw * 0.23 },
          { lbl: 'Co',  x: px + pw * 0.50 },
          { lbl: 'NPs', x: px + pw * 0.77 }
        ]
      : [
          { lbl: 'SM',  x: px + pw * 0.23 },
          { lbl: 'Co',  x: px + pw * 0.50 },
          { lbl: 'Rxn', x: px + pw * 0.77 }
        ];

    const rfMatch = String(item.productPeak || '').match(/Rf\s*(?:=|\s)\s*(0\.\d+)/i);
    const parsedRf = rfMatch ? clamp(parseFloat(rfMatch[1]), 0.00, 0.85) : 0.56;
    const prodRf = isPlga ? 0.00 : parsedRf;
    const smRf = isPlga ? (rfMatch ? clamp(parseFloat(rfMatch[1]), 0.35, 0.78) : 0.55) : clamp(prodRf - 0.30, 0.14, 0.32);

    function drawSpot(cx, rf, rx, ry, alpha, colorMode = 'auto') {
      const cy = baseY - rf * runDist;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.scale(1, ry / Math.max(1, rx));
      const g = ctx.createRadialGradient(0, 0, rx * 0.1, 0, 0, rx);
      if (colorMode === 'magenta') {
        g.addColorStop(0, `rgba(190, 24, 93, ${alpha})`);
        g.addColorStop(0.65, `rgba(219, 39, 119, ${alpha * 0.7})`);
        g.addColorStop(1, 'rgba(219, 39, 119, 0)');
      } else if (isKmno4 || colorMode === 'yellow') {
        g.addColorStop(0, `rgba(253, 224, 71, ${alpha})`);
        g.addColorStop(0.65, `rgba(202, 138, 4, ${alpha * 0.7})`);
        g.addColorStop(1, 'rgba(202, 138, 4, 0)');
      } else {
        g.addColorStop(0, `rgba(46, 16, 101, ${alpha})`);
        g.addColorStop(0.6, `rgba(76, 29, 149, ${alpha * 0.72})`);
        g.addColorStop(1, 'rgba(76, 29, 149, 0)');
      }
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(0, 0, rx, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      return cy;
    }

    ctx.fillStyle = isKmno4 ? '#f8fafc' : '#1e293b';
    ctx.font = `bold ${compact ? 9.5 : 11}px Consolas, monospace`;
    ctx.textAlign = 'center';
    lanes.forEach(ln => {
      ctx.beginPath();
      ctx.moveTo(ln.x, baseY - 3);
      ctx.lineTo(ln.x, baseY + 3);
      ctx.stroke();
      ctx.fillText(ln.lbl, ln.x, baseY + (compact ? 12 : 16));
    });

    const rSpot = Math.max(6, pw * 0.075);
    if (isPlga) {
      // Dye lane: free Nile Red at smRf (0.55)
      drawSpot(lanes[0].x, smRf, rSpot, rSpot * 0.78, 0.90, 'magenta');
      // Co lane: encapsulated baseline NPs + free dye
      drawSpot(lanes[1].x, 0.00, rSpot * 0.92, rSpot * 0.72, 0.85, 'magenta');
      drawSpot(lanes[1].x, smRf, rSpot * 0.82, rSpot * 0.68, 0.76, 'magenta');
      // NPs lane: strong encapsulated PLGA-NPs at Rf = 0.00; minimal free dye unless poor
      drawSpot(lanes[2].x, 0.00, rSpot * 1.12, rSpot * 0.82, 0.96, 'magenta');
      drawSpot(lanes[2].x, smRf, rSpot * (poor ? 0.95 : 0.45), rSpot * (poor ? 0.75 : 0.35), poor ? 0.88 : 0.18, 'magenta');
    } else {
      drawSpot(lanes[0].x, smRf, rSpot, rSpot * 0.78, 0.90);
      drawSpot(lanes[0].x, 0.0, rSpot * 0.45, rSpot * 0.35, 0.28);

      drawSpot(lanes[1].x, smRf, rSpot * 0.85, rSpot * 0.7, 0.78);
      drawSpot(lanes[1].x, prodRf, rSpot * 0.85, rSpot * 0.7, 0.82);
      drawSpot(lanes[1].x, 0.0, rSpot * 0.5, rSpot * 0.4, 0.32);

      if (poor) {
        const streakTop = baseY - Math.max(0.15, prodRf) * runDist;
        const sg = ctx.createLinearGradient(0, streakTop, 0, baseY);
        sg.addColorStop(0, isKmno4 ? 'rgba(250,204,21,0.35)' : 'rgba(67,20,110,0.38)');
        sg.addColorStop(1, isKmno4 ? 'rgba(180,83,9,0.55)' : 'rgba(46,16,101,0.55)');
        ctx.fillStyle = sg;
        ctx.fillRect(lanes[2].x - rSpot * 0.45, streakTop, rSpot * 0.9, baseY - streakTop);

        drawSpot(lanes[2].x, 0.0, rSpot * 1.05, rSpot * 0.62, 0.88);
        drawSpot(lanes[2].x, smRf, rSpot * 0.88, rSpot * 0.72, 0.76);
        drawSpot(lanes[2].x, Math.min(0.88, prodRf + 0.22), rSpot * 0.65, rSpot * 0.48, 0.62);
        drawSpot(lanes[2].x, prodRf, rSpot * 0.95, rSpot * 0.82, 0.80);
      } else {
        drawSpot(lanes[2].x, 0.0, rSpot * 0.42, rSpot * 0.32, 0.22);
        drawSpot(lanes[2].x, prodRf, rSpot * 1.08, rSpot * 0.82, 0.94);
      }
    }

    // Right-hand callout tags strictly fitted inside < w - 6
    ctx.textAlign = 'left';
    const tagX = px + pw + (compact ? 8 : 10);
    const maxTagW = Math.max(40, w - 6 - tagX);
    const prodY = baseY - prodRf * runDist;
    const smY = baseY - smRf * runDist;

    ctx.strokeStyle = '#4ade80';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(px + pw - 3, prodY);
    ctx.lineTo(tagX - 3, prodY);
    ctx.stroke();
    ctx.fillStyle = '#86efac';
    ctx.font = `bold ${compact ? 9 : 11.5}px Consolas, monospace`;
    const prodLbl = isPlga
      ? (compact ? 'PLGA NPs Rf=0.00' : 'PLGA-PEG NPs Rf = 0.00')
      : (compact ? `Prod Rf = ${prodRf.toFixed(2)}` : `Product Rf = ${prodRf.toFixed(2)}`);
    ctx.fillText(fitCanvasText(ctx, prodLbl, maxTagW), tagX, prodY + (isPlga ? -2 : 4));

    ctx.strokeStyle = poor ? '#f87171' : '#94a3b8';
    ctx.beginPath();
    ctx.moveTo(px + pw - 3, smY);
    ctx.lineTo(tagX - 3, smY);
    ctx.stroke();
    ctx.fillStyle = poor ? '#fca5a5' : '#cbd5e1';
    const smLbl = isPlga
      ? (poor ? `Free Dye Rf=${smRf.toFixed(2)}!` : `Free Dye Rf=${smRf.toFixed(2)}`)
      : (poor ? `SM Rf = ${smRf.toFixed(2)}!` : (compact ? `SM Rf = ${smRf.toFixed(2)}` : `SM Ref Rf = ${smRf.toFixed(2)}`));
    ctx.fillText(fitCanvasText(ctx, smLbl, maxTagW), tagX, smY + 4);

    ctx.fillStyle = '#94a3b8';
    ctx.font = `${compact ? 8.5 : 10.5}px Consolas, monospace`;
    ctx.fillText(fitCanvasText(ctx, compact ? 'Front' : 'Solvent Front', maxTagW), tagX, frontY + 4);
    if (!isPlga) {
      if (poor) {
        drawVectorWarning(ctx, tagX + 4, baseY, compact ? 3.5 : 4.3, '#f87171', '#070a12');
        ctx.fillStyle = '#fca5a5';
        ctx.fillText(fitCanvasText(ctx, compact ? 'Baseline Tailing!' : 'Baseline Tailing / Gunk', maxTagW - 12), tagX + 12, baseY + 4);
      } else {
        ctx.fillText(fitCanvasText(ctx, compact ? 'Clean Origin' : 'Clean Origin Baseline', maxTagW), tagX, baseY + 4);
      }
    }
  }

  // -------------------- 2. COOMASSIE / FLUOR / MOBILITY SDS-PAGE GEL --------------------
  function drawSdsPageGel(ctx, w, h, item, rng) {
    const compact = w < 420;
    const q = getQuality(item, 82);
    const overRed = Boolean(item.hasOverReduction) || q < 78;
    const blueMishap = Boolean(item.hasBlueDyeMishap);
    const gelMeta = `${item.label || ''} ${item.productPeak || ''} ${item.notes || ''} ${item.metricLabel || ''}`;
    const isSynab = /147(?:\.\d+)?\s*kda|\bsynab\b/i.test(gelMeta);
    const hasDualFluor = /dual-?fluor|fluorescence\s*sds|495\/?646|cy5|coumarin|hsa.*gsh|turn-on/i.test(gelMeta);
    const isFabPanel = /sequential\s*fab|fabher2\s*digest|fab\/fc\s*panel/i.test(gelMeta);

    // 8 distinct biochemical visual modes
    let gelMode = 'hhll';
    if (item.gelMode && ['hhll', 'fab_48', 'vnar_tricine', 'reducing', 'aunp_ruby', 'dual_fluor', 'native_shift', 'hsa_monomer'].includes(item.gelMode)) {
      gelMode = item.gelMode;
    } else if (/aunp|529\s*nm|colloidal\s*mobility|ruby-?red/i.test(gelMeta)) {
      gelMode = 'aunp_ruby';
    } else if (/tricine|vnar|depletion/i.test(gelMeta)) {
      gelMode = 'vnar_tricine';
    } else if (hasDualFluor) {
      gelMode = 'dual_fluor';
    } else if (/native\s+her2|antigen-?shift|fcrn\s*complex/i.test(gelMeta)) {
      gelMode = 'native_shift';
    } else if (/reducing\s+sds-?page/i.test(gelMeta) && !/non-?reducing/i.test(gelMeta)) {
      gelMode = 'reducing';
    } else if (/hsa|albumin|66\.5\s*kda/i.test(gelMeta)) {
      gelMode = 'hsa_monomer';
    } else if (!isSynab && (isFabPanel || /fab|48(?:\.\d+)?\s*kda|fc\s*panel|digest/i.test(gelMeta))) {
      gelMode = 'fab_48';
    }

    const isDarkFluor = gelMode === 'dual_fluor';
    const isHsaFluor = gelMode === 'dual_fluor' && /hsa|coumarin|66\.5/i.test(gelMeta);
    const isFcrnShift = gelMode === 'native_shift' && /fcrn/i.test(gelMeta);
    const isMultiFab = gelMode === 'fab_48' && /3-antibody|fabcd3|fccd20/i.test(gelMeta);
    const isSynabHhll = gelMode === 'hhll' && isSynab;

    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, w, h);

    const lx = compact ? 8 : 18;
    const ly = compact ? 21 : 28;
    const lw = w - lx * 2;
    const lh = h - ly - (compact ? 8 : 14);

    if (isDarkFluor) {
      ctx.fillStyle = '#070c16';
    } else {
      const lightGrad = ctx.createLinearGradient(lx, ly, lx, ly + lh);
      lightGrad.addColorStop(0, '#f1f5f9');
      lightGrad.addColorStop(1, '#dbeafe');
      ctx.fillStyle = lightGrad;
    }
    ctx.beginPath();
    ctx.roundRect ? ctx.roundRect(lx, ly, lw, lh, 8) : ctx.rect(lx, ly, lw, lh);
    ctx.fill();

    // Header banner
    const headerMap = {
      fab_48: compact ? 'SDS-PAGE: 48 kDa Fab' : '12% Non-Reducing SDS-PAGE • Sequential Fab Digest',
      vnar_tricine: compact ? '16% Tricine: VNAR' : '16% Tricine SDS-PAGE • Shark VNAR Depletion',
      reducing: compact ? 'Reducing SDS-PAGE' : 'Reducing SDS-PAGE (+DTT) • HC / LC Chains',
      aunp_ruby: compact ? 'AuNP Mobility Gel' : 'Colloidal Mobility Shift Gel • 40 nm AuNP (529 nm)',
      hsa_monomer: compact ? 'SDS-PAGE: 66.5 kDa HSA' : '12% Non-Reducing SDS-PAGE • Monomeric HSA (66.5 kDa)',
      dual_fluor: isHsaFluor
        ? (compact ? 'Fluor PAGE: HSA/GSH' : 'Fluorescence SDS-PAGE • HSA Non-Transfer vs GSH')
        : (compact ? 'Dual-Fluor SDS-PAGE' : 'Dual-Fluorescence (495/646 nm) + Coomassie Gel'),
      native_shift: isFcrnShift
        ? (compact ? 'FcRn Shift Gel' : 'pH 6.0 vs 7.4 FcRn Complex Shift SDS-PAGE')
        : (compact ? 'Native HER2 Shift' : 'Native HER2 Antigen-Shift Gel • Binding Check'),
      hhll: isSynabHhll
        ? (compact ? 'SDS-PAGE: 147 kDa SynAb' : '10% SDS-PAGE • Tri-Protein SynAb / CiTE (147.3 kDa)')
        : (compact ? 'SDS-PAGE (Coomassie)' : '4–15% Mini-PROTEAN SDS-PAGE • Coomassie Stain')
    };

    ctx.fillStyle = isDarkFluor ? '#67e8f9' : '#93c5fd';
    ctx.font = `bold ${compact ? 9.5 : 11.5}px Consolas, monospace`;
    ctx.textAlign = 'left';
    ctx.fillText(headerMap[gelMode], lx, compact ? 14 : 18);
    drawTopMetaMetrics(ctx, w, item, compact, compact ? 14 : 18, compact ? 8 : 18);

    // Gel slab geometry (compact gives generous room for short non-clipping right callouts)
    const gx = lx + (compact ? 38 : 74);
    const gy = ly + (compact ? 6 : 8);
    const gw = lw - (compact ? 142 : 214);
    const gh = lh - (compact ? 12 : 16);

    if (isDarkFluor) {
      ctx.fillStyle = '#0b1424';
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.45)';
    } else if (gelMode === 'aunp_ruby') {
      ctx.fillStyle = 'rgba(199, 210, 254, 0.30)';
      ctx.strokeStyle = 'rgba(79, 70, 229, 0.42)';
    } else {
      const gelGrad = ctx.createLinearGradient(gx, gy, gx + gw, gy + gh);
      gelGrad.addColorStop(0, 'rgba(96, 165, 250, 0.32)');
      gelGrad.addColorStop(0.5, 'rgba(59, 130, 246, 0.25)');
      gelGrad.addColorStop(1, 'rgba(37, 99, 235, 0.36)');
      ctx.fillStyle = gelGrad;
      ctx.strokeStyle = 'rgba(30, 64, 175, 0.45)';
    }
    ctx.lineWidth = 1.5;
    ctx.fillRect(gx, gy, gw, gh);
    ctx.strokeRect(gx, gy, gw, gh);

    // Lane titles per mode
    const laneNamesByMode = {
      fab_48: isMultiFab ? ['Ladder', 'FabHER2', 'FabCD3', 'FcCD20'] : ['Ladder', 'Ctrl IgG', 'Pepsin', 'Fab Prod'],
      vnar_tricine: ['Ladder', 'Input', 'Ctrl NP', 'N3-NP Sup'],
      reducing: ['Ladder', 'Native', 'Red Ctrl', 'Dha mAb'],
      aunp_ruby: ['Ladder', 'Bare Au', 'PBS Fail', 'BSA-N3'],
      hsa_monomer: ['Ladder', 'Untreated', 'Cys34 Act', 'HSA Prod'],
      dual_fluor: isHsaFluor ? ['Ladder', 'HSA', 'HSA+SMDC', '5mM GSH'] : ['Ladder', 'mAb', 'Dox4', 'Dox4-Cy5'],
      native_shift: isFcrnShift ? ['Ladder', 'mAb', 'pH 6.0', 'pH 7.4'] : ['Ladder', 'Herceptin', 'mAb+HER2', 'ADC+HER2'],
      hhll: isSynabHhll ? ['Ladder', 'Fab Input', 'Crude Mix', 'Pure SynAb'] : ['Ladder', 'Ctrl mAb', 'Reduced', 'Product']
    };
    const laneNames = laneNamesByMode[gelMode];
    const laneW = gw / 4;
    const wellTop = gy + 4;
    const wellBottom = gy + (compact ? 14 : 20);

    ctx.font = `bold ${compact ? 7.5 : 10.5}px Segoe UI, sans-serif`;
    ctx.textAlign = 'center';
    laneNames.forEach((name, idx) => {
      const wx = gx + idx * laneW + laneW * 0.16;
      const ww = laneW * 0.68;
      ctx.fillStyle = isDarkFluor ? 'rgba(30, 41, 59, 0.85)' : 'rgba(255, 255, 255, 0.68)';
      ctx.fillRect(wx, wellTop, ww, wellBottom - wellTop);
      ctx.strokeStyle = isDarkFluor ? 'rgba(94, 234, 212, 0.45)' : 'rgba(30, 58, 138, 0.4)';
      ctx.strokeRect(wx, wellTop, ww, wellBottom - wellTop);

      ctx.fillStyle = isDarkFluor ? '#cbd5e1' : '#1e3a8a';
      ctx.fillText(name, gx + (idx + 0.5) * laneW, wellBottom + (compact ? 9 : 13));
    });

    const bandTop = wellBottom + (compact ? 14 : 22);
    const bandSpan = gh - (bandTop - gy) - 10;
    const mwToY = kda => {
      const logMax = Math.log10(gelMode === 'vnar_tricine' ? 110 : 270);
      const logMin = Math.log10(gelMode === 'vnar_tricine' ? 6.5 : 9.5);
      const frac = (logMax - Math.log10(clamp(kda, 6.5, 270))) / (logMax - logMin);
      return bandTop + clamp(frac, 0.02, 0.98) * bandSpan;
    };

    function drawGelBand(laneIdx, kda, intensity, thickness = 4.5, colorOverride = null, glowCol = null) {
      const cx = gx + (laneIdx + 0.5) * laneW;
      const bw = laneW * 0.58;
      const y = mwToY(kda);
      const th = compact ? thickness * 0.78 : thickness;

      ctx.save();
      if (glowCol) {
        ctx.shadowColor = glowCol;
        ctx.shadowBlur = compact ? 7 : 12;
      }
      const g = ctx.createLinearGradient(cx - bw / 2, y - th / 2, cx - bw / 2, y + th / 2);
      const col = colorOverride || (isDarkFluor ? '56, 189, 248' : '23, 37, 84');
      g.addColorStop(0, `rgba(${col}, 0.08)`);
      g.addColorStop(0.3, `rgba(${col}, ${intensity})`);
      g.addColorStop(0.7, `rgba(${col}, ${intensity})`);
      g.addColorStop(1, `rgba(${col}, 0.08)`);
      ctx.fillStyle = g;

      ctx.beginPath();
      ctx.moveTo(cx - bw / 2, y - th / 2);
      ctx.quadraticCurveTo(cx, y - th / 2 + 1.2, cx + bw / 2, y - th / 2);
      ctx.lineTo(cx + bw / 2, y + th / 2);
      ctx.quadraticCurveTo(cx, y + th / 2 + 1.2, cx - bw / 2, y + th / 2);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
      return y;
    }

    // MW Ladder
    const ladderBands = gelMode === 'vnar_tricine'
      ? [
          { kda: 75, pink: true, showLbl: true },
          { kda: 50, pink: false, showLbl: true },
          { kda: 37, pink: false, showLbl: false },
          { kda: 25, pink: true, showLbl: true },
          { kda: 20, pink: false, showLbl: false },
          { kda: 15, pink: false, showLbl: true },
          { kda: 10, pink: true, showLbl: true }
        ]
      : [
          { kda: 250, pink: true, showLbl: true },
          { kda: 150, pink: false, showLbl: true },
          { kda: 100, pink: false, showLbl: false },
          { kda: 75,  pink: true, showLbl: true },
          { kda: 50,  pink: false, showLbl: true },
          { kda: 37,  pink: false, showLbl: false },
          { kda: 25,  pink: true, showLbl: true },
          { kda: 15,  pink: false, showLbl: true }
        ];

    ctx.font = `bold ${compact ? 7.5 : 10}px Consolas, monospace`;
    ctx.textAlign = 'right';
    ladderBands.forEach(b => {
      const col = isDarkFluor
        ? (b.pink ? '244, 114, 182' : '148, 163, 184')
        : (b.pink ? '157, 23, 77' : '30, 58, 138');
      const y = drawGelBand(0, b.kda, isDarkFluor ? 0.65 : 0.85, 3.4, col);
      if (b.showLbl) {
        ctx.fillStyle = isDarkFluor ? '#94a3b8' : (b.pink ? '#9d174d' : '#1e293b');
        ctx.fillText(compact ? `${b.kda}` : `${b.kda} kDa`, gx - 4, y + 3);
      }
    });

    // Helper for blue loading-dye smear on lane 3
    if (blueMishap) {
      const sx = gx + 3 * laneW + laneW * 0.14;
      const sw = laneW * 0.72;
      const smear = ctx.createLinearGradient(sx, wellTop, sx, gy + gh - 4);
      smear.addColorStop(0, 'rgba(2, 132, 199, 0.88)');
      smear.addColorStop(0.55, 'rgba(14, 165, 233, 0.65)');
      smear.addColorStop(1, 'rgba(3, 105, 161, 0.92)');
      ctx.fillStyle = smear;
      ctx.fillRect(sx, wellTop + 2, sw, gy + gh - wellTop - 8);
    }

    // Right margin callouts container (guaranteed inside < w - 6!)
    const rx = gx + gw + (compact ? 6 : 8);
    const maxRW = Math.max(40, w - 6 - rx);
    ctx.textAlign = 'left';
    ctx.font = `bold ${compact ? 8.5 : 10.5}px Consolas, monospace`;

    if (gelMode === 'fab_48') {
      if (isMultiFab) {
        drawGelBand(1, 48.1, 0.94, 6.0);
        drawGelBand(2, 47.6, 0.92, 6.0);
        drawGelBand(3, 49.9, overRed ? 0.55 : 0.94, 6.2);
        if (overRed) drawGelBand(3, 25, 0.72, 4.4, '185, 28, 28');
      } else {
        drawGelBand(1, 150, 0.92, 6.0);
        drawGelBand(2, 100, 0.88, 5.6);
        if (overRed) {
          drawGelBand(3, 48, 0.52, 4.8);
          drawGelBand(3, 25, 0.80, 5.0, '185, 28, 28');
        } else {
          drawGelBand(3, 48, 0.96, 6.6);
          drawGelBand(3, 150, 0.08, 2.5);
        }
      }
      const y48 = mwToY(48);
      if (overRed) {
        drawVectorWarning(ctx, rx + 4, y48 - 1, compact ? 3.5 : 4.2, '#dc2626', '#ffffff');
        ctx.fillStyle = '#dc2626';
        ctx.fillText(fitCanvasText(ctx, compact ? '25 kDa Frag!' : '25 kDa Reduced Fab!', maxRW - 11), rx + 11, mwToY(25) + 3);
        ctx.fillStyle = '#334155';
        ctx.fillText(fitCanvasText(ctx, compact ? '48 kDa (Weak)' : '48 kDa Fab (Weak)', maxRW), rx, y48 + 3);
      } else {
        drawVectorCheck(ctx, rx + 4, y48 - 1, compact ? 3.5 : 4.3, '#15803d');
        ctx.fillStyle = '#15803d';
        ctx.fillText(fitCanvasText(ctx, compact ? '48 kDa Fab' : '48 kDa Crisp Fab Band', maxRW - 11), rx + 11, y48 + 3);
        ctx.fillStyle = '#475569';
        ctx.fillText(fitCanvasText(ctx, compact ? '150 kDa IgG' : '150 kDa IgG Consumed', maxRW), rx, mwToY(150) + 3);
      }
    } else if (gelMode === 'vnar_tricine') {
      drawGelBand(1, 12, 0.94, 6.2);
      drawGelBand(2, 12, 0.86, 5.8);
      drawGelBand(3, 12, overRed ? 0.68 : 0.16, overRed ? 5.2 : 3.2, overRed ? '185, 28, 28' : '30, 58, 138');
      const y12 = mwToY(12);
      if (overRed) {
        drawVectorWarning(ctx, rx + 4, y12 - 1, compact ? 3.5 : 4.2, '#dc2626', '#ffffff');
        ctx.fillStyle = '#dc2626';
        ctx.fillText(fitCanvasText(ctx, compact ? 'Weak Uptake!' : 'Poor VNAR Depletion!', maxRW - 11), rx + 11, y12 + 3);
      } else {
        drawVectorCheck(ctx, rx + 4, y12 - 1, compact ? 3.5 : 4.3, '#15803d');
        ctx.fillStyle = '#15803d';
        ctx.fillText(fitCanvasText(ctx, compact ? '12 kDa -88%' : '12 kDa VNAR (-88% Sup.)', maxRW - 11), rx + 11, y12 + 3);
        ctx.fillStyle = '#475569';
        ctx.fillText(fitCanvasText(ctx, compact ? 'Input Ctrl' : 'Input / Ctrl NP Bands', maxRW), rx, mwToY(25) + 3);
      }
    } else if (gelMode === 'reducing') {
      drawGelBand(1, 150, 0.90, 5.8);
      drawGelBand(2, 50, 0.90, 5.6);
      drawGelBand(2, 25, 0.84, 4.8);
      if (overRed) {
        drawGelBand(3, 50, 0.56, 4.8);
        drawGelBand(3, 25, 0.58, 4.2);
        drawGelBand(3, 37, 0.72, 4.6, '185, 28, 28');
        drawGelBand(3, 15, 0.62, 4.0, '185, 28, 28');
      } else {
        drawGelBand(3, 50, 0.95, 6.2);
        drawGelBand(3, 25, 0.88, 5.0);
      }
      if (overRed) {
        drawVectorWarning(ctx, rx + 4, mwToY(37) - 1, compact ? 3.5 : 4.2, '#dc2626', '#ffffff');
        ctx.fillStyle = '#dc2626';
        ctx.fillText(fitCanvasText(ctx, compact ? 'HC Cleavage!' : 'Over-Cleaved Fragments!', maxRW - 11), rx + 11, mwToY(37) + 3);
      } else {
        drawVectorCheck(ctx, rx + 4, mwToY(50) - 1, compact ? 3.5 : 4.3, '#15803d');
        ctx.fillStyle = '#15803d';
        ctx.fillText(fitCanvasText(ctx, compact ? '50 kDa H' : '50 kDa Heavy (HC Dha)', maxRW - 11), rx + 11, mwToY(50) + 3);
        ctx.fillStyle = '#334155';
        ctx.fillText(fitCanvasText(ctx, compact ? '25 kDa L' : '25 kDa Intact Light (L)', maxRW), rx, mwToY(25) + 3);
      }
    } else if (gelMode === 'aunp_ruby') {
      // Bare Au & PBS fail aggregate in well top (250 kDa); BSA-N3 runs as crisp ruby-red 529 nm band!
      drawGelBand(1, 240, 0.88, 7.5, '55, 48, 82');
      drawGelBand(2, 235, 0.85, 7.2, '68, 51, 102');
      if (overRed) {
        drawGelBand(3, 235, 0.78, 7.2, '55, 48, 82');
        drawGelBand(3, 110, 0.40, 5.2, '190, 18, 60');
      } else {
        drawGelBand(3, 110, 0.96, 8.2, '220, 38, 68');
      }
      const yAu = mwToY(110);
      if (overRed) {
        drawVectorWarning(ctx, rx + 4, mwToY(235) - 1, compact ? 3.5 : 4.2, '#dc2626', '#ffffff');
        ctx.fillStyle = '#dc2626';
        ctx.fillText(fitCanvasText(ctx, compact ? 'Well Agg.!' : 'Purple Well Aggregation!', maxRW - 11), rx + 11, mwToY(235) + 3);
      } else {
        drawVectorCheck(ctx, rx + 4, yAu - 1, compact ? 3.5 : 4.3, '#be123c');
        ctx.fillStyle = '#be123c';
        ctx.fillText(fitCanvasText(ctx, compact ? 'Ruby 529 nm' : 'Ruby 529 nm Corona Band', maxRW - 11), rx + 11, yAu + 3);
        ctx.fillStyle = '#475569';
        ctx.fillText(fitCanvasText(ctx, compact ? 'Bare Well Agg' : 'Bare Au Stalled in Well', maxRW), rx, mwToY(235) + 3);
      }
    } else if (gelMode === 'hsa_monomer') {
      // 66.5 kDa Monomeric HSA (with ~133 kDa disulfide dimer if unreduced/flawed)
      drawGelBand(1, 66.5, 0.80, 5.6);
      drawGelBand(1, 133, 0.48, 4.4);
      drawGelBand(2, 66.5, 0.90, 5.8);
      drawGelBand(2, 133, 0.14, 3.0);
      if (overRed) {
        drawGelBand(3, 66.5, 0.56, 4.8);
        drawGelBand(3, 133, 0.82, 5.6, '185, 28, 28');
        drawVectorWarning(ctx, rx + 4, mwToY(133) - 1, compact ? 3.5 : 4.2, '#dc2626', '#ffffff');
        ctx.fillStyle = '#dc2626';
        ctx.fillText(fitCanvasText(ctx, compact ? '133 kDa Dimer!' : '133 kDa HSA Dimer!', maxRW - 11), rx + 11, mwToY(133) + 3);
        ctx.fillStyle = '#334155';
        ctx.fillText(fitCanvasText(ctx, compact ? '66.5 kDa (Weak)' : '66.5 kDa HSA (Weak)', maxRW), rx, mwToY(66.5) + 3);
      } else {
        drawGelBand(3, 66.5, 0.96, 6.6);
        drawGelBand(3, 133, 0.06, 2.4);
        drawVectorCheck(ctx, rx + 4, mwToY(66.5) - 1, compact ? 3.5 : 4.4, '#15803d');
        ctx.fillStyle = '#15803d';
        ctx.fillText(fitCanvasText(ctx, compact ? '66.5 kDa HSA' : '66.5 kDa HSA Monomer', maxRW - 11), rx + 11, mwToY(66.5) + 3);
        ctx.fillStyle = '#475569';
        ctx.fillText(fitCanvasText(ctx, compact ? 'No 133 Dimer' : '133 kDa Dimer Absent', maxRW), rx, mwToY(133) + 3);
      }
    } else if (gelMode === 'dual_fluor') {
      if (isHsaFluor) {
        // Marcos Step 5: 66.5 kDa HSA lanes completely dark (Coomassie ghost only), 5 mM GSH glows bright cyan-green!
        drawGelBand(1, 66.5, 0.45, 5.2, '59, 130, 246');
        drawGelBand(2, 66.5, overRed ? 0.75 : 0.42, 5.2, overRed ? '74, 222, 128' : '59, 130, 246', overRed ? '#4ade80' : null);
        drawGelBand(3, 15, overRed ? 0.45 : 0.96, 6.8, '52, 211, 153', '#22d3ee');
        if (overRed) {
          drawVectorWarning(ctx, rx + 4, mwToY(66.5) - 1, compact ? 3.5 : 4.2, '#f87171', '#070c16');
          ctx.fillStyle = '#fca5a5';
          ctx.fillText(fitCanvasText(ctx, compact ? 'HSA Leak!' : 'Albumin Fluor Transfer!', maxRW - 11), rx + 11, mwToY(66.5) + 3);
        } else {
          drawVectorCheck(ctx, rx + 4, mwToY(15) - 1, compact ? 3.5 : 4.3, '#4ade80');
          ctx.fillStyle = '#6ee7b7';
          ctx.fillText(fitCanvasText(ctx, compact ? '42x GSH Glow' : '42x GSH Release Glow', maxRW - 11), rx + 11, mwToY(15) + 3);
          ctx.fillStyle = '#94a3b8';
          ctx.fillText(fitCanvasText(ctx, compact ? '66.5 kDa Dark' : '66.5 kDa HSA Dark (0%)', maxRW), rx, mwToY(66.5) + 3);
        }
      } else {
        // Antoine Step 5: Dual-Fluorescence 495/646 nm + Coomassie 150 kDa
        drawGelBand(1, 150, 0.42, 5.8, '59, 130, 246');
        drawGelBand(2, 150, 0.92, 6.2, '74, 222, 128', '#4ade80');
        if (overRed) {
          drawGelBand(3, 150, 0.48, 5.0, '34, 211, 238', '#22d3ee');
          drawGelBand(3, 75, 0.85, 5.6, '248, 113, 113', '#f87171');
          drawVectorWarning(ctx, rx + 4, mwToY(75) - 1, compact ? 3.5 : 4.2, '#f87171', '#070c16');
          ctx.fillStyle = '#fca5a5';
          ctx.fillText(fitCanvasText(ctx, compact ? '75 kDa HL!' : '75 kDa Half-mAb Split!', maxRW - 11), rx + 11, mwToY(75) + 3);
        } else {
          drawGelBand(3, 150, 0.96, 6.8, '34, 211, 238', '#4ade80');
          drawGelBand(3, 150, 0.72, 3.6, '167, 243, 208', '#22d3ee');
          drawVectorCheck(ctx, rx + 4, mwToY(150) - 1, compact ? 3.5 : 4.3, '#4ade80');
          ctx.fillStyle = '#6ee7b7';
          ctx.fillText(fitCanvasText(ctx, compact ? 'Dox+Cy5 150' : 'Co-localised 150 kDa', maxRW - 11), rx + 11, mwToY(150) + 3);
          ctx.fillStyle = '#94a3b8';
          ctx.fillText(fitCanvasText(ctx, compact ? '495 / 646 nm' : '495 nm Dox + 646 nm Cy5', maxRW), rx, mwToY(100) + 3);
        }
      }
    } else if (gelMode === 'native_shift') {
      if (isFcrnShift) {
        drawGelBand(1, 150, 0.92, 6.0);
        drawGelBand(2, 210, overRed ? 0.48 : 0.94, 6.6);
        if (overRed) drawGelBand(2, 150, 0.65, 5.0, '185, 28, 28');
        drawGelBand(3, 150, 0.92, 6.0);
        drawGelBand(3, 45, 0.76, 4.4);
        if (overRed) {
          drawVectorWarning(ctx, rx + 4, mwToY(210) - 1, compact ? 3.5 : 4.2, '#dc2626', '#ffffff');
          ctx.fillStyle = '#dc2626';
          ctx.fillText(fitCanvasText(ctx, compact ? 'Weak pH 6.0!' : 'Incomplete FcRn Bind!', maxRW - 11), rx + 11, mwToY(210) + 3);
        } else {
          drawVectorCheck(ctx, rx + 4, mwToY(210) - 1, compact ? 3.5 : 4.3, '#15803d');
          ctx.fillStyle = '#15803d';
          ctx.fillText(fitCanvasText(ctx, compact ? 'pH 6 Shift' : 'pH 6.0 FcRn Complex', maxRW - 11), rx + 11, mwToY(210) + 3);
          ctx.fillStyle = '#475569';
          ctx.fillText(fitCanvasText(ctx, compact ? 'pH 7.4 Free' : 'pH 7.4 Clean Release', maxRW), rx, mwToY(150) + 3);
        }
      } else {
        drawGelBand(1, 150, 0.92, 6.0);
        drawGelBand(2, 235, 0.94, 6.8);
        drawGelBand(3, 235, overRed ? 0.50 : 0.95, 6.8);
        if (overRed) drawGelBand(3, 150, 0.68, 5.0, '185, 28, 28');
        if (overRed) {
          drawVectorWarning(ctx, rx + 4, mwToY(150) - 1, compact ? 3.5 : 4.2, '#dc2626', '#ffffff');
          ctx.fillStyle = '#dc2626';
          ctx.fillText(fitCanvasText(ctx, compact ? 'Unbound ADC!' : 'Lost HER2 Binding!', maxRW - 11), rx + 11, mwToY(150) + 3);
        } else {
          drawVectorCheck(ctx, rx + 4, mwToY(235) - 1, compact ? 3.5 : 4.3, '#15803d');
          ctx.fillStyle = '#15803d';
          ctx.fillText(fitCanvasText(ctx, compact ? 'HER2 Shift' : '100% HER2 Shift Band', maxRW - 11), rx + 11, mwToY(235) + 3);
          ctx.fillStyle = '#475569';
          ctx.fillText(fitCanvasText(ctx, compact ? '150 kDa Free' : '150 kDa Unbound Ctrl', maxRW), rx, mwToY(150) + 3);
        }
      }
    } else if (isSynabHhll) {
      // 147.3 kDa Tri-Protein SynAb / CiTE intact band
      drawGelBand(1, 48, 0.90, 5.8);
      drawGelBand(2, 147.3, 0.72, 5.4);
      drawGelBand(2, 98, 0.42, 4.0);
      drawGelBand(2, 48, 0.50, 4.4);
      if (overRed) {
        drawGelBand(3, 147.3, 0.52, 4.8);
        drawGelBand(3, 48, 0.78, 5.2, '185, 28, 28');
        drawVectorWarning(ctx, rx + 4, mwToY(48) - 1, compact ? 3.5 : 4.2, '#dc2626', '#ffffff');
        ctx.fillStyle = '#dc2626';
        ctx.fillText(fitCanvasText(ctx, compact ? '48 kDa Unclicked!' : 'Unclicked 48 kDa Fab Mix!', maxRW - 11), rx + 11, mwToY(48) + 3);
        ctx.fillStyle = '#334155';
        ctx.fillText(fitCanvasText(ctx, compact ? '147 kDa (Weak)' : '147.3 kDa SynAb (Weak)', maxRW), rx, mwToY(147.3) + 3);
      } else {
        drawGelBand(3, 147.3, 0.96, 6.8);
        drawGelBand(3, 48, 0.08, 2.4);
        drawVectorCheck(ctx, rx + 4, mwToY(147.3) - 1, compact ? 3.5 : 4.4, '#15803d');
        ctx.fillStyle = '#15803d';
        ctx.fillText(fitCanvasText(ctx, compact ? '147 kDa SynAb' : '147.3 kDa SynAb', maxRW - 11), rx + 11, mwToY(147.3) + 3);
        ctx.fillStyle = '#475569';
        ctx.fillText(fitCanvasText(ctx, compact ? '48 kDa Fab In' : '48 kDa Fab Consumed', maxRW), rx, mwToY(48) + 3);
      }
    } else {
      // Classic 150 kDa HHLL mAb conjugate
      drawGelBand(1, 150, 0.94, 6.2);
      drawGelBand(1, 75, 0.12, 3.0);
      drawGelBand(2, 50, 0.90, 5.8);
      drawGelBand(2, 25, 0.82, 4.8);
      drawGelBand(2, 75, 0.18, 3.2);

      if (overRed) {
        drawGelBand(3, 150, 0.45, 5.0);
        drawGelBand(3, 75,  0.88, 5.8, '185, 28, 28');
        drawGelBand(3, 50,  0.66, 4.6);
        drawGelBand(3, 25,  0.58, 4.2);
      } else {
        drawGelBand(3, 150, 0.96, 6.8);
        drawGelBand(3, 75,  0.14 + (100 - q) * 0.005, 3.0);
      }

      const y150 = mwToY(150);
      if (overRed) {
        ctx.fillStyle = '#334155';
        ctx.fillText(fitCanvasText(ctx, compact ? '150 kDa Weak' : '150 kDa HHLL (Weak)', maxRW), rx, y150 + 3);
      } else {
        drawVectorCheck(ctx, rx + 4, y150 - 1, compact ? 3.5 : 4.5, '#15803d');
        ctx.fillStyle = '#15803d';
        ctx.fillText(fitCanvasText(ctx, compact ? '150 kDa HHLL' : '150 kDa Rebridged HHLL', maxRW - 11), rx + 11, y150 + 3);
      }

      const y75 = mwToY(75);
      if (overRed) {
        drawVectorWarning(ctx, rx + 4, y75 - 1, compact ? 3.5 : 4.3, '#dc2626', '#ffffff');
        ctx.fillStyle = '#dc2626';
        ctx.fillText(fitCanvasText(ctx, compact ? '75 kDa HL!' : '75 kDa HL Half-mAb!', maxRW - 11), rx + 11, y75 + 3);
        drawVectorWarning(ctx, rx + 4, mwToY(50) - 1, compact ? 3.5 : 4.3, '#dc2626', '#ffffff');
        ctx.fillText(fitCanvasText(ctx, compact ? '50H / 25L!' : '50 H / 25 L Fragments', maxRW - 11), rx + 11, mwToY(50) + 3);
      } else {
        ctx.fillStyle = '#475569';
        ctx.fillText(fitCanvasText(ctx, compact ? '50 kDa (H)' : '50 kDa (H) [Red. Ctrl]', maxRW), rx, mwToY(50) + 3);
        ctx.fillText(fitCanvasText(ctx, compact ? '25 kDa (L)' : '25 kDa (L) [Red. Ctrl]', maxRW), rx, mwToY(25) + 3);
      }
    }

    if (blueMishap) {
      drawVectorWarning(ctx, rx + 4, gy + gh - 14, compact ? 3.5 : 4.3, '#0369a1', '#ffffff');
      ctx.fillStyle = '#0369a1';
      ctx.fillText(fitCanvasText(ctx, compact ? 'Blue LDS!' : 'Blue LDS Dye Spill!', maxRW - 11), rx + 11, gy + gh - 10);
    }
  }

  // -------------------- 3. BRUKER TOPSPIN 1H / 31P NMR SPECTRUM --------------------
  function drawBrukerNmr(ctx, w, h, item, rng) {
    const compact = w < 440;
    const q = getQuality(item, 85);
    const hasSolvent = Boolean(item.hasSolventPeak) || q < 78;
    const nmrMeta = `${item.label || ''} ${item.productPeak || ''} ${item.notes || ''} ${item.metricLabel || ''}`;

    // Check explicit CDCl3 first before defaulting to DMSO-d6
    const explicitCdCl3 = /cdcl3/i.test(nmrMeta);
    const explicitDmso = /dmso/i.test(nmrMeta);
    const useDmso = explicitDmso || (!explicitCdCl3 && /hydrogel|folate|peptide|pabc|phenazepam/i.test(nmrMeta));
    const mhzMatch = nmrMeta.match(/(\d{3})\s*MHz/i);
    const freqMhz = mhzMatch ? mhzMatch[1] : '600';
    const isVt = /vt-?nmr|120\s*c|393\s*k|coalesc/i.test(nmrMeta);
    const tempK = isVt ? '393 K' : '298 K';
    const is31P = /31p/i.test(nmrMeta);

    // Crisp Bruker TopSpin dark-slate scientific theme
    ctx.fillStyle = '#090f1d';
    ctx.fillRect(0, 0, w, h);

    ctx.fillStyle = '#13203b';
    ctx.fillRect(0, 0, w, compact ? 20 : 26);
    ctx.fillStyle = '#93c5fd';
    ctx.font = `bold ${compact ? 9.5 : 11.5}px Consolas, monospace`;
    ctx.textAlign = 'left';
    const solvStr = useDmso ? 'DMSO-d6' : 'CDCl3';
    ctx.fillText(
      is31P
        ? (compact ? `31P NMR (${solvStr})` : `Bruker Neo ${freqMhz} MHz • 31P{1H} NMR (${solvStr}, ${tempK})`)
        : (compact ? `1H NMR (${solvStr})` : `Bruker Neo ${freqMhz} MHz • 1H NMR (${solvStr}, ${tempK})`),
      10,
      compact ? 13 : 17
    );
    drawTopMetaMetrics(ctx, w, item, compact, compact ? 13 : 17, compact ? 8 : 10);

    const padL = 18;
    const padR = 18;
    const padB = compact ? 28 : 36;
    const baseY = h - padB;
    const plotTop = compact ? 30 : 40;
    const plotH = Math.max(1, baseY - plotTop);
    const plotW = Math.max(1, Math.floor(w - padL - padR));

    // 31P{1H} NMR branch (max_step_2)
    if (is31P) {
      const pMax = 40, pMin = -35;
      const pToX = p => padL + ((pMax - p) / (pMax - pMin)) * plotW;
      const xToP = px => pMax - ((px - padL) / plotW) * (pMax - pMin);

      ctx.strokeStyle = 'rgba(148, 163, 184, 0.11)';
      ctx.lineWidth = 1;
      for (let p = 40; p >= -30; p -= 10) {
        const gx = pToX(p);
        ctx.beginPath(); ctx.moveTo(gx, plotTop); ctx.lineTo(gx, baseY); ctx.stroke();
      }

      const pPeaks = [
        { ppm: -17.4, amp: hasSolvent ? 0.56 : 0.94, w: 0.28, isFlaw: false },
        { ppm: 29.5, amp: hasSolvent ? 0.88 : 0.03, w: 0.30, isFlaw: hasSolvent }
      ];
      const cleanVals = new Float32Array(plotW + 1);
      const flawVals = new Float32Array(plotW + 1);
      for (let i = 0; i <= plotW; i++) {
        const ppm = xToP(padL + i);
        let vc = (rng() - 0.5) * 0.01;
        let vf = 0;
        for (const pk of pPeaks) {
          const d = (ppm - pk.ppm) / pk.w;
          const lor = pk.amp / (1 + d * d);
          if (pk.isFlaw) vf += lor;
          else vc += lor;
        }
        cleanVals[i] = vc;
        flawVals[i] = vf;
      }

      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 1.45;
      ctx.beginPath();
      for (let i = 0; i <= plotW; i++) {
        const x = padL + i;
        const y = baseY - cleanVals[i] * plotH * 0.84;
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();

      const phosX = pToX(-17.4);
      ctx.fillStyle = '#86efac';
      ctx.font = `bold ${compact ? 8.5 : 10.5}px Consolas, monospace`;
      ctx.textAlign = 'right';
      ctx.fillText(compact ? '-17.4 ppm P(III)' : '-17.4 ppm Live Phosphine (>97%)', Math.min(w - padR, phosX + 10), plotTop + 14);

      if (hasSolvent) {
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        for (let i = 0; i <= plotW; i++) {
          const x = padL + i;
          const y = baseY - Math.max(0, flawVals[i]) * plotH * 0.84;
          if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.stroke();
        const oxX = pToX(29.5);
        ctx.fillStyle = '#fca5a5';
        ctx.textAlign = 'left';
        drawVectorWarning(ctx, oxX + 4, plotTop + 14, compact ? 3.5 : 4.1, '#f87171', '#090f1d');
        ctx.fillText(compact ? '+29.5 P=O!' : '+29.5 ppm P=O Oxide Crash!', oxX + 12, plotTop + 18);
      }

      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 1.2;
      ctx.beginPath(); ctx.moveTo(padL, baseY + 2); ctx.lineTo(w - padR, baseY + 2); ctx.stroke();
      ctx.fillStyle = '#cbd5e1';
      ctx.font = `${compact ? 8.5 : 10}px Consolas, monospace`;
      ctx.textAlign = 'center';
      for (let p = 40; p >= -30; p -= 10) {
        const tx = pToX(p);
        ctx.beginPath(); ctx.moveTo(tx, baseY + 2); ctx.lineTo(tx, baseY + 7); ctx.stroke();
        ctx.fillText(String(p), tx, baseY + (compact ? 16 : 18));
      }
      ctx.fillStyle = '#94a3b8';
      ctx.textAlign = 'right';
      ctx.fillText('δ 31P (ppm)', w - padR, baseY + (compact ? 25 : 30));
      return;
    }

    // 1H NMR: Expand ppmMax to 11.2 when 1H productPeak has downfield shift > 10.2 (ignore 13C > 15.5 ppm)
    const shiftMatches = [...String(item.productPeak || '').matchAll(/(\d{1,3}\.\d+)\s*(?:ppm|\()/gi)];
    const hasHigh1HShift = shiftMatches.some(m => {
      const v = parseFloat(m[1]);
      return v > 10.2 && v <= 15.5;
    });
    const ppmMax = hasHigh1HShift ? 11.2 : 10.5;
    const ppmMin = -0.5;
    const ppmToX = ppm => padL + ((ppmMax - ppm) / (ppmMax - ppmMin)) * plotW;
    const xToPpm = px => ppmMax - ((px - padL) / plotW) * (ppmMax - ppmMin);

    ctx.strokeStyle = 'rgba(148, 163, 184, 0.11)';
    ctx.lineWidth = 1;
    const topTick = Math.floor(ppmMax);
    for (let p = topTick; p >= 0; p--) {
      const gx = ppmToX(p);
      ctx.beginPath();
      ctx.moveTo(gx, plotTop);
      ctx.lineTo(gx, baseY);
      ctx.stroke();
    }

    // Context-aware 1H multiplet profiles (aromatic vs non-aromatic vs disclosed EtOAc)
    const hasArylContext = /aryl|tz-?arh|\bn-?ph\b|pteridine|pabc|phenazepam|7\.\d{2}|8\.\d{2}|10\.\d{2}/i.test(nmrMeta);
    const nonAromatic = !hasArylContext && /dibrpd|astra-?pd|bcn|nhs|monobrpd/i.test(nmrMeta);
    const hasVinylicBr = /7\.06|ch=cbr|monobrpd/i.test(nmrMeta);
    const hasDisclosedEtoac = /0\.08\s*eq\s*etoac|etoac\s*disclosed/i.test(nmrMeta);

    const peaks = [];
    if (hasHigh1HShift) {
      // Phenazepam / VT-NMR NH + coalesced CH2 + aryl
      peaks.push(
        { ppm: 10.74, amp: 0.42, w: 0.015, split: [1], j: 0, intH: '1.00H' },
        { ppm: 7.72,  amp: 0.46, w: 0.012, split: [1, 1], j: 0.020, intH: '2.01H' },
        { ppm: 7.41,  amp: 0.40, w: 0.012, split: [1, 2, 1], j: 0.019, intH: '3.02H' },
        { ppm: 4.18,  amp: 0.58, w: 0.012, split: [1], j: 0, intH: '2.00H' }
      );
    } else if (nonAromatic) {
      // Non-aromatic linker / PD scaffolds (diBrPD-PEG2-BCN, Astra-PD, diBrPD-NHS, monoBrPD-PEG2-BCN)
      if (hasVinylicBr) {
        peaks.push({ ppm: 7.06, amp: 0.52, w: 0.010, split: [1], j: 0, intH: '1.00H' });
      }
      if (/astra-?pd|propargyl/i.test(nmrMeta)) {
        peaks.push(
          { ppm: 4.92, amp: 0.52, w: 0.011, split: [1, 1], j: 0.016, intH: '2.00H' },
          { ppm: 3.62, amp: 0.48, w: 0.013, split: [1, 2, 1], j: 0.018, intH: '4.01H' },
          { ppm: 3.16, amp: 0.66, w: 0.010, split: [1], j: 0, intH: '3.00H' },
          { ppm: 2.34, amp: 0.44, w: 0.011, split: [1, 2, 1], j: 0.015, intH: '1.01H' }
        );
      } else if (/nhs/i.test(nmrMeta)) {
        peaks.push(
          { ppm: 3.96, amp: 0.50, w: 0.012, split: [1, 2, 1], j: 0.020, intH: '2.00H' },
          { ppm: 3.21, amp: 0.68, w: 0.010, split: [1], j: 0, intH: '3.01H' },
          { ppm: 2.84, amp: 0.78, w: 0.011, split: [1], j: 0, intH: '4.00H' },
          { ppm: 1.66, amp: 0.42, w: 0.013, split: [1, 2, 1], j: 0.018, intH: '2.02H' }
        );
      } else {
        // BCN-PEG-PD
        peaks.push(
          { ppm: 4.14, amp: 0.50, w: 0.011, split: [1, 1], j: 0.018, intH: '2.00H' },
          { ppm: 3.66, amp: 0.60, w: 0.014, split: [1, 3, 3, 1], j: 0.018, intH: '6.04H' },
          { ppm: 3.18, amp: 0.68, w: 0.010, split: [1], j: 0, intH: '3.00H' },
          { ppm: 2.24, amp: 0.40, w: 0.013, split: [1, 2, 1], j: 0.018, intH: '4.02H' },
          { ppm: 0.94, amp: 0.46, w: 0.013, split: [1, 2, 1], j: 0.016, intH: '2.01H' }
        );
      }
    } else {
      // Aromatic pyridazinedione / pteridine / tetrazine / PABC multiplets
      const downfieldShift = /8\.64|8\.52/.test(nmrMeta) ? (/8\.64/.test(nmrMeta) ? 8.64 : 8.52) : 8.18 + (rng() - 0.5) * 0.12;
      if (/10\.12/.test(nmrMeta)) {
        peaks.push({ ppm: 10.12, amp: 0.36, w: 0.014, split: [1], j: 0, intH: '1.00H' });
      }
      peaks.push(
        { ppm: downfieldShift, amp: 0.48, w: 0.011, split: [1, 1], j: 0.022, intH: '2.00H' },
        { ppm: 7.66 + (rng() - 0.5) * 0.12, amp: 0.42, w: 0.012, split: [1, 2, 1], j: 0.020, intH: '2.01H' },
        { ppm: 7.38 + (rng() - 0.5) * 0.08, amp: 0.38, w: 0.011, split: [1, 1], j: 0.021, intH: '2.03H' },
        { ppm: 4.38 + (rng() - 0.5) * 0.10, amp: 0.44, w: 0.012, split: [1, 2, 1], j: 0.022, intH: '2.00H' },
        { ppm: 3.66 + (rng() - 0.5) * 0.08, amp: 0.56, w: 0.014, split: [1, 3, 3, 1], j: 0.018, intH: '4.04H' },
        { ppm: 2.86 + (rng() - 0.5) * 0.08, amp: 0.40, w: 0.012, split: [1, 2, 1], j: 0.020, intH: '2.02H' },
        { ppm: 1.44 + (rng() - 0.5) * 0.06, amp: 0.62, w: 0.011, split: [1], j: 0, intH: '3.01H' }
      );
    }

    // TMS at 0.00 ppm
    peaks.push({ ppm: 0.00, amp: 0.16, w: 0.009, split: [1], j: 0, isRef: true });

    // Deuterated NMR reference solvent peak (CDCl3 7.26 or DMSO-d6 2.50)
    if (useDmso) {
      peaks.push({ ppm: 2.50, amp: 0.34, w: 0.010, split: [1, 2, 3, 2, 1], j: 0.008, isRef: true, refLbl: 'DMSO-d6 2.50' });
    } else {
      peaks.push({ ppm: 7.26, amp: 0.36, w: 0.009, split: [1], j: 0, isRef: true, refLbl: 'CDCl3 7.26' });
    }

    // Subtle 0.08 eq EtOAc trace on Richard Step 2 (disclosed cleanly, non-flaw)
    if (hasDisclosedEtoac && !hasSolvent) {
      peaks.push(
        { ppm: 4.12, amp: 0.14, w: 0.010, split: [1, 3, 3, 1], j: 0.016, isTrace: true, traceLbl: '0.08 eq EtOAc' },
        { ppm: 2.05, amp: 0.22, w: 0.009, split: [1], j: 0, isTrace: true },
        { ppm: 1.26, amp: 0.15, w: 0.010, split: [1, 2, 1], j: 0.016, isTrace: true }
      );
    }

    // Residual workup/column solvent spikes if hasSolventPeak or quality < 78
    const dcmPpm = useDmso ? 5.76 : 5.30;
    const etoacQ = useDmso ? 4.03 : 4.12;
    const etoacS = useDmso ? 1.99 : 2.04;
    const etoacT = useDmso ? 1.17 : 1.26;
    if (hasSolvent) {
      peaks.push({ ppm: dcmPpm, amp: 0.96, w: 0.009, split: [1], j: 0, isFlaw: true, flawLbl: `${dcmPpm.toFixed(2)} ppm (DCM!)` });
      peaks.push({ ppm: etoacQ, amp: 0.42, w: 0.010, split: [1, 3, 3, 1], j: 0.018, isFlaw: true, flawLbl: `${etoacQ.toFixed(2)} (EtOAc)` });
      peaks.push({ ppm: etoacS, amp: 0.68, w: 0.009, split: [1], j: 0, isFlaw: true, flawLbl: `${etoacS.toFixed(2)} (EtOAc)` });
      peaks.push({ ppm: etoacT, amp: 0.46, w: 0.010, split: [1, 2, 1], j: 0.018, isFlaw: true });
    }

    const cleanVals = new Float32Array(plotW + 1);
    const traceVals = new Float32Array(plotW + 1);
    const flawVals = new Float32Array(plotW + 1);

    for (let i = 0; i <= plotW; i++) {
      const ppm = xToPpm(padL + i);
      let vClean = (rng() - 0.5) * (q < 78 ? 0.022 : 0.009);
      let vTrace = 0;
      let vFlaw = 0;

      for (const pk of peaks) {
        const nLines = pk.split.length;
        const maxRel = Math.max(...pk.split);
        for (let k = 0; k < nLines; k++) {
          const linePpm = pk.ppm + (k - (nLines - 1) / 2) * pk.j;
          const d = (ppm - linePpm) / pk.w;
          const lor = (pk.amp * (pk.split[k] / maxRel)) / (1 + d * d);
          if (pk.isFlaw) vFlaw += lor;
          else if (pk.isTrace) vTrace += lor;
          else vClean += lor;
        }
      }
      cleanVals[i] = vClean;
      traceVals[i] = vTrace;
      flawVals[i] = vFlaw;
    }

    // 1) Green integration step-curves above product multiplets
    ctx.strokeStyle = 'rgba(52, 211, 153, 0.78)';
    ctx.fillStyle = '#6ee7b7';
    ctx.lineWidth = 1.15;
    ctx.font = `${compact ? 8 : 9.5}px Consolas, monospace`;
    ctx.textAlign = 'center';

    for (const pk of peaks) {
      if (!pk.intH) continue;
      const x1 = ppmToX(pk.ppm + 0.14);
      const x2 = ppmToX(pk.ppm - 0.14);
      const stepH = compact ? 18 : 26;
      const yBaseInt = baseY - plotH * 0.50;
      ctx.beginPath();
      for (let x = x1; x <= x2; x += 2) {
        const s = 1 / (1 + Math.exp(-((x - (x1 + x2) / 2) / Math.max(2, (x2 - x1) * 0.14))));
        const py = yBaseInt - s * stepH;
        if (x === x1) ctx.moveTo(x, py);
        else ctx.lineTo(x, py);
      }
      ctx.stroke();
      if (!compact) {
        ctx.fillText(pk.intH, (x1 + x2) / 2, yBaseInt - stepH - 4);
      }
    }

    // 2) Main cyan/blue Bruker 1H trace
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 1.25;
    ctx.beginPath();
    for (let i = 0; i <= plotW; i++) {
      const x = padL + i;
      const y = baseY - cleanVals[i] * plotH * 0.86;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // 2b) Subtle disclosed EtOAc trace (Richard Step 2)
    if (hasDisclosedEtoac && !hasSolvent) {
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 1.15;
      ctx.beginPath();
      for (let i = 0; i <= plotW; i++) {
        const x = padL + i;
        const y = baseY - traceVals[i] * plotH * 0.86;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.fillStyle = '#fde68a';
      ctx.font = `${compact ? 7.5 : 9}px Consolas, monospace`;
      ctx.textAlign = 'center';
      ctx.fillText(compact ? '0.08eq EtOAc' : '0.08 eq EtOAc (disclosed)', ppmToX(2.05), baseY - 0.24 * plotH * 0.86 - 6);
    }

    // 3) Red-flagged residual solvent trace on top if present
    if (hasSolvent) {
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 1.45;
      ctx.beginPath();
      for (let i = 0; i <= plotW; i++) {
        const x = padL + i;
        const y = baseY - Math.max(0, flawVals[i]) * plotH * 0.90;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      const dcmX = ppmToX(dcmPpm);
      const dcmTopY = Math.max(plotTop - 4, baseY - 0.92 * plotH * 0.90);
      const boxW = compact ? 132 : 178;
      const boxH = compact ? 18 : 22;
      const boxX = clamp(dcmX + 6, padL + 2, w - padR - boxW - 2);
      ctx.fillStyle = 'rgba(185, 28, 28, 0.92)';
      ctx.fillRect(boxX, dcmTopY, boxW, boxH);
      ctx.strokeStyle = '#fca5a5';
      ctx.strokeRect(boxX, dcmTopY, boxW, boxH);
      drawVectorWarning(ctx, boxX + 9, dcmTopY + boxH / 2, compact ? 3.5 : 4.2, '#fde047', '#7f1d1d');
      ctx.fillStyle = '#ffffff';
      ctx.font = `bold ${compact ? 8.5 : 10.5}px Consolas, monospace`;
      ctx.textAlign = 'left';
      ctx.fillText(compact ? `${dcmPpm.toFixed(2)} DCM + EtOAc!` : `${dcmPpm.toFixed(2)} ppm DCM + EtOAc!`, boxX + 17, dcmTopY + (compact ? 12 : 15));
    }

    // Reference solvent tag (CDCl3 7.26 / DMSO-d6 2.50)
    const refPk = peaks.find(p => p.refLbl);
    if (refPk) {
      const rx = ppmToX(refPk.ppm);
      ctx.fillStyle = '#94a3b8';
      ctx.font = `${compact ? 8 : 9.5}px Consolas, monospace`;
      ctx.textAlign = 'center';
      ctx.fillText(refPk.refLbl, rx, baseY - refPk.amp * plotH * 0.88 - 6);
    }

    // Horizontal ppm axis & ticks
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(padL, baseY + 2);
    ctx.lineTo(w - padR, baseY + 2);
    ctx.stroke();

    ctx.fillStyle = '#cbd5e1';
    ctx.font = `${compact ? 8.5 : 10}px Consolas, monospace`;
    ctx.textAlign = 'center';
    for (let p = topTick; p >= 0; p--) {
      const tx = ppmToX(p);
      ctx.beginPath();
      ctx.moveTo(tx, baseY + 2);
      ctx.lineTo(tx, baseY + 7);
      ctx.stroke();
      ctx.fillText(String(p), tx, baseY + (compact ? 16 : 18));
    }
    ctx.fillStyle = '#94a3b8';
    ctx.textAlign = 'right';
    ctx.fillText('δ (ppm)', w - padR, baseY + (compact ? 25 : 30));
  }

  // -------------------- 4. WATERS MAXENT1 / AGILENT Q-TOF LC-MS --------------------
  function drawMaxEntLcms(ctx, w, h, item, rng) {
    const compact = w < 440;
    const q = getQuality(item, 85);
    const hasAdduct = Boolean(item.hasAdduct) || q < 78;

    const rawPeakStr = String(item.productPeak || '148420 Da');
    const lcmsMeta = `${item.label || ''} ${rawPeakStr} ${item.notes || ''} ${item.metricLabel || ''}`;
    const cleanNumStr = rawPeakStr.replace(/,/g, '');
    const massMatches = [...cleanNumStr.matchAll(/(\d{3,6}(?:\.\d+)?)/g)];
    let centerMass = 148420;
    if (massMatches.length > 0) {
      centerMass = parseFloat(massMatches[0][1]);
    } else if (/small|pd|sm|linker|phenazepam|m\/z/i.test(lcmsMeta)) {
      centerMass = 548.1;
    }

    // Treat small-molecule adduct / Br2 triplet strings under 5000 Da as HRMS rather than protein envelope
    const hasSmallMolIon = /\[m\+[hna]+\]\+|br2\s*triplet/i.test(rawPeakStr);
    const isMaldi = String(item.type || '').toLowerCase() === 'maldi' || /maldi/i.test(lcmsMeta);
    const isProtein = centerMass > 5000 || (centerMass >= 2000 && !hasSmallMolIon && /fab|igg|mab|bsa|hsa|vnar|her2|dar|par/i.test(lcmsMeta));
    const spanLeft = isProtein ? 220 : 28;
    const spanRight = isProtein ? 340 : 42;
    const mMin = centerMass - spanLeft;
    const mMax = centerMass + spanRight;

    ctx.fillStyle = '#090e1a';
    ctx.fillRect(0, 0, w, h);

    ctx.fillStyle = '#16213a';
    ctx.fillRect(0, 0, w, compact ? 20 : 26);
    ctx.fillStyle = '#c4b5fd';
    ctx.font = `bold ${compact ? 9.5 : 11.5}px Consolas, monospace`;
    ctx.textAlign = 'left';
    ctx.fillText(
      compact
        ? (isMaldi ? 'Waters MALDI-TOF MS' : (isProtein ? 'Q-TOF MaxEnt1 MS' : 'UPLC ESI-HRMS'))
        : (isMaldi
          ? 'CIB LG11 • Waters MALDI-TOF MS'
          : (isProtein
            ? 'CIB LG11 • Q-TOF / MaxEnt1 Deconvoluted MS'
            : 'CIB LG11 • Waters UPLC–Xevo ESI-HRMS')),
      10,
      compact ? 13 : 17
    );
    drawTopMetaMetrics(ctx, w, item, compact, compact ? 13 : 17, compact ? 8 : 10);

    const padL = compact ? 34 : 46;
    const padR = compact ? 14 : 18;
    const padB = compact ? 28 : 36;
    const plotTop = compact ? 34 : 46;
    const baseY = h - padB;
    const plotW = Math.max(1, Math.floor(w - padL - padR));
    const plotH = Math.max(1, baseY - plotTop);

    const mToX = m => padL + ((m - mMin) / (mMax - mMin)) * plotW;
    const xToM = px => mMin + ((px - padL) / plotW) * (mMax - mMin);

    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(padL, plotTop - 6);
    ctx.lineTo(padL, baseY);
    ctx.lineTo(w - padR, baseY);
    ctx.stroke();

    ctx.fillStyle = '#94a3b8';
    ctx.font = `${compact ? 8 : 9.5}px Consolas, monospace`;
    ctx.textAlign = 'right';
    [0, 50, 100].forEach(pct => {
      const py = baseY - (pct / 100) * plotH * 0.86;
      ctx.fillText(`${pct}%`, padL - 5, py + 3);
      if (pct > 0) {
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.1)';
        ctx.beginPath();
        ctx.moveTo(padL, py);
        ctx.lineTo(w - padR, py);
        ctx.stroke();
      }
    });

    const isHsaMaleimide = isProtein && /hydrolysed\s*hsa|hsa-?maleimide|ring-?open|\+18\s*da|closed-?ring/i.test(lcmsMeta);
    const widthDa = isProtein ? 6.5 : 0.35;
    const msPeaks = [
      { m: centerMass, amp: 1.0, w: widthDa, isFlaw: false }
    ];

    if (isProtein) {
      if (isHsaMaleimide) {
        // Archie's N-aryl maleimide HSA Cys34 (+18 Da succinamic acid ring-open product vs -18 Da closed-ring thiol-maleimide)
        msPeaks.push(
          { m: centerMass - 18, amp: hasAdduct ? 0.62 : 0.06, w: widthDa * 0.85, isFlaw: hasAdduct }
        );
        if (hasAdduct) {
          msPeaks.push(
            { m: centerMass - 155, amp: 0.38, w: widthDa, isFlaw: true },
            { m: centerMass + 165, amp: 0.30, w: widthDa, isFlaw: true }
          );
        }
      } else {
        msPeaks.push(
          { m: centerMass + 18, amp: 0.08, w: widthDa * 0.85, isFlaw: false },
          { m: centerMass - 148, amp: hasAdduct ? 0.22 : 0.05, w: widthDa, isFlaw: hasAdduct }
        );
        if (/47,964|4:1/.test(rawPeakStr) && massMatches.length > 1) {
          msPeaks.push({ m: parseFloat(massMatches[1][1]), amp: 0.25, w: widthDa, isFlaw: false });
        }
        if (hasAdduct) {
          msPeaks.push({ m: centerMass + 69, amp: 0.56, w: widthDa * 0.9, isFlaw: true });
          for (let k = 1; k <= 5; k++) {
            msPeaks.push({
              m: centerMass + 44 * k,
              amp: 0.44 * Math.pow(0.84, k - 1),
              w: widthDa * 0.72,
              isFlaw: true
            });
          }
        }
      }
    } else {
      // Clean small-molecule isotopic cluster (Br2 1:2:1, BrCl, Cl 3:1, or standard 13C M+1/M+2)
      if (/1:2:1|br2/i.test(lcmsMeta)) {
        msPeaks[0].amp = 0.51;
        msPeaks.push(
          { m: centerMass + 2.0, amp: 1.00, w: widthDa, isFlaw: false },
          { m: centerMass + 4.0, amp: 0.49, w: widthDa, isFlaw: false }
        );
      } else if (/79br35cl|81br35cl/i.test(lcmsMeta)) {
        msPeaks.push(
          { m: centerMass + 1.998, amp: 1.0, w: widthDa, isFlaw: false },
          { m: centerMass + 3.995, amp: 0.32, w: widthDa, isFlaw: false }
        );
        msPeaks[0].amp = 0.77;
      } else if (/35cl\/37cl|3:1/i.test(lcmsMeta)) {
        msPeaks.push({ m: centerMass + 1.997, amp: 0.34, w: widthDa, isFlaw: false });
      } else {
        msPeaks.push(
          { m: centerMass + 1.003, amp: 0.24, w: widthDa, isFlaw: false },
          { m: centerMass + 2.006, amp: 0.04, w: widthDa, isFlaw: false }
        );
      }
      if (hasAdduct) {
        msPeaks.push(
          { m: centerMass - 18.0, amp: 0.46, w: widthDa * 1.1, isFlaw: true },
          { m: centerMass + 16.0, amp: 0.38, w: widthDa * 1.1, isFlaw: true }
        );
      }
    }

    const cleanCurve = new Float32Array(plotW + 1);
    const flawCurve = new Float32Array(plotW + 1);
    for (let i = 0; i <= plotW; i++) {
      const m = xToM(padL + i);
      let vc = rng() * 0.012;
      let vf = 0;
      for (const pk of msPeaks) {
        const z = (m - pk.m) / pk.w;
        const g = pk.amp * Math.exp(-0.5 * z * z);
        if (pk.isFlaw) vf = Math.max(vf, g);
        else vc = Math.max(vc, g);
      }
      cleanCurve[i] = vc;
      flawCurve[i] = vf;
    }

    ctx.beginPath();
    ctx.moveTo(padL, baseY);
    for (let i = 0; i <= plotW; i++) {
      ctx.lineTo(padL + i, baseY - cleanCurve[i] * plotH * 0.86);
    }
    ctx.lineTo(padL + plotW, baseY);
    ctx.closePath();
    ctx.fillStyle = 'rgba(56, 189, 248, 0.16)';
    ctx.fill();

    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    for (let i = 0; i <= plotW; i++) {
      const x = padL + i;
      const y = baseY - cleanCurve[i] * plotH * 0.86;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    if (hasAdduct) {
      ctx.strokeStyle = '#f87171';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      for (let i = 0; i <= plotW; i++) {
        const x = padL + i;
        const y = baseY - flawCurve[i] * plotH * 0.86;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      ctx.font = `bold ${compact ? 8 : 10.5}px Consolas, monospace`;
      ctx.textAlign = 'left';
      if (isHsaMaleimide) {
        const closedX = mToX(centerMass - 18);
        const closedY = baseY - 0.62 * plotH * 0.86;
        const closedTxt = compact ? '-18 Da Closed!' : '-18 Da Closed-Ring (Thiol Loss Risk)!';
        const closedDrawX = clamp(closedX - (compact ? 64 : 165), padL + 14, w - padR - (compact ? 70 : 185));
        drawVectorWarning(ctx, closedDrawX - 8, closedY - 9, compact ? 3.2 : 4.1, '#f87171', '#090e1a');
        ctx.fillStyle = '#fca5a5';
        ctx.fillText(fitCanvasText(ctx, closedTxt, w - padR - closedDrawX), closedDrawX, closedY - 6);
      } else if (isProtein) {
        const addX = mToX(centerMass + 69);
        const addY = baseY - 0.56 * plotH * 0.86;
        const addTxt = compact ? '+69 Da Adduct!' : '+69 Da Adduct!';
        const addMaxW = Math.max(40, w - padR - (addX + 6));
        drawVectorWarning(ctx, Math.min(w - padR - 50, addX - 2), addY - 10, compact ? 3.2 : 4.1, '#f87171', '#090e1a');
        ctx.fillStyle = '#fca5a5';
        ctx.fillText(fitCanvasText(ctx, addTxt, addMaxW), Math.min(w - padR - 44, addX + 6), addY - 7);

        const pegX = mToX(centerMass + 88);
        const pegY = baseY - 0.36 * plotH * 0.86 - 16;
        const pegTxt = compact ? '+44 Da PEG Comb' : '+44 Da PEG Comb (+44/+88/+132)';
        const pegTxtW = ctx.measureText(pegTxt).width;
        const pegDrawX = clamp(pegX + 12, padL + 16, w - padR - Math.min(pegTxtW, plotW * 0.55) - 2);
        drawVectorWarning(ctx, pegDrawX - 8, pegY - 3, compact ? 3.2 : 4.1, '#fbbf24', '#090e1a');
        ctx.fillStyle = '#fbbf24';
        ctx.fillText(fitCanvasText(ctx, pegTxt, w - padR - pegDrawX), pegDrawX, pegY);
      } else {
        const impX = mToX(centerMass + 16);
        const impY = baseY - 0.38 * plotH * 0.86;
        const impTxt = compact ? 'Impurity Peak!' : 'Unreacted SM / Hydrolysis Impurity!';
        const impDrawX = clamp(impX + 6, padL + 14, w - padR - (compact ? 74 : 185));
        drawVectorWarning(ctx, impDrawX - 8, impY - 9, compact ? 3.2 : 4.0, '#f87171', '#090e1a');
        ctx.fillStyle = '#fca5a5';
        ctx.fillText(fitCanvasText(ctx, impTxt, w - padR - impDrawX), impDrawX, impY - 6);
      }
    }

    // Main Product Peak Label (strictly clamped inside plot bounds even at 340px)
    const mainX = mToX(centerMass);
    const mainY = baseY - plotH * 0.86;
    ctx.fillStyle = '#86efac';
    ctx.font = `bold ${compact ? 9 : 11.5}px Consolas, monospace`;
    ctx.textAlign = 'center';
    const shortPeak = fitCanvasText(ctx, rawPeakStr, plotW - 22);
    const lblW = ctx.measureText(shortPeak).width;
    const minCenter = padL + lblW / 2 + 14;
    const maxCenter = w - padR - lblW / 2 - 4;
    const lblX = minCenter <= maxCenter ? clamp(mainX, minCenter, maxCenter) : padL + plotW / 2;
    drawVectorDiamond(ctx, lblX - lblW / 2 - 8, mainY - 11, compact ? 3.2 : 4.0, '#86efac');
    ctx.fillText(shortPeak, lblX, mainY - 8);

    // X-axis ticks (Da / m/z)
    ctx.fillStyle = '#cbd5e1';
    ctx.font = `${compact ? 8.5 : 10}px Consolas, monospace`;
    const tickCount = compact ? 4 : 5;
    for (let t = 0; t <= tickCount; t++) {
      const mVal = mMin + (t / tickCount) * (mMax - mMin);
      const tx = mToX(mVal);
      ctx.beginPath();
      ctx.moveTo(tx, baseY);
      ctx.lineTo(tx, baseY + 5);
      ctx.strokeStyle = '#64748b';
      ctx.stroke();
      ctx.textAlign = t === tickCount ? 'right' : (t === 0 ? 'left' : 'center');
      ctx.fillText(isProtein ? Math.round(mVal).toLocaleString() : mVal.toFixed(1), tx, baseY + (compact ? 15 : 17));
    }
    ctx.fillStyle = '#94a3b8';
    ctx.textAlign = 'right';
    ctx.fillText(isProtein ? 'Deconvoluted Mass (Da)' : 'm/z (Da)', w - padR, baseY + (compact ? 25 : 29));
  }

  window.KLB.Spectra = {
    renderToCanvas,
    setupHiDpiCanvas
  };

  // =========================================================================
  // B. 6 WET-LAB & CORRIDOR MICRO-MINIGAMES (window.KLB.Minigames)
  // =========================================================================
  (() => {
    let activeCleanup = null;
    let activeAbort = null;
    const mgSpriteCache = new Map();

    function getMgSprite(charId) {
      if (typeof Image === 'undefined') return null;
      const cleanId = String(charId || 'daniel_richards').replace(/[^a-z0-9_-]/gi, '') || 'daniel_richards';
      if (mgSpriteCache.has(cleanId)) return mgSpriteCache.get(cleanId);
      const img = new Image();
      img.src = `assets/sprites/${cleanId}.png`;
      mgSpriteCache.set(cleanId, img);
      return img;
    }

    function normalizeMinigameType(rawType) {
      const t = String(rawType || 'biotage').toLowerCase();
      if (t.includes('buchi') || t.includes('rotavap') || t.includes('bump') || t.includes('evap') || t.includes('vac')) return 'buchi_bump';
      if (t.includes('biotage') || t.includes('column') || t.includes('uv')) return 'biotage';
      if (t.includes('gel') || t.includes('pipet') || t.includes('well')) return 'gel_load';
      if (t.includes('syringe') || t.includes('cryo') || t.includes('fridge') || t.includes('cold') || t.includes('78')) return 'syringe_cryo';
      if (t.includes('lemon') || t.includes('flask') || t.includes('calise')) return 'lemons';
      if (t.includes('alex') || t.includes('stealth') || t.includes('1718')) return 'alex_stealth';
      return 'biotage';
    }

    function openModal(arg1, arg2, config, onFinish) {
      let rawType = arg1;
      let mountEl = arg2;
      if (typeof arg1 !== 'string' && typeof arg2 === 'string') {
        mountEl = arg1;
        rawType = arg2;
      }
      if (typeof config === 'function') {
        onFinish = config;
        config = {};
      }
      config = config || {};
      if (typeof activeCleanup === 'function') {
        activeCleanup();
      }
      if (!mountEl) {
        if (onFinish) onFinish({ score: 80, summary: 'Bench operation completed.' });
        return;
      }

      const type = normalizeMinigameType(rawType);
      const isSyringeCryoBadge = type === 'syringe_cryo'
        && /-78|cryo|dry[- ]?ice|acetone|bromomalonate/i.test(`${config.title || ''} ${config.subtitle || ''} ${config.tempLabel || ''}`);
      const metaByType = {
        biotage: {
          icon: 'flask-conical',
          badge: 'FLASH CHROMATOGRAPHY',
          defaultTitle: 'UV Peak Fraction Collector',
          controls: 'Hold [Space] or [Click] only while the green Main Product UV peak elutes.',
          durationSec: 8.5
        },
        gel_load: {
          icon: 'layers',
          badge: 'SDS-PAGE GEL LOADING',
          defaultTitle: 'Micropipette Well Loader',
          controls: 'Aim with [A/D], [Arrows], or [Mouse]; press [Space] or [Click] over each well.',
          durationSec: 11.0
        },
        syringe_cryo: {
          icon: 'snowflake',
          badge: isSyringeCryoBadge ? 'CRYO SYRINGE PUMP (-78 °C)' : 'SYRINGE PUMP CONTROL',
          defaultTitle: 'Syringe Pump Flow Control',
          defaultSubtitle: 'Keep addition rate steady inside the target zone',
          controls: 'Hold [Space] or [Mouse] to increase feed; release to settle inside the green zone.',
          durationSec: 7.5
        },
        lemons: {
          icon: 'beaker',
          badge: 'BENCH CATCH CHALLENGE',
          defaultTitle: 'Catch Flasks and Lemons',
          controls: 'Move tray with [A/D], [Arrows], or [Mouse] — catch Flasks and Lemons, avoid silica dust.',
          durationSec: 8.0
        },
        buchi_bump: {
          icon: 'gauge',
          badge: 'BÜCHI ROTAVAP VACUUM',
          defaultTitle: 'Büchi Bump-Trap Vacuum Control',
          defaultSubtitle: 'Keep vacuum in the 220–420 mbar sweet spot without bumping product into the trap',
          controls: 'Hold [Space] or [Left-Click] to pull vacuum; release to vent bleed valve before foam breaches the trap.',
          durationSec: 13.0
        },
        alex_stealth: {
          icon: 'compass',
          badge: 'CORRIDOR EVASION',
          defaultTitle: 'Corridor Decoy Evasion',
          controls: 'WASD / Arrows or Hold Left-Click to move to the green exit; avoid her vision cone and the 3F stairs.',
          durationSec: 10.0
        }
      };

      const meta = metaByType[type];
      const modalTitle = String(config.title || meta.defaultTitle);
      const modalSubtitle = String(config.subtitle || meta.defaultSubtitle || '');
      mountEl.innerHTML = `
      <div class="klb-mg-shell" style="display:flex;flex-direction:column;gap:10px;">
        <header class="klb-modal-header" style="display:flex;justify-content:space-between;align-items:center;gap:12px;">
          <div>
            <div style="display:inline-flex;align-items:center;gap:6px;font-size:11px;font-weight:600;color:#60a5fa;letter-spacing:0.5px;">
              ${iconSvg(meta.icon, 14)}
              <span>${meta.badge}</span>
            </div>
            <h3 style="margin:3px 0 0 0;font-size:18px;font-weight:600;color:#f8fafc;">${escHtml(modalTitle)}</h3>
            ${modalSubtitle ? `<div style="margin-top:2px;font-size:12px;color:#94a3b8;">${escHtml(modalSubtitle)}</div>` : ''}
          </div>
          <div style="display:flex;gap:8px;align-items:center;font-family:Consolas,monospace;">
            <span id="mg-live-score" style="padding:4px 10px;border-radius:6px;background:#0f172a;border:1px solid #3b82f6;color:#93c5fd;font-weight:500;font-size:13px;box-shadow:0 2px 6px rgba(2,6,23,0.45), inset 0 1px 0 rgba(147,197,253,0.08);">Score: --</span>
            <span id="mg-live-timer" style="padding:4px 10px;border-radius:6px;background:#0f172a;border:1px solid #475569;color:#f8fafc;font-weight:500;font-size:13px;box-shadow:0 2px 6px rgba(2,6,23,0.45), inset 0 1px 0 rgba(148,163,184,0.08);">${meta.durationSec.toFixed(1)}s</span>
            <button id="mg-close-btn" type="button" class="hud-btn" title="Abort and close (Esc)">${iconSvg('x', 13)}<span>Close / Esc</span></button>
          </div>
        </header>

        <section style="background:#070b14;border:1px solid #334155;border-radius:10px;padding:8px;position:relative;display:flex;justify-content:center;box-shadow:0 8px 24px rgba(2,6,23,0.6), inset 0 1px 0 rgba(148,163,184,0.08);">
          <canvas id="mg-canvas" width="680" height="310" style="width:100%;max-width:680px;height:auto;border-radius:6px;cursor:crosshair;touch-action:none;"></canvas>
          <div id="mg-finish-banner" style="display:none;position:absolute;inset:12px;background:rgba(9,14,26,0.90);border:1px solid #4b6394;border-radius:8px;flex-direction:column;align-items:center;justify-content:center;gap:8px;text-align:center;padding:16px;cursor:pointer;box-shadow:0 16px 36px rgba(2,6,23,0.78), inset 0 1px 0 rgba(148,163,184,0.12);">
            <h3 id="mg-finish-title" style="margin:0;display:inline-flex;align-items:center;gap:8px;font-size:20px;font-weight:600;color:#86efac;"></h3>
            <div id="mg-finish-sub" style="font-size:13px;color:#e2e8f0;max-width:480px;"></div>
            <button id="mg-finish-btn" class="rpg-btn primary" style="margin-top:4px;padding:7px 18px;font-size:13px;font-weight:500;">Continue [Space / Click]</button>
          </div>
        </section>

        <section class="klb-hint-box" style="display:flex;align-items:center;justify-content:center;gap:8px;font-size:12px;color:#cbd5e1;background:#111c33;border:1px solid #2e3d5e;border-radius:8px;padding:7px 11px;text-align:center;font-family:Consolas,monospace;box-shadow:0 4px 12px rgba(2,6,23,0.45), inset 0 1px 0 rgba(148,163,184,0.06);">
          ${iconSvg('gamepad-2', 15)}
          <span>${meta.controls}</span>
        </section>
      </div>
    `;

      const canvas = mountEl.querySelector('#mg-canvas');
      if (canvas && canvas.style) canvas.style.touchAction = 'none';
      const W = 680;
      const H = 310;
      const { ctx } = setupHiDpiCanvas(canvas, W, H);
      const scoreEl = mountEl.querySelector('#mg-live-score');
      const timerEl = mountEl.querySelector('#mg-live-timer');
      const closeBtn = mountEl.querySelector('#mg-close-btn');
      const finishBanner = mountEl.querySelector('#mg-finish-banner');
      const finishTitle = mountEl.querySelector('#mg-finish-title');
      const finishSub = mountEl.querySelector('#mg-finish-sub');
      const finishBtn = mountEl.querySelector('#mg-finish-btn');
      const startedConnected = canvas.isConnected === true;

      if (type === 'alex_stealth' && window.KLB.Audio?.setRoomAmbience) {
        window.KLB.Audio.setRoomAmbience({ alexPursuitOn: true });
      }

      // Shared input state scoped cleanly to this modal lifecycle
      const input = {
        keys: new Set(),
        mouseDown: false,
        mouseX: W / 2,
        mouseY: H / 2,
        hasMouseMoved: false,
        justMouseMoved: false,
        justPressedAction: false,
        justClickedOnCanvas: false
      };

      let finished = false;
      let finishedAt = 0;
      let closed = false;
      let rafId = null;
      let autoCloseTimer = null;
      let finalPayload = null;
      let activePointerId = null;

      function isCanvasDetached() {
        if (startedConnected && canvas.isConnected === false) return true;
        if (typeof mountEl.contains === 'function' && !mountEl.contains(canvas)) return true;
        return false;
      }

      function updatePointerCoords(e, markMoved = false) {
        const rect = canvas.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          input.mouseX = clamp(((e.clientX - rect.left) / rect.width) * W, 0, W);
          input.mouseY = clamp(((e.clientY - rect.top) / rect.height) * H, 0, H);
          if (markMoved) {
            input.hasMouseMoved = true;
            input.justMouseMoved = true;
          }
        }
      }

      function abortAndExit() {
        if (closed) return { committed: false, aborted: false };
        if (finished && finalPayload) {
          finalizeAndExit();
          return { committed: true, aborted: false };
        }
        cleanupListeners();
        if (onFinish) onFinish({ score: 0, aborted: true });
        return { committed: false, aborted: true };
      }

      function onKeyDown(e) {
        if (closed) return;
        if (isCanvasDetached()) {
          cleanupListeners();
          return;
        }
        if (['Space', 'Enter', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
          e.preventDefault();
        }
        if (finished) {
          if (e.code === 'Escape') {
            e.preventDefault();
            if (finalPayload) finalizeAndExit();
            else abortAndExit();
            return;
          }
          if (!e.repeat && (e.code === 'Space' || e.code === 'Enter') && (performance.now() - finishedAt >= 450)) {
            finalizeAndExit();
          }
          return;
        }
        if (e.code === 'Escape') {
          e.preventDefault();
          abortAndExit();
          return;
        }
        if (e.repeat) return;
        if (!input.keys.has(e.code) && (e.code === 'Space' || e.code === 'Enter' || e.code === 'KeyE')) {
          input.justPressedAction = true;
        }
        input.keys.add(e.code);
      }

      function onKeyUp(e) {
        if (closed) return;
        if (isCanvasDetached()) {
          cleanupListeners();
          return;
        }
        input.keys.delete(e.code);
      }

      function onPointerDown(e) {
        if (closed) return;
        if (isCanvasDetached()) {
          cleanupListeners();
          return;
        }
        if (e.pointerType === 'mouse' && e.button !== 0) return;
        if (finished) {
          if (performance.now() - finishedAt >= 450) finalizeAndExit();
          return;
        }
        activePointerId = e.pointerId !== undefined ? e.pointerId : null;
        if (typeof canvas.setPointerCapture === 'function' && e.pointerId !== undefined) {
          try { canvas.setPointerCapture(e.pointerId); } catch (_) {}
        }
        updatePointerCoords(e, Boolean(e.pointerType && e.pointerType !== 'mouse'));
        input.mouseDown = true;
        input.justPressedAction = true;
        input.justClickedOnCanvas = true;
      }

      function onPointerMove(e) {
        if (closed) return;
        if (isCanvasDetached()) {
          cleanupListeners();
          return;
        }
        if (activePointerId !== null && e.pointerId !== undefined && e.pointerId !== activePointerId) return;
        updatePointerCoords(e, true);
      }

      function onPointerUp(e) {
        if (closed) return;
        if (isCanvasDetached()) {
          cleanupListeners();
          return;
        }
        if (activePointerId !== null && e && e.pointerId !== undefined && e.pointerId !== activePointerId) return;
        activePointerId = null;
        input.mouseDown = false;
      }

      window.addEventListener('keydown', onKeyDown);
      window.addEventListener('keyup', onKeyUp);
      canvas.addEventListener('pointerdown', onPointerDown);
      canvas.addEventListener('pointermove', onPointerMove);
      window.addEventListener('pointerup', onPointerUp);
      window.addEventListener('pointercancel', onPointerUp);
      if (closeBtn) closeBtn.onclick = abortAndExit;

      function cleanupListeners() {
        if (closed) return;
        closed = true;
        activePointerId = null;
        if (rafId !== null) {
          if (typeof cancelAnimationFrame === 'function') cancelAnimationFrame(rafId);
          rafId = null;
        }
        if (autoCloseTimer !== null) {
          clearTimeout(autoCloseTimer);
          autoCloseTimer = null;
        }
        window.removeEventListener('keydown', onKeyDown);
        window.removeEventListener('keyup', onKeyUp);
        canvas.removeEventListener('pointerdown', onPointerDown);
        canvas.removeEventListener('pointermove', onPointerMove);
        window.removeEventListener('pointerup', onPointerUp);
        window.removeEventListener('pointercancel', onPointerUp);
        if (closeBtn) closeBtn.onclick = null;
        if (finishBtn) finishBtn.onclick = null;
        if (finishBanner) finishBanner.onclick = null;
        if (type === 'alex_stealth' && window.KLB.Audio?.setRoomAmbience) {
          window.KLB.Audio.setRoomAmbience({ alexPursuitOn: false });
        }
        if (activeCleanup === cleanupListeners) {
          activeCleanup = null;
        }
        if (activeAbort === abortAndExit) {
          activeAbort = null;
        }
      }

      activeCleanup = cleanupListeners;
      activeAbort = abortAndExit;

      function finalizeAndExit() {
        if (closed) return;
        if (isCanvasDetached()) {
          cleanupListeners();
          return;
        }
        cleanupListeners();
        if (onFinish) {
          onFinish(finalPayload || { score: 80, summary: 'Bench protocol complete.' });
        }
      }

      function triggerComplete(score, summary) {
        if (finished || closed) return;
        finished = true;
        finishedAt = performance.now();
        const cleanScore = clamp(Math.round(score), 0, 100);
        finalPayload = { score: cleanScore, summary };

        playSfxSafe(cleanScore >= 65 ? 'success' : 'warning');
        scoreEl.textContent = `Score: ${cleanScore}%`;
        const finishIcon = cleanScore >= 80 ? 'sparkles' : cleanScore >= 55 ? 'check-circle' : 'alert-triangle';
        const finishLabel = cleanScore >= 80 ? 'Clean Technique!' : cleanScore >= 55 ? 'Acceptable Run' : 'Rough Bench Work';
        finishTitle.innerHTML = `${iconSvg(finishIcon, 20)}<span>${finishLabel} — ${cleanScore} / 100</span>`;
        finishTitle.style.color = cleanScore >= 80 ? '#86efac' : cleanScore >= 55 ? '#fde68a' : '#fca5a5';
        finishSub.textContent = summary;
        finishBanner.style.display = 'flex';
        const handleBannerContinue = () => {
          if (performance.now() - finishedAt >= 450) finalizeAndExit();
        };
        if (finishBanner) finishBanner.onclick = handleBannerContinue;
        if (finishBtn) {
          finishBtn.onclick = e => {
            if (e && typeof e.stopPropagation === 'function') e.stopPropagation();
            handleBannerContinue();
          };
        }

        // Auto-advance cleanly after 2.4s if player doesn't click earlier (guarded against modal abort/detach)
        autoCloseTimer = setTimeout(() => {
          autoCloseTimer = null;
          if (closed || isCanvasDetached()) {
            cleanupListeners();
            return;
          }
          finalizeAndExit();
        }, 2400);
      }

      const isActionHeld = () => input.mouseDown || input.keys.has('Space') || input.keys.has('KeyE') || input.keys.has('Enter');

      // Instantiate specific wet-lab runner using CSS logical dimensions (680x310)
      const runner = createMinigameRunner(type, W, H, meta.durationSec, config);
      let lastTs = performance.now();
      let elapsed = 0;

      function loop(now) {
        if (closed || isCanvasDetached()) {
          cleanupListeners();
          return;
        }
        const dt = clamp((now - lastTs) / 1000, 0.001, 0.05);
        lastTs = now;

        if (!finished) {
          elapsed += dt;
          const holding = isActionHeld();
          const stepState = runner.update(dt, elapsed, input, holding);
          input.justPressedAction = false;
          input.justClickedOnCanvas = false;
          input.justMouseMoved = false;

          runner.render(ctx);
          const livePct = clamp(Math.round(stepState.liveScore), 0, 100);
          scoreEl.textContent = stepState.statusText
            ? `Score: ${livePct}% | ${stepState.statusText}`
            : `Score: ${livePct}%`;
          timerEl.textContent = `${Math.max(0, meta.durationSec - elapsed).toFixed(1)}s`;

          if (stepState.done || elapsed >= meta.durationSec) {
            rafId = null;
            const finalRes = runner.finish();
            triggerComplete(finalRes.score, finalRes.summary);
            return;
          }
        }
        rafId = requestAnimationFrame(loop);
      }

      rafId = requestAnimationFrame(loop);
    }

    function abortActive() {
      if (typeof activeAbort === 'function') {
        const fn = activeAbort;
        activeAbort = null;
        const res = fn();
        if (res && typeof res === 'object') return res;
      }
      if (typeof activeCleanup === 'function') {
        const fn = activeCleanup;
        activeCleanup = null;
        fn();
      }
      return { committed: false, aborted: true };
    }

  function drawWrappedCanvasText(ctx, text, x, y, maxWidth, lineHeight, maxLines) {
    const words = String(text || '').split(/\s+/).filter(Boolean);
    const lines = [];
    let current = '';
    for (const word of words) {
      const candidate = current ? `${current} ${word}` : word;
      if (ctx.measureText(candidate).width <= maxWidth) {
        current = candidate;
      } else {
        if (current) lines.push(current);
        current = word;
        if (lines.length >= maxLines) break;
      }
    }
    if (current && lines.length < maxLines) {
      lines.push(current);
    }
    lines.forEach((line, idx) => {
      let out = line;
      if (idx === maxLines - 1 && ctx.measureText(out).width > maxWidth) {
        while (out.length > 3 && ctx.measureText(`${out}...`).width > maxWidth) {
          out = out.slice(0, -1);
        }
        out = `${out}...`;
      }
      ctx.fillText(out, x, y + idx * lineHeight);
    });
    return lines.length;
  }

  function createMinigameRunner(type, W, H, totalSec, config = {}) {
    // -------------------- 1. BIOTAGE UV PEAK COLLECTOR --------------------
    if (type === 'biotage') {
      let prodCaptured = 0;
      let prodTotal = 0;
      let junkCaptured = 0;
      let sfxCooldown = 0;
      const history = []; // { t, uv, isProd, isImpurity, collected }

      // Randomize impurity & product elution times slightly per run (±0.45s)
      const jitter = () => (Math.random() - 0.5) * 0.90;
      const tForerun = clamp(1.55 + jitter(), 0.95, 2.15);
      const tProd = clamp(4.65 + jitter(), 3.85, 5.45);
      const tTail = clamp(7.45 + jitter(), 6.85, 7.95);
      const prodStart = tProd - 1.25;
      const prodEnd = tProd + 1.25;

      function uvProfile(t) {
        const forerun = 0.48 * Math.exp(-0.5 * Math.pow((t - tForerun) / 0.34, 2));
        const mainProd = 0.94 * Math.exp(-0.5 * Math.pow((t - tProd) / 0.78, 2));
        const tailGunk = 0.38 * Math.exp(-0.5 * Math.pow((t - tTail) / 0.36, 2));
        const base = 0.04 + 0.01 * Math.sin(t * 9);
        const uv = clamp(base + forerun + mainProd + tailGunk, 0, 1);
        const isProd = t >= prodStart && t <= prodEnd && mainProd >= 0.24;
        const isImpurity = !isProd && (forerun >= 0.12 || tailGunk >= 0.12);
        return { uv, isProd, isImpurity, mainProd, impurity: forerun + tailGunk };
      }

      return {
        update(dt, elapsed, _input, holding) {
          const p = uvProfile(elapsed);
          if (p.isProd) {
            prodTotal += p.mainProd * dt;
            if (holding) prodCaptured += p.mainProd * dt;
          } else if (holding) {
            junkCaptured += (0.35 + p.impurity * 1.4) * dt;
          }

          sfxCooldown -= dt;
          if (holding && sfxCooldown <= 0) {
            sfxCooldown = 0.28;
            playSfxSafe(p.isProd ? 'pipette' : 'bump');
          }

          history.push({ t: elapsed, uv: p.uv, isProd: p.isProd, isImpurity: p.isImpurity, collected: holding });
          const prodWeight = clamp(prodTotal / 0.35, 0, 1);
          const rec = prodTotal > 0.02 ? clamp(prodCaptured / prodTotal, 0, 1) : 1.0;
          const effectiveRec = 0.90 * (1 - prodWeight) + rec * prodWeight;
          const liveScore = clamp(effectiveRec * 100 - junkCaptured * 48, 10, 100);
          return { liveScore, done: false };
        },
        render(ctx) {
          ctx.fillStyle = '#08101e';
          ctx.fillRect(0, 0, W, H);

          const gx = 48, gy = 26, gw = W - 68, gh = H - 84;
          ctx.strokeStyle = '#334155';
          ctx.strokeRect(gx, gy, gw, gh);

          const tToX = t => gx + (t / totalSec) * gw;

          // Only reveal eluted regions behind the live playhead (0 -> t), keeping un-eluted future trace hidden!
          for (let i = 1; i < history.length; i++) {
            const prev = history[i - 1];
            const cur = history[i];
            const x1 = tToX(prev.t);
            const x2 = tToX(cur.t) + 1;
            if (cur.isProd) {
              ctx.fillStyle = 'rgba(34, 197, 94, 0.14)';
              ctx.fillRect(x1, gy, Math.max(1.5, x2 - x1), gh);
            } else if (cur.isImpurity) {
              ctx.fillStyle = 'rgba(239, 68, 68, 0.11)';
              ctx.fillRect(x1, gy, Math.max(1.5, x2 - x1), gh);
            }
          }

          // Threshold dashed line (240 mAU)
          const threshY = gy + gh * (1 - 0.25);
          ctx.setLineDash([5, 4]);
          ctx.strokeStyle = '#a855f7';
          ctx.beginPath();
          ctx.moveTo(gx, threshY);
          ctx.lineTo(gx + gw, threshY);
          ctx.stroke();
          ctx.setLineDash([]);
          ctx.font = 'bold 10.5px Consolas, monospace';
          ctx.fillStyle = '#c4b5fd';
          ctx.fillText('240 mAU Threshold', gx + 6, threshY - 5);

          // Collected fraction highlight bars
          for (let i = 1; i < history.length; i++) {
            const prev = history[i - 1];
            const cur = history[i];
            if (cur.collected) {
              const x1 = tToX(prev.t);
              const x2 = tToX(cur.t) + 1;
              const y = gy + gh * (1 - cur.uv * 0.9);
              ctx.fillStyle = cur.isProd ? 'rgba(34, 197, 94, 0.44)' : 'rgba(239, 68, 68, 0.45)';
              ctx.fillRect(x1, y, Math.max(1.5, x2 - x1), gy + gh - y);
            }
          }

          // Progressive live 254 nm UV trace (0 -> t only)
          if (history.length > 1) {
            for (let i = 1; i < history.length; i++) {
              const prev = history[i - 1];
              const cur = history[i];
              ctx.strokeStyle = cur.isProd ? '#4ade80' : (cur.isImpurity ? '#f87171' : '#38bdf8');
              ctx.lineWidth = 2.4;
              ctx.beginPath();
              ctx.moveTo(tToX(prev.t), gy + gh * (1 - prev.uv * 0.9));
              ctx.lineTo(tToX(cur.t), gy + gh * (1 - cur.uv * 0.9));
              ctx.stroke();
            }

            const head = history[history.length - 1];
            const hx = tToX(head.t);
            const hy = gy + gh * (1 - head.uv * 0.9);
            ctx.fillStyle = head.isProd ? '#4ade80' : (head.isImpurity ? '#ef4444' : '#f8fafc');
            ctx.beginPath();
            ctx.arc(hx, hy, 5, 0, Math.PI * 2);
            ctx.fill();

            // Dynamic peak status badge at top of plot
            ctx.textAlign = 'right';
            if (head.isProd) {
              drawVectorDiamond(ctx, gx + gw - 178, gy + 11, 4.0, '#86efac');
              ctx.fillStyle = '#86efac';
              ctx.fillText('PRODUCT ELUTING — HOLD!', gx + gw - 10, gy + 15);
            } else if (head.isImpurity) {
              drawVectorWarning(ctx, gx + gw - 172, gy + 11, 3.8, '#fca5a5', '#08101e');
              ctx.fillStyle = '#fca5a5';
              ctx.fillText('IMPURITY PEAK — WASTE!', gx + gw - 10, gy + 15);
            } else {
              ctx.fillStyle = '#94a3b8';
              ctx.fillText('BASELINE ELUTION', gx + gw - 10, gy + 15);
            }
            ctx.textAlign = 'left';

            // Valve indicator badge at bottom
            const valveY = gy + gh + 14;
            ctx.fillStyle = head.collected ? (head.isProd ? '#15803d' : '#b91c1c') : '#1e293b';
            ctx.fillRect(gx, valveY, gw, 34);
            ctx.strokeStyle = head.collected ? (head.isProd ? '#86efac' : '#fca5a5') : '#475569';
            ctx.strokeRect(gx, valveY, gw, 34);
            ctx.fillStyle = head.collected ? (head.isProd ? '#86efac' : '#fde047') : '#94a3b8';
            ctx.beginPath();
            ctx.arc(gx + 18, valveY + 17, 5, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 12.5px Consolas, monospace';
            ctx.textAlign = 'center';
            ctx.fillText(
              head.collected
                ? (head.isProd ? 'VALVE: COLLECTING PURE PRODUCT FRACTIONS!' : 'VALVE OPEN ON IMPURITY / BASELINE — RELEASE!')
                : (head.isProd ? 'PRODUCT PEAK DETECTED — HOLD [SPACE / CLICK] NOW!' : 'VALVE: DIVERTING TO SOLVENT WASTE (Watch UV Peak)'),
              gx + gw / 2 + 8,
              valveY + 22
            );
            ctx.textAlign = 'left';
          }
        },
        finish() {
          const rec = prodTotal > 0 ? clamp(prodCaptured / prodTotal, 0, 1) : 0;
          const score = clamp(Math.round(rec * 100 - junkCaptured * 45), 10, 100);
          return {
            score,
            summary: `Captured ${Math.round(rec * 100)}% of the 254 nm product peak${junkCaptured > 0.25 ? ' with minor co-eluted forerun/tail fractions.' : ' cleanly into Tubes 4–7 with zero baseline gunk!'}`
          };
        }
      };
    }

    // -------------------- 2. SDS-PAGE MICROPIPETTE STEADY-HAND --------------------
    if (type === 'gel_load') {
      const gelModeCfg = String(config?.gelMode || '').toLowerCase();
      const defaultLaneLabels = gelModeCfg === 'hsa_monomer'
        ? ['Ladder', 'HSA Ctrl', 'Cys34 Act', 'HSA-Conj']
        : ['Ctrl', 'Red.', 'Crude', 'Prod'];
      const rawLaneLabels = Array.isArray(config?.laneLabels) ? config.laneLabels : [];
      const wells = [0, 1, 2, 3].map(i => {
        const shortLbl = String(rawLaneLabels[i] ?? defaultLaneLabels[i]).trim() || defaultLaneLabels[i];
        const label = /^well\s*\d/i.test(shortLbl) ? shortLbl : `Well ${i + 1} (${shortLbl})`;
        return {
          idx: i,
          shortLabel: shortLbl,
          label,
          cx: 130 + i * 140,
          halfW: 22,
          filled: false,
          punctured: false,
          score: 0
        };
      });
      let currentWell = 0;
      let lastInputMode = 'keyboard';
      let baseX = wells[0].cx;
      let tipX = baseX;
      let dipAnim = 0;

      return {
        update(dt, elapsed, input) {
          // Natural P20 pipette hand micro-tremor (peak 14.2 px)
          const tremor = Math.sin(elapsed * 11.5) * 9.2 + Math.cos(elapsed * 19.3) * 5.0;

          const moveDir = (input.keys.has('KeyD') || input.keys.has('ArrowRight') ? 1 : 0)
                        - (input.keys.has('KeyA') || input.keys.has('ArrowLeft') ? 1 : 0);
          if (moveDir !== 0) {
            lastInputMode = 'keyboard';
            input.hasMouseMoved = false;
          } else if (input.justMouseMoved || input.hasMouseMoved) {
            lastInputMode = 'mouse';
          }

          if (lastInputMode === 'mouse') {
            baseX += (clamp(input.mouseX, 60, W - 60) - baseX) * Math.min(1, dt * 13);
          } else if (moveDir !== 0) {
            baseX = clamp(baseX + moveDir * 270 * dt, 60, W - 60);
          }
          tipX = clamp(baseX + tremor, 45, W - 45);

          if (dipAnim > 0) dipAnim = Math.max(0, dipAnim - dt * 4);

          if (input.justPressedAction && currentWell < wells.length) {
            const w = wells[currentWell];
            const err = Math.abs(tipX - w.cx);
            dipAnim = 1.0;
            w.filled = true;
            if (err <= w.halfW * 0.50) {
              w.score = 100 - Math.round((err / w.halfW) * 18);
              playSfxSafe('pipette');
            } else if (err <= w.halfW * 1.12) {
              w.score = 68;
              w.punctured = true;
              playSfxSafe('warning');
            } else {
              w.score = 26;
              w.punctured = true;
              playSfxSafe('error');
            }
            currentWell++;
            if (currentWell < wells.length && lastInputMode === 'keyboard') {
              baseX = wells[currentWell].cx - 28;
            }
          }

          const loadedWells = wells.filter(w => w.filled);
          const avg = loadedWells.length ? loadedWells.reduce((s, w) => s + w.score, 0) / loadedWells.length : 85;
          return {
            liveScore: avg,
            statusText: `Wells: ${loadedWells.length}/4`,
            done: currentWell >= wells.length && dipAnim <= 0.1
          };
        },
        render(ctx) {
          const tankGrad = ctx.createLinearGradient(0, 0, 0, H);
          tankGrad.addColorStop(0, '#0b192c');
          tankGrad.addColorStop(0.35, '#123052');
          tankGrad.addColorStop(1, '#0e223d');
          ctx.fillStyle = tankGrad;
          ctx.fillRect(0, 0, W, H);

          const loadedCount = wells.filter(w => w.filled).length;
          ctx.fillStyle = loadedCount === 4 ? '#86efac' : '#93c5fd';
          ctx.font = 'bold 11.5px Consolas, monospace';
          ctx.textAlign = 'left';
          ctx.fillText(`Wells: ${loadedCount}/4`, 16, 22);
          if (gelModeCfg === 'hsa_monomer') {
            ctx.fillStyle = '#cbd5e1';
            ctx.textAlign = 'right';
            ctx.fillText('12% Non-Reducing HSA Cys34 Gel (66.5 kDa)', W - 16, 22);
            ctx.textAlign = 'left';
          }

          ctx.strokeStyle = 'rgba(125, 211, 252, 0.45)';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(0, 74);
          ctx.lineTo(W, 74);
          ctx.stroke();

          const gelTop = 128;
          const wellBottom = 212;
          ctx.fillStyle = 'rgba(191, 219, 254, 0.22)';
          ctx.fillRect(36, gelTop, W - 72, H - gelTop - 16);

          wells.forEach((w, idx) => {
            const isTarget = idx === currentWell;
            ctx.fillStyle = '#0c2340';
            ctx.fillRect(w.cx - w.halfW, gelTop, w.halfW * 2, wellBottom - gelTop);

            ctx.strokeStyle = isTarget ? '#4ade80' : (w.punctured ? '#f87171' : 'rgba(147, 197, 253, 0.6)');
            ctx.lineWidth = isTarget ? 2.5 : 1.5;
            ctx.strokeRect(w.cx - w.halfW, gelTop, w.halfW * 2, wellBottom - gelTop);

            if (isTarget) {
              const cleanHalf = w.halfW * 0.50;
              ctx.fillStyle = 'rgba(74, 222, 128, 0.28)';
              ctx.fillRect(w.cx - cleanHalf, wellBottom - 18, cleanHalf * 2, 18);
              drawVectorDownArrow(ctx, w.cx - 46, gelTop - 13, 4.2, '#86efac');
              drawVectorDownArrow(ctx, w.cx + 46, gelTop - 13, 4.2, '#86efac');
              ctx.fillStyle = '#86efac';
              ctx.font = 'bold 11px Consolas, monospace';
              ctx.textAlign = 'center';
              ctx.fillText('TARGET WELL', w.cx, gelTop - 10);
            }

            if (w.filled) {
              ctx.fillStyle = w.punctured ? 'rgba(56, 189, 248, 0.45)' : 'rgba(29, 78, 216, 0.92)';
              const hFill = w.punctured ? 12 : 24;
              ctx.fillRect(w.cx - w.halfW + 2, wellBottom - hFill, w.halfW * 2 - 4, hFill - 1);
              if (w.punctured) {
                ctx.fillStyle = '#fca5a5';
                ctx.font = 'bold 10px Consolas, monospace';
                ctx.textAlign = 'center';
                ctx.fillText('Wall Nicked!', w.cx, wellBottom + 16);
              }
            }

            ctx.fillStyle = '#cbd5e1';
            ctx.font = 'bold 11px Segoe UI, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(w.label, w.cx, H - 24);
          });

          const tipBottomY = 114 + dipAnim * 82;
          ctx.fillStyle = '#e2e8f0';
          ctx.beginPath();
          ctx.moveTo(tipX - 11, 14);
          ctx.lineTo(tipX + 11, 14);
          ctx.lineTo(tipX + 3.2, tipBottomY);
          ctx.lineTo(tipX - 3.2, tipBottomY);
          ctx.closePath();
          ctx.fill();

          ctx.fillStyle = '#2563eb';
          ctx.beginPath();
          ctx.moveTo(tipX - 5.5, tipBottomY - 34);
          ctx.lineTo(tipX + 5.5, tipBottomY - 34);
          ctx.lineTo(tipX + 2.8, tipBottomY);
          ctx.lineTo(tipX - 2.8, tipBottomY);
          ctx.closePath();
          ctx.fill();
          ctx.textAlign = 'left';
        },
        finish() {
          const total = wells.reduce((s, w) => s + (w.filled ? w.score : 20), 0) / wells.length;
          const punctures = wells.filter(w => w.punctured).length;
          const loadedCount = wells.filter(w => w.filled).length;
          return {
            score: clamp(Math.round(total), 15, 100),
            summary: `Loaded ${loadedCount}/4 polyacrylamide wells (${punctures === 0 ? 'zero comb-wall punctures — crisp glycerol layering!' : `${punctures} nicked well wall${punctures > 1 ? 's' : ''}`}).`
          };
        }
      };
    }

    // -------------------- 3. SYRINGE-PUMP & FLOW CONTROL --------------------
    if (type === 'syringe_cryo') {
      const cryoTitle = String(config?.title || 'Syringe Pump Flow Control').trim();
      const cryoSubtitle = String(config?.subtitle || 'Keep addition rate steady inside the target zone').trim();
      const rawRateCfg = String(config?.rateLabel || '').trim();
      const rawTempCfg = String(config?.tempLabel || '').trim();
      const contextStr = `${cryoTitle} ${cryoSubtitle} ${rawTempCfg}`;
      const isCryoContext = /-78|cryo|dry[- ]?ice|acetone|bromomalonate/i.test(contextStr);

      // Parse dynamic rateLabel / tempLabel if supplied
      const rateMatch = rawRateCfg.match(/^([+-]?\d+(?:\.\d+)?)\s*(.*)$/);
      const defaultRate = /emulsif|plga|dropwise/i.test(contextStr) ? 25.0 : (/herceptin|staple/i.test(contextStr) ? 4.0 : 5.7);
      const baseRateVal = rateMatch ? parseFloat(rateMatch[1]) : defaultRate;
      const rateUnit = (rateMatch && rateMatch[2]) ? rateMatch[2] : 'µL/min';

      const tempMatch = rawTempCfg.match(/([+-]?\d+(?:\.\d+)?)\s*(°C|C|K)?/i);
      const baseTempVal = tempMatch ? parseFloat(tempMatch[1]) : (isCryoContext ? -78 : 21);
      const tempUnit = (tempMatch && tempMatch[2]) ? tempMatch[2] : '°C';

      // Gentle random frequency & phase drift per run
      const freq1 = 1.45 + (Math.random() - 0.5) * 0.35;
      const freq2 = 2.95 + (Math.random() - 0.5) * 0.50;
      const phase1 = Math.random() * Math.PI * 2;
      const phase2 = Math.random() * Math.PI * 2;

      let marker = 0.5;
      let vel = 0;
      let bandCenter = 0.5;
      const bandHalf = 0.16;
      let inZoneTime = 0;
      let totalTime = 0;
      let wasInBand = true;
      let warnCooldown = 0;
      let simElapsed = 0;

      return {
        update(dt, elapsed, _input, holding) {
          simElapsed = elapsed;
          totalTime += dt;
          warnCooldown = Math.max(0, warnCooldown - dt);
          bandCenter = 0.5 + 0.24 * Math.sin(elapsed * freq1 + phase1) + 0.10 * Math.cos(elapsed * freq2 + phase2);
          const accel = holding ? 1.55 : -1.35;
          vel = clamp(vel * Math.pow(0.18, dt) + accel * dt, -0.95, 0.95);
          marker = clamp(marker + vel * dt, 0.04, 0.96);

          const dist = Math.abs(marker - bandCenter);
          const inBandNow = dist <= bandHalf;
          if (inBandNow) {
            inZoneTime += dt;
          } else if (dist <= bandHalf * 1.45) {
            inZoneTime += dt * 0.45;
          }
          if (wasInBand && !inBandNow && totalTime > 0.25 && warnCooldown <= 0) {
            playSfxSafe('warning');
            warnCooldown = 0.65;
          }
          wasInBand = inBandNow;

          const liveScore = clamp((inZoneTime / Math.max(0.15, totalTime)) * 104, 15, 100);
          return { liveScore, done: false };
        },
        render(ctx) {
          ctx.fillStyle = isCryoContext ? '#061020' : '#08111f';
          ctx.fillRect(0, 0, W, H);

          if (isCryoContext) {
            const cryoPanelGrad = ctx.createLinearGradient(24, 24, 24, H - 24);
            cryoPanelGrad.addColorStop(0, '#0c2340');
            cryoPanelGrad.addColorStop(1, '#09192e');
            ctx.fillStyle = cryoPanelGrad;
            ctx.strokeStyle = '#38bdf8';
          } else {
            ctx.fillStyle = '#111e36';
            ctx.strokeStyle = '#334155';
          }
          ctx.lineWidth = 1.5;
          ctx.fillRect(24, 24, 308, H - 48);
          ctx.strokeRect(24, 24, 308, H - 48);

          const inBand = Math.abs(marker - bandCenter) <= bandHalf;
          const zoneStability = clamp(Math.round((1 - Math.abs(marker - bandCenter) / 0.5) * 100), 0, 100);
          const liveRateVal = baseRateVal + (marker - bandCenter) * Math.max(1.2, Math.abs(baseRateVal) * 0.45);
          const rateDisp = (rawRateCfg && !rateMatch)
            ? rawRateCfg
            : `${liveRateVal.toFixed(baseRateVal >= 10 ? 1 : 2)} ${rateUnit}`;
          const liveTempVal = baseTempVal + (marker - bandCenter) * 10;
          const tempDisp = (rawTempCfg && !tempMatch)
            ? `Bath: ${rawTempCfg}`
            : rawTempCfg
              ? `Temp: ${liveTempVal.toFixed(1)} ${tempUnit} (${rawTempCfg})`
              : isCryoContext
                ? `Cryo Bath: ${liveTempVal.toFixed(1)} ${tempUnit}`
                : `Stability: ${zoneStability}%`;

          ctx.textAlign = 'left';
          ctx.fillStyle = isCryoContext ? '#7dd3fc' : '#93c5fd';
          ctx.font = 'bold 11.5px Consolas, monospace';
          const titleLines = drawWrappedCanvasText(ctx, cryoTitle, 36, 46, 284, 15, 2);

          ctx.fillStyle = '#cbd5e1';
          ctx.font = '10px Consolas, monospace';
          const subY = 46 + titleLines * 15 + 3;
          const subLines = drawWrappedCanvasText(ctx, cryoSubtitle, 36, subY, 284, 14, 2);

          const metricY = Math.max(104, subY + subLines * 14 + 12);
          ctx.fillStyle = inBand ? '#4ade80' : '#f87171';
          ctx.font = 'bold 20px Consolas, monospace';
          ctx.fillText(fitCanvasText(ctx, rateDisp, rawRateCfg && rateMatch ? 175 : 284), 36, metricY);

          if (rawRateCfg && rateMatch) {
            ctx.textAlign = 'right';
            ctx.fillStyle = '#94a3b8';
            ctx.font = 'bold 10px Consolas, monospace';
            ctx.fillText(fitCanvasText(ctx, `Set: ${rawRateCfg}`, 110), 320, metricY - 2);
            ctx.textAlign = 'left';
          }

          ctx.fillStyle = isCryoContext ? (inBand ? '#7dd3fc' : '#fbbf24') : (inBand ? '#38bdf8' : '#fbbf24');
          ctx.font = 'bold 13px Consolas, monospace';
          ctx.fillText(fitCanvasText(ctx, tempDisp, 284), 36, metricY + 23);

          const vesselY = metricY + 38;
          const vesselH = Math.max(52, 254 - vesselY);
          const vx = 58;
          const vw = 240;

          if (isCryoContext) {
            // Frosty blue dry-ice/acetone Dewar cryo bath visual mode
            const bathGrad = ctx.createLinearGradient(vx, vesselY, vx, vesselY + vesselH);
            bathGrad.addColorStop(0, 'rgba(125, 211, 252, 0.24)');
            bathGrad.addColorStop(0.45, 'rgba(14, 165, 233, 0.44)');
            bathGrad.addColorStop(1, 'rgba(3, 105, 161, 0.65)');
            ctx.fillStyle = bathGrad;
            ctx.fillRect(vx, vesselY + 10, vw, vesselH - 10);

            // Insulated Dewar rim + ice-crystal frost sheen
            ctx.strokeStyle = '#7dd3fc';
            ctx.lineWidth = 2;
            ctx.strokeRect(vx, vesselY + 10, vw, vesselH - 10);

            // Floating frosty dry-ice chunks & rising cold vapor plumes
            for (let i = 0; i < 6; i++) {
              const bx = vx + 18 + i * 38 + Math.sin(simElapsed * 1.8 + i) * 3;
              const by = vesselY + 16 + (i % 2) * 5;
              ctx.fillStyle = 'rgba(224, 242, 254, 0.72)';
              ctx.fillRect(bx, by, 14, 6);
              const vaporLift = ((simElapsed * 16 + i * 11) % 16);
              ctx.fillStyle = `rgba(186, 230, 253, ${(0.38 - vaporLift / 48).toFixed(2)})`;
              ctx.beginPath();
              ctx.arc(bx + 7, vesselY + 10 - vaporLift * 0.65, 5 + (i % 2) * 2, 0, Math.PI * 2);
              ctx.fill();
            }

            // Submerged reaction flask inside the cryo bath
            const fx = vx + vw / 2;
            const fy = vesselY + vesselH - 22;
            ctx.fillStyle = inBand ? 'rgba(186, 230, 253, 0.35)' : 'rgba(248, 113, 113, 0.48)';
            ctx.beginPath();
            ctx.arc(fx, fy, 18, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = inBand ? '#e0f2fe' : '#fca5a5';
            ctx.lineWidth = 1.6;
            ctx.stroke();

            // Overhead syringe needle + animated reagent drop
            ctx.strokeStyle = '#cbd5e1';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(fx, vesselY - 6);
            ctx.lineTo(fx, vesselY + 12);
            ctx.stroke();
            const dropFrac = (simElapsed * (1.5 + marker * 2.2)) % 1;
            ctx.fillStyle = inBand ? '#38bdf8' : '#fb923c';
            ctx.beginPath();
            ctx.arc(fx, vesselY + 14 + dropFrac * (fy - vesselY - 22), 2.8, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = '#bae6fd';
            ctx.font = 'bold 9.5px Consolas, monospace';
            ctx.fillText('CRYO BATH', vx + 8, vesselY + vesselH - 6);
          } else {
            // Standard bench syringe-pump vessel
            ctx.fillStyle = inBand ? 'rgba(56, 189, 248, 0.25)' : 'rgba(239, 68, 68, 0.30)';
            ctx.fillRect(vx + 14, vesselY + 8, vw - 28, vesselH - 8);
            ctx.strokeStyle = '#94a3b8';
            ctx.lineWidth = 1.5;
            ctx.strokeRect(vx + 14, vesselY + 8, vw - 28, vesselH - 8);

            const fx = vx + vw / 2;
            ctx.strokeStyle = '#cbd5e1';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(fx, vesselY - 4);
            ctx.lineTo(fx, vesselY + 12);
            ctx.stroke();
            const dropFrac = (simElapsed * (1.5 + marker * 2.2)) % 1;
            ctx.fillStyle = inBand ? '#4ade80' : '#fb923c';
            ctx.beginPath();
            ctx.arc(fx, vesselY + 14 + dropFrac * Math.max(12, vesselH - 26), 2.8, 0, Math.PI * 2);
            ctx.fill();
          }

          if (inBand) {
            drawVectorCheck(ctx, 44, 270, 4.8, '#4ade80');
          } else {
            drawVectorWarning(ctx, 44, 270, 4.6, marker > bandCenter ? '#f87171' : '#38bdf8', '#08111f');
          }
          ctx.fillStyle = '#e2e8f0';
          ctx.font = '11px Consolas, monospace';
          ctx.fillText(
            inBand
              ? 'Steady inside target zone'
              : (marker > bandCenter ? 'Rate too high — release!' : 'Rate too low — hold!'),
            54,
            274
          );

          const gx = 370, gy = 24, gw = 260, gh = H - 48;
          ctx.fillStyle = '#0d1729';
          ctx.fillRect(gx, gy, gw, gh);
          ctx.strokeStyle = '#475569';
          ctx.strokeRect(gx, gy, gw, gh);

          const bTop = gy + (1 - (bandCenter + bandHalf)) * gh;
          const bHeight = bandHalf * 2 * gh;
          ctx.fillStyle = 'rgba(34, 197, 94, 0.25)';
          ctx.fillRect(gx + 4, bTop, gw - 8, bHeight);
          ctx.strokeStyle = '#22c55e';
          ctx.lineWidth = 2;
          ctx.strokeRect(gx + 4, bTop, gw - 8, bHeight);

          ctx.fillStyle = '#86efac';
          ctx.font = 'bold 11.5px Consolas, monospace';
          ctx.textAlign = 'center';
          ctx.fillText('TARGET ZONE', gx + gw / 2, bTop + bHeight / 2 + 4);
          ctx.textAlign = 'left';

          const my = gy + (1 - marker) * gh;
          ctx.fillStyle = inBand ? '#4ade80' : '#f97316';
          ctx.fillRect(gx + 16, my - 7, gw - 32, 14);
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 1.5;
          ctx.strokeRect(gx + 16, my - 7, gw - 32, 14);
        },
        finish() {
          const pct = clamp(Math.round((inZoneTime / Math.max(0.15, totalTime)) * 104), 18, 100);
          return {
            score: pct,
            summary: `Kept ${cryoTitle} steady inside the target zone for ${pct}% of the addition window.`
          };
        }
      };
    }

    // -------------------- 4. CALISE'S FLYING REDUCED BAGS OF LEMONS & FLASKS --------------------
    if (type === 'lemons') {
      const lemonTitle = String(config?.title || 'Catch Flasks and Lemons').trim();
      const lemonSubtitle = String(config?.subtitle || '').trim();
      let trayX = W / 2;
      const trayW = 108;
      const trayY = H - 38;
      let spawnTimer = 0.15;
      let scorePts = 52;
      let lemonsCaught = 0;
      let flasksCaught = 0;
      let silicaHits = 0;
      const items = []; // { x, y, vy, kind: 'lemon'|'flask'|'silica' }

      return {
        update(dt, elapsed, input) {
          if (input.hasMouseMoved) {
            trayX += (input.mouseX - trayX) * Math.min(1, dt * 16);
          }
          const dir = (input.keys.has('KeyD') || input.keys.has('ArrowRight') ? 1 : 0)
                    - (input.keys.has('KeyA') || input.keys.has('ArrowLeft') ? 1 : 0);
          if (dir !== 0) {
            input.hasMouseMoved = false;
            trayX += dir * 420 * dt;
          }
          trayX = clamp(trayX, trayW / 2 + 12, W - trayW / 2 - 12);

          // Stop spawning new items in the final 1.6s so everything on screen can be caught cleanly
          if (elapsed < totalSec - 1.6) {
            spawnTimer -= dt;
            if (spawnTimer <= 0) {
              spawnTimer = 0.36 + Math.random() * 0.22;
              const r = Math.random();
              const kind = r < 0.38 ? 'lemon' : r < 0.72 ? 'flask' : 'silica';
              items.push({
                x: 42 + Math.random() * (W - 84),
                y: -16,
                vy: 165 + Math.random() * 95,
                kind
              });
            }
          }

          for (let i = items.length - 1; i >= 0; i--) {
            const it = items[i];
            it.y += it.vy * dt;
            if (it.y >= trayY - 14 && it.y <= trayY + 20 && Math.abs(it.x - trayX) <= trayW / 2 + 12) {
              if (it.kind === 'lemon') {
                scorePts += 11;
                lemonsCaught++;
                playSfxSafe('interact');
              } else if (it.kind === 'flask') {
                scorePts += 9;
                flasksCaught++;
                playSfxSafe('pipette');
              } else {
                scorePts -= 16;
                silicaHits++;
                playSfxSafe('error');
              }
              items.splice(i, 1);
            } else if (it.y > H + 24) {
              items.splice(i, 1);
            }
          }

          return { liveScore: clamp(scorePts, 10, 100), done: false };
        },
        render(ctx) {
          ctx.fillStyle = '#0c1526';
          ctx.fillRect(0, 0, W, H);

          ctx.fillStyle = '#facc15';
          ctx.beginPath();
          ctx.ellipse(22, 18, 6.5, 4.5, -0.25, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#38bdf8';
          ctx.beginPath();
          ctx.arc(138, 19, 5, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#f87171';
          ctx.beginPath();
          ctx.arc(256, 18, 5, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#94a3b8';
          ctx.font = 'bold 11.5px Consolas, monospace';
          ctx.fillText(`Lemons: ${lemonsCaught}`, 34, 22);
          ctx.fillText(`Flasks: ${flasksCaught}`, 150, 22);
          ctx.fillText(`Silica Hits: ${silicaHits}`, 268, 22);
          if (lemonSubtitle) {
            ctx.textAlign = 'right';
            ctx.fillStyle = '#64748b';
            ctx.fillText(fitCanvasText(ctx, lemonSubtitle, 250), W - 14, 22);
            ctx.textAlign = 'left';
          }

          items.forEach(it => {
            ctx.save();
            ctx.translate(it.x, it.y);
            if (it.kind === 'lemon') {
              ctx.fillStyle = '#facc15';
              ctx.beginPath();
              ctx.ellipse(0, 0, 13, 9.5, -0.25, 0, Math.PI * 2);
              ctx.fill();
              ctx.fillStyle = '#fef08a';
              ctx.beginPath();
              ctx.arc(-4, -3, 3, 0, Math.PI * 2);
              ctx.fill();
            } else if (it.kind === 'flask') {
              ctx.fillStyle = '#38bdf8';
              ctx.beginPath();
              ctx.arc(0, 4, 11, 0, Math.PI * 2);
              ctx.fill();
              ctx.fillStyle = '#e2e8f0';
              ctx.fillRect(-3.5, -12, 7, 10);
            } else {
              ctx.fillStyle = 'rgba(248, 113, 113, 0.85)';
              ctx.beginPath();
              ctx.arc(0, 0, 12, 0, Math.PI * 2);
              ctx.fill();
              ctx.fillStyle = '#ffffff';
              ctx.font = 'bold 9px Consolas, monospace';
              ctx.textAlign = 'center';
              ctx.fillText('SiO2', 0, 3);
            }
            ctx.restore();
          });

          ctx.fillStyle = '#2563eb';
          ctx.fillRect(trayX - trayW / 2, trayY, trayW, 18);
          ctx.strokeStyle = '#93c5fd';
          ctx.lineWidth = 2;
          ctx.strokeRect(trayX - trayW / 2, trayY, trayW, 18);
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 10px Consolas, monospace';
          ctx.textAlign = 'center';
          ctx.fillText('KLB LAB TRAY', trayX, trayY + 13);
          ctx.textAlign = 'left';
        },
        finish() {
          return {
            score: clamp(Math.round(scorePts), 15, 100),
            summary: `${lemonTitle}: caught ${flasksCaught} round-bottom flasks & ${lemonsCaught} reduced bags of lemons (${silicaHits} silica cloud hit${silicaHits === 1 ? '' : 's'}).`
          };
        }
      };
    }

    // -------------------- 5. BÜCHI ROTAVAP BUMP-TRAP VACUUM CONTROL --------------------
    if (type === 'buchi_bump') {
      const buchiTitle = String(config?.title || 'Büchi Bump-Trap Vacuum Control').trim();
      const solventName = String(config?.solvent || 'DCM / EtOAc').trim();
      let pressure = 850; // mbar (range 120..850)
      let evapPct = 0; // 0..100%
      let foam = 0.06; // 0..1.0 (>= 1.0 triggers BUMP!)
      let bumps = 0;
      let sweetTime = 0;
      let finishElapsed = totalSec;
      let completed = false;
      let flaskAngle = 0;
      let simElapsed = 0;
      let bumpFlash = 0;
      let trapStain = 0;
      let dripOffset = 0;
      let lastEvapRate = 0;
      let lastHolding = false;
      let sfxCooldown = 0;

      const splashDrops = [];
      const boilSeeds = Array.from({ length: 14 }, (_, idx) => ({
        phase: (idx * 0.37) % 1,
        xOff: ((idx * 19) % 44) - 22,
        r: 1.8 + (idx % 3) * 1.05
      }));

      function computeFinalScore() {
        const speedBonus = evapPct >= 100 ? clamp((totalSec - finishElapsed) * 2.2, 0, 10) : 0;
        const base = evapPct >= 100
          ? 90 + speedBonus
          : 22 + (evapPct / 100) * 66 + clamp(sweetTime * 0.6, 0, 4);
        return clamp(Math.round(base - bumps * 22), 0, 100);
      }

      return {
        update(dt, elapsed, _input, holding) {
          simElapsed = elapsed;
          lastHolding = Boolean(holding);
          sfxCooldown = Math.max(0, sfxCooldown - dt);
          bumpFlash = Math.max(0, bumpFlash - dt * 1.4);

          // Hold Space or Left-Click pulls vacuum (850 -> 120 mbar); release vents bleed valve
          const vacRate = holding ? -310 : 235;
          pressure = clamp(pressure + vacRate * dt, 120, 850);

          // Evaporation rate + foam dynamics across vacuum regimes
          const inSweetZone = pressure >= 220 && pressure <= 420;
          let evapRate = 0.4;
          if (inSweetZone) {
            const centerFactor = 1 - Math.abs(pressure - 320) / 100;
            evapRate = 12.2 + centerFactor * 2.4; // Sweet-zone +evap bonus
            sweetTime += dt;
            // Zero foam surge inside sweet zone; settles smoothly toward calm meniscus
            if (foam > 0.16) foam = Math.max(0.16, foam - dt * 0.28);
            else foam = clamp(foam + (0.14 - foam) * Math.min(1, dt * 3), 0.06, 0.20);
          } else if (pressure < 200) {
            // Below 200 mbar: foam surges rapidly up into the glass bump trap!
            evapRate = 10.2;
            const surgeDepth = (200 - pressure) / 80; // 0..1
            foam += (0.60 + surgeDepth * 0.88) * dt;
          } else if (pressure < 220) {
            // Borderline transition zone (200..220 mbar)
            evapRate = 11.0;
            foam += (holding ? 0.16 : -0.22) * dt;
            foam = clamp(foam, 0.08, 0.99);
          } else {
            // Gentle/high pressure (> 420 mbar): slower distillation, foam settles rapidly
            if (pressure <= 650) {
              evapRate = 0.8 + ((650 - pressure) / 230) * 6.4;
            } else {
              evapRate = 0.4;
            }
            const settleRate = 0.48 + ((pressure - 420) / 430) * 0.48;
            foam = Math.max(0.05, foam - settleRate * dt);
          }

          lastEvapRate = evapRate;
          evapPct = clamp(evapPct + evapRate * dt, 0, 100);
          flaskAngle += dt * (2.6 + (evapRate / 14) * 2.2);
          dripOffset = (dripOffset + dt * (0.4 + evapRate * 0.19)) % 1;

          // Update animated splash droplets inside bump trap
          for (let i = splashDrops.length - 1; i >= 0; i--) {
            const d = splashDrops[i];
            d.life -= dt * 1.4;
            d.x += d.vx * dt;
            d.y += d.vy * dt;
            d.vy += 45 * dt;
            if (d.life <= 0) splashDrops.splice(i, 1);
          }

          // Check bump-trap breach!
          if (foam >= 1.0) {
            bumps += 1;
            pressure = 700; // Vent reset to 700 mbar
            foam = 0.22;
            bumpFlash = 1.0;
            trapStain = Math.min(1, trapStain + 0.42);
            playSfxSafe('warning');
            for (let k = 0; k < 12; k++) {
              const ang = (k / 12) * Math.PI * 2 + 0.2;
              const spd = 24 + (k % 4) * 14;
              splashDrops.push({
                x: (k % 3 - 1) * 4,
                y: 0,
                vx: Math.cos(ang) * spd,
                vy: Math.sin(ang) * spd - 12,
                r: 2.0 + (k % 3) * 0.9,
                life: 1.0
              });
            }
          } else if (holding && sfxCooldown <= 0) {
            sfxCooldown = 1.15;
            playSfxSafe(inSweetZone ? 'buchi' : 'pipette');
          }

          if (evapPct >= 100) {
            evapPct = 100;
            completed = true;
            finishElapsed = elapsed;
            return { liveScore: computeFinalScore(), done: true };
          }

          const expectedPace = elapsed > 1.5 ? Math.min(100, (elapsed - 1.0) * 9.5) : 0;
          const paceRatio = expectedPace > 1 ? clamp(evapPct / expectedPace, 0, 1) : 1;
          const liveScore = clamp(Math.round(42 + paceRatio * 50 + (evapPct / 100) * 8 - bumps * 22), 0, 100);
          return { liveScore, done: false };
        },
        render(ctx) {
          ctx.fillStyle = '#08111f';
          ctx.fillRect(0, 0, W, H);

          // Subtle lab blueprint grid
          ctx.strokeStyle = 'rgba(148, 163, 184, 0.06)';
          ctx.lineWidth = 1;
          for (let gx = 20; gx < 444; gx += 32) {
            ctx.beginPath(); ctx.moveTo(gx, 10); ctx.lineTo(gx, 282); ctx.stroke();
          }
          for (let gy = 20; gy < 282; gy += 32) {
            ctx.beginPath(); ctx.moveTo(12, gy); ctx.lineTo(444, gy); ctx.stroke();
          }

          // Fume-hood bench deck
          ctx.fillStyle = '#142033';
          ctx.fillRect(0, 282, 446, H - 282);
          ctx.strokeStyle = '#334155';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(0, 282);
          ctx.lineTo(446, 282);
          ctx.stroke();

          // Top apparatus title bar
          ctx.textAlign = 'left';
          ctx.fillStyle = '#93c5fd';
          ctx.font = 'bold 11px Consolas, monospace';
          ctx.fillText(`KLB 2F BÜCHI R-300  |  ${solventName}`, 16, 24);

          // ---- 1. ELEVATOR STAND & MOTOR DRIVE UNIT ----
          ctx.fillStyle = '#1e293b';
          ctx.fillRect(204, 270, 74, 12);
          ctx.strokeStyle = '#475569';
          ctx.strokeRect(204, 270, 74, 12);

          const mastGrad = ctx.createLinearGradient(228, 0, 252, 0);
          mastGrad.addColorStop(0, '#334155');
          mastGrad.addColorStop(0.45, '#64748b');
          mastGrad.addColorStop(1, '#1e293b');
          ctx.fillStyle = mastGrad;
          ctx.fillRect(230, 56, 20, 214);
          ctx.strokeStyle = '#94a3b8';
          ctx.lineWidth = 1;
          ctx.strokeRect(230, 56, 20, 214);

          // ---- 2. WARM SHIMMERING 40 °C WATER BATH ----
          const bathX = 34, bathY = 214, bathW = 154, bathH = 68;
          // Rising thermal shimmer wisps above warm water bath
          for (let i = 0; i < 5; i++) {
            const sx = bathX + 20 + i * 28 + Math.sin(simElapsed * 2.4 + i) * 4;
            const rise = (simElapsed * 18 + i * 9) % 24;
            ctx.strokeStyle = `rgba(251, 191, 36, ${(0.28 - rise / 95).toFixed(2)})`;
            ctx.lineWidth = 1.4;
            ctx.beginPath();
            ctx.moveTo(sx, bathY - 2 - rise * 0.4);
            ctx.quadraticCurveTo(sx + 4, bathY - 9 - rise * 0.6, sx - 2, bathY - 16 - rise * 0.8);
            ctx.stroke();
          }

          // Water bath interior warm fluid
          const waterGrad = ctx.createLinearGradient(bathX, bathY, bathX, bathY + 46);
          waterGrad.addColorStop(0, 'rgba(56, 189, 248, 0.34)');
          waterGrad.addColorStop(0.55, 'rgba(14, 165, 233, 0.44)');
          waterGrad.addColorStop(1, 'rgba(245, 158, 11, 0.36)');
          ctx.fillStyle = waterGrad;
          ctx.fillRect(bathX + 6, bathY + 4, bathW - 12, 42);

          // Animated shimmering water surface wave
          ctx.strokeStyle = 'rgba(254, 243, 199, 0.65)';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          for (let wx = bathX + 6; wx <= bathX + bathW - 6; wx += 6) {
            const wy = bathY + 7 + Math.sin(wx * 0.14 + simElapsed * 4.5) * 1.8;
            if (wx === bathX + 6) ctx.moveTo(wx, wy);
            else ctx.lineTo(wx, wy);
          }
          ctx.stroke();

          // ---- 3. TILTED SPINNING ROUND-BOTTOM FLASK, NECK & GLASS BUMP TRAP ----
          const flaskCx = 112;
          const flaskCy = 208;
          const tiltRad = -0.59; // tilted up-right into rotary drive

          ctx.save();
          ctx.translate(flaskCx, flaskCy);
          ctx.rotate(tiltRad);

          // Neck + Bump-Trap interior path (in local coordinates along +X axis)
          const trapCx = 86;
          const trapRx = 26;
          const trapRy = 20;
          const breachX = 114;

          // Draw rising frothy foam clipped to neck + bump trap
          ctx.save();
          ctx.beginPath();
          ctx.rect(34, -9, 28, 18); // flask neck
          ctx.ellipse(trapCx, 0, trapRx - 1.5, trapRy - 1.5, 0, 0, Math.PI * 2); // bump trap bulb
          ctx.rect(108, -8, 22, 16); // upper vapor duct
          ctx.clip();

          // Persistent amber residue stain on trap glass after any bump
          if (trapStain > 0) {
            ctx.fillStyle = `rgba(245, 158, 11, ${(trapStain * 0.42).toFixed(2)})`;
            ctx.beginPath();
            ctx.ellipse(trapCx + 4, 0, trapRx - 2, trapRy - 2, 0, 0, Math.PI * 2);
            ctx.fill();
          }

          // Rising foam column from d = 34 to d = breachX (114)
          const foamTopX = 34 + clamp(foam, 0, 1.05) * (breachX - 34);
          const foamGrad = ctx.createLinearGradient(34, 0, foamTopX + 8, 0);
          foamGrad.addColorStop(0, 'rgba(251, 191, 36, 0.82)');
          foamGrad.addColorStop(0.55, 'rgba(254, 243, 199, 0.88)');
          foamGrad.addColorStop(1, foam > 0.65 ? 'rgba(254, 202, 202, 0.94)' : 'rgba(255, 255, 255, 0.92)');
          ctx.fillStyle = foamGrad;
          ctx.fillRect(34, -22, Math.max(0, foamTopX - 34), 44);

          // Effervescent foam bubbles inside neck & trap
          const bubbleCount = Math.floor(6 + foam * 18);
          for (let b = 0; b < bubbleCount; b++) {
            const frac = ((b / Math.max(1, bubbleCount)) + (simElapsed * 0.35)) % 1;
            const bx = 36 + frac * Math.max(6, foamTopX - 36);
            const spread = bx > 60 && bx < 110 ? 14 : 6;
            const by = Math.sin(b * 3.7 + simElapsed * 6.5) * spread;
            const br = 2.0 + (b % 3) * 1.15;
            ctx.fillStyle = 'rgba(255, 255, 255, 0.78)';
            ctx.beginPath();
            ctx.arc(bx, by, br, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = 'rgba(217, 119, 6, 0.35)';
            ctx.lineWidth = 0.7;
            ctx.stroke();
          }

          // Bump splash droplets flying inside bump trap
          splashDrops.forEach(d => {
            ctx.fillStyle = `rgba(251, 146, 60, ${clamp(d.life, 0, 1).toFixed(2)})`;
            ctx.beginPath();
            ctx.arc(trapCx + d.x, d.y, d.r, 0, Math.PI * 2);
            ctx.fill();
          });
          ctx.restore();

          // Glass outline of neck, bump trap bulb, and upper duct
          ctx.strokeStyle = bumpFlash > 0.1 ? '#ef4444' : (foam > 0.65 ? '#fbbf24' : '#cbd5e1');
          ctx.lineWidth = bumpFlash > 0.1 ? 2.4 : 1.7;
          ctx.fillStyle = 'rgba(186, 230, 253, 0.10)';
          // Flask neck tube
          ctx.fillRect(34, -9, 28, 18);
          ctx.strokeRect(34, -9, 28, 18);
          // Bump trap bulb
          ctx.beginPath();
          ctx.ellipse(trapCx, 0, trapRx, trapRy, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
          // Upper vapor duct into drive hub
          ctx.fillRect(110, -8, 30, 16);
          ctx.strokeRect(110, -8, 30, 16);

          // Red breach line across top of bump trap
          ctx.save();
          ctx.setLineDash([3, 3]);
          ctx.strokeStyle = '#f87171';
          ctx.lineWidth = 1.6;
          ctx.beginPath();
          ctx.moveTo(breachX - 2, -16);
          ctx.lineTo(breachX - 2, 16);
          ctx.stroke();
          ctx.restore();

          // Spinning round-bottom flask glass cavity + swirling shrinking organic liquid
          const flaskR = 39;
          ctx.save();
          ctx.beginPath();
          ctx.arc(0, 0, flaskR - 2, 0, Math.PI * 2);
          ctx.clip();

          // Un-rotate slightly so liquid gravity pools at the true bottom of the flask!
          ctx.rotate(-tiltRad);
          const fillFrac = clamp(0.80 - (evapPct / 100) * 0.66, 0.12, 0.80);
          const liqTopY = flaskR - fillFrac * (flaskR * 1.85);
          const liqGrad = ctx.createLinearGradient(0, liqTopY, 0, flaskR);
          liqGrad.addColorStop(0, '#fbbf24');
          liqGrad.addColorStop(0.55, '#d97706');
          liqGrad.addColorStop(1, '#92400e');
          ctx.fillStyle = liqGrad;
          ctx.beginPath();
          ctx.moveTo(-flaskR - 4, flaskR + 4);
          for (let lx = -flaskR - 4; lx <= flaskR + 4; lx += 5) {
            const swirlAmp = 2.6 + (lastEvapRate / 14) * 2.4;
            const ly = liqTopY + Math.sin(lx * 0.15 + flaskAngle * 2.1) * swirlAmp;
            ctx.lineTo(lx, ly);
          }
          ctx.lineTo(flaskR + 4, flaskR + 4);
          ctx.closePath();
          ctx.fill();

          // Swirling highlight streak across liquid surface
          ctx.strokeStyle = 'rgba(254, 243, 199, 0.72)';
          ctx.lineWidth = 1.6;
          ctx.beginPath();
          ctx.ellipse(Math.sin(flaskAngle) * 8, liqTopY + 3, 18, 3.2, 0, 0, Math.PI * 2);
          ctx.stroke();

          // Boiling bubbles inside flask liquid
          const boilIntensity = clamp((550 - pressure) / 380, 0.15, 1);
          boilSeeds.forEach(bs => {
            const cyc = (bs.phase + simElapsed * (0.6 + boilIntensity * 1.6)) % 1;
            const by = flaskR - 4 - cyc * Math.max(8, flaskR - liqTopY + 6);
            const bx = bs.xOff * 0.85 + Math.sin(flaskAngle + bs.phase * 9) * 5;
            if (by >= liqTopY - 6) {
              ctx.fillStyle = `rgba(254, 249, 195, ${(0.25 + boilIntensity * 0.55).toFixed(2)})`;
              ctx.beginPath();
              ctx.arc(bx, by, bs.r * (0.65 + boilIntensity * 0.45), 0, Math.PI * 2);
              ctx.fill();
            }
          });
          ctx.restore();

          // Flask outer glass contour + rotating graduation arcs
          ctx.strokeStyle = '#e2e8f0';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(0, 0, flaskR, 0, Math.PI * 2);
          ctx.stroke();

          // Rotating swirl marks on the glass body to make rotation unmistakable
          ctx.strokeStyle = 'rgba(224, 242, 254, 0.45)';
          ctx.lineWidth = 1.6;
          ctx.beginPath();
          ctx.arc(0, 0, flaskR - 7, flaskAngle, flaskAngle + 0.95);
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(0, 0, flaskR - 7, flaskAngle + Math.PI, flaskAngle + Math.PI + 0.75);
          ctx.stroke();
          ctx.restore();

          // Water bath stainless front shell (drawn OVER lower submerged flask for 3D immersion!)
          const shellGrad = ctx.createLinearGradient(bathX, bathY + 24, bathX, bathY + bathH);
          shellGrad.addColorStop(0, '#334155');
          shellGrad.addColorStop(1, '#1e293b');
          ctx.fillStyle = shellGrad;
          ctx.fillRect(bathX, bathY + 26, bathW, bathH - 26);
          ctx.strokeStyle = '#64748b';
          ctx.lineWidth = 1.6;
          ctx.strokeRect(bathX, bathY, bathW, bathH);

          // Bath heater readout screen
          ctx.fillStyle = '#090f1d';
          ctx.fillRect(bathX + 12, bathY + 38, 62, 20);
          ctx.strokeStyle = '#475569';
          ctx.strokeRect(bathX + 12, bathY + 38, 62, 20);
          ctx.fillStyle = '#fbbf24';
          ctx.font = 'bold 11px Consolas, monospace';
          ctx.fillText('40.0 °C', bathX + 18, bathY + 52);

          ctx.fillStyle = '#94a3b8';
          ctx.font = 'bold 9.5px Consolas, monospace';
          ctx.fillText('WATER BATH', bathX + 86, bathY + 52);

          // ---- 4. MOTORIZED ROTARY DRIVE HOUSING ----
          ctx.fillStyle = '#1e293b';
          ctx.fillRect(216, 102, 50, 48);
          ctx.fillStyle = '#14b8a6';
          ctx.fillRect(216, 102, 50, 7);
          ctx.strokeStyle = '#94a3b8';
          ctx.lineWidth = 1.5;
          ctx.strokeRect(216, 102, 50, 48);
          // Spinning rotor indicator dot
          const rotorCx = 241, rotorCy = 128;
          ctx.strokeStyle = '#5eead4';
          ctx.lineWidth = 1.6;
          ctx.beginPath();
          ctx.arc(rotorCx, rotorCy, 9, flaskAngle, flaskAngle + Math.PI * 1.35);
          ctx.stroke();
          ctx.fillStyle = '#cbd5e1';
          ctx.font = 'bold 8.5px Consolas, monospace';
          ctx.textAlign = 'center';
          ctx.fillText('120 RPM', rotorCx, 146);

          // ---- 5. SPIRAL DIAGONAL CONDENSER (-4 °C COIL) ----
          const condX0 = 266, condY0 = 122;
          const condAng = -0.56;
          const condLen = 148;
          ctx.save();
          ctx.translate(condX0, condY0);
          ctx.rotate(condAng);

          // Outer frosted glass condenser jacket
          ctx.fillStyle = 'rgba(125, 211, 252, 0.14)';
          ctx.fillRect(0, -18, condLen, 36);
          if (lastEvapRate > 2) {
            ctx.fillStyle = `rgba(186, 230, 253, ${clamp(lastEvapRate / 38, 0.06, 0.30).toFixed(2)})`;
            ctx.fillRect(6, -15, condLen - 12, 30);
          }

          // Spiral cooling coil loops inside jacket
          ctx.strokeStyle = '#38bdf8';
          ctx.lineWidth = 2.1;
          ctx.beginPath();
          for (let sx = 10; sx <= condLen - 12; sx += 2) {
            const sy = Math.sin((sx - 10) * 0.28) * 11;
            if (sx === 10) ctx.moveTo(sx, sy);
            else ctx.lineTo(sx, sy);
          }
          ctx.stroke();

          // Jacket contour & top vacuum port
          ctx.strokeStyle = '#93c5fd';
          ctx.lineWidth = 1.6;
          ctx.strokeRect(0, -18, condLen, 36);
          ctx.fillStyle = lastHolding ? '#22c55e' : '#64748b';
          ctx.fillRect(condLen, -5, 10, 10);
          ctx.restore();

          // Condenser spout + animated dripping solvent into receiving flask
          const spoutX = 360, spoutY = 84;
          ctx.strokeStyle = '#93c5fd';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(spoutX, spoutY);
          ctx.lineTo(spoutX, spoutY + 32);
          ctx.stroke();

          // Dripping droplets falling when evaporating
          if (lastEvapRate > 0.6) {
            const dropCount = lastEvapRate > 9 ? 3 : (lastEvapRate > 4 ? 2 : 1);
            for (let d = 0; d < dropCount; d++) {
              const frac = (dripOffset + d / dropCount) % 1;
              const dy = spoutY + 34 + frac * 84;
              ctx.fillStyle = '#7dd3fc';
              ctx.beginPath();
              ctx.arc(spoutX, dy, 2.7, 0, Math.PI * 2);
              ctx.fill();
            }
          }

          // ---- 6. RECEIVING FLASK (FILLS WITH CONDENSED SOLVENT) ----
          const recCx = 360, recCy = 238, recR = 34;
          ctx.save();
          ctx.beginPath();
          ctx.arc(recCx, recCy, recR - 2, 0, Math.PI * 2);
          ctx.clip();
          const distFill = clamp(0.06 + (evapPct / 100) * 0.78, 0.06, 0.84);
          const distTopY = recCy + recR - distFill * (recR * 1.9);
          const distGrad = ctx.createLinearGradient(0, distTopY, 0, recCy + recR);
          distGrad.addColorStop(0, 'rgba(125, 211, 252, 0.75)');
          distGrad.addColorStop(1, 'rgba(14, 165, 233, 0.88)');
          ctx.fillStyle = distGrad;
          ctx.fillRect(recCx - recR, distTopY, recR * 2, recR * 2);
          ctx.strokeStyle = 'rgba(224, 242, 254, 0.85)';
          ctx.lineWidth = 1.4;
          ctx.beginPath();
          ctx.moveTo(recCx - recR, distTopY);
          ctx.lineTo(recCx + recR, distTopY);
          ctx.stroke();
          ctx.restore();

          // Receiving flask neck + glass outline + cradle ring
          ctx.strokeStyle = '#cbd5e1';
          ctx.lineWidth = 1.8;
          ctx.strokeRect(recCx - 7, recCy - recR - 14, 14, 16);
          ctx.beginPath();
          ctx.arc(recCx, recCy, recR, 0, Math.PI * 2);
          ctx.stroke();
          ctx.fillStyle = '#334155';
          ctx.fillRect(recCx - 24, 272, 48, 10);
          ctx.fillStyle = '#94a3b8';
          ctx.font = 'bold 9.5px Consolas, monospace';
          ctx.textAlign = 'center';
          ctx.fillText('RECEIVING FLASK', recCx, 297);

          // Bump-trap callout & live warning banner
          ctx.fillStyle = foam > 0.65 ? '#fde047' : '#cbd5e1';
          ctx.font = 'bold 10px Consolas, monospace';
          ctx.textAlign = 'center';
          ctx.fillText('BUMP TRAP', 152, 114);
          ctx.strokeStyle = 'rgba(148, 163, 184, 0.55)';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(156, 118);
          ctx.lineTo(176, 142);
          ctx.stroke();

          if (bumpFlash > 0.05) {
            ctx.fillStyle = 'rgba(185, 28, 28, 0.90)';
            ctx.fillRect(14, 34, 418, 26);
            ctx.strokeStyle = '#fca5a5';
            ctx.lineWidth = 1.5;
            ctx.strokeRect(14, 34, 418, 26);
            drawVectorWarning(ctx, 30, 47, 5, '#fde047', '#7f1d1d');
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 11px Consolas, monospace';
            ctx.textAlign = 'left';
            ctx.fillText('BUMP! -22% YIELD PENALTY (VACUUM RESET 700 mbar)', 42, 51);
          } else if (foam > 0.62) {
            ctx.fillStyle = 'rgba(146, 64, 14, 0.88)';
            ctx.fillRect(14, 34, 304, 24);
            ctx.strokeStyle = '#fbbf24';
            ctx.lineWidth = 1.4;
            ctx.strokeRect(14, 34, 304, 24);
            drawVectorWarning(ctx, 29, 46, 4.5, '#fde047', '#451a03');
            ctx.fillStyle = '#fef3c7';
            ctx.font = 'bold 10.5px Consolas, monospace';
            ctx.textAlign = 'left';
            ctx.fillText('FOAM RISING INTO TRAP — RELEASE TO VENT!', 40, 50);
          }

          // ---- 7. RIGHT INSTRUMENT PANEL: LIVE mbar DIAL + EVAPORATION GAUGE ----
          const px = 454, py = 12, pw = 214, ph = H - 24;
          ctx.fillStyle = '#0d1729';
          ctx.fillRect(px, py, pw, ph);
          ctx.strokeStyle = '#334155';
          ctx.lineWidth = 1.5;
          ctx.strokeRect(px, py, pw, ph);

          const dialCx = px + pw / 2;
          const dialCy = 107;
          const dialR = 56;
          const startAng = Math.PI * 0.80;
          const endAng = Math.PI * 2.20;
          const arcSpan = endAng - startAng;
          const logMax = Math.log(850 / 120);
          const mbarToAng = p => startAng + (Math.log(850 / clamp(p, 120, 850)) / logMax) * arcSpan;

          // Dial title
          ctx.textAlign = 'center';
          ctx.fillStyle = '#94a3b8';
          ctx.font = 'bold 10px Consolas, monospace';
          ctx.fillText('VACUUM CONTROLLER', dialCx, 27);

          // Dial background track
          ctx.lineWidth = 10;
          ctx.lineCap = 'butt';
          ctx.strokeStyle = '#1e293b';
          ctx.beginPath();
          ctx.arc(dialCx, dialCy, dialR, startAng, endAng);
          ctx.stroke();

          // Highlighted sweet zone arc (420..220 mbar)
          ctx.strokeStyle = '#22c55e';
          ctx.beginPath();
          ctx.arc(dialCx, dialCy, dialR, mbarToAng(420), mbarToAng(220));
          ctx.stroke();

          // Transition caution arc (220..200 mbar)
          ctx.strokeStyle = '#f59e0b';
          ctx.beginPath();
          ctx.arc(dialCx, dialCy, dialR, mbarToAng(220), mbarToAng(200));
          ctx.stroke();

          // Crimson bump-surge danger arc (200..120 mbar)
          ctx.strokeStyle = '#ef4444';
          ctx.beginPath();
          ctx.arc(dialCx, dialCy, dialR, mbarToAng(200), mbarToAng(120));
          ctx.stroke();

          // Dial tick labels (850, 600, 420, 220, 120)
          ctx.font = 'bold 8.5px Consolas, monospace';
          ctx.fillStyle = '#94a3b8';
          [850, 600, 420, 220, 120].forEach(val => {
            const a = mbarToAng(val);
            const tx0 = dialCx + Math.cos(a) * (dialR - 7);
            const ty0 = dialCy + Math.sin(a) * (dialR - 7);
            const tx1 = dialCx + Math.cos(a) * (dialR + 5);
            const ty1 = dialCy + Math.sin(a) * (dialR + 5);
            ctx.strokeStyle = val === 420 || val === 220 ? '#86efac' : (val === 120 ? '#fca5a5' : '#64748b');
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(tx0, ty0);
            ctx.lineTo(tx1, ty1);
            ctx.stroke();

            const lx = dialCx + Math.cos(a) * (dialR + 15);
            const ly = dialCy + Math.sin(a) * (dialR + 15) + 3;
            ctx.fillStyle = val === 420 || val === 220 ? '#86efac' : (val === 120 ? '#fca5a5' : '#94a3b8');
            ctx.fillText(String(val), lx, ly);
          });

          // Live dial needle
          const needleAng = mbarToAng(pressure);
          ctx.strokeStyle = '#f8fafc';
          ctx.lineWidth = 2.4;
          ctx.beginPath();
          ctx.moveTo(dialCx, dialCy);
          ctx.lineTo(dialCx + Math.cos(needleAng) * (dialR - 10), dialCy + Math.sin(needleAng) * (dialR - 10));
          ctx.stroke();
          ctx.fillStyle = '#38bdf8';
          ctx.beginPath();
          ctx.arc(dialCx, dialCy, 4.5, 0, Math.PI * 2);
          ctx.fill();

          // Digital mbar readout below hub
          const inSweetNow = pressure >= 220 && pressure <= 420;
          ctx.fillStyle = pressure < 200 ? '#f87171' : (inSweetNow ? '#4ade80' : '#38bdf8');
          ctx.font = 'bold 18px Consolas, monospace';
          ctx.fillText(`${Math.round(pressure)} mbar`, dialCx, dialCy + 32);

          // Zone status badge
          const pillX = px + 12, pillY = 156, pillW = pw - 24, pillH = 22;
          const pillBg = pressure < 200 ? '#7f1d1d' : (inSweetNow ? '#14532d' : (pressure < 220 ? '#78350f' : '#1e293b'));
          const pillBorder = pressure < 200 ? '#f87171' : (inSweetNow ? '#4ade80' : (pressure < 220 ? '#fbbf24' : '#475569'));
          ctx.fillStyle = pillBg;
          ctx.fillRect(pillX, pillY, pillW, pillH);
          ctx.strokeStyle = pillBorder;
          ctx.lineWidth = 1.2;
          ctx.strokeRect(pillX, pillY, pillW, pillH);

          ctx.fillStyle = '#f8fafc';
          ctx.font = 'bold 10px Consolas, monospace';
          if (pressure < 200) {
            drawVectorWarning(ctx, pillX + 14, pillY + 11, 4, '#fde047', '#7f1d1d');
            ctx.fillText('BUMP SURGE — RELEASE!', dialCx + 6, pillY + 15);
          } else if (inSweetNow) {
            drawVectorCheck(ctx, pillX + 14, pillY + 11, 4.2, '#86efac');
            ctx.fillText('SWEET ZONE (+EVAP)', dialCx + 6, pillY + 15);
          } else if (pressure < 220) {
            ctx.fillText('CAUTION — HIGH VACUUM', dialCx, pillY + 15);
          } else {
            ctx.fillText('HOLD TO PULL VACUUM', dialCx, pillY + 15);
          }

          // Evaporation % progress bar
          const barX = px + 14, barW = pw - 28;
          ctx.textAlign = 'left';
          ctx.fillStyle = '#cbd5e1';
          ctx.font = 'bold 10px Consolas, monospace';
          ctx.fillText('EVAPORATION', barX, 196);
          ctx.textAlign = 'right';
          ctx.fillStyle = '#4ade80';
          ctx.fillText(`${Math.round(evapPct)}%`, barX + barW, 196);

          ctx.fillStyle = '#1e293b';
          ctx.fillRect(barX, 202, barW, 14);
          const evGrad = ctx.createLinearGradient(barX, 0, barX + barW, 0);
          evGrad.addColorStop(0, '#0ea5e9');
          evGrad.addColorStop(1, '#22c55e');
          ctx.fillStyle = evGrad;
          ctx.fillRect(barX, 202, Math.round((evapPct / 100) * barW), 14);
          ctx.strokeStyle = '#475569';
          ctx.lineWidth = 1;
          ctx.strokeRect(barX, 202, barW, 14);

          // Foam level progress bar
          ctx.textAlign = 'left';
          ctx.fillStyle = '#cbd5e1';
          ctx.fillText('TRAP FOAM', barX, 236);
          ctx.textAlign = 'right';
          ctx.fillStyle = foam > 0.65 ? '#f87171' : '#fde68a';
          ctx.fillText(`${Math.round(clamp(foam, 0, 1) * 100)}%`, barX + barW, 236);

          ctx.fillStyle = '#1e293b';
          ctx.fillRect(barX, 242, barW, 11);
          ctx.fillStyle = foam > 0.65 ? '#ef4444' : (foam > 0.35 ? '#f59e0b' : '#38bdf8');
          ctx.fillRect(barX, 242, Math.round(clamp(foam, 0, 1) * barW), 11);
          ctx.strokeStyle = '#475569';
          ctx.strokeRect(barX, 242, barW, 11);

          // Bottom telemetry line: Bumps & Valve state
          ctx.textAlign = 'left';
          ctx.font = 'bold 10.5px Consolas, monospace';
          ctx.fillStyle = bumps === 0 ? '#86efac' : '#fca5a5';
          ctx.fillText(bumps === 0 ? 'BUMPS: 0' : `BUMPS: ${bumps} (-${bumps * 22}%)`, barX, 276);
          ctx.textAlign = 'right';
          ctx.fillStyle = lastHolding ? '#38bdf8' : '#94a3b8';
          ctx.fillText(lastHolding ? 'VALVE: PULL' : 'VALVE: VENT', barX + barW, 276);
          ctx.textAlign = 'left';
        },
        finish() {
          const score = computeFinalScore();
          const evapInt = Math.round(evapPct);
          if (evapInt >= 100 && bumps === 0) {
            return {
              score,
              summary: `${buchiTitle}: concentrated 100% of ${solventName} cleanly in ${finishElapsed.toFixed(1)}s with zero bump-trap losses!`
            };
          }
          if (evapInt >= 100) {
            return {
              score,
              summary: `${buchiTitle}: reached 100% evaporation in ${finishElapsed.toFixed(1)}s with ${bumps} bump-trap splash${bumps === 1 ? '' : 'es'} (-${bumps * 22}% yield penalty).`
            };
          }
          return {
            score,
            summary: `${buchiTitle}: evaporated ${evapInt}% of ${solventName} (${bumps} bump${bumps === 1 ? '' : 's'}) — hold closer to the 220–420 mbar sweet zone.`
          };
        }
      };
    }

    // -------------------- 6. 17:18 CORRIDOR EVASION (ALEX KING) --------------------
    const playerSpriteId = String(config?.playerId || 'daniel_richards').trim() || 'daniel_richards';
    const alexSpriteImg = getMgSprite('alex_king');
    const playerSpriteImg = getMgSprite(playerSpriteId);

    const player = { x: 64, y: 165, r: 12, dirRow: 2, moving: false, walkTime: 0 };
    const alex = { x: 355, y: 155, angle: Math.PI, sweepDir: 1, coneLen: 175, coneHalf: 0.44, dirRow: 1, walkTime: 0, quote: '"Heading to Gordon\'s Café?"' };
    const stairs3F = { x: 255, y: 10, w: 150, h: 42 };
    const cibExit = { x: W - 122, y: H - 86, w: 104, h: 68 };
    const pillars = [
      { x: 175, y: 88, w: 46, h: 52 },
      { x: 195, y: 198, w: 54, h: 48 },
      { x: 455, y: 84, w: 48, h: 56 }
    ];
    let exposure = 0;
    let finishElapsed = totalSec;
    let outcome = null; // 'escaped' | 'caught' | 'led_3f'

    function rectContainsCircle(rx, ry, rw, rh, cx, cy, cr) {
      const nx = clamp(cx, rx, rx + rw);
      const ny = clamp(cy, ry, ry + rh);
      return Math.hypot(cx - nx, cy - ny) < cr;
    }

    // 4x4 sprite sheet row convention: 0=S (down), 1=W (left), 2=E (right), 3=N (up)
    function dirRowFromVec(dx, dy, fallbackRow) {
      if (Math.hypot(dx, dy) < 0.05) return fallbackRow;
      if (Math.abs(dx) > Math.abs(dy)) return dx < 0 ? 1 : 2;
      return dy < 0 ? 3 : 0;
    }

    function drawStealthActorSprite(ctx, img, x, y, dirRow, col, ringColor, fallbackFn) {
      // Ground shadow + crisp tactical ring
      ctx.save();
      ctx.fillStyle = 'rgba(2, 6, 23, 0.58)';
      ctx.beginPath();
      ctx.ellipse(x, y + 11, 13, 5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = ringColor;
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.ellipse(x, y + 11, 13, 5, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      if (img && img.complete && img.naturalWidth > 0) {
        const fw = img.naturalWidth >= 256 ? 64 : Math.max(1, Math.floor(img.naturalWidth / 4));
        const fh = img.naturalHeight >= 384 ? 96 : Math.max(1, Math.floor(img.naturalHeight / 4));
        const drawW = 32;
        const drawH = 48;
        const drawX = Math.round(x - drawW / 2);
        const drawY = Math.round(y - drawH + 14);
        ctx.save();
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(img, (col & 3) * fw, (dirRow & 3) * fh, fw, fh, drawX, drawY, drawW, drawH);
        ctx.restore();
      } else {
        fallbackFn();
      }
    }

    return {
      update(dt, elapsed, input) {
        let vx = 0, vy = 0;
        if (input.keys.has('KeyW') || input.keys.has('ArrowUp')) vy -= 1;
        if (input.keys.has('KeyS') || input.keys.has('ArrowDown')) vy += 1;
        if (input.keys.has('KeyA') || input.keys.has('ArrowLeft')) vx -= 1;
        if (input.keys.has('KeyD') || input.keys.has('ArrowRight')) vx += 1;

        if (vx === 0 && vy === 0 && input.mouseDown) {
          const dx = input.mouseX - player.x;
          const dy = input.mouseY - player.y;
          const d = Math.hypot(dx, dy);
          if (d > 6) { vx = dx / d; vy = dy / d; }
        } else if (vx !== 0 || vy !== 0) {
          const d = Math.hypot(vx, vy);
          vx /= d; vy /= d;
        }

        const prevPx = player.x;
        const prevPy = player.y;
        const speed = 185;
        const nx = clamp(player.x + vx * speed * dt, 24, W - 24);
        const ny = clamp(player.y + vy * speed * dt, 24, H - 24);
        if (!pillars.some(p => rectContainsCircle(p.x, p.y, p.w, p.h, nx, player.y, player.r))) player.x = nx;
        if (!pillars.some(p => rectContainsCircle(p.x, p.y, p.w, p.h, player.x, ny, player.r))) player.y = ny;

        const moveDx = player.x - prevPx;
        const moveDy = player.y - prevPy;
        if (Math.hypot(moveDx, moveDy) > 0.12) {
          player.moving = true;
          player.walkTime += dt;
          player.dirRow = dirRowFromVec(moveDx, moveDy, player.dirRow);
        } else {
          player.moving = false;
        }

        // Alex King patrols corridor & sweeps green-eyed vision cone
        const prevAx = alex.x;
        const prevAy = alex.y;
        alex.x = 345 + Math.sin(elapsed * 1.35) * 68;
        alex.y = 152 + Math.cos(elapsed * 1.9) * 44;
        alex.angle = Math.PI + Math.sin(elapsed * 2.35) * 1.25;
        alex.dirRow = dirRowFromVec(alex.x - prevAx, alex.y - prevAy, alex.dirRow);
        alex.walkTime += dt;

        // Check forbidden 3F stairs!
        if (rectContainsCircle(stairs3F.x, stairs3F.y, stairs3F.w, stairs3F.h, player.x, player.y, player.r)) {
          outcome = 'led_3f';
          finishElapsed = elapsed;
          return { liveScore: 15, done: true };
        }

        // Check CIB Walk-to-NMR Decoy Exit!
        if (rectContainsCircle(cibExit.x, cibExit.y, cibExit.w, cibExit.h, player.x, player.y, player.r)) {
          outcome = 'escaped';
          finishElapsed = elapsed;
          const fastBonus = Math.round(clamp((totalSec - elapsed) * 1.5, 0, 12));
          return { liveScore: clamp(90 + fastBonus - exposure * 25, 75, 100), done: true };
        }

        // Vision cone check (8 ray sample points along line-of-sight for pillar occlusion)
        const dx = player.x - alex.x;
        const dy = player.y - alex.y;
        const dist = Math.hypot(dx, dy);
        let angDiff = Math.atan2(dy, dx) - alex.angle;
        while (angDiff > Math.PI) angDiff -= Math.PI * 2;
        while (angDiff < -Math.PI) angDiff += Math.PI * 2;

        let inCone = dist < alex.coneLen && Math.abs(angDiff) < alex.coneHalf;
        if (inCone) {
          const raySamples = 8;
          for (let i = 1; i <= raySamples; i++) {
            const s = i / (raySamples + 1);
            const sx = alex.x + dx * s;
            const sy = alex.y + dy * s;
            if (pillars.some(p => sx >= p.x && sx <= p.x + p.w && sy >= p.y && sy <= p.y + p.h)) {
              inCone = false;
              break;
            }
          }
        }

        if (dist < 24 || inCone) {
          exposure += dt * (dist < 24 ? 3.0 : 2.1);
          if (exposure >= 0.48) {
            outcome = 'caught';
            finishElapsed = elapsed;
            return { liveScore: 26, done: true };
          }
        } else {
          exposure = Math.max(0, exposure - dt * 1.2);
        }

        const progress = clamp((player.x - 60) / (cibExit.x - 60), 0, 1);
        return { liveScore: Math.round(55 + progress * 35 - exposure * 30), done: false };
      },
      render(ctx) {
        ctx.fillStyle = '#0b1220';
        ctx.fillRect(0, 0, W, H);

        ctx.strokeStyle = 'rgba(148, 163, 184, 0.08)';
        for (let x = 0; x < W; x += 34) {
          ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
        }
        for (let y = 0; y < H; y += 34) {
          ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
        }

        ctx.fillStyle = 'rgba(239, 68, 68, 0.22)';
        ctx.fillRect(stairs3F.x, stairs3F.y, stairs3F.w, stairs3F.h);
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 2;
        ctx.strokeRect(stairs3F.x, stairs3F.y, stairs3F.w, stairs3F.h);
        drawVectorProhibited(ctx, stairs3F.x + 17, stairs3F.y + 15, 5.2, '#fca5a5');
        ctx.fillStyle = '#fca5a5';
        ctx.font = 'bold 10.5px Consolas, monospace';
        ctx.textAlign = 'center';
        ctx.fillText('3F SPIRAL STAIRS', stairs3F.x + stairs3F.w / 2 + 7, stairs3F.y + 18);
        ctx.fillText('(NEVER LEAD HER UP!)', stairs3F.x + stairs3F.w / 2, stairs3F.y + 33);

        ctx.fillStyle = 'rgba(34, 197, 94, 0.24)';
        ctx.fillRect(cibExit.x, cibExit.y, cibExit.w, cibExit.h);
        ctx.strokeStyle = '#4ade80';
        ctx.strokeRect(cibExit.x, cibExit.y, cibExit.w, cibExit.h);
        drawVectorCheck(ctx, cibExit.x + 16, cibExit.y + 24, 5, '#86efac');
        ctx.fillStyle = '#86efac';
        ctx.fillText('CIB DECOY', cibExit.x + cibExit.w / 2 + 7, cibExit.y + 28);
        ctx.fillText('"Walk to NMR"', cibExit.x + cibExit.w / 2, cibExit.y + 45);

        pillars.forEach(p => {
          ctx.fillStyle = '#1e293b';
          ctx.fillRect(p.x, p.y, p.w, p.h);
          ctx.strokeStyle = '#475569';
          ctx.strokeRect(p.x, p.y, p.w, p.h);
        });

        ctx.save();
        const coneGrad = ctx.createRadialGradient(alex.x, alex.y, 8, alex.x, alex.y, alex.coneLen);
        coneGrad.addColorStop(0, exposure > 0.05 ? 'rgba(239, 68, 68, 0.52)' : 'rgba(34, 197, 94, 0.45)');
        coneGrad.addColorStop(1, 'rgba(34, 197, 94, 0.02)');
        ctx.fillStyle = coneGrad;
        ctx.beginPath();
        ctx.moveTo(alex.x, alex.y);
        ctx.arc(alex.x, alex.y, alex.coneLen, alex.angle - alex.coneHalf, alex.angle + alex.coneHalf);
        ctx.closePath();
        ctx.fill();
        ctx.restore();

        const alexCol = Math.floor(alex.walkTime * 6.5) % 4;
        const playerCol = player.moving ? (Math.floor(player.walkTime * 7.5) % 4) : 0;

        const drawAlex = () => {
          drawStealthActorSprite(
            ctx,
            alexSpriteImg,
            alex.x,
            alex.y,
            alex.dirRow,
            alexCol,
            exposure > 0.05 ? '#f87171' : '#4ade80',
            () => {
              ctx.fillStyle = '#451a03';
              ctx.beginPath();
              ctx.arc(alex.x, alex.y, 14, 0, Math.PI * 2);
              ctx.fill();
              ctx.fillStyle = '#fde68a';
              ctx.beginPath();
              ctx.arc(alex.x, alex.y + 1, 9, 0, Math.PI * 2);
              ctx.fill();
              ctx.fillStyle = '#22c55e';
              ctx.fillRect(alex.x - 5, alex.y - 1, 3, 3);
              ctx.fillRect(alex.x + 2, alex.y - 1, 3, 3);
            }
          );
          const tagY = Math.max(18, alex.y - 38);
          ctx.font = 'bold 10px Segoe UI, sans-serif';
          const pillW = Math.ceil(ctx.measureText(alex.quote).width) + 18;
          const pillX = clamp(alex.x - pillW / 2, 4, W - pillW - 4);
          ctx.fillStyle = 'rgba(9, 14, 26, 0.78)';
          ctx.fillRect(pillX, tagY - 11, pillW, 15);
          ctx.fillStyle = '#bbf7d0';
          ctx.textAlign = 'center';
          ctx.fillText(alex.quote, pillX + pillW / 2, tagY);
        };

        const drawPlayer = () => {
          drawStealthActorSprite(
            ctx,
            playerSpriteImg,
            player.x,
            player.y,
            player.dirRow,
            playerCol,
            '#60a5fa',
            () => {
              ctx.fillStyle = '#3b82f6';
              ctx.beginPath();
              ctx.arc(player.x, player.y, player.r, 0, Math.PI * 2);
              ctx.fill();
              ctx.strokeStyle = '#ffffff';
              ctx.lineWidth = 2;
              ctx.stroke();
            }
          );
          const badgeY = Math.min(H - 6, player.y + 23);
          ctx.fillStyle = 'rgba(30, 58, 138, 0.88)';
          ctx.fillRect(player.x - 16, badgeY - 10, 32, 13);
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 9px Consolas, monospace';
          ctx.textAlign = 'center';
          ctx.fillText('YOU', player.x, badgeY);
        };

        // Depth-sort sprites cleanly by vertical anchor
        if (alex.y <= player.y) {
          drawAlex();
          drawPlayer();
        } else {
          drawPlayer();
          drawAlex();
        }
        ctx.textAlign = 'left';
      },
      finish() {
        if (outcome === 'escaped') {
          const fastBonus = Math.round(clamp((totalSec - finishElapsed) * 1.5, 0, 12));
          const score = clamp(Math.round(90 + fastBonus - exposure * 25), 75, 100);
          return { score, summary: 'Cleanly executed the CIB "Walk-to-NMR" corridor decoy without revealing the 3rd-Floor Office!' };
        }
        if (outcome === 'led_3f') {
          return { score: 15, summary: 'Disaster! You ran toward the 3rd-Floor Spiral Stairs with Alex King right behind you!' };
        }
        if (outcome === 'caught') {
          return { score: 26, summary: 'Caught inside Alex King’s 17:18 green-eyed vision cone ("So is everyone at Gordon\'s Café right now?!").' };
        }
        return { score: 54, summary: 'Hid behind the KLB lockers until 17:25, narrowly keeping 3F secret.' };
      }
    };
  }

    window.KLB.Minigames = {
      openModal,
      abortActive
    };
  })();

  // =========================================================================
  // C. 4-SLIDE DECK BUILDER & VIJAY SOLO AUDITOR (window.KLB.SlideBuilder)
  // =========================================================================
  const PLAYABLE_CHUD_IDS = new Set([
    'daniel_richards',
    'maximillian_lee',
    'antoine_maruani',
    'andre_shamsabadi',
    'peter_szijj',
    'joao_nogueira',
    'faiza_javaid',
    'calise_bahou',
    'richard_spears',
    'marcos_fernandez'
  ]);

  function hasSpectrumFlaw(fig) {
    if (!fig) return false;
    const rawQ = (fig.quality === undefined || fig.quality === null || fig.quality === '') ? 0 : Number(fig.quality);
    const q = Number.isFinite(rawQ) ? rawQ : 0;
    return Boolean(
      fig.hasSolventPeak ||
      fig.hasAdduct ||
      fig.hasOverReduction ||
      fig.hasBlueDyeMishap ||
      q < 78
    );
  }

  function describeGelFlaw(fig) {
    const meta = `${fig?.label || ''} ${fig?.productPeak || ''} ${fig?.notes || ''} ${fig?.metricLabel || ''}`;
    if (/aunp|529\s*nm|colloidal\s*mobility|ruby-?red/i.test(meta)) {
      return 'purple AuNP well-aggregation smear';
    }
    if (/tricine|vnar|depletion/i.test(meta)) {
      return 'unconjugated 12 kDa VNAR supernatant band';
    }
    if (/hsa|albumin|66\.5\s*kda/i.test(meta) && /dual-?fluor|fluorescence\s*sds|gsh|turn-on/i.test(meta)) {
      return '66.5 kDa HSA fluorophore transfer smear';
    }
    if (/hsa|albumin|66\.5\s*kda/i.test(meta)) {
      return '133 kDa HSA disulfide dimer band';
    }
    if (!/147(?:\.\d+)?\s*kda|\bsynab\b/i.test(meta) && /sequential\s*fab|fabher2\s*digest|fab\/fc\s*panel|\bfab\b|48(?:\.\d+)?\s*kda/i.test(meta)) {
      return '25 kDa over-reduced Fab fragment band';
    }
    if (/147(?:\.\d+)?\s*kda|\bsynab\b/i.test(meta)) {
      return 'unclicked 48 kDa Fab / incomplete SynAb bands';
    }
    if (/native\s+her2|antigen-?shift/i.test(meta)) {
      return 'unshifted 150 kDa unbound mAb band';
    }
    if (/fcrn\s*complex/i.test(meta)) {
      return 'incomplete pH 6.0 FcRn complex band';
    }
    if (/reducing\s+sds-?page/i.test(meta) && !/non-?reducing/i.test(meta)) {
      return 'over-cleaved heavy-chain fragment bands';
    }
    return '75 kDa HL half-antibody over-reduction bands';
  }

  function describeFigureFlaw(fig) {
    if (!fig) return '';
    const q = Number(fig.quality);
    const lowQ = Number.isFinite(q) && q < 78;
    const t = String(fig.type || '').toLowerCase();
    if (fig.hasSolventPeak || (t === 'nmr' && lowQ)) return '5.30 ppm residual DCM / EtOAc peaks';
    if (fig.hasBlueDyeMishap) return 'blue LDS loading-dye spillover smear';
    if (fig.hasOverReduction || (t === 'gel' && lowQ)) return describeGelFlaw(fig);
    if (fig.hasAdduct || (t === 'lcms' && lowQ)) return '+69 Da adduct & +44 Da PEG comb';
    if (lowQ) return 'unreacted starting material / baseline streaking';
    return '';
  }

  function openDeckModal(mountEl, gameState, onSaveDeck) {
    if (!mountEl || !gameState) return;

    const labBook = (Array.isArray(gameState.labBook) ? gameState.labBook : []).filter(Boolean);
    const cur = gameState.slideDeck || {};

    // Pick smart distinct defaults from labBook if not yet chosen
    let fig1Id = labBook.some(f => f && f.id === cur.fig1Id) ? cur.fig1Id : (labBook[0]?.id || null);
    let fig2Id = labBook.some(f => f && f.id === cur.fig2Id && f.id !== fig1Id)
      ? cur.fig2Id
      : (labBook.find(f => f && f.id !== fig1Id)?.id || labBook[0]?.id || null);

    const draft = {
      framing: cur.framing || 'mechanistic',
      fig1Id,
      fig2Id,
      honestDisclosure: cur.honestDisclosure !== undefined ? Boolean(cur.honestDisclosure) : true
    };

    const modalPlayerId = gameState.player?.id || gameState.charId || 'daniel_richards';
    const playerMeta = window.KLB.CAST_BY_ID?.[modalPlayerId] || {
      name: modalPlayerId === 'archie_wall' ? 'Archie Wall' : 'Researcher',
      shortName: modalPlayerId === 'archie_wall' ? 'Archie' : 'Chud'
    };
    const isArchieModal = modalPlayerId === 'archie_wall' || playerMeta?.supervisorId === 'jamie_baker';
    const activeCamp = window.KLB.getCampaign(modalPlayerId, gameState);
    const activeCascadeNum = (activeCamp?.cascadeIndex ?? 0) + 1;
    const campTitle = activeCamp?.title
      ? `Cascade ${activeCascadeNum}: ${activeCamp.title}`
      : (isArchieModal ? 'Baker Group Weekly Update' : 'Chudasama Group Weekly Update');
    const isRichard = modalPlayerId === 'richard_spears';
    const missingClicker = modalPlayerId === 'andre_shamsabadi' && !gameState.prep?.has_clicker;
    const weeklyReportPct = clamp(Math.round(Number(gameState.weeklyReportProgress) || 0), 0, 100);
    const manuscriptPct = clamp(Math.round(Number(gameState.manuscriptProgress) || 0), 0, 100);
    const labCond = Number(gameState.labCondition != null ? gameState.labCondition : (gameState.safety ?? 85));
    const labCondPct = Number.isFinite(labCond) ? clamp(Math.round(labCond), 0, 100) : 85;

    function renderModalUI() {
      const doc = mountEl.ownerDocument || (typeof document !== 'undefined' ? document : null);
      const activeEl = doc ? doc.activeElement : null;
      let focusTarget = null;
      if (activeEl && typeof mountEl.contains === 'function' && mountEl.contains(activeEl)) {
        if (activeEl.id) {
          focusTarget = { type: 'id', id: activeEl.id };
        } else if (activeEl.name && activeEl.value !== undefined) {
          focusTarget = { type: 'nameVal', name: activeEl.name, value: activeEl.value };
        }
      }

      const fig1 = labBook.find(f => f && f.id === draft.fig1Id) || null;
      const fig2 = labBook.find(f => f && f.id === draft.fig2Id) || null;
      const distinctPair = Boolean(fig1 && fig2 && fig1.id !== fig2.id);
      const anyFlaw = hasSpectrumFlaw(fig1) || hasSpectrumFlaw(fig2);

      const makeOptions = selectedId => {
        if (!labBook.length) return `<option value="">-- No Saved Lab Book Figures Yet --</option>`;
        return labBook.map(f => {
          const flawTxt = hasSpectrumFlaw(f) ? ' [Flaw]' : ' [Clean]';
          const metricsTxt = formatFigureMetrics(f);
          return `<option value="${escHtml(f.id)}" ${f.id === selectedId ? 'selected' : ''}>[${escHtml(String(f.type || 'data').toUpperCase())} • ${metricsTxt}${flawTxt}] ${escHtml(f.label)}</option>`;
        }).join('');
      };

      const t1 = String(fig1?.type || '').toLowerCase();
      const t2 = String(fig2?.type || '').toLowerCase();
      const hasNmr = t1 === 'nmr' || t2 === 'nmr';
      const hasMsOrGel = t1 === 'lcms' || t2 === 'lcms' || t1 === 'gel' || t2 === 'gel';
      let pairBadgeCls = 'warn';
      let pairBadgeText = 'Orthogonal Pair: Pending';
      if (distinctPair) {
        if (hasNmr && hasMsOrGel) {
          pairBadgeCls = 'good';
          pairBadgeText = `Orthogonal Pair: ${t1.toUpperCase()} + ${t2.toUpperCase()}`;
        } else if (t1 !== t2) {
          pairBadgeCls = 'good';
          pairBadgeText = `Cross-Method: ${t1.toUpperCase()} + ${t2.toUpperCase()}`;
        } else {
          pairBadgeCls = 'warn';
          pairBadgeText = `Same Method: ${t1.toUpperCase()} × 2`;
        }
      }

      const slideFigs = [fig1, fig2].filter((f, idx, arr) => f && arr.findIndex(x => x && x.id === f.id) === idx);
      const slideAvgQ = slideFigs.length
        ? Math.round(slideFigs.reduce((s, f) => s + getQuality(f, 0), 0) / slideFigs.length)
        : 0;
      const qualBadgeCls = slideFigs.length === 0 ? 'warn' : slideAvgQ >= 80 ? 'good' : slideAvgQ >= 70 ? 'warn' : 'poor';
      const flawBadgeCls = !anyFlaw ? 'good' : draft.honestDisclosure ? 'warn' : 'poor';
      const flawBadgeText = !slideFigs.length
        ? 'Flaw Status: No Data'
        : !anyFlaw
          ? 'Flaw Status: Clean'
          : draft.honestDisclosure
            ? 'Flaw Status: Disclosed (Safe)'
            : 'Flaw Status: Hidden Risk!';

      const renderSlideCard = (slideTitle, iconName, selectId, cvId, fig, emptyMsg, extraTagHtml = '') => {
        const flawed = hasSpectrumFlaw(fig);
        const qNum = fig ? Math.round(getQuality(fig, 0)) : 0;
        const figBadgeCls = !fig ? 'warn' : flawed ? 'poor' : qNum >= 80 ? 'good' : 'warn';
        return `
          <section class="slide-card">
            <div style="display:flex;justify-content:space-between;align-items:center;gap:6px;">
              <h4>${iconSvg(iconName, 13)}<span>${slideTitle}</span></h4>
              ${extraTagHtml}
            </div>
            <select id="${selectId}" class="ui-select compact">
              ${makeOptions(fig ? fig.id : '')}
            </select>
            <div style="background:#070a12;border:1px solid #1e293b;border-radius:7px;padding:4px;display:flex;flex-direction:column;justify-content:center;align-items:center;gap:4px;min-height:142px;">
              ${fig
                ? `<canvas id="${cvId}" width="340" height="145" style="width:100%;height:auto;border-radius:5px;"></canvas>
                   <div style="width:100%;display:flex;justify-content:space-between;align-items:center;gap:6px;padding:2px 4px;">
                     <span class="mono-muted" style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${escHtml(fig.productPeak || fig.label)}</span>
                     <span class="yield-quality-badge ${figBadgeCls}">${escHtml(formatFigureMetrics(fig))}${flawed ? ' • Flaw' : ' • Clean'}</span>
                   </div>`
                : `<span class="mono-muted">${emptyMsg}</span>`}
            </div>
          </section>
        `;
      };

      const radioOpt = (name, val, checked, title, desc, tone = 'info') => {
        const activeStyle = checked
          ? (tone === 'good'
              ? 'margin-bottom:0;border-color:rgba(34,197,94,0.65);background:rgba(34,197,94,0.12);'
              : tone === 'warn'
                ? 'margin-bottom:0;border-color:rgba(245,158,11,0.65);background:rgba(245,158,11,0.12);'
                : 'margin-bottom:0;border-color:rgba(59,130,246,0.6);background:rgba(59,130,246,0.16);')
          : 'margin-bottom:0;border-color:rgba(148,163,184,0.16);background:rgba(15,23,42,0.45);';
        return `
          <label class="bloom-sample-opt" style="${activeStyle}">
            <input type="radio" name="${name}" value="${val}" ${checked ? 'checked' : ''} />
            <span><strong>${title}</strong> — ${desc}</span>
          </label>
        `;
      };

      const savedDeck = gameState.slideDeck;
      const hasPendingEdits = Boolean(savedDeck?.ready) && (
        draft.framing !== (savedDeck.framing || 'mechanistic') ||
        draft.fig1Id !== (savedDeck.fig1Id || null) ||
        draft.fig2Id !== (savedDeck.fig2Id || null) ||
        draft.honestDisclosure !== (savedDeck.honestDisclosure !== undefined ? Boolean(savedDeck.honestDisclosure) : true)
      );
      const deckSavedReady = Boolean(savedDeck?.ready) && distinctPair && !hasPendingEdits;
      const deckStatusCls = deckSavedReady ? 'good' : 'warn';
      const deckStatusIcon = deckSavedReady ? 'check-circle' : 'alert-circle';
      const deckStatusText = !distinctPair
        ? `${labBook.length}/2 Distinct Figures`
        : deckSavedReady
          ? '4/4 Slides Ready'
          : 'Unsaved Draft — Click Save';

      mountEl.innerHTML = `
        <header class="klb-modal-header">
          <div>
            <div class="klb-tag info" style="margin-bottom:5px;">
              ${iconSvg('presentation', 13)}
              <span>Friday 09:00 • 4-Slide Deck Builder</span>
            </div>
            <h3>${escHtml(campTitle)} — ${escHtml(playerMeta.name)}</h3>
          </div>
          <button id="sb-cancel-top" type="button" class="hud-btn">${iconSvg('x', 13)}<span>Cancel</span></button>
        </header>

        <div class="klb-modal-body">
          <div class="klb-hint-box" style="display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap;">
            <span style="display:inline-flex;align-items:center;gap:5px;">
              ${iconSvg('file-text', 13)}
              <span>Weekly Report:</span>
              <span class="yield-quality-badge ${weeklyReportPct >= 85 ? 'good' : weeklyReportPct >= 50 ? 'warn' : 'poor'}">${weeklyReportPct}%</span>
              <span class="mono-muted">(Due Thu 18:00)</span>
            </span>
            <span style="display:inline-flex;align-items:center;gap:5px;">
              ${iconSvg('pen-tool', 13)}
              <span>Manuscript Draft:</span>
              <span class="yield-quality-badge ${manuscriptPct >= 85 ? 'good' : manuscriptPct >= 50 ? 'warn' : 'poor'}">${manuscriptPct}%</span>
              <span class="mono-muted">(Due Fri 18:00)</span>
            </span>
            <span style="display:inline-flex;align-items:center;gap:5px;">
              ${iconSvg('shield-check', 13)}
              <span>Lab Condition:</span>
              <span class="yield-quality-badge ${labCondPct >= 70 ? 'good' : labCondPct >= 40 ? 'warn' : 'poor'}">${labCondPct}%</span>
              <span class="mono-muted">(Min 40%)</span>
            </span>
          </div>

          ${missingClicker ? `
            <section class="klb-hint-box warn" style="display:flex;align-items:center;gap:8px;">
              ${iconSvg('alert-circle', 15)}
              <span><strong>Clicker Missing:</strong> Grab your laser clicker from the KLB 3F Write-Up Desk.</span>
            </section>
          ` : ''}

          <!-- 2x2 4-Slide Widescreen Deck Grid: Slide 1 (TL) -> Slide 2 (TR) -> Slide 3 (BL) -> Slide 4 (BR) -->
          <div class="slide-grid-2x2">

            <!-- SLIDE 1 (TOP-LEFT): PROJECT AIM & FRAMING -->
            <section class="slide-card">
              <h4>${iconSvg('compass', 13)}<span>SLIDE 1 • PROJECT AIM &amp; FRAMING</span></h4>
              ${radioOpt('sb-framing', 'mechanistic', draft.framing === 'mechanistic', 'Mechanistic &amp; Concise', 'Stoichiometries, pH &amp; controls (reliable baseline)')}
              ${radioOpt('sb-framing', 'bold', draft.framing === 'bold', 'Bold Therapeutic Pitch', 'High-impact claim (+bonus at ≥82% purity, risk if weak)')}
              ${radioOpt('sb-framing', 'humble', draft.framing === 'humble', 'Humble Preliminary Update', 'Conservative framing for unfinished steps')}
            </section>

            <!-- SLIDE 2 (TOP-RIGHT): SYNTHETIC / BIOCONJUGATION PREP FIGURE -->
            ${renderSlideCard(
              'SLIDE 2 • SYNTHETIC / PREP FIGURE',
              'flask-conical',
              'sb-fig1',
              'sb-cv-1',
              fig1,
              'Collect a TLC / NMR / Gel in Lab 230 for Slide 2'
            )}

            <!-- SLIDE 3 (BOTTOM-LEFT): CHARACTERISATION & PURITY PROOF -->
            ${renderSlideCard(
              'SLIDE 3 • CHARACTERISATION PROOF',
              'activity',
              'sb-fig2',
              'sb-cv-2',
              fig2,
              'Collect a 2nd distinct Gel / LC-MS / NMR for Slide 3',
              fig1 && fig2 && !distinctPair ? `<span class="klb-tag danger">${iconSvg('alert-triangle', 12)}<span>Duplicate</span></span>` : ''
            )}

            <!-- SLIDE 4 (BOTTOM-RIGHT): CONCLUSIONS & SCIENTIFIC HONESTY -->
            <section class="slide-card">
              <h4>${iconSvg('shield-check', 13)}<span>SLIDE 4 • CONCLUSIONS &amp; HONESTY</span></h4>
              ${radioOpt(
                'sb-honesty',
                'honest',
                draft.honestDisclosure,
                'Disclose Flaws Rigorously',
                anyFlaw
                  ? `Flag flaws honestly (+0.40 Rigour${isRichard ? ', +0.25 Richard perk' : ''} partial credit).`
                  : 'Add cautious caveats/controls (+0.65 Rigour).',
                'good'
              )}
              ${radioOpt(
                'sb-honesty',
                'gamble',
                !draft.honestDisclosure,
                'Present As Clean',
                anyFlaw
                  ? `<span class="klb-tag danger">${iconSvg('alert-triangle', 12)}<span>Risk: visible flaws (${isRichard ? '-1.75' : '-1.40'} Rigour, -6 Patience).</span></span>`
                  : `<span class="klb-tag good">${iconSvg('check-circle', 12)}<span>Clean polish (+0.60 Rigour).</span></span>`,
                anyFlaw ? 'warn' : 'good'
              )}
            </section>
          </div>
        </div>

        <footer class="klb-modal-footer">
          <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;">
            <span class="klb-tag ${deckStatusCls}">
              ${iconSvg(deckStatusIcon, 13)}
              <span>${deckStatusText}</span>
            </span>
            <span class="klb-tag ${pairBadgeCls === 'good' ? 'good' : 'warn'}">${escHtml(pairBadgeText)}</span>
            <span class="klb-tag ${qualBadgeCls === 'good' ? 'good' : qualBadgeCls === 'poor' ? 'danger' : 'warn'}">Slide Quality: ${slideAvgQ}%</span>
            <span class="klb-tag ${flawBadgeCls === 'good' ? 'good' : flawBadgeCls === 'poor' ? 'danger' : 'warn'}">${flawBadgeText}</span>
          </div>
          <div style="display:flex;gap:8px;">
            <button id="sb-cancel-btn" type="button" class="hud-btn">Cancel</button>
            <button id="sb-save-btn" type="button" class="hud-btn primary">${iconSvg('check', 14)}<span>Save 4-Slide Deck</span></button>
          </div>
        </footer>
      `;

      // Render HiDPI live spectra previews onto Slide 2 & Slide 3 canvases
      const cv1 = mountEl.querySelector('#sb-cv-1');
      if (fig1 && cv1) {
        setupHiDpiCanvas(cv1, 340, 145);
        renderToCanvas(cv1, fig1, { width: 340, height: 145 });
      }
      const cv2 = mountEl.querySelector('#sb-cv-2');
      if (fig2 && cv2) {
        setupHiDpiCanvas(cv2, 340, 145);
        renderToCanvas(cv2, fig2, { width: 340, height: 145 });
      }

      // Wire interactive controls
      mountEl.querySelectorAll('input[name="sb-framing"]').forEach(r => {
        r.onchange = () => {
          draft.framing = r.value;
          playSfxSafe('slide_click');
          renderModalUI();
        };
      });

      mountEl.querySelectorAll('input[name="sb-honesty"]').forEach(r => {
        r.onchange = () => {
          draft.honestDisclosure = (r.value === 'honest');
          playSfxSafe('slide_click');
          renderModalUI();
        };
      });

      const sel1 = mountEl.querySelector('#sb-fig1');
      if (sel1) {
        sel1.onchange = () => {
          const prev = draft.fig1Id;
          draft.fig1Id = sel1.value || null;
          if (draft.fig1Id && draft.fig1Id === draft.fig2Id && labBook.length > 1) {
            draft.fig2Id = prev && prev !== draft.fig1Id ? prev : (labBook.find(f => f.id !== draft.fig1Id)?.id || draft.fig2Id);
          }
          playSfxSafe('slide_click');
          renderModalUI();
        };
      }

      const sel2 = mountEl.querySelector('#sb-fig2');
      if (sel2) {
        sel2.onchange = () => {
          const prev = draft.fig2Id;
          draft.fig2Id = sel2.value || null;
          if (draft.fig2Id && draft.fig2Id === draft.fig1Id && labBook.length > 1) {
            draft.fig1Id = prev && prev !== draft.fig2Id ? prev : (labBook.find(f => f.id !== draft.fig2Id)?.id || draft.fig1Id);
          }
          playSfxSafe('slide_click');
          renderModalUI();
        };
      }

      const cancelFn = () => {
        playSfxSafe('interact');
        if (onSaveDeck) onSaveDeck(null);
      };
      mountEl.querySelector('#sb-cancel-top').onclick = cancelFn;
      mountEl.querySelector('#sb-cancel-btn').onclick = cancelFn;

      mountEl.querySelector('#sb-save-btn').onclick = () => {
        playSfxSafe('slide_click');
        const saved = {
          ready: true,
          framing: draft.framing,
          fig1Id: draft.fig1Id,
          fig2Id: draft.fig2Id,
          honestDisclosure: draft.honestDisclosure
        };
        gameState.slideDeck = saved;
        if (onSaveDeck) onSaveDeck(saved);
      };

      if (focusTarget) {
        let nextFocus = null;
        if (focusTarget.type === 'id') {
          nextFocus = mountEl.querySelector(`#${focusTarget.id}`);
        } else if (focusTarget.type === 'nameVal') {
          const candidates = mountEl.querySelectorAll(`input[name="${focusTarget.name}"]`);
          nextFocus = Array.from(candidates).find(el => el.value === focusTarget.value) || null;
        }
        if (nextFocus && typeof nextFocus.focus === 'function') {
          nextFocus.focus();
        }
      }
    }

    renderModalUI();
  }

  // -------------------- SOLO PI 0.0-10.0 FRIDAY SCORE-CARD AUDITOR --------------------
  function evaluateFridayAudit(gameState, opts = {}) {
    const state = gameState || {};
    const auditOpts = opts || {};
    const phase = auditOpts.phase || 'morning';
    const isFinalPhase = phase === 'final';
    const playerId = state.player?.id || state.charId || 'daniel_richards';
    const playerMeta = window.KLB.CAST_BY_ID?.[playerId] || {
      name: playerId === 'archie_wall' ? 'Archie Wall' : 'Researcher',
      shortName: playerId === 'archie_wall' ? 'Archie' : 'Chud'
    };
    const isArchie = playerId === 'archie_wall' || playerMeta?.supervisorId === 'jamie_baker';
    const supervisorId = isArchie ? 'jamie_baker' : 'vijay_chudasama';
    const supervisorName = isArchie ? 'Prof. Jamie Baker' : 'Prof. Vijay Chudasama';
    const supShort = isArchie ? 'Jamie' : 'Vijay';
    const patienceLabel = isArchie ? 'Jamie Patience' : 'Vijay Patience';
    const activeCamp = window.KLB.getCampaign(playerId, state);
    const activeCascadeIdx = activeCamp?.cascadeIndex ?? 0;
    const totalSteps = activeCamp?.steps?.length || 5;
    const doneSteps = Array.isArray(state.completedSteps) ? state.completedSteps.length : 0;
    const labBook = (Array.isArray(state.labBook) ? state.labBook : []).filter(Boolean);
    const deck = state.slideDeck || { ready: false, framing: 'mechanistic', fig1Id: null, fig2Id: null, honestDisclosure: true };

    // Resolve Slide 2 & Slide 3 figures (if player forgot to open SlideBuilder, inspect what's in labBook at a hygiene penalty)
    const fig1 = labBook.find(f => f && f.id === deck.fig1Id) || (deck.ready ? null : labBook[0]) || null;
    const fig2 = labBook.find(f => f && f.id === deck.fig2Id && f.id !== fig1?.id)
      || (deck.ready ? labBook.find(f => f && f.id === deck.fig2Id) : labBook.find(f => f && f.id !== fig1?.id))
      || null;
    const distinctFigures = Boolean(fig1 && fig2 && fig1.id !== fig2.id);

    // Curated Data Quality & Yield: 70% weight on Slide 2 + Slide 3 curated figures, 30% on remaining labBook
    const slideFigs = [];
    for (const f of [fig1, fig2]) {
      if (f && !slideFigs.some(u => u.id === f.id)) slideFigs.push(f);
    }
    const slideIdSet = new Set(slideFigs.map(f => f.id));
    const otherFigs = labBook.filter(f => f && !slideIdSet.has(f.id));

    const meanQualityOf = arr => arr.length ? arr.reduce((s, f) => s + getQuality(f, 0), 0) / arr.length : 0;
    const meanYieldOf = arr => arr.length
      ? arr.reduce((s, f) => {
          const y = parseYieldPct(f, false);
          return s + (y !== null ? y : getQuality(f, 0));
        }, 0) / arr.length
      : 0;

    let avgQualityRaw = 0;
    let avgYieldRaw = 0;
    if (slideFigs.length > 0 && otherFigs.length > 0) {
      avgQualityRaw = meanQualityOf(slideFigs) * 0.70 + meanQualityOf(otherFigs) * 0.30;
      avgYieldRaw = meanYieldOf(slideFigs) * 0.70 + meanYieldOf(otherFigs) * 0.30;
    } else if (slideFigs.length > 0) {
      avgQualityRaw = meanQualityOf(slideFigs);
      avgYieldRaw = meanYieldOf(slideFigs);
    } else if (otherFigs.length > 0) {
      avgQualityRaw = meanQualityOf(otherFigs) * 0.30;
      avgYieldRaw = meanYieldOf(otherFigs) * 0.30;
    }
    const avgQuality = Math.round(avgQualityRaw * 10) / 10;
    const avgYield = Math.round(avgYieldRaw * 10) / 10;

    // 1) YIELD & CAMPAIGN COMPLETION SCORE (0.0 - 2.0)
    // Morning (Fri 09:00) grades generously toward Steps 1-4; Final (Fri 18:00) requires full 5/5 steps
    const stepDenom = isFinalPhase ? Math.max(1, totalSteps) : Math.max(1, totalSteps - 1);
    const stepRatio = clamp(doneSteps / stepDenom, 0, 1);
    const yieldRatio = clamp(avgYieldRaw / 100, 0, 1);
    let yieldRaw = 0.5 * stepRatio * 2.0 + 0.5 * yieldRatio * 2.0;
    if (!isFinalPhase && doneSteps >= totalSteps) yieldRaw += 0.05;
    let framingNote = '';
    if (deck.framing === 'bold' && stepRatio >= 0.8 && avgQualityRaw >= 82 && avgYieldRaw >= 75) {
      yieldRaw += 0.15;
      framingNote = ', +bold pitch';
    } else if (deck.framing === 'bold' && (stepRatio < 0.6 || (labBook.length > 0 && (avgQualityRaw < 72 || avgYieldRaw < 60)))) {
      yieldRaw -= 0.20;
      framingNote = ', -overclaim penalty';
    } else if (deck.framing === 'humble' && doneSteps < totalSteps) {
      yieldRaw += 0.10;
      framingNote = ', +humble framing';
    }
    const yieldScore = Math.round(clamp(yieldRaw, 0, 2.0) * 10) / 10;
    const yieldReason = `${doneSteps}/${isFinalPhase ? totalSteps : stepDenom} ${isFinalPhase ? 'steps' : 'morning target steps'}, ${Math.round(avgYieldRaw)}% curated yield${framingNote}`;

    // 2) HOMOGENEITY & SWEET-SPOT PURITY SCORE (0.0 - 2.0)
    const overcookedCount = (Array.isArray(state.activeReactions) ? state.activeReactions : []).filter(r => r && r.status === 'overcooked').length;
    const homogeneityRaw = (avgQualityRaw / 100) * 2.0 - overcookedCount * 0.2;
    const homogeneityScore = Math.round(clamp(homogeneityRaw, 0, 2.0) * 10) / 10;
    const homogeneityReason = `${Math.round(avgQualityRaw)}% curated quality (70% slides / 30% book)${overcookedCount > 0 ? `, -${(overcookedCount * 0.2).toFixed(1)} (${overcookedCount} overcooked)` : ''}`;

    const figTypeOf = f => String(f?.type || f?.output?.type || f?.dataOutput?.type || 'data').toLowerCase();
    // 3) ANALYTICAL RIGOR & SCIENTIFIC HONESTY SCORE (0.0 - 2.0)
    // Spotless Slide 2+3 data ALWAYS outscores flawed-but-disclosed data!
    let rigorRaw = 0.15;
    let pairDesc = 'No figures';
    if (distinctFigures) {
      const t1 = figTypeOf(fig1);
      const t2 = figTypeOf(fig2);
      const hasNmr = t1 === 'nmr' || t2 === 'nmr';
      const hasMsOrGel = t1 === 'lcms' || t2 === 'lcms' || t1 === 'gel' || t2 === 'gel';
      if (hasNmr && hasMsOrGel) {
        rigorRaw = 1.30;
        pairDesc = `Orthogonal ${t1.toUpperCase()}+${t2.toUpperCase()}`;
      } else if (t1 !== t2) {
        rigorRaw = 1.20;
        pairDesc = `Cross-method ${t1.toUpperCase()}+${t2.toUpperCase()}`;
      } else {
        rigorRaw = 0.90;
        pairDesc = `Same-method ${t1.toUpperCase()}×2`;
      }
    } else if (fig1 || fig2) {
      rigorRaw = 0.60;
      pairDesc = `Single ${figTypeOf(fig1 || fig2).toUpperCase()} figure`;
    }

    const slideFlawedFig = [fig2, fig1].find(f => hasSpectrumFlaw(f)) || null;
    const caughtHiding = Boolean(slideFlawedFig && !deck.honestDisclosure);
    let vijayCalloutLine = null;
    let richardPerkTriggered = false;
    let rigorReason = pairDesc;

    if (slideFlawedFig) {
      if (deck.honestDisclosure) {
        const isRich = playerId === 'richard_spears';
        rigorRaw += isRich ? 0.65 : 0.40;
        richardPerkTriggered = isRich;
        rigorReason = `${pairDesc}; flaw disclosed (+${isRich ? '0.65 Richard perk' : '0.40'} recovery)`;
      } else {
        const isRich = playerId === 'richard_spears';
        const hidePenalty = isRich ? 1.75 : 1.40;
        rigorRaw -= hidePenalty;
        const slideNum = slideFlawedFig.id === fig1?.id ? 2 : 3;
        const figType = figTypeOf(slideFlawedFig);
        rigorReason = `Slide ${slideNum} flaw hidden (-${hidePenalty.toFixed(2)} ${supShort} callout${isRich ? ', Richard flaw' : ''})`;
        if (isArchie) {
          if (figType === 'nmr' || slideFlawedFig.hasSolventPeak) {
            vijayCalloutLine = `Hold on, ${playerMeta.shortName} — look closely at Slide ${slideNum}. There is an unflagged 5.30 ppm DCM peak sitting beside your product signals that needed noting upfront.`;
          } else if (figType === 'gel' || slideFlawedFig.hasOverReduction || slideFlawedFig.hasBlueDyeMishap) {
            const gelFlawDesc = describeFigureFlaw(slideFlawedFig);
            vijayCalloutLine = slideFlawedFig.hasBlueDyeMishap
              ? `Just pause on Slide ${slideNum}, ${playerMeta.shortName} — that blue LDS loading-dye smear down the lane should have been disclosed openly rather than brushed past.`
              : `Just pause on Slide ${slideNum}, ${playerMeta.shortName} — what is that ${gelFlawDesc} on the gel? Always declare lane flaws on Slide 4 rather than glossing over them.`;
          } else if (figType === 'lcms' || slideFlawedFig.hasAdduct) {
            vijayCalloutLine = `Let's stay on Slide ${slideNum} a moment, ${playerMeta.shortName} — there is an unflagged +69 Da adduct and +44 Da PEG comb on the LC-MS trace that needed honest disclosure.`;
          } else {
            const flawDesc = describeFigureFlaw(slideFlawedFig);
            vijayCalloutLine = `Hold on a second on Slide ${slideNum}, ${playerMeta.shortName} — that ${flawDesc} needed an open note rather than being swept under the rug.`;
          }
        } else {
          if (figType === 'nmr' || slideFlawedFig.hasSolventPeak) {
            vijayCalloutLine = `Wait — is that 5.30 ppm DCM on Slide ${slideNum}?! That's suboptimal — one word.`;
          } else if (figType === 'gel' || slideFlawedFig.hasOverReduction || slideFlawedFig.hasBlueDyeMishap) {
            const gelFlawDesc = describeFigureFlaw(slideFlawedFig);
            vijayCalloutLine = slideFlawedFig.hasBlueDyeMishap
              ? `Hold on — go back to Slide ${slideNum}. Is that a blue LDS loading-dye smear down the gel lane you tried to gloss over?! That's suboptimal — one word.`
              : `Hold on — go back to Slide ${slideNum}. Is that ${gelFlawDesc} you tried to gloss over?! That's suboptimal — one word.`;
          } else if (figType === 'lcms' || slideFlawedFig.hasAdduct) {
            vijayCalloutLine = `Hold on — go back to Slide ${slideNum}. Is that a +69 Da adduct and +44 Da PEG comb in the LC-MS you tried to gloss over?! That's suboptimal — one word.`;
          } else {
            const flawDesc = describeFigureFlaw(slideFlawedFig);
            vijayCalloutLine = `Hold on — go back to Slide ${slideNum}. Is that ${flawDesc} on the TLC plate you tried to gloss over?! That's suboptimal — one word.`;
          }
        }
      }
    } else if (distinctFigures) {
      const bonus = deck.honestDisclosure ? 0.65 : 0.60;
      rigorRaw += bonus;
      rigorReason = `${pairDesc}; spotless data (+${bonus.toFixed(2)})`;
    } else if (fig1 || fig2) {
      const bonus = deck.honestDisclosure ? 0.45 : 0.40;
      rigorRaw += bonus;
      rigorReason = `${pairDesc}; clean (+${bonus.toFixed(2)})`;
    }
    const rigorScore = Math.round(clamp(rigorRaw, 0, 2.0) * 10) / 10;

    // 4) THURSDAY WEEKLY REPORT + FRIDAY MANUSCRIPT PREPARATION SCORE (0.0 - 1.5)
    // Morning (09:00): grade Weekly Report only (do NOT deduct incomplete Fri 18:00 Manuscript Draft!)
    // Final (18:00): include final Manuscript Draft progress (0..0.85) + Weekly Report (0..0.65)
    const weeklyReportPct = clamp(Number(state.weeklyReportProgress) || 0, 0, 100);
    const manuscriptPct = clamp(Number(state.manuscriptProgress) || 0, 0, 100);
    const manuscriptRaw = isFinalPhase
      ? clamp((weeklyReportPct / 100) * 0.65 + (manuscriptPct / 100) * 0.85, 0, 1.5)
      : clamp((weeklyReportPct / 100) * 1.5, 0, 1.5);
    const manuscriptScore = Math.round(manuscriptRaw * 10) / 10;
    const manuscriptReason = isFinalPhase
      ? `Thu Report ${Math.round(weeklyReportPct)}% + Fri Manuscript ${Math.round(manuscriptPct)}%`
      : `Thu Report ${Math.round(weeklyReportPct)}% (Fri 18:00 Manuscript not docked at 09:00)`;

    // 5) SLIDE HYGIENE, PUNCTUALITY & CLICKER SCORE (0.0 - 1.5)
    let hygieneRaw = 0;
    let deckHygieneTxt = 'deck unsaved';
    if (deck.ready && distinctFigures) {
      hygieneRaw += 0.75;
      deckHygieneTxt = '2 distinct figures saved';
    } else if (deck.ready && (fig1 || fig2)) {
      hygieneRaw += 0.50;
      deckHygieneTxt = '1 figure saved';
    } else if (deck.ready) {
      hygieneRaw += 0.30;
      deckHygieneTxt = 'deck saved (no figures)';
    } else {
      hygieneRaw += 0.10;
    }

    const hasTimeMins = state.timeMins !== undefined && state.timeMins !== null && Number.isFinite(Number(state.timeMins));
    const curTimeMins = hasTimeMins ? Number(state.timeMins) : 540;
    let onTime;
    if (isFinalPhase) {
      if (typeof state.fridayMorningPresented === 'boolean') {
        onTime = state.fridayMorningPresented
          ? (typeof state.lastAuditResult?.onTime === 'boolean' ? state.lastAuditResult.onTime : true)
          : false;
      } else if (typeof state.lastAuditResult?.onTime === 'boolean') {
        onTime = state.lastAuditResult.onTime;
      } else {
        onTime = false;
      }
    } else {
      onTime = state.fridayMorningPresented === true || curTimeMins < 600;
    }
    hygieneRaw += onTime ? 0.45 : 0.15;

    const hasClicker = playerId === 'andre_shamsabadi'
      ? Boolean(state.prep?.has_clicker)
      : (state.prep?.has_clicker !== false);
    if (hasClicker) hygieneRaw += 0.30;

    const hygieneScore = Math.round(clamp(hygieneRaw, 0, 1.5) * 10) / 10;
    const punctualityTxt = onTime
      ? 'on time'
      : (isFinalPhase && state.fridayMorningPresented === false ? 'skipped 09:00 meeting' : 'late');
    const hygieneReason = `${deckHygieneTxt}, ${punctualityTxt}, ${hasClicker ? 'clicker ready' : 'missing clicker'}`;

    // 6) KLB LAB CITIZENSHIP, LAB CONDITION & SUPERVISOR PATIENCE RUBRIC SCORE (0.0 - 1.0)
    const rawPatience = (state.patience !== undefined && state.patience !== null)
      ? Number(state.patience)
      : (isArchie && state.jamiePatience !== undefined && state.jamiePatience !== null
        ? Number(state.jamiePatience)
        : (state.vijayPatience !== undefined && state.vijayPatience !== null ? Number(state.vijayPatience) : 80));
    const vijayPatience = clamp(Number.isFinite(rawPatience) ? rawPatience : 80, 0, 100);

    const labCond = Number(state.labCondition != null ? state.labCondition : (state.safety ?? 85));
    const safeLabCond = Number.isFinite(labCond) ? labCond : 85;
    const condPart = clamp(safeLabCond / 100, 0, 1) * 0.55;
    const favourPart = Math.min(0.30, (Number(state.favours) || 0) * 0.15);
    const cleanBenchPart = (!state.prep?.thiol_dirty && !state.prep?.uncapped_waste) ? 0.15 : 0.0;
    let citizenshipRaw = condPart + favourPart + cleanBenchPart;
    if (vijayPatience >= 85) citizenshipRaw += 0.10;
    else if (vijayPatience < 55) citizenshipRaw -= (vijayPatience < 30 ? 0.20 : 0.12);
    if (state.prep?.thiol_dirty) citizenshipRaw -= 0.25;
    if (state.abilFineOwed) citizenshipRaw -= 0.25;
    const citizenshipScore = Math.round(clamp(citizenshipRaw, 0, 1.0) * 10) / 10;

    // Presented Group Meeting Quality & Yield -> Supervisor Patience Delta
    const presentedFigs = slideFigs.length > 0 ? slideFigs : labBook.slice();
    let presentedAvgQuality = 0;
    let presentedAvgYield = 0;
    let presentedPerf = 45;
    if (presentedFigs.length > 0) {
      presentedAvgQuality = presentedFigs.reduce((s, f) => s + getQuality(f, 0), 0) / presentedFigs.length;
      presentedAvgYield = presentedFigs.reduce((s, f) => {
        const y = parseYieldPct(f, false);
        return s + (y !== null ? y : getQuality(f, 0));
      }, 0) / presentedFigs.length;
      presentedPerf = Math.round(presentedAvgQuality * 0.6 + presentedAvgYield * 0.4);
    }

    let patienceDelta = 0;
    if (presentedPerf >= 84 && presentedFigs.length >= 2 && !caughtHiding) {
      patienceDelta = 12;
    } else if (presentedPerf >= 74 && !caughtHiding) {
      patienceDelta = 5;
    } else if (presentedPerf >= 62) {
      patienceDelta = -8;
    } else {
      patienceDelta = -16;
    }
    if (caughtHiding) {
      patienceDelta -= 6;
    }

    // Hard-mutator prestige bonus (+0.40) and Faiza PI Charm rescue (+0.50 on tight 5.5-7.0 scores)
    const muts = state.mutators || {};
    const hardMutatorLabels = [];
    if (muts.strict_coshh) hardMutatorLabels.push('Strict COSHH');
    if (muts.lcms_chaos) hardMutatorLabels.push('50% LC-MS Chaos');
    if (muts.eternal_heatwave) hardMutatorLabels.push('30 °C Heatwave');
    const hasHardMutator = hardMutatorLabels.length > 0;
    const mutatorBonus = hasHardMutator ? 0.40 : 0;

    let total = Math.round(clamp(
      yieldScore + homogeneityScore + rigorScore + manuscriptScore + hygieneScore + citizenshipScore + mutatorBonus,
      0,
      10
    ) * 10) / 10;

    let faizaRescueApplied = false;
    const preRescueTotal = total;
    if (playerId === 'faiza_javaid' && total >= 5.5 && total < 7.0) {
      total = Math.round(clamp(total + 0.50, 0, 10) * 10) / 10;
      faizaRescueApplied = true;
    }

    const weekNum = Math.max(1, Number(state.weekNum) || 1);
    const passThreshold = Math.min(7.5, 6.0 + 0.3 * Math.max(0, weekNum - 1));
    const passed = total >= passThreshold;

    const citizenshipReason = `Lab ${Math.round(safeLabCond)}%, ${Number(state.favours) || 0} favour(s), ${patienceLabel} ${Math.round(vijayPatience)}${faizaRescueApplied ? ', +0.5 Faiza PI charm rescue' : ''}${hasHardMutator ? `, +0.4 hard-mutator (${hardMutatorLabels.join(', ')})` : ''}${state.prep?.thiol_dirty ? ', thiol penalty' : ''}${state.abilFineOwed ? ', NMR fine' : ''}`;

    // Assemble Supervisor's multi-line solo verdict (no outer quotation marks; main.js adds smart quotes)
    const vijayVerdictLines = [];
    if (vijayCalloutLine) {
      vijayVerdictLines.push(vijayCalloutLine);
    }

    if (isArchie) {
      if (doneSteps >= totalSteps) {
        vijayVerdictLines.push(
          activeCascadeIdx === 1
            ? `All ${totalSteps} Cascade 2 steps executed cleanly across the week, ${playerMeta.shortName} — crisp one-pot thiol-amine maleimide selectivity and ring-open discipline.`
            : `All ${totalSteps} campaign steps executed cleanly across the week, ${playerMeta.shortName} — textbook Baker-bay albumin-maleimide momentum and balanced-rotor discipline.`
        );
      } else if (!isFinalPhase && doneSteps >= totalSteps - 1) {
        vijayVerdictLines.push(`Lovely progress with ${doneSteps} of ${totalSteps} planned steps complete by Friday morning, ${playerMeta.shortName} — Nafsika can keep an eye on the Baker hood if you finish Step ${totalSteps} before 18:00.`);
      } else if (doneSteps >= 3) {
        vijayVerdictLines.push(`You pushed through ${doneSteps} of ${totalSteps} planned steps, ${playerMeta.shortName} — let's wrap up the remaining HSA Cys34 selectivity checks ${isFinalPhase ? 'first thing Monday morning' : 'cleanly before 18:00'}.`);
      } else {
        vijayVerdictLines.push(`Only ${doneSteps} of ${totalSteps} steps are across the line by Friday Group Meeting, ${playerMeta.shortName} — let's tighten the bench plan in Baker bay and lean on Nafsika if spin filters back up next week.`);
      }

      if (slideFlawedFig && deck.honestDisclosure) {
        vijayVerdictLines.push(`Appreciated the honest Slide 4 disclosure flagging the ${describeFigureFlaw(slideFlawedFig)}, ${playerMeta.shortName} — transparent kinetics and clear re-purification plans keep Baker-group manuscripts watertight.`);
      } else if (!slideFlawedFig && distinctFigures) {
        vijayVerdictLines.push(`Clean orthogonal proof across your ${figTypeOf(fig1).toUpperCase()} and ${figTypeOf(fig2).toUpperCase()} slides — crisp HSA Cys34 selectivity, spotless baselines, and publication-ready.`);
      } else if (!deck.ready) {
        vijayVerdictLines.push(`Walking into Friday Group Meeting without saving a finished 4-slide deck puts Baker bay on the back foot, ${playerMeta.shortName} — lock those slides in before 09:00 next week.`);
      }
    } else {
      if (doneSteps >= totalSteps) {
        vijayVerdictLines.push(
          activeCascadeIdx === 1
            ? `All ${totalSteps} Cascade 2 steps (${activeCamp?.manuscriptTopic || 'project'}) executed across the week, ${playerMeta.shortName} — sharpest synthetic momentum yet.`
            : `All ${totalSteps} campaign steps executed across the week, ${playerMeta.shortName} — very solid synthetic momentum.`
        );
      } else if (!isFinalPhase && doneSteps >= totalSteps - 1) {
        vijayVerdictLines.push(`Strong momentum with ${doneSteps} of ${totalSteps} planned steps complete by Friday morning — wrap up Step ${totalSteps} before 18:00.`);
      } else if (doneSteps >= 3) {
        vijayVerdictLines.push(`You pushed through ${doneSteps} of ${totalSteps} planned steps; let's close out the remaining characterisation ${isFinalPhase ? 'first thing Monday' : 'before 18:00'}.`);
      } else {
        vijayVerdictLines.push(`Only ${doneSteps} of ${totalSteps} steps completed by Friday Group Meeting. That's suboptimal — one word.`);
      }

      if (slideFlawedFig && deck.honestDisclosure) {
        vijayVerdictLines.push(
          richardPerkTriggered
            ? `Exemplary scientific honesty flagging the ${describeFigureFlaw(slideFlawedFig)} upfront on Slide 4, Richard — that's how we keep Chudasama manuscripts watertight.`
            : `Good scientific rigour disclosing the ${describeFigureFlaw(slideFlawedFig)} openly on Slide 4 with a clear re-purification plan.`
        );
      } else if (!slideFlawedFig && distinctFigures) {
        vijayVerdictLines.push(`Crisp orthogonal proof across your ${figTypeOf(fig1).toUpperCase()} and ${figTypeOf(fig2).toUpperCase()} slides — baseline-resolved and publication-ready.`);
      } else if (!deck.ready) {
        vijayVerdictLines.push(`Walking into Friday Group Meeting without saving a finished 4-slide deck is brave, I'll give you that.`);
      }
    }

    const wrRounded = Math.round(weeklyReportPct);
    const msRounded = Math.round(manuscriptPct);
    if (wrRounded >= 100 && msRounded >= 100) {
      vijayVerdictLines.push(
        isArchie
          ? `Both your Thursday Weekly Report (100%) and Friday Manuscript Draft (100%) landed on schedule — your maleimide schemes and SI characterisation tables read cleanly.`
          : `Both your Thursday Weekly Report (100%) and Friday Manuscript Draft (100%) are complete — experimental schemes and SI characterisation tables look publication-tight.`
      );
    } else {
      if (wrRounded < 100) {
        if (isArchie) {
          vijayVerdictLines.push(
            wrRounded === 0
              ? `Your Thursday Weekly Report (Due Thu 18:00) was left unsubmitted at 0% — make sure that short summary reaches me every Thursday evening.`
              : `Your Thursday Weekly Report sits at ${wrRounded}% (${100 - wrRounded}% short of the Thu 18:00 deadline) — finish that write-up cleanly next week.`
          );
        } else {
          vijayVerdictLines.push(
            wrRounded === 0
              ? `Your Thursday Weekly Report (Due Thu 18:00) was left unsubmitted at 0% — I expect that summary on time every Thursday.`
              : `Your Thursday Weekly Report is incomplete at ${wrRounded}% (${100 - wrRounded}% short of the Thu 18:00 deadline).`
          );
        }
      } else {
        vijayVerdictLines.push(
          isArchie
            ? `Thursday Weekly Report landed cleanly at 100% ahead of deadline.`
            : `Thursday Weekly Report was submitted cleanly at 100% ahead of deadline.`
        );
      }
      if (msRounded < 100) {
        if (!isFinalPhase) {
          if (isArchie) {
            vijayVerdictLines.push(
              msRounded >= 50
                ? `Manuscript Draft is ticking along nicely at ${msRounded}% (due Fri 18:00 — keep writing after meeting).`
                : msRounded > 0
                  ? `Manuscript Draft is underway at ${msRounded}% (due Fri 18:00 — keep writing after meeting).`
                  : `Manuscript Draft is due Fri 18:00 — carve out quiet desk hours upstairs after meeting.`
            );
          } else {
            vijayVerdictLines.push(
              msRounded >= 50
                ? `Manuscript Draft is off to a strong start at ${msRounded}% (due Fri 18:00 — keep writing after meeting).`
                : msRounded > 0
                  ? `Manuscript Draft is underway at ${msRounded}% (due Fri 18:00 — keep writing after meeting).`
                  : `Manuscript Draft due Fri 18:00 — keep writing after meeting.`
            );
          }
        } else {
          const msMissing = 100 - msRounded;
          if (isArchie) {
            vijayVerdictLines.push(
              msRounded >= 50
                ? `Friday Manuscript Draft sits at ${msRounded}% (missing ${msMissing}% at the Fri 18:00 deadline) — polish the Supporting Information and maleimide scheme captions next.`
                : `Friday Manuscript Draft reached only ${msRounded}% (missing ${msMissing}% at the Fri 18:00 deadline) — book proper quiet desk hours on 3F for experimental write-ups.`
            );
          } else {
            vijayVerdictLines.push(
              msRounded >= 50
                ? `Friday Manuscript Draft sits at ${msRounded}% (missing ${msMissing}% at the Fri 18:00 deadline) — finish the Supporting Information and scheme captions.`
                : `Friday Manuscript Draft is only ${msRounded}% complete (missing ${msMissing}% at the Fri 18:00 deadline) — you need proper desk hours on 3F writing up schemes and experimental details.`
            );
          }
        }
      } else {
        vijayVerdictLines.push(
          isArchie
            ? `Friday Manuscript and Supporting Information draft is 100% ready for Baker-group review.`
            : `Friday Manuscript and Supporting Information draft is 100% ready.`
        );
      }
    }

    const presentedQInt = Math.round(presentedAvgQuality);
    const presentedYInt = Math.round(presentedAvgYield);
    const deltaStr = patienceDelta >= 0 ? `+${patienceDelta}` : `${patienceDelta}`;
    if (isArchie) {
      if (presentedFigs.length === 0) {
        vijayVerdictLines.push(`No analytical figures were presented (${presentedQInt}% quality, ${presentedYInt}% yield), testing Baker-group patience (${patienceLabel} ${deltaStr}).`);
      } else if (caughtHiding) {
        vijayVerdictLines.push(`Glossing over flawed spectra at ${presentedQInt}% quality, ${presentedYInt}% yield erodes scientific trust quickly (${patienceLabel} ${deltaStr}).`);
      } else if (patienceDelta >= 0) {
        vijayVerdictLines.push(`Your presented figures (${presentedQInt}% quality, ${presentedYInt}% yield) kept Baker bay standards sharp (${patienceLabel} ${deltaStr}).`);
      } else {
        vijayVerdictLines.push(`Results at ${presentedQInt}% quality, ${presentedYInt}% yield need steadier rotor balance and temperature control next week (${patienceLabel} ${deltaStr}).`);
      }
    } else {
      if (presentedFigs.length === 0) {
        vijayVerdictLines.push(`No analytical figures were presented (${presentedQInt}% quality, ${presentedYInt}% yield), straining my patience (Vijay Patience ${deltaStr}).`);
      } else if (caughtHiding) {
        vijayVerdictLines.push(`Glossing over flawed spectra at ${presentedQInt}% quality, ${presentedYInt}% yield wears down my patience quickly (Vijay Patience ${deltaStr}).`);
      } else if (patienceDelta >= 0) {
        vijayVerdictLines.push(`Your presented figures (${presentedQInt}% quality, ${presentedYInt}% yield) earned solid backing (Vijay Patience ${deltaStr}).`);
      } else {
        vijayVerdictLines.push(`Results at ${presentedQInt}% quality, ${presentedYInt}% yield need tighter bench control next week (Vijay Patience ${deltaStr}).`);
      }
    }

    if (!hasClicker && playerId === 'andre_shamsabadi') {
      vijayVerdictLines.push(`And André, having to tap the spacebar at the lectern because your laser clicker is still sitting upstairs on the 3rd floor costs you Slide Hygiene!`);
    } else if (!onTime) {
      if (isArchie) {
        vijayVerdictLines.push(
          isFinalPhase && state.fridayMorningPresented === false
            ? `Skipping Friday 09:00 Group Meeting costs you punctuality on the final rubric — let's make sure you are in the Seminar Room at 09:00 sharp.`
            : `Keep an eye on the clock on Friday mornings — Group Meeting starts at 09:00 sharp.`
        );
      } else {
        vijayVerdictLines.push(
          isFinalPhase && state.fridayMorningPresented === false
            ? `Skipping Friday 09:00 Group Meeting costs you punctuality on the final rubric — I expect you in the Seminar Room at 09:00 sharp.`
            : `Watch the clock on Fridays — Group Meeting starts at 09:00 sharp.`
        );
      }
    }

    if (safeLabCond < 40) {
      vijayVerdictLines.push(
        isArchie
          ? `Lab Condition sits at ${Math.round(safeLabCond)}% (below the 40% inspection threshold) — safety specs stay on before stepping past the blue door (G), headphones off (H), and wipe the central balance table clean.`
          : `Lab Condition sits at ${Math.round(safeLabCond)}% (below the 40% inspection threshold) — keep specs on (G), headphones off (H), and your bay clean.`
      );
    } else if (safeLabCond >= 85) {
      vijayVerdictLines.push(
        isArchie
          ? `Lab Condition is spotless at ${Math.round(safeLabCond)}% — specs on, central balance table brushed clean, and exemplary Baker-bay citizenship.`
          : `Lab Condition is spotless at ${Math.round(safeLabCond)}% — exemplary KLB citizenship.`
      );
    }

    if (state.abilFineOwed) {
      vijayVerdictLines.push(
        isArchie
          ? `Also, remember to clear your uncollected NMR tube charge with Abil down in CIB LG1b before Monday.`
          : `Also, settle your uncollected NMR tube charge with Abil in CIB LG1b before next week.`
      );
    }

    if (hasHardMutator) {
      vijayVerdictLines.push(`Hard-mutator prestige bonus (+0.40): operating under ${hardMutatorLabels.join(' + ')} earns +0.40 overall audit prestige.`);
    }
    if (faizaRescueApplied) {
      vijayVerdictLines.push(`Faiza PI charm rescue (+0.50): ${supShort} softens your tight ${preRescueTotal.toFixed(1)} audit score up to ${total.toFixed(1)}/10.`);
    }

    const weekTargetNote = weekNum > 1 ? ` (Week ${weekNum} threshold ${passThreshold.toFixed(1)})` : '';
    if (isArchie) {
      vijayVerdictLines.push(
        passed
          ? `Overall score: ${total.toFixed(1)} out of 10${weekTargetNote}. Proper tidy week in Baker bay, ${playerMeta.shortName} — grab a flat white or a pint at Gordon's.`
          : `Overall score: ${total.toFixed(1)} out of 10${weekTargetNote}. Reset over the weekend, balance those rotors to 0.01 g, and we will nail the controls next week.`
      );
    } else {
      vijayVerdictLines.push(
        passed
          ? `Overall score: ${total.toFixed(1)} out of 10${weekTargetNote}. Good week's graft — go enjoy a coffee or pint at Gordon's.`
          : `Overall score: ${total.toFixed(1)} out of 10${weekTargetNote}. Regroup, dry your glassware, and tighten the controls next week.`
      );
    }

    // KLBchat post-audit reactions (playable Big-Chuds strictly for Big-Chuds runs; Nafsika + Baker/Big-Chud reactions for Archie; zero emojis)
    const chudReactions = [];
    if (vijayCalloutLine) {
      const flawType = String(slideFlawedFig?.type || '').toLowerCase();
      const isNmrFlaw = flawType === 'nmr' || Boolean(slideFlawedFig?.hasSolventPeak);
      chudReactions.push({
        senderId: 'richard_spears',
        text: isArchie
          ? (isNmrFlaw
              ? `Oof, Jamie zooming right onto that 5.30 ppm peak on the projector! Always disclose flaws on Slide 4!!`
              : `Oof, Jamie zooming right onto that ${describeFigureFlaw(slideFlawedFig)} on the projector! Always disclose flaws on Slide 4!!`)
          : (isNmrFlaw
              ? `Oof, Vijay zooming 400% straight onto the 5.30 ppm peak on the projector! Always disclose flaws on Slide 4!!`
              : `Oof, Vijay zooming 400% straight onto that ${describeFigureFlaw(slideFlawedFig)} on the projector! Always disclose flaws on Slide 4!!`)
      });
    } else if (isArchie && slideFlawedFig && deck.honestDisclosure) {
      chudReactions.push({
        senderId: 'richard_spears',
        text: `Smart move disclosing that ${describeFigureFlaw(slideFlawedFig)} upfront on Slide 4 @${playerMeta.shortName} — Jamie always backs clean caveats over hiding peaks.`
      });
    } else if (richardPerkTriggered) {
      chudReactions.push({
        senderId: 'daniel_richards',
        text: `Classic Richard turning an impurity disclosure table into a Rigour masterclass.`
      });
    }

    if (!hasClicker && playerId === 'andre_shamsabadi') {
      chudReactions.push({
        senderId: 'maximillian_lee',
        text: `André forgetting his 3F laser clicker at Group Meeting yet again.`
      });
    }

    if (wrRounded < 50 || (isFinalPhase && msRounded < 50)) {
      chudReactions.push({
        senderId: 'peter_szijj',
        text: isArchie
          ? `Don't skip the 3F Write-Up Desk next week @${playerMeta.shortName} — Jamie always checks Thursday reports and Friday SI drafts!`
          : `Don't skip the 3F Write-Up Desk next week @${playerMeta.shortName} — Vijay always checks Thursday reports and Friday SI drafts!`
      });
    }

    if (!isFinalPhase) {
      if (isArchie) {
        if (passed) {
          chudReactions.push(
            {
              senderId: 'nafsika_forte',
              text: `${total.toFixed(1)}/10 on the morning slides @${playerMeta.shortName} — clean Baker-bay start, smash the last bench step & SI push before 18:00!`
            },
            {
              senderId: 'joao_nogueira',
              text: `Strong 09:45 Baker-bay update @${playerMeta.shortName} (${total.toFixed(1)}/10) — finish the final bench check cleanly before 18:00!`
            },
            {
              senderId: 'daniel_richards',
              text: `Solid morning HSA Cys34 slides for Jamie @${playerMeta.shortName} — keep those balanced-rotor spins tight for the 18:00 wrap.`
            }
          );
        } else {
          chudReactions.push(
            {
              senderId: 'nafsika_forte',
              text: `${total.toFixed(1)}/10 in the morning audit @${playerMeta.shortName} — plenty of time before 18:00, grab me in Lab 230 if you need spin-filter or HSA backup!`
            },
            {
              senderId: 'antoine_maruani',
              text: `Tough 09:00 grilling from Jamie @${playerMeta.shortName} (${total.toFixed(1)}/10) — use the afternoon to lock in 2 clean figures & finish the SI draft before 18:00.`
            },
            {
              senderId: 'daniel_richards',
              text: `Rough 09:00 start @${playerMeta.shortName}, but the day is young — knock out the remaining bench steps and 3F write-up before 18:00.`
            }
          );
        }
      } else if (passed) {
        chudReactions.push(
          {
            senderId: 'joao_nogueira',
            text: `${total.toFixed(1)}/10 at the 09:00 meeting @${playerMeta.shortName} — solid morning slides, smash the last bench step before 18:00!`
          },
          {
            senderId: 'calise_bahou',
            text: `Tidy morning update @${playerMeta.shortName} — finish the 18:00 manuscript push cleanly and we celebrate after!`
          }
        );
      } else {
        chudReactions.push(
          {
            senderId: 'antoine_maruani',
            text: `Tough 09:00 grilling @${playerMeta.shortName} (${total.toFixed(1)}/10) — plenty of bench hours before 18:00 to lock in clean data and hit 3F!`
          },
          {
            senderId: 'faiza_javaid',
            text: `Shake off the morning slides @${playerMeta.shortName} — grab two clean spectra and finish your 3F manuscript draft before 18:00.`
          }
        );
      }
    } else if (isArchie) {
      if (passed) {
        chudReactions.push(
          {
            senderId: 'nafsika_forte',
            text: `${total.toFixed(1)}/10 — brilliant Baker-bay shift @${playerMeta.shortName}!! Celebratory flat whites and pints at Gordon's Café right now!!`
          },
          {
            senderId: 'joao_nogueira',
            text: `${total.toFixed(1)}/10 — SMASHED Jamie's audit @${playerMeta.shortName}!! Baker and Big-Chuds uniting at Gordon's Café!!`
          },
          {
            senderId: 'daniel_richards',
            text: `Clean albumin-maleimide data for Jamie today @${playerMeta.shortName} — textbook Baker-bay balanced-rotor discipline!`
          }
        );
      } else {
        chudReactions.push(
          {
            senderId: 'nafsika_forte',
            text: `Rough audit today @${playerMeta.shortName} (${total.toFixed(1)}/10) — I am guarding Lab 230 till 19:15 all next week if you need late spin-filter rescues or a fresh Baker-bay hand!`
          },
          {
            senderId: 'antoine_maruani',
            text: `Tough grilling from Jamie today @${playerMeta.shortName} (${total.toFixed(1)}/10) — hit #AskAntoine early next run and lock in 2 clean spectra!`
          },
          {
            senderId: 'daniel_richards',
            text: `We have all survived a bruising Friday in Seminar Room @${playerMeta.shortName} — coffee at Gordon's first, then reset those HSA Cys34 controls Monday.`
          }
        );
      }
    } else if (passed) {
      chudReactions.push(
        {
          senderId: 'joao_nogueira',
          text: `${total.toFixed(1)}/10 — SMASHED IT @${playerMeta.shortName}!! Everyone to Gordon's Café right now!!`
        },
        {
          senderId: 'calise_bahou',
          text: `Bringing celebratory reduced bags of lemons to Gordon's!`
        }
      );
    } else {
      chudReactions.push(
        {
          senderId: 'antoine_maruani',
          text: `Rough grilling today @${playerMeta.shortName} (${total.toFixed(1)}/10) — hit #AskAntoine early next run and save 2 clean spectra!`
        },
        {
          senderId: 'faiza_javaid',
          text: `Chin up @${playerMeta.shortName}! First round at Gordon's is on us, we go again Monday.`
        }
      );
    }

    return {
      total,
      passed,
      cascadeIndex: activeCascadeIdx,
      campaignTitle: activeCamp?.title || '',
      passThreshold,
      mutatorBonus,
      faizaRescueApplied,
      faizaRescueBonus: faizaRescueApplied ? 0.50 : 0,
      phase,
      onTime,
      patienceDelta,
      supervisorId,
      supervisorName,
      patienceLabel,
      avgQuality,
      avgYield,
      presentedPerf,
      breakdown: {
        yieldScore,
        homogeneityScore,
        rigorScore,
        manuscriptScore,
        hygieneScore,
        citizenshipScore
      },
      breakdownReasons: {
        yieldScore: yieldReason,
        homogeneityScore: homogeneityReason,
        rigorScore: rigorReason,
        manuscriptScore: manuscriptReason,
        hygieneScore: hygieneReason,
        citizenshipScore: citizenshipReason
      },
      vijayVerdictLines,
      verdictLines: vijayVerdictLines,
      chudReactions: chudReactions.filter(r => (PLAYABLE_CHUD_IDS.has(r.senderId) || isArchie) && r.senderId !== playerId)
    };
  }

  window.KLB.SlideBuilder = {
    openDeckModal,
    evaluateFridayAudit
  };
})();
