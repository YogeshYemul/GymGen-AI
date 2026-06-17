import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("Workout Request:", JSON.stringify(body, null, 2));
    const daysRequested = parseInt(body.workoutDays);
    console.log("Days Requested:", daysRequested);

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

${daysRequested > 3 ? `## Day 3 - Upper Body 2
Target Muscles: Back, Biceps

Exercises:
1. Pull-ups / Lat Pulldown
Sets: 4
Reps: 8-10
Rest: 90s

2. Bent Over Rows
Sets: 3
Reps: 10-12
Rest: 60s

3. Bicep Curls
Sets: 3
Reps: 12-15
Rest: 45s
` : `## Day 3 - Rest / Active Recovery`}

${daysRequested > 4 ? `## Day 4 - Lower Body 2
Target Muscles: Glutes, Hamstrings, Quads

Exercises:
1. Deadlifts
Sets: 4
Reps: 6-8
Rest: 2-3min

2. Lunges
Sets: 3
Reps: 10 per leg
Rest: 60s

3. Leg Curls
Sets: 3
Reps: 12-15
Rest: 45s
` : ""}

${daysRequested > 5 ? `## Day 5 - Full Body
Target Muscles: Full Body

Exercises:
1. Kettlebell Swings
Sets: 4
Reps: 15-20
Rest: 60s

2. Push-ups
Sets: 3
Reps: 12-15
Rest: 45s

3. Plank
Sets: 3
Reps: 60s hold
Rest: 30s
` : ""}

${daysRequested > 6 ? `## Day 6 - Active Recovery
Target Muscles: Full Body (Light)

Exercises:
1. Walking / Jogging
Sets: 1
Reps: 30min
Rest: None

2. Yoga / Stretching
Sets: 1
Reps: 20min
Rest: None
` : ""}

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

    const prompt = `You are an elite certified fitness coach. Generate a complete professional weekly workout plan with ABSOLUTELY NO TRUNCATION.

CRITICAL REQUIREMENTS:
1. Generate EXACTLY ${daysRequested} workout days: Day 1 through Day ${daysRequested}
2. Do NOT skip any days
3. Do NOT summarize or cut short any day
4. Include FULL exercises, sets, reps, and rest for EVERY day
5. ALWAYS include Warm Up, Cool Down, and Progression Tips at the end
6. Use the EXACT markdown format specified below

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
- Create a weekly workout split tailored to their goals
- For each day, mention the day name and target muscles
- For each exercise, list sets, reps, and rest time
- Include warm-up, cool-down, and progression tips
- Use markdown formatting
- Keep workouts realistic and practical for their equipment
- Do NOT stop early or omit any sections

OUTPUT FORMAT (STRICTLY FOLLOW THIS):
# Weekly Workout Plan

## Day 1 - [Day Name]
Target Muscles: [Muscles]

Exercises:
1. [Exercise 1 Name]
Sets: X
Reps: Y-Z
Rest: 90s

2. [Exercise 2 Name]
Sets: X
Reps: Y-Z
Rest: 60s

(Continue with all exercises for Day 1)

## Day 2 - [Day Name]
Target Muscles: [Muscles]

Exercises:
1. [Exercise 1 Name]
Sets: X
Reps: Y-Z
Rest: 90s

(Repeat this structure for ALL ${daysRequested} days)

## Warm Up
- [Warm up instructions]

## Cool Down
- [Cool down instructions]

## Progression Tips
- [Progression tip 1]
- [Progression tip 2]
- [Progression tip 3]

IMPORTANT: Ensure Day 1 through Day ${daysRequested} are ALL present in your response.`;

    console.log("Sending request to Groq with prompt length:", prompt.length);

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        temperature: 0.7,
        max_tokens: 8000,
        messages: [
          {
            role: "system",
            content: "You are a professional fitness trainer and workout planner who always completes the full response without any truncation.",
          },
          { role: "user", content: prompt },
        ],
      }),
    });

    const data = await response.json();
    console.log("Raw Groq Response:", JSON.stringify(data, null, 2));

    if (!response.ok) {
      console.error("Groq API Error:", response.status, response.statusText);
      return NextResponse.json({ success: false, error: data }, { status: response.status });
    }

    const workout = data?.choices?.[0]?.message?.content ?? "Workout plan could not be generated.";
    console.log("Workout Generated Successfully, Length:", workout.length);

    return NextResponse.json({ success: true, workout });
  } catch (error) {
    console.error("Workout API Error:", error);
    return NextResponse.json({ success: false, error: "Failed to generate workout plan" }, { status: 500 });
  }
}
