'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Skeleton } from '@/components/ui/skeleton'
import { DollarSign, Info } from 'lucide-react'
import { fetchStockQuotes } from '@/lib/api-client/stock-data'
import { fetchExchangeRate } from '@/lib/api-client/exchange-rate'
import type { SelectedAsset, Currency, PurchaseAllocation } from '@/types/faa'

interface PurchaseCalculatorProps {
  selectedAssets: SelectedAsset[]
}

export function PurchaseCalculator({ selectedAssets }: PurchaseCalculatorProps) {
  const [currency, setCurrency] = useState<Currency>('USD')
  const [amount, setAmount] = useState<string>('')
  const [exchangeRate, setExchangeRate] = useState<number | null>(null)
  const [exchangeTimestamp, setExchangeTimestamp] = useState<string>('')
  const [allocations, setAllocations] = useState<PurchaseAllocation[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Filter out CASH allocations
  const investableAssets = selectedAssets.filter((a) => a.allocation !== 'CASH')

  const canCalculate = amount.trim().length > 0 && parseFloat(amount) > 0 && investableAssets.length > 0

  // Fetch exchange rate when currency is KRW
  useEffect(() => {
    if (currency === 'KRW') {
      fetchExchangeRate()
        .then((data) => {
          setExchangeRate(data.rate)
          setExchangeTimestamp(data.timestamp)
        })
        .catch((err) => {
          console.error('Failed to fetch exchange rate:', err)
          setError('Failed to fetch exchange rate')
        })
    } else {
      setExchangeRate(null)
      setExchangeTimestamp('')
    }
  }, [currency])

  const handleCalculate = async () => {
    if (!canCalculate) return

    setIsLoading(true)
    setError(null)
    setAllocations([])

    try {
      const inputAmount = parseFloat(amount)
      let usdAmount = inputAmount

      // Convert KRW to USD if needed
      if (currency === 'KRW') {
        if (!exchangeRate) {
          throw new Error('Exchange rate not available')
        }
        usdAmount = inputAmount / exchangeRate
      }

      // Fetch current prices
      const tickers = investableAssets.map((a) => a.ticker)
      const quotes = await fetchStockQuotes(tickers)

      // Check for errors
      const failedQuotes = quotes.filter((q) => q.error !== null)
      if (failedQuotes.length > 0) {
        throw new Error(
          `Failed to fetch prices for: ${failedQuotes.map((q) => q.ticker).join(', ')}`
        )
      }

      // Calculate equal allocation amount per asset
      const amountPerAsset = usdAmount / investableAssets.length

      // Calculate shares and allocations
      const newAllocations: PurchaseAllocation[] = quotes.map((quote) => {
        const price = quote.quote!.price
        const shares = amountPerAsset / price
        const usdAllocated = shares * price
        const percentage = (usdAllocated / usdAmount) * 100

        return {
          ticker: quote.ticker,
          currentPrice: price,
          shares,
          usdAmount: usdAllocated,
          percentage,
        }
      })

      setAllocations(newAllocations)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setError(errorMessage)
      console.error('Purchase calculation error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  if (selectedAssets.length === 0) {
    return null
  }

  if (investableAssets.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Purchase Calculator</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              All selected assets have negative momentum and are allocated to CASH.
              No stock purchases needed.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  const totalUSD = allocations.reduce((sum, a) => sum + a.usdAmount, 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Purchase Calculator</CardTitle>
        <CardDescription>
          Calculate how many shares you can buy with your investment amount
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Currency and Amount Input */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Currency</Label>
            <div className="flex gap-2">
              <Button
                variant={currency === 'USD' ? 'default' : 'outline'}
                onClick={() => setCurrency('USD')}
                className="flex-1"
              >
                USD
              </Button>
              <Button
                variant={currency === 'KRW' ? 'default' : 'outline'}
                onClick={() => setCurrency('KRW')}
                className="flex-1"
              >
                KRW
              </Button>
            </div>
          </div>

          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="amount">Investment Amount</Label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="amount"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder={currency === 'USD' ? '10000' : '13500000'}
                  className="pl-9"
                  min="0"
                  step="any"
                />
              </div>
              <Button
                onClick={handleCalculate}
                disabled={!canCalculate || isLoading}
              >
                {isLoading ? 'Calculating...' : 'Calculate'}
              </Button>
            </div>
          </div>
        </div>

        {/* Exchange Rate Display */}
        {currency === 'KRW' && exchangeRate && (
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              Exchange Rate: 1 USD = {exchangeRate.toFixed(2)} KRW
              <br />
              <span className="text-xs text-muted-foreground">
                Updated: {new Date(exchangeTimestamp).toLocaleString()}
              </span>
            </AlertDescription>
          </Alert>
        )}

        {/* Error Display */}
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="space-y-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        )}

        {/* Allocation Results */}
        {allocations.length > 0 && !isLoading && (
          <div className="space-y-4">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Asset</TableHead>
                    <TableHead className="text-right">Current Price</TableHead>
                    <TableHead className="text-right">Shares</TableHead>
                    <TableHead className="text-right">USD Amount</TableHead>
                    <TableHead className="text-right">%</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allocations.map((allocation) => (
                    <TableRow key={allocation.ticker}>
                      <TableCell className="font-medium">
                        {allocation.ticker}
                      </TableCell>
                      <TableCell className="text-right">
                        ${allocation.currentPrice.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        {allocation.shares.toFixed(6)}
                      </TableCell>
                      <TableCell className="text-right">
                        ${allocation.usdAmount.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right">
                        {allocation.percentage.toFixed(1)}%
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="font-semibold bg-muted/50">
                    <TableCell colSpan={3}>Total</TableCell>
                    <TableCell className="text-right">
                      ${totalUSD.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right">100.0%</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>

            {currency === 'KRW' && exchangeRate && (
              <div className="text-sm text-muted-foreground">
                <strong>Original Amount:</strong> ₩{parseFloat(amount).toLocaleString()} KRW
                = ${(parseFloat(amount) / exchangeRate).toFixed(2)} USD
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
