import { NextResponse } from "next/server";

// Exercise Database
const EXERCISE_DATABASE = {
  bodyweight: {
    upperPush: ["Push-ups", "Incline Push-ups", "Decline Push-ups", "Diamond Push-ups", "Pike Push-ups", "Dips (if possible)"],
    upperPull: ["Pull-ups", "Chin-ups", "Inverted Rows", "Australian Pull-ups", "Face Pulls (using door)", "Bicep Curls (water bottles)"],
    lower: ["Bodyweight Squats", "Lunges", "Bulgarian Split Squats", "Glute Bridges", "Hip Thrusts", "Calf Raises", "Pistol Squats (progression)"],
    core: ["Plank", "Side Plank", "Hanging Leg Raises", "Russian Twists", "Mountain Climbers"],
    fullBody: ["Burpees", "Jumping Jacks", "High Knees", "Squat Jumps", "Box Jumps (if available)"]
  },
  dumbbells: {
    upperPush: ["Dumbbell Bench Press", "Incline Dumbbell Press", "Overhead Press", "Lateral Raises", "Front Raises", "Tricep Extensions"],
    upperPull: ["Dumbbell Rows", "Bent Over Rows", "Pull-ups (assisted if needed)", "Face Pulls", "Dumbbell Bicep Curls", "Hammer Curls"],
    lower: ["Dumbbell Squats", "Dumbbell Lunges", "Romanian Deadlifts", "Dumbbell Hip Thrusts", "Calf Raises", "Step-ups"],
    core: ["Weighted Plank", "Russian Twists (with weight)", "Dumbbell Crunches", "Leg Raises"],
    fullBody: ["Dumbbell Swings", "Dumbbell Thrusters", "Goblet Squats", "Farmer's Carry"]
  },
  homeGym: {
    upperPush: ["Bench Press", "Overhead Press", "Incline Press", "Tricep Dips", "Lateral Raises"],
    upperPull: ["Pull-ups (machine)", "Lat Pulldown", "Cable Rows", "Bicep Curls", "Face Pulls"],
    lower: ["Squats (rack)", "Romanian Deadlifts", "Leg Press", "Leg Extensions", "Leg Curls", "Calf Raises"],
    core: ["Hanging Leg Raises", "Cable Crunches", "Plank", "Ab Wheel Rollouts"],
    fullBody: ["Kettlebell Swings", "Deadlifts (light)", "Thrusters"]
  },
  fullGym: {
    upperPush: ["Barbell Bench Press", "Incline Barbell Press", "Overhead Press", "Dumbbell Flyes", "Cable Crossovers", "Tricep Pushdowns", "Skull Crushers"],
    upperPull: ["Pull-ups", "Lat Pulldowns", "Barbell Rows", "T-bar Rows", "Face Pulls", "Dumbbell Curls", "Hammer Curls"],
    lower: ["Back Squats", "Front Squats", "Deadlifts", "Romanian Deadlifts", "Leg Press", "Leg Extensions", "Leg Curls", "Calf Raises"],
    core: ["Hanging Leg Raises", "Cable Crunches", "Weighted Plank", "Ab Wheel", "Wood Chops"],
    fullBody: ["Power Cleans", "Kettlebell Swings", "Thrusters", "Farmer's Carry", "Sled Push/Pull"]
  }
};

// Personalization Functions
function selectSplit(days: number, experience: string) {
  if (experience === "Advanced" && days >= 5) {
    return "bro"; // One muscle group per day for advanced
  }
  
  switch(days) {
    case 1:
    case 2:
      return "fullBody";
    case 3:
      return "pushPullLegs";
    case 4:
      return "upperLower";
    case 5:
      return "pushPullLegsUpperLower";
    case 6:
      return "pushPullLegsPushPullLegs";
    default:
      return "fullBody";
  }
}

