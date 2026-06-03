'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { ReviewItem } from '@/lib/types'
import { Pokeball } from '@/components/PokeUI'

type Filter = 'all' | 'unknown' | 'uncertain' | 'wrong'

const FILTER_OPTIONS: { value: Filter; label: string }[] = [
  { value: 'all',      label: 'すべて' },
  { value: 'unknown',  label: '❓ わからない' },
  { value: 'uncertain',label: '🤔 あいまい' },
  { value: 'wrong',    label: '❌ 不正解' },
]

const CATEGORY_COLORS: Record<string, string> = {
  語彙: 'bg-blue-100 text-blue-700',
  文法: 'bg-purple-100 text-purple-700',
  漢字: 'bg-orange-100 text-orange-700',
  読解: 'bg-green-100 text-green-700',
}

const OPTION_LABELS = ['A', 'B', 'C', 'D']

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
    if (filter === 'unknown')   return item.original_flag_status === 'unknown'
    if (filter === 'uncertain') return item.original_flag_status === 'uncertain'
    if (filter === 'wrong')     return item.original_flag_status === null
    return true
  })

  async function startRetry(subset: ReviewItem[], key: string) {
    setRetryLoading(key)
    const res = await fetch('/api/exam/retry', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ questions: subset.map(i => i.question_data) }),
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

  return (
    <div className="min-h-screen bg-red-50">
      <header className="bg-red-600 text-white shadow sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="text-red-200 hover:text-white text-sm">← 戻る</Link>
            <div className="flex items-center gap-2">
              <Pokeball size={18} />
              <h1 className="text-sm font-black">復習ノート</h1>
            </div>
          </div>
          {filtered.length > 0 && (
            <button
              onClick={() => startRetry(filtered, 'all')}
              disabled={retryLoading !== null}
              className="bg-white text-red-700 hover:bg-red-50 disabled:opacity-50 text-xs font-black px-3 py-1.5 rounded-lg transition-colors shrink-0"
            >
              {retryLoading === 'all' ? '準備中...' : `⚡ ${filtered.length}問 再挑戦`}
            </button>
          )}
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-5 space-y-4">
        {/* Filter tabs */}
        <div className="flex flex-wrap gap-2">
          {FILTER_OPTIONS.map(f => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`px-4 py-1.5 rounded-full text-xs font-black border-2 transition-all ${
                filter === f.value
                  ? 'border-red-500 bg-red-500 text-white'
                  : 'border-gray-200 text-gray-600 hover:border-red-300 bg-white'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="anim-float inline-block mb-3"><Pokeball size={40} /></div>
            <p className="text-gray-400 font-bold">読み込み中...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-3">📭</div>
            <p className="text-gray-400 font-bold">復習する問題がありません</p>
            <Link href="/exam" className="mt-4 inline-block text-red-600 hover:underline text-sm font-bold">
              バトルに挑戦してみよう →
            </Link>
          </div>
        ) : (
          <>
            <p className="text-xs text-gray-400 font-bold">{filtered.length}問 保存済み</p>
            <div className="space-y-3">
              {filtered.map(item => {
                const isOpen = expanded.has(item.id)
                const catColor = CATEGORY_COLORS[item.question_data.category] ?? 'bg-gray-100 text-gray-700'
                const correctIdx = OPTION_LABELS.indexOf(item.question_data.correct_answer)
                const isReading = item.question_data.category === '読解'

                return (
                  <div key={item.id} className="bg-white rounded-2xl border-2 border-amber-100 overflow-hidden shadow-sm">
                    {/* Collapsed header */}
                    <div
                      className="px-5 py-4 flex items-start gap-3 cursor-pointer hover:bg-amber-50 transition-colors"
                      onClick={() => toggleExpand(item.id)}
                    >
                      <div className="flex items-center gap-1.5 shrink-0 mt-0.5">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-black ${catColor}`}>
                          {item.question_data.category}
                        </span>
                        {item.original_flag_status && (
                          <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                            item.original_flag_status === 'unknown'
                              ? 'bg-red-100 text-red-600'
                              : 'bg-amber-100 text-amber-600'
                          }`}>
                            {item.original_flag_status === 'unknown' ? '❓' : '🤔'}
                          </span>
                        )}
                      </div>
                      {/* Show 2 lines when collapsed, full text when open */}
                      <p className={`flex-1 text-sm text-gray-800 leading-relaxed ${!isOpen && !isReading ? 'line-clamp-2' : !isOpen && isReading ? 'line-clamp-1' : ''}`}>
                        {item.question_data.question}
                      </p>
                      <span className="text-gray-400 text-xs shrink-0 mt-0.5">{isOpen ? '▲' : '▼'}</span>
                    </div>

                    {/* Expanded content */}
                    {isOpen && (
                      <div className="px-5 pb-5 border-t-2 border-amber-100 pt-4 space-y-3">
                        {/* For reading comprehension, show full question text again in expanded area */}
                        {isReading && (
                          <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">
                            {item.question_data.question}
                          </div>
                        )}

                        {/* Options */}
                        <div className="space-y-2">
                          {item.question_data.options.map((opt, idx) => {
                            const isCorrect = idx === correctIdx
                            return (
                              <div
                                key={idx}
                                className={`px-4 py-2.5 rounded-xl text-sm border-2 font-medium ${
                                  isCorrect
                                    ? 'border-green-500 bg-green-50 text-green-800'
                                    : 'border-gray-200 text-gray-500'
                                }`}
                              >
                                {isCorrect && <span className="mr-1.5">✅</span>}
                                <span className="font-black">{OPTION_LABELS[idx]}.</span>{' '}
                                {opt.replace(/^[A-D]\.\s*/, '')}
                              </div>
                            )
                          })}
                        </div>

                        {/* Explanation */}
                        {item.question_data.explanation && (
                          <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 text-sm text-blue-800">
                            <span className="font-black">解説：</span>{item.question_data.explanation}
                          </div>
                        )}

                        {/* Retry button */}
                        <button
                          onClick={() => startRetry([item], item.id)}
                          disabled={retryLoading !== null}
                          className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white text-sm font-black py-2.5 rounded-xl transition-colors"
                        >
                          {retryLoading === item.id ? '準備中...' : '⚡ この問題を再挑戦する →'}
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
