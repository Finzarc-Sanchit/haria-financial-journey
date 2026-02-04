import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X } from "lucide-react";
import { motion, AnimatePresence } from 'framer-motion';
import { contactService, CreateContactData } from '../../services/contactService';
import { useToast } from '../../hooks/use-toast';
import ConfirmationModal from './ConfirmationModal';


function validate(field: string, value: string | string[]) {
    switch (field) {
        case 'firstName':
        case 'lastName':
            if (!value || (typeof value === 'string' && value.trim().length === 0)) return 'Required.';
            if (typeof value === 'string' && value.trim().length < 3) return 'Must be at least 3 characters.';
            return '';
        case 'email':
            if (!value || (typeof value === 'string' && value.trim().length === 0)) return 'Required.';
            if (typeof value === 'string' && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value)) return 'Invalid email.';
            return '';
        case 'message':
            // Message field is optional - no validation required
            return '';
        case 'services':
            if (!Array.isArray(value) || value.length === 0) return 'Select at least one.';
            return '';
        default:
            return '';
    }
}

interface ContactPopupProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    description?: string;
}

const ContactPopup: React.FC<ContactPopupProps> = ({
    isOpen,
    onClose,
    title = "Get Free Consultation",
    description = "We're here to help you take the next confident step in your financial journey."
}) => {
    const { toast } = useToast();
    const [formValues, setFormValues] = useState({
        firstName: '',
        lastName: '',
        email: '',
        message: '',
        services: [] as string[],
    });
    const [formErrors, setFormErrors] = useState({
        firstName: '',
        lastName: '',
        email: '',
        message: '',
        services: '',
    });
    const [touched, setTouched] = useState({
        firstName: false,
        lastName: false,
        email: false,
        message: false,
        services: false,
    });
    const [isFormValid, setIsFormValid] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const formRef = useRef<HTMLFormElement>(null);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [submittedFirstName, setSubmittedFirstName] = useState<string | null>(null);



    // Validate all fields and update errors
    useEffect(() => {
        const errors: any = {};
        Object.keys(formValues).forEach((field) => {
            errors[field] = validate(field, (formValues as any)[field]);
        });
        setFormErrors(errors);
        // Form is valid if all required fields are touched and all errors are empty
        // Message field is optional, so exclude it from touched requirement
        const requiredFields = ['firstName', 'lastName', 'email', 'services'];
        setIsFormValid(
            Object.values(errors).every((err) => !err) &&
            requiredFields.every((field) => touched[field])
        );
    }, [formValues, touched]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const target = e.target as HTMLInputElement;
        const { name, value, type } = target;
        setTouched((prev) => ({ ...prev, [name]: true }));
        if (type === 'checkbox') {
            setFormValues((prev) => {
                const arr = new Set(prev.services as string[]);
                if (target.checked) arr.add(value);
                else arr.delete(value);
                return { ...prev, services: Array.from(arr) };
            });
        } else {
            setFormValues((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name } = e.target;
        setTouched((prev) => ({ ...prev, [name]: true }));
    };

    const scrollToFirstError = () => {
        for (const field of Object.keys(formErrors)) {
            if (formErrors[field] && touched[field]) {
                const el = document.getElementsByName(field)[0];
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                break;
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setTouched({ firstName: true, lastName: true, email: true, message: true, services: true });
        if (!isFormValid) {
            scrollToFirstError();
            return;
        }
        setIsSubmitting(true);

        try {
            // Create contact using the service
            const contactData: CreateContactData = {
                firstName: formValues.firstName,
                lastName: formValues.lastName,
                email: formValues.email,
                services: formValues.services as string[],
                message: formValues.message || '',
            };

            await contactService.createContact(contactData);

            setSubmittedFirstName(formValues.firstName);
            setFormValues({ firstName: '', lastName: '', email: '', message: '', services: [] });
            setTouched({ firstName: false, lastName: false, email: false, message: false, services: false });
            setIsSubmitting(false);
            setShowConfirmation(true);
        } catch (error: any) {
            console.error('Error submitting contact form:', error);
            setIsSubmitting(false);

            toast({
                title: "Submission Failed",
                description: error.message || "There was an error submitting your form. Please try again.",
                variant: "destructive",
            });
        }
    };

    // Close on escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    onClick={(e) => {
                        if (e.target === e.currentTarget) {
                            onClose();
                        }
                    }}
                >
                    {/* Backdrop */}
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ duration: 0.3 }}
                        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                    >
                        <Card className="bg-gradient-to-br from-tertiary/5 via-champagne/20 to-secondary/10 shadow-xl border border-tertiary/20 rounded-xl backdrop-blur-sm">
                            {/* Header */}
                            <CardHeader className="relative p-6 border-b border-tertiary/20">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="absolute right-4 top-4 h-8 w-8 p-0 hover:bg-tertiary/10 rounded-lg"
                                    onClick={onClose}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                                <CardTitle className="font-playfair text-3xl font-bold text-tertiary mb-2 pr-8">
                                    {title}
                                </CardTitle>
                                <p className="font-crimson text-xl text-tertiary/80">
                                    {description}
                                </p>
                            </CardHeader>

                            <CardContent className="p-6">
                                {/* Contact Form */}
                                <form
                                    ref={formRef}
                                    className="flex flex-col gap-4"
                                    autoComplete="off"
                                    noValidate
                                    onSubmit={handleSubmit}
                                >
                                    {/* Name fields */}
                                    <div className="flex flex-col md:flex-row gap-4">
                                        <div className="flex-1">
                                            <label htmlFor="firstName" className="block text-base font-semibold text-tertiary mb-2">First Name <span className="text-red-500">*</span></label>
                                            <input id="firstName" name="firstName" type="text" required className={`w-full rounded-lg border-2 ${touched.firstName && formErrors.firstName ? 'border-red-500 bg-red-50' : 'border-tertiary/30 bg-white/90 hover:border-tertiary/50'} px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-tertiary/30 focus:border-tertiary transition-all duration-200 shadow-sm`} autoComplete="given-name" value={formValues.firstName} onChange={handleInputChange} onBlur={handleBlur} />
                                            {touched.firstName && formErrors.firstName && <div className="text-red-500 text-sm mt-1">{formErrors.firstName}</div>}
                                        </div>
                                        <div className="flex-1">
                                            <label htmlFor="lastName" className="block text-base font-semibold text-tertiary mb-2">Last Name <span className="text-red-500">*</span></label>
                                            <input id="lastName" name="lastName" type="text" required className={`w-full rounded-lg border-2 ${touched.lastName && formErrors.lastName ? 'border-red-500 bg-red-50' : 'border-tertiary/30 bg-white/90 hover:border-tertiary/50'} px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-tertiary/30 focus:border-tertiary transition-all duration-200 shadow-sm`} autoComplete="family-name" value={formValues.lastName} onChange={handleInputChange} onBlur={handleBlur} />
                                            {touched.lastName && formErrors.lastName && <div className="text-red-500 text-sm mt-1">{formErrors.lastName}</div>}
                                        </div>
                                    </div>

                                    {/* Email */}
                                    <div>
                                        <label htmlFor="email" className="block text-base font-semibold text-tertiary mb-2">Email <span className="text-red-500">*</span></label>
                                        <input id="email" name="email" type="email" required className={`w-full rounded-lg border-2 ${touched.email && formErrors.email ? 'border-red-500 bg-red-50' : 'border-tertiary/30 bg-white/90 hover:border-tertiary/50'} px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-tertiary/30 focus:border-tertiary transition-all duration-200 shadow-sm`} autoComplete="email" value={formValues.email} onChange={handleInputChange} onBlur={handleBlur} />
                                        {touched.email && formErrors.email && <div className="text-red-500 text-sm mt-1">{formErrors.email}</div>}
                                    </div>

                                    {/* Services checkboxes */}
                                    <div>
                                        <label className="block text-base font-semibold text-tertiary mb-3">Services <span className="text-red-500">*</span></label>
                                        <div className="grid grid-cols-2 gap-3">
                                            <label className="inline-flex items-center gap-3 text-base text-tertiary font-medium hover:text-tertiary/80 transition-colors duration-200 cursor-pointer">
                                                <input type="checkbox" name="services" value="Insurance" className="accent-tertiary w-5 h-5 rounded border-2 border-tertiary/30 focus:ring-2 focus:ring-tertiary/30 focus:border-tertiary transition-all duration-200" checked={formValues.services.includes('Insurance')} onChange={handleInputChange} onBlur={handleBlur} /> Insurance
                                            </label>
                                            <label className="inline-flex items-center gap-3 text-base text-tertiary font-medium hover:text-tertiary/80 transition-colors duration-200 cursor-pointer">
                                                <input type="checkbox" name="services" value="Mutual Funds" className="accent-tertiary w-5 h-5 rounded border-2 border-tertiary/30 focus:ring-2 focus:ring-tertiary/30 focus:border-tertiary transition-all duration-200" checked={formValues.services.includes('Mutual Funds')} onChange={handleInputChange} onBlur={handleBlur} /> Mutual Funds
                                            </label>
                                            <label className="inline-flex items-center gap-3 text-base text-tertiary font-medium hover:text-tertiary/80 transition-colors duration-200 cursor-pointer">
                                                <input type="checkbox" name="services" value="Equity" className="accent-tertiary w-5 h-5 rounded border-2 border-tertiary/30 focus:ring-2 focus:ring-tertiary/30 focus:border-tertiary transition-all duration-200" checked={formValues.services.includes('Equity')} onChange={handleInputChange} onBlur={handleBlur} /> Equity
                                            </label>
                                            <label className="inline-flex items-center gap-3 text-base text-tertiary font-medium hover:text-tertiary/80 transition-colors duration-200 cursor-pointer">
                                                <input type="checkbox" name="services" value="Fixed Income" className="accent-tertiary w-5 h-5 rounded border-2 border-tertiary/30 focus:ring-2 focus:ring-tertiary/30 focus:border-tertiary transition-all duration-200" checked={formValues.services.includes('Fixed Income')} onChange={handleInputChange} onBlur={handleBlur} /> Fixed Income
                                            </label>
                                        </div>
                                        {touched.services && formErrors.services && <div className="text-red-500 text-sm mt-1">{formErrors.services}</div>}
                                    </div>

                                    {/* Message */}
                                    <div>
                                        <label htmlFor="message" className="block text-base font-semibold text-tertiary mb-2">Message (Optional)</label>
                                        <textarea id="message" name="message" rows={3} className={`w-full rounded-lg border-2 ${touched.message && formErrors.message ? 'border-red-500 bg-red-50' : 'border-tertiary/30 bg-white/90 hover:border-tertiary/50'} px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-tertiary/30 focus:border-tertiary transition-all duration-200 shadow-sm resize-none`} value={formValues.message} onChange={handleInputChange} onBlur={handleBlur} />
                                    </div>

                                    {/* Submit Button */}
                                    <Button
                                        type="submit"
                                        className="w-full bg-gradient-to-r from-secondary to-secondary/90 text-secondary-foreground hover:from-secondary/90 hover:to-secondary font-crimson font-semibold py-4 px-6 rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-secondary/60 focus:ring-offset-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-lg"
                                        disabled={isSubmitting || !isFormValid}
                                    >
                                        {isSubmitting ? 'Submitting...' : 'Submit'}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </motion.div>
                </motion.div>
            )}
            {/* Confirmation Modal */}
            <ConfirmationModal
                isOpen={showConfirmation}
                onClose={() => {
                    setShowConfirmation(false);
                    onClose(); // Close the popup after confirmation modal closes
                }}
                firstName={submittedFirstName}
            />
        </AnimatePresence>


    );
};

export default ContactPopup;
