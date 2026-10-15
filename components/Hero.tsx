"use client";

import { useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import { Search, X, Wand2, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

// Dynamically import 3D Particle Swarm with ssr: false
const CasberryParticles = dynamic(() => import("./CasberryParticles"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[175px] sm:h-[220px] lg:h-[680px] xl:h-[740px] flex items-center justify-center" />
  ),
});

interface HeroProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onSelectTask: (task: string) => void;
}

// Signature task nodes from PRD Section 6
const FLOATING_TASKS = [
  { text: "Remove a background", category: "Design" },
  { text: "Download YouTube video", category: "Web Utilities" },
  { text: "Compress a PDF", category: "Productivity" },
  { text: "Generate code UI", category: "Development" },
  { text: "Decode Base64 & hashes", category: "Security" },
  { text: "Photoshop in browser", category: "Design" },
];

export default function Hero({ searchQuery, setSearchQuery, onSelectTask }: HeroProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut Cmd/Ctrl + K to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <section className="relative overflow-hidden pt-3 sm:pt-6 lg:pt-8 pb-6 sm:pb-8 lg:pb-12 min-h-[80vh] md:min-h-0 flex items-center justify-center">
      {/* Background ambient lighting glow */}
      <div className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center">
        <div className="h-[380px] w-[380px] sm:h-[550px] sm:w-[550px] rounded-full bg-brand/12 blur-3xl" />
      </div>

      {/* Aligned 1:1 with Navbar, Category Pills, and Catalog (max-w-7xl px-4 sm:px-6 lg:px-8) */}
      <div className="mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 flex-1 flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-center">
          {/* Text Column: Left on Mobile, Centered on Tablet, Left on Desktop (lg:col-span-6) */}
          <div className="lg:col-span-6 flex flex-col justify-center items-start text-left md:items-center md:text-center lg:items-start lg:text-left z-10 py-1 sm:py-3 w-full max-w-2xl md:mx-auto lg:max-w-none lg:mx-0">
            {/* Working Tagline Badge (Hidden on mobile, centered on tablet, left on desktop) */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="hidden md:inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3.5 py-1.5 text-xs font-semibold text-muted shadow-2xs backdrop-blur-sm mb-4 sm:mb-6 w-fit md:mx-auto lg:mx-0"
            >
              <span className="flex h-2 w-2 rounded-full bg-status-free animate-pulse" />
              <span>Curated Discovery Platform • Everything 100% Free</span>
            </motion.div>

            {/* Hero Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-heading text-[35px] sm:text-5xl md:text-5xl lg:text-6xl xl:text-[68px] font-extrabold tracking-tight text-foreground leading-[1.1] md:leading-[1.08]"
            >
              {/* On mobile: 'Finding the right tool for the job.' */}
              <span className="md:hidden">
                Finding the right tool <br />
                <span className="text-brand">for the job.</span>
              </span>
              {/* On tablet and laptop: original heading */}
              <span className="hidden md:inline">
                Find the right tool <br />
                <span className="text-brand">for the job.</span>
              </span>
            </motion.h1>

            {/* Supporting Copy */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-2.5 sm:mt-5 max-w-xl text-sm sm:text-base md:text-lg lg:text-xl text-muted leading-relaxed mx-0 md:mx-auto lg:mx-0"
            >
              Discover hidden AI tools, creative software, and developer cheat codes — without popups, paywalls, or fake trials.
            </motion.p>

            {/* Primary Interaction: Task-Oriented Search Field */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="relative mt-4 sm:mt-8 w-full max-w-md sm:max-w-lg lg:max-w-xl mx-0 md:mx-auto lg:mx-0"
            >
              <div className="group relative rounded-2xl border border-border bg-surface shadow-md transition-all focus-within:border-brand focus-within:ring-4 focus-within:ring-brand/15 hover:border-border/80 text-left">
                <div className="flex items-center px-4 py-3 sm:py-3.5 lg:py-4">
                  <Search className="h-5 w-5 text-muted transition-colors group-focus-within:text-brand shrink-0" />
                  <input
                    ref={inputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Describe your task (e.g. download video, remove bg, merge pdf)..."
                    className="w-full bg-transparent px-3 text-sm sm:text-base text-foreground placeholder:text-muted/70 focus:outline-none"
                  />
                  {searchQuery ? (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="rounded-lg p-1 text-muted hover:bg-surface-hover hover:text-foreground cursor-pointer"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  ) : (
                    <div className="hidden items-center gap-1 rounded-md border border-border bg-background px-2.5 py-1 text-[11px] font-mono text-muted sm:flex shrink-0">
                      <span>⌘</span>
                      <span>K</span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Floating Quick Task Nodes (Reduced to 2 on mobile to prevent choking) */}
            <div className="mt-3.5 sm:mt-6 flex flex-wrap items-center justify-start md:justify-center lg:justify-start gap-1.5 sm:gap-2 pt-1">
              <span className="text-xs font-semibold text-muted flex items-center gap-1.5 mr-1">
                <Wand2 className="h-3.5 w-3.5 text-brand" />
                <span>Popular:</span>
              </span>
              {FLOATING_TASKS.map((task, idx) => (
                <motion.button
                  key={task.text}
                  whileHover={{ scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onSelectTask(task.text)}
                  className={`items-center gap-1.5 rounded-full border border-border bg-surface px-2.5 py-1 sm:px-3.5 sm:py-1.5 text-[11px] sm:text-xs font-medium text-foreground transition-all hover:border-brand hover:bg-surface-hover hover:text-brand shadow-2xs cursor-pointer ${
                    idx >= 2 ? "hidden sm:inline-flex" : "inline-flex"
                  }`}
                >
                  <span>{task.text}</span>
                  <ArrowRight className="h-3 w-3 opacity-50" />
                </motion.button>
              ))}
            </div>
          </div>

          {/* Right Column: Giant 3D Purple Particle Sphere (Desktop right column only) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="hidden lg:flex lg:col-span-6 w-full items-center justify-center overflow-visible"
          >
            <CasberryParticles />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
