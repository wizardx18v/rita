import Reveal from './Reveal'
import useContent from '../hooks/useContent'

export default function LetterSection() {
  const content = useContent()

  return (
    <section className="section letter-section" data-chapter="6" id="letter">
      <div className="container letter">
        <Reveal>
          <div className="rule" aria-hidden="true" />
          <p className="kicker">Chapter 06</p>
        </Reveal>
        <Reveal delay={1}>
          <h2 className="section-title fire-text">A letter I should have written sooner.</h2>
        </Reveal>

        <Reveal delay={2}>
          <div className="letter__paper sheen">
            <p className="letter__salutation">{content.herName},</p>
            <div className="letter__body">
              {content.letterParagraphs.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
            <p className="letter__sign">— {content.myName}</p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
