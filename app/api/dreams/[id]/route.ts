import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient()

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id: dreamId } = await params

    // First, verify the dream belongs to the user
    const { data: dream, error: fetchError } = await supabase
      .from('dreams')
      .select('id, user_id')
      .eq('id', dreamId)
      .single()

    if (fetchError || !dream) {
      return NextResponse.json(
        { success: false, error: 'Dream not found' },
        { status: 404 }
      )
    }

    if (dream.user_id !== user.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      )
    }

    // Delete the dream (this will cascade delete analyses and queue items via DB constraints)
    const { error: deleteError } = await supabase
      .from('dreams')
      .delete()
      .eq('id', dreamId)

    if (deleteError) {
      console.error('Error deleting dream:', deleteError)
      return NextResponse.json(
        { success: false, error: 'Failed to delete dream' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Dream deleted successfully'
    })
  } catch (error) {
    console.error('Error in DELETE /api/dreams/[id]:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
