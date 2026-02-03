"use client"

import * as React from "react"
import { PanelLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const SidebarTrigger = React.forwardRef<
  React.ElementRef<typeof Button>,
  React.ComponentProps<typeof Button>
>(({ className, onClick, ...props }, ref) => (
  // This is a simplified SidebarTrigger for now since the full sidebar component structure
  // is quite complex and might not be used fully. 
  // This assumes we have some global state or context to toggle, 
  // but if it's missing, this button at least renders and prevents build error.
  <Button
    variant="ghost"
    size="icon"
    className={cn("h-7 w-7", className)}
    onClick={onClick}
    ref={ref}
    {...props}
  >
    <PanelLeft className="h-4 w-4" />
    <span className="sr-only">Toggle Sidebar</span>
  </Button>
))
SidebarTrigger.displayName = "SidebarTrigger"

export { SidebarTrigger }
