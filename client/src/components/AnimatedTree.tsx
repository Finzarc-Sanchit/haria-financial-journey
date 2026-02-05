import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

// Import SVG as raw string (Vite supports ?raw suffix)
// @ts-ignore - Vite handles ?raw imports
import treeSvgRaw from '../assets/financial-tree1.svg?raw';

const AnimatedTree = () => {
  const [trunkPhase, setTrunkPhase] = useState<'hidden' | 'strokeDraw' | 'strokeSettle' | 'fillReveal'>('hidden');
  const [startIdle, setStartIdle] = useState(false);
  const [trunkPath, setTrunkPath] = useState<{ d: string; fill: string } | null>(null);
  const [leaves, setLeaves] = useState<Array<{ id: string; d: string; fill: string }>>([]);

  // Parse SVG and extract trunk and leaves
  useEffect(() => {
    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(treeSvgRaw, 'image/svg+xml');
    
    // Extract trunk path
    const trunkGroup = svgDoc.querySelector('[id="trunk"]');
    const trunkPathElement = trunkGroup?.querySelector('path');
    if (trunkPathElement) {
      setTrunkPath({
        d: trunkPathElement.getAttribute('d') || '',
        fill: trunkPathElement.getAttribute('fill') || '',
      });
    }

    // Extract all leaves using querySelectorAll - preserves DOM order
    const leafElements = Array.from(svgDoc.querySelectorAll('[id^="leaf-"]'));
    const leafData = leafElements.map((leaf) => ({
      id: leaf.getAttribute('id') || '',
      d: leaf.getAttribute('d') || '',
      fill: leaf.getAttribute('fill') || '',
    }));
    setLeaves(leafData);

    // Start trunk animation sequence
    setTrunkPhase('strokeDraw');

    // Phase 1: Stroke draw (2s)
    const timer1 = setTimeout(() => {
      setTrunkPhase('strokeSettle');
    }, 2000);

    // Phase 2: Stroke settle (0.1s delay - shorter for faster transition)
    const timer2 = setTimeout(() => {
      setTrunkPhase('fillReveal');
    }, 2100);

    // Phase 3: Fill reveal (0.6s) - leaves start near end of stroke
    // Leaves: ~1.2s (17 leaves * 0.08s delay + 0.6s duration)
    // Total: 1.95s (leaves start) + 1.2s (leaves) = ~3.15s
    const timer3 = setTimeout(() => {
      setStartIdle(true);
    }, 3150);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  // Trunk animation variants - 3 distinct phases
  const trunkVariants = {
    hidden: {
      pathLength: 0,
      opacity: 0,
      fillOpacity: 0,
    },
    strokeDraw: {
      pathLength: 1,
      opacity: 1,
      fillOpacity: 0, // Phase 1: Fill transparent during stroke draw
      transition: {
        pathLength: {
          duration: 2,
          ease: "easeInOut",
        },
        opacity: {
          duration: 0.1,
        },
        fillOpacity: {
          duration: 0,
        },
      },
    },
    strokeSettle: {
      pathLength: 1,
      opacity: 1,
      fillOpacity: 0, // Phase 2: Keep fill transparent, stroke settles
      transition: {
        duration: 0.1,
        ease: "easeInOut",
      },
    },
    fillReveal: {
      pathLength: 1,
      opacity: 1,
      fillOpacity: 1, // Phase 3: Reveal fill, stroke remains visible
      transition: {
        fillOpacity: {
          duration: 0.6,
          ease: "easeInOut",
        },
      },
    },
  };


  // Leaf animation variants
  const leafVariants = {
    hidden: {
      scale: 0,
      opacity: 0,
    },
    visible: (index: number) => ({
      scale: 1,
      opacity: 1,
      transition: {
        scale: {
          duration: 0.6,
          delay: 1.95 + index * 0.08, // Start near end of stroke draw
          ease: [0.34, 1.56, 0.64, 1], // backOut easing
        },
        opacity: {
          duration: 0.4,
          delay: 1.95 + index * 0.08,
        },
      },
    }),
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
  };

  // Determine if leaves should be visible (start earlier during stroke)
  const leavesVisible = trunkPhase !== 'hidden' || startIdle;

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Soft radial glow behind tree */}
      <div
        className="absolute inset-0 rounded-full opacity-30 blur-3xl"
        style={{
          background:
            'radial-gradient(circle, rgba(59, 130, 246, 0.4) 0%, rgba(37, 99, 235, 0.2) 50%, transparent 70%)',
        }}
      />

      {/* SVG Container - Single SVG DOM */}
      <motion.svg
        viewBox="0 0 932 1024"
        className="relative z-10 w-full h-full max-w-[400px] max-h-[400px] md:max-w-[500px] md:max-h-[500px]"
        preserveAspectRatio="xMidYMid meet"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Trunk - 3 Phase Animation */}
        {trunkPath && (
          <motion.path
            id="trunk-path"
            d={trunkPath.d}
            fill={trunkPath.fill}
            stroke={trunkPath.fill}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial="hidden"
            animate={trunkPhase}
            variants={trunkVariants}
            style={{
              filter: "drop-shadow(0 0 2px rgba(59, 130, 246, 0.5))",
            }}
          />
        )}

        {/* Leaves - Animated after trunk fill completes */}
        {leaves.map((leaf, index) => (
          <motion.path
            key={leaf.id}
            id={leaf.id}
            d={leaf.d}
            fill={leaf.fill}
            initial="hidden"
            animate={leavesVisible ? (startIdle ? "float" : "visible") : "hidden"}
            variants={leafVariants}
            custom={index}
            style={{
              transformOrigin: "50% 50%",
            }}
          />
        ))}
      </motion.svg>
    </div>
  );
};

export default AnimatedTree;

