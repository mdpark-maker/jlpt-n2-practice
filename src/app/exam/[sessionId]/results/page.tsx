import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { ExamQuestion } from '@/lib/types'
import RetrySection from './RetrySection'
import { Pokeball, HpBar } from '@/components/PokeUI'

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

  const isWin = pct >= 70
  const isMid = pct >= 50

  const CATEGORY_COLORS: Record<string, string> = {
    語彙: 'bg-blue-100 text-blue-700',
    文法: 'bg-purple-100 text-purple-700',
    漢字: 'bg-orange-100 text-orange-700',
    読解: 'bg-green-100 text-green-700',
  }

  return (
    <div className="min-h-screen bg-red-50">
      <header className="bg-red-600 text-white shadow">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-2">
          <Pokeball size={20} />
          <h1 className="text-sm font-black">バトル結果</h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-5">
        {/* Score card */}
        <div className="poke-card bg-white p-7 text-center anim-pop">
          <div className="text-5xl mb-2">
            {isWin ? '🏆' : isMid ? '💪' : '🔥'}
          </div>
          <p className={`text-5xl font-black mb-1 ${isWin ? 'text-green-600' : isMid ? 'text-amber-600' : 'text-red-600'}`}>
            {pct}%
          </p>
          <p className="text-gray-400 text-sm mb-3">{score} / {total} 問正解</p>
          <div className="max-w-xs mx-auto mb-3">
            <HpBar pct={pct} />
          </div>
          <p className={`font-black text-base ${isWin ? 'text-green-700' : isMid ? 'text-amber-700' : 'text-red-700'}`}>
            {isWin ? '🎉 すばらしい！合格圏内！' : isMid ? 'もう少し！再挑戦しよう 💪' : '要復習！諦めないで！🔥'}
          </p>
        </div>

        {/* Retry section (wrong + flagged) */}
        <RetrySection questions={qs} />

        {/* Question summary */}
        <div className="bg-white rounded-2xl border-2 border-amber-100 overflow-hidden shadow-sm">
          <div className="px-5 py-3 border-b border-amber-100 bg-amber-50">
            <h2 className="font-black text-gray-800">問題一覧</h2>
          </div>
          <ul className="divide-y divide-gray-100">
            {qs.map((q, i) => {
              const catColor = CATEGORY_COLORS[q.question_data.category] ?? 'bg-gray-100 text-gray-700'
              return (
                <li key={q.id} className="px-5 py-3 flex items-center gap-3">
                  <span className="text-xs font-black text-gray-400 w-6 shrink-0">{i + 1}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-black shrink-0 ${catColor}`}>
                    {q.question_data.category}
                  </span>
                  <p className="flex-1 text-sm text-gray-700 truncate">{q.question_data.question}</p>
                  <div className="flex items-center gap-1.5 shrink-0">
                    {q.flag_status && (
                      <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                        q.flag_status === 'unknown' ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'
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

        {/* Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Link
            href="/review"
            className="bg-white hover:bg-amber-50 border-2 border-amber-200 text-gray-800 rounded-xl p-4 text-center font-black transition-colors text-sm"
          >
            📒 復習ノート
          </Link>
          <Link
            href="/exam"
            className="bg-red-600 hover:bg-red-700 text-white rounded-xl p-4 text-center font-black transition-colors text-sm"
          >
            ⚡ 新バトル！
          </Link>
        </div>
        <Link href="/dashboard" className="block text-center text-sm text-red-600 hover:underline font-bold">
          ダッシュボードへ →
        </Link>
      </main>
    </div>
  )
}
