import React from "react"
import { render, screen, waitFor, fireEvent } from "../utils/test-utils"
import userEvent from "@testing-library/user-event"
import { useRouter } from "next/navigation"
import { useConnect, useAccount } from "wagmi"
import HomeView from "../../views/HomeView"

// Mock wagmi hooks
jest.mock("wagmi", () => ({
  useConnect: jest.fn(),
  useAccount: jest.fn(),
}))

// Mock wagmi connectors
jest.mock("wagmi/connectors", () => ({
  injected: jest.fn(() => ({ name: "injected" })),
}))

// Mock Next.js router
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}))

describe("HomeView Component", () => {
  const mockPush = jest.fn()
  const mockConnect = jest.fn()

  const mockUseConnect = useConnect as jest.MockedFunction<typeof useConnect>
  const mockUseAccount = useAccount as jest.MockedFunction<typeof useAccount>
  const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>

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

  describe("Initial Render", () => {
    beforeEach(() => {
      mockUseAccount.mockReturnValue({
        isConnected: false,
        address: undefined,
      } as any)

      mockUseConnect.mockReturnValue({
        connect: mockConnect,
        isPending: false,
        error: null,
      } as any)
    })

    it("should render the home page correctly", () => {
      render(<HomeView />)

      expect(
        screen.getByText("Connect your wallet to start using Nest.")
      ).toBeInTheDocument()
      expect(
        screen.getByRole("button", { name: "Connect wallet" })
      ).toBeInTheDocument()
      expect(screen.getByAltText("Nest Icon")).toBeInTheDocument()
    })

    it("should display Nest logo", () => {
      render(<HomeView />)

      const logo = screen.getByAltText("Nest Icon")
      expect(logo).toBeInTheDocument()
      expect(logo).toHaveAttribute("src", "/logo.png")
    })
  })

  describe("Wallet Connection", () => {
    beforeEach(() => {
      mockUseAccount.mockReturnValue({
        isConnected: false,
        address: undefined,
      } as any)
    })

    it("should call connect when connect button is clicked", async () => {
      mockUseConnect.mockReturnValue({
        connect: mockConnect,
        isPending: false,
        error: null,
      } as any)

      const user = userEvent.setup()
      render(<HomeView />)

      const connectButton = screen.getByRole("button", {
        name: "Connect wallet",
      })
      await user.click(connectButton)

      expect(mockConnect).toHaveBeenCalledWith({
        connector: expect.any(Object),
      })
    })

    it("should show loading state while connecting", () => {
      mockUseConnect.mockReturnValue({
        connect: mockConnect,
        isPending: true,
        error: null,
      } as any)

      render(<HomeView />)

      const connectButton = screen.getByRole("button", {
        name: "Connecting...",
      })
      expect(connectButton).toBeInTheDocument()
      expect(connectButton).toBeDisabled()
    })

    it("should disable button while connecting", () => {
      mockUseConnect.mockReturnValue({
        connect: mockConnect,
        isPending: true,
        error: null,
      } as any)

      render(<HomeView />)

      const connectButton = screen.getByRole("button")
      expect(connectButton).toHaveClass("disabled:opacity-50")
      expect(connectButton).toBeDisabled()
    })

    it("should enable button when not connecting", () => {
      mockUseConnect.mockReturnValue({
        connect: mockConnect,
        isPending: false,
        error: null,
      } as any)

      render(<HomeView />)

      const connectButton = screen.getByRole("button", {
        name: "Connect wallet",
      })
      expect(connectButton).toBeEnabled()
    })
  })

  describe("Navigation on Connection", () => {
    it("should redirect to dashboard when wallet is connected", async () => {
      mockUseAccount.mockReturnValue({
        isConnected: true,
        address: "0x1234567890123456789012345678901234567890",
      } as any)

      mockUseConnect.mockReturnValue({
        connect: mockConnect,
        isPending: false,
        error: null,
      } as any)

      render(<HomeView />)

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith("/dashboard")
      })
    })

    it("should not redirect when wallet is not connected", () => {
      mockUseAccount.mockReturnValue({
        isConnected: false,
        address: undefined,
      } as any)

      mockUseConnect.mockReturnValue({
        connect: mockConnect,
        isPending: false,
        error: null,
      } as any)

      render(<HomeView />)

      expect(mockPush).not.toHaveBeenCalled()
    })

    it("should handle connection state changes", async () => {
      const { rerender } = render(<HomeView />)

      // Initially not connected
      mockUseAccount.mockReturnValue({
        isConnected: false,
        address: undefined,
      } as any)

      rerender(<HomeView />)
      expect(mockPush).not.toHaveBeenCalled()

      // Simulate connection
      mockUseAccount.mockReturnValue({
        isConnected: true,
        address: "0x1234567890123456789012345678901234567890",
      } as any)

      rerender(<HomeView />)

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith("/dashboard")
      })
    })
  })

  describe("User Interactions", () => {
    beforeEach(() => {
      mockUseAccount.mockReturnValue({
        isConnected: false,
        address: undefined,
      } as any)

      mockUseConnect.mockReturnValue({
        connect: mockConnect,
        isPending: false,
        error: null,
      } as any)
    })

    it("should prevent double-clicking during connection", async () => {
      mockUseConnect.mockReturnValue({
        connect: mockConnect,
        isPending: true,
        error: null,
      } as any)

      const user = userEvent.setup()
      render(<HomeView />)

      const connectButton = screen.getByRole("button")

      // Try to click multiple times while disabled
      await user.click(connectButton, { pointerEventsCheck: 0 })
      await user.click(connectButton, { pointerEventsCheck: 0 })

      // Should not call connect since button is disabled
      expect(mockConnect).not.toHaveBeenCalled()
    })
  })

  describe("Error States", () => {
    beforeEach(() => {
      mockUseAccount.mockReturnValue({
        isConnected: false,
        address: undefined,
      } as any)
    })

    it("should handle connection errors gracefully", () => {
      const consoleSpy = jest.spyOn(console, "error").mockImplementation()

      mockUseConnect.mockReturnValue({
        connect: mockConnect,
        isPending: false,
        error: new Error("Connection failed"),
      } as any)

      expect(() => render(<HomeView />)).not.toThrow()

      consoleSpy.mockRestore()
    })
  })

  describe("Accessibility", () => {
    beforeEach(() => {
      mockUseAccount.mockReturnValue({
        isConnected: false,
        address: undefined,
      } as any)

      mockUseConnect.mockReturnValue({
        connect: mockConnect,
        isPending: false,
        error: null,
      } as any)
    })

    it("should have accessible button text", () => {
      render(<HomeView />)

      const connectButton = screen.getByRole("button", {
        name: "Connect wallet",
      })
      expect(connectButton).toBeInTheDocument()
    })

    it("should have accessible image alt text", () => {
      render(<HomeView />)

      const logo = screen.getByAltText("Nest Icon")
      expect(logo).toBeInTheDocument()
    })

    it("should have proper heading structure", () => {
      render(<HomeView />)

      // Should have descriptive text for screen readers
      expect(
        screen.getByText("Connect your wallet to start using Nest.")
      ).toBeInTheDocument()
    })

    it("should be keyboard navigable", async () => {
      const user = userEvent.setup()
      render(<HomeView />)

      // Should be able to tab to the button
      await user.tab()
      const connectButton = screen.getByRole("button", {
        name: "Connect wallet",
      })
      expect(connectButton).toHaveFocus()
    })

    it("should have sufficient color contrast", () => {
      render(<HomeView />)

      const connectButton = screen.getByRole("button", {
        name: "Connect wallet",
      })

      // Check that button has dark background and light text for contrast
      expect(connectButton).toHaveClass("bg-[#09090B]", "text-white")
    })
  })

  describe("Responsive Design", () => {
    beforeEach(() => {
      mockUseAccount.mockReturnValue({
        isConnected: false,
        address: undefined,
      } as any)

      mockUseConnect.mockReturnValue({
        connect: mockConnect,
        isPending: false,
        error: null,
      } as any)
    })

    it("should have responsive margin classes", () => {
      render(<HomeView />)

      const card = screen
        .getByText("Connect your wallet to start using Nest.")
        .closest("div")
      expect(card).toHaveClass("mx-4")
    })

    it("should handle different viewport sizes", () => {
      render(<HomeView />)

      // Container should have max width for mobile
      const container = screen
        .getByText("Connect your wallet to start using Nest.")
        .closest("div")
      expect(container).toHaveClass("w-[560px]")
    })
  })
})
