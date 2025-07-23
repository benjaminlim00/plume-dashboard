import React from "react"

interface MatrixContainerProps {
  isPending: boolean
  onConnectWallet: () => void
}

export const MatrixContainer: React.FC<MatrixContainerProps> = ({
  isPending,
  onConnectWallet,
}) => {
  return (
    <>
      {/* Matrix digital overlay */}
      <div className="bg-gradient-radial absolute inset-0 from-green-900/20 via-black to-black" />

      {/* Main container with matrix styling */}
      <div className="relative z-10 mx-4 flex h-[333px] w-[650px] max-w-[90vw] flex-col gap-8 border-2 border-green-500/50 bg-black/95 p-8 text-center font-mono shadow-[0_0_50px_rgba(34,197,94,0.3)] md:h-[400px] md:gap-8">
        {/* Pulsating border */}
        <div className="absolute inset-0 animate-pulse border border-green-500/30" />

        {/* Corner matrix symbols */}
        {[
          { top: "-top-2", left: "-left-2" },
          { top: "-top-2", left: "-right-2" },
          { top: "-bottom-2", left: "-left-2" },
          { top: "-bottom-2", left: "-right-2" },
        ].map((position, i) => (
          <div
            key={i}
            className={`absolute ${position.top} ${position.left} flex h-4 w-4 items-center justify-center border-2 border-green-500 bg-black text-xs font-bold text-green-500`}
          >
            +
          </div>
        ))}

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
          {/* Background glow */}
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
            className={`relative cursor-pointer border-2 border-green-500 bg-black px-10 py-4 font-bold tracking-widest text-green-400 transition-all duration-300 hover:border-green-300 hover:text-green-200 hover:shadow-[0_0_30px_rgba(34,197,94,0.6)] active:scale-95 disabled:cursor-not-allowed ${isPending ? "border-green-300" : ""} `}
            onClick={onConnectWallet}
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
            {[
              {
                top: "-top-1",
                left: "-left-1",
                border: "border-t-2 border-l-2",
              },
              {
                top: "-top-1",
                left: "-right-1",
                border: "border-t-2 border-r-2",
              },
              {
                top: "-bottom-1",
                left: "-left-1",
                border: "border-b-2 border-l-2",
              },
              {
                top: "-bottom-1",
                left: "-right-1",
                border: "border-r-2 border-b-2",
              },
            ].map((decoration, i) => (
              <div
                key={i}
                className={`absolute ${decoration.top} ${decoration.left} h-2 w-2 ${decoration.border} border-green-500`}
              />
            ))}
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
    </>
  )
}
