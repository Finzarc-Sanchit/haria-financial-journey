import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { Globe, Activity, Layers, ArrowRight } from 'lucide-react';
import ContactPopup from '@/components/ui/ContactPopup';
import { useContactPopup } from '@/hooks/useContactPopup';
import { useNavigate } from 'react-router-dom';
import CTASection from '@/components/CTASection';
import ProductGrid from '@/components/ui/product-grid';

const OtherDerivatives = () => {
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

    // Derivatives offerings data
    const derivativesProducts = [
        {
            id: 'currency-futures',
            title: 'Currency Futures & Options',
            description: 'INR hedging for importers/exporters and tactical views.',
            image: '/Other derivatives/currency-futures.jpg',
            rate: 'FX',
            tenure: 'Flexible',
            minAmount: 'Variable',
            features: [
                'INR hedging strategies',
                'Import/export protection',
                'Tactical positioning',
                'Expert guidance'
            ],
            icon: Globe
        },
        {
            id: 'energy-agri',
            title: 'Energy & Agri',
            description: 'Exposure frameworks for crude, natural gas, and select agri.',
            image: '/Other derivatives/Energy-agriculture.jpg',
            rate: 'Commodities',
            tenure: 'Customized',
            minAmount: 'As per need',
            features: [
                'Crude oil exposure',
                'Natural gas trading',
                'Agricultural commodities',
                'Risk frameworks'
            ],
            icon: Activity
        },
        {
            id: 'index-derivatives',
            title: 'Index Derivatives',
            description: 'Defined-risk spreads and tactical positioning on indices.',
            image: '/Other derivatives/index-derivatives.jpg',
            rate: 'Equity',
            tenure: 'Flexible',
            minAmount: 'Variable',
            features: [
                'Index futures & options',
                'Spread strategies',
                'Defined risk approach',
                'Tactical positioning'
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
                                        OTHER DERIVATIVES
                                    </span>
                                </motion.div>

                                {/* Main Headline */}
                                <motion.h1 
                                    className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-playfair leading-tight text-white mb-6"
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8, delay: 0.2 }}
                                >
                                    Advanced{' '}
                                    <span className="relative inline-block">
                                        <span className="relative z-10">Derivative Trading</span>
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
                                    Currency, energy, agri and index-linked exposures with risk-first design. Access diverse derivative markets with expert guidance.
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
                                        Explore Derivatives
                                    </button>
                                </motion.div>

                            </div>
                        </div>

                        {/* Right Side - Image */}
                        <div className="relative bg-gray-900 min-h-[400px] lg:min-h-screen overflow-hidden">
                            <img 
                                src="/Hero Section/commodity-trading.png" 
                                alt="Other Derivatives"
                                className="absolute inset-0 w-full h-full object-cover"
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
                            DERIVATIVES OFFERINGS
                        </p>
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-playfair font-bold text-tertiary mb-4">
                            Diverse Trading Opportunities
                        </h2>
                        <div className="flex justify-center">
                            <p className="text-lg md:text-xl font-crimson text-tertiary/80 max-w-3xl text-center">
                                Purpose-built frameworks across asset classes
                            </p>
                        </div>
                    </motion.div>

                    {/* Grid */}
                    <ProductGrid
                        products={derivativesProducts}
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

            {/* How We Operate Section */}
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
                            OUR APPROACH
                        </p>
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-playfair font-bold text-tertiary mb-4">
                            How We Operate
                        </h2>
                        <div className="flex justify-center">
                            <p className="text-lg md:text-xl font-crimson text-tertiary/80 max-w-3xl text-center">
                                Disciplined frameworks for derivative trading success
                            </p>
                        </div>
                    </motion.div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                        {/* Left Column - Operating Principles */}
                        <div className="space-y-8 md:space-y-10">
                            {/* Point 01 */}
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
                                    Eligibility and suitability assessment before onboarding
                                </h3>
                            </motion.div>

                            {/* Point 02 */}
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
                                    Playbooks for entries, exits and max loss per trade
                                </h3>
                            </motion.div>

                            {/* Point 03 */}
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
                                    Real-time risk monitoring and prudent leverage
                                </h3>
                            </motion.div>

                            {/* Point 04 */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: 0.3 }}
                                className="space-y-3"
                            >
                                <div className="text-5xl md:text-6xl font-bold font-playfair text-tertiary/20">
                                    04
                                </div>
                                <h3 className="text-xl md:text-2xl font-bold font-playfair text-tertiary">
                                    Periodic reviews and structured reporting
                                </h3>
                                <button
                                    onClick={() => navigate('/contact')}
                                    className="inline-flex items-center gap-2 bg-secondary hover:bg-secondary/90 text-white px-8 py-4 rounded-full font-semibold font-crimson transition-all shadow-lg hover:shadow-xl mt-4"
                                >
                                    <span>Get Started</span>
                                    <ArrowRight className="w-5 h-5" />
                                </button>
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
                                src="/Hero Section/commodity-trading.png" 
                                alt="Derivative Trading Operations"
                                className="w-full h-full object-cover"
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
                title="Start Your Derivatives Journey"
                description="Get expert guidance on derivative trading strategies across multiple asset classes."
            />
        </div>
    );
};

export default OtherDerivatives;
