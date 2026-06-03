'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { KittyBow } from '@/components/KittyUI'
import { DoctorCharacter, MoneyStack, GoldCoin } from '@/components/RichIllustrations'

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
      setError('비밀번호는 6자 이상이어야 합니다.')
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
        setError('이미 등록된 이메일 주소입니다.')
      } else if (msg.includes('invalid') || msg.includes('Invalid')) {
        setError('이메일 형식이 올바르지 않습니다.')
      } else {
        setError(`회원가입 실패: ${msg}`)
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
      <div className="min-h-screen bg-gradient-to-b from-green-700 to-emerald-500 flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-8 text-center anim-pop border-4 border-yellow-300">
          <div className="text-5xl mb-3">📧</div>
          <h2 className="text-xl font-black text-gray-800 mb-2">인증 메일을 발송했습니다</h2>
          <p className="text-gray-500 text-sm mb-1"><span className="font-bold">{email}</span> 으로 인증 메일을 보냈습니다.</p>
          <p className="text-gray-400 text-xs mb-6">메일의 링크를 클릭하여 계정을 활성화해 주세요.</p>
          <Link href="/login" className="inline-block bg-green-600 hover:bg-green-700 text-white font-black px-6 py-2.5 rounded-xl transition-colors text-sm">
            💰 로그인 페이지로
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-700 via-green-600 to-emerald-500 flex flex-col items-center justify-center px-4 py-8 overflow-hidden">

      {/* Background coins */}
      <div className="absolute top-8 right-8 opacity-25 anim-float" style={{ animationDelay: '0.4s' }}>
        <GoldCoin size={40} />
      </div>
      <div className="absolute top-24 left-6 opacity-20 anim-float" style={{ animationDelay: '1.3s' }}>
        <GoldCoin size={28} />
      </div>
      <div className="absolute bottom-16 right-6 opacity-20 anim-float" style={{ animationDelay: '0.9s' }}>
        <GoldCoin size={34} />
      </div>

      {/* Hero */}
      <div className="text-center mb-4 anim-pop w-full max-w-md">
        <h1 className="text-white text-3xl font-black drop-shadow-lg">
          💰 JLPT(N2/N3)로
        </h1>
        <h1 className="text-yellow-300 text-4xl font-black drop-shadow-lg">
          부자되기! 💰
        </h1>
        <p className="text-green-200 text-sm mt-1 font-bold">지금 가입하고 만점 도전!</p>

        {/* Doctors and money */}
        <div className="flex items-end justify-center gap-4 mt-3">
          <div className="anim-float" style={{ animationDelay: '0.3s' }}>
            <DoctorCharacter color="#dc2626" label="N2" size={95} />
          </div>
          <div className="anim-float flex flex-col items-center" style={{ animationDelay: '0.7s', marginBottom: 6 }}>
            <MoneyStack />
            <p className="text-yellow-300 text-xs font-black mt-1">10,000원 = 현금!</p>
          </div>
          <div className="anim-float" style={{ animationDelay: '1s' }}>
            <DoctorCharacter color="#ec4899" label="N3" size={90} />
          </div>
        </div>
      </div>

      {/* Signup card */}
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-7 anim-pop border-4 border-yellow-300" style={{ animationDelay: '0.1s' }}>
        <h2 className="text-lg font-black text-gray-800 mb-5 flex items-center gap-2">
          <KittyBow size={20} />
          회원가입
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wide">닉네임</label>
            <input
              type="text"
              value={displayName}
              onChange={e => setDisplayName(e.target.value)}
              required
              className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-400 text-sm"
              placeholder="홍길동"
            />
          </div>
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
            <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wide">비밀번호 (6자 이상)</label>
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
            {loading ? '가입 중...' : '💰 가입하고 부자되기!'}
          </button>
        </form>

        <p className="text-center text-xs text-gray-400 mt-5">
          이미 계정이 있으신가요?{' '}
          <Link href="/login" className="text-green-600 hover:underline font-bold">
            로그인 →
          </Link>
        </p>
      </div>
    </div>
  )
}
