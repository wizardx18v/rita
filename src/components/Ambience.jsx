import { useMemo } from 'react'

// A fixed full-screen layer of floating hearts, twinkling sparkles and
// drifting glow orbs. Purely decorative — pointer-events are disabled.
export default function Ambience() {
  const hearts = useMemo(
    () =>
      Array.from({ length: 14 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        size: 10 + Math.random() * 22,
        duration: 14 + Math.random() * 16,
        delay: -Math.random() * 22,
        opacity: 0.25 + Math.random() * 0.35,
      })),
    []
  )

  const sparkles = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: 3 + Math.random() * 5,
        duration: 2 + Math.random() * 3,
        delay: -Math.random() * 4,
      })),
    []
  )

  const orbs = useMemo(
    () =>
      Array.from({ length: 3 }, (_, i) => ({
        id: i,
        left: [8, 70, 45][i],
        top: [20, 65, 40][i],
        size: [340, 280, 220][i],
        duration: [16, 22, 19][i],
        delay: -[i * 5],
      })),
    []
  )

  return (
    <div className="ambience" aria-hidden="true">
      {hearts.map((h) => (
        <span
          key={h.id}
          className="heart-float"
          style={{
            left: `${h.left}%`,
            width: `${h.size}px`,
            height: `${h.size}px`,
            opacity: h.opacity,
            animationDuration: `${h.duration}s`,
            animationDelay: `${h.delay}s`,
          }}
        >
          <HeartIcon />
        </span>
      ))}

      {sparkles.map((s) => (
        <span
          key={s.id}
          className="sparkle"
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            animationDuration: `${s.duration}s`,
            animationDelay: `${s.delay}s`,
          }}
        />
      ))}

      {orbs.map((o) => (
        <span
          key={o.id}
          className="orb"
          style={{
            left: `${o.left}%`,
            top: `${o.top}%`,
            width: `${o.size}px`,
            height: `${o.size}px`,
            animationDuration: `${o.duration}s`,
            animationDelay: `${o.delay}s`,
          }}
        />
      ))}
    </div>
  )
}

export function HeartIcon({ size = 16, className }) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} aria-hidden="true" className={className}>
      <path d="M16 29S5 22.8 5 14.9C5 11.4 7.7 9 10.9 9c2 0 3.9 1 5.1 2.6C17.2 10 19.1 9 21.1 9 24.3 9 27 11.4 27 14.9c0 7.9-11 14.1-11 14.1z" />
    </svg>
  )
}
