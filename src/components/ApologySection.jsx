import Reveal from './Reveal'
import { siteConfig } from '../data/siteConfig'

export default function ApologySection() {
  return (
    <section className="section apology" data-chapter="1" id="apology">
      <div className="container">
        <Reveal variant="swing">
          <div className="rule" aria-hidden="true" />
          <p className="kicker">Chapter 01</p>
        </Reveal>
        <Reveal delay={1} variant="pop">
          <h2 className="section-title apology__title shimmer">I owe you an apology.</h2>
        </Reveal>

        <div className="body-text">
          {siteConfig.apologyParagraphs.map((paragraph, i) => (
            <Reveal key={i} delay={i === 0 ? 2 : 0} as="p" variant={i % 2 === 0 ? 'fade' : 'swing'}>
              {paragraph}
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
