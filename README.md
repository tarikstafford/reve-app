# Rêve - Dream Journal & Manifestation Platform

A beautiful, ethereal progressive web application for dream journaling, AI-powered dream interpretation, and subconscious exploration.

## Features

### ✨ Core Features
- **Science-Backed Landing Page**: Narrative-driven story journey with surreal imagery, backed by peer-reviewed research
- **Science Page**: Comprehensive research citations on dream science, IRT, and manifestation
- **Beautiful Onboarding Flow**: Guided journey to create your ideal self with AI-generated portrait
- **Dream Logging**: Text and voice input for capturing dreams
- **AI Dream Interpretation**: GPT-4o powered analysis of dreams, themes, and emotions
- **Dream Visualization**: Kie.ai generated surrealist images and Veo3 videos for each dream
- **Async Media Generation**: Background queue processing with real-time status updates
- **Dream Archive**: Searchable library with filtering by themes and emotions, auto-polling for media updates
- **Dream Manifestations**: AI-generated narratives with audio playback for positive reinforcement (based on IRT)
- **Subconscious Conversation**: Chat with your subconscious mind (unlocks after 10 dreams)
- **Profile & Ideal Self**: View and manage your personal journey
- **PWA Support**: Installable as a native-like app

## Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router and Turbopack
- **TypeScript** - Type-safe development
- **Tailwind CSS v4** - Utility-first styling
- **Framer Motion** - Smooth animations
- **ShadCN/UI** - Beautiful component library
- **Zustand** - State management

