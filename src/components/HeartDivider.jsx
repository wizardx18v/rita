import { HeartIcon } from './Ambience'

// A scalloped wave divider with a heart sitting on the crest.
// `flip` mirrors the wave vertically for alternate section boundaries.
export default function HeartDivider({ flip = false }) {
  return (
    <div className={`divider divider--wave${flip ? ' divider--wave-top' : ''}`} aria-hidden="true" style={flip ? { transform: 'rotate(180deg)' } : undefined}>
      <svg viewBox="0 0 1440 52" preserveAspectRatio="none">
        <path
          d="M0 0 C 240 52, 480 52, 720 26 S 1200 0, 1440 26 L 1440 52 L 0 52 Z"
        />
      </svg>
    </div>
  )
}
