# Claude Code Context - Rêve Application

This document provides context for Claude Code when working on the Rêve application. It covers architecture decisions, critical patterns, and important implementation details.

## Application Overview

**Rêve** is a dream journaling and manifestation platform that uses AI to help users explore their subconscious and manifest their ideal self through Image Rehearsal Therapy (IRT).

**Core Value Proposition:**
- Users log dreams via text or voice
- AI interprets dreams and generates video visualizations
- Users practice IRT by replaying positive manifestation narratives
- Subconscious chat unlocks after 10 dreams for deeper exploration

## Critical Architecture Decisions

### 1. Async Media Generation (MOST IMPORTANT)

**Problem Solved:** Media generation with Kie.ai takes 2-5 minutes, which exceeds Vercel's 10-second serverless timeout.

**Solution:** Database-backed job queue with background processing.

**How It Works:**
1. User creates dream → Dream saved immediately with `media_status: 'pending'`
2. Job inserted into `media_generation_queue` table
3. Background processor triggered via fetch (fire-and-forget)
4. Vercel Cron runs `/api/media/process-queue` every minute (defined in `vercel.json`)
5. Processor generates image → uploads to Supabase Storage → generates video → uploads video
6. Dream updated with URLs and `media_status: 'completed'`
7. Frontend polls every 5 seconds and auto-updates

**Key Files:**
- `app/api/media/process-queue/route.ts` - Background processor
- `app/api/dreams/create/route.ts:82-101` - Queue insertion
- `components/dreams/dream-archive.tsx:52-73` - Polling implementation
- `vercel.json` - Cron job configuration

**IMPORTANT:** Never move media generation back to synchronous/blocking calls. Always use the queue system.

### 2. Cost Optimization with Kie.ai

**Decision:** Use Kie.ai instead of OpenAI DALL-E 3 + Sora for media generation.

**Cost Savings:**
- DALL-E 3: ~$0.08 per image + Sora: $3-5 per 10s video = $3-5 total
- Kie.ai: $0.15 per 10s video (includes image generation)
- **95% cost savings**

**Implementation:**
- `lib/kie-ai/client.ts` - Kie.ai API wrapper
- Polling-based generation (check status every 2-5 seconds)
- Automatic retry logic with exponential backoff

**IMPORTANT:** Always use Kie.ai for image/video generation, not OpenAI APIs.

### 3. Permanent Storage Pattern

**Problem:** Kie.ai only stores generated media for 14 days.

**Solution:** Download from Kie.ai and re-upload to Supabase Storage immediately.

**Implementation:**
- `lib/storage/upload.ts:16-56` - Download and upload helper
- Supabase Storage bucket: `media` (public read access)
- Path structure: `dreams/{userId}/{dreamId}/image.png` and `video.mp4`

**IMPORTANT:** Never store Kie.ai URLs directly in the database. Always re-upload to Supabase Storage.

## Database Schema Key Points

### Core Tables

**`profiles`**
- User profiles with subscription info
- `ideal_self_narrative` and `ideal_self_image_url` from onboarding
- Subscription fields (tier, status, Stripe IDs)

**`dreams`**
- Dream logs with AI interpretation
- `media_status`: 'pending' | 'processing' | 'completed' | 'failed'
- `image_url` and `video_url` (Supabase Storage URLs)
- `themes` and `emotions` arrays from GPT-4o analysis

**`manifestations`**
- Positive IRT narratives
- Same media fields as dreams
- `audio_url` for TTS playback
- `is_seed` flag (3 generated during onboarding)
- `play_count` for tracking rehearsal frequency

**`media_generation_queue`**
- Async job queue for media processing
- `entity_type`: 'dream' | 'manifestation' | 'ideal_self'
- `status`: 'pending' | 'processing' | 'completed' | 'failed'
- `attempts` and `max_attempts` (3) for retry logic
- `image_prompt` and `video_prompt` for generation

**RLS (Row Level Security):**
- ALL tables have RLS enabled
- Policies enforce user_id = auth.uid() for all operations
- NEVER disable RLS or create policies that bypass user isolation

### Database Migrations

Files in `lib/db/`:
1. `schema.sql` - Initial schema with all tables
2. `add_video_url_to_dreams.sql` - Adds video support
3. `add_media_status_and_queue.sql` - Adds async queue system

