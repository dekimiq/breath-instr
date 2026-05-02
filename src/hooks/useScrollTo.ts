'use client'

import { useCallback } from 'react'

export const useScrollTo = () => {
  const scrollTo = useCallback((id: string) => {
    const targetId = id.replace('#', '')
    const element = document.getElementById(targetId)

    if (element) {
      const headerOffset = 80

      if (window.lenis) {
        window.lenis.scrollTo(element, {
          offset: -headerOffset,
          duration: 1.2,
          easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        })
      } else {
        const elementPosition = element.getBoundingClientRect().top
        const offsetPosition =
          elementPosition + window.pageYOffset - headerOffset

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth',
        })
      }

      // Update URL hash without triggering browser's default jump
      window.history.replaceState(null, '', `#${targetId}`)
    }
  }, [])

  return scrollTo
}
