import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Badge } from "@/components/ui/badge";
import { Shield, TrendingUp, Layers, ArrowRight, Gem, LineChart, CheckCircle } from 'lucide-react';
import ContactPopup from '@/components/ui/ContactPopup';
import { useContactPopup } from '@/hooks/useContactPopup';
import { useNavigate } from 'react-router-dom';
import CTASection from '@/components/CTASection';
import ProductGrid from '@/components/ui/product-grid';

const GoldSilver = () => {
    const { isOpen, openPopup, closePopup } = useContactPopup();
    const navigate = useNavigate();

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

    const scrollToSection = (sectionId: string) => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    // Bullion offerings data
    const bullionProducts = [
        {
            id: 'bullion-futures',
            title: 'Bullion Futures',
            description: 'Participate in Gold & Silver price moves with prudent position sizing.',
            image: '/Gold silver/bullion.jpg',
            rate: 'Risk Managed',
            tenure: 'Flexible',
            minAmount: 'Variable',
            features: [
                'Leverage opportunities',
                'Professional guidance',
                'Market analysis',
                'Risk controls'
            ],
            icon: LineChart
        },
        {
            id: 'gold-silver-etf',
            title: 'Gold and Silver ETF',
            description: 'Invest in gold and silver through Exchange Traded Funds for easy liquidity and diversification.',
            image: '/Gold silver/hedging.jpg',
            rate: 'Liquid',
            tenure: 'Flexible',
            minAmount: 'Variable',
            features: [
                'High liquidity',
                'Easy trading',
                'Portfolio diversification',
                'Transparent pricing'
            ],
            icon: TrendingUp
        },
        {
            id: 'systematic-investment',
            title: 'Systematic Investment in Gold and Silver Mutual Funds',
            description: 'Build wealth gradually through systematic investment plans in gold and silver mutual funds.',
            image: '/Gold silver/systematic.jpg',
            rate: 'Disciplined',
            tenure: 'Long-term',
            minAmount: 'Flexible',
            features: [
                'Rupee cost averaging',
                'Systematic approach',
                'Long-term wealth building',
                'Professional fund management'
            ],
            icon: Layers
        }
    ];

    return (
        <div className="min-h-screen bg-background text-foreground">
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
                                    loading="lazy"
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
                                        GOLD & SILVER STRATEGIES
                                    </span>
                                </motion.div>

                                {/* Main Headline */}
                                <motion.h1 
                                    className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-playfair leading-tight text-white mb-6"
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8, delay: 0.2 }}
                                >
                                    Precision-Driven{' '}
                                    <span className="relative inline-block">
                                        <span className="relative z-10">Bullion Exposure</span>
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
                                    Expert guidance on gold and silver investments with disciplined risk management. Protect and grow your wealth through strategic bullion exposure.
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
                                        <span>Talk to Advisor</span>
                                        <ArrowRight className="w-4 h-4" />
                                    </button>
                                    <button 
                                        onClick={() => scrollToSection('offerings')}
                                        className="border-2 border-white/30 hover:bg-white/10 text-white px-8 py-4 rounded-full font-semibold font-crimson transition-all backdrop-blur-sm flex items-center justify-center"
                                    >
                                        Explore Solutions
                                    </button>
                                </motion.div>

                            </div>
                        </div>

                        {/* Right Side - Image */}
                        <div className="relative bg-gray-900 min-h-[400px] lg:min-h-screen overflow-hidden">
                            <img 
                                src="/Hero Section/commodity-trading.png" 
                                alt="Gold & Silver"
                                className="absolute inset-0 w-full h-full object-cover"
                                loading="lazy"
                            />
                            <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary opacity-20 rounded-full transform translate-x-1/2 translate-y-1/2 z-10"></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Offerings Section */}
            <section id="offerings" className="py-16 bg-[#FAFAFA]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{ duration: 0.8 }}
                        className="text-center mb-16"
                    >
                        <p className="text-sm font-crimson text-tertiary/60 uppercase tracking-wider mb-4">
                            BULLION OFFERINGS
                        </p>
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-playfair font-bold text-tertiary mb-4">
                            Strategic Bullion Solutions
                        </h2>
                        <div className="flex justify-center">
                            <p className="text-lg md:text-xl font-crimson text-tertiary/80 max-w-3xl text-center">
                                Institutional frameworks adapted for individual investors
                            </p>
                        </div>
                    </motion.div>

                    {/* Grid */}
                    <ProductGrid
                        products={bullionProducts}
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

            {/* CTA Section */}
            <CTASection />

            {/* Contact Popup */}
            <ContactPopup
                isOpen={isOpen}
                onClose={closePopup}
                title="Start Your Bullion Investment Journey"
                description="Get expert guidance on gold and silver investment strategies."
            />
        </div>
    );
};

export default GoldSilver;
