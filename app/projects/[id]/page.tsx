"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
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
} from "lucide-react"

const currentUser = {
  id: "1",
  name: "John Doe",
  avatar: "JD",
  role: "admin", // admin, member, or null (not joined)
}

const projectData = {
  id: "1",
  title: "E-commerce Platform",
  description: "Building a full-stack e-commerce platform with Next.js and Stripe integration",
  status: "In Progress",
  dueDate: "2024-03-15",
  adminId: "1",
  members: [
    { id: "1", name: "John Doe", avatar: "JD", role: "admin" },
    { id: "2", name: "Sarah Smith", avatar: "SS", role: "member" },
    { id: "3", name: "Mike Johnson", avatar: "MJ", role: "member" },
    { id: "4", name: "Emily Brown", avatar: "EB", role: "member" },
  ],
  pendingRequests: [
    { id: "5", name: "Alex Turner", avatar: "AT", requestedAt: "2024-02-10" },
    { id: "6", name: "Maria Garcia", avatar: "MG", requestedAt: "2024-02-11" },
  ],
  files: [
    { name: "Design_Mockups.fig", size: "2.4 MB", uploadedBy: "Emily Brown" },
    { name: "API_Documentation.pdf", size: "1.1 MB", uploadedBy: "Mike Johnson" },
  ],
}

const initialTasks = {
  todo: [
    { id: "1", title: "Design product detail page", assignee: "EB", assigneeName: "Emily Brown" },
    { id: "2", title: "Implement search functionality", assignee: "SS", assigneeName: "Sarah Smith" },
    { id: "3", title: "Set up payment gateway", assignee: "MJ", assigneeName: "Mike Johnson" },
  ],
  inProgress: [
    { id: "4", title: "Build shopping cart component", assignee: "SS", assigneeName: "Sarah Smith" },
    { id: "5", title: "Create database schema", assignee: "MJ", assigneeName: "Mike Johnson" },
  ],
  done: [
    { id: "6", title: "Set up project repository", assignee: "JD", assigneeName: "John Doe" },
    { id: "7", title: "Design homepage layout", assignee: "EB", assigneeName: "Emily Brown" },
    { id: "8", title: "Configure Next.js project", assignee: "SS", assigneeName: "Sarah Smith" },
  ],
}

const initialMessages = [
  {
    id: "1",
    userId: "1",
    userName: "John Doe",
    userAvatar: "JD",
    message: "Hey team! Let's discuss the payment integration approach.",
    timestamp: "2024-02-10T10:30:00",
    type: "text",
  },
  {
    id: "2",
    userId: "3",
    userName: "Mike Johnson",
    userAvatar: "MJ",
    message: "I think we should use Stripe Connect for multi-vendor support.",
    timestamp: "2024-02-10T10:35:00",
    type: "text",
  },
  {
    id: "3",
    userId: "4",
    userName: "Emily Brown",
    userAvatar: "EB",
    message: "Here are the updated mockups",
    timestamp: "2024-02-10T11:00:00",
    type: "file",
    fileName: "checkout_flow_v2.fig",
    fileSize: "3.2 MB",
  },
  {
    id: "4",
    userId: "2",
    userName: "Sarah Smith",
    userAvatar: "SS",
    message: "Looks great! I'll start implementing the frontend components.",
    timestamp: "2024-02-10T11:15:00",
    type: "text",
  },
]

