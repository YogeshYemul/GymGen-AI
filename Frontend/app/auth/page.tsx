"use client";

export const dynamic = 'force-dynamic';

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Eye, EyeOff, Mail, Lock, User, CheckCircle2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { createClient } from "@/lib/supabase";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const signupSchema = z
  .object({
    fullName: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email"),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type LoginFormData = z.infer<typeof loginSchema>;
type SignupFormData = z.infer<typeof signupSchema>;

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const signupForm = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const handleLogin = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword(data);
      if (error) throw error;
      toast.success("Welcome back!");
      router.push("/");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (data: SignupFormData) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.fullName,
          },
        },
      });
      if (error) throw error;
      toast.success("Account created! Check your email.");
      router.push("/");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Signup failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-primary-400/10 blur-[100px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] rounded-full bg-primary-400/5 blur-[80px]" />
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `linear-gradient(rgba(245,197,24,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(245,197,24,0.5) 1px, transparent 1px)`,
          backgroundSize: "60px 60px"
        }} />
      </div>

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="hidden lg:block"
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="relative w-12 h-12 flex items-center justify-center">
                <div className="absolute inset-0 bg-primary-400 rotate-45 rounded-sm" />
                <Zap size={24} className="relative z-10 text-black fill-black" />
              </div>
              <span className="font-serif font-black text-3xl tracking-tight">
                Gym<span className="text-primary-400">Gen</span>
                <span className="text-white/40 text-lg font-light ml-1">AI</span>
              </span>
            </div>

            <h1 className="font-serif font-black text-5xl lg:text-6xl leading-[1.1] mb-6">
              Unlock Your <br />
              <span className="text-primary-400">Elite Potential</span>
            </h1>

            <p className="text-white/60 text-lg font-serif leading-relaxed mb-10">
              Transform your fitness journey with AI-powered training, personalized nutrition, 
              and smart progress tracking designed specifically for you.
            </p>

            <div className="space-y-6">
              {[
                { title: "AI Workout Generator", desc: "Custom splits tailored to your goals" },
                { title: "Smart Nutrition Planning", desc: "Precise macros and meal plans" },
                { title: "24/7 AI Fitness Coach", desc: "Answers all your fitness questions" }
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 + i * 0.1 }}
                  className="flex items-start gap-4"
                >
                  <div className="mt-1">
                    <CheckCircle2 size={24} className="text-primary-400" />
                  </div>
                  <div>
                    <h3 className="font-serif font-semibold text-white text-lg">{item.title}</h3>
                    <p className="text-white/40 text-sm">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full"
          >
            <div className="lg:hidden flex items-center justify-center gap-3 mb-10">
              <div className="relative w-10 h-10 flex items-center justify-center">
                <div className="absolute inset-0 bg-primary-400 rotate-45 rounded-sm" />
                <Zap size={20} className="relative z-10 text-black fill-black" />
              </div>
              <span className="font-serif font-black text-2xl tracking-tight">
                Gym<span className="text-primary-400">Gen</span>AI
              </span>
            </div>

            <div className="glass-gold rounded-sm p-8 sm:p-10 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-24 h-24 border-t-2 border-l-2 border-primary-400/40" />
              <div className="absolute top-0 right-0 w-24 h-24 border-t-2 border-r-2 border-primary-400/40" />
              <div className="absolute bottom-0 left-0 w-24 h-24 border-b-2 border-l-2 border-primary-400/40" />
              <div className="absolute bottom-0 right-0 w-24 h-24 border-b-2 border-r-2 border-primary-400/40" />

              <div className="relative z-10">
                <div className="text-center mb-8">
                  <h2 className="font-serif font-black text-3xl mb-2">
                    {isLogin ? "Welcome Back" : "Get Started"}
                  </h2>
                  <p className="text-white/50 font-serif">
                    {isLogin
                      ? "Sign in to continue your journey"
                      : "Create your free account today"}
                  </p>
                </div>

                <AnimatePresence mode="wait">
                  {isLogin ? (
                    <motion.form
                      key="login"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                      onSubmit={loginForm.handleSubmit(handleLogin)}
                      className="space-y-5"
                    >
                      <div>
                        <label className="block text-xs font-serif tracking-wide text-white/60 mb-2">
                          Email Address
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                          <input
                            type="email"
                            {...loginForm.register("email")}
                            className="w-full bg-black/40 border border-white/10 rounded-sm py-3.5 pl-12 pr-4 text-white placeholder:text-white/30 focus:outline-none focus:border-primary-400/60 transition-colors"
                            placeholder="you@example.com"
                          />
                        </div>
                        {loginForm.formState.errors.email && (
                          <p className="text-red-400 text-xs mt-1">
                            {loginForm.formState.errors.email.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-serif tracking-wide text-white/60 mb-2">
                          Password
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                          <input
                            type={showPassword ? "text" : "password"}
                            {...loginForm.register("password")}
                            className="w-full bg-black/40 border border-white/10 rounded-sm py-3.5 pl-12 pr-12 text-white placeholder:text-white/30 focus:outline-none focus:border-primary-400/60 transition-colors"
                            placeholder="••••••••"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
                          >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                          </button>
                        </div>
                        {loginForm.formState.errors.password && (
                          <p className="text-red-400 text-xs mt-1">
                            {loginForm.formState.errors.password.message}
                          </p>
                        )}
                      </div>

                      <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full btn-primary flex items-center justify-center gap-2 py-3.5 text-base disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isLoading ? "Signing in..." : "Sign In"}
                      </button>
                    </motion.form>
                  ) : (
                    <motion.form
                      key="signup"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                      onSubmit={signupForm.handleSubmit(handleSignup)}
                      className="space-y-4"
                    >
                      <div>
                        <label className="block text-xs font-serif tracking-wide text-white/60 mb-2">
                          Full Name
                        </label>
                        <div className="relative">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                          <input
                            type="text"
                            {...signupForm.register("fullName")}
                            className="w-full bg-black/40 border border-white/10 rounded-sm py-3.5 pl-12 pr-4 text-white placeholder:text-white/30 focus:outline-none focus:border-primary-400/60 transition-colors"
                            placeholder="John Doe"
                          />
                        </div>
                        {signupForm.formState.errors.fullName && (
                          <p className="text-red-400 text-xs mt-1">
                            {signupForm.formState.errors.fullName.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-serif tracking-wide text-white/60 mb-2">
                          Email Address
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                          <input
                            type="email"
                            {...signupForm.register("email")}
                            className="w-full bg-black/40 border border-white/10 rounded-sm py-3.5 pl-12 pr-4 text-white placeholder:text-white/30 focus:outline-none focus:border-primary-400/60 transition-colors"
                            placeholder="you@example.com"
                          />
                        </div>
                        {signupForm.formState.errors.email && (
                          <p className="text-red-400 text-xs mt-1">
                            {signupForm.formState.errors.email.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-serif tracking-wide text-white/60 mb-2">
                          Password
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                          <input
                            type={showPassword ? "text" : "password"}
                            {...signupForm.register("password")}
                            className="w-full bg-black/40 border border-white/10 rounded-sm py-3.5 pl-12 pr-12 text-white placeholder:text-white/30 focus:outline-none focus:border-primary-400/60 transition-colors"
                            placeholder="••••••••"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
                          >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                          </button>
                        </div>
                        {signupForm.formState.errors.password && (
                          <p className="text-red-400 text-xs mt-1">
                            {signupForm.formState.errors.password.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-serif tracking-wide text-white/60 mb-2">
                          Confirm Password
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                          <input
                            type={showConfirmPassword ? "text" : "password"}
                            {...signupForm.register("confirmPassword")}
                            className="w-full bg-black/40 border border-white/10 rounded-sm py-3.5 pl-12 pr-12 text-white placeholder:text-white/30 focus:outline-none focus:border-primary-400/60 transition-colors"
                            placeholder="••••••••"
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
                          >
                            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                          </button>
                        </div>
                        {signupForm.formState.errors.confirmPassword && (
                          <p className="text-red-400 text-xs mt-1">
                            {signupForm.formState.errors.confirmPassword.message}
                          </p>
                        )}
                      </div>

                      <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full btn-primary flex items-center justify-center gap-2 py-3.5 text-base disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isLoading ? "Creating Account..." : "Create Account"}
                      </button>
                    </motion.form>
                  )}
                </AnimatePresence>

                <div className="mt-8 text-center">
                  <p className="text-white/50 font-serif text-sm">
                    {isLogin
                      ? "Don't have an account?"
                      : "Already have an account?"}{" "}
                    <button
                      onClick={() => {
                        setIsLogin(!isLogin);
                        loginForm.reset();
                        signupForm.reset();
                      }}
                      className="text-primary-400 hover:text-primary-300 font-semibold transition-colors"
                    >
                      {isLogin ? "Create one" : "Sign In"}
                    </button>
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
