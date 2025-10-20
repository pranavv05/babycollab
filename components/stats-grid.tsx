"use client"

import { useState, useEffect, useCallback } from "react"
import { Briefcase } from "lucide-react"  // Removed roadmap-related icons
import { fetchWithCache } from "@/lib/data-fetching"

interface Stat {
  label: string
  value: string
  description: string
  icon: any
  trend: string
}

export function StatsGrid() {
  const [stats, setStats] = useState<Stat[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true)
      const data = await fetchWithCache('/api/dashboard/stats', {
        credentials: 'include'
      }, 5 * 60 * 1000) // 5 minute cache
      
      console.log('Fetched dashboard stats:', data) // Debug log
      
      // Transform the data to match the component's expectations
      const transformedStats: Stat[] = [
        {
          label: "Projects",
          value: data.totalProjects.toString(),
          description: `${data.projectsInProgress} in progress`,
          icon: Briefcase,
          trend: `${data.projectsCompleted} completed`,
        },
        {
          label: "Active Projects",
          value: data.projectsInProgress.toString(),
          description: "Currently working on",
          icon: Briefcase,
          trend: `${data.projectsInProgress} active`,
        },
        {
          label: "Completed Projects",
          value: data.projectsCompleted.toString(),
          description: "Successfully finished",
          icon: Briefcase,
          trend: `${data.projectsCompleted} completed`,
        },
      ]
      
      setStats(transformedStats)
    } catch (err) {
      console.error('Error fetching stats:', err)
      setError("Failed to load statistics")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    let isMounted = true;
    
    const loadStats = async () => {
      await fetchStats()
    }

    loadStats()
    
    // Refresh stats every 5 minutes
    const interval = setInterval(() => {
      if (isMounted) {
        fetchStats()
      }
    }, 5 * 60 * 1000)

    // Cleanup function to prevent state updates on unmounted component
    return () => {
      isMounted = false;
      clearInterval(interval)
    };
  }, [fetchStats])

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-card border border-border rounded-xl p-5 animate-pulse">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <div className="h-4 bg-muted rounded w-24"></div>
                <div className="h-6 bg-muted rounded w-16"></div>
                <div className="h-3 bg-muted rounded w-32"></div>
              </div>
              <div className="w-10 h-10 rounded-lg bg-muted"></div>
            </div>
            <div className="mt-4 pt-3 border-t border-border">
              <div className="h-3 bg-muted rounded w-20"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="col-span-full text-center py-8 text-muted-foreground">
          <p>{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-card border border-border rounded-xl p-5 hover:border-primary/50 transition-all duration-200 hover:shadow-sm"
        >
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
              <p className="text-2xl sm:text-3xl font-bold text-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <stat.icon className="w-5 h-5 text-primary" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-border">
            <p className="text-xs text-success font-medium">{stat.trend}</p>
          </div>
        </div>
      ))}
    </div>
  )
}