'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { ExamQuestion, FlagStatus } from '@/lib/types'
import QuestionCard from '@/components/QuestionCard'

type Filter = 'all' | 'unknown' | 'uncertain' | 'wrong'

const FILTER_OPTIONS: { value: Filter; label: string }[] = [
  { value: 'all', label: 'すべて' },
  { value: 'unknown', label: '❓ わからない' },
  { value: 'uncertain', label: '🤔 あいまい' },
  { value: 'wrong', label: '❌ 不正解' },
]

export default function ReviewPage() {
  const [questions, setQuestions] = useState<ExamQuestion[]>([])
  const [filter, setFilter] = useState<Filter>('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data } = await supabase
        .from('exam_questions')
        .select('*')
        .eq('user_id', user.id)
        .or('flag_status.not.is.null,is_correct.eq.false')
        .order('created_at', { ascending: false })

      setQuestions(data ?? [])
      setLoading(false)
    }
    load()
  }, [])

  const filtered = questions.filter(q => {
    if (filter === 'unknown') return q.flag_status === 'unknown'
    if (filter === 'uncertain') return q.flag_status === 'uncertain'
    if (filter === 'wrong') return q.is_correct === false
    return true
  })

  // Deduplicate: keep only the latest version of each question by question text
  const seen = new Set<string>()
  const deduped = filtered.filter(q => {
    const key = q.question_data.question
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })

  function handleFlagged(questionId: string, status: FlagStatus | null) {
    setQuestions(prev => prev.map(q =>
      q.id === questionId ? { ...q, flag_status: status } : q
    ))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-indigo-700 text-white shadow sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-3">
          <Link href="/dashboard" className="text-indigo-200 hover:text-white text-sm">← 戻る</Link>
          <h1 className="text-lg font-bold">復習モード</h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-5">
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
        ) : deduped.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">復習する問題がありません</p>
            <Link href="/exam" className="mt-4 inline-block text-indigo-600 hover:underline text-sm">
              模擬試験を受けてみましょう →
            </Link>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-500">{deduped.length}問</p>
            <div className="space-y-4">
              {deduped.map(q => (
                <div key={q.id}>
                  <QuestionCard
                    question={q}
                    sessionId={q.session_id}
                    onAnswered={() => {}}
                    onFlagged={handleFlagged}
                    reviewMode
                  />
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  )
}
