// Rich SVG illustrations for login/signup pages

export function MoneyBill({ size = 80, rotate = 0 }: { size?: number; rotate?: number }) {
  return (
    <svg
      width={size}
      height={size * 0.55}
      viewBox="0 0 140 77"
      style={{ transform: `rotate(${rotate}deg)` }}
      aria-hidden
    >
      {/* Bill body */}
      <rect x="2" y="2" width="136" height="73" rx="8" fill="#4ade80" stroke="#16a34a" strokeWidth="2.5" />
      {/* Inner border */}
      <rect x="8" y="8" width="124" height="61" rx="5" fill="none" stroke="#16a34a" strokeWidth="1.5" strokeDasharray="4 2" />
      {/* Center oval */}
      <ellipse cx="70" cy="38" rx="22" ry="18" fill="#bbf7d0" stroke="#16a34a" strokeWidth="1.5" />
      {/* ₩ symbol */}
      <text x="70" y="44" textAnchor="middle" fontSize="20" fontWeight="bold" fill="#15803d" fontFamily="Arial">₩</text>
      {/* Corner values */}
      <text x="18" y="24" fontSize="10" fontWeight="bold" fill="#15803d" fontFamily="Arial">10,000</text>
      <text x="122" y="62" fontSize="10" fontWeight="bold" fill="#15803d" fontFamily="Arial" textAnchor="end">10,000</text>
      {/* Decorative lines */}
      <line x1="2" y1="28" x2="44" y2="28" stroke="#16a34a" strokeWidth="1" opacity="0.5" />
      <line x1="96" y1="48" x2="138" y2="48" stroke="#16a34a" strokeWidth="1" opacity="0.5" />
    </svg>
  )
}

export function GoldCoin({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 50 50" aria-hidden>
      <circle cx="25" cy="25" r="22" fill="#fbbf24" stroke="#d97706" strokeWidth="3" />
      <circle cx="25" cy="25" r="16" fill="#fde68a" stroke="#d97706" strokeWidth="1.5" />
      <text x="25" y="30" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#92400e" fontFamily="Arial">₩</text>
    </svg>
  )
}

export function MoneyStack() {
  return (
    <div className="relative inline-block" style={{ width: 160, height: 110 }}>
      {/* Bills stacked */}
      <div className="absolute" style={{ bottom: 30, left: 0, transform: 'rotate(-12deg)', opacity: 0.85 }}>
        <MoneyBill size={110} />
      </div>
      <div className="absolute" style={{ bottom: 35, left: 10, transform: 'rotate(-5deg)', opacity: 0.92 }}>
        <MoneyBill size={110} />
      </div>
      <div className="absolute" style={{ bottom: 40, left: 20, transform: 'rotate(3deg)' }}>
        <MoneyBill size={110} />
      </div>
      {/* Coins */}
      <div className="absolute" style={{ bottom: 0, right: 0 }}>
        <GoldCoin size={38} />
      </div>
      <div className="absolute" style={{ bottom: 20, right: 30 }}>
        <GoldCoin size={28} />
      </div>
    </div>
  )
}

