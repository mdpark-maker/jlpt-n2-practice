'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ExamCategory } from '@/lib/types'
import { Pokeball } from '@/components/PokeUI'

const CATEGORIES: { value: ExamCategory; label: string; desc: string; emoji: string }[] = [
  { value: 'all',  label: '総合',  desc: '語彙・文法・漢字・読解', emoji: '⚡' },
  { value: '語彙', label: '語彙',  desc: '単語の意味・用法',        emoji: '📖' },
  { value: '文法', label: '文法',  desc: '助詞・接続・敬語',        emoji: '✏️' },
  { value: '漢字', label: '漢字',  desc: '読み方・書き方',          emoji: '🈳' },
  { value: '読解', label: '読解',  desc: '文章の内容理解',          emoji: '📜' },
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
    <div className="min-h-screen bg-red-50">
      <header className="bg-red-600 text-white shadow">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/dashboard" className="text-red-200 hover:text-white text-sm">← 戻る</Link>
          <div className="flex items-center gap-2 flex-1">
            <Pokeball size={20} />
            <h1 className="text-sm font-black">バトル設定</h1>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        {/* Category */}
        <div className="bg-white poke-card p-6">
          <h2 className="font-black text-gray-800 mb-4 flex items-center gap-2">
            <span>🎯</span> バトルジャンル
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {CATEGORIES.map(c => (
              <button
                key={c.value}
                onClick={() => setCategory(c.value)}
                className={`p-3 rounded-xl border-2 text-left transition-all ${
                  category === c.value
                    ? 'border-red-500 bg-red-50'
                    : 'border-gray-200 hover:border-red-300'
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
        <div className="bg-white poke-card p-6">
          <h2 className="font-black text-gray-800 mb-4 flex items-center gap-2">
            <span>⚔️</span> 問題数
          </h2>
          <div className="flex gap-3">
            {COUNTS.map(n => (
              <button
                key={n}
                onClick={() => setCount(n)}
                className={`flex-1 py-3 rounded-xl border-2 font-black transition-all text-sm ${
                  count === n
                    ? 'border-red-500 bg-red-50 text-red-700'
                    : 'border-gray-200 text-gray-500 hover:border-red-300'
                }`}
              >
                {n}問
              </button>
            ))}
          </div>
        </div>

        {error && (
          <p className="text-red-600 text-sm bg-red-50 border border-red-200 px-4 py-3 rounded-xl">{error}</p>
        )}

        <button
          onClick={startExam}
          disabled={loading}
          className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white font-black py-4 rounded-2xl text-lg transition-colors shadow-lg"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
              </svg>
              AIが問題を生成中...
            </span>
          ) : '⚡ バトル開始！'}
        </button>
      </main>
    </div>
  )
}
