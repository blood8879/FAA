import { calculateCorrelation } from './correlation'

/**
 * Calculate full correlation matrix between all assets
 *
 * @param allReturns - Array of return arrays for all assets
 * @returns 2D array representing correlation matrix
 */
export function calculateCorrelationMatrix(allReturns: number[][]): number[][] {
  const n = allReturns.length
  const matrix: number[][] = []

  for (let i = 0; i < n; i++) {
    const row: number[] = []
    for (let j = 0; j < n; j++) {
      if (i === j) {
        // Correlation with itself is always 1
        row.push(1.0)
      } else {
        // Calculate correlation between asset i and asset j
        const correlation = calculateCorrelation(allReturns[i], allReturns[j])
        row.push(correlation)
      }
    }
    matrix.push(row)
  }

  return matrix
}
