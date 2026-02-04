import React from "react";
import { motion } from "framer-motion";

interface ColorChangeCardsProps {
  cards: {
    heading: string;
    description: string;
    imgSrc: string;
  }[];
}

const ColorChangeCards = ({ cards }: ColorChangeCardsProps) => {
  return (
    <div className="w-full">
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card, index) => (
          <Card
            key={index}
            heading={card.heading}
            description={card.description}
            imgSrc={card.imgSrc}
            index={index}
          />
        ))}
      </div>
    </div>
  );
};

// --- Card Component ---
interface CardProps {
  heading: string;
  description: string;
  imgSrc: string;
  index: number;
}

const Card = ({ heading, description, imgSrc, index }: CardProps) => {
  React.useEffect(() => {
    console.log(`Card "${heading}" - Image src:`, imgSrc);
    console.log(`Type of imgSrc:`, typeof imgSrc);
  }, [heading, imgSrc]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
    >
      {/* Image Section */}
      <div className="relative h-40 w-full overflow-hidden bg-gray-100">
        <img
          src={imgSrc}
          alt={heading}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onLoad={() => {
            console.log(`✅ Image loaded successfully for "${heading}":`, imgSrc);
          }}
          onError={(e) => {
            console.error(`❌ Failed to load image for "${heading}":`, imgSrc);
            console.error('Error event:', e);
            // Set a placeholder background color if image fails
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
      </div>

      {/* Content Section */}
      <div className="p-4 md:p-5">
        <h3 className="font-playfair text-lg md:text-xl font-bold text-tertiary mb-2">
          {heading}
        </h3>
        <p className="font-crimson text-sm md:text-base text-tertiary/80 leading-relaxed">
          {description}
        </p>
      </div>
    </motion.div>
  );
};

export default ColorChangeCards;

