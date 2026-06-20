"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from "recharts";
import { createClient } from "@/lib/supabase";
import {
  ArrowLeft,
  Zap,
  Target,
  TrendingUp,
  TrendingDown,
  Activity,
  Scale,
  Trophy,
  Flame,
  Star,
  Crown,
  Zap as ZapIcon,
  Award,
  Calendar,
  Info,
  ChevronRight
} from "lucide-react";
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

interface Achievement {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  description: string;
  unlocked: boolean;
  color: string;
}

const Card = ({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    className={`bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-6 hover:border-primary-400/30 transition-all ${className}`}
  >
    {children}
  </motion.div>
);

const StatCard = ({
  title,
  value,
  subValue,
  icon: Icon,
  color = "text-primary-400",
  bgColor = "bg-primary-400/10",
  delay = 0
}: {
  title: string;
  value: string;
  subValue?: string;
  icon: any;
  color?: string;
  bgColor?: string;
  delay?: number;
}) => (
  <Card delay={delay}>
    <div className="flex items-start justify-between">
      <div>
        <p className="text-[11px] sm:text-xs text-white/50 mb-1">{title}</p>
        <p className={`text-xl sm:text-2xl font-bold ${color}`}>{value}</p>
        {subValue && <p className="text-[10px] sm:text-xs text-white/40 mt-1">{subValue}</p>}
      </div>
      <div className={`${bgColor} p-2.5 rounded-lg`}>
        <Icon className={`w-5 h-5 ${color}`} />
      </div>
    </div>
  </Card>
);

const LineChartComponent = ({ data, dataKey, title, color = "#F5C518" }: any) => (
  <Card className="w-full">
    <h3 className="text-xs sm:text-sm font-semibold text-white mb-4">{title}</h3>
    <div className="h-48 sm:h-56">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
          <XAxis
            dataKey="date"
            stroke="#ffffff40"
            tick={{ fontSize: 8, fill: "#ffffff60" }}
            tickFormatter={(date: string) =>
              new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" })
            }
          />
          <YAxis
            stroke="#ffffff40"
            tick={{ fontSize: 8, fill: "#ffffff60" }}
            tickFormatter={(value: number) => `${value}`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#000000",
              border: "1px solid #F5C51830",
              borderRadius: "8px",
              fontSize: "10px"
            }}
            labelStyle={{ color: "#F5C518" }}
          />
          <Line
            type="monotone"
            dataKey={dataKey}
            stroke={color}
            strokeWidth={2}
            dot={{ fill: color, r: 2 }}
            activeDot={{ r: 3.5 }}
            animationDuration={1500}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  </Card>
);

const BarChartComponent = ({ data, title }: any) => (
  <Card className="w-full">
    <h3 className="text-xs sm:text-sm font-semibold text-white mb-4">{title}</h3>
    <div className="h-48 sm:h-56">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
          <XAxis
            dataKey="name"
            stroke="#ffffff40"
            tick={{ fontSize: 8, fill: "#ffffff60" }}
          />
          <YAxis
            stroke="#ffffff40"
            tick={{ fontSize: 8, fill: "#ffffff60" }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#000000",
              border: "1px solid #F5C51830",
              borderRadius: "8px",
              fontSize: "10px"
            }}
            labelStyle={{ color: "#F5C518" }}
          />
          <Bar dataKey="value" fill="#F5C518" radius={[4, 4, 0, 0]} animationDuration={1500} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </Card>
);

const AreaChartComponent = ({ data, dataKey, title }: any) => (
  <Card className="w-full">
    <h3 className="text-xs sm:text-sm font-semibold text-white mb-4">{title}</h3>
    <div className="h-48 sm:h-56">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#F5C518" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#F5C518" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
          <XAxis
            dataKey="date"
            stroke="#ffffff40"
            tick={{ fontSize: 8, fill: "#ffffff60" }}
            tickFormatter={(date: string) =>
              new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" })
            }
          />
          <YAxis
            stroke="#ffffff40"
            tick={{ fontSize: 8, fill: "#ffffff60" }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#000000",
              border: "1px solid #F5C51830",
              borderRadius: "8px",
              fontSize: "10px"
            }}
            labelStyle={{ color: "#F5C518" }}
          />
          <Area
            type="monotone"
            dataKey={dataKey}
            stroke="#F5C518"
            fillOpacity={1}
            fill="url(#colorValue)"
            animationDuration={1500}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  </Card>
);

