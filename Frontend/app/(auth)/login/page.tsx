"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, LogIn, Chrome } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(6, "Password is required"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);

    try {
      console.log(data);

      await new Promise((resolve) =>
        setTimeout(resolve, 1500)
      );

      toast.success("Welcome back! 🎉");
    } catch {
      toast.error("Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="w-full max-w-md"
    >
      <div className="relative bg-surface-100 border border-white/5 rounded-sm p-8 sm:p-10 overflow-hidden">
        
        {/* Decorative Effects */}
        <div className="absolute top-0 right-0 w-20 h-20 border-t border-r border-primary-400/10" />
        <div className="absolute bottom-0 left-0 w-16 h-16 border-b border-l border-primary-400/10" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-primary-400/5 blur-[60px] rounded-full" />

        {/* Header */}
        <div className="relative z-10 text-center mb-8">
          <h1 className="font-serif font-black text-3xl text-white mb-2">
            Welcome Back
          </h1>

          <p className="text-white/40 text-sm font-serif">
            Continue your fitness journey with GymGen AI
          </p>
        </div>

        {/* Google Login */}
        <motion.button
          whileTap={{ scale: 0.98 }}
          type="button"
          onClick={() =>
            toast("Google login coming soon!", {
              icon: "🔄",
            })
          }
          className="relative z-10 w-full flex items-center justify-center gap-3 py-3 px-4 bg-surface-200 border border-white/8 rounded-sm text-white/70 text-sm font-serif hover:border-white/20 hover:text-white transition-all duration-300 mb-6"
        >
          <Chrome
            size={16}
            className="text-primary-400"
          />
          Continue with Google
        </motion.button>

        {/* Divider */}
        <div className="relative z-10 flex items-center gap-4 mb-6">
          <div className="flex-1 h-px bg-white/8" />

          <span className="text-white/25 text-xs font-serif">
            or login with email
          </span>

          <div className="flex-1 h-px bg-white/8" />
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="relative z-10 space-y-4"
          noValidate
        >
          {/* Email */}
          <div>
            <label className="block text-white/60 text-xs font-serif mb-2 tracking-wide uppercase">
              Email Address
            </label>

            <div className="relative">
              <Mail
                size={15}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/25"
              />

              <input
                type="email"
                placeholder="you@example.com"
                {...register("email")}
                className="input-field pl-10"
              />
            </div>

            {errors.email && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-400 text-xs mt-1.5 font-serif"
              >
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
              <Lock
                size={15}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/25"
              />

              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                {...register("password")}
                className="input-field pl-10 pr-10"
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/70 transition-colors"
              >
                {showPassword ? (
                  <EyeOff size={15} />
                ) : (
                  <Eye size={15} />
                )}
              </button>
            </div>

            {errors.password && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-400 text-xs mt-1.5 font-serif"
              >
                {errors.password.message}
              </motion.p>
            )}
          </div>

          {/* Forgot Password */}
          <div className="flex justify-end">
            <Link
              href="/forgot-password"
              className="text-xs text-primary-400 hover:text-primary-300 transition-colors font-serif"
            >
              Forgot Password?
            </Link>
          </div>

          {/* Login Button */}
          <motion.button
            type="submit"
            disabled={isLoading}
            whileTap={{ scale: 0.98 }}
            className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                Signing In...
              </>
            ) : (
              <>
                <LogIn size={16} />
                Sign In
              </>
            )}
          </motion.button>
        </form>

        {/* Register Link */}
        <p className="relative z-10 text-center text-white/40 text-sm font-serif mt-6">
          Don't have an account?{" "}
          <Link
            href="/register"
            className="text-primary-400 hover:text-primary-300 transition-colors font-semibold"
          >
            Create Account
          </Link>
        </p>
      </div>
    </motion.div>
  );
}