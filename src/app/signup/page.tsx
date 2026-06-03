'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Pokeball, PikachuMascot } from '@/components/PokeUI'

export default function SignupPage() {
  const router = useRouter()
  const [displayName, setDisplayName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [needsConfirmation, setNeedsConfirmation] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (password.length < 6) {
      setError('パスワードは6文字以上で設定してください')
      return
    }
    setLoading(true)
    const supabase = createClient()
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { display_name: displayName } },
    })

    if (error) {
      const msg = error.message
      if (msg.includes('already registered') || msg.includes('already been registered')) {
        setError('このメールアドレスはすでに登録されています')
      } else if (msg.includes('invalid') || msg.includes('Invalid')) {
        setError('メールアドレスの形式が正しくありません')
      } else {
        setError(`登録に失敗しました: ${msg}`)
      }
    } else if (data.session) {
      router.push('/dashboard')
      router.refresh()
    } else {
      setNeedsConfirmation(true)
    }
    setLoading(false)
  }

  if (needsConfirmation) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-red-700 to-red-500 flex items-center justify-center px-4">
        <div className="poke-card bg-white w-full max-w-sm p-8 text-center anim-pop">
          <div className="text-5xl mb-3">📧</div>
          <h2 className="text-xl font-black text-gray-800 mb-2">確認メールを送信しました</h2>
          <p className="text-gray-500 text-sm mb-1"><span className="font-bold">{email}</span> に確認メールを送りました。</p>
          <p className="text-gray-400 text-xs mb-6">メール内のリンクをクリックしてアカウントを有効化してください。</p>
          <Link href="/login" className="inline-block bg-red-600 hover:bg-red-700 text-white font-black px-6 py-2.5 rounded-xl transition-colors text-sm">
            ⚡ ログインページへ
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-700 via-red-600 to-red-500 flex flex-col items-center justify-center px-4 py-8">
      <div className="text-center mb-6 anim-pop">
        <div className="anim-float inline-block">
          <PikachuMascot size={90} />
        </div>
        <h1 className="text-white text-2xl font-black mt-2">トレーナー登録</h1>
        <p className="text-red-200 text-xs mt-1">あなたの旅が始まる！</p>
      </div>

      <div className="poke-card bg-white w-full max-w-sm p-7 anim-pop" style={{ animationDelay: '0.1s' }}>
        <h2 className="text-lg font-black text-gray-800 mb-5 flex items-center gap-2">
          <Pokeball size={20} />
          新規登録
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wide">トレーナー名</label>
            <input
              type="text"
              value={displayName}
              onChange={e => setDisplayName(e.target.value)}
              required
              className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-red-400 text-sm"
              placeholder="田中 太郎"
            />
          </div>
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
            <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wide">パスワード（6文字以上）</label>
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
            {loading ? '登録中...' : '⚡ トレーナーになる！'}
          </button>
        </form>

        <p className="text-center text-xs text-gray-400 mt-5">
          すでにトレーナー？{' '}
          <Link href="/login" className="text-red-600 hover:underline font-bold">
            ログイン →
          </Link>
        </p>
      </div>
    </div>
  )
}
