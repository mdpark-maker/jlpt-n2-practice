'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { QuestionData, FlagStatus } from '@/lib/types'

type RetryQuestion = {
  id: string
  question_data: QuestionData
  flag_status: FlagStatus | null
  is_correct: boolean | null
}

export default function RetrySection({ questions }: { questions: RetryQuestion[] }) {
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)

  const reviewList = questions.filter(q => !q.is_correct || q.flag_status !== null)
  if (reviewList.length === 0) return null

  async function startRetry(qs: QuestionData[], key: string) {
    setLoading(key)
    const res = await fetch('/api/exam/retry', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ questions: qs }),
    })
    if (res.ok) {
      const { sessionId } = await res.json()
      router.push(`/exam/${sessionId}`)
    }
    setLoading(null)
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between gap-3">
        <div>
          <h2 className="font-semibold text-gray-800">要復習の問題</h2>
          <p className="text-xs text-gray-500 mt-0.5">{reviewList.length}問 · 保存済み</p>
        </div>
        <button
          onClick={() => startRetry(reviewList.map(q => q.question_data), 'all')}
          disabled={loading !== null}
          className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors whitespace-nowrap"
        >
          {loading === 'all' ? '準備中...' : 'まとめて再挑戦 →'}
        </button>
      </div>
      <ul className="divide-y divide-gray-100">
        {reviewList.map(q => (
          <li key={q.id} className="px-5 py-3 flex items-center gap-3">
            <div className="flex items-center gap-1.5 shrink-0">
              {q.flag_status && (
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  q.flag_status === 'unknown'
                    ? 'bg-red-100 text-red-600'
                    : 'bg-yellow-100 text-yellow-600'
                }`}>
                  {q.flag_status === 'unknown' ? '❓' : '🤔'}
                </span>
              )}
              {!q.is_correct && <span className="text-sm">❌</span>}
            </div>
            <p className="flex-1 text-sm text-gray-700 truncate">{q.question_data.question}</p>
            <button
              onClick={() => startRetry([q.question_data], q.id)}
              disabled={loading !== null}
              className="shrink-0 text-xs text-indigo-600 hover:text-indigo-800 font-semibold border border-indigo-200 hover:border-indigo-400 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-40"
            >
              {loading === q.id ? '...' : '再挑戦'}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
