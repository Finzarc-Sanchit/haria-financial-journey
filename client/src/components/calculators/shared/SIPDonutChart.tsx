import { PieChart } from 'react-minimal-pie-chart';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const COLORS = {
    invested: '#F1E7DA',
    returns: '#D7B56D',
};

function formatINR(num: number) {
    return num.toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });
}

// Custom hook to animate a value smoothly
function useAnimatedValue(target: number, duration = 600) {
    const [value, setValue] = useState(target);
    const raf = useRef<number | null>(null);
    const prev = useRef(target);

    useEffect(() => {
        if (prev.current === target) return;
        const start = prev.current;
        const change = target - start;
        const startTime = performance.now();
        function animate(now: number) {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            setValue(start + change * progress);
            if (progress < 1) {
                raf.current = requestAnimationFrame(animate);
            } else {
                setValue(target);
                prev.current = target;
            }
        }
        raf.current && cancelAnimationFrame(raf.current);
        raf.current = requestAnimationFrame(animate);
        return () => raf.current && cancelAnimationFrame(raf.current);
    }, [target, duration]);
    return value;
}

export default function SIPDonutChart({ invested, returns }: { invested: number; returns: number; }) {
    // Animate both values
    const animatedInvested = useAnimatedValue(invested);
    const animatedReturns = useAnimatedValue(returns);

    // Calculate animated percentages for arc
    const corpus = animatedInvested + animatedReturns;
    const investedPct = corpus > 0 ? Math.max(0, Math.min(100, (animatedInvested / corpus) * 100)) : 0;
    const returnsPct = corpus > 0 ? Math.max(0, Math.min(100, (animatedReturns / corpus) * 100)) : 0;

    // Calculate the actual, correct center value (final results)
    const actualCorpus = invested + returns;
    const actualReturnsPct = actualCorpus > 0 ? (returns / actualCorpus) * 100 : 0;
    // Animate the center value from previous to new correct value
    const animatedCenter = useAnimatedValue(actualReturnsPct);

    // Tooltip state
    const [hovered, setHovered] = useState<number | null>(null);

    const data = [
        {
            title: 'Invested',
            value: investedPct,
            color: COLORS.invested,
            raw: animatedInvested,
        },
        {
            title: 'Returns',
            value: returnsPct,
            color: COLORS.returns,
            raw: animatedReturns,
        },
    ];

    return (
        <div className="w-full flex flex-col items-center">
            <motion.div
                whileHover={{ scale: 1.05 }}
                className="relative"
                style={{ width: 220, height: 220 }}
            >
                <PieChart
                    data={data}
                    lineWidth={35}
                    rounded
                    animate={false}
                    label={() => ''}
                    labelStyle={{
                        fontSize: '1.1em',
                        fontFamily: 'Playfair Display, serif',
                        fill: '#8B7355',
                        fontWeight: 600,
                    }}
                    labelPosition={70}
                    segmentsStyle={(dataIndex) => ({
                        cursor: 'pointer',
                        filter: hovered === dataIndex ? 'brightness(0.95) drop-shadow(0 2px 8px #D7B56D44)' : undefined,
                        transition: 'filter 0.2s',
                    })}
                    onMouseOver={(_, idx) => setHovered(idx)}
                    onMouseOut={() => setHovered(null)}
                    style={{ width: '100%', height: '100%' }}
                />
                {/* Center label with smooth animation */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <AnimatePresence mode="wait" initial={false}>
                        <motion.div
                            key={Math.round(actualReturnsPct)}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.4 }}
                            className="font-playfair text-2xl font-bold text-secondary"
                        >
                            {isNaN(animatedCenter) || !isFinite(animatedCenter) ? 0 : Math.round(animatedCenter)}%
                        </motion.div>
                    </AnimatePresence>
                    <div className="font-crimson text-base text-tertiary">Returns</div>
                </div>
                {/* Tooltip */}
                {hovered !== null && (
                    <div
                        className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-full bg-card/95 border border-[#81a2b1] rounded-lg px-4 py-2 shadow-card text-base font-crimson"
                        style={{ zIndex: 10 }}
                    >
                        <span className="font-bold">{data[hovered].title}:</span>{' '}
                        {formatINR(data[hovered].raw)}
                    </div>
                )}
            </motion.div>
            {/* Legend */}
            <div className="flex gap-6 mt-4 flex-wrap justify-center">
                {data.map((d, idx) => (
                    <div key={d.title} className="flex items-center gap-2">
                        <span
                            className="inline-block w-3 h-3 rounded-full"
                            style={{ background: d.color }}
                        />
                        <span className="font-crimson text-base text-tertiary">
                            {d.title} ({Math.round(d.value * 10) / 10}%)
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}