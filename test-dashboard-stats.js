// Simple test script to check if the dashboard stats API is working
async function testDashboardStatsAPI() {
  try {
    console.log('Testing dashboard stats API...');
    
    // Test fetching dashboard stats
    const response = await fetch('http://localhost:3000/api/dashboard/stats', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include'
    });
    
    console.log('Dashboard stats response status:', response.status);
    const data = await response.json();
    console.log('Dashboard stats data:', data);
    
  } catch (error) {
    console.error('Error testing dashboard stats API:', error);
  }
}

// Run the test
testDashboardStatsAPI();