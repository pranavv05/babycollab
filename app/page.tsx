"use client"

import type React from "react"
import Link from "next/link"
import { useAuth } from "@clerk/nextjs"
import { ArrowRight, Users, Map, FileText, Zap, Star, CheckCircle, Github, MessageCircle, File, Rocket, TrendingUp, Award, Twitter, Linkedin, Instagram, Facebook } from "lucide-react"

export default function LandingPage() {
  const { isSignedIn } = useAuth()

  const features = [
    {
      icon: <Users className="w-8 h-8 text-primary" />,
      title: "Project Collaboration",
      description: "Work on projects with peers, share resources, and build your portfolio together."
    },
    {
      icon: <FileText className="w-8 h-8 text-primary" />,
      title: "Resume Builder",
      description: "Optimize your resume with AI-powered suggestions and track multiple versions."
    },
    {
      icon: <Zap className="w-8 h-8 text-primary" />,
      title: "Skill Tracking",
      description: "Monitor your skill development and identify areas for improvement."
    }
  ]

  const socialLinks = [
    { icon: <Twitter className="w-5 h-5" />, url: "https://x.com/Babycollab" },
    { icon: <Linkedin className="w-5 h-5" />, url: "https://www.linkedin.com/company/babyycollabb/?viewAsMember=true" },
    { icon: <Instagram className="w-5 h-5" />, url: "https://www.instagram.com/babycollab/" }
  ]

  return (
    <div className="min-h-screen bg-background w-full">
      {/* Hero Section */}
      <div className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-20 md:py-32">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              Build Your <span className="text-primary">Career</span> with<br />
              Baby Collab
            </h1>
            
            <p className="text-xl text-muted-foreground mb-10">
              The ultimate platform for college students and early professionals to create roadmaps, 
              collaborate on projects, and accelerate their career growth.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              {isSignedIn ? (
                <Link href="/dashboard">
                  <button className="px-8 py-4 text-lg font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                    Go to Dashboard
                    <ArrowRight className="inline-block w-5 h-5 ml-2" />
                  </button>
                </Link>
              ) : (
                <>
                  <Link href="/sign-up">
                    <button className="px-8 py-4 text-lg font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                      Get Started Free
                      <ArrowRight className="inline-block w-5 h-5 ml-2" />
                    </button>
                  </Link>
                  <Link href="/sign-in">
                    <button className="px-8 py-4 text-lg font-medium bg-card text-foreground border border-border rounded-lg hover:bg-accent transition-all">
                      Sign In
                    </button>
                  </Link>
                </>
              )}
            </div>
            
            <div className="flex flex-wrap justify-center gap-8 text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-primary" />
                <span>Free to start</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-primary" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-primary" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Everything You Need to Succeed</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Powerful tools designed to help you plan, collaborate, and grow your career.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.slice(0, 3).map((feature, index) => (
              <div key={index} className="bg-card border border-border rounded-xl p-8 hover:border-primary/50 transition-all text-center">
                <div className="flex justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="py-20 bg-muted">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">How It Works</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Get started in three simple steps and accelerate your career journey.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                icon: <Award className="w-8 h-8 text-primary" />,
                step: "01", 
                title: "Create Your Profile", 
                description: "Set up your profile with your skills, experience, and career goals." 
              },
              { 
                icon: <TrendingUp className="w-8 h-8 text-primary" />,
                step: "02", 
                title: "Build Your Roadmap", 
                description: "Create a personalized career roadmap with milestones and actionable steps." 
              },
              { 
                icon: <Rocket className="w-8 h-8 text-primary" />,
                step: "03", 
                title: "Collaborate & Grow", 
                description: "Join projects, connect with peers, and track your progress." 
              }
            ].map((item, index) => (
              <div key={index} className="text-center bg-card border border-border rounded-xl p-8">
                <div className="flex justify-center mb-4">
                  {item.icon}
                </div>
                <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-card border-t border-border">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">Ready to Accelerate Your Career?</h2>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Join thousands of students and professionals already using Baby Collab to achieve their goals.
          </p>
          {isSignedIn ? (
            <Link href="/dashboard">
              <button className="px-8 py-4 text-lg font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                Go to Dashboard
                <ArrowRight className="inline-block w-5 h-5 ml-2" />
              </button>
            </Link>
          ) : (
            <Link href="/sign-up">
              <button className="px-8 py-4 text-lg font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                Start Free Trial
                <ArrowRight className="inline-block w-5 h-5 ml-2" />
              </button>
            </Link>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-background border-t border-border">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="md:col-span-1">
              <Link href="/" className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-xl">BC</span>
                </div>
                <span className="text-2xl font-bold text-foreground">Baby Collab</span>
              </Link>
              <p className="text-muted-foreground mb-6 max-w-xs">
                Empowering students and early professionals to build successful careers through collaboration and guided learning.
              </p>
              <div className="flex gap-4">
                {socialLinks.map((link, index) => (
                  <a 
                    key={index} 
                    href={link.url} 
                    className="w-12 h-12 rounded-full bg-card border border-border flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-300 shadow-sm hover:shadow-md"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {link.icon}
                  </a>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-6 pb-2 border-b border-border">Docs</h3>
              <ul className="space-y-3">
                <li><Link href="/docs/introduction" className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2 py-1"><span className="w-1.5 h-1.5 rounded-full bg-primary"></span> Introduction</Link></li>
                <li><Link href="/docs/getting-started" className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2 py-1"><span className="w-1.5 h-1.5 rounded-full bg-primary"></span> Getting Started</Link></li>
                <li><Link href="/docs/roadmaps" className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2 py-1"><span className="w-1.5 h-1.5 rounded-full bg-primary"></span> Career Roadmaps</Link></li>
                <li><Link href="/docs/projects" className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2 py-1"><span className="w-1.5 h-1.5 rounded-full bg-primary"></span> Project Collaboration</Link></li>
                <li><Link href="/docs/resume-builder" className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2 py-1"><span className="w-1.5 h-1.5 rounded-full bg-primary"></span> Resume Builder</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-6 pb-2 border-b border-border">Support</h3>
              <ul className="space-y-3">
                <li><Link href="/help" className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2 py-1"><span className="w-1.5 h-1.5 rounded-full bg-primary"></span> Help Center</Link></li>
                <li><Link href="/documentation" className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2 py-1"><span className="w-1.5 h-1.5 rounded-full bg-primary"></span> Documentation</Link></li>
                <li><a href="https://www.linkedin.com/company/babyycollabb/?viewAsMember=true" className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2 py-1" target="_blank" rel="noopener noreferrer"><span className="w-1.5 h-1.5 rounded-full bg-primary"></span> Community</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-border mt-16 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-muted-foreground text-sm">
              © {new Date().getFullYear()} Baby Collab. All rights reserved.
            </p>
            <div className="flex flex-wrap gap-6 mt-4 md:mt-0 justify-center">
              <Link href="/privacy" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                Terms of Service
              </Link>
              <Link href="/cookies" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}