import Reveal from './Reveal'
import { HeartIcon } from './Ambience'
import { siteConfig } from '../data/siteConfig'

function MemoryPhoto({ photo, alt, title }) {
  if (!photo) {
    return (
      <div className="memory__media" aria-hidden="true">
        <div className="memory__placeholder">
          <HeartIcon size={34} />
          <span>a memory</span>
        </div>
      </div>
    )
  }

  return (
    <figure className="memory__media">
      <img src={photo} alt={alt || `Memory: ${title}`} loading="lazy" decoding="async" />
    </figure>
  )
}

export default function MemoryTimeline() {
  return (
    <section className="section memories" data-chapter="3" id="memories">
      <div className="container">
        <Reveal variant="swing">
          <div className="rule" aria-hidden="true" />
          <p className="kicker">Chapter 03</p>
        </Reveal>
        <Reveal delay={1} variant="pop">
          <h2 className="section-title shimmer">The things I still remember.</h2>
        </Reveal>

        {siteConfig.memories.map((memory, i) => (
          <Reveal
            key={i}
            variant={i % 2 === 0 ? 'fade' : 'swing'}
            className={`memory${memory.wide ? ' memory--wide' : ''}${i % 2 === 1 ? ' memory--right' : ''}`}
          >
            <div className="memory__body">
              <p className="memory__meta">{memory.date}</p>
              <h3 className="memory__title">{memory.title}</h3>
              <p className="memory__text">{memory.text}</p>
            </div>
            <MemoryPhoto photo={memory.photo} alt={memory.title} title={memory.title} />
          </Reveal>
        ))}
      </div>
    </section>
  )
}
