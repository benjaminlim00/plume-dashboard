import { useState, useCallback, useEffect } from "react"
import { MATRIX_CONFIG } from "../lib/matrixRain"

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