export function DoctorCharacter({ color = '#3b82f6', label = 'N2', size = 130 }: { color?: string; label?: string; size?: number }) {
  const scale = size / 130
  return (
    <svg width={size} height={size * 1.2} viewBox="0 0 130 156" aria-label={`Doctor ${label}`}>
      {/* Hair */}
      <ellipse cx="65" cy="28" rx="28" ry="14" fill="#1c1917" />
      {/* Head */}
      <ellipse cx="65" cy="42" rx="26" ry="26" fill="#fde68a" stroke="#f59e0b" strokeWidth="1.5" />
      {/* Eyes */}
      <ellipse cx="56" cy="38" rx="4" ry="5" fill="#1c1917" />
      <ellipse cx="74" cy="38" rx="4" ry="5" fill="#1c1917" />
      <circle cx="57.5" cy="36.5" r="1.5" fill="white" />
      <circle cx="75.5" cy="36.5" r="1.5" fill="white" />
      {/* Smile */}
      <path d="M 55 48 Q 65 56 75 48" stroke="#92400e" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      {/* Cheeks */}
      <circle cx="46" cy="46" r="6" fill="#f87171" opacity="0.5" />
      <circle cx="84" cy="46" r="6" fill="#f87171" opacity="0.5" />
      {/* Neck */}
      <rect x="58" y="66" width="14" height="10" fill="#fde68a" />
      {/* White coat body */}
      <path d="M 25 78 L 30 68 L 58 72 L 65 76 L 72 72 L 100 68 L 105 78 L 108 130 L 22 130 Z" fill="white" stroke="#e2e8f0" strokeWidth="1.5" />
      {/* Coat lapels */}
      <path d="M 58 72 L 52 90 L 65 88 L 78 90 L 72 72 L 65 76 Z" fill="#f1f5f9" stroke="#e2e8f0" strokeWidth="1" />
      {/* Under-shirt (colorful) */}
      <rect x="55" y="78" width="20" height="12" rx="2" fill={color} opacity="0.9" />
      {/* Stethoscope */}
      <path d="M 48 82 Q 40 95 45 108 Q 50 118 58 118 Q 68 118 70 108 Q 72 98 80 90 L 85 84" stroke="#94a3b8" strokeWidth="3" fill="none" strokeLinecap="round" />
      <circle cx="85" cy="82" r="5" fill="#64748b" stroke="#475569" strokeWidth="1.5" />
      <circle cx="46" cy="80" r="4" fill="#94a3b8" />
      <circle cx="49" cy="78" r="3.5" fill="#94a3b8" />
      {/* Pocket */}
      <rect x="78" y="92" width="18" height="14" rx="2" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
      {/* Pen in pocket */}
      <rect x="82" y="88" width="3" height="14" rx="1" fill={color} />
      <rect x="87" y="88" width="3" height="12" rx="1" fill="#ef4444" />
      {/* Legs */}
      <rect x="38" y="128" width="22" height="26" rx="4" fill="#1e40af" />
      <rect x="70" y="128" width="22" height="26" rx="4" fill="#1e40af" />
      {/* Shoes */}
      <ellipse cx="49" cy="154" rx="14" ry="6" fill="#1c1917" />
      <ellipse cx="81" cy="154" rx="14" ry="6" fill="#1c1917" />
      {/* Arms */}
      <path d="M 30 78 L 18 108 L 26 112 L 36 88" fill="white" stroke="#e2e8f0" strokeWidth="1.5" />
      <path d="M 100 78 L 112 108 L 104 112 L 94 88" fill="white" stroke="#e2e8f0" strokeWidth="1.5" />
      {/* Hands */}
      <circle cx="22" cy="114" r="7" fill="#fde68a" />
      <circle cx="108" cy="114" r="7" fill="#fde68a" />
      {/* Level badge */}
      <rect x="46" y="14" width="38" height="18" rx="9" fill={color} />
      <text x="65" y="27" textAnchor="middle" fontSize="11" fontWeight="bold" fill="white" fontFamily="Arial">{label}</text>
    </svg>
  )
}

export function FlyingMoney() {
  return (
    <div className="relative" style={{ width: 320, height: 160 }}>
      {/* Background coins floating */}
      <div className="absolute anim-float" style={{ top: 10, left: 10, animationDelay: '0s' }}>
        <GoldCoin size={32} />
      </div>
      <div className="absolute anim-float" style={{ top: 5, right: 20, animationDelay: '0.7s' }}>
        <GoldCoin size={24} />
      </div>
      <div className="absolute anim-float" style={{ top: 60, left: 5, animationDelay: '1.2s' }}>
        <GoldCoin size={20} />
      </div>
      {/* Bills floating */}
      <div className="absolute anim-float" style={{ top: 0, left: 60, animationDelay: '0.3s', transform: 'rotate(-8deg)' }}>
        <MoneyBill size={85} />
      </div>
      <div className="absolute anim-float" style={{ top: 20, right: 50, animationDelay: '0.9s', transform: 'rotate(6deg)' }}>
        <MoneyBill size={75} />
      </div>
      <div className="absolute anim-float" style={{ top: 80, left: 80, animationDelay: '0.5s', transform: 'rotate(-3deg)' }}>
        <MoneyBill size={90} />
      </div>
      {/* ₩ floating text */}
      <div className="absolute text-green-400 text-2xl font-black anim-float" style={{ top: 30, left: 30, animationDelay: '1.5s', opacity: 0.7 }}>₩</div>
      <div className="absolute text-yellow-400 text-xl font-black anim-float" style={{ top: 70, right: 30, animationDelay: '0.2s', opacity: 0.7 }}>💰</div>
    </div>
  )
}
