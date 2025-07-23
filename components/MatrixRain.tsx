import React from "react"
import { IMatrixColumn } from "../hooks/useMatrixRain"
import {
  getMatrixCharacterOpacity,
  getMatrixCharacterColor,
  getBinaryCharacterOpacity,
  getBinaryCharacterColor,
} from "../lib/matrixRain"

interface MatrixRainProps {
  matrixColumns: IMatrixColumn[]
  binaryColumns: IMatrixColumn[]
}

const MatrixColumn: React.FC<{
  column: IMatrixColumn
  className: string
  opacity: number
  getCharacterOpacity: (index: number) => number
  getCharacterColor: (index: number) => string
}> = ({
  column,
  className,
  opacity,
  getCharacterOpacity,
  getCharacterColor,
}) => (
  <div
    key={column.id}
    className={`absolute font-mono leading-tight whitespace-pre will-change-transform ${className}`}
    style={{
      left: `${column.left}%`,
      animation: `matrix-rain ${column.duration}s linear infinite`,
      animationDelay: `${column.delay}s`,
      opacity,
    }}
  >
    {column.characters.split("").map((char, j) => (
      <div
        key={j}
        style={{
          opacity: getCharacterOpacity(j),
          color: getCharacterColor(j),
        }}
      >
        {char}
      </div>
    ))}
  </div>
)

export const MatrixRain: React.FC<MatrixRainProps> = ({
  matrixColumns,
  binaryColumns,
}) => {
  return (
    <>
      {/* Matrix rain background */}
      <div className="absolute inset-0 animate-[fadeIn_1s_ease-in_forwards] overflow-hidden opacity-0 select-none">
        {matrixColumns.map((column) => (
          <MatrixColumn
            key={column.id}
            column={column}
            className="text-sm text-green-400"
            opacity={0.6}
            getCharacterOpacity={getMatrixCharacterOpacity}
            getCharacterColor={getMatrixCharacterColor}
          />
        ))}
      </div>

      {/* Matrix rain 2 - slower for depth */}
      <div className="pointer-events-none absolute inset-0 animate-[fadeIn_1s_ease-in_forwards] overflow-hidden opacity-0 select-none">
        {binaryColumns.map((column) => (
          <MatrixColumn
            key={column.id}
            column={column}
            className="text-xs text-green-500/40"
            opacity={0.7}
            getCharacterOpacity={getBinaryCharacterOpacity}
            getCharacterColor={() => getBinaryCharacterColor()}
          />
        ))}
      </div>

      {/* Matrix rain animation styles */}
      <style jsx>{`
        @keyframes matrix-rain {
          0% {
            transform: translateY(-100vh);
          }
          100% {
            transform: translateY(100vh);
          }
        }
        @keyframes fadeIn {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 0.6;
          }
        }
      `}</style>
    </>
  )
}
