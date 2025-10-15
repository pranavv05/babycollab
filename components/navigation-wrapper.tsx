"use client"

import { usePathname } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { LandingNavigation } from "@/components/landing-navigation"

export function NavigationWrapper() {
  const pathname = usePathname()

  if (pathname === "/landing") {
    return <LandingNavigation />
  }

  return (
    <>
      <Navigation />
      <div className="ml-64" />
    </>
  )
}
