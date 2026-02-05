import { Features } from "./features";
import { Shield, TrendingUp, PiggyBank, BarChart3 } from "lucide-react";

export function FeaturesSection() {
  // Preserve all existing content exactly as it was
  const services = [
    {
      image: "/Commitment/General-insurance.jpg",
      title: "Life & General Insurance",
      description: "Comprehensive coverage for you and your family's financial security"
    },
    {
      image: "/Commitment/Mutual-funds.png",
      title: "Mutual Funds & Equity",
      description: "Strategic investment solutions for long-term wealth creation"
    },
    {
      image: "/Commitment/Fixed-income.jpg",
      title: "Fixed Income",
      description: "Stable returns through diversified fixed income instruments"
    },
    {
      image: "/Commitment/Commodity-market.png",
      title: "Commodity Derivative Trading",
      description: "Expert guidance in commodity markets and derivatives"
    }
  ];

  // Map services to Features component format with appropriate icons
  const features = services.map((service, index) => {
    // Assign icons based on service type
    let Icon = Shield; // default
    if (service.title.includes("Mutual Funds") || service.title.includes("Equity")) {
      Icon = TrendingUp;
    } else if (service.title.includes("Fixed Income")) {
      Icon = PiggyBank;
    } else if (service.title.includes("Commodity")) {
      Icon = BarChart3;
    } else if (service.title.includes("Insurance")) {
      Icon = Shield;
    }

    return {
      id: index + 1,
      icon: Icon,
      title: service.title,
      description: service.description,
      image: service.image,
    };
  });

  return (
    <section id="features" className="bg-gradient-to-br from-secondary/10 to-secondary/5">
      <Features
        features={features}
        primaryColor="secondary"
        progressGradientLight="bg-gradient-to-r from-secondary/80 to-secondary"
        progressGradientDark="bg-gradient-to-r from-secondary/70 to-secondary/90"
      />
    </section>
  );
}

