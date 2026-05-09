# The Fourfold Resting

A clean, minimalistic, interactive website for a science-based relaxation and presence practice. Built with vanilla HTML, CSS, and modular JavaScript — no frameworks, no build tools, no dependencies.

---

## About the practice

The Fourfold Resting is a structured relaxation method comprising four movements — **Settling**, **Grounding**, **Receiving**, and **Returning** — designed to shift the nervous system toward parasympathetic tone and open a state of calm, receptive attention.

It draws on three converging bodies of research: polyvagal theory (Porges), heart rate variability research (Lehrer & Gevirtz), and interoceptive awareness studies (Craig, Farb). Two modes are provided: a brief 4–5 minute daily form, and a fuller 12–15 minute pre-event preparation.

---

## Features

- **Guided practice** — step-by-step instructions for all four phases in both brief and full modes
- **Precise countdown timer** — `requestAnimationFrame` + `performance.now()` for drift-free timing, with clean pause and resume
- **Breath animator** — visual breath ring guiding the 4:1:8 (full) and 4:8 (brief) breathing patterns during the Settling phase
- **Meditative chimes** — synthesised via Web Audio API, no external audio files; phase-specific frequencies (528 / 432 / 396 / 639 Hz) with carefully shaped envelopes; never autoplays
- **Two practice modes** — brief daily (4–5 min, two movements) and full pre-event (12–15 min, four movements)
- **Dark mode** — automatic via `prefers-color-scheme`
- **Reduced motion** — all animations suppressed when `prefers-reduced-motion` is active
- **Accessible** — keyboard navigable, screen reader announcements for phase transitions and timer milestones, WCAG AA contrast throughout
- **No dependencies** — no npm, no bundler, no CDN scripts; open `index.html` and it works

---

## Project structure

```
fourfold-resting/
├── index.html          # App shell and single entry point
├── about.html          # Static fallback for /about (works without JS)
├── css/
│   ├── reset.css       # Minimal CSS reset
│   ├── tokens.css      # Design tokens as CSS custom properties
│   ├── typography.css  # Base type styles
│   ├── layout.css      # Structural layout and grid
│   ├── components.css  # Reusable UI components
│   └── animations.css  # Keyframes and animation utilities
├── js/
│   ├── main.js         # App entry point, state, view orchestration
│   ├── data.js         # All practice content and configuration
│   ├── router.js       # Minimal hash-based router
│   ├── timer.js        # Precise countdown timer (RAF-based)
│   ├── chime.js        # Web Audio API chime engine
│   ├── breath.js       # Breath ring animation controller
│   └── ui.js           # DOM utilities and helpers
└── assets/
    └── favicon.svg     # SVG favicon (breath ring motif)
```

---

## Getting started

No installation required. Clone or download the repository and open `index.html` in any modern browser:

```bash
git clone https://github.com/your-username/fourfold-resting.git
cd fourfold-resting
open index.html
```

Or serve it locally with any static file server:

```bash
# Python
python -m http.server 8000

# Node (if you have npx)
npx serve .
```

The app uses ES modules (`type="module"`), which require a server origin in some browsers. If opening directly from the filesystem doesn't work, use the local server approach above.

---

## JavaScript modules

Each module has a single, well-defined responsibility.

### `data.js`
Exports a single `PRACTICE` constant containing all content: phase text, step instructions, breath patterns, chime frequencies, durations for both modes, and scientific foundations. Edit this file to change any practice content without touching application logic.

### `chime.js`
Exports a `ChimeEngine` class and a ready-to-use `chimeEngine` singleton. All audio is synthesised via the Web Audio API using sine oscillators with shaped envelopes — no audio files, no CDN. The `AudioContext` is created lazily on the first `enable()` call, satisfying browser autoplay policies. Four sound types: `start`, `end`, `transition`, `complete`.

### `timer.js`
Exports a `PracticeTimer` class with `start`, `pause`, `resume`, `reset`, and `destroy` methods. Uses `requestAnimationFrame` and `performance.now()` to avoid `setInterval` drift. Accurate to within a single frame (~16ms) over any duration.

### `breath.js`
Exports a `BreathAnimator` class that drives the breath ring via CSS class toggling and custom properties rather than JS-computed inline styles. Keeps animation on the GPU. Respects declared inhale / hold / exhale durations and emits `onPhaseChange` and `onCycleComplete` callbacks.

### `router.js`
Exports a `Router` class and `router` singleton. Minimal hash-based routing (`#/`, `#/practice`, `#/about`). No history API, no server configuration needed.

### `ui.js`
Shared DOM utilities: `formatTime`, `renderSteps`, `animateIn`, `setProgress`, `renderPhaseDots`, `fadeIn`, `fadeOut`, `announce` (ARIA live region), `setTitle`.

### `main.js`
The only file that imports from all others. Owns the application state object, wires up the router, handles view rendering, and orchestrates the timer, chime engine, and breath animator as a coordinated session.

---

## Design

The visual language prioritises calm and clarity.

- **Typefaces**: Lora (serif, italic) for headings and display text; Inter for body and UI
- **Palette**: warm off-white background (`#F7F5F0`), deep muted green accent (`#3D5A4C`), no pure black or white
- **Motion**: opacity and transform transitions only; `cubic-bezier(0.4, 0, 0.2, 1)`; nothing layout-triggering
- **No shadows, no gradients, no blur** — depth through whitespace and subtle 1px borders

Full design token definitions are in `css/tokens.css`.

---

## Accessibility

- All interactive elements have visible `:focus-visible` outlines
- Phase transitions and timer milestones (60s, 30s, 10s remaining) announced via `aria-live`
- Breath cues (`Breathe in`, `Breathe out`) announced on each cycle change
- Keyboard shortcuts: `Space` to pause/resume, `ArrowRight` to skip step, `Escape` to exit
- `prefers-reduced-motion` suppresses all animations and transitions
- `about.html` is fully static — readable without JavaScript
- WCAG AA contrast maintained in both light and dark modes

---

## Browser support

Any modern browser with ES module support: Chrome 61+, Firefox 60+, Safari 10.1+, Edge 16+. Web Audio API is required for chimes — the toggle is disabled gracefully if unavailable.

---

## Licence

MIT. Use freely, adapt openly, share widely.

---

## Scientific references

Porges, S.W. (1994, 2011). *The Polyvagal Theory.* Norton.
Lehrer, P. & Gevirtz, R. (2014). Heart rate variability biofeedback. *Frontiers in Psychology.*
Zaccaro, A. et al. (2018). How breath-control can change your life. *Frontiers in Human Neuroscience.*
Craig, A.D. (2009). How do you feel — now? *Nature Reviews Neuroscience.*
Farb, N. et al. (2013). Interoception, contemplative practice, and health. *Frontiers in Psychology.*
Lieberman, M.D. et al. (2007). Putting feelings into words. *Psychological Science.*
Ma, X. et al. (2017). The effect of diaphragmatic breathing. *Frontiers in Psychology.*
Buckner, R.L. et al. (2008). The brain's default network. *Annals of the New York Academy of Sciences.*
Fredrickson, B.L. (2001). The role of positive emotions. *American Psychologist.*
Phan, K.L. et al. (2002). Functional neuroanatomy of emotion. *NeuroImage.*
Ley, R. (1999). The modification of breathing behavior. *Behavior Modification.*
