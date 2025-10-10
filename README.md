# Rêve - Dream Journal & Manifestation Platform

A beautiful, ethereal progressive web application for dream journaling, AI-powered dream interpretation, and subconscious exploration.

## Features

### ✨ Core Features
- **Science-Backed Landing Page**: Comprehensive information on dream science, IRT, and manifestation with peer-reviewed research
- **Beautiful Onboarding Flow**: Guided journey to create your ideal self
- **Dream Logging**: Text and voice input for capturing dreams
- **AI Dream Interpretation**: GPT-4 powered analysis of dreams, themes, and emotions
- **Dream Visualization**: DALL-E 3 generated surrealist art for each dream
- **Dream Archive**: Searchable library with filtering by themes and emotions
- **Dream Manifestations**: AI-generated narratives with audio playback for positive reinforcement (based on IRT)
- **Subconscious Conversation**: Chat with your subconscious mind (unlocks after 10 dreams)
- **Profile & Ideal Self**: View and manage your personal journey
- **PWA Support**: Installable as a native-like app

## Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations
- **ShadCN/UI** - Beautiful component library
- **Zustand** - State management

### Backend & Services
- **Supabase** - PostgreSQL database, authentication, and storage
- **OpenAI GPT-4o** - Dream interpretation and conversation
- **OpenAI DALL-E 3** - Dream visualization
- **OpenAI Whisper** - Voice transcription
- **Web Speech API** - Text-to-speech fallback for manifestations

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- Supabase account
- OpenAI API key
- Google Cloud Console account (for OAuth)

### 1. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Run the database schema:
   - Go to SQL Editor in Supabase dashboard
   - Copy and run the contents of `lib/db/schema.sql`
3. Create a storage bucket called `selfies` with public access
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
│   │   ├── onboarding/          # Onboarding flow
│   │   ├── profile/             # User profile
│   │   └── subconscious/        # AI conversation
│   ├── dashboard/               # Main app dashboard
│   ├── landing/                 # Landing page
│   ├── onboarding/              # Onboarding page
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Root redirect
├── components/                   # React components
│   ├── dashboard/               # Dashboard layout
│   ├── dreams/                  # Dream components
│   ├── landing/                 # Landing page sections
│   ├── manifestations/          # Manifestation components
│   ├── onboarding/              # Onboarding flow
│   ├── profile/                 # Profile components
│   ├── subconscious/            # Chat components
│   └── ui/                      # ShadCN UI components
├── lib/                          # Utilities and configuration
│   ├── db/                      # Database types and schema
│   ├── store/                   # Zustand stores
│   └── supabase/                # Supabase client setup
└── public/                       # Static assets
    └── manifest.json            # PWA manifest
```

## Key Features Implementation

### Landing Page
The landing page (`/landing`) is a comprehensive, science-backed introduction to Rêve featuring:

**Sections:**
- **Hero**: Eye-catching introduction with key statistics (70% IRT success rate, 20-45% anxiety reduction, 90% dream recall)
- **Features**: Six core features with benefits backed by research
- **Science**: Four research studies from peer-reviewed journals (PubMed Central, Stanford, Harvard, UCLA)
- **Image Rehearsal Therapy**: Deep dive into IRT with clinical results and effect sizes
- **How It Works**: Six-step journey from onboarding to transformation
- **Quotes**: Wisdom from Carl Jung, Sigmund Freud, Stephen LaBerge, and Robert Stickgold
- **CTA**: Clear call-to-action with 7-day free trial offer

**Research Citations:**
- PMC4120639 (IRT Meta-Analysis)
- PMC8935176 (Journaling & Mental Health)
- Stanford Research on Neuroplasticity (Dr. James Doty, 2024)
- UCLA Neuroimaging Research
- American Academy of Sleep Medicine recommendations

All statistics and claims are backed by published research with effect sizes and sample data included.

### Dream Logging
- Text input with rich textarea
- Voice recording with Web Audio API
- Audio transcription via OpenAI Whisper
- Automatic AI interpretation using GPT-4
- DALL-E 3 visualization generation

### Dream Archive
- Real-time search across content, themes, and emotions
- Beautiful card-based grid layout
- Animated transitions with Framer Motion
- Detailed dream view dialog

### Dream Manifestations
- AI-generated positive narratives
- Text-to-speech audio playback
- Beautiful visualization with progress tracking
- Play count tracking

### Subconscious Chat
- Unlocks after logging 10 dreams
- Context-aware responses based on dream history
- Conversational AI using GPT-4
- Real-time message streaming
- Beautiful chat interface

### Onboarding
- Multi-step guided flow
- AI-generated ideal self portrait
- Narrative generation based on user input
- 3 seed manifestations created automatically

## Database Schema

The app uses PostgreSQL via Supabase with the following main tables:
- `profiles` - User profiles and subscription info
- `dreams` - Dream logs with interpretations
- `manifestations` - Generated manifestations
- `conversations` - Subconscious chat sessions
- `messages` - Chat messages

See `lib/db/schema.sql` for the complete schema with RLS policies.

## API Routes

- `POST /api/onboarding/generate-ideal-self` - Generate ideal self
- `POST /api/onboarding/complete` - Complete onboarding
- `POST /api/dreams/create` - Create new dream with interpretation
- `POST /api/dreams/transcribe` - Transcribe voice recording
- `GET /api/dreams` - Get user's dreams
- `GET /api/dreams/count` - Get dream count
- `POST /api/manifestations/generate-seeds` - Generate seed manifestations
- `GET /api/manifestations` - Get user's manifestations
- `POST /api/subconscious/chat` - Chat with subconscious
- `GET /api/subconscious/messages` - Get chat history
- `GET /api/profile` - Get user profile

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Environment Setup for Production

Make sure to update:
- `NEXT_PUBLIC_APP_URL` to your production URL
- All Supabase URLs and keys for production
- OpenAI API key with appropriate rate limits

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

## License

MIT

---

Built with ✨ for connecting with your subconscious
