"use client"

import { useState, useEffect } from "react"
import { CheckCircle2, Circle, BookOpen, ExternalLink, Save, Trash2, ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

interface RoadmapDisplayProps {
  roadmap: any
  autoSave?: boolean // New prop to control auto-saving
  roadmapId?: string // New prop for existing roadmaps
}

export function RoadmapDisplay({ roadmap, autoSave = false, roadmapId }: RoadmapDisplayProps) {
  const router = useRouter()
  
  // Ensure phases is always an array
  const phases = Array.isArray(roadmap.phases) ? roadmap.phases : []
  
  // Flatten milestones from all phases
  const allMilestones = phases.flatMap((phase: any) => 
    Array.isArray(phase.milestones) ? phase.milestones.map((m: any) => ({ ...m, completed: m.completed || false })) : []
  )
  
  const [milestones, setMilestones] = useState(allMilestones)
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [hasAutoSaved, setHasAutoSaved] = useState(false)

  // Auto-save when component mounts if autoSave is true
  useEffect(() => {
    if (autoSave && !roadmapId && !hasAutoSaved) {
      handleSave(true)
      setHasAutoSaved(true)
    }
  }, [autoSave, roadmapId, hasAutoSaved])

  const toggleMilestone = async (index: number, milestoneId: number) => {
    const updated = [...milestones];
    const newCompletedStatus = !updated[index].completed;
    updated[index].completed = newCompletedStatus;
    setMilestones(updated);
    
    // If this is an existing roadmap, save the progress to the database
    if (roadmapId) {
      try {
        const response = await fetch(`/api/roadmaps/${roadmapId}/progress`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            milestoneId: milestoneId,
            completed: newCompletedStatus
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error('Failed to update progress:', errorData);
          // Revert the UI change if the API call fails
          const reverted = [...milestones];
          reverted[index].completed = !newCompletedStatus;
          setMilestones(reverted);
          alert(`Failed to update progress: ${errorData.error}`);
        }
      } catch (error) {
        console.error('Error updating progress:', error);
        // Revert the UI change if the API call fails
        const reverted = [...milestones];
        reverted[index].completed = !newCompletedStatus;
        setMilestones(reverted);
        alert(`Failed to update progress: ${(error as Error).message}`);
      }
    }
  }

  const handleSave = async (isAutoSave = false) => {
    // If this is an existing roadmap, don't save again
    if (roadmapId) return

    try {
      setIsSaving(true)
      
      // Prepare the roadmap data for saving
      const roadmapToSave = {
        title: roadmap.title,
        description: `A ${roadmap.skillLevel || 'personalized'} roadmap in ${roadmap.field || 'your field'} with ${roadmap.timeline || 'flexible'} timeline`,
        phases: roadmap.phases, // This should be an array of phases
      };

      console.log('Sending roadmap data:', JSON.stringify(roadmapToSave, null, 2));

      // Save to database
      const response = await fetch('/api/roadmaps', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(roadmapToSave),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to save roadmap: ${errorData.error} - ${errorData.details || ''}`);
      }

      const savedRoadmap = await response.json();
      console.log("[v0] Roadmap saved successfully:", savedRoadmap);
      
      // Only redirect if this is not an auto-save
      if (!isAutoSave) {
        router.push("/roadmaps");
      }
    } catch (error) {
      console.error("Error saving roadmap:", error);
      // Show error to user
      alert(`Failed to save roadmap: ${(error as Error).message}`);
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!roadmapId) return

    if (!confirm("Are you sure you want to delete this roadmap? This action cannot be undone.")) {
      return
    }

    try {
      setIsDeleting(true)
      
      const response = await fetch(`/api/roadmaps?id=${roadmapId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to delete roadmap: ${errorData.error} - ${errorData.details || ''}`);
      }

      console.log("[v0] Roadmap deleted successfully");
      // Redirect to roadmaps page after deleting
      router.push("/roadmaps");
    } catch (error) {
      console.error("Error deleting roadmap:", error);
      // Show error to user
      alert(`Failed to delete roadmap: ${(error as Error).message}`);
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-card border border-border rounded-lg p-8">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">{roadmap.title}</h1>
            <p className="text-muted-foreground">
              {roadmap.skillLevel} • {roadmap.timeline} timeline
            </p>
          </div>
          <div className="flex gap-2">
            {roadmapId ? (
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                <Trash2 className="w-5 h-5" />
                {isDeleting ? 'Deleting...' : 'Delete Roadmap'}
              </button>
            ) : (
              <button
                onClick={() => handleSave(false)}
                disabled={isSaving}
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                <Save className="w-5 h-5" />
                {isSaving ? 'Saving...' : 'Save Roadmap'}
              </button>
            )}
          </div>
        </div>
        <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
          <p className="text-sm text-foreground">
            This personalized roadmap was generated based on your goals and preferences. You can customize it anytime
            and track your progress as you complete each milestone.
          </p>
        </div>
        {/* Back button */}
        <div className="mt-4">
          <button
            onClick={() => router.push("/roadmaps")}
            className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Roadmaps
          </button>
        </div>
      </div>

      {/* Phases */}
      {phases.length > 0 ? (
        phases.map((phase: any, phaseIndex: number) => (
          <div key={phaseIndex} className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-1">{phase.name || phase.title} Phase</h2>
                <p className="text-sm text-muted-foreground">Duration: {phase.duration || phase.description}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">
                  {Array.isArray(phase.milestones) ? phase.milestones.filter((m: any) => m.completed).length : 0}/{Array.isArray(phase.milestones) ? phase.milestones.length : 0} completed
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {Array.isArray(phase.milestones) && phase.milestones.map((milestone: any, milestoneIndex: number) => {
                const globalIndex =
                  phases.slice(0, phaseIndex).reduce((acc: number, p: any) => acc + (Array.isArray(p.milestones) ? p.milestones.length : 0), 0) +
                  milestoneIndex

                return (
                  <div
                    key={milestoneIndex}
                    className="bg-secondary border border-border rounded-lg p-6 hover:border-primary/50 transition-colors"
                  >
                    <div className="flex items-start gap-4">
                      <button
                        onClick={() => toggleMilestone(globalIndex, milestone.id)}
                        className="flex-shrink-0 mt-1 hover:scale-110 transition-transform"
                        disabled={!roadmapId} // Only allow toggling for saved roadmaps
                      >
                        {milestones[globalIndex]?.completed ? (
                          <CheckCircle2 className="w-6 h-6 text-success" />
                        ) : (
                          <Circle className="w-6 h-6 text-muted-foreground" />
                        )}
                      </button>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-foreground mb-2">{milestone.title}</h3>
                        <p className="text-sm text-muted-foreground mb-4">{milestone.description}</p>

                        {/* Skills */}
                        <div className="mb-4">
                          <p className="text-xs font-medium text-muted-foreground mb-2">Skills to learn:</p>
                          <div className="flex flex-wrap gap-2">
                            {Array.isArray(milestone.skills) && milestone.skills.map((skill: string, idx: number) => (
                              <span
                                key={idx}
                                className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full border border-primary/20"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Resources */}
                        <div>
                          <p className="text-xs font-medium text-muted-foreground mb-2">Recommended resources:</p>
                          <div className="space-y-2">
                            {Array.isArray(milestone.resources) && milestone.resources.map((resource: any, idx: number) => {
                              // Handle both string resources and object resources with URLs
                              let resourceTitle, resourceUrl, resourceType;
                              
                              if (typeof resource === 'string') {
                                // String resource - create a search URL
                                resourceTitle = resource;
                                resourceUrl = `https://www.google.com/search?q=${encodeURIComponent(resource)}`;
                                resourceType = 'Resource';
                              } else if (typeof resource === 'object' && resource.url) {
                                // Object resource with URL - use the direct URL
                                resourceTitle = resource.title || 'Untitled Resource';
                                resourceUrl = resource.url;
                                resourceType = resource.type || 'Resource';
                              } else {
                                // Fallback for unexpected resource format
                                resourceTitle = 'Unknown Resource';
                                resourceUrl = '#';
                                resourceType = 'Resource';
                              }
                              
                              return (
                                <a
                                  key={idx}
                                  href={resourceUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center justify-between bg-muted/50 border border-border rounded-lg px-4 py-2 hover:border-primary/50 transition-colors group"
                                >
                                  <div className="flex items-center gap-2">
                                    <BookOpen className="w-4 h-4 text-primary" />
                                    <span className="text-sm text-foreground">{resourceTitle}</span>
                                    <span className="text-xs text-muted-foreground">• {resourceType}</span>
                                  </div>
                                  <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                                </a>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ))
      ) : (
        <div className="bg-card border border-border rounded-lg p-8 text-center">
          <h3 className="text-xl font-semibold text-foreground mb-2">No Phases Found</h3>
          <p className="text-muted-foreground">
            This roadmap doesn't contain any phases yet. Please check back later or contact support.
          </p>
        </div>
      )}
    </div>
  )
}