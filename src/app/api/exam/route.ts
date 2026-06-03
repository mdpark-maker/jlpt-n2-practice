import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { generateJLPTQuestions } from '@/lib/openrouter'
import { ExamCategory } from '@/lib/types'

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { count = 10, category = 'all' } = await request.json()

  try {
    const questions = await generateJLPTQuestions(count as number, category as ExamCategory)

    const { data: session, error: sessionError } = await supabase
      .from('exam_sessions')
      .insert({ user_id: user.id, total_questions: questions.length })
      .select()
      .single()

    if (sessionError) throw sessionError

    const questionRows = questions.map((q, i) => ({
      session_id: session.id,
      user_id: user.id,
      question_data: q,
      position: i,
    }))

    const { error: qError } = await supabase
      .from('exam_questions')
      .insert(questionRows)

    if (qError) throw qError

    return NextResponse.json({ sessionId: session.id })
  } catch (err) {
    console.error('Exam creation error:', err)
    return NextResponse.json({ error: 'Failed to create exam' }, { status: 500 })
  }
}
