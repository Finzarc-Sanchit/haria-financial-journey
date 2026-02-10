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

  // NOTE:
  // We previously auto-scrolled the page to the active feature whenever
  // `currentFeature` changed. That caused the sections around Features
  // (especially About) to appear to "move" or be disturbed on desktop.
  // To keep the layout and scroll position completely stable, that behavior
  // has been removed. The auto-rotation and animations remain unchanged.

  const handleFeatureClick = (index: number) => {
    setCurrentFeature(index);
    setProgress(0);
  };

  return (
    <div className="py-6 md:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-6 md:mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <p className="text-xs md:text-sm font-playfair font-semibold text-tertiary/80 uppercase tracking-[0.15em] mb-2 md:mb-4">
            OUR SERVICES & EXPERTISE
          </p>
          <h2 className="text-2xl md:text-5xl lg:text-6xl font-bold font-playfair text-tertiary mb-3 md:mb-6 leading-tight">
            Comprehensive Financial Solutions
          </h2>
          <div className="flex justify-center">
            <p className="text-sm md:text-lg lg:text-xl font-crimson text-tertiary/80 max-w-3xl leading-relaxed text-center">
              Backed by decades of experience and trusted by 1500+ clients across India
            </p>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-2 lg:gap-10 gap-4 items-center w-full">
          {/* Features List - Vertical on mobile, side-by-side on desktop */}
          <div
            ref={containerRef}
            className="lg:space-y-5 space-y-3 lg:overflow-visible flex flex-col order-1 w-full max-w-full"
          >
            {features.map((feature, index) => {
              const Icon = feature.icon;
              const isActive = currentFeature === index;

              return (
                <div key={feature.id} className="w-full max-w-full">
                  <div
                    ref={(el) => {
                      featureRefs.current[index] = el;
                    }}
                    className="relative cursor-pointer w-full max-w-full"
                    onClick={() => handleFeatureClick(index)}
                  >
                    {/* Feature Content */}
                    <motion.div
                      className={`
                      flex lg:flex-row flex-col items-start lg:space-x-4 p-3 md:p-5 w-full max-w-full lg:max-w-2xl transition-all duration-300 overflow-x-hidden
                      ${isActive
                          ? "bg-white shadow-xl rounded-xl border border-gray-200"
                          : ""
                        }
                    `}
                      style={{ boxSizing: 'border-box', width: '100%', maxWidth: '100%' }}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
                    >
                      {/* Icon */}
                      <div
                        className={`
                        p-2 md:p-3 rounded-full transition-all duration-300 mb-2 lg:mb-0 flex-shrink-0
                        ${isActive
                            ? `bg-secondary text-white`
                            : `bg-secondary/10 text-secondary`
                          }
                      `}
                      >
                        <Icon size={20} className="md:w-6 md:h-6" />
                      </div>

                      {/* Content */}
                      <div className="flex-1 w-full min-w-0">
                        <h3
                          className={`
                          text-lg md:text-xl font-bold font-playfair mb-1 md:mb-2 transition-colors duration-300 break-words
                          ${isActive
                              ? "text-tertiary"
                              : "text-tertiary/70"
                            }
                        `}
                          style={{ wordWrap: 'break-word', overflowWrap: 'break-word' }}
                        >
                          {feature.title}
                        </h3>
                        <p
                          className={`
                          transition-colors duration-300 text-sm md:text-base font-crimson leading-relaxed break-words
                          ${isActive
                              ? "text-tertiary/80"
                              : "text-tertiary/60"
                            }
                        `}
                          style={{ wordWrap: 'break-word', overflowWrap: 'break-word' }}
                        >
                          {feature.description}
                        </p>
                        <div className="mt-2 md:mt-3 bg-gray-100 rounded-sm h-1 w-full overflow-hidden relative" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }}>
                          {isActive && (
                            <motion.div
                              className={`h-full ${progressGradientLight} block`}
                              initial={{ width: 0 }}
                              animate={{ width: `${Math.min(progress, 100)}%` }}
                              transition={{ duration: 0.1, ease: "linear" }}
                              style={{
                                width: `${Math.min(progress, 100)}%`,
                                maxWidth: '100%',
                                boxSizing: 'border-box',
                                overflow: 'hidden'
                              }}
                            />
                          )}
                        </div>
                      </div>
                    </motion.div>
                  </div>

                  {/* Mobile Image - Only show below active feature */}
                  {isActive && (
                    <motion.div
                      key={`mobile-image-${currentFeature}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                      className="lg:hidden mt-3 mb-2"
                    >
                      <img
                        className="rounded-xl border border-gray-50 shadow-lg w-full h-[30vh] object-cover"
                        src={feature.image}
                        alt={feature.title}
                        loading="lazy"
                      />
                    </motion.div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Desktop Image Display - Right Side */}
          <div className="hidden lg:block relative order-2 max-w-md mx-auto">
            <motion.div
              key={currentFeature}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="relative"
            >
              <img
                className="rounded-2xl border border-gray-50 shadow-lg w-full h-[44vh] object-cover"
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
