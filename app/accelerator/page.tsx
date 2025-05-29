import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, Lightbulb, MapPin, Trophy, Users } from "lucide-react"
import Link from "next/link"

const mentors = [
  {
    id: 1,
    name: "Dr. Sarah Chen",
    role: "CTO at TechVentures",
    expertise: ["AI/ML", "Startup Strategy", "Product Development"],
    bio: "Former Google engineer with 15+ years of experience in AI and machine learning. Has mentored over 20 successful startups.",
    availability: "2 slots available",
    avatar: "/placeholder.svg?height=80&width=80",
  },
  {
    id: 2,
    name: "Michael Rodriguez",
    role: "Angel Investor",
    expertise: ["Fundraising", "Business Strategy", "Market Analysis"],
    bio: "Angel investor who has funded 30+ early-stage startups. Specializes in helping founders secure their first round of funding.",
    availability: "1 slot available",
    avatar: "/placeholder.svg?height=80&width=80",
  },
  {
    id: 3,
    name: "Jennifer Park",
    role: "Founder & CEO of SaaS Success",
    expertise: ["SaaS", "Growth Hacking", "Customer Acquisition"],
    bio: "Serial entrepreneur who has founded 3 successful SaaS companies. Expert in growth strategies for early-stage startups.",
    availability: "3 slots available",
    avatar: "/placeholder.svg?height=80&width=80",
  },
]

const hackathons = [
  {
    id: 1,
    title: "TechFest Hackathon 2025",
    description: "48-hour hackathon focused on building innovative solutions using AI and blockchain technology.",
    date: "April 15-17, 2025",
    location: "San Francisco, CA",
    mode: "In-person",
    prizes: "$10,000 in cash prizes, mentorship opportunities, and investor meetings",
    registration: "Open until April 1, 2025",
    image: "/placeholder.svg?height=200&width=400",
  },
  {
    id: 2,
    title: "Global Student Hackathon",
    description:
      "Virtual hackathon for students worldwide to collaborate and build projects addressing global challenges.",
    date: "May 5-7, 2025",
    location: "Virtual",
    mode: "Online",
    prizes: "$5,000 in cash prizes, internship opportunities, and developer tools",
    registration: "Open until April 20, 2025",
    image: "/placeholder.svg?height=200&width=400",
  },
  {
    id: 3,
    title: "HealthTech Innovation Challenge",
    description: "Hackathon focused on developing innovative solutions for healthcare using technology.",
    date: "June 10-12, 2025",
    location: "Boston, MA",
    mode: "Hybrid",
    prizes: "$8,000 in cash prizes, partnership opportunities with healthcare providers",
    registration: "Open until May 25, 2025",
    image: "/placeholder.svg?height=200&width=400",
  },
]

