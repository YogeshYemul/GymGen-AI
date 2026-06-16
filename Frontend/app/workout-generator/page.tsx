"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Dumbbell,
  Target,
  User,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function WorkoutGeneratorPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    gender: "",
    age: "",
    height: "",
    weight: "",
    goal: "",
    experience: "",
    workoutDays: "",
    equipment: "",
    duration: "",
  });

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const nextStep = () => {
    if (step < 3) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleGenerate = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/workout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error?.message || data.error || "Failed to generate plan");
      }
      localStorage.setItem("workoutPlan", data.workout);
      localStorage.setItem("workoutFormData", JSON.stringify(formData));
      window.location.href = "/workout-generator/result";
    } catch (error) {
      console.error(error);
      alert("Error: " + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-primary-400/10 blur-[140px]" />
      </div>

      <header className="border-b border-white/5 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-4 py-5 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-white/70 hover:text-primary-400 transition"
          >
            <ArrowLeft size={18} />
            Home
          </Link>
          <div className="font-black text-xl">
            Gym<span className="text-primary-400">Gen</span> AI
          </div>
          <div className="text-sm text-white/50">Step {step}/3</div>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-primary-400/10 border border-primary-400/20 rounded-full px-4 py-2 mb-6">
            <Dumbbell size={16} className="text-primary-400" />
            <span className="text-xs tracking-wider uppercase">
              AI Workout Generator
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-4">
            Build Your Perfect
            <span className="text-primary-400 block">Workout Plan</span>
          </h1>
          <p className="text-white/60 max-w-xl mx-auto">
            Tell us about yourself and GymGen AI will
            generate a personalized workout routine
            tailored to your goals.
          </p>
        </div>

        <div className="mb-10">
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              animate={{
                width: step === 1 ? "33%" : step === 2 ? "66%" : "100%",
              }}
              transition={{ duration: 0.4 }}
              className="h-full bg-primary-400"
            />
          </div>
        </div>

        <div className="bg-white/[0.02] border border-white/10 rounded-3xl p-6 md:p-10 backdrop-blur-sm">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
              >
                <div className="flex items-center gap-3 mb-8">
                  <User className="text-primary-400" />
                  <h2 className="text-2xl font-bold">Personal Information</h2>
                </div>
                <div className="grid md:grid-cols-2 gap-5">
                  <select
                    className="w-full bg-surface-100/70 border border-white/10 text-white rounded-xl px-4 py-3 outline-none focus:border-primary-400/60 transition"
                    value={formData.gender}
                    onChange={(e) => updateField("gender", e.target.value)}
                  >
                    <option value="" className="bg-[#111113]">Select Gender</option>
                    <option value="Male" className="bg-[#111113]">Male</option>
                    <option value="Female" className="bg-[#111113]">Female</option>
                  </select>
                  <input
                    type="number"
                    placeholder="Age"
                    className="w-full bg-surface-100/70 border border-white/10 text-white placeholder-white/40 rounded-xl px-4 py-3 outline-none focus:border-primary-400/60 transition"
                    value={formData.age}
                    onChange={(e) => updateField("age", e.target.value)}
                  />
                  <input
                    type="number"
                    placeholder="Height (cm)"
                    className="w-full bg-surface-100/70 border border-white/10 text-white placeholder-white/40 rounded-xl px-4 py-3 outline-none focus:border-primary-400/60 transition"
                    value={formData.height}
                    onChange={(e) => updateField("height", e.target.value)}
                  />
                  <input
                    type="number"
                    placeholder="Weight (kg)"
                    className="w-full bg-surface-100/70 border border-white/10 text-white placeholder-white/40 rounded-xl px-4 py-3 outline-none focus:border-primary-400/60 transition"
                    value={formData.weight}
                    onChange={(e) => updateField("weight", e.target.value)}
                  />
                </div>
              </motion.div>
            )}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
              >
                <div className="flex items-center gap-3 mb-8">
                  <Target className="text-primary-400" />
                  <h2 className="text-2xl font-bold">Fitness Goal</h2>
                </div>
                <div className="grid gap-4">
                  {["Fat Loss", "Muscle Gain", "Strength", "Athletic Performance"].map((goal) => (
                    <button
                      key={goal}
                      type="button"
                      onClick={() => updateField("goal", goal)}
                      className={`p-4 rounded-xl border transition text-left ${
                        formData.goal === goal
                          ? "border-primary-400 bg-primary-400/10"
                          : "border-white/10 hover:border-white/20"
                      }`}
                    >
                      {goal}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
              >
                <div className="flex items-center gap-3 mb-8">
                  <Dumbbell className="text-primary-400" />
                  <h2 className="text-2xl font-bold">Training Preferences</h2>
                </div>
                <div className="grid md:grid-cols-2 gap-5">
                  <select
                    className="w-full bg-surface-100/70 border border-white/10 text-white rounded-xl px-4 py-3 outline-none focus:border-primary-400/60 transition"
                    value={formData.experience}
                    onChange={(e) => updateField("experience", e.target.value)}
                  >
                    <option value="" className="bg-[#111113]">Experience Level</option>
                    <option value="Beginner" className="bg-[#111113]">Beginner</option>
                    <option value="Intermediate" className="bg-[#111113]">Intermediate</option>
                    <option value="Advanced" className="bg-[#111113]">Advanced</option>
                  </select>
                  <select
                    className="w-full bg-surface-100/70 border border-white/10 text-white rounded-xl px-4 py-3 outline-none focus:border-primary-400/60 transition"
                    value={formData.workoutDays}
                    onChange={(e) => updateField("workoutDays", e.target.value)}
                  >
                    <option value="" className="bg-[#111113]">Workout Days</option>
                    <option value="3" className="bg-[#111113]">3</option>
                    <option value="4" className="bg-[#111113]">4</option>
                    <option value="5" className="bg-[#111113]">5</option>
                    <option value="6" className="bg-[#111113]">6</option>
                  </select>
                  <select
                    className="w-full bg-surface-100/70 border border-white/10 text-white rounded-xl px-4 py-3 outline-none focus:border-primary-400/60 transition"
                    value={formData.equipment}
                    onChange={(e) => updateField("equipment", e.target.value)}
                  >
                    <option value="" className="bg-[#111113]">Equipment</option>
                    <option value="Gym" className="bg-[#111113]">Gym</option>
                    <option value="Dumbbells" className="bg-[#111113]">Dumbbells</option>
                    <option value="Home Workout" className="bg-[#111113]">Home Workout</option>
                    <option value="Bodyweight" className="bg-[#111113]">Bodyweight</option>
                  </select>
                  <select
                    className="w-full bg-surface-100/70 border border-white/10 text-white rounded-xl px-4 py-3 outline-none focus:border-primary-400/60 transition"
                    value={formData.duration}
                    onChange={(e) => updateField("duration", e.target.value)}
                  >
                    <option value="" className="bg-[#111113]">Workout Duration</option>
                    <option value="30 Minutes" className="bg-[#111113]">30 Minutes</option>
                    <option value="45 Minutes" className="bg-[#111113]">45 Minutes</option>
                    <option value="60 Minutes" className="bg-[#111113]">60 Minutes</option>
                    <option value="90 Minutes" className="bg-[#111113]">90 Minutes</option>
                  </select>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex justify-between mt-10">
            <button
              onClick={prevStep}
              disabled={step === 1}
              className="px-6 py-3 border border-white/10 rounded-xl disabled:opacity-30 hover:border-white/20 transition"
            >
              Previous
            </button>
            {step < 3 ? (
              <button
                onClick={nextStep}
                className="bg-primary-400 text-black px-6 py-3 rounded-xl font-semibold flex items-center gap-2 hover:bg-primary-300 transition"
              >
                Next <ArrowRight size={18} />
              </button>
            ) : (
              <button
                onClick={handleGenerate}
                disabled={loading}
                className="bg-primary-400 text-black px-6 py-3 rounded-xl font-bold hover:bg-primary-300 transition disabled:opacity-50"
              >
                {loading ? "Generating..." : "Generate Workout Plan"}
              </button>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
