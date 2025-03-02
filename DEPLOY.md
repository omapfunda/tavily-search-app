# Deploying to Vercel

This guide will walk you through deploying your Tavily Search App to Vercel.

## Prerequisites

1. A [Vercel account](https://vercel.com/signup)
2. Your code pushed to a Git repository (GitHub, GitLab, or Bitbucket)
3. A PostgreSQL database (Vercel Postgres, Supabase, Railway, etc.)
4. Required API keys:
   - Tavily API key
   - Google OAuth credentials (for Google login)

## Step 1: Connect Your Repository

1. Log in to your Vercel account
2. Click "Add New" > "Project"
3. Import your Git repository
4. Select the repository containing your Tavily Search App

## Step 2: Configure Project Settings

### Basic Configuration

Vercel will automatically detect that this is a Next.js project. The default settings should work as the project already includes a `vercel.json` configuration file.

### Environment Variables

Add the following environment variables in the Vercel project settings:

```
DATABASE_URL=your_postgresql_connection_string
NEXTAUTH_URL=https://your-vercel-deployment-url.vercel.app
NEXTAUTH_SECRET=generate_a_random_secret_string
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
TAVILY_API_KEY=your_tavily_api_key
```

#### Notes on Environment Variables:

- **DATABASE_URL**: Your PostgreSQL connection string. If using Vercel Postgres, you can connect it directly in the Vercel dashboard.
- **NEXTAUTH_URL**: This should be your Vercel deployment URL (will be available after first deployment).
- **NEXTAUTH_SECRET**: Generate a secure random string (you can use `openssl rand -base64 32` in a terminal).
- **GOOGLE_CLIENT_ID** and **GOOGLE_CLIENT_SECRET**: Obtain from the [Google Cloud Console](https://console.cloud.google.com/).
  - Make sure to add your Vercel deployment URL to the authorized redirect URIs in your Google OAuth settings.
- **TAVILY_API_KEY**: Get from your [Tavily dashboard](https://tavily.com/).

## Step 3: Deploy

1. Click "Deploy"
2. Wait for the build to complete

## Step 4: Database Setup

After deployment, you need to run the Prisma migrations on your production database:

1. Add a new environment variable in Vercel:
   ```
   PRISMA_GENERATE=true
   ```

2. Run the database migrations using Vercel CLI or directly from the Vercel dashboard:
   - Option 1: Using Vercel CLI
     ```bash
     vercel env pull .env.production.local
     npx prisma migrate deploy
     ```
   - Option 2: Using Vercel dashboard
     - Go to your project settings
     - Navigate to the "Functions" tab
     - Find and click on "Console"
     - Run `npx prisma migrate deploy`

## Step 5: Verify Deployment

1. Visit your deployed application at the Vercel URL
2. Test user registration and login
3. Test the search functionality

## Troubleshooting

### Database Connection Issues

- Ensure your database is accessible from Vercel's servers
- Check that your DATABASE_URL is correctly formatted
- Verify that your database user has the necessary permissions

### Authentication Problems

- Confirm that NEXTAUTH_URL matches your actual deployment URL
- Verify that your Google OAuth credentials are correctly configured
- Check that redirect URIs in Google Cloud Console include your Vercel deployment URL

### API Integration Issues

- Verify your TAVILY_API_KEY is correct
- Check Vercel logs for any API-related errors

## Scaling Considerations

- The free tier of Vercel has limitations on serverless function execution time
- Consider upgrading to a paid plan for production applications
- Monitor your database usage and scale accordingly

## Continuous Deployment

Vercel automatically deploys when you push changes to your repository. To disable this:

1. Go to your project settings in Vercel
2. Navigate to the "Git" tab
3. Under "Deploy Hooks", configure your preferred deployment settings