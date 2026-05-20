import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface ConsentState {
  hasAccepted: boolean | null
  setConsent: (accepted: boolean) => void
}

export const useConsentStore = create<ConsentState>()(
  persist(
    (set) => ({
      hasAccepted: null,
      setConsent: (accepted: boolean) => set({ hasAccepted: accepted }),
    }),
    {
      name: 'user-consent',
    }
  )
)
