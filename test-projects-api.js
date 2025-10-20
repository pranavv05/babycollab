// Simple test script to check if the projects API is working
async function testProjectsAPI() {
  try {
    console.log('Testing projects API...');
    
    // Test fetching projects where user is member
    const memberResponse = await fetch('http://localhost:3000/api/projects?type=member', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include'
    });
    
    console.log('Member projects response status:', memberResponse.status);
    const memberData = await memberResponse.json();
    console.log('Member projects data:', memberData);
    
    // Test fetching projects for discovery
    const discoverResponse = await fetch('http://localhost:3000/api/projects?type=discover', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include'
    });
    
    console.log('Discover projects response status:', discoverResponse.status);
    const discoverData = await discoverResponse.json();
    console.log('Discover projects data:', discoverData);
    
  } catch (error) {
    console.error('Error testing projects API:', error);
  }
}

// Run the test
testProjectsAPI();