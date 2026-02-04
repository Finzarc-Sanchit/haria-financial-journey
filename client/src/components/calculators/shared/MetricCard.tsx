import { useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useMotionTemplate } from 'framer-motion';

// Counter animation hook
function useAnimatedValue(target: number, duration = 600) {
    const motionValue = useMotionValue(target);
    const spring = useSpring(motionValue, { stiffness: 80, damping: 20 });
    const display = useTransform(spring, v => Math.round(v));
    const displayString = useMotionTemplate`${display}`;

    useEffect(() => {
        motionValue.set(target);
    }, [target]);

    return display;
}

interface MetricCardProps {
    label: string;
    value: number;
    currency?: boolean;
    icon?: React.ReactNode;
    delay?: number;
}

const MetricCard: React.FC<MetricCardProps> = ({ label, value, currency, icon, delay = 0 }) => {
    const animatedValue = useAnimatedValue(value);

    // Format the value with commas for thousands separators
    const formattedValue = useTransform(animatedValue, v => v.toLocaleString('en-IN'));

    return (
        <motion.div
            className="flex flex-col items-center justify-center bg-card/60 rounded-xl p-4 shadow-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay }}
            layout
        >
            {icon && <div className="mb-1 text-xl text-secondary">{icon}</div>}
            <span className="font-playfair text-xl md:text-2xl text-foreground font-bold">
                {currency ? '₹' : ''}
                <motion.span style={{ display: 'inline-block' }}>{formattedValue}</motion.span>
            </span>
            <span className="text-sm md:text-base text-muted-foreground mt-1 font-crimson text-center">{label}</span>
        </motion.div>
    );
};

export default MetricCard;