### Backend & Services
- **Supabase** - PostgreSQL database, authentication (Google OAuth), and storage
- **OpenAI GPT-4o** - Dream interpretation and conversation
- **Kie.ai 4O Image API** - Cost-effective image generation (95% cheaper than DALL-E)
- **Kie.ai Veo3 API** - High-quality video generation from images (Google's Veo3 model)
- **OpenAI Whisper** - Voice transcription
- **Web Speech API** - Text-to-speech for manifestations
- **Vercel Cron** - Scheduled background job processing

### Media Generation Architecture
- **Async Queue System**: Database-backed job queue for reliable processing
- **Background Processing**: Non-blocking media generation with automatic retries
- **Permanent Storage**: Downloads from Kie.ai and re-uploads to Supabase Storage
- **Real-time Updates**: Frontend polling every 5 seconds for status changes
- **Stuck Task Recovery**: Auto-resets tasks processing for >10 minutes

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- Supabase account
- OpenAI API key
- Kie.ai API key
- Google Cloud Console account (for OAuth)

### 1. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Run the database schema:
   - Go to SQL Editor in Supabase dashboard
   - Copy and run the contents of `lib/db/schema.sql`
   - Run `lib/db/add_video_url_to_dreams.sql` to add video support
   - Run `lib/db/add_media_status_and_queue.sql` to add async queue system
3. **Create storage buckets** (see [STORAGE_SETUP.md](./STORAGE_SETUP.md) for detailed instructions):
   - `selfies` - For user-uploaded selfies during onboarding (public bucket)
   - `media` - For AI-generated dream/manifestation images and videos (public bucket, 100MB limit)
4. Get your project URL and keys from Settings > API
5. **Set up Google OAuth** (see [AUTHENTICATION_SETUP.md](./AUTHENTICATION_SETUP.md) for detailed instructions):
   - Enable Google provider in Supabase Authentication settings
   - Create OAuth credentials in Google Cloud Console
   - Configure redirect URLs

### 2. Set Up Environment Variables

Copy `.env.example` to `.env.local` and fill in your credentials:

```bash
cp .env.example .env.local
```

Required variables:
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# OpenAI
OPENAI_API_KEY=your_openai_api_key

# Kie.ai (for image and video generation)
KIE_AI_API_KEY=your_kie_ai_api_key

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Project Structure

```
reve-app/
├── app/                          # Next.js App Router
│   ├── api/                      # API routes
│   │   ├── dreams/              # Dream logging & interpretation
│   │   ├── manifestations/      # Manifestation generation
│   │   ├── media/               # Media generation queue processor
│   │   ├── onboarding/          # Onboarding flow
│   │   ├── profile/             # User profile
│   │   └── subconscious/        # AI conversation
│   ├── auth/                    # Authentication callbacks
│   ├── dashboard/               # Main app dashboard
│   ├── landing/                 # Landing page
│   ├── onboarding/              # Onboarding page
│   ├── science/                 # Science & research page
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Root redirect
├── components/                   # React components
│   ├── dashboard/               # Dashboard layout
│   ├── dreams/                  # Dream components (with polling)
│   ├── landing/                 # Landing page sections
│   ├── manifestations/          # Manifestation components
│   ├── onboarding/              # Onboarding flow
│   ├── profile/                 # Profile components
│   ├── science/                 # Research sections
│   ├── subconscious/            # Chat components
│   └── ui/                      # ShadCN UI components
├── lib/                          # Utilities and configuration
│   ├── db/                      # Database types and schema
│   ├── kie-ai/                  # Kie.ai API client
│   ├── storage/                 # Supabase Storage helpers
│   ├── store/                   # Zustand stores
│   └── supabase/                # Supabase client setup
├── public/                       # Static assets
│   └── manifest.json            # PWA manifest
└── vercel.json                  # Vercel config with cron jobs
```

## Key Features Implementation

### Landing Page
The landing page (`/landing`) is a narrative-driven story journey featuring:

**Sections:**
- **Hero**: Dark cosmic theme - "You Stand at the Edge of Change"
- **Story Journey**: Scroll-based narrative with surreal imagery
- **The Science**: Data and facts backing the transformation story
- **IRT Deep Dive**: Image Rehearsal Therapy explained
- **How It Works**: Six-step journey
- **Quotes**: Jung, Freud, LaBerge, Stickgold
- **CTA**: Free trial with Google sign-in

### Science Page
Comprehensive research page (`/science`) with:
- Collective exploration disclaimer
- Research categories: IRT, Dream Journaling, Neuroplasticity, Sleep Science
- Full citations with URLs to peer-reviewed journals
- Effect sizes and sample data
- Emphasis on shared growth and discovery

### Dream Logging & Visualization
**Creation Flow:**
1. User enters dream via text or voice
2. Voice transcription via OpenAI Whisper
3. AI interpretation with GPT-4o (themes, emotions)
4. Dream saved to database with `media_status: 'pending'`
5. Job inserted into `media_generation_queue` table
6. Background processor triggered via API call
7. User sees dream immediately with loading state

**Background Media Generation:**
1. Vercel Cron runs `/api/media/process-queue` every minute
2. Fetches next pending task from queue (FIFO)
3. Generates image with Kie.ai 4O Image API (~30 seconds, polls every 2s)
4. Downloads and uploads image to Supabase Storage
5. Generates video from image with Kie.ai Veo3 (~2-5 minutes, polls every 5s)
6. Downloads and uploads video to Supabase Storage
7. Updates dream with URLs and `media_status: 'completed'`
8. Frontend polls every 5 seconds and auto-updates when complete

**Cost Optimization:**
- Kie.ai: $0.15 per 10s video (vs $3-5 with OpenAI)
- 95% cost savings on media generation

### Dream Archive
- Real-time search across content, themes, and emotions
- Beautiful card-based grid layout
- Animated transitions with Framer Motion
- Loading states for pending/processing media
- Auto-refresh after dream creation via ref callback
- Polling mechanism for dreams with pending media
- Video player with autoplay, loop, muted (priority)
- Image fallback if no video
- Detailed dream view dialog with context

### Dream Manifestations
- AI-generated positive narratives based on IRT
- Text-to-speech audio playback
- Beautiful visualization with progress tracking
- Play count tracking
- Async video generation (same queue system)

### Subconscious Chat
- Unlocks after logging 10 dreams
- Context-aware responses based on dream history
- Conversational AI using GPT-4o
- Real-time message streaming
- Beautiful chat interface

### Onboarding
- Multi-step guided flow with animations
- AI-generated ideal self portrait (Kie.ai)
- Narrative generation based on user input
- 3 seed manifestations created automatically
- Google OAuth integration

## Database Schema

The app uses PostgreSQL via Supabase with the following main tables:
- `profiles` - User profiles and subscription info
- `dreams` - Dream logs with interpretations, media_status, image_url, video_url
- `manifestations` - Generated manifestations with media_status, image_url, video_url, audio_url
- `media_generation_queue` - Async job queue for media processing
- `conversations` - Subconscious chat sessions
- `messages` - Chat messages
- `dream_analytics` - Analytics and patterns

All tables have Row Level Security (RLS) policies enabled for user data isolation.

See `lib/db/schema.sql` for the complete schema with RLS policies.

## API Routes

### Authentication
- `GET /auth/callback` - OAuth callback handler

### Onboarding
- `POST /api/onboarding/generate-ideal-self` - Generate ideal self with Kie.ai
- `POST /api/onboarding/complete` - Complete onboarding

### Dreams
- `POST /api/dreams/create` - Create new dream with interpretation (queues media)
- `POST /api/dreams/transcribe` - Transcribe voice recording with Whisper
- `GET /api/dreams` - Get user's dreams
- `GET /api/dreams/count` - Get dream count
- `GET /api/dreams/[id]/status` - Check media generation status

### Media Processing
- `GET /api/media/process-queue` - Process next media generation task (Vercel Cron)
- `POST /api/media/process-queue` - Manual trigger for media processing

### Manifestations
- `POST /api/manifestations/generate-seeds` - Generate seed manifestations
- `GET /api/manifestations` - Get user's manifestations
- `POST /api/manifestations/[id]/play` - Increment play count

### Subconscious Chat
- `POST /api/subconscious/chat` - Chat with subconscious
- `GET /api/subconscious/messages` - Get chat history

### Profile
- `GET /api/profile` - Get user profile

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard:
   - All Supabase keys
   - OpenAI API key
   - Kie.ai API key
   - `NEXT_PUBLIC_APP_URL` (use Vercel URL)
4. Deploy
5. **Cron Jobs**: Vercel will automatically set up the cron job defined in `vercel.json` to run every minute

### Environment Setup for Production

Make sure to update:
- `NEXT_PUBLIC_APP_URL` to your Vercel production URL (e.g., https://your-app.vercel.app)
- All Supabase URLs and keys for production
- OpenAI API key with appropriate rate limits
- Kie.ai API key

### Post-Deployment Checklist

1. ✅ Verify Vercel Cron is running (check Vercel dashboard)
2. ✅ Test dream creation and media generation
3. ✅ Check Supabase Storage buckets are publicly accessible
4. ✅ Verify Google OAuth redirect URLs in both Google Cloud Console and Supabase
5. ✅ Monitor Kie.ai API usage and credits

## Architecture Highlights

### Async Media Generation
- **Problem**: Media generation takes 2-5 minutes, exceeding Vercel's serverless timeout
- **Solution**: Database-backed job queue with background processing
- **Benefits**:
  - Instant dream creation response
  - Reliable processing even if user closes browser
  - Automatic retries (max 3 attempts)
  - Stuck task recovery (>10 minutes)
  - Vercel Cron ensures processing continues

### Real-time UI Updates
- Frontend polls every 5 seconds for dreams with `media_status` = 'pending' or 'processing'
- Loading states with encouraging messages ("This usually takes 2-5 minutes...")
- Auto-stops polling when all media is complete
- Auto-refresh after dream creation

### Cost Optimization
- Replaced DALL-E 3 + official Sora with Kie.ai
- Reduced cost from ~$3-5 per video to $0.15
- 95% cost savings on media generation
- Same quality output with faster generation

## PWA Installation

The app can be installed as a PWA on:
- iOS (Safari: Share > Add to Home Screen)
- Android (Chrome: Menu > Install App)
- Desktop (Chrome/Edge: Install icon in address bar)

## Future Enhancements

- [ ] Stripe subscription integration
- [ ] ElevenLabs API for professional audio generation
- [ ] Dream analytics and patterns visualization
- [ ] Export dreams as PDF
- [ ] Social features (optional anonymous dream sharing)
- [ ] Mobile app with React Native/Capacitor
- [ ] Push notifications for daily journaling reminders
- [ ] Dark mode
- [ ] Batch media generation for multiple dreams
- [ ] Advanced queue management (priority, cancellation)

## Troubleshooting

### Media not generating?
1. Check Vercel Cron logs in Vercel dashboard
2. Verify `KIE_AI_API_KEY` is set in environment variables
3. Check `media_generation_queue` table for failed tasks
4. Manually trigger processing: `POST /api/media/process-queue`

### Dreams not showing media?
1. Check `media_status` field in dreams table
2. Look for error messages in `media_generation_queue.error_message`
3. Verify Supabase Storage bucket `media` exists and is public

### Authentication issues?
1. Verify Google OAuth credentials in Google Cloud Console
2. Check redirect URLs match in both Google and Supabase
3. Clear browser cookies and try again

## License

MIT

---

Built with ✨ for connecting with your subconscious and manifesting your ideal self
