import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Filter, Plus, Search } from "lucide-react"
import SkillExchangeCard from "./skill-exchange-card"

const skillExchanges = [
  {
    id: 1,
    title: "React.js Mentoring",
    description:
      "Looking for someone to mentor me in React.js development. I have basic JavaScript knowledge and want to build interactive web applications.",
    offering: ["Python", "Data Analysis"],
    seeking: ["React.js", "Frontend Development"],
    experience: "Beginner",
    duration: "3 months",
    user: {
      name: "Alex Johnson",
      college: "University of Technology",
      semester: "4th Semester",
      avatar: "/placeholder.svg?height=40&width=40",
      rating: 4.8,
    },
  },
  {
    id: 2,
    title: "UI/UX Design for Mobile Apps",
    description:
      "I'm looking to learn UI/UX design principles specifically for mobile applications. Can offer programming skills in exchange.",
    offering: ["Java", "Android Development"],
    seeking: ["UI/UX Design", "Figma"],
    experience: "Intermediate",
    duration: "2 months",
    user: {
      name: "Priya Sharma",
      college: "Design Institute",
      semester: "6th Semester",
      avatar: "/placeholder.svg?height=40&width=40",
      rating: 4.5,
    },
  },
  {
    id: 3,
    title: "Machine Learning Basics",
    description:
      "Seeking someone to teach me the fundamentals of machine learning and help me with my first ML project.",
    offering: ["Web Development", "Database Design"],
    seeking: ["Machine Learning", "Python for ML"],
    experience: "Beginner",
    duration: "4 months",
    user: {
      name: "Michael Chen",
      college: "Tech University",
      semester: "5th Semester",
      avatar: "/placeholder.svg?height=40&width=40",
      rating: 4.9,
    },
  },
  {
    id: 4,
    title: "Cloud Computing & AWS",
    description: "Looking to learn AWS services and cloud architecture. Can teach mobile app development in exchange.",
    offering: ["Flutter", "Dart", "Mobile Development"],
    seeking: ["AWS", "Cloud Architecture"],
    experience: "Intermediate",
    duration: "3 months",
    user: {
      name: "Sarah Williams",
      college: "Engineering College",
      semester: "7th Semester",
      avatar: "/placeholder.svg?height=40&width=40",
      rating: 4.7,
    },
  },
  {
    id: 5,
    title: "Blockchain Development",
    description:
      "Interested in learning blockchain development and smart contracts. Can offer full-stack web development skills.",
    offering: ["MERN Stack", "JavaScript"],
    seeking: ["Blockchain", "Solidity"],
    experience: "Beginner",
    duration: "5 months",
    user: {
      name: "David Kim",
      college: "Tech Institute",
      semester: "8th Semester",
      avatar: "/placeholder.svg?height=40&width=40",
      rating: 4.6,
    },
  },
  {
    id: 6,
    title: "Game Development with Unity",
    description: "Want to learn game development using Unity. Can teach 3D modeling and animation in exchange.",
    offering: ["Blender", "3D Modeling", "Animation"],
    seeking: ["Unity", "C#", "Game Development"],
    experience: "Intermediate",
    duration: "4 months",
    user: {
      name: "Emily Rodriguez",
      college: "Digital Arts Academy",
      semester: "6th Semester",
      avatar: "/placeholder.svg?height=40&width=40",
      rating: 4.8,
    },
  },
]

export default function SkillsPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Skill Exchange</h1>
          <p className="text-muted-foreground">
            Find peers to learn from and teach skills in a collaborative environment
          </p>
        </div>
        <Button className="bg-gradient-to-r from-blue-600 to-purple-600">
          <Plus className="mr-2 h-4 w-4" /> Request Skill Exchange
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Search skills..." className="w-full pl-8" />
        </div>
        <div className="flex gap-2">
          <Select defaultValue="all">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Skill Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="programming">Programming</SelectItem>
              <SelectItem value="design">Design</SelectItem>
              <SelectItem value="data">Data Science</SelectItem>
              <SelectItem value="business">Business</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="all">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Experience Level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="beginner">Beginner</SelectItem>
              <SelectItem value="intermediate">Intermediate</SelectItem>
              <SelectItem value="advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {skillExchanges.map((exchange) => (
          <SkillExchangeCard key={exchange.id} exchange={exchange} />
        ))}
      </div>
    </div>
  )
}

