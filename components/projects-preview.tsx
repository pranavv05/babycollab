"use client"

import { useState, useEffect } from "react"
import { ArrowRight, Users, Calendar, CheckCircle2 } from "lucide-react"
import Link from "next/link"

interface Project {
  id: string
  title: string
  status: string
  statusColor: string
  members: {
    name: string;
    avatar: string;
  }[]
  dueDate: string
  createdAt: string
  tasks: {
    todo: number
    inProgress: number
    done: number
  }
  skills: string[]
  description: string
}

export function ProjectsPreview() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch('/api/projects?limit=3')
        if (!res.ok) throw new Error('Failed to fetch projects')
        const data = await res.json()
        setProjects(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [])

  if (loading) {
    return (
      <div className="bg-card border border-border rounded-xl p-5">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg sm:text-xl font-semibold text-foreground">Recent Projects</h3>
          <Link href="/projects" className="text-sm text-primary hover:text-primary/80 transition-colors flex items-center gap-1">
            View all
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-secondary border border-border rounded-lg p-4 animate-pulse">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </div>
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
          <h3 className="text-lg sm:text-xl font-semibold text-foreground">Recent Projects</h3>
          <Link href="/projects" className="text-sm text-primary hover:text-primary/80 transition-colors flex items-center gap-1">
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
        <h3 className="text-lg sm:text-xl font-semibold text-foreground">Recent Projects</h3>
        <Link href="/projects" className="text-sm text-primary hover:text-primary/80 transition-colors flex items-center gap-1">
          View all
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
      <div className="space-y-4">
        {projects.map((project) => (
          <Link
            key={project.id}
            href={`/projects/${project.id}`}
            className="bg-secondary border border-border rounded-lg p-4 hover:border-primary/50 transition-all duration-200 hover:shadow-sm cursor-pointer block"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="text-base font-semibold text-foreground mb-1">{project.title}</h4>
                <span className={`text-sm font-medium ${project.statusColor}`}>{project.status}</span>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
              <div className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                <span>{project.members.length} members</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>Due {new Date(project.dueDate).toLocaleDateString()}</span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-background rounded-lg p-2 text-center">
                <p className="text-xs text-muted-foreground mb-1">To Do</p>
                <p className="text-sm font-semibold text-foreground">{project.tasks.todo}</p>
              </div>
              <div className="bg-background rounded-lg p-2 text-center">
                <p className="text-xs text-muted-foreground mb-1">In Progress</p>
                <p className="text-sm font-semibold text-warning">{project.tasks.inProgress}</p>
              </div>
              <div className="bg-background rounded-lg p-2 text-center">
                <p className="text-xs text-muted-foreground mb-1">Done</p>
                <p className="text-sm font-semibold text-success">{project.tasks.done}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}