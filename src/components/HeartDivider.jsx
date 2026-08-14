// Animated fire-gradient wave divider.
// `flip` mirrors the wave vertically for alternate section boundaries.
export default function HeartDivider({ flip = false }) {
  return (
    <div className="divider" aria-hidden="true" style={flip ? { transform: 'rotate(180deg)' } : undefined}>
      <svg viewBox="0 0 1440 60" preserveAspectRatio="none">
        <defs>
          <linearGradient id="dividerGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ff4d6d" stopOpacity="0.5" />
            <stop offset="50%" stopColor="#ff8c42" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#ff4d6d" stopOpacity="0.5" />
          </linearGradient>
        </defs>
        <path d="M0 30 C 180 55, 360 5, 540 22 S 900 62, 1080 30 1440 8, 1440 8 L 1440 60 L 0 60 Z" />
      </svg>
    </div>
  )
}
