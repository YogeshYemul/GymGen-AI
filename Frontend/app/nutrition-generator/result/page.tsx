"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Download,
  UtensilsCrossed,
  Droplets,
  ShoppingCart,
  Scale,
  Zap,
} from "lucide-react";

interface FormData {
  gender: string;
  age: string;
  height: string;
  weight: string;
  targetWeight: string;
  goal: string;
  activityLevel: string;
  experience: string;
  dietType: string;
  mealsPerDay: string;
  workoutTime: string;
  budget: string;
  foodPreferences: string;
}

interface NutritionPlan {
  dailyCalorieTarget: {
    maintenanceCalories: number;
    targetCalories: number;
    deficitOrSurplus: number;
  };
  macros: {
    protein: { grams: number; percentage?: number };
    carbs: { grams: number; percentage?: number };
    fats: { grams: number; percentage?: number };
    fiber: { grams: number };
  };
  micros: {
    iron: number;
    calcium: number;
    vitaminD: number;
    vitaminB12: number;
    magnesium: number;
    zinc: number;
    potassium: number;
    sodium: number;
  };
  waterRequirement: number;
  mealTimeline: { meal: string; time: string; calories: number }[];
  dietTable: {
    meal: string;
    foodItems: string;
    quantity: string;
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
  }[];
  supplements: { name: string; necessary: boolean; explanation: string }[];
  shoppingList: {
    vegetables: string[];
    fruits: string[];
    proteinSources: string[];
    carbohydrates: string[];
    healthyFats: string[];
  };
}

