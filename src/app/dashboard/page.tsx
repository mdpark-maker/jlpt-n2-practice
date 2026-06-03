import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import LogoutButton from '@/components/LogoutButton'

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
    .order('created_at', { ascending: false })
    .limit(10)

  const completed = sessions?.filter(s => s.status === 'completed') ?? []
  const avgScore = completed.length > 0
    ? Math.round(completed.reduce((sum, s) => sum + (s.score / s.total_questions) * 100, 0) / completed.length)
    : null

  const { count: flaggedCount } = await supabase
    .from('exam_questions')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .not('flag_status', 'is', null)

  const { count: wrongCount } = await supabase
    .from('exam_questions')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .eq('is_correct', false)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-indigo-700 text-white shadow">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold">日本語 N2 模擬試験</h1>
          <div className="flex items-center gap-4">
            <span className="text-indigo-200 text-sm">
              {profile?.display_name ?? user.email}
            </span>
            <LogoutButton />
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: '受験回数', value: completed.length, color: 'text-indigo-600' },
            { label: '平均スコア', value: avgScore != null ? `${avgScore}%` : '—', color: 'text-green-600' },
            { label: 'チェック済み', value: flaggedCount ?? 0, color: 'text-yellow-600' },
            { label: '復習すべき問題', value: wrongCount ?? 0, color: 'text-red-600' },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-xl shadow-sm p-4 text-center border border-gray-100">
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-gray-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="grid sm:grid-cols-2 gap-4">
          <Link
            href="/exam"
            className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl p-6 flex flex-col gap-2 transition-colors shadow-sm"
          >
            <span className="text-2xl">📝</span>
            <span className="text-lg font-bold">新しい模擬試験</span>
            <span className="text-indigo-200 text-sm">AIが生成するN2レベルの問題に挑戦</span>
          </Link>
          <Link
            href="/review"
            className={`rounded-xl p-6 flex flex-col gap-2 transition-colors shadow-sm border ${
              (flaggedCount ?? 0) + (wrongCount ?? 0) === 0
                ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-default pointer-events-none'
                : 'bg-white hover:bg-gray-50 text-gray-800 border-gray-200'
            }`}
          >
            <span className="text-2xl">🔍</span>
            <span className="text-lg font-bold">復習モード</span>
            <span className="text-gray-500 text-sm">
              チェック・不正解問題を復習（{(flaggedCount ?? 0) + (wrongCount ?? 0)}問）
            </span>
          </Link>
        </div>

        {/* Exam history */}
        {sessions && sessions.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-800">受験履歴</h2>
            </div>
            <ul className="divide-y divide-gray-100">
              {sessions.map(s => (
                <li key={s.id} className="px-5 py-3 flex items-center justify-between">
                  <div>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full mr-2 ${
                      s.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {s.status === 'completed' ? '完了' : '進行中'}
                    </span>
                    <span className="text-sm text-gray-600">
                      {new Date(s.created_at).toLocaleDateString('ja-JP')}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    {s.status === 'completed' && (
                      <span className="text-sm font-bold text-indigo-600">
                        {s.score} / {s.total_questions}点
                      </span>
                    )}
                    <Link
                      href={s.status === 'in_progress' ? `/exam/${s.id}` : `/exam/${s.id}/results`}
                      className="text-xs text-indigo-600 hover:underline"
                    >
                      {s.status === 'in_progress' ? '続ける →' : '結果を見る →'}
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </main>
    </div>
  )
}
