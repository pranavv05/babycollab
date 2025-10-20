# Database Migration Setup

This document explains the database migration setup for the BabyCollab application, specifically Option B which is already implemented.

## Current Setup (Option B)

The application already includes the necessary configuration for automatic database migrations during the Vercel build process.

### Package.json Script

The `vercel-build` script in [package.json](file:///c:/Users/prana/OneDrive/Desktop/ch_final/package.json) is already configured:

```json
{
  "scripts": {
    "vercel-build": "prisma migrate deploy && next build"
  }
}
```

This script will automatically:

1. Run `prisma migrate deploy` to apply any pending database migrations
2. Run `next build` to build your Next.js application

### How It Works

When you deploy to Vercel:

1. Vercel automatically detects the `vercel-build` script
2. During the build process, Prisma runs `migrate deploy` which:
   - Connects to your PostgreSQL database using the `DATABASE_URL` environment variable
   - Applies any pending migrations to keep your database schema up to date
3. After migrations are complete, Next.js builds the application

### No Additional Configuration Needed

You don't need to do anything else for automatic migrations. The setup is already complete.

## Manual Migration Option

If you ever need to run migrations manually (e.g., for testing or troubleshooting), you can use the Vercel CLI:

```bash
# Install Vercel CLI
npm install -g vercel

# Link your project
vercel link

# Run migrations
vercel run npx prisma migrate deploy
```

## Verification

You can verify that the migration setup is working correctly by running:

```bash
npm run test:migration
```

This will check that all necessary Prisma components are installed and available.

## Troubleshooting

If you encounter migration issues during deployment:

1. Check the Vercel build logs for specific error messages
2. Verify that your `DATABASE_URL` environment variable is correctly set
3. Ensure your database is accessible from Vercel
4. Check that your Prisma schema is valid

The automatic migration setup (Option B) is already implemented and ready to use.