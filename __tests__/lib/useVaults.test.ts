import { renderHook } from "@testing-library/react"
import { useQuery } from "@tanstack/react-query"
import { useReadContract } from "wagmi"
import { useVaults } from "../../lib/useVaults"

// Mock vault data for testing
const MOCK_VAULT_DATA = [
  {
    vaultStatus: "active",
    slug: "nest-alpha-vault",
    name: "Nest Alpha Vault",
    tvl: 1000000,
    apy: 0.15,
    price: 1.05,
    plume: {
      contractAddress: "0xalpha1234567890123456789012345678901234567890",
    },
  },
  {
    vaultStatus: "active",
    slug: "nest-treasury-vault",
    name: "Nest Treasury Vault",
    tvl: 2000000,
    apy: 0.08,
    price: 0.98,
    plume: {
      contractAddress: "0xtreasury1234567890123456789012345678901234567890",
    },
  },
]

const MOCK_ERC20_RESPONSES = {
  decimals: 18,
  alphaBalance: BigInt("1000000000000000000"), // 1 token
  treasuryBalance: BigInt("2000000000000000000"), // 2 tokens
}

const MOCK_ADDRESSES = {
  ALPHA_VAULT: "0xalpha1234567890123456789012345678901234567890",
  TREASURY_VAULT: "0xtreasury1234567890123456789012345678901234567890",
}

// Mock Wagmi and React Query
jest.mock("wagmi", () => ({
  useReadContract: jest.fn(),
}))

jest.mock("@tanstack/react-query", () => ({
  useQuery: jest.fn(),
}))

