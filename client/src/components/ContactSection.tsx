import { Button } from "@/components/ui/button";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import ConfirmationModal from './ui/ConfirmationModal';
import { contactService, CreateContactData } from '../services/contactService';
import { useToast } from '../hooks/use-toast';

function isMobile() {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < 768;
}


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
      // Message field is now optional - no validation required
      return '';
    case 'services':
      if (!Array.isArray(value) || value.length === 0) return 'Select at least one.';
      return '';
    default:
      return '';
  }
}

const ContactSection = () => {
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
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [submittedFirstName, setSubmittedFirstName] = useState<string | null>(null);

  // Initialize EmailJS



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

  // In handleInputChange, set touched to true on first change
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
    // Mark all as touched
    setTouched({ firstName: true, lastName: true, email: true, message: true, services: true });
    // If not valid, scroll to first error
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
      setFormSubmitted(true);
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

  useEffect(() => {
    const offset = isMobile() ? 120 : 40;
    AOS.init({ duration: 500, once: true, offset });
  }, []);


  return (
    <section id="contact" className="pt-4 bg-tertiary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left Side - Contact Info */}
          <div data-aos="fade-up" className="space-y-8">
            {/* Main Heading */}
            <div className="space-y-4">
              <h1 className="font-playfair text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                Let's Connect
              </h1>
              <p className="font-crimson text-base md:text-lg text-white/80 leading-relaxed max-w-xl">
                We're here to help you take the next confident step in your financial journey. Reach out for a complimentary consultation or visit us in person.
              </p>
            </div>

            {/* Contact Details Section */}
            <div className="space-y-6 pt-8">
              <h2 className="font-playfair text-2xl md:text-3xl font-bold text-white">
                Contact Details
              </h2>
              
              <div className="space-y-4">
                {/* Phone */}
                <div className="flex items-start gap-3">
                  <span className="font-crimson text-white/90 text-lg">•</span>
                  <div>
                    <span className="font-crimson font-semibold text-white text-lg">Phone: </span>
                    <a
                      href="tel:+917738686126"
                      className="font-crimson text-white/90 text-lg hover:text-secondary transition-colors underline"
                    >
                      +91 77386 86126
                    </a>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-3">
                  <span className="font-crimson text-white/90 text-lg">•</span>
                  <div>
                    <span className="font-crimson font-semibold text-white text-lg">Email: </span>
                    <a
                      href="mailto:hariainvestments9@gmail.com"
                      className="font-crimson text-white/90 text-lg hover:text-secondary transition-colors underline"
                    >
                      hariainvestments9@gmail.com
                    </a>
                  </div>
                </div>

                {/* Address */}
                <div className="flex items-start gap-3">
                  <span className="font-crimson text-white/90 text-lg">•</span>
                  <div>
                    <span className="font-crimson font-semibold text-white text-lg">Address: </span>
                    <span className="font-crimson text-white/90 text-lg">
                      1st Floor, Shree Krishna Niwas, Above Panshikhar Sweets, Opposite Ajay Shopping Centre, T.H.Kataria Marg, Matunga West, Mumbai – 400016
                    </span>
                  </div>
                </div>

                {/* Office Hours */}
                <div className="flex items-start gap-3">
                  <span className="font-crimson text-white/90 text-lg">•</span>
                  <div>
                    <span className="font-crimson font-semibold text-white text-lg">Office Hours: </span>
                    <span className="font-crimson text-white/90 text-lg">
                      Monday-Friday: 9:00 AM - 7:00 PM, Saturday: 11:00 AM - 6:00 PM
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Right Side - Contact Form */}
          <div data-aos="fade-up" data-aos-delay="200" className="bg-white/5 backdrop-blur-sm border-2 border-white/20 rounded-2xl p-6 md:p-8">
              {/* Always show the form, even when confirmation is showing */}
              <form
                ref={formRef}
                className="flex flex-col gap-6 relative"
                autoComplete="off"
                noValidate
                onSubmit={handleSubmit}
              >
                {/* Name fields */}
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <label htmlFor="firstName" className="block font-crimson text-white mb-2 text-base font-medium">First Name</label>
                    <input 
                      id="firstName" 
                      name="firstName" 
                      type="text" 
                      required 
                      placeholder="First Name"
                      className={`w-full rounded-lg border ${touched.firstName && formErrors.firstName ? 'border-red-500' : 'border-white/30'} bg-white/10 text-white placeholder:text-white/50 px-4 py-3 font-crimson text-base focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary transition-all duration-200`} 
                      autoComplete="given-name" 
                      value={formValues.firstName} 
                      onChange={handleInputChange} 
                      onBlur={handleBlur} 
                    />
                    {touched.firstName && formErrors.firstName && <div className="text-red-400 text-sm mt-1">{formErrors.firstName}</div>}
                  </div>
                  <div className="flex-1">
                    <label htmlFor="lastName" className="block font-crimson text-white mb-2 text-base font-medium">Last Name</label>
                    <input 
                      id="lastName" 
                      name="lastName" 
                      type="text" 
                      required 
                      placeholder="Last Name"
                      className={`w-full rounded-lg border ${touched.lastName && formErrors.lastName ? 'border-red-500' : 'border-white/30'} bg-white/10 text-white placeholder:text-white/50 px-4 py-3 font-crimson text-base focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary transition-all duration-200`} 
                      autoComplete="family-name" 
                      value={formValues.lastName} 
                      onChange={handleInputChange} 
                      onBlur={handleBlur} 
                    />
                    {touched.lastName && formErrors.lastName && <div className="text-red-400 text-sm mt-1">{formErrors.lastName}</div>}
                  </div>
                </div>
                {/* Email */}
                <div>
                  <label htmlFor="email" className="block font-crimson text-white mb-2 text-base font-medium">Email</label>
                  <input 
                    id="email" 
                    name="email" 
                    type="email" 
                    required 
                    placeholder="Email"
                    className={`w-full rounded-lg border ${touched.email && formErrors.email ? 'border-red-500' : 'border-white/30'} bg-white/10 text-white placeholder:text-white/50 px-4 py-3 font-crimson text-base focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary transition-all duration-200`} 
                    autoComplete="email" 
                    value={formValues.email} 
                    onChange={handleInputChange} 
                    onBlur={handleBlur} 
                  />
                  {touched.email && formErrors.email && <div className="text-red-400 text-sm mt-1">{formErrors.email}</div>}
                </div>
                {/* Services checkboxes */}
                <div>
                  <label className="block font-crimson text-white mb-2 text-base font-medium">Which services are you looking for? <span className="text-red-400">*</span></label>
                  <div className="flex flex-wrap gap-4">
                    <label className="inline-flex items-center gap-2 font-crimson text-white/90 text-sm font-medium hover:text-white transition-colors duration-200 cursor-pointer">
                      <input type="checkbox" name="services" value="Insurance" className="accent-secondary w-4 h-4 rounded border border-white/30 focus:ring-2 focus:ring-secondary/50 transition-all duration-200" checked={formValues.services.includes('Insurance')} onChange={handleInputChange} onBlur={handleBlur} /> Insurance
                    </label>
                    <label className="inline-flex items-center gap-2 font-crimson text-white/90 text-sm font-medium hover:text-white transition-colors duration-200 cursor-pointer">
                      <input type="checkbox" name="services" value="Mutual Funds" className="accent-secondary w-4 h-4 rounded border border-white/30 focus:ring-2 focus:ring-secondary/50 transition-all duration-200" checked={formValues.services.includes('Mutual Funds')} onChange={handleInputChange} onBlur={handleBlur} /> Mutual Funds
                    </label>
                    <label className="inline-flex items-center gap-2 font-crimson text-white/90 text-sm font-medium hover:text-white transition-colors duration-200 cursor-pointer">
                      <input type="checkbox" name="services" value="Equity" className="accent-secondary w-4 h-4 rounded border border-white/30 focus:ring-2 focus:ring-secondary/50 transition-all duration-200" checked={formValues.services.includes('Equity')} onChange={handleInputChange} onBlur={handleBlur} /> Equity
                    </label>
                    <label className="inline-flex items-center gap-2 font-crimson text-white/90 text-sm font-medium hover:text-white transition-colors duration-200 cursor-pointer">
                      <input type="checkbox" name="services" value="Fixed Income" className="accent-secondary w-4 h-4 rounded border border-white/30 focus:ring-2 focus:ring-secondary/50 transition-all duration-200" checked={formValues.services.includes('Fixed Income')} onChange={handleInputChange} onBlur={handleBlur} /> Fixed Income
                    </label>
                  </div>
                  {touched.services && formErrors.services && <div className="text-red-400 text-sm mt-1">{formErrors.services}</div>}
                </div>
                {/* Comment/Message */}
                <div>
                  <label htmlFor="message" className="block font-crimson text-white mb-2 text-base font-medium">Comment or Message</label>
                  <textarea 
                    id="message" 
                    name="message" 
                    rows={4} 
                    placeholder="Type your message here..."
                    className={`w-full rounded-lg border ${touched.message && formErrors.message ? 'border-red-500' : 'border-white/30'} bg-white/10 text-white placeholder:text-white/50 px-4 py-3 font-crimson text-base focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary transition-all duration-200 resize-none`} 
                    value={formValues.message} 
                    onChange={handleInputChange} 
                    onBlur={handleBlur} 
                  />
                  {touched.message && formErrors.message && <div className="text-red-400 text-sm mt-1">{formErrors.message}</div>}
                </div>
                {/* Submit Button */}
                <div className="pt-2">
                  <Button
                    asChild
                    className="w-full bg-white hover:bg-white/90 text-tertiary font-crimson font-semibold px-6 py-3 text-base transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 shadow-lg hover:shadow-xl rounded-xl"
                    disabled={isSubmitting || !isFormValid}
                  >
                    <motion.button
                      type="submit"
                      whileTap={{ scale: 0.97 }}
                      animate={isSubmitting ? { scale: [1, 1.05, 1] } : {}}
                      transition={{ duration: 0.5, repeat: isSubmitting ? Infinity : 0, repeatType: 'reverse' }}
                      style={{ width: '100%' }}
                    >
                      {isSubmitting ? (
                        <span className="flex items-center justify-center gap-2">
                          <span className="animate-spin rounded-full border-2 border-tertiary/30 border-t-2 border-t-tertiary h-5 w-5 mr-2"></span>
                          Submitting…
                        </span>
                      ) : 'Submit'}
                    </motion.button>
                  </Button>
                </div>
              </form>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={showConfirmation}
        onClose={() => {
          setShowConfirmation(false);
          setTimeout(() => {
            setFormSubmitted(false);
          }, 400);
        }}
        firstName={submittedFirstName}
      />
    </section>
  );
};

export default ContactSection;