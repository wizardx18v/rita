import { useEffect, useState } from 'react'
import Reveal from './Reveal'
import { FlameIcon } from './Ambience'
import useContent from '../hooks/useContent'

// Converts a Spotify share URL into an official embed URL.
function spotifyEmbedUrl(url) {
  if (!url) return ''
  const trimmed = url.trim()
  if (!/^https?:\/\//.test(trimmed)) return ''

  const match = trimmed.match(/open\.spotify\.com\/(track|album|playlist|artist)\/([\w]+)/)
  if (!match) return ''

  const [, kind, id] = match
  return `https://open.spotify.com/embed/${kind}/${id}`
}

// True once the visitor has clicked anywhere — browsers then allow autoplay.
function usePageInteracted() {
  const [interacted, setInteracted] = useState(false)

  useEffect(() => {
    const mark = () => setInteracted(true)
    window.addEventListener('pointerdown', mark, { once: true })
    window.addEventListener('keydown', mark, { once: true })
    return () => {
      window.removeEventListener('pointerdown', mark)
      window.removeEventListener('keydown', mark)
    }
  }, [])

  return interacted
}

export default function MusicSection() {
  const content = useContent()
  const interacted = usePageInteracted()
  const [playing, setPlaying] = useState(false)

  const embedUrl = spotifyEmbedUrl(content.spotifyUrl)
  const ready = embedUrl && (interacted || playing)

  useEffect(() => {
    if (embedUrl && interacted) setPlaying(true)
  }, [embedUrl, interacted])

  return (
    <section className="section section--glass" data-chapter="4" id="music">
      <div className="container">
        <Reveal>
          <div className="rule" aria-hidden="true" />
          <p className="kicker">Chapter 04</p>
        </Reveal>
        <Reveal delay={1}>
          <h2 className="section-title fire-text">{content.musicTitle}</h2>
        </Reveal>

        <div className="body-text" style={{ marginTop: '2rem' }}>
          {content.musicParagraphs.map((paragraph, i) => (
            <Reveal key={i} as="p">
              {paragraph}
            </Reveal>
          ))}
        </div>

        {embedUrl ? (
          <Reveal delay={1}>
            <div className="music-stage">
              <div className="music-frame glass sheen">
                <div className="music-frame__head">
                  <span className="music-frame__vinyl" aria-hidden="true" />
                  <div>
                    <p className="music-frame__title">Fire on Fire</p>
                    <p className="music-frame__sub">Sam Smith — our song</p>
                  </div>
                </div>

                {ready ? (
                  <iframe
                    src={`${embedUrl}?utm_source=generator&theme=0&autoplay=1`}
                    width="100%"
                    height="380"
                    frameBorder="0"
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    loading="eager"
                    title="Fire on Fire by Sam Smith"
                  />
                ) : (
                  <button
                    type="button"
                    className="btn btn--primary music-cta"
                    onClick={() => setPlaying(true)}
                  >
                    <FlameIcon />
                    Press play
                  </button>
                )}
              </div>
            </div>
          </Reveal>
        ) : (
          <Reveal delay={1}>
            <div className="music-placeholder">
              <strong>No song set yet</strong>
              Open the admin page (#/admin) and paste a Spotify link, or set{' '}
              <code>spotifyUrl</code> in <code>src/data/siteConfig.js</code>.
            </div>
          </Reveal>
        )}

        {!ready && embedUrl && (
          <Reveal delay={2}>
            <p className="music-note" style={{ marginTop: '1.2rem', maxWidth: '34rem', color: 'var(--muted)', fontSize: '0.875rem', lineHeight: 1.9 }}>
              Spotify lets you stream a preview without an account — the full song
              plays if you&rsquo;re signed in.
            </p>
          </Reveal>
        )}
      </div>
    </section>
  )
}
