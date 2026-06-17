"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Download,
  Dumbbell,
  Flame,
  TrendingUp,
  Calendar
} from "lucide-react";

interface Exercise {
  name: string;
  sets: string;
  reps: string;
  rest: string;
  weight?: string;
}

interface WorkoutDay {
  day: string;
  title: string;
  targetMuscles?: string;
  exercises: Exercise[];
}

interface ParsedWorkout {
  summary: {
    goal?: string;
    experience?: string;
    days?: string;
    duration?: string;
    equipment?: string;
  };
  days: WorkoutDay[];
  warmUp: string[];
  coolDown: string[];
  tips: string[];
}

interface FormData {
  gender: string;
  age: string;
  height: string;
  weight: string;
  goal: string;
  experience: string;
  workoutDays: string;
  equipment: string;
  duration: string;
}

function parseMarkdownToWorkout(markdown: string): ParsedWorkout {
  const result: ParsedWorkout = {
    summary: {},
    days: [],
    warmUp: [],
    coolDown: [],
    tips: []
  };

  const lines = markdown.split("\n").map(l => l.trim()).filter(l => l);
  let currentSection: "day" | "warmup" | "cooldown" | "tips" | null = null;
  let currentDay: WorkoutDay | null = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.startsWith("## Warm Up") || line.toLowerCase().includes("warm up")) {
      currentSection = "warmup";
      continue;
    }
    if (line.startsWith("## Cool Down") || line.toLowerCase().includes("cool down")) {
      currentSection = "cooldown";
      continue;
    }
    if (line.startsWith("## Progression Tips") || line.toLowerCase().includes("progression") || line.toLowerCase().includes("tips")) {
      currentSection = "tips";
      continue;
    }
    if (line.startsWith("## Day") || line.startsWith("### Day")) {
      if (currentDay) result.days.push(currentDay);
      currentSection = "day";
      let dayTitle = line.replace(/##?\s*/, "");
      const dayMatch = dayTitle.match(/Day\s*\d+/i);
      let dayName = dayMatch ? dayMatch[0] : `Day ${result.days.length + 1}`;
      let target = dayTitle.replace(dayName, "").trim().replace(/^[:\-–\s]*/, "");
      currentDay = {
        day: dayName,
        title: target || "Workout",
        exercises: []
      };
      continue;
    }
    if (line.toLowerCase().startsWith("target muscles:")) {
      if (currentDay) {
        currentDay.targetMuscles = line.replace(/target muscles:/i, "").trim();
      }
      continue;
    }
    if (line.toLowerCase().startsWith("exercises:")) {
      continue;
    }

    if (currentSection === "warmup" && line) {
      let item = line.replace(/^[\-\*\•]\s*/, "").replace(/^\d+\.\s*/, "");
      if (item) result.warmUp.push(item);
    } else if (currentSection === "cooldown" && line) {
      let item = line.replace(/^[\-\*\•]\s*/, "").replace(/^\d+\.\s*/, "");
      if (item) result.coolDown.push(item);
    } else if (currentSection === "tips" && line) {
      let item = line.replace(/^[\-\*\•]\s*/, "").replace(/^\d+\.\s*/, "").replace(/^✓\s*/, "");
      if (item) result.tips.push(item);
    } else if (currentSection === "day" && currentDay) {
      if (line.match(/^\d+\.\s*/)) {
        let exerciseName = line.replace(/^\d+\.\s*/, "").trim();
        let sets = "3";
        let reps = "10-12";
        let rest = "60s";
        let weight = "Estimate";
        
        let j = i + 1;
        while (j < lines.length && (
          lines[j].toLowerCase().startsWith("sets:") || 
          lines[j].toLowerCase().startsWith("reps:") || 
          lines[j].toLowerCase().startsWith("rest:") || 
          lines[j].toLowerCase().startsWith("weight:")
        )) {
          if (lines[j].toLowerCase().startsWith("sets:")) {
            sets = lines[j].replace(/sets:\s*/i, "").trim();
          } else if (lines[j].toLowerCase().startsWith("reps:")) {
            reps = lines[j].replace(/reps:\s*/i, "").trim();
          } else if (lines[j].toLowerCase().startsWith("rest:")) {
            rest = lines[j].replace(/rest:\s*/i, "").trim();
          } else if (lines[j].toLowerCase().startsWith("weight:")) {
            weight = lines[j].replace(/weight:\s*/i, "").trim();
          }
          j++;
          i++;
        }
        
        if (exerciseName && exerciseName.length > 1) {
          currentDay.exercises.push({ name: exerciseName, sets, reps, rest, weight });
        }
      }
    }
  }
  if (currentDay) result.days.push(currentDay);
  return result;
}

