'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import QuestionCard from '@/components/QuestionCard'
import ExamProgress from '@/components/ExamProgress'
import { ExamQuestion, FlagStatus } from '@/lib/types'

type AnswerResult = {
  is_correct: boolean
  correct_answer: string
  explanation: string
}

export default function ExamPage() {
  const { sessionId } = useParams<{ sessionId: string }>()
  const router = useRouter()
  const [questions, setQuestions] = useState<ExamQuestion[]>([])
  const [current, setCurrent] = useState(0)
  const [loading, setLoading] = useState(true)
  const [completing, setCompleting] = useState(false)

  useEffect(() => {
    fetch(`/api/exam/${sessionId}`)
      .then(r => r.json())
      .then(data => {
        setQuestions(data.questions)
        // Resume at first unanswered question
        const firstUnanswered = data.questions.findIndex((q: ExamQuestion) => q.user_answer === null)
        setCurrent(firstUnanswered >= 0 ? firstUnanswered : 0)
        setLoading(false)
      })
  }, [sessionId])

  const handleAnswered = useCallback((questionId: string, result: AnswerResult) => {
    setQuestions(prev => prev.map(q =>
      q.id === questionId
        ? { ...q, user_answer: result.correct_answer, is_correct: result.is_correct }
        : q
    ))
  }, [])

  const handleFlagged = useCallback((questionId: string, status: FlagStatus | null) => {
    setQuestions(prev => prev.map(q =>
      q.id === questionId ? { ...q, flag_status: status } : q
    ))
  }, [])

  async function handleComplete() {
    setCompleting(true)
    await fetch(`/api/exam/${sessionId}/complete`, { method: 'POST' })
    router.push(`/exam/${sessionId}/results`)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">読み込み中...</p>
      </div>
    )
  }

  const answered = questions.filter(q => q.user_answer !== null).length
  const currentQ = questions[current]
  const allAnswered = answered === questions.length

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-indigo-700 text-white shadow sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/dashboard" className="text-indigo-200 hover:text-white text-sm">← ダッシュボード</Link>
          <h1 className="text-sm font-semibold">JLPT N2 模擬試験</h1>
          <div className="w-20" />
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-4">
        <ExamProgress current={current} total={questions.length} answered={answered} />

        {/* Question navigator */}
        <div className="flex flex-wrap gap-1.5 mb-2">
          {questions.map((q, i) => (
            <button
              key={q.id}
              onClick={() => setCurrent(i)}
              className={`w-8 h-8 rounded-lg text-xs font-semibold border-2 transition-all ${
                i === current
                  ? 'border-indigo-500 bg-indigo-500 text-white'
                  : q.flag_status === 'unknown'
                  ? 'border-red-400 bg-red-50 text-red-600'
                  : q.flag_status === 'uncertain'
                  ? 'border-yellow-400 bg-yellow-50 text-yellow-600'
                  : q.user_answer !== null
                  ? q.is_correct
                    ? 'border-green-400 bg-green-50 text-green-700'
                    : 'border-red-300 bg-red-50 text-red-600'
                  : 'border-gray-200 bg-white text-gray-600'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>

        {currentQ && (
          <QuestionCard
            key={currentQ.id}
            question={currentQ}
            sessionId={sessionId}
            onAnswered={handleAnswered}
            onFlagged={handleFlagged}
          />
        )}

        {/* Navigation */}
        <div className="flex justify-between gap-3 pt-2">
          <button
            onClick={() => setCurrent(c => Math.max(0, c - 1))}
            disabled={current === 0}
            className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            ← 前の問題
          </button>

          {current < questions.length - 1 ? (
            <button
              onClick={() => setCurrent(c => c + 1)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-xl text-sm font-medium text-white"
            >
              次の問題 →
            </button>
          ) : (
            <button
              onClick={handleComplete}
              disabled={completing || !allAnswered}
              title={!allAnswered ? `未回答の問題が${questions.length - answered}問あります` : ''}
              className="px-5 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed rounded-xl text-sm font-bold text-white transition-colors"
            >
              {completing ? '採点中...' : allAnswered ? '試験を終了して採点する ✓' : `未回答 ${questions.length - answered}問`}
            </button>
          )}
        </div>
      </main>
    </div>
  )
}
