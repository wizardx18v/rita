import { useState } from 'react'
import Hero from './components/Hero'
import ChapterIndicator from './components/ChapterIndicator'
import Ambience, { HeartIcon } from './components/Ambience'
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

export default function App() {
  const [yes, setYes] = useState(false)
  const [needTime, setNeedTime] = useState(false)

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
