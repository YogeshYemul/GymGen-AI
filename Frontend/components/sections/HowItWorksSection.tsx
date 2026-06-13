"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ClipboardList, Target, Zap, TrendingUp } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: ClipboardList,
    title: "Create Profile",
    description: "Tell us about your fitness level, goals, and preferences."
  },
  {
    number: "02",
    icon: Target,
    title: "Set Your Goals",
    description: "Define your target: muscle gain, fat loss, or strength."
  },
  {
    number: "03",
    icon: Zap,
    title: "Generate AI Plan",
    description: "Get a personalized workout and nutrition plan instantly."
  },
  {
    number: "04",
    icon: TrendingUp,
    title: "Track Progress",
    description: "Monitor your journey and see your transformation in real-time."
  }
];

export default function HowItWorksSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="how-it-works" className="py-16 sm:py-20 px-4 sm:px-6 relative" ref={ref}>
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="text-primary-400 text-xs font-serif tracking-[0.3em] uppercase mb-3 block">
            Simple Process
          </span>
          <h2 className="font-serif font-black text-2xl sm:text-4xl text-white mb-3">
            Transform in 4 Steps
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="flex flex-col items-center text-center"
            >
              <div className="relative mb-5">
                <motion.div
                  initial={{ scale: 0, rotate: -45 }}
                  animate={isInView ? { scale: 1, rotate: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.25 + i * 0.1, type: "spring" }}
                  className="w-16 h-16 relative flex items-center justify-center"
                >
                  <div className="absolute inset-0 bg-primary-400 rotate-45 rounded-md" />
                  <step.icon size={26} className="relative z-10 text-black" />
                </motion.div>
              </div>

              <h3 className="font-serif font-bold text-lg text-white mb-2">
                {step.title}
              </h3>
              <p className="text-white/60 text-sm font-serif leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
