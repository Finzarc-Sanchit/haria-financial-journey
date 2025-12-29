import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Shield, TrendingUp, PiggyBank, Star, Clock, ArrowRight, Phone } from "lucide-react";
import { motion } from 'framer-motion';
import ContactPopup from '@/components/ui/ContactPopup';
import { useContactPopup } from '@/hooks/useContactPopup';
import { useNavigate } from 'react-router-dom';
import CTASection from '@/components/CTASection';
import ProductGrid from '@/components/ui/product-grid';

interface Product {
    id: string;
    title: string;
    description: string;
    icon: React.ElementType;
    coverage: string;
    premium: string;
    features: string[];
    rate: string;
    tenure: string;
    minAmount: string;
    image: string;
}

const LifeInsurance = () => {
    const [testimonialIndex, setTestimonialIndex] = useState(0);
    const [expandedTestimonials, setExpandedTestimonials] = useState<Set<number>>(new Set());
    const [activeStep, setActiveStep] = useState(0);
    const { isOpen, openPopup, closePopup } = useContactPopup();
    const navigate = useNavigate();

    const testimonials = [
        {
            name: "Heta Gogri",
            role: "Practicing Chartered Accountant",
            text: "I've been doing SIPs with Haria Investments for about 3–4 years now, and the experience has been really positive throughout. The team is approachable, patient, and always ready to explain things clearly. They regularly review my portfolio, suggest changes when needed, and make sure my investments stay aligned with my goals. The returns have been good, and I genuinely feel my money is being handled with care and expertise. What I appreciate most is that they never push products — they focus on what's right for you. It's been a very comfortable and trustworthy relationship.",
            rating: 5
        },
        {
            name: "Ashley",
            role: "Musician from Bangalore",
            text: "I heard about Haria investments through a common friend and I said to myself I definitely need to go pay them a visit. Being a small time business owner based in bangalore I took the first flight out that day and paid them a visit only to be greeted so warmly and professionally that I knew that this is surely the place that I would entrust my money in. Been approached by the so called best in the business by many companies things really didn't somehow narrow down for me with Investing but when I met mr. Rohan and when he began talking about the company, the approach, the attitude and keep things simple short sweet and to the point, it took me max of 45 mins that day before I signed up and even pumped in the money. It's been little over year now with mr Rohan and team and I'm so happy to be associated with them and I know that my money is in the best hands and I know I'll see my returns very soon and a big way. My SIP's are on point, timely updates and constant follow ups has just made this whole experience wonderful being from a different city altogether. I'm so glad to be associated with them and I don't hesitate whenever Rohan calls me and updates me and asks me I want to up the investment which I gladly agree to always. My wife too has now invested with Haria investors and if anyone reading this and is in two minds I highly suggest and recommend Haria investors and do get in touch with Rohan and he will gladly sort out your finances for you and you can sit back gladly and know that your money is in the best of hands. More power to you all. Keep doing what you doing. Many blessings.",
            rating: 5
        }
    ];

    const products: Product[] = [
        {
            id: "term-insurance",
            title: "Term Insurance",
            description: "Pure protection, high coverage, low premium",
            icon: Shield,
            coverage: "₹1 Crore - ₹10 Crore",
            premium: "Starting ₹500/month",
            features: ["High coverage", "Low premium", "Flexible terms", "Easy claims"],
            rate: "₹500/month",
            tenure: "5 years to lifetime",
            minAmount: "₹5 Lakhs",
            image: "/Life insurance/term-insurance.jpg"
        },
        {
            id: "whole-life-insurance",
            title: "Whole Life Insurance",
            description: "Lifelong coverage with cash value building",
            icon: TrendingUp,
            coverage: "₹50 Lakhs - ₹5 Crore",
            premium: "Starting ₹2,000/month",
            features: ["Lifelong coverage", "Cash value", "Premium flexibility"],
            rate: "₹2,000/month",
            tenure: "Lifelong",
            minAmount: "₹2.5 Lakhs",
            image: "/Life insurance/life-insurance.jpg"
        },
        {
            id: "endowment-plans",
            title: "Endowment Plans",
            description: "Savings + insurance combination",
            icon: PiggyBank,
            coverage: "₹25 Lakhs - ₹2 Crore",
            premium: "Starting ₹1,500/month",
            features: ["Guaranteed returns", "Maturity benefit", "Death benefit", "Tax savings"],
            rate: "₹1,500/month",
            tenure: "10-35 years",
            minAmount: "₹2 Lakhs",
            image: "/Life insurance/endowment-plans.jpg"
        },
        {
            id: "ulip-plans",
            title: "ULIP Plans",
            description: "Market-linked returns with life cover",
            icon: TrendingUp,
            coverage: "₹10 Lakhs - ₹1 Crore",
            premium: "Starting ₹2,500/month",
            features: ["Market returns", "Life cover", "Fund switching", "Tax benefits"],
            rate: "₹2,500/month",
            tenure: "5-25 years",
            minAmount: "₹2.5 Lakhs",
            image: "/Life insurance/ULIP-plans.jpg"
        },
        {
            id: "money-back-plans",
            title: "Money-Back Plans",
            description: "Periodic payouts during the policy term + life cover",
            icon: Clock,
            coverage: "₹10 Lakhs - ₹1 Crore",
            premium: "Starting ₹1,200/month",
            features: ["Survival benefits", "Maturity returns", "Life cover", "Bonus payout"],
            rate: "₹1,200/month",
            tenure: "10-25 years",
            minAmount: "₹2.5 Lakhs",
            image: "/Life insurance/money-back-plans.jpg"
        },
        {
            id: "pension-plans",
            title: "Pension Plans",
            description: "Secure your retirement with regular annuity payouts",
            icon: PiggyBank,
            coverage: "₹5 Lakhs - ₹2 Crore",
            premium: "Starting ₹2,000/month",
            features: ["Retirement income", "Deferred/Immediate annuity", "Optional life cover"],
            rate: "₹2,000/month",
            tenure: "Retirement age",
            minAmount: "₹1,00,000",
            image: "/Life insurance/pension-plans.jpg"
        }
    ];

    const processSteps = [
        {
            id: 1,
            title: "Assessment",
            description: "We analyze your financial needs and family requirements",
            image: "/Commitment/Meetings.jpg"
        },
        {
            id: 2,
            title: "Recommendation",
            description: "Customized plan selection based on your profile",
            image: "/Commitment/Response-Time.png"
        },
        {
            id: 3,
            title: "Application",
            description: "Smooth application process with expert guidance",
            image: "/Commitment/Reporting.jpg"
        },
        {
            id: 4,
            title: "Activation",
            description: "Quick policy activation and documentation",
            image: "/Commitment/Technology-Access.jpg"
        }
    ];

    // Testimonial carousel
    useEffect(() => {
        const timer = setInterval(() => {
            setTestimonialIndex(prev => (prev + 1) % testimonials.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    // Reset expanded state when testimonial changes
    useEffect(() => {
        setExpandedTestimonials(new Set());
    }, [testimonialIndex]);

    // Truncate text to approximately 2-3 lines (around 150-200 characters)
    const truncateText = (text: string, maxLength: number = 180) => {
        if (text.length <= maxLength) return text;
        return text.slice(0, maxLength) + '...';
    };

    const toggleTestimonial = (index: number) => {
        setExpandedTestimonials(prev => {
            const newSet = new Set(prev);
            if (newSet.has(index)) {
                newSet.delete(index);
            } else {
                newSet.add(index);
            }
            return newSet;
        });
    };

    useEffect(() => {
        const applyHash = () => {
            const hash = window.location.hash.replace('#', '');
            const el = hash ? document.getElementById(hash) : null;
            if (el) {
                el.scrollIntoView({ behavior: 'smooth' });
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
                                        INSURANCE SOLUTIONS
                        </span>
                                </motion.div>

                                {/* Main Headline */}
                                <motion.h1 
                                    className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-playfair leading-tight text-white mb-6"
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8, delay: 0.2 }}
                                >
                                    Comprehensive Life Insurance Solutions
                                </motion.h1>

                                {/* Description */}
                                <motion.p 
                                    className="text-base md:text-lg font-crimson text-white/90 leading-relaxed mb-8"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8, delay: 0.4 }}
                                >
                                    Protect your family's financial future with tailored life insurance plans. From term insurance to comprehensive coverage, find the perfect solution for your needs.
                                </motion.p>

                                {/* CTA Buttons */}
                                <motion.div 
                                    className="flex flex-col sm:flex-row gap-4"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8, delay: 0.6 }}
                                >
                                    <button 
                                        onClick={() => scrollToSection('products')}
                                        className="bg-secondary hover:bg-secondary/90 text-white px-8 py-4 rounded-full font-semibold font-crimson transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                                    >
                                        <span>View Plans</span>
                                        <ArrowRight className="w-4 h-4" />
                                    </button>
                                    <button 
                                        onClick={() => navigate('/contact')}
                                        className="border-2 border-white/30 hover:bg-white/10 text-white px-8 py-4 rounded-full font-semibold font-crimson transition-all backdrop-blur-sm flex items-center justify-center"
                                    >
                                        Get Expert Advice
                                    </button>
                                </motion.div>

                            </div>
                        </div>

                        {/* Right Side - Image */}
                        <div className="relative bg-gray-900 min-h-[400px] lg:min-h-screen overflow-hidden">
                            <img 
                                src="/Hero Section/life-insurance.png" 
                                alt="Life Insurance"
                                className="absolute inset-0 w-full h-full object-cover"
                            />
                            <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary opacity-20 rounded-full transform translate-x-1/2 translate-y-1/2 z-10"></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Product Cards Section */}
            <section
                id="products"
                className="py-16 bg-gradient-to-br from-secondary/10 to-secondary/5"
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{ duration: 0.8 }}
                        className="text-center mb-16"
                    >
                        <p className="text-sm font-playfair font-semibold text-tertiary/80 uppercase tracking-[0.15em] mb-4">
                            OUR PROTECTION PLANS
                        </p>
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-playfair font-bold text-tertiary mb-4">
                            Choose Your Protection Plan
                        </h2>
                        <div className="flex justify-center">
                            <p className="text-lg md:text-xl font-crimson text-tertiary/80 max-w-3xl text-center">
                                Tailored solutions for every life stage and financial goal
                            </p>
                        </div>
                    </motion.div>

                    {/* Protection Plans - Grid */}
                    <div>
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
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-16 bg-[#FAFAFA]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{ duration: 0.8 }}
                        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-secondary/10 to-secondary/5 p-8 md:p-12"
                    >
                        <div className="w-full overflow-hidden">
                            <div className="flex transition-transform duration-500" style={{
                                transform: `translateX(-${testimonialIndex * 100}%)`
                            }}>
                                {testimonials.map((testimonial, index) => {
                                    const isExpanded = expandedTestimonials.has(index);
                                    const shouldTruncate = testimonial.text.length > 180;
                                    const displayText = isExpanded || !shouldTruncate 
                                        ? testimonial.text 
                                        : truncateText(testimonial.text);
                                    
                                    return (
                                        <div key={index} className="w-full flex-shrink-0 text-center px-4">
                                            <div className="flex justify-center mb-4">
                                                {[...Array(testimonial.rating)].map((_, i) => (
                                                    <Star key={i} className="h-6 w-6 text-secondary fill-current" />
                                                ))}
                                            </div>
                                            <div className="mb-4">
                                                <p className="text-xl md:text-2xl font-crimson text-tertiary italic">
                                                    "{displayText}"
                                                </p>
                                                {shouldTruncate && (
                                                    <button
                                                        onClick={() => toggleTestimonial(index)}
                                                        className="mt-3 text-secondary hover:text-secondary/80 font-crimson font-semibold text-sm transition-colors underline"
                                                    >
                                                        {isExpanded ? 'Read Less' : 'Read More'}
                                                    </button>
                                                )}
                                            </div>
                                            <div>
                                                <div className="font-playfair font-semibold text-tertiary text-lg">
                                                    {testimonial.name}
                                                </div>
                                                <div className="text-base text-tertiary/60 font-crimson">
                                                    {testimonial.role}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Carousel Indicators */}
                        <div className="flex justify-center mt-6 space-x-2">
                            {testimonials.map((_, index) => (
                                <button
                                    key={index}
                                    className={`w-3 h-3 rounded-full transition-all ${index === testimonialIndex ? 'bg-secondary w-8' : 'bg-tertiary/30'
                                        }`}
                                    onClick={() => setTestimonialIndex(index)}
                                />
                            ))}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Process Flow Section */}
            <section className="py-16 bg-gradient-to-br from-secondary/10 to-secondary/5">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{ duration: 0.8 }}
                        className="text-center mb-16"
                    >
                        <p className="text-sm font-playfair font-semibold text-tertiary/80 uppercase tracking-[0.15em] mb-4">
                            HOW IT WORKS
                        </p>
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-playfair font-bold text-tertiary mb-4">
                            Simple 4-Step Process
                        </h2>
                        <div className="flex justify-center">
                            <p className="text-lg md:text-xl font-crimson text-tertiary/80 max-w-3xl text-center">
                                Get your life insurance policy in just 4 easy steps
                            </p>
                        </div>
                    </motion.div>

                    {/* Horizontal Timeline Tabs */}
                    <div className="flex justify-center mb-8">
                        <div className="flex items-center gap-2 bg-white/50 rounded-full p-2 shadow-md">
                            {processSteps.map((step, index) => (
                                <button
                                    key={step.id}
                                    onClick={() => setActiveStep(index)}
                                    className={`px-6 py-3 rounded-full font-playfair font-semibold transition-all duration-300 ${
                                        activeStep === index
                                            ? 'bg-white text-tertiary shadow-lg'
                                            : 'text-tertiary/60 hover:text-tertiary'
                                    }`}
                                >
                                    {step.title}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Process Content Card */}
                    <motion.div
                        key={activeStep}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        className="bg-white rounded-2xl shadow-xl p-8 md:p-12 min-h-[500px]"
                    >
                        <div className="flex flex-col lg:flex-row gap-8 items-center">
                            {/* Left Side - Number and Title */}
                            <div className="flex-shrink-0">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-16 h-16 rounded-full bg-tertiary flex items-center justify-center shadow-lg">
                                        <span className="text-2xl font-playfair font-bold text-white">
                                            {String(processSteps[activeStep].id).padStart(2, '0')}
                                        </span>
                                    </div>
                                    <h3 className="text-3xl md:text-4xl font-playfair font-bold text-tertiary">
                                        {processSteps[activeStep].title.toUpperCase()}
                                    </h3>
                                </div>
                                <p className="text-xl md:text-2xl font-playfair text-tertiary/80 leading-relaxed max-w-2xl">
                                    {processSteps[activeStep].description}
                                </p>
                                <button
                                    onClick={() => navigate('/contact')}
                                    className="mt-8 bg-secondary hover:bg-secondary/90 text-white px-8 py-4 rounded-full font-semibold font-crimson transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
                                >
                                    <Phone className="w-5 h-5" />
                                    <span>Schedule Now</span>
                                </button>
                            </div>

                            {/* Right Side - Image */}
                            <div className="flex-1 w-full lg:w-auto">
                                <div className="relative h-[300px] lg:h-[400px] rounded-xl overflow-hidden shadow-lg">
                                    <img 
                                        src={processSteps[activeStep].image} 
                                        alt={processSteps[activeStep].title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* CTA Section */}
            <CTASection />

            {/* Contact Popup */}
            <ContactPopup
                isOpen={isOpen}
                onClose={closePopup}
                title="Get Free Life Insurance Consultation"
                description="Secure your family's future with expert guidance on life insurance plans."
            />
        </div>
    );
};

export default LifeInsurance; 
