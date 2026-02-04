import React from "react";
import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import createGlobe from "cobe";

export interface BentoFeature {
  title: string;
  description: string;
  skeleton: React.ReactNode;
  className: string;
}

export function FeaturesSectionWithBentoGrid({
  title,
  description,
  features,
}: {
  title: string;
  description: string;
  features: BentoFeature[];
}) {
  return (
    <div className="relative z-20 py-6 lg:py-12 max-w-7xl mx-auto">
      <div className="px-8">
        <h4 className="text-3xl lg:text-5xl lg:leading-tight max-w-5xl mx-auto text-center tracking-tight font-medium text-white font-playfair">
          {title}
        </h4>

        <p className="text-sm lg:text-base max-w-2xl my-4 mx-auto text-white/80 text-center font-normal font-crimson">
          {description}
        </p>
      </div>

      <div className="relative">
        <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-6 mt-5 xl:border rounded-md border-white/20">
          {features.map((feature) => (
            <FeatureCard key={feature.title} className={feature.className}>
              <FeatureTitle>{feature.title}</FeatureTitle>
              <FeatureDescription>{feature.description}</FeatureDescription>
              <div className="h-full w-full">{feature.skeleton}</div>
            </FeatureCard>
          ))}
        </div>
      </div>
    </div>
  );
}

const FeatureCard = ({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn(`p-2.5 sm:p-3.5 relative overflow-hidden`, className)}>
      {children}
    </div>
  );
};

const FeatureTitle = ({ children }: { children?: React.ReactNode }) => {
  return (
    <p className="max-w-5xl text-left tracking-tight text-white text-2xl md:text-3xl lg:text-4xl md:leading-snug font-playfair font-semibold">
      {children}
    </p>
  );
};

const FeatureDescription = ({ children }: { children?: React.ReactNode }) => {
  return (
    <p
      className={cn(
        "text-base md:text-lg lg:text-xl max-w-full text-justify",
        "text-white/90 font-normal font-crimson leading-relaxed",
        "mt-2 mb-3"
      )}
    >
      {children}
    </p>
  );
};

export const SkeletonOne = ({ imageSrc }: { imageSrc: string }) => {
  return (
    <div className="relative flex py-2 px-2 h-full items-center justify-center">
      <div className="w-3/4 max-w-md p-2 mx-auto bg-white/10 backdrop-blur-sm shadow-2xl group rounded-lg">
        <div className="flex flex-1 w-full flex-col">
          <img
            src={imageSrc}
            alt="Team"
            className="w-full h-auto object-cover object-center rounded-sm"
          />
        </div>
      </div>

      <div className="absolute bottom-0 z-40 inset-x-0 h-40 bg-gradient-to-t from-tertiary via-tertiary/50 to-transparent w-full pointer-events-none" />
      <div className="absolute top-0 z-40 inset-x-0 h-40 bg-gradient-to-b from-tertiary via-transparent to-transparent w-full pointer-events-none" />
    </div>
  );
};

export const SkeletonPlaceholder = () => {
  return (
    <div className="relative flex py-8 px-2 gap-10 h-full">
      <div className="w-full p-5 mx-auto bg-white/5 backdrop-blur-sm shadow-2xl group h-full rounded-lg border-2 border-dashed border-white/20 flex items-center justify-center">
        <div className="text-center">
          <p className="text-white/50 font-crimson text-sm">Image placeholder</p>
          <p className="text-white/30 font-crimson text-xs mt-2">Add your image here</p>
        </div>
      </div>
    </div>
  );
};

export const SkeletonStats = ({
  stat1,
  stat2,
}: {
  stat1: { value: string; label: string };
  stat2: { value: string; label: string };
}) => {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-4 p-4">
      <motion.div
        className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center w-full border border-white/20 shadow-xl"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(196, 163, 90, 0.3)" }}
      >
        <div className="text-3xl md:text-4xl font-bold text-secondary mb-2 font-playfair">
          {stat1.value}
        </div>
        <div className="text-sm md:text-base text-white/80 font-crimson">{stat1.label}</div>
      </motion.div>

      <motion.div
        className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center w-full border border-white/20 shadow-xl"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1 }}
        whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(196, 163, 90, 0.3)" }}
      >
        <div className="text-3xl md:text-4xl font-bold text-secondary mb-2 font-playfair">
          {stat2.value}
        </div>
        <div className="text-sm md:text-base text-white/80 font-crimson">{stat2.label}</div>
      </motion.div>
    </div>
  );
};

export const Globe = ({ className }: { className?: string }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let phi = 0;

    if (!canvasRef.current) return;

    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: 2,
      width: 600 * 2,
      height: 600 * 2,
      phi: 0,
      theta: 0,
      dark: 1,
      diffuse: 1.2,
      mapSamples: 16000,
      mapBrightness: 6,
      baseColor: [0.14, 0.16, 0.32], // Tertiary color in RGB
      markerColor: [0.77, 0.64, 0.35], // Secondary (gold) color in RGB
      glowColor: [0.77, 0.64, 0.35],
      markers: [
        { location: [19.076, 72.8777], size: 0.08 }, // Mumbai
        { location: [28.6139, 77.209], size: 0.05 }, // Delhi
        { location: [12.9716, 77.5946], size: 0.05 }, // Bangalore
      ],
      onRender: (state) => {
        state.phi = phi;
        phi += 0.005;
      },
    });

    return () => {
      globe.destroy();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: 600, height: 600, maxWidth: "100%", aspectRatio: 1 }}
      className={className}
    />
  );
};

export const SkeletonGlobe = () => {
  return (
    <div className="h-60 md:h-60 flex flex-col items-center relative bg-transparent mt-10">
      <Globe className="absolute -right-10 md:-right-10 -bottom-80 md:-bottom-72" />
    </div>
  );
};