describe("useVaults Hook", () => {
  const mockUseQuery = useQuery as jest.MockedFunction<typeof useQuery>
  const mockUseReadContract = useReadContract as jest.MockedFunction<
    typeof useReadContract
  >

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe("successful data fetching", () => {
    beforeEach(() => {
      // Mock successful vault data fetch
      mockUseQuery.mockReturnValue({
        data: MOCK_VAULT_DATA,
        isLoading: false,
        error: null,
      } as any)

      // Mock successful contract reads for decimals
      mockUseReadContract
        .mockReturnValueOnce({
          data: MOCK_ERC20_RESPONSES.decimals,
          isLoading: false,
        } as any)
        // Mock alpha balance read
        .mockReturnValueOnce({
          data: MOCK_ERC20_RESPONSES.alphaBalance,
          isLoading: false,
        } as any)
        // Mock treasury balance read
        .mockReturnValueOnce({
          data: MOCK_ERC20_RESPONSES.treasuryBalance,
          isLoading: false,
        } as any)
    })

    it("should fetch and process vault data correctly", () => {
      const { result } = renderHook(() => useVaults())

      expect(result.current.addresses.alphaAddress).toBe(
        MOCK_ADDRESSES.ALPHA_VAULT
      )
      expect(result.current.addresses.treasuryAddress).toBe(
        MOCK_ADDRESSES.TREASURY_VAULT
      )
      expect(result.current.decimals).toBe(18)
    })

    it("should calculate total token balance correctly", () => {
      const { result } = renderHook(() => useVaults())

      // 1 alpha + 2 treasury = 3 total tokens
      expect(result.current.totalTokenBalance).toBe("3")
    })

    it("should calculate total USD value correctly", () => {
      const { result } = renderHook(() => useVaults())

      // (1 alpha * $1.05) + (2 treasury * $0.98) = $1.05 + $1.96 = $3.01
      expect(result.current.totalBalanceUSD).toBe("3.01")
    })

    it("should set balanceLoading to false when all data is available", () => {
      const { result } = renderHook(() => useVaults())

      expect(result.current.balanceLoading).toBe(false)
    })

    it("should not have vault errors when data loads successfully", () => {
      const { result } = renderHook(() => useVaults())

      expect(result.current.vaultError).toBeNull()
    })
  })

  describe("loading states", () => {
    it("should show vaultLoading when query is loading", () => {
      mockUseQuery.mockReturnValue({
        data: undefined,
        isLoading: true,
        error: null,
      } as any)

      // Mock useReadContract calls to return loading state
      mockUseReadContract.mockReturnValue({
        data: undefined,
        isLoading: false,
      } as any)

      const { result } = renderHook(() => useVaults())

      expect(result.current.vaultLoading).toBe(true)
    })

    it("should show balanceLoading when vault data is loading", () => {
      mockUseQuery.mockReturnValue({
        data: undefined,
        isLoading: true,
        error: null,
      } as any)

      mockUseReadContract.mockReturnValue({
        data: undefined,
        isLoading: false,
      } as any)

      const { result } = renderHook(() => useVaults())

      expect(result.current.balanceLoading).toBe(true)
    })

    it("should show balanceLoading when alpha balance is loading", () => {
      mockUseQuery.mockReturnValue({
        data: MOCK_VAULT_DATA,
        isLoading: false,
        error: null,
      } as any)

      // Decimals loaded
      mockUseReadContract
        .mockReturnValueOnce({
          data: 18,
          isLoading: false,
        } as any)
        // Alpha balance loading
        .mockReturnValueOnce({
          data: undefined,
          isLoading: true,
        } as any)
        // Treasury balance loaded
        .mockReturnValueOnce({
          data: MOCK_ERC20_RESPONSES.treasuryBalance,
          isLoading: false,
        } as any)

      const { result } = renderHook(() => useVaults())

      expect(result.current.balanceLoading).toBe(true)
    })

    it("should show balanceLoading when treasury balance is loading", () => {
      mockUseQuery.mockReturnValue({
        data: MOCK_VAULT_DATA,
        isLoading: false,
        error: null,
      } as any)

      // Decimals loaded
      mockUseReadContract
        .mockReturnValueOnce({
          data: 18,
          isLoading: false,
        } as any)
        // Alpha balance loaded
        .mockReturnValueOnce({
          data: MOCK_ERC20_RESPONSES.alphaBalance,
          isLoading: false,
        } as any)
        // Treasury balance loading
        .mockReturnValueOnce({
          data: undefined,
          isLoading: true,
        } as any)

      const { result } = renderHook(() => useVaults())

      expect(result.current.balanceLoading).toBe(true)
    })
  })

  describe("error handling", () => {
    it("should handle vault API fetch errors", () => {
      const mockError = new Error("Failed to fetch vault data")
      mockUseQuery.mockReturnValue({
        data: undefined,
        isLoading: false,
        error: mockError,
      } as any)

      const { result } = renderHook(() => useVaults())

      expect(result.current.vaultError).toBe(mockError)
      expect(result.current.vaultLoading).toBe(false)
    })

    it("should handle missing vault data gracefully", () => {
      mockUseQuery.mockReturnValue({
        data: [],
        isLoading: false,
        error: null,
      } as any)

      mockUseReadContract.mockReturnValue({
        data: undefined,
        isLoading: false,
      } as any)

      const { result } = renderHook(() => useVaults())

      expect(result.current.addresses.alphaAddress).toBeUndefined()
      expect(result.current.addresses.treasuryAddress).toBeUndefined()
    })

    it("should handle missing decimals gracefully", () => {
      mockUseQuery.mockReturnValue({
        data: MOCK_VAULT_DATA,
        isLoading: false,
        error: null,
      } as any)

      // Missing decimals
      mockUseReadContract
        .mockReturnValueOnce({
          data: undefined,
          isLoading: false,
        } as any)
        .mockReturnValueOnce({
          data: MOCK_ERC20_RESPONSES.alphaBalance,
          isLoading: false,
        } as any)
        .mockReturnValueOnce({
          data: MOCK_ERC20_RESPONSES.treasuryBalance,
          isLoading: false,
        } as any)

      const { result } = renderHook(() => useVaults())

      expect(result.current.totalTokenBalance).toBe("0")
      expect(result.current.balanceLoading).toBe(true)
    })
  })

  describe("edge cases", () => {
    it("should handle zero balances correctly", () => {
      mockUseQuery.mockReturnValue({
        data: MOCK_VAULT_DATA,
        isLoading: false,
        error: null,
      } as any)

      mockUseReadContract
        .mockReturnValueOnce({
          data: 18,
          isLoading: false,
        } as any)
        // Zero alpha balance
        .mockReturnValueOnce({
          data: BigInt(0),
          isLoading: false,
        } as any)
        // Zero treasury balance
        .mockReturnValueOnce({
          data: BigInt(0),
          isLoading: false,
        } as any)

      const { result } = renderHook(() => useVaults())

      expect(result.current.totalTokenBalance).toBe("0")
      expect(result.current.totalBalanceUSD).toBe("0")
    })

    it("should handle missing price data", () => {
      const vaultDataWithoutPrices = MOCK_VAULT_DATA.map((vault) => ({
        ...vault,
        price: undefined,
      }))

      mockUseQuery.mockReturnValue({
        data: vaultDataWithoutPrices,
        isLoading: false,
        error: null,
      } as any)

      mockUseReadContract
        .mockReturnValueOnce({
          data: 18,
          isLoading: false,
        } as any)
        .mockReturnValueOnce({
          data: MOCK_ERC20_RESPONSES.alphaBalance,
          isLoading: false,
        } as any)
        .mockReturnValueOnce({
          data: MOCK_ERC20_RESPONSES.treasuryBalance,
          isLoading: false,
        } as any)

      const { result } = renderHook(() => useVaults())

      expect(result.current.totalBalanceUSD).toBe("0")
      expect(result.current.balanceLoading).toBe(true)
    })

    it("should handle malformed vault names", () => {
      const malformedVaultData = [
        {
          ...MOCK_VAULT_DATA[0],
          name: "Different Vault Name",
        },
        {
          ...MOCK_VAULT_DATA[1],
          name: "Also Different",
        },
      ]

      mockUseQuery.mockReturnValue({
        data: malformedVaultData,
        isLoading: false,
        error: null,
      } as any)

      const { result } = renderHook(() => useVaults())

      expect(result.current.addresses.alphaAddress).toBeUndefined()
      expect(result.current.addresses.treasuryAddress).toBeUndefined()
    })
  })

  describe("query configuration", () => {
    it("should use correct query key", () => {
      mockUseQuery.mockReturnValue({
        data: MOCK_VAULT_DATA,
        isLoading: false,
        error: null,
      } as any)

      renderHook(() => useVaults())

      expect(mockUseQuery).toHaveBeenCalledWith({
        queryKey: ["vaults"],
        queryFn: expect.any(Function),
        refetchInterval: 10000,
      })
    })

    it("should configure refetch interval correctly", () => {
      mockUseQuery.mockReturnValue({
        data: MOCK_VAULT_DATA,
        isLoading: false,
        error: null,
      } as any)

      renderHook(() => useVaults())

      const queryConfig = mockUseQuery.mock.calls[0][0]
      expect(queryConfig.refetchInterval).toBe(10000)
    })
  })
})
