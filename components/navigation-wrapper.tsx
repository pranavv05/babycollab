"use client"

import { usePathname } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { LandingNavigation } from "@/components/landing-navigation"
import { useAuth } from "@clerk/nextjs"

export function NavigationWrapper() {
  const pathname = usePathname()
  const { isSignedIn } = useAuth()

  // Safety check for pathname
  if (!pathname) {
    return null
  }

  // Show landing navigation on the home page
  if (pathname === "/") {
    return <LandingNavigation />
  }

  // Show full navigation only when signed in and not on landing page
  if (isSignedIn) {
    return <Navigation />
  }

  // For all other pages when not signed in, don't show navigation
  return null
}