import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  const { sessionId } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { questionId, answer } = await request.json()

  const { data: question } = await supabase
    .from('exam_questions')
    .select('question_data')
    .eq('id', questionId)
    .eq('session_id', sessionId)
    .eq('user_id', user.id)
    .single()

  if (!question) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const is_correct = question.question_data.correct_answer === answer

  await supabase
    .from('exam_questions')
    .update({ user_answer: answer, is_correct, answered_at: new Date().toISOString() })
    .eq('id', questionId)

  return NextResponse.json({
    is_correct,
    correct_answer: question.question_data.correct_answer,
    explanation: question.question_data.explanation,
  })
}
