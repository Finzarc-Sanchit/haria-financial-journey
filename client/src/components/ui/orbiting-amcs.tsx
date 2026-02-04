"use client"
import React, { useEffect, useState, memo } from 'react';

// --- Type Definitions ---
type AMCType = 'axis' | 'hdfc' | 'icici' | 'kotak' | 'hsbc' | 'tata' | 'nippon';

type GlowColor = 'gold' | 'navy';

interface AMCIconProps {
  type: AMCType;
}

interface AMCConfig {
  id: string;
  orbitRadius: number;
  size: number;
  speed: number;
  iconType: AMCType;
  phaseShift: number;
  glowColor: GlowColor;
  label: string;
}

interface OrbitingAMCProps {
  config: AMCConfig;
  angle: number;
}

interface GlowingOrbitPathProps {
  radius: number;
  glowColor?: GlowColor;
  animationDelay?: number;
}

// --- AMC Logo Image Data ---
const amcComponents: Record<AMCType, { imagePath: string; color: string }> = {
  axis: {
    imagePath: '/Client%20Logos/Axis.png',
    color: '#97144D'
  },
  hdfc: {
    imagePath: '/Client%20Logos/HDFC.jpg',
    color: '#004C8F'
  },
  icici: {
    imagePath: '/Client%20Logos/ICICI.png',
    color: '#F37021'
  },
  kotak: {
    imagePath: '/Client%20Logos/Kotak.png',
    color: '#ED1C24'
  },
  hsbc: {
    imagePath: '/Client%20Logos/HSBC.png',
    color: '#DB0011'
  },
  tata: {
    imagePath: '/Client%20Logos/Tata.png',
    color: '#1C4B9C'
  },
  nippon: {
    imagePath: '/Client%20Logos/Nippon.png',
    color: '#0055A5'
  }
};

// --- Memoized Icon Component ---
const AMCIcon = memo(({ type }: AMCIconProps) => {
  const [imageError, setImageError] = useState(false);
  const amcData = amcComponents[type];
  if (!amcData) return null;
  
  return (
    <div className="w-full h-full flex items-center justify-center bg-white rounded-full p-2">
      {imageError ? (
        <div className="text-xs font-bold text-gray-600 text-center">
          {type.toUpperCase()}
        </div>
      ) : (
        <img 
          src={amcData.imagePath} 
          alt={`${type.toUpperCase()} Logo`}
          className="w-full h-full object-contain"
          loading="lazy"
          onError={(e) => {
            console.error(`Failed to load image for ${type}:`, amcData.imagePath);
            setImageError(true);
          }}
        />
      )}
    </div>
  );
});
AMCIcon.displayName = 'AMCIcon';

// --- Configuration for the Orbiting AMCs ---
const amcsConfig: AMCConfig[] = [
  // Inner Orbit (Gold) - 4 AMCs
  { 
    id: 'hdfc',
    orbitRadius: 100, 
    size: 50, 
    speed: 1, 
    iconType: 'hdfc', 
    phaseShift: 0, 
    glowColor: 'gold',
    label: 'HDFC Mutual Fund'
  },
  { 
    id: 'icici',
    orbitRadius: 100, 
    size: 50, 
    speed: 1, 
    iconType: 'icici', 
    phaseShift: (Math.PI) / 2, 
    glowColor: 'gold',
    label: 'ICICI Prudential'
  },
  { 
    id: 'axis',
    orbitRadius: 100, 
    size: 50, 
    speed: 1, 
    iconType: 'axis', 
    phaseShift: Math.PI, 
    glowColor: 'gold',
    label: 'Axis Mutual Fund'
  },
  { 
    id: 'kotak',
    orbitRadius: 100, 
    size: 50, 
    speed: 1, 
    iconType: 'kotak', 
    phaseShift: (3 * Math.PI) / 2, 
    glowColor: 'gold',
    label: 'Kotak Mahindra'
  },
  // Outer Orbit (Navy) - 3 AMCs
  { 
    id: 'hsbc',
    orbitRadius: 180, 
    size: 55, 
    speed: -0.6, 
    iconType: 'hsbc', 
    phaseShift: 0, 
    glowColor: 'navy',
    label: 'HSBC Mutual Fund'
  },
  { 
    id: 'tata',
    orbitRadius: 180, 
    size: 50, 
    speed: -0.6, 
    iconType: 'tata', 
    phaseShift: (2 * Math.PI) / 3, 
    glowColor: 'navy',
    label: 'Tata Mutual Fund'
  },
  { 
    id: 'nippon',
    orbitRadius: 180, 
    size: 50, 
    speed: -0.6, 
    iconType: 'nippon', 
    phaseShift: (4 * Math.PI) / 3, 
    glowColor: 'navy',
    label: 'Nippon India Mutual Fund'
  },
];

