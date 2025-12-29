import { useEffect, useState } from 'react';
import { Award, Users, TrendingUp, Building } from 'lucide-react';

export function StatsSection() {
  const currentYear = new Date().getFullYear();
  const [counters, setCounters] = useState({
    year: currentYear,
    aum: 0,
    clients: 0,
    generations: 0
  });

  useEffect(() => {
    // Animate counters on mount (IntersectionObserver)
    const section = document.getElementById('stats');
    let triggered = false;
    
    const observer = new window.IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !triggered) {
          triggered = true;
          
          const animateYearCounter = (key: string, startYear: number, endYear: number, duration: number) => {
            let current = startYear;
            const step = (startYear - endYear) / (duration / 16);
            const timer = setInterval(() => {
              current -= step;
              if (current <= endYear) {
                current = endYear;
                clearInterval(timer);
              }
              setCounters(prev => ({ ...prev, [key]: Math.floor(current) }));
            }, 16);
          };
          
          const animateCounter = (key: string, target: number, duration: number) => {
            let start = 0;
            const increment = target / (duration / 16);
            const timer = setInterval(() => {
              start += increment;
              if (start >= target) {
                start = target;
                clearInterval(timer);
              }
              setCounters(prev => ({ ...prev, [key]: Math.floor(start) }));
            }, 16);
          };
          
          animateYearCounter('year', currentYear, 1957, 2000);
          animateCounter('aum', 150, 2500);
          animateCounter('clients', 1500, 2000);
          animateCounter('generations', 4, 1500);
        }
      },
      { threshold: 0.3 }
    );
    
    if (section) observer.observe(section);
    return () => observer.disconnect();
  }, [currentYear]);

  const stats = [
    {
      icon: Building,
      value: `Since ${counters.year}`,
      label: "Years of Heritage",
      highlight: `Since ${counters.year}`
    },
    {
      icon: TrendingUp,
      value: `₹${counters.aum}+ Cr`,
      label: "AUM Managed",
      highlight: `₹${counters.aum}+ Cr`
    },
    {
      icon: Users,
      value: `${counters.clients}+`,
      label: "Satisfied Clients",
      highlight: `${counters.clients}+`
    },
    {
      icon: Award,
      value: counters.generations.toString(),
      label: "Generations Served",
      highlight: counters.generations.toString()
    }
  ];

  return (
    <section id="stats" className="py-16 bg-gradient-to-br from-secondary/10 to-secondary/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`text-center space-y-3 ${
                index !== stats.length - 1 
                  ? 'sm:border-r-2 lg:border-r-2 border-tertiary/30 sm:pr-8 lg:pr-12' 
                  : ''
              } ${
                index === 1 
                  ? 'sm:border-r-0 lg:border-r-2' 
                  : ''
              }`}
            >
              {/* Large Number */}
              <div className="font-playfair text-xl md:text-2xl font-bold text-tertiary">
                {stat.highlight}
              </div>
              {/* Label */}
              <div className="font-crimson text-base md:text-lg text-tertiary/60">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

