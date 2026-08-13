import { useEffect, useRef, useState } from 'react'
import Reveal from './Reveal'
import { siteConfig } from '../data/siteConfig'

// A single line that appears when scrolled into view.
function ReflectionLine({ text, index }) {
  const { ref, inView } = useLineInView()

  return (
    <p
      ref={ref}
      className={`reflection__line reveal${inView ? ' is-inview' : ''}${index > 3 ? ' reveal-delay-1' : ''}`}
    >
      {text}
    </p>
  )
}

function useLineInView() {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setInView(true)
      return
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.disconnect()
        }
      },
      { threshold: 0.3 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return { ref, inView }
}

export default function ReflectionSection() {
  return (
    <section className="section reflection" data-chapter="5" id="reflection">
      <div className="container">
        <Reveal>
          <p className="kicker">Chapter 05</p>
        </Reveal>
        <Reveal delay={1}>
          <h2 className="section-title" style={{ fontStyle: 'italic', marginTop: '1.4rem' }}>
            {siteConfig.reflectionIntro}
          </h2>
        </Reveal>
        <div style={{ marginTop: '2rem' }}>
          {siteConfig.reflectionLines.map((line, i) => (
            <ReflectionLine key={i} text={line} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