// --- Memoized Orbiting AMC Component ---
const OrbitingAMC = memo(({ config, angle }: OrbitingAMCProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const { orbitRadius, size, iconType, label } = config;

  const x = Math.cos(angle) * orbitRadius;
  const y = Math.sin(angle) * orbitRadius;

  return (
    <div
      className="absolute top-1/2 left-1/2 transition-all duration-300 ease-out"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        transform: `translate(calc(${x}px - 50%), calc(${y}px - 50%))`,
        zIndex: isHovered ? 20 : 10,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`
          relative w-full h-full bg-white
          rounded-full flex items-center justify-center
          transition-all duration-300 border-2
          ${isHovered ? 'scale-125 shadow-2xl border-secondary' : 'shadow-lg hover:shadow-xl border-gray-200'}
        `}
        style={{
          boxShadow: isHovered
            ? `0 0 30px ${amcComponents[iconType]?.color}40, 0 0 60px ${amcComponents[iconType]?.color}20`
            : undefined
        }}
      >
        <AMCIcon type={iconType} />
        {isHovered && (
          <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-tertiary/95 backdrop-blur-sm rounded-lg text-xs text-white whitespace-nowrap pointer-events-none font-crimson shadow-lg">
            {label}
          </div>
        )}
      </div>
    </div>
  );
});
OrbitingAMC.displayName = 'OrbitingAMC';

// --- Optimized Orbit Path Component ---
const GlowingOrbitPath = memo(({ radius, glowColor = 'gold', animationDelay = 0 }: GlowingOrbitPathProps) => {
  const glowColors = {
    gold: {
      primary: 'rgba(196, 163, 90, 0.3)',
      secondary: 'rgba(196, 163, 90, 0.15)',
      border: 'rgba(196, 163, 90, 0.25)'
    },
    navy: {
      primary: 'rgba(34, 40, 82, 0.3)',
      secondary: 'rgba(34, 40, 82, 0.15)',
      border: 'rgba(34, 40, 82, 0.25)'
    }
  };

  const colors = glowColors[glowColor] || glowColors.gold;

  return (
    <div
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
      style={{
        width: `${radius * 2}px`,
        height: `${radius * 2}px`,
        animationDelay: `${animationDelay}s`,
      }}
    >
      {/* Glowing background */}
      <div
        className="absolute inset-0 rounded-full animate-pulse"
        style={{
          background: `radial-gradient(circle, transparent 30%, ${colors.secondary} 70%, ${colors.primary} 100%)`,
          boxShadow: `0 0 60px ${colors.primary}, inset 0 0 60px ${colors.secondary}`,
          animation: 'pulse 4s ease-in-out infinite',
          animationDelay: `${animationDelay}s`,
        }}
      />

      {/* Static ring for depth */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          border: `1px solid ${colors.border}`,
          boxShadow: `inset 0 0 20px ${colors.secondary}`,
        }}
      />
    </div>
  );
});
GlowingOrbitPath.displayName = 'GlowingOrbitPath';

// --- Main Component ---
export default function OrbitingAMCs() {
  const [time, setTime] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;

    let animationFrameId: number;
    let lastTime = performance.now();

    const animate = (currentTime: number) => {
      const deltaTime = (currentTime - lastTime) / 1000;
      lastTime = currentTime;

      setTime(prevTime => prevTime + deltaTime);
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isPaused]);

  const orbitConfigs: Array<{ radius: number; glowColor: GlowColor; delay: number }> = [
    { radius: 100, glowColor: 'gold', delay: 0 },
    { radius: 180, glowColor: 'navy', delay: 1.5 }
  ];

  return (
    <div className="w-full flex items-center justify-center overflow-hidden">
      <div 
        className="relative w-full max-w-[280px] sm:max-w-[350px] md:max-w-[400px] lg:max-w-[450px] aspect-square flex items-center justify-center"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        
        {/* Central Icon with brand colors */}
        <div className="w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 bg-gradient-to-br from-secondary to-tertiary rounded-full flex items-center justify-center z-10 relative shadow-2xl">
          <div className="absolute inset-0 rounded-full bg-secondary/30 blur-xl animate-pulse"></div>
          <div className="absolute inset-0 rounded-full bg-tertiary/20 blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="relative z-10 text-white font-bold font-playfair text-lg sm:text-xl">
            45+
          </div>
        </div>

        {/* Render glowing orbit paths */}
        {orbitConfigs.map((config) => (
          <GlowingOrbitPath
            key={`path-${config.radius}`}
            radius={config.radius}
            glowColor={config.glowColor}
            animationDelay={config.delay}
          />
        ))}

        {/* Render orbiting AMC icons */}
        {amcsConfig.map((config) => {
          const angle = time * config.speed + (config.phaseShift || 0);
          return (
            <OrbitingAMC
              key={config.id}
              config={config}
              angle={angle}
            />
          );
        })}
      </div>
    </div>
  );
}

