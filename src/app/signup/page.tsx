'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

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
      // Email confirmation disabled — logged in immediately
      router.push('/dashboard')
      router.refresh()
    } else {
      // Email confirmation required
      setNeedsConfirmation(true)
    }
    setLoading(false)
  }

  if (needsConfirmation) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-100 px-4">
        <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-8 text-center">
          <div className="text-5xl mb-4">📧</div>
          <h2 className="text-xl font-bold text-gray-800 mb-3">確認メールを送信しました</h2>
          <p className="text-gray-600 text-sm mb-2">
            <span className="font-semibold">{email}</span> に確認メールを送りました。
          </p>
          <p className="text-gray-500 text-sm mb-6">
            メール内のリンクをクリックしてアカウントを有効化してください。
          </p>
          <Link href="/login" className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-2.5 rounded-lg transition-colors">
            ログインページへ
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-100 px-4">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-indigo-700">日本語 N2</h1>
          <p className="text-gray-500 mt-1">模擬試験アプリ</p>
        </div>

        <h2 className="text-xl font-semibold text-gray-800 mb-6">新規登録</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">表示名</label>
            <input
              type="text"
              value={displayName}
              onChange={e => setDisplayName(e.target.value)}
              required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="田中 太郎"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">メールアドレス</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="example@email.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">パスワード（6文字以上）</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-red-600 text-sm bg-red-50 px-3 py-2 rounded-lg">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white font-semibold py-2.5 rounded-lg transition-colors"
          >
            {loading ? '登録中...' : 'アカウントを作成'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          すでにアカウントをお持ちの方は{' '}
          <Link href="/login" className="text-indigo-600 hover:underline font-medium">
            ログイン
          </Link>
        </p>
      </div>
    </div>
  )
}
