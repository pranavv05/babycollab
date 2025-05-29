import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Award, Calendar, Crown, Medal, Star, Trophy, Users } from "lucide-react"

const topUsers = [
  {
    id: 1,
    name: "Alex Johnson",
    avatar: "/placeholder.svg?height=80&width=80",
    college: "University of Technology",
    level: 12,
    xp: 12450,
    badges: 24,
    skills: ["React", "Node.js", "Python"],
    projects: 8,
  },
  {
    id: 2,
    name: "Priya Sharma",
    avatar: "/placeholder.svg?height=80&width=80",
    college: "Design Institute",
    level: 11,
    xp: 11320,
    badges: 21,
    skills: ["UI/UX Design", "Figma", "JavaScript"],
    projects: 7,
  },
  {
    id: 3,
    name: "Michael Chen",
    avatar: "/placeholder.svg?height=80&width=80",
    college: "Tech University",
    level: 10,
    xp: 10150,
    badges: 19,
    skills: ["Machine Learning", "Python", "TensorFlow"],
    projects: 6,
  },
]

const leaderboardUsers = [
  ...topUsers,
  {
    id: 4,
    name: "Sarah Williams",
    avatar: "/placeholder.svg?height=80&width=80",
    college: "Engineering College",
    level: 9,
    xp: 9200,
    badges: 17,
    skills: ["Flutter", "Dart", "Firebase"],
    projects: 5,
  },
  {
    id: 5,
    name: "David Kim",
    avatar: "/placeholder.svg?height=80&width=80",
    college: "Tech Institute",
    level: 8,
    xp: 8450,
    badges: 15,
    skills: ["MERN Stack", "JavaScript", "MongoDB"],
    projects: 6,
  },
  {
    id: 6,
    name: "Emily Rodriguez",
    avatar: "/placeholder.svg?height=80&width=80",
    college: "Digital Arts Academy",
    level: 8,
    xp: 8100,
    badges: 14,
    skills: ["Blender", "3D Modeling", "Unity"],
    projects: 4,
  },
  {
    id: 7,
    name: "James Wilson",
    avatar: "/placeholder.svg?height=80&width=80",
    college: "State University",
    level: 7,
    xp: 7300,
    badges: 12,
    skills: ["Java", "Spring Boot", "MySQL"],
    projects: 5,
  },
  {
    id: 8,
    name: "Aisha Patel",
    avatar: "/placeholder.svg?height=80&width=80",
    college: "Computer Science Institute",
    level: 7,
    xp: 7050,
    badges: 13,
    skills: ["Data Science", "R", "Tableau"],
    projects: 4,
  },
  {
    id: 9,
    name: "Carlos Mendez",
    avatar: "/placeholder.svg?height=80&width=80",
    college: "Technical University",
    level: 6,
    xp: 6700,
    badges: 11,
    skills: ["Vue.js", "PHP", "Laravel"],
    projects: 4,
  },
  {
    id: 10,
    name: "Zoe Thompson",
    avatar: "/placeholder.svg?height=80&width=80",
    college: "Creative Arts School",
    level: 6,
    xp: 6500,
    badges: 10,
    skills: ["Graphic Design", "Adobe XD", "Illustrator"],
    projects: 3,
  },
]

const badges = [
  {
    id: 1,
    name: "Project Master",
    description: "Completed 5+ projects successfully",
    icon: <Trophy className="h-8 w-8 text-yellow-500" />,
    rarity: "Rare",
    users: 124,
  },
  {
    id: 2,
    name: "Skill Sharer",
    description: "Taught skills to 10+ peers",
    icon: <Users className="h-8 w-8 text-blue-500" />,
    rarity: "Uncommon",
    users: 256,
  },
  {
    id: 3,
    name: "Hackathon Winner",
    description: "Won 1st place in a hackathon",
    icon: <Award className="h-8 w-8 text-purple-500" />,
    rarity: "Epic",
    users: 78,
  },
  {
    id: 4,
    name: "Coding Streak",
    description: "Logged in for 30 consecutive days",
    icon: <Calendar className="h-8 w-8 text-green-500" />,
    rarity: "Common",
    users: 412,
  },
  {
    id: 5,
    name: "Community Leader",
    description: "Received 50+ upvotes on forum posts",
    icon: <Crown className="h-8 w-8 text-amber-500" />,
    rarity: "Rare",
    users: 145,
  },
  {
    id: 6,
    name: "Job Finder",
    description: "Secured a job through the platform",
    icon: <Medal className="h-8 w-8 text-indigo-500" />,
    rarity: "Legendary",
    users: 42,
  },
]

