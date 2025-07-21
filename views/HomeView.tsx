"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"
import { useConnect, useAccount } from "wagmi"
import { useEffect, useState } from "react"
import { injected } from "wagmi/connectors"

const HomeView: React.FC = () => {
  const router = useRouter()
  const { isConnected } = useAccount()
  const { connect, isPending } = useConnect()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (isConnected) {
      router.push("/dashboard")
    }
    setIsLoading(false)
  }, [isConnected, router])

  const handleConnectWallet = () => {
    connect({ connector: injected() })
  }

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#F9FAFB]">
        <div
          className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"
          role="status"
          aria-label="Loading wallet connection"
        />
      </div>
    )
  }

  return (
    <div className="flex h-screen items-center justify-center bg-[#F9FAFB]">
      <div
        className="mx-4 flex h-[246px] w-[560px] flex-col gap-7 rounded-3xl border border-[#F0F0F0] p-8 text-center"
        style={{
          boxShadow: "0px 1px 3px 0px #0000000D",
        }}
      >
        <Image
          src="/logo.png"
          alt="Nest Icon"
          width={140}
          height={50}
          className="mx-auto"
        />
        <p>Connect your wallet to start using Nest.</p>

        <div className="flex justify-center">
          <button
            className="cursor-pointer rounded-full bg-[#09090B] px-4 py-3 text-white disabled:opacity-50"
            onClick={handleConnectWallet}
            disabled={isPending}
          >
            {isPending ? "Connecting..." : "Connect wallet"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default HomeView
