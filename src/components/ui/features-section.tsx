export function FeaturesSection() {

  const services = [
    {
      image: "/Commitment/General-insurance.jpg",
      title: "Life & General Insurance",
      description: "Comprehensive coverage for you and your family's financial security"
    },
    {
      image: "/Commitment/Mutual-funds.png",
      title: "Mutual Funds & Equity",
      description: "Strategic investment solutions for long-term wealth creation"
    },
    {
      image: "/Commitment/Fixed-income.jpg",
      title: "Fixed Income",
      description: "Stable returns through diversified fixed income instruments"
    },
    {
      image: "/Commitment/Commodity-market.png",
      title: "Commodity Derivative Trading",
      description: "Expert guidance in commodity markets and derivatives"
    }
  ];

  return (
    <section id="features" className="py-16 bg-gradient-to-br from-secondary/10 to-secondary/5">
      <div className="mx-auto max-w-7xl space-y-12 px-4 sm:px-6 lg:px-8 md:space-y-20">
        {/* Header */}
        <div className="relative z-10 mx-auto max-w-4xl space-y-4 text-center">
          <p className="text-sm font-playfair font-semibold text-tertiary/80 uppercase tracking-[0.15em] mb-4">
            OUR SERVICES & EXPERTISE
          </p>
          <h2 className="text-balance text-4xl md:text-5xl lg:text-6xl font-bold font-playfair text-tertiary leading-tight">
            Comprehensive Financial Solutions
          </h2>
          <div className="flex justify-center">
            <p className="text-lg md:text-xl font-crimson text-tertiary/80 max-w-3xl leading-relaxed text-center">
              Backed by decades of experience and trusted by 1500+ clients across India
            </p>
          </div>
        </div>

        {/* Services Grid */}
        <div className="relative mx-auto grid max-w-6xl gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service, index) => (
            <div
              key={index}
              className="group text-center transition-all duration-300"
            >
              {/* Circular Image Container */}
              <div className="w-32 h-32 mx-auto mb-6 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 border-2 border-secondary/20 overflow-hidden">
                <img 
                  src={service.image} 
                  alt={service.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              {/* Title */}
              <h3 className="text-lg md:text-xl font-bold font-playfair text-tertiary mb-3 min-h-[3.5rem] flex items-center justify-center">
                {service.title}
              </h3>
              {/* Description */}
              <p className="text-sm md:text-base font-crimson text-tertiary/70 leading-relaxed text-justify">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

