import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    TrendingUp,
    Shield,
    Scale,
    Coins,
    Calculator,
    ArrowRight,
    CheckCircle,
} from "lucide-react";
import { motion } from 'framer-motion';
import ContactPopup from '@/components/ui/ContactPopup';
import { useContactPopup } from '@/hooks/useContactPopup';
import { useNavigate } from 'react-router-dom';
import CTASection from '@/components/CTASection';
import CircularCarousel from '@/components/ui/circular-carousel';

const MutualFunds = () => {
    const [sipAmount, setSipAmount] = useState(5000);
    const [sipDuration, setSipDuration] = useState(10);
    const [expectedReturn, setExpectedReturn] = useState(12);
    const [totalInvestment, setTotalInvestment] = useState(0);
    const [totalValue, setTotalValue] = useState(0);
    const [totalGain, setTotalGain] = useState(0);
    const [riskLevel, setRiskLevel] = useState(3);
    const { isOpen, openPopup, closePopup } = useContactPopup();
    const navigate = useNavigate();

    const fundTypes = [
        {
            id: "equity",
            title: "Equity Funds",
            description: "High growth potential with market-linked returns",
            icon: TrendingUp,
            rate: "High Risk",
            tenure: "5+ years",
            minAmount: "₹500",
            returns: "12-18%",
            features: ["Market growth", "High returns", "Long-term focus", "Diversification"],
            image: "/Mutual funds/equity.jpg"
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
            image: "/Mutual funds/debt.jpg"
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
            image: "/Mutual funds/hybrid.jpg"
        },
        {
            id: "elss",
            title: "ELSS Funds",
            description: "Tax-saving equity funds with lock-in period",
            icon: Coins,
            rate: "High Risk",
            tenure: "3 years (lock-in)",
            minAmount: "₹500",
            returns: "12-16%",
            features: ["Tax benefits", "Equity exposure", "3-year lock-in", "Section 80C"],
            image: "/Mutual funds/ELSS.png"
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
        },
        {
            name: "Haria Tax Saver Fund",
            category: "ELSS",
            nav: "₹28.91",
            returns: "+14.2%",
            risk: "High"
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

    // SIP Calculator
    useEffect(() => {
        const monthlyInvestment = sipAmount;
        const months = sipDuration * 12;
        const monthlyRate = expectedReturn / 12 / 100;

        const totalInvested = monthlyInvestment * months;
        const futureValue = monthlyInvestment * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate);
        const totalGainAmount = futureValue - totalInvested;

        setTotalInvestment(totalInvested);
        setTotalValue(futureValue);
        setTotalGain(totalGainAmount);

        // Update risk level based on expected return
        // 6-8%: Conservative (1-2)
        // 9-12%: Moderate (3)
        // 13-20%: Aggressive (4-5)
        if (expectedReturn <= 8) {
            setRiskLevel(Math.max(1, Math.round((expectedReturn - 6) / 2 + 1)));
        } else if (expectedReturn <= 12) {
            setRiskLevel(3);
        } else {
            setRiskLevel(Math.min(5, Math.round((expectedReturn - 13) / 2 + 4)));
        }
    }, [sipAmount, sipDuration, expectedReturn]);

    const getRiskColor = (level: number) => {
        if (level <= 2) return "text-green-500";
        if (level <= 3) return "text-yellow-500";
        return "text-red-500";
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
                                    Build Wealth Through{' '}
                                    <span className="relative inline-block">
                                        <span className="relative z-10">Mutual Funds</span>
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
                                src="/Hero Section/mutual-funds.png" 
                                alt="Mutual Funds"
                                className="absolute inset-0 w-full h-full object-cover"
                            />
                            <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary opacity-20 rounded-full transform translate-x-1/2 translate-y-1/2 z-10"></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* SIP Calculator Section */}
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
                            PLAN YOUR INVESTMENTS
                        </p>
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-playfair font-bold text-tertiary mb-4">
                            SIP Calculator
                        </h2>
                        <p className="text-lg md:text-xl font-crimson text-tertiary/80 max-w-3xl mx-auto">
                            Plan your investments and see the power of compounding
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Calculator Inputs */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-2xl font-playfair flex items-center text-tertiary">
                                    <Calculator className="h-6 w-6 mr-2 text-secondary" />
                                    Calculate Your Returns
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div>
                                    <Label className="text-base font-crimson font-semibold text-tertiary">Monthly Investment (₹)</Label>
                                    <div className="flex items-center space-x-4 mt-2">
                                        <Slider
                                            value={[sipAmount]}
                                            onValueChange={(value) => setSipAmount(value[0])}
                                            max={50000}
                                            min={1000}
                                            step={1000}
                                            className="flex-1"
                                        />
                                        <Input
                                            value={sipAmount.toLocaleString()}
                                            onChange={(e) => setSipAmount(parseInt(e.target.value.replace(/,/g, '')) || 0)}
                                            className="w-24 text-center font-crimson"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <Label className="text-base font-crimson font-semibold text-tertiary">Investment Duration (Years)</Label>
                                    <div className="flex items-center space-x-4 mt-2">
                                        <Slider
                                            value={[sipDuration]}
                                            onValueChange={(value) => setSipDuration(value[0])}
                                            max={30}
                                            min={1}
                                            step={1}
                                            className="flex-1"
                                        />
                                        <Input
                                            value={sipDuration}
                                            onChange={(e) => setSipDuration(parseInt(e.target.value) || 0)}
                                            className="w-16 text-center font-crimson"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <Label className="text-base font-crimson font-semibold text-tertiary">Expected Return (%)</Label>
                                    <div className="flex items-center space-x-4 mt-2">
                                        <Slider
                                            value={[expectedReturn]}
                                            onValueChange={(value) => setExpectedReturn(value[0])}
                                            max={20}
                                            min={6}
                                            step={1}
                                            className="flex-1"
                                        />
                                        <Input
                                            value={expectedReturn}
                                            onChange={(e) => setExpectedReturn(parseInt(e.target.value) || 0)}
                                            className="w-16 text-center font-crimson"
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Results Display */}
                        <div className="space-y-6">
                            <Card className="bg-gradient-to-br from-tertiary/10 to-transparent border-tertiary/20">
                                <CardContent className="p-6">
                                    <div className="text-center">
                                        <div className="text-3xl font-playfair font-bold text-tertiary mb-2">
                                            ₹{totalValue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                                        </div>
                                        <p className="text-tertiary/70 font-crimson">Total Value</p>
                                    </div>
                                </CardContent>
                            </Card>

                            <div className="grid grid-cols-2 gap-4">
                                <Card className="bg-gradient-to-br from-secondary/20 to-transparent border-secondary/20">
                                    <CardContent className="p-4 text-center">
                                        <div className="text-xl font-playfair font-bold text-secondary mb-1">
                                            ₹{totalInvestment.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                                        </div>
                                        <p className="text-sm text-tertiary/70 font-crimson">Total Investment</p>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardContent className="p-4 text-center">
                                        <div className="text-xl font-playfair font-bold text-green-600 mb-1">
                                            ₹{totalGain.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                                        </div>
                                        <p className="text-sm text-tertiary/70 font-crimson">Total Gain</p>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Risk Meter */}
                            <Card>
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <Label className="text-base font-crimson font-semibold text-tertiary">Risk Profile</Label>
                                        <span className={`text-base font-semibold font-playfair ${getRiskColor(riskLevel)}`}>
                                            {riskLevel <= 2 ? 'Conservative' : riskLevel <= 3 ? 'Moderate' : 'Aggressive'}
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className={`h-2 rounded-full transition-all duration-500 ${riskLevel <= 2 ? 'bg-green-500' : riskLevel <= 3 ? 'bg-yellow-500' : 'bg-red-500'
                                                }`}
                                            style={{ width: `${(riskLevel / 5) * 100}%` }}
                                        />
                                    </div>
                                </CardContent>
                            </Card>
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
                        <p className="text-lg md:text-xl font-crimson text-tertiary/80 max-w-3xl mx-auto">
                            Select the right fund type based on your goals and risk appetite
                        </p>
                    </motion.div>

                    {/* Carousel */}
                    <CircularCarousel
                        products={fundTypes}
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
