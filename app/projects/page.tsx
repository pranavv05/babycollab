"use client"

import {
  Plus,
  Users,
  Clock,
  CheckCircle2,
  AlertCircle,
  UserPlus,
  Search,
  X,
  Calendar,
  Target,
  Filter,
  Loader2,
} from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useSearchParams } from 'next/navigation'

export default function ProjectsPage() {
  const searchParams = useSearchParams()
  const initialTab = searchParams.get('tab') || "my-projects"
  
  const [activeTab, setActiveTab] = useState(initialTab)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedProject, setSelectedProject] = useState<any | null>(null)
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const [selectedStatus, setSelectedStatus] = useState<string[]>([])
  const [teamSizeFilter, setTeamSizeFilter] = useState<string>("all")
  const [onlyOpenPositions, setOnlyOpenPositions] = useState(false)
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch projects from the API
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true)
        const res = await fetch('/api/projects', {
          credentials: 'include'
        })
        if (!res.ok) {
          throw new Error('Failed to fetch projects')
        }
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

  const myProjects = projects.filter((p) => p.isMember)
  const availableProjects = projects.filter((p) => !p.isMember)

  const allSkills = Array.from(new Set(availableProjects.flatMap((p) => p.skills))).sort()
  const allStatuses = Array.from(new Set(availableProjects.map((p) => p.status)))

  const filteredAvailableProjects = availableProjects.filter((p) => {
    // Search filter
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.skills.some((skill: string) => skill.toLowerCase().includes(searchQuery.toLowerCase()))

    // Skills filter
    const matchesSkills = selectedSkills.length === 0 || selectedSkills.some((skill) => p.skills.includes(skill))

    // Status filter
    const matchesStatus = selectedStatus.length === 0 || selectedStatus.includes(p.status)

    // Team size filter
    const matchesTeamSize =
      teamSizeFilter === "all" ||
      (teamSizeFilter === "small" && p.teamSize <= 2) ||
      (teamSizeFilter === "medium" && p.teamSize >= 3 && p.teamSize <= 4) ||
      (teamSizeFilter === "large" && p.teamSize >= 5)

    // Open positions filter
    const matchesOpenPositions = !onlyOpenPositions || p.openPositions > 0

    return matchesSearch && matchesSkills && matchesStatus && matchesTeamSize && matchesOpenPositions
  })

  const displayedProjects = activeTab === "my-projects" ? myProjects : filteredAvailableProjects

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) => (prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]))
  }

  const toggleStatus = (status: string) => {
    setSelectedStatus((prev) => (prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status]))
  }

  const clearFilters = () => {
    setSelectedSkills([])
    setSelectedStatus([])
    setTeamSizeFilter("all")
    setOnlyOpenPositions(false)
    setSearchQuery("")
  }

  const hasActiveFilters =
    selectedSkills.length > 0 ||
    selectedStatus.length > 0 ||
    teamSizeFilter !== "all" ||
    onlyOpenPositions ||
    searchQuery

  const totalProjects = displayedProjects.length
  const activeProjects = displayedProjects.filter((p) => p.status === "Active" || p.status === "In Progress").length
  const totalTasks = myProjects.reduce((acc, p) => acc + p.tasks.todo + p.tasks.inProgress + p.tasks.done, 0)

  const handleJoinRequest = async (projectId: string, projectTitle: string) => {
    try {
      const res = await fetch(`/api/projects/${projectId}/join`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      })
      
      if (!res.ok) {
        const errorData = await res.json();
        if (res.status === 400) {
          // Handle specific error cases
          if (errorData.error === "You are already a member of this project") {
            alert(`You are already a member of "${projectTitle}".`);
          } else if (errorData.error === "You have already submitted a join request for this project") {
            alert(`You have already submitted a join request for "${projectTitle}". Please wait for the admin to review your request.`);
          } else {
            alert(errorData.error || 'Failed to submit join request. Please try again.');
          }
        } else {
          alert('Failed to submit join request. Please try again.');
        }
        return;
      }
      
      alert(`Join request sent for "${projectTitle}"! The admin will review your request.`)
      setSelectedProject(null)
    } catch (err) {
      alert('Failed to submit join request. Please try again.')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
          <h2 className="text-xl font-bold text-foreground mb-2">Error Loading Projects</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background ml-64">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Projects</h1>
            <p className="text-lg text-muted-foreground">
              {activeTab === "my-projects" ? "Collaborate and build together" : "Discover and join exciting projects"}
            </p>
          </div>
          <Link
            href="/projects/create"
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            New Project
          </Link>
        </div>

        <div className="mb-8">
          <div className="inline-flex bg-card border border-border rounded-lg p-1">
            <button
              onClick={() => setActiveTab("my-projects")}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === "my-projects"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              My Projects ({myProjects.length})
            </button>
            <button
              onClick={() => setActiveTab("all-projects")}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === "all-projects"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Discover Projects ({availableProjects.length})
            </button>
          </div>
        </div>

        {activeTab === "all-projects" && (
          <div className="mb-8 space-y-4">
            {/* Search Bar */}
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search projects by name, description, or skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-card border border-border rounded-lg pl-10 pr-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>

            {/* Filters Section */}
            <div className="bg-card border border-border rounded-lg p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-primary" />
                  <h3 className="text-sm font-semibold text-foreground">Filters</h3>
                  {hasActiveFilters && (
                    <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                      {[
                        selectedSkills.length,
                        selectedStatus.length,
                        teamSizeFilter !== "all" ? 1 : 0,
                        onlyOpenPositions ? 1 : 0,
                      ].reduce((a, b) => a + b, 0)}{" "}
                      active
                    </span>
                  )}
                </div>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="text-xs text-primary hover:text-primary/80 font-medium transition-colors"
                  >
                    Clear all
                  </button>
                )}
              </div>

              {/* Skills Filter */}
              <div>
                <h4 className="text-xs font-medium text-muted-foreground mb-2">Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {allSkills.map((skill) => (
                    <button
                      key={skill}
                      onClick={() => toggleSkill(skill)}
                      className={`text-xs px-3 py-1.5 rounded border transition-all ${
                        selectedSkills.includes(skill)
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-secondary text-foreground border-border hover:border-primary/50"
                      }`}
                    >
                      {skill}
                    </button>
                  ))}
                </div>
              </div>

              {/* Status Filter */}
              <div>
                <h4 className="text-xs font-medium text-muted-foreground mb-2">Status</h4>
                <div className="flex flex-wrap gap-2">
                  {allStatuses.map((status) => (
                    <button
                      key={status}
                      onClick={() => toggleStatus(status)}
                      className={`text-xs px-3 py-1.5 rounded border transition-all ${
                        selectedStatus.includes(status)
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-secondary text-foreground border-border hover:border-primary/50"
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              {/* Team Size Filter */}
              <div>
                <h4 className="text-xs font-medium text-muted-foreground mb-2">Team Size</h4>
                <div className="flex gap-2">
                  {[
                    { value: "all", label: "All Sizes" },
                    { value: "small", label: "Small (1-2)" },
                    { value: "medium", label: "Medium (3-4)" },
                    { value: "large", label: "Large (5+)" },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setTeamSizeFilter(option.value)}
                      className={`text-xs px-3 py-1.5 rounded border transition-all ${
                        teamSizeFilter === option.value
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-secondary text-foreground border-border hover:border-primary/50"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Open Positions Toggle */}
              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={onlyOpenPositions}
                    onChange={(e) => setOnlyOpenPositions(e.target.checked)}
                    className="w-4 h-4 rounded border-border text-primary focus:ring-2 focus:ring-primary/50"
                  />
                  <span className="text-sm text-foreground">Only show projects with open positions</span>
                </label>
              </div>
            </div>
          </div>
        )}

        {activeTab === "my-projects" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center gap-3 mb-2">
                <Users className="w-5 h-5 text-primary" />
                <h3 className="text-sm font-medium text-muted-foreground">My Projects</h3>
              </div>
              <p className="text-3xl font-bold text-foreground">{totalProjects}</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center gap-3 mb-2">
                <AlertCircle className="w-5 h-5 text-warning" />
                <h3 className="text-sm font-medium text-muted-foreground">Active Projects</h3>
              </div>
              <p className="text-3xl font-bold text-foreground">{activeProjects}</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center gap-3 mb-2">
                <CheckCircle2 className="w-5 h-5 text-success" />
                <h3 className="text-sm font-medium text-muted-foreground">Total Tasks</h3>
              </div>
              <p className="text-3xl font-bold text-foreground">{totalTasks}</p>
            </div>
          </div>
        )}

        {activeTab === "my-projects" ? (
          displayedProjects.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {displayedProjects.map((project) => (
                <Link
                  key={project.id}
                  href={`/projects/${project.id}`}
                  className="bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition-all group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                        {project.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">{project.description}</p>
                    </div>
                    <span className={`text-xs font-medium ${project.statusColor} ml-4`}>{project.status}</span>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.skills.map((skill: string, idx: number) => (
                      <span
                        key={idx}
                        className="text-xs bg-primary/10 text-primary px-2 py-1 rounded border border-primary/20"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex -space-x-2">
                      {project.members.slice(0, 4).map((member: any, idx: number) => (
                        <div
                          key={idx}
                          className="w-8 h-8 rounded-full bg-primary/20 border-2 border-card flex items-center justify-center text-primary text-xs font-medium"
                          title={member.name}
                        >
                          {member.avatar}
                        </div>
                      ))}
                    </div>
                    <span className="text-xs text-muted-foreground">{project.members.length} members</span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 mb-4">
                    <div className="bg-secondary rounded-lg p-2 text-center">
                      <p className="text-xs text-muted-foreground mb-1">To Do</p>
                      <p className="text-sm font-semibold text-foreground">{project.tasks.todo}</p>
                    </div>
                    <div className="bg-secondary rounded-lg p-2 text-center">
                      <p className="text-xs text-muted-foreground mb-1">In Progress</p>
                      <p className="text-sm font-semibold text-warning">{project.tasks.inProgress}</p>
                    </div>
                    <div className="bg-secondary rounded-lg p-2 text-center">
                      <p className="text-xs text-muted-foreground mb-1">Done</p>
                      <p className="text-sm font-semibold text-success">{project.tasks.done}</p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>Due {project.dueDate ? new Date(project.dueDate).toLocaleDateString() : 'N/A'}</span>
                    </div>
                    <span>Created {new Date(project.createdAt).toLocaleDateString()}</span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="bg-card border border-border rounded-lg p-12 text-center">
              <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No projects yet</h3>
              <p className="text-sm text-muted-foreground mb-6">Create your first project or join existing ones</p>
              <Link
                href="/projects/create"
                className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-lg font-medium transition-colors"
              >
                <Plus className="w-5 h-5" />
                Create Project
              </Link>
            </div>
          )
        ) : displayedProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedProjects.map((project) => (
              <button
                key={project.id}
                onClick={() => setSelectedProject(project)}
                className="bg-card border border-border rounded-lg overflow-hidden hover:border-primary/50 transition-all group flex flex-col text-left"
              >
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                    {project.title}
                  </h3>

                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed line-clamp-3 flex-1">
                    {project.description}
                  </p>

                  <div className="mb-4">
                    <h4 className="text-xs font-medium text-muted-foreground mb-2">Required Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {project.skills.map((skill: string, idx: number) => (
                        <span
                          key={idx}
                          className="text-sm bg-primary/10 text-primary px-3 py-1.5 rounded border border-primary/20"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm text-muted-foreground pt-4 border-t border-border">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      <span>{project.members.length} members</span>
                    </div>
                    {project.openPositions > 0 && (
                      <span className="text-sm bg-success/10 text-success px-2 py-1.5 rounded border border-success/20">
                        {project.openPositions} open positions
                      </span>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="bg-card border border-border rounded-lg p-12 text-center">
            <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              {hasActiveFilters ? "No projects match your filters" : "No available projects"}
            </h3>
            <p className="text-sm text-muted-foreground mb-6">
              {hasActiveFilters
                ? "Try adjusting your filters or search terms"
                : "All projects have been joined or there are no projects available at the moment"}
            </p>
            {hasActiveFilters && (
              <button onClick={clearFilters} className="text-primary hover:text-primary/80 text-sm font-medium">
                Clear all filters
              </button>
            )}
          </div>
        )}
      </main>

      {/* Project Detail Modal */}
      {selectedProject && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-card border-b border-border p-6 flex items-start justify-between">
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-foreground mb-2">{selectedProject.title}</h2>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-sm font-medium">
                      {selectedProject.admin?.avatar || 'A'}
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Project Admin</p>
                      <p className="text-sm font-medium text-foreground">{selectedProject.admin?.name || 'Unknown'}</p>
                    </div>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedProject(null)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                  <Target className="w-4 h-4 text-primary" />
                  Project Description
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{selectedProject.fullDescription || selectedProject.description}</p>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-foreground mb-3">Required Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedProject.skills.map((skill: string, idx: number) => (
                    <span
                      key={idx}
                      className="text-sm bg-primary/10 text-primary px-3 py-1.5 rounded border border-primary/20"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-foreground mb-3">Project Goals</h3>
                <ul className="space-y-2">
                  {(selectedProject.goals && selectedProject.goals.length > 0) ? (
                    selectedProject.goals.map((goal: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <span>{goal}</span>
                      </li>
                    ))
                  ) : (
                    <li className="text-sm text-muted-foreground">No goals specified for this project</li>
                  )}
                </ul>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-secondary rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Users className="w-4 h-4 text-primary" />
                    <h4 className="text-xs font-medium text-muted-foreground">Team Size</h4>
                  </div>
                  <p className="text-2xl font-bold text-foreground">{selectedProject.teamSize || 1}</p>
                  <p className="text-xs text-muted-foreground mt-1">Current members</p>
                </div>

                <div className="bg-secondary rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <UserPlus className="w-4 h-4 text-success" />
                    <h4 className="text-xs font-medium text-muted-foreground">Open Positions</h4>
                  </div>
                  <p className="text-2xl font-bold text-foreground">{selectedProject.openPositions || 0}</p>
                  <p className="text-xs text-muted-foreground mt-1">Available spots</p>
                </div>
              </div>

              <div className="bg-secondary rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-4 h-4 text-primary" />
                  <h4 className="text-xs font-medium text-muted-foreground">Timeline</h4>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div>
                    <p className="text-xs text-muted-foreground">Created</p>
                    <p className="font-medium text-foreground">
                      {new Date(selectedProject.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Due Date</p>
                    <p className="font-medium text-foreground">
                      {selectedProject.dueDate ? new Date(selectedProject.dueDate).toLocaleDateString() : 'Not set'}
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleJoinRequest(selectedProject.id, selectedProject.title)}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2"
              >
                <UserPlus className="w-5 h-5" />
                Request to Join Project
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}