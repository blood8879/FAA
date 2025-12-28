import type { AssetMetrics, SelectedAsset } from '@/types/faa'

/**
 * Calculate weighted score for an asset
 * Formula: (momentum × 1.0) + (volatility × 0.5) + (correlation × 0.5)
 *
 * @param momentum - 4-month return
 * @param volatility - Standard deviation of daily returns
 * @param correlation - Average correlation with other assets
 * @returns Weighted score
 */
export function calculateWeightedScore(
  momentum: number,
  volatility: number,
  correlation: number
): number {
  return momentum * 1.0 + volatility * 0.5 + correlation * 0.5
}

/**
 * Select top N assets based on weighted scores
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

  // Sort by weighted score (descending)
  const sortedAssets = [...assets].sort(
    (a, b) => b.weightedScore - a.weightedScore
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
