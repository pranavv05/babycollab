"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@clerk/nextjs"
import {
  ArrowLeft,
  Users,
  Calendar,
  Plus,
  MoreVertical,
  MessageSquare,
  Paperclip,
  Send,
  UserPlus,
  CheckCircle,
  XCircle,
  Download,
  Loader2,
  AlertCircle,
} from "lucide-react"
import { ProjectChat } from "@/components/project-chat"
import { FileSharing } from "@/components/file-sharing"

export default function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const [projectData, setProjectData] = useState<any>(null)
  const [tasks, setTasks] = useState({
    todo: [],
    inProgress: [],
    done: [],
  })
  const [newTaskColumn, setNewTaskColumn] = useState<string | null>(null)
  const [newTaskTitle, setNewTaskTitle] = useState("")
  const [assigningTask, setAssigningTask] = useState<string | null>(null)
  const [selectedAssignee, setSelectedAssignee] = useState<string>("")
  // Removed unused state for chat implementation
  const [hasRequestedJoin, setHasRequestedJoin] = useState(false)
  const [pendingRequests, setPendingRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [isMember, setIsMember] = useState(false)

  const { userId } = useAuth();
  
  // Fetch project data from the API
  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true)
        const { id } = await params;
        const res = await fetch(`/api/projects/${id}`, {
          credentials: 'include'
        })
        if (!res.ok) {
          throw new Error('Failed to fetch project')
        }
        const data = await res.json()
        setProjectData(data)
        // Set pending requests from the fetched data
        setPendingRequests(data.pendingRequests || [])
        // Set admin and member status based on actual data
        setIsAdmin(data.adminId === userId)
        setIsMember(data.members?.some((member: any) => member.id === userId) || false)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    if (userId) {
      fetchProject()
    }
  }, [params, userId])

  const addTask = (column: keyof typeof tasks) => {
    if (newTaskTitle.trim()) {
      const newTask = {
        id: Date.now().toString(),
        title: newTaskTitle,
        assignee: "PM",
        assigneeName: "Project Member",
      }
      setTasks({
        ...tasks,
        [column]: [...(tasks[column] as any), newTask],
      })
      setNewTaskTitle("")
      setNewTaskColumn(null)
    }
  }

  const assignTask = (taskId: string, column: keyof typeof tasks) => {
    if (selectedAssignee && projectData) {
      const member = projectData.members.find((m: any) => m.id === selectedAssignee)
      if (member) {
        setTasks({
          ...tasks,
          [column]: (tasks[column] as any).map((task: any) =>
            task.id === taskId ? { ...task, assignee: member.avatar, assigneeName: member.name } : task,
          ),
        })
        setAssigningTask(null)
        setSelectedAssignee("")
      }
    }
  }

  // Removed unused functions for chat implementation

  const requestToJoin = async () => {
    try {
      const { id } = await params;
      const res = await fetch(`/api/projects/${id}/join`, {
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
            alert('You are already a member of this project.');
          } else if (errorData.error === "You have already submitted a join request for this project") {
            alert('You have already submitted a join request for this project. Please wait for the admin to review your request.');
          } else {
            alert(errorData.error || 'Failed to submit join request. Please try again.');
          }
        } else {
          alert('Failed to submit join request. Please try again.');
        }
        return;
      }
      
      setHasRequestedJoin(true)
    } catch (err) {
      alert('Failed to submit join request. Please try again.')
    }
  }

  const approveRequest = async (requestId: string) => {
    try {
      const { id } = await params;
      const res = await fetch(`/api/projects/${id}/join-requests/${requestId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'accept' }),
        credentials: 'include'
      });
      
      if (!res.ok) {
        throw new Error('Failed to approve request');
      }
      
      // Remove the approved request from the list
      setPendingRequests(pendingRequests.filter((r: any) => r.id !== requestId));
    } catch (err) {
      alert('Failed to approve request. Please try again.');
    }
  }

  const rejectRequest = async (requestId: string) => {
    try {
      const { id } = await params;
      const res = await fetch(`/api/projects/${id}/join-requests/${requestId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'reject' }),
        credentials: 'include'
      });
      
      if (!res.ok) {
        throw new Error('Failed to reject request');
      }
      
      // Remove the rejected request from the list
      setPendingRequests(pendingRequests.filter((r: any) => r.id !== requestId));
    } catch (err) {
      alert('Failed to reject request. Please try again.');
    }
  }

  const handleDeleteProject = async () => {
    if (!projectData) return;
    
    // Confirm with user before deleting
    const confirmed = window.confirm(`Are you sure you want to delete the project "${projectData.title}"? This action cannot be undone.`);
    
    if (confirmed) {
      try {
        const { id } = await params;
        const res = await fetch(`/api/projects/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include'
        });
        
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || 'Failed to delete project');
        }
        
        // Show success message and redirect to projects page
        alert('Project deleted successfully!');
        router.push('/projects?tab=my-projects');
      } catch (err) {
        console.error('Error deleting project:', err);
        alert('Failed to delete project. Please try again.');
      }
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
      <div className="min-h-screen bg-background">
        <nav className="border-b border-border bg-card">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-8">
              <Link href="/" className="text-2xl font-bold text-primary">
                Baby Collab
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/projects"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Projects
              </Link>
            </div>
          </div>
        </nav>
        
        <main className="max-w-4xl mx-auto px-6 py-16">
          <div className="bg-card border border-border rounded-lg p-12 text-center">
            <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
            <h2 className="text-xl font-bold text-foreground mb-2">Error Loading Project</h2>
            <p className="text-muted-foreground mb-4">{error}</p>
            <button 
              type="button"
              onClick={() => window.location.reload()}
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Retry
            </button>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background ml-64">
      {/* Navigation */}
      <nav className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-2xl font-bold text-primary">
              Baby Collab
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/projects"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Projects
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Project Header */}
        <div className="bg-card border border-border rounded-lg p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-foreground mb-2">{projectData.title}</h1>
              <p className="text-muted-foreground">{projectData.description}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs bg-warning/10 text-warning px-3 py-1 rounded border border-warning/20">
                {projectData.status}
              </span>
              {isAdmin && (
                <button
                  type="button"
                  onClick={handleDeleteProject}
                  className="text-destructive hover:text-destructive/80 transition-colors"
                  title="Delete Project"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 6h18" />
                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                    <line x1="10" x2="10" y1="11" y2="17" />
                    <line x1="14" x2="14" y1="11" y2="17" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>Due {projectData.dueDate ? new Date(projectData.dueDate).toLocaleDateString() : 'N/A'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>{projectData.members?.length || 0} members</span>
            </div>
          </div>
        </div>

        {!isMember && !isAdmin && (
          <div className="bg-card border border-border rounded-lg p-6 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-1">Join this project</h3>
                <p className="text-sm text-muted-foreground">Request to join this project to collaborate with the team.</p>
              </div>
              <button
                type="button"
                onClick={requestToJoin}
                disabled={hasRequestedJoin}
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                <UserPlus className="w-4 h-4" />
                {hasRequestedJoin ? 'Request Sent' : 'Request to Join'}
              </button>
            </div>
          </div>
        )}

        {isAdmin && pendingRequests.length > 0 && (
          <div className="bg-card border border-warning/50 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-warning" />
              Pending Join Requests ({pendingRequests.length})
            </h3>
            <div className="space-y-3">
              {(pendingRequests as any).map((request: any) => (
                <div key={request.id} className="flex items-center justify-between bg-secondary rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-medium">
                      {request.avatarUrl ? (
                        <img 
                          src={request.avatarUrl} 
                          alt={request.name} 
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        request.avatar
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {request.name}
                        {request.userId && (
                          <Link 
                            href={`/profile/${request.userId}`} 
                            className="ml-2 text-xs text-primary hover:underline"
                          >
                            View Profile
                          </Link>
                        )}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Requested {new Date(request.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => approveRequest(request.id)}
                      className="bg-success/10 hover:bg-success/20 text-success px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Approve
                    </button>
                    <button
                      type="button"
                      onClick={() => rejectRequest(request.id)}
                      className="bg-destructive/10 hover:bg-destructive/20 text-destructive px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1"
                    >
                      <XCircle className="w-4 h-4" />
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Task Board */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* To Do Column */}
              <div className="bg-card border border-border rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-foreground">To Do</h3>
                  {isAdmin && (
                    <button
                      type="button"
                      onClick={() => setNewTaskColumn("todo")}
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <div className="space-y-2">
                  {(tasks.todo as any).map((task: any) => (
                    <div key={task.id} className="bg-secondary border border-border rounded-lg p-3 group">
                      <div className="flex items-start justify-between mb-2">
                        <p className="text-sm text-foreground flex-1">{task.title}</p>
                        {isAdmin && (
                          <button
                            type="button"
                            onClick={() => setAssigningTask(task.id)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <MoreVertical className="w-4 h-4 text-muted-foreground" />
                          </button>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs">
                          {task.assignee}
                        </div>
                        <span className="text-xs text-muted-foreground">{task.assigneeName}</span>
                      </div>
                      {isAdmin && assigningTask === task.id && (
                        <div className="mt-2 pt-2 border-t border-border">
                          <select
                            value={selectedAssignee}
                            onChange={(e) => setSelectedAssignee(e.target.value)}
                            className="w-full bg-background border border-border rounded px-2 py-1 text-xs text-foreground mb-2"
                          >
                            <option value="">Assign to...</option>
                            {projectData.members?.map((member: any) => (
                              <option key={member.id} value={member.id}>
                                {member.name}
                              </option>
                            ))}
                          </select>
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => assignTask(task.id, "todo")}
                              className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded"
                            >
                              Assign
                            </button>
                            <button
                              type="button"
                              onClick={() => setAssigningTask(null)}
                              className="text-xs text-muted-foreground hover:text-foreground"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                  {isAdmin && newTaskColumn === "todo" && (
                    <div className="bg-secondary border border-primary rounded-lg p-3">
                      <input
                        type="text"
                        value={newTaskTitle}
                        onChange={(e) => setNewTaskTitle(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            e.stopPropagation();
                            addTask("todo");
                          }
                        }}
                        placeholder="Task title..."
                        className="w-full bg-transparent text-sm text-foreground focus:outline-none mb-2"
                        autoFocus
                      />
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => addTask("todo")}
                          className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded"
                        >
                          Add
                        </button>
                        <button
                          type="button"
                          onClick={() => setNewTaskColumn(null)}
                          className="text-xs text-muted-foreground hover:text-foreground"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* In Progress Column */}
              <div className="bg-card border border-border rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-foreground">In Progress</h3>
                  {isAdmin && (
                    <button
                      type="button"
                      onClick={() => setNewTaskColumn("inProgress")}
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <div className="space-y-2">
                  {(tasks.inProgress as any).map((task: any) => (
                    <div key={task.id} className="bg-secondary border border-warning/50 rounded-lg p-3 group">
                      <div className="flex items-start justify-between mb-2">
                        <p className="text-sm text-foreground flex-1">{task.title}</p>
                        {isAdmin && (
                          <button
                            type="button"
                            onClick={() => setAssigningTask(task.id)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <MoreVertical className="w-4 h-4 text-muted-foreground" />
                          </button>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs">
                          {task.assignee}
                        </div>
                        <span className="text-xs text-muted-foreground">{task.assigneeName}</span>
                      </div>
                      {isAdmin && assigningTask === task.id && (
                        <div className="mt-2 pt-2 border-t border-border">
                          <select
                            value={selectedAssignee}
                            onChange={(e) => setSelectedAssignee(e.target.value)}
                            className="w-full bg-background border border-border rounded px-2 py-1 text-xs text-foreground mb-2"
                          >
                            <option value="">Assign to...</option>
                            {projectData.members?.map((member: any) => (
                              <option key={member.id} value={member.id}>
                                {member.name}
                              </option>
                            ))}
                          </select>
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => assignTask(task.id, "inProgress")}
                              className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded"
                            >
                              Assign
                            </button>
                            <button
                              type="button"
                              onClick={() => setAssigningTask(null)}
                              className="text-xs text-muted-foreground hover:text-foreground"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                  {isAdmin && newTaskColumn === "inProgress" && (
                    <div className="bg-secondary border border-primary rounded-lg p-3">
                      <input
                        type="text"
                        value={newTaskTitle}
                        onChange={(e) => setNewTaskTitle(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            e.stopPropagation();
                            addTask("inProgress");
                          }
                        }}
                        placeholder="Task title..."
                        className="w-full bg-transparent text-sm text-foreground focus:outline-none mb-2"
                        autoFocus
                      />
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => addTask("inProgress")}
                          className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded"
                        >
                          Add
                        </button>
                        <button
                          type="button"
                          onClick={() => setNewTaskColumn(null)}
                          className="text-xs text-muted-foreground hover:text-foreground"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Done Column */}
              <div className="bg-card border border-border rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-foreground">Done</h3>
                  {isAdmin && (
                    <button
                      type="button"
                      onClick={() => setNewTaskColumn("done")}
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <div className="space-y-2">
                  {(tasks.done as any).map((task: any) => (
                    <div
                      key={task.id}
                      className="bg-secondary border border-success/50 rounded-lg p-3 group opacity-75"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <p className="text-sm text-foreground flex-1 line-through">{task.title}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs">
                          {task.assignee}
                        </div>
                        <span className="text-xs text-muted-foreground">{task.assigneeName}</span>
                      </div>
                    </div>
                  ))}
                  {isAdmin && newTaskColumn === "done" && (
                    <div className="bg-secondary border border-primary rounded-lg p-3">
                      <input
                        type="text"
                        value={newTaskTitle}
                        onChange={(e) => setNewTaskTitle(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            e.stopPropagation();
                            addTask("done");
                          }
                        }}
                        placeholder="Task title..."
                        className="w-full bg-transparent text-sm text-foreground focus:outline-none mb-2"
                        autoFocus
                      />
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => addTask("done")}
                          className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded"
                        >
                          Add
                        </button>
                        <button
                          type="button"
                          onClick={() => setNewTaskColumn(null)}
                          className="text-xs text-muted-foreground hover:text-foreground"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Chat Section */}
            <ProjectChat projectId={projectData.id} />
            
            {/* Files Section */}
            <FileSharing projectId={projectData.id} />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Team Members */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Team Members</h3>
              <div className="space-y-3">
                {projectData.members?.map((member: any) => (
                  <div key={member.id} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-medium">
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
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{member.name}</p>
                      <p className="text-xs text-muted-foreground capitalize">{member.role}</p>
                    </div>
                  </div>
                ))}
                {isAdmin && (
                  <button type="button" className="w-full mt-4 bg-secondary hover:bg-secondary/80 text-foreground px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2">
                    <Plus className="w-4 h-4" />
                    Invite Member
                  </button>
                )}
              </div>
            </div>

            {/* Project Files Preview */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Project Files</h3>
              {projectData.files && projectData.files.length > 0 ? (
                <div className="space-y-3">
                  {projectData.files.slice(0, 3).map((file: any) => (
                    <div key={file.id} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                        <Paperclip className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{file.name}</p>
                        <p className="text-xs text-muted-foreground">{file.size}</p>
                      </div>
                    </div>
                  ))}
                  {projectData.files.length > 3 && (
                    <p className="text-xs text-muted-foreground text-center mt-2">
                      +{projectData.files.length - 3} more files
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No files uploaded yet</p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}