import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, MessageSquare, Search, ThumbsUp, Users, Video } from "lucide-react"
import Link from "next/link"

const communityQuestions = [
  {
    id: 1,
    title: "What's the best way to learn TypeScript in 2025?",
    body: "I'm a JavaScript developer looking to transition to TypeScript. What resources, courses, or projects would you recommend for someone with my background?",
    author: {
      name: "John Doe",
      avatar: "/placeholder.svg?height=40&width=40",
      level: 5,
    },
    date: "2 days ago",
    tags: ["TypeScript", "Learning", "JavaScript"],
    answers: 8,
    votes: 15,
  },
  {
    id: 2,
    title: "How to prepare for a FAANG interview as a fresh graduate?",
    body: "I'm graduating next month and want to apply to big tech companies. What should my preparation strategy look like? Any specific resources or practice methods?",
    author: {
      name: "Priya Sharma",
      avatar: "/placeholder.svg?height=40&width=40",
      level: 7,
    },
    date: "1 week ago",
    tags: ["Interview", "Career", "FAANG"],
    answers: 12,
    votes: 24,
  },
  {
    id: 3,
    title: "React vs Next.js for a new project in 2025?",
    body: "I'm starting a new web application project and trying to decide between React and Next.js. What are the pros and cons of each for a modern web app?",
    author: {
      name: "Michael Chen",
      avatar: "/placeholder.svg?height=40&width=40",
      level: 9,
    },
    date: "3 days ago",
    tags: ["React", "Next.js", "Web Development"],
    answers: 15,
    votes: 32,
  },
  {
    id: 4,
    title: "Best practices for managing state in a large React application?",
    body: "Our team is working on a complex React application with many components and features. What's the best approach to state management in 2025?",
    author: {
      name: "Sarah Williams",
      avatar: "/placeholder.svg?height=40&width=40",
      level: 8,
    },
    date: "5 days ago",
    tags: ["React", "State Management", "Redux"],
    answers: 9,
    votes: 18,
  },
]

const upcomingEvents = [
  {
    id: 1,
    title: "Web Development Workshop",
    description: "Learn the latest web development techniques and best practices.",
    date: "May 15, 2025",
    time: "2:00 PM - 4:00 PM",
    location: "Online",
    type: "Workshop",
    attendees: 156,
  },
  {
    id: 2,
    title: "AI in Healthcare Panel Discussion",
    description: "Industry experts discuss the impact of AI on healthcare innovation.",
    date: "May 20, 2025",
    time: "6:00 PM - 8:00 PM",
    location: "Tech Hub, San Francisco",
    type: "Panel",
    attendees: 89,
  },
  {
    id: 3,
    title: "Career Fair: Tech Edition",
    description: "Connect with top tech companies and explore job opportunities.",
    date: "June 5, 2025",
    time: "10:00 AM - 4:00 PM",
    location: "Convention Center, New York",
    type: "Career Fair",
    attendees: 312,
  },
]

const communityGroups = [
  {
    id: 1,
    name: "Frontend Developers",
    description: "A community for frontend developers to share knowledge and discuss trends.",
    members: 1245,
    topics: ["React", "Vue", "CSS", "JavaScript"],
    activity: "Very Active",
  },
  {
    id: 2,
    name: "Machine Learning Enthusiasts",
    description: "Discuss ML algorithms, share projects, and learn from each other.",
    members: 876,
    topics: ["Python", "TensorFlow", "Neural Networks", "Data Science"],
    activity: "Active",
  },
  {
    id: 3,
    name: "UI/UX Design Community",
    description: "Share design work, get feedback, and discuss design principles.",
    members: 932,
    topics: ["UI Design", "UX Research", "Figma", "Design Systems"],
    activity: "Very Active",
  },
  {
    id: 4,
    name: "Blockchain Developers",
    description: "Explore blockchain technology, smart contracts, and decentralized applications.",
    members: 654,
    topics: ["Ethereum", "Solidity", "Web3", "DeFi"],
    activity: "Moderate",
  },
]

