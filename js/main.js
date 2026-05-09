import { PRACTICE } from './data.js'
import { router } from './router.js'
import { chimeEngine } from './chime.js'
import { PracticeTimer } from './timer.js'
import { BreathAnimator } from './breath.js'
import * as ui from './ui.js'

// ─── Application state ────────────────────────────────────────────────────────

const state = {
  mode: 'full',
  currentPhaseIndex: 0,
  currentStepIndex: 0,
  timerState: 'idle',
  chimeEnabled: false,
  practiceComplete: false,
  activeView: 'home'
}

// ─── Session variables ────────────────────────────────────────────────────────

let activeTimer = null
let activeBreath = null
let _cleanupFn = null
let _phaseAdvanceTimeout = null
let _announcedMilestones = new Set()

function registerCleanup(fn) { _cleanupFn = fn }
function runCleanup() {
  if (_cleanupFn) { _cleanupFn(); _cleanupFn = null }
}

function switchView(renderFn) {
  if (!app.innerHTML.trim()) {
    renderFn()
    window.scrollTo(0, 0)
    app.focus({ preventScroll: true })
    return
  }
  app.style.transition = 'opacity var(--duration-short) var(--ease-default)'
  app.style.opacity = '0'
  let fired = false
  const done = () => {
    if (fired) return
    fired = true
    app.style.transition = ''
    app.style.opacity = ''
    renderFn()
    window.scrollTo(0, 0)
    app.focus({ preventScroll: true })
  }
  app.addEventListener('transitionend', done, { once: true })
  setTimeout(done, 250)
}

// ─── Session helpers ──────────────────────────────────────────────────────────

function getActivePhases() {
  return state.mode === 'brief'
    ? PRACTICE.phases.filter(p => p.durationBrief !== null)
    : PRACTICE.phases
}

function getPhaseDuration(phase) {
  return state.mode === 'brief' ? phase.durationBrief : phase.durationFull
}

function getBreathPattern(phase) {
  if (!phase.breathPattern) return null
  if (state.mode === 'brief' && phase.breathPatternBrief) return phase.breathPatternBrief
  return phase.breathPattern
}

// ─── Nav ──────────────────────────────────────────────────────────────────────

function updateNav(path) {
  document.querySelectorAll('.nav-links a').forEach(link => {
    const linkPath = (link.getAttribute('href') || '').replace('#', '') || '/'
    if (linkPath === path) {
      link.setAttribute('aria-current', 'page')
    } else {
      link.removeAttribute('aria-current')
    }
  })
}

// ─── Chime toggle helpers ─────────────────────────────────────────────────────

function chimeToggleHTML(id) {
  return `
    <label class="chime-toggle" for="${id}">
      <input type="checkbox" id="${id}"${state.chimeEnabled ? ' checked' : ''}>
      <span class="chime-toggle__dot" aria-hidden="true"></span>
      Chime
    </label>`
}

function wireChimeToggle(id) {
  const el = document.getElementById(id)
  if (!el) return
  // If the checkbox was pre-checked from localStorage, activate the engine now.
  // This call happens inside a user-gesture-triggered view render, so
  // AudioContext creation is permitted by browser autoplay policy.
  if (el.checked) chimeEngine.enable()
  el.addEventListener('change', () => {
    state.chimeEnabled = el.checked
    localStorage.setItem('fourfold-chime', String(state.chimeEnabled))
    if (state.chimeEnabled) {
      chimeEngine.enable()
    } else {
      chimeEngine.disable()
    }
  })
}

// ─── App root ─────────────────────────────────────────────────────────────────

const app = document.getElementById('app')

// ─── Practice: ready screen ───────────────────────────────────────────────────

function showPractice() {
  runCleanup()
  state.activeView = 'practice'
  updateNav('/')

  const modeData = PRACTICE.modes.find(m => m.id === state.mode)
  const phases = getActivePhases()
  const phaseList = phases.map(p => p.title).join(', ')

  ui.setTitle(modeData.title)

  app.innerHTML = `
    <div class="section">
      <div class="container container--narrow">
        <div class="stack fade-up" style="--stack-gap:2rem">

          <div class="stack" style="--stack-gap:1rem">
            <div class="stack" style="--stack-gap:0.5rem">
              <h2>${modeData.title}</h2>
              <p class="caption">${modeData.duration} · ${phaseList}</p>
            </div>
            <div style="display:flex;gap:0.5rem;flex-wrap:wrap">
              ${PRACTICE.modes.map(m => `
                <button class="btn btn--sm${m.id === state.mode ? ' btn--primary' : ' btn--ghost'}"
                        data-mode-select="${m.id}">${m.title}</button>
              `).join('')}
            </div>
          </div>

          <p style="max-width:none">${modeData.description}</p>

          <div class="stack" style="--stack-gap:0.5rem">
            ${chimeToggleHTML('ready-chime')}
            <p class="caption" style="max-width:none">
              Chime sounds mark the start and end of each phase.
              Enable before you begin — your first interaction activates audio.
            </p>
          </div>

          <div>
            <button class="btn btn--primary" id="btn-start">Begin practice</button>
          </div>

        </div>
      </div>
    </div>
  `

  wireChimeToggle('ready-chime')
  document.getElementById('btn-start').addEventListener('click', () => switchView(beginSession))
  app.querySelectorAll('[data-mode-select]').forEach(btn => {
    btn.addEventListener('click', () => {
      state.mode = btn.dataset.modeSelect
      showPractice()
    })
  })
}

// ─── Practice: active session shell ──────────────────────────────────────────

function beginSession() {
  app.innerHTML = `
    <div style="min-height:calc(100vh - 56px);display:flex;flex-direction:column">

      <div style="border-bottom:1px solid var(--color-border);padding:0.75rem 0">
        <div class="container" style="max-width:960px">
          <div style="display:flex;align-items:center;gap:1rem;flex-wrap:wrap">
            <span class="phase-badge" id="phase-badge"></span>
            <div class="timer-display timer-display--sm" id="timer-display"
                 aria-live="off" aria-label="Time remaining"></div>
            <div style="margin-left:auto;display:flex;align-items:center;gap:1rem">
              ${chimeToggleHTML('practice-chime')}
              <button class="btn btn--ghost btn--sm" id="btn-pause"
                      aria-label="Pause practice">Pause</button>
            </div>
          </div>
        </div>
      </div>

      <div style="flex:1;overflow-y:auto">
        <div class="section">
          <div class="container container--narrow">
            <div class="stack" style="--stack-gap:1.5rem" id="phase-content">

              <div class="stack" style="--stack-gap:0.25rem">
                <span class="label" id="phase-number"></span>
                <h2 id="phase-title"></h2>
                <p class="caption" id="phase-subtitle"></p>
              </div>

              <div id="breath-ring-container" hidden
                   style="display:flex;flex-direction:column;align-items:center;gap:0.75rem">
                <div class="breath-ring">
                  <div class="breath-ring__inner" aria-hidden="true"></div>
                  <button class="breath-ring__btn" id="btn-ring-toggle"
                          aria-label="Resume practice" data-paused="">
                    <svg class="ring-icon ring-icon--play" viewBox="0 0 24 24" fill="currentColor"
                         width="22" height="22" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>
                    <svg class="ring-icon ring-icon--pause" viewBox="0 0 24 24" fill="currentColor"
                         width="22" height="22" aria-hidden="true"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
                  </button>
                </div>
                <p data-cue class="label" aria-hidden="true"
                   style="min-height:1.2em;text-align:center"></p>
              </div>

              <div id="steps-container" role="list"></div>

              <div style="display:flex;gap:0.5rem;flex-wrap:wrap">
                <button class="btn btn--ghost btn--sm" id="btn-prev-step"
                        aria-label="Previous step">← Prev step</button>
                <button class="btn btn--ghost btn--sm" id="btn-skip"
                        aria-label="Next step">Next step →</button>
                <button class="btn btn--ghost btn--sm" id="btn-science-toggle"
                        aria-expanded="false" aria-controls="science-panel">
                  The science
                </button>
              </div>

              <div id="science-panel" hidden>
                <p class="science-note" id="science-text"></p>
              </div>

            </div>
          </div>
        </div>
      </div>

      <div style="border-top:1px solid var(--color-border);padding:1rem 0">
        <div class="container" style="max-width:960px">
          <div class="stack" style="--stack-gap:0.75rem">
            <div id="progress-segments" style="display:flex;gap:2px"></div>
            <div style="display:flex;align-items:center;justify-content:space-between">
              <button class="btn btn--ghost btn--sm" id="btn-prev"
                      aria-label="Previous phase">← Prev</button>
              <div id="phase-dots" style="display:flex;gap:0.5rem"></div>
              <button class="btn btn--ghost btn--sm" id="btn-next"
                      aria-label="Next phase">Next →</button>
            </div>
          </div>
        </div>
      </div>

    </div>
  `

  wireChimeToggle('practice-chime')
  document.getElementById('btn-pause').addEventListener('click', togglePause)
  document.getElementById('btn-ring-toggle').addEventListener('click', togglePause)
  document.getElementById('btn-prev-step').addEventListener('click', prevStep)
  document.getElementById('btn-skip').addEventListener('click', skipStep)
  document.getElementById('btn-prev').addEventListener('click', () => navigatePhase(-1))
  document.getElementById('btn-next').addEventListener('click', () => navigatePhase(1))
  document.getElementById('btn-science-toggle').addEventListener('click', e => {
    ui.toggleDisclosure(e.currentTarget)
  })

  window.addEventListener('keydown', onKeyDown)
  registerCleanup(() => {
    window.removeEventListener('keydown', onKeyDown)
    destroyActiveSession()
  })

  startPhase(state.currentPhaseIndex)
}

