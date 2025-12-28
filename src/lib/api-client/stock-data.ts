import type {
  HistoricalDataRequest,
  HistoricalDataResponse,
  QuoteRequest,
  QuoteResponse,
} from '@/types/api'

/**
 * Fetch historical stock data from API
 */
export async function fetchHistoricalData(
  tickers: string[]
): Promise<HistoricalDataResponse[]> {
  const request: HistoricalDataRequest = { tickers }

  const response = await fetch('/api/stocks/historical', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }))
    throw new Error(error.error || `API error: ${response.status}`)
  }

  return response.json()
}

/**
 * Fetch current stock quotes from API
 */
export async function fetchStockQuotes(
  tickers: string[]
): Promise<QuoteResponse[]> {
  const request: QuoteRequest = { tickers }

  const response = await fetch('/api/stocks/quote', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }))
    throw new Error(error.error || `API error: ${response.status}`)
  }

  return response.json()
}
