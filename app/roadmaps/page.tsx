"use client"

import { useState } from "react"
import { Send, Sparkles, Bot, TrendingUp, Users, Clock, Target, CheckCircle, ChevronRight, Zap } from "lucide-react"
import Link from "next/link"

// Define types for the new structure
type Milestone = {
  id: number
  title: string
  resources: string[]
  completed: boolean
}

type Phase = {
  id: number
  title: string
  description: string
  milestones: Milestone[]
}

type GeneratedRoadmap = {
  id: string
  title: string
  description: string
  phases: Phase[]
}

// NEW: Define the type for a saved roadmap summary
type RoadmapSummary = {
  id: string;
  title: string;
  field: string;
  progress: number;
  phase: string;
  timeline: string;
  createdAt: string;
  milestones: { completed: number; total: number };
};

// Mock data for suggested roadmaps (unchanged)
const suggestedRoadmaps = [
  {
    id: "s1",
    title: "Full Stack Developer",
    description: "Master both frontend and backend development to build complete web applications",
    difficulty: "Intermediate",
    timeline: "6-8 months",
    milestones: 15,
    skills: ["React", "Node.js", "PostgreSQL", "TypeScript", "REST APIs"],
    followers: 2847,
    popular: true,
  },
  {
    id: "s2",
    title: "Frontend Developer",
    description: "Specialize in creating beautiful, responsive user interfaces and experiences",
    difficulty: "Beginner",
    timeline: "4-6 months",
    milestones: 12,
    skills: ["HTML/CSS", "JavaScript", "React", "Tailwind CSS", "Git"],
    followers: 3521,
    popular: true,
  },
  {
    id: "s3",
    title: "Data Scientist",
    description: "Learn to analyze data, build models, and extract insights using Python and ML",
    difficulty: "Advanced",
    timeline: "8-12 months",
    milestones: 18,
    skills: ["Python", "Pandas", "Machine Learning", "SQL", "Statistics"],
    followers: 2156,
    popular: true,
  },
]

// NEW: Define the questions for the AI assessment
const assessmentQuestions = [
  "First, what field or industry are you most interested in? (e.g., web development, data science, mobile apps, cybersecurity)",
  "Great! What's your current experience level in this field? (e.g., complete beginner, some experience, advanced)",
  "How much time can you realistically commit to learning each week? (e.g., 2-4 hours, 5-10 hours, 10+ hours)",
  "What's your preferred way to learn? (e.g., reading articles, watching video courses, hands-on projects)",
  "Finally, what is your ultimate career goal? (e.g., get a job as a junior developer, build my own startup, become a freelancer)"
];

type Message = {
  role: "user" | "assistant"
  content: string
}

// Function to generate a mock AI roadmap structure
// In a real application, this would be the payload from your AI API call
const generateMockRoadmap = (title: string): GeneratedRoadmap => ({
  id: "ai-12345",
  title: `Personalized ${title} Roadmap`,
  description: `An AI-optimized learning path for ${title}, tailored for an intermediate, part-time learner on a 6-month timeline, focusing on hands-on projects.`,
  phases: [
    {
      id: 1,
      title: "Phase 1: Foundational Core",
      description: "Establish a strong base in essential technologies and concepts.",
      milestones: [
        { id: 101, title: "Master JavaScript Fundamentals", resources: ["MDN Guide", "Course: JS Complete Guide"], completed: false },
        { id: 102, title: "Learn Git and GitHub Basics", resources: ["Pro Git Book", "GitHub Docs"], completed: false },
        { id: 103, title: "Build a Simple Static Website (HTML/CSS)", resources: ["FreeCodeCamp HTML/CSS", "Tailwind CSS Docs"], completed: false },
      ],
    },
    {
      id: 2,
      title: "Phase 2: Frontend Specialization (React)",
      description: "Dive deep into modern frontend framework development with React.",
      milestones: [
        { id: 201, title: "Understand React Hooks and State Management", resources: ["React Official Docs", "Project: Todo App"], completed: false },
        { id: 202, title: "Implement Routing with React Router", resources: ["React Router Docs", "Video Tutorial: Basic Routing"], completed: false },
        { id: 203, title: "Create a Reusable Component Library", resources: ["Article: Design Systems", "Figma Design Example"], completed: false },
      ],
    },
    {
      id: 3,
      title: "Phase 3: Backend & Full Stack Integration",
      description: "Build a robust server, connect a database, and integrate the frontend.",
      milestones: [
        { id: 301, title: "Learn Node.js and Express.js", resources: ["Node.js Docs", "Course: Express.js API"], completed: false },
        { id: 302, title: "Design and Implement a REST API", resources: ["Article: REST Best Practices", "Project: Simple Blog API"], completed: false },
        { id: 303, title: "Connect to a PostgreSQL Database (CRUD)", resources: ["PostgreSQL Docs", "Video: Database Setup"], completed: false },
        { id: 304, title: "Deploy the Full Stack Application", resources: ["Vercel/Netlify Docs", "AWS EC2 Tutorial"], completed: false },
      ],
    },
  ],
});


