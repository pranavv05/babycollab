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

  // Transform the database roadmap to match the expected format
  // Handle both stringified JSON and parsed JSON
  let phasesData = roadmap.phases || [];
  
  // Log debug information
  console.log('RoadmapDetailPage: Raw phases data:', roadmap.phases);
  console.log('RoadmapDetailPage: Phases data type:', typeof roadmap.phases);
  
  // If phases is a string, try to parse it
  if (typeof phasesData === 'string') {
    try {
      phasesData = JSON.parse(phasesData);
      console.log('RoadmapDetailPage: Parsed phases data:', JSON.stringify(phasesData, null, 2));
    } catch (e) {
      console.error('RoadmapDetailPage: Failed to parse phases JSON:', e);
      phasesData = [];
    }
  }
  
  const transformedRoadmap = {
    title: roadmap.title,
    field: "Personalized",
    skillLevel: "Custom",
    timeline: "Flexible",
    phases: Array.isArray(phasesData) ? phasesData : [],
    description: roadmap.description
  }

  // Log transformed data
  console.log('RoadmapDetailPage: Transformed roadmap:', JSON.stringify(transformedRoadmap, null, 2));

  // Check if the roadmap has content - more robust validation
  const hasContent = transformedRoadmap.phases && 
    transformedRoadmap.phases.length > 0 && 
    transformedRoadmap.phases.some((phase: any) => {
      // Check if phase is an object and has milestones
      if (!phase || typeof phase !== 'object') return false;
      
      // Check if milestones exists and is an array with items
      const milestones = phase.milestones || [];
      return Array.isArray(milestones) && milestones.length > 0;
    });

  if (!hasContent) {
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
                <p>Phases length: {Array.isArray(phasesData) ? phasesData.length : 'N/A'}</p>
                <p>Transformed phases length: {transformedRoadmap.phases.length}</p>
                <p>First phase: {JSON.stringify(phasesData[0] || 'None', null, 2)}</p>
              </div>
            </div>
            <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/roadmaps"
                className="bg-primary text-primary-foreground px-6 py-2 rounded-lg font-medium transition-colors hover:bg-primary/90"
              >
                Back to Roadmaps
              </Link>
              <Link
                href="/roadmaps/create"
                className="border border-border bg-background text-foreground px-6 py-2 rounded-lg font-medium transition-colors hover:bg-muted"
              >
                Create New Roadmap
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
        <RoadmapDisplay roadmap={transformedRoadmap} roadmapId={roadmap.id} autoSave={false} />
      </main>
    </div>
  )
}