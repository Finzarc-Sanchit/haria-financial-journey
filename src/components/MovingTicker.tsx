import { motion } from 'framer-motion';

const MovingTicker = () => {
    const tickerItems = [
        "Authorised Person of Motilal Oswal",
        "Contact us at: +91 77386 86126",
    ];

    // Create multiple duplicates for seamless continuous loop
    // Using 4 sets to ensure smooth continuous scrolling
    const duplicatedItems = [...tickerItems, ...tickerItems, ...tickerItems, ...tickerItems];

    return (
        <div className="fixed top-20 left-0 w-full bg-secondary/95 backdrop-blur-sm border-b border-secondary/20 z-[9998] overflow-hidden">
            <div className="relative h-10 flex items-center">
                <motion.div
                    className="flex items-center whitespace-nowrap"
                    animate={{
                        x: ['0%', '-25%'],
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: 'linear',
                    }}
                >
                    {duplicatedItems.map((item, index) => (
                        <span
                            key={index}
                            className="inline-flex items-center mx-8"
                        >
                            <span className="text-sm md:text-base font-crimson text-white font-semibold">
                                {item}
                            </span>
                            <span className="text-white/30 mx-4">•</span>
                        </span>
                    ))}
                </motion.div>
            </div>
        </div>
    );
};

export default MovingTicker;

