import { useEffect, useState } from 'react'
import { HeartIcon } from './Ambience'

export default function Hero() {
  const [started, setStarted] = useState(false)

  useEffect(() => {
    // A tiny delay so fonts/layout settle before the sequence begins.
    const t = setTimeout(() => setStarted(true), 300)
    return () => clearTimeout(t)
  }, [])

  return (
    <header className={`hero${started ? ' is-entered' : ''}`}>
      <div className="hero__stage" />
      <div className="hero__heart-glow" />

      <div className="hero__content">
        <p className="hero__pre">Before you read this...</p>
        <p className="hero__line hero__line--1">
          There&rsquo;s something I should have said a long time ago.
        </p>
        <div className="hero__sorry-wrap">
          <h1 className="hero__sorry">I&rsquo;m sorry.</h1>
        </div>
        <p className="hero__sub">
          I don&rsquo;t expect these words to change the past.
          <br />
          I just hope they help you understand what&rsquo;s been on my mind.
        </p>
      </div>

      <p className="hero__scroll">
        <HeartIcon />
        Scroll when you&rsquo;re ready.
      </p>
    </header>
  )
}
