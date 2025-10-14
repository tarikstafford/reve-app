# Supabase Storage Setup Guide

This guide walks you through setting up the required storage buckets for Rêve.

## Overview

Rêve uses Supabase Storage for two purposes:
1. **User-uploaded content** - Selfies during onboarding
2. **AI-generated media** - Dream/manifestation images and videos

## Public vs Private Buckets

You have two options:

### Option 1: Public Buckets (Simpler, Recommended for MVP)
- ✅ **Pros**: Simpler setup, URLs work immediately, no signed URL generation needed
- ⚠️ **Cons**: Anyone with the URL can access files (security through obscurity)
- **Best for**: Development, MVP, when URLs aren't guessable

### Option 2: Private Buckets with RLS (More Secure)
- ✅ **Pros**: True access control, users can only access their own files
- ⚠️ **Cons**: More complex setup, requires RLS policies
- **Best for**: Production, when handling sensitive user data

**This guide shows Option 1 (public buckets) for simplicity. See "Private Bucket Setup" section for Option 2.**

## Step-by-Step Instructions

### 1. Navigate to Storage

1. Go to your Supabase project dashboard
2. Click **Storage** in the left sidebar
3. You'll see the storage buckets interface

### 2. Create the `selfies` Bucket

This bucket stores user-uploaded selfies during the onboarding flow.

1. Click **"New bucket"** button
2. Fill in the details:
   - **Name**: `selfies`
   - **Public bucket**: ✅ **Check this** (selfies need to be publicly accessible for display)
   - **File size limit**: Leave default (50MB is fine)
   - **Allowed MIME types**: Leave empty or add: `image/jpeg, image/png, image/webp`

3. Click **"Create bucket"**

4. **Set up RLS policies** (optional but recommended):
   - Click on the `selfies` bucket
   - Go to **Policies** tab
   - Add a policy for uploads:
     ```sql
     -- Allow users to upload their own selfies
     CREATE POLICY "Users can upload their own selfies"
     ON storage.objects FOR INSERT
     TO authenticated
     WITH CHECK (
       bucket_id = 'selfies' AND
       (storage.foldername(name))[1] = auth.uid()::text
     );
     ```
   - Add a policy for reads:
     ```sql
     -- Allow public read access to selfies
     CREATE POLICY "Public read access to selfies"
     ON storage.objects FOR SELECT
     TO public
     USING (bucket_id = 'selfies');
     ```

### 3. Create the `media` Bucket

This bucket stores AI-generated images and videos (dreams and manifestations).

1. Click **"New bucket"** button again
2. Fill in the details:
   - **Name**: `media`
   - **Public bucket**: ✅ **Check this** (media needs to be publicly accessible)
   - **File size limit**: Increase to **100MB** (videos can be large)
   - **Allowed MIME types**: Leave empty or add: `image/png, image/jpeg, video/mp4`

3. Click **"Create bucket"**

4. **Set up RLS policies** (optional but recommended):
   - Click on the `media` bucket
   - Go to **Policies** tab
   - Add a policy for server-side uploads:
     ```sql
     -- Allow service role to upload media
     CREATE POLICY "Service role can upload media"
     ON storage.objects FOR INSERT
     TO service_role
     WITH CHECK (bucket_id = 'media');
     ```
   - Add a policy for reads:
     ```sql
     -- Allow public read access to media
     CREATE POLICY "Public read access to media"
     ON storage.objects FOR SELECT
     TO public
     USING (bucket_id = 'media');
     ```

## Verify Setup

After creating both buckets, verify they're set up correctly:

1. Go to **Storage** in Supabase dashboard
2. You should see two buckets:
   - ✅ `selfies` (Public)
   - ✅ `media` (Public)

3. Test upload (optional):
   - Click on the `media` bucket
   - Try uploading a test file
   - Copy the public URL and verify it's accessible in a browser

## File Structure

The app will organize files in the buckets as follows:

