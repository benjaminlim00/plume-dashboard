"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"

const HomeView: React.FC = () => {
  const router = useRouter()

  const connectWallet = () => {
    router.push("/dashboard")
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
            className="cursor-pointer rounded-full bg-[#09090B] px-4 py-3 text-white"
            onClick={connectWallet}
          >
            Connect wallet
          </button>
        </div>
      </div>
    </div>
  )
}

export default HomeView
