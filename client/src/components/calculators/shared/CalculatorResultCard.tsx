import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { FaChartBar } from 'react-icons/fa';
import MetricCard from './MetricCard';

interface Metric {
    label: string;
    value: number;
    currency?: boolean;
    icon?: ReactNode;
}

interface Explanation {
    label: string;
    value?: ReactNode;
    description: string;
}

interface CalculatorResultCardProps {
    metrics: Metric[];
    chart?: ReactNode;
    title?: string;
    subtitle?: string;
    explanations?: Explanation[];
    delay?: number;
}

const CalculatorResultCard: React.FC<CalculatorResultCardProps> = ({ metrics, chart, title, subtitle, explanations, delay = 0 }) => (
    <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay }}
        className="w-full max-w-xl mx-auto h-full bg-gradient-to-br from-card/90 to-muted/80 backdrop-blur-lg rounded-2xl shadow-card border border-[#81a2b1]/30 overflow-hidden"
    >
        {/* Header section with gradient background */}
        {(title || subtitle) && (
            <div className="pb-4 bg-gradient-to-r from-background to-[#81a2b1]/20 px-8 pt-6">
                <div className="flex items-center gap-3">
                    <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#81a2b1]/50">
                        <span className="text-2xl text-secondary"><FaChartBar /></span>
                    </span>
                    <div>
                        {title && <h2 className="font-playfair text-2xl font-bold bg-gradient-to-r from-secondary to-tertiary bg-clip-text text-transparent">{title}</h2>}
                        {subtitle && <p className="font-crimson text-base text-tertiary">{subtitle}</p>}
                    </div>
                </div>
            </div>
        )}
        <div className="p-8 space-y-6">
            <motion.div
                className="grid grid-cols-2 gap-4"
                initial="hidden"
                animate="visible"
                variants={{
                    hidden: {},
                    visible: {
                        transition: { staggerChildren: 0.12 }
                    }
                }}
            >
                {metrics.map((metric, i) => (
                    <MetricCard key={metric.label} {...metric} delay={i * 0.12} />
                ))}
            </motion.div>
            {chart && <div className="w-full flex flex-col items-center mt-8">{chart}</div>}
            {/* Dynamic Explanations Section */}
            {explanations && explanations.length > 0 && (
                <div className="mt-6 bg-[#81a2b1]/20 rounded-xl p-4 shadow-card text-left max-w-md w-full mx-auto">
                    {explanations.map((exp, idx) => (
                        <div className="mb-2" key={exp.label}>
                            <span className="font-bold text-tertiary">{exp.label}:</span>
                            {exp.value !== undefined && <span className="ml-2 text-tertiary font-mono">{exp.value}</span>}
                            <span className="ml-2 text-muted-foreground text-base">{exp.description}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    </motion.div>
);

export default CalculatorResultCard; 