### `selfies` bucket:
```
selfies/
└── {user_id}/
    └── selfie.png
```

### `media` bucket:
```
media/
├── dreams/
│   └── {user_id}/
│       └── {dream_id}/
│           ├── image.png
│           └── video.mp4
├── manifestations/
│   └── {user_id}/
│       └── {manifestation_id}/
│           ├── image.png
│           └── video.mp4
└── profiles/
    └── {user_id}/
        └── ideal-self.png
```

## Troubleshooting

### Files not accessible
- **Issue**: Getting 404 or permission errors when accessing files
- **Solution**: Make sure the bucket is marked as **Public**
- Go to Storage → Click bucket → Settings → Enable "Public bucket"

### Upload fails
- **Issue**: "new row violates row-level security policy" error
- **Solution**: Either:
  1. Use service role key for backend uploads (recommended)
  2. Add RLS policies as shown above
  3. Temporarily disable RLS (not recommended for production)

### Videos not playing
- **Issue**: Video files upload but won't play in browser
- **Solution**:
  1. Check file size limit (increase to 100MB+)
  2. Verify MIME type is `video/mp4`
  3. Ensure public access is enabled

## Private Bucket Setup (Alternative)

If you prefer private buckets with proper access control:

### 1. Create Buckets as Private

- Create both `selfies` and `media` buckets
- ❌ **Do NOT** check "Public bucket"

### 2. Add RLS Policies

For the `media` bucket:

```sql
-- Allow authenticated users to read their own media
CREATE POLICY "Users can read their own media"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'media' AND
  (storage.foldername(name))[1] = 'dreams' AND
  (storage.foldername(name))[2] = auth.uid()::text
  OR
  (storage.foldername(name))[1] = 'manifestations' AND
  (storage.foldername(name))[2] = auth.uid()::text
  OR
  (storage.foldername(name))[1] = 'profiles' AND
  (storage.foldername(name))[2] = auth.uid()::text
);

-- Allow service role to upload media
CREATE POLICY "Service role can upload media"
ON storage.objects FOR INSERT
TO service_role
WITH CHECK (bucket_id = 'media');

-- Allow service role to update media
CREATE POLICY "Service role can update media"
ON storage.objects FOR UPDATE
TO service_role
USING (bucket_id = 'media');
```

### 3. Frontend Access with Private Buckets

The current code uses `getPublicUrl()` which works for both public and private buckets:
- **Public buckets**: Returns a permanent public URL
- **Private buckets**: Returns a URL that requires authentication

For private buckets, the frontend will automatically use the user's session to access files since we're using the authenticated Supabase client.

**No code changes needed!** The app will work with both public and private buckets.

## Security Notes

### Public Buckets
- **Pros**: Simpler setup, no auth needed for media display
- **Cons**: Anyone with URL can access files (but URLs contain UUIDs making them hard to guess)
- **Risk**: Low for dream images/videos (not sensitive personal data)

### Private Buckets
- **Pros**: Proper access control, users can only see their own files
- **Cons**: Slightly more complex, requires session management
- **Benefit**: Better for user privacy and regulatory compliance

**Recommendation**:
- **Development/MVP**: Use public buckets for simplicity
- **Production**: Consider private buckets if handling sensitive data or for regulatory compliance

### Other Security Measures
- **Service role**: Backend uses service role key to bypass RLS for uploads
- **User isolation**: Files are organized by user ID to maintain data separation
- **UUID paths**: Dream/manifestation IDs are UUIDs, making URLs unguessable

## Next Steps

After setting up storage:
1. ✅ Verify both buckets are created and public
2. ✅ Run the database migrations (`schema.sql`, etc.)
3. ✅ Set up environment variables (`.env.local`)
4. ✅ Test the application by creating a dream

---

**Need help?** Check the [Supabase Storage documentation](https://supabase.com/docs/guides/storage) or open an issue.
