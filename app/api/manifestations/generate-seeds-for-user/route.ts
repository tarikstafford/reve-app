import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST() {
  try {
    const supabase = await createClient()

    // Get the current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      )
    }

    // Get user's profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('name, quality_loved, quality_desired, idol_name')
      .eq('id', user.id)
      .single()

    if (profileError || !profile) {
      return NextResponse.json(
        { success: false, error: 'Profile not found. Please complete onboarding first.' },
        { status: 404 }
      )
    }

    // Call the generate-seeds endpoint with the user's profile data
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

    console.log(`Generating seed manifestations for user ${user.id}`)

    const response = await fetch(`${baseUrl}/api/manifestations/generate-seeds`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userId: user.id,
        profile: {
          name: profile.name,
          qualityLoved: profile.quality_loved,
          qualityDesired: profile.quality_desired,
          idol: profile.idol_name
        }
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Failed to generate seed manifestations:', response.status, errorText)
      return NextResponse.json(
        { success: false, error: 'Failed to generate manifestations' },
        { status: 500 }
      )
    }

    const data = await response.json()
    console.log('Successfully generated seed manifestations:', data)

    return NextResponse.json({
      success: true,
      manifestations: data.manifestations
    })
  } catch (error) {
    console.error('Error generating seed manifestations:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to generate manifestations' },
      { status: 500 }
    )
  }
}
