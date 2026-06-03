'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Pokeball } from '@/components/PokeUI'
import { DoctorCharacter, FlyingMoney, GoldCoin } from '@/components/RichIllustrations'

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
    <div className="min-h-screen bg-gradient-to-b from-green-700 via-green-600 to-emerald-500 flex flex-col items-center justify-center px-4 py-8 overflow-hidden">

      {/* Background floating coins */}
      <div className="absolute top-6 left-4 opacity-30 anim-float" style={{ animationDelay: '0s' }}>
        <GoldCoin size={50} />
      </div>
      <div className="absolute top-16 right-6 opacity-25 anim-float" style={{ animationDelay: '1.1s' }}>
        <GoldCoin size={36} />
      </div>
      <div className="absolute bottom-20 left-8 opacity-20 anim-float" style={{ animationDelay: '0.6s' }}>
        <GoldCoin size={44} />
      </div>
      <div className="absolute bottom-10 right-10 opacity-20 anim-float" style={{ animationDelay: '1.8s' }}>
        <GoldCoin size={30} />
      </div>

      {/* Hero section */}
      <div className="text-center mb-4 anim-pop w-full max-w-md">
        {/* Title */}
        <div className="mb-3">
          <h1 className="text-white text-3xl font-black drop-shadow-lg leading-tight">
            💰 JLPT(N2/N3)로
          </h1>
          <h1 className="text-yellow-300 text-4xl font-black drop-shadow-lg leading-tight">
            부자되기! 💰
          </h1>
          <p className="text-green-200 text-sm mt-2 font-bold">만점 달성하면 진짜 돈 드려요!</p>
        </div>

        {/* Characters + money */}
        <div className="flex items-end justify-center gap-2 mt-2 mb-1">
          <div className="anim-float" style={{ animationDelay: '0.2s' }}>
            <DoctorCharacter color="#dc2626" label="N2" size={110} />
          </div>
          {/* Money in the middle */}
          <div className="anim-float flex flex-col items-center gap-1" style={{ animationDelay: '0.8s', marginBottom: 8 }}>
            <GoldCoin size={36} />
            <div className="bg-yellow-300 text-yellow-900 text-xs font-black px-2 py-1 rounded-lg shadow-md whitespace-nowrap">
              만점 = 1,000원!
            </div>
            <GoldCoin size={30} />
          </div>
          <div className="anim-float" style={{ animationDelay: '0.5s' }}>
            <DoctorCharacter color="#ec4899" label="N3" size={100} />
          </div>
        </div>

        {/* Flying money strip */}
        <div className="flex justify-center gap-2 mb-1 overflow-hidden">
          <FlyingMoney />
        </div>
      </div>

      {/* Login card */}
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-7 anim-pop border-4 border-yellow-300" style={{ animationDelay: '0.1s' }}>
        <h2 className="text-lg font-black text-gray-800 mb-5 flex items-center gap-2">
          <Pokeball size={20} />
          로그인
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wide">이메일</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-400 text-sm"
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
              className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-400 text-sm"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-red-600 text-xs bg-red-50 border border-red-200 px-3 py-2 rounded-xl">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white font-black py-3 rounded-xl transition-colors text-sm tracking-wide shadow-md"
          >
            {loading ? '로그인 중...' : '💰 시작해서 부자되기!'}
          </button>
        </form>

        <p className="text-center text-xs text-gray-400 mt-5">
          아직 계정이 없으신가요?{' '}
          <Link href="/signup" className="text-green-600 hover:underline font-bold">
            회원가입 →
          </Link>
        </p>
      </div>
    </div>
  )
}
