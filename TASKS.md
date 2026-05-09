# tasks.md — The Fourfold Resting: Website Build

> **For Claude Code.** Build a clean, minimalistic, interactive website for *The Fourfold Resting*, a science-based relaxation method. Vanilla HTML, CSS, and modular JavaScript only — no frameworks, no build tools, no dependencies. Each task is self-contained and should be completed in order. Confirm each task before proceeding to the next.

---

## Project structure

Create the following file structure before beginning any task:

```
fourfold-resting/
├── index.html
├── about.html
├── css/
│   ├── reset.css
│   ├── tokens.css
│   ├── typography.css
│   ├── layout.css
│   ├── components.css
│   └── animations.css
├── js/
│   ├── main.js
│   ├── data.js
│   ├── router.js
│   ├── timer.js
│   ├── chime.js
│   ├── breath.js
│   └── ui.js
└── assets/
    └── favicon.svg
```

All JS files are ES modules. Import them explicitly — no bundler. All CSS files are linked explicitly in order in `<head>`. No inline styles in HTML. No inline scripts.

---

## Design language

Apply consistently across all tasks. Do not deviate.

**Palette — light mode (default)**
- Background: `#F7F5F0` (warm off-white)
- Surface: `#FFFFFF`
- Text primary: `#1A1A18`
- Text secondary: `#6B6860`
- Text tertiary: `#9E9C97`
- Border: `rgba(26,26,24,0.10)`
- Accent: `#3D5A4C` (deep muted green — calm, not clinical)
- Accent light: `#EAF0EC`
- Accent mid: `#7A9E8C`

**Palette — dark mode** (prefers-color-scheme: dark)
- Background: `#111210`
- Surface: `#1C1D1A`
- Text primary: `#F0EDE6`
- Text secondary: `#9A9890`
- Text tertiary: `#5E5D59`
- Border: `rgba(240,237,230,0.08)`
- Accent: `#7FAF95`
- Accent light: `#1A2520`
- Accent mid: `#4A7A62`

**Typography**
- Body font: `'Inter', system-ui, sans-serif` — load from Google Fonts (Inter, weights 300/400/500)
- Heading font: `'Lora', Georgia, serif` — load from Google Fonts (Lora, weights 400/500 italic)
- Base size: 16px
- Scale: 12 / 14 / 16 / 18 / 22 / 28 / 36px
- Line height body: 1.75
- Line height headings: 1.2
- Letter spacing headings: -0.02em
- Letter spacing small caps / labels: 0.08em

**Motion**
- All transitions: `cubic-bezier(0.4, 0, 0.2, 1)`
- Duration short: 200ms
- Duration medium: 400ms
- Duration long: 800ms
- Prefer `opacity` and `transform` only — no layout-triggering transitions

**Spacing scale (rem)**
- 0.25 / 0.5 / 0.75 / 1 / 1.5 / 2 / 3 / 4 / 6 / 8

**Borders**
- Radius small: 4px
- Radius medium: 8px
- Radius large: 16px
- Border weight: 1px solid `var(--color-border)`

**No shadows.** No gradients. No blur effects. Depth through whitespace and subtle borders only.

---

## Task 1 — Design tokens and reset

**File:** `css/reset.css`, `css/tokens.css`

### reset.css
Write a minimal CSS reset:
- Box-sizing border-box on `*`
- Remove default margin and padding from `body`, headings, `p`, `ul`, `ol`, `figure`
- `img`, `svg` display block, max-width 100%
- `button`, `input` inherit font
- Remove list-style from `ul`, `ol` with a `role="list"` attribute
- Smooth scroll on `html`
- Respect `prefers-reduced-motion`: set all transitions and animations to `duration: 0.01ms` when active

### tokens.css
Define all design tokens as CSS custom properties on `:root`. Include:
- All colour values from the design language above as `--color-*` variables
- All spacing values as `--space-*` (e.g. `--space-1: 1rem`)
- All font families as `--font-body` and `--font-heading`
- All font sizes as `--text-xs` through `--text-4xl`
- All transition durations as `--duration-short`, `--duration-medium`, `--duration-long`
- All easing as `--ease-default`
- All border radii as `--radius-sm`, `--radius-md`, `--radius-lg`

