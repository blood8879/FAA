# FAA Stock Selection Calculator

A Next.js application that implements the Flexible Asset Allocation (FAA) strategy for selecting top-performing stocks and ETFs.

## Features

- **7 Asset Selection**: Choose any 7 ETFs or stocks to analyze
- **FAA Metrics Calculation**:
  - **Momentum**: 4-month return performance
  - **Volatility**: Standard deviation of daily returns
  - **Correlation**: Average correlation with other assets
  - **Weighted Score**: `(Momentum × 1) + (Volatility × 0.5) + (Correlation × 0.5)`
- **Top 3 Selection**: Automatically selects the top 3 assets by weighted score
- **Cash Allocation**: Assets with negative momentum are replaced with CASH
- **Purchase Calculator**:
  - Supports both KRW and USD input
  - Calculates how many shares you can buy (including fractional shares)
  - Real-time exchange rate conversion for KRW

## Tech Stack

- **Framework**: Next.js 16 (App Router) with React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4 + Radix UI
- **Stock Data**: Yahoo Finance API (via yahoo-finance2)
- **Exchange Rate**: ExchangeRate-API (free tier)
- **Storage**: LocalStorage for ticker persistence

## Getting Started

### Prerequisites

- Node.js 20+ and npm

### Installation

1. Clone the repository:
```bash
cd faa
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. **Enter Tickers**: Input 7 ETF or stock tickers (e.g., VTI, VEA, VWO, SHY, BND, GSG, VNQ)
2. **Calculate**: Click "Calculate FAA Scores" to analyze the assets
3. **View Results**:
   - See metrics for all 7 assets
   - Top 3 selections are highlighted
   - Assets with negative momentum show CASH allocation
4. **Purchase Planning**:
   - Select currency (KRW or USD)
   - Enter investment amount
   - Get share allocation for each selected asset

## Project Structure

```
faa/
├── src/
│   ├── app/
│   │   ├── api/              # API Routes
│   │   │   ├── stocks/       # Stock data endpoints
│   │   │   └── exchange-rate/# Exchange rate endpoint
│   │   └── page.tsx          # Main calculator page
│   ├── components/
│   │   ├── ui/               # Shadcn UI components
│   │   └── faa/              # FAA-specific components
│   ├── lib/
│   │   ├── calculations/     # FAA calculation logic
│   │   └── api-client/       # API client functions
│   ├── hooks/                # Custom React hooks
│   └── types/                # TypeScript types
```

## API Routes

### POST /api/stocks/historical
Fetches 4 months of daily historical data for given tickers.

**Request**: `{ tickers: string[] }`
**Cache**: 5 minutes

### POST /api/stocks/quote
Fetches current stock prices.

**Request**: `{ tickers: string[] }`
**Cache**: 1 minute

### GET /api/exchange-rate
Fetches USD to KRW exchange rate.

**Cache**: 1 hour

## FAA Calculation Details

### Momentum
```
momentum = (latest_price - price_4_months_ago) / price_4_months_ago
```

### Volatility
```
volatility = standard_deviation(daily_returns)
where daily_return = (price[i] - price[i-1]) / price[i-1]
```

### Correlation
```
correlation = average(pearson_correlation(asset, other_assets))
```

### Weighted Score
```
score = (momentum × 1.0) + (volatility × 0.5) + (correlation × 0.5)
```

## Build for Production

```bash
npm run build
npm start
```

## Development Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm start` - Start production server

## Notes

- Ticker selections are saved to LocalStorage
- Yahoo Finance API has informal rate limits (~2000 requests/hour)
- ExchangeRate-API free tier: 1500 requests/month
- All calculations are performed client-side after data fetch

## Future Enhancements

- Portfolio saving with user authentication
- Historical performance tracking
- Backtesting functionality
- Charts and visualizations
- Multiple allocation strategies (BAA, PAA)
- Export results to CSV/PDF

## License

MIT

## Reference

Based on the Flexible Asset Allocation (FAA) strategy described at [jasan-calc.netlify.app/faa](https://jasan-calc.netlify.app/faa)
# FAA
