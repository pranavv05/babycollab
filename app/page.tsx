"use client"

import type React from "react"
import Link from "next/link"
import { useAuth } from "@clerk/nextjs"

export default function LandingPage() {
  const { isSignedIn } = useAuth()

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="landing-hero py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Build Your Career with <span className="text-blue-300">Baby Collab</span>
          </h1>
          <p className="text-xl text-gray-200 mb-10 max-w-3xl mx-auto">
            The ultimate platform for college students and early professionals to create roadmaps, 
            collaborate on projects, and accelerate their career growth.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {isSignedIn ? (
              <Link href="/dashboard">
                <button className="px-8 py-3 text-lg font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
                  Go to Dashboard
                </button>
              </Link>
            ) : (
              <>
                <Link href="/sign-in">
                  <button className="px-8 py-3 text-lg font-medium bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-colors shadow-sm">
                    Sign In
                  </button>
                </Link>
                <Link href="/sign-up">
                  <button className="px-8 py-3 text-lg font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
                    Get Started Free
                  </button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Everything You Need to Succeed</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Powerful tools designed to help you plan, collaborate, and grow your career.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="landing-feature-card p-8">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Career Roadmaps</h3>
              <p className="text-gray-600">
                Create visual roadmaps to plan your career path with milestones, skills, and goals.
              </p>
            </div>
            
            <div className="landing-feature-card p-8">
              <div className="text-4xl mb-4">👥</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Project Collaboration</h3>
              <p className="text-gray-600">
                Work on projects with peers, share resources, and build your portfolio together.
              </p>
            </div>
            
            <div className="landing-feature-card p-8">
              <div className="text-4xl mb-4">📄</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Resume Builder</h3>
              <p className="text-gray-600">
                Optimize your resume with AI-powered suggestions and track multiple versions.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 landing-hero">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Accelerate Your Career?</h2>
          <p className="text-xl text-gray-200 mb-10">
            Join thousands of students and professionals already using Baby Collab to achieve their goals.
          </p>
          {isSignedIn ? (
            <Link href="/dashboard">
              <button className="px-8 py-3 text-lg font-medium bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-colors shadow-sm">
                Go to Dashboard
              </button>
            </Link>
          ) : (
            <Link href="/sign-up">
              <button className="px-8 py-3 text-lg font-medium bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-colors shadow-sm">
                Start Free Trial
              </button>
            </Link>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="landing-footer py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">
            <p className="text-gray-400">
              © {new Date().getFullYear()} Baby Collab. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}