import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Users } from "lucide-react"

interface ProjectCardProps {
  project: {
    id: number
    name: string
    description: string
    skills: string[]
    members: number
    maxMembers: number
    leader: {
      name: string
      college: string
      semester: string
      avatar: string
    }
  }
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="pb-3">
        <CardTitle>{project.name}</CardTitle>
        <div className="flex flex-wrap gap-2 mt-2">
          {project.skills.map((skill) => (
            <Badge key={skill} variant="secondary" className="font-normal">
              {skill}
            </Badge>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription className="line-clamp-3 mb-4">{project.description}</CardDescription>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Users className="h-4 w-4" />
          <span>
            {project.members}/{project.maxMembers} members
          </span>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-4 border-t pt-4">
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={project.leader.avatar} alt={project.leader.name} />
            <AvatarFallback>{project.leader.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium">{project.leader.name}</p>
            <p className="text-xs text-muted-foreground">
              {project.leader.college} • {project.leader.semester}
            </p>
          </div>
        </div>
        <div className="flex w-full justify-between">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/projects/${project.id}`}>View Details</Link>
          </Button>
          <Button size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600">
            Connect
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}

