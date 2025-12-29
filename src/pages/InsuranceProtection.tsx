import { useEffect } from 'react';
import { Badge } from "@/components/ui/badge";
import {
  Shield,
  Heart,
  FileText,
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

const InsuranceProtection = () => {
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({ duration: 500, once: true });
  }, []);

  const services: SubService[] = [
    {
      id: 'life',
      icon: Shield,
      title: 'Life Insurance Analysis',
      description: 'Comprehensive review of term vs. permanent insurance, estate planning integration',
      process: ['Needs analysis', 'Product comparison', 'Implementation', 'Annual reviews'],
      details: 'Specializing in key person coverage and business succession planning.',
      specializations: ['Executive life insurance', 'Key person coverage', 'Business succession']
    },
    {
      id: 'health',
      icon: Heart,
      title: 'Health & Disability Insurance',
      description: 'Group benefits optimization, supplemental coverage analysis, disability income planning',
      process: ['Current coverage review', 'Gap analysis', 'Recommendations', 'Implementation support'],
      details: 'For professionals requiring comprehensive coverage and income protection.',
      specializations: ['Group benefits optimization', 'Supplemental coverage', 'Disability planning']
    },
    {
      id: 'estate',
      icon: FileText,
      title: 'Estate Planning Coordination',
      description: 'Will and trust review, beneficiary coordination, tax-efficient wealth transfer',
      process: ['Estate analysis', 'Attorney coordination', 'Implementation', 'Regular updates'],
      details: 'Comprehensive estate planning to ensure smooth wealth transfer.',
      specializations: ['Will optimization', 'Trust structures', 'Beneficiary planning']
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section 
        className="relative w-full overflow-hidden min-h-[60vh] flex items-center"
        style={{
          backgroundImage: 'url(/insurance-services.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-secondary/80"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <h1 className="font-playfair text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Insurance & Protection Services
            </h1>
            <p className="font-crimson text-lg md:text-xl text-white/90 mb-8 leading-relaxed text-justify">
              Struggling to find the right protection for your loved ones? You're not alone. Our insurance solutions make safeguarding your family's future simpler, clearer, anywhere.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-[#FAFAFA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div data-aos="fade-down" className="text-center mb-16">
            <h2 className="font-playfair text-3xl md:text-4xl lg:text-5xl font-bold text-tertiary mb-6 leading-tight">
              Our Insurance & Protection Solutions
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

export default InsuranceProtection;

