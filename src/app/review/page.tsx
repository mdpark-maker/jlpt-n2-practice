'use client'

import { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { ReviewItem, ExamLevel } from '@/lib/types'
import { Pokeball } from '@/components/PokeUI'
import { KittyBow } from '@/components/KittyUI'

type Filter = 'all' | 'unknown' | 'uncertain' | 'wrong'

const FILTER_OPTIONS: { value: Filter; label: string }[] = [
  { value: 'all',       label: '전체' },
  { value: 'unknown',   label: '❓ 모르겠어요' },
  { value: 'uncertain', label: '🤔 애매해요' },
  { value: 'wrong',     label: '❌ 오답' },
]

const CATEGORY_COLORS: Record<string, string> = {
  語彙: 'bg-blue-100 text-blue-700',
  文法: 'bg-purple-100 text-purple-700',
  漢字: 'bg-orange-100 text-orange-700',
  読解: 'bg-green-100 text-green-700',
}

const OPTION_LABELS = ['A', 'B', 'C', 'D']

function ReviewInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const level: ExamLevel = searchParams.get('level') === 'n3' ? 'n3' : 'n2'
  const isKitty = level === 'n3'

  const [items, setItems] = useState<ReviewItem[]>([])
  const [filter, setFilter] = useState<Filter>('all')
  const [loading, setLoading] = useState(true)
  const [retryLoading, setRetryLoading] = useState<string | null>(null)
  const [expanded, setExpanded] = useState<Set<string>>(new Set())
  const [answers, setAnswers] = useState<Record<string, string>>({})

  const headerBg = isKitty ? 'bg-pink-500' : 'bg-red-600'
  const pageBg = isKitty ? 'bg-pink-50' : 'bg-red-50'
  const filterActive = isKitty ? 'border-pink-500 bg-pink-500 text-white' : 'border-red-500 bg-red-500 text-white'
  const filterIdle = isKitty ? 'border-gray-200 text-gray-600 hover:border-pink-300 bg-white' : 'border-gray-200 text-gray-600 hover:border-red-300 bg-white'
  const retryBtn = isKitty ? 'bg-white text-pink-700 hover:bg-pink-50' : 'bg-white text-red-700 hover:bg-red-50'
  const cardBorder = isKitty ? 'border-pink-100' : 'border-amber-100'

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data } = await supabase
        .from('review_items')
        .select('*')
        .eq('user_id', user.id)
        .eq('level', level)
        .order('created_at', { ascending: false })

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
  }, [level])

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
      body: JSON.stringify({ questions: subset.map(i => i.question_data), level }),
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

  function handleAnswer(itemId: string, chosen: string) {
    if (answers[itemId]) return
    setAnswers(prev => ({ ...prev, [itemId]: chosen }))
  }

  function resetAnswer(itemId: string) {
    setAnswers(prev => {
      const next = { ...prev }
      delete next[itemId]
      return next
    })
  }

  return (
    <div className={`min-h-screen ${pageBg}`}>
      <header className={`${headerBg} text-white shadow sticky top-0 z-10`}>
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link href={`/dashboard?level=${level}`} className={`${isKitty ? 'text-pink-200 hover:text-white' : 'text-red-200 hover:text-white'} text-sm`}>← 뒤로</Link>
            <div className="flex items-center gap-2">
              {isKitty ? <KittyBow size={18} /> : <Pokeball size={18} />}
              <h1 className="text-sm font-black">{level.toUpperCase()} 복습 노트</h1>
            </div>
          </div>
          {filtered.length > 0 && (
            <button
              onClick={() => startRetry(filtered, 'all')}
              disabled={retryLoading !== null}
              className={`${retryBtn} disabled:opacity-50 text-xs font-black px-3 py-1.5 rounded-lg transition-colors shrink-0`}
            >
              {retryLoading === 'all' ? '준비 중...' : `⚡ ${filtered.length}문제 재도전`}
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
                filter === f.value ? filterActive : filterIdle
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="anim-float inline-block mb-3">
              {isKitty ? <KittyBow size={40} /> : <Pokeball size={40} />}
            </div>
            <p className="text-gray-400 font-bold">불러오는 중...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-3">📭</div>
            <p className="text-gray-400 font-bold">복습할 문제가 없습니다</p>
            <Link href={`/exam?level=${level}`} className={`mt-4 inline-block ${isKitty ? 'text-pink-600' : 'text-red-600'} hover:underline text-sm font-bold`}>
              시험에 도전해보세요 →
            </Link>
          </div>
        ) : (
          <>
            <p className="text-xs text-gray-400 font-bold">{filtered.length}문제 저장됨</p>
            <div className="space-y-3">
              {filtered.map(item => {
                const isOpen = expanded.has(item.id)
                const catColor = CATEGORY_COLORS[item.question_data.category] ?? 'bg-gray-100 text-gray-700'
                const correct = item.question_data.correct_answer
                const chosen = answers[item.id] ?? null
                const isAnswered = chosen !== null
                const isCorrect = chosen === correct
                const isReading = item.question_data.category === '読解'

                return (
                  <div key={item.id} className={`bg-white rounded-2xl border-2 ${cardBorder} overflow-hidden shadow-sm`}>
                    {/* Collapsed header */}
                    <div
                      className={`px-5 py-4 flex items-start gap-3 cursor-pointer hover:bg-${isKitty ? 'pink' : 'amber'}-50 transition-colors`}
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
                        {isAnswered && (
                          <span className="text-sm">{isCorrect ? '✅' : '❌'}</span>
                        )}
                      </div>
                      <p className={`flex-1 text-sm text-gray-800 leading-relaxed ${!isOpen ? 'line-clamp-2' : ''}`}>
                        {item.question_data.question}
                      </p>
                      <span className="text-gray-400 text-xs shrink-0 mt-0.5">{isOpen ? '▲' : '▼'}</span>
                    </div>

                    {/* Expanded content */}
                    {isOpen && (
                      <div className={`px-5 pb-5 border-t-2 ${cardBorder} pt-4 space-y-3`}>
                        {isReading && (
                          <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">
                            {item.question_data.question}
                          </div>
                        )}

                        {/* Options */}
                        <div className="space-y-2">
                          {item.question_data.options.map((opt, idx) => {
                            const label = OPTION_LABELS[idx]
                            const isThisCorrect = label === correct
                            const isThisChosen = label === chosen

                            let style = `border-gray-200 text-gray-700 ${isKitty ? 'hover:border-pink-400 hover:bg-pink-50' : 'hover:border-red-400 hover:bg-red-50'} cursor-pointer`
                            if (isAnswered) {
                              if (isThisCorrect) {
                                style = 'border-green-500 bg-green-50 text-green-800'
                              } else if (isThisChosen) {
                                style = 'border-red-400 bg-red-50 text-red-800'
                              } else {
                                style = 'border-gray-200 text-gray-400 cursor-default'
                              }
                            }

                            return (
                              <button
                                key={label}
                                onClick={() => handleAnswer(item.id, label)}
                                disabled={isAnswered}
                                className={`w-full text-left px-4 py-2.5 rounded-xl border-2 text-sm font-medium transition-all disabled:cursor-default ${style}`}
                              >
                                {isAnswered && isThisCorrect && <span className="mr-1.5">✅</span>}
                                {isAnswered && isThisChosen && !isThisCorrect && <span className="mr-1.5">❌</span>}
                                <span className="font-black">{label}.</span>{' '}
                                {opt.replace(/^[A-D]\.\s*/, '')}
                              </button>
                            )
                          })}
                        </div>

                        {/* Bilingual feedback after answering */}
                        {isAnswered && (
                          <>
                            <div className={`rounded-xl px-4 py-3 text-sm border-2 font-medium ${
                              isCorrect
                                ? 'bg-green-50 border-green-300 text-green-800'
                                : 'bg-red-50 border-red-300 text-red-800'
                            }`}>
                              {isCorrect ? '✅ 정답!' : `❌ 오답... 정답은 ${correct} 입니다`}
                            </div>
                            {/* Korean explanation — always shown */}
                            <div className="bg-pink-50 border border-pink-200 rounded-xl px-4 py-3 text-sm text-pink-900">
                              <p className="text-xs font-black text-pink-600 mb-1">🇰🇷 한국어 해설</p>
                              {item.question_data.explanation_ko
                                ? item.question_data.explanation_ko
                                : <span className="text-pink-400 italic">이 문제는 업데이트 전 저장된 문제입니다. 새 시험을 풀면 한국어 해설이 자동 제공됩니다.</span>
                              }
                            </div>
                            {/* Japanese explanation */}
                            <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 text-sm text-blue-800">
                              <p className="text-xs font-black text-blue-600 mb-1">🇯🇵 日本語解説</p>
                              {item.question_data.explanation}
                            </div>
                            <button
                              onClick={() => resetAnswer(item.id)}
                              className="text-xs text-gray-400 hover:text-gray-600 underline"
                            >
                              다시 이 문제 풀기
                            </button>
                          </>
                        )}
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

export default function ReviewPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">불러오는 중...</div>}>
      <ReviewInner />
    </Suspense>
  )
}