export default function RoadmapsPage() {
  const [activeTab, setActiveTab] = useState<"suggested-roadmaps" | "my-roadmaps" | "create-new">("create-new")
  
  // UPDATED: Chat state to manage the conversation flow
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hi! I'm your AI career advisor. To find the perfect roadmap for you, I need to ask a few questions." },
    { role: "assistant", content: assessmentQuestions[0] }
  ]);
  const [conversationStep, setConversationStep] = useState(0);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);

  const [input, setInput] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  
  // NEW STATE: To hold the list of suggested roadmaps
  const [displayedSuggestedRoadmaps, setDisplayedSuggestedRoadmaps] = useState(suggestedRoadmaps);
  
  // UPDATED: "My Roadmaps" now starts as an empty array
  const [myRoadmaps, setMyRoadmaps] = useState<RoadmapSummary[]>([]);

  // NEW STATE: For the generated roadmap view
  const [generatedRoadmap, setGeneratedRoadmap] = useState<GeneratedRoadmap | null>(null)
  const [isGeneratingRoadmap, setIsGeneratingRoadmap] = useState(false);
  const [roadmapError, setRoadmapError] = useState<string | null>(null);


  const handleSendMessage = async () => {
    if (!input.trim() || isGenerating) return;

    const userAnswer = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userAnswer }]);
    
    const newAnswers = [...userAnswers, userAnswer];
    setUserAnswers(newAnswers);

    const nextStep = conversationStep + 1;

    if (nextStep < assessmentQuestions.length) {
      // Ask the next question
      setConversationStep(nextStep);
      setTimeout(() => {
        setMessages(prev => [...prev, { role: "assistant", content: assessmentQuestions[nextStep] }]);
      }, 500);
    } else {
      // All questions answered, now generate suggestions
      setIsGenerating(true);
      setTimeout(() => {
        setMessages(prev => [...prev, { role: "assistant", content: "Excellent! Thank you for your answers. I'm now creating personalized roadmaps and adding them to your collection. This will take just a moment..." }]);
      }, 500);

      try {
        const userProfile = {
          interest: newAnswers[0],
          experience: newAnswers[1],
          time: newAnswers[2],
          style: newAnswers[3],
          goal: newAnswers[4],
        };

        const response = await fetch('/api/suggest-roadmaps', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userProfile }),
        });

        if (!response.ok) {
          throw new Error('Failed to get suggestions from the AI.');
        }

        const newSuggestions = await response.json();
        
        // Convert AI suggestions into the format for "My Roadmaps"
        const newRoadmapsForUser: RoadmapSummary[] = newSuggestions.map((suggestion: any) => ({
          id: suggestion.id || Date.now().toString(),
          title: suggestion.title,
          field: "AI Suggested",
          progress: 0,
          phase: suggestion.difficulty || "Foundation",
          timeline: suggestion.timeline,
          createdAt: new Date().toISOString(),
          milestones: { completed: 0, total: suggestion.milestones || 10 },
        }));

        // Add the newly created roadmaps to the "My Roadmaps" list
        setMyRoadmaps(prev => [...newRoadmapsForUser, ...prev]);

        setMessages(prev => [...prev, { role: "assistant", content: "🎉 I've created your new roadmaps and saved them! You can see them now in the 'My Roadmaps' tab." }]);
        setActiveTab("my-roadmaps"); // Switch to the "My Roadmaps" tab

      } catch (error) {
        console.error("Failed to generate suggestions:", error);
        setMessages(prev => [...prev, { role: "assistant", content: "Sorry, I encountered an error while trying to generate suggestions. Please try again later by refreshing the page." }]);
      } finally {
        setIsGenerating(false);
      }
    }
  };
  
  // NEW FUNCTION: Handles starting a suggested roadmap
  const handleStartRoadmap = async (roadmapTitle: string) => {
    setIsGeneratingRoadmap(true);
    setRoadmapError(null);
    setGeneratedRoadmap(null); // Clear previous roadmap

    try {
      const response = await fetch('/api/generate-roadmap', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ roadmapTitle }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate roadmap from API.');
      }

      const newRoadmap: GeneratedRoadmap = await response.json();
      setGeneratedRoadmap(newRoadmap);

    } catch (error: any) {
      console.error("Roadmap generation failed:", error);
      setRoadmapError(error.message || "An unexpected error occurred while generating the roadmap.");
    } finally {
      setIsGeneratingRoadmap(false);
    }
  }

  // NEW FUNCTION: Saves the generated roadmap to "My Roadmaps"
  const handleSaveRoadmap = () => {
    if (!generatedRoadmap) return;

    // Convert the detailed GeneratedRoadmap into the summary format for "My Roadmaps"
    const totalMilestones = generatedRoadmap.phases.flatMap(p => p.milestones).length;
    const newRoadmapSummary: RoadmapSummary = {
      id: generatedRoadmap.id,
      title: generatedRoadmap.title,
      field: "AI Generated", // Or derive from answers
      progress: 0,
      phase: "Foundation",
      timeline: "6 months", // Or derive from AI response
      createdAt: new Date().toISOString(),
      milestones: { completed: 0, total: totalMilestones },
    };

    setMyRoadmaps(prev => [newRoadmapSummary, ...prev]);
    setGeneratedRoadmap(null); // Go back to the main view
    setActiveTab("my-roadmaps"); // Switch to the "My Roadmaps" tab
  };

  // NEW FUNCTION: Toggles the completion status of a milestone
  const handleToggleMilestone = (phaseId: number, milestoneId: number) => {
    if (!generatedRoadmap) return;

    setGeneratedRoadmap(prevRoadmap => {
      if (!prevRoadmap) return prevRoadmap;

      const updatedPhases = prevRoadmap.phases.map(phase => {
        if (phase.id === phaseId) {
          const updatedMilestones = phase.milestones.map(milestone => {
            if (milestone.id === milestoneId) {
              return { ...milestone, completed: !milestone.completed };
            }
            return milestone;
          });
          return { ...phase, milestones: updatedMilestones };
        }
        return phase;
      });

      return { ...prevRoadmap, phases: updatedPhases };
    });
  };

  // NEW COMPONENT: Renders the interactive AI-generated roadmap
  const GeneratedRoadmapView = ({ roadmap, onBack }: { roadmap: GeneratedRoadmap, onBack: () => void }) => {
    const totalMilestones = roadmap.phases.flatMap(p => p.milestones).length;
    const completedMilestones = roadmap.phases.flatMap(p => p.milestones).filter(m => m.completed).length;
    const progress = totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0;
    
    return (
      <div className="space-y-8">
        <button onClick={onBack} className="flex items-center text-primary hover:text-primary/80 transition-colors mb-4">
            <ChevronRight className="w-4 h-4 rotate-180 mr-1" /> Back to Suggested Roadmaps
        </button>
        
        <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 flex items-center justify-between">
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-foreground flex items-center gap-2">
                <Zap className="w-6 h-6 text-primary" />
                {roadmap.title}
            </h2>
            <p className="text-lg text-muted-foreground mt-1">{roadmap.description}</p>
          </div>
          <div className="text-right">
             <p className="text-2xl font-bold text-primary">{progress}%</p>
             <p className="text-sm text-muted-foreground">Overall Progress</p>
          </div>
        </div>

        <div className="w-full bg-muted rounded-full h-2">
            <div
                className="bg-primary h-2 rounded-full transition-all"
                style={{ width: `${progress}%` }}
            />
        </div>
        
        {/* Phases and Milestones */}
        <div className="space-y-10">
          {roadmap.phases.map(phase => (
            <div key={phase.id} className="border-l-4 border-primary/50 pl-6 space-y-4">
              <h3 className="text-2xl font-semibold text-foreground">{phase.id}. {phase.title}</h3>
              <p className="text-muted-foreground">{phase.description}</p>
              
              <div className="space-y-3">
                {phase.milestones.map(milestone => (
                  <div 
                    key={milestone.id} 
                    className={`p-4 rounded-lg border transition-all cursor-pointer ${
                      milestone.completed 
                        ? 'bg-green-500/10 border-green-500/50' 
                        : 'bg-card border-border hover:border-primary/50'
                    }`}
                    onClick={() => handleToggleMilestone(phase.id, milestone.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {milestone.completed ? (
                          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                        ) : (
                          <div className="w-5 h-5 border-2 border-muted-foreground/50 rounded-full flex-shrink-0" />
                        )}
                        <span className={`font-medium ${milestone.completed ? 'text-green-500 line-through' : 'text-foreground'}`}>
                          {milestone.title}
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground">{milestone.resources.length} resources</span>
                    </div>
                    {milestone.completed && (
                      <p className="text-xs text-green-600 mt-2 italic">Milestone Achieved! Great job.</p>
                    )}
                    {!milestone.completed && (
                        <div className="mt-3 space-y-1">
                            <p className="text-xs font-medium text-muted-foreground">Suggested Resources:</p>
                            <div className="flex flex-wrap gap-2">
                                {milestone.resources.map((resource, idx) => (
                                    <span key={idx} className="text-xs bg-muted border border-border px-2 py-1 rounded-full text-foreground/80">
                                        {resource}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center pt-8">
            <button 
                onClick={handleSaveRoadmap} 
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 rounded-lg font-medium transition-colors"
            >
                Finish & Save Roadmap
            </button>
        </div>
      </div>
    )
  }


  return (
    <div className="min-h-screen bg-background ml-64">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Career Roadmaps</h1>
          <p className="text-lg text-muted-foreground">Plan and track your career journey with AI-powered guidance</p>
        </div>

        {/* Render the generated roadmap view if it exists */}
        {isGeneratingRoadmap ? (
            <div className="bg-card border border-border rounded-lg p-8 text-center">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4 animate-pulse">
                    <Sparkles className="w-6 h-6 text-primary" />
                </div>
                <h2 className="text-xl font-semibold text-foreground mb-2">Generating Your AI Roadmap...</h2>
                <p className="text-muted-foreground">Our AI is crafting a personalized learning path just for you. This might take a moment.</p>
            </div>
        ) : roadmapError ? (
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 text-center">
                <h2 className="text-xl font-semibold text-destructive mb-2">Generation Failed</h2>
                <p className="text-muted-foreground mb-4">{roadmapError}</p>
                <button onClick={() => setRoadmapError(null)} className="bg-destructive text-destructive-foreground px-6 py-2 rounded-lg font-medium">
                    Try Again
                </button>
            </div>
        ) : generatedRoadmap ? (
            <GeneratedRoadmapView 
                roadmap={generatedRoadmap} 
                onBack={() => setGeneratedRoadmap(null)} // Reset state to show tabs again
            />
        ) : (
            <>
                {/* Tab Navigation (only visible if no roadmap is being viewed) */}
                <div className="flex gap-2 mb-8 border-b border-border">
                  <button
                    onClick={() => setActiveTab("suggested-roadmaps")}
                    className={`px-6 py-3 font-medium transition-colors relative flex items-center gap-2 ${
                      activeTab === "suggested-roadmaps" ? "text-primary" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <TrendingUp className="w-4 h-4" />
                    Suggested Roadmaps
                    {activeTab === "suggested-roadmaps" && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                    )}
                  </button>
                  <button
                    onClick={() => setActiveTab("my-roadmaps")}
                    className={`px-6 py-3 font-medium transition-colors relative ${
                      activeTab === "my-roadmaps" ? "text-primary" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    My Roadmaps ({myRoadmaps.length})
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

                {/* Tab Content */}
                {activeTab === "suggested-roadmaps" && (
                  <>
                    <div className="mb-6 bg-primary/5 border border-primary/20 rounded-lg p-4">
                      <h3 className="font-semibold text-foreground mb-1 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-primary" />
                        Suggested Career Paths
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Based on your interests, here are some curated roadmaps. Start your journey today!
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {displayedSuggestedRoadmaps.map((roadmap) => (
                        <div
                          key={roadmap.id}
                          className="bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition-all group relative"
                        >
                          {roadmap.popular && (
                            <div className="absolute top-4 right-4 bg-primary/20 text-primary text-xs px-2 py-1 rounded-full font-medium flex items-center gap-1">
                              <TrendingUp className="w-3 h-3" />
                              Popular
                            </div>
                          )}

                          <div className="mb-4">
                            <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                              {roadmap.title}
                            </h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">{roadmap.description}</p>
                          </div>

                          <div className="space-y-3 mb-4">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground flex items-center gap-1">
                                <Target className="w-4 h-4" />
                                Difficulty
                              </span>
                              <span
                                className={`font-medium px-2 py-0.5 rounded text-xs ${
                                  roadmap.difficulty === "Beginner"
                                    ? "bg-green-500/10 text-green-500"
                                    : roadmap.difficulty === "Intermediate"
                                      ? "bg-yellow-500/10 text-yellow-500"
                                      : "bg-red-500/10 text-red-500"
                                }`}
                              >
                                {roadmap.difficulty}
                              </span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                Timeline
                              </span>
                              <span className="text-foreground font-medium">{roadmap.timeline}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">Milestones</span>
                              <span className="text-foreground font-medium">{roadmap.milestones} steps</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground flex items-center gap-1">
                                <Users className="w-4 h-4" />
                                Followers
                              </span>
                              <span className="text-foreground font-medium">{roadmap.followers.toLocaleString()}</span>
                            </div>
                          </div>

                          <div className="mb-4">
                            <p className="text-xs text-muted-foreground mb-2">Key Skills:</p>
                            <div className="flex flex-wrap gap-1">
                              {roadmap.skills.slice(0, 3).map((skill, index) => (
                                <span key={index} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                                  {skill}
                                </span>
                              ))}
                              {roadmap.skills.length > 3 && (
                                <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded">
                                  +{roadmap.skills.length - 3} more
                                </span>
                              )}
                            </div>
                          </div>

                          {/* CHANGED: onClick handler added here */}
                          <button 
                            onClick={() => handleStartRoadmap(roadmap.title)}
                            disabled={isGeneratingRoadmap}
                            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-2.5 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {isGeneratingRoadmap ? 'Generating...' : 'Start This Roadmap'}
                          </button>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {activeTab === "my-roadmaps" && (
                  <>
                    {myRoadmaps.length === 0 ? (
                        <div className="text-center py-16 bg-card border border-border rounded-lg">
                            <h3 className="text-xl font-semibold text-foreground">Your Roadmaps are Empty</h3>
                            <p className="text-muted-foreground mt-2">
                                Use the AI chat to create a personalized roadmap and save it here.
                            </p>
                            <button
                                onClick={() => setActiveTab("create-new")}
                                className="mt-6 bg-primary text-primary-foreground px-6 py-2 rounded-lg font-medium transition-colors hover:bg-primary/90 flex items-center gap-2 mx-auto"
                            >
                                <Sparkles className="w-4 h-4" />
                                Create a New Roadmap
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {myRoadmaps.map((roadmap) => (
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
                    )}
                </>
                )}

                {activeTab === "create-new" && (
                  // ... (Create New/Chat content is unchanged)
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
                                        placeholder={conversationStep < assessmentQuestions.length ? "Type your answer..." : "All questions answered!"}
                                        className="flex-1 bg-background border border-border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                                        disabled={isGenerating || conversationStep >= assessmentQuestions.length}
                                    />
                                    <button
                                        onClick={handleSendMessage}
                                        disabled={!input.trim() || isGenerating || conversationStep >= assessmentQuestions.length}
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
                                <li>• Answer each question to help the AI understand your goals.</li>
                                <li>• Be specific about your career interests and current skill level.</li>
                                <li>• Your answers will be used to generate highly personalized roadmaps.</li>
                            </ul>
                        </div>
                    </div>
                )}
            </>
        )}
      </main>
    </div>
  )
}