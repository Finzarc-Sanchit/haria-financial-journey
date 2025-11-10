/**
 * Portfolio Builder Component
 * 
 * Yahoo Finance-inspired stock portfolio builder with:
 * - Left Sidebar: Filters (Sector, Market Cap, Performance, Search)
 * - Center: Sortable Stock Table
 * - Right Sidebar: Portfolio Holdings
 * - Modal: Detailed Stock View with Add to Portfolio
 */

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
    Search,
    TrendingUp,
    TrendingDown,
    ArrowUpDown,
    Plus,
    Trash2,
    X,
} from 'lucide-react';
import { StockData, Portfolio } from '@/services/stockService';
import { getAllSectors, getMarketCapCategories } from '@/services/stockDatabase';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import stockService from '@/services/stockService';

interface PortfolioBuilderProps {
    liveStocks: StockData[];
    displayedStocks: StockData[];
    selectedSectors: string[];
    selectedMarketCap: string;
    selectedFilter: 'all' | 'gainers' | 'losers' | 'active';
    stockSearch: string;
    sortBy: 'symbol' | 'price' | 'change' | 'volume';
    sortOrder: 'asc' | 'desc';
    portfolio: Portfolio | null;
    onToggleSector: (sector: string) => void;
    onSelectMarketCap: (cap: string) => void;
    onSelectFilter: (filter: 'all' | 'gainers' | 'losers' | 'active') => void;
    onSearchChange: (query: string) => void;
    onSort: (column: 'symbol' | 'price' | 'change' | 'volume') => void;
    onAddToPortfolio: (symbol: string, quantity: number, buyPrice: number) => void;
    onRemoveFromPortfolio: (symbol: string) => void;
}

