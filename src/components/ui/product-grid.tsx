import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

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
}

interface FontSizes {
  title?: string;
  description?: string;
  content?: string;
}

interface ProductGridProps {
  products: Product[];
  colors?: Colors;
  fontSizes?: FontSizes;
  onInvestNow?: (product: Product) => void;
}

export const ProductGrid = ({
  products,
  colors = {},
  fontSizes = {},
  onInvestNow,
}: ProductGridProps) => {
  const colorTitle = colors.title ?? "#1a5f7a";
  const colorDescription = colors.description ?? "#6b7280";
  const colorContent = colors.content ?? "#4b5563";
  const fontSizeTitle = fontSizes.title ?? "1.5rem";
  const fontSizeDescription = fontSizes.description ?? "0.925rem";
  const fontSizeContent = fontSizes.content ?? "1.125rem";

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="flex flex-col gap-2"
          >
            {/* Image */}
            <div className="bg-muted rounded-md aspect-video mb-2 overflow-hidden">
              <img
                src={product.image || "/placeholder.svg"}
                alt={product.title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>

            {/* Title and Badge */}
            <div className="flex items-center gap-3 mb-1">
              <h3
                className="text-xl tracking-tight font-playfair font-bold flex-1"
                style={{ color: colorTitle, fontSize: fontSizeTitle }}
              >
                {product.title}
              </h3>
              <Badge className="bg-secondary/20 text-secondary text-xs">
                {product.rate}
              </Badge>
            </div>

            {/* Description */}
            <p
              className="text-base font-crimson leading-relaxed mb-3"
              style={{ color: colorDescription, fontSize: fontSizeDescription }}
            >
              {product.description}
            </p>

            {/* Details */}
            <div className="flex gap-4 text-sm mb-3" style={{ color: colorContent }}>
              <div className="font-crimson">
                <span className="font-semibold">Tenure: </span>
                <span>{product.tenure}</span>
              </div>
              <div className="font-crimson">
                <span className="font-semibold">Min Amount: </span>
                <span>{product.minAmount}</span>
              </div>
            </div>

            {/* Features */}
            <div className="space-y-2 mb-4">
              {product.features.slice(0, 4).map((feature, i) => (
                <div key={i} className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-secondary flex-shrink-0" />
                  <span className="text-sm font-crimson" style={{ color: colorContent }}>
                    {feature}
                  </span>
                </div>
              ))}
            </div>

            {/* Button */}
            <Button
              className="bg-secondary hover:bg-secondary/90 text-white font-crimson font-semibold mt-auto"
              onClick={() => onInvestNow?.(product)}
            >
              Invest Now
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ProductGrid;

