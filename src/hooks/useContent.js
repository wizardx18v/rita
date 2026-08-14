import { useEffect, useState } from 'react'
import { loadContent } from '../data/contentStore'

// Reactive access to the site content (defaults + admin overrides).
// Re-renders whenever content changes (admin save, other tabs, storage).
export default function useContent() {
  const [content, setContent] = useState(loadContent)

  useEffect(() => {
    const refresh = () => setContent(loadContent())
    window.addEventListener('rita:content-changed', refresh)
    window.addEventListener('storage', refresh)
    return () => {
      window.removeEventListener('rita:content-changed', refresh)
      window.removeEventListener('storage', refresh)
    }
  }, [])

  return content
}
