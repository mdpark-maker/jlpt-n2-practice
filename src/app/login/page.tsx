'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Pokeball, PikachuMascot } from '@/components/PokeUI'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      if (error.message.includes('Email not confirmed')) {
        setError('メールアドレスが未確認です。確認メールのリンクをクリックしてください。')
      } else {
        setError('メールアドレスまたはパスワードが正しくありません')
      }
    } else {
      router.push('/dashboard')
      router.refresh()
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-700 via-red-600 to-red-500 flex flex-col items-center justify-center px-4 py-8">
      {/* Pokeball decorations */}
      <div className="absolute top-8 left-8 opacity-20 anim-float" style={{ animationDelay: '0s' }}>
        <Pokeball size={60} />
      </div>
      <div className="absolute top-20 right-10 opacity-15 anim-float" style={{ animationDelay: '1s' }}>
        <Pokeball size={40} />
      </div>
      <div className="absolute bottom-16 left-12 opacity-15 anim-float" style={{ animationDelay: '0.5s' }}>
        <Pokeball size={50} />
      </div>

      {/* Mascot + title */}
      <div className="text-center mb-6 anim-pop">
        <div className="anim-float inline-block">
          <PikachuMascot size={110} />
        </div>
        <h1 className="text-white text-3xl font-black mt-2 drop-shadow">日本語 N2 道場</h1>
        <p className="text-red-200 text-sm mt-1">⚡ JLPT N2 模擬試験アプリ</p>
      </div>

      {/* Login card */}
      <div className="poke-card bg-white w-full max-w-sm p-7 anim-pop" style={{ animationDelay: '0.1s' }}>
        <h2 className="text-lg font-black text-gray-800 mb-5 flex items-center gap-2">
          <Pokeball size={20} />
          トレーナーログイン
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wide">メールアドレス</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-red-400 text-sm"
              placeholder="trainer@poke.com"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wide">パスワード</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-red-400 text-sm"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-red-600 text-xs bg-red-50 border border-red-200 px-3 py-2 rounded-xl">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white font-black py-3 rounded-xl transition-colors text-sm tracking-wide shadow-md"
          >
            {loading ? 'ログイン中...' : '⚡ バトル開始！'}
          </button>
        </form>

        <p className="text-center text-xs text-gray-400 mt-5">
          まだトレーナーじゃない？{' '}
          <Link href="/signup" className="text-red-600 hover:underline font-bold">
            新規登録 →
          </Link>
        </p>
      </div>
    </div>
  )
}
