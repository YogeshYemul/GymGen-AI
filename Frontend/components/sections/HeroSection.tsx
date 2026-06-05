"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 50]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section
      ref={containerRef}
      className="relative flex items-center justify-center overflow-hidden px-4 sm:px-6 pt-16 md:pt-20 pb-4 md:pb-8"
    >
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-primary-400/10 blur-[120px]" />

        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(245,197,24,0.4) 1px, transparent 1px),
              linear-gradient(90deg, rgba(245,197,24,0.4) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* Particles */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-primary-400/40"
          style={{
            left: `${15 + i * 18}%`,
            top: `${25 + (i % 3) * 20}%`,
          }}
          animate={{
            y: [-8, 8, -8],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: 3 + i,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      <motion.div
        style={{ y, opacity }}
        className="w-full max-w-2xl mx-auto text-center"
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 glass-gold px-4 py-2 rounded-full mb-5"
        >
          <Sparkles size={12} className="text-primary-400" />
          <span className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-white/70">
            AI-Powered Fitness Platform
          </span>
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="font-serif font-black text-4xl sm:text-5xl lg:text-6xl leading-tight mb-3"
        >
          <span className="text-white">Smart Workouts</span>
          <br />
          <span className="text-gold-gradient">
            Better Results.
          </span>
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="text-white/60 text-sm sm:text-base max-w-lg mx-auto leading-relaxed mb-5"
        >
          Personalized workout plans, nutrition guidance and progress tracking powered by AI.
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          <Link
            href="/register"
            className="group btn-primary inline-flex items-center gap-2"
          >
            Start Your Journey
            <ArrowRight
              size={16}
              className="group-hover:translate-x-1 transition-transform duration-200"
            />
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}