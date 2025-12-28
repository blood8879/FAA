import { NextResponse } from 'next/server'
import YahooFinance from 'yahoo-finance2'
import type { HistoricalDataRequest, HistoricalDataResponse } from '@/types/api'

export const runtime = 'nodejs'

const yahooFinance = new YahooFinance()

export async function POST(request: Request) {
  try {
    const body: HistoricalDataRequest = await request.json()
    const { tickers } = body

    // Validation
    if (!Array.isArray(tickers) || tickers.length !== 7) {
      return NextResponse.json(
        { error: 'Exactly 7 tickers required' },
        { status: 400 }
      )
    }

    // Calculate date range (4 months)
    const endDate = new Date()
    const startDate = new Date()
    startDate.setMonth(startDate.getMonth() - 4)

    // Fetch historical data for all tickers
    const results: HistoricalDataResponse[] = await Promise.all(
      tickers.map(async (ticker: string) => {
        try {
          const data = await yahooFinance.historical(ticker, {
            period1: startDate,
            period2: endDate,
            interval: '1d',
          }) as any[]

          // Transform data to match our interface
          const transformedData = data.map((d: any) => ({
            date: d.date,
            open: d.open,
            high: d.high,
            low: d.low,
            close: d.close,
            volume: d.volume,
          }))

          return {
            ticker,
            data: transformedData,
            error: null,
          }
        } catch (error) {
          console.error(`Error fetching data for ${ticker}:`, error)
          return {
            ticker,
            data: null,
            error: error instanceof Error ? error.message : 'Unknown error',
          }
        }
      })
    )

    // Check if all requests failed
    const allFailed = results.every((r) => r.error !== null)
    if (allFailed) {
      return NextResponse.json(
        { error: 'Failed to fetch data for all tickers' },
        { status: 500 }
      )
    }

    return NextResponse.json(results, {
      headers: {
        'Cache-Control': 's-maxage=300, stale-while-revalidate=600',
      },
    })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
