import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
    TrendingUp,
    Search,
    ArrowRight,
    Users,
    Target,
    BarChart3,
    PieChart,
    DollarSign,
    Zap,
    CheckCircle,
    Award,
    RefreshCw,
    TrendingDown,
    Activity,
    Clock,
    Plus,
    Trash2,
    Radio,
    AlertCircle,
} from "lucide-react";
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { motion } from 'framer-motion';
import ContactPopup from '@/components/ui/ContactPopup';
import { useContactPopup } from '@/hooks/useContactPopup';
import { useNavigate } from 'react-router-dom';
import CTASection from '@/components/CTASection';
import CircularCarousel from '@/components/ui/circular-carousel';
import stockService, { StockData, POPULAR_INDIAN_STOCKS, Portfolio, PortfolioHolding } from '@/services/stockService';
import { getAllSectors, getMarketCapCategories, NSE_STOCKS } from '@/services/stockDatabase';
import PortfolioBuilder from '@/components/PortfolioBuilder';

const EquityInvestment = () => {
    const [stockTicker, setStockTicker] = useState(0);
    const [searchQuery, setSearchQuery] = useState("");
    const { isOpen, openPopup, closePopup } = useContactPopup();
    const [marketMood, setMarketMood] = useState("bullish");
    const [portfolioValue] = useState(1000000);
    const [portfolioGain] = useState(125000);
    const navigate = useNavigate();
    const [liveStocks, setLiveStocks] = useState<StockData[]>([]);
    const [loadingStocks, setLoadingStocks] = useState(true);
    const [searchResults, setSearchResults] = useState<Array<{ symbol: string; name: string; sector?: string }>>([]);
    const [selectedStock, setSelectedStock] = useState<StockData | null>(null);
    const [activeStockIndex, setActiveStockIndex] = useState(0);
    const [chartData, setChartData] = useState<Array<{ date: string; price: number; volume: number }>>([]);
    const [chartPeriod, setChartPeriod] = useState<'1D' | '1W' | '1M' | '3M' | '1Y'>('1M');
    const [isLiveData, setIsLiveData] = useState(false);
    const [lastUpdateTime, setLastUpdateTime] = useState<Date | null>(null);
    
    // Portfolio Management
    const [portfolioHoldings, setPortfolioHoldings] = useState<Array<{ symbol: string; quantity: number; buyPrice: number }>>([]);
    const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
    const [showAddToPortfolio, setShowAddToPortfolio] = useState(false);
    const [addQuantity, setAddQuantity] = useState<string>('');
    const [addBuyPrice, setAddBuyPrice] = useState<string>('');
    
    // New UI States
    const [selectedSectors, setSelectedSectors] = useState<string[]>([]);
    const [selectedMarketCap, setSelectedMarketCap] = useState<string>('');
    const [selectedFilter, setSelectedFilter] = useState<'all' | 'gainers' | 'losers' | 'active'>('all');
    const [stockSearch, setStockSearch] = useState('');
    const [sortBy, setSortBy] = useState<'symbol' | 'price' | 'change' | 'volume'>('symbol');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    const [showStockModal, setShowStockModal] = useState(false);
    const [displayedStocks, setDisplayedStocks] = useState<StockData[]>([]);

    // Fetch live stock data
    useEffect(() => {
        const fetchLiveStocks = async () => {
            try {
                setLoadingStocks(true);
                const stocks = await stockService.getPopularStocks(20); // Get 20 stocks for better display
                
                // Check if we got real live data (prices are different from fallback)
                const hasLiveData = stocks.length > 0 && stocks[0].price !== 0;
                setIsLiveData(hasLiveData);
                setLastUpdateTime(new Date());
                
                setLiveStocks(stocks);
                // Set initial selected stock
                if (stocks.length > 0 && !selectedStock) {
                    setSelectedStock(stocks[0]);
                }
            } catch (error) {
                console.error('Error fetching live stocks:', error);
                setIsLiveData(false);
            } finally {
                setLoadingStocks(false);
            }
        };

        fetchLiveStocks();
        // Refresh every 30 seconds for more live feel
        const interval = setInterval(fetchLiveStocks, 30000);
        return () => clearInterval(interval);
    }, []);

    // Update chart data when selected stock changes
    useEffect(() => {
        if (selectedStock) {
            const days = chartPeriod === '1D' ? 1 : chartPeriod === '1W' ? 7 : chartPeriod === '1M' ? 30 : chartPeriod === '3M' ? 90 : 365;
            const historicalData = stockService.generateHistoricalData(selectedStock, days);
            setChartData(historicalData);
        }
    }, [selectedStock, chartPeriod]);

    // Calculate portfolio when holdings or live stocks change
    useEffect(() => {
        if (portfolioHoldings.length > 0 && liveStocks.length > 0) {
            const holdingsWithPrices = portfolioHoldings.map(holding => {
                // Find current price from live stocks
                const liveStock = liveStocks.find(s => s.symbol === holding.symbol.replace('.NS', ''));
                const stockData: StockData = liveStock || {
                    symbol: holding.symbol.replace('.NS', ''),
                    name: stockService.getStockName(holding.symbol),
                    price: holding.buyPrice, // Fallback to buy price if live data not available
                    change: 0,
                    changePercent: 0,
                    high: holding.buyPrice,
                    low: holding.buyPrice,
                    volume: 0,
                    sector: POPULAR_INDIAN_STOCKS.find(s => s.symbol === holding.symbol)?.sector || 'Others'
                };
                
                return {
                    symbol: holding.symbol,
                    quantity: holding.quantity,
                    buyPrice: holding.buyPrice,
                    stockData
                };
            });
            
            const calculatedPortfolio = stockService.calculatePortfolio(holdingsWithPrices);
            setPortfolio(calculatedPortfolio);
        } else {
            setPortfolio(null);
        }
    }, [portfolioHoldings, liveStocks]);

    // Filter and sort stocks based on user selection
    useEffect(() => {
        let filtered = [...liveStocks];
        
        // Apply sector filter
        if (selectedSectors.length > 0) {
            filtered = filtered.filter(stock => 
                stock.sector && selectedSectors.includes(stock.sector)
            );
        }
        
        // Apply market cap filter
        if (selectedMarketCap) {
            filtered = filtered.filter(stock => 
                stock.marketCapCategory === selectedMarketCap
            );
        }
        
        // Apply performance filter
        if (selectedFilter === 'gainers') {
            filtered = filtered.filter(stock => stock.changePercent > 0);
        } else if (selectedFilter === 'losers') {
            filtered = filtered.filter(stock => stock.changePercent < 0);
        } else if (selectedFilter === 'active') {
            filtered = filtered.sort((a, b) => b.volume - a.volume);
        }
        
        // Apply search filter
        if (stockSearch.trim()) {
            const searchLower = stockSearch.toLowerCase();
            filtered = filtered.filter(stock =>
                stock.symbol.toLowerCase().includes(searchLower) ||
                stock.name.toLowerCase().includes(searchLower)
            );
        }
        
        // Apply sorting
        filtered.sort((a, b) => {
            let compareValue = 0;
            switch (sortBy) {
                case 'symbol':
                    compareValue = a.symbol.localeCompare(b.symbol);
                    break;
                case 'price':
                    compareValue = a.price - b.price;
                    break;
                case 'change':
                    compareValue = a.changePercent - b.changePercent;
                    break;
                case 'volume':
                    compareValue = a.volume - b.volume;
                    break;
            }
            return sortOrder === 'asc' ? compareValue : -compareValue;
        });
        
        setDisplayedStocks(filtered);
    }, [liveStocks, selectedSectors, selectedMarketCap, selectedFilter, stockSearch, sortBy, sortOrder]);

    const stocks = liveStocks.length > 0 ? liveStocks : [
        { symbol: "RELIANCE", name: "Reliance Industries", price: 2456.78, change: +2.34, changePercent: 0.95, high: 2470, low: 2440, volume: 5000000 },
        { symbol: "TCS", name: "TCS", price: 3890.45, change: -1.23, changePercent: -0.03, high: 3900, low: 3880, volume: 3000000 },
        { symbol: "HDFCBANK", name: "HDFC Bank", price: 1678.90, change: +0.89, changePercent: 0.05, high: 1690, low: 1670, volume: 4000000 },
        { symbol: "INFY", name: "Infosys", price: 1456.23, change: +1.67, changePercent: 0.11, high: 1460, low: 1450, volume: 3500000 },
        { symbol: "ITC", name: "ITC", price: 456.78, change: -0.45, changePercent: -0.10, high: 460, low: 455, volume: 6000000 }
    ];

    const pmsTypes = [
        {
            id: "discretionary",
            title: "Discretionary PMS",
            icon: BarChart3,
            description: "Portfolio manager takes investment decisions on your behalf, offering convenience and expertise.",
            rate: "12-18% annually",
            tenure: "3-5 years",
            minAmount: "₹50 Lakhs",
            features: ["Full investment control", "Professional management", "Regular rebalancing", "Tax optimization"],
            image: "/Portfolio Management/Discretionary-PMS.jpg"
        },
        {
            id: "non-discretionary",
            title: "Non-Discretionary PMS",
            icon: PieChart,
            description: "You make the final investment decisions, with research and recommendations from the portfolio manager.",
            rate: "10-16% annually",
            tenure: "3-5 years",
            minAmount: "₹50 Lakhs",
            features: ["Investment recommendations", "Research support", "Portfolio tracking", "Advisory services"],
            image: "/Portfolio Management/Non-Discretionary-PMS.jpg"
        },
        {
            id: "advisory",
            title: "Advisory PMS",
            icon: Award,
            description: "You receive tailored advice and strategies, but execute transactions yourself.",
            rate: "8-14% annually",
            tenure: "2-4 years",
            minAmount: "₹25 Lakhs",
            features: ["Customized strategies", "Expert guidance", "Self-execution", "Lower fees"],
            image: "/Portfolio Management/Advisory-PMS.png"
        },
    ];

    const investmentStrategies = [
        {
            id: "value",
            title: "Value Investing",
            description: "Invest in undervalued stocks with strong fundamentals",
            icon: Target,
            rate: "Moderate Risk",
            tenure: "3-5 years",
            minAmount: "₹25,000",
            successRate: 85,
            returns: "12-18%",
            features: ["Fundamental analysis", "Long-term focus", "Dividend income", "Risk management"],
            image: "/Equity investment/Value-investing.jpg"
        },
        {
            id: "growth",
            title: "Growth Investing",
            description: "Focus on companies with high growth potential",
            icon: TrendingUp,
            rate: "High Risk",
            tenure: "5-10 years",
            minAmount: "₹50,000",
            successRate: 78,
            returns: "15-25%",
            features: ["High growth potential", "Innovation focus", "Market leadership", "Scalability"],
            image: "/Equity investment/Growth-investing.jpg"
        },
        {
            id: "dividend",
            title: "Dividend Investing",
            description: "Generate regular income through dividend-paying stocks",
            icon: DollarSign,
            rate: "Low Risk",
            tenure: "3+ years",
            minAmount: "₹20,000",
            successRate: 92,
            returns: "8-12%",
            features: ["Regular income", "Stable companies", "Lower volatility", "Tax benefits"],
            image: "/Equity investment/Dividend-investing.jpg"
        },
        {
            id: "momentum",
            title: "Momentum Trading",
            description: "Trade based on price momentum and market trends",
            icon: Zap,
            rate: "Very High Risk",
            tenure: "Short-term",
            minAmount: "₹1,00,000",
            successRate: 65,
            returns: "20-35%",
            features: ["Technical analysis", "Short-term focus", "High frequency", "Trend following"],
            image: "/Equity investment/Momentum-trading.jpg"
        }
    ];

    const advisors = [
        {
            name: "Rajesh Kumar",
            role: "Senior Equity Analyst",
            experience: "15+ years",
            successRate: 89,
            specialization: "Large Cap Stocks",
        },
        {
            name: "Priya Sharma",
            role: "Portfolio Manager",
            experience: "12+ years",
            successRate: 92,
            specialization: "Growth Stocks",
        },
        {
            name: "Amit Patel",
            role: "Technical Analyst",
            experience: "10+ years",
            successRate: 76,
            specialization: "Momentum Trading",
        }
    ];

    const sectors = [
        { name: "Technology", weight: 25, color: "bg-blue-500" },
        { name: "Banking", weight: 20, color: "bg-green-500" },
        { name: "Healthcare", weight: 15, color: "bg-red-500" },
        { name: "Consumer Goods", weight: 12, color: "bg-yellow-500" },
        { name: "Energy", weight: 10, color: "bg-purple-500" },
        { name: "Others", weight: 18, color: "bg-gray-500" }
    ];

    // Handle hash-based scrolling
    useEffect(() => {
        const scrollToHash = () => {
            const hash = window.location.hash.replace('#', '');
            if (!hash) return;
            const el = document.getElementById(hash);
            if (el) {
                setTimeout(() => {
                el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 100);
            }
        };
        scrollToHash();
        window.addEventListener('hashchange', scrollToHash);
        return () => window.removeEventListener('hashchange', scrollToHash);
    }, []);

    // Stock ticker animation
    useEffect(() => {
        const timer = setInterval(() => {
            setStockTicker(prev => (prev + 1) % stocks.length);
        }, 3000);
        return () => clearInterval(timer);
    }, []);

    // Handle stock search
    const handleSearch = async (query: string) => {
        try {
            setSearchQuery(query);
            if (query.length > 1) {
                const results = await stockService.searchStocks(query);
                setSearchResults(results);
            } else {
                setSearchResults([]);
            }
        } catch (error) {
            console.error('Error searching stocks:', error);
            setSearchResults([]);
        }
    };

    // Fetch selected stock details
    const handleSelectStock = async (symbol: string) => {
        try {
            const stockData = await stockService.fetchStockData(symbol);
            if (stockData) {
                setSelectedStock(stockData);
            }
            setSearchQuery('');
            setSearchResults([]);
        } catch (error) {
            console.error('Error fetching stock details:', error);
            setSearchQuery('');
            setSearchResults([]);
        }
    };

    // Refresh live stocks manually
    const handleRefreshStocks = async () => {
        try {
            setLoadingStocks(true);
            const stocks = await stockService.getPopularStocks(20);
            if (stocks && stocks.length > 0) {
                setLiveStocks(stocks);
                setIsLiveData(true);
                setLastUpdateTime(new Date());
            }
        } catch (error) {
            console.error('Error refreshing stocks:', error);
            setIsLiveData(false);
        } finally {
            setLoadingStocks(false);
        }
    };

    // Portfolio Management Functions
    const handleAddToPortfolio = () => {
        if (!selectedStock) return;
        setShowAddToPortfolio(true);
        // Set current price as default buy price
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

        // Add symbol with .NS suffix for consistency
        const symbol = selectedStock.symbol.includes('.NS') ? selectedStock.symbol : `${selectedStock.symbol}.NS`;
        
        // Check if stock already exists in portfolio
        const existingIndex = portfolioHoldings.findIndex(h => h.symbol === symbol);
        if (existingIndex >= 0) {
            // Update existing holding
            const updatedHoldings = [...portfolioHoldings];
            updatedHoldings[existingIndex] = {
                symbol,
                quantity: updatedHoldings[existingIndex].quantity + quantity,
                buyPrice: ((updatedHoldings[existingIndex].buyPrice * updatedHoldings[existingIndex].quantity) + (buyPrice * quantity)) / (updatedHoldings[existingIndex].quantity + quantity) // Average price
            };
            setPortfolioHoldings(updatedHoldings);
        } else {
            // Add new holding
            setPortfolioHoldings([...portfolioHoldings, { symbol, quantity, buyPrice }]);
        }
        
        // Reset form
        setShowAddToPortfolio(false);
        setAddQuantity('');
        setAddBuyPrice('');
    };

    const handleRemoveFromPortfolio = (symbol: string) => {
        setPortfolioHoldings(portfolioHoldings.filter(h => h.symbol !== symbol));
    };

    // Filter handlers
    const toggleSector = (sector: string) => {
        setSelectedSectors(prev =>
            prev.includes(sector)
                ? prev.filter(s => s !== sector)
                : [...prev, sector]
        );
    };

    const handleSort = (column: 'symbol' | 'price' | 'change' | 'volume') => {
        if (sortBy === column) {
            setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(column);
            setSortOrder('desc');
        }
    };

    const openStockModal = (stock: StockData) => {
        setSelectedStock(stock);
        setShowStockModal(true);
    };

    const closeStockModal = () => {
        setShowStockModal(false);
        setShowAddToPortfolio(false);
    };

    // Market mood animation
    useEffect(() => {
        const timer = setInterval(() => {
            setMarketMood(prev => prev === "bullish" ? "neutral" : prev === "neutral" ? "bearish" : "bullish");
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    const getMoodIcon = (mood: string) => {
        switch (mood) {
            case "bullish": return "📈";
            case "bearish": return "📉";
            default: return "➡️";
        }
    };

    const getMoodColor = (mood: string) => {
        switch (mood) {
            case "bullish": return "text-green-500";
            case "bearish": return "text-red-500";
            default: return "text-yellow-500";
        }
    };

    const scrollToSection = (sectionId: string) => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="min-h-screen bg-background">

            {/* Hero Section - Landing Page Style */}
            <section 
                id="hero"
                className="relative w-full overflow-hidden min-h-screen flex items-center"
            >
                <div className="w-full">
                    <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
                        {/* Left Side - Content */}
                        <div className="relative bg-tertiary px-4 sm:px-6 lg:px-12 py-20 lg:py-0 flex items-center overflow-hidden">
                            {/* Decorative Partial Logo */}
                            <div className="absolute bottom-0 right-0 w-64 h-64 opacity-5 pointer-events-none">
                                <img 
                                    src="/logo-wbg.png" 
                                    alt="" 
                                    className="w-full h-full object-contain transform translate-x-1/3 translate-y-1/3 scale-150"
                                    style={{ filter: 'brightness(0) invert(1)' }}
                                />
                            </div>

                            <div className="relative z-10 max-w-2xl mx-auto lg:mx-0">
                                {/* Label */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6 }}
                                    className="mb-6"
                                >
                                    <span className="text-xs md:text-sm font-crimson text-white/70 uppercase tracking-wider">
                                        EQUITY INVESTMENT SERVICES
                                    </span>
                                </motion.div>

                                {/* Main Headline */}
                                <motion.h1 
                                    className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-playfair leading-tight text-white mb-6"
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8, delay: 0.2 }}
                                >
                                    Build Wealth Through{' '}
                                    <span className="relative inline-block">
                                        <span className="relative z-10">Strategic Equity</span>
                                        <span className="absolute bottom-0 left-0 w-full h-3 bg-secondary/30 -z-0"></span>
                                    </span>
                    </motion.h1>

                                {/* Description */}
                                <motion.p 
                                    className="text-base md:text-lg font-crimson text-white/90 leading-relaxed mb-8"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8, delay: 0.4 }}
                                >
                                    Expert guidance for direct stock investment and portfolio management. Access 5000+ stocks with zero brokerage fees.
                    </motion.p>

                    {/* Live Stock Ticker */}
                                {stocks && stocks.length > 0 && stocks[stockTicker] && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.8, delay: 0.5 }}
                                        className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mb-8"
                                    >
                                        <div className="flex items-center justify-between text-sm mb-2">
                                            <span className="text-white/80 font-crimson">Live Market</span>
                                            <span className={`flex items-center font-crimson ${getMoodColor(marketMood)}`}>
                                                {getMoodIcon(marketMood)} {marketMood.toUpperCase()}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="font-semibold text-white font-playfair">{stocks[stockTicker].symbol}</span>
                                            <span className="font-semibold text-white font-playfair">₹{stocks[stockTicker].price.toLocaleString()}</span>
                                            <span className={`font-semibold font-playfair ${stocks[stockTicker].change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                                {stocks[stockTicker].change >= 0 ? '+' : ''}{stocks[stockTicker].changePercent.toFixed(2)}%
                                            </span>
                                        </div>
                                    </motion.div>
                                )}

                                {/* CTA Buttons */}
                                <motion.div 
                                    className="flex flex-col sm:flex-row gap-4"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8, delay: 0.6 }}
                                >
                                    <button 
                                        onClick={() => navigate('/contact')}
                                        className="bg-secondary hover:bg-secondary/90 text-white px-8 py-4 rounded-full font-semibold font-crimson transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                                    >
                                        <span>Start Investing</span>
                                        <ArrowRight className="w-4 h-4" />
                                    </button>
                                    <button 
                                        onClick={() => scrollToSection('direct-stock-investment')}
                                        className="border-2 border-white/30 hover:bg-white/10 text-white px-8 py-4 rounded-full font-semibold font-crimson transition-all backdrop-blur-sm flex items-center justify-center"
                                    >
                                        Explore Stocks
                                    </button>
                                </motion.div>

                                {/* Trust Badge */}
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.8, delay: 0.8 }}
                                    className="mt-8 flex items-center gap-2 text-white/60 text-sm font-crimson"
                                >
                                    <div className="flex -space-x-2">
                                        <div className="w-8 h-8 rounded-full bg-secondary border-2 border-tertiary"></div>
                                        <div className="w-8 h-8 rounded-full bg-white/20 border-2 border-tertiary"></div>
                                        <div className="w-8 h-8 rounded-full bg-white/10 border-2 border-tertiary"></div>
                                    </div>
                                    <span>Trusted by families since 1957</span>
                                </motion.div>
                            </div>
                        </div>

                        {/* Right Side - Image */}
                        <div className="relative bg-gray-900 min-h-[400px] lg:min-h-screen overflow-hidden">
                            <img 
                                src="/Hero Section/equity-investment.png" 
                                alt="Equity Investment"
                                className="absolute inset-0 w-full h-full object-cover"
                            />
                            <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary opacity-20 rounded-full transform translate-x-1/2 translate-y-1/2 z-10"></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Direct Stock Investment Section - Completely Redesigned */}
            <section id="direct-stock-investment" className="py-16 bg-gradient-to-br from-secondary/10 to-secondary/5">
                <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Section Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{ duration: 0.8 }}
                        className="mb-8"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-crimson text-tertiary/60 uppercase tracking-wider mb-2">
                                    DIRECT STOCK INVESTMENT
                                </p>
                                <h2 className="text-3xl md:text-4xl lg:text-5xl font-playfair font-bold text-tertiary mb-2">
                                    Build Your Portfolio
                                </h2>
                                <p className="text-base md:text-lg font-crimson text-tertiary/80">
                                    Invest in carefully selected stocks with expert guidance
                                </p>
                            </div>
                            <div className="flex items-center gap-4">
                                {/* Live Data Indicator */}
                                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-secondary/20">
                                    <Radio className={`h-4 w-4 ${isLiveData ? 'text-green-600 animate-pulse' : 'text-gray-400'}`} />
                                    <span className="text-sm font-crimson text-tertiary">
                                        {isLiveData ? 'LIVE' : 'DEMO'}
                                    </span>
                                    {lastUpdateTime && (
                                        <span className="text-xs text-tertiary/60">
                                            {lastUpdateTime.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    )}
                                </div>
                                <button
                                    onClick={handleRefreshStocks}
                                    className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-secondary/20 hover:bg-secondary/5 transition-colors"
                                    disabled={loadingStocks}
                                >
                                    <RefreshCw className={`h-4 w-4 text-secondary ${loadingStocks ? 'animate-spin' : ''}`} />
                                    <span className="text-sm font-crimson text-tertiary">Refresh</span>
                                </button>
                            </div>
                        </div>
                    </motion.div>

                    {/* 3-Column Layout: Filters | Stock Table | Portfolio */}
                    <PortfolioBuilder
                        liveStocks={liveStocks}
                        displayedStocks={displayedStocks}
                        selectedSectors={selectedSectors}
                        selectedMarketCap={selectedMarketCap}
                        selectedFilter={selectedFilter}
                        stockSearch={stockSearch}
                        sortBy={sortBy}
                        sortOrder={sortOrder}
                        portfolio={portfolio}
                        onToggleSector={toggleSector}
                        onSelectMarketCap={setSelectedMarketCap}
                        onSelectFilter={setSelectedFilter}
                        onSearchChange={setStockSearch}
                        onSort={handleSort}
                        onAddToPortfolio={confirmAddToPortfolio}
                        onRemoveFromPortfolio={handleRemoveFromPortfolio}
                    />
                    {/* OLD CONTENT TO BE REMOVED - START */}
                    <div style={{display: 'none'}}>
                        {selectedStock && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6 }}
                                >
                                    <Card className="overflow-hidden">
                                        <CardHeader className="bg-gradient-to-r from-tertiary to-tertiary/90 text-white">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <CardTitle className="text-3xl font-playfair flex items-center gap-3">
                                                        {selectedStock.symbol}
                                                        <Badge className={selectedStock.changePercent >= 0 ? "bg-green-600 text-white" : "bg-red-600 text-white"}>
                                                            {selectedStock.changePercent >= 0 ? "+" : ""}{selectedStock.changePercent.toFixed(2)}%
                                                        </Badge>
                                                    </CardTitle>
                                                    <p className="text-white/80 font-crimson mt-1">{selectedStock.name}</p>
                                                    {selectedStock.sector && (
                                                        <p className="text-white/60 font-crimson text-sm mt-1">{selectedStock.sector}</p>
                                                    )}
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-4xl font-playfair font-bold">
                                                        ₹{selectedStock.price.toFixed(2)}
                                                    </div>
                                                    <div className={`text-lg font-crimson ${selectedStock.changePercent >= 0 ? 'text-green-200' : 'text-red-200'}`}>
                                                        {selectedStock.changePercent >= 0 ? '+' : ''}₹{selectedStock.change.toFixed(2)}
                                                    </div>
                                                </div>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="p-6">
                                            {/* Chart Period Selector */}
                                            <div className="flex gap-2 mb-6">
                                                {(['1D', '1W', '1M', '3M', '1Y'] as const).map((period) => (
                                                    <button
                                                        key={period}
                                                        onClick={() => setChartPeriod(period)}
                                                        className={`px-4 py-2 rounded-lg font-crimson text-sm transition-all ${
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
                                            <div className="h-80 w-full">
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
                                                            strokeWidth={3}
                                                            fill="url(#colorPrice)"
                                                        />
                                                    </AreaChart>
                                                </ResponsiveContainer>
                                            </div>

                                            {/* Stock Summary Grid */}
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                                                <div className="p-4 bg-gradient-to-br from-blue-50 to-white rounded-lg border border-blue-100">
                                                    <div className="text-xs text-tertiary/60 font-crimson mb-1">Open</div>
                                                    <div className="text-lg font-playfair font-bold text-tertiary">
                                                        ₹{(selectedStock.open || selectedStock.price).toFixed(2)}
                                                    </div>
                                                </div>
                                                <div className="p-4 bg-gradient-to-br from-green-50 to-white rounded-lg border border-green-100">
                                                    <div className="text-xs text-tertiary/60 font-crimson mb-1">High</div>
                                                    <div className="text-lg font-playfair font-bold text-green-600">
                                                        ₹{selectedStock.high.toFixed(2)}
                                                    </div>
                                                </div>
                                                <div className="p-4 bg-gradient-to-br from-red-50 to-white rounded-lg border border-red-100">
                                                    <div className="text-xs text-tertiary/60 font-crimson mb-1">Low</div>
                                                    <div className="text-lg font-playfair font-bold text-red-600">
                                                        ₹{selectedStock.low.toFixed(2)}
                                                    </div>
                                                </div>
                                                <div className="p-4 bg-gradient-to-br from-purple-50 to-white rounded-lg border border-purple-100">
                                                    <div className="text-xs text-tertiary/60 font-crimson mb-1">Prev Close</div>
                                                    <div className="text-lg font-playfair font-bold text-tertiary">
                                                        ₹{(selectedStock.previousClose || selectedStock.price).toFixed(2)}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Additional Details */}
                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                                                {selectedStock.marketCap && (
                                                    <div className="p-4 bg-secondary/5 rounded-lg">
                                                        <div className="text-xs text-tertiary/60 font-crimson mb-1">Market Cap</div>
                                                        <div className="text-lg font-playfair font-bold text-tertiary">
                                                            ₹{selectedStock.marketCap}
                                                        </div>
                                                    </div>
                                                )}
                                                {selectedStock.peRatio && (
                                                    <div className="p-4 bg-secondary/5 rounded-lg">
                                                        <div className="text-xs text-tertiary/60 font-crimson mb-1">P/E Ratio</div>
                                                        <div className="text-lg font-playfair font-bold text-tertiary">
                                                            {selectedStock.peRatio.toFixed(2)}
                                                        </div>
                                                    </div>
                                                )}
                                                <div className="p-4 bg-secondary/5 rounded-lg">
                                                    <div className="text-xs text-tertiary/60 font-crimson mb-1">Volume</div>
                                                    <div className="text-lg font-playfair font-bold text-tertiary">
                                                        {(selectedStock.volume / 1000000).toFixed(2)}M
                                                    </div>
                                                </div>
                                                {selectedStock.week52High && (
                                                    <div className="p-4 bg-secondary/5 rounded-lg">
                                                        <div className="text-xs text-tertiary/60 font-crimson mb-1">52W High</div>
                                                        <div className="text-lg font-playfair font-bold text-green-600">
                                                            ₹{selectedStock.week52High.toFixed(2)}
                                                        </div>
                                                    </div>
                                                )}
                                                {selectedStock.week52Low && (
                                                    <div className="p-4 bg-secondary/5 rounded-lg">
                                                        <div className="text-xs text-tertiary/60 font-crimson mb-1">52W Low</div>
                                                        <div className="text-lg font-playfair font-bold text-red-600">
                                                            ₹{selectedStock.week52Low.toFixed(2)}
                                                        </div>
                                                    </div>
                                                )}
                                                {selectedStock.avgVolume && (
                                                    <div className="p-4 bg-secondary/5 rounded-lg">
                                                        <div className="text-xs text-tertiary/60 font-crimson mb-1">Avg Volume</div>
                                                        <div className="text-lg font-playfair font-bold text-tertiary">
                                                            {(selectedStock.avgVolume / 1000000).toFixed(2)}M
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Action Button */}
                                            <Button 
                                                className="w-full bg-secondary hover:bg-secondary/90 text-white font-crimson font-semibold mt-6" 
                                                onClick={() => navigate('/contact')}
                                            >
                                                <TrendingUp className="mr-2 h-4 w-4" />
                                                Invest in {selectedStock.symbol}
                                            </Button>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            )}
                        
                        {/* Right Column - Portfolio & Search */}
                        <div className="space-y-6">
                            {/* Stock Search */}
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6 }}
                            >
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-xl font-playfair flex items-center text-tertiary">
                                            <Search className="h-5 w-5 mr-2 text-secondary" />
                                            Search Stocks
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="relative">
                                            <Input
                                                placeholder="Search by name or symbol..."
                                                value={searchQuery}
                                                onChange={(e) => handleSearch(e.target.value)}
                                                className="pl-10 font-crimson"
                                            />
                                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-tertiary/60" />
                                        </div>
                                        
                                        {/* Search Results Dropdown */}
                                        {searchResults.length > 0 && (
                                            <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                                {searchResults.map((result) => (
                                                    <button
                                                        key={result.symbol}
                                                        onClick={() => handleSelectStock(result.symbol)}
                                                        className="w-full px-4 py-3 text-left hover:bg-secondary/10 transition-colors border-b border-gray-100 last:border-b-0"
                                                    >
                                                        <div className="flex items-center justify-between">
                                                            <div>
                                                                <div className="font-semibold text-tertiary font-playfair">{result.symbol.replace('.NS', '')}</div>
                                                                <div className="text-sm text-tertiary/70 font-crimson">{result.name}</div>
                                                            </div>
                                                            {result.sector && (
                                                                <Badge variant="outline" className="text-xs">{result.sector}</Badge>
                                                            )}
                                                        </div>
                                                    </button>
                                                ))}
                                            </div>
                                        )}

                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="text-center p-3 bg-gradient-to-br from-secondary/10 to-transparent rounded-lg border border-secondary/20">
                                                <div className="text-xl font-playfair font-bold text-tertiary">{POPULAR_INDIAN_STOCKS.length}+</div>
                                                <div className="text-xs text-tertiary/70 font-crimson">Stocks</div>
                                            </div>
                                            <div className="text-center p-3 bg-gradient-to-br from-green-50 to-transparent rounded-lg border border-green-200">
                                                <div className="text-xl font-playfair font-bold text-green-600">₹0</div>
                                                <div className="text-xs text-tertiary/70 font-crimson">Brokerage</div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>

                            {/* Portfolio Diversification */}
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: 0.1 }}
                            >
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-xl font-playfair flex items-center text-tertiary">
                                            <PieChart className="h-5 w-5 mr-2 text-secondary" />
                                            Sector Allocation
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            {sectors.map((sector) => (
                                                <div key={sector.name} className="space-y-2">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-2">
                                                            <div className={`w-3 h-3 rounded-full ${sector.color}`} />
                                                            <span className="text-sm font-crimson text-tertiary">{sector.name}</span>
                                                        </div>
                                                        <span className="text-sm font-playfair font-bold text-tertiary">{sector.weight}%</span>
                                                    </div>
                                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                                        <div
                                                            className={`h-2 rounded-full ${sector.color} transition-all duration-500`}
                                                            style={{ width: `${sector.weight}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="mt-6 p-4 bg-gradient-to-br from-secondary/10 to-transparent rounded-lg border border-secondary/20">
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-sm text-tertiary/70 font-crimson">Portfolio Value</span>
                                                <span className="text-xl font-playfair font-bold text-tertiary">₹{portfolioValue.toLocaleString()}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-tertiary/70 font-crimson">Total Gain</span>
                                                <span className="text-xl font-playfair font-bold text-green-600">+₹{portfolioGain.toLocaleString()}</span>
                                            </div>
                                            <div className="mt-3 pt-3 border-t border-tertiary/10">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm text-tertiary/70 font-crimson">Return</span>
                                                    <span className="text-lg font-playfair font-bold text-green-600">
                                                        +{((portfolioGain / portfolioValue) * 100).toFixed(2)}%
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <Button 
                                            className="w-full bg-secondary hover:bg-secondary/90 text-white font-crimson font-semibold mt-4" 
                                            onClick={() => navigate('/contact')}
                                        >
                                            Start Building Portfolio
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </Button>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </div>
                    </div>
                    {/* OLD CONTENT TO BE REMOVED - END */}
                </div>
            </section>

            {/* Portfolio Advisory Section */}
            <section id="expert-portfolio-advisory" className="py-16 bg-[#FAFAFA]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{ duration: 0.8 }}
                        className="text-center mb-16"
                    >
                        <p className="text-sm font-crimson text-tertiary/60 uppercase tracking-wider mb-4">
                            EXPERT PORTFOLIO ADVISORY
                        </p>
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-playfair font-bold text-tertiary mb-4">
                            Investment Strategies
                        </h2>
                        <p className="text-lg md:text-xl font-crimson text-tertiary/80 max-w-3xl mx-auto">
                            Get personalized investment strategies from our expert advisors
                        </p>
                    </motion.div>

                    {/* Investment Strategies - Carousel */}
                    <div className="mb-16">
                        <CircularCarousel
                            products={investmentStrategies}
                            autoplay={true}
                            colors={{
                                title: "#1a5f7a",
                                description: "#6b7280",
                                content: "#4b5563",
                            }}
                            fontSizes={{
                                title: "28px",
                                description: "16px",
                                content: "16px",
                            }}
                            onInvestNow={() => navigate('/contact')}
                        />
                    </div>

                    {/* Expert Advisors */}
                    <div className="text-center mb-12">
                        <h3 className="text-3xl md:text-4xl font-playfair font-bold text-tertiary mb-4">
                            Meet Our Expert Advisors
                        </h3>
                        <p className="text-lg font-crimson text-tertiary/80">
                            Get personalized guidance from industry experts
                        </p>
                    </div>

                    <motion.div
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, amount: 0.2 }}
                        variants={{
                            hidden: {},
                            show: { transition: { staggerChildren: 0.1 }}
                        }}
                        className="grid grid-cols-1 md:grid-cols-3 gap-8"
                    >
                        {advisors.map((advisor, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.3 }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                className="flex flex-col items-center"
                            >
                                {/* Circular Icon */}
                                <div className="relative mb-6">
                                    <div className="w-48 h-48 rounded-full overflow-hidden shadow-lg border-4 border-white bg-secondary/20 flex items-center justify-center">
                                        <Users className="w-24 h-24 text-secondary" />
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="text-center mb-6">
                                    <h4 className="text-xl md:text-2xl font-playfair font-bold text-tertiary mb-2">
                                        {advisor.name}
                                    </h4>
                                    <p className="text-base font-crimson text-tertiary/80 mb-1">
                                        {advisor.role}
                                    </p>
                                    <p className="text-sm text-secondary font-semibold font-playfair mb-3">
                                        {advisor.experience}
                                    </p>
                                    <div className="flex items-center justify-center gap-2 mb-2">
                                        <span className="text-sm text-tertiary/70 font-crimson">Success Rate:</span>
                                        <span className="font-semibold text-secondary font-playfair">{advisor.successRate}%</span>
                                    </div>
                                    <p className="text-sm text-tertiary/70 font-crimson">
                                        <span className="font-semibold">Specialization:</span> {advisor.specialization}
                                    </p>
                                </div>

                                {/* Book Consultation Button */}
                                <button
                                    onClick={() => navigate('/contact')}
                                    className="bg-secondary hover:bg-secondary/90 text-white px-6 py-3 rounded-full font-semibold font-crimson transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
                                >
                                    <Users className="w-4 h-4" />
                                    <span>Book Consultation</span>
                                </button>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Advanced Features Section */}
            <section className="py-16 bg-gradient-to-br from-secondary/10 to-secondary/5">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{ duration: 0.8 }}
                        className="text-center mb-16"
                    >
                        <p className="text-sm font-crimson text-tertiary/60 uppercase tracking-wider mb-4">
                            ADVANCED FEATURES
                        </p>
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-playfair font-bold text-tertiary mb-4">
                            Professional Trading Tools
                        </h2>
                        <p className="text-lg md:text-xl font-crimson text-tertiary/80 max-w-3xl mx-auto">
                            Advanced features for serious investors
                        </p>
                    </motion.div>

                    <motion.div
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, amount: 0.2 }}
                        variants={{
                            hidden: {},
                            show: { transition: { staggerChildren: 0.1 }}
                        }}
                        className="grid grid-cols-1 md:grid-cols-3 gap-8"
                    >
                        {[
                            { title: "Technical Analysis", desc: "Advanced charting tools with 50+ technical indicators", badge: "Pro", image: "/technical-analysis.jpg" },
                            { title: "Risk Assessment", desc: "AI-powered risk analysis and portfolio stress testing", badge: "New", image: "/risk-assessment.jpg" },
                            { title: "Market Insights", desc: "Real-time market analysis and expert recommendations", badge: "Live", image: "/market-insights.jpg" }
                        ].map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.3 }}
                                transition={{ duration: 0.6 }}
                                className="h-full"
                            >
                                <div className="relative h-full flex flex-col shadow-lg rounded-xl overflow-hidden transition-all duration-300 hover:shadow-2xl group min-h-[350px]">
                                    {/* Background Image */}
                                    <div className="absolute inset-0">
                                        <img 
                                            src={feature.image} 
                                            alt={feature.title}
                                            className="w-full h-full object-cover"
                                        />
                                        {/* Dark Overlay for text readability */}
                                        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-all duration-300"></div>
                                    </div>
                                    
                                    {/* Content */}
                                    <div className="relative z-10 flex flex-col flex-grow p-6">
                                        <div className="flex justify-end mb-4">
                                            <Badge className="bg-secondary/90 text-white">{feature.badge}</Badge>
                                        </div>
                                        
                                        <div className="flex-grow flex flex-col justify-center">
                                            <h3 className="text-2xl font-playfair font-bold text-white mb-3">
                                                {feature.title}
                                            </h3>
                                            <p className="text-white/90 mb-6 font-crimson text-base leading-relaxed">
                                                {feature.desc}
                                            </p>
                                        </div>
                                        
                                        <button
                                            onClick={() => navigate('/contact')}
                                            className="bg-secondary hover:bg-secondary/90 text-white px-6 py-3 rounded-full font-semibold font-crimson transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                                        >
                                            Explore
                                            <ArrowRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Portfolio Management Types Section */}
            <section id="pms-types" className="py-16 bg-gradient-to-br from-secondary/10 to-secondary/5">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{ duration: 0.8 }}
                        className="text-center mb-16"
                    >
                        <p className="text-sm font-crimson text-tertiary/60 uppercase tracking-wider mb-4">
                            Management Types
                        </p>
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-playfair font-bold text-tertiary mb-4">
                            Portfolio Management Services
                        </h2>
                        <p className="text-lg md:text-xl font-crimson text-tertiary/80 max-w-3xl mx-auto">
                            Select the portfolio management service that fits your investment approach
                        </p>
                    </motion.div>

                    {/* Portfolio Management Types - Carousel */}
                    <div>
                        <CircularCarousel
                            products={pmsTypes}
                            autoplay={true}
                            colors={{
                                title: "#1a5f7a",
                                description: "#6b7280",
                                content: "#4b5563",
                            }}
                            fontSizes={{
                                title: "28px",
                                description: "16px",
                                content: "16px",
                            }}
                            onInvestNow={() => navigate('/contact')}
                        />
                    </div>
                </div>
            </section>

            {/* Why PMS Section */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{ duration: 0.8 }}
                        className="text-center mb-16"
                    >
                        <p className="text-sm font-crimson text-tertiary/60 uppercase tracking-wider mb-4">
                            BENEFITS
                        </p>
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-playfair font-bold text-tertiary mb-4">
                            Why Choose PMS?
                        </h2>
                        <p className="text-lg md:text-xl font-crimson text-tertiary/80 max-w-3xl mx-auto">
                            Professional management for high-net-worth individuals
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                        {/* Left Column - Benefits List */}
                        <div className="space-y-8 md:space-y-10">
                            {/* Benefit 01 */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6 }}
                                className="space-y-3"
                            >
                                <div className="text-5xl md:text-6xl font-bold font-playfair text-tertiary/20">
                                    01
                                </div>
                                <h3 className="text-xl md:text-2xl font-bold font-playfair text-tertiary">
                                    Risk Management
                                </h3>
                                <p className="text-base md:text-lg font-crimson text-tertiary/70 leading-relaxed">
                                    Continuous monitoring and rebalancing to align with your risk profile.
                                </p>
                            </motion.div>

                            {/* Benefit 02 */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: 0.1 }}
                                className="space-y-3"
                            >
                                <div className="text-5xl md:text-6xl font-bold font-playfair text-tertiary/20">
                                    02
                                </div>
                                <h3 className="text-xl md:text-2xl font-bold font-playfair text-tertiary">
                                    Personalized Service
                                </h3>
                                <p className="text-base md:text-lg font-crimson text-tertiary/70 leading-relaxed">
                                    Dedicated managers and custom strategies for your unique goals.
                                </p>
                            </motion.div>

                            {/* Benefit 03 */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                className="space-y-3"
                            >
                                <div className="text-5xl md:text-6xl font-bold font-playfair text-tertiary/20">
                                    03
                                </div>
                                <h3 className="text-xl md:text-2xl font-bold font-playfair text-tertiary">
                                    Expertise
                                </h3>
                                <p className="text-base md:text-lg font-crimson text-tertiary/70 leading-relaxed">
                                    Access to experienced professionals and in-depth research.
                                </p>
                            </motion.div>
                        </div>

                        {/* Right Column - Image */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="relative h-[500px] md:h-[600px] lg:h-[700px] rounded-2xl overflow-hidden shadow-2xl"
                        >
                            <img 
                                src="/PMS.jpg" 
                                alt="Portfolio Management Services"
                                className="w-full h-full object-cover"
                                loading="lazy"
                            />
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <CTASection />

            {/* Contact Popup */}
            <ContactPopup
                isOpen={isOpen}
                onClose={closePopup}
                title="Start Your Equity Investment Journey"
                description="Get expert guidance on stock selection and portfolio management strategies."
            />
        </div>
    );
};

export default EquityInvestment; 
