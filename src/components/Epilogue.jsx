import Reveal from './Reveal'
import useContent from '../hooks/useContent'

export default function Epilogue() {
  const content = useContent()

  return (
    <section className="section epilogue" data-chapter="8" id="epilogue">
      <div className="container" style={{ maxWidth: '44rem' }}>
        {content.finalLines.map((line, i) => (
          <Reveal key={i} delay={i % 2}>
            <p className="epilogue__line">{line}</p>
          </Reveal>
        ))}
        <Reveal delay={3}>
          <p className="epilogue__sign">— {content.myName}</p>
        </Reveal>
      </div>
    </section>
  )
}
