import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Award, Edit, Github, Linkedin, Mail, MapPin, Star, Twitter } from "lucide-react"
import Link from "next/link"

export default function ProfilePage() {
  return (
    <div className="container mx-auto py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column - Profile Info */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="relative pb-0">
              <div className="absolute right-4 top-4">
                <Button variant="ghost" size="icon">
                  <Edit className="h-4 w-4" />
                  <span className="sr-only">Edit Profile</span>
                </Button>
              </div>
              <div className="flex flex-col items-center">
                <Avatar className="h-24 w-24">
                  <AvatarImage src="/placeholder.svg?height=96&width=96" alt="John Doe" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <CardTitle className="mt-4 text-xl">John Doe</CardTitle>
                <CardDescription className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  <span>San Francisco, CA</span>
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="flex justify-center gap-2 mb-6">
                <Button variant="outline" size="sm" className="h-8 w-8 p-0" asChild>
                  <Link href="https://github.com">
                    <Github className="h-4 w-4" />
                    <span className="sr-only">GitHub</span>
                  </Link>
                </Button>
                <Button variant="outline" size="sm" className="h-8 w-8 p-0" asChild>
                  <Link href="https://linkedin.com">
                    <Linkedin className="h-4 w-4" />
                    <span className="sr-only">LinkedIn</span>
                  </Link>
                </Button>
                <Button variant="outline" size="sm" className="h-8 w-8 p-0" asChild>
                  <Link href="https://twitter.com">
                    <Twitter className="h-4 w-4" />
                    <span className="sr-only">Twitter</span>
                  </Link>
                </Button>
                <Button variant="outline" size="sm" className="h-8 w-8 p-0" asChild>
                  <Link href="mailto:john.doe@example.com">
                    <Mail className="h-4 w-4" />
                    <span className="sr-only">Email</span>
                  </Link>
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">About</h3>
                  <p className="text-sm text-muted-foreground">
                    Computer Science student passionate about web development and AI. Looking to collaborate on
                    innovative projects and expand my skill set.
                  </p>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Education</h3>
                  <div className="text-sm">
                    <p className="font-medium">University of Technology</p>
                    <p className="text-muted-foreground">B.S. Computer Science</p>
                    <p className="text-muted-foreground">6th Semester</p>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-2">XP Level</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Badge className="bg-blue-600">Level 5</Badge>
                        <Badge variant="outline" className="flex gap-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span>1,234 XP</span>
                        </Badge>
                      </div>
                      <span className="text-xs text-muted-foreground">1,234 / 2,000</span>
                    </div>
                    <Progress value={62} className="h-2" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Skills</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">Programming Languages</h3>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">JavaScript</Badge>
                    <Badge variant="secondary">Python</Badge>
                    <Badge variant="secondary">Java</Badge>
                    <Badge variant="secondary">TypeScript</Badge>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-2">Frameworks & Libraries</h3>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">React</Badge>
                    <Badge variant="secondary">Next.js</Badge>
                    <Badge variant="secondary">Node.js</Badge>
                    <Badge variant="secondary">Express</Badge>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-2">Tools & Technologies</h3>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">Git</Badge>
                    <Badge variant="secondary">Docker</Badge>
                    <Badge variant="secondary">AWS</Badge>
                    <Badge variant="secondary">MongoDB</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Achievements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Award className="h-5 w-5 text-yellow-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">Project Master</p>
                    <p className="text-xs text-muted-foreground">Completed 5 projects successfully</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Award className="h-5 w-5 text-blue-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">Skill Sharer</p>
                    <p className="text-xs text-muted-foreground">Taught skills to 10+ peers</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Award className="h-5 w-5 text-purple-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">Hackathon Winner</p>
                    <p className="text-xs text-muted-foreground">Won 1st place in TechFest 2023</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Content */}
        <div className="md:col-span-2">
          <Tabs defaultValue="projects" className="space-y-6">
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="projects">Projects</TabsTrigger>
              <TabsTrigger value="experience">Experience</TabsTrigger>
              <TabsTrigger value="endorsements">Endorsements</TabsTrigger>
            </TabsList>

            <TabsContent value="projects" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>AI Chatbot Assistant</CardTitle>
                      <CardDescription>Team Leader • Completed</CardDescription>
                    </div>
                    <Badge className="bg-green-600">Completed</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Built an AI-powered chatbot that can answer student queries about courses, assignments, and campus
                    resources.
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge variant="secondary">Python</Badge>
                    <Badge variant="secondary">NLP</Badge>
                    <Badge variant="secondary">React</Badge>
                    <Badge variant="secondary">Node.js</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href="https://github.com">
                        <Github className="mr-2 h-4 w-4" />
                        View Code
                      </Link>
                    </Button>
                    <Button size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600">
                      View Demo
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>E-Learning Platform</CardTitle>
                      <CardDescription>Team Member • In Progress</CardDescription>
                    </div>
                    <Badge variant="outline">In Progress</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Creating a comprehensive e-learning platform with video courses, quizzes, and progress tracking for
                    students.
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge variant="secondary">React</Badge>
                    <Badge variant="secondary">MongoDB</Badge>
                    <Badge variant="secondary">Express</Badge>
                    <Badge variant="secondary">Node.js</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href="https://github.com">
                        <Github className="mr-2 h-4 w-4" />
                        View Code
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="experience" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>Frontend Developer Intern</CardTitle>
                      <CardDescription>TechCorp • Summer 2023</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Developed and maintained responsive web applications using React and Next.js. Collaborated with the
                    design team to implement UI/UX improvements.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">React</Badge>
                    <Badge variant="secondary">Next.js</Badge>
                    <Badge variant="secondary">Tailwind CSS</Badge>
                    <Badge variant="secondary">TypeScript</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>Research Assistant</CardTitle>
                      <CardDescription>University AI Lab • 2022-2023</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Assisted in research on natural language processing applications. Implemented machine learning
                    models for text classification and sentiment analysis.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">Python</Badge>
                    <Badge variant="secondary">TensorFlow</Badge>
                    <Badge variant="secondary">NLP</Badge>
                    <Badge variant="secondary">Machine Learning</Badge>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="endorsements" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Skill Endorsements</CardTitle>
                  <CardDescription>Endorsements from peers who have worked with you</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium">JavaScript</h3>
                      <Badge variant="outline">15 endorsements</Badge>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                        <AvatarFallback>PS</AvatarFallback>
                      </Avatar>
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                        <AvatarFallback>MC</AvatarFallback>
                      </Avatar>
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                        <AvatarFallback>AJ</AvatarFallback>
                      </Avatar>
                      <div className="flex items-center justify-center h-8 w-8 rounded-full bg-muted text-xs">+12</div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium">React</h3>
                      <Badge variant="outline">12 endorsements</Badge>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                        <AvatarFallback>PS</AvatarFallback>
                      </Avatar>
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                        <AvatarFallback>MC</AvatarFallback>
                      </Avatar>
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                        <AvatarFallback>AJ</AvatarFallback>
                      </Avatar>
                      <div className="flex items-center justify-center h-8 w-8 rounded-full bg-muted text-xs">+9</div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium">Python</h3>
                      <Badge variant="outline">10 endorsements</Badge>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                        <AvatarFallback>PS</AvatarFallback>
                      </Avatar>
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                        <AvatarFallback>MC</AvatarFallback>
                      </Avatar>
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                        <AvatarFallback>AJ</AvatarFallback>
                      </Avatar>
                      <div className="flex items-center justify-center h-8 w-8 rounded-full bg-muted text-xs">+7</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Testimonials</CardTitle>
                  <CardDescription>What others say about working with you</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-10 w-10 mt-1">
                        <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Priya Sharma" />
                        <AvatarFallback>PS</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium">Priya Sharma</p>
                          <div className="flex items-center">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          "John is an exceptional developer and team leader. His React skills are top-notch, and he's
                          always willing to help others learn. We worked together on the AI Chatbot project, and his
                          contributions were invaluable."
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <Avatar className="h-10 w-10 mt-1">
                        <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Michael Chen" />
                        <AvatarFallback>MC</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium">Michael Chen</p>
                          <div className="flex items-center">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          "I learned Python from John through the skill exchange program. He's a patient teacher with a
                          deep understanding of the language. He made complex concepts easy to understand and was always
                          available to answer questions."
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

