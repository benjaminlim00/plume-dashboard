import { http, createConfig } from "wagmi"
import { defineChain } from "viem"
import { metaMask } from "wagmi/connectors"

export const plume = defineChain({
  id: 98866,
  name: "Plume Mainnet",
  nativeCurrency: {
    decimals: 18,
    name: "Plume",
    symbol: "PLUME",
  },
  rpcUrls: {
    default: {
      http: ["https://rpc.plume.org"],
      webSocket: ["wss://rpc.plume.org"],
    },
  },
  blockExplorers: {
    default: {
      name: "Plume Explorer",
      url: "https://explorer.plume.org",
    },
  },
})

export const config = createConfig({
  chains: [plume],
  connectors: [metaMask()],
  transports: {
    [plume.id]: http(),
  },
})

declare module "wagmi" {
  interface Register {
    config: typeof config
  }
}
