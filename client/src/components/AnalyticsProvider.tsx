import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import useAnalytics from '../hooks/useAnalytics';
import analyticsService from '../services/analyticsService';

interface AnalyticsContextType {
    isEnabled: boolean;
    enableAnalytics: () => void;
    disableAnalytics: () => void;
    visitorId: string;
    sessionId: string;
    timeOnPage: number;
    trackCustomEvent: (eventName: string, data?: any) => Promise<void>;
}

const AnalyticsContext = createContext<AnalyticsContextType | undefined>(undefined);

interface AnalyticsProviderProps {
    children: ReactNode;
}

export const AnalyticsProvider: React.FC<AnalyticsProviderProps> = ({ children }) => {
    const [isEnabled, setIsEnabled] = useState(false);
    const [hasConsent, setHasConsent] = useState<boolean | null>(null);

    // Initialize analytics hook with disabled state initially
    const analytics = useAnalytics({
        enabled: isEnabled,
        trackPageViews: true,
        trackTimeOnPage: true,
        debug: process.env.NODE_ENV === 'development'
    });

    // Check for existing consent on mount
    useEffect(() => {
        const consent = localStorage.getItem('analytics_consent');
        if (consent === 'accepted') {
            setHasConsent(true);
            setIsEnabled(true);
        } else if (consent === 'declined') {
            setHasConsent(false);
            setIsEnabled(false);
        } else {
            setHasConsent(null); // No decision made yet
        }
    }, []);

    const enableAnalytics = () => {
        setIsEnabled(true);
        localStorage.setItem('analytics_consent', 'accepted');
        setHasConsent(true);

        // Track consent acceptance
        analytics.trackCustomEvent('analytics_consent_accepted', {
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent
        });
    };

    const disableAnalytics = () => {
        setIsEnabled(false);
        localStorage.setItem('analytics_consent', 'declined');
        setHasConsent(false);

        // Clear any stored analytics data
        localStorage.removeItem('analytics_visitor_id');
        sessionStorage.removeItem('analytics_session_id');
        localStorage.removeItem('analytics_last_visit');
    };

    const contextValue: AnalyticsContextType = {
        isEnabled,
        enableAnalytics,
        disableAnalytics,
        visitorId: analytics.visitorId,
        sessionId: analytics.sessionId,
        timeOnPage: analytics.timeOnPage,
        trackCustomEvent: analytics.trackCustomEvent
    };

    return (
        <AnalyticsContext.Provider value={contextValue}>
            {children}
        </AnalyticsContext.Provider>
    );
};

export const useAnalyticsContext = (): AnalyticsContextType => {
    const context = useContext(AnalyticsContext);
    if (context === undefined) {
        throw new Error('useAnalyticsContext must be used within an AnalyticsProvider');
    }
    return context;
};

export default AnalyticsProvider;
