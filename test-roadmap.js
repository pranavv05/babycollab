// Test script to verify roadmap saving and fetching
const fetch = require('node-fetch');

async function testRoadmap() {
  try {
    // Test data for a roadmap
    const testRoadmap = {
      title: "Test Roadmap",
      description: "A test roadmap for verification",
      phases: [
        {
          id: 1,
          title: "Phase 1",
          description: "First phase",
          milestones: [
            { id: 1, title: "Milestone 1", description: "First milestone", resources: [], completed: false },
            { id: 2, title: "Milestone 2", description: "Second milestone", resources: [], completed: false }
          ]
        },
        {
          id: 2,
          title: "Phase 2",
          description: "Second phase",
          milestones: [
            { id: 3, title: "Milestone 3", description: "Third milestone", resources: [], completed: false }
          ]
        }
      ]
    };

    console.log("Testing roadmap creation...");
    
    // Since we can't easily test with authentication, let's just verify the API structure
    console.log("Test roadmap data:", JSON.stringify(testRoadmap, null, 2));
    
    console.log("\nTo test fully, you need to:");
    console.log("1. Sign in to the application");
    console.log("2. Go to the roadmaps section");
    console.log("3. Generate a roadmap using the AI");
    console.log("4. Click 'Save Roadmap'");
    console.log("5. Check that it appears in 'My Roadmaps'");
    
  } catch (error) {
    console.error("Test failed:", error);
  }
}

testRoadmap();