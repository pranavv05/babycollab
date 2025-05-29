import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckCircle, ChevronRight, Code, Download, FileText, Lightbulb, Lock, Star } from "lucide-react"

const careerPaths = [
  {
    id: 1,
    title: "Frontend Developer",
    description: "Specialize in creating user interfaces and experiences for web applications.",
    skills: ["HTML/CSS", "JavaScript", "React", "UI/UX"],
    difficulty: "Beginner-Friendly",
    timeToComplete: "6-12 months",
    popularity: 95,
  },
  {
    id: 2,
    title: "Backend Developer",
    description: "Focus on server-side logic, databases, and application architecture.",
    skills: ["Node.js", "Python", "Databases", "API Design"],
    difficulty: "Intermediate",
    timeToComplete: "8-14 months",
    popularity: 92,
  },
  {
    id: 3,
    title: "Full Stack Developer",
    description: "Master both frontend and backend development for end-to-end solutions.",
    skills: ["Frontend", "Backend", "DevOps", "Architecture"],
    difficulty: "Advanced",
    timeToComplete: "12-18 months",
    popularity: 97,
  },
  {
    id: 4,
    title: "Data Scientist",
    description: "Analyze and interpret complex data to help organizations make better decisions.",
    skills: ["Python", "Statistics", "Machine Learning", "Data Visualization"],
    difficulty: "Intermediate",
    timeToComplete: "10-16 months",
    popularity: 90,
  },
  {
    id: 5,
    title: "DevOps Engineer",
    description: "Bridge development and operations to improve deployment frequency and reliability.",
    skills: ["CI/CD", "Cloud Services", "Containerization", "Infrastructure as Code"],
    difficulty: "Advanced",
    timeToComplete: "10-16 months",
    popularity: 88,
  },
  {
    id: 6,
    title: "Mobile App Developer",
    description: "Create applications for iOS and Android platforms using native or cross-platform frameworks.",
    skills: ["React Native", "Flutter", "Swift", "Kotlin"],
    difficulty: "Intermediate",
    timeToComplete: "8-14 months",
    popularity: 85,
  },
]

const frontendRoadmap = [
  {
    id: 1,
    title: "HTML & CSS Fundamentals",
    description: "Learn the building blocks of web development with HTML structure and CSS styling.",
    duration: "4 weeks",
    status: "completed",
    progress: 100,
    resources: [
      { title: "HTML & CSS Crash Course", type: "Course" },
      { title: "CSS Flexbox & Grid Guide", type: "Tutorial" },
      { title: "Responsive Web Design", type: "Project" },
    ],
  },
  {
    id: 2,
    title: "JavaScript Essentials",
    description: "Master JavaScript fundamentals including variables, functions, DOM manipulation, and ES6+ features.",
    duration: "6 weeks",
    status: "in-progress",
    progress: 65,
    resources: [
      { title: "JavaScript Fundamentals", type: "Course" },
      { title: "ES6+ Features Deep Dive", type: "Tutorial" },
      { title: "Interactive Web App", type: "Project" },
    ],
  },
  {
    id: 3,
    title: "React Framework",
    description: "Learn component-based architecture, state management, and building SPAs with React.",
    duration: "8 weeks",
    status: "not-started",
    progress: 0,
    resources: [
      { title: "React Fundamentals", type: "Course" },
      { title: "State Management with Redux", type: "Tutorial" },
      { title: "E-commerce Frontend", type: "Project" },
    ],
  },
  {
    id: 4,
    title: "Advanced Frontend Concepts",
    description: "Explore performance optimization, accessibility, testing, and advanced patterns.",
    duration: "6 weeks",
    status: "not-started",
    progress: 0,
    resources: [
      { title: "Frontend Performance Optimization", type: "Course" },
      { title: "Web Accessibility Guidelines", type: "Tutorial" },
      { title: "Testing with Jest & React Testing Library", type: "Project" },
    ],
  },
  {
    id: 5,
    title: "Frontend Career Preparation",
    description: "Prepare for interviews, build your portfolio, and develop job-ready skills.",
    duration: "4 weeks",
    status: "not-started",
    progress: 0,
    resources: [
      { title: "Frontend Interview Prep", type: "Course" },
      { title: "Portfolio Development", type: "Tutorial" },
      { title: "Technical Resume Workshop", type: "Workshop" },
    ],
  },
]

