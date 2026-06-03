"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { ArrowRight, Play, Sparkles, ChevronDown } from "lucide-react";

const heroStats = [
  { value: "50K+", label: "Active Athletes" },
  { value: "98%", label: "Goal Achieved" },
  { value: "200+", label: "Exercises" },
  { value: "4.9★", label: "App Rating" },
];

const rotatingGoals = [
  "Muscle Gain",
  "Weight Loss",
  "Fat Burning",
  "Strength",
  "Endurance",
];

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [goalIndex, setGoalIndex] = useState(0);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setGoalIndex((prev) => (prev + 1) % rotatingGoals.length);
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative min-h-[100dvh] flex flex-col items-center justify-center overflow-hidden pt-24 pb-16 px-4 sm:px-6"
    >
      {/* Animated Background */}
      <div className="absolute inset-0 -z-10">
        {/* Radial glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary-400/8 blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-primary-400/5 blur-[100px]" />

        {/* Grid lines */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(245,197,24,0.5) 1px, transparent 1px),
              linear-gradient(90deg, rgba(245,197,24,0.5) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
          }}
        />

        {/* Diagonal accent line */}
        <div
          className="absolute top-0 right-0 w-px h-full opacity-10"
          style={{
            background:
              "linear-gradient(to bottom, transparent, rgba(245,197,24,0.5), transparent)",
            right: "20%",
          }}
        />
      </div>

      {/* Floating particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-primary-400/40"
          style={{
            left: `${15 + i * 15}%`,
            top: `${20 + (i % 3) * 25}%`,
          }}
          animate={{
            y: [-10, 10, -10],
            opacity: [0.3, 0.7, 0.3],
          }}
          transition={{
            duration: 3 + i * 0.5,
            repeat: Infinity,
            delay: i * 0.4,
            ease: "easeInOut",
          }}
        />
      ))}

      <motion.div style={{ y, opacity }} className="w-full max-w-5xl mx-auto text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="inline-flex items-center gap-2 glass-gold px-4 py-2 rounded-full mb-8"
        >
          <Sparkles size={13} className="text-primary-400" />
          <span className="text-xs text-white/70 font-serif tracking-widest uppercase">
            AI-Powered Fitness Platform
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-primary-400 animate-pulse" />
        </motion.div>

        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <h1 className="font-serif font-black text-4xl sm:text-6xl lg:text-8xl leading-[1.05] tracking-tight mb-3">
            <span className="text-white">Your AI Coach</span>
            <br />
            <span className="text-white/30">Built for</span>
            <br />
            <span className="relative inline-block">
              <AnimatePresence mode="wait">
                <motion.span
                  key={rotatingGoals[goalIndex]}
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -40, opacity: 0 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="text-gold-gradient block"
                >
                  {rotatingGoals[goalIndex]}
                </motion.span>
              </AnimatePresence>
            </span>
          </h1>
        </motion.div>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="text-white/50 text-base sm:text-lg font-serif max-w-xl mx-auto mt-6 mb-10 leading-relaxed"
        >
          Generate personalized workout plans, AI diet nutrition, track your
          progress — all powered by intelligence that adapts to{" "}
          <em className="text-white/70 not-italic font-medium">you</em>.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.55 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Link href="/register" className="group btn-primary flex items-center gap-2 text-base">
            Start Your Journey
            <ArrowRight
              size={16}
              className="group-hover:translate-x-1 transition-transform duration-200"
            />
          </Link>
          <button className="flex items-center gap-3 text-white/60 hover:text-white transition-colors duration-200 font-serif group">
            <span className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center group-hover:border-primary-400/50 group-hover:bg-primary-400/10 transition-all duration-300">
              <Play size={13} className="ml-0.5 text-primary-400" />
            </span>
            Watch Demo
          </button>
        </motion.div>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.75 }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto"
        >
          {heroStats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8 + i * 0.08 }}
              className="glass p-4 rounded-sm text-center group hover:glass-gold transition-all duration-300"
            >
              <div className="text-2xl font-serif font-black text-primary-400 group-hover:gold-glow-text">
                {stat.value}
              </div>
              <div className="text-white/40 text-xs mt-1 font-serif tracking-wide">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/30"
      >
        <span className="text-xs font-serif tracking-widest uppercase">Scroll</span>
        <motion.div
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <ChevronDown size={16} />
        </motion.div>
      </motion.div>
    </section>
  );
}