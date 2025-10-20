# Deployment Checklist for BabyCollab

This checklist ensures that all necessary steps are taken before deploying the BabyCollab application to production on Vercel.

## Pre-Deployment Checklist

### 1. Environment Variables
- [ ] Set `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` in Vercel dashboard
- [ ] Set `CLERK_SECRET_KEY` in Vercel dashboard
- [ ] Set `DATABASE_URL` for production database (PostgreSQL)
- [ ] Set `GEMINI_API_KEY` for AI features
- [ ] Set `EMAIL_USER` and `EMAIL_PASS` for feedback notifications (optional)
- [ ] Remove any development-specific environment variables

### 2. Database Configuration
- [ ] Configure production database (Vercel Postgres or other PostgreSQL provider)
- [ ] Run database migrations: `npx prisma migrate deploy`
- [ ] Seed initial data if needed
- [ ] Verify database connection in production

### 3. Authentication Setup
- [ ] Create Clerk production application
- [ ] Configure redirect URLs in Clerk dashboard:
  - Sign-in: `https://your-domain.com/sign-in`
  - Sign-up: `https://your-domain.com/sign-up`
- [ ] Update allowed origins in Clerk dashboard

### 4. API Keys and Services
- [ ] Set up production Gemini API key
- [ ] Verify all external API integrations work in production

### 5. Build and Deployment
- [ ] Verify `next build` command works without errors
- [ ] Check that all environment variables are properly configured
- [ ] Test production build locally if possible
- [ ] Run verification script: `npm run verify-production`

### 6. Security
- [ ] Ensure sensitive environment variables are not committed to git
- [ ] Verify CORS settings are appropriate for production
- [ ] Check that authentication is properly enforced

### 7. Performance
- [ ] Optimize images and assets
- [ ] Verify caching strategies
- [ ] Check bundle sizes and optimize if necessary

## Post-Deployment Checklist

### 1. Initial Testing
- [ ] Test user registration flow
- [ ] Test user login flow
- [ ] Test core functionality (dashboard, projects, roadmaps)
- [ ] Test API endpoints
- [ ] Test database operations

### 2. Monitoring
- [ ] Set up error monitoring (e.g., Sentry)
- [ ] Set up performance monitoring
- [ ] Configure logging

### 3. Analytics
- [ ] Set up analytics (Google Analytics, etc.)
- [ ] Verify tracking is working correctly

### 4. Backup and Recovery
- [ ] Set up database backup strategy
- [ ] Test database restore procedures
- [ ] Document recovery procedures

## Vercel-Specific Configuration

### 1. Project Settings
- [ ] Framework Preset: Next.js
- [ ] Build Command: `next build`
- [ ] Output Directory: `.next`
- [ ] Install Command: `npm install` or `yarn install` or `pnpm install`

### 2. Environment Variables in Vercel
- [ ] All required environment variables are set in Vercel dashboard
- [ ] Environment variables are set for Production environment

### 3. Domains
- [ ] Custom domain configured if needed
- [ ] SSL certificate properly configured

### 4. Integrations
- [ ] Database integration (Vercel Postgres)
- [ ] Monitoring integrations
- [ ] Analytics integrations

## Troubleshooting

### Common Issues
1. **Environment Variables Not Set**: Ensure all required environment variables are configured in Vercel dashboard
2. **Database Connection Issues**: Verify DATABASE_URL is correct and database is accessible
3. **Clerk Authentication Issues**: Check redirect URLs and API keys in Clerk dashboard
4. **Build Failures**: Check build logs in Vercel for specific error messages
5. **Email Notifications Not Working**: If EMAIL_USER and EMAIL_PASS are not configured, feedback emails will not be sent (feedback is still saved to database)

### Support
If you encounter issues during deployment, check:
- Vercel build logs
- Application logs
- Prisma documentation for database setup
- Clerk documentation for authentication setup

For email configuration issues:
- Ensure EMAIL_USER and EMAIL_PASS environment variables are set
- For Gmail, use an App Password instead of your regular password
- Check that the email account allows SMTP access