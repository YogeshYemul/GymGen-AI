import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("Workout Request:", body);

    // Fallback for testing without API key
    if (!process.env.GROQ_API_KEY) {
      console.log("Using fallback workout plan (no GROQ_API_KEY)");
      const fallbackWorkout = `
# Weekly Workout Plan (Fallback)

## Day 1 - Upper Body
Target Muscles: Chest, Shoulders, Triceps

Exercises:
1. Bench Press
Sets: 4
Reps: 8-10
Rest: 90s

2. Overhead Press
Sets: 3
Reps: 10-12
Rest: 60s

3. Tricep Dips
Sets: 3
Reps: 12-15
Rest: 45s

## Day 2 - Lower Body
Target Muscles: Quads, Glutes, Hamstrings

Exercises:
1. Squats
Sets: 4
Reps: 8-10
Rest: 90s

2. Romanian Deadlifts
Sets: 3
Reps: 10-12
Rest: 60s

3. Calf Raises
Sets: 3
Reps: 15-20
Rest: 30s

## Day 3 - Rest / Active Recovery

## Day 4 - Full Body
Target Muscles: Full Body

Exercises:
1. Deadlifts
Sets: 4
Reps: 6-8
Rest: 2-3min

2. Pull-ups / Lat Pulldown
Sets: 3
Reps: 8-10
Rest: 60s

3. Push-ups
Sets: 3
Reps: 12-15
Rest: 45s

## Warm Up
- 5-10 min light cardio
- Dynamic stretches
- Light sets of first exercise

## Cool Down
- Static stretches
- 5 min walk
- Foam rolling

## Progression Tips
- Add 2.5kg to lifts when you hit top rep range
- Focus on form over weight
- Track your workouts
      `;
      return NextResponse.json({
        success: true,
        workout: fallbackWorkout,
      });
    }

    const prompt = `
You are an elite certified fitness coach. Generate a complete professional weekly workout plan.

USER DETAILS:
Gender: ${body.gender}
Age: ${body.age}
Height: ${body.height} cm
Weight: ${body.weight} kg
Goal: ${body.goal}
Experience Level: ${body.experience}
Workout Days Per Week: ${body.workoutDays}
Available Equipment: ${body.equipment}
Workout Duration: ${body.duration} minutes

INSTRUCTIONS:
- Create a weekly workout split.
- Mention workout day names.
- Mention target muscles.
- Mention exercises.
- Mention sets and reps.
- Mention rest time.
- Include warm-up.
- Include cool-down.
- Include progression tips.
- Use markdown formatting.
- Keep workouts realistic and practical.

OUTPUT FORMAT:
# Weekly Workout Plan

## Day 1
Target Muscles:

Exercises:
1. Exercise Name
Sets: X
Reps: Y-Z
Rest: 90s

Continue for all workout days.

## Warm Up
## Cool Down
## Progression Tips
`;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        temperature: 0.7,
        max_tokens: 3000,
        messages: [
          {
            role: "system",
            content: "You are a professional fitness trainer and workout planner.",
          },
          { role: "user", content: prompt },
        ],
      }),
    });

    const data = await response.json();
    console.log("Groq Response:", JSON.stringify(data, null, 2));

    if (!response.ok) {
      return NextResponse.json({ success: false, error: data }, { status: response.status });
    }

    const workout = data?.choices?.[0]?.message?.content ?? "Workout plan could not be generated.";
    return NextResponse.json({ success: true, workout });
  } catch (error) {
    console.error("Workout API Error:", error);
    return NextResponse.json({ success: false, error: "Failed to generate workout plan" }, { status: 500 });
  }
}
