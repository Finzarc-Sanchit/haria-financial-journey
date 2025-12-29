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
    Coins,
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
    Building,
} from "lucide-react";
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { motion } from 'framer-motion';
import ContactPopup from '@/components/ui/ContactPopup';
import { useContactPopup } from '@/hooks/useContactPopup';
import { useNavigate } from 'react-router-dom';
import CTASection from '@/components/CTASection';
import ProductGrid from '@/components/ui/product-grid';
import stockService, { StockData, POPULAR_INDIAN_STOCKS, Portfolio, PortfolioHolding } from '@/services/stockService';
import { getAllSectors, getMarketCapCategories, NSE_STOCKS } from '@/services/stockDatabase';
import PortfolioBuilder from '@/components/PortfolioBuilder';
import MovingTicker from '@/components/MovingTicker';

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
                // Fetch all available stocks from database (200+ stocks)
                const allStocksCount = POPULAR_INDIAN_STOCKS.length;
                const stocks = await stockService.getPopularStocks(allStocksCount);
                
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
        // Refresh every 5 minutes for 200+ stocks (to respect rate limits and allow time for all stocks to load)
        // With 200+ stocks and 1.2s delay between calls, it takes ~4-5 minutes to fetch all stocks
        const interval = setInterval(fetchLiveStocks, 300000); // 5 minutes
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
                // Normalize symbol for matching (remove .NS for comparison)
                const holdingSymbolBase = holding.symbol.replace('.NS', '');
                
                // Find current price from live stocks (match without .NS)
                const liveStock = liveStocks.find(s => {
                    const liveSymbolBase = s.symbol.replace('.NS', '');
                    return liveSymbolBase === holdingSymbolBase;
                });
                
                const stockData: StockData = liveStock || {
                    symbol: holdingSymbolBase,
                    name: stockService.getStockName(holding.symbol),
                    price: holding.buyPrice, // Fallback to buy price if live data not available
                    change: 0,
                    changePercent: 0,
                    high: holding.buyPrice,
                    low: holding.buyPrice,
                    volume: 0,
                    sector: POPULAR_INDIAN_STOCKS.find(s => {
                        const dbSymbolBase = s.symbol.replace('.NS', '');
                        return dbSymbolBase === holdingSymbolBase;
                    })?.sector || 'Others'
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

    const waysToInvest = [
        {
            id: "indian-equities",
            title: "Indian Equities",
            description: "Direct ownership in listed Indian companies across market caps. Built for long term wealth creation with disciplined stock selection.",
            icon: TrendingUp,
            rate: "High Risk",
            tenure: "5+ years",
            minAmount: "₹500",
            features: ["Direct ownership", "Long-term wealth", "Disciplined selection", "Market cap diversity"],
            image: "/Equity investment/Value-investing.jpg"
        },
        {
            id: "sectoral-etfs",
            title: "Sectoral and Thematic ETFs",
            description: "Target specific themes like IT, Pharma, Banking, Energy or global megatrends. Ideal when you want focused exposure without stock picking.",
            icon: BarChart3,
            rate: "Moderate Risk",
            tenure: "3-5 years",
            minAmount: "₹500",
            features: ["Thematic exposure", "Focused strategy", "No stock picking", "Diversified themes"],
            image: "/Equity investment/Growth-investing.jpg"
        },
        {
            id: "reits-invits",
            title: "REITs and INVITs",
            description: "Earn regular income by investing in commercial real estate and infrastructure assets. Think rent and tolls without owning physical property.",
            icon: Building,
            rate: "Moderate Risk",
            tenure: "3+ years",
            minAmount: "₹5,000",
            features: ["Regular income", "Real estate exposure", "Infrastructure assets", "No physical ownership"],
            image: "/Equity investment/Dividend-investing.jpg"
        },
        {
            id: "pms",
            title: "PMS (Portfolio Management Services)",
            description: "Customized equity portfolios managed by professionals based on your risk profile. Minimum investment of ₹50 lakhs as mandated by SEBI.",
            icon: PieChart,
            rate: "Moderate Risk",
            tenure: "3-5 years",
            minAmount: "₹50 Lakhs",
            features: ["Professional management", "Customized portfolios", "Risk-based approach", "SEBI regulated"],
            image: "/Portfolio Management/Discretionary-PMS.jpg"
        },
        {
            id: "aif",
            title: "AIF (Alternate Investment Funds)",
            description: "Access private equity, structured credit, and alternative strategies beyond public markets. Minimum investment of ₹1 crore as per SEBI regulations.",
            icon: Award,
            rate: "High Risk",
            tenure: "5+ years",
            minAmount: "₹1 Crore",
            features: ["Private equity", "Structured credit", "Alternative strategies", "SEBI regulated"],
            image: "/Portfolio Management/Non-Discretionary-PMS.jpg"
        },
        {
            id: "imp",
            title: "IMP (Intelligent Model Portfolio)",
            description: "Rule based portfolio strategy managed by Motilal that dynamically allocates assets. Designed to balance growth and risk using proven models.",
            icon: Target,
            rate: "Moderate Risk",
            tenure: "3-5 years",
            minAmount: "₹25,000",
            features: ["Rule-based strategy", "Dynamic allocation", "Growth & risk balance", "Proven models"],
            image: "/Portfolio Management/Advisory-PMS.png"
        },
        {
            id: "global-investments",
            title: "Global Investments (US and International ETFs)",
            description: "Invest in US stocks and global ETFs or Indian listed ETFs tracking US and Chinese indices. Choose to invest in INR or USD across international markets.",
            icon: Coins,
            rate: "High Risk",
            tenure: "5+ years",
            minAmount: "₹5,000",
            features: ["US stocks", "Global ETFs", "INR or USD", "International markets"],
            image: "/Equity investment/Momentum-trading.jpg"
        },
        {
            id: "unlisted-shares",
            title: "Unlisted Shares",
            description: "Early access to high potential companies before they go public. Higher risk, higher upside, suitable for investors with patience and conviction.",
            icon: Zap,
            rate: "Very High Risk",
            tenure: "5+ years",
            minAmount: "₹1,00,000",
            features: ["Early access", "Pre-IPO companies", "High upside", "Patient investors"],
            image: "/Equity investment/unlisted.jpg"
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
            // Fetch all available stocks from database
            const allStocksCount = POPULAR_INDIAN_STOCKS.length;
            const stocks = await stockService.getPopularStocks(allStocksCount);
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

    const confirmAddToPortfolio = (symbol: string, quantity: number, buyPrice: number) => {
        // Symbol already comes with .NS suffix from PortfolioBuilder
        // Normalize symbol for matching (ensure .NS suffix)
        const normalizedSymbol = symbol.includes('.NS') ? symbol : `${symbol}.NS`;
        
        // Check if stock already exists in portfolio (match with or without .NS)
        const existingIndex = portfolioHoldings.findIndex(h => {
            const hSymbol = h.symbol.includes('.NS') ? h.symbol : `${h.symbol}.NS`;
            return hSymbol === normalizedSymbol;
        });
        
        if (existingIndex >= 0) {
            // Update existing holding
            const updatedHoldings = [...portfolioHoldings];
            const existingHolding = updatedHoldings[existingIndex];
            const totalQuantity = existingHolding.quantity + quantity;
            const averagePrice = ((existingHolding.buyPrice * existingHolding.quantity) + (buyPrice * quantity)) / totalQuantity;
            
            updatedHoldings[existingIndex] = {
                symbol: normalizedSymbol,
                quantity: totalQuantity,
                buyPrice: averagePrice
            };
            setPortfolioHoldings(updatedHoldings);
        } else {
            // Add new holding
            setPortfolioHoldings([...portfolioHoldings, { symbol: normalizedSymbol, quantity, buyPrice }]);
        }
    };

    const handleRemoveFromPortfolio = (symbol: string) => {
        // Normalize symbol for comparison (handle both with and without .NS)
        const normalizedSymbol = symbol.includes('.NS') ? symbol : `${symbol}.NS`;
        setPortfolioHoldings(portfolioHoldings.filter(h => {
            const hSymbol = h.symbol.includes('.NS') ? h.symbol : `${h.symbol}.NS`;
            return hSymbol !== normalizedSymbol;
        }));
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
            {/* Moving Ticker */}
            <MovingTicker />

            {/* Hero Section - Landing Page Style */}
            <section 
                id="hero"
                className="relative w-full overflow-hidden min-h-screen flex items-center pt-30"
                style={{ paddingTop: '120px' }}
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
                                        EQUITY
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
                                        <span className="relative z-10">Equity</span>
                                        <span className="absolute bottom-0 left-0 w-full h-3 bg-secondary/30 -z-0"></span>
                                    </span>
                    </motion.h1>

                                {/* Description */}
                                <motion.p 
                                    className="text-base md:text-lg font-crimson text-white/90 leading-relaxed mb-8 text-justify"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8, delay: 0.4 }}
                                >
                                    Expert guidance for direct stock investment and portfolio management. Access 5000+ stocks with zero brokerage fees.
                    </motion.p>

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
                                        onClick={() => scrollToSection('expert-portfolio-advisory')}
                                        className="border-2 border-white/30 hover:bg-white/10 text-white px-8 py-4 rounded-full font-semibold font-crimson transition-all backdrop-blur-sm flex items-center justify-center"
                                    >
                                        Explore Services
                                    </button>
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

            {/* Ways to Invest Section */}
            <section id="ways-to-invest" className="py-16 bg-[#FAFAFA]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{ duration: 0.8 }}
                        className="text-center mb-16"
                    >
                        <p className="text-sm font-crimson text-tertiary/60 uppercase tracking-wider mb-4">
                            INVESTMENT OPTIONS
                        </p>
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-playfair font-bold text-tertiary mb-4">
                            Ways to invest with us
                        </h2>
                        <div className="flex justify-center">
                            <p className="text-lg md:text-xl font-crimson text-tertiary/80 max-w-3xl text-center">
                                Explore diverse investment options tailored to your financial goals
                            </p>
                        </div>
                    </motion.div>

                    {/* Ways to Invest - Grid */}
                    <div>
                        <ProductGrid
                            products={waysToInvest}
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
