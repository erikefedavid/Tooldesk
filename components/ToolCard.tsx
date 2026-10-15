"use client";

import React, { useRef, useState } from "react";
import { Tool } from "@/type/tool";
import { Check, Sparkles, ArrowUpRight } from "lucide-react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

interface ToolCardProps {
  tool: Tool;
  onSelect: (tool: Tool) => void;
}

export default function ToolCard({ tool, onSelect }: ToolCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const initials = tool.name.slice(0, 2).toUpperCase();

  // Mouse position state for the spotlight sheen
  const [mousePos, setMousePos] = useState({ x: 0, y: 0, isHovered: false });

  // 1. Framer Motion Values for continuous mouse tracking (zero re-renders!)
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // 2. Spring physics: gives the card natural physical weight and organic damping
  const mouseXSpring = useSpring(x, { stiffness: 220, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 220, damping: 20 });

  // 3. Transform mouse offsets (-0.5 to 0.5) into subtle 3D rotational degrees
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7deg", "-7deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7deg", "7deg"]);

  // Animation frame throttle ref for silky mousemove tracking
  const rafRef = useRef<number | null>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    const clientX = e.clientX;
    const clientY = e.clientY;

    rafRef.current = requestAnimationFrame(() => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;
      const mouseX = clientX - rect.left;
      const mouseY = clientY - rect.top;

      const xPct = mouseX / width - 0.5;
      const yPct = mouseY / height - 0.5;

      x.set(xPct);
      y.set(yPct);

      setMousePos({ x: mouseX, y: mouseY, isHovered: true });
    });
  };

  const handleMouseLeave = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    x.set(0);
    y.set(0);
    setMousePos((prev) => ({ ...prev, isHovered: false }));
  };

  const handleExternalClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(tool.websiteUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={() => onSelect(tool)}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        transform: "translateZ(0)",
        willChange: mousePos.isHovered ? "transform" : "auto",
      }}
      whileTap={{ scale: 0.98 }}
      className="group relative flex flex-col justify-between rounded-2xl border border-border/80 bg-surface p-5 shadow-2xs cursor-pointer transition-colors duration-200 hover:border-brand/50 select-none overflow-hidden"
    >
      {/* 4. Interactive Spotlight Sheen: follows cursor coords across the card */}
      {mousePos.isHovered && (
        <div
          className="pointer-events-none absolute -inset-px rounded-2xl opacity-100 transition-opacity duration-300"
          style={{
            background: `radial-gradient(350px circle at ${mousePos.x}px ${mousePos.y}px, rgba(99, 91, 255, 0.12), transparent 70%)`,
          }}
        />
      )}

      {/* Card Content with subtle 3D lift */}
      <div style={{ transform: "translateZ(15px)" }} className="relative z-10">
        {/* Top Header: Logo, Name & Badges */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            {/* Logo container */}
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-border bg-background font-heading text-sm font-extrabold text-brand shadow-2xs group-hover:border-brand/40 group-hover:shadow-sm transition-all">
              {initials}
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-heading text-base font-bold text-foreground group-hover:text-brand transition-colors">
                  {tool.name}
                </h3>
                {tool.isFeatured && (
                  <span className="inline-flex items-center gap-0.5 rounded-full bg-brand/10 px-2 py-0.5 text-[10px] font-bold text-brand border border-brand/20">
                    <Sparkles className="h-2.5 w-2.5" />
                    Featured
                  </span>
                )}
              </div>
              <span className="text-[11px] font-medium text-muted">
                {tool.category}
              </span>
            </div>
          </div>

          {/* External Link Direct Arrow */}
          <button
            type="button"
            onClick={handleExternalClick}
            aria-label={`Open ${tool.name} website`}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-transparent text-muted transition-all hover:border-border hover:bg-surface-hover hover:text-brand"
          >
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </button>
        </div>

        {/* Crisp One-line Tagline */}
        <p className="mt-3 text-xs leading-relaxed text-muted line-clamp-2">
          {tool.tagline}
        </p>

        {/* Feature Pills */}
        <div className="mt-4 flex flex-wrap gap-1.5">
          {tool.feature.slice(0, 2).map((feat, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1 rounded-md bg-background px-2 py-0.5 text-[10px] font-medium text-foreground/80 border border-border/60"
            >
              <Check className="h-2.5 w-2.5 text-status-free" />
              <span className="truncate max-w-[130px]">{feat}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Card Footer: Status Badges & Visit Action */}
      <div
        style={{ transform: "translateZ(10px)" }}
        className="relative z-10 mt-5 flex items-center justify-between border-t border-border/60 pt-3 text-xs"
      >
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="rounded-full bg-status-free-bg px-2 py-0.5 text-[10px] font-bold text-status-free border border-status-free/20">
            {tool.pricing === "Open Source" ? "Open Source" : "100% Free"}
          </span>

          {!tool.requireSignUp && (
            <span className="rounded-full bg-background px-2 py-0.5 text-[10px] font-semibold text-muted border border-border">
              No Signup
            </span>
          )}
        </div>

        {/* Direct Action Link with micro-animation */}
        <button
          type="button"
          onClick={handleExternalClick}
          className="inline-flex items-center gap-1 font-semibold text-brand text-xs hover:underline group-hover:translate-x-0.5 transition-transform"
        >
          <span>Visit</span>
          <ArrowUpRight className="h-3 w-3" />
        </button>
      </div>
    </motion.div>
  );
}
