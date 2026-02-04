import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { FaRegBuilding } from 'react-icons/fa';

interface CalculatorFormCardProps {
    children: ReactNode;
    icon?: ReactNode;
    title?: string;
    subtitle?: string;
    delay?: number;
}

const CalculatorFormCard: React.FC<CalculatorFormCardProps> = ({ children, icon, title, subtitle, delay = 0 }) => {
    const displayIcon = icon ?? <FaRegBuilding />;
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay }}
            className="w-full max-w-xl mx-auto h-full bg-card/80 backdrop-blur-lg shadow-card rounded-2xl border border-[#81a2b1]/30 overflow-hidden"
        >
            {/* Header section with gradient background */}
            {(title || subtitle) && (
                <div className="pb-4 bg-gradient-to-r from-background to-[#81a2b1]/20 px-8 pt-6">
                    <div className="flex items-center gap-3">
                        <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#81a2b1]/50">
                            <span className="text-2xl text-secondary">{displayIcon}</span>
                        </span>
                        <div>
                            {title && <h2 className="font-playfair text-2xl font-bold bg-gradient-to-r from-secondary to-tertiary bg-clip-text text-transparent">{title}</h2>}
                            {subtitle && <p className="font-crimson text-base text-tertiary">{subtitle}</p>}
                        </div>
                    </div>
                </div>
            )}
            <div className="p-8">
                {children}
            </div>
        </motion.div>
    );
};

export default CalculatorFormCard; 