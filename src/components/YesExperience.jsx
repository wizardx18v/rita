import { siteConfig } from '../data/siteConfig'

// Full-screen ending revealed after "Yes. Let's try again."
// Quiet, slow, film-like. No confetti, no hearts.
export default function YesExperience({ open }) {
  return (
    <div
      className={`ending${open ? ' is-open' : ''}`}
      aria-hidden={!open}
      role="dialog"
      aria-modal="true"
      aria-label="A new beginning"
    >
      {siteConfig.yesLines.map((line, i) => (
        <p key={i} className="ending__line">
          {line.includes('\n') ? (
            <span className="multi">
              {line.split('\n').map((part, j) => (
                <span key={j} className="multi__part">
                  {part}
                </span>
              ))}
            </span>
          ) : (
            line
          )}
        </p>
      ))}

      <p className="ending__names">
        {siteConfig.herName} × {siteConfig.myName}
        <span>{siteConfig.today}</span>
      </p>
    </div>
  )
}
