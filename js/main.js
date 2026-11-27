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
  let currentTab = 'whatsapp';
  let lastWaMsgId = null;
  let lastWaCount = 0;
  let unreadWaCount = 0;
  let lastLabBookSig = '';
  let lastArchiveSig = '';
  let lastTravelRoomSig = '';
  let lastTaskPanelSig = '';
  let lastReactionsSig = '';
  let stepSfxCooldown = 0;
  let bumpSfxCooldown = 0;
  let specSpeed = 1;
  let specFollowNpcId = null;
  let specCameraPos = null;
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
    return Math.max(lo, Math.min(hi, v));
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
      return shortN === normPrefix || fullN === normPrefix || firstN === normPrefix || (normPrefix === 'dan' && c.id === 'daniel_richards');
    });
    return {
      prefix,
      speakerId: found ? found.id : null,
      speakerName: found ? (found.shortName || found.name) : prefix,
      body: m[2].trim()
    };
  }

  function resolveHintWhatsAppSender(rawHint, playerId) {
    const parsed = parseHintSpeakerAndBody(rawHint);
    const bigChuds = window.KLB.BIG_CHUDS_IDS || (window.KLB.CAST || []).filter(c => c.playable).map(c => c.id);
    let senderId = parsed.speakerId;
    if (!senderId || !bigChuds.includes(senderId) || senderId === playerId) {
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
    syringe_pump: 'Syringe Pump'
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
    const simTotal = (Number(state.weekNum) || 1) * 10000 + (Number(state.dayIdx) || 0) * 1440 + (Number(state.timeMins) || 0);
    if (!force && Math.abs(simTotal - lastAutoSaveSimMins) < 15) return false;
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
    } else if (['fumehood', 'tcep_bench', 'lab_bench', 'heatblock', 'gel_tank', 'biotage', 'syringe_pump'].includes(stationType)) {
      window.KLB.Audio.playSfx('pipette');
    } else {
      window.KLB.Audio.playSfx('interact');
    }
  }

  function isFigureFlawed(fig) {
    if (!fig) return false;
    return (Number(fig.quality) || 0) < 80
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
    const mutKeys = Object.keys(st.mutators || {}).filter(k => st.mutators[k]);
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

    if (res && typeof res.total === 'number') {
      const b = res.breakdown || {};
      lines.push(`Friday Audit: ${res.total.toFixed(1)}/10 (${res.passed ? 'PASSED' : 'SUBOPTIMAL'})`);
      const cats = [
        ['Yield & Steps ', b.yieldScore ?? 0, 2.0],
        ['Homogeneity   ', b.homogeneityScore ?? 0, 2.0],
        ['Rigor         ', b.rigorScore ?? 0, 2.0],
        ['Manuscript    ', b.manuscriptScore ?? 0, 1.5],
        ['Slide Hygiene ', b.hygieneScore ?? 0, 1.5],
        ['Citizenship   ', b.citizenshipScore ?? 0, 1.0]
      ];
      cats.forEach(([label, val, max]) => {
        lines.push(`${label} ${makeBar(val, max)} ${Number(val).toFixed(1)}/${max.toFixed(1)}`);
      });
      const verdictPool = Array.isArray(res.vijayVerdictLines) ? res.vijayVerdictLines : [];
      const standout = verdictPool.find(l => /suboptimal|exemplary|clicker|watertight|smashed|spotless|publication-ready|brave/i.test(l))
        || verdictPool[0]
        || `Overall score: ${res.total.toFixed(1)} out of 10.`;
      lines.push(`Vijay: "${String(standout).replace(/\s+/g, ' ').trim()}"`);
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
      badge.classList.add('hidden');
      badge.innerHTML = '';
      badge.onclick = null;
      return;
    }
    const meta = window.KLB.CAST_BY_ID?.[specFollowNpcId];
    const shortName = meta?.shortName || meta?.name || specFollowNpcId;
    badge.classList.remove('hidden');
    badge.title = 'Click to stop following';
    badge.innerHTML = `${icon('eye', 12)}<span>Following: ${escHtml(shortName)}</span><span class="spec-follow-clear" aria-label="Clear follow">&times;</span>`;
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

  function prepareModalBox(modalClass = 'klb-modal', sfxName = 'modal_open') {
    const box = el('modal-box');
    if (!box) return null;
    box.classList.remove('ev-modal', 'klb-modal', 'klb-modal-sm');
    if (modalClass) box.classList.add(modalClass);
    if (sfxName && window.KLB.Audio?.playSfx) {
      window.KLB.Audio.playSfx(sfxName);
    }
    return box;
  }

  function staggerNpcExchange(roomId, speakers, turns, convoId, opts = {}) {
    if (!state) return;
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
          if (state && state.player && !state.gameOver) {
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
    syncMuteButtonUI();
    requestAnimationFrame(masterLoop);
  }

  // ==================== 1. TITLE & CHARACTER SELECT ====================
  function populateMutatorSelect() {
    const sel = el('select-mutator');
    if (!sel) return;
    const mutList = window.KLB.MUTATORS || [
      { id: 'vijays_not_in', name: '#VijaysNotIn', desc: 'No surprise bench rounds before Friday' },
      { id: 'lcms_chaos', name: '50% LC-MS Chaos', desc: 'Kersti instrument gremlins doubled' },
      { id: 'eternal_heatwave', name: '30 C May Heatwave', desc: 'Lab 230 stuck at 30 C all week' },
      { id: 'infinite_espresso', name: 'Double Espresso', desc: 'Slower Energy drain' },
      { id: 'strict_coshh', name: 'Strict COSHH Audit', desc: '2x safety inspection frequency & fines' }
    ];
    sel.innerHTML = `<option value="none">Standard KLB Week (No Modifier)</option>` +
      mutList.map(m => `<option value="${escHtml(m.id)}" title="${escHtml(m.desc || '')}">${escHtml(m.name)} — ${escHtml(m.desc || '')}</option>`).join('');
    sel.value = selectedMutator;
  }

  function buildActiveMutators() {
    const out = {};
    if (selectedMutator && selectedMutator !== 'none') out[selectedMutator] = true;
    return out;
  }

  function renderTitleScreen() {
    if (window.KLB.Audio?.stopAllAmbience) window.KLB.Audio.stopAllAmbience();
    archive = window.KLB.Sim.loadArchive();
    state = null;
    alexPursuitActive = false;
    specFollowNpcId = null;
    specCameraPos = null;
    el('title-screen').classList.remove('hidden');
    el('game-shell').classList.add('hidden');
    closeModal();
    closeDialogue();
    syncCelebrationBanner();

    const clearedCount = Object.keys(archive.clearedChars || {}).length;
    el('archive-progress-lbl').textContent = `${clearedCount} / 10 Audited`;

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
        bannerEl.classList.remove('hidden');
        bannerEl.innerHTML = `
          <div class="continue-run-info">
            <img class="pixel-art" src="assets/portraits/${escHtml(snapMeta.id)}.png" alt="${escHtml(snapMeta.name)}" style="width:40px;height:40px;border-radius:7px;border:1px solid rgba(52,211,153,0.45);flex-shrink:0;" />
            <div class="continue-run-text">
              <div><strong>Saved Shift Ready: ${escHtml(snapMeta.name)}</strong> (Week ${snap.weekNum || 1})</div>
              <div class="continue-run-meta">${escHtml(snapClock)} | Step ${snapSteps}/5 | ${escHtml(snapRoom)}</div>
            </div>
          </div>
          <div class="continue-run-actions">
            <button id="btn-continue-save" type="button" class="continue-run-resume">${icon('play', 13)}<span>Continue Saved Run</span></button>
            <button id="btn-discard-save" type="button" class="continue-run-discard">${icon('trash-2', 13)}<span>Discard Save</span></button>
          </div>
        `;
        el('btn-continue-save').onclick = () => resumeSavedRun(snap);
        el('btn-discard-save').onclick = () => {
          if (window.KLB.Audio?.playSfx) window.KLB.Audio.playSfx('ui_click');
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
    const playables = window.KLB.CAST.filter(c => c.playable);
    playables.forEach(c => {
      const card = document.createElement('button');
      card.type = 'button';
      const isSelected = c.id === selectedCharId;
      card.className = 'char-card' + (isSelected ? ' selected' : '');
      card.setAttribute('aria-pressed', isSelected ? 'true' : 'false');
      const best = archive.clearedChars?.[c.id];
      const badge = best !== undefined ? `<span class="cleared-pip">${best.toFixed(1)}/10</span>` : '';
      const roleShort = (c.role.split('•')[1] || c.role).trim();
      card.innerHTML = `
        ${badge}
        <img class="portrait pixel-art" src="assets/portraits/${c.id}.png" alt="${escHtml(c.name)}" />
        <div class="c-name">${escHtml(c.name)}</div>
        <div class="c-sub">${escHtml(roleShort)}</div>
      `;
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
    drawDossierSprite();
  }

  const spritePreviewCache = {};
  function drawDossierSprite() {
    const cv = el('dossier-sprite-canvas');
    if (!cv) return;
    const ctx = cv.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, 64, 96);
    if (!spritePreviewCache[selectedCharId]) {
      const im = new Image();
      im.src = `assets/sprites/${selectedCharId}.png`;
      spritePreviewCache[selectedCharId] = im;
    }
    const img = spritePreviewCache[selectedCharId];
    if (img.complete && img.naturalWidth > 0) {
      const dirRow = Math.floor(dossierAnimTimer / 1.6) % 4;
      const frameCol = Math.floor(dossierAnimTimer * 5) % 4;
      ctx.drawImage(img, frameCol * 64, dirRow * 96, 64, 96, 0, 0, 64, 96);
    }
  }

  function startNewRun(charId, spectator = false) {
    if (window.KLB.Audio) {
      window.KLB.Audio.init();
      window.KLB.Audio.playSfx('success');
    }
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
    state._stepPrepCredit = {};
    state._stepBiotageBonusApplied = false;
    state._stepFaizaA280Done = false;
    state._stepDanFumbleApplied = false;
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
    specSpeed = 1;
    specFollowNpcId = null;
    specCameraPos = null;
    alexPursuitActive = false;
    lastAutoSaveSimMins = -Infinity;

    el('title-screen').classList.add('hidden');
    el('game-shell').classList.remove('hidden');
    closeDialogue();
    closeModal();
    syncCelebrationBanner();
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
      showAlertBanner('Autonomous Lab Observer active — watch all 10 Big-Chuds and neighbours run KLB.', 4200, false);
    }
  }

  function resumeSavedRun(snap) {
    if (!snap || !snap.player || !window.KLB.CAST_BY_ID?.[snap.player.id]) return;
    if (window.KLB.Audio) {
      window.KLB.Audio.init();
      window.KLB.Audio.playSfx('success');
    }

    state = snap;
    state.spectatorMode = false;
    state.gameOver = false;
    state.victory = false;
    state.postAuditCelebration = false;
    state.activeStationJobs = Array.isArray(state.activeStationJobs) ? state.activeStationJobs : [];
    state.activeReactions = state.activeStationJobs;
    state.completedSteps = Array.isArray(state.completedSteps) ? state.completedSteps : [];
    state.completedSubTasks = Array.isArray(state.completedSubTasks) ? state.completedSubTasks : [];
    state.labBook = Array.isArray(state.labBook) ? state.labBook : [];
    state.whatsapp = Array.isArray(state.whatsapp) ? state.whatsapp : [];
    state.speechBubbles = Array.isArray(state.speechBubbles) ? state.speechBubbles : [];
    state.prep = state.prep || {};
    state.mutators = state.mutators || {};
    state._stepPrepCredit = state._stepPrepCredit || {};
    state.slideDeck = state.slideDeck || { ready: false, framing: 'mechanistic', fig1Id: null, fig2Id: null, honestDisclosure: true };
    state.fireAlarm = state.fireAlarm || { active: false, remainingMins: 0, elapsedMins: 0 };
    state.safetySweep = state.safetySweep || { active: false, countdownSec: 0, countdownMins: 0 };
    state.doorPls = state.doorPls || { active: false };
    state.player.autoPath = null;
    state.player.walkTarget = null;
    state.player.pendingInteract = null;
    if (!window.KLB.WORLD_MAPS?.rooms?.[state.player.roomId]) {
      state.player.roomId = 'klb_2f';
    }
    selectedCharId = state.player.id;

    const lastWa = state.whatsapp[state.whatsapp.length - 1];
    lastWaMsgId = lastWa ? lastWa.id : null;
    lastWaCount = state.whatsapp.length;
    unreadWaCount = 0;
    lastLabBookSig = '';
    lastArchiveSig = '';
    lastTravelRoomSig = '';
    lastTaskPanelSig = '';
    lastReactionsSig = '';
    specSpeed = 1;
    specFollowNpcId = null;
    specCameraPos = null;
    alexPursuitActive = false;
    lastAutoSaveSimMins = (Number(state.weekNum) || 1) * 10000 + (Number(state.dayIdx) || 0) * 1440 + (Number(state.timeMins) || 0);

    el('title-screen').classList.add('hidden');
    el('game-shell').classList.remove('hidden');
    closeDialogue();
    closeModal();
    syncCelebrationBanner();
    configureModeShell();
    setPaused(false);
    syncAudioAmbience();
    syncPauseButtonUI();
    syncMuteButtonUI();
    setActiveDeckTab('whatsapp', { silent: true });
    syncAllHUD(true);

    const meta = window.KLB.CAST_BY_ID[state.player.id];
    showAlertBanner(`Resumed ${meta.shortName}'s shift (${window.KLB.Sim.formatClock(state.dayIdx, state.timeMins)}).`, 3600, false);
  }

  function configureModeShell() {
    const isSpec = Boolean(state?.spectatorMode);
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
      el('controls-hint-text').textContent = 'WASD / Arrows: Pan Camera  |  Click Roster: Follow  |  1x/2x/4x: Speed  |  Space: Pause  |  M: Mute  |  Esc: Close';
    } else {
      el('controls-hint-text').textContent = 'WASD / Arrows / Click: Move  |  Space: Pause  |  E / Click: Interact  |  G: Specs  |  H: Headphones  |  M: Mute  |  Esc: Close';
    }
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
      window.KLB.Audio.setPaused(next);
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
    btn.classList.toggle('paused', paused);
    btn.innerHTML = `${icon(paused ? 'play' : 'pause', 14)}<span>${paused ? 'Resume' : 'Pause'}</span>`;
  }

  function simCallbacks() {
    return {
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
      },
      onSpecialEvent: (type) => {
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
    el('live-alert-banner').classList.add('hidden');
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
      window.KLB.Audio.setPaused(Boolean(state.paused || state.isPaused));
    }
  }

  // ==================== 3. PLAYER MOVEMENT, COLLISION & CLICK-TO-WALK ====================
  function cancelActivePlayerAction(silent = false) {
    if (!state || !state.activePlayerAction) return;
    const act = state.activePlayerAction;
    state.activePlayerAction = null;
    if (act.kind === 'repurify_figure' && act.favourCost) {
      state.favours = (Number(state.favours) || 0) + act.favourCost;
    }
    if (!silent) {
      if (act.kind === 'weekly_report') {
        showAlertBanner(`Paused Weekly Report (${Math.round(state.weeklyReportProgress || 0)}% saved).`, 2400, false);
      } else if (act.kind === 'manuscript_draft') {
        showAlertBanner(`Paused Manuscript Draft (${Math.round(state.manuscriptProgress || 0)}% saved).`, 2400, false);
      } else if (act.kind === 'repurify_figure') {
        showAlertBanner(`Cancelled re-purification (refunded ${act.favourCost || 2} Favours).`, 2600, false);
      } else {
        showAlertBanner(`Cancelled ${act.label || 'action'}.`, 2200, false);
      }
    }
    syncAllHUD(true);
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
      const jobMatch = hits.find(h => (state.activeStationJobs || []).some(j => j.roomId === p.roomId && j.objId === h.id));
      const subMatch = curSub ? hits.find(h => matchesSubTaskStation(h, curSub)) : null;
      const surfaces = new Set(['lab_bench', 'writeup_desk', 'meeting_table']);
      const nonSurf = hits.filter(o => !surfaces.has(o.type));
      const inHoodEquip = nonSurf.find(o => o.type === 'base_bath' || o.type === 'syringe_pump');
      hitObj = jobMatch || subMatch || inHoodEquip || nonSurf[nonSurf.length - 1] || hits[hits.length - 1] || null;

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
        }
        specCameraPos = { x: npc.x, y: npc.y };
      }
    }
  }

  function executePendingInteract(pend) {
    if (!pend || !state) return;
    if (pend.sitChair) {
      const ch = pend.sitChair;
      state.player.x = ch.x;
      state.player.y = ch.y;
      state.player.dir = ch.dir || 'N';
      if (window.KLB.Audio?.playSfx) window.KLB.Audio.playSfx('ui_click');
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
          ? '[1] Borrow Sabatini Jar (1 Favour)'
          : '[1] Borrow Sabatini Jar (Requires 1 Favour)',
        primary: hasFavour,
        disabled: !hasFavour,
        onClick: () => {
          if ((Number(state.favours) || 0) < 1) return;
          state.favours -= 1;
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
        onClick: () => {
          if ((Number(state.favours) || 0) < 1) return;
          state.favours -= 1;
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
        (state.player.id === 'antoine_maruani' && npc.id === 'vijay_chudasama')
      )
    );
    if (canGiveProtocolHint) {
      const isAntoine = npc.id === 'antoine_maruani';
      const isVijayForAntoine = state.player.id === 'antoine_maruani' && npc.id === 'vijay_chudasama';
      const hintBtnLabel = isAntoine
        ? '#AskAntoine Advice (In Person — 0m)'
        : isVijayForAntoine
          ? '#AskVijay Advice (In Person — 0m)'
          : `Ask ${meta.shortName} for protocol hint (In Person — 0m)`;
      actions.push({
        label: `[${actions.length + 1}] ${hintBtnLabel}`,
        primary: actions.length === 0,
        onClick: () => {
          const parsedChuds = parseHintSpeakerAndBody(curStep.choice?.askChudsHint);
          const parsedAntoine = parseHintSpeakerAndBody(curStep.choice?.antoineHint);
          let hintText = '';
          if (isAntoine || isVijayForAntoine) {
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
          showDialogue(npc.id, meta.name, 'Classic Max refusing to weigh TCEP. Here is 100 uL fresh pH 8.0 BBS-buffered 10 mM TCEP.', [{ label: '[1] Cheers', primary: true, onClick: closeDialogue }], true);
          syncAllHUD(true);
        }
      });
    }

    if (npc.id === 'nafsika_forte') {
      const salveUsed = Boolean(state._salveToday);
      actions.push({
        label: `[${actions.length + 1}] First Aid Salve` + (salveUsed ? ' (Used Today)' : ' (+10 Lab Condition, +8 Energy)'),
        disabled: salveUsed,
        onClick: () => {
          if (state._salveToday) return;
          state._salveToday = true;
          window.KLB.Sim.setLabCondition(state, window.KLB.Sim.getLabCondition(state) + 10);
          state.energy = Math.min(100, state.energy + 8);
          staggerNpcExchange(
            state.player.roomId,
            [state.player.id, npc.id],
            [
              { speakerId: state.player.id, line: 'Need a quick salve and Band-Aid.' },
              { speakerId: npc.id, line: 'Sorted — shout on WhatsApp if you get stuck late!' }
            ],
            'nafsika_salve'
          );
          showDialogue(npc.id, meta.name, 'Patched up. Shout via Big-Chuds WhatsApp rescue if you get stuck offsite late.', [{ label: '[1] Thanks Nafsika', primary: true, onClick: closeDialogue }], true);
          syncAllHUD(true);
        }
      });
      if (!state.prep.dry_solvent) {
        actions.push({
          label: hasFavour
            ? `[${actions.length + 1}] Borrow Anhydrous DMF (1 Favour)`
            : `[${actions.length + 1}] Borrow Anhydrous DMF (Requires 1 Favour)`,
          disabled: !hasFavour,
          onClick: () => {
            if ((Number(state.favours) || 0) < 1) return;
            state.favours -= 1;
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
        onClick: () => {
          if ((Number(state.favours) || 0) < 1) return;
          closeDialogue();
          if (state.activePlayerAction) {
            showAlertBanner('Finish or step away from your current action first.', 3000, false);
            return;
          }
          state.favours -= 1;
          state.activePlayerAction = {
            kind: 'fix_lcms',
            priorityFlush: true,
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
        onClick: () => {
          if ((Number(state.favours) || 0) < 1) return;
          state.favours -= 1;
          state.abilFineOwed = false;
          showDialogue(npc.id, meta.name, 'Fine waived. Take your tube from the Sample Fridge in the NMR room.', [{ label: '[1] Thanks Dr Aliev', primary: true, onClick: closeDialogue }], true);
          syncAllHUD(true);
        }
      });
      actions.push({
        label: state.prep.sabatini_spritz ? '[2] Apologise (Cologne Charm — Free)' : '[2] Apologise (-8 Patience)',
        primary: !hasFavour,
        onClick: () => {
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
      showAlertBanner('Weekly Report reached 100%! Ready ahead of Thu 18:00.', 3600, false);
    } else if (act.kind === 'manuscript_draft') {
      state.manuscriptProgress = 100;
      if (window.KLB.Audio) window.KLB.Audio.playSfx('success');
      showAlertBanner('Manuscript Draft reached 100%! Ready ahead of Fri 18:00.', 3600, false);
    } else if (act.kind === 'gaming') {
      const res = window.KLB.Sim.applyBreakEffects(state, 'gaming', hasColleaguesInRoom(state.player.roomId), state.timeMins);
      if (window.KLB.Audio) window.KLB.Audio.playSfx('lan_blip');
      window.KLB.Sim.pushWhatsApp(state, 'maximillian_lee', 'GGs on Arabia / Ninja Rope!!');
      showAlertBanner(`AoE2 / Worms break finished (+${res.moraleDelta} Morale, +${res.socialDelta} Social).`, 3600, false);
    } else if (act.kind === 'coffee') {
      const withCol = act.quartet ? true : hasColleaguesInRoom('gordons_cafe');
      const res = window.KLB.Sim.applyBreakEffects(state, 'coffee', withCol, state.timeMins);
      if (act.quartet) {
        state._quartetJoinedWindowKey = act.quartetWinKey || getCoffeeQuartetWindowKey(state);
        const isJoao = state.player.id === 'joao_nogueira';
        const extraMorale = isJoao ? 16 : 0;
        const favourGain = isJoao ? 2 : 1;
        if (extraMorale > 0) {
          state.morale = Math.min(100, (Number(state.morale) || 0) + extraMorale);
        }
        state.patience = Math.min(100, state.patience + 6);
        state.favours += favourGain;
        const totalMoraleShown = (res.moraleDelta || 0) + extraMorale;
        const vLine = 'Good espresso break, sharp work this week.';
        const secondId = isJoao ? 'antoine_maruani' : 'joao_nogueira';
        const secondLine = 'Top Gordon table with the crew today!';
        staggerNpcExchange(
          'gordons_cafe',
          ['vijay_chudasama', secondId],
          [{ speakerId: 'vijay_chudasama', line: vLine }, { speakerId: secondId, line: secondLine }],
          'coffee_quartet'
        );
        showAlertBanner(`Joined Coffee Quartet (+${res.energyDelta} Energy, +${totalMoraleShown} Morale, +${res.socialDelta} Social, +6 Patience, +${favourGain} Favour${favourGain > 1 ? 's' : ''}).`, 4200, false);
      } else {
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
        state.favours += 1;
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
      if (grantFavour) state.favours += 1;
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
        showDialogue(occupier.id, `${occMeta.name} at Station`, `Using this station now (${occupier.currentTaskText || 'active task'}).`, [
          {
            label: `[1] Ask ${occMeta.shortName} to swap bays`,
            primary: true,
            onClick: () => {
              occupier.busyObjId = null;
              closeDialogue();
              launchWaitJob(step, sub, obj);
            }
          },
          { label: '[2] Pick Free Bay', onClick: closeDialogue }
        ]);
        return;
      }

      launchWaitJob(step, sub, obj);
    }
  }

  function launchWaitJob(step, sub, obj) {
    prepareSubTaskExecution(step, sub, obj, () => {
      if (state.activePlayerAction) {
        showAlertBanner('Finish or step away from your current action first.', 3200, false);
        return;
      }
      let blueDyeMishap = false;
      if (state.player.id === 'peter_szijj' && state.energy < 30 && ['gel_tank', 'heatblock', 'tcep_bench'].includes(obj.type) && Math.random() < 0.45) {
        blueDyeMishap = true;
        window.KLB.Sim.pushWhatsApp(state, 'peter_szijj', 'Noo I just pipetted 2 uL of blue SDS loading buffer into pure Fab stock at <30 Energy.');
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
      const sweetMult = state.mutators?.eternal_heatwave ? 0.8 : 1.0;
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
        targetMins: Math.max(2, Math.round((sub.durationMins || 14) * durMult)),
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

    // 1) If current sub-task is 'collect' on this station (e.g. View SDS-PAGE gel / View NMR on PC / View MS on PC)
    const collectHit = curSub && curSub.mode === 'collect'
      ? hitList.find(h => matchesSubTaskStation(h, curSub))
      : null;
    if (collectHit) {
      startSubTaskAtStation(curStep, curSub, collectHit);
      return;
    }

    // 2) Check any active station job matching this tile/fixture
    const existingJob = (state.activeStationJobs || []).find(r =>
      r.roomId === state.player.roomId && hitList.some(h => h.id === r.objId)
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
        if (state.doorPls.active) {
          const reqMeta = window.KLB.CAST_BY_ID[state.doorPls.requesterId];
          state.doorPls.active = false;
          state.favours += 1;
          state.morale = Math.min(100, state.morale + 6);
          if (window.KLB.Audio) window.KLB.Audio.playSfx('door_buzz');
          window.KLB.Sim.pushWhatsApp(state, reqMeta.id, `Cheers @${window.KLB.CAST_BY_ID[state.player.id].shortName} — thanks for buzzing the door (+1 Favour).`);
          showAlertBanner(`Buzzed ${reqMeta.shortName} in! (+1 Favour, +6 Morale)`, 3500, false);
          syncAllHUD(true);
          return;
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
    const matchingHit = curSub ? hitList.find(h => matchesSubTaskStation(h, curSub)) : null;
    if (matchingHit) {
      if (matchingHit.type === 'chem_cupboard' && curSub.cupboardHint) {
        const lbl = matchingHit.label || '';
        if (!matchesCupboardHint(lbl, curSub.cupboardHint)) {
          showAlertBanner(`Look for ${curSub.cupboardHint} for this reagent`, 3800, false);
          openCupboardInspectDialogue(matchingHit);
          return;
        }
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
        const fridgeNote = state.abilFineOwed
          ? 'Notice: Uncollected tube logged in the LG1b Sample Fridge (check the Sample Fridge or speak with Dr Aliev).'
          : 'Sample Fridge clear (no overdue Chudasama tubes).';
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
      const readyNmrJob = (state.activeStationJobs || []).find(j => j.roomId === 'cib_lg1b_nmr' && (j.status === 'ready' || j.status === 'sweet'));
      if (state.abilFineOwed) {
        state.abilFineOwed = false;
        if (window.KLB.Audio?.playSfx) window.KLB.Audio.playSfx('success');
        if (readyNmrJob) {
          showAlertBanner('Collected held NMR tube from LG1b Sample Fridge (Abil fine cleared) and processed ready run!', 4000, false);
          handleActiveStationJob(readyNmrJob);
        } else {
          showDialogue(
            'abil_aliev',
            'LG1b Sample Fridge — Tube Collected',
            'Retrieved your overdue 5 mm NMR tube from the Chudasama rack and ticked the log sheet. Abil fine cleared.',
            [{ label: '[1] Sorted', primary: true, onClick: closeDialogue }],
            true,
            'Sample Fridge Cleared'
          );
          syncAllHUD(true);
        }
        return;
      }
      if (readyNmrJob) {
        handleActiveStationJob(readyNmrJob);
        return;
      }
      showDialogue(
        'abil_aliev',
        'LG1b Sample Fridge',
        'Racks of capped 5 mm Wilmad NMR tubes sorted by group. Your Chudasama rack is tidy with no overdue tubes held by Dr Aliev.',
        [{ label: '[1] Close', primary: true, onClick: closeDialogue }],
        true,
        'CIB LG1b NMR Tube Storage'
      );
      return;
    }

    if (t === 'chair' && state.player.roomId === 'meeting_room') {
      if (window.KLB.Sim.isCellWalkable(state.player.roomId, obj.x, obj.y, state.fireAlarm.active)) {
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
      actions.push({
        label: `[${actions.length + 1}] Check Unlabelled Bench Tube`,
        onClick: () => {
          const ok = Math.random() < 0.78;
          state.prep.tcep_buffered = ok;
          closeDialogue();
          showAlertBanner(ok ? 'Unlabelled bench TCEP checked out at pH 8.0.' : 'Unbuffered TCEP (pH 5)! Re-prep or ask a labmate.', 3800, !ok);
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
        onClick: () => {
          if (state._cupboard19Inspected) return;
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
    const actions = [
      {
        label: '[1] Brew Yorkshire Tea',
        primary: true,
        onClick: () => {
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

    const isAntoinePlayer = state.player.id === 'antoine_maruani';
    const seniorHintBtnText = isAntoinePlayer ? '#AskVijay (-10m)' : '#AskAntoine (-10m)';

    const box = prepareModalBox('klb-modal', 'modal_open');
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
          <button id="btn-step-askchuds" class="rpg-btn">${icon('message-square', 13)}<span>Ask Big-Chuds (-10m)</span></button>
          <button id="btn-step-askantoine" class="rpg-btn">${icon('help-circle', 13)}<span>${escHtml(seniorHintBtnText)}</span></button>
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
      window.KLB.Sim.pushWhatsApp(state, state.player.id, `/AskBigChuds sanity check on ${step.title}?`);
      window.KLB.Sim.pushWhatsApp(state, resolved.senderId, resolved.body || rawHint);
      appendHintLine(resolved.speakerName, resolved.body || rawHint);
      syncAllHUD(true);
    };

    el('btn-step-askantoine').onclick = () => {
      const btn = el('btn-step-askantoine');
      if (btn?.disabled) return;
      if (btn) btn.disabled = true;
      const startDayIdx = state.dayIdx;
      window.KLB.Sim.spendWhatsAppMinutes(state, 10, simCallbacks());
      if (!state || state.dayIdx !== startDayIdx || state.fridayFinalAuditDone || state.gameOver) {
        if (state && !state.gameOver && !state.fridayFinalAuditDone && state.dayIdx !== startDayIdx) closeModal();
        return;
      }
      const rawHint = choice.antoineHint || choice.askChudsHint || 'Keep reactions anhydrous and check TLC or LC-MS.';
      const parsed = parseHintSpeakerAndBody(rawHint);
      const cleanBody = parsed.body || rawHint;
      const advisorId = isAntoinePlayer ? 'vijay_chudasama' : 'antoine_maruani';
      const advisorLabel = isAntoinePlayer ? '#AskVijay' : '#AskAntoine';
      if (advisorId === 'antoine_maruani') {
        window.KLB.Sim.pushWhatsApp(state, state.player.id, `/AskAntoine check on ${step.title}?`);
        window.KLB.Sim.pushWhatsApp(state, 'antoine_maruani', cleanBody);
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
            <span class="ev-choice-label">${escHtml(opt.label)}</span>
          </div>
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
    state.favours -= 2;
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
    setPaused(true);
    modalDismissable = true;
    modalEscapeHandler = () => { closeModal(); setPaused(false); syncAllHUD(true); };

    const qVal = Math.round(item.quality || 0);
    const badgeCls = qVal >= 80 ? 'good' : qVal >= 65 ? 'warn' : 'poor';
    const yieldPart = item.yieldPct != null ? ` | Yield: ${Math.round(item.yieldPct)}%` : '';
    const moraleNote = moraleDelta != null
      ? ` (Morale ${moraleDelta >= 0 ? '+' : ''}${moraleDelta})`
      : '';
    const isSavedBookFig = Boolean(state && !state.spectatorMode && (state.labBook || []).some(f => f.id === item.id));
    const canOfferRepurify = Boolean(isSavedBookFig && isFigureFlawed(item));
    const hasTwoFavours = (Number(state?.favours) || 0) >= 2;

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
          <canvas id="spectrum-modal-canvas" width="680" height="300" style="width:100%;max-width:680px;height:300px;"></canvas>
        </div>
        <p style="font-size:12.5px;color:#cbd5e1;">
          Notes: ${escHtml(item.notes || 'Recorded.')}
          ${qVal < 80 || isFigureFlawed(item) ? '<br><span style="color:#fcd34d;">Tip: Disclose honestly in Friday\'s 4-Slide Deck, or spend 2 Favours (15m) to Re-Purify &amp; Re-Acquire cleanly to 90% quality.</span>' : ''}
        </p>
      </div>
      <footer class="klb-modal-footer" style="justify-content:flex-end;">
        ${canOfferRepurify ? `
          <button id="btn-repurify-spec" type="button" class="rpg-btn" data-hotkey="2" ${hasTwoFavours ? '' : 'disabled'}>
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
      finished = true;
      if (window.KLB.Minigames?.abortActive) window.KLB.Minigames.abortActive();
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
  }

  function openFireAlarmModal() {
    if (!state?.player || (state.player.roomId !== 'klb_2f' && state.player.roomId !== 'klb_3f')) {
      return;
    }
    setPaused(true);
    modalDismissable = false;
    modalEscapeHandler = null;
    const rxnCount = (state.activeStationJobs || []).length;
    const box = prepareModalBox('ev-modal', 'warning');
    box.innerHTML = `
      <div class="ev-modal-header">
        <div class="ev-modal-head-body">
          <span class="ev-modal-cat crisis">Mandatory Evacuation</span>
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
              <span class="ev-choice-label">Evacuate via Left Fire Exit Now</span>
            </div>
            <span class="klb-tag good">Safe</span>
          </div>
        </button>
        <button id="btn-walk-evac" type="button" class="ev-choice-card" data-hotkey="2">
          <div class="ev-choice-top">
            <div class="ev-choice-left">
              <span class="ev-choice-key">2</span>
              <span class="ev-choice-label">Dismiss &amp; Walk to Left Fire Exit</span>
            </div>
            <span class="klb-tag warn">Manual</span>
          </div>
        </button>
      </div>
      <div class="ev-modal-footer">
        <span>Press 1–2 or click an option</span>
        <span>Current Room: ${escHtml(window.KLB.ROOM_META?.[state.player.roomId]?.shortName || state.player.roomId)}</span>
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
    const proofreadTarget = (state.dayIdx <= 3 && wrPct < 100)
      ? { key: 'weekly_report', name: 'Weekly Report' }
      : (msPct < 100
          ? { key: 'manuscript_draft', name: 'Manuscript Draft' }
          : (wrPct < 100 ? { key: 'weekly_report', name: 'Weekly Report' } : null));

    const deskCards = [
      {
        id: 'desk-weekly-report',
        icon: 'file-text',
        label: 'Write Weekly Report',
        subline: wrPct >= 100 ? 'Submitted at 100%' : 'Full draft est: ~74m quiet / ~88m normal',
        tagText: wrPct >= 100 ? 'Complete' : `${wrPct}% | Due Thu 18:00`,
        tagCls: wrPct >= 100 ? 'good' : 'info',
        disabled: wrPct >= 100
      },
      {
        id: 'desk-manuscript',
        icon: 'pen-tool',
        label: 'Write Manuscript Draft',
        subline: msPct >= 100 ? 'Complete at 100%' : 'Full draft est: ~94m quiet / ~114m normal',
        tagText: msPct >= 100 ? 'Complete' : `${msPct}% | Due Fri 18:00`,
        tagCls: msPct >= 100 ? 'good' : 'info',
        disabled: msPct >= 100
      }
    ];
    if (proofreadTarget) {
      deskCards.push({
        id: 'desk-peer-proofread',
        icon: 'sparkles',
        label: `Peer Proofread: ${proofreadTarget.name} (+18%, 0m)`,
        subline: 'Have a Big-Chud red-pen your schemes, tables, and experimental wording instantly.',
        tagText: hasFavour ? '1 Favour' : 'Needs 1 Favour',
        tagCls: hasFavour ? 'warn' : 'danger',
        disabled: !hasFavour
      });
    }
    deskCards.push(
      {
        id: 'desk-gaming',
        icon: 'gamepad-2',
        label: aoe2Active ? 'Join 17:00 AoE2 / Worms Lobby' : 'Play Video Game Break (AoE2 / Worms)',
        subline: '',
        tagText: `${gamingMins}m`,
        tagCls: aoe2Active ? 'good' : 'info',
        disabled: false
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
      deskCards.push({
        id: 'desk-packed-lunch',
        icon: 'utensils',
        label: 'Eat Packed Lunch',
        subline: '',
        tagText: '19m',
        tagCls: 'good',
        disabled: false
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

    const cardsHtml = deskCards.map((c, idx) => `
      <button id="${escHtml(c.id)}" type="button" class="ev-choice-card" data-hotkey="${idx + 1}" ${c.disabled ? 'disabled' : ''}>
        <div class="ev-choice-top">
          <div class="ev-choice-left">
            <span class="ev-choice-key">${idx + 1}</span>
            ${icon(c.icon, 15)}
            <div>
              <div class="ev-choice-label">${escHtml(c.label)}</div>
              ${c.subline ? `<div style="font-size:11px;color:#94a3b8;margin-top:2px;">${escHtml(c.subline)}</div>` : ''}
            </div>
          </div>
          <span class="klb-tag ${escHtml(c.tagCls)}">${escHtml(c.tagText)}</span>
        </div>
      </button>
    `).join('');

    const box = prepareModalBox('klb-modal', 'modal_open');
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
        <span>${isQuiet ? 'Focus Multiplier: Quiet / Headphones ON' : 'Tip: 3F or Headphones speeds writing'}</span>
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
        if ((Number(state.favours) || 0) < 1) return;
        state.favours -= 1;
        let updatedPct = 0;
        if (proofreadTarget.key === 'weekly_report') {
          state.weeklyReportProgress = clamp((state.weeklyReportProgress || 0) + 18, 0, 100);
          updatedPct = Math.round(state.weeklyReportProgress);
        } else {
          state.manuscriptProgress = clamp((state.manuscriptProgress || 0) + 18, 0, 100);
          updatedPct = Math.round(state.manuscriptProgress);
        }
        const reviewers = ['antoine_maruani', 'richard_spears', 'daniel_richards', 'faiza_javaid'].filter(id => id !== state.player.id);
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

    el('desk-slides').onclick = () => { closeModal(); openSlideBuilderOverlay(); };

    if (el('desk-packed-lunch')) {
      el('desk-packed-lunch').onclick = () => {
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
      state.activePlayerAction = {
        kind: 'coffee',
        quartet: true,
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

    const menuItems = [];
    if (quartetHere) {
      const isJoao = state.player.id === 'joao_nogueira';
      menuItems.push({
        id: 'cafe-quartet',
        icon: 'coffee',
        label: 'Join Coffee Quartet (João, Nafsika, Vijay & Faiza)',
        duration: quartetJoined ? 'Joined' : '15m',
        durCls: quartetJoined ? 'good' : 'warn',
        disabled: quartetJoined,
        pills: isJoao
          ? ['+Energy', '+2x Morale', '+Social', '+6 Patience', '+2 Favours']
          : ['+Energy', '+Morale', '+Social', '+6 Patience', '+1 Favour']
      });
    }
    menuItems.push({
      id: 'cafe-coffee',
      icon: 'coffee',
      label: 'Have Coffee (Double Flat White / Espresso)',
      duration: '10m',
      durCls: 'info',
      disabled: false,
      pills: ['+Energy', '+Morale', '+Social']
    });
    if (lunchHours) {
      menuItems.push({
        id: 'cafe-lunch',
        icon: 'utensils',
        label: 'Have Lunch (Warm Panini & Pastry)',
        duration: '23m',
        durCls: 'good',
        disabled: false,
        pills: ['+Energy', '+Morale', '+Social']
      });
    }

    const menuHtml = menuItems.map((m, idx) => `
      <button id="${escHtml(m.id)}" type="button" class="ev-choice-card" data-hotkey="${idx + 1}" ${m.disabled ? 'disabled' : ''}>
        <div class="ev-choice-top">
          <div class="ev-choice-left">
            <span class="ev-choice-key">${idx + 1}</span>
            ${icon(m.icon, 15)}
            <span class="ev-choice-label">${escHtml(m.label)}</span>
          </div>
          <span class="klb-tag ${escHtml(m.durCls)}">${escHtml(m.duration)}</span>
        </div>
        <div class="ev-choice-deltas">
          ${m.pills.map(p => `<span class="ev-delta-pill pos">${escHtml(p)}</span>`).join('')}
        </div>
      </button>
    `).join('');

    const box = prepareModalBox('klb-modal-sm', 'modal_open');
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
        <span>${quartetHere ? 'Coffee Quartet active now' : 'Standard counter service'}</span>
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

    el('cafe-coffee').onclick = () => {
      closeModal();
      setPaused(false);
      startGordonAction('coffee', false, targetObj);
    };

    if (el('cafe-lunch')) {
      el('cafe-lunch').onclick = () => {
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

    const hour = state.timeMins / 60;
    const curRoom = state.player.roomId;
    const curSub = getCurrentSubTask();
    const quartetHere = Boolean(window.KLB.Sim.isCoffeeQuartetWindow(state));
    const lunchHighlight = hour >= 11.5 && hour <= 14.5 && !state.hadLunchToday;
    const canEndDay = state.timeMins >= 18 * 60;
    const errands = (window.KLB.BLOOMSBURY_ERRANDS || []).filter(er => er.targetRoom !== 'klb_3f');

    let nextHotkey = 1;
    const itemsHtml = errands.map(er => {
      const hotkey = nextHotkey++;
      const isHere = curRoom === er.targetRoom;
      const isSubTarget = Boolean(curSub && curSub.roomId === er.targetRoom);
      const isCafeHighlight = er.id === 'gordons_cafe' && (quartetHere || lunchHighlight);
      const hoursText = er.id === 'meeting_room' ? 'Fri 09:00 Group Meeting' : (er.hours || 'Open');
      const tags = [];
      if (isHere) tags.push(`<span class="klb-tag info">Here</span>`);
      if (isSubTarget) tags.push(`<span class="klb-tag good">Sub-Task</span>`);
      if (er.id === 'gordons_cafe' && quartetHere) tags.push(`<span class="klb-tag warn">Coffee Quartet</span>`);
      else if (er.id === 'gordons_cafe' && lunchHighlight) tags.push(`<span class="klb-tag info">Lunch Hours</span>`);
      if (er.targetRoom === 'cib_lg11_ms' && !state.prep.knows_1965) {
        tags.push(`<span class="klb-tag warn">1965 Keypad</span>`);
      } else if (er.targetRoom === 'cib_lg1b_nmr' && !state.prep.knows_2145) {
        tags.push(`<span class="klb-tag warn">2145 Keypad</span>`);
      }

      return `
        <button type="button" data-errand="${escHtml(er.id)}" class="ev-choice-card" data-hotkey="${hotkey}" ${isHere ? 'disabled' : ''}>
          <div class="ev-choice-top">
            <div class="ev-choice-left">
              <span class="ev-choice-key">${hotkey}</span>
              ${icon(er.icon || 'map-pin', 15)}
              <div>
                <div class="ev-choice-label" style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;">
                  <span>${escHtml(er.title)}</span>
                  ${tags.join('')}
                </div>
                <div style="font-size:11px;color:#94a3b8;margin-top:2px;">${escHtml(er.note || '')}</div>
              </div>
            </div>
            <span class="mono-muted" style="flex-shrink:0;color:${isSubTarget || isCafeHighlight ? '#86efac' : '#93c5fd'};">${escHtml(isHere ? 'Current Room' : hoursText)}</span>
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

    const box = prepareModalBox('klb-modal', 'modal_open');
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
            <button id="btn-bloom-courier" type="button" class="ev-choice-card" data-hotkey="c" ${courierDisabled ? 'disabled' : ''}>
              <div class="ev-choice-top">
                <div class="ev-choice-left">
                  <span class="ev-choice-key">C</span>
                  ${icon('send', 15)}
                  <div>
                    <div class="ev-choice-label" style="color:#7dd3fc;">Labmate Sample Courier (1 Favour, 0m)</div>
                    <div style="font-size:11px;color:#94a3b8;margin-top:2px;">${escHtml(courierDesc)}</div>
                  </div>
                </div>
                <span class="klb-tag ${courierDisabled ? 'danger' : 'warn'}">${!hasCourierFavour ? 'Needs 1 Favour' : (readyCibJob ? 'Collect 0m' : 'Run 0m')}</span>
              </div>
            </button>
          ` : ''}
          ${canEndDay ? `
            <button id="btn-head-home-night" type="button" class="ev-choice-card" data-hotkey="${nightHotkey}">
              <div class="ev-choice-top">
                <div class="ev-choice-left">
                  <span class="ev-choice-key">${nightHotkey}</span>
                  ${icon('moon', 15)}
                  <span class="ev-choice-label" style="color:#fde68a;">Head Home for the Night (End Day)</span>
                </div>
                <span class="klb-tag warn">Roll Day</span>
              </div>
            </button>
          ` : ''}
          ${state.postAuditCelebration ? `
            <button id="btn-bloom-next-week" type="button" class="ev-choice-card" data-hotkey="${nextWeekHotkey}">
              <div class="ev-choice-top">
                <div class="ev-choice-left">
                  <span class="ev-choice-key">${nextWeekHotkey}</span>
                  ${icon('play', 15)}
                  <span class="ev-choice-label" style="color:#86efac;">Start Week ${state.weekNum + 1} (Monday)</span>
                </div>
                <span class="klb-tag good">Next Week</span>
              </div>
            </button>
          ` : ''}
        </div>
      </div>
      <footer class="klb-modal-footer">
        <span>Press 1–${nextHotkey - 1}${hasCourierTask ? ' or C' : ''} to choose</span>
        <span>Current Room: ${escHtml(window.KLB.ROOM_META?.[curRoom]?.shortName || curRoom)}</span>
      </footer>
    `;
    el('modal-backdrop').classList.remove('hidden');
    el('btn-close-bloom').onclick = modalEscapeHandler;

    if (hasCourierTask && el('btn-bloom-courier') && !courierDisabled) {
      el('btn-bloom-courier').onclick = () => {
        if ((Number(state.favours) || 0) < 1) return;
        const couriers = ['marcos_fernandez', 'daniel_richards', 'antoine_maruani', 'faiza_javaid'].filter(id => id !== state.player.id);
        const courierId = couriers[0] || 'marcos_fernandez';
        const courierName = window.KLB.CAST_BY_ID?.[courierId]?.shortName || 'Labmate';
        const curStepNow = getCurrentCampaignStep();
        const curSubNow = getCurrentSubTask(curStepNow);

        closeModal();
        setPaused(false);

        if (readyCibJob) {
          state.favours -= 1;
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
          state.favours -= 1;
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
    const roomTitle = window.KLB.ROOM_META[targetRoom].shortName;
    const box = prepareModalBox('klb-modal-sm', 'modal_open');
    box.innerHTML = `
      <header class="klb-modal-header">
        <div>
          <h3 style="display:flex;align-items:center;gap:8px;">
            ${icon('lock', 16)}
            <span>CIB Keypad — ${escHtml(roomTitle)}</span>
          </h3>
          <p class="mono-muted" style="margin-top:3px;">Enter the 4-digit CIB door code or ask Big-Chuds on WhatsApp</p>
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
      window.KLB.Sim.pushWhatsApp(state, state.player.id, `Code for ${roomTitle}? Standing at the keypad.`);
      window.KLB.Sim.pushWhatsApp(state, 'marcos_fernandez', `Code is ${code} — do not prop the door open.`);
      const inp = el('keypad-input');
      if (inp) inp.value = code;
      const msg = el('keypad-msg');
      if (msg) {
        msg.classList.remove('hidden', 'warn');
        msg.textContent = `Marcos replied: ${code} (-10m elapsed)`;
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
          msg.textContent = 'Invalid code — ask Big-Chuds for the 4-digit code.';
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
    const box = prepareModalBox('ev-modal', 'modal_open');

    const actorId = ev.actorId || ev.whatsappSender || '';
    const catMap = {
      crisis: { cls: 'crisis', label: 'Lab Crisis' },
      inspection: { cls: 'inspection', label: 'Inspection' },
      social: { cls: 'social', label: 'Social Event' },
      weather: { cls: 'weather', label: 'Weather Alert' },
      facility: { cls: 'facility', label: 'Facility Alert' }
    };
    const cat = catMap[ev.category] || { cls: '', label: 'KLB Event' };
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
          <span class="ev-modal-cat ${escHtml(cat.cls)}">${escHtml(cat.label)}</span>
          <h3 class="ev-modal-title">${escHtml(ev.title || 'KLB Event')}</h3>
          <p class="ev-modal-desc">${escHtml(ev.bannerText || ev.whatsappMsg || '')}</p>
          ${croissantWarnHtml}
        </div>
      </div>
      <div id="ev-choices" class="ev-choices-list"></div>
      <div class="ev-modal-footer">
        <span>Press 1–${choices.length} or click an option</span>
        <span>Available Favours: ${Number(state.favours) || 0}</span>
      </div>
    `;
    el('modal-backdrop').classList.remove('hidden');

    const wrap = el('ev-choices');
    const deltaSpecs = [
      ['moraleDelta', 'Morale'],
      ['safetyDelta', 'Lab Condition'],
      ['energyDelta', 'Energy'],
      ['socialDelta', 'Social'],
      ['patienceDelta', 'Patience'],
      ['favourDelta', 'Favour']
    ];

    choices.forEach((ch, idx) => {
      const cost = Number(ch.favourCost) || 0;
      const cantAfford = cost > 0 && (Number(state.favours) || 0) < cost;
      const cleanLabel = cost > 0
        ? String(ch.label || '').replace(/\s*\(\d+\s*Favours?\)\s*$/i, '').trim()
        : String(ch.label || '');

      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'ev-choice-card';
      b.dataset.hotkey = String(idx + 1);
      if (cantAfford) b.disabled = true;

      const costHtml = cost > 0
        ? `<span class="ev-choice-cost${cantAfford ? ' short' : ''}">${cantAfford ? `Needs ${cost} Favour${cost === 1 ? '' : 's'}` : `-${cost} Favour${cost === 1 ? '' : 's'}`}</span>`
        : '';

      const deltasHtml = deltaSpecs.reduce((acc, [key, label]) => {
        const val = Number(ch[key]) || 0;
        if (!val) return acc;
        const cls = val > 0 ? 'pos' : 'neg';
        const sign = val > 0 ? '+' : '';
        return acc + `<span class="ev-delta-pill ${cls}">${sign}${val} ${escHtml(label)}</span>`;
      }, '');

      b.innerHTML = `
        <div class="ev-choice-top">
          <div class="ev-choice-left">
            <span class="ev-choice-key">${idx + 1}</span>
            <span class="ev-choice-label">${escHtml(cleanLabel)}</span>
          </div>
          ${costHtml}
        </div>
        ${deltasHtml ? `<div class="ev-choice-deltas">${deltasHtml}</div>` : ''}
      `;

      b.onclick = () => {
        if (cost > 0 && (Number(state.favours) || 0) < cost) return;
        closeModal();
        setPaused(false);
        if (cost > 0) {
          state.favours = Math.max(0, (Number(state.favours) || 0) - cost);
        }
        const mDelta = (ch.moraleDelta || 0) < 0 && state.player.id === 'calise_bahou' ? Math.round(ch.moraleDelta * 0.5) : (ch.moraleDelta || 0);
        const sDelta = (ch.safetyDelta || 0) < 0 && state.mutators?.strict_coshh ? Math.round(ch.safetyDelta * 1.5) : (ch.safetyDelta || 0);
        state.morale = clamp(state.morale + mDelta, 0, 100);
        window.KLB.Sim.setLabCondition(state, window.KLB.Sim.getLabCondition(state) + sDelta);
        state.energy = clamp(state.energy + (ch.energyDelta || 0), 0, 100);
        state.social = clamp((state.social ?? 84) + (ch.socialDelta || 0), 0, 100);
        state.patience = clamp(state.patience + (ch.patienceDelta || 0), 0, 100);
        state.favours = Math.max(0, state.favours + (ch.favourDelta || 0));
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
    setPaused(true);
    modalDismissable = true;
    modalEscapeHandler = () => { closeModal(); setPaused(false); };
    const box = prepareModalBox('klb-modal', 'slide_click');
    box.innerHTML = `<div id="slide-builder-mount"></div>`;
    el('modal-backdrop').classList.remove('hidden');
    window.KLB.SlideBuilder.openDeckModal(el('slide-builder-mount'), state, savedDeck => {
      if (savedDeck) {
        state.slideDeck = Object.assign({}, savedDeck, { ready: true });
        if (window.KLB.Audio?.playSfx) window.KLB.Audio.playSfx('slide_click');
        showAlertBanner('Saved 4-Slide Group Meeting Deck.', 3500, false);
      }
      closeModal();
      setPaused(false);
      syncAllHUD(true);
    });
  }

  function triggerFridayMorningWelcome() {
    if (!state || state.spectatorMode || state.dayIdx !== 4 || state.fridayAuditDone) return;
    setPaused(true);
    showAlertBanner('FRI 09:00 — Group Meeting starting in the Seminar Room!', 4500, false);
    showDialogue(
      'vijay_chudasama',
      'Prof. Vijay Chudasama — Friday 09:00 Group Meeting',
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
          label: '[2] Start Group Meeting with Vijay',
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
    if (state.dayIdx < 4) {
      showDialogue(
        'vijay_chudasama',
        'Group Meeting Seminar Room',
        'Friday Group Meeting starts Friday morning at 09:00. Build your 4-slide deck at any desk.',
        [
          { label: '[1] Return to Lab', primary: true, onClick: closeDialogue },
          { label: '[2] Open 4-Slide Deck Builder', onClick: () => { closeDialogue(); openSlideBuilderOverlay(); } }
        ]
      );
      return;
    }

    if (state.fridayAuditDone && state.lastAuditResult) {
      showDialogue(
        'vijay_chudasama',
        'Group Meeting Seminar Room',
        `Morning Group Meeting wrapped! Finish remaining Friday tasks & Manuscript Draft (due 18:00).`,
        [{ label: '[1] Back to Work', primary: true, onClick: closeDialogue }],
        true,
        `Audit Score: ${state.lastAuditResult.total.toFixed(1)}/10`
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

    const wasMorningPresented = Boolean(state.fridayMorningPresented);
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
    }
    state.lastAuditResult = res;

    if (res.passed) {
      archive = reconcileArchiveSafe(a => {
        a.clearedChars = a.clearedChars || {};
        const prev = a.clearedChars[state.player.id] || 0;
        a.clearedChars[state.player.id] = Math.max(prev, res.total);
        a.bestScore = Math.max(a.bestScore || 0, res.total);
      });
    }

    if (!(isWeekWrap && wasMorningPresented)) {
      (res.chudReactions || []).forEach(r => window.KLB.Sim.pushWhatsApp(state, r.senderId, r.text));
    }

    const b = res.breakdown || {};
    const reasons = res.breakdownReasons || {};
    const scoreCol = res.passed ? '#4ade80' : '#f87171';
    const deltaStr = pDelta >= 0 ? `+${pDelta}` : `${pDelta}`;
    const deltaCol = pDelta >= 0 ? '#86efac' : '#fca5a5';
    const avgQ = Math.round(res.avgQuality || 0);
    const avgY = Math.round(res.avgYield || 0);
    const continueMidFriday = !isWeekWrap && state.timeMins < 18 * 60;

    const auditMetrics = [
      { key: 'yieldScore', title: 'Yield & Steps', max: 2.0 },
      { key: 'homogeneityScore', title: 'Homogeneity', max: 2.0 },
      { key: 'rigorScore', title: 'Analytical Rigor', max: 2.0 },
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

    const box = prepareModalBox('klb-modal', null);
    box.innerHTML = `
      <header class="klb-modal-header" style="align-items:center;">
        <img class="pixel-art" src="assets/portraits/vijay_chudasama.png" style="width:76px;height:76px;border-radius:8px;border:1px solid var(--border-medium);" />
        <div style="flex:1;">
          <p class="mono-muted" style="color:#93c5fd;">${isWeekWrap ? 'Friday 18:00 Final Week Audit' : 'Friday 09:00 Group Meeting Audit'}</p>
          <h3 style="margin:2px 0;font-size:19px;">Prof. Vijay Chudasama Score-Card</h3>
          <p style="font-size:12.5px;color:#cbd5e1;">${escHtml(window.KLB.getCampaign(state.player.id)?.title || '')}</p>
          <p class="mono-muted" style="margin-top:4px;">
            Avg Quality: <span style="color:#f8fafc;">${avgQ}%</span> | Avg Yield: <span style="color:#f8fafc;">${avgY}%</span> | Vijay Patience: <span style="color:${deltaCol};">${deltaStr}</span>
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
          ${(res.vijayVerdictLines || []).map(l => `<p style="margin-bottom:5px;">"${escHtml(l)}"</p>`).join('')}
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
        launchGordonsVictoryScene(res);
      };
    }
    if (el('btn-audit-week-wrap')) {
      el('btn-audit-week-wrap').onclick = () => {
        closeModal();
        setPaused(false);
        launchGordonsVictoryScene(res);
      };
    }

    syncAllHUD(true);
    window.KLB.Sim.checkPermadeath(state, simCallbacks());
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
      { key: 'rigorScore', title: 'Analytical Rigor', max: 2.0 },
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

    const box = prepareModalBox('klb-modal', 'ui_click');
    box.innerHTML = `
      <header class="klb-modal-header" style="align-items:center;">
        <img class="pixel-art" src="assets/portraits/vijay_chudasama.png" style="width:72px;height:72px;border-radius:8px;border:1px solid var(--border-medium);" />
        <div style="flex:1;">
          <p class="mono-muted" style="color:#93c5fd;">Week ${state.weekNum || 1} Friday Audit Review</p>
          <h3 style="margin:2px 0;font-size:19px;">Prof. Vijay Chudasama Score-Card</h3>
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
          ${(res.vijayVerdictLines || []).map(l => `<p style="margin-bottom:5px;">"${escHtml(l)}"</p>`).join('')}
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
    state.timeMins = Math.round((window.KLB.CAST_BY_ID[state.player.id].arriveHour || 9) * 60);
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
    state._stepPrepCredit = {};
    state._stepBiotageBonusApplied = false;
    state._stepFaizaA280Done = false;
    state._stepDanFumbleApplied = false;
    state.npcChatCooldowns = {};
    state.morale = Math.min(100, state.morale + 15);
    state.energy = 95;
    state.social = Math.min(100, (state.social ?? 84) + 10);
    state.lastPreferredBreakMins = state.timeMins;
    state.player.specsOn = true;
    syncCelebrationBanner();
    window.KLB.Sim.syncNPCSchedules(state, true);
    transitionToRoom('klb_2f', window.KLB.ROOM_META.klb_2f.entrySpawn);
    saveActiveRunSnapshot(true);
  }

  function launchGordonsVictoryScene(res) {
    const score = res?.total ?? 6.0;
    const passed = Boolean(res?.passed);
    clearActiveRunSnapshot();
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
    const cafeSpots = [[5, 11], [8, 11], [9, 11], [12, 11], [12, 9], [12, 5], [9, 3], [11, 3], [7, 9]];
    const chuds = window.KLB.CAST.filter(c => c.playable && c.id !== state.player.id);
    chuds.forEach((c, idx) => {
      const spot = cafeSpots[idx % cafeSpots.length];
      state.npcs[c.id].roomId = 'gordons_cafe';
      state.npcs[c.id].x = spot[0];
      state.npcs[c.id].y = spot[1];
      state.npcs[c.id].dir = spot[1] >= 11 ? 'E' : 'S';
      state.npcs[c.id].path = [];
    });
    syncAudioAmbience();
    syncCelebrationBanner();
    if (window.KLB.Audio) window.KLB.Audio.playSfx('success');

    showDialogue(
      'joao_nogueira',
      `Week ${state.weekNum} Complete — Gordon's Café (${score.toFixed(1)}/10)`,
      passed
        ? `Week Complete! Friday Audit cleared (${score.toFixed(1)}/10) and Friday shift finished. Chat with everyone at Gordon's, copy your score-card, start Week ${state.weekNum + 1}, or choose another Big-Chud.`
        : `Week ${state.weekNum} wrapped (${score.toFixed(1)}/10). Catch a breather with the crew at Gordon's, copy your score-card, start Week ${state.weekNum + 1}, or pick another Big-Chud.`,
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
    alexPursuitActive = false;
    syncCelebrationBanner();
    setPaused(true);
    modalDismissable = false;
    modalEscapeHandler = null;
    if (window.KLB.Audio) {
      window.KLB.Audio.stopAllAmbience();
    }

    const playerMeta = window.KLB.CAST_BY_ID[state.player.id] || { id: state.player.id, name: state.player.id, shortName: state.player.id };
    let heading = '0 Lab Condition — Lab 230 Suspended Until Monday';
    let body = window.KLB.Sim.PERMADEATH_MESSAGES?.[reason] || 'Lab Condition hit 0% — KLB Lab 230 closed for emergency cleanup and formal review.';
    if (reason === 'MORALE_ZERO') {
      heading = '0 Morale — Stepped Out Onto Gordon Street';
      body = `${playerMeta.name} hung up their lab coat after morale hit zero.`;
    } else if (reason === 'PATIENCE_ZERO') {
      heading = '0 Vijay Patience — Friday Audit Failed';
      body = window.KLB.Sim.PERMADEATH_MESSAGES?.PATIENCE_ZERO || "Vijay's patience hit zero after missed deadlines and poor group-meeting data.";
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
      state.activePlayerAction = null;
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
          state.favours = (Number(state.favours) || 0) + 1;
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
  }

  function endCurrentDay(forcedCurfew = false) {
    if (!state || state.gameOver) return;
    closeDialogue({ skipUnpause: true });
    closeModal();
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
      if (!j.isCold4C && j.canOvercook !== false) {
        j.elapsedMins = j.targetMins + j.sweetSpotMins + 60;
        j.status = 'overcooked';
      } else {
        j.elapsedMins = Math.max(j.elapsedMins, j.targetMins);
        j.status = j.canOvercook ? 'sweet' : 'ready';
      }
    });

    if (state.dayIdx >= 4) {
      state.dayIdx = 0;
      state.weekNum = (state.weekNum || 1) + 1;
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
      state.npcChatCooldowns = {};
      state.energy = forcedCurfew ? 76 : 95;
      state.morale = Math.min(100, state.morale + (forcedCurfew ? -4 : 6));
      state.social = Math.min(100, (state.social ?? 84) + 6);
      state.lastPreferredBreakMins = state.timeMins;
    }

    state.aoe2UsedToday = false;
    state.coffeeUsedToday = false;
    state._prevAoe2UsedToday = false;
    state._pollToday = false;
    state._sweepToday = false;
    state._fireAlarmToday = false;
    state._alexToday = false;
    state._coffeePingToday = false;
    state._quartetWaToday = false;
    state._eveningToastToday = false;
    state.fireAlarm = { active: false, remainingMins: 0, elapsedMins: 0 };
    state.safetySweep = { active: false, countdownSec: 0, countdownMins: 0 };
    state.weatherMode = state.mutators.eternal_heatwave ? 'heatwave' : 'normal';
    state.tempC = state.mutators.eternal_heatwave ? 30.2 : 21.0;

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
      if (a.disabled) {
        b.disabled = true;
      } else {
        b.onclick = a.onClick;
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
    el('modal-backdrop').classList.add('hidden');
    const b = el('modal-box');
    if (b) {
      b.classList.remove('ev-modal', 'klb-modal', 'klb-modal-sm');
      b.innerHTML = '';
    }
    modalDismissable = true;
    modalEscapeHandler = null;
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
        const p = state.player;
        const busySet = new Set();
        for (const n of Object.values(state.npcs || {})) {
          if (n && n.roomId === curRoom && n.busyObjId) busySet.add(n.busyObjId);
        }
        const candidates = rm.objects.filter(o => {
          if (!stationTypes.includes(o.type)) return false;
          if (cupboardHint && o.type === 'chem_cupboard') {
            return matchesCupboardHint(o.label || '', cupboardHint);
          }
          return true;
        });
        candidates.sort((a, b) => {
          const aChud = a.group === 'chudasama' ? 0 : 1;
          const bChud = b.group === 'chudasama' ? 0 : 1;
          if (aChud !== bChud) return aChud - bChud;
          const aBusy = busySet.has(a.id) ? 1 : 0;
          const bBusy = busySet.has(b.id) ? 1 : 0;
          if (aBusy !== bBusy) return aBusy - bBusy;
          const da = Math.hypot((a.x + a.w * 0.5) - p.x, (a.y + a.h * 0.5) - p.y);
          const db = Math.hypot((b.x + b.w * 0.5) - p.x, (b.y + b.h * 0.5) - p.y);
          return da - db;
        });
        targetObj = candidates[0] || null;
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
      if (!force && sig === lastTaskPanelSig) return;
      lastTaskPanelSig = sig;
      pin.className = 'pinned-objective';
      pin.innerHTML = `
        <div class="pinned-title-row">
          ${icon('users', 14)}
          <span class="pinned-title-text">Observer View: ${escHtml(rMeta.shortName || viewRoom)}</span>
        </div>
        <div class="pinned-meta-line">All 10 Big-Chuds &amp; neighbours acting autonomously.</div>
        <ol id="subtask-list" class="subtask-list"></ol>
      `;
      return;
    }

    const curStep = getCurrentCampaignStep();
    const act = state.activePlayerAction;
    const jobs = state.activeStationJobs || [];

    if (!curStep) {
      const sig = `done:${Math.round(state.manuscriptProgress || 0)}:${state.slideDeck.ready ? 1 : 0}`;
      if (!force && sig === lastTaskPanelSig) return;
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
    if (!force && sig === lastTaskPanelSig) return;
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
        <li class="${rowCls}" data-subtask-idx="${idx}" ${(!isDone && (isActive || isRunning)) ? 'title="Click to auto-walk to this station"' : ''}>
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
      const visRxns = window.KLB.Sim.getVisibleNPCReactions(state, viewRoom);
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

    const sig = `${state.spectatorMode ? 'S' : 'P'}:${viewRoom}:` + items.map(it => `${it.id}:${it.status || 'running'}`).join('|');
    if (!force && sig === lastReactionsSig) return;
    lastReactionsSig = sig;

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
        <div class="rxn-card ${cls}${clickableCls}" data-timer-id="${escHtml(r.id)}" ${clickableCls ? 'title="Click to auto-walk to this station"' : ''}>
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
      const visRxns = window.KLB.Sim.getVisibleNPCReactions(state, viewRoom);
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
    populateTravelCombobox();

    const charBadgeEl = el('hud-char-badge');
    if (charBadgeEl) {
      if (state.spectatorMode) {
        charBadgeEl.textContent = 'Observer | All 10 Big-Chuds';
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
      b.className = 'danger';
      b.innerHTML = `${icon('shield-check', 14)}<span>SAFETY SWEEP IN ${Math.max(0, Math.ceil(state.safetySweep.countdownSec))}s — Specs: ${state.player.specsOn ? 'ON' : 'OFF'} | Headphones: ${state.player.headphonesOn ? 'ON' : 'OFF'} | Lab Condition: ${Math.round(window.KLB.Sim.getLabCondition(state))}%</span>`;
      b.classList.remove('hidden');
    } else if (!state.spectatorMode && state.fireAlarm?.active && (viewRoom === 'klb_2f' || viewRoom === 'klb_3f')) {
      const b = el('live-alert-banner');
      b.className = 'danger';
      b.innerHTML = `${icon('flame', 14)}<span>FIRE ALARM (${Math.ceil(state.fireAlarm.remainingMins)}m left) — Evacuate via the left fire exit!</span>`;
      b.classList.remove('hidden');
    }

    el('clock-readout').textContent = window.KLB.Sim.formatClock(state.dayIdx, state.timeMins);
    const hv = el('hvac-readout');
    const modeLabel = state.weatherMode === 'cold_230'
      ? 'Cold'
      : state.weatherMode === 'heatwave'
        ? 'Heatwave'
        : 'Normal';
    hv.textContent = `${Math.round(state.tempC)} °C ${modeLabel}`;
    hv.style.color = state.weatherMode === 'cold_230'
      ? '#93c5fd'
      : state.weatherMode === 'heatwave'
        ? '#fca5a5'
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
      if (camp?.manuscriptTopic && el('lbl-manuscript-title')) {
        el('lbl-manuscript-title').textContent = 'Manuscript Draft';
        el('lbl-manuscript-title').title = camp.manuscriptTopic;
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
      const chuds = (window.KLB.BIG_CHUDS_IDS || []).map(id => state.npcs[id]).filter(Boolean);
      const totalSteps = chuds.reduce((s, n) => s + (n.sim?.completedSteps?.length || 0), 0);
      const avgMs = Math.round(chuds.reduce((s, n) => s + (n.sim?.manuscriptProgress || 0), 0) / Math.max(1, chuds.length));
      const inLab = chuds.filter(n => n.roomId !== 'offsite').length;
      const cqText = window.KLB.Sim.isCoffeeQuartetWindow(state) ? " | Coffee Quartet at Gordon's" : '';
      el('spectator-stats-line').textContent = `${inLab}/10 on campus | ${totalSteps}/50 steps done | Avg Manuscript ${avgMs}%${cqText}`;
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
      lastWaMsgId = latestId;
      lastWaCount = waList.length;
      const feed = el('wa-feed');
      feed.innerHTML = waList.map(m => `
        <div class="wa-msg ${m.isSelf ? 'self' : ''}">
          <img class="wa-avatar pixel-art" src="assets/portraits/${m.senderId}.png" onerror="this.style.display='none'" alt="" />
          <div class="wa-bubble">
            <div class="wa-meta">
              <span style="color:${m.color}">${escHtml(m.senderName)}</span>
              <span class="wa-time">${escHtml(m.timeStr)}</span>
            </div>
            <div>${escHtml(m.text)}</div>
          </div>
        </div>
      `).join('');
      feed.scrollTop = feed.scrollHeight;
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
      const chuds = (window.KLB.BIG_CHUDS_IDS || []).map(id => ({ meta: window.KLB.CAST_BY_ID[id], npc: state.npcs[id] })).filter(x => x.meta && x.npc);
      const sig = `spec:${specFollowNpcId || ''}:` + chuds.map(x => `${x.npc.roomId}:${x.npc.sim?.completedSteps?.length}:${Math.round(x.npc.sim?.manuscriptProgress || 0)}:${Math.round(x.npc.sim?.weeklyReportProgress || 0)}:${Math.round(x.npc.sim?.energy || 0)}:${x.npc.sim?.auditResult?.total || ''}`).join('|');
      if (!force && sig === lastLabBookSig) return;
      lastLabBookSig = sig;
      const prevScrollTop = pane.scrollTop;

      pane.innerHTML = `
        <div class="sec-hdr"><h4>Autonomous Big-Chuds Roster</h4><span class="mono-muted">Click to Follow | Week ${state.weekNum}</span></div>
        <ol class="step-list">
          ${chuds.map(({ meta, npc }) => {
            const s = npc.sim || {};
            const auditTxt = s.auditResult ? ` | Audit: ${s.auditResult.total.toFixed(1)}/10 (${s.auditResult.passed ? 'Pass' : 'Fail'})` : '';
            const isFollowing = specFollowNpcId === npc.id;
            const roomLbl = window.KLB.ROOM_META[npc.roomId]?.shortName || npc.roomId;
            return `
              <li class="step-item spec-roster-card clickable ${s.auditResult?.passed ? 'done' : ''} ${isFollowing ? 'following' : ''}" data-spec-npc="${escHtml(npc.id)}" title="Click to follow ${escHtml(meta.shortName)}">
                <div style="flex:1;min-width:0;">
                  <div style="display:flex;align-items:center;justify-content:space-between;gap:6px;">
                    <span>${escHtml(meta.name)} (${escHtml(roomLbl)})</span>
                    ${isFollowing ? `<span class="klb-tag info">${icon('eye', 11)}<span>Following</span></span>` : ''}
                  </div>
                  <div class="mono-muted" style="font-size:10.5px;">${escHtml(npc.currentTaskText || 'Working')}</div>
                  <div class="mono-muted" style="font-size:10.5px;">Steps: ${s.completedSteps?.length || 0}/5 | WR: ${Math.round(s.weeklyReportProgress || 0)}% | Ms: ${Math.round(s.manuscriptProgress || 0)}% | E: ${Math.round(s.energy ?? 80)} S: ${Math.round(s.social ?? 84)}${escHtml(auditTxt)}</div>
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

      pane.scrollTop = prevScrollTop;
      return;
    }

    const camp = window.KLB.getCampaign(state.player.id);
    const sig = `${state.campaignStepIdx}:${state.completedSteps.join(',')}:${state.favours}:${state.labBook.map(f => `${f.id}:${Math.round(f.quality || 0)}`).join(',')}`;
    if (!force && sig === lastLabBookSig) return;
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
            <button type="button" class="hud-btn" data-repurify-id="${escHtml(f.id)}" ${hasTwoFavours ? '' : 'disabled'} title="Spend 2 Favours (15m) to clean this figure to 90% quality">
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
        <button id="btn-inspect-fig" class="hud-btn" ${state.labBook.length ? '' : 'disabled'}>Inspect</button>
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
    archive = window.KLB.Sim.loadArchive();
    const cleared = Object.entries(archive.clearedChars || {});
    const discoveredMap = archive.discoveredEvents || {};
    const discoveredIds = Object.keys(discoveredMap).sort();
    const totalEvents = (window.KLB.RANDOM_EVENTS || []).length || 32;
    const sig = `${archive.totalRuns}:${archive.bestScore}:${cleared.length}:${discoveredIds.map(k => `${k}:${discoveredMap[k]}`).join(',')}`;
    if (!force && sig === lastArchiveSig) return;
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

    pane.innerHTML = `
      <section class="dossier-card">
        <h4>${icon('award', 13)}<span>KLB Archive Summary</span></h4>
        <p class="mono-muted">Runs: ${archive.totalRuns || 0} | Best Audit: ${(archive.bestScore || 0).toFixed(1)}/10 | Events: ${discoveredIds.length}/${totalEvents}</p>
      </section>
      <div class="sec-hdr"><h4>Big-Chuds Clearance (${cleared.length}/10)</h4></div>
      <ol class="step-list">
        ${window.KLB.CAST.filter(c => c.playable).map(c => {
          const sc = archive.clearedChars?.[c.id];
          return `<li class="step-item ${sc !== undefined ? 'done' : ''}" style="justify-content:space-between;">
            <span>${escHtml(c.name)}</span>
            <span class="mono-muted" style="color:${sc !== undefined ? '#86efac' : '#64748b'};">${sc !== undefined ? `${sc.toFixed(1)}/10` : 'Pending'}</span>
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

    if (roomId === 'meeting_room' && state.dayIdx === 4 && !state.fridayAuditDone) {
      const proj = rm.objects.find(o => o.type === 'projector');
      if (proj) pushTarget(proj, 'quest');
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
        const p = state.player;
        const busySet = new Set();
        for (const n of Object.values(state.npcs || {})) {
          if (n && n.roomId === roomId && n.busyObjId) busySet.add(n.busyObjId);
        }
        const candidates = rm.objects.filter(o => {
          if (!matchesSubTaskStation(o, curSub)) return false;
          if (curSub.cupboardHint && o.type === 'chem_cupboard') {
            return matchesCupboardHint(o.label || '', curSub.cupboardHint);
          }
          return true;
        });
        candidates.sort((a, b) => {
          const aChud = a.group === 'chudasama' ? 0 : 1;
          const bChud = b.group === 'chudasama' ? 0 : 1;
          if (aChud !== bChud) return aChud - bChud;
          const aBusy = busySet.has(a.id) ? 1 : 0;
          const bBusy = busySet.has(b.id) ? 1 : 0;
          if (aBusy !== bBusy) return aBusy - bBusy;
          const da = Math.hypot((a.x + a.w * 0.5) - p.x, (a.y + a.h * 0.5) - p.y);
          const db = Math.hypot((b.x + b.w * 0.5) - p.x, (b.y + b.h * 0.5) - p.y);
          return da - db;
        });
        if (candidates[0]) pushTarget(candidates[0], 'quest');
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
    }
    if (!opts.silent && window.KLB.Audio?.playSfx) {
      window.KLB.Audio.playSfx('slide_click');
    }
    if (state) syncAllHUD(true);
  }

  function bindGlobalEvents() {
    document.querySelectorAll('select').forEach(sel => {
      sel.addEventListener('change', () => sel.blur());
    });

    el('select-mutator').onchange = () => {
      selectedMutator = el('select-mutator').value || 'none';
      if (window.KLB.Audio) window.KLB.Audio.playSfx('interact');
    };
    el('btn-spectator-mode').onclick = () => startNewRun('spectator', true);

    window.addEventListener('keydown', e => {
      const modalOpen = !el('modal-backdrop').classList.contains('hidden');
      const activeTag = document.activeElement?.tagName;

      if (e.code === 'Escape') {
        if (modalOpen) {
          if (modalDismissable && modalEscapeHandler) modalEscapeHandler();
        } else {
          closeDialogue();
        }
        return;
      }

      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(activeTag)) return;

      if (e.code === 'KeyM') {
        e.preventDefault();
        toggleMute();
        return;
      }

      if (/^Digit[1-9]$/.test(e.code)) {
        const idx = e.code.replace('Digit', '');
        const scope = modalOpen ? el('modal-box') : (!el('rpg-dialogue-box').classList.contains('hidden') ? el('rpg-actions') : null);
        const btn = scope?.querySelector(`[data-hotkey="${idx}"]`);
        if (btn && !btn.disabled) { e.preventDefault(); btn.click(); return; }
      }

      if (modalOpen && e.code === 'KeyC') {
        const btnC = el('modal-box')?.querySelector('[data-hotkey="c"]');
        if (btnC && !btnC.disabled) { e.preventDefault(); btnC.click(); return; }
      }

      keysDown.add(e.code);
      if (window.KLB.Audio) window.KLB.Audio.init();

      if (!state || !el('title-screen').classList.contains('hidden')) return;

      if (e.code === 'Space' && !modalOpen) {
        e.preventDefault();
        if (document.activeElement?.tagName === 'SELECT') document.activeElement.blur();
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
    window.addEventListener('blur', () => keysDown.clear());
    window.addEventListener('beforeunload', e => {
      if (state && !state.spectatorMode && !state.gameOver && !state.postAuditCelebration) {
        saveActiveRunSnapshot(true);
        e.preventDefault();
        e.returnValue = '';
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
        specSpeed = [1, 2, 4].includes(sp) ? sp : 1;
        if (window.KLB.Audio?.playSfx) window.KLB.Audio.playSfx('ui_click');
        syncSpecSpeedUI();
      };
    });

    el('btn-mute').onclick = toggleMute;

    el('select-zoom').onchange = () => {
      cameraZoom = Number(el('select-zoom').value) || 1.0;
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
          syncSpecFollowBadge();
          if (window.KLB.Sim?.syncVisibleReactionsCache) {
            window.KLB.Sim.syncVisibleReactionsCache(state);
          }
          syncAudioAmbience();
          syncAllHUD(true);
        }
      };
    }

    document.querySelectorAll('.deck-tab').forEach(tab => {
      tab.onclick = () => setActiveDeckTab(tab.dataset.tab);
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
      const act = el('select-wa-action').value;
      const sender = state.spectatorMode ? 'daniel_richards' : state.player.id;
      if (act === 'ask') {
        const nowMono = typeof state.totalElapsedMins === 'number'
          ? state.totalElapsedMins
          : ((state.dayIdx || 0) * 1440 + (state.timeMins || 0));
        if (!state.spectatorMode && state._lastWaAskTotalMins != null && (nowMono - state._lastWaAskTotalMins) < 30) {
          const rem = Math.max(1, Math.ceil(30 - (nowMono - state._lastWaAskTotalMins)));
          showAlertBanner(`/AskBigChuds is on cooldown (${rem}m left).`, 2800, false);
          return;
        }
        const startDayIdx = state.dayIdx;
        if (!state.spectatorMode) {
          window.KLB.Sim.spendWhatsAppMinutes(state, 10, simCallbacks());
          if (!state || state.dayIdx !== startDayIdx || state.fridayFinalAuditDone || state.gameOver) return;
        }
        state._lastWaAskTotalMins = typeof state.totalElapsedMins === 'number'
          ? state.totalElapsedMins
          : ((state.dayIdx || 0) * 1440 + (state.timeMins || 0));
        const camp = window.KLB.getCampaign(sender);
        const step = camp?.steps?.[state.spectatorMode ? 0 : Math.min(4, state.campaignStepIdx)];
        const rawHint = step?.choice?.askChudsHint || 'Keep glassware oven-dried, solvents anhydrous, and collect clean spectra.';
        const resolved = resolveHintWhatsAppSender(rawHint, sender);
        window.KLB.Sim.pushWhatsApp(state, sender, `/AskBigChuds any quick tip for "${step?.title || 'Friday slides'}"?`);
        window.KLB.Sim.pushWhatsApp(state, resolved.senderId, resolved.body || rawHint);
        if (!state.spectatorMode) {
          showAlertBanner(`${resolved.speakerName} replied in WhatsApp (-10m elapsed).`, 3200, false);
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
        window.KLB.Sim.pushWhatsApp(state, sender === 'joao_nogueira' ? 'andre_shamsabadi' : sender, "POLL: Gordon's warm panini vs microwaved baked beans in chorizo fat?");
        window.KLB.Sim.pushWhatsApp(state, 'joao_nogueira', 'Anything except cold wet triangle sandwiches.');
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
        const job = state.activeStationJobs.find(j => j.canOvercook) || state.activeStationJobs[0];
        state.favours -= 1;
        removeStationJob(job.id);
        window.KLB.Sim.pushWhatsApp(state, state.player.id, '@Nafsika stuck offsite — can you pull my flask into the 4 C fridge?');
        window.KLB.Sim.pushWhatsApp(state, 'nafsika_forte', 'Nafsika got it — pulled and tucked onto the 4 C shelf for you.');
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
            forceFlawNote: 'Remotely quenched and refrigerated at 4 C by Nafsika Forte.'
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
      if (!state || state.spectatorMode || state.paused || state.isPaused || !el('modal-backdrop').classList.contains('hidden')) return;
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
      const resolvedHits = tileHits.length ? tileHits : (cell.obj ? [cell.obj] : []);

      // Direct adjacent click on NPC
      if (cell.npc && Math.hypot(cell.npc.x - state.player.x, cell.npc.y - state.player.y) <= 2.35) {
        const ndx = cell.npc.x - state.player.x;
        const ndy = cell.npc.y - state.player.y;
        state.player.dir = Math.abs(ndx) >= Math.abs(ndy) ? (ndx < 0 ? 'W' : 'E') : (ndy < 0 ? 'N' : 'S');
        interactWithNPC(cell.npc);
        return;
      }

      // Clicking a meeting_room chair walks directly onto the chair tile and faces the projector
      if (cell.obj && cell.obj.type === 'chair' && state.player.roomId === 'meeting_room') {
        if (window.KLB.Sim.isCellWalkable(state.player.roomId, cell.obj.x, cell.obj.y, state.fireAlarm.active)) {
          if (Math.hypot(cell.obj.x - state.player.x, cell.obj.y - state.player.y) <= 0.35) {
            state.player.x = cell.obj.x;
            state.player.y = cell.obj.y;
            state.player.dir = cell.obj.dir || 'N';
            if (window.KLB.Audio?.playSfx) window.KLB.Audio.playSfx('ui_click');
            return;
          }
          const chairPath = window.KLB.Sim.findPathBFS(state.player.roomId, state.player.x, state.player.y, cell.obj.x, cell.obj.y, 65, state, state.player.id);
          if (chairPath && chairPath.length > 0) {
            if (state.activePlayerAction) cancelActivePlayerAction();
            state.player.autoPath = chairPath;
            state.player.walkTarget = { x: cell.obj.x, y: cell.obj.y };
            state.player.pendingInteract = { sitChair: cell.obj };
            if (window.KLB.Audio?.playSfx) window.KLB.Audio.playSfx('ui_click');
            if (window.KLB.Renderer25D.triggerClickRipple) {
              window.KLB.Renderer25D.triggerClickRipple(cell.obj.x, cell.obj.y, 'interact');
            }
            return;
          }
        }
      }

      // Direct adjacent click on Object
      if (Math.hypot(dx, dy) <= 1.85) {
        state.player.dir = Math.abs(dx) >= Math.abs(dy) ? (dx < 0 ? 'W' : 'E') : (dy < 0 ? 'N' : 'S');
        if (cell.obj && cell.obj.type !== 'npc_marker') {
          if (window.KLB.Audio?.playSfx) window.KLB.Audio.playSfx('interact');
          interactWithObject(cell.obj, resolvedHits);
          return;
        }
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
      } else if (cell.obj && cell.obj.type !== 'npc_marker') {
        const free = window.KLB.Sim.findFreeAdjacentWalkable(state, state.player.roomId, cell.obj, state.player.id);
        if (free) { goalX = free.x; goalY = free.y; pending = { obj: cell.obj, allHits: resolvedHits }; }
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
  }

  let hudTimer = 0;
  let fastBarTimer = 0;
  function masterLoop(now) {
    const dt = Math.min(0.08, Math.max(0.001, (now - lastFrameTs) / 1000));
    lastFrameTs = now;

    if (!el('title-screen').classList.contains('hidden')) {
      dossierAnimTimer += dt;
      drawDossierSprite();
    } else if (state) {
      const waCountBefore = (state.whatsapp || []).length;
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
      const waListNow = state.whatsapp || [];
      if (!state.spectatorMode && waListNow.length > waCountBefore) {
        const addedWa = waListNow.slice(waCountBefore);
        if (addedWa.some(m => !m.isSelf) && window.KLB.Audio?.playSfx) {
          window.KLB.Audio.playSfx('whatsapp');
        }
      }

      const viewRoom = getViewRoom();
      const target = getFacingTarget();
      el('hud-hover-hint').textContent = state.spectatorMode
        ? `Observing ${window.KLB.ROOM_META[viewRoom]?.shortName || viewRoom}${specSpeed > 1 ? ` (${specSpeed}x)` : ''}`
        : target.npc
          ? `Talk: ${window.KLB.CAST_BY_ID[target.npc.id]?.shortName || target.npc.id} [E]`
          : target.obj
            ? `Use: ${target.obj.label || niceStationName(target.obj.type)} [E]`
            : (window.KLB.ROOM_META[viewRoom]?.shortName || 'KLB');

      const canvas = el('world-canvas');
      if (window.KLB.Renderer25D?.render) {
        const modalOpen = !el('modal-backdrop').classList.contains('hidden');
        const roomJobs = state.spectatorMode ? [] : (state.activeStationJobs || []).filter(r => r.roomId === viewRoom);
        const npcRxns = window.KLB.Sim.getVisibleNPCReactions(state, viewRoom);
        const npcActs = window.KLB.Sim.getVisibleNPCActions(state, viewRoom);
        const seenNpcKeys = new Set(npcRxns.map(r => `${r.npcId || r.ownerId}:${r.objId || r.id}`));
        const mergedNpcActivity = npcRxns.concat(npcActs.filter(a => !seenNpcKeys.has(`${a.npcId || a.ownerId}:${a.objId || a.id}`)));

        window.KLB.Renderer25D.render(canvas, {
          room: window.KLB.WORLD_MAPS.rooms[viewRoom],
          roomId: viewRoom,
          timeMins: state.timeMins,
          weather: state.weatherMode,
          paused: Boolean(state.paused || state.isPaused),
          modalOpen,
          fireAlarmActive: state.fireAlarm.active,
          lotrPlaying: state.lotrPlaying,
          thiolDirty: Boolean(state.prep?.thiol_dirty),
          carryingProp: getPlayerCarryingProp(),
          cameraTarget: state.spectatorMode ? specCameraPos : null,
          player: state.spectatorMode ? null : state.player,
          npcs: Object.values(state.npcs).filter(n => n.roomId === viewRoom),
          activeStationJobs: roomJobs,
          activeReactions: roomJobs,
          activePlayerAction: state.spectatorMode ? null : state.activePlayerAction,
          npcReactions: mergedNpcActivity,
          highlightedObjId: state.spectatorMode ? null : (target.obj?.id || null),
          highlightedNpcId: state.spectatorMode ? null : (target.npc?.id || null),
          walkTarget: state.spectatorMode ? null : (state.player.walkTarget || null),
          questTargetObjIds: computeWayfindingTargets(),
          cameraZoom,
          speechBubbles: state.speechBubbles.filter(b => b.roomId === viewRoom)
        });
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

    requestAnimationFrame(masterLoop);
  }

  window.addEventListener('DOMContentLoaded', boot);
})();
