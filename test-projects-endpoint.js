// Test script to verify the projects API endpoint
async function testProjectsEndpoint() {
  try {
    console.log('Testing projects API endpoint...');
    
    // Test member projects
    console.log('\n--- Testing Member Projects ---');
    const memberRes = await fetch('http://localhost:3000/api/projects?type=member', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include'
    });
    
    console.log('Member projects status:', memberRes.status);
    if (memberRes.ok) {
      const memberData = await memberRes.json();
      console.log('Member projects count:', memberData.length);
      console.log('First member project:', memberData[0]);
    } else {
      console.log('Member projects error:', await memberRes.text());
    }
    
    // Test discover projects
    console.log('\n--- Testing Discover Projects ---');
    const discoverRes = await fetch('http://localhost:3000/api/projects?type=discover', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include'
    });
    
    console.log('Discover projects status:', discoverRes.status);
    if (discoverRes.ok) {
      const discoverData = await discoverRes.json();
      console.log('Discover projects count:', discoverData.length);
      console.log('First discover project:', discoverData[0]);
    } else {
      console.log('Discover projects error:', await discoverRes.text());
    }
    
  } catch (error) {
    console.error('Error testing projects endpoint:', error);
  }
}

// Run the test
testProjectsEndpoint();