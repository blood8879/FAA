import { NextResponse } from 'next/server'
import type { ExchangeRateResponse } from '@/types/api'

export const runtime = 'edge'

export async function GET() {
  try {
    const response = await fetch(
      'https://api.exchangerate-api.com/v4/latest/USD',
      {
        next: {
          revalidate: 3600, // Cache for 1 hour
        },
      }
    )

    if (!response.ok) {
      throw new Error(`Exchange rate API error: ${response.status}`)
    }

    const data = await response.json()

    if (!data.rates || !data.rates.KRW) {
      throw new Error('KRW rate not found in response')
    }

    const result: ExchangeRateResponse = {
      rate: data.rates.KRW,
      timestamp: new Date(data.time_last_updated * 1000).toISOString(),
    }

    return NextResponse.json(result, {
      headers: {
        'Cache-Control': 's-maxage=3600, stale-while-revalidate=7200',
      },
    })
  } catch (error) {
    console.error('Exchange rate API error:', error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to fetch exchange rate',
      },
      { status: 500 }
    )
  }
}