**IMPORTANT:** When setting up new Supabase projects, run all three in order.

## API Routes Architecture

### Authentication Flow
- Google OAuth via Supabase Auth
- Callback: `app/auth/callback/route.ts`
- Middleware: `lib/supabase/middleware.ts` (updates session on every request)
- Protected routes check: `await supabase.auth.getUser()`

### Dream Creation Flow
1. `POST /api/dreams/create`
   - Input: title, content (or transcribed voice)
   - GPT-4o interprets dream (themes, emotions, interpretation)
   - Dream saved with `media_status: 'pending'`
   - Job queued in `media_generation_queue`
   - Triggers background processor via fetch
   - Returns dream immediately (instant response)

2. Background processor (`/api/media/process-queue`)
   - Fetches next pending task (FIFO)
   - Marks as 'processing'
   - Generates image with Kie.ai (~30s)
   - Downloads and uploads to Supabase Storage
   - Generates video with Sora 2 (~2-5min)
   - Downloads and uploads to Supabase Storage
   - Updates dream with URLs and 'completed' status
   - Triggers next task if queue not empty

3. Frontend polling
   - `components/dreams/dream-archive.tsx`
   - Polls every 5 seconds if any dreams have status 'pending' or 'processing'
   - Auto-stops when all dreams complete
   - Shows loading states with progress messages

### Voice Transcription
- `POST /api/dreams/transcribe`
- Accepts audio blob (WebM format)
- Uses OpenAI Whisper API for transcription
- Returns transcribed text
- Client: `components/dreams/dream-log-dialog.tsx:100-120`

## Frontend Patterns

### State Management
- **Zustand** for global state (minimal usage)
- **React Hook** patterns for local state
- **Ref callbacks** for parent-child communication

Example: Dream archive refresh after creation
```typescript
// Parent (dashboard-content.tsx)
const dreamArchiveRefreshRef = useRef<(() => void) | null>(null)

const handleDreamSaved = () => {
  if (dreamArchiveRefreshRef.current) {
    dreamArchiveRefreshRef.current() // Call child's refresh
  }
}

// Child (dream-archive.tsx)
useEffect(() => {
  if (onRefreshRef) {
    onRefreshRef.current = loadDreams // Expose refresh function
  }
}, [onRefreshRef, loadDreams])
```

### Polling Pattern
```typescript
// Poll while pending/processing
useEffect(() => {
  const pendingItems = items.filter(
    i => i.media_status === 'pending' || i.media_status === 'processing'
  )

  if (pendingItems.length > 0) {
    const interval = setInterval(() => loadItems(), 5000)
    return () => clearInterval(interval)
  }
}, [items])
```

### Loading States
- Show encouraging messages during media generation
- "This usually takes 2-5 minutes. You can close this and check back later!"
- Use Framer Motion for smooth transitions
- Loader2 icon with rotation animation

## Component Structure

### Dashboard Flow
1. `app/dashboard/page.tsx` - Protected route wrapper
2. `components/dashboard/dashboard-content.tsx` - Tab navigation
3. Tabs: Dreams, Manifestations, Subconscious, Profile

### Dream Components
- `dream-log-dialog.tsx` - Create dream (text or voice)
- `dream-archive.tsx` - Grid of dream cards with search
- `dream-detail-dialog.tsx` - Full dream view with video

### Onboarding Flow
- Multi-step wizard (9 steps)
- Steps: Welcome → Name → Age → Quality Loved → Quality Desired → Idol → Selfie → Generating → Ideal Self
- `onboarding-flow.tsx` - Main orchestrator
- `steps/` - Individual step components
- Final step generates ideal self image with Kie.ai

## Environment Variables

**Required:**
```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
OPENAI_API_KEY=
KIE_AI_API_KEY=
NEXT_PUBLIC_APP_URL=
```

**IMPORTANT:**
- In production, `NEXT_PUBLIC_APP_URL` must be the Vercel URL
- Never use `localhost` in production environment variables
- Kie.ai API key is for image AND video generation

## Common Issues & Solutions

### Issue: Dreams not showing media
**Cause:** Media generation failed or stuck
**Debug:**
1. Check `media_generation_queue` table for error messages
2. Verify Kie.ai API key is set
3. Check Vercel Cron logs
4. Manually trigger: `POST /api/media/process-queue`

