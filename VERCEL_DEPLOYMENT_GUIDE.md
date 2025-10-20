# Vercel Deployment Guide for BabyCollab

This guide provides detailed instructions for deploying the BabyCollab application on Vercel with PostgreSQL database.

## Prerequisites

1. GitHub account
2. Vercel account
3. PostgreSQL database (Vercel Postgres or external provider)
4. Clerk account for authentication
5. Gemini API key for AI features

## Database Setup Options

### Option 1: Vercel Postgres (Recommended)

1. In your Vercel dashboard, go to the "Storage" tab
2. Click "Create Database" and select "Vercel Postgres"
3. Choose your region and create the database
4. Vercel will automatically provide the DATABASE_URL environment variable

### Option 2: External PostgreSQL Provider

You can use any PostgreSQL provider such as:
- Supabase
- Render
- Railway
- AWS RDS
- DigitalOcean PostgreSQL

## Environment Variables Configuration

Set the following environment variables in your Vercel project settings:

### Required Variables

```
DATABASE_URL=your_postgresql_connection_string
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
GEMINI_API_KEY=your_gemini_api_key
```

### Optional Variables

```
EMAIL_USER=contactbabycollab@gmail.com
EMAIL_PASS=your_gmail_app_password
```

## Deployment Steps

### 1. Prepare Your Code

1. Ensure your Prisma schema is configured for PostgreSQL:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```

2. Commit all changes to your GitHub repository

### 2. Connect to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "New Project"
3. Import your GitHub repository
4. Configure the project settings:
   - Framework Preset: Next.js
   - Build Command: `next build`
   - Output Directory: `.next`
   - Install Command: `npm install` or `yarn install` or `pnpm install`

### 3. Configure Environment Variables

In the Vercel project settings, go to the "Environment Variables" section and add all required variables.

### 4. Database Migration

Database migrations will be automatically handled during the build process thanks to the `vercel-build` script already configured in your package.json:

```json
{
  "scripts": {
    "vercel-build": "prisma migrate deploy && next build"
  }
}

This means you don't need to manually run migrations after deployment. The script will:
1. Run `prisma migrate deploy` to apply any pending database migrations
2. Run `next build` to build your Next.js application

No additional configuration is needed for automatic migrations.

### 5. Deploy

Click "Deploy" and wait for the deployment to complete.

## Post-Deployment Configuration

### 1. Verify Database Connection

Check the deployment logs to ensure the database connection is successful.

### 2. Test Core Functionality

1. Test user registration and login
2. Test project creation
3. Test roadmap creation
4. Test feedback submission
5. Test admin API access

### 3. Set Up Custom Domain (Optional)

1. Go to your project settings in Vercel
2. Click "Domains"
3. Add your custom domain
4. Follow the DNS configuration instructions

## Troubleshooting

### Common Issues

1. **Database Connection Errors**
   - Verify DATABASE_URL format: `postgresql://username:password@hostname:port/database_name`
   - Ensure the database is accessible from Vercel
   - Check if SSL is required: Add `?sslmode=require` to the URL

2. **Environment Variables Not Set**
   - Double-check all required environment variables in Vercel dashboard
   - Ensure variables are set for the correct environment (Production/Preview/Development)

3. **Build Failures**
   - Check build logs for specific error messages
   - Ensure all dependencies are properly installed
   - Verify Prisma schema is correct

4. **Authentication Issues**
   - Check Clerk dashboard for correct redirect URLs
   - Ensure NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY and CLERK_SECRET_KEY match

### Support

If you encounter issues during deployment:

1. Check Vercel build logs
2. Verify environment variables in Vercel dashboard
3. Test database connection locally with the same DATABASE_URL
4. Check Prisma documentation for PostgreSQL setup
5. Contact Vercel support for platform-specific issues

## Monitoring and Maintenance

### 1. Set Up Monitoring

- Use Vercel Analytics for performance monitoring
- Set up error tracking with Sentry or similar tools
- Monitor database performance and usage

### 2. Regular Maintenance

- Keep dependencies updated
- Monitor database storage and performance
- Review and rotate API keys periodically
- Backup database regularly

### 3. Scaling

- Monitor usage patterns
- Upgrade database tier as needed
- Consider caching strategies for improved performance