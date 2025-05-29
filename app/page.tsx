import Link from "next/link"
import { ArrowRight, Award, BookOpen, BriefcaseBusiness, Code, Lightbulb, Users, Zap } from "lucide-react"

import { Button } from "@/components/ui/button"
import FeatureCard from "./components/feature-card"
import TestimonialSlider from "./components/testimonial-slider"
import HeroIllustration from "./components/hero-illustration"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import StatsCounter from "./components/stats-counter"
import HowItWorks from "./components/how-it-works"
import PartnersSection from "./components/partners-section"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Navigation */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
          <div className="flex gap-6 md:gap-10">
            <Link href="/" className="flex items-center space-x-2">
              <div className="relative w-8 h-8 overflow-hidden rounded-full bg-gradient-to-br from-blue-600 to-purple-600">
                <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-lg">S</div>
              </div>
              <span className="inline-block font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text text-xl">
                SkillSync
              </span>
            </Link>
            <nav className="hidden gap-6 md:flex">
              <Link
                href="/features"
                className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                Features
              </Link>
              <Link
                href="/projects"
                className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                Projects
              </Link>
              <Link
                href="/skills"
                className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                Skills
              </Link>
              <Link
                href="/leaderboard"
                className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                Leaderboard
              </Link>
              <Link
                href="/blog"
                className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                Community
              </Link>
            </nav>
          </div>
          <div className="flex flex-1 items-center justify-end space-x-4">
            <nav className="flex items-center space-x-2">
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Log in
                </Button>
              </Link>
              <Link href="/signup">
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
                >
                  Sign up
                </Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-b from-white to-slate-50 dark:from-gray-900 dark:to-gray-950 py-12 md:py-24 lg:py-32">
          <div className="absolute inset-0 bg-grid-slate-200 [mask-image:linear-gradient(0deg,white,transparent)] dark:bg-grid-slate-800/25"></div>
          <div className="container relative px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <Badge className="mb-4 inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-sm font-medium text-blue-800 dark:border-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                    <Zap className="mr-1 h-3.5 w-3.5" />
                    Launch Your Career
                  </Badge>
                  <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl/none bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                    Connect, Collaborate, and Grow Together
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Join our platform to exchange skills, collaborate on projects, and accelerate your career growth
                    with AI-powered tools.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/signup">
                    <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105">
                      Get Started
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/features">
                    <Button
                      variant="outline"
                      className="border-blue-200 hover:border-blue-300 dark:border-blue-800 dark:hover:border-blue-700"
                    >
                      Explore Features
                    </Button>
                  </Link>
                </div>

                <div className="mt-6 flex items-center space-x-4 text-sm">
                  <div className="flex -space-x-2">
                    <Avatar className="border-2 border-white h-8 w-8">
                      <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                      <AvatarFallback>U1</AvatarFallback>
                    </Avatar>
                    <Avatar className="border-2 border-white h-8 w-8">
                      <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                      <AvatarFallback>U2</AvatarFallback>
                    </Avatar>
                    <Avatar className="border-2 border-white h-8 w-8">
                      <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                      <AvatarFallback>U3</AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="text-muted-foreground">
                    <span className="font-medium text-foreground">5,000+</span> students already joined
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative w-full h-[400px] md:h-[500px] animate-float">
                  <HeroIllustration />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="w-full py-12 md:py-16 lg:py-20 border-y bg-white dark:bg-gray-950">
          <div className="container px-4 md:px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <StatsCounter end={5000} suffix="+" label="Active Users" />
              <StatsCounter end={1200} suffix="+" label="Projects Created" />
              <StatsCounter end={3500} suffix="+" label="Skills Exchanged" />
              <StatsCounter end={95} suffix="%" label="Satisfaction Rate" />
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-slate-50 dark:bg-slate-900">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-blue-100 px-3 py-1 text-sm dark:bg-blue-800">
                  How It Works
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Your Path to Success</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our platform makes it easy to connect, learn, and grow your career in just a few simple steps.
                </p>
              </div>
            </div>

            <HowItWorks />
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-white dark:bg-gray-950">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-purple-100 px-3 py-1 text-sm dark:bg-purple-800">
                  Features
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Everything You Need to Succeed</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our platform offers a comprehensive suite of tools to help you connect with peers, collaborate on
                  projects, and advance your career.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
              <FeatureCard
                icon={<Users className="h-10 w-10 text-blue-600" />}
                title="Skill Exchange"
                description="Connect with peers to learn and teach skills in a collaborative environment."
              />
              <FeatureCard
                icon={<Code className="h-10 w-10 text-purple-600" />}
                title="Project Collaboration"
                description="Find team members and work together on exciting projects to build your portfolio."
              />
              <FeatureCard
                icon={<BriefcaseBusiness className="h-10 w-10 text-blue-600" />}
                title="AI Job Finder"
                description="Get personalized job recommendations based on your skills and experience."
              />
              <FeatureCard
                icon={<BookOpen className="h-10 w-10 text-purple-600" />}
                title="Resume ATS Scanner"
                description="Optimize your resume for applicant tracking systems with our AI-powered tool."
              />
              <FeatureCard
                icon={<Award className="h-10 w-10 text-blue-600" />}
                title="Gamification System"
                description="Earn XP, badges, and climb the leaderboard as you engage with the platform."
              />
              <FeatureCard
                icon={<Lightbulb className="h-10 w-10 text-purple-600" />}
                title="Startup Accelerator"
                description="Get mentorship and resources to turn your project into a successful startup."
              />
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-blue-100 px-3 py-1 text-sm dark:bg-blue-800">
                  Testimonials
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">What Our Users Say</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Hear from students and professionals who have transformed their careers with our platform.
                </p>
              </div>
            </div>
            <div className="mx-auto max-w-5xl py-12">
              <TestimonialSlider />
            </div>
          </div>
        </section>

        {/* Partners Section */}
        <section className="w-full py-12 md:py-16 lg:py-20 bg-white dark:bg-gray-950">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-8">
              <div className="space-y-2">
                <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl">Trusted By</h2>
                <p className="max-w-[600px] text-muted-foreground">
                  Leading universities and companies trust our platform for skill development and project collaboration.
                </p>
              </div>
            </div>

            <PartnersSection />
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-r from-blue-600 to-purple-600">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center text-white">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Ready to Start Your Journey?</h2>
                <p className="max-w-[900px] md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Join thousands of students and professionals who are already growing their skills and careers.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/signup">
                  <Button className="bg-white text-blue-600 hover:bg-gray-100 hover:scale-105 transition-transform duration-300 shadow-lg">
                    Sign Up Now
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/features">
                  <Button variant="outline" className="border-white text-white hover:bg-white/10">
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full border-t py-12 md:py-16 lg:py-20 bg-slate-950 text-white">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-8">
            <div className="col-span-2">
              <Link href="/" className="flex items-center space-x-2 mb-4">
                <div className="relative w-8 h-8 overflow-hidden rounded-full bg-gradient-to-br from-blue-600 to-purple-600">
                  <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-lg">
                    S
                  </div>
                </div>
                <span className="inline-block font-bold text-white text-xl">SkillSync</span>
              </Link>
              <p className="text-slate-400 mb-4 max-w-xs">
                Connect, collaborate, and grow your skills with our innovative platform designed for students and
                professionals.
              </p>
              <div className="flex space-x-4">
                <Link href="#" className="text-slate-400 hover:text-white">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                  </svg>
                </Link>
                <Link href="#" className="text-slate-400 hover:text-white">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                  </svg>
                </Link>
                <Link href="#" className="text-slate-400 hover:text-white">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
                  </svg>
                </Link>
                <Link href="#" className="text-slate-400 hover:text-white">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                    <rect width="4" height="12" x="2" y="9"></rect>
                    <circle cx="4" cy="4" r="2"></circle>
                  </svg>
                </Link>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-4">Platform</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/features" className="text-slate-400 hover:text-white">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="/projects" className="text-slate-400 hover:text-white">
                    Projects
                  </Link>
                </li>
                <li>
                  <Link href="/skills" className="text-slate-400 hover:text-white">
                    Skill Exchange
                  </Link>
                </li>
                <li>
                  <Link href="/jobs" className="text-slate-400 hover:text-white">
                    Jobs
                  </Link>
                </li>
                <li>
                  <Link href="/leaderboard" className="text-slate-400 hover:text-white">
                    Leaderboard
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-4">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/blog" className="text-slate-400 hover:text-white">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/community" className="text-slate-400 hover:text-white">
                    Community
                  </Link>
                </li>
                <li>
                  <Link href="/roadmap" className="text-slate-400 hover:text-white">
                    Career Roadmap
                  </Link>
                </li>
                <li>
                  <Link href="/accelerator" className="text-slate-400 hover:text-white">
                    Startup Accelerator
                  </Link>
                </li>
                <li>
                  <Link href="/hackathons" className="text-slate-400 hover:text-white">
                    Hackathons
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-4">Company</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/about" className="text-slate-400 hover:text-white">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className="text-slate-400 hover:text-white">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-slate-400 hover:text-white">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="text-slate-400 hover:text-white">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-slate-400 hover:text-white">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-center text-sm text-slate-400 md:text-left">© 2025 SkillSync. All rights reserved.</p>
            <div className="flex gap-4 mt-4 md:mt-0">
              <Link href="/terms" className="text-sm text-slate-400 hover:text-white">
                Terms
              </Link>
              <Link href="/privacy" className="text-sm text-slate-400 hover:text-white">
                Privacy
              </Link>
              <Link href="/contact" className="text-sm text-slate-400 hover:text-white">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

