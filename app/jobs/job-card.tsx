import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Briefcase, Building2, Clock, MapPin } from "lucide-react"

interface JobCardProps {
  job: {
    id: number
    title: string
    company: string
    location: string
    type: string
    salary: string
    posted: string
    description: string
    skills: string[]
    match: number
  }
}

export default function JobCard({ job }: JobCardProps) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{job.title}</CardTitle>
            <CardDescription className="flex items-center gap-1 mt-1">
              <Building2 className="h-3 w-3" />
              <span>{job.company}</span>
            </CardDescription>
          </div>
          <Badge className={job.match >= 95 ? "bg-green-600" : job.match >= 85 ? "bg-blue-600" : "bg-purple-600"}>
            {job.match}% Match
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>{job.location}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Briefcase className="h-4 w-4" />
              <span>{job.type}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Posted {job.posted}</span>
            </div>
          </div>

          <p className="text-sm text-muted-foreground line-clamp-3">{job.description}</p>

          <div>
            <p className="text-sm font-medium mb-2">Required Skills:</p>
            <div className="flex flex-wrap gap-2">
              {job.skills.map((skill) => (
                <Badge key={skill} variant="secondary" className="font-normal">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Match Score</p>
              <p className="text-sm text-muted-foreground">{job.match}%</p>
            </div>
            <Progress value={job.match} className="h-2" />
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t pt-4">
        <div className="flex w-full justify-between">
          <Button variant="outline" size="sm">
            Save
          </Button>
          <Button size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600">
            Apply Now
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}

