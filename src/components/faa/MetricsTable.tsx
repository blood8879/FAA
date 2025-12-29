'use client'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { AssetMetrics } from '@/types/faa'
import { useTranslations } from 'next-intl'

interface MetricsTableProps {
  metrics: AssetMetrics[]
}

function formatPercentage(value: number): string {
  return `${(value * 100).toFixed(2)}%`
}

function formatNumber(value: number): string {
  return value.toFixed(4)
}

export function MetricsTable({ metrics }: MetricsTableProps) {
  const t = useTranslations('metricsTable')

  if (metrics.length === 0) {
    return null
  }

  // Sort by weighted score (ascending - lower is better in rank-based scoring)
  const sortedMetrics = [...metrics].sort(
    (a, b) => a.weightedScore - b.weightedScore
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('title')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('headers.ticker')}</TableHead>
                <TableHead className="text-right">{t('headers.momentum')}</TableHead>
                <TableHead className="text-right">{t('headers.rank')}</TableHead>
                <TableHead className="text-right">{t('headers.volatility')}</TableHead>
                <TableHead className="text-right">{t('headers.rank')}</TableHead>
                <TableHead className="text-right">{t('headers.correlation')}</TableHead>
                <TableHead className="text-right">{t('headers.rank')}</TableHead>
                <TableHead className="text-right font-semibold">
                  {t('headers.totalScore')}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedMetrics.map((metric, index) => (
                <TableRow key={metric.ticker} className={index < 3 ? 'bg-green-50 dark:bg-green-950' : ''}>
                  <TableCell className="font-medium">{metric.ticker}</TableCell>
                  <TableCell
                    className={`text-right ${
                      metric.momentum >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {formatPercentage(metric.momentum)}
                  </TableCell>
                  <TableCell className="text-right text-xs text-muted-foreground">
                    {metric.momentumRank || '-'}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatNumber(metric.volatility)}
                  </TableCell>
                  <TableCell className="text-right text-xs text-muted-foreground">
                    {metric.volatilityRank || '-'}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatNumber(metric.correlation)}
                  </TableCell>
                  <TableCell className="text-right text-xs text-muted-foreground">
                    {metric.correlationRank || '-'}
                  </TableCell>
                  <TableCell className="text-right font-semibold">
                    {formatNumber(metric.weightedScore)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="mt-4 text-sm text-muted-foreground">
          <p><strong>{t('footer.rankingLogic')}</strong> {t('footer.rankingLogicDescription')}</p>
          <p><strong>{t('footer.totalScore')}</strong> {t('footer.totalScoreFormula')}</p>
          <p className="mt-2 text-green-600"><strong>{t('footer.topThreeHighlighted')}</strong></p>
        </div>
      </CardContent>
    </Card>
  )
}
