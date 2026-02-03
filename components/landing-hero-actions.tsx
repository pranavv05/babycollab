"use client"

import Link from "next/link"
import { useAuth } from "@clerk/nextjs"
import { ArrowRight } from "lucide-react"

export function LandingHeroActions() {
  const { isSignedIn, isLoaded } = useAuth()

  // Show skeleton or nothing while loading to avoid hydration mismatch
  if (!isLoaded) {
    return (
      <div className="h-[60px] w-[200px] bg-muted animate-pulse rounded-lg"></div>
    )
  }

  if (isSignedIn) {
    return (
      <Link href="/dashboard">
        <button className="px-8 py-4 text-lg font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1">
          Go to Dashboard
          <ArrowRight className="inline-block w-5 h-5 ml-2" />
        </button>
      </Link>
    )
  }

  return (
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
  )
}
