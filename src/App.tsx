import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import SIPCalculator from "./pages/SIPCalculator";
import SWPCalculator from "./pages/SWPCalculator";
import LifeInsurance from "./pages/LifeInsurance";
import GeneralInsurance from "./pages/GeneralInsurance";
import MutualFunds from "./pages/MutualFunds";
import EquityInvestment from "./pages/EquityInvestment";
import FixedIncome from "./pages/FixedIncome";
import CommodityTrading from "./pages/CommodityTrading";
import GoldSilver from "./pages/GoldSilver";
import OtherDerivatives from "./pages/OtherDerivatives";
import LumpsumCalculator from "./pages/LumpsumCalculator";
import CAGRCalculator from "./pages/CAGRCalculator";
import Navigation from "@/components/Navigation";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import AnalyticsProvider from "./components/AnalyticsProvider";
import CookieConsent from "./components/CookieConsent";
import { useAnalyticsContext } from "./components/AnalyticsProvider";
import Contact from "./pages/Contact";
import FinancialHealthForm from "./pages/FinancialHealthForm";
import WealthManagement from "./pages/WealthManagement";
import InsuranceProtection from "./pages/InsuranceProtection";
import WhatsAppButton from "./components/WhatsAppButton";

// ErrorBoundary component
class ErrorBoundary extends React.Component<{ children: React.ReactNode; }, { hasError: boolean; }> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(error: any, info: any) { console.error(error, info); }
  render() {
    if (this.state.hasError) {
      return <div className="w-full text-center py-16 text-lg font-playfair text-red-600">Something went wrong. Please refresh the page.</div>;
    }
    return this.props.children;
  }
}

// Analytics integration placeholder
if (typeof window !== 'undefined') {
  // Analytics is now handled by our custom analytics system
  // No need for external analytics services
}

const queryClient = new QueryClient();

const AppContent = () => {
  const location = useLocation();
  const isAdminPage = location.pathname === '/login' || location.pathname === '/dashboard';
  const { enableAnalytics, disableAnalytics } = useAnalyticsContext();

  return (
    <>
      <ScrollToTop />
      {!isAdminPage && <Navigation />}
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/sip-calculator" element={<SIPCalculator />} />
        <Route path="/swp-calculator" element={<SWPCalculator />} />
        <Route path="/life-insurance" element={<LifeInsurance />} />
        <Route path="/general-insurance" element={<GeneralInsurance />} />
        <Route path="/mutual-funds" element={<MutualFunds />} />
        <Route path="/equity-investment" element={<EquityInvestment />} />
        <Route path="/fixed-income" element={<FixedIncome />} />
        <Route path="/commodity-trading" element={<CommodityTrading />} />
        <Route path="/gold-silver" element={<GoldSilver />} />
        <Route path="/other-derivatives" element={<OtherDerivatives />} />
        <Route path="/lumpsum-calculator" element={<LumpsumCalculator />} />
        <Route path="/cagr-calculator" element={<CAGRCalculator />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/financial-health-form" element={<FinancialHealthForm />} />
        <Route path="/wealth-management" element={<WealthManagement />} />
        <Route path="/insurance-protection" element={<InsuranceProtection />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="*" element={<NotFound />} />
      </Routes>
      {!isAdminPage && <Footer />}

      {/* WhatsApp Floating Button */}
      {!isAdminPage && <WhatsAppButton />}

      {/* Cookie Consent Banner */}
      <CookieConsent
        onAccept={enableAnalytics}
        onDecline={disableAnalytics}
      />
    </>
  );
};

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AnalyticsProvider>
            <AppContent />
          </AnalyticsProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
