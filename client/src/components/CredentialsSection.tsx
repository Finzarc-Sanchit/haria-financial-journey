import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Award, GraduationCap, Shield, Users, Star, Building } from "lucide-react";
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useRef } from 'react';

const CredentialsSection = () => {
    useEffect(() => {
        AOS.init({ duration: 500, once: true });
    }, []);

    const certifications = [
        { name: 'CFA Charter', year: '2018', org: 'CFA Institute' },
        { name: 'CFP Certification', year: '2020', org: 'CFP Board' },
        { name: 'FRM Certification', year: '2019', org: 'GARP' },
    ];

    const education = [
        { degree: 'MBA Finance', institution: 'Mumbai University', year: '2015', honor: 'First Class Honors' },
        { degree: 'B.Com', institution: 'St. Xavier\'s College', year: '2013', honor: 'Distinction' }
    ];

    const recognition = [
        { title: 'Top Financial Advisor Mumbai 2023', org: 'Economic Times' },
        { title: 'Excellence in Client Service Award 2022', org: 'Financial Planning Magazine' },
        { title: 'Rising Star in Wealth Management 2021', org: 'Business Today' },
        { title: 'Ethical Advisor Recognition 2020', org: 'CFA Institute Mumbai' }
    ];

    return (
        <section id="credentials" className="py-20 bg-tertiary text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div data-aos="fade-in" className="text-center mb-16">
                    <h2 className="font-playfair text-4xl md:text-5xl font-bold mb-6">
                        Professional Credentials & Regulatory Compliance
                    </h2>
                    <div className="w-24 h-1 bg-secondary mx-auto"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Certifications */}
                    <Card data-aos="zoom-in" data-aos-delay="0" className="premium-card bg-white/10">
                        <CardHeader className="text-center">
                            <Award className="w-8 h-8 text-secondary mx-auto mb-4" />
                            <CardTitle className="font-playfair text-lg text-white">Certifications</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {certifications.map((cert, i) => (
                                <div key={i} className="mb-3">
                                    <Badge className="bg-secondary text-secondary-foreground badge-expand" data-aos="fade-up" data-aos-delay={i * 120} title={`${cert.name} - ${cert.org} (${cert.year})`}>
                                        {cert.name}
                                    </Badge>
                                    <div className="font-crimson text-sm text-white/70">{cert.org} - {cert.year}</div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                    {/* Education with animated progress bars */}
                    <Card data-aos="zoom-in" data-aos-delay="120" className="premium-card bg-white/10">
                        <CardHeader className="text-center">
                            <GraduationCap className="w-8 h-8 text-secondary mx-auto mb-4" />
                            <CardTitle className="font-playfair text-lg text-white">Education</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {education.map((edu, i) => (
                                <div key={i} className="mb-3">
                                    <div className="font-crimson font-semibold text-white text-base">{edu.degree}</div>
                                    <div className="font-crimson text-sm text-white/70">{edu.institution} - {edu.year}</div>
                                    <Badge variant="outline" className="text-sm border-secondary text-secondary badge-expand" data-aos="fade-up" data-aos-delay={i * 120 + 60} title={edu.honor}>{edu.honor}</Badge>
                                    {/* Animated progress bar */}
                                    <div className="w-full h-2 bg-white/20 rounded mt-2 overflow-hidden">
                                        <div className="bg-secondary h-2 rounded transition-all duration-700" style={{ width: `${80 + i * 10}%` }} data-aos="progress-bar" data-aos-delay={i * 120 + 100}></div>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                    {/* Compliance with glow and tooltip */}
                    <Card data-aos="zoom-in" data-aos-delay="240" className="premium-card bg-white/10 compliance-glow">
                        <CardHeader className="text-center">
                            <Shield className="w-8 h-8 text-secondary mx-auto mb-4 compliance-icon" aria-label="Regulatory Compliance" />
                            <CardTitle className="font-playfair text-lg text-white">Compliance</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col items-center gap-3 text-center mt-2">
                                <Badge className="bg-secondary text-secondary-foreground badge-expand" data-aos="fade-up" data-aos-delay="0" title="IRDA Licensed: Insurance Regulatory and Development Authority">IRDA Licensed</Badge>
                                <Badge className="bg-secondary text-secondary-foreground badge-expand" data-aos="fade-up" data-aos-delay="60" title="Fiduciary Duty: Legally bound to act in your best interest">Fiduciary Duty</Badge>
                                <Badge className="bg-secondary text-secondary-foreground badge-expand" data-aos="fade-up" data-aos-delay="120" title="₹5Cr Insurance: Professional indemnity coverage">₹5Cr Insurance</Badge>
                            </div>
                        </CardContent>
                    </Card>
                    {/* Recognition */}
                    <Card data-aos="zoom-in" data-aos-delay="360" className="premium-card bg-white/10">
                        <CardHeader className="text-center">
                            <Star className="w-8 h-8 text-secondary mx-auto mb-4" />
                            <CardTitle className="font-playfair text-lg text-white">Recognition</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {recognition.map((award, i) => (
                                <div key={i} className="mb-2">
                                    <div className="font-crimson text-sm text-secondary font-semibold badge-expand" data-aos="fade-up" data-aos-delay={i * 120} title={award.title + ' - ' + award.org}>{award.title}</div>
                                    <div className="font-crimson text-sm text-white/70">{award.org}</div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>
    );
};

export default CredentialsSection;