import { useQuery } from "@tanstack/react-query"
import {
  createPublicClient,
  http,
  parseAbiItem,
  formatUnits,
  Address,
} from "viem"
import { plume } from "./wagmi"

const publicClient = createPublicClient({
  chain: plume,
  transport: http(),
})

export interface Transaction {
  transactionId: string
  from: string
  to: string
  amount: string
  date: string
  blockNumber: bigint
  vault: "alphaAddress" | "treasuryAddress"
}

export const useTransactions = (
  userAddress?: Address,
  vaultAddresses?: {
    alphaAddress: Address
    treasuryAddress: Address
  },
  decimals?: number
) => {
  const {
    data: transactions = [],
    isLoading: transactionsLoading,
    error: transactionsError,
  } = useQuery({
    queryKey: [
      "transactions",
      userAddress,
      vaultAddresses?.alphaAddress,
      vaultAddresses?.treasuryAddress,
    ],
    queryFn: async (): Promise<Transaction[]> => {
      if (
        !userAddress ||
        !vaultAddresses?.alphaAddress ||
        !vaultAddresses?.treasuryAddress ||
        !decimals
      ) {
        return []
      }

      const transactions: Transaction[] = []

      const vaults = [
        {
          address: vaultAddresses.alphaAddress,
          name: "alphaAddress" as const,
        },
        {
          address: vaultAddresses.treasuryAddress,
          name: "treasuryAddress" as const,
        },
      ]

      for (const vault of vaults) {
        try {
          const fromLogs = await publicClient.getLogs({
            address: vault.address,
            event: parseAbiItem(
              "event Transfer(address indexed from, address indexed to, uint256 value)"
            ),
            args: {
              from: userAddress as Address,
            },
            fromBlock: "earliest",
          })

          const toLogs = await publicClient.getLogs({
            address: vault.address,
            event: parseAbiItem(
              "event Transfer(address indexed from, address indexed to, uint256 value)"
            ),
            args: {
              to: userAddress as Address,
            },
            fromBlock: "earliest",
          })

          // Combine and deduplicate logs - where user sends to himself
          const allLogs = [...fromLogs, ...toLogs].filter(
            (log, index, self) =>
              index ===
              self.findIndex((l) => l.transactionHash === log.transactionHash)
          )

          for (const log of allLogs) {
            try {
              const block = await publicClient.getBlock({
                blockNumber: log.blockNumber,
              })

              transactions.push({
                transactionId: `${log.transactionHash.slice(0, 6)}...${log.transactionHash.slice(-4)}`,
                from: `${log.args.from!.slice(0, 6)}...${log.args.from!.slice(-4)}`,
                to: `${log.args.to!.slice(0, 6)}...${log.args.to!.slice(-4)}`,
                amount: formatUnits(log.args.value!, decimals),
                date: new Date(Number(block.timestamp) * 1000).toLocaleString(),
                blockNumber: log.blockNumber,
                vault: vault.name,
              })
            } catch (blockError) {
              console.error("Error fetching block:", blockError)
            }
          }
        } catch (error) {
          console.error(`Error fetching ${vault.name} transactions:`, error)
        }
      }

      // Sort by block number (newest first)
      return transactions.sort((a, b) => Number(b.blockNumber - a.blockNumber))
    },
    enabled:
      !!userAddress &&
      !!vaultAddresses?.alphaAddress &&
      !!vaultAddresses?.treasuryAddress &&
      !!decimals,
    refetchInterval: 60 * 1000, // 1 minute
  })

  return {
    transactions,
    transactionsLoading,
    transactionsError,
  }
}