// ─── Phase lifecycle ──────────────────────────────────────────────────────────

function startPhase(index) {
  destroyActiveSession()
  _announcedMilestones = new Set()

  const phases = getActivePhases()
  const phase = phases[index]
  state.currentPhaseIndex = index
  state.currentStepIndex = 0

  // Phase identity
  document.getElementById('phase-badge').textContent =
    `Phase ${phase.number} · ${phase.title}`
  document.getElementById('phase-number').textContent = `Phase ${phase.number}`
  document.getElementById('phase-title').textContent = phase.title
  document.getElementById('phase-subtitle').textContent = phase.subtitle
  document.getElementById('science-text').textContent = phase.science

  // Collapse science panel on each new phase
  const sciToggle = document.getElementById('btn-science-toggle')
  const sciPanel = document.getElementById('science-panel')
  if (sciToggle) sciToggle.setAttribute('aria-expanded', 'false')
  if (sciPanel) sciPanel.hidden = true

  // Steps
  const stepsEl = document.getElementById('steps-container')
  if (stepsEl) {
    ui.renderSteps(stepsEl, phase.steps, 0, goToStep)
    updateStepButtons()
  }

  // Breath ring — visible only when a breath pattern is active
  const breathContainer = document.getElementById('breath-ring-container')
  const breathPattern = getBreathPattern(phase)
  if (breathContainer) breathContainer.hidden = !breathPattern

  if (breathPattern) {
    activeBreath = new BreathAnimator({
      container: breathContainer,
      pattern: breathPattern,
      onPhaseChange: breathPhase => {
        const cues = { in: 'Breathe in', hold: 'Hold', out: 'Breathe out' }
        if (cues[breathPhase]) ui.announce(cues[breathPhase])
      },
      onCycleComplete: () => {}
    })
    activeBreath.start()
  }

  // Phase dots
  const dotsEl = document.getElementById('phase-dots')
  if (dotsEl) ui.renderPhaseDots(dotsEl, phases, index, navigateToPhase)

  // Progress segments DOM (built once per phase; widths updated on each tick)
  buildProgressSegmentsDom()
  updateProgressSegments(0)

  // Timer
  const duration = getPhaseDuration(phase)
  const timerDisplay = document.getElementById('timer-display')
  if (timerDisplay) timerDisplay.textContent = ui.formatTime(duration)

  activeTimer = new PracticeTimer({
    duration,
    onTick: (remaining, _elapsed, progress) => {
      const el = document.getElementById('timer-display')
      if (el) el.textContent = ui.formatTime(remaining)
      updateProgressSegments(progress)
      ;[60, 30, 10].forEach(m => {
        if (remaining <= m && !_announcedMilestones.has(m)) {
          _announcedMilestones.add(m)
          ui.announce(`${m} seconds remaining`)
        }
      })
    },
    onComplete: () => {
      state.timerState = 'complete'
      if (state.chimeEnabled) chimeEngine.play('end', phase.chimeFrequency)
      const fill = document.querySelector(`[data-phase-fill="${index}"]`)
      if (fill) {
        fill.classList.add('progress-fill--flash')
        fill.addEventListener('animationend', () => fill.classList.remove('progress-fill--flash'), { once: true })
      }
      _phaseAdvanceTimeout = setTimeout(() => {
        _phaseAdvanceTimeout = null
        const current = getActivePhases()
        if (state.currentPhaseIndex < current.length - 1) {
          startPhase(state.currentPhaseIndex + 1)
        } else {
          switchView(completePractice)
        }
      }, 2000)
    },
    onPause: () => {
      state.timerState = 'paused'
      const btn = document.getElementById('btn-pause')
      if (btn) { btn.textContent = 'Resume'; btn.setAttribute('aria-label', 'Resume practice') }
      syncRingButton()
    },
    onResume: () => {
      state.timerState = 'running'
      const btn = document.getElementById('btn-pause')
      if (btn) { btn.textContent = 'Pause'; btn.setAttribute('aria-label', 'Pause practice') }
      syncRingButton()
    }
  })

  activeTimer.start()
  activeTimer.pause()
  if (activeBreath) activeBreath.pause()

  if (state.chimeEnabled) chimeEngine.play('start', phase.chimeFrequency)
  ui.announce(`Phase ${phase.number}: ${phase.title}`)

  // Animate the content area in on each phase transition
  const content = document.getElementById('phase-content')
  if (content) ui.animateIn(content)
}

