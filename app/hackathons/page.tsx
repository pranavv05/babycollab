import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Filter, MapPin, Search, Trophy, Users } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

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
    organizer: {
      name: "TechFest",
      logo: "/placeholder.svg?height=40&width=40",
    },
    tags: ["AI", "Blockchain", "Innovation"],
    participants: 320,
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
    organizer: {
      name: "Student Tech Alliance",
      logo: "/placeholder.svg?height=40&width=40",
    },
    tags: ["Education", "Social Impact", "Global"],
    participants: 500,
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
    organizer: {
      name: "HealthTech Innovators",
      logo: "/placeholder.svg?height=40&width=40",
    },
    tags: ["Healthcare", "MedTech", "Innovation"],
    participants: 250,
  },
  {
    id: 4,
    title: "Sustainable Future Hackathon",
    description: "Build solutions that address climate change, renewable energy, and sustainability challenges.",
    date: "July 8-10, 2025",
    location: "Seattle, WA",
    mode: "In-person",
    prizes: "$7,500 in cash prizes, mentorship from sustainability experts",
    registration: "Open until June 20, 2025",
    image: "/placeholder.svg?height=200&width=400",
    organizer: {
      name: "Green Tech Initiative",
      logo: "/placeholder.svg?height=40&width=40",
    },
    tags: ["Sustainability", "CleanTech", "Environment"],
    participants: 200,
  },
  {
    id: 5,
    title: "FinTech Disrupt Hackathon",
    description: "Develop innovative financial technology solutions to disrupt traditional banking and finance.",
    date: "August 15-17, 2025",
    location: "New York, NY",
    mode: "In-person",
    prizes: "$12,000 in cash prizes, meetings with venture capitalists",
    registration: "Open until July 30, 2025",
    image: "/placeholder.svg?height=200&width=400",
    organizer: {
      name: "FinTech Alliance",
      logo: "/placeholder.svg?height=40&width=40",
    },
    tags: ["FinTech", "Banking", "Blockchain"],
    participants: 280,
  },
  {
    id: 6,
    title: "EdTech Innovation Hackathon",
    description: "Create solutions that transform education and learning experiences using technology.",
    date: "September 5-7, 2025",
    location: "Virtual",
    mode: "Online",
    prizes: "$6,000 in cash prizes, pilot opportunities with educational institutions",
    registration: "Open until August 20, 2025",
    image: "/placeholder.svg?height=200&width=400",
    organizer: {
      name: "EdTech Consortium",
      logo: "/placeholder.svg?height=40&width=40",
    },
    tags: ["Education", "EdTech", "Learning"],
    participants: 320,
  },
]

const pastHackathons = [
  {
    id: 101,
    title: "AI for Good Hackathon",
    date: "January 15-17, 2025",
    location: "Chicago, IL",
    mode: "In-person",
    winners: [
      {
        team: "DataMinds",
        project: "AI-Powered Disaster Response System",
        members: 4,
        prize: "1st Place - $5,000",
      },
      {
        team: "CodeCrafters",
        project: "Accessible Education Platform",
        members: 3,
        prize: "2nd Place - $3,000",
      },
      {
        team: "TechTitans",
        project: "Mental Health Support Chatbot",
        members: 5,
        prize: "3rd Place - $2,000",
      },
    ],
    image: "/placeholder.svg?height=200&width=400",
    participants: 280,
  },
  {
    id: 102,
    title: "Smart Cities Hackathon",
    date: "February 10-12, 2025",
    location: "Austin, TX",
    mode: "Hybrid",
    winners: [
      {
        team: "UrbanInnovators",
        project: "Smart Traffic Management System",
        members: 4,
        prize: "1st Place - $7,000",
      },
      {
        team: "CityTech",
        project: "Community Resource Sharing Platform",
        members: 3,
        prize: "2nd Place - $4,000",
      },
      {
        team: "MetroMinds",
        project: "Public Transportation Optimization",
        members: 5,
        prize: "3rd Place - $2,500",
      },
    ],
    image: "/placeholder.svg?height=200&width=400",
    participants: 320,
  },
]

