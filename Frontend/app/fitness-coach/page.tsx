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
      router.push(`/fitness-coach/chat?q=${encodeURIComponent(question)}`);
    } else {
      router.push("/fitness-coach/chat");
    }
  };

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[300px] h-[300px] md:w-[500px] md:h-[500px] rounded-full bg-primary-400/10 blur-[100px] md:blur-[140px]" />
      </div>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 py-12 md:py-16 lg:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-1.5 md:gap-2 bg-primary-400/10 border border-primary-400/20 rounded-full px-3 md:px-4 py-1.5 md:py-2 mb-4 md:mb-6">
            <Dumbbell size={14} className="md:w-[16px] md:h-[16px] text-primary-400" />
            <span className="text-[10px] md:text-xs tracking-wider uppercase">AI Fitness Coach</span>
          </div>
          
          <h1 className="text-2xl md:text-4xl lg:text-6xl font-black mb-3 md:mb-4">
            24/7 Personal Trainer
            <span className="text-primary-400 block">Powered by AI</span>
          </h1>
          
          <p className="text-white/60 max-w-2xl mx-auto mb-6 md:mb-8 text-xs md:text-sm lg:text-base">
            Ask anything about workouts, nutrition, muscle building, fat loss and recovery.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
            <button
              onClick={() => handleStartChat()}
              className="bg-primary-400 text-black px-6 md:px-8 py-2.5 md:py-3 rounded-xl font-bold flex items-center justify-center gap-1.5 md:gap-2 hover:bg-primary-300 transition text-xs md:text-sm lg:text-base"
            >
              Start Chat <ArrowRight size={16} className="md:w-[18px] md:h-[18px]" />
            </button>
            <button className="border border-white/10 px-6 md:px-8 py-2.5 md:py-3 rounded-xl font-semibold hover:border-white/20 transition text-xs md:text-sm lg:text-base">
              Learn More
            </button>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="max-w-6xl mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className="bg-white/[0.02] border border-primary-400/20 rounded-2xl p-4 md:p-5 lg:p-6 hover:border-primary-400/40 hover:bg-primary-400/5 transition-all group"
            >
              <div className="w-10 h-10 md:w-12 md:h-12 bg-primary-400/10 rounded-xl flex items-center justify-center mb-3 md:mb-4 group-hover:bg-primary-400/20 transition">
                <feature.icon size={20} className="md:w-[24px] md:h-[24px] text-primary-400" />
              </div>
              <h3 className="text-sm md:text-base lg:text-lg font-bold mb-1.5 md:mb-2">{feature.title}</h3>
              <p className="text-white/50 text-[11px] md:text-xs lg:text-sm">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Sample Questions Section */}
      <section className="max-w-4xl mx-auto px-4 py-12 md:py-16">
        <div className="text-center mb-6 md:mb-8">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-2 md:mb-3">Try these questions</h2>
          <p className="text-white/60 text-xs md:text-sm lg:text-base">Click any question to start a chat</p>
        </div>
        
        <div className="flex flex-wrap justify-center gap-2 md:gap-3">
          {sampleQuestions.map((question, index) => (
            <motion.button
              key={question}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              onClick={() => handleStartChat(question)}
              className="bg-white/[0.02] border border-white/10 rounded-full px-3 md:px-5 py-1.5 md:py-2.5 text-[11px] md:text-sm hover:border-primary-400/40 hover:bg-primary-400/5 transition-all"
            >
              {question}
            </motion.button>
          ))}
        </div>
      </section>
    </main>
  );
}
