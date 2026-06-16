"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Download,
  Dumbbell,
  Flame,
  TrendingUp,
  Calendar,
  Clock,
  Trophy,
  ChevronDown,
  ChevronUp
} from "lucide-react";

interface Exercise {
  name: string;
  sets: string;
  reps: string;
  rest: string;
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
      let target = dayTitle.replace(dayName, "").trim().replace(/^[:-]\s*/, "");
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
      let item = line.replace(/^[-*]\s*/, "").replace(/^\d+\.\s*/, "");
      if (item) result.warmUp.push(item);
    } else if (currentSection === "cooldown" && line) {
      let item = line.replace(/^[-*]\s*/, "").replace(/^\d+\.\s*/, "");
      if (item) result.coolDown.push(item);
    } else if (currentSection === "tips" && line) {
      let item = line.replace(/^[-*]\s*/, "").replace(/^\d+\.\s*/, "").replace(/^✓\s*/, "");
      if (item) result.tips.push(item);
    } else if (currentSection === "day" && currentDay) {
      if (line.match(/^\d+\.\s*/) || line.toLowerCase().includes("sets:")) {
        let exerciseName = line.replace(/^\d+\.\s*/, "").trim();
        let sets = "3";
        let reps = "10-12";
        let rest = "60s";
        if (i + 1 < lines.length && lines[i+1].toLowerCase().startsWith("sets:")) {
          sets = lines[i+1].replace(/sets:\s*/i, "").trim();
          i++;
        }
        if (i + 1 < lines.length && lines[i+1].toLowerCase().startsWith("reps:")) {
          reps = lines[i+1].replace(/reps:\s*/i, "").trim();
          i++;
        }
        if (i + 1 < lines.length && lines[i+1].toLowerCase().startsWith("rest:")) {
          rest = lines[i+1].replace(/rest:\s*/i, "").trim();
          i++;
        }
        if (exerciseName && exerciseName.length > 1) {
          currentDay.exercises.push({ name: exerciseName, sets, reps, rest });
        }
      }
    }
  }
  if (currentDay) result.days.push(currentDay);
  return result;
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

export default function WorkoutResultPage() {
  const [workoutPlan, setWorkoutPlan] = useState<string>("");
  const [parsedData, setParsedData] = useState<ParsedWorkout | null>(null);
  const [formData, setFormData] = useState<FormData | null>(null);
  const [expandedDay, setExpandedDay] = useState<number>(0);

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
          className="mb-10"
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

          <p className="text-white/60">
            Generated by GymGen AI, based on your fitness profile.
          </p>
        </motion.div>

        {parsedData ? (
          <>
            {parsedData.days.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mb-12"
              >
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <Calendar className="text-primary-400" size={24} />
                  Weekly Timeline
                </h2>
                <div className="flex flex-col md:flex-row gap-3 md:gap-6">
                  {parsedData.days.map((day, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.35 + idx * 0.07 }}
                      onClick={() => setExpandedDay(idx)}
                      className={`cursor-pointer px-5 py-4 rounded-2xl border transition-all ${
                        expandedDay === idx
                          ? "bg-primary-400/20 border-primary-400"
                          : "bg-white/[0.02] border-white/10 hover:border-primary-400/30"
                      }`}
                    >
                      <div className="text-xs font-bold text-white/60 uppercase tracking-widest mb-1">
                        {day.day}
                      </div>
                      <div className="font-bold">
                        {day.title}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Dumbbell className="text-primary-400" size={24} />
                Weekly Split
              </h2>
              <div className="space-y-5">
                {parsedData.days.map((day, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + idx * 0.08 }}
                    whileHover={{ y: -4 }}
                    className="bg-white/[0.02] border border-white/10 rounded-2xl overflow-hidden hover:border-primary-400/40 transition-all"
                  >
                    <div
                      className="px-6 py-4 cursor-pointer flex items-center justify-between"
                      onClick={() => setExpandedDay(expandedDay === idx ? -1 : idx)}
                    >
                      <div>
                        <div className="text-xs text-primary-400 uppercase tracking-widest font-bold mb-1">
                          {day.day}
                        </div>
                        <div className="text-xl font-bold">{day.title}</div>
                        {day.targetMuscles && (
                          <div className="text-white/60 text-sm mt-1">
                            Target: {day.targetMuscles}
                          </div>
                        )}
                      </div>
                      {expandedDay === idx ? (
                        <ChevronUp size={20} className="text-primary-400" />
                      ) : (
                        <ChevronDown size={20} className="text-white/50" />
                      )}
                    </div>
                    <AnimatePresence>
                      {expandedDay === idx && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="px-6 pb-6">
                            <div className="overflow-x-auto">
                              <table className="w-full text-left border-collapse">
                                <thead>
                                  <tr className="border-b border-white/10">
                                    <th className="py-3 px-4 text-sm font-semibold text-primary-400">Exercise</th>
                                    <th className="py-3 px-4 text-sm font-semibold text-primary-400">Sets</th>
                                    <th className="py-3 px-4 text-sm font-semibold text-primary-400">Reps</th>
                                    <th className="py-3 px-4 text-sm font-semibold text-primary-400">Rest</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {day.exercises.map((exercise, eIdx) => (
                                    <tr key={eIdx} className="border-b border-white/5 hover:bg-white/[0.03]">
                                      <td className="py-3 px-4">{exercise.name}</td>
                                      <td className="py-3 px-4">{exercise.sets}</td>
                                      <td className="py-3 px-4">{exercise.reps}</td>
                                      <td className="py-3 px-4">{exercise.rest}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-12">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 }}
                whileHover={{ y: -3, boxShadow: "0 0 30px rgba(245,197,24,0.12)" }}
                className="bg-white/[0.02] border border-primary-400/30 rounded-2xl p-6 backdrop-blur-sm"
              >
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-12 h-12 bg-primary-400/20 rounded-xl flex items-center justify-center">
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
                transition={{ delay: 0.75 }}
                whileHover={{ y: -3, boxShadow: "0 0 30px rgba(245,197,24,0.12)" }}
                className="bg-white/[0.02] border border-primary-400/30 rounded-2xl p-6 backdrop-blur-sm"
              >
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-12 h-12 bg-primary-400/20 rounded-xl flex items-center justify-center">
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
