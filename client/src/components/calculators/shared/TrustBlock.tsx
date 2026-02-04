import React, { useEffect, useState } from 'react';

interface TrustBlockProps {
    certifications?: string[];
    testimonials?: string[];
    compliance?: string;
    story?: string;
}

const defaultTestimonials = [
    '“Professional, transparent, and always available.”',
    '“Helped me achieve my financial goals with confidence.”',
    '“Trusted by my family for generations.”',
];

const TrustBlock: React.FC<TrustBlockProps> = ({
    certifications = ['SEBI Registered', 'CFA', 'CFP'],
    testimonials = defaultTestimonials,
    compliance = 'SEBI Reg. No. INZ000000000 | Investments are subject to market risks. Read all scheme related documents carefully.',
    story = 'How we helped clients achieve their financial dreams through personalized, compliant, and ethical advice.',
}) => {
    const [testimonialIdx, setTestimonialIdx] = useState(0);
    useEffect(() => {
        const interval = setInterval(() => {
            setTestimonialIdx(idx => (idx + 1) % testimonials.length);
        }, 4000);
        return () => clearInterval(interval);
    }, [testimonials.length]);

    return (
        <section className="w-full max-w-2xl mx-auto bg-card rounded-xl shadow-card p-6 md:p-10 mt-8 flex flex-col items-center animate-fade-in">
            <span className="inline-block bg-secondary text-secondary-foreground rounded-full px-4 py-1 text-sm md:text-base font-semibold shadow font-crimson mb-3">
                Since 1957
            </span>
            <div className="flex flex-wrap gap-2 justify-center mb-4">
                {certifications.map(cert => (
                    <span key={cert} className="font-crimson text-sm md:text-base bg-[#81a2b1]/80 text-foreground rounded-full px-3 py-1 shadow animate-fade-in">
                        {cert}
                    </span>
                ))}
            </div>
            <div className="w-full text-center mb-4 min-h-[2.5em]">
                <span className="font-playfair text-base md:text-lg text-foreground transition-opacity duration-700 block" style={{ opacity: 1 }}>
                    {testimonials[testimonialIdx]}
                </span>
            </div>
            <div className="w-full text-sm text-muted-foreground text-center mb-4 font-crimson">
                {compliance}
            </div>
            <div className="w-full bg-background rounded-lg p-4 shadow-card text-center font-crimson text-sm md:text-base animate-float-up">
                <strong className="font-playfair block mb-1 text-foreground">Our Story</strong>
                {story}
            </div>
        </section>
    );
};

export default TrustBlock; 