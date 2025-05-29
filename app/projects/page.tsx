import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Filter, Plus, Search } from "lucide-react"
import ProjectCard from "./project-card"

const projects = [
  {
    id: 1,
    name: "AI Chatbot Assistant",
    description:
      "Building an AI-powered chatbot that can answer student queries about courses, assignments, and campus resources.",
    skills: ["Python", "NLP", "React", "Node.js"],
    members: 3,
    maxMembers: 5,
    leader: {
      name: "Alex Johnson",
      college: "University of Technology",
      semester: "6th Semester",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  },
  {
    id: 2,
    name: "E-Learning Platform",
    description:
      "Creating a comprehensive e-learning platform with video courses, quizzes, and progress tracking for students.",
    skills: ["React", "MongoDB", "Express", "Node.js"],
    members: 4,
    maxMembers: 6,
    leader: {
      name: "Priya Sharma",
      college: "Tech Institute",
      semester: "7th Semester",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  },
  {
    id: 3,
    name: "AR Campus Tour",
    description:
      "Developing an augmented reality app that provides interactive tours of the university campus for new students.",
    skills: ["Unity", "AR", "3D Modeling", "UI/UX"],
    members: 2,
    maxMembers: 4,
    leader: {
      name: "Michael Chen",
      college: "Design Academy",
      semester: "5th Semester",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  },
  {
    id: 4,
    name: "Student Marketplace",
    description:
      "Building a platform where students can buy, sell, or exchange textbooks, notes, and other academic resources.",
    skills: ["React", "Firebase", "JavaScript", "Tailwind"],
    members: 3,
    maxMembers: 5,
    leader: {
      name: "Sarah Williams",
      college: "Business School",
      semester: "4th Semester",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  },
  {
    id: 5,
    name: "Smart Study Planner",
    description:
      "Creating an AI-powered study planner that helps students organize their study schedule based on their learning patterns.",
    skills: ["Python", "Machine Learning", "React", "MongoDB"],
    members: 2,
    maxMembers: 4,
    leader: {
      name: "David Kim",
      college: "Tech University",
      semester: "8th Semester",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  },
  {
    id: 6,
    name: "Virtual Lab Simulator",
    description:
      "Developing a virtual laboratory simulator for science experiments that can be accessed remotely by students.",
    skills: ["Unity", "3D Modeling", "Physics Simulation", "WebGL"],
    members: 4,
    maxMembers: 6,
    leader: {
      name: "Emily Rodriguez",
      college: "Science Institute",
      semester: "Graduate",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  },
]

export default function ProjectsPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Projects</h1>
          <p className="text-muted-foreground">Discover projects or create your own to collaborate with others</p>
        </div>
        <Button className="bg-gradient-to-r from-blue-600 to-purple-600">
          <Plus className="mr-2 h-4 w-4" /> Create Project
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Search projects..." className="w-full pl-8" />
        </div>
        <div className="flex gap-2">
          <Select defaultValue="all">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Project Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Projects</SelectItem>
              <SelectItem value="web">Web Development</SelectItem>
              <SelectItem value="mobile">Mobile Apps</SelectItem>
              <SelectItem value="ai">AI & Machine Learning</SelectItem>
              <SelectItem value="design">UI/UX Design</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  )
}