function destroyActiveSession() {
  if (_phaseAdvanceTimeout) { clearTimeout(_phaseAdvanceTimeout); _phaseAdvanceTimeout = null }
  if (activeTimer) { activeTimer.destroy(); activeTimer = null }
  if (activeBreath) { activeBreath.destroy(); activeBreath = null }
  state.timerState = 'idle'
}

function syncRingButton() {
  const btn = document.getElementById('btn-ring-toggle')
  if (!btn) return
  if (state.timerState === 'running') {
    btn.removeAttribute('data-paused')
    btn.setAttribute('aria-label', 'Pause practice')
  } else {
    btn.setAttribute('data-paused', '')
    btn.setAttribute('aria-label', 'Resume practice')
  }
}

function togglePause() {
  if (!activeTimer) return
  if (state.timerState === 'running') {
    activeTimer.pause()
    if (activeBreath) activeBreath.pause()
  } else if (state.timerState === 'paused') {
    activeTimer.resume()
    if (activeBreath) activeBreath.resume()
    if (state.chimeEnabled) {
      chimeEngine.play('start', getActivePhases()[state.currentPhaseIndex].chimeFrequency)
    }
  }
}

function goToStep(index) {
  const phase = getActivePhases()[state.currentPhaseIndex]
  if (index < 0 || index >= phase.steps.length) return
  state.currentStepIndex = index
  const el = document.getElementById('steps-container')
  if (el) ui.renderSteps(el, phase.steps, index, goToStep)
  updateStepButtons()
}

function prevStep() { goToStep(state.currentStepIndex - 1) }
function skipStep()  { goToStep(state.currentStepIndex + 1) }

function updateStepButtons() {
  const phase = getActivePhases()[state.currentPhaseIndex]
  const prevBtn = document.getElementById('btn-prev-step')
  const nextBtn = document.getElementById('btn-skip')
  if (prevBtn) prevBtn.disabled = state.currentStepIndex === 0
  if (nextBtn) nextBtn.disabled = state.currentStepIndex >= phase.steps.length - 1
}

function navigatePhase(delta) {
  const phases = getActivePhases()
  const next = state.currentPhaseIndex + delta
  if (next >= 0 && next < phases.length) navigateToPhase(next)
}

function navigateToPhase(index) {
  const phases = getActivePhases()
  if (index < 0 || index >= phases.length) return
  startPhase(index)
}

// ─── Progress bar ─────────────────────────────────────────────────────────────

function buildProgressSegmentsDom() {
  const container = document.getElementById('progress-segments')
  if (!container) return
  container.innerHTML = ''
  getActivePhases().forEach((phase, i) => {
    const track = document.createElement('div')
    track.className = 'progress-track'
    track.style.flex = String(getPhaseDuration(phase))

    const fill = document.createElement('div')
    fill.className = 'progress-fill'
    fill.dataset.phaseFill = String(i)
    fill.style.transition = 'none'
    fill.style.width = '0%'

    track.appendChild(fill)
    container.appendChild(track)
  })
}

