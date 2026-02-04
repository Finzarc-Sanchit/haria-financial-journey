import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Lock, Mail, LogIn } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { useNavigate } from 'react-router-dom';
import { login, LoginCredentials } from '../services/authService';
import PublicRoute from '../components/PublicRoute';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const credentials: LoginCredentials = { email, password };
            const response = await login(credentials);

            if (response.success && response.token) {
                localStorage.setItem('adminToken', response.token);
                navigate('/dashboard');
            } else {
                setError(response.message || 'Login failed');
            }
        } catch (error: any) {
            setError(error.message || 'Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <PublicRoute>
            <div className="min-h-screen bg-gradient-to-br from-champagne/20 via-white to-tertiary/10 flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-md"
                >
                    <Card className="premium-card shadow-floating border border-tertiary/20 bg-gradient-to-br from-tertiary/5 via-champagne/20 to-secondary/10 backdrop-blur-sm">
                        <CardHeader className="text-center pb-8">
                            <div className="mx-auto mb-6 w-20 h-20 bg-gradient-to-br from-secondary to-tertiary rounded-full flex items-center justify-center">
                                <LogIn className="w-10 h-10 text-white" />
                            </div>
                            <CardTitle className="font-playfair text-4xl text-tertiary mb-2">
                                Admin Login
                            </CardTitle>
                            <p className="font-crimson text-lg text-muted-foreground">
                                Access your contact management dashboard
                            </p>
                        </CardHeader>

                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm"
                                    >
                                        {error}
                                    </motion.div>
                                )}

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-base font-crimson font-semibold text-tertiary mb-2">
                                            Email Address
                                        </label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                            <Input
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                placeholder="Enter your email"
                                                className="pl-12 border-tertiary/30 focus:ring-tertiary/30 bg-white/90"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-base font-crimson font-semibold text-tertiary mb-2">
                                            Password
                                        </label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                            <Input
                                                type={showPassword ? 'text' : 'password'}
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                placeholder="Enter your password"
                                                className="pl-12 pr-12 border-tertiary/30 focus:ring-tertiary/30 bg-white/90"
                                                required
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-tertiary transition-colors"
                                            >
                                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-gradient-to-r from-secondary to-secondary/90 text-secondary-foreground hover:from-secondary/90 hover:to-secondary font-crimson font-semibold py-5 px-6 rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-secondary/60 focus:ring-offset-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-xl"
                                >
                                    {loading ? (
                                        <div className="flex items-center">
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                            Signing In...
                                        </div>
                                    ) : (
                                        <div className="flex items-center">
                                            <LogIn className="w-5 h-5 mr-2" />
                                            Sign In
                                        </div>
                                    )}
                                </Button>
                            </form>

                            <div className="mt-8 text-center">
                                <p className="text-base font-crimson text-muted-foreground">
                                    Secure access to Haria Investments admin panel
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </PublicRoute>
    );
};

export default Login;
