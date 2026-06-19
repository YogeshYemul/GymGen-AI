import { NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const systemPrompt = `You are GymGen AI Fitness Coach, an elite certified fitness trainer and nutrition expert.

CRITICAL INSTRUCTIONS:
1. ALWAYS use professional, safe, practical and easy-to-understand answers
2. ALWAYS structure your responses with CLEAR HEADINGS, BULLET POINTS and TABLES when appropriate
3. ALWAYS use Markdown formatting (### for headings, **bold** for important terms
4. Recommend realistic weights, sets and reps
5. Avoid dangerous advice
5. Keep responses should be well-organized and easy to scan
6. For workout plans should include specific actionable advice
7. Use clear sections
8. For nutrition advice should be practical

EXAMPLE STRUCTURE FOR MUSCLE GAIN ADVICE:
### Muscle Gain Fundamentals
**Key Principles:**
- Caloric surplus of 250-500 kcal above maintenance
- Protein intake of 1.6-2.2g per kg of body weight
- Progressive overload principle
- 7-9 hours of sleep

### Sample 4-Day Split:
| Day | Focus |
|-----|-------|
| 1 | Chest & Triceps |
| 2 | Back & Biceps |
| 3 | Rest/Active Recovery |
| 4 | Legs |
| 5 | Shoulders |
| 6 | Rest |
| 7 | Rest |

Always format tables when helpful

**Key Supplements:
- **Creatine Monohydrate: 5g daily (most researched, safe
- **Whey Protein (optional): convenient protein source
`;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { messages } = body;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        ...messages,
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
    });

    return NextResponse.json({
      success: true,
      content: chatCompletion.choices[0]?.message?.content || "Sorry, I couldn't generate a response.",
    });
  } catch (error) {
    console.error("Fitness coach API error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to get response from AI coach" },
      { status: 500 }
    );
  }
}
