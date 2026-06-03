import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  const { sessionId } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: questions } = await supabase
    .from('exam_questions')
    .select('is_correct, flag_status, question_data')
    .eq('session_id', sessionId)
    .eq('user_id', user.id)

  const score = questions?.filter(q => q.is_correct).length ?? 0

  await supabase
    .from('exam_sessions')
    .update({ status: 'completed', score, completed_at: new Date().toISOString() })
    .eq('id', sessionId)
    .eq('user_id', user.id)

  // Save wrong + flagged questions to persistent review_items
  const toSave = (questions ?? [])
    .filter(q => !q.is_correct || q.flag_status !== null)
    .map(q => ({
      user_id: user.id,
      question_data: q.question_data,
      original_flag_status: q.flag_status ?? null,
    }))

  if (toSave.length > 0) {
    await supabase.from('review_items').insert(toSave)
  }

  return NextResponse.json({ score })
}
