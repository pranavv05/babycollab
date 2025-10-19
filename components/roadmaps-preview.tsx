import { ArrowRight, Clock, CheckCircle2 } from "lucide-react"
import Link from "next/link";

const roadmaps = [
  {
    title: "Full Stack Developer",
    progress: 65,
    phase: "Intermediate",
    dueDate: "3 months left",
    milestones: { completed: 8, total: 12 },
  },
  {
    title: "Data Science Career",
    progress: 40,
    phase: "Foundation",
    dueDate: "5 months left",
    milestones: { completed: 4, total: 10 },
  },
  {
    title: "Product Management",
    progress: 85,
    phase: "Advanced",
    dueDate: "1 month left",
    milestones: { completed: 9, total: 10 },
  },
]

export function RoadmapsPreview() {
  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-lg sm:text-xl font-semibold text-foreground">Active Roadmaps</h3>
        <a href="/roadmaps" className="text-sm text-primary hover:text-primary/80 transition-colors flex items-center gap-1">
          View all
          <ArrowRight className="w-4 h-4" />
        </a>
      </div>
      <div className="space-y-4">
        {roadmaps.map((roadmap) => (
          <Link 
            key={roadmap.title} 
            href={`/roadmaps/${roadmap.title.toLowerCase().replace(/ /g, '-')}`}
            className="block bg-secondary border border-border rounded-lg p-4 hover:border-primary/50 transition-all duration-200 hover:shadow-sm"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="text-base font-semibold text-foreground mb-1">{roadmap.title}</h4>
                <p className="text-sm text-muted-foreground">{roadmap.phase} Phase</p>
              </div>
              <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-medium">{roadmap.progress}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2 mb-3">
              <div className="bg-primary h-2 rounded-full transition-all duration-300" style={{ width: `${roadmap.progress}%` }} />
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>
                  {roadmap.milestones.completed}/{roadmap.milestones.total} milestones
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{roadmap.dueDate}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}