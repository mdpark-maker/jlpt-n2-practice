import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { ExamQuestion, ExamLevel } from '@/lib/types'
import RetrySection from './RetrySection'
import { Pokeball, HpBar } from '@/components/PokeUI'
import { KittyBow, KittyScoreBar } from '@/components/KittyUI'

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

  const { data: profile } = await supabase
    .from('profiles')
    .select('points')
    .eq('id', user.id)
    .single()

  const qs: ExamQuestion[] = questions ?? []
  const score = session.score ?? qs.filter(q => q.is_correct).length
  const total = session.total_questions
  const pct = Math.round((score / total) * 100)
  const isPerfect = score === total
  const level: ExamLevel = session.level ?? 'n2'
  const isKitty = level === 'n3'
  const currentPoints = profile?.points ?? 0

  const PERFECT_POINTS: Record<number, number> = { 5: 1000, 10: 2000, 20: 5000 }
  const pointsEarned = isPerfect ? (PERFECT_POINTS[total] ?? 1000) : 0

  const isWin = pct >= 70
  const isMid = pct >= 50

  const CATEGORY_COLORS: Record<string, string> = {
    語彙: 'bg-blue-100 text-blue-700',
    文法: 'bg-purple-100 text-purple-700',
    漢字: 'bg-orange-100 text-orange-700',
    読解: 'bg-green-100 text-green-700',
  }

  const headerBg = isKitty ? 'bg-pink-500' : 'bg-red-600'
  const pageBg = isKitty ? 'bg-pink-50' : 'bg-red-50'
  const cardBorder = isKitty ? 'border-pink-200' : 'border-amber-100'
  const primaryColor = isKitty ? 'text-pink-600' : 'text-red-600'
  const newExamBtn = isKitty
    ? 'bg-pink-500 hover:bg-pink-600 text-white'
    : 'bg-red-600 hover:bg-red-700 text-white'

  return (
    <div className={`min-h-screen ${pageBg}`}>
      <header className={`${headerBg} text-white shadow`}>
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-2">
          {isKitty ? <KittyBow size={20} /> : <Pokeball size={20} />}
          <h1 className="text-sm font-black">{level.toUpperCase()} 시험 결과</h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-5">
        {/* Perfect score banner */}
        {isPerfect && (
          <div className="bg-yellow-400 rounded-2xl p-5 text-center shadow-lg anim-pop">
            <p className="text-3xl mb-1">🌟</p>
            <p className="text-xl font-black text-yellow-900">만점 달성!</p>
            <p className="text-yellow-800 font-bold text-sm mt-1">
              {pointsEarned.toLocaleString()}원 적립! (현재 누적: {currentPoints.toLocaleString()}원)
            </p>
          </div>
        )}

        {/* Score card */}
        <div className={`bg-white rounded-2xl border-2 ${cardBorder} p-7 text-center anim-pop shadow-sm`}>
          <div className="text-5xl mb-2">
            {isPerfect ? '🏆' : isWin ? '😄' : isMid ? '💪' : '🔥'}
          </div>
          <p className={`text-5xl font-black mb-1 ${isWin || isPerfect ? 'text-green-600' : isMid ? 'text-amber-600' : 'text-red-600'}`}>
            {pct}%
          </p>
          <p className="text-gray-400 text-sm mb-3">{score} / {total} 문제 정답</p>
          <div className="max-w-xs mx-auto mb-3">
            {isKitty ? <KittyScoreBar pct={pct} /> : <HpBar pct={pct} />}
          </div>
          <p className={`font-black text-base ${isWin || isPerfect ? 'text-green-700' : isMid ? 'text-amber-700' : 'text-red-700'}`}>
            {isPerfect
              ? '🎉 완벽해요! 최고예요!'
              : isWin
              ? '훌륭해요! 합격권!'
              : isMid
              ? '조금만 더! 다시 도전해봐요 💪'
              : '복습이 필요해요! 포기하지 마세요 🔥'}
          </p>
        </div>

        {/* Retry section */}
        <RetrySection questions={qs} />

        {/* Question summary */}
        <div className={`bg-white rounded-2xl border-2 ${cardBorder} overflow-hidden shadow-sm`}>
          <div className={`px-5 py-3 border-b ${isKitty ? 'border-pink-100 bg-pink-50' : 'border-amber-100 bg-amber-50'}`}>
            <h2 className="font-black text-gray-800">문제 목록</h2>
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
            href={`/review?level=${level}`}
            className={`bg-white hover:bg-gray-50 border-2 ${cardBorder} text-gray-800 rounded-xl p-4 text-center font-black transition-colors text-sm`}
          >
            {isKitty ? '🎀' : '📒'} 복습 노트
          </Link>
          <Link
            href={`/exam?level=${level}`}
            className={`${newExamBtn} rounded-xl p-4 text-center font-black transition-colors text-sm`}
          >
            ⚡ 새 시험!
          </Link>
        </div>
        <Link href={`/dashboard?level=${level}`} className={`block text-center text-sm ${primaryColor} hover:underline font-bold`}>
          대시보드로 →
        </Link>
      </main>
    </div>
  )
}
