"use client";

import { useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import { Search, X, Wand2, ArrowRight, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";

// Dynamically import 3D Particle Swarm with ssr: false
const CasberryParticles = dynamic(() => import("./CasberryParticles"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[460px] sm:h-[540px] lg:h-[70vh] flex items-center justify-center" />
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
    <section className="relative overflow-hidden min-h-[calc(100svh-4.5rem)] sm:min-h-[74vh] flex flex-col items-center justify-center pt-4 pb-8 sm:pt-10 sm:pb-14">
      {/* Background ambient lighting glow */}
      <div className="pointer-events-none absolute inset-0 -z-20 flex items-center justify-center">
        <div className="h-[450px] w-[450px] rounded-full bg-brand/12 blur-3xl" />
      </div>

      {/* 3D Sphere Object: Clearly visible glowing purple particle sphere layered right behind the hero text */}
      <div className="absolute inset-0 -z-10 flex items-center justify-center pointer-events-none overflow-hidden select-none opacity-80 sm:opacity-85 dark:opacity-95">
        <div className="w-full h-[500px] sm:h-[580px] lg:h-[680px] max-w-5xl flex items-center justify-center">
          <CasberryParticles />
        </div>
      </div>

      {/* Centered Main Content Container */}
      <div className="mx-auto max-w-4xl w-full px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center justify-center z-10 flex-1">
        {/* Hero Headline (Centered) */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-foreground leading-[1.12]"
        >
          Find the right tool{" "}
          <span className="text-brand block sm:inline">for the job.</span>
        </motion.h1>

        {/* Supporting Subtext Under (Centered) */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-4 sm:mt-5 max-w-xl text-sm sm:text-base md:text-lg text-muted leading-relaxed"
        >
          Discover hidden AI tools, creative software, and developer cheat codes — without popups, paywalls, or fake trials.
        </motion.p>

        {/* Cute Small Search Bar (Centered, compact) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative mt-7 w-full max-w-md sm:max-w-lg"
        >
          <div className="group relative rounded-2xl border border-border/80 bg-surface/90 backdrop-blur-md shadow-lg shadow-black/5 transition-all focus-within:border-brand focus-within:ring-4 focus-within:ring-brand/15 hover:border-brand/40">
            <div className="flex items-center px-4 py-2.5 sm:py-3">
              <Search className="h-4 w-4 text-muted transition-colors group-focus-within:text-brand shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search 100+ free tools or describe your task..."
                className="w-full bg-transparent px-3 text-xs sm:text-sm text-foreground placeholder:text-muted/70 focus:outline-none"
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
                <div className="hidden items-center gap-1 rounded-md border border-border bg-background px-2 py-0.5 text-[10px] font-mono text-muted sm:flex shrink-0">
                  <span>⌘</span>
                  <span>K</span>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Floating Quick Task Nodes (Centered - Stops cleanly here on initial screen) */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-5 flex flex-wrap items-center justify-center gap-2 max-w-2xl"
        >
          <span className="text-xs font-semibold text-muted flex items-center gap-1.5 mr-1">
            <Wand2 className="h-3.5 w-3.5 text-brand" />
            <span>Popular:</span>
          </span>
          {FLOATING_TASKS.map((task, i) => (
            <motion.button
              key={task.text}
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 20,
                delay: 0.35 + i * 0.05,
              }}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => onSelectTask(task.text)}
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface/90 px-3 py-1.5 text-xs font-medium text-foreground transition-all hover:border-brand hover:bg-surface-hover hover:text-brand shadow-2xs backdrop-blur-xs cursor-pointer"
            >
              <span>{task.text}</span>
              <ArrowRight className="h-3 w-3 opacity-50" />
            </motion.button>
          ))}
        </motion.div>

        {/* Scroll Down to Reveal Categories & Tools on Next Page */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          onClick={() => {
            const el = document.getElementById("catalog-section");
            if (el) el.scrollIntoView({ behavior: "smooth" });
          }}
          aria-label="Scroll down to tools"
          className="mt-6 sm:mt-8 inline-flex flex-col items-center gap-1 text-[11px] font-semibold text-muted hover:text-brand transition-colors cursor-pointer group"
        >
          <span className="tracking-wide">Explore 100+ Tools Below</span>
          <ChevronDown className="h-4 w-4 text-brand animate-bounce" />
        </motion.button>
      </div>
    </section>
  );
}