function roundToNearest(value: number): number {
  const remainder = value % 2.5;
  if (remainder < 1.25) {
    return value - remainder;
  }
  return value + (2.5 - remainder);
}

function estimateWeight(exerciseName: string, formData: FormData | null): string {
  if (!formData) return "Estimate";
  const weightKg = parseFloat(formData.weight) || 70;
  let baseMultiplier = 0.3;
  if (formData.experience === "Beginner") baseMultiplier = 0.25;
  if (formData.experience === "Intermediate") baseMultiplier = 0.4;
  if (formData.experience === "Advanced") baseMultiplier = 0.6;

  if (formData.goal === "Muscle Gain") baseMultiplier *= 1.1;
  if (formData.goal === "Strength") baseMultiplier *= 1.25;
  if (formData.goal === "Fat Loss") baseMultiplier *= 0.9;

  const lowerBodyWords = ["squat", "deadlift", "lunge", "leg press"];
  const upperBodyWords = ["bench", "press", "pull", "row"];

  const nameLower = exerciseName.toLowerCase();
  let estimatedWeight;
  if (lowerBodyWords.some(w => nameLower.includes(w))) {
    estimatedWeight = weightKg * baseMultiplier * 1.4;
  } else if (upperBodyWords.some(w => nameLower.includes(w))) {
    estimatedWeight = weightKg * baseMultiplier * 0.8;
  } else {
    estimatedWeight = weightKg * baseMultiplier * 0.5;
  }
  return `${roundToNearest(estimatedWeight)}`;
}

