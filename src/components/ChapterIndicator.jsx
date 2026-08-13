import { useEffect, useRef, useState } from 'react'
import { HeartIcon } from './Ambience'

const CHAPTERS = [
  { num: '01', name: 'The Beginning' },
  { num: '02', name: "I'm Sorry" },
  { num: '03', name: 'Our Memories' },
  { num: '04', name: 'The Song' },
  { num: '05', name: 'If I Could Go Back' },
  { num: '06', name: 'The Letter' },
  { num: '07', name: 'What I Want' },
  { num: '08', name: 'One Question' },
]

export default function ChapterIndicator() {
  const [visible, setVisible] = useState(false)
  const [chapter, setChapter] = useState(0)
  const [progress, setProgress] = useState(0)
  const ticking = useRef(false)

  useEffect(() => {
    const sections = document.querySelectorAll('[data-chapter]')

    const update = () => {
      const scrollTop = window.scrollY
      const doc = document.documentElement
      const total = doc.scrollHeight - window.innerHeight
      setProgress(total > 0 ? Math.min(1, Math.max(0, scrollTop / total)) : 0)

      let current = 0
      sections.forEach((section, i) => {
        const rect = section.getBoundingClientRect()
        if (rect.top <= window.innerHeight * 0.5) current = i
      })
      setChapter(Math.min(current, CHAPTERS.length - 1))
      setVisible(scrollTop > window.innerHeight * 0.6)
      ticking.current = false
    }

    const onScroll = () => {
      if (!ticking.current) {
        ticking.current = true
        requestAnimationFrame(update)
      }
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  const current = CHAPTERS[chapter] || CHAPTERS[0]

  return (
    <>
      <div className="chapter-progress" aria-hidden="true">
        <div className="chapter-progress__fill" style={{ width: `${progress * 100}%` }} />
      </div>

      <p
        className={`chapter-indicator${visible ? ' is-visible' : ''}`}
        aria-label="Story progress"
      >
        <HeartIcon size={13} className="chapter-indicator__heart" />
        <span className="chapter-indicator__num">{current.num}</span>
        <span className="chapter-indicator__sep">/ 08</span>
        <span className="chapter-indicator__name">&nbsp;&mdash;&nbsp;{current.name}</span>
      </p>
    </>
  )
}
