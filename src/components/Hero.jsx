import { HeartIcon } from './Ambience'

export default function Hero() {
  return (
    <header className="hero" data-chapter="0">
      <div className="hero__content">
        <p className="hero__pre">Before you read this...</p>

        <p className="hero__line hero__line--1">
          There&rsquo;s something I should have said a long time ago.
        </p>

        <div className="hero__sorry-wrap">
          <span className="hero__flame" aria-hidden="true" />
          <h1 className="hero__sorry">I&rsquo;m sorry.</h1>
        </div>

        <p className="hero__line hero__line--2">Not for wanting you.</p>

        <p className="hero__sub">
          I don&rsquo;t expect these words to change the past.
          <br />
          I just hope they help you understand what&rsquo;s been on my mind.
        </p>
      </div>

      <p className="hero__scroll">
        Scroll when you&rsquo;re ready.
        <HeartIcon />
      </p>
    </header>
  )
}
