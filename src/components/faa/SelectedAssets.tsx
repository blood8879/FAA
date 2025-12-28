'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'
import type { SelectedAsset } from '@/types/faa'

interface SelectedAssetsProps {
  selectedAssets: SelectedAsset[]
}

export function SelectedAssets({ selectedAssets }: SelectedAssetsProps) {
  if (selectedAssets.length === 0) {
    return null
  }

  const cashAllocations = selectedAssets.filter((a) => a.allocation === 'CASH')
  const hasCashAllocations = cashAllocations.length > 0

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top 3 Selected Assets</CardTitle>
        <CardDescription>
          Assets selected based on weighted FAA scores
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {hasCashAllocations && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {cashAllocations.length === 1
                ? 'One asset has'
                : `${cashAllocations.length} assets have`}{' '}
              negative momentum and will be allocated to CASH:{' '}
              {cashAllocations.map((a) => a.ticker).join(', ')}
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
                    Score: {asset.metrics.weightedScore.toFixed(4)}
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
            <strong>Allocation Strategy:</strong> Equal weight distribution
            across selected assets. Assets with negative momentum are replaced
            with cash holdings.
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
