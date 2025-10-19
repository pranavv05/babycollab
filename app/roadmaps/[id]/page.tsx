"use client"

import { RoadmapDisplay } from "@/components/roadmap-display"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { useEffect, useState } from "react"
import { use } from "react"

export default function RoadmapDetailPage({ params }: { params: Promise<{ id: string }> }) {
  // Unwrap the params promise
  const unwrappedParams = use(params)
  const { id } = unwrappedParams
  
  const [roadmap, setRoadmap] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchRoadmap = async () => {
      try {
        console.log(`RoadmapDetailPage: Fetching roadmap with ID: ${id}`);
        const response = await fetch(`/api/roadmaps?id=${id}`);
        console.log(`RoadmapDetailPage: API response status: ${response.status}`);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error(`RoadmapDetailPage: Failed to fetch roadmap. Status: ${response.status}, Body: ${errorText}`);
          
          // Handle 404 specifically
          if (response.status === 404) {
            setError('Roadmap not found. It may have been deleted or never existed.');
          } else {
            setError(`Failed to load roadmap: ${response.status} ${response.statusText}`);
          }
          return;
        }
        
        const data = await response.json();
        console.log('RoadmapDetailPage: Fetched roadmap data:', data);
        setRoadmap(data);
      } catch (err) {
        console.error('RoadmapDetailPage: Error fetching roadmap:', err);
        setError(`Failed to load roadmap: ${(err as Error).message}`);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchRoadmap();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <nav className="border-b border-border bg-card">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-8">
              <Link href="/" className="text-2xl font-bold text-primary">
                Baby Collab
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/roadmaps"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Roadmaps
              </Link>
            </div>
          </div>
        </nav>
        <main className="max-w-4xl mx-auto px-6 py-8">
          <div className="text-center py-12">
            <div className="animate-pulse">Loading roadmap...</div>
          </div>
        </main>
      </div>
    )
  }

  if (error || !roadmap) {
    return (
      <div className="min-h-screen bg-background">
        <nav className="border-b border-border bg-card">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-8">
              <Link href="/" className="text-2xl font-bold text-primary">
                Baby Collab
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/roadmaps"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Roadmaps
              </Link>
            </div>
          </div>
        </nav>
        <main className="max-w-4xl mx-auto px-6 py-8">
          <div className="text-center py-12">
            <div className="text-red-500">
              {error || 'Roadmap not found. Please check the URL or go back to the roadmaps page.'}
            </div>
            <div className="mt-6">
              <Link
                href="/roadmaps"
                className="bg-primary text-primary-foreground px-6 py-2 rounded-lg font-medium transition-colors hover:bg-primary/90"
              >
                Back to Roadmaps
              </Link>
            </div>
          </div>
        </main>
      </div>
    )
  }

  // Transform the database roadmap to match the expected format
  const transformedRoadmap = {
    title: roadmap.title,
    field: "Personalized",
    skillLevel: "Custom",
    timeline: "Flexible",
    phases: roadmap.phases || []
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-2xl font-bold text-primary">
              Baby Collab
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/roadmaps"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Roadmaps
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-8">
        <RoadmapDisplay roadmap={transformedRoadmap} roadmapId={roadmap.id} autoSave={false} />
      </main>
    </div>
  )
}