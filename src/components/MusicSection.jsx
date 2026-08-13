import Reveal from './Reveal'
import { siteConfig } from '../data/siteConfig'

// Converts a Spotify share URL into an official embed URL.
// Accepts https://open.spotify.com/track/... , /album/..., /playlist/..., /artist/...
// also shortened https://spotify.link/... (resolved client-side is not possible,
// so shortened links are left to the visitor to replace with a full link).
function spotifyEmbedUrl(url) {
  if (!url) return ''
  const trimmed = url.trim()
  if (!/^https?:\/\//.test(trimmed)) return ''

  const match = trimmed.match(/open\.spotify\.com\/(track|album|playlist|artist)\/([\w]+)/)
  if (!match) return ''

  const [, kind, id] = match
  const params = new URLSearchParams({
    utm_source: 'generator',
    theme: '0',
  })
  return `https://open.spotify.com/embed/${kind}/${id}?${params.toString()}`
}

export default function MusicSection() {
  const embedUrl = spotifyEmbedUrl(siteConfig.spotifyUrl)

  return (
    <section className="section section--alt" data-chapter="4" id="music">
      <div className="container">
        <Reveal>
          <div className="rule" aria-hidden="true" />
          <p className="kicker">Chapter 04</p>
        </Reveal>
        <Reveal delay={1}>
          <h2 className="section-title">{siteConfig.musicTitle}</h2>
        </Reveal>

        <div className="body-text" style={{ marginTop: '2rem' }}>
          {siteConfig.musicParagraphs.map((paragraph, i) => (
            <Reveal key={i} as="p">
              {paragraph}
            </Reveal>
          ))}
        </div>

        {embedUrl ? (
          <Reveal delay={1}>
            <div className="music-frame">
              <iframe
                src={embedUrl}
                width="100%"
                height="380"
                frameBorder="0"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                title="A song I still associate with you"
              />
            </div>
          </Reveal>
        ) : (
          <Reveal delay={1}>
            <div className="music-placeholder">
              <strong>No song set yet</strong>
              Paste a Spotify share link into <code>spotifyUrl</code> in{' '}
              <code>src/data/siteConfig.js</code> and this space will hold it.
            </div>
          </Reveal>
        )}

        {siteConfig.spotifyNote && embedUrl && (
          <Reveal delay={2}>
            <p className="music-note" style={{ marginTop: '2rem', maxWidth: '34rem', color: 'var(--muted)', fontSize: '0.9375rem', lineHeight: 1.9 }}>
              {siteConfig.spotifyNote}
            </p>
          </Reveal>
        )}
      </div>
    </section>
  )
}
