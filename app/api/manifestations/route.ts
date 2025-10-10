import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
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

    // Fetch user's manifestations
    const { data: manifestations, error } = await supabase
      .from('manifestations')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching manifestations:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to fetch manifestations' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      manifestations: manifestations || []
    })
  } catch (error) {
    console.error('Error in manifestations API:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
