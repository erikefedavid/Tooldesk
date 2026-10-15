"use client";

import { Layers, Heart, Sparkles } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-border bg-surface/50 py-12 transition-colors">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          {/* Brand Info */}
          <div className="space-y-1">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand text-white shadow-2xs">
                <Layers className="h-4 w-4" />
              </div>
              <span className="font-heading text-base font-bold text-foreground">
                ToolDeck
              </span>
            </div>
            <p className="text-xs text-muted">
              Find a tool. Get the job done.
            </p>
          </div>

          {/* PRD North Star Design Statement */}
          <div className="max-w-md text-xs text-muted italic">
            &ldquo;ToolDeck is the place you go when you know what you need to accomplish, but don&apos;t yet know which website can do it.&rdquo;
          </div>

          {/* Status & Free Pledge */}
          <div className="flex items-center gap-2 text-xs font-semibold text-muted">
            <span className="flex h-2 w-2 rounded-full bg-status-free" />
            <span>100% Free & Curated for the Open Web</span>
          </div>
        </div>

        <div className="mt-8 border-t border-border/60 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-muted text-center sm:text-left">
          <p>
            &copy; <span suppressHydrationWarning>{new Date().getFullYear()}</span> ToolDeck. All rights reserved.
          </p>
          <p className="flex items-center justify-center gap-1.5 text-muted">
            Curated with <Heart className="h-3 w-3 text-red-500 fill-red-500 inline" /> for creators, students, and developers worldwide.
          </p>
        </div>
      </div>
    </footer>
  );
}
