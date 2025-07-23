import { useMemo } from "react"
import {
  MATRIX_CHARS,
  BINARY_CHARS,
  MATRIX_CONFIG,
  generateCharacterString,
} from "../lib/matrixRain"

export interface IMatrixColumn {
  id: number
  left: number
  duration: number
  delay: number
  characters: string
}

export const useMatrixRain = (isLowPerformance: boolean) => {
  const config = isLowPerformance
    ? MATRIX_CONFIG.LOW_PERFORMANCE_MODE
    : MATRIX_CONFIG.NORMAL_MODE

  const matrixColumns = useMemo(
    () =>
      Array.from(
        { length: config.MATRIX_COLUMNS },
        (_, i): IMatrixColumn => ({
          id: i,
          left: i * config.MATRIX_SPACING,
          duration:
            MATRIX_CONFIG.ANIMATION.MATRIX_DURATION_MIN +
            Math.random() * MATRIX_CONFIG.ANIMATION.MATRIX_DURATION_RANGE,
          delay: -Math.random() * MATRIX_CONFIG.ANIMATION.DELAY_RANGE_MATRIX,
          characters: generateCharacterString(
            config.MATRIX_TRAIL_LENGTH,
            MATRIX_CHARS
          ),
        })
      ),
    [config]
  )

  const binaryColumns = useMemo(
    () =>
      Array.from(
        { length: config.BINARY_COLUMNS },
        (_, i): IMatrixColumn => ({
          id: i,
          left: i * config.BINARY_SPACING,
          duration:
            MATRIX_CONFIG.ANIMATION.BINARY_DURATION_MIN +
            Math.random() * MATRIX_CONFIG.ANIMATION.BINARY_DURATION_RANGE,
          delay: -Math.random() * MATRIX_CONFIG.ANIMATION.DELAY_RANGE_BINARY,
          characters: generateCharacterString(
            config.BINARY_TRAIL_LENGTH,
            BINARY_CHARS
          ),
        })
      ),
    [config]
  )

  return { matrixColumns, binaryColumns }
}
