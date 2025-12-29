import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ProductGrid from "@/components/ui/product-grid";
import { Timeline } from "@/components/ui/timeline";
import {
    Building,
    ArrowRight,
    PiggyBank,
    Flag,
    Building2,
    Award,
} from "lucide-react";
import { motion } from 'framer-motion';
import ContactPopup from '@/components/ui/ContactPopup';
import { useContactPopup } from '@/hooks/useContactPopup';
import { useNavigate } from 'react-router-dom';
import CTASection from '@/components/CTASection';

const FixedIncome = () => {
    const [investmentAmount, setInvestmentAmount] = useState(100000);
    const [tenure, setTenure] = useState(5);
    const [interestRate, setInterestRate] = useState(7.5);
    const [maturityValue, setMaturityValue] = useState(0);
    const [totalInterest, setTotalInterest] = useState(0);
    const { isOpen, openPopup, closePopup } = useContactPopup();
    const navigate = useNavigate();

    const products = [
        {
            id: "fd",
            title: "Corporate Deposits",
            description: "Guaranteed returns with capital protection",
            icon: PiggyBank,
            rate: "6.5-8.5%",
            tenure: "7 days - 10 years",
            minAmount: "Variable",
            features: ["Guaranteed returns", "Capital protection", "Flexible tenure", "Quarterly interest"],
            image: "/Fixed Income/Fixed-deposits.jpg",
        },
        {
            id: "bonds",
            title: "Corporate Bonds",
            description: "Higher returns from corporate debt instruments",
            icon: Building,
            rate: "8-12%",
            tenure: "3-10 years",
            minAmount: "Variable",
            features: ["Higher returns", "Regular income", "Credit rating", "Liquidity"],
            image: "/Fixed Income/corporate-bonds.jpg",
        },
        {
            id: "gsec",
            title: "Government Securities",
            description: "Sovereign guarantee with stable returns",
            icon: Flag,
            rate: "6-7.5%",
            tenure: "1-30 years",
            minAmount: "Variable",
            features: ["Sovereign guarantee", "Zero default risk", "Tax benefits", "Liquidity"],
            image: "/Fixed Income/government-securities.jpg",
        },
        {
            id: "ncd",
            title: "NCDs",
            description: "Non-convertible debentures for higher yields",
            icon: Building2,
            rate: "9-14%",
            tenure: "1-7 years",
            minAmount: "Variable",
            features: ["Higher yields", "Credit rating", "Regular interest", "Listing benefits"],
            image: "/Fixed Income/NCDs.jpg",
        },
        {
            id: "cgb",
            title: "Capital Gain Bonds",
            description: "Save tax on long-term capital gains under Section 54EC",
            icon: Award,
            rate: "5-6%",
            tenure: "5 years",
            minAmount: "Max 50 Lakhs",
            features: ["Tax savings on LTCG", "Section 54EC benefits", "Lock-in period", "Sovereign guarantee"],
            image: "/Fixed Income/capital-gain-bonds.jpg",
        }
    ];

    // Laddering Strategy Data
    const ladderSteps = [
        {
            year: 'Year 1',
            amount: '₹2,00,000',
            rate: '7.2%',
            maturity: '2025'
        },
        {
            year: 'Year 2',
            amount: '₹2,00,000',
            rate: '7.5%',
            maturity: '2026'
        },
        {
            year: 'Year 3',
            amount: '₹2,00,000',
            rate: '7.8%',
            maturity: '2027'
        },
        {
            year: 'Year 4',
            amount: '₹2,00,000',
            rate: '8%',
            maturity: '2028'
        },
        {
            year: 'Year 5',
            amount: '₹2,00,000',
            rate: '8.2%',
            maturity: '2029'
        }
    ];

    // Transform ladder steps into timeline data
    const ladderTimelineData = ladderSteps.map((step, index) => ({
        title: step.year,
        content: (
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-xl border-2 border-secondary/20">
                <div className="space-y-4">
                    <div className="flex justify-between items-center py-3 border-b border-gray-200">
                        <span className="text-tertiary/70 font-crimson font-semibold">Amount</span>
                        <span className="text-xl font-playfair font-bold text-tertiary">{step.amount}</span>
                    </div>
                    
                    <div className="flex justify-between items-center py-3 border-b border-gray-200">
                        <span className="text-tertiary/70 font-crimson font-semibold">Rate</span>
                        <span className="text-xl font-playfair font-bold text-secondary">{step.rate}</span>
                    </div>
                    
                    <div className="flex justify-between items-center py-3">
                        <span className="text-tertiary/70 font-crimson font-semibold">Maturity</span>
                        <span className="text-xl font-playfair font-bold text-tertiary">{step.maturity}</span>
                    </div>
                </div>
            </div>
        ),
    }));

    // Fixed Income Calculator
    useEffect(() => {
        const principal = investmentAmount;
        const rate = interestRate / 100;
        const time = tenure;
        
        const maturity = principal * Math.pow(1 + rate, time);
        const interest = maturity - principal;
        
        setMaturityValue(maturity);
        setTotalInterest(interest);
    }, [investmentAmount, tenure, interestRate]);

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
                                        FIXED INCOME INVESTMENTS
                                    </span>
                                </motion.div>

                                {/* Main Headline */}
                                <motion.h1 
                                    className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-playfair leading-tight text-white mb-6"
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8, delay: 0.2 }}
                                >
                                    Stable Returns with{' '}
                                    <span className="relative inline-block">
                                        <span className="relative z-10">Fixed Income</span>
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
                                    Secure your financial future with guaranteed returns. From corporate deposits to government securities, choose the perfect fixed income instrument.
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
                                        <span>Get Started</span>
                                        <ArrowRight className="w-4 h-4" />
                                    </button>
                                    <button 
                                        onClick={() => scrollToSection('products')}
                                        className="border-2 border-white/30 hover:bg-white/10 text-white px-8 py-4 rounded-full font-semibold font-crimson transition-all backdrop-blur-sm flex items-center justify-center"
                                    >
                                        View Products
                                    </button>
                                </motion.div>

                            </div>
                        </div>

                        {/* Right Side - Image */}
                        <div className="relative bg-gray-900 min-h-[400px] lg:min-h-screen overflow-hidden">
                            <img 
                                src="/Hero Section/fixed-income-investment.png" 
                                alt="Fixed Income"
                                className="absolute inset-0 w-full h-full object-cover"
                            />
                            <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary opacity-20 rounded-full transform translate-x-1/2 translate-y-1/2 z-10"></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Products Section */}
            <section id="products" className="py-16 bg-[#FAFAFA]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{ duration: 0.8 }}
                        className="text-center mb-16"
                    >
                        <p className="text-sm font-crimson text-tertiary/60 uppercase tracking-wider mb-4">
                            OUR PRODUCTS
                        </p>
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-playfair font-bold text-tertiary mb-4">
                            Fixed Income Products
                        </h2>
                        <div className="flex justify-center">
                            <p className="text-lg md:text-xl font-crimson text-tertiary/80 max-w-3xl text-center">
                                Choose from a wide range of fixed income instruments
                            </p>
                        </div>
                    </motion.div>

                    {/* Grid */}
                    <ProductGrid
                        products={products}
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

            {/* Fixed Income Calculator Section */}
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
                            CALCULATE RETURNS
                        </p>
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-playfair font-bold text-tertiary mb-4">
                            Fixed Income Calculator
                        </h2>
                        <div className="flex justify-center">
                            <p className="text-lg md:text-xl font-crimson text-tertiary/80 max-w-3xl text-center">
                                Calculate your fixed income maturity amount
                            </p>
                        </div>
                    </motion.div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Calculator Inputs */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-2xl font-playfair text-tertiary">
                                    Investment Details
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div>
                                    <Label className="text-base font-crimson font-semibold text-tertiary">Investment Amount (₹)</Label>
                                    <div className="flex items-center space-x-4 mt-2">
                                        <Slider
                                            value={[investmentAmount]}
                                            onValueChange={(value) => setInvestmentAmount(value[0])}
                                            max={5000000}
                                            min={10000}
                                            step={10000}
                                            className="flex-1"
                                        />
                                        <Input
                                            value={investmentAmount.toLocaleString()}
                                            onChange={(e) => setInvestmentAmount(parseInt(e.target.value.replace(/,/g, '')) || 0)}
                                            className="w-32 text-center font-crimson"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <Label className="text-base font-crimson font-semibold text-tertiary">Tenure (Years)</Label>
                                    <div className="flex items-center space-x-4 mt-2">
                                        <Slider
                                            value={[tenure]}
                                            onValueChange={(value) => setTenure(value[0])}
                                            max={10}
                                            min={1}
                                            step={1}
                                            className="flex-1"
                                        />
                                        <Input
                                            value={tenure}
                                            onChange={(e) => setTenure(parseInt(e.target.value) || 0)}
                                            className="w-16 text-center font-crimson"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <Label className="text-base font-crimson font-semibold text-tertiary">Interest Rate (%)</Label>
                                    <div className="flex items-center space-x-4 mt-2">
                                        <Slider
                                            value={[interestRate]}
                                            onValueChange={(value) => setInterestRate(value[0])}
                                            max={12}
                                            min={4}
                                            step={0.1}
                                            className="flex-1"
                                        />
                                        <Input
                                            value={interestRate}
                                            onChange={(e) => setInterestRate(parseFloat(e.target.value) || 0)}
                                            className="w-20 text-center font-crimson"
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Results Display */}
                        <div className="space-y-6">
                            <Card className="bg-gradient-to-br from-secondary/20 to-transparent border-secondary/20">
                                <CardContent className="p-6">
                                    <div className="text-center">
                                        <div className="text-3xl font-playfair font-bold text-secondary mb-2">
                                            ₹{maturityValue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                                        </div>
                                        <p className="text-tertiary/70 font-crimson">Maturity Amount</p>
                                    </div>
                                </CardContent>
                            </Card>

                            <div className="grid grid-cols-2 gap-4">
                                <Card>
                                    <CardContent className="p-4 text-center">
                                        <div className="text-xl font-playfair font-bold text-tertiary mb-1">
                                            ₹{investmentAmount.toLocaleString('en-IN')}
                                        </div>
                                        <p className="text-sm text-tertiary/70 font-crimson">Principal Amount</p>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardContent className="p-4 text-center">
                                        <div className="text-xl font-playfair font-bold text-green-600 mb-1">
                                            ₹{totalInterest.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                                        </div>
                                        <p className="text-sm text-tertiary/70 font-crimson">Total Interest</p>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Laddering Strategy Section */}
            <section className="bg-tertiary py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{ duration: 0.8 }}
                        className="text-center mb-2"
                    >
                        <p className="text-sm font-crimson text-white/60 uppercase tracking-wider mb-4">
                            INVESTMENT STRATEGY
                        </p>
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-playfair font-bold text-white mb-4">
                            Laddering Strategy
                        </h2>
                        <div className="flex justify-center">
                            <p className="text-lg md:text-xl font-crimson text-white/80 max-w-3xl">
                                Optimize your returns with systematic investment laddering
                            </p>
                        </div>
                    </motion.div>
                </div>
                
                {/* Timeline Component */}
                <Timeline data={ladderTimelineData} />
            </section>

            {/* Benefits of Laddering Section */}
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
                            BENEFITS OF LADDERING
                        </p>
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-playfair font-bold text-tertiary mb-4">
                            Strategic Advantages
                        </h2>
                        <div className="flex justify-center">
                            <p className="text-lg md:text-xl font-crimson text-tertiary/80 max-w-3xl text-center">
                                Strategic advantages of a well-planned laddering approach
                            </p>
                        </div>
                    </motion.div>

                    <div className="space-y-8 md:space-y-10 max-w-4xl mx-auto">
                        {/* Benefit 01 - Higher Returns */}
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
                                Higher Returns
                            </h3>
                            <p className="text-base md:text-lg font-crimson text-tertiary/70 leading-relaxed">
                                Lock in better rates by investing across different time periods. Longer-term deposits typically offer higher interest rates, allowing you to maximize overall portfolio returns.
                            </p>
                        </motion.div>

                        {/* Benefit 02 - Risk Management */}
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
                                Risk Management
                            </h3>
                            <p className="text-base md:text-lg font-crimson text-tertiary/70 leading-relaxed">
                                Spread maturity dates to reduce interest rate risk. As deposits mature regularly, you can reinvest at current market rates, protecting against rate fluctuations.
                            </p>
                        </motion.div>

                        {/* Benefit 03 - Regular Income */}
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
                                Regular Income
                            </h3>
                            <p className="text-base md:text-lg font-crimson text-tertiary/70 leading-relaxed mb-4">
                                Quarterly interest payouts provide consistent cash flow. Staggered maturities ensure regular access to funds without compromising on returns or breaking deposits prematurely.
                            </p>
                            <Button
                                className="bg-secondary hover:bg-secondary/90 text-white font-crimson font-semibold"
                                onClick={() => navigate('/contact')}
                            >
                                Plan Your Ladder Strategy
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
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
                title="Start Your Fixed Income Journey"
                description="Get expert guidance on fixed income investments tailored to your goals."
            />
        </div>
    );
};

export default FixedIncome;
