"use client"

import { usePathname } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { LandingNavigation } from "@/components/landing-navigation"

export function NavigationWrapper() {
  const pathname = usePathname()

  // Show landing navigation only on /landing route
  if (pathname === "/landing") {
    return <LandingNavigation />
  }

  // Show app navigation on all other routes
  return <Navigation />
}
