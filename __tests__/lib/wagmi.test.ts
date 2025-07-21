import { http } from "wagmi"
import { metaMask } from "wagmi/connectors"
import { plume, config } from "../../lib/wagmi"

// Mock wagmi dependencies
jest.mock("wagmi", () => ({
  http: jest.fn(),
  createConfig: jest.fn((configOptions) => ({
    ...configOptions,
    _internal: {
      transports: configOptions.transports,
      chains: configOptions.chains,
      connectors: configOptions.connectors,
    },
  })),
}))

jest.mock("wagmi/connectors", () => ({
  metaMask: jest.fn(() => ({ name: "metaMask" })),
}))

describe("Wagmi Configuration", () => {
  describe("Plume Chain Configuration", () => {
    it("should have correct chain ID", () => {
      expect(plume.id).toBe(98866)
    })

    it("should have correct chain name", () => {
      expect(plume.name).toBe("Plume Mainnet")
    })

    it("should have correct native currency", () => {
      expect(plume.nativeCurrency).toEqual({
        decimals: 18,
        name: "Plume",
        symbol: "PLUME",
      })
    })

    it("should have correct RPC URLs", () => {
      expect(plume.rpcUrls.default.http).toEqual(["https://rpc.plume.org"])
      expect(plume.rpcUrls.default.webSocket).toEqual(["wss://rpc.plume.org"])
    })

    it("should have correct block explorer", () => {
      expect(plume.blockExplorers.default).toEqual({
        name: "Plume Explorer",
        url: "https://explorer.plume.org",
      })
    })

    it("should be a valid chain object", () => {
      expect(plume).toHaveProperty("id")
      expect(plume).toHaveProperty("name")
      expect(plume).toHaveProperty("nativeCurrency")
      expect(plume).toHaveProperty("rpcUrls")
      expect(plume).toHaveProperty("blockExplorers")
    })
  })

  describe("Wagmi Config", () => {
    it("should include Plume chain", () => {
      expect(config.chains).toEqual([plume])
    })

    it("should include MetaMask connector", () => {
      expect(metaMask).toHaveBeenCalled()
      expect(config.connectors).toContainEqual({ name: "metaMask" })
    })

    it("should configure transport for Plume chain", () => {
      expect(http).toHaveBeenCalled()
      expect(config.transports).toHaveProperty(plume.id.toString())
    })

    it("should be a valid Wagmi config", () => {
      expect(config).toHaveProperty("chains")
      expect(config).toHaveProperty("connectors")
      expect(config).toHaveProperty("transports")
    })
  })

  describe("Network Configuration Validation", () => {
    it("should use secure HTTPS RPC endpoint", () => {
      const rpcUrl = plume.rpcUrls.default.http[0]
      expect(rpcUrl).toMatch(/^https:\/\//)
    })

    it("should use secure WSS WebSocket endpoint", () => {
      const wsUrl = plume.rpcUrls.default.webSocket![0]
      expect(wsUrl).toMatch(/^wss:\/\//)
    })

    it("should use secure HTTPS block explorer", () => {
      const explorerUrl = plume.blockExplorers.default.url
      expect(explorerUrl).toMatch(/^https:\/\//)
    })

    it("should have mainnet chain ID", () => {
      // Verify this is the correct mainnet chain ID for Plume
      expect(plume.id).toBe(98866)
      // Ensure it's not a testnet ID (common testnet IDs are < 10000)
      expect(plume.id).toBeGreaterThan(10000)
    })
  })

  describe("TypeScript Module Declaration", () => {
    it("should extend wagmi module with config type", () => {
      // This test verifies that the module declaration exists
      // The actual type checking is done by TypeScript compiler
      expect(typeof config).toBe("object")
    })
  })

  describe("Error Handling", () => {
    it("should handle RPC endpoint validation", () => {
      const rpcEndpoint = plume.rpcUrls.default.http[0]

      // Validate RPC endpoint format
      expect(() => new URL(rpcEndpoint)).not.toThrow()
      expect(rpcEndpoint).not.toContain("localhost")
      expect(rpcEndpoint).not.toContain("127.0.0.1")
    })

    it("should handle WebSocket endpoint validation", () => {
      const wsEndpoint = plume.rpcUrls.default.webSocket![0]

      // Validate WebSocket endpoint format
      expect(() => new URL(wsEndpoint)).not.toThrow()
      expect(wsEndpoint).not.toContain("localhost")
      expect(wsEndpoint).not.toContain("127.0.0.1")
    })

    it("should handle block explorer validation", () => {
      const explorerUrl = plume.blockExplorers.default.url

      // Validate block explorer URL format
      expect(() => new URL(explorerUrl)).not.toThrow()
      expect(explorerUrl).not.toContain("localhost")
      expect(explorerUrl).not.toContain("127.0.0.1")
    })
  })

  describe("Configuration Consistency", () => {
    it("should have consistent naming across configuration", () => {
      expect(plume.name).toContain("Plume")
      expect(plume.nativeCurrency.name).toContain("Plume")
      expect(plume.blockExplorers.default.name).toContain("Plume")
    })

    it("should use consistent domain across endpoints", () => {
      const rpcUrl = plume.rpcUrls.default.http[0]
      const wsUrl = plume.rpcUrls.default.webSocket![0]
      const explorerUrl = plume.blockExplorers.default.url

      expect(rpcUrl).toContain("plume.org")
      expect(wsUrl).toContain("plume.org")
      expect(explorerUrl).toContain("plume.org")
    })

    it("should have standard native currency decimals", () => {
      expect(plume.nativeCurrency.decimals).toBe(18)
    })

    it("should have uppercase symbol", () => {
      expect(plume.nativeCurrency.symbol).toBe(
        plume.nativeCurrency.symbol.toUpperCase()
      )
    })
  })

  describe("Development vs Production Configuration", () => {
    it("should use production endpoints", () => {
      const rpcUrl = plume.rpcUrls.default.http[0]
      const wsUrl = plume.rpcUrls.default.webSocket![0]

      // Ensure not using development/testnet endpoints
      expect(rpcUrl).not.toContain("testnet")
      expect(rpcUrl).not.toContain("dev")
      expect(rpcUrl).not.toContain("staging")

      expect(wsUrl).not.toContain("testnet")
      expect(wsUrl).not.toContain("dev")
      expect(wsUrl).not.toContain("staging")
    })

    it("should be configured for mainnet", () => {
      expect(plume.name).toContain("Mainnet")
      expect(plume.name).not.toContain("Testnet")
      expect(plume.name).not.toContain("Dev")
    })
  })
})
