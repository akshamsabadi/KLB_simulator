// KLB Simulator — Procedural Analytical Spectra/Gels, 5 Wet-Lab Minigames & 4-Slide Vijay Auditor
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
    return Math.max(lo, Math.min(hi, v));
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
  function renderToCanvas(canvas, rawItem) {
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

    // Smooth vector rendering for spectra & labels (override pixel-art rule on world canvas)
    canvas.style.imageRendering = 'auto';

    const w = canvas.width || 680;
    const h = canvas.height || 300;
    const ctx = canvas.getContext('2d');
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

  // -------------------- 1. UV 254 nm / KMnO4 SILICA TLC PLATE --------------------
  function drawTlcPlate(ctx, w, h, item, rng) {
    const compact = w < 440;
    const q = getQuality(item, 80);
    const poor = q < 78;
    const isKmno4 = /kmno4|permanganate|char/i.test(`${item.stain || ''} ${item.notes || ''}`) && !/uv/i.test(item.stain || '');

    // Dark Lab 230 UV Viewing Cabinet backdrop
    const bgGrad = ctx.createRadialGradient(w * 0.5, h * 0.15, 10, w * 0.5, h * 0.5, w * 0.7);
    bgGrad.addColorStop(0, isKmno4 ? '#1e1624' : '#16112b');
    bgGrad.addColorStop(1, '#070a12');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, w, h);

    // Subtle 254 nm UV tube glow along top of cabinet
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
    ctx.fillText(
      compact
        ? (isKmno4 ? 'KMnO4 Char TLC' : 'UV 254 nm TLC Plate')
        : (isKmno4 ? 'KMnO4 Dip + Heat-Gun Char' : 'CAMAG UV Cabinet • λ = 254 nm (Silica 60 F254)'),
      10,
      compact ? 14 : 18
    );
    drawTopMetaMetrics(ctx, w, item, compact, compact ? 14 : 18, compact ? 8 : 12);

    // Aluminium-backed Silica Plate centered
    const pw = Math.min(w * (compact ? 0.56 : 0.44), h * 0.95);
    const ph = compact ? h * 0.76 : h * 0.80;
    const px = Math.round((w - pw) * (compact ? 0.36 : 0.42));
    const py = compact ? Math.round(h * 0.17) : Math.round(h * 0.13);

    // Aluminium foil backing bevel
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(px - 2, py - 2, pw + 4, ph + 4);

    // Glowing F254 green phosphor OR KMnO4 permanganate purple-pink silica
    const plateGrad = ctx.createLinearGradient(px, py, px + pw, py + ph);
    if (isKmno4) {
      plateGrad.addColorStop(0, '#9d3b72');
      plateGrad.addColorStop(1, '#7e2a59');
    } else {
      plateGrad.addColorStop(0, '#9ef58a');
      plateGrad.addColorStop(0.5, '#86ef74');
      plateGrad.addColorStop(1, '#6fd95e');
    }
    ctx.fillStyle = plateGrad;
    ctx.fillRect(px, py, pw, ph);

    // Subtle silica grain speckles
    ctx.fillStyle = isKmno4 ? 'rgba(255,220,240,0.06)' : 'rgba(20,60,25,0.06)';
    for (let i = 0; i < 90; i++) {
      ctx.fillRect(px + rng() * pw, py + rng() * ph, 1.5, 1.5);
    }

    const frontY = py + ph * 0.14;
    const baseY = py + ph * 0.84;
    const runDist = baseY - frontY;

    // Pencil solvent front (dashed) & baseline (solid)
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

    // 3 Lanes: SM, Co, Rxn
    const lanes = [
      { lbl: 'SM', x: px + pw * 0.23 },
      { lbl: 'Co', x: px + pw * 0.50 },
      { lbl: 'Rxn', x: px + pw * 0.77 }
    ];

    // Extract Rf from productPeak if present (supports both 'Rf = 0.42' and 'Rf 0.42')
    const rfMatch = String(item.productPeak || '').match(/Rf\s*(?:=|\s)\s*(0\.\d+)/i);
    const prodRf = rfMatch ? clamp(parseFloat(rfMatch[1]), 0.35, 0.78) : 0.56;
    const smRf = clamp(prodRf - 0.32, 0.14, 0.32);

    function drawSpot(cx, rf, rx, ry, alpha, isCharYellow = false) {
      const cy = baseY - rf * runDist;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.scale(1, ry / Math.max(1, rx));
      const g = ctx.createRadialGradient(0, 0, rx * 0.1, 0, 0, rx);
      if (isKmno4 || isCharYellow) {
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

    // Pencil tick marks & labels
    ctx.fillStyle = isKmno4 ? '#f8fafc' : '#1e293b';
    ctx.font = `bold ${compact ? 10 : 11}px Consolas, monospace`;
    ctx.textAlign = 'center';
    lanes.forEach(ln => {
      ctx.beginPath();
      ctx.moveTo(ln.x, baseY - 3);
      ctx.lineTo(ln.x, baseY + 3);
      ctx.stroke();
      ctx.fillText(ln.lbl, ln.x, baseY + (compact ? 13 : 16));
    });

    const rSpot = Math.max(7, pw * 0.075);
    // SM lane: Starting Material only
    drawSpot(lanes[0].x, smRf, rSpot, rSpot * 0.78, 0.90);
    drawSpot(lanes[0].x, 0.0, rSpot * 0.45, rSpot * 0.35, 0.28);

    // Co-spot lane: SM + Product cleanly separated
    drawSpot(lanes[1].x, smRf, rSpot * 0.85, rSpot * 0.7, 0.78);
    drawSpot(lanes[1].x, prodRf, rSpot * 0.85, rSpot * 0.7, 0.82);
    drawSpot(lanes[1].x, 0.0, rSpot * 0.5, rSpot * 0.4, 0.32);

    // Rxn lane: Product + optional streaking/unreacted SM/baseline gunk when quality < 78
    if (poor) {
      // Vertical silica tailing streak
      const streakTop = baseY - prodRf * runDist;
      const sg = ctx.createLinearGradient(0, streakTop, 0, baseY);
      sg.addColorStop(0, isKmno4 ? 'rgba(250,204,21,0.35)' : 'rgba(67,20,110,0.38)');
      sg.addColorStop(1, isKmno4 ? 'rgba(180,83,9,0.55)' : 'rgba(46,16,101,0.55)');
      ctx.fillStyle = sg;
      ctx.fillRect(lanes[2].x - rSpot * 0.45, streakTop, rSpot * 0.9, baseY - streakTop);

      // Heavy baseline gunk + unreacted SM + high-Rf side product
      drawSpot(lanes[2].x, 0.0, rSpot * 1.05, rSpot * 0.62, 0.88);
      drawSpot(lanes[2].x, smRf, rSpot * 0.88, rSpot * 0.72, 0.76);
      drawSpot(lanes[2].x, Math.min(0.88, prodRf + 0.22), rSpot * 0.65, rSpot * 0.48, 0.62);
      drawSpot(lanes[2].x, prodRf, rSpot * 0.95, rSpot * 0.82, 0.80);
    } else {
      drawSpot(lanes[2].x, 0.0, rSpot * 0.42, rSpot * 0.32, 0.22);
      drawSpot(lanes[2].x, prodRf, rSpot * 1.08, rSpot * 0.82, 0.94);
    }

    // Right-hand callout tags (Rf annotations)
    ctx.textAlign = 'left';
    const tagX = px + pw + 10;
    const prodY = baseY - prodRf * runDist;
    const smY = baseY - smRf * runDist;

    ctx.strokeStyle = '#4ade80';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(px + pw - 3, prodY);
    ctx.lineTo(tagX - 3, prodY);
    ctx.stroke();
    ctx.fillStyle = '#86efac';
    ctx.font = `bold ${compact ? 9.5 : 11.5}px Consolas, monospace`;
    ctx.fillText(`Product Rf = ${prodRf.toFixed(2)}`, tagX, prodY + 4);

    ctx.strokeStyle = poor ? '#f87171' : '#94a3b8';
    ctx.beginPath();
    ctx.moveTo(px + pw - 3, smY);
    ctx.lineTo(tagX - 3, smY);
    ctx.stroke();
    ctx.fillStyle = poor ? '#fca5a5' : '#cbd5e1';
    ctx.fillText(poor ? `Unreacted SM Rf = ${smRf.toFixed(2)}!` : `SM Ref Rf = ${smRf.toFixed(2)}`, tagX, smY + 4);

    ctx.fillStyle = '#94a3b8';
    ctx.font = `${compact ? 9 : 10.5}px Consolas, monospace`;
    ctx.fillText('Solvent Front', tagX, frontY + 4);
    if (poor) {
      drawVectorWarning(ctx, tagX + 4, baseY, compact ? 3.8 : 4.3, '#f87171', '#070a12');
      ctx.fillStyle = '#fca5a5';
      ctx.fillText('Baseline Tailing / Gunk', tagX + 12, baseY + 4);
    } else {
      ctx.fillText('Clean Origin Baseline', tagX, baseY + 4);
    }
  }

  // -------------------- 2. COOMASSIE ("BLUE PARTY MIX") SDS-PAGE GEL --------------------
  function drawSdsPageGel(ctx, w, h, item, rng) {
    const compact = w < 440;
    const q = getQuality(item, 82);
    const overRed = Boolean(item.hasOverReduction) || q < 78;
    const blueMishap = Boolean(item.hasBlueDyeMishap);

    // Bright white LED transilluminator lightbox frame
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, w, h);

    const lx = compact ? 10 : 18;
    const ly = compact ? 22 : 28;
    const lw = w - lx * 2;
    const lh = h - ly - (compact ? 10 : 14);

    // Backlit white transilluminator glass
    const lightGrad = ctx.createLinearGradient(lx, ly, lx, ly + lh);
    lightGrad.addColorStop(0, '#f1f5f9');
    lightGrad.addColorStop(1, '#dbeafe');
    ctx.fillStyle = lightGrad;
    ctx.beginPath();
    ctx.roundRect ? ctx.roundRect(lx, ly, lw, lh, 8) : ctx.rect(lx, ly, lw, lh);
    ctx.fill();

    // Top banner
    ctx.fillStyle = '#93c5fd';
    ctx.font = `bold ${compact ? 9.5 : 11.5}px Consolas, monospace`;
    ctx.textAlign = 'left';
    ctx.fillText(
      compact ? 'SDS-PAGE (Coomassie)' : '4–15% Mini-PROTEAN SDS-PAGE • Coomassie Stain',
      lx,
      compact ? 14 : 18
    );
    drawTopMetaMetrics(ctx, w, item, compact, compact ? 14 : 18, compact ? 10 : 18);

    // Translucent Coomassie-tinted polyacrylamide slab
    const gx = lx + (compact ? 48 : 74);
    const gy = ly + 8;
    const gw = lw - (compact ? 128 : 210);
    const gh = lh - 16;

    const gelGrad = ctx.createLinearGradient(gx, gy, gx + gw, gy + gh);
    gelGrad.addColorStop(0, 'rgba(96, 165, 250, 0.32)');
    gelGrad.addColorStop(0.5, 'rgba(59, 130, 246, 0.25)');
    gelGrad.addColorStop(1, 'rgba(37, 99, 235, 0.36)');
    ctx.fillStyle = gelGrad;
    ctx.strokeStyle = 'rgba(30, 64, 175, 0.45)';
    ctx.lineWidth = 1.5;
    ctx.fillRect(gx, gy, gw, gh);
    ctx.strokeRect(gx, gy, gw, gh);

    // 4 Comb Wells at top: Ladder | Ctrl mAb | Reduced | Product
    const laneNames = ['Ladder', 'Ctrl mAb', 'Reduced', 'Product'];
    const laneW = gw / 4;
    const wellTop = gy + 4;
    const wellBottom = gy + (compact ? 15 : 20);

    ctx.font = `bold ${compact ? 9 : 11}px Segoe UI, sans-serif`;
    ctx.textAlign = 'center';
    laneNames.forEach((name, idx) => {
      const wx = gx + idx * laneW + laneW * 0.16;
      const ww = laneW * 0.68;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.68)';
      ctx.fillRect(wx, wellTop, ww, wellBottom - wellTop);
      ctx.strokeStyle = 'rgba(30, 58, 138, 0.4)';
      ctx.strokeRect(wx, wellTop, ww, wellBottom - wellTop);

      ctx.fillStyle = '#1e3a8a';
      ctx.fillText(name, gx + (idx + 0.5) * laneW, wellBottom + (compact ? 10 : 13));
    });

    // Logarithmic migration mapping for 250 -> 10 kDa
    const bandTop = wellBottom + (compact ? 16 : 22);
    const bandSpan = gh - (bandTop - gy) - 10;
    const mwToY = kda => {
      const logMax = Math.log10(265);
      const logMin = Math.log10(9.5);
      const frac = (logMax - Math.log10(kda)) / (logMax - logMin);
      return bandTop + clamp(frac, 0.02, 0.98) * bandSpan;
    };

    function drawGelBand(laneIdx, kda, intensity, thickness = 4.5, colorOverride = null) {
      const cx = gx + (laneIdx + 0.5) * laneW;
      const bw = laneW * 0.58;
      const y = mwToY(kda);
      const th = compact ? thickness * 0.78 : thickness;

      ctx.save();
      const g = ctx.createLinearGradient(cx - bw / 2, y - th / 2, cx - bw / 2, y + th / 2);
      const col = colorOverride || '23, 37, 84'; // Deep Coomassie Navy-Indigo
      g.addColorStop(0, `rgba(${col}, 0.08)`);
      g.addColorStop(0.3, `rgba(${col}, ${intensity})`);
      g.addColorStop(0.7, `rgba(${col}, ${intensity})`);
      g.addColorStop(1, `rgba(${col}, 0.08)`);
      ctx.fillStyle = g;

      // Slight smiling meniscus curve like a real SDS-PAGE band
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

    // 10-band Precision Plus Dual Color MW Ladder (250, 150, 100, 75, 50, 37, 25, 20, 15, 10 kDa)
    const ladderBands = [
      { kda: 250, pink: true, showLbl: true },
      { kda: 150, pink: false, showLbl: true },
      { kda: 100, pink: false, showLbl: true },
      { kda: 75,  pink: true, showLbl: true },
      { kda: 50,  pink: false, showLbl: true },
      { kda: 37,  pink: false, showLbl: true },
      { kda: 25,  pink: true, showLbl: true },
      { kda: 20,  pink: false, showLbl: false },
      { kda: 15,  pink: false, showLbl: true },
      { kda: 10,  pink: false, showLbl: false }
    ];

    ctx.font = `bold ${compact ? 8.5 : 10}px Consolas, monospace`;
    ctx.textAlign = 'right';
    ladderBands.forEach(b => {
      const y = drawGelBand(0, b.kda, 0.85, 3.6, b.pink ? '157, 23, 77' : '30, 58, 138');
      if (b.showLbl) {
        ctx.fillStyle = b.pink ? '#9d174d' : '#1e293b';
        ctx.fillText(`${b.kda} kDa`, gx - 5, y + 3);
      }
    });

    // Lane 1 (index 1): Unreduced Ctrl mAb -> crisp 150 kDa intact IgG (HHLL)
    drawGelBand(1, 150, 0.94, 6.2);
    drawGelBand(1, 75, 0.12, 3.0);

    // Lane 2 (index 2): TCEP Reduced Control -> 50 kDa Heavy (H) + 25 kDa Light (L)
    drawGelBand(2, 50, 0.90, 5.8);
    drawGelBand(2, 25, 0.82, 4.8);
    drawGelBand(2, 75, 0.18, 3.2);

    // Lane 3 (index 3): Product Sample Lane
    if (blueMishap) {
      // Peter's catastrophic LDS blue loading-dye smear down the entire lane!
      const sx = gx + 3 * laneW + laneW * 0.14;
      const sw = laneW * 0.72;
      const smear = ctx.createLinearGradient(sx, wellTop, sx, gy + gh - 4);
      smear.addColorStop(0, 'rgba(2, 132, 199, 0.88)');
      smear.addColorStop(0.55, 'rgba(14, 165, 233, 0.65)');
      smear.addColorStop(1, 'rgba(3, 105, 161, 0.92)');
      ctx.fillStyle = smear;
      ctx.fillRect(sx, wellTop + 2, sw, gy + gh - wellTop - 8);
    }

    if (overRed) {
      // Incomplete rebridging / unbuffered 37 °C TCEP fragmentation: weak 150 kDa + strong 75 kDa HL, 50 kDa H, 25 kDa L!
      drawGelBand(3, 150, 0.45, 5.0);
      drawGelBand(3, 75,  0.88, 5.8, '185, 28, 28');
      drawGelBand(3, 50,  0.66, 4.6);
      drawGelBand(3, 25,  0.58, 4.2);
    } else {
      // Clean >90–95% rebridged 150 kDa HHLL intact antibody!
      drawGelBand(3, 150, 0.96, 6.8);
      drawGelBand(3, 75,  0.14 + (100 - q) * 0.005, 3.0);
    }

    // Right margin callouts
    const rx = gx + gw + 8;
    ctx.textAlign = 'left';
    ctx.font = `bold ${compact ? 9 : 11}px Consolas, monospace`;

    const y150 = mwToY(150);
    if (overRed) {
      ctx.fillStyle = '#334155';
      ctx.fillText('150 kDa HHLL (Weak)', rx, y150 + 3);
    } else {
      drawVectorCheck(ctx, rx + 4, y150 - 1, compact ? 3.8 : 4.5, '#15803d');
      ctx.fillStyle = '#15803d';
      ctx.fillText('150 kDa Rebridged HHLL', rx + 12, y150 + 3);
    }

    const y75 = mwToY(75);
    if (overRed) {
      drawVectorWarning(ctx, rx + 4, y75 - 1, compact ? 3.8 : 4.3, '#dc2626', '#ffffff');
      ctx.fillStyle = '#dc2626';
      ctx.fillText('75 kDa HL Half-mAb!', rx + 12, y75 + 3);
      drawVectorWarning(ctx, rx + 4, mwToY(50) - 1, compact ? 3.8 : 4.3, '#dc2626', '#ffffff');
      ctx.fillText('50 H / 25 L Fragments', rx + 12, mwToY(50) + 3);
    } else {
      ctx.fillStyle = '#475569';
      ctx.fillText('50 kDa (H) [Red. Ctrl]', rx, mwToY(50) + 3);
      ctx.fillText('25 kDa (L) [Red. Ctrl]', rx, mwToY(25) + 3);
    }

    if (blueMishap) {
      drawVectorWarning(ctx, rx + 4, gy + gh - 16, compact ? 3.8 : 4.3, '#0369a1', '#ffffff');
      ctx.fillStyle = '#0369a1';
      ctx.fillText('Blue LDS Dye Spill!', rx + 12, gy + gh - 12);
    }
  }

  // -------------------- 3. BRUKER TOPSPIN 1H NMR SPECTRUM --------------------
  function drawBrukerNmr(ctx, w, h, item, rng) {
    const compact = w < 440;
    const q = getQuality(item, 85);
    const hasSolvent = Boolean(item.hasSolventPeak) || q < 78;
    const useDmso = /dmso|hydrogel|peg|sm|folate|peptide/i.test(`${item.label} ${item.notes}`);

    // Crisp Bruker TopSpin dark-slate scientific theme
    ctx.fillStyle = '#090f1d';
    ctx.fillRect(0, 0, w, h);

    // TopSpin window title strip
    ctx.fillStyle = '#13203b';
    ctx.fillRect(0, 0, w, compact ? 20 : 26);
    ctx.fillStyle = '#93c5fd';
    ctx.font = `bold ${compact ? 9.5 : 11.5}px Consolas, monospace`;
    ctx.textAlign = 'left';
    ctx.fillText(
      compact
        ? `1H NMR (${useDmso ? 'DMSO-d6' : 'CDCl3'})`
        : `Bruker Neo 600 MHz • 1H NMR (${useDmso ? 'DMSO-d6' : 'CDCl3'}, 298 K)`,
      10,
      compact ? 13 : 17
    );
    drawTopMetaMetrics(ctx, w, item, compact, compact ? 13 : 17, compact ? 8 : 10);

    const padL = 18;
    const padR = 18;
    const padB = compact ? 28 : 36;
    const baseY = h - padB;
    const plotTop = compact ? 30 : 40;
    const plotH = baseY - plotTop;
    const plotW = w - padL - padR;

    // Axis mapping: 10.5 ppm (left) -> -0.5 ppm (right)
    const ppmMax = 10.5;
    const ppmMin = -0.5;
    const ppmToX = ppm => padL + ((ppmMax - ppm) / (ppmMax - ppmMin)) * plotW;
    const xToPpm = px => ppmMax - ((px - padL) / plotW) * (ppmMax - ppmMin);

    // Subtle vertical chemical shift grid
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.11)';
    ctx.lineWidth = 1;
    for (let p = 10; p >= 0; p--) {
      const gx = ppmToX(p);
      ctx.beginPath();
      ctx.moveTo(gx, plotTop);
      ctx.lineTo(gx, baseY);
      ctx.stroke();
    }

    // Multiplet definitions: { ppm, amp, widthPpm, split: [rel Intensities], jPpm, isSolventFlaw, isRef, integralH }
    const peaks = [
      // Aromatic pyridazinedione / aryl multiplets (7.1 - 8.4 ppm)
      { ppm: 8.18 + (rng() - 0.5) * 0.12, amp: 0.48, w: 0.011, split: [1, 1], j: 0.022, intH: '2.00H' },
      { ppm: 7.66 + (rng() - 0.5) * 0.12, amp: 0.42, w: 0.012, split: [1, 2, 1], j: 0.020, intH: '2.01H' },
      { ppm: 7.38 + (rng() - 0.5) * 0.08, amp: 0.38, w: 0.011, split: [1, 1], j: 0.021, intH: '2.03H' },
      // Aliphatic / linker multiplets (1.2 - 4.6 ppm)
      { ppm: 4.38 + (rng() - 0.5) * 0.10, amp: 0.44, w: 0.012, split: [1, 2, 1], j: 0.022, intH: '2.00H' },
      { ppm: 3.66 + (rng() - 0.5) * 0.08, amp: 0.56, w: 0.014, split: [1, 3, 3, 1], j: 0.018, intH: '4.04H' },
      { ppm: 2.86 + (rng() - 0.5) * 0.08, amp: 0.40, w: 0.012, split: [1, 2, 1], j: 0.020, intH: '2.02H' },
      { ppm: 1.44 + (rng() - 0.5) * 0.06, amp: 0.62, w: 0.011, split: [1], j: 0, intH: '3.01H' },
      // TMS at 0.00 ppm
      { ppm: 0.00, amp: 0.16, w: 0.009, split: [1], j: 0, isRef: true }
    ];

    // Deuterated NMR reference solvent peak (CDCl3 7.26 or DMSO-d6 2.50)
    if (useDmso) {
      peaks.push({ ppm: 2.50, amp: 0.34, w: 0.010, split: [1, 2, 3, 2, 1], j: 0.008, isRef: true, refLbl: 'DMSO-d6 2.50' });
    } else {
      peaks.push({ ppm: 7.26, amp: 0.36, w: 0.009, split: [1], j: 0, isRef: true, refLbl: 'CDCl3 7.26' });
    }

    // Residual workup/column solvent spikes if hasSolventPeak or quality < 78!
    if (hasSolvent) {
      // Towering 5.30 ppm DCM singlet + trace EtOAc quartet/singlet/triplet (4.12 / 2.04 / 1.26 ppm)
      peaks.push({ ppm: 5.30, amp: 0.96, w: 0.009, split: [1], j: 0, isFlaw: true, flawLbl: '5.30 ppm (DCM!)' });
      peaks.push({ ppm: 4.12, amp: 0.42, w: 0.010, split: [1, 3, 3, 1], j: 0.018, isFlaw: true, flawLbl: '4.12 (EtOAc)' });
      peaks.push({ ppm: 2.04, amp: 0.68, w: 0.009, split: [1], j: 0, isFlaw: true, flawLbl: '2.04 (EtOAc)' });
      peaks.push({ ppm: 1.26, amp: 0.46, w: 0.010, split: [1, 2, 1], j: 0.018, isFlaw: true });
    }

    // Evaluate Lorentzian spectrum across pixel columns
    const cleanVals = new Float32Array(plotW + 1);
    const flawVals = new Float32Array(plotW + 1);

    for (let i = 0; i <= plotW; i++) {
      const ppm = xToPpm(padL + i);
      let vClean = (rng() - 0.5) * (q < 78 ? 0.022 : 0.009);
      let vFlaw = 0;

      for (const pk of peaks) {
        const nLines = pk.split.length;
        const maxRel = Math.max(...pk.split);
        for (let k = 0; k < nLines; k++) {
          const linePpm = pk.ppm + (k - (nLines - 1) / 2) * pk.j;
          const d = (ppm - linePpm) / pk.w;
          const lor = (pk.amp * (pk.split[k] / maxRel)) / (1 + d * d);
          if (pk.isFlaw) vFlaw += lor;
          else vClean += lor;
        }
      }
      cleanVals[i] = vClean;
      flawVals[i] = vFlaw;
    }

    // 1) Draw green integration step-curves above product multiplets
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

    // 2) Draw main cyan/blue Bruker 1H trace
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

    // 3) Draw red-flagged residual solvent trace on top if present!
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

      // Bold red callout tag right on 5.30 ppm DCM!
      const dcmX = ppmToX(5.30);
      const dcmTopY = Math.max(plotTop - 4, baseY - 0.92 * plotH * 0.90);
      ctx.fillStyle = 'rgba(185, 28, 28, 0.92)';
      const boxW = compact ? 132 : 178;
      const boxH = compact ? 18 : 22;
      ctx.fillRect(dcmX + 6, dcmTopY, boxW, boxH);
      ctx.strokeStyle = '#fca5a5';
      ctx.strokeRect(dcmX + 6, dcmTopY, boxW, boxH);
      drawVectorWarning(ctx, dcmX + 15, dcmTopY + boxH / 2, compact ? 3.5 : 4.2, '#fde047', '#7f1d1d');
      ctx.fillStyle = '#ffffff';
      ctx.font = `bold ${compact ? 8.5 : 10.5}px Consolas, monospace`;
      ctx.textAlign = 'left';
      ctx.fillText(compact ? '5.30 DCM + EtOAc!' : '5.30 ppm DCM + EtOAc!', dcmX + 23, dcmTopY + (compact ? 12 : 15));
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
    for (let p = 10; p >= 0; p--) {
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

    // Parse center mass from item.productPeak if possible
    const rawPeakStr = String(item.productPeak || '148420 Da');
    const cleanNumStr = rawPeakStr.replace(/,/g, '');
    const massMatches = [...cleanNumStr.matchAll(/(\d{3,6}(?:\.\d+)?)/g)];
    let centerMass = 148420;
    if (massMatches.length > 0) {
      centerMass = parseFloat(massMatches[0][1]);
    } else if (/small|pd|sm|linker|phenazepam|m\/z/i.test(`${item.label} ${rawPeakStr}`)) {
      centerMass = 548.1;
    }

    const isProtein = centerMass >= 2500;
    const spanLeft = isProtein ? 220 : 90;
    const spanRight = isProtein ? 340 : 280;
    const mMin = centerMass - spanLeft;
    const mMax = centerMass + spanRight;

    ctx.fillStyle = '#090e1a';
    ctx.fillRect(0, 0, w, h);

    // Waters MassLynx / Agilent MassHunter header
    ctx.fillStyle = '#16213a';
    ctx.fillRect(0, 0, w, compact ? 20 : 26);
    ctx.fillStyle = '#c4b5fd';
    ctx.font = `bold ${compact ? 9.5 : 11.5}px Consolas, monospace`;
    ctx.textAlign = 'left';
    ctx.fillText(
      compact
        ? (isProtein ? 'Q-TOF MaxEnt1 MS' : 'UPLC ESI-HRMS')
        : (isProtein
          ? 'CIB LG11 • Q-TOF / MaxEnt1 Deconvoluted MS'
          : 'CIB LG11 • Waters UPLC–Xevo ESI-HRMS'),
      10,
      compact ? 13 : 17
    );
    drawTopMetaMetrics(ctx, w, item, compact, compact ? 13 : 17, compact ? 8 : 10);

    const padL = compact ? 34 : 46;
    const padR = 18;
    const padB = compact ? 28 : 36;
    const plotTop = compact ? 34 : 46;
    const baseY = h - padB;
    const plotW = w - padL - padR;
    const plotH = baseY - plotTop;

    const mToX = m => padL + ((m - mMin) / (mMax - mMin)) * plotW;
    const xToM = px => mMin + ((px - padL) / plotW) * (mMax - mMin);

    // Axes
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(padL, plotTop - 6);
    ctx.lineTo(padL, baseY);
    ctx.lineTo(w - padR, baseY);
    ctx.stroke();

    // Y-axis % labels
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

    // Mass peaks: main product at 100%, minor Na+/H2O satellites, plus +69 Da adduct & +44 Da PEG comb if flawed!
    const widthDa = isProtein ? 6.5 : 1.3;
    const msPeaks = [
      { m: centerMass, amp: 1.0, w: widthDa, isFlaw: false },
      { m: centerMass + 18, amp: 0.08, w: widthDa * 0.85, isFlaw: false },
      { m: centerMass - (isProtein ? 148 : 36), amp: hasAdduct ? 0.22 : 0.05, w: widthDa, isFlaw: hasAdduct }
    ];

    if (hasAdduct) {
      // Signature +69 Da adduct spike + periodic +44 Da PEG contamination comb (+44, +88, +132, +176, +220 Da)
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

    // Draw clean main product envelope (violet-cyan fill + stroke)
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

    // Draw +69 Da adduct & +44 Da PEG comb in red/amber if present!
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

      const addX = mToX(centerMass + 69);
      const addY = baseY - 0.56 * plotH * 0.86;
      drawVectorWarning(ctx, addX - 2, addY - 10, compact ? 3.4 : 4.1, '#f87171', '#090e1a');
      ctx.fillStyle = '#fca5a5';
      ctx.font = `bold ${compact ? 8.5 : 10.5}px Consolas, monospace`;
      ctx.textAlign = 'left';
      ctx.fillText('+69 Da Adduct!', addX + 6, addY - 7);
      const pegX = mToX(centerMass + 88);
      const pegY = baseY - 0.36 * plotH * 0.86 - 16;
      drawVectorWarning(ctx, pegX + 4, pegY - 3, compact ? 3.4 : 4.1, '#fbbf24', '#090e1a');
      ctx.fillStyle = '#fbbf24';
      ctx.fillText('+44 Da PEG Comb (+44/+88/+132)', pegX + 12, pegY);
    }

    // Main Product Peak Label
    const mainX = mToX(centerMass);
    const mainY = baseY - plotH * 0.86;
    ctx.fillStyle = '#86efac';
    ctx.font = `bold ${compact ? 9.5 : 11.5}px Consolas, monospace`;
    ctx.textAlign = 'center';
    const shortPeak = rawPeakStr.length > 32 ? rawPeakStr.slice(0, 30) + '…' : rawPeakStr;
    const lblX = clamp(mainX, padL + 85, w - padR - 85);
    const lblW = ctx.measureText(shortPeak).width;
    drawVectorDiamond(ctx, lblX - lblW / 2 - 8, mainY - 11, compact ? 3.4 : 4.0, '#86efac');
    ctx.fillText(shortPeak, lblX, mainY - 8);

    // X-axis ticks (Da / m/z)
    ctx.fillStyle = '#cbd5e1';
    ctx.font = `${compact ? 8.5 : 10}px Consolas, monospace`;
    const tickCount = 5;
    for (let t = 0; t <= tickCount; t++) {
      const mVal = mMin + (t / tickCount) * (mMax - mMin);
      const tx = mToX(mVal);
      ctx.beginPath();
      ctx.moveTo(tx, baseY);
      ctx.lineTo(tx, baseY + 5);
      ctx.strokeStyle = '#64748b';
      ctx.stroke();
      ctx.fillText(isProtein ? Math.round(mVal).toLocaleString() : mVal.toFixed(0), tx, baseY + (compact ? 15 : 17));
    }
    ctx.fillStyle = '#94a3b8';
    ctx.textAlign = 'right';
    ctx.fillText(isProtein ? 'Deconvoluted Mass (Da)' : 'm/z (Da)', w - padR, baseY + (compact ? 25 : 29));
  }

  window.KLB.Spectra = {
    renderToCanvas
  };

  // =========================================================================
  // B. 5 WET-LAB & CORRIDOR MICRO-MINIGAMES (window.KLB.Minigames)
  // =========================================================================
  (() => {
    let activeCleanup = null;

    function normalizeMinigameType(rawType) {
      const t = String(rawType || 'biotage').toLowerCase();
      if (t.includes('biotage') || t.includes('column') || t.includes('uv')) return 'biotage';
      if (t.includes('gel') || t.includes('pipet') || t.includes('well')) return 'gel_load';
      if (t.includes('syringe') || t.includes('cryo') || t.includes('fridge') || t.includes('cold') || t.includes('78')) return 'syringe_cryo';
      if (t.includes('lemon') || t.includes('flask') || t.includes('calise')) return 'lemons';
      if (t.includes('alex') || t.includes('stealth') || t.includes('1718')) return 'alex_stealth';
      return 'biotage';
    }

    function openModal(rawType, mountEl, config, onFinish) {
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
          durationSec: 9.5
        },
        syringe_cryo: {
          icon: 'snowflake',
          badge: 'SYRINGE PUMP CONTROL',
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
        alex_stealth: {
          icon: 'compass',
          badge: 'CORRIDOR EVASION',
          defaultTitle: 'Corridor Decoy Evasion',
          controls: 'Move with [WASD/Arrows] or [Mouse] to the green exit; avoid her vision cone and the 3F stairs.',
          durationSec: 10.0
        }
      };

      const meta = metaByType[type];
      const modalTitle = String(config.title || meta.defaultTitle);
      const modalSubtitle = String(config.subtitle || meta.defaultSubtitle || '');
      mountEl.innerHTML = `
      <div style="display:flex;flex-direction:column;gap:10px;">
        <header style="display:flex;justify-content:space-between;align-items:center;gap:12px;">
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
          </div>
        </header>

        <section style="background:#070b14;border:1px solid #334155;border-radius:10px;padding:8px;position:relative;display:flex;justify-content:center;box-shadow:0 8px 24px rgba(2,6,23,0.6), inset 0 1px 0 rgba(148,163,184,0.08);">
          <canvas id="mg-canvas" width="680" height="310" style="width:100%;max-width:680px;height:auto;border-radius:6px;cursor:crosshair;"></canvas>
          <div id="mg-finish-banner" style="display:none;position:absolute;inset:12px;background:rgba(9,14,26,0.90);border:1px solid #4b6394;border-radius:8px;flex-direction:column;align-items:center;justify-content:center;gap:8px;text-align:center;padding:16px;box-shadow:0 16px 36px rgba(2,6,23,0.78), inset 0 1px 0 rgba(148,163,184,0.12);">
            <h3 id="mg-finish-title" style="margin:0;display:inline-flex;align-items:center;gap:8px;font-size:20px;font-weight:600;color:#86efac;"></h3>
            <div id="mg-finish-sub" style="font-size:13px;color:#e2e8f0;max-width:480px;"></div>
            <button id="mg-finish-btn" class="rpg-btn primary" style="margin-top:4px;padding:7px 18px;font-size:13px;font-weight:500;">Continue [Space / Click]</button>
          </div>
        </section>

        <section style="display:flex;align-items:center;justify-content:center;gap:8px;font-size:12px;color:#cbd5e1;background:#111c33;border:1px solid #2e3d5e;border-radius:8px;padding:7px 11px;text-align:center;font-family:Consolas,monospace;box-shadow:0 4px 12px rgba(2,6,23,0.45), inset 0 1px 0 rgba(148,163,184,0.06);">
          ${iconSvg('gamepad-2', 15)}
          <span>${meta.controls}</span>
        </section>
      </div>
    `;

      const canvas = mountEl.querySelector('#mg-canvas');
      canvas.style.imageRendering = 'auto';
      const ctx = canvas.getContext('2d');
      const scoreEl = mountEl.querySelector('#mg-live-score');
      const timerEl = mountEl.querySelector('#mg-live-timer');
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
        mouseX: 340,
        mouseY: 155,
        hasMouseMoved: false,
        justPressedAction: false
      };

      let finished = false;
      let closed = false;
      let rafId = null;
      let autoCloseTimer = null;
      let finalPayload = null;

      function isCanvasDetached() {
        if (startedConnected && canvas.isConnected === false) return true;
        if (typeof mountEl.contains === 'function' && !mountEl.contains(canvas)) return true;
        return false;
      }

      function updatePointerCoords(e) {
        const rect = canvas.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          input.mouseX = clamp(((e.clientX - rect.left) / rect.width) * canvas.width, 0, canvas.width);
          input.mouseY = clamp(((e.clientY - rect.top) / rect.height) * canvas.height, 0, canvas.height);
          input.hasMouseMoved = true;
        }
      }

      function onKeyDown(e) {
        if (closed) return;
        if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
          e.preventDefault();
        }
        if (finished) {
          if (e.code === 'Space' || e.code === 'Enter') finalizeAndExit();
          return;
        }
        if (!input.keys.has(e.code) && (e.code === 'Space' || e.code === 'Enter' || e.code === 'KeyE')) {
          input.justPressedAction = true;
        }
        input.keys.add(e.code);
      }

      function onKeyUp(e) {
        if (closed) return;
        input.keys.delete(e.code);
      }

      function onMouseDown(e) {
        if (closed || e.button !== 0) return;
        updatePointerCoords(e);
        input.mouseDown = true;
        input.justPressedAction = true;
      }

      function onMouseMove(e) {
        if (closed) return;
        updatePointerCoords(e);
      }

      function onMouseUp() {
        if (closed) return;
        input.mouseDown = false;
      }

      window.addEventListener('keydown', onKeyDown);
      window.addEventListener('keyup', onKeyUp);
      canvas.addEventListener('mousedown', onMouseDown);
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);

      function cleanupListeners() {
        if (closed) return;
        closed = true;
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
        canvas.removeEventListener('mousedown', onMouseDown);
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);
        if (finishBtn) finishBtn.onclick = null;
        if (type === 'alex_stealth' && window.KLB.Audio?.setRoomAmbience) {
          window.KLB.Audio.setRoomAmbience({ alexPursuitOn: false });
        }
        if (activeCleanup === cleanupListeners) {
          activeCleanup = null;
        }
      }

      activeCleanup = cleanupListeners;

      function finalizeAndExit() {
        if (closed) return;
        cleanupListeners();
        if (onFinish) {
          onFinish(finalPayload || { score: 80, summary: 'Bench protocol complete.' });
        }
      }

      function triggerComplete(score, summary) {
        if (finished || closed) return;
        finished = true;
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
        finishBtn.onclick = finalizeAndExit;

        // Auto-advance cleanly after 1.15s if player doesn't click earlier (guarded against modal abort/detach)
        autoCloseTimer = setTimeout(() => {
          autoCloseTimer = null;
          if (closed || isCanvasDetached()) {
            cleanupListeners();
            return;
          }
          finalizeAndExit();
        }, 1150);
      }

      // Instantiate specific wet-lab runner
      const runner = createMinigameRunner(type, canvas.width, canvas.height, meta.durationSec, config);
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
          const holding = input.mouseDown || input.keys.has('Space');
          const stepState = runner.update(dt, elapsed, input, holding);
          input.justPressedAction = false;

          runner.render(ctx);
          scoreEl.textContent = `Score: ${clamp(Math.round(stepState.liveScore), 0, 100)}%`;
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
      if (typeof activeCleanup === 'function') {
        const fn = activeCleanup;
        activeCleanup = null;
        fn();
      }
      return { aborted: true };
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
      const history = []; // { t, uv, isProd, collected }

      function uvProfile(t) {
        // Early forerun impurity (1.1 - 2.2s), Main Product UV peak (3.1 - 6.3s), late tailing gunk (7.1 - 8.1s)
        const forerun = 0.48 * Math.exp(-0.5 * Math.pow((t - 1.55) / 0.34, 2));
        const mainProd = 0.94 * Math.exp(-0.5 * Math.pow((t - 4.65) / 0.78, 2));
        const tailGunk = 0.38 * Math.exp(-0.5 * Math.pow((t - 7.45) / 0.36, 2));
        const base = 0.04 + 0.01 * Math.sin(t * 9);
        const uv = clamp(base + forerun + mainProd + tailGunk, 0, 1);
        const isProd = t >= 3.35 && t <= 5.95 && mainProd >= 0.24;
        return { uv, isProd, mainProd, impurity: forerun + tailGunk };
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

          history.push({ t: elapsed, uv: p.uv, isProd: p.isProd, collected: holding });
          const recovery = prodTotal > 0.05 ? (prodCaptured / prodTotal) : 0.85;
          const liveScore = clamp(recovery * 100 - junkCaptured * 42 + 8, 10, 100);
          return { liveScore, done: false };
        },
        render(ctx) {
          ctx.fillStyle = '#08101e';
          ctx.fillRect(0, 0, W, H);

          const gx = 48, gy = 26, gw = W - 68, gh = H - 84;
          ctx.strokeStyle = '#334155';
          ctx.strokeRect(gx, gy, gw, gh);

          // Shaded guidance regions (Forerun, Main Product Window, Baseline Gunk)
          const tToX = t => gx + (t / totalSec) * gw;
          ctx.fillStyle = 'rgba(239, 68, 68, 0.09)';
          ctx.fillRect(tToX(0.9), gy, tToX(2.25) - tToX(0.9), gh);
          ctx.fillRect(tToX(6.85), gy, tToX(8.2) - tToX(6.85), gh);

          ctx.fillStyle = 'rgba(34, 197, 94, 0.11)';
          ctx.fillRect(tToX(3.35), gy, tToX(5.95) - tToX(3.35), gh);

          ctx.font = 'bold 10.5px Consolas, monospace';
          drawVectorWarning(ctx, tToX(1.05) + 4, gy + 11, 3.8, '#fca5a5', '#08101e');
          ctx.fillStyle = '#fca5a5';
          ctx.fillText('FORERUN', tToX(1.05) + 12, gy + 15);
          drawVectorWarning(ctx, tToX(6.92) + 4, gy + 11, 3.8, '#fca5a5', '#08101e');
          ctx.fillText('TAIL GUNK', tToX(6.92) + 12, gy + 15);
          drawVectorDiamond(ctx, tToX(3.48) + 4, gy + 11, 4.0, '#86efac');
          ctx.fillStyle = '#86efac';
          ctx.fillText('MAIN PRODUCT PEAK (HOLD COLLECT!)', tToX(3.48) + 12, gy + 15);

          // Threshold dashed line (240 mAU)
          const threshY = gy + gh * (1 - 0.25);
          ctx.setLineDash([5, 4]);
          ctx.strokeStyle = '#a855f7';
          ctx.beginPath();
          ctx.moveTo(gx, threshY);
          ctx.lineTo(gx + gw, threshY);
          ctx.stroke();
          ctx.setLineDash([]);
          ctx.fillStyle = '#c4b5fd';
          ctx.fillText('Threshold', gx + 6, threshY - 5);

          // Faint preview of full chromatogram Ghost + live colored elution fill
          ctx.strokeStyle = 'rgba(148, 163, 184, 0.18)';
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          for (let i = 0; i <= 140; i++) {
            const t = (i / 140) * totalSec;
            const x = tToX(t);
            const y = gy + gh * (1 - uvProfile(t).uv * 0.9);
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.stroke();

          // Collected fraction highlight bars
          for (let i = 1; i < history.length; i++) {
            const prev = history[i - 1];
            const cur = history[i];
            if (cur.collected) {
              const x1 = tToX(prev.t);
              const x2 = tToX(cur.t) + 1;
              const y = gy + gh * (1 - cur.uv * 0.9);
              ctx.fillStyle = cur.isProd ? 'rgba(34, 197, 94, 0.42)' : 'rgba(239, 68, 68, 0.45)';
              ctx.fillRect(x1, y, Math.max(1.5, x2 - x1), gy + gh - y);
            }
          }

          // Live 254 nm UV trace
          if (history.length > 1) {
            ctx.strokeStyle = '#38bdf8';
            ctx.lineWidth = 2.4;
            ctx.beginPath();
            history.forEach((pt, idx) => {
              const x = tToX(pt.t);
              const y = gy + gh * (1 - pt.uv * 0.9);
              if (idx === 0) ctx.moveTo(x, y);
              else ctx.lineTo(x, y);
            });
            ctx.stroke();

            const head = history[history.length - 1];
            const hx = tToX(head.t);
            const hy = gy + gh * (1 - head.uv * 0.9);
            ctx.fillStyle = head.collected ? (head.isProd ? '#4ade80' : '#ef4444') : '#f8fafc';
            ctx.beginPath();
            ctx.arc(hx, hy, 5, 0, Math.PI * 2);
            ctx.fill();

            // Valve indicator badge at bottom
            const valveY = gy + gh + 14;
            ctx.fillStyle = head.collected ? (head.isProd ? '#15803d' : '#b91c1c') : '#1e293b';
            ctx.fillRect(gx, valveY, gw, 34);
            ctx.strokeStyle = head.collected ? (head.isProd ? '#86efac' : '#fca5a5') : '#475569';
            ctx.strokeRect(gx, valveY, gw, 34);
            // Status LED vector circle inside valve bar
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
                : 'VALVE: DIVERTING TO SOLVENT WASTE (Hold SPACE / Mouse on Product Peak)',
              gx + gw / 2 + 8,
              valveY + 22
            );
            ctx.textAlign = 'left';
          }
        },
        finish() {
          const rec = prodTotal > 0 ? clamp(prodCaptured / prodTotal, 0, 1) : 0;
          const score = clamp(Math.round(rec * 96 + 6 - junkCaptured * 44), 15, 100);
          return {
            score,
            summary: `Captured ${Math.round(rec * 100)}% of the 254 nm product peak${junkCaptured > 0.25 ? ' with minor co-eluted forerun/tail fractions.' : ' cleanly into Tubes 4–7 with zero baseline gunk!'}`
          };
        }
      };
    }

    // -------------------- 2. SDS-PAGE MICROPIPETTE STEADY-HAND --------------------
    if (type === 'gel_load') {
      const wells = [0, 1, 2, 3].map(i => ({
        idx: i,
        label: ['Well 1 (Ctrl)', 'Well 2 (Red.)', 'Well 3 (Crude)', 'Well 4 (Prod)'][i],
        cx: 130 + i * 140,
        halfW: 22,
        filled: false,
        punctured: false,
        score: 0
      }));
      let currentWell = 0;
      let baseX = wells[0].cx;
      let tipX = baseX;
      let dipAnim = 0;

      return {
        update(dt, elapsed, input) {
          if (input.hasMouseMoved) {
            baseX += (input.mouseX - baseX) * Math.min(1, dt * 14);
          }
          const moveDir = (input.keys.has('KeyD') || input.keys.has('ArrowRight') ? 1 : 0)
                        - (input.keys.has('KeyA') || input.keys.has('ArrowLeft') ? 1 : 0);
          if (moveDir !== 0) {
            input.hasMouseMoved = false;
            baseX = clamp(baseX + moveDir * 270 * dt, 60, W - 60);
          }

          // Natural P20 pipette hand micro-tremor
          const tremor = Math.sin(elapsed * 11.5) * 7.5 + Math.cos(elapsed * 19.3) * 4.2;
          tipX = clamp(baseX + tremor, 45, W - 45);
          if (dipAnim > 0) dipAnim = Math.max(0, dipAnim - dt * 4);

          if (input.justPressedAction && currentWell < wells.length) {
            const w = wells[currentWell];
            const err = Math.abs(tipX - w.cx);
            dipAnim = 1.0;
            w.filled = true;
            if (err <= w.halfW * 0.65) {
              w.score = 100 - Math.round((err / w.halfW) * 18);
              playSfxSafe('pipette');
            } else if (err <= w.halfW * 1.18) {
              w.score = 68;
              w.punctured = true;
              playSfxSafe('warning');
            } else {
              w.score = 26;
              w.punctured = true;
              playSfxSafe('error');
            }
            currentWell++;
            if (currentWell < wells.length && !input.hasMouseMoved) {
              baseX = wells[currentWell].cx - 28;
            }
          }

          const loaded = wells.filter(w => w.filled);
          const avg = loaded.length ? loaded.reduce((s, w) => s + w.score, 0) / loaded.length : 85;
          return { liveScore: avg, done: currentWell >= wells.length && dipAnim <= 0.1 };
        },
        render(ctx) {
          // Tris-Glycine running buffer tank
          const tankGrad = ctx.createLinearGradient(0, 0, 0, H);
          tankGrad.addColorStop(0, '#0b192c');
          tankGrad.addColorStop(0.35, '#123052');
          tankGrad.addColorStop(1, '#0e223d');
          ctx.fillStyle = tankGrad;
          ctx.fillRect(0, 0, W, H);

          // Buffer meniscus shimmer
          ctx.strokeStyle = 'rgba(125, 211, 252, 0.45)';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(0, 74);
          ctx.lineTo(W, 74);
          ctx.stroke();

          // Polyacrylamide gel slab with 4 carved comb wells
          const gelTop = 128;
          const wellBottom = 212;
          ctx.fillStyle = 'rgba(191, 219, 254, 0.22)';
          ctx.fillRect(36, gelTop, W - 72, H - gelTop - 16);

          wells.forEach((w, idx) => {
            const isTarget = idx === currentWell;
            // Carve well opening
            ctx.fillStyle = '#0c2340';
            ctx.fillRect(w.cx - w.halfW, gelTop, w.halfW * 2, wellBottom - gelTop);

            ctx.strokeStyle = isTarget ? '#4ade80' : (w.punctured ? '#f87171' : 'rgba(147, 197, 253, 0.6)');
            ctx.lineWidth = isTarget ? 2.5 : 1.5;
            ctx.strokeRect(w.cx - w.halfW, gelTop, w.halfW * 2, wellBottom - gelTop);

            // Center sweet-spot target tick
            if (isTarget) {
              ctx.fillStyle = 'rgba(74, 222, 128, 0.25)';
              ctx.fillRect(w.cx - 8, wellBottom - 18, 16, 18);
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

          // Draw P20 Micropipette Tip + Blue Sample Glycerol Plug
          const tipBottomY = 114 + dipAnim * 82;
          ctx.fillStyle = '#e2e8f0';
          ctx.beginPath();
          ctx.moveTo(tipX - 11, 14);
          ctx.lineTo(tipX + 11, 14);
          ctx.lineTo(tipX + 3.2, tipBottomY);
          ctx.lineTo(tipX - 3.2, tipBottomY);
          ctx.closePath();
          ctx.fill();

          // Blue LDS sample plug inside tip
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
      const isCryoContext = /-78|cryo|dry[- ]?ice|acetone/i.test(`${cryoTitle} ${cryoSubtitle}`);
      let marker = 0.5;
      let vel = 0;
      let bandCenter = 0.52;
      const bandHalf = 0.16;
      let inZoneTime = 0;
      let totalTime = 0;

      return {
        update(dt, elapsed, _input, holding) {
          totalTime += dt;
          // Moving target band representing addition / thermal fluctuations
          bandCenter = 0.5 + 0.24 * Math.sin(elapsed * 1.55) + 0.10 * Math.cos(elapsed * 3.1);
          const accel = holding ? 1.55 : -1.35;
          vel = clamp(vel * Math.pow(0.18, dt) + accel * dt, -0.95, 0.95);
          marker = clamp(marker + vel * dt, 0.04, 0.96);

          const dist = Math.abs(marker - bandCenter);
          if (dist <= bandHalf) {
            inZoneTime += dt;
          } else if (dist <= bandHalf * 1.45) {
            inZoneTime += dt * 0.45;
          }
          const liveScore = clamp((inZoneTime / Math.max(0.15, totalTime)) * 104, 15, 100);
          return { liveScore, done: false };
        },
        render(ctx) {
          ctx.fillStyle = '#08111f';
          ctx.fillRect(0, 0, W, H);

          // Left panel: Parameterized Syringe Pump / Reaction Context Readout
          ctx.fillStyle = '#111e36';
          ctx.strokeStyle = '#334155';
          ctx.lineWidth = 1.5;
          ctx.fillRect(24, 24, 308, H - 48);
          ctx.strokeRect(24, 24, 308, H - 48);

          const inBand = Math.abs(marker - bandCenter) <= bandHalf;
          const tempReadout = (-78 + (marker - bandCenter) * 38).toFixed(1);
          const rateReadout = (5.7 + (marker - bandCenter) * 3.4).toFixed(2);
          const zoneStability = clamp(Math.round((1 - Math.abs(marker - bandCenter) / 0.5) * 100), 0, 100);

          ctx.textAlign = 'left';
          ctx.fillStyle = '#93c5fd';
          ctx.font = 'bold 11.5px Consolas, monospace';
          const titleLines = drawWrappedCanvasText(ctx, cryoTitle, 36, 46, 284, 15, 2);

          ctx.fillStyle = '#cbd5e1';
          ctx.font = '10px Consolas, monospace';
          const subY = 46 + titleLines * 15 + 3;
          const subLines = drawWrappedCanvasText(ctx, cryoSubtitle, 36, subY, 284, 14, 2);

          const metricY = Math.max(106, subY + subLines * 14 + 14);
          ctx.fillStyle = inBand ? '#4ade80' : '#f87171';
          ctx.font = 'bold 22px Consolas, monospace';
          ctx.fillText(`${rateReadout} µL/min`, 36, metricY);

          ctx.fillStyle = inBand ? '#38bdf8' : '#fbbf24';
          ctx.font = 'bold 16px Consolas, monospace';
          ctx.fillText(
            isCryoContext ? `Bath: ${tempReadout} °C` : `Stability: ${zoneStability}%`,
            36,
            metricY + 26
          );

          // Reaction vessel / reservoir illustration
          const vesselY = metricY + 42;
          const vesselH = Math.max(46, 256 - vesselY);
          ctx.fillStyle = inBand ? 'rgba(56, 189, 248, 0.28)' : 'rgba(239, 68, 68, 0.32)';
          ctx.fillRect(72, vesselY, 200, vesselH);
          ctx.strokeStyle = '#94a3b8';
          ctx.strokeRect(72, vesselY, 200, vesselH);

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

          // Right panel: Vertical Target Zone Control Column
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

          // Player marker bar
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

    // -------------------- 4. CALISE'S FLYING SAINSBURY'S LEMONS & FLASKS --------------------
    if (type === 'lemons') {
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
        update(dt, _elapsed, input) {
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

          // Vector legend indicators + clean counts
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
              // Spilled silica gel hazard cloud
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

          // Blue KLB Winchester / Bottle Carrier Tray
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
            summary: `Caught ${flasksCaught} round-bottom flasks & ${lemonsCaught} lucky Sainsbury's lemons (${silicaHits} silica cloud hit${silicaHits === 1 ? '' : 's'}).`
          };
        }
      };
    }

    // -------------------- 5. 17:18 CORRIDOR EVASION (ALEX KING) --------------------
    const player = { x: 64, y: 165, r: 12 };
    const alex = { x: 355, y: 155, angle: Math.PI, sweepDir: 1, coneLen: 175, coneHalf: 0.44 };
    const stairs3F = { x: 255, y: 10, w: 150, h: 42 };
    const cibExit = { x: W - 122, y: H - 86, w: 104, h: 68 };
    const pillars = [
      { x: 175, y: 88, w: 46, h: 52 },
      { x: 195, y: 198, w: 54, h: 48 },
      { x: 455, y: 84, w: 48, h: 56 }
    ];
    let exposure = 0;
    let outcome = null; // 'escaped' | 'caught' | 'led_3f'

    function rectContainsCircle(rx, ry, rw, rh, cx, cy, cr) {
      const nx = clamp(cx, rx, rx + rw);
      const ny = clamp(cy, ry, ry + rh);
      return Math.hypot(cx - nx, cy - ny) < cr;
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

        const speed = 185;
        const nx = clamp(player.x + vx * speed * dt, 24, W - 24);
        const ny = clamp(player.y + vy * speed * dt, 24, H - 24);
        if (!pillars.some(p => rectContainsCircle(p.x, p.y, p.w, p.h, nx, player.y, player.r))) player.x = nx;
        if (!pillars.some(p => rectContainsCircle(p.x, p.y, p.w, p.h, player.x, ny, player.r))) player.y = ny;

        // Alex King patrols corridor & sweeps green-eyed vision cone
        alex.x = 345 + Math.sin(elapsed * 1.35) * 68;
        alex.y = 152 + Math.cos(elapsed * 1.9) * 44;
        alex.angle = Math.PI + Math.sin(elapsed * 2.35) * 1.25;

        // Check forbidden 3F stairs!
        if (rectContainsCircle(stairs3F.x, stairs3F.y, stairs3F.w, stairs3F.h, player.x, player.y, player.r)) {
          outcome = 'led_3f';
          return { liveScore: 15, done: true };
        }

        // Check CIB Walk-to-NMR Decoy Exit!
        if (rectContainsCircle(cibExit.x, cibExit.y, cibExit.w, cibExit.h, player.x, player.y, player.r)) {
          outcome = 'escaped';
          const fastBonus = Math.round(clamp((totalSec - elapsed) * 1.5, 0, 12));
          return { liveScore: clamp(90 + fastBonus - exposure * 25, 75, 100), done: true };
        }

        // Vision cone check (blocked by corridor pillars!)
        const dx = player.x - alex.x;
        const dy = player.y - alex.y;
        const dist = Math.hypot(dx, dy);
        let angDiff = Math.atan2(dy, dx) - alex.angle;
        while (angDiff > Math.PI) angDiff -= Math.PI * 2;
        while (angDiff < -Math.PI) angDiff += Math.PI * 2;

        let inCone = dist < alex.coneLen && Math.abs(angDiff) < alex.coneHalf;
        if (inCone) {
          // Simple ray sample check for pillar occlusion
          for (let s = 0.25; s <= 0.85; s += 0.2) {
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

        // Subtle corridor floor grid
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.08)';
        for (let x = 0; x < W; x += 34) {
          ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
        }
        for (let y = 0; y < H; y += 34) {
          ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
        }

        // Forbidden 3F Spiral Stairs zone (top center)
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

        // CIB Walk-to-NMR Decoy Exit (bottom right)
        ctx.fillStyle = 'rgba(34, 197, 94, 0.24)';
        ctx.fillRect(cibExit.x, cibExit.y, cibExit.w, cibExit.h);
        ctx.strokeStyle = '#4ade80';
        ctx.strokeRect(cibExit.x, cibExit.y, cibExit.w, cibExit.h);
        drawVectorCheck(ctx, cibExit.x + 16, cibExit.y + 24, 5, '#86efac');
        ctx.fillStyle = '#86efac';
        ctx.fillText('CIB DECOY', cibExit.x + cibExit.w / 2 + 7, cibExit.y + 28);
        ctx.fillText('"Walk to NMR"', cibExit.x + cibExit.w / 2, cibExit.y + 45);

        // Corridor lockers/pillars (provide stealth cover!)
        pillars.forEach(p => {
          ctx.fillStyle = '#1e293b';
          ctx.fillRect(p.x, p.y, p.w, p.h);
          ctx.strokeStyle = '#475569';
          ctx.strokeRect(p.x, p.y, p.w, p.h);
        });

        // Alex King's emerald-green vision cone
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

        // Alex King sprite token (wavy brunette hair + bright green eyes)
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

        ctx.fillStyle = '#bbf7d0';
        ctx.font = 'bold 10.5px Segoe UI, sans-serif';
        ctx.fillText('"Are you going for drinks?"', alex.x, alex.y - 20);

        // Player researcher token
        ctx.fillStyle = '#3b82f6';
        ctx.beginPath();
        ctx.arc(player.x, player.y, player.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 9.5px Consolas, monospace';
        ctx.fillText('YOU', player.x, player.y + 3);
        ctx.textAlign = 'left';
      },
      finish() {
        if (outcome === 'escaped') {
          return { score: 96, summary: 'Cleanly executed the CIB "Walk-to-NMR" corridor decoy without revealing the 3rd-Floor Office!' };
        }
        if (outcome === 'led_3f') {
          return { score: 15, summary: 'Disaster! You ran toward the 3rd-Floor Spiral Stairs with Alex King right behind you!' };
        }
        if (outcome === 'caught') {
          return { score: 26, summary: 'Caught inside Alex King’s 17:18 green-eyed vision cone ("So where is everyone going for drinks?!").' };
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

  function describeFigureFlaw(fig) {
    if (!fig) return '';
    const q = Number(fig.quality);
    const lowQ = Number.isFinite(q) && q < 78;
    const t = String(fig.type || '').toLowerCase();
    if (fig.hasSolventPeak || (t === 'nmr' && lowQ)) return '5.30 ppm residual DCM / EtOAc peaks';
    if (fig.hasBlueDyeMishap) return 'blue LDS loading-dye spillover smear';
    if (fig.hasOverReduction || (t === 'gel' && lowQ)) return '75 kDa HL over-reduction bands';
    if (fig.hasAdduct || (t === 'lcms' && lowQ)) return '+69 Da adduct & +44 Da PEG comb';
    if (lowQ) return 'unreacted starting material / baseline streaking';
    return '';
  }

  function openDeckModal(mountEl, gameState, onSaveDeck) {
    if (!mountEl || !gameState) return;

    const labBook = Array.isArray(gameState.labBook) ? gameState.labBook : [];
    const cur = gameState.slideDeck || {};

    // Pick smart distinct defaults from labBook if not yet chosen
    let fig1Id = labBook.some(f => f.id === cur.fig1Id) ? cur.fig1Id : (labBook[0]?.id || null);
    let fig2Id = labBook.some(f => f.id === cur.fig2Id && f.id !== fig1Id)
      ? cur.fig2Id
      : (labBook.find(f => f.id !== fig1Id)?.id || labBook[0]?.id || null);

    const draft = {
      framing: cur.framing || 'mechanistic',
      fig1Id,
      fig2Id,
      honestDisclosure: cur.honestDisclosure !== undefined ? Boolean(cur.honestDisclosure) : true
    };

    const playerMeta = window.KLB.CAST_BY_ID?.[gameState.player?.id] || { name: 'Researcher', shortName: 'Chud' };
    const campTitle = window.KLB.CAMPAIGNS?.[gameState.player?.id]?.title || 'Chudasama Group Weekly Update';
    const isRichard = gameState.player?.id === 'richard_spears';
    const missingClicker = gameState.player?.id === 'andre_shamsabadi' && !gameState.prep?.has_clicker;
    const weeklyReportPct = clamp(Math.round(Number(gameState.weeklyReportProgress) || 0), 0, 100);
    const manuscriptPct = clamp(Math.round(Number(gameState.manuscriptProgress) || 0), 0, 100);
    const labCond = Number(gameState.labCondition != null ? gameState.labCondition : (gameState.safety ?? 85));
    const labCondPct = Number.isFinite(labCond) ? clamp(Math.round(labCond), 0, 100) : 85;

    function renderModalUI() {
      const fig1 = labBook.find(f => f.id === draft.fig1Id) || null;
      const fig2 = labBook.find(f => f.id === draft.fig2Id) || null;
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

      const cardStyle = 'background:#10192d;border:1px solid #334155;border-radius:10px;padding:11px 12px;display:flex;flex-direction:column;gap:7px;box-shadow:0 6px 18px rgba(2,6,23,0.48), inset 0 1px 0 rgba(148,163,184,0.08);';
      const cardHeadingStyle = 'margin:0;display:flex;align-items:center;gap:6px;font-size:11px;font-weight:600;color:#93c5fd;letter-spacing:0.35px;text-transform:uppercase;';
      const previewBoxStyle = 'background:#070a12;border:1px solid #1e293b;border-radius:7px;padding:4px;display:flex;flex-direction:column;justify-content:center;align-items:center;gap:4px;min-height:142px;box-shadow:inset 0 2px 8px rgba(0,0,0,0.45);';
      const selectStyle = 'width:100%;padding:6px 8px;background:#090d16;color:#f8fafc;border:1px solid #475569;border-radius:6px;font-size:11.5px;box-shadow:inset 0 1px 3px rgba(0,0,0,0.4);';

      mountEl.innerHTML = `
        <div style="display:flex;flex-direction:column;gap:12px;">
          <header style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #2e3d5e;padding-bottom:9px;">
            <div>
              <div style="display:inline-flex;align-items:center;gap:6px;font-size:11px;font-weight:600;color:#60a5fa;letter-spacing:0.4px;text-transform:uppercase;">
                ${iconSvg('presentation', 14)}
                <span>Friday 09:00 • 4-Slide Deck Builder</span>
              </div>
              <h3 style="margin:3px 0 0 0;font-size:18px;font-weight:600;color:#f8fafc;">${escHtml(campTitle)} — ${escHtml(playerMeta.name)}</h3>
            </div>
            <button id="sb-cancel-top" class="hud-pill" style="display:inline-flex;align-items:center;gap:5px;font-weight:500;">${iconSvg('x', 13)}<span>Cancel</span></button>
          </header>

          <div style="display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;background:#0b1324;border:1px solid #263554;border-radius:8px;padding:7px 11px;font-size:11.5px;color:#94a3b8;">
            <span style="display:inline-flex;align-items:center;gap:5px;">
              ${iconSvg('file-text', 13)}
              <span>Weekly Report:</span>
              <span style="font-weight:600;color:${weeklyReportPct >= 85 ? '#86efac' : weeklyReportPct >= 50 ? '#93c5fd' : '#fde68a'};">${weeklyReportPct}%</span>
              <span style="color:#64748b;">(Due Thu 18:00)</span>
            </span>
            <span style="display:inline-flex;align-items:center;gap:5px;">
              ${iconSvg('pen-tool', 13)}
              <span>Manuscript Draft:</span>
              <span style="font-weight:600;color:${manuscriptPct >= 85 ? '#86efac' : manuscriptPct >= 50 ? '#93c5fd' : '#fde68a'};">${manuscriptPct}%</span>
              <span style="color:#64748b;">(Due Fri 18:00)</span>
            </span>
            <span style="display:inline-flex;align-items:center;gap:5px;">
              ${iconSvg('shield-check', 13)}
              <span>Lab Condition:</span>
              <span style="font-weight:600;color:${labCondPct >= 70 ? '#86efac' : labCondPct >= 40 ? '#93c5fd' : '#fca5a5'};">${labCondPct}%</span>
              <span style="color:#64748b;">(Min 40%)</span>
            </span>
          </div>

          ${missingClicker ? `
            <section style="display:flex;align-items:center;gap:9px;background:rgba(245,158,11,0.12);border:1px solid rgba(245,158,11,0.55);border-radius:8px;padding:8px 12px;font-size:12px;color:#fde68a;box-shadow:0 4px 12px rgba(2,6,23,0.42), inset 0 1px 0 rgba(253,230,138,0.1);">
              ${iconSvg('alert-circle', 15)}
              <span><span style="font-weight:600;color:#fef3c7;">Clicker Missing:</span> Grab your laser clicker from the KLB 3F Write-Up Desk.</span>
            </section>
          ` : ''}

          <!-- 2x2 4-Slide Widescreen Deck Grid -->
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">

            <!-- SLIDE 1: PROJECT AIM & FRAMING -->
            <section style="${cardStyle}">
              <h4 style="${cardHeadingStyle}">${iconSvg('compass', 13)}<span>SLIDE 1 • PROJECT AIM &amp; FRAMING</span></h4>
              <label style="display:flex;gap:7px;align-items:flex-start;font-size:11.5px;cursor:pointer;padding:6px;border-radius:6px;border:1px solid ${draft.framing === 'mechanistic' ? 'rgba(59,130,246,0.55)' : 'transparent'};background:${draft.framing === 'mechanistic' ? 'rgba(59,130,246,0.16)' : 'transparent'};">
                <input type="radio" name="sb-framing" value="mechanistic" ${draft.framing === 'mechanistic' ? 'checked' : ''} />
                <span><span style="font-weight:600;color:#f1f5f9;">Mechanistic &amp; Concise</span> — Stoichiometries, pH &amp; controls (reliable baseline)</span>
              </label>
              <label style="display:flex;gap:7px;align-items:flex-start;font-size:11.5px;cursor:pointer;padding:6px;border-radius:6px;border:1px solid ${draft.framing === 'bold' ? 'rgba(59,130,246,0.55)' : 'transparent'};background:${draft.framing === 'bold' ? 'rgba(59,130,246,0.16)' : 'transparent'};">
                <input type="radio" name="sb-framing" value="bold" ${draft.framing === 'bold' ? 'checked' : ''} />
                <span><span style="font-weight:600;color:#f1f5f9;">Bold Therapeutic Pitch</span> — High-impact claim (+bonus at ≥82% purity, risk if weak)</span>
              </label>
              <label style="display:flex;gap:7px;align-items:flex-start;font-size:11.5px;cursor:pointer;padding:6px;border-radius:6px;border:1px solid ${draft.framing === 'humble' ? 'rgba(59,130,246,0.55)' : 'transparent'};background:${draft.framing === 'humble' ? 'rgba(59,130,246,0.16)' : 'transparent'};">
                <input type="radio" name="sb-framing" value="humble" ${draft.framing === 'humble' ? 'checked' : ''} />
                <span><span style="font-weight:600;color:#f1f5f9;">Humble Preliminary Update</span> — Conservative framing for unfinished steps</span>
              </label>
            </section>

            <!-- SLIDE 4: CONCLUSIONS & SCIENTIFIC HONESTY -->
            <section style="${cardStyle}">
              <h4 style="${cardHeadingStyle}">${iconSvg('shield-check', 13)}<span>SLIDE 4 • CONCLUSIONS &amp; HONESTY</span></h4>
              <label style="display:flex;gap:7px;align-items:flex-start;font-size:11.5px;cursor:pointer;padding:6px;border-radius:6px;border:1px solid ${draft.honestDisclosure ? 'rgba(34,197,94,0.65)' : 'transparent'};background:${draft.honestDisclosure ? 'rgba(34,197,94,0.12)' : 'transparent'};box-shadow:${draft.honestDisclosure ? 'inset 0 1px 0 rgba(134,239,172,0.1)' : 'none'};">
                <input type="radio" name="sb-honesty" value="honest" ${draft.honestDisclosure ? 'checked' : ''} />
                <span><span style="font-weight:600;color:#f1f5f9;">Disclose Flaws Rigorously</span> — Flag residual peaks/adducts honestly (+0.65 Rigor${isRichard ? ', +0.55 Richard perk' : ''}).</span>
              </label>
              <label style="display:flex;gap:7px;align-items:flex-start;font-size:11.5px;cursor:pointer;padding:6px;border-radius:6px;border:1px solid ${!draft.honestDisclosure ? 'rgba(245,158,11,0.65)' : 'transparent'};background:${!draft.honestDisclosure ? 'rgba(245,158,11,0.12)' : 'transparent'};box-shadow:${!draft.honestDisclosure ? 'inset 0 1px 0 rgba(253,230,138,0.1)' : 'none'};">
                <input type="radio" name="sb-honesty" value="gamble" ${!draft.honestDisclosure ? 'checked' : ''} />
                <span><span style="font-weight:600;color:#f1f5f9;">Present As Clean</span> — <span style="display:inline-flex;align-items:center;gap:4px;color:${anyFlaw ? '#fca5a5' : '#94a3b8'};">${anyFlaw ? `${iconSvg('alert-triangle', 12)}<span>Risk: visible figure flaws (-1.5 Vijay callout).</span>` : `${iconSvg('check-circle', 12)}<span>Selected figures look clean.</span>`}</span></span>
              </label>
            </section>

            <!-- SLIDE 2: SYNTHETIC / BIOCONJUGATION PREP FIGURE -->
            <section style="${cardStyle}">
              <h4 style="${cardHeadingStyle}">${iconSvg('flask-conical', 13)}<span>SLIDE 2 • SYNTHETIC / PREP FIGURE</span></h4>
              <select id="sb-fig1" style="${selectStyle}">
                ${makeOptions(draft.fig1Id)}
              </select>
              <div style="${previewBoxStyle}">
                ${fig1
                  ? `<canvas id="sb-cv-1" width="340" height="145" style="width:100%;height:auto;"></canvas>
                     <div style="width:100%;display:flex;justify-content:space-between;align-items:center;gap:8px;padding:2px 4px;font-size:10.5px;color:#94a3b8;font-family:Consolas,monospace;">
                       <span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${escHtml(fig1.productPeak || fig1.label)}</span>
                       <span style="flex-shrink:0;font-weight:600;color:${hasSpectrumFlaw(fig1) ? '#fca5a5' : '#86efac'};">${formatFigureMetrics(fig1)}</span>
                     </div>`
                  : `<span style="font-size:11.5px;color:#64748b;">Collect a TLC / NMR / Gel in Lab 230 for Slide 2</span>`}
              </div>
            </section>

            <!-- SLIDE 3: CHARACTERISATION & PURITY PROOF -->
            <section style="${cardStyle}">
              <div style="display:flex;justify-content:space-between;align-items:center;">
                <h4 style="${cardHeadingStyle}">${iconSvg('activity', 13)}<span>SLIDE 3 • CHARACTERISATION PROOF</span></h4>
                ${fig1 && fig2 && !distinctPair ? `<span style="display:inline-flex;align-items:center;gap:4px;font-size:10px;color:#fca5a5;font-weight:600;">${iconSvg('alert-triangle', 12)}<span>Duplicate Figure</span></span>` : ''}
              </div>
              <select id="sb-fig2" style="${selectStyle}">
                ${makeOptions(draft.fig2Id)}
              </select>
              <div style="${previewBoxStyle}">
                ${fig2
                  ? `<canvas id="sb-cv-2" width="340" height="145" style="width:100%;height:auto;"></canvas>
                     <div style="width:100%;display:flex;justify-content:space-between;align-items:center;gap:8px;padding:2px 4px;font-size:10.5px;color:#94a3b8;font-family:Consolas,monospace;">
                       <span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${escHtml(fig2.productPeak || fig2.label)}</span>
                       <span style="flex-shrink:0;font-weight:600;color:${hasSpectrumFlaw(fig2) ? '#fca5a5' : '#86efac'};">${formatFigureMetrics(fig2)}</span>
                     </div>`
                  : `<span style="font-size:11.5px;color:#64748b;">Collect a 2nd distinct Gel / LC-MS / NMR for Slide 3</span>`}
              </div>
            </section>
          </div>

          <footer style="display:flex;justify-content:space-between;align-items:center;gap:10px;padding-top:4px;flex-wrap:wrap;">
            <div style="display:flex;align-items:center;gap:14px;flex-wrap:wrap;font-size:11.5px;color:#94a3b8;">
              <span style="display:inline-flex;align-items:center;gap:5px;">
                ${iconSvg(distinctPair ? 'check-circle' : 'alert-circle', 13)}
                <span>Deck Status:</span>
                <span style="font-weight:600;color:${distinctPair ? '#86efac' : '#fde68a'};">${distinctPair ? '4/4 Slides Ready (2 Distinct Raw Figures)' : `${labBook.length}/2 Distinct Figures Available`}</span>
              </span>
            </div>
            <div style="display:flex;gap:8px;">
              <button id="sb-cancel-btn" class="rpg-btn" style="font-weight:500;">Cancel</button>
              <button id="sb-save-btn" class="rpg-btn primary" style="display:inline-flex;align-items:center;gap:6px;padding:7px 16px;font-weight:500;">${iconSvg('check', 14)}<span>Save 4-Slide Deck</span></button>
            </div>
          </footer>
        </div>
      `;

      // Render live spectra previews onto Slide 2 & Slide 3 canvases!
      if (fig1 && mountEl.querySelector('#sb-cv-1')) {
        renderToCanvas(mountEl.querySelector('#sb-cv-1'), fig1);
      }
      if (fig2 && mountEl.querySelector('#sb-cv-2')) {
        renderToCanvas(mountEl.querySelector('#sb-cv-2'), fig2);
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
    }

    renderModalUI();
  }

  // -------------------- SOLO VIJAY 0.0-10.0 FRIDAY SCORE-CARD AUDITOR --------------------
  function evaluateFridayAudit(gameState) {
    const state = gameState || {};
    const playerId = state.player?.id || 'daniel_richards';
    const playerMeta = window.KLB.CAST_BY_ID?.[playerId] || { name: 'Researcher', shortName: 'Chud' };
    const totalSteps = window.KLB.CAMPAIGNS?.[playerId]?.steps?.length || 5;
    const doneSteps = Array.isArray(state.completedSteps) ? state.completedSteps.length : 0;
    const labBook = Array.isArray(state.labBook) ? state.labBook : [];
    const deck = state.slideDeck || { ready: false, framing: 'mechanistic', fig1Id: null, fig2Id: null, honestDisclosure: true };

    // Resolve Slide 2 & Slide 3 figures (if player forgot to open SlideBuilder, inspect what's in labBook at a hygiene penalty)
    const fig1 = labBook.find(f => f.id === deck.fig1Id) || (deck.ready ? null : labBook[0]) || null;
    const fig2 = labBook.find(f => f.id === deck.fig2Id && f.id !== fig1?.id)
      || (deck.ready ? labBook.find(f => f.id === deck.fig2Id) : labBook.find(f => f.id !== fig1?.id))
      || null;
    const distinctFigures = Boolean(fig1 && fig2 && fig1.id !== fig2.id);

    // Mean quality and yield across labBook (0..100)
    const avgQualityRaw = labBook.length > 0
      ? labBook.reduce((s, f) => s + getQuality(f, 0), 0) / labBook.length
      : 0;
    const avgYieldRaw = labBook.length > 0
      ? labBook.reduce((s, f) => {
          const y = parseYieldPct(f, false);
          return s + (y !== null ? y : getQuality(f, 0));
        }, 0) / labBook.length
      : 0;
    const avgQuality = Math.round(avgQualityRaw * 10) / 10;
    const avgYield = Math.round(avgYieldRaw * 10) / 10;

    // 1) YIELD & CAMPAIGN COMPLETION SCORE (0.0 - 2.0)
    const stepRatio = clamp(doneSteps / Math.max(1, totalSteps), 0, 1);
    const yieldRatio = clamp(avgYieldRaw / 100, 0, 1);
    let yieldRaw = 0.5 * stepRatio * 2.0 + 0.5 * yieldRatio * 2.0;
    if (deck.framing === 'bold' && stepRatio >= 0.8 && avgQualityRaw >= 82 && avgYieldRaw >= 75) yieldRaw += 0.15;
    if (deck.framing === 'bold' && (stepRatio < 0.6 || (labBook.length > 0 && (avgQualityRaw < 72 || avgYieldRaw < 60)))) yieldRaw -= 0.2;
    if (deck.framing === 'humble' && stepRatio < 0.8) yieldRaw += 0.1;
    const yieldScore = Math.round(clamp(yieldRaw, 0, 2.0) * 10) / 10;

    // 2) HOMOGENEITY & SWEET-SPOT PURITY SCORE (0.0 - 2.0)
    const overcookedCount = (state.activeReactions || []).filter(r => r.status === 'overcooked').length;
    const homogeneityRaw = (avgQualityRaw / 100) * 2.0 - overcookedCount * 0.2;
    const homogeneityScore = Math.round(clamp(homogeneityRaw, 0, 2.0) * 10) / 10;

    // 3) ANALYTICAL RIGOR & SCIENTIFIC HONESTY SCORE (0.0 - 2.0)
    let rigorRaw = 0.15;
    if (distinctFigures) {
      const t1 = String(fig1.type || '').toLowerCase();
      const t2 = String(fig2.type || '').toLowerCase();
      const hasNmr = t1 === 'nmr' || t2 === 'nmr';
      const hasMsOrGel = t1 === 'lcms' || t2 === 'lcms' || t1 === 'gel' || t2 === 'gel';
      if (hasNmr && hasMsOrGel) {
        rigorRaw = 1.45;
      } else if (t1 !== t2) {
        rigorRaw = 1.30;
      } else {
        rigorRaw = 1.05;
      }
    } else if (fig1 || fig2) {
      rigorRaw = 0.70;
    }

    const slideFlawedFig = [fig2, fig1].find(f => hasSpectrumFlaw(f)) || null;
    const caughtHiding = Boolean(slideFlawedFig && !deck.honestDisclosure);
    let vijayCalloutLine = null;
    let richardPerkTriggered = false;

    if (slideFlawedFig) {
      if (deck.honestDisclosure) {
        // Honest disclosure bonus (+0.65) + Richard Spears meticulous auditor perk (+0.55)
        rigorRaw += 0.65;
        if (playerId === 'richard_spears') {
          rigorRaw += 0.55;
          richardPerkTriggered = true;
        }
      } else {
        // Gambling that Vijay won't spot flawed spectra -> brutal -1.5 callout penalty!
        rigorRaw -= 1.5;
        const slideNum = slideFlawedFig.id === fig1?.id ? 2 : 3;
        const figType = String(slideFlawedFig.type || '').toLowerCase();
        if (figType === 'nmr' || slideFlawedFig.hasSolventPeak) {
          vijayCalloutLine = `Wait — is that 5.30 ppm DCM on Slide ${slideNum}?! That's suboptimal — one word.`;
        } else if (figType === 'gel' || slideFlawedFig.hasOverReduction || slideFlawedFig.hasBlueDyeMishap) {
          vijayCalloutLine = slideFlawedFig.hasBlueDyeMishap
            ? `Hold on — go back to Slide ${slideNum}. Is that a blue LDS loading-dye smear down the gel lane you tried to gloss over?! That's suboptimal — one word.`
            : `Hold on — go back to Slide ${slideNum}. Is that an over-reduced 75 kDa half-antibody gel band you tried to gloss over?! That's suboptimal — one word.`;
        } else if (figType === 'lcms' || slideFlawedFig.hasAdduct) {
          vijayCalloutLine = `Hold on — go back to Slide ${slideNum}. Is that a +69 Da adduct and +44 Da PEG comb in the LC-MS you tried to gloss over?! That's suboptimal — one word.`;
        } else {
          const flawDesc = describeFigureFlaw(slideFlawedFig);
          vijayCalloutLine = `Hold on — go back to Slide ${slideNum}. Is that ${flawDesc} on the TLC plate you tried to gloss over?! That's suboptimal — one word.`;
        }
      }
    } else if (distinctFigures) {
      // Genuinely clean orthogonal spectra on both slides!
      rigorRaw += 0.55;
    }
    const rigorScore = Math.round(clamp(rigorRaw, 0, 2.0) * 10) / 10;

    // 4) THURSDAY WEEKLY REPORT + FRIDAY MANUSCRIPT PREPARATION SCORE (0.0 - 1.5)
    const weeklyReportPct = clamp(Number(state.weeklyReportProgress) || 0, 0, 100);
    const manuscriptPct = clamp(Number(state.manuscriptProgress) || 0, 0, 100);
    const manuscriptRaw = clamp((weeklyReportPct / 100) * 0.65 + (manuscriptPct / 100) * 0.85, 0, 1.5);
    const manuscriptScore = Math.round(manuscriptRaw * 10) / 10;

    // 5) SLIDE HYGIENE, PUNCTUALITY & CLICKER SCORE (0.0 - 1.5)
    let hygieneRaw = 0;
    if (deck.ready && distinctFigures) hygieneRaw += 0.75;
    else if (deck.ready && (fig1 || fig2)) hygieneRaw += 0.50;
    else if (deck.ready) hygieneRaw += 0.30;
    else hygieneRaw += 0.10;

    const curTimeMins = Number.isFinite(Number(state.timeMins)) ? Number(state.timeMins) : 540;
    const onTime = curTimeMins <= 575;
    hygieneRaw += onTime ? 0.45 : 0.15;

    const hasClicker = playerId === 'andre_shamsabadi'
      ? Boolean(state.prep?.has_clicker)
      : (state.prep?.has_clicker !== false);
    if (hasClicker) hygieneRaw += 0.30;

    const hygieneScore = Math.round(clamp(hygieneRaw, 0, 1.5) * 10) / 10;

    // 6) KLB LAB CITIZENSHIP, LAB CONDITION & VIJAY PATIENCE RUBRIC SCORE (0.0 - 1.0)
    const rawPatience = (state.patience !== undefined && state.patience !== null)
      ? Number(state.patience)
      : (state.vijayPatience !== undefined && state.vijayPatience !== null ? Number(state.vijayPatience) : 80);
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

    // Presented Group Meeting Quality & Yield -> Vijay Patience Delta
    const uniqueSlideFigs = [];
    for (const f of [fig1, fig2]) {
      if (f && !uniqueSlideFigs.some(u => u.id === f.id)) uniqueSlideFigs.push(f);
    }
    const presentedFigs = uniqueSlideFigs.length > 0 ? uniqueSlideFigs : labBook.slice();
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

    const total = Math.round(clamp(
      yieldScore + homogeneityScore + rigorScore + manuscriptScore + hygieneScore + citizenshipScore,
      0,
      10
    ) * 10) / 10;
    const passed = total >= 6.0;

    // Assemble Vijay's multi-line solo verdict (no outer quotation marks; main.js adds smart quotes)
    const vijayVerdictLines = [];
    if (vijayCalloutLine) {
      vijayVerdictLines.push(vijayCalloutLine);
    }

    if (doneSteps >= totalSteps) {
      vijayVerdictLines.push(`All ${totalSteps} campaign steps executed across the week, ${playerMeta.shortName} — very solid synthetic momentum.`);
    } else if (doneSteps >= 3) {
      vijayVerdictLines.push(`You pushed through ${doneSteps} of ${totalSteps} planned steps; let's close out the remaining characterisation first thing Monday.`);
    } else {
      vijayVerdictLines.push(`Only ${doneSteps} of ${totalSteps} steps completed by Friday Group Meeting. That's suboptimal — one word.`);
    }

    if (slideFlawedFig && deck.honestDisclosure) {
      vijayVerdictLines.push(
        richardPerkTriggered
          ? `Exemplary scientific honesty flagging the ${describeFigureFlaw(slideFlawedFig)} upfront on Slide 4, Richard — that's how we keep Chudasama manuscripts watertight.`
          : `Good scientific rigor disclosing the ${describeFigureFlaw(slideFlawedFig)} openly on Slide 4 with a clear re-purification plan.`
      );
    } else if (!slideFlawedFig && distinctFigures) {
      vijayVerdictLines.push(`Crisp orthogonal proof across your ${fig1.type.toUpperCase()} and ${fig2.type.toUpperCase()} slides — baseline-resolved and publication-ready.`);
    } else if (!deck.ready) {
      vijayVerdictLines.push(`Walking into Friday Group Meeting without saving a finished 4-slide deck is brave, I'll give you that.`);
    }

    const wrRounded = Math.round(weeklyReportPct);
    const msRounded = Math.round(manuscriptPct);
    if (wrRounded >= 100 && msRounded >= 100) {
      vijayVerdictLines.push(`Both your Thursday Weekly Report (100%) and Friday Manuscript Draft (100%) are complete — experimental schemes and SI characterisation tables look publication-tight.`);
    } else {
      if (wrRounded < 100) {
        vijayVerdictLines.push(
          wrRounded === 0
            ? `Your Thursday Weekly Report (Due Thu 18:00) was left unsubmitted at 0% — I expect that summary on time every Thursday.`
            : `Your Thursday Weekly Report is incomplete at ${wrRounded}% (${100 - wrRounded}% short of the Thu 18:00 deadline).`
        );
      } else {
        vijayVerdictLines.push(`Thursday Weekly Report was submitted cleanly at 100% ahead of deadline.`);
      }
      if (msRounded < 100) {
        if (curTimeMins < 1080) {
          vijayVerdictLines.push(
            msRounded >= 50
              ? `Manuscript Draft is off to a strong start at ${msRounded}% (due Fri 18:00 — keep writing after meeting).`
              : msRounded > 0
                ? `Manuscript Draft is underway at ${msRounded}% (due Fri 18:00 — keep writing after meeting).`
                : `Manuscript Draft due Fri 18:00 — keep writing after meeting.`
          );
        } else {
          const msMissing = 100 - msRounded;
          vijayVerdictLines.push(
            msRounded >= 50
              ? `Friday Manuscript Draft sits at ${msRounded}% (missing ${msMissing}% at the Fri 18:00 deadline) — finish the Supporting Information and scheme captions.`
              : `Friday Manuscript Draft is only ${msRounded}% complete (missing ${msMissing}% at the Fri 18:00 deadline) — you need proper desk hours on 3F writing up schemes and experimental details.`
          );
        }
      } else {
        vijayVerdictLines.push(`Friday Manuscript and Supporting Information draft is 100% ready.`);
      }
    }

    const presentedQInt = Math.round(presentedAvgQuality);
    const presentedYInt = Math.round(presentedAvgYield);
    const deltaStr = patienceDelta >= 0 ? `+${patienceDelta}` : `${patienceDelta}`;
    if (presentedFigs.length === 0) {
      vijayVerdictLines.push(`No analytical figures were presented (${presentedQInt}% quality, ${presentedYInt}% yield), straining my patience (Vijay Patience ${deltaStr}).`);
    } else if (caughtHiding) {
      vijayVerdictLines.push(`Glossing over flawed spectra at ${presentedQInt}% quality, ${presentedYInt}% yield wears down my patience quickly (Vijay Patience ${deltaStr}).`);
    } else if (patienceDelta >= 0) {
      vijayVerdictLines.push(`Your presented figures (${presentedQInt}% quality, ${presentedYInt}% yield) earned solid backing (Vijay Patience ${deltaStr}).`);
    } else {
      vijayVerdictLines.push(`Results at ${presentedQInt}% quality, ${presentedYInt}% yield need tighter bench control next week (Vijay Patience ${deltaStr}).`);
    }

    if (!hasClicker && playerId === 'andre_shamsabadi') {
      vijayVerdictLines.push(`And André, having to tap the spacebar at the lectern because your laser clicker is still sitting upstairs on the 3rd floor costs you Slide Hygiene!`);
    } else if (!onTime) {
      vijayVerdictLines.push(`Watch the clock on Fridays — Group Meeting starts at 09:00 sharp.`);
    }

    if (safeLabCond < 40) {
      vijayVerdictLines.push(`Lab Condition sits at ${Math.round(safeLabCond)}% (below the 40% inspection threshold) — keep specs on (G), headphones off (H), and your bay clean.`);
    } else if (safeLabCond >= 85) {
      vijayVerdictLines.push(`Lab Condition is spotless at ${Math.round(safeLabCond)}% — exemplary KLB citizenship.`);
    }

    if (state.abilFineOwed) {
      vijayVerdictLines.push(`Also, settle your uncollected NMR tube charge with Abil in CIB LG1b before next week.`);
    }

    vijayVerdictLines.push(
      passed
        ? `Overall score: ${total.toFixed(1)} out of 10. Good week's graft — go enjoy a coffee or pint at Gordon's.`
        : `Overall score: ${total.toFixed(1)} out of 10. Regroup, dry your glassware, and tighten the controls next week.`
    );

    // Big-Chuds WhatsApp post-audit reactions (strictly playable Big-Chuds only, zero emojis)
    const chudReactions = [];
    if (vijayCalloutLine) {
      const flawType = String(slideFlawedFig?.type || '').toLowerCase();
      const isNmrFlaw = flawType === 'nmr' || Boolean(slideFlawedFig?.hasSolventPeak);
      chudReactions.push({
        senderId: 'richard_spears',
        text: isNmrFlaw
          ? `Oof, Vijay zooming 400% straight onto the 5.30 ppm peak on the projector! Always disclose flaws on Slide 4!!`
          : `Oof, Vijay zooming 400% straight onto that ${describeFigureFlaw(slideFlawedFig)} on the projector! Always disclose flaws on Slide 4!!`
      });
    } else if (richardPerkTriggered) {
      chudReactions.push({
        senderId: 'daniel_richards',
        text: `Classic Richard turning an impurity disclosure table into a Rigor masterclass.`
      });
    }

    if (!hasClicker && playerId === 'andre_shamsabadi') {
      chudReactions.push({
        senderId: 'maximillian_lee',
        text: `André forgetting his 3F laser clicker at Group Meeting yet again.`
      });
    }

    if (wrRounded < 50 || (curTimeMins >= 1080 && msRounded < 50)) {
      chudReactions.push({
        senderId: 'peter_szijj',
        text: `Don't skip the 3F Write-Up Desk next week @${playerMeta.shortName} — Vijay always checks Thursday reports and Friday SI drafts!`
      });
    }

    if (passed) {
      chudReactions.push(
        {
          senderId: 'joao_nogueira',
          text: `${total.toFixed(1)}/10 — SMASHED IT @${playerMeta.shortName}!! Everyone to Gordon's Café right now!!`
        },
        {
          senderId: 'calise_bahou',
          text: `Bringing celebratory Sainsbury's lemons to Gordon's!`
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
      patienceDelta,
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
      vijayVerdictLines,
      chudReactions: chudReactions.filter(r => PLAYABLE_CHUD_IDS.has(r.senderId) && r.senderId !== playerId)
    };
  }

  window.KLB.SlideBuilder = {
    openDeckModal,
    evaluateFridayAudit
  };
})();
