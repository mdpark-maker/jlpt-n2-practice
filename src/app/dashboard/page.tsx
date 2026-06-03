import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import LogoutButton from '@/components/LogoutButton'
import { Pokeball, HpBar } from '@/components/PokeUI'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('display_name')
    .eq('id', user.id)
    .single()

  const { data: sessions } = await supabase
    .from('exam_sessions')
    .select('*')
    .eq('user_id', user.id)
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

  const { count: wrongCount } = await supabase
    .from('exam_questions')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .eq('is_correct', false)

  const trainerName = profile?.display_name ?? user.email?.split('@')[0] ?? 'トレーナー'

  return (
    <div className="min-h-screen bg-red-50">
      {/* Header */}
      <header className="bg-red-600 text-white shadow">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Pokeball size={28} />
            <h1 className="text-lg font-black tracking-wide">N2 道場</h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-red-200 text-sm font-medium">⚡ {trainerName}</span>
            <LogoutButton />
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-5">
        {/* Trainer card */}
        <div className="poke-card bg-white p-5 flex items-center gap-5">
          <div className="shrink-0 w-16 h-16 rounded-full bg-red-100 flex items-center justify-center text-3xl border-2 border-amber-300">
            🧑‍🎓
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-400 font-bold uppercase tracking-wide">トレーナーカード</p>
            <p className="text-xl font-black text-gray-800 truncate">{trainerName}</p>
            {avgScore !== null && (
              <div className="mt-2 max-w-xs">
                <HpBar pct={avgScore} />
              </div>
            )}
          </div>
          <div className="text-right shrink-0">
            <p className="text-3xl font-black text-red-600">{completed.length}</p>
            <p className="text-xs text-gray-400 font-bold">バトル数</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: '受験回数', value: completed.length, emoji: '🏆', color: 'text-red-600' },
            { label: '平均スコア', value: avgScore != null ? `${avgScore}%` : '—', emoji: '⚡', color: 'text-amber-600' },
            { label: '復習ノート', value: reviewCount ?? 0, emoji: '📒', color: 'text-blue-600' },
            { label: '要復習', value: wrongCount ?? 0, emoji: '🔥', color: 'text-orange-600' },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-xl border-2 border-amber-100 p-4 text-center shadow-sm">
              <p className="text-xl mb-0.5">{s.emoji}</p>
              <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
              <p className="text-xs text-gray-400 font-medium mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="grid sm:grid-cols-2 gap-4">
          <Link
            href="/exam"
            className="bg-red-600 hover:bg-red-700 text-white rounded-2xl p-6 flex flex-col gap-2 transition-colors shadow-md poke-card border-red-400"
          >
            <span className="text-3xl">⚔️</span>
            <span className="text-lg font-black">新しいバトル！</span>
            <span className="text-red-200 text-sm">AIが生成するN2レベルの問題に挑戦</span>
          </Link>
          <Link
            href="/review"
            className={`rounded-2xl p-6 flex flex-col gap-2 transition-colors shadow-sm poke-card ${
              (reviewCount ?? 0) === 0
                ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-default pointer-events-none'
                : 'bg-white hover:bg-amber-50 text-gray-800'
            }`}
          >
            <span className="text-3xl">📒</span>
            <span className="text-lg font-black">復習ノート</span>
            <span className="text-gray-500 text-sm">
              保存済み問題を復習（{reviewCount ?? 0}問）
            </span>
          </Link>
        </div>

        {/* Exam history */}
        {sessions && sessions.length > 0 && (
          <div className="bg-white rounded-2xl border-2 border-amber-100 overflow-hidden shadow-sm">
            <div className="px-5 py-4 border-b border-amber-100 bg-amber-50 flex items-center gap-2">
              <span className="text-lg">🗂️</span>
              <h2 className="font-black text-gray-800">バトル履歴</h2>
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
                        {s.status === 'completed' ? '✅ 完了' : '⚔️ 進行中'}
                      </span>
                      <span className="text-xs text-gray-400">
                        {new Date(s.created_at).toLocaleDateString('ja-JP')}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      {pct !== null && (
                        <span className={`text-sm font-black ${pct >= 70 ? 'text-green-600' : pct >= 50 ? 'text-amber-600' : 'text-red-600'}`}>
                          {s.score}/{s.total_questions}点
                        </span>
                      )}
                      <Link
                        href={s.status === 'in_progress' ? `/exam/${s.id}` : `/exam/${s.id}/results`}
                        className="text-xs text-red-600 hover:underline font-bold"
                      >
                        {s.status === 'in_progress' ? '続ける →' : '結果 →'}
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
