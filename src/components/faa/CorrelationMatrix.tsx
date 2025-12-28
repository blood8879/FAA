'use client'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface CorrelationMatrixProps {
  matrix: number[][]
  tickers: string[]
}

function getCorrelationColor(value: number): string {
  // Color scale from red (-1) to white (0) to blue (1)
  if (value >= 0.7) return 'bg-blue-200 dark:bg-blue-900'
  if (value >= 0.4) return 'bg-blue-100 dark:bg-blue-950'
  if (value >= 0.1) return 'bg-slate-50 dark:bg-slate-900'
  if (value >= -0.1) return 'bg-white dark:bg-slate-950'
  if (value >= -0.4) return 'bg-red-50 dark:bg-red-950'
  if (value >= -0.7) return 'bg-red-100 dark:bg-red-900'
  return 'bg-red-200 dark:bg-red-800'
}

export function CorrelationMatrix({ matrix, tickers }: CorrelationMatrixProps) {
  if (matrix.length === 0 || tickers.length === 0) {
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Correlation Matrix</CardTitle>
        <CardDescription>
          Pairwise correlation coefficients between assets (daily returns)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-bold">Asset</TableHead>
                {tickers.map((ticker) => (
                  <TableHead key={ticker} className="text-center font-bold min-w-[80px]">
                    {ticker}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {matrix.map((row, i) => (
                <TableRow key={tickers[i]}>
                  <TableCell className="font-bold">{tickers[i]}</TableCell>
                  {row.map((value, j) => (
                    <TableCell
                      key={`${i}-${j}`}
                      className={`text-center ${getCorrelationColor(value)}`}
                    >
                      {value.toFixed(3)}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="mt-4 p-4 bg-muted/50 rounded-lg space-y-2">
          <div className="text-sm font-semibold">Color Legend:</div>
          <div className="flex flex-wrap gap-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-200 dark:bg-blue-900 border" />
              <span>Strong Positive (≥0.7)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-100 dark:bg-blue-950 border" />
              <span>Moderate Positive (0.4-0.7)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-white dark:bg-slate-950 border" />
              <span>Weak/None (-0.1-0.1)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-100 dark:bg-red-900 border" />
              <span>Moderate Negative (-0.7--0.4)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-200 dark:bg-red-800 border" />
              <span>Strong Negative (≤-0.7)</span>
            </div>
          </div>
          <div className="text-xs text-muted-foreground mt-2">
            <strong>Note:</strong> Diagonal values are always 1.0 (asset correlated with itself)
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
