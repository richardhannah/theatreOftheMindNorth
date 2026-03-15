import { useRef, useCallback } from 'react'

// Accelerating hold-to-transfer: 1 per 100ms for 1s, then 10 per 100ms for 1s, then 100 per 100ms for 1s, then 1000 per 100ms
export function useHoldTransfer(onTransfer) {
  const timerRef = useRef(null)
  const elapsedRef = useRef(0)

  const getAmount = (elapsed) => {
    if (elapsed < 1000) return 1
    if (elapsed < 2000) return 10
    if (elapsed < 3000) return 100
    return 1000
  }

  const start = useCallback((...args) => {
    // Fire once immediately
    onTransfer(...args, 1)
    elapsedRef.current = 0

    const tick = () => {
      elapsedRef.current += 100
      const amt = getAmount(elapsedRef.current)
      onTransfer(...args, amt)
      timerRef.current = setTimeout(tick, 100)
    }

    // Start repeating after initial delay
    timerRef.current = setTimeout(tick, 400)
  }, [onTransfer])

  const stop = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
    elapsedRef.current = 0
  }, [])

  return { start, stop }
}
