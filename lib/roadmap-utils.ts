/**
 * Utility functions for handling roadmap data
 */

/**
 * Normalize roadmap phases data structure
 * @param phases - The phases data from the database or API
 * @returns Normalized array of phases
 */
export function normalizeRoadmapPhases(phases: any): any[] {
  if (!phases) return [];
  
  // If it's already an array, return as is
  if (Array.isArray(phases)) {
    return phases;
  }
  
  // If it's an object, try to convert to array
  if (typeof phases === 'object') {
    const keys = Object.keys(phases);
    
    // If all keys are numeric, treat as array-like object
    if (keys.every(key => /^\d+$/.test(key))) {
      return keys.map(key => phases[key]);
    }
    
    // If it's a single phase object, wrap in array
    return [phases];
  }
  
  // Fallback - wrap in array
  return [];
}

/**
 * Normalize milestone data structure
 * @param milestones - The milestones data from a phase
 * @returns Normalized array of milestones
 */
export function normalizeMilestones(milestones: any): any[] {
  if (!milestones) return [];
  
  // If it's already an array, return as is
  if (Array.isArray(milestones)) {
    return milestones;
  }
  
  // If it's an object, try to convert to array
  if (typeof milestones === 'object') {
    const keys = Object.keys(milestones);
    
    // If all keys are numeric, treat as array-like object
    if (keys.every(key => /^\d+$/.test(key))) {
      return keys.map(key => milestones[key]);
    }
    
    // If it's a single milestone object, wrap in array
    return [milestones];
  }
  
  // Fallback - wrap in array
  return [];
}

/**
 * Transform database roadmap to frontend format
 * @param roadmap - The roadmap data from the database
 * @returns Transformed roadmap data for the frontend
 */
export function transformRoadmapForFrontend(roadmap: any): any {
  if (!roadmap) return null;
  
  // Ensure phases is properly normalized
  let normalizedPhases = [];
  
  // Handle different possible formats of phases data
  if (roadmap.phases) {
    if (typeof roadmap.phases === 'string') {
      try {
        // If it's a JSON string, parse it
        normalizedPhases = JSON.parse(roadmap.phases);
      } catch (e) {
        // If parsing fails, treat as empty array
        normalizedPhases = [];
      }
    } else {
      // If it's already an object or array, normalize it
      normalizedPhases = normalizeRoadmapPhases(roadmap.phases);
    }
  }
  
  return {
    id: roadmap.id,
    title: roadmap.title,
    description: roadmap.description,
    phases: normalizedPhases,
    createdAt: roadmap.createdAt,
    updatedAt: roadmap.updatedAt
  };
}

/**
 * Prepare roadmap data for saving to database
 * @param roadmap - The roadmap data to be saved
 * @returns Prepared roadmap data for the database
 */
export function prepareRoadmapForDatabase(roadmap: any): any {
  if (!roadmap) return null;
  
  // Ensure phases is properly formatted for database storage
  let phasesToSave = [];
  
  if (roadmap.phases) {
    if (Array.isArray(roadmap.phases)) {
      phasesToSave = roadmap.phases;
    } else if (typeof roadmap.phases === 'object') {
      phasesToSave = normalizeRoadmapPhases(roadmap.phases);
    }
  }
  
  return {
    title: roadmap.title || 'Untitled Roadmap',
    description: roadmap.description || '',
    phases: phasesToSave // This will be automatically converted to JSON by Prisma
  };
}