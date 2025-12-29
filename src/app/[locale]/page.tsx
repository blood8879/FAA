'use client'

import { useFAACalculator } from '@/hooks/use-faa-calculator'
import { AssetSelector } from '@/components/faa/AssetSelector'
import { MetricsTable } from '@/components/faa/MetricsTable'
import { CorrelationMatrix } from '@/components/faa/CorrelationMatrix'
import { SelectedAssets } from '@/components/faa/SelectedAssets'
import { PurchaseCalculator } from '@/components/faa/PurchaseCalculator'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'
import { useTranslations } from 'next-intl'

export default function Home() {
  const t = useTranslations('page')
  const tEmpty = useTranslations('selectedAssets')
  const { metrics, selectedAssets, correlationMatrix, tickers, isLoading, error, calculate } = useFAACalculator()

  const handleCalculate = (tickers: string[], includeUSD: boolean) => {
    calculate(tickers, includeUSD)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-7xl mx-auto py-8 px-4 space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">
            {t('title')}
          </h1>
          <p className="text-lg text-muted-foreground">
            {t('description')}
          </p>
        </div>

        {/* Asset Selection */}
        <AssetSelector onCalculate={handleCalculate} isLoading={isLoading} />

        {/* Error Display */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Metrics Table */}
        <MetricsTable metrics={metrics} />

        {/* Correlation Matrix */}
        <CorrelationMatrix matrix={correlationMatrix} tickers={tickers} />

        {/* Selected Assets */}
        <SelectedAssets selectedAssets={selectedAssets} />

        {/* Purchase Calculator */}
        <PurchaseCalculator selectedAssets={selectedAssets} />

        {/* Footer Info */}
        {metrics.length === 0 && !error && !isLoading && (
          <div className="text-center py-12 text-muted-foreground">
            <p className="text-lg">
              {tEmpty('emptyState')}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
