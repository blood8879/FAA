// FAA calculation metrics
export interface AssetMetrics {
  ticker: string
  momentum: number
  volatility: number
  correlation: number
  weightedScore: number
  // Rank fields (1 = best)
  momentumRank?: number
  volatilityRank?: number
  correlationRank?: number
}

// Selected asset with allocation decision
export interface SelectedAsset {
  ticker: string
  metrics: AssetMetrics
  allocation: string // Ticker symbol or "CASH"
  rank: number
}

// Purchase calculation result
export interface PurchaseAllocation {
  ticker: string
  currentPrice: number
  shares: number
  usdAmount: number
  percentage: number
}

// Currency type for purchase calculator
export type Currency = 'KRW' | 'USD'
