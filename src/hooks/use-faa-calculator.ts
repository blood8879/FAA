'use client'

import { useState, useCallback, useMemo } from 'react'
import { fetchHistoricalData } from '@/lib/api-client/stock-data'
import { calculateMomentum } from '@/lib/calculations/momentum'
import { calculateVolatility, calculateDailyReturns } from '@/lib/calculations/volatility'
import { calculateAverageCorrelation } from '@/lib/calculations/correlation'
import { calculateCorrelationMatrix } from '@/lib/calculations/correlation-matrix'
import {
  calculateWeightedScore,
  selectTopAssets,
} from '@/lib/calculations/weighted-score'
import type { AssetMetrics, SelectedAsset } from '@/types/faa'
import type { HistoricalDataResponse } from '@/types/api'

interface UseFAACalculatorReturn {
  metrics: AssetMetrics[]
  selectedAssets: SelectedAsset[]
  correlationMatrix: number[][]
  tickers: string[]
  isLoading: boolean
  error: string | null
  calculate: (tickers: string[], includeUSD?: boolean) => Promise<void>
  reset: () => void
}

export function useFAACalculator(): UseFAACalculatorReturn {
  const [metrics, setMetrics] = useState<AssetMetrics[]>([])
  const [correlationMatrix, setCorrelationMatrix] = useState<number[][]>([])
  const [tickers, setTickers] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const selectedAssets = useMemo(() => {
    if (metrics.length === 0) return []
    try {
      return selectTopAssets(metrics, 3)
    } catch (err) {
      console.error('Error selecting top assets:', err)
      return []
    }
  }, [metrics])

  const calculate = useCallback(async (tickers: string[], includeUSD: boolean = false) => {
    // Validation
    if (tickers.length !== 7) {
      setError('Exactly 7 tickers required')
      return
    }

    // Remove empty tickers
    const validTickers = tickers.filter((t) => t.trim().length > 0)
    if (validTickers.length !== 7) {
      setError('All 7 tickers must be filled')
      return
    }

    setIsLoading(true)
    setError(null)
    setMetrics([])

    try {
      // Fetch historical data
      const historicalData: HistoricalDataResponse[] = await fetchHistoricalData(validTickers)

      // Check for errors in individual ticker data
      const failedTickers = historicalData
        .filter((d) => d.error !== null)
        .map((d) => d.ticker)

      if (failedTickers.length > 0) {
        throw new Error(
          `Failed to fetch data for: ${failedTickers.join(', ')}`
        )
      }

      // Ensure all tickers have sufficient data
      const insufficientDataTickers = historicalData
        .filter((d) => !d.data || d.data.length < 2)
        .map((d) => d.ticker)

      if (insufficientDataTickers.length > 0) {
        throw new Error(
          `Insufficient historical data for: ${insufficientDataTickers.join(', ')}`
        )
      }

      // Calculate daily returns for all assets
      let allDailyReturns = historicalData.map((d) =>
        calculateDailyReturns(d.data!)
      )

      // Add USD (cash) as 8th asset if requested
      if (includeUSD) {
        // USD has zero return every day (no volatility, no correlation)
        const usdReturns = new Array(allDailyReturns[0].length).fill(0)
        allDailyReturns.push(usdReturns)
      }

      // Calculate metrics for each asset
      const calculatedMetrics: AssetMetrics[] = historicalData.map((d, index) => {
        const momentum = calculateMomentum(d.data!)
        const volatility = calculateVolatility(d.data!)
        const correlation = calculateAverageCorrelation(index, allDailyReturns)
        const weightedScore = calculateWeightedScore(momentum, volatility, correlation)

        return {
          ticker: d.ticker,
          momentum,
          volatility,
          correlation,
          weightedScore,
        }
      })

      // Add USD metrics if included
      if (includeUSD) {
        const usdMetrics: AssetMetrics = {
          ticker: 'USD',
          momentum: 0,
          volatility: 0,
          correlation: calculateAverageCorrelation(allDailyReturns.length - 1, allDailyReturns),
          weightedScore: 0, // Will be recalculated
        }
        usdMetrics.weightedScore = calculateWeightedScore(
          usdMetrics.momentum,
          usdMetrics.volatility,
          usdMetrics.correlation
        )
        calculatedMetrics.push(usdMetrics)
      }

      // Calculate correlation matrix
      const corrMatrix = calculateCorrelationMatrix(allDailyReturns)

      // Set tickers list
      const tickersList = includeUSD
        ? [...validTickers, 'USD']
        : validTickers

      setMetrics(calculatedMetrics)
      setCorrelationMatrix(corrMatrix)
      setTickers(tickersList)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
      setError(errorMessage)
      console.error('FAA calculation error:', err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const reset = useCallback(() => {
    setMetrics([])
    setCorrelationMatrix([])
    setTickers([])
    setError(null)
    setIsLoading(false)
  }, [])

  return {
    metrics,
    selectedAssets,
    correlationMatrix,
    tickers,
    isLoading,
    error,
    calculate,
    reset,
  }
}
