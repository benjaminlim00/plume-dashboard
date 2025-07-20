import { useQuery } from "@tanstack/react-query"

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
      const response = await fetch("https://app.nest.credit/api/vaults")
      if (!response.ok) {
        throw new Error("Failed to fetch vault data")
      }
      return response.json()
    },
    staleTime: 0, // always considered stale
    refetchInterval: 5000, // refetch every 5 seconds
  })

  const alphaVault = vaults?.find((vault) => vault.name === "Nest Alpha Vault")
  const treasuryVault = vaults?.find(
    (vault) => vault.name === "Nest Treasury Vault"
  )

  return {
    vaults: {
      nALPHA: alphaVault,
      nTBILL: treasuryVault,
    },
    addresses: {
      nALPHA: alphaVault?.plume?.contractAddress,
      nTBILL: treasuryVault?.plume?.contractAddress,
    },
    prices: {
      nALPHA: alphaVault?.price,
      nTBILL: treasuryVault?.price,
    },
    isLoading,
    error,
  }
}
