'use client'

import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { ExamCategory, ExamLevel } from '@/lib/types'
import { Pokeball } from '@/components/PokeUI'
import { KittyBow } from '@/components/KittyUI'

const CATEGORIES: { value: ExamCategory; label: string; desc: string; emoji: string }[] = [
  { value: 'all',  label: '종합',  desc: '어휘·문법·한자·독해',  emoji: '⚡' },
  { value: '語彙', label: '어휘',  desc: '단어 의미·용법',        emoji: '📖' },
  { value: '文法', label: '문법',  desc: '조사·접속·경어',        emoji: '✏️' },
  { value: '漢字', label: '한자',  desc: '읽기·쓰기',             emoji: '🈳' },
  { value: '読解', label: '독해',  desc: '문장 내용 이해',        emoji: '📜' },
]

const COUNTS = [5, 10, 20]

function ExamSetupInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const level: ExamLevel = searchParams.get('level') === 'n3' ? 'n3' : 'n2'
  const isKitty = level === 'n3'

  const [count, setCount] = useState(10)
  const [category, setCategory] = useState<ExamCategory>('all')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const accent = isKitty ? 'border-pink-500 bg-pink-50' : 'border-red-500 bg-red-50'
  const accentHover = isKitty ? 'hover:border-pink-300' : 'hover:border-red-300'
  const btnColor = isKitty
    ? 'bg-pink-500 hover:bg-pink-600 disabled:bg-pink-300'
    : 'bg-red-600 hover:bg-red-700 disabled:bg-red-300'
  const headerBg = isKitty ? 'bg-pink-500' : 'bg-red-600'
  const backColor = isKitty ? 'text-pink-200 hover:text-white' : 'text-red-200 hover:text-white'

  async function startExam() {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/exam', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ count, category, level }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || '알 수 없는 오류')
      router.push(`/exam/${data.sessionId}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : '문제 생성에 실패했습니다.')
      setLoading(false)
    }
  }

  return (
    <div className={`min-h-screen ${isKitty ? 'bg-pink-50' : 'bg-red-50'}`}>
      <header className={`${headerBg} text-white shadow`}>
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link href={`/dashboard?level=${level}`} className={`${backColor} text-sm`}>← 뒤로</Link>
          <div className="flex items-center gap-2 flex-1">
            {isKitty ? <KittyBow size={20} /> : <Pokeball size={20} />}
            <h1 className="text-sm font-black">
              {isKitty ? 'N3 · 헬로키티 시험 설정' : 'N2 · 포켓몬 시험 설정'}
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        {/* Category */}
        <div className="bg-white rounded-2xl border-2 border-gray-100 p-6 shadow-sm">
          <h2 className="font-black text-gray-800 mb-4 flex items-center gap-2">
            <span>🎯</span> 시험 분야
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {CATEGORIES.map(c => (
              <button
                key={c.value}
                onClick={() => setCategory(c.value)}
                className={`p-3 rounded-xl border-2 text-left transition-all ${
                  category === c.value ? accent : `border-gray-200 ${accentHover}`
                }`}
              >
                <p className="text-lg mb-0.5">{c.emoji}</p>
                <p className="font-black text-gray-800 text-sm">{c.label}</p>
                <p className="text-xs text-gray-400 mt-0.5">{c.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Count */}
        <div className="bg-white rounded-2xl border-2 border-gray-100 p-6 shadow-sm">
          <h2 className="font-black text-gray-800 mb-4 flex items-center gap-2">
            <span>⚔️</span> 문제 수
          </h2>
          <div className="flex gap-3">
            {[
              { n: 5,  reward: '1,000원' },
              { n: 10, reward: '2,000원' },
              { n: 20, reward: '5,000원' },
            ].map(({ n, reward }) => (
              <button
                key={n}
                onClick={() => setCount(n)}
                className={`flex-1 py-3 px-2 rounded-xl border-2 font-black transition-all text-sm flex flex-col items-center gap-1 ${
                  count === n
                    ? (isKitty ? 'border-pink-500 bg-pink-50 text-pink-700' : 'border-red-500 bg-red-50 text-red-700')
                    : 'border-gray-200 text-gray-500 hover:border-gray-300'
                }`}
              >
                <span>{n}문제</span>
                <span className="text-xs font-bold text-yellow-600">만점 {reward}</span>
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-3 text-center">💰 만점 달성 시 적립금 지급!</p>
        </div>

        {error && (
          <p className="text-red-600 text-sm bg-red-50 border border-red-200 px-4 py-3 rounded-xl">{error}</p>
        )}

        <button
          onClick={startExam}
          disabled={loading}
          className={`w-full ${btnColor} text-white font-black py-4 rounded-2xl text-lg transition-colors shadow-lg`}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
              </svg>
              AI가 문제를 생성 중...
            </span>
          ) : isKitty ? '🎀 시험 시작!' : '⚡ 시험 시작!'}
        </button>
      </main>
    </div>
  )
}

export default function ExamSetupPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">불러오는 중...</div>}>
      <ExamSetupInner />
    </Suspense>
  )
}
