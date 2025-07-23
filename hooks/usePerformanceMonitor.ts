import { useState, useCallback, useEffect } from "react"
import { MATRIX_CONFIG } from "../lib/matrixRain"

// 60 FPS -> 1000ms/60 = 16ms per frame
// logic: if a simple setTimeout(callback, 16) takes longer than 16ms to execute, it means:
// Browser can't keep up with 60 FPS, frames are dropping, animation will look choppy

export const usePerformanceMonitor = () => {
  const [isLowPerformance, setIsLowPerformance] = useState(false)

  const checkPerformance = useCallback(() => {
    if (typeof window !== "undefined" && "requestIdleCallback" in window) {
      window.requestIdleCallback(() => {
        const start = performance.now()
        setTimeout(() => {
          const elapsed = performance.now() - start
          // If simple timeout is delayed significantly, we're in low performance mode
          setIsLowPerformance(
            elapsed > MATRIX_CONFIG.PERFORMANCE.PERFORMANCE_THRESHOLD
          )
        }, MATRIX_CONFIG.PERFORMANCE.FPS_TARGET)
      })
    }
  }, [])

  useEffect(() => {
    checkPerformance()
    const interval = setInterval(
      checkPerformance,
      MATRIX_CONFIG.PERFORMANCE.CHECK_INTERVAL
    )
    return () => clearInterval(interval)
  }, [checkPerformance])

  return { isLowPerformance }
}
