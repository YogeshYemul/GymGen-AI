"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Check, Zap } from "lucide-react";
import Link from "next/link";

const plans = [
  {
    name: "Starter",
    price: "Free",
    period: "forever",
    description: "Perfect for beginners exploring AI fitness.",
    features: [
      "Basic Workout Generator",
      "1 Workout Split",
      "BMR / TDEE Calculator",
      "7-Day Diet Plan",
      "Progress Logging",
      "Exercise Library",
    ],
    cta: "Get Started Free",
    href: "/register",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "₹499",
    period: "per month",
    description: "For serious athletes who want full AI power.",
    features: [
      "All Workout Splits",
      "AI Fitness Coach (Chat)",
      "Advanced Diet Plans",
      "Full Progress Analytics",
      "Gamification & Streaks",
      "PDF Reports & Export",
      "Smart Notifications",
      "Priority Support",
    ],
    cta: "Start Pro Plan",
    href: "/register?plan=pro",
    highlighted: true,
  },
  {
    name: "Elite",
    price: "₹999",
    period: "per month",
    description: "For athletes who demand the absolute best.",
    features: [
      "Everything in Pro",
      "Custom Challenge Creation",
      "Advanced Body Composition",
      "Video Exercise Library",
      "Dedicated AI Coach",
      "1-on-1 Expert Review",
      "Early Feature Access",
      "White-label Export",
    ],
    cta: "Go Elite",
    href: "/register?plan=elite",
    highlighted: false,
  },
];

export default function PricingSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="pricing" className="py-24 px-4 sm:px-6 bg-surface-100" ref={ref}>
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <span className="text-primary-400 text-xs font-serif tracking-[0.3em] uppercase mb-4 block">
            Transparent Pricing
          </span>
          <h2 className="font-serif font-black text-3xl sm:text-5xl text-white">
            Invest in Your
            <span className="text-gold-gradient"> Best Self</span>
          </h2>
          <p className="text-white/40 max-w-sm mx-auto font-serif text-sm mt-4">
            Start free. Upgrade when you are ready to unlock your full potential.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] }}
              className={`relative rounded-sm p-7 transition-all duration-300 ${
                plan.highlighted
                  ? "bg-primary-400 text-black shadow-[0_0_60px_rgba(245,197,24,0.3)] scale-105"
                  : "bg-dark-50 border border-white/5 hover:border-primary-400/20"
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-black text-primary-400 text-xs font-serif font-bold px-4 py-1 rounded-full border border-primary-400/30 whitespace-nowrap flex items-center gap-1">
                  <Zap size={11} className="fill-primary-400" />
                  Most Popular
                </div>
              )}

              <div className="mb-6">
                <h3
                  className={`font-serif font-bold text-xl mb-1 ${
                    plan.highlighted ? "text-black" : "text-white"
                  }`}
                >
                  {plan.name}
                </h3>
                <p
                  className={`text-sm font-serif ${
                    plan.highlighted ? "text-black/60" : "text-white/40"
                  }`}
                >
                  {plan.description}
                </p>
              </div>

              <div className="mb-7">
                <span
                  className={`font-serif font-black text-4xl ${
                    plan.highlighted ? "text-black" : "text-white"
                  }`}
                >
                  {plan.price}
                </span>
                <span
                  className={`text-sm font-serif ml-2 ${
                    plan.highlighted ? "text-black/50" : "text-white/30"
                  }`}
                >
                  {plan.period}
                </span>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5">
                    <Check
                      size={14}
                      className={`mt-0.5 flex-shrink-0 ${
                        plan.highlighted ? "text-black" : "text-primary-400"
                      }`}
                    />
                    <span
                      className={`text-sm font-serif ${
                        plan.highlighted ? "text-black/80" : "text-white/60"
                      }`}
                    >
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <Link
                href={plan.href}
                className={`block text-center py-3 px-6 rounded-sm font-serif font-semibold text-sm transition-all duration-300 ${
                  plan.highlighted
                    ? "bg-black text-primary-400 hover:bg-dark-50"
                    : "bg-primary-400/10 border border-primary-400/30 text-primary-400 hover:bg-primary-400 hover:text-black"
                }`}
              >
                {plan.cta}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}