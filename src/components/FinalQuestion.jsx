import { useRef, useState } from 'react'
import Reveal from './Reveal'
import { HeartIcon } from './Ambience'
import useContent from '../hooks/useContent'

const DODGE_ATTEMPTS = 6

// Picks a random viewport position away from the central "Yes" area.
function randomDodgePosition() {
  const pad = 70
  const vw = window.innerWidth
  const vh = window.innerHeight
  const avoid = {
    left: vw * 0.22,
    right: vw * 0.78,
    top: vh * 0.22,
    bottom: vh * 0.78,
  }

  for (let i = 0; i < 24; i++) {
    const left = pad + Math.random() * Math.max(vw - pad * 2, 1)
    const top = pad + Math.random() * Math.max(vh - pad * 2, 1)
    const inAvoid = left > avoid.left && left < avoid.right && top > avoid.top && top < avoid.bottom
    if (!inAvoid) return { left, top }
  }
  return { left: vw - 130, top: 120 }
}

export default function FinalQuestion({ onYes, onNeedTime }) {
  const content = useContent()
  const yesRef = useRef(null)
  const [noState, setNoState] = useState({ attempts: 0, pos: null, gone: false })
  const [tilt, setTilt] = useState(null)
  const [ripples, setRipples] = useState([])

  const reducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const dodge = () => {
    setNoState((s) => {
      if (s.gone) return s
      const attempts = s.attempts + 1
      if (attempts >= DODGE_ATTEMPTS) {
        return { attempts, pos: s.pos, gone: true }
      }
      return { attempts, pos: randomDodgePosition(), gone: false }
    })
  }

  const handlePointerEnterNo = () => {
    if (noState.gone) return
    dodge()
  }

  const handlePointerDownNo = (e) => {
    e.preventDefault()
    if (noState.gone) return
    dodge()
  }

  // Keyboard users keep a real escape hatch — Enter still works.
  const handleKeyDownNo = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onNeedTime()
    }
  }

  const handleYesTilt = (e) => {
    if (reducedMotion || !yesRef.current) return
    const rect = yesRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    setTilt({ rx: -y * 14, ry: x * 18 })
  }

  const handleYesLeave = () => setTilt(null)

  const handleYesClick = (e) => {
    const rect = yesRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const id = Date.now()
    setRipples((r) => [...r, { id, x, y }])
    setTimeout(() => setRipples((r) => r.filter((rp) => rp.id !== id)), 750)
    onYes()
  }

  const noStyle = noState.pos
    ? {
        left: noState.pos.left,
        top: noState.pos.top,
        transform: `translate(-50%, -50%) rotate(${(noState.attempts % 2 === 0 ? -1 : 1) * noState.attempts * 5}deg) scale(${Math.max(0.15, 1 - noState.attempts * 0.16)})`,
        opacity: Math.max(0.15, 1 - noState.attempts * 0.14),
      }
    : null

  return (
    <section className="section final" data-chapter="8" id="final">
      <Reveal variant="swing">
        <p className="final__lead">But there is one thing I still want to ask.</p>
      </Reveal>

      <Reveal delay={1} variant="pop">
        <h2 className="display final__ask">
          Would you give us
          <span className="serif-accent">another chance?</span>
        </h2>
      </Reveal>

      <Reveal delay={2}>
        <p className="final__sub">{content.finalMessage}</p>
      </Reveal>

      <Reveal delay={3} variant="pop">
        <p className="final__question fire-text">Would you be my girlfriend again?</p>
      </Reveal>

      <Reveal delay={4}>
        <div className="final__actions">
          <span className="btn-tilt">
            <button
              ref={yesRef}
              className="btn btn--primary"
              type="button"
              onClick={handleYesClick}
              onMouseMove={handleYesTilt}
              onMouseLeave={handleYesLeave}
              style={tilt ? { transform: `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) scale(1.05)` } : undefined}
            >
              <HeartIcon className="btn__heart" />
              Yes. Let&rsquo;s try again.
              {ripples.map((rp) => (
                <span key={rp.id} className="ripple" style={{ left: rp.x, top: rp.y }} />
              ))}
            </button>
          </span>

          {!noState.gone && (
            <button
              className="btn btn--ghost btn--dodge"
              type="button"
              style={noStyle}
              onPointerEnter={handlePointerEnterNo}
              onPointerDown={handlePointerDownNo}
              onKeyDown={handleKeyDownNo}
              onClick={(e) => {
                if (!noState.pos) onNeedTime()
              }}
            >
              <HeartIcon className="btn__heart" />
              I need some time.
            </button>
          )}
        </div>

        {noState.gone && (
          <p className="no-note">
            The button ran away... but if you really need time, just tell me.
          </p>
        )}
      </Reveal>
    </section>
  )
}
