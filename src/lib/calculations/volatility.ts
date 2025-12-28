import type { HistoricalDataPoint } from '@/types/stock'

/**
 * Calculate volatility (standard deviation of daily returns)
 *
 * @param historicalData - Array of historical price data points
 * @returns Standard deviation of daily returns
 */
export function calculateVolatility(historicalData: HistoricalDataPoint[]): number {
  if (historicalData.length < 2) {
    throw new Error('Insufficient data: At least 2 data points required')
  }

  // Calculate daily returns
  const dailyReturns: number[] = []
  for (let i = 1; i < historicalData.length; i++) {
    const prevClose = historicalData[i - 1].close
    const currentClose = historicalData[i].close

    if (prevClose === 0) {
      throw new Error(`Invalid data: Price at index ${i - 1} cannot be zero`)
    }

    const dailyReturn = (currentClose - prevClose) / prevClose
    dailyReturns.push(dailyReturn)
  }

  // Calculate mean of daily returns
  const mean = dailyReturns.reduce((sum, r) => sum + r, 0) / dailyReturns.length

  // Calculate variance
  const variance =
    dailyReturns.reduce((sum, r) => sum + Math.pow(r - mean, 2), 0) /
    dailyReturns.length

  // Return standard deviation
  return Math.sqrt(variance)
}

/**
 * Calculate daily returns from historical data
 *
 * @param historicalData - Array of historical price data points
 * @returns Array of daily returns
 */
export function calculateDailyReturns(
  historicalData: HistoricalDataPoint[]
): number[] {
  if (historicalData.length < 2) {
    throw new Error('Insufficient data: At least 2 data points required')
  }

  const dailyReturns: number[] = []
  for (let i = 1; i < historicalData.length; i++) {
    const prevClose = historicalData[i - 1].close
    const currentClose = historicalData[i].close

    if (prevClose === 0) {
      throw new Error(`Invalid data: Price at index ${i - 1} cannot be zero`)
    }

    const dailyReturn = (currentClose - prevClose) / prevClose
    dailyReturns.push(dailyReturn)
  }

  return dailyReturns
}
