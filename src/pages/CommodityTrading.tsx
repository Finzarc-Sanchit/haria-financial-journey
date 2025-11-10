import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CircularCarousel } from "@/components/ui/circular-carousel";
import {
    TrendingUp,
    Shield,
    ArrowRight,
    Calendar,
    Target,
    Globe,
    CheckCircle,
    Activity,
    BarChart3,
    Users,
} from "lucide-react";
import { motion } from "framer-motion";
import ContactPopup from '@/components/ui/ContactPopup';
import { useContactPopup } from '@/hooks/useContactPopup';
import { useNavigate } from 'react-router-dom';
import CTASection from '@/components/CTASection';

const CommodityTrading = () => {
    const [commodityTicker, setCommodityTicker] = useState(0);
    const { isOpen, openPopup, closePopup } = useContactPopup();
    const [hoveredCard, setHoveredCard] = useState<string | null>(null);
    const navigate = useNavigate();

    // Mock commodity data for ticker
    const commodities = [
        { name: "Gold", price: 62450, change: +1.2, unit: "per 10g" },
        { name: "Silver", price: 78900, change: -0.8, unit: "per kg" },
        { name: "Crude Oil", price: 6789, change: +2.1, unit: "per barrel" },
        { name: "Copper", price: 845, change: +0.5, unit: "per kg" },
        { name: "Natural Gas", price: 234, change: -1.5, unit: "per MMBtu" }
    ];

    const tradingProducts = [
        {
            id: "futures",
            title: "Futures Trading",
            description: "Trade standardized contracts with leverage",
            icon: Calendar,
            rate: "High Leverage",
            tenure: "1-12 months",
            minAmount: "₹50,000",
            features: ["High leverage opportunities", "Standardized contracts", "High liquidity", "Effective hedging tool"],
            image: "/Commodity Trading/future-trading.jpg"
        },
        {
            id: "options",
            title: "Options Trading",
            description: "Advanced derivatives",
            icon: Target,
            rate: "Limited Risk",
            tenure: "1-6 months",
            minAmount: "₹25,000",
            features: ["Unlimited profit potential", "Flexible strategies", "Multiple trading approaches"],
            image: "/Commodity Trading/option-trading.jpg"
        },
        {
            id: "commodities",
            title: "Commodity Trading",
            description: "",
            icon: Globe,
            rate: "Inflation Hedge",
            tenure: "Spot - 12 months",
            minAmount: "₹1,00,000",
            features: ["Physical delivery option", "Spot trading available", "Portfolio diversification", "Inflation hedge protection"],
            image: "/Commodity Trading/commodity-trading.jpg"
        }
    ];

    const tradingStrategies = [
        {
            name: "Trend Following",
            description: "Follow market momentum and trends",
            successRate: "75%",
            risk: "Moderate",
            returns: "15-25%",
            icon: TrendingUp,
            features: ["Momentum trading", "Technical analysis", "Position sizing"]
        },
        {
            name: "Mean Reversion",
            description: "Trade against extreme price movements",
            successRate: "68%",
            risk: "High",
            returns: "20-30%",
            icon: Activity,
            features: ["Counter-trend trading", "Statistical analysis", "Risk management"]
        },
        {
            name: "Arbitrage",
            description: "Profit from price differences",
            successRate: "85%",
            risk: "Low",
            returns: "8-12%",
            icon: BarChart3,
            features: ["Market inefficiencies", "Low risk approach", "Quick execution"]
        },
        {
            name: "Hedging",
            description: "Protect against price fluctuations",
            successRate: "92%",
            risk: "Very Low",
            returns: "5-8%",
            icon: Shield,
            features: ["Risk protection", "Portfolio insurance", "Price stability"]
        },
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

    // Commodity ticker animation
    useEffect(() => {
        const timer = setInterval(() => {
            setCommodityTicker(prev => (prev + 1) % commodities.length);
        }, 3000);
        return () => clearInterval(timer);
    }, []);

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
                                        COMMODITY TRADING
                                    </span>
                                </motion.div>

                                {/* Main Headline */}
                                <motion.h1 
                                    className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-playfair leading-tight text-white mb-6"
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8, delay: 0.2 }}
                                >
                                    Trade Commodities with{' '}
                                    <span className="relative inline-block">
                                        <span className="relative z-10">Expert Guidance</span>
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
                                    Access futures, options, and commodity markets with professional trading strategies. Diversify your portfolio with gold, silver, crude oil, and more.
                    </motion.p>

                    {/* Live Commodity Ticker */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8, delay: 0.5 }}
                                    className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mb-8"
                                >
                                    <div className="flex items-center justify-between text-sm mb-2">
                                        <span className="text-white/80 font-crimson">Live Prices</span>
                                        <Badge className="bg-green-500/20 text-green-400">Market Open</Badge>
                            </div>
                                    <div className="flex items-center justify-between">
                                    <div>
                                            <span className="font-semibold text-white font-playfair block">{commodities[commodityTicker].name}</span>
                                            <span className="text-xs text-white/70 font-crimson">{commodities[commodityTicker].unit}</span>
                                    </div>
                                        <span className="font-semibold text-white font-playfair">₹{commodities[commodityTicker].price.toLocaleString()}</span>
                                        <span className={`font-semibold font-playfair ${commodities[commodityTicker].change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                            {commodities[commodityTicker].change >= 0 ? '+' : ''}{commodities[commodityTicker].change}%
                                        </span>
                        </div>
                    </motion.div>

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
                                        <span>Start Trading</span>
                                        <ArrowRight className="w-4 h-4" />
                                    </button>
                                    <button 
                                        onClick={() => scrollToSection('trading-products')}
                                        className="border-2 border-white/30 hover:bg-white/10 text-white px-8 py-4 rounded-full font-semibold font-crimson transition-all backdrop-blur-sm flex items-center justify-center"
                                    >
                                        Explore Products
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
                                src="/Hero Section/commodity-trading.png" 
                                alt="Commodity Trading"
                                className="absolute inset-0 w-full h-full object-cover"
                            />
                            <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary opacity-20 rounded-full transform translate-x-1/2 translate-y-1/2 z-10"></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Trading Products Section */}
            <section id="trading-products" className="py-16 bg-[#FAFAFA]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{ duration: 0.8 }}
                        className="text-center mb-16"
                    >
                        <p className="text-sm font-crimson text-tertiary/60 uppercase tracking-wider mb-4">
                            TRADING PRODUCTS
                        </p>
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-playfair font-bold text-tertiary mb-4">
                            Derivative Trading Options
                        </h2>
                        <p className="text-lg md:text-xl font-crimson text-tertiary/80 max-w-3xl mx-auto">
                            Choose from futures, options, and direct commodity trading
                        </p>
                    </motion.div>

                    {/* Carousel */}
                    <CircularCarousel
                        products={tradingProducts}
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
            </section>

            {/* Advanced Trading Features Section */}
            <section className="py-16 bg-[#FAFAFA]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{ duration: 0.8 }}
                        className="text-center mb-16"
                    >
                        <p className="text-sm font-crimson text-tertiary/60 uppercase tracking-wider mb-4">
                            ADVANCED TRADING FEATURES
                        </p>
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-playfair font-bold text-tertiary mb-4">
                            Professional Trading Tools
                        </h2>
                        <p className="text-lg md:text-xl font-crimson text-tertiary/80 max-w-3xl mx-auto">
                            Advanced features for serious traders
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Real-time P&L Calculator */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            <Card className="h-full border-2 border-gray-200 hover:border-secondary/50 transition-all">
                                <CardHeader>
                                    <div className="flex items-center gap-3 mb-4">
                                        <BarChart3 className="w-8 h-8 text-tertiary" />
                                        <CardTitle className="text-2xl md:text-3xl font-playfair text-tertiary">
                                            Real-time P&L Calculator
                                        </CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    {/* Current P&L */}
                                    <div className="bg-gray-50 rounded-xl p-6">
                                        <div className="text-center">
                                            <div className="text-4xl font-playfair font-bold text-tertiary mb-2">
                                                ₹13,500
                                            </div>
                                            <p className="text-tertiary/70 font-crimson">Current P&L</p>
                                        </div>
                                    </div>

                                    {/* Stats Grid */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-white rounded-lg p-4 border border-gray-200">
                                            <div className="text-2xl font-playfair font-bold text-tertiary mb-1">
                                                ₹50,000
                                            </div>
                                            <p className="text-sm text-tertiary/70 font-crimson">Initial Capital</p>
                                        </div>
                                        <div className="bg-white rounded-lg p-4 border border-gray-200">
                                            <div className="text-2xl font-playfair font-bold text-green-600 mb-1">
                                                +25%
                                            </div>
                                            <p className="text-sm text-tertiary/70 font-crimson">ROI</p>
                                        </div>
                                    </div>

                                    {/* Risk Level */}
                                    <div>
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-sm font-crimson text-tertiary/70">Risk Level</span>
                                            <span className="text-sm font-crimson font-semibold text-red-600">High</span>
                                        </div>
                                        <Progress value={75} className="h-2" />
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Risk Management */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            <Card className="h-full border-2 border-gray-200 hover:border-secondary/50 transition-all">
                                <CardHeader>
                                    <div className="flex items-center gap-3 mb-4">
                                        <Shield className="w-8 h-8 text-tertiary" />
                                        <CardTitle className="text-2xl md:text-3xl font-playfair text-tertiary">
                                            Risk Management
                                        </CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    {/* Risk Items */}
                                    <div className="space-y-4">
                                        <div className="flex items-start gap-3">
                                            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                                                <CheckCircle className="w-5 h-5 text-green-600" />
                                            </div>
                                            <div>
                                                <h4 className="font-playfair font-semibold text-lg text-tertiary mb-1">
                                                    Position Sizing
                                                </h4>
                                                <p className="text-sm text-tertiary/70 font-crimson">
                                                    Never risk more than 2% of capital per trade
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3">
                                            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                                                <CheckCircle className="w-5 h-5 text-green-600" />
                                            </div>
                                            <div>
                                                <h4 className="font-playfair font-semibold text-lg text-tertiary mb-1">
                                                    Stop Loss
                                                </h4>
                                                <p className="text-sm text-tertiary/70 font-crimson">
                                                    Automatic exit at predetermined loss levels
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3">
                                            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                                                <CheckCircle className="w-5 h-5 text-green-600" />
                                            </div>
                                            <div>
                                                <h4 className="font-playfair font-semibold text-lg text-tertiary mb-1">
                                                    Diversification
                                                </h4>
                                                <p className="text-sm text-tertiary/70 font-crimson">
                                                    Spread risk across multiple commodities
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3">
                                            <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center flex-shrink-0">
                                                <Shield className="w-5 h-5 text-yellow-600" />
                                            </div>
                                            <div>
                                                <h4 className="font-playfair font-semibold text-lg text-tertiary mb-1">
                                                    Leverage Control
                                                </h4>
                                                <p className="text-sm text-tertiary/70 font-crimson">
                                                    Maintain conservative leverage ratios
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Market Insights Section */}
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
                            MARKET INSIGHTS
                        </p>
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-playfair font-bold text-tertiary mb-4">
                            Expert Analysis & Insights
                        </h2>
                        <p className="text-lg md:text-xl font-crimson text-tertiary/80 max-w-3xl mx-auto">
                            Stay ahead with expert analysis and market updates
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
                            { title: "Technical Analysis", desc: "Advanced charting with 50+ technical indicators", badge: "Live", icon: TrendingUp, image: "/technical-analysis.jpg" },
                            { title: "Market Reports", desc: "Daily market analysis and expert recommendations", badge: "Daily", icon: Globe, image: "/market-insights.jpg" },
                            { title: "Trading Signals", desc: "AI-powered trading signals and alerts", badge: "Expert", icon: Users, image: "/risk-assessment.jpg" }
                        ].map((insight, index) => (
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
                                            src={insight.image} 
                                            alt={insight.title}
                                            className="w-full h-full object-cover"
                                        />
                                        {/* Dark Overlay for text readability */}
                                        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-all duration-300"></div>
                                    </div>
                                    
                                    {/* Content */}
                                    <div className="relative z-10 flex flex-col flex-grow p-6">
                                        <div className="flex justify-end mb-4">
                                            <Badge className="bg-secondary/90 text-white font-crimson">{insight.badge}</Badge>
                                        </div>
                                        
                                        <div className="flex-grow flex flex-col justify-center">
                                            <h3 className="text-2xl font-playfair font-bold text-white mb-3">
                                                {insight.title}
                                            </h3>
                                            <p className="text-white/90 mb-6 font-crimson text-base leading-relaxed">
                                                {insight.desc}
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

            {/* CTA Section */}
            <CTASection />

            {/* Contact Popup */}
            <ContactPopup
                isOpen={isOpen}
                onClose={closePopup}
                title="Start Your Commodity Trading Journey"
                description="Get expert guidance on commodity futures, options, and derivatives trading."
            />
        </div>
    );
};

export default CommodityTrading; 
