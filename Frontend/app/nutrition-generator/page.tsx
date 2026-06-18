"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  ChefHat,
  Target,
  User,
  Utensils,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function NutritionGeneratorPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    gender: "",
    age: "",
    height: "",
    weight: "",
    targetWeight: "",
    goal: "",
    activityLevel: "",
    experience: "",
    dietType: "",
    mealsPerDay: "",
    workoutTime: "",
    budget: "",
    foodPreferences: "",
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
      const response = await fetch("/api/nutrition", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error?.message || data.error || "Failed to generate plan");
      }
      localStorage.setItem("nutritionPlan", JSON.stringify(data.plan));
      localStorage.setItem("nutritionFormData", JSON.stringify(formData));
      window.location.href = "/nutrition-generator/result";
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
        <div className="max-w-6xl mx-auto px-4 py-4 md:py-5 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-1.5 md:gap-2 text-white/70 hover:text-primary-400 transition text-sm md:text-base"
          >
            <ArrowLeft size={16} className="md:w-[18px] md:h-[18px]" />
            Home
          </Link>
          <div className="font-black text-lg md:text-xl">
            Gym<span className="text-primary-400">Gen</span> AI
          </div>
          <div className="text-xs md:text-sm text-white/50">Step {step}/3</div>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-4 py-8 md:py-12">
        <div className="text-center mb-8 md:mb-10">
          <div className="inline-flex items-center gap-2 bg-primary-400/10 border border-primary-400/20 rounded-full px-3 py-1.5 mb-4 md:mb-6">
            <ChefHat size={14} className="md:w-[16px] md:h-[16px] text-primary-400" />
            <span className="text-[10px] md:text-xs tracking-wider uppercase">
              AI Nutrition Generator
            </span>
          </div>
          <h1 className="text-2xl md:text-4xl font-black mb-3 md:mb-4">
            Build Your Perfect
            <span className="text-primary-400 block">Nutrition Plan</span>
          </h1>
          <p className="text-white/60 max-w-xl mx-auto text-sm md:text-base">
            Tell us about yourself and GymGen AI will
            generate a personalized nutrition plan
            tailored to your goals and preferences.
          </p>
        </div>

        <div className="mb-8 md:mb-10">
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

        <div className="bg-white/[0.02] border border-white/10 rounded-3xl p-4 md:p-6 lg:p-10 backdrop-blur-sm">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
              >
                <div className="flex items-center gap-2 md:gap-3 mb-6 md:mb-8">
                  <User className="text-primary-400" size={20} />
                  <h2 className="text-xl md:text-2xl font-bold">Personal Details</h2>
                </div>
                <div className="grid md:grid-cols-2 gap-4 md:gap-5">
                  <select
                    className="w-full bg-surface-100/70 border border-white/10 text-white text-sm md:text-base rounded-xl px-3 md:px-4 py-2.5 md:py-3 outline-none focus:border-primary-400/60 transition"
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
                    className="w-full bg-surface-100/70 border border-white/10 text-white text-sm md:text-base placeholder-white/40 rounded-xl px-3 md:px-4 py-2.5 md:py-3 outline-none focus:border-primary-400/60 transition"
                    value={formData.age}
                    onChange={(e) => updateField("age", e.target.value)}
                  />
                  <input
                    type="number"
                    placeholder="Height (cm)"
                    className="w-full bg-surface-100/70 border border-white/10 text-white text-sm md:text-base placeholder-white/40 rounded-xl px-3 md:px-4 py-2.5 md:py-3 outline-none focus:border-primary-400/60 transition"
                    value={formData.height}
                    onChange={(e) => updateField("height", e.target.value)}
                  />
                  <input
                    type="number"
                    placeholder="Weight (kg)"
                    className="w-full bg-surface-100/70 border border-white/10 text-white text-sm md:text-base placeholder-white/40 rounded-xl px-3 md:px-4 py-2.5 md:py-3 outline-none focus:border-primary-400/60 transition"
                    value={formData.weight}
                    onChange={(e) => updateField("weight", e.target.value)}
                  />
                  <input
                    type="number"
                    placeholder="Target Weight (kg)"
                    className="w-full bg-surface-100/70 border border-white/10 text-white text-sm md:text-base placeholder-white/40 rounded-xl px-3 md:px-4 py-2.5 md:py-3 outline-none focus:border-primary-400/60 transition md:col-span-2"
                    value={formData.targetWeight}
                    onChange={(e) => updateField("targetWeight", e.target.value)}
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
                <div className="flex items-center gap-2 md:gap-3 mb-6 md:mb-8">
                  <Target className="text-primary-400" size={20} />
                  <h2 className="text-xl md:text-2xl font-bold">Goals & Activity</h2>
                </div>
                <div className="space-y-6 md:space-y-8">
                  <div>
                    <h3 className="text-base md:text-lg font-semibold mb-3 md:mb-4">Goal</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                      {["Fat Loss", "Muscle Gain", "Weight Maintenance", "Strength", "Athletic Performance"].map((goal) => (
                        <button
                          key={goal}
                          type="button"
                          onClick={() => updateField("goal", goal)}
                          className={`p-3 md:p-4 rounded-xl border transition text-center text-sm ${
                            formData.goal === goal
                              ? "border-primary-400 bg-primary-400/10"
                              : "border-white/10 hover:border-white/20"
                          }`}
                        >
                          {goal}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-base md:text-lg font-semibold mb-3 md:mb-4">Activity Level</h3>
                    <div className="grid md:grid-cols-2 gap-3 md:gap-4">
                      {["Sedentary", "Lightly Active", "Moderately Active", "Very Active", "Athlete"].map((level) => (
                        <button
                          key={level}
                          type="button"
                          onClick={() => updateField("activityLevel", level)}
                          className={`p-3 md:p-4 rounded-xl border transition text-left text-sm ${
                            formData.activityLevel === level
                              ? "border-primary-400 bg-primary-400/10"
                              : "border-white/10 hover:border-white/20"
                          }`}
                        >
                          {level}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-base md:text-lg font-semibold mb-3 md:mb-4">Experience</h3>
                    <div className="grid md:grid-cols-3 gap-3 md:gap-4">
                      {["Beginner", "Intermediate", "Advanced"].map((exp) => (
                        <button
                          key={exp}
                          type="button"
                          onClick={() => updateField("experience", exp)}
                          className={`p-3 md:p-4 rounded-xl border transition text-center text-sm ${
                            formData.experience === exp
                              ? "border-primary-400 bg-primary-400/10"
                              : "border-white/10 hover:border-white/20"
                          }`}
                        >
                          {exp}
                        </button>
                      ))}
                    </div>
                  </div>
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
                <div className="flex items-center gap-2 md:gap-3 mb-6 md:mb-8">
                  <Utensils className="text-primary-400" size={20} />
                  <h2 className="text-xl md:text-2xl font-bold">Diet Preferences</h2>
                </div>
                <div className="grid md:grid-cols-2 gap-4 md:gap-5">
                  <select
                    className="w-full bg-surface-100/70 border border-white/10 text-white text-sm md:text-base rounded-xl px-3 md:px-4 py-2.5 md:py-3 outline-none focus:border-primary-400/60 transition"
                    value={formData.dietType}
                    onChange={(e) => updateField("dietType", e.target.value)}
                  >
                    <option value="" className="bg-[#111113]">Diet Type</option>
                    <option value="Vegetarian" className="bg-[#111113]">Vegetarian</option>
                    <option value="Eggetarian" className="bg-[#111113]">Eggetarian</option>
                    <option value="Non Vegetarian" className="bg-[#111113]">Non Vegetarian</option>
                    <option value="Vegan" className="bg-[#111113]">Vegan</option>
                  </select>
                  <select
                    className="w-full bg-surface-100/70 border border-white/10 text-white text-sm md:text-base rounded-xl px-3 md:px-4 py-2.5 md:py-3 outline-none focus:border-primary-400/60 transition"
                    value={formData.mealsPerDay}
                    onChange={(e) => updateField("mealsPerDay", e.target.value)}
                  >
                    <option value="" className="bg-[#111113]">Meals Per Day</option>
                    <option value="3" className="bg-[#111113]">3 Meals</option>
                    <option value="4" className="bg-[#111113]">4 Meals</option>
                    <option value="5" className="bg-[#111113]">5 Meals</option>
                    <option value="6" className="bg-[#111113]">6 Meals</option>
                  </select>
                  <select
                    className="w-full bg-surface-100/70 border border-white/10 text-white text-sm md:text-base rounded-xl px-3 md:px-4 py-2.5 md:py-3 outline-none focus:border-primary-400/60 transition"
                    value={formData.workoutTime}
                    onChange={(e) => updateField("workoutTime", e.target.value)}
                  >
                    <option value="" className="bg-[#111113]">Workout Time</option>
                    <option value="Morning" className="bg-[#111113]">Morning</option>
                    <option value="Afternoon" className="bg-[#111113]">Afternoon</option>
                    <option value="Evening" className="bg-[#111113]">Evening</option>
                  </select>
                  <select
                    className="w-full bg-surface-100/70 border border-white/10 text-white text-sm md:text-base rounded-xl px-3 md:px-4 py-2.5 md:py-3 outline-none focus:border-primary-400/60 transition"
                    value={formData.budget}
                    onChange={(e) => updateField("budget", e.target.value)}
                  >
                    <option value="" className="bg-[#111113]">Budget</option>
                    <option value="Low Budget" className="bg-[#111113]">Low Budget</option>
                    <option value="Moderate Budget" className="bg-[#111113]">Moderate Budget</option>
                    <option value="Premium" className="bg-[#111113]">Premium</option>
                  </select>
                  <select
                    className="w-full bg-surface-100/70 border border-white/10 text-white text-sm md:text-base rounded-xl px-3 md:px-4 py-2.5 md:py-3 outline-none focus:border-primary-400/60 transition md:col-span-2"
                    value={formData.foodPreferences}
                    onChange={(e) => updateField("foodPreferences", e.target.value)}
                  >
                    <option value="" className="bg-[#111113]">Food Preferences</option>
                    <option value="Indian" className="bg-[#111113]">Indian</option>
                    <option value="South Indian" className="bg-[#111113]">South Indian</option>
                    <option value="North Indian" className="bg-[#111113]">North Indian</option>
                    <option value="Mixed" className="bg-[#111113]">Mixed</option>
                  </select>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex justify-between mt-8 md:mt-10">
            <button
              onClick={prevStep}
              disabled={step === 1}
              className="px-4 md:px-6 py-2.5 md:py-3 border border-white/10 rounded-xl disabled:opacity-30 hover:border-white/20 transition text-sm md:text-base"
            >
              Previous
            </button>
            {step < 3 ? (
              <button
                onClick={nextStep}
                className="bg-primary-400 text-black px-4 md:px-6 py-2.5 md:py-3 rounded-xl font-semibold flex items-center gap-1.5 md:gap-2 hover:bg-primary-300 transition text-sm md:text-base"
              >
                Next <ArrowRight size={16} className="md:w-[18px] md:h-[18px]" />
              </button>
            ) : (
              <button
                onClick={handleGenerate}
                disabled={loading}
                className="bg-primary-400 text-black px-4 md:px-6 py-2.5 md:py-3 rounded-xl font-bold hover:bg-primary-300 transition disabled:opacity-50 text-sm md:text-base"
              >
                {loading ? "Generating..." : "Generate Nutrition Plan"}
              </button>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
