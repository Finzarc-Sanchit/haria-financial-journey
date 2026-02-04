import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    BarChart3,
    Users,
    Eye,
    Clock,
    TrendingUp,
    Globe,
    Smartphone,
    Monitor,
    Tablet,
    Download,
    RefreshCw,
    Activity,
    MousePointer,
    Calendar,
    Filter
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Badge } from '../components/ui/badge';
import analyticsService from '../services/analyticsService';

interface AnalyticsOverview {
    overview: {
        totalPageViews: number;
        uniqueVisitors: number;
        bounceRate: number;
        avgPagesPerVisitor: number;
    };
    deviceStats: Array<{
        device: string;
        count: number;
        uniqueVisitors: number;
    }>;
    pagePerformance: Array<{
        pageUrl: string;
        pageTitle: string;
        totalViews: number;
        avgTimeSpent: number;
        totalTimeSpent: number;
        uniqueVisitors: number;
    }>;
    trafficSources: Array<{
        referrer: string;
        count: number;
        uniqueVisitors: number;
    }>;
    dailyTraffic: Array<{
        date: string;
        count: number;
        uniqueVisitors: number;
    }>;
}

interface RealTimeData {
    timeRange: string;
    activeVisitors: number;
    currentPageViews: number;
    topPages: Array<{
        _id: string;
        pageTitle: string;
        count: number;
    }>;
    deviceBreakdown: Array<{
        _id: string;
        count: number;
    }>;
}

