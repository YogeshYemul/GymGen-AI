"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, UserPlus, Mail, Lock, User, Chrome, Check } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";

const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Enter a valid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Must contain at least one uppercase letter")
      .regex(/[0-9]/, "Must contain at least one number"),
    confirmPassword: z.string(),
    agreeTerms: z.boolean().refine((v) => v, "You must accept the terms"),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

const passwordStrength = (pw: string) => {
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return score;
};

const strengthLabel = (s: number) => {
  if (s <= 1) return { label: "Weak", color: "bg-red-500" };
  if (s <= 2) return { label: "Fair", color: "bg-orange-400" };
  if (s <= 3) return { label: "Good", color: "bg-yellow-400" };
  return { label: "Strong", color: "bg-primary-400" };
};

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [pwValue, setPwValue] = useState("");

  const strength = passwordStrength(pwValue);
  const { label: strengthText, color: strengthColor } = strengthLabel(strength);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { agreeTerms: false },
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 1500));
      toast.success("Account created! Welcome to GymGen AI 🎉");
    } catch {
      toast.error("Registration failed. Please try again.");
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
        {/* Decorative */}
        <div className="absolute top-0 right-0 w-20 h-20 border-t border-r border-primary-400/10" />
        <div className="absolute bottom-0 left-0 w-16 h-16 border-b border-l border-primary-400/10" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-primary-400/5 blur-[60px] rounded-full" />

        {/* Header */}
        <div className="relative z-10 text-center mb-8">
          <h1 className="font-serif font-black text-2xl sm:text-3xl text-white mb-2">
            Start Your Journey
          </h1>
          <p className="text-white/40 text-sm font-serif">
            Join 50,000+ athletes transforming with AI
          </p>
        </div>

        {/* Google */}
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => toast("Google sign up coming soon!", { icon: "🔄" })}
          className="relative z-10 w-full flex items-center justify-center gap-3 py-3 px-4 bg-surface-200 border border-white/8 rounded-sm text-white/70 text-sm font-serif hover:border-white/20 hover:text-white transition-all duration-300 mb-6"
        >
          <Chrome size={16} className="text-primary-400" />
          Sign up with Google
        </motion.button>

        {/* Divider */}
        <div className="relative z-10 flex items-center gap-4 mb-6">
          <div className="flex-1 h-px bg-white/8" />
          <span className="text-white/25 text-xs font-serif">or register with email</span>
          <div className="flex-1 h-px bg-white/8" />
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="relative z-10 space-y-4"
          noValidate
        >
          {/* Full Name */}
          <div>
            <label className="block text-white/60 text-xs font-serif mb-2 tracking-wide uppercase">
              Full Name
            </label>
            <div className="relative">
              <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/25" />
              <input
                type="text"
                {...register("name")}
                placeholder="Your full name"
                className="input-field pl-10"
                autoComplete="name"
              />
            </div>
            {errors.name && (
              <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-red-400 text-xs mt-1.5 font-serif">
                {errors.name.message}
              </motion.p>
            )}
          </div>

          {/* Email */}
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

          {/* Password */}
          <div>
            <label className="block text-white/60 text-xs font-serif mb-2 tracking-wide uppercase">
              Password
            </label>
            <div className="relative">
              <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/25" />
              <input
                type={showPassword ? "text" : "password"}
                {...register("password", {
                  onChange: (e) => setPwValue(e.target.value),
                })}
                placeholder="Min 8 characters"
                className="input-field pl-10 pr-10"
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/60 transition-colors"
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
            {/* Strength bar */}
            {pwValue && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-2">
                <div className="flex gap-1 mb-1">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className={`h-0.5 flex-1 rounded-full transition-all duration-300 ${
                        i < strength ? strengthColor : "bg-white/10"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-white/30 text-xs font-serif">
                  Password strength:{" "}
                  <span className="text-primary-400">{strengthText}</span>
                </p>
              </motion.div>
            )}
            {errors.password && (
              <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-red-400 text-xs mt-1.5 font-serif">
                {errors.password.message}
              </motion.p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-white/60 text-xs font-serif mb-2 tracking-wide uppercase">
              Confirm Password
            </label>
            <div className="relative">
              <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/25" />
              <input
                type={showConfirm ? "text" : "password"}
                {...register("confirmPassword")}
                placeholder="Repeat your password"
                className="input-field pl-10 pr-10"
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/60 transition-colors"
              >
                {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-red-400 text-xs mt-1.5 font-serif">
                {errors.confirmPassword.message}
              </motion.p>
            )}
          </div>

          {/* Terms */}
          <div className="flex items-start gap-3">
            <div className="relative mt-0.5">
              <input
                type="checkbox"
                id="terms"
                {...register("agreeTerms")}
                className="sr-only peer"
              />
              <label
                htmlFor="terms"
                className="w-4 h-4 border border-white/20 rounded-sm flex items-center justify-center cursor-pointer peer-checked:bg-primary-400 peer-checked:border-primary-400 transition-all duration-200 block"
              >
                <Check size={10} className="text-black opacity-0 peer-checked:opacity-100" />
              </label>
            </div>
            <label htmlFor="terms" className="text-white/40 text-xs font-serif leading-relaxed cursor-pointer">
              I agree to the{" "}
              <Link href="#" className="text-primary-400 hover:text-primary-300">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="#" className="text-primary-400 hover:text-primary-300">
                Privacy Policy
              </Link>
            </label>
          </div>
          {errors.agreeTerms && (
            <p className="text-red-400 text-xs font-serif -mt-2">{errors.agreeTerms.message}</p>
          )}

          {/* Submit */}
          <motion.button
            type="submit"
            disabled={isLoading}
            whileTap={{ scale: 0.98 }}
            className="w-full btn-primary flex items-center justify-center gap-2 mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                Creating Account…
              </>
            ) : (
              <>
                <UserPlus size={16} />
                Create Account
              </>
            )}
          </motion.button>
        </form>

        {/* Login Link */}
        <p className="relative z-10 text-center text-white/40 text-sm font-serif mt-6">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-primary-400 hover:text-primary-300 transition-colors font-semibold"
          >
            Sign in
          </Link>
        </p>
      </div>
    </motion.div>
  );
}