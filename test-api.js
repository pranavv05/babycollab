const { default: fetch } = require('node-fetch');

async function testAPI() {
  try {
    console.log('Testing /api/generate-roadmap with a simple prompt...');
    
    const response = await fetch('http://localhost:3005/api/generate-roadmap', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        roadmapTitle: "Learn HTML and CSS basics"
      }),
    });
    
    console.log('Response status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('Success! Received data:', JSON.stringify(data, null, 2));
    } else {
      const errorText = await response.text();
      console.log('Error response:', errorText);
    }
  } catch (error) {
    console.error('Request failed:', error.message);
  }
}

testAPI();