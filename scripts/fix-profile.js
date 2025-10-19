// This script is meant to be run in the browser console to trigger a profile update
// It will fetch the current user's data from Clerk and update the database with real information

async function fixProfile() {
  try {
    // Trigger a profile update by making a PUT request to the profile API
    // This will update the user's email and name with real data from Clerk
    const response = await fetch('/api/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        // Empty body will still trigger the update with real data from Clerk
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Failed to update profile:', errorData.error);
      return;
    }
    
    const data = await response.json();
    console.log('Profile updated successfully:', data);
    console.log('Your real email and name should now be visible throughout the application.');
    
    // Reload the page to see the changes
    window.location.reload();
  } catch (error) {
    console.error('Error updating profile:', error);
  }
}

// Run the function
fixProfile();