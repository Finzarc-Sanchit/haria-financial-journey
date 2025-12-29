import React from 'react';
import { motion } from 'framer-motion';
import OrbitingAMCs from '@/components/ui/orbiting-amcs';

const AMCShowcase: React.FC = () => {
    return (
        <section className="w-full pt-4 pb-16 bg-[#FAFAFA]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
                    {/* Orbiting AMCs Component */}
                    <motion.div
                        className="order-2 lg:order-1 flex justify-center"
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: '-20%' }}
                        transition={{ duration: 0.6 }}
                    >
                        <OrbitingAMCs />
                    </motion.div>

                    {/* Text side */}
                    <motion.div
                        className="order-1 lg:order-2 space-y-6"
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: '-20%' }}
                        transition={{ duration: 0.6 }}
                    >
                        <p className="text-sm font-playfair font-semibold text-tertiary/80 uppercase tracking-[0.15em]">
                            TRUSTED PARTNERS
                        </p>
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-tertiary font-playfair leading-tight">
                            Invest with 45+ Trusted AMCs
                        </h2>
                        <p className="text-lg md:text-xl text-tertiary/80 font-crimson max-w-prose leading-relaxed text-justify">
                            Access a curated universe of mutual funds and portfolios from India's leading Asset Management Companies, all in one place.
                        </p>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default AMCShowcase;