export default function WorkoutResultPage() {
  const [workoutPlan, setWorkoutPlan] = useState<string>("");
  const [parsedData, setParsedData] = useState<ParsedWorkout | null>(null);
  const [formData, setFormData] = useState<FormData | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedPlan = localStorage.getItem("workoutPlan");
      const savedFormData = localStorage.getItem("workoutFormData");
      if (savedPlan) {
        setWorkoutPlan(savedPlan);
        setParsedData(parseMarkdownToWorkout(savedPlan));
      }
      if (savedFormData) {
        setFormData(JSON.parse(savedFormData));
      }
    }
  }, []);

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-primary-400/10 blur-[140px]" />
      </div>

      <header className="border-b border-white/5 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-4 py-5 flex items-center justify-between">
          <Link
            href="/workout-generator"
            className="flex items-center gap-2 text-white/70 hover:text-primary-400 transition"
          >
            <ArrowLeft size={18} />
            Back
          </Link>
          <div className="font-black text-xl">
            Gym<span className="text-primary-400">Gen</span> AI
          </div>
          <div />
        </div>
      </header>

      <section className="max-w-6xl mx-auto px-4 py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-primary-400/10 border border-primary-400/20 rounded-full px-4 py-2 mb-6">
            <Dumbbell size={16} className="text-primary-400" />
            <span className="text-xs tracking-wider uppercase">
              AI Generated Workout
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-black mb-4">
            Your Personalized
            <span className="block text-primary-400">Workout Plan</span>
          </h1>

          <p className="text-white/60 mb-8">
            Generated by GymGen AI using Groq, based on your fitness profile.
          </p>

          {formData && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4"
            >
              <div className="bg-white/[0.015] border border-primary-400/15 rounded-xl p-3 md:p-4 text-center">
                <div className="text-[10px] md:text-xs text-white/50 uppercase tracking-wider mb-1">Gender</div>
                <div className="text-sm md:text-lg font-semibold">{formData.gender}</div>
              </div>
              <div className="bg-white/[0.015] border border-primary-400/15 rounded-xl p-3 md:p-4 text-center">
                <div className="text-[10px] md:text-xs text-white/50 uppercase tracking-wider mb-1">Age</div>
                <div className="text-sm md:text-lg font-semibold">{formData.age}</div>
              </div>
              <div className="bg-white/[0.015] border border-primary-400/15 rounded-xl p-3 md:p-4 text-center">
                <div className="text-[10px] md:text-xs text-white/50 uppercase tracking-wider mb-1">Height</div>
                <div className="text-sm md:text-lg font-semibold">{formData.height} cm</div>
              </div>
              <div className="bg-white/[0.015] border border-primary-400/15 rounded-xl p-3 md:p-4 text-center">
                <div className="text-[10px] md:text-xs text-white/50 uppercase tracking-wider mb-1">Weight</div>
                <div className="text-sm md:text-lg font-semibold">{formData.weight} kg</div>
              </div>
              <div className="bg-white/[0.015] border border-primary-400/15 rounded-xl p-3 md:p-4 text-center">
                <div className="text-[10px] md:text-xs text-white/50 uppercase tracking-wider mb-1">Goal</div>
                <div className="text-sm md:text-lg font-semibold">{formData.goal}</div>
              </div>
              <div className="bg-white/[0.015] border border-primary-400/15 rounded-xl p-3 md:p-4 text-center">
                <div className="text-[10px] md:text-xs text-white/50 uppercase tracking-wider mb-1">Experience</div>
                <div className="text-sm md:text-lg font-semibold">{formData.experience}</div>
              </div>
            </motion.div>
          )}
        </motion.div>

        {parsedData ? (
          <>
            {parsedData.days.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-16"
              >
                <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
                  <Calendar className="text-primary-400" size={24} />
                  Weekly Schedule
                </h2>

                <div className="space-y-10">
                  {parsedData.days.map((day, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 40 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.25 + idx * 0.1 }}
                      className="bg-white/[0.015] border border-white/8 rounded-2xl overflow-hidden"
                    >
                      <div className="px-6 py-5 border-b border-white/5 bg-white/[0.02]">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                          <div>
                            <div className="text-xs text-primary-400 font-black uppercase tracking-[0.22em] mb-1">
                              {day.day}
                            </div>
                            <div className="text-xl md:text-2xl font-bold">
                              {day.title}
                            </div>
                          </div>
                          {day.targetMuscles && (
                            <div className="flex items-center gap-2 text-white/60 text-sm md:text-base">
                              <Dumbbell size={16} className="text-primary-400/70" />
                              <span>Target: {day.targetMuscles}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="overflow-hidden">
                        <table className="w-full text-left">
                          <thead>
                            <tr className="bg-primary-400/10 border-y border-primary-400/20">
                              <th className="py-3 px-3 md:py-4 md:px-6 text-[10px] md:text-sm font-bold text-primary-400 uppercase tracking-wider w-2/5 md:w-auto">
                                Exercise
                              </th>
                              <th className="py-3 px-2 md:py-4 md:px-4 text-[10px] md:text-sm font-bold text-primary-400 uppercase tracking-wider w-auto md:w-1/6 text-center">
                                Sets
                              </th>
                              <th className="py-3 px-2 md:py-4 md:px-4 text-[10px] md:text-sm font-bold text-primary-400 uppercase tracking-wider w-auto md:w-1/6 text-center">
                                Reps
                              </th>
                              <th className="py-3 px-2 md:py-4 md:px-4 text-[10px] md:text-sm font-bold text-primary-400 uppercase tracking-wider w-auto md:w-1/6 text-center">
                                Weight
                              </th>
                              <th className="py-3 px-2 md:py-4 md:px-4 text-[10px] md:text-sm font-bold text-primary-400 uppercase tracking-wider w-auto md:w-1/6 text-center">
                                Rest
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {day.exercises.map((exercise, eIdx) => (
                              <tr
                                key={eIdx}
                                className={`border-b border-white/5 ${eIdx % 2 === 0 ? "bg-transparent" : "bg-white/[0.015]"} hover:bg-white/[0.035] transition-colors`}
                              >
                                <td className="py-2.5 px-3 md:py-4 md:px-6 font-medium text-xs md:text-base">
                                  {exercise.name}
                                </td>
                                <td className="py-2.5 px-2 md:py-4 md:px-4 text-center text-white/85 text-xs md:text-base">
                                  {exercise.sets}
                                </td>
                                <td className="py-2.5 px-2 md:py-4 md:px-4 text-center text-white/85 text-xs md:text-base">
                                  {exercise.reps}
                                </td>
                                <td className="py-2.5 px-2 md:py-4 md:px-4 text-center text-white/85 text-xs md:text-base">
                  {exercise.weight || "Estimate"}
                </td>
                                <td className="py-2.5 px-2 md:py-4 md:px-4 text-center text-white/85 text-xs md:text-base">
                                  {exercise.rest}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            <div className="grid md:grid-cols-2 gap-6 mb-12">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 }}
                className="bg-white/[0.015] border border-primary-400/20 rounded-2xl p-6 backdrop-blur-sm"
              >
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-12 h-12 bg-primary-400/10 rounded-xl flex items-center justify-center">
                    <Flame size={24} className="text-primary-400" />
                  </div>
                  <h3 className="text-xl font-bold">Warm Up</h3>
                </div>
                <ul className="space-y-3">
                  {parsedData.warmUp.length > 0 ? (
                    parsedData.warmUp.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full border border-primary-400/50 mt-0.5 flex-shrink-0" />
                        <span className="text-white/70">{item}</span>
                      </li>
                    ))
                  ) : (
                    <li className="text-white/50">5-10 minutes of light cardio + dynamic stretching</li>
                  )}
                </ul>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.85 }}
                className="bg-white/[0.015] border border-primary-400/20 rounded-2xl p-6 backdrop-blur-sm"
              >
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-12 h-12 bg-primary-400/10 rounded-xl flex items-center justify-center">
                    <TrendingUp size={24} className="text-primary-400" />
                  </div>
                  <h3 className="text-xl font-bold">Progression Tips</h3>
                </div>
                <ul className="space-y-3">
                  {parsedData.tips.length > 0 ? (
                    parsedData.tips.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full border border-primary-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <div className="w-2 h-2 bg-primary-400 rounded-full" />
                        </div>
                        <span className="text-white/70">{item}</span>
                      </li>
                    ))
                  ) : (
                    <>
                      <li className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full border border-primary-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <div className="w-2 h-2 bg-primary-400 rounded-full" />
                        </div>
                        <span className="text-white/70">Increase weight gradually when you hit top reps</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full border border-primary-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <div className="w-2 h-2 bg-primary-400 rounded-full" />
                        </div>
                        <span className="text-white/70">Focus on form over weight</span>
                      </li>
                    </>
                  )}
                </ul>
              </motion.div>
            </div>

            {parsedData.coolDown.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                className="mb-12 bg-white/[0.015] border border-primary-400/15 rounded-2xl p-6 backdrop-blur-sm"
              >
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-12 h-12 bg-primary-400/10 rounded-xl flex items-center justify-center">
                    <TrendingUp size={24} className="text-primary-400" />
                  </div>
                  <h3 className="text-xl font-bold">Cool Down</h3>
                </div>
                <ul className="space-y-3">
                  {parsedData.coolDown.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full border border-primary-400/40 mt-0.5 flex-shrink-0" />
                      <span className="text-white/70">{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </>
        ) : (
          <div className="bg-white/[0.02] border border-primary-400/20 rounded-3xl p-10 text-center">
            <p className="text-white/60">No workout plan generated yet. Go back to generate one!</p>
          </div>
        )}

        <div className="flex flex-wrap gap-4">
          <Link
            href="/workout-generator"
            className="px-6 py-3 border border-white/10 rounded-xl hover:border-primary-400/30 transition"
          >
            Generate Another Plan
          </Link>
          <button
            onClick={() => window.print()}
            className="bg-primary-400 text-black px-6 py-3 rounded-xl font-semibold flex items-center gap-2 hover:bg-primary-300 transition"
          >
            <Download size={18} />
            Download / Print
          </button>
        </div>
      </section>
    </main>
  );
}