function updateProgressSegments(currentPhaseProgress) {
  getActivePhases().forEach((_phase, i) => {
    const fill = document.querySelector(`[data-phase-fill="${i}"]`)
    if (!fill) return
    if (i < state.currentPhaseIndex) {
      fill.style.transition = 'none'
      fill.style.width = '100%'
    } else if (i === state.currentPhaseIndex) {
      fill.style.transition = ''
      fill.style.width = `${currentPhaseProgress * 100}%`
    } else {
      fill.style.transition = 'none'
      fill.style.width = '0%'
    }
  })
}

// ─── Practice: completion screen ──────────────────────────────────────────────

function completePractice() {
  state.practiceComplete = true
  destroyActiveSession()
  window.removeEventListener('keydown', onKeyDown)

  const modeData = PRACTICE.modes.find(m => m.id === state.mode)
  const phases = getActivePhases()

  if (state.chimeEnabled) {
    chimeEngine.play('complete', phases.at(-1).chimeFrequency)
  }

  ui.announce('Practice complete')
  ui.setTitle('Practice complete')

  app.innerHTML = `
    <div class="section">
      <div class="container container--narrow">
        <div class="stack fade-up" style="--stack-gap:2rem">

          <div class="stack" style="--stack-gap:0.5rem">
            <span class="label">Complete</span>
            <h2>Well done.</h2>
            <p class="caption">${modeData.title} · ${modeData.duration}</p>
          </div>

          <p style="max-width:none">
            You have moved through ${phases.map(p => p.title).join(', ')}.
            Take a moment before re-entering full activity — the benefit of the
            practice extends into the minutes that follow.
          </p>

          <div style="display:flex;gap:0.75rem;flex-wrap:wrap">
            <a href="#/" class="btn btn--primary">New practice</a>
            <button class="btn btn--ghost" id="btn-again">Begin again</button>
          </div>

        </div>
      </div>
    </div>
  `

  document.getElementById('btn-again').addEventListener('click', () => {
    state.currentPhaseIndex = 0
    state.currentStepIndex = 0
    state.practiceComplete = false
    router.navigate('/practice')
  })
}

// ─── About view ───────────────────────────────────────────────────────────────

function showAbout() {
  runCleanup()
  state.activeView = 'about'
  updateNav('/about')
  ui.setTitle('About')

  const { science, references } = PRACTICE

  app.innerHTML = `
    <div class="section">
      <div class="container">
        <div class="stack fade-up" style="--stack-gap:2.5rem">

          <div class="stack" style="--stack-gap:0.5rem">
            <a href="#/" class="caption">← Back to practice</a>
            <h2>Scientific foundations</h2>
            <p class="caption">The research underpinning the Fourfold Resting.</p>
          </div>

          <div class="grid-2">
            ${Object.values(science).map(entry => {
              const labelId = 'sci-' + entry.title.toLowerCase().replace(/\s+/g, '-')
              return `
                <div class="card card--flat stack" style="--stack-gap:0.75rem"
                     role="region" aria-labelledby="${labelId}">
                  <h4 id="${labelId}">${entry.title}</h4>
                  <p class="caption" style="max-width:none">${entry.body}</p>
                </div>`
            }).join('')}
          </div>

          <div class="stack" style="--stack-gap:1rem">
            <h3>References</h3>
            <ol style="padding-left:1.25rem;list-style:decimal"
                class="stack" style="--stack-gap:0.5rem">
              ${references.map(ref => `<li class="caption">${ref}</li>`).join('')}
            </ol>
          </div>

        </div>
      </div>
    </div>
  `
}

// ─── Keyboard shortcuts ───────────────────────────────────────────────────────

function onKeyDown(e) {
  if (state.activeView !== 'practice') return
  if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)) return

  switch (e.key) {
    case ' ':
      e.preventDefault()
      togglePause()
      break
    case 'ArrowLeft':
      e.preventDefault()
      prevStep()
      break
    case 'ArrowRight':
      e.preventDefault()
      skipStep()
      break
    case 'Escape':
      if (window.confirm('End practice and return to home?')) {
        router.navigate('/')
      }
      break
  }
}

// ─── Init ─────────────────────────────────────────────────────────────────────

function init() {
  const savedChime = localStorage.getItem('fourfold-chime')
  if (savedChime === 'true') state.chimeEnabled = true

  router.register('/', () => switchView(showPractice))
  router.register('/practice', () => switchView(showPractice))
  router.register('/about', () => switchView(showAbout))
  router.start()
}

init()
