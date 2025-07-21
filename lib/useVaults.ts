import { useQuery } from "@tanstack/react-query"
import { Address, erc20Abi, formatUnits } from "viem"
import { useAccount, useReadContract } from "wagmi"

export interface VaultData {
  vaultStatus: string
  slug: string
  image: string
  name: string
  description: string
  tvl: number
  formattedTvl: string
  apy: number
  price: number
  hasBoostedRewards?: boolean
  formattedApy: string
  featuredAssets: Array<{
    title: string
    image: string
    comingSoon?: boolean
  }>
  formattedCooldownDays: string
  estimatedApy?: number
  showLiveApy?: boolean
  isEstimatedApy?: boolean
  ethereum: {
    contractAddress: string
  }

  plume: {
    contractAddress: string
  }
}

export const useVaults = () => {
  const {
    data: vaults,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["vaults"],
    queryFn: async (): Promise<VaultData[]> => {
      const response = await fetch("/api/vaults")
      if (!response.ok) {
        throw new Error("Failed to fetch vault data")
      }
      return response.json()
    },
    refetchInterval: 10000, // refetch every 10 seconds
  })

  const { address: userAddress } = useAccount()

  const alphaVault = vaults?.find((vault) => vault.name === "Nest Alpha Vault")
  const treasuryVault = vaults?.find(
    (vault) => vault.name === "Nest Treasury Vault"
  )

  const alphaAddress = alphaVault?.plume?.contractAddress as Address
  const treasuryAddress = treasuryVault?.plume.contractAddress as Address

  // Read nALPHA decimals /  nTBILL decimals - same as they are both NEST token
  const { data: decimals } = useReadContract({
    address: alphaAddress,
    abi: erc20Abi,
    functionName: "decimals",
    query: {
      enabled: !!alphaAddress,
    },
  })

  // Read nALPHA balance
  const { data: alphaBalance, isLoading: alphaLoading } = useReadContract({
    address: alphaAddress,
    abi: erc20Abi,
    functionName: "balanceOf",
    args: [userAddress!],
    query: {
      enabled: !!alphaAddress && !!userAddress,
    },
  })

  // Read nTBILL balance
  const { data: treasuryBalance, isLoading: treasuryLoading } = useReadContract(
    {
      address: treasuryAddress,
      abi: erc20Abi,
      functionName: "balanceOf",
      args: [userAddress!],
      query: {
        enabled: !!treasuryAddress && !!userAddress,
      },
    }
  )

  const alphaPrice = alphaVault?.price
  const treasuryPrice = treasuryVault?.price

  // Calculate total token balance (sum of both vaults)
  const totalRawBalance = (alphaBalance || 0n) + (treasuryBalance || 0n)
  const totalTokenBalance = decimals
    ? formatUnits(totalRawBalance, decimals)
    : "0"

  // Calculate total USD value using live prices
  const totalBalanceUSD =
    alphaPrice && treasuryPrice && decimals && alphaBalance && treasuryBalance
      ? (
          parseFloat(formatUnits(alphaBalance, decimals)) * alphaPrice +
          parseFloat(formatUnits(treasuryBalance, decimals)) * treasuryPrice
        ).toFixed(2)
      : "0"

  const balanceLoading =
    !userAddress ||
    alphaLoading ||
    treasuryLoading ||
    !decimals ||
    !alphaPrice ||
    !treasuryPrice ||
    isLoading

  return {
    vaultLoading: isLoading,
    totalTokenBalance,
    totalBalanceUSD,
    balanceLoading,
    vaultError: error,
    addresses: {
      alphaAddress,
      treasuryAddress,
    },
    decimals,
  }
}
