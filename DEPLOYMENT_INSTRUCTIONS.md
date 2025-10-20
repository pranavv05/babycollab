# Deployment Instructions for BabyCollab

This document provides detailed instructions for deploying the BabyCollab application on Vercel with proper configuration.

## Environment Variables

For production deployment on Vercel, you need to set the following environment variables in the Vercel dashboard:

### Required Environment Variables

1. **DATABASE_URL** - PostgreSQL database connection string
2. **NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY** - Clerk publishable key
3. **CLERK_SECRET_KEY** - Clerk secret key
4. **GEMINI_API_KEY** - Gemini API key for AI features

### Optional Environment Variables

1. **EMAIL_USER** - Email address for sending feedback notifications (default: contactbabycollab@gmail.com)
2. **EMAIL_PASS** - App password for the email account (required for email notifications)

## Email Configuration

To enable email notifications for feedback submissions:

1. Set up an App Password for your Gmail account:
   - Go to https://myaccount.google.com/apppasswords
   - Generate a new app password for "Mail"
   - Copy the generated password

2. In the Vercel dashboard, add the following environment variables:
   - EMAIL_USER=contactbabycollab@gmail.com
   - EMAIL_PASS=your_generated_app_password

If these variables are not set, the application will skip email notifications but still save feedback to the database.

## Database Configuration

The application uses PostgreSQL for production. Ensure your DATABASE_URL points to a valid PostgreSQL database.

## Deployment Steps

1. Push your code to a GitHub repository
2. Connect the repository to Vercel
3. Set the environment variables in the Vercel dashboard
4. Deploy the application

## Admin Access

To access the admin feedback dashboard:

1. Make a POST request to `/api/admin` with the following JSON payload:
   ```json
   {
     "email": "admin@babycollab.com",
     "password": "admin@123456"
   }
   ```

2. This will return all feedback submissions in the system.