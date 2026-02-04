import { useEffect } from 'react';
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  Calculator,
  PiggyBank,
  ArrowRight
} from "lucide-react";
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Footer from '@/components/Footer';
import Navigation from '@/components/Navigation';
import CTASection from '@/components/CTASection';

interface SubService {
  id: string;
  icon: React.ElementType;
  title: string;
  description: string;
  process: string[];
  details: string;
  specializations: string[];
}

const WealthManagement = () => {
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({ duration: 500, once: true });
  }, []);

  const services: SubService[] = [
    {
      id: 'portfolio',
      icon: TrendingUp,
      title: 'Investment Portfolio Management',
      description: 'Customized portfolio construction using modern portfolio theory and tactical asset allocation',
      process: ['Initial risk assessment', 'Strategic allocation', 'Implementation', 'Ongoing monitoring', 'Quarterly reviews'],
      details: 'As your fiduciary, we are legally bound to act in your best interest at all times.',
      specializations: ['Equity portfolio management', 'Fixed income strategies', 'Alternative investments']
    },
    {
      id: 'swp',
      icon: PiggyBank,
      title: 'SWP Calculator',
      description: 'Plan your regular withdrawals with a Systematic Withdrawal Plan (SWP) for steady income.',
      process: ['Current analysis', 'Goal setting', 'Gap analysis', 'Strategy implementation', 'Annual reviews'],
      details: 'Specializing in SWP strategies and tax-efficient withdrawal planning.',
      specializations: ['Systematic Withdrawal Plan', 'Retirement income', 'Tax-efficient withdrawals']
    },
    {
      id: 'tax',
      icon: Calculator,
      title: 'Tax Optimization Strategies',
      description: 'Tax-loss harvesting, charitable giving strategies, and estate planning coordination',
      process: ['Annual tax planning', 'Strategy implementation', 'Year-end reviews', 'Next year planning'],
      details: 'Typically save clients 15–25% in annual tax obligations.',
      specializations: ['Tax-loss harvesting', 'ELSS planning', 'Section 80C optimization']
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section 
        className="relative w-full overflow-hidden min-h-[60vh] flex items-center"
        style={{
          backgroundImage: 'url(/wealth-management.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-tertiary/85"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <h1 className="font-playfair text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Wealth Management Services
            </h1>
            <p className="font-crimson text-lg md:text-xl text-white/90 mb-8 leading-relaxed text-justify">
              We help you build, grow, and protect your wealth through comprehensive portfolio solutions. From strategic asset allocation to tax optimization, we provide data-driven strategies you can trust.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-[#FAFAFA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div data-aos="fade-down" className="text-center mb-16">
            <h2 className="font-playfair text-3xl md:text-4xl lg:text-5xl font-bold text-tertiary mb-6 leading-tight">
              Our Wealth Management Solutions
            </h2>
          </div>

          {/* Sub-Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
            {services.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="border border-gray-200 rounded-2xl p-6 hover:border-secondary/50 hover:shadow-lg transition-all duration-300 bg-white"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-secondary/20 rounded-full flex items-center justify-center">
                    <service.icon className="w-6 h-6 text-secondary" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-playfair text-xl md:text-2xl font-bold text-tertiary mb-3">
                      {service.title}
                    </h4>
                    <p className="font-crimson text-base text-tertiary/80 mb-4 leading-relaxed text-justify">
                      {service.description}
                    </p>

                    {/* Process Overview */}
                    <div className="mb-4">
                      <h5 className="font-playfair font-semibold text-tertiary mb-2 text-sm">
                        Process Overview:
                      </h5>
                      <ul className="space-y-1">
                        {service.process.map((step, i) => (
                          <li key={i} className="font-crimson text-sm text-tertiary/70 flex items-center">
                            <div className="w-1.5 h-1.5 bg-secondary rounded-full mr-2 flex-shrink-0" />
                            {step}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Details */}
                    <p className="font-crimson text-sm text-tertiary/70 mb-3 italic">
                      {service.details}
                    </p>

                    {/* Specializations */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {service.specializations.map((spec, i) => (
                        <Badge key={i} variant="secondary" className="text-xs font-crimson">
                          {spec}
                        </Badge>
                      ))}
                    </div>
                    
                    {/* Schedule Now Button */}
                    <div className="flex justify-end">
                      <button
                        onClick={() => navigate('/contact')}
                        className="bg-secondary hover:bg-secondary/90 text-white px-6 py-2.5 rounded-full font-semibold font-crimson transition-all shadow-md hover:shadow-lg flex items-center gap-2"
                      >
                        Schedule Now
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <CTASection />
      <Footer />
    </div>
  );
};

export default WealthManagement;

