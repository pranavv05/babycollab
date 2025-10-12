import { ArrowRight, Users, Calendar } from "lucide-react"

const projects = [
  {
    title: "E-commerce Platform",
    status: "In Progress",
    members: 4,
    dueDate: "Due in 2 weeks",
    statusColor: "text-warning",
  },
  {
    title: "Mobile App Design",
    status: "Active",
    members: 3,
    dueDate: "Due in 1 week",
    statusColor: "text-success",
  },
  {
    title: "Data Analysis Project",
    status: "Review",
    members: 2,
    dueDate: "Due tomorrow",
    statusColor: "text-primary",
  },
]

export function ProjectsPreview() {
  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-foreground">Recent Projects</h3>
        <a href="#" className="text-sm text-primary hover:text-primary/80 transition-colors flex items-center gap-1">
          View all
          <ArrowRight className="w-4 h-4" />
        </a>
      </div>
      <div className="space-y-4">
        {projects.map((project) => (
          <div
            key={project.title}
            className="bg-secondary border border-border rounded-lg p-4 hover:border-primary/50 transition-colors cursor-pointer"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="text-base font-semibold text-foreground mb-1">{project.title}</h4>
                <span className={`text-sm ${project.statusColor}`}>{project.status}</span>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                <span>{project.members} members</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>{project.dueDate}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
