import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const origin = requestUrl.origin

  if (code) {
    const supabase = await createClient()

    // Exchange code for session
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (error) {
      console.error('Error exchanging code for session:', error)
      return NextResponse.redirect(`${origin}/onboarding?error=auth_failed`)
    }

    // Get the user
    const { data: { user } } = await supabase.auth.getUser()

    if (user) {
      // Check if profile exists
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      // If profile doesn't exist, redirect to complete onboarding
      if (!profile) {
        return NextResponse.redirect(`${origin}/auth/complete-onboarding`)
      }

      // If profile exists, go to dashboard
      return NextResponse.redirect(`${origin}/dashboard`)
    }
  }

  // If no code or user, redirect to onboarding
  return NextResponse.redirect(`${origin}/onboarding`)
}
