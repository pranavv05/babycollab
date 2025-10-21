/**
 * Utility functions for handling roadmap data
 */

/**
 * Parse roadmap phases data from various formats
 * @param phasesData - The phases data which could be a string, object, or array
 * @returns Parsed phases array or empty array if parsing fails
 */
export function parseRoadmapPhases(phasesData: any): any[] {
  // Handle null/undefined cases
  if (!phasesData) {
    console.log('RoadmapUtils: Phases data is null/undefined, returning empty array');
    return [];
  }
  
  // Handle array case (already parsed)
  if (Array.isArray(phasesData)) {
    console.log('RoadmapUtils: Phases data is already an array');
    return phasesData;
  }
  
  // Handle string case (needs parsing)
  if (typeof phasesData === 'string') {
    try {
      const parsed = JSON.parse(phasesData);
      console.log('RoadmapUtils: Successfully parsed string phases data');
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      console.error('RoadmapUtils: Failed to parse string phases data:', e);
      return [];
    }
  }
  
  // Handle object case
  if (typeof phasesData === 'object') {
    console.log('RoadmapUtils: Phases data is an object');
    return [phasesData]; // Wrap single object in array
  }
  
  // Fallback for any other type
  console.log('RoadmapUtils: Unknown phases data type, returning empty array');
  return [];
}

/**
 * Format roadmap data for consistent structure
 * @param roadmap - The raw roadmap data from the database
 * @returns Formatted roadmap object
 */
export function formatRoadmapData(roadmap: any) {
  // Parse phases data
  const phases = parseRoadmapPhases(roadmap.phases);
  
  // Return formatted roadmap
  return {
    ...roadmap,
    phases: phases,
    // Add default values for missing fields
    title: roadmap.title || 'Untitled Roadmap',
    description: roadmap.description || '',
    field: roadmap.field || 'Personalized',
    skillLevel: roadmap.skillLevel || 'Custom',
    timeline: roadmap.timeline || 'Flexible'
  };
}

/**
 * Check if a roadmap has valid content
 * @param roadmap - The roadmap object to check
 * @returns Boolean indicating if the roadmap has content
 */
export function hasRoadmapContent(roadmap: any): boolean {
  if (!roadmap || !Array.isArray(roadmap.phases)) {
    return false;
  }
  
  return roadmap.phases.some((phase: any) => {
    // Check if phase is a valid object
    if (!phase || typeof phase !== 'object') {
      return false;
    }
    
    // Check if phase has milestones array with content
    const milestones = Array.isArray(phase.milestones) ? phase.milestones : [];
    return milestones.length > 0;
  });
}