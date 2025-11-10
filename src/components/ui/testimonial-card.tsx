import { cn } from "@/lib/utils"
import { User, UserRound } from "lucide-react"
import { useState } from "react"

export interface TestimonialAuthor {
  name: string
  handle: string
  avatar: string
}

export interface TestimonialCardProps {
  author: TestimonialAuthor
  text: string
  href?: string
  className?: string
}

// Function to detect gender based on name
const detectGender = (name: string): 'male' | 'female' => {
  const firstName = name.split(' ')[0].toLowerCase();
  const femaleNames = ['isha', 'priya', 'anjali', 'neha', 'pooja', 'kavita', 'sneha', 'divya', 'swati', 'nikita', 'heta'];
  return femaleNames.includes(firstName) ? 'female' : 'male';
};

export function TestimonialCard({ 
  author,
  text,
  href,
  className
}: TestimonialCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const Card: any = href ? 'a' : 'div'
  const gender = detectGender(author.name);
  
  // Truncate text to approximately 2-3 lines (around 150 characters)
  const shouldTruncate = text.length > 150;
  const displayText = shouldTruncate && !isExpanded 
    ? text.slice(0, 150) + '...' 
    : text;
  
  return (
    <Card
      {...(href ? { href } : {})}
      className={cn(
        "flex flex-col rounded-lg border-t border-secondary/20",
        "bg-gradient-to-b from-muted/50 to-muted/10",
        "p-4 text-start sm:p-6",
        "hover:from-muted/60 hover:to-muted/20",
        "max-w-[320px] sm:max-w-[320px]",
        "transition-colors duration-300",
        className
      )}
    >
      <div className="flex items-center gap-3">
        <div className={cn(
          "h-12 w-12 rounded-full flex items-center justify-center shrink-0",
          gender === 'female' 
            ? "bg-pink-100 text-pink-600" 
            : "bg-blue-100 text-blue-600"
        )}>
          {gender === 'female' ? (
            <UserRound className="w-6 h-6" />
          ) : (
            <User className="w-6 h-6" />
          )}
        </div>
        <div className="flex flex-col items-start">
          <h3 className="text-md font-semibold leading-none font-playfair">
            {author.name}
          </h3>
          <p className="text-sm text-muted-foreground font-crimson">
            {author.handle}
          </p>
        </div>
      </div>
      <div>
        <p className="sm:text-md mt-4 text-sm text-muted-foreground font-crimson leading-relaxed">
          {displayText}
        </p>
        {shouldTruncate && (
          <button
            onClick={(e) => {
              e.preventDefault();
              setIsExpanded(!isExpanded);
            }}
            className="mt-2 text-sm font-semibold text-secondary hover:text-secondary/80 transition-colors font-crimson"
          >
            {isExpanded ? 'Read less' : 'Read more'}
          </button>
        )}
      </div>
    </Card>
  )
}


