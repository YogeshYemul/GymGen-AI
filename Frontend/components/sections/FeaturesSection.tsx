"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import {
  Dumbbell,
  Apple,
  TrendingUp,
  Brain,
  Bell,
  BarChart2,
} from "lucide-react";

const features = [
  {
    icon: Dumbbell,
    title: "AI Workout Generator",
    href: "/workout-generator",
    description:
      "Personalized training plans tailored to your fitness goals.",
    badge: "Core",
    color: "from-yellow-500/10 to-transparent",
  },
  {
    icon: Apple,
    title: "Smart Nutrition",
    href: "#",
    description:
      "AI-powered nutrition plans with precise calorie tracking.",
    badge: "Nutrition",
    color: "from-green-500/10 to-transparent",
  },
  {
    icon: Brain,
    title: "AI Fitness Coach",
    href: "#",
    description:
      "Get instant workout and nutrition guidance anytime.",
    badge: "AI",
    color: "from-blue-500/10 to-transparent",
  },
  {
    icon: TrendingUp,
    title: "Progress Tracking",
    href: "#",
    description:
      "Monitor your fitness journey with visual insights.",
    badge: "Analytics",
    color: "from-purple-500/10 to-transparent",
  },
  {
    icon: BarChart2,
    title: "Analytics Dashboard",
    href: "#",
    description:
      "Track performance through detailed fitness analytics.",
    badge: "Insights",
    color: "from-cyan-500/10 to-transparent",
  },
  {
    icon: Bell,
    title: "Smart Notifications",
    href: "#",
    description:
      "Never miss workouts, meals or hydration goals.",
    badge: "Reminders",
    color: "from-pink-500/10 to-transparent",
  },
];

export default function FeaturesSection() {
  const ref = useRef(null);

  const isInView = useInView(ref, {
    once: true,
    margin: "-100px",
  });

  return (
    <section
      id="features"
      ref={ref}
      className="py-16 sm:py-20 px-4 sm:px-6 relative"
    >
      <div className="max-w-6xl mx-auto">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="text-primary-400 text-xs font-serif tracking-[0.3em] uppercase mb-3 block">
            All-In-One Platform
          </span>

          <h2 className="font-serif font-black text-2xl sm:text-4xl text-white mb-3">
            Everything You Need to Transform
          </h2>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feature, i) => (
            <Link
              href={feature.href}
              key={feature.title}
              className="block"
            >
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 0.5,
                  delay: i * 0.1,
                }}
                whileHover={{
                  y: -4,
                  boxShadow:
                    "0 0 40px rgba(245,197,24,0.12)",
                }}
                className="group relative overflow-hidden rounded-lg border border-white/10 bg-surface-100/70 p-6 hover:border-primary-400/40 transition-all duration-300 backdrop-blur-md cursor-pointer h-full"
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                />

                <div className="relative z-10 flex items-start justify-between mb-5">
                  <div className="w-12 h-12 flex items-center justify-center bg-primary-400/10 border border-primary-400/20 rounded-md group-hover:bg-primary-400/20 transition-all duration-300">
                    <feature.icon
                      size={24}
                      className="text-primary-400"
                    />
                  </div>

                  <span className="text-[10px] text-primary-400/70 font-serif tracking-widest uppercase bg-primary-400/5 px-2.5 py-1 rounded-full border border-primary-400/10">
                    {feature.badge}
                  </span>
                </div>

                <div className="relative z-10">
                  <h3 className="font-serif font-bold text-lg text-white mb-2 group-hover:text-primary-300 transition-colors duration-300">
                    {feature.title}
                  </h3>

                  <p className="text-white/60 text-sm font-serif leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}