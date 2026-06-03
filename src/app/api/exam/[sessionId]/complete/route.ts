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

  const { data: session } = await supabase
    .from('exam_sessions')
    .select('total_questions, level')
    .eq('id', sessionId)
    .eq('user_id', user.id)
    .single()

  const score = questions?.filter(q => q.is_correct).length ?? 0
  const total = session?.total_questions ?? questions?.length ?? 0
  const isPerfect = score === total && total > 0

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
      level: session?.level ?? 'n2',
    }))

  if (toSave.length > 0) {
    await supabase.from('review_items').insert(toSave)
  }

  // Award 1000 points for perfect score
  let newPoints: number | null = null
  if (isPerfect) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('points')
      .eq('id', user.id)
      .single()

    const current = profile?.points ?? 0
    newPoints = current + 1000

    await supabase
      .from('profiles')
      .update({ points: newPoints })
      .eq('id', user.id)
  }

  return NextResponse.json({ score, isPerfect, newPoints })
}
