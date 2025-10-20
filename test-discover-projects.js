// Test script to verify the discover projects functionality
async function testDiscoverProjects() {
  try {
    console.log('Testing discover projects functionality...');
    
    // Test 1: Fetch discover projects
    console.log('\n--- Test 1: Fetching Discover Projects ---');
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
      console.log('First discover project:', JSON.stringify(discoverData[0], null, 2));
      
      // Verify that these projects have the expected structure
      if (discoverData.length > 0) {
        const firstProject = discoverData[0];
        console.log('\n--- Project Structure Verification ---');
        console.log('ID:', firstProject.id);
        console.log('Title:', firstProject.title);
        console.log('Description:', firstProject.description);
        console.log('Status:', firstProject.status);
        console.log('Is Member:', firstProject.isMember);
        console.log('Admin:', firstProject.admin);
        console.log('Skills:', firstProject.skills);
        console.log('Team Size:', firstProject.teamSize);
        console.log('Open Positions:', firstProject.openPositions);
      }
    } else {
      const errorText = await discoverRes.text();
      console.log('Discover projects error:', errorText);
    }
    
    // Test 2: Try to join a project (if we have any)
    console.log('\n--- Test 2: Testing Join Request ---');
    const discoverRes2 = await fetch('http://localhost:3000/api/projects?type=discover', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include'
    });
    
    if (discoverRes2.ok) {
      const discoverData = await discoverRes2.json();
      if (discoverData.length > 0) {
        const projectId = discoverData[0].id;
        const projectTitle = discoverData[0].title;
        
        console.log(`Attempting to join project: ${projectTitle} (${projectId})`);
        
        const joinRes = await fetch(`http://localhost:3000/api/projects/${projectId}/join`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include'
        });
        
        console.log('Join request status:', joinRes.status);
        const joinData = await joinRes.json();
        console.log('Join request response:', joinData);
      } else {
        console.log('No projects available to test join functionality');
      }
    }
    
  } catch (error) {
    console.error('Error testing discover projects:', error);
  }
}

// Run the test
testDiscoverProjects();