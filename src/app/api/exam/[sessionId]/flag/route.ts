import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { FlagStatus } from '@/lib/types'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  const { sessionId } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { questionId, flag_status } = await request.json() as {
    questionId: string
    flag_status: FlagStatus | null
  }

  await supabase
    .from('exam_questions')
    .update({ flag_status })
    .eq('id', questionId)
    .eq('session_id', sessionId)
    .eq('user_id', user.id)

  return NextResponse.json({ ok: true })
}
