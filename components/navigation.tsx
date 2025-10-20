"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { SignOutButton, useUser } from "@clerk/nextjs"
import { LogOut, LayoutDashboard, Map, FolderKanban, FileText, Share2, User, MessageSquare, Menu, X } from "lucide-react"
import { useState, useEffect } from "react"

export function Navigation() {
  const pathname = usePathname()
  const { user } = useUser()
  const [isOpen, setIsOpen] = useState(false)

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/roadmaps", label: "Roadmaps", icon: Map },
    { href: "/projects", label: "Projects", icon: FolderKanban },
    { href: "/resume", label: "Resume", icon: FileText },
    { href: "/profile", label: "Profile", icon: User },
  ]

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (isOpen) {
        setIsOpen(false)
      }
    }

    // Add event listener for clicks outside
    document.addEventListener('click', handleClickOutside)
    
    // Clean up
    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [isOpen])

  return (
    <>
      {/* Mobile menu button - visible only on small screens */}
      <button
        className="fixed top-4 left-4 z-50 p-2 rounded-md bg-card border border-border text-foreground lg:hidden"
        onClick={(e) => {
          e.stopPropagation()
          setIsOpen(!isOpen)
        }}
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Sidebar - hidden on mobile by default, shown when isOpen is true */}
      <aside 
        className={`fixed left-0 top-0 h-screen w-64 bg-card border-r border-border flex flex-col z-40 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Logo Section */}
        <div className="p-6 border-b border-border">
          <Link href="/dashboard" className="flex items-center gap-3">
            <Image src="/logo.jpg" alt="Baby Collab Logo" width={40} height={40} className="rounded-lg" />
            <span className="text-xl font-bold text-primary">Baby Collab</span>
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
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

      {/* Overlay for mobile - visible only when menu is open */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}