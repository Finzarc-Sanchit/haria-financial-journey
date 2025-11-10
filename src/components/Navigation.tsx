import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Menu, X, ChevronDown, Shield, BarChart3, PiggyBank, Zap, Calculator, Plus, Minus, ArrowRight, ClipboardCheck } from "lucide-react";
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '@/assets/logo.png';

interface NavigationProps {
  isTransparent?: boolean;
}

const Navigation: React.FC<NavigationProps> = ({ isTransparent = false }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isInsuranceDropdownOpen, setIsInsuranceDropdownOpen] = useState(false);
  const [isInvestmentDropdownOpen, setIsInvestmentDropdownOpen] = useState(false);
  const [isCalcDropdownOpen, setIsCalcDropdownOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const navigate = useNavigate();
  const location = useLocation();

  // Simple scroll detection
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 50;
      setIsScrolled(scrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Disable body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const handleScheduleConsultation = () => {
    setIsMobileMenuOpen(false);
    navigate('/contact');
  };

  const handleNavigationClick = (to: string) => {
    setIsMobileMenuOpen(false);
    setIsInsuranceDropdownOpen(false);
    setIsInvestmentDropdownOpen(false);
    setIsCalcDropdownOpen(false);
    setOpenDropdown(null);
    navigate(to);
  };

  const handleLogoClick = () => {
    setIsMobileMenuOpen(false);
    setIsInsuranceDropdownOpen(false);
    setIsInvestmentDropdownOpen(false);
    setIsCalcDropdownOpen(false);
    setOpenDropdown(null);
    
    if (location.pathname === '/') {
      // Already on landing page, scroll to hero
      const heroElement = document.getElementById('hero');
      if (heroElement) {
        heroElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else {
      // Navigate to landing page
      navigate('/');
      // Scroll to hero after navigation
      setTimeout(() => {
        const heroElement = document.getElementById('hero');
        if (heroElement) {
          heroElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }, 100);
    }
  };

  const insuranceLinks = [
    { label: 'Life Insurance', to: '/life-insurance' },
    { label: 'General Insurance', to: '/general-insurance' },
  ];

  const investmentLinks = [
    { label: 'Mutual Funds', to: '/mutual-funds' },
    { label: 'Equity Investment', to: '/equity-investment' },
  ];

  const calculatorLinks = [
    { label: 'SIP Calculator', to: '/sip-calculator' },
    { label: 'SWP Calculator', to: '/swp-calculator' },
    { label: 'Lumpsum Calculator', to: '/lumpsum-calculator' },
    { label: 'CAGR Calculator', to: '/cagr-calculator' },
  ];

  const commodityLinks = [
    { label: 'Commodity Trading', to: '/commodity-trading' },
    { label: 'Gold & Silver', to: '/gold-silver' },
    { label: 'Other Derivatives', to: '/other-derivatives' },
  ];

  return (
    <>
      <header 
        className={`fixed top-0 left-0 w-full z-[9999] transition-all duration-300 ${
          isScrolled 
            ? 'bg-white/95 backdrop-blur-xl shadow-lg border-b border-white/20' 
            : 'bg-gradient-to-b from-white/95 via-white/90 to-white/85 backdrop-blur-lg shadow-md'
        }`}
        style={{
          background: isScrolled 
            ? 'linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(255,255,255,0.95) 100%)' 
            : 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.90) 50%, rgba(255,255,255,0.85) 100%)',
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          borderBottom: isScrolled ? '1px solid rgba(255,255,255,0.3)' : '1px solid rgba(255,255,255,0.2)'
        }}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <button 
              onClick={handleLogoClick}
              className="flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer"
            >
              <img src={logo} alt="Haria Investments Logo" className="w-12 h-12 object-contain" />
              <div>
                <div className="font-playfair font-bold text-2xl text-tertiary" style={{ 
                  textShadow: '0 1px 3px rgba(255,255,255,0.9), 0 0 10px rgba(255,255,255,0.4)' 
                }}>
                  Haria Investments
                </div>
                <div className="text-sm font-semibold font-crimson text-tertiary/80" style={{ 
                  textShadow: '0 1px 2px rgba(255,255,255,0.8)' 
                }}>
                  since 1957
                </div>
              </div>
            </button>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-4">
              {/* Insurance Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setIsInsuranceDropdownOpen(true)}
                onMouseLeave={() => setIsInsuranceDropdownOpen(false)}
              >
                <button 
                  onClick={() => handleNavigationClick('/life-insurance')}
                  className="text-tertiary hover:text-secondary transition-colors font-crimson font-semibold text-sm flex items-center gap-1" 
                  style={{ textShadow: '0 1px 2px rgba(255,255,255,0.8), 0 0 6px rgba(255,255,255,0.3)' }}
                >
                  Insurance
                  <ChevronDown className={`w-3 h-3 transition-transform ${isInsuranceDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {isInsuranceDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute left-1/2 -translate-x-1/2 mt-2 w-56 bg-white shadow-xl rounded-lg p-3 border border-gray-100"
                    >
                      {insuranceLinks.map(link => (
                        <Link
                          key={link.to}
                          to={link.to}
                          onClick={() => handleNavigationClick(link.to)}
                          className="block px-4 py-2.5 rounded-lg text-tertiary hover:bg-secondary/5 hover:text-secondary transition-colors font-crimson"
                        >
                          {link.label}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Investment Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setIsInvestmentDropdownOpen(true)}
                onMouseLeave={() => setIsInvestmentDropdownOpen(false)}
              >
                <button 
                  onClick={() => handleNavigationClick('/mutual-funds')}
                  className="text-tertiary hover:text-secondary transition-colors font-crimson font-semibold text-sm flex items-center gap-1" 
                  style={{ textShadow: '0 1px 2px rgba(255,255,255,0.8), 0 0 6px rgba(255,255,255,0.3)' }}
                >
                  Investment
                  <ChevronDown className={`w-3 h-3 transition-transform ${isInvestmentDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {isInvestmentDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute left-1/2 -translate-x-1/2 mt-2 w-56 bg-white shadow-xl rounded-lg p-3 border border-gray-100"
                    >
                      {investmentLinks.map(link => (
                        <Link
                          key={link.to}
                          to={link.to}
                          onClick={() => handleNavigationClick(link.to)}
                          className="block px-4 py-2.5 rounded-lg text-tertiary hover:bg-secondary/5 hover:text-secondary transition-colors font-crimson"
                        >
                          {link.label}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Fixed Income - Single Page */}
              <Link
                to="/fixed-income"
                onClick={() => handleNavigationClick('/fixed-income')}
                className="text-tertiary hover:text-secondary transition-colors font-crimson font-semibold text-sm"
                style={{ textShadow: '0 1px 2px rgba(255,255,255,0.8), 0 0 6px rgba(255,255,255,0.3)' }}
              >
                Fixed Income
              </Link>

              {/* Commodities Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setOpenDropdown('commodities')}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <button 
                  onClick={() => handleNavigationClick('/commodity-trading')}
                  className="text-tertiary hover:text-secondary transition-colors font-crimson font-semibold text-sm flex items-center gap-1" 
                  style={{ textShadow: '0 1px 2px rgba(255,255,255,0.8), 0 0 6px rgba(255,255,255,0.3)' }}
                >
                  Commodities
                  <ChevronDown className={`w-3 h-3 transition-transform ${openDropdown === 'commodities' ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {openDropdown === 'commodities' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute left-1/2 -translate-x-1/2 mt-2 w-56 bg-white shadow-xl rounded-lg p-3 border border-gray-100"
                    >
                      {commodityLinks.map(link => (
                        <Link
                          key={link.to}
                          to={link.to}
                          onClick={() => handleNavigationClick(link.to)}
                          className="block px-4 py-2.5 rounded-lg text-tertiary hover:bg-secondary/5 hover:text-secondary transition-colors font-crimson"
                        >
                          {link.label}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Calculator Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setIsCalcDropdownOpen(true)}
                onMouseLeave={() => setIsCalcDropdownOpen(false)}
              >
                <button 
                  onClick={() => handleNavigationClick('/sip-calculator')}
                  className="text-tertiary hover:text-secondary transition-colors font-crimson font-semibold text-sm flex items-center gap-1" 
                  style={{ textShadow: '0 1px 2px rgba(255,255,255,0.8), 0 0 6px rgba(255,255,255,0.3)' }}
                >
                  Calculator
                  <ChevronDown className={`w-3 h-3 transition-transform ${isCalcDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {isCalcDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute left-1/2 -translate-x-1/2 mt-2 w-56 bg-white shadow-xl rounded-lg p-3 border border-gray-100"
                    >
                      {calculatorLinks.map(link => (
                        <Link
                          key={link.to}
                          to={link.to}
                          onClick={() => handleNavigationClick(link.to)}
                          className="block px-4 py-2.5 rounded-lg text-tertiary hover:bg-secondary/5 hover:text-secondary transition-colors font-crimson"
                        >
                          {link.label}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Financial Health Form Link */}
              <Link
                to="/financial-health-form"
                onClick={() => handleNavigationClick('/financial-health-form')}
                className="text-tertiary hover:text-secondary transition-colors font-crimson font-semibold text-sm"
                style={{ textShadow: '0 1px 2px rgba(255,255,255,0.8), 0 0 6px rgba(255,255,255,0.3)' }}
              >
                Financial Health Form
              </Link>
            </div>

            {/* CTA Button */}
            <div className="hidden lg:flex ml-6">
              <button 
                onClick={handleScheduleConsultation}
                className="bg-secondary hover:bg-secondary/90 text-white px-8 py-3 rounded-full font-semibold font-crimson transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
              >
                <span>Schedule Consultation</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-tertiary hover:text-secondary transition-colors p-2"
                aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="lg:hidden py-4"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.85)',
                  backdropFilter: 'blur(20px) saturate(180%)',
                  WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                  borderTop: '1px solid rgba(0,0,0,0.1)'
                }}
              >
                <div className="space-y-4">
                  {/* Mobile Insurance */}
                  <div>
                    <button
                      onClick={() => setOpenDropdown(openDropdown === 'insurance' ? null : 'insurance')}
                      className="flex items-center justify-between w-full text-tertiary font-crimson font-semibold text-lg py-2"
                    >
                      <span className="flex items-center">
                        <Shield className="w-5 h-5 mr-3" />
                        Insurance
                      </span>
                      {openDropdown === 'insurance' ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                    </button>
                    {openDropdown === 'insurance' && (
                      <div className="mt-2 pl-8 space-y-1">
                        {insuranceLinks.map(link => (
                          <Link
                            key={link.to}
                            to={link.to}
                            className="block py-2 text-tertiary font-crimson hover:text-secondary transition-colors"
                            onClick={() => handleNavigationClick(link.to)}
                          >
                            {link.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Mobile Investment */}
                  <div>
                    <button
                      onClick={() => setOpenDropdown(openDropdown === 'investment' ? null : 'investment')}
                      className="flex items-center justify-between w-full text-tertiary font-crimson font-semibold text-lg py-2"
                    >
                      <span className="flex items-center">
                        <BarChart3 className="w-5 h-5 mr-3" />
                        Investment
                      </span>
                      {openDropdown === 'investment' ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                    </button>
                    {openDropdown === 'investment' && (
                      <div className="mt-2 pl-8 space-y-1">
                        {investmentLinks.map(link => (
                          <Link
                            key={link.to}
                            to={link.to}
                            className="block py-2 text-tertiary font-crimson hover:text-secondary transition-colors"
                            onClick={() => handleNavigationClick(link.to)}
                          >
                            {link.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Mobile Fixed Income - Direct Link */}
                  <Link
                    to="/fixed-income"
                    className="flex items-center text-tertiary font-crimson font-semibold text-lg py-2 hover:text-secondary transition-colors"
                    onClick={() => handleNavigationClick('/fixed-income')}
                  >
                    <PiggyBank className="w-5 h-5 mr-3" />
                    Fixed Income
                  </Link>

                  {/* Mobile Commodities */}
                  <div>
                    <button
                      onClick={() => setOpenDropdown(openDropdown === 'commodities' ? null : 'commodities')}
                      className="flex items-center justify-between w-full text-tertiary font-crimson font-semibold text-lg py-2"
                    >
                      <span className="flex items-center">
                        <Zap className="w-5 h-5 mr-3" />
                        Commodities
                      </span>
                      {openDropdown === 'commodities' ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                    </button>
                    {openDropdown === 'commodities' && (
                      <div className="mt-2 pl-8 space-y-1">
                        {commodityLinks.map(link => (
                          <Link
                            key={link.to}
                            to={link.to}
                            className="block py-2 text-tertiary font-crimson hover:text-secondary transition-colors"
                            onClick={() => handleNavigationClick(link.to)}
                          >
                            {link.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Mobile Calculator */}
                  <div>
                    <button
                      onClick={() => setOpenDropdown(openDropdown === 'calculator' ? null : 'calculator')}
                      className="flex items-center justify-between w-full text-tertiary font-crimson font-semibold text-lg py-2"
                    >
                      <span className="flex items-center">
                        <Calculator className="w-5 h-5 mr-3" />
                        Calculator
                      </span>
                      {openDropdown === 'calculator' ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                    </button>
                    {openDropdown === 'calculator' && (
                      <div className="mt-2 pl-8 space-y-1">
                        {calculatorLinks.map(link => (
                          <Link
                            key={link.to}
                            to={link.to}
                            className="block py-2 text-tertiary font-crimson hover:text-secondary transition-colors"
                            onClick={() => handleNavigationClick(link.to)}
                          >
                            {link.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Mobile Financial Health Link */}
                  <Link
                    to="/financial-health-form"
                    className="flex items-center text-tertiary font-crimson font-semibold text-lg py-2 hover:text-secondary transition-colors"
                    onClick={() => handleNavigationClick('/financial-health-form')}
                  >
                    <ClipboardCheck className="w-5 h-5 mr-3" />
                    Financial Health Form
                  </Link>

                  <div className="pt-4">
                    <button 
                      onClick={handleScheduleConsultation}
                      className="w-full bg-secondary hover:bg-secondary/90 text-white px-8 py-4 rounded-full font-semibold font-crimson transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                    >
                      <span>Schedule Consultation</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>
      </header>
    </>
  );
};

export default Navigation;
