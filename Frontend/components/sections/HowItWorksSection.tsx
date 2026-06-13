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
      "Tell us your age, goals, experience level, and how often you can train.",
  },
  {
    number: "02",
    icon: Cpu,
    title: "AI Builds Your Plan",
    description:
      "Our AI analyzes your profile and creates personalized workout and nutrition plans.",
  },
  {
    number: "03",
    icon: Rocket,
    title: "Start Your Journey",
    description:
      "Follow your schedule, log your sessions, and stay consistent with reminders.",
  },
  {
    number: "04",
    icon: BarChart,
    title: "Track & Evolve",
    description:
      "Monitor your progress with charts, and watch your plans adapt as you improve.",
  },
];

export default function HowItWorksSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="how-it-works" className="py-20 px-4 sm:px-6 relative" ref={ref}>
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-400/20 to-transparent" />
      </div>

      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <span className="text-primary-400 text-xs font-serif tracking-[0.3em] uppercase mb-4 block">
            Simple Process
          </span>
          <h2 className="font-serif font-black text-3xl sm:text-5xl text-white leading-tight">
            From Zero to <span className="text-primary-400">Elite</span>
            <br />
            in 4 Steps
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="group relative"
            >
              <div className="relative mb-6">
                <div className="w-16 h-16 relative z-10 flex items-center justify-center mx-auto">
                  <motion.div
                    initial={{ scale: 0, rotate: -45 }}
                    animate={isInView ? { scale: 1, rotate: 0 } : {}}
                    transition={{
                      duration: 0.5,
                      delay: 0.2 + i * 0.15,
                      type: "spring",
                    }}
                    className="absolute inset-0 bg-primary-400 rotate-45 rounded-sm group-hover:shadow-[0_0_30px_rgba(245,197,24,0.4)] transition-shadow"
                  />
                  <step.icon
                    size={24}
                    className="relative z-10 text-black"
                  />
                </div>
                <div className="absolute -top-3 -right-1/2 translate-x-1/2 text-xs font-serif font-black text-primary-400/30">
                  {step.number}
                </div>
              </div>

              <div className="text-center">
                <h3 className="font-serif font-bold text-xl text-white mb-3 group-hover:text-primary-300 transition-colors">
                  {step.title}
                </h3>
                <p className="text-white/50 text-sm font-serif leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
