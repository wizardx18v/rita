import { useEffect, useRef, useState } from 'react'
import '../styles/admin.css'
import { loadContent, saveAndSync, resetAndSync } from '../data/contentStore'
import { getSyncInfo, saveSyncInfo, testSync, syncPull } from '../data/syncStore'

const UNLOCK_KEY = 'rita:admin:unlocked'

// Downscales an uploaded image to max 1200px and returns a JPEG data URL.
function downscaleImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = () => reject(new Error('Could not read file'))
    reader.onload = () => {
      const img = new Image()
      img.onerror = () => reject(new Error('Could not decode image'))
      img.onload = () => {
        const max = 1200
        const scale = Math.min(1, max / Math.max(img.width, img.height))
        const canvas = document.createElement('canvas')
        canvas.width = Math.round(img.width * scale)
        canvas.height = Math.round(img.height * scale)
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        resolve(canvas.toDataURL('image/jpeg', 0.85))
      }
      img.src = reader.result
    }
    reader.readAsDataURL(file)
  })
}

function joinLines(lines) {
  return Array.isArray(lines) ? lines.join('\n') : ''
}

function splitLines(text) {
  return text
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
}

function splitParagraphs(text) {
  return text
    .split(/\n\s*\n+/)
    .map((p) => p.replace(/\s*\n\s*/g, ' ').trim())
    .filter(Boolean)
}

