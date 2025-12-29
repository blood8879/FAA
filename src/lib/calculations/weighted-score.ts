import type { AssetMetrics, SelectedAsset } from '@/types/faa'

/**
 * Rank assets by a metric value
 * @param values - Array of metric values
 * @param ascending - true if lower is better (volatility, correlation), false if higher is better (momentum)
 * @returns Array of ranks (1 = best)
 */
function rankValues(values: number[], ascending: boolean): number[] {
  // Create array of [value, originalIndex]
  const indexed = values.map((value, index) => ({ value, index }))

  // Sort by value
  indexed.sort((a, b) => ascending ? a.value - b.value : b.value - a.value)

  // Assign ranks
  const ranks = new Array(values.length)
  for (let i = 0; i < indexed.length; i++) {
    ranks[indexed[i].index] = i + 1 // Rank starts from 1
  }

  return ranks
}

/**
 * Calculate rank-based weighted score for FAA strategy
 * Formula: (momentum_rank × 1.0) + (volatility_rank × 0.5) + (correlation_rank × 0.5)
 *
 * Lower score = better (rank 1 is best)
 *
 * @param assets - Array of assets with momentum, volatility, correlation values
 * @returns Array of assets with calculated weighted scores and ranks
 */
export function calculateRankBasedScores(assets: AssetMetrics[]): AssetMetrics[] {
  if (assets.length === 0) {
    return []
  }

  // Extract metric values
  const momentums = assets.map(a => a.momentum)
  const volatilities = assets.map(a => a.volatility)
  const correlations = assets.map(a => a.correlation)

  // Calculate ranks
  // Momentum: higher is better → descending (rank 1 = highest value)
  // Volatility: lower is better → ascending (rank 1 = lowest value)
  // Correlation: lower is better → ascending (rank 1 = lowest value)
  const momentumRanks = rankValues(momentums, false) // higher is better
  const volatilityRanks = rankValues(volatilities, true) // lower is better
  const correlationRanks = rankValues(correlations, true) // lower is better

  // Calculate weighted scores
  return assets.map((asset, i) => ({
    ...asset,
    momentumRank: momentumRanks[i],
    volatilityRank: volatilityRanks[i],
    correlationRank: correlationRanks[i],
    weightedScore:
      (momentumRanks[i] * 1.0) +
      (volatilityRanks[i] * 0.5) +
      (correlationRanks[i] * 0.5)
  }))
}

/**
 * Select top N assets based on rank-based weighted scores
 * Assets with negative momentum are replaced with CASH
 *
 * @param assets - Array of assets with calculated metrics
 * @param topN - Number of top assets to select (default: 3)
 * @returns Array of selected assets
 */
export function selectTopAssets(
  assets: AssetMetrics[],
  topN: number = 3
): SelectedAsset[] {
  if (assets.length === 0) {
    throw new Error('No assets provided for selection')
  }

  if (topN < 1) {
    throw new Error('topN must be at least 1')
  }

  if (topN > assets.length) {
    throw new Error(`topN (${topN}) cannot exceed number of assets (${assets.length})`)
  }

  // Calculate rank-based scores
  const assetsWithScores = calculateRankBasedScores(assets)

  // Sort by weighted score (ascending - lower is better)
  const sortedAssets = [...assetsWithScores].sort(
    (a, b) => a.weightedScore - b.weightedScore
  )

  // Select top N assets
  const selectedAssets: SelectedAsset[] = sortedAssets
    .slice(0, topN)
    .map((asset, index) => ({
      ticker: asset.ticker,
      metrics: asset,
      allocation: asset.momentum < 0 ? 'CASH' : asset.ticker,
      rank: index + 1,
    }))

  return selectedAssets
}

/**
 * Calculate total cash allocation percentage
 *
 * @param selectedAssets - Array of selected assets
 * @returns Percentage of portfolio allocated to cash (0-100)
 */
export function calculateCashAllocation(selectedAssets: SelectedAsset[]): number {
  if (selectedAssets.length === 0) {
    return 0
  }

  const cashCount = selectedAssets.filter((a) => a.allocation === 'CASH').length
  return (cashCount / selectedAssets.length) * 100
}
