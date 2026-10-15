"use client";

import { useState, useEffect } from "react";
import { Sparkles, Moon, Sun, Layers } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface NavbarProps {
  onOpenConcierge?: () => void;
  toolCount: number;
}

export default function Navbar({ onOpenConcierge, toolCount }: NavbarProps) {
  const [isDark, setIsDark] = useState<boolean>(false);

  useEffect(() => {
    // Check initial system or saved preference
    const saved = localStorage.getItem("tooldeck-theme");
    if (saved === "dark" || (!saved && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
      setIsDark(true);
      document.documentElement.setAttribute("data-theme", "dark");
      document.documentElement.classList.add("dark");
    } else {
      setIsDark(false);
      document.documentElement.removeAttribute("data-theme");
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.removeAttribute("data-theme");
      document.documentElement.classList.remove("dark");
      localStorage.setItem("tooldeck-theme", "light");
      setIsDark(false);
    } else {
      document.documentElement.setAttribute("data-theme", "dark");
      document.documentElement.classList.add("dark");
      localStorage.setItem("tooldeck-theme", "dark");
      setIsDark(true);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/80 bg-background/85 backdrop-blur-md transition-colors">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo & Tagline */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand text-white shadow-sm shadow-brand/25 transition-transform hover:scale-105">
            {/* PRD Section 15 Logo: Stacked deck + cursor */}
            <div className="relative">
              <Layers className="h-5 w-5" />
              <span className="absolute -bottom-1 -right-1 block h-2 w-2 rounded-full bg-status-free ring-2 ring-brand" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-heading text-lg font-bold tracking-tight text-foreground">
                ToolDeck
              </span>
              <span className="hidden rounded-full bg-status-free-bg px-2 py-0.5 text-[10px] font-bold text-status-free sm:inline-block">
                100% Free
              </span>
            </div>
          </div>
        </div>

        {/* Right Action Controls */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Tool Counter Pill */}
          <div className="hidden items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-muted md:flex">
            <Sparkles className="h-3.5 w-3.5 text-brand" />
            <span>100+ tools available</span>
          </div>

          {/* Animated Theme Toggle Button */}
          <motion.button
            whileTap={{ scale: 0.88, rotate: 15 }}
            whileHover={{ scale: 1.06 }}
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-surface text-foreground transition-colors hover:border-brand hover:text-brand focus:outline-none overflow-hidden"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={isDark ? "dark" : "light"}
                initial={{ opacity: 0, rotate: -90, scale: 0.6 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, rotate: 90, scale: 0.6 }}
                transition={{ duration: 0.2 }}
                className="flex items-center justify-center"
              >
                {isDark ? (
                  <Sun className="h-4 w-4 text-amber-400" />
                ) : (
                  <Moon className="h-4 w-4 text-brand" />
                )}
              </motion.div>
            </AnimatePresence>
          </motion.button>
        </div>
      </div>
    </header>
  );
}
