"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { createClient } from "@/lib/supabase";
import toast from "react-hot-toast";
import { Calendar, Weight, TrendingUp, Target, Activity, CheckCircle, Plus, Save, ArrowLeft, Zap } from "lucide-react";
import Footer from "@/components/layout/Footer";

interface ProgressEntry {
  id: string;
  user_id: string;
  weight: number;
  goal_weight: number;
  chest: number | null;
  waist: number | null;
  arms: number | null;
  thighs: number | null;
  date: string;
  created_at: string;
}

const motivationalMessages = [
  "Consistency beats perfection.",
  "Every workout counts.",
  "Progress takes time.",
  "Stay disciplined.",
  "Small improvements compound."
];

function ProgressChart({ data, dataKey, title, color = "#F5C518" }: any) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-6">
      <h3 className="text-xs sm:text-sm font-semibold text-white mb-4">{title}</h3>
      <div className="h-56 sm:h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
            <XAxis
              dataKey="date"
              stroke="#ffffff40"
              tick={{ fontSize: 9, fill: "#ffffff60" }}
              tickFormatter={(date: string) =>
                new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" })
              }
            />
            <YAxis
              stroke="#ffffff40"
              tick={{ fontSize: 9, fill: "#ffffff60" }}
              tickFormatter={(value: number) => `${value}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#000000",
                border: "1px solid #F5C51830",
                borderRadius: "8px",
                fontSize: "11px"
              }}
              labelStyle={{ color: "#F5C518" }}
            />
            <Line
              type="monotone"
              dataKey={dataKey}
              stroke={color}
              strokeWidth={2}
              dot={{ fill: color, r: 2.5 }}
              activeDot={{ r: 4 }}
              animationDuration={1500}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default function ProgressTrackingPage() {
  const router = useRouter();
  const [entries, setEntries] = useState<ProgressEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    weight: "",
    goalWeight: "",
    chest: "",
    waist: "",
    arms: "",
    thighs: "",
    date: new Date().toISOString().split("T")[0]
  });

  const supabase = createClient();

  const fetchEntries = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("progress_tracking")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: true });

      if (error) throw error;
      setEntries(data || []);
    } catch (error: any) {
      toast.error("Failed to fetch progress entries");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  const currentWeight = entries.length > 0 ? entries[entries.length - 1].weight : 0;
  const goalWeight = entries.length > 0 ? entries[entries.length - 1].goal_weight : 0;
  const startingWeight = entries.length > 0 ? entries[0].weight : 0;
  const progressPercent = startingWeight !== goalWeight
    ? Math.round(((currentWeight - startingWeight) / (goalWeight - startingWeight)) * 100)
    : 0;
  const weeklyChange = entries.length >= 2
    ? Number((currentWeight - entries[entries.length - 2].weight).toFixed(1))
    : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.weight || !form.goalWeight || !form.date) {
      toast.error("Please fill in all required fields");
      return;
    }

    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase.from("progress_tracking").insert({
        user_id: user.id,
        weight: parseFloat(form.weight),
        goal_weight: parseFloat(form.goalWeight),
        chest: form.chest ? parseFloat(form.chest) : null,
        waist: form.waist ? parseFloat(form.waist) : null,
        arms: form.arms ? parseFloat(form.arms) : null,
        thighs: form.thighs ? parseFloat(form.thighs) : null,
        date: form.date
      });

      if (error) throw error;
      toast.success("Progress saved successfully!");
      setForm({
        weight: "",
        goalWeight: form.goalWeight,
        chest: "",
        waist: "",
        arms: "",
        thighs: "",
        date: new Date().toISOString().split("T")[0]
      });
      fetchEntries();
    } catch (error: any) {
      toast.error(error.message || "Failed to save progress");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Custom Navbar */}
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/5 py-4"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          {/* Back Button */}
          <button
            onClick={() => router.push("/")}
            className="p-2 bg-white/5 border border-white/10 rounded-xl hover:border-primary-400/30 hover:bg-primary-400/5 transition-all group"
          >
            <ArrowLeft size={16} className="text-white/70 group-hover:text-primary-400 transition-colors" />
          </button>
          
          {/* GymGen AI Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative w-8 h-8 flex items-center justify-center">
              <div className="absolute inset-0 bg-primary-400 rotate-45 rounded-sm group-hover:rotate-[60deg] transition-transform duration-300" />
              <Zap size={16} className="relative z-10 text-black fill-black" />
            </div>
            <span className="font-serif font-black text-lg tracking-tight">
              Gym<span className="text-primary-400">Gen</span>
              <span className="text-white/40 text-xs font-light ml-1">AI</span>
            </span>
          </Link>
          
          {/* Spacer for perfect alignment */}
          <div className="w-10" />
        </div>
      </motion.nav>

      <main className="pt-20 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center mb-10"
          >
            <h1 className="text-xl sm:text-2xl md:text-3xl font-serif font-bold mb-2">
              Your Progress Journey
            </h1>
            <p className="text-xs sm:text-sm text-white/60 max-w-2xl mx-auto">
              Track your body transformation and stay consistent with GymGen AI.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-10">
            {loading ? (
              Array(4).fill(null).map((_, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-5"
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="h-2.5 bg-white/10 rounded w-16 animate-pulse" />
                      <div className="h-5 bg-white/10 rounded w-20 animate-pulse" />
                    </div>
                    <div className="w-8 h-8 bg-white/10 rounded-lg animate-pulse" />
                  </div>
                </motion.div>
              ))
            ) : (
              [
                { title: "Current Weight", value: `${currentWeight.toFixed(1)} kg`, icon: Weight, color: "text-primary-400", bg: "bg-primary-400/10" },
                { title: "Goal Weight", value: `${goalWeight.toFixed(1)} kg`, icon: Target, color: "text-primary-400", bg: "bg-primary-400/10" },
                { title: "Progress %", value: `${Math.min(Math.max(progressPercent, 0), 100)}%`, icon: TrendingUp, color: "text-primary-400", bg: "bg-primary-400/10" },
                { title: "Weekly Change", value: `${weeklyChange > 0 ? "+" : ""}${weeklyChange.toFixed(1)} kg`, icon: Activity, color: weeklyChange > 0 ? "text-green-400" : weeklyChange < 0 ? "text-red-400" : "text-white", bg: weeklyChange > 0 ? "bg-green-400/10" : weeklyChange < 0 ? "bg-red-400/10" : "bg-white/5" }
              ].map((card, index) => (
                <motion.div
                  key={card.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-5 hover:border-primary-400/30 transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-[11px] sm:text-xs text-white/50 mb-1">{card.title}</p>
                      <p className={`text-lg sm:text-xl font-bold ${card.color}`}>{card.value}</p>
                    </div>
                    <div className={`${card.bg} p-2 rounded-lg`}>
                      <card.icon className={`w-4 h-4 ${card.color}`} />
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-6 mb-10"
          >
            <div className="flex items-center gap-2 mb-5">
              <div className="w-7 h-7 bg-primary-400/10 rounded-lg flex items-center justify-center">
                <Plus className="w-3.5 h-3.5 text-primary-400" />
              </div>
              <h2 className="text-base sm:text-lg font-semibold">Log New Progress</h2>
            </div>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {[
                { name: "weight", label: "Current Weight (kg)", type: "number", step: "0.1", required: true },
                { name: "goalWeight", label: "Goal Weight (kg)", type: "number", step: "0.1", required: true },
                { name: "chest", label: "Chest (cm)", type: "number", step: "0.1", required: false },
                { name: "waist", label: "Waist (cm)", type: "number", step: "0.1", required: false },
                { name: "arms", label: "Arms (cm)", type: "number", step: "0.1", required: false },
                { name: "thighs", label: "Thighs (cm)", type: "number", step: "0.1", required: false },
                { name: "date", label: "Date", type: "date", required: true }
              ].map((field) => (
                <div key={field.name} className={field.name === "date" ? "sm:col-span-2 lg:col-span-3" : ""}>
                  <label className="block text-[11px] text-white/60 mb-1.5">
                    {field.label}
                    {field.required && <span className="text-primary-400 ml-1">*</span>}
                  </label>
                  <input
                    type={field.type}
                    step={field.step}
                    value={form[field.name as keyof typeof form]}
                    onChange={(e) => setForm({ ...form, [field.name]: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3.5 py-2.5 text-xs sm:text-sm focus:outline-none focus:border-primary-400 transition-colors"
                  />
                </div>
              ))}
              <div className="sm:col-span-2 lg:col-span-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full sm:w-auto bg-primary-400 text-black px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg font-semibold hover:bg-primary-300 transition-all flex items-center justify-center gap-2 disabled:opacity-50 text-xs sm:text-sm"
                >
                  {saving ? (
                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Save className="w-3.5 h-3.5" />
                      Save Progress
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>

          {loading ? (
            <div className="space-y-4 mb-10">
              {Array(3).fill(null).map((_, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-6"
                >
                  <div className="h-3 bg-white/10 rounded w-32 mb-4 animate-pulse" />
                  <div className="h-52 bg-white/5 rounded-xl animate-pulse" />
                </motion.div>
              ))}
            </div>
          ) : entries.length > 0 ? (
            <div className="space-y-4 mb-10">
              <ProgressChart
                data={entries.map((e) => ({ date: e.date, weight: e.weight }))}
                dataKey="weight"
                title="Weight Progress (kg)"
              />
              {entries.some(e => e.chest) && (
                <ProgressChart
                  data={entries.map((e) => ({ date: e.date, chest: e.chest }))}
                  dataKey="chest"
                  title="Chest Progress (cm)"
                />
              )}
              {entries.some(e => e.waist) && (
                <ProgressChart
                  data={entries.map((e) => ({ date: e.date, waist: e.waist }))}
                  dataKey="waist"
                  title="Waist Progress (cm)"
                />
              )}
              {entries.some(e => e.arms) && (
                <ProgressChart
                  data={entries.map((e) => ({ date: e.date, arms: e.arms }))}
                  dataKey="arms"
                  title="Arms Progress (cm)"
                />
              )}
              {entries.some(e => e.thighs) && (
                <ProgressChart
                  data={entries.map((e) => ({ date: e.date, thighs: e.thighs }))}
                  dataKey="thighs"
                  title="Thighs Progress (cm)"
                />
              )}
            </div>
          ) : null}

          {loading ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="mb-10"
            >
              <div className="flex items-center gap-2 mb-5">
                <div className="w-7 h-7 bg-white/10 rounded-lg animate-pulse" />
                <div className="h-4 bg-white/10 rounded w-24 animate-pulse" />
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                <div className="p-4 space-y-3">
                  {Array(4).fill(null).map((_, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <div className="h-2.5 bg-white/10 rounded w-20 animate-pulse" />
                      <div className="h-2.5 bg-white/10 rounded w-16 animate-pulse" />
                      <div className="h-2.5 bg-white/10 rounded w-16 animate-pulse" />
                      <div className="h-2.5 bg-white/10 rounded w-16 animate-pulse" />
                      <div className="h-2.5 bg-white/10 rounded w-16 animate-pulse" />
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ) : entries.length > 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="mb-10"
            >
              <div className="flex items-center gap-2 mb-5">
                <div className="w-7 h-7 bg-primary-400/10 rounded-lg flex items-center justify-center">
                  <Calendar className="w-3.5 h-3.5 text-primary-400" />
                </div>
                <h2 className="text-base sm:text-lg font-semibold">History</h2>
              </div>

              <div className="hidden md:block overflow-hidden rounded-2xl border border-white/10">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-white/5">
                      <tr>
                        <th className="text-left text-[11px] sm:text-xs font-semibold text-white/60 px-4 py-2.5">Date</th>
                        <th className="text-left text-[11px] sm:text-xs font-semibold text-white/60 px-4 py-2.5">Weight</th>
                        <th className="text-left text-[11px] sm:text-xs font-semibold text-white/60 px-4 py-2.5">Chest</th>
                        <th className="text-left text-[11px] sm:text-xs font-semibold text-white/60 px-4 py-2.5">Waist</th>
                        <th className="text-left text-[11px] sm:text-xs font-semibold text-white/60 px-4 py-2.5">Arms</th>
                        <th className="text-left text-[11px] sm:text-xs font-semibold text-white/60 px-4 py-2.5">Thighs</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {[...entries].reverse().map((entry) => (
                        <tr key={entry.id} className="hover:bg-white/5">
                          <td className="px-4 py-2.5 text-xs sm:text-sm">
                            {new Date(entry.date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                          </td>
                          <td className="px-4 py-2.5 text-xs sm:text-sm text-primary-400 font-semibold">{entry.weight.toFixed(1)} kg</td>
                          <td className="px-4 py-2.5 text-xs sm:text-sm">{entry.chest ? `${entry.chest.toFixed(1)} cm` : "-"}</td>
                          <td className="px-4 py-2.5 text-xs sm:text-sm">{entry.waist ? `${entry.waist.toFixed(1)} cm` : "-"}</td>
                          <td className="px-4 py-2.5 text-xs sm:text-sm">{entry.arms ? `${entry.arms.toFixed(1)} cm` : "-"}</td>
                          <td className="px-4 py-2.5 text-xs sm:text-sm">{entry.thighs ? `${entry.thighs.toFixed(1)} cm` : "-"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="md:hidden space-y-2.5">
                {[...entries].reverse().map((entry) => (
                  <div key={entry.id} className="bg-white/5 border border-white/10 rounded-xl p-3.5">
                    <div className="flex items-center justify-between mb-2.5">
                      <span className="text-[11px] text-white/50">
                        {new Date(entry.date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2.5 text-[11px]">
                      <div>
                        <p className="text-white/50">Weight</p>
                        <p className="text-primary-400 font-semibold">{entry.weight.toFixed(1)} kg</p>
                      </div>
                      {entry.chest && (
                        <div>
                          <p className="text-white/50">Chest</p>
                          <p>{entry.chest.toFixed(1)} cm</p>
                        </div>
                      )}
                      {entry.waist && (
                        <div>
                          <p className="text-white/50">Waist</p>
                          <p>{entry.waist.toFixed(1)} cm</p>
                        </div>
                      )}
                      {entry.arms && (
                        <div>
                          <p className="text-white/50">Arms</p>
                          <p>{entry.arms.toFixed(1)} cm</p>
                        </div>
                      )}
                      {entry.thighs && (
                        <div>
                          <p className="text-white/50">Thighs</p>
                          <p>{entry.thighs.toFixed(1)} cm</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ) : null}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4"
          >
            {motivationalMessages.map((message, index) => (
              <div key={index} className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-5 hover:border-primary-400/30 transition-all">
                <CheckCircle className="w-5 h-5 text-primary-400 mb-2.5" />
                <p className="text-xs sm:text-sm font-medium text-white/80 italic">"{message}"</p>
              </div>
            ))}
          </motion.div>

          {!loading && entries.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mx-auto mb-3.5">
                <Activity className="w-7 h-7 text-primary-400" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold mb-2">No Progress Yet</h3>
              <p className="text-xs sm:text-sm text-white/60">Log your first progress entry above to get started!</p>
            </motion.div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
