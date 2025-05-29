import type React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Award,
  BookOpen,
  BriefcaseBusiness,
  CheckCircle,
  Code,
  Lightbulb,
  MessageSquare,
  Rocket,
  Search,
  Shield,
  Star,
  TrendingUp,
  Users,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function FeaturesPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h1 className="text-4xl font-bold mb-4">Platform Features</h1>
        <p className="text-xl text-muted-foreground">
          Discover all the tools and features designed to help you connect, collaborate, and grow your career
        </p>
      </div>

      <Tabs defaultValue="all" className="space-y-8">
        <div className="flex justify-center">
          <TabsList className="grid grid-cols-3 md:grid-cols-6 w-full max-w-4xl">
            <TabsTrigger value="all">All Features</TabsTrigger>
            <TabsTrigger value="skills">Skill Exchange</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="career">Career Tools</TabsTrigger>
            <TabsTrigger value="community">Community</TabsTrigger>
            <TabsTrigger value="gamification">Gamification</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="all" className="space-y-8">
          {/* Hero Feature */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 p-8 rounded-xl">
            <div>
              <h2 className="text-3xl font-bold mb-4">Skill Exchange Platform</h2>
              <p className="text-lg text-muted-foreground mb-6">
                Connect with peers to learn and teach skills in a collaborative environment. Our matching algorithm
                pairs you with the perfect learning partners.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600">
                  <Link href="/skills">Explore Skills</Link>
                </Button>
                <Button variant="outline">
                  <Link href="/dashboard">View Dashboard</Link>
                </Button>
              </div>
            </div>
            <div className="relative h-64 md:h-80">
              <Image
                src="/placeholder.svg?height=400&width=600"
                alt="Skill Exchange"
                fill
                className="object-cover rounded-lg"
              />
            </div>
          </div>

          {/* Feature Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              icon={<Code className="h-10 w-10 text-blue-600" />}
              title="Project Collaboration"
              description="Find team members and work together on exciting projects to build your portfolio."
              link="/projects"
            />
            <FeatureCard
              icon={<BriefcaseBusiness className="h-10 w-10 text-purple-600" />}
              title="AI Job Finder"
              description="Get personalized job recommendations based on your skills and experience."
              link="/jobs"
            />
            <FeatureCard
              icon={<BookOpen className="h-10 w-10 text-blue-600" />}
              title="Resume ATS Scanner"
              description="Optimize your resume for applicant tracking systems with our AI-powered tool."
              link="/jobs"
            />
            <FeatureCard
              icon={<Award className="h-10 w-10 text-purple-600" />}
              title="Gamification System"
              description="Earn XP, badges, and climb the leaderboard as you engage with the platform."
              link="/leaderboard"
            />
            <FeatureCard
              icon={<Lightbulb className="h-10 w-10 text-blue-600" />}
              title="Startup Accelerator"
              description="Get mentorship and resources to turn your project into a successful startup."
              link="/accelerator"
            />
            <FeatureCard
              icon={<MessageSquare className="h-10 w-10 text-purple-600" />}
              title="Community Forum"
              description="Connect with peers, ask questions, and share knowledge in our community forum."
              link="/community"
            />
            <FeatureCard
              icon={<TrendingUp className="h-10 w-10 text-blue-600" />}
              title="Career Roadmap"
              description="Get personalized career path recommendations and track your progress."
              link="/roadmap"
            />
            <FeatureCard
              icon={<Rocket className="h-10 w-10 text-purple-600" />}
              title="Hackathons"
              description="Participate in hackathons and coding competitions to showcase your skills."
              link="/hackathons"
            />
            <FeatureCard
              icon={<Shield className="h-10 w-10 text-blue-600" />}
              title="Verified Profiles"
              description="Build trust with verified profiles and endorsements from peers and mentors."
              link="/profile"
            />
          </div>
        </TabsContent>

        <TabsContent value="skills" className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4">Skill Exchange Platform</h2>
              <p className="text-lg text-muted-foreground mb-6">
                Our skill exchange platform connects you with peers who can teach you the skills you want to learn,
                while you teach them what you're good at.
              </p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>AI-powered matching algorithm to find the perfect learning partners</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Schedule virtual or in-person skill exchange sessions</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Track your learning progress and get recommendations</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Earn badges and XP for teaching and learning skills</span>
                </li>
              </ul>
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600">
                <Link href="/skills">Explore Skills</Link>
              </Button>
            </div>
            <div className="relative h-64 md:h-80">
              <Image
                src="/placeholder.svg?height=400&width=600"
                alt="Skill Exchange"
                fill
                className="object-cover rounded-lg"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-600" />
                  <CardTitle>Peer Learning</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Learn directly from peers who have practical experience in the skills you want to acquire.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-purple-600" />
                  <CardTitle>Skill Ratings</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Rate and get rated on your skills to build credibility and improve your teaching.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Search className="h-5 w-5 text-blue-600" />
                  <CardTitle>Skill Discovery</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Discover trending skills in your field and get recommendations based on your career goals.
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="projects" className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="order-2 md:order-1">
              <h2 className="text-3xl font-bold mb-4">Project Collaboration</h2>
              <p className="text-lg text-muted-foreground mb-6">
                Find team members and work together on exciting projects to build your portfolio and gain real-world
                experience.
              </p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Browse and join existing projects or create your own</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Collaborate with team members using built-in tools</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Showcase completed projects on your profile</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Get feedback and endorsements from team members</span>
                </li>
              </ul>
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600">
                <Link href="/projects">Explore Projects</Link>
              </Button>
            </div>
            <div className="order-1 md:order-2 relative h-64 md:h-80">
              <Image
                src="/placeholder.svg?height=400&width=600"
                alt="Project Collaboration"
                fill
                className="object-cover rounded-lg"
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="career" className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="relative h-64 md:h-80">
              <Image
                src="/placeholder.svg?height=400&width=600"
                alt="Career Tools"
                fill
                className="object-cover rounded-lg"
              />
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-4">Career Advancement Tools</h2>
              <p className="text-lg text-muted-foreground mb-6">
                Our AI-powered career tools help you find the perfect job, optimize your resume, and plan your career
                path.
              </p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>AI Job Finder matches you with relevant job opportunities</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Resume ATS Scanner optimizes your resume for applicant tracking systems</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Career Roadmap Generator creates personalized career paths</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Interview preparation tools with AI-powered mock interviews</span>
                </li>
              </ul>
              <div className="flex flex-wrap gap-4">
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600">
                  <Link href="/jobs">AI Job Finder</Link>
                </Button>
                <Button variant="outline">
                  <Link href="/roadmap">Career Roadmap</Link>
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="community" className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4">Community & Networking</h2>
              <p className="text-lg text-muted-foreground mb-6">
                Connect with like-minded peers, industry professionals, and mentors to expand your network and learn
                from others.
              </p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Community forum for discussions and knowledge sharing</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Live events, webinars, and workshops</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Networking opportunities with industry professionals</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Mentorship programs and guidance from experts</span>
                </li>
              </ul>
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600">
                <Link href="/community">Join Community</Link>
              </Button>
            </div>
            <div className="relative h-64 md:h-80">
              <Image
                src="/placeholder.svg?height=400&width=600"
                alt="Community"
                fill
                className="object-cover rounded-lg"
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="gamification" className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="relative h-64 md:h-80">
              <Image
                src="/placeholder.svg?height=400&width=600"
                alt="Gamification"
                fill
                className="object-cover rounded-lg"
              />
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-4">Gamification System</h2>
              <p className="text-lg text-muted-foreground mb-6">
                Our gamification system makes learning and skill development fun and engaging with XP, badges, levels,
                and leaderboards.
              </p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Earn XP for completing activities and helping others</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Unlock badges and achievements for milestones</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Level up your profile and unlock new features</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Compete on leaderboards and showcase your achievements</span>
                </li>
              </ul>
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600">
                <Link href="/leaderboard">View Leaderboard</Link>
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Call to Action */}
      <div className="mt-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Start Your Journey?</h2>
        <p className="text-xl mb-6 max-w-2xl mx-auto">
          Join thousands of students and professionals who are already growing their skills and careers with SkillSync.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
            <Link href="/signup">Sign Up Now</Link>
          </Button>
          <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
            <Link href="/dashboard">Explore Dashboard</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

interface FeatureCardProps {
  icon: React.ReactNode
  title: string
  description: string
  link: string
}

function FeatureCard({ icon, title, description, link }: FeatureCardProps) {
  return (
    <Card className="group relative overflow-hidden transition-all hover:shadow-lg">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 opacity-0 transition-opacity group-hover:opacity-100" />
      <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-gradient-to-br from-blue-600/20 to-purple-600/20 blur-3xl transition-all duration-500 group-hover:scale-150"></div>
      <CardHeader>
        <div className="mb-2 transition-transform duration-300 group-hover:scale-110">{icon}</div>
        <CardTitle className="transition-colors duration-300 group-hover:text-blue-600">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-sm leading-relaxed mb-4">{description}</CardDescription>
        <Link href={link} className="text-sm font-medium text-blue-600 hover:underline">
          Learn more →
        </Link>
      </CardContent>
    </Card>
  )
}

