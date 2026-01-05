import React, { useEffect } from "react";
import logo from "@/assets/logo.png";
import { MapPin, Phone, Mail, Award, Heart, Shield, Instagram, MessageCircle } from "lucide-react";
import AOS from 'aos';
import 'aos/dist/aos.css';
import { Link, useLocation } from 'react-router-dom';

const Footer = () => {
    const location = useLocation();

    useEffect(() => {
        AOS.init({ duration: 600, once: true });
    }, []);

    const handleServiceClick = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
        // Check if we're already on the target page
        if (location.pathname === path) {
            e.preventDefault();
            // Scroll to hero section (top of page)
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    return (
        <footer className="relative bg-gradient-to-br from-secondary/10 to-secondary/5 text-tertiary overflow-hidden">
            {/* Decorative Logo on Right Side */}
            <div className="absolute right-0 top-32 w-1/3 max-w-md opacity-5 pointer-events-none hidden lg:block">
                <img 
                    src="/logo-wbg.png" 
                    alt="Haria Investments Decorative Logo" 
                    className="w-full h-auto object-contain"
                />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
                {/* Top Section - Multi Column Layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-12">
                    {/* Quick Links */}
                    <div data-aos="fade-up" data-aos-delay="0">
                        <h4 className="font-playfair text-lg font-bold mb-4 text-tertiary uppercase tracking-wide">Quick Links</h4>
                        <ul className="font-crimson text-tertiary/70 space-y-2.5 text-base">
                            {[
                                { label: 'Motilal Oswal Demat Account', href: 'https://mosl.co/OWxY3P3cRN' },
                                { label: 'Motilal Oswal Login', href: 'https://invest.motilaloswal.com/' },
                                { label: 'Mutual Fund Login', href: 'https://users.madosx.co.in/pages/auth/login' },
                                { label: 'Check MF KYC', href: 'https://www.cvlkra.com/' },
                                { label: 'NSE India', href: 'https://www.nseindia.com/' },
                                { label: 'BSE India', href: 'https://www.bseindia.com/' },
                            ].map((item) => (
                                <li key={item.label}>
                                    <a href={item.href} target="_blank" rel="noopener noreferrer" className="hover:text-secondary transition-colors duration-300">
                                        {item.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Our Services */}
                    <div data-aos="fade-up" data-aos-delay="100">
                        <h4 className="font-playfair text-lg font-bold mb-4 text-tertiary uppercase tracking-wide">Our Services</h4>
                        <ul className="font-crimson text-tertiary/70 space-y-2.5 text-base">
                            {[
                                { label: 'Life Insurance', to: '/life-insurance' },
                                { label: 'General Insurance', to: '/general-insurance' },
                                { label: 'Mutual Funds', to: '/mutual-funds' },
                                { label: 'Equity Trading', to: '/equity-investment' },
                                { label: 'Fixed Income', to: '/fixed-income' },
                                { label: 'Commodity Trading', to: '/commodity-trading' },
                                { label: 'Gold & Silver', to: '/gold-silver' },
                                { label: 'Other Derivatives', to: '/other-derivatives' },
                                { label: 'Financial Health Form', to: '/financial-health-form' },
                            ].map((item) => (
                                <li key={item.label}>
                                    <Link 
                                        to={item.to} 
                                        onClick={(e) => handleServiceClick(e, item.to)}
                                        className="hover:text-secondary transition-colors duration-300"
                                    >
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Credentials */}
                    <div data-aos="fade-up" data-aos-delay="200">
                        <h4 className="font-playfair text-lg font-bold mb-4 text-tertiary uppercase tracking-wide">Credentials</h4>
                        <ul className="font-crimson text-tertiary/70 space-y-3 text-base">
                            <li className="flex items-start gap-2">
                                <Award className="w-4 h-4 text-secondary mt-0.5 flex-shrink-0" />
                                <span>AMFI Registered Mutual Fund Distributor</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <Shield className="w-4 h-4 text-secondary mt-0.5 flex-shrink-0" />
                                <span>Authorized Person of Motilal Oswal</span>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Us */}
                    <div data-aos="fade-up" data-aos-delay="300">
                        <h4 className="font-playfair text-lg font-bold mb-4 text-tertiary uppercase tracking-wide">Contact Us</h4>
                        <ul className="font-crimson text-tertiary/70 space-y-3 text-base">
                            <li className="flex items-start gap-2">
                                <MapPin className="w-4 h-4 text-secondary mt-1 flex-shrink-0" />
                                <div>
                                    <div className="text-sm leading-relaxed">
                                        1st Floor, Shree Krishna Niwas,<br />
                                        Above Panshikhar Sweets,<br />
                                        Matunga West, Mumbai – 400016
                                    </div>
                                </div>
                            </li>
                            <li className="flex items-center gap-2">
                                <Phone className="w-4 h-4 text-secondary flex-shrink-0" />
                                <a href="tel:+917738686126" className="hover:text-secondary transition-colors duration-200">+91 77386 86126</a>
                            </li>
                            <li className="flex items-center gap-2">
                                <Mail className="w-4 h-4 text-secondary flex-shrink-0" />
                                <a href="mailto:hariainvestments9@gmail.com" className="hover:text-secondary transition-colors duration-200 text-sm">hariainvestments9@gmail.com</a>
                            </li>
                        </ul>

                        {/* Social Icons */}
                        <div className="flex gap-3 mt-6">
                            <a 
                                href="https://www.instagram.com/hariainvestments/" 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                aria-label="Instagram" 
                                className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-white hover:bg-secondary/80 transition-all duration-300 hover:scale-110"
                            >
                                <Instagram className="w-5 h-5" />
                            </a>
                            <a 
                                href="https://api.whatsapp.com/send?phone=917738686126&text=Hi%20Haria%20Investments,%20I%20would%20like%20to%20know%20more%20about%20your%20services." 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                aria-label="WhatsApp" 
                                className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-white hover:bg-secondary/80 transition-all duration-300 hover:scale-110"
                            >
                                <MessageCircle className="w-5 h-5" />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Map Section */}
                <div className="border-t border-tertiary/20 pt-8 mt-8">
                    <h4 className="font-playfair text-lg font-bold mb-4 text-tertiary uppercase tracking-wide text-center">Visit Our Office</h4>
                    <div className="w-full h-64 md:h-80 rounded-lg overflow-hidden shadow-lg">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3771.8449!2d72.8438951!3d19.03122!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7ced3c1603025%3A0x4c0033b859f77a83!2sPanshikar%20Sweets!5e0!3m2!1sen!2sin!4v1704892800000!5m2!1sen!2sin"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen={true}
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Haria Investments Office Location"
                        ></iframe>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="border-t border-tertiary/20 pt-8 mt-8">
                    <div className="grid grid-cols-3 gap-1 sm:gap-2 md:gap-4">
                        {/* Logo */}
                        <div className="flex items-center justify-start gap-0.5 sm:gap-1 md:gap-3">
                            <img src={logo} alt="Haria Investments Logo" className="w-5 h-5 sm:w-6 sm:h-6 md:w-10 md:h-10 object-contain flex-shrink-0" />
                            <div className="min-w-0">
                                <div className="font-playfair font-bold text-[8px] sm:text-sm md:text-xl text-tertiary whitespace-nowrap">Haria Investments</div>
                                <div className="font-crimson text-[10px] sm:text-xs text-tertiary/60 hidden md:block">since 1957</div>
                            </div>
                        </div>

                        {/* Copyright (Center) */}
                        <div className="text-center flex items-center justify-center px-1">
                            <p className="font-crimson text-[8px] sm:text-xs md:text-sm text-tertiary/60 leading-tight whitespace-nowrap">
                                © Haria Investments, {new Date().getFullYear()}
                            </p>
                        </div>

                        {/* Credit (Right) */}
                        <div className="flex items-center justify-end">
                            <a 
                                href="https://finzarc.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-secondary transition-colors flex items-center gap-0.5 md:gap-1 font-crimson text-[8px] sm:text-xs md:text-sm text-tertiary/70 leading-tight whitespace-nowrap"
                            >
                                Made with <Heart className="w-1.5 h-1.5 md:w-3 md:h-3 fill-current flex-shrink-0" /> by Finzarc
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;