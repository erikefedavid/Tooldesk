"use client";

import { useState, useRef, useEffect } from "react";
import { Tool } from "@/type/tool";
import { solveProblem, ConciergeRecommendation } from "@/lib/aiConcierge";
import {
  Sparkles,
  Send,
  X,
  ExternalLink,
  ShieldAlert,
  Lightbulb,
  CheckCircle2,
  RotateCcw,
  Bot,
  ArrowRight,
  Flame,
  Copy,
  Check,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  text?: string;
  source?: "gemini" | "local";
  recommendation?: ConciergeRecommendation;
}

interface AiConciergeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTool: (tool: Tool) => void;
}

const STARTER_PROMPTS = [
  "Download video without adware or watermarks",
  "Merge 10 PDFs without hitting paywalls",
  "Cut 4K video fast without re-encoding",
  "Erase objects & watermarks from photos",
  "AirDrop alternative over local Wi-Fi",
  "In-browser audio waveform editor",
  "Unlimited architecture diagrams & flowcharts",
  "Send a self-destructing password note",
];

// Elegant lightweight markdown parser for clean bolding, inline code & paragraphs
function FormattedText({ content }: { content: string }) {
  const paragraphs = content.split("\n").filter((p, idx, arr) => p.trim() || arr[idx - 1]?.trim());

  return (
    <div className="space-y-2 text-sm leading-relaxed">
      {paragraphs.map((para, pIdx) => {
        if (!para.trim()) return <div key={pIdx} className="h-1" />;
        const segments = para.split(/(\*\*.*?\*\*|`.*?`)/g);

        return (
          <p key={pIdx}>
            {segments.map((seg, sIdx) => {
              if (seg.startsWith("**") && seg.endsWith("**")) {
                return (
                  <strong key={sIdx} className="font-bold text-foreground">
                    {seg.slice(2, -2)}
                  </strong>
                );
              }
              if (seg.startsWith("`") && seg.endsWith("`")) {
                return (
                  <code
                    key={sIdx}
                    className="rounded bg-brand/10 text-brand px-1.5 py-0.5 font-mono text-[11px]"
                  >
                    {seg.slice(1, -1)}
                  </code>
                );
              }
              return seg;
            })}
          </p>
        );
      })}
    </div>
  );
}

