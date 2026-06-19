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
  User,
} from "lucide-react";

export const dynamic = "force-dynamic";

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

const MarkdownComponents = {
  h1: ({ children, ...props }: any) => (
    <h1 {...props} className="text-lg md:text-2xl font-bold text-white mb-3 mt-5 first:mt-0">
      {children}
    </h1>
  ),
  h2: ({ children, ...props }: any) => (
    <h2 {...props} className="text-base md:text-xl font-bold text-white mb-2.5 mt-4">
      {children}
    </h2>
  ),
  h3: ({ children, ...props }: any) => (
    <h3 {...props} className="text-sm md:text-lg font-semibold text-white mb-2 mt-3">
      {children}
    </h3>
  ),
  p: ({ children, ...props }: any) => (
    <p {...props} className="text-xs md:text-sm text-gray-200 mb-2.5 leading-relaxed">
      {children}
    </p>
  ),
  ul: ({ children, ...props }: any) => (
    <ul {...props} className="list-disc list-outside ml-5 md:ml-6 space-y-1 mb-2.5 text-xs md:text-sm text-gray-200">
      {children}
    </ul>
  ),
  ol: ({ children, ...props }: any) => (
    <ol {...props} className="list-decimal list-outside ml-5 md:ml-6 space-y-1 mb-2.5 text-xs md:text-sm text-gray-200">
      {children}
    </ol>
  ),
  li: ({ children, ...props }: any) => (
    <li {...props} className="leading-relaxed pl-1">{children}</li>
  ),
  strong: ({ children, ...props }: any) => (
    <strong {...props} className="font-semibold text-primary-400">{children}</strong>
  ),
  table: ({ children, ...props }: any) => (
    <div {...props} className="overflow-x-auto w-full mb-3 -mx-3 md:mx-0">
      <div className="inline-block min-w-full align-middle">
        <table className="min-w-full border-collapse">{children}</table>
      </div>
    </div>
  ),
  thead: ({ children, ...props }: any) => (
    <thead {...props} className="bg-primary-400/10">{children}</thead>
  ),
  tbody: ({ children, ...props }: any) => (
    <tbody {...props} className="divide-y divide-white/10">{children}</tbody>
  ),
  tr: ({ children, ...props }: any) => <tr {...props}>{children}</tr>,
  th: ({ children, ...props }: any) => (
    <th {...props} className="px-3 py-2 text-left font-semibold text-primary-400 text-xs whitespace-nowrap">
      {children}
    </th>
  ),
  td: ({ children, ...props }: any) => (
    <td {...props} className="px-3 py-2 text-xs text-gray-200 whitespace-nowrap">
      {children}
    </td>
  ),
  blockquote: ({ children, ...props }: any) => (
    <blockquote {...props} className="border-l-2 border-primary-400/50 pl-3 py-1.5 my-2.5 bg-white/[0.02] rounded-r-lg text-xs md:text-sm text-gray-300 italic">
      {children}
    </blockquote>
  ),
  code: ({ className, children, ...props }: any) => {
    const match = /language-(\w+)/.exec(className || "");
    return (
      <code
        {...props}
        className={`${
          className || ""
        } ${!match ? "bg-primary-400/10 px-1 py-0.5 rounded text-[11px] md:text-xs text-primary-300" : ""}`}
      >
        {children}
      </code>
    );
  },
  pre: ({ children, ...props }: any) => (
    <pre {...props} className="bg-white/[0.02] p-3 rounded-lg my-2.5 overflow-x-auto text-[11px] md:text-xs w-full">
      {children}
    </pre>
  ),
};

