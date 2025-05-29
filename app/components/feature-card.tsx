import type React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface FeatureCardProps {
  icon: React.ReactNode
  title: string
  description: string
}

export default function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <Card className="group relative overflow-hidden transition-all hover:shadow-lg">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 opacity-0 transition-opacity group-hover:opacity-100" />
      <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-gradient-to-br from-blue-600/20 to-purple-600/20 blur-3xl transition-all duration-500 group-hover:scale-150"></div>
      <CardHeader>
        <div className="mb-2 transition-transform duration-300 group-hover:scale-110">{icon}</div>
        <CardTitle className="transition-colors duration-300 group-hover:text-blue-600">{title}</CardTitle>
      </CardHeader>
      <CardContent>
      <CardDescription className="text-sm leading-relaxed">{description}</CardDescription>
</CardContent>

    </Card>
  )
}

