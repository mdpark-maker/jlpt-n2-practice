'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import QuestionCard from '@/components/QuestionCard'
import ExamProgress from '@/components/ExamProgress'
import { ExamQuestion, FlagStatus } from '@/lib/types'
import { Pokeball } from '@/components/PokeUI'

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
      <div className="min-h-screen flex items-center justify-center bg-red-50">
        <div className="text-center">
          <div className="anim-float inline-block mb-3"><Pokeball size={48} /></div>
          <p className="text-gray-500 font-bold">読み込み中...</p>
        </div>
      </div>
    )
  }

  const answered = questions.filter(q => q.user_answer !== null).length
  const currentQ = questions[current]
  const allAnswered = answered === questions.length

  return (
    <div className="min-h-screen bg-red-50">
      <header className="bg-red-600 text-white shadow sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/dashboard" className="text-red-200 hover:text-white text-sm">← やめる</Link>
          <div className="flex items-center gap-2">
            <Pokeball size={18} />
            <h1 className="text-sm font-black">N2 バトル！</h1>
          </div>
          <span className="text-red-200 text-xs font-bold">{answered}/{questions.length}問</span>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-5 space-y-4">
        <ExamProgress current={current} total={questions.length} answered={answered} />

        {/* Question navigator */}
        <div className="flex flex-wrap gap-1.5">
          {questions.map((q, i) => (
            <button
              key={q.id}
              onClick={() => setCurrent(i)}
              className={`w-8 h-8 rounded-lg text-xs font-black border-2 transition-all ${
                i === current
                  ? 'border-red-500 bg-red-500 text-white'
                  : q.flag_status === 'unknown'
                  ? 'border-red-400 bg-red-50 text-red-600'
                  : q.flag_status === 'uncertain'
                  ? 'border-amber-400 bg-amber-50 text-amber-600'
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
        <div className="flex justify-between gap-3 pt-1">
          <button
            onClick={() => setCurrent(c => Math.max(0, c - 1))}
            disabled={current === 0}
            className="px-4 py-2 border-2 border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-100 disabled:opacity-40"
          >
            ← 前へ
          </button>

          {current < questions.length - 1 ? (
            <button
              onClick={() => setCurrent(c => c + 1)}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-xl text-sm font-black text-white"
            >
              次へ →
            </button>
          ) : (
            <button
              onClick={handleComplete}
              disabled={completing || !allAnswered}
              title={!allAnswered ? `未回答 ${questions.length - answered}問あります` : ''}
              className="px-5 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed rounded-xl text-sm font-black text-white transition-colors"
            >
              {completing ? '採点中...' : allAnswered ? '⚡ 結果を見る！' : `未回答 ${questions.length - answered}問`}
            </button>
          )}
        </div>
      </main>
    </div>
  )
}