function getExercisesForSplit(split: string, day: number, equipment: string, goal: string, experience: string) {
  const db = EXERCISE_DATABASE[equipment as keyof typeof EXERCISE_DATABASE] || EXERCISE_DATABASE.bodyweight;
  
  switch(split) {
    case "fullBody":
      return {
        title: "Full Body Workout",
        targetMuscles: "Chest, Back, Shoulders, Legs, Arms",
        exercises: [
          ...db.upperPush.slice(0,2),
          ...db.upperPull.slice(0,2),
          ...db.lower.slice(0,3),
          ...db.core.slice(0,1)
        ]
      };
    case "pushPullLegs":
      const pplDays = [
        { title: "Push Day", targetMuscles: "Chest, Shoulders, Triceps", exercises: [...db.upperPush, ...db.core.slice(0,1)] },
        { title: "Pull Day", targetMuscles: "Back, Biceps, Rear Delts", exercises: [...db.upperPull, ...db.core.slice(0,1)] },
        { title: "Leg Day", targetMuscles: "Quads, Glutes, Hamstrings, Calves", exercises: [...db.lower, ...db.core.slice(0,1)] }
      ];
      return pplDays[(day-1) % 3];
    case "upperLower":
      const ulDays = [
        { title: "Upper Day", targetMuscles: "Chest, Back, Shoulders, Arms", exercises: [...db.upperPush, ...db.upperPull] },
        { title: "Lower Day", targetMuscles: "Quads, Glutes, Hamstrings, Calves", exercises: [...db.lower, ...db.core] },
        { title: "Upper Day 2", targetMuscles: "Chest, Back, Shoulders, Arms", exercises: [...db.upperPull, ...db.upperPush.slice().reverse()] },
        { title: "Lower Day 2", targetMuscles: "Quads, Glutes, Hamstrings, Calves", exercises: [...db.lower.slice().reverse(), ...db.core] }
      ];
      return ulDays[(day-1) % 4];
    case "pushPullLegsUpperLower":
      const full5Days = [
        { title: "Push Day", targetMuscles: "Chest, Shoulders, Triceps", exercises: [...db.upperPush, ...db.core.slice(0,1)] },
        { title: "Pull Day", targetMuscles: "Back, Biceps, Rear Delts", exercises: [...db.upperPull, ...db.core.slice(0,1)] },
        { title: "Leg Day", targetMuscles: "Quads, Glutes, Hamstrings, Calves", exercises: [...db.lower, ...db.core.slice(0,1)] },
        { title: "Upper Day", targetMuscles: "Chest, Back, Shoulders, Arms", exercises: [...db.upperPush.slice(0,3), ...db.upperPull.slice(0,3)] },
        { title: "Lower Day", targetMuscles: "Quads, Glutes, Hamstrings, Calves", exercises: [...db.lower.slice(0,5), ...db.core] }
      ];
      return full5Days[day-1];
    case "pushPullLegsPushPullLegs":
      const pplDays2 = [
        { title: "Push Day 1", targetMuscles: "Chest, Shoulders, Triceps", exercises: db.upperPush },
        { title: "Pull Day 1", targetMuscles: "Back, Biceps, Rear Delts", exercises: db.upperPull },
        { title: "Leg Day 1", targetMuscles: "Quads, Glutes, Hamstrings, Calves", exercises: db.lower },
        { title: "Push Day 2", targetMuscles: "Chest, Shoulders, Triceps", exercises: db.upperPush.slice().reverse() },
        { title: "Pull Day 2", targetMuscles: "Back, Biceps, Rear Delts", exercises: db.upperPull.slice().reverse() },
        { title: "Leg Day 2", targetMuscles: "Quads, Glutes, Hamstrings, Calves", exercises: db.lower.slice().reverse() }
      ];
      return pplDays2[day-1];
    case "bro":
      const broDays = [
        { title: "Chest Day", targetMuscles: "Chest, Triceps", exercises: [...db.upperPush.slice(0,5), ...db.core.slice(0,1)] },
        { title: "Back Day", targetMuscles: "Back, Biceps", exercises: [...db.upperPull.slice(0,5), ...db.core.slice(0,1)] },
        { title: "Shoulders Day", targetMuscles: "Shoulders, Traps", exercises: [...db.upperPush.slice(2,6), ...db.core.slice(0,1)] },
        { title: "Leg Day", targetMuscles: "Quads, Glutes, Hamstrings, Calves", exercises: db.lower },
        { title: "Arms Day", targetMuscles: "Biceps, Triceps, Forearms", exercises: [...db.upperPush.slice(4,6), ...db.upperPull.slice(4,6), ...db.core.slice(0,1)] },
        { title: "Full Body Pump Day", targetMuscles: "Full Body", exercises: [...db.fullBody, ...db.core.slice(0,2)] }
      ];
      return broDays[day-1];
    default:
      return {
        title: "Full Body Workout",
        targetMuscles: "Chest, Back, Shoulders, Legs, Arms",
        exercises: db.fullBody
      };
  }
}

function getSetsRepsRest(goal: string, experience: string, exerciseIndex: number) {
  // Goal-based parameters
  switch(goal) {
    case "Muscle Gain":
      return experience === "Beginner" ? 
        { sets: 3, reps: "10-12", rest: "60s" } : 
        experience === "Intermediate" ? 
          { sets: 4, reps: "8-12", rest: "75-90s" } : 
          { sets: 5, reps: "6-10", rest: "90-120s" };
    case "Fat Loss":
      return { sets: 4, reps: "12-15", rest: "30-45s" };
    case "Strength":
      return experience === "Beginner" ? 
        { sets: 4, reps: "5-8", rest: "2-3min" } : 
        { sets: 5, reps: "3-6", rest: "3-5min" };
    case "Athletic Performance":
      return { sets: 4, reps: "8-10", rest: "60-90s" };
    default:
      return { sets: 3, reps: "10-12", rest: "60s" };
  }
}

