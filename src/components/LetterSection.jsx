import Reveal from './Reveal'
import { siteConfig } from '../data/siteConfig'

export default function LetterSection() {
  return (
    <section className="section letter-section" data-chapter="6" id="letter">
      <div className="container letter">
        <Reveal>
          <div className="rule" aria-hidden="true" />
          <p className="kicker">Chapter 06</p>
        </Reveal>
        <Reveal delay={1}>
          <h2 className="section-title">A letter I should have written sooner.</h2>
        </Reveal>

        <Reveal delay={2}>
          <div className="letter__paper">
            <p className="letter__salutation">{siteConfig.herName},</p>
            <div className="letter__body">
              {siteConfig.letterParagraphs.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
            <p className="letter__sign">— {siteConfig.myName}</p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
