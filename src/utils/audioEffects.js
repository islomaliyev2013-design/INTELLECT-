/**
 * Audio Effects & Lo-Fi Background Music Engine for NeuroQuiz Global
 * Powered by the HTML5 Web Audio API:
 * - Relaxing "Lo-Fi Music" background track (warm electric piano chords + gentle melody)
 * - "TINQ!" chime on correct answer
 * - "TINININI" 4-note descending buzzer on wrong answer
 */

let audioCtx = null;
let soundEnabledState = true;
const soundListeners = new Set();

try {
  if (typeof window !== 'undefined' && window.localStorage) {
    const saved = window.localStorage.getItem('neuroquiz_sound_enabled');
    if (saved !== null) {
      soundEnabledState = JSON.parse(saved);
    }
  }
} catch (e) {}

function notifySoundListeners() {
  soundListeners.forEach((fn) => {
    try {
      fn(soundEnabledState);
    } catch (e) {}
  });
}

export function isSoundEnabled() {
  return soundEnabledState;
}

export function setSoundEnabledGlobal(val) {
  soundEnabledState = Boolean(val);
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem('neuroquiz_sound_enabled', JSON.stringify(soundEnabledState));
    }
  } catch (e) {}
  notifySoundListeners();
  return soundEnabledState;
}

export function toggleSoundGlobal() {
  const next = !soundEnabledState;
  setSoundEnabledGlobal(next);
  if (next) {
    playCorrectSound();
  }
  return next;
}

export function subscribeSoundState(listener) {
  soundListeners.add(listener);
  listener(soundEnabledState);
  return () => soundListeners.delete(listener);
}

