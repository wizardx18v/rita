import { useEffect, useRef, useState } from 'react'
import Reveal from './Reveal'
import { siteConfig } from '../data/siteConfig'

function AccountableLine({ index, text }) {
  const { ref, inView } = useInViewItem()

  return (
    <li
      ref={ref}
      className={`acc-item reveal--pop${inView ? ' is-inview' : ''}`}
    >
      <span className="acc-item__num">{String(index + 1).padStart(2, '0')}</span>
      <p className="acc-item__text">{text}</p>
    </li>
  )
}

// Each line pops in independently as it scrolls into view.
function useInViewItem() {
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
      { threshold: 0.35 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return { ref, inView }
}

export default function AccountabilitySection() {
  return (
    <section className="section section--alt" data-chapter="2" id="accountability">
      <div className="container">
        <Reveal variant="swing">
          <div className="rule" aria-hidden="true" />
          <p className="kicker">Chapter 02</p>
        </Reveal>
        <Reveal delay={1} variant="pop">
          <h2 className="section-title">What I should have done differently.</h2>
        </Reveal>

        <ul className="acc-list">
          {siteConfig.accountability.map((text, i) => (
            <AccountableLine key={i} index={i} text={text} />
          ))}
        </ul>
      </div>
    </section>
  )
}
