import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

// Import SVG as raw string (Vite supports ?raw suffix)
// @ts-ignore - Vite handles ?raw imports
import treeSvgRaw from '../assets/financial-tree1.svg?raw';

interface AnimatedTreeProps {
  /**
   * intro  - full logo draw animation (used for loader)
   * idle   - static logo with subtle floating leaves (used as background)
   */
  mode?: 'intro' | 'idle';
  /**
   * Called once when the intro animation has completely finished
   * (trunk filled and leaves have started their idle float).
   */
  onIntroComplete?: () => void;
}

const AnimatedTree = ({ mode = 'intro', onIntroComplete }: AnimatedTreeProps) => {
  const [trunkPhase, setTrunkPhase] = useState<'hidden' | 'strokeDraw' | 'strokeSettle' | 'fillReveal'>('hidden');
  const [startIdle, setStartIdle] = useState(false);
  const [trunkPath, setTrunkPath] = useState<{ d: string; fill: string; } | null>(null);
  const [leaves, setLeaves] = useState<Array<{ id: string; d: string; fill: string; }>>([]);

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

    // If we're in "idle" mode, skip the intro sequence and go straight
    // to the filled trunk with floating leaves.
    if (mode === 'idle') {
      setTrunkPhase('fillReveal');
      setStartIdle(true);
      return;
    }

    // Start trunk animation sequence for "intro" mode
    setTrunkPhase('strokeDraw');

    // Make the whole intro much quicker (~2.5s total):
    // Phase 1: Stroke draw (~1.2s)
    const timer1 = setTimeout(() => {
      setTrunkPhase('strokeSettle');
    }, 1200);

    // Phase 2: Stroke settle (short, then fill)
    const timer2 = setTimeout(() => {
      setTrunkPhase('fillReveal');
    }, 1400);

    // Phase 3: After trunk + first leaf pops in, start idle float and mark complete
    const timer3 = setTimeout(() => {
      setStartIdle(true);
      if (onIntroComplete) {
        onIntroComplete();
      }
    }, 2500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [mode, onIntroComplete]);

  // Trunk animation variants - 3 distinct phases
  const trunkVariants: any = {
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
          duration: 1.2,
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
        duration: 0.2,
        ease: "easeOut",
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
  const leafVariants: any = {
    hidden: {
      scale: 0,
      opacity: 0,
    },
    visible: (index: number) => ({
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.8,
        // Start shortly after trunk fill is complete in the faster intro
        delay: 1.6 + index * 0.07,
      },
    }),
    float: {
      scale: 1,
      opacity: 1,
      rotate: [-6, 6, -6],
      transition: {
        duration: 3.5,
        repeat: Infinity,
        ease: [0.4, 0, 0.6, 1],
      },
    },
  };

  // Determine if leaves should be visible (start earlier during stroke)
  const leavesVisible = trunkPhase !== 'hidden' || startIdle;
  const initialLeafVariant = mode === 'idle' ? 'float' : 'hidden';

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
            initial={initialLeafVariant}
            animate={leavesVisible ? (startIdle ? "float" : "visible") : "hidden"}
            variants={leafVariants}
            custom={index}
            style={{
              transformOrigin: "50% 100%",
            }}
          />
        ))}
      </motion.svg>
    </div>
  );
};

export default AnimatedTree;