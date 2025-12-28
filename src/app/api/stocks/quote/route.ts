import { NextResponse } from 'next/server'
import YahooFinance from 'yahoo-finance2'
import type { QuoteRequest, QuoteResponse } from '@/types/api'

export const runtime = 'nodejs'

const yahooFinance = new YahooFinance()

export async function POST(request: Request) {
  try {
    const body: QuoteRequest = await request.json()
    const { tickers } = body

    // Validation
    if (!Array.isArray(tickers) || tickers.length === 0) {
      return NextResponse.json(
        { error: 'At least one ticker required' },
        { status: 400 }
      )
    }

    // Fetch quotes for all tickers
    const results: QuoteResponse[] = await Promise.all(
      tickers.map(async (ticker: string) => {
        try {
          const quote = await yahooFinance.quoteSummary(ticker, {
            modules: ['price'],
          }) as any

          if (!quote || !quote.price || !quote.price.regularMarketPrice) {
            throw new Error('No price data available')
          }

          const priceData = quote.price

          return {
            ticker,
            quote: {
              ticker,
              price: priceData.regularMarketPrice,
              currency: priceData.currency || 'USD',
              timestamp: new Date(priceData.regularMarketTime || Date.now()),
            },
            error: null,
          }
        } catch (error) {
          console.error(`Error fetching quote for ${ticker}:`, error)
          return {
            ticker,
            quote: null,
            error: error instanceof Error ? error.message : 'Unknown error',
          }
        }
      })
    )

    // Check if all requests failed
    const allFailed = results.every((r) => r.error !== null)
    if (allFailed) {
      return NextResponse.json(
        { error: 'Failed to fetch quotes for all tickers' },
        { status: 500 }
      )
    }

    return NextResponse.json(results, {
      headers: {
        'Cache-Control': 's-maxage=60, stale-while-revalidate=120',
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