Include a `@media (prefers-color-scheme: dark)` block on `:root` that overrides all `--color-*` variables with dark mode values.

---

## Task 2 — Typography and layout

**Files:** `css/typography.css`, `css/layout.css`

### typography.css
Define base typographic styles:
- `body`: font-body, 16px, text-primary, line-height 1.75, background-color background
- `h1`: font-heading italic, 36px, letter-spacing -0.02em, line-height 1.2
- `h2`: font-heading, 28px, letter-spacing -0.02em
- `h3`: font-heading, 22px
- `h4`: font-body 500, 18px
- `p`: margin-bottom 1.5rem, max-width 65ch
- `p:last-child`: margin-bottom 0
- `.label`: font-body 500, 12px, letter-spacing 0.08em, text-transform uppercase, color text-tertiary
- `.caption`: font-body 300, 14px, color text-secondary, line-height 1.6
- `strong`: font-weight 500 (not 700)
- `em`: font-style italic, color text-secondary
- `a`: color accent, text-underline-offset 3px, no decoration by default, underline on hover
- Blockquote: left border 2px solid accent-mid, padding-left 1.5rem, font-heading italic, color text-secondary

### layout.css
Define structural layout:
- `.container`: max-width 680px, margin 0 auto, padding 0 1.5rem
- `.container--wide`: max-width 960px
- `.container--narrow`: max-width 480px
- `.section`: padding 4rem 0
- `.section--sm`: padding 2rem 0
- `header` (site): position sticky, top 0, background surface with `backdrop-filter: blur(0)` (no blur), border-bottom border, z-index 100, height 56px, display flex, align-items center
- `main`: min-height calc(100vh - 56px)
- `footer`: border-top border, padding 2rem 0, color text-tertiary, font-size 14px
- `.grid-2`: display grid, grid-template-columns repeat(auto-fit, minmax(280px, 1fr)), gap 1.5rem
- `.stack`: display flex, flex-direction column, gap var set by `--stack-gap` custom property defaulting to 1rem

---

## Task 3 — Component styles

**File:** `css/components.css`

Define the following reusable components. No JavaScript coupling in this file — pure CSS only.

### Button
`.btn`: display inline-flex, align-items center, gap 0.5rem, padding 0.625rem 1.25rem, border-radius radius-md, border 1px solid border, background transparent, color text-primary, font-body 500 14px, letter-spacing 0.01em, cursor pointer, transition all duration-short ease-default.

Variants:
- `.btn--primary`: background accent, color white, border-color accent. Hover: slight opacity 0.88
- `.btn--ghost`: no border. Hover: background accent-light
- `.btn--sm`: padding 0.375rem 0.875rem, font-size 13px

States: `:disabled` opacity 0.4, cursor not-allowed. `:focus-visible` outline 2px solid accent, outline-offset 2px.

### Card
`.card`: background surface, border 1px solid border, border-radius radius-lg, padding 1.5rem 2rem, overflow hidden.
`.card--flat`: no border, background accent-light.

### Phase pill / badge
`.phase-badge`: display inline-flex, align-items center, gap 0.375rem, padding 0.25rem 0.75rem, border-radius 100px, background accent-light, color accent, font-body 500 12px, letter-spacing 0.06em, text-transform uppercase.

### Progress bar
`.progress-track`: height 2px, background border, border-radius 1px, overflow hidden.
`.progress-fill`: height 100%, background accent, border-radius 1px, transition width duration-long ease-default, transform-origin left.

### Breath ring (used by breath animator)
`.breath-ring`: position relative, width 120px, height 120px, border-radius 50%, border 1px solid border. Inner element `.breath-ring__inner`: position absolute, inset 12px, border-radius 50%, background accent-light, transition transform duration-long ease-default.

### Timer display
`.timer-display`: font-heading, font-size 48px, letter-spacing -0.03em, color text-primary, font-variant-numeric tabular-nums.
`.timer-display--sm`: font-size 28px.

### Step card
`.step-card`: padding 1.25rem 1.5rem, border-radius radius-md, border 1px solid border, background surface. When `.step-card--active`: border-color accent-mid, background accent-light.

