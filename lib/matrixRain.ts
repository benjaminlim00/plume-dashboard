// Matrix character sets
export const MATRIX_CHARS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789ｦｧｨｩｪｫｬｭｮｯｰｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ"

export const BINARY_CHARS =
  "1001010110101001010110100101011010010101101001010110100101011010"

// Matrix configuration constants
export const MATRIX_CONFIG = {
  NORMAL_MODE: {
    MATRIX_COLUMNS: 80,
    BINARY_COLUMNS: 25,
    MATRIX_SPACING: 1.25,
    BINARY_SPACING: 4,
    MATRIX_TRAIL_LENGTH: 35,
    BINARY_TRAIL_LENGTH: 20,
  },
  LOW_PERFORMANCE_MODE: {
    MATRIX_COLUMNS: 40,
    BINARY_COLUMNS: 10,
    MATRIX_SPACING: 2.5,
    BINARY_SPACING: 10,
    MATRIX_TRAIL_LENGTH: 20,
    BINARY_TRAIL_LENGTH: 10,
  },
  ANIMATION: {
    MATRIX_DURATION_MIN: 15,
    MATRIX_DURATION_RANGE: 20,
    BINARY_DURATION_MIN: 25,
    BINARY_DURATION_RANGE: 30,
    DELAY_RANGE_MATRIX: 20,
    DELAY_RANGE_BINARY: 30,
  },
  PERFORMANCE: {
    FPS_TARGET: 16, // 60fps = 16ms
    PERFORMANCE_THRESHOLD: 20, // ms
    CHECK_INTERVAL: 10000, // 10 seconds
  },
} as const

// Utility functions
export const generateCharacterString = (
  length: number,
  chars: string
): string =>
  Array.from(
    { length },
    () => chars[Math.floor(Math.random() * chars.length)]
  ).join("")

export const getMatrixCharacterOpacity = (index: number): number =>
  index === 0 ? 1 : Math.max(0.05, 1 - index * 0.03)

export const getMatrixCharacterColor = (index: number): string =>
  index === 0 ? "#ffffff" : index < 4 ? "#00ff41" : "#008f11"

export const getBinaryCharacterOpacity = (index: number): number =>
  Math.max(0.1, 1 - index * 0.05)

export const getBinaryCharacterColor = (): string => "#006600"
