import { ArrowRight, ClipboardCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CTASection = () => {
  const navigate = useNavigate();

  return (
    <section 
      className="relative w-full py-24 md:py-32 overflow-hidden"
      style={{
        backgroundImage: "url('/schedule-meeting.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat"
      }}
    >
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-tertiary/80"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-3xl mx-auto space-y-8">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold font-playfair text-white leading-tight">
            Ready to Start Your Financial Journey?
          </h2>
          <p className="text-lg md:text-xl font-crimson text-white/90 leading-relaxed">
            Let's discuss your financial goals and create a personalized strategy for your success.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => navigate('/contact')}
              className="bg-secondary hover:bg-secondary/90 text-white px-8 py-4 rounded-full font-semibold font-crimson transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              <span>Schedule Consultation</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigate('/financial-health-form')}
              className="bg-tertiary hover:bg-tertiary/90 text-white px-8 py-4 rounded-full font-semibold font-crimson transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 border-2 border-white/30"
            >
              <ClipboardCheck className="w-4 h-4" />
              <span>Financial Health Check</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;

