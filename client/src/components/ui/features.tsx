import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface FeaturesProps {
  features: {
    id: number;
    icon: React.ElementType;
    title: string;
    description: string;
    image: string;
  }[];
  primaryColor?: string;
  progressGradientLight?: string;
  progressGradientDark?: string;
}

export function Features({
  features,
  primaryColor = "secondary",
  progressGradientLight = "bg-gradient-to-r from-secondary/80 to-secondary",
  progressGradientDark = "bg-gradient-to-r from-secondary/70 to-secondary/90",
}: FeaturesProps) {
  const [currentFeature, setCurrentFeature] = useState(0);
  const [progress, setProgress] = useState(0);
  const featureRefs = useRef<(HTMLDivElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => (prev >= 100 ? 100 : prev + 1));
    }, 100);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (progress >= 100) {
      setTimeout(() => {
        setCurrentFeature((prev) => (prev + 1) % features.length);
        setProgress(0);
      }, 200);
    }
  }, [progress, features.length]);

  useEffect(() => {
    const activeFeatureElement = featureRefs.current[currentFeature];
    const container = containerRef.current;

    if (activeFeatureElement && container) {
      const containerRect = container.getBoundingClientRect();
      const elementRect = activeFeatureElement.getBoundingClientRect();

      container.scrollTo({
        left:
          activeFeatureElement.offsetLeft -
          (containerRect.width - elementRect.width) / 2,
        behavior: "smooth",
      });
    }
  }, [currentFeature]);

  const handleFeatureClick = (index: number) => {
    setCurrentFeature(index);
    setProgress(0);
  };

  return (
    <div className="py-10 md:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-10 md:mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <p className="text-sm font-playfair font-semibold text-tertiary/80 uppercase tracking-[0.15em] mb-4">
            OUR SERVICES & EXPERTISE
          </p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold font-playfair text-tertiary mb-6 leading-tight">
            Comprehensive Financial Solutions
          </h2>
          <div className="flex justify-center">
            <p className="text-lg md:text-xl font-crimson text-tertiary/80 max-w-3xl leading-relaxed text-center">
              Backed by decades of experience and trusted by 1500+ clients across India
            </p>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-2 lg:gap-10 gap-6 items-center">
          {/* Left Side - Features with Progress Lines */}
          <div
            ref={containerRef}
            className="lg:space-y-5 md:space-x-6 lg:space-x-0 overflow-x-auto overflow-hidden no-scrollbar lg:overflow-visible flex lg:flex lg:flex-col flex-row order-1 pb-2 scroll-smooth"
          >
            {features.map((feature, index) => {
              const Icon = feature.icon;
              const isActive = currentFeature === index;

              return (
                <div
                  key={feature.id}
                  ref={(el) => {
                    featureRefs.current[index] = el;
                  }}
                  className="relative cursor-pointer flex-shrink-0"
                  onClick={() => handleFeatureClick(index)}
                >
                  {/* Feature Content */}
                  <motion.div
                    className={`
                    flex lg:flex-row flex-col items-start space-x-4 p-4 md:p-5 max-w-sm md:max-w-sm lg:max-w-2xl transition-all duration-300
                    ${
                      isActive
                        ? " bg-white shadow-xl rounded-xl border border-gray-200 "
                        : " "
                    }
                  `}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
                  >
                    {/* Icon */}
                    <div
                      className={`
                      p-3 hidden md:block rounded-full transition-all duration-300
                      ${
                        isActive
                          ? `bg-secondary text-white`
                          : `bg-secondary/10 text-secondary`
                      }
                    `}
                    >
                      <Icon size={24} />
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <h3
                        className={`
                        text-lg md:text-xl md:mt-4 lg:mt-0 font-bold font-playfair mb-2 transition-colors duration-300
                        ${
                          isActive
                            ? "text-tertiary"
                            : "text-tertiary/70"
                        }
                      `}
                      >
                        {feature.title}
                      </h3>
                      <p
                        className={`
                        transition-colors duration-300 text-sm md:text-base font-crimson leading-relaxed
                        ${
                          isActive
                            ? "text-tertiary/80"
                            : "text-tertiary/60"
                        }
                      `}
                      >
                        {feature.description}
                      </p>
                      <div className="mt-3 bg-gray-100 rounded-sm h-1 overflow-hidden">
                        {isActive && (
                          <motion.div
                            className={`h-full ${progressGradientLight}`}
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.1, ease: "linear" }}
                          />
                        )}
                      </div>
                    </div>
                  </motion.div>
                </div>
              );
            })}
          </div>

          {/* Right Side - Image Display */}
          <div className="relative order-1 max-w-md mx-auto lg:order-2">
            <motion.div
              key={currentFeature}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="relative"
            >
              <img
                className="rounded-2xl border border-gray-50 shadow-lg w-full h-auto max-h-[44vh] object-cover"
                src={features[currentFeature].image}
                alt={features[currentFeature].title}
                loading="lazy"
              />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