function getAudioContext() {
  if (typeof window === 'undefined') return null;
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return null;

  if (!audioCtx) {
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

// ==================== LO-FI MUSIC BACKGROUND ENGINE ====================

const LOFI_TRACK = {
  id: 'lofi',
  name: 'Lo-Fi Music',
  bpm: 90,
  // Warm, soothing Lo-Fi study progression (Cmaj7 -> Am7 -> Dm7 -> G7)
  bass: [
    130.81, 0, 0, 130.81, 110.0, 0, 0, 110.0,
    146.83, 0, 0, 146.83, 98.0, 0, 110.0, 123.47,
  ],
  melody: [
    523.25, 0, 659.25, 587.33, 440.0, 0, 523.25, 493.88,
    587.33, 0, 698.46, 659.25, 587.33, 523.25, 440.0, 392.0,
  ],
  chords: [
    [261.63, 329.63, 392.0, 493.88], // Cmaj7
    [220.0, 261.63, 329.63, 392.0],  // Am7
    [293.66, 349.23, 440.0, 523.25], // Dm7
    [196.0, 246.94, 329.63, 392.0],  // G6
  ],
};

let bgmTimer = null;
let bgmStep = 0;
let bgmPlaying = false;
let bgmEnabledPreference = true;
const bgmListeners = new Set();

try {
  if (typeof window !== 'undefined' && window.localStorage) {
    const saved = window.localStorage.getItem('neuroquiz_bgm_enabled');
    if (saved !== null) {
      bgmEnabledPreference = JSON.parse(saved);
    }
  }
} catch (e) {}

function notifyBgmListeners() {
  const state = {
    isPlaying: bgmPlaying,
    enabled: bgmEnabledPreference,
    track: LOFI_TRACK,
  };
  bgmListeners.forEach((fn) => {
    try {
      fn(state);
    } catch (e) {}
  });
}

export function subscribeBgmState(listener) {
  bgmListeners.add(listener);
  listener({
    isPlaying: bgmPlaying,
    enabled: bgmEnabledPreference,
    track: LOFI_TRACK,
  });
  return () => bgmListeners.delete(listener);
}

export function getBgmState() {
  return {
    isPlaying: bgmPlaying,
    enabled: bgmEnabledPreference,
    track: LOFI_TRACK,
  };
}

function playLofiStep() {
  if (!bgmPlaying) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const stepDuration = 60 / LOFI_TRACK.bpm / 2; // 8th note duration in seconds
  const now = ctx.currentTime;
  const step = bgmStep % 16;

  // 1. Soft Lo-Fi Electric Piano Melody
  const melFreq = LOFI_TRACK.melody[step];
  if (melFreq > 0) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(melFreq, now);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(0.055, now + 0.025);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + stepDuration * 1.15);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + stepDuration * 1.2);
  }

  // 2. Warm Lo-Fi Sub Bass
  const bassFreq = LOFI_TRACK.bass[step];
  if (bassFreq > 0) {
    const bassOsc = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const bassGain = ctx.createGain();

    bassOsc.type = 'triangle';
    bassOsc.frequency.setValueAtTime(bassFreq, now);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(320, now);

    bassGain.gain.setValueAtTime(0.0001, now);
    bassGain.gain.linearRampToValueAtTime(0.07, now + 0.02);
    bassGain.gain.exponentialRampToValueAtTime(0.0001, now + stepDuration * 0.95);

    bassOsc.connect(filter);
    filter.connect(bassGain);
    bassGain.connect(ctx.destination);

    bassOsc.start(now);
    bassOsc.stop(now + stepDuration);
  }

  // 3. Lush Rhodes Jazz Chords every 4 steps
  if (step % 4 === 0) {
    const chordIdx = Math.floor(step / 4) % LOFI_TRACK.chords.length;
    const chordNotes = LOFI_TRACK.chords[chordIdx];
    const chordDur = stepDuration * 3.9;

    chordNotes.forEach((cFreq) => {
      const cOsc = ctx.createOscillator();
      const cGain = ctx.createGain();
      cOsc.type = 'sine';
      cOsc.frequency.setValueAtTime(cFreq, now);

      cGain.gain.setValueAtTime(0.0001, now);
      cGain.gain.linearRampToValueAtTime(0.024, now + 0.06);
      cGain.gain.exponentialRampToValueAtTime(0.0001, now + chordDur);

      cOsc.connect(cGain);
      cGain.connect(ctx.destination);
      cOsc.start(now);
      cOsc.stop(now + chordDur + 0.03);
    });
  }

  // 4. Soft Lo-Fi Pulse on downbeats
  if (step % 4 === 0) {
    const kickOsc = ctx.createOscillator();
    const kickGain = ctx.createGain();
    kickOsc.type = 'sine';
    kickOsc.frequency.setValueAtTime(105, now);
    kickOsc.frequency.exponentialRampToValueAtTime(36, now + 0.09);

    kickGain.gain.setValueAtTime(0.08, now);
    kickGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.11);

    kickOsc.connect(kickGain);
    kickGain.connect(ctx.destination);
    kickOsc.start(now);
    kickOsc.stop(now + 0.12);
  }

  bgmStep = (bgmStep + 1) % 16;
}

export function startBackgroundMusic(forceEnable = false) {
  if (forceEnable) {
    bgmEnabledPreference = true;
    try {
      localStorage.setItem('neuroquiz_bgm_enabled', 'true');
    } catch (e) {}
  }

  if (!bgmEnabledPreference) return false;

  const ctx = getAudioContext();
  if (!ctx) return false;

  if (bgmTimer) {
    clearInterval(bgmTimer);
    bgmTimer = null;
  }

  const stepMs = Math.round((60 / LOFI_TRACK.bpm / 2) * 1000);
  bgmPlaying = true;
  playLofiStep();
  bgmTimer = setInterval(playLofiStep, stepMs);
  notifyBgmListeners();
  return true;
}

export function stopBackgroundMusic(savePreference = false) {
  if (savePreference) {
    bgmEnabledPreference = false;
    try {
      localStorage.setItem('neuroquiz_bgm_enabled', 'false');
    } catch (e) {}
  }

  bgmPlaying = false;
  if (bgmTimer) {
    clearInterval(bgmTimer);
    bgmTimer = null;
  }
  notifyBgmListeners();
}

