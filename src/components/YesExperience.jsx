import useContent from '../hooks/useContent'

// Full-screen ending revealed after "Yes. Let's try again."
export default function YesExperience({ open }) {
  const content = useContent()

  return (
    <div
      className={`ending${open ? ' is-open' : ''}`}
      aria-hidden={!open}
      role="dialog"
      aria-modal="true"
      aria-label="A new beginning"
    >
      {content.yesLines.map((line, i) => (
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
        {content.herName} × {content.myName}
        <span>{content.today}</span>
      </p>
    </div>
  )
}
