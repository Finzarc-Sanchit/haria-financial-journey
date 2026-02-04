import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import CTASection from '@/components/CTASection';

interface CalculatorPageLayoutProps {
    children: ReactNode;
}

const CalculatorPageLayout: React.FC<CalculatorPageLayoutProps> = ({ children }) => (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen bg-background"
    >
        <main className="!pt-0">{children}</main>
        <CTASection />
    </motion.div>
);

export default CalculatorPageLayout;