export default function AdminPage() {
  const [unlocked, setUnlocked] = useState(() => sessionStorage.getItem(UNLOCK_KEY) === '1')
  const [passwordInput, setPasswordInput] = useState('')
  const [error, setError] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [draft, setDraft] = useState(null)
  const [toast, setToast] = useState('')
  const [syncUrl, setSyncUrl] = useState(() => getSyncInfo()?.dbUrl || '')
  const [syncStatus, setSyncStatus] = useState(() => (getSyncInfo()?.dbUrl ? 'connected' : 'off'))
  const importRef = useRef(null)
  const toastTimer = useRef(null)

  // Draft is (re)built from the latest stored content on unlock.
  useEffect(() => {
    if (unlocked) setDraft(loadContent())
  }, [unlocked])

  const showToast = (msg) => {
    setToast(msg)
    clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToast(''), 2600)
  }

  const handleUnlock = (e) => {
    e.preventDefault()
    const current = loadContent()
    if (passwordInput === current.adminPassword) {
      sessionStorage.setItem(UNLOCK_KEY, '1')
      setUnlocked(true)
      setError('')
    } else {
      setError('Wrong password.')
    }
  }

  const handleSave = async () => {
    if (!draft) return
    const next = { ...draft }
    if (newPassword.trim()) next.adminPassword = newPassword.trim()
    const pushed = await saveAndSync(next)
    setNewPassword('')
    showToast(pushed ? 'Saved — synced to every device' : 'Saved on this device only')
  }

  const handleReset = async () => {
    if (!window.confirm('Reset everything back to the original content? This cannot be undone.')) return
    const pushed = await resetAndSync()
    setDraft(loadContent())
    showToast(pushed ? 'Reset on every device' : 'Reset on this device only')
  }

  const handleConnectSync = async () => {
    setSyncStatus('testing')
    const result = await testSync(syncUrl)
    if (result.ok) {
      saveSyncInfo({ dbUrl: syncUrl.trim().replace(/\/+$/, ''), lastPushedAt: 0, lastPulledAt: 0 })
      setSyncStatus('connected')
      showToast('Connected — changes will sync to every device')
      await syncPull()
    } else {
      setSyncStatus('off')
      showToast(result.error || 'Could not connect')
    }
  }

  const handleDisconnectSync = () => {
    saveSyncInfo(null)
    setSyncStatus('off')
    showToast('Sync disconnected')
  }

  const handleExport = () => {
    if (!draft) return
    const blob = new Blob([JSON.stringify(draft, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'rita-content.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImportFile = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const text = await file.text()
      const parsed = JSON.parse(text)
      if (!parsed || typeof parsed !== 'object') throw new Error('not an object')
      const merged = { ...loadContent(), ...parsed }
      setDraft(merged)
      const pushed = await saveAndSync(merged)
      showToast(pushed ? 'Imported and synced' : 'Imported (not synced)')
    } catch {
      showToast('Import failed — invalid JSON')
    }
    e.target.value = ''
  }

  const addMemory = () =>
    setDraft((d) => ({
      ...d,
      memories: [...d.memories, { date: '', title: '', text: '', photo: '', wide: false }],
    }))

  const removeMemory = (i) =>
    setDraft((d) => ({ ...d, memories: d.memories.filter((_, idx) => idx !== i) }))

  const moveMemory = (i, dir) =>
    setDraft((d) => {
      const list = [...d.memories]
      const j = i + dir
      if (j < 0 || j >= list.length) return d
      ;[list[i], list[j]] = [list[j], list[i]]
      return { ...d, memories: list }
    })

  const patchMemory = (i, patch) =>
    setDraft((d) => ({
      ...d,
      memories: d.memories.map((m, idx) => (idx === i ? { ...m, ...patch } : m)),
    }))

  const uploadMemoryPhoto = async (i, file) => {
    if (!file) return
    try {
      const dataUrl = await downscaleImage(file)
      patchMemory(i, { photo: dataUrl })
      showToast('Photo added')
    } catch {
      showToast('Could not read that image')
    }
  }

  if (!unlocked || !draft) {
    return (
      <>
        <div className="admin__gate">
          <form className="glass admin__gate-card" onSubmit={handleUnlock}>
            <svg className="admin__lock" viewBox="0 0 32 32" aria-hidden="true">
              <path d="M16 3a7 7 0 0 0-7 7v4H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2V16a2 2 0 0 0-2-2h-2v-4a7 7 0 0 0-7-7zm-5 11v-4a5 5 0 0 1 10 0v4zm2 6a3 3 0 1 1 4 2.8V24h2v3h-8v-3h2v-1.2a3 3 0 0 1 0-5.8z" />
            </svg>
            <h1>Site editor</h1>
            <p>This page lets you change every word and every picture on the site.</p>
            <input
              className="admin__field"
              type="password"
              autoComplete="current-password"
              placeholder="Password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              style={{ padding: '0.8rem 1rem', borderRadius: 12 }}
            />
            {error && <p className="admin__gate-error">{error}</p>}
            <button type="submit" className="btn btn--primary">
              Unlock
            </button>
          </form>
        </div>
      </>
    )
  }

  const set = (key, value) => setDraft((d) => ({ ...d, [key]: value }))

  return (
    <div className="admin">
      <header className="admin__top">
        <h1 className="admin__title">
          Site editor
          <span>Change every word and picture here</span>
        </h1>
        <div className="admin__actions">
          <a className="btn btn--ghost" href="#/" style={{ padding: '0.6rem 1.4rem' }}>
            View site
          </a>
          <button
            className="admin__small-btn"
            type="button"
            onClick={() => {
              sessionStorage.removeItem(UNLOCK_KEY)
              setUnlocked(false)
            }}
          >
            Lock
          </button>
        </div>
      </header>

      {/* ---- names & date ---- */}
      <section className="admin__panel">
        <h3>
          Names &amp; date<small>Shown on the ending screen and the letter</small>
        </h3>
        <div className="admin__grid admin__grid--2">
          <div className="admin__field">
            <label htmlFor="herName">Her name</label>
            <input id="herName" value={draft.herName} onChange={(e) => set('herName', e.target.value)} />
          </div>
          <div className="admin__field">
            <label htmlFor="myName">Your name</label>
            <input id="myName" value={draft.myName} onChange={(e) => set('myName', e.target.value)} />
          </div>
          <div className="admin__field">
            <label htmlFor="today">Date shown at the end</label>
            <input id="today" value={draft.today} onChange={(e) => set('today', e.target.value)} />
          </div>
        </div>
      </section>

      {/* ---- music ---- */}
      <section className="admin__panel">
        <h3>
          The song<small>Paste a Spotify share link — the real player appears on the site</small>
        </h3>
        <div className="admin__grid">
          <div className="admin__field">
            <label htmlFor="spotifyUrl">Spotify link</label>
            <input
              id="spotifyUrl"
              placeholder="https://open.spotify.com/track/..."
              value={draft.spotifyUrl}
              onChange={(e) => set('spotifyUrl', e.target.value)}
            />
            <p className="admin__hint">
              Works with open.spotify.com links to a track, album, playlist or artist.
              Default is &ldquo;Fire on Fire&rdquo; by Sam Smith.
            </p>
          </div>
          <div className="admin__field">
            <label htmlFor="musicTitle">Heading</label>
            <input id="musicTitle" value={draft.musicTitle} onChange={(e) => set('musicTitle', e.target.value)} />
          </div>
          <div className="admin__field">
            <label htmlFor="musicParagraphs">Text (one paragraph per blank line)</label>
            <textarea
              id="musicParagraphs"
              value={draft.musicParagraphs.join('\n\n')}
              onChange={(e) => set('musicParagraphs', splitParagraphs(e.target.value))}
            />
          </div>
        </div>
      </section>

      {/* ---- memories ---- */}
      <section className="admin__panel">
        <h3>
          Memories<small>Photos are stored on the device — upload, reorder, remove</small>
        </h3>
        {draft.memories.map((m, i) => (
          <div key={i} className="admin__memory">
            <div className="admin__memory-head">
              <strong>Memory {i + 1}</strong>
              <div className="admin__actions">
                <button className="admin__small-btn" type="button" onClick={() => moveMemory(i, -1)}>
                  ↑
                </button>
                <button className="admin__small-btn" type="button" onClick={() => moveMemory(i, 1)}>
                  ↓
                </button>
                <button className="admin__small-btn admin__small-btn--danger" type="button" onClick={() => removeMemory(i)}>
                  Remove
                </button>
              </div>
            </div>

            <div className="admin__grid admin__grid--2">
              <div className="admin__field">
                <label>Date</label>
                <input value={m.date} onChange={(e) => patchMemory(i, { date: e.target.value })} />
              </div>
              <div className="admin__field">
                <label>Title</label>
                <input value={m.title} onChange={(e) => patchMemory(i, { title: e.target.value })} />
              </div>
            </div>

            <div className="admin__field">
              <label>Text</label>
              <textarea value={m.text} onChange={(e) => patchMemory(i, { text: e.target.value })} />
            </div>

            <div className="admin__field">
              <label>Photo</label>
              <input type="file" accept="image/*" onChange={(e) => uploadMemoryPhoto(i, e.target.files?.[0])} />
              {m.photo && (
                <>
                  <div className="admin__photo-preview">
                    <img src={m.photo} alt="Memory preview" />
                  </div>
                  <button className="admin__small-btn admin__small-btn--danger" type="button" onClick={() => patchMemory(i, { photo: '' })}>
                    Remove photo
                  </button>
                </>
              )}
            </div>

            <label className="admin__checkbox">
              <input
                type="checkbox"
                checked={!!m.wide}
                onChange={(e) => patchMemory(i, { wide: e.target.checked })}
              />
              Wide layout (photo on top)
            </label>
          </div>
        ))}

        <button className="admin__small-btn" type="button" onClick={addMemory} style={{ marginTop: '1.2rem' }}>
          + Add memory
        </button>
      </section>

      {/* ---- apology / accountability / reflection ---- */}
      <section className="admin__panel">
        <h3>
          The apology &amp; accountability<small>Separate paragraphs with an empty line, one accountable item per line</small>
        </h3>
        <div className="admin__grid">
          <div className="admin__field">
            <label htmlFor="apologyParagraphs">Apology paragraphs</label>
            <textarea
              id="apologyParagraphs"
              value={draft.apologyParagraphs.join('\n\n')}
              onChange={(e) => set('apologyParagraphs', splitParagraphs(e.target.value))}
            />
          </div>
          <div className="admin__field">
            <label htmlFor="accountability">What I should have done differently</label>
            <textarea
              id="accountability"
              value={draft.accountability.join('\n')}
              onChange={(e) => set('accountability', splitLines(e.target.value))}
            />
          </div>
          <div className="admin__field">
            <label htmlFor="reflectionIntro">Reflection intro line</label>
            <input id="reflectionIntro" value={draft.reflectionIntro} onChange={(e) => set('reflectionIntro', e.target.value)} />
          </div>
          <div className="admin__field">
            <label htmlFor="reflectionLines">Reflection lines (one per line)</label>
            <textarea
              id="reflectionLines"
              value={draft.reflectionLines.join('\n')}
              onChange={(e) => set('reflectionLines', splitLines(e.target.value))}
            />
          </div>
        </div>
      </section>

      {/* ---- letter ---- */}
      <section className="admin__panel">
        <h3>
          The letter<small>Separate paragraphs with an empty line</small>
        </h3>
        <div className="admin__grid">
          <div className="admin__field">
            <label htmlFor="letterParagraphs">Letter paragraphs</label>
            <textarea
              id="letterParagraphs"
              value={draft.letterParagraphs.join('\n\n')}
              onChange={(e) => set('letterParagraphs', splitParagraphs(e.target.value))}
            />
          </div>
        </div>
      </section>

      {/* ---- final question & ending ---- */}
      <section className="admin__panel">
        <h3>
          The question &amp; ending<small>One item per line</small>
        </h3>
        <div className="admin__grid">
          <div className="admin__field">
            <label htmlFor="finalMessage">Message above the question</label>
            <textarea id="finalMessage" value={draft.finalMessage} onChange={(e) => set('finalMessage', e.target.value)} />
          </div>
          <div className="admin__field">
            <label htmlFor="yesLines">What appears after &ldquo;Yes&rdquo; (one per line)</label>
            <textarea
              id="yesLines"
              value={draft.yesLines.join('\n')}
              onChange={(e) => set('yesLines', splitLines(e.target.value))}
            />
          </div>
          <div className="admin__field">
            <label htmlFor="finalLines">Final screen lines (one per line)</label>
            <textarea
              id="finalLines"
              value={draft.finalLines.join('\n')}
              onChange={(e) => set('finalLines', splitLines(e.target.value))}
            />
          </div>
        </div>
      </section>

      {/* ---- sync ---- */}
      <section className="admin__panel">
        <h3>
          Sync — make changes appear on every phone &amp; PC
          <small>
            Status:{' '}
            {syncStatus === 'connected' && <b style={{ color: 'var(--fire-c)' }}>connected</b>}
            {syncStatus === 'testing' && 'testing…'}
            {syncStatus === 'off' && 'off — changes stay on this device only'}
          </small>
        </h3>
        <div className="admin__grid admin__grid--2">
          <div className="admin__field">
            <label htmlFor="syncUrl">Firebase database URL</label>
            <input
              id="syncUrl"
              placeholder="https://my-project-default-rtdb.firebaseio.com"
              value={syncUrl}
              onChange={(e) => setSyncUrl(e.target.value)}
            />
            <p className="admin__hint">
              1. Go to console.firebase.google.com → create a free project → Realtime Database →
              Create database. 2. Choose <b>test mode</b> (or use the rules shown below). 3. Copy
              the database URL here and press Connect. 4. Enter the same URL on your other
              devices&rsquo; admin pages. Everything stays in sync automatically.
            </p>
            <p className="admin__hint" style={{ marginTop: '0.6rem' }}>
              Permanent rules (Database → Rules):
              <br />
              <code>
                {`{ "rules": { "rita": { ".read": true, ".write": true } } }`}
              </code>
            </p>
          </div>
        </div>
        <div className="admin__actions" style={{ marginTop: '1.2rem' }}>
          {syncStatus !== 'connected' ? (
            <button className="btn btn--ghost" type="button" onClick={handleConnectSync} style={{ padding: '0.6rem 1.4rem' }}>
              Connect
            </button>
          ) : (
            <>
              <button className="btn btn--primary" type="button" onClick={async () => { await syncPull(); showToast('Checked for changes from other devices') }} style={{ padding: '0.6rem 1.4rem' }}>
                Pull latest now
              </button>
              <button className="admin__small-btn admin__small-btn--danger" type="button" onClick={handleDisconnectSync}>
                Disconnect
              </button>
            </>
          )}
        </div>
      </section>

      {/* ---- security & data ---- */}
      <section className="admin__panel">
        <h3>
          Security &amp; data<small>Change the admin password, or back up / restore all content</small>
        </h3>
        <div className="admin__grid admin__grid--2">
          <div className="admin__field">
            <label htmlFor="newPassword">New password (leave empty to keep the current one)</label>
            <input
              id="newPassword"
              type="password"
              autoComplete="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
        </div>
        <div className="admin__actions" style={{ marginTop: '1.2rem' }}>
          <button className="admin__small-btn" type="button" onClick={handleExport}>
            Export content (JSON)
          </button>
          <button className="admin__small-btn" type="button" onClick={() => importRef.current?.click()}>
            Import content (JSON)
          </button>
          <button className="admin__small-btn admin__small-btn--danger" type="button" onClick={handleReset}>
            Reset to defaults
          </button>
          <input ref={importRef} type="file" accept="application/json" hidden onChange={handleImportFile} />
        </div>
        <p className="admin__hint" style={{ marginTop: '1rem' }}>
          Content lives in this browser and, if sync is connected, on your Firebase database — so
          every phone and PC sees the same thing. Use export/import as a backup, or edit{' '}
          <code>src/data/siteConfig.js</code> to make changes permanent in the code itself.
        </p>
      </section>

      <div className="admin__savebar">
        <button className="btn btn--primary" type="button" onClick={handleSave} style={{ padding: '0.75rem 1.8rem' }}>
          Save changes
        </button>
      </div>

      {toast && <p className="admin__toast">{toast}</p>}
    </div>
  )
}
