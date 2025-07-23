"use client"

import { useRouter } from "next/navigation"
import { useConnect, useAccount } from "wagmi"
import { useEffect, useState } from "react"
import { injected } from "wagmi/connectors"
import Loading from "../components/Loading"
import { MatrixRain } from "../components/MatrixRain"
import { MatrixContainer } from "../components/MatrixContainer"
import { usePerformanceMonitor } from "../hooks/usePerformanceMonitor"
import { useMatrixRain } from "../hooks/useMatrixRain"

const HomeViewMatrix: React.FC = () => {
  const router = useRouter()
  const { isConnected } = useAccount()
  const { connect, isPending } = useConnect()
  const [isLoading, setIsLoading] = useState(true)

  // Use custom hooks for performance monitoring and matrix rain generation
  const { isLowPerformance } = usePerformanceMonitor()
  const { matrixColumns, binaryColumns } = useMatrixRain(isLowPerformance)

  useEffect(() => {
    if (isConnected) {
      router.push("/dashboard?from=matrix")
    } else {
      setIsLoading(false)
    }
  }, [isConnected, router])

  const handleConnectWallet = () => {
    connect({ connector: injected() })
  }

  if (isLoading) {
    return <Loading />
  }

  return (
    <div className="relative flex h-screen items-center justify-center overflow-hidden bg-black">
      <MatrixRain matrixColumns={matrixColumns} binaryColumns={binaryColumns} />
      <MatrixContainer
        isPending={isPending}
        onConnectWallet={handleConnectWallet}
      />
    </div>
  )
}

export default HomeViewMatrix
