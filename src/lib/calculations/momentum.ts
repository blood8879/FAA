import type { HistoricalDataPoint } from '@/types/stock'

/**
 * Calculate 4-month momentum (return)
 * Formula: (latest_price - start_price) / start_price
 *
 * @param historicalData - Array of historical price data points
 * @returns Momentum value (e.g., 0.15 = 15% return)
 */
export function calculateMomentum(historicalData: HistoricalDataPoint[]): number {
  if (historicalData.length < 2) {
    throw new Error('Insufficient data: At least 2 data points required')
  }

  const startPrice = historicalData[0].close
  const latestPrice = historicalData[historicalData.length - 1].close

  if (startPrice === 0) {
    throw new Error('Invalid data: Start price cannot be zero')
  }

  return (latestPrice - startPrice) / startPrice
}
