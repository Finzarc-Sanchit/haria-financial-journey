import React, { useEffect, useState } from 'react';

interface TrustBadgeProps {
    heritage?: string;
    certifications?: string[];
    sebi?: string;
    testimonials?: string | number;
    className?: string;
}

const TrustBadge: React.FC<TrustBadgeProps> = ({
    heritage = 'Since 1957',
    certifications = ['CFA', 'CFP'],
    sebi = 'SEBI Registered',
    testimonials = 'Satisfied Clients Since 1957',
    className = '',
}) => {
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        setTimeout(() => setVisible(true), 100);
    }, []);
    return (
        <div className={`flex flex-wrap items-center justify-center gap-3 py-2 px-4 rounded-xl bg-card shadow-card transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'} ${className}`}>
            <span className="font-playfair text-sm md:text-base text-secondary-foreground bg-secondary/80 rounded-full px-3 py-1 shadow">{heritage}</span>
            {certifications.map(cert => (
                <span key={cert} className="font-crimson text-sm md:text-base bg-[#81a2b1]/80 text-foreground rounded-full px-3 py-1 shadow animate-fade-in">{cert}</span>
            ))}
            <span className="font-crimson text-sm md:text-base bg-secondary/20 text-secondary rounded-full px-3 py-1 shadow animate-fade-in">{sebi}</span>
            <span className="font-crimson text-sm md:text-base bg-secondary/60 text-secondary-foreground rounded-full px-3 py-1 shadow animate-fade-in">{testimonials}</span>
        </div>
    );
};

export default TrustBadge; 