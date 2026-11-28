// KLB Simulator — Pure Procedural WebAudio Soundscape & Retro Lab Synth Engine
// Classic browser script attaching to window.KLB.Audio (zero external audio files, zero build step)
(() => {
  const root = typeof window !== 'undefined' ? window : globalThis;
  root.KLB = root.KLB || {};

  const AUDIO_PREFS_KEY = 'klb_audio_prefs_v1';
  const WA_PING_COOLDOWN_MS = 120;
  const UNLOCK_EVENTS = ['pointerdown', 'keydown', 'mousedown', 'touchstart'];

  let ctx = null;
  let masterGain = null;
  let masterCompressor = null;
  let noiseBuffer = null;

  // Master settings
  let volume = 0.65;
  let muted = false;
  let paused = false;
  let stopped = false;
  let initialized = false;
  let unlockBound = false;
  let unlocked = false;
  let unlockHandler = null;
  let visibilityBound = false;
  let lastWaPingAtMs = -Infinity;

  function loadAudioPrefs() {
    try {
      const storage = typeof localStorage !== 'undefined'
        ? localStorage
        : (typeof window !== 'undefined' ? window.localStorage : null);
      if (!storage || typeof storage.getItem !== 'function') return;
      const raw = storage.getItem(AUDIO_PREFS_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        if (typeof parsed.muted === 'boolean') {
          muted = parsed.muted;
        }
        if (typeof parsed.volume === 'number' && Number.isFinite(parsed.volume)) {
          volume = Math.max(0, Math.min(1, parsed.volume));
        }
      }
    } catch (_) {}
  }

  function saveAudioPrefs() {
    try {
      const storage = typeof localStorage !== 'undefined'
        ? localStorage
        : (typeof window !== 'undefined' ? window.localStorage : null);
      if (!storage || typeof storage.setItem !== 'function') return;
      storage.setItem(AUDIO_PREFS_KEY, JSON.stringify({ muted, volume }));
    } catch (_) {}
  }

  loadAudioPrefs();

  // Current room / hazard / music ambience state
  const ambienceState = {
    roomId: 'klb_2f',
    headphonesOn: false,
    lotrOn: false,
    fireAlarmOn: false,
    alexPursuitOn: false
  };

  // Continuous WebAudio nodes
  // extractorNodes is kept permanently dormant (gain = 0, no looping static noise source)
  let extractorNodes = null; // { src: null, hpFilter: null, lpFilter: null, gain }
  let facilityNodes = null;  // { osc, lp, gain } — pure sine room tone (meeting_room / CIB)
  let cafeFilter = null;     // BiquadFilterNode (420 Hz headphones / 6000 Hz open)
  let alarmBusGain = null;   // Dedicated fire-alarm bus for instant pause silence
  let pursuitBusGain = null; // Dedicated pursuit ostinato bus for instant pause silence

  // Periodic scheduler timers
  let roomAmbientTimer = null;
  let activeAmbientRoom = null;
  let chatterTimer = null;
  let lotrTimer = null;
  let cafeTimer = null;
  let alarmTimer = null;
  let pursuitTimer = null;

  // Musical loop cursors
  let lotrStep = 0;
  let cafeStep = 0;
  let pursuitStep = 0;
  let alarmHighPhase = false;

  // Short filtered transient buffer used ONLY for brief one-shot SFX (never continuous ambience!)
  function createShortSfxNoiseBuffer(audioCtx) {
    const sampleRate = audioCtx.sampleRate || 44100;
    const length = Math.max(4096, Math.floor(sampleRate * 1.5));
    const buffer = audioCtx.createBuffer(1, length, sampleRate);
    const data = buffer.getChannelData(0);

    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    let brown = 0;
    for (let i = 0; i < length; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      const pink = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.09;
      b6 = white * 0.115926;

      brown = (brown + 0.02 * white) / 1.02;
      const sample = pink * 0.72 + brown * 1.35;
      data[i] = Math.max(-0.98, Math.min(0.98, sample));
    }
    return buffer;
  }

  function ensureSfxNoiseBuffer() {
    if (!ctx) return null;
    if (!noiseBuffer && typeof ctx.createBuffer === 'function') {
      noiseBuffer = createShortSfxNoiseBuffer(ctx);
    }
    return noiseBuffer;
  }

  function detachUnlockListeners() {
    if (unlockHandler && typeof window !== 'undefined' && typeof window.removeEventListener === 'function') {
      UNLOCK_EVENTS.forEach(evt => {
        window.removeEventListener(evt, unlockHandler);
      });
    }
    unlockBound = false;
  }

  function markUnlocked() {
    if (unlocked) return false;
    unlocked = true;
    detachUnlockListeners();
    return true;
  }

  function ensureContext() {
    if (!ctx) {
      const audioScope = typeof window !== 'undefined' ? window : globalThis;
      const AudioCtx = audioScope.AudioContext || audioScope.webkitAudioContext;
      if (!AudioCtx) return null;
      ctx = new AudioCtx();
      masterGain = ctx.createGain();
      masterGain.gain.value = muted ? 0 : volume;
      if (typeof ctx.createDynamicsCompressor === 'function') {
        masterCompressor = ctx.createDynamicsCompressor();
        if (masterCompressor.threshold) masterCompressor.threshold.value = -14;
        if (masterCompressor.knee) masterCompressor.knee.value = 18;
        if (masterCompressor.ratio) masterCompressor.ratio.value = 4;
        if (masterCompressor.attack) masterCompressor.attack.value = 0.005;
        if (masterCompressor.release) masterCompressor.release.value = 0.15;
        masterGain.connect(masterCompressor);
        masterCompressor.connect(ctx.destination);
      } else {
        masterGain.connect(ctx.destination);
      }
    }
    if (ctx.state === 'running') {
      markUnlocked();
    } else if (ctx.state === 'suspended' && typeof ctx.resume === 'function') {
      ctx.resume().then(() => {
        if (ctx && ctx.state === 'running' && markUnlocked() && !stopped) {
          syncAllAmbienceLayers();
        }
      }).catch(() => {});
    }
    return ctx;
  }

  function clearNonUrgentTimers() {
    clearTimeout(roomAmbientTimer);
    roomAmbientTimer = null;
    activeAmbientRoom = null;
    clearTimeout(chatterTimer);
    chatterTimer = null;
    clearInterval(lotrTimer);
    lotrTimer = null;
    clearInterval(cafeTimer);
    cafeTimer = null;
  }

  function clearUrgentTimers() {
    clearInterval(alarmTimer);
    alarmTimer = null;
    clearInterval(pursuitTimer);
    pursuitTimer = null;
  }

  function clearAmbientTimers() {
    clearNonUrgentTimers();
    clearUrgentTimers();
  }

  function onVisibilityChange() {
    if (!ctx || typeof document === 'undefined') return;
    if (document.hidden) {
      if (ctx.state === 'running' && typeof ctx.suspend === 'function') {
        ctx.suspend().catch(() => {});
      }
    } else if (!muted && !stopped) {
      if (ctx.state === 'suspended' && typeof ctx.resume === 'function') {
        ctx.resume().then(() => {
          if (!stopped && !muted) {
            syncAllAmbienceLayers();
          }
        }).catch(() => {});
      }
    }
  }

  function bindVisibilityListener() {
    if (visibilityBound || typeof document === 'undefined' || !document || typeof document.addEventListener !== 'function') return;
    visibilityBound = true;
    document.addEventListener('visibilitychange', onVisibilityChange);
  }

  function bindAutoUnlock() {
    bindVisibilityListener();
    if (unlocked || (ctx && ctx.state === 'running')) {
      markUnlocked();
      return;
    }
    if (unlockBound || typeof window === 'undefined' || !window || typeof window.addEventListener !== 'function') return;
    unlockBound = true;

    unlockHandler = () => {
      if (unlocked || (ctx && ctx.state === 'running')) {
        markUnlocked();
        return;
      }
      const audioCtx = ensureContext();
      if (!audioCtx) return;
      if (audioCtx.state === 'running') {
        markUnlocked();
        if (!stopped) syncAllAmbienceLayers();
      } else if (audioCtx.state === 'suspended' && typeof audioCtx.resume === 'function') {
        audioCtx.resume().then(() => {
          if (audioCtx.state === 'running' && markUnlocked() && !stopped) {
            syncAllAmbienceLayers();
          }
        }).catch(() => {});
      }
    };

    UNLOCK_EVENTS.forEach(evt => {
      window.addEventListener(evt, unlockHandler, { passive: true });
    });
  }

  function init() {
    initialized = true;
    bindAutoUnlock();
    bindVisibilityListener();
    const audioCtx = ensureContext();
    if (audioCtx && audioCtx.state === 'running') {
      markUnlocked();
      if (!stopped) syncAllAmbienceLayers();
    }
  }

  // Smoothly update master gain
  function syncMasterGain() {
    if (!ctx || !masterGain) return;
    const now = ctx.currentTime;
    const target = muted ? 0 : Math.max(0, Math.min(1, volume));
    masterGain.gain.cancelScheduledValues(now);
    masterGain.gain.setTargetAtTime(target, now, 0.04);
  }

  // ==================== 1. DORMANT EXTRACTOR (ZERO STATIC HISS) & PURE SINE ROOM TONE ====================
  function ensureExtractorGraph() {
    // Permanently dormant: never create or start a looping static noise buffer.
    // Keeps extractorNodes safely dormant with gain = 0 so zero constant white/pink/brown hiss ever plays.
    if (!ctx) return null;
    if (!extractorNodes) {
      const gain = ctx.createGain();
      gain.gain.value = 0.0;
      extractorNodes = { src: null, hpFilter: null, lpFilter: null, gain };
    }
    return extractorNodes;
  }

  function ensureFacilityHumGraph() {
    if (!ctx) return null;
    if (facilityNodes) return facilityNodes;

    const osc = ctx.createOscillator();
    osc.type = 'sine'; // Pure sine — zero broadband noise or harmonic buzz
    osc.frequency.value = getTargetFacilityFreq() || 92;

    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.value = 220;

    const gain = ctx.createGain();
    gain.gain.value = 0.0;

    osc.connect(lp);
    lp.connect(gain);
    gain.connect(masterGain);
    osc.start();

    facilityNodes = { osc, lp, gain };
    return facilityNodes;
  }

  function ensureCafeFilter() {
    if (!ctx || !masterGain) return null;
    if (!cafeFilter) {
      cafeFilter = ctx.createBiquadFilter();
      cafeFilter.type = 'lowpass';
      cafeFilter.frequency.value = ambienceState.headphonesOn ? 420 : 6000;
      cafeFilter.Q.value = 0.75;
      cafeFilter.connect(masterGain);
    }
    return cafeFilter;
  }

  function ensureAlarmBusGain() {
    if (!ctx || !masterGain) return null;
    if (!alarmBusGain) {
      alarmBusGain = ctx.createGain();
      alarmBusGain.gain.value = 1.0;
      alarmBusGain.connect(masterGain);
    }
    return alarmBusGain;
  }

  function ensurePursuitBusGain() {
    if (!ctx || !masterGain) return null;
    if (!pursuitBusGain) {
      pursuitBusGain = ctx.createGain();
      pursuitBusGain.gain.value = 1.0;
      pursuitBusGain.connect(masterGain);
    }
    return pursuitBusGain;
  }

  function createMuffledOutput(normalCutoff, headphoneCutoff = 420) {
    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.value = ambienceState.headphonesOn ? headphoneCutoff : normalCutoff;
    lp.connect(masterGain);
    return lp;
  }

  function playAmbientTone(dest, type, freqStart, freqEnd, startTime, duration, peakGain) {
    if (!ctx || !dest || peakGain <= 0.0001) return;
    const osc = ctx.createOscillator();
    osc.type = type;
    osc.frequency.setValueAtTime(Math.max(20, freqStart), startTime);
    if (freqEnd && freqEnd !== freqStart) {
      osc.frequency.exponentialRampToValueAtTime(Math.max(20, freqEnd), startTime + duration);
    }

    const env = ctx.createGain();
    const attack = Math.min(0.012, duration * 0.25);
    env.gain.setValueAtTime(0.0001, startTime);
    env.gain.linearRampToValueAtTime(Math.max(0.0002, peakGain), startTime + attack);
    env.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    osc.connect(env);
    env.connect(dest);
    osc.start(startTime);
    osc.stop(startTime + duration + 0.02);
  }

  // ==================== 2. CLEAN, NON-HISSY ATMOSPHERIC SOUNDSCAPES (ALL 6 ROOMS) ====================

  // 2a. KLB 2F: Sparse organic glassware clinks / quiet distant ambient pings (zero static hiss!)
  function triggerKlb2fAmbience() {
    if (!ctx || ctx.state !== 'running' || muted || paused || stopped) return;
    if (ambienceState.roomId !== 'klb_2f' || ambienceState.fireAlarmOn) return;

    const now = ctx.currentTime + 0.015;
    const out = createMuffledOutput(4800, 380);
    const scale = ambienceState.headphonesOn ? 0.30 : 1.0;
    const roll = Math.random();

    if (roll < 0.48) {
      // Subtle borosilicate glassware clink (pure resonant sine harmonics)
      const f1 = 2520 + Math.random() * 580;
      playAmbientTone(out, 'sine', f1, f1 * 0.992, now, 0.11, 0.011 * scale);
      playAmbientTone(out, 'sine', f1 * 1.52, f1 * 1.50, now, 0.065, 0.0045 * scale);
      if (Math.random() < 0.4) {
        const t2 = now + 0.08 + Math.random() * 0.05;
        const f2 = f1 * 0.89;
        playAmbientTone(out, 'sine', f2, f2 * 0.99, t2, 0.095, 0.0075 * scale);
      }
    } else if (roll < 0.80) {
      // Quiet distant ambient instrument / timer ping
      const pingFreq = Math.random() < 0.5 ? 1318.5 : 1567.98;
      playAmbientTone(out, 'sine', pingFreq, pingFreq, now, 0.14, 0.008 * scale);
      if (Math.random() < 0.35) {
        playAmbientTone(out, 'sine', pingFreq * 1.25, pingFreq * 1.25, now + 0.12, 0.13, 0.006 * scale);
      }
    } else {
      // Gentle distant bench stir/pipette click
      playAmbientTone(out, 'triangle', 840, 480, now, 0.024, 0.009 * scale);
      playAmbientTone(out, 'sine', 1620, 1280, now + 0.012, 0.022, 0.0045 * scale);
    }
  }

  // 2b. KLB 3F: Ultra-subtle sparse soft mechanical keyboard taps + occasional distant kettle click
  function triggerKlb3fAmbience() {
    if (!ctx || ctx.state !== 'running' || muted || paused || stopped) return;
    if (ambienceState.roomId !== 'klb_3f' || ambienceState.fireAlarmOn) return;

    const now = ctx.currentTime + 0.015;
    const out = createMuffledOutput(3200, 420);
    const scale = ambienceState.headphonesOn ? 0.28 : 1.0;

    if (Math.random() < 0.78) {
      // Soft muted mechanical keyboard tap burst (2–5 gentle percussive ticks)
      const taps = 2 + Math.floor(Math.random() * 4);
      let t = now;
      for (let i = 0; i < taps; i++) {
        const bodyFreq = 320 + Math.random() * 140;
        const clickFreq = 1650 + Math.random() * 520;
        const amp = (0.75 + Math.random() * 0.45) * scale;
        playAmbientTone(out, 'triangle', bodyFreq, 135, t, 0.018, 0.013 * amp);
        playAmbientTone(out, 'sine', clickFreq, clickFreq * 0.55, t, 0.012, 0.0065 * amp);
        t += 0.068 + Math.random() * 0.072;
      }
    } else {
      // Occasional distant kettle switch click (crisp warm toggle snap — zero static!)
      playAmbientTone(out, 'triangle', 1180, 620, now, 0.022, 0.012 * scale);
      playAmbientTone(out, 'sine', 540, 390, now + 0.018, 0.055, 0.0065 * scale);
    }
  }

  // 2c. Meeting Room: Occasional gentle paper/clicker rustle (paired with 110 Hz pure sine hum)
  function triggerMeetingRoomAmbience() {
    if (!ctx || ctx.state !== 'running' || muted || paused || stopped) return;
    if (ambienceState.roomId !== 'meeting_room' || ambienceState.fireAlarmOn) return;

    const now = ctx.currentTime + 0.015;
    const out = createMuffledOutput(3400, 420);
    const scale = ambienceState.headphonesOn ? 0.30 : 1.0;

    if (Math.random() < 0.50) {
      // Gentle laser slide-clicker tick
      playAmbientTone(out, 'triangle', 1740, 1140, now, 0.017, 0.011 * scale);
      if (Math.random() < 0.45) {
        playAmbientTone(out, 'sine', 1240, 960, now + 0.026, 0.018, 0.006 * scale);
      }
    } else {
      // Gentle organic paper page-turn rustle (soft overlapping tonal flutters — zero harsh static!)
      const layers = 3;
      for (let i = 0; i < layers; i++) {
        const t = now + i * 0.032;
        const fStart = 390 + i * 115 + Math.random() * 75;
        const fEnd = fStart * (0.72 + Math.random() * 0.18);
        playAmbientTone(out, 'sine', fStart, fEnd, t, 0.078, 0.0065 * scale);
      }
    }
  }

  // 2d. Gordon's Café: Warm crisp porcelain cup & saucer clinks (ZERO espresso steam hiss!)
  function triggerCafeCupClink() {
    if (!ctx || ctx.state !== 'running' || muted || paused || stopped) return;
    if (ambienceState.roomId !== 'gordons_cafe' || ambienceState.fireAlarmOn) return;

    const out = ensureCafeFilter();
    if (!out) return;
    const now = ctx.currentTime + 0.015;
    const baseFreq = 2680 + Math.random() * 440;

    playAmbientTone(out, 'sine', baseFreq, baseFreq * 0.992, now, 0.15, 0.016);
    playAmbientTone(out, 'sine', baseFreq * 1.54, baseFreq * 1.52, now, 0.085, 0.0055);
    if (Math.random() < 0.55) {
      const t2 = now + 0.095 + Math.random() * 0.05;
      const f2 = baseFreq * 0.84;
      playAmbientTone(out, 'sine', f2, f2 * 0.99, t2, 0.12, 0.010);
    }
  }

  // 2e. CIB LG11 Mass Spec: Occasional subtle autosampler click (ZERO broadband noise!)
  function triggerLg11MsAmbience() {
    if (!ctx || ctx.state !== 'running' || muted || paused || stopped) return;
    if (ambienceState.roomId !== 'cib_lg11_ms' || ambienceState.fireAlarmOn) return;

    const now = ctx.currentTime + 0.015;
    const out = createMuffledOutput(3600, 420);
    const scale = ambienceState.headphonesOn ? 0.35 : 1.0;

    // Precision autosampler carousel step + vial seat click
    playAmbientTone(out, 'triangle', 1260, 720, now, 0.018, 0.012 * scale);
    playAmbientTone(out, 'sine', 1840, 1420, now + 0.075, 0.022, 0.0085 * scale);
    if (Math.random() < 0.45) {
      playAmbientTone(out, 'sine', 2360, 2320, now + 0.13, 0.055, 0.006 * scale);
    }
  }

  // 2f. CIB LG1b NMR: Occasional gentle pneumatic valve chirp (ZERO broadband noise!)
  function triggerLg1bNmrAmbience() {
    if (!ctx || ctx.state !== 'running' || muted || paused || stopped) return;
    if (ambienceState.roomId !== 'cib_lg1b_nmr' || ambienceState.fireAlarmOn) return;

    const now = ctx.currentTime + 0.015;
    const out = createMuffledOutput(3600, 420);
    const scale = ambienceState.headphonesOn ? 0.35 : 1.0;

    // Soft pneumatic sample-lift / shim valve pure sine chirp
    playAmbientTone(out, 'sine', 430, 680, now, 0.078, 0.0105 * scale);
    playAmbientTone(out, 'sine', 860, 740, now + 0.06, 0.095, 0.0055 * scale);
  }

  function getRoomAmbientDelayMs(roomId) {
    switch (roomId) {
      case 'klb_2f':       return 3600 + Math.random() * 4000; // 3.6–7.6s
      case 'klb_3f':       return 2500 + Math.random() * 3500; // 2.5–6.0s
      case 'meeting_room': return 5000 + Math.random() * 5000; // 5.0–10.0s
      case 'gordons_cafe': return 4800 + Math.random() * 5000; // 4.8–9.8s
      case 'cib_lg11_ms':  return 3800 + Math.random() * 4400; // 3.8–8.2s
      case 'cib_lg1b_nmr': return 4200 + Math.random() * 4600; // 4.2–8.8s
      default:             return 5000;
    }
  }

  function triggerCurrentRoomAmbience(roomId) {
    switch (roomId) {
      case 'klb_2f':       triggerKlb2fAmbience(); break;
      case 'klb_3f':       triggerKlb3fAmbience(); break;
      case 'meeting_room': triggerMeetingRoomAmbience(); break;
      case 'gordons_cafe': triggerCafeCupClink(); break;
      case 'cib_lg11_ms':  triggerLg11MsAmbience(); break;
      case 'cib_lg1b_nmr': triggerLg1bNmrAmbience(); break;
      default: break;
    }
  }

  function scheduleNextRoomAmbience() {
    clearTimeout(roomAmbientTimer);
    roomAmbientTimer = null;
    if (paused || stopped || muted || ambienceState.fireAlarmOn) {
      activeAmbientRoom = null;
      return;
    }
    const targetRoom = ambienceState.roomId;
    activeAmbientRoom = targetRoom;
    const delayMs = getRoomAmbientDelayMs(targetRoom);
    roomAmbientTimer = setTimeout(() => {
      roomAmbientTimer = null;
      if (paused || stopped || muted || ambienceState.fireAlarmOn || ambienceState.roomId !== targetRoom) return;
      triggerCurrentRoomAmbience(targetRoom);
      scheduleNextRoomAmbience();
    }, delayMs);
  }

  // ==================== 2g. CHARLOTTE'S BENCH CHATTER BURSTS (KLB 2F, NON-NOISE FORMANTS) ====================
  function triggerChatterBurst() {
    if (!ctx || ctx.state !== 'running' || muted || paused || stopped) return;
    if (ambienceState.roomId !== 'klb_2f' || ambienceState.fireAlarmOn) return;

    const now = ctx.currentTime;
    const syllables = 4 + Math.floor(Math.random() * 4);
    // Drop chatter gain by 85% when Headphones are on!
    const baseGain = ambienceState.headphonesOn ? (0.032 * 0.15) : 0.032;

    const muffleFilter = ctx.createBiquadFilter();
    muffleFilter.type = 'lowpass';
    muffleFilter.frequency.value = ambienceState.headphonesOn ? 340 : 2800;
    muffleFilter.connect(masterGain);

    let t = now + 0.02;
    for (let i = 0; i < syllables; i++) {
      const dur = 0.055 + Math.random() * 0.055;
      const gap = 0.025 + Math.random() * 0.045;
      const pitch = 235 + Math.random() * 95 + (i === syllables - 1 ? 35 : 0);

      const osc = ctx.createOscillator();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(pitch, t);
      osc.frequency.linearRampToValueAtTime(pitch * (0.94 + Math.random() * 0.14), t + dur);

      // High-formant vowel resonance (F1/F2 vocal character)
      const formant = ctx.createBiquadFilter();
      formant.type = 'bandpass';
      formant.frequency.setValueAtTime(950 + Math.random() * 1150, t);
      formant.Q.value = 4.2;

      const env = ctx.createGain();
      env.gain.setValueAtTime(0.0001, t);
      env.gain.linearRampToValueAtTime(baseGain * (0.75 + Math.random() * 0.35), t + 0.014);
      env.gain.exponentialRampToValueAtTime(0.0001, t + dur);

      osc.connect(formant);
      formant.connect(env);
      env.connect(muffleFilter);

      osc.start(t);
      osc.stop(t + dur + 0.02);
      t += dur + gap;
    }
  }

  function scheduleNextChatter() {
    clearTimeout(chatterTimer);
    chatterTimer = null;
    if (paused || stopped || muted || ambienceState.roomId !== 'klb_2f' || ambienceState.fireAlarmOn) return;
    const delayMs = 4200 + Math.random() * 4400;
    chatterTimer = setTimeout(() => {
      chatterTimer = null;
      triggerChatterBurst();
      scheduleNextChatter();
    }, delayMs);
  }

  // ==================== 3. PASTORAL SHIRE / RIVENDELL FOLK SYNTH LOOP ====================
  // D-major / D-Dorian pastoral folk flute + warm Celtic harp arpeggio (16-step phrase)
  const LOTR_HARP_NOTES = [
    293.66, 440.00, 587.33, 739.99, // D4  A4  D5  F#5
    392.00, 587.33, 783.99, 987.77, // G4  D5  G5  B5
    246.94, 369.99, 493.88, 739.99, // B3  F#4 B4  F#5
    220.00, 329.63, 440.00, 659.25  // A3  E4  A4  E5
  ];
  const LOTR_FLUTE_MELODY = [
    587.33, null,   659.25, 739.99, // D5  -   E5  F#5
    880.00, null,   783.99, 739.99, // A5  -   G5  F#5
    659.25, 739.99, 587.33, null,   // E5  F#5 D5  -
    493.88, 587.33, 440.00, null    // B4  D5  A4  -
  ];

  function playLotrStep() {
    if (!ctx || ctx.state !== 'running' || muted || paused || stopped || !ambienceState.lotrOn) return;
    if (ambienceState.fireAlarmOn) return;

    const baseRoomScale = ambienceState.roomId === 'klb_2f' ? 1.0
      : (ambienceState.roomId === 'klb_3f' ? 0.55 : 0.0);
    if (baseRoomScale <= 0) return;

    const headphoneScale = ambienceState.headphonesOn ? 0.55 : 1.0;
    const roomScale = baseRoomScale * headphoneScale;

    const now = ctx.currentTime + 0.015;
    const idx = lotrStep % 16;
    lotrStep++;

    // Gentle acoustic room / headphone muffle filter
    const outFilter = ctx.createBiquadFilter();
    outFilter.type = 'lowpass';
    outFilter.frequency.value = ambienceState.headphonesOn ? 580 : 3400;
    outFilter.connect(masterGain);

    // 1) Warm plucked harp arpeggio note
    const harpFreq = LOTR_HARP_NOTES[idx];
    if (harpFreq) {
      const hOsc = ctx.createOscillator();
      hOsc.type = 'triangle';
      hOsc.frequency.setValueAtTime(harpFreq, now);

      const hGain = ctx.createGain();
      const peak = 0.036 * roomScale;
      hGain.gain.setValueAtTime(0.0001, now);
      hGain.gain.linearRampToValueAtTime(peak, now + 0.012);
      hGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.72);

      hOsc.connect(hGain);
      hGain.connect(outFilter);
      hOsc.start(now);
      hOsc.stop(now + 0.75);
    }

    // 2) Pastoral wooden flute melody note with soft vibrato
    const fluteFreq = LOTR_FLUTE_MELODY[idx];
    if (fluteFreq) {
      const fOsc = ctx.createOscillator();
      fOsc.type = 'sine';
      fOsc.frequency.setValueAtTime(fluteFreq, now);

      const vib = ctx.createOscillator();
      const vibGain = ctx.createGain();
      vib.frequency.value = 5.2;
      vibGain.gain.value = fluteFreq * 0.007;
      vib.connect(vibGain);
      vibGain.connect(fOsc.frequency);

      const fGain = ctx.createGain();
      const fPeak = 0.045 * roomScale;
      fGain.gain.setValueAtTime(0.0001, now);
      fGain.gain.linearRampToValueAtTime(fPeak, now + 0.065);
      fGain.gain.setTargetAtTime(fPeak * 0.72, now + 0.12, 0.14);
      fGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.62);

      fOsc.connect(fGain);
      fGain.connect(outFilter);

      vib.start(now);
      fOsc.start(now);
      vib.stop(now + 0.65);
      fOsc.stop(now + 0.65);
    }
  }

  // ==================== 4. GORDON'S CAFÉ JAZZ RHODES (HEADPHONE-MUFFLED, ZERO STEAM HISS) ====================
  const CAFE_CHORDS = [
    [293.66, 349.23, 440.00, 523.25, 659.25], // Dm9
    [196.00, 329.63, 349.23, 493.88, 587.33], // G13
    [261.63, 329.63, 392.00, 493.88, 587.33], // Cmaj9
    [220.00, 329.63, 392.00, 466.16, 554.37]  // A7alt
  ];

  function playCafeChordStep() {
    if (!ctx || ctx.state !== 'running' || muted || paused || stopped || ambienceState.roomId !== 'gordons_cafe') return;
    if (ambienceState.fireAlarmOn) return;

    const lp = ensureCafeFilter();
    if (!lp) return;

    const now = ctx.currentTime + 0.02;
    const chord = CAFE_CHORDS[cafeStep % CAFE_CHORDS.length];
    cafeStep++;

    chord.forEach((freq, i) => {
      const t = now + i * 0.038; // Soft rolled Rhodes strum
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);

      // Subtle Rhodes tine overtone on attack
      const tine = ctx.createOscillator();
      tine.type = 'triangle';
      tine.frequency.setValueAtTime(freq * 2, t);

      const env = ctx.createGain();
      env.gain.setValueAtTime(0.0001, t);
      env.gain.linearRampToValueAtTime(0.026, t + 0.025);
      env.gain.exponentialRampToValueAtTime(0.0001, t + 2.35);

      const tineEnv = ctx.createGain();
      tineEnv.gain.setValueAtTime(0.0001, t);
      tineEnv.gain.linearRampToValueAtTime(0.006, t + 0.01);
      tineEnv.gain.exponentialRampToValueAtTime(0.0001, t + 0.28);

      osc.connect(env);
      tine.connect(tineEnv);
      env.connect(lp);
      tineEnv.connect(lp);

      osc.start(t);
      tine.start(t);
      osc.stop(t + 2.4);
      tine.stop(t + 0.32);
    });
  }

  // ==================== 5. UK LAB TWIN-TONE FIRE ALARM (800 / 970 Hz — PAUSES WHEN PAUSED) ====================
  function playFireAlarmPulse() {
    if (!ambienceState.fireAlarmOn || paused || muted || stopped) return;
    if (!ctx || ctx.state !== 'running') return;

    const alarmOut = ensureAlarmBusGain();
    if (!alarmOut) return;

    const now = ctx.currentTime + 0.01;
    // Intermittent twin-tone burst: 5 alternating pulses (800 Hz / 970 Hz) then brief gap
    const freq = alarmHighPhase ? 970 : 800;
    alarmHighPhase = !alarmHighPhase;

    const osc = ctx.createOscillator();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, now);

    // Slight harmonic edge for authentic BS 5839 electronic sounder without harshness
    const osc2 = ctx.createOscillator();
    osc2.type = 'sawtooth';
    osc2.frequency.setValueAtTime(freq, now);

    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.value = ambienceState.headphonesOn ? 920 : 1950;

    const env = ctx.createGain();
    const comfortableGain = ambienceState.headphonesOn ? 0.045 : 0.072;
    env.gain.setValueAtTime(0.0001, now);
    env.gain.linearRampToValueAtTime(comfortableGain, now + 0.015);
    env.gain.setValueAtTime(comfortableGain, now + 0.21);
    env.gain.exponentialRampToValueAtTime(0.0001, now + 0.245);

    const mix2 = ctx.createGain();
    mix2.gain.value = 0.25;

    osc.connect(lp);
    osc2.connect(mix2);
    mix2.connect(lp);
    lp.connect(env);
    env.connect(alarmOut);

    osc.start(now);
    osc2.start(now);
    osc.stop(now + 0.26);
    osc2.stop(now + 0.26);
  }

  // ==================== 6. 17:18 ALEX KING STEALTH BASS OSTINATO (PLAYS DURING PAUSE) ====================
  const PURSUIT_BASS = [82.41, 82.41, 87.31, 82.41, 98.00, 87.31, 82.41, 77.78]; // E2 minor-second stealth pulse

  function playPursuitStep() {
    if (!ambienceState.alexPursuitOn || muted || stopped) return;
    if (!ctx || ctx.state !== 'running') return;

    const pursuitOut = ensurePursuitBusGain();
    if (!pursuitOut) return;

    const now = ctx.currentTime + 0.01;
    const freq = PURSUIT_BASS[pursuitStep % PURSUIT_BASS.length];
    const accent = (pursuitStep % 4 === 0);
    pursuitStep++;

    const osc = ctx.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq, now);

    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.setValueAtTime(accent ? 480 : 320, now);
    lp.frequency.exponentialRampToValueAtTime(140, now + 0.18);
    lp.Q.value = 3.6;

    const env = ctx.createGain();
    env.gain.setValueAtTime(0.0001, now);
    env.gain.linearRampToValueAtTime(accent ? 0.075 : 0.048, now + 0.012);
    env.gain.exponentialRampToValueAtTime(0.0001, now + 0.19);

    osc.connect(lp);
    lp.connect(env);
    env.connect(pursuitOut);

    osc.start(now);
    osc.stop(now + 0.21);
  }

  // ==================== SYNC ALL AMBIENCE LAYERS ====================
  function getTargetExtractorGain() {
    // Zero constant white/pink/brown static noise across ALL 6 rooms
    return 0;
  }

  function getTargetFacilityFreq() {
    if (ambienceState.roomId === 'cib_lg11_ms') return 92;
    if (ambienceState.roomId === 'cib_lg1b_nmr') return 68;
    if (ambienceState.roomId === 'meeting_room') return 110;
    return 0;
  }

  function getTargetFacilityGain() {
    if (ambienceState.roomId === 'cib_lg11_ms' || ambienceState.roomId === 'cib_lg1b_nmr') {
      return ambienceState.headphonesOn ? 0.003 : 0.009;
    }
    if (ambienceState.roomId === 'meeting_room') {
      return ambienceState.headphonesOn ? 0.0025 : 0.006;
    }
    return 0.0;
  }

  function silenceContinuousBuses(timeConstant = 0.06) {
    if (!ctx) return;
    const now = ctx.currentTime;
    if (extractorNodes && extractorNodes.gain) {
      extractorNodes.gain.gain.cancelScheduledValues(now);
      extractorNodes.gain.gain.setTargetAtTime(0, now, timeConstant);
    }
    if (facilityNodes && facilityNodes.gain) {
      facilityNodes.gain.gain.cancelScheduledValues(now);
      facilityNodes.gain.gain.setTargetAtTime(0, now, timeConstant);
    }
    if (alarmBusGain) {
      alarmBusGain.gain.cancelScheduledValues(now);
      alarmBusGain.gain.setTargetAtTime(0, now, 0.015);
    }
    if (pursuitBusGain) {
      pursuitBusGain.gain.cancelScheduledValues(now);
      pursuitBusGain.gain.setTargetAtTime(0, now, 0.015);
    }
  }

  function syncAllAmbienceLayers() {
    if (!ctx) return;
    if (stopped) {
      clearAmbientTimers();
      silenceContinuousBuses(0.06);
      return;
    }
    const now = ctx.currentTime;
    const activeAudio = !muted && ctx.state === 'running';

    // 1. Dormant extractor graph — always strictly 0 (zero constant static noise!)
    const ext = ensureExtractorGraph();
    if (ext && ext.gain) {
      const targetNoiseGain = getTargetExtractorGain(); // always 0
      ext.gain.gain.cancelScheduledValues(now);
      ext.gain.gain.setTargetAtTime(targetNoiseGain, now, 0.08);
    }

    // 2. Ultra-soft pure sine room tone (meeting_room: 110 Hz / LG11: 92 Hz / LG1b: 68 Hz)
    const baseFacGain = getTargetFacilityGain();
    const targetFacFreq = getTargetFacilityFreq();
    const targetFacGain = (paused || !activeAudio) ? 0 : baseFacGain;
    if (targetFacGain > 0 || facilityNodes) {
      const fac = ensureFacilityHumGraph();
      if (fac) {
        if (targetFacFreq > 0) {
          fac.osc.frequency.cancelScheduledValues(now);
          fac.osc.frequency.setTargetAtTime(targetFacFreq, now, 0.16);
        }
        fac.gain.gain.cancelScheduledValues(now);
        fac.gain.gain.setTargetAtTime(targetFacGain, now, 0.18);
      }
    }

    // 3. Gordon's Café headphone lowpass muffle filter (420 Hz ON / 6000 Hz OFF)
    if (ambienceState.roomId === 'gordons_cafe' || cafeFilter) {
      const cf = ensureCafeFilter();
      if (cf) {
        const targetCafeCutoff = ambienceState.headphonesOn ? 420 : 6000;
        cf.frequency.cancelScheduledValues(now);
        cf.frequency.setTargetAtTime(targetCafeCutoff, now, 0.12);
      }
    }

    if (paused || !activeAudio) {
      // Stop all room ambience, chatter, music, and café timers while paused or inactive
      clearNonUrgentTimers();
    } else {
      // Sparse non-hissy room-specific atmospheric soundscape (all 6 rooms)
      if (!ambienceState.fireAlarmOn) {
        if (!roomAmbientTimer || activeAmbientRoom !== ambienceState.roomId) {
          scheduleNextRoomAmbience();
        }
      } else if (roomAmbientTimer) {
        clearTimeout(roomAmbientTimer);
        roomAmbientTimer = null;
        activeAmbientRoom = null;
      }

      // Charlotte's Bench Chatter scheduler (KLB 2F)
      if (ambienceState.roomId === 'klb_2f' && !ambienceState.fireAlarmOn) {
        if (!chatterTimer) scheduleNextChatter();
      } else if (chatterTimer) {
        clearTimeout(chatterTimer);
        chatterTimer = null;
      }

      // Shire / Rivendell Lab Speakers synth loop (KLB 2F + soft bleed into 3F)
      const lotrAudibleRoom = ambienceState.roomId === 'klb_2f' || ambienceState.roomId === 'klb_3f';
      if (ambienceState.lotrOn && !ambienceState.fireAlarmOn && lotrAudibleRoom) {
        if (!lotrTimer) {
          playLotrStep();
          lotrTimer = setInterval(playLotrStep, 340);
        }
      } else if (lotrTimer) {
        clearInterval(lotrTimer);
        lotrTimer = null;
      }

      // Gordon's Café Rhodes Jazz Chords (routed through headphone-muffled cafeFilter)
      if (ambienceState.roomId === 'gordons_cafe' && !ambienceState.fireAlarmOn) {
        if (!cafeTimer) {
          playCafeChordStep();
          cafeTimer = setInterval(playCafeChordStep, 2500);
        }
      } else if (cafeTimer) {
        clearInterval(cafeTimer);
        cafeTimer = null;
      }
    }

    // 4. UK Lab Twin-Tone Fire Alarm (pauses cleanly when game is paused)
    if (activeAudio && !paused && ambienceState.fireAlarmOn) {
      const alarmOut = ensureAlarmBusGain();
      if (alarmOut) {
        alarmOut.gain.cancelScheduledValues(now);
        alarmOut.gain.setTargetAtTime(1.0, now, 0.02);
      }
      if (!alarmTimer) {
        let tickCount = 0;
        playFireAlarmPulse();
        alarmTimer = setInterval(() => {
          tickCount = (tickCount + 1) % 8;
          // 5 alternating twin-tone pulses followed by a brief breathing pause
          if (tickCount < 5) playFireAlarmPulse();
        }, 280);
      }
    } else {
      if (alarmTimer) {
        clearInterval(alarmTimer);
        alarmTimer = null;
      }
      if (alarmBusGain) {
        alarmBusGain.gain.cancelScheduledValues(now);
        alarmBusGain.gain.setTargetAtTime(0, now, 0.015);
      }
    }

    // 5. Alex King 17:18 Stealth Bass Ostinato (plays even while simulation is paused during alex_stealth)
    if (activeAudio && ambienceState.alexPursuitOn) {
      const pursuitOut = ensurePursuitBusGain();
      if (pursuitOut) {
        pursuitOut.gain.cancelScheduledValues(now);
        pursuitOut.gain.setTargetAtTime(1.0, now, 0.02);
      }
      if (!pursuitTimer) {
        playPursuitStep();
        pursuitTimer = setInterval(playPursuitStep, 225);
      }
    } else {
      if (pursuitTimer) {
        clearInterval(pursuitTimer);
        pursuitTimer = null;
      }
      if (pursuitBusGain) {
        pursuitBusGain.gain.cancelScheduledValues(now);
        pursuitBusGain.gain.setTargetAtTime(0, now, 0.015);
      }
    }
  }

  function setRoomAmbience(opts = {}) {
    if (opts.roomId !== undefined) ambienceState.roomId = opts.roomId;
    if (opts.headphonesOn !== undefined) ambienceState.headphonesOn = Boolean(opts.headphonesOn);
    if (opts.lotrOn !== undefined) ambienceState.lotrOn = Boolean(opts.lotrOn);
    if (opts.fireAlarmOn !== undefined) ambienceState.fireAlarmOn = Boolean(opts.fireAlarmOn);
    if (opts.alexPursuitOn !== undefined) ambienceState.alexPursuitOn = Boolean(opts.alexPursuitOn);

    stopped = false;
    bindAutoUnlock();
    bindVisibilityListener();
    if (ctx && ctx.state === 'running') {
      syncAllAmbienceLayers();
    }
  }

  function stopAllAmbience() {
    clearAmbientTimers();
    ambienceState.lotrOn = false;
    ambienceState.fireAlarmOn = false;
    ambienceState.alexPursuitOn = false;
    paused = false;
    stopped = true;
    silenceContinuousBuses(0.06);
  }

  function setPaused(isPaused) {
    paused = Boolean(isPaused);
    if (paused) {
      // Stop non-urgent room ambience and fire alarm timers immediately;
      // keep active Alex King stealth ostinato running while alex_stealth pauses the sim
      clearNonUrgentTimers();
      clearInterval(alarmTimer);
      alarmTimer = null;
      if (!ambienceState.alexPursuitOn) {
        clearInterval(pursuitTimer);
        pursuitTimer = null;
      }
    }
    if (!stopped && ctx && ctx.state === 'running') {
      syncAllAmbienceLayers();
    } else if (paused && ctx) {
      silenceContinuousBuses(0.08);
    }
    return paused;
  }

  // ==================== PROCEDURAL RETRO LAB & POKÉMON SFX ====================
  function playTone(type, freqStart, freqEnd, startTime, duration, peakGain) {
    const osc = ctx.createOscillator();
    osc.type = type;
    osc.frequency.setValueAtTime(Math.max(20, freqStart), startTime);
    if (freqEnd && freqEnd !== freqStart) {
      osc.frequency.exponentialRampToValueAtTime(Math.max(20, freqEnd), startTime + duration);
    }

    const env = ctx.createGain();
    env.gain.setValueAtTime(0.0001, startTime);
    env.gain.linearRampToValueAtTime(peakGain, startTime + Math.min(0.01, duration * 0.25));
    env.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    osc.connect(env);
    env.connect(masterGain);
    osc.start(startTime);
    osc.stop(startTime + duration + 0.015);
  }

  function playNoiseBurst(startTime, duration, filterType, freq, q, peakGain) {
    const buf = ensureSfxNoiseBuffer();
    if (!buf) return;
    const src = ctx.createBufferSource();
    src.buffer = buf;
    src.playbackRate.value = 0.9 + Math.random() * 0.25;

    const filter = ctx.createBiquadFilter();
    filter.type = filterType;
    filter.frequency.setValueAtTime(freq, startTime);
    filter.Q.value = q;

    const env = ctx.createGain();
    env.gain.setValueAtTime(0.0001, startTime);
    env.gain.linearRampToValueAtTime(peakGain, startTime + Math.min(0.008, duration * 0.2));
    env.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    src.connect(filter);
    filter.connect(env);
    env.connect(masterGain);
    const maxOffset = Math.max(0, (buf.duration || 1.0) - duration - 0.05);
    src.start(startTime, Math.random() * maxOffset);
    src.stop(startTime + duration + 0.015);
  }

  function playSfx(type) {
    bindAutoUnlock();
    const audioCtx = ensureContext();
    if (!audioCtx || muted) return;

    const now = audioCtx.currentTime + 0.005;

    switch (type) {
      case 'step': {
        const pitch = 115 + Math.random() * 28;
        playTone('triangle', pitch, 58, now, 0.045, 0.055);
        playNoiseBurst(now, 0.032, 'bandpass', 900 + Math.random() * 250, 1.8, 0.03);
        break;
      }
      case 'bump': {
        // Classic retro Pokémon wall-bump thud
        playTone('triangle', 145, 52, now, 0.095, 0.10);
        playTone('square', 92, 44, now, 0.075, 0.045);
        break;
      }
      case 'interact': {
        // Crisp GBA two-step confirmation blip
        playTone('triangle', 784, 784, now, 0.045, 0.11);
        playTone('triangle', 1174.66, 1174.66, now + 0.042, 0.065, 0.12);
        break;
      }
      case 'whatsapp': {
        const nowMs = Date.now();
        if (nowMs - lastWaPingAtMs < WA_PING_COOLDOWN_MS) return;
        lastWaPingAtMs = nowMs;
        // Signature two-note chat ping
        playTone('sine', 587.33, 620, now, 0.07, 0.11);
        playTone('sine', 880.0, 1174.66, now + 0.065, 0.13, 0.13);
        break;
      }
      case 'success': {
        // Uplifting 4-note lab discovery chime (C5 - E5 - G5 - C6)
        const notes = [523.25, 659.25, 783.99, 1046.50];
        notes.forEach((n, i) => {
          playTone('triangle', n, n, now + i * 0.065, i === 3 ? 0.24 : 0.085, 0.12);
        });
        break;
      }
      case 'birthday': {
        // Warm cheerful 3-note ascending chime (C5 -> E5 -> G5)
        const notes = [523.25, 659.25, 783.99];
        notes.forEach((n, i) => {
          const t = now + i * 0.085;
          const dur = i === 2 ? 0.24 : 0.11;
          playTone('triangle', n, n, t, dur, 0.10);
          playTone('sine', n * 2, n * 2, t, dur * 0.65, 0.028);
        });
        break;
      }
      case 'chat_pop': {
        // Soft short speech-bubble pop (520 -> 780 Hz tiny marimba blip)
        playTone('sine', 520, 780, now, 0.045, 0.06);
        break;
      }
      case 'modal_open': {
        // Subtle crisp UI tick
        playTone('triangle', 1046.5, 1318.5, now, 0.032, 0.05);
        break;
      }
      case 'audit_pass': {
        // Bright triumphant 4-note chord arpeggio (D5 -> F#5 -> A5 -> D6)
        const notes = [587.33, 739.99, 880.00, 1174.66];
        notes.forEach((n, i) => {
          const t = now + i * 0.06;
          const dur = i === 3 ? 0.30 : 0.16;
          playTone('triangle', n, n, t, dur, 0.095);
          if (i === 3) {
            playTone('sine', n * 0.5, n * 0.5, t, 0.28, 0.05);
          }
        });
        break;
      }
      case 'audit_fail': {
        // Low two-tone warning cadence (F3 -> C3)
        playTone('triangle', 174.61, 174.61, now, 0.15, 0.09);
        playTone('sawtooth', 174.61, 174.61, now, 0.15, 0.035);
        playTone('triangle', 130.81, 123.47, now + 0.17, 0.26, 0.095);
        playTone('sawtooth', 130.81, 123.47, now + 0.17, 0.26, 0.04);
        break;
      }
      case 'sweep_alert': {
        // Brisk double-chirp inspection alert (980 Hz)
        playTone('triangle', 980, 980, now, 0.065, 0.08);
        playTone('triangle', 980, 1080, now + 0.095, 0.08, 0.08);
        break;
      }
      case 'warning': {
        // Amber double-beep alert
        playTone('sawtooth', 640, 540, now, 0.09, 0.075);
        playTone('sawtooth', 640, 500, now + 0.12, 0.11, 0.08);
        break;
      }
      case 'error': {
        // Negative buzzer drop
        playTone('sawtooth', 235, 165, now, 0.11, 0.09);
        playTone('sawtooth', 175, 118, now + 0.10, 0.16, 0.095);
        break;
      }
      case 'pipette': {
        // Gilson P20 mechanical click + tiny sample aspiration bloop
        playTone('square', 1950, 920, now, 0.022, 0.07);
        playTone('sine', 420, 760, now + 0.028, 0.065, 0.095);
        break;
      }
      case 'uv_click': {
        // Heavy UV box rocker switch clack + 254 nm lamp strike shimmer
        playTone('square', 1480, 620, now, 0.028, 0.085);
        playTone('sine', 100, 100, now + 0.025, 0.18, 0.055);
        playTone('triangle', 2650, 3100, now + 0.03, 0.14, 0.035);
        break;
      }
      case 'buchi': {
        // Büchi rotary evaporator vacuum pull + spinning flask hum
        playNoiseBurst(now, 0.26, 'bandpass', 620, 1.4, 0.085);
        playTone('triangle', 190, 340, now + 0.02, 0.25, 0.075);
        break;
      }
      case 'rotavap_whoosh': {
        // Soft warm rising/settling rotary vacuum whoosh — pure warm tonal sweep, zero harsh static
        const lp = audioCtx.createBiquadFilter();
        lp.type = 'lowpass';
        lp.frequency.setValueAtTime(240, now);
        lp.frequency.exponentialRampToValueAtTime(640, now + 0.18);
        lp.frequency.exponentialRampToValueAtTime(260, now + 0.42);
        lp.Q.value = 1.6;
        lp.connect(masterGain);

        const body = audioCtx.createOscillator();
        body.type = 'sine';
        body.frequency.setValueAtTime(135, now);
        body.frequency.exponentialRampToValueAtTime(260, now + 0.18);
        body.frequency.exponentialRampToValueAtTime(165, now + 0.42);

        const bodyEnv = audioCtx.createGain();
        bodyEnv.gain.setValueAtTime(0.0001, now);
        bodyEnv.gain.linearRampToValueAtTime(0.075, now + 0.07);
        bodyEnv.gain.setTargetAtTime(0.052, now + 0.16, 0.08);
        bodyEnv.gain.exponentialRampToValueAtTime(0.0001, now + 0.43);

        body.connect(bodyEnv);
        bodyEnv.connect(lp);
        body.start(now);
        body.stop(now + 0.45);

        const swirl = audioCtx.createOscillator();
        swirl.type = 'triangle';
        swirl.frequency.setValueAtTime(202, now);
        swirl.frequency.exponentialRampToValueAtTime(390, now + 0.18);
        swirl.frequency.exponentialRampToValueAtTime(248, now + 0.40);

        const swirlEnv = audioCtx.createGain();
        swirlEnv.gain.setValueAtTime(0.0001, now);
        swirlEnv.gain.linearRampToValueAtTime(0.032, now + 0.09);
        swirlEnv.gain.exponentialRampToValueAtTime(0.0001, now + 0.41);

        swirl.connect(swirlEnv);
        swirlEnv.connect(lp);
        swirl.start(now);
        swirl.stop(now + 0.43);
        break;
      }
      case 'centrifuge_hum': {
        // Short smooth spin-up tonal sweep (160 -> 420 Hz)
        const lp = audioCtx.createBiquadFilter();
        lp.type = 'lowpass';
        lp.frequency.value = 1150;
        lp.connect(masterGain);

        const rotor = audioCtx.createOscillator();
        rotor.type = 'sine';
        rotor.frequency.setValueAtTime(160, now);
        rotor.frequency.exponentialRampToValueAtTime(420, now + 0.34);

        const rEnv = audioCtx.createGain();
        rEnv.gain.setValueAtTime(0.0001, now);
        rEnv.gain.linearRampToValueAtTime(0.082, now + 0.045);
        rEnv.gain.setTargetAtTime(0.068, now + 0.18, 0.06);
        rEnv.gain.exponentialRampToValueAtTime(0.0001, now + 0.38);

        rotor.connect(rEnv);
        rEnv.connect(lp);
        rotor.start(now);
        rotor.stop(now + 0.40);

        const harm = audioCtx.createOscillator();
        harm.type = 'triangle';
        harm.frequency.setValueAtTime(320, now);
        harm.frequency.exponentialRampToValueAtTime(840, now + 0.33);

        const hEnv = audioCtx.createGain();
        hEnv.gain.setValueAtTime(0.0001, now);
        hEnv.gain.linearRampToValueAtTime(0.024, now + 0.055);
        hEnv.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);

        harm.connect(hEnv);
        hEnv.connect(lp);
        harm.start(now);
        harm.stop(now + 0.37);
        break;
      }
      case 'nmr_lock': {
        // Clean twin high-tech resonant ping (880 -> 1320 Hz)
        playTone('sine', 880, 880, now, 0.16, 0.085);
        playTone('sine', 1760, 1760, now, 0.085, 0.022);
        playTone('sine', 1320, 1320, now + 0.085, 0.24, 0.095);
        playTone('sine', 2640, 2640, now + 0.085, 0.11, 0.022);
        break;
      }
      case 'stairs_step': {
        // 3 quick ascending hollow metal spiral-stair taps
        const bases = [310, 365, 430];
        bases.forEach((baseFreq, i) => {
          const t = now + i * 0.072;
          playTone('triangle', baseFreq, baseFreq * 0.86, t, 0.055, 0.068);
          playTone('sine', baseFreq * 2.38, baseFreq * 2.24, t, 0.042, 0.026);
          playTone('sine', 148, 68, t, 0.024, 0.045);
        });
        break;
      }
      case 'door_open': {
        // Soft wooden/latch click + subtle warm swoosh
        playTone('triangle', 920, 480, now, 0.022, 0.065);
        playTone('sine', 185, 95, now + 0.012, 0.036, 0.055);
        playTone('sine', 210, 125, now + 0.028, 0.125, 0.035);
        playNoiseBurst(now + 0.028, 0.09, 'lowpass', 420, 0.8, 0.022);
        break;
      }
      case 'ui_click': {
        // Crisp soft UI click (520 Hz, 25ms)
        playTone('triangle', 520, 440, now, 0.025, 0.065);
        playTone('sine', 1040, 880, now, 0.015, 0.018);
        break;
      }
      case 'pause_toggle': {
        // Gentle two-tone soft chime
        playTone('sine', 493.88, 493.88, now, 0.09, 0.072);
        playTone('sine', 659.25, 659.25, now + 0.07, 0.15, 0.078);
        playTone('triangle', 1318.5, 1318.5, now + 0.07, 0.08, 0.016);
        break;
      }
      case 'kettle': {
        // Richard's 3F kettle switch snap + warm rolling boil bubble
        playTone('square', 1300, 740, now, 0.025, 0.065);
        playNoiseBurst(now + 0.03, 0.32, 'bandpass', 540, 2.2, 0.09);
        playTone('sine', 380, 590, now + 0.08, 0.18, 0.055);
        break;
      }
      case 'door_buzz': {
        // UCL card-reader solenoid BZZZT + heavy latch click
        playTone('sawtooth', 100, 98, now, 0.24, 0.085);
        playTone('square', 1120, 680, now + 0.245, 0.035, 0.09);
        break;
      }
      case 'slide_click': {
        // Crisp 3F laser clicker / slide advance snap
        playTone('triangle', 2250, 1380, now, 0.026, 0.10);
        playTone('sine', 960, 1280, now + 0.022, 0.045, 0.075);
        break;
      }
      case 'sip': {
        // Gentle ceramic cup clink + warm sip noise (Coffee / Yorkshire Tea)
        playNoiseBurst(now, 0.15, 'bandpass', 1200, 1.6, 0.05);
        playTone('sine', 2840, 2790, now + 0.12, 0.13, 0.045);
        playTone('triangle', 4180, 4120, now + 0.12, 0.075, 0.018);
        break;
      }
      case 'lan_blip': {
        // Crisp retro strategy-game horn/click chime (AoE2 / Worms office LAN breaks)
        playTone('square', 1560, 980, now, 0.022, 0.05);
        playTone('triangle', 392.00, 392.00, now + 0.025, 0.09, 0.095);
        playTone('sawtooth', 392.00, 392.00, now + 0.025, 0.085, 0.025);
        playTone('triangle', 587.33, 587.33, now + 0.095, 0.17, 0.105);
        playTone('sawtooth', 587.33, 587.33, now + 0.095, 0.16, 0.028);
        break;
      }
      default: {
        playTone('triangle', 660, 880, now, 0.055, 0.08);
        break;
      }
    }
  }

  function setMuted(bool) {
    muted = Boolean(bool);
    saveAudioPrefs();
    syncMasterGain();
    if (!muted && ctx && !stopped) {
      if (ctx.state === 'suspended' && (typeof document === 'undefined' || !document.hidden) && typeof ctx.resume === 'function') {
        ctx.resume().then(() => {
          if (!stopped && !muted) syncAllAmbienceLayers();
        }).catch(() => {});
      } else if (ctx.state === 'running') {
        syncAllAmbienceLayers();
      }
    } else if (muted && ctx && !stopped) {
      syncAllAmbienceLayers();
    }
    return muted;
  }

  function isMuted() {
    return muted;
  }

  function setVolume(val) {
    const num = Number(val);
    if (!Number.isNaN(num) && Number.isFinite(num)) {
      volume = Math.max(0, Math.min(1, num));
      saveAudioPrefs();
      syncMasterGain();
    }
    return volume;
  }

  function getVolume() {
    return volume;
  }

  // Bind gesture unlock & tab visibility listeners immediately on script load
  bindAutoUnlock();
  bindVisibilityListener();

  root.KLB.Audio = {
    init,
    setRoomAmbience,
    stopAllAmbience,
    setPaused,
    playSfx,
    setMuted,
    isMuted,
    setVolume,
    getVolume
  };
})();
