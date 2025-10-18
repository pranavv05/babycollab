"use client"

import { useState, useEffect } from "react"
import { ArrowRight, CheckCircle2 } from "lucide-react"
import Link from "next/link"

interface Roadmap {
  id: string
  title: string
  phase: string
  progress: number
  milestones: {
    completed: number
    total: number
  }
}

export function RoadmapsPreview() {
  const [roadmaps, setRoadmaps] = useState<Roadmap[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchRoadmaps = async () => {
      try {
        const res = await fetch('/api/roadmaps?limit=3')
        if (!res.ok) throw new Error('Failed to fetch roadmaps')
        const data = await res.json()
        setRoadmaps(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchRoadmaps()
  }, [])

  if (loading) {
    return (
      <div className="bg-card border border-border rounded-xl p-5">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg sm:text-xl font-semibold text-foreground">Active Roadmaps</h3>
          <Link href="/roadmaps" className="text-sm text-primary hover:text-primary/80 transition-colors flex items-center gap-1">
            View all
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="bg-secondary border border-border rounded-lg p-4 animate-pulse">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </div>
              </div>
              <div className="w-full bg-muted rounded-full h-2 mb-3">
                <div className="bg-primary h-2 rounded-full w-1/3"></div>
              </div>
              <div className="flex items-center justify-between">
                <div className="h-3 bg-muted rounded w-1/3"></div>
                <div className="h-3 bg-muted rounded w-1/4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-card border border-border rounded-xl p-5">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg sm:text-xl font-semibold text-foreground">Active Roadmaps</h3>
          <Link href="/roadmaps" className="text-sm text-primary hover:text-primary/80 transition-colors flex items-center gap-1">
            View all
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="text-center py-8 text-muted-foreground">
          <p>{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-lg sm:text-xl font-semibold text-foreground">Active Roadmaps</h3>
        <Link href="/roadmaps" className="text-sm text-primary hover:text-primary/80 transition-colors flex items-center gap-1">
          View all
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
      <div className="space-y-4">
        {roadmaps.map((roadmap) => (
          <Link
            key={roadmap.id}
            href={`/roadmaps/${roadmap.id}`}
            className="bg-secondary border border-border rounded-lg p-4 hover:border-primary/50 transition-all duration-200 hover:shadow-sm cursor-pointer block"
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
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}