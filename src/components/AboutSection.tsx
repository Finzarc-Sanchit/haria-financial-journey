import { useEffect } from 'react';
import { Badge } from "@/components/ui/badge";
import { Award, Building2, Star, Target, Eye, Heart } from "lucide-react";
import amritlalDevjiHaria from "@/assets/Amritlal-Haria.jpg";
import anilAmritlalHaria from "@/assets/Anil-Haria.jpg";
import rohanHaria from "@/assets/Rohan-Haria.jpg";
import rajHaria from "@/assets/Raj-Haria.jpg";
import meetSavla from "@/assets/Meet-Savla.jpg";
import AOS from 'aos';
import 'aos/dist/aos.css';

const AboutSection = () => {
  useEffect(() => {
    AOS.init({ duration: 500, once: true });
  }, []);

  return (
    <section id="about" className="py-20 bg-tertiary text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header - Matching website style */}
        <div data-aos="fade-up" className="text-center mb-16">
          <p className="text-sm font-crimson text-white/60 uppercase tracking-wider mb-4">
            OUR STORY
          </p>
          <h2 className="font-playfair text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            About Us
          </h2>
          <div className="w-24 h-1 bg-secondary mx-auto"></div>
        </div>

        {/* Block 1: Grandfather - Amritlal Devji Haria */}
        <div data-aos="fade-up" data-aos-delay="100" className="mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <img
                src={amritlalDevjiHaria}
                alt="Amritlal Devji Haria"
                className="w-80 h-96 sm:w-96 sm:h-112 md:w-112 md:h-128 object-cover object-top mx-auto rounded-lg shadow-floating"
                data-aos="fade-right"
                data-aos-delay="100"
              />
            </div>
            <div className="order-1 lg:order-2">
              <div className="flex items-center mb-6">
                <Building2 className="w-6 h-6 text-secondary mr-3" />
                <h3 className="font-playfair text-2xl font-semibold">Amritlal Devji Haria</h3>
              </div>
              <p className="font-crimson text-xl leading-relaxed mb-6 text-white/90">
                Our journey began with Late Shri <strong>Amritlal Devji Haria</strong>. Being a graduate, he joined LIC right from its inception. Over the decades, he dedicated his entire career to serving people through insurance, retiring as a Development Officer and later continuing as an agent. His unwavering commitment touched the lives of thousands of families, laying a strong foundation for the generations to come.
              </p>
            </div>
          </div>
        </div>

        {/* Block 2: Father - Anil Amritlal Haria */}
        <div data-aos="fade-up" data-aos-delay="200" className="mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-1 lg:order-1">
              <div className="flex items-center mb-6">
                <Building2 className="w-6 h-6 text-secondary mr-3" />
                <h3 className="font-playfair text-2xl font-semibold">Anil Amritlal Haria</h3>
              </div>
              <p className="font-crimson text-xl leading-relaxed mb-6 text-white/90">
                Carrying this legacy forward, Mr. <strong>Anil Amritlal Haria</strong> embraced entrepreneurship early on. After beginning his career in the textile business, he chose to dedicate himself fully to the insurance profession to honor his father's vision. He expanded the family business beyond life insurance into health insurance and broader financial solutions, ensuring that our services evolved with the needs of our clients.
              </p>
            </div>
            <div className="order-2 lg:order-2">
              <img
                src={anilAmritlalHaria}
                alt="Anil Amritlal Haria"
                className="w-80 h-96 sm:w-96 sm:h-112 md:w-112 md:h-128 object-cover object-top mx-auto rounded-lg shadow-floating"
                data-aos="fade-left"
                data-aos-delay="200"
              />
            </div>
          </div>
        </div>

        {/* Block 3: Rohan Haria */}
        <div data-aos="fade-up" data-aos-delay="300" className="mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <img
                src={rohanHaria}
                alt="Rohan Haria"
                className="w-80 h-96 sm:w-96 sm:h-112 md:w-112 md:h-128 object-cover object-top mx-auto rounded-lg shadow-floating"
                data-aos="fade-right"
                data-aos-delay="300"
              />
            </div>
            <div className="order-1 lg:order-2">
              <div className="flex items-center mb-6">
                <Award className="w-6 h-6 text-secondary mr-3" />
                <h3 className="font-playfair text-2xl font-semibold">Rohan Haria</h3>
              </div>
              <p className="font-crimson text-xl leading-relaxed mb-6 text-white/90">
                A Chartered Accountant with 6 years of specialised experience in the financial services sector, having worked with two of India's most respected firms. During this time, he has developed deep expertise in auditing leading financial institutions, with a particular focus on mutual fund audits.
              </p>
              <p className="font-crimson text-xl leading-relaxed mb-6 text-white/90">
                This experience gave more than just technical knowledge—it provided a rare, behind-the-scenes understanding of how the investment ecosystem truly operates. From regulatory compliance to operational excellence, he has seen firsthand what it takes to protect and grow investor wealth.
              </p>
              <p className="font-crimson text-xl leading-relaxed mb-6 text-white/90">
                Today, he combines this professional insight with a client-first approach, offering advice that is transparent, precise, and driven by integrity.
              </p>
              <Badge className="bg-secondary text-secondary-foreground">
                Chartered Accountant
              </Badge>
            </div>
          </div>
        </div>

        {/* Block 4: Raj Haria */}
        <div data-aos="fade-up" data-aos-delay="400" className="mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-1 lg:order-1">
              <div className="flex items-center mb-6">
                <Award className="w-6 h-6 text-secondary mr-3" />
                <h3 className="font-playfair text-2xl font-semibold">Raj Haria</h3>
              </div>
              <p className="font-crimson text-xl leading-relaxed mb-6 text-white/90">
                Raj Haria, an MBA graduate from NMIMS, has been carrying forward his grandfather's legacy. Since 2015, he has expanded into mutual fund business while building strong expertise in life and general insurance. With a focus on trust and long term growth, he help clients achieve their financial goals one after the other.
              </p>
              <Badge className="bg-secondary text-secondary-foreground">
                MBA – NMIMS
              </Badge>
            </div>
            <div className="order-2 lg:order-2">
              <img
                src={rajHaria}
                alt="Raj Haria"
                className="w-80 h-96 sm:w-96 sm:h-112 md:w-112 md:h-128 object-cover object-top mx-auto rounded-lg shadow-floating"
                data-aos="fade-left"
                data-aos-delay="400"
              />
            </div>
          </div>
        </div>

        {/* Block 5: Meet Savla */}
        <div data-aos="fade-up" data-aos-delay="500" className="mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <img
                src={meetSavla}
                alt="Meet Savla"
                className="w-80 h-96 sm:w-96 sm:h-112 md:w-112 md:h-128 object-cover object-top mx-auto rounded-lg shadow-floating"
                data-aos="fade-right"
                data-aos-delay="500"
              />
            </div>
            <div className="order-1 lg:order-2">
              <div className="flex items-center mb-6">
                <Award className="w-6 h-6 text-secondary mr-3" />
                <h3 className="font-playfair text-2xl font-semibold">Meet Savla</h3>
              </div>
              <p className="font-crimson text-xl leading-relaxed mb-6 text-white/90">
                Since 2017, He has been actively engaged in the financial markets, with a strong focus on technical analysis, and over time, he specialized in trading precious metals such as gold and silver. His approach blends data-driven insights with hands-on market experience, enabling him to identify opportunities, manage risk effectively, and navigate dynamic market conditions with discipline.
              </p>
              <Badge className="bg-secondary text-secondary-foreground">
                Technical Specialist
              </Badge>
            </div>
          </div>
        </div>

        {/* Professional Achievements Stats */}
        <div data-aos="fade-up" data-aos-delay="600" className="mb-20">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-6">
              <Star className="w-6 h-6 text-secondary mr-3" />
              <h3 className="font-playfair text-2xl font-semibold">Professional Achievements</h3>
            </div>
            <p className="font-crimson text-xl leading-relaxed mb-8 text-white/90 max-w-3xl mx-auto">
              With over six decades of combined expertise, we have guided families through
              market cycles, economic changes, and evolving financial needs. From mutual funds
              and insurance to market trading and audits, our diverse strengths help clients
              protect, grow, and diversify wealth.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-6 max-w-2xl mx-auto">
            <div className="premium-card p-6 text-center bg-white/10 rounded-xl" data-aos="zoom-in" data-aos-delay="0">
              <div className="font-playfair text-3xl md:text-4xl font-bold text-secondary mb-2">1957</div>
              <div className="font-crimson text-lg md:text-xl text-white/80">Legacy Since</div>
            </div>
            <div className="premium-card p-6 text-center bg-white/10 rounded-xl" data-aos="zoom-in" data-aos-delay="100">
              <div className="font-playfair text-3xl md:text-4xl font-bold text-secondary mb-2">1000+</div>
              <div className="font-crimson text-lg md:text-xl text-white/80">Families Served</div>
            </div>
          </div>
        </div>

        {/* Block 7: Vision & Mission */}
        <div data-aos="fade-up" data-aos-delay="700" className="mb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="premium-card p-6 bg-white/10 rounded-xl shadow-floating text-center" data-aos="fade-right">
              <Eye className="w-8 h-8 text-secondary mx-auto mb-4" />
              <h4 className="font-playfair text-xl font-semibold mb-3">Vision</h4>
              <p className="font-crimson text-lg text-white/80">
                To be recognized as a leading wealth and protection partner that combines
                innovation, integrity, and personalized care—enabling every client to build
                sustainable wealth, safeguard their future, and achieve financial freedom
                across generations.
              </p>
            </div>
            <div className="premium-card p-6 bg-white/10 rounded-xl shadow-floating text-center" data-aos="fade-left">
              <Target className="w-8 h-8 text-secondary mx-auto mb-4" />
              <h4 className="font-playfair text-xl font-semibold mb-3">Mission</h4>
              <p className="font-crimson text-lg text-white/80">
                To provide holistic financial solutions that help individuals and families
                protect, grow, and diversify their wealth. Through trusted advice,
                research-driven strategies, and a wide spectrum of offerings, we empower
                clients to achieve financial security, prosperity, and peace of mind.
              </p>
            </div>
          </div>
        </div>

        {/* Block 8: Values & Personal Connection */}
        <div data-aos="fade-up" data-aos-delay="800">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex items-center justify-center mb-6">
              <Heart className="w-6 h-6 text-secondary mr-3" />
              <h3 className="font-playfair text-2xl font-semibold">Our Commitment</h3>
            </div>
            <p className="font-crimson text-lg leading-relaxed mb-8 text-white/90">
              Our vision, values, and tireless dedication continue to inspire us as we serve
              our clients today. We are proud to be the second and third generation reaping
              the rewards of our founders' hard work, and more importantly, carrying forward
              a tradition of trust and service that spans decades.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
