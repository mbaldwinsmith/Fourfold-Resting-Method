export class ChimeEngine {
  constructor() {
    this._ctx = null;
    this._masterGain = null;
    this._enabled = false;
    this._volume = 0.35;
  }

  enable() {
    if (!this._ctx) {
      try {
        this._ctx = new (window.AudioContext || window.webkitAudioContext)();
        this._masterGain = this._ctx.createGain();
        this._masterGain.gain.value = this._volume;
        this._masterGain.connect(this._ctx.destination);
      } catch {
        return;
      }
    }
    if (this._ctx.state === 'suspended') {
      this._ctx.resume();
    }
    this._enabled = true;
  }

  disable() {
    this._enabled = false;
  }

  isEnabled() {
    return this._enabled;
  }

  setVolume(v) {
    this._volume = Math.max(0, Math.min(1, v));
    if (this._masterGain) {
      this._masterGain.gain.value = this._volume;
    }
  }

  play(type, freq) {
    if (!this._enabled || !this._ctx || this._ctx.state === 'closed') return;
    switch (type) {
      case 'start':      this._playStart(freq);      break;
      case 'end':        this._playEnd(freq);        break;
      case 'transition': this._playTransition(freq); break;
      case 'complete':   this._playComplete(freq);   break;
    }
  }

  // Schedules a single sine note with a shaped ADSR envelope.
  // All volume work is done on a per-note GainNode — oscillator frequency is never
  // used as a volume proxy.
  _playNote(freq, startTime, attackTime, sustainTime, decayTime) {
    const ctx = this._ctx;
    const osc = ctx.createOscillator();
    const env = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.value = freq;

    const t0 = startTime;
    const t1 = t0 + attackTime;
    const t2 = t1 + sustainTime;
    const t3 = t2 + decayTime;

    env.gain.setValueAtTime(0, t0);
    env.gain.linearRampToValueAtTime(1, t1);
    env.gain.setValueAtTime(1, t2);
    env.gain.exponentialRampToValueAtTime(0.0001, t3);

    osc.connect(env);
    env.connect(this._masterGain);

    osc.start(t0);
    osc.stop(t3 + 0.05);

    osc.onended = () => {
      osc.disconnect();
      env.disconnect();
    };
  }

  // Single tone — gentle signal of readiness.
  // Attack 20ms · sustain 400ms · decay 1200ms
  _playStart(freq) {
    const now = this._ctx.currentTime;
    this._playNote(freq, now, 0.02, 0.4, 1.2);
  }

  // Two ascending tones — marks phase completion.
  // Each tone 600ms (attack 20ms · sustain 200ms · decay 380ms), 200ms gap.
  _playEnd(freq) {
    const now = this._ctx.currentTime;
    this._playNote(freq,        now,      0.02, 0.20, 0.38);
    this._playNote(freq * 1.5,  now + 0.8, 0.02, 0.20, 0.38);
  }

  // Soft ascending three-note sequence — internal stage transition.
  // Each note 300ms (attack 20ms · sustain 100ms · decay 180ms), 80ms gap.
  _playTransition(freq) {
    const now = this._ctx.currentTime;
    const step = 0.3 + 0.08; // note duration + gap
    this._playNote(freq,        now,          0.02, 0.10, 0.18);
    this._playNote(freq * 1.25, now + step,   0.02, 0.10, 0.18);
    this._playNote(freq * 1.5,  now + step * 2, 0.02, 0.10, 0.18);
  }

  // Four-note resolution chord — signals end of full practice.
  // Notes staggered 150ms apart, each attack 20ms · sustain 2000ms · decay 1000ms.
  _playComplete(freq) {
    const now = this._ctx.currentTime;
    const stagger = 0.15;
    this._playNote(freq,        now,               0.02, 2.0, 1.0);
    this._playNote(freq * 1.25, now + stagger,     0.02, 2.0, 1.0);
    this._playNote(freq * 1.5,  now + stagger * 2, 0.02, 2.0, 1.0);
    this._playNote(freq * 2,    now + stagger * 3, 0.02, 2.0, 1.0);
  }
}

export const chimeEngine = new ChimeEngine();
