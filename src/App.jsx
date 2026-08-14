import { useEffect, useState } from 'react'
import Hero from './components/Hero'
import ChapterIndicator from './components/ChapterIndicator'
import Ambience from './components/Ambience'
import HeartDivider from './components/HeartDivider'
import ApologySection from './components/ApologySection'
import AccountabilitySection from './components/AccountabilitySection'
import MemoryTimeline from './components/MemoryTimeline'
import MusicSection from './components/MusicSection'
import ReflectionSection from './components/ReflectionSection'
import LetterSection from './components/LetterSection'
import PauseSection from './components/PauseSection'
import FinalQuestion from './components/FinalQuestion'
import YesExperience from './components/YesExperience'
import NeedTimeScreen from './components/NeedTimeScreen'
import Epilogue from './components/Epilogue'
import AdminPage from './admin/AdminPage'
import { armInteractionListener } from './data/contentStore'
import { startSync } from './data/syncStore'

function useHashRoute() {
  const [hash, setHash] = useState(() => window.location.hash)

  useEffect(() => {
    const onHash = () => setHash(window.location.hash)
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  return hash
}

export default function App() {
  const hash = useHashRoute()
  const [yes, setYes] = useState(false)
  const [needTime, setNeedTime] = useState(false)

  // Track the first click/keystroke anywhere — unlocks music autoplay.
  useEffect(() => {
    armInteractionListener()
  }, [])

  // Poll the sync server so edits made on any device appear here too.
  useEffect(() => startSync(), [])

  if (hash.startsWith('#/admin')) {
    return (
      <>
        <Ambience />
        <AdminPage />
      </>
    )
  }

  return (
    <>
      <Ambience />
      <ChapterIndicator />

      <main>
        <Hero />
        <HeartDivider />

        <ApologySection />
        <HeartDivider flip />

        <AccountabilitySection />
        <HeartDivider />

        <MemoryTimeline />
        <HeartDivider flip />

        <MusicSection />
        <HeartDivider />

        <ReflectionSection />
        <HeartDivider flip />

        <LetterSection />
        <HeartDivider />

        <PauseSection />
        <HeartDivider flip />

        <FinalQuestion onYes={() => setYes(true)} onNeedTime={() => setNeedTime(true)} />
        <Epilogue />
      </main>

      <YesExperience open={yes} />
      <NeedTimeScreen open={needTime} />
    </>
  )
}
