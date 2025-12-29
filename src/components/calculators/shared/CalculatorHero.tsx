import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

interface Breadcrumb {
    label: string;
    to?: string;
}

interface CalculatorHeroProps {
    title: string;
    subtitle: string;
    breadcrumbs: Breadcrumb[];
    icon?: ReactNode;
    badges?: ReactNode;
    description: string;
    image?: string;
}

const CalculatorHero: React.FC<CalculatorHeroProps> = ({
    title,
    subtitle,
    description,
    image = "/hero-mutual-funds.webp",
}) => {
    const navigate = useNavigate();

    const scrollToCalculator = () => {
        const calculatorSection = document.querySelector('.calculator-section');
        if (calculatorSection) {
            calculatorSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
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
                                    {subtitle}
                                </span>
                            </motion.div>

                            {/* Main Headline */}
                            <motion.h1 
                                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-playfair leading-tight text-white mb-6"
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                            >
                                {title}
                            </motion.h1>

                            {/* Description */}
                            <motion.p 
                                className="text-base md:text-lg font-crimson text-white/90 leading-relaxed mb-8 text-justify"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.4 }}
                            >
                                {description}
                            </motion.p>

                            {/* CTA Buttons */}
                            <motion.div 
                                className="flex flex-col sm:flex-row gap-4"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.6 }}
                            >
                                <button 
                                    onClick={scrollToCalculator}
                                    className="bg-secondary hover:bg-secondary/90 text-white px-8 py-4 rounded-full font-semibold font-crimson transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                                >
                                    <span>Calculate Now</span>
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
                            src={image}
                            alt={title}
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                        <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary opacity-20 rounded-full transform translate-x-1/2 translate-y-1/2 z-10"></div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CalculatorHero;
