// FAA Strategy ETF Universe
// 7개 자산 구성 가이드: 주식 3개 + 채권 2개 + 대체자산 2개

export interface ETFInfo {
  ticker: string
  name: string
  description: string
  nameKo?: string
  descriptionKo?: string
}

export interface ETFCategory {
  label: string
  labelKo: string
  etfs: ETFInfo[]
}

export interface ETFGroup {
  label: string
  labelKo: string
  categories: ETFCategory[]
}

export const ETF_LIST: ETFGroup[] = [
  {
    label: 'Equity (Stocks)',
    labelKo: '주식형 - 공격수',
    categories: [
      {
        label: 'US Equity',
        labelKo: '🇺🇸 미국 주식',
        etfs: [
          {
            ticker: 'SPY',
            name: 'SPDR S&P 500',
            nameKo: 'SPDR S&P 500',
            description: 'US Large Cap 500',
            descriptionKo: '미국 대형주 500개 - 가장 대표적인 미국 시장 지수',
          },
          {
            ticker: 'VTI',
            name: 'Vanguard Total Stock',
            nameKo: 'Vanguard Total Stock',
            description: 'Total US Market',
            descriptionKo: '미국 주식 시장 전체 - 대형+중소형 포함',
          },
          {
            ticker: 'QQQ',
            name: 'Invesco QQQ',
            nameKo: 'Invesco QQQ',
            description: 'Nasdaq 100',
            descriptionKo: '나스닥 100 - 기술주 중심, 변동성 큼',
          },
          {
            ticker: 'IWM',
            name: 'iShares Russell 2000',
            nameKo: 'iShares Russell 2000',
            description: 'US Small Cap',
            descriptionKo: '미국 소형주 2000개 - 경기 회복기에 탄력적',
          },
          {
            ticker: 'RSP',
            name: 'Invesco S&P 500 Equal',
            nameKo: 'Invesco S&P 500 Equal',
            description: 'S&P 500 Equal Weight',
            descriptionKo: 'S&P 500 동일비중 - 쏠림 현상 방지',
          },
        ],
      },
      {
        label: 'Developed Markets',
        labelKo: '🌏 선진국 주식',
        etfs: [
          {
            ticker: 'VEA',
            name: 'Vanguard Developed',
            nameKo: 'Vanguard Developed',
            description: 'Ex-US Developed',
            descriptionKo: '미국 제외 선진국 - 유럽, 일본, 캐나다 등',
          },
          {
            ticker: 'EFA',
            name: 'iShares MSCI EAFE',
            nameKo: 'iShares MSCI EAFE',
            description: 'Ex-US Developed',
            descriptionKo: '미국 제외 선진국 - VEA와 유사, 거래량 많음',
          },
          {
            ticker: 'VGK',
            name: 'Vanguard European',
            nameKo: 'Vanguard European',
            description: 'Europe Stock',
            descriptionKo: '유럽 전체 - 유럽 집중 투자',
          },
          {
            ticker: 'EWJ',
            name: 'iShares MSCI Japan',
            nameKo: 'iShares MSCI Japan',
            description: 'Japan Stock',
            descriptionKo: '일본 전체 - 일본 집중 투자',
          },
        ],
      },
      {
        label: 'Emerging Markets',
        labelKo: '📈 신흥국 주식',
        etfs: [
          {
            ticker: 'VWO',
            name: 'Vanguard Emerging',
            nameKo: 'Vanguard Emerging',
            description: 'Emerging Markets',
            descriptionKo: '신흥국 전체 - 중국, 대만, 인도, 브라질 등',
          },
          {
            ticker: 'EEM',
            name: 'iShares MSCI Emerging',
            nameKo: 'iShares MSCI Emerging',
            description: 'Emerging Markets',
            descriptionKo: '신흥국 전체 - VWO보다 유동성 풍부',
          },
          {
            ticker: 'IEMG',
            name: 'iShares Core Emerging',
            nameKo: 'iShares Core Emerging',
            description: 'Emerging Markets',
            descriptionKo: '신흥국 전체 - 중소형주 포함, 한국 비중 높음',
          },
        ],
      },
    ],
  },
  {
    label: 'Fixed Income (Bonds)',
    labelKo: '채권형 - 수비수',
    categories: [
      {
        label: 'Treasury',
        labelKo: '🛡️ 국채',
        etfs: [
          {
            ticker: 'SHY',
            name: 'iShares 1-3 Year',
            nameKo: 'iShares 1-3 Year',
            description: 'Short-Term Treasury',
            descriptionKo: '미국 단기 국채 - 현금 대용 (변동성 매우 낮음)',
          },
          {
            ticker: 'BIL',
            name: 'SPDR 1-3 Month',
            nameKo: 'SPDR 1-3 Month',
            description: 'Ultra Short Treasury',
            descriptionKo: '초단기 국채 - 거의 현금과 동일',
          },
          {
            ticker: 'IEF',
            name: 'iShares 7-10 Year',
            nameKo: 'iShares 7-10 Year',
            description: 'Mid-Term Treasury',
            descriptionKo: '미국 중기 국채 - 주식 하락 시 방어 역할',
          },
          {
            ticker: 'TLT',
            name: 'iShares 20+ Year',
            nameKo: 'iShares 20+ Year',
            description: 'Long-Term Treasury',
            descriptionKo: '미국 장기 국채 - 방어력 최강, 금리 민감',
          },
          {
            ticker: 'BND',
            name: 'Vanguard Total Bond',
            nameKo: 'Vanguard Total Bond',
            description: 'Total Bond Market',
            descriptionKo: '미국 채권 시장 전체 - 국채+회사채 혼합',
          },
        ],
      },
      {
        label: 'Corporate',
        labelKo: '🏢 회사채',
        etfs: [
          {
            ticker: 'LQD',
            name: 'iShares Inv Grade',
            nameKo: 'iShares Inv Grade',
            description: 'Investment Grade',
            descriptionKo: '투자등급 회사채 - 우량 기업 채권',
          },
          {
            ticker: 'HYG',
            name: 'iShares High Yield',
            nameKo: 'iShares High Yield',
            description: 'High Yield Bond',
            descriptionKo: '하이일드 채권 - 고수익/고위험',
          },
        ],
      },
    ],
  },
  {
    label: 'Alternatives',
    labelKo: '대체자산형 - 인플레 방어',
    categories: [
      {
        label: 'Commodities & Precious Metals',
        labelKo: '🛢️ 원자재 & 귀금속',
        etfs: [
          {
            ticker: 'GSG',
            name: 'iShares S&P GSCI',
            nameKo: 'iShares S&P GSCI',
            description: 'Broad Commodities',
            descriptionKo: '원자재 종합 선물 - 에너지 비중 높음 (FAA 정석)',
          },
          {
            ticker: 'DBC',
            name: 'Invesco DB Cmdty',
            nameKo: 'Invesco DB Cmdty',
            description: 'Broad Commodities',
            descriptionKo: '원자재 종합 - 거래량이 많고 대중적',
          },
          {
            ticker: 'GLD',
            name: 'SPDR Gold Shares',
            nameKo: 'SPDR Gold Shares',
            description: 'Gold',
            descriptionKo: '금 - 안전자산 + 인플레 헷지',
          },
          {
            ticker: 'IAU',
            name: 'iShares Gold Trust',
            nameKo: 'iShares Gold Trust',
            description: 'Gold',
            descriptionKo: '금 - GLD보다 주당 가격 낮음',
          },
        ],
      },
      {
        label: 'Real Estate',
        labelKo: '🏘️ 부동산',
        etfs: [
          {
            ticker: 'VNQ',
            name: 'Vanguard Real Estate',
            nameKo: 'Vanguard Real Estate',
            description: 'US REITs',
            descriptionKo: '미국 리츠 전체 - 상업용, 주거용 부동산 포함',
          },
          {
            ticker: 'IYR',
            name: 'iShares US Real Estate',
            nameKo: 'iShares US Real Estate',
            description: 'US Real Estate',
            descriptionKo: '미국 부동산 - 블랙록 운용, 유동성 풍부',
          },
        ],
      },
    ],
  },
]

// Helper function to get all tickers as a flat array
export function getAllTickers(): string[] {
  const tickers: string[] = []
  ETF_LIST.forEach((group) => {
    group.categories.forEach((category) => {
      category.etfs.forEach((etf) => {
        tickers.push(etf.ticker)
      })
    })
  })
  return tickers
}

// Helper function to find ETF by ticker
export function findETF(ticker: string): ETFInfo | undefined {
  for (const group of ETF_LIST) {
    for (const category of group.categories) {
      const etf = category.etfs.find((e) => e.ticker === ticker)
      if (etf) return etf
    }
  }
  return undefined
}

// Default 7 tickers
export const DEFAULT_TICKERS = ['VTI', 'VEA', 'VWO', 'SHY', 'BND', 'GSG', 'VNQ']