export default function ProjectDetailPage() {
  const [tasks, setTasks] = useState(initialTasks)
  const [newTaskColumn, setNewTaskColumn] = useState<string | null>(null)
  const [newTaskTitle, setNewTaskTitle] = useState("")
  const [assigningTask, setAssigningTask] = useState<string | null>(null)
  const [selectedAssignee, setSelectedAssignee] = useState<string>("")

  const [messages, setMessages] = useState(initialMessages)
  const [newMessage, setNewMessage] = useState("")

  const [hasRequestedJoin, setHasRequestedJoin] = useState(false)
  const [pendingRequests, setPendingRequests] = useState(projectData.pendingRequests)

  const isAdmin = currentUser.role === "admin"
  const isMember = currentUser.role === "member" || currentUser.role === "admin"

  const addTask = (column: keyof typeof tasks) => {
    if (newTaskTitle.trim()) {
      const newTask = {
        id: Date.now().toString(),
        title: newTaskTitle,
        assignee: "JD",
        assigneeName: "John Doe",
      }
      setTasks({
        ...tasks,
        [column]: [...tasks[column], newTask],
      })
      setNewTaskTitle("")
      setNewTaskColumn(null)
    }
  }

  const assignTask = (taskId: string, column: keyof typeof tasks) => {
    if (selectedAssignee) {
      const member = projectData.members.find((m) => m.id === selectedAssignee)
      if (member) {
        setTasks({
          ...tasks,
          [column]: tasks[column].map((task) =>
            task.id === taskId ? { ...task, assignee: member.avatar, assigneeName: member.name } : task,
          ),
        })
        setAssigningTask(null)
        setSelectedAssignee("")
      }
    }
  }

  const sendMessage = () => {
    if (newMessage.trim()) {
      const message = {
        id: Date.now().toString(),
        userId: currentUser.id,
        userName: currentUser.name,
        userAvatar: currentUser.avatar,
        message: newMessage,
        timestamp: new Date().toISOString(),
        type: "text" as const,
      }
      setMessages([...messages, message])
      setNewMessage("")
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const message = {
        id: Date.now().toString(),
        userId: currentUser.id,
        userName: currentUser.name,
        userAvatar: currentUser.avatar,
        message: `Shared a file: ${file.name}`,
        timestamp: new Date().toISOString(),
        type: "file" as const,
        fileName: file.name,
        fileSize: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
      }
      setMessages([...messages, message])
    }
  }

  const requestToJoin = () => {
    setHasRequestedJoin(true)
    // In real app, this would send a request to the backend
  }

  const approveRequest = (requestId: string) => {
    setPendingRequests(pendingRequests.filter((r) => r.id !== requestId))
    // In real app, this would update the backend
  }

  const rejectRequest = (requestId: string) => {
    setPendingRequests(pendingRequests.filter((r) => r.id !== requestId))
    // In real app, this would update the backend
  }

  if (!isMember) {
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
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-6">
              <Users className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-4">{projectData.title}</h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">{projectData.description}</p>

            <div className="flex items-center justify-center gap-6 mb-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>{projectData.members.length} members</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>Due {new Date(projectData.dueDate).toLocaleDateString()}</span>
              </div>
            </div>

            {!hasRequestedJoin ? (
              <button
                onClick={requestToJoin}
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 rounded-lg font-medium transition-colors inline-flex items-center gap-2"
              >
                <UserPlus className="w-5 h-5" />
                Request to Join Project
              </button>
            ) : (
              <div className="bg-warning/10 border border-warning/20 rounded-lg p-4 max-w-md mx-auto">
                <p className="text-warning font-medium">Request Pending</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Your request to join this project is pending approval from the admin.
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
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
            <span className="text-xs bg-warning/10 text-warning px-3 py-1 rounded border border-warning/20">
              {projectData.status}
            </span>
          </div>

          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>Due {new Date(projectData.dueDate).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>{projectData.members.length} members</span>
            </div>
          </div>
        </div>

        {isAdmin && pendingRequests.length > 0 && (
          <div className="bg-card border border-warning/50 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-warning" />
              Pending Join Requests ({pendingRequests.length})
            </h3>
            <div className="space-y-3">
              {pendingRequests.map((request) => (
                <div key={request.id} className="flex items-center justify-between bg-secondary rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-medium">
                      {request.avatar}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{request.name}</p>
                      <p className="text-xs text-muted-foreground">
                        Requested {new Date(request.requestedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => approveRequest(request.id)}
                      className="bg-success/10 hover:bg-success/20 text-success px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Approve
                    </button>
                    <button
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Task Board */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-2xl font-bold text-foreground">Task Board</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* To Do Column */}
              <div className="bg-card border border-border rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-foreground">To Do</h3>
                  {isAdmin && (
                    <button
                      onClick={() => setNewTaskColumn("todo")}
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <div className="space-y-2">
                  {tasks.todo.map((task) => (
                    <div key={task.id} className="bg-secondary border border-border rounded-lg p-3 group">
                      <div className="flex items-start justify-between mb-2">
                        <p className="text-sm text-foreground flex-1">{task.title}</p>
                        {isAdmin && (
                          <button
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
                            {projectData.members.map((member) => (
                              <option key={member.id} value={member.id}>
                                {member.name}
                              </option>
                            ))}
                          </select>
                          <div className="flex gap-2">
                            <button
                              onClick={() => assignTask(task.id, "todo")}
                              className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded"
                            >
                              Assign
                            </button>
                            <button
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
                        onKeyDown={(e) => e.key === "Enter" && addTask("todo")}
                        placeholder="Task title..."
                        className="w-full bg-transparent text-sm text-foreground focus:outline-none mb-2"
                        autoFocus
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => addTask("todo")}
                          className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded"
                        >
                          Add
                        </button>
                        <button
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
                      onClick={() => setNewTaskColumn("inProgress")}
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <div className="space-y-2">
                  {tasks.inProgress.map((task) => (
                    <div key={task.id} className="bg-secondary border border-warning/50 rounded-lg p-3 group">
                      <div className="flex items-start justify-between mb-2">
                        <p className="text-sm text-foreground flex-1">{task.title}</p>
                        {isAdmin && (
                          <button
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
                            {projectData.members.map((member) => (
                              <option key={member.id} value={member.id}>
                                {member.name}
                              </option>
                            ))}
                          </select>
                          <div className="flex gap-2">
                            <button
                              onClick={() => assignTask(task.id, "inProgress")}
                              className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded"
                            >
                              Assign
                            </button>
                            <button
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
                        onKeyDown={(e) => e.key === "Enter" && addTask("inProgress")}
                        placeholder="Task title..."
                        className="w-full bg-transparent text-sm text-foreground focus:outline-none mb-2"
                        autoFocus
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => addTask("inProgress")}
                          className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded"
                        >
                          Add
                        </button>
                        <button
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
                      onClick={() => setNewTaskColumn("done")}
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <div className="space-y-2">
                  {tasks.done.map((task) => (
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
                        onKeyDown={(e) => e.key === "Enter" && addTask("done")}
                        placeholder="Task title..."
                        className="w-full bg-transparent text-sm text-foreground focus:outline-none mb-2"
                        autoFocus
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => addTask("done")}
                          className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded"
                        >
                          Add
                        </button>
                        <button
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

            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <MessageSquare className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold text-foreground">Team Chat</h3>
              </div>

              {/* Messages */}
              <div className="space-y-4 mb-4 max-h-96 overflow-y-auto">
                {messages.map((msg) => (
                  <div key={msg.id} className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-medium flex-shrink-0">
                      {msg.userAvatar}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-baseline gap-2 mb-1">
                        <span className="text-sm font-medium text-foreground">{msg.userName}</span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                      {msg.type === "text" ? (
                        <p className="text-sm text-muted-foreground">{msg.message}</p>
                      ) : (
                        <div className="bg-secondary border border-border rounded-lg p-3 inline-block">
                          <div className="flex items-center gap-2">
                            <Paperclip className="w-4 h-4 text-primary" />
                            <div>
                              <p className="text-sm text-foreground font-medium">{msg.fileName}</p>
                              <p className="text-xs text-muted-foreground">{msg.fileSize}</p>
                            </div>
                            <button className="ml-2 text-primary hover:text-primary/80">
                              <Download className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <div className="flex gap-2">
                <input type="file" id="file-upload" className="hidden" onChange={handleFileUpload} />
                <label
                  htmlFor="file-upload"
                  className="bg-secondary hover:bg-secondary/80 border border-border rounded-lg px-3 py-2 cursor-pointer transition-colors"
                >
                  <Paperclip className="w-5 h-5 text-muted-foreground" />
                </label>
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  placeholder="Type a message..."
                  className="flex-1 bg-secondary border border-border rounded-lg px-4 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                  onClick={sendMessage}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg transition-colors"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Team Members */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Team Members</h3>
              <div className="space-y-3">
                {projectData.members.map((member) => (
                  <div key={member.id} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-medium">
                      {member.avatar}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{member.name}</p>
                      <p className="text-xs text-muted-foreground capitalize">{member.role}</p>
                    </div>
                  </div>
                ))}
                {isAdmin && (
                  <button className="w-full mt-4 bg-secondary hover:bg-secondary/80 text-foreground px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2">
                    <Plus className="w-4 h-4" />
                    Invite Member
                  </button>
                )}
              </div>
            </div>

            {/* Project Files */}
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">Files</h3>
                <button className="text-muted-foreground hover:text-primary transition-colors">
                  <Paperclip className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-2">
                {projectData.files.map((file, idx) => (
                  <div key={idx} className="bg-secondary rounded-lg p-3">
                    <p className="text-sm text-foreground font-medium mb-1">{file.name}</p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{file.size}</span>
                      <span>{file.uploadedBy}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
