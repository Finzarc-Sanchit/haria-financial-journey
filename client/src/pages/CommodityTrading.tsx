import { useState, useEffect } from "react";
import ProductGrid from "@/components/ui/product-grid";
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
            tenure: "1 day to 1 month",
            minAmount: "₹3,00,000",
            features: ["High leverage opportunities", "Standardized contracts", "High liquidity", "Effective hedging tool"],
            image: "/Commodity Trading/future-trading.jpg"
        },
        {
            id: "options",
            title: "Options Trading",
            description: "Advanced derivatives",
            icon: Target,
            rate: "Limited Risk",
            tenure: "1 day to 1 month",
            minAmount: "₹3,00,000",
            features: ["Unlimited profit potential", "Flexible strategies", "Multiple trading approaches"],
            image: "/Commodity Trading/option-trading.jpg"
        },
        {
            id: "commodities",
            title: "Commodity Trading",
            description: "",
            icon: Globe,
            rate: "Inflation Hedge",
            tenure: "1 day to 1 month",
            minAmount: "₹3,00,000",
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
                                    className="text-base md:text-lg font-crimson text-white/90 leading-relaxed mb-8 text-justify"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8, delay: 0.4 }}
                                >
                                    Access futures, options, and commodity markets with professional trading strategies. Diversify your portfolio with gold, silver, crude oil, and more.
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
                        <div className="flex justify-center">
                            <p className="text-lg md:text-xl font-crimson text-tertiary/80 max-w-3xl text-center">
                                Choose from futures, options, and direct commodity trading
                            </p>
                        </div>
                    </motion.div>

                    {/* Grid */}
                    <ProductGrid
                        products={tradingProducts}
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

            {/* Market Insights Section */}
            <section className="py-16 bg-gradient-to-br from-secondary/10 to-secondary/5">
                <div className="mx-auto max-w-7xl space-y-12 px-4 sm:px-6 lg:px-8 md:space-y-20">
                    {/* Header */}
                    <div className="relative z-10 mx-auto max-w-4xl space-y-4 text-center">
                        <p className="text-sm font-playfair font-semibold text-tertiary/80 uppercase tracking-[0.15em] mb-4">
                            MARKET INSIGHTS
                        </p>
                        <h2 className="text-balance text-4xl md:text-5xl lg:text-6xl font-bold font-playfair text-tertiary leading-tight">
                            Expert Analysis & Insights
                        </h2>
                        <div className="flex justify-center">
                            <p className="text-lg md:text-xl font-crimson text-tertiary/80 max-w-3xl leading-relaxed text-center">
                                Stay ahead with expert analysis and market updates
                            </p>
                        </div>
                    </div>

                    {/* Insights Grid */}
                    <div className="relative mx-auto grid max-w-6xl gap-8 sm:grid-cols-2 lg:grid-cols-3">
                        {[
                            { title: "Technical Analysis", image: "/technical-analysis.jpg" },
                            { title: "Market Reports", image: "/market-insights.jpg" },
                            { title: "Trading Signals", image: "/risk-assessment.jpg" }
                        ].map((insight, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="group text-center transition-all duration-300"
                            >
                                {/* Circular Image Container - Increased Size */}
                                <div className="w-48 h-48 mx-auto mb-6 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 border-2 border-secondary/20 overflow-hidden">
                                    <img 
                                        src={insight.image} 
                                        alt={insight.title}
                                        className="w-full h-full object-cover"
                                        loading="lazy"
                                    />
                                </div>
                                {/* Title */}
                                <h3 className="text-lg md:text-xl font-bold font-playfair text-tertiary mb-6 min-h-[3.5rem] flex items-center justify-center">
                                    {insight.title}
                                </h3>
                                {/* Button */}
                                <button
                                    onClick={() => navigate('/contact')}
                                    className="bg-secondary hover:bg-secondary/90 text-white px-6 py-3 rounded-full font-semibold font-crimson transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 mx-auto"
                                >
                                    Explore Now
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </motion.div>
                        ))}
                    </div>
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
