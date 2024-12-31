import React, { useState, useEffect, useRef } from "react";
import {
  Quote,
  Star,
  Heart,
  Rocket,
  Award,
  Sun,
  Target,
  Compass,
  Clock,
  Gem,
  Zap,
  Coffee,
  Flag,
  Lightbulb,
  Trophy,
  Fire,
  Smile,
  Anchor,
  Mountain,
  Sparkles,
  Crown,
} from "lucide-react";

const quotes = [
  {
    text: "The only way to do great work is to love what you do.",
    icon: Heart,
  },
  { text: "Believe you can and you're halfway there.", icon: Star },
  {
    text: "Everything you've ever wanted is on the other side of fear.",
    icon: Rocket,
  },
  {
    text: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    icon: Award,
  },
  {
    text: "The future belongs to those who believe in the beauty of their dreams.",
    icon: Sun,
  },
  { text: "Don't watch the clock; do what it does. Keep going.", icon: Clock },
  {
    text: "The only limit to our realization of tomorrow will be our doubts of today.",
    icon: Target,
  },
  {
    text: "You are never too old to set another goal or to dream a new dream.",
    icon: Compass,
  },
  { text: "The secret of getting ahead is getting started.", icon: Flag },
  { text: "Quality is not an act, it is a habit.", icon: Gem },
  {
    text: "Your time is limited, don't waste it living someone else's life.",
    icon: Zap,
  },
  {
    text: "It does not matter how slowly you go as long as you do not stop.",
    icon: Coffee,
  },
  {
    text: "The best way to predict the future is to create it.",
    icon: Lightbulb,
  },
  {
    text: "What you get by achieving your goals is not as important as what you become.",
    icon: Trophy,
  },
  {
    text: "The harder you work for something, the greater you'll feel when you achieve it.",
    icon: Mountain,
  },
  {
    text: "Don't be afraid to give up the good to go for the great.",
    icon: Fire,
  },
  { text: "Dreams don't work unless you do.", icon: Sparkles },
  {
    text: "The only person you are destined to become is the person you decide to be.",
    icon: Anchor,
  },
  {
    text: "Success is walking from failure to failure with no loss of enthusiasm.",
    icon: Smile,
  },
  {
    text: "The difference between ordinary and extraordinary is that little extra.",
    icon: Crown,
  },
];

export function ThoughtOfTheDay({ isMobile = false }: { isMobile?: boolean }) {
  const [quote, setQuote] = useState<{ text: string; icon: any }>({
    text: "",
    icon: Quote,
  });
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Get today's date as a string (YYYY-MM-DD)
    const today = new Date().toISOString().split("T")[0];

    // Use the date as seed to get the same quote throughout the day
    const seedNumber = today.split("-").join("");
    const index = Number(seedNumber) % quotes.length;

    setQuote(quotes[index]);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const QuoteIcon = quote.icon;

  if (isMobile) {
    return <span>{quote.text}</span>;
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="btn btn-ghost btn-sm gap-2 text-base-content"
        title="Thought of the Day"
      >
        <Quote size={16} />
        Thought of the Day
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 p-4 bg-base-200 rounded-lg shadow-lg border border-base-300 w-72 z-50">
          <div className="flex items-start gap-3">
            <QuoteIcon size={20} className="text-primary flex-shrink-0 mt-1" />
            <p className="text-base-content">{quote.text}</p>
          </div>
        </div>
      )}
    </div>
  );
}
