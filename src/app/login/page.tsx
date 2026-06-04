'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { GoldCoin, PikachuDoctor, JigglypuffDoctor, HelloKittyDoctor, KuromiDoctor } from '@/components/RichIllustrations'

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
        setError('이메일 인증이 완료되지 않았습니다. 인증 메일의 링크를 클릭해 주세요.')
      } else {
        setError('이메일 또는 비밀번호가 올바르지 않습니다.')
      }
    } else {
      router.push('/dashboard')
      router.refresh()
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-600 via-pink-500 to-fuchsia-400 flex flex-col items-center justify-center px-4 py-6 overflow-hidden">

      {/* Background floating coins */}
      <div className="absolute top-4 left-4 opacity-30 anim-float" style={{ animationDelay: '0s' }}>
        <GoldCoin size={44} />
      </div>
      <div className="absolute top-12 right-6 opacity-25 anim-float" style={{ animationDelay: '1.2s' }}>
        <GoldCoin size={32} />
      </div>
      <div className="absolute bottom-16 left-6 opacity-20 anim-float" style={{ animationDelay: '0.6s' }}>
        <GoldCoin size={38} />
      </div>
      <div className="absolute bottom-8 right-8 opacity-20 anim-float" style={{ animationDelay: '1.8s' }}>
        <GoldCoin size={28} />
      </div>

      {/* Title */}
      <div className="text-center mb-3 anim-pop">
        <h1 className="text-white text-3xl font-black drop-shadow-lg leading-tight">
          💰 JLPT(N2/N3)로
        </h1>
        <h1 className="text-yellow-300 text-4xl font-black drop-shadow-lg leading-tight">
          부자되기! 💰
        </h1>
        <p className="text-pink-100 text-xs mt-1 font-bold">만점 달성하면 진짜 돈 드려요!</p>
      </div>

      {/* 4 doctor characters */}
      <div className="flex items-end justify-center gap-1 mb-1 w-full max-w-sm">
        <div className="anim-float" style={{ animationDelay: '0s' }}>
          <PikachuDoctor size={82} />
        </div>
        <div className="anim-float" style={{ animationDelay: '0.4s' }}>
          <JigglypuffDoctor size={76} />
        </div>
        <div className="anim-float" style={{ animationDelay: '0.8s' }}>
          <HelloKittyDoctor size={80} />
        </div>
        <div className="anim-float" style={{ animationDelay: '1.2s' }}>
          <KuromiDoctor size={74} />
        </div>
      </div>

      {/* Reward info strip */}
      <div className="flex gap-2 mb-3">
        {[
          { q: '5문제', r: '1,000원' },
          { q: '10문제', r: '2,000원' },
          { q: '20문제', r: '5,000원' },
        ].map(({ q, r }) => (
          <div key={q} className="bg-white/20 backdrop-blur-sm rounded-xl px-2 py-1 text-center border border-white/30">
            <p className="text-white text-xs font-black">{q} 만점</p>
            <p className="text-yellow-300 text-xs font-black">{r} 적립</p>
          </div>
        ))}
      </div>

      {/* Login card */}
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-6 anim-pop border-4 border-pink-300" style={{ animationDelay: '0.1s' }}>
        <h2 className="text-lg font-black text-gray-800 mb-4">🩺 로그인</h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wide">이메일</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-pink-400 text-sm"
              placeholder="example@email.com"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wide">비밀번호</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-pink-400 text-sm"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-red-600 text-xs bg-red-50 border border-red-200 px-3 py-2 rounded-xl">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-pink-500 hover:bg-pink-600 disabled:bg-pink-300 text-white font-black py-3 rounded-xl transition-colors text-sm tracking-wide shadow-md"
          >
            {loading ? '로그인 중...' : '💰 시작해서 부자되기!'}
          </button>
        </form>

        <p className="text-center text-xs text-gray-400 mt-4">
          아직 계정이 없으신가요?{' '}
          <Link href="/signup" className="text-pink-500 hover:underline font-bold">
            회원가입 →
          </Link>
        </p>
      </div>
    </div>
  )
}
