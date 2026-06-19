"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Dumbbell,
  Utensils,
  Activity,
  Zap,
  Target,
  TrendingUp,
  Clock,
  Heart,
  ArrowRight,
} from "lucide-react";

export default function AIFitnessCoachPage() {
  const router = useRouter();

  const features = [
    { icon: Dumbbell, title: "Workout Guidance", description: "Personalized workout plans tailored to your goals" },
    { icon: Utensils, title: "Nutrition Advice", description: "Expert nutrition recommendations for optimal results" },
    { icon: Activity, title: "Exercise Form", description: "Learn proper form to maximize gains and prevent injuries" },
    { icon: Zap, title: "Supplement Suggestions", description: "Evidence-based supplement recommendations" },
    { icon: Heart, title: "Recovery & Sleep", description: "Optimize your recovery for better performance" },
    { icon: TrendingUp, title: "Progressive Overload", description: "Strategies to continuously challenge your body" },
    { icon: Target, title: "Goal Tracking", description: "Set and track your fitness milestones" },
    { icon: Clock, title: "24/7 Assistance", description: "Get answers anytime, anywhere" },
  ];

  const sampleQuestions = [
    "How much protein should I eat?",
    "Can I train chest twice a week?",
    "Best workout for muscle gain?",
    "How much weight should I lift?",
    "Push Pull Legs vs Upper Lower?",
    "How many calories should I eat?",
  ];

  const handleStartChat = (question?: string) => {
    if (question) {
      router.push(`/ai-fitness-coach/chat?q=${encodeURIComponent(question)}`);
    } else {
      router.push("/ai-fitness-coach/chat");
    }
  };

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-primary-400/10 blur-[140px]" />
      </div>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 py-16 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-2 bg-primary-400/10 border border-primary-400/20 rounded-full px-4 py-2 mb-6">
            <Dumbbell size={16} className="text-primary-400" />
            <span className="text-xs tracking-wider uppercase">AI Fitness Coach</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black mb-4">
            24/7 Personal Trainer
            <span className="text-primary-400 block">Powered by AI</span>
          </h1>
          
          <p className="text-white/60 max-w-2xl mx-auto mb-8 text-sm md:text-base">
            Ask anything about workouts, nutrition, muscle building, fat loss and recovery.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => handleStartChat()}
              className="bg-primary-400 text-black px-8 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-primary-300 transition text-sm md:text-base"
            >
              Start Chat <ArrowRight size={18} />
            </button>
            <button className="border border-white/10 px-8 py-3 rounded-xl font-semibold hover:border-white/20 transition text-sm md:text-base">
              Learn More
            </button>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className="bg-white/[0.02] border border-primary-400/20 rounded-2xl p-5 md:p-6 hover:border-primary-400/40 hover:bg-primary-400/5 transition-all group"
            >
              <div className="w-12 h-12 bg-primary-400/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary-400/20 transition">
                <feature.icon size={24} className="text-primary-400" />
              </div>
              <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
              <p className="text-white/50 text-sm">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Sample Questions Section */}
      <section className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">Try these questions</h2>
          <p className="text-white/60 text-sm md:text-base">Click any question to start a chat</p>
        </div>
        
        <div className="flex flex-wrap justify-center gap-3">
          {sampleQuestions.map((question, index) => (
            <motion.button
              key={question}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              onClick={() => handleStartChat(question)}
              className="bg-white/[0.02] border border-white/10 rounded-full px-5 py-2.5 text-sm hover:border-primary-400/40 hover:bg-primary-400/5 transition-all"
            >
              {question}
            </motion.button>
          ))}
        </div>
      </section>
    </main>
  );
}
