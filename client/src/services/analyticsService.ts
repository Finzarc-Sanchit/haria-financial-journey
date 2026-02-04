import apiClient from '../api/apiClient';

export interface DeviceInfo {
    browser: string;
    os: string;
    device: 'desktop' | 'mobile' | 'tablet';
    screenResolution: string;
}

export interface AnalyticsEvent {
    visitorId: string;
    eventType: 'pageview' | 'heartbeat' | 'pageleave';
    pageUrl: string;
    pageTitle?: string;
    referrer?: string;
    userAgent: string;
    deviceInfo?: DeviceInfo;
    timeSpent?: number;
    sessionId?: string;
    isNewVisitor?: boolean;
    isReturningVisitor?: boolean;
}

export interface AnalyticsResponse {
    success: boolean;
    message: string;
    data?: any;
}

class AnalyticsService {
    private readonly baseUrl = '/analytics';
    private readonly heartbeatInterval = 15000; // 15 seconds
    private readonly maxRetries = 3;
    private readonly retryDelay = 1000; // 1 second

    /**
     * Send analytics event to the server
     */
    async trackEvent(event: AnalyticsEvent): Promise<AnalyticsResponse> {
        try {
            const response = await apiClient.post(`${this.baseUrl}/collect`, event);
            return response.data;
        } catch (error: any) {
            console.error('Analytics tracking error:', error);

            // Retry logic for failed requests
            if (error.response?.status >= 500 && error.config?.retryCount < this.maxRetries) {
                await this.delay(this.retryDelay * Math.pow(2, error.config.retryCount || 0));
                return this.trackEventWithRetry(event, (error.config?.retryCount || 0) + 1);
            }

            throw error;
        }
    }

    /**
     * Retry tracking with exponential backoff
     */
    private async trackEventWithRetry(event: AnalyticsEvent, retryCount: number): Promise<AnalyticsResponse> {
        try {
            const response = await apiClient.post(`${this.baseUrl}/collect`, event);
            return response.data;
        } catch (error: any) {
            if (retryCount < this.maxRetries && error.response?.status >= 500) {
                await this.delay(this.retryDelay * Math.pow(2, retryCount));
                return this.trackEventWithRetry(event, retryCount + 1);
            }
            throw error;
        }
    }

