"use client";

import { useState, useRef, useEffect } from "react";
import { Category } from "@/type/tool";
import { 
  Compass, 
  Brain, 
  Code2, 
  Palette, 
  CheckSquare, 
  Wrench, 
  ShieldCheck, 
  PenTool, 
  Headphones, 
  Video,
  GraduationCap,
  ChevronRight,
  ChevronLeft
} from "lucide-react";

interface CategoryPillsProps {
  categories: { name: string; count: number | string }[];
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
}

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  All: Compass,
  AI: Brain,
  Development: Code2,
  Design: Palette,
  Productivity: CheckSquare,
  "Web Utilities": Wrench,
  Security: ShieldCheck,
  Writing: PenTool,
  Audio: Headphones,
  Video: Video,
  Education: GraduationCap,
};

export default function CategoryPills({
  categories,
  selectedCategory,
  onSelectCategory,
}: CategoryPillsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState<boolean>(false);
  const [canScrollRight, setCanScrollRight] = useState<boolean>(true);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (el) {
      setCanScrollLeft(el.scrollLeft > 10);
      setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 12);
    }
  };

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (el) {
      el.addEventListener("scroll", checkScroll, { passive: true });
    }
    window.addEventListener("resize", checkScroll);
    return () => {
      if (el) el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [categories]);

  const handleScroll = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (el) {
      const scrollAmount = 260;
      el.scrollBy({
        left: direction === "right" ? scrollAmount : -scrollAmount,
        behavior: "smooth",
      });
      setTimeout(checkScroll, 350);
    }
  };

  return (
    <div className="w-full border-b border-border/80 bg-background/50 backdrop-blur-xs relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
        <div className="relative flex items-center">
          {/* Scroll Left Button */}
          {canScrollLeft && (
            <div className="absolute left-0 z-20 flex items-center pr-3 bg-gradient-to-r from-background via-background/95 to-transparent h-full">
              <button
                type="button"
                onClick={() => handleScroll("left")}
                aria-label="Scroll categories left"
                className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full border border-border bg-surface text-foreground shadow-md hover:border-brand hover:text-brand transition-all active:scale-90 cursor-pointer"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* Horizontal Scrollable Category Track */}
          <div
            ref={scrollRef}
            className="flex items-center gap-1.5 overflow-x-auto py-3 no-scrollbar scroll-smooth w-full"
          >
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat.name;
              const IconComponent = CATEGORY_ICONS[cat.name] || Compass;

              return (
                <button
                  key={cat.name}
                  type="button"
                  onClick={() => onSelectCategory(cat.name)}
                  className={`group flex shrink-0 items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all cursor-pointer ${
                    isSelected
                      ? "bg-brand text-white shadow-sm shadow-brand/25"
                      : "border border-border bg-surface text-muted hover:border-border/80 hover:bg-surface-hover hover:text-foreground"
                  }`}
                >
                  <IconComponent className={`h-3.5 w-3.5 ${isSelected ? "text-white" : "text-muted group-hover:text-foreground"}`} />
                  <span>{cat.name}</span>
                  <span
                    className={`rounded-md px-1.5 py-0.5 text-[10px] font-bold ${
                      isSelected
                        ? "bg-white/20 text-white"
                        : "bg-background text-muted group-hover:text-foreground"
                    }`}
                  >
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Greater-than Icon (>) Button to Scroll Horizontally & Reveal Other Tools */}
          {canScrollRight && (
            <div className="absolute right-0 z-20 flex items-center pl-4 bg-gradient-to-l from-background via-background/95 to-transparent h-full">
              <button
                type="button"
                onClick={() => handleScroll("right")}
                aria-label="Scroll to reveal more categories"
                title="Reveal more categories"
                className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full border border-border bg-surface text-foreground shadow-md hover:border-brand hover:text-brand hover:shadow-brand/20 transition-all active:scale-90 cursor-pointer group"
              >
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 text-muted group-hover:text-brand" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
