"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const testimonials = [
  {
    name: "Arjun Sharma",
    goal: "Muscle Gain · +8kg in 4 months",
    text: "GymGen AI built me a PPL split that actually worked. The AI coach answered all my form questions. Genuinely the best fitness app I've used.",
    avatar: "AS",
    stars: 5,
  },
  {
    name: "Priya Desai",
    goal: "Fat Loss · -12kg in 5 months",
    text: "The diet planner calculated my exact macros and gave me a vegetarian meal plan. I lost 12kg without feeling starved.",
    avatar: "PD",
    stars: 5,
  },
  {
    name: "Rohan Mehta",
    goal: "Strength · Deadlift 180kg",
    text: "The workout generator gave me an Upper-Lower split with progressive overload built in. My deadlift went from 120 to 180kg.",
    avatar: "RM",
    stars: 5,
  },
  {
    name: "Sneha Kulkarni",
    goal: "Maintenance · Consistent for 6 months",
    text: "The streak system and achievement badges keep me showing up every day. I have not missed a workout in 6 months.",
    avatar: "SK",
    stars: 5,
  },
  {
    name: "Vikram Rao",
    goal: "Weight Loss · -18kg in 6 months",
    text: "The progress tracking charts showed me exactly how far I had come. Seeing my weight trend go down every week was incredibly motivating.",
    avatar: "VR",
    stars: 5,
  },
  {
    name: "Anjali Patil",
    goal: "Muscle Gain · +5kg lean mass",
    text: "The AI coach helped me understand nutrition in a way no YouTube video ever did. GymGen is like having a personal trainer available 24/7.",
    avatar: "AP",
    stars: 5,
  },
];

export default function TestimonialsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="testimonials" className="py-24 px-4 sm:px-6" ref={ref}>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <span className="text-primary-400 text-xs font-serif tracking-[0.3em] uppercase mb-4 block">
            Real Results
          </span>
          <h2 className="font-serif font-black text-3xl sm:text-5xl text-white">
            Transformations That
            <br />
            <span className="text-gold-gradient">Speak for Themselves</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="group card-gold relative overflow-hidden"
            >
              {/* Quote mark */}
              <div className="absolute top-4 right-5 text-5xl font-serif text-primary-400/10 leading-none select-none">
                "
              </div>

              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(t.stars)].map((_, j) => (
                  <span key={j} className="text-primary-400 text-sm">★</span>
                ))}
              </div>

              {/* Quote */}
              <p className="text-white/70 text-sm font-serif leading-relaxed mb-5 italic">
                "{t.text}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-sm bg-primary-400/20 border border-primary-400/30 flex items-center justify-center text-primary-400 text-sm font-serif font-bold">
                  {t.avatar}
                </div>
                <div>
                  <div className="text-white text-sm font-serif font-semibold">{t.name}</div>
                  <div className="text-primary-400/60 text-xs font-serif">{t.goal}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}