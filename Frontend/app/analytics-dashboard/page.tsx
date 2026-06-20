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
  ChevronRight,
  ArrowUp,
  ArrowDown,
  Minus,
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
    className={`bg-white/5 border border-white/10 rounded-2xl p-3 sm:p-4 hover:border-primary-400/30 transition-all ${className}`}
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
        <p className="text-[10px] sm:text-[11px] text-white/50 mb-1">{title}</p>
        <p className={`text-lg sm:text-xl font-bold ${color}`}>{value}</p>
        {subValue && <p className="text-[9px] sm:text-[10px] text-white/40 mt-1">{subValue}</p>}
      </div>
      <div className={`${bgColor} p-2 rounded-lg`}>
        <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${color}`} />
      </div>
    </div>
  </Card>
);

const LineChartComponent = ({ data, dataKey, title, color = "#F5C518" }: any) => (
  <Card className="w-full overflow-hidden">
    <h3 className="text-[11px] sm:text-xs font-semibold text-white mb-3">{title}</h3>
    <div className="h-40 sm:h-48">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 5, left: -5, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
          <XAxis
            dataKey="date"
            stroke="#ffffff40"
            tick={{ fontSize: 7, fill: "#ffffff60" }}
            tickFormatter={(date: string) =>
              new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" })
            }
          />
          <YAxis
            stroke="#ffffff40"
            tick={{ fontSize: 7, fill: "#ffffff60" }}
            tickFormatter={(value: number) => `${value}`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#000000",
              border: "1px solid #F5C51830",
              borderRadius: "8px",
              fontSize: "9px"
            }}
            labelStyle={{ color: "#F5C518" }}
          />
          <Line
            type="monotone"
            dataKey={dataKey}
            stroke={color}
            strokeWidth={2}
            dot={{ fill: color, r: 1.5 }}
            activeDot={{ r: 3 }}
            animationDuration={1500}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  </Card>
);

const BarChartComponent = ({ data, title }: any) => (
  <Card className="w-full overflow-hidden">
    <h3 className="text-[11px] sm:text-xs font-semibold text-white mb-3">{title}</h3>
    <div className="h-40 sm:h-48">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 5, right: 5, left: -5, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
          <XAxis
            dataKey="name"
            stroke="#ffffff40"
            tick={{ fontSize: 7, fill: "#ffffff60" }}
          />
          <YAxis
            stroke="#ffffff40"
            tick={{ fontSize: 7, fill: "#ffffff60" }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#000000",
              border: "1px solid #F5C51830",
              borderRadius: "8px",
              fontSize: "9px"
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
  <Card className="w-full overflow-hidden">
    <h3 className="text-[11px] sm:text-xs font-semibold text-white mb-3">{title}</h3>
    <div className="h-40 sm:h-48">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 5, right: 5, left: -5, bottom: 5 }}>
          <defs>
            <linearGradient id="colorValue" x1="0%" y1="0%" x2="0%" y2="1">
              <stop offset="5%" stopColor="#F5C518" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#F5C518" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
          <XAxis
            dataKey="date"
            stroke="#ffffff40"
            tick={{ fontSize: 7, fill: "#ffffff60" }}
            tickFormatter={(date: string) =>
              new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" })
            }
          />
          <YAxis
            stroke="#ffffff40"
            tick={{ fontSize: 7, fill: "#ffffff60" }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#000000",
              border: "1px solid #F5C51830",
              borderRadius: "8px",
              fontSize: "9px"
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
      <h3 className="text-[11px] sm:text-xs font-semibold text-white mb-3 flex items-center gap-2">
        <Scale className="w-3.5 h-3.5 text-primary-400" />
        BMI Analysis
      </h3>
      <div className="flex flex-col items-center">
        <div className="relative w-28 h-28 sm:w-36 sm:h-36 mb-3">
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
            <span className="text-2xl sm:text-3xl font-bold" style={{ color: getBMIColor() }}>
              {bmi.toFixed(1)}
            </span>
            <span className="text-[9px] sm:text-[10px] text-white/50 mt-1">BMI</span>
          </div>
        </div>
        <p className="text-[11px] sm:text-xs font-semibold text-white mb-1.5">{category}</p>
        <p className="text-[9px] sm:text-[10px] text-white/40 text-center">
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

  const getChangeIndicator = (value: number, isGoodIncrease: boolean = false) => {
    if (value > 0) {
      return {
        icon: ArrowUp,
        color: isGoodIncrease ? "text-green-400" : "text-red-400",
        bgColor: isGoodIncrease ? "bg-green-400/10" : "bg-red-400/10",
        sign: "+"
      };
    } else if (value < 0) {
      return {
        icon: ArrowDown,
        color: isGoodIncrease ? "text-red-400" : "text-green-400",
        bgColor: isGoodIncrease ? "bg-red-400/10" : "bg-green-400/10",
        sign: ""
      };
    }
    return {
      icon: Minus,
      color: "text-gray-400",
      bgColor: "bg-gray-400/10",
      sign: ""
    };
  };

  const comparisonData = [
    {
      label: "Weight",
      current: `${currentWeight.toFixed(1)} kg`,
      previous: `${previousWeight.toFixed(1)} kg`,
      diff: weightChange,
      percent: previousWeight !== 0 ? Math.round((weightChange / previousWeight) * 100) : 0,
      isGoodIncrease: false
    },
    {
      label: "Chest",
      current: currentChest ? `${currentChest.toFixed(1)} cm` : "-",
      previous: previousChest ? `${previousChest.toFixed(1)} cm` : "-",
      diff: chestDiff.diff,
      percent: chestDiff.percent,
      isGoodIncrease: true
    },
    {
      label: "Waist",
      current: currentWaist ? `${currentWaist.toFixed(1)} cm` : "-",
      previous: previousWaist ? `${previousWaist.toFixed(1)} cm` : "-",
      diff: waistDiff.diff,
      percent: waistDiff.percent,
      isGoodIncrease: false
    },
    {
      label: "Arms",
      current: currentArms ? `${currentArms.toFixed(1)} cm` : "-",
      previous: previousArms ? `${previousArms.toFixed(1)} cm` : "-",
      diff: armsDiff.diff,
      percent: armsDiff.percent,
      isGoodIncrease: true
    },
    {
      label: "Thighs",
      current: currentThighs ? `${currentThighs.toFixed(1)} cm` : "-",
      previous: previousThighs ? `${previousThighs.toFixed(1)} cm` : "-",
      diff: thighsDiff.diff,
      percent: thighsDiff.percent,
      isGoodIncrease: true
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

  const weightChangeIndicator = getChangeIndicator(weightChange, false);
  const WeightIcon = weightChangeIndicator.icon;

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/5 py-3 sm:py-4"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          <button
            onClick={() => router.push("/")}
            className="p-1.5 sm:p-2 bg-white/5 border border-white/10 rounded-xl hover:border-primary-400/30 hover:bg-primary-400/5 transition-all group"
          >
            <ArrowLeft size={14} className="text-white/70 group-hover:text-primary-400 transition-colors" />
          </button>

          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center">
              <div className="absolute inset-0 bg-primary-400 rotate-45 rounded-sm group-hover:rotate-[60deg] transition-transform duration-300" />
              <Zap size={14} className="relative z-10 text-black fill-black" />
            </div>
            <span className="font-serif font-black text-base sm:text-lg tracking-tight">
              Gym<span className="text-primary-400">Gen</span>
              <span className="text-white/40 text-[10px] sm:text-xs font-light ml-1">AI</span>
            </span>
          </Link>

          <div className="w-9 sm:w-10" />
        </div>
      </motion.nav>

      <main className="pt-20 sm:pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-center mb-8 sm:mb-10"
          >
            <h1 className="text-lg sm:text-xl md:text-2xl font-serif font-bold mb-1.5 sm:mb-2">
              Analytics Dashboard
            </h1>
            <p className="text-[10px] sm:text-xs md:text-sm text-white/60 max-w-2xl mx-auto">
              Track your fitness performance, body transformation and progress insights with GymGen AI.
            </p>
          </motion.div>

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-4 mb-8 sm:mb-10">
              {[...Array(6)].map((_, i) => (
                <Card key={i} delay={i * 0.1}>
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="h-2 bg-white/10 rounded w-12 sm:w-16 animate-pulse" />
                      <div className="h-4 sm:h-5 bg-white/10 rounded w-16 sm:w-20 animate-pulse" />
                    </div>
                    <div className="w-6 sm:w-8 h-6 sm:h-8 bg-white/10 rounded-lg animate-pulse" />
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-4 mb-8 sm:mb-10">
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
                value={`${weightChangeIndicator.sign}${weightChange.toFixed(1)} kg`}
                icon={WeightIcon}
                color={weightChangeIndicator.color}
                bgColor={weightChangeIndicator.bgColor}
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
              <div className="mb-8 sm:mb-10">
                <h2 className="text-sm sm:text-base font-semibold mb-3 sm:mb-4 flex items-center gap-2">
                  <Activity className="w-3.5 h-3.5 text-primary-400" />
                  Body Transformation Analysis
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-2 sm:gap-3">
                  {comparisonData.map((item, i) => {
                    const indicator = getChangeIndicator(item.diff, item.isGoodIncrease);
                    const ChangeIcon = indicator.icon;
                    return (
                      <Card key={item.label} delay={0.1 * i}>
                        <p className="text-[10px] sm:text-[11px] text-white/50 mb-1.5">{item.label}</p>
                        <p className="text-sm sm:text-base font-bold text-white mb-1">{item.current}</p>
                        <p className="text-[9px] sm:text-[10px] text-white/40 mb-1.5">Prev: {item.previous}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <ChangeIcon className="w-3 h-3" style={{ color: indicator.color === "text-green-400" ? "#34D399" : "#EF4444" }} />
                            <span className={`text-[9px] sm:text-[10px] font-semibold ${indicator.color}`}>
                              {indicator.sign}{item.diff.toFixed(1)}
                            </span>
                          </div>
                          <span className={`text-[9px] sm:text-[10px] font-semibold ${indicator.color}`}>
                            {indicator.sign}{Math.abs(item.percent)}%
                          </span>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </div>

              {chartData.length > 0 && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 mb-8 sm:mb-10">
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

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 mb-8 sm:mb-10">
                {barChartData.length > 0 && <BarChartComponent data={barChartData} title="Body Measurements Comparison" />}
                {monthlyData.length > 0 && <AreaChartComponent data={monthlyData} dataKey="weight" title="Monthly Progress Trend" />}
                {weeklyData.length > 0 && <BarChartComponent data={weeklyData} title="Weekly Progress Summary" />}
              </div>

              <BMIGauge bmi={bmi} category={getBMICategory(bmi)} />

              <Card className="mt-8 sm:mt-10">
                <h2 className="text-sm sm:text-base font-semibold mb-3 flex items-center gap-2">
                  <Target className="w-3.5 h-3.5 text-primary-400" />
                  Goal Tracker
                </h2>
                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                      <span className="text-[10px] sm:text-xs text-white/60">
                        {startingWeight.toFixed(1)} kg → {goalWeight.toFixed(1)} kg
                      </span>
                      <span className="text-[10px] sm:text-xs font-semibold text-primary-400">{Math.min(Math.max(Math.abs(progressPercent), 0), 100)}%</span>
                    </div>
                    <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(Math.max(Math.abs(progressPercent), 0), 100)}%` }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className="h-full bg-primary-400 rounded-full"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
                    <div>
                      <p className="text-[10px] sm:text-xs text-white/50">Current</p>
                      <p className="text-base sm:text-lg font-bold text-white">{currentWeight.toFixed(1)} kg</p>
                    </div>
                    <div>
                      <p className="text-[10px] sm:text-xs text-white/50">Target</p>
                      <p className="text-base sm:text-lg font-bold text-primary-400">{goalWeight.toFixed(1)} kg</p>
                    </div>
                    <div>
                      <p className="text-[10px] sm:text-xs text-white/50">Remaining</p>
                      <p className="text-base sm:text-lg font-bold text-white">{Math.abs(goalWeight - currentWeight).toFixed(1)} kg</p>
                    </div>
                  </div>
                </div>
              </Card>

              <div className="mt-8 sm:mt-10">
                <h2 className="text-sm sm:text-base font-semibold mb-3 sm:mb-4 flex items-center gap-2">
                  <Trophy className="w-3.5 h-3.5 text-primary-400" />
                  Achievements
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-2 sm:gap-3">
                  {achievements.map((achievement, i) => (
                    <Card key={achievement.id} delay={0.1 * i} className={`${achievement.unlocked ? "" : "opacity-40 grayscale"}`}>
                      <div className="flex flex-col items-center text-center">
                        <div
                          className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center mb-1.5 sm:mb-2"
                          style={{ backgroundColor: achievement.unlocked ? `${achievement.color}20` : "#ffffff10" }}
                        >
                          <achievement.icon className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: achievement.unlocked ? achievement.color : "#ffffff40" }} />
                        </div>
                        <p className="text-[9px] sm:text-[10px] font-semibold text-white">{achievement.name}</p>
                        <p className="text-[8px] sm:text-[9px] text-white/40 mt-0.5">{achievement.description}</p>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              <div className="mt-8 sm:mt-10">
                <h2 className="text-sm sm:text-base font-semibold mb-3 sm:mb-4 flex items-center gap-2">
                  <Info className="w-3.5 h-3.5 text-primary-400" />
                  AI Insights
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                  {aiInsights.map((insight, i) => (
                    <Card key={i} delay={0.1 * i}>
                      <p className="text-[10px] sm:text-xs text-white/80">{insight}</p>
                    </Card>
                  ))}
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                className="mt-10 sm:mt-12 text-center"
              >
                <Link
                  href="/progress-tracking"
                  className="inline-flex items-center gap-2 bg-primary-400 text-black px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl font-semibold hover:bg-primary-300 transition-all text-[10px] sm:text-xs"
                >
                  Go To Progress Tracking
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </motion.div>
            </>
          )}

          {!loading && entries.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12 sm:py-16"
            >
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mx-auto mb-2.5 sm:mb-3.5">
                <Activity className="w-6 h-6 sm:w-7 sm:h-7 text-primary-400" />
              </div>
              <h3 className="text-sm sm:text-base lg:text-lg font-semibold mb-1.5 sm:mb-2">No Data Yet</h3>
              <p className="text-[10px] sm:text-xs text-white/60 mb-4 sm:mb-6">Log your first progress entry to see analytics</p>
              <Link
                href="/progress-tracking"
                className="inline-flex items-center gap-2 bg-primary-400 text-black px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl font-semibold hover:bg-primary-300 transition-all text-[10px] sm:text-xs"
              >
                Log Progress
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </motion.div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
