import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface FAQ {
    question: string;
    answer: string;
}

interface FAQSectionProps {
    faqs: FAQ[];
    delay?: number;
}

const FAQSection: React.FC<FAQSectionProps> = ({ faqs, delay = 0 }) => {
    const [openIdx, setOpenIdx] = useState<number | null>(null);

    return (
        <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-16"
                >
                    <p className="text-sm font-crimson text-tertiary/60 uppercase tracking-wider mb-4">
                        FAQ
                    </p>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-playfair font-bold text-tertiary mb-4">
                        Frequently Asked Questions
                    </h2>
                    <div className="flex justify-center">
                        <p className="text-lg md:text-xl font-crimson text-tertiary/80 max-w-3xl text-center">
                            Common questions about calculators and investment planning
                        </p>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
                    {/* Left Column - FAQs */}
                    <div className="space-y-8 md:space-y-10">
                        {faqs.map((faq, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: delay + i * 0.1 }}
                                className="space-y-3"
                            >
                                <div className="text-5xl md:text-6xl font-bold font-playfair text-tertiary/20">
                                    {String(i + 1).padStart(2, '0')}
                                </div>
                                <button
                                    className="w-full text-left flex justify-between items-start gap-4 focus:outline-none group"
                                    onClick={() => setOpenIdx(openIdx === i ? null : i)}
                                >
                                    <h3 className="text-xl md:text-2xl font-bold font-playfair text-tertiary flex-grow">
                                        {faq.question}
                                    </h3>
                                    <svg 
                                        className={`w-6 h-6 flex-shrink-0 text-secondary transition-transform duration-200 ${openIdx === i ? 'rotate-180' : ''}`} 
                                        fill="none" 
                                        stroke="currentColor" 
                                        strokeWidth="2" 
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>
                                <AnimatePresence initial={false}>
                                    {openIdx === i && (
                                        <motion.div
                                            key="content"
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="pt-2 text-base md:text-lg font-crimson text-tertiary/70 leading-relaxed">
                                                {faq.answer}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        ))}
                    </div>

                    {/* Right Column - Image */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                        className="relative h-[500px] md:h-[600px] lg:h-[700px] rounded-2xl overflow-hidden shadow-2xl sticky top-8"
                    >
                        <img 
                            src="/schedule-meeting.jpg" 
                            alt="Investment Planning"
                            className="w-full h-full object-cover"
                            loading="lazy"
                        />
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default FAQSection; 