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
  const [isScrolled, setIsScrolled] = useState<boolean>(false);

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

    // Scroll listener for floating navbar reveal
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
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

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {/* 1. At the very top (scrollY <= 40): Discreet theme toggle in corner, zero navbar clutter */}
      <AnimatePresence>
        {!isScrolled && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="fixed top-4 right-4 sm:right-6 lg:right-8 z-40"
          >
            <motion.button
              whileTap={{ scale: 0.88, rotate: 15 }}
              whileHover={{ scale: 1.08 }}
              type="button"
              onClick={toggleTheme}
              aria-label="Toggle theme"
              title="Toggle theme"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-border/70 bg-surface/80 backdrop-blur-md text-foreground shadow-2xs hover:border-brand hover:text-brand focus:outline-none cursor-pointer transition-colors"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={isDark ? "dark" : "light"}
                  initial={{ opacity: 0, rotate: -90, scale: 0.6 }}
                  animate={{ opacity: 1, rotate: 0, scale: 1 }}
                  exit={{ opacity: 0, rotate: 90, scale: 0.6 }}
                  transition={{ duration: 0.18 }}
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
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. When Scrolled (scrollY > 40): Petite Floating Pill Island Navbar */}
      <AnimatePresence>
        {isScrolled && (
          <motion.header
            initial={{ y: -60, opacity: 0, scale: 0.94 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -60, opacity: 0, scale: 0.94 }}
            transition={{ type: "spring", stiffness: 380, damping: 28 }}
            className="fixed top-3 sm:top-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-4xl pointer-events-auto"
          >
            <div className="flex h-12 sm:h-13 items-center justify-between rounded-full border border-border/80 bg-surface/90 px-3.5 sm:px-5 shadow-lg shadow-black/8 backdrop-blur-md transition-colors">
              {/* Brand Logo & Name (Click to scroll to top) */}
              <button
                type="button"
                onClick={scrollToTop}
                className="flex items-center gap-2.5 cursor-pointer text-left focus:outline-none group"
              >
                <div className="flex h-7.5 w-7.5 sm:h-8 sm:w-8 items-center justify-center rounded-lg bg-brand text-white shadow-2xs shadow-brand/20 transition-transform group-hover:scale-105">
                  <div className="relative">
                    <Layers className="h-4 w-4" />
                    <span className="absolute -bottom-0.5 -right-0.5 block h-1.5 w-1.5 rounded-full bg-status-free ring-1 ring-brand" />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-heading text-sm sm:text-base font-bold tracking-tight text-foreground">
                    ToolDeck
                  </span>
                  <span className="hidden rounded-full bg-status-free-bg px-2 py-0.5 text-[9px] font-bold text-status-free sm:inline-block">
                    100% Free
                  </span>
                </div>
              </button>

              {/* Right Action Controls */}
              <div className="flex items-center gap-2 sm:gap-3">
                {/* Tool Counter Pill */}
                <div className="hidden items-center gap-1.5 rounded-full border border-border/70 bg-background/80 px-2.5 py-1 text-[11px] sm:text-xs font-medium text-muted md:flex">
                  <Sparkles className="h-3 w-3 text-brand" />
                  <span>100+ tools available</span>
                </div>

                {/* Animated Theme Toggle Button */}
                <motion.button
                  whileTap={{ scale: 0.88, rotate: 15 }}
                  whileHover={{ scale: 1.08 }}
                  type="button"
                  onClick={toggleTheme}
                  aria-label="Toggle theme"
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-background text-foreground transition-colors hover:border-brand hover:text-brand focus:outline-none cursor-pointer overflow-hidden"
                >
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                      key={isDark ? "dark" : "light"}
                      initial={{ opacity: 0, rotate: -90, scale: 0.6 }}
                      animate={{ opacity: 1, rotate: 0, scale: 1 }}
                      exit={{ opacity: 0, rotate: 90, scale: 0.6 }}
                      transition={{ duration: 0.18 }}
                      className="flex items-center justify-center"
                    >
                      {isDark ? (
                        <Sun className="h-3.5 w-3.5 text-amber-400" />
                      ) : (
                        <Moon className="h-3.5 w-3.5 text-brand" />
                      )}
                    </motion.div>
                  </AnimatePresence>
                </motion.button>
              </div>
            </div>
          </motion.header>
        )}
      </AnimatePresence>
    </>
  );
}
