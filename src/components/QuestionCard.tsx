'use client'

import { useState } from 'react'
import { ExamQuestion, FlagStatus } from '@/lib/types'

type AnswerResult = {
  is_correct: boolean
  correct_answer: string
  explanation: string
  explanation_ko?: string
}

type Props = {
  question: ExamQuestion
  sessionId: string
  onAnswered: (questionId: string, result: AnswerResult) => void
  onFlagged: (questionId: string, status: FlagStatus | null) => void
  reviewMode?: boolean
  theme?: 'pokemon' | 'kitty'
}

const OPTION_LABELS = ['A', 'B', 'C', 'D']

const CATEGORY_COLORS: Record<string, string> = {
  語彙: 'bg-blue-100 text-blue-700',
  文法: 'bg-purple-100 text-purple-700',
  漢字: 'bg-orange-100 text-orange-700',
  読解: 'bg-green-100 text-green-700',
}

export default function QuestionCard({ question, sessionId, onAnswered, onFlagged, reviewMode, theme = 'pokemon' }: Props) {
  const [selected, setSelected] = useState<string | null>(question.user_answer)
  const [result, setResult] = useState<AnswerResult | null>(
    question.user_answer
      ? {
          is_correct: question.is_correct ?? false,
          correct_answer: question.question_data.correct_answer,
          explanation: question.question_data.explanation,
          explanation_ko: question.question_data.explanation_ko,
        }
      : null
  )
  const [flagging, setFlagging] = useState(false)
  const [currentFlag, setCurrentFlag] = useState<FlagStatus | null>(question.flag_status)
  const q = question.question_data
  const catColor = CATEGORY_COLORS[q.category] ?? 'bg-gray-100 text-gray-700'

  const isKitty = theme === 'kitty'
  const accentColor = isKitty ? 'border-pink-400 bg-pink-50' : 'border-red-400 bg-red-50'
  const cardBorder = isKitty ? 'border-pink-200' : 'border-amber-100'
  const unknownActive = isKitty
    ? 'bg-pink-500 text-white border-pink-500'
    : 'bg-red-500 text-white border-red-500'
  const unknownIdle = isKitty
    ? 'border-pink-300 text-pink-500 hover:bg-pink-50'
    : 'border-red-300 text-red-500 hover:bg-red-50'

  async function handleAnswer(answer: string) {
    if (selected || reviewMode) return
    setSelected(answer)

    const res = await fetch(`/api/exam/${sessionId}/answer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ questionId: question.id, answer }),
    })
    const data: AnswerResult = await res.json()
    setResult(data)
    onAnswered(question.id, data)
  }

  async function handleFlag(status: FlagStatus) {
    setFlagging(true)
    const newStatus = currentFlag === status ? null : status
    await fetch(`/api/exam/${sessionId}/flag`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ questionId: question.id, flag_status: newStatus }),
    })
    setCurrentFlag(newStatus)
    onFlagged(question.id, newStatus)
    setFlagging(false)
  }

  function getOptionStyle(label: string) {
    if (!selected && !reviewMode) {
      return `border-gray-200 ${isKitty ? 'hover:border-pink-400 hover:bg-pink-50' : 'hover:border-red-400 hover:bg-red-50'} cursor-pointer`
    }
    const correct = result?.correct_answer ?? question.question_data.correct_answer
    if (label === correct) return 'border-green-500 bg-green-50 text-green-800'
    if (label === selected && !result?.is_correct) return 'border-red-400 bg-red-50 text-red-800'
    return 'border-gray-200 text-gray-400'
  }

  const explanation = result?.explanation ?? q.explanation
  const explanationKo = result?.explanation_ko ?? q.explanation_ko

  return (
    <div className={`bg-white rounded-2xl shadow-sm border-2 ${cardBorder} p-6`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <span className={`text-xs font-black px-2.5 py-1 rounded-full ${catColor}`}>
          {q.category}
        </span>
        {!reviewMode && (
          <div className="flex gap-2">
            <button
              onClick={() => handleFlag('unknown')}
              disabled={flagging}
              className={`px-3 py-1 rounded-full text-xs font-bold border transition-colors ${
                currentFlag === 'unknown' ? unknownActive : unknownIdle
              }`}
            >
              ❓ 모르겠어요
            </button>
            <button
              onClick={() => handleFlag('uncertain')}
              disabled={flagging}
              className={`px-3 py-1 rounded-full text-xs font-bold border transition-colors ${
                currentFlag === 'uncertain'
                  ? 'bg-amber-500 text-white border-amber-500'
                  : 'border-amber-400 text-amber-600 hover:bg-amber-50'
              }`}
            >
              🤔 애매해요
            </button>
          </div>
        )}
      </div>

      {/* Question */}
      <p className="text-gray-800 text-base leading-relaxed mb-5 whitespace-pre-wrap">{q.question}</p>

      {/* Options */}
      <div className="space-y-2.5">
        {q.options.map((opt, i) => {
          const label = OPTION_LABELS[i]
          return (
            <button
              key={label}
              onClick={() => handleAnswer(label)}
              disabled={!!selected || reviewMode}
              className={`w-full text-left px-4 py-3 rounded-xl border-2 transition-all text-sm font-medium ${getOptionStyle(label)}`}
            >
              <span className="font-black mr-2">{label}.</span>
              {opt.replace(/^[A-D]\.\s*/, '')}
            </button>
          )
        })}
      </div>

      {/* Result feedback */}
      {(result || reviewMode) && (
        <div className={`mt-4 rounded-xl border-2 overflow-hidden ${
          reviewMode
            ? 'border-blue-200'
            : result?.is_correct
            ? 'border-green-300'
            : 'border-red-300'
        }`}>
          {!reviewMode && (
            <div className={`px-4 py-2 font-black text-base ${result?.is_correct ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
              {result?.is_correct ? '✅ 정답!' : '❌ 오답...'}
            </div>
          )}
          {/* Korean explanation */}
          {explanationKo && (
            <div className="px-4 py-3 bg-pink-50 border-b border-pink-100">
              <p className="text-xs font-black text-pink-600 mb-1">🇰🇷 한국어 해설</p>
              <p className="text-gray-700 text-sm leading-relaxed">{explanationKo}</p>
            </div>
          )}
          {/* Japanese explanation */}
          <div className="px-4 py-3 bg-blue-50">
            <p className="text-xs font-black text-blue-600 mb-1">🇯🇵 日本語解説</p>
            <p className="text-gray-700 text-sm leading-relaxed">{explanation}</p>
          </div>
        </div>
      )}
    </div>
  )
}
