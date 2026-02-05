import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Users,
    Mail,
    TrendingUp,
    Clock,
    CheckCircle,
    AlertCircle,
    Filter,
    Search,
    Download,
    RefreshCw,
    Eye,
    Edit,
    Trash2,
    Phone,
    Calendar,
    BarChart3,
    PieChart,
    Activity,
    ClipboardCheck
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import LogoutButton from '../components/LogoutButton';
import AnalyticsDashboard from '../components/AnalyticsDashboard';
import { contactService, Contact, ContactStats } from '../services/contactService';
import FinancialHealthAssessmentView from "../components/FinancialHealthAssessmentView";
import financialHealthService, {
    FinancialHealthAssessment,
    FinancialHealthStats,
} from '../services/financialHealthService';
import { formatOccupationStatus, formatDateIST } from '../utils';


const Dashboard: React.FC = () => {
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [stats, setStats] = useState<ContactStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [serviceFilter, setServiceFilter] = useState<string>('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
    const [showContactModal, setShowContactModal] = useState(false);

    // Financial Health state (admin dashboard)
    const [assessments, setAssessments] = useState<FinancialHealthAssessment[]>([]);
    const [fhStats, setFhStats] = useState<FinancialHealthStats | null>(null);
    const [fhRefreshing, setFhRefreshing] = useState(false);
    const [fhSearchTerm, setFhSearchTerm] = useState('');
    const [fhStatusFilter, setFhStatusFilter] = useState<string>('all');
    const [fhOccupationFilter, setFhOccupationFilter] = useState<string>('all');
    const [fhCurrentPage, setFhCurrentPage] = useState(1);
    const [fhItemsPerPage, setFhItemsPerPage] = useState(10);
    const [fhPagination, setFhPagination] = useState<{
        currentPage: number;
        totalPages: number;
        totalAssessments: number;
        hasNext: boolean;
        hasPrev: boolean;
    } | null>(null);
    const [selectedAssessment, setSelectedAssessment] = useState<FinancialHealthAssessment | null>(null);
    const [showAssessmentModal, setShowAssessmentModal] = useState(false);
    const [activeTab, setActiveTab] = useState('contacts');
    const [hoveredCard, setHoveredCard] = useState<string | null>(null);

    // Fetch contacts
    const fetchContacts = async () => {
        try {
            const response = await contactService.getContacts({
                page: currentPage,
                limit: itemsPerPage,
                status: statusFilter !== 'all' ? statusFilter : undefined,
                service: serviceFilter !== 'all' ? serviceFilter : undefined,
                search: searchTerm || undefined
            });

            setContacts(response.data.contacts || []);
        } catch (error) {
            console.error('Error fetching contacts:', error);
        }
    };

    // Fetch statistics
    const fetchStats = async () => {
        try {
            const response = await contactService.getContactStats();
            setStats(response.data);
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    // Fetch financial health assessments
    const fetchAssessments = async () => {
        try {
            const response = await financialHealthService.getAssessments({
                page: fhCurrentPage,
                limit: fhItemsPerPage,
                status: fhStatusFilter !== 'all' ? fhStatusFilter : undefined,
                occupationStatus: fhOccupationFilter !== 'all' ? fhOccupationFilter : undefined,
                search: fhSearchTerm || undefined,
            });
            setAssessments(response.data.assessments || []);
            setFhPagination(response.data.pagination || null);
        } catch (error) {
            console.error('Error fetching financial health assessments:', error);
        }
    };

    const fetchFinancialHealthStats = async () => {
        try {
            const response = await financialHealthService.getFinancialHealthStats();
            setFhStats(response.data);
        } catch (error) {
            console.error('Error fetching financial health stats:', error);
        }
    };

    // Update contact status
    const updateContactStatus = async (contactId: string, newStatus: string) => {
        try {
            await contactService.updateContact(contactId, { status: newStatus });
            await fetchContacts();
            await fetchStats();
        } catch (error) {
            console.error('Error updating contact:', error);
        }
    };

    // Refresh data
    const refreshData = async () => {
        setRefreshing(true);
        try {
            await Promise.all([fetchContacts(), fetchStats()]);
        } catch (error) {
            console.error('Error refreshing data:', error);
        } finally {
            setRefreshing(false);
        }
    };

    const refreshFinancialHealth = async () => {
        setFhRefreshing(true);
        try {
            await Promise.all([fetchAssessments(), fetchFinancialHealthStats()]);
        } catch (error) {
            console.error('Error refreshing financial health data:', error);
        } finally {
            setFhRefreshing(false);
        }
    };

    // Export contacts to CSV
    const exportContacts = () => {
        const csvContent = [
            ['Name', 'Email', 'Services', 'Status', 'Date', 'Message'],
            ...contacts.map(contact => [
                `${contact.firstName} ${contact.lastName}`,
                contact.email,
                contact.services.join(', '),
                contact.status,
                formatDateIST(contact.createdAt, { dateOnly: true }),
                contact.message || ''
            ])
        ].map(row => row.map(field => `"${field}"`).join(',')).join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `contacts-${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Send email to contact
    const sendEmailToContact = (contact: Contact) => {
        const subject = encodeURIComponent(`Re: Your inquiry about ${contact.services.join(', ')}`);
        const body = encodeURIComponent(`Dear ${contact.firstName} ${contact.lastName},\n\nThank you for your interest in our ${contact.services.join(', ')} services.\n\nWe will get back to you soon.\n\nBest regards,\nHaria Investments Team`);
        const mailtoLink = `mailto:${contact.email}?subject=${subject}&body=${body}`;
        window.open(mailtoLink);
    };

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            await Promise.all([fetchContacts(), fetchStats()]);
            setLoading(false);
        };

        loadData();
    }, []);

    // Refetch contacts when pagination or filters change
    useEffect(() => {
        fetchContacts();
    }, [currentPage, itemsPerPage, statusFilter, serviceFilter, searchTerm]);

    // Refetch assessments when pagination or filters change (only when Financial Health tab is active)
    useEffect(() => {
        if (activeTab !== 'financial-health') return;
        fetchAssessments();
    }, [activeTab, fhCurrentPage, fhItemsPerPage, fhStatusFilter, fhOccupationFilter, fhSearchTerm]);

    // Load financial health stats once when tab is opened (and refresh when filters/pagination change via refresh button)
    useEffect(() => {
        if (activeTab !== 'financial-health') return;
        if (!fhStats) fetchFinancialHealthStats();
        if (assessments.length === 0) fetchAssessments();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeTab]);

    // Filter contacts
    const filteredContacts = contacts.filter(contact => {
        const matchesSearch =
            contact.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            contact.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            contact.email.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === 'all' || contact.status === statusFilter;
        const matchesService = serviceFilter === 'all' || contact.services.includes(serviceFilter);

        return matchesSearch && matchesStatus && matchesService;
    });

    // Pagination
    const totalPages = Math.ceil(filteredContacts.length / itemsPerPage);
    const paginatedContacts = filteredContacts.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'new': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'contacted': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'reviewed': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'in_progress': return 'bg-orange-100 text-orange-800 border-orange-200';
            case 'completed': return 'bg-green-100 text-green-800 border-green-200';
            case 'closed': return 'bg-gray-100 text-gray-800 border-gray-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'new': return <AlertCircle className="w-4 h-4" />;
            case 'contacted': return <Phone className="w-4 h-4" />;
            case 'reviewed': return <Eye className="w-4 h-4" />;
            case 'in_progress': return <Clock className="w-4 h-4" />;
            case 'completed': return <CheckCircle className="w-4 h-4" />;
            case 'closed': return <CheckCircle className="w-4 h-4" />;
            default: return <AlertCircle className="w-4 h-4" />;
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-champagne/20 via-white to-tertiary/10 flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center"
                >
                    <RefreshCw className="w-12 h-12 text-secondary animate-spin mx-auto mb-4" />
                    <p className="text-lg font-crimson text-muted-foreground">Loading Dashboard...</p>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-champagne/20 via-white to-tertiary/10">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/80 backdrop-blur-sm border-b border-tertiary/20 shadow-sm"
            >
                <div className="max-w-7xl mx-auto px-6 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-5xl font-playfair font-bold text-tertiary mb-2">
                                {activeTab === 'contacts' ? 'Contact Dashboard' : 'Analytics Dashboard'}
                            </h1>
                            <p className="text-xl text-muted-foreground font-crimson">
                                {activeTab === 'contacts'
                                    ? 'Manage and track your client inquiries'
                                    : 'Track visitor behavior and website performance'
                                }
                            </p>
                        </div>
                        <div className="flex items-center gap-4">
                            <LogoutButton />
                        </div>
                    </div>
                </div>
            </motion.div>

            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Main Dashboard Tabs */}
                <Tabs defaultValue="contacts" className="w-full" onValueChange={setActiveTab}>
                    <TabsList className="grid w-full grid-cols-3 mb-8">
                        <TabsTrigger value="contacts" className="text-lg">
                            <Users className="w-5 h-5 mr-2" />
                            Contact Management
                        </TabsTrigger>
                        <TabsTrigger value="financial-health" className="text-lg">
                            <ClipboardCheck className="w-5 h-5 mr-2" />
                            Financial Health
                        </TabsTrigger>
                        <TabsTrigger value="analytics" className="text-lg">
                            <BarChart3 className="w-5 h-5 mr-2" />
                            Website Analytics
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="contacts" className="space-y-8">
                        {/* Controls */}
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center justify-end"
                        >
                            <div className="flex items-center gap-4">
                                <Button
                                    type="button"
                                    onClick={refreshData}
                                    variant="outline"
                                    className="border-tertiary/30 text-tertiary text-lg px-6 py-3"
                                    disabled={refreshing}
                                >
                                    <RefreshCw className={`w-5 h-5 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                                    Refresh
                                </Button>
                                <Button
                                    type="button"
                                    onClick={exportContacts}
                                    className="bg-gradient-to-r from-secondary to-secondary/90 text-secondary-foreground text-lg px-6 py-3"
                                >
                                    <Download className="w-5 h-5 mr-2" />
                                    Export CSV
                                </Button>
                            </div>
                        </motion.div>

                        {/* Loading State for Refresh */}
                        {refreshing ? (
                            <div className="flex items-center justify-center py-12">
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="text-center"
                                >
                                    <RefreshCw className="w-12 h-12 text-secondary animate-spin mx-auto mb-4" />
                                    <p className="text-lg font-crimson text-muted-foreground">Refreshing Contacts...</p>
                                </motion.div>
                            </div>
                        ) : (
                            <>
                                {/* Statistics Cards */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 }}
                                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8"
                                >
                                    <Card
                                        className="group premium-card cursor-pointer border-2 border-transparent hover:border-secondary/50 overflow-hidden hover:shadow-lg hover:shadow-secondary/30 hover:ring-2 hover:ring-secondary/30 relative transition-all duration-300 ease-out"
                                        style={{
                                            transform: hoveredCard === 'total-contacts' ? 'scale(1.05) rotateY(5deg)' : 'scale(1) rotateY(0deg)',
                                            transition: 'all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
                                        }}
                                        onMouseEnter={() => setHoveredCard('total-contacts')}
                                        onMouseLeave={() => setHoveredCard(null)}
                                    >
                                        <CardContent className="p-6">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-lg font-crimson text-muted-foreground">Total Contacts</p>
                                                    <p className="text-4xl font-playfair font-bold text-tertiary">
                                                        {stats?.overview.totalContacts || 0}
                                                    </p>
                                                </div>
                                                <Users className="w-8 h-8 text-secondary group-hover:scale-110 transition-all duration-300 ease-out" />
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card
                                        className="group premium-card cursor-pointer border-2 border-transparent hover:border-secondary/50 overflow-hidden hover:shadow-lg hover:shadow-secondary/30 hover:ring-2 hover:ring-secondary/30 relative transition-all duration-300 ease-out"
                                        style={{
                                            transform: hoveredCard === 'new-contacts' ? 'scale(1.05) rotateY(5deg)' : 'scale(1) rotateY(0deg)',
                                            transition: 'all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
                                        }}
                                        onMouseEnter={() => setHoveredCard('new-contacts')}
                                        onMouseLeave={() => setHoveredCard(null)}
                                    >
                                        <CardContent className="p-6">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-lg font-crimson text-muted-foreground">New Inquiries</p>
                                                    <p className="text-4xl font-playfair font-bold text-blue-600">
                                                        {stats?.overview.newContacts || 0}
                                                    </p>
                                                </div>
                                                <AlertCircle className="w-8 h-8 text-blue-500 group-hover:scale-110 transition-all duration-300 ease-out" />
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card
                                        className="group premium-card cursor-pointer border-2 border-transparent hover:border-secondary/50 overflow-hidden hover:shadow-lg hover:shadow-secondary/30 hover:ring-2 hover:ring-secondary/30 relative transition-all duration-300 ease-out"
                                        style={{
                                            transform: hoveredCard === 'in-progress' ? 'scale(1.05) rotateY(5deg)' : 'scale(1) rotateY(0deg)',
                                            transition: 'all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
                                        }}
                                        onMouseEnter={() => setHoveredCard('in-progress')}
                                        onMouseLeave={() => setHoveredCard(null)}
                                    >
                                        <CardContent className="p-6">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-lg font-crimson text-muted-foreground">In Progress</p>
                                                    <p className="text-4xl font-playfair font-bold text-orange-600">
                                                        {stats?.overview.inProgressContacts || 0}
                                                    </p>
                                                </div>
                                                <Clock className="w-8 h-8 text-orange-500 group-hover:scale-110 transition-all duration-300 ease-out" />
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card
                                        className="group premium-card cursor-pointer border-2 border-transparent hover:border-secondary/50 overflow-hidden hover:shadow-lg hover:shadow-secondary/30 hover:ring-2 hover:ring-secondary/30 relative transition-all duration-300 ease-out"
                                        style={{
                                            transform: hoveredCard === 'completed' ? 'scale(1.05) rotateY(5deg)' : 'scale(1) rotateY(0deg)',
                                            transition: 'all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
                                        }}
                                        onMouseEnter={() => setHoveredCard('completed')}
                                        onMouseLeave={() => setHoveredCard(null)}
                                    >
                                        <CardContent className="p-6">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-lg font-crimson text-muted-foreground">Completed</p>
                                                    <p className="text-4xl font-playfair font-bold text-green-600">
                                                        {stats?.overview.completedContacts || 0}
                                                    </p>
                                                </div>
                                                <CheckCircle className="w-8 h-8 text-green-500 group-hover:scale-110 transition-all duration-300 ease-out" />
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card
                                        className="group premium-card cursor-pointer border-2 border-transparent hover:border-secondary/50 overflow-hidden hover:shadow-lg hover:shadow-secondary/30 hover:ring-2 hover:ring-secondary/30 relative transition-all duration-300 ease-out"
                                        style={{
                                            transform: hoveredCard === 'contact-rate' ? 'scale(1.05) rotateY(5deg)' : 'scale(1) rotateY(0deg)',
                                            transition: 'all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
                                        }}
                                        onMouseEnter={() => setHoveredCard('contact-rate')}
                                        onMouseLeave={() => setHoveredCard(null)}
                                    >
                                        <CardContent className="p-6">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-lg font-crimson text-muted-foreground">Contact Rate</p>
                                                    <p className="text-4xl font-playfair font-bold text-secondary">
                                                        {stats?.overview.totalContacts ?
                                                            Math.round((stats.overview.contactedContacts / stats.overview.totalContacts) * 100) : 0}%
                                                    </p>
                                                </div>
                                                <TrendingUp className="w-8 h-8 text-secondary group-hover:scale-110 transition-all duration-300 ease-out" />
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>

                                {/* Service Statistics */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8"
                                >
                                    <Card
                                        className="group premium-card cursor-pointer border-2 border-transparent hover:border-tertiary/50 overflow-hidden hover:shadow-lg hover:shadow-tertiary/30 hover:ring-2 hover:ring-tertiary/30 relative transition-all duration-300 ease-out"
                                        style={{
                                            transform: hoveredCard === 'service-distribution' ? 'scale(1.05) rotateY(5deg)' : 'scale(1) rotateY(0deg)',
                                            transition: 'all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
                                        }}
                                        onMouseEnter={() => setHoveredCard('service-distribution')}
                                        onMouseLeave={() => setHoveredCard(null)}
                                    >
                                        <CardHeader>
                                            <CardTitle className="font-playfair text-2xl text-tertiary flex items-center">
                                                <PieChart className="w-6 h-6 mr-2 group-hover:scale-110 transition-all duration-300 ease-out" />
                                                Service Distribution
                                            </CardTitle>
                                            <p className="font-crimson text-base text-muted-foreground mt-2">
                                                Shows how many clients are interested in each financial service
                                            </p>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-6">
                                                {stats?.services && Object.entries(stats.services).map(([service, count]) => {
                                                    const countValue = count as number;
                                                    const percentage = stats.overview.totalContacts ? Math.round((countValue / stats.overview.totalContacts) * 100) : 0;

                                                    return (
                                                        <div key={service} className="space-y-2">
                                                            <div className="flex items-center justify-between">
                                                                <span className="font-crimson text-lg font-semibold text-tertiary">{service}</span>
                                                                <div className="flex items-center gap-2">
                                                                    <span className="font-crimson font-bold text-xl text-tertiary">
                                                                        {countValue}
                                                                    </span>
                                                                    <span className="font-crimson text-sm text-muted-foreground">
                                                                        ({percentage}%)
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            <div className="w-full bg-gray-200 rounded-full h-3">
                                                                <div
                                                                    className="bg-gradient-to-r from-secondary to-tertiary h-3 rounded-full transition-all duration-500"
                                                                    style={{
                                                                        width: `${percentage}%`
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card
                                        className="group premium-card cursor-pointer border-2 border-transparent hover:border-secondary/50 overflow-hidden hover:shadow-lg hover:shadow-secondary/30 hover:ring-2 hover:ring-secondary/30 relative transition-all duration-300 ease-out"
                                        style={{
                                            transform: hoveredCard === 'recent-activity' ? 'scale(1.05) rotateY(5deg)' : 'scale(1) rotateY(0deg)',
                                            transition: 'all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
                                        }}
                                        onMouseEnter={() => setHoveredCard('recent-activity')}
                                        onMouseLeave={() => setHoveredCard(null)}
                                    >
                                        <CardHeader>
                                            <CardTitle className="font-playfair text-2xl text-tertiary flex items-center">
                                                <Activity className="w-6 h-6 mr-2 group-hover:scale-110 transition-all duration-300 ease-out" />
                                                Recent Activity
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-3">
                                                {contacts.slice(0, 5).map((contact) => (
                                                    <div key={contact._id} className="flex items-center justify-between p-3 bg-gradient-to-r from-tertiary/5 to-champagne/10 rounded-lg">
                                                        <div>
                                                            <p className="font-crimson font-semibold text-lg text-tertiary">
                                                                {contact.firstName} {contact.lastName}
                                                            </p>
                                                            <p className="text-base text-muted-foreground">{contact.email}</p>
                                                        </div>
                                                        <Badge className={`${getStatusColor(contact.status)} border text-base px-3 py-1`}>
                                                            {contact.status.replace('_', ' ')}
                                                        </Badge>
                                                    </div>
                                                ))}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>

                                {/* Contacts Table */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                >
                                    <Card
                                        className="group premium-card cursor-pointer border-2 border-transparent hover:border-secondary/50 overflow-hidden hover:shadow-lg hover:shadow-secondary/30 hover:ring-2 hover:ring-secondary/30 relative transition-all duration-300 ease-out"
                                        style={{
                                            transform: hoveredCard === 'contact-management' ? 'scale(1.05) rotateY(5deg)' : 'scale(1) rotateY(0deg)',
                                            transition: 'all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
                                        }}
                                        onMouseEnter={() => setHoveredCard('contact-management')}
                                        onMouseLeave={() => setHoveredCard(null)}
                                    >
                                        <CardHeader>
                                            <div className="flex items-center justify-between">
                                                <CardTitle className="font-playfair text-2xl text-tertiary flex items-center">
                                                    <Users className="w-6 h-6 mr-2 group-hover:scale-110 transition-all duration-300 ease-out" />
                                                    Contact Management
                                                </CardTitle>
                                                <div className="flex items-center gap-4">
                                                    <div className="relative">
                                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                                        <Input
                                                            placeholder="Search contacts..."
                                                            value={searchTerm}
                                                            onChange={(e) => setSearchTerm(e.target.value)}
                                                            className="pl-10 w-64 border-tertiary/30 focus:ring-tertiary/30 text-lg"
                                                        />
                                                    </div>
                                                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                                                        <SelectTrigger className="w-40 border-tertiary/30 text-lg">
                                                            <SelectValue placeholder="Status" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="all">All Status</SelectItem>
                                                            <SelectItem value="new">New</SelectItem>
                                                            <SelectItem value="contacted">Contacted</SelectItem>
                                                            <SelectItem value="in_progress">In Progress</SelectItem>
                                                            <SelectItem value="completed">Completed</SelectItem>
                                                            <SelectItem value="closed">Closed</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <Select value={serviceFilter} onValueChange={setServiceFilter}>
                                                        <SelectTrigger className="w-40 border-tertiary/30 text-lg">
                                                            <SelectValue placeholder="Service" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="all">All Services</SelectItem>
                                                            <SelectItem value="Insurance">Insurance</SelectItem>
                                                            <SelectItem value="Mutual Funds">Mutual Funds</SelectItem>
                                                            <SelectItem value="Equity">Equity</SelectItem>
                                                            <SelectItem value="Fixed Income">Fixed Income</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <Select value={itemsPerPage.toString()} onValueChange={(value) => {
                                                        setItemsPerPage(parseInt(value));
                                                        setCurrentPage(1); // Reset to first page when changing limit
                                                    }}>
                                                        <SelectTrigger className="w-32 border-tertiary/30 text-lg">
                                                            <SelectValue placeholder="Limit" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="5">5 per page</SelectItem>
                                                            <SelectItem value="10">10 per page</SelectItem>
                                                            <SelectItem value="20">20 per page</SelectItem>
                                                            <SelectItem value="50">50 per page</SelectItem>
                                                            <SelectItem value="100">100 per page</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="overflow-x-auto">
                                                <table className="w-full">
                                                    <thead>
                                                        <tr className="border-b border-tertiary/20">
                                                            <th className="text-left py-3 px-4 font-crimson font-semibold text-lg text-tertiary">Name</th>
                                                            <th className="text-left py-3 px-4 font-crimson font-semibold text-lg text-tertiary">Email</th>
                                                            <th className="text-left py-3 px-4 font-crimson font-semibold text-lg text-tertiary">Services</th>
                                                            <th className="text-left py-3 px-4 font-crimson font-semibold text-lg text-tertiary">Status</th>
                                                            <th className="text-left py-3 px-4 font-crimson font-semibold text-lg text-tertiary">Date</th>
                                                            <th className="text-left py-3 px-4 font-crimson font-semibold text-lg text-tertiary">Actions</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {paginatedContacts.map((contact) => (
                                                            <motion.tr
                                                                key={contact._id}
                                                                initial={{ opacity: 0 }}
                                                                animate={{ opacity: 1 }}
                                                                className="border-b border-tertiary/10 hover:bg-gradient-to-r hover:from-tertiary/5 hover:to-champagne/10 transition-all duration-200"
                                                            >
                                                                <td className="py-4 px-4">
                                                                    <div>
                                                                        <p className="font-crimson font-semibold text-lg text-tertiary">
                                                                            {contact.firstName} {contact.lastName}
                                                                        </p>
                                                                    </div>
                                                                </td>
                                                                <td className="py-4 px-4">
                                                                    <p className="font-crimson text-lg text-muted-foreground">{contact.email}</p>
                                                                </td>
                                                                <td className="py-4 px-4">
                                                                    <div className="flex flex-wrap gap-1">
                                                                        {contact.services.map((service) => (
                                                                            <Badge key={service} variant="outline" className="text-base border-tertiary/30 text-tertiary px-2 py-1">
                                                                                {service}
                                                                            </Badge>
                                                                        ))}
                                                                    </div>
                                                                </td>
                                                                <td className="py-4 px-4">
                                                                    <Badge className={`${getStatusColor(contact.status)} border flex items-center gap-2 w-fit text-base px-3 py-1`}>
                                                                        {getStatusIcon(contact.status)}
                                                                        {contact.status.replace('_', ' ')}
                                                                    </Badge>
                                                                </td>
                                                                <td className="py-4 px-4">
                                                                    <p className="font-crimson text-lg text-muted-foreground">
                                                                        {formatDateIST(contact.createdAt, { dateOnly: true })}
                                                                    </p>
                                                                </td>
                                                                <td className="py-4 px-4">
                                                                    <div className="flex items-center gap-3">
                                                                        <Button
                                                                            size="sm"
                                                                            variant="outline"
                                                                            onClick={() => {
                                                                                setSelectedContact(contact);
                                                                                setShowContactModal(true);
                                                                            }}
                                                                            className="border-tertiary/30 text-tertiary text-base px-4 py-2"
                                                                        >
                                                                            <Eye className="w-4 h-4 mr-1" />
                                                                            View
                                                                        </Button>
                                                                        <Select
                                                                            value={contact.status}
                                                                            onValueChange={(value) => updateContactStatus(contact._id, value)}
                                                                        >
                                                                            <SelectTrigger className="w-36 h-10 text-base border-tertiary/30">
                                                                                <SelectValue />
                                                                            </SelectTrigger>
                                                                            <SelectContent>
                                                                                <SelectItem value="new">New</SelectItem>
                                                                                <SelectItem value="contacted">Contacted</SelectItem>
                                                                                <SelectItem value="in_progress">In Progress</SelectItem>
                                                                                <SelectItem value="completed">Completed</SelectItem>
                                                                                <SelectItem value="closed">Closed</SelectItem>
                                                                            </SelectContent>
                                                                        </Select>
                                                                    </div>
                                                                </td>
                                                            </motion.tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>

                                            {/* Pagination */}
                                            <div className="flex items-center justify-between mt-8 p-4 bg-gradient-to-r from-tertiary/5 to-champagne/10 rounded-lg border border-tertiary/20">
                                                <div className="flex items-center gap-4">
                                                    <p className="font-crimson text-lg text-muted-foreground">
                                                        Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredContacts.length)} of {filteredContacts.length} contacts
                                                    </p>
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-crimson text-base text-tertiary">Page:</span>
                                                        <Select value={currentPage.toString()} onValueChange={(value) => setCurrentPage(parseInt(value))}>
                                                            <SelectTrigger className="w-20 h-8 text-base border-tertiary/30">
                                                                <SelectValue />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {Array.from({ length: totalPages }, (_, i) => (
                                                                    <SelectItem key={i + 1} value={(i + 1).toString()}>
                                                                        {i + 1}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                        <span className="font-crimson text-base text-muted-foreground">of {totalPages}</span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <Button
                                                        variant="outline"
                                                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                                        disabled={currentPage === 1}
                                                        className="border-tertiary/30 text-tertiary text-base px-4 py-2"
                                                    >
                                                        Previous
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                                        disabled={currentPage === totalPages}
                                                        className="border-tertiary/30 text-tertiary text-base px-4 py-2"
                                                    >
                                                        Next
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            </>
                        )}
                    </TabsContent>

                    <TabsContent value="analytics">
                        <AnalyticsDashboard />
                    </TabsContent>

                    <TabsContent value="financial-health" className="space-y-8">
                        {/* Controls */}
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center justify-end"
                        >
                            <div className="flex items-center gap-4">
                                <Button
                                    type="button"
                                    onClick={refreshFinancialHealth}
                                    variant="outline"
                                    className="border-tertiary/30 text-tertiary text-lg px-6 py-3"
                                    disabled={fhRefreshing}
                                >
                                    <RefreshCw className={`w-5 h-5 mr-2 ${fhRefreshing ? 'animate-spin' : ''}`} />
                                    Refresh
                                </Button>
                            </div>
                        </motion.div>

                        {fhRefreshing ? (
                            <div className="flex items-center justify-center py-12">
                                <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
                                    <RefreshCw className="w-12 h-12 text-secondary animate-spin mx-auto mb-4" />
                                    <p className="text-lg font-crimson text-muted-foreground">Refreshing Assessments...</p>
                                </motion.div>
                            </div>
                        ) : (
                            <>
                                {/* Statistics Cards */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 }}
                                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8"
                                >
                                    <Card className="group premium-card cursor-pointer border-2 border-transparent hover:border-secondary/50 overflow-hidden hover:shadow-lg hover:shadow-secondary/30 hover:ring-2 hover:ring-secondary/30 relative transition-all duration-300 ease-out">
                                        <CardContent className="p-6">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-lg font-crimson text-muted-foreground">Total Assessments</p>
                                                    <p className="text-4xl font-playfair font-bold text-tertiary">
                                                        {fhStats?.overview.totalAssessments || 0}
                                                    </p>
                                                </div>
                                                <ClipboardCheck className="w-8 h-8 text-secondary" />
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card className="group premium-card cursor-pointer border-2 border-transparent hover:border-secondary/50 overflow-hidden hover:shadow-lg hover:shadow-secondary/30 hover:ring-2 hover:ring-secondary/30 relative transition-all duration-300 ease-out">
                                        <CardContent className="p-6">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-lg font-crimson text-muted-foreground">New</p>
                                                    <p className="text-4xl font-playfair font-bold text-blue-600">
                                                        {fhStats?.overview.newAssessments || 0}
                                                    </p>
                                                </div>
                                                <AlertCircle className="w-8 h-8 text-blue-500" />
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card className="group premium-card cursor-pointer border-2 border-transparent hover:border-secondary/50 overflow-hidden hover:shadow-lg hover:shadow-secondary/30 hover:ring-2 hover:ring-secondary/30 relative transition-all duration-300 ease-out">
                                        <CardContent className="p-6">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-lg font-crimson text-muted-foreground">Reviewed</p>
                                                    <p className="text-4xl font-playfair font-bold text-yellow-600">
                                                        {fhStats?.overview.reviewedAssessments || 0}
                                                    </p>
                                                </div>
                                                <Eye className="w-8 h-8 text-yellow-500" />
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card className="group premium-card cursor-pointer border-2 border-transparent hover:border-secondary/50 overflow-hidden hover:shadow-lg hover:shadow-secondary/30 hover:ring-2 hover:ring-secondary/30 relative transition-all duration-300 ease-out">
                                        <CardContent className="p-6">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-lg font-crimson text-muted-foreground">In Progress</p>
                                                    <p className="text-4xl font-playfair font-bold text-orange-600">
                                                        {fhStats?.overview.inProgressAssessments || 0}
                                                    </p>
                                                </div>
                                                <Clock className="w-8 h-8 text-orange-500" />
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card className="group premium-card cursor-pointer border-2 border-transparent hover:border-secondary/50 overflow-hidden hover:shadow-lg hover:shadow-secondary/30 hover:ring-2 hover:ring-secondary/30 relative transition-all duration-300 ease-out">
                                        <CardContent className="p-6">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-lg font-crimson text-muted-foreground">Completed</p>
                                                    <p className="text-4xl font-playfair font-bold text-green-600">
                                                        {fhStats?.overview.completedAssessments || 0}
                                                    </p>
                                                </div>
                                                <CheckCircle className="w-8 h-8 text-green-500" />
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>

                                {/* Assessments Table */}
                                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                                    <Card className="group premium-card border-2 border-transparent hover:border-secondary/50 overflow-hidden hover:shadow-lg hover:shadow-secondary/30 hover:ring-2 hover:ring-secondary/30 relative transition-all duration-300 ease-out">
                                        <CardHeader>
                                            <div className="flex items-center justify-between">
                                                <CardTitle className="font-playfair text-2xl text-tertiary flex items-center">
                                                    <ClipboardCheck className="w-6 h-6 mr-2" />
                                                    Financial Health Management
                                                </CardTitle>
                                                <div className="flex items-center gap-4">
                                                    <div className="relative">
                                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                                        <Input
                                                            placeholder="Search assessments..."
                                                            value={fhSearchTerm}
                                                            onChange={(e) => setFhSearchTerm(e.target.value)}
                                                            className="pl-10 w-64 border-tertiary/30 focus:ring-tertiary/30 text-lg"
                                                        />
                                                    </div>
                                                    <Select value={fhStatusFilter} onValueChange={(v) => { setFhStatusFilter(v); setFhCurrentPage(1); }}>
                                                        <SelectTrigger className="w-44 border-tertiary/30 text-lg">
                                                            <SelectValue placeholder="Status" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="all">All Status</SelectItem>
                                                            <SelectItem value="new">New</SelectItem>
                                                            <SelectItem value="reviewed">Reviewed</SelectItem>
                                                            <SelectItem value="in_progress">In Progress</SelectItem>
                                                            <SelectItem value="completed">Completed</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <Select value={fhOccupationFilter} onValueChange={(v) => { setFhOccupationFilter(v); setFhCurrentPage(1); }}>
                                                        <SelectTrigger className="w-52 border-tertiary/30 text-lg">
                                                            <SelectValue placeholder="Occupation" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="all">All Occupations</SelectItem>
                                                            {/* Match Financial Health form options (labels), but use backend-stored values for filtering */}
                                                            <SelectItem value="Employed">Salaried</SelectItem>
                                                            <SelectItem value="Self-Employed">Self-employed</SelectItem>
                                                            <SelectItem value="Self-Employed">Business Owner</SelectItem>
                                                            <SelectItem value="Retired">Retired</SelectItem>
                                                            <SelectItem value="Other">Other</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <Select value={fhItemsPerPage.toString()} onValueChange={(value) => {
                                                        setFhItemsPerPage(parseInt(value));
                                                        setFhCurrentPage(1);
                                                    }}>
                                                        <SelectTrigger className="w-32 border-tertiary/30 text-lg">
                                                            <SelectValue placeholder="Limit" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="5">5 per page</SelectItem>
                                                            <SelectItem value="10">10 per page</SelectItem>
                                                            <SelectItem value="20">20 per page</SelectItem>
                                                            <SelectItem value="50">50 per page</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="overflow-x-auto">
                                                <table className="w-full">
                                                    <thead>
                                                        <tr className="border-b border-tertiary/20">
                                                            <th className="text-left py-3 px-4 font-crimson font-semibold text-lg text-tertiary">Name</th>
                                                            <th className="text-left py-3 px-4 font-crimson font-semibold text-lg text-tertiary">Occupation</th>
                                                            <th className="text-left py-3 px-4 font-crimson font-semibold text-lg text-tertiary">Annual Income</th>
                                                            <th className="text-left py-3 px-4 font-crimson font-semibold text-lg text-tertiary">Status</th>
                                                            <th className="text-left py-3 px-4 font-crimson font-semibold text-lg text-tertiary">Date</th>
                                                            <th className="text-left py-3 px-4 font-crimson font-semibold text-lg text-tertiary">Actions</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {assessments.map((a) => (
                                                            <motion.tr
                                                                key={a._id}
                                                                initial={{ opacity: 0 }}
                                                                animate={{ opacity: 1 }}
                                                                className="border-b border-tertiary/10 hover:bg-gradient-to-r hover:from-tertiary/5 hover:to-champagne/10 transition-all duration-200"
                                                            >
                                                                <td className="py-4 px-4">
                                                                    <p className="font-crimson font-semibold text-lg text-tertiary">
                                                                        {a.firstName} {a.lastName}
                                                                    </p>
                                                                </td>
                                                                <td className="py-4 px-4">
                                                                    <p className="font-crimson text-lg text-muted-foreground">{formatOccupationStatus(a.occupationStatus)}</p>
                                                                </td>
                                                                <td className="py-4 px-4">
                                                                    <p className="font-crimson text-lg text-muted-foreground">{a.annualIncome || '-'}</p>
                                                                </td>
                                                                <td className="py-4 px-4">
                                                                    <Badge className={`${getStatusColor(a.status)} border flex items-center gap-2 w-fit text-base px-3 py-1`}>
                                                                        {getStatusIcon(a.status)}
                                                                        {a.status.replace('_', ' ')}
                                                                    </Badge>
                                                                </td>
                                                                <td className="py-4 px-4">
                                                                    <p className="font-crimson text-lg text-muted-foreground">{formatDateIST(a.createdAt, { dateOnly: true })}</p>
                                                                </td>
                                                                <td className="py-4 px-4">
                                                                    <div className="flex items-center gap-3">
                                                                        <Button
                                                                            size="sm"
                                                                            variant="outline"
                                                                            onClick={() => { setSelectedAssessment(a); setShowAssessmentModal(true); }}
                                                                            className="border-tertiary/30 text-tertiary text-base px-4 py-2"
                                                                        >
                                                                            <Eye className="w-4 h-4 mr-1" />
                                                                            View
                                                                        </Button>
                                                                        <Select
                                                                            value={a.status}
                                                                            onValueChange={async (value) => {
                                                                                try {
                                                                                    await financialHealthService.updateAssessment(a._id, { status: value as any });
                                                                                    await fetchAssessments();
                                                                                    await fetchFinancialHealthStats();
                                                                                } catch (e) {
                                                                                    console.error('Error updating assessment status:', e);
                                                                                }
                                                                            }}
                                                                        >
                                                                            <SelectTrigger className="w-36 h-10 text-base border-tertiary/30">
                                                                                <SelectValue />
                                                                            </SelectTrigger>
                                                                            <SelectContent>
                                                                                <SelectItem value="new">New</SelectItem>
                                                                                <SelectItem value="reviewed">Reviewed</SelectItem>
                                                                                <SelectItem value="in_progress">In Progress</SelectItem>
                                                                                <SelectItem value="completed">Completed</SelectItem>
                                                                            </SelectContent>
                                                                        </Select>
                                                                    </div>
                                                                </td>
                                                            </motion.tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>

                                            {/* Pagination (server-backed; we still show page controls) */}
                                            <div className="flex items-center justify-between mt-8 p-4 bg-gradient-to-r from-tertiary/5 to-champagne/10 rounded-lg border border-tertiary/20">
                                                <div className="flex items-center gap-4">
                                                    <p className="font-crimson text-lg text-muted-foreground">
                                                        Page {fhPagination?.currentPage ?? fhCurrentPage} of {fhPagination?.totalPages ?? 1}
                                                    </p>
                                                    {typeof fhPagination?.totalAssessments === "number" && (
                                                        <p className="font-crimson text-lg text-muted-foreground">
                                                            ({fhPagination.totalAssessments} total)
                                                        </p>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <Button
                                                        variant="outline"
                                                        onClick={() => setFhCurrentPage(prev => Math.max(prev - 1, 1))}
                                                        disabled={fhPagination ? !fhPagination.hasPrev : fhCurrentPage === 1}
                                                        className="border-tertiary/30 text-tertiary text-base px-4 py-2"
                                                    >
                                                        Previous
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        onClick={() => {
                                                            if (fhPagination && !fhPagination.hasNext) return;
                                                            setFhCurrentPage(prev => prev + 1);
                                                        }}
                                                        disabled={fhPagination ? !fhPagination.hasNext : false}
                                                        className="border-tertiary/30 text-tertiary text-base px-4 py-2"
                                                    >
                                                        Next
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            </>
                        )}
                    </TabsContent>
                </Tabs>
            </div>

            {/* Contact Detail Modal */}
            <AnimatePresence>
                {showContactModal && selectedContact && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setShowContactModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-4xl font-playfair font-bold text-tertiary">
                                        Contact Details
                                    </h2>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setShowContactModal(false)}
                                        className="border-tertiary/30 text-tertiary"
                                    >
                                        ×
                                    </Button>
                                </div>

                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-base font-crimson font-semibold text-tertiary mb-2">
                                                Full Name
                                            </label>
                                            <p className="font-crimson text-lg text-muted-foreground">
                                                {selectedContact.firstName} {selectedContact.lastName}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="block text-base font-crimson font-semibold text-tertiary mb-2">
                                                Email
                                            </label>
                                            <p className="font-crimson text-lg text-muted-foreground">
                                                {selectedContact.email}
                                            </p>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-base font-crimson font-semibold text-tertiary mb-2">
                                            Services Interested In
                                        </label>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedContact.services.map((service) => (
                                                <Badge key={service} variant="outline" className="border-tertiary/30 text-tertiary">
                                                    {service}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-base font-crimson font-semibold text-tertiary mb-2">
                                            Status
                                        </label>
                                        <Badge className={`${getStatusColor(selectedContact.status)} border flex items-center gap-1 w-fit`}>
                                            {getStatusIcon(selectedContact.status)}
                                            {selectedContact.status}
                                        </Badge>
                                    </div>

                                    {selectedContact.message && (
                                        <div>
                                            <label className="block text-base font-crimson font-semibold text-tertiary mb-2">
                                                Message
                                            </label>
                                            <div className="bg-gradient-to-r from-tertiary/5 to-champagne/10 p-4 rounded-lg">
                                                <p className="font-crimson text-lg text-muted-foreground">
                                                    {selectedContact.message}
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-base font-crimson font-semibold text-tertiary mb-2">
                                                Created At
                                            </label>
                                            <p className="font-crimson text-lg text-muted-foreground">
                                                {formatDateIST(selectedContact.createdAt)}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="block text-base font-crimson font-semibold text-tertiary mb-2">
                                                Last Updated
                                            </label>
                                            <p className="font-crimson text-lg text-muted-foreground">
                                                {formatDateIST(selectedContact.updatedAt)}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-end gap-4 mt-8">
                                    <Button
                                        variant="outline"
                                        onClick={() => setShowContactModal(false)}
                                        className="border-tertiary/30 text-tertiary"
                                    >
                                        Close
                                    </Button>
                                    <Button
                                        className="bg-gradient-to-r from-secondary to-secondary/90 text-secondary-foreground"
                                        onClick={() => sendEmailToContact(selectedContact)}
                                    >
                                        <Mail className="w-4 h-4 mr-2" />
                                        Send Email
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Financial Health Detail Modal */}
            <AnimatePresence>
                {showAssessmentModal && selectedAssessment && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setShowAssessmentModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-4xl font-playfair font-bold text-tertiary">Assessment Details</h2>
                                    <Button variant="outline" size="sm" onClick={() => setShowAssessmentModal(false)} className="border-tertiary/30 text-tertiary">×</Button>
                                </div>

                                <FinancialHealthAssessmentView
                                    assessment={selectedAssessment}
                                    getStatusColor={getStatusColor}
                                    getStatusIcon={getStatusIcon}
                                />

                                <div className="flex items-center justify-end gap-4 mt-8">
                                    <Button variant="outline" onClick={() => setShowAssessmentModal(false)} className="border-tertiary/30 text-tertiary">
                                        Close
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        onClick={async () => {
                                            try {
                                                await financialHealthService.deleteAssessment(selectedAssessment._id);
                                                setShowAssessmentModal(false);
                                                setSelectedAssessment(null);
                                                await refreshFinancialHealth();
                                            } catch (e) {
                                                console.error('Error deleting assessment:', e);
                                            }
                                        }}
                                    >
                                        <Trash2 className="w-4 h-4 mr-2" />
                                        Delete
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Dashboard;
