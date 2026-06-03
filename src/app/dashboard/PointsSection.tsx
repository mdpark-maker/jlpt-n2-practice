'use client'

import { useState } from 'react'

export default function PointsSection({ initialPoints }: { initialPoints: number }) {
  const [points, setPoints] = useState(initialPoints)
  const [voucher, setVoucher] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)

  const canRedeem = points >= 10000

  async function handleRedeem() {
    setLoading(true)
    const res = await fetch('/api/points/redeem', { method: 'POST' })
    const data = await res.json()
    if (res.ok) {
      setVoucher(data.code)
      setPoints(data.newPoints)
      setShowModal(true)
    }
    setLoading(false)
  }

  function closeModal() {
    setShowModal(false)
    setVoucher(null)
  }

  return (
    <>
      <div className="bg-white rounded-2xl border-2 border-yellow-200 p-5 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs text-gray-400 font-bold mb-1">💰 적립 포인트</p>
            <p className="text-3xl font-black text-yellow-600">{points.toLocaleString()}원</p>
            <p className="text-xs text-gray-400 mt-1">
              만점 달성 시 1,000원 적립 · 10,000원 시 현금 교환
            </p>
            {points > 0 && points < 10000 && (
              <div className="mt-2 max-w-xs">
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-2 bg-yellow-400 rounded-full transition-all"
                    style={{ width: `${(points / 10000) * 100}%` }}
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1">{10000 - points}원 더 필요</p>
              </div>
            )}
          </div>
          <button
            onClick={handleRedeem}
            disabled={!canRedeem || loading}
            className={`shrink-0 px-4 py-3 rounded-xl font-black text-sm transition-all ${
              canRedeem
                ? 'bg-yellow-400 hover:bg-yellow-500 text-yellow-900 shadow-md'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            {loading ? '처리 중...' : '💵 현금으로 변환'}
          </button>
        </div>
      </div>

      {/* Voucher modal */}
      {showModal && voucher && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl anim-pop">
            <div className="text-5xl mb-3">🎉</div>
            <h2 className="text-xl font-black text-gray-800 mb-1">10,000원 교환권 발급!</h2>
            <p className="text-gray-400 text-sm mb-5">아래 코드를 캡쳐해 주세요</p>

            <div className="bg-yellow-50 border-2 border-yellow-300 rounded-2xl p-5 mb-4">
              <p className="text-xs text-gray-400 font-bold mb-2">교환 코드</p>
              <p className="text-2xl font-black text-yellow-700 tracking-widest">{voucher}</p>
              <p className="text-xs text-yellow-600 mt-2 font-bold">금액: 10,000원</p>
            </div>

            <div className="bg-pink-50 border border-pink-200 rounded-xl px-4 py-3 mb-5">
              <p className="text-sm font-black text-pink-700">📸 캡쳐 후 마스터에게 보여주세요!</p>
            </div>

            <button
              onClick={closeModal}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-black py-3 rounded-xl transition-colors text-sm"
            >
              확인
            </button>
          </div>
        </div>
      )}
    </>
  )
}
