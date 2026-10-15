"use client";

import { Tool } from "@/type/tool";
import { X, ExternalLink, Check, Sparkles, Tag, ArrowRight, Layers } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ToolDetailModalProps {
  tool: Tool | null;
  allTools: Tool[];
  onClose: () => void;
  onSelectSimilar: (tool: Tool) => void;
}

export default function ToolDetailModal({
  tool,
  allTools,
  onClose,
  onSelectSimilar,
}: ToolDetailModalProps) {
  if (!tool) return null;

  // Find similar tools in the same category
  const similarTools = allTools
    .filter((t) => t.category === tool.category && t.id !== tool.id)
    .slice(0, 3);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          className="relative z-10 w-full max-w-2xl rounded-3xl border border-border bg-surface p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto"
        >
          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-5 right-5 flex h-8 w-8 items-center justify-center rounded-xl text-muted hover:bg-surface-hover hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Header */}
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-border bg-background font-heading text-xl font-extrabold text-brand shadow-sm">
              {tool.name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="font-heading text-2xl font-bold text-foreground">
                  {tool.name}
                </h2>
                <span className="rounded-full bg-status-free-bg px-2.5 py-0.5 text-xs font-bold text-status-free border border-status-free/20">
                  {tool.pricing}
                </span>
                {!tool.requireSignUp && (
                  <span className="rounded-full bg-background px-2.5 py-0.5 text-xs font-semibold text-muted border border-border">
                    No Signup Required
                  </span>
                )}
              </div>
              <p className="mt-1 text-sm font-medium text-brand">
                {tool.category}
              </p>
            </div>
          </div>

          {/* Tagline */}
          <p className="mt-4 text-base font-semibold text-foreground leading-snug">
            {tool.tagline}
          </p>

          {/* Full Description */}
          <p className="mt-2 text-sm leading-relaxed text-muted">
            {tool.description}
          </p>

          {/* Primary Action Button (PRD: Prominent Visit Website button) */}
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <a
              href={tool.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-5 py-3 text-sm font-bold text-white shadow-md shadow-brand/25 transition-all hover:bg-brand-hover active:scale-95"
            >
              <span>Visit Website</span>
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>

          {/* Key Features List */}
          <div className="mt-6 border-t border-border/80 pt-5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted">
              Key Capabilities
            </h4>
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {tool.feature.map((feat, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2 rounded-xl border border-border/60 bg-background p-2.5 text-xs text-foreground"
                >
                  <Check className="h-4 w-4 shrink-0 text-status-free mt-0.5" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Search Task Tags */}
          <div className="mt-5 border-t border-border/80 pt-4">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-semibold text-muted flex items-center gap-1">
                <Tag className="h-3 w-3" />
                <span>Tags:</span>
              </span>
              {tool.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-md bg-background px-2 py-0.5 text-[11px] text-muted border border-border"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Similar Tools Section (PRD Section 10) */}
          {similarTools.length > 0 && (
            <div className="mt-6 border-t border-border/80 pt-5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted">
                Similar {tool.category} Tools
              </h4>
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {similarTools.map((sim) => (
                  <button
                    key={sim.id}
                    type="button"
                    onClick={() => onSelectSimilar(sim)}
                    className="flex flex-col items-start rounded-xl border border-border bg-background p-3 text-left transition-all hover:border-brand/40 hover:bg-surface-hover"
                  >
                    <span className="font-heading text-xs font-bold text-foreground">
                      {sim.name}
                    </span>
                    <span className="mt-1 line-clamp-1 text-[11px] text-muted">
                      {sim.tagline}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
