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
} from "lucide-react"
import Link from "next/link"
import { useState } from "react"

// Mock data for projects
const currentUserId = "1"

const projects = [
  {
    id: "1",
    title: "E-commerce Platform",
    description: "Building a full-stack e-commerce platform with Next.js and Stripe",
    fullDescription:
      "We're building a comprehensive e-commerce platform that includes product management, shopping cart, payment processing with Stripe, order tracking, and an admin dashboard. The platform will support multiple vendors and include features like product reviews, wishlists, and real-time inventory management.",
    status: "In Progress",
    statusColor: "text-warning",
    isMember: true,
    admin: { name: "Sarah Smith", avatar: "SS" },
    members: [
      { name: "John Doe", avatar: "JD" },
      { name: "Sarah Smith", avatar: "SS" },
      { name: "Mike Johnson", avatar: "MJ" },
      { name: "Emily Brown", avatar: "EB" },
    ],
    tasks: { todo: 8, inProgress: 5, done: 12 },
    dueDate: "2024-03-15",
    createdAt: "2024-01-10",
    skills: ["React", "Next.js", "Stripe", "PostgreSQL"],
    teamSize: 4,
    openPositions: 0,
    goals: ["Launch MVP by March", "Integrate payment gateway", "Build admin dashboard"],
  },
  {
    id: "2",
    title: "Mobile App Design",
    description: "UI/UX design for a fitness tracking mobile application",
    fullDescription:
      "Creating a modern, intuitive UI/UX design for a fitness tracking app that helps users monitor their workouts, nutrition, and progress. The design will include onboarding flows, workout tracking screens, progress dashboards, and social features for community engagement.",
    status: "Active",
    statusColor: "text-success",
    isMember: true,
    admin: { name: "Alex Chen", avatar: "AC" },
    members: [
      { name: "John Doe", avatar: "JD" },
      { name: "Alex Chen", avatar: "AC" },
      { name: "Lisa Wang", avatar: "LW" },
    ],
    tasks: { todo: 4, inProgress: 3, done: 8 },
    dueDate: "2024-03-08",
    createdAt: "2024-01-20",
    skills: ["Figma", "UI Design", "Prototyping"],
    teamSize: 3,
    openPositions: 0,
    goals: ["Complete wireframes", "Design high-fidelity mockups", "Create interactive prototype"],
  },
  {
    id: "3",
    title: "Data Analysis Project",
    description: "Analyzing customer behavior data using Python and machine learning",
    fullDescription:
      "A comprehensive data analysis project focused on understanding customer behavior patterns using advanced machine learning techniques. We'll analyze large datasets, build predictive models, and create visualizations to help businesses make data-driven decisions.",
    status: "Review",
    statusColor: "text-primary",
    isMember: true,
    admin: { name: "David Lee", avatar: "DL" },
    members: [
      { name: "John Doe", avatar: "JD" },
      { name: "David Lee", avatar: "DL" },
    ],
    tasks: { todo: 2, inProgress: 1, done: 15 },
    dueDate: "2024-03-01",
    createdAt: "2023-12-15",
    skills: ["Python", "Pandas", "Machine Learning"],
    teamSize: 2,
    openPositions: 0,
    goals: ["Clean and preprocess data", "Build ML models", "Create visualization dashboard"],
  },
  {
    id: "4",
    title: "Marketing Campaign",
    description: "Social media marketing campaign for product launch",
    fullDescription:
      "Planning and executing a comprehensive social media marketing campaign for a new product launch. This includes content creation, influencer partnerships, paid advertising, and analytics tracking across multiple platforms.",
    status: "Planning",
    statusColor: "text-muted-foreground",
    isMember: true,
    admin: { name: "Rachel Green", avatar: "RG" },
    members: [
      { name: "John Doe", avatar: "JD" },
      { name: "Rachel Green", avatar: "RG" },
      { name: "Tom Wilson", avatar: "TW" },
    ],
    tasks: { todo: 12, inProgress: 0, done: 3 },
    dueDate: "2024-04-01",
    createdAt: "2024-02-01",
    skills: ["Social Media", "Content Creation", "Analytics"],
    teamSize: 3,
    openPositions: 0,
    goals: ["Develop content calendar", "Create promotional materials", "Launch campaign"],
  },
  {
    id: "5",
    title: "AI Chatbot Development",
    description: "Building an intelligent customer service chatbot using GPT-4",
    fullDescription:
      "Developing an advanced AI-powered chatbot for customer service that can handle complex queries, provide personalized responses, and integrate with existing CRM systems. The chatbot will use GPT-4 for natural language understanding and generation.",
    status: "Active",
    statusColor: "text-success",
    isMember: false,
    admin: { name: "Sarah Smith", avatar: "SS" },
    members: [
      { name: "Sarah Smith", avatar: "SS" },
      { name: "Mike Johnson", avatar: "MJ" },
      { name: "Alex Chen", avatar: "AC" },
    ],
    tasks: { todo: 6, inProgress: 4, done: 10 },
    dueDate: "2024-03-20",
    createdAt: "2024-01-15",
    skills: ["AI", "Python", "OpenAI", "Node.js"],
    teamSize: 3,
    openPositions: 2,
    goals: ["Train chatbot on company data", "Integrate with CRM", "Deploy to production"],
  },
  {
    id: "6",
    title: "Blockchain Wallet App",
    description: "Secure cryptocurrency wallet with multi-chain support",
    fullDescription:
      "Building a secure, user-friendly cryptocurrency wallet that supports multiple blockchain networks. Features include secure key management, transaction history, portfolio tracking, and integration with popular DeFi protocols.",
    status: "In Progress",
    statusColor: "text-warning",
    isMember: false,
    admin: { name: "David Lee", avatar: "DL" },
    members: [
      { name: "David Lee", avatar: "DL" },
      { name: "Emily Brown", avatar: "EB" },
      { name: "Tom Wilson", avatar: "TW" },
      { name: "Lisa Wang", avatar: "LW" },
    ],
    tasks: { todo: 10, inProgress: 6, done: 8 },
    dueDate: "2024-04-15",
    createdAt: "2024-01-25",
    skills: ["Blockchain", "Web3", "React Native", "Solidity"],
    teamSize: 4,
    openPositions: 1,
    goals: ["Implement multi-chain support", "Add DeFi integrations", "Complete security audit"],
  },
  {
    id: "7",
    title: "Game Development - RPG",
    description: "Creating a 2D RPG game with Unity and C#",
    fullDescription:
      "Developing an engaging 2D role-playing game with rich storytelling, character progression, and combat mechanics. The game will feature hand-drawn art, original music, and a compelling narrative that keeps players engaged for hours.",
    status: "Active",
    statusColor: "text-success",
    isMember: false,
    admin: { name: "Chris Parker", avatar: "CP" },
    members: [
      { name: "Chris Parker", avatar: "CP" },
      { name: "Nina Rodriguez", avatar: "NR" },
      { name: "Kevin Zhang", avatar: "KZ" },
    ],
    tasks: { todo: 15, inProgress: 8, done: 12 },
    dueDate: "2024-06-30",
    createdAt: "2023-11-01",
    skills: ["Unity", "C#", "Game Design", "Pixel Art"],
    teamSize: 3,
    openPositions: 2,
    goals: ["Complete level design", "Implement combat system", "Add multiplayer features"],
  },
  {
    id: "8",
    title: "IoT Smart Home System",
    description: "Building an integrated smart home automation system",
    fullDescription:
      "Creating a comprehensive IoT solution for smart home automation that connects various devices and sensors. The system will include a mobile app for control, voice assistant integration, and automated routines based on user behavior patterns.",
    status: "Planning",
    statusColor: "text-muted-foreground",
    isMember: false,
    admin: { name: "James Wilson", avatar: "JW" },
    members: [
      { name: "James Wilson", avatar: "JW" },
      { name: "Sophia Martinez", avatar: "SM" },
    ],
    tasks: { todo: 20, inProgress: 2, done: 5 },
    dueDate: "2024-05-15",
    createdAt: "2024-02-10",
    skills: ["IoT", "Arduino", "React Native", "MQTT"],
    teamSize: 2,
    openPositions: 3,
    goals: ["Design device architecture", "Build mobile app", "Implement automation rules"],
  },
  {
    id: "9",
    title: "Healthcare Management Platform",
    description: "Patient management system for healthcare providers",
    fullDescription:
      "Developing a comprehensive healthcare management platform that helps medical professionals manage patient records, appointments, prescriptions, and billing. The system will be HIPAA compliant and include telemedicine capabilities.",
    status: "In Progress",
    statusColor: "text-warning",
    isMember: false,
    admin: { name: "Dr. Amanda Foster", avatar: "AF" },
    members: [
      { name: "Dr. Amanda Foster", avatar: "AF" },
      { name: "Robert Chen", avatar: "RC" },
      { name: "Maria Garcia", avatar: "MG" },
      { name: "Daniel Kim", avatar: "DK" },
    ],
    tasks: { todo: 12, inProgress: 7, done: 18 },
    dueDate: "2024-04-30",
    createdAt: "2023-12-01",
    skills: ["Healthcare IT", "HIPAA", "React", "PostgreSQL"],
    teamSize: 4,
    openPositions: 2,
    goals: ["Achieve HIPAA compliance", "Add telemedicine features", "Integrate with EHR systems"],
  },
  {
    id: "10",
    title: "E-Learning Platform",
    description: "Interactive online learning platform for students",
    fullDescription:
      "Building an engaging e-learning platform that offers interactive courses, video lectures, quizzes, and progress tracking. The platform will support multiple learning paths, gamification elements, and peer-to-peer collaboration.",
    status: "Active",
    statusColor: "text-success",
    isMember: false,
    admin: { name: "Prof. Michael Brown", avatar: "MB" },
    members: [
      { name: "Prof. Michael Brown", avatar: "MB" },
      { name: "Jessica Lee", avatar: "JL" },
      { name: "Andrew Taylor", avatar: "AT" },
    ],
    tasks: { todo: 10, inProgress: 5, done: 15 },
    dueDate: "2024-03-25",
    createdAt: "2024-01-05",
    skills: ["EdTech", "React", "Video Streaming", "MongoDB"],
    teamSize: 3,
    openPositions: 2,
    goals: ["Launch course marketplace", "Add live streaming", "Implement certification system"],
  },
  {
    id: "11",
    title: "Food Delivery App",
    description: "On-demand food delivery platform with real-time tracking",
    fullDescription:
      "Creating a modern food delivery application that connects restaurants, delivery drivers, and customers. Features include real-time order tracking, payment processing, restaurant management dashboard, and driver routing optimization.",
    status: "In Progress",
    statusColor: "text-warning",
    isMember: false,
    admin: { name: "Carlos Rodriguez", avatar: "CR" },
    members: [
      { name: "Carlos Rodriguez", avatar: "CR" },
      { name: "Emma Watson", avatar: "EW" },
      { name: "Ryan Cooper", avatar: "RC" },
      { name: "Olivia Davis", avatar: "OD" },
    ],
    tasks: { todo: 14, inProgress: 9, done: 11 },
    dueDate: "2024-04-20",
    createdAt: "2024-01-12",
    skills: ["React Native", "Node.js", "Google Maps API", "Stripe"],
    teamSize: 4,
    openPositions: 1,
    goals: ["Optimize delivery routing", "Add restaurant analytics", "Launch loyalty program"],
  },
  {
    id: "12",
    title: "Music Streaming Service",
    description: "Building a Spotify-like music streaming platform",
    fullDescription:
      "Developing a full-featured music streaming service with personalized playlists, social features, and artist tools. The platform will include music recommendation algorithms, offline playback, and integration with music labels.",
    status: "Planning",
    statusColor: "text-muted-foreground",
    isMember: false,
    admin: { name: "Sophie Anderson", avatar: "SA" },
    members: [
      { name: "Sophie Anderson", avatar: "SA" },
      { name: "Marcus Johnson", avatar: "MJ" },
    ],
    tasks: { todo: 25, inProgress: 3, done: 7 },
    dueDate: "2024-07-01",
    createdAt: "2024-02-05",
    skills: ["Audio Streaming", "React", "Python", "AWS"],
    teamSize: 2,
    openPositions: 4,
    goals: ["Build recommendation engine", "Secure music licensing", "Launch mobile apps"],
  },
]

