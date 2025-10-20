// Test script to verify the complete project collaboration workflow
async function testProjectCollaboration() {
  try {
    console.log('Testing complete project collaboration workflow...');
    
    // Test 1: Create a new project
    console.log('\n--- Test 1: Creating a New Project ---');
    const createRes = await fetch('http://localhost:3000/api/projects', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        title: 'Test Collaboration Project',
        description: 'A test project to verify collaboration features',
        skills: ['JavaScript', 'React', 'Node.js'],
        teamSize: '3-5',
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days from now
      })
    });
    
    console.log('Create project status:', createRes.status);
    const createData = await createRes.json();
    console.log('Create project response:', createData);
    
    if (!createRes.ok) {
      console.log('Failed to create project, stopping test');
      return;
    }
    
    const projectId = createData.id;
    console.log(`Created project with ID: ${projectId}`);
    
    // Test 2: Verify project appears in creator's "My Projects"
    console.log('\n--- Test 2: Verifying Project in My Projects ---');
    const myProjectsRes = await fetch('http://localhost:3000/api/projects?type=member', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include'
    });
    
    console.log('My projects status:', myProjectsRes.status);
    if (myProjectsRes.ok) {
      const myProjectsData = await myProjectsRes.json();
      const projectInMyProjects = myProjectsData.find(p => p.id === projectId);
      console.log('Project found in My Projects:', !!projectInMyProjects);
    }
    
    // Test 3: Verify project appears in discover projects for other users
    console.log('\n--- Test 3: Verifying Project in Discover Projects ---');
    // Note: This would need to be run as a different user to properly test
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
      const projectInDiscover = discoverData.find(p => p.id === projectId);
      console.log('Project found in Discover Projects:', !!projectInDiscover);
      
      if (projectInDiscover) {
        console.log('Project details in discover:', {
          id: projectInDiscover.id,
          title: projectInDiscover.title,
          isMember: projectInDiscover.isMember,
          openPositions: projectInDiscover.openPositions
        });
      }
    }
    
    // Test 4: Submit join request (as a different user)
    console.log('\n--- Test 4: Submitting Join Request ---');
    // Note: This would need to be run as a different user to properly test
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
    
    // Test 5: Check join requests for the project (as admin)
    console.log('\n--- Test 5: Checking Join Requests ---');
    // This would typically be done through a separate API endpoint
    // For now, we'll just log that this step would happen
    
    console.log('In a real test, we would now:');
    console.log('1. Log in as the project admin');
    console.log('2. Check the join requests for this project');
    console.log('3. Accept or reject the join request');
    console.log('4. Verify the user is added to the project members');
    
  } catch (error) {
    console.error('Error testing project collaboration:', error);
  }
}

// Run the test
testProjectCollaboration();