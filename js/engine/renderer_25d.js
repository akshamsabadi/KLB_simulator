// KLB Simulator — Pokémon-Style 3/4 Oblique ("View From Slight Angle From Above") 2.5D Renderer
// Classic browser script (file:// safe, zero ES module exports) attaching window.KLB.Renderer25D.
(function () {
  'use strict';

  window.KLB = window.KLB || {};

  // Core 3/4 Oblique Tile Proportions (7:6 foreshortened pitch + 30px vertical wall fascia)
  const TILE_W = 48;
  const TILE_H = 42;
  const WALL_H = 30;
  const WALL_CAP_OVERHANG = 6; // Cutaway dark roof rim rise above tile north seam

  // Group bay palette matching KLB 2nd/3rd floor territories
  const GROUP_PALETTE = {
    chudasama: { main: '#3b82f6', dark: '#1d4ed8', light: '#93c5fd', badge: 'CHUDASAMA' },
    baker:     { main: '#10b981', dark: '#047857', light: '#6ee7b7', badge: 'BAKER' },
    sheppard:  { main: '#f59e0b', dark: '#b45309', light: '#fcd34d', badge: 'SHEPPARD' },
    facility:  { main: '#8b5cf6', dark: '#5b21b6', light: '#c4b5fd', badge: 'FACILITY' },
    none:      { main: '#64748b', dark: '#334155', light: '#cbd5e1', badge: '' }
  };

  // Friendly default labels for [E] interaction prompts
  const ASSET_LABELS = {
    spiral_stairs: 'Spiral Stairs (2F <-> 3F)',
    lift:          'Lift (2F <-> 3F)',
    exit_stairs:   'Exit / Corridor Stairs',
    specs_holder:  'Safety-Specs Dispenser',
    fire_ext:      'CO2 Fire Extinguisher',
    black_tub_key: 'Black Tub Key Stash',
    fumehood:      'Fume Hood',
    lab_bench:     'Lab Bench',
    sink:          'Lab Sink & Deionised Tap',
    chem_cupboard: 'COSHH Chemical Cupboard',
    fridge_4c:     '4 °C Lab Fridge',
    freezer_20c:   '-20 °C Spark-Free Freezer',
    waste_bin:     'Solvent Winchesters & Silica Waste',
    buchi:         'Büchi Rotary Evaporator',
    biotage:       'Biotage Isolera Flash Column',
    tlc_station:   '254/365 nm UV TLC Cabinet',
    drying_oven:   '120 °C Glassware Drying Oven',
    base_bath:     'Base / Bleach Quench Bath',
    argon_cyl:     'BOC Argon Cylinder & Balloon',
    balance_table: 'Analytical Balance Table',
    tcep_bench:    'TCEP & Bioconjugation Station',
    gel_tank:      'SDS-PAGE Gel Tank',
    centrifuge:    'Benchtop Microcentrifuge',
    heatblock:     '37 °C ThermoMixer Shaker',
    syringe_pump:  'Harvard Syringe Pump',
    lab_speakers:  'Lab Speakers (LotR Synth)',
    writeup_desk:  'Write-Up Desk',
    pc_terminal:   'PC Terminal',
    whiteboard:    'Group Whiteboard',
    bookshelf:     'Chemistry Bookshelf',
    thesis_printer:'Departmental Laser Printer',
    locker:        'Departmental Steel Lockers',
    meeting_table: 'Seminar Table',
    chair:         'Chair',
    projector:     'Projector Screen & Podium',
    tea_drawer:    "Richard's Kettle & Biscuit Tin",
    toilet:        'Washroom',
    lcms_unit:     'Waters Acquity UPLC-MS',
    maldi_unit:    'MALDI-TOF Mass Spectrometer',
    nmr_magnet:    'Bruker Cryo-NMR Spectrometer',
    cafe_counter:  "Gordon's Café Espresso Bar",
    cafe_table:    'Café Bistro Table',
    npc_marker:    'Workstation',
    custom_block:  'Equipment'
  };

  const SURFACE_TYPES = new Set([
    'fumehood',
    'lab_bench',
    'writeup_desk',
    'meeting_table',
    'cafe_counter'
  ]);

  const FLOOR_DECAL_TYPES = new Set([
    'exit_stairs',
    'npc_marker'
  ]);

  // Approximate vertical rise (px) per fixture type for 3D click hit-testing & floating UI anchors
  const FIXTURE_RISE = {
    fumehood: 30,
    lab_bench: 16,
    sink: 14,
    chem_cupboard: 28,
    fridge_4c: 32,
    freezer_20c: 32,
    waste_bin: 18,
    buchi: 26,
    biotage: 24,
    tlc_station: 18,
    drying_oven: 26,
    base_bath: 12,
    argon_cyl: 18,
    balance_table: 22,
    tcep_bench: 15,
    gel_tank: 13,
    centrifuge: 13,
    heatblock: 13,
    syringe_pump: 11,
    lab_speakers: 14,
    writeup_desk: 15,
    pc_terminal: 18,
    whiteboard: 18,
    bookshelf: 30,
    thesis_printer: 20,
    locker: 32,
    spiral_stairs: 22,
    lift: 30,
    specs_holder: 24,
    fire_ext: 22,
    black_tub_key: 12,
    tea_drawer: 22,
    toilet: 20,
    lcms_unit: 30,
    maldi_unit: 30,
    nmr_magnet: 18,
    cafe_counter: 20,
    cafe_table: 18,
    meeting_table: 15,
    chair: 14,
    projector: 4,
    custom_block: 18
  };

  // ============================================================================
  // DETERMINISTIC PSEUDO-RANDOM & DRAWING HELPERS
  // ============================================================================
  function hash2D(x, y, seed) {
    let h = (x * 374761393 + y * 668265263 + (seed || 0) * 1442695041) | 0;
    h = ((h ^ (h >>> 13)) * 1274126177) | 0;
    return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
  }

  function clamp(v, lo, hi) {
    return v < lo ? lo : v > hi ? hi : v;
  }

  function stripBubbleEmojis(str) {
    return String(str || '')
      .replace(/[\p{Extended_Pictographic}\u{1F000}-\u{1FAFF}\u{231A}-\u{23FA}\u{2600}-\u{27BF}\u{2B05}-\u{2B55}\u{FE00}-\u{FE0F}\u{200D}\u{20E3}]/gu, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function fitLabelNoEllipsis(ctx, str, maxWidth) {
    const clean = stripBubbleEmojis(str);
    if (!clean) return '';
    if (ctx.measureText(clean).width <= maxWidth) return clean;
    const words = clean.split(' ');
    while (words.length > 1 && ctx.measureText(words.join(' ')).width > maxWidth) {
      words.pop();
    }
    const wordFit = words.join(' ');
    if (ctx.measureText(wordFit).width <= maxWidth) return wordFit;
    const chars = Array.from(wordFit);
    while (chars.length > 1 && ctx.measureText(chars.join('')).width > maxWidth) {
      chars.pop();
    }
    return chars.join('');
  }

  function drawVectorMusicNote(ctx, x, y, beamed, color) {
    ctx.save();
    ctx.fillStyle = color;
    ctx.strokeStyle = color;
    ctx.lineCap = 'round';
    if (beamed) {
      // Double beamed eighth-note
      ctx.beginPath();
      ctx.ellipse(x - 3, y + 0.5, 2.7, 1.9, -0.35, 0, Math.PI * 2);
      ctx.ellipse(x + 3, y - 1, 2.7, 1.9, -0.35, 0, Math.PI * 2);
      ctx.fill();
      ctx.lineWidth = 1.3;
      ctx.beginPath();
      ctx.moveTo(x - 0.8, y);
      ctx.lineTo(x - 0.8, y - 8);
      ctx.moveTo(x + 5.2, y - 1.5);
      ctx.lineTo(x + 5.2, y - 9.5);
      ctx.stroke();
      ctx.lineWidth = 2.1;
      ctx.beginPath();
      ctx.moveTo(x - 0.8, y - 8);
      ctx.lineTo(x + 5.2, y - 9.5);
      ctx.stroke();
    } else {
      // Single eighth-note
      ctx.beginPath();
      ctx.ellipse(x, y, 2.9, 2.0, -0.35, 0, Math.PI * 2);
      ctx.fill();
      ctx.lineWidth = 1.35;
      ctx.beginPath();
      ctx.moveTo(x + 2.3, y - 0.3);
      ctx.lineTo(x + 2.3, y - 9);
      ctx.quadraticCurveTo(x + 6.8, y - 7.2, x + 5.4, y - 3.6);
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawVectorFlaskIcon(ctx, cx, cy, liquidColor, rimColor, bubblePhase) {
    ctx.save();
    // Conical flask silhouette
    ctx.beginPath();
    ctx.moveTo(cx - 1.4, cy - 4.5);
    ctx.lineTo(cx + 1.4, cy - 4.5);
    ctx.lineTo(cx + 1.4, cy - 1.8);
    ctx.lineTo(cx + 4.4, cy + 3.8);
    ctx.quadraticCurveTo(cx + 4.6, cy + 4.8, cx + 3.4, cy + 4.8);
    ctx.lineTo(cx - 3.4, cy + 4.8);
    ctx.quadraticCurveTo(cx - 4.6, cy + 4.8, cx - 4.4, cy + 3.8);
    ctx.lineTo(cx - 1.4, cy - 1.8);
    ctx.closePath();
    ctx.fillStyle = 'rgba(20, 184, 166, 0.22)';
    ctx.fill();

    // Glowing liquid inside lower flask
    ctx.beginPath();
    ctx.moveTo(cx - 2.6, cy + 0.6);
    ctx.lineTo(cx + 2.6, cy + 0.6);
    ctx.lineTo(cx + 4.0, cy + 3.6);
    ctx.quadraticCurveTo(cx + 4.1, cy + 4.4, cx + 3.1, cy + 4.4);
    ctx.lineTo(cx - 3.1, cy + 4.4);
    ctx.quadraticCurveTo(cx - 4.1, cy + 4.4, cx - 4.0, cy + 3.6);
    ctx.closePath();
    ctx.fillStyle = liquidColor;
    ctx.fill();

    // Rim outline
    ctx.beginPath();
    ctx.moveTo(cx - 1.8, cy - 4.5);
    ctx.lineTo(cx + 1.8, cy - 4.5);
    ctx.moveTo(cx - 1.4, cy - 4.5);
    ctx.lineTo(cx - 1.4, cy - 1.8);
    ctx.lineTo(cx - 4.4, cy + 3.8);
    ctx.quadraticCurveTo(cx - 4.6, cy + 4.8, cx - 3.4, cy + 4.8);
    ctx.lineTo(cx + 3.4, cy + 4.8);
    ctx.quadraticCurveTo(cx + 4.6, cy + 4.8, cx + 4.4, cy + 3.8);
    ctx.lineTo(cx + 1.4, cy - 1.8);
    ctx.lineTo(cx + 1.4, cy - 4.5);
    ctx.strokeStyle = rimColor;
    ctx.lineWidth = 1.05;
    ctx.stroke();

    // Animated micro-bubble inside flask
    const bShift = (bubblePhase || 0) % 1;
    ctx.fillStyle = '#fef3c7';
    ctx.beginPath();
    ctx.arc(cx + 0.7, cy + 3.2 - bShift * 3.5, 0.9, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function roundRectPath(ctx, x, y, w, h, r) {
    const rr = Math.min(r, w * 0.5, h * 0.5);
    ctx.beginPath();
    ctx.moveTo(x + rr, y);
    ctx.lineTo(x + w - rr, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + rr);
    ctx.lineTo(x + w, y + h - rr);
    ctx.quadraticCurveTo(x + w, y + h, x + w - rr, y + h);
    ctx.lineTo(x + rr, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - rr);
    ctx.lineTo(x, y + rr);
    ctx.quadraticCurveTo(x, y, x + rr, y);
    ctx.closePath();
  }

  function fillRoundRect(ctx, x, y, w, h, r, fill, stroke, lineW) {
    roundRectPath(ctx, x, y, w, h, r);
    if (fill) {
      ctx.fillStyle = fill;
      ctx.fill();
    }
    if (stroke) {
      ctx.strokeStyle = stroke;
      ctx.lineWidth = lineW || 1;
      ctx.stroke();
    }
  }

  function draw3DBox(ctx, x, y, w, depthH, riseZ, topColor, frontColor, borderColor, topHighlight) {
    const bCol = borderColor || '#1e293b';
    // Front vertical elevation: [y + depthH - riseZ, y + depthH]
    const frontTopY = y + depthH - riseZ;
    ctx.fillStyle = frontColor;
    ctx.fillRect(x, frontTopY, w, riseZ);

    // Top 3/4 plane: [y - riseZ, y + depthH - riseZ]
    const topY = y - riseZ;
    ctx.fillStyle = topColor;
    ctx.fillRect(x, topY, w, depthH);

    // Top front lip bevel highlight
    if (topHighlight !== false) {
      ctx.fillStyle = topHighlight || 'rgba(255,255,255,0.35)';
      ctx.fillRect(x + 1, frontTopY - 2, w - 2, 2);
    }

    // Bottom ambient contact line
    ctx.fillStyle = 'rgba(15,23,42,0.22)';
    ctx.fillRect(x, y + depthH - 2, w, 2);

    // Crisp Pokémon-style dark pixel contour
    ctx.strokeStyle = bCol;
    ctx.lineWidth = 1.25;
    ctx.strokeRect(x + 0.5, topY + 0.5, w - 1, depthH + riseZ - 1);

    // Seam line between top surface and front face
    ctx.beginPath();
    ctx.moveTo(x + 0.5, frontTopY + 0.5);
    ctx.lineTo(x + w - 0.5, frontTopY + 0.5);
    ctx.stroke();
  }

  function isWalkableTile(t) {
    return t >= 1 && t <= 4;
  }

  function isWallLike(t) {
    return t === 5 || t === 6;
  }

  function getTileSafe(room, x, y) {
    if (!room || !room.tiles || y < 0 || y >= room.h || x < 0 || x >= room.w) return 0;
    const row = room.tiles[y];
    return row ? (row[x] || 0) : 0;
  }

  function parseCupboardNumber(label) {
    if (!label) return '';
    const m = String(label).match(/cupboard\s*#?(\d+)/i) || String(label).match(/#(\d+)/);
    return m ? '#' + m[1] : '';
  }

  function drawStationMicroTag(ctx, cx, cy, label, opts) {
    if (!label) return;
    const cfg = opts || {};
    ctx.save();
    ctx.font = cfg.font || 'bold 8px monospace';
    const tw = ctx.measureText(label).width;
    const pw = Math.ceil(tw + 8);
    const ph = 11;
    const bx = Math.round(cx - pw * 0.5);
    const by = Math.round(cy - ph * 0.5);
    fillRoundRect(
      ctx,
      bx,
      by,
      pw,
      ph,
      2.5,
      cfg.bg || 'rgba(15, 23, 42, 0.88)',
      cfg.border || 'rgba(148, 163, 184, 0.6)',
      0.9
    );
    ctx.fillStyle = cfg.color || '#f1f5f9';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(label, cx, by + ph * 0.5 + 0.5);
    ctx.restore();
  }

  // ============================================================================
  // SPRITE SHEET PRELOADER & FALLBACK SILHOUETTE
  // ============================================================================
  const spriteCache = new Map(); // id -> { img, loaded, error }
  let preloadedCast = false;

  function ensureSprite(charId) {
    if (!charId) return null;
    const cleanId = String(charId).replace(/\.png$/i, '').split('/').pop();
    if (spriteCache.has(cleanId)) return spriteCache.get(cleanId);

    if (typeof Image === 'undefined') return null;
    const entry = { img: new Image(), loaded: false, error: false };
    entry.img.onload = function () { entry.loaded = true; };
    entry.img.onerror = function () { entry.error = true; };
    entry.img.src = 'assets/sprites/' + cleanId + '.png';
    spriteCache.set(cleanId, entry);
    return entry;
  }

  function preloadAllSprites() {
    if (preloadedCast || typeof Image === 'undefined') return;
    preloadedCast = true;
    const cast = (window.KLB && Array.isArray(window.KLB.CAST)) ? window.KLB.CAST : [];
    for (let i = 0; i < cast.length; i++) {
      if (cast[i] && cast[i].id) ensureSprite(cast[i].id);
    }
  }

  // Track smooth movement automatically when callers update entity x/y without setting .moving
  const entityMotionTracker = new Map();
  const footstepPuffs = [];
  const clickRipples = [];
  const hoodSashState = new Map();
  const canvasTrackerMap = new WeakMap();
  let lastRenderSec = 0;

  function triggerClickRipple(gx, gy, kind) {
    if (!Number.isFinite(Number(gx)) || !Number.isFinite(Number(gy))) return;
    const nowSec = (typeof performance !== 'undefined' ? performance.now() : Date.now()) * 0.001;
    clickRipples.push({
      gx: Number(gx),
      gy: Number(gy),
      kind: kind || 'floor',
      createdSec: nowSec
    });
    if (clickRipples.length > 16) clickRipples.shift();
  }

  function pushFootstepPuff(x, y, tileType, nowSec, roomId) {
    footstepPuffs.push({
      x,
      y,
      tileType,
      createdSec: nowSec,
      roomId
    });
    if (footstepPuffs.length > 48) footstepPuffs.shift();
  }

  function dirFromDelta(dx, dy, fallback) {
    if (Math.abs(dx) < 0.01 && Math.abs(dy) < 0.01) return fallback || 'S';
    if (Math.abs(dx) >= Math.abs(dy)) return dx < 0 ? 'W' : 'E';
    return dy < 0 ? 'N' : 'S';
  }

  function resolveEntityAnim(entity, nowSec, isPlayer, room, entitiesById, renderState) {
    const key = entity.uid || entity.id || entity.charId || 'player';
    const ex = Number(entity.x) || 0;
    const ey = Number(entity.y) || 0;
    let prev = entityMotionTracker.get(key);
    if (!prev) {
      prev = { x: ex, y: ey, lastMoveSec: -10, lastStepPuffSec: -10, autoDir: 'S' };
      entityMotionTracker.set(key, prev);
    } else {
      const dx = ex - prev.x;
      const dy = ey - prev.y;
      if (Math.abs(dx) > 0.002 || Math.abs(dy) > 0.002) {
        prev.lastMoveSec = nowSec;
        prev.autoDir = dirFromDelta(dx, dy, prev.autoDir);
        prev.x = ex;
        prev.y = ey;
      }
    }

    // Normalize facing direction -> row (0:S, 1:W, 2:E, 3:N)
    const rawDir = entity.dir !== undefined ? entity.dir : (entity.facing !== undefined ? entity.facing : prev.autoDir);
    let dirCode = 'S';
    if (typeof rawDir === 'number') {
      dirCode = ['S', 'W', 'E', 'N'][rawDir & 3] || 'S';
    } else if (typeof rawDir === 'string') {
      const u = rawDir.toUpperCase();
      if (u === 'W' || u === 'LEFT') dirCode = 'W';
      else if (u === 'E' || u === 'RIGHT') dirCode = 'E';
      else if (u === 'N' || u === 'UP') dirCode = 'N';
      else dirCode = 'S';
    }

    // Determine walk frame column [0:Idle0, 1:StepL, 2:Idle1, 3:StepR]
    let col = 0;
    let isMoving = false;
    if (typeof entity.walkFrame === 'number' && (entity.moving || entity.isMoving || entity.walking)) {
      isMoving = true;
      col = ((entity.walkFrame | 0) % 4 + 4) % 4;
    } else if (typeof entity.frame === 'number' && (entity.moving || entity.isMoving || entity.walking)) {
      isMoving = true;
      col = ((entity.frame | 0) % 4 + 4) % 4;
    } else {
      isMoving = Boolean(
        entity.moving ||
        entity.isMoving ||
        entity.walking ||
        (nowSec - prev.lastMoveSec < 0.11)
      );
      if (isMoving) {
        col = Math.floor(nowSec * 6.8) % 4;
      } else if (typeof entity.walkFrame === 'number' && entity.walkFrame !== 0) {
        col = ((entity.walkFrame | 0) % 4 + 4) % 4;
        isMoving = true;
      } else {
        col = 0;
      }
    }

    // Emit crisp footstep scuff/dust puffs on step frames
    if (isMoving && room && (col === 1 || col === 3) && (nowSec - prev.lastStepPuffSec > 0.16)) {
      prev.lastStepPuffSec = nowSec;
      const footOffX = col === 1 ? -4 : 4;
      const tileType = getTileSafe(room, Math.round(ex), Math.round(ey));
      pushFootstepPuff((ex + 0.5) * TILE_W + footOffX, (ey + 0.86) * TILE_H - 1, tileType, nowSec, room.id);
    }

    // Smart Idle Facing for NPCs (player focus -> nearby huddle partner -> active busyObjId workstation)
    if (!isMoving && !isPlayer && room) {
      const nid = entity.id || entity.charId || '';
      const hlNpcId = renderState && (renderState.highlightedNpcId || (renderState.highlightedNpc && renderState.highlightedNpc.id));
      if (hlNpcId && nid && hlNpcId === nid && renderState.player) {
        dirCode = dirFromDelta(Number(renderState.player.x) - ex, Number(renderState.player.y) - ey, dirCode);
      } else {
        let nearestPartner = null;
        let nearestDist = 2.25;
        if (entitiesById) {
          entitiesById.forEach(function (other, oid) {
            if (!other || other === entity || oid === 'player') return;
            const otherId = other.id || other.charId || oid;
            if (nid && otherId === nid) return;
            const d = Math.hypot((Number(other.x) || 0) - ex, (Number(other.y) || 0) - ey);
            if (d > 0.05 && d <= nearestDist) {
              nearestDist = d;
              nearestPartner = other;
            }
          });
        }
        if (nearestPartner) {
          dirCode = dirFromDelta(Number(nearestPartner.x) - ex, Number(nearestPartner.y) - ey, dirCode);
        } else if (entity.busyObjId && Array.isArray(room.objects)) {
          for (let i = 0; i < room.objects.length; i++) {
            const bo = room.objects[i];
            if (bo.id === entity.busyObjId) {
              dirCode = dirFromDelta((bo.x + bo.w * 0.5) - (ex + 0.5), (bo.y + bo.h * 0.5) - (ey + 0.5), dirCode);
              break;
            }
          }
        }
      }
    }

    const row = dirCode === 'S' ? 0 : dirCode === 'W' ? 1 : dirCode === 'E' ? 2 : 3;
    return { row, col, dirCode, isMoving };
  }

  // ============================================================================
  // STATIC ROOM FLOOR + AO + DECALS OFFSCREEN CACHE
  // ============================================================================
  const roomFloorCache = new Map();
  const windowBayCache = new Map();
  const surfaceParentCache = new Map();

  function computeRoomBounds(room) {
    let minX = room.w, minY = room.h, maxX = 0, maxY = 0;
    let found = false;
    for (let y = 0; y < room.h; y++) {
      for (let x = 0; x < room.w; x++) {
        if (getTileSafe(room, x, y) !== 0) {
          if (x < minX) minX = x;
          if (y < minY) minY = y;
          if (x + 1 > maxX) maxX = x + 1;
          if (y + 1 > maxY) maxY = y + 1;
          found = true;
        }
      }
    }
    const objs = room.objects || [];
    for (let i = 0; i < objs.length; i++) {
      const o = objs[i];
      if (o.x < minX) minX = o.x;
      if (o.y < minY) minY = o.y;
      if (o.x + o.w > maxX) maxX = o.x + o.w;
      if (o.y + o.h > maxY) maxY = o.y + o.h;
      found = true;
    }
    if (!found) {
      minX = 0; minY = 0; maxX = room.w; maxY = room.h;
    }
    return {
      minX, minY, maxX, maxY,
      pxMinX: minX * TILE_W,
      pxMinY: minY * TILE_H - WALL_H,
      pxMaxX: maxX * TILE_W,
      pxMaxY: maxY * TILE_H + 16
    };
  }

  function roomSignature(room) {
    const objLen = room.objects ? room.objects.length : 0;
    return room.id + ':' + room.w + 'x' + room.h + ':' + objLen;
  }

  function drawSingleFloorTile(ctx, room, gx, gy, tileId) {
    const px = gx * TILE_W;
    const py = gy * TILE_H;

    if (tileId === 1) {
      // 1: UCL KLB Pale Duck-Egg / Slate Speckled Safety Lab Vinyl
      const sheetParity = ((gx >> 1) + (gy >> 1)) & 1;
      ctx.fillStyle = sheetParity ? '#d6e3ec' : '#dce8f0';
      ctx.fillRect(px, py, TILE_W, TILE_H);

      // Subtle 1-tile subgrid sheen
      ctx.fillStyle = ((gx + gy) & 1) ? 'rgba(255,255,255,0.14)' : 'rgba(148,163,184,0.06)';
      ctx.fillRect(px, py, TILE_W, TILE_H);

      // Welded vinyl sheet seams every 2 tiles
      if (gx % 2 === 0) {
        ctx.fillStyle = 'rgba(148, 163, 184, 0.34)';
        ctx.fillRect(px, py, 1, TILE_H);
      }
      if (gy % 2 === 0) {
        ctx.fillStyle = 'rgba(148, 163, 184, 0.30)';
        ctx.fillRect(px, py, TILE_W, 1);
      }

      // Fine mineral non-slip vinyl speckles
      for (let s = 0; s < 9; s++) {
        const rx = Math.floor(hash2D(gx * 13 + s, gy * 7, 11) * (TILE_W - 4)) + 2;
        const ry = Math.floor(hash2D(gx * 5, gy * 17 + s, 23) * (TILE_H - 4)) + 2;
        ctx.fillStyle = (s % 3 === 0) ? 'rgba(255,255,255,0.65)' : (s % 2 === 0 ? 'rgba(100,116,139,0.22)' : 'rgba(56,189,248,0.16)');
        ctx.fillRect(px + rx, py + ry, 2, 1.5);
      }
    } else if (tileId === 2) {
      // 2: Warm Woven Navy-Heather Pokémon Office Carpet Tiles
      const checker = (gx + gy) & 1;
      ctx.fillStyle = checker ? '#cbc7df' : '#c2bdd8';
      ctx.fillRect(px, py, TILE_W, TILE_H);

      // Quarter-turn woven carpet texture lines
      ctx.fillStyle = 'rgba(71, 85, 105, 0.10)';
      if (checker) {
        for (let i = 3; i < TILE_H; i += 6) ctx.fillRect(px + 1, py + i, TILE_W - 2, 1);
      } else {
        for (let i = 4; i < TILE_W; i += 6) ctx.fillRect(px + i, py + 1, 1, TILE_H - 2);
      }
      ctx.strokeStyle = 'rgba(100, 116, 139, 0.18)';
      ctx.lineWidth = 1;
      ctx.strokeRect(px + 0.5, py + 0.5, TILE_W - 1, TILE_H - 1);
    } else if (tileId === 3) {
      // 3: Buff Terrazzo Corridor Tile
      ctx.fillStyle = ((gx + gy) & 1) ? '#e8e2d5' : '#e1dacb';
      ctx.fillRect(px, py, TILE_W, TILE_H);
      for (let s = 0; s < 8; s++) {
        const rx = Math.floor(hash2D(gx + s * 3, gy, 41) * (TILE_W - 6)) + 3;
        const ry = Math.floor(hash2D(gx, gy + s * 5, 59) * (TILE_H - 6)) + 3;
        ctx.fillStyle = (s & 1) ? 'rgba(120, 113, 108, 0.28)' : 'rgba(255, 251, 235, 0.6)';
        ctx.fillRect(px + rx, py + ry, 2, 2);
      }
      ctx.strokeStyle = 'rgba(168, 162, 158, 0.35)';
      ctx.lineWidth = 1;
      ctx.strokeRect(px + 0.5, py + 0.5, TILE_W - 1, TILE_H - 1);
    } else if (tileId === 4) {
      // 4: Gordon's Café Warm Honey-Oak Floorboards with Plank Joints
      const plankH = TILE_H / 3; // 14px planks
      const tones = ['#d79a52', '#cc8c42', '#df9f58', '#c5833a'];
      for (let p = 0; p < 3; p++) {
        const pyRow = py + p * plankH;
        const toneIdx = Math.floor(hash2D(gx, gy * 3 + p, 77) * tones.length);
        ctx.fillStyle = tones[toneIdx];
        ctx.fillRect(px, pyRow, TILE_W, plankH);

        // Warm woodgrain streak
        ctx.fillStyle = 'rgba(254, 243, 199, 0.16)';
        ctx.fillRect(px + 2, pyRow + 3, TILE_W - 4, 2);
        ctx.fillStyle = 'rgba(120, 53, 15, 0.14)';
        ctx.fillRect(px, pyRow + plankH - 1.2, TILE_W, 1.2);

        // Staggered vertical plank butt-joint + brass/oak dowel pins
        if (hash2D(gx + p * 7, gy * 3 + p, 91) > 0.48) {
          const jx = px + 10 + Math.floor(hash2D(gx, gy + p, 103) * (TILE_W - 20));
          ctx.fillStyle = 'rgba(92, 40, 10, 0.42)';
          ctx.fillRect(jx, pyRow, 1.2, plankH);
          ctx.fillStyle = 'rgba(69, 26, 3, 0.55)';
          ctx.fillRect(jx - 3, pyRow + 3, 1.5, 1.5);
          ctx.fillRect(jx + 2, pyRow + plankH - 5, 1.5, 1.5);
        }
      }
    }
  }

  function drawFloorDecalObject(ctx, room, obj) {
    const px = obj.x * TILE_W;
    const py = obj.y * TILE_H;
    const pw = obj.w * TILE_W;
    const ph = obj.h * TILE_H;

    if (obj.type === 'exit_stairs') {
      // Recessed Stairwell Landing Mat + Brass Nosing + Directional Arrow
      fillRoundRect(ctx, px + 3, py + 3, pw - 6, ph - 6, 4, '#27303f', '#eab308', 1.5);
      // Ribbed stair treads
      ctx.fillStyle = '#1e293b';
      const horizSteps = pw >= ph;
      if (horizSteps) {
        for (let sy = py + 8; sy < py + ph - 6; sy += 6) {
          ctx.fillRect(px + 6, sy, pw - 12, 3);
          ctx.fillStyle = 'rgba(255,255,255,0.10)';
          ctx.fillRect(px + 6, sy, pw - 12, 1);
          ctx.fillStyle = '#1e293b';
        }
      } else {
        for (let sx = px + 8; sx < px + pw - 6; sx += 7) {
          ctx.fillRect(sx, py + 6, 3.5, ph - 12);
          ctx.fillStyle = 'rgba(255,255,255,0.10)';
          ctx.fillRect(sx, py + 6, 1, ph - 12);
          ctx.fillStyle = '#1e293b';
        }
      }

      // Determine open exit direction
      const openE = getTileSafe(room, obj.x + obj.w, obj.y) === 0;
      const cx = px + pw * 0.5;
      const cy = py + ph * 0.5;
      const horiz = pw >= ph;
      const ax = horiz ? (cx - 18) : cx;
      const ay = horiz ? cy : (cy - 10);
      ctx.fillStyle = '#fde047';
      ctx.beginPath();
      if (openE) {
        ctx.moveTo(ax - 3, ay - 4);
        ctx.lineTo(ax + 4, ay);
        ctx.lineTo(ax - 3, ay + 4);
      } else {
        ctx.moveTo(ax - 4, ay - 3);
        ctx.lineTo(ax + 4, ay - 3);
        ctx.lineTo(ax, ay + 4);
      }
      ctx.closePath();
      ctx.fill();
      drawStationMicroTag(ctx, horiz ? (cx + 6) : cx, horiz ? cy : (cy + 5), 'EXIT', {
        border: '#eab308',
        color: '#fde047'
      });
    } else if (obj.type === 'npc_marker') {
      // Subtle cushioned workstation floor mat
      fillRoundRect(ctx, px + 6, py + 8, pw - 12, ph - 12, 5, 'rgba(30, 41, 59, 0.16)', 'rgba(51, 65, 85, 0.22)', 1);
    }
  }

  function getCachedFloorCanvas(room, dpr) {
    const cacheScale = Math.min(2.5, Math.max(1, Math.ceil((dpr || 1) * 1.25)));
    const sig = roomSignature(room) + '@' + cacheScale;
    const cached = roomFloorCache.get(room.id);
    if (cached && cached.sig === sig) return cached;

    const bounds = computeRoomBounds(room);
    const originX = bounds.pxMinX - 8;
    const originY = bounds.pxMinY - 8;
    const spanW = Math.max(1, (bounds.pxMaxX + 16) - originX);
    const spanH = Math.max(1, (bounds.pxMaxY + 24) - originY);

    if (typeof document === 'undefined') {
      return { sig, canvas: null, bounds, originX, originY, spanW, spanH, cacheScale };
    }

    const off = document.createElement('canvas');
    off.width = Math.max(1, Math.round(spanW * cacheScale));
    off.height = Math.max(1, Math.round(spanH * cacheScale));
    const octx = off.getContext('2d');
    if (typeof octx.setTransform === 'function') {
      octx.setTransform(cacheScale, 0, 0, cacheScale, -originX * cacheScale, -originY * cacheScale);
    } else {
      octx.scale(cacheScale, cacheScale);
      octx.translate(-originX, -originY);
    }

    // 1. Soft exterior building drop-shadow onto the Pokémon void
    octx.fillStyle = 'rgba(2, 6, 23, 0.65)';
    for (let y = 0; y < room.h; y++) {
      for (let x = 0; x < room.w; x++) {
        if (getTileSafe(room, x, y) !== 0) {
          octx.fillRect(x * TILE_W + 6, y * TILE_H + 8, TILE_W + 4, TILE_H + 6);
        }
      }
    }

    // 2. Render all floor tiles (including floor beneath doors 7 & 8)
    const fallbackFloor = room.defaultFloor || 1;
    for (let y = 0; y < room.h; y++) {
      for (let x = 0; x < room.w; x++) {
        const t = getTileSafe(room, x, y);
        if (t >= 1 && t <= 4) {
          drawSingleFloorTile(octx, room, x, y, t);
        } else if (t === 7 || t === 8) {
          drawSingleFloorTile(octx, room, x, y, fallbackFloor);
        }
      }
    }

    // 3. Fire-Exit Keep-Clear hazard markings inside (10, 2) on klb_2f next to tile 8 at (9, 2)
    for (let y = 0; y < room.h; y++) {
      for (let x = 0; x < room.w; x++) {
        if (getTileSafe(room, x, y) === 8 && isWalkableTile(getTileSafe(room, x + 1, y))) {
          const hx = (x + 1) * TILE_W + 2;
          const hy = y * TILE_H + 4;
          octx.save();
          octx.strokeStyle = 'rgba(234, 179, 8, 0.65)';
          octx.lineWidth = 1.5;
          octx.setLineDash([4, 3]);
          octx.strokeRect(hx, hy, 22, TILE_H - 8);
          octx.restore();
        }
      }
    }

    // 4. Soft Pokémon Ambient Occlusion (AO) & Wall Cast Shadows along walls
    for (let y = 0; y < room.h; y++) {
      for (let x = 0; x < room.w; x++) {
        const t = getTileSafe(room, x, y);
        if (!isWalkableTile(t)) continue;
        const px = x * TILE_W;
        const py = y * TILE_H;
        const nWall = isWallLike(getTileSafe(room, x, y - 1));
        const wWall = isWallLike(getTileSafe(room, x - 1, y));
        const eWall = isWallLike(getTileSafe(room, x + 1, y));

        if (nWall) {
          const g = octx.createLinearGradient(0, py, 0, py + 14);
          g.addColorStop(0, 'rgba(15, 23, 42, 0.22)');
          g.addColorStop(1, 'rgba(15, 23, 42, 0)');
          octx.fillStyle = g;
          octx.fillRect(px, py, TILE_W, 14);
        }
        if (wWall) {
          const g = octx.createLinearGradient(px, 0, px + 12, 0);
          g.addColorStop(0, 'rgba(15, 23, 42, 0.18)');
          g.addColorStop(1, 'rgba(15, 23, 42, 0)');
          octx.fillStyle = g;
          octx.fillRect(px, py, 12, TILE_H);
        }
        if (eWall) {
          const g = octx.createLinearGradient(px + TILE_W - 8, 0, px + TILE_W, 0);
          g.addColorStop(0, 'rgba(15, 23, 42, 0)');
          g.addColorStop(1, 'rgba(15, 23, 42, 0.12)');
          octx.fillStyle = g;
          octx.fillRect(px + TILE_W - 8, py, 8, TILE_H);
        }
      }
    }

    // 5. Floor decals (exit_stairs, npc_marker)
    const objs = room.objects || [];
    for (let i = 0; i < objs.length; i++) {
      if (FLOOR_DECAL_TYPES.has(objs[i].type)) {
        drawFloorDecalObject(octx, room, objs[i]);
      }
    }

    const entry = { sig, canvas: off, bounds, originX, originY, spanW, spanH, cacheScale };
    roomFloorCache.set(room.id, entry);
    return entry;
  }

  // ============================================================================
  // ATMOSPHERE, TIME-OF-DAY SKY & EXTERIOR GEORGIAN WINDOWS
  // ============================================================================
  function lerpNum(a, b, t) {
    return a + (b - a) * t;
  }

  function lerpRgb(c1, c2, t) {
    const r = Math.round(lerpNum(c1[0], c2[0], t));
    const g = Math.round(lerpNum(c1[1], c2[1], t));
    const b = Math.round(lerpNum(c1[2], c2[2], t));
    return 'rgb(' + r + ',' + g + ',' + b + ')';
  }

  function isAboveGroundWindowRoom(roomOrId) {
    const id = typeof roomOrId === 'string' ? roomOrId : (roomOrId && roomOrId.id);
    return id === 'klb_2f' || id === 'klb_3f' || id === 'gordons_cafe';
  }

  function getAtmosphereProfile(timeMins, weather) {
    const mins = typeof timeMins === 'number' ? timeMins : 570;
    const hour = ((mins / 60) % 24 + 24) % 24;
    const w = String(weather || '').toLowerCase();
    const isRain = w.includes('rain') || w.includes('storm');
    const isCold = w.includes('cold') || w.includes('frost') || w.includes('chill');
    const isHeatwave = w.includes('heat');

    // Golden-Hour bell curve: 16:45 (16.75) -> peak ~17:45-18:15 -> 18:45 (18.75)
    let goldenFactor = 0;
    if (hour >= 16.75 && hour <= 18.75) {
      if (hour < 17.65) goldenFactor = (hour - 16.75) / 0.90;
      else if (hour <= 18.15) goldenFactor = 1.0;
      else goldenFactor = (18.75 - hour) / 0.60;
      goldenFactor = clamp(goldenFactor, 0, 1);
    }

    // Dawn factor: 06:30 -> peak 07:45 -> 09:30
    let dawnFactor = 0;
    if (hour >= 6.5 && hour <= 9.5) {
      dawnFactor = hour < 7.75 ? (hour - 6.5) / 1.25 : (9.5 - hour) / 1.75;
      dawnFactor = clamp(dawnFactor, 0, 1);
    }

    // Night factor: 19:00 -> 06:15
    let nightFactor = 0;
    if (hour >= 19.0 || hour < 6.0) nightFactor = 1;
    else if (hour >= 18.45) nightFactor = clamp((hour - 18.45) / 0.55, 0, 1);
    else if (hour < 6.5) nightFactor = clamp((6.5 - hour) / 0.5, 0, 1);

    let skyTop = isRain ? '#64748b' : (isCold ? '#93c5fd' : (isHeatwave ? '#38bdf8' : '#7dd3fc'));
    let skyBot = isRain ? '#cbd5e1' : (isCold ? '#dbeafe' : (isHeatwave ? '#fef3c7' : '#e0f2fe'));
    let beamRgb = isCold ? '186, 230, 253' : (isHeatwave ? '253, 224, 71' : '224, 242, 254');
    let floorAlpha = isRain ? 0.04 : (isHeatwave ? 0.12 : 0.09);
    let airAlpha = isRain ? 0.02 : (isHeatwave ? 0.055 : 0.04);
    let dustAlpha = isHeatwave ? 0.14 : 0.08;
    let beamDx = 1.1;
    let beamDy = 0.85;

    if (nightFactor > 0.01) {
      skyTop = lerpRgb([125, 211, 252], [15, 23, 42], nightFactor);
      skyBot = lerpRgb([224, 242, 254], [30, 27, 75], nightFactor);
      beamRgb = '99, 102, 241';
      floorAlpha = 0.06 * (1 - nightFactor * 0.6);
      airAlpha = 0.02 * (1 - nightFactor);
      dustAlpha = 0;
    }

    if (dawnFactor > 0.01) {
      skyTop = lerpRgb([125, 211, 252], [147, 197, 253], dawnFactor);
      skyBot = lerpRgb([224, 242, 254], [254, 243, 199], dawnFactor);
      beamRgb = '254, 243, 199';
      floorAlpha = 0.09 + 0.05 * dawnFactor;
      airAlpha = 0.04 + 0.03 * dawnFactor;
      dustAlpha = 0.14 * dawnFactor;
      beamDx = 1.45;
      beamDy = 0.75;
    }

    if (goldenFactor > 0.01) {
      skyTop = lerpRgb([125, 211, 252], [249, 115, 22], goldenFactor);
      skyBot = lerpRgb([224, 242, 254], [253, 224, 71], goldenFactor);
      beamRgb = '251, 146, 60';
      floorAlpha = 0.09 + 0.10 * goldenFactor;
      airAlpha = 0.04 + 0.06 * goldenFactor;
      dustAlpha = 0.10 + 0.28 * goldenFactor;
      beamDx = 2.0 + 0.7 * goldenFactor;
      beamDy = 0.68;
    }

    return {
      hour,
      isRain,
      isCold,
      isHeatwave,
      goldenFactor,
      dawnFactor,
      nightFactor,
      skyTop,
      skyBot,
      beamRgb,
      floorAlpha,
      airAlpha,
      dustAlpha,
      beamDx,
      beamDy
    };
  }

  function isExteriorNorthWindowTile(room, gx, gy, tS, tN) {
    if (!isAboveGroundWindowRoom(room)) return false;
    const southIsIndoor = isWalkableTile(tS) || tS === 7 || tS === 8;
    if (!southIsIndoor) return false;
    const isExteriorTop = tN === 0 || (isWallLike(tN) && getTileSafe(room, gx, gy - 2) === 0);
    if (!isExteriorTop) return false;
    // Skip walls directly behind tall equipment (projector, fume hood, tall fridge/cupboard/office fixtures)
    const objs = room.objects || [];
    for (let i = 0; i < objs.length; i++) {
      const o = objs[i];
      if (gx >= o.x && gx < o.x + o.w && (o.y === gy || o.y === gy + 1)) {
        if (o.type === 'projector' || o.type === 'fumehood' || o.type === 'chem_cupboard' ||
            o.type === 'fridge_4c' || o.type === 'freezer_20c' ||
            o.type === 'whiteboard' || o.type === 'bookshelf' || o.type === 'locker') {
          return false;
        }
      }
    }
    if (room.id === 'gordons_cafe') return gx % 2 === 0 || gy === 8;
    return gx % 2 === 1;
  }

  function isExteriorWestWindowTile(room, gx, gy, tW, tE) {
    if (!isAboveGroundWindowRoom(room)) return false;
    if (tW !== 0 || !isWalkableTile(tE)) return false;
    const objs = room.objects || [];
    for (let i = 0; i < objs.length; i++) {
      const o = objs[i];
      if (o.x === gx + 1 && gy >= o.y && gy < o.y + o.h) {
        if (o.type === 'fumehood' || o.type === 'chem_cupboard' || o.type === 'biotage' || o.type === 'buchi' ||
            o.type === 'whiteboard' || o.type === 'bookshelf' || o.type === 'locker') {
          return false;
        }
      }
    }
    if (room.id === 'gordons_cafe') return gy % 2 === 1;
    if (room.id === 'klb_3f') return gy >= 2 && gy <= 5 && gy % 2 === 0;
    return gy === 1 || gy === 8 || gy === 12 || gy === 16 || gy === 23;
  }

  // ============================================================================
  // 3/4 PERSPECTIVE WALLS, DOORS & FIRE EXIT RENDERING
  // ============================================================================
  function hasWallFixtureFront(room, gx, gy) {
    // Check if an object (like projector) sits directly on this wall cell or right in front of it
    const objs = room.objects || [];
    for (let i = 0; i < objs.length; i++) {
      const o = objs[i];
      if (gx >= o.x && gx < o.x + o.w && (o.y === gy || o.y === gy + 1)) {
        if (o.type === 'projector' || o.type === 'fumehood' || o.type === 'chem_cupboard' ||
            o.type === 'fridge_4c' || o.type === 'freezer_20c' || o.type === 'cafe_counter' ||
            o.type === 'whiteboard' || o.type === 'bookshelf' || o.type === 'locker') {
          return true;
        }
      }
    }
    return false;
  }

  function drawExteriorNorthWindow(ctx, px, fasciaTop, isCafe, nowSec, atmo) {
    const atm = atmo || getAtmosphereProfile(570, '');
    const winX = px + 6;
    const winY = fasciaTop + 3;
    const winW = TILE_W - 12;
    const winH = isCafe ? 11 : (WALL_H - 9);

    ctx.fillStyle = isCafe ? '#78350f' : '#475569';
    ctx.fillRect(winX - 1.5, winY - 1.5, winW + 3, winH + 3);
    const sg = ctx.createLinearGradient(0, winY, 0, winY + winH);
    sg.addColorStop(0, atm.skyTop);
    sg.addColorStop(1, atm.skyBot);
    ctx.fillStyle = sg;
    ctx.fillRect(winX, winY, winW, winH);

    // Nighttime UCL distant warm lit windows
    if (atm.nightFactor > 0.55) {
      ctx.fillStyle = 'rgba(253, 224, 71, 0.72)';
      ctx.fillRect(winX + 5, winY + 3, 3, 3.5);
      ctx.fillRect(winX + 22, winY + 4, 3, 3.5);
    }

    // Cool frost-blue glass tint & condensation rim during cold_230 (16.3 °C)
    if (atm.isCold) {
      ctx.fillStyle = 'rgba(147, 197, 253, 0.34)';
      ctx.fillRect(winX, winY, winW, winH);
      ctx.fillStyle = 'rgba(224, 242, 254, 0.50)';
      ctx.fillRect(winX + 1, winY + winH - 2.5, winW - 2, 2.2);
      ctx.fillRect(winX + 1, winY + 1, 5, 1.8);
      ctx.fillRect(winX + winW - 6, winY + 1, 5, 1.8);
    } else if (atm.isHeatwave) {
      // Subtle golden-amber solar glare inside pane during 30.1 °C heatwave
      ctx.fillStyle = 'rgba(251, 146, 60, 0.16)';
      ctx.fillRect(winX, winY, winW, winH);
    }

    // Animated diagonal rain streaks on window glass during rain
    if (atm.isRain) {
      ctx.strokeStyle = 'rgba(226, 232, 240, 0.55)';
      ctx.lineWidth = 0.9;
      const dropShift = (nowSec * 22) % 10;
      for (let r = 0; r < 3; r++) {
        const rx = winX + 5 + r * 10;
        const ry = winY + 1 + ((dropShift + r * 3) % Math.max(2, winH - 4));
        ctx.beginPath();
        ctx.moveTo(rx, ry);
        ctx.lineTo(rx - 2, ry + 4);
        ctx.stroke();
      }
    }

    // Specular sash reflection + crisp Georgian mullions
    ctx.fillStyle = 'rgba(255, 255, 255, 0.22)';
    ctx.beginPath();
    ctx.moveTo(winX + 3, winY);
    ctx.lineTo(winX + 12, winY);
    ctx.lineTo(winX + 5, winY + winH);
    ctx.lineTo(winX, winY + winH);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = isCafe ? '#fef3c7' : '#f8fafc';
    ctx.fillRect(winX + Math.round(winW * 0.5) - 1, winY, 2, winH);
    if (!isCafe) {
      ctx.fillRect(winX, winY + Math.round(winH * 0.52) - 1, winW, 2);
    }
    ctx.strokeStyle = isCafe ? '#fef3c7' : '#f8fafc';
    ctx.lineWidth = 1.2;
    ctx.strokeRect(winX + 0.5, winY + 0.5, winW - 1, winH - 1);

    // Sunlit window sill glint
    ctx.fillStyle = atm.goldenFactor > 0.2 ? '#fed7aa' : (isCafe ? '#d97706' : '#e2e8f0');
    ctx.fillRect(winX - 2, winY + winH + 0.5, winW + 4, 2.5);
  }

  function drawWallCell(ctx, room, gx, gy, tileId, fireAlarmActive, nowSec, atmo) {
    const px = gx * TILE_W;
    const py = gy * TILE_H;

    const tN = getTileSafe(room, gx, gy - 1);
    const tS = getTileSafe(room, gx, gy + 1);
    const tW = getTileSafe(room, gx - 1, gy);
    const tE = getTileSafe(room, gx + 1, gy);
    const northIsIndoor = isWalkableTile(tN) || tN === 7 || tN === 8;
    const capOverhang = northIsIndoor ? 0 : WALL_CAP_OVERHANG;

    // ---- CASE 7: STANDARD WARM-OAK LAB DOOR ----
    if (tileId === 7) {
      const horizWall = isWallLike(tW) || isWallLike(tE);
      if (horizWall) {
        // Doorway set into East-West horizontal wall
        ctx.fillStyle = '#94a3b8';
        ctx.fillRect(px + 4, py + TILE_H - 5, TILE_W - 8, 4); // aluminium threshold plate

        // Left & Right oak door jambs
        ctx.fillStyle = '#78350f';
        ctx.fillRect(px, py - capOverhang, 6, TILE_H + capOverhang);
        ctx.fillRect(px + TILE_W - 6, py - capOverhang, 6, TILE_H + capOverhang);

        // Overhead transom header + Georgian wired glass transom light
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(px, py - capOverhang, TILE_W, 4 + capOverhang);
        ctx.fillStyle = '#92400e';
        ctx.fillRect(px + 4, py + 4, TILE_W - 8, 9);
        ctx.fillStyle = 'rgba(186, 230, 253, 0.55)';
        ctx.fillRect(px + 8, py + 6, TILE_W - 16, 5);

        // Angled open warm-oak lab door leaf swung ajar on right jamb
        ctx.beginPath();
        ctx.moveTo(px + TILE_W - 6, py + 12);
        ctx.lineTo(px + TILE_W - 17, py + 20);
        ctx.lineTo(px + TILE_W - 17, py + TILE_H + 3);
        ctx.lineTo(px + TILE_W - 6, py + TILE_H - 2);
        ctx.closePath();
        ctx.fillStyle = '#b45309';
        ctx.fill();
        ctx.strokeStyle = '#451a03';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Georgian wire-glass vision panel on open leaf
        ctx.fillStyle = 'rgba(186, 230, 253, 0.75)';
        ctx.fillRect(px + TILE_W - 14, py + 22, 5, 11);
      } else {
        // Doorway set into North-South vertical wall (e.g. (21,12) on klb_2f, (17,2) & (20,2) on klb_3f)
        ctx.fillStyle = '#94a3b8';
        ctx.fillRect(px + TILE_W * 0.5 - 3, py + 2, 6, TILE_H - 4); // threshold strip

        // North & South oak jamb posts
        ctx.fillStyle = '#78350f';
        ctx.fillRect(px + 10, py - capOverhang, TILE_W - 20, 1 + capOverhang);
        ctx.fillRect(px + 10, py + TILE_H - 6, TILE_W - 20, 6);

        // Open warm-oak lab door leaf swung into doorway with vision panel + push plate
        fillRoundRect(ctx, px + 14, py + 1, 22, 16, 2, '#d97706', '#451a03', 1.2);
        ctx.fillStyle = '#b45309';
        ctx.fillRect(px + 15, py + 12, 20, 5);
        // Vision glass panel
        ctx.fillStyle = 'rgba(186, 230, 253, 0.78)';
        ctx.fillRect(px + 18, py + 3, 7, 7);
        // Brass push plate
        ctx.fillStyle = '#fde047';
        ctx.fillRect(px + 29, py + 5, 3, 6);
      }
      return;
    }

    // ---- CASE 8: HEAVY EMERGENCY FIRE EXIT DOOR (e.g. (9,2) on klb_2f) ----
    if (tileId === 8) {
      // Heavy steel emergency frame on West exterior wall
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(px, py - WALL_CAP_OVERHANG, 20, TILE_H + WALL_CAP_OVERHANG);

      // Emerald-green heavy fire door leaf in 3/4 perspective facing East into lab
      ctx.fillStyle = '#065f46';
      ctx.fillRect(px + 18, py - 2, 18, TILE_H);
      ctx.strokeStyle = '#022c22';
      ctx.lineWidth = 1.3;
      ctx.strokeRect(px + 18.5, py - 1.5, 17, TILE_H - 1);

      // Silver horizontal panic crash push-bar + red end-caps
      ctx.fillStyle = '#dc2626';
      ctx.fillRect(px + 20, py + 18, 3, 5);
      ctx.fillRect(px + 31, py + 18, 3, 5);
      ctx.fillStyle = '#e2e8f0';
      ctx.fillRect(px + 22, py + 19, 10, 3);

      // Glowing green ISO running-man "EXIT" lightbox mounted above the door!
      const signX = px + 11;
      const signY = py - 16;
      ctx.save();
      ctx.shadowColor = '#10b981';
      ctx.shadowBlur = 8;
      fillRoundRect(ctx, signX, signY, 30, 12, 2, '#059669', '#a7f3d0', 1);
      ctx.restore();
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 7.5px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('EXIT', signX + 15, signY + 6.5);

      // Emergency red xenon strobe beacon above Fire Exit (flashes brightly during fire alarm!)
      const strobeX = px + 6;
      const strobeY = py - 14;
      const pulse = fireAlarmActive ? (0.5 + 0.5 * Math.sin(nowSec * 14)) : 0;
      ctx.fillStyle = fireAlarmActive ? (pulse > 0.45 ? '#ef4444' : '#991b1b') : '#7f1d1d';
      ctx.beginPath();
      ctx.arc(strobeX, strobeY, 4.5, 0, Math.PI * 2);
      ctx.fill();
      if (fireAlarmActive && pulse > 0.35) {
        ctx.save();
        const rg = ctx.createRadialGradient(strobeX, strobeY, 2, strobeX, strobeY, 44);
        rg.addColorStop(0, 'rgba(239, 68, 68, 0.75)');
        rg.addColorStop(1, 'rgba(239, 68, 68, 0)');
        ctx.fillStyle = rg;
        ctx.beginPath();
        ctx.arc(strobeX, strobeY, 44, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
      return;
    }

    // ---- CASE 6: GLASS PARTITION ----
    if (tileId === 6) {
      const capY = py - capOverhang;
      ctx.fillStyle = '#334155';
      ctx.fillRect(px, capY, TILE_W, 6 + capOverhang);
      ctx.fillStyle = 'rgba(125, 211, 252, 0.38)';
      ctx.fillRect(px + 2, capY + 6 + capOverhang, TILE_W - 4, TILE_H - 6);
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(px + 1, capY + 1, TILE_W - 2, TILE_H + capOverhang - 2);
      // Specular glass streak
      ctx.strokeStyle = 'rgba(255,255,255,0.65)';
      ctx.beginPath();
      ctx.moveTo(px + 10, capY + 9 + capOverhang);
      ctx.lineTo(px + 20, capY + TILE_H);
      ctx.stroke();
      return;
    }

    // ---- CASE 5: SOLID ARCHITECTURAL WALL (3/4 POKÉMON CUTAWAY + FRONT FASCIA) ----
    const southIsIndoor = isWalkableTile(tS) || tS === 7 || tS === 8;
    const southIsWall = isWallLike(tS);
    const northIsWall = isWallLike(tN);
    const westIsWall = isWallLike(tW);
    const eastIsWall = isWallLike(tE);

    const capTop = py - capOverhang;
    const capH = TILE_H + capOverhang - WALL_H; // 18px exterior, 12px interior divider (never slices y-1!)

    if (southIsIndoor) {
      // NORTH / BACK WALL WITH VISIBLE 30px PAINTED INTERIOR PLASTER FASCIA!
      const fasciaTop = py + TILE_H - WALL_H;           // py + 12 .. py + 42 (30px tall!)

      // 1. Dark Slate Top Roof Cap
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(px, capTop, TILE_W, capH);
      ctx.fillStyle = '#334155';
      ctx.fillRect(px, capTop + capH - 3, TILE_W, 3); // front roof cornice bevel

      // 2. Painted Vertical Plaster Fascia (tinted subtly by room palette)
      const isCafe = room.id === 'gordons_cafe';
      const isOffice = room.id === 'klb_3f' || room.id === 'meeting_room';
      const plasterTop = isCafe ? '#f5e6cc' : (isOffice ? '#eef2f8' : '#e8eef5');
      const plasterBot = isCafe ? '#ead4b0' : (isOffice ? '#dde5f0' : '#d5e0ec');

      const wg = ctx.createLinearGradient(0, fasciaTop, 0, py + TILE_H);
      wg.addColorStop(0, plasterTop);
      wg.addColorStop(1, plasterBot);
      ctx.fillStyle = wg;
      ctx.fillRect(px, fasciaTop, TILE_W, WALL_H);

      // Top shadow under ceiling cornice
      ctx.fillStyle = 'rgba(15, 23, 42, 0.16)';
      ctx.fillRect(px, fasciaTop, TILE_W, 3);

      if (isCafe) {
        // Warm Gordon's Café timber dado rail + wainscoting
        ctx.fillStyle = '#78350f';
        ctx.fillRect(px, fasciaTop + 15, TILE_W, 2.5);
        ctx.fillStyle = '#92400e';
        ctx.fillRect(px, fasciaTop + 17.5, TILE_W, WALL_H - 21.5);
        if (isExteriorNorthWindowTile(room, gx, gy, tS, tN)) {
          drawExteriorNorthWindow(ctx, px, fasciaTop, true, nowSec, atmo);
        }
      } else {
        // Authentic UCL Lab / Office white PVC dado electrical trunking + UK twin 13A sockets!
        const trunkY = fasciaTop + 14;
        ctx.fillStyle = '#cbd5e1';
        ctx.fillRect(px, trunkY, TILE_W, 5);
        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(px, trunkY + 1, TILE_W, 2.5);
        ctx.fillStyle = '#94a3b8';
        ctx.fillRect(px, trunkY + 4.2, TILE_W, 0.8);

        // UK Twin 13A Socket every other tile
        if ((gx + gy) % 2 === 0) {
          const sx = px + 30;
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(sx, trunkY + 0.5, 9, 4);
          ctx.fillStyle = '#dc2626'; // tiny red UK rocker switches!
          ctx.fillRect(sx + 2, trunkY + 1.5, 1.5, 1.2);
          ctx.fillRect(sx + 5.5, trunkY + 1.5, 1.5, 1.2);
        }

        // Occasional UCL Safety Poster / Periodic Table / Georgian Sash Window!
        if (isExteriorNorthWindowTile(room, gx, gy, tS, tN)) {
          drawExteriorNorthWindow(ctx, px, fasciaTop, false, nowSec, atmo);
        } else if (!hasWallFixtureFront(room, gx, gy)) {
          const decoRoll = hash2D(gx, gy, 313);
          if (decoRoll > 0.74) {
            // COSHH / Safety / NMR Chemical Shift Poster
            const postX = px + 8;
            const postY = fasciaTop + 3;
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(postX, postY, 16, 10);
            ctx.strokeStyle = '#64748b';
            ctx.lineWidth = 0.8;
            ctx.strokeRect(postX + 0.5, postY + 0.5, 15, 9);
            ctx.fillStyle = decoRoll > 0.87 ? '#2563eb' : '#10b981';
            ctx.fillRect(postX + 1.5, postY + 1.5, 13, 2.5);
            ctx.fillStyle = '#94a3b8';
            ctx.fillRect(postX + 2, postY + 5.5, 11, 1);
            ctx.fillRect(postX + 2, postY + 7.5, 8, 1);
          }
        }
      }

      // 3. Dark Slate / Timber Skirting Board at the floor line
      ctx.fillStyle = isCafe ? '#451a03' : '#334155';
      ctx.fillRect(px, py + TILE_H - 4, TILE_W, 4);
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(px, py + TILE_H - 1, TILE_W, 1);

    } else if (southIsWall) {
      // VERTICAL SIDE / INTERIOR WALL CONTINUING SOUTH: Full continuous dark cutaway roof cap!
      const capSpanH = TILE_H;
      const cheekTop = py;
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(px, capTop, TILE_W, capSpanH);

      // Subtle inner side-wall cheek bevel where bordering indoor floor on East or West
      if (isWalkableTile(tE)) {
        if (isExteriorWestWindowTile(room, gx, gy, tW, tE)) {
          const atm = atmo || getAtmosphereProfile(570, '');
          const wg = ctx.createLinearGradient(0, cheekTop, 0, cheekTop + capSpanH);
          wg.addColorStop(0, atm.skyTop);
          wg.addColorStop(1, atm.skyBot);
          ctx.fillStyle = wg;
          ctx.fillRect(px + TILE_W - 6, cheekTop, 5, capSpanH - 4);
          if (atm.isCold) {
            ctx.fillStyle = 'rgba(147, 197, 253, 0.36)';
            ctx.fillRect(px + TILE_W - 6, cheekTop, 5, capSpanH - 4);
          } else if (atm.isHeatwave) {
            ctx.fillStyle = 'rgba(251, 146, 60, 0.16)';
            ctx.fillRect(px + TILE_W - 6, cheekTop, 5, capSpanH - 4);
          } else if (atm.isRain) {
            ctx.fillStyle = 'rgba(226, 232, 240, 0.42)';
            const rOff = (nowSec * 18 + gy * 7) % Math.max(4, capSpanH - 10);
            ctx.fillRect(px + TILE_W - 5, cheekTop + 2 + rOff, 2, 4);
          }
          ctx.fillStyle = '#f8fafc';
          ctx.fillRect(px + TILE_W - 6, cheekTop, 5, 2);
          ctx.fillRect(px + TILE_W - 6, cheekTop + Math.round(capSpanH * 0.5) - 3, 5, 2);
          ctx.fillRect(px + TILE_W - 6, cheekTop + capSpanH - 6, 5, 2);
        } else {
          ctx.fillStyle = '#cbd5e1';
          ctx.fillRect(px + TILE_W - 6, cheekTop, 5, capSpanH);
        }
        ctx.fillStyle = '#334155';
        ctx.fillRect(px + TILE_W - 2, cheekTop, 2, capSpanH);
      }
      if (isWalkableTile(tW)) {
        ctx.fillStyle = '#cbd5e1';
        ctx.fillRect(px + 1, cheekTop, 5, capSpanH);
        ctx.fillStyle = '#334155';
        ctx.fillRect(px, cheekTop, 2, capSpanH);
      }
    } else {
      // SOUTH PERIMETER CUTAWAY WALL (south is Void 0):
      // Start strictly at py (never py - WALL_CAP_OVERHANG!) so south-row furniture (e.g. klb_3f y=5) is never clipped!
      const effCapTop = py;
      const southCapH = 20;
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(px, effCapTop, TILE_W, southCapH);
      ctx.fillStyle = '#334155';
      ctx.fillRect(px, effCapTop + southCapH - 3, TILE_W, 3);

      // Exterior building stone/slate plinth dropping into the void
      const extTop = effCapTop + southCapH;
      const extH = (py + TILE_H) - extTop;
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(px, extTop, TILE_W, extH);
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(px + 1, extTop + 2, TILE_W - 2, extH - 5);
    }

    // Auto-tiled crisp Pokémon outer bevel borders around connected wall roof caps
    const borderTop = (!southIsIndoor && !southIsWall) ? py : capTop;
    const borderSideH = southIsIndoor ? capH : (southIsWall ? TILE_H : 20);
    const darkSideH = southIsIndoor ? capH : TILE_H;
    ctx.fillStyle = '#475569';
    if (!northIsWall) ctx.fillRect(px, borderTop, TILE_W, 2);
    if (!westIsWall) ctx.fillRect(px, borderTop, 2, borderSideH);
    if (!eastIsWall) ctx.fillRect(px + TILE_W - 2, borderTop, 2, borderSideH);

    ctx.fillStyle = '#090d16';
    if (!northIsWall) ctx.fillRect(px, borderTop, TILE_W, 1);
    if (!westIsWall) ctx.fillRect(px, borderTop, 1, darkSideH);
    if (!eastIsWall) ctx.fillRect(px + TILE_W - 1, borderTop, 1, darkSideH);
  }

  // ============================================================================
  // RICH 3/4 OBLIQUE 2.5D FIXTURE ARTWORK FOR ALL ASSET TYPES
  // ============================================================================

  const INSTRUMENT_STATION_TYPES = new Set([
    'nmr_magnet', 'lcms_unit', 'maldi_unit', 'buchi', 'biotage',
    'gel_tank', 'centrifuge', 'pc_terminal', 'writeup_desk',
    'tea_drawer', 'cafe_counter', 'cafe_table', 'chem_cupboard',
    'balance_table', 'fridge_4c', 'tlc_station'
  ]);

  function getStationJobList(source) {
    if (!source) return [];
    if (Array.isArray(source)) return source.filter(Boolean);
    if (typeof source === 'object' &&
        ('activeStationJobs' in source || 'activeReactions' in source ||
         'room' in source || 'roomId' in source || 'player' in source ||
         'npcs' in source || 'speechBubbles' in source)) {
      const jobs = Array.isArray(source.activeStationJobs)
        ? source.activeStationJobs
        : (source.activeStationJobs && typeof source.activeStationJobs === 'object' ? Object.values(source.activeStationJobs) : []);
      const rxns = Array.isArray(source.activeReactions)
        ? source.activeReactions
        : (source.activeReactions && typeof source.activeReactions === 'object' ? Object.values(source.activeReactions) : []);
      if (!jobs.length) return rxns.filter(Boolean);
      if (!rxns.length) return jobs.filter(Boolean);
      const seen = new Set();
      const merged = [];
      for (let i = 0; i < jobs.length; i++) {
        const j = jobs[i];
        if (!j) continue;
        if (j.id) seen.add(j.id);
        merged.push(j);
      }
      for (let i = 0; i < rxns.length; i++) {
        const r = rxns[i];
        if (!r) continue;
        if (r.id && seen.has(r.id)) continue;
        merged.push(r);
      }
      return merged;
    }
    return Object.values(source).filter(Boolean);
  }

  function isInstrumentOrWorkupJob(rxn, targetObj) {
    if (!rxn) return false;
    const k = String(rxn.kind || rxn.jobType || rxn.category || rxn.type || '').toLowerCase();
    if (k === 'reaction' || k === 'chem' || k === 'chemical') return false;
    if (k === 'instrument' || k === 'workup' || k === 'analysis' || k === 'prep' || k === 'coffee' || k === 'tea') return true;
    const stType = rxn.stationType || rxn.objType || (targetObj && targetObj.type) || '';
    if (stType === 'fridge_4c' && Number(rxn.sweetSpotMins) > 0) return false;
    if (stType && INSTRUMENT_STATION_TYPES.has(stType)) return true;
    const idStr = String(rxn.objId || rxn.stationId || '').toLowerCase();
    if (/(nmr|lcms|maldi|buchi|biotage|gel|centrifuge|pc|desk|tea|cafe|cupboard|balance|tlc)/.test(idStr)) return true;
    return false;
  }

  function jobMatchesObj(r, objOrId, roomId) {
    if (!r || !objOrId) return false;
    const obj = (typeof objOrId === 'object') ? objOrId : null;
    const objId = obj ? obj.id : String(objOrId);
    const rxnRoom = r.roomId || r.room;
    if (rxnRoom && roomId && rxnRoom !== roomId) return false;
    const targetId = r.objId || r.stationId || r.workstationId || r.hoodId || r.fixtureId || r.targetObjId;
    if (targetId && objId && targetId === objId) return true;
    if (obj && typeof r.x === 'number' && typeof r.y === 'number') {
      if (r.x >= obj.x && r.x < obj.x + obj.w && r.y >= obj.y && r.y < obj.y + obj.h) return true;
    }
    return false;
  }

  function findActiveReactionForObj(obj, activeReactions, roomId) {
    if (!activeReactions || !obj) return null;
    const list = Array.isArray(activeReactions) ? activeReactions : Object.values(activeReactions);
    for (let i = 0; i < list.length; i++) {
      if (jobMatchesObj(list[i], obj, roomId)) return list[i];
    }
    return null;
  }

  function findNpcReactionForObj(obj, npcReactions, roomId) {
    if (!npcReactions || !obj) return null;
    const list = Array.isArray(npcReactions) ? npcReactions : Object.values(npcReactions);
    for (let i = 0; i < list.length; i++) {
      if (jobMatchesObj(list[i], obj, roomId)) return list[i];
    }
    return null;
  }

  function getActiveJobForObj(renderState, roomId, objOrId) {
    if (!renderState || !objOrId) return null;
    const jobs = getStationJobList(renderState);
    for (let i = 0; i < jobs.length; i++) {
      if (jobMatchesObj(jobs[i], objOrId, roomId)) return jobs[i];
    }
    const act = renderState.activePlayerAction;
    if (act && jobMatchesObj(act, objOrId, roomId)) return act;
    if (renderState.npcReactions) {
      const npcList = Array.isArray(renderState.npcReactions)
        ? renderState.npcReactions
        : Object.values(renderState.npcReactions);
      for (let i = 0; i < npcList.length; i++) {
        if (jobMatchesObj(npcList[i], objOrId, roomId)) return npcList[i];
      }
    }
    return null;
  }

  function getRoomInstrumentJobForPc(renderState, room, obj) {
    if (!renderState || !room || !obj) return null;
    const isNmrPc = obj.id === 'obj_nmr_pc' || room.id === 'cib_lg1b_nmr';
    const isMsPc = obj.id === 'obj_ms_pc' || room.id === 'cib_lg11_ms';
    if (!isNmrPc && !isMsPc) return null;
    const matchTypes = isNmrPc ? new Set(['nmr_magnet']) : new Set(['lcms_unit', 'maldi_unit']);
    const objs = Array.isArray(room.objects) ? room.objects : [];
    const objById = new Map();
    for (let i = 0; i < objs.length; i++) objById.set(objs[i].id, objs[i]);

    const checkList = getStationJobList(renderState).concat(
      Array.isArray(renderState.npcReactions) ? renderState.npcReactions : []
    );
    for (let i = 0; i < checkList.length; i++) {
      const j = checkList[i];
      if (!j) continue;
      const jr = j.roomId || j.room;
      if (jr && jr !== room.id) continue;
      const tid = j.objId || j.stationId || j.workstationId || j.fixtureId;
      const target = tid ? objById.get(tid) : null;
      const stType = j.stationType || j.objType || (target && target.type) || '';
      if (matchTypes.has(stType)) return j;
    }
    return null;
  }

  function classifyReactionStatus(rxn, targetObj) {
    if (!rxn) return 'running';
    const s = String(rxn.status || rxn.state || '').toLowerCase();
    if (rxn.overcooking || rxn.isOvercooking || s.includes('over') || s.includes('danger') || s.includes('burn')) {
      return 'overcooking';
    }
    if (rxn.isReady || s === 'ready' || s.includes('ready') || s.includes('complete') || s.includes('done')) {
      return 'ready';
    }
    if (rxn.inSweetSpot || rxn.isSweetSpot || rxn.sweetSpot ||
        s.includes('sweet') || s.includes('optimal') || s.includes('quench')) {
      return 'sweet_spot';
    }
    if (typeof rxn.elapsedMins === 'number') {
      if (typeof rxn.maxMins === 'number' && rxn.elapsedMins > rxn.maxMins) return 'overcooking';
      if (typeof rxn.targetMins === 'number' && rxn.targetMins > 0 &&
          typeof rxn.sweetSpotMins === 'number' && rxn.sweetSpotMins > 0 &&
          rxn.elapsedMins >= rxn.targetMins + rxn.sweetSpotMins) {
        return 'overcooking';
      }
      if (typeof rxn.targetMins === 'number' && rxn.targetMins > 0 && rxn.elapsedMins >= rxn.targetMins) {
        if (isInstrumentOrWorkupJob(rxn, targetObj) && !(Number(rxn.sweetSpotMins) > 0)) return 'ready';
        return 'sweet_spot';
      }
      if (typeof rxn.minMins === 'number' && rxn.elapsedMins >= rxn.minMins) return 'sweet_spot';
    }
    return 'running';
  }

  function getReactionProgress(rxn) {
    if (!rxn) return 0;
    if (typeof rxn.progress === 'number' && Number.isFinite(rxn.progress)) {
      return rxn.progress > 1.5 ? clamp(rxn.progress / 100, 0, 1) : clamp(rxn.progress, 0, 1);
    }
    if (typeof rxn.elapsedMins === 'number' && typeof rxn.targetMins === 'number' && rxn.targetMins > 0) {
      return clamp(rxn.elapsedMins / rxn.targetMins, 0, 1);
    }
    if (typeof rxn.elapsedMs === 'number' && typeof rxn.durationMs === 'number' && rxn.durationMs > 0) {
      return clamp(rxn.elapsedMs / rxn.durationMs, 0, 1);
    }
    if (typeof rxn.elapsedSec === 'number' && typeof rxn.durationSec === 'number' && rxn.durationSec > 0) {
      return clamp(rxn.elapsedSec / rxn.durationSec, 0, 1);
    }
    const st = classifyReactionStatus(rxn);
    if (st === 'ready' || st === 'sweet_spot' || st === 'overcooking') return 1;
    return 0;
  }

  function isPersonNearObj(obj, renderState, room) {
    if (!renderState) return false;
    const cx = obj.x + obj.w * 0.5 - 0.5;
    const cy = obj.y + obj.h * 0.5 - 0.5;
    const checkEnt = function (ent) {
      if (!ent || ent.visible === false || ent.present === false) return false;
      const eRoom = ent.room || ent.roomId;
      if (eRoom && room && eRoom !== room.id) return false;
      const dx = Math.max(0, obj.x - Number(ent.x), Number(ent.x) - (obj.x + obj.w - 1));
      const dy = Math.max(0, obj.y - Number(ent.y), Number(ent.y) - (obj.y + obj.h - 1));
      if (Math.hypot(dx, dy) <= 1.65) return true;
      return Math.hypot(Number(ent.x) - cx, Number(ent.y) - cy) <= 1.9;
    };
    if (checkEnt(renderState.player)) return true;
    const rawNpcs = Array.isArray(renderState.npcs)
      ? renderState.npcs
      : (renderState.npcs && typeof renderState.npcs === 'object' ? Object.values(renderState.npcs) : []);
    for (let i = 0; i < rawNpcs.length; i++) {
      if (checkEnt(rawNpcs[i])) return true;
    }
    return false;
  }

  function getHoodSashHeight(obj, renderState, room, dt) {
    const attended = isPersonNearObj(obj, renderState, room);
    const target = attended ? 15 : 23;
    const cur = hoodSashState.has(obj.id) ? hoodSashState.get(obj.id) : target;
    const step = cur + (target - cur) * Math.min(1, (dt || 0.016) * 8);
    const next = Math.abs(target - step) < 0.05 ? target : step;
    hoodSashState.set(obj.id, next);
    return next;
  }

  function drawAnimatedFlaskContents(ctx, fx, fy, liqColor, nowSec, phaseSeed, showVortex) {
    // Round-bottom flask glass & liquid with conical vortex dimple + spinning PTFE stir-bar
    ctx.fillStyle = 'rgba(226, 232, 240, 0.86)';
    ctx.beginPath();
    ctx.arc(fx, fy, 5.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = liqColor;
    ctx.beginPath();
    ctx.arc(fx, fy + 1, 4.2, 0.15, Math.PI - 0.15);
    if (showVortex) {
      const dip = 1.4 + Math.sin(nowSec * 11 + phaseSeed) * 0.4;
      ctx.lineTo(fx, fy + 1.2 + dip);
    }
    ctx.closePath();
    ctx.fill();

    if (showVortex) {
      // Spinning white PTFE magnetic stir-bar oscillating horizontally
      const barHalf = Math.max(0.7, Math.abs(Math.cos(nowSec * 15 + phaseSeed)) * 2.8);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(fx - barHalf, fy + 3.4, barHalf * 2, 1.3);
    }
  }

  function drawHoodSweetGlow(ctx, x, y, w, h, nowSec) {
    const pulse = 0.5 + 0.5 * Math.sin(nowSec * 3.6);
    const cx = x + w * 0.5;
    const cy = y + h * 0.5;
    const rad = Math.max(w, h) * 0.65;
    ctx.save();
    const rg = ctx.createRadialGradient(cx, cy, 3, cx, cy, rad);
    rg.addColorStop(0, 'rgba(74, 222, 128, ' + (0.24 + 0.08 * pulse).toFixed(3) + ')');
    rg.addColorStop(0.58, 'rgba(250, 204, 21, ' + (0.12 + 0.05 * pulse).toFixed(3) + ')');
    rg.addColorStop(1, 'rgba(74, 222, 128, 0)');
    ctx.fillStyle = rg;
    ctx.fillRect(x, y, w, h);
    ctx.strokeStyle = 'rgba(74, 222, 128, ' + (0.45 + 0.25 * pulse).toFixed(3) + ')';
    ctx.lineWidth = 1.25;
    ctx.strokeRect(x + 0.8, y + 0.8, w - 1.6, h - 1.6);
    ctx.restore();
  }

  function drawHoodOvercookedHazard(ctx, x, y, w, h, nowSec, seed) {
    const pulse = 0.5 + 0.5 * Math.sin(nowSec * 6.5);
    const cx = x + w * 0.5;
    const cy = y + h * 0.45;
    const rad = Math.max(w, h) * 0.68;
    ctx.save();
    // Pulsing crimson hazard halo around the overcooked hood bay
    const halo = ctx.createRadialGradient(cx, cy, 6, cx, cy, rad);
    halo.addColorStop(0, 'rgba(239, 68, 68, ' + (0.14 + 0.14 * pulse).toFixed(3) + ')');
    halo.addColorStop(0.62, 'rgba(220, 38, 38, ' + (0.08 + 0.08 * pulse).toFixed(3) + ')');
    halo.addColorStop(1, 'rgba(239, 68, 68, 0)');
    ctx.fillStyle = halo;
    ctx.beginPath();
    ctx.arc(cx, cy, rad, 0, Math.PI * 2);
    ctx.fill();

    // Pulsing crimson hazard outline
    ctx.strokeStyle = 'rgba(248, 113, 113, ' + (0.45 + 0.40 * pulse).toFixed(3) + ')';
    ctx.lineWidth = 1.8;
    ctx.strokeRect(x + 1, y + 1, w - 2, h - 2);

    // Subtle rising dark-amber & smoky-grey vapour wisps
    const wispCount = 5;
    const s = seed || 0;
    for (let i = 0; i < wispCount; i++) {
      const phase = (nowSec * 0.62 + i * (1 / wispCount) + s * 0.17) % 1;
      const wx = x + w * (0.22 + (i % 3) * 0.28) + Math.sin(nowSec * 2.4 + i * 1.9 + s) * 5;
      const wy = y + 10 - phase * 26;
      const r = 3.2 + phase * 4.6;
      const alpha = (1 - phase) * (0.30 + 0.10 * pulse);
      ctx.fillStyle = (i % 2 === 0)
        ? ('rgba(120, 53, 15, ' + alpha.toFixed(3) + ')')
        : ('rgba(71, 85, 105, ' + (alpha * 0.9).toFixed(3) + ')');
      ctx.beginPath();
      ctx.arc(wx, wy, r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  // 1. FUME HOOD (Horizontal 2x1, North-Facing Cutaway 2x1 on South Wall, AND Side 1x2 + Animated Sash!)
  function drawFumeHood(ctx, room, obj, stackedChildren, rxn, npcRxn, nowSec, renderFixtureFn, renderState, dt) {
    const px = obj.x * TILE_W;
    const py = obj.y * TILE_H;
    const pw = obj.w * TILE_W;
    const ph = obj.h * TILE_H;
    const grp = GROUP_PALETTE[obj.group] || GROUP_PALETTE.none;
    const rise = 30;
    const deckZ = 14; // Interior work surface height

    const rxStatus = rxn
      ? classifyReactionStatus(rxn, obj)
      : (npcRxn ? classifyReactionStatus(npcRxn, obj) : null);
    const isOvercooked = rxStatus === 'overcooking';
    const isSweet = rxStatus === 'sweet_spot' || (Boolean(rxn) && rxStatus === 'ready');
    const hoodSeed = (obj.x * 7 + obj.y * 13) % 17;

    const isVertical = obj.h > obj.w;
    const westWall = isWallLike(getTileSafe(room, obj.x - 1, obj.y));
    const eastWall = isWallLike(getTileSafe(room, obj.x + obj.w, obj.y));
    const southWall = !isVertical &&
      isWallLike(getTileSafe(room, obj.x, obj.y + obj.h)) &&
      isWalkableTile(getTileSafe(room, obj.x, obj.y - 1));

    const animSashH = getHoodSashHeight(obj, renderState, room, dt);

    if (!isVertical && southWall) {
      // ---- NORTH-AISLE CUTAWAY 2x1 FUME HOOD (e.g. Chudasama (15,8) & (19,8) backed onto y=9 wall!) ----
      // Low 22px cutaway profile so researcher at y=7 is never hidden, and rear spine sits flush at py+ph-6!
      const cutTopY = py - 18;
      const rearTopY = py + ph - 12;

      // Clean cutaway chassis side cheeks & interior cavity opening toward North (y=7)
      ctx.fillStyle = '#f1f5f9';
      ctx.fillRect(px + 1, cutTopY, pw - 2, ph + 12);

      // Illuminated aerodynamic interior cavity
      const cavX = px + 6;
      const cavY = cutTopY + 5;
      const cavW = pw - 12;
      const cavH = (py + ph - 6) - cavY;
      ctx.fillStyle = isOvercooked ? '#fef2f2' : (isSweet ? '#ecfdf5' : (rxn ? '#f0fdf4' : (npcRxn ? '#ecfeff' : '#f8fafc')));
      ctx.fillRect(cavX, cavY, cavW, cavH);
      if (isSweet) {
        drawHoodSweetGlow(ctx, cavX, cavY, cavW, cavH, nowSec);
      }

      // Dark Trespa chemical work deck inside cutaway hood
      const deckTopY = py + ph - deckZ - 16;
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(cavX, deckTopY, cavW, 16);

      // Determine occupied sub-cells so default glassware doesn't collide with Base Bath / Syringe Pump
      const occupiedCells = new Set();
      if (stackedChildren) {
        for (let i = 0; i < stackedChildren.length; i++) {
          const ch = stackedChildren[i];
          for (let cx = ch.x; cx < ch.x + ch.w; cx++) occupiedCells.add(cx);
        }
      }

      for (let cx = obj.x; cx < obj.x + obj.w; cx++) {
        if (occupiedCells.has(cx)) continue;
        const cellX = cx * TILE_W;
        const stirX = cellX + 16;
        const stirY = deckTopY + 5;
        ctx.fillStyle = '#e2e8f0';
        ctx.fillRect(stirX, stirY, 16, 7);
        if (rxn) {
          ctx.strokeStyle = isOvercooked ? '#ef4444' : (isSweet ? '#4ade80' : '#f59e0b');
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(stirX + 8, stirY + 3, 6 + Math.sin(nowSec * 7) * 1.2, 0, Math.PI * 2);
          ctx.stroke();
        } else if (npcRxn) {
          const npcMix = 0.5 + 0.5 * Math.sin(nowSec * 4.2 + cx);
          ctx.strokeStyle = npcMix > 0.45 ? '#14b8a6' : '#f59e0b';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(stirX + 8, stirY + 3, 6 + Math.sin(nowSec * 5.8 + cx) * 1.1, 0, Math.PI * 2);
          ctx.stroke();
        }
        const liqColor = (rxn && rxn.color)
          ? rxn.color
          : (rxn ? '#10b981' : (npcRxn ? (npcRxn.color || (cx % 2 === 0 ? '#14b8a6' : '#f59e0b')) : (cx % 2 === 0 ? '#38bdf8' : '#f59e0b')));
        drawAnimatedFlaskContents(ctx, stirX + 8, stirY - 3, liqColor, nowSec, cx, true);
        ctx.fillStyle = '#bae6fd';
        ctx.fillRect(stirX + 6.5, stirY - 15, 3, 8);
        if (rxn || npcRxn) {
          const bOff = (nowSec * 18) % 9;
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(stirX + 7, stirY - 4 - bOff, 2, 2);
        }
      }

      // Render stacked children (e.g. Base Bath (15,8) & Syringe Pump (20,8)) cleanly on deck
      if (stackedChildren && stackedChildren.length) {
        for (let i = 0; i < stackedChildren.length; i++) {
          renderFixtureFn(ctx, room, stackedChildren[i], null, deckZ, nowSec, true);
        }
      }

      // Rear utility spine + Schlenk manifold backed flush against y=9 wall (above py+ph-6 cap!)
      ctx.fillStyle = '#cbd5e1';
      ctx.fillRect(px + 2, rearTopY - 2, pw - 4, 8);
      ctx.fillStyle = grp.main;
      ctx.fillRect(px + 2, rearTopY - 3, pw - 4, 4);
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 1.3;
      ctx.beginPath();
      ctx.moveTo(cavX + 6, rearTopY);
      ctx.lineTo(cavX + cavW - 6, rearTopY);
      ctx.stroke();
      for (let sx = cavX + 14; sx < cavX + cavW - 8; sx += 18) {
        ctx.fillStyle = '#0284c7';
        ctx.fillRect(sx, rearTopY - 1.5, 2.5, 4);
      }

      // Digital Airflow Monitor (0.52 m/s) with animated green LED segments (flashes red on overcooked!)
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(px + pw - 24, rearTopY - 2.5, 18, 5);
      for (let seg = 0; seg < 3; seg++) {
        const segLit = ((Math.floor(nowSec * 3.5) + seg) % 3) !== 0;
        ctx.fillStyle = isOvercooked ? (segLit ? '#f87171' : '#7f1d1d') : (segLit ? '#4ade80' : '#166534');
        ctx.fillRect(px + pw - 22 + seg * 5, rearTopY - 1, 3.5, 2);
      }

      // Transparent North-edge cutaway safety glass sash (tracks animated sashH!)
      const northSashH = Math.round(animSashH * 0.65);
      ctx.fillStyle = 'rgba(125, 211, 252, 0.22)';
      ctx.fillRect(cavX, cutTopY + 5, cavW, northSashH);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.55)';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(cavX + 10, cutTopY + 7);
      ctx.lineTo(cavX + 18, cutTopY + 4 + northSashH);
      ctx.moveTo(cavX + cavW - 22, cutTopY + 7);
      ctx.lineTo(cavX + cavW - 14, cutTopY + 4 + northSashH);
      ctx.stroke();
      // North airfoil sill + sash grip bar
      ctx.fillStyle = '#334155';
      ctx.fillRect(px + 3, cutTopY + 2, pw - 6, 3);
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(cavX, cutTopY + 4 + northSashH, cavW, 2);

      // Crisp Pokémon cutaway outline (ends cleanly at py+ph-6 so y=9 wall cap never clips)
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1.3;
      ctx.strokeRect(px + 1.5, cutTopY + 0.5, pw - 3, ph + 12 - 1);

      if (isOvercooked) {
        drawHoodOvercookedHazard(ctx, px + 1, cutTopY, pw - 2, ph + 12, nowSec, hoodSeed);
      }

      // Draw highlighted/hovered outlines for stacked children AFTER hood sash so they stay crisp!
      if (stackedChildren && stackedChildren.length) {
        for (let i = 0; i < stackedChildren.length; i++) {
          drawChildFixtureHighlightIfNeeded(ctx, stackedChildren[i], deckZ, nowSec, renderState);
        }
      }
    } else if (!isVertical) {
      // ---- HORIZONTAL 2x1 SHOWCASE FUME HOOD ----
      // Base under-cupboard plinth (0 .. deckZ)
      ctx.fillStyle = '#cbd5e1';
      ctx.fillRect(px + 2, py + ph - deckZ, pw - 4, deckZ);
      ctx.fillStyle = '#334155';
      ctx.fillRect(px + 2, py + ph - 3, pw - 4, 3); // toe-kick
      // Under-hood solvent cupboard doors
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 1;
      ctx.strokeRect(px + 5, py + ph - deckZ + 2, pw * 0.5 - 7, deckZ - 5);
      ctx.strokeRect(px + pw * 0.5 + 2, py + ph - deckZ + 2, pw * 0.5 - 7, deckZ - 5);

      // Superstructure side pillars & top roof plane
      const topY = py - rise;
      ctx.fillStyle = '#f1f5f9';
      ctx.fillRect(px + 1, topY, pw - 2, ph + rise - deckZ);

      // Illuminated white aerodynamic interior cavity + baffle slots
      const cavX = px + 6;
      const cavY = topY + 12;
      const cavW = pw - 12;
      const cavH = ph + rise - deckZ - 12;
      ctx.fillStyle = isOvercooked ? '#fef2f2' : (isSweet ? '#ecfdf5' : (rxn ? '#f0fdf4' : (npcRxn ? '#ecfeff' : '#f8fafc')));
      ctx.fillRect(cavX, cavY, cavW, cavH);
      if (isSweet) {
        drawHoodSweetGlow(ctx, cavX, cavY, cavW, cavH, nowSec);
      }

      // Back baffle slots + Schlenk dual-manifold glass line!
      ctx.fillStyle = '#cbd5e1';
      ctx.fillRect(cavX + 4, cavY + 5, cavW - 8, 1.5);
      ctx.fillRect(cavX + 4, cavY + 10, cavW - 8, 1.5);
      // Silver/glass Schlenk manifold bar + stopcocks
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(cavX + 6, cavY + 15);
      ctx.lineTo(cavX + cavW - 6, cavY + 15);
      ctx.stroke();
      for (let sx = cavX + 14; sx < cavX + cavW - 8; sx += 18) {
        ctx.fillStyle = '#0284c7';
        ctx.fillRect(sx, cavY + 13, 2.5, 5);
      }

      // Dark Trespa chemical work deck inside the hood
      const deckTopY = py + ph - deckZ - 14;
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(cavX, deckTopY, cavW, 14);

      // Determine occupied sub-cells so default glassware doesn't collide with Base Bath / Syringe Pump
      const occupiedCells = new Set();
      if (stackedChildren) {
        for (let i = 0; i < stackedChildren.length; i++) {
          const ch = stackedChildren[i];
          for (let cx = ch.x; cx < ch.x + ch.w; cx++) occupiedCells.add(cx);
        }
      }

      // Default round-bottom reaction flask + stir plate on unoccupied hood cells
      for (let cx = obj.x; cx < obj.x + obj.w; cx++) {
        if (occupiedCells.has(cx)) continue;
        const cellX = cx * TILE_W;
        const stirX = cellX + 16;
        const stirY = deckTopY + 4;
        // White IKA magnetic stir-plate
        ctx.fillStyle = '#e2e8f0';
        ctx.fillRect(stirX, stirY, 16, 7);
        if (rxn) {
          ctx.strokeStyle = isOvercooked ? '#ef4444' : (isSweet ? '#4ade80' : '#f59e0b');
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(stirX + 8, stirY + 3, 6 + Math.sin(nowSec * 7) * 1.2, 0, Math.PI * 2);
          ctx.stroke();
        } else if (npcRxn) {
          const npcMix = 0.5 + 0.5 * Math.sin(nowSec * 4.2 + cx);
          ctx.strokeStyle = npcMix > 0.45 ? '#14b8a6' : '#f59e0b';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(stirX + 8, stirY + 3, 6 + Math.sin(nowSec * 5.8 + cx) * 1.1, 0, Math.PI * 2);
          ctx.stroke();
        }
        // Round-bottom flask + liquid + vortex + PTFE stir bar + reflux condenser
        const liqColor = (rxn && rxn.color)
          ? rxn.color
          : (rxn ? '#10b981' : (npcRxn ? (npcRxn.color || (cx % 2 === 0 ? '#14b8a6' : '#f59e0b')) : (cx % 2 === 0 ? '#38bdf8' : '#f59e0b')));
        drawAnimatedFlaskContents(ctx, stirX + 8, stirY - 3, liqColor, nowSec, cx, true);
        // Condenser neck
        ctx.fillStyle = '#bae6fd';
        ctx.fillRect(stirX + 6.5, stirY - 15, 3, 8);
        if (rxn || npcRxn) {
          // Animated reflux bubbles!
          const bOff = (nowSec * 18) % 9;
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(stirX + 7, stirY - 4 - bOff, 2, 2);
        }
      }

      // Render ANY stacked children INSIDE the hood (defer highlight outline until after sash!)
      if (stackedChildren && stackedChildren.length) {
        for (let i = 0; i < stackedChildren.length; i++) {
          renderFixtureFn(ctx, room, stackedChildren[i], null, deckZ, nowSec, true);
        }
      }

      // Group-coloured Header Pelmet + Digital Airflow Monitor (0.52 m/s)
      ctx.fillStyle = grp.main;
      ctx.fillRect(px + 2, topY + 2, pw - 4, 9);
      ctx.fillStyle = grp.light;
      ctx.fillRect(px + 3, topY + 2, pw - 6, 2);
      // Digital airflow badge with animated green LED segments (flashes red on overcooked!)
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(px + pw - 23, topY + 3.5, 17, 6);
      for (let seg = 0; seg < 3; seg++) {
        const segLit = ((Math.floor(nowSec * 3.5) + seg) % 3) !== 0;
        ctx.fillStyle = isOvercooked ? (segLit ? '#f87171' : '#7f1d1d') : (segLit ? '#4ade80' : '#166534');
        ctx.fillRect(px + pw - 21 + seg * 4.5, topY + 5.5, 3, 2);
      }

      // Transparent Cyan-Tinted Sliding Safety Glass Sash OVER the interior!
      const sashY = topY + 12;
      const sashH = animSashH;
      ctx.fillStyle = 'rgba(125, 211, 252, 0.26)';
      ctx.fillRect(cavX, sashY, cavW, sashH);
      // Diagonal glass reflection streaks
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.58)';
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(cavX + 10, sashY + 3);
      ctx.lineTo(cavX + 20, sashY + sashH - 3);
      ctx.moveTo(cavX + cavW - 26, sashY + 4);
      ctx.lineTo(cavX + cavW - 18, sashY + sashH - 4);
      ctx.stroke();
      // Sash bottom rail + yellow COSHH hazard triangle sticker
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(cavX, sashY + sashH - 2.5, cavW, 2.5);
      ctx.fillStyle = '#facc15';
      ctx.fillRect(cavX + 4, sashY + sashH - 8, 5, 5);

      // Dark aerodynamic front airfoil sill
      ctx.fillStyle = '#334155';
      ctx.fillRect(px + 4, py + ph - deckZ - 2, pw - 8, 3);

      // Crisp Pokémon dark outline
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1.3;
      ctx.strokeRect(px + 1.5, topY + 0.5, pw - 3, ph + rise - 1);

      if (isOvercooked) {
        drawHoodOvercookedHazard(ctx, px + 1, topY, pw - 2, ph + rise, nowSec, hoodSeed);
      }

      if (stackedChildren && stackedChildren.length) {
        for (let i = 0; i < stackedChildren.length; i++) {
          drawChildFixtureHighlightIfNeeded(ctx, stackedChildren[i], deckZ, nowSec, renderState);
        }
      }
    } else {
      // ---- VERTICAL 1x2 SIDE-WALL FUME HOOD (Opens East on x=10, Opens West on x=24!) ----
      const opensLeft = eastWall && !westWall;
      const topY = py - rise;

      // Cabinet 3D box
      draw3DBox(ctx, px + 2, py, pw - 4, ph, rise, '#e2e8f0', '#cbd5e1', '#1e293b', '#f8fafc');

      // Group-coloured pelmet stripe along open side + front header
      const openEdgeX = opensLeft ? (px + 3) : (px + pw - 11);
      ctx.fillStyle = grp.main;
      ctx.fillRect(openEdgeX, topY + 2, 8, ph - 2);
      ctx.fillRect(px + 3, py + ph - rise + 1, pw - 6, 6);
      // Animated green airflow indicator on pelmet (flashes red on overcooked!)
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(px + pw - 16, py + ph - rise + 2, 10, 4);
      ctx.fillStyle = isOvercooked
        ? ((Math.floor(nowSec * 5) % 2 === 0) ? '#f87171' : '#991b1b')
        : ((Math.floor(nowSec * 3.5) % 2 === 0) ? '#4ade80' : '#22c55e');
      ctx.fillRect(px + pw - 14, py + ph - rise + 3, 6, 2);

      // Recessed glowing interior + angled glass sash facing the lab aisle!
      const bayX = opensLeft ? (px + 6) : (px + 14);
      const bayW = pw - 20;
      ctx.fillStyle = isOvercooked ? '#fef2f2' : (isSweet ? '#ecfdf5' : (rxn ? '#dcfce7' : (npcRxn ? '#cffafe' : '#f8fafc')));
      ctx.fillRect(bayX, topY + 8, bayW, ph - 12);

      // Dark Trespa interior strip + colourful reaction flasks visible from 3/4 view!
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(bayX + 2, topY + 12, bayW - 4, ph - 18);

      if (isSweet) {
        drawHoodSweetGlow(ctx, bayX, topY + 8, bayW, ph - 12, nowSec);
      }

      // Two stir plates + flasks along the 2-tile hood length
      for (let k = 0; k < 2; k++) {
        const fy = topY + 24 + k * 34;
        ctx.fillStyle = '#e2e8f0';
        ctx.fillRect(bayX + 5, fy + 4, 14, 7);
        const sideLiqCol = rxn
          ? (rxn.color || '#10b981')
          : (npcRxn ? (npcRxn.color || (k === 0 ? '#14b8a6' : '#f59e0b')) : (k === 0 ? '#38bdf8' : '#fb923c'));
        drawAnimatedFlaskContents(ctx, bayX + 12, fy + 2, sideLiqCol, nowSec, obj.y + k, true);
        // Reflux condenser neck + animated reflux bubbles matching horizontal hoods!
        ctx.fillStyle = '#bae6fd';
        ctx.fillRect(bayX + 10.5, fy - 9, 3, 6);
        if (rxn || npcRxn) {
          const bOff1 = (nowSec * 18 + k * 4.5) % 9;
          const bOff2 = (nowSec * 14 + k * 2.5 + 4) % 8;
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(bayX + 11, fy - 1 - bOff1, 2, 2);
          ctx.fillStyle = 'rgba(224, 242, 254, 0.85)';
          ctx.fillRect(bayX + 12.5, fy - bOff2, 1.5, 1.5);
        }
        if (rxn) {
          // Distinct status rings: sweet (#4ade80 emerald-gold) vs running (#fde047) vs overcooked (#f87171)
          ctx.strokeStyle = isOvercooked ? '#f87171' : (isSweet ? '#4ade80' : '#fde047');
          ctx.lineWidth = isSweet ? 1.65 : 1.4;
          ctx.beginPath();
          ctx.arc(bayX + 12, fy + 2, 6.5 + Math.sin(nowSec * 8 + k) * 1.2, 0, Math.PI * 2);
          ctx.stroke();
          if (isSweet) {
            // Subtle warm gold highlight arc for emerald-gold sweet-spot indicator
            ctx.strokeStyle = 'rgba(250, 204, 21, 0.72)';
            ctx.lineWidth = 1.0;
            ctx.beginPath();
            ctx.arc(bayX + 12, fy + 2, 8.2 + Math.sin(nowSec * 5 + k) * 0.8, -0.7, 0.9);
            ctx.stroke();
          }
        } else if (npcRxn) {
          const npcMix = 0.5 + 0.5 * Math.sin(nowSec * 4.2 + k);
          ctx.strokeStyle = npcMix > 0.45 ? '#2dd4bf' : '#f59e0b';
          ctx.lineWidth = 1.4;
          ctx.beginPath();
          ctx.arc(bayX + 12, fy + 2, 6.5 + Math.sin(nowSec * 6 + k) * 1.1, 0, Math.PI * 2);
          ctx.stroke();
        }
      }

      // Translucent cyan sash strip along aisle-facing edge (narrower when attended!)
      const sashW = animSashH < 19 ? 8 : 12;
      const sashX = opensLeft ? (px + 4) : (px + pw - 4 - sashW);
      ctx.fillStyle = 'rgba(125, 211, 252, 0.34)';
      ctx.fillRect(sashX, topY + 8, sashW, ph - 12);
      ctx.strokeStyle = 'rgba(255,255,255,0.6)';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(sashX + 2, topY + 16);
      ctx.lineTo(sashX + sashW - 2, topY + 30);
      ctx.moveTo(sashX + 2, topY + 50);
      ctx.lineTo(sashX + sashW - 2, topY + 64);
      ctx.stroke();

      // Front under-hood cupboard doors on south cutaway face
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 1;
      ctx.strokeRect(px + 6, py + ph - 18, pw - 12, 13);

      if (isOvercooked) {
        drawHoodOvercookedHazard(ctx, px + 2, topY, pw - 4, ph + rise, nowSec, hoodSeed);
      }
    }
  }

  function drawBenchActiveFlask(ctx, fx, fy, isPlayerRxn, rxnObj, nowSec) {
    // Mini magnetic stir plate on benchtop
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(fx, fy + 2, 16, 7);
    const pulse = 0.5 + 0.5 * Math.sin(nowSec * 5);
    const ringCol = isPlayerRxn
      ? (classifyReactionStatus(rxnObj) === 'overcooking' ? '#ef4444' : '#10b981')
      : (pulse > 0.45 ? '#14b8a6' : '#f59e0b');
    ctx.save();
    ctx.strokeStyle = ringCol;
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.arc(fx + 8, fy + 4, 6 + Math.sin(nowSec * 6) * 1.1, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

    // Active round-bottom / conical reaction flask + vortex + PTFE stir bar + rising bubbles
    const liqCol = (rxnObj && rxnObj.color) ? rxnObj.color : (isPlayerRxn ? '#10b981' : (pulse > 0.5 ? '#14b8a6' : '#f59e0b'));
    drawAnimatedFlaskContents(ctx, fx + 8, fy - 2, liqCol, nowSec, fx * 0.1, true);
    ctx.fillStyle = '#bae6fd';
    ctx.fillRect(fx + 6.5, fy - 12, 3, 6);
    const bOff = (nowSec * 16) % 7;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(fx + 7, fy - 3 - bOff, 1.8, 1.8);
  }

  // 2. LAB BENCH (Dark Trespa Slate Countertop + Under-Bench Cupboards + Seamless Island Spine)
  function drawLabBench(ctx, room, obj, stackedChildren, rxn, npcRxn, nowSec) {
    const px = obj.x * TILE_W;
    const py = obj.y * TILE_H;
    const pw = obj.w * TILE_W;
    const ph = obj.h * TILE_H;
    const rise = 16;

    // Check adjacent lab_bench blocks so island benches fuse cleanly
    const objs = room.objects || [];
    let hasBenchNorth = false;
    let hasBenchSouth = false;
    for (let i = 0; i < objs.length; i++) {
      const o = objs[i];
      if (o.id === obj.id || o.type !== 'lab_bench') continue;
      const xOverlap = Math.min(obj.x + obj.w, o.x + o.w) - Math.max(obj.x, o.x);
      if (xOverlap > 0) {
        if (o.y + o.h === obj.y) hasBenchNorth = true;
        if (obj.y + obj.h === o.y) hasBenchSouth = true;
      }
    }

    const frontTopY = py + ph - rise;
    const topY = py - rise;

    // Under-bench cream/light-slate cabinetry + dark toe-kick recess
    ctx.fillStyle = '#dce4ee';
    ctx.fillRect(px + 1, frontTopY + 3, pw - 2, rise - 6);
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(px + 2, py + ph - 3, pw - 4, 3);

    // Cupboard & drawer fronts per tile width
    const cols = Math.max(1, obj.w);
    for (let c = 0; c < cols; c++) {
      const cx = px + c * TILE_W;
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 1;
      ctx.strokeRect(cx + 4, frontTopY + 4, 19, rise - 8);
      ctx.strokeRect(cx + 25, frontTopY + 4, 19, rise - 8);
      // Brushed metal/oak drawer pulls
      ctx.fillStyle = '#64748b';
      ctx.fillRect(cx + 18, frontTopY + 7, 3, 2);
      ctx.fillRect(cx + 27, frontTopY + 7, 3, 2);
    }

    // Dark Chemical-Resistant Trespa Toplab Slate Countertop
    ctx.fillStyle = '#293548';
    ctx.fillRect(px, topY, pw, ph);
    // Subtle Trespa front lip bevel
    ctx.fillStyle = '#475569';
    ctx.fillRect(px + 1, frontTopY - 2.5, pw - 2, 2.5);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(px, frontTopY, pw, 2.5);

    // Outline (omit north seam if fused with north island bench!)
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    if (!hasBenchNorth) {
      ctx.moveTo(px + 0.5, topY + 0.5);
      ctx.lineTo(px + pw - 0.5, topY + 0.5);
    }
    ctx.moveTo(px + 0.5, topY + 0.5);
    ctx.lineTo(px + 0.5, py + ph - 0.5);
    ctx.lineTo(px + pw - 0.5, py + ph - 0.5);
    ctx.lineTo(px + pw - 0.5, topY + 0.5);
    ctx.stroke();

    // Shared raised central reagent bottle spine per clear column when fused with north island bench!
    if (hasBenchNorth && !hasBenchSouth) {
      const spineY = topY - 4;
      const isColumnClear = function (colX) {
        for (let i = 0; i < objs.length; i++) {
          const o = objs[i];
          if (o.type === 'lab_bench' || FLOOR_DECAL_TYPES.has(o.type)) continue;
          const xHit = colX >= o.x && colX < o.x + o.w;
          const yHit = (obj.y - 1 >= o.y && obj.y - 1 < o.y + o.h) || (obj.y >= o.y && obj.y < o.y + o.h);
          if (xHit && yHit) return false;
        }
        return true;
      };

      const clearCols = [];
      for (let cx = obj.x; cx < obj.x + obj.w; cx++) {
        clearCols.push(isColumnClear(cx));
      }

      for (let i = 0; i < clearCols.length; i++) {
        if (!clearCols[i]) continue;
        const cx = obj.x + i;
        const leftClear = i > 0 && clearCols[i - 1];
        const rightClear = i < clearCols.length - 1 && clearCols[i + 1];
        const segX = cx * TILE_W + (leftClear ? 0 : (i === 0 ? 4 : 2));
        const segEnd = (cx + 1) * TILE_W - (rightClear ? 0 : (i === clearCols.length - 1 ? 4 : 2));
        const segW = Math.max(4, segEnd - segX);
        ctx.fillStyle = '#cbd5e1';
        ctx.fillRect(segX, spineY, segW, 5);
        ctx.strokeStyle = '#475569';
        ctx.lineWidth = 1;
        ctx.strokeRect(segX + 0.5, spineY + 0.5, segW - 1, 4);

        const b1 = cx * TILE_W + 13;
        const b2 = cx * TILE_W + 31;
        ctx.fillStyle = '#92400e';
        ctx.fillRect(b1, spineY - 5, 5, 6);
        ctx.fillStyle = '#2563eb';
        ctx.fillRect(b1 + 1, spineY - 7, 3, 2);
        ctx.fillStyle = '#0f766e';
        ctx.fillRect(b2, spineY - 4, 5, 5);
        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(b2 + 1, spineY - 6, 3, 2);
      }
    }

    // Active Player or Autonomous NPC Reaction glassware on benchtop
    const benchRxn = rxn || npcRxn;
    if (benchRxn) {
      const occupied = new Set();
      if (stackedChildren) {
        for (let i = 0; i < stackedChildren.length; i++) {
          const ch = stackedChildren[i];
          for (let cy = ch.y; cy < ch.y + ch.h; cy++) {
            for (let cx = ch.x; cx < ch.x + ch.w; cx++) {
              occupied.add(cx + ',' + cy);
            }
          }
        }
      }
      let targetTx = obj.x;
      let targetTy = obj.y;
      let foundFree = false;
      for (let cy = obj.y; cy < obj.y + obj.h && !foundFree; cy++) {
        for (let cx = obj.x; cx < obj.x + obj.w && !foundFree; cx++) {
          if (!occupied.has(cx + ',' + cy)) {
            targetTx = cx;
            targetTy = cy;
            foundFree = true;
          }
        }
      }
      const fx = targetTx * TILE_W + (foundFree ? 16 : 6);
      const fy = targetTy * TILE_H - rise + (foundFree ? 15 : 18);
      drawBenchActiveFlask(ctx, fx, fy, Boolean(rxn), benchRxn, nowSec || 0);
    }
  }

  // 3. LAB SINK (Recessed Polypropylene Basin + Swan-Neck Tap + Drying Pegs)
  function drawSink(ctx, px, py, pw, ph) {
    // Recessed dark polypropylene basin cut into benchtop
    fillRoundRect(ctx, px + 7, py + 7, pw - 14, ph - 13, 3, '#0f172a', '#475569', 1.5);
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(px + 10, py + 11, pw - 20, ph - 19);
    // Silver drain strainer + tiny water glint
    ctx.fillStyle = '#94a3b8';
    ctx.beginPath();
    ctx.arc(px + pw * 0.5, py + ph * 0.5 + 1, 3, 0, Math.PI * 2);
    ctx.fill();

    // Tall white-epoxy / brass swan-neck lab tap rising above basin
    const tapX = px + pw * 0.5;
    const tapBaseY = py + 8;
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(tapX, tapBaseY);
    ctx.lineTo(tapX, tapBaseY - 12);
    ctx.arc(tapX - 4, tapBaseY - 12, 4, 0, Math.PI, true);
    ctx.lineTo(tapX - 8, tapBaseY - 8);
    ctx.stroke();
    // Red/Blue tap valves
    ctx.fillStyle = '#3b82f6';
    ctx.fillRect(tapX + 4, tapBaseY - 3, 3, 3);
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(tapX - 7, tapBaseY - 3, 3, 3);

    // Wash bottle with red acetone spout beside sink
    ctx.fillStyle = 'rgba(241, 245, 249, 0.9)';
    ctx.fillRect(px + pw - 12, py + 10, 5, 9);
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(px + pw - 11, py + 8, 3, 2.5);
  }

  // 4. CHEMICAL CUPBOARD (COSHH Storage + GHS Diamonds + Readable Cupboard # Badge!)
  function drawChemCupboard(ctx, room, obj) {
    const px = obj.x * TILE_W;
    const py = obj.y * TILE_H;
    const pw = obj.w * TILE_W;
    const ph = obj.h * TILE_H;
    const rise = 27;
    const numBadge = parseCupboardNumber(obj.label);
    const lblLower = String(obj.label || '').toLowerCase();

    const isFlammable = lblLower.includes('flamm') || numBadge === '#20';
    const isThiol = lblLower.includes('thiol') || numBadge === '#5';
    const isMystery = lblLower.includes('mystery') || numBadge === '#19';
    const grp = GROUP_PALETTE[obj.group] || GROUP_PALETTE.none;

    const topCol = isFlammable ? '#facc15' : (isThiol ? '#d9ead3' : (isMystery ? '#d6d3d1' : '#e2e8f0'));
    const frontCol = isFlammable ? '#eab308' : (isThiol ? '#cbd5c0' : (isMystery ? '#c7c2bc' : '#cbd5e1'));

    draw3DBox(ctx, px + 2, py, pw - 4, ph, rise, topCol, frontCol, '#1e293b', 'rgba(255,255,255,0.45)');

    // Group accent strip along top roof edge if assigned
    if (obj.group && obj.group !== 'none') {
      ctx.fillStyle = grp.main;
      ctx.fillRect(px + 3, py - rise + 2, pw - 6, 4);
    }

    const frontTopY = py + ph - rise;
    // Double doors on front face + silver lock handle
    ctx.strokeStyle = isFlammable ? '#a16207' : '#64748b';
    ctx.lineWidth = 1;
    ctx.strokeRect(px + 5, frontTopY + 3, pw - 10, rise - 6);
    ctx.beginPath();
    ctx.moveTo(px + pw * 0.5, frontTopY + 3);
    ctx.lineTo(px + pw * 0.5, py + ph - 3);
    ctx.stroke();

    // Silver T-handle
    ctx.fillStyle = '#475569';
    ctx.fillRect(px + pw * 0.5 - 4, frontTopY + 11, 3, 6);
    ctx.fillRect(px + pw * 0.5 + 1, frontTopY + 11, 3, 6);

    // GHS Diamond Hazard Sticker (red border diamond with flame / skull!)
    const hzX = px + 13;
    const hzY = frontTopY + 12;
    ctx.save();
    ctx.translate(hzX, hzY);
    ctx.rotate(Math.PI / 4);
    ctx.fillStyle = isThiol ? '#fef08a' : '#ffffff';
    ctx.fillRect(-4.5, -4.5, 9, 9);
    ctx.strokeStyle = '#dc2626';
    ctx.lineWidth = 1.4;
    ctx.strokeRect(-4.5, -4.5, 9, 9);
    ctx.fillStyle = isThiol ? '#1e293b' : '#ef4444';
    ctx.fillRect(-1.8, -1.8, 3.6, 3.6);
    ctx.restore();

    // Crisp Readable Cupboard Number Badge (#1, #5, #6, #9, #11, #14, #17, #19, #20)
    if (numBadge) {
      const badgeW = Math.max(24, numBadge.length * 7 + 8);
      const bx = px + pw * 0.5 - badgeW * 0.5;
      const by = py - rise + Math.min(ph - 16, ph * 0.5 - 7);
      fillRoundRect(ctx, bx, by, badgeW, 14, 3, isThiol ? '#7f1d1d' : '#0f172a', isThiol ? '#fca5a5' : '#cbd5e1', 1);
      ctx.fillStyle = isThiol ? '#fde047' : '#ffffff';
      ctx.font = 'bold 9.5px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(numBadge, bx + badgeW * 0.5, by + 7.5);
    }
  }

  // 5. 4 °C FRIDGE & -20 °C FREEZER (Tall White Lab Units + Digital LED + Sticky Notes!)
  function drawFridgeOrFreezer(ctx, obj, isFreezer) {
    const px = obj.x * TILE_W;
    const py = obj.y * TILE_H;
    const pw = obj.w * TILE_W;
    const ph = obj.h * TILE_H;
    const rise = 32;

    draw3DBox(ctx, px + 4, py, pw - 8, ph, rise, '#f8fafc', '#f1f5f9', '#334155', '#ffffff');

    // Rear black condenser grille on top lid
    ctx.fillStyle = '#475569';
    ctx.fillRect(px + 8, py - rise + 3, pw - 16, 5);

    const frontTopY = py + ph - rise;
    // Top digital temperature control header
    ctx.fillStyle = isFreezer ? '#1e3a8a' : '#0f172a';
    ctx.fillRect(px + 6, frontTopY - 8, pw - 12, 8);
    ctx.fillStyle = isFreezer ? '#60a5fa' : '#4ade80';
    ctx.font = 'bold 7.5px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(isFreezer ? '-20°C' : '4°C', px + pw * 0.5, frontTopY - 3.5);

    // Door gasket line + vertical metallic handle
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 1;
    ctx.strokeRect(px + 6.5, frontTopY + 2.5, pw - 13, rise - 5);
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(px + pw - 12, frontTopY + 6, 3, 14);

    // Colourful post-it sticky notes + Spark-Free sticker!
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(px + 10, frontTopY + 6, 7, 6);
    ctx.fillStyle = isFreezer ? '#bfdbfe' : '#fbcfe8';
    ctx.fillRect(px + 19, frontTopY + 9, 6, 6);
  }

  // 6. BÜCHI ROTARY EVAPORATOR (Stainless Bath + Diagonal Condenser + Rotating Flask!)
  function drawBuchi(ctx, obj, rxn, nowSec) {
    const px = obj.x * TILE_W;
    const py = obj.y * TILE_H;
    const pw = obj.w * TILE_W;
    const ph = obj.h * TILE_H;

    // Compact grey bench stand under rotavap
    draw3DBox(ctx, px + 3, py, pw - 6, ph, 14, '#475569', '#cbd5e1', '#1e293b');
    const baseY = py + ph - 14;

    // Motorized vertical column on center-left
    ctx.fillStyle = '#334155';
    ctx.fillRect(px + 19, baseY - 28, 5, 22);

    // Brushed stainless heating water bath on right
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(px + 25, baseY - 12, 16, 9);
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(px + 27, baseY - 13, 12, 3);
    // 40°C LED on bath (glows cyan/amber/green when job is running/ready)
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(px + 28, baseY - 7, 9, 4);
    const buchiSt = rxn ? classifyReactionStatus(rxn, obj) : null;
    ctx.fillStyle = buchiSt === 'ready' ? '#22c55e' : (buchiSt === 'overcooking' ? '#ef4444' : (rxn ? '#38bdf8' : '#fb923c'));
    ctx.fillRect(px + 29, baseY - 6, 5, 2);
    if (rxn) {
      ctx.save();
      ctx.shadowColor = buchiSt === 'ready' ? '#22c55e' : '#38bdf8';
      ctx.shadowBlur = 5;
      ctx.fillStyle = buchiSt === 'ready' ? '#22c55e' : ((Math.floor(nowSec * 3) % 2 === 0) ? '#f59e0b' : '#38bdf8');
      ctx.beginPath();
      ctx.arc(px + 21.5, baseY - 26, 1.8, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // Smoothly rotating angled round-bottom flask dipping into water bath!
    const spinSpeed = rxn ? 6.5 : 2.2;
    const angle = nowSec * spinSpeed;
    const fx = px + 33;
    const fy = baseY - 15;
    ctx.save();
    ctx.translate(fx, fy);
    ctx.fillStyle = 'rgba(226,232,240,0.88)';
    ctx.beginPath();
    ctx.arc(0, 0, 5.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = rxn ? (rxn.color || '#10b981') : '#f59e0b';
    ctx.beginPath();
    ctx.arc(0, 1, 4.3, 0.1, Math.PI - 0.1);
    ctx.fill();
    // Rotating specular glint band on the spinning flask!
    ctx.strokeStyle = 'rgba(255,255,255,0.85)';
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.arc(Math.cos(angle) * 1.8, -1, 2.5, 0, Math.PI);
    ctx.stroke();
    ctx.restore();

    // Angled glass condenser coil rising up-left + receiving bump flask on left
    ctx.strokeStyle = '#bae6fd';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(px + 26, baseY - 19);
    ctx.lineTo(px + 12, baseY - 31);
    ctx.stroke();
    // Teal coolant spiral inside condenser
    ctx.strokeStyle = '#0d9488';
    ctx.lineWidth = 1.3;
    ctx.beginPath();
    ctx.moveTo(px + 25, baseY - 19);
    ctx.lineTo(px + 13, baseY - 30);
    ctx.stroke();

    // Round receiving flask hanging below condenser on left
    ctx.fillStyle = 'rgba(226,232,240,0.85)';
    ctx.beginPath();
    ctx.arc(px + 12, baseY - 18, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 1;
    ctx.stroke();

    drawStationMicroTag(ctx, px + pw * 0.5, py + ph - 7, 'BUCHI');
  }

  // 7. BIOTAGE ISOLERA FLASH CHROMATOGRAPHY (UV Chromatogram Screen + Solvent Bottles + Fraction Racks!)
  function drawBiotage(ctx, obj, rxn, nowSec) {
    const px = obj.x * TILE_W;
    const py = obj.y * TILE_H;
    const pw = obj.w * TILE_W;
    const ph = obj.h * TILE_H;

    // Bench base under Biotage
    draw3DBox(ctx, px + 2, py, pw - 4, ph, 15, '#334155', '#dce4ee', '#1e293b');
    const deckY = py + ph - 15;

    // Main white/teal Biotage Isolera chassis sitting on upper half
    const unitY = py - 22;
    fillRoundRect(ctx, px + 6, unitY, pw - 12, 34, 4, '#f8fafc', '#0f766e', 1.5);
    // Teal Biotage accent bezel
    ctx.fillStyle = '#0d9488';
    ctx.fillRect(px + 7, unitY + 2, pw - 14, 6);

    // Amber & Clear Solvent Winchesters (Hexane / EtOAc) perched on top!
    ctx.fillStyle = '#92400e';
    ctx.fillRect(px + 11, unitY - 9, 8, 9);
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(px + 13, unitY - 11, 4, 2);
    ctx.fillStyle = 'rgba(226, 232, 240, 0.9)';
    ctx.fillRect(px + 23, unitY - 9, 8, 9);
    ctx.fillStyle = '#2563eb';
    ctx.fillRect(px + 25, unitY - 11, 4, 2);

    // Glowing Live Dual-Channel UV 254 nm & 280 nm Scrolling Chromatogram Screen!
    const scrX = px + 10;
    const scrY = unitY + 10;
    const scrW = pw - 20;
    const scrH = 13;
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(scrX, scrY, scrW, scrH);
    ctx.fillStyle = 'rgba(30, 41, 59, 0.85)';
    ctx.fillRect(scrX + 1, scrY + 5, scrW - 2, 0.8);
    ctx.fillRect(scrX + 1, scrY + 9, scrW - 2, 0.8);

    const scroll = nowSec * (rxn ? 1.85 : 0.72);
    const traceW = Math.max(8, scrW - 4);
    const plotChromatogram = function (color, phaseOff, ampScale) {
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.25;
      ctx.beginPath();
      for (let sx = 0; sx <= traceW; sx += 2) {
        const u = ((sx / traceW) + scroll * 0.25 + phaseOff) % 1;
        const p1 = Math.exp(-Math.pow((u - 0.30) / 0.08, 2)) * 8.2;
        const p2 = Math.exp(-Math.pow((u - 0.62) / 0.10, 2)) * 5.8;
        const pyPt = scrY + 10.5 - (p1 + p2) * ampScale;
        if (sx === 0) ctx.moveTo(scrX + 2 + sx, pyPt);
        else ctx.lineTo(scrX + 2 + sx, pyPt);
      }
      ctx.stroke();
    };
    plotChromatogram('#f472b6', 0.08, 0.72);
    plotChromatogram(rxn ? '#fde047' : '#2dd4bf', 0.0, 1.0);

    // Glowing sweep cursor line + dot
    const curRelX = ((scroll * 10) % traceW);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.32)';
    ctx.fillRect(scrX + 2 + curRelX, scrY + 1, 1, scrH - 2);
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(scrX + 2 + curRelX, scrY + 2.5, 1.4, 0, Math.PI * 2);
    ctx.fill();

    // White Snap Silica Column Cartridge clipped vertically
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 1;
    ctx.fillRect(px + pw - 14, unitY + 23, 6, 14);
    ctx.strokeRect(px + pw - 14, unitY + 23, 6, 14);

    // Two Blue Test-Tube Fraction Collector Racks in lower bay + active tube LED!
    const rackY = unitY + 37;
    if (ph > TILE_H) {
      const tubeCountPerRow = Math.max(1, Math.floor((pw - 22) / 5));
      const activeTubeIdx = Math.floor(nowSec * (rxn ? 2.8 : 1.0)) % tubeCountPerRow;
      for (let r = 0; r < 2; r++) {
        const ry = rackY + r * 14;
        fillRoundRect(ctx, px + 8, ry, pw - 16, 11, 2, '#2563eb', '#1e3a8a', 1);
        let tIdx = 0;
        for (let tx = px + 11; tx < px + pw - 10; tx += 5) {
          const isActive = (r === 0 && tIdx === activeTubeIdx);
          ctx.fillStyle = isActive ? '#fde047' : '#e0f2fe';
          ctx.fillRect(tx, ry + 2, 2.5, 3);
          ctx.fillStyle = '#e0f2fe';
          ctx.fillRect(tx, ry + 6, 2.5, 3);
          tIdx++;
        }
      }
      // Blinking active fraction collector status LED
      const bioSt = rxn ? classifyReactionStatus(rxn, obj) : null;
      ctx.save();
      if (rxn) {
        ctx.shadowColor = bioSt === 'ready' ? '#22c55e' : '#38bdf8';
        ctx.shadowBlur = 6;
      }
      ctx.fillStyle = bioSt === 'ready'
        ? '#22c55e'
        : (rxn ? ((Math.floor(nowSec * 4) % 2 === 0) ? '#f59e0b' : '#38bdf8')
               : ((Math.floor(nowSec * 3.5) % 2 === 0) ? '#4ade80' : '#16a34a'));
      ctx.fillRect(px + 9, unitY + 25, 3, 3);
      ctx.restore();
    } else {
      fillRoundRect(ctx, px + pw * 0.5 + 2, deckY - 22, pw * 0.42, 16, 2, '#2563eb', '#1e3a8a', 1);
    }

    drawStationMicroTag(ctx, px + pw * 0.5, py + ph - 7.5, 'BIOTAGE');
  }

  // 8. UV TLC STATION + RED HEATGUN
  function drawTlcStation(ctx, px, py, pw, ph, nowSec) {
    // Dark UV viewing hood cabinet
    draw3DBox(ctx, px + 4, py + 4, 24, ph - 10, 15, '#3b0764', '#1e1b4b', '#0f172a');
    // Glowing 254/365 nm purple UV light spilling out of front curtain + green TLC plate!
    const glow = 0.55 + 0.2 * Math.sin(nowSec * 4);
    ctx.fillStyle = 'rgba(168, 85, 247, ' + glow.toFixed(2) + ')';
    ctx.fillRect(px + 8, py + ph - 15, 16, 9);
    // Green F254 silica TLC plate inside with dark UV spots
    ctx.fillStyle = '#86efac';
    ctx.fillRect(px + 13, py + ph - 13, 6, 6);
    ctx.fillStyle = '#3b0764';
    ctx.fillRect(px + 14.5, py + ph - 11.5, 1.5, 1.5);
    ctx.fillRect(px + 16.5, py + ph - 10, 1.5, 1.5);

    // Bright red heat gun + purple KMnO4 dip jar on the right
    ctx.fillStyle = '#7e22ce'; // KMnO4 dip jar
    ctx.fillRect(px + 32, py + 8, 9, 10);
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(px + 33, py + 6, 7, 2.5);

    // Red heat gun
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(px + 31, py + 23, 11, 5);
    ctx.fillStyle = '#94a3b8'; // silver nozzle
    ctx.fillRect(px + 28, py + 24, 3, 3);

    drawStationMicroTag(ctx, px + 16, py + 3, 'UV');
  }

  // 9. GLASSWARE DRYING OVEN (Brushed Steel + Glowing Amber Window Showing Flasks!)
  function drawDryingOven(ctx, px, py, pw, ph) {
    const rise = 24;
    draw3DBox(ctx, px + 4, py + 2, pw - 8, ph - 6, rise, '#cbd5e1', '#94a3b8', '#1e293b', '#f1f5f9');
    const frontTopY = py + ph - 4 - rise;

    // Warm glowing amber double-glazed window with flasks silhouettes on wire shelf!
    fillRoundRect(ctx, px + 9, frontTopY + 4, pw - 22, 13, 2, '#f59e0b', '#475569', 1);
    ctx.fillStyle = '#fef3c7';
    ctx.fillRect(px + 11, frontTopY + 6, pw - 26, 9);
    // Wire shelf + tiny glass flasks inside
    ctx.fillStyle = '#b45309';
    ctx.fillRect(px + 10, frontTopY + 12, pw - 24, 1);
    ctx.fillStyle = 'rgba(255,255,255,0.85)';
    ctx.beginPath();
    ctx.arc(px + 15, frontTopY + 10, 2.5, 0, Math.PI * 2);
    ctx.arc(px + 22, frontTopY + 10, 2.5, 0, Math.PI * 2);
    ctx.fill();

    // Right control strip + glowing red 120°C switch
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(px + pw - 10, frontTopY + 6, 3, 4);
    ctx.fillStyle = '#334155';
    ctx.fillRect(px + pw - 10, frontTopY + 13, 3, 5);

    drawStationMicroTag(ctx, px + pw * 0.5, py - 6, 'OVEN');
  }

  // 10. BASE / BLEACH BATH (Lime-Amber Nalgene Tub Inside Hood (15, 8))
  function drawBaseBath(ctx, px, py, pw, ph) {
    // Heavy-duty Nalgene HDPE tub sitting inside hood deck
    draw3DBox(ctx, px + 6, py + 8, pw - 12, ph - 14, 12, '#ecfccb', '#84cc16', '#365314', '#f7fee7');
    // Caustic/bleach liquid interior with submerged flask necks
    ctx.fillStyle = '#bef264';
    ctx.fillRect(px + 9, py - 1, pw - 18, ph - 20);
    ctx.fillStyle = 'rgba(255,255,255,0.75)';
    ctx.beginPath();
    ctx.arc(px + 17, py + 5, 3, 0, Math.PI * 2);
    ctx.arc(px + 27, py + 7, 2.5, 0, Math.PI * 2);
    ctx.fill();
    // Warning stripe on front of tub
    ctx.fillStyle = '#facc15';
    ctx.fillRect(px + 12, py + ph - 14, pw - 24, 4);

    drawStationMicroTag(ctx, px + pw * 0.5, py + ph - 12, 'BLEACH');
  }

  // 11. HARVARD SYRINGE PUMP (Precision Horizontal Syringe + PTFE Micro-Tubing Inside Hood (20, 8))
  function drawSyringePump(ctx, px, py, pw, ph, nowSec) {
    // Compact anodized blue/silver Harvard PHD pump chassis
    draw3DBox(ctx, px + 7, py + 11, 24, ph - 18, 9, '#0284c7', '#cbd5e1', '#0f172a');
    // Mini glowing LCD screen
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(px + 10, py + 6, 11, 5);
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(px + 11, py + 8, 7, 1.5);

    // Horizontal Hamilton glass syringe barrel + moving pusher block
    const pushShift = Math.sin(nowSec * 1.5) * 1.2;
    ctx.fillStyle = '#e0f2fe';
    ctx.fillRect(px + 13, py + 13, 14, 3.5);
    ctx.fillStyle = '#334155'; // pusher block
    ctx.fillRect(px + 9 + pushShift, py + 12, 4, 5.5);

    // Fine PTFE tubing arching right into septum-capped reaction vial!
    ctx.strokeStyle = 'rgba(255,255,255,0.85)';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(px + 27, py + 14.5);
    ctx.quadraticCurveTo(px + 35, py + 6, px + 38, py + 15);
    ctx.stroke();

    // Reaction vial with red Suba-Seal septum
    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(px + 35, py + 16, 6, 9);
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(px + 35.5, py + 14, 5, 2.5);
  }

  // 12. BOC ARGON CYLINDER (Tall Dark-Green Cylinder + Brass Twin-Gauge Regulator + Blue Balloon!)
  function drawArgonCyl(ctx, obj, nowSec) {
    const px = obj.x * TILE_W;
    const py = obj.y * TILE_H;
    const cx = px + TILE_W * 0.5 - 2;
    const baseY = py + TILE_H - 6;

    // Floor base ring + safety wall chain
    ctx.fillStyle = '#334155';
    ctx.beginPath();
    ctx.ellipse(cx, baseY, 10, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Tall cylindrical dark-green BOC Argon body (32px rise!)
    const cylGrad = ctx.createLinearGradient(cx - 9, 0, cx + 9, 0);
    cylGrad.addColorStop(0, '#064e3b');
    cylGrad.addColorStop(0.4, '#059669');
    cylGrad.addColorStop(1, '#022c22');
    ctx.fillStyle = cylGrad;
    ctx.fillRect(cx - 8.5, baseY - 30, 17, 30);

    // Black BOC Argon shoulder dome
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.arc(cx, baseY - 30, 8.5, Math.PI, 0);
    ctx.fill();

    // Silver safety chain around waist
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(cx - 10, baseY - 18);
    ctx.lineTo(cx + 10, baseY - 18);
    ctx.stroke();

    // Gleaming Two-Stage Brass Regulator + Twin Pressure Dials
    ctx.fillStyle = '#eab308';
    ctx.fillRect(cx - 2, baseY - 43, 4, 6);
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#ca8a04';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.arc(cx - 5, baseY - 43, 3.2, 0, Math.PI * 2);
    ctx.arc(cx + 5, baseY - 43, 3.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Iconic Blue Argon Schlenk Balloon bobbing gently!
    const bob = Math.sin(nowSec * 2.2 + obj.y) * 1.5;
    const balX = cx + 13;
    const balY = baseY - 44 + bob;
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(cx + 3, baseY - 39);
    ctx.lineTo(balX - 3, balY + 5);
    ctx.stroke();

    ctx.fillStyle = '#3b82f6';
    ctx.beginPath();
    ctx.ellipse(balX, balY, 6.5, 8, 0.25, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.45)';
    ctx.beginPath();
    ctx.arc(balX - 2, balY - 3, 2, 0, Math.PI * 2);
    ctx.fill();

    drawStationMicroTag(ctx, cx, baseY - 9, 'ARGON');
  }

  // 13. ANALYTICAL BALANCE TABLE (Heavy Granite Anti-Vibration Slab + Glass-Draft-Shield Balances)
  function drawBalanceTable(ctx, obj) {
    const px = obj.x * TILE_W;
    const py = obj.y * TILE_H;
    const pw = obj.w * TILE_W;
    const ph = obj.h * TILE_H;
    const rise = 16;

    // Steel legs + heavy grey-white marble anti-vibration slab
    ctx.fillStyle = '#334155';
    ctx.fillRect(px + 4, py + ph - rise, 5, rise);
    ctx.fillRect(px + pw - 9, py + ph - rise, 5, rise);
    draw3DBox(ctx, px + 2, py, pw - 4, ph - 2, rise, '#e2e8f0', '#94a3b8', '#1e293b', '#f8fafc');

    // Analytical balance(s) with 3-sided glass draft shield + 0.0000 g green display!
    const count = Math.max(1, obj.w >= obj.h ? obj.w : obj.h);
    for (let i = 0; i < count; i++) {
      const bx = obj.w >= obj.h ? (px + i * TILE_W + 12) : (px + 12);
      const by = obj.w >= obj.h ? (py - rise + 6) : (py - rise + i * TILE_H + 6);
      // White base + LCD front
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(bx, by + 10, 22, 11);
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(bx + 4, by + 16, 14, 4);
      ctx.fillStyle = '#4ade80';
      ctx.fillRect(bx + 6, by + 17.5, 9, 1.5);
      // Silver weighing pan + clear glass draft-shield cube
      ctx.fillStyle = '#94a3b8';
      ctx.beginPath();
      ctx.ellipse(bx + 11, by + 11, 5, 2.5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = 'rgba(186, 230, 253, 0.42)';
      ctx.fillRect(bx + 2, by, 18, 13);
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 1;
      ctx.strokeRect(bx + 2.5, by + 0.5, 17, 12);
    }
  }

  // 14. TCEP / BIOCONJUGATION BENCH STATION (Gilson Stand + Eppendorf Racks + BBS Buffer Bottles)
  function drawTcepBench(ctx, px, py, pw, ph) {
    // Left: Eppendorf microtube racks (blue & pink) + yellow P200 tip box
    fillRoundRect(ctx, px + 6, py + 12, 20, 11, 2, '#2563eb', '#1e3a8a', 1);
    ctx.fillStyle = '#f8fafc';
    for (let tx = px + 9; tx < px + 24; tx += 4) {
      ctx.fillRect(tx, py + 14, 2, 2);
      ctx.fillRect(tx, py + 18, 2, 2);
    }
    // Yellow pipette tip box
    draw3DBox(ctx, px + 30, py + 14, 14, 10, 6, '#facc15', '#eab308', '#713f12');

    // Center: Gilson Pipetman carousel stand!
    const standX = px + pw * 0.5 + 4;
    const standY = py + 18;
    ctx.fillStyle = '#e2e8f0';
    ctx.beginPath();
    ctx.ellipse(standX, standY, 7, 4, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(standX - 1.5, standY - 16, 3, 16);
    ctx.fillStyle = '#2563eb'; // iconic blue Gilson tops
    ctx.fillRect(standX - 7, standY - 16, 14, 3);
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(standX - 6, standY - 13, 2, 8);
    ctx.fillRect(standX - 1, standY - 13, 2, 8);
    ctx.fillRect(standX + 4, standY - 13, 2, 8);

    // Right: Two Schott Duran PBS / BBS pH 8.0 glass buffer bottles with GL45 blue screw caps!
    const b1x = px + pw - 26;
    for (let b = 0; b < 2; b++) {
      const bx = b1x + b * 11;
      ctx.fillStyle = 'rgba(224, 242, 254, 0.88)';
      ctx.fillRect(bx, py + 8, 8, 12);
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 0.9;
      ctx.strokeRect(bx + 0.5, py + 8.5, 7, 11);
      ctx.fillStyle = '#ffffff'; // bottle label
      ctx.fillRect(bx + 1, py + 12, 6, 4);
      ctx.fillStyle = '#1d4ed8'; // GL45 blue cap
      ctx.fillRect(bx + 1.5, py + 5, 5, 3);
    }

    drawStationMicroTag(ctx, px + pw * 0.5, py + ph - 9, 'TCEP');
  }

  // 15. SDS-PAGE GEL TANK (Clear Bio-Rad Tank + Blue Coomassie Lanes + Red/Black Leads!)
  function drawGelTank(ctx, px, py, pw, ph, rxn, nowSec) {
    // Bio-Rad PowerPac mini power supply behind tank
    draw3DBox(ctx, px + 26, py + 6, 16, 12, 8, '#e2e8f0', '#cbd5e1', '#334155');
    const gelSt = rxn ? classifyReactionStatus(rxn) : null;
    ctx.save();
    if (rxn) {
      ctx.shadowColor = gelSt === 'ready' ? '#22c55e' : '#38bdf8';
      ctx.shadowBlur = 6;
    }
    ctx.fillStyle = gelSt === 'ready' ? '#22c55e' : (rxn ? ((Math.floor(nowSec * 3.5) % 2 === 0) ? '#38bdf8' : '#f59e0b') : '#16a34a');
    ctx.fillRect(px + 29, py + 11, 7, 3);
    ctx.restore();

    // Clear polycarbonate electrophoresis buffer tank
    draw3DBox(ctx, px + 6, py + 11, 20, 16, 10, 'rgba(186,230,253,0.65)', 'rgba(125,211,252,0.55)', '#0284c7');
    // Green sample comb & blue loading-dye bands inside!
    ctx.fillStyle = '#22c55e';
    ctx.fillRect(px + 9, py + 6, 14, 3);
    ctx.fillStyle = '#1d4ed8';
    ctx.fillRect(px + 10, py + 11, 12, 2);
    if (rxn) {
      const bShift = (nowSec * 10) % 6;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(px + 12, py + 15 - bShift, 1.5, 1.5);
      ctx.fillRect(px + 18, py + 16 - bShift, 1.5, 1.5);
    }

    // Red (+) and Black (-) banana-plug leads arching to PowerPac
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(px + 8, py + 6);
    ctx.quadraticCurveTo(px + 18, py - 2, px + 29, py + 6);
    ctx.stroke();

    ctx.strokeStyle = '#1e293b';
    ctx.beginPath();
    ctx.moveTo(px + 23, py + 6);
    ctx.quadraticCurveTo(px + 28, py + 1, px + 36, py + 6);
    ctx.stroke();

    drawStationMicroTag(ctx, px + pw * 0.5, py + ph - 8, 'GEL');
  }

  // 16. BENCHTOP MICROCENTRIFUGE (Compact Eppendorf Body + Magenta Rotor Lid!)
  function drawCentrifuge(ctx, px, py, pw, ph, rxn, nowSec) {
    const shake = rxn ? Math.sin(nowSec * 40) * 0.6 : 0;
    const cx = px + pw * 0.5 + shake;
    const cy = py + ph * 0.5;

    // Rounded white/grey Eppendorf chassis
    fillRoundRect(ctx, cx - 13, cy - 10, 26, 22, 6, '#f1f5f9', '#334155', 1.3);
    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(cx - 12, cy + 5, 24, 6);

    // Circular vibrant pink/magenta rotor lid!
    ctx.fillStyle = '#ec4899';
    ctx.beginPath();
    ctx.ellipse(cx, cy - 3, 9, 6.5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#9d174d';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.fillStyle = '#fbcfe8';
    ctx.beginPath();
    ctx.arc(cx, cy - 3, 2.2, 0, Math.PI * 2);
    ctx.fill();

    // Front digital RPM display
    const centSt = rxn ? classifyReactionStatus(rxn) : null;
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(cx - 7, cy + 6, 14, 4);
    ctx.save();
    if (rxn) {
      ctx.shadowColor = centSt === 'ready' ? '#22c55e' : '#38bdf8';
      ctx.shadowBlur = 6;
    }
    ctx.fillStyle = centSt === 'ready' ? '#22c55e' : (rxn ? ((Math.floor(nowSec * 4) % 2 === 0) ? '#f59e0b' : '#38bdf8') : '#38bdf8');
    ctx.fillRect(cx - 5, cy + 7.5, 8, 1.5);
    ctx.restore();
  }

  // 17. 37 °C EPPENDORF THERMOMIXER / HEATBLOCK
  function drawHeatblock(ctx, px, py, pw, ph, rxn, nowSec) {
    const orbit = rxn ? Math.cos(nowSec * 22) * 0.8 : 0;
    draw3DBox(ctx, px + 9 + orbit, py + 11, pw - 18, ph - 18, 10, '#f8fafc', '#cbd5e1', '#334155');
    // Dark anodized 24-well heating block on top + colourful Eppendorf caps!
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(px + 13 + orbit, py + 4, pw - 26, 11);
    const capCols = ['#f97316', '#38bdf8', '#a855f7', '#4ade80'];
    for (let i = 0; i < 4; i++) {
      ctx.fillStyle = capCols[i];
      ctx.fillRect(px + 15 + i * 4.5 + orbit, py + 6, 3, 3);
      ctx.fillRect(px + 15 + i * 4.5 + orbit, py + 10.5, 3, 3);
    }
    // Glowing orange 37°C front display (+ status LED when active)
    const hbSt = rxn ? classifyReactionStatus(rxn) : null;
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(px + 14 + orbit, py + ph - 14, 16, 5);
    ctx.fillStyle = hbSt === 'overcooking' ? '#ef4444' : (hbSt === 'sweet_spot' ? '#f59e0b' : (hbSt === 'ready' ? '#22c55e' : '#fb923c'));
    ctx.font = 'bold 6.5px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('37°', px + 22 + orbit, py + ph - 11.2);
    if (rxn) {
      ctx.save();
      ctx.shadowColor = hbSt === 'overcooking' ? '#ef4444' : (hbSt === 'ready' ? '#22c55e' : '#10b981');
      ctx.shadowBlur = 5;
      ctx.fillStyle = hbSt === 'overcooking' ? '#ef4444' : (hbSt === 'ready' ? '#22c55e' : '#10b981');
      ctx.beginPath();
      ctx.arc(px + pw - 12 + orbit, py + ph - 11.5, 1.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  // 18. LAB SPEAKERS (LotR Bookshelf Monitors + Copper Cones!)
  function drawLabSpeakers(ctx, px, py, pw, ph, lotrPlaying, nowSec) {
    const pulse = lotrPlaying ? Math.sin(nowSec * 9) * 0.8 : 0;
    for (let s = 0; s < 2; s++) {
      const sx = px + 8 + s * 18;
      draw3DBox(ctx, sx, py + 12, 13, 12, 13, '#334155', '#0f172a', '#020617');
      // Copper/gold Klipsch/KRK woofer cone + tweeter
      ctx.fillStyle = lotrPlaying ? '#fbbf24' : '#d97706';
      ctx.beginPath();
      ctx.arc(sx + 6.5, py + 18, 3.6 + pulse * 0.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.arc(sx + 6.5, py + 18, 1.2, 0, Math.PI * 2);
      ctx.fill();
      // Status LED
      ctx.fillStyle = lotrPlaying ? '#34d399' : '#8b5cf6';
      ctx.fillRect(sx + 2, py + 12.5, 2, 1.5);
    }
  }

  // 19. WRITE-UP DESK (Warm Honey-Oak / Beech 3/4 Desk + Monitor + Lab Book + Group Strip!)
  function drawWriteupDesk(ctx, room, obj, stackedChildren, npcRxn, nowSec, activeJob) {
    const px = obj.x * TILE_W;
    const py = obj.y * TILE_H;
    const pw = obj.w * TILE_W;
    const ph = obj.h * TILE_H;
    const rise = 15;
    const grp = GROUP_PALETTE[obj.group] || GROUP_PALETTE.none;
    const deskJob = activeJob || npcRxn;
    const tSec = nowSec || 0;

    const frontTopY = py + ph - rise;
    const topY = py - rise;

    // Under-desk kneehole shadow + drawer pedestal + steel legs
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(px + 4, frontTopY + 2, pw - 8, rise - 3);
    ctx.fillStyle = '#64748b';
    ctx.fillRect(px + 3, frontTopY + 1, 4, rise - 1);
    ctx.fillRect(px + pw - 7, frontTopY + 1, 4, rise - 1);
    // Right-side 2-drawer filing pedestal
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(px + pw - 22, frontTopY + 2, 15, rise - 3);
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(px + pw - 17, frontTopY + 5, 5, 1.5);
    ctx.fillRect(px + pw - 17, frontTopY + 10, 5, 1.5);

    // Warm Honey-Beech / Oak Desktop in 3/4 view
    ctx.fillStyle = '#d69e5c';
    ctx.fillRect(px + 1, topY, pw - 2, ph);
    ctx.fillStyle = '#b77938';
    ctx.fillRect(px + 1, frontTopY - 3, pw - 2, 3);

    // Group-bay coloured desk strip along rear/side edge!
    if (obj.group && obj.group !== 'none') {
      ctx.fillStyle = grp.main;
      if (obj.w >= obj.h) {
        ctx.fillRect(px + 2, topY + 1, pw - 4, 4);
      } else {
        ctx.fillRect(px + 2, topY + 1, 4, ph - 2);
      }
    }

    ctx.strokeStyle = '#451a03';
    ctx.lineWidth = 1.2;
    ctx.strokeRect(px + 1.5, topY + 0.5, pw - 3, ph - 1);

    // Check which cells already have stacked pc_terminal or lab_speakers
    const stackedCells = new Set();
    if (stackedChildren) {
      for (let i = 0; i < stackedChildren.length; i++) {
        const ch = stackedChildren[i];
        for (let cy = ch.y; cy < ch.y + ch.h; cy++) {
          for (let cx = ch.x; cx < ch.x + ch.w; cx++) {
            stackedCells.add(cx + ',' + cy);
          }
        }
      }
    }

    if (obj.w >= obj.h) {
      // Horizontal desk: place sleek monitor on first free cell, open UCL lab notebook + mug on second!
      if (!stackedCells.has(obj.x + ',' + obj.y)) {
        // Widescreen monitor + stand
        const mx = px + 11;
        const my = topY + 4;
        ctx.fillStyle = '#334155';
        ctx.fillRect(mx + 9, my + 11, 6, 4);
        ctx.save();
        if (deskJob) {
          ctx.shadowColor = '#38bdf8';
          ctx.shadowBlur = 7;
        }
        fillRoundRect(ctx, mx, my - 5, 24, 16, 2, '#0f172a', deskJob ? '#38bdf8' : '#475569', 1);
        ctx.restore();
        ctx.fillStyle = deskJob ? '#0c4a6e' : '#1e3a8a';
        ctx.fillRect(mx + 2, my - 3, 20, 12);
        if (deskJob) {
          ctx.strokeStyle = '#34d399';
          ctx.lineWidth = 1.1;
          ctx.beginPath();
          for (let wx = 0; wx <= 16; wx += 2) {
            const wy = my + 4 - Math.abs(Math.sin(tSec * 4 + wx * 0.6)) * 5;
            if (wx === 0) ctx.moveTo(mx + 4 + wx, wy);
            else ctx.lineTo(mx + 4 + wx, wy);
          }
          ctx.stroke();
        } else {
          ctx.fillStyle = '#60a5fa';
          ctx.fillRect(mx + 4, my, 12, 2);
          ctx.fillRect(mx + 4, my + 4, 15, 4);
        }
        // Keyboard
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(mx + 3, my + 17, 18, 5);
      }
      if (obj.w >= 2 && !stackedCells.has((obj.x + 1) + ',' + obj.y)) {
        // Open hardbound lab book + white coffee mug!
        const bx = px + TILE_W + 10;
        const by = topY + 14;
        ctx.fillStyle = '#991b1b';
        ctx.fillRect(bx, by, 18, 13);
        ctx.fillStyle = '#fefce8';
        ctx.fillRect(bx + 1.5, by + 1.5, 7, 10);
        ctx.fillRect(bx + 9.5, by + 1.5, 7, 10);
        // Coffee mug
        ctx.fillStyle = '#f8fafc';
        ctx.beginPath();
        ctx.arc(bx + 25, by + 4, 3.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#78350f';
        ctx.beginPath();
        ctx.arc(bx + 25, by + 4, 2.2, 0, Math.PI * 2);
        ctx.fill();
      }
    } else {
      // Vertical 1x2 write-up desk: angled side monitor + open lab notebook
      const mx = px + 10;
      const my = topY + 12;
      ctx.save();
      if (deskJob) {
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 7;
      }
      fillRoundRect(ctx, mx, my, 12, 24, 2, '#0f172a', deskJob ? '#38bdf8' : '#475569', 1);
      ctx.restore();
      ctx.fillStyle = deskJob ? '#7dd3fc' : '#38bdf8';
      ctx.fillRect(mx + 3, my + 3, 6, 18);
      // Lab book in lower half
      ctx.fillStyle = '#1e3a8a';
      ctx.fillRect(px + 14, topY + 46, 18, 14);
      ctx.fillStyle = '#fefce8';
      ctx.fillRect(px + 15.5, topY + 47.5, 15, 11);
    }

    if (npcRxn) {
      const pulse = 0.5 + 0.5 * Math.sin(tSec * 4.5);
      const vx = obj.w >= obj.h ? (px + pw - 20) : (px + pw - 16);
      const vy = topY + 12;
      ctx.save();
      ctx.shadowColor = pulse > 0.5 ? 'rgba(20, 184, 166, 0.7)' : 'rgba(245, 158, 11, 0.65)';
      ctx.shadowBlur = 7;
      drawVectorFlaskIcon(ctx, vx, vy, pulse > 0.5 ? '#14b8a6' : '#f59e0b', '#5eead4', tSec * 1.4);
      ctx.restore();
    }
  }

  // 20. PC TERMINAL (Dedicated Acquisition / Shared PC with Live Spectrum Display!)
  function drawPcTerminal(ctx, px, py, pw, ph, activeJob, nowSec, obj, isViewing, microTag) {
    const tSec = nowSec || 0;
    const isLive = Boolean(activeJob || isViewing);
    const jobStatus = activeJob ? classifyReactionStatus(activeJob, obj) : (isViewing ? 'running' : null);
    const isReady = jobStatus === 'ready' || jobStatus === 'sweet_spot';
    const isOver = jobStatus === 'overcooking';

    // Mini Dell Optiplex tower on right
    draw3DBox(ctx, px + 33, py + 8, 9, 14, 12, '#334155', '#1e293b', '#020617');
    ctx.save();
    if (isLive) {
      ctx.shadowColor = isReady ? '#22c55e' : '#38bdf8';
      ctx.shadowBlur = 5;
    }
    ctx.fillStyle = isOver ? '#ef4444' : (isReady ? '#22c55e' : (isLive ? ((Math.floor(tSec * 4) % 2 === 0) ? '#38bdf8' : '#f59e0b') : '#38bdf8'));
    ctx.fillRect(px + 36, py + 12, 3, 2);
    ctx.restore();

    // Monitor stand + glowing MassLynx / TopSpin spectrum monitor!
    ctx.fillStyle = '#475569';
    ctx.fillRect(px + 15, py + 11, 8, 5);
    ctx.save();
    if (isLive) {
      ctx.shadowColor = isReady ? '#22c55e' : (isOver ? '#ef4444' : '#38bdf8');
      ctx.shadowBlur = 9;
    }
    fillRoundRect(ctx, px + 5, py - 6, 26, 18, 2, '#0f172a', isLive ? (isReady ? '#4ade80' : '#38bdf8') : '#64748b', 1.2);
    ctx.restore();

    ctx.fillStyle = isLive ? (isReady ? '#064e3b' : '#0c4a6e') : '#022c22';
    ctx.fillRect(px + 7, py - 4, 22, 14);

    if (isLive) {
      // Subtle baseline grid + bright animated live NMR / LC-MS waveform!
      ctx.fillStyle = 'rgba(125, 211, 252, 0.28)';
      ctx.fillRect(px + 8, py + 7.5, 20, 0.8);
      const traceCol = isOver ? '#fca5a5' : (isReady ? '#4ade80' : '#38bdf8');
      ctx.strokeStyle = traceCol;
      ctx.lineWidth = 1.3;
      ctx.beginPath();
      const scroll = tSec * 2.2;
      for (let sx = 0; sx <= 20; sx += 1.5) {
        const u = ((sx / 20) + scroll * 0.25) % 1;
        const p1 = Math.exp(-Math.pow((u - 0.28) / 0.075, 2)) * 8.5;
        const p2 = Math.exp(-Math.pow((u - 0.56) / 0.09, 2)) * 5.8;
        const p3 = Math.exp(-Math.pow((u - 0.79) / 0.06, 2)) * 4.2;
        const wy = py + 7.5 - Math.min(10, p1 + p2 + p3);
        if (sx === 0) ctx.moveTo(px + 8 + sx, wy);
        else ctx.lineTo(px + 8 + sx, wy);
      }
      ctx.stroke();
      // Live sweep indicator dot
      const sweepX = px + 8 + ((tSec * 14) % 20);
      ctx.fillStyle = '#fde047';
      ctx.fillRect(sweepX, py - 2, 1.5, 10);
    } else {
      // Crisp green chromatogram/mass spec peaks on screen
      ctx.strokeStyle = '#34d399';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(px + 8, py + 7);
      ctx.lineTo(px + 13, py + 7);
      ctx.lineTo(px + 15, py - 2);
      ctx.lineTo(px + 17, py + 7);
      ctx.lineTo(px + 21, py + 2);
      ctx.lineTo(px + 23, py + 7);
      ctx.lineTo(px + 28, py + 7);
      ctx.stroke();
    }

    // Keyboard + blue mouse pad
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(px + 7, py + 19, 19, 6);
    ctx.fillStyle = '#2563eb';
    ctx.fillRect(px + 28, py + 19, 7, 6);

    if (microTag) {
      drawStationMicroTag(ctx, px + pw * 0.5, py + ph - 9, microTag);
    }
  }

  // 21. SPIRAL STAIRS (2x2 Circular Wrought-Iron Staircase Shaft at (18, 0)!)
  function drawSpiralStairs(ctx, obj) {
    const px = obj.x * TILE_W;
    const py = obj.y * TILE_H;
    const pw = obj.w * TILE_W;
    const ph = obj.h * TILE_H;
    const cx = px + pw * 0.5;
    const cy = py + ph * 0.5 + 2;
    const rx = pw * 0.43;
    const ry = ph * 0.42;

    // Outer circular brass/slate stairwell curb
    ctx.fillStyle = '#334155';
    ctx.beginPath();
    ctx.ellipse(cx, cy, rx + 4, ry + 4, 0, 0, Math.PI * 2);
    ctx.fill();

    // Deep architectural stairwell pit gradient
    const pitGrad = ctx.createRadialGradient(cx, cy - 4, 4, cx, cy, rx);
    pitGrad.addColorStop(0, '#1e293b');
    pitGrad.addColorStop(1, '#090d16');
    ctx.fillStyle = pitGrad;
    ctx.beginPath();
    ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
    ctx.fill();

    // 11 Radiating Black Wrought-Iron Wedge Treads Spiralling Around Center Pole!
    const numSteps = 11;
    for (let i = 0; i < numSteps; i++) {
      const a0 = -Math.PI * 0.35 + i * 0.44;
      const a1 = a0 + 0.36;
      const shade = 52 + i * 9;
      ctx.fillStyle = 'rgb(' + shade + ',' + (shade + 8) + ',' + (shade + 20) + ')';
      ctx.beginPath();
      ctx.moveTo(cx, cy - i * 0.6);
      ctx.lineTo(cx + Math.cos(a0) * (rx - 2), cy + Math.sin(a0) * (ry - 2) - i * 0.6);
      ctx.lineTo(cx + Math.cos(a1) * (rx - 2), cy + Math.sin(a1) * (ry - 2) - i * 0.6);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // Curved Wrought-Iron Balustrade Handrail & Vertical Posts (North/West/East rim, open at South landing!)
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 2;
    for (let a = Math.PI * 0.8; a <= Math.PI * 2.2; a += 0.42) {
      const bx = cx + Math.cos(a) * (rx + 1);
      const by = cy + Math.sin(a) * (ry + 1);
      ctx.beginPath();
      ctx.moveTo(bx, by);
      ctx.lineTo(bx, by - 14);
      ctx.stroke();
    }
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 2.6;
    ctx.beginPath();
    ctx.ellipse(cx, cy - 14, rx + 1, ry + 1, 0, Math.PI * 0.78, Math.PI * 2.22);
    ctx.stroke();

    // Central steel structural column + brass finial cap
    ctx.fillStyle = '#475569';
    ctx.fillRect(cx - 4, cy - 24, 8, 28);
    ctx.fillStyle = '#eab308';
    ctx.beginPath();
    ctx.arc(cx, cy - 24, 4.5, 0, Math.PI * 2);
    ctx.fill();

    drawStationMicroTag(ctx, cx, py + ph - 9, '2F\u21943F');
  }

  // 22. LIFT (2x2 Elevator Doors Fallback)
  function drawLift(ctx, obj) {
    const px = obj.x * TILE_W;
    const py = obj.y * TILE_H;
    const pw = obj.w * TILE_W;
    const ph = obj.h * TILE_H;
    draw3DBox(ctx, px + 4, py, pw - 8, ph, 28, '#334155', '#94a3b8', '#0f172a');
    const frontY = py + ph - 28;
    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(px + 14, frontY + 5, pw - 28, 22);
    ctx.fillStyle = '#475569';
    ctx.fillRect(px + pw * 0.5 - 1, frontY + 5, 2, 22);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(px + pw * 0.5 - 10, frontY + 1, 20, 4);
    ctx.fillStyle = '#f97316';
    ctx.fillRect(px + pw * 0.5 - 3, frontY + 2, 6, 2);
  }

  // 23. SAFETY-SPECS HOLDER (Wall Acrylic Dispenser + Mandatory Blue ISO Sign + Cyan Glasses!)
  function drawSpecsHolder(ctx, obj) {
    const px = obj.x * TILE_W;
    const py = obj.y * TILE_H;
    // Clear acrylic wall dispenser box
    draw3DBox(ctx, px + 11, py + 4, 26, 16, 22, '#e0f2fe', 'rgba(224,242,254,0.88)', '#0284c7');
    // Blue ISO Mandatory Eye-Protection sign on top
    ctx.fillStyle = '#1d4ed8';
    ctx.beginPath();
    ctx.arc(px + 24, py - 12, 6.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(px + 20, py - 13.5, 8, 2.5);

    // Stacked cyan safety specs visible inside dispenser!
    for (let r = 0; r < 3; r++) {
      const gy = py - 2 + r * 5.5;
      ctx.fillStyle = '#0ea5e9';
      ctx.fillRect(px + 15, gy, 7, 3);
      ctx.fillRect(px + 25, gy, 7, 3);
      ctx.fillRect(px + 21, gy + 0.5, 5, 1.5);
    }
  }

  // 24. CO2 FIRE EXTINGUISHER (Bright Crimson Cylinder + Black Horn Nozzle)
  function drawFireExt(ctx, obj) {
    const px = obj.x * TILE_W;
    const py = obj.y * TILE_H;
    const cx = px + 18;
    const baseY = py + TILE_H - 8;

    // Shadow + bright red cylinder
    ctx.fillStyle = 'rgba(15,23,42,0.22)';
    ctx.beginPath();
    ctx.ellipse(cx, baseY + 1, 7, 3.5, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#dc2626';
    fillRoundRect(ctx, cx - 5.5, baseY - 22, 11, 22, 4, '#dc2626', '#7f1d1d', 1);
    // White CO2 identification band
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(cx - 4.5, baseY - 14, 9, 4);
    // Silver valve lever + yellow safety pin
    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(cx - 2, baseY - 26, 6, 4);
    ctx.fillStyle = '#facc15';
    ctx.fillRect(cx - 4, baseY - 25, 2, 2);
    // Black CO2 frost-free discharge horn
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.moveTo(cx + 4, baseY - 23);
    ctx.lineTo(cx + 10, baseY - 11);
    ctx.lineTo(cx + 6, baseY - 10);
    ctx.closePath();
    ctx.fill();
  }

  // 25. BLACK TUB KEY STASH
  function drawBlackTubKey(ctx, px, py, pw, ph) {
    draw3DBox(ctx, px + 11, py + 12, 26, 16, 10, '#1e293b', '#0f172a', '#020617');
    ctx.fillStyle = '#eab308';
    ctx.beginPath();
    ctx.arc(px + 26, py + 10, 3.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(px + 20, py + 9, 6, 2);
  }

  // 26. WASTE WINCHESTERS & SILICA DRUM (Yellow Spill Bund + Halogenated/Non-Hal Winchesters + Blue Drum!)
  function drawWasteBin(ctx, obj) {
    const px = obj.x * TILE_W;
    const py = obj.y * TILE_H;
    const pw = obj.w * TILE_W;
    const ph = obj.h * TILE_H;

    // Yellow COSHH secondary spill bund tray
    draw3DBox(ctx, px + 3, py + 10, pw - 6, ph - 12, 7, '#fef08a', '#eab308', '#854d0e');

    // White 5L HDPE Non-Halogenated Jerrycan
    draw3DBox(ctx, px + 6, py + 8, 12, 11, 13, '#f8fafc', '#e2e8f0', '#475569');
    ctx.fillStyle = '#dc2626'; // red cap
    ctx.fillRect(px + 9, py - 7, 5, 3);
    ctx.fillStyle = '#f97316'; // hazard label
    ctx.fillRect(px + 8, py + 10, 8, 5);

    // Amber Glass 2.5L Halogenated Winchester
    ctx.fillStyle = '#78350f';
    fillRoundRect(ctx, px + 20, py - 3, 9, 19, 3, '#78350f', '#451a03', 1);
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(px + 22.5, py - 6, 4, 3);
    ctx.fillStyle = '#fef3c7';
    ctx.fillRect(px + 21.5, py + 5, 6, 6);

    // Blue-Lidded Contaminated Silica Drum on right
    ctx.fillStyle = '#f1f5f9';
    ctx.fillRect(px + 31, py + 1, 11, 16);
    ctx.strokeStyle = '#64748b';
    ctx.strokeRect(px + 31, py + 1, 11, 16);
    ctx.fillStyle = '#2563eb';
    ctx.beginPath();
    ctx.ellipse(px + 36.5, py + 1, 6, 3, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  // 27. TEA DRAWER ("Richard's Kettle" with Steam Puffs + Yorkshire/Bettys Biscuit Tin!)
  function drawTeaDrawer(ctx, obj, nowSec) {
    const px = obj.x * TILE_W;
    const py = obj.y * TILE_H;
    const pw = obj.w * TILE_W;
    const ph = obj.h * TILE_H;

    // Warm oak tea cabinet
    draw3DBox(ctx, px + 4, py + 4, pw - 8, ph - 6, 15, '#d69e5c', '#b45309', '#451a03');
    ctx.fillStyle = '#fde047'; // brass drawer knob
    ctx.beginPath();
    ctx.arc(px + pw * 0.5, py + ph - 9, 2, 0, Math.PI * 2);
    ctx.fill();

    // Gleaming Brushed-Steel Cordless Electric Kettle on left!
    const kx = px + 14;
    const ky = py + 4;
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.ellipse(kx, ky + 3, 6.5, 3, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#e2e8f0';
    ctx.beginPath();
    ctx.moveTo(kx - 5.5, ky + 2);
    ctx.lineTo(kx - 4, ky - 10);
    ctx.lineTo(kx + 4, ky - 10);
    ctx.lineTo(kx + 5.5, ky + 2);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 1;
    ctx.stroke();
    // Black handle + water window
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(kx - 5, ky - 4, 3.5, Math.PI * 0.5, Math.PI * 1.5);
    ctx.stroke();
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(kx - 1, ky - 7, 2, 6);

    // Animated Rising White Steam Puffs from Kettle Spout!
    for (let p = 0; p < 3; p++) {
      const phase = (nowSec * 1.1 + p * 0.33) % 1;
      const sx = kx + 4 + Math.sin(nowSec * 3 + p) * 2;
      const sy = ky - 11 - phase * 12;
      const alpha = (1 - phase) * 0.65;
      ctx.fillStyle = 'rgba(255, 255, 255, ' + alpha.toFixed(2) + ')';
      ctx.beginPath();
      ctx.arc(sx, sy, 2 + phase * 2, 0, Math.PI * 2);
      ctx.fill();
    }

    // Red & Gold Bettys / Yorkshire Tea Tin + Ceramic Mug on right!
    draw3DBox(ctx, px + 26, py + 1, 12, 9, 8, '#facc15', '#dc2626', '#7f1d1d');
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(px + 33, py + 13, 3.2, 0, Math.PI * 2);
    ctx.fill();
  }

  // 28. WATERS ACQUITY UPLC-MS (Stacked HPLC Tower + Eluent Bottles + Xevo Q-TOF MS!)
  function drawLcmsUnit(ctx, obj, nowSec, activeJob) {
    const tSec = nowSec || 0;
    const px = obj.x * TILE_W;
    const py = obj.y * TILE_H;
    const pw = obj.w * TILE_W;
    const ph = obj.h * TILE_H;
    const jobStatus = activeJob ? classifyReactionStatus(activeJob, obj) : null;
    const isReady = jobStatus === 'ready' || jobStatus === 'sweet_spot';
    const activeLed = isReady ? '#22c55e' : ((Math.floor(tSec * 3.5) % 2 === 0) ? '#f59e0b' : '#38bdf8');

    // Stainless bench base
    draw3DBox(ctx, px + 2, py, pw - 4, ph, 15, '#334155', '#cbd5e1', '#0f172a');

    // Upper tile: Stacked Waters Acquity UPLC modules + top eluent bottle tray!
    const stackTop = py - 28;
    draw3DBox(ctx, px + 6, py + 4, pw - 12, TILE_H - 8, 28, '#f1f5f9', '#e2e8f0', '#334155');
    // Smoked blue-tinted Acquity module doors (QSM / Sample Manager / PDA)
    for (let m = 0; m < 3; m++) {
      const my = py + TILE_H - 30 + m * 8.5;
      fillRoundRect(ctx, px + 9, my, pw - 18, 7, 1.5, '#1e3a8a', '#64748b', 0.8);
      ctx.save();
      if (activeJob) {
        ctx.shadowColor = activeLed;
        ctx.shadowBlur = 6;
        ctx.fillStyle = isReady ? '#22c55e' : ((Math.floor(tSec * 3.5 + m) % 2 === 0) ? '#f59e0b' : '#38bdf8');
      } else {
        ctx.fillStyle = (Math.floor(tSec * 2 + m + obj.x) % 2 === 0) ? '#4ade80' : '#38bdf8';
      }
      ctx.fillRect(px + 11, my + 2.5, 2.5, 2);
      ctx.restore();
    }
    // Eluent bottles (MeCN / H2O + 0.1% FA) on top solvent tray!
    ctx.fillStyle = '#92400e';
    ctx.fillRect(px + 11, stackTop - 6, 7, 8);
    ctx.fillStyle = '#bae6fd';
    ctx.fillRect(px + 21, stackTop - 6, 7, 8);
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(px + 12.5, stackTop - 8, 4, 2);
    ctx.fillStyle = '#2563eb';
    ctx.fillRect(px + 22.5, stackTop - 8, 4, 2);

    // Subtle acquire/ready indicator beacon on upper UPLC deck when job active
    if (activeJob) {
      ctx.save();
      ctx.shadowColor = activeLed;
      ctx.shadowBlur = 7;
      ctx.fillStyle = activeLed;
      ctx.beginPath();
      ctx.arc(px + pw - 12, stackTop - 4, 2.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // Lower tile (if 1x2): Charcoal Waters Xevo G2-XS Q-TOF Mass Spectrometer + ESI Source!
    if (ph > TILE_H) {
      const msY = py + TILE_H;
      draw3DBox(ctx, px + 5, msY + 2, pw - 10, TILE_H - 6, 26, '#334155', '#1e293b', '#020617');
      // Crimson/Burgundy Xevo accent stripe + ESI source viewport
      ctx.fillStyle = '#be123c';
      ctx.fillRect(px + 7, msY + TILE_H - 26, pw - 14, 4);
      ctx.save();
      if (activeJob) {
        ctx.shadowColor = activeLed;
        ctx.shadowBlur = 8;
      }
      ctx.fillStyle = activeJob ? activeLed : '#38bdf8';
      ctx.beginPath();
      ctx.arc(px + 16, msY + TILE_H - 14, 4, 0, Math.PI * 2);
      ctx.fill();
      // Blinking vacuum green / active status LED
      ctx.fillStyle = activeJob ? activeLed : '#4ade80';
      ctx.fillRect(px + pw - 14, msY + TILE_H - 16, 4, 3);
      ctx.restore();
    }
  }

  // 29. MALDI-TOF MS TOWER
  function drawMaldiUnit(ctx, obj, nowSec, activeJob) {
    const tSec = nowSec || 0;
    const px = obj.x * TILE_W;
    const py = obj.y * TILE_H;
    const pw = obj.w * TILE_W;
    const ph = obj.h * TILE_H;
    const rise = 30;
    const jobStatus = activeJob ? classifyReactionStatus(activeJob, obj) : null;
    const isReady = jobStatus === 'ready' || jobStatus === 'sweet_spot';
    const activeLed = isReady ? '#22c55e' : ((Math.floor(tSec * 4) % 2 === 0) ? '#f59e0b' : '#38bdf8');

    draw3DBox(ctx, px + 5, py + 2, pw - 10, ph - 4, rise, '#e2e8f0', '#cbd5e1', '#1e293b');
    // Vertical dark-crimson flight-tube column rising from rear
    draw3DBox(ctx, px + 11, py + 2, pw - 22, 16, rise + 8, '#881337', '#4c0519', '#0f172a');

    const frontY = py + ph - 2 - rise;
    // Stainless target-plate sample loading drawer + laser warning badge
    ctx.fillStyle = '#334155';
    ctx.fillRect(px + 10, frontY + 9, pw - 20, 9);
    ctx.fillStyle = '#facc15';
    ctx.fillRect(px + 12, frontY + 12, 4, 4);
    ctx.save();
    if (activeJob) {
      ctx.shadowColor = activeLed;
      ctx.shadowBlur = 7;
    }
    ctx.fillStyle = activeJob ? activeLed : ((Math.floor(tSec * 2.5) % 2 === 0) ? '#38bdf8' : '#22c55e');
    ctx.fillRect(px + pw - 16, frontY + 12, 4, 3);
    if (activeJob) {
      // Subtle acquire/ready indicator on flight-tube top cap
      ctx.fillStyle = activeLed;
      ctx.beginPath();
      ctx.arc(px + pw * 0.5, py + 2 - (rise + 8) + 6, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  // 30. BRUKER ULTRASHIELD / ASCEND SUPERCONDUCTING NMR MAGNET (2x2 Showstopper!)
  function drawNmrMagnet(ctx, obj, nowSec, activeJob) {
    const tSec = nowSec || 0;
    const px = obj.x * TILE_W;
    const py = obj.y * TILE_H;
    const pw = obj.w * TILE_W;
    const ph = obj.h * TILE_H;
    const cx = px + pw * 0.5 - 4;
    const baseY = py + ph - 10;

    const lbl = obj.label || '400 MHz';
    const is700 = lbl.includes('700');
    const is600 = lbl.includes('600');
    const bandColor = is700 ? '#7c3aed' : (is600 ? '#4f46e5' : '#0284c7');
    const jobStatus = activeJob ? classifyReactionStatus(activeJob, obj) : null;
    const isReady = jobStatus === 'ready' || jobStatus === 'sweet_spot';
    const activeLed = isReady ? '#22c55e' : ((Math.floor(tSec * 3.2) % 2 === 0) ? '#f59e0b' : '#38bdf8');

    // 1. Yellow/Black "5 GAUSS MAGNETIC FIELD" floor safety ring!
    ctx.save();
    ctx.strokeStyle = 'rgba(234, 179, 8, 0.72)';
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 4]);
    ctx.beginPath();
    ctx.ellipse(cx, baseY - 12, 38, 24, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

    // 2. Adjacent Bruker Avance III / Neo Acquisition Console Cabinet on far right
    draw3DBox(ctx, px + pw - 22, py + ph - 34, 18, 24, 22, '#475569', '#334155', '#0f172a');
    ctx.fillStyle = bandColor;
    ctx.fillRect(px + pw - 20, py + ph - 30, 14, 4);
    ctx.save();
    if (activeJob) {
      ctx.shadowColor = activeLed;
      ctx.shadowBlur = 7;
    }
    ctx.fillStyle = activeJob ? activeLed : '#4ade80';
    ctx.fillRect(px + pw - 18, py + ph - 22, 3, 2);
    ctx.fillStyle = activeJob ? (isReady ? '#4ade80' : ((Math.floor(tSec * 3.2 + 1) % 2 === 0) ? '#f59e0b' : '#38bdf8')) : '#4ade80';
    ctx.fillRect(px + pw - 13, py + ph - 22, 3, 2);
    ctx.restore();

    // 3. Three Heavy Pneumatic Anti-Vibration Legs under the Cryostat!
    const legAngles = [-2.3, -0.8, 0.9];
    for (let i = 0; i < legAngles.length; i++) {
      const lx = cx + Math.cos(legAngles[i]) * 22;
      const ly = baseY - 8 + Math.sin(legAngles[i]) * 12;
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.ellipse(lx, ly + 8, 6, 3.5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#64748b';
      ctx.fillRect(lx - 4, ly - 16, 8, 24);
    }

    // 4. Towering Cylindrical Brushed-Silver & White Cryostat Dewar!
    const cylR = 27;
    const cylH = is700 ? 54 : (is600 ? 50 : 46);
    const cylBotY = baseY - 16;
    const cylTopY = cylBotY - cylH;

    // Bottom dish of cryostat
    ctx.fillStyle = '#64748b';
    ctx.beginPath();
    ctx.ellipse(cx, cylBotY, cylR, 13, 0, 0, Math.PI * 2);
    ctx.fill();

    // Metallic cylindrical body gradient
    const mg = ctx.createLinearGradient(cx - cylR, 0, cx + cylR, 0);
    mg.addColorStop(0, '#cbd5e1');
    mg.addColorStop(0.32, '#ffffff');
    mg.addColorStop(0.7, '#e2e8f0');
    mg.addColorStop(1, '#94a3b8');
    ctx.fillStyle = mg;
    ctx.fillRect(cx - cylR, cylTopY, cylR * 2, cylH);

    // Circumferential Bruker Ascend / UltraShield Signature Colour Band!
    ctx.fillStyle = bandColor;
    ctx.beginPath();
    ctx.ellipse(cx, cylTopY + 18, cylR, 11, 0, 0, Math.PI);
    ctx.lineTo(cx - cylR, cylTopY + 10);
    ctx.ellipse(cx, cylTopY + 10, cylR, 11, 0, Math.PI, 0, true);
    ctx.closePath();
    ctx.fill();

    // Top dome of cryostat
    ctx.fillStyle = '#f8fafc';
    ctx.beginPath();
    ctx.ellipse(cx, cylTopY, cylR, 12.5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 1.2;
    ctx.stroke();

    // Cryostat outer side strokes
    ctx.beginPath();
    ctx.moveTo(cx - cylR, cylTopY);
    ctx.lineTo(cx - cylR, cylBotY);
    ctx.moveTo(cx + cylR, cylTopY);
    ctx.lineTo(cx + cylR, cylBotY);
    ctx.stroke();

    // 5. SampleCase Carousel + Liquid He / N2 Turret Stack + Cryostat Boil-Off Mist!
    ctx.fillStyle = '#0284c7'; // Blue SampleXpress / SampleCase autosampler ring
    ctx.beginPath();
    ctx.ellipse(cx, cylTopY - 2, 13, 6, 0, 0, Math.PI * 2);
    ctx.fill();
    // Breathing / active SampleCase carousel LEDs
    for (let led = 0; led < 3; led++) {
      const a = -2.4 + led * 1.1;
      const lx = cx + Math.cos(a) * 9.5;
      const ly = cylTopY - 2 + Math.sin(a) * 4.2;
      if (activeJob) {
        ctx.save();
        ctx.shadowColor = activeLed;
        ctx.shadowBlur = 5;
        ctx.fillStyle = isReady ? '#22c55e' : ((Math.floor(tSec * 4 + led) % 2 === 0) ? '#f59e0b' : '#38bdf8');
        ctx.beginPath();
        ctx.arc(lx, ly, 1.6, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      } else {
        const glow = 0.45 + 0.5 * Math.sin(tSec * 2.6 + led * 1.7 + obj.x);
        ctx.fillStyle = 'rgba(125, 211, 252, ' + glow.toFixed(2) + ')';
        ctx.beginPath();
        ctx.arc(lx, ly, 1.3, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    // Central pneumatic sample lift tube + N2/He cryogen stacks
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(cx - 2.5, cylTopY - 20, 5, 18);
    if (activeJob) {
      // Subtle acquire/ready status beacon atop sample lift tube
      ctx.save();
      ctx.shadowColor = activeLed;
      ctx.shadowBlur = 8;
      ctx.fillStyle = activeLed;
      ctx.beginPath();
      ctx.arc(cx, cylTopY - 21, 2.6, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(cx - 11, cylTopY - 12, 3.5, 10);
    ctx.fillRect(cx + 7.5, cylTopY - 12, 3.5, 10);

    // Gentle Liquid-N2 / He cryogen boil-off mist wisps venting from turret stacks
    const stackXs = [cx - 9.25, cx + 9.25];
    for (let s = 0; s < stackXs.length; s++) {
      for (let w = 0; w < 2; w++) {
        const phM = (tSec * 0.65 + s * 0.45 + w * 0.5 + obj.x * 0.1) % 1;
        const mx = stackXs[s] + Math.sin(tSec * 2.2 + w * 2 + s) * 2.5;
        const my = (cylTopY - 13) - phM * 13;
        const alpha = (1 - phM) * 0.42;
        ctx.fillStyle = 'rgba(241, 245, 249, ' + alpha.toFixed(2) + ')';
        ctx.beginPath();
        ctx.arc(mx, my, 1.8 + phM * 2.3, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // 6. Crisp Readable "400 / 500 / 600 / 700 MHz" Front Nameplate Badge!
    const badgeW = 48;
    const bx = cx - badgeW * 0.5;
    const by = cylTopY + 29;
    fillRoundRect(ctx, bx, by, badgeW, 14, 3, '#0f172a', '#cbd5e1', 1);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 9.5px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(lbl, cx, by + 7.5);
  }

  // 31. GORDON'S CAFÉ COUNTER (Warm Walnut Bar + Gleaming Espresso Machine + Pastry Vitrine!)
  function drawCafeCounter(ctx, obj, nowSec) {
    const px = obj.x * TILE_W;
    const py = obj.y * TILE_H;
    const pw = obj.w * TILE_W;
    const ph = obj.h * TILE_H;
    const rise = 20;

    // Rich Bloomsbury walnut front + warm cream marble countertop
    draw3DBox(ctx, px + 2, py, pw - 4, ph, rise, '#f5efe6', '#78350f', '#291002', '#ffffff');

    // Decorative vertical brass/walnut front panelling
    const frontY = py + ph - rise;
    ctx.fillStyle = '#92400e';
    for (let sx = px + 10; sx < px + pw - 12; sx += 22) {
      ctx.fillRect(sx, frontY + 4, 14, rise - 8);
    }

    const topY = py - rise;
    // Left: Gleaming Italian Twin-Group Chrome Espresso Machine + Grinder!
    draw3DBox(ctx, px + 14, py + 4, 38, 22, 16, '#e2e8f0', '#94a3b8', '#334155', '#ffffff');
    ctx.fillStyle = '#dc2626'; // La Marzocco crimson trim
    ctx.fillRect(px + 16, py - 10, 34, 3);
    // Two black portafilter handles + espresso cups + amber extraction drops underneath
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(px + 23, py + 11, 3, 7);
    ctx.fillRect(px + 37, py + 11, 3, 7);
    const dropPhase = (nowSec * 2.2) % 1;
    ctx.fillStyle = '#92400e';
    ctx.fillRect(px + 24, py + 18 + dropPhase * 3, 1.5, 2);
    ctx.fillRect(px + 38, py + 18 + ((dropPhase + 0.5) % 1) * 3, 1.5, 2);
    // Multi-puff curling steam wand plumes
    for (let s = 0; s < 3; s++) {
      const puff = (nowSec * 1.15 + s * 0.33) % 1;
      const sx = px + 48 + Math.sin(nowSec * 2.8 + s * 1.9) * 2.4;
      const sy = py - 8 - puff * 12;
      ctx.fillStyle = 'rgba(255,255,255,' + ((1 - puff) * 0.52).toFixed(2) + ')';
      ctx.beginPath();
      ctx.arc(sx, sy, 1.8 + puff * 2.2, 0, Math.PI * 2);
      ctx.fill();
    }

    // Center: Curved Glass Croissant & Pastry Display Vitrine (Strictly UNSLICED whole croissants for Antoine!)
    const vitX = px + 68;
    draw3DBox(ctx, vitX, py + 5, 56, 22, 14, 'rgba(224,242,254,0.65)', 'rgba(186,230,253,0.52)', '#64748b');
    for (let c = 0; c < 4; c++) {
      ctx.fillStyle = '#d97706';
      ctx.beginPath();
      ctx.ellipse(vitX + 11 + c * 11, py + 4, 4.5, 2.8, 0.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.ellipse(vitX + 11 + c * 11, py + 11, 4.2, 2.5, -0.2, 0, Math.PI * 2);
      ctx.fill();
    }

    // Right: Contactless POS Till + Chalkboard Menu Card
    draw3DBox(ctx, px + pw - 44, py + 7, 24, 16, 12, '#1e293b', '#0f172a', '#020617');
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(px + pw - 41, py - 2, 18, 9);
  }

  // 32. GORDON'S CAFÉ TABLE & CHAIRS (2x2 Bistro Round Table + Bentwood Chairs + Flat Whites!)
  function drawCafeTable(ctx, obj, nowSec) {
    const tSec = nowSec || 0;
    const px = obj.x * TILE_W;
    const py = obj.y * TILE_H;
    const pw = obj.w * TILE_W;
    const ph = obj.h * TILE_H;
    const cx = px + pw * 0.5;
    const cy = py + ph * 0.5 + 2;

    // 4 Cozy Bentwood Bistro Chairs tucked around the table
    const chairs = [
      { dx: -26, dy: -2 },
      { dx: 26,  dy: -2 },
      { dx: -14, dy: -18 },
      { dx: 14,  dy: 14 }
    ];
    for (let i = 0; i < chairs.length; i++) {
      const chX = cx + chairs[i].dx;
      const chY = cy + chairs[i].dy;
      ctx.fillStyle = '#78350f';
      ctx.beginPath();
      ctx.ellipse(chX, chY, 9, 6.5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#451a03';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      // Curved bentwood backrest
      ctx.beginPath();
      ctx.arc(chX, chY - 5, 7.5, Math.PI * 1.1, Math.PI * 1.9);
      ctx.stroke();
    }

    // Cast-iron central pedestal base + shadow
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.ellipse(cx, cy + 10, 11, 5.5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(cx - 3, cy - 8, 6, 18);

    // Warm round honey-oak bistro tabletop in 3/4 ellipse!
    ctx.fillStyle = '#92400e';
    ctx.beginPath();
    ctx.ellipse(cx, cy - 7, 25, 16, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#d97706';
    ctx.beginPath();
    ctx.ellipse(cx, cy - 10, 25, 16, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#451a03';
    ctx.lineWidth = 1.2;
    ctx.stroke();

    // Two white porcelain flat-white espresso cups on saucers + rising curling aroma steam!
    const cups = [[-8, -12], [9, -8]];
    for (let c = 0; c < cups.length; c++) {
      const ux = cx + cups[c][0];
      const uy = cy + cups[c][1];
      ctx.fillStyle = '#f8fafc';
      ctx.beginPath();
      ctx.ellipse(ux, uy, 4.5, 3, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#92400e'; // crema latte art!
      ctx.beginPath();
      ctx.arc(ux, uy - 0.5, 2.2, 0, Math.PI * 2);
      ctx.fill();
      for (let w = 0; w < 2; w++) {
        const sp = (tSec * 0.75 + c * 0.4 + w * 0.5 + obj.x * 0.13) % 1;
        const sx = ux + Math.sin(tSec * 2.5 + c + w * 2) * 1.6;
        const sy = uy - 2 - sp * 9;
        ctx.fillStyle = 'rgba(255, 255, 255, ' + ((1 - sp) * 0.45).toFixed(2) + ')';
        ctx.beginPath();
        ctx.arc(sx, sy, 1.1 + sp * 1.2, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  // 33. MEETING TABLE ("The Room" Friday Group Audit Seminar Tables)
  function drawMeetingTable(ctx, obj) {
    const px = obj.x * TILE_W;
    const py = obj.y * TILE_H;
    const pw = obj.w * TILE_W;
    const ph = obj.h * TILE_H;
    const rise = 15;

    // Brushed steel legs + modesty panel
    ctx.fillStyle = '#334155';
    ctx.fillRect(px + 8, py + ph - rise, pw - 16, rise - 4);
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(px + 5, py + ph - rise, 4, rise);
    ctx.fillRect(px + pw - 9, py + ph - rise, 4, rise);

    // Warm walnut/beech conference tabletop
    draw3DBox(ctx, px + 1, py, pw - 2, ph - 2, rise, '#b9834b', '#854d0e', '#451a03', '#e7b98a');

    // Laptops & printed 4-slide Friday Audit handouts along the table!
    const topY = py - rise;
    for (let c = 0; c < obj.w; c += 2) {
      const lx = px + c * TILE_W + 14;
      // Silver open laptop
      ctx.fillStyle = '#cbd5e1';
      ctx.fillRect(lx, topY + 12, 18, 11);
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(lx + 2, topY + 5, 14, 8);
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(lx + 3.5, topY + 6.5, 11, 5);
      // Printed slide handout beside laptop
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(lx + 24, topY + 13, 12, 9);
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(lx + 26, topY + 15, 8, 1.5);
      ctx.fillRect(lx + 26, topY + 18, 6, 1.5);
    }
  }

  // 34. CHAIR / SEMINAR SEAT (Including Vijay's Front-Row Auditor Seat, Split Base/Backrest for Z-Order!)
  function drawChair(ctx, obj, part) {
    const px = obj.x * TILE_W;
    const py = obj.y * TILE_H;
    const cx = px + TILE_W * 0.5;
    const cy = py + TILE_H * 0.5 + 3;
    const isVijaySeat = obj.group === 'chudasama' || String(obj.label || '').toLowerCase().includes('vijay');

    const seatMain = isVijaySeat ? '#2563eb' : '#4f46e5';
    const seatDark = isVijaySeat ? '#1e3a8a' : '#312e81';
    const drawBase = part !== 'backrest';
    const drawBack = part !== 'base';

    if (drawBase) {
      // 5-star caster base
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(cx - 9, cy + 8);
      ctx.lineTo(cx + 9, cy + 8);
      ctx.moveTo(cx, cy + 2);
      ctx.lineTo(cx, cy + 9);
      ctx.stroke();

      // Cushioned seat pad
      fillRoundRect(ctx, cx - 11, cy - 7, 22, 13, 4, seatMain, seatDark, 1.2);
    }

    if (drawBack) {
      // Backrest (chair faces North toward projector when dir === 'N')
      if (obj.dir === 'N') {
        // Seen from behind/3/4: tall curved backrest at south edge of seat (renders in front of seated occupant!)
        fillRoundRect(ctx, cx - 10, cy - 3, 20, 11, 3, seatDark, '#0f172a', 1.2);
        if (isVijaySeat) {
          ctx.fillStyle = '#fde047';
          ctx.fillRect(cx - 5, cy + 1, 10, 2);
        }
      } else {
        fillRoundRect(ctx, cx - 10, cy - 16, 20, 11, 3, seatMain, seatDark, 1.2);
      }
    }
  }

  // 35. PROJECTOR SCREEN & PODIUM (Mounted on North Wall of Meeting Room with 4-Slide Audit Diagram!)
  function drawProjector(ctx, obj, nowSec) {
    const px = obj.x * TILE_W;
    const py = obj.y * TILE_H;
    const pw = obj.w * TILE_W;
    const ph = obj.h * TILE_H;

    // Large illuminated pull-down projection screen mounted on the North seminar wall!
    const scrX = px + 6;
    const scrY = py + 2;
    const scrW = pw - 12;
    const scrH = 34;

    // Pelmet roller housing
    ctx.fillStyle = '#334155';
    ctx.fillRect(scrX - 3, scrY - 4, scrW + 6, 5);

    // Glowing white projection canvas
    ctx.save();
    ctx.shadowColor = 'rgba(96, 165, 250, 0.35)';
    ctx.shadowBlur = 12;
    fillRoundRect(ctx, scrX, scrY, scrW, scrH, 2, '#f8fafc', '#475569', 1.3);
    ctx.restore();

    //UCL Chudasama Group Slide Header Bar
    ctx.fillStyle = '#1d4ed8';
    ctx.fillRect(scrX + 2, scrY + 2, scrW - 4, 6);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 6px sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText('CHUDASAMA GROUP FRIDAY UPDATE — diBrPD & DAR 2.0', scrX + 6, scrY + 5.2);

    // Left panel: Pyridazinedione ring diagram
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    for (let k = 0; k < 6; k++) {
      const a = k * Math.PI / 3;
      const hx = scrX + 24 + Math.cos(a) * 7;
      const hy = scrY + 20 + Math.sin(a) * 7;
      if (k === 0) ctx.moveTo(hx, hy);
      else ctx.lineTo(hx, hy);
    }
    ctx.closePath();
    ctx.stroke();

    // Middle panel: SDS-PAGE gel lanes (150 kDa intact DAR 2 vs unreduced control!)
    ctx.fillStyle = '#dbeafe';
    ctx.fillRect(scrX + 52, scrY + 11, 30, 19);
    ctx.fillStyle = '#1e40af';
    ctx.fillRect(scrX + 56, scrY + 15, 6, 2.5);
    ctx.fillRect(scrX + 65, scrY + 15, 6, 2.5);
    ctx.fillRect(scrX + 74, scrY + 22, 5, 2);

    // Right panel: Clean HRMS deconvoluted peak!
    ctx.strokeStyle = '#059669';
    ctx.beginPath();
    ctx.moveTo(scrX + 92, scrY + 28);
    ctx.lineTo(scrX + 104, scrY + 28);
    ctx.lineTo(scrX + 108, scrY + 12);
    ctx.lineTo(scrX + 112, scrY + 28);
    ctx.lineTo(scrX + scrW - 8, scrY + 28);
    ctx.stroke();

    // Moving red laser-pointer dot!
    const lx = scrX + 68 + Math.cos(nowSec * 2.1) * 28;
    const ly = scrY + 19 + Math.sin(nowSec * 3.3) * 5;
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(lx, ly, 2, 0, Math.PI * 2);
    ctx.fill();
  }

  // 36. TOILET / WASHROOM, KLB 3F OFFICE FIXTURES & CUSTOM BLOCK FALLBACKS
  function drawToilet(ctx, obj) {
    const px = obj.x * TILE_W;
    const py = obj.y * TILE_H;
    draw3DBox(ctx, px + 12, py + 4, 24, 12, 20, '#ffffff', '#e2e8f0', '#64748b');
    ctx.fillStyle = '#f8fafc';
    ctx.beginPath();
    ctx.ellipse(px + 24, py + 24, 10, 11, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#64748b';
    ctx.stroke();
  }

  // 37. WHITEBOARD (Mounted Dry-Erase Board with Benzene Ring, Reaction Arrows & Marker Tray!)
  function drawWhiteboard(ctx, room, obj) {
    const px = obj.x * TILE_W;
    const py = obj.y * TILE_H;
    const pw = obj.w * TILE_W;
    const ph = obj.h * TILE_H;
    const onWall = isWallLike(getTileSafe(room, obj.x, obj.y));
    const isVertical = obj.h > obj.w;

    if (isVertical && !onWall) {
      // Side-wall vertical 1x2 mounted dry-erase whiteboard
      const eastWall = isWallLike(getTileSafe(room, obj.x + obj.w, obj.y));
      const bx = eastWall ? (px + pw - 16) : (px + 4);
      const by = py - 14;
      const bw = 12;
      const bh = ph + 6;
      fillRoundRect(ctx, bx, by, bw, bh, 2, '#f8fafc', '#64748b', 1.4);
      ctx.strokeStyle = '#1e3a8a';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(bx + bw * 0.5, by + 18, 3.2, 0, Math.PI * 2);
      ctx.moveTo(bx + bw * 0.5, by + 25);
      ctx.lineTo(bx + bw * 0.5, by + 35);
      ctx.stroke();
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(bx - 1, by + bh - 4, bw + 2, 3);
      return;
    }

    const bx = px + 4;
    const bw = pw - 8;
    const bh = 27;
    const by = onWall ? (py + 5) : (py - 17);

    // Subtle mounting brackets / wall cleat shadow when placed on floor tile
    if (!onWall) {
      ctx.fillStyle = '#475569';
      ctx.fillRect(bx + 5, by + bh, 3, 14);
      ctx.fillRect(bx + bw - 8, by + bh, 3, 14);
      ctx.fillStyle = '#334155';
      ctx.fillRect(bx + 3, by + bh + 12, 7, 3);
      ctx.fillRect(bx + bw - 10, by + bh + 12, 7, 3);
    }

    // Brushed aluminium outer bezel + crisp white dry-erase enamel
    fillRoundRect(ctx, bx - 1.5, by - 1.5, bw + 3, bh + 3, 2.5, '#cbd5e1', '#475569', 1.2);
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(bx + 1, by + 1, bw - 2, bh - 2);

    // Glossy enamel diagonal sheen
    ctx.fillStyle = 'rgba(186, 230, 253, 0.22)';
    ctx.beginPath();
    ctx.moveTo(bx + 4, by + 1);
    ctx.lineTo(bx + 16, by + 1);
    ctx.lineTo(bx + 7, by + bh - 1);
    ctx.lineTo(bx + 1, by + bh - 1);
    ctx.closePath();
    ctx.fill();

    // Tiny drawn organic chemistry mechanism: benzene ring + reaction arrow + product!
    const midY = by + 13;
    const hexCx = bx + Math.min(14, bw * 0.24);
    const hexR = 5.2;
    ctx.save();
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1.1;
    ctx.beginPath();
    for (let k = 0; k < 6; k++) {
      const a = k * (Math.PI / 3) - Math.PI / 6;
      const hx = hexCx + Math.cos(a) * hexR;
      const hy = midY + Math.sin(a) * hexR;
      if (k === 0) ctx.moveTo(hx, hy);
      else ctx.lineTo(hx, hy);
    }
    ctx.closePath();
    ctx.stroke();
    // Inscribed aromatic circle inside benzene ring
    ctx.beginPath();
    ctx.arc(hexCx, midY, hexR * 0.54, 0, Math.PI * 2);
    ctx.stroke();

    // Reaction arrow + red reagent tick above arrow
    const arrStart = hexCx + 8;
    const arrEnd = Math.min(bx + bw - 12, arrStart + (bw >= 72 ? 22 : 12));
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 1.1;
    ctx.beginPath();
    ctx.moveTo(arrStart, midY);
    ctx.lineTo(arrEnd, midY);
    ctx.lineTo(arrEnd - 3, midY - 2.3);
    ctx.moveTo(arrEnd, midY);
    ctx.lineTo(arrEnd - 3, midY + 2.3);
    ctx.stroke();
    // Red reagent conditions above arrow & blue note below
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(arrStart + 2, midY - 4.5, Math.max(4, arrEnd - arrStart - 5), 1.4);
    ctx.fillStyle = '#2563eb';
    ctx.fillRect(arrStart + 2, midY + 3, Math.max(4, arrEnd - arrStart - 6), 1.2);

    // Right-hand product ring / yield annotations
    if (bw >= 68) {
      const prodCx = arrEnd + 11;
      ctx.strokeStyle = '#1d4ed8';
      ctx.lineWidth = 1.1;
      ctx.beginPath();
      for (let k = 0; k < 6; k++) {
        const a = k * (Math.PI / 3) - Math.PI / 6;
        const hx = prodCx + Math.cos(a) * 4.8;
        const hy = midY + Math.sin(a) * 4.8;
        if (k === 0) ctx.moveTo(hx, hy);
        else ctx.lineTo(hx, hy);
      }
      ctx.closePath();
      ctx.stroke();
      // Substituent branch + green yield check
      ctx.strokeStyle = '#059669';
      ctx.beginPath();
      ctx.moveTo(prodCx + 4.5, midY - 2);
      ctx.lineTo(prodCx + 9, midY - 5);
      ctx.stroke();
      if (prodCx + 15 < bx + bw - 4) {
        ctx.fillStyle = '#059669';
        ctx.fillRect(prodCx + 12, midY - 3, Math.min(12, bx + bw - prodCx - 16), 1.5);
        ctx.fillStyle = '#64748b';
        ctx.fillRect(prodCx + 12, midY + 1, Math.min(9, bx + bw - prodCx - 16), 1.3);
      }
    } else {
      // Compact 1-tile product sketch
      ctx.strokeStyle = '#1d4ed8';
      ctx.lineWidth = 1.1;
      ctx.beginPath();
      ctx.moveTo(arrEnd + 3, midY - 2);
      ctx.lineTo(arrEnd + 7, midY + 2);
      ctx.lineTo(arrEnd + 10, midY - 3);
      ctx.stroke();
    }
    ctx.restore();

    // Protruding aluminium marker tray + dry-erase pens (red, blue, black) + felt eraser!
    const trayY = by + bh;
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(bx + 3, trayY, bw - 6, 3.2);
    ctx.fillStyle = '#475569';
    ctx.fillRect(bx + 3, trayY + 2.4, bw - 6, 1);
    // Markers
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(bx + 6, trayY - 1.3, 6, 1.8);
    ctx.fillStyle = '#2563eb';
    ctx.fillRect(bx + 14, trayY - 1.3, 6, 1.8);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(bx + 22, trayY - 1.3, 6, 1.8);
    // Charcoal felt eraser on right
    if (bw >= 36) {
      ctx.fillStyle = '#334155';
      ctx.fillRect(bx + bw - 13, trayY - 2.2, 7, 2.8);
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(bx + bw - 13, trayY - 2.2, 7, 1);
    }
  }

  // 38. BOOKSHELF (Warm Wooden Academic Case Packed with Colourful Chemistry Spines — Clayden!)
  function drawBookshelf(ctx, obj) {
    const px = obj.x * TILE_W;
    const py = obj.y * TILE_H;
    const pw = obj.w * TILE_W;
    const ph = obj.h * TILE_H;
    const rise = 30;

    // Warm oak / walnut bookcase body
    draw3DBox(ctx, px + 2, py, pw - 4, ph, rise, '#b9834b', '#78350f', '#451a03', '#e7b98a');

    const topY = py - rise;
    const frontTopY = py + ph - rise;
    const innerX = px + 5;
    const innerW = pw - 10;

    // Subtle decorative chemistry reference stack & bookend resting on top roof surface
    ctx.fillStyle = '#15803d'; // Clayden green flat volume on top
    ctx.fillRect(px + 8, topY + 6, Math.min(18, pw - 16), 9);
    ctx.fillStyle = '#fefce8';
    ctx.fillRect(px + 9, topY + 7, Math.min(16, pw - 18), 2);
    if (pw >= 48) {
      ctx.fillStyle = '#1d4ed8';
      ctx.fillRect(px + pw - 22, topY + 5, 13, 8);
    }

    // 3 Recessed horizontal book shelves packed with Clayden green/blue/red volumes & theses
    const spinePalette = [
      '#16a34a', // Clayden emerald green
      '#2563eb', // Clayden / Organic Chem royal blue
      '#dc2626', // Crimson JACS / reference red
      '#15803d', // Deep green volume
      '#d97706', // Amber handbook
      '#1e40af', // Navy thesis binder
      '#0d9488', // Teal bioconjugation text
      '#b91c1c', // Burgundy organic synth
      '#fef3c7', // Cream bound volume
      '#4f46e5'  // Indigo spectroscopy guide
    ];

    const shelfCount = 3;
    const shelfSlotH = 8;
    for (let s = 0; s < shelfCount; s++) {
      const sy = frontTopY + 2 + s * 9;
      // Dark interior shelf recess
      ctx.fillStyle = '#3b1806';
      ctx.fillRect(innerX, sy, innerW, shelfSlotH);

      // Pack colourful books across the shelf width
      let bx = innerX + 1;
      let idx = 0;
      while (bx < innerX + innerW - 3) {
        const roll = hash2D(obj.x * 7 + idx, obj.y * 5 + s, 521);
        const bw = roll > 0.72 ? 5 : (roll > 0.35 ? 4 : 3);
        if (bx + bw > innerX + innerW - 1) break;
        // Occasional narrow gap for realism
        if (roll < 0.08 && idx > 1) {
          bx += 3;
          idx++;
          continue;
        }
        const bh = shelfSlotH - (roll > 0.6 ? 0.8 : 1.8);
        const col = spinePalette[Math.floor(hash2D(obj.x + idx * 3, obj.y + s * 11, 613) * spinePalette.length)];
        ctx.fillStyle = col;
        ctx.fillRect(bx, sy + (shelfSlotH - bh), bw - 0.5, bh);
        // Tiny gold/white spine label band
        ctx.fillStyle = (idx % 3 === 0) ? '#fde047' : 'rgba(248, 250, 252, 0.75)';
        ctx.fillRect(bx + 0.5, sy + (shelfSlotH - bh) + 1.8, Math.max(1.5, bw - 1.5), 1.1);
        bx += bw;
        idx++;
      }

      // Warm oak shelf lip edge beneath books
      ctx.fillStyle = '#a16207';
      ctx.fillRect(innerX - 1, sy + shelfSlotH, innerW + 2, 1.5);
    }
  }

  // 39. THESIS PRINTER (Compact Grey/Navy Departmental Laser Printer + Paper Tray + Blinking Green LED!)
  function drawThesisPrinter(ctx, obj, nowSec, zOffset) {
    const px = obj.x * TILE_W;
    const py = obj.y * TILE_H;
    const pw = obj.w * TILE_W;
    const ph = obj.h * TILE_H;
    const tSec = nowSec || 0;
    const onDesk = Boolean(zOffset);

    if (!onDesk) {
      // Compact grey rolling departmental printer stand with spare A4 ream shelf underneath
      draw3DBox(ctx, px + 6, py + 6, pw - 12, ph - 8, 10, '#94a3b8', '#64748b', '#1e293b');
      // Spare white A4 thesis paper ream inside lower stand bay
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(px + 9, py + ph - 8, pw - 18, 6);
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(px + 11, py + ph - 6.5, pw - 22, 4);
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(px + 13, py + ph - 5.5, 6, 2);
    }

    // Printer main body (elevated slightly when on floor stand)
    const bodyBaseY = onDesk ? (py + 8) : (py - 2);
    const bodyH = Math.max(20, ph - 14);
    const bodyRise = 13;
    const bodyX = px + 6;
    const bodyW = pw - 12;

    draw3DBox(ctx, bodyX, bodyBaseY, bodyW, bodyH, bodyRise, '#e2e8f0', '#cbd5e1', '#1e293b', '#ffffff');

    const topY = bodyBaseY - bodyRise;
    const frontTopY = bodyBaseY + bodyH - bodyRise;

    // Dark navy top scanner lid / ADF feeder bar
    ctx.fillStyle = '#1e3a8a';
    ctx.fillRect(bodyX + 3, topY + 2, bodyW - 6, 5);
    ctx.fillStyle = '#334155';
    ctx.fillRect(bodyX + 5, topY + 9, bodyW - 14, 7);

    // Output catch tray with freshly printed white thesis page protruding!
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(bodyX + 8, topY + 11, Math.max(12, bodyW - 22), 9);
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 0.7;
    ctx.strokeRect(bodyX + 8, topY + 11, Math.max(12, bodyW - 22), 9);
    // Tiny printed thesis lines on page
    ctx.fillStyle = '#475569';
    ctx.fillRect(bodyX + 10, topY + 13, Math.max(6, bodyW - 28), 1);
    ctx.fillRect(bodyX + 10, topY + 15.5, Math.max(8, bodyW - 26), 1);
    ctx.fillRect(bodyX + 10, topY + 18, Math.max(5, bodyW - 30), 1);

    // Front navy trim bezel + status control panel with blinking green Ready LED!
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(bodyX + 2, frontTopY + 1, bodyW - 4, 4);
    // Tiny monochrome LCD readout on left of bezel
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(bodyX + 5, frontTopY + 2, 8, 2);
    // Blinking green status LED on right of bezel
    const ledOn = Math.floor(tSec * 2.2) % 2 === 0;
    ctx.save();
    if (ledOn) {
      ctx.shadowColor = '#4ade80';
      ctx.shadowBlur = 5;
    }
    ctx.fillStyle = ledOn ? '#4ade80' : '#166534';
    ctx.beginPath();
    ctx.arc(bodyX + bodyW - 6, frontTopY + 3, 1.6, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Lower pull-out A4 paper cassette tray
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(bodyX + 4, frontTopY + 6, bodyW - 8, 6);
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(bodyX + 7, frontTopY + 7.5, bodyW - 14, 2);
    ctx.fillStyle = '#334155';
    ctx.fillRect(bodyX + bodyW * 0.5 - 4, frontTopY + 10, 8, 1.5);
  }

  // 40. LOCKER (Tall Slate Steel Departmental Lockers with Vent Slats & Label Plates!)
  function drawLocker(ctx, obj) {
    const px = obj.x * TILE_W;
    const py = obj.y * TILE_H;
    const pw = obj.w * TILE_W;
    const ph = obj.h * TILE_H;
    const rise = 32;
    const grp = GROUP_PALETTE[obj.group] || GROUP_PALETTE.none;

    // Tall industrial slate steel locker bank
    draw3DBox(ctx, px + 2, py, pw - 4, ph, rise, '#64748b', '#475569', '#0f172a', '#94a3b8');

    // Optional group accent bar along top edge
    if (obj.group && obj.group !== 'none') {
      ctx.fillStyle = grp.main;
      ctx.fillRect(px + 3, py - rise + 2, pw - 6, 3.5);
    }

    const frontTopY = py + ph - rise;
    const innerX = px + 4;
    const innerW = pw - 8;
    const numDoors = Math.max(2, obj.w * 2);
    const doorW = innerW / numDoors;

    // Dark recessed steel toe-kick plinth
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(px + 3, py + ph - 3, pw - 6, 3);

    for (let d = 0; d < numDoors; d++) {
      const dx = innerX + d * doorW;
      const dw = doorW - 1.5;
      const dy = frontTopY + 2;
      const dh = rise - 6;

      // Inset steel locker door panel
      ctx.fillStyle = (d % 2 === 0) ? '#526074' : '#475569';
      ctx.fillRect(dx + 0.8, dy, dw, dh);
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 0.9;
      ctx.strokeRect(dx + 0.8, dy, dw, dh);

      // Upper ventilation louver slats (3 crisp dark slots)
      ctx.fillStyle = '#1e293b';
      for (let v = 0; v < 3; v++) {
        ctx.fillRect(dx + 3.5, dy + 2.5 + v * 2.2, Math.max(4, dw - 6), 1.1);
      }

      // White/brass metallic departmental label plate below vents
      const plateW = Math.min(10, Math.max(5, dw - 6));
      const plateX = dx + 0.8 + (dw - plateW) * 0.5;
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(plateX, dy + 10, plateW, 3.5);
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 0.6;
      ctx.strokeRect(plateX, dy + 10, plateW, 3.5);
      ctx.fillStyle = '#334155';
      ctx.fillRect(plateX + 1.5, dy + 11.4, Math.max(2, plateW - 3), 0.9);

      // Recessed latch handle & key cylinder on right side of door
      ctx.fillStyle = '#cbd5e1';
      ctx.fillRect(dx + dw - 3.6, dy + 15, 2.2, 4.5);
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(dx + dw - 3.0, dy + 16, 1.0, 1.2);

      // Lower ventilation slats near bottom of door
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(dx + 3.5, dy + dh - 4.5, Math.max(4, dw - 6), 1.0);
      ctx.fillRect(dx + 3.5, dy + dh - 2.5, Math.max(4, dw - 6), 1.0);
    }
  }

  function drawCustomBlock(ctx, obj) {
    const px = obj.x * TILE_W;
    const py = obj.y * TILE_H;
    const pw = obj.w * TILE_W;
    const ph = obj.h * TILE_H;
    draw3DBox(ctx, px + 3, py + 2, pw - 6, ph - 4, 18, '#94a3b8', '#64748b', '#1e293b');
    if (obj.label) {
      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 8.5px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(String(obj.label).slice(0, 14), px + pw * 0.5, py + ph * 0.5 - 9);
    }
  }

  function getFixtureVisualBounds(room, obj) {
    const px = obj.x * TILE_W;
    const py = obj.y * TILE_H;
    const pw = obj.w * TILE_W;
    const ph = obj.h * TILE_H;
    const rise = FIXTURE_RISE[obj.type] || 18;

    if (obj.type === 'projector') {
      return { x: px + 4, y: py - 3, w: pw - 8, h: 41, r: 4 };
    }
    if (obj.type === 'whiteboard' && room && isWallLike(getTileSafe(room, obj.x, obj.y))) {
      return { x: px + 2, y: py + 3, w: pw - 4, h: 33, r: 3 };
    }
    if (obj.type === 'nmr_magnet') {
      return { x: px + 4, y: py - 18, w: pw - 4, h: ph + 8, r: 10 };
    }
    if (obj.type === 'argon_cyl') {
      return { x: px + 10, y: py - 14, w: 32, h: TILE_H + 10, r: 6 };
    }
    if (obj.type === 'chair') {
      return { x: px + 11, y: py + 4, w: 26, h: TILE_H - 6, r: 6 };
    }
    if (obj.type === 'specs_holder') {
      return { x: px + 9, y: py - 20, w: 30, h: 42, r: 4 };
    }
    if (obj.type === 'fire_ext') {
      return { x: px + 10, y: py + 6, w: 22, h: TILE_H - 10, r: 6 };
    }
    if (obj.type === 'base_bath') {
      return { x: px + 5, y: py - 4, w: pw - 10, h: ph - 2, r: 4 };
    }
    if (obj.type === 'syringe_pump') {
      return { x: px + 6, y: py + 1, w: pw - 11, h: ph - 5, r: 4 };
    }
    if (obj.type === 'fumehood' && obj.w > obj.h && room &&
        isWallLike(getTileSafe(room, obj.x, obj.y + obj.h)) &&
        isWalkableTile(getTileSafe(room, obj.x, obj.y - 1))) {
      return { x: px + 1, y: py - 18, w: pw - 2, h: ph + 12, r: 4 };
    }
    return { x: px + 1, y: py - rise + 1, w: pw - 2, h: ph + rise - 2, r: 4 };
  }

  function drawFixtureOutlineRim(ctx, room, obj, isHighlighted, isHovered, nowSec) {
    if (!isHighlighted && !isHovered) return;
    const b = getFixtureVisualBounds(room, obj);
    ctx.save();
    if (isHighlighted) {
      const pulse = 0.58 + 0.34 * Math.sin(nowSec * 6);
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 12;
      ctx.strokeStyle = 'rgba(56, 189, 248, ' + pulse.toFixed(2) + ')';
      ctx.lineWidth = 2.4;
    } else {
      ctx.shadowColor = 'rgba(224, 242, 254, 0.5)';
      ctx.shadowBlur = 7;
      ctx.strokeStyle = 'rgba(248, 250, 252, 0.78)';
      ctx.lineWidth = 1.75;
    }
    roundRectPath(ctx, b.x, b.y, b.w, b.h, b.r);
    ctx.stroke();
    ctx.restore();
  }

  function drawChildFixtureHighlightIfNeeded(ctx, childObj, deckZ, nowSec, renderState) {
    if (!renderState || !childObj || childObj.type === 'npc_marker') return;
    const isHighlighted = renderState.highlightedObjId === childObj.id ||
      (renderState.highlightedObj && renderState.highlightedObj.id === childObj.id);
    const isHovered = !isHighlighted && (
      renderState.hoveredObjId === childObj.id ||
      renderState._activeHoverObjId === childObj.id
    );
    if (!isHighlighted && !isHovered) return;
    ctx.save();
    ctx.translate(0, -deckZ);
    drawFixtureOutlineRim(ctx, null, childObj, isHighlighted, isHovered, nowSec);
    ctx.restore();
  }

  // Master Fixture Dispatcher (supports zOffset for items stacked on benches/hoods!)
  function renderFixture(ctx, room, obj, stackedChildren, zOffset, nowSec, renderState, dt, chairPart, skipHighlight) {
    if (!obj || obj.type === 'npc_marker') return;
    const state = renderState || {};
    const rxn = findActiveReactionForObj(obj, state.activeStationJobs, room.id) ||
                findActiveReactionForObj(obj, state.activeReactions, room.id);
    const npcRxn = findNpcReactionForObj(obj, state.npcReactions, room.id);
    const activeJob = getActiveJobForObj(state, room.id, obj) || rxn || npcRxn;
    const isHighlighted = !skipHighlight && (
      state.highlightedObjId === obj.id ||
      (state.highlightedObj && state.highlightedObj.id === obj.id)
    );
    const isHovered = !skipHighlight && !isHighlighted && (
      state.hoveredObjId === obj.id ||
      state._activeHoverObjId === obj.id
    );

    ctx.save();
    if (zOffset) ctx.translate(0, -zOffset);

    const px = obj.x * TILE_W;
    const py = obj.y * TILE_H;
    const pw = obj.w * TILE_W;
    const ph = obj.h * TILE_H;

    switch (obj.type) {
      case 'fumehood':
        drawFumeHood(ctx, room, obj, stackedChildren, rxn, npcRxn, nowSec, function (c, rm, ch, sc, zo, ns, childSkip) {
          renderFixture(c, rm, ch, sc, zo, ns, state, dt, null, childSkip);
        }, state, dt);
        break;
      case 'lab_bench':
        drawLabBench(ctx, room, obj, stackedChildren, rxn, npcRxn, nowSec);
        break;
      case 'sink':
        drawSink(ctx, px, py, pw, ph);
        break;
      case 'chem_cupboard':
        drawChemCupboard(ctx, room, obj);
        break;
      case 'fridge_4c':
        drawFridgeOrFreezer(ctx, obj, false);
        break;
      case 'freezer_20c':
        drawFridgeOrFreezer(ctx, obj, true);
        break;
      case 'buchi':
        drawBuchi(ctx, obj, activeJob, nowSec);
        break;
      case 'biotage':
        drawBiotage(ctx, obj, activeJob, nowSec);
        break;
      case 'tlc_station':
        drawTlcStation(ctx, px, py, pw, ph, nowSec);
        break;
      case 'drying_oven':
        drawDryingOven(ctx, px, py, pw, ph);
        break;
      case 'base_bath':
        drawBaseBath(ctx, px, py, pw, ph);
        break;
      case 'syringe_pump':
        drawSyringePump(ctx, px, py, pw, ph, nowSec);
        break;
      case 'argon_cyl':
        drawArgonCyl(ctx, obj, nowSec);
        break;
      case 'balance_table':
        drawBalanceTable(ctx, obj);
        break;
      case 'tcep_bench':
        drawTcepBench(ctx, px, py, pw, ph);
        break;
      case 'gel_tank':
        drawGelTank(ctx, px, py, pw, ph, activeJob, nowSec);
        break;
      case 'centrifuge':
        drawCentrifuge(ctx, px, py, pw, ph, activeJob, nowSec);
        break;
      case 'heatblock':
        drawHeatblock(ctx, px, py, pw, ph, activeJob, nowSec);
        break;
      case 'lab_speakers':
        drawLabSpeakers(ctx, px, py, pw, ph, Boolean(state.lotrPlaying), nowSec);
        break;
      case 'writeup_desk':
        drawWriteupDesk(ctx, room, obj, stackedChildren, npcRxn, nowSec, activeJob);
        break;
      case 'pc_terminal': {
        const pcRoomJob = activeJob || getRoomInstrumentJobForPc(state, room, obj);
        const pcViewing = isHighlighted || isHovered || isPersonNearObj(obj, state, room) ||
          Boolean(state.viewingPcObjId === obj.id || state.activeSpectrumObjId === obj.id);
        const pcMicroTag = room.id === 'cib_lg1b_nmr'
          ? 'TOPSPIN'
          : (room.id === 'cib_lg11_ms' ? 'LC-MS PC' : '');
        drawPcTerminal(ctx, px, py, pw, ph, pcRoomJob, nowSec, obj, pcViewing, pcMicroTag);
        break;
      }
      case 'spiral_stairs':
        drawSpiralStairs(ctx, obj);
        break;
      case 'lift':
        drawLift(ctx, obj);
        break;
      case 'specs_holder':
        drawSpecsHolder(ctx, obj);
        break;
      case 'fire_ext':
        drawFireExt(ctx, obj);
        break;
      case 'black_tub_key':
        drawBlackTubKey(ctx, px, py, pw, ph);
        break;
      case 'waste_bin':
        drawWasteBin(ctx, obj);
        break;
      case 'tea_drawer':
        drawTeaDrawer(ctx, obj, nowSec);
        break;
      case 'lcms_unit':
        drawLcmsUnit(ctx, obj, nowSec, activeJob);
        break;
      case 'maldi_unit':
        drawMaldiUnit(ctx, obj, nowSec, activeJob);
        break;
      case 'nmr_magnet':
        drawNmrMagnet(ctx, obj, nowSec, activeJob);
        break;
      case 'cafe_counter':
        drawCafeCounter(ctx, obj, nowSec);
        break;
      case 'cafe_table':
        drawCafeTable(ctx, obj, nowSec);
        break;
      case 'meeting_table':
        drawMeetingTable(ctx, obj);
        break;
      case 'chair':
        drawChair(ctx, obj, chairPart);
        break;
      case 'projector':
        drawProjector(ctx, obj, nowSec);
        break;
      case 'whiteboard':
        drawWhiteboard(ctx, room, obj);
        break;
      case 'bookshelf':
        drawBookshelf(ctx, obj);
        break;
      case 'thesis_printer':
        drawThesisPrinter(ctx, obj, nowSec, zOffset);
        break;
      case 'locker':
        drawLocker(ctx, obj);
        break;
      case 'toilet':
        drawToilet(ctx, obj);
        break;
      default:
        drawCustomBlock(ctx, obj);
        break;
    }

    // Draw highlight / hover outline AFTER fixture geometry so it is never painted over!
    drawFixtureOutlineRim(ctx, room, obj, isHighlighted, isHovered, nowSec);

    ctx.restore();
  }

  // ============================================================================
  // CHARACTER SPRITE RENDERING (256x384 SHEET, SHADOWS, SEATING, BREATHING & PROPS!)
  // ============================================================================
  function drawFallbackCharacter(ctx, anchorX, anchorY, castInfo, isPlayer, dirCode, seatDrop, breathY) {
    const accent = (castInfo && castInfo.waColor) ? castInfo.waColor : (isPlayer ? '#3b82f6' : '#64748b');
    const sd = seatDrop || 0;
    const by = breathY || 0;

    // Trousers / shoes
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(anchorX - 7, anchorY - 14 + (sd ? 3 : 0), 6, sd ? 10 : 13);
    ctx.fillRect(anchorX + 1, anchorY - 14 + (sd ? 3 : 0), 6, sd ? 10 : 13);

    // Crisp white UCL lab coat torso + group collar accent
    fillRoundRect(ctx, anchorX - 10, anchorY - 38 + sd + by, 20, 26, 4, '#f8fafc', '#0f172a', 1.5);
    ctx.fillStyle = accent;
    ctx.fillRect(anchorX - 3, anchorY - 37 + sd + by, 6, 16);

    // Head + hair
    fillRoundRect(ctx, anchorX - 9, anchorY - 56 + sd + by, 18, 18, 5, '#fed7aa', '#0f172a', 1.4);
    ctx.fillStyle = '#292524';
    ctx.fillRect(anchorX - 9, anchorY - 57 + sd + by, 18, dirCode === 'N' ? 14 : 6);
    if (dirCode !== 'N') {
      ctx.fillStyle = '#0f172a';
      if (dirCode !== 'W') ctx.fillRect(anchorX + 2, anchorY - 47 + sd + by, 2, 2.5);
      if (dirCode !== 'E') ctx.fillRect(anchorX - 4, anchorY - 47 + sd + by, 2, 2.5);
    }
  }

  function detectSeatedAndContext(entity, room, ex, ey, dirCode, animMoving) {
    if (animMoving || !room || !Array.isArray(room.objects)) {
      return { seated: false, needsStool: false, nearType: null };
    }
    let onChair = false;
    let nearSeatSurface = false;
    let nearType = null;
    let bestDist = 1.65;

    for (let i = 0; i < room.objects.length; i++) {
      const o = room.objects[i];
      if (o.type === 'npc_marker') continue;
      if (o.type === 'chair') {
        const dChair = Math.hypot((o.x + 0.5) - (ex + 0.5), (o.y + 0.5) - (ey + 0.5));
        if (dChair <= 0.55) onChair = true;
      }
      const dx = Math.max(0, o.x - ex, ex - (o.x + o.w - 1));
      const dy = Math.max(0, o.y - ey, ey - (o.y + o.h - 1));
      const edgeDist = Math.hypot(dx, dy);
      if (edgeDist <= 1.05 && (o.type === 'writeup_desk' || o.type === 'cafe_table')) {
        const cx = o.x + o.w * 0.5;
        const cy = o.y + o.h * 0.5;
        const wantDir = dirFromDelta(cx - (ex + 0.5), cy - (ey + 0.5), dirCode);
        if (wantDir === dirCode || entity.busyObjId === o.id || o.type === 'cafe_table' ||
            (o.type === 'writeup_desk' && (room.id === 'cib_lg11_ms' || room.id === 'cib_lg1b_nmr' || room.id === 'klb_3f'))) {
          nearSeatSurface = true;
        }
      }
      if (edgeDist < bestDist && o.type !== 'lab_bench' && o.type !== 'chair' && o.type !== 'exit_stairs') {
        bestDist = edgeDist;
        nearType = o.type;
      }
    }

    if (onChair) return { seated: true, needsStool: false, nearType: nearType || 'meeting_table' };
    if (nearSeatSurface) return { seated: true, needsStool: true, nearType };
    return { seated: false, needsStool: false, nearType };
  }

  function normalizeCarriedPropKind(rawProp) {
    if (!rawProp) return null;
    const p = String(rawProp).toLowerCase().trim();
    if (!p) return null;
    if (p.includes('nmr')) return 'nmr_tube';
    if (p.includes('vial') || p.includes('lcms') || p.includes('lc_ms') || p.includes('maldi') || p.includes('ms_')) return 'lcms_vial';
    if (p.includes('coffee') || p.includes('espresso') || p.includes('latte') || p.includes('flat_white') || p === 'cup') return 'coffee';
    if (p.includes('tea') || p.includes('mug')) return 'tea';
    if (p.includes('clipboard') || p.includes('checklist')) return 'clipboard';
    if (p.includes('pipette') || p.includes('gilson')) return 'pipette';
    if (p.includes('flask') || p.includes('rbf') || p.includes('sample') || p.includes('product')) return 'flask';
    return null;
  }

  function resolveCarriedProp(entity, isPlayer, room, renderState) {
    if (isPlayer) {
      return normalizeCarriedPropKind((entity && entity.carryingProp) || (renderState && renderState.carryingProp));
    }
    const explicit = normalizeCarriedPropKind(entity && entity.carryingProp);
    if (explicit) return explicit;
    if (room && room.id === 'cib_lg1b_nmr') return 'nmr_tube';
    if (room && room.id === 'cib_lg11_ms') return 'lcms_vial';
    if (room && room.id === 'gordons_cafe') return 'coffee';
    return null;
  }

  function drawContextualHandProp(ctx, anchorX, anchorY, dirCode, seatDrop, breathY, charId, room, nearType, nowSec, carriedProp, strideOffX, strideBobY, isMoving) {
    if (dirCode === 'N') return;
    const bobY = strideBobY || 0;
    const swingX = strideOffX || 0;
    const hx = (dirCode === 'W' ? (anchorX - 9) : (dirCode === 'E' ? (anchorX + 9) : (anchorX + 10))) + swingX;
    const hy = anchorY - 22 + seatDrop + breathY + bobY;

    let propKind = carriedProp || null;
    if (!propKind && !isMoving) {
      const isCafe = room && room.id === 'gordons_cafe';
      const isTea = (charId === 'richard_spears' && room && room.id === 'klb_3f') || nearType === 'tea_drawer';
      const isClipboard = charId === 'safety_inspector' || charId === 'claire_carmalt';
      const isPipette = nearType === 'tcep_bench' || nearType === 'gel_tank' || nearType === 'centrifuge' || nearType === 'heatblock';
      const isFlask = nearType === 'fumehood' || nearType === 'buchi' || nearType === 'biotage' || nearType === 'sink' || nearType === 'base_bath';
      if (isCafe) propKind = 'coffee';
      else if (isTea) propKind = 'tea';
      else if (isClipboard) propKind = 'clipboard';
      else if (nearType === 'nmr_magnet') propKind = 'nmr_tube';
      else if (nearType === 'lcms_unit' || nearType === 'maldi_unit') propKind = 'lcms_vial';
      else if (isPipette) propKind = 'pipette';
      else if (isFlask) propKind = 'flask';
    }
    if (!propKind) return;

    ctx.save();
    if (propKind === 'coffee' || propKind === 'tea') {
      // Porcelain flat-white coffee cup or ceramic tea mug + tiny steam wisp
      const isCoffee = propKind === 'coffee';
      ctx.fillStyle = isCoffee ? '#f8fafc' : '#fef3c7';
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 0.8;
      ctx.fillRect(hx - 2.5, hy - 3, 5, 5);
      ctx.strokeRect(hx - 2.5, hy - 3, 5, 5);
      // Tiny cup handle on outer side
      ctx.strokeStyle = isCoffee ? '#e2e8f0' : '#fde68a';
      ctx.lineWidth = 0.9;
      ctx.beginPath();
      ctx.arc(hx + (dirCode === 'W' ? -2.8 : 2.8), hy - 0.5, 1.4, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = '#78350f';
      ctx.fillRect(hx - 1.5, hy - 2.5, 3, 1.2);
      const sp = (nowSec * 0.95 + anchorX * 0.03) % 1;
      ctx.fillStyle = 'rgba(255, 255, 255, ' + ((1 - sp) * 0.55).toFixed(2) + ')';
      ctx.beginPath();
      ctx.arc(hx + Math.sin(nowSec * 3) * 1.2, hy - 5 - sp * 6, 1.1 + sp * 0.9, 0, Math.PI * 2);
      ctx.fill();
    } else if (propKind === 'nmr_tube') {
      // Tiny slender 5mm borosilicate glass NMR tube with yellow/blue cap
      const tilt = dirCode === 'W' ? -0.18 : 0.18;
      ctx.translate(hx, hy - 1);
      ctx.rotate(tilt);
      ctx.fillStyle = 'rgba(224, 242, 254, 0.92)';
      ctx.fillRect(-1.3, -6.5, 2.6, 10.5);
      // Pale deuterated solvent fill at bottom of tube
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(-0.9, -0.5, 1.8, 4.0);
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 0.65;
      ctx.strokeRect(-1.3, -6.5, 2.6, 10.5);
      // Iconic yellow or blue NMR cap
      const useBlueCap = charId && (charId.charCodeAt(0) % 2 === 1);
      ctx.fillStyle = useBlueCap ? '#2563eb' : '#facc15';
      ctx.fillRect(-1.8, -8.5, 3.6, 2.4);
      ctx.fillStyle = useBlueCap ? '#93c5fd' : '#ca8a04';
      ctx.fillRect(-1.8, -6.5, 3.6, 0.8);
    } else if (propKind === 'lcms_vial') {
      // Tiny 2 mL amber LC-MS autosampler vial with white label patch & blue septum cap
      ctx.fillStyle = '#b45309';
      ctx.strokeStyle = '#451a03';
      ctx.lineWidth = 0.7;
      ctx.fillRect(hx - 2.2, hy - 2.5, 4.4, 6.2);
      ctx.strokeRect(hx - 2.2, hy - 2.5, 4.4, 6.2);
      ctx.fillStyle = '#fef3c7';
      ctx.fillRect(hx - 1.5, hy - 0.5, 3.0, 2.6);
      ctx.fillStyle = '#0284c7';
      ctx.fillRect(hx - 1.8, hy - 4.4, 3.6, 2.0);
      ctx.fillStyle = '#bae6fd';
      ctx.fillRect(hx - 1.0, hy - 4.2, 2.0, 0.8);
    } else if (propKind === 'clipboard') {
      // Clipboard + white checklist
      ctx.fillStyle = '#92400e';
      ctx.fillRect(hx - 3, hy - 5, 6, 8);
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(hx - 2, hy - 3.5, 4, 5.5);
      ctx.fillStyle = '#eab308';
      ctx.fillRect(hx - 1.5, hy - 5.5, 3, 1.5);
    } else if (propKind === 'pipette') {
      // Sleek blue Gilson Pipetman + yellow tip
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(hx, hy - 6);
      ctx.lineTo(hx + (dirCode === 'W' ? -2 : 2), hy + 2);
      ctx.stroke();
      ctx.fillStyle = '#2563eb';
      ctx.fillRect(hx - 1.2, hy - 7.5, 2.5, 2.5);
      ctx.fillStyle = '#facc15';
      ctx.fillRect(hx + (dirCode === 'W' ? -2.6 : 1.3), hy + 1.5, 1.3, 2.5);
    } else if (propKind === 'flask') {
      // Mini Erlenmeyer/RBF flask with coloured solution
      ctx.fillStyle = 'rgba(224, 242, 254, 0.88)';
      ctx.beginPath();
      ctx.arc(hx, hy + 1, 3.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#14b8a6';
      ctx.beginPath();
      ctx.arc(hx, hy + 1.5, 2.4, 0.1, Math.PI - 0.1);
      ctx.fill();
      ctx.fillStyle = '#bae6fd';
      ctx.fillRect(hx - 1, hy - 4, 2, 3);
    }
    ctx.restore();
  }

  function drawCharacterEntity(ctx, entity, isPlayer, room, nowSec, renderState, entitiesById, entityMetaOut) {
    const charId = entity.charId || entity.spriteId || entity.id;
    const castById = (window.KLB && window.KLB.CAST_BY_ID) ? window.KLB.CAST_BY_ID : {};
    const castInfo = castById[charId] || null;
    const state = renderState || {};

    const ex = Number(entity.x) || 0;
    const ey = Number(entity.y) || 0;
    const anchorX = Math.round((ex + 0.5) * TILE_W);
    const anchorY = Math.round((ey + 0.86) * TILE_H);

    // 1. Soft elliptical ground shadow beneath EVERY character (PNG sprites + fallback)
    ctx.save();
    ctx.fillStyle = 'rgba(15, 23, 42, 0.26)';
    ctx.beginPath();
    ctx.ellipse(anchorX, anchorY - 1, 11.5, 4.6, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    const nid = entity.id || entity.charId || '';
    const isHighlightedNpc = !isPlayer && Boolean(
      (state.highlightedNpcId && nid && state.highlightedNpcId === nid) ||
      (state.highlightedNpc && state.highlightedNpc.id === nid)
    );
    const isHoveredNpc = !isPlayer && !isHighlightedNpc && Boolean(
      (state.hoveredNpcId && nid && state.hoveredNpcId === nid) ||
      (state._activeHoverNpcId && nid && state._activeHoverNpcId === nid)
    );

    // 2. Subtle glowing focus ring under Player, Highlighted NPC, or Hovered NPC!
    if (isPlayer) {
      const ringPulse = 0.48 + 0.18 * Math.sin(nowSec * 4.5);
      ctx.save();
      ctx.strokeStyle = 'rgba(56, 189, 248, ' + ringPulse.toFixed(2) + ')';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(anchorX, anchorY - 1, 13, 5.5, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    } else if (isHighlightedNpc) {
      const ringPulse = 0.62 + 0.28 * Math.sin(nowSec * 6);
      ctx.save();
      ctx.shadowColor = '#fbbf24';
      ctx.shadowBlur = 10;
      ctx.strokeStyle = 'rgba(251, 191, 36, ' + ringPulse.toFixed(2) + ')';
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.ellipse(anchorX, anchorY - 1, 13.5, 5.8, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.strokeStyle = 'rgba(56, 189, 248, ' + (ringPulse * 0.8).toFixed(2) + ')';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.ellipse(anchorX, anchorY - 1, 16, 6.8, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    } else if (isHoveredNpc) {
      ctx.save();
      ctx.strokeStyle = 'rgba(248, 250, 252, 0.78)';
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.ellipse(anchorX, anchorY - 1, 13, 5.5, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    const anim = resolveEntityAnim(entity, nowSec, isPlayer, room, entitiesById, state);
    const spriteEntry = ensureSprite(charId);
    const seatCtx = detectSeatedAndContext(entity, room, ex, ey, anim.dirCode, anim.isMoving);
    const seatDrop = seatCtx.seated ? 5 : 0;

    // Waist-split pixel-crisp breathing when idle (0 or -1px upper torso inhale)
    const idStr = String(charId || nid || 'c');
    const charPhase = hash2D(idStr.length, idStr.charCodeAt(0) || 1, 17) * Math.PI * 2;
    const breathY = !anim.isMoving ? (Math.sin(nowSec * 2.5 + charPhase) > 0.25 ? -1 : 0) : 0;

    // Optional tucked swivel stool / bistro stool when seated at desk or cafe table
    if (seatCtx.seated && seatCtx.needsStool) {
      const isCafeRoom = room && room.id === 'gordons_cafe';
      ctx.save();
      ctx.fillStyle = '#334155';
      ctx.fillRect(anchorX - 2, anchorY - 9, 4, 8);
      ctx.fillStyle = isCafeRoom ? '#92400e' : '#1e293b';
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.ellipse(anchorX, anchorY - 10, 9.5, 4.5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    }

    // Frame source: 64x96 in 256x384 sheet; drawn crisp at 52x78
    const drawW = 52;
    const drawH = 78;
    const drawX = Math.round(anchorX - drawW * 0.5);
    const drawY = Math.round(anchorY - drawH + 5);

    if (spriteEntry && spriteEntry.loaded && spriteEntry.img.naturalWidth >= 64) {
      ctx.save();
      ctx.imageSmoothingEnabled = false;
      if (seatCtx.seated) {
        // Seated posture: shortened legs + torso/head lowered by +5px
        ctx.drawImage(spriteEntry.img, anim.col * 64, anim.row * 96 + 66, 64, 24, drawX, drawY + 56, drawW, 19);
        ctx.drawImage(spriteEntry.img, anim.col * 64, anim.row * 96, 64, 66, drawX, drawY + seatDrop + breathY, drawW, 53.6);
      } else if (!anim.isMoving) {
        // Standing idle: waist-split 2-slice pixel-crisp breathing (feet planted rock-solid!)
        ctx.drawImage(spriteEntry.img, anim.col * 64, anim.row * 96 + 62, 64, 34, drawX, drawY + 50.375, drawW, 27.625);
        ctx.drawImage(spriteEntry.img, anim.col * 64, anim.row * 96, 64, 64, drawX, drawY + breathY, drawW, 52);
      } else {
        ctx.drawImage(spriteEntry.img, anim.col * 64, anim.row * 96, 64, 96, drawX, drawY, drawW, drawH);
      }
      ctx.restore();
    } else {
      drawFallbackCharacter(ctx, anchorX, anchorY, castInfo, isPlayer, anim.dirCode, seatDrop, breathY);
    }

    // Optional Safety-Specs Glint in Wet Lab (klb_2f) when character wears safety specs!
    const wearingSpecs = isPlayer
      ? Boolean(entity.specsOn || entity.wearingSpecs)
      : (room.id === 'klb_2f' && entity.specsOn !== false && entity.id !== 'alex_king');

    const stepBob = (anim.col === 1 || anim.col === 3) ? 1 : 0;
    const headOffY = seatDrop + breathY + stepBob;
    const eyeY = drawY + 23 + headOffY;
    const headTopY = drawY + 9 + headOffY;
    const stableHeadTopY = drawY + 9 + seatDrop;

    const labelText = (entity.showName !== false)
      ? stripBubbleEmojis(
          entity.shortName ||
          (castInfo && (castInfo.shortName || castInfo.name)) ||
          entity.name ||
          (nid
            ? (nid === 'player'
                ? 'Player'
                : nid.split('_')[0].replace(/^./, function (c) { return c.toUpperCase(); }))
            : (isPlayer ? 'Player' : ''))
        )
      : '';
    const metaRecord = {
      anchorX,
      anchorY,
      headTopY,
      stableHeadTopY,
      seated: seatCtx.seated,
      isPlayer: Boolean(isPlayer),
      label: labelText,
      accent: isPlayer
        ? '#38bdf8'
        : ((castInfo && castInfo.waColor) ? castInfo.waColor : '#94a3b8'),
      isHighlightedNpc,
      isHoveredNpc,
      showName: entity.showName !== false
    };

    if (entityMetaOut && nid) {
      entityMetaOut.set(nid, metaRecord);
    }
    if (entityMetaOut && isPlayer) {
      entityMetaOut.set('player', metaRecord);
    }

    if (wearingSpecs && anim.dirCode !== 'N') {
      ctx.save();
      ctx.fillStyle = 'rgba(56, 189, 248, 0.45)';
      ctx.strokeStyle = 'rgba(224, 242, 254, 0.9)';
      ctx.lineWidth = 1;
      if (anim.dirCode === 'S') {
        ctx.fillRect(anchorX - 8, eyeY - 2, 7, 4);
        ctx.fillRect(anchorX + 1, eyeY - 2, 7, 4);
        ctx.strokeRect(anchorX - 8, eyeY - 2, 7, 4);
        ctx.strokeRect(anchorX + 1, eyeY - 2, 7, 4);
      } else if (anim.dirCode === 'W') {
        ctx.fillRect(anchorX - 9, eyeY - 2, 6, 4);
        ctx.strokeRect(anchorX - 9, eyeY - 2, 6, 4);
      } else if (anim.dirCode === 'E') {
        ctx.fillRect(anchorX + 3, eyeY - 2, 6, 4);
        ctx.strokeRect(anchorX + 3, eyeY - 2, 6, 4);
      }
      ctx.restore();
    }

    // Optional Noise-Cancelling Headphones Band (foreshortened ellipse for side profiles W/E!)
    if (Boolean(entity.headphonesOn || entity.wearingHeadphones)) {
      ctx.save();
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 2.6;
      ctx.beginPath();
      if (anim.dirCode === 'S' || anim.dirCode === 'N') {
        ctx.arc(anchorX, headTopY + 10, 11, Math.PI * 1.05, Math.PI * 1.95);
      } else {
        ctx.ellipse(anchorX, headTopY + 10, 4.5, 10.5, 0, Math.PI * 1.05, Math.PI * 1.95);
      }
      ctx.stroke();
      ctx.fillStyle = '#38bdf8';
      if (anim.dirCode === 'S' || anim.dirCode === 'N') {
        fillRoundRect(ctx, anchorX - 13, headTopY + 9, 4, 8, 1.5, '#1e293b', '#38bdf8', 1);
        fillRoundRect(ctx, anchorX + 9, headTopY + 9, 4, 8, 1.5, '#1e293b', '#38bdf8', 1);
      } else {
        fillRoundRect(ctx, anchorX - 3, headTopY + 9, 6, 8, 2, '#1e293b', '#38bdf8', 1.2);
      }
      ctx.restore();
    }

    // Carried & contextual hand props (NMR tube, amber LC-MS vial, coffee cup, tea mug, clipboard, pipette, flask)
    // Carried props render even while walking (with subtle stride bob) whenever dirCode !== 'N'!
    const carriedProp = resolveCarriedProp(entity, isPlayer, room, state);
    if (carriedProp || !anim.isMoving) {
      const strideBobY = anim.isMoving ? ((anim.col === 1 || anim.col === 3) ? -1.4 : 0.5) : 0;
      const strideOffX = anim.isMoving ? (anim.col === 1 ? -1.2 : (anim.col === 3 ? 1.2 : 0)) : 0;
      drawContextualHandProp(
        ctx, anchorX, anchorY, anim.dirCode, seatDrop, breathY, charId, room,
        seatCtx.nearType, nowSec, carriedProp, strideOffX, strideBobY, anim.isMoving
      );
    }
  }

  function drawEntityLabel(ctx, meta, bounds, occupiedRectsOut) {
    if (!meta || meta.showName === false || !meta.label) return null;
    const label = meta.label;
    const anchorX = meta.anchorX;
    const anchorY = meta.anchorY;

    ctx.save();
    ctx.font = '700 9.5px "Segoe UI", system-ui, -apple-system, sans-serif';
    const tw = Math.ceil(ctx.measureText(label).width);
    const rawPw = Math.max(28, tw + 12);
    const pw = (rawPw % 2 === 0) ? rawPw : (rawPw + 1);
    const ph = 15;

    if (bounds) {
      if (anchorX + pw * 0.5 < bounds.visMinX || anchorX - pw * 0.5 > bounds.visMaxX ||
          anchorY < bounds.visMinY - 4 || anchorY > bounds.visMaxY + 12) {
        ctx.restore();
        return null;
      }
    }

    let px = Math.round(anchorX - pw * 0.5);
    let py = Math.round(anchorY + 4);
    let minPx = -Infinity;
    let maxPx = Infinity;
    let minPy = -Infinity;
    let maxPy = Infinity;
    if (bounds) {
      const pad = bounds.edgePad || 4;
      minPx = bounds.visMinX + pad;
      maxPx = Math.max(minPx, bounds.visMaxX - pad - pw);
      minPy = bounds.visMinY + pad;
      maxPy = Math.max(minPy, bounds.visMaxY - pad - ph);
      px = Math.round(clamp(px, minPx, maxPx));
      py = Math.round(clamp(py, minPy, maxPy));
    }

    if (occupiedRectsOut && occupiedRectsOut.length) {
      const origPx = px;
      const origPy = py;
      const hasOverlap = function (cx, cy) {
        for (let i = 0; i < occupiedRectsOut.length; i++) {
          const r = occupiedRectsOut[i];
          if (rectsOverlapPad(cx, cy, pw, ph, r.bx, r.by, r.bw, r.bh, 2)) return true;
        }
        return false;
      };
      if (hasOverlap(px, py)) {
        const dyCandidates = [12, 17, -12, -17, 29, 34, -29, -34, 46, 51];
        let resolved = false;
        for (let k = 0; k < dyCandidates.length; k++) {
          const candY = Math.round(clamp(origPy + dyCandidates[k], minPy, maxPy));
          if (!hasOverlap(origPx, candY)) {
            py = candY;
            resolved = true;
            break;
          }
        }
        if (!resolved) {
          const dxCandidates = [Math.round(pw * 0.65), -Math.round(pw * 0.65)];
          for (let k = 0; k < dxCandidates.length; k++) {
            const candX = Math.round(clamp(origPx + dxCandidates[k], minPx, maxPx));
            if (!hasOverlap(candX, origPy)) {
              px = candX;
              resolved = true;
              break;
            }
          }
        }
      }
    }

    const bgCol = meta.isPlayer ? 'rgba(15, 23, 42, 0.94)' : 'rgba(15, 23, 42, 0.92)';
    const borderCol = meta.isPlayer
      ? '#38bdf8'
      : (meta.isHighlightedNpc ? '#fbbf24' : (meta.accent || 'rgba(148, 163, 184, 0.65)'));
    const lineW = (meta.isPlayer || meta.isHighlightedNpc) ? 1.25 : 1.1;

    ctx.shadowColor = 'rgba(2, 6, 23, 0.5)';
    ctx.shadowBlur = 4;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 1;
    fillRoundRect(ctx, px, py, pw, ph, 4.5, bgCol, borderCol, lineW);

    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;

    ctx.fillStyle = '#f8fafc';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(label, px + pw * 0.5, py + ph * 0.5 + 0.5);
    ctx.restore();

    const rect = { bx: px, by: py, bw: pw, bh: ph };
    if (occupiedRectsOut) occupiedRectsOut.push(rect);
    return rect;
  }

  function drawEntityNameplatesOverlay(ctx, room, renderState, entityMetaMap, viewW, viewH, cam, occupiedRectsOut) {
    if (!entityMetaMap || !entityMetaMap.size) return;
    const activeCam = cam || cameraState;
    const vW = viewW || activeCam.viewW || 800;
    const vH = viewH || activeCam.viewH || 600;
    const zoom = activeCam.zoom || 1;
    const sx = activeCam.scaleRatioX || 1;
    const sy = activeCam.scaleRatioY || 1;
    const camX = (typeof activeCam.camX === 'number') ? activeCam.camX : 0;
    const camY = (typeof activeCam.camY === 'number') ? activeCam.camY : 0;
    const effTx = Math.round((vW * 0.5 - camX * zoom) * sx) / sx;
    const effTy = Math.round((vH * 0.5 - camY * zoom) * sy) / sy;
    const bounds = {
      visMinX: -effTx / zoom,
      visMaxX: (vW - effTx) / zoom,
      visMinY: -effTy / zoom,
      visMaxY: (vH - effTy) / zoom,
      edgePad: 4 / zoom
    };

    const placedNameRects = Array.isArray(occupiedRectsOut) ? occupiedRectsOut : [];
    const seen = new Set();
    entityMetaMap.forEach(function (meta) {
      if (!meta || seen.has(meta)) return;
      seen.add(meta);
      drawEntityLabel(ctx, meta, bounds, placedNameRects);
    });
  }

  // ============================================================================
  // FLOATING WORLD-SPACE UI: REACTION BARS, INTERACTION CURSOR, WAYFINDING & SPEECH BUBBLES
  // ============================================================================
  function getSurfaceZ(parentSurf) {
    if (!parentSurf) return 0;
    if (parentSurf.type === 'lab_bench') return 16;
    if (parentSurf.type === 'cafe_counter') return 20;
    if (parentSurf.type === 'fumehood') return 14;
    return 15;
  }

  function computeSurfaceParentMap(room) {
    if (room && room.id) {
      const sig = roomSignature(room);
      const cached = surfaceParentCache.get(room.id);
      if (cached && cached.sig === sig && cached.objectsRef === room.objects) {
        return cached.value;
      }
    }
    const surfaces = [];
    const stackedBySurfaceId = new Map();
    const surfaceParentMap = new Map();
    const objects = (room && Array.isArray(room.objects)) ? room.objects : [];

    for (let i = 0; i < objects.length; i++) {
      const o = objects[i];
      if (SURFACE_TYPES.has(o.type)) {
        surfaces.push(o);
        stackedBySurfaceId.set(o.id, []);
      }
    }
    for (let i = 0; i < objects.length; i++) {
      const o = objects[i];
      if (SURFACE_TYPES.has(o.type) || FLOOR_DECAL_TYPES.has(o.type)) continue;
      for (let s = 0; s < surfaces.length; s++) {
        const surf = surfaces[s];
        const overlapX = Math.min(o.x + o.w, surf.x + surf.w) - Math.max(o.x, surf.x);
        const overlapY = Math.min(o.y + o.h, surf.y + surf.h) - Math.max(o.y, surf.y);
        if (overlapX > 0 && overlapY > 0) {
          surfaceParentMap.set(o.id, surf);
          stackedBySurfaceId.get(surf.id).push(o);
          break;
        }
      }
    }
    const result = { surfaceParentMap, stackedBySurfaceId };
    if (room && room.id) {
      surfaceParentCache.set(room.id, {
        sig: roomSignature(room),
        objectsRef: room.objects,
        value: result
      });
    }
    return result;
  }

  function findTargetStationObj(room, entry) {
    if (!room || !entry) return null;
    const objs = room.objects || [];
    const targetId = entry.objId || entry.stationId || entry.workstationId || entry.hoodId || entry.fixtureId || entry.targetObjId;
    if (targetId) {
      for (let j = 0; j < objs.length; j++) {
        if (objs[j].id === targetId) return objs[j];
      }
    }
    if (typeof entry.x === 'number' && typeof entry.y === 'number') {
      for (let j = 0; j < objs.length; j++) {
        const o = objs[j];
        if (entry.x >= o.x && entry.x < o.x + o.w && entry.y >= o.y && entry.y < o.y + o.h) return o;
      }
    }
    const stType = entry.stationType || entry.objType;
    if (stType) {
      for (let j = 0; j < objs.length; j++) {
        if (objs[j].type === stType) return objs[j];
      }
    }
    return null;
  }

  function getStationOverlayAnchor(targetObj, fallbackX, fallbackY, surfaceParentMap) {
    const cx = targetObj
      ? (targetObj.x + targetObj.w * 0.5) * TILE_W
      : ((Number(fallbackX) || 0) + 0.5) * TILE_W;
    const parentSurf = (targetObj && surfaceParentMap) ? surfaceParentMap.get(targetObj.id) : null;
    const surfZ = getSurfaceZ(parentSurf);
    let baseRise = (targetObj ? (FIXTURE_RISE[targetObj.type] || 22) : 24) + surfZ;
    if (parentSurf && parentSurf.type === 'fumehood') baseRise = Math.max(baseRise, 34);
    if (targetObj) {
      if (targetObj.type === 'nmr_magnet') baseRise = Math.max(baseRise, 28);
      else if (targetObj.type === 'lcms_unit' || targetObj.type === 'maldi_unit') baseRise = Math.max(baseRise, 40);
      else if (targetObj.type === 'buchi' || targetObj.type === 'biotage') baseRise = Math.max(baseRise, 34);
    }
    const topY = (targetObj ? targetObj.y : (Number(fallbackY) || 0)) * TILE_H - baseRise - 20;
    return { cx, topY };
  }

  function drawLoadingBarPill(ctx, cx, topY, labelText, pctText, prog, opts, occupiedRectsOut) {
    const cfg = opts || {};
    const minW = cfg.minW || 92;
    const maxW = cfg.maxW || 134;
    const barH = 22;
    const shakeX = cfg.shakeX || 0;
    const bobY = cfg.bobY || 0;
    const tSec = cfg.nowSec || 0;

    ctx.save();
    let cleanLeft = stripBubbleEmojis(labelText) || 'Working';
    const pctStr = pctText || '';
    let fontSize = 9;
    ctx.font = 'bold ' + fontSize + 'px system-ui, -apple-system, sans-serif';
    let leftW = ctx.measureText(cleanLeft).width;
    let pctW = pctStr ? ctx.measureText(pctStr).width : 0;
    let rowW = leftW + (pctW > 0 ? pctW + 6 : 0);

    if (Math.ceil(rowW) + 18 > maxW) {
      fontSize = 8.5;
      ctx.font = 'bold ' + fontSize + 'px system-ui, -apple-system, sans-serif';
      leftW = ctx.measureText(cleanLeft).width;
      pctW = pctStr ? ctx.measureText(pctStr).width : 0;
      rowW = leftW + (pctW > 0 ? pctW + 6 : 0);
    }
    const maxLeftAvail = maxW - 18 - (pctW > 0 ? pctW + 6 : 0);
    if (leftW > maxLeftAvail && maxLeftAvail > 12) {
      cleanLeft = fitLabelNoEllipsis(ctx, cleanLeft, maxLeftAvail);
      leftW = ctx.measureText(cleanLeft).width;
      rowW = leftW + (pctW > 0 ? pctW + 6 : 0);
    }

    const barW = Math.round(clamp(Math.ceil(rowW) + 18, Math.min(86, minW), maxW));
    const finalW = Math.max(minW, barW);
    const bx = Math.round(cx - finalW * 0.5 + shakeX);
    let by = Math.round(topY + bobY);

    if (cfg.avoidOccupied && occupiedRectsOut && occupiedRectsOut.length) {
      for (let pass = 0; pass < 6; pass++) {
        let hit = null;
        for (let p = 0; p < occupiedRectsOut.length; p++) {
          const r = occupiedRectsOut[p];
          if (rectsOverlapPad(bx, by, finalW, barH, r.bx, r.by, r.bw, r.bh, 4)) {
            hit = r;
            break;
          }
        }
        if (!hit) break;
        by = Math.floor(hit.by - barH - 4);
      }
    }

    if (cfg.glowCol) {
      ctx.shadowColor = cfg.glowCol;
      ctx.shadowBlur = cfg.shadowBlur || 9;
    }
    fillRoundRect(ctx, bx, by, finalW, barH, 6, 'rgba(15, 23, 42, 0.94)', cfg.borderCol || '#38bdf8', 1.4);
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;

    if (occupiedRectsOut) occupiedRectsOut.push({ bx, by, bw: finalW, bh: barH });

    ctx.textBaseline = 'middle';
    ctx.fillStyle = cfg.labelCol || '#f8fafc';
    ctx.textAlign = 'left';
    ctx.fillText(cleanLeft, bx + 7, by + 7.5);
    if (pctStr) {
      ctx.fillStyle = cfg.pctCol || '#cbd5e1';
      ctx.textAlign = 'right';
      ctx.fillText(pctStr, bx + finalW - 7, by + 7.5);
    }

    const trkX = bx + 6;
    const trkY = by + 13.5;
    const trkW = finalW - 12;
    const trkH = 4.5;
    fillRoundRect(ctx, trkX, trkY, trkW, trkH, 2.25, '#1e293b', null, 0);
    const pClamped = clamp(prog, 0, 1);
    if (pClamped > 0) {
      const fillW = Math.max(4, trkW * pClamped);
      fillRoundRect(ctx, trkX, trkY, fillW, trkH, 2.25, cfg.fillCol || '#10b981', null, 0);
      if (cfg.isRunning && fillW > 10) {
        const sweepU = (tSec * 0.9 + (cfg.shimmerSeed || 0)) % 1;
        const sweepX = trkX + sweepU * Math.max(0, fillW - 8);
        const sweepW = Math.min(8, trkX + fillW - sweepX);
        if (sweepW > 1) {
          ctx.fillStyle = 'rgba(255, 255, 255, 0.34)';
          ctx.fillRect(sweepX, trkY + 0.5, sweepW, trkH - 1);
        }
      }
    }
    ctx.restore();
  }

  function drawReactionBarsOverlay(ctx, room, activeJobsOrState, surfaceParentMap, nowSec, occupiedRectsOut) {
    if (!room) return;
    const list = getStationJobList(activeJobsOrState);
    if (!list.length) return;
    const tSec = nowSec || 0;

    for (let i = 0; i < list.length; i++) {
      const rxn = list[i];
      if (!rxn) continue;
      const rxnRoom = rxn.room || rxn.roomId;
      if (rxnRoom && rxnRoom !== room.id) continue;

      const targetObj = findTargetStationObj(room, rxn);
      if (!targetObj && (typeof rxn.x !== 'number' || typeof rxn.y !== 'number')) continue;

      const anchor = getStationOverlayAnchor(targetObj, rxn.x, rxn.y, surfaceParentMap);
      const status = classifyReactionStatus(rxn, targetObj);
      const prog = getReactionProgress(rxn);
      const isInstrument = isInstrumentOrWorkupJob(rxn, targetObj) && !(Number(rxn.sweetSpotMins) > 0);

      const isOver = status === 'overcooking';
      const isSweet = status === 'sweet_spot';
      const isReady = status === 'ready';

      const rawTitle = stripBubbleEmojis(
        rxn.shortLabel || rxn.label || rxn.title || rxn.name || rxn.stepName ||
        (targetObj && (targetObj.label || ASSET_LABELS[targetObj.type])) || 'Task'
      ) || 'Task';

      const pctText = Math.round(prog * 100) + '%';
      let labelText = rawTitle;
      let fillCol = isInstrument ? '#0ea5e9' : '#10b981';
      let borderCol = isInstrument ? '#38bdf8' : '#34d399';
      let glowCol = null;
      let labelCol = '#f8fafc';
      let pctCol = '#cbd5e1';
      let shakeX = 0;
      let bobY = 0;

      if (isOver) {
        labelText = 'OVERCOOK!';
        fillCol = '#ef4444';
        borderCol = Math.floor(tSec * 8) % 2 === 0 ? '#ef4444' : '#fca5a5';
        glowCol = '#ef4444';
        labelCol = '#fecaca';
        pctCol = '#fca5a5';
        shakeX = Math.sin(tSec * 32) * 2.2;
      } else if (isSweet) {
        labelText = 'QUENCH';
        fillCol = '#f59e0b';
        borderCol = '#fbbf24';
        glowCol = '#f59e0b';
        labelCol = '#fef3c7';
        pctCol = '#fde68a';
        bobY = Math.sin(tSec * 6) * 1.6;
      } else if (isReady) {
        labelText = 'READY';
        fillCol = '#22c55e';
        borderCol = '#4ade80';
        glowCol = '#22c55e';
        labelCol = '#dcfce7';
        pctCol = '#86efac';
        bobY = Math.sin(tSec * 4.5) * 1.2;
      }

      drawLoadingBarPill(ctx, anchor.cx, anchor.topY, labelText, pctText, prog, {
        minW: 92,
        maxW: 134,
        fillCol,
        borderCol,
        glowCol,
        shadowBlur: 10,
        labelCol,
        pctCol,
        shakeX,
        bobY,
        nowSec: tSec,
        shimmerSeed: i * 0.23,
        isRunning: status === 'running',
        avoidOccupied: true
      }, occupiedRectsOut);
    }
  }

  function drawPlayerActionBarOverlay(ctx, room, renderState, surfaceParentMap, nowSec, entityMetaMap, occupiedRectsOut) {
    if (!room || !renderState || !renderState.activePlayerAction) return;
    const action = renderState.activePlayerAction;
    const actRoom = action.roomId || action.room ||
      (renderState.player && (renderState.player.roomId || renderState.player.room));
    if (!actRoom || actRoom !== room.id) return;

    const tSec = nowSec || 0;
    const targetObj = findTargetStationObj(room, action);
    let cx = null;
    let topY = null;

    if (targetObj) {
      const anchor = getStationOverlayAnchor(targetObj, action.x, action.y, surfaceParentMap);
      cx = anchor.cx;
      topY = anchor.topY;
    } else if (renderState.player && renderState.player.visible !== false) {
      const p = renderState.player;
      const pid = p.id || p.charId || 'player';
      const meta = entityMetaMap && (entityMetaMap.get('player') || entityMetaMap.get(pid));
      cx = meta ? meta.anchorX : ((Number(p.x) + 0.5) * TILE_W);
      const headTop = meta ? meta.headTopY : ((Number(p.y) + 0.86) * TILE_H - 64);
      topY = headTop - 28;
    } else if (typeof action.x === 'number' && typeof action.y === 'number') {
      const anchor = getStationOverlayAnchor(null, action.x, action.y, surfaceParentMap);
      cx = anchor.cx;
      topY = anchor.topY;
    }
    if (cx === null || topY === null) return;

    let prog = 0;
    if (typeof action.progress === 'number' && Number.isFinite(action.progress)) {
      prog = action.progress > 1.5 ? clamp(action.progress / 100, 0, 1) : clamp(action.progress, 0, 1);
    } else if (typeof action.elapsedMs === 'number' && typeof action.durationMs === 'number' && action.durationMs > 0) {
      prog = clamp(action.elapsedMs / action.durationMs, 0, 1);
    } else if (typeof action.elapsedSec === 'number' && typeof action.durationSec === 'number' && action.durationSec > 0) {
      prog = clamp(action.elapsedSec / action.durationSec, 0, 1);
    } else if (typeof action.elapsedMins === 'number' && typeof action.targetMins === 'number' && action.targetMins > 0) {
      prog = clamp(action.elapsedMins / action.targetMins, 0, 1);
    } else if (typeof action.startedAt === 'number' && typeof action.endsAt === 'number' && action.endsAt > action.startedAt) {
      prog = clamp((Date.now() - action.startedAt) / (action.endsAt - action.startedAt), 0, 1);
    }

    const useEmerald = action.kind === 'reaction' || Boolean(action.emerald) || action.color === '#10b981';
    const fillCol = action.color || (useEmerald ? '#10b981' : '#6366f1');
    const borderCol = useEmerald ? '#34d399' : '#818cf8';
    const labelText = stripBubbleEmojis(action.shortLabel || action.label || action.title || action.name || 'Working') || 'Working';
    const pctText = Math.round(prog * 100) + '%';

    drawLoadingBarPill(ctx, cx, topY, labelText, pctText, prog, {
      minW: 96,
      maxW: 138,
      fillCol,
      borderCol,
      glowCol: useEmerald ? 'rgba(16, 185, 129, 0.45)' : 'rgba(99, 102, 241, 0.45)',
      shadowBlur: 7,
      labelCol: '#f8fafc',
      pctCol: '#e0e7ff',
      nowSec: tSec,
      shimmerSeed: 0.41,
      isRunning: prog < 1,
      avoidOccupied: true
    }, occupiedRectsOut);
  }

  function drawNpcReactionBadgesOverlay(ctx, room, npcReactions, activeReactions, surfaceParentMap, nowSec, occupiedRectsOut) {
    if (!npcReactions) return;
    const list = Array.isArray(npcReactions) ? npcReactions : Object.values(npcReactions);
    if (!list.length) return;

    const objs = room.objects || [];
    const castById = (window.KLB && window.KLB.CAST_BY_ID) ? window.KLB.CAST_BY_ID : {};

    const playerRxnObjIds = new Set();
    const pList = getStationJobList(activeReactions);
    for (let i = 0; i < pList.length; i++) {
      const pr = pList[i];
      if (!pr) continue;
      const pRoom = pr.room || pr.roomId;
      if (pRoom && pRoom !== room.id) continue;
      const pid = pr.objId || pr.stationId || pr.workstationId || pr.hoodId || pr.fixtureId;
      if (pid) playerRxnObjIds.add(pid);
    }

    for (let i = 0; i < list.length; i++) {
      const rxn = list[i];
      if (!rxn) continue;
      const rxnRoom = rxn.roomId || rxn.room;
      if (rxnRoom && rxnRoom !== room.id) continue;

      const targetObj = findTargetStationObj(room, rxn);
      if (!targetObj && (typeof rxn.x !== 'number' || typeof rxn.y !== 'number')) continue;

      const cx = targetObj
        ? (targetObj.x + targetObj.w * 0.5) * TILE_W
        : (Number(rxn.x) + 0.5) * TILE_W;
      const parentSurf = targetObj ? surfaceParentMap.get(targetObj.id) : null;
      const surfZ = getSurfaceZ(parentSurf);
      let baseRise = (targetObj ? (FIXTURE_RISE[targetObj.type] || 20) : 20) + surfZ;
      if (parentSurf && parentSurf.type === 'fumehood') baseRise = Math.max(baseRise, 34);
      if (targetObj && targetObj.type === 'nmr_magnet') baseRise = Math.max(baseRise, 28);
      if (targetObj && (targetObj.type === 'lcms_unit' || targetObj.type === 'maldi_unit')) baseRise = Math.max(baseRise, 40);
      const hasPlayerBar = targetObj && playerRxnObjIds.has(targetObj.id);
      const topY = (targetObj ? targetObj.y : Number(rxn.y)) * TILE_H - baseRise - (hasPlayerBar ? 42 : 16);

      const ownerId = rxn.ownerId || rxn.npcId || rxn.charId || '';
      const castInfo = ownerId ? castById[ownerId] : null;
      const ownerLabel = stripBubbleEmojis(
        (castInfo && castInfo.shortName) ||
        rxn.ownerName ||
        (ownerId ? ownerId.split('_')[0].replace(/^./, function (c) { return c.toUpperCase(); }) : '')
      );
      const cleanTitle = stripBubbleEmojis(rxn.shortLabel || rxn.title || rxn.label || '');
      const rawBadge = (ownerLabel && cleanTitle)
        ? (ownerLabel + ': ' + cleanTitle)
        : (ownerLabel || cleanTitle || 'Active Rxn');

      const hasProgressBar = (typeof rxn.targetMins === 'number' && rxn.targetMins > 0) || typeof rxn.progress === 'number';
      const badgeH = hasProgressBar ? 22 : 17;

      ctx.save();
      ctx.font = '600 8.5px "Segoe UI", system-ui, -apple-system, sans-serif';
      let badgeText = rawBadge;
      if (ctx.measureText(badgeText).width > 116) {
        ctx.font = '600 8px "Segoe UI", system-ui, -apple-system, sans-serif';
      }
      badgeText = fitLabelNoEllipsis(ctx, badgeText, 128);
      const textW = ctx.measureText(badgeText).width;
      const badgeW = Math.max(62, Math.ceil(textW) + 23);
      const bobY = Math.sin(nowSec * 3.2 + i) * 1.0;
      const bx = Math.round(cx - badgeW * 0.5);
      let by = Math.round(topY + bobY);

      if (occupiedRectsOut && occupiedRectsOut.length) {
        for (let pass = 0; pass < 6; pass++) {
          let hit = null;
          for (let p = 0; p < occupiedRectsOut.length; p++) {
            const r = occupiedRectsOut[p];
            if (rectsOverlapPad(bx, by, badgeW, badgeH, r.bx, r.by, r.bw, r.bh, 4)) {
              hit = r;
              break;
            }
          }
          if (!hit) break;
          by = Math.floor(hit.by - badgeH - 4);
        }
      }

      const glowMix = 0.5 + 0.5 * Math.sin(nowSec * 3.0 + i);
      const borderCol = glowMix > 0.45 ? 'rgba(45, 212, 191, 0.85)' : 'rgba(251, 191, 36, 0.85)';
      const liqCol = glowMix > 0.45 ? '#f59e0b' : '#14b8a6';

      ctx.shadowColor = glowMix > 0.45 ? 'rgba(20, 184, 166, 0.45)' : 'rgba(245, 158, 11, 0.40)';
      ctx.shadowBlur = 8;
      ctx.shadowOffsetY = 2;
      fillRoundRect(ctx, bx, by, badgeW, badgeH, hasProgressBar ? 6.5 : 8.5, 'rgba(15, 23, 42, 0.90)', borderCol, 1.15);
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
      ctx.shadowOffsetY = 0;

      if (occupiedRectsOut) occupiedRectsOut.push({ bx, by, bw: badgeW, bh: badgeH });

      const iconCy = hasProgressBar ? (by + 8.5) : (by + badgeH * 0.5);
      drawVectorFlaskIcon(ctx, bx + 10.5, iconCy, liqCol, '#5eead4', nowSec * 1.3 + i * 0.37);

      ctx.fillStyle = '#e2e8f0';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(badgeText, bx + 18, hasProgressBar ? (by + 9) : (by + badgeH * 0.5 + 0.5));

      if (hasProgressBar) {
        const prog = getReactionProgress(rxn);
        const st = classifyReactionStatus(rxn, targetObj);
        const barCol = st === 'overcooking'
          ? '#ef4444'
          : (st === 'sweet_spot' ? '#f59e0b' : (st === 'ready' ? '#22c55e' : (isInstrumentOrWorkupJob(rxn, targetObj) ? '#0ea5e9' : '#14b8a6')));
        const trkX = bx + 6;
        const trkY = by + badgeH - 5.5;
        const trkW = badgeW - 12;
        const trkH = 4;
        fillRoundRect(ctx, trkX, trkY, trkW, trkH, 2, '#1e293b', null, 0);
        if (prog > 0) {
          fillRoundRect(ctx, trkX, trkY, Math.max(3, trkW * prog), trkH, 2, barCol, null, 0);
        }
      }
      ctx.restore();
    }
  }

  function drawKeycapPromptPill(ctx, cx, cy, promptText, borderColor, badgeBg, occupiedRectsOut) {
    ctx.save();
    ctx.font = 'bold 10px system-ui, -apple-system, sans-serif';
    const textW = ctx.measureText(promptText).width;
    const pillW = Math.ceil(textW + 30);
    const pillH = 20;
    const px = Math.round(cx - pillW * 0.5);
    const py = Math.round(cy - pillH * 0.5);

    ctx.shadowColor = 'rgba(15, 23, 42, 0.55)';
    ctx.shadowBlur = 6;
    fillRoundRect(ctx, px, py, pillW, pillH, 5, 'rgba(15, 23, 42, 0.92)', borderColor, 1.4);
    ctx.restore();

    if (occupiedRectsOut) occupiedRectsOut.push({ bx: px, by: py, bw: pillW, bh: pillH });

    // Crisp [E] keycap badge
    fillRoundRect(ctx, px + 4, py + 3, 16, 14, 3, badgeBg, null, 0);
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 9px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('E', px + 12, py + 10.5);

    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 10px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(promptText, px + 24, py + 10.5);
  }

  function drawInteractionHighlightOverlay(ctx, room, renderState, surfaceParentMap, nowSec, entitiesById, entityMetaMap, occupiedRectsOut) {
    // 1. Optional Floor Cell Cursor Reticle (highlightedCell)
    const hc = renderState.highlightedCell;
    if (hc && typeof hc.x === 'number' && typeof hc.y === 'number') {
      const gx = hc.x * TILE_W;
      const gy = hc.y * TILE_H;
      const cLen = 9;
      ctx.save();
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.85)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(gx + 2, gy + 2 + cLen); ctx.lineTo(gx + 2, gy + 2); ctx.lineTo(gx + 2 + cLen, gy + 2);
      ctx.moveTo(gx + TILE_W - 2 - cLen, gy + 2); ctx.lineTo(gx + TILE_W - 2, gy + 2); ctx.lineTo(gx + TILE_W - 2, gy + 2 + cLen);
      ctx.moveTo(gx + 2, gy + TILE_H - 2 - cLen); ctx.lineTo(gx + 2, gy + TILE_H - 2); ctx.lineTo(gx + 2 + cLen, gy + TILE_H - 2);
      ctx.moveTo(gx + TILE_W - 2 - cLen, gy + TILE_H - 2); ctx.lineTo(gx + TILE_W - 2, gy + TILE_H - 2); ctx.lineTo(gx + TILE_W - 2, gy + TILE_H - 2 - cLen);
      ctx.stroke();
      ctx.restore();
    }

    const bob = Math.sin(nowSec * 5) * 2;
    const castById = (window.KLB && window.KLB.CAST_BY_ID) ? window.KLB.CAST_BY_ID : {};

    // 2. Highlighted NPC Prompt ("[E] Talk to <shortName>")
    let hNpc = renderState.highlightedNpc || null;
    const hNpcId = renderState.highlightedNpcId || (hNpc && hNpc.id) || null;
    if (!hNpc && hNpcId && entitiesById) {
      hNpc = entitiesById.get(hNpcId) || null;
    }
    if (hNpc && hNpcId) {
      const castInfo = castById[hNpc.charId || hNpcId] || null;
      const shortName = stripBubbleEmojis(
        hNpc.shortName || (castInfo && (castInfo.shortName || castInfo.name)) || hNpc.name || hNpcId
      ) || 'Colleague';
      const meta = entityMetaMap && entityMetaMap.get(hNpcId);
      const ncx = meta ? meta.anchorX : ((Number(hNpc.x) + 0.5) * TILE_W);
      const headTop = meta ? meta.headTopY : ((Number(hNpc.y) + 0.86) * TILE_H - 64);
      const ncy = headTop - 15 + bob;
      drawKeycapPromptPill(ctx, ncx, ncy, 'Talk to ' + shortName, '#fbbf24', '#fbbf24', occupiedRectsOut);
    }

    // 3. Floating "[E] Label" Prompt Pill above highlightedObj (strictly ignore npc_marker!)
    let hObj = renderState.highlightedObj || null;
    if (!hObj && renderState.highlightedObjId && room.objects) {
      for (let i = 0; i < room.objects.length; i++) {
        if (room.objects[i].id === renderState.highlightedObjId) {
          hObj = room.objects[i];
          break;
        }
      }
    }
    if (hObj && hObj.type === 'npc_marker') hObj = null;

    if (hObj) {
      const grpTag = (hObj.group && hObj.group !== 'none' && GROUP_PALETTE[hObj.group])
        ? ' (' + hObj.group.charAt(0).toUpperCase() + hObj.group.slice(1) + ')'
        : '';
      const promptText = renderState.highlightPrompt ||
        hObj.label ||
        ((ASSET_LABELS[hObj.type] || hObj.type) + grpTag);

      const parentSurf = surfaceParentMap.get(hObj.id);
      const surfZ = getSurfaceZ(parentSurf);
      let rise = (FIXTURE_RISE[hObj.type] || 18) + surfZ;
      if (parentSurf && parentSurf.type === 'fumehood') rise = Math.max(rise, 34);
      const cx = (hObj.x + hObj.w * 0.5) * TILE_W;
      const cy = hObj.y * TILE_H - rise - 13 + bob;
      drawKeycapPromptPill(ctx, cx, cy, promptText, '#38bdf8', '#38bdf8', occupiedRectsOut);
    }

    // 4. Compact Passive Hover Tooltip Pill (when hovering another fixture or NPC!)
    const hovNpcId = renderState.hoveredNpcId || renderState._activeHoverNpcId || null;
    const hovObjId = renderState.hoveredObjId || renderState._activeHoverObjId || null;
    let tipCx = null;
    let tipCy = null;
    let tipText = '';

    if (hovNpcId && hovNpcId !== hNpcId && entitiesById) {
      const hEnt = entitiesById.get(hovNpcId);
      if (hEnt) {
        const cInfo = castById[hEnt.charId || hovNpcId] || null;
        const nameStr = (cInfo && cInfo.name) || hEnt.name || hovNpcId;
        const rolePart = cInfo && cInfo.role ? (' - ' + String(cInfo.role).split('\u2022')[0].trim()) : '';
        tipText = stripBubbleEmojis(nameStr + rolePart);
        const meta = entityMetaMap && entityMetaMap.get(hovNpcId);
        tipCx = meta ? meta.anchorX : ((Number(hEnt.x) + 0.5) * TILE_W);
        tipCy = (meta ? meta.headTopY : ((Number(hEnt.y) + 0.86) * TILE_H - 64)) - 14;
      }
    } else if (hovObjId && (!hObj || hovObjId !== hObj.id) && room.objects) {
      let o = null;
      for (let i = 0; i < room.objects.length; i++) {
        if (room.objects[i].id === hovObjId) {
          o = room.objects[i];
          break;
        }
      }
      if (o && o.type !== 'npc_marker') {
        const grpTag = (o.group && o.group !== 'none' && GROUP_PALETTE[o.group])
          ? ' (' + o.group.charAt(0).toUpperCase() + o.group.slice(1) + ')'
          : '';
        tipText = o.label || ((ASSET_LABELS[o.type] || o.type) + grpTag);
        const parentSurf = surfaceParentMap.get(o.id);
        let rise = (FIXTURE_RISE[o.type] || 18) + getSurfaceZ(parentSurf);
        if (parentSurf && parentSurf.type === 'fumehood') rise = Math.max(rise, 34);
        tipCx = (o.x + o.w * 0.5) * TILE_W;
        tipCy = o.y * TILE_H - rise - 12;
      }
    }

    if (tipText && tipCx !== null) {
      ctx.save();
      ctx.font = '600 9.5px "Segoe UI", system-ui, -apple-system, sans-serif';
      const cleanTip = fitLabelNoEllipsis(ctx, tipText, 210);
      const tw = ctx.measureText(cleanTip).width;
      const pw = Math.ceil(tw + 14);
      const ph = 17;
      const px = Math.round(tipCx - pw * 0.5);
      const py = Math.round(tipCy - ph * 0.5);
      fillRoundRect(ctx, px, py, pw, ph, 4.5, 'rgba(15, 23, 42, 0.88)', 'rgba(226, 232, 240, 0.5)', 1);
      ctx.fillStyle = '#f1f5f9';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(cleanTip, tipCx, py + ph * 0.5 + 0.5);
      ctx.restore();
      if (occupiedRectsOut) occupiedRectsOut.push({ bx: px, by: py, bw: pw, bh: ph });
    }
  }

  function drawWayfindingChevron(ctx, cx, tipY, primaryColor, glowColor, label, nowSec, phaseIdx) {
    const bob = Math.sin(nowSec * 4.2 + (phaseIdx || 0)) * 3.0;
    const y = Math.round(tipY + bob);

    ctx.save();
    ctx.shadowColor = glowColor;
    ctx.shadowBlur = 9;
    ctx.fillStyle = primaryColor;
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(cx, y);
    ctx.lineTo(cx - 6.5, y - 9);
    ctx.lineTo(cx - 2.4, y - 9);
    ctx.lineTo(cx - 2.4, y - 14);
    ctx.lineTo(cx + 2.4, y - 14);
    ctx.lineTo(cx + 2.4, y - 9);
    ctx.lineTo(cx + 6.5, y - 9);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    if (label) {
      ctx.save();
      ctx.font = 'bold 8.5px system-ui, -apple-system, sans-serif';
      const txt = stripBubbleEmojis(label);
      const tw = ctx.measureText(txt).width;
      const pw = Math.ceil(tw + 10);
      const bx = Math.round(cx - pw * 0.5);
      const by = y - 30;
      fillRoundRect(ctx, bx, by, pw, 14, 3.5, 'rgba(15, 23, 42, 0.88)', primaryColor, 1);
      ctx.fillStyle = '#fef3c7';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(txt, cx, by + 7.5);
      ctx.restore();
    }
  }

  function getWayfindingTargetLabel(t) {
    if (t && t.label) return stripBubbleEmojis(t.label);
    const o = t && t.obj;
    if (!o) return 'Target';
    if (o.type === 'exit_stairs') return 'Exit Door';
    if (o.type === 'spiral_stairs') return stripBubbleEmojis(o.label || 'Spiral Stairs');
    if (o.type === 'chem_cupboard' && o.label) {
      const m = String(o.label).match(/cupboard\s*#?(\d+)/i);
      if (m) return 'Cupboard ' + m[1];
    }
    return stripBubbleEmojis(o.label || ASSET_LABELS[o.type] || o.type || 'Target');
  }

  function drawWayfindingOverlay(ctx, room, renderState, surfaceParentMap, nowSec, viewW, viewH, cam, occupiedPillRects) {
    if (!room || !renderState || renderState.showWayfinding === false) return;
    let occRects = occupiedPillRects;
    let vWArg = viewW;
    if (Array.isArray(viewW) && occRects === undefined) {
      occRects = viewW;
      vWArg = undefined;
    }

    const activeCam = cam || cameraState;
    const vW = vWArg || activeCam.viewW || 800;
    const vH = viewH || activeCam.viewH || 600;
    const zoom = activeCam.zoom || 1;
    const sx = activeCam.scaleRatioX || 1;
    const sy = activeCam.scaleRatioY || 1;
    const camX = (typeof activeCam.camX === 'number') ? activeCam.camX : 0;
    const camY = (typeof activeCam.camY === 'number') ? activeCam.camY : 0;
    const rawTx = vW * 0.5 - camX * zoom;
    const rawTy = vH * 0.5 - camY * zoom;
    const effTx = Math.round(rawTx * sx) / sx;
    const effTy = Math.round(rawTy * sy) / sy;
    const visMinX = -effTx / zoom;
    const visMaxX = (vW - effTx) / zoom;
    const visMinY = -effTy / zoom;
    const visMaxY = (vH - effTy) / zoom;

    const objs = room.objects || [];
    const objById = new Map();
    for (let i = 0; i < objs.length; i++) objById.set(objs[i].id, objs[i]);

    const targets = []; // { obj, gx, gy, label, kind }
    const seenIds = new Set();

    // 1. Explicit renderState.questTargetObjIds (Array or Set of IDs or { id, label, kind } descriptors)
    const qRaw = renderState.questTargetObjIds;
    if (qRaw) {
      const qList = Array.isArray(qRaw) ? qRaw : (typeof qRaw[Symbol.iterator] === 'function' ? Array.from(qRaw) : []);
      for (let i = 0; i < qList.length; i++) {
        const entry = qList[i];
        const oid = typeof entry === 'string' ? entry : (entry && (entry.id || entry.objId));
        const o = oid ? objById.get(oid) : null;
        if (o && !seenIds.has(o.id)) {
          seenIds.add(o.id);
          targets.push({
            obj: o,
            label: (entry && typeof entry === 'object' && entry.label) ? entry.label : '',
            kind: (entry && typeof entry === 'object' && entry.kind) || 'quest'
          });
        } else if (entry && typeof entry === 'object' && typeof entry.gx === 'number' && typeof entry.gy === 'number') {
          targets.push({
            obj: null,
            gx: entry.gx,
            gy: entry.gy,
            label: entry.label || '',
            kind: entry.kind || 'quest'
          });
        }
      }
    }

    // 2. Explicit renderState.wayfindingTargets
    if (Array.isArray(renderState.wayfindingTargets)) {
      for (let i = 0; i < renderState.wayfindingTargets.length; i++) {
        const wt = renderState.wayfindingTargets[i];
        if (!wt) continue;
        if (wt.roomId && wt.roomId !== room.id) continue;
        const o = wt.objId ? objById.get(wt.objId) : null;
        if (o && !seenIds.has(o.id)) {
          seenIds.add(o.id);
          targets.push({ obj: o, label: wt.label || '', kind: wt.kind || 'quest' });
        } else if (typeof wt.gx === 'number' && typeof wt.gy === 'number') {
          targets.push({ obj: null, gx: wt.gx, gy: wt.gy, label: wt.label || '', kind: wt.kind || 'quest' });
        }
      }
    }

    // 3. Fire Alarm Evacuation Override
    if (renderState.fireAlarmActive) {
      if (room.id === 'klb_2f') {
        targets.push({ obj: null, gx: 9, gy: 2, label: 'FIRE EXIT', kind: 'evac' });
      } else if (room.id === 'klb_3f') {
        const st = objs.find(function (o) { return o.type === 'spiral_stairs'; });
        if (st && !seenIds.has(st.id)) {
          seenIds.add(st.id);
          targets.push({ obj: st, label: 'To 2F Fire Exit', kind: 'evac' });
        }
      }
    }

    if (!targets.length) return;

    const usedRects = Array.isArray(occRects) ? occRects.slice() : [];
    const offScreenTargets = [];

    for (let i = 0; i < targets.length; i++) {
      const t = targets[i];
      const isEvac = t.kind === 'evac';
      const isPrep = t.kind === 'prep';
      const primary = isEvac ? '#34d399' : (isPrep ? '#fb923c' : '#fbbf24');
      const glow = isEvac ? 'rgba(16, 185, 129, 0.75)' : (isPrep ? 'rgba(251, 146, 60, 0.65)' : 'rgba(251, 191, 36, 0.78)');

      let cx;
      let baseTipY;
      if (t.obj) {
        const o = t.obj;
        const parentSurf = surfaceParentMap ? surfaceParentMap.get(o.id) : null;
        let rise = (FIXTURE_RISE[o.type] || 18) + getSurfaceZ(parentSurf);
        if (parentSurf && parentSurf.type === 'fumehood') rise = Math.max(rise, 34);
        cx = (o.x + o.w * 0.5) * TILE_W;
        baseTipY = o.y * TILE_H - rise - 6;

        // Soft pulsing floor corner glow around target station footprint
        const pulse = 0.35 + 0.3 * Math.sin(nowSec * 4.5 + i);
        ctx.save();
        ctx.strokeStyle = isEvac
          ? ('rgba(16, 185, 129, ' + pulse.toFixed(2) + ')')
          : ('rgba(251, 191, 36, ' + pulse.toFixed(2) + ')');
        ctx.lineWidth = 1.8;
        roundRectPath(ctx, o.x * TILE_W + 2, o.y * TILE_H + 2, o.w * TILE_W - 4, o.h * TILE_H - 4, 4);
        ctx.stroke();
        ctx.restore();
      } else {
        cx = (t.gx + 0.5) * TILE_W;
        baseTipY = t.gy * TILE_H - 18;
      }

      const inFrustum =
        cx >= visMinX + 20 &&
        cx <= visMaxX - 20 &&
        baseTipY >= visMinY + 20 &&
        baseTipY <= visMaxY - 20;

      if (!inFrustum) {
        offScreenTargets.push({ t, cx, tipY: baseTipY, isEvac });
        continue;
      }

      const cleanLabel = t.label ? stripBubbleEmojis(t.label) : '';
      let boxW = 16;
      let boxH = 16;
      if (cleanLabel) {
        ctx.save();
        ctx.font = 'bold 8.5px system-ui, -apple-system, sans-serif';
        const pw = Math.ceil(ctx.measureText(cleanLabel).width + 10);
        ctx.restore();
        boxW = Math.max(16, pw);
        boxH = 31;
      }

      let tipY = baseTipY;
      for (let pass = 0; pass < 6; pass++) {
        let hit = null;
        const boxX = cx - boxW * 0.5;
        const boxY = tipY - boxH;
        for (let p = 0; p < usedRects.length; p++) {
          const r = usedRects[p];
          if (rectsOverlapPad(boxX, boxY, boxW, boxH + 3, r.bx, r.by, r.bw, r.bh, 3)) {
            hit = r;
            break;
          }
        }
        if (!hit) break;
        tipY = Math.floor(hit.by - 6);
      }
      tipY = Math.max(visMinY + boxH + 6, tipY);

      drawWayfindingChevron(ctx, cx, tipY, primary, glow, cleanLabel, nowSec, i);
      usedRects.push({ bx: cx - boxW * 0.5, by: tipY - boxH, bw: boxW, bh: boxH + 3 });
    }

    // Screen-Edge Off-Screen Compass Pills (clamped along 14px inner canvas margin)
    if (offScreenTargets.length) {
      ctx.save();
      if (typeof ctx.setTransform === 'function') {
        ctx.setTransform(sx, 0, 0, sy, 0, 0);
      } else {
        ctx.translate(-effTx / zoom, -effTy / zoom);
        ctx.scale(1 / zoom, 1 / zoom);
      }

      const margin = 14;
      const pillH = 22;
      const placedCompassRects = [];

      for (let i = 0; i < offScreenTargets.length; i++) {
        const item = offScreenTargets[i];
        const scrX = item.cx * zoom + effTx;
        const scrY = item.tipY * zoom + effTy;

        let outX = 0;
        if (item.cx < visMinX + 20) outX = item.cx - (visMinX + 20);
        else if (item.cx > visMaxX - 20) outX = item.cx - (visMaxX - 20);

        let outY = 0;
        if (item.tipY < visMinY + 20) outY = item.tipY - (visMinY + 20);
        else if (item.tipY > visMaxY - 20) outY = item.tipY - (visMaxY - 20);

        const arrow = Math.abs(outX) >= Math.abs(outY)
          ? (outX < 0 ? '\u2190' : '\u2192')
          : (outY < 0 ? '\u2191' : '\u2193');

        ctx.font = 'bold 10px system-ui, -apple-system, sans-serif';
        const rawLabel = getWayfindingTargetLabel(item.t);
        const fittedLabel = fitLabelNoEllipsis(ctx, rawLabel, 136);
        const fullText = arrow + ' ' + fittedLabel;
        const tw = ctx.measureText(fullText).width;
        const pillW = Math.ceil(tw + 16);

        const minBx = margin;
        const maxBx = Math.max(minBx, vW - margin - pillW);
        const minBy = margin;
        const maxBy = Math.max(minBy, vH - margin - pillH);

        const bx = Math.round(clamp(scrX - pillW * 0.5, minBx, maxBx));
        const baseBy = Math.round(clamp(scrY - pillH * 0.5, minBy, maxBy));
        let by = baseBy;

        const stepY = pillH + 6;
        for (let s = 0; s <= 8; s++) {
          const dirList = s === 0 ? [0] : [s * stepY, -s * stepY];
          let foundSpot = false;
          for (let d = 0; d < dirList.length; d++) {
            const candY = Math.round(clamp(baseBy + dirList[d], minBy, maxBy));
            const overlaps = placedCompassRects.some(function (r) {
              return rectsOverlapPad(bx, candY, pillW, pillH, r.bx, r.by, r.bw, r.bh, 4);
            });
            if (!overlaps) {
              by = candY;
              foundSpot = true;
              break;
            }
          }
          if (foundSpot) break;
        }
        placedCompassRects.push({ bx, by, bw: pillW, bh: pillH });

        const compColor = item.isEvac ? '#34d399' : '#fbbf24';
        const compGlow = item.isEvac ? 'rgba(16, 185, 129, 0.55)' : 'rgba(251, 191, 36, 0.50)';

        ctx.save();
        ctx.shadowColor = compGlow;
        ctx.shadowBlur = 7;
        fillRoundRect(ctx, bx, by, pillW, pillH, 6, 'rgba(15, 23, 42, 0.93)', compColor, 1.4);
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;

        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        const textCy = by + pillH * 0.5 + 0.5;
        ctx.fillStyle = compColor;
        ctx.fillText(arrow, bx + 8, textCy);
        const arrowW = ctx.measureText(arrow + ' ').width;
        ctx.fillStyle = item.isEvac ? '#dcfce7' : '#fef3c7';
        ctx.fillText(fittedLabel, bx + 8 + arrowW, textCy);
        ctx.restore();
      }
      ctx.restore();
    }
  }

  function collectSpeechBubbles(renderState, room, entitiesById) {
    const out = [];
    const raw = renderState.speechBubbles;

    if (Array.isArray(raw)) {
      for (let i = 0; i < raw.length; i++) {
        if (raw[i]) out.push(raw[i]);
      }
    } else if (raw && typeof raw === 'object') {
      const keys = Object.keys(raw);
      for (let i = 0; i < keys.length; i++) {
        const val = raw[keys[i]];
        if (!val) continue;
        if (typeof val === 'string') out.push({ entityId: keys[i], text: val });
        else out.push(Object.assign({ entityId: keys[i] }, val));
      }
    }

    // Also inspect entities directly for .speechBubble / .bubble / .emote
    entitiesById.forEach(function (ent, id) {
      const directText = ent.speechBubble || ent.bubble || ent.barkText;
      const directEmote = ent.emote;
      if (directText || directEmote) {
        const already = out.some(function (b) {
          return (b.entityId || b.npcId || b.id) === id;
        });
        if (!already) {
          out.push({
            entityId: id,
            text: typeof directText === 'string' ? directText : (directText && directText.text) || '',
            emote: directEmote || (directText && directText.emote) || ''
          });
        }
      }
    });

    return out.filter(function (b) {
      return (!b.room && !b.roomId) || (b.room || b.roomId) === room.id;
    });
  }

  function breakWordToFit(ctx, word, maxWidth) {
    if (ctx.measureText(word).width <= maxWidth) return [word];

    const hyphenParts = [];
    let start = 0;
    for (let k = 0; k < word.length; k++) {
      if (word[k] === '-' && k > start) {
        hyphenParts.push(word.slice(start, k + 1));
        start = k + 1;
      }
    }
    if (start < word.length) hyphenParts.push(word.slice(start));

    const pieces = [];
    let buf = '';
    for (let i = 0; i < hyphenParts.length; i++) {
      const part = hyphenParts[i];
      if (buf && ctx.measureText(buf + part).width <= maxWidth) {
        buf += part;
      } else {
        if (buf) {
          pieces.push(buf);
          buf = '';
        }
        if (ctx.measureText(part).width <= maxWidth) {
          buf = part;
        } else {
          let charBuf = '';
          const chars = Array.from(part);
          for (let c = 0; c < chars.length; c++) {
            const ch = chars[c];
            if (charBuf && ctx.measureText(charBuf + ch).width > maxWidth) {
              pieces.push(charBuf);
              charBuf = ch;
            } else {
              charBuf += ch;
            }
          }
          buf = charBuf;
        }
      }
    }
    if (buf) pieces.push(buf);
    return pieces;
  }

  function wrapBubbleText(ctx, text, maxWidth, firstLineIndentW) {
    const limitW = (typeof maxWidth === 'number' && maxWidth > 0) ? maxWidth : 216;
    const indentW = (typeof firstLineIndentW === 'number' && firstLineIndentW > 0)
      ? Math.min(firstLineIndentW, limitW * 0.65)
      : 0;
    const cleaned = stripBubbleEmojis(text);
    if (!cleaned) return [];

    const firstLimitW = Math.max(40, limitW - indentW);
    const rawWords = cleaned.split(/\s+/);
    const lines = [];
    let cur = '';

    for (let i = 0; i < rawWords.length; i++) {
      const word = rawWords[i];
      if (!word) continue;
      let activeLimit = lines.length === 0 ? firstLimitW : limitW;
      const candidate = cur ? (cur + ' ' + word) : word;
      if (ctx.measureText(candidate).width <= activeLimit) {
        cur = candidate;
        continue;
      }
      if (cur) {
        lines.push(cur);
        cur = '';
        activeLimit = lines.length === 0 ? firstLimitW : limitW;
      }
      if (ctx.measureText(word).width <= activeLimit) {
        cur = word;
      } else {
        let rem = word;
        while (rem) {
          const curLimit = lines.length === 0 ? firstLimitW : limitW;
          if (ctx.measureText(rem).width <= curLimit) {
            cur = rem;
            rem = '';
          } else {
            const parts = breakWordToFit(ctx, rem, curLimit);
            if (parts.length <= 1) {
              cur = parts[0] || rem;
              rem = '';
            } else {
              lines.push(parts[0]);
              rem = parts.slice(1).join('');
            }
          }
        }
      }
    }
    if (cur) lines.push(cur);
    return lines;
  }

  function drawSpeechBubblePath(ctx, bx, by, bw, bh, r, tailX, tipX, tipY) {
    const rr = Math.min(r, bw * 0.5, bh * 0.5);
    const tailHalf = 4;
    const tY = (typeof tipY === 'number') ? tipY : (by + bh + 6);
    ctx.beginPath();
    ctx.moveTo(bx + rr, by);
    ctx.lineTo(bx + bw - rr, by);
    ctx.quadraticCurveTo(bx + bw, by, bx + bw, by + rr);
    ctx.lineTo(bx + bw, by + bh - rr);
    ctx.quadraticCurveTo(bx + bw, by + bh, bx + bw - rr, by + bh);
    ctx.lineTo(tailX + tailHalf, by + bh);
    ctx.lineTo(tipX, tY);
    ctx.lineTo(tailX - tailHalf, by + bh);
    ctx.lineTo(bx + rr, by + bh);
    ctx.quadraticCurveTo(bx, by + bh, bx, by + bh - rr);
    ctx.lineTo(bx, by + rr);
    ctx.quadraticCurveTo(bx, by, bx + rr, by);
    ctx.closePath();
  }

  function rectsOverlapPad(ax, ay, aw, ah, bx, by, bw, bh, pad) {
    return ax < bx + bw + pad && ax + aw + pad > bx && ay < by + bh + pad && ay + ah + pad > by;
  }

  function resolveBubblePlacement(startBx, startBy, bw, bh, minBx, maxBx, minBy, maxBy, placedRects, maxPasses) {
    let bx = Math.round(clamp(startBx, minBx, maxBx));
    let by = Math.round(clamp(startBy, minBy, maxBy));
    for (let pass = 0; pass < maxPasses; pass++) {
      let collided = null;
      for (let p = 0; p < placedRects.length; p++) {
        const r = placedRects[p];
        if (rectsOverlapPad(bx, by, bw, bh, r.bx, r.by, r.bw, r.bh, 6)) {
          collided = r;
          break;
        }
      }
      if (!collided) break;
      const pushedY = Math.floor(collided.by - bh - 6);
      if (pushedY >= minBy) {
        by = pushedY;
      } else {
        const leftTry = Math.round(collided.bx - bw - 6);
        const rightTry = Math.round(collided.bx + collided.bw + 6);
        const canLeft = leftTry >= minBx && !placedRects.some(function (r) {
          return rectsOverlapPad(leftTry, by, bw, bh, r.bx, r.by, r.bw, r.bh, 6);
        });
        const canRight = rightTry <= maxBx && !placedRects.some(function (r) {
          return rectsOverlapPad(rightTry, by, bw, bh, r.bx, r.by, r.bw, r.bh, 6);
        });
        if (canLeft && (!canRight || Math.abs(leftTry - bx) <= Math.abs(rightTry - bx))) {
          bx = leftTry;
        } else if (canRight) {
          bx = rightTry;
        } else {
          by = minBy;
          break;
        }
      }
    }
    return {
      bx: Math.round(clamp(bx, minBx, maxBx)),
      by: Math.round(clamp(by, minBy, maxBy))
    };
  }

  function drawSpeechBubblesOverlay(ctx, room, renderState, entitiesById, nowSec, viewW, viewH, cam, entityMetaMap, occupiedPillRects) {
    if (!room) return;
    const state = renderState || {};
    let entMap = entitiesById;
    if (!entMap) {
      entMap = new Map();
      if (state.player && state.player.visible !== false) {
        const pRoom = state.player.room || state.player.roomId;
        if (!pRoom || pRoom === room.id) {
          entMap.set(state.player.id || state.player.charId || 'player', state.player);
          entMap.set('player', state.player);
        }
      }
      const rawNpcs = state.npcs
        ? (Array.isArray(state.npcs) ? state.npcs : Object.values(state.npcs))
        : [];
      for (let i = 0; i < rawNpcs.length; i++) {
        const n = rawNpcs[i];
        if (!n || n.visible === false || n.present === false) continue;
        const nRoom = n.room || n.roomId;
        if (nRoom && nRoom !== room.id) continue;
        entMap.set(n.id || n.charId || ('npc_' + i), n);
      }
    }
    const bubbles = collectSpeechBubbles(state, room, entMap);
    if (!bubbles.length) return;

    const activeCam = cam || cameraState;
    const vW = viewW || activeCam.viewW || 800;
    const vH = viewH || activeCam.viewH || 600;
    const zoom = activeCam.zoom || 1;
    const sx = activeCam.scaleRatioX || 1;
    const sy = activeCam.scaleRatioY || 1;
    const camX = (typeof activeCam.camX === 'number') ? activeCam.camX : 0;
    const camY = (typeof activeCam.camY === 'number') ? activeCam.camY : 0;
    const rawTx = vW * 0.5 - camX * zoom;
    const rawTy = vH * 0.5 - camY * zoom;
    const effTx = Math.round(rawTx * sx) / sx;
    const effTy = Math.round(rawTy * sy) / sy;
    const visMinX = -effTx / zoom;
    const visMaxX = (vW - effTx) / zoom;
    const visMinY = -effTy / zoom;
    const visMaxY = (vH - effTy) / zoom;
    const edgePad = 8 / zoom;

    const castById = (window.KLB && window.KLB.CAST_BY_ID) ? window.KLB.CAST_BY_ID : {};
    const rawItems = [];

    for (let i = 0; i < bubbles.length; i++) {
      const b = bubbles[i];
      const targetId = b.entityId || b.npcId || b.charId || b.targetId || b.id;
      const ent = targetId ? entMap.get(targetId) : null;
      if (!ent || ent.visible === false || ent.present === false) continue;
      const entRoom = ent.room || ent.roomId;
      if (entRoom && room && entRoom !== room.id) continue;
      const gx = Number(ent.x);
      const gy = Number(ent.y);
      if (!Number.isFinite(gx) || !Number.isFinite(gy)) continue;

      const meta = (targetId && entityMetaMap) ? entityMetaMap.get(targetId) : null;
      const anchorX = meta ? meta.anchorX : ((gx + 0.5) * TILE_W);
      const anchorY = meta ? meta.anchorY : ((gy + 0.86) * TILE_H);
      const baseHeadTop = meta
        ? (typeof meta.stableHeadTopY === 'number' ? meta.stableHeadTopY : meta.headTopY)
        : ((gy + 0.86) * TILE_H - 72);
      const midY = (baseHeadTop + anchorY) * 0.5;
      if (anchorX < visMinX + 4 || anchorX > visMaxX - 4 ||
          midY < visMinY + 4 || midY > visMaxY - 4 ||
          anchorY < visMinY || baseHeadTop > visMaxY) {
        continue;
      }

      const rawText = stripBubbleEmojis(b.text || b.message || '');
      const cleanEmote = (!rawText && b.emote) ? stripBubbleEmojis(b.emote) : '';
      const sourceText = rawText || cleanEmote;
      if (!sourceText) continue;

      const charId = (ent && (ent.charId || ent.id)) || targetId || '';
      const castInfo = charId ? (castById[charId] || null) : null;
      const accent = (castInfo && castInfo.waColor) || '#38bdf8';
      const headTopY = Math.round(baseHeadTop - 5);

      rawItems.push({
        b,
        targetId,
        anchorX,
        headTopY,
        sourceText,
        isEmoteOnly: !rawText && Boolean(cleanEmote),
        accent,
        clusterId: -1,
        clusterSize: 1,
        lines: [],
        bw: 92,
        bh: 30,
        bx: 0,
        by: 0
      });
    }
    if (!rawItems.length) return;

    // 1. Huddle clustering (Euclidean distance <= 160px)
    let nextClusterId = 0;
    for (let i = 0; i < rawItems.length; i++) {
      if (rawItems[i].clusterId >= 0) continue;
      const cid = nextClusterId++;
      const queue = [i];
      rawItems[i].clusterId = cid;
      const members = [];
      while (queue.length) {
        const idx = queue.shift();
        const cur = rawItems[idx];
        members.push(cur);
        for (let j = 0; j < rawItems.length; j++) {
          if (rawItems[j].clusterId >= 0) continue;
          const dist = Math.hypot(cur.anchorX - rawItems[j].anchorX, cur.headTopY - rawItems[j].headTopY);
          if (dist <= 160) {
            rawItems[j].clusterId = cid;
            queue.push(j);
          }
        }
      }
      for (let m = 0; m < members.length; m++) {
        members[m].clusterSize = members.length;
      }
    }

    // 2. Measure & wrap text cleanly (maxWidth = 216, max 3 lines, zero speaker name prefix inside bubbles)
    const visSpanW = (visMaxX - visMinX) - edgePad * 2;
    const wrapMaxW = visSpanW > 64 ? Math.min(216, Math.floor(visSpanW - 24)) : 216;
    ctx.save();
    ctx.font = '400 11px "Segoe UI", system-ui, -apple-system, sans-serif';
    for (let i = 0; i < rawItems.length; i++) {
      const it = rawItems[i];
      it.lines = wrapBubbleText(ctx, it.sourceText, wrapMaxW, 0);
      if (it.lines.length > 3) it.lines = it.lines.slice(0, 3);
      if (!it.lines.length) continue;

      let maxRenderedLineWidth = 0;
      for (let l = 0; l < it.lines.length; l++) {
        const w = ctx.measureText(it.lines[l]).width;
        if (w > maxRenderedLineWidth) maxRenderedLineWidth = w;
      }
      it.bw = Math.max(92, Math.ceil(maxRenderedLineWidth) + 24);
      it.bh = it.lines.length * 14 + 16;

      const minBx = visMinX + edgePad;
      const maxBx = Math.max(minBx, visMaxX - edgePad - it.bw);
      it.bx = Math.round(clamp(it.anchorX - it.bw * 0.5, minBx, maxBx));
    }
    ctx.restore();

    // 3. Front-to-back vertical stack de-overlap (only against other simultaneous speech bubbles)
    const validItems = rawItems.filter(function (it) { return it.lines.length > 0; });
    validItems.sort(function (a, b) {
      if (Math.abs(b.headTopY - a.headTopY) > 2) return b.headTopY - a.headTopY;
      return String(a.targetId).localeCompare(String(b.targetId));
    });

    // Speech bubbles intentionally sit above and overlap lab status pills/bars
    // (Pass 5) so they remain rock-steady instead of jumping when bars update.
    const placedRects = [];
    const placedBubbleStartIdx = 0;

    for (let i = 0; i < validItems.length; i++) {
      const it = validItems[i];
      const minBx = visMinX + edgePad;
      const maxBx = Math.max(minBx, visMaxX - edgePad - it.bw);
      const minBy = visMinY + edgePad;
      const maxBy = Math.max(minBy, visMaxY - edgePad - it.bh - 7);

      const origBy = Math.round(clamp(it.headTopY - it.bh - 7, minBy, maxBy));
      const placed = resolveBubblePlacement(it.bx, origBy, it.bw, it.bh, minBx, maxBx, minBy, maxBy, placedRects, 14);
      it.bx = placed.bx;
      it.by = Math.round(clamp(placed.by, minBy, maxBy));
      placedRects.push({ bx: it.bx, by: it.by, bw: it.bw, bh: it.bh });
    }

    // 4. Draw bubbles back-to-front (topmost stacked first so lower tails stay clean)
    for (let i = validItems.length - 1; i >= 0; i--) {
      const it = validItems[i];
      const bx = it.bx;
      const by = it.by;
      const bw = it.bw;
      const bh = it.bh;
      const tailX = clamp(it.anchorX, bx + 12, bx + bw - 12);
      const tipX = clamp(it.anchorX, bx + 10, bx + bw - 10);
      let tipY = clamp(it.headTopY - 2, by + bh + 6, by + bh + 11);
      // Prevent tail tip from piercing a bubble stacked below
      for (let p = placedBubbleStartIdx; p < placedRects.length; p++) {
        const r = placedRects[p];
        if (r.bx === bx && r.by === by) continue;
        if (r.by >= by + bh && r.by < tipY + 2 && tipX >= r.bx - 2 && tipX <= r.bx + r.bw + 2) {
          tipY = by + bh + 5;
        }
      }

      ctx.save();
      drawSpeechBubblePath(ctx, bx, by, bw, bh, 8, tailX, tipX, tipY);
      ctx.shadowColor = 'rgba(2, 6, 23, 0.55)';
      ctx.shadowBlur = 12;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 4;
      ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
      ctx.fill();

      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
      ctx.strokeStyle = it.clusterSize >= 2 ? it.accent : 'rgba(148, 163, 184, 0.35)';
      ctx.lineWidth = it.clusterSize >= 2 ? 1.15 : 1;
      ctx.stroke();

      ctx.font = '400 11px "Segoe UI", system-ui, -apple-system, sans-serif';
      ctx.fillStyle = '#f8fafc';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      for (let l = 0; l < it.lines.length; l++) {
        const ly = by + 15 + l * 14;
        ctx.fillText(it.lines[l], bx + 12, ly);
      }
      ctx.restore();
    }
  }

  // ============================================================================
  // FLOOR SUNBEAMS, FOOTSTEPS, CLICK RIPPLES, AMBIENT LIGHTING & TIME GRADE
  // ============================================================================
  function collectRoomWindowBays(room) {
    if (!isAboveGroundWindowRoom(room)) return [];
    if (room && room.id) {
      const sig = roomSignature(room);
      const cached = windowBayCache.get(room.id);
      if (cached && cached.sig === sig && cached.tilesRef === room.tiles && cached.objectsRef === room.objects) {
        return cached.bays;
      }
    }
    const bays = [];
    for (let gy = 0; gy < room.h; gy++) {
      for (let gx = 0; gx < room.w; gx++) {
        const t = getTileSafe(room, gx, gy);
        if (!isWallLike(t)) continue;
        const tN = getTileSafe(room, gx, gy - 1);
        const tS = getTileSafe(room, gx, gy + 1);
        const tW = getTileSafe(room, gx - 1, gy);
        const tE = getTileSafe(room, gx + 1, gy);
        if (isExteriorNorthWindowTile(room, gx, gy, tS, tN)) {
          bays.push({ side: 'N', gx, gy });
        } else if (isWallLike(tS) && isExteriorWestWindowTile(room, gx, gy, tW, tE)) {
          bays.push({ side: 'W', gx, gy });
        }
      }
    }
    if (room && room.id) {
      windowBayCache.set(room.id, {
        sig: roomSignature(room),
        tilesRef: room.tiles,
        objectsRef: room.objects,
        bays
      });
    }
    return bays;
  }

  function drawFloorSunbeams(ctx, room, atmo) {
    if (!atmo || atmo.floorAlpha <= 0.01) return;
    const bays = collectRoomWindowBays(room);
    if (!bays.length) return;

    ctx.save();
    for (let i = 0; i < bays.length; i++) {
      const bay = bays[i];
      if (bay.side === 'N') {
        const sx = bay.gx * TILE_W + 6;
        const sy = (bay.gy + 1) * TILE_H;
        const w = TILE_W - 12;
        const dx = TILE_W * atmo.beamDx * 0.85;
        const dy = TILE_H * (1.8 + atmo.goldenFactor * 1.4);
        const grad = ctx.createLinearGradient(sx, sy, sx + dx, sy + dy);
        grad.addColorStop(0, 'rgba(' + atmo.beamRgb + ', ' + atmo.floorAlpha.toFixed(3) + ')');
        grad.addColorStop(1, 'rgba(' + atmo.beamRgb + ', 0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.lineTo(sx + w, sy);
        ctx.lineTo(sx + w + dx, sy + dy);
        ctx.lineTo(sx + dx, sy + dy);
        ctx.closePath();
        ctx.fill();
      } else {
        const sx = (bay.gx + 1) * TILE_W;
        const sy = bay.gy * TILE_H + 5;
        const h = TILE_H - 10;
        const dx = TILE_W * (1.9 + atmo.goldenFactor * 1.9);
        const dy = TILE_H * atmo.beamDy * 0.9;
        const grad = ctx.createLinearGradient(sx, sy, sx + dx, sy + dy);
        grad.addColorStop(0, 'rgba(' + atmo.beamRgb + ', ' + (atmo.floorAlpha * 1.1).toFixed(3) + ')');
        grad.addColorStop(1, 'rgba(' + atmo.beamRgb + ', 0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.lineTo(sx, sy + h);
        ctx.lineTo(sx + dx, sy + h + dy);
        ctx.lineTo(sx + dx, sy + dy);
        ctx.closePath();
        ctx.fill();
      }
    }
    ctx.restore();
  }

  function drawFootstepPuffsAndRipples(ctx, room, renderState, nowSec) {
    // 1. Prune and render footstep dust / vinyl scuffs
    for (let i = footstepPuffs.length - 1; i >= 0; i--) {
      const p = footstepPuffs[i];
      const age = nowSec - p.createdSec;
      if (age < 0 || age > 0.42) {
        footstepPuffs.splice(i, 1);
        continue;
      }
      if (p.roomId && p.roomId !== room.id) continue;
      const t = age / 0.42;
      const alpha = (1 - t) * 0.42;
      ctx.save();
      if (p.tileType === 1) {
        // Specular wet-lab vinyl scuff ripple
        ctx.strokeStyle = 'rgba(224, 242, 254, ' + alpha.toFixed(2) + ')';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.ellipse(p.x, p.y, 2.5 + t * 5.0, 1.4 + t * 2.2, 0, 0, Math.PI * 2);
        ctx.stroke();
      } else {
        // Soft dust mote puff on oak/carpet/terrazzo
        ctx.fillStyle = 'rgba(254, 243, 199, ' + alpha.toFixed(2) + ')';
        ctx.beginPath();
        ctx.arc(p.x, p.y - t * 4, 2.2 + t * 2.4, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    // 2. Prune and render click-to-walk target ripples
    for (let i = clickRipples.length - 1; i >= 0; i--) {
      const r = clickRipples[i];
      const age = nowSec - r.createdSec;
      if (age < 0 || age > 0.72) {
        clickRipples.splice(i, 1);
        continue;
      }
      const t = age / 0.72;
      const cx = (r.gx + 0.5) * TILE_W;
      const cy = (r.gy + 0.5) * TILE_H;
      const isInteract = r.kind === 'interact';
      const outerRgb = isInteract
        ? '251, 191, 36'
        : (r.kind === 'fixture' ? '56, 189, 248' : (r.kind === 'npc' ? '251, 191, 36' : '52, 211, 153'));
      const innerRgb = isInteract ? '52, 211, 153' : outerRgb;
      ctx.save();
      ctx.strokeStyle = 'rgba(' + outerRgb + ', ' + ((1 - t) * (isInteract ? 0.90 : 0.85)).toFixed(2) + ')';
      ctx.lineWidth = isInteract ? 2.2 : 2;
      ctx.beginPath();
      ctx.ellipse(cx, cy, 6 + t * 14, 3.5 + t * 8, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.strokeStyle = 'rgba(' + innerRgb + ', ' + ((1 - t) * (isInteract ? 0.78 : 0.55)).toFixed(2) + ')';
      ctx.lineWidth = isInteract ? 1.5 : 1.2;
      ctx.beginPath();
      ctx.ellipse(cx, cy, 3 + t * 7, 1.8 + t * 4, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    // 3. Continuous walkTarget concentric floor marker if player is moving there
    const wt = renderState.walkTarget;
    if (wt) {
      const wx = typeof wt.gx === 'number' ? wt.gx : wt.x;
      const wy = typeof wt.gy === 'number' ? wt.gy : wt.y;
      if (Number.isFinite(wx) && Number.isFinite(wy)) {
        const p = renderState.player;
        const dist = p ? Math.hypot(Number(p.x) - wx, Number(p.y) - wy) : 99;
        if (dist > 0.25) {
          const cx = (wx + 0.5) * TILE_W;
          const cy = (wy + 0.5) * TILE_H;
          const pulse = (nowSec * 1.5) % 1;
          ctx.save();
          ctx.strokeStyle = 'rgba(52, 211, 153, ' + (0.75 - pulse * 0.45).toFixed(2) + ')';
          ctx.lineWidth = 1.8;
          ctx.beginPath();
          ctx.ellipse(cx, cy, 8 + pulse * 10, 4.5 + pulse * 5.5, 0, 0, Math.PI * 2);
          ctx.stroke();
          ctx.fillStyle = 'rgba(52, 211, 153, 0.85)';
          ctx.beginPath();
          ctx.ellipse(cx, cy, 3.5, 2, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      }
    }
  }

  function drawAmbientAndSpecialEffects(ctx, room, renderState, nowSec, atmo) {
    const atm = atmo || getAtmosphereProfile(renderState.timeMins, renderState.weather);

    // 1. Floating Golden Shire Musical Notes from Lab Speakers when lotrPlaying!
    if (renderState.lotrPlaying && room.objects) {
      for (let i = 0; i < room.objects.length; i++) {
        const o = room.objects[i];
        if (o.type !== 'lab_speakers') continue;
        const baseX = (o.x + 0.5) * TILE_W;
        const baseY = o.y * TILE_H - 18;
        for (let n = 0; n < 3; n++) {
          const t = (nowSec * 0.55 + n * 0.33) % 1;
          const nx = baseX + Math.sin(nowSec * 2.5 + n * 2) * 12 + (n - 1) * 8;
          const ny = baseY - t * 34;
          const alpha = (1 - t) * 0.9;
          drawVectorMusicNote(ctx, nx, ny, n % 2 === 1, 'rgba(251, 191, 36, ' + alpha.toFixed(2) + ')');
        }
      }
    }

    // 1b. Soft drifting translucent pale-green thiol odour wisps rising above Cupboard 5 when thiolDirty!
    if (renderState.thiolDirty && room.id === 'klb_2f' && room.objects) {
      ctx.save();
      for (let i = 0; i < room.objects.length; i++) {
        const o = room.objects[i];
        if (o.type !== 'chem_cupboard') continue;
        if (!/cupboard\s+5/i.test(String(o.label || ''))) continue;
        const baseX = (o.x + o.w * 0.5) * TILE_W;
        const baseY = o.y * TILE_H - 22;
        const spanX = Math.max(24, o.w * TILE_W * 0.65);

        const auraPulse = 0.5 + 0.5 * Math.sin(nowSec * 2.2);
        const ag = ctx.createRadialGradient(baseX, baseY + 6, 4, baseX, baseY + 2, spanX * 0.85);
        ag.addColorStop(0, 'rgba(134, 239, 172, ' + (0.16 + 0.06 * auraPulse).toFixed(3) + ')');
        ag.addColorStop(1, 'rgba(134, 239, 172, 0)');
        ctx.fillStyle = ag;
        ctx.beginPath();
        ctx.arc(baseX, baseY + 2, spanX * 0.85, 0, Math.PI * 2);
        ctx.fill();

        for (let w = 0; w < 5; w++) {
          const t = (nowSec * 0.42 + w * 0.2) % 1;
          const xOff = (w - 2) * (spanX * 0.2);
          const sway = Math.sin(nowSec * 2.1 + w * 1.6) * 5.5;
          const wx = baseX + xOff + sway;
          const wy = baseY - t * 32;
          const fade = Math.sin(t * Math.PI);
          ctx.fillStyle = 'rgba(163, 230, 53, ' + (fade * 0.34).toFixed(3) + ')';
          ctx.beginPath();
          ctx.ellipse(wx, wy, 4.2 + t * 4.5, 2.6 + t * 2.4, Math.sin(nowSec + w) * 0.3, 0, Math.PI * 2);
          ctx.fill();

          ctx.strokeStyle = 'rgba(134, 239, 172, ' + (fade * 0.42).toFixed(3) + ')';
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.moveTo(wx - 1.5, wy + 5);
          ctx.quadraticCurveTo(wx + 3.5 * Math.sin(nowSec * 2.6 + w), wy, wx - 1, wy - 6);
          ctx.stroke();
        }
      }
      ctx.restore();
    }

    // 2. Warm Cozy Espresso Pendant Light Pools in Gordon's Café (brighter in the evening!)
    if (room.id === 'gordons_cafe' && room.objects) {
      const cafeAlpha = 0.14 + atm.nightFactor * 0.09 + atm.goldenFactor * 0.04;
      ctx.save();
      for (let i = 0; i < room.objects.length; i++) {
        const o = room.objects[i];
        if (o.type !== 'cafe_table' && o.type !== 'cafe_counter') continue;
        const lx = (o.x + o.w * 0.5) * TILE_W;
        const ly = (o.y + o.h * 0.5) * TILE_H - 8;
        const rg = ctx.createRadialGradient(lx, ly, 4, lx, ly, 64);
        rg.addColorStop(0, 'rgba(251, 191, 36, ' + cafeAlpha.toFixed(2) + ')');
        rg.addColorStop(1, 'rgba(251, 191, 36, 0)');
        ctx.fillStyle = rg;
        ctx.beginPath();
        ctx.arc(lx, ly, 64, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    // 3. Subtle cool-blue terminal screen glow pools at night in labs/offices
    if (atm.nightFactor > 0.25 && room.objects) {
      ctx.save();
      const monAlpha = 0.08 * atm.nightFactor;
      for (let i = 0; i < room.objects.length; i++) {
        const o = room.objects[i];
        if (o.type !== 'pc_terminal' && o.type !== 'writeup_desk') continue;
        const mx = (o.x + o.w * 0.5) * TILE_W;
        const my = o.y * TILE_H - 6;
        const rg = ctx.createRadialGradient(mx, my, 2, mx, my, 36);
        rg.addColorStop(0, 'rgba(56, 189, 248, ' + monAlpha.toFixed(3) + ')');
        rg.addColorStop(1, 'rgba(56, 189, 248, 0)');
        ctx.fillStyle = rg;
        ctx.beginPath();
        ctx.arc(mx, my, 36, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    // 4. Volumetric Air Shafts & Drifting Golden Dust Motes from Exterior Windows!
    if (atm.airAlpha > 0.015 || atm.dustAlpha > 0.02) {
      const bays = collectRoomWindowBays(room);
      if (bays.length) {
        ctx.save();
        for (let i = 0; i < bays.length; i++) {
          const bay = bays[i];
          const sx = bay.side === 'N' ? (bay.gx * TILE_W + 6) : ((bay.gx + 1) * TILE_W - 2);
          const sy = bay.side === 'N' ? (bay.gy * TILE_H + 14) : (bay.gy * TILE_H + 6);
          const spanW = bay.side === 'N' ? (TILE_W - 12) : 14;
          const dx = TILE_W * (bay.side === 'W' ? (1.8 + atm.goldenFactor * 1.7) : atm.beamDx * 0.8);
          const dy = TILE_H * (bay.side === 'N' ? (1.6 + atm.goldenFactor * 1.1) : atm.beamDy * 0.8);

          if (atm.airAlpha > 0.015) {
            const ag = ctx.createLinearGradient(sx, sy, sx + dx, sy + dy);
            ag.addColorStop(0, 'rgba(' + atm.beamRgb + ', ' + atm.airAlpha.toFixed(3) + ')');
            ag.addColorStop(1, 'rgba(' + atm.beamRgb + ', 0)');
            ctx.fillStyle = ag;
            ctx.beginPath();
            ctx.moveTo(sx, sy);
            ctx.lineTo(sx + spanW, sy);
            ctx.lineTo(sx + spanW + dx, sy + dy);
            ctx.lineTo(sx + dx, sy + dy);
            ctx.closePath();
            ctx.fill();
          }

          if (atm.dustAlpha > 0.02 && i % 2 === 0) {
            for (let d = 0; d < 3; d++) {
              const u = hash2D(bay.gx + d * 7, bay.gy + d * 11, 701);
              const v = hash2D(bay.gx + d * 13, bay.gy + d * 5, 709);
              const mx = sx + u * dx + Math.sin(nowSec * 0.9 + d * 2.1 + bay.gx) * 6;
              const my = sy + v * dy + Math.cos(nowSec * 0.7 + d * 1.7 + bay.gy) * 4;
              const twinkle = 0.45 + 0.55 * Math.sin(nowSec * 2.2 + d * 2.5 + i);
              ctx.fillStyle = 'rgba(254, 240, 138, ' + (atm.dustAlpha * twinkle).toFixed(2) + ')';
              ctx.beginPath();
              ctx.arc(mx, my, 1.35, 0, Math.PI * 2);
              ctx.fill();
            }
          }
        }
        ctx.restore();
      }
    }
  }

  function drawViewportTintOverlay(ctx, viewW, viewH, room, renderState, nowSec, atmo) {
    const atm = atmo || getAtmosphereProfile(renderState.timeMins, renderState.weather);
    const hour = atm.hour;
    const roomId = room && room.id;

    if (!isAboveGroundWindowRoom(roomId)) {
      // Underground / windowless facilities (CIB LG11 MS, CIB LG1b NMR, interior seminar room):
      // steady super-faint cool lab fluorescent ambiance — NEVER sunset-orange or twilight-indigo!
      ctx.fillStyle = 'rgba(148, 197, 255, 0.03)';
      ctx.fillRect(0, 0, viewW, viewH);
    } else {
      // 1. Subtle time-of-day grade (above-ground windowed rooms only)
      let tint = null;
      if (atm.goldenFactor > 0.05 && !atm.isRain) {
        const alpha = (0.085 * atm.goldenFactor + (roomId === 'gordons_cafe' ? 0.025 : 0)).toFixed(3);
        tint = 'rgba(245, 158, 11, ' + alpha + ')';
      } else if (roomId === 'gordons_cafe') {
        tint = 'rgba(245, 158, 11, 0.05)';
      } else if (hour >= 20.5 || hour < 6.5) {
        tint = 'rgba(15, 23, 42, 0.16)'; // Late-night fluorescent lab shift
      } else if (hour >= 18.45 && hour < 20.5) {
        tint = 'rgba(99, 102, 241, 0.07)'; // Bloomsbury twilight
      }

      if (tint) {
        ctx.fillStyle = tint;
        ctx.fillRect(0, 0, viewW, viewH);
      }

      // 2. Weather atmosphere overlay (rain slate / cold_230 frost / heatwave warm golden-amber)
      if (atm.isRain) {
        ctx.fillStyle = 'rgba(71, 85, 105, 0.11)'; // Cosy Bloomsbury rain slate
        ctx.fillRect(0, 0, viewW, viewH);
      } else if (atm.isCold && (roomId === 'klb_2f' || roomId === 'klb_3f')) {
        ctx.fillStyle = 'rgba(147, 197, 253, 0.08)'; // Lab 230 16.3 °C crisp cool frost tint
        ctx.fillRect(0, 0, viewW, viewH);
      } else if (atm.isHeatwave) {
        ctx.fillStyle = 'rgba(251, 146, 60, 0.07)'; // 30.1 °C heatwave warm golden-amber shimmer
        ctx.fillRect(0, 0, viewW, viewH);
      }
    }

    // Emergency Red Strobe Wash when Fire Alarm is Active!
    if (renderState.fireAlarmActive) {
      const pulse = 0.06 + 0.10 * (0.5 + 0.5 * Math.sin(nowSec * 14));
      ctx.fillStyle = 'rgba(239, 68, 68, ' + pulse.toFixed(3) + ')';
      ctx.fillRect(0, 0, viewW, viewH);
    }
  }

  function drawPausedOverlay(ctx, viewW, viewH) {
    const label = 'PAUSED — Press Space to Resume';
    ctx.save();
    ctx.font = '600 11.5px "Segoe UI", system-ui, -apple-system, sans-serif';
    const tw = ctx.measureText(label).width;
    const pillH = 28;
    const pillW = Math.ceil(tw + 40);
    const px = Math.max(8, Math.round(viewW - 14 - pillW));
    const py = 14;

    ctx.shadowColor = 'rgba(2, 6, 23, 0.45)';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 3;
    fillRoundRect(ctx, px, py, pillW, pillH, 14, 'rgba(15, 23, 42, 0.86)', 'rgba(148, 163, 184, 0.35)', 1);

    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;

    // Subtle two-bar vector pause icon
    const barY = py + (pillH - 10) * 0.5;
    ctx.fillStyle = '#fbbf24';
    ctx.fillRect(px + 12, barY, 2.5, 10);
    ctx.fillRect(px + 17.5, barY, 2.5, 10);

    ctx.fillStyle = '#f1f5f9';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(label, px + 28, py + pillH * 0.5 + 0.5);
    ctx.restore();
  }

  // ============================================================================
  // CAMERA SMOOTHING, CLAMPING & SCREEN-TO-GRID COORDINATE MAPPING
  // ============================================================================
  const cameraState = {
    roomId: null,
    camX: 0,
    camY: 0,
    zoom: 1.0,
    viewW: 800,
    viewH: 600,
    scaleRatioX: 1,
    scaleRatioY: 1,
    lastRoom: null,
    lastRenderState: null
  };

  function resolveRoomObject(roomOrId) {
    if (!roomOrId) {
      return (window.KLB && window.KLB.WORLD_MAPS && window.KLB.WORLD_MAPS.rooms)
        ? window.KLB.WORLD_MAPS.rooms.klb_2f
        : null;
    }
    if (typeof roomOrId === 'string') {
      return (window.KLB && window.KLB.WORLD_MAPS && window.KLB.WORLD_MAPS.rooms)
        ? (window.KLB.WORLD_MAPS.rooms[roomOrId] || null)
        : null;
    }
    return roomOrId;
  }

  function resolveEffectiveCameraZoom(room, bounds, renderState, viewW, viewH) {
    const rawZoom = (renderState && renderState.cameraZoom !== undefined)
      ? Number(renderState.cameraZoom)
      : 1.0;
    const baseZoom = clamp(rawZoom || 1.0, 0.75, 1.5);
    if (baseZoom === 1 && room && (room.id === 'klb_3f' || room.id === 'meeting_room')) {
      const roomB = bounds || computeRoomBounds(room);
      const rawH = roomB.pxMaxY - roomB.pxMinY;
      const vW = viewW || 800;
      const vH = viewH || 600;
      if (vW >= 680 && vH >= (rawH + 64) * 1.22) {
        return 1.22;
      }
    }
    return baseZoom;
  }

  function updateCamera(room, bounds, renderState, viewW, viewH, dt) {
    const zoom = resolveEffectiveCameraZoom(room, bounds, renderState, viewW, viewH);
    const halfWorldW = (viewW * 0.5) / zoom;
    const halfWorldH = (viewH * 0.5) / zoom;

    const isTinyRoom = Boolean(room && (room.id === 'klb_3f' || room.id === 'meeting_room'));
    const isCompactRoom = Boolean(room && (
      room.id === 'gordons_cafe' ||
      room.id === 'cib_lg11_ms' ||
      room.id === 'cib_lg1b_nmr' ||
      (room.id && room.id.indexOf('cib_') === 0)
    ));
    const padX = isTinyRoom ? (TILE_W * 0.75) : (isCompactRoom ? (TILE_W * 0.9) : (TILE_W * 1.5));
    const padTop = isTinyRoom ? (TILE_H * 0.45) : (isCompactRoom ? (TILE_H * 0.55) : (TILE_H * 1.2 + WALL_H));
    const padBot = isTinyRoom ? (TILE_H * 0.85) : (isCompactRoom ? (TILE_H * 0.90) : (TILE_H * 2.2));

    const minWorldX = bounds.pxMinX - padX;
    const maxWorldX = bounds.pxMaxX + padX;
    const minWorldY = bounds.pxMinY - padTop;
    const maxWorldY = bounds.pxMaxY + padBot;

    const spanW = maxWorldX - minWorldX;
    const spanH = maxWorldY - minWorldY;

    let targetX = (minWorldX + maxWorldX) * 0.5;
    let targetY = (minWorldY + maxWorldY) * 0.5;

    if (renderState.cameraTarget &&
        Number.isFinite(renderState.cameraTarget.x) &&
        Number.isFinite(renderState.cameraTarget.y)) {
      targetX = (renderState.cameraTarget.x + 0.5) * TILE_W;
      targetY = (renderState.cameraTarget.y + 0.5) * TILE_H - 10;
    } else if (renderState.player &&
               Number.isFinite(renderState.player.x) &&
               Number.isFinite(renderState.player.y)) {
      targetX = (renderState.player.x + 0.5) * TILE_W;
      targetY = (renderState.player.y + 0.5) * TILE_H - 10;
    }

    // Clamp to occupied room bounds (or center cleanly when room fits inside viewport!)
    if (spanW <= halfWorldW * 2) {
      targetX = (minWorldX + maxWorldX) * 0.5;
    } else {
      targetX = clamp(targetX, minWorldX + halfWorldW, maxWorldX - halfWorldW);
    }

    if (spanH <= halfWorldH * 2) {
      targetY = (minWorldY + maxWorldY) * 0.5;
    } else {
      targetY = clamp(targetY, minWorldY + halfWorldH, maxWorldY - halfWorldH);
    }

    if (cameraState.roomId !== room.id || renderState.snapCamera ||
        !Number.isFinite(cameraState.camX) || !Number.isFinite(cameraState.camY)) {
      cameraState.roomId = room.id;
      cameraState.camX = targetX;
      cameraState.camY = targetY;
    } else {
      const alpha = 1 - Math.exp(-(dt || 1 / 60) * 12);
      cameraState.camX += (targetX - cameraState.camX) * alpha;
      cameraState.camY += (targetY - cameraState.camY) * alpha;
      if (Math.abs(targetX - cameraState.camX) < 0.1) cameraState.camX = targetX;
      if (Math.abs(targetY - cameraState.camY) < 0.1) cameraState.camY = targetY;
    }

    cameraState.zoom = zoom;
    cameraState.viewW = viewW;
    cameraState.viewH = viewH;
    cameraState.lastRoom = room;
    return cameraState;
  }

  function resolveWorldHit(roomOrId, worldX, worldY, optionalRenderState) {
    const effState = optionalRenderState || cameraState.lastRenderState || null;
    const room = resolveRoomObject(roomOrId) ||
      (effState && resolveRoomObject(effState.room || effState.roomId)) ||
      cameraState.lastRoom;

    const fx = worldX / TILE_W;
    const fy = worldY / TILE_H;
    const gx = Math.floor(fx);
    const gy = Math.floor(fy);

    // 1. Check live NPC hitboxes ([anchorX - 18 .. +18, anchorY - 68 .. +4]) front-to-back
    let hitNpc = null;
    const rawNpcs = effState && effState.npcs
      ? (Array.isArray(effState.npcs) ? effState.npcs : Object.values(effState.npcs))
      : [];
    let bestNpcY = -Infinity;
    for (let i = 0; i < rawNpcs.length; i++) {
      const npc = rawNpcs[i];
      if (!npc || npc.visible === false || npc.present === false) continue;
      if (room && (npc.room || npc.roomId) && (npc.room || npc.roomId) !== room.id) continue;
      const nx = Number(npc.x);
      const ny = Number(npc.y);
      if (!Number.isFinite(nx) || !Number.isFinite(ny)) continue;
      const anchorX = (nx + 0.5) * TILE_W;
      const anchorY = (ny + 0.86) * TILE_H;
      if (worldX >= anchorX - 18 && worldX <= anchorX + 18 &&
          worldY >= anchorY - 68 && worldY <= anchorY + 4) {
        if (anchorY >= bestNpcY) {
          bestNpcY = anchorY;
          hitNpc = npc;
        }
      }
    }

    // 2. Check 3D elevated fixture bounds INCLUDING parent surface surfZ (clamping north spillover over row y-1 fixtures)
    let hitObj = null;
    if (room && Array.isArray(room.objects)) {
      const surfMap = computeSurfaceParentMap(room).surfaceParentMap;
      let bestPriority = -Infinity;
      for (let i = 0; i < room.objects.length; i++) {
        const o = room.objects[i];
        if (o.type === 'npc_marker') continue;
        const parentSurf = surfMap.get(o.id);
        const surfZ = getSurfaceZ(parentSurf);
        const ox0 = o.x * TILE_W;
        const ox1 = (o.x + o.w) * TILE_W;
        const rise = FLOOR_DECAL_TYPES.has(o.type) ? 0 : (FIXTURE_RISE[o.type] || 16);
        let oy0 = o.y * TILE_H - rise - surfZ;

        // Prevent elevated/stacked fixtures (e.g. obj_nmr_pc at 12,6) from stealing clicks inside row y-1 (e.g. obj_nmr_fridge at 12,5)
        let hasNorthFixture = false;
        for (let j = 0; j < room.objects.length; j++) {
          const other = room.objects[j];
          if (!other || other === o || other.type === 'npc_marker' || SURFACE_TYPES.has(other.type)) continue;
          const xOverlap = Math.min(o.x + o.w, other.x + other.w) - Math.max(o.x, other.x);
          if (xOverlap > 0 && o.y - 1 >= other.y && o.y - 1 < other.y + other.h) {
            hasNorthFixture = true;
            break;
          }
        }
        if (hasNorthFixture) {
          const maxTopY = o.y * TILE_H - Math.min(14, rise);
          if (oy0 < maxTopY) oy0 = maxTopY;
        }

        const oy1 = (o.y + o.h) * TILE_H;
        if (worldX >= ox0 && worldX <= ox1 && worldY >= oy0 && worldY <= oy1) {
          const exactTileHit = gx >= o.x && gx < o.x + o.w && gy >= o.y && gy < o.y + o.h;
          const prio = (exactTileHit ? 1000 : 0) + (o.y + o.h) * 10 + (SURFACE_TYPES.has(o.type) ? 0 : 5) + (surfZ > 0 ? 3 : 0);
          if (prio >= bestPriority) {
            bestPriority = prio;
            hitObj = o;
          }
        }
      }
    }

    const inBounds = room ? (gx >= 0 && gy >= 0 && gx < room.w && gy < room.h) : true;
    return {
      gx,
      gy,
      x: gx,
      y: gy,
      fx,
      fy,
      worldX,
      worldY,
      inBounds,
      obj: hitObj,
      objId: hitObj ? hitObj.id : null,
      npc: hitNpc,
      npcId: hitNpc ? (hitNpc.id || hitNpc.charId || null) : null
    };
  }

  function resolveTileClick(roomOrCanvas, x, y, optionalRenderState) {
    if (roomOrCanvas && typeof roomOrCanvas.getBoundingClientRect === 'function') {
      return screenToGrid(roomOrCanvas, x, y, optionalRenderState);
    }
    if (typeof roomOrCanvas === 'number' && typeof x === 'number') {
      const stateArg = (y && typeof y === 'object') ? y : optionalRenderState;
      return resolveWorldHit(null, roomOrCanvas, x, stateArg);
    }
    return resolveWorldHit(roomOrCanvas, Number(x) || 0, Number(y) || 0, optionalRenderState);
  }

  function screenToGrid(canvas, clientX, clientY, optionalRenderState) {
    if (!canvas || typeof canvas.getBoundingClientRect !== 'function') {
      return { gx: 0, gy: 0, x: 0, y: 0, fx: 0, fy: 0, worldX: 0, worldY: 0, inBounds: false, obj: null, objId: null, npc: null, npcId: null };
    }
    const rect = canvas.getBoundingClientRect();
    const localX = clientX - rect.left;
    const localY = clientY - rect.top;

    const viewW = rect.width || cameraState.viewW || canvas.width || 800;
    const viewH = rect.height || cameraState.viewH || canvas.height || 600;
    const effState = optionalRenderState || cameraState.lastRenderState || null;
    const room = (effState && resolveRoomObject(effState.room || effState.roomId)) ||
      cameraState.lastRoom;
    const zoom = effState
      ? resolveEffectiveCameraZoom(room, null, effState, viewW, viewH)
      : (cameraState.zoom || 1.0);

    const worldX = (localX - viewW * 0.5) / zoom + cameraState.camX;
    const worldY = (localY - viewH * 0.5) / zoom + cameraState.camY;

    return resolveWorldHit(room, worldX, worldY, effState);
  }

  function worldToScreen(gx, gy, zPx) {
    const wx = gx * TILE_W;
    const wy = gy * TILE_H - (zPx || 0);
    return {
      x: (wx - cameraState.camX) * cameraState.zoom + cameraState.viewW * 0.5,
      y: (wy - cameraState.camY) * cameraState.zoom + cameraState.viewH * 0.5
    };
  }

  function ensureCanvasPointerTracker(canvas) {
    if (!canvas || typeof canvas.addEventListener !== 'function') return null;
    if (canvasTrackerMap.has(canvas)) return canvasTrackerMap.get(canvas);
    const tracker = {
      active: false,
      clientX: 0,
      clientY: 0,
      hoveredObjId: null,
      hoveredNpcId: null
    };
    canvas.addEventListener('mousemove', function (e) {
      tracker.active = true;
      tracker.clientX = e.clientX;
      tracker.clientY = e.clientY;
    }, { passive: true });
    canvas.addEventListener('mouseleave', function () {
      tracker.active = false;
      tracker.hoveredObjId = null;
      tracker.hoveredNpcId = null;
    }, { passive: true });
    canvasTrackerMap.set(canvas, tracker);
    return tracker;
  }

  // ============================================================================
  // MASTER FRAME RENDERER (TRUE POKÉMON Y-SORTED OCCLUSION!)
  // ============================================================================
  function renderScene(canvasOrCtx, renderState) {
    preloadAllSprites();
    if (!canvasOrCtx) return;

    let ctx = null;
    let canvas = null;
    if (typeof canvasOrCtx.getContext === 'function') {
      canvas = canvasOrCtx;
      ctx = canvas.getContext('2d');
    } else if (canvasOrCtx.canvas) {
      ctx = canvasOrCtx;
      canvas = ctx.canvas;
    }
    if (!ctx || !canvas) return;

    const state = renderState || {};
    const room = resolveRoomObject(state.room || state.roomId);
    if (!room) return;

    // Dynamic HiDPI backing store resize whenever element CSS size or DPR changes!
    const dpr = (typeof window !== 'undefined' && window.devicePixelRatio) ? window.devicePixelRatio : 1;
    const cappedDpr = clamp(dpr, 1, 2.5);
    const hasCssSize = Number(canvas.clientWidth) > 0 && Number(canvas.clientHeight) > 0;
    const rectW = hasCssSize ? canvas.clientWidth : (canvas.width || 800);
    const rectH = hasCssSize ? canvas.clientHeight : (canvas.height || 600);
    let viewW = rectW;
    let viewH = rectH;
    let scaleRatioX = 1;
    let scaleRatioY = 1;

    if (hasCssSize) {
      const targetW = Math.max(1, Math.round(rectW * cappedDpr));
      const targetH = Math.max(1, Math.round(rectH * cappedDpr));
      if (canvas.width !== targetW || canvas.height !== targetH) {
        canvas.width = targetW;
        canvas.height = targetH;
      }
      scaleRatioX = canvas.width / rectW;
      scaleRatioY = canvas.height / rectH;
    } else if (rectW > 0 && rectH > 0) {
      scaleRatioX = canvas.width / rectW;
      scaleRatioY = canvas.height / rectH;
    }

    const nowSec = (typeof performance !== 'undefined' ? performance.now() : Date.now()) * 0.001;
    const dt = lastRenderSec > 0 ? clamp(nowSec - lastRenderSec, 0.001, 0.1) : (1 / 60);
    lastRenderSec = nowSec;

    const floorCached = getCachedFloorCanvas(room, cappedDpr);
    const cam = updateCamera(room, floorCached.bounds, state, viewW, viewH, dt);
    cam.scaleRatioX = scaleRatioX;
    cam.scaleRatioY = scaleRatioY;
    cameraState.scaleRatioX = scaleRatioX;
    cameraState.scaleRatioY = scaleRatioY;
    cameraState.lastRenderState = state;

    // Resolve passive mouse hover target without allocating a new renderState object
    const tracker = ensureCanvasPointerTracker(canvas);
    if (tracker && tracker.active) {
      const hov = screenToGrid(canvas, tracker.clientX, tracker.clientY, state);
      tracker.hoveredNpcId = hov.npcId;
      tracker.hoveredObjId = hov.npcId ? null : hov.objId;
      state._activeHoverNpcId = tracker.hoveredNpcId;
      state._activeHoverObjId = tracker.hoveredObjId;
    } else {
      state._activeHoverNpcId = null;
      state._activeHoverObjId = null;
    }

    const atmo = getAtmosphereProfile(state.timeMins, state.weather);

    ctx.save();
    ctx.setTransform(scaleRatioX, 0, 0, scaleRatioY, 0, 0);

    // ---- PASS 0: DEEP POKÉMON INDOOR VOID BACKGROUND ----
    const bgGrad = ctx.createRadialGradient(
      viewW * 0.5, viewH * 0.5, 40,
      viewW * 0.5, viewH * 0.5, Math.max(viewW, viewH) * 0.75
    );
    bgGrad.addColorStop(0, '#131c2e');
    bgGrad.addColorStop(1, '#090d16');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, viewW, viewH);

    // Apply 2.5D Camera Transform (snapped to physical device pixels!)
    ctx.save();
    const rawTx = viewW * 0.5 - cam.camX * cam.zoom;
    const rawTy = viewH * 0.5 - cam.camY * cam.zoom;
    const snapTx = Math.round(rawTx * scaleRatioX) / scaleRatioX;
    const snapTy = Math.round(rawTy * scaleRatioY) / scaleRatioY;
    ctx.translate(snapTx, snapTy);
    if (cam.zoom !== 1) ctx.scale(cam.zoom, cam.zoom);

    // ---- PASS 1: CROPPED HiDPI CACHED FLOOR TILES + AO + DECALS ----
    if (floorCached.canvas) {
      ctx.drawImage(
        floorCached.canvas,
        floorCached.originX,
        floorCached.originY,
        floorCached.spanW,
        floorCached.spanH
      );
    }

    // ---- PASS 1.5 & 1.6: FLOOR WINDOW SUNBEAMS, FOOTSTEP PUFFS & CLICK RIPPLES ----
    drawFloorSunbeams(ctx, room, atmo);
    drawFootstepPuffsAndRipples(ctx, room, state, nowSec);

    // Classify room objects: Surface vs Stacked Children vs Standalone 3D Fixtures
    const objects = room.objects || [];
    const { surfaceParentMap, stackedBySurfaceId } = computeSurfaceParentMap(room);

    // ---- PASS 2: SOFT SHAPED FURNITURE FLOOR DROP SHADOWS ----
    ctx.save();
    ctx.fillStyle = 'rgba(15, 23, 42, 0.17)';
    for (let i = 0; i < objects.length; i++) {
      const o = objects[i];
      if (FLOOR_DECAL_TYPES.has(o.type) || surfaceParentMap.has(o.id) ||
          o.type === 'projector' || o.type === 'specs_holder' || o.type === 'whiteboard') {
        continue;
      }
      const opx = o.x * TILE_W;
      const opy = o.y * TILE_H;
      const opw = o.w * TILE_W;
      const oph = o.h * TILE_H;
      if (o.type === 'cafe_table') {
        ctx.beginPath();
        ctx.ellipse(opx + opw * 0.5 + 2, opy + oph * 0.5 + 6, opw * 0.34, oph * 0.28, 0, 0, Math.PI * 2);
        ctx.fill();
      } else if (o.type === 'nmr_magnet') {
        ctx.beginPath();
        ctx.ellipse(opx + opw * 0.5 - 2, opy + oph * 0.5 + 8, opw * 0.40, oph * 0.32, 0, 0, Math.PI * 2);
        ctx.fill();
      } else if (o.type === 'spiral_stairs') {
        ctx.beginPath();
        ctx.ellipse(opx + opw * 0.5 + 2, opy + oph * 0.5 + 4, opw * 0.44, oph * 0.42, 0, 0, Math.PI * 2);
        ctx.fill();
      } else if (o.type === 'chair') {
        ctx.beginPath();
        ctx.ellipse(opx + TILE_W * 0.5 + 1, opy + TILE_H * 0.5 + 11, 12, 5.5, 0, 0, Math.PI * 2);
        ctx.fill();
      } else if (o.type === 'argon_cyl') {
        ctx.beginPath();
        ctx.ellipse(opx + TILE_W * 0.5 - 1, opy + TILE_H - 5, 11, 5, 0, 0, Math.PI * 2);
        ctx.fill();
      } else if (o.type === 'fire_ext') {
        ctx.beginPath();
        ctx.ellipse(opx + 19, opy + TILE_H - 6, 8, 4, 0, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillRect(opx + 3, opy + 3, opw - 2, oph - 1);
      }
    }
    ctx.restore();

    // ---- PASS 3: UNIFIED Y-SORTED 3D RENDER QUEUE (WALLS + FIXTURES + PLAYER + NPCS!) ----
    const renderQueue = [];

    // 3A. Push all non-floor wall/door/glass cells
    for (let y = 0; y < room.h; y++) {
      for (let x = 0; x < room.w; x++) {
        const t = getTileSafe(room, x, y);
        if (t >= 5 && t <= 8) {
          renderQueue.push({
            sortY: (y + 1) * TILE_H,
            order: 0,
            sortX: x * TILE_W,
            kind: 'wall',
            gx: x,
            gy: y,
            tileId: t
          });
        }
      }
    }

    // 3B. Push all 3D fixtures (with wall/chair/stacked Z-order corrections)
    for (let i = 0; i < objects.length; i++) {
      const o = objects[i];
      if (FLOOR_DECAL_TYPES.has(o.type)) continue;

      const parentSurf = surfaceParentMap.get(o.id);
      if (parentSurf) {
        if (parentSurf.type === 'fumehood') continue;
        const surfZ = getSurfaceZ(parentSurf);
        renderQueue.push({
          sortY: Math.max(parentSurf.y + parentSurf.h, o.y + o.h) * TILE_H,
          order: 2,
          sortX: o.x * TILE_W,
          kind: 'fixture',
          obj: o,
          children: null,
          zOffset: surfZ,
          chairPart: null
        });
      } else if (o.type === 'specs_holder') {
        renderQueue.push({
          sortY: (o.y + 0.35) * TILE_H,
          order: 1,
          sortX: o.x * TILE_W,
          kind: 'fixture',
          obj: o,
          children: null,
          zOffset: 0,
          chairPart: null
        });
      } else if (o.type === 'fire_ext') {
        renderQueue.push({
          sortY: (o.y + 0.82) * TILE_H,
          order: 1,
          sortX: o.x * TILE_W,
          kind: 'fixture',
          obj: o,
          children: null,
          zOffset: 0,
          chairPart: null
        });
      } else if (o.type === 'chair') {
        renderQueue.push({
          sortY: (o.y + 0.78) * TILE_H,
          order: 1,
          sortX: o.x * TILE_W,
          kind: 'fixture',
          obj: o,
          children: null,
          zOffset: 0,
          chairPart: o.dir === 'N' ? 'base' : 'all'
        });
        if (o.dir === 'N') {
          renderQueue.push({
            sortY: (o.y + 0.98) * TILE_H,
            order: 4,
            sortX: o.x * TILE_W,
            kind: 'chair_backrest',
            obj: o
          });
        }
      } else {
        renderQueue.push({
          sortY: (o.y + o.h) * TILE_H,
          order: 1,
          sortX: o.x * TILE_W,
          kind: 'fixture',
          obj: o,
          children: stackedBySurfaceId.get(o.id) || null,
          zOffset: 0,
          chairPart: null
        });
      }
    }

    // 3C. Push Player & Room NPCs into the exact same Y-Sorted Queue!
    const entitiesById = new Map();

    if (state.player && state.player.visible !== false) {
      const pRoom = state.player.room || state.player.roomId;
      if (!pRoom || pRoom === room.id) {
        const pid = state.player.id || state.player.charId || 'player';
        entitiesById.set(pid, state.player);
        entitiesById.set('player', state.player);
        renderQueue.push({
          sortY: (Number(state.player.y) + 0.86) * TILE_H,
          order: 3,
          sortX: Number(state.player.x) * TILE_W,
          kind: 'entity',
          entity: state.player,
          isPlayer: true
        });
      }
    }

    const rawNpcs = Array.isArray(state.npcs)
      ? state.npcs
      : (state.npcs && typeof state.npcs === 'object' ? Object.values(state.npcs) : []);

    for (let i = 0; i < rawNpcs.length; i++) {
      const npc = rawNpcs[i];
      if (!npc || npc.visible === false || npc.present === false) continue;
      const nRoom = npc.room || npc.roomId;
      if (nRoom && nRoom !== room.id) continue;
      if (!Number.isFinite(Number(npc.x)) || !Number.isFinite(Number(npc.y))) continue;

      const nid = npc.id || npc.charId || ('npc_' + i);
      entitiesById.set(nid, npc);
      renderQueue.push({
        sortY: (Number(npc.y) + 0.86) * TILE_H,
        order: 3,
        sortX: Number(npc.x) * TILE_W,
        kind: 'entity',
        entity: npc,
        isPlayer: false
      });
    }

    // Sort back-to-front by ground Y-anchor
    renderQueue.sort(function (a, b) {
      if (Math.abs(a.sortY - b.sortY) > 0.01) return a.sortY - b.sortY;
      if (a.order !== b.order) return a.order - b.order;
      return a.sortX - b.sortX;
    });

    const entityMetaMap = new Map();

    // Execute unified 2.5D painter's pass
    for (let i = 0; i < renderQueue.length; i++) {
      const item = renderQueue[i];
      if (item.kind === 'wall') {
        drawWallCell(ctx, room, item.gx, item.gy, item.tileId, Boolean(state.fireAlarmActive), nowSec, atmo);
      } else if (item.kind === 'fixture') {
        renderFixture(ctx, room, item.obj, item.children, item.zOffset, nowSec, state, dt, item.chairPart, false);
      } else if (item.kind === 'chair_backrest') {
        renderFixture(ctx, room, item.obj, null, 0, nowSec, state, dt, 'backrest', true);
      } else if (item.kind === 'entity') {
        drawCharacterEntity(ctx, item.entity, item.isPlayer, room, nowSec, state, entitiesById, entityMetaMap);
      }
    }

    // ---- PASS 4: WORLD-SPACE AMBIENT EFFECTS (LOTR NOTES, CAFÉ PENDANT GLOW, SUNSHAFTS & DUST) ----
    drawAmbientAndSpecialEffects(ctx, room, state, nowSec, atmo);

    // ---- PASS 5: FLOATING WORLD-SPACE UI (NAMEPLATES, REACTION BARS, [E] CURSOR, WAYFINDING, SPEECH BUBBLES) ----
    const occupiedPillRects = [];
    const nameplateRects = [];
    drawEntityNameplatesOverlay(ctx, room, state, entityMetaMap, viewW, viewH, cam, nameplateRects);
    drawReactionBarsOverlay(ctx, room, state, surfaceParentMap, nowSec, occupiedPillRects);
    drawNpcReactionBadgesOverlay(ctx, room, state.npcReactions, state, surfaceParentMap, nowSec, occupiedPillRects);
    drawPlayerActionBarOverlay(ctx, room, state, surfaceParentMap, nowSec, entityMetaMap, occupiedPillRects);
    drawInteractionHighlightOverlay(ctx, room, state, surfaceParentMap, nowSec, entitiesById, entityMetaMap, occupiedPillRects);
    for (let i = 0; i < nameplateRects.length; i++) occupiedPillRects.push(nameplateRects[i]);
    drawWayfindingOverlay(ctx, room, state, surfaceParentMap, nowSec, viewW, viewH, cam, occupiedPillRects);
    drawSpeechBubblesOverlay(ctx, room, state, entitiesById, nowSec, viewW, viewH, cam, entityMetaMap, occupiedPillRects);

    ctx.restore(); // End world camera transform

    // ---- PASS 6: SCREEN-SPACE TIME / WEATHER / FIRE-ALARM TINT & PAUSED PILL ----
    drawViewportTintOverlay(ctx, viewW, viewH, room, state, nowSec, atmo);
    if (state.paused && !state.modalOpen) {
      drawPausedOverlay(ctx, viewW, viewH);
    }

    ctx.restore();
  }

  // ============================================================================
  // PUBLIC API (Supports BOTH Singleton `KLB.Renderer25D.render(canvas, state)`
  // AND Constructor `new KLB.Renderer25D(canvas)`)
  // ============================================================================
  function Renderer25D(defaultCanvas) {
    if (!(this instanceof Renderer25D)) {
      return new Renderer25D(defaultCanvas);
    }
    this.canvas = defaultCanvas || null;
    preloadAllSprites();
  }

  Renderer25D.prototype.render = function (canvasOrState, maybeState) {
    if (maybeState !== undefined) {
      renderScene(canvasOrState, maybeState);
    } else {
      renderScene(this.canvas, canvasOrState);
    }
  };

  Renderer25D.prototype.screenToGrid = function (canvasOrX, xOrY, maybeY, maybeState) {
    if (typeof canvasOrX === 'number') {
      return screenToGrid(this.canvas, canvasOrX, xOrY, maybeY);
    }
    return screenToGrid(canvasOrX, xOrY, maybeY, maybeState);
  };

  Renderer25D.prototype.resolveTileClick = function (roomOrCanvas, x, y, maybeState) {
    if (typeof roomOrCanvas === 'number' && !maybeState && this.canvas) {
      return screenToGrid(this.canvas, roomOrCanvas, x, y);
    }
    return resolveTileClick(roomOrCanvas, x, y, maybeState);
  };

  Renderer25D.prototype.worldToScreen = worldToScreen;
  Renderer25D.prototype.preloadSprites = preloadAllSprites;
  Renderer25D.prototype.triggerClickRipple = triggerClickRipple;

  // Static properties & methods on window.KLB.Renderer25D
  Renderer25D.TILE_W = TILE_W;
  Renderer25D.TILE_H = TILE_H;
  Renderer25D.WALL_H = WALL_H;
  Renderer25D.ASSET_LABELS = ASSET_LABELS;
  Renderer25D.FIXTURE_RISE = FIXTURE_RISE;

  Renderer25D.init = function (canvas) {
    preloadAllSprites();
    if (canvas) Renderer25D._defaultCanvas = canvas;
    return Renderer25D;
  };

  Renderer25D.preloadSprites = preloadAllSprites;

  Renderer25D.render = function (canvasOrCtxOrState, maybeState) {
    if (maybeState === undefined && Renderer25D._defaultCanvas && canvasOrCtxOrState && !canvasOrCtxOrState.getContext && !canvasOrCtxOrState.canvas) {
      renderScene(Renderer25D._defaultCanvas, canvasOrCtxOrState);
    } else {
      renderScene(canvasOrCtxOrState, maybeState);
    }
  };

  Renderer25D.screenToGrid = function (canvas, clientX, clientY, optionalRenderState) {
    if (typeof canvas === 'number' && Renderer25D._defaultCanvas) {
      return screenToGrid(Renderer25D._defaultCanvas, canvas, clientX, clientY);
    }
    return screenToGrid(canvas, clientX, clientY, optionalRenderState);
  };

  Renderer25D.resolveTileClick = resolveTileClick;
  Renderer25D.worldToScreen = worldToScreen;
  Renderer25D.triggerClickRipple = triggerClickRipple;

  Renderer25D.getCameraState = function () {
    return Object.assign({}, cameraState);
  };

  Renderer25D.invalidateRoomCache = function (roomId) {
    if (roomId) {
      roomFloorCache.delete(roomId);
      windowBayCache.delete(roomId);
      surfaceParentCache.delete(roomId);
    } else {
      roomFloorCache.clear();
      windowBayCache.clear();
      surfaceParentCache.clear();
    }
  };

  Renderer25D.stripBubbleEmojis = stripBubbleEmojis;
  Renderer25D.wrapBubbleText = wrapBubbleText;
  Renderer25D.getActiveJobForObj = getActiveJobForObj;
  Renderer25D.drawReactionBarsOverlay = drawReactionBarsOverlay;
  Renderer25D.drawNpcReactionBadgesOverlay = drawNpcReactionBadgesOverlay;
  Renderer25D.drawPlayerActionBarOverlay = drawPlayerActionBarOverlay;
  Renderer25D.drawEntityLabel = drawEntityLabel;
  Renderer25D.drawEntityNameplatesOverlay = drawEntityNameplatesOverlay;
  Renderer25D.drawWayfindingOverlay = drawWayfindingOverlay;
  Renderer25D.drawSpeechBubblesOverlay = drawSpeechBubblesOverlay;

  window.KLB.Renderer25D = Renderer25D;
})();
