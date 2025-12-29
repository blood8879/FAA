'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'
import type { SelectedAsset } from '@/types/faa'
import { useTranslations } from 'next-intl'

interface SelectedAssetsProps {
  selectedAssets: SelectedAsset[]
}

export function SelectedAssets({ selectedAssets }: SelectedAssetsProps) {
  const t = useTranslations('selectedAssets')

  if (selectedAssets.length === 0) {
    return null
  }

  const cashAllocations = selectedAssets.filter((a) => a.allocation === 'CASH')
  const hasCashAllocations = cashAllocations.length > 0
  const tickers = cashAllocations.map((a) => a.ticker).join(', ')

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('title')}</CardTitle>
        <CardDescription>
          {t('description')}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {hasCashAllocations && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {cashAllocations.length === 1
                ? t('negativeMomentum.single', { ticker: tickers })
                : t('negativeMomentum.multiple', { count: cashAllocations.length, tickers })}
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-3">
          {selectedAssets.map((asset) => (
            <div
              key={asset.ticker}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="text-sm">
                  #{asset.rank}
                </Badge>
                <div>
                  <div className="font-semibold text-lg">{asset.ticker}</div>
                  <div className="text-sm text-muted-foreground">
                    {t('score', { value: asset.metrics.weightedScore.toFixed(4) })}
                  </div>
                </div>
              </div>
              <div>
                {asset.allocation === 'CASH' ? (
                  <Badge variant="destructive">CASH</Badge>
                ) : (
                  <Badge variant="default">INVEST</Badge>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t">
          <div className="text-sm text-muted-foreground">
            {t('allocation')}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
