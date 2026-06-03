'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import QuestionCard from '@/components/QuestionCard'
import ExamProgress from '@/components/ExamProgress'
import { ExamQuestion, FlagStatus, ExamLevel } from '@/lib/types'
import { Pokeball } from '@/components/PokeUI'
import { KittyBow } from '@/components/KittyUI'

type AnswerResult = {
  is_correct: boolean
  correct_answer: string
  explanation: string
  explanation_ko?: string
}

export default function ExamPage() {
  const { sessionId } = useParams<{ sessionId: string }>()
  const router = useRouter()
  const [questions, setQuestions] = useState<ExamQuestion[]>([])
  const [current, setCurrent] = useState(0)
  const [loading, setLoading] = useState(true)
  const [completing, setCompleting] = useState(false)
  const [level, setLevel] = useState<ExamLevel>('n2')

  useEffect(() => {
    fetch(`/api/exam/${sessionId}`)
      .then(r => r.json())
      .then(data => {
        setQuestions(data.questions)
        setLevel(data.session?.level ?? 'n2')
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

  const isKitty = level === 'n3'
  const headerBg = isKitty ? 'bg-pink-500' : 'bg-red-600'
  const pageBg = isKitty ? 'bg-pink-50' : 'bg-red-50'
  const backColor = isKitty ? 'text-pink-200 hover:text-white' : 'text-red-200 hover:text-white'
  const navBtnActive = isKitty ? 'bg-pink-500 hover:bg-pink-600' : 'bg-red-600 hover:bg-red-700'
  const completeBtn = isKitty ? 'bg-green-500 hover:bg-green-600' : 'bg-green-600 hover:bg-green-700'

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${pageBg}`}>
        <div className="text-center">
          <div className="anim-float inline-block mb-3">
            {isKitty ? <KittyBow size={48} /> : <Pokeball size={48} />}
          </div>
          <p className="text-gray-500 font-bold">불러오는 중...</p>
        </div>
      </div>
    )
  }

  const answered = questions.filter(q => q.user_answer !== null).length
  const currentQ = questions[current]
  const allAnswered = answered === questions.length

  return (
    <div className={`min-h-screen ${pageBg}`}>
      <header className={`${headerBg} text-white shadow sticky top-0 z-10`}>
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href={`/dashboard?level=${level}`} className={`${backColor} text-sm`}>← 그만하기</Link>
          <div className="flex items-center gap-2">
            {isKitty ? <KittyBow size={18} /> : <Pokeball size={18} />}
            <h1 className="text-sm font-black">{level.toUpperCase()} 시험!</h1>
          </div>
          <span className={`${isKitty ? 'text-pink-200' : 'text-red-200'} text-xs font-bold`}>
            {answered}/{questions.length}문제
          </span>
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
                  ? isKitty
                    ? 'border-pink-500 bg-pink-500 text-white'
                    : 'border-red-500 bg-red-500 text-white'
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
            theme={isKitty ? 'kitty' : 'pokemon'}
          />
        )}

        {/* Navigation */}
        <div className="flex justify-between gap-3 pt-1">
          <button
            onClick={() => setCurrent(c => Math.max(0, c - 1))}
            disabled={current === 0}
            className="px-4 py-2 border-2 border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-100 disabled:opacity-40"
          >
            ← 이전
          </button>

          {current < questions.length - 1 ? (
            <button
              onClick={() => setCurrent(c => c + 1)}
              className={`px-4 py-2 ${navBtnActive} rounded-xl text-sm font-black text-white`}
            >
              다음 →
            </button>
          ) : (
            <button
              onClick={handleComplete}
              disabled={completing || !allAnswered}
              title={!allAnswered ? `미답변 ${questions.length - answered}문제 있음` : ''}
              className={`px-5 py-2 ${completeBtn} disabled:bg-gray-300 disabled:cursor-not-allowed rounded-xl text-sm font-black text-white transition-colors`}
            >
              {completing ? '채점 중...' : allAnswered ? '⚡ 결과 보기!' : `미답변 ${questions.length - answered}문제`}
            </button>
          )}
        </div>
      </main>
    </div>
  )
}
