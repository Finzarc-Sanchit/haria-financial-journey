import {
    IconShieldCheck,
    IconAward,
    IconScale,
    IconBook,
    IconLock,
    IconUsers,
} from "@tabler/icons-react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const CoreValues = () => {
    const values = [
        {
            title: "Objectivity",
            description:
                "We act solely in the best interest of each client, based on sound analysis and without bias, ensuring their satisfaction.",
            icon: <IconShieldCheck size={48} />,
        },
        {
            title: "Integrity",
            description:
                "We hold ourselves to the highest ethical standards in our dealings with clients, prospects and community members.",
            icon: <IconAward size={48} />,
        },
        {
            title: "Fairness",
            description:
                "We treat all clients fairly and with respect. We believe in equal service and treating clients with dignity and empathy.",
            icon: <IconScale size={48} />,
        },
        {
            title: "Competence",
            description:
                "We continuously improve our professional knowledge and skills.",
            icon: <IconBook size={48} />,
        },
        {
            title: "Confidentiality",
            description:
                "We do not disclose any confidential client information without consent.",
            icon: <IconLock size={48} />,
        },
        {
            title: "Professionalism",
            description:
                "We adhere to the highest professional standards in all our work.",
            icon: <IconUsers size={48} />,
        },
    ];

    // Scroll-linked state for desktop experience
    const desktopSectionRef = useRef<HTMLDivElement | null>(null);
    const [activeIndex, setActiveIndex] = useState(0);

    const { scrollYProgress } = useScroll({
        target: desktopSectionRef,
        // 0 when the top of the desktop block hits the top of the viewport,
        // 1 only when the bottom of the block reaches the bottom of the viewport.
        // This keeps the section effectively "stuck" until the internal progress is complete.
        offset: ["start start", "end end"],
    });

    // Progress value for the bottom line:
    // - There are 6 values, so we divide the bar into 6 equal parts.
    // - When we first enter the section, the bar is already at 1/6 (the first value is fully "earned").
    // - As we scroll while the containers are stuck, it smoothly grows toward 100%.
    const barProgress = useTransform(scrollYProgress, (v) => {
        const min = 1 / 6; // ≈16.7% filled on entry for the 1st value
        const max = 1;
        return min + (max - min) * v;
    });

    // Scroll-based zoom for the right card, tightly mapped to the same scroll that drives the bar:
    // For each value's segment of scroll:
    // - When that value just becomes active, scale is 1 (same as left container)
    // - As the per-value progress goes from 0 → 1,
    //   the card slowly and smoothly zooms OUT to ~0.75 just before switching to the next value.
    const cardScale = useTransform(scrollYProgress, (v) => {
        const total = values.length || 1;
        // 0..1 within the current value's 1/total scroll segment
        const rawSegmentProgress = (v * total) % 1;
        const segmentProgress = Math.min(1, Math.max(0, rawSegmentProgress));

        const maxShrink = 0.25; // 25% zoom out
        // Extra-smooth ease: very slow at start, faster near the end of the segment
        const eased = Math.pow(segmentProgress, 3); // cubic ease-in

        return 1 - eased * maxShrink;
    });

    useEffect(() => {
        const unsubscribe = scrollYProgress.on("change", (value) => {
            // Only drive scroll-based behavior on desktop
            if (typeof window === "undefined" || window.innerWidth < 1024) return;

            // Keep first value while the section is still sliding into place.
            const startThreshold = 0.1; // ~first 10% of scroll: value stays at index 0
            const total = values.length || 1;

            const clamped =
                value <= startThreshold
                    ? 0
                    : Math.min(1, (value - startThreshold) / (1 - startThreshold));

            // Map clamped 0..1 across N equal segments.
            // Each time you naturally scroll past a segment boundary,
            // the index steps to the next value – like normal scrolling.
            let index = Math.floor(clamped * total);

            // Clamp just in case
            index = Math.max(0, Math.min(total - 1, index));
            setActiveIndex(index);
        });

        return () => {
            unsubscribe();
        };
    }, [scrollYProgress, values.length]);

    return (
        <section
            id="core-values"
            className="py-16 lg:py-24 bg-gradient-to-br from-secondary/10 to-secondary/5"
        >
            {/* Wider desktop container so cards span almost full viewport width */}
            <div className="max-w-7xl lg:max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-6 xl:px-8">
                {/* Mobile / Tablet: existing simple grid */}
                <div className="lg:hidden">
                    {/* Section header */}
                    <div className="text-center mb-10">
                        <p className="text-sm font-playfair font-semibold text-tertiary/80 uppercase tracking-[0.15em] mb-4">
                            OUR VALUES
                        </p>
                        <h2 className="font-playfair text-4xl md:text-5xl font-bold text-tertiary mb-6 leading-tight">
                            Guided by Integrity and Excellence
                        </h2>
                        <div className="flex justify-center">
                            <p className="font-crimson text-lg md:text-xl text-tertiary/80 max-w-4xl leading-relaxed text-center">
                                At Haria Investments, our values guide every interaction with
                                clients, prospects, and the community. They are the foundation of
                                the trust we've built over generations.
                            </p>
                        </div>
                    </div>

                    {/* Values Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
                        {values.map((value, index) => (
                            <motion.div
                                key={value.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="text-center group transition-all duration-300"
                            >
                                {/* Circular Icon Container */}
                                <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-tertiary to-tertiary/80 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 border-2 border-tertiary/20">
                                    <div className="text-white">
                                        {value.icon}
                                    </div>
                                </div>

                                {/* Title */}
                                <h3 className="font-playfair text-lg md:text-xl font-bold text-tertiary mb-2 min-h-[2.5rem] flex items-center justify-center">
                                    {value.title}
                                </h3>

                                {/* Description */}
                                <p className="font-crimson text-sm md:text-base text-tertiary/70 leading-relaxed text-justify">
                                    {value.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Desktop: scroll-pinned two-column experience (reference-style layout) */}
                <div
                    ref={desktopSectionRef}
                    className="hidden lg:block relative"
                >
                    {/* Make the section tall so the sticky content has scroll room */}
                    <div className="h-[220vh]">
                        {/* Sticky container that locks once it fills the viewport */}
                        <div className="sticky top-24">
                            {/* Two separate card containers that together fill the viewport area */}
                            <div className="grid grid-cols-2 gap-10 xl:gap-14 items-stretch h-[80vh] xl:h-[82vh]">
                                {/* Left column: bold hero-style card */}
                                <div className="h-full flex">
                                    <div className="relative flex flex-col justify-between w-full h-full rounded-[32px] overflow-hidden bg-[radial-gradient(circle_at_top,_#111827_0%,_#020617_45%,_#020617_100%)] shadow-2xl border border-white/10 px-10 py-10 xl:px-16 xl:py-14 text-white">
                                        <div>
                                            <p className="text-sm font-playfair font-semibold text-white/70 uppercase tracking-[0.15em] mb-4">
                                                OUR VALUES
                                            </p>
                                            <h2 className="font-playfair text-5xl xl:text-[3.75rem] 2xl:text-[4.25rem] font-extrabold leading-tight mb-8 max-w-xl">
                                                Guided by
                                                <br />
                                                Integrity &
                                                <br />
                                                Excellence
                                            </h2>
                                            <p className="font-crimson text-lg 2xl:text-xl text-white/80 max-w-xl leading-relaxed">
                                                Principles that drive every decision — from planning and
                                                protection to disciplined execution over decades.
                                            </p>
                                        </div>

                                        {/* Bottom progress line similar to reference */}
                                        <div className="mt-10 w-full h-[2px] bg-white/10 rounded-full overflow-hidden">
                                            <motion.div
                                                style={{ scaleX: barProgress }}
                                                className="h-full w-full origin-left bg-white/70"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Right column: value detail card, with scroll-driven in/out animation */}
                                <div className="h-full flex">
                                    <div className="relative w-full h-full">
                                        <AnimatePresence mode="wait">
                                            <motion.div
                                                key={activeIndex}
                                                initial={{ y: 80 }}
                                                animate={{ y: 0 }}
                                                exit={{ y: 0 }}
                                                transition={{ duration: 0.75, ease: "linear" }}
                                                style={{ scale: cardScale }}
                                                className="absolute inset-0 flex flex-col rounded-[32px] bg-white shadow-2xl border border-slate-100 px-10 py-10 xl:px-16 xl:py-14"
                                            >
                                                {/* Center main text block vertically */}
                                                <div className="flex-1 flex items-center">
                                                    <div className="flex items-start justify-between gap-8 w-full">
                                                        {/* Large index number */}
                                                        <div className="text-tertiary font-playfair font-extrabold leading-none pr-6">
                                                            <span className="block text-[9rem] xl:text-[10rem] 2xl:text-[11rem]">
                                                                {String(activeIndex + 1).padStart(2, "0")}
                                                            </span>
                                                        </div>

                                                        {/* Text content */}
                                                        <div className="flex-1 max-w-xl">
                                                            <h3 className="font-playfair text-[2.6rem] xl:text-[3rem] 2xl:text-[3.4rem] font-bold text-tertiary mb-4 leading-tight">
                                                                {values[activeIndex].title}
                                                            </h3>
                                                            <p className="font-crimson text-xl xl:text-[1.35rem] text-tertiary/80 leading-relaxed">
                                                                {values[activeIndex].description}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Bottom controls / dots area */}
                                                <div className="mt-6 flex items-center justify-between">
                                                    <div className="flex gap-2">
                                                        {values.map((v, idx) => (
                                                            <button
                                                                key={v.title}
                                                                type="button"
                                                                onClick={() => setActiveIndex(idx)}
                                                                className={`h-1.5 rounded-full transition-all duration-300 ${idx === activeIndex
                                                                    ? "w-8 bg-secondary"
                                                                    : "w-3 bg-secondary/30"
                                                                    }`}
                                                                aria-label={v.title}
                                                            />
                                                        ))}
                                                    </div>
                                                </div>
                                            </motion.div>
                                        </AnimatePresence>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CoreValues;
