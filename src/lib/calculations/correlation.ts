/**
 * Calculate Pearson correlation coefficient between two return arrays
 *
 * @param returns1 - First array of returns
 * @param returns2 - Second array of returns
 * @returns Correlation coefficient (-1 to 1)
 */
export function calculateCorrelation(
  returns1: number[],
  returns2: number[]
): number {
  if (returns1.length !== returns2.length) {
    throw new Error('Return arrays must have the same length')
  }

  if (returns1.length < 2) {
    throw new Error('At least 2 data points required for correlation')
  }

  const n = returns1.length

  // Calculate means
  const mean1 = returns1.reduce((sum, r) => sum + r, 0) / n
  const mean2 = returns2.reduce((sum, r) => sum + r, 0) / n

  // Calculate correlation components
  let numerator = 0
  let sum1Squared = 0
  let sum2Squared = 0

  for (let i = 0; i < n; i++) {
    const diff1 = returns1[i] - mean1
    const diff2 = returns2[i] - mean2

    numerator += diff1 * diff2
    sum1Squared += diff1 * diff1
    sum2Squared += diff2 * diff2
  }

  // Avoid division by zero
  if (sum1Squared === 0 || sum2Squared === 0) {
    return 0
  }

  return numerator / Math.sqrt(sum1Squared * sum2Squared)
}

/**
 * Calculate sum of correlations of one asset with all other assets
 * (FAA strategy uses sum, not average)
 *
 * @param assetIndex - Index of the asset to analyze
 * @param allReturns - Array of return arrays for all assets
 * @returns Sum of correlations with other assets
 */
export function calculateSumCorrelation(
  assetIndex: number,
  allReturns: number[][]
): number {
  if (assetIndex < 0 || assetIndex >= allReturns.length) {
    throw new Error('Invalid asset index')
  }

  if (allReturns.length < 2) {
    throw new Error('At least 2 assets required for correlation calculation')
  }

  const correlations: number[] = []
  const targetReturns = allReturns[assetIndex]

  for (let i = 0; i < allReturns.length; i++) {
    if (i !== assetIndex) {
      const correlation = calculateCorrelation(targetReturns, allReturns[i])
      correlations.push(correlation)
    }
  }

  if (correlations.length === 0) {
    return 0
  }

  // Return SUM of correlations, not average (FAA strategy requirement)
  return correlations.reduce((sum, c) => sum + c, 0)
}
