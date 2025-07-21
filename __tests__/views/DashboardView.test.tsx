import React from "react"
import { render, screen } from "../utils/test-utils"
import { useRouter } from "next/navigation"
import { useAccount } from "wagmi"
import { useTransactions } from "../../lib/useTransactions"
import { useVaults } from "../../lib/useVaults"
import DashboardView from "../../views/DashboardView"
// Mock addresses for testing
const MOCK_ADDRESSES = {
  USER: "0x1234567890123456789012345678901234567890" as const,
  ALPHA_VAULT: "0xalpha1234567890123456789012345678901234567890" as const,
  TREASURY_VAULT: "0xtreasury1234567890123456789012345678901234567890" as const,
}

// Mock wagmi hooks
jest.mock("wagmi", () => ({
  useAccount: jest.fn(),
}))

// Mock custom hooks
jest.mock("../../lib/useVaults", () => ({
  useVaults: jest.fn(),
}))

jest.mock("../../lib/useTransactions", () => ({
  useTransactions: jest.fn(),
}))

// Mock Next.js router
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}))

describe("DashboardView Component", () => {
  const mockPush = jest.fn()
  const mockUseAccount = useAccount as jest.MockedFunction<typeof useAccount>
  const mockUseVaults = useVaults as jest.MockedFunction<typeof useVaults>
  const mockUseTransactions = useTransactions as jest.MockedFunction<
    typeof useTransactions
  >
  const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>

  const mockConnectedAccount = {
    isConnected: true,
    address: MOCK_ADDRESSES.USER,
  }

  const mockSuccessfulVaults = {
    vaultLoading: false,
    totalTokenBalance: "3",
    totalBalanceUSD: "3.01",
    balanceLoading: false,
    vaultError: null,
    addresses: {
      alphaAddress: MOCK_ADDRESSES.ALPHA_VAULT,
      treasuryAddress: MOCK_ADDRESSES.TREASURY_VAULT,
    },
    decimals: 18,
  }

  const mockSuccessfulTransactions = {
    transactions: [
      {
        transactionId: "0xtxha...4567",
        from: "0x1234...7890",
        to: "0xalph...7890",
        amount: "0.5000",
        date: "7/21/2025, 10:00:00 AM",
        blockNumber: BigInt(1000),
        vault: "alphaAddress" as const,
      },
      {
        transactionId: "0xtxhb...8901",
        from: "0xtreasury...7890",
        to: "0x1234...7890",
        amount: "1.5000",
        date: "7/21/2025, 9:00:00 AM",
        blockNumber: BigInt(999),
        vault: "treasuryAddress" as const,
      },
    ],
    transactionsLoading: false,
    transactionsError: null,
  }

  beforeEach(() => {
    mockUseRouter.mockReturnValue({
      push: mockPush,
      replace: jest.fn(),
      refresh: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
    } as any)

    jest.clearAllMocks()
  })

  describe("Authentication Guard", () => {
    it("should redirect to home when not connected", () => {
      mockUseAccount.mockReturnValue({
        isConnected: false,
        address: undefined,
      } as any)

      // Mock other hooks to prevent undefined destructuring
      mockUseVaults.mockReturnValue(mockSuccessfulVaults as any)
      mockUseTransactions.mockReturnValue(mockSuccessfulTransactions as any)

      const { container } = render(<DashboardView />)

      expect(mockPush).toHaveBeenCalledWith("/")
      expect(container.firstChild).toBeNull()
    })

    it("should redirect when address is missing", () => {
      mockUseAccount.mockReturnValue({
        isConnected: true,
        address: undefined,
      } as any)

      // Mock other hooks to prevent undefined destructuring
      mockUseVaults.mockReturnValue(mockSuccessfulVaults as any)
      mockUseTransactions.mockReturnValue(mockSuccessfulTransactions as any)

      const { container } = render(<DashboardView />)

      expect(mockPush).toHaveBeenCalledWith("/")
      expect(container.firstChild).toBeNull()
    })

    it("should render dashboard when properly connected", () => {
      mockUseAccount.mockReturnValue(mockConnectedAccount as any)
      mockUseVaults.mockReturnValue(mockSuccessfulVaults as any)
      mockUseTransactions.mockReturnValue(mockSuccessfulTransactions as any)

      render(<DashboardView />)

      expect(mockPush).not.toHaveBeenCalled()
      expect(screen.getByText("Your Nest Balance")).toBeInTheDocument()
    })
  })

  describe("Loading States", () => {
    beforeEach(() => {
      mockUseAccount.mockReturnValue(mockConnectedAccount as any)
      mockUseTransactions.mockReturnValue(mockSuccessfulTransactions as any)
    })

    it("should show vault loading state", () => {
      mockUseVaults.mockReturnValue({
        ...mockSuccessfulVaults,
        vaultLoading: true,
      } as any)

      render(<DashboardView />)

      expect(screen.getByText("Loading vault data...")).toBeInTheDocument()
      expect(screen.getByRole("status")).toBeInTheDocument()
    })

    it("should show loading spinner during vault fetch", () => {
      mockUseVaults.mockReturnValue({
        ...mockSuccessfulVaults,
        vaultLoading: true,
      } as any)

      render(<DashboardView />)

      const spinner = screen.getByRole("status")
      expect(spinner).toHaveClass("animate-spin")
    })

    it("should show balance loading state", () => {
      mockUseVaults.mockReturnValue({
        ...mockSuccessfulVaults,
        balanceLoading: true,
      } as any)

      render(<DashboardView />)

      expect(screen.getByText("Loading...")).toBeInTheDocument()
      expect(screen.getByText("Loading USD value...")).toBeInTheDocument()
    })

    it("should show transaction loading state", () => {
      mockUseVaults.mockReturnValue(mockSuccessfulVaults as any)
      mockUseTransactions.mockReturnValue({
        ...mockSuccessfulTransactions,
        transactionsLoading: true,
      } as any)

      render(<DashboardView />)

      expect(screen.getByText("Loading transactions...")).toBeInTheDocument()
    })
  })

  describe("Error States", () => {
    beforeEach(() => {
      mockUseAccount.mockReturnValue(mockConnectedAccount as any)
      mockUseTransactions.mockReturnValue(mockSuccessfulTransactions as any)
    })

    it("should show vault error state", () => {
      mockUseVaults.mockReturnValue({
        ...mockSuccessfulVaults,
        vaultError: new Error("Failed to load vault data"),
      } as any)

      render(<DashboardView />)

      expect(screen.getByText("Failed to load vault data")).toBeInTheDocument()
      expect(
        screen.getByText("Please refresh the page to try again")
      ).toBeInTheDocument()
    })

    it("should show transaction error state", () => {
      mockUseVaults.mockReturnValue(mockSuccessfulVaults as any)
      mockUseTransactions.mockReturnValue({
        ...mockSuccessfulTransactions,
        transactionsError: new Error("Failed to load transactions"),
      } as any)

      render(<DashboardView />)

      expect(
        screen.getByText("Failed to load transactions")
      ).toBeInTheDocument()
      expect(
        screen.getByText("Please try refreshing the page")
      ).toBeInTheDocument()
    })
  })

  describe("Successful Data Display", () => {
    beforeEach(() => {
      mockUseAccount.mockReturnValue(mockConnectedAccount as any)
      mockUseVaults.mockReturnValue(mockSuccessfulVaults as any)
      mockUseTransactions.mockReturnValue(mockSuccessfulTransactions as any)
    })

    it("should display user address in navigation", () => {
      render(<DashboardView />)

      // Check navigation area specifically to avoid transaction table conflicts
      const nav = screen.getByRole("navigation")
      expect(nav).toHaveTextContent("0x1234...7890")
    })

    it("should display Nest logo in navigation", () => {
      render(<DashboardView />)

      const logo = screen.getByAltText("Nest Icon")
      expect(logo).toBeInTheDocument()
      expect(logo).toHaveAttribute("src", "/logo.png")
    })

    it("should display wallet icon in navigation", () => {
      render(<DashboardView />)

      const walletIcon = screen.getByAltText("wallet")
      expect(walletIcon).toBeInTheDocument()
      expect(walletIcon).toHaveAttribute("src", "/wallet.png")
    })

    it("should display total token balance", () => {
      render(<DashboardView />)

      expect(screen.getByText("3.0000")).toBeInTheDocument()
    })

    it("should display total USD value", () => {
      render(<DashboardView />)

      expect(screen.getByText("$3.01")).toBeInTheDocument()
    })

    it("should display balance section title", () => {
      render(<DashboardView />)

      expect(screen.getByText("Your Nest Balance")).toBeInTheDocument()
    })

    it("should display transaction history title", () => {
      render(<DashboardView />)

      expect(screen.getByText("Transaction history")).toBeInTheDocument()
    })
  })

  describe("Transaction Table", () => {
    beforeEach(() => {
      mockUseAccount.mockReturnValue(mockConnectedAccount as any)
      mockUseVaults.mockReturnValue(mockSuccessfulVaults as any)
    })

    it("should display transaction table headers", () => {
      mockUseTransactions.mockReturnValue(mockSuccessfulTransactions as any)

      render(<DashboardView />)

      expect(screen.getByText("Transaction")).toBeInTheDocument()
      expect(screen.getByText("From")).toBeInTheDocument()
      expect(screen.getByText("To")).toBeInTheDocument()
      expect(screen.getByText("Amount")).toBeInTheDocument()
      expect(screen.getByText("Date & Time")).toBeInTheDocument()
    })

    it("should display transaction data correctly", () => {
      mockUseTransactions.mockReturnValue(mockSuccessfulTransactions as any)

      render(<DashboardView />)

      expect(screen.getByText("0xtxha...4567")).toBeInTheDocument()
      expect(screen.getAllByText("0x1234...7890")).toHaveLength(3) // Nav + 2 transaction table entries
      expect(screen.getByText("0xalph...7890")).toBeInTheDocument()
      expect(screen.getByText("0.5000")).toBeInTheDocument()
      expect(screen.getByText("7/21/2025, 10:00:00 AM")).toBeInTheDocument()
    })

    it("should show empty state when no transactions", () => {
      mockUseTransactions.mockReturnValue({
        transactions: [],
        transactionsLoading: false,
        transactionsError: null,
      } as any)

      render(<DashboardView />)

      expect(screen.getByText("No transactions found")).toBeInTheDocument()
      expect(
        screen.getByText("Your transaction history will appear here")
      ).toBeInTheDocument()
    })

    it("should handle multiple transactions", () => {
      mockUseTransactions.mockReturnValue(mockSuccessfulTransactions as any)

      render(<DashboardView />)

      // Should display both transactions
      expect(screen.getByText("0xtxha...4567")).toBeInTheDocument()
      expect(screen.getByText("0xtxhb...8901")).toBeInTheDocument()
    })

    it("should format transaction amounts correctly", () => {
      mockUseTransactions.mockReturnValue(mockSuccessfulTransactions as any)

      render(<DashboardView />)

      expect(screen.getByText("0.5000")).toBeInTheDocument()
      expect(screen.getByText("1.5000")).toBeInTheDocument()
    })
  })

  describe("Address Formatting", () => {
    beforeEach(() => {
      mockUseAccount.mockReturnValue(mockConnectedAccount as any)
      mockUseVaults.mockReturnValue(mockSuccessfulVaults as any)
      mockUseTransactions.mockReturnValue(mockSuccessfulTransactions as any)
    })

    it("should format user address correctly in navigation", () => {
      render(<DashboardView />)

      // Address should be truncated: 0x1234567890123456789012345678901234567890 -> 0x1234...7890
      const nav = screen.getByRole("navigation")
      expect(nav).toHaveTextContent("0x1234...7890")
    })
  })

  describe("Responsive Design", () => {
    beforeEach(() => {
      mockUseAccount.mockReturnValue(mockConnectedAccount as any)
      mockUseVaults.mockReturnValue(mockSuccessfulVaults as any)
      mockUseTransactions.mockReturnValue(mockSuccessfulTransactions as any)
    })

    it("should have responsive navigation classes", () => {
      render(<DashboardView />)

      const nav = screen.getByRole("navigation")
      expect(nav).toHaveClass("fixed", "top-6", "right-2", "left-2")
    })

    it("should have responsive content container", () => {
      render(<DashboardView />)

      const container = screen
        .getByText("Your Nest Balance")
        .closest(".mx-auto")
      expect(container).toHaveClass("mx-auto", "max-w-3xl")
    })

    it("should have responsive table wrapper", () => {
      mockUseTransactions.mockReturnValue(mockSuccessfulTransactions as any)

      render(<DashboardView />)

      const table = screen.getByRole("table")
      expect(table.parentElement).toHaveClass("overflow-x-auto")
      expect(table).toHaveClass("min-w-[600px]")
    })
  })

  describe("Data Integration", () => {
    beforeEach(() => {
      mockUseAccount.mockReturnValue(mockConnectedAccount as any)
    })

    it("should pass correct parameters to useVaults", () => {
      mockUseVaults.mockReturnValue(mockSuccessfulVaults as any)
      mockUseTransactions.mockReturnValue(mockSuccessfulTransactions as any)

      render(<DashboardView />)

      expect(mockUseVaults).toHaveBeenCalledWith()
    })

    it("should pass correct parameters to useTransactions", () => {
      mockUseVaults.mockReturnValue(mockSuccessfulVaults as any)
      mockUseTransactions.mockReturnValue(mockSuccessfulTransactions as any)

      render(<DashboardView />)

      expect(mockUseTransactions).toHaveBeenCalledWith(
        MOCK_ADDRESSES.USER,
        {
          alphaAddress: MOCK_ADDRESSES.ALPHA_VAULT,
          treasuryAddress: MOCK_ADDRESSES.TREASURY_VAULT,
        },
        18
      )
    })

    it("should handle missing vault addresses in useTransactions", () => {
      mockUseVaults.mockReturnValue({
        ...mockSuccessfulVaults,
        addresses: {
          alphaAddress: undefined,
          treasuryAddress: undefined,
        },
      } as any)

      render(<DashboardView />)

      expect(mockUseTransactions).toHaveBeenCalledWith(
        MOCK_ADDRESSES.USER,
        {
          alphaAddress: undefined,
          treasuryAddress: undefined,
        },
        18
      )
    })
  })

  describe("Error Recovery", () => {
    beforeEach(() => {
      mockUseAccount.mockReturnValue(mockConnectedAccount as any)
    })

    it("should handle partial data loading gracefully", () => {
      mockUseVaults.mockReturnValue({
        ...mockSuccessfulVaults,
        balanceLoading: true,
      } as any)

      mockUseTransactions.mockReturnValue({
        ...mockSuccessfulTransactions,
        transactionsLoading: true,
      } as any)

      render(<DashboardView />)

      // Should show loading states for both sections
      expect(screen.getByText("Loading...")).toBeInTheDocument()
      expect(screen.getByText("Loading transactions...")).toBeInTheDocument()
    })

    it("should handle simultaneous errors", () => {
      mockUseVaults.mockReturnValue({
        ...mockSuccessfulVaults,
        vaultError: new Error("Vault error"),
      } as any)

      mockUseTransactions.mockReturnValue({
        ...mockSuccessfulTransactions,
        transactionsError: new Error("Transaction error"),
      } as any)

      render(<DashboardView />)

      // Should prioritize vault error since it prevents rendering
      expect(screen.getByText("Failed to load vault data")).toBeInTheDocument()
    })
  })

  describe("Accessibility", () => {
    beforeEach(() => {
      mockUseAccount.mockReturnValue(mockConnectedAccount as any)
      mockUseVaults.mockReturnValue(mockSuccessfulVaults as any)
      mockUseTransactions.mockReturnValue(mockSuccessfulTransactions as any)
    })

    it("should have accessible navigation", () => {
      render(<DashboardView />)

      const nav = screen.getByRole("navigation")
      expect(nav).toBeInTheDocument()
    })

    it("should have accessible table structure", () => {
      render(<DashboardView />)

      const table = screen.getByRole("table")
      const headers = screen.getAllByRole("columnheader")

      expect(table).toBeInTheDocument()
      expect(headers).toHaveLength(5)
    })

    it("should have accessible loading indicators", () => {
      mockUseVaults.mockReturnValue({
        ...mockSuccessfulVaults,
        vaultLoading: true,
      } as any)

      render(<DashboardView />)

      const loadingSpinner = screen.getByRole("status")
      expect(loadingSpinner).toBeInTheDocument()
    })

    it("should have accessible image alt text", () => {
      render(<DashboardView />)

      expect(screen.getByAltText("Nest Icon")).toBeInTheDocument()
      expect(screen.getByAltText("wallet")).toBeInTheDocument()
    })
  })
})
