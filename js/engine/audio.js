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

  // Continuous WebAudio nodes for extractor & facility room tone
  let extractorNodes = null; // { src, hpFilter, lpFilter, gain }
  let facilityNodes = null;  // { osc, gain }

  // Periodic scheduler timers
  let chatterTimer = null;
  let lotrTimer = null;
  let cafeTimer = null;
  let steamTimer = null;
  let alarmTimer = null;
  let pursuitTimer = null;

  // Musical loop cursors
  let lotrStep = 0;
  let cafeStep = 0;
  let pursuitStep = 0;
  let alarmHighPhase = false;

  // Create a rich 4-second seamless pink/brown lab extractor noise buffer
  function createLabNoiseBuffer(audioCtx) {
    const sampleRate = audioCtx.sampleRate;
    const length = sampleRate * 4;
    const buffer = audioCtx.createBuffer(1, length, sampleRate);
    const data = buffer.getChannelData(0);

    // Paul Kellet pink-noise filter + subtle brownian duct rumble
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
      let sample = pink * 0.72 + brown * 1.35;

      // Crossfade last 2048 samples with beginning for click-free looping
      if (i > length - 2048) {
        const alpha = (length - i) / 2048;
        sample = sample * alpha + data[length - i] * (1 - alpha);
      }
      data[i] = Math.max(-0.98, Math.min(0.98, sample));
    }
    return buffer;
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
      noiseBuffer = createLabNoiseBuffer(ctx);
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
    clearTimeout(chatterTimer);
    chatterTimer = null;
    clearInterval(lotrTimer);
    lotrTimer = null;
    clearInterval(cafeTimer);
    cafeTimer = null;
    clearTimeout(steamTimer);
    steamTimer = null;
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
    const target = muted ? 0.0001 : Math.max(0, Math.min(1, volume));
    masterGain.gain.cancelScheduledValues(now);
    masterGain.gain.setTargetAtTime(muted ? 0 : target, now, 0.04);
  }

  // ==================== 1. CONTINUOUS EXTRACTOR & HEADPHONE MUFFLE ====================
  function ensureExtractorGraph() {
    if (!ctx || !noiseBuffer) return null;
    if (extractorNodes) return extractorNodes;

    const src = ctx.createBufferSource();
    src.buffer = noiseBuffer;
    src.loop = true;

    const hpFilter = ctx.createBiquadFilter();
    hpFilter.type = 'highpass';
    hpFilter.frequency.value = 62;
    hpFilter.Q.value = 0.7;

    const lpFilter = ctx.createBiquadFilter();
    lpFilter.type = 'lowpass';
    lpFilter.frequency.value = ambienceState.headphonesOn ? 340 : 2800;
    lpFilter.Q.value = 0.85;

    const gain = ctx.createGain();
    gain.gain.value = 0.0;

    src.connect(hpFilter);
    hpFilter.connect(lpFilter);
    lpFilter.connect(gain);
    gain.connect(masterGain);
    src.start();

    extractorNodes = { src, hpFilter, lpFilter, gain };
    return extractorNodes;
  }

  function ensureFacilityHumGraph() {
    if (!ctx) return null;
    if (facilityNodes) return facilityNodes;

    const osc = ctx.createOscillator();
    osc.type = 'triangle';
    osc.frequency.value = 100; // UK 50 Hz mains harmonic instrument hum

    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.value = 240;

    const gain = ctx.createGain();
    gain.gain.value = 0.0;

    osc.connect(lp);
    lp.connect(gain);
    gain.connect(masterGain);
    osc.start();

    facilityNodes = { osc, lp, gain };
    return facilityNodes;
  }

  // ==================== 2. CHARLOTTE'S BENCH CHATTER BURSTS (KLB 2F) ====================
  function triggerChatterBurst() {
    if (!ctx || ctx.state !== 'running' || muted || paused || stopped) return;
    if (ambienceState.roomId !== 'klb_2f' || ambienceState.fireAlarmOn) return;

    const now = ctx.currentTime;
    const syllables = 4 + Math.floor(Math.random() * 5);
    // Drop chatter gain by 85% when Headphones are on!
    const baseGain = ambienceState.headphonesOn ? (0.042 * 0.15) : 0.042;

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
    if (paused || stopped || ambienceState.roomId !== 'klb_2f' || ambienceState.fireAlarmOn) return;
    const delayMs = 2800 + Math.random() * 3600;
    chatterTimer = setTimeout(() => {
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

    const roomScale = ambienceState.roomId === 'klb_2f' ? 1.0
      : (ambienceState.roomId === 'klb_3f' ? 0.55 : 0.0);
    if (roomScale <= 0) return;

    const now = ctx.currentTime + 0.015;
    const idx = lotrStep % 16;
    lotrStep++;

    // Gentle acoustic room / headphone filter
    const outFilter = ctx.createBiquadFilter();
    outFilter.type = 'lowpass';
    outFilter.frequency.value = (ambienceState.roomId === 'klb_2f' && ambienceState.headphonesOn) ? 950 : 3400;
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

  // ==================== 4. GORDON'S CAFÉ JAZZ RHODES & ESPRESSO STEAM ====================
  const CAFE_CHORDS = [
    [293.66, 349.23, 440.00, 523.25, 659.25], // Dm9
    [196.00, 329.63, 349.23, 493.88, 587.33], // G13
    [261.63, 329.63, 392.00, 493.88, 587.33], // Cmaj9
    [220.00, 329.63, 392.00, 466.16, 554.37]  // A7alt
  ];

  function playCafeChordStep() {
    if (!ctx || ctx.state !== 'running' || muted || paused || stopped || ambienceState.roomId !== 'gordons_cafe') return;

    const now = ctx.currentTime + 0.02;
    const chord = CAFE_CHORDS[cafeStep % CAFE_CHORDS.length];
    cafeStep++;

    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.value = 1650;
    lp.connect(masterGain);

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

  function playEspressoSteam() {
    if (!ctx || ctx.state !== 'running' || muted || paused || stopped || ambienceState.roomId !== 'gordons_cafe' || !noiseBuffer) return;

    const now = ctx.currentTime + 0.02;
    const src = ctx.createBufferSource();
    src.buffer = noiseBuffer;
    src.loop = true;

    const bp = ctx.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.setValueAtTime(2450, now);
    bp.Q.value = 1.4;

    const env = ctx.createGain();
    env.gain.setValueAtTime(0.0001, now);
    env.gain.linearRampToValueAtTime(0.035, now + 0.16);
    env.gain.setTargetAtTime(0.022, now + 0.25, 0.25);
    env.gain.exponentialRampToValueAtTime(0.0001, now + 1.05);

    src.connect(bp);
    bp.connect(env);
    env.connect(masterGain);

    src.start(now);
    src.stop(now + 1.1);

    // Subtle porcelain espresso cup clink 40% of the time
    if (Math.random() < 0.45) {
      const clink = ctx.createOscillator();
      clink.type = 'sine';
      clink.frequency.setValueAtTime(2780 + Math.random() * 350, now + 0.55);
      const cg = ctx.createGain();
      cg.gain.setValueAtTime(0.0001, now + 0.55);
      cg.gain.linearRampToValueAtTime(0.018, now + 0.555);
      cg.gain.exponentialRampToValueAtTime(0.0001, now + 0.72);
      clink.connect(cg);
      cg.connect(masterGain);
      clink.start(now + 0.55);
      clink.stop(now + 0.74);
    }
  }

  function scheduleEspressoSteam() {
    clearTimeout(steamTimer);
    steamTimer = null;
    if (paused || stopped || ambienceState.roomId !== 'gordons_cafe') return;
    steamTimer = setTimeout(() => {
      playEspressoSteam();
      scheduleEspressoSteam();
    }, 6500 + Math.random() * 6500);
  }

  // ==================== 5. UK LAB TWIN-TONE FIRE ALARM (800 / 970 Hz) ====================
  function playFireAlarmPulse() {
    if (!ctx || ctx.state !== 'running' || muted || stopped || !ambienceState.fireAlarmOn) return;

    const now = ctx.currentTime + 0.01;
    // Intermittent twin-tone burst: 4 alternating pulses (800 Hz / 970 Hz) then brief gap
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
    env.connect(masterGain);

    osc.start(now);
    osc2.start(now);
    osc.stop(now + 0.26);
    osc2.stop(now + 0.26);
  }

  // ==================== 6. 17:18 ALEX KING STEALTH BASS OSTINATO ====================
  const PURSUIT_BASS = [82.41, 82.41, 87.31, 82.41, 98.00, 87.31, 82.41, 77.78]; // E2 minor-second stealth pulse

  function playPursuitStep() {
    if (!ctx || ctx.state !== 'running' || muted || stopped || !ambienceState.alexPursuitOn) return;

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
    env.connect(masterGain);

    osc.start(now);
    osc.stop(now + 0.21);
  }

  // ==================== SYNC ALL AMBIENCE LAYERS ====================
  function getTargetExtractorGain() {
    if (ambienceState.roomId === 'klb_2f') {
      return ambienceState.headphonesOn ? 0.055 : 0.085;
    }
    if (ambienceState.roomId === 'cib_lg11_ms' || ambienceState.roomId === 'cib_lg1b_nmr') {
      return ambienceState.headphonesOn ? 0.025 : 0.048;
    }
    if (ambienceState.roomId === 'klb_3f') {
      return 0.012;
    }
    return 0.0;
  }

  function getTargetFacilityGain() {
    const inFacility = ambienceState.roomId === 'cib_lg11_ms' || ambienceState.roomId === 'cib_lg1b_nmr';
    return inFacility ? 0.024 : 0.0;
  }

  function syncAllAmbienceLayers() {
    if (!ctx) return;
    if (stopped) {
      clearAmbientTimers();
      return;
    }
    const now = ctx.currentTime;
    const activeAudio = !muted && ctx.state === 'running';

    // 1. Extractor roar & Headphone 2800 Hz -> 340 Hz smooth filter ramp
    const ext = ensureExtractorGraph();
    if (ext) {
      const targetCutoff = ambienceState.headphonesOn ? 340 : 2800;
      ext.lpFilter.frequency.cancelScheduledValues(now);
      ext.lpFilter.frequency.setTargetAtTime(targetCutoff, now, 0.14);

      const baseNoiseGain = getTargetExtractorGain();
      const targetNoiseGain = paused ? 0 : baseNoiseGain;
      ext.gain.gain.cancelScheduledValues(now);
      ext.gain.gain.setTargetAtTime(targetNoiseGain, now, 0.16);
    }

    // Subtle CIB spectrometer / vacuum pump hum
    const fac = ensureFacilityHumGraph();
    if (fac) {
      const baseFacGain = getTargetFacilityGain();
      const targetFacGain = paused ? 0 : baseFacGain;
      fac.osc.frequency.setTargetAtTime(ambienceState.roomId === 'cib_lg11_ms' ? 92 : 68, now, 0.2);
      fac.gain.gain.cancelScheduledValues(now);
      fac.gain.gain.setTargetAtTime(targetFacGain, now, 0.2);
    }

    if (paused || !activeAudio) {
      // Fade/stop normal room chatter, music & kettle/cafe loops while paused
      clearNonUrgentTimers();
    } else {
      // 2. Charlotte's Bench Chatter scheduler
      if (ambienceState.roomId === 'klb_2f' && !ambienceState.fireAlarmOn) {
        if (!chatterTimer) scheduleNextChatter();
      } else {
        clearTimeout(chatterTimer);
        chatterTimer = null;
      }

      // 3. Shire / Rivendell Lab Speakers synth loop
      if (ambienceState.lotrOn && !ambienceState.fireAlarmOn) {
        if (!lotrTimer) {
          playLotrStep();
          lotrTimer = setInterval(playLotrStep, 340);
        }
      } else if (lotrTimer) {
        clearInterval(lotrTimer);
        lotrTimer = null;
      }

      // 4. Gordon's Café Jazz Chords + Espresso Steam
      if (ambienceState.roomId === 'gordons_cafe' && !ambienceState.fireAlarmOn) {
        if (!cafeTimer) {
          playCafeChordStep();
          cafeTimer = setInterval(playCafeChordStep, 2500);
        }
        if (!steamTimer) scheduleEspressoSteam();
      } else {
        if (cafeTimer) {
          clearInterval(cafeTimer);
          cafeTimer = null;
        }
        clearTimeout(steamTimer);
        steamTimer = null;
      }
    }

    // 5. UK Lab Twin-Tone Fire Alarm (active urgent alert — stays running when paused)
    if (activeAudio && ambienceState.fireAlarmOn) {
      if (!alarmTimer) {
        let tickCount = 0;
        playFireAlarmPulse();
        alarmTimer = setInterval(() => {
          tickCount = (tickCount + 1) % 8;
          // 5 alternating twin-tone pulses followed by a brief breathing pause
          if (tickCount < 5) playFireAlarmPulse();
        }, 280);
      }
    } else if (alarmTimer) {
      clearInterval(alarmTimer);
      alarmTimer = null;
    }

    // 6. Alex King 17:18 Stealth Bass Ostinato (active urgent alert — stays running when paused)
    if (activeAudio && ambienceState.alexPursuitOn) {
      if (!pursuitTimer) {
        playPursuitStep();
        pursuitTimer = setInterval(playPursuitStep, 225);
      }
    } else if (pursuitTimer) {
      clearInterval(pursuitTimer);
      pursuitTimer = null;
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

    if (ctx) {
      const now = ctx.currentTime;
      if (extractorNodes && extractorNodes.gain) {
        extractorNodes.gain.gain.cancelScheduledValues(now);
        extractorNodes.gain.gain.setTargetAtTime(0, now, 0.06);
      }
      if (facilityNodes && facilityNodes.gain) {
        facilityNodes.gain.gain.cancelScheduledValues(now);
        facilityNodes.gain.gain.setTargetAtTime(0, now, 0.06);
      }
    }
  }

  function setPaused(isPaused) {
    paused = Boolean(isPaused);
    if (paused) {
      clearNonUrgentTimers();
    }
    if (!stopped && ctx && ctx.state === 'running') {
      syncAllAmbienceLayers();
    } else if (paused && ctx) {
      const now = ctx.currentTime;
      if (extractorNodes && extractorNodes.gain) {
        extractorNodes.gain.gain.cancelScheduledValues(now);
        extractorNodes.gain.gain.setTargetAtTime(0, now, 0.08);
      }
      if (facilityNodes && facilityNodes.gain) {
        facilityNodes.gain.gain.cancelScheduledValues(now);
        facilityNodes.gain.gain.setTargetAtTime(0, now, 0.08);
      }
    }
    return paused;
  }

  // ==================== PROCEDURAL RETRO LAB & POKÉMON SFX ====================
  function playTone(type, freqStart, freqEnd, startTime, duration, peakGain) {
    const osc = ctx.createOscillator();
    osc.type = type;
    osc.frequency.setValueAtTime(freqStart, startTime);
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
    if (!noiseBuffer) return;
    const src = ctx.createBufferSource();
    src.buffer = noiseBuffer;
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
    src.start(startTime, Math.random() * 2.0);
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
