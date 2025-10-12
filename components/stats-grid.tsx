import { TrendingUp, Target, Briefcase, Award } from "lucide-react"

const stats = [
  {
    label: "Active Roadmaps",
    value: "3",
    description: "2 in progress",
    icon: Target,
    trend: "+1 this month",
  },
  {
    label: "Projects",
    value: "5",
    description: "2 active collaborations",
    icon: Briefcase,
    trend: "3 completed",
  },
  {
    label: "Skills Learned",
    value: "12",
    description: "Across all roadmaps",
    icon: Award,
    trend: "+4 this month",
  },
  {
    label: "Career Progress",
    value: "68%",
    description: "Overall completion",
    icon: TrendingUp,
    trend: "+12% this month",
  },
]

export function StatsGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition-colors"
        >
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className="text-3xl font-bold text-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <stat.icon className="w-5 h-5 text-primary" />
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-border">
            <p className="text-xs text-success">{stat.trend}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
