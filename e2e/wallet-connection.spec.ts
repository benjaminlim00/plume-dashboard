import { test, expect, Page } from "@playwright/test"

// Mock MetaMask functionality for E2E tests
class MockMetaMask {
  private page: Page

  constructor(page: Page) {
    this.page = page
  }

  async setup() {
    // Mock the Ethereum provider
    await this.page.addInitScript(() => {
      // Mock window.ethereum for MetaMask
      ;(window as any).ethereum = {
        isMetaMask: true,
        request: async ({ method }: { method: string }) => {
          switch (method) {
            case "eth_requestAccounts":
              return ["0x1234567890123456789012345678901234567890"]
            case "eth_accounts":
              return ["0x1234567890123456789012345678901234567890"]
            case "eth_chainId":
              return "0x18262" // 98866 in hex (Plume chain ID)
            case "wallet_switchEthereumChain":
              return null
            case "wallet_addEthereumChain":
              return null
            default:
              throw new Error(`Unsupported method: ${method}`)
          }
        },
        on: () => {},
        removeListener: () => {},
      }
    })
  }

  async mockWalletConnection() {
    await this.page.addInitScript(() => {
      // Mock successful wallet connection
      ;(window as any).ethereum.selectedAddress =
        "0x1234567890123456789012345678901234567890"
    })
  }

  async mockWalletError() {
    await this.page.addInitScript(() => {
      ;(window as any).ethereum.request = async () => {
        throw new Error("User rejected the request")
      }
    })
  }

  async mockNetworkSwitch() {
    await this.page.addInitScript(() => {
      ;(window as any).ethereum.request = async ({
        method,
      }: {
        method: string
      }) => {
        if (method === "wallet_switchEthereumChain") {
          // Simulate successful network switch
          return null
        }
        return ["0x1234567890123456789012345678901234567890"]
      }
    })
  }
}

test.describe("Wallet Connection Flow", () => {
  let mockMetaMask: MockMetaMask

  test.beforeEach(async ({ page }) => {
    mockMetaMask = new MockMetaMask(page)
    await mockMetaMask.setup()
  })

  test.describe("Home Page", () => {
    test("should display connect wallet interface", async ({ page }) => {
      await page.goto("/")

      // Check page elements
      await expect(
        page.getByText("Connect your wallet to start using Nest.")
      ).toBeVisible()
      await expect(
        page.getByRole("button", { name: "Connect wallet" })
      ).toBeVisible()
      await expect(page.getByAltText("Nest Icon")).toBeVisible()
    })
  })

  test.describe("Wallet Connection Process", () => {
    test("should connect wallet successfully", async ({ page }) => {
      await mockMetaMask.mockWalletConnection()
      await page.goto("/")

      // Click connect button
      const connectButton = page.getByRole("button", { name: "Connect wallet" })
      await connectButton.click()

      // Should redirect to dashboard
      await expect(page).toHaveURL("/dashboard")
    })

    test("should handle connection errors gracefully", async ({ page }) => {
      await mockMetaMask.mockWalletError()
      await page.goto("/")

      const connectButton = page.getByRole("button", { name: "Connect wallet" })
      await connectButton.click()

      // Should remain on home page after error
      await expect(page).toHaveURL("/")
      await expect(connectButton).toBeVisible()
    })
  })

  test.describe("Dashboard Page", () => {
    test.beforeEach(async ({ page }) => {
      await mockMetaMask.mockWalletConnection()

      // Mock API responses
      await page.route("/api/vaults", async (route) => {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify([
            {
              name: "Nest Alpha Vault",
              price: 1.05,
              plume: { contractAddress: "0xalpha123" },
            },
            {
              name: "Nest Treasury Vault",
              price: 0.98,
              plume: { contractAddress: "0xtreasury123" },
            },
          ]),
        })
      })

      // Navigate to dashboard
      await page.goto("/")
      await page.getByRole("button", { name: "Connect wallet" }).click()
      await expect(page).toHaveURL("/dashboard")
    })

    test("should handle vault loading states", async ({ page }) => {
      // Mock slow API response
      await page.route("/api/vaults", async (route) => {
        await new Promise((resolve) => setTimeout(resolve, 2000))
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify([]),
        })
      })

      await page.reload()

      // Should show loading spinner
      await expect(page.getByText("Loading vault data...")).toBeVisible()
      await expect(page.locator(".animate-spin")).toBeVisible()
    })

    test("should redirect unauthenticated users", async ({ page }) => {
      // Clear wallet connection
      await page.addInitScript(() => {
        ;(window as any).ethereum.selectedAddress = null
        localStorage.removeItem("wagmi.connected")
      })

      await page.goto("/dashboard")

      // Should redirect to home
      await expect(page).toHaveURL("/")
    })
  })

  test.describe("Responsive Design", () => {
    test("should work on mobile devices", async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 }) // iPhone SE
      await page.goto("/")

      // Should show mobile-optimized layout
      await expect(
        page.getByText("Connect your wallet to start using Nest.")
      ).toBeVisible()
      await expect(
        page.getByRole("button", { name: "Connect wallet" })
      ).toBeVisible()

      // Connect wallet
      await mockMetaMask.mockWalletConnection()
      await page.getByRole("button", { name: "Connect wallet" }).click()
      await expect(page).toHaveURL("/dashboard")

      // Check mobile dashboard layout
      await expect(page.getByText("Your Nest Balance")).toBeVisible()
    })

    test("should work on tablet devices", async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 }) // iPad
      await page.goto("/")

      await expect(
        page.getByText("Connect your wallet to start using Nest.")
      ).toBeVisible()

      await mockMetaMask.mockWalletConnection()
      await page.getByRole("button", { name: "Connect wallet" }).click()
      await expect(page).toHaveURL("/dashboard")
    })

    test("should work on desktop", async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 })
      await page.goto("/")

      await expect(
        page.getByText("Connect your wallet to start using Nest.")
      ).toBeVisible()

      await mockMetaMask.mockWalletConnection()
      await page.getByRole("button", { name: "Connect wallet" }).click()
      await expect(page).toHaveURL("/dashboard")
    })
  })

  test.describe("Accessibility", () => {
    test("should be keyboard navigable", async ({ page }) => {
      await page.goto("/")

      // Tab to connect button
      await page.keyboard.press("Tab")
      await expect(
        page.getByRole("button", { name: "Connect wallet" })
      ).toBeFocused()

      // Activate with Enter
      await mockMetaMask.mockWalletConnection()
      await page.keyboard.press("Enter")
      await expect(page).toHaveURL("/dashboard")
    })

    test("should have proper ARIA labels", async ({ page }) => {
      await page.goto("/")

      const connectButton = page.getByRole("button", { name: "Connect wallet" })
      await expect(connectButton).toBeVisible()

      const logo = page.getByAltText("Nest Icon")
      await expect(logo).toBeVisible()
    })
  })
})
