// KLB Simulator — Master Widescreen Controller, Real-Time 1x Clock, Sub-Tasks & Live Loading Bars
window.KLB = window.KLB || {};

(() => {
  let state = null;
  let archive = null;
  let selectedCharId = 'daniel_richards';
  let selectedMutator = 'none';
  let cameraZoom = 1.0;
  const keysDown = new Set();
  let lastFrameTs = performance.now();
  let dossierAnimTimer = 0;

  let modalDismissable = true;
  let modalEscapeHandler = null;
  let lastFocusedEl = null;
  let currentTab = 'whatsapp';
  let lastWaMsgId = null;
  let lastWaCount = 0;
  let unreadWaCount = 0;
  let lastLabBookSig = '';
  let lastArchiveSig = '';
  let lastTravelRoomSig = '';
  let lastTaskPanelSig = '';
  let lastReactionsSig = '';
  let lastPauseUiSig = '';
  let lastMuteUiSig = '';
  let lastSpecFollowSig = '';
  let lastAlertBannerSig = '';
  let lastHoverHintText = '';
  let lastDossierSpriteKey = '';
  let lastCanvasRenderTs = 0;
  let lastRenderModalPaused = false;
  let discardResetTimer = null;
  let stepSfxCooldown = 0;
  let bumpSfxCooldown = 0;
  let specSpeed = 1;
  let specFollowNpcId = null;
  let specCameraPos = null;
  let specDrag = null;
  let lastAutoSaveSimMins = -Infinity;
  let alexPursuitActive = false;

  const el = id => document.getElementById(id);
  const icon = (name, size = 14) => (window.KLB.Icons ? window.KLB.Icons.svg(name, size) : '');

  function hydrateIcons(root = document) {
    if (window.KLB.Icons && typeof window.KLB.Icons.hydrate === 'function') {
      window.KLB.Icons.hydrate(root);
    }
  }

  function escHtml(str) {
    return String(str == null ? '' : str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function clamp(v, lo, hi) {
    const num = Number(v);
    if (!Number.isFinite(num)) return lo;
    return Math.max(lo, Math.min(hi, num));
  }

  function addFavours(delta) {
    if (!state) return 0;
    const cur = Number(state.favours);
    const base = Number.isFinite(cur) ? cur : 0;
    const next = clamp(base + (Number(delta) || 0), 0, 6);
    state.favours = next;
    return next;
  }

  function getMonotonicSimMins(st = state) {
    if (!st) return 0;
    if (typeof st.totalElapsedMins === 'number' && Number.isFinite(st.totalElapsedMins)) {
      return st.totalElapsedMins;
    }
    const weekOffset = ((Number(st.weekNum) || 1) - 1) * 7 * 1440;
    return weekOffset + ((Number(st.dayIdx) || 0) * 1440) + (Number(st.timeMins) || 0);
  }

  function stripDiacritics(str) {
    return String(str || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  function hashSeedString(str) {
    let h = 2166136261 >>> 0;
    const s = String(str || '');
    for (let i = 0; i < s.length; i++) {
      h ^= s.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  }

  function deterministicShuffle(items, seedInput) {
    const arr = Array.isArray(items) ? items.slice() : [];
    let s = (typeof seedInput === 'number' ? seedInput : hashSeedString(seedInput)) >>> 0;
    if (s === 0) s = 0x9e3779b9;
    for (let i = arr.length - 1; i > 0; i--) {
      s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
      const j = s % (i + 1);
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function parseHintSpeakerAndBody(rawHint) {
    const raw = String(rawHint || '').trim();
    const m = raw.match(/^([A-Za-z\u00C0-\u00FF][A-Za-z\u00C0-\u00FF0-9' .-]{1,28}):\s*([\s\S]+)$/);
    if (!m) return { prefix: '', speakerId: null, speakerName: '', body: raw };
    const prefix = m[1].trim();
    const normPrefix = stripDiacritics(prefix).toLowerCase();
    const cast = window.KLB.CAST || [];
    const found = cast.find(c => {
      const shortN = stripDiacritics(c.shortName || '').toLowerCase();
      const fullN = stripDiacritics(c.name || '').toLowerCase();
      const firstN = fullN.split(/\s+/)[0] || '';
      const shortFirstN = shortN.split(/\s+/)[0] || '';
      return shortN === normPrefix
        || fullN === normPrefix
        || firstN === normPrefix
        || shortFirstN === normPrefix
        || (normPrefix === 'dan' && c.id === 'daniel_richards')
        || (normPrefix === 'jamie' && c.id === 'jamie_baker')
        || (normPrefix === 'vijay' && c.id === 'vijay_chudasama')
        || (normPrefix === 'kersti' && c.id === 'kersti_karu')
        || (normPrefix === 'abil' && c.id === 'abil_aliev');
    });
    return {
      prefix,
      speakerId: found ? found.id : null,
      speakerName: found ? (found.shortName || found.name) : prefix,
      body: m[2].trim()
    };
  }

  function getSupervisorMeta(st = state) {
    const pid = st?.player?.id || st?.charId || selectedCharId;
    const isArchie = pid === 'archie_wall';
    const base = isArchie
      ? { id: 'jamie_baker', shortName: 'Jamie', fullName: 'Prof. Jamie Baker', patienceLabel: 'Jamie Patience', chatName: 'KLBchat', askCmd: '/AskKLBchat', portrait: 'assets/portraits/jamie_baker.png' }
      : { id: 'vijay_chudasama', shortName: 'Vijay', fullName: 'Prof. Vijay Chudasama', patienceLabel: 'Vijay Patience', chatName: 'Big-Chuds', askCmd: '/AskBigChuds', portrait: 'assets/portraits/vijay_chudasama.png' };
    if (st?.spectatorMode) {
      return Object.assign({}, base, { chatName: 'KLBchat', askCmd: '/AskKLBchat' });
    }
    return base;
  }

  function getPlayableIds() {
    if (Array.isArray(window.KLB.PLAYABLE_IDS) && window.KLB.PLAYABLE_IDS.length) {
      return window.KLB.PLAYABLE_IDS.slice();
    }
    const fromCast = (window.KLB.CAST || []).filter(c => c.playable).map(c => c.id);
    if (fromCast.length) return fromCast;
    return (window.KLB.BIG_CHUDS_IDS || []).slice();
  }

  function getPlayableCast() {
    const byId = window.KLB.CAST_BY_ID || {};
    return getPlayableIds().map(id => byId[id]).filter(Boolean);
  }

  function syncZoomSelectUI() {
    const sel = el('select-zoom');
    if (!sel) return;
    const targetVal = cameraZoom === 'fit' ? 'fit' : String(cameraZoom);
    if (Array.from(sel.options).some(o => o.value === targetVal)) {
      sel.value = targetVal;
    }
  }

  function syncSupervisorChrome() {
    const sup = getSupervisorMeta();
    const isKlbChat = Boolean(sup.chatName === 'KLBchat');
    const patEl = el('lbl-patience-name');
    if (patEl) patEl.textContent = sup.patienceLabel;

    const waLbl = el('tab-lbl-whatsapp');
    if (waLbl) {
      waLbl.textContent = sup.chatName;
      waLbl.classList.toggle('klbchat-active', isKlbChat);
    }
    const waTabBtn = document.querySelector('.deck-tab[data-tab="whatsapp"]');
    if (waTabBtn) {
      waTabBtn.classList.toggle('klbchat-active', isKlbChat);
    }

    const waSel = el('select-wa-action');
    if (waSel) {
      waSel.setAttribute('aria-label', `${sup.chatName} WhatsApp Action`);
    }
    const askOpt = waSel?.querySelector('option[value="ask"]');
    if (askOpt) {
      askOpt.textContent = `${sup.askCmd} protocol hint (-10m)`;
    }
  }

  function findDeskChair(rm, deskObj) {
    if (!rm || !deskObj || (deskObj.type !== 'writeup_desk' && deskObj.type !== 'pc_terminal')) return null;
    const byDeskId = (rm.objects || []).find(o => o && o.type === 'chair' && o.deskId === deskObj.id);
    if (byDeskId) return byDeskId;
    if (deskObj.type === 'pc_terminal') {
      const parentDesk = (rm.objects || []).find(o =>
        o && o.type === 'writeup_desk' &&
        deskObj.x >= o.x && deskObj.x < o.x + (o.w || 1) &&
        deskObj.y >= o.y && deskObj.y < o.y + (o.h || 1)
      );
      if (parentDesk) {
        const byParent = (rm.objects || []).find(o => o && o.type === 'chair' && o.deskId === parentDesk.id);
        if (byParent) return byParent;
      }
    }
    const dw = deskObj.w || 1;
    const dh = deskObj.h || 1;
    return (rm.objects || []).find(o => {
      if (!o || o.type !== 'chair') return false;
      const adjX = o.x >= deskObj.x && o.x < deskObj.x + dw && (o.y === deskObj.y + dh || o.y === deskObj.y - 1);
      const adjY = o.y >= deskObj.y && o.y < deskObj.y + dh && (o.x === deskObj.x + dw || o.x === deskObj.x - 1);
      return adjX || adjY;
    }) || null;
  }

  function snapPlayerToDeskChair(obj) {
    const roomId = state?.player?.roomId;
    if (!state || !obj || (roomId !== 'klb_2f' && roomId !== 'klb_3f')) return;
    const rm = window.KLB.WORLD_MAPS?.rooms?.[roomId];
    const deskChair = findDeskChair(rm, obj);
    if (deskChair &&
        !window.KLB.Sim.isOccupiedByCharacter?.(state, roomId, deskChair.x, deskChair.y, state.player.id, 0.48) &&
        window.KLB.Sim.isCellWalkable(roomId, deskChair.x, deskChair.y, state.fireAlarm?.active)) {
      state.player.x = deskChair.x;
      state.player.y = deskChair.y;
      state.player.dir = deskChair.dir || state.player.dir;
    }
  }

  function resolveHintWhatsAppSender(rawHint, playerId) {
    const parsed = parseHintSpeakerAndBody(rawHint);
    const bigChuds = window.KLB.BIG_CHUDS_IDS || (window.KLB.CAST || []).filter(c => c.playable).map(c => c.id);
    let senderId = parsed.speakerId;
    if (playerId === 'archie_wall') {
      if (!senderId || !window.KLB.CAST_BY_ID?.[senderId] || senderId === playerId) {
        const klbPool = ['nafsika_forte', 'jamie_baker', 'marco_sabatini', 'charlotte_coomber'].concat(bigChuds);
        senderId = klbPool.find(id => id !== playerId && window.KLB.CAST_BY_ID?.[id]) || 'nafsika_forte';
      }
    } else if (!senderId || !bigChuds.includes(senderId) || senderId === playerId) {
      senderId = bigChuds.find(id => id !== playerId) || 'daniel_richards';
    }
    const meta = window.KLB.CAST_BY_ID?.[senderId];
    return {
      senderId,
      speakerName: parsed.speakerName || meta?.shortName || meta?.name || 'Lab Mate',
      body: parsed.body
    };
  }

  function isCupboardOneLabel(label) {
    return /\bcupboard\s+1\b(?!\d)/i.test(String(label || ''));
  }

  function matchesCupboardHint(cupboardLabel, hintText) {
    const label = String(cupboardLabel || '');
    const hint = String(hintText || '');
    const m = label.match(/\bcupboard\s+(\d+)\b(?!\d)/i);
    if (m) {
      const re = new RegExp(`\\bcupboard\\s+${m[1]}\\b(?!\\d)`, 'i');
      return re.test(hint);
    }
    return Boolean(label && hint.toLowerCase().includes(label.toLowerCase()));
  }

  const STATION_NICE_NAMES = {
    hood_1: 'Fume Hood',
    fumehood: 'Fume Hood',
    buchi: 'Büchi Rotavapor',
    rotovap: 'Rotary Evaporator',
    tcep_bench: 'TCEP / Bioconjugation Bench',
    lab_bench: 'Analytical Bench',
    biotage: 'Biotage Isolera',
    gel_tank: 'SDS-PAGE Gel Tank',
    heatblock: 'Heatblock',
    centrifuge: 'Centrifuge',
    coffee_station: 'Tea & Kettle Station',
    lcms_station: 'Kersti LC-MS',
    nmr_spectrometer: '600 MHz NMR Spectrometer',
    ms_bench: 'Orbitrap MS Bench',
    desk_main: 'Personal Desk',
    desk: 'Desk',
    lab_speakers: 'Lab Speakers',
    spiral_stairs: 'Spiral Stairs',
    exit_door: 'Exit Door',
    fire_exit_tile: 'Emergency Fire Exit',
    gordon_counter: "Gordon's Café Counter",
    first_aid_station: 'First Aid Station',
    coshh_station: 'COSHH Safety Point',
    fridge_4c: '4 °C Fridge',
    freezer_20c: '-20 °C Freezer',
    cupboard: 'Lab Cupboard',
    chem_cupboard: 'Chemical Cupboard',
    solvent_cupboard: 'Solvent Cupboard',
    whiteboard: '3F Whiteboard',
    bookshelf: 'Group Reference Bookshelf',
    thesis_printer: '3F Laser Printer',
    locker: 'Personal Locker Bank',
    fire_ext: 'Fire Extinguisher',
    pc_terminal: 'Workstation PC',
    writeup_desk: 'Write-Up Desk',
    nmr_magnet: 'NMR Spectrometer',
    lcms_unit: 'LC-MS Instrument',
    maldi_unit: 'MALDI-TOF Instrument',
    tea_drawer: "Richard's Kettle",
    cafe_counter: "Gordon's Counter",
    cafe_table: "Gordon's Table",
    projector: 'Seminar Projector',
    meeting_table: 'Seminar Table',
    chair: 'Seminar Chair',
    drying_oven: 'Drying Oven',
    argon_cyl: 'Argon Cylinder',
    base_bath: 'Bleach Quench Bath',
    tlc_station: 'UV TLC Station',
    waste_bin: 'Solvent Waste Bin',
    sink: 'Lab Sink',
    balance_table: 'Analytical Balance',
    syringe_pump: 'Syringe Pump',
    ph_probe: 'Benchtop pH Meter & Probe'
  };

  function niceStationName(type) {
    if (!type) return 'Lab Station';
    if (STATION_NICE_NAMES[type]) return STATION_NICE_NAMES[type];
    return String(type).replace(/_/g, ' ').replace(/\b\w/g, ch => ch.toUpperCase());
  }

  function reconcileArchiveSafe(mutatorFn) {
    if (window.KLB.Sim && typeof window.KLB.Sim.reconcileArchive === 'function') {
      return window.KLB.Sim.reconcileArchive(mutatorFn);
    }
    const fresh = window.KLB.Sim?.loadArchive ? window.KLB.Sim.loadArchive() : (archive || { clearedChars: {}, discoveredEvents: {}, totalRuns: 0, bestScore: 0 });
    if (typeof mutatorFn === 'function') mutatorFn(fresh);
    if (window.KLB.Sim?.saveArchive) window.KLB.Sim.saveArchive(fresh);
    return fresh;
  }

  function saveActiveRunSnapshot(force = false) {
    if (!state || state.spectatorMode || state.gameOver || state.victory || state.postAuditCelebration) return false;
    if (!window.KLB.Sim || typeof window.KLB.Sim.saveRunSnapshot !== 'function') return false;
    const simTotal = (Number(state.weekNum) || 1) * 10080 + (Number(state.dayIdx) || 0) * 1440 + (Number(state.timeMins) || 0);
    if (!force && Math.abs(simTotal - lastAutoSaveSimMins) < 15) return false;
    state.cameraZoom = cameraZoom;
    const ok = window.KLB.Sim.saveRunSnapshot(state);
    if (ok) lastAutoSaveSimMins = simTotal;
    return ok;
  }

  function clearActiveRunSnapshot() {
    lastAutoSaveSimMins = -Infinity;
    if (window.KLB.Sim && typeof window.KLB.Sim.clearRunSnapshot === 'function') {
      window.KLB.Sim.clearRunSnapshot();
    }
  }

  function getCoffeeQuartetWindowKey(st = state) {
    if (!st) return '';
    const quartetWin = window.KLB.Sim?.isCoffeeQuartetWindow ? window.KLB.Sim.isCoffeeQuartetWindow(st) : null;
    const winId = quartetWin?.id || ((st.timeMins || 0) < 13 * 60 ? 'morning' : 'afternoon');
    return `${st.dayIdx}_${winId}`;
  }

  function playStationSfx(stationType) {
    if (!window.KLB.Audio?.playSfx) return;
    if (stationType === 'buchi') {
      window.KLB.Audio.playSfx('rotavap_whoosh');
    } else if (stationType === 'centrifuge') {
      window.KLB.Audio.playSfx('centrifuge_hum');
    } else if (stationType === 'nmr_magnet') {
      window.KLB.Audio.playSfx('nmr_lock');
    } else if (stationType === 'tlc_station') {
      window.KLB.Audio.playSfx('uv_click');
    } else if (stationType === 'ph_probe') {
      window.KLB.Audio.playSfx('ph_beep');
    } else if (['fumehood', 'tcep_bench', 'lab_bench', 'heatblock', 'gel_tank', 'biotage', 'syringe_pump'].includes(stationType)) {
      window.KLB.Audio.playSfx('pipette');
    } else {
      window.KLB.Audio.playSfx('interact');
    }
  }

  function isFigureFlawed(fig) {
    if (!fig) return false;
    return (Number(fig.quality) || 0) < 78
      || Boolean(fig.hasSolventPeak || fig.hasAdduct || fig.hasOverReduction || fig.hasBlueDyeMishap);
  }

  function copyTextToClipboard(text, btnEl = null) {
    const finishFeedback = () => {
      if (window.KLB.Audio?.playSfx) window.KLB.Audio.playSfx('ui_click');
      if (btnEl) {
        if (!btnEl.dataset.origHtml) btnEl.dataset.origHtml = btnEl.innerHTML;
        btnEl.classList.add('copied');
        btnEl.innerHTML = `${icon('check', 13)}<span>Copied!</span>`;
        if (btnEl._copyResetTimer) clearTimeout(btnEl._copyResetTimer);
        btnEl._copyResetTimer = setTimeout(() => {
          btnEl.classList.remove('copied');
          if (btnEl.dataset.origHtml) btnEl.innerHTML = btnEl.dataset.origHtml;
        }, 2000);
      } else {
        showAlertBanner('Score-card copied to clipboard.', 2400, false);
      }
    };

    const fallbackCopy = () => {
      try {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.setAttribute('readonly', 'readonly');
        ta.style.position = 'fixed';
        ta.style.left = '-9999px';
        ta.style.top = '0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        finishFeedback();
      } catch (_) {
        showAlertBanner('Clipboard copy unavailable in this browser.', 2600, true);
      }
    };

    if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
      navigator.clipboard.writeText(text).then(finishFeedback).catch(fallbackCopy);
    } else {
      fallbackCopy();
    }
  }

  function buildShareableScoreCard(st, res = null, extraOpts = {}) {
    if (!st || !st.player) return '';
    const meta = window.KLB.CAST_BY_ID?.[st.player.id] || { name: st.player.id, shortName: st.player.id, role: 'Researcher' };
    const mutKeys = Object.keys(st.mutators || {}).filter(k => st.mutators[k] && !(st.player.id === 'archie_wall' && k === 'vijays_not_in'));
    const mutMetaList = window.KLB.MUTATORS || [];
    const mutNames = mutKeys.map(k => mutMetaList.find(m => m.id === k)?.name || k);
    const modLabel = mutNames.length ? mutNames.join(', ') : 'Standard KLB Week';
    const clockStr = window.KLB.Sim?.formatClock ? window.KLB.Sim.formatClock(st.dayIdx || 0, st.timeMins || 540) : 'FRI 18:00';
    const stepsDone = (st.completedSteps || []).length;
    const makeBar = (val, max) => {
      const filled = clamp(Math.round((Number(val || 0) / Math.max(0.1, Number(max || 1))) * 5), 0, 5);
      return `[${'#'.repeat(filled)}${'-'.repeat(5 - filled)}]`;
    };

    const lines = [
      `KLB SIMULATOR | ${meta.name} (Week ${st.weekNum || 1})`,
      `Modifier: ${modLabel} | ${clockStr} | Steps: ${stepsDone}/5`
    ];

    if (!extraOpts.heading && res && typeof res.total === 'number') {
      const b = res.breakdown || {};
      lines.push(`Friday Audit: ${res.total.toFixed(1)}/10 (${res.passed ? 'PASSED' : 'SUBOPTIMAL'})`);
      const cats = [
        ['Yield & Steps ', b.yieldScore ?? 0, 2.0],
        ['Homogeneity   ', b.homogeneityScore ?? 0, 2.0],
        ['Rigour        ', b.rigorScore ?? 0, 2.0],
        ['Manuscript    ', b.manuscriptScore ?? 0, 1.5],
        ['Slide Hygiene ', b.hygieneScore ?? 0, 1.5],
        ['Citizenship   ', b.citizenshipScore ?? 0, 1.0]
      ];
      cats.forEach(([label, val, max]) => {
        lines.push(`${label} ${makeBar(val, max)} ${Number(val).toFixed(1)}/${max.toFixed(1)}`);
      });
      const sup = getSupervisorMeta(st);
      const verdictPool = Array.isArray(res.verdictLines)
        ? res.verdictLines
        : (Array.isArray(res.vijayVerdictLines) ? res.vijayVerdictLines : []);
      const standout = verdictPool.find(l => /suboptimal|exemplary|clicker|watertight|smashed|spotless|publication-ready|brave/i.test(l))
        || verdictPool[0]
        || `Overall score: ${res.total.toFixed(1)} out of 10.`;
      lines.push(`${sup.shortName}: "${String(standout).replace(/\s+/g, ' ').trim()}"`);
    } else {
      const heading = extraOpts.heading || 'KLB Run Ended';
      const wrPct = Math.round(st.weeklyReportProgress || 0);
      const msPct = Math.round(st.manuscriptProgress || 0);
      const cond = Math.round(st.labCondition ?? st.safety ?? 0);
      lines.push(`Outcome: ${heading}`);
      lines.push(`Energy        ${makeBar(st.energy || 0, 100)} ${Math.round(st.energy || 0)}/100`);
      lines.push(`Morale        ${makeBar(st.morale || 0, 100)} ${Math.round(st.morale || 0)}/100`);
      lines.push(`Social        ${makeBar(st.social ?? 0, 100)} ${Math.round(st.social ?? 0)}/100`);
      lines.push(`Patience      ${makeBar(st.patience || 0, 100)} ${Math.round(st.patience || 0)}/100`);
      lines.push(`Lab Condition ${makeBar(cond, 100)} ${cond}/100`);
      lines.push(`Report ${wrPct}% | Manuscript ${msPct}% | Slides: ${st.slideDeck?.ready ? 'Ready' : 'Pending'}`);
      if (extraOpts.body) {
        lines.push(`Note: "${String(extraOpts.body).replace(/\s+/g, ' ').trim()}"`);
      }
    }

    lines.push('https://akshamsabadi.github.io/KLB_simulator/');
    return lines.join('\n');
  }

  function syncCelebrationBanner() {
    const stage = el('canvas-stage');
    if (!stage) return;
    let banner = el('celebration-banner');
    const shouldShow = Boolean(state && !state.spectatorMode && state.postAuditCelebration && !state.gameOver);
    stage.classList.toggle('has-celebration', shouldShow);
    if (!shouldShow) {
      if (banner) banner.remove();
      return;
    }
    if (!banner) {
      banner = document.createElement('div');
      banner.id = 'celebration-banner';
      banner.className = 'celebration-banner';
      stage.appendChild(banner);
    }
    const res = state.lastAuditResult || { total: 6.0, passed: true };
    banner.classList.toggle('suboptimal', !res.passed);
    const scoreStr = Number(res.total ?? 6.0).toFixed(1);
    banner.innerHTML = `
      <span class="celebration-banner-title">
        <span class="icon-inline">${icon('award', 14)}</span>
        <span>Week ${state.weekNum || 1} Complete (${scoreStr}/10)</span>
      </span>
      <div class="celebration-banner-actions">
        <button id="btn-celeb-review" type="button" class="hud-btn">${icon('eye', 13)}<span>Review Score-Card</span></button>
        <button id="btn-celeb-share" type="button" class="share-card-btn">${icon('copy', 13)}<span>Copy Score-Card</span></button>
        <button id="btn-celeb-next-week" type="button" class="hud-btn primary">${icon('play', 13)}<span>Start Week ${(state.weekNum || 1) + 1}</span></button>
        <button id="btn-celeb-title" type="button" class="hud-btn">${icon('rotate-ccw', 13)}<span>Character Select</span></button>
      </div>
    `;
    el('btn-celeb-review').onclick = () => openAuditScoreCardReviewModal(state.lastAuditResult);
    el('btn-celeb-share').onclick = ev => {
      copyTextToClipboard(buildShareableScoreCard(state, state.lastAuditResult), ev.currentTarget);
    };
    el('btn-celeb-next-week').onclick = () => {
      closeDialogue();
      startNextWeek();
    };
    el('btn-celeb-title').onclick = () => {
      closeDialogue();
      renderTitleScreen();
    };
  }

  function syncSpecSpeedUI() {
    const grp = el('spec-speed-group');
    if (!grp) return;
    const isSpec = Boolean(state?.spectatorMode);
    grp.classList.toggle('hidden', !isSpec);
    grp.querySelectorAll('.spec-speed-btn').forEach(btn => {
      const sp = Number(btn.dataset.speed) || 1;
      const isMatch = sp === specSpeed;
      btn.classList.toggle('active', isMatch);
      btn.setAttribute('aria-pressed', isMatch ? 'true' : 'false');
    });
  }

  function syncSpecFollowBadge() {
    const badge = el('spec-follow-badge');
    if (!badge) return;
    if (!state?.spectatorMode || !specFollowNpcId) {
      if (lastSpecFollowSig === 'none') return;
      lastSpecFollowSig = 'none';
      badge.classList.add('hidden');
      badge.innerHTML = '';
      badge.onclick = null;
      return;
    }
    const meta = window.KLB.CAST_BY_ID?.[specFollowNpcId];
    const shortName = meta?.shortName || meta?.name || specFollowNpcId;
    const npc = state.npcs?.[specFollowNpcId];
    const isOffsite = Boolean(!npc || !npc.roomId || npc.roomId === 'offsite');
    const sig = `${specFollowNpcId}:${isOffsite ? 1 : 0}`;
    if (sig === lastSpecFollowSig) return;
    lastSpecFollowSig = sig;
    const offsiteTag = isOffsite ? ' (Offsite)' : '';
    badge.classList.remove('hidden');
    badge.title = 'Click to stop following';
    badge.innerHTML = `${icon('eye', 12)}<span>Following: ${escHtml(shortName)}${offsiteTag}</span><span class="spec-follow-clear" aria-label="Clear follow">&times;</span>`;
    badge.onclick = () => {
      specFollowNpcId = null;
      if (window.KLB.Audio?.playSfx) window.KLB.Audio.playSfx('ui_click');
      syncSpecFollowBadge();
      if (state) renderLabBookPane(true);
    };
  }

  function getRoomCenterTile(roomId) {
    const rm = window.KLB.WORLD_MAPS?.rooms?.[roomId];
    if (!rm || !Array.isArray(rm.tiles)) return { x: 15, y: 10 };
    let minX = rm.w, maxX = 0, minY = rm.h, maxY = 0;
    let found = false;
    for (let y = 0; y < rm.h; y++) {
      for (let x = 0; x < rm.w; x++) {
        if (rm.tiles[y]?.[x] > 0) {
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
          found = true;
        }
      }
    }
    if (!found) return { x: rm.w * 0.5, y: rm.h * 0.5 };
    return { x: (minX + maxX) * 0.5, y: (minY + maxY) * 0.5 };
  }

  function getPlayerCarryingProp() {
    if (!state || state.spectatorMode || !state.player) return null;
    const roomId = state.player.roomId;
    if (roomId === 'gordons_cafe') return 'coffee';
    const curSub = getCurrentSubTask();
    if (roomId === 'cib_lg1b_nmr' || curSub?.roomId === 'cib_lg1b_nmr' || curSub?.viewOutput === 'nmr') {
      return 'nmr_tube';
    }
    if (roomId === 'cib_lg11_ms' || curSub?.roomId === 'cib_lg11_ms' || curSub?.viewOutput === 'lcms') {
      return 'ms_vial';
    }
    return null;
  }

  function prepareModalBox(modalClass = 'klb-modal', sfxName = 'modal_open', themeClass = '') {
    const box = el('modal-box');
    if (!box) return null;
    const activeEl = document.activeElement;
    if (activeEl && activeEl !== document.body && !box.contains(activeEl)) {
      lastFocusedEl = activeEl;
    }
    if (activeEl && typeof activeEl.blur === 'function' && !box.contains(activeEl)) {
      activeEl.blur();
    }
    box.classList.remove('ev-modal', 'klb-modal', 'klb-modal-sm');
    Array.from(box.classList).forEach(cls => {
      if (cls.startsWith('ev-theme-') || cls.startsWith('klb-theme-')) {
        box.classList.remove(cls);
      }
    });
    if (modalClass) box.classList.add(modalClass);
    if (themeClass) box.classList.add(themeClass);
    if (sfxName && window.KLB.Audio?.playSfx) {
      window.KLB.Audio.playSfx(sfxName);
    }
    return box;
  }

  function staggerNpcExchange(roomId, speakers, turns, convoId, opts = {}) {
    if (!state) return;
    const capturedSeed = state.runSeed;
    const normalized = (turns || []).map(t => ({
      speakerId: t.speakerId,
      text: t.text != null ? t.text : (t.line || '')
    }));
    if (window.KLB.Sim && typeof window.KLB.Sim.scheduleMultiTurnConversation === 'function') {
      window.KLB.Sim.scheduleMultiTurnConversation(state, roomId, speakers, normalized, convoId, opts);
      return;
    }
    normalized.forEach((turn, idx) => {
      const ttl = window.KLB.Sim?.calcBubbleTtl ? window.KLB.Sim.calcBubbleTtl(turn.text) : 4.5;
      if (idx === 0) {
        window.KLB.Sim.pushBubble(state, turn.speakerId, roomId, turn.text, ttl);
      } else {
        setTimeout(() => {
          if (state && state.runSeed === capturedSeed && state.player && !state.gameOver) {
            window.KLB.Sim.pushBubble(state, turn.speakerId, roomId, turn.text, ttl);
          }
        }, idx * 1400);
      }
    });
  }

  function syncMuteButtonUI() {
    const btn = el('btn-mute');
    if (!btn) return;
    const muted = Boolean(window.KLB.Audio?.isMuted?.());
    const sig = muted ? '1' : '0';
    if (sig === lastMuteUiSig) return;
    lastMuteUiSig = sig;
    btn.classList.toggle('muted', muted);
    btn.setAttribute('aria-pressed', muted ? 'true' : 'false');
    btn.innerHTML = `${icon(muted ? 'volume-x' : 'volume-2', 15)}<span id="lbl-mute">${muted ? 'Muted' : 'Audio'}</span>`;
  }

  function toggleMute() {
    if (!window.KLB.Audio) return;
    if (typeof window.KLB.Audio.init === 'function') window.KLB.Audio.init();
    const muted = typeof window.KLB.Audio.isMuted === 'function' ? window.KLB.Audio.isMuted() : false;
    if (typeof window.KLB.Audio.setMuted === 'function') {
      window.KLB.Audio.setMuted(!muted);
    }
    syncMuteButtonUI();
    if (!window.KLB.Audio.isMuted?.()) {
      window.KLB.Audio.playSfx?.('interact');
    }
  }

  function boot() {
    archive = window.KLB.Sim.loadArchive();
    hydrateIcons(document);
    populateMutatorSelect();
    renderTitleScreen();
    bindGlobalEvents();
    syncZoomSelectUI();
    syncMuteButtonUI();
    requestAnimationFrame(masterLoop);
  }

  // ==================== 1. TITLE & CHARACTER SELECT ====================
  function populateMutatorSelect() {
    const sel = el('select-mutator');
    if (!sel) return;
    const rawList = window.KLB.MUTATORS || [
      { id: 'vijays_not_in', name: '#VijaysNotIn', desc: 'No surprise bench rounds before Friday' },
      { id: 'lcms_chaos', name: '50% LC-MS Chaos', desc: 'Kersti instrument gremlins doubled' },
      { id: 'eternal_heatwave', name: '30 °C May Heatwave', desc: 'Lab 230 stuck at 30 °C all week' },
      { id: 'infinite_espresso', name: 'Double Espresso', desc: 'Slower Energy drain' },
      { id: 'strict_coshh', name: 'Strict COSHH Audit', desc: '2x safety inspection frequency & fines' }
    ];
    const isArchie = selectedCharId === 'archie_wall';
    const mutList = isArchie ? rawList.filter(m => m.id !== 'vijays_not_in') : rawList;
    if (isArchie && selectedMutator === 'vijays_not_in') {
      selectedMutator = 'none';
    }
    sel.innerHTML = `<option value="none">Standard KLB Week (No Modifier)</option>` +
      mutList.map(m => `<option value="${escHtml(m.id)}" title="${escHtml(m.desc || '')}">${escHtml(m.name)} — ${escHtml(m.desc || '')}</option>`).join('');
    sel.value = mutList.some(m => m.id === selectedMutator) ? selectedMutator : 'none';
  }

  function buildActiveMutators() {
    const out = {};
    if (selectedMutator && selectedMutator !== 'none') out[selectedMutator] = true;
    return out;
  }

  function renderTitleScreen() {
    if (window.KLB.Audio?.stopAllAmbience) window.KLB.Audio.stopAllAmbience();
    if (discardResetTimer) {
      clearTimeout(discardResetTimer);
      discardResetTimer = null;
    }
    hideAlertBanner();
    archive = window.KLB.Sim.loadArchive();
    state = null;
    alexPursuitActive = false;
    specFollowNpcId = null;
    specCameraPos = null;
    specDrag = null;
    lastLabBookSig = '';
    lastArchiveSig = '';
    lastTravelRoomSig = '';
    lastTaskPanelSig = '';
    lastReactionsSig = '';
    lastPauseUiSig = '';
    lastMuteUiSig = '';
    lastSpecFollowSig = '';
    lastAlertBannerSig = '';
    lastHoverHintText = '';
    lastDossierSpriteKey = '';
    lastCanvasRenderTs = 0;
    lastRenderModalPaused = false;
    el('world-canvas')?.classList.remove('spec-pannable', 'spec-dragging');
    el('title-screen').classList.remove('hidden');
    el('game-shell').classList.add('hidden');
    closeModal();
    closeDialogue();
    syncCelebrationBanner();
    populateMutatorSelect();

    const playables = getPlayableCast();
    const clearedCount = Object.keys(archive.clearedChars || {}).length;
    el('archive-progress-lbl').textContent = `${clearedCount} / ${playables.length} Audited`;

    const totalEvents = (window.KLB.RANDOM_EVENTS || []).length || 32;
    const evCount = Object.keys(archive.discoveredEvents || {}).length;
    const pillsEl = el('archive-summary-pills');
    if (pillsEl) {
      pillsEl.innerHTML = `
        <span class="archive-pill">Runs: <strong>${archive.totalRuns || 0}</strong></span>
        <span class="archive-pill accent">Best Audit: <strong>${(archive.bestScore || 0).toFixed(1)}/10</strong></span>
        <span class="archive-pill ${evCount >= totalEvents ? 'good' : ''}">Events: <strong>${evCount}/${totalEvents}</strong></span>
      `;
    }

    const bannerEl = el('continue-run-banner');
    if (bannerEl) {
      const snap = window.KLB.Sim?.loadRunSnapshot ? window.KLB.Sim.loadRunSnapshot() : null;
      const snapCharId = snap?.player?.id || snap?.charId;
      const snapMeta = snapCharId ? window.KLB.CAST_BY_ID?.[snapCharId] : null;
      if (snap && snapMeta && !snap.spectatorMode && !snap.gameOver) {
        const snapClock = window.KLB.Sim.formatClock(snap.dayIdx || 0, snap.timeMins || 540);
        const snapSteps = Array.isArray(snap.completedSteps) ? snap.completedSteps.length : 0;
        const snapRoom = window.KLB.ROOM_META?.[snap.player?.roomId]?.shortName || 'KLB 2nd Floor';
        const snapMutKeys = Object.keys(snap.mutators || {}).filter(k => snap.mutators[k] && !(snapCharId === 'archie_wall' && k === 'vijays_not_in'));
        const snapMutNames = snapMutKeys.map(k => (window.KLB.MUTATORS || []).find(m => m.id === k)?.name || k);
        const snapModLabel = snapMutNames.length ? ` | Modifier: ${snapMutNames.join(', ')}` : '';
        bannerEl.classList.remove('hidden');
        bannerEl.innerHTML = `
          <div class="continue-run-info">
            <img class="pixel-art" src="assets/portraits/${escHtml(snapMeta.id)}.png" alt="${escHtml(snapMeta.name)}" style="width:40px;height:40px;border-radius:7px;border:1px solid rgba(52,211,153,0.45);flex-shrink:0;" />
            <div class="continue-run-text">
              <div><strong>Saved Shift Ready: ${escHtml(snapMeta.name)}</strong> (Week ${snap.weekNum || 1})</div>
              <div class="continue-run-meta">${escHtml(snapClock)} | Step ${snapSteps}/5 | ${escHtml(snapRoom)}${escHtml(snapModLabel)}</div>
            </div>
          </div>
          <div class="continue-run-actions">
            <button id="btn-continue-save" type="button" class="continue-run-resume">${icon('play', 13)}<span>Continue Saved Run</span></button>
            <button id="btn-discard-save" type="button" class="continue-run-discard">${icon('trash-2', 13)}<span>Discard Save</span></button>
          </div>
        `;
        el('btn-continue-save').onclick = () => resumeSavedRun(snap);
        let discardArmed = false;
        el('btn-discard-save').onclick = () => {
          if (window.KLB.Audio?.playSfx) window.KLB.Audio.playSfx('ui_click');
          const btn = el('btn-discard-save');
          if (!discardArmed) {
            discardArmed = true;
            if (btn) {
              btn.classList.add('armed');
              btn.innerHTML = `${icon('alert-triangle', 13)}<span>Confirm Discard?</span>`;
            }
            if (discardResetTimer) clearTimeout(discardResetTimer);
            discardResetTimer = setTimeout(() => {
              discardArmed = false;
              const bNow = el('btn-discard-save');
              if (bNow) {
                bNow.classList.remove('armed');
                bNow.innerHTML = `${icon('trash-2', 13)}<span>Discard Save</span>`;
              }
            }, 3500);
            return;
          }
          if (discardResetTimer) {
            clearTimeout(discardResetTimer);
            discardResetTimer = null;
          }
          clearActiveRunSnapshot();
          bannerEl.classList.add('hidden');
          bannerEl.innerHTML = '';
        };
      } else {
        bannerEl.classList.add('hidden');
        bannerEl.innerHTML = '';
      }
    }

    const grid = el('char-grid');
    grid.innerHTML = '';
    playables.forEach(c => {
      const card = document.createElement('button');
      card.type = 'button';
      const isSelected = c.id === selectedCharId;
      const isBonus = Boolean(c.isBonus || c.id === 'archie_wall');
      card.className = (isBonus ? 'char-card bonus-card' : 'char-card') + (isSelected ? ' selected' : '');
      card.setAttribute('aria-pressed', isSelected ? 'true' : 'false');
      const best = archive.clearedChars?.[c.id];
      const badge = best !== undefined ? `<span class="cleared-pip">${best.toFixed(1)}/10</span>` : '';
      const roleShort = (c.role.split('•')[1] || c.role).trim();
      if (isBonus) {
        card.innerHTML = `
          ${badge}
          <img class="portrait pixel-art" src="assets/portraits/${c.id}.png" alt="${escHtml(c.name)}" />
          <div class="bonus-card-meta">
            <div class="c-name">${escHtml(c.name)}</div>
            <div class="c-sub">${escHtml(roleShort)}</div>
          </div>
          <span class="bonus-badge">BONUS • BAKER GROUP</span>
        `;
      } else {
        card.innerHTML = `
          ${badge}
          <img class="portrait pixel-art" src="assets/portraits/${c.id}.png" alt="${escHtml(c.name)}" />
          <div class="c-name">${escHtml(c.name)}</div>
          <div class="c-sub">${escHtml(roleShort)}</div>
        `;
      }
      card.onclick = () => {
        selectedCharId = c.id;
        if (window.KLB.Audio) { window.KLB.Audio.init(); window.KLB.Audio.playSfx('ui_click'); }
        renderTitleScreen();
      };
      grid.appendChild(card);
    });

    renderSelectedDossier();
  }

  function renderSelectedDossier() {
    const c = window.KLB.CAST_BY_ID[selectedCharId];
    const camp = window.KLB.CAMPAIGNS?.[selectedCharId];
    const box = el('char-dossier');
    if (!c || !box) return;

    const stepsHtml = (camp?.steps || []).map(s =>
      `<li>${escHtml(s.title.replace(/^Step \d+:\s*/i, ''))}</li>`
    ).join('');

    const prefs = c.preferences || { pref: 'balanced', requiresCaffeine: false, label: 'Balanced' };
    const energyLabel = prefs.requiresCaffeine ? 'Caffeine-Reliant' : 'Standard';
    const lunchRoomLabel = c.lunchRoom === 'klb_3f' ? '3F Office' : "Gordon's Café";
    const lunchTimeLabel = c.lunchHour ? `${window.KLB.Sim.formatHHMM(c.lunchHour * 60)} (${lunchRoomLabel})` : lunchRoomLabel;
    const personalBest = archive?.clearedChars?.[c.id];
    const bestPillHtml = personalBest !== undefined
      ? `<span class="dossier-pill" style="border-color:rgba(34,197,94,0.55);color:#86efac;">Best: ${personalBest.toFixed(1)}/10</span>`
      : `<span class="dossier-pill">Best: Unaudited</span>`;

    box.innerHTML = `
      <div style="display:flex;flex-direction:column;gap:10px;">
        <header class="dossier-top">
          <img class="portrait-lg pixel-art" src="assets/portraits/${c.id}.png" alt="${escHtml(c.name)}" />
          <canvas id="dossier-sprite-canvas" class="dossier-sprite-preview" width="64" height="96"></canvas>
          <div style="flex:1;min-width:0;">
            <h2 style="font-size:18px;">${escHtml(c.name)}</h2>
            <p style="font-size:11.5px;color:#93c5fd;margin-top:2px;">${escHtml(c.role)}</p>
            <div class="dossier-pills">
              <span class="dossier-pill accent">${window.KLB.Sim.formatHHMM(c.arriveHour * 60)} – ${window.KLB.Sim.formatHHMM(c.departHour * 60)}</span>
              <span class="dossier-pill">Energy: ${escHtml(energyLabel)}</span>
              <span class="dossier-pill">Break: ${escHtml(prefs.label || 'Balanced')}</span>
              <span class="dossier-pill">Lunch: ${escHtml(lunchTimeLabel)}</span>
              ${bestPillHtml}
            </div>
          </div>
        </header>

        <section class="dossier-card campaign">
          <h4>${icon('file-text', 13)}<span>Project: ${escHtml(camp?.title || 'Research Project')}</span></h4>
          <p style="font-size:11px;color:#94a3b8;margin-bottom:4px;">Topic: ${escHtml(camp?.manuscriptTopic || camp?.paperRef || '')}</p>
          <p style="font-size:11.5px;color:#cbd5e1;">${escHtml(camp?.overview || '')}</p>
          <ol class="dossier-steps-list">${stepsHtml}</ol>
        </section>

        <section class="dossier-card perk">
          <h4>${icon('sparkles', 13)}<span>Trait — ${escHtml(c.perkTitle)}</span></h4>
          <p style="color:#cbd5e1;">${escHtml(c.perkDesc)}</p>
        </section>

        <section class="dossier-card flaw">
          <h4>${icon('alert-triangle', 13)}<span>Challenge — ${escHtml(c.flawTitle)}</span></h4>
          <p style="color:#cbd5e1;">${escHtml(c.flawDesc)}</p>
        </section>
      </div>

      <button id="btn-launch-campaign" class="btn-start-run">
        ${icon('play', 16)}
        <span>Enter KLB as ${escHtml(c.shortName)} (Monday ${window.KLB.Sim.formatHHMM(c.arriveHour * 60)})</span>
      </button>
    `;

    el('btn-launch-campaign').onclick = () => startNewRun(selectedCharId, false);
    lastDossierSpriteKey = '';
    drawDossierSprite();
  }

  const spritePreviewCache = {};
  function drawDossierSprite() {
    const cv = el('dossier-sprite-canvas');
    if (!cv) return;
    if (!spritePreviewCache[selectedCharId]) {
      const im = new Image();
      im.onload = () => {
        lastDossierSpriteKey = '';
        drawDossierSprite();
      };
      im.src = `assets/sprites/${selectedCharId}.png`;
      spritePreviewCache[selectedCharId] = im;
    }
    const img = spritePreviewCache[selectedCharId];
    const loaded = Boolean(img.complete && img.naturalWidth > 0);
    const dirRow = Math.floor(dossierAnimTimer / 1.6) % 4;
    const frameCol = Math.floor(dossierAnimTimer * 5) % 4;
    const key = `${selectedCharId}:${dirRow}:${frameCol}:${loaded ? 1 : 0}`;
    if (key === lastDossierSpriteKey) return;
    lastDossierSpriteKey = key;
    const ctx = cv.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, 64, 96);
    if (loaded) {
      ctx.drawImage(img, frameCol * 64, dirRow * 96, 64, 96, 0, 0, 64, 96);
    }
  }

  function startNewRun(charId, spectator = false) {
    if (window.KLB.Audio) {
      window.KLB.Audio.init();
      window.KLB.Audio.playSfx('success');
    }
    hideAlertBanner();
    if (!spectator) {
      clearActiveRunSnapshot();
      archive = reconcileArchiveSafe(a => {
        a.totalRuns = (a.totalRuns || 0) + 1;
      });
    }

    const muts = buildActiveMutators();
    state = window.KLB.Sim.createRunState(charId, muts, { spectatorMode: spectator });
    if (muts.lcms_chaos && Math.random() < 0.5) state.lcmsBroken = true;

    // Initialize sub-task tracking and keep activeStationJobs & activeReactions strictly shared
    state.runSeed = ((Date.now() ^ Math.floor(Math.random() * 0xffffffff)) >>> 0) || 1;
    state.campaignSubTaskIdx = 0;
    state.completedSubTasks = [];
    state.curStepChoiceResult = null;
    state.curStepPerf = null;
    state.activeMinigameScore = null;
    state.fridayMorningPresented = false;
    state.morningAuditResult = null;
    state.fridayFinalAuditDone = false;
    state._pendingChoiceEventId = null;
    state._alexEncounteredToday = false;
    state._proofreadReportUsed = false;
    state._proofreadMsUsed = false;
    state._benchTcepTriedSteps = {};
    state._lastCoffeeBreakMins = null;
    state._lastTeaBreakMins = null;
    state._lastGamingBreakMins = null;
    state.prep = state.prep || {};
    state.prep.ph_calibrated = false;
    state._stepPrepCredit = {};
    state._stepBiotageBonusApplied = false;
    state._stepFaizaA280Done = false;
    state._stepDanFumbleApplied = false;
    state._stepArchieBonusApplied = false;
    state._stepArchieFlawApplied = false;
    state.activeStationJobs = Array.isArray(state.activeStationJobs) ? state.activeStationJobs : [];
    state.activeReactions = state.activeStationJobs;
    state.paused = !spectator;
    state.isPaused = !spectator;

    lastWaMsgId = null;
    lastWaCount = 0;
    unreadWaCount = 0;
    lastLabBookSig = '';
    lastArchiveSig = '';
    lastTravelRoomSig = '';
    lastTaskPanelSig = '';
    lastReactionsSig = '';
    lastPauseUiSig = '';
    lastMuteUiSig = '';
    lastSpecFollowSig = '';
    lastAlertBannerSig = '';
    lastHoverHintText = '';
    lastCanvasRenderTs = 0;
    lastRenderModalPaused = false;
    const waFeedEl = el('wa-feed');
    if (waFeedEl) waFeedEl.textContent = '';
    const lbPaneEl = el('labbook-scroll');
    if (lbPaneEl) {
      delete lbPaneEl.dataset.specRosterWeek;
      lbPaneEl.textContent = '';
    }
    specSpeed = 1;
    specFollowNpcId = null;
    specCameraPos = null;
    specDrag = null;
    cameraZoom = 1.0;
    alexPursuitActive = false;
    lastAutoSaveSimMins = -Infinity;

    el('title-screen').classList.add('hidden');
    el('game-shell').classList.remove('hidden');
    closeDialogue();
    closeModal();
    syncCelebrationBanner();
    syncZoomSelectUI();
    configureModeShell();
    syncAudioAmbience();
    syncPauseButtonUI();
    syncMuteButtonUI();
    setActiveDeckTab('whatsapp', { silent: true });
    syncAllHUD(true);

    if (!spectator) {
      setPaused(true);
      const meta = window.KLB.CAST_BY_ID[charId];
      showDialogue(
        charId,
        meta.name,
        `Monday in KLB Lab 230. Complete your 5 protocol steps, submit your Weekly Report by Thu 18:00, build your 4-slide deck for Friday 09:00 Group Meeting, and finish your Manuscript Draft by Fri 18:00.`,
        [{ label: '[1] Start Shift & Unpause (E)', primary: true, onClick: closeDialogue }],
        true,
        '',
        { unpauseOnClose: true }
      );
    } else {
      setPaused(false);
      showAlertBanner('Autonomous Lab Observer active: watch all 10 Big-Chuds, Archie & neighbours run KLB.', 4200, false);
    }
  }

  function resumeSavedRun(snap) {
    if (!snap || !snap.player || !window.KLB.CAST_BY_ID?.[snap.player.id]) return;
    if (window.KLB.Audio) {
      window.KLB.Audio.init();
      window.KLB.Audio.playSfx('success');
    }
    hideAlertBanner();

    state = snap;
    state.spectatorMode = false;
    state.gameOver = false;
    state.victory = false;
    state.postAuditCelebration = false;
    state.weekNum = Number.isFinite(Number(state.weekNum)) ? Math.max(1, Math.round(Number(state.weekNum))) : 1;
    state.dayIdx = Number.isFinite(Number(state.dayIdx)) ? clamp(Math.round(Number(state.dayIdx)), 0, 4) : 0;
    state.timeMins = Number.isFinite(Number(state.timeMins)) ? clamp(Number(state.timeMins), 0, 24 * 60) : 540;
    state.energy = Number.isFinite(Number(state.energy)) ? clamp(Number(state.energy), 0, 100) : 92;
    state.morale = Number.isFinite(Number(state.morale)) ? clamp(Number(state.morale), 0, 100) : 50;
    state.social = Number.isFinite(Number(state.social)) ? clamp(Number(state.social), 0, 100) : 84;
    state.patience = Number.isFinite(Number(state.patience)) ? clamp(Number(state.patience), 0, 100) : 82;
    const condRaw = Number.isFinite(Number(state.labCondition))
      ? Number(state.labCondition)
      : (Number.isFinite(Number(state.safety)) ? Number(state.safety) : 95);
    state.labCondition = clamp(condRaw, 0, 100);
    state.safety = state.labCondition;
    state.favours = Number.isFinite(Number(state.favours)) ? clamp(Math.floor(Number(state.favours)), 0, 6) : 1;
    state.tempC = Number.isFinite(Number(state.tempC)) ? Number(state.tempC) : 21.0;
    state.weeklyReportProgress = Number.isFinite(Number(state.weeklyReportProgress)) ? clamp(Number(state.weeklyReportProgress), 0, 100) : 0;
    state.manuscriptProgress = Number.isFinite(Number(state.manuscriptProgress)) ? clamp(Number(state.manuscriptProgress), 0, 100) : 0;
    state.campaignStepIdx = Number.isFinite(Number(state.campaignStepIdx)) ? clamp(Math.floor(Number(state.campaignStepIdx)), 0, 5) : 0;
    state.campaignSubTaskIdx = Number.isFinite(Number(state.campaignSubTaskIdx)) ? Math.max(0, Math.floor(Number(state.campaignSubTaskIdx))) : 0;
    state.activeStationJobs = Array.isArray(state.activeStationJobs) ? state.activeStationJobs : [];
    state.activeReactions = state.activeStationJobs;
    state.completedSteps = Array.isArray(state.completedSteps) ? state.completedSteps : [];
    state.completedSubTasks = Array.isArray(state.completedSubTasks) ? state.completedSubTasks : [];
    state.labBook = Array.isArray(state.labBook) ? state.labBook : [];
    state.whatsapp = Array.isArray(state.whatsapp) ? state.whatsapp : [];
    state.speechBubbles = Array.isArray(state.speechBubbles) ? state.speechBubbles : [];
    state.prep = state.prep || {};
    if (typeof state.prep.ph_calibrated !== 'boolean') state.prep.ph_calibrated = false;
    if (typeof state.prep.tcep_buffered !== 'boolean') {
      state.prep.tcep_buffered = state.player.id !== 'maximillian_lee';
    }
    state.mutators = state.mutators || {};
    state._stepPrepCredit = state._stepPrepCredit || {};
    state._proofreadReportUsed = Boolean(state._proofreadReportUsed);
    state._proofreadMsUsed = Boolean(state._proofreadMsUsed);
    state._benchTcepTriedSteps = state._benchTcepTriedSteps && typeof state._benchTcepTriedSteps === 'object' ? state._benchTcepTriedSteps : {};
    state.slideDeck = state.slideDeck || { ready: false, framing: 'mechanistic', fig1Id: null, fig2Id: null, honestDisclosure: true };
    state.fireAlarm = state.fireAlarm || { active: false, remainingMins: 0, elapsedMins: 0 };
    state.fireAlarm.remainingMins = Number.isFinite(Number(state.fireAlarm.remainingMins)) ? Math.max(0, Number(state.fireAlarm.remainingMins)) : 0;
    state.fireAlarm.elapsedMins = Number.isFinite(Number(state.fireAlarm.elapsedMins)) ? Math.max(0, Number(state.fireAlarm.elapsedMins)) : 0;
    state.safetySweep = state.safetySweep || { active: false, countdownSec: 0, countdownMins: 0 };
    state.safetySweep.countdownSec = Number.isFinite(Number(state.safetySweep.countdownSec)) ? Math.max(0, Number(state.safetySweep.countdownSec)) : 0;
    state.safetySweep.countdownMins = Number.isFinite(Number(state.safetySweep.countdownMins)) ? Math.max(0, Number(state.safetySweep.countdownMins)) : 0;
    state.doorPls = state.doorPls && typeof state.doorPls === 'object'
      ? Object.assign({ active: false, requesterId: null, expireMins: 0 }, state.doorPls)
      : { active: false, requesterId: null, expireMins: 0 };
    if (state.doorPls.active && !window.KLB.CAST_BY_ID?.[state.doorPls.requesterId]) {
      state.doorPls.active = false;
    }
    state.vijayRound = state.vijayRound && typeof state.vijayRound === 'object'
      ? Object.assign({ active: false, checkedPlayer: false }, state.vijayRound)
      : { active: false, checkedPlayer: false };
    state.aoe2Event = state.aoe2Event && typeof state.aoe2Event === 'object'
      ? Object.assign({ active: false, endMins: 0 }, state.aoe2Event)
      : { active: false, endMins: 0 };
    if (typeof state.fridayMorningPresented !== 'boolean') {
      state.fridayMorningPresented = Boolean(state.fridayAuditDone);
    }
    if (state.morningAuditResult === undefined) {
      state.morningAuditResult = state.fridayMorningPresented ? (state.lastAuditResult || null) : null;
    }
    if (typeof state.fridayFinalAuditDone !== 'boolean') {
      state.fridayFinalAuditDone = false;
    }
    if (!window.KLB.WORLD_MAPS?.rooms?.[state.player.roomId]) {
      state.player.roomId = 'klb_2f';
    }
    const pSpawnFallback = window.KLB.ROOM_META?.[state.player.roomId]?.entrySpawn || { x: 27, y: 12 };
    if (!Number.isFinite(Number(state.player.x))) state.player.x = pSpawnFallback.x;
    if (!Number.isFinite(Number(state.player.y))) state.player.y = pSpawnFallback.y;
    for (const npc of Object.values(state.npcs || {})) {
      if (!npc) continue;
      if (npc.roomId && npc.roomId !== 'offsite') {
        const nSpawn = window.KLB.ROOM_META?.[npc.roomId]?.entrySpawn || { x: 10, y: 10 };
        if (!Number.isFinite(Number(npc.x))) npc.x = nSpawn.x;
        if (!Number.isFinite(Number(npc.y))) npc.y = nSpawn.y;
      }
      if (npc.sim) {
        npc.sim.activeRxn = npc.sim.activeJob || null;
      }
    }
    if (state.npcs?.alex_king && state.npcs.alex_king.roomId !== 'offsite') {
      state.npcs.alex_king.roomId = 'offsite';
      state.npcs.alex_king.path = [];
      state.npcs.alex_king.pendingRoomTravel = null;
    }
    state.player.autoPath = null;
    state.player.walkTarget = null;
    state.player.pendingInteract = null;
    selectedCharId = state.player.id;
    const activeMutKey = Object.keys(state.mutators || {}).find(k => state.mutators[k]);
    selectedMutator = activeMutKey || 'none';
    populateMutatorSelect();

    lastWaMsgId = null;
    lastWaCount = 0;
    unreadWaCount = 0;
    lastLabBookSig = '';
    lastArchiveSig = '';
    lastTravelRoomSig = '';
    lastTaskPanelSig = '';
    lastReactionsSig = '';
    lastPauseUiSig = '';
    lastMuteUiSig = '';
    lastSpecFollowSig = '';
    lastAlertBannerSig = '';
    lastHoverHintText = '';
    lastCanvasRenderTs = 0;
    lastRenderModalPaused = false;
    const waFeedEl = el('wa-feed');
    if (waFeedEl) waFeedEl.textContent = '';
    const lbPaneEl = el('labbook-scroll');
    if (lbPaneEl) {
      delete lbPaneEl.dataset.specRosterWeek;
      lbPaneEl.textContent = '';
    }
    specSpeed = 1;
    specFollowNpcId = null;
    specCameraPos = null;
    specDrag = null;
    if (snap.cameraZoom === 'fit' || typeof snap.cameraZoom === 'number') {
      cameraZoom = snap.cameraZoom;
    }
    alexPursuitActive = false;
    lastAutoSaveSimMins = (Number(state.weekNum) || 1) * 10080 + (Number(state.dayIdx) || 0) * 1440 + (Number(state.timeMins) || 0);

    el('title-screen').classList.add('hidden');
    el('game-shell').classList.remove('hidden');
    closeDialogue();
    closeModal();
    syncCelebrationBanner();
    syncZoomSelectUI();
    configureModeShell();
    setPaused(false);
    syncAudioAmbience();
    syncPauseButtonUI();
    syncMuteButtonUI();
    setActiveDeckTab('whatsapp', { silent: true });

    const meta = window.KLB.CAST_BY_ID[state.player.id];
    showAlertBanner(`Resumed ${meta.shortName}'s shift (${window.KLB.Sim.formatClock(state.dayIdx, state.timeMins)}).`, 3600, false);
    syncAllHUD(true);

    if (state._pendingChoiceEventId) {
      const pendingEv = (window.KLB.RANDOM_EVENTS || []).find(e => e.id === state._pendingChoiceEventId);
      if (pendingEv) {
        openRandomEventChoiceModal(pendingEv);
      } else {
        state._pendingChoiceEventId = null;
      }
    } else if (state.dayIdx === 4 && !state.fridayAuditDone && state.timeMins >= 9 * 60 && state.timeMins <= 585) {
      triggerFridayMorningWelcome();
    } else if (state.dayIdx === 4 && (state.fridayFinalAuditDone || state.timeMins >= 18 * 60)) {
      endCurrentDay(false);
    }
  }

  function configureModeShell() {
    const isSpec = Boolean(state?.spectatorMode);
    const worldCanvas = el('world-canvas');
    if (worldCanvas) {
      worldCanvas.classList.toggle('spec-pannable', isSpec);
      if (!isSpec) worldCanvas.classList.remove('spec-dragging');
    }
    el('btn-toggle-specs').classList.toggle('hidden', isSpec);
    el('btn-toggle-headphones').classList.toggle('hidden', isSpec);
    if (el('spectator-room-wrap')) {
      el('spectator-room-wrap').classList.toggle('hidden', !isSpec);
    }
    el('player-meters-wrap').classList.toggle('hidden', isSpec);
    el('spectator-summary').classList.toggle('hidden', !isSpec);
    if (el('weekly-deliverables')) {
      el('weekly-deliverables').classList.toggle('hidden', isSpec);
    }
    document.querySelector('.wa-actions')?.classList.toggle('hidden', isSpec);
    const lbTabLbl = el('tab-lbl-labbook');
    if (lbTabLbl) {
      const figN = Array.isArray(state?.labBook) ? state.labBook.length : 0;
      lbTabLbl.textContent = isSpec ? 'Roster' : (figN > 0 ? `Lab Book (${figN})` : 'Lab Book');
    }

    if (isSpec) {
      el('controls-hint-text').textContent = 'WASD / Arrows / Drag: Pan Camera  |  Click Character: Follow  |  1/2/3: Speed  |  Zoom: Fit Whole Floor  |  Space: Pause  |  Esc: Menu';
    } else {
      el('controls-hint-text').textContent = 'WASD / Arrows / Click: Move  |  Space: Pause  |  E / Click: Interact  |  G: Specs  |  H: Headphones  |  M: Mute  |  Esc: Menu';
    }
    syncSupervisorChrome();
    syncSpecSpeedUI();
    syncSpecFollowBadge();
    syncMuteButtonUI();
  }

  // ==================== 2. SIMULATION CALLBACKS, PAUSE & AUDIO ====================
  function getViewRoom() {
    if (!state) return 'klb_2f';
    return state.spectatorMode ? (state.cameraRoomId || 'klb_2f') : state.player.roomId;
  }

  function getCurrentCampaignStep() {
    if (!state || state.spectatorMode) return null;
    const camp = window.KLB.getCampaign(state.player.id);
    const steps = camp?.steps || [];
    return state.campaignStepIdx < steps.length ? steps[state.campaignStepIdx] : null;
  }

  function getCurrentSubTask(step = getCurrentCampaignStep()) {
    if (!step || !Array.isArray(step.subTasks)) return null;
    return step.subTasks[state.campaignSubTaskIdx] || null;
  }

  function hasColleaguesInRoom(roomId) {
    if (!state || !roomId || roomId === 'offsite') return false;
    return Object.values(state.npcs || {}).some(n => n && n.roomId === roomId);
  }

  function setPaused(flag) {
    if (!state) return;
    const next = Boolean(flag);
    state.paused = next;
    state.isPaused = next;
    if (next) keysDown.clear();
    if (window.KLB.Audio?.setPaused) {
      window.KLB.Audio.setPaused(next && !alexPursuitActive);
    }
    syncPauseButtonUI();
  }

  function togglePause() {
    if (!state || state.gameOver || state.victory) return;
    if (!el('modal-backdrop').classList.contains('hidden')) return;
    if (window.KLB.Audio?.playSfx) window.KLB.Audio.playSfx('pause_toggle');
    setPaused(!state.paused);
  }

  function openPauseMenuModal() {
    if (!state) return;
    setPaused(true);
    modalDismissable = true;
    modalEscapeHandler = () => {
      closeModal();
      setPaused(false);
    };

    const isSpec = Boolean(state.spectatorMode);
    const meta = !isSpec ? window.KLB.CAST_BY_ID?.[state.player?.id] : null;
    const clockStr = window.KLB.Sim?.formatClock ? window.KLB.Sim.formatClock(state.dayIdx || 0, state.timeMins || 540) : '';
    const volNow = typeof window.KLB.Audio?.getVolume === 'function' ? window.KLB.Audio.getVolume() : 0.65;
    const volPct = clamp(Math.round(volNow * 100), 0, 100);
    const isMutedNow = Boolean(window.KLB.Audio?.isMuted?.());
    let restartArmed = false;

    const box = prepareModalBox('klb-modal', 'ui_click');
    box.innerHTML = `
      <header class="klb-modal-header">
        <div>
          <h3 style="display:flex;align-items:center;gap:8px;">
            ${icon('sliders', 17)}
            <span>${isSpec ? 'Observer Mode Menu' : 'KLB Shift Menu'}</span>
          </h3>
          <p class="mono-muted" style="margin-top:3px;">
            ${isSpec ? `Autonomous Lab Observer | ${escHtml(clockStr)}` : `${escHtml(meta?.name || state.player.id)} | Week ${state.weekNum || 1} | ${escHtml(clockStr)}`}
          </p>
        </div>
        <button id="btn-menu-close" type="button" class="hud-btn">${icon('x', 14)}<span>Close</span></button>
      </header>

      <div class="klb-modal-body">
        <div class="volume-slider-row">
          <label for="menu-vol-slider" class="volume-slider-label">
            ${icon('volume-2', 14)}
            <span>Master Volume</span>
          </label>
          <input id="menu-vol-slider" class="klb-volume-slider" type="range" min="0" max="100" step="1" value="${volPct}" />
          <span id="menu-vol-pct" class="volume-slider-val">${volPct}%</span>
          <button id="menu-mute-btn" type="button" class="hud-btn ${isMutedNow ? 'muted' : ''}">
            ${icon(isMutedNow ? 'volume-x' : 'volume-2', 14)}
            <span>${isMutedNow ? 'Unmute' : 'Mute'}</span>
          </button>
        </div>

        <div class="rules-grid">
          ${isSpec ? `
            <section class="rules-card">
              <h4>${icon('help-circle', 13)}<span>Observer Controls</span></h4>
              <ul>
                <li><code>WASD / Arrows / Drag</code> Pan camera across the room</li>
                <li><code>Click Character</code> Follow researcher across rooms</li>
                <li><code>1 / 2 / 3</code> Switch simulation speed (1x / 2x / 4x)</li>
                <li><code>Space</code> Pause / Resume &middot; <code>M</code> Mute Audio</li>
              </ul>
            </section>
            <section class="rules-card">
              <h4>${icon('eye', 13)}<span>Observer Mode Guide</span></h4>
              <ul>
                <li><strong>Autonomous Roster:</strong> Inspect live steps &amp; audits in the Roster tab</li>
                <li><strong>Room Selector:</strong> Jump between 2F, 3F, Gordon's, CIB, and Seminar Room</li>
                <li><strong>Zoom:</strong> Use Fit Whole Floor or 1x-1.5x (panning switches Fit to 1x)</li>
                <li><strong>Audio:</strong> Ambience tracks whichever floor you are viewing</li>
              </ul>
            </section>
          ` : `
            <section class="rules-card">
              <h4>${icon('help-circle', 13)}<span>Quick Controls</span></h4>
              <ul>
                <li><code>WASD / Click</code> Walk &amp; auto-path to stations</li>
                <li><code>E</code> Interact with bench, door, or colleague</li>
                <li><code>G</code> Toggle Safety Specs &middot; <code>H</code> Toggle Headphones</li>
                <li><code>Space</code> Pause / Resume &middot; <code>M</code> Mute Audio</li>
              </ul>
            </section>
            <section class="rules-card">
              <h4>${icon('shield-check', 13)}<span>KLB Week Rules</span></h4>
              <ul>
                <li><strong>Thu 18:00</strong> Weekly Report &middot; <strong>Fri 09:00</strong> Group Meeting (4-Slide Deck)</li>
                <li><strong>Fri 18:00</strong> Final Manuscript Draft &amp; Week Audit</li>
                <li><strong>Safety Sweeps:</strong> Specs ON, Headphones OFF, Lab Condition &ge; 40</li>
                <li><strong>Favours:</strong> Spend on Peer Proofread, CIB Sample Courier, Re-Purify, or Rescues</li>
              </ul>
            </section>
          `}
        </div>

        <div class="pause-menu-grid">
          <button id="btn-menu-resume" type="button" class="pause-menu-btn primary pause-menu-wide" data-hotkey="1">
            ${icon('play', 15)}
            <span>[1] Resume ${isSpec ? 'Observer Mode' : 'Lab Shift'}</span>
          </button>
          ${!isSpec ? `
            <button id="btn-menu-restart" type="button" class="pause-menu-btn" data-hotkey="2">
              ${icon('rotate-ccw', 15)}
              <span>[2] Restart ${escHtml(meta?.shortName || 'Researcher')}</span>
            </button>
          ` : ''}
          <button id="btn-menu-title" type="button" class="pause-menu-btn ${isSpec ? 'pause-menu-wide' : ''}" data-hotkey="${isSpec ? 2 : 3}">
            ${icon('door-open', 15)}
            <span>[${isSpec ? 2 : 3}] ${isSpec ? 'Return to Title Screen' : 'Save & Return to Title Screen'}</span>
          </button>
          <div id="menu-restart-confirm" class="quit-confirm-box hidden">
            <div><strong>Restart ${escHtml(meta?.name || 'current run')}?</strong> Your current mid-week progress will be cleared and Monday morning will start fresh.</div>
            <div class="quit-confirm-actions">
              <button id="btn-menu-restart-cancel" type="button" class="hud-btn">Cancel</button>
              <button id="btn-menu-restart-go" type="button" class="rpg-btn primary" style="background:#b91c1c;border-color:#f87171;">Confirm Restart</button>
            </div>
          </div>
        </div>
      </div>

      <footer class="klb-modal-footer">
        <span>${isSpec ? 'Observer settings apply immediately' : 'Leaving to Title auto-saves your active shift'}</span>
        <span>Press Esc or [1] to resume</span>
      </footer>
    `;

    el('modal-backdrop').classList.remove('hidden');
    el('btn-menu-close').onclick = modalEscapeHandler;
    el('btn-menu-resume').onclick = modalEscapeHandler;

    const slider = el('menu-vol-slider');
    const pctLbl = el('menu-vol-pct');
    const muteBtn = el('menu-mute-btn');

    const syncMenuMuteBtn = () => {
      const m = Boolean(window.KLB.Audio?.isMuted?.());
      if (muteBtn) {
        muteBtn.classList.toggle('muted', m);
        muteBtn.innerHTML = `${icon(m ? 'volume-x' : 'volume-2', 14)}<span>${m ? 'Unmute' : 'Mute'}</span>`;
      }
      syncMuteButtonUI();
    };

    if (slider) {
      slider.oninput = () => {
        const pct = clamp(Number(slider.value) || 0, 0, 100);
        if (pctLbl) pctLbl.textContent = `${pct}%`;
        if (window.KLB.Audio?.init) window.KLB.Audio.init();
        if (window.KLB.Audio?.setVolume) window.KLB.Audio.setVolume(pct / 100);
      };
    }

    if (muteBtn) {
      muteBtn.onclick = () => {
        toggleMute();
        syncMenuMuteBtn();
      };
    }

    if (!isSpec && el('btn-menu-restart')) {
      const confirmBox = el('menu-restart-confirm');
      el('btn-menu-restart').onclick = () => {
        if (!restartArmed) {
          restartArmed = true;
          confirmBox?.classList.remove('hidden');
          if (window.KLB.Audio?.playSfx) window.KLB.Audio.playSfx('ui_click');
        } else {
          const cid = state.player.id;
          clearActiveRunSnapshot();
          closeModal();
          startNewRun(cid, false);
        }
      };
      if (el('btn-menu-restart-cancel')) {
        el('btn-menu-restart-cancel').onclick = () => {
          restartArmed = false;
          confirmBox?.classList.add('hidden');
        };
      }
      if (el('btn-menu-restart-go')) {
        el('btn-menu-restart-go').onclick = () => {
          const cid = state.player.id;
          clearActiveRunSnapshot();
          closeModal();
          startNewRun(cid, false);
        };
      }
    }

    el('btn-menu-title').onclick = () => {
      if (!isSpec && !state.gameOver && !state.postAuditCelebration) {
        saveActiveRunSnapshot(true);
      }
      closeModal();
      renderTitleScreen();
    };
  }

  function syncPauseButtonUI() {
    const btn = el('btn-pause-toggle');
    if (!btn || !state) return;
    const paused = Boolean(state.paused || state.isPaused);
    const sig = paused ? '1' : '0';
    if (sig === lastPauseUiSig) return;
    lastPauseUiSig = sig;
    btn.classList.toggle('paused', paused);
    btn.innerHTML = `${icon(paused ? 'play' : 'pause', 14)}<span>${paused ? 'Resume' : 'Pause'}</span>`;
  }

  function simCallbacks() {
    return {
      isModalOpen: () => !el('modal-backdrop').classList.contains('hidden'),
      onToast: msg => showAlertBanner(msg, 4500, false),
      onAlertClear: () => {
        hideAlertBanner();
        syncAudioAmbience();
      },
      onBirthday: () => {
        if (window.KLB.Audio?.playSfx) window.KLB.Audio.playSfx('birthday');
      },
      onSweepAlert: () => {
        if (window.KLB.Audio?.playSfx) window.KLB.Audio.playSfx('sweep_alert');
        if (window.KLB.Sim?.loadArchive) archive = window.KLB.Sim.loadArchive();
      },
      onSpecialEvent: (type) => {
        if (window.KLB.Sim?.loadArchive) archive = window.KLB.Sim.loadArchive();
        if (state?.spectatorMode) return;
        if (type === 'fire_alarm_test') {
          syncAudioAmbience();
          if (state.player && (state.player.roomId === 'klb_2f' || state.player.roomId === 'klb_3f')) {
            openFireAlarmModal();
          }
        } else if (type === 'alex_king_1718') {
          syncAudioAmbience();
          openAlexStealthEncounter();
        }
      },
      onChoiceEvent: ev => {
        if (window.KLB.Sim?.loadArchive) archive = window.KLB.Sim.loadArchive();
        if (!state?.spectatorMode) openRandomEventChoiceModal(ev);
      },
      onJobStatusChange: (job, prev, next) => {
        if (!state || state.spectatorMode || !job) return;
        if (next === 'ready') {
          const curStep = getCurrentCampaignStep();
          const curSub = getCurrentSubTask(curStep);
          const nextSub = curStep?.subTasks?.[job.subTaskIdx + 1];
          if (curStep && curStep.index === job.stepIdx && curSub && curSub.id === job.subTaskId && nextSub && nextSub.requiresJobFromPrev) {
            if (!state.completedSubTasks.includes(job.subTaskId)) {
              state.completedSubTasks.push(job.subTaskId);
            }
            state.campaignSubTaskIdx = job.subTaskIdx + 1;
            showAlertBanner(`${job.label} complete! Proceed to ${nextSub.label}.`, 4200, false);
          } else {
            showAlertBanner(`${job.label} is ready at its station!`, 4000, false);
          }
          syncAllHUD(true);
        } else if (next === 'sweet') {
          showAlertBanner(`${job.label} reached its Sweet-Spot Window! Work it up before it overcooks.`, 4500, false);
          syncAllHUD(true);
        } else if (next === 'overcooked') {
          showAlertBanner(`${job.label} is OVERCOOKING! Quench immediately!`, 5000, true);
          syncAllHUD(true);
        }
      },
      onPlayerActionComplete: act => {
        if (!state || state.spectatorMode || !act) return;
        handlePlayerActionComplete(act);
      },
      onFridayMorningMeeting: () => {
        if (!state?.spectatorMode) triggerFridayMorningWelcome();
      },
      onForceEndOfDay: () => {
        if (!state?.spectatorMode && !state?.postAuditCelebration) endCurrentDay(true);
      },
      onPermadeath: reason => {
        if (!state?.spectatorMode) openPermadeathModal(reason);
      }
    };
  }

  let alertTimeout = null;
  let lastWarningSfxTs = 0;
  function showAlertBanner(text, ms = 4200, danger = false) {
    const b = el('live-alert-banner');
    lastAlertBannerSig = '';
    b.className = danger ? 'danger' : '';
    b.innerHTML = `${icon(danger ? 'alert-triangle' : 'alert-circle', 14)}<span>${escHtml(text)}</span>`;
    b.classList.remove('hidden');
    if (danger && window.KLB.Audio?.playSfx) {
      const now = Date.now();
      if (now - lastWarningSfxTs > 1200) {
        lastWarningSfxTs = now;
        window.KLB.Audio.playSfx('warning');
      }
    }
    if (alertTimeout) clearTimeout(alertTimeout);
    alertTimeout = setTimeout(() => {
      if (!state?.safetySweep?.active && !state?.fireAlarm?.active) {
        b.classList.add('hidden');
      }
    }, ms);
  }

  function hideAlertBanner() {
    if (alertTimeout) {
      clearTimeout(alertTimeout);
      alertTimeout = null;
    }
    lastAlertBannerSig = '';
    const b = el('live-alert-banner');
    if (b) {
      delete b.dataset.sticky;
      b.classList.add('hidden');
    }
  }

  function syncAudioAmbience() {
    if (!window.KLB.Audio || !state) return;
    window.KLB.Audio.setRoomAmbience({
      roomId: getViewRoom(),
      headphonesOn: state.spectatorMode ? false : state.player.headphonesOn,
      lotrOn: state.lotrPlaying,
      fireAlarmOn: state.fireAlarm.active,
      alexPursuitOn: Boolean(alexPursuitActive)
    });
    if (window.KLB.Audio.setPaused) {
      window.KLB.Audio.setPaused(Boolean((state.paused || state.isPaused) && !alexPursuitActive));
    }
  }

  // ==================== 3. PLAYER MOVEMENT, COLLISION & CLICK-TO-WALK ====================
  function cancelActivePlayerAction(silent = false) {
    if (!state || !state.activePlayerAction) return;
    const act = state.activePlayerAction;
    state.activePlayerAction = null;
    const refundCost = (act.kind === 'repurify_figure' || act.kind === 'fix_lcms')
      ? (Number(act.favourCost) || (act.kind === 'repurify_figure' ? 2 : (act.priorityFlush ? 1 : 0)))
      : 0;
    if (refundCost > 0) {
      addFavours(refundCost);
    }
    if (!silent) {
      if (act.kind === 'weekly_report') {
        showAlertBanner(`Paused Weekly Report (${Math.round(state.weeklyReportProgress || 0)}% saved).`, 2400, false);
      } else if (act.kind === 'manuscript_draft') {
        showAlertBanner(`Paused Manuscript Draft (${Math.round(state.manuscriptProgress || 0)}% saved).`, 2400, false);
      } else if (act.kind === 'repurify_figure') {
        showAlertBanner(`Cancelled re-purification (refunded ${refundCost || 2} Favours).`, 2600, false);
      } else if (act.kind === 'fix_lcms' && refundCost > 0) {
        showAlertBanner(`Cancelled priority LC-MS flush (refunded ${refundCost} Favour).`, 2600, false);
      } else {
        showAlertBanner(`Cancelled ${act.label || 'action'}.`, 2200, false);
      }
    }
    syncAllHUD(true);
  }

  const COMPACT_BENCHTOP_EQUIP = new Set(['ph_probe', 'base_bath', 'syringe_pump']);
  const UNDERLYING_SURFACE_TYPES = new Set(['lab_bench', 'bench', 'bench_table', 'fumehood', 'writeup_desk', 'meeting_table']);

  function pickPrioritizedStationHit(hits, curSub = null, roomId = state?.player?.roomId) {
    if (!Array.isArray(hits) || !hits.length) return null;
    const compactEquip = hits.find(o => COMPACT_BENCHTOP_EQUIP.has(o.type)) || null;
    const jobMatch = hits.find(h =>
      (state?.activeStationJobs || []).some(j => j.roomId === roomId && j.objId === h.id) &&
      (!compactEquip || COMPACT_BENCHTOP_EQUIP.has(h.type) || !UNDERLYING_SURFACE_TYPES.has(h.type))
    ) || null;
    const subMatch = curSub
      ? hits.find(h => matchesSubTaskStation(h, curSub) && (!compactEquip || COMPACT_BENCHTOP_EQUIP.has(h.type) || !UNDERLYING_SURFACE_TYPES.has(h.type)))
      : null;
    const surfaces = new Set(['lab_bench', 'bench', 'bench_table', 'writeup_desk', 'meeting_table']);
    const nonSurf = hits.filter(o => !surfaces.has(o.type));
    return jobMatch || subMatch || compactEquip || nonSurf[nonSurf.length - 1] || hits[hits.length - 1] || null;
  }

  function getFacingTarget() {
    if (!state || state.spectatorMode) return { gx: 0, gy: 0, obj: null, npc: null, allHits: [] };
    const p = state.player;
    const dMap = { N: [0, -1], S: [0, 1], W: [-1, 0], E: [1, 0] };
    const [dx, dy] = dMap[p.dir] || [0, 1];
    const gx = Math.round(p.x) + dx;
    const gy = Math.round(p.y) + dy;
    const curX = Math.round(p.x);
    const curY = Math.round(p.y);

    let hitNpc = null;
    let bestDist = 99;
    for (const npc of Object.values(state.npcs)) {
      if (npc.roomId !== p.roomId) continue;
      const dToFacing = Math.hypot(npc.x - gx, npc.y - gy);
      const dToPlayer = Math.hypot(npc.x - p.x, npc.y - p.y);
      const dot = (npc.x - p.x) * dx + (npc.y - p.y) * dy;
      if (dToFacing < 0.78 || (dToPlayer <= 1.25 && dot > 0.35)) {
        if (dToFacing < bestDist) {
          bestDist = dToFacing;
          hitNpc = npc;
        }
      }
    }

    const rm = window.KLB.WORLD_MAPS.rooms[p.roomId];
    let hitObj = null;
    let hits = [];
    if (rm) {
      hits = rm.objects.filter(o => o.type !== 'npc_marker' && gx >= o.x && gx < o.x + o.w && gy >= o.y && gy < o.y + o.h);
      const curSub = getCurrentSubTask();
      hitObj = pickPrioritizedStationHit(hits, curSub, p.roomId);

      if (!hitObj) {
        const underfoot = rm.objects.filter(o => o.type !== 'npc_marker' && curX >= o.x && curX < o.x + o.w && curY >= o.y && curY < o.y + o.h);
        hitObj = underfoot[underfoot.length - 1] || null;
        if (!hits.length) hits = underfoot;
      }
    }
    return { gx, gy, obj: hitObj, npc: hitNpc, allHits: hits };
  }

  function canStandAt(roomId, fx, fy) {
    const r = 0.22;
    const pts = [
      [Math.round(fx - r), Math.round(fy - r)],
      [Math.round(fx + r), Math.round(fy - r)],
      [Math.round(fx - r), Math.round(fy + r)],
      [Math.round(fx + r), Math.round(fy + r)]
    ];
    for (const [gx, gy] of pts) {
      if (!window.KLB.Sim.isCellWalkable(roomId, gx, gy, state?.fireAlarm?.active)) return false;
    }
    if (window.KLB.Sim.isOccupiedByCharacter) {
      const currentlyOverlapping = window.KLB.Sim.isOccupiedByCharacter(state, roomId, state.player.x, state.player.y, state.player.id, 0.50);
      if (!currentlyOverlapping && window.KLB.Sim.isOccupiedByCharacter(state, roomId, fx, fy, state.player.id, 0.50)) {
        return false;
      }
    }
    return true;
  }

  function updatePlayerMovement(dt) {
    if (!state || state.spectatorMode || state.paused || state.isPaused || state.gameOver || state.victory) return;
    if (!el('modal-backdrop').classList.contains('hidden')) return;

    stepSfxCooldown = Math.max(0, stepSfxCooldown - dt);
    bumpSfxCooldown = Math.max(0, bumpSfxCooldown - dt);

    let mx = 0;
    let my = 0;
    if (keysDown.has('KeyW') || keysDown.has('ArrowUp')) my -= 1;
    if (keysDown.has('KeyS') || keysDown.has('ArrowDown')) my += 1;
    if (keysDown.has('KeyA') || keysDown.has('ArrowLeft')) mx -= 1;
    if (keysDown.has('KeyD') || keysDown.has('ArrowRight')) mx += 1;

    const p = state.player;
    const hasManualInput = mx !== 0 || my !== 0;

    if (hasManualInput) {
      p.autoPath = null;
      p.walkTarget = null;
      p.pendingInteract = null;
      if (state.activePlayerAction) {
        cancelActivePlayerAction();
      }
    }

    const eFactor = 0.68 + 0.32 * (Math.max(0, Math.min(100, Number(state.energy) || 0)) / 100);
    let speed = 5.0 * eFactor * (state.mutators?.infinite_espresso ? 1.25 : 1.0);
    if (p.id === 'peter_szijj' && state.timeMins >= 18 * 60 && state.lotrPlaying) speed += 1.0;

    let moved = false;

    if (hasManualInput) {
      if (Math.abs(mx) >= Math.abs(my)) p.dir = mx < 0 ? 'W' : 'E';
      else p.dir = my < 0 ? 'N' : 'S';

      const len = Math.hypot(mx, my);
      const nx = p.x + (mx / len) * speed * dt;
      const ny = p.y + (my / len) * speed * dt;

      const canX = canStandAt(p.roomId, nx, p.y);
      const canY = canStandAt(p.roomId, p.x, ny);
      if (canX) { p.x = nx; moved = true; }
      if (canY) { p.y = ny; moved = true; }

      // Doorway corner-sliding nudge for crisp 1-tile door traversal
      if (!canX && mx !== 0 && my === 0) {
        const alignY = Math.round(p.y);
        if (Math.abs(p.y - alignY) > 0.04 && Math.abs(p.y - alignY) < 0.45 && canStandAt(p.roomId, nx, alignY)) {
          p.y += Math.sign(alignY - p.y) * Math.min(Math.abs(alignY - p.y), speed * 0.85 * dt);
          moved = true;
        }
      } else if (!canY && my !== 0 && mx === 0) {
        const alignX = Math.round(p.x);
        if (Math.abs(p.x - alignX) > 0.04 && Math.abs(p.x - alignX) < 0.45 && canStandAt(p.roomId, alignX, ny)) {
          p.x += Math.sign(alignX - p.x) * Math.min(Math.abs(alignX - p.x), speed * 0.85 * dt);
          moved = true;
        }
      }

      if (!moved && bumpSfxCooldown <= 0) {
        bumpSfxCooldown = 0.48;
        if (window.KLB.Audio) window.KLB.Audio.playSfx('bump');
      }
    } else if (p.autoPath && p.autoPath.length > 0) {
      const next = p.autoPath[0];
      const dx = next.x - p.x;
      const dy = next.y - p.y;
      const dist = Math.hypot(dx, dy);
      p.dir = next.dir || (Math.abs(dx) >= Math.abs(dy) ? (dx < 0 ? 'W' : 'E') : (dy < 0 ? 'N' : 'S'));

      const stepLen = speed * dt;
      const tx = dist <= stepLen ? next.x : p.x + (dx / dist) * stepLen;
      const ty = dist <= stepLen ? next.y : p.y + (dy / dist) * stepLen;

      if (!window.KLB.Sim.isOccupiedByCharacter(state, p.roomId, tx, ty, p.id, 0.48)) {
        p.x = tx;
        p.y = ty;
        moved = true;
        if (dist <= stepLen) p.autoPath.shift();
      } else {
        const goal = p.autoPath[p.autoPath.length - 1];
        const reroute = goal ? window.KLB.Sim.findPathBFS(p.roomId, p.x, p.y, goal.x, goal.y, 45, state, p.id) : [];
        p.autoPath = reroute.length ? reroute : null;
      }

      if (!p.autoPath || p.autoPath.length === 0) {
        p.autoPath = null;
        p.walkTarget = null;
        if (p.pendingInteract) {
          const pend = p.pendingInteract;
          p.pendingInteract = null;
          executePendingInteract(pend);
        }
      }
    }

    p.isMoving = moved;
    if (moved) {
      p.walkAnimTimer += dt * 8.5;
      p.walkFrame = Math.floor(p.walkAnimTimer) % 4;
      if (stepSfxCooldown <= 0) {
        stepSfxCooldown = 0.28;
        if (window.KLB.Audio) window.KLB.Audio.playSfx('step');
      }
      if (!el('rpg-dialogue-box').classList.contains('hidden') && state._dlgOrigin) {
        if (Math.hypot(p.x - state._dlgOrigin.x, p.y - state._dlgOrigin.y) > 1.45) {
          closeDialogue();
        }
      }
      const rm = window.KLB.WORLD_MAPS.rooms[p.roomId];
      const gx = Math.round(p.x);
      const gy = Math.round(p.y);
      if (rm && rm.tiles[gy]?.[gx] === 8 && state.fireAlarm.active) {
        completeFireEvacuation();
      }
    } else {
      p.walkFrame = 0;
    }
  }

  function updateSpectatorCamera(dt) {
    if (!state || !state.spectatorMode) return;
    if (!el('modal-backdrop').classList.contains('hidden')) return;

    const viewRoom = getViewRoom();
    const rm = window.KLB.WORLD_MAPS?.rooms?.[viewRoom];
    if (!rm) return;

    let panX = 0;
    let panY = 0;
    if (keysDown.has('KeyW') || keysDown.has('ArrowUp')) panY -= 1;
    if (keysDown.has('KeyS') || keysDown.has('ArrowDown')) panY += 1;
    if (keysDown.has('KeyA') || keysDown.has('ArrowLeft')) panX -= 1;
    if (keysDown.has('KeyD') || keysDown.has('ArrowRight')) panX += 1;

    if (panX !== 0 || panY !== 0) {
      if (cameraZoom === 'fit') {
        cameraZoom = 1.0;
        syncZoomSelectUI();
      }
      if (specFollowNpcId) {
        specFollowNpcId = null;
        syncSpecFollowBadge();
        renderLabBookPane(true);
      }
      if (!specCameraPos) {
        specCameraPos = getRoomCenterTile(viewRoom);
      }
      const len = Math.hypot(panX, panY) || 1;
      const panSpeed = 10.5;
      specCameraPos.x = clamp(specCameraPos.x + (panX / len) * panSpeed * dt, 0, Math.max(0, rm.w - 1));
      specCameraPos.y = clamp(specCameraPos.y + (panY / len) * panSpeed * dt, 0, Math.max(0, rm.h - 1));
      return;
    }

    if (specFollowNpcId) {
      const npc = state.npcs?.[specFollowNpcId];
      if (npc && npc.roomId && npc.roomId !== 'offsite' && window.KLB.WORLD_MAPS?.rooms?.[npc.roomId]) {
        if (state.cameraRoomId !== npc.roomId) {
          state.cameraRoomId = npc.roomId;
          if (window.KLB.Sim?.syncVisibleReactionsCache) {
            window.KLB.Sim.syncVisibleReactionsCache(state);
          }
          syncAudioAmbience();
          populateTravelCombobox();
          const travelSel = el('select-travel');
          if (travelSel) {
            const roomOpt = 'room:' + npc.roomId;
            travelSel.value = Array.from(travelSel.options).some(o => o.value === roomOpt) ? roomOpt : npc.roomId;
          }
          syncAllHUD(true);
        }
        specCameraPos = { x: npc.x, y: npc.y };
      }
    }
  }

  function executePendingInteract(pend) {
    if (!pend || !state) return;
    if (pend.sitChair) {
      const ch = pend.sitChair;
      if (!window.KLB.Sim.isOccupiedByCharacter?.(state, state.player.roomId, ch.x, ch.y, state.player.id, 0.48)) {
        state.player.x = ch.x;
        state.player.y = ch.y;
        state.player.dir = ch.dir || 'N';
        if (window.KLB.Audio?.playSfx) window.KLB.Audio.playSfx('ui_click');
      }
      return;
    }
    if (pend.npcId) {
      const liveNpc = state.npcs[pend.npcId];
      if (liveNpc && liveNpc.roomId === state.player.roomId) {
        const dx = liveNpc.x - state.player.x;
        const dy = liveNpc.y - state.player.y;
        state.player.dir = Math.abs(dx) >= Math.abs(dy) ? (dx < 0 ? 'W' : 'E') : (dy < 0 ? 'N' : 'S');
        if (Math.hypot(dx, dy) <= 2.4) interactWithNPC(liveNpc);
        return;
      }
    }
    if (pend.obj) {
      const nearX = clamp(state.player.x, pend.obj.x, pend.obj.x + (pend.obj.w || 1) - 1);
      const nearY = clamp(state.player.y, pend.obj.y, pend.obj.y + (pend.obj.h || 1) - 1);
      if (Math.hypot(state.player.x - nearX, state.player.y - nearY) > 2.4) return;
      const cx = pend.obj.x + (pend.obj.w - 1) * 0.5;
      const cy = pend.obj.y + (pend.obj.h - 1) * 0.5;
      const dx = cx - state.player.x;
      const dy = cy - state.player.y;
      state.player.dir = Math.abs(dx) >= Math.abs(dy) ? (dx < 0 ? 'W' : 'E') : (dy < 0 ? 'N' : 'S');
      if (pend.obj.type === 'fire_exit_tile') {
        if (state.fireAlarm.active) completeFireEvacuation();
        return;
      }
      interactWithObject(pend.obj, pend.allHits || [pend.obj]);
    }
  }

  function triggerInteract() {
    if (!state || state.spectatorMode || state.gameOver || state.victory) return;
    if (!el('modal-backdrop').classList.contains('hidden')) return;

    const dlg = el('rpg-dialogue-box');
    if (!dlg.classList.contains('hidden')) {
      const primaryBtn = el('rpg-actions')?.querySelector('.rpg-btn.primary:not(:disabled)');
      if (state._dlgQuickClose || !primaryBtn) closeDialogue();
      else primaryBtn.click();
      return;
    }

    const { gx, gy, obj, npc, allHits } = getFacingTarget();
    if (window.KLB.Audio) window.KLB.Audio.playSfx('interact');

    const rm = window.KLB.WORLD_MAPS.rooms[state.player.roomId];
    if (rm && rm.tiles[gy]?.[gx] === 8) {
      if (state.fireAlarm.active) {
        completeFireEvacuation();
      } else {
        showDialogue(state.player.id, 'Emergency Fire Exit', 'Alarmed emergency exit. Use only during a Fire Alarm evacuation (use the Right Exit Door to travel to Bloomsbury and CIB).', [{ label: '[1] Close', primary: true, onClick: closeDialogue }], true);
      }
      return;
    }

    if (obj && npc) {
      const curSub = getCurrentSubTask();
      const onJobOrSub = (curSub && allHits.some(h => matchesSubTaskStation(h, curSub)))
        || (state.activeStationJobs || []).some(j => j.roomId === state.player.roomId && allHits.some(h => h.id === j.objId));
      const npcOnFacingTile = Math.hypot(npc.x - gx, npc.y - gy) < 0.72;
      if (onJobOrSub && !npcOnFacingTile) {
        interactWithObject(obj, allHits);
        return;
      }
    }

    if (npc) {
      interactWithNPC(npc);
      return;
    }

    if (obj) {
      interactWithObject(obj, allHits);
    }
  }

  // ==================== 4. NPC FACE-TO-FACE INTERACTION ====================
  function interactWithNPC(npc) {
    const meta = window.KLB.CAST_BY_ID[npc.id];
    if (!meta) return;

    if (npc.pendingRoomTravel && !state.evacuating && !npc.evacuating && !state.fireAlarm?.active && !npc.pendingRoomTravel.isFireEvac) {
      npc.pendingRoomTravel = null;
    }

    if (window.KLB.Audio?.playSfx) window.KLB.Audio.playSfx('chat_pop');

    const dx = state.player.x - npc.x;
    const dy = state.player.y - npc.y;
    npc.dir = Math.abs(dx) >= Math.abs(dy) ? (dx < 0 ? 'W' : 'E') : (dy < 0 ? 'N' : 'S');

    const alreadyTalking = Boolean(
      npc.huddleTarget?.partnerIds?.includes(state.player.id) &&
      (npc.huddleLockTimer || 0) > 0
    );

    const quartetWinKey = getCoffeeQuartetWindowKey(state);
    const needsKersti = npc.id === 'kersti_karu' && Boolean(state.lcmsBroken);
    const needsAbil = npc.id === 'abil_aliev' && Boolean(state.abilFineOwed);
    const needsQuartet = Boolean(
      window.KLB.Sim.isCoffeeQuartetWindow(state) &&
      state.player.roomId === 'gordons_cafe' &&
      state._quartetJoinedWindowKey !== quartetWinKey &&
      (window.KLB.COFFEE_QUARTET?.members || []).includes(npc.id)
    );
    const needsMaxTcep = state.player.id === 'maximillian_lee' && !state.prep.tcep_buffered && Boolean(meta.playable);
    const hasUrgentAction = needsKersti || needsAbil || needsQuartet || needsMaxTcep;

    let convo = null;
    if (!alreadyTalking) {
      convo = window.KLB.Sim.startPairConversation(state, state.player.id, npc.id, state.player.roomId);
      if (convo?.mode === 'birthday') {
        showAlertBanner(`Wished ${meta.shortName} happy birthday (+4 Morale, +5 Social).`, 3200, false);
      } else if (convo?.socialApplied) {
        showAlertBanner(`Started conversation with ${meta.shortName} (+7 Social, +3 Morale).`, 2800, false);
      } else if (!hasUrgentAction) {
        showAlertBanner(`Chatting with ${meta.shortName} (click again for bench options).`, 2400, false);
      }
      syncAllHUD(true);
      if (!hasUrgentAction) {
        return;
      }
    } else {
      syncAllHUD(true);
    }

    const speech = npc.currentTaskSpeech
      || window.KLB.Sim.getSpeechLineForNpc(npc, true, state)?.text
      || window.KLB.Sim.pickQuoteForNpc(state, npc.id)
      || 'Busy shift in KLB today.';

    const baseTaskMeta = npc.currentTaskText ? `Activity: ${npc.currentTaskText}` : (meta.role || '');
    const socialNote = convo
      ? (convo.socialApplied ? ' (+7 Social)' : ' (Already chatted recently)')
      : ' (In conversation)';
    const taskMeta = baseTaskMeta ? `${baseTaskMeta}${socialNote}` : socialNote.trim();

    const actions = [];
    const curStep = getCurrentCampaignStep();
    const hasFavour = (Number(state.favours) || 0) >= 1;

    if (npc.id === 'marco_sabatini' && !state.prep.sabatini_tlc_jar) {
      actions.push({
        label: hasFavour
          ? "[1] Borrow Marco's Heirloom TLC Jar (1 Favour)"
          : "[1] Borrow Marco's Heirloom TLC Jar (Requires 1 Favour)",
        primary: hasFavour,
        disabled: !hasFavour,
        disabledTitle: "Requires 1 Favour to borrow Marco's heirloom TLC jar",
        onClick: () => {
          if ((Number(state.favours) || 0) < 1) return;
          if (window.KLB.Audio?.playSfx) window.KLB.Audio.playSfx('ui_click');
          addFavours(-1);
          state.prep.sabatini_spritz = true;
          state.prep.sabatini_tlc_jar = true;
          state.prep.tlc_check = true;
          state.morale = Math.min(100, state.morale + 10);
          const pLine = 'Cheers Marco, borrowing your heirloom TLC jar!';
          const nLine = 'Magnifico! Treat the heirloom jar kindly.';
          staggerNpcExchange(
            state.player.roomId,
            [state.player.id, npc.id],
            [{ speakerId: state.player.id, line: pLine }, { speakerId: npc.id, line: nLine }],
            'marco_tlc'
          );
          showDialogue(npc.id, meta.name, 'Magnifico. With Sabatini by Sabatini and my TLC chamber, your Rf and facility charisma are set.', [{ label: '[1] Grazie Marco', primary: true, onClick: closeDialogue }], true);
          syncAllHUD(true);
        }
      });
    }

    if (npc.id === 'daniel_richards' && (state.lcmsBroken || !state.prep.dry_solvent)) {
      const needLcmsHelp = Boolean(state.lcmsBroken);
      actions.push({
        label: hasFavour
          ? (needLcmsHelp ? '[1] Borrow Dry Stock & Clear LC-MS (1 Favour)' : '[1] Borrow Dry Stock (1 Favour)')
          : (needLcmsHelp ? '[1] Borrow Dry Stock & Clear LC-MS (Requires 1 Favour)' : '[1] Borrow Dry Stock (Requires 1 Favour)'),
        primary: hasFavour,
        disabled: !hasFavour,
        disabledTitle: 'Requires 1 Favour to borrow dry stock',
        onClick: () => {
          if ((Number(state.favours) || 0) < 1) return;
          if (window.KLB.Audio?.playSfx) window.KLB.Audio.playSfx('ui_click');
          addFavours(-1);
          if (needLcmsHelp) state.lcmsBroken = false;
          state.prep.dry_solvent = true;
          const pLine = 'Dan, can I borrow dry stock and a favour?';
          const nLine = 'Sorted — grabbed from my bay.';
          staggerNpcExchange(
            state.player.roomId,
            [state.player.id, npc.id],
            [{ speakerId: state.player.id, line: pLine }, { speakerId: npc.id, line: nLine }],
            'dan_dry_stock'
          );
          showDialogue(npc.id, meta.name, needLcmsHelp
            ? 'Sorted your dry solvent stock and sweet-talked Kersti to clear the LG11 LC-MS queue.'
            : 'Here is a dry aliquot jar and spare stock from my bay — keep it under Argon.', [{ label: '[1] Legend Dan', primary: true, onClick: closeDialogue }], true);
          syncAllHUD(true);
        }
      });
    }

    if (npc.currentTaskText && (meta.playable || ['nafsika_forte', 'archie_wall', 'marco_sabatini', 'charlotte_coomber'].includes(npc.id))) {
      actions.push({
        label: `[${actions.length + 1}] Ask about their experiment`,
        primary: actions.length === 0,
        onClick: () => {
          const job = npc.sim?.activeJob || npc.sim?.activeRxn;
          const detail = job
            ? `Running "${job.title}" (${Math.round(job.elapsedMins)} / ${job.targetMins} min window, status: ${job.status}). ${npc.sim?.failures?.length ? 'Had a minor hiccup earlier this week.' : 'Everything tracks clean so far.'}`
            : `Currently focused on: ${npc.currentTaskText}.${npc.sim ? ` Progress: ${npc.sim.completedSteps.length}/5 steps, Manuscript: ${Math.round(npc.sim.manuscriptProgress)}%.` : ''}`;
          const conciseBubble = job
            ? `Running ${job.title} right now.`
            : `Focused on ${npc.currentTaskText}.`;
          const pLine = 'How is your experiment looking?';
          staggerNpcExchange(
            state.player.roomId,
            [state.player.id, npc.id],
            [{ speakerId: state.player.id, line: pLine }, { speakerId: npc.id, line: conciseBubble }],
            'npc_exp_ask'
          );
          showDialogue(npc.id, meta.name, detail, [{ label: '[1] Carry on', primary: true, onClick: closeDialogue }], true, taskMeta);
        }
      });
    }

    const canGiveProtocolHint = Boolean(
      curStep && (
        meta.playable ||
        npc.id === 'antoine_maruani' ||
        (state.player.id === 'antoine_maruani' && npc.id === 'vijay_chudasama') ||
        (state.player.id === 'archie_wall' && npc.id === 'jamie_baker')
      )
    );
    if (canGiveProtocolHint) {
      const isAntoine = npc.id === 'antoine_maruani';
      const isVijayForAntoine = state.player.id === 'antoine_maruani' && npc.id === 'vijay_chudasama';
      const isJamieForArchie = state.player.id === 'archie_wall' && npc.id === 'jamie_baker';
      const hintBtnLabel = isAntoine
        ? '#AskAntoine Advice (In Person — 0m)'
        : isVijayForAntoine
          ? '#AskVijay Advice (In Person — 0m)'
          : isJamieForArchie
            ? '#AskJamie Advice (In Person — 0m)'
            : `Ask ${meta.shortName} for protocol hint (In Person — 0m)`;
      actions.push({
        label: `[${actions.length + 1}] ${hintBtnLabel}`,
        primary: actions.length === 0,
        onClick: () => {
          const parsedChuds = parseHintSpeakerAndBody(curStep.choice?.askChudsHint);
          const parsedAntoine = parseHintSpeakerAndBody(curStep.choice?.antoineHint);
          let hintText = '';
          if (isAntoine || isVijayForAntoine || isJamieForArchie) {
            hintText = parsedAntoine.body || meta.hintLine || 'Check your controls and stoichiometric equivalents cleanly.';
          } else if (parsedChuds.speakerId === npc.id && parsedChuds.body) {
            hintText = parsedChuds.body;
          } else if (meta.hintLine) {
            hintText = parsedChuds.body
              ? `${meta.hintLine} (${parsedChuds.speakerName || 'Group chat'} also suggested: "${parsedChuds.body}")`
              : meta.hintLine;
          } else {
            hintText = parsedChuds.body || 'Check your controls and keep reagents anhydrous.';
          }
          const pLine = 'Quick protocol check?';
          const nLine = 'Check your controls and keep it dry!';
          staggerNpcExchange(
            state.player.roomId,
            [state.player.id, npc.id],
            [{ speakerId: state.player.id, line: pLine }, { speakerId: npc.id, line: nLine }],
            'npc_proto_hint'
          );
          showDialogue(npc.id, `${meta.name} — Protocol Hint`, hintText, [{ label: '[1] Thanks', primary: true, onClick: closeDialogue }], true, taskMeta);
          syncAllHUD(true);
        }
      });
    }

    if (state.player.id === 'maximillian_lee' && !state.prep.tcep_buffered && meta.playable) {
      actions.push({
        label: `[${actions.length + 1}] Borrow Buffered 10 mM TCEP`,
        onClick: () => {
          if (window.KLB.Audio?.playSfx) window.KLB.Audio.playSfx('ui_click');
          state.prep.tcep_buffered = true;
          staggerNpcExchange(
            state.player.roomId,
            [state.player.id, npc.id],
            [
              { speakerId: state.player.id, line: 'Got any buffered 10 mM TCEP?' },
              { speakerId: npc.id, line: 'Fresh pH 8.0 BBS aliquot — keep the bottle capped!' }
            ],
            'max_tcep_borrow'
          );
          showDialogue(npc.id, meta.name, 'Classic Max refusing to weigh TCEP. Here is 100 µL fresh pH 8.0 BBS-buffered 10 mM TCEP.', [{ label: '[1] Cheers', primary: true, onClick: closeDialogue }], true);
          syncAllHUD(true);
        }
      });
    }

    if (npc.id === 'nafsika_forte') {
      const salveUsed = Boolean(state._salveToday);
      actions.push({
        label: `[${actions.length + 1}] First Aid Salve` + (salveUsed ? ' (Used Today)' : ' (+10 Lab Condition, +8 Energy)'),
        disabled: salveUsed,
        disabledTitle: 'Already used Nafsika First Aid Salve today',
        onClick: () => {
          if (state._salveToday) return;
          if (window.KLB.Audio?.playSfx) window.KLB.Audio.playSfx('ui_click');
          state._salveToday = true;
          window.KLB.Sim.setLabCondition(state, window.KLB.Sim.getLabCondition(state) + 10);
          state.energy = Math.min(100, state.energy + 8);
          staggerNpcExchange(
            state.player.roomId,
            [state.player.id, npc.id],
            [
              { speakerId: state.player.id, line: 'Need a quick salve and plaster.' },
              { speakerId: npc.id, line: 'Sorted — shout on WhatsApp if you get stuck late!' }
            ],
            'nafsika_salve'
          );
          const sup = getSupervisorMeta();
          showDialogue(npc.id, meta.name, `Patched up. Shout via ${sup.chatName} WhatsApp rescue if you get stuck offsite late.`, [{ label: '[1] Thanks Nafsika', primary: true, onClick: closeDialogue }], true);
          syncAllHUD(true);
        }
      });
      if (!state.prep.dry_solvent) {
        actions.push({
          label: hasFavour
            ? `[${actions.length + 1}] Borrow Anhydrous DMF (1 Favour)`
            : `[${actions.length + 1}] Borrow Anhydrous DMF (Requires 1 Favour)`,
          disabled: !hasFavour,
          disabledTitle: 'Requires 1 Favour to borrow anhydrous DMF',
          onClick: () => {
            if ((Number(state.favours) || 0) < 1) return;
            if (window.KLB.Audio?.playSfx) window.KLB.Audio.playSfx('ui_click');
            addFavours(-1);
            state.prep.dry_solvent = true;
            staggerNpcExchange(
              state.player.roomId,
              [state.player.id, npc.id],
              [
                { speakerId: state.player.id, line: 'Could I grab fresh septum-sealed DMF?' },
                { speakerId: npc.id, line: 'Straight from the Baker fridge — keep it dry.' }
              ],
              'nafsika_dmf'
            );
            showDialogue(npc.id, meta.name, 'Here is fresh septum-sealed DMF from the Baker fridge.', [{ label: '[1] Lifesaver', primary: true, onClick: closeDialogue }], true);
            syncAllHUD(true);
          }
        });
      }
    }

    if (npc.id === 'kersti_karu' && state.lcmsBroken) {
      const kerstiFlushMins = state.player.id === 'daniel_richards' ? 10 : 20;
      actions.push({
        label: hasFavour
          ? '[1] Priority Flush (1 Favour)'
          : '[1] Priority Flush (Requires 1 Favour)',
        primary: hasFavour,
        disabled: !hasFavour,
        disabledTitle: 'Requires 1 Favour for Priority Flush',
        onClick: () => {
          if ((Number(state.favours) || 0) < 1) return;
          if (window.KLB.Audio?.playSfx) window.KLB.Audio.playSfx('ui_click');
          closeDialogue();
          if (state.activePlayerAction) {
            showAlertBanner('Finish or step away from your current action first.', 3000, false);
            return;
          }
          addFavours(-1);
          state.activePlayerAction = {
            kind: 'fix_lcms',
            priorityFlush: true,
            favourCost: 1,
            roomId: 'cib_lg11_ms',
            objId: 'obj_kersti_desk',
            x: npc.x,
            y: npc.y,
            label: 'Priority LG11 LC-MS Flush',
            shortLabel: 'Priority Flush',
            elapsedMins: 0,
            targetMins: 8
          };
          showAlertBanner('Running Priority LG11 Q-TOF flush (8m).', 3200, false);
          syncAllHUD(true);
        }
      });
      actions.push({
        label: `[2] Help Kersti Flush (${kerstiFlushMins}m)`,
        primary: !hasFavour,
        onClick: () => {
          closeDialogue();
          if (state.activePlayerAction) {
            showAlertBanner('Finish or step away from your current action first.', 3000, false);
            return;
          }
          state.activePlayerAction = {
            kind: 'fix_lcms',
            priorityFlush: false,
            favourCost: 0,
            roomId: 'cib_lg11_ms',
            objId: 'obj_kersti_desk',
            x: npc.x,
            y: npc.y,
            label: 'Flushing LG11 LC-MS',
            shortLabel: 'Flush LC-MS',
            elapsedMins: 0,
            targetMins: kerstiFlushMins
          };
          showAlertBanner(`Helping Kersti flush PEG from LG11 Q-TOF column (${kerstiFlushMins}m).`, 3200, false);
          syncAllHUD(true);
        }
      });
    }

    if (npc.id === 'abil_aliev' && state.abilFineOwed) {
      actions.push({
        label: hasFavour
          ? '[1] Waive Fine (1 Favour)'
          : '[1] Waive Fine (Requires 1 Favour)',
        primary: hasFavour,
        disabled: !hasFavour,
        disabledTitle: 'Requires 1 Favour to waive fine',
        onClick: () => {
          if ((Number(state.favours) || 0) < 1) return;
          if (window.KLB.Audio?.playSfx) window.KLB.Audio.playSfx('ui_click');
          addFavours(-1);
          state.abilFineOwed = false;
          showDialogue(npc.id, meta.name, 'Fine waived. Take your tube from the Sample Fridge in the NMR room.', [{ label: '[1] Thanks Dr Aliev', primary: true, onClick: closeDialogue }], true);
          syncAllHUD(true);
        }
      });
      actions.push({
        label: state.prep.sabatini_spritz ? '[2] Apologise (Cologne Charm — Free)' : '[2] Apologise (-8 Patience)',
        primary: !hasFavour,
        onClick: () => {
          if (window.KLB.Audio?.playSfx) window.KLB.Audio.playSfx('ui_click');
          state.abilFineOwed = false;
          if (!state.prep.sabatini_spritz) state.patience = Math.max(0, state.patience - 8);
          showDialogue(npc.id, meta.name, state.prep.sabatini_spritz
            ? 'Very polite today. Take your tube from the Sample Fridge in the NMR room, no charge this time.'
            : 'Collect NMR tubes promptly next time. Sample Fridge in the NMR room unlocked.', [{ label: '[1] Thanks Dr Aliev', primary: true, onClick: closeDialogue }], true);
          window.KLB.Sim.checkPermadeath(state, simCallbacks());
          syncAllHUD(true);
        }
      });
    }

    if (window.KLB.Sim.isCoffeeQuartetWindow(state) && state.player.roomId === 'gordons_cafe') {
      const quartetDone = state._quartetJoinedWindowKey === quartetWinKey;
      actions.push({
        label: `[${actions.length + 1}] ` + (quartetDone ? 'Coffee Quartet (Already Joined)' : 'Join Coffee Quartet'),
        disabled: quartetDone,
        onClick: () => {
          if (state._quartetJoinedWindowKey === quartetWinKey) return;
          closeDialogue();
          startGordonAction('coffee', true, { id: 'obj_a07nbrd', x: 7, y: 11 });
        }
      });
    }

    actions.push({ label: `[${actions.length + 1}] Close`, onClick: closeDialogue });
    showDialogue(npc.id, meta.name, speech, actions, actions.length === 1, taskMeta);
  }

  // ==================== 5. SUB-TASK MATCHING, METRICS & WORKSTATION INTERACTIONS ====================
  function matchesSubTaskStation(obj, sub) {
    if (!obj || !sub || !state) return false;
    if (sub.roomId && sub.roomId !== state.player.roomId) return false;
    return Array.isArray(sub.stationTypes) && sub.stationTypes.includes(obj.type);
  }

  function removeStationJob(jobId) {
    if (!state || !Array.isArray(state.activeStationJobs)) return null;
    const idx = state.activeStationJobs.findIndex(j => j && j.id === jobId);
    if (idx >= 0) {
      const removed = state.activeStationJobs.splice(idx, 1)[0];
      state.activeReactions = state.activeStationJobs;
      return removed;
    }
    return null;
  }

  function calcStepMetrics(step, opts = {}) {
    const choiceOpt = state.curStepChoiceResult || null;
    const prevPerf = state.curStepPerf || null;
    const fromJob = opts.fromJob || null;

    let baseQuality;
    let baseYield;
    if (fromJob && typeof fromJob.prepScore === 'number') {
      baseQuality = fromJob.prepScore;
      baseYield = typeof fromJob.yieldScore === 'number' ? fromJob.yieldScore : fromJob.prepScore;
    } else if (prevPerf && typeof prevPerf.quality === 'number') {
      baseQuality = prevPerf.quality;
      baseYield = typeof prevPerf.yieldPct === 'number' ? prevPerf.yieldPct : prevPerf.quality;
    } else if (choiceOpt) {
      baseQuality = 82 + (choiceOpt.isOptimal ? 12 : -22) + (choiceOpt.purityMod || 0);
      baseYield = 80 + (choiceOpt.isOptimal ? 10 : -18) + (choiceOpt.yieldMod || 0);
    } else {
      baseQuality = 86;
      baseYield = 84;
    }

    if (typeof opts.bonusQuality === 'number') baseQuality += opts.bonusQuality;
    if (typeof opts.bonusYield === 'number') baseYield += opts.bonusYield;

    if (opts.blueDyeMishap) baseQuality -= 18;
    if (opts.tcepPenalty) {
      baseQuality -= 15;
      baseYield -= 14;
    }

    state._stepPrepCredit = state._stepPrepCredit || {};
    if (state.prep?.oven_flask && !state._stepPrepCredit.oven_flask) {
      baseQuality += 3;
      state._stepPrepCredit.oven_flask = true;
    }
    if (state.prep?.argon_balloon && !state._stepPrepCredit.argon_balloon) {
      baseYield += 3;
      state._stepPrepCredit.argon_balloon = true;
    }
    if (state.prep?.dry_solvent && !state._stepPrepCredit.dry_solvent) {
      baseQuality += 4;
      baseYield += 3;
      state._stepPrepCredit.dry_solvent = true;
    }
    if (state.prep?.tlc_check && !state._stepPrepCredit.tlc_check) {
      baseQuality += 3;
      state._stepPrepCredit.tlc_check = true;
    }
    if (state.prep?.sabatini_tlc_jar && state.prep?.tlc_check && !state._stepPrepCredit.sabatini_tlc_jar) {
      baseQuality += 3;
      baseYield += 3;
      state._stepPrepCredit.sabatini_tlc_jar = true;
    }
    if (state.prep?.ph_calibrated && !state._stepPrepCredit.ph_calibrated) {
      baseQuality += 3;
      state._stepPrepCredit.ph_calibrated = true;
    }
    if (state._stepFaizaA280Done && !state._stepPrepCredit.faiza_a280) {
      baseQuality += 4;
      state._stepPrepCredit.faiza_a280 = true;
    }

    if (state.player.id === 'andre_shamsabadi' && opts.stationType === 'biotage' && !state._stepBiotageBonusApplied) {
      baseQuality += 5;
      baseYield += 4;
      state._stepBiotageBonusApplied = true;
    }

    if (state.player.id === 'daniel_richards' && (Number(state.energy) || 0) < 25 && !state._stepDanFumbleApplied) {
      baseQuality -= 5;
      state._stepDanFumbleApplied = true;
      showAlertBanner('Low-energy bench scissors fumble below 25 Energy (-5 Quality)!', 4000, true);
    }

    if (
      state.player.id === 'archie_wall' &&
      !state._stepArchieBonusApplied &&
      (opts.stationType === 'centrifuge' || opts.stationType === 'tcep_bench' || /albumin|maleimide|hsa|cys34/i.test(step?.title || ''))
    ) {
      baseQuality += 5;
      state._stepArchieBonusApplied = true;
    }

    if (state.player.id === 'archie_wall' && (Number(state.energy) || 0) < 30 && !state._stepArchieFlawApplied) {
      state._stepArchieFlawApplied = true;
      state.morale = clamp(state.morale - 6, 0, 100);
      showAlertBanner('0.01 g Rotor Purist: rushing below 30% Energy triggered a perfectionist flare (-6 Morale).', 3800, true);
    }

    const mgScore = typeof opts.minigameScore === 'number'
      ? opts.minigameScore
      : (!fromJob && state.activeMinigameScore !== null && state.activeMinigameScore !== undefined
          ? state.activeMinigameScore
          : null);
    if (mgScore !== null) {
      baseQuality = Math.round(baseQuality * 0.8 + mgScore * 0.2);
      baseYield = Math.round(baseYield * 0.85 + mgScore * 0.15);
      if (typeof opts.minigameScore !== 'number') {
        state.activeMinigameScore = null;
      }
    }

    const quality = clamp(Math.round(baseQuality), 20, 100);
    const yieldPct = clamp(Math.round(baseYield), 18, 100);
    const blueDyeMishap = Boolean(opts.blueDyeMishap || fromJob?.blueDyeMishap || prevPerf?.blueDyeMishap);
    const outcomeText = opts.forceFlawNote || fromJob?.outcomeText || prevPerf?.outcomeText || choiceOpt?.outcomeText || 'Clean conversion recorded.';

    return { quality, yieldPct, blueDyeMishap, outcomeText };
  }

  function createLabBookFigure(step, stepIdxDone, quality, yieldPct, blueDyeMishap, notes, overrideType = null) {
    const outSpec = step.dataOutput || {
      type: 'lcms',
      label: step.title,
      productPeak: 'Expected Product Peak'
    };
    const figType = overrideType || outSpec.type || 'lcms';
    const useStepSpec = !overrideType || outSpec.type === figType;
    const titleStr = useStepSpec ? (outSpec.label || step.title) : `In-Process TLC: ${step.title}`;
    const peakStr = useStepSpec ? (outSpec.productPeak || 'Target Product') : 'Product spot (Rf = 0.44, UV 254 nm)';

    return {
      id: 'fig_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
      stepIdx: stepIdxDone,
      type: figType,
      title: titleStr,
      label: titleStr,
      productPeak: peakStr,
      quality,
      yieldPct,
      hasSolventPeak: quality < 78 && figType === 'nmr',
      hasAdduct: quality < 78 && figType === 'lcms',
      hasOverReduction: quality < 78 && figType === 'gel',
      hasBlueDyeMishap: Boolean(blueDyeMishap),
      notes: notes || 'Recorded.'
    };
  }

  function advanceSubTaskOrFinishStep(stepIdxDone, completedSubIdx, figureAlreadyOpened = false) {
    const camp = window.KLB.getCampaign(state.player.id);
    const steps = camp?.steps || [];
    const step = steps[stepIdxDone];
    const sub = step?.subTasks?.[completedSubIdx];
    if (sub && !state.completedSubTasks.includes(sub.id)) {
      state.completedSubTasks.push(sub.id);
    }

    const totalSubs = step?.subTasks?.length || 0;
    if (completedSubIdx < totalSubs - 1) {
      state.campaignSubTaskIdx = completedSubIdx + 1;
      syncAllHUD(true);
      return;
    }

    // Final sub-task of step finished: ensure step has a Lab Book figure & advance campaignStepIdx
    let openedNewFig = figureAlreadyOpened;
    if (step && !state.labBook.some(f => f.stepIdx === stepIdxDone)) {
      const m = calcStepMetrics(step);
      const figItem = createLabBookFigure(step, stepIdxDone, m.quality, m.yieldPct, m.blueDyeMishap, m.outcomeText);
      state.labBook.push(figItem);
      const moraleDelta = window.KLB.Sim.applyExperimentOutcomeToMorale(state, m.quality, m.yieldPct);
      if (!figureAlreadyOpened) {
        openedNewFig = true;
        openSpectrumPreviewModal(figItem, true, moraleDelta);
      }
    }

    if (!state.completedSteps.includes(stepIdxDone)) {
      state.completedSteps.push(stepIdxDone);
    }

    const totalSteps = steps.length || 5;
    if (state.completedSteps.length >= totalSteps) {
      state.campaignStepIdx = totalSteps;
    } else {
      let nextIdx = 0;
      while (nextIdx < totalSteps && state.completedSteps.includes(nextIdx)) nextIdx++;
      state.campaignStepIdx = nextIdx;
    }

    if (state._stepPrepCredit?.oven_flask) state.prep.oven_flask = false;
    if (state._stepPrepCredit?.argon_balloon) state.prep.argon_balloon = false;
    if (state._stepPrepCredit?.dry_solvent) state.prep.dry_solvent = false;
    if (state._stepPrepCredit?.tlc_check) state.prep.tlc_check = false;
    if (state._stepPrepCredit?.ph_calibrated) state.prep.ph_calibrated = false;

    const stepIsTcep = Boolean(
      step && (
        /rebridg|tcep|stapling|disulfide/i.test(`${step.title || ''} ${step.desc || ''}`) ||
        (step.stationTypes || []).includes('tcep_bench') ||
        (step.subTasks || []).some(st => (st.stationTypes || []).includes('tcep_bench') || /rebridg|tcep|stapling/i.test(st.label || ''))
      )
    );
    if (state.player.id === 'maximillian_lee' && stepIsTcep) {
      state.prep.tcep_buffered = false;
    }

    state.campaignSubTaskIdx = 0;
    state.completedSubTasks = [];
    state.curStepChoiceResult = null;
    state.curStepPerf = null;
    state.activeMinigameScore = null;
    state._stepPrepCredit = {};
    state._stepBiotageBonusApplied = false;
    state._stepFaizaA280Done = false;
    state._stepDanFumbleApplied = false;
    state._stepArchieBonusApplied = false;
    state._stepArchieFlawApplied = false;

    if (window.KLB.Audio) window.KLB.Audio.playSfx('success');
    if (!openedNewFig && step) {
      showAlertBanner(`Step ${stepIdxDone + 1} complete: ${step.title}!`, 4000, false);
    }
    saveActiveRunSnapshot(true);
    syncAllHUD(true);
  }

  function applyPlayerWetLabMess(roomId, stationType, label = '', cupboardLabel = '', overcooked = false) {
    if (!state || state.spectatorMode || roomId !== 'klb_2f') return;
    const lbl = `${label} ${cupboardLabel}`.toLowerCase();
    if (stationType === 'chem_cupboard' && (cupboardLabel.includes('Cupboard 5') || lbl.includes('cupboard 5') || lbl.includes('thiol'))) {
      if (!state.prep.bleach_bath) {
        window.KLB.Sim.applyWorkspaceMess(state, 18, { thiol_dirty: true });
        const c5Sender = state.player.id === 'richard_spears' ? 'daniel_richards' : 'richard_spears';
        window.KLB.Sim.pushWhatsApp(state, c5Sender, 'Who just opened Cupboard 5 without prepping the bleach bath in the Chudasama hood?!');
        showAlertBanner('Thiol stench (-18 Lab Condition)! Quench at the bleach bath in the Chudasama hood.', 4200, true);
      }
      return;
    }
    const isColumn = stationType === 'biotage' || /column|biotage|silica|chromatography/i.test(lbl);
    const isWetWait = ['fumehood', 'heatblock', 'buchi', 'biotage', 'gel_tank', 'centrifuge', 'tcep_bench', 'syringe_pump', 'fridge_4c', 'freezer_20c', 'lab_bench'].includes(stationType);
    if (!isWetWait) return;
    let amount = 10;
    if (stationType === 'fumehood' || stationType === 'buchi' || stationType === 'biotage') amount = 12;
    else if (stationType === 'gel_tank' || stationType === 'heatblock' || stationType === 'syringe_pump') amount = 10;
    else amount = 8;
    if (overcooked) amount = Math.min(14, amount + 2);
    const flags = isColumn ? { uncapped_waste: true } : {};
    window.KLB.Sim.applyWorkspaceMess(state, amount, flags);
    if (isColumn) {
      showAlertBanner(`Column run left uncapped solvent waste (-${amount} Lab Condition). Cap at Waste Bin!`, 3600, false);
    }
  }

  function applyStationPrepSideEffect(stationType, cupboardLabel = '', actLabel = '') {
    if (stationType === 'drying_oven') state.prep.oven_flask = true;
    else if (stationType === 'argon_cyl') state.prep.argon_balloon = true;
    else if (stationType === 'base_bath') {
      window.KLB.Sim.applyWorkspaceCleaning(state, 'base_bath');
    } else if (stationType === 'tlc_station') {
      state.prep.tlc_check = true;
      if (window.KLB.Audio) window.KLB.Audio.playSfx('uv_click');
    } else if (stationType === 'tcep_bench') {
      if (state.player.id !== 'maximillian_lee') state.prep.tcep_buffered = true;
    } else if (stationType === 'chem_cupboard') {
      if (isCupboardOneLabel(cupboardLabel)) state.prep.dry_solvent = true;
      if (/\bcupboard\s+5\b(?!\d)/i.test(cupboardLabel)) {
        applyPlayerWetLabMess('klb_2f', 'chem_cupboard', actLabel, cupboardLabel);
      }
    }
  }

  function handlePlayerActionComplete(act) {
    if (act.kind === 'subtask_action') {
      const camp = window.KLB.getCampaign(state.player.id);
      const step = camp?.steps?.[act.stepIdx];
      applyStationPrepSideEffect(act.stationType, act.cupboardLabel || act.cupboardHint || '', act.label || '');
      if (act.viewOutput && step) {
        const m = calcStepMetrics(step, { stationType: act.stationType });
        state.curStepPerf = m;
        const figItem = createLabBookFigure(step, act.stepIdx, m.quality, m.yieldPct, m.blueDyeMishap, m.outcomeText, act.viewOutput);
        state.labBook.push(figItem);
        const moraleDelta = window.KLB.Sim.applyExperimentOutcomeToMorale(state, m.quality, m.yieldPct);
        advanceSubTaskOrFinishStep(act.stepIdx, act.subTaskIdx, true);
        openSpectrumPreviewModal(figItem, true, moraleDelta);
      } else {
        advanceSubTaskOrFinishStep(act.stepIdx, act.subTaskIdx, false);
      }
    } else if (act.kind === 'subtask_collect') {
      const job = removeStationJob(act.jobId);
      applyPlayerWetLabMess(job?.roomId || act.roomId, job?.stationType || 'gel_tank', job?.label || act.label, '', job?.status === 'overcooked');
      const camp = window.KLB.getCampaign(state.player.id);
      const step = camp?.steps?.[act.stepIdx];
      if (step) {
        const m = calcStepMetrics(step, { fromJob: job, stationType: job?.stationType });
        state.curStepPerf = m;
        const figItem = createLabBookFigure(step, act.stepIdx, m.quality, m.yieldPct, m.blueDyeMishap, m.outcomeText, act.viewOutput);
        state.labBook.push(figItem);
        const moraleDelta = window.KLB.Sim.applyExperimentOutcomeToMorale(state, m.quality, m.yieldPct);
        advanceSubTaskOrFinishStep(act.stepIdx, act.subTaskIdx, true);
        openSpectrumPreviewModal(figItem, true, moraleDelta);
      }
    } else if (act.kind === 'weekly_report') {
      state.weeklyReportProgress = 100;
      if (window.KLB.Audio) window.KLB.Audio.playSfx('success');
      const onTimeWR = state.dayIdx < 3 || (state.dayIdx === 3 && state.timeMins < 18 * 60);
      showAlertBanner(onTimeWR ? 'Weekly Report reached 100%! Ready ahead of Thu 18:00.' : 'Weekly Report reached 100%!', 3600, false);
    } else if (act.kind === 'manuscript_draft') {
      state.manuscriptProgress = 100;
      if (window.KLB.Audio) window.KLB.Audio.playSfx('success');
      const onTimeMS = state.dayIdx < 4 || (state.dayIdx === 4 && state.timeMins < 18 * 60);
      showAlertBanner(onTimeMS ? 'Manuscript Draft reached 100%! Ready ahead of Fri 18:00.' : 'Manuscript Draft reached 100%!', 3600, false);
    } else if (act.kind === 'gaming') {
      state._lastGamingBreakMins = getMonotonicSimMins(state);
      const res = window.KLB.Sim.applyBreakEffects(state, 'gaming', hasColleaguesInRoom(state.player.roomId), state.timeMins);
      if (window.KLB.Audio) window.KLB.Audio.playSfx('lan_blip');
      const ggSender = state.player.id === 'maximillian_lee' ? 'peter_szijj' : 'maximillian_lee';
      window.KLB.Sim.pushWhatsApp(state, ggSender, 'GGs on Arabia / Ninja Rope!!');
      showAlertBanner(`AoE2 / Worms break finished (+${res.moraleDelta} Morale, +${res.socialDelta} Social).`, 3600, false);
    } else if (act.kind === 'coffee') {
      const withCol = act.quartet ? true : hasColleaguesInRoom('gordons_cafe');
      const res = window.KLB.Sim.applyBreakEffects(state, 'coffee', withCol, state.timeMins);
      if (act.quartet) {
        state._quartetJoinedWindowKey = act.quartetWinKey || getCoffeeQuartetWindowKey(state);
        const isJoao = state.player.id === 'joao_nogueira';
        const isMorningQuartet = act.quartetWinId === 'morning' || String(act.quartetWinKey || '').endsWith('_morning');
        const extraMorale = isJoao ? 16 : 0;
        const favourGain = (isJoao && isMorningQuartet) ? 2 : 1;
        if (extraMorale > 0) {
          state.morale = Math.min(100, (Number(state.morale) || 0) + extraMorale);
        }
        state.patience = Math.min(100, state.patience + 6);
        addFavours(favourGain);
        const totalMoraleShown = (res.moraleDelta || 0) + extraMorale;
        const vijayOut = Boolean(state.mutators?.vijays_not_in);
        const quartetLead = vijayOut ? 'nafsika_forte' : 'vijay_chudasama';
        const vLine = vijayOut
          ? 'Good espresso break, keep the week moving cleanly.'
          : 'Good espresso break, sharp work this week.';
        const secondId = isJoao ? 'antoine_maruani' : 'joao_nogueira';
        const secondLine = 'Top Gordon table with the crew today!';
        staggerNpcExchange(
          'gordons_cafe',
          [quartetLead, secondId],
          [{ speakerId: quartetLead, line: vLine }, { speakerId: secondId, line: secondLine }],
          'coffee_quartet'
        );
        showAlertBanner(`Joined Coffee Quartet (+${res.energyDelta} Energy, +${totalMoraleShown} Morale, +${res.socialDelta} Social, +6 Patience, +${favourGain} Favour${favourGain > 1 ? 's' : ''}).`, 4200, false);
      } else {
        state._lastCoffeeBreakMins = getMonotonicSimMins(state);
        showAlertBanner(`Gordon's coffee (+${res.energyDelta} Energy, +${res.moraleDelta} Morale, +${res.socialDelta} Social).`, 3400, false);
      }
      if (window.KLB.Audio) window.KLB.Audio.playSfx('sip');
    } else if (act.kind === 'lunch') {
      const withCol = hasColleaguesInRoom('gordons_cafe');
      const res = window.KLB.Sim.applyBreakEffects(state, 'lunch', withCol, state.timeMins);
      if (window.KLB.Audio) window.KLB.Audio.playSfx('sip');
      showAlertBanner(`Lunch at Gordon's (+${res.energyDelta} Energy, +${res.moraleDelta} Morale, +${res.socialDelta} Social).`, 3600, false);
    } else if (act.kind === 'packed_lunch') {
      const withCol = hasColleaguesInRoom('klb_3f');
      const res = window.KLB.Sim.applyBreakEffects(state, 'packed_lunch', withCol, state.timeMins);
      if (window.KLB.Audio) window.KLB.Audio.playSfx('sip');
      showAlertBanner(`Ate packed lunch on 3F (+${res.energyDelta} Energy, +${res.moraleDelta} Morale, +${res.socialDelta} Social).`, 3400, false);
    } else if (act.kind === 'tea') {
      state._lastTeaBreakMins = getMonotonicSimMins(state);
      const withCol = hasColleaguesInRoom('klb_3f');
      const res = window.KLB.Sim.applyBreakEffects(state, 'tea', withCol, state.timeMins);
      if (window.KLB.Audio) window.KLB.Audio.playSfx('sip');
      showAlertBanner(`Brewed Yorkshire Tea (+${res.energyDelta} Energy, +${res.moraleDelta} Morale, +${res.socialDelta} Social).`, 3400, false);
    } else if (act.kind === 'repurify_figure') {
      const fig = (state.labBook || []).find(f => f.id === act.figureId);
      if (fig) {
        fig.quality = Math.max(90, Math.round(Number(fig.quality) || 90));
        if (fig.yieldPct != null) fig.yieldPct = Math.max(85, Math.round(Number(fig.yieldPct) || 85));
        fig.hasSolventPeak = false;
        fig.hasAdduct = false;
        fig.hasOverReduction = false;
        fig.hasBlueDyeMishap = false;
        fig.notes = 'Re-purified and re-acquired cleanly with labmate assistance (90%+ analytical purity).';
        lastLabBookSig = '';
        if (window.KLB.Audio) window.KLB.Audio.playSfx('success');
        showAlertBanner(`Re-purified ${fig.label} to ${fig.quality}% quality!`, 3800, false);
        openSpectrumPreviewModal(fig, false);
      }
    } else if (act.kind === 'fix_lcms') {
      state.lcmsBroken = false;
      if (!act.priorityFlush) {
        addFavours(1);
      }
      if (window.KLB.Audio) window.KLB.Audio.playSfx('success');
      showAlertBanner(
        act.priorityFlush
          ? 'Priority flush complete! LG11 LC-MS is back online.'
          : 'Backpressure stable! LG11 LC-MS is back online (+1 Favour).',
        3800,
        false
      );
    } else if (act.kind === 'clean_workspace') {
      const res = window.KLB.Sim.applyWorkspaceCleaning(state, act.cleanKind);
      if (window.KLB.Audio) window.KLB.Audio.playSfx('success');
      const cName = act.cleanKind === 'sink' ? 'Washed glassware at sink'
        : act.cleanKind === 'base_bath' ? 'Neutralised thiol glassware in the bleach bath'
        : act.cleanKind === 'waste_bin' ? 'Capped & emptied solvent waste'
        : 'Tidied workspace';
      showAlertBanner(`${cName} (+${Math.round(res.delta)} Lab Condition -> ${Math.round(res.labCondition)}%).`, 3600, false);
    } else if (act.kind === 'prep_oven') {
      state.prep.oven_flask = true;
      showAlertBanner('Collected hot oven-dried Schlenk flask.', 3000, false);
    } else if (act.kind === 'prep_argon') {
      state.prep.argon_balloon = true;
      showAlertBanner('Filled double-layer Argon balloon.', 3000, false);
    } else if (act.kind === 'prep_bleach') {
      const hadStench = state.prep.thiol_dirty;
      const res = window.KLB.Sim.applyWorkspaceCleaning(state, 'base_bath');
      showAlertBanner(
        hadStench
          ? `Thiol glassware neutralised in the bleach bath in the Chudasama hood (+${Math.round(res.delta)} Lab Condition).`
          : `Topped up the bleach bath in the Chudasama hood (+${Math.round(res.delta)} Lab Condition).`,
        3400,
        false
      );
    } else if (act.kind === 'prep_tlc') {
      state.prep.tlc_check = true;
      if (window.KLB.Audio) window.KLB.Audio.playSfx('uv_click');
      openSpectrumPreviewModal({
        id: 'tlc_spot_' + Date.now(),
        type: 'tlc',
        label: `In-Process TLC (${window.KLB.Sim.formatClock(state.dayIdx, state.timeMins)})`,
        productPeak: 'Rf = 0.42 (UV 254 nm + KMnO4)',
        quality: state.prep.sabatini_tlc_jar ? 95 : 86
      }, false);
    } else if (act.kind === 'prep_tcep') {
      state.prep.tcep_buffered = true;
      const grantFavour = !state._tcepFavourToday;
      state._tcepFavourToday = true;
      if (grantFavour) addFavours(1);
      if (window.KLB.Audio?.playSfx) window.KLB.Audio.playSfx('pipette');
      window.KLB.Sim.pushWhatsApp(state, state.player.id, 'Fresh 10 mM TCEP in pH 8.0 BBS + EDTA on the TCEP bench.');
      showAlertBanner(grantFavour ? 'Prepared fresh buffered TCEP (+1 Favour).' : 'Prepared fresh buffered TCEP.', 3400, false);
    } else if (act.kind === 'prep_cupboard_1') {
      state.prep.dry_solvent = true;
      showAlertBanner('Collected anhydrous solvent from Cupboard 1.', 3000, false);
    } else if (act.kind === 'prep_cupboard_5') {
      if (!state.prep.bleach_bath) {
        window.KLB.Sim.applyWorkspaceMess(state, 18, { thiol_dirty: true });
        const c5Sender = state.player.id === 'richard_spears' ? 'daniel_richards' : 'richard_spears';
        window.KLB.Sim.pushWhatsApp(state, c5Sender, 'Who just opened Cupboard 5 without prepping the bleach bath in the Chudasama hood?!');
      }
      showAlertBanner(
        state.prep.bleach_bath ? 'Withdrew thiol safely.' : 'Thiol stench (-18 Lab Condition)! Quench at the bleach bath in the Chudasama hood.',
        4000,
        !state.prep.bleach_bath
      );
    } else if (act.kind === 'tidy_hazard') {
      state.prep.uncapped_waste = false;
      state.prep.extinguisher_displaced = false;
      window.KLB.Sim.setLabCondition(state, window.KLB.Sim.getLabCondition(state) + 6);
      showAlertBanner('Bay hazards secured and Winchesters capped ahead of inspection (+6 Lab Condition).', 3400, false);
    }

    window.KLB.Sim.checkPermadeath(state, simCallbacks());
    syncAllHUD(true);
  }

  function handleActiveStationJob(job) {
    const camp = window.KLB.getCampaign(state.player.id);
    const step = camp?.steps?.[job.stepIdx];
    const sub = step?.subTasks?.[job.subTaskIdx];

    if (job.status === 'running') {
      const pct = Math.min(99, Math.round((job.elapsedMins / Math.max(1, job.targetMins)) * 100));
      showAlertBanner(`${job.label}: ${pct}% complete.`, 2600, false);
      if (job.canOvercook) {
        showDialogue(
          state.player.id,
          job.label,
          `In progress (${pct}% complete, ${Math.floor(job.elapsedMins)}/${job.targetMins}m). Watch the Sweet-Spot bar before quenching.`,
          [
            {
              label: '[1] Quench Early (-25 Quality)',
              onClick: () => {
                closeDialogue();
                removeStationJob(job.id);
                applyPlayerWetLabMess(job.roomId, job.stationType, job.label, '', false);
                if (step) {
                  const m = calcStepMetrics(step, {
                    fromJob: job,
                    bonusQuality: -25,
                    bonusYield: -20,
                    forceFlawNote: 'Quenched early before full conversion.'
                  });
                  state.curStepPerf = m;
                  const moraleDelta = window.KLB.Sim.applyExperimentOutcomeToMorale(state, m.quality, m.yieldPct);
                  const isFinalSub = job.subTaskIdx >= (step.subTasks?.length || 1) - 1;
                  if (sub?.viewOutput || isFinalSub) {
                    const figItem = createLabBookFigure(step, job.stepIdx, m.quality, m.yieldPct, m.blueDyeMishap, m.outcomeText, sub?.viewOutput);
                    state.labBook.push(figItem);
                    advanceSubTaskOrFinishStep(job.stepIdx, job.subTaskIdx, true);
                    openSpectrumPreviewModal(figItem, true, moraleDelta);
                  } else {
                    advanceSubTaskOrFinishStep(job.stepIdx, job.subTaskIdx, false);
                    showAlertBanner(`Quenched early (${m.quality}% Quality).`, 3200, true);
                  }
                }
                window.KLB.Sim.checkPermadeath(state, simCallbacks());
                syncAllHUD(true);
              }
            },
            { label: '[2] Keep Running', primary: true, onClick: closeDialogue }
          ]
        );
      }
      return;
    }

    if (job.status === 'sweet' || job.status === 'overcooked') {
      const overcooked = job.status === 'overcooked';
      removeStationJob(job.id);
      applyPlayerWetLabMess(job.roomId, job.stationType, job.label, '', overcooked);
      if (step) {
        const m = calcStepMetrics(step, {
          fromJob: job,
          stationType: job.stationType,
          bonusQuality: overcooked ? -26 : 5,
          bonusYield: overcooked ? -22 : 4,
          forceFlawNote: overcooked
            ? 'Left past sweet-spot window — partial side products seen.'
            : (job.outcomeText || 'Cleanly harvested inside Sweet-Spot Window.')
        });
        state.curStepPerf = m;
        const moraleDelta = window.KLB.Sim.applyExperimentOutcomeToMorale(state, m.quality, m.yieldPct);
        const isFinalSub = job.subTaskIdx >= (step.subTasks?.length || 1) - 1;
        if (sub?.viewOutput || isFinalSub) {
          const figItem = createLabBookFigure(step, job.stepIdx, m.quality, m.yieldPct, m.blueDyeMishap, m.outcomeText, sub?.viewOutput);
          state.labBook.push(figItem);
          advanceSubTaskOrFinishStep(job.stepIdx, job.subTaskIdx, true);
          openSpectrumPreviewModal(figItem, true, moraleDelta);
        } else {
          advanceSubTaskOrFinishStep(job.stepIdx, job.subTaskIdx, false);
          showAlertBanner(
            overcooked
              ? `Quenched overcooked ${job.label} (${m.quality}% Quality, ${m.yieldPct}% Yield).`
              : `Cleanly harvested ${job.label} (${m.quality}% Quality, ${m.yieldPct}% Yield)!`,
            3800,
            overcooked
          );
        }
      }
      window.KLB.Sim.checkPermadeath(state, simCallbacks());
      syncAllHUD(true);
      return;
    }

    if (job.status === 'ready') {
      const nextSub = step?.subTasks?.[job.subTaskIdx + 1];
      if (step && nextSub?.requiresJobFromPrev && state.campaignStepIdx === job.stepIdx) {
        if (state.campaignSubTaskIdx === job.subTaskIdx) {
          if (!state.completedSubTasks.includes(job.subTaskId)) {
            state.completedSubTasks.push(job.subTaskId);
          }
          state.campaignSubTaskIdx = job.subTaskIdx + 1;
        }
        showAlertBanner(`${job.label} finished! Use ${nextSub.label} to view and collect results.`, 3800, false);
        syncAllHUD(true);
        return;
      }
      removeStationJob(job.id);
      applyPlayerWetLabMess(job.roomId, job.stationType, job.label, '', false);
      if (window.KLB.Audio) window.KLB.Audio.playSfx('success');
      if (step) {
        if (sub?.viewOutput && !nextSub?.requiresJobFromPrev) {
          const m = calcStepMetrics(step, { fromJob: job, stationType: job.stationType });
          state.curStepPerf = m;
          const figItem = createLabBookFigure(step, job.stepIdx, m.quality, m.yieldPct, m.blueDyeMishap, m.outcomeText, sub.viewOutput);
          state.labBook.push(figItem);
          const moraleDelta = window.KLB.Sim.applyExperimentOutcomeToMorale(state, m.quality, m.yieldPct);
          advanceSubTaskOrFinishStep(job.stepIdx, job.subTaskIdx, true);
          openSpectrumPreviewModal(figItem, true, moraleDelta);
        } else {
          state.curStepPerf = calcStepMetrics(step, { fromJob: job, stationType: job.stationType });
          advanceSubTaskOrFinishStep(job.stepIdx, job.subTaskIdx, false);
          if (job.subTaskIdx < (step.subTasks?.length || 1) - 1) {
            showAlertBanner(`Collected ${job.label}. Proceed to next sub-task.`, 3200, false);
          }
        }
      }
      window.KLB.Sim.checkPermadeath(state, simCallbacks());
      syncAllHUD(true);
    }
  }

  function prepareSubTaskExecution(step, sub, obj, onReady) {
    const runMinigameStep = () => {
      if (sub.minigame && window.KLB.Minigames) {
        openMinigameOverlay(sub.minigame, sub.label, step.title, res => {
          if (res && res.aborted) return;
          state.activeMinigameScore = res?.score ?? 85;
          onReady();
        }, sub.minigameConfig || null);
      } else {
        onReady();
      }
    };

    if (sub.triggersChoice && !state.curStepChoiceResult) {
      openProtocolChoiceModal(step, sub, chosenOpt => {
        state.curStepChoiceResult = chosenOpt;
        if (chosenOpt.safetyMod) {
          const sMod = chosenOpt.safetyMod < 0 && state.mutators?.strict_coshh
            ? chosenOpt.safetyMod * 1.5
            : chosenOpt.safetyMod;
          window.KLB.Sim.setLabCondition(state, window.KLB.Sim.getLabCondition(state) + sMod);
        }
        runMinigameStep();
      });
      return;
    }

    runMinigameStep();
  }

  function startSubTaskAtStation(step, sub, obj) {
    if (state.activePlayerAction) {
      showAlertBanner('Finish or step away from your current action first.', 3200, false);
      return;
    }

    if (sub.mode === 'collect') {
      const job = (state.activeStationJobs || []).find(j => j.stepIdx === state.campaignStepIdx);
      if (!job) {
        showAlertBanner('Run the preceding instrument or gel step first.', 3200, false);
        return;
      }
      if (job.status === 'running') {
        const pct = Math.min(99, Math.round((job.elapsedMins / Math.max(1, job.targetMins)) * 100));
        showAlertBanner(`Wait for your instrument/gel run to reach 100% first (${pct}%).`, 3200, false);
        return;
      }
      state.activePlayerAction = {
        kind: 'subtask_collect',
        roomId: state.player.roomId,
        objId: obj.id,
        x: obj.x,
        y: obj.y,
        label: sub.label,
        shortLabel: sub.label,
        elapsedMins: 0,
        targetMins: sub.durationMins || 3,
        stepIdx: state.campaignStepIdx,
        subTaskIdx: state.campaignSubTaskIdx,
        subTaskId: sub.id,
        jobId: job.id,
        viewOutput: sub.viewOutput || step.dataOutput?.type || 'lcms'
      };
      playStationSfx(obj.type);
      syncAllHUD(true);
      return;
    }

    if (sub.mode === 'action') {
      prepareSubTaskExecution(step, sub, obj, () => {
        if (state.activePlayerAction) {
          showAlertBanner('Finish or step away from your current action first.', 3200, false);
          return;
        }
        state.activePlayerAction = {
          kind: 'subtask_action',
          roomId: state.player.roomId,
          objId: obj.id,
          x: obj.x,
          y: obj.y,
          label: sub.label,
          shortLabel: sub.label,
          elapsedMins: 0,
          targetMins: sub.durationMins || 4,
          stepIdx: state.campaignStepIdx,
          subTaskIdx: state.campaignSubTaskIdx,
          subTaskId: sub.id,
          viewOutput: sub.viewOutput || null,
          triggersChoice: Boolean(sub.triggersChoice),
          minigame: sub.minigame || null,
          cupboardHint: sub.cupboardHint || null,
          cupboardLabel: obj.label || '',
          stationType: obj.type
        };
        playStationSfx(obj.type);
        syncAllHUD(true);
      });
      return;
    }

    if (sub.mode === 'wait') {
      const dup = (state.activeStationJobs || []).find(j => j.subTaskId === sub.id);
      if (dup) {
        handleActiveStationJob(dup);
        return;
      }

      if (state.player.roomId === 'cib_lg11_ms' && state.lcmsBroken) {
        showDialogue('kersti_karu', 'Dr Kersti Karu — LC-MS Offline', 'LC-MS is out of operation. Talk to me at my desk in LG11 to flush the column first.', [{ label: '[1] On it', primary: true, onClick: closeDialogue }], true);
        return;
      }
      if (state.player.roomId === 'cib_lg1b_nmr' && state.abilFineOwed) {
        showDialogue('abil_aliev', 'Dr Abil Aliev — Sample Fridge', 'You have an uncollected NMR tube in the Sample Fridge in the NMR room. Speak with me at my desk first.', [{ label: '[1] Understood', primary: true, onClick: closeDialogue }], true);
        return;
      }

      const SHARED_WAIT_TYPES = new Set(['fridge_4c', 'freezer_20c', 'balance_table', 'tlc_station', 'pc_terminal', 'chem_cupboard']);
      const occupier = !SHARED_WAIT_TYPES.has(obj.type)
        ? Object.values(state.npcs).find(n => n.roomId === state.player.roomId && n.busyObjId === obj.id)
        : null;
      if (occupier) {
        const occMeta = window.KLB.CAST_BY_ID[occupier.id];
        const hasFavour = (Number(state.favours) || 0) >= 1;
        const rmNow = window.KLB.WORLD_MAPS?.rooms?.[state.player.roomId];
        const busyObjIds = new Set(
          Object.values(state.npcs || {})
            .filter(n => n && n.roomId === state.player.roomId && n.busyObjId)
            .map(n => n.busyObjId)
        );
        const hasOtherFreeBay = Boolean(
          rmNow && (rmNow.objects || []).some(o => o && o.type === obj.type && o.id !== obj.id && !busyObjIds.has(o.id))
        );
        const bayActions = [
          hasFavour
            ? {
                label: `[1] Ask ${occMeta.shortName} to swap bays (-1 Favour)`,
                primary: true,
                onClick: () => {
                  if ((Number(state.favours) || 0) < 1) return;
                  if (window.KLB.Audio?.playSfx) window.KLB.Audio.playSfx('bay_swap');
                  addFavours(-1);
                  occupier.busyObjId = null;
                  if (occupier.sim) {
                    occupier.sim.currentAction = null;
                    occupier.sim.pendingJobStart = null;
                  }
                  closeDialogue();
                  showAlertBanner(`${occMeta.shortName} swapped bays with you (-1 Favour).`, 3200, false);
                  syncAllHUD(true);
                  launchWaitJob(step, sub, obj);
                }
              }
            : {
                label: `[1] Swap bays with ${occMeta.shortName} (Needs 1 Favour)`,
                disabled: true,
                disabledTitle: 'Requires 1 Favour to swap bays',
                primary: false,
                onClick: () => {}
              }
        ];
        if (hasOtherFreeBay) {
          bayActions.push({ label: '[2] Pick Free Bay', primary: !hasFavour, onClick: closeDialogue });
        } else {
          bayActions.push({
            label: '[2] Wait 5m for your turn (0 Favours)',
            primary: !hasFavour,
            onClick: () => {
              const startDayIdx = state.dayIdx;
              if (window.KLB.Audio?.playSfx) window.KLB.Audio.playSfx('bay_swap');
              closeDialogue();
              window.KLB.Sim.spendWhatsAppMinutes(state, 5, simCallbacks());
              if (!state || state.dayIdx !== startDayIdx || state.fridayFinalAuditDone || state.gameOver || state.victory) return;
              occupier.busyObjId = null;
              if (occupier.sim) {
                occupier.sim.currentAction = null;
                occupier.sim.pendingJobStart = null;
              }
              showAlertBanner(`Waited 5m for your turn at ${obj.label || niceStationName(obj.type)} (0 Favours).`, 3200, false);
              syncAllHUD(true);
              launchWaitJob(step, sub, obj);
            }
          });
          bayActions.push({ label: '[3] Cancel', primary: false, onClick: closeDialogue });
        }
        showDialogue(occupier.id, `${occMeta.name} at Station`, `Using this station now (${occupier.currentTaskText || 'active task'}).`, bayActions);
        return;
      }

      launchWaitJob(step, sub, obj);
    }
  }

  function launchWaitJob(step, sub, obj, opts = {}) {
    const isUnbufferedMaxTcep = Boolean(
      state.player.id === 'maximillian_lee' &&
      !state.prep.tcep_buffered &&
      (obj.type === 'tcep_bench' || /rebridg|tcep|stapling/i.test(`${sub.label} ${step.title}`))
    );
    if (isUnbufferedMaxTcep && !opts.confirmedUnbufferedTcep) {
      showDialogue(
        'maximillian_lee',
        'Unbuffered Bench TCEP Warning',
        'Your bench TCEP stock is unbuffered (pH ~5). Running this step now will cost -15 Quality and -14% Yield. Ask a labmate for buffered 10 mM TCEP first, or proceed anyway?',
        [
          {
            label: '[1] Proceed with unbuffered bench TCEP (-15 Quality)',
            onClick: () => {
              closeDialogue();
              launchWaitJob(step, sub, obj, Object.assign({}, opts, { confirmedUnbufferedTcep: true }));
            }
          },
          {
            label: '[2] Cancel & ask a labmate first',
            primary: true,
            onClick: closeDialogue
          }
        ]
      );
      return;
    }

    prepareSubTaskExecution(step, sub, obj, () => {
      if (state.activePlayerAction) {
        showAlertBanner('Finish or step away from your current action first.', 3200, false);
        return;
      }
      let blueDyeMishap = false;
      if (state.player.id === 'peter_szijj' && state.energy < 30 && ['gel_tank', 'heatblock', 'tcep_bench'].includes(obj.type) && Math.random() < 0.45) {
        blueDyeMishap = true;
        window.KLB.Sim.pushWhatsApp(state, 'peter_szijj', 'Noo I just pipetted 2 µL of blue SDS loading buffer into pure Fab stock at <30 Energy.');
      }

      let tcepPenalty = false;
      if (state.player.id === 'maximillian_lee' && !state.prep.tcep_buffered && (obj.type === 'tcep_bench' || /rebridg|tcep|stapling/i.test(`${sub.label} ${step.title}`))) {
        tcepPenalty = true;
        showAlertBanner('Used unbuffered bench TCEP! Ask a labmate for pH 8.0 TCEP next time.', 3800, true);
      }

      let durMult = 1.0;
      if (state.player.id === 'andre_shamsabadi' && obj.type === 'biotage') durMult = 0.8;
      else if (state.player.id === 'maximillian_lee' && obj.type === 'gel_tank') durMult = 0.5;
      else if (state.player.id === 'antoine_maruani' && (obj.type === 'centrifuge' || obj.type === 'biotage')) durMult = 0.75;
      const sweetMult = (state.weatherMode === 'heatwave' || state.mutators?.eternal_heatwave) ? 0.8 : 1.0;
      const snap = calcStepMetrics(step, {
        blueDyeMishap,
        tcepPenalty,
        stationType: obj.type
      });

      let joaoLateBiotage = false;
      if (state.player.id === 'joao_nogueira' && obj.type === 'biotage' && state.timeMins >= 17.5 * 60) {
        state.energy = clamp((Number(state.energy) || 0) - 10, 0, 100);
        joaoLateBiotage = true;
      }

      playStationSfx(obj.type);

      let targetMins = Math.max(2, Math.round((sub.durationMins || 14) * durMult));
      if (state.player.id === 'archie_wall' && (obj?.type === 'centrifuge' || (sub?.stationTypes || []).includes('centrifuge'))) {
        targetMins = Math.max(3, Math.round(targetMins * 0.5));
      }

      const job = {
        id: 'job_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
        kind: sub.canOvercook ? 'reaction' : 'instrument',
        stepIdx: state.campaignStepIdx,
        subTaskIdx: state.campaignSubTaskIdx,
        subTaskId: sub.id,
        label: sub.label,
        shortLabel: sub.label,
        title: sub.label,
        roomId: state.player.roomId,
        objId: obj.id,
        stationType: obj.type,
        x: obj.x,
        y: obj.y,
        elapsedMins: 0,
        targetMins,
        sweetSpotMins: sub.canOvercook
          ? Math.max(15, Math.round((sub.sweetSpotMins || 55) * sweetMult))
          : (sub.sweetSpotMins || 180),
        canOvercook: Boolean(sub.canOvercook),
        isCold4C: obj.type === 'fridge_4c' || /4\s*°?\s*C/i.test(step.title || ''),
        prepScore: snap.quality,
        yieldScore: snap.yieldPct,
        blueDyeMishap: snap.blueDyeMishap,
        outcomeText: snap.outcomeText,
        status: 'running',
        viewOutput: sub.viewOutput || null
      };

      state.activeStationJobs.push(job);
      state.activeReactions = state.activeStationJobs;
      if (joaoLateBiotage) {
        showAlertBanner(`Started ${sub.label} — late 17:30 Biotage column drained extra energy (-10 Energy)!`, 4200, true);
      } else {
        showAlertBanner(`Started ${sub.label} — monitor the loading bar!`, 3600, false);
      }
      window.KLB.Sim.checkPermadeath(state, simCallbacks());
      syncAllHUD(true);
    });
  }

  function interactWithObject(obj, allHits = []) {
    const t = obj.type;
    const hitList = allHits.length ? allHits : [obj];
    const curStep = getCurrentCampaignStep();
    const curSub = getCurrentSubTask(curStep);

    // 0) Block normal lab work during Fire Alarm (must evacuate!)
    if (state.fireAlarm.active && (state.player.roomId === 'klb_2f' || state.player.roomId === 'klb_3f') && !['exit_stairs', 'spiral_stairs'].includes(t)) {
      showDialogue(state.player.id, 'Fire Alarm Evac Required', 'KLB sirens are sounding. Evacuate via the left fire exit on 2F now.', [
        { label: '[1] Evacuate via Left Fire Exit', primary: true, onClick: () => { closeDialogue(); completeFireEvacuation(); } },
        { label: '[2] Close', onClick: closeDialogue }
      ]);
      return;
    }

    const isCompactEquip = COMPACT_BENCHTOP_EQUIP.has(t);

    // 1) If current sub-task is 'collect' on this station (e.g. View SDS-PAGE gel / View NMR on PC / View MS on PC)
    const collectHit = curSub && curSub.mode === 'collect'
      ? hitList.find(h => matchesSubTaskStation(h, curSub) && (!isCompactEquip || h.id === obj.id || !UNDERLYING_SURFACE_TYPES.has(h.type)))
      : null;
    if (collectHit) {
      startSubTaskAtStation(curStep, curSub, collectHit);
      return;
    }

    // 2) Check any active station job matching this tile/fixture
    const existingJob = (state.activeStationJobs || []).find(r =>
      r.roomId === state.player.roomId && (isCompactEquip ? r.objId === obj.id : hitList.some(h => h.id === r.objId))
    );
    if (existingJob) {
      handleActiveStationJob(existingJob);
      return;
    }

    // 3) Doors, Stairs, Specs & Lab Speakers
    if (t === 'spiral_stairs') {
      if (window.KLB.Audio?.playSfx) window.KLB.Audio.playSfx('stairs_step');
      const target = state.player.roomId === 'klb_2f' ? 'klb_3f' : 'klb_2f';
      transitionToRoom(target, window.KLB.ROOM_META[target].stairsSpawn);
      return;
    }

    if (t === 'exit_stairs') {
      if (state.player.roomId === 'klb_2f') {
        if (state.doorPls?.active) {
          const reqMeta = window.KLB.CAST_BY_ID?.[state.doorPls.requesterId];
          state.doorPls.active = false;
          if (reqMeta) {
            addFavours(1);
            state.morale = Math.min(100, state.morale + 6);
            if (window.KLB.Audio) window.KLB.Audio.playSfx('door_buzz');
            window.KLB.Sim.pushWhatsApp(state, reqMeta.id, `Cheers @${window.KLB.CAST_BY_ID[state.player.id].shortName} — thanks for buzzing the door (+1 Favour).`);
            showAlertBanner(`Buzzed ${reqMeta.shortName} in! (+1 Favour, +6 Morale)`, 3500, false);
            syncAllHUD(true);
            return;
          }
        }
        if (state.fireAlarm?.active) {
          showAlertBanner('Evacuate via the left fire exit immediately!', 4000, true);
          return;
        }
        openBloomsburyModal();
      } else {
        openBloomsburyModal();
      }
      return;
    }

    if (t === 'specs_holder') { toggleSpecs(); return; }

    if (t === 'lab_speakers') {
      state.lotrPlaying = !state.lotrPlaying;
      if (window.KLB.Audio?.playSfx) window.KLB.Audio.playSfx('ui_click');
      syncAudioAmbience();
      const grantMorale = state.lotrPlaying && !state._speakersMoraleToday;
      if (grantMorale) {
        state._speakersMoraleToday = true;
        state.morale = Math.min(100, state.morale + 5);
      }
      showAlertBanner(state.lotrPlaying
        ? (grantMorale ? 'Lab Speakers ON: Shire synth playing across 2F & 3F (+5 Morale).' : 'Lab Speakers ON: Shire synth playing across 2F & 3F.')
        : 'Lab Speakers switched off.', 3500, false);
      syncAllHUD(true);
      return;
    }

    // 4) Safety sweep tidy-bay bonus on fire_ext (waste_bin offers both cleaning and sweep quick-cap)
    if (t === 'fire_ext' && state.safetySweep.active) {
      if (state.activePlayerAction) {
        showAlertBanner('Finish or step away from your current action first.', 3000, false);
        return;
      }
      state.activePlayerAction = {
        kind: 'tidy_hazard',
        roomId: state.player.roomId,
        objId: obj.id,
        x: obj.x,
        y: obj.y,
        label: 'Securing Bay Hazards',
        shortLabel: 'Tidy Bay',
        elapsedMins: 0,
        targetMins: 2
      };
      syncAllHUD(true);
      return;
    }

    // 5) Current Sub-Task Match (strictly verified via matchesSubTaskStation!)
    const matchingHit = curSub
      ? hitList.find(h => matchesSubTaskStation(h, curSub) && (!isCompactEquip || h.id === obj.id || !UNDERLYING_SURFACE_TYPES.has(h.type)))
      : null;
    if (matchingHit) {
      if (matchingHit.type === 'chem_cupboard' && curSub.cupboardHint) {
        const lbl = matchingHit.label || '';
        if (!matchesCupboardHint(lbl, curSub.cupboardHint)) {
          showAlertBanner(`Look for ${curSub.cupboardHint} for this reagent`, 3800, false);
          openCupboardInspectDialogue(matchingHit);
          return;
        }
      }
      if ((state.player.roomId === 'klb_2f' || state.player.roomId === 'klb_3f') && (matchingHit.type === 'pc_terminal' || matchingHit.type === 'writeup_desk')) {
        snapPlayerToDeskChair(matchingHit);
      }
      startSubTaskAtStation(curStep, curSub, matchingHit);
      return;
    }

    // 6) Special Interactive Stations (Cafe, Tea, Desk, Projector, Cupboard Inspection, Cleaning & Preps)
    if (t === 'cafe_counter' || t === 'cafe_table') {
      openGordonsMenuModal(obj);
      return;
    }

    if (t === 'tea_drawer') {
      openTeaKettleDialogue(obj);
      return;
    }

    if (t === 'pc_terminal' || t === 'writeup_desk') {
      if (state.player.roomId === 'cib_lg11_ms') {
        const msJobs = (state.activeStationJobs || []).filter(j => j.roomId === 'cib_lg11_ms');
        const runningMs = msJobs.find(j => j.status === 'running');
        const readyMs = msJobs.find(j => j.status === 'ready' || j.status === 'sweet');
        const npcMs = window.KLB.Sim.getVisibleNPCReactions ? window.KLB.Sim.getVisibleNPCReactions(state, 'cib_lg11_ms') : [];
        const statusLine = state.lcmsBroken
          ? 'Waters Xevo G2-XS Q-TOF status: OFFLINE (PLRP-S column requires conditioning and PEG flush with Dr Kersti Karu).'
          : 'Waters Xevo G2-XS Q-TOF status: ONLINE (Mobile phase A/B primed, positive ESI tuned).';
        let queueLine = 'Your LG11 queue: idle.';
        if (runningMs) {
          const pct = Math.min(99, Math.round((runningMs.elapsedMins / Math.max(1, runningMs.targetMins)) * 100));
          queueLine = `Your LG11 queue: "${runningMs.label}" acquiring (${pct}% — wait for 100% to inspect MaxEnt trace).`;
        } else if (readyMs) {
          queueLine = `Your LG11 queue: "${readyMs.label}" is READY for collection.`;
        } else if (npcMs.length) {
          queueLine = `Active facility samples in queue: ${npcMs.length} colleague run${npcMs.length === 1 ? '' : 's'} acquiring.`;
        }
        const heading = t === 'writeup_desk' ? "Dr Kersti Karu's Desk — CIB LG11" : 'MassLynx UPLC Queue (uplc2011)';
        showDialogue(
          'kersti_karu',
          heading,
          `${statusLine} ${queueLine} Login: uplc2011 | Door code: 1965. Save manuscript writing and AoE2 for KLB 3F desks.`,
          [{ label: '[1] Close', primary: true, onClick: closeDialogue }],
          true,
          'CIB LG11 Mass Spec Facility'
        );
        return;
      }
      if (state.player.roomId === 'cib_lg1b_nmr') {
        const nmrJobs = (state.activeStationJobs || []).filter(j => j.roomId === 'cib_lg1b_nmr');
        const runningNmr = nmrJobs.find(j => j.status === 'running');
        const readyNmr = nmrJobs.find(j => j.status === 'ready' || j.status === 'sweet');
        const npcNmr = window.KLB.Sim.getVisibleNPCReactions ? window.KLB.Sim.getVisibleNPCReactions(state, 'cib_lg1b_nmr') : [];
        let queueLine = 'TopSpin IconNMR queue: 400 / 500 / 600 / 700 MHz cryoprobes locked and shimmed.';
        if (runningNmr) {
          const pct = Math.min(99, Math.round((runningNmr.elapsedMins / Math.max(1, runningNmr.targetMins)) * 100));
          queueLine = `TopSpin 700 MHz acquisition: "${runningNmr.label}" running (${pct}% — wait for 100% to process FID).`;
        } else if (readyNmr) {
          queueLine = `TopSpin 700 MHz queue: "${readyNmr.label}" FID is READY for processing.`;
        } else if (npcNmr.length) {
          queueLine = `TopSpin IconNMR queue: ${npcNmr.length} colleague tube${npcNmr.length === 1 ? '' : 's'} running across 400–700 MHz magnets.`;
        }
        const rackGroup = state.player.id === 'archie_wall' ? 'Baker' : 'Chudasama';
        const fridgeNote = state.abilFineOwed
          ? 'Notice: Uncollected tube logged in the LG1b Sample Fridge (speak with Dr Abil Aliev at his desk to release it).'
          : `Sample Fridge clear (no overdue ${rackGroup} tubes).`;
        const heading = t === 'writeup_desk' ? "Dr Abil Aliev's Desk — CIB LG1b" : 'TopSpin 700 MHz Queue (LG1b)';
        showDialogue(
          'abil_aliev',
          heading,
          `${queueLine} ${fridgeNote} Door code: 2145 | Remote mount: 128.40.76.1.`,
          [{ label: '[1] Close', primary: true, onClick: closeDialogue }],
          true,
          'CIB LG1b NMR Facility'
        );
        return;
      }
      openDeskActionsModal(obj);
      return;
    }

    if (obj.id === 'obj_nmr_fridge' || (state.player.roomId === 'cib_lg1b_nmr' && t === 'fridge_4c')) {
      const rackGroup = state.player.id === 'archie_wall' ? 'Baker' : 'Chudasama';
      const readyNmrJob = (state.activeStationJobs || []).find(j => j.roomId === 'cib_lg1b_nmr' && (j.status === 'ready' || j.status === 'sweet'));
      if (state.abilFineOwed) {
        showDialogue(
          'abil_aliev',
          'LG1b Sample Fridge — Tube Held',
          `Your uncollected NMR tube is locked in the ${rackGroup} rack (£130 fine). Speak with Dr Abil Aliev at his desk in LG1b first to waive or settle the fine.`,
          [{ label: '[1] Speak to Abil', primary: true, onClick: closeDialogue }],
          true,
          'Fine Owed: Talk to Dr Aliev'
        );
        return;
      }
      if (readyNmrJob) {
        handleActiveStationJob(readyNmrJob);
        return;
      }
      showDialogue(
        'abil_aliev',
        'LG1b Sample Fridge',
        `Racks of capped 5 mm Wilmad NMR tubes sorted by group. Your ${rackGroup} rack is tidy with no overdue tubes held by Dr Aliev.`,
        [{ label: '[1] Close', primary: true, onClick: closeDialogue }],
        true,
        'CIB LG1b NMR Tube Storage'
      );
      return;
    }

    if (t === 'chair' && ['klb_2f', 'klb_3f', 'meeting_room'].includes(state.player.roomId)) {
      if (!window.KLB.Sim.isOccupiedByCharacter?.(state, state.player.roomId, obj.x, obj.y, state.player.id, 0.48) &&
          window.KLB.Sim.isCellWalkable(state.player.roomId, obj.x, obj.y, state.fireAlarm.active)) {
        state.player.x = obj.x;
        state.player.y = obj.y;
        state.player.dir = obj.dir || 'N';
        if (window.KLB.Audio?.playSfx) window.KLB.Audio.playSfx('ui_click');
      }
      return;
    }

    if (t === 'projector' || (state.player.roomId === 'meeting_room' && t === 'meeting_table')) {
      openFridayAuditTrigger();
      return;
    }

    if (t === 'chem_cupboard') {
      if (curSub && curSub.stationTypes?.includes('chem_cupboard') && curSub.cupboardHint) {
        const lbl = obj.label || '';
        if (!matchesCupboardHint(lbl, curSub.cupboardHint)) {
          showAlertBanner(`Look for ${curSub.cupboardHint} for this reagent`, 3800, false);
        }
      }
      openCupboardInspectDialogue(obj);
      return;
    }

    if (t === 'sink' && state.player.roomId === 'klb_2f') {
      const cond = Math.round(window.KLB.Sim.getLabCondition(state));
      showDialogue(state.player.id, 'Lab Sink & Deionised Tap', `Current Lab Condition: ${cond}%. Wash dirty glassware and spatulas cleanly.`, [
        {
          label: '[1] Wash Glassware (10m — +24 Lab Condition)',
          primary: true,
          onClick: () => {
            closeDialogue();
            if (state.activePlayerAction) {
              showAlertBanner('Finish or step away from your current action first.', 3000, false);
              return;
            }
            state.activePlayerAction = {
              kind: 'clean_workspace',
              cleanKind: 'sink',
              roomId: state.player.roomId,
              objId: obj.id,
              x: obj.x,
              y: obj.y,
              label: 'Washing Glassware at Sink',
              shortLabel: 'Wash Glassware',
              elapsedMins: 0,
              targetMins: 10
            };
            showAlertBanner('Washing glassware at the 2F sink (10m).', 2800, false);
            syncAllHUD(true);
          }
        },
        { label: '[2] Close', onClick: closeDialogue }
      ]);
      return;
    }

    if (t === 'waste_bin' && state.player.roomId === 'klb_2f') {
      const cond = Math.round(window.KLB.Sim.getLabCondition(state));
      const wasteActions = [
        {
          label: '[1] Cap & Empty Solvent Waste (8m — +20 Lab Condition)',
          primary: !state.safetySweep?.active,
          onClick: () => {
            closeDialogue();
            if (state.activePlayerAction) {
              showAlertBanner('Finish or step away from your current action first.', 3000, false);
              return;
            }
            state.activePlayerAction = {
              kind: 'clean_workspace',
              cleanKind: 'waste_bin',
              roomId: state.player.roomId,
              objId: obj.id,
              x: obj.x,
              y: obj.y,
              label: 'Capping & Emptying Solvent Waste',
              shortLabel: 'Cap & Empty Waste',
              elapsedMins: 0,
              targetMins: 8
            };
            showAlertBanner('Capping Winchesters and emptying solvent waste (8m).', 2800, false);
            syncAllHUD(true);
          }
        }
      ];
      if (state.safetySweep?.active) {
        wasteActions.push({
          label: `[${wasteActions.length + 1}] Quick-Cap Winchesters (2m — Sweep Scramble)`,
          primary: true,
          onClick: () => {
            closeDialogue();
            if (state.activePlayerAction) {
              showAlertBanner('Finish or step away from your current action first.', 3000, false);
              return;
            }
            state.activePlayerAction = {
              kind: 'tidy_hazard',
              roomId: state.player.roomId,
              objId: obj.id,
              x: obj.x,
              y: obj.y,
              label: 'Securing Bay Hazards',
              shortLabel: 'Tidy Bay',
              elapsedMins: 0,
              targetMins: 2
            };
            syncAllHUD(true);
          }
        });
      }
      wasteActions.push({ label: `[${wasteActions.length + 1}] Close`, onClick: closeDialogue });
      showDialogue(
        state.player.id,
        'Solvent Winchesters & Silica Waste',
        `Current Lab Condition: ${cond}%. ${state.prep.uncapped_waste ? 'Uncapped column waste detected! Cap Winchesters before inspections.' : 'Keep halogenated and non-halogenated Winchesters capped.'}`,
        wasteActions
      );
      return;
    }

    if (t === 'drying_oven') {
      if (state.activePlayerAction) {
        showAlertBanner('Finish or step away from your current action first.', 3000, false);
        return;
      }
      state.activePlayerAction = {
        kind: 'prep_oven',
        roomId: state.player.roomId,
        objId: obj.id,
        x: obj.x,
        y: obj.y,
        label: 'Drying Oven Flask',
        shortLabel: 'Drying Oven',
        elapsedMins: 0,
        targetMins: 3
      };
      syncAllHUD(true);
      return;
    }

    if (t === 'argon_cyl') {
      if (state.activePlayerAction) {
        showAlertBanner('Finish or step away from your current action first.', 3000, false);
        return;
      }
      state.activePlayerAction = {
        kind: 'prep_argon',
        roomId: state.player.roomId,
        objId: obj.id,
        x: obj.x,
        y: obj.y,
        label: 'Filling Argon Balloon',
        shortLabel: 'Argon Balloon',
        elapsedMins: 0,
        targetMins: 3
      };
      syncAllHUD(true);
      return;
    }

    if (t === 'ph_probe') {
      const isMax = state.player.id === 'maximillian_lee';
      const isCal = Boolean(state.prep?.ph_calibrated);
      const tcepOk = Boolean(state.prep?.tcep_buffered);
      const statusText = isCal
        ? `Electrode calibrated (pH 4.00 / 7.00 / 10.00, slope 98.6%, offset -4.2 mV). +3% Quality prep active${tcepOk ? ' and pH 8.00 BBS TCEP buffer verified' : (isMax ? ' (your bench TCEP is still unbuffered — borrow buffered TCEP from a labmate)' : '')}.`
        : (isMax
            ? 'Live two-point readout: pH 4.00 / 7.00 / 10.00 standards ready (slope 98.6%, offset -4.2 mV). Calibrate for pH 7.40 PBS / pH 8.00 BBS bioconjugation buffers (+3% Quality prep bonus; borrow buffered TCEP separately from a labmate).'
            : 'Live two-point readout: pH 4.00 / 7.00 / 10.00 standards ready (slope 98.6%, offset -4.2 mV). Calibrate for pH 7.40 PBS / pH 8.00 BBS bioconjugation buffers (+3% Quality prep bonus & verifies TCEP buffer).');
      const actions = isCal
        ? [
            {
              label: '[1] Re-Verify pH 7.40 PBS / pH 8.00 BBS Buffer (0m)',
              primary: true,
              onClick: () => {
                state.prep.ph_calibrated = true;
                if (!isMax) state.prep.tcep_buffered = true;
                if (window.KLB.Audio?.playSfx) window.KLB.Audio.playSfx('ph_beep');
                closeDialogue();
                showAlertBanner(
                  isMax && !state.prep.tcep_buffered
                    ? 'pH Probe verified (7.40 PBS / 8.00 BBS) — +3% Quality prep active (bench TCEP remains unbuffered for Max!).'
                    : 'pH Probe verified (7.40 PBS / 8.00 BBS) — +3% Quality prep active and TCEP buffer verified!',
                  3600,
                  false
                );
                syncAllHUD(true);
              }
            },
            { label: '[2] Close', onClick: closeDialogue }
          ]
        : [
            {
              label: '[1] Calibrate pH 7.40 PBS / pH 8.00 BBS Buffer (0m, +3% Quality)',
              primary: true,
              onClick: () => {
                state.prep.ph_calibrated = true;
                if (!isMax) state.prep.tcep_buffered = true;
                if (window.KLB.Audio?.playSfx) window.KLB.Audio.playSfx('ph_beep');
                closeDialogue();
                showAlertBanner(
                  isMax && !state.prep.tcep_buffered
                    ? 'pH Probe calibrated (7.40 PBS / 8.00 BBS) — +3% Quality prep bonus active (borrow buffered TCEP from a labmate before TCEP steps!).'
                    : 'pH Probe calibrated (7.40 PBS / 8.00 BBS) — +3% Quality prep bonus active and TCEP buffer verified!',
                  3800,
                  false
                );
                syncAllHUD(true);
              }
            },
            { label: '[2] Close', onClick: closeDialogue }
          ];
      showDialogue(
        state.player.id,
        obj.label || niceStationName('ph_probe'),
        statusText,
        actions,
        false,
        isCal ? '+3% Quality Prep Active (pH 7.40 PBS / 8.00 BBS)' : 'Two-Point Calibration: pH 4.00 / 7.00 / 10.00 (98.6%)'
      );
      return;
    }

    if (t === 'base_bath') {
      const cond = Math.round(window.KLB.Sim.getLabCondition(state));
      showDialogue(
        state.player.id,
        'Base / Bleach Quench Bath',
        state.prep.thiol_dirty
          ? `Current Lab Condition: ${cond}%. Thiol fumes detected! Neutralise thiol glassware in aqueous hypochlorite immediately.`
          : `Current Lab Condition: ${cond}%. Bleach bath in the Chudasama hood neutralises thiol glassware and clears stench.`,
        [
          {
            label: '[1] Neutralise Thiol Glassware (10m — clears stench, +28 Lab Condition)',
            primary: true,
            onClick: () => {
              closeDialogue();
              if (state.activePlayerAction) {
                showAlertBanner('Finish or step away from your current action first.', 3000, false);
                return;
              }
              state.activePlayerAction = {
                kind: 'clean_workspace',
                cleanKind: 'base_bath',
                roomId: state.player.roomId,
                objId: obj.id,
                x: obj.x,
                y: obj.y,
                label: 'Neutralising Thiol Glassware',
                shortLabel: 'Bleach Bath',
                elapsedMins: 0,
                targetMins: 10
              };
              showAlertBanner('Neutralising thiol glassware in the bleach bath (10m).', 2800, false);
              syncAllHUD(true);
            }
          },
          { label: '[2] Close', onClick: closeDialogue }
        ]
      );
      return;
    }

    if (t === 'tlc_station') {
      if (state.activePlayerAction) {
        showAlertBanner('Finish or step away from your current action first.', 3000, false);
        return;
      }
      state.activePlayerAction = {
        kind: 'prep_tlc',
        roomId: state.player.roomId,
        objId: obj.id,
        x: obj.x,
        y: obj.y,
        label: 'Running UV TLC Check',
        shortLabel: 'UV TLC Check',
        elapsedMins: 0,
        targetMins: 4
      };
      syncAllHUD(true);
      return;
    }

    if (t === 'tcep_bench') {
      const actions = [];
      if (state.player.id !== 'maximillian_lee') {
        const canEarnFavour = !state._tcepFavourToday;
        const alreadyDoneToday = Boolean(state._tcepFavourToday && state.prep.tcep_buffered);
        actions.push({
          label: canEarnFavour
            ? '[1] Prep Fresh 10 mM TCEP (6m, +1 Favour)'
            : (state.prep.tcep_buffered ? '[1] Fresh 10 mM TCEP Prepped Today' : '[1] Prep Fresh 10 mM TCEP (6m)'),
          primary: !alreadyDoneToday,
          disabled: alreadyDoneToday,
          onClick: () => {
            if (alreadyDoneToday) return;
            closeDialogue();
            if (state.activePlayerAction) {
              showAlertBanner('Finish or step away from your current action first.', 3000, false);
              return;
            }
            state.activePlayerAction = {
              kind: 'prep_tcep',
              roomId: state.player.roomId,
              objId: obj.id,
              x: obj.x,
              y: obj.y,
              label: 'Prepping 10 mM TCEP',
              shortLabel: 'Prep TCEP',
              elapsedMins: 0,
              targetMins: 6
            };
            syncAllHUD(true);
          }
        });
      }
      if (state.player.id === 'faiza_javaid' && curStep && !state._stepFaizaA280Done && state.player.roomId === 'klb_2f') {
        actions.push({
          label: `[${actions.length + 1}] Run Quick A280 Check (+4 Quality)`,
          primary: actions.length === 0,
          onClick: () => {
            state._stepFaizaA280Done = true;
            if (window.KLB.Audio?.playSfx) window.KLB.Audio.playSfx('pipette');
            closeDialogue();
            showAlertBanner('2F Quick A280 UV-Vis check complete (+4 Quality for current step).', 3400, false);
            syncAllHUD(true);
          }
        });
      }
      const stepKey = String(state.campaignStepIdx ?? 0);
      const benchTcepTried = Boolean(state._benchTcepTriedSteps?.[stepKey]);
      actions.push({
        label: benchTcepTried
          ? `[${actions.length + 1}] Check Unlabelled Bench Tube (Already Checked This Step)`
          : `[${actions.length + 1}] Check Unlabelled Bench Tube (5m)`,
        disabled: benchTcepTried,
        disabledTitle: 'Already checked the unlabelled bench tube during this step',
        onClick: () => {
          if (state._benchTcepTriedSteps?.[stepKey]) return;
          closeDialogue();
          const startDayIdx = state.dayIdx;
          window.KLB.Sim.spendWhatsAppMinutes(state, 5, simCallbacks());
          if (!state || state.dayIdx !== startDayIdx || state.fridayFinalAuditDone || state.gameOver || state.victory) return;
          state._benchTcepTriedSteps = state._benchTcepTriedSteps || {};
          state._benchTcepTriedSteps[stepKey] = true;
          const ok = Math.random() < 0.78;
          state.prep.tcep_buffered = ok;
          showAlertBanner(
            ok
              ? 'Unlabelled bench TCEP checked out at pH 8.0 (-5m).'
              : 'Unbuffered TCEP (pH 5)! Re-prep or ask a labmate (-5m).',
            3800,
            !ok
          );
          syncAllHUD(true);
        }
      });
      actions.push({ label: `[${actions.length + 1}] Cancel`, onClick: closeDialogue });
      showDialogue(state.player.id, 'TCEP Buffer Station', state.player.id === 'maximillian_lee' ? 'Ask a Big-Chud for buffered TCEP or test an existing bench tube.' : 'Prepare fresh pH 8.0 BBS-buffered TCEP for the bay.', actions);
      return;
    }

    if (t === 'whiteboard') {
      showDialogue(
        state.player.id,
        obj.label || '3F Whiteboard',
        'Covered in pyridazinedione reaction schemes, a half-erased "Soluble or Not Soluble" tally, and "FRI 09:00 GROUP MEETING" underlined three times in dry-erase ink.',
        [{ label: '[1] Close', primary: true, onClick: closeDialogue }],
        true,
        'KLB 3rd Floor Office'
      );
      return;
    }

    if (t === 'bookshelf') {
      showDialogue(
        state.player.id,
        obj.label || 'Group Reference Bookshelf',
        'Bound Chudasama group PhD theses, Clayden Organic Chemistry, Hermanson Bioconjugate Techniques, and three dog-eared Fulmer NMR solvent shift tables.',
        [{ label: '[1] Close', primary: true, onClick: closeDialogue }],
        true,
        'KLB 3rd Floor Office'
      );
      return;
    }

    if (t === 'thesis_printer') {
      showDialogue(
        state.player.id,
        obj.label || '3F Shared Laser Printer',
        'Blinking "Toner Low (Cyan)" since 2016. Someone\'s 94-page Supporting Information PDF is still warm in the output tray.',
        [{ label: '[1] Close', primary: true, onClick: closeDialogue }],
        true,
        'KLB 3rd Floor Office'
      );
      return;
    }

    if (t === 'locker') {
      showDialogue(
        state.player.id,
        obj.label || '3F Personal Lockers',
        'Spare pressed lab coats, emergency Yorkshire Tea bags, a spare laser clicker case, and a rain jacket for sudden Gordon Street downpours.',
        [{ label: '[1] Close', primary: true, onClick: closeDialogue }],
        true,
        'KLB 3rd Floor Office'
      );
      return;
    }

    if (t === 'fire_ext' && !state.safetySweep.active) {
      showDialogue(
        state.player.id,
        obj.label || 'CO2 & Dry-Powder Fire Extinguisher',
        'Pressure needle sits solidly in the green zone and the departmental inspection tag is signed for this month. Keep clear for Prof. Carmalt\'s surprise sweeps.',
        [{ label: '[1] Close', primary: true, onClick: closeDialogue }],
        true,
        'KLB 2F Safety Fixture'
      );
      return;
    }

    // 7) Fallback Guidance Hint (plus idle fumehood / lab_bench workspace tidying and Faiza 2F A280 UV-Vis Check)
    let hint;
    if (curStep && curSub) {
      const rmTitle = window.KLB.ROOM_META[curSub.roomId]?.shortName || curSub.roomId;
      const stTxt = curSub.cupboardHint || (curSub.stationTypes || []).join(' / ');
      hint = `Current sub-task "${curSub.label}" needs ${stTxt} in ${rmTitle}.`;
    } else if (curStep) {
      hint = `Current Step ${state.campaignStepIdx + 1}: ${curStep.title}.`;
    } else {
      hint = 'All 5 protocol steps complete. Finish your Weekly Report, Manuscript Draft, and 4-Slide Deck at any desk.';
    }

    const curCond = window.KLB.Sim.getLabCondition(state);
    if (state.player.roomId === 'klb_2f' && (t === 'fumehood' || t === 'lab_bench')) {
      const benchActions = [];
      if (t === 'lab_bench' && state.player.id === 'faiza_javaid' && curStep && !state._stepFaizaA280Done) {
        benchActions.push({
          label: `[${benchActions.length + 1}] Run Quick A280 Check (+4 Quality)`,
          primary: true,
          onClick: () => {
            state._stepFaizaA280Done = true;
            if (window.KLB.Audio?.playSfx) window.KLB.Audio.playSfx('pipette');
            closeDialogue();
            showAlertBanner('2F Quick A280 UV-Vis check complete (+4 Quality for current step).', 3400, false);
            syncAllHUD(true);
          }
        });
      }
      if (curCond < 92) {
        benchActions.push({
          label: `[${benchActions.length + 1}] Tidy Workspace (10m — +18 Lab Condition)`,
          primary: benchActions.length === 0,
          onClick: () => {
            closeDialogue();
            if (state.activePlayerAction) {
              showAlertBanner('Finish or step away from your current action first.', 3000, false);
              return;
            }
            state.activePlayerAction = {
              kind: 'clean_workspace',
              cleanKind: 'bench',
              roomId: state.player.roomId,
              objId: obj.id,
              x: obj.x,
              y: obj.y,
              label: 'Tidying Workspace',
              shortLabel: 'Tidy Workspace',
              elapsedMins: 0,
              targetMins: 10
            };
            showAlertBanner('Tidying workspace and wiping down bench (10m).', 2800, false);
            syncAllHUD(true);
          }
        });
      }
      if (benchActions.length > 0) {
        benchActions.push({ label: `[${benchActions.length + 1}] Close`, onClick: closeDialogue });
        showDialogue(
          state.player.id,
          obj.label || niceStationName(t),
          `${hint} (Lab Condition: ${Math.round(curCond)}%)`,
          benchActions
        );
        return;
      }
    }

    showDialogue(state.player.id, obj.label || niceStationName(t), hint, [{ label: '[1] OK', primary: true, onClick: closeDialogue }], true);
  }

  const CUPBOARD_ITEM_LABELS = {
    dry_dcm: 'Anhyd. DCM',
    dry_thf: 'Anhyd. THF',
    dry_dmf: 'Anhyd. DMF',
    dry_mecn: 'Anhyd. MeCN',
    dry_toluene: 'Anhyd. Toluene',
    dmso_anhyd: 'Anhyd. DMSO',
    thiophenol: 'Thiophenol',
    dodecanethiol: 'Dodecanethiol',
    bme: 'BME',
    edt: 'EDT',
    gsh: 'GSH',
    dibromomaleic_acid: 'Dibromomaleic acid',
    diBrPD_core: 'diBrPD core',
    bcn_nhs: 'BCN-NHS',
    tco_nhs: 'TCO-NHS',
    dox_n3: 'Dox-N3',
    mmae_n3: 'MMAE-N3',
    tbat: 'TBAT',
    hexanes: 'Hexanes',
    etoac: 'EtOAc',
    dcm_bulk: 'DCM (bulk)',
    meoh: 'MeOH',
    celite: 'Celite',
    ptsoh: 'p-TsOH·H2O',
    tfa: 'TFA',
    nah: 'NaH (60%)',
    et3n: 'Et3N',
    diad: 'DIAD',
    pybop: 'PyBOP',
    cdmp: 'CDMP',
    b_ome3: 'B(OMe)3',
    mol_sieves: '4A Mol. Sieves',
    dbm: 'Dibromomaleimide',
    dtpm: 'Dithiomaleimide',
    ellmans_dtnb: "Ellman's DTNB",
    mystery_vial: '2011 Unlabelled Vial',
    vintage_silica: 'Vintage Silica',
    et2o: 'Diethyl ether',
    acetone: 'Acetone',
    ipa: 'IPA',
    etoh: 'EtOH'
  };

  function resolveCupboardInfo(lbl) {
    const contents = window.KLB.CUPBOARD_CONTENTS || {};
    if (contents[lbl]) return contents[lbl];
    const m = String(lbl || '').match(/\bcupboard\s+(\d+)\b/i);
    if (m) {
      const re = new RegExp(`\\bcupboard\\s+${m[1]}\\b(?!\\d)`, 'i');
      const matchKey = Object.keys(contents).find(k => re.test(k));
      if (matchKey) return contents[matchKey];
    }
    return { desc: 'Assorted reagent bottles.' };
  }

  function openCupboardInspectDialogue(obj) {
    const lbl = obj.label || 'Chemical Cupboard';
    const info = resolveCupboardInfo(lbl);
    const itemsList = Array.isArray(info.items)
      ? info.items.map(k => CUPBOARD_ITEM_LABELS[k] || String(k).replace(/_/g, ' '))
      : [];
    const inventorySuffix = itemsList.length ? ` Inventory: ${itemsList.join(', ')}.` : '';
    const extraNote = info.notes ? ` ${info.notes}` : '';
    const fullDesc = `${info.desc || 'Assorted reagent bottles.'}${inventorySuffix}${extraNote}`;
    const taskMeta = info.tag
      ? `${info.tag}${info.group && info.group !== 'none' ? ` | ${info.group.toUpperCase()} bay` : ''}`
      : '';
    const actions = [];
    if (isCupboardOneLabel(lbl)) {
      actions.push({
        label: '[1] Collect Dry Solvent',
        primary: true,
        onClick: () => {
          closeDialogue();
          if (state.activePlayerAction) {
            showAlertBanner('Finish or step away from your current action first.', 3000, false);
            return;
          }
          state.activePlayerAction = {
            kind: 'prep_cupboard_1',
            roomId: state.player.roomId,
            objId: obj.id,
            x: obj.x,
            y: obj.y,
            label: 'Collecting Dry Solvent',
            shortLabel: 'Dry Solvent',
            elapsedMins: 0,
            targetMins: 3
          };
          syncAllHUD(true);
        }
      });
    } else if (/\bcupboard\s+5\b(?!\d)/i.test(lbl)) {
      actions.push({
        label: '[1] Withdraw Thiol Reagent',
        primary: true,
        onClick: () => {
          closeDialogue();
          if (state.activePlayerAction) {
            showAlertBanner('Finish or step away from your current action first.', 3000, false);
            return;
          }
          state.activePlayerAction = {
            kind: 'prep_cupboard_5',
            roomId: state.player.roomId,
            objId: obj.id,
            x: obj.x,
            y: obj.y,
            label: 'Withdrawing Thiol',
            shortLabel: 'Thiol Reagent',
            elapsedMins: 0,
            targetMins: 3
          };
          syncAllHUD(true);
        }
      });
    } else if (/\bcupboard\s+19\b(?!\d)/i.test(lbl)) {
      const checkedBefore = Boolean(state._cupboard19Inspected);
      actions.push({
        label: checkedBefore ? '[1] Inspect 2011 Vial (Already Checked)' : '[1] Inspect 2011 Vial',
        disabled: checkedBefore,
        disabledTitle: 'Already inspected the 2011 vial in Cupboard 19',
        onClick: () => {
          if (state._cupboard19Inspected) return;
          if (window.KLB.Audio?.playSfx) window.KLB.Audio.playSfx('ui_click');
          state._cupboard19Inspected = true;
          state.morale = Math.min(100, state.morale + 4);
          showDialogue(state.player.id, lbl, 'Yellowed Parafilm reads "Pureish(?) Fraction 4 — 2011". Wisely put back (+4 Morale).', [{ label: '[1] Close', primary: true, onClick: closeDialogue }], true);
          syncAllHUD(true);
        }
      });
    }
    actions.push({ label: `[${actions.length + 1}] Close`, onClick: closeDialogue });
    showDialogue(state.player.id, lbl, fullDesc, actions, actions.length === 1, taskMeta);
  }

  function openTeaKettleDialogue(obj) {
    if (state.activePlayerAction) {
      showAlertBanner('Finish or step away from your current action first.', 3000, false);
      return;
    }
    const nowMono = getMonotonicSimMins(state);
    const teaRem = (state._lastTeaBreakMins != null && nowMono >= state._lastTeaBreakMins && (nowMono - state._lastTeaBreakMins) < 60)
      ? Math.max(1, Math.ceil(60 - (nowMono - state._lastTeaBreakMins)))
      : 0;
    const actions = [
      {
        label: teaRem > 0 ? `[1] Brew Yorkshire Tea (Cooldown ${teaRem}m)` : '[1] Brew Yorkshire Tea',
        primary: teaRem <= 0,
        disabled: teaRem > 0,
        disabledTitle: teaRem > 0 ? `Yorkshire Tea break on cooldown (${teaRem}m left)` : '',
        onClick: () => {
          if (teaRem > 0) return;
          closeDialogue();
          state.activePlayerAction = {
            kind: 'tea',
            roomId: state.player.roomId,
            objId: obj.id,
            x: obj.x,
            y: obj.y,
            label: 'Brewing Yorkshire Tea',
            shortLabel: 'Yorkshire Tea',
            elapsedMins: 0,
            targetMins: 10
          };
          if (window.KLB.Audio?.playSfx) window.KLB.Audio.playSfx('kettle');
          showAlertBanner('Kettle on — brewing Yorkshire Tea.', 2800, false);
          syncAllHUD(true);
        }
      }
    ];
    if (state.player.id === 'andre_shamsabadi' && !state.prep.has_clicker) {
      actions.push({
        label: '[2] Grab Presentation Clicker',
        onClick: () => {
          state.prep.has_clicker = true;
          if (window.KLB.Audio?.playSfx) window.KLB.Audio.playSfx('ui_click');
          closeDialogue();
          showAlertBanner('Retrieved Laser Clicker from beside the 3F kettle.', 3400, false);
          syncAllHUD(true);
        }
      });
    }
    actions.push({ label: `[${actions.length + 1}] Cancel`, onClick: closeDialogue });
    showDialogue('richard_spears', "Richard's Kettle (3F)", 'Yorkshire tea, Bettys biscuits, and mug rack.', actions);
  }

  // ==================== 6. PROTOCOL CHOICE, SPECTRA VIEWER, MINIGAMES & DESK ====================
  function openProtocolChoiceModal(step, sub, onChosen) {
    setPaused(true);
    modalDismissable = true;
    modalEscapeHandler = () => { closeModal(); setPaused(false); };

    const choice = step.choice || {
      prompt: 'Choose reaction conditions:',
      options: [{ label: 'Run published Chudasama protocol', isOptimal: true, yieldMod: 10, purityMod: 10, safetyMod: 0, outcomeText: 'Clean conversion.' }]
    };

    const seed = (Number(state.runSeed) || Number(state.weekNum) || 1) + (Number(state.campaignStepIdx) || 0) * 131 + 17;
    const shuffledOptions = deterministicShuffle(choice.options || [], seed);

    const sup = getSupervisorMeta();
    const rawAntoineHint = choice.antoineHint || choice.askChudsHint || 'Keep reactions anhydrous and check TLC or LC-MS.';
    const parsedAntoineHint = parseHintSpeakerAndBody(rawAntoineHint);
    const isArchiePlayer = state.player.id === 'archie_wall';
    const isAntoinePlayer = state.player.id === 'antoine_maruani';
    const isRichardHint = isAntoinePlayer && parsedAntoineHint.speakerId === 'richard_spears';
    const vijayOutForHint = Boolean(isAntoinePlayer && !isRichardHint && state.mutators?.vijays_not_in);
    const advisorId = isArchiePlayer
      ? 'jamie_baker'
      : (isRichardHint ? 'richard_spears' : (isAntoinePlayer ? 'vijay_chudasama' : 'antoine_maruani'));
    const advisorLabel = isArchiePlayer
      ? '#AskJamie'
      : (isRichardHint ? '#AskRichard' : (isAntoinePlayer ? '#AskVijay' : '#AskAntoine'));
    const seniorHintBtnText = vijayOutForHint ? '#AskVijay (Unavailable)' : `${advisorLabel} (-10m)`;
    const seniorHintBtnTitle = vijayOutForHint
      ? 'Prof. Chudasama is offsite today (#VijaysNotIn modifier) — use #AskBigChuds instead'
      : '';

    const box = prepareModalBox('klb-modal', 'modal_open', 'klb-theme-step');
    box.innerHTML = `
      <header class="klb-modal-header">
        <div>
          <p class="mono-muted" style="color:#93c5fd;">Step ${state.campaignStepIdx + 1} of 5 | ${escHtml(sub.label)}</p>
          <h3>${escHtml(step.title)}</h3>
          <p style="margin-top:4px;font-size:12.5px;color:#cbd5e1;">${escHtml(step.desc || '')}</p>
        </div>
        <button id="mdl-close-step" class="hud-btn">${icon('x', 14)}<span>Cancel</span></button>
      </header>

      <div class="klb-modal-body">
        <section class="dossier-card">
          <h4 style="color:#fde68a;margin-bottom:8px;">${icon('flask-conical', 13)}<span>${escHtml(choice.prompt)}</span></h4>
          <div id="step-options-list" class="ev-choices-list" style="margin-top:0;"></div>
        </section>

        <div id="step-hint-box" class="klb-hint-box hidden"></div>
      </div>

      <footer class="klb-modal-footer">
        <div style="display:flex;gap:8px;flex-wrap:wrap;">
          <button id="btn-step-askchuds" class="rpg-btn">${icon('message-square', 13)}<span>Ask ${escHtml(sup.chatName)} (-10m)</span></button>
          <button id="btn-step-askantoine" class="rpg-btn" ${vijayOutForHint ? `disabled title="${escHtml(seniorHintBtnTitle)}"` : ''}>${icon('help-circle', 13)}<span>${escHtml(seniorHintBtnText)}</span></button>
        </div>
        <span class="mono-muted">Press 1–${shuffledOptions.length} or click an option</span>
      </footer>
    `;

    el('modal-backdrop').classList.remove('hidden');
    el('mdl-close-step').onclick = modalEscapeHandler;

    const appendHintLine = (speakerLabel, msgText) => {
      const hb = el('step-hint-box');
      if (!hb) return;
      hb.classList.remove('hidden');
      const row = document.createElement('div');
      row.style.marginTop = hb.children.length ? '6px' : '0';
      row.innerHTML = `<strong style="color:#93c5fd;">${escHtml(speakerLabel)} (-10m):</strong> ${escHtml(msgText)}`;
      hb.appendChild(row);
    };

    el('btn-step-askchuds').onclick = () => {
      const btn = el('btn-step-askchuds');
      if (btn?.disabled) return;
      if (btn) btn.disabled = true;
      const startDayIdx = state.dayIdx;
      window.KLB.Sim.spendWhatsAppMinutes(state, 10, simCallbacks());
      if (!state || state.dayIdx !== startDayIdx || state.fridayFinalAuditDone || state.gameOver) {
        if (state && !state.gameOver && !state.fridayFinalAuditDone && state.dayIdx !== startDayIdx) closeModal();
        return;
      }
      const rawHint = choice.askChudsHint || 'Check glassware, dry solvent, and buffer pH before starting.';
      const resolved = resolveHintWhatsAppSender(rawHint, state.player.id);
      window.KLB.Sim.pushWhatsApp(state, state.player.id, `${sup.askCmd} sanity check on ${step.title}?`);
      window.KLB.Sim.pushWhatsApp(state, resolved.senderId, resolved.body || rawHint);
      appendHintLine(resolved.speakerName, resolved.body || rawHint);
      syncAllHUD(true);
    };

    el('btn-step-askantoine').onclick = () => {
      const btn = el('btn-step-askantoine');
      if (btn?.disabled || vijayOutForHint) return;
      if (btn) btn.disabled = true;
      const startDayIdx = state.dayIdx;
      window.KLB.Sim.spendWhatsAppMinutes(state, 10, simCallbacks());
      if (!state || state.dayIdx !== startDayIdx || state.fridayFinalAuditDone || state.gameOver) {
        if (state && !state.gameOver && !state.fridayFinalAuditDone && state.dayIdx !== startDayIdx) closeModal();
        return;
      }
      const cleanBody = parsedAntoineHint.body || rawAntoineHint;
      if (advisorId === 'antoine_maruani' || advisorId === 'jamie_baker' || advisorId === 'richard_spears') {
        window.KLB.Sim.pushWhatsApp(state, state.player.id, `${advisorLabel} check on ${step.title}?`);
        window.KLB.Sim.pushWhatsApp(state, advisorId, cleanBody);
      }
      appendHintLine(advisorLabel, cleanBody);
      syncAllHUD(true);
    };

    const optList = el('step-options-list');
    shuffledOptions.forEach((opt, i) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'ev-choice-card';
      b.dataset.hotkey = String(i + 1);
      b.innerHTML = `
        <div class="ev-choice-top">
          <div class="ev-choice-left">
            <span class="ev-choice-key">${i + 1}</span>
            <span class="dir-icon-badge wetlab">${icon('beaker', 15)}</span>
            <span class="ev-choice-label">${escHtml(opt.label)}</span>
          </div>
          <span class="ev-choice-right">
            <span class="ev-choice-chevron">${icon('chevron-right', 14)}</span>
          </span>
        </div>
      `;
      b.onclick = () => {
        closeModal();
        setPaused(false);
        onChosen(opt);
      };
      optList.appendChild(b);
    });
  }

  function startRepurifyFigureAction(fig) {
    if (!state || state.spectatorMode || !fig) return false;
    if (state.paused || state.isPaused) {
      showAlertBanner('Resume the simulation before re-purifying a figure.', 2600, false);
      return false;
    }
    if (state.postAuditCelebration || state.gameOver) {
      showAlertBanner('Week has already wrapped.', 2600, false);
      return false;
    }
    if ((Number(state.favours) || 0) < 2) {
      showAlertBanner('Re-Purify & Re-Acquire requires 2 Favours.', 3000, true);
      return false;
    }
    if (state.fireAlarm?.active) {
      showAlertBanner('Evacuate KLB before re-purifying samples!', 3200, true);
      return false;
    }
    if (state.activePlayerAction) {
      showAlertBanner('Finish or step away from your current action first.', 3000, false);
      return false;
    }
    addFavours(-2);
    state.activePlayerAction = {
      kind: 'repurify_figure',
      figureId: fig.id,
      favourCost: 2,
      roomId: state.player.roomId,
      objId: null,
      x: Math.round(state.player.x),
      y: Math.round(state.player.y),
      label: `Re-Purifying ${fig.label}`,
      shortLabel: 'Re-Purify Figure',
      elapsedMins: 0,
      targetMins: 15
    };
    if (window.KLB.Audio?.playSfx) window.KLB.Audio.playSfx('pipette');
    showAlertBanner(`Re-purifying & re-acquiring "${fig.label}" (15m, -2 Favours).`, 3600, false);
    syncAllHUD(true);
    return true;
  }

  function openSpectrumPreviewModal(item, newlyCollected = false, moraleDelta = null) {
    const wasAlreadyPaused = Boolean(state && (state.paused || state.isPaused));
    const restorePause = wasAlreadyPaused || Boolean(state?._dlgUnpauseOnClose);
    setPaused(true);
    modalDismissable = true;
    modalEscapeHandler = () => { closeModal(); setPaused(restorePause); syncAllHUD(true); };

    const qVal = Math.round(item.quality || 0);
    const badgeCls = qVal >= 80 ? 'good' : qVal >= 65 ? 'warn' : 'poor';
    const yieldPart = item.yieldPct != null ? ` | Yield: ${Math.round(item.yieldPct)}%` : '';
    const moraleNote = moraleDelta != null
      ? ` (Morale ${moraleDelta >= 0 ? '+' : ''}${moraleDelta})`
      : '';
    const isSavedBookFig = Boolean(state && !state.spectatorMode && (state.labBook || []).some(f => f.id === item.id));
    const isFlawed = isFigureFlawed(item);
    const canOfferRepurify = Boolean(isSavedBookFig && isFlawed);
    const hasTwoFavours = (Number(state?.favours) || 0) >= 2;
    const repurifyTitle = hasTwoFavours
      ? 'Spend 2 Favours (15m) to clean this figure to 90% quality'
      : 'Requires 2 Favours to re-purify and re-acquire';

    const box = prepareModalBox('klb-modal', 'modal_open');
    box.innerHTML = `
      <header class="klb-modal-header">
        <div>
          <p class="mono-muted" style="color:#93c5fd;">${newlyCollected ? 'Saved to Lab Book' : 'Analytical Data Inspection'}${escHtml(moraleNote)}</p>
          <h3>${escHtml(item.label)}</h3>
        </div>
        <span class="metric-badge ${badgeCls}">
          Quality: ${qVal}%${escHtml(yieldPart)}
        </span>
      </header>
      <div class="klb-modal-body">
        <div style="background:#070b12;border:1px solid var(--border-subtle);border-radius:8px;padding:10px;display:flex;justify-content:center;">
          <canvas id="spectrum-modal-canvas" width="680" height="300" style="width:100%;max-width:680px;aspect-ratio:680/300;height:auto;"></canvas>
        </div>
        <p style="font-size:12.5px;color:#cbd5e1;">
          Notes: ${escHtml(item.notes || 'Recorded.')}
          ${isFlawed ? '<br><span style="color:#fcd34d;">Tip: Disclose honestly in Friday\'s 4-Slide Deck, or spend 2 Favours (15m) to Re-Purify &amp; Re-Acquire cleanly to 90% quality.</span>' : ''}
        </p>
      </div>
      <footer class="klb-modal-footer" style="justify-content:flex-end;">
        ${canOfferRepurify ? `
          <button id="btn-repurify-spec" type="button" class="rpg-btn" data-hotkey="2" ${hasTwoFavours ? '' : 'disabled'} title="${escHtml(repurifyTitle)}">
            ${icon('sparkles', 13)}<span>[2] Re-Purify &amp; Re-Acquire (${hasTwoFavours ? '2 Favours, 15m' : 'Needs 2 Favours'})</span>
          </button>
        ` : ''}
        <button id="btn-close-spec" class="rpg-btn primary" data-hotkey="1">[1] Continue</button>
      </footer>
    `;
    el('modal-backdrop').classList.remove('hidden');
    if (window.KLB.Spectra?.renderToCanvas) {
      window.KLB.Spectra.renderToCanvas(el('spectrum-modal-canvas'), item);
    }
    el('btn-close-spec').onclick = modalEscapeHandler;
    if (canOfferRepurify && el('btn-repurify-spec') && hasTwoFavours) {
      el('btn-repurify-spec').onclick = () => {
        closeModal();
        setPaused(false);
        startRepurifyFigureAction(item);
      };
    }
  }

  function openMinigameOverlay(type, title, subtitle, onDone, extraConfig = null) {
    setPaused(true);
    modalDismissable = true;
    let finished = false;
    modalEscapeHandler = () => {
      if (finished) return;
      if (window.KLB.Minigames?.abortActive) window.KLB.Minigames.abortActive();
      if (finished) return;
      finished = true;
      closeModal();
      setPaused(false);
      onDone({ score: 0, aborted: true });
    };

    const isBenchMg = ['biotage', 'gel_load', 'syringe_cryo'].includes(type);
    const openSfx = type === 'buchi_bump' ? 'rotavap_whoosh' : (isBenchMg ? 'pipette' : 'modal_open');
    const box = prepareModalBox('klb-modal', openSfx);
    box.innerHTML = `<div id="minigame-mount"></div>`;
    el('modal-backdrop').classList.remove('hidden');
    const mgConfig = Object.assign(
      { title, subtitle: subtitle || '', playerId: state?.player?.id || null },
      extraConfig || {}
    );
    window.KLB.Minigames.openModal(type, el('minigame-mount'), mgConfig, result => {
      if (finished) return;
      finished = true;
      closeModal();
      setPaused(false);
      onDone(result || { score: 85 });
    });
  }

  function openAlexStealthEncounter() {
    if (!window.KLB.Minigames) return;
    if (state) state._alexEncounteredToday = true;
    alexPursuitActive = true;
    syncAudioAmbience();
    openMinigameOverlay('alex_stealth', '17:18 Corridor Evasion', 'Avoid Alex King and keep 3F hidden', res => {
      alexPursuitActive = false;
      const ak = state.npcs.alex_king;
      if (ak) ak.roomId = 'offsite';
      syncAudioAmbience();
      if (!res.aborted && (res.score || 0) >= 60) {
        state.morale = Math.min(100, state.morale + 8);
        window.KLB.Sim.pushWhatsApp(state, state.player.id, 'Shook Alex King off with the CIB NMR decoy — 3F write-up office remains safe.');
        showAlertBanner('Clean CIB Decoy (+8 Morale).', 3600, false);
      } else {
        const mLoss = state.player.id === 'calise_bahou' ? 6 : 12;
        state.morale = Math.max(0, state.morale - mLoss);
        state.social = Math.max(0, (state.social ?? 84) - 5);
        showAlertBanner(`Cornered in the corridor by Alex King (-${mLoss} Morale).`, 4200, true);
      }
      window.KLB.Sim.checkPermadeath(state, simCallbacks());
      syncAllHUD(true);
    });
    syncAudioAmbience();
  }

  function openFireAlarmModal() {
    if (!state?.player || (state.player.roomId !== 'klb_2f' && state.player.roomId !== 'klb_3f')) {
      return;
    }
    setPaused(true);
    modalDismissable = false;
    modalEscapeHandler = null;
    const rxnCount = (state.activeStationJobs || []).length;
    const box = prepareModalBox('ev-modal', 'warning', 'ev-theme-crisis');
    box.innerHTML = `
      <div class="ev-modal-header">
        <div class="ev-modal-head-body">
          <span class="ev-modal-cat crisis">${icon('flame', 11)}<span>Mandatory Evacuation</span></span>
          <h3 class="ev-modal-title" style="display:flex;align-items:center;gap:8px;color:#fca5a5;">
            ${icon('flame', 19)}
            <span>KLB Fire Alarm — Evacuate Building</span>
          </h3>
          <p class="ev-modal-desc">
            Evacuate out the left fire exit immediately until the 30-minute drill clears. ${rxnCount ? `${rxnCount} bench timer(s) keep ticking in real time.` : 'Stay clear of KLB until all-clear.'}
          </p>
        </div>
      </div>
      <div class="ev-choices-list">
        <button id="btn-evac-now" type="button" class="ev-choice-card" data-hotkey="1">
          <div class="ev-choice-top">
            <div class="ev-choice-left">
              <span class="ev-choice-key">1</span>
              <span class="dir-icon-badge crisis">${icon('shield-check', 15)}</span>
              <span class="ev-choice-label">Evacuate via Left Fire Exit Now</span>
            </div>
            <span class="ev-choice-right">
              <span class="klb-tag good">Safe</span>
              <span class="ev-choice-chevron">${icon('chevron-right', 14)}</span>
            </span>
          </div>
        </button>
        <button id="btn-walk-evac" type="button" class="ev-choice-card" data-hotkey="2">
          <div class="ev-choice-top">
            <div class="ev-choice-left">
              <span class="ev-choice-key">2</span>
              <span class="dir-icon-badge warn">${icon('alert-triangle', 15)}</span>
              <span class="ev-choice-label">Dismiss &amp; Walk to Left Fire Exit</span>
            </div>
            <span class="ev-choice-right">
              <span class="klb-tag warn">Manual</span>
              <span class="ev-choice-chevron">${icon('chevron-right', 14)}</span>
            </span>
          </div>
        </button>
      </div>
      <div class="ev-modal-footer">
        <span>Press 1–2 or click an option</span>
        <span class="modal-footer-pill">${icon('map-pin', 11)}<span>Current Room: ${escHtml(window.KLB.ROOM_META?.[state.player.roomId]?.shortName || state.player.roomId)}</span></span>
      </div>
    `;
    el('modal-backdrop').classList.remove('hidden');
    el('btn-evac-now').onclick = () => { closeModal(); setPaused(false); completeFireEvacuation(); };
    el('btn-walk-evac').onclick = () => {
      closeModal();
      setPaused(false);
      showAlertBanner('Head to the left fire exit immediately.', 5000, true);
    };
  }

  function completeFireEvacuation() {
    const minsLeft = Math.max(1, Math.ceil(state.fireAlarm.remainingMins || 30));
    transitionToRoom('gordons_cafe', window.KLB.ROOM_META.gordons_cafe.entrySpawn);
    showAlertBanner(`Evacuated KLB safely via the left fire exit! Wait outside until all-clear (${minsLeft}m left).`, 4500, false);
    syncAllHUD(true);
  }

  function openDeskActionsModal(obj) {
    const targetObj = obj || { id: 'desk', x: Math.round(state.player.x), y: Math.round(state.player.y) };

    if (state.activePlayerAction) {
      const act = state.activePlayerAction;
      if ((act.kind === 'weekly_report' || act.kind === 'manuscript_draft') && act.objId === targetObj.id) {
        const curPct = Math.round(act.kind === 'weekly_report' ? state.weeklyReportProgress : state.manuscriptProgress);
        showDialogue(state.player.id, act.label, `Currently writing (${curPct}% saved).`, [
          { label: '[1] Keep Writing', primary: true, onClick: closeDialogue },
          { label: '[2] Stop & Save', onClick: () => { closeDialogue(); cancelActivePlayerAction(); } }
        ]);
        return;
      }
      showAlertBanner('Finish or step away from your current action first.', 3200, false);
      return;
    }

    snapPlayerToDeskChair(targetObj);
    setPaused(true);
    modalDismissable = true;
    modalEscapeHandler = () => { closeModal(); setPaused(false); };

    const hour = state.timeMins / 60;
    const room = state.player.roomId;
    const is3F = room === 'klb_3f';
    const isQuiet = is3F || state.player.headphonesOn;
    const wrPct = Math.round(state.weeklyReportProgress || 0);
    const msPct = Math.round(state.manuscriptProgress || 0);
    const needClicker = state.player.id === 'andre_shamsabadi' && !state.prep.has_clicker && is3F;
    const lunchWindow = is3F && hour >= 11.5 && hour <= 14.5;
    const aoe2Active = Boolean(state.aoe2Event?.active && state.timeMins >= 17 * 60 && state.timeMins < 18 * 60);
    const gamingMins = aoe2Active
      ? Math.min(60, Math.max(10, Math.round(18 * 60 - state.timeMins)))
      : 23;
    const camp = window.KLB.getCampaign(state.player.id);
    const hasFavour = (Number(state.favours) || 0) >= 1;
    const nowMono = getMonotonicSimMins(state);
    const gamingRem = (state._lastGamingBreakMins != null && nowMono >= state._lastGamingBreakMins && (nowMono - state._lastGamingBreakMins) < 60)
      ? Math.max(1, Math.ceil(60 - (nowMono - state._lastGamingBreakMins)))
      : 0;
    const canProofReport = wrPct < 100 && !state._proofreadReportUsed;
    const canProofMs = msPct < 100 && !state._proofreadMsUsed;
    let proofreadTarget = null;
    if (state.dayIdx <= 3 && wrPct < 100) {
      proofreadTarget = canProofReport
        ? { key: 'weekly_report', name: 'Weekly Report', used: false }
        : (canProofMs ? { key: 'manuscript_draft', name: 'Manuscript Draft', used: false } : { key: 'weekly_report', name: 'Weekly Report', used: true });
    } else if (msPct < 100) {
      proofreadTarget = { key: 'manuscript_draft', name: 'Manuscript Draft', used: Boolean(state._proofreadMsUsed) };
    } else if (wrPct < 100) {
      proofreadTarget = { key: 'weekly_report', name: 'Weekly Report', used: Boolean(state._proofreadReportUsed) };
    }

    const deskCards = [
      {
        id: 'desk-weekly-report',
        icon: 'file-text',
        label: 'Write Weekly Report',
        subline: wrPct >= 100 ? 'Submitted at 100%' : 'Full draft est: ~74m quiet / ~88m normal',
        tagText: wrPct >= 100 ? 'Complete' : `${wrPct}% | Due Thu 18:00`,
        tagCls: wrPct >= 100 ? 'good' : 'info',
        disabled: wrPct >= 100,
        disabledTitle: 'Already completed at 100%'
      },
      {
        id: 'desk-manuscript',
        icon: 'pen-tool',
        label: 'Write Manuscript Draft',
        subline: msPct >= 100 ? 'Complete at 100%' : 'Full draft est: ~94m quiet / ~114m normal',
        tagText: msPct >= 100 ? 'Complete' : `${msPct}% | Due Fri 18:00`,
        tagCls: msPct >= 100 ? 'good' : 'info',
        disabled: msPct >= 100,
        disabledTitle: 'Already completed at 100%'
      }
    ];
    if (proofreadTarget) {
      const prDisabled = proofreadTarget.used || !hasFavour;
      deskCards.push({
        id: 'desk-peer-proofread',
        icon: 'sparkles',
        label: `Peer Proofread: ${proofreadTarget.name} (+18%, 0m)`,
        subline: proofreadTarget.used
          ? 'Already peer-proofread once this week (1x limit per document).'
          : 'Have a labmate red-pen your schemes, tables, and experimental wording instantly.',
        tagText: proofreadTarget.used ? 'Used (1/1)' : (hasFavour ? '1 Favour' : 'Needs 1 Favour'),
        tagCls: proofreadTarget.used ? 'good' : (hasFavour ? 'warn' : 'danger'),
        disabled: prDisabled,
        disabledTitle: proofreadTarget.used ? 'Already peer-proofread this document once this week' : 'Requires 1 Favour for Peer Proofread'
      });
    }
    deskCards.push(
      {
        id: 'desk-gaming',
        icon: 'gamepad-2',
        label: aoe2Active ? 'Join 17:00 AoE2 / Worms Lobby' : 'Play Video Game Break (AoE2 / Worms)',
        subline: '',
        tagText: gamingRem > 0 ? `Cooldown ${gamingRem}m` : `${gamingMins}m`,
        tagCls: gamingRem > 0 ? 'warn' : (aoe2Active ? 'good' : 'info'),
        disabled: gamingRem > 0,
        disabledTitle: gamingRem > 0 ? `Gaming break on cooldown (${gamingRem}m left)` : ''
      },
      {
        id: 'desk-slides',
        icon: 'presentation',
        label: 'Build Friday 4-Slide Deck',
        subline: '',
        tagText: state.slideDeck.ready ? 'Ready' : 'Pending',
        tagCls: state.slideDeck.ready ? 'good' : 'warn',
        disabled: false
      }
    );
    if (lunchWindow) {
      const hadLunch = Boolean(state.hadLunchToday);
      deskCards.push({
        id: 'desk-packed-lunch',
        icon: 'utensils',
        label: hadLunch ? 'Eat Packed Lunch (Already Had Lunch Today)' : 'Eat Packed Lunch',
        subline: '',
        tagText: hadLunch ? 'Done Today' : '19m',
        tagCls: 'good',
        disabled: hadLunch,
        disabledTitle: hadLunch ? 'Already had lunch today' : ''
      });
    }
    if (needClicker) {
      deskCards.push({
        id: 'desk-clicker',
        icon: 'zap',
        label: 'Grab Laser Clicker from Wall Hook',
        subline: '',
        tagText: 'Friday Boost',
        tagCls: 'warn',
        disabled: false
      });
    }

    const cardsHtml = deskCards.map((c, idx) => {
      const disTitle = c.disabled ? (c.disabledTitle || 'Unavailable') : '';
      return `
      <button id="${escHtml(c.id)}" type="button" class="ev-choice-card" data-hotkey="${idx + 1}" ${c.disabled ? `disabled title="${escHtml(disTitle)}"` : ''}>
        <div class="ev-choice-top">
          <div class="ev-choice-left">
            <span class="ev-choice-key">${idx + 1}</span>
            <span class="dir-icon-badge desk">${icon(c.icon, 16)}</span>
            <div>
              <div class="ev-choice-label">${escHtml(c.label)}</div>
              ${c.subline ? `<div style="font-size:11px;color:#94a3b8;margin-top:2px;">${escHtml(c.subline)}</div>` : ''}
            </div>
          </div>
          <span class="ev-choice-right">
            <span class="klb-tag ${escHtml(c.tagCls)}">${escHtml(c.tagText)}</span>
            <span class="ev-choice-chevron">${icon('chevron-right', 14)}</span>
          </span>
        </div>
      </button>
    `;
    }).join('');

    const box = prepareModalBox('klb-modal', 'modal_open', 'klb-theme-desk');
    box.innerHTML = `
      <header class="klb-modal-header">
        <div>
          <h3>Write-Up Desk (${escHtml(window.KLB.ROOM_META[room]?.shortName || room)})</h3>
          <p class="mono-muted" style="margin-top:3px;">Topic: ${escHtml(camp?.manuscriptTopic || 'Weekly Paper')} | Faster Focus with high Energy &amp; Headphones${isQuiet ? ' (Quiet Boost Active)' : ''}</p>
        </div>
        <button id="btn-desk-close" class="hud-btn">${icon('x', 14)}<span>Close</span></button>
      </header>
      <div class="klb-modal-body">
        <div class="ev-choices-list" style="margin-top:0;">${cardsHtml}</div>
      </div>
      <footer class="klb-modal-footer">
        <span>Press 1–${deskCards.length} or click an action</span>
        <span class="modal-footer-pill">${icon('sparkles', 11)}<span>${isQuiet ? 'Focus Multiplier: Quiet / Headphones ON' : 'Tip: 3F or Headphones speeds writing'}</span></span>
      </footer>
    `;
    el('modal-backdrop').classList.remove('hidden');
    el('btn-desk-close').onclick = modalEscapeHandler;

    if (el('desk-weekly-report') && !el('desk-weekly-report').disabled) {
      el('desk-weekly-report').onclick = () => {
        closeModal();
        setPaused(false);
        state.activePlayerAction = {
          kind: 'weekly_report',
          roomId: room,
          objId: targetObj.id,
          x: targetObj.x,
          y: targetObj.y,
          label: 'Weekly Report',
          shortLabel: 'Weekly Report',
          elapsedMins: 0,
          ratePerMin: isQuiet ? 1.36 : 1.14,
          progress: (state.weeklyReportProgress || 0) / 100
        };
        showAlertBanner('Drafting Weekly Report (~74m quiet / ~88m normal) — step away anytime to save progress.', 3200, false);
        syncAllHUD(true);
      };
    }

    if (el('desk-manuscript') && !el('desk-manuscript').disabled) {
      el('desk-manuscript').onclick = () => {
        closeModal();
        setPaused(false);
        state.activePlayerAction = {
          kind: 'manuscript_draft',
          roomId: room,
          objId: targetObj.id,
          x: targetObj.x,
          y: targetObj.y,
          label: 'Manuscript Draft',
          shortLabel: 'Manuscript',
          elapsedMins: 0,
          ratePerMin: isQuiet ? 1.06 : 0.88,
          progress: (state.manuscriptProgress || 0) / 100
        };
        showAlertBanner('Drafting Manuscript (~94m quiet / ~114m normal) — step away anytime to save progress.', 3200, false);
        syncAllHUD(true);
      };
    }

    if (proofreadTarget && el('desk-peer-proofread') && !el('desk-peer-proofread').disabled) {
      el('desk-peer-proofread').onclick = () => {
        if ((Number(state.favours) || 0) < 1 || proofreadTarget.used) return;
        addFavours(-1);
        let updatedPct = 0;
        if (proofreadTarget.key === 'weekly_report') {
          state._proofreadReportUsed = true;
          state.weeklyReportProgress = clamp((state.weeklyReportProgress || 0) + 18, 0, 100);
          updatedPct = Math.round(state.weeklyReportProgress);
        } else {
          state._proofreadMsUsed = true;
          state.manuscriptProgress = clamp((state.manuscriptProgress || 0) + 18, 0, 100);
          updatedPct = Math.round(state.manuscriptProgress);
        }
        const reviewers = (state.player.id === 'archie_wall'
          ? ['nafsika_forte', 'antoine_maruani', 'richard_spears', 'daniel_richards']
          : ['antoine_maruani', 'richard_spears', 'daniel_richards', 'faiza_javaid']
        ).filter(id => id !== state.player.id);
        const reviewerId = reviewers[0] || 'richard_spears';
        const reviewerName = window.KLB.CAST_BY_ID?.[reviewerId]?.shortName || 'Labmate';
        window.KLB.Sim.pushWhatsApp(state, reviewerId, `Proofread your ${proofreadTarget.name} schemes and SI tables (+18% -> ${updatedPct}%).`);
        if (window.KLB.Audio?.playSfx) window.KLB.Audio.playSfx('success');
        closeModal();
        setPaused(false);
        showAlertBanner(`${reviewerName} proofread your ${proofreadTarget.name} (+18% -> ${updatedPct}%, -1 Favour).`, 3800, false);
        syncAllHUD(true);
      };
    }

    if (el('desk-gaming') && !el('desk-gaming').disabled) {
      el('desk-gaming').onclick = () => {
        closeModal();
        setPaused(false);
        state.activePlayerAction = {
          kind: 'gaming',
          roomId: room,
          objId: targetObj.id,
          x: targetObj.x,
          y: targetObj.y,
          label: aoe2Active ? '17:00 AoE2 Lobby' : 'AoE2 Match',
          shortLabel: 'AoE2 / Worms',
          elapsedMins: 0,
          targetMins: gamingMins
        };
        if (window.KLB.Audio) window.KLB.Audio.playSfx('lan_blip');
        showAlertBanner(aoe2Active ? `Joined 17:00 AoE2 / Worms lobby (${gamingMins}m).` : 'Playing AoE2 / Worms match (23m).', 2800, false);
        syncAllHUD(true);
      };
    }

    el('desk-slides').onclick = () => { closeModal(); setPaused(false); openSlideBuilderOverlay(); };

    if (el('desk-packed-lunch') && !el('desk-packed-lunch').disabled) {
      el('desk-packed-lunch').onclick = () => {
        if (state.hadLunchToday) return;
        closeModal();
        setPaused(false);
        state.activePlayerAction = {
          kind: 'packed_lunch',
          roomId: room,
          objId: targetObj.id,
          x: targetObj.x,
          y: targetObj.y,
          label: 'Packed Lunch',
          shortLabel: 'Packed Lunch',
          elapsedMins: 0,
          targetMins: 19
        };
        showAlertBanner('Eating packed lunch on 3F (19m).', 2800, false);
        syncAllHUD(true);
      };
    }

    if (needClicker && el('desk-clicker')) {
      el('desk-clicker').onclick = () => {
        state.prep.has_clicker = true;
        if (window.KLB.Audio?.playSfx) window.KLB.Audio.playSfx('ui_click');
        closeModal();
        setPaused(false);
        showAlertBanner('Retrieved Laser Clicker for Friday Audit.', 3400, false);
        syncAllHUD(true);
      };
    }
  }

  function startGordonAction(kind, isQuartet = false, obj = null) {
    if (!state || state.spectatorMode) return;
    if (state.activePlayerAction) {
      showAlertBanner('Finish or step away from your current action first.', 3200, false);
      return;
    }
    const targetObj = obj || { id: 'obj_uq590yz', x: 10, y: 1 };
    if (kind === 'coffee' && isQuartet) {
      const qWin = window.KLB.Sim.isCoffeeQuartetWindow ? window.KLB.Sim.isCoffeeQuartetWindow(state) : null;
      state.activePlayerAction = {
        kind: 'coffee',
        quartet: true,
        quartetWinId: qWin?.id || ((state.timeMins || 0) < 13 * 60 ? 'morning' : 'afternoon'),
        quartetWinKey: getCoffeeQuartetWindowKey(state),
        roomId: 'gordons_cafe',
        objId: targetObj.id,
        x: targetObj.x,
        y: targetObj.y,
        label: 'Coffee Quartet',
        shortLabel: 'Coffee Quartet',
        elapsedMins: 0,
        targetMins: 15
      };
      showAlertBanner("Sitting with Coffee Quartet at Gordon's Café (15m).", 3000, false);
    } else if (kind === 'coffee') {
      const nowMono = getMonotonicSimMins(state);
      if (state._lastCoffeeBreakMins != null && nowMono >= state._lastCoffeeBreakMins && (nowMono - state._lastCoffeeBreakMins) < 60) {
        const rem = Math.max(1, Math.ceil(60 - (nowMono - state._lastCoffeeBreakMins)));
        showAlertBanner(`Coffee break on cooldown (${rem}m left).`, 2800, false);
        return;
      }
      state.activePlayerAction = {
        kind: 'coffee',
        quartet: false,
        roomId: 'gordons_cafe',
        objId: targetObj.id,
        x: targetObj.x,
        y: targetObj.y,
        label: 'Coffee',
        shortLabel: 'Coffee',
        elapsedMins: 0,
        targetMins: 10
      };
      showAlertBanner("Having espresso at Gordon's Café (10m).", 2800, false);
    } else if (kind === 'lunch') {
      if (state.hadLunchToday) {
        showAlertBanner('Already had lunch today.', 2600, false);
        return;
      }
      state.activePlayerAction = {
        kind: 'lunch',
        roomId: 'gordons_cafe',
        objId: targetObj.id,
        x: targetObj.x,
        y: targetObj.y,
        label: "Gordon's Lunch",
        shortLabel: "Gordon's Lunch",
        elapsedMins: 0,
        targetMins: 23
      };
      showAlertBanner("Having lunch at Gordon's Café (23m).", 3000, false);
    }
    if (window.KLB.Audio) window.KLB.Audio.playSfx('sip');
    syncAllHUD(true);
  }

  function openGordonsMenuModal(obj = null) {
    if (state.activePlayerAction) {
      showAlertBanner('Finish or step away from your current action first.', 3200, false);
      return;
    }
    setPaused(true);
    modalDismissable = true;
    modalEscapeHandler = () => { closeModal(); setPaused(false); };

    const targetObj = obj || { id: 'obj_uq590yz', x: 10, y: 1 };
    const hour = state.timeMins / 60;
    const quartetWin = window.KLB.Sim.isCoffeeQuartetWindow(state);
    const quartetHere = Boolean(quartetWin);
    const quartetWinKey = quartetWin ? getCoffeeQuartetWindowKey(state) : '';
    const quartetJoined = quartetHere && state._quartetJoinedWindowKey === quartetWinKey;
    const lunchHours = hour >= 11.0 && hour <= 15.0;
    const nowMono = getMonotonicSimMins(state);
    const coffeeRem = (state._lastCoffeeBreakMins != null && nowMono >= state._lastCoffeeBreakMins && (nowMono - state._lastCoffeeBreakMins) < 60)
      ? Math.max(1, Math.ceil(60 - (nowMono - state._lastCoffeeBreakMins)))
      : 0;

    const menuItems = [];
    if (quartetHere) {
      const isJoao = state.player.id === 'joao_nogueira';
      const isJoaoMorning = isJoao && quartetWin?.id === 'morning';
      const cqNames = [
        { id: 'joao_nogueira', name: 'João' },
        { id: 'nafsika_forte', name: 'Nafsika' }
      ];
      if (!state.mutators?.vijays_not_in) cqNames.push({ id: 'vijay_chudasama', name: 'Vijay' });
      cqNames.push({ id: 'faiza_javaid', name: 'Faiza' });
      const otherNames = cqNames.filter(m => m.id !== state.player.id).map(m => m.name);
      const cqListText = otherNames.length > 1
        ? `${otherNames.slice(0, -1).join(', ')} & ${otherNames[otherNames.length - 1]}`
        : (otherNames[0] || 'the crew');
      const quartetPills = [
        { text: '+Energy', icon: 'zap' },
        { text: isJoao ? '+2x Morale' : '+Morale', icon: 'smile' },
        { text: '+Social', icon: 'users' },
        { text: '+6 Patience', icon: 'gauge' },
        { text: isJoaoMorning ? '+2 Favours' : '+1 Favour', icon: 'award' }
      ];
      menuItems.push({
        id: 'cafe-quartet',
        icon: 'coffee',
        label: `Join Coffee Quartet (${cqListText})`,
        duration: quartetJoined ? 'Joined' : '15m',
        durCls: quartetJoined ? 'good' : 'warn',
        disabled: quartetJoined,
        disabledTitle: quartetJoined ? 'Already joined this Coffee Quartet session' : '',
        pills: quartetPills
      });
    }
    menuItems.push({
      id: 'cafe-coffee',
      icon: 'coffee',
      label: 'Have Coffee (Double Flat White / Espresso)',
      duration: coffeeRem > 0 ? `Cooldown ${coffeeRem}m` : '10m',
      durCls: coffeeRem > 0 ? 'warn' : 'info',
      disabled: coffeeRem > 0,
      disabledTitle: coffeeRem > 0 ? `Coffee break on cooldown (${coffeeRem}m left)` : '',
      pills: [
        { text: '+Energy', icon: 'zap' },
        { text: '+Morale', icon: 'smile' },
        { text: '+Social', icon: 'users' }
      ]
    });
    if (lunchHours) {
      const hadLunch = Boolean(state.hadLunchToday);
      menuItems.push({
        id: 'cafe-lunch',
        icon: 'utensils',
        label: hadLunch ? 'Have Lunch (Already Had Lunch Today)' : 'Have Lunch (Warm Panini & Pastry)',
        duration: hadLunch ? 'Done Today' : '23m',
        durCls: 'good',
        disabled: hadLunch,
        disabledTitle: hadLunch ? 'Already had lunch today' : '',
        pills: [
          { text: '+Energy', icon: 'zap' },
          { text: '+Morale', icon: 'smile' },
          { text: '+Social', icon: 'users' }
        ]
      });
    }

    const menuHtml = menuItems.map((m, idx) => `
      <button id="${escHtml(m.id)}" type="button" class="ev-choice-card" data-hotkey="${idx + 1}" ${m.disabled ? `disabled title="${escHtml(m.disabledTitle || '')}"` : ''}>
        <div class="ev-choice-top">
          <div class="ev-choice-left">
            <span class="ev-choice-key">${idx + 1}</span>
            <span class="dir-icon-badge cafe">${icon(m.icon, 16)}</span>
            <span class="ev-choice-label">${escHtml(m.label)}</span>
          </div>
          <span class="ev-choice-right">
            <span class="klb-tag ${escHtml(m.durCls)}">${icon(m.duration === 'Joined' || m.duration === 'Done Today' ? 'check-circle' : 'clock', 10)}<span>${escHtml(m.duration)}</span></span>
            <span class="ev-choice-chevron">${icon('chevron-right', 14)}</span>
          </span>
        </div>
        <div class="ev-choice-deltas">
          ${m.pills.map(p => `<span class="ev-delta-pill pos">${icon(p.icon, 10)}<span>${escHtml(p.text)}</span></span>`).join('')}
        </div>
      </button>
    `).join('');

    const box = prepareModalBox('klb-modal-sm', 'modal_open', 'klb-theme-cafe');
    box.innerHTML = `
      <header class="klb-modal-header">
        <div>
          <h3>Gordon's Café</h3>
          <p class="mono-muted" style="margin-top:2px;">25 Gordon Street</p>
        </div>
        <button id="btn-cafe-close" class="hud-btn">${icon('x', 14)}<span>Step Back</span></button>
      </header>
      <div class="klb-modal-body">
        <div class="ev-choices-list" style="margin-top:0;">${menuHtml}</div>
      </div>
      <footer class="klb-modal-footer">
        <span>Press 1–${menuItems.length} or click an order</span>
        <span class="modal-footer-pill">${icon('coffee', 11)}<span>${quartetHere ? 'Coffee Quartet active now' : 'Standard counter service'}</span></span>
      </footer>
    `;
    el('modal-backdrop').classList.remove('hidden');
    el('btn-cafe-close').onclick = modalEscapeHandler;

    if (el('cafe-quartet') && !quartetJoined) {
      el('cafe-quartet').onclick = () => {
        closeModal();
        setPaused(false);
        startGordonAction('coffee', true, targetObj);
      };
    }

    if (el('cafe-coffee') && !el('cafe-coffee').disabled) {
      el('cafe-coffee').onclick = () => {
        closeModal();
        setPaused(false);
        startGordonAction('coffee', false, targetObj);
      };
    }

    if (el('cafe-lunch') && !el('cafe-lunch').disabled) {
      el('cafe-lunch').onclick = () => {
        if (state.hadLunchToday) return;
        closeModal();
        setPaused(false);
        startGordonAction('lunch', false, targetObj);
      };
    }
  }

  function openBloomsburyModal() {
    setPaused(true);
    modalDismissable = true;
    modalEscapeHandler = () => { closeModal(); setPaused(false); };

    if (state.postAuditCelebration) {
      const curRoom = state.player.roomId;
      const box = prepareModalBox('klb-modal', 'modal_open', 'klb-theme-directory');
      box.innerHTML = `
        <header class="klb-modal-header">
          <div>
            <h3>Week ${state.weekNum} Complete — Gordon's Café</h3>
            <p class="mono-muted" style="margin-top:2px;">Final Friday Audit is wrapped. Start Week ${state.weekNum + 1} or stay and chat at Gordon's.</p>
          </div>
          <button id="btn-close-bloom" class="hud-btn">${icon('x', 14)}<span>Close</span></button>
        </header>
        <div class="klb-modal-body">
          <div id="bloom-errands" class="ev-choices-list" style="margin-top:0;">
            <button id="btn-bloom-next-week" type="button" class="ev-choice-card" data-hotkey="1">
              <div class="ev-choice-top">
                <div class="ev-choice-left">
                  <span class="ev-choice-key">1</span>
                  <span class="dir-icon-badge meeting">${icon('play', 16)}</span>
                  <span class="ev-choice-label" style="color:#86efac;">Start Week ${state.weekNum + 1} (Monday)</span>
                </div>
                <span class="ev-choice-right">
                  <span class="klb-tag good">Next Week</span>
                  <span class="ev-choice-chevron">${icon('chevron-right', 14)}</span>
                </span>
              </div>
            </button>
            <button id="btn-bloom-stay-gordons" type="button" class="ev-choice-card" data-hotkey="2">
              <div class="ev-choice-top">
                <div class="ev-choice-left">
                  <span class="ev-choice-key">2</span>
                  <span class="dir-icon-badge cafe">${icon('coffee', 16)}</span>
                  <span class="ev-choice-label">Stay at Gordon's</span>
                </div>
                <span class="ev-choice-right">
                  <span class="klb-tag info">Continue</span>
                  <span class="ev-choice-chevron">${icon('chevron-right', 14)}</span>
                </span>
              </div>
            </button>
          </div>
        </div>
        <footer class="klb-modal-footer">
          <span>Press 1–2 to choose</span>
          <span class="modal-footer-pill">${icon('map-pin', 11)}<span>Current Room: ${escHtml(window.KLB.ROOM_META?.[curRoom]?.shortName || curRoom)}</span></span>
        </footer>
      `;
      el('modal-backdrop').classList.remove('hidden');
      el('btn-close-bloom').onclick = modalEscapeHandler;
      el('btn-bloom-stay-gordons').onclick = modalEscapeHandler;
      el('btn-bloom-next-week').onclick = () => {
        closeModal();
        setPaused(false);
        startNextWeek();
      };
      return;
    }

    const hour = state.timeMins / 60;
    const curRoom = state.player.roomId;
    const curSub = getCurrentSubTask();
    const quartetHere = Boolean(window.KLB.Sim.isCoffeeQuartetWindow(state));
    const lunchHighlight = hour >= 11.5 && hour <= 14.5 && !state.hadLunchToday;
    const canEndDay = !state.postAuditCelebration && state.timeMins >= 18 * 60;
    const errands = (window.KLB.BLOOMSBURY_ERRANDS || []).filter(er => er.targetRoom !== 'klb_3f');

    const dirBadgeMap = {
      klb_2f: 'wetlab',
      gordons_cafe: 'cafe',
      cib_lg11_ms: 'ms',
      cib_lg1b_nmr: 'nmr',
      meeting_room: 'meeting'
    };

    let nextHotkey = 1;
    const itemsHtml = errands.map(er => {
      const hotkey = nextHotkey++;
      const isHere = curRoom === er.targetRoom;
      const isSubTarget = Boolean(curSub && curSub.roomId === er.targetRoom);
      const isCafeHighlight = er.id === 'gordons_cafe' && (quartetHere || lunchHighlight);
      const badgeCls = dirBadgeMap[er.targetRoom] || dirBadgeMap[er.id] || 'wetlab';
      const noteText = er.id === 'meeting_room'
        ? (state.player.id === 'archie_wall' ? 'Friday group meeting with Jamie Baker & Vijay Chudasama.' : 'Friday group meeting with Prof. Vijay Chudasama.')
        : (er.note || '');
      let hoursText = er.id === 'meeting_room' ? 'Fri 09:00 Group Meeting' : (er.hours || 'Open');
      const tags = [];
      if (isHere) tags.push(`<span class="klb-tag info">Here</span>`);
      if (isSubTarget) tags.push(`<span class="klb-tag good">Sub-Task</span>`);
      if (er.id === 'gordons_cafe' && quartetHere) tags.push(`<span class="klb-tag warn">Coffee Quartet</span>`);
      else if (er.id === 'gordons_cafe' && lunchHighlight) tags.push(`<span class="klb-tag info">Lunch Hours</span>`);
      if (er.targetRoom === 'cib_lg11_ms') {
        const unlocked = Boolean(state.prep?.knows_1965);
        tags.push(unlocked
          ? `<span class="klb-tag good">${icon('key', 10)}<span>Code 1965</span></span>`
          : `<span class="klb-tag warn">${icon('lock', 10)}<span>Keypad Locked</span></span>`);
        hoursText = unlocked ? 'Unlocked • 1965' : '07:30–19:30';
      } else if (er.targetRoom === 'cib_lg1b_nmr') {
        const unlocked = Boolean(state.prep?.knows_2145);
        tags.push(unlocked
          ? `<span class="klb-tag good">${icon('key', 10)}<span>Code 2145</span></span>`
          : `<span class="klb-tag warn">${icon('lock', 10)}<span>Keypad Locked</span></span>`);
        hoursText = unlocked ? 'Unlocked • 2145' : '07:30–19:30';
      }

      return `
        <button type="button" data-errand="${escHtml(er.id)}" class="ev-choice-card" data-hotkey="${hotkey}" ${isHere ? 'disabled title="You are already in this room"' : ''}>
          <div class="ev-choice-top">
            <div class="ev-choice-left">
              <span class="ev-choice-key">${hotkey}</span>
              <span class="dir-icon-badge ${escHtml(badgeCls)}">${icon(er.icon || 'map-pin', 16)}</span>
              <div>
                <div class="ev-choice-label" style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;">
                  <span>${escHtml(er.title)}</span>
                  ${tags.join('')}
                </div>
                <div style="font-size:11px;color:#94a3b8;margin-top:2px;">${escHtml(noteText)}</div>
              </div>
            </div>
            <span class="ev-choice-right">
              <span class="mono-muted" style="flex-shrink:0;color:${isSubTarget || isCafeHighlight ? '#86efac' : '#93c5fd'};">${escHtml(isHere ? 'Current Room' : hoursText)}</span>
              <span class="ev-choice-chevron">${icon('chevron-right', 14)}</span>
            </span>
          </div>
        </button>
      `;
    }).join('');

    const nightHotkey = canEndDay ? nextHotkey++ : null;
    const nextWeekHotkey = state.postAuditCelebration ? nextHotkey++ : null;

    const readyCibJob = (state.activeStationJobs || []).find(j =>
      (j.roomId === 'cib_lg11_ms' || j.roomId === 'cib_lg1b_nmr') &&
      (j.status === 'ready' || j.status === 'sweet' || j.status === 'overcooked')
    );
    const runningCibJob = (state.activeStationJobs || []).find(j =>
      (j.roomId === 'cib_lg11_ms' || j.roomId === 'cib_lg1b_nmr') &&
      j.status === 'running'
    );
    const curSubIsCib = Boolean(curSub && (curSub.roomId === 'cib_lg11_ms' || curSub.roomId === 'cib_lg1b_nmr'));
    const hasCourierTask = Boolean(!state.spectatorMode && !state.fireAlarm?.active && (readyCibJob || curSubIsCib));
    const hasCourierFavour = (Number(state.favours) || 0) >= 1;
    let courierBlockedMsg = '';
    if (!readyCibJob && curSubIsCib) {
      if (curSub.roomId === 'cib_lg11_ms' && state.lcmsBroken) {
        courierBlockedMsg = 'LG11 LC-MS offline — flush column with Kersti first';
      } else if (curSub.roomId === 'cib_lg1b_nmr' && state.abilFineOwed) {
        courierBlockedMsg = 'Abil NMR fine owed — settle in LG1b first';
      } else if (runningCibJob) {
        const pct = Math.min(99, Math.round((runningCibJob.elapsedMins / Math.max(1, runningCibJob.targetMins)) * 100));
        courierBlockedMsg = `${runningCibJob.label} acquiring (${pct}%) — courier can collect at 100%`;
      }
    }
    const courierDisabled = !hasCourierFavour || Boolean(courierBlockedMsg);
    const courierDesc = readyCibJob
      ? `Collect ready "${readyCibJob.label}" remotely and retrieve spectrum without walking to CIB.`
      : (courierBlockedMsg || `Have a labmate run "${curSub?.label || 'CIB sample'}" remotely in ${window.KLB.ROOM_META?.[curSub?.roomId]?.shortName || 'CIB'}.`);

    const isNmrOrMsTarget = Boolean(
      (curSub && (curSub.roomId === 'cib_lg11_ms' || curSub.roomId === 'cib_lg1b_nmr')) ||
      state.lcmsBroken ||
      state.abilFineOwed
    );
    const lastSampleAsk = state._sampleAskCooldowns?.[state.player.id];
    const sampleCooldownOk = lastSampleAsk == null || state.timeMins < lastSampleAsk || (state.timeMins - lastSampleAsk) >= 90;
    const hasLabColleagues = Object.values(state.npcs || {}).some(n =>
      n && n.roomId === curRoom && n.id !== state.player.id &&
      !['alex_king', 'claire_carmalt', 'safety_inspector'].includes(n.id)
    );
    const canAskSamples = Boolean(
      !state.spectatorMode &&
      !state.fireAlarm?.active &&
      (curRoom === 'klb_2f' || curRoom === 'klb_3f') &&
      isNmrOrMsTarget &&
      sampleCooldownOk &&
      hasLabColleagues
    );

    const courierDisabledTitle = !hasCourierFavour
      ? 'Requires 1 Favour for Labmate Sample Courier'
      : courierBlockedMsg;

    const box = prepareModalBox('klb-modal', 'modal_open', 'klb-theme-directory');
    box.innerHTML = `
      <header class="klb-modal-header">
        <div>
          <h3>UCL Campus &amp; KLB Directory</h3>
          <p class="mono-muted" style="margin-top:2px;">Take the spiral staircase in Lab 230 to reach the 3rd Floor Office.</p>
        </div>
        <button id="btn-close-bloom" class="hud-btn">${icon('x', 14)}<span>Close</span></button>
      </header>
      <div class="klb-modal-body">
        ${canAskSamples ? `
          <label class="bloom-sample-opt">
            <input id="chk-ask-samples" type="checkbox" checked />
            <span>NMR / Mass Spec trips: ask labmates if anyone needs samples submitted before leaving</span>
          </label>
        ` : ''}
        <div id="bloom-errands" class="ev-choices-list" style="margin-top:0;">
          ${itemsHtml}
          ${hasCourierTask ? `
            <button id="btn-bloom-courier" type="button" class="ev-choice-card" data-hotkey="c" ${courierDisabled ? `disabled title="${escHtml(courierDisabledTitle)}"` : ''}>
              <div class="ev-choice-top">
                <div class="ev-choice-left">
                  <span class="ev-choice-key">C</span>
                  <span class="dir-icon-badge ms">${icon('send', 16)}</span>
                  <div>
                    <div class="ev-choice-label" style="color:#7dd3fc;">Labmate Sample Courier (1 Favour, 0m)</div>
                    <div style="font-size:11px;color:#94a3b8;margin-top:2px;">${escHtml(courierDesc)}</div>
                  </div>
                </div>
                <span class="ev-choice-right">
                  <span class="klb-tag ${courierDisabled ? 'danger' : 'warn'}">${!hasCourierFavour ? 'Needs 1 Favour' : (readyCibJob ? 'Collect 0m' : 'Run 0m')}</span>
                  <span class="ev-choice-chevron">${icon('chevron-right', 14)}</span>
                </span>
              </div>
            </button>
          ` : ''}
          ${canEndDay ? `
            <button id="btn-head-home-night" type="button" class="ev-choice-card" data-hotkey="${nightHotkey}">
              <div class="ev-choice-top">
                <div class="ev-choice-left">
                  <span class="ev-choice-key">${nightHotkey}</span>
                  <span class="dir-icon-badge night">${icon('moon', 16)}</span>
                  <span class="ev-choice-label" style="color:#fde68a;">Head Home for the Night (End Day)</span>
                </div>
                <span class="ev-choice-right">
                  <span class="klb-tag warn">Roll Day</span>
                  <span class="ev-choice-chevron">${icon('chevron-right', 14)}</span>
                </span>
              </div>
            </button>
          ` : ''}
          ${state.postAuditCelebration ? `
            <button id="btn-bloom-next-week" type="button" class="ev-choice-card" data-hotkey="${nextWeekHotkey}">
              <div class="ev-choice-top">
                <div class="ev-choice-left">
                  <span class="ev-choice-key">${nextWeekHotkey}</span>
                  <span class="dir-icon-badge meeting">${icon('play', 16)}</span>
                  <span class="ev-choice-label" style="color:#86efac;">Start Week ${state.weekNum + 1} (Monday)</span>
                </div>
                <span class="ev-choice-right">
                  <span class="klb-tag good">Next Week</span>
                  <span class="ev-choice-chevron">${icon('chevron-right', 14)}</span>
                </span>
              </div>
            </button>
          ` : ''}
        </div>
      </div>
      <footer class="klb-modal-footer">
        <span>Press 1–${nextHotkey - 1}${hasCourierTask ? ' or C' : ''} to choose</span>
        <span class="modal-footer-pill">${icon('map-pin', 11)}<span>Current Room: ${escHtml(window.KLB.ROOM_META?.[curRoom]?.shortName || curRoom)}</span></span>
      </footer>
    `;
    el('modal-backdrop').classList.remove('hidden');
    el('btn-close-bloom').onclick = modalEscapeHandler;

    if (hasCourierTask && el('btn-bloom-courier') && !courierDisabled) {
      el('btn-bloom-courier').onclick = () => {
        if ((Number(state.favours) || 0) < 1) return;
        const couriers = (state.player.id === 'archie_wall'
          ? ['nafsika_forte', 'marcos_fernandez', 'daniel_richards', 'antoine_maruani']
          : ['marcos_fernandez', 'daniel_richards', 'antoine_maruani', 'faiza_javaid']
        ).filter(id => id !== state.player.id);
        const courierId = couriers[0] || 'marcos_fernandez';
        const courierName = window.KLB.CAST_BY_ID?.[courierId]?.shortName || 'Labmate';
        const curStepNow = getCurrentCampaignStep();
        const curSubNow = getCurrentSubTask(curStepNow);

        closeModal();
        setPaused(false);

        if (readyCibJob) {
          addFavours(-1);
          const job = removeStationJob(readyCibJob.id);
          const camp = window.KLB.getCampaign(state.player.id);
          const step = camp?.steps?.[job.stepIdx];
          if (step) {
            const nextSub = step.subTasks?.[job.subTaskIdx + 1];
            let targetSubIdx = job.subTaskIdx;
            if (curStepNow && curStepNow.index === job.stepIdx && curSubNow?.mode === 'collect') {
              if (!state.completedSubTasks.includes(job.subTaskId)) state.completedSubTasks.push(job.subTaskId);
              targetSubIdx = state.campaignSubTaskIdx;
            } else if (nextSub?.requiresJobFromPrev) {
              if (!state.completedSubTasks.includes(job.subTaskId)) state.completedSubTasks.push(job.subTaskId);
              targetSubIdx = job.subTaskIdx + 1;
            }
            const targetSub = step.subTasks?.[targetSubIdx];
            const m = calcStepMetrics(step, { fromJob: job, stationType: job.stationType });
            state.curStepPerf = m;
            const figItem = createLabBookFigure(step, job.stepIdx, m.quality, m.yieldPct, m.blueDyeMishap, m.outcomeText, targetSub?.viewOutput || job.viewOutput || step.dataOutput?.type);
            state.labBook.push(figItem);
            const moraleDelta = window.KLB.Sim.applyExperimentOutcomeToMorale(state, m.quality, m.yieldPct);
            window.KLB.Sim.pushWhatsApp(state, courierId, `Picked up your ${job.label} trace from CIB and dropped the file in your folder.`);
            if (window.KLB.Audio?.playSfx) window.KLB.Audio.playSfx('success');
            advanceSubTaskOrFinishStep(job.stepIdx, targetSubIdx, true);
            showAlertBanner(`${courierName} collected your CIB data remotely (-1 Favour, 0m)!`, 3800, false);
            openSpectrumPreviewModal(figItem, true, moraleDelta);
          }
          syncAllHUD(true);
          return;
        }

        if (curStepNow && curSubNow && (curSubNow.roomId === 'cib_lg11_ms' || curSubNow.roomId === 'cib_lg1b_nmr')) {
          const cibRm = window.KLB.WORLD_MAPS?.rooms?.[curSubNow.roomId];
          const stationObj = cibRm?.objects?.find(o => Array.isArray(curSubNow.stationTypes) && curSubNow.stationTypes.includes(o.type))
            || { id: 'cib_remote', type: curSubNow.stationTypes?.[0] || 'nmr_magnet', x: 7, y: 8 };
          prepareSubTaskExecution(curStepNow, curSubNow, stationObj, () => {
            if ((Number(state.favours) || 0) < 1) return;
            addFavours(-1);
            if (curSubNow.mode === 'wait') {
              const snap = calcStepMetrics(curStepNow, { stationType: stationObj.type });
              const job = {
                id: 'job_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
                kind: 'instrument',
                stepIdx: state.campaignStepIdx,
                subTaskIdx: state.campaignSubTaskIdx,
                subTaskId: curSubNow.id,
                label: curSubNow.label,
                shortLabel: curSubNow.label,
                title: curSubNow.label,
                roomId: curSubNow.roomId,
                objId: stationObj.id,
                stationType: stationObj.type,
                x: stationObj.x,
                y: stationObj.y,
                elapsedMins: 0,
                targetMins: Math.max(2, Math.round(curSubNow.durationMins || 14)),
                sweetSpotMins: curSubNow.sweetSpotMins || 225,
                canOvercook: Boolean(curSubNow.canOvercook),
                isCold4C: false,
                prepScore: snap.quality,
                yieldScore: snap.yieldPct,
                blueDyeMishap: snap.blueDyeMishap,
                outcomeText: snap.outcomeText,
                status: 'running',
                viewOutput: curSubNow.viewOutput || null
              };
              state.activeStationJobs.push(job);
              state.activeReactions = state.activeStationJobs;
              playStationSfx(stationObj.type);
              window.KLB.Sim.pushWhatsApp(state, courierId, `Submitted your sample for "${curSubNow.label}" in ${window.KLB.ROOM_META?.[curSubNow.roomId]?.shortName || 'CIB'}!`);
              showAlertBanner(`${courierName} queued "${curSubNow.label}" in CIB remotely (-1 Favour, 0m)!`, 3800, false);
            } else {
              if (curSubNow.viewOutput) {
                const m = calcStepMetrics(curStepNow, { stationType: stationObj.type });
                state.curStepPerf = m;
                const figItem = createLabBookFigure(curStepNow, state.campaignStepIdx, m.quality, m.yieldPct, m.blueDyeMishap, m.outcomeText, curSubNow.viewOutput);
                state.labBook.push(figItem);
                const moraleDelta = window.KLB.Sim.applyExperimentOutcomeToMorale(state, m.quality, m.yieldPct);
                advanceSubTaskOrFinishStep(state.campaignStepIdx, state.campaignSubTaskIdx, true);
                openSpectrumPreviewModal(figItem, true, moraleDelta);
              } else {
                advanceSubTaskOrFinishStep(state.campaignStepIdx, state.campaignSubTaskIdx, false);
              }
              window.KLB.Sim.pushWhatsApp(state, courierId, `Handled "${curSubNow.label}" in CIB for you.`);
              showAlertBanner(`${courierName} completed "${curSubNow.label}" remotely (-1 Favour, 0m)!`, 3800, false);
            }
            syncAllHUD(true);
          });
        }
      };
    }

    box.querySelectorAll('[data-errand]').forEach(btn => {
      btn.onclick = () => {
        const er = errands.find(e => e.id === btn.dataset.errand);
        if (state.fireAlarm?.active && er?.targetRoom === 'klb_2f') {
          showAlertBanner("Fire alarm still active in KLB! Wait at Gordon's Café until all-clear.", 3200, true);
          return;
        }
        const isNmrOrMsDest = Boolean(er && (er.targetRoom === 'cib_lg1b_nmr' || er.targetRoom === 'cib_lg11_ms'));
        const askSamples = Boolean(isNmrOrMsDest && canAskSamples && el('chk-ask-samples')?.checked);
        closeModal();
        setPaused(false);
        if (er && er.targetRoom) {
          navigateToRoom(er.targetRoom, null, { askSamples, fromRoom: curRoom });
        }
      };
    });

    if (el('btn-head-home-night')) {
      el('btn-head-home-night').onclick = () => {
        closeModal();
        setPaused(false);
        endCurrentDay(false);
      };
    }

    if (el('btn-bloom-next-week')) {
      el('btn-bloom-next-week').onclick = () => {
        closeModal();
        setPaused(false);
        startNextWeek();
      };
    }
  }

  function navigateToRoom(targetRoom, spawnOverride = null, navOpts = null) {
    if (!state || !window.KLB.ROOM_META?.[targetRoom]) return;
    if (!state.spectatorMode) {
      if (targetRoom === 'cib_lg11_ms' && !state.prep.knows_1965) {
        promptDoorKeypad('cib_lg11_ms', '1965', spawnOverride, navOpts);
        return;
      }
      if (targetRoom === 'cib_lg1b_nmr' && !state.prep.knows_2145) {
        promptDoorKeypad('cib_lg1b_nmr', '2145', spawnOverride, navOpts);
        return;
      }
    }
    transitionToRoom(targetRoom, spawnOverride, navOpts);
  }

  function promptDoorKeypad(targetRoom, code, spawnOverride = null, navOpts = null) {
    setPaused(true);
    modalDismissable = true;
    modalEscapeHandler = () => { closeModal(); setPaused(false); };
    const sup = getSupervisorMeta();
    const roomTitle = window.KLB.ROOM_META[targetRoom].shortName;
    const box = prepareModalBox('klb-modal-sm', 'modal_open');
    box.innerHTML = `
      <header class="klb-modal-header">
        <div>
          <h3 style="display:flex;align-items:center;gap:8px;">
            ${icon('lock', 16)}
            <span>CIB Keypad — ${escHtml(roomTitle)}</span>
          </h3>
          <p class="mono-muted" style="margin-top:3px;">Enter the 4-digit CIB door code or ask ${escHtml(sup.chatName)} on WhatsApp</p>
        </div>
        <button id="btn-keypad-cancel" class="hud-btn" aria-label="Close">${icon('x', 14)}</button>
      </header>
      <div class="klb-modal-body">
        <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;">
          <input id="keypad-input" class="klb-input" type="text" inputmode="numeric" maxlength="4" placeholder="Code" />
          <button id="btn-keypad-go" type="button" class="rpg-btn primary">Unlock</button>
          <button id="btn-keypad-ask" type="button" class="rpg-btn">${icon('message-square', 13)}<span>Ask WhatsApp (-10m)</span></button>
        </div>
        <div id="keypad-msg" class="klb-hint-box hidden"></div>
      </div>
    `;
    el('modal-backdrop').classList.remove('hidden');
    el('btn-keypad-cancel').onclick = modalEscapeHandler;
    el('btn-keypad-ask').onclick = () => {
      const askBtn = el('btn-keypad-ask');
      if (askBtn?.disabled) return;
      if (askBtn) askBtn.disabled = true;
      const startDayIdx = state.dayIdx;
      window.KLB.Sim.spendWhatsAppMinutes(state, 10, simCallbacks());
      if (!state || state.dayIdx !== startDayIdx || state.fridayFinalAuditDone || state.gameOver) {
        if (state && !state.gameOver && !state.fridayFinalAuditDone && state.dayIdx !== startDayIdx) closeModal();
        return;
      }
      const senderId = state.player.id === 'marcos_fernandez' ? 'daniel_richards' : 'marcos_fernandez';
      const senderName = window.KLB.CAST_BY_ID?.[senderId]?.shortName || 'Marcos';
      window.KLB.Sim.pushWhatsApp(state, state.player.id, `Code for ${roomTitle}? Standing at the keypad.`);
      window.KLB.Sim.pushWhatsApp(state, senderId, `Code is ${code} — do not prop the door open.`);
      const inp = el('keypad-input');
      if (inp) inp.value = code;
      const msg = el('keypad-msg');
      if (msg) {
        msg.classList.remove('hidden', 'warn');
        msg.textContent = `${senderName} replied: ${code} (-10m elapsed)`;
      }
      syncAllHUD(true);
    };
    const submitUnlock = () => {
      if (el('keypad-input').value.trim() === code) {
        if (targetRoom === 'cib_lg11_ms') state.prep.knows_1965 = true;
        if (targetRoom === 'cib_lg1b_nmr') state.prep.knows_2145 = true;
        if (window.KLB.Audio?.playSfx) window.KLB.Audio.playSfx('door_buzz');
        closeModal();
        setPaused(false);
        transitionToRoom(targetRoom, spawnOverride, navOpts);
      } else {
        const msg = el('keypad-msg');
        if (msg) {
          msg.classList.remove('hidden');
          msg.classList.add('warn');
          msg.textContent = `Invalid code — ask ${sup.chatName} for the 4-digit code.`;
        }
        if (window.KLB.Audio) window.KLB.Audio.playSfx('error');
      }
    };
    el('btn-keypad-go').onclick = submitUnlock;
    el('keypad-input').onkeydown = ev => {
      if (ev.key === 'Enter') {
        ev.preventDefault();
        submitUnlock();
      }
    };
    el('keypad-input').focus();
  }

  function openRandomEventChoiceModal(ev) {
    setPaused(true);
    modalDismissable = false;
    modalEscapeHandler = null;
    if (state) {
      state._pendingChoiceEventId = ev.id || null;
      saveActiveRunSnapshot(true);
    }

    const actorId = ev.actorId || ev.whatsappSender || '';
    const catMap = {
      crisis: { cls: 'crisis', label: 'Lab Crisis', icon: 'flame' },
      inspection: { cls: 'inspection', label: 'Inspection', icon: 'shield-check' },
      social: { cls: 'social', label: 'Social Event', icon: 'users' },
      weather: { cls: 'weather', label: 'Weather Alert', icon: ev.id === 'may_heatwave' ? 'thermometer' : 'snowflake' },
      facility: { cls: 'facility', label: 'Facility Alert', icon: 'wrench' }
    };
    const cat = catMap[ev.category] || { cls: '', label: 'KLB Event', icon: 'alert-triangle' };
    const box = prepareModalBox('ev-modal', 'modal_open', cat.cls ? `ev-theme-${cat.cls}` : '');
    const portraitHtml = actorId
      ? `<img class="ev-modal-portrait pixel-art" src="assets/portraits/${escHtml(actorId)}.png" alt="" onerror="this.style.display='none'" />`
      : '';
    const choices = ev.choices || [];

    const isAntoineCroissant = Boolean(ev.id === 'sliced_croissant_crime' && state.player.id === 'antoine_maruani');
    const croissantWarnHtml = isAntoineCroissant
      ? `<p style="margin-top:6px;font-size:12px;color:#fca5a5;"><strong>#French&amp;Proud Flaw:</strong> Witnessing a horizontally sliced croissant inflicts -15 Morale shock on Antoine.</p>`
      : '';

    box.innerHTML = `
      <div class="ev-modal-header">
        ${portraitHtml}
        <div class="ev-modal-head-body">
          <span class="ev-modal-cat ${escHtml(cat.cls)}">${icon(cat.icon, 11)}<span>${escHtml(cat.label)}</span></span>
          <h3 class="ev-modal-title">${escHtml(ev.title || 'KLB Event')}</h3>
          <p class="ev-modal-desc">${escHtml(ev.bannerText || ev.whatsappMsg || '')}</p>
          ${croissantWarnHtml}
        </div>
      </div>
      <div id="ev-choices" class="ev-choices-list"></div>
      <div class="ev-modal-footer">
        <span>Press 1–${choices.length} or click an option</span>
        <span class="modal-footer-pill">${icon('sparkles', 11)}<span>Available Favours: ${Number(state.favours) || 0}</span></span>
      </div>
    `;
    el('modal-backdrop').classList.remove('hidden');

    const wrap = el('ev-choices');
    const deltaSpecs = [
      ['moraleDelta', 'Morale', 'smile'],
      ['safetyDelta', 'Lab Condition', 'sparkles'],
      ['energyDelta', 'Energy', 'zap'],
      ['socialDelta', 'Social', 'users'],
      ['patienceDelta', 'Patience', 'gauge'],
      ['favourDelta', 'Favour', 'award']
    ];

    choices.forEach((ch, idx) => {
      const cost = Number(ch.favourCost) || 0;
      const timeCost = Math.max(0, Number(ch.timeCostMins) || 0);
      const cantAfford = cost > 0 && (Number(state.favours) || 0) < cost;
      const cleanLabel = cost > 0
        ? String(ch.label || '').replace(/\s*\(\d+\s*Favours?\)\s*$/i, '').trim()
        : String(ch.label || '');

      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'ev-choice-card';
      b.dataset.hotkey = String(idx + 1);
      if (cantAfford) {
        b.disabled = true;
        b.title = `Requires ${cost} Favour${cost === 1 ? '' : 's'} (${Number(state.favours) || 0} available)`;
      }

      const timeHtml = timeCost > 0
        ? `<span class="ev-choice-time">${icon('clock', 10)}<span>${timeCost}m</span></span>`
        : '';
      const costHtml = cost > 0
        ? `<span class="ev-choice-cost${cantAfford ? ' short' : ''}">${icon('sparkles', 10)}<span>${cantAfford ? `Needs ${cost} Favour${cost === 1 ? '' : 's'}` : `-${cost} Favour${cost === 1 ? '' : 's'}`}</span></span>`
        : '';

      const deltaEntries = [];
      deltaSpecs.forEach(([key, label, iconName]) => {
        let val = Number(ch[key]) || 0;
        if (key === 'safetyDelta' && val < 0 && state.mutators?.strict_coshh) {
          val = Math.round(val * 1.5);
        }
        if (val) deltaEntries.push({ val, label, iconName });
      });
      deltaEntries.sort((a, bItem) => (bItem.val > 0 ? 1 : 0) - (a.val > 0 ? 1 : 0));
      const deltasHtml = deltaEntries.map(({ val, label, iconName }) => {
        const cls = val > 0 ? 'pos' : 'neg';
        const sign = val > 0 ? '+' : '';
        return `<span class="ev-delta-pill ${cls}">${icon(iconName, 10)}<span>${sign}${val} ${escHtml(label)}</span></span>`;
      }).join('');

      b.innerHTML = `
        <div class="ev-choice-top">
          <div class="ev-choice-left">
            <span class="ev-choice-key">${idx + 1}</span>
            <span class="ev-choice-label">${escHtml(cleanLabel)}</span>
          </div>
          <span class="ev-choice-right">
            ${timeHtml}${costHtml}<span class="ev-choice-chevron">${icon('chevron-right', 14)}</span>
          </span>
        </div>
        ${deltasHtml ? `<div class="ev-choice-deltas">${deltasHtml}</div>` : ''}
      `;

      b.onclick = () => {
        if (cost > 0 && (Number(state.favours) || 0) < cost) return;
        const startDayIdx = state.dayIdx;
        state._pendingChoiceEventId = null;
        closeModal();
        setPaused(false);
        if (cost > 0) {
          addFavours(-cost);
        }
        const mDelta = (ch.moraleDelta || 0) < 0 && state.player.id === 'calise_bahou' ? Math.round(ch.moraleDelta * 0.5) : (ch.moraleDelta || 0);
        const sDelta = (ch.safetyDelta || 0) < 0 && state.mutators?.strict_coshh ? Math.round(ch.safetyDelta * 1.5) : (ch.safetyDelta || 0);
        state.morale = clamp(state.morale + mDelta, 0, 100);
        window.KLB.Sim.setLabCondition(state, window.KLB.Sim.getLabCondition(state) + sDelta);
        state.energy = clamp(state.energy + (ch.energyDelta || 0), 0, 100);
        state.social = clamp((state.social ?? 84) + (ch.socialDelta || 0), 0, 100);
        state.patience = clamp(state.patience + (ch.patienceDelta || 0), 0, 100);
        addFavours(ch.favourDelta || 0);
        if (ch.clearsLcmsBroken) state.lcmsBroken = false;
        if (ch.setsAbilFine) state.abilFineOwed = true;
        if (ch.setsPrep && typeof ch.setsPrep === 'object') {
          state.prep = state.prep || {};
          Object.assign(state.prep, ch.setsPrep);
        }
        if (Array.isArray(ch.clearsPrep)) {
          state.prep = state.prep || {};
          ch.clearsPrep.forEach(k => { state.prep[k] = false; });
        } else if (ch.clearsPrep && typeof ch.clearsPrep === 'object') {
          state.prep = state.prep || {};
          Object.keys(ch.clearsPrep).forEach(k => { if (ch.clearsPrep[k]) state.prep[k] = false; });
        }
        if (ch.setsLotrPlaying) {
          state.lotrPlaying = true;
          syncAudioAmbience();
        }
        let antoineCroissantShock = false;
        if (ev.id === 'sliced_croissant_crime' && state.player.id === 'antoine_maruani') {
          state.morale = clamp(state.morale - 15, 0, 100);
          antoineCroissantShock = true;
        }

        if (timeCost > 0) {
          window.KLB.Sim.spendWhatsAppMinutes(state, timeCost, simCallbacks());
          if (!state || state.dayIdx !== startDayIdx || state.gameOver || state.victory || state.fridayFinalAuditDone || state.postAuditCelebration) return;
        }

        if (ch.triggersMinigame === 'lemons' && window.KLB.Minigames) {
          openMinigameOverlay('lemons', ev.title || 'Citrus Cleanup', 'Rolling Citrus Cleanup', res => {
            if (!state) return;
            const sc = Number(res?.score) || 0;
            if (!res?.aborted && sc >= 60) {
              state.morale = clamp(state.morale + 5, 0, 100);
              window.KLB.Sim.setLabCondition(state, window.KLB.Sim.getLabCondition(state) + 6);
              showAlertBanner(`Collected the rolling Calise lemons (${sc}%) — +5 Morale, +6 Lab Condition!`, 4000, false);
            } else {
              window.KLB.Sim.setLabCondition(state, window.KLB.Sim.getLabCondition(state) - 4);
              showAlertBanner('Lemons rolled under the Biotage bench (-4 Lab Condition).', 3600, true);
            }
            window.KLB.Sim.checkPermadeath(state, simCallbacks());
            syncAllHUD(true);
          });
          return;
        }

        if (antoineCroissantShock) {
          const baseTxt = ch.resultText ? `${ch.resultText} ` : '';
          showAlertBanner(`${baseTxt}Mon Dieu! #French&Proud sliced croissant shock (-15 Morale).`, 4800, true);
        } else if (ch.resultText) {
          showAlertBanner(ch.resultText, 4000, mDelta < 0 || sDelta < 0);
        }
        window.KLB.Sim.checkPermadeath(state, simCallbacks());
        syncAllHUD(true);
      };
      wrap.appendChild(b);
    });
  }

  // ==================== 7. SLIDE BUILDER, FRIDAY AUDIT & GORDON'S FINALE ====================
  function openSlideBuilderOverlay() {
    if (!window.KLB.SlideBuilder) return;
    const wasAlreadyPaused = Boolean(state && (state.paused || state.isPaused));
    const restorePause = wasAlreadyPaused || Boolean(state?._dlgUnpauseOnClose);
    setPaused(true);
    modalDismissable = true;
    const finishSlideOverlay = () => {
      closeModal();
      const shouldReopenWelcome = Boolean(
        state &&
        !state.spectatorMode &&
        state.dayIdx === 4 &&
        !state.fridayAuditDone &&
        state.player?.roomId === 'meeting_room' &&
        state.timeMins >= 9 * 60 &&
        state.timeMins <= 585
      );
      if (shouldReopenWelcome) {
        triggerFridayMorningWelcome();
      } else {
        setPaused(restorePause);
      }
      syncAllHUD(true);
    };
    modalEscapeHandler = finishSlideOverlay;
    const box = prepareModalBox('klb-modal', 'slide_click');
    box.innerHTML = `<div id="slide-builder-mount"></div>`;
    el('modal-backdrop').classList.remove('hidden');
    window.KLB.SlideBuilder.openDeckModal(el('slide-builder-mount'), state, savedDeck => {
      if (savedDeck) {
        state.slideDeck = Object.assign({}, savedDeck, { ready: true });
        if (window.KLB.Audio?.playSfx) window.KLB.Audio.playSfx('slide_click');
        showAlertBanner('Saved 4-Slide Group Meeting Deck.', 3500, false);
      }
      finishSlideOverlay();
    });
  }

  function triggerFridayMorningWelcome() {
    if (!state || state.spectatorMode || state.dayIdx !== 4 || state.fridayAuditDone) return;
    cancelActivePlayerAction(true);
    if (!el('modal-backdrop').classList.contains('hidden')) {
      window.KLB.Minigames?.abortActive?.();
      closeModal();
    }
    setPaused(true);
    const sup = getSupervisorMeta();
    showAlertBanner('FRI 09:00 — Group Meeting starting in the Seminar Room!', 4500, false);
    showDialogue(
      sup.id,
      `${sup.fullName} — Friday 09:00 Group Meeting`,
      `Morning ${window.KLB.CAST_BY_ID[state.player.id]?.shortName || 'team'} — 09:00 Group Meeting is starting. Review your 4-slide deck or present at the projector now (then finish your Friday bench work & Manuscript Draft by 18:00).`,
      [
        {
          label: '[1] Review 4-Slide Deck',
          onClick: () => {
            closeDialogue({ skipUnpause: true });
            openSlideBuilderOverlay();
          }
        },
        {
          label: `[2] Start Group Meeting with ${sup.shortName}`,
          primary: true,
          onClick: () => {
            closeDialogue({ skipUnpause: true });
            runSoloVijayAuditModal({ isWeekWrap: false });
          }
        }
      ],
      false,
      '',
      { unpauseOnClose: true }
    );
  }

  function openFridayAuditTrigger() {
    const sup = getSupervisorMeta();
    if (state.dayIdx < 4) {
      showDialogue(
        sup.id,
        'Group Meeting Seminar Room',
        'Friday Group Meeting starts Friday morning at 09:00. Build your 4-slide deck at any desk.',
        [
          { label: '[1] Return to Lab', primary: true, onClick: closeDialogue },
          { label: '[2] Open 4-Slide Deck Builder', onClick: () => { closeDialogue(); openSlideBuilderOverlay(); } }
        ]
      );
      return;
    }

    const canWrapWeek = !state.fridayFinalAuditDone && (
      state.timeMins >= 16 * 60 ||
      ((state.manuscriptProgress || 0) >= 100 && (state.completedSteps || []).length >= 5)
    );

    if (state.fridayAuditDone && state.lastAuditResult) {
      const actions = [
        { label: '[1] Back to Work', primary: !canWrapWeek, onClick: closeDialogue }
      ];
      if (canWrapWeek) {
        actions.push({
          label: '[2] Run Final Friday Audit & Wrap Week',
          primary: true,
          onClick: () => {
            closeDialogue();
            endCurrentDay(false);
          }
        });
      }
      showDialogue(
        sup.id,
        'Group Meeting Seminar Room',
        canWrapWeek
          ? 'Morning Group Meeting wrapped! You can return to KLB or run your Final Friday Audit and wrap the week now.'
          : 'Morning Group Meeting wrapped! Finish remaining Friday tasks & Manuscript Draft (due 18:00).',
        actions,
        !canWrapWeek,
        `Audit Score: ${state.lastAuditResult.total.toFixed(1)}/10`
      );
      return;
    }

    if (state.timeMins > 585 && !state.fridayAuditDone) {
      const missedActions = [
        { label: '[1] Return to Lab', primary: !canWrapWeek, onClick: closeDialogue },
        canWrapWeek
          ? { label: '[2] Run Final Friday Audit & Wrap Week', primary: true, onClick: () => { closeDialogue(); endCurrentDay(false); } }
          : { label: '[2] Open 4-Slide Deck Builder', onClick: () => { closeDialogue(); openSlideBuilderOverlay(); } }
      ];
      showDialogue(
        sup.id,
        'Group Meeting Seminar Room',
        'The 09:00 Friday Group Meeting has already wrapped for the morning and colleagues are back in KLB. Finish your remaining bench work, 4-slide deck, and Manuscript Draft ahead of the 18:00 Final Audit.',
        missedActions,
        false,
        'Missed 09:00 Group Meeting'
      );
      return;
    }

    runSoloVijayAuditModal({ isWeekWrap: false });
  }

  function runSoloVijayAuditModal(opts = {}) {
    const isWeekWrap = Boolean(opts && opts.isWeekWrap);
    setPaused(true);
    modalDismissable = false;
    modalEscapeHandler = null;

    const phase = isWeekWrap ? 'final' : 'morning';
    const res = window.KLB.SlideBuilder.evaluateFridayAudit(state, { phase });

    if (window.KLB.Audio?.playSfx) {
      window.KLB.Audio.playSfx(res.passed ? 'audit_pass' : 'audit_fail');
    }

    const continueMidFriday = !isWeekWrap && state.timeMins < 18 * 60;
    const pDelta = window.KLB.Sim.applyFridayAuditPatience(
      state,
      res,
      isWeekWrap ? { prevAuditResult: state.morningAuditResult } : undefined
    );
    state.fridayAuditDone = true;
    if (!isWeekWrap) {
      state.fridayMorningPresented = true;
      state.morningAuditResult = res;
    } else {
      state.fridayFinalAuditDone = true;
      clearActiveRunSnapshot();
    }
    state.lastAuditResult = res;

    if (res.passed && !continueMidFriday && (Number(state.patience) || 0) > 0) {
      archive = reconcileArchiveSafe(a => {
        a.clearedChars = a.clearedChars || {};
        const prev = a.clearedChars[state.player.id] || 0;
        a.clearedChars[state.player.id] = Math.max(prev, res.total);
        a.bestScore = Math.max(a.bestScore || 0, res.total);
      });
    }

    (res.chudReactions || []).forEach(r => window.KLB.Sim.pushWhatsApp(state, r.senderId, r.text));

    const b = res.breakdown || {};
    const reasons = res.breakdownReasons || {};
    const scoreCol = res.passed ? '#4ade80' : '#f87171';
    const deltaStr = pDelta >= 0 ? `+${pDelta}` : `${pDelta}`;
    const deltaCol = pDelta >= 0 ? '#86efac' : '#fca5a5';
    const avgQ = Math.round(res.avgQuality || 0);
    const avgY = Math.round(res.avgYield || 0);

    const auditMetrics = [
      { key: 'yieldScore', title: 'Yield & Steps', max: 2.0 },
      { key: 'homogeneityScore', title: 'Homogeneity', max: 2.0 },
      { key: 'rigorScore', title: 'Analytical Rigour', max: 2.0 },
      { key: 'manuscriptScore', title: 'Manuscript & Report', max: 1.5 },
      { key: 'hygieneScore', title: 'Slide Hygiene', max: 1.5 },
      { key: 'citizenshipScore', title: 'Citizenship', max: 1.0 }
    ];

    const metricsHtml = auditMetrics.map(m => {
      const val = Number(b[m.key] ?? 0);
      const pct = clamp(Math.round((val / m.max) * 100), 0, 100);
      const fillCls = pct >= 70 ? 'good' : pct >= 45 ? 'warn' : 'danger';
      const reason = reasons[m.key] || '';
      return `
        <div class="audit-metric-card" title="${escHtml(reason)}">
          <div class="mono-muted">${escHtml(m.title)}</div>
          <div style="font-size:15px;color:#93c5fd;font-family:monospace;margin-top:3px;">${val.toFixed(1)} / ${m.max.toFixed(1)}</div>
          <div class="audit-bar-track"><div class="audit-bar-fill ${fillCls}" style="width:${pct}%"></div></div>
          ${reason ? `<div class="mono-muted" style="font-size:10.5px;margin-top:5px;line-height:1.3;color:#cbd5e1;">${escHtml(reason)}</div>` : ''}
        </div>
      `;
    }).join('');

    const footerHtml = continueMidFriday
      ? `<button id="btn-audit-back-klb" class="rpg-btn primary" data-hotkey="1">[1] Return to KLB (Finish Friday Bench &amp; Manuscript)</button>`
      : (res.passed
          ? `<button id="btn-audit-gordons" class="rpg-btn primary" data-hotkey="1" style="background:#15803d;border-color:#4ade80;">[1] Celebrate at Gordon's Café (Week Complete)</button>`
          : `<button id="btn-audit-week-wrap" class="rpg-btn primary" data-hotkey="1">[1] Continue to Week Wrap</button>`);

    const sup = getSupervisorMeta();
    const verdictLines = Array.isArray(res.verdictLines)
      ? res.verdictLines
      : (Array.isArray(res.vijayVerdictLines) ? res.vijayVerdictLines : []);
    const box = prepareModalBox('klb-modal', null);
    box.innerHTML = `
      <header class="klb-modal-header" style="align-items:center;">
        <img class="pixel-art" src="${escHtml(sup.portrait)}" style="width:76px;height:76px;border-radius:8px;border:1px solid var(--border-medium);" />
        <div style="flex:1;">
          <p class="mono-muted" style="color:#93c5fd;">${isWeekWrap ? 'Friday 18:00 Final Week Audit' : 'Friday 09:00 Group Meeting Audit'}</p>
          <h3 style="margin:2px 0;font-size:19px;">${escHtml(sup.fullName)} Score-Card</h3>
          <p style="font-size:12.5px;color:#cbd5e1;">${escHtml(window.KLB.getCampaign(state.player.id)?.title || '')}</p>
          <p class="mono-muted" style="margin-top:4px;">
            Avg Quality: <span style="color:#f8fafc;">${avgQ}%</span> | Avg Yield: <span style="color:#f8fafc;">${avgY}%</span> | ${escHtml(sup.patienceLabel)}: <span style="color:${deltaCol};">${deltaStr}</span>
          </p>
        </div>
        <div class="audit-score-card ${res.passed ? 'good' : 'poor'}">
          <div style="font-size:24px;font-family:monospace;color:${scoreCol};">${res.total.toFixed(1)}<span style="font-size:14px;color:#94a3b8;">/10</span></div>
          <div style="font-size:11px;color:${scoreCol};font-weight:600;">${res.passed ? 'PASSED' : 'SUBOPTIMAL'}</div>
        </div>
      </header>

      <div class="klb-modal-body">
        <div class="audit-grid">${metricsHtml}</div>

        <section class="audit-verdict-box">
          ${verdictLines.map(l => `<p style="margin-bottom:5px;">"${escHtml(l)}"</p>`).join('')}
        </section>
      </div>

      <footer class="klb-modal-footer">
        <button id="btn-audit-copy-card" type="button" class="share-card-btn">${icon('copy', 13)}<span>Copy Score-Card</span></button>
        <div>${footerHtml}</div>
      </footer>
    `;
    el('modal-backdrop').classList.remove('hidden');

    if (el('btn-audit-copy-card')) {
      el('btn-audit-copy-card').onclick = ev => {
        copyTextToClipboard(buildShareableScoreCard(state, res), ev.currentTarget);
      };
    }

    if (el('btn-audit-back-klb')) {
      el('btn-audit-back-klb').onclick = () => {
        closeModal();
        setPaused(false);
        transitionToRoom('klb_2f', window.KLB.ROOM_META.klb_2f.entrySpawn);
        state.player.specsOn = true;
        showAlertBanner('Meeting wrapped! Back to KLB to finish your remaining bench work & Manuscript Draft before 18:00.', 4800, false);
        window.KLB.Sim.checkPermadeath(state, simCallbacks());
        syncAllHUD(true);
      };
    }
    if (el('btn-audit-gordons')) {
      el('btn-audit-gordons').onclick = () => {
        closeModal();
        setPaused(false);
        window.KLB.Sim.checkPermadeath(state, simCallbacks());
        if (state.gameOver) return;
        launchGordonsVictoryScene(res);
      };
    }
    if (el('btn-audit-week-wrap')) {
      el('btn-audit-week-wrap').onclick = () => {
        closeModal();
        setPaused(false);
        window.KLB.Sim.checkPermadeath(state, simCallbacks());
        if (state.gameOver) return;
        launchGordonsVictoryScene(res);
      };
    }

    syncAllHUD(true);
  }

  function openAuditScoreCardReviewModal(res) {
    if (!state || !res) return;
    setPaused(true);
    modalDismissable = true;
    modalEscapeHandler = () => { closeModal(); setPaused(false); };

    const b = res.breakdown || {};
    const reasons = res.breakdownReasons || {};
    const scoreCol = res.passed ? '#4ade80' : '#f87171';
    const avgQ = Math.round(res.avgQuality || 0);
    const avgY = Math.round(res.avgYield || 0);
    const auditMetrics = [
      { key: 'yieldScore', title: 'Yield & Steps', max: 2.0 },
      { key: 'homogeneityScore', title: 'Homogeneity', max: 2.0 },
      { key: 'rigorScore', title: 'Analytical Rigour', max: 2.0 },
      { key: 'manuscriptScore', title: 'Manuscript & Report', max: 1.5 },
      { key: 'hygieneScore', title: 'Slide Hygiene', max: 1.5 },
      { key: 'citizenshipScore', title: 'Citizenship', max: 1.0 }
    ];
    const metricsHtml = auditMetrics.map(m => {
      const val = Number(b[m.key] ?? 0);
      const pct = clamp(Math.round((val / m.max) * 100), 0, 100);
      const fillCls = pct >= 70 ? 'good' : pct >= 45 ? 'warn' : 'danger';
      const reason = reasons[m.key] || '';
      return `
        <div class="audit-metric-card" title="${escHtml(reason)}">
          <div class="mono-muted">${escHtml(m.title)}</div>
          <div style="font-size:15px;color:#93c5fd;font-family:monospace;margin-top:3px;">${val.toFixed(1)} / ${m.max.toFixed(1)}</div>
          <div class="audit-bar-track"><div class="audit-bar-fill ${fillCls}" style="width:${pct}%"></div></div>
          ${reason ? `<div class="mono-muted" style="font-size:10.5px;margin-top:5px;line-height:1.3;color:#cbd5e1;">${escHtml(reason)}</div>` : ''}
        </div>
      `;
    }).join('');

    const sup = getSupervisorMeta();
    const verdictLines = Array.isArray(res.verdictLines)
      ? res.verdictLines
      : (Array.isArray(res.vijayVerdictLines) ? res.vijayVerdictLines : []);
    const box = prepareModalBox('klb-modal', 'ui_click');
    box.innerHTML = `
      <header class="klb-modal-header" style="align-items:center;">
        <img class="pixel-art" src="${escHtml(sup.portrait)}" style="width:72px;height:72px;border-radius:8px;border:1px solid var(--border-medium);" />
        <div style="flex:1;">
          <p class="mono-muted" style="color:#93c5fd;">Week ${state.weekNum || 1} Friday Audit Review</p>
          <h3 style="margin:2px 0;font-size:19px;">${escHtml(sup.fullName)} Score-Card</h3>
          <p class="mono-muted" style="margin-top:4px;">Avg Quality: <span style="color:#f8fafc;">${avgQ}%</span> | Avg Yield: <span style="color:#f8fafc;">${avgY}%</span></p>
        </div>
        <div class="audit-score-card ${res.passed ? 'good' : 'poor'}">
          <div style="font-size:24px;font-family:monospace;color:${scoreCol};">${res.total.toFixed(1)}<span style="font-size:14px;color:#94a3b8;">/10</span></div>
          <div style="font-size:11px;color:${scoreCol};font-weight:600;">${res.passed ? 'PASSED' : 'SUBOPTIMAL'}</div>
        </div>
      </header>
      <div class="klb-modal-body">
        <div class="audit-grid">${metricsHtml}</div>
        <section class="audit-verdict-box">
          ${verdictLines.map(l => `<p style="margin-bottom:5px;">"${escHtml(l)}"</p>`).join('')}
        </section>
      </div>
      <footer class="klb-modal-footer">
        <button id="btn-review-copy-card" type="button" class="share-card-btn">${icon('copy', 13)}<span>Copy Score-Card</span></button>
        <div style="display:flex;gap:8px;flex-wrap:wrap;">
          <button id="btn-review-back" type="button" class="rpg-btn" data-hotkey="1">[1] Back to Gordon's</button>
          <button id="btn-review-next-week" type="button" class="rpg-btn primary" data-hotkey="2">[2] Start Week ${(state.weekNum || 1) + 1}</button>
        </div>
      </footer>
    `;
    el('modal-backdrop').classList.remove('hidden');
    el('btn-review-copy-card').onclick = ev => copyTextToClipboard(buildShareableScoreCard(state, res), ev.currentTarget);
    el('btn-review-back').onclick = modalEscapeHandler;
    el('btn-review-next-week').onclick = () => {
      closeModal();
      setPaused(false);
      startNextWeek();
    };
  }

  function startNextWeek() {
    state.postAuditCelebration = false;
    state.weekNum += 1;
    state.dayIdx = 0;
    state._trackedWeekNum = state.weekNum;
    state._trackedDayIdx = state.dayIdx;
    state.timeMins = Math.round((window.KLB.CAST_BY_ID[state.player.id].arriveHour || 9) * 60);
    state.runSeed = ((Date.now() ^ Math.floor(Math.random() * 0xffffffff)) >>> 0) || 1;
    state.campaignStepIdx = 0;
    state.campaignSubTaskIdx = 0;
    state.completedSteps = [];
    state.completedSubTasks = [];
    state.curStepChoiceResult = null;
    state.curStepPerf = null;
    state.activeMinigameScore = null;
    state.activeStationJobs = [];
    state.activeReactions = state.activeStationJobs;
    state.activePlayerAction = null;
    state.labBook = [];
    state.weeklyReportProgress = 0;
    state.weeklyReportChecked = false;
    state.manuscriptProgress = 0;
    state.manuscriptChecked = false;
    state.slideDeck = { ready: false, framing: 'mechanistic', fig1Id: null, fig2Id: null, honestDisclosure: true };
    state.fridayAuditDone = false;
    state.fridayMorningPresented = false;
    state.morningAuditResult = null;
    state.fridayFinalAuditDone = false;
    state.abilFineOwed = false;
    state.lastAuditResult = null;
    state.hadLunchToday = false;
    state._salveToday = false;
    state._speakersMoraleToday = false;
    state._tcepFavourToday = false;
    state._lastWaAskTotalMins = null;
    state._pendingChoiceEventId = null;
    state._alexEncounteredToday = false;
    state._alexToday = false;
    state._pollToday = false;
    state._sweepToday = false;
    state._fireAlarmToday = false;
    state._coffeePingToday = false;
    state._quartetWaToday = false;
    state._eveningToastToday = false;
    state._lcmsHazardToday = false;
    state.aoe2UsedToday = false;
    state.coffeeUsedToday = false;
    state._prevAoe2UsedToday = false;
    state._seenEventsThisWeek = {};
    state._weeklySigDone = {};
    state._lastWeeklySigMins = -999;
    state._lastWeeklySigDay = -1;
    state._suppressWeatherRoll = false;
    state.speechBubbles = [];
    state._queuedBubbles = [];
    state._queuedWaReplies = [];
    state._proofreadReportUsed = false;
    state._proofreadMsUsed = false;
    state._benchTcepTriedSteps = {};
    state._lastCoffeeBreakMins = null;
    state._lastTeaBreakMins = null;
    state._lastGamingBreakMins = null;
    state.favours = Math.min(2, Math.max(0, Number(state.favours) || 0));
    state._sampleAskCooldowns = {};
    state.vijayRound = { active: false, checkedPlayer: false };
    state.doorPls = { active: false, requesterId: null, expireMins: 0 };
    state.aoe2Event = { active: false, endMins: 0 };
    state.fireAlarm = { active: false, remainingMins: 0, elapsedMins: 0 };
    state.safetySweep = { active: false, countdownSec: 0, countdownMins: 0 };
    state.lcmsBroken = Boolean(state.mutators?.lcms_chaos && Math.random() < 0.5);
    state._cupboard19Inspected = false;
    state.prep = state.prep || {};
    state.prep.oven_flask = false;
    state.prep.argon_balloon = false;
    state.prep.dry_solvent = false;
    state.prep.bleach_bath = false;
    state.prep.tlc_check = false;
    state.prep.ph_calibrated = false;
    state.prep.has_clicker = state.player.id !== 'andre_shamsabadi';
    state.prep.tcep_buffered = state.player.id !== 'maximillian_lee';
    state.prep.thiol_dirty = false;
    state.prep.uncapped_waste = false;
    state.prep.extinguisher_displaced = false;
    state.prep.sabatini_spritz = false;
    state.prep.sabatini_tlc_jar = false;
    state._stepPrepCredit = {};
    state._stepBiotageBonusApplied = false;
    state._stepFaizaA280Done = false;
    state._stepDanFumbleApplied = false;
    state._stepArchieBonusApplied = false;
    state._stepArchieFlawApplied = false;
    state.npcChatCooldowns = {};
    state.morale = Math.min(100, state.morale + 15);
    state.energy = 95;
    state.social = Math.min(100, (state.social ?? 84) + 10);
    state.lastPreferredBreakMins = state.timeMins;
    state.player.specsOn = true;
    for (const npc of Object.values(state.npcs || {})) {
      if (!npc) continue;
      if (!window.KLB.CAST_BY_ID?.[npc.id]?.fixedRoom) {
        npc.pendingRoomTravel = null;
        npc.roomId = 'offsite';
        npc.path = [];
        npc.busyObjId = null;
        npc.huddleLockTimer = 0;
        npc.huddleTarget = null;
      }
    }
    window.KLB.Sim.resetBigChudsWeeklySims?.(state);
    if (window.KLB.Sim.rollDailyWeather) {
      window.KLB.Sim.rollDailyWeather(state);
    } else {
      state.weatherMode = state.mutators?.eternal_heatwave ? 'heatwave' : 'normal';
      state.tempC = state.mutators?.eternal_heatwave ? 30.2 : 21.0;
    }
    window.KLB.Sim.rollDailyBirthday?.(state, simCallbacks());
    syncCelebrationBanner();
    window.KLB.Sim.syncNPCSchedules(state, true, simCallbacks());
    transitionToRoom('klb_2f', window.KLB.ROOM_META.klb_2f.entrySpawn);
    saveActiveRunSnapshot(true);
  }

  function launchGordonsVictoryScene(res) {
    const score = res?.total ?? 6.0;
    const passed = Boolean(res?.passed);
    clearActiveRunSnapshot();
    state._pendingChoiceEventId = null;
    state.postAuditCelebration = true;
    if (res) state.lastAuditResult = res;
    if (state.timeMins >= 19 * 60) {
      state.timeMins = 18 * 60 + 30;
    }
    state.player.roomId = 'gordons_cafe';
    state.player.x = 8;
    state.player.y = 10;
    state.player.dir = 'N';
    state.player.specsOn = false;
    const sup = getSupervisorMeta();
    const cafeSpots = [[5, 11], [8, 11], [9, 11], [12, 11], [12, 9], [12, 5], [9, 3], [11, 3], [7, 9], [10, 9], [12, 7], [6, 9]];
    const cafeRm = window.KLB.WORLD_MAPS?.rooms?.gordons_cafe;
    const cafeAnchors = (cafeRm?.objects || []).filter(o => o && (o.type === 'cafe_table' || o.type === 'cafe_counter'));
    const allies = getPlayableCast().filter(c => c.id !== state.player.id);
    if (state.player.id === 'archie_wall' && window.KLB.CAST_BY_ID?.nafsika_forte && !allies.some(c => c.id === 'nafsika_forte')) {
      allies.unshift(window.KLB.CAST_BY_ID.nafsika_forte);
    }
    allies.forEach((c, idx) => {
      const npc = state.npcs?.[c.id];
      if (!npc) return;
      const spot = cafeSpots[idx % cafeSpots.length];
      npc.pendingRoomTravel = null;
      npc.busyObjId = null;
      npc.huddleLockTimer = 0;
      npc.huddleTarget = null;
      if (npc.sim) {
        npc.sim.currentAction = null;
        npc.sim.pendingJobStart = null;
      }
      npc.roomId = 'gordons_cafe';
      npc.x = spot[0];
      npc.y = spot[1];
      let faceDir = spot[1] >= 11 ? 'E' : 'S';
      if (cafeAnchors.length) {
        let bestD = Infinity;
        let bestAnchor = null;
        for (const a of cafeAnchors) {
          const ax = a.x + ((a.w || 1) - 1) * 0.5;
          const ay = a.y + ((a.h || 1) - 1) * 0.5;
          const d = Math.hypot(ax - npc.x, ay - npc.y);
          if (d < bestD) {
            bestD = d;
            bestAnchor = { ax, ay };
          }
        }
        if (bestAnchor) {
          const adx = bestAnchor.ax - npc.x;
          const ady = bestAnchor.ay - npc.y;
          if (Math.hypot(adx, ady) > 0.05) {
            faceDir = Math.abs(adx) >= Math.abs(ady) ? (adx < 0 ? 'W' : 'E') : (ady < 0 ? 'N' : 'S');
          }
        }
      }
      npc.dir = faceDir;
      npc.path = [];
    });
    syncAudioAmbience();
    syncCelebrationBanner();
    if (window.KLB.Audio?.playSfx) {
      window.KLB.Audio.playSfx(passed ? (score >= 8.0 ? 'fanfare_clear' : 'audit_pass') : 'chat_pop');
    }

    const speakerId = state.player.id === 'archie_wall' ? 'nafsika_forte' : 'joao_nogueira';
    showDialogue(
      speakerId,
      `Week ${state.weekNum} Complete — Gordon's Café (${score.toFixed(1)}/10)`,
      passed
        ? `Week Complete! Friday Audit cleared (${score.toFixed(1)}/10) and Friday shift finished. Chat with everyone in ${sup.chatName} at Gordon's, copy your score-card, start Week ${state.weekNum + 1}, or choose another researcher.`
        : `Week ${state.weekNum} wrapped (${score.toFixed(1)}/10). Catch a breather with the ${sup.chatName} crew at Gordon's, copy your score-card, start Week ${state.weekNum + 1}, or pick another researcher.`,
      [
        { label: "[1] Walk Around Gordon's", primary: true, onClick: closeDialogue },
        {
          label: '[2] Copy Score-Card',
          onClick: () => copyTextToClipboard(buildShareableScoreCard(state, state.lastAuditResult || res))
        },
        {
          label: `[3] Start Week ${state.weekNum + 1}`,
          onClick: () => {
            closeDialogue();
            startNextWeek();
          }
        },
        { label: '[4] Character Select', onClick: () => { closeDialogue(); renderTitleScreen(); } }
      ]
    );
    syncAllHUD(true);
  }

  function openPermadeathModal(reason) {
    clearActiveRunSnapshot();
    hideAlertBanner();
    if (state) state._pendingChoiceEventId = null;
    alexPursuitActive = false;
    syncCelebrationBanner();
    setPaused(true);
    modalDismissable = false;
    modalEscapeHandler = null;
    if (window.KLB.Audio) {
      window.KLB.Audio.stopAllAmbience();
    }

    const sup = getSupervisorMeta();
    const playerMeta = window.KLB.CAST_BY_ID[state.player.id] || { id: state.player.id, name: state.player.id, shortName: state.player.id };
    let heading = '0 Lab Condition — Lab 230 Suspended Until Monday';
    let body = window.KLB.Sim.PERMADEATH_MESSAGES?.[reason] || 'Lab Condition hit 0% — KLB Lab 230 closed for emergency cleanup and formal review.';
    if (reason === 'MORALE_ZERO') {
      heading = '0 Morale — Stepped Out Onto Gordon Street';
      body = `${playerMeta.name} hung up their lab coat after morale hit zero.`;
    } else if (reason === 'PATIENCE_ZERO') {
      heading = `0 ${sup.patienceLabel} — Friday Audit Failed`;
      body = sup.id === 'jamie_baker'
        ? "Jamie's patience hit zero after missed deadlines, sloppy safety discipline, and poor group-meeting data."
        : (window.KLB.Sim.PERMADEATH_MESSAGES?.PATIENCE_ZERO || "Vijay's patience hit zero after missed deadlines and poor group-meeting data.");
    } else if (reason === 'CONDITION_ZERO' || reason === 'SAFETY_ZERO') {
      heading = '0 Lab Condition — Lab 230 Closed for Review';
      body = window.KLB.Sim.PERMADEATH_MESSAGES?.CONDITION_ZERO || 'Lab Condition hit 0% — KLB Lab 230 closed for emergency cleanup and formal review.';
    }

    const daysReached = (state.dayIdx || 0) + 1;
    const stepsDone = (state.completedSteps || []).length;
    const wrPct = Math.round(state.weeklyReportProgress || 0);
    const msPct = Math.round(state.manuscriptProgress || 0);
    const slidesLabel = state.slideDeck?.ready ? 'Ready' : 'Pending';

    const box = prepareModalBox('klb-modal-sm', 'error');
    box.innerHTML = `
      <header class="klb-modal-header" style="align-items:center;">
        <img class="pixel-art" src="assets/portraits/${escHtml(playerMeta.id)}.png" alt="${escHtml(playerMeta.name)}" style="width:68px;height:68px;border-radius:8px;border:1px solid rgba(239,68,68,0.45);" />
        <div>
          <span class="klb-tag danger">Run Ended</span>
          <h3 style="margin-top:6px;color:#fecaca;">${escHtml(heading)}</h3>
        </div>
      </header>
      <div class="klb-modal-body">
        <p style="color:#e2e8f0;">${escHtml(body)}</p>
        <div class="dossier-pills">
          <span class="dossier-pill">Week ${state.weekNum || 1}, Day ${daysReached}</span>
          <span class="dossier-pill">${stepsDone} / 5 Bench Steps</span>
          <span class="dossier-pill">Report ${wrPct}%</span>
          <span class="dossier-pill">Manuscript ${msPct}%</span>
          <span class="dossier-pill">Slides: ${slidesLabel}</span>
        </div>
      </div>
      <footer class="klb-modal-footer">
        <button id="btn-perma-copy-card" type="button" class="share-card-btn">${icon('copy', 13)}<span>Copy Score-Card</span></button>
        <div style="display:flex;gap:8px;flex-wrap:wrap;">
          <button id="btn-perma-retry" type="button" class="rpg-btn primary" data-hotkey="1">[1] Retry Same Researcher</button>
          <button id="btn-perma-restart" type="button" class="rpg-btn" data-hotkey="2">[2] Character Select</button>
        </div>
      </footer>
    `;
    el('modal-backdrop').classList.remove('hidden');
    el('btn-perma-copy-card').onclick = ev => {
      copyTextToClipboard(buildShareableScoreCard(state, state.lastAuditResult || null, { heading, body }), ev.currentTarget);
    };
    el('btn-perma-retry').onclick = () => {
      const retryId = state?.player?.id || selectedCharId;
      closeModal();
      startNewRun(retryId, false);
    };
    el('btn-perma-restart').onclick = () => { closeModal(); renderTitleScreen(); };
  }

  // ==================== 8. ROOM TRANSITIONS & END OF DAY ====================
  function transitionToRoom(roomId, spawnOverride = null, navOpts = null) {
    if (!state || !window.KLB.WORLD_MAPS?.rooms?.[roomId]) return;
    if (state.spectatorMode) {
      state.cameraRoomId = roomId;
      syncAudioAmbience();
      syncAllHUD(true);
      return;
    }
    if (state.gameOver) return;
    if (state.activePlayerAction) {
      cancelActivePlayerAction(true);
    }

    const prevRoom = navOpts?.fromRoom || state.player.roomId;
    if (window.KLB.Sim?.endPlayerConversations) {
      window.KLB.Sim.endPlayerConversations(state, null, { changingRooms: true });
    }

    let sampleBannerMsg = null;
    if (navOpts?.askSamples && (roomId === 'cib_lg1b_nmr' || roomId === 'cib_lg11_ms')) {
      const sampleRes = window.KLB.Sim.triggerSampleRunCourtesy(state, state.player.id, roomId, prevRoom);
      if (sampleRes?.asked) {
        state.social = clamp((state.social ?? 84) + 5, 0, 100);
        if (sampleRes.gaveSample) {
          addFavours(1);
          sampleBannerMsg = `${sampleRes.askLine} | ${sampleRes.responderName}: "${sampleRes.replyLine}" (+5 Social, +1 Favour)`;
        } else {
          sampleBannerMsg = `${sampleRes.askLine} | ${sampleRes.responderName}: "${sampleRes.replyLine}" (+5 Social)`;
        }
      }
    }

    const isSpiralStairsTravel = (prevRoom === 'klb_2f' && roomId === 'klb_3f') || (prevRoom === 'klb_3f' && roomId === 'klb_2f');
    if (prevRoom && prevRoom !== roomId && !isSpiralStairsTravel && window.KLB.Audio?.playSfx) {
      window.KLB.Audio.playSfx('door_open');
    }

    const spawn = spawnOverride || window.KLB.ROOM_META?.[roomId]?.entrySpawn || { x: 15, y: 12, dir: 'S' };
    const free = window.KLB.Sim.findFreeWalkableNear(state, roomId, spawn.x, spawn.y, state.player.id, true) || spawn;
    state.player.roomId = roomId;
    state.player.x = free.x;
    state.player.y = free.y;
    state.player.dir = spawn.dir || 'S';
    state.player.autoPath = null;
    state.player.walkTarget = null;
    state.player.pendingInteract = null;
    closeDialogue();
    syncAudioAmbience();
    if (sampleBannerMsg) {
      showAlertBanner(sampleBannerMsg, 5000, false);
    }
    saveActiveRunSnapshot(true);
    syncAllHUD(true);
    if (roomId === 'klb_2f' && state.npcs?.alex_king?.roomId === 'klb_2f' && !state._alexEncounteredToday) {
      openAlexStealthEncounter();
    }
  }

  function endCurrentDay(forcedCurfew = false) {
    if (!state || state.gameOver) return;
    cancelActivePlayerAction(true);
    state._pendingChoiceEventId = null;
    closeDialogue({ skipUnpause: true });
    if (!el('modal-backdrop').classList.contains('hidden')) {
      window.KLB.Minigames?.abortActive?.();
      closeModal();
    }
    setPaused(false);

    if (!state.spectatorMode && state.dayIdx === 3 && !state.weeklyReportChecked) {
      window.KLB.Sim.evaluateWeeklyReportDeadline(state, simCallbacks());
    }
    if (!state.spectatorMode && state.dayIdx === 4 && !state.manuscriptChecked) {
      window.KLB.Sim.evaluateManuscriptDeadline(state, simCallbacks());
    }

    if (!state.spectatorMode) {
      window.KLB.Sim.checkPermadeath(state, simCallbacks());
      if (state.gameOver) return;
    }

    if (!state.spectatorMode && state.dayIdx === 4) {
      if (!state.fridayFinalAuditDone) {
        transitionToRoom('meeting_room', window.KLB.ROOM_META.meeting_room.entrySpawn);
        runSoloVijayAuditModal({ isWeekWrap: true });
        return;
      }
      launchGordonsVictoryScene(state.lastAuditResult || { total: 6.0, passed: true });
      return;
    }

    (state.activeStationJobs || []).forEach(j => {
      if (j.roomId === 'cib_lg1b_nmr' && !j._abilFineApplied && !state.spectatorMode) {
        j._abilFineApplied = true;
        state.abilFineOwed = true;
        window.KLB.Sim.pushWhatsApp(
          state,
          'abil_aliev',
          'Abil (LG1b NMR): "Uncollected NMR tube left past curfew — moved to the Sample Fridge (£130 fine). Collect your NMR tube or settle the fine!"'
        );
      }
      if (!j.isCold4C && j.canOvercook !== false) {
        j.elapsedMins = j.targetMins + j.sweetSpotMins + 60;
        j.status = 'overcooked';
      } else {
        j.elapsedMins = Math.max(j.elapsedMins, j.targetMins);
        j.status = j.canOvercook ? 'sweet' : 'ready';
      }
    });

    for (const npc of Object.values(state.npcs || {})) {
      if (!npc) continue;
      const npcMeta = window.KLB.CAST_BY_ID?.[npc.id];
      if (npc.sim?.activeJob) {
        const job = npc.sim.activeJob;
        if (!job.isCold4C && job.canOvercook && job.status !== 'overcooked') {
          job.status = 'overcooked';
          if (Array.isArray(npc.sim.failures)) npc.sim.failures.push('overcook');
          if (npc.sim.weeklyStats) npc.sim.weeklyStats.overcooks += 1;
        }
      }
      if (npc.sim) {
        const roughNight = Math.random() < 0.28;
        npc.sim.energy = roughNight ? (46 + Math.floor(Math.random() * 18)) : (70 + Math.floor(Math.random() * 20));
        npc.sim.morale = clamp((npc.sim.morale ?? 50) + 4, 0, 100);
        npc.sim.social = clamp((npc.sim.social ?? 84) + 6, 0, 100);
        npc.sim.hadLunchToday = false;
        npc.sim.currentAction = null;
        npc.sim.pendingJobStart = null;
        npc.sim._quartetDoneKey = null;
        if (npc.sim.lastPreferredBreakMins !== undefined) {
          npc.sim.lastPreferredBreakMins = Math.round((npcMeta?.arriveHour || 9.0) * 60);
        }
      }
      if (!npcMeta?.fixedRoom) {
        npc.pendingRoomTravel = null;
        npc.roomId = 'offsite';
        npc.path = [];
        npc.busyObjId = null;
        npc.huddleLockTimer = 0;
        npc.huddleTarget = null;
      }
    }

    if (state.dayIdx >= 4) {
      state.dayIdx = 0;
      state.weekNum = (state.weekNum || 1) + 1;
      state._trackedWeekNum = state.weekNum;
      if (state.spectatorMode) {
        state.weeklyReportProgress = 0;
        state.weeklyReportChecked = false;
        state.manuscriptProgress = 0;
        state.manuscriptChecked = false;
        state._seenEventsThisWeek = {};
        state._weeklySigDone = {};
        state._lastWeeklySigMins = -999;
        state._lastWeeklySigDay = -1;
        state.speechBubbles = [];
        state._queuedBubbles = [];
        state._queuedWaReplies = [];
        window.KLB.Sim.resetBigChudsWeeklySims?.(state);
      }
    } else {
      state.dayIdx += 1;
    }

    const isFridayStart = state.dayIdx === 4;
    const charMeta = window.KLB.CAST_BY_ID[state.player.id];
    const startHour = isFridayStart ? 9.0 : (state.spectatorMode ? 7.75 : (charMeta?.arriveHour || 9.0));
    state.timeMins = Math.round(startHour * 60);
    if (!state.spectatorMode) {
      state.activePlayerAction = null;
      state.hadLunchToday = false;
      state._salveToday = false;
      state._speakersMoraleToday = false;
      state._tcepFavourToday = false;
      state._lastCoffeeBreakMins = null;
      state._lastTeaBreakMins = null;
      state._lastGamingBreakMins = null;
      state.npcChatCooldowns = {};
      state.prep = state.prep || {};
      state.prep.ph_calibrated = false;
      state.energy = forcedCurfew ? 76 : 95;
      state.morale = Math.max(0, Math.min(100, (Number(state.morale) || 0) + (forcedCurfew ? -4 : 6)));
      state.social = Math.min(100, (state.social ?? 84) + 6);
      state.lastPreferredBreakMins = state.timeMins;
    }

    state._trackedDayIdx = state.dayIdx;
    state.aoe2UsedToday = false;
    state.coffeeUsedToday = false;
    state._prevAoe2UsedToday = false;
    state._pollToday = false;
    state._sweepToday = false;
    state._fireAlarmToday = false;
    state._alexToday = false;
    state._alexEncounteredToday = false;
    state._coffeePingToday = false;
    state._quartetWaToday = false;
    state._eveningToastToday = false;
    state._lcmsHazardToday = false;
    state.lcmsBroken = false;
    state._sampleAskCooldowns = {};
    state.vijayRound = { active: false, checkedPlayer: false };
    state.doorPls = { active: false, requesterId: null, expireMins: 0 };
    state.aoe2Event = { active: false, endMins: 0 };
    state.fireAlarm = { active: false, remainingMins: 0, elapsedMins: 0 };
    state.safetySweep = { active: false, countdownSec: 0, countdownMins: 0 };
    if (window.KLB.Sim.rollDailyWeather) {
      window.KLB.Sim.rollDailyWeather(state);
    } else {
      state.weatherMode = state.mutators.eternal_heatwave ? 'heatwave' : 'normal';
      state.tempC = state.mutators.eternal_heatwave ? 30.2 : 21.0;
    }
    window.KLB.Sim.rollDailyBirthday?.(state, simCallbacks());

    if (!state.spectatorMode) {
      if (isFridayStart) {
        const mSpawn = window.KLB.ROOM_META?.meeting_room?.entrySpawn || { x: 6, y: 6, dir: 'N' };
        const free = window.KLB.Sim.findFreeWalkableNear(state, 'meeting_room', mSpawn.x, mSpawn.y, state.player.id, true) || mSpawn;
        state.player.roomId = 'meeting_room';
        state.player.x = free.x;
        state.player.y = free.y;
        state.player.dir = mSpawn.dir || 'N';
        state.player.specsOn = false;
      } else {
        state.player.roomId = 'klb_2f';
        const free = window.KLB.Sim.findFreeWalkableNear(state, 'klb_2f', 27, 12, state.player.id, true) || { x: 27, y: 12 };
        state.player.x = free.x;
        state.player.y = free.y;
        state.player.dir = 'W';
        state.player.specsOn = true;
      }
      state.player.autoPath = null;
      state.player.walkTarget = null;
      state.player.pendingInteract = null;
    }

    window.KLB.Sim.syncNPCSchedules(state, true);
    syncAudioAmbience();
    showAlertBanner(
      isFridayStart
        ? 'FRI 09:00 — Group Meeting starting in the Seminar Room!'
        : (forcedCurfew
            ? `19:30 Security Lockup — rolled to ${window.KLB.Sim.DAYS[state.dayIdx]} morning.`
            : `${window.KLB.Sim.DAYS[state.dayIdx]} morning in KLB Lab 230.`),
      4200,
      false
    );
    window.KLB.Sim.checkPermadeath(state, simCallbacks());
    saveActiveRunSnapshot(true);
    syncAllHUD(true);
    if (!state.spectatorMode && isFridayStart) {
      triggerFridayMorningWelcome();
    }
  }

  // ==================== 9. DIALOGUE & RIGHT COMMAND DECK HUD ====================
  function showDialogue(portraitCharId, speaker, text, actions = [], quickClose = false, taskMeta = '', opts = {}) {
    state._dlgQuickClose = quickClose;
    state._dlgOrigin = { x: state.player.x, y: state.player.y };
    state._dlgUnpauseOnClose = Boolean(opts && opts.unpauseOnClose);
    el('rpg-portrait').src = `assets/portraits/${portraitCharId || state.player.id}.png`;
    el('rpg-speaker').textContent = speaker;
    const metaEl = el('rpg-task-meta');
    if (taskMeta) {
      metaEl.textContent = taskMeta;
      metaEl.classList.remove('hidden');
    } else {
      metaEl.classList.add('hidden');
    }
    el('rpg-text').textContent = text;
    const actWrap = el('rpg-actions');
    actWrap.innerHTML = '';
    actions.forEach((a, i) => {
      const b = document.createElement('button');
      b.className = 'rpg-btn' + (a.primary ? ' primary' : '');
      b.dataset.hotkey = String(i + 1);
      b.textContent = a.label;
      const isDisabled = Boolean(a.disabled);
      b.disabled = isDisabled;
      if (isDisabled) {
        b.title = a.disabledTitle || a.label;
      }
      if (!isDisabled && typeof a.onClick === 'function') {
        b.onclick = () => {
          if (b.disabled) return;
          a.onClick();
        };
      }
      actWrap.appendChild(b);
    });
    el('rpg-dialogue-box').classList.remove('hidden');
  }

  function closeDialogue(opts = {}) {
    el('rpg-dialogue-box').classList.add('hidden');
    const shouldUnpause = Boolean(state && state._dlgUnpauseOnClose && !opts?.skipUnpause);
    if (state) {
      state._dlgQuickClose = false;
      state._dlgOrigin = null;
      state._dlgUnpauseOnClose = false;
    }
    if (shouldUnpause) {
      setPaused(false);
    }
  }

  function closeModal() {
    try { window.KLB.Minigames?.abortActive?.(); } catch (_) {}
    el('modal-backdrop').classList.add('hidden');
    const b = el('modal-box');
    if (b) {
      b.classList.remove('ev-modal', 'klb-modal', 'klb-modal-sm');
      Array.from(b.classList).forEach(cls => {
        if (cls.startsWith('ev-theme-') || cls.startsWith('klb-theme-')) {
          b.classList.remove(cls);
        }
      });
      b.innerHTML = '';
    }
    modalDismissable = true;
    modalEscapeHandler = null;
    const focusTarget = lastFocusedEl;
    lastFocusedEl = null;
    if (focusTarget && typeof focusTarget.focus === 'function' && focusTarget.isConnected && !focusTarget.closest('.hidden')) {
      focusTarget.focus();
    }
  }

  function toggleSpecs() {
    if (!state || state.spectatorMode) return;
    state.player.specsOn = !state.player.specsOn;
    if (window.KLB.Audio) window.KLB.Audio.playSfx('interact');
    showAlertBanner(state.player.specsOn
      ? 'Safety Specs ON — inspection compliant.'
      : 'Safety Specs OFF — passive Morale drain reduced by 40% (put Specs ON before inspections!).', 3000, false);
    syncAllHUD(true);
  }

  function toggleHeadphones() {
    if (!state || state.spectatorMode) return;
    state.player.headphonesOn = !state.player.headphonesOn;
    if (window.KLB.Audio?.playSfx) window.KLB.Audio.playSfx('pause_toggle');
    syncAudioAmbience();
    showAlertBanner(state.player.headphonesOn
      ? 'Headphones ON — Energy/Focus depletion reduced by 35% (take OFF during inspections!).'
      : 'Headphones OFF — inspection compliant.', 3000, false);
    syncAllHUD(true);
  }

  function populateTravelCombobox() {
    const sel = el('select-travel');
    if (!sel || !state || !state.spectatorMode) return;
    const viewRoom = getViewRoom();
    const errandsSig = `spec:${viewRoom}`;
    if (errandsSig === lastTravelRoomSig) return;
    lastTravelRoomSig = errandsSig;

    const roomIds = ['klb_2f', 'klb_3f', 'gordons_cafe', 'cib_lg11_ms', 'cib_lg1b_nmr', 'meeting_room'];
    sel.innerHTML = roomIds.map(rid => {
      const rMeta = window.KLB.ROOM_META?.[rid];
      const title = rMeta?.shortName || window.KLB.WORLD_MAPS?.rooms?.[rid]?.name || rid;
      const prefix = rid === viewRoom ? '* ' : '';
      return `<option value="${escHtml(rid)}">${escHtml(prefix + title)}</option>`;
    }).join('');
    sel.value = viewRoom;
  }

  function getProgressPct(item) {
    if (!item) return 0;
    if (item.kind === 'weekly_report') return clamp(Math.round(state.weeklyReportProgress || 0), 0, 100);
    if (item.kind === 'manuscript_draft') return clamp(Math.round(state.manuscriptProgress || 0), 0, 100);
    if (typeof item.progress === 'number' && Number.isFinite(item.progress)) {
      return clamp(Math.round(item.progress <= 1.5 ? item.progress * 100 : item.progress), 0, 100);
    }
    const target = Number(item.targetMins) || 1;
    return clamp(Math.round(((Number(item.elapsedMins) || 0) / target) * 100), 0, 100);
  }

  function pickPreferredStation(rm, roomId, predicate) {
    if (!rm || !state?.player) return null;
    const p = state.player;
    const homeGroup = p.id === 'archie_wall' ? 'baker' : 'chudasama';
    const busySet = new Set();
    for (const n of Object.values(state.npcs || {})) {
      if (n && n.roomId === roomId && n.busyObjId) busySet.add(n.busyObjId);
    }
    const candidates = (rm.objects || []).filter(predicate);
    candidates.sort((a, b) => {
      const aHome = a.group === homeGroup ? 0 : 1;
      const bHome = b.group === homeGroup ? 0 : 1;
      if (aHome !== bHome) return aHome - bHome;
      const aBusy = busySet.has(a.id) ? 1 : 0;
      const bBusy = busySet.has(b.id) ? 1 : 0;
      if (aBusy !== bBusy) return aBusy - bBusy;
      const da = Math.hypot((a.x + a.w * 0.5) - p.x, (a.y + a.h * 0.5) - p.y);
      const db = Math.hypot((b.x + b.w * 0.5) - p.x, (b.y + b.h * 0.5) - p.y);
      return da - db;
    });
    return candidates[0] || null;
  }

  function autoWalkToStationTarget(targetRoomId, objId = null, stationTypes = null, cupboardHint = null) {
    if (!state || state.spectatorMode || state.gameOver) return;
    if (!el('modal-backdrop').classList.contains('hidden')) return;
    if (state.paused || state.isPaused) {
      showAlertBanner('Resume the simulation first to auto-walk to a station.', 2400, false);
      return;
    }
    const curRoom = state.player.roomId;
    const rm = window.KLB.WORLD_MAPS?.rooms?.[curRoom];
    if (!rm) return;

    let targetObj = null;
    if (targetRoomId && targetRoomId !== curRoom) {
      const useSpiral = (curRoom === 'klb_2f' && targetRoomId === 'klb_3f') || (curRoom === 'klb_3f' && targetRoomId === 'klb_2f');
      targetObj = rm.objects.find(o => o.type === (useSpiral ? 'spiral_stairs' : 'exit_stairs'))
        || rm.objects.find(o => o.type === 'exit_stairs' || o.type === 'spiral_stairs')
        || null;
    } else {
      if (objId) {
        targetObj = rm.objects.find(o => o.id === objId) || null;
      }
      if (!targetObj && Array.isArray(stationTypes) && stationTypes.length) {
        targetObj = pickPreferredStation(rm, curRoom, o => {
          if (!stationTypes.includes(o.type)) return false;
          if (cupboardHint && o.type === 'chem_cupboard') {
            return matchesCupboardHint(o.label || '', cupboardHint);
          }
          return true;
        });
      }
    }

    if (!targetObj) return;
    if (window.KLB.Audio?.playSfx) window.KLB.Audio.playSfx('ui_click');

    const nearX = clamp(state.player.x, targetObj.x, targetObj.x + (targetObj.w || 1) - 1);
    const nearY = clamp(state.player.y, targetObj.y, targetObj.y + (targetObj.h || 1) - 1);
    if (Math.hypot(state.player.x - nearX, state.player.y - nearY) <= 1.85) {
      const dx = (targetObj.x + (targetObj.w - 1) * 0.5) - state.player.x;
      const dy = (targetObj.y + (targetObj.h - 1) * 0.5) - state.player.y;
      state.player.dir = Math.abs(dx) >= Math.abs(dy) ? (dx < 0 ? 'W' : 'E') : (dy < 0 ? 'N' : 'S');
      interactWithObject(targetObj, [targetObj]);
      return;
    }

    const free = window.KLB.Sim.findFreeAdjacentWalkable(state, curRoom, targetObj, state.player.id);
    if (!free) return;
    const path = window.KLB.Sim.findPathBFS(curRoom, state.player.x, state.player.y, free.x, free.y, 70, state, state.player.id);
    if (path && path.length > 0) {
      if (state.activePlayerAction) cancelActivePlayerAction();
      state.player.autoPath = path;
      state.player.walkTarget = { x: free.x, y: free.y };
      state.player.pendingInteract = { obj: targetObj, allHits: [targetObj] };
      if (window.KLB.Renderer25D?.triggerClickRipple) {
        window.KLB.Renderer25D.triggerClickRipple(free.x, free.y, 'interact');
      }
    }
  }

  function renderTaskPanel(force = false) {
    const pin = el('pinned-objective');
    if (!pin) return;

    if (state.spectatorMode) {
      const viewRoom = getViewRoom();
      const rMeta = window.KLB.ROOM_META[viewRoom] || {};
      const sig = `spec:${viewRoom}`;
      if (sig === lastTaskPanelSig) return;
      lastTaskPanelSig = sig;
      pin.className = 'pinned-objective';
      pin.innerHTML = `
        <div class="pinned-title-row">
          ${icon('users', 14)}
          <span class="pinned-title-text">Observer View: ${escHtml(rMeta.shortName || viewRoom)}</span>
        </div>
        <div class="pinned-meta-line">All 10 Big-Chuds, Archie &amp; neighbours acting autonomously.</div>
        <ol id="subtask-list" class="subtask-list"></ol>
      `;
      return;
    }

    const curStep = getCurrentCampaignStep();
    const act = state.activePlayerAction;
    const jobs = state.activeStationJobs || [];

    if (!curStep) {
      const sig = `done:${Math.round(state.weeklyReportProgress || 0)}:${Math.round(state.manuscriptProgress || 0)}:${state.slideDeck.ready ? 1 : 0}`;
      if (sig === lastTaskPanelSig) return;
      lastTaskPanelSig = sig;
      pin.className = 'pinned-objective done';
      pin.innerHTML = `
        <div class="pinned-title-row">
          ${icon('check-circle', 14)}
          <span class="pinned-title-text">All 5 protocol steps complete</span>
        </div>
        <div class="pinned-meta-line">Weekly Report ${Math.round(state.weeklyReportProgress || 0)}% | Manuscript ${Math.round(state.manuscriptProgress || 0)}% | Deck ${state.slideDeck.ready ? 'Ready' : 'Pending'}</div>
        <ol id="subtask-list" class="subtask-list"></ol>
      `;
      return;
    }

    const subs = curStep.subTasks || [];
    const activeJobMap = new Map();
    for (const j of jobs) {
      if (j.subTaskId) activeJobMap.set(j.subTaskId, j);
    }

    const sigParts = [
      state.campaignStepIdx,
      state.campaignSubTaskIdx,
      state.completedSubTasks.join(','),
      act?.subTaskId || '',
      Array.from(activeJobMap.entries()).map(([id, j]) => `${id}:${j.status}`).join(',')
    ];
    const sig = sigParts.join('|');
    if (sig === lastTaskPanelSig) return;
    lastTaskPanelSig = sig;

    pin.className = 'pinned-objective';
    const roomHintShort = rm => {
      if (rm === 'cib_lg11_ms') return 'LG11';
      if (rm === 'cib_lg1b_nmr') return 'LG1b';
      if (rm === 'klb_3f') return '3F';
      if (rm === 'gordons_cafe') return 'Café';
      return '2F';
    };

    const rowsHtml = subs.map((s, idx) => {
      const isDone = idx < state.campaignSubTaskIdx || state.completedSubTasks.includes(s.id);
      const isActRunning = Boolean(act && act.subTaskId === s.id);
      const matchingJob = activeJobMap.get(s.id) || null;
      const isRunning = isActRunning || Boolean(matchingJob);
      const isActive = !isDone && idx === state.campaignSubTaskIdx;

      let rowCls = 'subtask-row';
      if (isDone) rowCls += ' done';
      else if (isRunning) rowCls += ' active running clickable';
      else if (isActive) rowCls += ' active clickable';

      const stIcon = isDone ? 'check-circle' : isRunning ? 'clock' : isActive ? 'arrow-right' : 'circle-dot';
      const activeObj = isActRunning ? act : matchingJob;
      const pct = activeObj ? getProgressPct(activeObj) : 0;

      let metaTxt = roomHintShort(s.roomId);
      let barStyle = `width:${pct}%;`;
      if (matchingJob) {
        if (matchingJob.status === 'overcooked') {
          metaTxt = 'OVERCOOK!';
          barStyle = 'width:100%;background:#ef4444;';
        } else if (matchingJob.status === 'sweet') {
          metaTxt = 'SWEET SPOT';
          barStyle = 'width:100%;background:#22c55e;';
        } else if (matchingJob.status === 'ready') {
          metaTxt = 'READY';
          barStyle = 'width:100%;background:#22c55e;';
        } else {
          metaTxt = `${pct}%`;
        }
      } else if (isActRunning) {
        metaTxt = `${pct}%`;
      } else if (s.cupboardHint && isActive) {
        metaTxt = s.cupboardHint;
      }

      const barHtml = isRunning
        ? `<div class="subtask-loading-track"><div class="subtask-loading-fill" data-subtask-bar="${escHtml(s.id)}" style="${barStyle}"></div></div>`
        : '';

      return `
        <li class="${rowCls}" data-subtask-idx="${idx}" ${(!isDone && (isActive || isRunning)) ? 'tabindex="0" role="button" title="Click to auto-walk to this station"' : ''}>
          <div class="subtask-row-main">
            <span class="subtask-row-label">${icon(stIcon, 12)}<span>${escHtml(s.label)}</span></span>
            <span class="subtask-row-meta" data-subtask-meta="${escHtml(s.id)}">${escHtml(metaTxt)}</span>
          </div>
          ${barHtml}
        </li>
      `;
    }).join('');

    pin.innerHTML = `
      <div class="pinned-title-row">
        ${icon('list-checks', 14)}
        <span class="pinned-title-text">Step ${state.campaignStepIdx + 1}/5: ${escHtml(curStep.title)}</span>
      </div>
      <ol id="subtask-list" class="subtask-list">${rowsHtml}</ol>
    `;

    pin.querySelectorAll('.subtask-row.clickable').forEach(rowEl => {
      rowEl.onclick = () => {
        const sIdx = Number(rowEl.dataset.subtaskIdx);
        const targetSub = subs[sIdx];
        if (!targetSub) return;
        const jobMatch = activeJobMap.get(targetSub.id) || null;
        autoWalkToStationTarget(
          jobMatch?.roomId || targetSub.roomId,
          jobMatch?.objId || null,
          targetSub.stationTypes || null,
          targetSub.cupboardHint || null
        );
      };
    });
  }

  function renderEquipmentTimers(force = false) {
    const viewRoom = getViewRoom();
    const rList = el('reactions-list');
    const countLbl = el('rxn-count-lbl');
    if (!rList || !countLbl) return;

    const items = [];
    if (state.spectatorMode) {
      const visRxns = (window.KLB.Sim.getVisibleNPCReactions(state, viewRoom) || [])
        .filter(r => !r.isAction && r.kind !== 'workup' && !String(r.id || '').startsWith('npc_act_'));
      visRxns.forEach(r => items.push(Object.assign({ _source: 'npc' }, r)));
    } else {
      (state.activeStationJobs || []).forEach(j => items.push(Object.assign({ _source: 'job' }, j)));
      const act = state.activePlayerAction;
      if (
        act &&
        act.kind !== 'subtask_action' &&
        act.kind !== 'subtask_collect' &&
        act.kind !== 'weekly_report' &&
        act.kind !== 'manuscript_draft'
      ) {
        items.push({
          id: 'player_act_' + act.kind,
          _source: 'player_act',
          kind: act.kind,
          title: act.label || 'Working',
          label: act.label || 'Working',
          roomId: act.roomId || state.player.roomId,
          elapsedMins: act.elapsedMins || 0,
          targetMins: act.targetMins || 0,
          progress: act.progress,
          status: 'running'
        });
      }
    }

    el('active-timers-wrap')?.classList.toggle('hidden', items.length === 0);
    el('reactions-panel')?.classList.toggle('hidden', items.length === 0);

    const sig = `${state.spectatorMode ? 'S' : 'P'}:${viewRoom}:` + items.map(it => `${it.id}:${it.status || 'running'}`).join('|');
    if (sig === lastReactionsSig) return;
    lastReactionsSig = sig;
    const prevScrollTop = rList.scrollTop;

    countLbl.textContent = `${items.length} running`;
    if (!items.length) {
      rList.innerHTML = '';
      return;
    }

    rList.innerHTML = items.map(r => {
      const pct = getProgressPct(r);
      const cls = r.status === 'overcooked' ? 'overcook' : (r.status === 'sweet' || r.status === 'ready') ? 'sweet' : '';
      const ownerTag = r.ownerId ? `${window.KLB.CAST_BY_ID[r.ownerId]?.shortName || r.ownerId}: ` : '';
      const rmShort = window.KLB.ROOM_META[r.roomId]?.shortName.split(' ')[0] || r.roomId;
      let statusTxt;
      if (r.status === 'overcooked') {
        statusTxt = 'OVERCOOKING — QUENCH NOW';
      } else if (r.status === 'sweet') {
        const rem = Math.max(0, Math.round((r.targetMins || 0) + (r.sweetSpotMins || 55) - (r.elapsedMins || 0)));
        statusTxt = `SWEET SPOT (${rem}m left)`;
      } else if (r.status === 'ready') {
        statusTxt = `READY FOR COLLECTION (${rmShort})`;
      } else {
        statusTxt = `${pct}% (${Math.floor(r.elapsedMins || 0)}/${r.targetMins || 1}m, ${rmShort})`;
      }
      const bg = r.status === 'overcooked' ? '#ef4444' : (r.status === 'sweet' || r.status === 'ready') ? '#22c55e' : '#3b82f6';
      const clickableCls = !state.spectatorMode && r._source === 'job' ? ' clickable' : '';
      return `
        <div class="rxn-card ${cls}${clickableCls}" data-timer-id="${escHtml(r.id)}" ${clickableCls ? 'tabindex="0" role="button" title="Click to auto-walk to this station"' : ''}>
          <div class="rxn-card-top">
            <span style="min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${escHtml(ownerTag)}${escHtml(r.title || r.label)}</span>
            <span class="mono-muted" data-timer-status="${escHtml(r.id)}" style="font-size:10.5px;flex-shrink:0;">${escHtml(statusTxt)}</span>
          </div>
          <div class="meter-track"><div class="meter-fill" data-timer-bar="${escHtml(r.id)}" style="width:${pct}%;background:${bg};"></div></div>
        </div>
      `;
    }).join('');

    if (!state.spectatorMode) {
      rList.querySelectorAll('.rxn-card.clickable').forEach(cardEl => {
        cardEl.onclick = () => {
          const tid = cardEl.dataset.timerId;
          const job = (state.activeStationJobs || []).find(j => j.id === tid);
          if (!job) return;
          autoWalkToStationTarget(job.roomId, job.objId, job.stationType ? [job.stationType] : null, null);
        };
      });
    }
    rList.scrollTop = prevScrollTop;
  }

  function renderWeeklyDeliverables() {
    if (!state || state.spectatorMode) return;
    const wrPct = clamp(Math.round(state.weeklyReportProgress || 0), 0, 100);
    const msPct = clamp(Math.round(state.manuscriptProgress || 0), 0, 100);
    const isDraftingWR = state.activePlayerAction?.kind === 'weekly_report';
    const isDraftingMS = state.activePlayerAction?.kind === 'manuscript_draft';

    el('row-weekly-report')?.classList.toggle('drafting', Boolean(isDraftingWR && wrPct < 100));
    el('row-manuscript')?.classList.toggle('drafting', Boolean(isDraftingMS && msPct < 100));

    if (el('val-weekly-report')) el('val-weekly-report').textContent = `${wrPct}%`;
    if (el('bar-weekly-report')) el('bar-weekly-report').style.width = `${wrPct}%`;
    if (el('due-weekly-report')) {
      const dueEl = el('due-weekly-report');
      if (wrPct >= 100) {
        dueEl.className = 'due-tag ok';
        dueEl.textContent = 'Done 100%';
      } else if (isDraftingWR) {
        dueEl.className = 'due-tag drafting';
        dueEl.textContent = 'Drafting now';
      } else if (state.dayIdx > 3 || (state.dayIdx === 3 && state.timeMins >= 18 * 60)) {
        dueEl.className = 'due-tag overdue';
        dueEl.textContent = 'Overdue Thu 18:00';
      } else {
        dueEl.className = 'due-tag';
        dueEl.textContent = 'Due Thu 18:00';
      }
    }

    if (el('val-manuscript')) el('val-manuscript').textContent = `${msPct}%`;
    if (el('bar-manuscript')) el('bar-manuscript').style.width = `${msPct}%`;
    if (el('due-manuscript')) {
      const msDueEl = el('due-manuscript');
      if (msPct >= 100) {
        msDueEl.className = 'due-tag ok';
        msDueEl.textContent = 'Done 100%';
      } else if (isDraftingMS) {
        msDueEl.className = 'due-tag drafting';
        msDueEl.textContent = 'Drafting now';
      } else if (state.dayIdx === 4 && state.timeMins >= 18 * 60) {
        msDueEl.className = 'due-tag overdue';
        msDueEl.textContent = 'Overdue Fri 18:00';
      } else {
        msDueEl.className = 'due-tag';
        msDueEl.textContent = 'Due Fri 18:00';
      }
    }

    const deckRow = el('row-slide-deck');
    const deckDue = el('due-slide-deck');
    const deckLbl = el('lbl-slide-deck');
    const deckBar = el('bar-slide-deck');
    if (deckRow || deckLbl || deckBar) {
      const deck = state.slideDeck || {};
      const lb = state.labBook || [];
      const hasF1 = Boolean(deck.fig1Id && lb.some(f => f.id === deck.fig1Id));
      const hasF2 = Boolean(deck.fig2Id && deck.fig2Id !== deck.fig1Id && lb.some(f => f.id === deck.fig2Id));
      const slidesCount = deck.ready ? (2 + (hasF1 ? 1 : 0) + (hasF2 ? 1 : 0)) : 0;
      const isFullReady = Boolean(deck.ready && slidesCount === 4);
      const slidePct = Math.round((slidesCount / 4) * 100);
      if (deckRow) {
        deckRow.classList.add('clickable');
        deckRow.classList.toggle('ready', isFullReady);
        if (!deckRow.hasAttribute('tabindex')) deckRow.setAttribute('tabindex', '0');
        if (!deckRow.hasAttribute('role')) deckRow.setAttribute('role', 'button');
      }
      if (deckLbl) {
        deckLbl.textContent = deck.ready ? `Ready ${slidesCount}/4` : `${slidesCount}/4 Ready`;
      }
      if (deckBar) {
        deckBar.style.width = `${slidePct}%`;
      }
      if (deckDue) {
        if (isFullReady) {
          deckDue.className = 'due-tag ok';
          deckDue.textContent = 'Saved 4/4';
        } else if (deck.ready) {
          deckDue.className = 'due-tag drafting';
          deckDue.textContent = `Saved ${slidesCount}/4`;
        } else if (state.dayIdx === 4 && state.timeMins >= 9 * 60) {
          deckDue.className = 'due-tag overdue';
          deckDue.textContent = 'Due Fri 09:00';
        } else {
          deckDue.className = 'due-tag';
          deckDue.textContent = 'Due Fri 09:00';
        }
      }
    }
  }

  function syncProgressBarsLightweight() {
    if (!state) return;

    if (!state.spectatorMode) {
      // Update active subtask inline bar smoothly at ~10 Hz without rebuilding DOM
      const act = state.activePlayerAction;
      if (act && act.subTaskId) {
        const pct = getProgressPct(act);
        const bar = document.querySelector(`[data-subtask-bar="${act.subTaskId}"]`);
        const meta = document.querySelector(`[data-subtask-meta="${act.subTaskId}"]`);
        if (bar) bar.style.width = `${pct}%`;
        if (meta) meta.textContent = `${pct}%`;
      }
      for (const j of state.activeStationJobs || []) {
        if (!j.subTaskId) continue;
        const bar = document.querySelector(`[data-subtask-bar="${j.subTaskId}"]`);
        const meta = document.querySelector(`[data-subtask-meta="${j.subTaskId}"]`);
        if (bar && j.status === 'running') bar.style.width = `${getProgressPct(j)}%`;
        if (meta && j.status === 'running') meta.textContent = `${getProgressPct(j)}%`;
      }

      // Update #reactions-list bars smoothly
      for (const j of state.activeStationJobs || []) {
        const pct = getProgressPct(j);
        const bar = document.querySelector(`[data-timer-bar="${j.id}"]`);
        const st = document.querySelector(`[data-timer-status="${j.id}"]`);
        if (bar) bar.style.width = `${pct}%`;
        if (st && j.status === 'running') {
          const rmShort = window.KLB.ROOM_META[j.roomId]?.shortName.split(' ')[0] || j.roomId;
          st.textContent = `${pct}% (${Math.floor(j.elapsedMins || 0)}/${j.targetMins || 1}m, ${rmShort})`;
        } else if (st && j.status === 'sweet') {
          const rem = Math.max(0, Math.round((j.targetMins || 0) + (j.sweetSpotMins || 55) - (j.elapsedMins || 0)));
          st.textContent = `SWEET SPOT (${rem}m left)`;
        }
      }
      if (
        act &&
        act.kind !== 'subtask_action' &&
        act.kind !== 'subtask_collect' &&
        act.kind !== 'weekly_report' &&
        act.kind !== 'manuscript_draft'
      ) {
        const tid = 'player_act_' + act.kind;
        const pct = getProgressPct(act);
        const bar = document.querySelector(`[data-timer-bar="${tid}"]`);
        const st = document.querySelector(`[data-timer-status="${tid}"]`);
        if (bar) bar.style.width = `${pct}%`;
        if (st) {
          const rmShort = window.KLB.ROOM_META[act.roomId || state.player.roomId]?.shortName.split(' ')[0] || 'KLB';
          st.textContent = `${pct}% (${Math.floor(act.elapsedMins || 0)}/${act.targetMins || 1}m, ${rmShort})`;
        }
      }

      renderWeeklyDeliverables();
    } else {
      const viewRoom = getViewRoom();
      const visRxns = (window.KLB.Sim.getVisibleNPCReactions(state, viewRoom) || [])
        .filter(r => !r.isAction && r.kind !== 'workup' && !String(r.id || '').startsWith('npc_act_'));
      for (const r of visRxns) {
        const pct = getProgressPct(r);
        const bar = document.querySelector(`[data-timer-bar="${r.id}"]`);
        const st = document.querySelector(`[data-timer-status="${r.id}"]`);
        if (bar) bar.style.width = `${pct}%`;
        if (st && r.status === 'running') {
          const rmShort = window.KLB.ROOM_META[r.roomId]?.shortName.split(' ')[0] || r.roomId;
          st.textContent = `${pct}% (${Math.floor(r.elapsedMins || 0)}/${r.targetMins || 1}m, ${rmShort})`;
        }
      }
    }
  }

  function syncAllHUD(force = false) {
    if (!state) return;
    const viewRoom = getViewRoom();

    syncPauseButtonUI();
    syncMuteButtonUI();
    syncSupervisorChrome();
    populateTravelCombobox();
    if (state.spectatorMode) syncSpecFollowBadge();

    const charBadgeEl = el('hud-char-badge');
    if (charBadgeEl) {
      if (state.spectatorMode) {
        charBadgeEl.textContent = 'Observer | Big-Chuds, Archie & neighbours';
      } else {
        const cMeta = window.KLB.CAST_BY_ID?.[state.player.id];
        const roleShort = (cMeta?.role?.split('•')[1] || cMeta?.role || 'Researcher').trim();
        charBadgeEl.textContent = `${cMeta?.shortName || state.player.id} | ${roleShort}`;
      }
    }
    const roomBadgeEl = el('hud-room-badge');
    if (roomBadgeEl) {
      const rMeta = window.KLB.ROOM_META?.[viewRoom];
      roomBadgeEl.textContent = rMeta?.shortName || window.KLB.WORLD_MAPS?.rooms?.[viewRoom]?.name || viewRoom;
    }

    if (!state.spectatorMode) {
      const spBtn = el('btn-toggle-specs');
      el('lbl-specs').textContent = state.player.specsOn ? 'Specs ON' : 'Specs OFF';
      spBtn.className = 'hud-btn ' + (state.player.specsOn ? 'on' : (viewRoom === 'klb_2f' ? 'warn' : ''));

      const hpBtn = el('btn-toggle-headphones');
      el('lbl-headphones').textContent = state.player.headphonesOn ? 'Headphones ON' : 'Headphones';
      const hpWarn = Boolean(state.safetySweep?.active && state.player.headphonesOn);
      hpBtn.className = 'hud-btn' + (hpWarn ? ' warn' : (state.player.headphonesOn ? ' on' : ''));
    }

    if (!state.spectatorMode && state.safetySweep?.active) {
      const b = el('live-alert-banner');
      const secs = Math.max(0, Math.ceil(state.safetySweep.countdownSec));
      const cond = Math.round(window.KLB.Sim.getLabCondition(state));
      const sweepText = state.player.roomId !== 'klb_2f'
        ? `SAFETY SWEEP IN LAB 230 (${secs}s) — Lab Condition: ${cond}%`
        : `SAFETY SWEEP IN ${secs}s — Specs: ${state.player.specsOn ? 'ON' : 'OFF'} | Headphones: ${state.player.headphonesOn ? 'ON' : 'OFF'} | Lab Condition: ${cond}%`;
      const bannerSig = `sweep:${sweepText}`;
      if (bannerSig !== lastAlertBannerSig) {
        lastAlertBannerSig = bannerSig;
        b.className = 'danger';
        b.dataset.sticky = '1';
        b.innerHTML = `${icon('shield-check', 14)}<span>${escHtml(sweepText)}</span>`;
        b.classList.remove('hidden');
      }
    } else if (!state.spectatorMode && state.fireAlarm?.active && (viewRoom === 'klb_2f' || viewRoom === 'klb_3f')) {
      const b = el('live-alert-banner');
      const remMins = Math.ceil(state.fireAlarm.remainingMins);
      const bannerSig = `fire:${remMins}`;
      if (bannerSig !== lastAlertBannerSig) {
        lastAlertBannerSig = bannerSig;
        b.className = 'danger';
        b.dataset.sticky = '1';
        b.innerHTML = `${icon('flame', 14)}<span>FIRE ALARM (${remMins}m left) — Evacuate via the left fire exit!</span>`;
        b.classList.remove('hidden');
      }
    } else {
      const b = el('live-alert-banner');
      if (b && b.dataset.sticky === '1') {
        delete b.dataset.sticky;
        hideAlertBanner();
      }
    }

    el('clock-readout').textContent = window.KLB.Sim.formatClock(state.dayIdx, state.timeMins);
    const hv = el('hvac-readout');
    const modeLabel = state.weatherMode === 'cold_230'
      ? 'Cold'
      : state.weatherMode === 'heatwave'
        ? 'Heatwave'
        : state.weatherMode === 'rain'
          ? 'Rain'
          : 'Normal';
    hv.textContent = `${Math.round(state.tempC)} °C ${modeLabel}`;
    hv.style.color = state.weatherMode === 'cold_230'
      ? '#93c5fd'
      : state.weatherMode === 'heatwave'
        ? '#fca5a5'
        : state.weatherMode === 'rain'
          ? '#7dd3fc'
          : '#cbd5e1';

    if (!state.spectatorMode) {
      const setBar = (k, val) => {
        const v = clamp(Math.round(val ?? 0), 0, 100);
        if (el(`val-${k}`)) el(`val-${k}`).textContent = `${v}`;
        if (el(`bar-${k}`)) el(`bar-${k}`).style.width = `${v}%`;
      };
      setBar('energy', state.energy);
      setBar('morale', state.morale);
      setBar('social', state.social ?? 84);
      setBar('patience', state.patience);

      const condVal = clamp(Math.round(state.labCondition ?? state.safety ?? 95), 0, 100);
      if (el('val-condition')) {
        el('val-condition').textContent = `${condVal}`;
        el('val-condition').style.color = condVal < 40 ? '#fca5a5' : '';
      }
      if (el('bar-condition')) {
        el('bar-condition').style.width = `${condVal}%`;
        el('bar-condition').style.background = condVal < 40 ? '#ef4444' : '#3b82f6';
      }

      if (el('lbl-energy-tag')) {
        el('lbl-energy-tag').textContent = state.preferences?.requiresCaffeine ? 'Caffeine' : '';
      }
      if (el('lbl-morale-pref')) {
        const pref = state.preferences?.pref || 'balanced';
        const prefMap = { coffee: 'Coffee', tea: 'Tea', gaming: 'Gaming' };
        el('lbl-morale-pref').textContent = prefMap[pref] || '';
      }

      const camp = window.KLB.getCampaign(state.player.id);
      const msTitleEl = el('lbl-manuscript-title');
      if (msTitleEl) {
        msTitleEl.textContent = 'Manuscript Draft';
        if (camp?.manuscriptTopic) {
          msTitleEl.title = camp.manuscriptTopic;
        } else {
          msTitleEl.removeAttribute('title');
        }
      }

      renderWeeklyDeliverables();
      el('favours-readout').textContent = `${state.favours} Favour${state.favours === 1 ? '' : 's'}`;

      const waSel = el('select-wa-action');
      const rescueOpt = waSel?.querySelector('option[value="rescue"]');
      if (rescueOpt) {
        rescueOpt.textContent = (Number(state.favours) || 0) >= 1
          ? 'Ask Nafsika to fridge reaction (1 Favour)'
          : 'Ask Nafsika to fridge reaction (Requires 1 Favour)';
      }
    } else {
      el('favours-readout').textContent = `Week ${state.weekNum}`;
      const chuds = getPlayableIds().map(id => state.npcs[id]).filter(Boolean);
      const totalSteps = chuds.reduce((s, n) => s + (n.sim?.completedSteps?.length || 0), 0);
      const avgMs = Math.round(chuds.reduce((s, n) => s + (n.sim?.manuscriptProgress || 0), 0) / Math.max(1, chuds.length));
      const inLab = chuds.filter(n => n.roomId !== 'offsite').length;
      const cqText = window.KLB.Sim.isCoffeeQuartetWindow(state) ? " | Coffee Quartet at Gordon's" : '';
      el('spectator-stats-line').textContent = `${inLab}/${chuds.length} on campus | ${totalSteps}/${chuds.length * 5} steps done | Avg Manuscript ${avgMs}%${cqText}`;
    }

    renderTaskPanel(force);
    renderEquipmentTimers(force);

    const lbTabLbl = el('tab-lbl-labbook');
    if (lbTabLbl) {
      if (state.spectatorMode) {
        lbTabLbl.textContent = 'Roster';
      } else {
        const figN = (state.labBook || []).length;
        lbTabLbl.textContent = figN > 0 ? `Lab Book (${figN})` : 'Lab Book';
      }
    }

    const waList = state.whatsapp || [];
    const latestMsg = waList[waList.length - 1];
    const latestId = latestMsg ? latestMsg.id : 'empty';
    if (latestId !== lastWaMsgId || waList.length !== lastWaCount) {
      if (lastWaMsgId !== null && currentTab !== 'whatsapp') {
        let newMsgs = [];
        const prevIdx = waList.findIndex(m => m.id === lastWaMsgId);
        if (prevIdx >= 0) {
          newMsgs = waList.slice(prevIdx + 1);
        } else if (waList.length > lastWaCount) {
          newMsgs = waList.slice(lastWaCount);
        } else {
          newMsgs = waList;
        }
        const newNonSelfCount = newMsgs.filter(m => !m.isSelf).length;
        unreadWaCount += newNonSelfCount;
      }
      const feed = el('wa-feed');
      const nearBottom = feed ? (feed.scrollHeight - feed.scrollTop - feed.clientHeight) <= 48 : true;
      const canAppend = Boolean(
        feed &&
        lastWaMsgId !== null &&
        lastWaCount > 0 &&
        waList.length > lastWaCount &&
        feed.childElementCount === lastWaCount &&
        waList[lastWaCount - 1]?.id === lastWaMsgId
      );
      const msgsToRender = canAppend ? waList.slice(lastWaCount) : waList;
      const addedSelf = msgsToRender.some(m => m.isSelf);
      if (feed) {
        const frag = document.createDocumentFragment();
        for (const m of msgsToRender) {
          const row = document.createElement('div');
          row.className = `wa-msg${m.isSelf ? ' self' : ''}`;
          row.innerHTML = `
            <img class="wa-avatar pixel-art" src="assets/portraits/${escHtml(m.senderId)}.png" onerror="this.style.display='none'" alt="" />
            <div class="wa-bubble">
              <div class="wa-meta">
                <span style="color:${escHtml(m.color)}">${escHtml(m.senderName)}</span>
                <span class="wa-time">${escHtml(m.timeStr)}</span>
              </div>
              <div>${escHtml(m.text)}</div>
            </div>
          `;
          frag.appendChild(row);
        }
        if (!canAppend) {
          feed.textContent = '';
        }
        feed.appendChild(frag);
        if (!canAppend || nearBottom || force || addedSelf) {
          feed.scrollTop = feed.scrollHeight;
        }
      }
      lastWaMsgId = latestId;
      lastWaCount = waList.length;
    }

    const unreadEl = el('wa-unread-count');
    if (currentTab === 'whatsapp') unreadWaCount = 0;
    unreadEl.textContent = String(unreadWaCount);
    unreadEl.classList.toggle('hidden', unreadWaCount <= 0);

    if (force || currentTab === 'labbook') renderLabBookPane(force);
    if (force || currentTab === 'archive') renderArchivePane(force);
  }

  function renderLabBookPane(force = false) {
    const pane = el('labbook-scroll');
    if (!pane || el('pane-labbook').classList.contains('hidden')) return;

    if (state.spectatorMode) {
      const neighbourIds = ['nafsika_forte', 'marco_sabatini', 'charlotte_coomber', 'vijay_chudasama', 'jamie_baker'];
      const seenIds = new Set();
      const rosterIds = getPlayableIds().concat(neighbourIds).filter(id => {
        if (!id || seenIds.has(id)) return false;
        seenIds.add(id);
        return true;
      });
      const roster = rosterIds.map(id => ({ meta: window.KLB.CAST_BY_ID?.[id], npc: state.npcs?.[id] })).filter(x => x.meta && x.npc);
      const sig = `spec:${state.weekNum}:${specFollowNpcId || ''}:` + roster.map(x => `${x.npc.roomId}:${x.npc.currentTaskText || ''}:${x.npc.sim?.completedSteps?.length || ''}:${Math.round(x.npc.sim?.manuscriptProgress || 0)}:${Math.round(x.npc.sim?.weeklyReportProgress || 0)}:${Math.round(x.npc.sim?.energy || 0)}:${x.npc.sim?.auditResult?.total || ''}`).join('|');
      if (sig === lastLabBookSig) return;
      lastLabBookSig = sig;
      const prevScrollTop = pane.scrollTop;

      const isMounted = pane.dataset.specRosterWeek === String(state.weekNum) && Boolean(pane.querySelector('[data-spec-npc]'));
      if (!isMounted) {
        pane.dataset.specRosterWeek = String(state.weekNum);
        pane.innerHTML = `
          <div class="sec-hdr"><h4>Autonomous Campus Roster</h4><span class="mono-muted">Click to Follow | Week ${state.weekNum}</span></div>
          <ol class="step-list">
            ${roster.map(({ meta, npc }) => {
              const s = npc.sim || null;
              const hasCampaignSim = Boolean(meta.playable && s && Array.isArray(s.completedSteps));
              const auditTxt = hasCampaignSim && s.auditResult ? ` | Audit: ${s.auditResult.total.toFixed(1)}/10 (${s.auditResult.passed ? 'Pass' : 'Fail'})` : '';
              const isFollowing = specFollowNpcId === npc.id;
              const isOffsite = !npc.roomId || npc.roomId === 'offsite';
              const roomLbl = isOffsite ? 'Offsite' : (window.KLB.ROOM_META[npc.roomId]?.shortName || npc.roomId);
              const roleShort = (meta.role?.split('•')[1] || meta.role || 'Campus Staff').trim();
              const statsLine = hasCampaignSim
                ? `Steps: ${s.completedSteps.length}/5 | WR: ${Math.round(s.weeklyReportProgress || 0)}% | Ms: ${Math.round(s.manuscriptProgress || 0)}% | E: ${Math.round(s.energy ?? 80)} S: ${Math.round(s.social ?? 84)}${auditTxt}`
                : roleShort;
              return `
                <li class="step-item spec-roster-card clickable ${hasCampaignSim && s.auditResult?.passed ? 'done' : ''} ${isFollowing ? 'following' : ''}" data-spec-npc="${escHtml(npc.id)}" tabindex="0" role="button" title="Click to follow ${escHtml(meta.shortName)}">
                  <div style="flex:1;min-width:0;">
                    <div style="display:flex;align-items:center;justify-content:space-between;gap:6px;">
                      <span data-spec-name="${escHtml(npc.id)}">${escHtml(meta.name)} (${escHtml(roomLbl)})</span>
                      <span class="klb-tag info${isFollowing ? '' : ' hidden'}" data-spec-follow="${escHtml(npc.id)}">${icon('eye', 11)}<span>Following</span></span>
                    </div>
                    <div class="mono-muted" data-spec-task="${escHtml(npc.id)}" style="font-size:10.5px;">${escHtml(npc.currentTaskText || (isOffsite ? 'Offsite' : 'On campus'))}</div>
                    <div class="mono-muted" data-spec-stats="${escHtml(npc.id)}" style="font-size:10.5px;">${escHtml(statsLine)}</div>
                  </div>
                </li>
              `;
            }).join('')}
          </ol>
        `;

        pane.querySelectorAll('[data-spec-npc]').forEach(cardEl => {
          cardEl.onclick = () => {
            const nid = cardEl.dataset.specNpc;
            const npc = state.npcs?.[nid];
            const meta = window.KLB.CAST_BY_ID?.[nid];
            if (!npc) return;
            if (window.KLB.Audio?.playSfx) window.KLB.Audio.playSfx('ui_click');
            specFollowNpcId = nid;
            if (npc.roomId && npc.roomId !== 'offsite' && window.KLB.WORLD_MAPS?.rooms?.[npc.roomId]) {
              state.cameraRoomId = npc.roomId;
              specCameraPos = { x: npc.x, y: npc.y };
              if (window.KLB.Sim?.syncVisibleReactionsCache) {
                window.KLB.Sim.syncVisibleReactionsCache(state);
              }
              syncAudioAmbience();
            } else {
              showAlertBanner(`${meta?.shortName || nid} is currently offsite — camera will follow once on campus.`, 3000, false);
            }
            syncSpecFollowBadge();
            syncAllHUD(true);
          };
        });
      } else {
        for (const { meta, npc } of roster) {
          const cardEl = pane.querySelector(`[data-spec-npc="${npc.id}"]`);
          if (!cardEl) continue;
          const s = npc.sim || null;
          const hasCampaignSim = Boolean(meta.playable && s && Array.isArray(s.completedSteps));
          const auditTxt = hasCampaignSim && s.auditResult ? ` | Audit: ${s.auditResult.total.toFixed(1)}/10 (${s.auditResult.passed ? 'Pass' : 'Fail'})` : '';
          const isFollowing = specFollowNpcId === npc.id;
          const isOffsite = !npc.roomId || npc.roomId === 'offsite';
          const roomLbl = isOffsite ? 'Offsite' : (window.KLB.ROOM_META[npc.roomId]?.shortName || npc.roomId);
          const roleShort = (meta.role?.split('•')[1] || meta.role || 'Campus Staff').trim();
          const statsLine = hasCampaignSim
            ? `Steps: ${s.completedSteps.length}/5 | WR: ${Math.round(s.weeklyReportProgress || 0)}% | Ms: ${Math.round(s.manuscriptProgress || 0)}% | E: ${Math.round(s.energy ?? 80)} S: ${Math.round(s.social ?? 84)}${auditTxt}`
            : roleShort;
          cardEl.classList.toggle('done', Boolean(hasCampaignSim && s.auditResult?.passed));
          cardEl.classList.toggle('following', isFollowing);
          const nameEl = cardEl.querySelector(`[data-spec-name="${npc.id}"]`);
          if (nameEl) nameEl.textContent = `${meta.name} (${roomLbl})`;
          const followEl = cardEl.querySelector(`[data-spec-follow="${npc.id}"]`);
          if (followEl) followEl.classList.toggle('hidden', !isFollowing);
          const taskEl = cardEl.querySelector(`[data-spec-task="${npc.id}"]`);
          if (taskEl) taskEl.textContent = npc.currentTaskText || (isOffsite ? 'Offsite' : 'On campus');
          const statsEl = cardEl.querySelector(`[data-spec-stats="${npc.id}"]`);
          if (statsEl) statsEl.textContent = statsLine;
        }
      }

      pane.scrollTop = prevScrollTop;
      return;
    }

    delete pane.dataset.specRosterWeek;
    const camp = window.KLB.getCampaign(state.player.id);
    const sig = `${state.player.id}:${state.campaignStepIdx}:${state.completedSteps.join(',')}:${state.favours}:${state.labBook.map(f => `${f.id}:${Math.round(f.quality || 0)}`).join(',')}`;
    if (sig === lastLabBookSig) return;
    lastLabBookSig = sig;
    const prevScrollTop = pane.scrollTop;

    const stepsHtml = (camp?.steps || []).map((s, idx) => {
      const done = state.completedSteps.includes(idx);
      const cur = idx === state.campaignStepIdx && !done;
      const stIcon = done ? 'check-circle' : cur ? 'arrow-right' : 'clock';
      return `
        <li class="step-item ${done ? 'done' : cur ? 'current' : ''}">
          <span class="icon-inline">${icon(stIcon, 14)}</span>
          <div>
            <div>${escHtml(s.title)}</div>
            <div class="mono-muted" style="font-size:10.5px;">${escHtml((s.stationTypes || []).join(', '))} | ${escHtml(window.KLB.ROOM_META[s.locationRoom]?.shortName || s.locationRoom)}</div>
          </div>
        </li>
      `;
    }).join('');

    const figsOptions = state.labBook.length
      ? state.labBook.map(f => {
          const yPart = f.yieldPct != null ? ` / ${Math.round(f.yieldPct)}%Y` : '';
          const flawTag = isFigureFlawed(f) ? ' [Flawed]' : '';
          return `<option value="${escHtml(f.id)}">[${escHtml(f.type.toUpperCase())}] ${Math.round(f.quality)}%Q${yPart}${flawTag} — ${escHtml(f.label)}</option>`;
        }).join('')
      : `<option value="">No spectra or gels recorded yet</option>`;

    const flawedFigs = (state.labBook || []).filter(isFigureFlawed);
    const hasTwoFavours = (Number(state.favours) || 0) >= 2;
    const repurifyCardsHtml = flawedFigs.length ? `
      <div class="sec-hdr" style="margin-top:4px;"><h4>Flawed Figures (${flawedFigs.length})</h4><span class="mono-muted">Clean to 90%Q</span></div>
      <div style="display:flex;flex-direction:column;gap:5px;">
        ${flawedFigs.map(f => `
          <div class="step-item" style="justify-content:space-between;align-items:center;gap:6px;">
            <div style="min-width:0;overflow:hidden;">
              <div style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-size:11.5px;">${escHtml(f.label)}</div>
              <div class="mono-muted" style="font-size:10px;color:#fcd34d;">${Math.round(f.quality || 0)}% Quality — needs re-purification</div>
            </div>
            <button type="button" class="hud-btn" data-repurify-id="${escHtml(f.id)}" ${hasTwoFavours ? '' : 'disabled'} title="${hasTwoFavours ? 'Spend 2 Favours (15m) to clean this figure to 90% quality' : 'Requires 2 Favours (15m) to re-purify this figure'}">
              ${icon('sparkles', 12)}<span>${hasTwoFavours ? 'Re-Purify (2F, 15m)' : 'Needs 2F'}</span>
            </button>
          </div>
        `).join('')}
      </div>
    ` : '';

    pane.innerHTML = `
      <div class="sec-hdr"><h4>5-Day Campaign Steps</h4><span class="mono-muted">${state.completedSteps.length}/5</span></div>
      <ol class="step-list">${stepsHtml}</ol>
      <div class="sec-hdr" style="margin-top:4px;"><h4>Saved Spectra &amp; Gels (${state.labBook.length})</h4></div>
      <div class="labbook-controls">
        <select id="select-labbook-fig" class="ui-select compact" aria-label="Select Lab Book Figure">${figsOptions}</select>
        <button id="btn-inspect-fig" class="hud-btn" ${state.labBook.length ? '' : 'disabled title="Record a spectrum or gel first"'}>Inspect</button>
      </div>
      ${repurifyCardsHtml}
      <button id="lb-open-slides" class="rpg-btn primary" style="justify-content:center;">${icon('presentation', 14)}<span>Open 4-Slide Builder</span></button>
    `;

    el('lb-open-slides').onclick = () => openSlideBuilderOverlay();
    el('btn-inspect-fig').onclick = () => {
      const fid = el('select-labbook-fig')?.value;
      const item = state.labBook.find(x => x.id === fid);
      if (item) openSpectrumPreviewModal(item, false);
    };
    pane.querySelectorAll('[data-repurify-id]').forEach(btn => {
      btn.onclick = () => {
        const fig = state.labBook.find(x => x.id === btn.dataset.repurifyId);
        if (fig) startRepurifyFigureAction(fig);
      };
    });
    pane.scrollTop = prevScrollTop;
  }

  function renderArchivePane(force = false) {
    const pane = el('archive-scroll');
    if (!pane || el('pane-archive').classList.contains('hidden')) return;
    if (!archive) archive = window.KLB.Sim.loadArchive();
    const cleared = Object.entries(archive.clearedChars || {});
    const discoveredMap = archive.discoveredEvents || {};
    const discoveredIds = Object.keys(discoveredMap).sort();
    const totalEvents = (window.KLB.RANDOM_EVENTS || []).length || 32;
    const sig = `${archive.totalRuns}:${archive.bestScore}:${cleared.map(([k, v]) => `${k}:${v}`).join(',')}:${discoveredIds.map(k => `${k}:${discoveredMap[k]}`).join(',')}`;
    if (sig === lastArchiveSig) return;
    lastArchiveSig = sig;
    const prevScrollTop = pane.scrollTop;

    const eventById = {};
    (window.KLB.RANDOM_EVENTS || []).forEach(ev => {
      if (ev && ev.id) eventById[ev.id] = ev;
    });
    const eventsHtml = discoveredIds.length
      ? discoveredIds.map(evId => {
          const ev = eventById[evId];
          const title = ev?.title || evId.replace(/_/g, ' ').replace(/\b\w/g, ch => ch.toUpperCase());
          const cat = ev?.category ? ev.category.toUpperCase() : 'EVENT';
          const count = Number(discoveredMap[evId]) || 1;
          return `
            <li class="archive-event-row">
              <span class="archive-event-title" title="${escHtml(title)}">${escHtml(title)}</span>
              <span class="archive-event-meta">${escHtml(cat)}${count > 1 ? ` x${count}` : ''}</span>
            </li>
          `;
        }).join('')
      : `<li class="archive-event-row undiscovered"><span class="archive-event-title">No random lab events logged yet</span><span class="archive-event-meta">0/${totalEvents}</span></li>`;

    const playables = getPlayableCast();
    pane.innerHTML = `
      <section class="dossier-card">
        <h4>${icon('award', 13)}<span>KLB Archive Summary</span></h4>
        <p class="mono-muted">Runs: ${archive.totalRuns || 0} | Best Audit: ${(archive.bestScore || 0).toFixed(1)}/10 | Events: ${discoveredIds.length}/${totalEvents}</p>
      </section>
      <div class="sec-hdr"><h4>Researcher Clearance (${cleared.length}/${playables.length})</h4></div>
      <ol class="step-list">
        ${playables.map(c => {
          const sc = archive.clearedChars?.[c.id];
          return `<li class="step-item ${sc !== undefined ? 'done' : ''}" style="justify-content:space-between;">
            <span>${escHtml(c.name)}</span>
            <span class="mono-muted" style="color:${sc !== undefined ? '#86efac' : '#94a3b8'};">${sc !== undefined ? `${sc.toFixed(1)}/10` : 'Pending'}</span>
          </li>`;
        }).join('')}
      </ol>
      <div class="sec-hdr" style="margin-top:6px;"><h4>Discovered Lab Events (${discoveredIds.length}/${totalEvents})</h4></div>
      <ul id="archive-events-list">${eventsHtml}</ul>
    `;
    pane.scrollTop = prevScrollTop;
  }

  // ==================== 10. WAYFINDING, EVENT BINDINGS & MASTER 60 FPS LOOP ====================
  function computeWayfindingTargets() {
    if (!state || state.spectatorMode) return [];
    const roomId = state.player.roomId;
    const rm = window.KLB.WORLD_MAPS.rooms[roomId];
    if (!rm) return [];

    const targets = [];
    const seen = new Set();
    const pushTarget = (obj, kind = 'quest', labelOverride = null) => {
      if (!obj || !obj.id || seen.has(obj.id)) return;
      seen.add(obj.id);
      targets.push({
        id: obj.id,
        label: labelOverride || obj.label || niceStationName(obj.type),
        kind
      });
    };

    if (state.fireAlarm.active) {
      if (roomId === 'klb_2f') return [];
      if (roomId === 'klb_3f') {
        const st = rm.objects.find(o => o.type === 'spiral_stairs');
        if (st) pushTarget(st, 'evac', 'Spiral Stairs');
        return targets;
      }
    }

    if (roomId === 'meeting_room' && state.dayIdx === 4 && !state.fridayFinalAuditDone) {
      const morningWindow = !state.fridayAuditDone && state.timeMins <= 585;
      const canWrapWeek = state.timeMins >= 16 * 60 || ((state.manuscriptProgress || 0) >= 100 && (state.completedSteps || []).length >= 5);
      if (morningWindow || canWrapWeek) {
        const proj = rm.objects.find(o => o.type === 'projector');
        if (proj) pushTarget(proj, 'quest');
      }
    }

    const curStep = getCurrentCampaignStep();
    const curSub = getCurrentSubTask(curStep);

    // 1) Highlight any finished/sweet/overcooked job in this room that needs immediate action
    const actionableJob = (state.activeStationJobs || []).find(j => {
      if (j.roomId !== roomId) return false;
      if (j.status === 'sweet' || j.status === 'overcooked') return true;
      if (j.status === 'ready') {
        const step = window.KLB.getCampaign(state.player.id)?.steps?.[j.stepIdx];
        const nextSub = step?.subTasks?.[j.subTaskIdx + 1];
        return !(nextSub && nextSub.requiresJobFromPrev);
      }
      return false;
    });
    if (actionableJob) {
      const jobObj = rm.objects.find(o => o.id === actionableJob.objId) || { id: actionableJob.objId, type: actionableJob.stationType, label: actionableJob.label };
      pushTarget(jobObj, actionableJob.status === 'overcooked' ? 'evac' : 'prep');
    }

    // 2) Highlight current sub-task station (or room portal)
    if (curSub && !targets.length) {
      if (curSub.roomId === roomId) {
        const bestStation = pickPreferredStation(rm, roomId, o => {
          if (!matchesSubTaskStation(o, curSub)) return false;
          if (curSub.cupboardHint && o.type === 'chem_cupboard') {
            return matchesCupboardHint(o.label || '', curSub.cupboardHint);
          }
          return true;
        });
        if (bestStation) pushTarget(bestStation, 'quest');
      } else if (roomId === 'klb_2f' && curSub.roomId === 'klb_3f') {
        const st = rm.objects.find(o => o.type === 'spiral_stairs');
        if (st) pushTarget(st, 'quest', 'Spiral Stairs');
      } else if (roomId === 'klb_3f' && curSub.roomId === 'klb_2f') {
        const st = rm.objects.find(o => o.type === 'spiral_stairs');
        if (st) pushTarget(st, 'quest', 'Spiral Stairs');
      } else {
        const ex = rm.objects.find(o => o.type === 'exit_stairs');
        if (ex) pushTarget(ex, 'quest', 'Exit Door');
      }
    }
    return targets;
  }

  function setActiveDeckTab(tabName, opts = {}) {
    if (!tabName) return;
    currentTab = tabName;
    document.querySelectorAll('.deck-tab').forEach(t => {
      const isMatch = t.dataset.tab === tabName;
      t.classList.toggle('active', isMatch);
      t.setAttribute('aria-selected', isMatch ? 'true' : 'false');
    });
    ['whatsapp', 'labbook', 'archive'].forEach(p => {
      el(`pane-${p}`)?.classList.toggle('hidden', p !== currentTab);
    });
    if (currentTab === 'whatsapp') {
      unreadWaCount = 0;
      const feed = el('wa-feed');
      if (feed) feed.scrollTop = feed.scrollHeight;
    } else if (currentTab === 'archive' && window.KLB.Sim?.loadArchive) {
      archive = window.KLB.Sim.loadArchive();
    }
    if (!opts.silent && window.KLB.Audio?.playSfx) {
      window.KLB.Audio.playSfx('slide_click');
    }
    if (state) syncAllHUD(true);
  }

  function bindGlobalEvents() {
    el('select-mutator').onchange = () => {
      selectedMutator = el('select-mutator').value || 'none';
      if (window.KLB.Audio) window.KLB.Audio.playSfx('interact');
    };
    el('btn-spectator-mode').onclick = () => startNewRun('spectator', true);

    document.addEventListener('keydown', e => {
      if (e.key !== 'Enter' && e.key !== ' ' && e.code !== 'Space') return;
      const target = e.target;
      if (!target || ['BUTTON', 'A', 'INPUT', 'SELECT', 'TEXTAREA'].includes(target.tagName) || target.isContentEditable) return;
      const roleBtn = target.closest?.('[role="button"]');
      if (!roleBtn || roleBtn.getAttribute('aria-disabled') === 'true') return;
      e.preventDefault();
      roleBtn.click();
    });

    window.addEventListener('keydown', e => {
      const modalOpen = !el('modal-backdrop').classList.contains('hidden');
      const activeTag = document.activeElement?.tagName;
      const titleVisible = !el('title-screen').classList.contains('hidden');

      if (modalOpen && e.key === 'Tab') {
        const modalBox = el('modal-box');
        if (modalBox) {
          const focusables = Array.from(modalBox.querySelectorAll(
            'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"]):not([disabled])'
          )).filter(node => node.offsetParent !== null || node === document.activeElement);
          if (focusables.length > 0) {
            const first = focusables[0];
            const last = focusables[focusables.length - 1];
            if (e.shiftKey) {
              if (document.activeElement === first || !modalBox.contains(document.activeElement)) {
                e.preventDefault();
                last.focus();
              }
            } else if (document.activeElement === last || !modalBox.contains(document.activeElement)) {
              e.preventDefault();
              first.focus();
            }
          } else {
            e.preventDefault();
          }
        }
        return;
      }

      if (titleVisible && !modalOpen && (e.code === 'Enter' || e.code === 'NumpadEnter')) {
        if (!['INPUT', 'TEXTAREA', 'SELECT', 'BUTTON', 'A'].includes(activeTag) && !document.activeElement?.isContentEditable) {
          e.preventDefault();
          el('btn-launch-campaign')?.click();
        }
        return;
      }

      if (e.code === 'Escape') {
        if (modalOpen) {
          if (modalDismissable && modalEscapeHandler) modalEscapeHandler();
        } else {
          const dlgOpen = !el('rpg-dialogue-box').classList.contains('hidden');
          if (dlgOpen) {
            closeDialogue();
          } else if (state && !titleVisible && !state.gameOver && !state.victory) {
            openPauseMenuModal();
          }
        }
        return;
      }

      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(activeTag) || document.activeElement?.isContentEditable) return;

      if (e.code === 'KeyM') {
        e.preventDefault();
        toggleMute();
        return;
      }

      if (/^Digit[1-9]$/.test(e.code)) {
        const idx = e.code.replace('Digit', '');
        const dlgOpen = !el('rpg-dialogue-box').classList.contains('hidden');
        const scope = modalOpen ? el('modal-box') : (dlgOpen ? el('rpg-actions') : null);
        const btn = scope?.querySelector(`[data-hotkey="${idx}"]`);
        if (btn && !btn.disabled) { e.preventDefault(); btn.click(); return; }
        if (state?.spectatorMode && !modalOpen && !dlgOpen && el('title-screen').classList.contains('hidden') && /^Digit[1-3]$/.test(e.code)) {
          const speedBtns = Array.from(document.querySelectorAll('#spec-speed-group .spec-speed-btn'));
          const speedBtn = speedBtns[Number(idx) - 1];
          if (speedBtn && !speedBtn.disabled) {
            e.preventDefault();
            speedBtn.click();
            return;
          }
        }
      }

      if (modalOpen && e.code === 'KeyC') {
        const btnC = el('modal-box')?.querySelector('[data-hotkey="c"]');
        if (btnC && !btnC.disabled) { e.preventDefault(); btnC.click(); return; }
      }

      keysDown.add(e.code);
      if (window.KLB.Audio) window.KLB.Audio.init();

      if (!state || !el('title-screen').classList.contains('hidden')) return;

      if (e.code === 'Space' && !modalOpen) {
        const ae = document.activeElement;
        if (ae && (ae.tagName === 'BUTTON' || ae.getAttribute?.('role') === 'button')) return;
        e.preventDefault();
        togglePause();
        return;
      }

      if (modalOpen) return;

      if (e.code === 'KeyE') {
        e.preventDefault();
        triggerInteract();
      } else if (e.code === 'KeyG') toggleSpecs();
      else if (e.code === 'KeyH') toggleHeadphones();
    });

    window.addEventListener('keyup', e => keysDown.delete(e.code));
    window.addEventListener('blur', () => {
      keysDown.clear();
      specDrag = null;
      el('world-canvas')?.classList.remove('spec-dragging');
    });
    window.addEventListener('beforeunload', () => {
      window.KLB.Sim?.flushDialogueHistory?.();
      if (state && !state.spectatorMode && !state.gameOver && !state.postAuditCelebration) {
        saveActiveRunSnapshot(true);
      }
    });
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        window.KLB.Sim?.flushDialogueHistory?.();
        if (state && !state.spectatorMode && !state.gameOver && !state.postAuditCelebration) {
          saveActiveRunSnapshot(true);
        }
      }
    });

    el('btn-pause-toggle').onclick = togglePause;
    el('btn-toggle-specs').onclick = toggleSpecs;
    el('btn-toggle-headphones').onclick = toggleHeadphones;
    el('btn-new-run').onclick = () => openPauseMenuModal();

    if (el('row-slide-deck')) {
      el('row-slide-deck').onclick = () => {
        if (!state || state.spectatorMode || state.gameOver) return;
        if (!el('modal-backdrop').classList.contains('hidden')) return;
        openSlideBuilderOverlay();
      };
    }

    document.querySelectorAll('.spec-speed-btn').forEach(btn => {
      btn.onclick = () => {
        const sp = Number(btn.dataset.speed) || 1;
        specSpeed = [1, 2, 3, 4].includes(sp) ? sp : 1;
        if (window.KLB.Audio?.playSfx) window.KLB.Audio.playSfx('ui_click');
        syncSpecSpeedUI();
      };
    });

    el('btn-mute').onclick = toggleMute;

    el('select-zoom').onchange = () => {
      const raw = el('select-zoom').value;
      cameraZoom = raw === 'fit' ? 'fit' : (Number(raw) || 1.0);
      if (state) state.cameraZoom = cameraZoom;
    };

    if (el('select-travel')) {
      el('select-travel').onchange = () => {
        if (!state || !state.spectatorMode) return;
        const rawVal = el('select-travel').value || '';
        const targetId = rawVal.replace(/^room:/, '');
        if (targetId && window.KLB.WORLD_MAPS?.rooms?.[targetId]) {
          state.cameraRoomId = targetId;
          specFollowNpcId = null;
          specCameraPos = null;
          specDrag = null;
          el('world-canvas')?.classList.remove('spec-dragging');
          syncSpecFollowBadge();
          if (window.KLB.Sim?.syncVisibleReactionsCache) {
            window.KLB.Sim.syncVisibleReactionsCache(state);
          }
          syncAudioAmbience();
          syncAllHUD(true);
        }
      };
    }

    const deckTabs = Array.from(document.querySelectorAll('.deck-tab'));
    deckTabs.forEach((tab, idx) => {
      tab.onclick = () => setActiveDeckTab(tab.dataset.tab);
      tab.addEventListener('keydown', ev => {
        if (ev.key !== 'ArrowLeft' && ev.key !== 'ArrowRight') return;
        ev.preventDefault();
        ev.stopPropagation();
        const nextIdx = ev.key === 'ArrowRight'
          ? (idx + 1) % deckTabs.length
          : (idx - 1 + deckTabs.length) % deckTabs.length;
        const nextTab = deckTabs[nextIdx];
        if (nextTab) {
          setActiveDeckTab(nextTab.dataset.tab);
          nextTab.focus();
        }
      });
    });

    el('btn-wa-send').onclick = () => {
      if (!state) return;
      if (state.paused || state.isPaused) {
        showAlertBanner('Resume the simulation before sending WhatsApp messages.', 2600, false);
        return;
      }
      if (state.fireAlarm?.active && !state.spectatorMode) {
        showAlertBanner('Fire alarm active — evacuate KLB first!', 3000, true);
        return;
      }
      const sup = getSupervisorMeta();
      const act = el('select-wa-action').value;
      const sender = state.spectatorMode ? 'daniel_richards' : state.player.id;
      if (act === 'ask') {
        const weekOffset = ((Number(state.weekNum) || 1) - 1) * 7 * 1440;
        const nowMono = typeof state.totalElapsedMins === 'number'
          ? state.totalElapsedMins
          : (weekOffset + (state.dayIdx || 0) * 1440 + (state.timeMins || 0));
        if (!state.spectatorMode && state._lastWaAskTotalMins != null && (nowMono - state._lastWaAskTotalMins) < 30) {
          const rem = Math.max(1, Math.ceil(30 - (nowMono - state._lastWaAskTotalMins)));
          showAlertBanner(`${sup.askCmd} is on cooldown (${rem}m left).`, 2800, false);
          return;
        }
        const startDayIdx = state.dayIdx;
        if (!state.spectatorMode) {
          window.KLB.Sim.spendWhatsAppMinutes(state, 10, simCallbacks());
          if (!state || state.dayIdx !== startDayIdx || state.fridayFinalAuditDone || state.gameOver) return;
        }
        state._lastWaAskTotalMins = typeof state.totalElapsedMins === 'number'
          ? state.totalElapsedMins
          : (weekOffset + (state.dayIdx || 0) * 1440 + (state.timeMins || 0));
        const camp = window.KLB.getCampaign(sender);
        const step = camp?.steps?.[state.spectatorMode ? 0 : Math.min(4, state.campaignStepIdx)];
        const rawHint = step?.choice?.askChudsHint || 'Keep glassware oven-dried, solvents anhydrous, and collect clean spectra.';
        const resolved = resolveHintWhatsAppSender(rawHint, sender);
        window.KLB.Sim.pushWhatsApp(state, sender, `${sup.askCmd} any quick tip for "${step?.title || 'Friday slides'}"?`);
        window.KLB.Sim.pushWhatsApp(state, resolved.senderId, resolved.body || rawHint);
        if (!state.spectatorMode) {
          showAlertBanner(`${resolved.speakerName} replied in ${sup.chatName} (-10m elapsed).`, 3200, false);
        }
      } else if (act === 'coffee') {
        if (state.spectatorMode) {
          state.cameraRoomId = 'gordons_cafe';
          window.KLB.Sim.pushWhatsApp(state, 'joao_nogueira', "Checking who's over at Gordon's table.");
        } else {
          window.KLB.Sim.pushWhatsApp(state, sender, "Heading over to Gordon's Café — anyone fancy a quick coffee?");
          transitionToRoom('gordons_cafe', window.KLB.ROOM_META.gordons_cafe.entrySpawn);
          openGordonsMenuModal();
        }
      } else if (act === 'poll') {
        if (state._pollToday) { showAlertBanner('Already posted a group chat joke today.', 2400, false); return; }
        state._pollToday = true;
        if (!state.spectatorMode) {
          const prevMorale = state.morale;
          window.KLB.Sim.applySocialInteraction(state, 4);
          const moraleGain = state.player.id === 'andre_shamsabadi' ? 10 : 2;
          state.morale = clamp(prevMorale + moraleGain, 0, 100);
          showAlertBanner(`Group chat joke landed (+4 Social, +${moraleGain} Morale).`, 3200, false);
        }
        window.KLB.Sim.pushWhatsApp(state, sender, "POLL: Gordon's warm panini vs microwaved baked beans in chorizo fat?");
        const pollResponder = sender === 'joao_nogueira' ? 'andre_shamsabadi' : 'joao_nogueira';
        window.KLB.Sim.pushWhatsApp(state, pollResponder, 'Anything except cold wet triangle sandwiches.');
      } else if (act === 'rescue') {
        if (state.spectatorMode) return;
        if ((Number(state.favours) || 0) < 1) {
          showAlertBanner('Nafsika fridge rescue requires 1 Favour (0 available).', 3200, true);
          syncAllHUD(true);
          return;
        }
        if (!(state.activeStationJobs || []).length) {
          showAlertBanner('No active equipment timer running.', 3200, false);
          return;
        }
        const job = (state.activeStationJobs || []).find(j => j.canOvercook);
        if (!job) {
          showAlertBanner('No quenchable reaction running to fridge (instrument runs cannot be pulled into 4 °C).', 3400, false);
          return;
        }
        addFavours(-1);
        removeStationJob(job.id);
        window.KLB.Sim.pushWhatsApp(state, state.player.id, '@Nafsika stuck offsite — can you pull my flask into the 4 °C fridge?');
        window.KLB.Sim.pushWhatsApp(state, 'nafsika_forte', 'Nafsika got it — pulled and tucked onto the 4 °C shelf for you.');
        const camp = window.KLB.getCampaign(state.player.id);
        const step = camp?.steps?.[job.stepIdx];
        const sub = step?.subTasks?.[job.subTaskIdx];
        if (step) {
          const bonusQ = job.status === 'overcooked' ? -22 : job.elapsedMins < job.targetMins * 0.5 ? -16 : 2;
          const m = calcStepMetrics(step, {
            fromJob: job,
            stationType: job.stationType,
            bonusQuality: bonusQ,
            bonusYield: Math.round(bonusQ * 0.8),
            forceFlawNote: 'Remotely quenched and refrigerated at 4 °C by Nafsika Forte.'
          });
          state.curStepPerf = m;
          const moraleDelta = window.KLB.Sim.applyExperimentOutcomeToMorale(state, m.quality, m.yieldPct);
          const isFinalSub = job.subTaskIdx >= (step.subTasks?.length || 1) - 1;
          if (sub?.viewOutput || isFinalSub) {
            const figItem = createLabBookFigure(step, job.stepIdx, m.quality, m.yieldPct, m.blueDyeMishap, m.outcomeText, sub?.viewOutput);
            state.labBook.push(figItem);
            advanceSubTaskOrFinishStep(job.stepIdx, job.subTaskIdx, true);
            openSpectrumPreviewModal(figItem, true, moraleDelta);
          } else {
            advanceSubTaskOrFinishStep(job.stepIdx, job.subTaskIdx, false);
            showAlertBanner(`Nafsika rescued ${job.label} (${m.quality}% Quality).`, 3400, false);
          }
        }
      }
      syncAllHUD(true);
    };

    const canvas = el('world-canvas');
    canvas.addEventListener('mousedown', e => {
      if (!state) return;
      const modalOpen = !el('modal-backdrop').classList.contains('hidden');
      if (state.spectatorMode) {
        if (modalOpen || e.button !== 0) return;
        if (window.KLB.Audio) window.KLB.Audio.init();
        specDrag = {
          startX: e.clientX,
          startY: e.clientY,
          lastX: e.clientX,
          lastY: e.clientY,
          moved: false
        };
        return;
      }
      if (state.paused || state.isPaused || modalOpen) return;
      if (window.KLB.Audio) window.KLB.Audio.init();
      if (!window.KLB.Renderer25D?.screenToGrid) return;

      const cell = window.KLB.Renderer25D.screenToGrid(canvas, e.clientX, e.clientY);
      if (!cell || cell.inBounds === false) return;

      const gx = cell.gx !== undefined ? cell.gx : cell.x;
      const gy = cell.gy !== undefined ? cell.gy : cell.y;
      const dx = gx - state.player.x;
      const dy = gy - state.player.y;
      const rm = window.KLB.WORLD_MAPS.rooms[state.player.roomId];
      const tileHits = rm ? rm.objects.filter(o => o.type !== 'npc_marker' && gx >= o.x && gx < o.x + o.w && gy >= o.y && gy < o.y + o.h) : [];
      const clickedObj = (cell.obj && COMPACT_BENCHTOP_EQUIP.has(cell.obj.type))
        ? cell.obj
        : (tileHits.length ? (pickPrioritizedStationHit(tileHits, getCurrentSubTask(), state.player.roomId) || cell.obj) : cell.obj);
      const objTileHits = (!tileHits.length && clickedObj && rm)
        ? rm.objects.filter(o => o.type !== 'npc_marker' && clickedObj.x >= o.x && clickedObj.x < o.x + o.w && clickedObj.y >= o.y && clickedObj.y < o.y + o.h)
        : [];
      const resolvedHits = tileHits.length ? tileHits : (objTileHits.length ? objTileHits : (clickedObj ? [clickedObj] : []));

      // Direct adjacent click on NPC
      if (cell.npc && Math.hypot(cell.npc.x - state.player.x, cell.npc.y - state.player.y) <= 2.35) {
        const ndx = cell.npc.x - state.player.x;
        const ndy = cell.npc.y - state.player.y;
        state.player.dir = Math.abs(ndx) >= Math.abs(ndy) ? (ndx < 0 ? 'W' : 'E') : (ndy < 0 ? 'N' : 'S');
        interactWithNPC(cell.npc);
        return;
      }

      // Clicking a chair in 2F, 3F, or meeting_room walks onto the chair tile and sits facing its desk/table
      if (clickedObj && clickedObj.type === 'chair' && ['klb_2f', 'klb_3f', 'meeting_room'].includes(state.player.roomId)) {
        const chairOccupied = window.KLB.Sim.isOccupiedByCharacter?.(state, state.player.roomId, clickedObj.x, clickedObj.y, state.player.id, 0.48);
        if (!chairOccupied && window.KLB.Sim.isCellWalkable(state.player.roomId, clickedObj.x, clickedObj.y, state.fireAlarm.active)) {
          if (Math.hypot(clickedObj.x - state.player.x, clickedObj.y - state.player.y) <= 0.35) {
            state.player.x = clickedObj.x;
            state.player.y = clickedObj.y;
            state.player.dir = clickedObj.dir || 'N';
            if (window.KLB.Audio?.playSfx) window.KLB.Audio.playSfx('ui_click');
            return;
          }
          const chairPath = window.KLB.Sim.findPathBFS(state.player.roomId, state.player.x, state.player.y, clickedObj.x, clickedObj.y, 65, state, state.player.id);
          if (chairPath && chairPath.length > 0) {
            if (state.activePlayerAction) cancelActivePlayerAction();
            state.player.autoPath = chairPath;
            state.player.walkTarget = { x: clickedObj.x, y: clickedObj.y };
            state.player.pendingInteract = { sitChair: clickedObj };
            if (window.KLB.Audio?.playSfx) window.KLB.Audio.playSfx('ui_click');
            if (window.KLB.Renderer25D.triggerClickRipple) {
              window.KLB.Renderer25D.triggerClickRipple(clickedObj.x, clickedObj.y, 'interact');
            }
            return;
          }
        }
      }

      // Direct adjacent click on Object
      let nearObjDist = Infinity;
      if (clickedObj && clickedObj.type !== 'npc_marker') {
        const nx = clamp(state.player.x, clickedObj.x, clickedObj.x + (clickedObj.w || 1) - 1);
        const ny = clamp(state.player.y, clickedObj.y, clickedObj.y + (clickedObj.h || 1) - 1);
        nearObjDist = Math.hypot(state.player.x - nx, state.player.y - ny);
      }
      const isAdjacentClick = (clickedObj && clickedObj.type !== 'npc_marker')
        ? nearObjDist <= 1.45
        : Math.hypot(dx, dy) <= 1.85;
      if (isAdjacentClick) {
        if (clickedObj && clickedObj.type !== 'npc_marker') {
          const cx = clickedObj.x + ((clickedObj.w || 1) - 1) * 0.5;
          const cy = clickedObj.y + ((clickedObj.h || 1) - 1) * 0.5;
          const cdx = cx - state.player.x;
          const cdy = cy - state.player.y;
          if (Math.hypot(cdx, cdy) > 0.05) {
            state.player.dir = Math.abs(cdx) >= Math.abs(cdy) ? (cdx < 0 ? 'W' : 'E') : (cdy < 0 ? 'N' : 'S');
          }
          if (window.KLB.Audio?.playSfx) window.KLB.Audio.playSfx('interact');
          interactWithObject(clickedObj, resolvedHits);
          return;
        }
        state.player.dir = Math.abs(dx) >= Math.abs(dy) ? (dx < 0 ? 'W' : 'E') : (dy < 0 ? 'N' : 'S');
        triggerInteract();
        return;
      }

      // Distant click: Click-to-Walk via BFS + Floor Ripple + Auto-Interact
      let goalX = gx;
      let goalY = gy;
      let pending = null;
      if (cell.npc) {
        const free = window.KLB.Sim.findFreeWalkableNear(state, state.player.roomId, Math.round(cell.npc.x), Math.round(cell.npc.y), state.player.id, false);
        if (free) { goalX = free.x; goalY = free.y; pending = { npcId: cell.npc.id }; }
      } else if (rm && rm.tiles[gy]?.[gx] === 8 && state.fireAlarm.active) {
        goalX = gx;
        goalY = gy;
        pending = { obj: { type: 'fire_exit_tile', x: gx, y: gy, w: 1, h: 1 } };
      } else if (clickedObj && clickedObj.type !== 'npc_marker') {
        let free = null;
        if (clickedObj.type === 'writeup_desk' || clickedObj.type === 'pc_terminal') {
          const deskChair = findDeskChair(rm, clickedObj);
          if (deskChair &&
              !window.KLB.Sim.isOccupiedByCharacter?.(state, state.player.roomId, deskChair.x, deskChair.y, state.player.id, 0.48) &&
              window.KLB.Sim.isCellWalkable(state.player.roomId, deskChair.x, deskChair.y, state.fireAlarm.active)) {
            free = { x: deskChair.x, y: deskChair.y };
          }
        }
        if (!free) {
          free = window.KLB.Sim.findFreeAdjacentWalkable(state, state.player.roomId, clickedObj, state.player.id, { x: state.player.x, y: state.player.y });
        }
        if (free) { goalX = free.x; goalY = free.y; pending = { obj: clickedObj, allHits: resolvedHits }; }
      }

      if (window.KLB.Sim.isCellWalkable(state.player.roomId, goalX, goalY, state.fireAlarm.active)) {
        const path = window.KLB.Sim.findPathBFS(state.player.roomId, state.player.x, state.player.y, goalX, goalY, 65, state, state.player.id);
        if (path && path.length > 0) {
          if (state.activePlayerAction) {
            cancelActivePlayerAction();
          }
          state.player.autoPath = path;
          state.player.walkTarget = { x: goalX, y: goalY };
          state.player.pendingInteract = pending;
          if (window.KLB.Audio?.playSfx) window.KLB.Audio.playSfx(pending ? 'interact' : 'ui_click');
          if (window.KLB.Renderer25D.triggerClickRipple) {
            window.KLB.Renderer25D.triggerClickRipple(goalX, goalY, pending ? 'interact' : 'walk');
          }
        }
      }
    });

    window.addEventListener('mousemove', e => {
      if (!specDrag) return;
      const modalOpen = !el('modal-backdrop').classList.contains('hidden');
      if (!state?.spectatorMode || modalOpen) {
        specDrag = null;
        canvas.classList.remove('spec-dragging');
        return;
      }
      const totalDist = Math.hypot(e.clientX - specDrag.startX, e.clientY - specDrag.startY);
      if (!specDrag.moved && totalDist > 4) {
        specDrag.moved = true;
        if (cameraZoom === 'fit') {
          cameraZoom = 1.0;
          syncZoomSelectUI();
        }
        if (specFollowNpcId) {
          specFollowNpcId = null;
          syncSpecFollowBadge();
          renderLabBookPane(true);
        }
        canvas.classList.add('spec-dragging');
      }
      if (specDrag.moved) {
        const viewRoom = getViewRoom();
        const rm = window.KLB.WORLD_MAPS?.rooms?.[viewRoom];
        if (rm) {
          specCameraPos = specCameraPos || getRoomCenterTile(viewRoom);
          const zoom = window.KLB.Renderer25D?.getCameraState?.()?.zoom || (Number(cameraZoom) || 1.0);
          const tileW = window.KLB.Renderer25D?.TILE_W || 36;
          const tileH = window.KLB.Renderer25D?.TILE_H || 36;
          const dx = e.clientX - specDrag.lastX;
          const dy = e.clientY - specDrag.lastY;
          specCameraPos.x = clamp(specCameraPos.x - dx / (zoom * tileW), 0, Math.max(0, rm.w - 1));
          specCameraPos.y = clamp(specCameraPos.y - dy / (zoom * tileH), 0, Math.max(0, rm.h - 1));
        }
      }
      specDrag.lastX = e.clientX;
      specDrag.lastY = e.clientY;
    });

    window.addEventListener('mouseup', e => {
      if (!specDrag) return;
      canvas.classList.remove('spec-dragging');
      const wasDrag = specDrag.moved;
      specDrag = null;
      const modalOpen = !el('modal-backdrop').classList.contains('hidden');
      if (!wasDrag && state?.spectatorMode && !modalOpen && e.button === 0 && window.KLB.Renderer25D?.screenToGrid) {
        const cell = window.KLB.Renderer25D.screenToGrid(canvas, e.clientX, e.clientY);
        if (cell?.npc) {
          specFollowNpcId = cell.npc.id;
          specCameraPos = { x: cell.npc.x, y: cell.npc.y };
          if (window.KLB.Audio?.playSfx) window.KLB.Audio.playSfx('ui_click');
          syncSpecFollowBadge();
          syncAllHUD(true);
          showAlertBanner('Following ' + (window.KLB.CAST_BY_ID?.[cell.npc.id]?.shortName || cell.npc.id) + ' — pan or click pill to release.', 2400, false);
        }
      }
    });
  }

  let hudTimer = 0;
  let fastBarTimer = 0;
  function masterLoop(now) {
    try {
      const dt = Math.min(0.08, Math.max(0.001, (now - lastFrameTs) / 1000));
      lastFrameTs = now;

      if (!el('title-screen').classList.contains('hidden')) {
        dossierAnimTimer += dt;
        drawDossierSprite();
      } else if (state) {
        if (state.spectatorMode) {
          updateSpectatorCamera(dt);
          let remDt = dt * Math.max(1, specSpeed);
          const cbs = simCallbacks();
          while (remDt > 1e-6 && state && !state.paused && !state.isPaused && !state.gameOver && !state.victory) {
            const stepDt = Math.min(0.08, remDt);
            window.KLB.Sim.tickRealTime(state, stepDt, cbs);
            remDt -= stepDt;
          }
        } else {
          updatePlayerMovement(dt);
          window.KLB.Sim.tickRealTime(state, dt, simCallbacks());
          if (!state.paused && !state.isPaused && !state.gameOver && !state.postAuditCelebration) {
            saveActiveRunSnapshot(false);
          }
        }

        const viewRoom = getViewRoom();
        const target = getFacingTarget();
        const hintText = state.spectatorMode
          ? `Observing ${window.KLB.ROOM_META[viewRoom]?.shortName || viewRoom}${specSpeed > 1 ? ` (${specSpeed}x)` : ''}`
          : target.npc
            ? `Talk: ${window.KLB.CAST_BY_ID[target.npc.id]?.shortName || target.npc.id} [E]`
            : target.obj
              ? `Use: ${target.obj.label || (target.obj.type === 'chair' ? (viewRoom === 'meeting_room' ? 'Seminar Chair' : 'Desk Chair') : niceStationName(target.obj.type))} [E]`
              : (window.KLB.ROOM_META[viewRoom]?.shortName || 'KLB');
        if (hintText !== lastHoverHintText) {
          lastHoverHintText = hintText;
          el('hud-hover-hint').textContent = hintText;
        }

        const canvas = el('world-canvas');
        if (window.KLB.Renderer25D?.render) {
          const modalOpen = !el('modal-backdrop').classList.contains('hidden');
          const isPausedNow = Boolean(state.paused || state.isPaused);
          const throttleCanvas = modalOpen && isPausedNow;
          const shouldRenderCanvas = !throttleCanvas || !lastRenderModalPaused || (now - lastCanvasRenderTs >= 66);
          lastRenderModalPaused = throttleCanvas;
          if (shouldRenderCanvas) {
            lastCanvasRenderTs = now;
            const roomJobs = state.spectatorMode ? [] : (state.activeStationJobs || []).filter(r => r.roomId === viewRoom);
            const npcActivity = Array.isArray(state.npcReactions) ? state.npcReactions : [];

            window.KLB.Renderer25D.render(canvas, {
              room: window.KLB.WORLD_MAPS.rooms[viewRoom],
              roomId: viewRoom,
              timeMins: state.timeMins,
              weather: state.weatherMode,
              paused: isPausedNow,
              modalOpen,
              fireAlarmActive: state.fireAlarm.active,
              lotrPlaying: state.lotrPlaying,
              thiolDirty: Boolean(state.prep?.thiol_dirty),
              phCalibrated: state.spectatorMode ? true : Boolean(state.prep?.ph_calibrated),
              carryingProp: getPlayerCarryingProp(),
              cameraTarget: state.spectatorMode ? specCameraPos : null,
              player: state.spectatorMode ? null : state.player,
              npcs: Object.values(state.npcs).filter(n => n.roomId === viewRoom),
              activeStationJobs: roomJobs,
              activeReactions: roomJobs,
              activePlayerAction: state.spectatorMode ? null : state.activePlayerAction,
              npcReactions: npcActivity,
              highlightedObjId: state.spectatorMode ? null : (target.obj?.id || null),
              highlightedNpcId: state.spectatorMode ? null : (target.npc?.id || null),
              walkTarget: state.spectatorMode ? null : (state.player.walkTarget || null),
              questTargetObjIds: computeWayfindingTargets(),
              cameraZoom,
              speechBubbles: state.speechBubbles.filter(b => b.roomId === viewRoom)
            });
          }
        }

        fastBarTimer += dt;
        if (fastBarTimer >= 0.10) {
          fastBarTimer = 0;
          syncProgressBarsLightweight();
        }

        hudTimer += dt;
        if (hudTimer >= 0.25) {
          hudTimer = 0;
          syncAllHUD(false);
        }
      }
    } catch (err) {
      console.error('[KLB masterLoop]', err);
    } finally {
      requestAnimationFrame(masterLoop);
    }
  }

  window.addEventListener('DOMContentLoaded', boot);
})();
