import { useEffect, useMemo, useState } from 'react'

// Deterministic pseudo-random generator so ambient particles don't reshuffle
// on every render — and stay stable across sessions for the same seed.
function seededRandom(seed) {
  let s = seed
  return () => {
    s = (s * 1103515245 + 12345) % 2147483648
    return s / 2147483648
  }
}

// Full-screen atmosphere: aurora blobs, rising embers, floating hearts,
// twinkling sparkles and a soft light that follows the cursor.
// Purely decorative — pointer-events are disabled.
export default function Ambience() {
  const [cursor, setCursor] = useState(null)

  const rand = useMemo(() => seededRandom(20260813), [])
  const rand2 = useMemo(() => seededRandom(731992), [])
  const rand3 = useMemo(() => seededRandom(4711), [])

  const embers = useMemo(
    () =>
      Array.from({ length: 18 }, (_, i) => ({
        id: i,
        left: rand() * 100,
        size: 3 + rand() * 6,
        duration: 11 + rand() * 16,
        delay: -rand() * 26,
      })),
    [rand]
  )

  const hearts = useMemo(
    () =>
      Array.from({ length: 11 }, (_, i) => ({
        id: i,
        left: rand2() * 100,
        size: 11 + rand2() * 20,
        duration: 16 + rand2() * 16,
        delay: -rand2() * 30,
        opacity: 0.3 + rand2() * 0.4,
      })),
    [rand2]
  )

  const sparkles = useMemo(
    () =>
      Array.from({ length: 15 }, (_, i) => ({
        id: i,
        left: rand3() * 100,
        top: rand3() * 100,
        size: 3 + rand3() * 4,
        duration: 2.2 + rand3() * 3,
        delay: -rand3() * 4,
      })),
    [rand3]
  )

  useEffect(() => {
    let raf = 0
    let target = null
    let current = null

    const loop = () => {
      raf = 0
      if (!target) return
      if (!current) current = { ...target }
      current.x += (target.x - current.x) * 0.12
      current.y += (target.y - current.y) * 0.12
      setCursor({ ...current })
      if (Math.abs(target.x - current.x) > 0.5 || Math.abs(target.y - current.y) > 0.5) {
        raf = requestAnimationFrame(loop)
      }
    }

    const onMove = (e) => {
      target = { x: e.clientX, y: e.clientY }
      if (!raf) raf = requestAnimationFrame(loop)
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    return () => {
      window.removeEventListener('pointermove', onMove)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <>
      <div className="stage" aria-hidden="true">
        <span className="aurora aurora--a" />
        <span className="aurora aurora--b" />
        <span className="aurora aurora--c" />
        <span className="aurora aurora--d" />

        <div className="particles">
          {embers.map((e) => (
            <span
              key={e.id}
              className="ember"
              style={{
                left: `${e.left}%`,
                width: `${e.size}px`,
                height: `${e.size}px`,
                animationDuration: `${e.duration}s`,
                animationDelay: `${e.delay}s`,
              }}
            />
          ))}

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
        </div>
      </div>

      {cursor && <div className="cursor-glow" style={{ left: cursor.x, top: cursor.y }} />}
    </>
  )
}

export function HeartIcon({ size = 16, className }) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} aria-hidden="true" className={className}>
      <path d="M16 29S5 22.8 5 14.9C5 11.4 7.7 9 10.9 9c2 0 3.9 1 5.1 2.6C17.2 10 19.1 9 21.1 9 24.3 9 27 11.4 27 14.9c0 7.9-11 14.1-11 14.1z" />
    </svg>
  )
}

export function FlameIcon({ size = 16, className }) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} aria-hidden="true" className={className}>
      <path d="M16 2c1 5-4 8-4 13a4 4 0 0 0 8 0c0-1.5-.5-2.7-1.2-3.9C20.6 12.8 24 15.6 24 21a8 8 0 1 1-16 0c0-7.4 4.8-13.3 8-19z" />
    </svg>
  )
}
