'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface AssetSelectorProps {
  onCalculate: (tickers: string[], includeUSD: boolean) => void
  isLoading: boolean
}

const DEFAULT_TICKERS = ['VTI', 'VEA', 'VWO', 'SHY', 'BND', 'GSG', 'VNQ']

export function AssetSelector({ onCalculate, isLoading }: AssetSelectorProps) {
  const [tickers, setTickers] = useState<string[]>(DEFAULT_TICKERS)
  const [includeUSD, setIncludeUSD] = useState<boolean>(true)

  // Load tickers from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('faa-tickers')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length === 7) {
          setTickers(parsed)
        }
      } catch {
        // Ignore parse errors
      }
    }
  }, [])

  // Save tickers to localStorage when they change
  useEffect(() => {
    localStorage.setItem('faa-tickers', JSON.stringify(tickers))
  }, [tickers])

  const handleTickerChange = (index: number, value: string) => {
    const newTickers = [...tickers]
    newTickers[index] = value.toUpperCase().trim()
    setTickers(newTickers)
  }

  const handleCalculate = () => {
    onCalculate(tickers, includeUSD)
  }

  const allFilled = tickers.every((t) => t.trim().length > 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Asset Selection</CardTitle>
        <CardDescription>
          Enter 7 ETF/stock tickers to analyze with FAA strategy
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {tickers.map((ticker, index) => (
            <div key={index} className="space-y-2">
              <Label htmlFor={`ticker-${index}`}>Asset {index + 1}</Label>
              <Input
                id={`ticker-${index}`}
                type="text"
                value={ticker}
                onChange={(e) => handleTickerChange(index, e.target.value)}
                placeholder={`e.g., ${DEFAULT_TICKERS[index]}`}
                disabled={isLoading}
                className="uppercase"
                maxLength={10}
              />
            </div>
          ))}
        </div>

        <div className="mb-6 flex items-center space-x-2 p-4 border rounded-lg bg-muted/50">
          <input
            type="checkbox"
            id="include-usd"
            checked={includeUSD}
            onChange={(e) => setIncludeUSD(e.target.checked)}
            disabled={isLoading}
            className="h-4 w-4"
          />
          <Label htmlFor="include-usd" className="cursor-pointer">
            Include USD (Cash) as 8th asset for comparison
          </Label>
        </div>

        <Button
          onClick={handleCalculate}
          disabled={!allFilled || isLoading}
          className="w-full"
          size="lg"
        >
          {isLoading ? 'Calculating...' : 'Calculate FAA Scores'}
        </Button>
      </CardContent>
    </Card>
  )
}
