import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface ChartWrapperProps {
    children: ReactNode;
    delay?: number;
    className?: string;
}

const ChartWrapper: React.FC<ChartWrapperProps> = ({ children, delay = 0, className = '' }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay }}
        className={`w-full flex flex-col items-center justify-center ${className}`}
    >
        {children}
    </motion.div>
);

export default ChartWrapper; 