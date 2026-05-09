let _announcer = null;

// Renders step cards into container. Active card gets .step-card--active;
// adjacent cards are faded to indicate context without distraction.
export function renderSteps(container, steps, activeIndex) {
  container.innerHTML = '';
  steps.forEach((step, i) => {
    const card = document.createElement('div');
    card.className = 'step-card';
    if (i === activeIndex) {
      card.classList.add('step-card--active');
    } else {
      const distance = Math.abs(i - activeIndex);
      card.style.opacity = distance === 1 ? '0.45' : '0.2';
    }
    card.textContent = step.text;
    container.appendChild(card);
  });
}

// Formats a seconds value as M:SS (e.g. 185 → '3:05').
export function formatTime(seconds) {
  const total = Math.max(0, Math.floor(seconds));
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

// Adds .fade-up to element (with optional delay in ms), then removes it once
// the animation ends so the element's normal styles take over cleanly.
export function animateIn(element, delay = 0) {
  if (delay) {
    element.style.animationDelay = `${delay}ms`;
  }
  element.classList.add('fade-up');
  element.addEventListener('animationend', () => {
    element.classList.remove('fade-up');
    element.style.animationDelay = '';
  }, { once: true });
}

// Sets the width of the .progress-fill child inside trackElement (0–1).
export function setProgress(trackElement, progress) {
  const fill = trackElement.querySelector('.progress-fill');
  if (fill) {
    fill.style.width = `${Math.min(1, Math.max(0, progress)) * 100}%`;
  }
}

// Toggles aria-expanded on a disclosure trigger and hides/shows the element
// referenced by its aria-controls attribute (if present).
export function toggleDisclosure(triggerElement) {
  const isExpanded = triggerElement.getAttribute('aria-expanded') === 'true';
  triggerElement.setAttribute('aria-expanded', String(!isExpanded));

  const controlledId = triggerElement.getAttribute('aria-controls');
  if (controlledId) {
    const panel = document.getElementById(controlledId);
    if (panel) panel.hidden = isExpanded;
  }
}

// Renders a row of phase navigation buttons into container.
// Active phase gets aria-current="step". Clicking a dot calls onClick(index).
export function renderPhaseDots(container, phases, activeIndex, onClick) {
  container.innerHTML = '';
  phases.forEach((phase, i) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'phase-dot';
    btn.setAttribute('aria-label', `Phase ${phase.number}: ${phase.title}`);
    if (i === activeIndex) {
      btn.classList.add('phase-dot--active');
      btn.setAttribute('aria-current', 'step');
    }
    btn.addEventListener('click', () => onClick(i));
    container.appendChild(btn);
  });
}

// Unhides element and plays a fade-in animation, then removes the class.
export function fadeIn(element) {
  element.hidden = false;
  element.classList.add('fade-in');
  element.addEventListener('animationend', () => {
    element.classList.remove('fade-in');
  }, { once: true });
}

// Fades element out via a CSS opacity transition, hides it, then calls onComplete.
export function fadeOut(element, onComplete) {
  element.style.transition = 'opacity var(--duration-short) var(--ease-default)';
  element.style.opacity = '0';

  const finish = () => {
    element.hidden = true;
    element.style.transition = '';
    element.style.opacity = '';
    if (onComplete) onComplete();
  };

  element.addEventListener('transitionend', finish, { once: true });

  // Fallback in case transitionend doesn't fire (e.g. element already hidden).
  setTimeout(finish, 300);
}

// Sets document.title. Pass a suffix to get 'Suffix — The Fourfold Resting'.
export function setTitle(suffix) {
  document.title = suffix
    ? `${suffix} — The Fourfold Resting`
    : 'The Fourfold Resting';
}

// Announces text to screen readers via a persistent aria-live="polite" region.
// Reuses the #aria-announcer element from index.html if present, otherwise
// creates and appends one. Clears then re-sets to ensure re-announcement of
// repeated strings.
export function announce(text) {
  if (!_announcer) {
    _announcer = document.getElementById('aria-announcer');
    if (!_announcer) {
      _announcer = document.createElement('div');
      _announcer.id = 'aria-announcer';
      _announcer.setAttribute('aria-live', 'polite');
      _announcer.setAttribute('aria-atomic', 'true');
      _announcer.style.cssText = [
        'position:absolute',
        'width:1px',
        'height:1px',
        'padding:0',
        'margin:-1px',
        'overflow:hidden',
        'clip:rect(0,0,0,0)',
        'white-space:nowrap',
        'border:0',
      ].join(';');
      document.body.appendChild(_announcer);
    }
  }
  // Clear first so the same string re-announces if called again.
  _announcer.textContent = '';
  requestAnimationFrame(() => {
    _announcer.textContent = text;
  });
}
