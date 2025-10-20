"use client"

import { useRouter } from "next/navigation"
import { 
  Briefcase, 
  FileText, 
  BarChart3, 
  Users, 
  Settings,
  Database
} from "lucide-react"

const actions = [
  {
    label: "Browse Projects",
    description: "Collaborate with others",
    icon: Briefcase,
    href: "/projects",
  },
  {
    label: "Update Resume",
    description: "AI-powered optimization",
    icon: FileText,
    href: "/resume",
  },
  {
    label: "View Roadmaps",
    description: "Track your progress",
    icon: BarChart3,
    href: "/roadmaps",
  },
  {
    label: "Manage Profile",
    description: "Update your information",
    icon: Users,
    href: "/profile",
  },
  {
    label: "Database Test",
    description: "Check database connection",
    icon: Database,
    href: "/db-test",
  },
]

export function QuickActions() {
  const router = useRouter()

  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-lg sm:text-xl font-semibold text-foreground">Quick Actions</h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {actions.map((action) => (
          <div
            key={action.label}
            onClick={() => router.push(action.href)}
            className="group bg-secondary border border-border rounded-lg p-5 hover:border-primary hover:bg-secondary/80 transition-all duration-200 hover:shadow-sm cursor-pointer"
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors flex-shrink-0">
                <action.icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h4 className="font-medium text-foreground group-hover:text-primary transition-colors">
                  {action.label}
                </h4>
                <p className="text-sm text-muted-foreground mt-1">{action.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}