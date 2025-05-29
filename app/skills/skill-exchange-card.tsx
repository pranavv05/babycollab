import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Clock, Star } from "lucide-react"

interface SkillExchangeCardProps {
  exchange: {
    id: number
    title: string
    description: string
    offering: string[]
    seeking: string[]
    experience: string
    duration: string
    user: {
      name: string
      college: string
      semester: string
      avatar: string
      rating: number
    }
  }
}

export default function SkillExchangeCard({ exchange }: SkillExchangeCardProps) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle>{exchange.title}</CardTitle>
          <Badge
            variant={
              exchange.experience === "Beginner"
                ? "outline"
                : exchange.experience === "Intermediate"
                  ? "secondary"
                  : "default"
            }
          >
            {exchange.experience}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription className="line-clamp-3 mb-4">{exchange.description}</CardDescription>

        <div className="space-y-3">
          <div>
            <p className="text-sm font-medium mb-1">Offering:</p>
            <div className="flex flex-wrap gap-2">
              {exchange.offering.map((skill) => (
                <Badge key={skill} variant="secondary" className="font-normal">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-medium mb-1">Seeking:</p>
            <div className="flex flex-wrap gap-2">
              {exchange.seeking.map((skill) => (
                <Badge
                  key={skill}
                  variant="default"
                  className="font-normal bg-gradient-to-r from-blue-600 to-purple-600"
                >
                  {skill}
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>Duration: {exchange.duration}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-4 border-t pt-4">
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={exchange.user.avatar} alt={exchange.user.name} />
            <AvatarFallback>{exchange.user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-1">
              <p className="text-sm font-medium">{exchange.user.name}</p>
              <div className="flex items-center">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                <span className="text-xs ml-1">{exchange.user.rating}</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              {exchange.user.college} • {exchange.user.semester}
            </p>
          </div>
        </div>
        <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600">Connect</Button>
      </CardFooter>
    </Card>
  )
}

