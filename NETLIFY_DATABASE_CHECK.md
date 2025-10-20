# How to Check Database Connection on Netlify

This guide will help you verify if your PostgreSQL database is properly connected to your project on Netlify.

## 1. Verify Environment Variables

### Check Netlify Environment Variables
1. Go to your Netlify dashboard
2. Select your site
3. Navigate to "Site settings" → "Build & deploy" → "Environment"
4. Verify that you have the following environment variables set:
   ```
   DATABASE_URL=postgresql://username:password@host:port/database_name
   ```

### Required Environment Variables
Make sure these variables are correctly set in Netlify:
- `DATABASE_URL` - Primary database connection string
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` - Clerk authentication
- `CLERK_SECRET_KEY` - Clerk authentication secret
- `GEMINI_API_KEY` - For AI features

## 2. Check Database Connection Format

Ensure your `DATABASE_URL` follows the correct format:
```
postgresql://username:password@hostname:port/database_name
```

Example:
```
postgresql://myuser:mypassword@myhost.example.com:5432/mydatabase
```

## 3. Test Database Connection Using Built-in Tools

### Using the Database Test Page
After deploying the latest changes, you can test your database connection:

1. Visit your deployed site
2. Go to Dashboard
3. Click on "Database Test" in the Quick Actions section
4. The page will automatically run tests and show results

### Using the API Routes Directly
You can also test the connection using the API routes:

1. **Simple Database Test**: 
   - Visit: `https://your-site.netlify.app/api/db-test`
   - Should return JSON with connection status

2. **Comprehensive Health Check**:
   - Visit: `https://your-site.netlify.app/api/health`
   - Shows detailed system status including database connectivity

## 4. Check Netlify Build Logs

1. Go to your Netlify dashboard
2. Select your site
3. Go to the "Deploys" tab
4. Click on the latest deployment
5. Look for any errors during the build process, especially:
   - Prisma client generation errors
   - Database connection errors
   - Environment variable loading issues

## 5. Common Database Connection Issues

### Issue 1: Incorrect Database URL
**Symptoms**: 
- "Invalid database connection string" errors
- "Host not found" errors

**Solution**:
- Double-check the `DATABASE_URL` format
- Verify hostname, port, username, and password
- Ensure the database is accessible from the internet (not localhost)

### Issue 2: Network/Security Restrictions
**Symptoms**:
- "Connection timed out" errors
- "Connection refused" errors

**Solution**:
- Check if your database allows connections from Netlify's IP addresses
- Verify firewall settings
- Ensure the database port is open (usually 5432 for PostgreSQL)

### Issue 3: Authentication Issues
**Symptoms**:
- "Authentication failed" errors
- "Password authentication failed" errors

**Solution**:
- Verify username and password
- Check if the database user has proper permissions
- Ensure the user can connect from the Netlify server IP

### Issue 4: SSL Requirements
**Symptoms**:
- SSL connection errors
- Certificate verification errors

**Solution**:
- Add `?sslmode=require` to your connection string if required
- Example: `postgresql://user:pass@host:port/db?sslmode=require`

## 6. Manual Testing with cURL

You can also test the API endpoints manually using cURL:

```bash
# Test simple database connection
curl https://your-site.netlify.app/api/db-test

# Test comprehensive health check
curl https://your-site.netlify.app/api/health
```

## 7. Prisma Schema Verification

Ensure your Prisma schema is correctly configured for PostgreSQL:

1. Check [prisma/schema.prisma](file:///C:/Users/prana/OneDrive/Desktop/ch_final/prisma/schema.prisma):
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```

2. Make sure all model definitions are compatible with PostgreSQL

## 8. Database Schema Migration

If you're connecting to a new database, you may need to run migrations:

1. Connect to your database locally with the same connection string
2. Run Prisma migrations:
   ```bash
   npx prisma migrate deploy
   ```

## 9. Troubleshooting Checklist

Before contacting support, verify:

- [ ] `DATABASE_URL` is set in Netlify environment variables
- [ ] Database URL format is correct
- [ ] Database is accessible from the internet
- [ ] Database user has proper permissions
- [ ] Firewall allows connections from Netlify
- [ ] SSL settings are correctly configured
- [ ] Prisma schema matches your database

## 10. Need Help?

If you continue to experience issues:

1. Check Netlify deployment logs for specific error messages
2. Verify all environment variables are correctly set
3. Test database connectivity from your local machine using the same connection string
4. Contact your database provider to ensure the database accepts external connections

The tools we've added to your project should help you quickly identify and resolve database connection issues.