    /**
     * Send analytics event using sendBeacon for better reliability on page unload
     */
    trackEventBeacon(event: AnalyticsEvent): boolean {
        try {
            const data = JSON.stringify(event);
            const blob = new Blob([data], { type: 'application/json' });

            // Use sendBeacon if available, fallback to fetch
            if (navigator.sendBeacon) {
                const url = `${apiClient.defaults.baseURL}${this.baseUrl}/collect`;
                return navigator.sendBeacon(url, blob);
            } else {
                // Fallback to fetch with keepalive
                fetch(`${apiClient.defaults.baseURL}${this.baseUrl}/collect`, {
                    method: 'POST',
                    body: blob,
                    keepalive: true,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).catch(error => {
                    console.error('Analytics beacon fallback error:', error);
                });
                return true;
            }
        } catch (error) {
            console.error('Analytics beacon error:', error);
            return false;
        }
    }

    /**
     * Get analytics overview data
     */
    async getAnalyticsOverview(days: number = 30): Promise<AnalyticsResponse> {
        try {
            const response = await apiClient.get(`${this.baseUrl}/overview?days=${days}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching analytics overview:', error);
            throw error;
        }
    }

    /**
     * Get page-specific analytics
     */
    async getPageAnalytics(pageUrl: string, days: number = 30): Promise<AnalyticsResponse> {
        try {
            const encodedPageUrl = encodeURIComponent(pageUrl);
            const response = await apiClient.get(`${this.baseUrl}/page/${encodedPageUrl}?days=${days}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching page analytics:', error);
            throw error;
        }
    }

    /**
     * Get visitor-specific analytics
     */
    async getVisitorAnalytics(visitorId: string, days: number = 30): Promise<AnalyticsResponse> {
        try {
            const response = await apiClient.get(`${this.baseUrl}/visitor/${visitorId}?days=${days}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching visitor analytics:', error);
            throw error;
        }
    }

    /**
     * Get real-time analytics
     */
    async getRealTimeAnalytics(minutes: number = 5): Promise<AnalyticsResponse> {
        try {
            const response = await apiClient.get(`${this.baseUrl}/realtime?minutes=${minutes}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching real-time analytics:', error);
            throw error;
        }
    }

    /**
     * Export analytics data
     */
    async exportAnalytics(options: {
        format?: 'json' | 'csv';
        startDate?: string;
        endDate?: string;
        eventType?: string;
    } = {}): Promise<Blob | AnalyticsResponse> {
        try {
            const params = new URLSearchParams();
            if (options.format) params.append('format', options.format);
            if (options.startDate) params.append('startDate', options.startDate);
            if (options.endDate) params.append('endDate', options.endDate);
            if (options.eventType) params.append('eventType', options.eventType);

            const response = await apiClient.get(`${this.baseUrl}/export?${params.toString()}`, {
                responseType: options.format === 'csv' ? 'blob' : 'json'
            });

            return response.data;
        } catch (error) {
            console.error('Error exporting analytics:', error);
            throw error;
        }
    }

    /**
     * Utility function to detect device information
     */
    detectDeviceInfo(): DeviceInfo {
        const userAgent = navigator.userAgent;

        // Detect browser
        let browser = 'Unknown';
        if (userAgent.includes('Chrome')) browser = 'Chrome';
        else if (userAgent.includes('Firefox')) browser = 'Firefox';
        else if (userAgent.includes('Safari')) browser = 'Safari';
        else if (userAgent.includes('Edge')) browser = 'Edge';
        else if (userAgent.includes('Opera')) browser = 'Opera';

        // Detect OS
        let os = 'Unknown';
        if (userAgent.includes('Windows')) os = 'Windows';
        else if (userAgent.includes('Mac')) os = 'macOS';
        else if (userAgent.includes('Linux')) os = 'Linux';
        else if (userAgent.includes('Android')) os = 'Android';
        else if (userAgent.includes('iOS')) os = 'iOS';

        // Detect device type
        let device: 'desktop' | 'mobile' | 'tablet' = 'desktop';
        if (/Android|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)) {
            device = 'mobile';
        } else if (/iPad|Android(?=.*Tablet)|Kindle|Silk/i.test(userAgent)) {
            device = 'tablet';
        }

        return {
            browser,
            os,
            device,
            screenResolution: `${screen.width}x${screen.height}`
        };
    }

    /**
     * Generate a unique visitor ID
     */
    generateVisitorId(): string {
        return 'visitor_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now().toString(36);
    }

    /**
     * Generate a unique session ID
     */
    generateSessionId(): string {
        return 'session_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now().toString(36);
    }

    /**
     * Get or create visitor ID from localStorage
     */
    getVisitorId(): string {
        const stored = localStorage.getItem('analytics_visitor_id');
        if (stored) {
            return stored;
        }

        const newId = this.generateVisitorId();
        localStorage.setItem('analytics_visitor_id', newId);
        return newId;
    }

    /**
     * Get or create session ID from sessionStorage
     */
    getSessionId(): string {
        const stored = sessionStorage.getItem('analytics_session_id');
        if (stored) {
            return stored;
        }

        const newId = this.generateSessionId();
        sessionStorage.setItem('analytics_session_id', newId);
        return newId;
    }

    /**
     * Check if visitor is new or returning
     */
    isNewVisitor(): boolean {
        const lastVisit = localStorage.getItem('analytics_last_visit');
        const now = Date.now();
        const oneDay = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

        if (!lastVisit) {
            localStorage.setItem('analytics_last_visit', now.toString());
            return true;
        }

        const timeSinceLastVisit = now - parseInt(lastVisit);
        const isNew = timeSinceLastVisit > oneDay;

        if (isNew) {
            localStorage.setItem('analytics_last_visit', now.toString());
        }

        return isNew;
    }

    /**
     * Utility function for delays
     */
    private delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Get heartbeat interval
     */
    getHeartbeatInterval(): number {
        return this.heartbeatInterval;
    }
}

export default new AnalyticsService();
