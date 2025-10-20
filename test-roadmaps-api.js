// Simple test script to check if the roadmaps API is working
async function testRoadmapsAPI() {
  try {
    console.log('Testing roadmaps API...');
    
    // Test fetching roadmaps
    const response = await fetch('http://localhost:3000/api/roadmaps?limit=3', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include'
    });
    
    console.log('Roadmaps response status:', response.status);
    const data = await response.json();
    console.log('Roadmaps data:', data);
    
  } catch (error) {
    console.error('Error testing roadmaps API:', error);
  }
}

// Run the test
testRoadmapsAPI();