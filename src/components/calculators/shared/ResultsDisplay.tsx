import React, { useEffect, useState } from 'react';

interface ResultsDisplayProps {
    value: number;
    label?: string;
    progress?: number; // 0-100 for bar
    chartType?: 'bar' | 'pie';
    currency?: boolean; // NEW: whether to show rupee symbol
}

function formatINR(num: number, currency: boolean = true) {
    if (currency) {
        return num.toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });
    } else {
        return num.toLocaleString('en-IN');
    }
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ value, label, progress, chartType = 'bar', currency = false }) => {
    const [displayValue, setDisplayValue] = useState(0);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        setVisible(true);
        let start = 0;
        const duration = 1200;
        const startTime = performance.now();
        function animate(now: number) {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            setDisplayValue(Math.floor(progress * value));
            if (progress < 1) requestAnimationFrame(animate);
            else setDisplayValue(value);
        }
        requestAnimationFrame(animate);
    }, [value]);

    return (
        <div className={`w-full flex flex-col items-center justify-center mb-6 transform transition-all duration-700 ${visible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            {label && <div className="font-playfair text-xl text-foreground mb-2">{label}</div>}
            <div className="font-playfair text-xl md:text-2xl text-secondary font-bold mb-2 animate-countup">
                {currency ? formatINR(displayValue, true) : displayValue.toLocaleString('en-IN')}
            </div>
            {chartType === 'bar' && typeof progress === 'number' && (
                <div className="w-full max-w-md mx-auto h-4 bg-secondary/30 rounded-full overflow-hidden mb-4">
                    <div className="h-4 bg-secondary rounded-full transition-all duration-700" style={{ width: `${progress}%` }} />
                </div>
            )}
            {chartType === 'pie' && typeof progress === 'number' && (
                <div className="w-20 h-20 mb-4">
                    {/* Pie chart placeholder */}
                    <svg viewBox="0 0 36 36" className="w-full h-full">
                        <circle cx="18" cy="18" r="16" fill="#FAFAFA" />
                        <circle
                            cx="18" cy="18" r="16"
                            fill="none"
                            stroke="#81a2b1"
                            strokeWidth="4"
                            strokeDasharray={`${progress} ${100 - progress}`}
                            strokeDashoffset="25"
                        />
                    </svg>
                </div>
            )}
        </div>
    );
};

export default ResultsDisplay; 