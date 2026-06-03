import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { ExamQuestion } from '@/lib/types'
import RetrySection from './RetrySection'

export default async function ResultsPage({
  params,
}: {
  params: Promise<{ sessionId: string }>
}) {
  const { sessionId } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: session } = await supabase
    .from('exam_sessions')
    .select('*')
    .eq('id', sessionId)
    .eq('user_id', user.id)
    .single()

  if (!session) redirect('/dashboard')

  const { data: questions } = await supabase
    .from('exam_questions')
    .select('*')
    .eq('session_id', sessionId)
    .order('position')

  const qs: ExamQuestion[] = questions ?? []
  const score = session.score ?? qs.filter(q => q.is_correct).length
  const total = session.total_questions
  const pct = Math.round((score / total) * 100)

  const scoreColor = pct >= 70 ? 'text-green-600' : pct >= 50 ? 'text-yellow-600' : 'text-red-600'
  const scoreMsg = pct >= 70 ? '合格圏内！素晴らしい出来です 🎉' : pct >= 50 ? 'もう少し！復習して再挑戦しましょう 💪' : '要復習。チェックした問題から始めましょう 📚'

  const CATEGORY_COLORS: Record<string, string> = {
    語彙: 'bg-blue-100 text-blue-700',
    文法: 'bg-purple-100 text-purple-700',
    漢字: 'bg-orange-100 text-orange-700',
    読解: 'bg-green-100 text-green-700',
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-indigo-700 text-white shadow">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <h1 className="text-lg font-bold">試験結果</h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        {/* Score card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
          <p className={`text-6xl font-bold ${scoreColor}`}>{pct}%</p>
          <p className="text-gray-500 mt-2">{score} / {total} 問正解</p>
          <p className="text-gray-700 font-medium mt-3">{scoreMsg}</p>
        </div>

        {/* Question summary */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-800">問題一覧</h2>
          </div>
          <ul className="divide-y divide-gray-100">
            {qs.map((q, i) => {
              const catColor = CATEGORY_COLORS[q.question_data.category] ?? 'bg-gray-100 text-gray-700'
              return (
                <li key={q.id} className="px-5 py-3 flex items-center gap-3">
                  <span className="text-sm font-semibold text-gray-400 w-6">{i + 1}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${catColor}`}>
                    {q.question_data.category}
                  </span>
                  <p className="flex-1 text-sm text-gray-700 truncate">{q.question_data.question}</p>
                  <div className="flex items-center gap-1.5 shrink-0">
                    {q.flag_status && (
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        q.flag_status === 'unknown' ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-600'
                      }`}>
                        {q.flag_status === 'unknown' ? '❓' : '🤔'}
                      </span>
                    )}
                    <span>{q.is_correct ? '✅' : '❌'}</span>
                  </div>
                </li>
              )
            })}
          </ul>
        </div>

        {/* Retry wrong/flagged questions */}
        <RetrySection questions={qs} />

        {/* Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Link
            href="/review"
            className="bg-white hover:bg-gray-50 border border-gray-200 text-gray-800 rounded-xl p-4 text-center font-semibold transition-colors"
          >
            🔍 復習する
          </Link>
          <Link
            href="/exam"
            className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl p-4 text-center font-semibold transition-colors"
          >
            📝 再挑戦
          </Link>
        </div>
        <Link href="/dashboard" className="block text-center text-sm text-indigo-600 hover:underline">
          ダッシュボードへ →
        </Link>
      </main>
    </div>
  )
}
