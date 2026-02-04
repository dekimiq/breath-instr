import { create } from 'zustand'

interface TrackerState {
  progress: number
  increment: () => void
  reset: () => void
}

export const useTrackerStore = create<TrackerState>((set) => ({
  progress: 0,
  increment: () => set((state) => ({ progress: state.progress + 1 })),
  reset: () => set({ progress: 0 }),
}))
