import { renderHook } from "@testing-library/react"
import { useQuery } from "@tanstack/react-query"
import { useTransactions } from "../../hooks/useTransactions"

// Mock addresses for testing
const MOCK_ADDRESSES = {
  USER: "0x1234567890123456789012345678901234567890" as const,
  ALPHA_VAULT: "0xalpha1234567890123456789012345678901234567890" as const,
  TREASURY_VAULT: "0xtreasury1234567890123456789012345678901234567890" as const,
}

// Mock React Query
jest.mock("@tanstack/react-query", () => ({
  useQuery: jest.fn(),
}))

// Mock the entire viem module to prevent publicClient creation issues
jest.mock("viem", () => ({
  createPublicClient: jest.fn(() => ({
    getLogs: jest.fn(),
    getBlock: jest.fn(),
  })),
  http: jest.fn(),
  parseAbiItem: jest.fn(),
  formatUnits: jest.fn(),
}))

// Mock Wagmi import
jest.mock("../../lib/wagmi", () => ({
  plume: {
    id: 98866,
    name: "Plume Mainnet",
  },
}))

describe("useTransactions Hook", () => {
  const mockUseQuery = useQuery as jest.MockedFunction<typeof useQuery>

  const defaultParams = {
    userAddress: MOCK_ADDRESSES.USER,
    vaultAddresses: {
      alphaAddress: MOCK_ADDRESSES.ALPHA_VAULT,
      treasuryAddress: MOCK_ADDRESSES.TREASURY_VAULT,
    },
    decimals: 18,
  }

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe("successful transaction fetching", () => {
    it("should return empty transactions when successful", () => {
      mockUseQuery.mockReturnValue({
        data: [],
        isLoading: false,
        error: null,
      } as any)

      const { result } = renderHook(() =>
        useTransactions(
          defaultParams.userAddress,
          defaultParams.vaultAddresses,
          defaultParams.decimals
        )
      )

      expect(result.current.transactions).toEqual([])
      expect(result.current.transactionsLoading).toBe(false)
      expect(result.current.transactionsError).toBeNull()
    })

    it("should use correct query key with all parameters", () => {
      mockUseQuery.mockReturnValue({
        data: [],
        isLoading: false,
        error: null,
      } as any)

      renderHook(() =>
        useTransactions(
          defaultParams.userAddress,
          defaultParams.vaultAddresses,
          defaultParams.decimals
        )
      )

      expect(mockUseQuery).toHaveBeenCalledWith({
        queryKey: [
          "transactions",
          MOCK_ADDRESSES.USER,
          MOCK_ADDRESSES.ALPHA_VAULT,
          MOCK_ADDRESSES.TREASURY_VAULT,
        ],
        queryFn: expect.any(Function),
        enabled: true,
        refetchInterval: 60000,
      })
    })

    it("should format transaction data correctly", () => {
      const mockTransactions = [
        {
          transactionId: "0xtxha...4567",
          from: "0x1234...7890",
          to: "0xalph...7890",
          amount: "0.5",
          date: expect.any(String),
          blockNumber: BigInt(1000),
          vault: "alphaAddress",
        },
      ]

      mockUseQuery.mockReturnValue({
        data: mockTransactions,
        isLoading: false,
        error: null,
      } as any)

      const { result } = renderHook(() =>
        useTransactions(
          defaultParams.userAddress,
          defaultParams.vaultAddresses,
          defaultParams.decimals
        )
      )

      expect(result.current.transactions).toEqual(mockTransactions)
    })
  })

  describe("loading states", () => {
    it("should show loading when query is loading", () => {
      mockUseQuery.mockReturnValue({
        data: undefined,
        isLoading: true,
        error: null,
      } as any)

      const { result } = renderHook(() =>
        useTransactions(
          defaultParams.userAddress,
          defaultParams.vaultAddresses,
          defaultParams.decimals
        )
      )

      expect(result.current.transactionsLoading).toBe(true)
    })

    it("should return empty array when loading", () => {
      mockUseQuery.mockReturnValue({
        data: undefined,
        isLoading: true,
        error: null,
      } as any)

      const { result } = renderHook(() =>
        useTransactions(
          defaultParams.userAddress,
          defaultParams.vaultAddresses,
          defaultParams.decimals
        )
      )

      expect(result.current.transactions).toEqual([])
    })
  })

  describe("error handling", () => {
    it("should handle query errors", () => {
      const mockError = new Error("Failed to fetch transactions")
      mockUseQuery.mockReturnValue({
        data: undefined,
        isLoading: false,
        error: mockError,
      } as any)

      const { result } = renderHook(() =>
        useTransactions(
          defaultParams.userAddress,
          defaultParams.vaultAddresses,
          defaultParams.decimals
        )
      )

      expect(result.current.transactionsError).toBe(mockError)
      expect(result.current.transactions).toEqual([])
    })
  })

  describe("parameter validation", () => {
    it("should be disabled when userAddress is missing", () => {
      mockUseQuery.mockReturnValue({
        data: [],
        isLoading: false,
        error: null,
      } as any)

      renderHook(() =>
        useTransactions(
          undefined,
          defaultParams.vaultAddresses,
          defaultParams.decimals
        )
      )

      expect(mockUseQuery).toHaveBeenCalledWith({
        queryKey: [
          "transactions",
          undefined,
          MOCK_ADDRESSES.ALPHA_VAULT,
          MOCK_ADDRESSES.TREASURY_VAULT,
        ],
        queryFn: expect.any(Function),
        enabled: false,
        refetchInterval: 60000,
      })
    })

    it("should be disabled when vault addresses are missing", () => {
      mockUseQuery.mockReturnValue({
        data: [],
        isLoading: false,
        error: null,
      } as any)

      renderHook(() =>
        useTransactions(
          defaultParams.userAddress,
          undefined,
          defaultParams.decimals
        )
      )

      expect(mockUseQuery).toHaveBeenCalledWith({
        queryKey: ["transactions", MOCK_ADDRESSES.USER, undefined, undefined],
        queryFn: expect.any(Function),
        enabled: false,
        refetchInterval: 60000,
      })
    })

    it("should be disabled when decimals is missing", () => {
      mockUseQuery.mockReturnValue({
        data: [],
        isLoading: false,
        error: null,
      } as any)

      renderHook(() =>
        useTransactions(
          defaultParams.userAddress,
          defaultParams.vaultAddresses,
          undefined
        )
      )

      expect(mockUseQuery).toHaveBeenCalledWith({
        queryKey: [
          "transactions",
          MOCK_ADDRESSES.USER,
          MOCK_ADDRESSES.ALPHA_VAULT,
          MOCK_ADDRESSES.TREASURY_VAULT,
        ],
        queryFn: expect.any(Function),
        enabled: false,
        refetchInterval: 60000,
      })
    })

    it("should return empty array when disabled", () => {
      mockUseQuery.mockReturnValue({
        data: [],
        isLoading: false,
        error: null,
      } as any)

      const { result } = renderHook(() =>
        useTransactions(
          undefined,
          defaultParams.vaultAddresses,
          defaultParams.decimals
        )
      )

      expect(result.current.transactions).toEqual([])
    })
  })

  describe("query configuration", () => {
    it("should use correct refetch interval", () => {
      mockUseQuery.mockReturnValue({
        data: [],
        isLoading: false,
        error: null,
      } as any)

      renderHook(() =>
        useTransactions(
          defaultParams.userAddress,
          defaultParams.vaultAddresses,
          defaultParams.decimals
        )
      )

      const queryConfig = mockUseQuery.mock.calls[0][0]
      expect(queryConfig.refetchInterval).toBe(60000)
    })

    it("should be enabled when all parameters are provided", () => {
      mockUseQuery.mockReturnValue({
        data: [],
        isLoading: false,
        error: null,
      } as any)

      renderHook(() =>
        useTransactions(
          defaultParams.userAddress,
          defaultParams.vaultAddresses,
          defaultParams.decimals
        )
      )

      const queryConfig = mockUseQuery.mock.calls[0][0]
      expect(queryConfig.enabled).toBe(true)
    })
  })

  describe("hook interface", () => {
    it("should return correct interface structure", () => {
      mockUseQuery.mockReturnValue({
        data: [],
        isLoading: false,
        error: null,
      } as any)

      const { result } = renderHook(() =>
        useTransactions(
          defaultParams.userAddress,
          defaultParams.vaultAddresses,
          defaultParams.decimals
        )
      )

      expect(result.current).toHaveProperty("transactions")
      expect(result.current).toHaveProperty("transactionsLoading")
      expect(result.current).toHaveProperty("transactionsError")
      expect(Array.isArray(result.current.transactions)).toBe(true)
      expect(typeof result.current.transactionsLoading).toBe("boolean")
    })

    it("should handle transaction data with correct types", () => {
      const mockTransactions = [
        {
          transactionId: "0xtx123...abc",
          from: "0x123...def",
          to: "0xabc...123",
          amount: "1.5",
          date: "1/1/2024, 12:00:00 PM",
          blockNumber: BigInt(12345),
          vault: "alphaAddress" as const,
        },
      ]

      mockUseQuery.mockReturnValue({
        data: mockTransactions,
        isLoading: false,
        error: null,
      } as any)

      const { result } = renderHook(() =>
        useTransactions(
          defaultParams.userAddress,
          defaultParams.vaultAddresses,
          defaultParams.decimals
        )
      )

      expect(result.current.transactions).toEqual(mockTransactions)
      expect(result.current.transactions[0]).toMatchObject({
        transactionId: expect.any(String),
        from: expect.any(String),
        to: expect.any(String),
        amount: expect.any(String),
        date: expect.any(String),
        blockNumber: expect.any(BigInt),
        vault: expect.stringMatching(/^(alphaAddress|treasuryAddress)$/),
      })
    })
  })
})
