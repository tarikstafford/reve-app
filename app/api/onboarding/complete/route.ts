import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const supabase = await createClient()

    // Get the current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      )
    }

    // Upload selfie to Supabase storage if provided
    let selfieUrl = null
    if (data.selfie && data.selfie.startsWith('data:image')) {
      const base64Data = data.selfie.split(',')[1]
      const buffer = Buffer.from(base64Data, 'base64')
      const fileName = `${user.id}-selfie-${Date.now()}.jpg`

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('selfies')
        .upload(fileName, buffer, {
          contentType: 'image/jpeg',
          upsert: true
        })

      if (!uploadError && uploadData) {
        const { data: { publicUrl } } = supabase.storage
          .from('selfies')
          .getPublicUrl(fileName)
        selfieUrl = publicUrl
      }
    }

    // Create or update profile
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert({
        id: user.id,
        name: data.name,
        age: data.age,
        quality_loved: data.qualityLoved,
        quality_desired: data.qualityDesired,
        idol_name: data.idol,
        selfie_url: selfieUrl,
        ideal_self_narrative: data.idealSelfNarrative,
        ideal_self_image_url: data.idealSelfImage,
        trial_ends_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
        subscription_tier: 'free',
        subscription_status: 'trialing',
        updated_at: new Date().toISOString()
      })

    if (profileError) {
      console.error('Profile error:', profileError)
      return NextResponse.json(
        { success: false, error: 'Failed to create profile' },
        { status: 500 }
      )
    }

    // Generate 3 seed manifestations
    try {
      const baseUrl = process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

      const manifestResponse = await fetch(`${baseUrl}/api/manifestations/generate-seeds`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: user.id,
          profile: {
            name: data.name,
            qualityLoved: data.qualityLoved,
            qualityDesired: data.qualityDesired,
            idol: data.idol
          }
        })
      })

      if (!manifestResponse.ok) {
        const errorText = await manifestResponse.text()
        console.error('Failed to generate seed manifestations:', manifestResponse.status, errorText)
      } else {
        console.log('Successfully generated seed manifestations')
      }
    } catch (error) {
      console.error('Error generating seed manifestations:', error)
      // Don't fail the onboarding if this fails
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error completing onboarding:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to complete onboarding' },
      { status: 500 }
    )
  }
}
