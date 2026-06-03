import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { QuestionData } from '@/lib/types'

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { questions, level = 'n2' }: { questions: QuestionData[]; level?: string } = await request.json()
  if (!questions?.length) return NextResponse.json({ error: 'No questions provided' }, { status: 400 })

  const { data: session, error: sessionError } = await supabase
    .from('exam_sessions')
    .insert({ user_id: user.id, total_questions: questions.length, is_retry: true, level })
    .select()
    .single()

  if (sessionError) return NextResponse.json({ error: sessionError.message }, { status: 500 })

  const questionRows = questions.map((q, i) => ({
    session_id: session.id,
    user_id: user.id,
    question_data: q,
    position: i,
  }))

  const { error: qError } = await supabase
    .from('exam_questions')
    .insert(questionRows)

  if (qError) return NextResponse.json({ error: qError.message }, { status: 500 })

  return NextResponse.json({ sessionId: session.id })
}