export default function ProjectsPage() {
  const [activeTab, setActiveTab] = useState("my-projects")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedProject, setSelectedProject] = useState<(typeof projects)[0] | null>(null)
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const [selectedStatus, setSelectedStatus] = useState<string[]>([])
  const [teamSizeFilter, setTeamSizeFilter] = useState<string>("all")
  const [onlyOpenPositions, setOnlyOpenPositions] = useState(false)

  const myProjects = projects.filter((p) => p.isMember)
  const availableProjects = projects.filter((p) => !p.isMember)

  const allSkills = Array.from(new Set(availableProjects.flatMap((p) => p.skills))).sort()
  const allStatuses = Array.from(new Set(availableProjects.map((p) => p.status)))

  const filteredAvailableProjects = availableProjects.filter((p) => {
    // Search filter
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.skills.some((skill) => skill.toLowerCase().includes(searchQuery.toLowerCase()))

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

  const handleJoinRequest = (projectId: string, projectTitle: string) => {
    alert(`Join request sent for "${projectTitle}"! The admin will review your request.`)
    setSelectedProject(null)
  }

  return (
    <div className="min-h-screen bg-background">
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
                    {project.skills.map((skill, idx) => (
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
                      {project.members.slice(0, 4).map((member, idx) => (
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
                      <span>Due {new Date(project.dueDate).toLocaleDateString()}</span>
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
                      {project.skills.map((skill, idx) => (
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
                      {selectedProject.admin.avatar}
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Project Admin</p>
                      <p className="text-sm font-medium text-foreground">{selectedProject.admin.name}</p>
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
                <p className="text-sm text-muted-foreground leading-relaxed">{selectedProject.fullDescription}</p>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-foreground mb-3">Required Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedProject.skills.map((skill, idx) => (
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
                  {selectedProject.goals.map((goal, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>{goal}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-secondary rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Users className="w-4 h-4 text-primary" />
                    <h4 className="text-xs font-medium text-muted-foreground">Team Size</h4>
                  </div>
                  <p className="text-2xl font-bold text-foreground">{selectedProject.teamSize}</p>
                  <p className="text-xs text-muted-foreground mt-1">Current members</p>
                </div>

                <div className="bg-secondary rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <UserPlus className="w-4 h-4 text-success" />
                    <h4 className="text-xs font-medium text-muted-foreground">Open Positions</h4>
                  </div>
                  <p className="text-2xl font-bold text-foreground">{selectedProject.openPositions}</p>
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
                    <p className="text-xs text-muted-foreground">Started</p>
                    <p className="font-medium text-foreground">
                      {new Date(selectedProject.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Due Date</p>
                    <p className="font-medium text-foreground">
                      {new Date(selectedProject.dueDate).toLocaleDateString()}
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
