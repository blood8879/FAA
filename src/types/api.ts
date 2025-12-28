import { HistoricalDataPoint, StockQuote } from './stock'

// API Request types
export interface HistoricalDataRequest {
  tickers: string[]
}

export interface QuoteRequest {
  tickers: string[]
}

// API Response types
export interface HistoricalDataResponse {
  ticker: string
  data: HistoricalDataPoint[] | null
  error: string | null
}

export interface QuoteResponse {
  ticker: string
  quote: StockQuote | null
  error: string | null
}

export interface ExchangeRateResponse {
  rate: number
  timestamp: string
}

// API Error type
export interface ApiError {
  message: string
  code?: string
  details?: unknown
}
