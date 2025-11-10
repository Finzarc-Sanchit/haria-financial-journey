// Yahoo Finance API service for live stock data
// Free and legal API without requiring API keys

export interface StockData {
    symbol: string;
    name: string;
    price: number;
    change: number;
    changePercent: number;
    high: number;
    low: number;
    volume: number;
    open?: number;
    previousClose?: number;
    marketCap?: string;
    marketCapCategory?: 'Large Cap' | 'Mid Cap' | 'Small Cap';
    peRatio?: number;
    week52High?: number;
    week52Low?: number;
    avgVolume?: number;
    sector?: string;
}

export interface PortfolioHolding {
    symbol: string;
    name: string;
    quantity: number;
    buyPrice: number;
    currentPrice: number;
    sector: string;
    invested: number; // quantity * buyPrice
    currentValue: number; // quantity * currentPrice
    gain: number; // currentValue - invested
    gainPercent: number; // (gain / invested) * 100
}

export interface Portfolio {
    holdings: PortfolioHolding[];
    totalInvested: number;
    totalCurrentValue: number;
    totalGain: number;
    totalGainPercent: number;
    sectorAllocation: { [sector: string]: { value: number; percent: number } };
}

// Import comprehensive stock database
import { NSE_STOCKS, getAllSectors, getMarketCapCategories, searchStocks as dbSearchStocks, filterStocks } from './stockDatabase';

// Export for backward compatibility
export const POPULAR_INDIAN_STOCKS = NSE_STOCKS;

// Fallback data for when API fails
const FALLBACK_DATA: Record<string, StockData> = {
    'RELIANCE.NS': { symbol: 'RELIANCE', name: 'Reliance Industries', price: 2456.78, change: 34.50, changePercent: 1.42, high: 2478.90, low: 2430.20, volume: 8945632, open: 2422.35, previousClose: 2422.28, marketCap: '16.61T', peRatio: 28.5, week52High: 2856.50, week52Low: 2220.30, avgVolume: 9234567, sector: 'Energy' },
    'TCS.NS': { symbol: 'TCS', name: 'Tata Consultancy Services', price: 3890.45, change: -23.15, changePercent: -0.59, high: 3912.30, low: 3875.50, volume: 2134567, open: 3913.60, previousClose: 3913.60, marketCap: '14.18T', peRatio: 32.4, week52High: 4235.80, week52Low: 3311.00, avgVolume: 2456789, sector: 'Technology' },
    'HDFCBANK.NS': { symbol: 'HDFCBANK', name: 'HDFC Bank', price: 1678.90, change: 15.20, changePercent: 0.91, high: 1685.40, low: 1660.30, volume: 5678901, open: 1663.70, previousClose: 1663.70, marketCap: '12.78T', peRatio: 19.8, week52High: 1794.00, week52Low: 1363.50, avgVolume: 6234567, sector: 'Banking' },
    'INFY.NS': { symbol: 'INFY', name: 'Infosys', price: 1456.23, change: 24.30, changePercent: 1.70, high: 1468.50, low: 1442.80, volume: 4567890, open: 1431.93, previousClose: 1431.93, marketCap: '6.04T', peRatio: 26.7, week52High: 1889.50, week52Low: 1351.65, avgVolume: 5123456, sector: 'Technology' },
    'ITC.NS': { symbol: 'ITC', name: 'ITC Limited', price: 456.78, change: -2.15, changePercent: -0.47, high: 460.20, low: 454.30, volume: 9876543, open: 458.93, previousClose: 458.93, marketCap: '5.72T', peRatio: 28.9, week52High: 527.40, week52Low: 404.50, avgVolume: 10234567, sector: 'Consumer Goods' },
    'ICICIBANK.NS': { symbol: 'ICICIBANK', name: 'ICICI Bank', price: 987.50, change: 12.30, changePercent: 1.26, high: 995.80, low: 975.20, volume: 7654321, open: 975.20, previousClose: 975.20, marketCap: '6.94T', peRatio: 18.5, week52High: 1257.80, week52Low: 912.00, avgVolume: 8123456, sector: 'Banking' },
    'HINDUNILVR.NS': { symbol: 'HINDUNILVR', name: 'Hindustan Unilever', price: 2678.90, change: -15.45, changePercent: -0.57, high: 2695.50, low: 2665.30, volume: 1234567, open: 2694.35, previousClose: 2694.35, marketCap: '6.30T', peRatio: 64.3, week52High: 2855.30, week52Low: 2172.00, avgVolume: 1456789, sector: 'Consumer Goods' },
    'SBIN.NS': { symbol: 'SBIN', name: 'State Bank of India', price: 567.80, change: 8.90, changePercent: 1.59, high: 572.40, low: 558.60, volume: 12345678, open: 558.90, previousClose: 558.90, marketCap: '5.07T', peRatio: 9.8, week52High: 912.00, week52Low: 543.20, avgVolume: 13234567, sector: 'Banking' },
    'BHARTIARTL.NS': { symbol: 'BHARTIARTL', name: 'Bharti Airtel', price: 876.45, change: -6.55, changePercent: -0.74, high: 884.90, low: 871.20, volume: 5432109, open: 883.00, previousClose: 883.00, marketCap: '5.14T', peRatio: 35.2, week52High: 1768.00, week52Low: 852.75, avgVolume: 6123456, sector: 'Telecommunications' },
    'BAJFINANCE.NS': { symbol: 'BAJFINANCE', name: 'Bajaj Finance', price: 6789.20, change: 89.50, changePercent: 1.34, high: 6825.70, low: 6745.30, volume: 987654, open: 6699.70, previousClose: 6699.70, marketCap: '4.19T', peRatio: 29.4, week52High: 7875.00, week52Low: 6187.80, avgVolume: 1234567, sector: 'Financial Services' },
};