const BMIGauge = ({ bmi, category }: { bmi: number; category: string }) => {
  const getBMIColor = () => {
    if (bmi < 18.5) return "#60A5FA";
    if (bmi < 25) return "#34D399";
    if (bmi < 30) return "#FBBF24";
    return "#EF4444";
  };

  return (
    <Card>
      <h3 className="text-xs sm:text-sm font-semibold text-white mb-4 flex items-center gap-2">
        <Scale className="w-4 h-4 text-primary-400" />
        BMI Analysis
      </h3>
      <div className="flex flex-col items-center">
        <div className="relative w-32 h-32 sm:w-40 sm:h-40 mb-4">
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <defs>
              <linearGradient id="bmiGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#60A5FA" />
                <stop offset="33%" stopColor="#34D399" />
                <stop offset="66%" stopColor="#FBBF24" />
                <stop offset="100%" stopColor="#EF4444" />
              </linearGradient>
            </defs>
            <circle cx="100" cy="100" r="80" fill="none" stroke="#ffffff10" strokeWidth="15" />
            <circle
              cx="100"
              cy="100"
              r="80"
              fill="none"
              stroke="url(#bmiGradient)"
              strokeWidth="15"
              strokeDasharray="502"
              strokeDashoffset={`${502 - Math.min(Math.max(bmi / 40, 0), 1) * 502}`}
              transform="rotate(-90 100 100)"
              style={{ transition: "stroke-dashoffset 1.5s ease" }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl sm:text-4xl font-bold" style={{ color: getBMIColor() }}>
              {bmi.toFixed(1)}
            </span>
            <span className="text-[10px] sm:text-xs text-white/50 mt-1">BMI</span>
          </div>
        </div>
        <p className="text-xs sm:text-sm font-semibold text-white mb-2">{category}</p>
        <p className="text-[10px] sm:text-xs text-white/40 text-center">
          {category === "Underweight" && "Consider increasing your calorie intake with nutrient-dense foods."}
          {category === "Normal" && "Excellent! Maintain your current healthy lifestyle and fitness routine."}
          {category === "Overweight" && "Focus on regular exercise and balanced nutrition to improve your health."}
          {category === "Obese" && "Consult a healthcare professional for personalized health guidance."}
        </p>
      </div>
    </Card>
  );
};

export default function AnalyticsDashboardPage() {
  const router = useRouter();
  const [entries, setEntries] = useState<ProgressEntry[]>([]);
  const [loading, setLoading] = useState(true);
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
      console.error("Failed to fetch entries:", error);
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
  const previousWeight = entries.length > 1 ? entries[entries.length - 2].weight : currentWeight;
  const weightChange = currentWeight - previousWeight;
  const progressPercent = startingWeight !== goalWeight
    ? Math.round(((currentWeight - startingWeight) / (goalWeight - startingWeight)) * 100)
    : 0;

  const calculateBMI = (weight: number, height: number = 1.7) => weight / (height * height);
  const bmi = calculateBMI(currentWeight);
  const getBMICategory = (bmiValue: number) => {
    if (bmiValue < 18.5) return "Underweight";
    if (bmiValue < 25) return "Normal";
    if (bmiValue < 30) return "Overweight";
    return "Obese";
  };

  const previousChest = entries.length > 1 ? entries[entries.length - 2].chest : null;
  const currentChest = entries.length > 0 ? entries[entries.length - 1].chest : null;
  const previousWaist = entries.length > 1 ? entries[entries.length - 2].waist : null;
  const currentWaist = entries.length > 0 ? entries[entries.length - 1].waist : null;
  const previousArms = entries.length > 1 ? entries[entries.length - 2].arms : null;
  const currentArms = entries.length > 0 ? entries[entries.length - 1].arms : null;
  const previousThighs = entries.length > 1 ? entries[entries.length - 2].thighs : null;
  const currentThighs = entries.length > 0 ? entries[entries.length - 1].thighs : null;

  const calculateDifference = (current: number | null, previous: number | null) => {
    if (!current || !previous) return { diff: 0, percent: 0 };
    const diff = current - previous;
    const percent = previous !== 0 ? Math.round((diff / previous) * 100) : 0;
    return { diff, percent };
  };

  const chestDiff = calculateDifference(currentChest, previousChest);
  const waistDiff = calculateDifference(currentWaist, previousWaist);
  const armsDiff = calculateDifference(currentArms, previousArms);
  const thighsDiff = calculateDifference(currentThighs, previousThighs);

  const comparisonData = [
    {
      label: "Weight",
      current: `${currentWeight.toFixed(1)} kg`,
      previous: `${previousWeight.toFixed(1)} kg`,
      diff: weightChange > 0 ? `+${weightChange.toFixed(1)} kg` : `${weightChange.toFixed(1)} kg`,
      percent: previousWeight !== 0 ? `${Math.round((weightChange / previousWeight) * 100)}%` : "0%",
      isImproved: weightChange < 0
    },
    {
      label: "Chest",
      current: currentChest ? `${currentChest.toFixed(1)} cm` : "-",
      previous: previousChest ? `${previousChest.toFixed(1)} cm` : "-",
      diff: chestDiff.diff > 0 ? `+${chestDiff.diff.toFixed(1)} cm` : `${chestDiff.diff.toFixed(1)} cm`,
      percent: `${chestDiff.percent}%`,
      isImproved: chestDiff.diff > 0
    },
    {
      label: "Waist",
      current: currentWaist ? `${currentWaist.toFixed(1)} cm` : "-",
      previous: previousWaist ? `${previousWaist.toFixed(1)} cm` : "-",
      diff: waistDiff.diff > 0 ? `+${waistDiff.diff.toFixed(1)} cm` : `${waistDiff.diff.toFixed(1)} cm`,
      percent: `${waistDiff.percent}%`,
      isImproved: waistDiff.diff < 0
    },
    {
      label: "Arms",
      current: currentArms ? `${currentArms.toFixed(1)} cm` : "-",
      previous: previousArms ? `${previousArms.toFixed(1)} cm` : "-",
      diff: armsDiff.diff > 0 ? `+${armsDiff.diff.toFixed(1)} cm` : `${armsDiff.diff.toFixed(1)} cm`,
      percent: `${armsDiff.percent}%`,
      isImproved: armsDiff.diff > 0
    },
    {
      label: "Thighs",
      current: currentThighs ? `${currentThighs.toFixed(1)} cm` : "-",
      previous: previousThighs ? `${previousThighs.toFixed(1)} cm` : "-",
      diff: thighsDiff.diff > 0 ? `+${thighsDiff.diff.toFixed(1)} cm` : `${thighsDiff.diff.toFixed(1)} cm`,
      percent: `${thighsDiff.percent}%`,
      isImproved: thighsDiff.diff > 0
    }
  ];

  const achievements: Achievement[] = [
    {
      id: "first-entry",
      name: "First Progress Entry",
      icon: Flame,
      description: "Logged your first progress",
      unlocked: entries.length > 0,
      color: "#F59E0B"
    },
    {
      id: "5kg-progress",
      name: "5kg Progress",
      icon: Trophy,
      description: "Lost/gained 5kg",
      unlocked: Math.abs(currentWeight - startingWeight) >= 5,
      color: "#34D399"
    },
    {
      id: "25-percent",
      name: "25% Goal Completed",
      icon: Star,
      description: "Quarter way to your goal",
      unlocked: Math.abs(progressPercent) >= 25,
      color: "#60A5FA"
    },
    {
      id: "50-percent",
      name: "50% Goal Completed",
      icon: ZapIcon,
      description: "Half way there!",
      unlocked: Math.abs(progressPercent) >= 50,
      color: "#A855F7"
    },
    {
      id: "75-percent",
      name: "75% Goal Completed",
      icon: Award,
      description: "Almost there!",
      unlocked: Math.abs(progressPercent) >= 75,
      color: "#EC4899"
    },
    {
      id: "goal-achieved",
      name: "Goal Achieved",
      icon: Crown,
      description: "Reached your target!",
      unlocked: (goalWeight < startingWeight && currentWeight <= goalWeight) || (goalWeight > startingWeight && currentWeight >= goalWeight),
      color: "#F5C518"
    }
  ];

  const chartData = entries.map(e => ({
    date: e.date,
    weight: e.weight,
    chest: e.chest,
    waist: e.waist,
    arms: e.arms,
    thighs: e.thighs
  }));

  const barChartData = entries.length > 0
    ? [
        { name: "Weight", value: currentWeight },
        { name: "Chest", value: currentChest || 0 },
        { name: "Waist", value: currentWaist || 0 },
        { name: "Arms", value: currentArms || 0 },
        { name: "Thighs", value: currentThighs || 0 }
      ]
    : [];

  const weeklyData = entries.length > 0 ? entries.slice(-7).map(e => ({ date: e.date, weight: e.weight })) : [];
  const monthlyData = entries.length > 0 ? entries.slice(-30).map(e => ({ date: e.date, weight: e.weight })) : [];

  const aiInsights = [
    `You've made ${Math.abs(weightChange).toFixed(1)}kg change in your last update`,
    currentChest && previousChest && `Chest measurements ${chestDiff.diff > 0 ? "increased" : "decreased"} by ${Math.abs(chestDiff.diff).toFixed(1)}cm`,
    currentWaist && previousWaist && `Waist size ${waistDiff.diff < 0 ? "reduced" : "increased"} by ${Math.abs(waistDiff.diff).toFixed(1)}cm`,
    "Maintain consistency for optimal results",
    `Your progress is ${progressPercent > 0 ? "excellent" : "steady"} compared to last week`
  ].filter(Boolean);

  return (
    <div className="min-h-screen bg-black text-white">
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/5 py-4"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          <button
            onClick={() => router.push("/")}
            className="p-2 bg-white/5 border border-white/10 rounded-xl hover:border-primary-400/30 hover:bg-primary-400/5 transition-all group"
          >
            <ArrowLeft size={16} className="text-white/70 group-hover:text-primary-400 transition-colors" />
          </button>

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

          <div className="w-10" />
        </div>
      </motion.nav>

      <main className="pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-center mb-10"
          >
            <h1 className="text-xl sm:text-2xl md:text-3xl font-serif font-bold mb-2">
              Analytics Dashboard
            </h1>
            <p className="text-xs sm:text-sm md:text-base text-white/60 max-w-2xl mx-auto">
              Track your fitness performance, body transformation and progress insights with GymGen AI.
            </p>
          </motion.div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4 mb-10">
              {[...Array(6)].map((_, i) => (
                <Card key={i} delay={i * 0.1}>
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="h-2.5 bg-white/10 rounded w-16 animate-pulse" />
                      <div className="h-6 bg-white/10 rounded w-20 animate-pulse" />
                    </div>
                    <div className="w-8 h-8 bg-white/10 rounded-lg animate-pulse" />
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4 mb-10">
              <StatCard
                title="Current Weight"
                value={`${currentWeight.toFixed(1)} kg`}
                icon={Scale}
                delay={0}
              />
              <StatCard
                title="Goal Weight"
                value={`${goalWeight.toFixed(1)} kg`}
                icon={Target}
                delay={0.1}
              />
              <StatCard
                title="Weight Change"
                value={`${weightChange > 0 ? "+" : ""}${weightChange.toFixed(1)} kg`}
                icon={weightChange < 0 ? TrendingDown : TrendingUp}
                color={weightChange < 0 ? "text-green-400" : "text-red-400"}
                bgColor={weightChange < 0 ? "bg-green-400/10" : "bg-red-400/10"}
                delay={0.2}
              />
              <StatCard
                title="Progress %"
                value={`${Math.min(Math.max(Math.abs(progressPercent), 0), 100)}%`}
                icon={Activity}
                delay={0.3}
              />
              <StatCard
                title="BMI"
                value={bmi.toFixed(1)}
                subValue={getBMICategory(bmi)}
                icon={Scale}
                delay={0.4}
              />
              <StatCard
                title="Entries"
                value={entries.length.toString()}
                icon={Calendar}
                delay={0.5}
              />
            </div>
          )}

          {!loading && (
            <>
              <div className="mb-10">
                <h2 className="text-base sm:text-lg font-semibold mb-4 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-primary-400" />
                  Body Transformation Analysis
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4">
                  {comparisonData.map((item, i) => (
                    <Card key={item.label} delay={0.1 * i}>
                      <p className="text-[11px] sm:text-xs text-white/50 mb-2">{item.label}</p>
                      <p className="text-sm sm:text-base font-bold text-white mb-1">{item.current}</p>
                      <p className="text-[10px] sm:text-xs text-white/40 mb-2">Prev: {item.previous}</p>
                      <div className="flex items-center justify-between">
                        <span className={`text-[10px] sm:text-xs font-semibold ${item.isImproved ? "text-green-400" : "text-red-400"}`}>
                          {item.diff}
                        </span>
                        <span className={`text-[10px] sm:text-xs ${item.isImproved ? "text-green-400" : "text-red-400"}`}>
                          {item.isImproved ? "+" : ""}{item.percent}
                        </span>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              {chartData.length > 0 && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-10">
                  <LineChartComponent data={chartData} dataKey="weight" title="Weight Progress" />
                  {chartData.some((d: any) => d.chest) && (
                    <LineChartComponent data={chartData.filter((d: any) => d.chest)} dataKey="chest" title="Chest Progress" color="#60A5FA" />
                  )}
                  {chartData.some((d: any) => d.waist) && (
                    <LineChartComponent data={chartData.filter((d: any) => d.waist)} dataKey="waist" title="Waist Progress" color="#EF4444" />
                  )}
                  {chartData.some((d: any) => d.arms) && (
                    <LineChartComponent data={chartData.filter((d: any) => d.arms)} dataKey="arms" title="Arms Progress" color="#34D399" />
                  )}
                  {chartData.some((d: any) => d.thighs) && (
                    <LineChartComponent data={chartData.filter((d: any) => d.thighs)} dataKey="thighs" title="Thighs Progress" color="#A855F7" />
                  )}
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-10">
                {barChartData.length > 0 && <BarChartComponent data={barChartData} title="Body Measurements Comparison" />}
                {monthlyData.length > 0 && <AreaChartComponent data={monthlyData} dataKey="weight" title="Monthly Progress Trend" />}
                {weeklyData.length > 0 && <BarChartComponent data={weeklyData} title="Weekly Progress Summary" />}
              </div>

              <BMIGauge bmi={bmi} category={getBMICategory(bmi)} />

              <Card className="mt-10">
                <h2 className="text-base sm:text-lg font-semibold mb-4 flex items-center gap-2">
                  <Target className="w-4 h-4 text-primary-400" />
                  Goal Tracker
                </h2>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs sm:text-sm text-white/60">
                        {startingWeight.toFixed(1)} kg → {goalWeight.toFixed(1)} kg
                      </span>
                      <span className="text-xs sm:text-sm font-semibold text-primary-400">{Math.min(Math.max(Math.abs(progressPercent), 0), 100)}%</span>
                    </div>
                    <div className="w-full h-2.5 bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(Math.max(Math.abs(progressPercent), 0), 100)}%` }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className="h-full bg-primary-400 rounded-full"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-xs text-white/50">Current</p>
                      <p className="text-lg font-bold text-white">{currentWeight.toFixed(1)} kg</p>
                    </div>
                    <div>
                      <p className="text-xs text-white/50">Target</p>
                      <p className="text-lg font-bold text-primary-400">{goalWeight.toFixed(1)} kg</p>
                    </div>
                    <div>
                      <p className="text-xs text-white/50">Remaining</p>
                      <p className="text-lg font-bold text-white">{Math.abs(goalWeight - currentWeight).toFixed(1)} kg</p>
                    </div>
                  </div>
                </div>
              </Card>

              <div className="mt-10">
                <h2 className="text-base sm:text-lg font-semibold mb-4 flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-primary-400" />
                  Achievements
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3 sm:gap-4">
                  {achievements.map((achievement, i) => (
                    <Card key={achievement.id} delay={0.1 * i} className={`${achievement.unlocked ? "" : "opacity-40 grayscale"}`}>
                      <div className="flex flex-col items-center text-center">
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center mb-2"
                          style={{ backgroundColor: achievement.unlocked ? `${achievement.color}20` : "#ffffff10" }}
                        >
                          <achievement.icon className="w-5 h-5" style={{ color: achievement.unlocked ? achievement.color : "#ffffff40" }} />
                        </div>
                        <p className="text-[10px] sm:text-xs font-semibold text-white">{achievement.name}</p>
                        <p className="text-[9px] sm:text-[10px] text-white/40 mt-1">{achievement.description}</p>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              <div className="mt-10">
                <h2 className="text-base sm:text-lg font-semibold mb-4 flex items-center gap-2">
                  <Info className="w-4 h-4 text-primary-400" />
                  AI Insights
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {aiInsights.map((insight, i) => (
                    <Card key={i} delay={0.1 * i}>
                      <p className="text-xs sm:text-sm text-white/80">{insight}</p>
                    </Card>
                  ))}
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                className="mt-12 text-center"
              >
                <Link
                  href="/progress-tracking"
                  className="inline-flex items-center gap-2 bg-primary-400 text-black px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl font-semibold hover:bg-primary-300 transition-all text-xs sm:text-sm"
                >
                  Go To Progress Tracking
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </motion.div>
            </>
          )}

          {!loading && entries.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <div className="w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mx-auto mb-3.5">
                <Activity className="w-7 h-7 text-primary-400" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold mb-2">No Data Yet</h3>
              <p className="text-xs sm:text-sm text-white/60 mb-6">Log your first progress entry to see analytics</p>
              <Link
                href="/progress-tracking"
                className="inline-flex items-center gap-2 bg-primary-400 text-black px-6 py-3 rounded-xl font-semibold hover:bg-primary-300 transition-all text-xs sm:text-sm"
              >
                Log Progress
                <ChevronRight className="w-4 h-4" />
              </Link>
            </motion.div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