function generatePersonalizedPlan(data: FormData): NutritionPlan {
  const age = parseInt(data.age);
  const height = parseFloat(data.height);
  const weight = parseFloat(data.weight);
  const mealsPerDay = parseInt(data.mealsPerDay);

  let bmr;
  if (data.gender === "Male") {
    bmr = 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    bmr = 10 * weight + 6.25 * height - 5 * age - 161;
  }

  const activityMultipliers: Record<string, number> = {
    Sedentary: 1.2,
    "Lightly Active": 1.375,
    "Moderately Active": 1.55,
    "Very Active": 1.725,
    Athlete: 1.9,
  };
  const activityMultiplier = activityMultipliers[data.activityLevel] || 1.2;
  const maintenanceCalories = Math.round(bmr * activityMultiplier);

  let targetCalories = maintenanceCalories;
  let deficitOrSurplus = 0;
  if (data.goal === "Fat Loss") {
    deficitOrSurplus = -500;
    targetCalories = maintenanceCalories - 500;
  } else if (data.goal === "Muscle Gain") {
    deficitOrSurplus = 300;
    targetCalories = maintenanceCalories + 300;
  } else if (data.goal === "Strength") {
    deficitOrSurplus = 250;
    targetCalories = maintenanceCalories + 250;
  } else if (data.goal === "Athletic Performance") {
    deficitOrSurplus = 200;
    targetCalories = maintenanceCalories + 200;
  }

  const targetWeightVal = parseFloat(data.targetWeight) || weight;
  let proteinGrams = 0;
  if (data.goal === "Muscle Gain" || data.goal === "Strength") {
    proteinGrams = Math.round(targetWeightVal * 2.2);
  } else if (data.goal === "Fat Loss") {
    proteinGrams = Math.round(targetWeightVal * 2);
  } else {
    proteinGrams = Math.round(targetWeightVal * 1.6);
  }

  let fatGrams = Math.round((targetCalories * 0.3) / 9);
  let carbsGrams = Math.round(
    (targetCalories - proteinGrams * 4 - fatGrams * 9) / 4
  );

  if (carbsGrams < 0) {
    carbsGrams = 50;
    fatGrams = Math.round(
      (targetCalories - proteinGrams * 4 - carbsGrams * 4) / 9
    );
  }

  const totalMacroCalories = proteinGrams * 4 + carbsGrams * 4 + fatGrams * 9;
  const proteinPercent = Math.round((proteinGrams * 4 / totalMacroCalories) * 100);
  const carbsPercent = Math.round((carbsGrams * 4 / totalMacroCalories) * 100);
  const fatsPercent = 100 - proteinPercent - carbsPercent;

  const fiberGrams = data.goal === "Fat Loss" ? 30 : 25;

  const micros = {
    iron: data.gender === "Female" ? 18 : 8,
    calcium: 1000,
    vitaminD: 600,
    vitaminB12: 2.4,
    magnesium: data.gender === "Female" ? 310 : 400,
    zinc: data.gender === "Female" ? 8 : 11,
    potassium: 4700,
    sodium: 2300,
  };

  const waterLiters = Math.round((weight * 35) / 100) / 10;

  const baseMeals = [
    { meal: "Breakfast", time: "7:00 AM" },
    { meal: "Mid Morning Snack", time: "10:00 AM" },
    { meal: "Lunch", time: "1:00 PM" },
    { meal: "Pre Workout", time: "4:00 PM" },
    { meal: "Post Workout", time: "5:30 PM" },
    { meal: "Dinner", time: "7:00 PM" },
  ];

  const mealTimeline = baseMeals
    .slice(0, mealsPerDay)
    .map((item) => ({
      ...item,
      calories: Math.round(targetCalories / mealsPerDay),
    }));

  const proteinSources =
    data.dietType === "Vegetarian" || data.dietType === "Eggetarian"
      ? ["Paneer", "Tofu", "Lentils", "Chickpeas", "Black Beans", "Greek Yogurt", ...(data.dietType === "Eggetarian" ? ["Eggs"] : [])]
      : data.dietType === "Vegan"
      ? ["Tofu", "Tempeh", "Lentils", "Chickpeas", "Black Beans", "Quinoa", "Seitan"]
      : ["Chicken Breast", "Fish", "Eggs", "Greek Yogurt", "Paneer", "Lentils", "Lean Beef"];

  const vegSources =
    data.foodPreferences === "South Indian"
      ? ["Spinach", "Tomatoes", "Onions", "Cabbage", "Carrots", "Capsicum", "Drumsticks"]
      : data.foodPreferences === "North Indian"
      ? ["Spinach", "Cauliflower", "Potatoes", "Tomatoes", "Onions", "Peas", "Capsicum"]
      : ["Spinach", "Broccoli", "Tomatoes", "Onions", "Capsicum", "Carrots", "Cucumber"];

  const carbSources =
    data.foodPreferences === "South Indian"
      ? ["Brown Rice", "Ragi", "Oats", "Quinoa", "Idli Batter"]
      : data.foodPreferences === "North Indian"
      ? ["Whole Wheat Roti", "Brown Rice", "Oats", "Quinoa", "Sweet Potato"]
      : ["Brown Rice", "Oats", "Quinoa", "Sweet Potato", "Whole Wheat Bread"];

  const dietTable = mealTimeline.map((mealObj, idx) => {
    const protein = proteinSources[idx % proteinSources.length];
    const carb = carbSources[idx % carbSources.length];
    const veg = vegSources[idx % vegSources.length];
    return {
      meal: mealObj.meal,
      foodItems: `${protein}, ${carb}, ${veg}`,
      quantity: `${
        data.goal === "Muscle Gain" ? "150g" : "120g"
      } ${protein}, ${data.goal === "Fat Loss" ? "80g" : "100g"} ${carb}, 100g ${veg}`,
      calories: Math.round(targetCalories / mealsPerDay),
      protein: Math.round(proteinGrams / mealsPerDay),
      carbs: Math.round(carbsGrams / mealsPerDay),
      fats: Math.round(fatGrams / mealsPerDay),
    };
  });

  const supplements = [
    {
      name: "Whey Protein",
      necessary: false,
      explanation:
        "Convenient for meeting protein goals, but not mandatory if you can get enough from whole foods.",
    },
    {
      name: "Creatine",
      necessary: true,
      explanation:
        "One of the most researched supplements, improves strength and muscle growth.",
    },
    {
      name: "Multivitamin",
      necessary: data.goal === "Fat Loss",
      explanation:
        "Helpful if your diet is restricted, but not essential if you eat a varied diet.",
    },
    {
      name: "Omega 3",
      necessary: false,
      explanation:
        "Good for heart health, but can be obtained from fatty fish if included in diet.",
    },
  ];

  const shoppingList = {
    vegetables: vegSources,
    fruits: ["Bananas", "Apples", "Oranges", "Berries", "Mangoes"],
    proteinSources: proteinSources,
    carbohydrates: carbSources,
    healthyFats: ["Almonds", "Peanut Butter", "Olive Oil", "Avocado", "Walnuts"],
  };

  return {
    dailyCalorieTarget: {
      maintenanceCalories,
      targetCalories,
      deficitOrSurplus,
    },
    macros: {
      protein: { grams: proteinGrams, percentage: proteinPercent },
      carbs: { grams: carbsGrams, percentage: carbsPercent },
      fats: { grams: fatGrams, percentage: fatsPercent },
      fiber: { grams: fiberGrams },
    },
    micros,
    waterRequirement: waterLiters,
    mealTimeline,
    dietTable,
    supplements,
    shoppingList,
  };
}