export default function HackathonsPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Hackathons & Competitions</h1>
          <p className="text-muted-foreground">
            Participate in hackathons to showcase your skills, build your portfolio, and win prizes
          </p>
        </div>
        <Button className="bg-gradient-to-r from-blue-600 to-purple-600">Host a Hackathon</Button>
      </div>

      {/* Featured Hackathon */}
      <div className="mb-12 relative overflow-hidden rounded-xl">
        <div className="absolute inset-0">
          <Image src="/placeholder.svg?height=400&width=1200" alt="Featured Hackathon" fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-purple-900/80"></div>
        </div>
        <div className="relative p-8 md:p-12 text-white">
          <div className="max-w-3xl">
            <Badge className="mb-4 bg-white/20 hover:bg-white/30 backdrop-blur-sm">Featured Event</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Global AI Hackathon 2025</h2>
            <p className="text-lg mb-6 text-white/90">
              Join the world's largest AI hackathon and compete with developers from around the globe to build
              innovative AI solutions that solve real-world problems.
            </p>
            <div className="flex flex-wrap gap-4 mb-6">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1">
                <Calendar className="h-4 w-4" />
                <span className="text-sm">March 20-22, 2025</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1">
                <MapPin className="h-4 w-4" />
                <span className="text-sm">Worldwide (Virtual)</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1">
                <Trophy className="h-4 w-4" />
                <span className="text-sm">$50,000 in Prizes</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1">
                <Users className="h-4 w-4" />
                <span className="text-sm">5,000+ Participants</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-white/90">
                Register Now
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="upcoming" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upcoming">Upcoming Hackathons</TabsTrigger>
          <TabsTrigger value="past">Past Hackathons</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Search hackathons..." className="w-full pl-8" />
            </div>
            <div className="flex gap-2">
              <Select defaultValue="all">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Event Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="in-person">In-Person</SelectItem>
                  <SelectItem value="online">Online</SelectItem>
                  <SelectItem value="hybrid">Hybrid</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="all">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="ai">AI & Machine Learning</SelectItem>
                  <SelectItem value="blockchain">Blockchain</SelectItem>
                  <SelectItem value="web">Web Development</SelectItem>
                  <SelectItem value="mobile">Mobile Apps</SelectItem>
                  <SelectItem value="sustainability">Sustainability</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hackathons.map((hackathon) => (
              <Card key={hackathon.id} className="overflow-hidden transition-all hover:shadow-md">
                <div className="relative h-48 w-full">
                  <Image
                    src={hackathon.image || "/placeholder.svg"}
                    alt={hackathon.title}
                    fill
                    className="object-cover"
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
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{hackathon.title}</CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Avatar className="h-5 w-5">
                          <AvatarImage src={hackathon.organizer.logo} alt={hackathon.organizer.name} />
                          <AvatarFallback>{hackathon.organizer.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="text-xs text-muted-foreground">{hackathon.organizer.name}</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {hackathon.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="line-clamp-2 mb-4">{hackathon.description}</CardDescription>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{hackathon.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{hackathon.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>{hackathon.participants} participants</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Trophy className="h-4 w-4 text-muted-foreground" />
                      <span className="line-clamp-1">{hackathon.prizes}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-4">
                  <div className="flex w-full justify-between">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/hackathons/${hackathon.id}`}>Learn More</Link>
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

        <TabsContent value="past" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pastHackathons.map((hackathon) => (
              <Card key={hackathon.id} className="overflow-hidden transition-all hover:shadow-md">
                <div className="relative h-48 w-full">
                  <Image
                    src={hackathon.image || "/placeholder.svg"}
                    alt={hackathon.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <div className="text-center text-white">
                      <h3 className="text-xl font-bold mb-2">{hackathon.title}</h3>
                      <p className="text-sm">
                        {hackathon.date} • {hackathon.location}
                      </p>
                      <Badge className="mt-2 bg-white/20 hover:bg-white/30">
                        {hackathon.participants} Participants
                      </Badge>
                    </div>
                  </div>
                </div>
                <CardHeader>
                  <CardTitle>Winners</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {hackathon.winners.map((winner, index) => (
                      <div key={index} className="flex items-start gap-4">
                        <div
                          className={`flex h-8 w-8 items-center justify-center rounded-full ${
                            index === 0 ? "bg-yellow-500" : index === 1 ? "bg-gray-400" : "bg-amber-700"
                          } text-white font-bold`}
                        >
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium">{winner.team}</p>
                          <p className="text-sm text-muted-foreground">{winner.project}</p>
                          <div className="flex items-center gap-4 mt-1">
                            <span className="text-xs text-muted-foreground">{winner.members} members</span>
                            <Badge variant="outline">{winner.prize}</Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-4">
                  <Button className="w-full" variant="outline" asChild>
                    <Link href={`/hackathons/past/${hackathon.id}`}>View Projects</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          <div className="flex justify-center mt-8">
            <Button variant="outline">View All Past Hackathons</Button>
          </div>
        </TabsContent>
      </Tabs>

      {/* Call to Action */}
      <div className="mt-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Showcase Your Skills?</h2>
        <p className="text-xl mb-6 max-w-2xl mx-auto">
          Join a hackathon to build your portfolio, network with peers, and win exciting prizes.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
            <Link href="/hackathons">Browse Hackathons</Link>
          </Button>
          <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
            <Link href="/hackathons/host">Host a Hackathon</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

