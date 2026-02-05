import { useEffect, useState } from "react";
import HeroSection from "@/components/HeroSection";
import { StatsSection } from "@/components/StatsSection";
import { FeaturesSection } from "@/components/ui/features-section";
import AboutSection from "@/components/AboutSection";
import ServicesSection from "@/components/ServicesSection";
import ProcessSection from "@/components/ProcessSection";
import CoreValues from "@/components/CoreValues";
import { TestimonialsSection } from "@/components/ui/testimonials-with-marquee";
import CTASection from "@/components/CTASection";

const testimonials = [
  {
    author: {
      name: "Heta Gogri",
      handle: "Practicing Chartered Accountant",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=faces",
    },
    text: "I've been doing SIPs with Haria Investments for about 3–4 years now, and the experience has been really positive throughout. The team is approachable, patient, and always ready to explain things clearly. They regularly review my portfolio, suggest changes when needed, and make sure my investments stay aligned with my goals. The returns have been good, and I genuinely feel my money is being handled with care and expertise. What I appreciate most is that they never push products — they focus on what's right for you. It's been a very comfortable and trustworthy relationship.",
  },
  {
    author: {
      name: "Ashley",
      handle: "Musician, Bangalore",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=faces",
    },
    text: "I heard about Haria investments through a common friend and I said to myself I definitely need to go pay them a visit. Being a small time business owner based in bangalore I took the first flight out that day and paid them a visit only to be greeted so warmly and professionally that I knew that this is surely the place that I would entrust my money in. Been approached by the so called best in the business by many companies things really didn't somehow narrow down for me with Investing but when I met mr. Rohan and when he began talking about the company, the approach, the attitude and keep things simple short sweet and to the point, it took me max of 45 mins that day before I signed up and even pumped in the money. It's been little over year now with mr Rohan and team and I'm so happy to be associated with them and I know that my money is in the best hands and I know I'll see my returns very soon and a big way. My SIP's are on point, timely updates and constant follow ups has just made this whole experience wonderful being from a different city altogether. I'm so glad to be associated with them and I don't hesitate whenever Rohan calls me and updates me and asks me I want to up the investment which I gladly agree to always. My wife too has now invested with Haria investors and if anyone reading this and is in two minds I highly suggest and recommend Haria investors and do get in touch with Rohan and he will gladly sort out your finances for you and you can sit back gladly and know that your money is in the best of hands. More power to you all. Keep doing what you doing. Many blessings.",
  },
  {
    author: {
      name: "Dilip and Vinayak Gursahaney",
      handle: "Mumbai",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=faces",
    },
    text: "Rohan and Raj have been outstanding in managing all my investments and insurance — SIPs, health policy, LIC, and even car insurance. They make the entire process seamless, transparent, and completely stress-free. Truly a team you can trust with your financial planning.",
  },
  {
    author: {
      name: "Nirav Bid",
      handle: "Investment Banker, Mumbai",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=faces",
    },
    text: "Haria Investments has been my financial guide for the last five years. Their team helped me build a balanced portfolio with mutual funds, bonds, and equity, and the results have been consistently rewarding. What I appreciate most is their transparency — they explain every step in simple terms. I feel truly secure about my financial future.",
  },
  {
    author: {
      name: "Haurdik and Urvi Agarwal",
      handle: "Chartered Accountants, Mumbai",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=faces",
    },
    text: "As new parents, planning for our child's future became our priority. Haria Investments designed a long-term financial roadmap for us — from SIPs in mutual funds to gold and traditional investment options. Their clarity and patience stood out. Today, we invest confidently every month because we trust their expertise.",
  },
];

const Index = () => {
  const [heroInView, setHeroInView] = useState(true);

  useEffect(() => {
    const hero = document.getElementById("hero");
    if (!hero) return;
    const observer = new window.IntersectionObserver(
      ([entry]) => setHeroInView(entry.isIntersecting),
      { threshold: 0.3 }
    );
    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen">
      <HeroSection />
      <StatsSection />
      <TestimonialsSection
        title="Trusted by 1500+ clients across India"
        description="Thoughtful financial planning and consistent execution for long-term wealth creation."
        testimonials={testimonials}
      />
      <div className="relative">
        {/* Features section - scrolls normally, then sticks when fully displayed */}
        <div className="sticky top-0 z-0 min-h-screen">
          <FeaturesSection />
          {/* Extra scroll space with same background so Features fully displays before About starts */}
          <div className="h-[80vh] bg-gradient-to-br from-secondary/10 to-secondary/5" aria-hidden="true" />
        </div>
        {/* About section - scrolls over Features from bottom, with slight delay */}
        <div className="relative z-10 -mt-[100vh]">
          <div className="h-[30vh]" aria-hidden="true" />
          <AboutSection />
        </div>
      </div>
      <CoreValues />
      <ServicesSection />
      <ProcessSection />
      <CTASection />
    </div>
  );
};

export default Index;