### Science note
`.science-note`: border-left 2px solid border, padding 0.75rem 1rem 0.75rem 1.25rem, margin 1.5rem 0, color text-secondary, font-size 14px, line-height 1.65.

### Nav
`.site-nav`: display flex, align-items center, justify-content space-between, height 100%.
`.nav-links`: display flex, gap 2rem, list-style none. Link style: font-body 500 14px, color text-secondary, no underline. `.nav-links a.active` or `[aria-current="page"]`: color text-primary.
`.nav-logo`: font-heading italic, font-size 18px, color text-primary, no underline.

### Chime toggle
`.chime-toggle`: display inline-flex, align-items center, gap 0.5rem, font-size 13px, color text-secondary, cursor pointer, user-select none. Checkbox visually hidden, replaced by custom indicator `.chime-toggle__dot`: width 32px, height 18px, border-radius 9px, background border, transition background duration-short. Dot inner circle moves on checked state. When checked: background accent.

---

## Task 4 — Animation styles

**File:** `css/animations.css`

Define the following keyframe animations and utility classes. All must respect `prefers-reduced-motion`.

### Keyframes

`@keyframes fadeIn`: opacity 0 → 1
`@keyframes fadeUp`: opacity 0, translateY(12px) → opacity 1, translateY(0)
`@keyframes breatheIn`: scale(1) → scale(1.18)
`@keyframes breatheOut`: scale(1.18) → scale(1)
`@keyframes pulse`: opacity 1 → 0.4 → 1 (infinite, 3s)
`@keyframes shimmer`: background-position left → right (for skeleton loaders, not used but included)
`@keyframes progressIndeterminate`: translateX(-100%) → translateX(200%) (for indeterminate progress)

### Utility classes

`.fade-in`: animation fadeIn duration-medium ease-default forwards
`.fade-up`: animation fadeUp duration-medium ease-default forwards
`.fade-up--delayed`: same with animation-delay 150ms
`.fade-up--delayed-2`: animation-delay 300ms

`.animate-breath-in`: animation breatheIn applied duration via CSS var `--breath-in-duration` defaulting to 4000ms, ease-in-out, forwards
`.animate-breath-out`: animation breatheOut applied, duration via `--breath-out-duration` defaulting to 8000ms, ease-in-out, forwards
`.animate-pulse`: animation pulse 3s ease-in-out infinite

All animation utilities: `animation-fill-mode: both`. Wrap all keyframe definitions in `@media (prefers-reduced-motion: no-preference)` — outside this block define `*` animation-duration: 0.01ms.

---

## Task 5 — Content data module

**File:** `js/data.js`

Export a single `const PRACTICE` object (ES module default export) containing all content for the website. Structure:

