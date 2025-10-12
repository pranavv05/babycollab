import { RoadmapDisplay } from "@/components/roadmap-display"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

// Mock data - in real app this would come from database
const mockRoadmap = {
  title: "Full Stack Developer Career Path",
  field: "Software Engineering",
  skillLevel: "Intermediate",
  timeline: "6 months",
  phases: [
    {
      name: "Foundation",
      duration: "2-3 months",
      milestones: [
        {
          title: "Learn Core Fundamentals",
          description: "Master the basics of your chosen field",
          skills: ["HTML", "CSS", "JavaScript Basics"],
          resources: [
            { title: "MDN Web Docs", type: "Documentation" },
            { title: "freeCodeCamp", type: "Course" },
          ],
          completed: true,
        },
        {
          title: "Build First Projects",
          description: "Apply your knowledge with hands-on projects",
          skills: ["Project Planning", "Git Basics", "Problem Solving"],
          resources: [
            { title: "GitHub", type: "Platform" },
            { title: "Frontend Mentor", type: "Practice" },
          ],
          completed: true,
        },
      ],
    },
    {
      name: "Intermediate",
      duration: "3-4 months",
      milestones: [
        {
          title: "Advanced Concepts",
          description: "Dive deeper into advanced topics",
          skills: ["React", "TypeScript", "State Management"],
          resources: [
            { title: "React Documentation", type: "Documentation" },
            { title: "TypeScript Handbook", type: "Documentation" },
          ],
          completed: false,
        },
      ],
    },
  ],
}

export default function RoadmapDetailPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-2xl font-bold text-primary">
              Baby Collab
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/roadmaps"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Roadmaps
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-8">
        <RoadmapDisplay roadmap={mockRoadmap} />
      </main>
    </div>
  )
}
