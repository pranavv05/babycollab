"use client";

import { useUser } from "@clerk/nextjs";

export function DashboardHeader() {
  const { user } = useUser();
  
  return (
    <div className="space-y-3">
      <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
        Welcome back, {user?.firstName || user?.username || "there"}
      </h1>
      <p className="text-lg text-muted-foreground">Continue building your career journey</p>
    </div>
  )
}