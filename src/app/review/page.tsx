'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { ReviewItem, FlagStatus } from '@/lib/types'

type Filter = 'all' | 'unknown' | 'uncertain' | 'wrong'

const FILTER_OPTIONS: { value: Filter; label: string }[] = [
  { value: 'all', label: 'すべて' },
  { value: 'unknown', label: '❓ わからない' },
  { value: 'uncertain', label: '🤔 あいまい' },
  { value: 'wrong', label: '❌ 不正解' },
]

const CATEGORY_COLORS: Record<string, string> = {
  語彙: 'bg-blue-100 text-blue-700',
  文法: 'bg-purple-100 text-purple-700',
  漢字: 'bg-orange-100 text-orange-700',
  読解: 'bg-green-100 text-green-700',
}

export default function ReviewPage() {
  const router = useRouter()
  const [items, setItems] = useState<ReviewItem[]>([])
  const [filter, setFilter] = useState<Filter>('all')
  const [loading, setLoading] = useState(true)
  const [retryLoading, setRetryLoading] = useState<string | null>(null)
  const [expanded, setExpanded] = useState<Set<string>>(new Set())

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data } = await supabase
        .from('review_items')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      // Deduplicate by question text (keep latest)
      const seen = new Set<string>()
      const deduped = (data ?? []).filter((item: ReviewItem) => {
        const key = item.question_data.question
        if (seen.has(key)) return false
        seen.add(key)
        return true
      })

      setItems(deduped)
      setLoading(false)
    }
    load()
  }, [])

  const filtered = items.filter(item => {
    if (filter === 'unknown') return item.original_flag_status === 'unknown'
    if (filter === 'uncertain') return item.original_flag_status === 'uncertain'
    if (filter === 'wrong') return item.original_flag_status === null
    return true
  })

  async function startRetry(questions: ReviewItem[], key: string) {
    setRetryLoading(key)
    const res = await fetch('/api/exam/retry', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ questions: questions.map(i => i.question_data) }),
    })
    if (res.ok) {
      const { sessionId } = await res.json()
      router.push(`/exam/${sessionId}`)
    }
    setRetryLoading(null)
  }

  function toggleExpand(id: string) {
    setExpanded(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const optionLabels = ['A', 'B', 'C', 'D']

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-indigo-700 text-white shadow sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="text-indigo-200 hover:text-white text-sm">← 戻る</Link>
            <h1 className="text-lg font-bold">復習ノート</h1>
          </div>
          {filtered.length > 0 && (
            <button
              onClick={() => startRetry(filtered, 'all')}
              disabled={retryLoading !== null}
              className="bg-white text-indigo-700 hover:bg-indigo-50 disabled:opacity-50 text-sm font-semibold px-4 py-1.5 rounded-lg transition-colors"
            >
              {retryLoading === 'all' ? '準備中...' : `${filtered.length}問 再挑戦 →`}
            </button>
          )}
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-4">
        {/* Filter tabs */}
        <div className="flex flex-wrap gap-2">
          {FILTER_OPTIONS.map(f => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold border-2 transition-all ${
                filter === f.value
                  ? 'border-indigo-500 bg-indigo-500 text-white'
                  : 'border-gray-200 text-gray-600 hover:border-indigo-300'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="text-center text-gray-400 py-20">読み込み中...</p>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">復習する問題がありません</p>
            <Link href="/exam" className="mt-4 inline-block text-indigo-600 hover:underline text-sm">
              模擬試験を受けてみましょう →
            </Link>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-500">{filtered.length}問</p>
            <div className="space-y-3">
              {filtered.map(item => {
                const isOpen = expanded.has(item.id)
                const catColor = CATEGORY_COLORS[item.question_data.category] ?? 'bg-gray-100 text-gray-700'
                const correctIdx = optionLabels.indexOf(item.question_data.correct_answer)

                return (
                  <div key={item.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    {/* Header row */}
                    <div
                      className="px-5 py-4 flex items-center gap-3 cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => toggleExpand(item.id)}
                    >
                      <span className={`text-xs px-2 py-0.5 rounded-full font-semibold shrink-0 ${catColor}`}>
                        {item.question_data.category}
                      </span>
                      {item.original_flag_status && (
                        <span className={`text-xs px-2 py-0.5 rounded-full shrink-0 ${
                          item.original_flag_status === 'unknown'
                            ? 'bg-red-100 text-red-600'
                            : 'bg-yellow-100 text-yellow-600'
                        }`}>
                          {item.original_flag_status === 'unknown' ? '❓' : '🤔'}
                        </span>
                      )}
                      <p className="flex-1 text-sm text-gray-800 line-clamp-2">{item.question_data.question}</p>
                      <span className="text-gray-400 text-xs shrink-0">{isOpen ? '▲' : '▼'}</span>
                    </div>

                    {/* Expanded: options + answer + retry */}
                    {isOpen && (
                      <div className="px-5 pb-5 border-t border-gray-100 pt-4 space-y-3">
                        <div className="space-y-2">
                          {item.question_data.options.map((opt, idx) => {
                            const isCorrect = idx === correctIdx
                            return (
                              <div
                                key={idx}
                                className={`px-4 py-2.5 rounded-xl text-sm border-2 ${
                                  isCorrect
                                    ? 'border-green-400 bg-green-50 text-green-800 font-semibold'
                                    : 'border-gray-200 text-gray-600'
                                }`}
                              >
                                {isCorrect && <span className="mr-1">✅</span>}
                                {opt}
                              </div>
                            )
                          })}
                        </div>

                        {item.question_data.explanation && (
                          <div className="bg-indigo-50 rounded-xl px-4 py-3 text-sm text-indigo-800">
                            <span className="font-semibold">解説：</span>{item.question_data.explanation}
                          </div>
                        )}

                        <button
                          onClick={() => startRetry([item], item.id)}
                          disabled={retryLoading !== null}
                          className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white text-sm font-semibold py-2.5 rounded-xl transition-colors"
                        >
                          {retryLoading === item.id ? '準備中...' : 'この問題を再挑戦する →'}
                        </button>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </>
        )}
      </main>
    </div>
  )
}
