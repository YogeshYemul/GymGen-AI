"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, CheckCircle2 } from "lucide-react";

const rotatingGoals = [
  "Fat Burning",
  "Muscle Gain",
  "Strength",
  "Athletic Performance",
];

const trustIndicators = [
  "AI Workouts",
  "Nutrition Plans",
  "Progress Tracking",
  "24/7 Coaching",
];

export default function HeroSection() {
  const [goalIndex, setGoalIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setGoalIndex((prev) => (prev + 1) % rotatingGoals.length);
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative overflow-hidden px-4 pt-20 md:pt-24 pb-8 md:pb-12">
      {/* Background Glow */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-40 left-1/2 -translate-x-1/2 w-[400px] h-[400px] md:w-[600px] md:h-[600px] rounded-full bg-primary-400/10 blur-[140px]" />

        <div className="absolute bottom-0 right-1/3 w-[250px] h-[250px] rounded-full bg-primary-400/5 blur-[120px]" />
      </div>

      <div className="max-w-5xl mx-auto text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 border border-primary-400/20 bg-primary-400/5 backdrop-blur-sm px-4 py-2 rounded-full mb-6"
        >
          <Sparkles size={14} className="text-primary-400" />

          <span className="text-[10px] sm:text-xs uppercase tracking-[0.22em] text-white/80 font-semibold">
            AI-Powered Fitness Platform
          </span>
        </motion.div>

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="font-serif font-black leading-[0.95] tracking-tight">
            <span className="block text-white text-4xl sm:text-5xl lg:text-6xl">
              Your AI Coach
            </span>

            <span className="block text-white/20 text-4xl sm:text-5xl lg:text-6xl">
              Built For
            </span>

            <div className="h-[55px] sm:h-[70px] lg:h-[85px] flex items-center justify-center overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.span
                  key={rotatingGoals[goalIndex]}
                  initial={{
                    opacity: 0,
                    y: 40,
                    filter: "blur(6px)",
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    filter: "blur(0px)",
                  }}
                  exit={{
                    opacity: 0,
                    y: -40,
                    filter: "blur(6px)",
                  }}
                  transition={{
                    duration: 0.45,
                  }}
                  className="block text-primary-400 text-3xl sm:text-4xl lg:text-5xl"
                >
                  {rotatingGoals[goalIndex]}
                </motion.span>
              </AnimatePresence>
            </div>
          </h1>
        </motion.div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.7,
            delay: 0.2,
          }}
          className="max-w-xl mx-auto text-white/70 text-sm sm:text-base lg:text-lg leading-relaxed mt-2"
        >
          Train smarter with AI-powered workouts, nutrition plans,
          and progress tracking tailored to you.
        </motion.p>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            delay: 0.4,
          }}
          className="flex flex-wrap justify-center gap-x-6 gap-y-3 mt-6"
        >
          {trustIndicators.map((indicator) => (
            <div
              key={indicator}
              className="flex items-center gap-2 text-white/70"
            >
              <CheckCircle2
                size={14}
                className="text-primary-400 flex-shrink-0"
              />

              <span className="text-xs md:text-sm">
                {indicator}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}