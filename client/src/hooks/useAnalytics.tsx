import { useEffect, useRef, useCallback, useState } from 'react';
import { useLocation } from 'react-router-dom';
import analyticsService, { AnalyticsEvent } from '../services/analyticsService';

interface UseAnalyticsOptions {
    enabled?: boolean;
    trackPageViews?: boolean;
    trackTimeOnPage?: boolean;
    heartbeatInterval?: number;
    debug?: boolean;
}

interface UseAnalyticsReturn {
    trackEvent: (eventType: 'pageview' | 'heartbeat' | 'pageleave', additionalData?: Partial<AnalyticsEvent>) => Promise<void>;
    trackCustomEvent: (eventName: string, data?: any) => Promise<void>;
    isTracking: boolean;
    visitorId: string;
    sessionId: string;
    timeOnPage: number;
}

export const useAnalytics = (options: UseAnalyticsOptions = {}): UseAnalyticsReturn => {
    const {
        enabled = true,
        trackPageViews = true,
        trackTimeOnPage = true,
        heartbeatInterval = 15000,
        debug = false
    } = options;

    const location = useLocation();
    const [isTracking, setIsTracking] = useState(false);
    const [timeOnPage, setTimeOnPage] = useState(0);

    // Refs for tracking state
    const startTimeRef = useRef<number>(Date.now());
    const heartbeatIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const visibilityTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const isPageVisibleRef = useRef<boolean>(true);
    const lastHeartbeatRef = useRef<number>(Date.now());
    const accumulatedTimeRef = useRef<number>(0);

    // Get visitor and session IDs
    const visitorId = analyticsService.getVisitorId();
    const sessionId = analyticsService.getSessionId();
    const isNewVisitor = analyticsService.isNewVisitor();

    // Debug logging
    const debugLog = useCallback((message: string, data?: any) => {
        if (debug) {
            console.log(`[Analytics] ${message}`, data);
        }
    }, [debug]);

    // Track analytics event
    const trackEvent = useCallback(async (
        eventType: 'pageview' | 'heartbeat' | 'pageleave',
        additionalData: Partial<AnalyticsEvent> = {}
    ) => {
        if (!enabled) return;

        try {
            const deviceInfo = analyticsService.detectDeviceInfo();

            const eventData: AnalyticsEvent = {
                visitorId,
                sessionId,
                eventType,
                pageUrl: window.location.href,
                pageTitle: document.title,
                referrer: document.referrer || '',
                userAgent: navigator.userAgent,
                deviceInfo,
                timeSpent: eventType === 'pageleave' ? accumulatedTimeRef.current : 0,
                isNewVisitor,
                isReturningVisitor: !isNewVisitor,
                ...additionalData
            };

            debugLog(`Tracking ${eventType} event`, eventData);

            if (eventType === 'pageleave') {
                // Use sendBeacon for page leave events to ensure delivery
                analyticsService.trackEventBeacon(eventData);
            } else {
                await analyticsService.trackEvent(eventData);
            }
        } catch (error) {
            debugLog(`Error tracking ${eventType} event`, error);
        }
    }, [enabled, visitorId, sessionId, isNewVisitor, debugLog]);

    // Track custom event
    const trackCustomEvent = useCallback(async (eventName: string, data: any = {}) => {
        if (!enabled) return;

        // Skip tracking for admin pages
        const isAdminPage = location.pathname === '/login' || location.pathname === '/dashboard';
        if (isAdminPage) {
            debugLog('Skipping custom event tracking for admin page', { eventName, pathname: location.pathname });
            return;
        }

        try {
            await trackEvent('pageview', {
                pageTitle: `${document.title} - ${eventName}`,
                timeSpent: accumulatedTimeRef.current,
                ...data
            });

            debugLog(`Custom event tracked: ${eventName}`, data);
        } catch (error) {
            debugLog(`Error tracking custom event ${eventName}`, error);
        }
    }, [enabled, trackEvent, debugLog, location.pathname]);

    // Handle visibility change
    const handleVisibilityChange = useCallback(() => {
        const isVisible = !document.hidden;
        const now = Date.now();

        if (isVisible && !isPageVisibleRef.current) {
            // Page became visible - resume tracking
            debugLog('Page became visible - resuming tracking');
            isPageVisibleRef.current = true;
            startTimeRef.current = now;

            // Clear any pending timeout
            if (visibilityTimeoutRef.current) {
                clearTimeout(visibilityTimeoutRef.current);
                visibilityTimeoutRef.current = null;
            }
        } else if (!isVisible && isPageVisibleRef.current) {
            // Page became hidden - pause tracking
            debugLog('Page became hidden - pausing tracking');
            isPageVisibleRef.current = false;

            // Accumulate time spent
            const timeSpent = now - startTimeRef.current;
            accumulatedTimeRef.current += timeSpent;

            // Set timeout to track page leave if hidden for too long
            visibilityTimeoutRef.current = setTimeout(() => {
                debugLog('Page hidden for too long - tracking page leave');
                trackEvent('pageleave');
            }, 30000); // 30 seconds
        }
    }, [trackEvent, debugLog]);

    // Start heartbeat tracking
    const startHeartbeat = useCallback(() => {
        if (!trackTimeOnPage || heartbeatIntervalRef.current) return;

        debugLog('Starting heartbeat tracking', { interval: heartbeatInterval });

        heartbeatIntervalRef.current = setInterval(() => {
            if (isPageVisibleRef.current) {
                const now = Date.now();
                const timeSpent = now - startTimeRef.current;
                accumulatedTimeRef.current += timeSpent;

                setTimeOnPage(Math.floor(accumulatedTimeRef.current / 1000)); // Convert to seconds

                // Reset start time for next interval
                startTimeRef.current = now;

                // Track heartbeat
                trackEvent('heartbeat', {
                    timeSpent: accumulatedTimeRef.current
                });

                debugLog('Heartbeat sent', { timeSpent: accumulatedTimeRef.current });
            }
        }, heartbeatInterval);
    }, [trackTimeOnPage, heartbeatInterval, trackEvent, debugLog]);

    // Stop heartbeat tracking
    const stopHeartbeat = useCallback(() => {
        if (heartbeatIntervalRef.current) {
            clearInterval(heartbeatIntervalRef.current);
            heartbeatIntervalRef.current = null;
            debugLog('Heartbeat tracking stopped');
        }
    }, [debugLog]);

    // Track page view on route change
    useEffect(() => {
        if (!enabled || !trackPageViews) return;

        // Skip tracking for admin pages (login and dashboard)
        const isAdminPage = location.pathname === '/login' || location.pathname === '/dashboard';
        if (isAdminPage) {
            debugLog('Skipping analytics for admin page', { pathname: location.pathname });
            return;
        }

        debugLog('Route changed - tracking page view', { pathname: location.pathname });

        // Reset tracking state for new page
        startTimeRef.current = Date.now();
        accumulatedTimeRef.current = 0;
        setTimeOnPage(0);
        isPageVisibleRef.current = true;

        // Track page view
        trackEvent('pageview');

        // Start heartbeat if enabled
        if (trackTimeOnPage) {
            startHeartbeat();
        }

        return () => {
            // Track page leave when component unmounts
            if (trackTimeOnPage) {
                const timeSpent = Date.now() - startTimeRef.current;
                accumulatedTimeRef.current += timeSpent;

                debugLog('Component unmounting - tracking page leave', {
                    timeSpent: accumulatedTimeRef.current
                });

                trackEvent('pageleave', {
                    timeSpent: accumulatedTimeRef.current
                });
            }

            stopHeartbeat();
        };
    }, [location.pathname, enabled, trackPageViews, trackTimeOnPage, trackEvent, startHeartbeat, stopHeartbeat, debugLog]);

    // Set up visibility change listener
    useEffect(() => {
        if (!enabled || !trackTimeOnPage) return;

        // Skip tracking for admin pages
        const isAdminPage = location.pathname === '/login' || location.pathname === '/dashboard';
        if (isAdminPage) return;

        debugLog('Setting up visibility change listener');
        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            if (visibilityTimeoutRef.current) {
                clearTimeout(visibilityTimeoutRef.current);
            }
        };
    }, [enabled, trackTimeOnPage, handleVisibilityChange, debugLog, location.pathname]);

    // Set up beforeunload listener for final page leave tracking
    useEffect(() => {
        if (!enabled || !trackTimeOnPage) return;

        // Skip tracking for admin pages
        const isAdminPage = location.pathname === '/login' || location.pathname === '/dashboard';
        if (isAdminPage) return;

        const handleBeforeUnload = () => {
            const timeSpent = Date.now() - startTimeRef.current;
            accumulatedTimeRef.current += timeSpent;

            debugLog('Page unloading - final page leave tracking', {
                timeSpent: accumulatedTimeRef.current
            });

            // Use sendBeacon for reliable delivery on page unload
            const deviceInfo = analyticsService.detectDeviceInfo();
            const eventData: AnalyticsEvent = {
                visitorId,
                sessionId,
                eventType: 'pageleave',
                pageUrl: window.location.href,
                pageTitle: document.title,
                referrer: document.referrer || '',
                userAgent: navigator.userAgent,
                deviceInfo,
                timeSpent: accumulatedTimeRef.current,
                isNewVisitor,
                isReturningVisitor: !isNewVisitor
            };

            analyticsService.trackEventBeacon(eventData);
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [enabled, trackTimeOnPage, visitorId, sessionId, isNewVisitor, debugLog, location.pathname]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            stopHeartbeat();
            if (visibilityTimeoutRef.current) {
                clearTimeout(visibilityTimeoutRef.current);
            }
        };
    }, [stopHeartbeat]);

    // Initialize tracking state
    useEffect(() => {
        setIsTracking(enabled);
        debugLog('Analytics hook initialized', {
            enabled,
            trackPageViews,
            trackTimeOnPage,
            visitorId,
            sessionId
        });
    }, [enabled, trackPageViews, trackTimeOnPage, visitorId, sessionId, debugLog]);

    return {
        trackEvent,
        trackCustomEvent,
        isTracking,
        visitorId,
        sessionId,
        timeOnPage
    };
};

export default useAnalytics;
