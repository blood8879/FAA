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
import { useTranslations } from 'next-intl'

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
  const t = useTranslations('correlationMatrix')

  if (matrix.length === 0 || tickers.length === 0) {
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('title')}</CardTitle>
        <CardDescription>
          {t('description')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-bold">{t('headers.asset')}</TableHead>
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
          <div className="text-sm font-semibold">{t('legend.title')}</div>
          <div className="flex flex-wrap gap-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-200 dark:bg-blue-900 border" />
              <span>{t('legend.strongPositive')}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-100 dark:bg-blue-950 border" />
              <span>{t('legend.moderatePositive')}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-white dark:bg-slate-950 border" />
              <span>{t('legend.weakNone')}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-100 dark:bg-red-900 border" />
              <span>{t('legend.moderateNegative')}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-200 dark:bg-red-800 border" />
              <span>{t('legend.strongNegative')}</span>
            </div>
          </div>
          <div className="text-xs text-muted-foreground mt-2">
            {t('legend.note')}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
