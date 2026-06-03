"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, ArrowLeft, Send, CheckCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";

const schema = z.object({
  email: z.string().email("Enter a valid email address"),
});

type FormData = z.infer<typeof schema>;

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 1500));
      setSubmittedEmail(data.email);
      setSubmitted(true);
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="w-full max-w-md"
    >
      <div className="relative bg-surface-100 border border-white/5 rounded-sm p-8 sm:p-10 overflow-hidden">
        <div className="absolute top-0 right-0 w-20 h-20 border-t border-r border-primary-400/10" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-primary-400/5 blur-[60px] rounded-full" />

        <AnimatePresence mode="wait">
          {!submitted ? (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, x: -30 }}
              className="relative z-10"
            >
              <div className="text-center mb-8">
                <div className="w-14 h-14 mx-auto mb-4 relative">
                  <div className="absolute inset-0 bg-primary-400/10 border border-primary-400/20 rounded-sm rotate-45" />
                  <Mail size={22} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary-400" />
                </div>
                <h1 className="font-serif font-black text-2xl text-white mb-2">
                  Forgot Password?
                </h1>
                <p className="text-white/40 text-sm font-serif">
                  No worries. Enter your email and we will send you a reset link.
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
                <div>
                  <label className="block text-white/60 text-xs font-serif mb-2 tracking-wide uppercase">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/25" />
                    <input
                      type="email"
                      {...register("email")}
                      placeholder="you@example.com"
                      className="input-field pl-10"
                      autoComplete="email"
                    />
                  </div>
                  {errors.email && (
                    <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-red-400 text-xs mt-1.5 font-serif">
                      {errors.email.message}
                    </motion.p>
                  )}
                </div>

                <motion.button
                  type="submit"
                  disabled={isLoading}
                  whileTap={{ scale: 0.98 }}
                  className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                      Sending Link…
                    </>
                  ) : (
                    <>
                      <Send size={15} />
                      Send Reset Link
                    </>
                  )}
                </motion.button>
              </form>

              <div className="mt-6 text-center">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 text-white/40 hover:text-white text-sm font-serif transition-colors"
                >
                  <ArrowLeft size={14} />
                  Back to Sign In
                </Link>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              className="relative z-10 text-center"
            >
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", duration: 0.7 }}
                className="w-16 h-16 mx-auto mb-6 flex items-center justify-center"
              >
                <div className="absolute w-16 h-16 bg-primary-400/10 border border-primary-400/30 rounded-sm rotate-45" />
                <CheckCircle size={26} className="text-primary-400 relative z-10" />
              </motion.div>

              <h2 className="font-serif font-black text-2xl text-white mb-3">
                Check Your Email
              </h2>
              <p className="text-white/40 text-sm font-serif mb-2">
                We sent a password reset link to:
              </p>
              <p className="text-primary-400 font-serif font-semibold text-sm mb-8">
                {submittedEmail}
              </p>
              <p className="text-white/25 text-xs font-serif mb-8 leading-relaxed">
                Did not receive the email? Check your spam folder or{" "}
                <button
                  onClick={() => setSubmitted(false)}
                  className="text-primary-400/70 hover:text-primary-400 transition-colors underline underline-offset-2"
                >
                  try again
                </button>
                .
              </p>
              <Link href="/login" className="btn-primary inline-flex items-center gap-2 text-sm">
                <ArrowLeft size={14} />
                Return to Sign In
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}