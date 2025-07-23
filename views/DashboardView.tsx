"use client"

import Image from "next/image"
import { useRouter, useSearchParams } from "next/navigation"
import { useAccount } from "wagmi"
import { useTransactions } from "../hooks/useTransactions"
import { useVaults } from "../hooks/useVaults"
import { plume } from "../lib/wagmi"
import { useEffect } from "react"
import Loading from "../components/Loading"

const formatAddress = (addr?: string) => {
  if (!addr) return ""
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`
}

const getExplorerUrl = (type: "tx" | "address", value: string) => {
  return `${plume.blockExplorers.default.url}/${type}/${value}`
}

const DashboardView: React.FC = () => {
  const { address, isConnected } = useAccount()
  const router = useRouter()

  const {
    vaultLoading,
    totalTokenBalance,
    totalBalanceUSD,
    balanceLoading,
    vaultError,
    addresses,
    decimals,
  } = useVaults()

  const { transactions, transactionsLoading, transactionsError } =
    useTransactions(address, addresses, decimals)

  const searchParams = useSearchParams()
  const from = searchParams.get("from")
  const isFromMatrix = from === "matrix"

  useEffect(() => {
    if (!isConnected || !address) {
      router.push("/")
    }
  }, [isConnected, address, router])

  // Show loading spinner while fetching vault data
  if (vaultLoading) {
    if (isFromMatrix) return <Loading />

    return (
      <div className="flex h-screen items-center justify-center bg-[#F9FAFB]">
        <div className="flex flex-col items-center gap-4">
          <div
            className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"
            role="status"
            aria-label="Loading vault data"
          ></div>
          <p className="text-sm text-gray-600">Loading vault data...</p>
        </div>
      </div>
    )
  }

  // Show error if vault data failed to load
  if (vaultError) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#F9FAFB]">
        <div className="text-center">
          <p className="text-sm text-red-600">Failed to load vault data</p>
          <p className="mt-2 text-xs text-gray-500">
            Please refresh the page to try again
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] px-2 md:px-0">
      <nav
        className="fixed top-6 right-2 left-2 flex items-center justify-between rounded-3xl bg-white p-4 md:right-0 md:left-1/2 md:container md:-translate-x-1/2 md:transform"
        style={{
          backdropFilter: "blur(40px)",
        }}
      >
        <div className="flex items-center">
          <Image
            src="/logo.png"
            alt="Nest Icon"
            width={84}
            height={30}
            className="mx-auto"
          />
        </div>
        <div className="flex items-center rounded-lg border border-[#F0F0F0] p-2">
          <Image src="/wallet.png" alt="wallet" width={24} height={24} />
          <span className="ml-2 text-xs font-medium">
            {formatAddress(address!)}
          </span>
        </div>
      </nav>

      {/* Main Content */}
      <div className="mx-auto max-w-3xl pt-[120px] md:pt-[192px]">
        {/* Balance Section */}
        <div
          className="rounded-xl border border-[#E5E7EB] bg-white p-6 text-[#09090B]"
          style={{
            boxShadow: "0px 1px 3px 0px #0000000D",
          }}
        >
          <h3 className="font-medium">Your Nest Balance</h3>

          {/* Total Balance */}
          <div className="mt-4 flex items-center">
            <div className="mr-2 h-6 w-6">
              <Image src="/token.png" alt="Nest token" width={24} height={24} />
            </div>
            <span className="text-3xl font-bold">
              {balanceLoading
                ? "Loading..."
                : parseFloat(totalTokenBalance).toFixed(4)}
            </span>
          </div>

          <p className="mt-2 text-sm text-[#71717A]">
            {balanceLoading ? "Loading USD value..." : `$${totalBalanceUSD}`}
          </p>
        </div>

        {/* Transaction History */}
        <div
          className="mt-8 rounded-xl border border-[#E5E7EB] bg-white p-6 text-[#09090B]"
          style={{
            boxShadow: "0px 1px 3px 0px #0000000D",
          }}
        >
          <h3 className="mb-6 font-medium">Transaction history</h3>

          {transactionsLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="flex items-center gap-3">
                <div
                  className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600"
                  role="status"
                  aria-label="Loading transactions"
                ></div>
                <span className="text-sm text-[#71717A]">
                  Loading transactions...
                </span>
              </div>
            </div>
          ) : transactionsError ? (
            <div className="py-8 text-center">
              <p className="text-sm text-red-600">
                Failed to load transactions
              </p>
              <p className="mt-1 text-xs text-[#71717A]">
                Please try refreshing the page
              </p>
            </div>
          ) : transactions.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-sm text-[#71717A]">No transactions found</p>
              <p className="mt-1 text-xs text-[#71717A]">
                Your transaction history will appear here
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px]">
                <thead>
                  <tr>
                    <th className="w-1/5 py-3 text-left text-sm font-medium text-[#71717A]">
                      Transaction
                    </th>
                    <th className="w-1/5 py-3 text-left text-sm font-medium text-[#71717A]">
                      From
                    </th>
                    <th className="w-1/5 py-3 text-left text-sm font-medium text-[#71717A]">
                      To
                    </th>
                    <th className="w-1/5 py-3 text-left text-sm font-medium text-[#71717A]">
                      Amount
                    </th>
                    <th className="w-1/5 py-3 text-left text-sm font-medium text-[#71717A]">
                      Date & Time
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((txn, index) => (
                    <tr key={`${txn.transactionId}-${index}`}>
                      <td className="py-3 text-sm text-[#09090B]">
                        <a
                          href={getExplorerUrl("tx", txn.transactionId)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="cursor-pointer underline hover:text-blue-600"
                        >
                          {formatAddress(txn.transactionId)}
                        </a>
                      </td>
                      <td className="py-3 text-sm text-[#09090B]">
                        <a
                          href={getExplorerUrl("address", txn.from)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="cursor-pointer underline hover:text-blue-600"
                        >
                          {formatAddress(txn.from)}
                        </a>
                      </td>
                      <td className="py-3 text-sm text-[#09090B]">
                        <a
                          href={getExplorerUrl("address", txn.to)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="cursor-pointer underline hover:text-blue-600"
                        >
                          {formatAddress(txn.to)}
                        </a>
                      </td>
                      <td className="py-3 text-sm text-[#09090B]">
                        {parseFloat(txn.amount).toFixed(4)}
                      </td>
                      <td className="py-3 text-sm text-[#09090B]">
                        {txn.date}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default DashboardView
