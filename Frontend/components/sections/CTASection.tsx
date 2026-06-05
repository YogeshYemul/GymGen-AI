"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function CTASection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="py-8 md:py-12 px-4 sm:px-6 relative overflow-hidden" ref={ref}>
      {/* Glow BG */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[300px] rounded-full bg-primary-400/8 blur-[100px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-3xl mx-auto text-center"
      >
          <div className="glass-gold rounded-xl p-8 md:p-10 relative overflow-hidden">          {/* Decorative corner lines */}
          <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-primary-400/40" />
          <div className="absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 border-primary-400/40" />
          <div className="absolute bottom-0 left-0 w-12 h-12 border-b-2 border-l-2 border-primary-400/40" />
          <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-primary-400/40" />

          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={isInView ? { scale: 1, opacity: 1 } : {}}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-5xl mb-6"
          >
            ⚡
          </motion.div>

          <h2 className="font-serif font-black text-3xl sm:text-5xl text-white mb-4 leading-tight">
            Your Best Body Is
            <br />
            <span className="text-gold-gradient">One Click Away</span>
          </h2>
          <p className="text-white/50 font-serif text-sm sm:text-base mb-10 max-w-sm mx-auto leading-relaxed">
            Join 50,000+ athletes already using GymGen AI to train smarter, eat
            better, and track every gain.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/register"
              className="btn-primary flex items-center justify-center gap-2 text-base"
            >
              Create Free Account
              <ArrowRight size={16} />
            </Link>
            <Link href="/auth/login" className="btn-secondary text-center text-base">
              Already have an account?
            </Link>
          </div>

          <p className="text-white/25 text-xs font-serif mt-6">
            No credit card required · Free forever plan available
          </p>
        </div>
      </motion.div>
    </section>
  );
}