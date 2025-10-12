"use client"

import { useState } from "react"
import { Target, Clock, TrendingUp, Send, Sparkles, Bot } from "lucide-react"
import Link from "next/link"

// Mock data for existing roadmaps
const roadmaps = [
  {
    id: "1",
    title: "Full Stack Developer",
    field: "Software Engineering",
    progress: 65,
    phase: "Intermediate",
    timeline: "6 months",
    createdAt: "2024-01-15",
    milestones: { completed: 8, total: 12 },
  },
  {
    id: "2",
    title: "Data Science Career",
    field: "Data Science",
    progress: 40,
    phase: "Foundation",
    timeline: "1 year",
    createdAt: "2024-02-01",
    milestones: { completed: 4, total: 10 },
  },
  {
    id: "3",
    title: "Product Management",
    field: "Product Management",
    progress: 85,
    phase: "Advanced",
    timeline: "3 months",
    createdAt: "2023-12-10",
    milestones: { completed: 9, total: 10 },
  },
]

type Message = {
  role: "user" | "assistant"
  content: string
}

export default function RoadmapsPage() {
  const [activeTab, setActiveTab] = useState<"my-roadmaps" | "create-new">("my-roadmaps")
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hi! I'm your AI career advisor. Tell me what skills or career path you'd like to learn, and I'll help create a personalized roadmap for you. For example, you could say 'I want to become a full-stack developer' or 'I want to learn data science'.",
    },
  ])
  const [input, setInput] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [conversationStep, setConversationStep] = useState(0)

  const handleSendMessage = async () => {
    if (!input.trim() || isGenerating) return

    const userMessage = input.trim()
    setInput("")
    setMessages((prev) => [...prev, { role: "user", content: userMessage }])
    setIsGenerating(true)

    // Simulate AI response based on conversation step
    setTimeout(() => {
      let aiResponse = ""

      if (conversationStep === 0) {
        aiResponse =
          "Great choice! To create the best roadmap for you, I need to understand your background better. What's your current skill level in this field? (Beginner, Intermediate, or Advanced)"
        setConversationStep(1)
      } else if (conversationStep === 1) {
        aiResponse =
          "Perfect! How much time can you dedicate to learning? Are you looking to learn part-time or full-time?"
        setConversationStep(2)
      } else if (conversationStep === 2) {
        aiResponse =
          "Excellent! What's your target timeline for achieving your goal? (e.g., 3 months, 6 months, 1 year)"
        setConversationStep(3)
      } else if (conversationStep === 3) {
        aiResponse =
          "One last question - what's your preferred learning style? Do you prefer hands-on projects, structured courses, reading documentation, or a mix of everything?"
        setConversationStep(4)
      } else {
        aiResponse =
          "Perfect! I have all the information I need. Let me generate a personalized roadmap for you based on our conversation. This will take just a moment..."
        setConversationStep(5)

        // Generate roadmap after a delay
        setTimeout(() => {
          setMessages((prev) => [
            ...prev,
            {
              role: "assistant",
              content:
                "🎉 Your personalized roadmap is ready! I've created a comprehensive learning path with phases, milestones, and resources tailored to your goals. You can view it below and start tracking your progress.",
            },
          ])
          setIsGenerating(false)
          // Here you would typically navigate to the generated roadmap or display it
        }, 2000)
        return
      }

      setMessages((prev) => [...prev, { role: "assistant", content: aiResponse }])
      setIsGenerating(false)
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Career Roadmaps</h1>
          <p className="text-lg text-muted-foreground">Plan and track your career journey with AI-powered guidance</p>
        </div>

        <div className="flex gap-2 mb-8 border-b border-border">
          <button
            onClick={() => setActiveTab("my-roadmaps")}
            className={`px-6 py-3 font-medium transition-colors relative ${
              activeTab === "my-roadmaps" ? "text-primary" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            My Roadmaps ({roadmaps.length})
            {activeTab === "my-roadmaps" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />}
          </button>
          <button
            onClick={() => setActiveTab("create-new")}
            className={`px-6 py-3 font-medium transition-colors relative flex items-center gap-2 ${
              activeTab === "create-new" ? "text-primary" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Sparkles className="w-4 h-4" />
            Create New
            {activeTab === "create-new" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />}
          </button>
        </div>

        {activeTab === "my-roadmaps" && (
          <>
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-center gap-3 mb-2">
                  <Target className="w-5 h-5 text-primary" />
                  <h3 className="text-sm font-medium text-muted-foreground">Total Roadmaps</h3>
                </div>
                <p className="text-3xl font-bold text-foreground">{roadmaps.length}</p>
              </div>
              <div className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-center gap-3 mb-2">
                  <TrendingUp className="w-5 h-5 text-success" />
                  <h3 className="text-sm font-medium text-muted-foreground">Avg Progress</h3>
                </div>
                <p className="text-3xl font-bold text-foreground">
                  {Math.round(roadmaps.reduce((acc, r) => acc + r.progress, 0) / roadmaps.length)}%
                </p>
              </div>
              <div className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-center gap-3 mb-2">
                  <Clock className="w-5 h-5 text-warning" />
                  <h3 className="text-sm font-medium text-muted-foreground">In Progress</h3>
                </div>
                <p className="text-3xl font-bold text-foreground">{roadmaps.filter((r) => r.progress < 100).length}</p>
              </div>
            </div>

            {/* Roadmaps Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {roadmaps.map((roadmap) => (
                <Link
                  key={roadmap.id}
                  href={`/roadmaps/${roadmap.id}`}
                  className="bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition-all group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                        {roadmap.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">{roadmap.field}</p>
                    </div>
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">{roadmap.progress}%</span>
                  </div>

                  <div className="w-full bg-muted rounded-full h-2 mb-4">
                    <div
                      className="bg-primary h-2 rounded-full transition-all"
                      style={{ width: `${roadmap.progress}%` }}
                    />
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Phase</span>
                      <span className="text-foreground font-medium">{roadmap.phase}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Timeline</span>
                      <span className="text-foreground font-medium">{roadmap.timeline}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Milestones</span>
                      <span className="text-foreground font-medium">
                        {roadmap.milestones.completed}/{roadmap.milestones.total}
                      </span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border">
                    <p className="text-xs text-muted-foreground">
                      Created {new Date(roadmap.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}

        {activeTab === "create-new" && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-card border border-border rounded-lg overflow-hidden">
              {/* Chat Header */}
              <div className="bg-primary/5 border-b border-border px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <Bot className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">AI Career Advisor</h3>
                    <p className="text-sm text-muted-foreground">Let's create your personalized roadmap</p>
                  </div>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="h-[500px] overflow-y-auto p-6 space-y-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    {message.role === "assistant" && (
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                        <Bot className="w-4 h-4 text-primary" />
                      </div>
                    )}
                    <div
                      className={`max-w-[80%] rounded-lg px-4 py-3 ${
                        message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
                      }`}
                    >
                      <p className="text-sm leading-relaxed">{message.content}</p>
                    </div>
                    {message.role === "user" && (
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 text-primary text-sm font-medium">
                        JD
                      </div>
                    )}
                  </div>
                ))}
                {isGenerating && (
                  <div className="flex gap-3 justify-start">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 text-primary" />
                    </div>
                    <div className="bg-muted rounded-lg px-4 py-3">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce" />
                        <div className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce delay-100" />
                        <div className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce delay-200" />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Chat Input */}
              <div className="border-t border-border p-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    placeholder="Type your message..."
                    className="flex-1 bg-background border border-border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    disabled={isGenerating}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!input.trim() || isGenerating}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-4 h-4" />
                    Send
                  </button>
                </div>
              </div>
            </div>

            {/* Helper Tips */}
            <div className="mt-6 bg-primary/5 border border-primary/20 rounded-lg p-4">
              <h4 className="font-medium text-foreground mb-2 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                Tips for better roadmaps
              </h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Be specific about your career goals and target role</li>
                <li>• Mention your current skill level honestly</li>
                <li>• Share your time commitment and learning preferences</li>
                <li>• The AI will ask follow-up questions to personalize your roadmap</li>
              </ul>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
