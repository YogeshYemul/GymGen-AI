"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ClipboardList, Cpu, Rocket, BarChart } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: ClipboardList,
    title: "Complete Your Assessment",
    description:
      "Fill in your age, gender, height, weight, fitness goal, experience level, and how many days you can train per week.",
  },
  {
    number: "02",
    icon: Cpu,
    title: "AI Builds Your Plan",
    description:
      "Our AI analyzes your profile and instantly generates a personalized workout split and nutrition plan built for your exact goal.",
  },
  {
    number: "03",
    icon: Rocket,
    title: "Start Training",
    description:
      "Access your workout schedule, exercises, sets, reps, and diet plan. Log your sessions and meals daily.",
  },
  {
    number: "04",
    icon: BarChart,
    title: "Track & Evolve",
    description:
      "Monitor your progress through charts, streaks, and analytics. Your plan adapts as you grow stronger.",
  },
];

export default function HowItWorksSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section id="how-it-works" className="py-24 px-4 sm:px-6 relative" ref={ref}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-20"
        >
          <span className="text-primary-400 text-xs font-serif tracking-[0.3em] uppercase mb-4 block">
            Simple Process
          </span>
          <h2 className="font-serif font-black text-3xl sm:text-5xl text-white leading-tight">
            From Zero to{" "}
            <span className="text-gold-gradient">Elite</span>
            <br />
            in 4 Steps
          </h2>
        </motion.div>

        {/* Steps */}
        <div className="relative">
          {/* Connecting line - desktop */}
          <div className="hidden lg:block absolute top-16 left-0 right-0 h-px">
            <motion.div
              initial={{ scaleX: 0 }}
              animate={isInView ? { scaleX: 1 } : {}}
              transition={{ duration: 1.2, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="h-full origin-left"
              style={{
                background:
                  "linear-gradient(to right, rgba(245,197,24,0.3), rgba(245,197,24,0.1), rgba(245,197,24,0.3))",
              }}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, i) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] }}
                className="relative flex flex-col items-center text-center"
              >
                {/* Number circle */}
                <div className="relative mb-6">
                  <motion.div
                    initial={{ scale: 0, rotate: -45 }}
                    animate={isInView ? { scale: 1, rotate: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.3 + i * 0.15, type: "spring" }}
                    className="w-16 h-16 relative z-10 flex items-center justify-center"
                  >
                    <div className="absolute inset-0 bg-primary-400 rotate-45 rounded-sm" />
                    <step.icon size={22} className="relative z-10 text-black" />
                  </motion.div>
                  <div className="absolute -top-2 -right-2 text-xs font-serif font-black text-primary-400/40">
                    {step.number}
                  </div>
                </div>

                <h3 className="font-serif font-bold text-white text-lg mb-3 leading-tight">
                  {step.title}
                </h3>
                <p className="text-white/40 text-sm font-serif leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-16"
        >
          <a href="/register" className="btn-primary inline-flex items-center gap-2">
            Begin Your Assessment
          </a>
        </motion.div>
      </div>
    </section>
  );
}