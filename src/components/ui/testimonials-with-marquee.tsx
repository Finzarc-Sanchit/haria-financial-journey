import { cn } from "@/lib/utils";
import { TestimonialCard, TestimonialAuthor } from "@/components/ui/testimonial-card";

interface TestimonialsSectionProps {
    title: string;
    description: string;
    testimonials: Array<{
        author: TestimonialAuthor;
        text: string;
        href?: string;
    }>;
    className?: string;
}

export function TestimonialsSection({
    title,
    description,
    testimonials,
    className
}: TestimonialsSectionProps) {
    return (
        <section className={cn(
            "bg-[#FAFAFA] text-foreground",
            "py-16",
            className
        )}>
            <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 text-center sm:gap-16 px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col items-center gap-4 sm:gap-8">
                    <p className="text-sm font-playfair font-semibold text-tertiary/80 uppercase tracking-[0.15em]">
                        CLIENT TESTIMONIALS
                    </p>
                    <h2 className="max-w-[720px] text-4xl md:text-5xl lg:text-6xl font-bold font-playfair leading-tight text-tertiary">
                        {title}
                    </h2>
                    <div className="flex justify-center">
                        <p className="text-lg md:text-xl max-w-[700px] font-crimson text-tertiary/80 leading-relaxed text-center">
                            {description}
                        </p>
                    </div>
                </div>

                <div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
                    <div className="group flex overflow-hidden p-2 [--gap:1rem] [gap:var(--gap)] flex-row [--duration:40s]">
                        <div className="flex shrink-0 justify-around [gap:var(--gap)] animate-marquee flex-row group-hover:[animation-play-state:paused]">
                            {[...Array(4)].map((_, setIndex) => (
                                testimonials.map((testimonial, i) => (
                                    <TestimonialCard
                                        key={`${setIndex}-${i}`}
                                        {...testimonial}
                                    />
                                ))
                            ))}
                        </div>
                    </div>

                    <div className="pointer-events-none absolute inset-y-0 left-0 hidden w-1/3 bg-gradient-to-r from-[#FAFAFA] sm:block" />
                    <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-1/3 bg-gradient-to-l from-[#FAFAFA] sm:block" />
                </div>
            </div>
        </section>
    );
}


