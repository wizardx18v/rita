import { siteConfig } from './siteConfig'

const STORAGE_KEY = 'rita:content:v1'

// Deep-merges admin overrides on top of the default config.
// Arrays are replaced wholesale when overridden.
function deepMerge(base, override) {
  if (!override || typeof override !== 'object') return base
  const out = { ...base }
  for (const key of Object.keys(override)) {
    const b = base[key]
    const o = override[key]
    if (Array.isArray(b) && Array.isArray(o)) out[key] = o
    else if (b && typeof b === 'object' && o && typeof o === 'object')
      out[key] = deepMerge(b, o)
    else out[key] = o
  }
  return out
}

export function getOverrides() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

export function loadContent() {
  return deepMerge(siteConfig, getOverrides())
}

export function saveOverrides(overrides) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides))
  window.dispatchEvent(new CustomEvent('rita:content-changed'))
}

export function resetOverrides() {
  localStorage.removeItem(STORAGE_KEY)
  window.dispatchEvent(new CustomEvent('rita:content-changed'))
}

// ---------- first user gesture tracking (enables music autoplay) ----------
let interacted = false

export function markInteracted() {
  interacted = true
  window.removeEventListener('pointerdown', markInteracted)
  window.removeEventListener('keydown', markInteracted)
}

export function hasInteracted() {
  return interacted
}

export function armInteractionListener() {
  window.addEventListener('pointerdown', markInteracted)
  window.addEventListener('keydown', markInteracted)
}
