import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
    TrendingUp,
    Shield,
    Scale,
    Coins,
    ArrowRight,
    CheckCircle,
} from "lucide-react";
import { motion } from 'framer-motion';
import ContactPopup from '@/components/ui/ContactPopup';
import { useContactPopup } from '@/hooks/useContactPopup';
import { useNavigate } from 'react-router-dom';
import CTASection from '@/components/CTASection';
import ProductGrid from '@/components/ui/product-grid';
import AMCShowcase from '@/components/AMCShowcase';

const MutualFunds = () => {
    const { isOpen, openPopup, closePopup } = useContactPopup();
    const navigate = useNavigate();

    const fundTypes = [
        {
            id: "equity",
            title: "Equity Mutual Funds",
            description: "High growth potential with market-linked returns",
            icon: TrendingUp,
            rate: "High Risk",
            tenure: "5+ years",
            minAmount: "₹500",
            returns: "12-18%",
            features: ["Market growth", "High returns", "Long-term focus", "Diversification"],
            image: "/Mutual funds/equity.jpg",
            classifications: {
                "Market Cap Based Active Funds": ["Large Cap", "Mid Cap", "Small Cap", "Flexi Cap", "Multi Cap"],
                "Index Funds": ["Nifty 50", "Nifty Next 50", "Nifty 100", "Midcap150", "Smallcap", "Microcap", "Total Market Index Fund"],
                "Sectoral and Thematic Funds": ["Financial Services", "Pharma", "Technology", "Consumption", "Infrastructure", "and many more"]
            }
        },
        {
            id: "debt",
            title: "Debt Funds",
            description: "Stable returns with lower risk profile",
            icon: Shield,
            rate: "Low Risk",
            tenure: "1-3 years",
            minAmount: "₹500",
            returns: "6-9%",
            features: ["Stable returns", "Lower risk", "Regular income", "Capital preservation"],
            image: "/Mutual funds/debt.jpg",
            classifications: {
                "Short Term Debt Funds": ["Liquid Funds", "Ultra Short Term Funds", "Money Market Funds", "Low Duration Funds"],
                "Medium Term to Long Term Debt Funds": ["Medium Term Funds", "Long Term Funds", "Corporate Bond Funds", "Dynamic Bond Fund", "Banking and PSU Fund"],
                "Government Securities Fund": []
            }
        },
        {
            id: "hybrid",
            title: "Hybrid Funds",
            description: "Balanced approach with equity and debt mix",
            icon: Scale,
            rate: "Moderate Risk",
            tenure: "3-5 years",
            minAmount: "₹500",
            returns: "8-12%",
            features: ["Balanced risk", "Moderate returns", "Flexible allocation", "Tax efficiency"],
            image: "/Mutual funds/hybrid.jpg",
            classifications: {
                "Equity Oriented Hybrid Funds": [],
                "Debt Oriented Hybrid Funds": [],
                "Multi Asset Funds": []
            }
        },
        {
            id: "international",
            title: "International Funds",
            description: "Get exposure to global securities by investing in international funds",
            icon: Coins,
            rate: "High Risk",
            tenure: "5+ years",
            minAmount: "₹500",
            returns: "10-15%",
            features: ["Global diversification", "Currency exposure", "International markets", "Long-term growth"],
            image: "/Mutual funds/international.jpg"
        }
    ];

    const topFunds = [
        {
            name: "Haria Equity Growth Fund",
            category: "Large Cap",
            nav: "₹45.67",
            returns: "+15.8%",
            risk: "Moderate"
        },
        {
            name: "Haria Balanced Advantage Fund",
            category: "Hybrid",
            nav: "₹32.45",
            returns: "+12.3%",
            risk: "Moderate"
        }
    ];

    // Handle hash-based scrolling to sections
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
                                        MUTUAL FUND INVESTMENTS
                                    </span>
                                </motion.div>

                                {/* Main Headline */}
                                <motion.h1 
                                    className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-playfair leading-tight text-white mb-6"
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8, delay: 0.2 }}
                                >
                                    Explore Mutual Funds for{' '}
                                    <span className="relative inline-block">
                                        <span className="relative z-10">Your Various Needs</span>
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
                                    Systematic investment planning for long-term wealth creation. From equity to debt funds, find the perfect mix for your financial goals.
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
                                        <span>Start SIP</span>
                                        <ArrowRight className="w-4 h-4" />
                                    </button>
                                    <button 
                                        onClick={() => scrollToSection('investment-categories')}
                                        className="border-2 border-white/30 hover:bg-white/10 text-white px-8 py-4 rounded-full font-semibold font-crimson transition-all backdrop-blur-sm flex items-center justify-center"
                                    >
                                        Explore Funds
                                    </button>
                                </motion.div>

                            </div>
                        </div>

                        {/* Right Side - Image */}
                        <div className="relative bg-gray-900 min-h-[400px] lg:min-h-screen overflow-hidden">
                            <img 
                                src="/Hero Section/mutual-funds.png" 
                                alt="Mutual Funds"
                                className="absolute inset-0 w-full h-full object-cover"
                            />
                            <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary opacity-20 rounded-full transform translate-x-1/2 translate-y-1/2 z-10"></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Fund Types Section */}
            <section id="investment-categories" className="py-16 bg-[#FAFAFA]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{ duration: 0.8 }}
                        className="text-center mb-16"
                    >
                        <p className="text-sm font-crimson text-tertiary/60 uppercase tracking-wider mb-4">
                            INVESTMENT CATEGORIES
                        </p>
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-playfair font-bold text-tertiary mb-4">
                            Choose Your Fund Type
                        </h2>
                        <div className="flex justify-center">
                            <p className="text-lg md:text-xl font-crimson text-tertiary/80 max-w-3xl text-center">
                            Select the right fund type based on your goals and risk appetite
                        </p>
                        </div>
                    </motion.div>

                    {/* Fund Types with Classifications */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {fundTypes.map((fund, index) => (
                            <motion.div
                                key={fund.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow duration-300 flex flex-col h-full"
                            >
                                {/* Image */}
                                <div className="bg-muted rounded-t-2xl aspect-video overflow-hidden">
                                    <img
                                        src={fund.image || "/placeholder.svg"}
                                        alt={fund.title}
                                        className="w-full h-full object-cover"
                                        loading="lazy"
                                    />
                                </div>

                                {/* Content */}
                                <div className="p-6 flex flex-col flex-grow">
                                    {/* Title and Badge */}
                                    <div className="flex items-start justify-between gap-3 mb-3">
                                        <h3 className="text-2xl font-playfair font-bold text-tertiary flex-1">
                                            {fund.title}
                                        </h3>
                                        <Badge className="bg-secondary/20 text-secondary text-xs flex-shrink-0">
                                            {fund.rate}
                                        </Badge>
                                    </div>

                                    {/* Description */}
                                    <p className="text-base font-crimson text-tertiary/80 leading-relaxed mb-4 text-justify">
                                        {fund.description}
                                    </p>

                                    {/* Details */}
                                    <div className="flex gap-4 text-sm mb-4 pb-4 border-b border-gray-200">
                                        <div className="font-crimson text-tertiary/70">
                                            <span className="font-semibold">Tenure: </span>
                                            <span>{fund.tenure}</span>
                                        </div>
                                        <div className="font-crimson text-tertiary/70">
                                            <span className="font-semibold">Min Amount: </span>
                                            <span>{fund.minAmount}</span>
                                        </div>
                                    </div>

                                    {/* Classifications */}
                                    {fund.classifications && (
                                        <div className="mb-4">
                                            <h4 className="font-playfair font-semibold text-tertiary mb-3 text-lg">
                                                {fund.id === "equity" ? "Classification of Equity Funds –" :
                                                 fund.id === "debt" ? "Classification of Debt Funds" :
                                                 fund.id === "hybrid" ? "Classification of Hybrid Funds" :
                                                 "Classifications"}
                                            </h4>
                                            <div className="space-y-3">
                                                {Object.entries(fund.classifications).map(([category, items], catIndex) => (
                                                    <div key={catIndex} className="mb-3">
                                                        <h5 className="font-crimson font-semibold text-tertiary mb-2 text-sm">
                                                            {category === "Market Cap Based Active Funds" ? "Market Cap Based Active Funds –" :
                                                             category === "Index Funds" ? "Index Funds –" :
                                                             category === "Sectoral and Thematic Funds" ? "Sectoral and Thematic Funds –" :
                                                             category === "Short Term Debt Funds" ? "Short Term Debt Funds –" :
                                                             category === "Medium Term to Long Term Debt Funds" ? "Medium Term to Long Term Debt Funds –" :
                                                             category === "Government Securities Fund" ? "Government Securities Fund –" :
                                                             category === "Equity Oriented Hybrid Funds" ? "Equity Oriented Hybrid Funds" :
                                                             category === "Debt Oriented Hybrid Funds" ? "Debt Oriented Hybrid Funds" :
                                                             category === "Multi Asset Funds" ? "Multi Asset Funds" :
                                                             category}
                                                        </h5>
                                                        {items.length > 0 && (
                                                            <div className="flex flex-wrap gap-2 ml-4">
                                                                {items.map((item, itemIndex) => (
                                                                    <Badge 
                                                                        key={itemIndex} 
                                                                        variant="outline" 
                                                                        className="text-xs font-crimson border-tertiary/30 text-tertiary/80 bg-tertiary/5"
                                                                    >
                                                                        {item}
                                                                    </Badge>
                                                                ))}
                                                            </div>
                                                        )}
                                                        {category === "Index Funds" && (
                                                            <p className="text-xs font-crimson text-tertiary/70 ml-4 mt-1 italic">
                                                                These are passive funds which mirror the index performance.
                                                            </p>
                                                        )}
                                                        {category === "Short Term Debt Funds" && (
                                                            <p className="text-xs font-crimson text-tertiary/70 ml-4 mt-1 italic">
                                                                For your short term needs of less than year.
                                                            </p>
                                                        )}
                                                        {category === "Government Securities Fund" && (
                                                            <p className="text-xs font-crimson text-tertiary/70 ml-4 mt-1">
                                                                Invests only in Government Securities
                                                            </p>
                                                        )}
                                                        {category === "Equity Oriented Hybrid Funds" && items.length === 0 && (
                                                            <p className="text-xs font-crimson text-tertiary/70 ml-4 mt-1">
                                                                Balanced mix with higher equity allocation
                                                            </p>
                                                        )}
                                                        {category === "Debt Oriented Hybrid Funds" && items.length === 0 && (
                                                            <p className="text-xs font-crimson text-tertiary/70 ml-4 mt-1">
                                                                Balanced mix with higher debt allocation
                                                            </p>
                                                        )}
                                                        {category === "Multi Asset Funds" && items.length === 0 && (
                                                            <p className="text-xs font-crimson text-tertiary/70 ml-4 mt-1">
                                                                Diversified across multiple asset classes
                                                            </p>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* International Funds Special Description */}
                                    {fund.id === "international" && (
                                        <div className="mb-4">
                                            <h4 className="font-playfair font-semibold text-tertiary mb-2 text-lg">
                                                International Funds
                                            </h4>
                                            <p className="text-sm font-crimson text-tertiary/80 text-justify">
                                                Get Exposure to global securities by investing in international funds.
                                            </p>
                                        </div>
                                    )}

                                    {/* Features */}
                                    <div className="space-y-2 mb-4">
                                        {fund.features.slice(0, 4).map((feature, i) => (
                                            <div key={i} className="flex items-center gap-2">
                                                <CheckCircle className="h-4 w-4 text-secondary flex-shrink-0" />
                                                <span className="text-sm font-crimson text-tertiary/70">
                                                    {feature}
                                                </span>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Button - Aligned at bottom */}
                                    <div className="mt-auto pt-4">
                                        <button
                                            onClick={() => navigate('/contact')}
                                            className="w-full bg-secondary hover:bg-secondary/90 text-white font-crimson font-semibold py-3 rounded-full transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                                        >
                                            Invest Now
                                            <ArrowRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* AMC Showcase Section */}
            <AMCShowcase />

            {/* CTA Section */}
            <CTASection />

            {/* Contact Popup */}
            <ContactPopup
                isOpen={isOpen}
                onClose={closePopup}
                title="Start Your Mutual Fund Journey"
                description="Get expert guidance on SIP investments and fund selection tailored to your goals."
            />
        </div>
    );
};

export default MutualFunds;
