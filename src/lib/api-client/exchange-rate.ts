import type { ExchangeRateResponse } from '@/types/api'

/**
 * Fetch USD to KRW exchange rate from API
 */
export async function fetchExchangeRate(): Promise<ExchangeRateResponse> {
  const response = await fetch('/api/exchange-rate')

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }))
    throw new Error(error.error || `API error: ${response.status}`)
  }

  return response.json()
}
