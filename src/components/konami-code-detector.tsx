'use client'

import { useEffect, useRef } from 'react'
import { useGamification } from '@/hooks/use-gamification'

const KONAMI_CODE = [
  'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
  'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
  'KeyB', 'KeyA'
]

export function KonamiCodeDetector() {
  const { triggerKonamiCode, trackSpecialEvent } = useGamification()
  const sequenceRef = useRef<string[]>([])
  const clickCountRef = useRef(0)
  const clickTimerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Add the pressed key to the sequence
      sequenceRef.current.push(event.code)

      // Keep only the last 10 keys (length of Konami code)
      if (sequenceRef.current.length > KONAMI_CODE.length) {
        sequenceRef.current = sequenceRef.current.slice(-KONAMI_CODE.length)
      }

      // Check if the sequence matches the Konami code
      if (sequenceRef.current.length === KONAMI_CODE.length) {
        const matches = sequenceRef.current.every((key, index) => key === KONAMI_CODE[index])
        if (matches) {
          triggerKonamiCode()
          // Reset the sequence
          sequenceRef.current = []
        }
      }
    }

    const handleClick = () => {
      clickCountRef.current += 1

      // Clear existing timer
      if (clickTimerRef.current) {
        clearTimeout(clickTimerRef.current)
      }

      // Set a new timer to reset the count after 2 seconds
      clickTimerRef.current = setTimeout(() => {
        clickCountRef.current = 0
      }, 2000)

      // Check if user clicked 20 times in 2 seconds (button mashing)
      if (clickCountRef.current >= 20) {
        trackSpecialEvent('buttonMash')
        clickCountRef.current = 0 // Reset counter
        if (clickTimerRef.current) {
          clearTimeout(clickTimerRef.current)
        }
      }
    }

    // Add global keyboard and click listeners
    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('click', handleClick)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('click', handleClick)
      if (clickTimerRef.current) {
        clearTimeout(clickTimerRef.current)
      }
    }
  }, [triggerKonamiCode, trackSpecialEvent])

  // This component doesn't render anything
  return null
}