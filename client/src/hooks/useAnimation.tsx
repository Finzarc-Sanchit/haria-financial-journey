import { useEffect, useRef, useState } from 'react';

// Sequence step hook for timed animations
export function useSequence(steps: number, delays: number[] = []) {
    const [activeStep, setActiveStep] = useState(0);
    useEffect(() => {
        let timeouts: NodeJS.Timeout[] = [];
        for (let i = 1; i <= steps; i++) {
            const delay = delays[i - 1] || i * 300;
            timeouts.push(setTimeout(() => setActiveStep(i), delay));
        }
        return () => timeouts.forEach(clearTimeout);
    }, [steps, delays]);
    return activeStep;
}

// Scroll trigger hook for element-based animation
export function useScrollTrigger(ref: React.RefObject<HTMLElement>, options?: IntersectionObserverInit) {
    const [inView, setInView] = useState(false);
    useEffect(() => {
        if (!ref.current) return;
        const observer = new window.IntersectionObserver(
            ([entry]) => setInView(entry.isIntersecting),
            options
        );
        observer.observe(ref.current);
        return () => observer.disconnect();
    }, [ref, options]);
    return inView;
}

// Counter animation hook
export function useCounter(target: number, duration = 1200) {
    const [value, setValue] = useState(0);
    useEffect(() => {
        let start = 0;
        const startTime = performance.now();
        function animate(now: number) {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            setValue(Math.floor(progress * target));
            if (progress < 1) requestAnimationFrame(animate);
            else setValue(target);
        }
        requestAnimationFrame(animate);
    }, [target, duration]);
    return value;
}

// (Optional) GSAP/AOS integration helpers can be added here
// Example: useGSAP, useAOS

/**
 * Example sequence for calculator page:
 * - 0.2s: Header fade-in
 * - 0.5s: Title typewriter
 * - 0.8s: Calculator slide-in
 * - 1.0s: Results slide-in
 * - 1.5s: Trust badge float-up
 *
 * Usage:
 *   const step = useSequence(5, [200, 500, 800, 1000, 1500]);
 *   // Render each element when step >= N
 */ 