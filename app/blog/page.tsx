import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, Search, ThumbsUp } from "lucide-react"
import BlogCard from "./blog-card"

const blogPosts = [
  {
    id: 1,
    title: "10 Essential Skills Every Developer Should Learn in 2025",
    excerpt: "Stay ahead of the curve with these must-have skills that will make you stand out in the tech industry.",
    image: "/placeholder.svg?height=200&width=400",
    date: "Mar 10, 2025",
    author: {
      name: "Alex Johnson",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    category: "Career",
    readTime: "5 min read",
    likes: 124,
    comments: 32,
  },
  {
    id: 2,
    title: "How to Ace Your Technical Interview: Tips from Hiring Managers",
    excerpt: "Insider advice on how to prepare for and excel in technical interviews at top tech companies.",
    image: "/placeholder.svg?height=200&width=400",
    date: "Mar 5, 2025",
    author: {
      name: "Priya Sharma",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    category: "Interview",
    readTime: "8 min read",
    likes: 98,
    comments: 45,
  },
  {
    id: 3,
    title: "Building Your First AI Project: A Beginner's Guide",
    excerpt: "Step-by-step tutorial on creating your first AI project, even if you have no prior experience.",
    image: "/placeholder.svg?height=200&width=400",
    date: "Feb 28, 2025",
    author: {
      name: "Michael Chen",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    category: "Tutorial",
    readTime: "12 min read",
    likes: 156,
    comments: 27,
  },
  {
    id: 4,
    title: "The Future of Remote Work in Tech: Trends and Predictions",
    excerpt: "Exploring how remote work is evolving and what it means for tech professionals in the coming years.",
    image: "/placeholder.svg?height=200&width=400",
    date: "Feb 20, 2025",
    author: {
      name: "Sarah Williams",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    category: "Industry",
    readTime: "6 min read",
    likes: 87,
    comments: 19,
  },
  {
    id: 5,
    title: "From College Project to Startup: Success Stories",
    excerpt: "Inspiring stories of students who turned their college projects into successful startups.",
    image: "/placeholder.svg?height=200&width=400",
    date: "Feb 15, 2025",
    author: {
      name: "David Kim",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    category: "Success Stories",
    readTime: "10 min read",
    likes: 203,
    comments: 41,
  },
  {
    id: 6,
    title: "Mastering React Hooks: Advanced Patterns and Best Practices",
    excerpt: "Take your React skills to the next level with these advanced hook patterns and techniques.",
    image: "/placeholder.svg?height=200&width=400",
    date: "Feb 8, 2025",
    author: {
      name: "Emily Rodriguez",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    category: "Tutorial",
    readTime: "15 min read",
    likes: 176,
    comments: 38,
  },
]

const communityQuestions = [
  {
    id: 1,
    title: "What's the best way to learn TypeScript in 2025?",
    body: "I'm a JavaScript developer looking to transition to TypeScript. What resources, courses, or projects would you recommend for someone with my background?",
    author: {
      name: "John Doe",
      avatar: "/placeholder.svg?height=40&width=40",
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
    },
    date: "5 days ago",
    tags: ["React", "State Management", "Redux"],
    answers: 9,
    votes: 18,
  },
]

export default function BlogPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Blog & Community</h1>
          <p className="text-muted-foreground">Career advice, tutorials, and community discussions</p>
        </div>
        <div className="relative w-full md:w-auto">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Search articles and questions..." className="w-full md:w-[300px] pl-8" />
        </div>
      </div>

      <Tabs defaultValue="blog" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="blog">Blog Articles</TabsTrigger>
          <TabsTrigger value="community">Community Q&A</TabsTrigger>
        </TabsList>

        <TabsContent value="blog" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogPosts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="community" className="space-y-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Recent Questions</h2>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600">Ask a Question</Button>
          </div>

          <div className="space-y-4">
            {communityQuestions.map((question) => (
              <Card key={question.id} className="overflow-hidden transition-all hover:shadow-md">
                <CardHeader className="pb-3">
                  <Link href={`/blog/questions/${question.id}`} className="hover:underline">
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
                      <span className="text-sm text-muted-foreground">
                        {question.author.name} • {question.date}
                      </span>
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
      </Tabs>
    </div>
  )
}

