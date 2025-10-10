# Google Authentication Setup Guide

This guide will walk you through setting up Google OAuth authentication with Supabase for Rêve.

## Prerequisites

- Supabase project created
- Google Cloud Console access

## Step 1: Set Up Google OAuth in Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to **APIs & Services** > **Credentials**
4. Click **Create Credentials** > **OAuth 2.0 Client ID**
5. If prompted, configure the OAuth consent screen first:
   - Choose **External** user type
   - Fill in app name: "Rêve"
   - Add support email
   - Add authorized domain (your domain)
   - Add scopes: `email`, `profile`, `openid`
   - Save and continue

6. Create OAuth 2.0 Client ID:
   - Application type: **Web application**
   - Name: "Rêve Web Client"
   - Authorized JavaScript origins:
     - `http://localhost:3000` (for development)
     - Your production domain (e.g., `https://yourdomain.com`)
   - Authorized redirect URIs:
     - `https://YOUR_SUPABASE_PROJECT_REF.supabase.co/auth/v1/callback`
     - Get this URL from Supabase dashboard

7. Click **Create** and save your:
   - Client ID
   - Client Secret

## Step 2: Configure Supabase

1. Go to your [Supabase Dashboard](https://app.supabase.com/)
2. Select your project
3. Navigate to **Authentication** > **Providers**
4. Find **Google** and click to expand
5. Enable the Google provider
6. Enter your Google OAuth credentials:
   - **Client ID**: Paste from Google Cloud Console
   - **Client Secret**: Paste from Google Cloud Console
7. Copy the **Callback URL** (should be: `https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback`)
8. **Save** the settings

## Step 3: Update Environment Variables

Update your `.env.local` file (already done for you):

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Step 4: Add Redirect URL to Google Cloud Console

1. Go back to **Google Cloud Console** > **Credentials**
2. Click on your OAuth 2.0 Client ID
3. Under **Authorized redirect URIs**, add:
   - `https://YOUR_SUPABASE_PROJECT_REF.supabase.co/auth/v1/callback`
4. **Save**

## Step 5: Test the Flow

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Visit `http://localhost:3000`

3. Complete the onboarding flow

4. When you reach the final step, click "Sign in with Google to Begin"

5. You should be redirected to Google's OAuth consent screen

6. After authorizing, you'll be redirected back to the app and your profile will be created

## Authentication Flow

Here's how the authentication flow works in Rêve:

1. **Onboarding**: User completes onboarding steps (name, age, qualities, etc.)
2. **Ideal Self Generation**: AI generates ideal self narrative and image
3. **Authentication**: User clicks "Sign in with Google to Begin"
4. **OAuth**: User is redirected to Google for authentication
5. **Callback**: Google redirects back to `/auth/callback`
6. **Session Creation**: Supabase exchanges code for session
7. **Profile Creation**: App creates user profile with onboarding data
8. **Manifestations**: 3 seed manifestations are generated
9. **Dashboard**: User is redirected to dashboard

## Routes

- `/onboarding` - Onboarding flow (no auth required)
- `/auth/callback` - OAuth callback handler
- `/auth/complete-onboarding` - Completes profile creation after auth
- `/dashboard` - Main app (requires auth)

## Protected Routes

The dashboard is protected and requires authentication. If a user tries to access it without being authenticated, they'll be redirected to `/onboarding`.

## Sign Out

Users can sign out by clicking the "Sign Out" button in the dashboard header. This will:
1. Clear the Supabase session
2. Redirect to the landing page

## Troubleshooting

### "Error: redirect_uri_mismatch"

- Make sure the redirect URI in Google Cloud Console exactly matches the Supabase callback URL
- Check for trailing slashes or http vs https

### "Error: invalid_client"

- Verify your Client ID and Client Secret in Supabase are correct
- Make sure the Google OAuth credentials are from the same project

### Onboarding data not found

- Check browser console for sessionStorage errors
- Try clearing browser data and starting fresh

### User redirected back to onboarding after auth

- Check if profile was created in Supabase database
- Verify the `/api/onboarding/complete` endpoint is working

## Production Setup

For production deployment:

1. Update authorized domains in Google Cloud Console
2. Add production redirect URI: `https://yourdomain.com/auth/callback`
3. Update `NEXT_PUBLIC_APP_URL` in production environment variables
4. Ensure Supabase URLs are correct for production

## Security Notes

- Never commit `.env.local` to version control
- Client Secret should only be stored in Supabase, never in frontend code
- Use HTTPS in production for all OAuth flows
- The auth callback uses server-side session exchange for security
