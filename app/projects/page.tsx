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
  Menu,
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
  const [isFiltersOpen, setIsFiltersOpen] = useState(false)

  // Fetch projects from the API
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true)
        const res = await fetch(`/api/projects?type=${activeTab === "my-projects" ? "member" : "discover"}`, {
          credentials: 'include'
        })
        if (!res.ok) {
          throw new Error('Failed to fetch projects')
        }
        const data = await res.json()
        console.log('Fetched projects data:', data) // Debug log
        setProjects(data)
      } catch (err) {
        console.error('Error fetching projects:', err) // Debug log
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [activeTab])

  // For "my-projects" tab, all projects from the API are already filtered to be member projects
  // For "all-projects" tab, all projects from the API are already filtered to be non-member projects
  const myProjects = activeTab === "my-projects" ? projects : []
  const availableProjects = activeTab === "all-projects" ? projects : []

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

    // Additional filter to ensure we only show recruiting projects
    const isRecruiting = p.isRecruiting !== false

    // Filter out completed projects
    const isNotCompleted = p.status.toLowerCase() !== 'completed'

    return matchesSearch && matchesSkills && matchesStatus && matchesTeamSize && matchesOpenPositions && isRecruiting && isNotCompleted
  })

  const displayedProjects = activeTab === "my-projects" ? myProjects : filteredAvailableProjects

  // Add a function to refresh projects
  const refreshProjects = async () => {
    try {
      setLoading(true)
      const res = await fetch(`/api/projects?type=${activeTab === "my-projects" ? "member" : "discover"}`, {
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
  // Fixed the active projects calculation to be case-insensitive
  const activeProjects = displayedProjects.filter((p) => 
    p.status.toLowerCase() === "active" || 
    p.status.toLowerCase() === "in progress"
  ).length
  const totalTasks = 0

  const handleJoinRequest = async (projectId: string, projectTitle: string) => {
    try {
      const res = await fetch(`/api/projects/${projectId}/join`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      })
      
      const responseData = await res.json();
      
      if (!res.ok) {
        if (res.status === 400) {
          // Handle specific error cases
          if (responseData.error === "You are already a member of this project") {
            alert(`You are already a member of "${projectTitle}".`);
          } else if (responseData.error === "You have already submitted a join request for this project") {
            alert(`You have already submitted a join request for "${projectTitle}". Please wait for the admin to review your request.`);
          } else if (responseData.error === "You have already been accepted to this project") {
            alert(`You have already been accepted to "${projectTitle}".`);
          } else if (responseData.error === "Project not found") {
            alert(`The project "${projectTitle}" was not found.`);
          } else {
            alert(responseData.error || 'Failed to submit join request. Please try again.');
          }
        } else if (res.status === 401) {
          alert('You must be logged in to join a project.');
        } else {
          alert('Failed to submit join request. Please try again.');
        }
        return;
      }
      
      alert(`Join request sent for "${projectTitle}"! The admin will review your request.`)
      setSelectedProject(null)
      
      // Refresh the projects list to update the UI
      refreshProjects();
    } catch (err) {
      console.error('Error submitting join request:', err)
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
            onClick={() => {
              setError(null);
              // Refetch projects instead of full page reload
              const fetchProjects = async () => {
                try {
                  setLoading(true)
                  const res = await fetch(`/api/projects?type=${activeTab === "my-projects" ? "member" : "discover"}`, {
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
            }}
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background lg:ml-64">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-1">Projects</h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              {activeTab === "my-projects" ? "Collaborate and build together" : "Discover and join exciting projects"}
            </p>
          </div>
          <Link
            href="/projects/create"
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 sm:px-6 sm:py-3 rounded-lg font-medium transition-colors flex items-center gap-2 whitespace-nowrap"
          >
            <Plus className="w-5 h-5" />
            <span className="hidden xs:inline">New Project</span>
            <span className="xs:hidden">New</span>
          </Link>
        </div>

        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div className="inline-flex bg-card border border-border rounded-lg p-1">
              <button
                onClick={() => setActiveTab("my-projects")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === "my-projects"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                My Projects
              </button>
              <button
                onClick={() => setActiveTab("all-projects")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === "all-projects"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Discover Projects
              </button>
            </div>
            <button
              onClick={refreshProjects}
              className="flex items-center gap-2 bg-card hover:bg-card/80 border border-border text-foreground px-3 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
          </div>
        </div>

        {activeTab === "all-projects" && (
          <div className="mb-6 space-y-4">
            {/* Completely blank the filter section for Discover Projects */}
            <div className="bg-card border border-border rounded-lg p-8 sm:p-12 text-center">
              <Search className="w-10 h-10 sm:w-12 sm:h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Project Discovery Temporarily Unavailable
              </h3>
              <p className="text-sm text-muted-foreground mb-4 sm:mb-6">
                The project discovery feature is currently unavailable. Please check back later.
              </p>
            </div>
          </div>
        )}

        {activeTab === "my-projects" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div className="bg-card border border-border rounded-lg p-4 sm:p-6">
              <div className="flex items-center gap-3 mb-2">
                <Users className="w-5 h-5 text-primary" />
                <h3 className="text-sm font-medium text-muted-foreground">My Projects</h3>
              </div>
              <p className="text-2xl sm:text-3xl font-bold text-foreground">{totalProjects}</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-4 sm:p-6">
              <div className="flex items-center gap-3 mb-2">
                <AlertCircle className="w-5 h-5 text-warning" />
                <h3 className="text-sm font-medium text-muted-foreground">Active Projects</h3>
              </div>
              <p className="text-2xl sm:text-3xl font-bold text-foreground">{activeProjects}</p>
            </div>
          </div>
        )}

        {activeTab === "my-projects" ? (
          displayedProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {displayedProjects.map((project) => (
                <Link
                  key={project.id}
                  href={`/projects/${project.id}`}
                  className="bg-card border border-border rounded-lg p-4 sm:p-6 hover:border-primary/50 transition-all group"
                >
                  <div className="flex items-start justify-between mb-3 sm:mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                        {project.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">{project.description}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 sm:gap-2 mb-3 sm:mb-4">
                    {project.skills.slice(0, 3).map((skill: string, idx: number) => (
                      <span
                        key={idx}
                        className="text-xs bg-primary/10 text-primary px-2 py-1 rounded border border-primary/20"
                      >
                        {skill}
                      </span>
                    ))}
                    {project.skills.length > 3 && (
                      <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded">
                        +{project.skills.length - 3} more
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 mb-3 sm:mb-4">
                    <div className="flex -space-x-2">
                      {project.members.slice(0, 3).map((member: any, idx: number) => (
                        <div
                          key={idx}
                          className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-primary/20 border-2 border-card flex items-center justify-center text-primary text-xs font-medium"
                          title={member.name}
                        >
                          {member.avatar && typeof member.avatar === 'string' && member.avatar.startsWith('data:image') ? (
                            <img 
                              src={member.avatar} 
                              alt={member.name} 
                              className="w-full h-full rounded-full object-cover"
                            />
                          ) : (
                            member.avatar
                          )}
                        </div>
                      ))}
                    </div>
                    <span className="text-xs text-muted-foreground">{project.members.length} members</span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>Due {project.dueDate ? new Date(project.dueDate).toLocaleDateString() : 'N/A'}</span>
                    </div>
                    <span className={`text-xs font-medium ${project.statusColor}`}>{project.status}</span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="bg-card border border-border rounded-lg p-8 sm:p-12 text-center">
              <Users className="w-10 h-10 sm:w-12 sm:h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No projects yet</h3>
              <p className="text-sm text-muted-foreground mb-4 sm:mb-6">Create your first project or join existing ones</p>
              <Link
                href="/projects/create"
                className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 sm:px-6 sm:py-3 rounded-lg font-medium transition-colors"
              >
                <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                Create Project
              </Link>
            </div>
          )
        ) : (
          <div className="bg-card border border-border rounded-lg p-8 sm:p-12 text-center">
            <Search className="w-10 h-10 sm:w-12 sm:h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No available projects
            </h3>
            <p className="text-sm text-muted-foreground mb-4 sm:mb-6">
              There are no projects available for discovery at the moment.
            </p>
          </div>
        )}
      </main>

      {/* Project Detail Modal */}
      {selectedProject && activeTab !== "all-projects" && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-card border-b border-border p-4 sm:p-6 flex items-start justify-between">
              <div className="flex-1">
                <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2">{selectedProject.title}</h2>
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-sm font-medium">
                      {selectedProject.admin?.avatar && typeof selectedProject.admin.avatar === 'string' && selectedProject.admin.avatar.startsWith('data:image') ? (
                        <img 
                          src={selectedProject.admin.avatar} 
                          alt={selectedProject.admin.name} 
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        selectedProject.admin?.avatar || 'A'
                      )}
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Project Admin</p>
                      <p className="text-sm font-medium text-foreground">{selectedProject.admin?.name || 'Unknown'}</p>
                    </div>
                  </div>
                  {selectedProject.admin?.id && (
                    <Link 
                      href={`/profile/${selectedProject.admin.id}`} 
                      className="text-xs text-primary hover:underline hidden sm:block"
                    >
                      View Profile
                    </Link>
                  )}
                </div>
              </div>
              <button
                onClick={() => setSelectedProject(null)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
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

              <div className="grid grid-cols-3 gap-2 sm:gap-4">
                <div className="bg-secondary rounded-lg p-2 text-center">
                  <p className="text-xs text-muted-foreground mb-1">Team Size</p>
                  <p className="text-sm font-semibold text-foreground">{selectedProject.teamSize || 1}</p>
                </div>
                <div className="bg-secondary rounded-lg p-2 text-center">
                  <p className="text-xs text-muted-foreground mb-1">Members</p>
                  <p className="text-sm font-semibold text-foreground">{selectedProject.members?.length || 0}</p>
                </div>
                <div className="bg-secondary rounded-lg p-2 text-center">
                  <p className="text-xs text-muted-foreground mb-1">Skills</p>
                  <p className="text-sm font-semibold text-foreground">{selectedProject.skills?.length || 0}</p>
                </div>
              </div>

              <div className="bg-secondary rounded-lg p-3 sm:p-4">
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
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-3 sm:px-6 sm:py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2"
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