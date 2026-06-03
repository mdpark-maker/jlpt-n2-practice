import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import LogoutButton from '@/components/LogoutButton'
import { Pokeball, HpBar, PikachuMascot } from '@/components/PokeUI'
import { KittyBow, KittyMascot, KittyScoreBar } from '@/components/KittyUI'
import { ExamLevel } from '@/lib/types'
import LevelSwitcher from './LevelSwitcher'
import PointsSection from './PointsSection'

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ level?: string }>
}) {
  const { level: levelParam } = await searchParams
  const level: ExamLevel = levelParam === 'n3' ? 'n3' : 'n2'
  const isKitty = level === 'n3'

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('display_name, points')
    .eq('id', user.id)
    .single()

  const { data: sessions } = await supabase
    .from('exam_sessions')
    .select('*')
    .eq('user_id', user.id)
    .eq('level', level)
    .eq('is_retry', false)
    .order('created_at', { ascending: false })
    .limit(10)

  const completed = sessions?.filter(s => s.status === 'completed') ?? []
  const avgScore = completed.length > 0
    ? Math.round(completed.reduce((sum, s) => sum + (s.score / s.total_questions) * 100, 0) / completed.length)
    : null

  const { count: reviewCount } = await supabase
    .from('review_items')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .eq('level', level)

  const userName = profile?.display_name ?? user.email?.split('@')[0] ?? '학습자'
  const points = profile?.points ?? 0

  const bg = isKitty ? 'bg-pink-50' : 'bg-red-50'
  const headerBg = isKitty ? 'bg-pink-500' : 'bg-red-600'
  const primaryColor = isKitty ? 'text-pink-600' : 'text-red-600'
  const primaryBg = isKitty ? 'bg-pink-500 hover:bg-pink-600' : 'bg-red-600 hover:bg-red-700'
  const cardBorder = isKitty ? 'border-pink-200' : 'border-amber-100'
  const levelLabel = isKitty ? 'N3 · 헬로키티 도장' : 'N2 · 포켓몬 도장'

  return (
    <div className={`min-h-screen ${bg}`}>
      {/* Header */}
      <header className={`${headerBg} text-white shadow`}>
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isKitty ? <KittyBow size={26} /> : <Pokeball size={28} />}
            <h1 className="text-lg font-black tracking-wide">JLPT 학습 도장</h1>
          </div>
          <div className="flex items-center gap-3">
            <span className={`${isKitty ? 'text-pink-200' : 'text-red-200'} text-sm font-medium`}>
              {isKitty ? '🎀' : '⚡'} {userName}
            </span>
            <LogoutButton />
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-5">
        {/* Level switcher */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <LevelSwitcher current={level} />
          <p className="text-sm font-bold text-gray-400">{levelLabel}</p>
        </div>

        {/* Trainer card */}
        <div className={`bg-white rounded-2xl border-2 ${cardBorder} p-5 flex items-center gap-5 shadow-sm`}>
          <div className="shrink-0">
            {isKitty ? <KittyMascot size={64} /> : <PikachuMascot size={64} />}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-400 font-bold mb-1">학습자 카드</p>
            <p className="text-xl font-black text-gray-800 truncate">{userName}</p>
            {avgScore !== null && (
              <div className="mt-2 max-w-xs">
                {isKitty ? <KittyScoreBar pct={avgScore} /> : <HpBar pct={avgScore} />}
              </div>
            )}
          </div>
          <div className="text-right shrink-0">
            <p className={`text-3xl font-black ${primaryColor}`}>{completed.length}</p>
            <p className="text-xs text-gray-400 font-bold">시험 횟수</p>
          </div>
        </div>

        {/* Points */}
        <PointsSection initialPoints={points} />

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[
            { label: '응시 횟수', value: completed.length, emoji: '🏆', color: primaryColor },
            { label: '평균 점수', value: avgScore != null ? `${avgScore}%` : '—', emoji: '⚡', color: 'text-amber-600' },
            { label: '복습 노트', value: reviewCount ?? 0, emoji: isKitty ? '🎀' : '📒', color: 'text-blue-600' },
          ].map(s => (
            <div key={s.label} className={`bg-white rounded-xl border-2 ${cardBorder} p-4 text-center shadow-sm`}>
              <p className="text-xl mb-0.5">{s.emoji}</p>
              <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
              <p className="text-xs text-gray-400 font-medium mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="grid sm:grid-cols-2 gap-4">
          <Link
            href={`/exam?level=${level}`}
            className={`${primaryBg} text-white rounded-2xl p-6 flex flex-col gap-2 transition-colors shadow-md`}
          >
            <span className="text-3xl">⚔️</span>
            <span className="text-lg font-black">새 시험 시작!</span>
            <span className={`${isKitty ? 'text-pink-200' : 'text-red-200'} text-sm`}>
              AI가 생성하는 {level.toUpperCase()} 레벨 문제에 도전
            </span>
          </Link>
          <Link
            href={`/review?level=${level}`}
            className={`rounded-2xl p-6 flex flex-col gap-2 transition-colors shadow-sm bg-white border-2 ${cardBorder} ${
              (reviewCount ?? 0) === 0 ? 'opacity-50 pointer-events-none' : `hover:bg-${isKitty ? 'pink' : 'amber'}-50`
            }`}
          >
            <span className="text-3xl">{isKitty ? '🎀' : '📒'}</span>
            <span className="text-lg font-black text-gray-800">복습 노트</span>
            <span className="text-gray-500 text-sm">저장된 문제 복습 ({reviewCount ?? 0}문제)</span>
          </Link>
        </div>

        {/* Exam history */}
        {sessions && sessions.length > 0 && (
          <div className={`bg-white rounded-2xl border-2 ${cardBorder} overflow-hidden shadow-sm`}>
            <div className={`px-5 py-4 border-b ${isKitty ? 'border-pink-100 bg-pink-50' : 'border-amber-100 bg-amber-50'} flex items-center gap-2`}>
              <span className="text-lg">🗂️</span>
              <h2 className="font-black text-gray-800">시험 기록</h2>
            </div>
            <ul className="divide-y divide-gray-100">
              {sessions.map(s => {
                const pct = s.status === 'completed' ? Math.round((s.score / s.total_questions) * 100) : null
                return (
                  <li key={s.id} className="px-5 py-3 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className={`text-xs font-black px-2 py-0.5 rounded-full shrink-0 ${
                        s.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {s.status === 'completed' ? '✅ 완료' : '⚔️ 진행 중'}
                      </span>
                      <span className="text-xs text-gray-400">
                        {new Date(s.created_at).toLocaleDateString('ko-KR')}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      {pct !== null && (
                        <span className={`text-sm font-black ${pct >= 70 ? 'text-green-600' : pct >= 50 ? 'text-amber-600' : 'text-red-600'}`}>
                          {s.score}/{s.total_questions}점
                          {pct === 100 && ' 🌟'}
                        </span>
                      )}
                      <Link
                        href={s.status === 'in_progress' ? `/exam/${s.id}` : `/exam/${s.id}/results`}
                        className={`text-xs ${primaryColor} hover:underline font-bold`}
                      >
                        {s.status === 'in_progress' ? '계속하기 →' : '결과 →'}
                      </Link>
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>
        )}
      </main>
    </div>
  )
}
