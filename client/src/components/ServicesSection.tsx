import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  Shield,
  Calculator,
  PiggyBank,
  FileText,
  Building,
  Heart,
  ArrowRight
} from "lucide-react";
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';

interface SubService {
  id: string;
  icon: React.ElementType;
  title: string;
  description: string;
  process: string[];
  details: string;
  specializations: string[];
}

interface ServiceCategory {
  id: string;
  title: string;
  description: string;
  bgImage: string;
  bgOverlay: string;
  buttonColor: string;
  buttonTextColor: string;
  services: SubService[];
}

const ServicesSection = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 500, once: true });
  }, []);

  const serviceCategories: ServiceCategory[] = [
    {
      id: 'insurance',
      title: 'Insurance & Protection Services',
      description: 'Struggling to find the right protection for your loved ones? You\'re not alone. Our insurance solutions make safeguarding your family\'s future simpler, clearer, anywhere.',
      bgImage: '/insurance-services.png',
      bgOverlay: 'bg-secondary/80',
      buttonColor: 'bg-tertiary',
      buttonTextColor: 'text-white',
      services: [
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
      ]
    },
    {
      id: 'wealth',
      title: 'Wealth Management Services',
      description: 'We help you build, grow, and protect your wealth through comprehensive portfolio solutions. From strategic asset allocation to tax optimization, we provide data-driven strategies you can trust.',
      bgImage: '/wealth-management.png',
      bgOverlay: 'bg-tertiary/85',
      buttonColor: 'bg-secondary',
      buttonTextColor: 'text-white',
      services: [
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
      ]
    }
  ];

  const handleCategoryClick = (category: ServiceCategory) => {
    if (category.id === 'wealth') {
      navigate('/wealth-management');
    } else if (category.id === 'insurance') {
      navigate('/insurance-protection');
    }
  };

  return (
    <motion.section
      id="services"
      className="py-16 bg-[#FAFAFA]"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Title */}
        <motion.div
          data-aos="fade-down"
          className="text-center mb-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
        >
          <p className="text-sm font-playfair font-semibold text-tertiary/80 uppercase tracking-[0.15em] mb-4">
            WHAT WE OFFER
          </p>
          <h2 className="font-playfair text-4xl md:text-5xl lg:text-6xl font-bold text-tertiary mb-6 leading-tight">
            Our Comprehensive Financial Services
          </h2>
          <div className="flex justify-center">
            <p className="font-crimson text-lg md:text-xl text-tertiary/80 max-w-4xl leading-relaxed text-center">
              Transparent, comprehensive financial planning with proven results
            </p>
          </div>
        </motion.div>

        {/* Service Category Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {serviceCategories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.15, ease: "easeOut" }}
              whileHover={{ scale: 1.015 }}
              className="relative rounded-3xl shadow-lg hover:shadow-2xl transition-shadow duration-300 cursor-pointer group flex flex-col min-h-[350px] overflow-hidden"
              onClick={() => handleCategoryClick(category)}
            >
              {/* Cinematic Background Image - Slow Zoom In */}
              <motion.div
                className="absolute inset-0"
                style={{
                  backgroundImage: `url('${category.bgImage}')`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
                initial={{ scale: 1.08 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.6, ease: "easeOut" }}
              />

              {/* Color Overlay - Fade In */}
              <motion.div
                className={`absolute inset-0 ${category.bgOverlay}`}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, ease: "easeOut" }}
              />

              {/* Content - Depth Animation */}
              <motion.div
                className="relative z-10 p-6 md:p-8 flex flex-col h-full"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <Building className="w-8 h-8 text-white" />
                  <span className="text-sm font-crimson text-white/90 uppercase tracking-wider">
                    {category.id === 'wealth' ? 'Wealth Management' : 'Insurance & Protection'}
                  </span>
                </div>

                <h3 className="font-playfair text-3xl md:text-4xl font-bold text-white mb-6 leading-tight">
                  {category.title}
                </h3>

                <p className="font-crimson text-base md:text-lg text-white/90 mb-8 leading-relaxed flex-grow text-justify">
                  {category.description}
                </p>

                <div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCategoryClick(category);
                    }}
                    className={`${category.buttonColor} ${category.buttonTextColor} hover:scale-105 transition-transform duration-300 px-8 py-4 rounded-full font-semibold font-crimson flex items-center gap-2`}
                  >
                    Learn more
                    <motion.span
                      className="inline-block"
                      whileHover={{ x: 4 }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                    >
                      <ArrowRight className="w-5 h-5" />
                    </motion.span>
                  </button>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Services Detail Modal */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-5xl max-h-[85vh] bg-white p-0 overflow-hidden flex flex-col top-[52%] translate-y-[-50%] z-[10000]">
            {selectedCategory && (
              <div className="flex flex-col h-full overflow-hidden">
                {/* Fixed Header */}
                <div className="px-6 pt-6 pb-4 border-b border-gray-200 flex-shrink-0">
                  <DialogHeader>
                    <DialogTitle className="text-2xl md:text-3xl font-playfair text-tertiary mb-3 pr-8">
                      {selectedCategory.title}
                    </DialogTitle>
                    <DialogDescription className="text-base md:text-lg font-crimson text-tertiary/80 leading-relaxed text-justify">
                      {selectedCategory.description}
                    </DialogDescription>
                  </DialogHeader>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto px-6 py-6">

                  {/* Sub-Services Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                    {selectedCategory.services.map((service, index) => (
                      <motion.div
                        key={service.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                        className="border border-gray-200 rounded-2xl p-6 hover:border-secondary/50 hover:shadow-lg transition-all duration-300"
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
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setIsDialogOpen(false);
                                  window.location.href = '/contact';
                                }}
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
              </div>
            )}
          </DialogContent>
        </Dialog>

      </div>
    </motion.section>
  );
};

export default ServicesSection;
