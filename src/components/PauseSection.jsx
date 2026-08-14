import Reveal from './Reveal'

export default function PauseSection() {
  return (
    <section className="section pause" data-chapter="7" id="pause">
      <Reveal variant="swing">
        <p>I don&rsquo;t know what you&rsquo;re going to feel after reading this.</p>
      </Reveal>
      <Reveal delay={1} variant="swing">
        <p>And that&rsquo;s okay.</p>
      </Reveal>
      <Reveal delay={2} variant="fade">
        <p className="muted">You don&rsquo;t owe me an answer.</p>
      </Reveal>
    </section>
  )
}