export default function PortfolioBuilder({
    liveStocks,
    displayedStocks,
    selectedSectors,
    selectedMarketCap,
    selectedFilter,
    stockSearch,
    sortBy,
    sortOrder,
    portfolio,
    onToggleSector,
    onSelectMarketCap,
    onSelectFilter,
    onSearchChange,
    onSort,
    onAddToPortfolio,
    onRemoveFromPortfolio
}: PortfolioBuilderProps) {
    const [showStockModal, setShowStockModal] = useState(false);
    const [selectedStock, setSelectedStock] = useState<StockData | null>(null);
    const [showAddToPortfolio, setShowAddToPortfolio] = useState(false);
    const [addQuantity, setAddQuantity] = useState('');
    const [addBuyPrice, setAddBuyPrice] = useState('');
    const [chartPeriod, setChartPeriod] = useState<'1D' | '1W' | '1M' | '3M' | '1Y'>('1M');
    const [chartData, setChartData] = useState<Array<{ date: string; price: number; volume: number }>>([]);

    const sectors = getAllSectors();
    const marketCapCategories = getMarketCapCategories();

    const handleStockClick = (stock: StockData) => {
        setSelectedStock(stock);
        setShowStockModal(true);
        // Generate chart data
        const days = chartPeriod === '1D' ? 1 : chartPeriod === '1W' ? 7 : chartPeriod === '1M' ? 30 : chartPeriod === '3M' ? 90 : 365;
        const historicalData = stockService.generateHistoricalData(stock, days);
        setChartData(historicalData);
    };

    const handleAddToPortfolioClick = () => {
        if (!selectedStock) return;
        setShowAddToPortfolio(true);
        setAddBuyPrice(selectedStock.price.toFixed(2));
    };

    const confirmAddToPortfolio = () => {
        if (!selectedStock || !addQuantity || !addBuyPrice) return;
        
        const quantity = parseFloat(addQuantity);
        const buyPrice = parseFloat(addBuyPrice);
        
        if (isNaN(quantity) || isNaN(buyPrice) || quantity <= 0 || buyPrice <= 0) {
            alert('Please enter valid quantity and buy price');
            return;
        }

        const symbol = selectedStock.symbol.includes('.NS') ? selectedStock.symbol : `${selectedStock.symbol}.NS`;
        onAddToPortfolio(symbol, quantity, buyPrice);
        
        setShowAddToPortfolio(false);
        setAddQuantity('');
        setAddBuyPrice('');
        setShowStockModal(false);
    };

    const getSortIcon = (column: string) => {
        if (sortBy === column) {
            return sortOrder === 'asc' ? '↑' : '↓';
        }
        return <ArrowUpDown className="h-3 w-3 opacity-30" />;
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* LEFT SIDEBAR - FILTERS */}
            <div className="lg:col-span-3">
                <Card className="sticky top-4">
                    <CardHeader>
                        <CardTitle className="text-lg font-playfair text-tertiary flex items-center">
                            <Search className="h-4 w-4 mr-2 text-secondary" />
                            Filters
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Search */}
                        <div>
                            <Label className="text-sm font-crimson font-semibold text-tertiary mb-2">Search Stocks</Label>
                            <div className="relative">
                                <Input
                                    placeholder="Search by symbol or name..."
                                    value={stockSearch}
                                    onChange={(e) => onSearchChange(e.target.value)}
                                    className="pl-8 font-crimson text-sm"
                                />
                                <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-tertiary/60" />
                            </div>
                            <p className="text-xs text-tertiary/60 font-crimson mt-1">{liveStocks.length}+ stocks available</p>
                        </div>

                        {/* Performance Filter */}
                        <div>
                            <Label className="text-sm font-crimson font-semibold text-tertiary mb-2">Performance</Label>
                            <div className="space-y-2">
                                {[
                                    { value: 'all', label: 'All Stocks' },
                                    { value: 'gainers', label: 'Day Gainers' },
                                    { value: 'losers', label: 'Day Losers' },
                                    { value: 'active', label: 'Most Active' },
                                ].map((filter) => (
                                    <button
                                        key={filter.value}
                                        onClick={() => onSelectFilter(filter.value as any)}
                                        className={`w-full text-left px-3 py-2 rounded-lg text-sm font-crimson transition-colors ${
                                            selectedFilter === filter.value
                                                ? 'bg-secondary text-white font-semibold'
                                                : 'bg-gray-50 text-tertiary hover:bg-gray-100'
                                        }`}
                                    >
                                        {filter.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Market Cap Filter */}
                        <div>
                            <Label className="text-sm font-crimson font-semibold text-tertiary mb-2">Market Cap</Label>
                            <div className="space-y-2">
                                <button
                                    onClick={() => onSelectMarketCap('')}
                                    className={`w-full text-left px-3 py-2 rounded-lg text-sm font-crimson transition-colors ${
                                        !selectedMarketCap
                                            ? 'bg-secondary text-white font-semibold'
                                            : 'bg-gray-50 text-tertiary hover:bg-gray-100'
                                    }`}
                                >
                                    All Caps
                                </button>
                                {marketCapCategories.map((cap) => (
                                    <button
                                        key={cap}
                                        onClick={() => onSelectMarketCap(cap)}
                                        className={`w-full text-left px-3 py-2 rounded-lg text-sm font-crimson transition-colors ${
                                            selectedMarketCap === cap
                                                ? 'bg-secondary text-white font-semibold'
                                                : 'bg-gray-50 text-tertiary hover:bg-gray-100'
                                        }`}
                                    >
                                        {cap}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Sector Filter */}
                        <div>
                            <Label className="text-sm font-crimson font-semibold text-tertiary mb-2">Sectors</Label>
                            <div className="space-y-2 max-h-60 overflow-y-auto">
                                {sectors.map((sector) => (
                                    <label
                                        key={sector}
                                        className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={selectedSectors.includes(sector)}
                                            onChange={() => onToggleSector(sector)}
                                            className="rounded border-gray-300 text-secondary focus:ring-secondary"
                                        />
                                        <span className="text-sm font-crimson text-tertiary">{sector}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Clear Filters */}
                        {(selectedSectors.length > 0 || selectedMarketCap || selectedFilter !== 'all') && (
                            <Button
                                onClick={() => {
                                    onSelectFilter('all');
                                    onSelectMarketCap('');
                                    selectedSectors.forEach(s => onToggleSector(s));
                                }}
                                variant="outline"
                                className="w-full font-crimson text-sm"
                            >
                                Clear All Filters
                            </Button>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* CENTER - STOCK TABLE */}
            <div className="lg:col-span-6">
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-lg font-playfair text-tertiary">
                                Stocks ({displayedStocks.length})
                            </CardTitle>
                            <p className="text-sm text-tertiary/60 font-crimson">Click to view details</p>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {/* Table */}
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-200">
                                        <th
                                            onClick={() => onSort('symbol')}
                                            className="text-left py-3 px-4 cursor-pointer hover:bg-gray-50 transition-colors"
                                        >
                                            <div className="flex items-center gap-1 text-sm font-crimson font-semibold text-tertiary">
                                                Symbol {getSortIcon('symbol')}
                                            </div>
                                        </th>
                                        <th className="text-left py-3 px-4">
                                            <div className="text-sm font-crimson font-semibold text-tertiary">Name</div>
                                        </th>
                                        <th
                                            onClick={() => onSort('price')}
                                            className="text-right py-3 px-4 cursor-pointer hover:bg-gray-50 transition-colors"
                                        >
                                            <div className="flex items-center justify-end gap-1 text-sm font-crimson font-semibold text-tertiary">
                                                Price {getSortIcon('price')}
                                            </div>
                                        </th>
                                        <th
                                            onClick={() => onSort('change')}
                                            className="text-right py-3 px-4 cursor-pointer hover:bg-gray-50 transition-colors"
                                        >
                                            <div className="flex items-center justify-end gap-1 text-sm font-crimson font-semibold text-tertiary">
                                                Change {getSortIcon('change')}
                                            </div>
                                        </th>
                                        <th className="text-left py-3 px-4">
                                            <div className="text-sm font-crimson font-semibold text-tertiary">Sector</div>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {displayedStocks.slice(0, 50).map((stock) => (
                                        <motion.tr
                                            key={stock.symbol}
                                            onClick={() => handleStockClick(stock)}
                                            className="border-b border-gray-100 hover:bg-secondary/5 cursor-pointer transition-colors"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                        >
                                            <td className="py-3 px-4">
                                                <div className="font-playfair font-bold text-tertiary">{stock.symbol}</div>
                                            </td>
                                            <td className="py-3 px-4">
                                                <div className="text-sm font-crimson text-tertiary/80 truncate max-w-xs">{stock.name}</div>
                                            </td>
                                            <td className="py-3 px-4 text-right">
                                                <div className="font-playfair font-semibold text-tertiary">₹{stock.price.toFixed(2)}</div>
                                            </td>
                                            <td className="py-3 px-4 text-right">
                                                <div className={`flex items-center justify-end gap-1 font-crimson font-semibold ${stock.changePercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                    {stock.changePercent >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                                                    {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                                                </div>
                                            </td>
                                            <td className="py-3 px-4">
                                                {stock.sector && (
                                                    <Badge variant="outline" className="text-xs font-crimson">{stock.sector}</Badge>
                                                )}
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                            {displayedStocks.length === 0 && (
                                <div className="text-center py-12">
                                    <p className="text-tertiary/60 font-crimson">No stocks match your filters</p>
                                </div>
                            )}
                            {displayedStocks.length > 50 && (
                                <div className="text-center py-4 border-t border-gray-200">
                                    <p className="text-sm text-tertiary/60 font-crimson">
                                        Showing 50 of {displayedStocks.length} stocks. Refine filters to see more.
                                    </p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* RIGHT SIDEBAR - PORTFOLIO */}
            <div className="lg:col-span-3">
                <Card className="sticky top-4">
                    <CardHeader>
                        <CardTitle className="text-lg font-playfair text-tertiary">My Portfolio</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {portfolio && portfolio.holdings.length > 0 ? (
                            <div className="space-y-4">
                                {/* Portfolio Summary */}
                                <div className="p-4 bg-gradient-to-br from-secondary/10 to-transparent rounded-lg border border-secondary/20">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-sm text-tertiary/70 font-crimson">Portfolio Value</span>
                                        <span className="text-xl font-playfair font-bold text-tertiary">
                                            ₹{portfolio.totalCurrentValue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-sm text-tertiary/70 font-crimson">Invested</span>
                                        <span className="text-base font-crimson text-tertiary">
                                            ₹{portfolio.totalInvested.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center pt-2 border-t border-tertiary/10">
                                        <span className="text-sm text-tertiary/70 font-crimson">Total Gain</span>
                                        <span className={`text-lg font-playfair font-bold ${portfolio.totalGain >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                            {portfolio.totalGain >= 0 ? '+' : ''}₹{portfolio.totalGain.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                                            <span className="text-sm ml-1">({portfolio.totalGainPercent.toFixed(2)}%)</span>
                                        </span>
                                    </div>
                                </div>

                                {/* Holdings */}
                                <div className="space-y-2">
                                    <h4 className="text-sm font-crimson font-semibold text-tertiary">Holdings</h4>
                                    <div className="space-y-2 max-h-96 overflow-y-auto">
                                        {portfolio.holdings.map((holding) => (
                                            <div key={holding.symbol} className="p-3 bg-gray-50 rounded-lg">
                                                <div className="flex items-start justify-between mb-1">
                                                    <div>
                                                        <div className="font-playfair font-bold text-tertiary text-sm">{holding.symbol.replace('.NS', '')}</div>
                                                        <div className="text-xs text-tertiary/60 font-crimson">{holding.quantity} shares</div>
                                                    </div>
                                                    <button
                                                        onClick={() => onRemoveFromPortfolio(holding.symbol)}
                                                        className="text-red-600 hover:text-red-700 transition-colors"
                                                    >
                                                        <Trash2 className="h-3.5 w-3.5" />
                                                    </button>
                                                </div>
                                                <div className="flex justify-between items-center text-xs">
                                                    <span className="text-tertiary/60 font-crimson">₹{holding.buyPrice.toFixed(2)} → ₹{holding.currentPrice.toFixed(2)}</span>
                                                    <span className={`font-crimson font-semibold ${holding.gain >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                        {holding.gain >= 0 ? '+' : ''}₹{holding.gain.toFixed(0)}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Sector Allocation */}
                                <div className="space-y-2">
                                    <h4 className="text-sm font-crimson font-semibold text-tertiary">Sector Allocation</h4>
                                    <div className="space-y-2">
                                        {Object.entries(portfolio.sectorAllocation).map(([sector, data]) => (
                                            <div key={sector}>
                                                <div className="flex justify-between text-xs mb-1">
                                                    <span className="font-crimson text-tertiary">{sector}</span>
                                                    <span className="font-crimson text-tertiary/60">{data.percent.toFixed(1)}%</span>
                                                </div>
                                                <div className="w-full bg-gray-200 rounded-full h-1.5">
                                                    <div
                                                        className="bg-secondary h-1.5 rounded-full transition-all duration-500"
                                                        style={{ width: `${data.percent}%` }}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <p className="text-tertiary/60 font-crimson mb-2">Your portfolio is empty</p>
                                <p className="text-sm text-tertiary/40 font-crimson">Click on a stock to add it to your portfolio</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* STOCK DETAIL MODAL */}
            <Dialog open={showStockModal} onOpenChange={setShowStockModal}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    {selectedStock && (
                        <>
                            <DialogHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <DialogTitle className="text-2xl font-playfair text-tertiary flex items-center gap-2">
                                            {selectedStock.symbol}
                                            <Badge className={selectedStock.changePercent >= 0 ? "bg-green-600" : "bg-red-600"}>
                                                {selectedStock.changePercent >= 0 ? "+" : ""}{selectedStock.changePercent.toFixed(2)}%
                                            </Badge>
                                        </DialogTitle>
                                        <DialogDescription className="font-crimson">{selectedStock.name}</DialogDescription>
                                        {selectedStock.sector && (
                                            <Badge variant="outline" className="mt-1 font-crimson">{selectedStock.sector}</Badge>
                                        )}
                                    </div>
                                    <div className="text-right">
                                        <div className="text-3xl font-playfair font-bold text-tertiary">
                                            ₹{selectedStock.price.toFixed(2)}
                                        </div>
                                        <div className={`text-sm font-crimson ${selectedStock.changePercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                            {selectedStock.changePercent >= 0 ? '+' : ''}₹{selectedStock.change.toFixed(2)}
                                        </div>
                                    </div>
                                </div>
                            </DialogHeader>

                            <div className="space-y-4">
                                {/* Chart Period Selector */}
                                <div className="flex gap-2">
                                    {(['1D', '1W', '1M', '3M', '1Y'] as const).map((period) => (
                                        <button
                                            key={period}
                                            onClick={() => {
                                                setChartPeriod(period);
                                                const days = period === '1D' ? 1 : period === '1W' ? 7 : period === '1M' ? 30 : period === '3M' ? 90 : 365;
                                                const historicalData = stockService.generateHistoricalData(selectedStock, days);
                                                setChartData(historicalData);
                                            }}
                                            className={`px-3 py-1.5 rounded-lg font-crimson text-sm transition-all ${
                                                chartPeriod === period
                                                    ? 'bg-secondary text-white font-semibold'
                                                    : 'bg-gray-100 text-tertiary hover:bg-gray-200'
                                            }`}
                                        >
                                            {period}
                                        </button>
                                    ))}
                                </div>

                                {/* Price Chart */}
                                <div className="h-64 w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={chartData}>
                                            <defs>
                                                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#DAA520" stopOpacity={0.3}/>
                                                    <stop offset="95%" stopColor="#DAA520" stopOpacity={0}/>
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                                            <XAxis 
                                                dataKey="date" 
                                                stroke="#1a5f7a" 
                                                style={{ fontFamily: 'Crimson Text', fontSize: '12px' }}
                                            />
                                            <YAxis 
                                                stroke="#1a5f7a"
                                                style={{ fontFamily: 'Crimson Text', fontSize: '12px' }}
                                                tickFormatter={(value) => `₹${value}`}
                                            />
                                            <Tooltip 
                                                contentStyle={{ 
                                                    background: '#fff',
                                                    border: '2px solid #DAA520',
                                                    borderRadius: '8px',
                                                    fontFamily: 'Crimson Text'
                                                }}
                                                formatter={(value: any) => [`₹${value.toFixed(2)}`, 'Price']}
                                            />
                                            <Area 
                                                type="monotone" 
                                                dataKey="price" 
                                                stroke="#DAA520" 
                                                strokeWidth={2}
                                                fill="url(#colorPrice)"
                                            />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>

                                {/* Stock Metrics */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                    <div className="p-3 bg-gradient-to-br from-blue-50 to-white rounded-lg border border-blue-100">
                                        <div className="text-xs text-tertiary/60 font-crimson mb-1">Open</div>
                                        <div className="text-base font-playfair font-bold text-tertiary">
                                            ₹{(selectedStock.open || selectedStock.price).toFixed(2)}
                                        </div>
                                    </div>
                                    <div className="p-3 bg-gradient-to-br from-green-50 to-white rounded-lg border border-green-100">
                                        <div className="text-xs text-tertiary/60 font-crimson mb-1">High</div>
                                        <div className="text-base font-playfair font-bold text-green-600">
                                            ₹{selectedStock.high.toFixed(2)}
                                        </div>
                                    </div>
                                    <div className="p-3 bg-gradient-to-br from-red-50 to-white rounded-lg border border-red-100">
                                        <div className="text-xs text-tertiary/60 font-crimson mb-1">Low</div>
                                        <div className="text-base font-playfair font-bold text-red-600">
                                            ₹{selectedStock.low.toFixed(2)}
                                        </div>
                                    </div>
                                    <div className="p-3 bg-gradient-to-br from-purple-50 to-white rounded-lg border border-purple-100">
                                        <div className="text-xs text-tertiary/60 font-crimson mb-1">Volume</div>
                                        <div className="text-base font-playfair font-bold text-tertiary">
                                            {(selectedStock.volume / 1000000).toFixed(2)}M
                                        </div>
                                    </div>
                                </div>

                                {selectedStock.marketCap && (
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="p-3 bg-secondary/5 rounded-lg">
                                            <div className="text-xs text-tertiary/60 font-crimson mb-1">Market Cap</div>
                                            <div className="text-base font-playfair font-bold text-tertiary">₹{selectedStock.marketCap}</div>
                                        </div>
                                        {selectedStock.peRatio && (
                                            <div className="p-3 bg-secondary/5 rounded-lg">
                                                <div className="text-xs text-tertiary/60 font-crimson mb-1">P/E Ratio</div>
                                                <div className="text-base font-playfair font-bold text-tertiary">{selectedStock.peRatio.toFixed(2)}</div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Add to Portfolio Form */}
                                {!showAddToPortfolio && (
                                    <Button
                                        onClick={handleAddToPortfolioClick}
                                        className="w-full bg-secondary hover:bg-secondary/90 text-white font-crimson"
                                    >
                                        <Plus className="h-4 w-4 mr-2" />
                                        Add to Portfolio
                                    </Button>
                                )}

                                {showAddToPortfolio && (
                                    <div className="p-4 bg-secondary/5 rounded-lg space-y-3">
                                        <h4 className="font-playfair font-bold text-tertiary">Add to Portfolio</h4>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <Label className="text-sm font-crimson">Quantity</Label>
                                                <Input
                                                    type="number"
                                                    value={addQuantity}
                                                    onChange={(e) => setAddQuantity(e.target.value)}
                                                    placeholder="e.g. 10"
                                                    className="font-crimson"
                                                />
                                            </div>
                                            <div>
                                                <Label className="text-sm font-crimson">Buy Price (₹)</Label>
                                                <Input
                                                    type="number"
                                                    value={addBuyPrice}
                                                    onChange={(e) => setAddBuyPrice(e.target.value)}
                                                    placeholder="e.g. 100"
                                                    className="font-crimson"
                                                />
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button
                                                onClick={confirmAddToPortfolio}
                                                className="flex-1 bg-secondary hover:bg-secondary/90 text-white font-crimson"
                                            >
                                                Confirm
                                            </Button>
                                            <Button
                                                onClick={() => setShowAddToPortfolio(false)}
                                                variant="outline"
                                                className="flex-1 font-crimson"
                                            >
                                                Cancel
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
};

