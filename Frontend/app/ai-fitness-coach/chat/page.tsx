"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import toast from "react-hot-toast";
import {
  Send,
  Plus,
  ArrowLeft,
  Copy,
  RefreshCw,
  Trash2,
  Dumbbell,
} from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const suggestedQuestions = [
  "Muscle Gain",
  "Fat Loss",
  "Supplements",
  "Protein Intake",
  "Progressive Overload",
  "Workout Splits",
  "Calories",
  "Recovery",
  "Cardio",
  "Creatine",
];

export default function AIFitnessCoachChatPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuestion = searchParams.get("q");
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    if (initialQuestion) {
      sendMessage(initialQuestion);
    }
  }, []);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isTyping) return;

    const userMessage: Message = { role: "user", content: text };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setIsTyping(true);

    try {
      const response = await fetch("/api/fitness-coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error);
      }

      setMessages([
        ...newMessages,
        { role: "assistant", content: data.content },
      ]);
    } catch (error) {
      console.error("Chat error:", error);
      toast.error("Failed to get response from AI coach");
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
    toast.success("Copied to clipboard");
  };

  const regenerateLastMessage = async () => {
    if (messages.length < 2 || isTyping) return;
    
    const lastUserMessage = messages.slice(0, -1).filter(m => m.role === "user").pop();
    if (!lastUserMessage) return;

    const messagesWithoutLastResponse = messages.slice(0, -1);
    setMessages(messagesWithoutLastResponse);
    setIsTyping(true);

    try {
      const response = await fetch("/api/fitness-coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: messagesWithoutLastResponse.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error);
      }

      setMessages([
        ...messagesWithoutLastResponse,
        { role: "assistant", content: data.content },
      ]);
    } catch (error) {
      console.error("Chat error:", error);
      toast.error("Failed to regenerate response");
    } finally {
      setIsTyping(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
    toast.success("Chat cleared");
  };

  return (
    <main className="min-h-screen bg-black text-white flex flex-col">
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-primary-400/10 blur-[140px]" />
      </div>

      {/* Header */}
      <header className="border-b border-white/5 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => router.push("/ai-fitness-coach")}
            className="flex items-center gap-2 text-white/70 hover:text-primary-400 transition text-sm"
          >
            <ArrowLeft size={18} />
            Back
          </button>
          <div className="flex items-center gap-2">
            <Dumbbell size={20} className="text-primary-400" />
            <span className="font-bold text-lg">GymGen AI Coach</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={clearChat}
              className="p-2 text-white/60 hover:text-white hover:bg-white/5 rounded-lg transition"
              title="Clear chat"
            >
              <Trash2 size={18} />
            </button>
            <button
              onClick={() => setMessages([])}
              className="flex items-center gap-1.5 bg-primary-400/10 border border-primary-400/20 px-3 py-1.5 rounded-lg text-sm hover:bg-primary-400/20 transition"
            >
              <Plus size={16} />
              <span className="hidden sm:inline">New Chat</span>
            </button>
          </div>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <AnimatePresence>
            {messages.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-16"
              >
                <div className="w-20 h-20 bg-primary-400/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Dumbbell size={40} className="text-primary-400" />
                </div>
                <h2 className="text-2xl font-bold mb-2">How can I help you today?</h2>
                <p className="text-white/60 mb-8 max-w-md mx-auto text-sm">
                  Ask me anything about fitness, nutrition, workouts, or recovery.
                </p>
                
                <div className="flex flex-wrap justify-center gap-3">
                  {suggestedQuestions.map((q) => (
                    <button
                      key={q}
                      onClick={() => sendMessage(q)}
                      className="bg-white/[0.02] border border-white/10 rounded-full px-4 py-2 text-sm hover:border-primary-400/40 hover:bg-primary-400/5 transition-all"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {messages.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-4 mb-6 ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {message.role === "assistant" && (
                  <div className="w-10 h-10 bg-primary-400/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Dumbbell size={20} className="text-primary-400" />
                  </div>
                )}
                
                <div
                  className={`max-w-[85%] sm:max-w-[75%] ${
                    message.role === "user"
                      ? "bg-primary-400 text-black rounded-2xl rounded-br-md"
                      : "bg-white/[0.02] border border-white/10 rounded-2xl rounded-bl-md"
                  } p-4 md:p-5`}
                >
                  <div
                    className={`prose prose-sm max-w-none ${
                      message.role === "user"
                        ? "prose-invert text-black"
                        : "text-white"
                    }`}
                  >
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {message.content}
                    </ReactMarkdown>
                  </div>
                  
                  {message.role === "assistant" && (
                    <div className="flex items-center gap-2 mt-4 pt-3 border-t border-white/10">
                      <button
                        onClick={() => copyMessage(message.content)}
                        className="flex items-center gap-1 text-xs text-white/50 hover:text-white/80 transition"
                      >
                        <Copy size={14} />
                        Copy
                      </button>
                      <button
                        onClick={regenerateLastMessage}
                        disabled={isTyping}
                        className="flex items-center gap-1 text-xs text-white/50 hover:text-white/80 transition disabled:opacity-30"
                      >
                        <RefreshCw size={14} />
                        Regenerate
                      </button>
                    </div>
                  )}
                </div>

                {message.role === "user" && (
                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold">You</span>
                  </div>
                )}
              </motion.div>
            ))}

            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-4 mb-6"
              >
                <div className="w-10 h-10 bg-primary-400/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Dumbbell size={20} className="text-primary-400" />
                </div>
                <div className="bg-white/[0.02] border border-white/10 rounded-2xl rounded-bl-md p-4">
                  <div className="flex gap-1.5">
                    <motion.div
                      animate={{ y: [0, -8, 0] }}
                      transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                      className="w-2 h-2 bg-primary-400 rounded-full"
                    />
                    <motion.div
                      animate={{ y: [0, -8, 0] }}
                      transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                      className="w-2 h-2 bg-primary-400 rounded-full"
                    />
                    <motion.div
                      animate={{ y: [0, -8, 0] }}
                      transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                      className="w-2 h-2 bg-primary-400 rounded-full"
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="border-t border-white/5 backdrop-blur-xl sticky bottom-0">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex gap-3">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask your fitness question..."
              className="flex-1 bg-white/[0.02] border border-white/10 text-white placeholder-white/30 rounded-xl px-4 py-3 resize-none focus:outline-none focus:border-primary-400/40 transition text-sm md:text-base"
              rows={1}
              style={{ maxHeight: "200px" }}
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || isTyping}
              className="bg-primary-400 text-black px-4 py-3 rounded-xl font-bold hover:bg-primary-300 transition disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
            >
              <Send size={20} />
            </button>
          </div>
          <p className="text-xs text-white/30 text-center mt-2">
            Press Enter to send, Shift+Enter for new line
          </p>
        </div>
      </div>
    </main>
  );
}