export default function AIFitnessCoachChatPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuestion = searchParams.get("q");

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

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
  }, [initialQuestion]);

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

    const lastUserMessage = messages
      .slice(0, -1)
      .filter((m) => m.role === "user")
      .pop();
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
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Background Glow */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[400px] h-[400px] rounded-full bg-primary-400/10 blur-[150px]" />
      </div>

      {/* Header */}
      <header className="border-b border-white/10 backdrop-blur-xl sticky top-0 z-50 bg-black/60">
        <div className="max-w-3xl mx-auto px-3 sm:px-6 py-2.5 flex items-center justify-between">
          <button
            onClick={() => router.push("/ai-fitness-coach")}
            className="flex items-center gap-1.5 text-white/70 hover:text-white transition"
          >
            <ArrowLeft size={18} />
            <span className="text-xs font-medium hidden sm:inline">Back</span>
          </button>
          <div className="flex items-center gap-1.5">
            <div className="w-7 h-7 bg-primary-400/10 rounded-lg flex items-center justify-center">
              <Dumbbell size={14} className="text-primary-400" />
            </div>
            <h1 className="font-bold text-sm">GymGen AI Coach</h1>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={clearChat}
              className="p-1.5 text-white/50 hover:text-white hover:bg-white/5 rounded-lg transition"
              title="Clear chat"
            >
              <Trash2 size={16} />
            </button>
            <button
              onClick={() => setMessages([])}
              className="flex items-center gap-1 bg-white/5 border border-white/10 px-2.5 py-1.5 rounded-lg text-xs hover:bg-white/10 transition"
            >
              <Plus size={14} />
              <span className="hidden sm:inline">New</span>
            </button>
          </div>
        </div>
      </header>

      {/* Messages Container */}
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto overflow-x-hidden"
      >
        <div className="max-w-3xl mx-auto px-3 sm:px-6">
          <AnimatePresence initial={false}>
            {messages.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col items-center justify-center min-h-[calc(100vh-160px)] py-10"
              >
                <div className="w-16 h-16 bg-primary-400/10 rounded-2xl flex items-center justify-center mb-5">
                  <Dumbbell size={32} className="text-primary-400" />
                </div>
                <h2 className="text-lg md:text-2xl font-bold mb-2 text-center">
                  How can I help you today?
                </h2>
                <p className="text-xs md:text-sm text-white/60 mb-6 max-w-md text-center">
                  Ask me anything about fitness, nutrition, workouts, or
                  recovery.
                </p>

                <div className="flex flex-wrap justify-center gap-1.5 max-w-2xl">
                  {suggestedQuestions.map((q) => (
                    <button
                      key={q}
                      onClick={() => sendMessage(q)}
                      className="bg-white/5 border border-white/10 hover:border-primary-400/30 hover:bg-primary-400/5 px-3 py-2 rounded-full text-xs transition-all"
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
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: Math.min(index * 0.05, 0.3) }}
                className={`py-4 ${
                  message.role === "user" ? "" : "border-t border-white/5"
                }`}
              >
                <div className="flex gap-3">
                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    {message.role === "assistant" ? (
                      <div className="w-7 h-7 bg-primary-400/10 rounded-lg flex items-center justify-center">
                        <Dumbbell size={14} className="text-primary-400" />
                      </div>
                    ) : (
                      <div className="w-7 h-7 bg-white/10 rounded-lg flex items-center justify-center">
                        <User size={14} className="text-white/70" />
                      </div>
                    )}
                  </div>

                  {/* Message Content */}
                  <div className="flex-1 min-w-0">
                    {message.role === "assistant" ? (
                      <div className="text-left">
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          components={MarkdownComponents}
                        >
                          {message.content}
                        </ReactMarkdown>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-1.5 mt-3 pt-0.5">
                          <button
                            onClick={() => copyMessage(message.content)}
                            className="flex items-center gap-1 text-white/30 hover:text-white/70 transition text-[10px]"
                          >
                            <Copy size={12} />
                            <span className="hidden sm:inline">Copy</span>
                          </button>
                          <button
                            onClick={regenerateLastMessage}
                            disabled={isTyping}
                            className="flex items-center gap-1 text-white/30 hover:text-white/70 transition text-[10px] disabled:opacity-30"
                          >
                            <RefreshCw size={12} />
                            <span className="hidden sm:inline">Regenerate</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-end">
                        <div className="bg-white/10 text-white rounded-2xl px-3.5 py-2.5 max-w-[85%] sm:max-w-[75%]">
                          <p className="text-xs md:text-sm leading-relaxed">{message.content}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}

            {isTyping && (
              <motion.div
                key="typing"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="py-4 border-t border-white/5"
              >
                <div className="flex gap-3">
                  <div className="flex-shrink-0">
                    <div className="w-7 h-7 bg-primary-400/10 rounded-lg flex items-center justify-center">
                      <Dumbbell size={14} className="text-primary-400" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0 pt-0.5">
                    <div className="flex items-center gap-1.5">
                      <motion.div
                        animate={{ y: [0, -6, 0] }}
                        transition={{
                          duration: 1.2,
                          repeat: Infinity,
                          delay: 0,
                          ease: "easeInOut",
                        }}
                        className="w-1.5 h-1.5 bg-primary-400 rounded-full"
                      />
                      <motion.div
                        animate={{ y: [0, -6, 0] }}
                        transition={{
                          duration: 1.2,
                          repeat: Infinity,
                          delay: 0.2,
                          ease: "easeInOut",
                        }}
                        className="w-1.5 h-1.5 bg-primary-400 rounded-full"
                      />
                      <motion.div
                        animate={{ y: [0, -6, 0] }}
                        transition={{
                          duration: 1.2,
                          repeat: Infinity,
                          delay: 0.4,
                          ease: "easeInOut",
                        }}
                        className="w-1.5 h-1.5 bg-primary-400 rounded-full"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={messagesEndRef} className="h-1" />
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t border-white/10 backdrop-blur-xl bg-black/60 sticky bottom-0">
        <div className="max-w-3xl mx-auto px-3 sm:px-6 py-3">
          <div className="flex gap-2.5 items-end">
            <div className="flex-1 bg-white/5 border border-white/10 rounded-2xl">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask your fitness question..."
                className="w-full bg-transparent text-white placeholder-white/40 px-4 py-2.5 resize-none focus:outline-none text-xs md:text-sm"
                rows={1}
                style={{
                  maxHeight: "150px",
                  minHeight: "44px",
                }}
              />
            </div>
            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || isTyping}
              className="bg-primary-400 text-black p-2.5 rounded-xl font-bold hover:bg-primary-300 transition disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
            >
              <Send size={18} />
            </button>
          </div>
          <p className="text-[10px] text-white/30 text-center mt-1.5">
            Press Enter to send, Shift+Enter for new line
          </p>
        </div>
      </div>
    </div>
  );
}
