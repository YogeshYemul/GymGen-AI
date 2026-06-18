import { NextResponse } from "next/server";

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
    protein: { grams: number; percentage: number };
    carbs: { grams: number; percentage: number };
    fats: { grams: number; percentage: number };
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
  mealTimeline: {
    meal: string;
    time: string;
    calories: number;
  }[];
  dietTable: {
    meal: string;
    foodItems: string;
    quantity: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  }[];
  supplements: {
    name: string;
    necessary: boolean;
    explanation: string;
  }[];
  shoppingList: {
    vegetables: string[];
    fruits: string[];
    proteinSources: string[];
    carbohydrates: string[];
    healthyFats: string[];
  };
}

function calculateNutritionPlan(data: FormData): NutritionPlan {
  const age = parseInt(data.age);
  const height = parseFloat(data.height);
  const weight = parseFloat(data.weight);
  const targetWeight = parseFloat(data.targetWeight);
  const mealsPerDay = parseInt(data.mealsPerDay);

  // Calculate BMR (Mifflin-St Jeor Equation)
  let bmr;
  if (data.gender === "Male") {
    bmr = 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    bmr = 10 * weight + 6.25 * height - 5 * age - 161;
  }

  // Activity multipliers
  const activityMultipliers: Record<string, number> = {
    "Sedentary": 1.2,
    "Lightly Active": 1.375,
    "Moderately Active": 1.55,
    "Very Active": 1.725,
    "Athlete": 1.9,
  };
  const activityMultiplier = activityMultipliers[data.activityLevel] || 1.2;
  const maintenanceCalories = Math.round(bmr * activityMultiplier);

  // Calculate target calories
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

  // Calculate macros
  let proteinGrams = 0;
  if (data.goal === "Muscle Gain" || data.goal === "Strength") {
    proteinGrams = Math.round(targetWeight * 2.2); // 2.2g per kg of target bodyweight
  } else if (data.goal === "Fat Loss") {
    proteinGrams = Math.round(targetWeight * 2); // 2g per kg
  } else {
    proteinGrams = Math.round(targetWeight * 1.6); // 1.6g per kg
  }

  let fatGrams = Math.round((targetCalories * 0.3) / 9); // 30% of calories from fat
  let carbsGrams = Math.round((targetCalories - (proteinGrams * 4) - (fatGrams * 9)) / 4);

  // Adjust if carbs go negative
  if (carbsGrams < 0) {
    carbsGrams = 50;
    fatGrams = Math.round((targetCalories - (proteinGrams * 4) - (carbsGrams * 4)) / 9);
  }

  // Macronutrient percentages
  const totalMacroCalories = proteinGrams * 4 + carbsGrams * 4 + fatGrams * 9;
  const proteinPercent = Math.round((proteinGrams * 4 / totalMacroCalories) * 100);
  const carbsPercent = Math.round((carbsGrams * 4 / totalMacroCalories) * 100);
  const fatsPercent = 100 - proteinPercent - carbsPercent;

  // Fiber
  const fiberGrams = data.goal === "Fat Loss" ? 30 : 25;

  // Micronutrients
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

  // Water requirement (35ml per kg of bodyweight)
  const waterLiters = Math.round((weight * 35) / 100) / 10;

  // Meal timeline
  const baseTimes = ["7:00 AM", "10:00 AM", "1:00 PM", "4:00 PM", "7:00 PM", "10:00 PM"];
  const baseMeals = ["Breakfast", "Mid Morning Snack", "Lunch", "Pre Workout", "Post Workout", "Dinner"];
  const mealCaloriesPerMeal = Math.round(targetCalories / mealsPerDay);
  
  const mealTimeline = [];
  for (let i = 0; i < mealsPerDay; i++) {
    mealTimeline.push({
      meal: baseMeals[i],
      time: baseTimes[i],
      calories: mealCaloriesPerMeal,
    });
  }

  // Generate diet table based on diet type and preferences
  let proteinSources = [];
  let carbSources = [];
  let vegSources = [];

  if (data.dietType === "Vegetarian" || data.dietType === "Eggetarian") {
    proteinSources = ["Paneer", "Tofu", "Lentils", "Chickpeas", "Black Beans", "Greek Yogurt", data.dietType === "Eggetarian" ? "Eggs" : null].filter(Boolean) as string[];
  } else if (data.dietType === "Vegan") {
    proteinSources = ["Tofu", "Tempeh", "Lentils", "Chickpeas", "Black Beans", "Quinoa", "Seitan"];
  } else {
    proteinSources = ["Chicken Breast", "Fish", "Eggs", "Greek Yogurt", "Paneer", "Lentils", "Lean Beef"];
  }

  if (data.foodPreferences === "South Indian") {
    carbSources = ["Brown Rice", "Ragi", "Oats", "Quinoa", "Idli Batter", "Dosa Batter"];
    vegSources = ["Spinach", "Tomatoes", "Onions", "Cabbage", "Carrots", "Bell Peppers", "Drumsticks"];
  } else if (data.foodPreferences === "North Indian") {
    carbSources = ["Whole Wheat Roti", "Brown Rice", "Oats", "Quinoa", "Sweet Potato"];
    vegSources = ["Spinach", "Cauliflower", "Potatoes", "Tomatoes", "Onions", "Peas", "Capsicum"];
  } else {
    carbSources = ["Brown Rice", "Oats", "Quinoa", "Sweet Potato", "Whole Wheat Bread"];
    vegSources = ["Spinach", "Broccoli", "Tomatoes", "Onions", "Bell Peppers", "Carrots", "Cucumber"];
  }

  const dietTable = [];
  for (let i = 0; i < mealsPerDay; i++) {
    const meal = baseMeals[i];
    const protein = proteinSources[i % proteinSources.length];
    const carb = carbSources[i % carbSources.length];
    const veg = vegSources[i % vegSources.length];

    const proteinPortion = data.goal === "Muscle Gain" ? "150g" : "120g";
    const carbPortion = data.goal === "Fat Loss" ? "80g" : "100g";
    const vegPortion = "100g";

    const mealProtein = Math.round(proteinGrams / mealsPerDay);
    const mealCarbs = Math.round(carbsGrams / mealsPerDay);
    const mealFats = Math.round(fatGrams / mealsPerDay);
    const mealCals = Math.round(targetCalories / mealsPerDay);

    dietTable.push({
      meal,
      foodItems: `${protein}, ${carb}, ${veg}`,
      quantity: `${proteinPortion} ${protein}, ${carbPortion} ${carb}, ${vegPortion} ${veg}`,
      calories: mealCals,
      protein: mealProtein,
      carbs: mealCarbs,
      fat: mealFats,
    });
  }

  // Supplements
  const supplements = [
    { name: "Whey Protein", necessary: false, explanation: "Convenient for meeting protein goals, but not mandatory if you can get enough from whole foods." },
    { name: "Creatine", necessary: true, explanation: "One of the most researched supplements, improves strength and muscle growth." },
    { name: "Multivitamin", necessary: data.goal === "Fat Loss", explanation: "Helpful if your diet is restricted, but not essential if you eat a varied diet." },
    { name: "Omega 3", necessary: false, explanation: "Good for heart health, but can be obtained from fatty fish if included in diet." },
  ];

  // Shopping list
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

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const plan = calculateNutritionPlan(body as FormData);
    return NextResponse.json({ success: true, plan });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: "Failed to generate nutrition plan" }, { status: 500 });
  }
}