function estimateWeight(exerciseName: string, userWeightKg: number, experience: string, goal: string, equipment: string) {
  let multiplier = 0.3;
  
  if (experience === "Beginner") multiplier = 0.2;
  if (experience === "Intermediate") multiplier = 0.35;
  if (experience === "Advanced") multiplier = 0.5;

  if (goal === "Strength") multiplier *= 1.3;
  if (goal === "Muscle Gain") multiplier *= 1.1;
  if (goal === "Fat Loss") multiplier *= 0.8;

  if (equipment === "Bodyweight") return "Bodyweight";
  if (equipment === "Dumbbells") multiplier *= 0.5; // Each dumbbell

  const lowerBody = ["squat", "deadlift", "lunge", "leg press", "hip thrust"];
  const upperBody = ["bench", "press", "row", "pull"];

  const nameLower = exerciseName.toLowerCase();
  let estimated;
  if (lowerBody.some(w => nameLower.includes(w))) {
    estimated = userWeightKg * multiplier * 1.4;
  } else if (upperBody.some(w => nameLower.includes(w))) {
    estimated = userWeightKg * multiplier * 0.8;
  } else {
    estimated = userWeightKg * multiplier * 0.4;
  }

  // Round to 2.5kg increment
  const remainder = estimated % 2.5;
  const rounded = remainder < 1.25 ? estimated - remainder : estimated + (2.5 - remainder);
  return Math.max(2.5, rounded).toString();
}

function generatePersonalizedPlan(body: any) {
  const { gender, age, height, weight, goal, experience, workoutDays, equipment, duration } = body;
  const days = parseInt(workoutDays);
  const split = selectSplit(days, experience);
  const weightKg = parseFloat(weight);
  
  // Map user input to our database keys
  let normalizedEquipment = equipment.toLowerCase();
  if (normalizedEquipment === "gym" || normalizedEquipment === "full gym") normalizedEquipment = "fullGym";
  if (normalizedEquipment === "home gym" || normalizedEquipment === "homegym") normalizedEquipment = "homeGym";
  if (!EXERCISE_DATABASE[normalizedEquipment as keyof typeof EXERCISE_DATABASE]) {
    normalizedEquipment = "bodyweight"; // Fallback
  }
  
  let plan = `# Weekly Workout Plan (GymGen AI)

Goal: ${goal}
Experience: ${experience}
Equipment: ${equipment}
Workout Days/Week: ${workoutDays}
Duration per Workout: ${duration} min

`;

  // Generate each workout day
  for (let d = 1; d <= days; d++) {
    const dayPlan = getExercisesForSplit(split, d, normalizedEquipment, goal, experience);
    plan += `## Day ${d} - ${dayPlan.title}
Target Muscles: ${dayPlan.targetMuscles}

Exercises:
`;

    // Add exercises (adjust number based on duration)
    let numExercises;
    const durationMinutes = parseInt(duration);
    switch(durationMinutes) {
      case 30: numExercises = Math.min(4, dayPlan.exercises.length); break;
      case 45: numExercises = Math.min(6, dayPlan.exercises.length); break;
      case 60: numExercises = Math.min(8, dayPlan.exercises.length); break;
      default: numExercises = dayPlan.exercises.length;
    }

    for (let i = 0; i < numExercises; i++) {
      const ex = dayPlan.exercises[i];
      const srr = getSetsRepsRest(goal, experience, i);
      const w = estimateWeight(ex, weightKg, experience, goal, normalizedEquipment);
      plan += `${i+1}. ${ex}
Sets: ${srr.sets}
Reps: ${srr.reps}
Rest: ${srr.rest}
Weight: ${w}

`;
    }
  }

  // Warm Up
  plan += `## Warm Up
- 5-10 minutes light cardio (jumping jacks, jogging, rowing)
- Dynamic stretches (arm circles, leg swings, torso twists)
- Light 2 sets of the first exercise of the day to warm up muscles
- Foam rolling (if available)
`;

  // Cool Down
  plan += `## Cool Down
- Static stretches (30-60 seconds per stretch) for all worked muscles
- Deep breathing for 2 minutes to lower heart rate
- 5-minute slow walk
- Foam rolling (if available)
`;

  // Progression Tips
  let tips = "- Track every workout in a notebook or app to ensure consistent progress\n";
  if (goal === "Muscle Gain") tips += "- Focus on progressive overload by adding weight when you can complete the top of the rep range for all sets\n";
  if (goal === "Fat Loss") tips += "- Maintain a slight calorie deficit and prioritize protein intake to preserve muscle\n";
  if (goal === "Strength") tips += "- Prioritize compound lifts and give yourself enough rest between heavy sets\n";
  tips += "- Ensure 7-9 hours of sleep per night for optimal recovery and muscle growth\n";
  tips += "- Stay hydrated throughout the day and especially during workouts\n";
  tips += "- Every 8-12 weeks, take a deload week (reduce volume by 50%) to avoid overtraining\n";

  plan += `## Progression Tips
${tips}`;

  return plan;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("Workout Request:", JSON.stringify(body, null, 2));
    
    const plan = generatePersonalizedPlan(body);
    return NextResponse.json({ success: true, workout: plan });
  } catch (error) {
    console.error("Workout API Error:", error);
    return NextResponse.json({ success: false, error: "Failed to generate workout plan" }, { status: 500 });
  }
}