export function toggleBackgroundMusic() {
  if (bgmPlaying) {
    stopBackgroundMusic(true);
    return false;
  } else {
    return startBackgroundMusic(true);
  }
}

// Auto-start Lo-Fi Music on first user interaction if enabled
if (typeof window !== 'undefined') {
  const unlockAndAutoPlay = () => {
    if (bgmEnabledPreference && !bgmPlaying) {
      startBackgroundMusic(false);
    }
    window.removeEventListener('pointerdown', unlockAndAutoPlay);
    window.removeEventListener('keydown', unlockAndAutoPlay);
  };
  window.addEventListener('pointerdown', unlockAndAutoPlay, { passive: true });
  window.addEventListener('keydown', unlockAndAutoPlay, { passive: true });
}

// ==================== QUIZ ANSWER SOUND EFFECTS ====================

/**
 * "TINQ!" Sound Effect
 * Crystal-clear, bright, sparkling ascending bell ping
 * Played when the user selects the CORRECT answer
 */
export function playCorrectSound() {
  if (!soundEnabledState) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc1.type = 'sine';
    osc2.type = 'triangle';

    osc1.frequency.setValueAtTime(1046.5, now);
    osc1.frequency.exponentialRampToValueAtTime(1567.98, now + 0.09);

    osc2.frequency.setValueAtTime(2093.0, now);
    osc2.frequency.exponentialRampToValueAtTime(3135.96, now + 0.11);

    gainNode.gain.setValueAtTime(0.0001, now);
    gainNode.gain.linearRampToValueAtTime(0.38, now + 0.015);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.42);

    osc1.connect(gainNode);
    osc2.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.45);
    osc2.stop(now + 0.45);
  } catch (err) {
    console.warn('Audio play error:', err);
  }
}

/**
 * "TINININI" Sound Effect
 * Classic 4-note descending staccato buzzer (ti - ni - ni - ni)
 * Played when the user selects an INCORRECT answer
 */
export function playIncorrectSound() {
  if (!soundEnabledState) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    const steps = [
      { freq: 493.88, start: 0.0, dur: 0.085 },  // B4: "ti"
      { freq: 440.00, start: 0.095, dur: 0.085 }, // A4: "ni"
      { freq: 369.99, start: 0.19, dur: 0.085 },  // F#4: "ni"
      { freq: 293.66, start: 0.285, dur: 0.22 },  // D4: "ni"
    ];

    steps.forEach(({ freq, start, dur }, idx) => {
      const noteStart = now + start;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, noteStart);

      if (idx === steps.length - 1) {
        osc.frequency.linearRampToValueAtTime(freq * 0.88, noteStart + dur);
      }

      gain.gain.setValueAtTime(0.0001, noteStart);
      gain.gain.linearRampToValueAtTime(0.32, noteStart + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.0001, noteStart + dur);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(noteStart);
      osc.stop(noteStart + dur + 0.02);
    });
  } catch (err) {
    console.warn('Audio play error:', err);
  }
}

/**
 * Celebration fanfare chord when completing quiz
 */
export function playCompleteSound() {
  if (!soundEnabledState) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const chords = [
      { freq: 523.25, start: 0.0, dur: 0.12 },
      { freq: 659.25, start: 0.12, dur: 0.12 },
      { freq: 783.99, start: 0.24, dur: 0.12 },
      { freq: 1046.5, start: 0.36, dur: 0.5 },
    ];

    chords.forEach(({ freq, start, dur }) => {
      const noteStart = now + start;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, noteStart);

      gain.gain.setValueAtTime(0.0001, noteStart);
      gain.gain.linearRampToValueAtTime(0.28, noteStart + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, noteStart + dur);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(noteStart);
      osc.stop(noteStart + dur + 0.02);
    });
  } catch (err) {
    console.warn('Audio play error:', err);
  }
}
