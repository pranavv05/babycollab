import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import JobCard from "./job-card"
import ResumeScanner from "./resume-scanner"

const jobs = [
  {
    id: 1,
    title: "Frontend Developer",
    company: "TechCorp",
    location: "San Francisco, CA",
    type: "Full-time",
    salary: "$80,000 - $100,000",
    posted: "2 days ago",
    description:
      "We're looking for a Frontend Developer to join our team and help build responsive web applications using React and Next.js.",
    skills: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
    match: 98,
  },
  {
    id: 2,
    title: "React Developer",
    company: "InnovateTech",
    location: "Remote",
    type: "Full-time",
    salary: "$75,000 - $90,000",
    posted: "3 days ago",
    description:
      "Join our team to develop and maintain React applications for our clients in the finance and healthcare sectors.",
    skills: ["React", "Redux", "JavaScript", "CSS"],
    match: 95,
  },
  {
    id: 3,
    title: "Full Stack Engineer",
    company: "StartupX",
    location: "New York, NY",
    type: "Full-time",
    salary: "$90,000 - $110,000",
    posted: "1 week ago",
    description:
      "Looking for a Full Stack Engineer to work on our SaaS platform. You'll be responsible for both frontend and backend development.",
    skills: ["React", "Node.js", "MongoDB", "Express"],
    match: 90,
  },
  {
    id: 4,
    title: "UI/UX Developer",
    company: "DesignHub",
    location: "Remote",
    type: "Contract",
    salary: "$50 - $70 per hour",
    posted: "2 weeks ago",
    description:
      "We need a UI/UX Developer to create beautiful and functional user interfaces for our web and mobile applications.",
    skills: ["React", "Figma", "UI/UX Design", "CSS"],
    match: 85,
  },
  {
    id: 5,
    title: "Junior Web Developer",
    company: "TechStart",
    location: "Austin, TX",
    type: "Full-time",
    salary: "$60,000 - $75,000",
    posted: "3 days ago",
    description: "Great opportunity for a Junior Web Developer to join our growing team and work on exciting projects.",
    skills: ["HTML", "CSS", "JavaScript", "React"],
    match: 88,
  },
  {
    id: 6,
    title: "Frontend Intern",
    company: "WebSolutions",
    location: "Remote",
    type: "Internship",
    salary: "$20 - $25 per hour",
    posted: "1 day ago",
    description:
      "Looking for a Frontend Development Intern to join our team for a 3-month internship with possibility of full-time employment.",
    skills: ["HTML", "CSS", "JavaScript", "React"],
    match: 92,
  },
]

export default function JobsPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">AI Job Finder & Resume Scanner</h1>
          <p className="text-muted-foreground">Find the perfect job match and optimize your resume for success</p>
        </div>
      </div>

      <Tabs defaultValue="jobs" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="jobs">Job Recommendations</TabsTrigger>
          <TabsTrigger value="resume">Resume Scanner</TabsTrigger>
        </TabsList>

        <TabsContent value="jobs" className="space-y-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Search jobs by title, company, or skills..." className="w-full pl-8" />
            </div>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600">Find Jobs</Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="resume" className="space-y-6">
          <ResumeScanner />
        </TabsContent>
      </Tabs>
    </div>
  )
}

