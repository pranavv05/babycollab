"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { SignOutButton, useUser } from "@clerk/nextjs"
import { LogOut, LayoutDashboard, Map, FolderKanban, FileText, Share2, User, MessageSquare } from "lucide-react"

export function Navigation() {
  const pathname = usePathname()
  const { user } = useUser()

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/roadmaps", label: "Roadmaps", icon: Map },
    { href: "/projects", label: "Projects", icon: FolderKanban },
    { href: "/resume", label: "Resume", icon: FileText },
    { href: "/connections", label: "Connections", icon: Share2 },
    { href: "/profile", label: "Profile", icon: User },
  ]

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-card border-r border-border flex flex-col z-50">
      {/* Logo Section */}
      <div className="p-6 border-b border-border">
        <Link href="/dashboard" className="flex items-center gap-3">
          <Image src="/logo.jpg" alt="Baby Collab Logo" width={40} height={40} className="rounded-lg" />
          <span className="text-xl font-bold text-primary">Baby Collab</span>
        </Link>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon
          const active = item.href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(item.href)

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-accent hover:text-foreground"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* User Section at Bottom */}
      <div className="p-4 border-t border-border space-y-2">
        <Link
          href="/feedback"
          className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
            pathname.startsWith("/feedback")
              ? "bg-primary/10 text-primary"
              : "text-muted-foreground hover:bg-accent hover:text-foreground"
          }`}
        >
          <MessageSquare className="w-5 h-5" />
          <span className="text-sm font-medium">Feedback</span>
        </Link>

        
        <SignOutButton>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground transition-colors">
            <LogOut className="w-5 h-5" />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </SignOutButton>
      </div>
    </aside>
  )
}