"use client"

import { RoadmapDisplay } from "@/components/roadmap-display"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { useEffect, useState } from "react"
import { use } from "react"
import { formatRoadmapData, hasRoadmapContent } from "@/lib/roadmap-utils"

// Add metadata for the roadmap detail page
export const metadata = {
  title: 'Career Roadmap Detail - Baby Collab',
  description: 'View and manage your personalized career roadmap on Baby Collab. Track your progress, complete milestones, and achieve your career goals.',
  keywords: [
    'career roadmap',
    'career planning',
    'professional development',
    'skill tracking',
    'career goals',
    'Baby Collab'
  ],
  openGraph: {
    title: 'Career Roadmap Detail - Baby Collab',
    description: 'View and manage your personalized career roadmap on Baby Collab. Track your progress, complete milestones, and achieve your career goals.',
    url: 'https://babycollab.com/roadmaps/[id]',
    siteName: 'Baby Collab',
    images: [
      {
        url: 'https://babycollab.com/roadmap-detail-og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Baby Collab Career Roadmap Detail'
      }
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Career Roadmap Detail - Baby Collab',
    description: 'View and manage your personalized career roadmap on Baby Collab.',
    images: ['https://babycollab.com/roadmap-detail-og-image.jpg'],
  },
}

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
      <div className="min-h-screen bg-background ml-64">
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
      <div className="min-h-screen bg-background ml-64">
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

  // Format the roadmap data using our utility function
  const formattedRoadmap = formatRoadmapData(roadmap);

  // Log formatted data
  console.log('RoadmapDetailPage: Formatted roadmap:', JSON.stringify(formattedRoadmap, null, 2));

  // Check if the roadmap has content using our utility function
  const contentExists = hasRoadmapContent(formattedRoadmap);

  if (!contentExists) {
    return (
      <div className="min-h-screen bg-background ml-64">
        <main className="max-w-4xl mx-auto px-6 py-8">
          <div className="text-center py-12">
            <div className="text-yellow-500 mb-4">
              <h2 className="text-2xl font-bold text-foreground mb-2">Incomplete Roadmap</h2>
              <p>This roadmap appears to be incomplete or was not generated properly.</p>
              <p className="mt-2 text-sm text-muted-foreground">This can happen when the AI service times out during generation.</p>
              {/* Debug information for developers */}
              <div className="mt-4 text-left bg-muted p-4 rounded text-xs">
                <p className="font-bold">Debug Info:</p>
                <p>Roadmap ID: {roadmap.id}</p>
                <p>Phases type: {typeof roadmap.phases}</p>
                <p>Phases length: {Array.isArray(formattedRoadmap.phases) ? formattedRoadmap.phases.length : 'N/A'}</p>
                <p>First phase: {JSON.stringify(formattedRoadmap.phases[0] || 'None', null, 2)}</p>
              </div>
            </div>
            <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
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

  return (
    <div className="min-h-screen bg-background ml-64">
      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-8">
        <RoadmapDisplay roadmap={formattedRoadmap} roadmapId={roadmap.id} autoSave={false} />
      </main>
    </div>
  )
}