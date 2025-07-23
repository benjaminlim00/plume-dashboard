"use client"

import { useRouter } from "next/navigation"
import { useConnect, useAccount } from "wagmi"
import { useEffect, useState } from "react"
import { injected } from "wagmi/connectors"
import Loading from "../components/Loading"

const HomeViewMatrix: React.FC = () => {
  const router = useRouter()
  const { isConnected } = useAccount()
  const { connect, isPending } = useConnect()
  const [isLoading, setIsLoading] = useState(true)

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
      {/* Matrix rain background */}
      <div className="absolute inset-0 animate-[fadeIn_1s_ease-in_forwards] overflow-hidden opacity-0">
        {Array.from({ length: 120 }).map((_, i) => (
          <div
            key={i}
            className="absolute font-mono text-sm leading-tight whitespace-pre text-green-400"
            style={{
              left: `${i * 0.83}%`,
              animation: `matrix-rain ${15 + Math.random() * 20}s linear infinite`,
              animationDelay: `${-Math.random() * 20}s`,
              opacity: 0.6,
            }}
          >
            {Array.from({ length: 50 }).map((_, j) => {
              const chars =
                "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789ｦｧｨｩｪｫｬｭｮｯｰｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ"
              return (
                <div
                  key={j}
                  style={{
                    opacity: j === 0 ? 1 : Math.max(0.05, 1 - j * 0.03),
                    color: j === 0 ? "#ffffff" : j < 4 ? "#00ff41" : "#008f11",
                  }}
                >
                  {chars[Math.floor(Math.random() * chars.length)]}
                </div>
              )
            })}
          </div>
        ))}
      </div>

      {/* Matrix rain 2 - slower for depth */}
      <div className="pointer-events-none absolute inset-0 animate-[fadeIn_1s_ease-in_forwards] overflow-hidden opacity-0">
        {Array.from({ length: 40 }).map((_, i) => (
          <div
            key={i}
            className="absolute font-mono text-xs leading-tight whitespace-pre text-green-500/40"
            style={{
              left: `${i * 2.5}%`,
              animation: `matrix-rain ${25 + Math.random() * 30}s linear infinite`,
              animationDelay: `${-Math.random() * 30}s`,
              opacity: 0.7,
            }}
          >
            {Array.from({ length: 20 }).map((_, j) => {
              const matrixChars =
                "1001010110101001010110100101011010010101101001010110100101011010"
              return (
                <div
                  key={j}
                  style={{
                    opacity: Math.max(0.1, 1 - j * 0.05),
                    color: "#006600",
                  }}
                >
                  {matrixChars[Math.floor(Math.random() * matrixChars.length)]}
                </div>
              )
            })}
          </div>
        ))}
      </div>

      {/* Main container with matrix styling */}
      {/* //NOTE: control height here */}
      <div className="relative z-10 mx-4 flex h-[333px] w-[650px] max-w-[90vw] flex-col gap-8 border-2 border-green-500/50 bg-black/95 p-8 text-center font-mono shadow-[0_0_50px_rgba(34,197,94,0.3)] md:h-[400px] md:gap-8">
        {/* pulsating border */}
        <div className="absolute inset-0 animate-pulse border border-green-500/30" />

        {/* Corner matrix symbols */}
        <div className="absolute -top-2 -left-2 flex h-4 w-4 items-center justify-center border-2 border-green-500 bg-black text-xs font-bold text-green-500">
          +
        </div>
        <div className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center border-2 border-green-500 bg-black text-xs font-bold text-green-500">
          +
        </div>
        <div className="absolute -bottom-2 -left-2 flex h-4 w-4 items-center justify-center border-2 border-green-500 bg-black text-xs font-bold text-green-500">
          +
        </div>
        <div className="absolute -right-2 -bottom-2 flex h-4 w-4 items-center justify-center border-2 border-green-500 bg-black text-xs font-bold text-green-500">
          +
        </div>

        {/* Header text */}
        <div className="flex items-center justify-center">
          <div className="flex items-center gap-2 text-xs text-green-400">
            <div className="h-2 w-2 animate-pulse bg-green-400" />
            <span>PROTOCOL ACTIVE</span>
            <div className="h-2 w-2 animate-pulse bg-green-400" />
          </div>
        </div>

        {/* Logo group */}
        <div className="relative flex items-center justify-center">
          {/* Backgound glow */}
          <div className="absolute inset-0 bg-green-500/20 blur-xl" />

          <div className="flex flex-col">
            {/* ASCII Art Logo */}
            <pre className="scale-75 text-left text-xs leading-none text-green-400 md:text-lg">
              {String.raw`
░▒▓███████▓▒░░▒▓████████▓▒░░▒▓███████▓▒░▒▓████████▓▒░ 
░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░      ░▒▓█▓▒░         ░▒▓█▓▒░     
░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░      ░▒▓█▓▒░         ░▒▓█▓▒░     
░▒▓█▓▒░░▒▓█▓▒░▒▓██████▓▒░  ░▒▓██████▓▒░   ░▒▓█▓▒░     
░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░             ░▒▓█▓▒░  ░▒▓█▓▒░     
░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░             ░▒▓█▓▒░  ░▒▓█▓▒░     
░▒▓█▓▒░░▒▓█▓▒░▒▓████████▓▒░▒▓███████▓▒░   ░▒▓█▓▒░`}
            </pre>
            {/* Subtitle */}
            <div className="animate-pulse text-xs font-bold tracking-widest text-green-300">
              [ STAKING PROTOCOL ]
            </div>
          </div>
        </div>

        {/* Main text */}
        <div className="space-y-2">
          <p className="text-xs font-bold tracking-widest text-green-100 uppercase md:text-lg">
            [&quot;WALLET_CONNECTION_REQUIRED&quot;]
          </p>
          <p className="text-xs leading-relaxed text-green-400 md:text-sm">
            {">"} PLUG IN TO THE PLUME NETWORK
          </p>
        </div>

        {/* Connect button */}
        <div className="flex justify-center">
          <button
            //TODO: add animation on isPending
            className={`relative cursor-pointer border-2 border-green-500 bg-black px-10 py-4 font-bold tracking-widest text-green-400 transition-all duration-300 hover:border-green-300 hover:text-green-200 hover:shadow-[0_0_30px_rgba(34,197,94,0.6)] active:scale-95 disabled:cursor-not-allowed ${isPending ? "border-green-300" : ""} `}
            onClick={handleConnectWallet}
            disabled={isPending}
          >
            {/* Button matrix effect */}
            <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-green-500/10 via-green-500/15 to-green-500/10" />

            {/* Button content */}
            <span className="flex items-center gap-3">
              {isPending ? (
                <>
                  <div className="relative flex h-4 w-4 animate-spin items-center justify-center border-2 border-green-500 text-xs font-bold text-green-500">
                    <span>+</span>
                  </div>
                  ENTERING...
                </>
              ) : (
                <>
                  {"["} ENTER {"]"}
                </>
              )}
            </span>

            {/* Button corner decorations */}
            <div className="absolute -top-1 -left-1 h-2 w-2 border-t-2 border-l-2 border-green-500" />
            <div className="absolute -top-1 -right-1 h-2 w-2 border-t-2 border-r-2 border-green-500" />
            <div className="absolute -bottom-1 -left-1 h-2 w-2 border-b-2 border-l-2 border-green-500" />
            <div className="absolute -right-1 -bottom-1 h-2 w-2 border-r-2 border-b-2 border-green-500" />
          </button>
        </div>

        {/* Bottom matrix status */}
        <div className="mt-4 flex items-center justify-between border-t border-green-500/30 pt-4 text-xs text-green-500">
          <div className="flex items-center gap-2">
            <span>NETWORK:</span>
            <div className="h-1 w-1 animate-pulse bg-green-400" />
            <span>PLUME</span>
          </div>
          <div className="flex items-center gap-2">
            <span>PROTOCOL:</span>
            <div className="h-1 w-1 animate-pulse bg-green-400" />
            <span>WEB3</span>
          </div>
        </div>
      </div>

      {/* Floating matrix data */}
      <div className="absolute top-8 right-8 font-mono text-xs text-green-400/70">
        <div className="flex flex-col items-end space-y-1 border border-green-500/30 bg-black/80 px-4 py-3">
          <div>CHAIN_ID: 98866</div>
          <div>NODE: {"CONNECTED"}</div>
          <div className="flex items-center gap-1.5">
            <div className="h-1 w-1 animate-pulse bg-green-400" />
            <span>{"ONLINE"}</span>
          </div>
        </div>
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
    </div>
  )
}

export default HomeViewMatrix
