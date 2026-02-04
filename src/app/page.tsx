'use client'

import { AnimatedButton } from '@/components/ui/AnimatedButton/AnimatedButton'
import { useUserStore } from '@/store/user'
import { useTrackerStore } from '@/store/tracker'

export default function Home() {
  const { user, isAuthenticated } = useUserStore()
  const { progress, increment } = useTrackerStore()

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        gap: '20px',
      }}
    >
      <h1>Next.js Starter</h1>

      <div>
        <p>User: {isAuthenticated ? user?.name : 'Guest'}</p>
        <p>Progress: {progress}</p>
      </div>

      <div style={{ display: 'flex', gap: '10px' }}>
        <AnimatedButton onClick={increment}>Increment Progress</AnimatedButton>

        <AnimatedButton onClick={() => alert('Hello!')}>
          Click Me
        </AnimatedButton>
      </div>
    </div>
  )
}