export default function CommunityPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Community Hub</h1>
          <p className="text-muted-foreground">
            Connect with peers, join discussions, attend events, and grow your network
          </p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Search community..." className="w-full md:w-[300px] pl-8" />
          </div>
          <Button className="bg-gradient-to-r from-blue-600 to-purple-600">Ask a Question</Button>
        </div>
      </div>

      <Tabs defaultValue="discussions" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="discussions">Discussions</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="groups">Groups</TabsTrigger>
        </TabsList>

        <TabsContent value="discussions" className="space-y-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Recent Discussions</h2>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                Latest
              </Button>
              <Button variant="outline" size="sm">
                Popular
              </Button>
              <Button variant="outline" size="sm">
                Unanswered
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            {communityQuestions.map((question) => (
              <Card key={question.id} className="overflow-hidden transition-all hover:shadow-md">
                <CardHeader className="pb-3">
                  <Link href={`/community/questions/${question.id}`} className="hover:underline">
                    <CardTitle className="text-lg">{question.title}</CardTitle>
                  </Link>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {question.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="font-normal">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="line-clamp-2 mb-4">{question.body}</CardDescription>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={question.author.avatar} alt={question.author.name} />
                        <AvatarFallback>{question.author.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex items-center gap-1">
                        <span className="text-sm text-muted-foreground">{question.author.name}</span>
                        <Badge variant="outline" className="text-xs">
                          Lvl {question.author.level}
                        </Badge>
                      </div>
                      <span className="text-sm text-muted-foreground">• {question.date}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MessageSquare className="h-4 w-4" />
                        <span>{question.answers} answers</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <ThumbsUp className="h-4 w-4" />
                        <span>{question.votes} votes</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex justify-center mt-8">
            <Button variant="outline">Load More Questions</Button>
          </div>
        </TabsContent>

        <TabsContent value="events" className="space-y-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Upcoming Events</h2>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600">
              <Calendar className="mr-2 h-4 w-4" />
              Create Event
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingEvents.map((event) => (
              <Card key={event.id} className="overflow-hidden transition-all hover:shadow-md">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{event.title}</CardTitle>
                    <Badge
                      className={
                        event.type === "Workshop"
                          ? "bg-blue-600"
                          : event.type === "Panel"
                            ? "bg-purple-600"
                            : "bg-green-600"
                      }
                    >
                      {event.type}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="line-clamp-2 mb-4">{event.description}</CardDescription>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {event.date} • {event.time}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>{event.attendees} attending</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {event.location === "Online" ? (
                        <Video className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-4 w-4 text-muted-foreground"
                        >
                          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                          <circle cx="12" cy="10" r="3" />
                        </svg>
                      )}
                      <span>{event.location}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-4">
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600">Register Now</Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          <div className="flex justify-center mt-8">
            <Button variant="outline">View All Events</Button>
          </div>
        </TabsContent>

        <TabsContent value="groups" className="space-y-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Community Groups</h2>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600">
              <Users className="mr-2 h-4 w-4" />
              Create Group
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {communityGroups.map((group) => (
              <Card key={group.id} className="overflow-hidden transition-all hover:shadow-md">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{group.name}</CardTitle>
                    <Badge
                      className={
                        group.activity === "Very Active"
                          ? "bg-green-600"
                          : group.activity === "Active"
                            ? "bg-blue-600"
                            : "bg-yellow-600"
                      }
                    >
                      {group.activity}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="mb-4">{group.description}</CardDescription>
                  <div className="flex items-center gap-2 mb-4">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{group.members} members</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {group.topics.map((topic) => (
                      <Badge key={topic} variant="secondary" className="font-normal">
                        {topic}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-4">
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600">Join Group</Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          <div className="flex justify-center mt-8">
            <Button variant="outline">Explore All Groups</Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

