import { GET } from "../../src/app/api/vaults/route"

// Mock vault data for testing
const MOCK_VAULT_DATA = [
  {
    vaultStatus: "active",
    slug: "nest-alpha-vault",
    image: "alpha-image.png",
    name: "Nest Alpha Vault",
    description: "Alpha vault description",
    tvl: 1000000,
    formattedTvl: "$1,000,000",
    apy: 0.15,
    price: 1.05,
    hasBoostedRewards: false,
    formattedApy: "15.00%",
    featuredAssets: [],
    formattedCooldownDays: "7 days",
    ethereum: {
      contractAddress: "0xeth_alpha_address",
    },
    plume: {
      contractAddress: "0xalpha1234567890123456789012345678901234567890",
    },
  },
  {
    vaultStatus: "active",
    slug: "nest-treasury-vault",
    image: "treasury-image.png",
    name: "Nest Treasury Vault",
    description: "Treasury vault description",
    tvl: 2000000,
    formattedTvl: "$2,000,000",
    apy: 0.08,
    price: 0.98,
    hasBoostedRewards: false,
    formattedApy: "8.00%",
    featuredAssets: [],
    formattedCooldownDays: "14 days",
    ethereum: {
      contractAddress: "0xeth_treasury_address",
    },
    plume: {
      contractAddress: "0xtreasury1234567890123456789012345678901234567890",
    },
  },
]

// Mock fetch for API route testing
const mockFetch = jest.fn()
global.fetch = mockFetch

describe("/api/vaults API Route", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // Reset console.error mock
    jest.spyOn(console, "error").mockImplementation(() => {})
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe("Successful responses", () => {
    beforeEach(() => {
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => MOCK_VAULT_DATA,
      })
    })

    it("should return vault data successfully", async () => {
      const response = await GET()
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toEqual(MOCK_VAULT_DATA)
    })

    it("should call external API with correct URL", async () => {
      await GET()

      expect(mockFetch).toHaveBeenCalledWith(
        "https://app.nest.credit/api/vaults"
      )
    })

    it("should proxy data from external API correctly", async () => {
      const response = await GET()
      const data = await response.json()

      expect(Array.isArray(data)).toBe(true)
      expect(data).toHaveLength(2)
      expect(data[0]).toHaveProperty("name", "Nest Alpha Vault")
      expect(data[1]).toHaveProperty("name", "Nest Treasury Vault")
    })

    it("should preserve all vault properties", async () => {
      const response = await GET()
      const data = await response.json()

      const alphaVault = data[0]
      expect(alphaVault).toHaveProperty("vaultStatus", "active")
      expect(alphaVault).toHaveProperty("slug", "nest-alpha-vault")
      expect(alphaVault).toHaveProperty("tvl", 1000000)
      expect(alphaVault).toHaveProperty("apy", 0.15)
      expect(alphaVault).toHaveProperty("price", 1.05)
      expect(alphaVault).toHaveProperty("plume")
      expect(alphaVault.plume).toHaveProperty("contractAddress")
    })
  })

  describe("Error handling", () => {
    it("should handle external API 500 errors", async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 500,
        json: async () => ({ error: "Internal server error" }),
      })

      const response = await GET()
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data).toEqual({ error: "Failed to fetch vault data" })
    })

    it("should handle external API 404 errors", async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 404,
        json: async () => ({ error: "Not found" }),
      })

      const response = await GET()
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data).toEqual({ error: "Failed to fetch vault data" })
    })

    it("should handle network errors", async () => {
      mockFetch.mockRejectedValue(new Error("Network error"))

      const response = await GET()
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data).toEqual({ error: "Failed to fetch vault data" })
    })

    it("should handle malformed JSON responses", async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => {
          throw new Error("Invalid JSON")
        },
      })

      const response = await GET()
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data).toEqual({ error: "Failed to fetch vault data" })
    })
  })

  describe("Response validation", () => {
    it("should handle empty response arrays", async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => [],
      })

      const response = await GET()
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toEqual([])
    })

    it("should handle null response", async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => null,
      })

      const response = await GET()
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toBeNull()
    })

    it("should preserve response structure", async () => {
      const customVaultData = [
        {
          ...MOCK_VAULT_DATA[0],
          customField: "test-value",
        },
      ]

      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => customVaultData,
      })

      const response = await GET()
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data[0]).toHaveProperty("customField", "test-value")
    })
  })

  describe("Error logging", () => {
    let consoleSpy: jest.SpyInstance

    beforeEach(() => {
      consoleSpy = jest.spyOn(console, "error").mockImplementation()
    })

    afterEach(() => {
      consoleSpy.mockRestore()
    })

    it("should log errors for debugging", async () => {
      const networkError = new Error("Network error")
      mockFetch.mockRejectedValue(networkError)

      await GET()

      expect(consoleSpy).toHaveBeenCalledWith(
        "Error fetching vault data:",
        networkError
      )
    })

    it("should log API status errors", async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 500,
      })

      await GET()

      expect(consoleSpy).toHaveBeenCalledWith(
        "Error fetching vault data:",
        expect.any(Error)
      )
    })

    it("should not log errors for successful requests", async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => MOCK_VAULT_DATA,
      })

      await GET()

      expect(consoleSpy).not.toHaveBeenCalled()
    })
  })

  describe("Performance and reliability", () => {
    it("should handle concurrent requests", async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => MOCK_VAULT_DATA,
      })

      const promises = Array(5)
        .fill(null)
        .map(() => GET())
      const responses = await Promise.all(promises)

      responses.forEach(async (response) => {
        expect(response.status).toBe(200)
        const data = await response.json()
        expect(data).toEqual(MOCK_VAULT_DATA)
      })
    })

    it("should handle large response payloads", async () => {
      const largeVaultData = Array(100)
        .fill(null)
        .map((_, index) => ({
          ...MOCK_VAULT_DATA[0],
          slug: `vault-${index}`,
          name: `Vault ${index}`,
        }))

      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => largeVaultData,
      })

      const response = await GET()
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toHaveLength(100)
    })
  })
})
