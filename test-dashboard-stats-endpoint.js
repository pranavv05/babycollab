// Test script to verify the dashboard stats API endpoint
async function testDashboardStatsEndpoint() {
  try {
    console.log('Testing dashboard stats API endpoint...');
    
    const res = await fetch('http://localhost:3000/api/dashboard/stats', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include'
    });
    
    console.log('Dashboard stats status:', res.status);
    if (res.ok) {
      const data = await res.json();
      console.log('Dashboard stats data:', data);
    } else {
      console.log('Dashboard stats error:', await res.text());
    }
    
  } catch (error) {
    console.error('Error testing dashboard stats endpoint:', error);
  }
}

// Run the test
testDashboardStatsEndpoint();