```js
export const PRACTICE = {
  title: 'The Fourfold Resting',
  subtitle: 'A science-based relaxation and presence practice',
  tagline: 'Integrating breathwork, somatic grounding, and guided visualisation',
  overview: '...', // full overview paragraph text
  science: {
    polyvagal: { title: '...', body: '...' },
    hrv: { title: '...', body: '...' },
    interoception: { title: '...', body: '...' }
  },
  modes: [
    {
      id: 'brief',
      title: 'Brief daily practice',
      duration: '4–5 minutes',
      posture: 'Seated, feet flat on the floor',
      description: '...',
    },
    {
      id: 'full',
      title: 'Fuller pre-event preparation',
      duration: '12–15 minutes',
      posture: 'Seated, quiet space if possible',
      description: '...',
    }
  ],
  phases: [
    {
      id: 'settling',
      number: 'I',
      title: 'Settling',
      subtitle: 'The breath',
      durationBrief: 180,      // seconds
      durationFull: 300,
      chimeOnStart: true,
      chimeOnEnd: true,
      chimeFrequency: 528,     // Hz — used by chime.js
      steps: [
        { id: 's1', text: '...' },
        { id: 's2', text: '...' },
        { id: 's3', text: '...' }
      ],
      science: '...',
      breathPattern: {         // used by breath.js
        inDuration: 4,         // seconds
        holdDuration: 1,       // 0 for brief mode
        outDuration: 8,
        cycles: 6              // 3 for brief mode
      }
    },
    {
      id: 'grounding',
      number: 'II',
      title: 'Grounding',
      subtitle: 'The body',
      durationBrief: 120,
      durationFull: 240,
      chimeOnStart: true,
      chimeOnEnd: true,
      chimeFrequency: 432,
      steps: [ /* ... */ ],
      science: '...',
      breathPattern: null      // no guided breath in this phase
    },
    {
      id: 'receiving',
      number: 'III',
      title: 'Receiving',
      subtitle: 'Guided visualisation',
      durationBrief: null,     // not used in brief mode
      durationFull: 240,
      chimeOnStart: true,
      chimeOnEnd: true,
      chimeFrequency: 396,
      steps: [ /* ... */ ],
      science: '...',
      breathPattern: null,
      stages: [
        { id: 'r1', title: 'A place of safety', duration: 60, text: '...' },
        { id: 'r2', title: 'Presence',          duration: 120, text: '...' },
        { id: 'r3', title: 'Anticipation',      duration: 60, text: '...' }
      ]
    },
    {
      id: 'returning',
      number: 'IV',
      title: 'Returning',
      subtitle: 'Integration',
      durationBrief: null,
      durationFull: 180,
      chimeOnStart: true,
      chimeOnEnd: true,
      chimeFrequency: 639,
      steps: [ /* ... */ ],
      science: '...',
      breathPattern: null
    }
  ],
  references: [
    'Porges, S.W. (1994, 2011). The Polyvagal Theory.',
    // ... all references from method.md
  ]
}
```

Fill in all text content accurately from `method.md`. The `durationBrief` and `durationFull` values should reflect the times described in the method. Phases not used in brief mode have `durationBrief: null`.

---

## Task 6 — Chime audio module

**File:** `js/chime.js`

Build a self-contained audio module using the Web Audio API. No external audio files — all sounds synthesised programmatically.

### Requirements

- Export a class `ChimeEngine` with the following interface:
  ```js
  const chime = new ChimeEngine()
  chime.enable()          // user must call this after a gesture (resolves AudioContext suspension)
  chime.disable()
  chime.isEnabled()       // returns boolean
  chime.play(type, freq)  // types: 'start', 'end', 'transition', 'complete'
  chime.setVolume(0–1)
  ```

- All sounds are pure sine-wave based with careful envelope shaping (attack, sustain, decay) to avoid clicks and harshness. No square waves. No noise.

- Sound designs:
  - **`start`**: Single fundamental tone at `freq` Hz. Attack 20ms, sustain 400ms, decay 1200ms. Gentle — signals readiness without startling.
  - **`end`**: Two tones in sequence: `freq` then `freq * 1.5`, each 600ms, 200ms gap. Marks completion of a phase.
  - **`transition`**: Soft ascending three-note sequence using `freq`, `freq * 1.25`, `freq * 1.5`. Each note 300ms, 80ms gap. Used for internal stage transitions within a phase.
  - **`complete`**: Four-note resolution chord: `freq`, `freq * 1.25`, `freq * 1.5`, `freq * 2`. Notes staggered 150ms apart, each sustaining 2000ms, long fade. Signals end of full practice.

- The `ChimeEngine` must:
  - Lazily create the `AudioContext` on first `enable()` call
  - Use a `GainNode` for master volume (default 0.35)
  - Use per-note `GainNode`s for envelope shaping — never set `oscillator.frequency` to volume control
  - Gracefully handle `AudioContext` states (suspended, running, closed)
  - Export a singleton: `export const chimeEngine = new ChimeEngine()`

- Phase-specific frequencies (from `data.js`): 528 Hz (Settling), 432 Hz (Grounding), 396 Hz (Receiving), 639 Hz (Returning). These are passed in at call time, not hardcoded in chime.js.

---

## Task 7 — Timer module

**File:** `js/timer.js`

Build a precise, pauseable countdown timer. No `setInterval` drift — use `performance.now()` for elapsed time calculation.

### Requirements

Export a class `PracticeTimer` with this interface:

