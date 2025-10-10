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

    // Fetch user's dreams
    const { data: dreams, error } = await supabase
      .from('dreams')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching dreams:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to fetch dreams' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      dreams: dreams || []
    })
  } catch (error) {
    console.error('Error in dreams API:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
