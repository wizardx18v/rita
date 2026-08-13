import Reveal from './Reveal'
import { siteConfig } from '../data/siteConfig'

export default function Epilogue() {
  return (
    <section className="section epilogue" data-chapter="8" id="epilogue">
      <div className="container" style={{ maxWidth: '44rem' }}>
        {siteConfig.finalLines.map((line, i) => (
          <Reveal key={i} delay={i % 2}>
            <p className="epilogue__line">{line}</p>
          </Reveal>
        ))}
        <Reveal delay={3}>
          <p className="epilogue__sign">— {siteConfig.myName}</p>
        </Reveal>
      </div>
    </section>
  )
}
