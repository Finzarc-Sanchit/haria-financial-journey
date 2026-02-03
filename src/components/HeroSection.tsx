import { ArrowRight } from "lucide-react";
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import AnimatedTree from './AnimatedTree';

const HeroSection = () => {
  const navigate = useNavigate();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
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
                <span className="text-xs md:text-sm font-playfair font-semibold text-white/90 uppercase tracking-[0.15em]">
                  YOUR ONE STOP FINANCIAL SOLUTION
                </span>
              </motion.div>

              {/* Main Headline */}
              <motion.h1
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-playfair leading-tight text-white mb-6"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                Your One Stop Solution for{' '}
                <span className="relative inline-block">
                  <span className="relative z-10">Comprehensive Financial Planning</span>
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
                Insurance, Investments, and Wealth Solutions, All in One Place. Build your financial future with comprehensive planning backed by decades of expertise.
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
                  <span>Schedule Consultation</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => scrollToSection('features')}
                  className="border-2 border-white/30 hover:bg-white/10 text-white px-8 py-4 rounded-full font-semibold font-crimson transition-all backdrop-blur-sm flex items-center justify-center"
                >
                  Learn More
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
                <span>Trusted by 1500+ clients since 1957</span>
              </motion.div>
            </div>
          </div>

          {/* Right Side - Animated Tree */}
          <div className="relative bg-gray-900 min-h-[400px] lg:min-h-screen overflow-hidden flex items-center justify-center p-8">
            {/* Background gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"></div>

            {/* Animated Tree Component */}
            <div className="relative z-20 w-full h-full flex items-center justify-center">
              <AnimatedTree />
            </div>

            {/* Decorative Yellow Shape (like in reference) */}
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary opacity-20 rounded-full transform translate-x-1/2 translate-y-1/2 z-10"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;