export default function AiConciergeModal({
  isOpen,
  onClose,
  onSelectTool,
}: AiConciergeModalProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "initial-welcome",
      role: "assistant",
      text: "Hey! Can't remember a tool's name or tired of aggressive paywalls and ad-bloat? Tell me what you're trying to do, and I'll find the cleanest 100% free tool for the job.",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [messages, isOpen, isThinking]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const handleCopyRecommendation = (rec: ConciergeRecommendation) => {
    const copyText = `⚡ ToolDeck Cheat Code: ${rec.tool.name} (${rec.tool.websiteUrl})\nWhy: ${rec.reason}\nPro Tip: ${rec.cheatCodeTip}`;
    navigator.clipboard.writeText(copyText);
    setCopiedId(rec.tool.id);
    setTimeout(() => setCopiedId(null), 2200);
  };

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || inputValue).trim();
    if (!query || isThinking) return;

    const userMessageId = `user-${Date.now()}`;
    const newMessages: ChatMessage[] = [
      ...messages,
      { id: userMessageId, role: "user", text: query },
    ];

    setMessages(newMessages);
    setInputValue("");
    setIsThinking(true);

    try {
      // Call Next.js API route /api/chat (API key safely secured in server .env)
      const historyPayload = newMessages.map((m) => ({
        role: m.role,
        content: m.text || (m.recommendation ? `Recommended: ${m.recommendation.tool.name}` : ""),
      }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: query,
          history: historyPayload,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setMessages((prev) => [
          ...prev,
          {
            id: `bot-${Date.now()}`,
            role: "assistant",
            text: data.text,
            source: data.source,
            recommendation: data.recommendation,
          },
        ]);
      } else {
        throw new Error("API call returned non-200");
      }
    } catch (err) {
      console.warn("API route failed, falling back to local solver:", err);
      // Instant offline fallback to local solver
      const recommendation = solveProblem(query);
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          role: "assistant",
          text: `I've matched your request to **${recommendation.tool.name}**. It solves this cleanly without hidden charges or paywalls.`,
          source: "local",
          recommendation,
        },
      ]);
    } finally {
      setIsThinking(false);
    }
  };

  const handleReset = () => {
    setMessages([
      {
        id: "initial-welcome",
        role: "assistant",
        text: "Conversation reset! What problem are you trying to solve next?",
      },
    ]);
    setInputValue("");
    inputRef.current?.focus();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-hidden">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/75 backdrop-blur-md"
        />

        {/* Modal Dialog */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 flex h-[90vh] max-h-[740px] w-full max-w-2xl flex-col rounded-3xl border border-border bg-surface shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border/80 px-5 py-3.5 bg-surface/95 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-brand to-indigo-500 text-white shadow-md shadow-brand/25">
                <Bot className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-status-free opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-status-free ring-2 ring-surface" />
                </span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-heading text-base font-bold text-foreground">
                    ToolDeck AI Concierge
                  </h2>
                  <span className="rounded-full bg-status-free-bg px-2 py-0.5 text-[10px] font-bold text-status-free border border-status-free/20 flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-status-free" />
                    <span>Active</span>
                  </span>
                </div>
                <p className="text-xs text-muted">
                  Instant problem-solver • Zero paywalls & hidden fees
                </p>
              </div>
            </div>

            {/* Right Header Controls */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleReset}
                title="Reset conversation"
                aria-label="Reset conversation"
                className="flex h-8 w-8 items-center justify-center rounded-xl text-muted hover:bg-surface-hover hover:text-foreground transition-colors"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </button>

              <button
                type="button"
                onClick={onClose}
                aria-label="Close dialog"
                className="flex h-8 w-8 items-center justify-center rounded-xl text-muted hover:bg-surface-hover hover:text-foreground transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Chat Messages Scroll Feed */}
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5 text-sm">
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.28, ease: "easeOut" }}
                className={`flex gap-3 ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {/* Assistant Avatar */}
                {msg.role === "assistant" && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-brand/12 text-brand mt-0.5 border border-brand/20 shadow-2xs">
                    <Sparkles className="h-4 w-4" />
                  </div>
                )}

                {/* User Message Bubble */}
                {msg.role === "user" && (
                  <div className="max-w-[85%] rounded-2xl rounded-tr-sm bg-gradient-to-r from-brand to-indigo-600 px-4.5 py-2.5 text-white shadow-sm font-medium leading-relaxed">
                    {msg.text}
                  </div>
                )}

                {/* Assistant Content Container */}
                {msg.role === "assistant" && (
                  <div className="w-full max-w-[90%] space-y-3.5">
                    {/* Natural Conversational Bubble */}
                    {msg.text && (
                      <div className="rounded-2xl rounded-tl-sm border border-border/90 bg-background/90 px-4.5 py-3.5 text-foreground shadow-sm">
                        <FormattedText content={msg.text} />
                      </div>
                    )}

                    {/* Elevated Recommendation Solution Card */}
                    {msg.recommendation && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.97, y: 6 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                        className="rounded-2xl border border-border/90 bg-gradient-to-b from-surface to-background/95 p-4 sm:p-5 shadow-lg relative overflow-hidden group"
                      >
                        {/* Top Ambient Glow Accent */}
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand via-indigo-400 to-status-free opacity-80" />

                        {/* Tool Monogram Header & Badges */}
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-border bg-surface font-heading text-lg font-black text-brand shadow-sm">
                              {msg.recommendation.tool.name.slice(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <h3 className="font-heading text-lg font-bold text-foreground flex items-center gap-1.5">
                                  <span>{msg.recommendation.tool.name}</span>
                                  <ShieldCheck className="h-4 w-4 text-status-free inline" />
                                </h3>
                                <span className="rounded-full bg-status-free-bg px-2.5 py-0.5 text-[11px] font-bold text-status-free border border-status-free/20">
                                  {msg.recommendation.tool.pricing}
                                </span>
                                {!msg.recommendation.tool.requireSignUp && (
                                  <span className="rounded-full bg-surface px-2.5 py-0.5 text-[11px] font-medium text-muted border border-border">
                                    No Signup
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-brand font-semibold mt-0.5">
                                {msg.recommendation.tool.category}
                              </p>
                            </div>
                          </div>

                          {/* 1-Click Copy Recommendation Shortcut */}
                          <button
                            type="button"
                            onClick={() => handleCopyRecommendation(msg.recommendation!)}
                            className="flex h-8 w-8 items-center justify-center rounded-xl border border-border bg-surface text-muted hover:border-brand hover:text-brand transition-colors"
                            title="Copy recommendation"
                          >
                            {copiedId === msg.recommendation.tool.id ? (
                              <Check className="h-4 w-4 text-status-free" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </button>
                        </div>

                        {/* Tagline */}
                        <p className="mt-3 text-xs font-medium text-foreground leading-snug">
                          {msg.recommendation.tool.tagline}
                        </p>

                        {/* 3 Modular Insight Pillars */}
                        <div className="mt-4 space-y-2.5">
                          {/* 1. Why this tool */}
                          <div className="flex items-start gap-2.5 rounded-xl bg-status-free-bg/50 p-3 border border-status-free/20">
                            <CheckCircle2 className="h-4 w-4 shrink-0 text-status-free mt-0.5" />
                            <div className="text-xs">
                              <span className="font-bold text-foreground">
                                Why it solves it:{" "}
                              </span>
                              <span className="text-muted leading-relaxed">
                                {msg.recommendation.reason}
                              </span>
                            </div>
                          </div>

                          {/* 2. Commercial Paywall Alert */}
                          <div className="flex items-start gap-2.5 rounded-xl bg-amber-500/10 p-3 border border-amber-500/20">
                            <ShieldAlert className="h-4 w-4 shrink-0 text-amber-500 mt-0.5" />
                            <div className="text-xs">
                              <span className="font-bold text-amber-600 dark:text-amber-400">
                                Paywall & Trap Alert:{" "}
                              </span>
                              <span className="text-muted leading-relaxed">
                                {msg.recommendation.paywallWarning}
                              </span>
                            </div>
                          </div>

                          {/* 3. Pro Tip / Cheat Code */}
                          <div className="flex items-start gap-2.5 rounded-xl bg-brand/10 p-3 border border-brand/20">
                            <Lightbulb className="h-4 w-4 shrink-0 text-brand mt-0.5" />
                            <div className="text-xs">
                              <span className="font-bold text-brand">
                                Pro Tip:{" "}
                              </span>
                              <span className="text-muted leading-relaxed">
                                {msg.recommendation.cheatCodeTip}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Secondary alternative if available */}
                        {msg.recommendation.secondaryTool && (
                          <div className="mt-3.5 flex items-center justify-between rounded-xl border border-dashed border-border px-3.5 py-2 text-xs text-muted bg-surface/40">
                            <span>
                              Alternative:{" "}
                              <strong className="text-foreground">
                                {msg.recommendation.secondaryTool.name}
                              </strong>{" "}
                              ({msg.recommendation.secondaryTool.tagline})
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                onSelectTool(msg.recommendation!.secondaryTool!);
                                onClose();
                              }}
                              className="text-brand hover:underline font-semibold flex items-center gap-1 shrink-0 ml-2"
                            >
                              <span>Inspect</span>
                              <ArrowRight className="h-3 w-3" />
                            </button>
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div className="mt-4.5 flex flex-wrap items-center gap-2.5">
                          <a
                            href={msg.recommendation.tool.websiteUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand to-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-brand/25 hover:shadow-lg hover:shadow-brand/35 transition-all active:scale-95"
                          >
                            <span>Launch {msg.recommendation.tool.name}</span>
                            <ExternalLink className="h-3.5 w-3.5" />
                          </a>
                          <button
                            type="button"
                            onClick={() => {
                              onSelectTool(msg.recommendation!.tool);
                              onClose();
                            }}
                            className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-surface px-3.5 py-2.5 text-xs font-semibold text-foreground hover:bg-surface-hover hover:border-brand/40 transition-all"
                          >
                            <span>View in Catalog</span>
                          </button>
                          {copiedId === msg.recommendation.tool.id && (
                            <span className="text-[11px] font-semibold text-status-free flex items-center gap-1 ml-auto">
                              <Check className="h-3.5 w-3.5" />
                              <span>Copied summary!</span>
                            </span>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </div>
                )}
              </motion.div>
            ))}

            {/* Thinking / Analyzing Indicator */}
            {isThinking && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand/12 text-brand border border-brand/20">
                  <Sparkles className="h-4 w-4 animate-spin" />
                </div>
                <div className="flex items-center gap-2 rounded-2xl rounded-tl-sm border border-border bg-background px-4 py-2.5 text-xs text-muted shadow-2xs">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-brand" />
                  </span>
                  <span>Scanning catalog & diagnosing cleanest solution...</span>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Starter Chips */}
          {messages.length <= 2 && (
            <div className="border-t border-border/60 bg-background/50 px-5 py-3">
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted flex items-center gap-1.5">
                <Flame className="h-3.5 w-3.5 text-brand" />
                <span>Frequently Asked Problems</span>
              </p>
              <div className="flex flex-wrap gap-1.5">
                {STARTER_PROMPTS.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => handleSend(prompt)}
                    className="rounded-full border border-border bg-surface px-2.5 py-1 text-[11px] text-muted hover:border-brand hover:text-brand hover:bg-surface-hover transition-all"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="border-t border-border p-3 sm:p-4 bg-surface"
          >
            <div className="relative flex items-center">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Describe your problem (e.g. cut video fast without re-encoding)..."
                className="w-full rounded-2xl border border-border bg-background px-4 py-3 pr-12 text-xs sm:text-sm text-foreground placeholder:text-muted focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 transition-all"
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || isThinking}
                aria-label="Send query"
                className="absolute right-2 flex h-8 w-8 items-center justify-center rounded-xl bg-brand text-white shadow-sm transition-all hover:bg-brand-hover disabled:opacity-40 disabled:hover:bg-brand cursor-pointer"
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            </div>
            <div className="mt-2 flex items-center justify-between px-1 text-[11px] text-muted">
              <span>Press Enter to ask • Esc to dismiss</span>
              <span className="hidden sm:inline">Shortcut: ⌘J / Ctrl+J</span>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
