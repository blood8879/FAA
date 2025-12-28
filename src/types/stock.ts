// Historical stock data point
export interface HistoricalDataPoint {
  date: Date
  open: number
  high: number
  low: number
  close: number
  volume: number
}

// Stock quote (current price)
export interface StockQuote {
  ticker: string
  price: number
  currency: string
  timestamp: Date
}

// Stock data with historical information
export interface StockData {
  ticker: string
  historical: HistoricalDataPoint[]
  error: string | null
}
