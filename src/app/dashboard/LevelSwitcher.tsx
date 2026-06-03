'use client'

import { useRouter } from 'next/navigation'
import { ExamLevel } from '@/lib/types'

export default function LevelSwitcher({ current }: { current: ExamLevel }) {
  const router = useRouter()

  function switchTo(level: ExamLevel) {
    router.push(`/dashboard?level=${level}`)
  }

  return (
    <div className="flex bg-white rounded-2xl border-2 border-gray-100 p-1 gap-1 w-fit shadow-sm">
      <button
        onClick={() => switchTo('n2')}
        className={`px-5 py-2 rounded-xl font-black text-sm transition-all ${
          current === 'n2'
            ? 'bg-red-600 text-white shadow'
            : 'text-gray-500 hover:bg-gray-100'
        }`}
      >
        ⚡ N2
      </button>
      <button
        onClick={() => switchTo('n3')}
        className={`px-5 py-2 rounded-xl font-black text-sm transition-all ${
          current === 'n3'
            ? 'bg-pink-500 text-white shadow'
            : 'text-gray-500 hover:bg-gray-100'
        }`}
      >
        🎀 N3
      </button>
    </div>
  )
}