```js
const timer = new PracticeTimer({
  duration: 300,           // seconds
  onTick: (remaining, elapsed, progress) => {},   // called ~every 250ms
  onComplete: () => {},
  onPause: () => {},
  onResume: () => {}
})

timer.start()
timer.pause()
timer.resume()
timer.reset()
timer.destroy()           // clears all RAF handles
timer.getState()          // returns: 'idle' | 'running' | 'paused' | 'complete'
timer.getRemaining()      // seconds remaining (float)
timer.getProgress()       // 0–1
```

### Implementation notes

- Use `requestAnimationFrame` (not `setInterval`) for the tick loop
- Store `startTime`, `pausedAt`, and `totalPausedDuration` to compute elapsed accurately
- `onTick` fires approximately every 250ms but is RAF-driven — do not assume exact interval
- `remaining` passed to `onTick` is always `Math.max(0, duration - elapsed)` — never negative
- `progress` is `elapsed / duration`, clamped 0–1
- When `remaining` reaches 0, call `onComplete` exactly once, then stop the loop
- `destroy()` cancels any pending RAF and nullifies callbacks — call when component unmounts

Export a factory function `createTimer(options)` as the default export alongside the class.

---

## Task 8 — Breath animator module

**File:** `js/breath.js`

Build a breath animation controller that drives the `.breath-ring` component visually and optionally provides text cues.

### Requirements

Export a class `BreathAnimator`:

```js
const breath = new BreathAnimator({
  container: Element,     // the .breath-ring element
  pattern: {
    inDuration: 4,        // seconds
    holdDuration: 1,
    outDuration: 8,
    cycles: 6
  },
  onPhaseChange: (phase) => {},   // 'in' | 'hold' | 'out' | 'complete'
  onCycleComplete: (cycleNumber) => {}
})

breath.start()
breath.stop()
breath.pause()
breath.resume()
breath.destroy()
breath.getCurrentPhase()  // 'idle' | 'in' | 'hold' | 'out' | 'complete'
breath.getCurrentCycle()  // integer
```

### Implementation notes

- Use CSS custom properties and class toggling to drive animation (not JS-computed inline styles)
  - On inhale: add class `animate-breath-in`, set `--breath-in-duration` inline on element
  - On exhale: swap to `animate-breath-out`, set `--breath-out-duration`
  - On hold: remove animation classes, element stays at current scale
- Use `setTimeout` internally for phase transitions — aligned to declared durations
- Sequence: [in × inDuration] → [hold × holdDuration] → [out × outDuration] → repeat for `cycles` cycles → `onPhaseChange('complete')`
- If `holdDuration` is 0, skip the hold phase silently
- Provide a `.cueText` getter that returns the current instruction string: `'Breathe in'`, `'Hold'`, `'Breathe out'`, `'Rest'`
- Update a `.breath-ring [data-cue]` child element's textContent automatically if present in the DOM
- Pause/resume by storing remaining duration of current phase and resuming from that point

---

## Task 9 — UI utilities module

**File:** `js/ui.js`

A collection of lightweight DOM utilities used across the app. No framework — pure JS.

Export the following named functions:

```js
// Render a list of step cards into a container
renderSteps(container, steps, activeIndex)

// Format seconds as MM:SS string
formatTime(seconds)  // e.g. 185 → '3:05'

// Animate element in (adds fade-up class, removes after animation)
animateIn(element, delay)

// Set progress bar fill width
setProgress(trackElement, progress)  // 0–1

// Toggle aria-expanded on a disclosure element
toggleDisclosure(triggerElement)

// Render phase navigation dots
renderPhaseDots(container, phases, activeIndex, onClick)

// Show / hide an element with fade
fadeIn(element)
fadeOut(element, onComplete)

// Set page title
setTitle(suffix)   // 'Settling — The Fourfold Resting'

// Announce text to screen readers via aria-live region
announce(text)
```

Implement all functions. `announce` should create a visually-hidden `aria-live="polite"` region on first call and reuse it thereafter.

---

## Task 10 — Router module

**File:** `js/router.js`

A minimal hash-based router with no dependencies.

### Requirements

Export a class `Router`:

