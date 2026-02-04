import { useEffect, useState } from 'react';

export type Breakpoint = 'mobile' | 'tablet' | 'desktop';

export function useResponsive() {
    const [breakpoint, setBreakpoint] = useState<Breakpoint>(() => {
        if (typeof window === 'undefined') return 'desktop';
        const w = window.innerWidth;
        if (w < 768) return 'mobile';
        if (w < 1024) return 'tablet';
        return 'desktop';
    });

    useEffect(() => {
        function handleResize() {
            const w = window.innerWidth;
            if (w < 768) setBreakpoint('mobile');
            else if (w < 1024) setBreakpoint('tablet');
            else setBreakpoint('desktop');
        }
        window.addEventListener('resize', handleResize);
        handleResize();
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return {
        isMobile: breakpoint === 'mobile',
        isTablet: breakpoint === 'tablet',
        isDesktop: breakpoint === 'desktop',
        breakpoint,
    };
} 