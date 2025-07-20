"use client"

import Image from "next/image"
import { useAccount, useReadContract } from "wagmi"
import { useRouter } from "next/navigation"
import { erc20Abi, formatUnits } from "viem"
import { useVaults } from "../lib/useVaults"

const MOCK_TRANSACTIONS = [
  {
    transactionId: "0x3cdd...a0b7",
    from: "0x5e3f...9b4d",
    to: "0x8631...0bfD",
    amount: "1.50",
    date: "Jul 22, 2025, 4:45 PM",
  },
  {
    transactionId: "0x86bf...f9a8",
    from: "0x772e...c6d1",
    to: "0x8631...0bfD",
    amount: "1.75",
    date: "Jun 15, 2025, 2:30 PM",
  },
  {
    transactionId: "0x6b3c...e4d2",
    from: "0x8631...0bfD",
    to: "0x58de...b5ef",
    amount: "2.00",
    date: "May 10, 2025, 11:15 AM",
  },
  {
    transactionId: "0x5af1...d3e9",
    from: "0x8631...0bfD",
    to: "0x47fa...c9de",
    amount: "1.25",
    date: "Apr 24, 2025, 9:41 AM",
  },
  {
    transactionId: "0x5af1...d3b8",
    from: "0x8631...0bfD",
    to: "0x47fa...c9de",
    amount: "1.25",
    date: "Apr 23, 2025, 9:41 AM",
  },
]

const DashboardView: React.FC = () => {
  const { address, isConnected } = useAccount()
  const router = useRouter()

  const {
    addresses,
    prices,
    isLoading: vaultsLoading,
    error: vaultsError,
  } = useVaults()

  // Read nALPHA decimals /  nTBILL decimals - same as its both NEST token
  const { data: decimals } = useReadContract({
    address: addresses.nALPHA as `0x${string}`,
    abi: erc20Abi,
    functionName: "decimals",
    query: {
      enabled: !!addresses.nALPHA,
    },
  })

  // Read nALPHA balance
  const { data: alphaBalance, isLoading: alphaLoading } = useReadContract({
    address: addresses.nALPHA as `0x${string}`,
    abi: erc20Abi,
    functionName: "balanceOf",
    args: [address!],
    query: {
      enabled: !!address && !!addresses.nALPHA,
    },
  })

  // Read nTBILL balance
  const { data: treasuryBalance, isLoading: treasuryLoading } = useReadContract(
    {
      address: addresses.nTBILL as `0x${string}`,
      abi: erc20Abi,
      functionName: "balanceOf",
      args: [address!],
      query: {
        enabled: !!address && !!addresses.nTBILL,
      },
    }
  )

  if (!isConnected || !address) {
    router.push("/")
    return null
  }

  // Show loading spinner while fetching vault data
  if (vaultsLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#F9FAFB]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>
          <p className="text-sm text-gray-600">Loading vault data...</p>
        </div>
      </div>
    )
  }

  // Show error if vault data failed to load
  if (vaultsError) {
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

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  // Calculate total token balance (sum of both vaults)
  const totalRawBalance = (alphaBalance || 0n) + (treasuryBalance || 0n)
  const totalTokenBalance = decimals
    ? formatUnits(totalRawBalance, decimals)
    : "0"

  // Calculate total USD value using live prices
  const totalBalanceUSD =
    prices.nALPHA &&
    prices.nTBILL &&
    decimals &&
    alphaBalance &&
    treasuryBalance
      ? (
          parseFloat(formatUnits(alphaBalance, decimals)) * prices.nALPHA +
          parseFloat(formatUnits(treasuryBalance, decimals)) * prices.nTBILL
        ).toFixed(2)
      : "0"

  const balanceLoading =
    alphaLoading ||
    treasuryLoading ||
    !decimals ||
    !prices.nALPHA ||
    !prices.nTBILL

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
              <svg viewBox="0 0 24 24" className="h-full w-full">
                <circle cx="12" cy="12" r="10" fill="#0D9488" />
                <text
                  x="12"
                  y="16"
                  textAnchor="middle"
                  fill="white"
                  fontSize="10"
                  fontWeight="bold"
                >
                  $
                </text>
              </svg>
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
                {MOCK_TRANSACTIONS.map((txn, index) => (
                  <tr key={index}>
                    <td className="py-3 text-sm text-[#09090B] underline">
                      {txn.transactionId}
                    </td>
                    <td className="py-3 text-sm text-[#09090B] underline">
                      {txn.from}
                    </td>
                    <td className="py-3 text-sm text-[#09090B] underline">
                      {txn.to}
                    </td>
                    <td className="py-3 text-sm text-[#09090B]">
                      {txn.amount}
                    </td>
                    <td className="py-3 text-sm text-[#09090B]">{txn.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardView
