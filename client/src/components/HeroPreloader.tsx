import { motion, useAnimation } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';

interface HeroPreloaderProps {
  onComplete: () => void;
}

const HeroPreloader: React.FC<HeroPreloaderProps> = ({ onComplete }) => {
  const [currentPhase, setCurrentPhase] = useState<
    'seed' | 'drawing' | 'pause' | 'growing' | 'lightSweep' | 'complete'
  >('seed');
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const lightSweepRef = useRef<HTMLDivElement>(null);

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    
    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Sparse floating particles (only visible during pause and after)
  const particles = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: 3 + Math.random() * 1,
    duration: 4 + Math.random() * 2,
  }));

  useEffect(() => {
    if (prefersReducedMotion) {
      // Skip animation for reduced motion
      setTimeout(() => onComplete(), 500);
      return;
    }

    const sequence = async () => {
      // Phase 1: Seed Moment (0.0s - 0.8s)
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Phase 2: ₹ Symbol Draw (0.8s - 3.0s) = 2.2s duration
      setCurrentPhase('drawing');
      await new Promise(resolve => setTimeout(resolve, 2200));
      
      // Phase 3: Pause for Impact (3.0s - 3.4s) = 0.4s
      setCurrentPhase('pause');
      await new Promise(resolve => setTimeout(resolve, 400));
      
      // Phase 4: Leaf Growth (3.4s - 5.5s) = 2.1s duration
      setCurrentPhase('growing');
      await new Promise(resolve => setTimeout(resolve, 2100));
      
      // Phase 5: Light Sweep (5.5s - 6.5s) = 1.0s duration
      setCurrentPhase('lightSweep');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Phase 6: Final Lockup (6.5s - 8.0s) = 1.5s
      setCurrentPhase('complete');
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      onComplete();
    };

    sequence();
  }, [onComplete, prefersReducedMotion]);

  // ₹ symbol SVG path - more accurate representation
  const rupeePath = "M 50 20 L 50 80 M 32 32 L 68 32 M 32 50 L 68 50 M 32 50 L 50 50 L 50 32 M 50 50 L 68 50";

  // Blue gradient colors (using brand colors)
  const blueGradient = 'linear-gradient(135deg, hsl(220 85% 56%), hsl(217 62% 34%))';
  const blueLight = 'hsl(220 85% 65%)';
  const blueMedium = 'hsl(220 85% 56%)';
  const blueDark = 'hsl(217 62% 34%)';

  // Leaf clusters configuration
  const leafClusters = [
    { angle: -50, delay: 0, distance: 32, size: 10 },
    { angle: -30, delay: 0.15, distance: 30, size: 9 },
    { angle: -10, delay: 0.3, distance: 28, size: 8 },
    { angle: 10, delay: 0.45, distance: 28, size: 8 },
    { angle: 30, delay: 0.6, distance: 30, size: 9 },
    { angle: 50, delay: 0.75, distance: 32, size: 10 },
    { angle: -40, delay: 0.2, distance: 35, size: 7 },
    { angle: 40, delay: 0.5, distance: 35, size: 7 },
  ];

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center"
      initial={{ opacity: 1 }}
      animate={{ opacity: currentPhase === 'complete' ? 0 : 1 }}
      transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
    >
      {/* Deep charcoal background with subtle radial vignette */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, hsl(222 40% 12%) 0%, hsl(222 40% 8%) 100%)',
        }}
        initial={{ opacity: 1 }}
        animate={{ opacity: currentPhase === 'complete' ? 0 : 1 }}
      />

      {/* Sparse floating particles - extremely subtle */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute w-0.5 h-0.5 rounded-full"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            background: `radial-gradient(circle, ${blueLight}40, transparent)`,
          }}
          initial={{ opacity: 0, y: 0 }}
          animate={{
            y: currentPhase === 'pause' || currentPhase === 'growing' || currentPhase === 'lightSweep' || currentPhase === 'complete' 
              ? -20 - Math.random() * 30 
              : 0,
            x: currentPhase === 'pause' || currentPhase === 'growing' || currentPhase === 'lightSweep' || currentPhase === 'complete'
              ? (Math.random() - 0.5) * 10
              : 0,
            opacity: currentPhase === 'pause' || currentPhase === 'growing' || currentPhase === 'lightSweep' || currentPhase === 'complete'
              ? [0, 0.15, 0.1, 0]
              : 0,
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: [0.4, 0, 0.2, 1],
          }}
        />
      ))}

      {/* Main logo container with subtle camera push-in (1-2%) */}
      <motion.div
        className="relative"
        initial={{ scale: 0.98, opacity: 0 }}
        animate={{
          scale: currentPhase === 'lightSweep' || currentPhase === 'complete' ? 1.01 : 1,
          opacity: 1,
        }}
        transition={{
          scale: {
            duration: 1,
            ease: [0.4, 0, 0.2, 1],
            delay: 5.5,
          },
          opacity: {
            duration: 0.3,
            delay: 0.2,
          },
        }}
      >
        {/* Seed moment - faint point of light */}
        <motion.div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full"
          style={{
            background: `radial-gradient(circle, ${blueLight}, transparent)`,
            filter: 'blur(4px)',
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: currentPhase === 'seed' ? [0, 0.4, 0.6] : 0,
            scale: currentPhase === 'seed' ? [0, 1.5, 2] : 0,
          }}
          transition={{
            duration: 0.8,
            ease: [0.4, 0, 0.2, 1],
          }}
        />

        {/* ₹ Symbol - Stroke drawing animation (liquid ink effect) */}
        <svg
          width="200"
          height="200"
          viewBox="0 0 100 100"
          className="absolute inset-0"
          style={{ filter: 'drop-shadow(0 0 12px rgba(66, 153, 225, 0.3))' }}
        >
          <defs>
            <linearGradient id="rupeeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={blueLight} />
              <stop offset="50%" stopColor={blueMedium} />
              <stop offset="100%" stopColor={blueDark} />
            </linearGradient>
          </defs>
          <motion.path
            d={rupeePath}
            fill="none"
            stroke="url(#rupeeGradient)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{
              pathLength: currentPhase === 'drawing' || currentPhase === 'pause' || currentPhase === 'growing' || currentPhase === 'lightSweep' || currentPhase === 'complete' ? 1 : 0,
              opacity: currentPhase === 'drawing' || currentPhase === 'pause' || currentPhase === 'growing' || currentPhase === 'lightSweep' || currentPhase === 'complete' ? 1 : 0,
              strokeWidth: currentPhase === 'drawing' ? [1, 2, 2.5] : 2.5,
            }}
            transition={{
              pathLength: {
                duration: 2.2,
                delay: 0.8,
                ease: [0.4, 0, 0.2, 1],
              },
              opacity: {
                duration: 0.3,
                delay: 0.8,
              },
              strokeWidth: {
                duration: 2.2,
                delay: 0.8,
                ease: [0.4, 0, 0.2, 1],
              },
            }}
            style={{
              filter: currentPhase === 'lightSweep' 
                ? 'drop-shadow(0 0 16px rgba(66, 153, 225, 0.5))' 
                : 'drop-shadow(0 0 12px rgba(66, 153, 225, 0.3))',
            }}
          />
        </svg>

        {/* Light sweep effect - travels up trunk */}
        <motion.div
          ref={lightSweepRef}
          className="absolute bottom-0 left-1/2 -translate-x-1/2"
          style={{
            background: `linear-gradient(to top, ${blueLight}CC, ${blueMedium}99, transparent)`,
            filter: 'blur(8px)',
            width: '4px',
            height: '0%',
          }}
          animate={{
            height: currentPhase === 'lightSweep' ? '85%' : '0%',
            opacity: currentPhase === 'lightSweep' ? [0, 1, 1, 0] : 0,
          }}
          transition={{
            height: {
              duration: 1,
              delay: 5.5,
              ease: [0.4, 0, 0.2, 1],
            },
            opacity: {
              duration: 1,
              delay: 5.5,
              ease: [0.4, 0, 0.2, 1],
            },
          }}
        />

        {/* Leaf clusters - organic growth with scale + opacity */}
        {leafClusters.map((leaf, index) => {
          const angleRad = (leaf.angle * Math.PI) / 180;
          const x = Math.cos(angleRad) * leaf.distance;
          const y = -Math.sin(angleRad) * leaf.distance;
          
          const startDelay = 3.4 + leaf.delay;
          const isGlowing = currentPhase === 'lightSweep';
          
          return (
            <motion.div
              key={index}
              className="absolute"
              style={{
                bottom: '50px',
                left: '50%',
                transformOrigin: '50% 100%',
              }}
              initial={{ scale: 0, opacity: 0, x: 0, y: 0, rotate: leaf.angle }}
              animate={{
                scale: currentPhase === 'growing' || currentPhase === 'lightSweep' || currentPhase === 'complete' ? 1 : 0,
                opacity: currentPhase === 'growing' || currentPhase === 'lightSweep' || currentPhase === 'complete' 
                  ? (isGlowing ? 1 : 0.85) 
                  : 0,
                x: currentPhase === 'growing' || currentPhase === 'lightSweep' || currentPhase === 'complete' ? x : 0,
                y: currentPhase === 'growing' || currentPhase === 'lightSweep' || currentPhase === 'complete' ? y : 0,
                rotate: leaf.angle + (currentPhase === 'growing' || currentPhase === 'lightSweep' || currentPhase === 'complete' 
                  ? (Math.random() - 0.5) * 8 
                  : 0),
              }}
              transition={{
                scale: {
                  duration: 0.6,
                  delay: startDelay,
                  ease: [0.4, 0, 0.2, 1],
                },
                opacity: {
                  duration: 0.8,
                  delay: startDelay,
                  ease: [0.4, 0, 0.2, 1],
                },
                x: {
                  duration: 0.8,
                  delay: startDelay,
                  ease: [0.4, 0, 0.2, 1],
                },
                y: {
                  duration: 0.8,
                  delay: startDelay,
                  ease: [0.4, 0, 0.2, 1],
                },
                rotate: {
                  duration: 0.8,
                  delay: startDelay,
                  ease: [0.4, 0, 0.2, 1],
                },
              }}
            >
              {/* Leaf with soft rim lighting */}
              <motion.div
                style={{
                  width: `${leaf.size}px`,
                  height: `${leaf.size}px`,
                  background: `radial-gradient(circle at 30% 30%, ${blueLight}90, ${blueMedium}70, ${blueDark}60)`,
                  borderRadius: '50%',
                  filter: isGlowing 
                    ? 'drop-shadow(0 0 8px rgba(66, 153, 225, 0.6))' 
                    : 'drop-shadow(0 0 4px rgba(66, 153, 225, 0.3))',
                  boxShadow: isGlowing
                    ? `inset -2px -2px 4px ${blueDark}40, 0 0 12px ${blueLight}50`
                    : `inset -1px -1px 2px ${blueDark}30`,
                }}
                animate={{
                  scale: isGlowing 
                    ? [1, 1.15, 1] 
                    : currentPhase === 'complete' 
                      ? [1, 1.02, 1] 
                      : 1,
                  filter: isGlowing
                    ? 'drop-shadow(0 0 8px rgba(66, 153, 225, 0.6))'
                    : 'drop-shadow(0 0 4px rgba(66, 153, 225, 0.3))',
                  x: currentPhase === 'complete' ? [0, Math.sin(index) * 0.3, 0] : 0,
                  y: currentPhase === 'complete' ? [0, Math.cos(index) * 0.2, 0] : 0,
                }}
                transition={{
                  scale: isGlowing ? {
                    duration: 0.2,
                    delay: 5.7 + (index * 0.05),
                    ease: [0.4, 0, 0.2, 1],
                  } : currentPhase === 'complete' ? {
                    duration: 4 + index * 0.2,
                    repeat: Infinity,
                    ease: [0.4, 0, 0.2, 1],
                  } : {},
                  filter: isGlowing ? {
                    duration: 0.2,
                    delay: 5.7 + (index * 0.05),
                    ease: [0.4, 0, 0.2, 1],
                  } : {},
                  x: currentPhase === 'complete' ? {
                    duration: 4 + index * 0.2,
                    repeat: Infinity,
                    ease: [0.4, 0, 0.2, 1],
                  } : {},
                  y: currentPhase === 'complete' ? {
                    duration: 4 + index * 0.2,
                    repeat: Infinity,
                    ease: [0.4, 0, 0.2, 1],
                  } : {},
                }}
              />
            </motion.div>
          );
        })}

        {/* Ambient sway for leaves (barely perceptible) - applied to existing leaves */}
      </motion.div>

      {/* Soft rim-light glow around logo */}
      <motion.div
        className="absolute inset-0 pointer-events-none flex items-center justify-center"
        animate={{
          opacity: currentPhase === 'lightSweep' || currentPhase === 'complete' ? 0.2 : 0.1,
        }}
        transition={{
          duration: 0.5,
          ease: [0.4, 0, 0.2, 1],
        }}
      >
        <div 
          className="w-96 h-96 rounded-full blur-3xl"
          style={{
            background: `radial-gradient(circle, ${blueLight}30, transparent 70%)`,
          }}
        />
      </motion.div>
    </motion.div>
  );
};

export default HeroPreloader;
