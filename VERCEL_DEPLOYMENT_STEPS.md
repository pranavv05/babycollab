# Vercel Deployment Steps

## Prerequisites
1. Make sure your GitHub repository is connected to Vercel
2. Ensure all environment variables are set in Vercel dashboard

## Environment Variables Required
Set these in your Vercel project settings under "Environment Variables":

```
DATABASE_URL=your_postgresql_connection_string
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
EMAIL_USER=your_email_for_sending_feedback
EMAIL_PASS=your_email_password
ADMIN_EMAIL=admin@babycollab.com
ADMIN_PASSWORD=admin@123456
```

## Deployment Process

1. Go to your Vercel dashboard
2. Select your project
3. Go to Settings > Environment Variables
4. Add all the environment variables listed above
5. Go to Deployments
6. Trigger a new deployment by connecting to your GitHub repository
7. Select the `deployment-clean` branch
8. Deploy

## Troubleshooting

If you encounter the "unexpected error" again:

1. Check your build logs in Vercel
2. Ensure your DATABASE_URL is correctly formatted for PostgreSQL
3. Make sure your Prisma schema is set to use PostgreSQL (already configured)
4. Verify that all environment variables are set correctly

## Post-Deployment

After successful deployment:
1. Run database migrations: `prisma migrate deploy`
2. Seed initial data if needed
3. Test all functionality including:
   - User authentication
   - Roadmap creation
   - Feedback submission
   - Admin panel access

## Important Notes

- Your application is configured to use PostgreSQL in production
- The build process has memory optimization flags
- The `vercel-build` script handles Prisma migrations and Next.js build
- Make sure your PostgreSQL database is accessible from Vercel (public connection string)