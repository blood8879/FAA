'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useTranslations, useLocale } from 'next-intl'
import { ETF_LIST, DEFAULT_TICKERS } from '@/data/etf-list'

interface AssetSelectorProps {
  onCalculate: (tickers: string[], includeUSD: boolean) => void
  isLoading: boolean
}

export function AssetSelector({ onCalculate, isLoading }: AssetSelectorProps) {
  const t = useTranslations('assetSelector')
  const locale = useLocale()
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
    newTickers[index] = value
    setTickers(newTickers)
  }

  const handleCalculate = () => {
    onCalculate(tickers, includeUSD)
  }

  const allFilled = tickers.every((t) => t.trim().length > 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('title')}</CardTitle>
        <CardDescription>
          {t('description')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {tickers.map((ticker, index) => (
            <div key={index} className="space-y-2">
              <Label htmlFor={`ticker-${index}`}>{t('assetLabel', { number: index + 1 })}</Label>
              <Select
                value={ticker}
                onValueChange={(value) => handleTickerChange(index, value)}
                disabled={isLoading}
              >
                <SelectTrigger id={`ticker-${index}`}>
                  <SelectValue placeholder={t(`placeholder.${index + 1}`)} />
                </SelectTrigger>
                <SelectContent className="max-h-[400px]">
                  {ETF_LIST.map((group) => (
                    <SelectGroup key={group.label}>
                      <SelectLabel className="font-bold text-sm">
                        {locale === 'ko' ? group.labelKo : group.label}
                      </SelectLabel>
                      {group.categories.map((category) => (
                        <div key={category.label}>
                          <SelectLabel className="pl-2 text-xs text-muted-foreground">
                            {locale === 'ko' ? category.labelKo : category.label}
                          </SelectLabel>
                          {category.etfs.map((etf) => (
                            <SelectItem
                              key={etf.ticker}
                              value={etf.ticker}
                              className="pl-4"
                            >
                              <div className="flex flex-col">
                                <div className="font-medium">
                                  {etf.ticker} - {locale === 'ko' ? etf.nameKo : etf.name}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {locale === 'ko' ? etf.descriptionKo : etf.description}
                                </div>
                              </div>
                            </SelectItem>
                          ))}
                        </div>
                      ))}
                    </SelectGroup>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ))}
        </div>

        <div className="mb-6 p-4 border rounded-lg bg-muted/50">
          <div className="text-sm font-semibold mb-2">{t('guide.title')}</div>
          <div className="text-xs text-muted-foreground space-y-1">
            <div>• {t('guide.equity')}: 3{t('guide.items')}</div>
            <div>• {t('guide.bond')}: 2{t('guide.items')}</div>
            <div>• {t('guide.alternative')}: 2{t('guide.items')}</div>
          </div>
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
            {t('includeUSD')}
          </Label>
        </div>

        <Button
          onClick={handleCalculate}
          disabled={!allFilled || isLoading}
          className="w-full"
          size="lg"
        >
          {isLoading ? t('calculating') : t('calculateButton')}
        </Button>
      </CardContent>
    </Card>
  )
}
