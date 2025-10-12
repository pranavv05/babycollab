import { Target, Briefcase, FileText } from "lucide-react"

const actions = [
  {
    label: "Create Roadmap",
    description: "Start a new career path",
    icon: Target,
    href: "#",
  },
  {
    label: "New Project",
    description: "Collaborate with others",
    icon: Briefcase,
    href: "#",
  },
  {
    label: "Update Resume",
    description: "AI-powered optimization",
    icon: FileText,
    href: "#",
  },
]

export function QuickActions() {
  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-foreground">Quick Actions</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {actions.map((action) => (
          <a
            key={action.label}
            href={action.href}
            className="group bg-secondary border border-border rounded-lg p-6 hover:border-primary hover:bg-secondary/80 transition-all"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <action.icon className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <h4 className="text-base font-semibold text-foreground mb-1">{action.label}</h4>
                <p className="text-sm text-muted-foreground">{action.description}</p>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}
