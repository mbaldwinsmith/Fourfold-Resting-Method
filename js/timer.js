export class PracticeTimer {
  constructor({ duration, onTick, onComplete, onPause, onResume }) {
    this._duration = duration;
    this._onTick = onTick || null;
    this._onComplete = onComplete || null;
    this._onPause = onPause || null;
    this._onResume = onResume || null;

    this._state = 'idle';
    this._startTime = 0;
    this._pausedAt = 0;
    this._totalPausedDuration = 0;
    this._rafId = null;
    this._lastTickTime = 0;
  }

  start() {
    if (this._state !== 'idle') return;
    this._state = 'running';
    this._startTime = performance.now();
    this._totalPausedDuration = 0;
    this._lastTickTime = -Infinity; // ensure first tick fires immediately
    this._rafId = requestAnimationFrame(() => this._tick());
  }

  pause() {
    if (this._state !== 'running') return;
    this._state = 'paused';
    this._pausedAt = performance.now();
    cancelAnimationFrame(this._rafId);
    this._rafId = null;
    if (this._onPause) this._onPause();
  }

  resume() {
    if (this._state !== 'paused') return;
    this._totalPausedDuration += performance.now() - this._pausedAt;
    this._state = 'running';
    this._lastTickTime = -Infinity; // fire tick immediately on resume
    this._rafId = requestAnimationFrame(() => this._tick());
    if (this._onResume) this._onResume();
  }

  reset() {
    cancelAnimationFrame(this._rafId);
    this._rafId = null;
    this._state = 'idle';
    this._startTime = 0;
    this._pausedAt = 0;
    this._totalPausedDuration = 0;
    this._lastTickTime = 0;
  }

  destroy() {
    cancelAnimationFrame(this._rafId);
    this._rafId = null;
    this._onTick = null;
    this._onComplete = null;
    this._onPause = null;
    this._onResume = null;
    this._state = 'idle';
  }

  getState() {
    return this._state;
  }

  getRemaining() {
    if (this._state === 'idle') return this._duration;
    if (this._state === 'complete') return 0;
    return Math.max(0, this._duration - this._getElapsed());
  }

  getProgress() {
    if (this._state === 'idle') return 0;
    if (this._state === 'complete') return 1;
    return Math.min(1, this._getElapsed() / this._duration);
  }

  // Elapsed seconds, accounting for all paused time.
  // When paused, freezes at the moment of pause.
  _getElapsed() {
    const wallNow = this._state === 'paused' ? this._pausedAt : performance.now();
    return (wallNow - this._startTime - this._totalPausedDuration) / 1000;
  }

  _tick() {
    if (this._state !== 'running') return;

    const now = performance.now();
    const elapsed = (now - this._startTime - this._totalPausedDuration) / 1000;
    const remaining = Math.max(0, this._duration - elapsed);
    const progress = Math.min(1, elapsed / this._duration);

    // Throttle onTick to ~250ms; a final tick at exactly 0 is always sent.
    if (now - this._lastTickTime >= 250) {
      this._lastTickTime = now;
      if (this._onTick) this._onTick(remaining, elapsed, progress);
    }

    if (remaining <= 0) {
      this._state = 'complete';
      // Guarantee the UI sees remaining=0, progress=1 regardless of throttle.
      if (this._onTick) this._onTick(0, this._duration, 1);
      if (this._onComplete) this._onComplete();
      return;
    }

    this._rafId = requestAnimationFrame(() => this._tick());
  }
}

export function createTimer(options) {
  return new PracticeTimer(options);
}

export default createTimer;
