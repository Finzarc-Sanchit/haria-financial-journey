import React, { useEffect, useState } from 'react';

interface CalculatorHeaderProps {
    icon?: React.ReactNode;
    title: string;
    subtitle: string;
}

const CalculatorHeader: React.FC<CalculatorHeaderProps> = ({ icon, title, subtitle }) => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setVisible(true), 100);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div
            className={`w-full flex flex-col items-center justify-center mb-6 transition-opacity duration-700 ${visible ? 'opacity-100' : 'opacity-0'}`}
        >
            {icon && <div className="mb-3 text-4xl md:text-5xl">{icon}</div>}
            <h1 className="font-playfair text-2xl md:text-3xl font-bold bg-gradient-to-r from-secondary to-tertiary bg-clip-text text-transparent text-center mb-1">
                {title}
            </h1>
            <div className="font-crimson text-base md:text-lg text-muted-foreground text-center mb-3">
                {subtitle}
            </div>
            <span className="inline-block bg-secondary text-secondary-foreground rounded-full px-4 py-1 text-sm md:text-base font-semibold shadow font-crimson mb-2">
                Since 1957
            </span>
        </div>
    );
};

export default CalculatorHeader; 