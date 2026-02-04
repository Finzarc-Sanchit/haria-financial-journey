import { MessageCircle } from "lucide-react";
import { motion } from "framer-motion";

const WhatsAppButton = () => {
    const phoneNumber = "917738686126"; // +91 77386 86126 without + and spaces
    const defaultMessage = "Hi, I would like to know more about your financial services.";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(defaultMessage)}`;

    return (
        <motion.a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-6 right-6 z-[9998] bg-[#25D366] hover:bg-[#20BA5A] text-white rounded-full p-4 shadow-2xl hover:shadow-3xl transition-all duration-300 flex items-center justify-center group"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ 
                type: "spring",
                stiffness: 260,
                damping: 20,
                delay: 0.5
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Contact us on WhatsApp"
        >
            <MessageCircle className="w-6 h-6" />
            <span className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-tertiary text-white text-xs font-crimson px-3 py-1.5 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                Chat with us
            </span>
        </motion.a>
    );
};

export default WhatsAppButton;

