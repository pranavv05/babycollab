/**
 * Test script for the admin API route
 * This script tests the /api/admin endpoint with the correct credentials
 */

async function testAdminAPI() {
  try {
    console.log('Testing admin API route...');
    
    const response = await fetch('http://localhost:3000/api/admin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@babycollab.com',
        password: 'admin@123456'
      })
    });
    
    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Admin API test passed');
      console.log(`✅ Found ${data.feedback.length} feedback entries`);
      console.log('Sample feedback entry:', JSON.stringify(data.feedback[0], null, 2));
    } else {
      console.error('❌ Admin API test failed:', data.error);
    }
  } catch (error) {
    console.error('❌ Error testing admin API:', error.message);
  }
}

// Run the test
testAdminAPI();