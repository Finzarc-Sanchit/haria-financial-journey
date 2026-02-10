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
    // Tiny helpers for ultra-smooth, fully scroll-based motion (no inertia when scroll stops)
    const clamp01 = (n: number) => Math.max(0, Math.min(1, n));
    const easeInOutCubic = (t: number) =>
        t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

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
            const clampedV = clamp01(v);

            // Before segment: stay below viewport
            if (clampedV < segmentStart) {
                return startY;
            }

            // After segment: stay at final position (lock in place, never move back)
            if (clampedV >= segmentEnd) {
                return 0;
            }

            // During segment: interpolate from startY to 0
            // Ensure segmentEnd > segmentStart to avoid division by zero
            const segmentRange = Math.max(0.00001, segmentEnd - segmentStart);
            const segmentProgress = clamp01((clampedV - segmentStart) / segmentRange);

            // Butter-smooth, controlled motion: slower start + slower end
            const eased = easeInOutCubic(segmentProgress);
            const finalY = startY * (1 - eased);

            // Ensure we never return a value less than 0 or greater than startY
            return Math.max(0, Math.min(startY, finalY));
        });

        // Scale: card zooms out (1 → 0.75) as the NEXT card enters (purely scroll-based, no inertia)
        // Previous card should shrink as new card slides up from bottom
        // Super smooth and slow zoom-out
        const hasNextCard = index < total - 1;
        const nextIndex = index + 1;
        const nextStart = !hasNextCard ? 1 : nextIndex === 0 ? 0 : (nextIndex - 1) * segment;
        const nextEnd = !hasNextCard ? 1 : nextIndex === 0 ? 0 : nextIndex * segment;

        const zoomStart = nextStart;
        const zoomEnd = nextEnd;
        const zoomRange = Math.max(0.00001, zoomEnd - zoomStart);

        // Timing tweaks:
        // - First card: start zoom immediately to avoid dead scroll when sticky engages
        // - Penultimate card: start a bit earlier so it doesn't vanish before zoom is noticeable
        // Reduced delay so zoom begins sooner after the next card starts moving.
        const startDelayPct = index === 0 ? 0 : index === total - 2 ? 0.05 : 0.08;
        const endDelayPct = index === total - 2 ? 0.90 : 0.96;
        const zoomStartDelayed = zoomStart + zoomRange * startDelayPct;
        const zoomEndDelayed = zoomStart + zoomRange * endDelayPct;

        const scale = useTransform(scrollYProgress, (v) => {
            // If there's no next card, stay at full size
            if (index === total - 1) return 1;

            // Zoom out while the NEXT card is entering (spread across the FULL next card segment for slower zoom)
            // Clamp v to valid range
            const clampedV = clamp01(v);

            // Before the next card begins entering, keep full scale
            if (clampedV < zoomStartDelayed) return 1;

            // After zoom window, fully zoomed out (lock in place, never scale back up)
            if (clampedV >= zoomEndDelayed) return 0.75;

            // During zoom window
            const zoomProgress = (clampedV - zoomStartDelayed) / (zoomEndDelayed - zoomStartDelayed);
            const eased = easeInOutCubic(clamp01(zoomProgress));
            const finalScale = 1 - eased * 0.25; // 1 → 0.75

            // Ensure scale never goes below 0.75 or above 1
            return Math.max(0.75, Math.min(1, finalScale));
        });

        // Subtle opacity fade for older cards (very subtle, super smooth)
        const opacity = useTransform(scrollYProgress, (v) => {
            // First card is immediately visible at v = 0, no dead scroll
            if (index === 0) return 1;

            // Ensure all other cards are hidden at v = 0, even if segmentStart = 0
            if (v <= 0 && index > 0) return 0;

            // Smooth fade-in (fixes the "pop/jump" when a new card starts)
            if (v < segmentStart) return 0;
            const fadeInEnd = segmentStart + segment * 0.22;
            if (v < fadeInEnd) {
                const t = clamp01((v - segmentStart) / Math.max(0.00001, fadeInEnd - segmentStart));
                return easeInOutCubic(t);
            }

            // OPTION A:
            // Prevent any transparency while the card is "settled" AND while it is zooming out:
            // - From when it reaches its final position (segmentEnd) until zoom begins (zoomStartDelayed)
            // - And throughout the zoom window (zoomStartDelayed → zoomEndDelayed)
            // This avoids the "see-through" moment before zoom starts.
            const clampedV = clamp01(v);
            if (hasNextCard) {
                if (clampedV >= segmentEnd && clampedV < zoomStartDelayed) return 1;
                if (clampedV >= zoomStartDelayed && clampedV < zoomEndDelayed) return 1;
            }

            // Last card should always be fully visible when active
            if (index === total - 1) {
                if (v >= segmentStart) return 1;
                return 0;
            }

            if (v >= segmentEnd) {
                // After this card's segment, fade it more aggressively if we're in the last card's segment
                const lastCardSegmentStart = (total - 2) * segment;
                // Default fade window
                let fadeStart = segmentEnd;
                let fadeEnd = Math.min(1, segmentEnd + segment * 0.7);

                // If we're in the last card's segment, fade previous cards more
                if (v >= lastCardSegmentStart) {
                    // Penultimate card should NOT disappear quickly; keep it present longer
                    // and fade to a higher floor so it remains readable under the final card.
                    const isPenultimate = index === total - 2;
                    if (isPenultimate) {
                        fadeStart = segmentEnd + segment * 0.22; // start fading a bit later
                        fadeEnd = Math.min(1, segmentEnd + segment * 0.98); // fade across almost the full last segment
                    }

                    // Fade more aggressively when last card is active
                    const fadeProgress = clamp01((v - fadeStart) / Math.max(0.00001, fadeEnd - fadeStart));
                    const eased = 1 - Math.pow(1 - fadeProgress, 5);
                    // Penultimate: fade to 0.55, others: fade to 0.3
                    const minOpacity = index === total - 2 ? 0.55 : 0.3;
                    const fadeAmount = index === total - 2 ? 0.45 : 0.7;
                    return Math.max(minOpacity, 1 - eased * fadeAmount);
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
                    <div className="h-[2000vh]">
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
                                            // Apply About section theme to 2,4,6 cards (1-based indexing)
                                            const isAboutTheme = (index + 1) % 2 === 0;
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
                                                        className={[
                                                            "w-full h-full flex flex-col rounded-[32px] shadow-2xl border px-10 py-10 xl:px-16 xl:py-14",
                                                            isAboutTheme
                                                                ? "bg-tertiary text-white border-white/10"
                                                                : "bg-white text-tertiary border-slate-100",
                                                        ].join(" ")}
                                                    >
                                                        {/* Center main text block vertically */}
                                                        <div className="flex-1 flex items-center">
                                                            <div className="flex items-start justify-between gap-8 w-full">
                                                                {/* Large index number */}
                                                                <div
                                                                    className={[
                                                                        "font-playfair font-extrabold leading-none pr-6",
                                                                        isAboutTheme ? "text-white/90" : "text-tertiary",
                                                                    ].join(" ")}
                                                                >
                                                                    <span className="block text-[9rem] xl:text-[10rem] 2xl:text-[11rem]">
                                                                        {String(index + 1).padStart(2, "0")}
                                                                    </span>
                                                                </div>

                                                                {/* Text content */}
                                                                <div className="flex-1 max-w-xl">
                                                                    <h3
                                                                        className={[
                                                                            "font-playfair text-[2.6rem] xl:text-[3rem] 2xl:text-[3.4rem] font-bold mb-4 leading-tight",
                                                                            isAboutTheme ? "text-white" : "text-tertiary",
                                                                        ].join(" ")}
                                                                    >
                                                                        {value.title}
                                                                    </h3>
                                                                    <p
                                                                        className={[
                                                                            "font-crimson text-xl xl:text-[1.35rem] leading-relaxed",
                                                                            isAboutTheme ? "text-white/80" : "text-tertiary",
                                                                        ].join(" ")}
                                                                    >
                                                                        {value.description}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Bottom controls / dots area */}
                                                        <div className="mt-6 flex items-center justify-between">
                                                            <div className="flex gap-2">
                                                                {values.map((v, idx) => {
                                                                    // Dots are STATIC (not scroll-driven):
                                                                    // each card "owns" its dot state based on its own index.
                                                                    const isThisCard = idx === index;
                                                                    return (
                                                                        <div
                                                                            key={v.title}
                                                                            className="h-1.5 rounded-full"
                                                                            style={{
                                                                                width: isThisCard ? 32 : 12,
                                                                                backgroundColor: isThisCard
                                                                                    ? (isAboutTheme
                                                                                        ? "hsl(0 0% 100%)"
                                                                                        : "hsl(var(--tertiary))")
                                                                                    : (isAboutTheme
                                                                                        ? "hsl(0 0% 100% / 0.3)"
                                                                                        : "hsl(var(--tertiary) / 0.3)"),
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