export default function NutritionResultPage() {
  const [nutritionPlan, setNutritionPlan] = useState<NutritionPlan | null>(null);
  const [formData, setFormData] = useState<FormData | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedPlan = localStorage.getItem("nutritionPlan");
      const savedFormData = localStorage.getItem("nutritionFormData");
      if (savedPlan) setNutritionPlan(JSON.parse(savedPlan));
      if (savedFormData) setFormData(JSON.parse(savedFormData));
    }
  }, []);

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-primary-400/10 blur-[140px]" />
      </div>

      <header className="border-b border-white/5 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-4 py-4 md:py-5 flex items-center justify-between">
          <Link
            href="/nutrition-generator"
            className="flex items-center gap-1.5 md:gap-2 text-white/70 hover:text-primary-400 transition text-sm md:text-base"
          >
            <ArrowLeft size={16} className="md:w-[18px] md:h-[18px]" />
            Back
          </Link>
          <div className="font-black text-lg md:text-xl">
            Gym<span className="text-primary-400">Gen</span> AI
          </div>
          <div />
        </div>
      </header>

      <section className="max-w-6xl mx-auto px-4 py-8 md:py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 md:mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-primary-400/10 border border-primary-400/20 rounded-full px-3 md:px-4 py-1.5 md:py-2 mb-4 md:mb-6">
            <UtensilsCrossed size={14} className="md:w-[16px] md:h-[16px] text-primary-400" />
            <span className="text-[10px] md:text-xs tracking-wider uppercase">
              AI Generated Nutrition Plan
            </span>
          </div>

          <h1 className="text-2xl md:text-4xl lg:text-5xl font-black mb-3 md:mb-4">
            Your Personalized
            <span className="text-primary-400 block">Nutrition Plan</span>
          </h1>

          <p className="text-white/60 mb-6 md:mb-8 text-sm md:text-base">
            Generated by GymGen AI, tailored perfectly to your goals and preferences.
          </p>

          {formData && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 md:gap-3 lg:gap-4"
            >
              <div className="bg-white/[0.015] border border-primary-400/15 rounded-xl p-2.5 md:p-3 lg:p-4 text-center">
                <div className="text-[10px] md:text-xs text-white/50 uppercase tracking-wider mb-0.5 md:mb-1">Gender</div>
                <div className="text-xs md:text-sm lg:text-lg font-semibold">{formData.gender}</div>
              </div>
              <div className="bg-white/[0.015] border border-primary-400/15 rounded-xl p-2.5 md:p-3 lg:p-4 text-center">
                <div className="text-[10px] md:text-xs text-white/50 uppercase tracking-wider mb-0.5 md:mb-1">Age</div>
                <div className="text-xs md:text-sm lg:text-lg font-semibold">{formData.age}</div>
              </div>
              <div className="bg-white/[0.015] border border-primary-400/15 rounded-xl p-2.5 md:p-3 lg:p-4 text-center">
                <div className="text-[10px] md:text-xs text-white/50 uppercase tracking-wider mb-0.5 md:mb-1">Height</div>
                <div className="text-xs md:text-sm lg:text-lg font-semibold">{formData.height} cm</div>
              </div>
              <div className="bg-white/[0.015] border border-primary-400/15 rounded-xl p-2.5 md:p-3 lg:p-4 text-center">
                <div className="text-[10px] md:text-xs text-white/50 uppercase tracking-wider mb-0.5 md:mb-1">Weight</div>
                <div className="text-xs md:text-sm lg:text-lg font-semibold">{formData.weight} kg</div>
              </div>
              <div className="bg-white/[0.015] border border-primary-400/15 rounded-xl p-2.5 md:p-3 lg:p-4 text-center">
                <div className="text-[10px] md:text-xs text-white/50 uppercase tracking-wider mb-0.5 md:mb-1">Goal</div>
                <div className="text-xs md:text-sm lg:text-lg font-semibold">{formData.goal}</div>
              </div>
              <div className="bg-white/[0.015] border border-primary-400/15 rounded-xl p-2.5 md:p-3 lg:p-4 text-center">
                <div className="text-[10px] md:text-xs text-white/50 uppercase tracking-wider mb-0.5 md:mb-1">Activity</div>
                <div className="text-xs md:text-sm lg:text-lg font-semibold">{formData.activityLevel}</div>
              </div>
            </motion.div>
          )}
        </motion.div>

        {nutritionPlan && (
          <>
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-10 md:mb-12"
            >
              <h2 className="text-xl md:text-2xl font-bold mb-6 md:mb-8 flex items-center gap-2">
                <Scale className="text-primary-400" size={20} />
                Daily Calorie Target
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.25 }}
                  className="bg-white/[0.015] border border-primary-400/15 rounded-2xl p-4 md:p-6"
                >
                  <div className="text-[10px] md:text-xs text-white/60 uppercase tracking-wider mb-1 md:mb-2">Maintenance Calories</div>
                  <div className="text-2xl md:text-3xl font-black">
                    {nutritionPlan.dailyCalorieTarget.maintenanceCalories}
                    <span className="text-xs md:text-sm font-normal text-white/50"> kcal</span>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                  className="bg-white/[0.015] border border-primary-400/25 rounded-2xl p-4 md:p-6 bg-primary-400/5"
                >
                  <div className="text-[10px] md:text-xs text-white/60 uppercase tracking-wider mb-1 md:mb-2">Target Calories</div>
                  <div className="text-2xl md:text-3xl font-black text-primary-400">
                    {nutritionPlan.dailyCalorieTarget.targetCalories}
                    <span className="text-xs md:text-sm font-normal text-white/50"> kcal</span>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.35 }}
                  className="bg-white/[0.015] border border-primary-400/15 rounded-2xl p-4 md:p-6"
                >
                  <div className="text-[10px] md:text-xs text-white/60 uppercase tracking-wider mb-1 md:mb-2">
                    {nutritionPlan.dailyCalorieTarget.deficitOrSurplus < 0 ? "Deficit" : "Surplus"}
                  </div>
                  <div className={`text-2xl md:text-3xl font-black ${nutritionPlan.dailyCalorieTarget.deficitOrSurplus < 0 ? "text-green-400" : "text-primary-400"}`}>
                    {nutritionPlan.dailyCalorieTarget.deficitOrSurplus < 0 ? "-" : "+"}
                    {Math.abs(nutritionPlan.dailyCalorieTarget.deficitOrSurplus)}
                    <span className="text-xs md:text-sm font-normal text-white/50"> kcal</span>
                  </div>
                </motion.div>
              </div>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mb-10 md:mb-12"
            >
              <h2 className="text-xl md:text-2xl font-bold mb-6 md:mb-8 flex items-center gap-2">
                <Zap className="text-primary-400" size={20} />
                Macronutrients
              </h2>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.45 }}
                  className="bg-white/[0.015] border border-white/10 rounded-2xl p-4 md:p-6 text-center"
                >
                  <div className="text-[10px] md:text-xs text-white/60 uppercase tracking-wider mb-2 md:mb-3">Protein</div>
                  <div className="text-2xl md:text-3xl font-black mb-1">
                    {nutritionPlan.macros.protein.grams}g
                  </div>
                  <div className="text-[10px] md:text-xs text-white/40">
                    ({nutritionPlan.macros.protein.percentage}%)
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="bg-white/[0.015] border border-white/10 rounded-2xl p-4 md:p-6 text-center"
                >
                  <div className="text-[10px] md:text-xs text-white/60 uppercase tracking-wider mb-2 md:mb-3">Carbohydrates</div>
                  <div className="text-2xl md:text-3xl font-black mb-1">
                    {nutritionPlan.macros.carbs.grams}g
                  </div>
                  <div className="text-[10px] md:text-xs text-white/40">
                    ({nutritionPlan.macros.carbs.percentage}%)
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.55 }}
                  className="bg-white/[0.015] border border-white/10 rounded-2xl p-4 md:p-6 text-center"
                >
                  <div className="text-[10px] md:text-xs text-white/60 uppercase tracking-wider mb-2 md:mb-3">Fats</div>
                  <div className="text-2xl md:text-3xl font-black mb-1">
                    {nutritionPlan.macros.fats.grams}g
                  </div>
                  <div className="text-[10px] md:text-xs text-white/40">
                    ({nutritionPlan.macros.fats.percentage}%)
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="bg-white/[0.015] border border-white/10 rounded-2xl p-4 md:p-6 text-center"
                >
                  <div className="text-[10px] md:text-xs text-white/60 uppercase tracking-wider mb-2 md:mb-3">Fiber</div>
                  <div className="text-2xl md:text-3xl font-black mb-1">
                    {nutritionPlan.macros.fiber.grams}g
                  </div>
                </motion.div>
              </div>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65 }}
              className="mb-10 md:mb-12"
            >
              <h2 className="text-xl md:text-2xl font-bold mb-6 md:mb-8">Micronutrients</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                {Object.entries(nutritionPlan.micros).map(([key, value], idx) => (
                  <motion.div
                    key={key}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.7 + idx * 0.05 }}
                    className="bg-white/[0.015] border border-white/10 rounded-xl p-3 md:p-4 text-center"
                  >
                    <div className="text-[10px] md:text-xs text-white/60 uppercase tracking-wider mb-1">
                      {key}
                    </div>
                    <div className="text-lg md:text-2xl font-bold">
                      {value}
                      <span className="text-[10px] md:text-xs text-white/40">
                        {key === "vitaminB12" ? "mcg" : key === "vitaminD" ? "IU" : "mg"}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="mb-10 md:mb-12"
            >
              <h2 className="text-xl md:text-2xl font-bold mb-6 md:mb-8 flex items-center gap-2">
                <Droplets className="text-primary-400" size={20} />
                Water Requirement
              </h2>
              <div className="bg-white/[0.015] border border-primary-400/20 rounded-2xl p-6 md:p-8 text-center">
                <div className="text-4xl md:text-5xl font-black text-primary-400 mb-1 md:mb-2">
                  {nutritionPlan.waterRequirement}L
                </div>
                <div className="text-white/60 text-xs md:text-sm">Per day</div>
              </div>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="mb-10 md:mb-12"
            >
              <h2 className="text-xl md:text-2xl font-bold mb-6 md:mb-8">Meal Timeline</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                {nutritionPlan.mealTimeline.map((meal, idx) => (
                  <motion.div
                    key={meal.meal}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.05 + idx * 0.1 }}
                    className="bg-white/[0.015] border border-white/10 rounded-xl p-4 md:p-5 flex justify-between items-center"
                  >
                    <div>
                      <div className="font-bold text-sm md:text-base">{meal.meal}</div>
                      <div className="text-[10px] md:text-xs text-white/50">{meal.time}</div>
                    </div>
                    <div className="text-lg md:text-xl font-bold text-primary-400">{meal.calories} kcal</div>
                  </motion.div>
                ))}
              </div>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.3 }}
              className="mb-10 md:mb-12"
            >
              <h2 className="text-xl md:text-2xl font-bold mb-6 md:mb-8">Complete Diet Plan</h2>
              <div className="overflow-hidden rounded-2xl border border-white/10">
                <div className="overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-primary-400/10 border-y border-primary-400/20">
                      <tr>
                        <th className="py-2 md:py-3 lg:py-4 px-2.5 md:px-3 lg:px-6 text-left text-[10px] md:text-xs lg:text-sm font-bold text-primary-400 uppercase tracking-wider">
                          Meal
                        </th>
                        <th className="py-2 md:py-3 lg:py-4 px-1.5 md:px-2 lg:px-4 text-left text-[10px] md:text-xs lg:text-sm font-bold text-primary-400 uppercase tracking-wider hidden md:table-cell">
                          Food Items
                        </th>
                        <th className="py-2 md:py-3 lg:py-4 px-1.5 md:px-2 lg:px-4 text-center text-[10px] md:text-xs lg:text-sm font-bold text-primary-400 uppercase tracking-wider">
                          Quantity
                        </th>
                        <th className="py-2 md:py-3 lg:py-4 px-1.5 md:px-2 lg:px-4 text-center text-[10px] md:text-xs lg:text-sm font-bold text-primary-400 uppercase tracking-wider">
                          Cal
                        </th>
                        <th className="py-2 md:py-3 lg:py-4 px-1.5 md:px-2 lg:px-4 text-center text-[10px] md:text-xs lg:text-sm font-bold text-primary-400 uppercase tracking-wider">
                          Pro
                        </th>
                        <th className="py-2 md:py-3 lg:py-4 px-1.5 md:px-2 lg:px-4 text-center text-[10px] md:text-xs lg:text-sm font-bold text-primary-400 uppercase tracking-wider">
                          Carbs
                        </th>
                        <th className="py-2 md:py-3 lg:py-4 px-1.5 md:px-2 lg:px-4 text-center text-[10px] md:text-xs lg:text-sm font-bold text-primary-400 uppercase tracking-wider">
                          Fats
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {nutritionPlan.dietTable.map((row, idx) => (
                        <tr
                          key={idx}
                          className={`border-b border-white/5 ${
                            idx % 2 === 0 ? "bg-transparent" : "bg-white/[0.015]"
                          } hover:bg-white/[0.035] transition-colors`}
                        >
                          <td className="py-2 md:py-2.5 lg:py-4 px-2.5 md:px-3 lg:px-6 font-medium text-xs md:text-sm lg:text-base">
                            {row.meal}
                          </td>
                          <td className="py-2 md:py-2.5 lg:py-4 px-1.5 md:px-2 lg:px-4 text-white/70 text-xs md:text-sm lg:text-base hidden md:table-cell break-words">
                            {row.foodItems}
                          </td>
                          <td className="py-2 md:py-2.5 lg:py-4 px-1.5 md:px-2 lg:px-4 text-center text-white/70 text-xs md:text-sm lg:text-base break-words">
                            {row.quantity}
                          </td>
                          <td className="py-2 md:py-2.5 lg:py-4 px-1.5 md:px-2 lg:px-4 text-center text-white/85 text-xs md:text-sm lg:text-base">
                            {row.calories}
                          </td>
                          <td className="py-2 md:py-2.5 lg:py-4 px-1.5 md:px-2 lg:px-4 text-center text-white/85 text-xs md:text-sm lg:text-base">
                            {row.protein}g
                          </td>
                          <td className="py-2 md:py-2.5 lg:py-4 px-1.5 md:px-2 lg:px-4 text-center text-white/85 text-xs md:text-sm lg:text-base">
                            {row.carbs}g
                          </td>
                          <td className="py-2 md:py-2.5 lg:py-4 px-1.5 md:px-2 lg:px-4 text-center text-white/85 text-xs md:text-sm lg:text-base">
                            {row.fats}g
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.6 }}
              className="mb-10 md:mb-12"
            >
              <h2 className="text-xl md:text-2xl font-bold mb-6 md:mb-8">Supplement Recommendations</h2>
              <div className="grid md:grid-cols-2 gap-4 md:gap-5">
                {nutritionPlan.supplements.map((supp, idx) => (
                  <motion.div
                    key={supp.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.65 + idx * 0.1 }}
                    className="bg-white/[0.015] border border-white/10 rounded-2xl p-4 md:p-6"
                  >
                    <div className="flex justify-between items-start mb-2 md:mb-3">
                      <h3 className="font-bold text-base md:text-lg">{supp.name}</h3>
                      <span className={`px-2.5 md:px-3 py-1 md:py-1.5 rounded-full text-[10px] md:text-xs font-semibold ${
                        supp.necessary
                          ? "bg-primary-400/20 text-primary-400 border border-primary-400/30"
                          : "bg-white/10 text-white/60 border border-white/10"
                      }`}>
                        {supp.necessary ? "Recommended" : "Optional"}
                      </span>
                    </div>
                    <p className="text-white/70 text-xs md:text-sm">{supp.explanation}</p>
                  </motion.div>
                ))}
              </div>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2 }}
              className="mb-10 md:mb-12"
            >
              <h2 className="text-xl md:text-2xl font-bold mb-6 md:mb-8 flex items-center gap-2">
                <ShoppingCart className="text-primary-400" size={20} />
                Weekly Shopping List
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
                {Object.entries(nutritionPlan.shoppingList).map(
                  ([category, items], idx) => (
                    <motion.div
                      key={category}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 2.05 + idx * 0.1 }}
                      className="bg-white/[0.015] border border-white/10 rounded-2xl p-4 md:p-6"
                    >
                      <h3 className="font-bold text-base md:text-lg mb-3 md:mb-4 capitalize">{category}</h3>
                      <ul className="space-y-2">
                        {items.map((item, i) => (
                          <li key={i} className="flex items-center gap-2 md:gap-3 text-white/70 text-xs md:text-sm">
                            <div className="w-1.5 md:w-2 h-1.5 md:h-2 rounded-full bg-primary-400/50" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  )
                )}
              </div>
            </motion.section>
          </>
        )}

        <div className="flex flex-wrap gap-3 md:gap-4">
          <Link
            href="/nutrition-generator"
            className="px-4 md:px-6 py-2.5 md:py-3 border border-white/10 rounded-xl hover:border-primary-400/30 transition text-sm md:text-base"
          >
            Generate Another Plan
          </Link>
          <button
            onClick={() => window.print()}
            className="bg-primary-400 text-black px-4 md:px-6 py-2.5 md:py-3 rounded-xl font-semibold flex items-center gap-1.5 md:gap-2 hover:bg-primary-300 transition text-sm md:text-base"
          >
            <Download size={16} className="md:w-[18px] md:h-[18px]" />
            Download / Print
          </button>
        </div>
      </section>
    </main>
  );
}
