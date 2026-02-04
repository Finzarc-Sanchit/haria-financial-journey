"use client";
import React, {
  useEffect,
  useRef,
  useState,
  useMemo,
  useCallback,
} from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle } from "lucide-react";

interface Product {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  rate: string;
  tenure: string;
  minAmount: string;
  features: string[];
  image?: string;
}

interface Colors {
  title?: string;
  description?: string;
  content?: string;
  arrowBackground?: string;
  arrowForeground?: string;
  arrowHoverBackground?: string;
}

interface FontSizes {
  title?: string;
  description?: string;
  content?: string;
}

interface CircularCarouselProps {
  products: Product[];
  autoplay?: boolean;
  colors?: Colors;
  fontSizes?: FontSizes;
  onInvestNow?: (product: Product) => void;
}

function calculateGap(width: number) {
  const minWidth = 1024;
  const maxWidth = 1456;
  const minGap = 60;
  const maxGap = 86;
  if (width <= minWidth) return minGap;
  if (width >= maxWidth)
    return Math.max(minGap, maxGap + 0.06018 * (width - maxWidth));
  return minGap + (maxGap - minGap) * ((width - minWidth) / (maxWidth - minWidth));
}

export const CircularCarousel = ({
  products,
  autoplay = true,
  colors = {},
  fontSizes = {},
  onInvestNow,
}: CircularCarouselProps) => {
  // Color & font config
  const colorTitle = colors.title ?? "#000";
  const colorDescription = colors.description ?? "#6b7280";
  const colorContent = colors.content ?? "#4b5563";
  const colorArrowBg = colors.arrowBackground ?? "#141414";
  const colorArrowFg = colors.arrowForeground ?? "#f1f1f7";
  const colorArrowHoverBg = colors.arrowHoverBackground ?? "#00a6fb";
  const fontSizeTitle = fontSizes.title ?? "1.5rem";
  const fontSizeDescription = fontSizes.description ?? "0.925rem";
  const fontSizeContent = fontSizes.content ?? "1.125rem";

  // State
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoverPrev, setHoverPrev] = useState(false);
  const [hoverNext, setHoverNext] = useState(false);
  const [containerWidth, setContainerWidth] = useState(1200);

  const imageContainerRef = useRef<HTMLDivElement>(null);
  const autoplayIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const productsLength = useMemo(() => products.length, [products]);
  const activeProduct = useMemo(
    () => products[activeIndex],
    [activeIndex, products]
  );

  // Preload all carousel images
  useEffect(() => {
    products.forEach((product) => {
      if (product.image) {
        const img = new Image();
        img.src = product.image;
      }
    });
  }, [products]);

  // Responsive gap calculation
  useEffect(() => {
    function handleResize() {
      if (imageContainerRef.current) {
        setContainerWidth(imageContainerRef.current.offsetWidth);
      }
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Autoplay
  useEffect(() => {
    if (autoplay) {
      autoplayIntervalRef.current = setInterval(() => {
        setActiveIndex((prev) => (prev + 1) % productsLength);
      }, 5000);
    }
    return () => {
      if (autoplayIntervalRef.current) clearInterval(autoplayIntervalRef.current);
    };
  }, [autoplay, productsLength]);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
    // eslint-disable-next-line
  }, [activeIndex, productsLength]);

  // Navigation handlers
  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % productsLength);
    if (autoplayIntervalRef.current) clearInterval(autoplayIntervalRef.current);
  }, [productsLength]);
  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + productsLength) % productsLength);
    if (autoplayIntervalRef.current) clearInterval(autoplayIntervalRef.current);
  }, [productsLength]);

  // Compute transforms for each image (always show 3: left, center, right)
  function getImageStyle(index: number): React.CSSProperties {
    const gap = calculateGap(containerWidth);
    const maxStickUp = gap * 0.8;
    const isActive = index === activeIndex;
    const isLeft = (activeIndex - 1 + productsLength) % productsLength === index;
    const isRight = (activeIndex + 1) % productsLength === index;
    if (isActive) {
      return {
        zIndex: 3,
        opacity: 1,
        pointerEvents: "auto",
        transform: `translateX(0px) translateY(0px) scale(1) rotateY(0deg)`,
        transition: "all 0.8s cubic-bezier(.4,2,.3,1)",
      };
    }
    if (isLeft) {
      return {
        zIndex: 2,
        opacity: 1,
        pointerEvents: "auto",
        transform: `translateX(-${gap}px) translateY(-${maxStickUp}px) scale(0.85) rotateY(15deg)`,
        transition: "all 0.8s cubic-bezier(.4,2,.3,1)",
      };
    }
    if (isRight) {
      return {
        zIndex: 2,
        opacity: 1,
        pointerEvents: "auto",
        transform: `translateX(${gap}px) translateY(-${maxStickUp}px) scale(0.85) rotateY(-15deg)`,
        transition: "all 0.8s cubic-bezier(.4,2,.3,1)",
      };
    }
    // Hide all other images
    return {
      zIndex: 1,
      opacity: 0,
      pointerEvents: "none",
      transition: "all 0.8s cubic-bezier(.4,2,.3,1)",
    };
  }

  // Framer Motion variants
  const contentVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  return (
    <div className="carousel-container">
      <div className="carousel-grid">
        {/* Images */}
        <div className="image-container" ref={imageContainerRef}>
          {products.map((product, index) => {
            const IconComponent = product.icon;
            return (
              <div
                key={product.id}
                className="product-card"
                data-index={index}
                style={getImageStyle(index)}
              >
                {/* Product Image Placeholder */}
                  <div className="product-image-wrapper">
                    <img
                      src={product.image || "/placeholder.svg"}
                      alt={product.title}
                      className="product-image"
                      loading="eager"
                      decoding="async"
                    />
                  </div>
              </div>
            );
          })}
        </div>
        {/* Content */}
        <div className="product-content">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              variants={contentVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <div className="flex items-center gap-3 mb-2">
                <h3
                  className="product-title font-playfair"
                  style={{ color: colorTitle, fontSize: fontSizeTitle }}
                >
                  {activeProduct.title}
                </h3>
                <Badge className="bg-secondary/20 text-secondary">
                  {activeProduct.rate}
                </Badge>
              </div>
              <p
                className="product-description font-crimson"
                style={{ color: colorDescription, fontSize: fontSizeDescription }}
              >
                {activeProduct.description}
              </p>
              
              {/* Details */}
              <div className="product-details">
                <div className="detail-row">
                  <span className="detail-label font-crimson">Tenure</span>
                  <span className="detail-value font-playfair">{activeProduct.tenure}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label font-crimson">Min Amount</span>
                  <span className="detail-value font-playfair">{activeProduct.minAmount}</span>
                </div>
              </div>

              {/* Features */}
              <motion.div className="product-features">
                {activeProduct.features.slice(0, 4).map((feature, i) => (
                  <motion.div
                    key={i}
                    className="feature-item"
                    initial={{
                      opacity: 0,
                      x: -10,
                    }}
                    animate={{
                      opacity: 1,
                      x: 0,
                    }}
                    transition={{
                      duration: 0.3,
                      ease: "easeInOut",
                      delay: 0.1 * i,
                    }}
                  >
                    <CheckCircle className="h-4 w-4 text-secondary flex-shrink-0" />
                    <span className="font-crimson">{feature}</span>
                  </motion.div>
                ))}
              </motion.div>

              {/* Button */}
              <Button
                className="invest-button bg-secondary hover:bg-secondary/90 text-white font-crimson font-semibold"
                onClick={() => onInvestNow?.(activeProduct)}
              >
                Invest Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>
          </AnimatePresence>
          <div className="arrow-buttons">
            <button
              className="arrow-button prev-button"
              onClick={handlePrev}
              style={{
                backgroundColor: hoverPrev ? '#1a5f7a' : '#c8a882',
              }}
              onMouseEnter={() => setHoverPrev(true)}
              onMouseLeave={() => setHoverPrev(false)}
              aria-label="Previous product"
            >
              <ArrowLeft className="arrow-icon" color="#ffffff" />
            </button>
            <button
              className="arrow-button next-button"
              onClick={handleNext}
              style={{
                backgroundColor: hoverNext ? '#1a5f7a' : '#c8a882',
              }}
              onMouseEnter={() => setHoverNext(true)}
              onMouseLeave={() => setHoverNext(false)}
              aria-label="Next product"
            >
              <ArrowRight className="arrow-icon" color="#ffffff" />
            </button>
          </div>
        </div>
      </div>
      <style jsx>{`
        .carousel-container {
          width: 100%;
          max-width: 70rem;
          padding: 1rem 0.5rem;
          margin: 0 auto;
        }
        .carousel-grid {
          display: grid;
          gap: 1.5rem;
        }
        @media (min-width: 640px) {
          .carousel-container {
            padding: 1.5rem 1rem;
          }
          .carousel-grid {
            gap: 2rem;
          }
        }
        @media (min-width: 1024px) {
          .carousel-container {
            padding: 2rem 1rem;
          }
          .carousel-grid {
            gap: 3rem;
          }
        }
        .image-container {
          position: relative;
          width: 100%;
          height: 16rem;
          perspective: 1000px;
        }
        @media (min-width: 640px) {
          .image-container {
            height: 20rem;
          }
        }
        @media (min-width: 768px) {
          .image-container {
            height: 24rem;
          }
        }
        @media (min-width: 1024px) {
          .image-container {
            height: 28rem;
          }
        }
        .product-card {
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: 1.5rem;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
          overflow: hidden;
        }
        .product-image-wrapper {
          position: relative;
          width: 100%;
          height: 100%;
          background: transparent;
        }
        .product-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .product-content {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
        .product-title {
          font-weight: bold;
          margin-bottom: 0.25rem;
          font-size: 1.25rem;
        }
        @media (min-width: 640px) {
          .product-title {
            font-size: 1.5rem;
          }
        }
        .product-description {
          margin-bottom: 1.5rem;
          line-height: 1.6;
          font-size: 0.875rem;
        }
        @media (min-width: 640px) {
          .product-description {
            font-size: 0.925rem;
          }
        }
        .product-details {
          margin-bottom: 1.5rem;
          padding: 1rem;
          background: #f9fafb;
          border-radius: 0.75rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .detail-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .detail-label {
          color: #6b7280;
          font-size: 0.875rem;
        }
        .detail-value {
          font-weight: 600;
          color: #1a5f7a;
        }
        .product-features {
          margin-bottom: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .feature-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.875rem;
          color: #4b5563;
        }
        .invest-button {
          width: 100%;
          margin-bottom: 1.5rem;
        }
        .arrow-buttons {
          display: flex;
          gap: 1.5rem;
          padding-top: 1.5rem;
          border-top: 1px solid #e5e7eb;
        }
        .arrow-button {
          width: 2.5rem;
          height: 2.5rem;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background-color 0.3s;
          border: none;
        }
        @media (min-width: 640px) {
          .arrow-button {
            width: 3rem;
            height: 3rem;
          }
        }
        @media (min-width: 768px) {
          .arrow-button {
            width: 3.5rem;
            height: 3.5rem;
          }
        }
        .arrow-icon {
          width: 20px;
          height: 20px;
        }
        @media (min-width: 640px) {
          .arrow-icon {
            width: 24px;
            height: 24px;
          }
        }
        @media (min-width: 768px) {
          .arrow-icon {
            width: 28px;
            height: 28px;
          }
        }
        @media (min-width: 768px) {
          .carousel-grid {
            grid-template-columns: 1fr 1fr;
            gap: 5rem;
          }
          .invest-button {
            margin-bottom: 0;
          }
        }
        @media (min-width: 1024px) {
          .carousel-container {
            padding: 2rem;
          }
        }
      `}</style>
    </div>
  );
};

export default CircularCarousel;