const AnalyticsDashboard: React.FC = () => {
    const [analyticsData, setAnalyticsData] = useState<AnalyticsOverview | null>(null);
    const [realTimeData, setRealTimeData] = useState<RealTimeData | null>(null);
    const [loading, setLoading] = useState(true);
    const [timeRange, setTimeRange] = useState('30');
    const [realTimeInterval, setRealTimeInterval] = useState<NodeJS.Timeout | null>(null);
    const [hoveredCard, setHoveredCard] = useState<string | null>(null);

    // Fetch analytics overview
    const fetchAnalyticsOverview = async () => {
        try {
            console.log(`Fetching analytics overview for ${timeRange} days`);
            const response = await analyticsService.getAnalyticsOverview(parseInt(timeRange));
            setAnalyticsData(response.data);
        } catch (error) {
            console.error('Error fetching analytics overview:', error);
        }
    };

    // Fetch real-time analytics
    const fetchRealTimeAnalytics = async () => {
        try {
            const response = await analyticsService.getRealTimeAnalytics(5);
            setRealTimeData(response.data);
        } catch (error) {
            console.error('Error fetching real-time analytics:', error);
        }
    };

    // Export analytics data
    const exportAnalytics = async () => {
        try {
            const data = await analyticsService.exportAnalytics({
                format: 'csv',
                startDate: new Date(Date.now() - parseInt(timeRange) * 24 * 60 * 60 * 1000).toISOString(),
                endDate: new Date().toISOString()
            });

            if (data instanceof Blob) {
                const url = URL.createObjectURL(data);
                const link = document.createElement('a');
                link.href = url;
                link.download = `analytics-export-${new Date().toISOString().split('T')[0]}.csv`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
            }
        } catch (error) {
            console.error('Error exporting analytics:', error);
        }
    };

    // Refresh data
    const refreshData = async () => {
        setLoading(true);
        try {
            await Promise.all([fetchAnalyticsOverview(), fetchRealTimeAnalytics()]);
        } catch (error) {
            console.error('Error refreshing analytics data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            await Promise.all([fetchAnalyticsOverview(), fetchRealTimeAnalytics()]);
            setLoading(false);
        };

        loadData();
    }, [timeRange]);

    // Set up real-time updates
    useEffect(() => {
        if (realTimeInterval) {
            clearInterval(realTimeInterval);
        }

        const interval = setInterval(() => {
            fetchRealTimeAnalytics();
        }, 30000); // Update every 30 seconds

        setRealTimeInterval(interval);

        return () => {
            if (interval) {
                clearInterval(interval);
            }
        };
    }, []);

    const getDeviceIcon = (device: string) => {
        switch (device) {
            case 'mobile': return <Smartphone className="w-5 h-5" />;
            case 'tablet': return <Tablet className="w-5 h-5" />;
            case 'desktop': return <Monitor className="w-5 h-5" />;
            default: return <Monitor className="w-5 h-5" />;
        }
    };

    const formatTime = (milliseconds: number) => {
        const seconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;

        if (minutes > 0) {
            return `${minutes}m ${remainingSeconds}s`;
        }
        return `${remainingSeconds}s`;
    };

    // Get page name from URL
    const getPageName = (url: string): string => {
        try {
            const urlObj = new URL(url);
            const pathname = urlObj.pathname;

            // Remove trailing slash and get the last segment
            const cleanPath = pathname.replace(/\/$/, '') || '/';

            // Map paths to friendly names
            const pageNames: { [key: string]: string; } = {
                '/': 'Homepage',
                '/life-insurance': 'Life Insurance',
                '/health-insurance': 'Health Insurance',
                '/motor-insurance': 'Motor Insurance',
                '/travel-insurance': 'Travel Insurance',
                '/mutual-funds': 'Mutual Funds',
                '/equity': 'Equity',
                '/fixed-income': 'Fixed Income',
                '/gold-silver': 'Gold & Silver',
                '/about': 'About Us',
                '/contact': 'Contact Us',
                '/login': 'Login',
                '/dashboard': 'Dashboard'
            };

            return pageNames[cleanPath] || cleanPath.replace(/^\//, '').replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Unknown Page';
        } catch (error) {
            // Fallback for invalid URLs
            return url.replace(/.*\//, '').replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Unknown Page';
        }
    };

    const formatReferrer = (referrer: string) => {
        if (!referrer || referrer === '') return 'Direct';
        try {
            const url = new URL(referrer);
            return url.hostname;
        } catch {
            return referrer;
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center"
                >
                    <RefreshCw className="w-12 h-12 text-secondary animate-spin mx-auto mb-4" />
                    <p className="text-lg font-crimson text-muted-foreground">Loading Analytics...</p>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Controls */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-end"
            >
                <div className="flex items-center gap-4">
                    <Select value={timeRange} onValueChange={setTimeRange}>
                        <SelectTrigger className="w-40 border-tertiary/30 text-lg">
                            <SelectValue placeholder="Time Range" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="7">Last 7 days</SelectItem>
                            <SelectItem value="30">Last 30 days</SelectItem>
                            <SelectItem value="90">Last 90 days</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button
                        onClick={refreshData}
                        variant="outline"
                        className="border-tertiary/30 text-tertiary text-lg px-6 py-3"
                        disabled={loading}
                    >
                        <RefreshCw className={`w-5 h-5 mr-2 ${loading ? 'animate-spin' : ''}`} />
                        Refresh
                    </Button>
                    <Button
                        onClick={exportAnalytics}
                        className="bg-gradient-to-r from-secondary to-secondary/90 text-secondary-foreground text-lg px-6 py-3"
                    >
                        <Download className="w-5 h-5 mr-2" />
                        Export
                    </Button>
                </div>
            </motion.div>

            {/* Overview Cards */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
                <Card
                    className="group premium-card cursor-pointer border-2 border-transparent hover:border-secondary/50 overflow-hidden hover:shadow-lg hover:shadow-secondary/30 hover:ring-2 hover:ring-secondary/30 relative transition-all duration-300 ease-out"
                    style={{
                        transform: hoveredCard === 'total-page-views' ? 'scale(1.05) rotateY(5deg)' : 'scale(1) rotateY(0deg)',
                        transition: 'all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
                    }}
                    onMouseEnter={() => setHoveredCard('total-page-views')}
                    onMouseLeave={() => setHoveredCard(null)}
                >
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-lg font-crimson text-muted-foreground">Total Page Views</p>
                                <p className="text-4xl font-playfair font-bold text-tertiary">
                                    {analyticsData?.overview.totalPageViews?.toLocaleString() || 0}
                                </p>
                            </div>
                            <Eye className="w-8 h-8 text-secondary group-hover:scale-110 transition-all duration-300 ease-out" />
                        </div>
                    </CardContent>
                </Card>

                <Card
                    className="group premium-card cursor-pointer border-2 border-transparent hover:border-secondary/50 overflow-hidden hover:shadow-lg hover:shadow-secondary/30 hover:ring-2 hover:ring-secondary/30 relative transition-all duration-300 ease-out"
                    style={{
                        transform: hoveredCard === 'unique-visitors' ? 'scale(1.05) rotateY(5deg)' : 'scale(1) rotateY(0deg)',
                        transition: 'all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
                    }}
                    onMouseEnter={() => setHoveredCard('unique-visitors')}
                    onMouseLeave={() => setHoveredCard(null)}
                >
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-lg font-crimson text-muted-foreground">Unique Visitors</p>
                                <p className="text-4xl font-playfair font-bold text-blue-600">
                                    {analyticsData?.overview.uniqueVisitors?.toLocaleString() || 0}
                                </p>
                            </div>
                            <Users className="w-8 h-8 text-blue-500 group-hover:scale-110 transition-all duration-300 ease-out" />
                        </div>
                    </CardContent>
                </Card>

                <Card
                    className="group premium-card cursor-pointer border-2 border-transparent hover:border-secondary/50 overflow-hidden hover:shadow-lg hover:shadow-secondary/30 hover:ring-2 hover:ring-secondary/30 relative transition-all duration-300 ease-out"
                    style={{
                        transform: hoveredCard === 'bounce-rate' ? 'scale(1.05) rotateY(5deg)' : 'scale(1) rotateY(0deg)',
                        transition: 'all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
                    }}
                    onMouseEnter={() => setHoveredCard('bounce-rate')}
                    onMouseLeave={() => setHoveredCard(null)}
                >
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-lg font-crimson text-muted-foreground">Bounce Rate</p>
                                <p className="text-4xl font-playfair font-bold text-orange-600">
                                    {analyticsData?.overview.bounceRate || 0}%
                                </p>
                            </div>
                            <TrendingUp className="w-8 h-8 text-orange-500 group-hover:scale-110 transition-all duration-300 ease-out" />
                        </div>
                    </CardContent>
                </Card>

                <Card
                    className="group premium-card cursor-pointer border-2 border-transparent hover:border-secondary/50 overflow-hidden hover:shadow-lg hover:shadow-secondary/30 hover:ring-2 hover:ring-secondary/30 relative transition-all duration-300 ease-out"
                    style={{
                        transform: hoveredCard === 'pages-per-visitor' ? 'scale(1.05) rotateY(5deg)' : 'scale(1) rotateY(0deg)',
                        transition: 'all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
                    }}
                    onMouseEnter={() => setHoveredCard('pages-per-visitor')}
                    onMouseLeave={() => setHoveredCard(null)}
                >
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-lg font-crimson text-muted-foreground">Pages per Visitor</p>
                                <p className="text-4xl font-playfair font-bold text-green-600">
                                    {analyticsData?.overview.avgPagesPerVisitor || 0}
                                </p>
                            </div>
                            <BarChart3 className="w-8 h-8 text-green-500 group-hover:scale-110 transition-all duration-300 ease-out" />
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Real-time Activity */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                <Card
                    className="group premium-card cursor-pointer border-2 border-transparent hover:border-secondary/50 overflow-hidden hover:shadow-lg hover:shadow-secondary/30 hover:ring-2 hover:ring-secondary/30 relative transition-all duration-300 ease-out"
                    style={{
                        transform: hoveredCard === 'real-time-activity' ? 'scale(1.05) rotateY(5deg)' : 'scale(1) rotateY(0deg)',
                        transition: 'all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
                    }}
                    onMouseEnter={() => setHoveredCard('real-time-activity')}
                    onMouseLeave={() => setHoveredCard(null)}
                >
                    <CardHeader>
                        <CardTitle className="font-playfair text-2xl text-tertiary flex items-center">
                            <Activity className="w-6 h-6 mr-2 text-green-500 group-hover:scale-110 transition-all duration-300 ease-out" />
                            Real-time Activity
                            <Badge className="ml-2 bg-green-100 text-green-800 border-green-200">
                                Live
                            </Badge>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="text-center">
                                <p className="text-3xl font-playfair font-bold text-green-600">
                                    {realTimeData?.activeVisitors || 0}
                                </p>
                                <p className="text-lg font-crimson text-muted-foreground">Active Visitors</p>
                            </div>
                            <div className="text-center">
                                <p className="text-3xl font-playfair font-bold text-blue-600">
                                    {realTimeData?.currentPageViews || 0}
                                </p>
                                <p className="text-lg font-crimson text-muted-foreground">Page Views (5 min)</p>
                            </div>
                            <div className="text-center">
                                <p className="text-3xl font-playfair font-bold text-purple-600">
                                    {realTimeData?.timeRange || '5 minutes'}
                                </p>
                                <p className="text-lg font-crimson text-muted-foreground">Time Range</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Detailed Analytics Tabs */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
            >
                <Tabs defaultValue="pages" className="w-full">
                    <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="pages" className="text-lg">Page Performance</TabsTrigger>
                        <TabsTrigger value="devices" className="text-lg">Device Analytics</TabsTrigger>
                        <TabsTrigger value="sources" className="text-lg">Traffic Sources</TabsTrigger>
                        <TabsTrigger value="timeline" className="text-lg">Timeline</TabsTrigger>
                    </TabsList>

                    <TabsContent value="pages" className="space-y-6">
                        <Card
                            className="group premium-card cursor-pointer border-2 border-transparent hover:border-secondary/50 overflow-hidden hover:shadow-lg hover:shadow-secondary/30 hover:ring-2 hover:ring-secondary/30 relative transition-all duration-300 ease-out"
                            style={{
                                transform: hoveredCard === 'top-performing-pages' ? 'scale(1.05) rotateY(5deg)' : 'scale(1) rotateY(0deg)',
                                transition: 'all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
                            }}
                            onMouseEnter={() => setHoveredCard('top-performing-pages')}
                            onMouseLeave={() => setHoveredCard(null)}
                        >
                            <CardHeader>
                                <CardTitle className="font-playfair text-2xl text-tertiary">
                                    Top Performing Pages
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {analyticsData?.pagePerformance?.slice(0, 10).map((page, index) => (
                                        <div key={page.pageUrl} className="flex items-center justify-between p-4 bg-gradient-to-r from-tertiary/5 to-champagne/10 rounded-lg">
                                            <div className="flex-1">
                                                <p className="font-crimson font-semibold text-lg text-tertiary">
                                                    {getPageName(page.pageUrl)}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-6 text-right">
                                                <div>
                                                    <p className="font-crimson font-bold text-xl text-tertiary">
                                                        {page.totalViews.toLocaleString()}
                                                    </p>
                                                    <p className="text-base text-muted-foreground">Views</p>
                                                </div>
                                                <div>
                                                    <p className="font-crimson font-bold text-xl text-tertiary">
                                                        {formatTime(page.avgTimeSpent)}
                                                    </p>
                                                    <p className="text-base text-muted-foreground">Avg Time</p>
                                                </div>
                                                <div>
                                                    <p className="font-crimson font-bold text-xl text-tertiary">
                                                        {page.uniqueVisitors.toLocaleString()}
                                                    </p>
                                                    <p className="text-base text-muted-foreground">Visitors</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="devices" className="space-y-6">
                        <Card
                            className="group premium-card cursor-pointer border-2 border-transparent hover:border-secondary/50 overflow-hidden hover:shadow-lg hover:shadow-secondary/30 hover:ring-2 hover:ring-secondary/30 relative transition-all duration-300 ease-out"
                            style={{
                                transform: hoveredCard === 'device-breakdown' ? 'scale(1.05) rotateY(5deg)' : 'scale(1) rotateY(0deg)',
                                transition: 'all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
                            }}
                            onMouseEnter={() => setHoveredCard('device-breakdown')}
                            onMouseLeave={() => setHoveredCard(null)}
                        >
                            <CardHeader>
                                <CardTitle className="font-playfair text-2xl text-tertiary">
                                    Device Breakdown
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {analyticsData?.deviceStats?.map((device) => {
                                        const total = analyticsData.deviceStats.reduce((sum, d) => sum + d.count, 0);
                                        const percentage = total > 0 ? Math.round((device.count / total) * 100) : 0;

                                        return (
                                            <div key={device.device} className="space-y-2">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        {getDeviceIcon(device.device)}
                                                        <span className="font-crimson text-lg font-semibold text-tertiary capitalize">
                                                            {device.device}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-4">
                                                        <span className="font-crimson font-bold text-xl text-tertiary">
                                                            {device.count.toLocaleString()}
                                                        </span>
                                                        <span className="font-crimson text-base text-muted-foreground">
                                                            ({percentage}%)
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="w-full bg-gray-200 rounded-full h-3">
                                                    <div
                                                        className="bg-gradient-to-r from-secondary to-tertiary h-3 rounded-full transition-all duration-500"
                                                        style={{ width: `${percentage}%` }}
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="sources" className="space-y-6">
                        <Card
                            className="group premium-card cursor-pointer border-2 border-transparent hover:border-secondary/50 overflow-hidden hover:shadow-lg hover:shadow-secondary/30 hover:ring-2 hover:ring-secondary/30 relative transition-all duration-300 ease-out"
                            style={{
                                transform: hoveredCard === 'traffic-sources' ? 'scale(1.05) rotateY(5deg)' : 'scale(1) rotateY(0deg)',
                                transition: 'all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
                            }}
                            onMouseEnter={() => setHoveredCard('traffic-sources')}
                            onMouseLeave={() => setHoveredCard(null)}
                        >
                            <CardHeader>
                                <CardTitle className="font-playfair text-2xl text-tertiary">
                                    Traffic Sources
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {analyticsData?.trafficSources?.slice(0, 10).map((source) => (
                                        <div key={source.referrer} className="flex items-center justify-between p-4 bg-gradient-to-r from-tertiary/5 to-champagne/10 rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <Globe className="w-5 h-5 text-tertiary" />
                                                <span className="font-crimson text-lg font-semibold text-tertiary">
                                                    {formatReferrer(source.referrer)}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-6 text-right">
                                                <div>
                                                    <p className="font-crimson font-bold text-xl text-tertiary">
                                                        {source.count.toLocaleString()}
                                                    </p>
                                                    <p className="text-base text-muted-foreground">Visits</p>
                                                </div>
                                                <div>
                                                    <p className="font-crimson font-bold text-xl text-tertiary">
                                                        {source.uniqueVisitors.toLocaleString()}
                                                    </p>
                                                    <p className="text-base text-muted-foreground">Visitors</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="timeline" className="space-y-6">
                        <Card
                            className="group premium-card cursor-pointer border-2 border-transparent hover:border-secondary/50 overflow-hidden hover:shadow-lg hover:shadow-secondary/30 hover:ring-2 hover:ring-secondary/30 relative transition-all duration-300 ease-out"
                            style={{
                                transform: hoveredCard === 'daily-traffic-trend' ? 'scale(1.05) rotateY(5deg)' : 'scale(1) rotateY(0deg)',
                                transition: 'all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
                            }}
                            onMouseEnter={() => setHoveredCard('daily-traffic-trend')}
                            onMouseLeave={() => setHoveredCard(null)}
                        >
                            <CardHeader>
                                <CardTitle className="font-playfair text-2xl text-tertiary">
                                    Daily Traffic Trend
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {analyticsData?.dailyTraffic?.slice(-14).map((day) => (
                                        <div key={day.date} className="flex items-center justify-between p-4 bg-gradient-to-r from-tertiary/5 to-champagne/10 rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <Calendar className="w-5 h-5 text-tertiary" />
                                                <span className="font-crimson text-lg font-semibold text-tertiary">
                                                    {new Date(day.date).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-6 text-right">
                                                <div>
                                                    <p className="font-crimson font-bold text-xl text-tertiary">
                                                        {day.count.toLocaleString()}
                                                    </p>
                                                    <p className="text-base text-muted-foreground">Page Views</p>
                                                </div>
                                                <div>
                                                    <p className="font-crimson font-bold text-xl text-tertiary">
                                                        {day.uniqueVisitors.toLocaleString()}
                                                    </p>
                                                    <p className="text-base text-muted-foreground">Visitors</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </motion.div>
        </div>
    );
};

export default AnalyticsDashboard;