```js
const router = new Router()

router.register('/', homeHandler)
router.register('/practice', practiceHandler)
router.register('/about', aboutHandler)

router.start()    // binds hashchange, fires current route
router.navigate('/practice')
router.current()  // returns current path string
```

- Routes match on `window.location.hash` stripped of `#`
- Empty hash or `#/` both match `/`
- Each handler receives a `params` object (parse any query-string from hash)
- On unmatched route, navigate to `/`
- Export a singleton: `export const router = new Router()`

---

## Task 11 — Main application module

**File:** `js/main.js`

The application entry point and state orchestrator. Import all other modules. Define the complete application logic here.

### Application state

Maintain a single state object (not a framework — just a plain JS object with a simple `setState` function that triggers re-renders):

```js
const state = {
  mode: null,              // 'brief' | 'full'
  currentPhaseIndex: 0,
  currentStepIndex: 0,
  timerState: 'idle',      // 'idle' | 'running' | 'paused' | 'complete'
  chimeEnabled: false,
  practiceComplete: false,
  activeView: 'home'       // 'home' | 'practice' | 'about'
}
```

### Views to implement

#### Home view (`/`)
- Header with site logo/title (`font-heading italic`) and nav
- Hero: large `h1` with the practice title, italic Lora; subtitle beneath in text-secondary; a short one-paragraph description
- Two mode selection cards (`.card`) side by side: "Brief daily practice" and "Fuller pre-event preparation" — each showing duration, posture, a short description, and a "Begin" button (`.btn--primary`)
- Clicking "Begin" sets `state.mode` and navigates to `/practice`
- A brief "What is this?" section below the cards with the overview paragraph and a link to `/about`
- Footer with references line

#### Practice view (`/practice`)
The main interactive view. Layout:
- Top bar: phase name (`.phase-badge`), timer display (`.timer-display`), chime toggle, pause/resume button
- Phase content area (centre, `.container--narrow`):
  - Phase number and title (`h2`)
  - Breath ring (only visible during Settling phase)
  - Current step card (`.step-card--active`) with step text, surrounded by previous/next steps at reduced opacity
  - Science note (`.science-note`) collapsed by default, expandable via "The science" toggle button
- Bottom bar: progress track spanning all phases (subdivided), prev/next phase buttons, phase dots

Behaviour:
- On entering practice view, show a "Ready to begin?" screen with the selected mode name, total duration, and a large "Start" button. Chime toggle is visible here.
- On "Start": initialise `PracticeTimer` for current phase duration, start `BreathAnimator` if phase has breathPattern, play start chime if enabled
- Timer counts down. Progress bar fills. Breath ring animates if active.
- At phase end: play end chime if enabled, auto-advance to next phase after 2s pause, animate transition with `fadeUp`
- At practice complete: show completion screen — brief affirming message, total time taken, option to "Return to home" or "Begin again"
- Pause/resume: pause timer and breath animator together. Play `start` chime on resume.
- Chime toggle: enables/disables chime engine. Persists to `localStorage` key `fourfold-chime`. Requires first user gesture — the toggle click itself satisfies this.
- "Skip step" button (`.btn--ghost .btn--sm`): advances to next step within phase without ending timer
- Keyboard: `Space` to pause/resume, `ArrowRight` to skip step, `Escape` to confirm exit

#### About view (`/about`)
- Simple content page rendering the Scientific Foundations section from `PRACTICE.science`
- Three cards (`.card--flat`), one per framework (polyvagal, HRV, interoception), each with title and body text
- References section at bottom, rendered as a `<ol>` from `PRACTICE.references`
- Back link to home

### Module wiring

```js
// In main.js init:
import { PRACTICE } from './data.js'
import { router } from './router.js'
import { chimeEngine } from './chime.js'
import { PracticeTimer } from './timer.js'
import { BreathAnimator } from './breath.js'
import * as ui from './ui.js'

// Restore chime preference
const savedChime = localStorage.getItem('fourfold-chime')
if (savedChime === 'true') {
  state.chimeEnabled = true
  // Note: AudioContext still needs user gesture — enable on first interaction
}
```

---

## Task 12 — HTML shell

**File:** `index.html`

