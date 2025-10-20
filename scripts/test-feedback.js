/**
 * Test script for submitting feedback
 * This script tests the feedback submission without a valid user ID
 */

async function testFeedbackSubmission() {
  try {
    console.log('Testing feedback submission...');
    
    const response = await fetch('http://localhost:3001/api/feedback', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        feedbackType: 'bug',
        rating: 3,
        message: 'This is a test feedback submission',
        email: 'test@example.com'
      })
    });
    
    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Feedback submission test passed');
      console.log('Response:', data);
    } else {
      console.error('❌ Feedback submission test failed:', data.error);
    }
  } catch (error) {
    console.error('❌ Error testing feedback submission:', error.message);
  }
}

// Run the test
testFeedbackSubmission();