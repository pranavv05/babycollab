"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { LogOut } from "lucide-react"

export function Navigation() {
  const pathname = usePathname()
  const router = useRouter()

  const isActive = (path: string) => {
    if (path === "/") return pathname === "/"
    return pathname.startsWith(path)
  }

  const handleLogout = () => {
    // Clear any local storage or session data
    localStorage.clear()
    sessionStorage.clear()

    // Redirect to landing page
    router.push("/landing")
  }

  return (
    <nav className="border-b border-border bg-card">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/logo.jpg" alt="Baby Collab Logo" width={36} height={36} className="rounded-lg" />
            <span className="text-2xl font-bold text-primary">Baby Collab</span>
          </Link>
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className={`text-sm transition-colors ${
                isActive("/") && pathname === "/"
                  ? "text-foreground hover:text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Dashboard
            </Link>
            <Link
              href="/roadmaps"
              className={`text-sm transition-colors ${
                isActive("/roadmaps")
                  ? "text-foreground hover:text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Roadmaps
            </Link>
            <Link
              href="/projects"
              className={`text-sm transition-colors ${
                isActive("/projects")
                  ? "text-foreground hover:text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Projects
            </Link>
            <Link
              href="/resume"
              className={`text-sm transition-colors ${
                isActive("/resume")
                  ? "text-foreground hover:text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Resume
            </Link>
            <Link
              href="/connections"
              className={`text-sm transition-colors ${
                isActive("/connections")
                  ? "text-foreground hover:text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Connections
            </Link>
            <Link
              href="/profile"
              className={`text-sm transition-colors ${
                isActive("/profile")
                  ? "text-foreground hover:text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Profile
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
          <Link href="/profile">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-sm font-medium hover:bg-primary/30 transition-colors cursor-pointer">
              JD
            </div>
          </Link>
        </div>
      </div>
    </nav>
  )
}
