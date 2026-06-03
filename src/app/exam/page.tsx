'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ExamCategory } from '@/lib/types'

const CATEGORIES: { value: ExamCategory; label: string; desc: string }[] = [
  { value: 'all', label: '総合', desc: '語彙・文法・漢字・読解' },
  { value: '語彙', label: '語彙', desc: '単語の意味・用法' },
  { value: '文法', label: '文法', desc: '助詞・接続・敬語' },
  { value: '漢字', label: '漢字', desc: '読み方・書き方' },
  { value: '読解', label: '読解', desc: '文章の内容理解' },
]

const COUNTS = [5, 10, 20]

export default function ExamSetupPage() {
  const router = useRouter()
  const [count, setCount] = useState(10)
  const [category, setCategory] = useState<ExamCategory>('all')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function startExam() {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/exam', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ count, category }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || '不明なエラー')
      router.push(`/exam/${data.sessionId}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : '問題の生成に失敗しました。')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-indigo-700 text-white shadow">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-3">
          <Link href="/dashboard" className="text-indigo-200 hover:text-white text-sm">← 戻る</Link>
          <h1 className="text-lg font-bold">新しい模擬試験</h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-10 space-y-8">
        {/* Category */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-800 mb-4">カテゴリを選択</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {CATEGORIES.map(c => (
              <button
                key={c.value}
                onClick={() => setCategory(c.value)}
                className={`p-3 rounded-xl border-2 text-left transition-all ${
                  category === c.value
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-200 hover:border-indigo-300'
                }`}
              >
                <p className="font-semibold text-gray-800">{c.label}</p>
                <p className="text-xs text-gray-500 mt-0.5">{c.desc}</p>
              </button>
            ))}
          </div>
        </section>

        {/* Count */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-800 mb-4">問題数を選択</h2>
          <div className="flex gap-3">
            {COUNTS.map(n => (
              <button
                key={n}
                onClick={() => setCount(n)}
                className={`flex-1 py-3 rounded-xl border-2 font-semibold transition-all ${
                  count === n
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                    : 'border-gray-200 text-gray-600 hover:border-indigo-300'
                }`}
              >
                {n}問
              </button>
            ))}
          </div>
        </section>

        {error && (
          <p className="text-red-600 text-sm bg-red-50 px-4 py-3 rounded-xl">{error}</p>
        )}

        <button
          onClick={startExam}
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white font-bold py-4 rounded-xl text-lg transition-colors shadow"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
              </svg>
              AIが問題を生成中...（少々お待ちください）
            </span>
          ) : '試験を開始する →'}
        </button>
      </main>
    </div>
  )
}