export default function LeaderboardPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Leaderboard & Achievements</h1>
          <p className="text-muted-foreground">Compete with peers, earn XP, unlock badges, and track your progress</p>
        </div>
        <Button className="bg-gradient-to-r from-blue-600 to-purple-600">View Your Profile</Button>
      </div>

      {/* Top 3 Users Podium */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6 text-center">Top Performers</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
          <div className="order-2 md:order-1">
            <div className="flex flex-col items-center">
              <div className="relative mb-4">
                <Avatar className="h-24 w-24 border-4 border-silver">
                  <AvatarImage src={topUsers[1].avatar} alt={topUsers[1].name} />
                  <AvatarFallback>{topUsers[1].name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-2 -right-2 bg-silver text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-lg shadow-lg">
                  2
                </div>
              </div>
              <h3 className="text-lg font-bold">{topUsers[1].name}</h3>
              <p className="text-sm text-muted-foreground mb-1">{topUsers[1].college}</p>
              <div className="flex items-center gap-1 mb-2">
                <Badge className="bg-silver">Level {topUsers[1].level}</Badge>
                <Badge variant="outline" className="flex gap-1">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  <span>{topUsers[1].xp.toLocaleString()} XP</span>
                </Badge>
              </div>
              <div className="h-40 md:h-32 bg-gradient-to-t from-silver to-silver/50 w-full rounded-lg flex items-end justify-center">
                <div className="bg-silver w-full h-32 md:h-24 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">2nd Place</span>
                </div>
              </div>
            </div>
          </div>

          <div className="order-1 md:order-2">
            <div className="flex flex-col items-center">
              <div className="relative mb-4">
                <Avatar className="h-28 w-28 border-4 border-gold">
                  <AvatarImage src={topUsers[0].avatar} alt={topUsers[0].name} />
                  <AvatarFallback>{topUsers[0].name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-2 -right-2 bg-gold text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-lg shadow-lg">
                  1
                </div>
              </div>
              <h3 className="text-xl font-bold">{topUsers[0].name}</h3>
              <p className="text-sm text-muted-foreground mb-1">{topUsers[0].college}</p>
              <div className="flex items-center gap-1 mb-2">
                <Badge className="bg-gold">Level {topUsers[0].level}</Badge>
                <Badge variant="outline" className="flex gap-1">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  <span>{topUsers[0].xp.toLocaleString()} XP</span>
                </Badge>
              </div>
              <div className="h-48 md:h-40 bg-gradient-to-t from-gold to-gold/50 w-full rounded-lg flex items-end justify-center">
                <div className="bg-gold w-full h-40 md:h-32 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-2xl">1st Place</span>
                </div>
              </div>
            </div>
          </div>

          <div className="order-3">
            <div className="flex flex-col items-center">
              <div className="relative mb-4">
                <Avatar className="h-24 w-24 border-4 border-bronze">
                  <AvatarImage src={topUsers[2].avatar} alt={topUsers[2].name} />
                  <AvatarFallback>{topUsers[2].name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-2 -right-2 bg-bronze text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-lg shadow-lg">
                  3
                </div>
              </div>
              <h3 className="text-lg font-bold">{topUsers[2].name}</h3>
              <p className="text-sm text-muted-foreground mb-1">{topUsers[2].college}</p>
              <div className="flex items-center gap-1 mb-2">
                <Badge className="bg-bronze">Level {topUsers[2].level}</Badge>
                <Badge variant="outline" className="flex gap-1">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  <span>{topUsers[2].xp.toLocaleString()} XP</span>
                </Badge>
              </div>
              <div className="h-32 md:h-24 bg-gradient-to-t from-bronze to-bronze/50 w-full rounded-lg flex items-end justify-center">
                <div className="bg-bronze w-full h-24 md:h-16 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">3rd Place</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="leaderboard" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
          <TabsTrigger value="badges">Badges & Achievements</TabsTrigger>
        </TabsList>

        <TabsContent value="leaderboard" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Global Leaderboard</CardTitle>
              <CardDescription>Top performers based on XP and achievements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {leaderboardUsers.map((user, index) => (
                  <div
                    key={user.id}
                    className="flex items-center gap-4 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
                  >
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 font-bold">
                      {index + 1}
                    </div>
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-xs text-muted-foreground">{user.college}</p>
                        </div>
                        <div className="flex items-center gap-2 mt-1 md:mt-0">
                          <Badge
                            className={
                              index < 3
                                ? index === 0
                                  ? "bg-gold"
                                  : index === 1
                                    ? "bg-silver"
                                    : "bg-bronze"
                                : "bg-blue-600"
                            }
                          >
                            Level {user.level}
                          </Badge>
                          <Badge variant="outline" className="flex gap-1">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span>{user.xp.toLocaleString()} XP</span>
                          </Badge>
                        </div>
                      </div>
                      <div className="mt-2">
                        <div className="flex flex-wrap gap-2">
                          {user.skills.map((skill) => (
                            <Badge key={skill} variant="secondary" className="font-normal text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="hidden md:flex flex-col items-end">
                      <div className="flex items-center gap-1 text-sm">
                        <Trophy className="h-4 w-4 text-yellow-500" />
                        <span>{user.badges} badges</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Users className="h-4 w-4" />
                        <span>{user.projects} projects</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-center">
            <Button variant="outline">View Full Leaderboard</Button>
          </div>
        </TabsContent>

        <TabsContent value="badges" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {badges.map((badge) => (
              <Card key={badge.id} className="overflow-hidden transition-all hover:shadow-md">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{badge.name}</CardTitle>
                    <Badge
                      className={
                        badge.rarity === "Common"
                          ? "bg-green-600"
                          : badge.rarity === "Uncommon"
                            ? "bg-blue-600"
                            : badge.rarity === "Rare"
                              ? "bg-purple-600"
                              : badge.rarity === "Epic"
                                ? "bg-amber-600"
                                : "bg-red-600"
                      }
                    >
                      {badge.rarity}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
                      {badge.icon}
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">{badge.description}</p>
                      <p className="text-xs text-muted-foreground">Earned by {badge.users} users</p>
                    </div>
                  </div>
                  <Progress value={Math.random() * 100} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-2 text-right">Your progress: 45%</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex justify-center">
            <Button variant="outline">View All Badges</Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

