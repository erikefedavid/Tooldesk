"use client";

import { useState, useMemo, useEffect } from "react";
import { Tools as INITIAL_TOOLS } from "@/data/tools";
import { Tool, Category } from "@/type/tool";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import CategoryPills from "@/components/CategoryPills";
import ToolCard from "@/components/ToolCard";
import ToolDetailModal from "@/components/ToolDetailModal";
import AiConciergeModal from "@/components/AiConciergeModal";
import Footer from "@/components/Footer";
import { Filter, SlidersHorizontal, Sparkles, RefreshCcw, ShieldCheck, ArrowUp, Bot, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence, useScroll, useSpring, useTransform } from "framer-motion";

// Intelligent Acronym & Synonym dictionary for lazy users (yt, bg, des, sec, etc.)
const SYNONYM_MAP: Record<string, string[]> = {
  yt: ["youtube", "video", "download", "cobalt"],
  bg: ["background", "remove", "cutout", "transparent", "eraser"],
  des: ["design", "photo", "editor", "photoshop", "figma", "graphic", "image"],
  dev: ["development", "code", "coding", "software", "api", "programming", "frontend", "backend"],
  cs: ["computer science", "harvard", "algorithms", "coding", "course"],
  tts: ["text to speech", "voice", "audio", "speech synthesis", "speaker"],
  img: ["image", "photo", "picture", "png", "jpeg", "webp"],
  pic: ["picture", "photo", "image"],
  vid: ["video", "download", "youtube", "editor", "cut", "mp4"],
  dl: ["download", "save", "video", "youtube", "cobalt"],
  fe: ["frontend", "react", "ui", "tailwind", "css", "html", "v0"],
  be: ["backend", "api", "node", "database", "sql"],
  ps: ["photoshop", "photopea", "photo editor", "image editor"],
  sec: ["security", "cybersecurity", "encryption", "hash", "password", "shodan", "cyberchef"],
  ai: ["artificial intelligence", "llm", "deepseek", "claude", "prompt", "model"],
  ocr: ["text extraction", "pdf", "scan", "document"],
  db: ["database", "sql", "data"],
  doc: ["document", "pdf", "office", "word", "notes"],
  auth: ["login", "signup", "password", "bitwarden", "security"],
  course: ["education", "learn", "cs50", "tutorial", "curriculum", "odin"],
  learn: ["education", "course", "cs50", "tutorial", "curriculum", "odin"],
  ui: ["daisyui", "originkit", "components", "tailwind", "design", "framer"],
  music: ["muted", "flowmusic", "audiomass", "audio", "song", "lyria", "sound", "vocal remover", "suno", "beat maker", "chords"],
  particle: ["particles", "casberry", "3d", "simulation", "threejs"],
  particles: ["particles", "casberry", "3d", "simulation", "threejs"],
  canvas: ["melius", "stitch", "infinite canvas", "flow"],
  gemini: ["google", "aistudio", "llm", "frontier"],
  pdf: ["pdf24", "fullyfreetools", "compress pdf", "merge pdf", "convert pdf", "document"],
  draw: ["excalidraw", "krita", "sketch", "whiteboard", "painting"],
  paint: ["krita", "digital art", "illustration", "drawing", "photopea"],
  prompt: ["meigen", "prompthero", "flowgpt", "midjourney", "stable diffusion"],
  watermark: ["pixelbatch", "watermarkout", "dewatermark", "ezmaker", "photo"],
  stamp: ["pixelbatch", "watermark", "branding"],
  batch: ["pixelbatch", "bulkimagen", "losslesscut", "handbrake"],
  ytdown: ["cobalt", "youtube", "video downloader", "mp3", "shorts", "download"],
  youtube: ["cobalt", "ytdown", "video", "download", "subtitle edit"],
  artcraft: ["artcraft", "design", "creative", "rust", "3d", "flux", "illustration"],
  tiktok: ["tikwm", "cobalt", "no watermark", "tiktok downloader", "save video", "mp3"],
  book: ["annas archive", "standard ebooks", "ebooks", "textbooks", "read", "education"],
  books: ["annas archive", "standard ebooks", "ebooks", "textbooks", "read", "education"],
  ebooks: ["annas archive", "standard ebooks", "books", "epub", "kindle"],
  textbooks: ["annas archive", "research papers", "books", "education", "consensus"],
  photography: ["photoskop", "camera", "aperture", "iso", "shutter", "dslr"],
  camera: ["photoskop", "photography", "exposure triangle", "iso", "lens"],
  theory: ["muted", "circle of fifths", "chords", "fretboard", "scales"],
  drawing: ["animeoutline", "artcraft", "excalidraw", "sketching", "illustration"],
  anime: ["animeoutline", "manga", "drawing tutorial", "sketching"],
  manga: ["animeoutline", "anime drawing", "proportions", "anatomy"],
};

