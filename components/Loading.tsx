const Loading = () => {
  return (
    <div className="relative flex h-screen items-center justify-center overflow-hidden bg-black">
      {/* Matrix digital overlay */}
      <div className="bg-gradient-radial absolute inset-0 from-green-900/20 via-black to-black" />

      <div className="flex items-center gap-2 font-mono text-xs text-green-400">
        <div className="h-1.5 w-1.5 animate-pulse bg-green-400" />
        <span>PROTOCOL INITIALIZING</span>
        <div className="h-1.5 w-1.5 animate-pulse bg-green-400" />
      </div>

      {/* Floating matrix data */}
      <div className="absolute top-8 right-8 font-mono text-xs text-green-400/70">
        <div className="flex flex-col items-end space-y-1 border border-green-500/30 px-4 py-3">
          <div>CHAIN_ID: 98866</div>
          <div>NODE: {"SEARCHING"}</div>
          <div className="flex items-center gap-1.5">
            <div className="h-1 w-1 animate-pulse bg-yellow-400" />
            <span>{"CONNECTING"}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Loading