### Issue: Vercel timeout errors
**Cause:** Trying to generate media synchronously
**Solution:** Ensure using async queue pattern (check `app/api/dreams/create/route.ts`)

### Issue: Files not accessible from Supabase Storage
**Cause:** Bucket not public or incorrect path
**Solution:**
1. Go to Supabase Storage
2. Make `media` bucket public
3. Check path follows pattern: `dreams/{userId}/{dreamId}/image.png`

### Issue: Polling not working
**Cause:** Missing dependency or incorrect status check
**Solution:** Verify `media_status` field exists and polling checks both 'pending' and 'processing'

## Development Workflow

### Adding New Media Generation
1. Add job to `media_generation_queue` table
2. Queue processor already handles all entity types
3. Add UI loading state in component
4. Implement polling if real-time updates needed

### Adding New API Route
1. Create route in `app/api/`
2. Use `createClient()` from `@/lib/supabase/server`
3. Always check auth: `await supabase.auth.getUser()`
4. Return `NextResponse.json()`
5. Use try-catch and proper error responses

### Adding Database Table
1. Write migration SQL in `lib/db/`
2. Add TypeScript interface in `lib/db/types.ts`
3. Add RLS policies (enable RLS, create user-scoped policies)
4. Test with different users

## Code Style & Conventions

### TypeScript
- Strict mode enabled
- Use interfaces for data types (not types)
- Avoid `any` - use `unknown` with type guards
- Export types from `lib/db/types.ts`

### React Components
- Use `'use client'` directive for client components
- Prefer functional components with hooks
- Use Framer Motion for animations
- ShadCN/UI for base components

### API Routes
- Always use try-catch blocks
- Return proper status codes (401, 500, etc.)
- Use `NextResponse.json()` consistently
- Add descriptive error messages

### Naming Conventions
- Components: PascalCase (DreamArchive.tsx)
- Files: kebab-case (dream-archive.tsx)
- API routes: kebab-case directories
- Database tables: snake_case

## Key Dependencies

- **Next.js 15**: Latest App Router, Turbopack
- **Supabase**: Auth + Database + Storage
- **OpenAI**: GPT-4o (interpretation), Whisper (transcription)
- **Kie.ai**: Image + Video generation (custom API)
- **Framer Motion**: Animations
- **ShadCN/UI**: Component library
- **Tailwind CSS v4**: Styling
- **date-fns**: Date formatting

## Testing Checklist

When making changes:
- [ ] Test both authenticated and unauthenticated states
- [ ] Verify RLS policies don't leak data between users
- [ ] Check media generation queue processes correctly
- [ ] Test polling stops when media completes
- [ ] Verify Supabase Storage URLs are public
- [ ] Run `npm run build` to check for TypeScript errors
- [ ] Test on mobile viewport

## Deployment Notes

### Vercel Configuration
- `vercel.json` defines cron job for queue processor
- Cron runs every minute: `"schedule": "* * * * *"`
- Environment variables must be set in Vercel dashboard
- Auto-detects Next.js and uses Turbopack

### Supabase Configuration
- Production database separate from development
- Storage buckets must be created manually
- RLS policies applied on production
- Google OAuth redirect URLs must match Vercel domain

## Future Architecture Considerations

### Scaling Media Generation
Current: Sequential processing (one at a time)
Future: Parallel processing with worker pool
- Add `processing_by` field to track workers
- Allow multiple workers to process queue simultaneously
- Implement job locking mechanism

### Caching Strategy
Current: No caching
Future: Redis for:
- Dream count queries
- User profile data
- Recently viewed dreams

### Analytics
Current: Basic `play_count` tracking
Future: Comprehensive analytics:
- Dream frequency patterns
- Theme correlations
- Emotion trends over time
- Manifestation effectiveness

## Contact & Resources

- Kie.ai API Docs: https://docs.kie.ai
- Supabase Docs: https://supabase.com/docs
- Next.js 15 Docs: https://nextjs.org/docs
- IRT Research: PMC4120639, PMC8935176

---

**Last Updated:** 2025-01-14
**App Version:** 1.0.0 (MVP Complete)
