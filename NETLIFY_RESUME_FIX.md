# Fixing Resume Optimization Feature on Netlify

## Issue
The Resume Optimization feature is showing "Error analyzing file. Check console and API key/route" because the required `GEMINI_API_KEY` environment variable is not properly configured in your Netlify deployment.

## Solution

### Step 1: Get a Google Gemini API Key
1. Go to [Google AI Studio](https://aistudio.google.com/)
2. Sign in with your Google account
3. Create a new API key:
   - Click on "Get API key" in the sidebar
   - Select your project or create a new one
   - Click "Create API key"
   - Copy the generated API key

### Step 2: Add Environment Variables to Netlify
1. Go to your Netlify dashboard
2. Select your deployed site
3. Go to "Site settings" → "Build & deploy" → "Environment"
4. Click "Edit variables"
5. Add the following environment variables:

```
GEMINI_API_KEY=your_actual_gemini_api_key_here
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
DATABASE_URL=your_postgresql_connection_string
EMAIL_USER=contactbabycollab@gmail.com
EMAIL_PASS=your_email_password
ADMIN_EMAIL=admin@babycollab.com
ADMIN_PASSWORD=admin@123456
```

### Step 3: Redeploy Your Site
1. After adding the environment variables, go to the "Deploys" tab
2. Click "Trigger deploy" → "Deploy site"
3. Wait for the deployment to complete

### Step 4: Test the Resume Optimization Feature
1. Visit your deployed site
2. Go to the Dashboard
3. Navigate to Resume Builder
4. Try uploading a resume to test the optimization feature

## Troubleshooting

If you're still experiencing issues:

### 1. Check the Netlify build logs
- Look for any error messages related to environment variables
- Check if the build process completed successfully

### 2. Verify your GEMINI_API_KEY
- Make sure you're using the actual API key, not a placeholder
- Ensure the API key hasn't expired
- Check that the API key has the necessary permissions

### 3. Check browser console for detailed error messages
- Open Developer Tools (F12)
- Go to the Console tab
- Try using the Resume Optimization feature again
- Look for any error messages

### 4. Verify API Route
- The resume analysis API route is at `/api/analyze`
- Check if this route is working properly in your deployment

## Additional Notes

- Make sure you're using the actual values for your Clerk keys, not the test values
- The DATABASE_URL should point to your actual PostgreSQL database
- If you're using a free tier of Google AI, there might be usage limits

## Need Help?

If you continue to experience issues:
1. Check the browser console for specific error messages
2. Verify all environment variables are correctly set in Netlify
3. Ensure your Google Gemini API key is valid and has not reached its usage limits

## Updated Error Handling

We've improved the error handling in the API routes to provide more specific error messages:
- Missing API key errors
- Invalid API key errors
- Model not found errors
- JSON parsing errors

This should help you identify the exact issue more quickly.