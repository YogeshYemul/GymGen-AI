"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  Dumbbell,
  Apple,
  TrendingUp,
  Brain,
  Trophy,
  Bell,
  BarChart2,
  Shield,
} from "lucide-react";

const features = [
  {
    icon: Dumbbell,
    title: "AI Workout Generator",
    description:
      "Personalized PPL, Arnold, Bro, Upper-Lower, and Full Body splits tailored to your exact goals and experience level.",
    badge: "Core",
    color: "from-yellow-500/10 to-transparent",
  },
  {
    icon: Apple,
    title: "Smart Diet Planner",
    description:
      "BMR/TDEE-based nutrition plans with Vegetarian & Non-Veg options. Precise macro breakdowns for your goal.",
    badge: "Nutrition",
    color: "from-green-500/10 to-transparent",
  },
  {
    icon: Brain,
    title: "AI Fitness Coach",
    description:
      "Chat with your personal AI coach powered by GPT-4. Ask anything about workouts, diet, and form corrections.",
    badge: "AI",
    color: "from-blue-500/10 to-transparent",
  },
  {
    icon: TrendingUp,
    title: "Progress Tracking",
    description:
      "Log weight, measurements, and body fat. Visualize your transformation with beautiful animated charts.",
    badge: "Analytics",
    color: "from-purple-500/10 to-transparent",
  },
  {
    icon: Trophy,
    title: "Gamification System",
    description:
      "Daily streaks, achievement badges, weekly and monthly fitness challenges to keep you motivated.",
    badge: "Engagement",
    color: "from-orange-500/10 to-transparent",
  },
  {
    icon: BarChart2,
    title: "Analytics Dashboard",
    description:
      "Deep insights into your workout consistency, diet compliance, and goal completion percentages.",
    badge: "Insights",
    color: "from-cyan-500/10 to-transparent",
  },
  {
    icon: Bell,
    title: "Smart Notifications",
    description:
      "Workout reminders, water intake alerts, and meal timing notifications to keep you on schedule.",
    badge: "Reminders",
    color: "from-pink-500/10 to-transparent",
  },
  {
    icon: Shield,
    title: "Secure & Private",
    description:
      "JWT auth, bcrypt hashing, rate limiting, and input validation. Your data stays yours — always.",
    badge: "Security",
    color: "from-red-500/10 to-transparent",
  },
];

export default function FeaturesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="features" className="py-24 px-4 sm:px-6 relative" ref={ref}>
      {/* Subtle BG */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-400/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-400/20 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-16"
        >
          <span className="text-primary-400 text-xs font-serif tracking-[0.3em] uppercase mb-4 block">
            Everything You Need
          </span>
          <h2 className="font-serif font-black text-3xl sm:text-5xl text-white leading-tight mb-4">
            One Platform.
            <span className="text-gold-gradient"> Infinite</span>
            <br />
            Possibilities.
          </h2>
          <p className="text-white/40 max-w-md mx-auto font-serif text-sm sm:text-base leading-relaxed">
            From AI-generated workouts to gamified challenges — GymGen AI has
            every tool you need to hit your goals faster.
          </p>
        </motion.div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
              className="group relative overflow-hidden rounded-sm border border-white/5 bg-surface-100 p-6 hover:border-primary-400/30 transition-all duration-500 hover:shadow-[0_0_40px_rgba(245,197,24,0.07)] cursor-default"
            >
              {/* Gradient BG on hover */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
              />

              {/* Badge */}
              <div className="relative z-10 flex items-start justify-between mb-5">
                <div className="w-11 h-11 flex items-center justify-center bg-primary-400/10 border border-primary-400/20 rounded-sm group-hover:bg-primary-400/20 group-hover:border-primary-400/40 transition-all duration-300">
                  <feature.icon size={20} className="text-primary-400" />
                </div>
                <span className="text-[10px] text-primary-400/60 font-serif tracking-widest uppercase bg-primary-400/5 px-2 py-1 rounded-sm border border-primary-400/10">
                  {feature.badge}
                </span>
              </div>

              {/* Content */}
              <div className="relative z-10">
                <h3 className="font-serif font-bold text-white text-base mb-2 group-hover:text-primary-400 transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-white/40 text-sm font-serif leading-relaxed">
                  {feature.description}
                </p>
              </div>

              {/* Corner accent */}
              <div className="absolute bottom-0 right-0 w-12 h-12 border-t border-l border-primary-400/0 group-hover:border-primary-400/20 transition-all duration-300 rounded-tl-sm" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}