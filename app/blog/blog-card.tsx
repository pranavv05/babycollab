import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Calendar, MessageSquare, ThumbsUp } from "lucide-react"

interface BlogCardProps {
  post: {
    id: number
    title: string
    excerpt: string
    image: string
    date: string
    author: {
      name: string
      avatar: string
    }
    category: string
    readTime: string
    likes: number
    comments: number
  }
}

export default function BlogCard({ post }: BlogCardProps) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <div className="relative h-48 w-full">
        <Image src={post.image || "/placeholder.svg"} alt={post.title} fill className="object-cover" />
        <div className="absolute top-2 left-2">
          <Badge className="bg-gradient-to-r from-blue-600 to-purple-600">{post.category}</Badge>
        </div>
      </div>
      <CardHeader className="pb-3">
        <Link href={`/blog/${post.id}`} className="hover:underline">
          <CardTitle className="line-clamp-2">{post.title}</CardTitle>
        </Link>
      </CardHeader>
      <CardContent>
        <CardDescription className="line-clamp-3 mb-4">{post.excerpt}</CardDescription>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={post.author.avatar} alt={post.author.name} />
              <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="text-sm text-muted-foreground">{post.author.name}</span>
          </div>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{post.date}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t pt-4">
        <div className="flex w-full justify-between items-center">
          <span className="text-sm text-muted-foreground">{post.readTime}</span>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <ThumbsUp className="h-4 w-4" />
              <span>{post.likes}</span>
            </div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <MessageSquare className="h-4 w-4" />
              <span>{post.comments}</span>
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}

