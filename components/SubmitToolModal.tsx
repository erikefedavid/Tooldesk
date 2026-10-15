"use client";

import { useState } from "react";
import { X, Send, CheckCircle2, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Category } from "@/type/tool";

interface SubmitToolModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitSuccess: (toolName: string) => void;
}

const CATEGORIES: Category[] = [
  "AI",
  "Development",
  "Design",
  "Productivity",
  "Web Utilities",
  "Security",
  "Writing",
  "Audio",
  "Video",
];

export default function SubmitToolModal({
  isOpen,
  onClose,
  onSubmitSuccess,
}: SubmitToolModalProps) {
  const [name, setName] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [category, setCategory] = useState<Category>("AI");
  const [tagline, setTagline] = useState("");
  const [requireSignUp, setRequireSignUp] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !websiteUrl) return;

    // Simulate successful submission
    setSubmitted(true);
    setTimeout(() => {
      onSubmitSuccess(name);
      setSubmitted(false);
      setName("");
      setWebsiteUrl("");
      setTagline("");
      onClose();
    }, 1200);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative z-10 w-full max-w-lg rounded-3xl border border-border bg-surface p-6 sm:p-8 shadow-2xl"
        >
          <button
            type="button"
            onClick={onClose}
            className="absolute top-5 right-5 flex h-8 w-8 items-center justify-center rounded-xl text-muted hover:bg-surface-hover hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>

          {submitted ? (
            <div className="py-8 text-center space-y-3">
              <CheckCircle2 className="h-12 w-12 text-status-free mx-auto" />
              <h3 className="font-heading text-xl font-bold text-foreground">
                Tool Submitted!
              </h3>
              <p className="text-xs text-muted">
                Thank you for contributing to the free community directory.
              </p>
            </div>
          ) : (
            <div>
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-brand" />
                <h3 className="font-heading text-xl font-bold text-foreground">
                  Submit a Free Tool
                </h3>
              </div>
              <p className="mt-1 text-xs text-muted">
                Found a great free AI tool, utility, or software? Share it with the community.
              </p>

              <form onSubmit={handleSubmit} className="mt-5 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Tool Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Cobalt"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs text-foreground placeholder:text-muted/60 focus:outline-none focus:border-brand"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Website URL *
                  </label>
                  <input
                    type="url"
                    required
                    placeholder="https://..."
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                    className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs text-foreground placeholder:text-muted/60 focus:outline-none focus:border-brand"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as Category)}
                    className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-xs text-foreground focus:outline-none focus:border-brand"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    One-line Description
                  </label>
                  <input
                    type="text"
                    placeholder="What does it do in one sentence?"
                    value={tagline}
                    onChange={(e) => setTagline(e.target.value)}
                    className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs text-foreground placeholder:text-muted/60 focus:outline-none focus:border-brand"
                  />
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="requireSignUp"
                    checked={requireSignUp}
                    onChange={(e) => setRequireSignUp(e.target.checked)}
                    className="rounded border-border text-brand focus:ring-brand"
                  />
                  <label htmlFor="requireSignUp" className="text-xs text-foreground cursor-pointer">
                    Requires account registration to use
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full mt-4 flex items-center justify-center gap-2 rounded-xl bg-brand py-3 text-xs font-bold text-white shadow-md shadow-brand/25 hover:bg-brand-hover active:scale-95 transition-all"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>Submit Tool to Directory</span>
                </button>
              </form>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
