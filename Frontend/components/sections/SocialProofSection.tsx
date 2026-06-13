"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Dumbbell, Apple, TrendingUp, Brain } from "lucide-react";

const socialProofCards = [
  {
    icon: Dumbbell,
    title: "AI Personalized",
    description: "Plans tailored to your body."
  },
  {
    icon: Apple,
    title: "Smart Nutrition",
    description: "Meal guidance powered by AI."
  },
  {
    icon: TrendingUp,
    title: "Track Progress",
    description: "Monitor workouts and achievements."
  },
  {
    icon: Brain,
    title: "Always Available",
    description: "24/7 AI coaching support."
  }
];

export default function SocialProofSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="why-choose" className="py-16 sm:py-20 px-4 sm:px-6 relative" ref={ref}>
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="text-primary-400 text-xs font-serif tracking-[0.3em] uppercase mb-3 block">
            Why Choose
          </span>
          <h2 className="font-serif font-black text-2xl sm:text-4xl text-white mb-3">
            Why Athletes Choose GymGen AI
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {socialProofCards.map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -4, boxShadow: "0 0 40px rgba(245,197,24,0.12)" }}
              className="group bg-surface-100/60 border border-white/10 rounded-lg p-6 backdrop-blur-md hover:border-primary-400/40 transition-all duration-300"
            >
              <div className="w-12 h-12 bg-primary-400/10 border border-primary-400/20 rounded-md flex items-center justify-center mb-5 group-hover:bg-primary-400/20 transition-all duration-300">
                <card.icon size={24} className="text-primary-400" />
              </div>
              <h3 className="font-serif font-bold text-lg text-white mb-2 group-hover:text-primary-300 transition-colors duration-300">
                {card.title}
              </h3>
              <p className="text-white/60 text-sm font-serif leading-relaxed">
                {card.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