class StockService {
    private cache: Map<string, { data: StockData; timestamp: number }> = new Map();
    private CACHE_DURATION = 60000; // 1 minute cache

    /**
     * Fetch live stock data from Yahoo Finance
     */
    async fetchStockData(symbol: string): Promise<StockData | null> {
        // Check cache first
        const cached = this.cache.get(symbol);
        if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
            return cached.data;
        }

        try {
            // Use CORS proxy for development or direct API
            const apiUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=1d`;
            
            const response = await fetch(apiUrl, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                },
            });

            if (!response.ok) {
                console.warn(`API returned ${response.status} for ${symbol}`);
                throw new Error('Failed to fetch stock data');
            }

            const data = await response.json();
            
            // Check if we have valid data
            if (!data.chart || !data.chart.result || data.chart.result.length === 0) {
                throw new Error('Invalid data structure');
            }

            const quote = data.chart.result[0];
            const meta = quote.meta;

            if (!meta) {
                throw new Error('Missing meta data');
            }

            // Find sector information
            const stockInfo = POPULAR_INDIAN_STOCKS.find(s => s.symbol === symbol);
            
            // Format market cap
            const formatMarketCap = (value?: number) => {
                if (!value) return undefined;
                if (value >= 1e12) return `${(value / 1e12).toFixed(2)}T`;
                if (value >= 1e9) return `${(value / 1e9).toFixed(2)}B`;
                if (value >= 1e6) return `${(value / 1e6).toFixed(2)}M`;
                return value.toString();
            };
            
            const stockData: StockData = {
                symbol: symbol.replace('.NS', ''),
                name: meta.symbol || stockInfo?.name || symbol,
                price: meta.regularMarketPrice || meta.chartPreviousClose || 0,
                change: (meta.regularMarketPrice || meta.chartPreviousClose || 0) - (meta.previousClose || meta.chartPreviousClose || 0),
                changePercent: meta.previousClose ? (((meta.regularMarketPrice || meta.chartPreviousClose || 0) - meta.previousClose) / meta.previousClose) * 100 : 0,
                high: meta.regularMarketDayHigh || meta.chartPreviousClose || 0,
                low: meta.regularMarketDayLow || meta.chartPreviousClose || 0,
                volume: meta.regularMarketVolume || 0,
                open: meta.regularMarketOpen,
                previousClose: meta.previousClose || meta.chartPreviousClose,
                marketCap: formatMarketCap(meta.marketCap),
                peRatio: meta.trailingPE,
                week52High: meta.fiftyTwoWeekHigh,
                week52Low: meta.fiftyTwoWeekLow,
                avgVolume: meta.averageVolume,
                sector: stockInfo?.sector,
            };

            // Cache the result
            this.cache.set(symbol, { data: stockData, timestamp: Date.now() });

            return stockData;
        } catch (error) {
            console.error(`Error fetching stock data for ${symbol}:`, error);
            // Return fallback data if available
            const fallbackStock = FALLBACK_DATA[symbol];
            if (fallbackStock) {
                console.log(`Using fallback data for ${symbol}`);
                return fallbackStock;
            }
            return null;
        }
    }

    /**
     * Fetch multiple stocks at once with error handling
     */
    async fetchMultipleStocks(symbols: string[]): Promise<StockData[]> {
        try {
            const promises = symbols.map(symbol => 
                this.fetchStockData(symbol).catch(err => {
                    console.error(`Failed to fetch ${symbol}:`, err);
                    return FALLBACK_DATA[symbol] || null;
                })
            );
            const results = await Promise.all(promises);
            const validResults = results.filter((data): data is StockData => data !== null);
            
            // If no results, return fallback data
            if (validResults.length === 0) {
                console.log('All API calls failed, using fallback data');
                return symbols.map(s => FALLBACK_DATA[s]).filter((data): data is StockData => data !== null);
            }
            
            return validResults;
        } catch (error) {
            console.error('Error fetching multiple stocks:', error);
            // Return all available fallback data
            return symbols.map(s => FALLBACK_DATA[s]).filter((data): data is StockData => data !== null);
        }
    }

    /**
     * Search stocks by name or symbol
     */
    async searchStocks(query: string): Promise<Array<{ symbol: string; name: string; sector?: string }>> {
        const lowerQuery = query.toLowerCase();
        return POPULAR_INDIAN_STOCKS.filter(
            stock =>
                stock.name.toLowerCase().includes(lowerQuery) ||
                stock.symbol.toLowerCase().includes(lowerQuery)
        );
    }

    /**
     * Get popular stocks with live data
     */
    async getPopularStocks(limit: number = 10): Promise<StockData[]> {
        const symbols = POPULAR_INDIAN_STOCKS.slice(0, limit).map(s => s.symbol);
        return this.fetchMultipleStocks(symbols);
    }

    /**
     * Get stock name from symbol
     */
    getStockName(symbol: string): string {
        const stock = POPULAR_INDIAN_STOCKS.find(s => s.symbol === symbol);
        return stock?.name || symbol;
    }

    /**
     * Generate historical price data for charting (simulated for demo)
     * In production, fetch actual historical data from API
     */
    generateHistoricalData(stockData: StockData, days: number = 30): Array<{ date: string; price: number; volume: number }> {
        const data: Array<{ date: string; price: number; volume: number }> = [];
        const currentPrice = stockData.price;
        const volatility = 0.02; // 2% daily volatility
        
        for (let i = days; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            
            // Generate price with some random walk
            const randomFactor = 1 + (Math.random() - 0.5) * volatility;
            const dayPrice = i === 0 ? currentPrice : currentPrice * (1 - (i * 0.001)) * randomFactor;
            
            // Generate volume with variation
            const volumeVariation = 0.8 + (Math.random() * 0.4); // 80% to 120% of avg volume
            const dayVolume = stockData.volume * volumeVariation;
            
            data.push({
                date: date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
                price: Math.round(dayPrice * 100) / 100,
                volume: Math.round(dayVolume)
            });
        }
        
        return data;
    }

    /**
     * Calculate portfolio metrics from holdings
     */
    calculatePortfolio(holdings: Array<{ symbol: string; quantity: number; buyPrice: number; stockData: StockData }>): Portfolio {
        const portfolioHoldings: PortfolioHolding[] = holdings.map(holding => {
            const invested = holding.quantity * holding.buyPrice;
            const currentValue = holding.quantity * holding.stockData.price;
            const gain = currentValue - invested;
            const gainPercent = (gain / invested) * 100;

            return {
                symbol: holding.stockData.symbol,
                name: holding.stockData.name,
                quantity: holding.quantity,
                buyPrice: holding.buyPrice,
                currentPrice: holding.stockData.price,
                sector: holding.stockData.sector || 'Others',
                invested,
                currentValue,
                gain,
                gainPercent
            };
        });

        const totalInvested = portfolioHoldings.reduce((sum, h) => sum + h.invested, 0);
        const totalCurrentValue = portfolioHoldings.reduce((sum, h) => sum + h.currentValue, 0);
        const totalGain = totalCurrentValue - totalInvested;
        const totalGainPercent = totalInvested > 0 ? (totalGain / totalInvested) * 100 : 0;

        // Calculate sector allocation
        const sectorAllocation: { [sector: string]: { value: number; percent: number } } = {};
        portfolioHoldings.forEach(holding => {
            if (!sectorAllocation[holding.sector]) {
                sectorAllocation[holding.sector] = { value: 0, percent: 0 };
            }
            sectorAllocation[holding.sector].value += holding.currentValue;
        });

        // Calculate percentages
        Object.keys(sectorAllocation).forEach(sector => {
            sectorAllocation[sector].percent = totalCurrentValue > 0 
                ? (sectorAllocation[sector].value / totalCurrentValue) * 100 
                : 0;
        });

        return {
            holdings: portfolioHoldings,
            totalInvested,
            totalCurrentValue,
            totalGain,
            totalGainPercent,
            sectorAllocation
        };
    }
}

export const stockService = new StockService();
export default stockService;

