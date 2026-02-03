import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { rupeePath, leafPaths } from './treePaths';

const AnimatedTree = () => {
  const [isRevealed, setIsRevealed] = useState(false);
  const [startIdle, setStartIdle] = useState(false);

  useEffect(() => {
    // Trigger reveal animation on mount
    setIsRevealed(true);
    
    // Start idle animation after all leaves have appeared (approx 3.2s total)
    const timer = setTimeout(() => {
      setStartIdle(true);
    }, 3200);

    return () => clearTimeout(timer);
  }, []);

  // Convert fill colors from rgb() to hex for gradients
  const getColorFromFill = (fill: string) => {
    const match = fill.match(/rgb\((\d+),(\d+),(\d+)\)/);
    if (match) {
      const r = parseInt(match[1]);
      const g = parseInt(match[2]);
      const b = parseInt(match[3]);
      return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    }
    return '#3B82F6'; // fallback
  };

  // Trunk animation variants
  const trunkVariants = {
    hidden: {
      pathLength: 0,
      opacity: 0,
      fillOpacity: 0,
    },
    visible: {
      pathLength: 1,
      opacity: 1,
      fillOpacity: 0, // Keep fill transparent for stroke-only effect
      transition: {
        pathLength: {
          duration: 2,
          ease: "easeInOut",
        },
        opacity: {
          duration: 0.3,
          delay: 1.8,
        },
      },
    },
  };


  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Soft radial glow behind tree */}
      <div 
        className="absolute inset-0 rounded-full opacity-30 blur-3xl"
        style={{
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.4) 0%, rgba(37, 99, 235, 0.2) 50%, transparent 70%)',
        }}
      />

      {/* SVG Container */}
      <motion.svg
        viewBox="0 0 932 1024"
        className="relative z-10 w-full h-full max-w-[400px] max-h-[400px] md:max-w-[500px] md:max-h-[500px]"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Gradient definitions */}
        <defs>
          <linearGradient id="trunkGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#3B82F6" stopOpacity="1" />
            <stop offset="50%" stopColor="#2563EB" stopOpacity="1" />
            <stop offset="100%" stopColor="#1E40AF" stopOpacity="1" />
          </linearGradient>
          
          {/* Leaf gradients */}
          {leafPaths.map((leaf, index) => {
            const color = getColorFromFill(leaf.fill);
            return (
              <linearGradient
                key={`leafGradient-${index}`}
                id={`leafGradient-${index}`}
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor={color} stopOpacity="0.9" />
                <stop offset="100%" stopColor={color} stopOpacity="0.7" />
              </linearGradient>
            );
          })}
        </defs>

        {/* Trunk - Rupee Symbol */}
        <motion.path
          d={rupeePath}
          fill="none"
          stroke="url(#trunkGradient)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          variants={trunkVariants}
          initial="hidden"
          animate={isRevealed ? "visible" : "hidden"}
          style={{
            filter: "drop-shadow(0 0 2px rgba(59, 130, 246, 0.5))",
          }}
        />

        {/* Leaves */}
        {leafPaths.map((leaf, index) => {
          const revealDelay = 2 + index * 0.08;
          const color = getColorFromFill(leaf.fill);
          return (
            <motion.g
              key={`leaf-${index}`}
              initial="hidden"
              animate={isRevealed ? (startIdle ? "float" : "visible") : "hidden"}
              variants={{
                hidden: {
                  scale: 0,
                  opacity: 0,
                  y: 0,
                  rotate: 0,
                },
                visible: {
                  scale: 1,
                  opacity: 1,
                  y: 0,
                  rotate: 0,
                  transition: {
                    scale: {
                      duration: 0.6,
                      delay: revealDelay,
                      ease: [0.34, 1.56, 0.64, 1], // backOut easing
                    },
                    opacity: {
                      duration: 0.4,
                      delay: revealDelay,
                    },
                  },
                },
                float: {
                  scale: 1,
                  opacity: 1,
                  y: [0, -6, 0],
                  rotate: [-1, 1, -1],
                  transition: {
                    y: {
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut",
                    },
                    rotate: {
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut",
                    },
                  },
                },
              }}
              style={{
                transformOrigin: "50% 50%",
              }}
            >
              <path
                d={leaf.path}
                fill={`url(#leafGradient-${index})`}
                stroke={color}
                strokeWidth="0.5"
                strokeOpacity="0.3"
              />
            </motion.g>
          );
        })}
      </motion.svg>
    </div>
  );
};

export default AnimatedTree;