export default function AcceleratorPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Startup Accelerator & Hackathons</h1>
          <p className="text-muted-foreground">
            Turn your project into a startup with mentorship, resources, and opportunities
          </p>
        </div>
        <Button className="bg-gradient-to-r from-blue-600 to-purple-600">Submit Startup Idea</Button>
      </div>

      <Tabs defaultValue="accelerator" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="accelerator">Startup Accelerator</TabsTrigger>
          <TabsTrigger value="hackathons">Hackathons</TabsTrigger>
        </TabsList>

        <TabsContent value="accelerator" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Submit Your Startup Idea</CardTitle>
                  <CardDescription>
                    Get mentorship, resources, and funding opportunities for your startup idea
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <h3 className="font-medium">What You'll Get</h3>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li className="flex items-start gap-2">
                          <span className="text-blue-600 mt-1">•</span>
                          <span>One-on-one mentorship from industry experts</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-blue-600 mt-1">•</span>
                          <span>Access to workshops and resources on startup development</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-blue-600 mt-1">•</span>
                          <span>Networking opportunities with investors and entrepreneurs</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-blue-600 mt-1">•</span>
                          <span>Feedback on your business model and pitch</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-blue-600 mt-1">•</span>
                          <span>Potential funding opportunities for promising ideas</span>
                        </li>
                      </ul>
                    </div>

                    <div className="space-y-2">
                      <h3 className="font-medium">Eligibility Criteria</h3>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li className="flex items-start gap-2">
                          <span className="text-blue-600 mt-1">•</span>
                          <span>Must be a registered user on SkillSync</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-blue-600 mt-1">•</span>
                          <span>Idea should be innovative and scalable</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-blue-600 mt-1">•</span>
                          <span>Must have at least a basic prototype or MVP</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-blue-600 mt-1">•</span>
                          <span>Team should have at least 2 members</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-blue-600 mt-1">•</span>
                          <span>Commitment to participate in the full program</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600">
                    Apply to the Accelerator Program
                  </Button>
                </CardFooter>
              </Card>
            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Success Stories</CardTitle>
                  <CardDescription>Projects that became successful startups through our accelerator</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-900">
                      <Lightbulb className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-sm">StudyBuddy</p>
                        <p className="text-xs text-muted-foreground mb-1">AI-powered study assistant</p>
                        <p className="text-xs text-blue-600">Raised $1.2M seed funding</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-900">
                      <Lightbulb className="h-5 w-5 text-purple-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-sm">EcoTrack</p>
                        <p className="text-xs text-muted-foreground mb-1">Sustainability tracking platform</p>
                        <p className="text-xs text-purple-600">Acquired for $3.5M</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-900">
                      <Lightbulb className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-sm">CodeMentor</p>
                        <p className="text-xs text-muted-foreground mb-1">Peer programming platform</p>
                        <p className="text-xs text-blue-600">500K+ active users</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <h2 className="text-2xl font-bold mt-8 mb-4">Meet Our Mentors</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {mentors.map((mentor) => (
              <Card key={mentor.id} className="overflow-hidden transition-all hover:shadow-md">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={mentor.avatar} alt={mentor.name} />
                      <AvatarFallback>{mentor.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{mentor.name}</CardTitle>
                      <CardDescription>{mentor.role}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium mb-2">Expertise</h3>
                      <div className="flex flex-wrap gap-2">
                        {mentor.expertise.map((skill) => (
                          <Badge key={skill} variant="secondary" className="font-normal">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground">{mentor.bio}</p>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-blue-600 font-medium">{mentor.availability}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-4">
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600">Request Mentorship</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="hackathons" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hackathons.map((hackathon) => (
              <Card key={hackathon.id} className="overflow-hidden transition-all hover:shadow-md">
                <div className="relative h-48 w-full">
                  <img
                    src={hackathon.image || "/placeholder.svg"}
                    alt={hackathon.title}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    <Badge
                      className={
                        hackathon.mode === "In-person"
                          ? "bg-blue-600"
                          : hackathon.mode === "Online"
                            ? "bg-purple-600"
                            : "bg-green-600"
                      }
                    >
                      {hackathon.mode}
                    </Badge>
                  </div>
                </div>
                <CardHeader className="pb-3">
                  <CardTitle>{hackathon.title}</CardTitle>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{hackathon.date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{hackathon.location}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">{hackathon.description}</p>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <Trophy className="h-4 w-4 text-yellow-500 mt-1" />
                      <div>
                        <p className="text-sm font-medium">Prizes</p>
                        <p className="text-xs text-muted-foreground">{hackathon.prizes}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Users className="h-4 w-4 text-blue-600 mt-1" />
                      <div>
                        <p className="text-sm font-medium">Registration</p>
                        <p className="text-xs text-muted-foreground">{hackathon.registration}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-4">
                  <div className="flex w-full justify-between">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/accelerator/hackathons/${hackathon.id}`}>Learn More</Link>
                    </Button>
                    <Button size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600">
                      Register Now
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>

          <div className="flex justify-center mt-8">
            <Button variant="outline">View All Hackathons</Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

