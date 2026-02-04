import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
    Car,
    Home,
    Plane,
    Shield,
    CheckCircle,
    Star,
    ArrowRight,
    Users,
    Building,
    Flame,
    Globe,
    MapPin,
} from "lucide-react";
import { motion } from 'framer-motion';
import ContactPopup from '@/components/ui/ContactPopup';
import { useContactPopup } from '@/hooks/useContactPopup';
import { useNavigate } from 'react-router-dom';
import CTASection from '@/components/CTASection';
import ProductGrid from '@/components/ui/product-grid';

const GeneralInsurance = () => {
    const { isOpen, openPopup, closePopup } = useContactPopup();
    const navigate = useNavigate();

    const services = [
        {
            id: "car",
            title: "Motor Insurance",
            icon: Car,
            description: "Comprehensive protection for your vehicle",
            subCategories: [
                {
                    id: "comprehensive-coverage",
                    title: "Comprehensive Coverage",
                    description: "Complete coverage including own damage and third party",
                    badge: "99% claims settled",
                    icon: Shield,
                    rate: "Starting ₹1,000/year",
                    tenure: "1-3 years",
                    minAmount: "₹5,000",
                    features: ["Own damage cover", "Third party liability", "24/7 roadside assistance", "Cashless repairs"],
                    image: "/General insurance/comprehensive.jpg"
                },
                {
                    id: "third-party-only",
                    title: "Third Party Only",
                    description: "Legal compliance coverage for third party damages",
                    badge: "Mandatory",
                    icon: CheckCircle,
                    rate: "Starting ₹800/year",
                    tenure: "1-3 years",
                    minAmount: "₹2,000",
                    features: ["Legal compliance", "Third party liability", "Affordable premium", "Quick issuance"],
                    image: "/General insurance/third-party.jpg"
                },
                {
                    id: "zero-depreciation",
                    title: "Zero Depreciation",
                    description: "Get full claim value without depreciation",
                    badge: "Premium",
                    icon: Star,
                    rate: "Starting ₹2,000/year",
                    tenure: "1-3 years",
                    minAmount: "₹8,000",
                    features: ["No depreciation", "Full claim value", "Premium coverage", "New car benefits"],
                    image: "/General insurance/zero-depreciation.jpg"
                }
            ]
        },
        {
            id: "fire",
            title: "Fire Insurance",
            icon: Flame,
            description: "Comprehensive fire protection coverage",
            subCategories: [
                {
                    id: "fire-allied-perils",
                    title: "Fire & Allied Perils",
                    description: "Covers loss due to fire, explosion etc.",
                    badge: "Essential",
                    icon: Flame,
                    rate: "Starting ₹1,000/year",
                    tenure: "1-3 years",
                    minAmount: "₹50,000",
                    features: ["Fire damage cover", "Flood damage cover", "Explosion coverage", "Quick settlement"],
                    image: "/General insurance/Fire-Allied-Perils.jpg"
                }
            ]
        },
        {
            id: "property",
            title: "Property Insurance",
            icon: Home,
            description: "Protect your home and commercial properties",
            subCategories: [
                {
                    id: "home-insurance",
                    title: "Home Insurance",
                    description: "Complete home structure and contents protection",
                    badge: "Recommended",
                    icon: Home,
                    rate: "Starting ₹1,000/year",
                    tenure: "1-3 years",
                    minAmount: "₹1 Lakh",
                    features: ["Structure cover", "Contents protection", "Natural calamities", "Theft coverage"],
                    image: "/General insurance/home-insurance.jpg"
                }
            ]
        },
        {
            id: "travel",
            title: "Travel Insurance",
            icon: Plane,
            description: "Global travel protection and assistance",
            subCategories: [
                {
                    id: "international-travel",
                    title: "International Travel",
                    description: "Worldwide travel coverage and assistance",
                    badge: "Global",
                    icon: Globe,
                    rate: "Starting ₹500/per trip",
                    tenure: "Per trip",
                    minAmount: "50k dollars",
                    features: ["Global coverage", "Emergency evacuation", "Passport loss", "24/7 assistance"],
                    image: "/General insurance/international-travel.jpg"
                },
                {
                    id: "business-travel",
                    title: "Business Travel",
                    description: "Corporate travel protection plans",
                    badge: "Corporate",
                    icon: Building,
                    rate: "Starting ₹300/day",
                    tenure: "Annual/Per trip",
                    minAmount: "50k dollars",
                    features: ["Business equipment", "Meeting delays", "Corporate benefits", "Multi-trip options"],
                    image: "/General insurance/business travel.jpg"
                }
            ]
        }
    ];

    // Scroll to section from URL hash
    useEffect(() => {
        const applyHash = () => {
            const hash = window.location.hash.replace('#', '');
            if (hash && ['car', 'fire', 'property', 'travel'].includes(hash)) {
                const target = document.getElementById(hash);
                if (target) {
                    setTimeout(() => {
                        target.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                }
            }
        };
        applyHash();
        window.addEventListener('hashchange', applyHash);
        return () => window.removeEventListener('hashchange', applyHash);
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
                                        GENERAL INSURANCE SOLUTIONS
                                    </span>
                                </motion.div>

                                {/* Main Headline */}
                                <motion.h1 
                                    className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-playfair leading-tight text-white mb-6"
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8, delay: 0.2 }}
                                >
                                    Complete Protection for{' '}
                                    <span className="relative inline-block">
                                        <span className="relative z-10">Your Assets</span>
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
                                    Comprehensive insurance solutions for all your assets and needs. From motor and fire to property and travel - we've got you covered.
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
                                        <span>Get Instant Quote</span>
                                        <ArrowRight className="w-4 h-4" />
                                    </button>
                                    <button 
                                        onClick={() => scrollToSection('all-services')}
                                        className="border-2 border-white/30 hover:bg-white/10 text-white px-8 py-4 rounded-full font-semibold font-crimson transition-all backdrop-blur-sm flex items-center justify-center"
                                    >
                                        View Plans
                                    </button>
                                </motion.div>

                            </div>
                        </div>

                        {/* Right Side - Image */}
                        <div className="relative bg-gray-900 min-h-[400px] lg:min-h-screen overflow-hidden">
                            <img 
                                src="/Hero Section/general-insurance.png" 
                                alt="General Insurance"
                                className="absolute inset-0 w-full h-full object-cover"
                            />
                            <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary opacity-20 rounded-full transform translate-x-1/2 translate-y-1/2 z-10"></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* All Services Overview */}
            <section id="all-services" className="py-16 bg-gradient-to-br from-secondary/10 to-secondary/5">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <p className="text-sm font-crimson text-tertiary/60 uppercase tracking-wider mb-4">
                            OUR INSURANCE SERVICES
                        </p>
                        <motion.h2
                            className="text-4xl md:text-5xl lg:text-6xl font-playfair font-bold text-tertiary mb-4"
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{ duration: 0.6 }}
                        >
                            All Insurance Services
                        </motion.h2>
                        <div className="flex justify-center">
                            <motion.p
                                className="text-lg md:text-xl font-crimson text-tertiary/80 max-w-3xl text-center"
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.3 }}
                                transition={{ duration: 0.6, delay: 0.1 }}
                            >
                                Complete protection for every aspect of your life
                            </motion.p>
                        </div>
                    </div>

                    {/* Services in Vertical Layout */}
                    <div className="space-y-16">
                        {services.map((service, serviceIndex) => (
                            <motion.div
                                key={service.id}
                                id={service.id}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.2 }}
                                transition={{ duration: 0.8, delay: serviceIndex * 0.1 }}
                                className="space-y-8"
                            >
                                {/* Service Header with Vignette Box */}
                                <div className="relative w-full overflow-hidden rounded-2xl mb-8">
                                    {/* Vignette Effect Box */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-secondary/20 via-secondary/10 to-tertiary/10">
                                        {/* Vignette overlay */}
                                        <div 
                                            className="absolute inset-0"
                                            style={{
                                                background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.1) 70%, rgba(0,0,0,0.2) 100%)'
                                            }}
                                        />
                                    </div>
                                    
                                    {/* Header Content Over Box */}
                                    <div className="relative z-10 px-8 py-10 md:px-12 md:py-14">
                                        <div className="flex items-center gap-4 md:gap-6">
                                            <div className="p-4 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg flex-shrink-0">
                                                <service.icon className="h-10 w-10 md:h-12 md:w-12 text-secondary" />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="text-3xl md:text-4xl lg:text-5xl font-playfair font-bold text-tertiary mb-3">
                                                    {service.title}
                                                </h3>
                                                <p className="text-lg md:text-xl font-crimson text-tertiary/80 leading-relaxed">
                                                    {service.description}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Service Cards */}
                                <ProductGrid
                                    products={service.subCategories}
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
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Why Choose Us Section */}
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
                            WHY CHOOSE US
                        </p>
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-playfair font-bold text-tertiary mb-4">
                            Why Choose Our Insurance Services?
                        </h2>
                        <div className="flex justify-center">
                            <p className="text-lg md:text-xl font-crimson text-tertiary/80 max-w-3xl text-center">
                                Comprehensive protection with expert guidance and support
                            </p>
                        </div>
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
                                    99% Claims Settled
                                </h3>
                                <p className="text-base md:text-lg font-crimson text-tertiary/70 leading-relaxed">
                                    Fast and hassle-free claims processing with one of the highest settlement rates in the industry.
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
                                    24/7 Support
                                </h3>
                                <p className="text-base md:text-lg font-crimson text-tertiary/70 leading-relaxed">
                                    Round-the-clock assistance for all your insurance needs with our dedicated support team.
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
                                    Best Prices
                                </h3>
                                <p className="text-base md:text-lg font-crimson text-tertiary/70 leading-relaxed">
                                    Competitive premiums with maximum coverage, ensuring you get the best value for your money.
                                </p>
                            </motion.div>

                            {/* Benefit 04 */}
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
                                    Expert Guidance
                                </h3>
                                <p className="text-base md:text-lg font-crimson text-tertiary/70 leading-relaxed">
                                    Get personalized advice from our insurance experts to choose the right coverage for your needs.
                                </p>
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
                                src="/insurance-services.png"
                                alt="Insurance Services"
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
                title="Get Your General Insurance Quote"
                description="Protect what matters most with comprehensive general insurance coverage."
            />
        </div>
    );
};

export default GeneralInsurance;
