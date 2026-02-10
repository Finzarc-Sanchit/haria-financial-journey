import {
    IconShieldCheck,
    IconAward,
    IconScale,
    IconBook,
    IconLock,
    IconUsers,
} from "@tabler/icons-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

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

    const { scrollYProgress } = useScroll({
        target: desktopSectionRef,
        // 0 when the top of the desktop block hits the top of the viewport,
        // 1 only when the bottom of the block reaches the bottom of the viewport.
        // First value is immediately visible at scrollYProgress = 0 (no dead scroll)
        offset: ["start start", "end end"],
    });

    // Progress value for the bottom line:
    // - There are 6 values, so we divide the bar into 6 equal parts.
    // - When scrollYProgress = 0, bar is already at 1/6 (first value visible immediately).
    // - As we scroll, it smoothly grows toward 100% with no dead scroll period.
    const barProgress = useTransform(scrollYProgress, (v) => {
        const firstValueProgress = 1 / 6; // First value is immediately "earned"
        // Map scrollYProgress 0→1 to bar progress 1/6→1, eliminating dead scroll
        return firstValueProgress + (1 - firstValueProgress) * v;
    });

    // Create scroll-driven transforms for each card
    const total = values.length;
    // Card 0 is already visible without scrolling, so we distribute scroll time across the remaining cards
    const segmentsCount = Math.max(1, total - 1);
    const segment = 1 / segmentsCount;

    const cardTransforms = values.map((_, index) => {
        // Card 0 is already in place; cards 1..N-1 use the full scroll range evenly
        const segmentStart = index === 0 ? 0 : (index - 1) * segment;
        const segmentEnd = index === 0 ? 0 : index * segment;

        // Vertical position: slides from bottom (far below viewport) to center (0%) during its segment
        // First card (index 0) is already in place, no sliding needed
        // Returns NUMBERS ONLY for smooth, continuous transforms
        const y = useTransform(scrollYProgress, (v) => {
            // First card is always in place
            if (index === 0) return 0;

            // Start cards much further below (150% of card height) to feel like natural scroll from bottom
            const startY = 150;

            // Clamp v to valid range
            const clampedV = Math.max(0, Math.min(1, v));

            // Continuous transform: map scroll progress to y position
            // Before segment: stay below viewport
            if (clampedV < segmentStart) {
                return startY;
            }

            // After segment: stay at final position (continuous, not irreversible)
            if (clampedV >= segmentEnd) {
                return 0;
            }

            // During segment: interpolate from startY to 0
            // Ensure segmentEnd > segmentStart to avoid division by zero
            const segmentRange = Math.max(0.00001, segmentEnd - segmentStart);
            const segmentProgress = Math.min(1, Math.max(0, (clampedV - segmentStart) / segmentRange));

            // More linear feel at start, then smooth ease-out
            let eased;
            if (segmentProgress < 0.3) {
                eased = segmentProgress / 0.3;
            } else {
                const remainingProgress = (segmentProgress - 0.3) / 0.7;
                eased = 0.3 + (1 - 0.3) * (1 - Math.pow(1 - remainingProgress, 3));
            }

            eased = Math.min(1, Math.max(0, eased));
            const finalY = Math.max(0, startY * (1 - eased));
            return finalY;
        });

        // Scale: card zooms out (1 → 0.75) when next card starts entering
        // Previous card should shrink as new card slides up from bottom
        // Super smooth and slow zoom-out
        const scale = useTransform(scrollYProgress, (v) => {
            // If there's no next card, stay at full size
            if (index === total - 1) return 1;

            // Zoom out while the NEXT card is entering (first 70% of next card's segment)
            const nextIndex = index + 1;
            const nextStart = nextIndex === 0 ? 0 : (nextIndex - 1) * segment;
            const nextEnd = nextIndex === 0 ? 0 : nextIndex * segment;

            const zoomStart = nextStart;
            const zoomEnd = zoomStart + (nextEnd - zoomStart) * 0.7;

            // Before the next card begins entering, keep full scale
            if (v < zoomStart) return 1;

            // After zoom window, fully zoomed out
            if (v >= zoomEnd) return 0.75;

            // During zoom window
            const zoomProgress = (v - zoomStart) / (zoomEnd - zoomStart);
            const eased = 1 - Math.pow(1 - zoomProgress, 5);
            return 1 - eased * 0.25; // 1 → 0.75
        });

        // Subtle opacity fade for older cards (very subtle, super smooth)
        const opacity = useTransform(scrollYProgress, (v) => {
            // First card is immediately visible at v = 0, no dead scroll
            if (index === 0) return 1;

            // Ensure all other cards are hidden at v = 0, even if segmentStart = 0
            if (v <= 0 && index > 0) return 0;

            if (v < segmentStart) return 0;

            // Last card should always be fully visible when active
            if (index === total - 1) {
                if (v >= segmentStart) return 1;
                return 0;
            }

            if (v >= segmentEnd) {
                // After this card's segment, fade it more aggressively if we're in the last card's segment
                const lastCardSegmentStart = (total - 2) * segment;
                const fadeStart = segmentEnd;
                const fadeEnd = Math.min(1, segmentEnd + segment * 0.7);

                // If we're in the last card's segment, fade previous cards more
                if (v >= lastCardSegmentStart) {
                    // Fade more aggressively when last card is active
                    const fadeProgress = Math.min(1, (v - fadeStart) / (fadeEnd - fadeStart));
                    const eased = 1 - Math.pow(1 - fadeProgress, 5);
                    return Math.max(0.3, 1 - eased * 0.7); // Fade to 0.3 instead of 0.9
                }

                // Normal fade for cards not in last segment
                if (v >= fadeEnd) return 0.9;
                if (v >= fadeStart) {
                    const fadeProgress = (v - fadeStart) / (fadeEnd - fadeStart);
                    // Super smooth quintic ease for ultra-gentle fade
                    const eased = 1 - Math.pow(1 - fadeProgress, 5);
                    return 1 - eased * 0.1; // 1 → 0.9
                }
            }
            return 1;
        });

        // Convert numeric y to percentage string for style prop
        const yPercent = useTransform(y, (val) => `${val}%`);

        return { y, yPercent, scale, opacity };
    });

    // Compute activeIndex ONCE outside render loop to avoid hook violations
    const activeIndex = useTransform(scrollYProgress, (v) => {
        // Card 0 is visible at v=0; cards 1.. are distributed across v in [0..1]
        if (v <= 0) return 0;
        const seg = Math.min(segmentsCount - 1, Math.floor(v * segmentsCount));
        return Math.min(total - 1, seg + 1);
    });

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
                    {/* Make the section tall so the sticky content has scroll room - increased for super slow, smooth scroll */}
                    <div className="h-[360vh]">
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

                                {/* Right column: scroll-driven stacked cards */}
                                <div className="h-full flex">
                                    <div className="relative w-full h-full overflow-visible p-6 xl:p-8 2xl:p-10">
                                        {values.map((value, index) => {
                                            const { yPercent, scale, opacity } = cardTransforms[index];
                                            // Higher index = higher z-index (stack on top)
                                            // Last card gets extra high z-index to ensure it's always on top
                                            const zIndex = index === total - 1 ? index + 10 : index;

                                            return (
                                                <motion.div
                                                    key={index}
                                                    style={{
                                                        y: yPercent,
                                                        zIndex: zIndex,
                                                        opacity: opacity,
                                                    }}
                                                    className="absolute inset-0"
                                                >
                                                    <motion.div
                                                        style={{
                                                            scale: scale,
                                                            transformOrigin: "center center",
                                                            willChange: "transform",
                                                        }}
                                                        className="w-full h-full flex flex-col rounded-[32px] bg-white shadow-2xl border border-slate-100 px-10 py-10 xl:px-16 xl:py-14"
                                                    >
                                                        {/* Center main text block vertically */}
                                                        <div className="flex-1 flex items-center">
                                                            <div className="flex items-start justify-between gap-8 w-full">
                                                                {/* Large index number */}
                                                                <div className="text-tertiary font-playfair font-extrabold leading-none pr-6">
                                                                    <span className="block text-[9rem] xl:text-[10rem] 2xl:text-[11rem]">
                                                                        {String(index + 1).padStart(2, "0")}
                                                                    </span>
                                                                </div>

                                                                {/* Text content */}
                                                                <div className="flex-1 max-w-xl">
                                                                    <h3 className="font-playfair text-[2.6rem] xl:text-[3rem] 2xl:text-[3.4rem] font-bold text-tertiary mb-4 leading-tight">
                                                                        {value.title}
                                                                    </h3>
                                                                    <p className="font-crimson text-xl xl:text-[1.35rem] text-tertiary/80 leading-relaxed">
                                                                        {value.description}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Bottom controls / dots area */}
                                                        <div className="mt-6 flex items-center justify-between">
                                                            <div className="flex gap-2">
                                                                {values.map((v, idx) => {
                                                                    // Use activeIndex computed outside render loop
                                                                    const dotWidth = useTransform(
                                                                        activeIndex,
                                                                        (activeIdx) => activeIdx === idx ? 32 : 12
                                                                    );
                                                                    const dotColor = useTransform(
                                                                        activeIndex,
                                                                        (activeIdx) => activeIdx === idx
                                                                            ? "hsl(var(--secondary))"
                                                                            : "hsl(var(--secondary) / 0.3)"
                                                                    );
                                                                    return (
                                                                        <motion.div
                                                                            key={v.title}
                                                                            className="h-1.5 rounded-full"
                                                                            style={{
                                                                                width: dotWidth,
                                                                                backgroundColor: dotColor,
                                                                            }}
                                                                        />
                                                                    );
                                                                })}
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                </motion.div>
                                            );
                                        })}
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