export default function Home() {
  const [customTools, setCustomTools] = useState<Tool[]>([]);
  const tools = useMemo(() => [...INITIAL_TOOLS, ...customTools], [customTools]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [onlyNoSignup, setOnlyNoSignup] = useState<boolean>(false);
  const [onlyOpenSource, setOnlyOpenSource] = useState<boolean>(false);
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [isConciergeOpen, setIsConciergeOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Global Keyboard shortcut (⌘J or Ctrl+J) for ToolDeck AI Concierge
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "j") {
        e.preventDefault();
        setIsConciergeOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // 1. Framer Motion Scroll Telemetry & Progress
  const { scrollY, scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });
  const backgroundOrbY = useTransform(scrollY, [0, 1000], [0, 220]);
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    return scrollY.on("change", (latest) => {
      setShowBackToTop(latest > 350);
    });
  }, [scrollY]);

  // Compute category counts
  const categoryCounts = useMemo(() => {
    const list: { name: string; count: number | string }[] = [
      { name: "All", count: "100+" },
    ];

    const categoryMap: Record<string, number> = {};
    for (const tool of tools) {
      categoryMap[tool.category] = (categoryMap[tool.category] || 0) + 1;
    }

    for (const [name, count] of Object.entries(categoryMap)) {
      list.push({ name, count });
    }

    return list;
  }, [tools]);

  // Ultra-Sharp Task-oriented, acronym-aware, and fuzzy filtering engine
  const filteredTools = useMemo(() => {
    const rawQuery = searchQuery.trim().toLowerCase();
    const tokens = rawQuery ? rawQuery.split(/\s+/).filter(Boolean) : [];

    return tools.filter((tool) => {
      // 1. Category Filter
      if (selectedCategory !== "All" && tool.category !== selectedCategory) {
        return false;
      }

      // 2. No Signup Filter
      if (onlyNoSignup && tool.requireSignUp) {
        return false;
      }

      // 3. Open Source Filter
      if (onlyOpenSource && tool.pricing !== "Open Source") {
        return false;
      }

      // 4. Smart Acronym & Multi-Token Matcher
      if (tokens.length > 0) {
        const toolName = tool.name.toLowerCase();
        const toolTagline = tool.tagline.toLowerCase();
        const toolDesc = tool.description.toLowerCase();
        const toolCategory = tool.category.toLowerCase();
        const toolTags = tool.tags.map((t) => t.toLowerCase());
        const toolFeatures = tool.feature.map((f) => f.toLowerCase());

        // Every token typed by the user must match at least one attribute or its synonym
        return tokens.every((token) => {
          // Expand token into all known synonyms and acronyms
          const variants = [token, ...(SYNONYM_MAP[token] || [])];

          return variants.some((v) => {
            // Check direct inclusion
            if (
              toolName.includes(v) ||
              toolTagline.includes(v) ||
              toolDesc.includes(v) ||
              toolCategory.includes(v) ||
              toolTags.some((tag) => tag.includes(v)) ||
              toolFeatures.some((feat) => feat.includes(v))
            ) {
              return true;
            }

            // Check prefix matching (e.g. "des" matches "design", "sec" matches "security")
            if (
              toolCategory.startsWith(v) ||
              toolName.split(/\s+/).some((w) => w.startsWith(v)) ||
              toolTags.some((t) => t.startsWith(v))
            ) {
              return true;
            }

            return false;
          });
        });
      }

      return true;
    });
  }, [tools, searchQuery, selectedCategory, onlyNoSignup, onlyOpenSource]);

  // 5. Pagination Engine (24 tools per page)
  const [currentPage, setCurrentPage] = useState<number>(1);
  const ITEMS_PER_PAGE = 24;

  // Auto-reset to page 1 whenever any filter or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, onlyNoSignup, onlyOpenSource]);

  const totalPages = Math.ceil(filteredTools.length / ITEMS_PER_PAGE);

  const paginatedTools = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredTools.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredTools, currentPage]);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
    const catalogEl = document.getElementById("catalog-section");
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleSelectTask = (taskPrompt: string) => {
    setSearchQuery(taskPrompt);
    // Auto-scroll slightly down to the tools grid
    window.scrollTo({ top: 380, behavior: "smooth" });
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All");
    setOnlyNoSignup(false);
    setOnlyOpenSource(false);
    setCurrentPage(1);
  };

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground transition-colors selection:bg-brand selection:text-white relative">
      {/* 1. Glowing Top Scroll Progress Bar */}
      <motion.div
        style={{ scaleX }}
        className="fixed top-0 left-0 right-0 h-[2.5px] bg-brand origin-left z-50 shadow-[0_0_12px_rgba(99,91,255,0.85)] pointer-events-none"
      />

      {/* 2. Drifting Ambient Background Parallax Orb */}
      <motion.div
        style={{ y: backgroundOrbY }}
        className="pointer-events-none fixed top-1/4 left-1/2 -translate-x-1/2 -z-10 h-[650px] w-[650px] rounded-full bg-brand/6 blur-[140px]"
      />

      {/* Toast banner notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 rounded-2xl border border-status-free/30 bg-surface px-4 py-3 text-xs font-semibold text-status-free shadow-xl backdrop-blur-md flex items-center gap-2 animate-bounce">
          <ShieldCheck className="h-4 w-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Floating Back to Top Button */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, y: 16, scale: 0.85 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.85 }}
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            aria-label="Scroll back to top"
            title="Scroll to top"
            className="fixed bottom-5 left-5 sm:bottom-6 sm:left-6 z-40 flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full border border-border/80 bg-surface/90 text-muted shadow-lg shadow-black/10 backdrop-blur-md hover:border-brand/70 hover:text-brand hover:shadow-brand/20 hover:shadow-xl transition-all cursor-pointer group"
          >
            <ArrowUp className="h-4 w-4 sm:h-5 sm:w-5 text-brand transition-transform duration-200 group-hover:-translate-y-0.5" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Navbar */}
      <Navbar
        onOpenConcierge={() => setIsConciergeOpen(true)}
        toolCount={tools.length}
      />

      {/* Hero Section */}
      <Hero
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSelectTask={handleSelectTask}
      />

      {/* Category Pills Bar (Always visible with horizontal scroll & reveal controls) */}
      <motion.div
        id="categories-section"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-30px" }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <CategoryPills
          categories={categoryCounts}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
      </motion.div>

      {/* Tools Catalog Container (Scroll-reveal & Paginated across all devices) */}
      <motion.main
        id="catalog-section"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.6 }}
        className="mx-auto w-full max-w-7xl flex-1 px-4 sm:px-6 lg:px-8 py-8"
      >
        {/* Secondary Filter & Status Bar */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-muted flex-wrap">
            <span>Showing</span>
            <span className="font-bold text-foreground">
              {filteredTools.length > 0
                ? `${(currentPage - 1) * ITEMS_PER_PAGE + 1}–${Math.min(
                    currentPage * ITEMS_PER_PAGE,
                    filteredTools.length
                  )}`
                : 0}
            </span>
            <span>of</span>
            <span className="font-bold text-foreground">
              {selectedCategory === "All" && !searchQuery && !onlyNoSignup && !onlyOpenSource
                ? "100+"
                : filteredTools.length}
            </span>
            <span>free tools</span>
            {selectedCategory !== "All" && (
              <span>in <strong className="text-brand">{selectedCategory}</strong></span>
            )}
            {searchQuery && (
              <span>matching &ldquo;{searchQuery}&rdquo;</span>
            )}
          </div>

          {/* Quick Filter Toggles */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => setOnlyNoSignup(!onlyNoSignup)}
              className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
                onlyNoSignup
                  ? "bg-status-free-bg text-status-free border border-status-free/30"
                  : "border border-border bg-surface text-muted hover:text-foreground"
              }`}
            >
              ✓ No Signup Required
            </button>

            <button
              type="button"
              onClick={() => setOnlyOpenSource(!onlyOpenSource)}
              className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
                onlyOpenSource
                  ? "bg-brand/10 text-brand border border-brand/30"
                  : "border border-border bg-surface text-muted hover:text-foreground"
              }`}
            >
              ⚡ Open Source Only
            </button>

            {(searchQuery || selectedCategory !== "All" || onlyNoSignup || onlyOpenSource) && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="flex items-center gap-1 rounded-xl border border-border bg-surface px-2.5 py-1.5 text-xs text-muted hover:text-foreground"
              >
                <RefreshCcw className="h-3 w-3" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* Tool Cards Grid with Scroll-Triggered Fade-In */}
        {filteredTools.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {paginatedTools.map((tool, idx) => (
                <motion.div
                  key={tool.id}
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "0px 0px -30px 0px", amount: 0.08 }}
                  transition={{
                    duration: 0.35,
                    ease: [0.16, 1, 0.3, 1],
                    delay: (idx % 3) * 0.04,
                  }}
                  style={{
                    contentVisibility: "auto",
                    containIntrinsicSize: "0 230px",
                  }}
                >
                  <ToolCard
                    tool={tool}
                    onSelect={(t) => setSelectedTool(t)}
                  />
                </motion.div>
              ))}
            </div>

            {/* Pagination Navigation Bar (Activates on 100+ tools) */}
            {totalPages > 1 && (
              <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-border/80 pt-6">
                <p className="text-xs font-medium text-muted">
                  Page <strong className="text-foreground font-bold">{currentPage}</strong> of{" "}
                  <strong className="text-foreground font-bold">{totalPages}</strong> (
                  {selectedCategory === "All" && !searchQuery && !onlyNoSignup && !onlyOpenSource
                    ? "100+ tools available"
                    : `${filteredTools.length} matching tools`}
                  )
                </p>

                <div className="flex items-center gap-1.5 flex-wrap justify-center">
                  <button
                    type="button"
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                    className="flex h-9 items-center gap-1 rounded-xl border border-border bg-surface px-3 text-xs font-semibold text-foreground transition-all hover:border-brand hover:text-brand disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span className="hidden sm:inline">Previous</span>
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      type="button"
                      onClick={() => handlePageChange(page)}
                      className={`flex h-9 w-9 items-center justify-center rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        currentPage === page
                          ? "bg-brand text-white shadow-md shadow-brand/25 scale-105"
                          : "border border-border bg-surface text-muted hover:text-foreground hover:border-brand/40"
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    type="button"
                    disabled={currentPage === totalPages}
                    onClick={() => handlePageChange(currentPage + 1)}
                    className="flex h-9 items-center gap-1 rounded-xl border border-border bg-surface px-3 text-xs font-semibold text-foreground transition-all hover:border-brand hover:text-brand disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
                  >
                    <span className="hidden sm:inline">Next</span>
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          /* Empty Search State */
          <div className="py-20 text-center space-y-4">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-surface text-muted">
              <Sparkles className="h-6 w-6 text-brand" />
            </div>
            <h3 className="font-heading text-lg font-bold text-foreground">
              No matching tools found
            </h3>
            <p className="mx-auto max-w-sm text-xs text-muted">
              We couldn&apos;t find any free tools matching your criteria. Try adjusting your search or clear filters.
            </p>
            <button
              type="button"
              onClick={handleResetFilters}
              className="inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-brand-hover"
            >
              <RefreshCcw className="h-3.5 w-3.5" />
              <span>Clear All Filters</span>
            </button>
          </div>
        )}
      </motion.main>

      {/* Tool Detail Slide-Over Modal */}
      <ToolDetailModal
        tool={selectedTool}
        allTools={tools}
        onClose={() => setSelectedTool(null)}
        onSelectSimilar={(t) => setSelectedTool(t)}
      />

      {/* Floating Cute Robot Head AI Concierge Launcher */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.12, rotate: -4 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsConciergeOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex h-13 w-13 sm:h-14 sm:w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-brand to-indigo-500 text-white shadow-xl shadow-brand/40 transition-all hover:shadow-2xl hover:shadow-brand/60 group cursor-pointer border border-white/25 active:scale-90"
        aria-label="Open AI Concierge (⌘J)"
        title="Ask ToolDeck AI (⌘J)"
      >
        {/* Pulsing online status dot on top-right antenna */}
        <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-status-free opacity-80" />
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-status-free ring-2 ring-background" />
        </span>

        {/* Cute Robot Head Icon */}
        <div className="relative flex items-center justify-center transition-transform group-hover:scale-110">
          <Bot className="h-7 w-7 text-white stroke-[2.2]" />
        </div>
      </motion.button>

      {/* AI Concierge Problem Solver Modal */}
      <AiConciergeModal
        isOpen={isConciergeOpen}
        onClose={() => setIsConciergeOpen(false)}
        onSelectTool={(tool) => setSelectedTool(tool)}
      />

      {/* Editorial Footer */}
      <Footer />
    </div>
  );
}
