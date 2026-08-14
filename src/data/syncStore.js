// Cross-device sync via Firebase Realtime Database (REST API, no SDK).
// The admin page just needs the database URL (e.g. https://proj-default-rtdb.firebaseio.com).
// Data lives under /rita/content.json — read + write with open rules (test mode).
// Last write wins; every device polls and applies newer content automatically.

const SYNC_KEY = 'rita:sync:v1'

export function getSyncInfo() {
  try {
    const raw = localStorage.getItem(SYNC_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function saveSyncInfo(info) {
  if (info) localStorage.setItem(SYNC_KEY, JSON.stringify(info))
  else localStorage.removeItem(SYNC_KEY)
}

function normalizeDbUrl(url) {
  if (!url) return ''
  const u = url.trim().replace(/\/+$/, '')
  if (!/^https?:\/\//.test(u)) return ''
  return u
}

async function fetchJson(url, options) {
  const res = await fetch(url, options)
  if (!res.ok) throw new Error('HTTP ' + res.status)
  if (res.status === 204) return null
  return res.json()
}

// Checks the connection and whether data already exists on the server.
export async function testSync(dbUrl) {
  const u = normalizeDbUrl(dbUrl)
  if (!u) return { ok: false, error: 'Enter a valid Firebase database URL' }
  try {
    const data = await fetchJson(`${u}/rita/content.json?t=${Date.now()}`)
    return { ok: true, exists: !!data && !!data.content }
  } catch (e) {
    return { ok: false, error: (e && e.message) || 'Could not connect' }
  }
}

// Pushes the full content to the server. Returns the timestamp or null on failure.
export async function syncPush(content) {
  const info = getSyncInfo()
  if (!info || !info.dbUrl) return null
  try {
    const u = normalizeDbUrl(info.dbUrl)
    const updatedAt = Date.now()
    await fetchJson(`${u}/rita/content.json`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ updatedAt, content }),
    })
    saveSyncInfo({ ...info, dbUrl: u, lastPushedAt: updatedAt })
    return updatedAt
  } catch {
    return null
  }
}

// Pulls newer content from the server and applies it locally when it changed.
export async function syncPull() {
  const info = getSyncInfo()
  if (!info || !info.dbUrl) return null
  try {
    const u = normalizeDbUrl(info.dbUrl)
    const data = await fetchJson(`${u}/rita/content.json?t=${Date.now()}`)
    if (!data || typeof data.content !== 'object' || data.content === null) return null
    const t = typeof data.updatedAt === 'number' ? data.updatedAt : 0
    if (t > (info.lastPushedAt || 0) && t > (info.lastPulledAt || 0)) {
      localStorage.setItem('rita:content:v1', JSON.stringify(data.content))
      saveSyncInfo({ ...info, dbUrl: u, lastPulledAt: t })
      window.dispatchEvent(new CustomEvent('rita:content-changed'))
      return t
    }
    return null
  } catch {
    return null
  }
}

// Polls for remote changes while the tab is visible. Returns a stop function.
export function startSync(interval = 25000) {
  let timer = null
  const tick = () => {
    if (document.visibilityState === 'hidden') return
    syncPull()
  }
  timer = setInterval(tick, interval)
  document.addEventListener('visibilitychange', tick)
  tick()
  return () => {
    clearInterval(timer)
    document.removeEventListener('visibilitychange', tick)
  }
}
