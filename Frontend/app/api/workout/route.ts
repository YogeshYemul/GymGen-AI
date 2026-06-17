import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("Workout Request:", JSON.stringify(body, null, 2));
    const daysRequested = parseInt(body.workoutDays);
    console.log("Days Requested:", daysRequested);

    // Generate fallback workout plan (works without API key, reliable for production fallback)
    const generateFallbackPlan = (days: number) => {
      let plan = `# Weekly Workout Plan (GymGen AI)

## Day 1 - Upper Body Push
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

3. Incline Dumbbell Press
Sets: 3
Reps: 10-12
Rest: 60s

4. Tricep Dips
Sets: 3
Reps: 12-15
Rest: 45s

## Day 2 - Lower Body
Target Muscles: Quads, Glutes, Hamstrings, Calves

Exercises:
1. Back Squats
Sets: 4
Reps: 8-10
Rest: 90s

2. Romanian Deadlifts
Sets: 3
Reps: 10-12
Rest: 60s

3. Walking Lunges
Sets: 3
Reps: 10 per leg
Rest: 60s

4. Leg Curls
Sets: 3
Reps: 12-15
Rest: 45s

5. Calf Raises
Sets: 4
Reps: 15-20
Rest: 30s

${days > 3 ? `## Day 3 - Upper Body Pull
Target Muscles: Back, Biceps, Rear Delts

Exercises:
1. Pull-ups / Lat Pulldown
Sets: 4
Reps: 8-10
Rest: 90s

2. Bent Over Barbell Rows
Sets: 3
Reps: 10-12
Rest: 60s

3. Face Pulls
Sets: 3
Reps: 15-20
Rest: 45s

4. Dumbbell Bicep Curls
Sets: 3
Reps: 12-15
Rest: 45s

5. Hammer Curls
Sets: 3
Reps: 12-15
Rest: 45s
` : `## Day 3 - Active Recovery`}

${days > 4 ? `## Day 4 - Full Body Strength
Target Muscles: Full Body

Exercises:
1. Deadlifts
Sets: 4
Reps: 6-8
Rest: 2-3min

2. Push-ups (weighted if possible)
Sets: 3
Reps: 12-15
Rest: 60s

3. Kettlebell Swings
Sets: 3
Reps: 15-20
Rest: 60s

4. Plank
Sets: 3
Reps: 60s hold
Rest: 30s
` : ""}

${days > 5 ? `## Day 5 - Upper Body Hypertrophy
Target Muscles: Chest, Back, Shoulders, Arms

Exercises:
1. Incline Bench Press
Sets: 4
Reps: 10-12
Rest: 75s

2. Pull-ups (wide grip)
Sets: 4
Reps: 8-12
Rest: 75s

3. Lateral Raises
Sets: 3
Reps: 15-20
Rest: 45s

4. Tricep Pushdowns
Sets: 3
Reps: 12-15
Rest: 45s

5. Preacher Curls
Sets: 3
Reps: 12-15
Rest: 45s
` : ""}

${days > 5 ? `## Day 6 - Lower Body Hypertrophy
Target Muscles: Glutes, Quads, Hamstrings, Calves

Exercises:
1. Front Squats
Sets: 4
Reps: 10-12
Rest: 90s

2. Romanian Deadlifts (heavy)
Sets: 4
Reps: 8-10
Rest: 90s

3. Hip Thrusts
Sets: 4
Reps: 12-15
Rest: 60s

4. Standing Calf Raises
Sets: 4
Reps: 20-25
Rest: 30s
` : ""}

## Warm Up
- 5-10 minutes of light cardio (jogging, jumping jacks, rowing)
- Dynamic stretching (arm circles, leg swings, torso twists)
- Light 2 sets of the first exercise to warm up the joints and muscles
- Foam rolling if available

## Cool Down
- Static stretching (30-60 seconds per stretch) for all worked muscles
- Deep breathing for 2 minutes to lower heart rate
- 5-minute slow walk
- Foam rolling (if available)

## Progression Tips
- Add 2.5kg to compound lifts (squat, deadlift, bench, rows) when you can complete the top of the rep range for all sets
- Track every workout in a notebook or app to ensure consistent progress
- Prioritize perfect form over heavy weight - quality reps > heavy weight
- Ensure 7-9 hours of sleep per night for optimal recovery and muscle growth
- Stay consistent with your nutrition - hit your protein and calorie targets
- Every 8-12 weeks, take a deload week (reduce volume by 50%) to avoid overtraining
`;
      return plan;
    };

    // Fallback for testing without API key
    if (!process.env.GROQ_API_KEY) {
      console.log("Using fallback workout plan (no GROQ_API_KEY)");
      return NextResponse.json({
        success: true,
        workout: generateFallbackPlan(daysRequested),
      });
    }

    const prompt = `CRITICAL: YOU MUST GENERATE A FULL RESPONSE WITHOUT ANY TRUNCATION. YOU MUST NOT STOP EARLY. YOU MUST COMPLETE EVERYTHING.

You are an elite certified fitness coach and exercise physiologist. Your task is to generate a comprehensive weekly workout plan for this user.

ABSOLUTELY CRITICAL REQUIREMENTS (YOU WILL BE PENALIZED IF YOU FAIL THESE):
1. YOU MUST GENERATE EXACTLY ${daysRequested} WORKOUT DAYS: Day 1, Day 2, ..., Day ${daysRequested}
2. YOU MUST NOT SKIP ANY DAYS
3. YOU MUST NOT SUMMARIZE OR CUT SHORT ANY DAYS
4. YOU MUST INCLUDE FULL EXERCISES, SETS, REPS, AND REST FOR EVERY SINGLE DAY
5. YOU MUST INCLUDE A DETAILED WARM UP SECTION AT THE END
6. YOU MUST INCLUDE A DETAILED COOL DOWN SECTION AT THE END
7. YOU MUST INCLUDE 6-8 DETAILED PROGRESSION TIPS AT THE END
8. YOUR ENTIRE RESPONSE MUST BE IN MARKDOWN FORMAT AS SPECIFIED BELOW
9. DO NOT STOP TYPING UNTIL YOU HAVE COMPLETED EVERY SINGLE SECTION

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

DETAILED INSTRUCTIONS:
- Create a professional weekly workout split tailored perfectly to their goals, experience, and available equipment
- For each day, specify a clear day name and target muscle groups
- For every exercise, specify exact sets, reps, and rest periods
- Include a detailed warm-up section (5-10 minutes of cardio, dynamic stretches, etc.)
- Include a detailed cool-down section (static stretches, recovery tips, etc.)
- Include 6-8 detailed progression tips that are specific to their goals and experience
- Do NOT use any placeholders like [Day Name] - fill in everything
- Keep workouts realistic, safe, and effective

STRICT OUTPUT FORMAT (DO NOT DEVIATE):
# Weekly Workout Plan

## Day 1 - [Descriptive Day Name]
Target Muscles: [Comma-separated muscle groups]

Exercises:
1. [First Exercise Name]
Sets: X
Reps: Y-Z
Rest: 90s

2. [Second Exercise Name]
Sets: X
Reps: Y-Z
Rest: 60s

(Continue with all exercises for Day 1)

## Day 2 - [Descriptive Day Name]
Target Muscles: [Comma-separated muscle groups]

Exercises:
1. [First Exercise Name]
Sets: X
Reps: Y-Z
Rest: 90s

(REPEAT THIS FULL STRUCTURE FOR DAY 1 THROUGH DAY ${daysRequested} - DO NOT SKIP ANY DAYS)

## Warm Up
- [Warm up instruction 1]
- [Warm up instruction 2]
- [Warm up instruction 3]
- [Warm up instruction 4]
- [Warm up instruction 5]

## Cool Down
- [Cool down instruction 1]
- [Cool down instruction 2]
- [Cool down instruction 3]
- [Cool down instruction 4]

## Progression Tips
- [Progression tip 1 - specific to user's goals]
- [Progression tip 2 - specific to user's experience]
- [Progression tip 3 - about recovery]
- [Progression tip 4 - about form]
- [Progression tip 5 - about tracking]
- [Progression tip 6 - about nutrition]

AGAIN: YOU MUST COMPLETE EVERYTHING FROM DAY 1 TO DAY ${daysRequested} AND INCLUDE ALL SECTIONS. DO NOT TRUNCATE YOUR RESPONSE.`;

    console.log("Sending request to Groq with prompt length:", prompt.length);

    // Try to use Groq API, fall back to built-in plan if anything fails
    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          temperature: 0.65,
          max_tokens: 12000,
          top_p: 0.9,
          messages: [
            {
              role: "system",
              content: "You are an elite professional fitness trainer. You always generate complete, detailed workout plans without any truncation.",
            },
            { role: "user", content: prompt },
          ],
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const workout = data?.choices?.[0]?.message?.content;

        if (workout && workout.length > 1000) {
          console.log("Successfully generated workout via Groq, Length:", workout.length);
          console.log("Groq Raw Response:", JSON.stringify(data, null, 2));

          // Verify the response has all required sections
          const hasAllDays = Array.from({ length: daysRequested }, (_, i) => {
            const dayNumber = i + 1;
            return workout.toLowerCase().includes(`day ${dayNumber}`) ||
                   workout.toLowerCase().includes(`## day ${dayNumber}`) ||
                   workout.toLowerCase().includes(`### day ${dayNumber}`);
          }).every(Boolean);
          const hasWarmUp = workout.toLowerCase().includes("warm up");
          const hasCoolDown = workout.toLowerCase().includes("cool down");
          const hasTips = workout.toLowerCase().includes("progression tips") || workout.toLowerCase().includes("tips");

          if (hasAllDays && hasWarmUp && hasCoolDown && hasTips) {
            return NextResponse.json({ success: true, workout });
          } else {
            console.log("Groq response missing sections, using fallback plan");
            return NextResponse.json({
              success: true,
              workout: generateFallbackPlan(daysRequested),
            });
          }
        }
      } else {
        console.log("Groq API failed, using fallback plan");
      }
    } catch (apiError) {
      console.error("Groq API request failed, using fallback plan:", apiError);
    }

    // Fallback to built-in plan
    console.log("Using fallback workout plan (API failed or bad response)");
    return NextResponse.json({
      success: true,
      workout: generateFallbackPlan(daysRequested),
    });
  } catch (error) {
    console.error("Workout API Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to generate workout plan" },
      { status: 500 }
    );
  }
}
