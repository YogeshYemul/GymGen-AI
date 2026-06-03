"use client";

import { motion } from "framer-motion";

const tickers = [
  "PPL Split",
  "Arnold Split",
  "Upper-Lower",
  "Full Body",
  "Bro Split",
  "HIIT Training",
  "Strength Programming",
  "Cardio Plans",
  "Bulking Diet",
  "Cutting Diet",
  "Maintenance Plan",
  "AI Coaching",
  "Progress Tracking",
  "Body Measurements",
  "Calorie Counting",
];

const duplicated = [...tickers, ...tickers];

export default function MarqueeSection() {
  return (
    <section className="py-12 relative overflow-hidden border-y border-white/5 bg-surface-100">
      {/* Row 1 */}
      <div className="marquee-wrapper mb-4">
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="flex gap-6 whitespace-nowrap"
        >
          {duplicated.map((item, i) => (
            <span
              key={i}
              className="flex items-center gap-3 text-sm font-serif text-white/30 hover:text-white/60 transition-colors cursor-default"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-primary-400/50 flex-shrink-0" />
              {item}
            </span>
          ))}
        </motion.div>
      </div>

      {/* Row 2 - Reverse */}
      <div className="marquee-wrapper">
        <motion.div
          animate={{ x: ["-50%", "0%"] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="flex gap-6 whitespace-nowrap"
        >
          {duplicated.map((item, i) => (
            <span
              key={i}
              className="flex items-center gap-3 text-sm font-serif text-white/20 hover:text-white/50 transition-colors cursor-default"
            >
              <span className="w-1 h-1 rotate-45 bg-primary-400/30 flex-shrink-0" />
              {item}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}