The single HTML file that bootstraps the app.

### Requirements

- `<!DOCTYPE html>`, `lang="en"`, UTF-8 charset, viewport meta
- Title: `The Fourfold Resting`
- Google Fonts preconnect + stylesheet link for Inter (300, 400, 500) and Lora (400, 400 italic, 500)
- All CSS files linked in order: reset → tokens → typography → layout → components → animations
- A `<header>` with `.site-nav` inside `.container`:
  - Logo: `<a href="#/" class="nav-logo">The Fourfold Resting</a>`
  - Nav links: Home (`#/`), About (`#/about`) — `aria-current="page"` managed by router
- `<main id="app">` — the router renders all views into this element
- `<footer>` with a `.container`: copyright line and a short tagline
- A visually-hidden `<div id="aria-announcer" aria-live="polite" aria-atomic="true">` for screen reader announcements
- `<script type="module" src="js/main.js">` — single script tag at end of body
- No inline styles. No other script tags.

---

## Task 13 — About page

**File:** `about.html`

A standalone fallback page for users who navigate directly to `/about.html`. Shares the same header, footer, CSS, and nav as `index.html`. Renders the Scientific Foundations content statically (no JS required to read it). Includes a `<link rel="canonical" href="index.html#/about">`.

Content: the three science sections as `.card--flat` elements, the references list, and a "← Back to practice" link.

---

## Task 14 — Favicon

**File:** `assets/favicon.svg`

Create a minimal SVG favicon. A simple circle (stroke only, no fill) with a smaller circle inside — suggesting the breath ring motif. Use `currentColor` for stroke. Size: `viewBox="0 0 32 32"`. Outer circle: cx 16, cy 16, r 13, stroke-width 1.5. Inner circle: cx 16, cy 16, r 6, stroke-width 1. Link from `index.html` as `<link rel="icon" type="image/svg+xml" href="assets/favicon.svg">`.

---

## Task 15 — Accessibility and polish pass

Apply across all files. Do not create new files — amend existing ones.

### Accessibility
- All interactive elements have visible `:focus-visible` outlines (2px solid accent, offset 2px)
- All icon-only buttons have `aria-label`
- Phase transitions announced via `ui.announce()`
- Timer announces remaining time at 60s, 30s, 10s via `announce()` — not every tick
- Breath cue text (`'Breathe in'`, `'Breathe out'`) announced on each phase change
- Colour contrast: verify all text/background combinations meet WCAG AA (4.5:1 for body, 3:1 for large text) — adjust token values if needed
- `<main>` has `tabindex="-1"` and receives focus on route change
- All cards with `role="region"` have `aria-labelledby`

### Polish
- Add a subtle entrance animation to the home view hero on first load (`fade-up` staggered across heading, subtitle, cards)
- Smooth cross-fade between views (outgoing view fades out, incoming fades up — 200ms each)
- The progress track segments should be separated by 2px gaps, giving a segmented look — one segment per phase
- The breath ring's inner circle should have `will-change: transform` to promote to GPU layer
- On practice complete, the progress bar should animate to 100% with a brief flash of accent colour before settling
- Ensure no layout shift occurs when the timer display updates (use `font-variant-numeric: tabular-nums`)

---

## Completion checklist

Before marking the project done, verify:

- [ ] All four phases render correctly in both brief and full modes
- [ ] Timer counts down accurately and does not drift over a 5-minute session
- [ ] Chime fires on phase start and end when enabled — never on page load
- [ ] Chime toggle persists across page refresh via localStorage
- [ ] Breath ring animates during Settling phase only, in correct 4:1:8 or 4:8 rhythm
- [ ] Pause/resume works cleanly with no timer drift on resume
- [ ] Practice complete screen appears after phase IV ends
- [ ] Dark mode renders correctly in both macOS/iOS system dark mode
- [ ] `prefers-reduced-motion` disables all animations cleanly
- [ ] No console errors on load, during practice, or on completion
- [ ] All focus states visible at 200% zoom
- [ ] Screen reader can navigate all interactive elements with keyboard only
- [ ] `about.html` renders without JavaScript enabled
- [ ] Favicon displays in browser tab