export default function RoadmapPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Career Roadmap Generator</h1>
          <p className="text-muted-foreground">Personalized learning paths to help you achieve your career goals</p>
        </div>
        <Button className="bg-gradient-to-r from-blue-600 to-purple-600">
          <Download className="mr-2 h-4 w-4" />
          Export Your Roadmap
        </Button>
      </div>

      <Tabs defaultValue="explore" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="explore">Explore Paths</TabsTrigger>
          <TabsTrigger value="my-roadmap">My Roadmap</TabsTrigger>
          <TabsTrigger value="progress">My Progress</TabsTrigger>
        </TabsList>

        <TabsContent value="explore" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {careerPaths.map((path) => (
              <Card key={path.id} className="overflow-hidden transition-all hover:shadow-lg">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{path.title}</CardTitle>
                    <Badge
                      className={
                        path.difficulty === "Beginner-Friendly"
                          ? "bg-green-600"
                          : path.difficulty === "Intermediate"
                            ? "bg-blue-600"
                            : "bg-purple-600"
                      }
                    >
                      {path.difficulty}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="mb-4">{path.description}</CardDescription>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium mb-2">Key Skills:</p>
                      <div className="flex flex-wrap gap-2">
                        {path.skills.map((skill) => (
                          <Badge key={skill} variant="secondary" className="font-normal">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Time to Complete:</span>
                      <span className="font-medium">{path.timeToComplete}</span>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Popularity</span>
                        <span className="text-sm font-medium flex items-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          {path.popularity}%
                        </span>
                      </div>
                      <Progress value={path.popularity} className="h-2" />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-4">
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600">View Roadmap</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="my-roadmap" className="space-y-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold">Frontend Developer Roadmap</h2>
              <p className="text-muted-foreground">Your personalized learning path</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-green-500"></div>
                <span className="text-sm">Completed</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                <span className="text-sm">In Progress</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-gray-300 dark:bg-gray-700"></div>
                <span className="text-sm">Not Started</span>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {frontendRoadmap.map((step, index) => (
              <Card
                key={step.id}
                className={`overflow-hidden transition-all ${
                  step.status === "completed"
                    ? "border-green-500 bg-green-50 dark:bg-green-950/20"
                    : step.status === "in-progress"
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-950/20"
                      : ""
                }`}
              >
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-full ${
                          step.status === "completed"
                            ? "bg-green-500 text-white"
                            : step.status === "in-progress"
                              ? "bg-blue-500 text-white"
                              : "bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                        }`}
                      >
                        {step.status === "completed" ? <CheckCircle className="h-5 w-5" /> : <span>{index + 1}</span>}
                      </div>
                      <CardTitle className="text-lg">{step.title}</CardTitle>
                    </div>
                    <Badge
                      variant={
                        step.status === "completed"
                          ? "default"
                          : step.status === "in-progress"
                            ? "secondary"
                            : "outline"
                      }
                    >
                      {step.status === "completed"
                        ? "Completed"
                        : step.status === "in-progress"
                          ? "In Progress"
                          : "Not Started"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="mb-4">{step.description}</CardDescription>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Estimated Duration:</span>
                      <span className="font-medium">{step.duration}</span>
                    </div>
                    {step.status !== "not-started" && (
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Progress</span>
                          <span className="text-sm font-medium">{step.progress}%</span>
                        </div>
                        <Progress value={step.progress} className="h-2" />
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-medium mb-2">Learning Resources:</p>
                      <div className="space-y-2">
                        {step.resources.map((resource, i) => (
                          <div key={i} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {resource.type === "Course" ? (
                                <Code className="h-4 w-4 text-blue-600" />
                              ) : resource.type === "Tutorial" ? (
                                <FileText className="h-4 w-4 text-purple-600" />
                              ) : (
                                <Lightbulb className="h-4 w-4 text-amber-600" />
                              )}
                              <span className="text-sm">{resource.title}</span>
                            </div>
                            <Badge variant="outline">{resource.type}</Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-4">
                  <Button
                    className={`w-full ${
                      step.status === "completed"
                        ? "bg-green-600 hover:bg-green-700"
                        : step.status === "in-progress"
                          ? "bg-gradient-to-r from-blue-600 to-purple-600"
                          : "bg-gray-300 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                    }`}
                    disabled={step.status === "not-started"}
                  >
                    {step.status === "completed" ? (
                      "Review Materials"
                    ) : step.status === "in-progress" ? (
                      "Continue Learning"
                    ) : (
                      <div className="flex items-center gap-1">
                        <Lock className="h-4 w-4" />
                        <span>Locked</span>
                      </div>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="progress" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Overall Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center">
                  <div className="relative h-32 w-32 mb-4">
                    <svg viewBox="0 0 100 100" className="h-full w-full">
                      <circle cx="50" cy="50" r="45" fill="none" stroke="#e2e8f0" strokeWidth="10" />
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="url(#progress-gradient)"
                        strokeWidth="10"
                        strokeDasharray="283"
                        strokeDashoffset="113"
                        transform="rotate(-90 50 50)"
                      />
                      <defs>
                        <linearGradient id="progress-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#3b82f6" />
                          <stop offset="100%" stopColor="#8b5cf6" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center text-2xl font-bold">60%</div>
                  </div>
                  <p className="text-center text-muted-foreground">
                    You're making great progress on your Frontend Developer roadmap!
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Skills Acquired</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">HTML</span>
                      <span className="text-sm text-muted-foreground">95%</span>
                    </div>
                    <Progress value={95} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">CSS</span>
                      <span className="text-sm text-muted-foreground">90%</span>
                    </div>
                    <Progress value={90} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">JavaScript</span>
                      <span className="text-sm text-muted-foreground">65%</span>
                    </div>
                    <Progress value={65} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">React</span>
                      <span className="text-sm text-muted-foreground">20%</span>
                    </div>
                    <Progress value={20} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Next Steps</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                      <ChevronRight className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Complete JavaScript Essentials</p>
                      <p className="text-xs text-muted-foreground">Estimated 2 weeks remaining</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                      <ChevronRight className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Start React Framework module</p>
                      <p className="text-xs text-muted-foreground">Unlocks in 2 weeks</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                      <ChevronRight className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Complete Interactive Web App project</p>
                      <p className="text-xs text-muted-foreground">Due in 1 week</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Customize Your Roadmap</CardTitle>
              <CardDescription>Adjust your learning path based on your goals and preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Career Path</label>
                  <Select defaultValue="frontend">
                    <SelectTrigger>
                      <SelectValue placeholder="Select a career path" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="frontend">Frontend Developer</SelectItem>
                      <SelectItem value="backend">Backend Developer</SelectItem>
                      <SelectItem value="fullstack">Full Stack Developer</SelectItem>
                      <SelectItem value="data">Data Scientist</SelectItem>
                      <SelectItem value="devops">DevOps Engineer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Experience Level</label>
                  <Select defaultValue="beginner">
                    <SelectTrigger>
                      <SelectValue placeholder="Select your experience level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Learning Pace</label>
                  <Select defaultValue="moderate">
                    <SelectTrigger>
                      <SelectValue placeholder="Select your learning pace" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="relaxed">Relaxed (5-10 hrs/week)</SelectItem>
                      <SelectItem value="moderate">Moderate (10-15 hrs/week)</SelectItem>
                      <SelectItem value="intensive">Intensive (15+ hrs/week)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4 flex justify-end">
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600">Update Roadmap</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

