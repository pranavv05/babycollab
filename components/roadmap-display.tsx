"use client"

import { useState } from "react"
import { CheckCircle2, Circle, BookOpen, ExternalLink, Save } from "lucide-react"
import { useRouter } from "next/navigation"

interface RoadmapDisplayProps {
  roadmap: any
}

export function RoadmapDisplay({ roadmap }: RoadmapDisplayProps) {
  const router = useRouter()
  const [milestones, setMilestones] = useState(
    roadmap.phases.flatMap((phase: any) => phase.milestones.map((m: any) => ({ ...m, completed: false }))),
  )

  const toggleMilestone = (index: number) => {
    const updated = [...milestones]
    updated[index].completed = !updated[index].completed
    setMilestones(updated)
  }

  const handleSave = () => {
    // In a real app, this would save to database
    console.log("[v0] Saving roadmap:", roadmap)
    router.push("/roadmaps")
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-card border border-border rounded-lg p-8">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">{roadmap.title}</h1>
            <p className="text-muted-foreground">
              {roadmap.skillLevel} • {roadmap.timeline} timeline
            </p>
          </div>
          <button
            onClick={handleSave}
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            <Save className="w-5 h-5" />
            Save Roadmap
          </button>
        </div>
        <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
          <p className="text-sm text-foreground">
            This personalized roadmap was generated based on your goals and preferences. You can customize it anytime
            and track your progress as you complete each milestone.
          </p>
        </div>
      </div>

      {/* Phases */}
      {roadmap.phases.map((phase: any, phaseIndex: number) => (
        <div key={phaseIndex} className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-1">{phase.name} Phase</h2>
              <p className="text-sm text-muted-foreground">Duration: {phase.duration}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">
                {phase.milestones.filter((m: any) => m.completed).length}/{phase.milestones.length} completed
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {phase.milestones.map((milestone: any, milestoneIndex: number) => {
              const globalIndex =
                roadmap.phases.slice(0, phaseIndex).reduce((acc: number, p: any) => acc + p.milestones.length, 0) +
                milestoneIndex

              return (
                <div
                  key={milestoneIndex}
                  className="bg-secondary border border-border rounded-lg p-6 hover:border-primary/50 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <button
                      onClick={() => toggleMilestone(globalIndex)}
                      className="flex-shrink-0 mt-1 hover:scale-110 transition-transform"
                    >
                      {milestones[globalIndex]?.completed ? (
                        <CheckCircle2 className="w-6 h-6 text-success" />
                      ) : (
                        <Circle className="w-6 h-6 text-muted-foreground" />
                      )}
                    </button>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-foreground mb-2">{milestone.title}</h3>
                      <p className="text-sm text-muted-foreground mb-4">{milestone.description}</p>

                      {/* Skills */}
                      <div className="mb-4">
                        <p className="text-xs font-medium text-muted-foreground mb-2">Skills to learn:</p>
                        <div className="flex flex-wrap gap-2">
                          {milestone.skills.map((skill: string, idx: number) => (
                            <span
                              key={idx}
                              className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full border border-primary/20"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Resources */}
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-2">Recommended resources:</p>
                        <div className="space-y-2">
                          {milestone.resources.map((resource: any, idx: number) => (
                            <a
                              key={idx}
                              href="#"
                              className="flex items-center justify-between bg-muted/50 border border-border rounded-lg px-4 py-2 hover:border-primary/50 transition-colors group"
                            >
                              <div className="flex items-center gap-2">
                                <BookOpen className="w-4 h-4 text-primary" />
                                <span className="text-sm text-foreground">{resource.title}</span>
                                <span className="text-xs text-muted-foreground">• {resource.type}</span>
                              </div>
                              <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                            </a>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
