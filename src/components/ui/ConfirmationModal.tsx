import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { motion } from 'framer-motion';
import rightTick from '@/assets/right-tick.png';

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    firstName?: string | null;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
    isOpen,
    onClose,
    firstName
}) => {
    const [startTick, setStartTick] = useState(false);
    const [spinTick, setSpinTick] = useState(false);
    const [showFinalTick, setShowFinalTick] = useState(false);
    const [drawDone, setDrawDone] = useState(false);

    // Reset animation state when modal opens
    useEffect(() => {
        if (isOpen) {
            resetAnimationState();
            // Start the animation sequence after a small delay
            setTimeout(() => {
                setStartTick(true);
            }, 100);
        }
    }, [isOpen]);

    // Reset animation state function
    const resetAnimationState = () => {
        setStartTick(false);
        setSpinTick(false);
        setShowFinalTick(false);
        setDrawDone(false);
    };

    if (!isOpen) return null;

    return (
        <motion.div
            key="confirmation-modal"
            initial={{ opacity: 0, scale: 0.95, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 40 }}
            transition={{ duration: 0.5, ease: [0.42, 0, 0.58, 1] }}
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ pointerEvents: 'auto' }}
        >
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" aria-hidden="true" />

            {/* Modal Content */}
            <div className="relative z-50 mx-4 w-full max-w-lg">
                <div className="bg-white/90 rounded-2xl shadow-xl p-8 flex flex-col items-center text-center border border-[#81a2b1]/30">
                    {/* Cinematic checkmark animation */}
                    <div className="relative mb-4 flex items-center justify-center" style={{ width: 56, height: 56 }}>
                        <>
                            {/* SVG checkmark: draw, then horizontal flip, then fade out */}
                            <motion.div
                                className="absolute left-0 top-0 w-14 h-14 flex items-center justify-center"
                                style={{ pointerEvents: 'none', zIndex: 3, perspective: 400 }}
                                animate={spinTick && !showFinalTick ? { rotateY: 360 } : { rotateY: 0 }}
                                transition={{ duration: 0.8, ease: 'easeInOut' }}
                                onAnimationComplete={() => {
                                    if (spinTick) {
                                        setSpinTick(false);
                                        setTimeout(() => setShowFinalTick(true), 100);
                                    }
                                }}
                            >
                                <motion.svg
                                    width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg"
                                    style={{ position: 'relative', zIndex: 2 }}
                                    initial="hidden"
                                    animate={startTick && !showFinalTick ? "visible" : "hidden"}
                                    variants={{
                                        hidden: { opacity: 0 },
                                        visible: { opacity: 1 }
                                    }}
                                >
                                    <motion.path
                                        d="M16 29L25 38L40 20"
                                        stroke="#43A047"
                                        strokeWidth="7"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        fill="none"
                                        variants={{
                                            hidden: { pathLength: 0 },
                                            visible: { pathLength: 1, transition: { duration: 0.7, ease: 'easeInOut' } }
                                        }}
                                        onAnimationComplete={() => {
                                            setDrawDone(true);
                                            setTimeout(() => {
                                                setSpinTick(true);
                                            }, 100);
                                        }}
                                    />
                                </motion.svg>
                            </motion.div>

                            {/* Fade in the static image after spin */}
                            <motion.img
                                src={rightTick}
                                alt="Success"
                                className="w-14 h-14 absolute left-0 top-0"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={showFinalTick ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.5, ease: 'easeOut' }}
                                style={{ zIndex: 4 }}
                            />
                        </>
                    </div>

                    <h2 className="font-playfair text-2xl md:text-3xl font-bold text-charcoal mb-2">
                        🎉 Thank You, {firstName || 'Friend'}!
                    </h2>
                    <p className="font-crimson text-xl text-charcoal/90 mb-2">
                        Your request has been received. We'll be in touch soon.
                    </p>
                    <p className="font-crimson text-lg text-charcoal/70 mb-4">
                        We're excited to help you on your financial journey. Keep an eye on your inbox!
                    </p>

                    <Button
                        asChild
                        className="mt-2 px-6 py-2 rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/90 font-crimson font-semibold shadow-[#81a2b1]/20 transition-all w-full text-xl focus:outline-none focus:ring-2 focus:ring-secondary/60 focus:ring-offset-2"
                    >
                        <button
                            onClick={() => {
                                onClose();
                                setTimeout(() => {
                                    resetAnimationState(); // Reset for next time
                                }, 400);
                            }}
                            style={{ width: '100%' }}
                            type="button"
                        >
                            Back to Home
                        </button>
                    </Button>
                </div>
            </div>
        </motion.div>
    );
};

export default ConfirmationModal;
