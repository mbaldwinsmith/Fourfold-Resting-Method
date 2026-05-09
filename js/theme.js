const STORAGE_KEY = 'fourfold-theme'

const SUN = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`

const MOON = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`

function getTheme() {
  return localStorage.getItem(STORAGE_KEY) ||
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
}

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme
}

function syncButton() {
  const btn = document.getElementById('theme-toggle')
  if (!btn) return
  const dark = document.documentElement.dataset.theme === 'dark'
  btn.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode')
  btn.innerHTML = dark ? SUN : MOON
}

function toggle() {
  const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'
  localStorage.setItem(STORAGE_KEY, next)
  applyTheme(next)
  syncButton()
}

// Module scripts are deferred — DOM is ready when this runs
applyTheme(getTheme())
syncButton()

const _btn = document.getElementById('theme-toggle')
if (_btn) _btn.addEventListener('click', toggle)
