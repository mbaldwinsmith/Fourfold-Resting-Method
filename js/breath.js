export class BreathAnimator {
  constructor({ container, pattern, onPhaseChange, onCycleComplete }) {
    this._container = container;
    this._inner = container.querySelector('.breath-ring__inner');
    this._pattern = pattern;
    this._onPhaseChange = onPhaseChange || null;
    this._onCycleComplete = onCycleComplete || null;

    this._phase = 'idle';
    this._cycle = 0;
    this._timeoutId = null;
    this._phaseStartedAt = 0;
    this._currentPhaseDuration = 0;
    this._remainingInPhase = 0;
    this._paused = false;
  }

  start() {
    if (this._phase !== 'idle' && this._phase !== 'complete') return;
    this._cycle = 0;
    this._startIn();
  }

  stop() {
    clearTimeout(this._timeoutId);
    this._timeoutId = null;
    if (this._inner) {
      this._inner.classList.remove('animate-breath-in', 'animate-breath-out');
      this._inner.style.animationPlayState = '';
    }
    this._phase = 'idle';
    this._paused = false;
    this._updateCue();
  }

  pause() {
    if (this._paused || this._phase === 'idle' || this._phase === 'complete') return;
    this._remainingInPhase = this._currentPhaseDuration - (Date.now() - this._phaseStartedAt);
    clearTimeout(this._timeoutId);
    this._timeoutId = null;
    if (this._inner) this._inner.style.animationPlayState = 'paused';
    this._paused = true;
  }

  resume() {
    if (!this._paused) return;
    this._paused = false;
    if (this._inner) this._inner.style.animationPlayState = '';
    // Adjust _phaseStartedAt so future pause() calculations stay accurate.
    this._phaseStartedAt = Date.now() - (this._currentPhaseDuration - this._remainingInPhase);
    this._timeoutId = setTimeout(
      () => this._onPhaseTimeout(),
      Math.max(0, this._remainingInPhase)
    );
  }

  destroy() {
    this.stop();
    this._onPhaseChange = null;
    this._onCycleComplete = null;
    this._container = null;
    this._inner = null;
  }

  getCurrentPhase() {
    return this._phase;
  }

  getCurrentCycle() {
    return this._cycle;
  }

  get cueText() {
    switch (this._phase) {
      case 'in':   return 'Breathe in';
      case 'hold': return 'Hold';
      case 'out':  return 'Breathe out';
      default:     return 'Rest';
    }
  }

  _updateCue() {
    if (!this._container) return;
    const el = this._container.querySelector('[data-cue]');
    if (el) el.textContent = this.cueText;
  }

  _schedulePhase(durationMs) {
    this._phaseStartedAt = Date.now();
    this._currentPhaseDuration = durationMs;
    this._timeoutId = setTimeout(() => this._onPhaseTimeout(), durationMs);
  }

  _startIn() {
    this._cycle++;
    this._phase = 'in';

    if (this._inner) {
      const ms = this._pattern.inDuration * 1000;
      this._inner.classList.remove('animate-breath-out');
      this._inner.style.setProperty('--breath-in-duration', `${ms}ms`);
      this._inner.classList.add('animate-breath-in');
    }

    this._schedulePhase(this._pattern.inDuration * 1000);
    if (this._onPhaseChange) this._onPhaseChange('in');
    this._updateCue();
  }

  _startHold() {
    this._phase = 'hold';
    // animate-breath-in remains on the element; fill-mode: forwards holds scale(1.18).
    this._schedulePhase(this._pattern.holdDuration * 1000);
    if (this._onPhaseChange) this._onPhaseChange('hold');
    this._updateCue();
  }

  _startOut() {
    this._phase = 'out';

    if (this._inner) {
      const ms = this._pattern.outDuration * 1000;
      this._inner.classList.remove('animate-breath-in');
      this._inner.style.setProperty('--breath-out-duration', `${ms}ms`);
      this._inner.classList.add('animate-breath-out');
    }

    this._schedulePhase(this._pattern.outDuration * 1000);
    if (this._onPhaseChange) this._onPhaseChange('out');
    this._updateCue();
  }

  _onPhaseTimeout() {
    switch (this._phase) {
      case 'in':
        if (this._pattern.holdDuration > 0) {
          this._startHold();
        } else {
          this._startOut();
        }
        break;

      case 'hold':
        this._startOut();
        break;

      case 'out':
        if (this._onCycleComplete) this._onCycleComplete(this._cycle);
        if (this._cycle < this._pattern.cycles) {
          this._startIn();
        } else {
          this._phase = 'complete';
          if (this._inner) {
            this._inner.classList.remove('animate-breath-in', 'animate-breath-out');
          }
          if (this._onPhaseChange) this._onPhaseChange('complete');
          this._updateCue();
        }
        break;
    }
  }
}
