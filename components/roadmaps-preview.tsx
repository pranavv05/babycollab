"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

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
        if (!res.ok) throw new Error('Failed to load roadmaps')
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
        </div>
        <div className="space-y-4">
          <div className="h-12 bg-muted rounded animate-pulse" />
          <div className="h-12 bg-muted rounded animate-pulse" />
          <div className="h-12 bg-muted rounded animate-pulse" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-card border border-border rounded-xl p-5">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg sm:text-xl font-semibold text-foreground">Active Roadmaps</h3>
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
        {roadmaps.length === 0 ? (
          <div className="text-center text-muted-foreground py-6">No active roadmaps found.</div>
        ) : (
          roadmaps.map((r) => (
            <div key={r.id} className="bg-card border border-border rounded-lg p-4 flex items-center justify-between">
              <div>
                <h4 className="font-medium text-foreground">{r.title}</h4>
                <p className="text-sm text-muted-foreground">{r.phase} • {r.milestones.completed}/{r.milestones.total} steps</p>
              </div>
              <div className="text-right">
                <div className="text-sm text-muted-foreground">Progress</div>
                <div className="font-semibold text-foreground">{r.progress}%</div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}