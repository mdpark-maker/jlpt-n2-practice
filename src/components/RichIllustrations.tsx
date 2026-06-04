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
      <rect x="2" y="2" width="136" height="73" rx="8" fill="#4ade80" stroke="#16a34a" strokeWidth="2.5" />
      <rect x="8" y="8" width="124" height="61" rx="5" fill="none" stroke="#16a34a" strokeWidth="1.5" strokeDasharray="4 2" />
      <ellipse cx="70" cy="38" rx="22" ry="18" fill="#bbf7d0" stroke="#16a34a" strokeWidth="1.5" />
      <text x="70" y="44" textAnchor="middle" fontSize="20" fontWeight="bold" fill="#15803d" fontFamily="Arial">₩</text>
      <text x="18" y="24" fontSize="10" fontWeight="bold" fill="#15803d" fontFamily="Arial">10,000</text>
      <text x="122" y="62" fontSize="10" fontWeight="bold" fill="#15803d" fontFamily="Arial" textAnchor="end">10,000</text>
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
      <div className="absolute" style={{ bottom: 30, left: 0, transform: 'rotate(-12deg)', opacity: 0.85 }}>
        <MoneyBill size={110} />
      </div>
      <div className="absolute" style={{ bottom: 35, left: 10, transform: 'rotate(-5deg)', opacity: 0.92 }}>
        <MoneyBill size={110} />
      </div>
      <div className="absolute" style={{ bottom: 40, left: 20, transform: 'rotate(3deg)' }}>
        <MoneyBill size={110} />
      </div>
      <div className="absolute" style={{ bottom: 0, right: 0 }}>
        <GoldCoin size={38} />
      </div>
      <div className="absolute" style={{ bottom: 20, right: 30 }}>
        <GoldCoin size={28} />
      </div>
    </div>
  )
}

export function FlyingMoney() {
  return (
    <div className="relative" style={{ width: 320, height: 100 }}>
      <div className="absolute anim-float" style={{ top: 0, left: 10, animationDelay: '0s' }}>
        <GoldCoin size={28} />
      </div>
      <div className="absolute anim-float" style={{ top: 5, right: 20, animationDelay: '0.7s' }}>
        <GoldCoin size={22} />
      </div>
      <div className="absolute anim-float" style={{ top: 0, left: 60, animationDelay: '0.3s', transform: 'rotate(-8deg)' }}>
        <MoneyBill size={75} />
      </div>
      <div className="absolute anim-float" style={{ top: 15, right: 50, animationDelay: '0.9s', transform: 'rotate(6deg)' }}>
        <MoneyBill size={65} />
      </div>
      <div className="absolute text-yellow-300 text-xl font-black anim-float" style={{ top: 50, right: 25, animationDelay: '0.2s', opacity: 0.8 }}>💰</div>
    </div>
  )
}

// ─── Doctor Characters ───────────────────────────────────────────────────────

/** Pikachu-inspired doctor (yellow, lightning ears, red cheeks) */
export function PikachuDoctor({ size = 130 }: { size?: number }) {
  return (
    <svg width={size} height={size * 1.25} viewBox="0 0 130 162" aria-label="Pikachu Doctor">
      {/* Lightning-bolt ears */}
      <polygon points="22,52 8,10 35,38" fill="#FBBF24" />
      <polygon points="22,50 12,18 33,36" fill="#1c1917" opacity="0.85" />
      <polygon points="108,52 122,10 95,38" fill="#FBBF24" />
      <polygon points="108,50 118,18 97,36" fill="#1c1917" opacity="0.85" />
      {/* Head */}
      <ellipse cx="65" cy="65" rx="38" ry="34" fill="#FDE68A" stroke="#F59E0B" strokeWidth="2" />
      {/* Eyes */}
      <circle cx="50" cy="58" r="7" fill="#1c1917" />
      <circle cx="80" cy="58" r="7" fill="#1c1917" />
      <circle cx="52" cy="56" r="2.5" fill="white" />
      <circle cx="82" cy="56" r="2.5" fill="white" />
      {/* Nose */}
      <ellipse cx="65" cy="68" rx="3" ry="2.5" fill="#92400e" />
      {/* Smile */}
      <path d="M 54 74 Q 65 83 76 74" stroke="#92400e" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      {/* Red cheeks */}
      <circle cx="38" cy="70" r="9" fill="#F87171" opacity="0.8" />
      <circle cx="92" cy="70" r="9" fill="#F87171" opacity="0.8" />
      {/* Neck */}
      <rect x="58" y="97" width="14" height="10" fill="#FDE68A" />
      {/* White coat */}
      <path d="M 22 108 L 28 96 L 58 102 L 65 106 L 72 102 L 102 96 L 108 108 L 110 155 L 20 155 Z" fill="white" stroke="#e2e8f0" strokeWidth="1.5" />
      <path d="M 58 102 L 52 120 L 65 118 L 78 120 L 72 102 L 65 106 Z" fill="#f1f5f9" stroke="#e2e8f0" strokeWidth="1" />
      {/* Yellow shirt under coat */}
      <rect x="56" y="106" width="18" height="14" rx="2" fill="#FDE68A" />
      {/* Stethoscope */}
      <path d="M 46 112 Q 38 126 43 138 Q 48 148 58 148 Q 68 148 70 138 Q 72 128 80 120 L 86 114" stroke="#94a3b8" strokeWidth="3" fill="none" strokeLinecap="round" />
      <circle cx="86" cy="112" r="5" fill="#64748b" stroke="#475569" strokeWidth="1.5" />
      <circle cx="45" cy="110" r="4" fill="#94a3b8" />
      {/* Pocket + pen */}
      <rect x="79" y="120" width="17" height="13" rx="2" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
      <rect x="83" y="116" width="3" height="13" rx="1" fill="#FBBF24" />
      <rect x="88" y="116" width="3" height="11" rx="1" fill="#ef4444" />
      {/* Arms */}
      <path d="M 28 108 L 16 136 L 24 140 L 34 116" fill="white" stroke="#e2e8f0" strokeWidth="1.5" />
      <path d="M 102 108 L 114 136 L 106 140 L 96 116" fill="white" stroke="#e2e8f0" strokeWidth="1.5" />
      <circle cx="20" cy="142" r="7" fill="#FDE68A" />
      <circle cx="110" cy="142" r="7" fill="#FDE68A" />
      {/* Legs */}
      <rect x="35" y="153" width="22" height="8" rx="3" fill="#1e40af" />
      <rect x="73" y="153" width="22" height="8" rx="3" fill="#1e40af" />
      {/* N2 badge */}
      <rect x="44" y="16" width="36" height="17" rx="8" fill="#dc2626" />
      <text x="62" y="28" textAnchor="middle" fontSize="10" fontWeight="bold" fill="white" fontFamily="Arial">N2</text>
    </svg>
  )
}

/** Jigglypuff-inspired doctor (pink, round, curly tuft) */
export function JigglypuffDoctor({ size = 130 }: { size?: number }) {
  return (
    <svg width={size} height={size * 1.25} viewBox="0 0 130 162" aria-label="Jigglypuff Doctor">
      {/* Ear nubbins */}
      <ellipse cx="32" cy="46" rx="10" ry="14" fill="#F9A8D4" stroke="#EC4899" strokeWidth="1.5" />
      <ellipse cx="98" cy="46" rx="10" ry="14" fill="#F9A8D4" stroke="#EC4899" strokeWidth="1.5" />
      <ellipse cx="32" cy="46" rx="5" ry="8" fill="#FBCFE8" />
      <ellipse cx="98" cy="46" rx="5" ry="8" fill="#FBCFE8" />
      {/* Hair curl */}
      <path d="M 58 28 Q 55 18 62 14 Q 70 10 68 20" stroke="#F9A8D4" strokeWidth="4" fill="none" strokeLinecap="round" />
      {/* Round pink head */}
      <circle cx="65" cy="62" r="38" fill="#FBCFE8" stroke="#F9A8D4" strokeWidth="2" />
      {/* Big blue eyes */}
      <ellipse cx="50" cy="58" rx="9" ry="10" fill="#60A5FA" stroke="#3B82F6" strokeWidth="1.5" />
      <ellipse cx="80" cy="58" rx="9" ry="10" fill="#60A5FA" stroke="#3B82F6" strokeWidth="1.5" />
      <ellipse cx="50" cy="56" rx="5" ry="6" fill="#1d4ed8" />
      <ellipse cx="80" cy="56" rx="5" ry="6" fill="#1d4ed8" />
      <circle cx="52" cy="53" r="2" fill="white" />
      <circle cx="82" cy="53" r="2" fill="white" />
      {/* Tiny mouth */}
      <ellipse cx="65" cy="70" rx="4" ry="3" fill="#F472B6" />
      {/* Neck */}
      <rect x="58" y="98" width="14" height="10" fill="#FBCFE8" />
      {/* White coat */}
      <path d="M 20 110 L 26 98 L 58 104 L 65 108 L 72 104 L 104 98 L 110 110 L 112 155 L 18 155 Z" fill="white" stroke="#e2e8f0" strokeWidth="1.5" />
      <path d="M 58 104 L 52 122 L 65 120 L 78 122 L 72 104 L 65 108 Z" fill="#f1f5f9" stroke="#e2e8f0" strokeWidth="1" />
      {/* Pink shirt */}
      <rect x="56" y="108" width="18" height="14" rx="2" fill="#FBCFE8" />
      {/* Stethoscope */}
      <path d="M 44 114 Q 36 128 41 140 Q 46 150 56 150 Q 66 150 68 140 Q 70 130 78 122 L 84 116" stroke="#94a3b8" strokeWidth="3" fill="none" strokeLinecap="round" />
      <circle cx="84" cy="114" r="5" fill="#64748b" />
      <circle cx="43" cy="112" r="4" fill="#94a3b8" />
      {/* Pocket */}
      <rect x="78" y="122" width="17" height="13" rx="2" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
      <rect x="82" y="118" width="3" height="13" rx="1" fill="#F9A8D4" />
      <rect x="87" y="118" width="3" height="11" rx="1" fill="#ef4444" />
      {/* Arms */}
      <path d="M 26 110 L 14 138 L 22 142 L 32 118" fill="white" stroke="#e2e8f0" strokeWidth="1.5" />
      <path d="M 104 110 L 116 138 L 108 142 L 98 118" fill="white" stroke="#e2e8f0" strokeWidth="1.5" />
      <circle cx="18" cy="144" r="7" fill="#FBCFE8" />
      <circle cx="112" cy="144" r="7" fill="#FBCFE8" />
      {/* Legs */}
      <rect x="33" y="153" width="22" height="8" rx="3" fill="#7c3aed" />
      <rect x="75" y="153" width="22" height="8" rx="3" fill="#7c3aed" />
    </svg>
  )
}

/** Hello Kitty-inspired doctor (white cat, pink bow, no mouth) */
export function HelloKittyDoctor({ size = 130 }: { size?: number }) {
  return (
    <svg width={size} height={size * 1.25} viewBox="0 0 130 162" aria-label="Hello Kitty Doctor">
      {/* Cat ears */}
      <polygon points="28,54 18,22 50,42" fill="white" stroke="#F9A8D4" strokeWidth="2" />
      <polygon points="102,54 112,22 80,42" fill="white" stroke="#F9A8D4" strokeWidth="2" />
      <polygon points="30,52 22,28 48,42" fill="#FBCFE8" />
      <polygon points="100,52 108,28 82,42" fill="#FBCFE8" />
      {/* Bow on right ear */}
      <ellipse cx="88" cy="28" rx="10" ry="7" fill="#FF3D7F" />
      <ellipse cx="108" cy="28" rx="10" ry="7" fill="#FF3D7F" />
      <ellipse cx="98" cy="28" rx="5" ry="5" fill="#FF6B9D" />
      {/* Head */}
      <ellipse cx="65" cy="66" rx="40" ry="38" fill="white" stroke="#F9A8D4" strokeWidth="2.5" />
      {/* Eyes (dots) */}
      <ellipse cx="50" cy="60" rx="5" ry="6" fill="#1c1917" />
      <ellipse cx="80" cy="60" rx="5" ry="6" fill="#1c1917" />
      <circle cx="52" cy="58" r="2" fill="white" />
      <circle cx="82" cy="58" r="2" fill="white" />
      {/* Nose */}
      <ellipse cx="65" cy="70" rx="4" ry="3" fill="#FF6B9D" />
      {/* Whiskers */}
      <line x1="15" y1="64" x2="55" y2="67" stroke="#ddd" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="15" y1="70" x2="55" y2="70" stroke="#ddd" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="75" y1="67" x2="115" y2="64" stroke="#ddd" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="75" y1="70" x2="115" y2="70" stroke="#ddd" strokeWidth="1.5" strokeLinecap="round" />
      {/* Neck */}
      <rect x="58" y="102" width="14" height="10" fill="white" />
      {/* White coat */}
      <path d="M 20 112 L 26 100 L 58 106 L 65 110 L 72 106 L 104 100 L 110 112 L 112 155 L 18 155 Z" fill="white" stroke="#F9A8D4" strokeWidth="2" />
      <path d="M 58 106 L 52 124 L 65 122 L 78 124 L 72 106 L 65 110 Z" fill="#FFF0F5" stroke="#F9A8D4" strokeWidth="1" />
      {/* Pink shirt */}
      <rect x="56" y="110" width="18" height="14" rx="2" fill="#FBCFE8" />
      {/* Stethoscope */}
      <path d="M 44 116 Q 36 130 41 142 Q 46 152 56 152 Q 66 152 68 142 Q 70 132 78 124 L 84 118" stroke="#94a3b8" strokeWidth="3" fill="none" strokeLinecap="round" />
      <circle cx="84" cy="116" r="5" fill="#64748b" />
      <circle cx="43" cy="114" r="4" fill="#94a3b8" />
      {/* Pocket */}
      <rect x="78" y="124" width="17" height="13" rx="2" fill="white" stroke="#F9A8D4" strokeWidth="1" />
      <rect x="82" y="120" width="3" height="13" rx="1" fill="#FF3D7F" />
      <rect x="87" y="120" width="3" height="11" rx="1" fill="#ef4444" />
      {/* Arms */}
      <path d="M 26 112 L 14 140 L 22 144 L 32 120" fill="white" stroke="#F9A8D4" strokeWidth="2" />
      <path d="M 104 112 L 116 140 L 108 144 L 98 120" fill="white" stroke="#F9A8D4" strokeWidth="2" />
      <circle cx="18" cy="146" r="7" fill="white" stroke="#F9A8D4" strokeWidth="1.5" />
      <circle cx="112" cy="146" r="7" fill="white" stroke="#F9A8D4" strokeWidth="1.5" />
      {/* Legs */}
      <rect x="33" y="153" width="22" height="8" rx="3" fill="#ec4899" />
      <rect x="75" y="153" width="22" height="8" rx="3" fill="#ec4899" />
      {/* N3 badge */}
      <rect x="44" y="20" width="36" height="17" rx="8" fill="#ec4899" />
      <text x="62" y="32" textAnchor="middle" fontSize="10" fontWeight="bold" fill="white" fontFamily="Arial">N3</text>
    </svg>
  )
}

/** Kuromi-inspired doctor (black bunny, skull motif, white coat) */
export function KuromiDoctor({ size = 130 }: { size?: number }) {
  return (
    <svg width={size} height={size * 1.25} viewBox="0 0 130 162" aria-label="Kuromi Doctor">
      {/* Long bunny ears */}
      <ellipse cx="42" cy="34" rx="12" ry="26" fill="#1c1917" />
      <ellipse cx="88" cy="34" rx="12" ry="26" fill="#1c1917" />
      <ellipse cx="42" cy="34" rx="6" ry="18" fill="#7c3aed" opacity="0.6" />
      <ellipse cx="88" cy="34" rx="6" ry="18" fill="#7c3aed" opacity="0.6" />
      {/* Head */}
      <circle cx="65" cy="70" r="38" fill="white" stroke="#1c1917" strokeWidth="3" />
      {/* Black hood/cap on head */}
      <path d="M 27 62 Q 30 32 65 30 Q 100 32 103 62 Q 90 52 65 50 Q 40 52 27 62 Z" fill="#1c1917" />
      {/* Skull on forehead */}
      <circle cx="65" cy="50" r="9" fill="white" />
      <circle cx="61" cy="48" r="2.5" fill="#1c1917" />
      <circle cx="69" cy="48" r="2.5" fill="#1c1917" />
      <rect x="62" y="54" width="6" height="4" rx="1" fill="white" />
      <line x1="63" y1="54" x2="63" y2="58" stroke="#1c1917" strokeWidth="1" />
      <line x1="65" y1="54" x2="65" y2="58" stroke="#1c1917" strokeWidth="1" />
      <line x1="67" y1="54" x2="67" y2="58" stroke="#1c1917" strokeWidth="1" />
      {/* Mischievous eyes */}
      <ellipse cx="50" cy="64" rx="7" ry="7" fill="#7c3aed" stroke="#1c1917" strokeWidth="1.5" />
      <ellipse cx="80" cy="64" rx="7" ry="7" fill="#7c3aed" stroke="#1c1917" strokeWidth="1.5" />
      <circle cx="52" cy="62" r="2.5" fill="white" />
      <circle cx="82" cy="62" r="2.5" fill="white" />
      {/* Small smile */}
      <path d="M 55 74 Q 65 80 75 74" stroke="#7c3aed" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      {/* Tiny nose */}
      <ellipse cx="65" cy="71" rx="3" ry="2" fill="#fda4af" />
      {/* Neck */}
      <rect x="58" y="106" width="14" height="10" fill="white" />
      {/* White coat */}
      <path d="M 20 116 L 26 104 L 58 110 L 65 114 L 72 110 L 104 104 L 110 116 L 112 155 L 18 155 Z" fill="white" stroke="#e2e8f0" strokeWidth="1.5" />
      <path d="M 58 110 L 52 128 L 65 126 L 78 128 L 72 110 L 65 114 Z" fill="#f5f3ff" stroke="#e2e8f0" strokeWidth="1" />
      {/* Purple shirt */}
      <rect x="56" y="114" width="18" height="14" rx="2" fill="#7c3aed" opacity="0.85" />
      {/* Stethoscope */}
      <path d="M 44 120 Q 36 134 41 146 Q 46 154 56 154 Q 66 154 68 144 Q 70 134 78 126 L 84 120" stroke="#94a3b8" strokeWidth="3" fill="none" strokeLinecap="round" />
      <circle cx="84" cy="118" r="5" fill="#64748b" />
      <circle cx="43" cy="118" r="4" fill="#94a3b8" />
      {/* Pocket */}
      <rect x="78" y="126" width="17" height="13" rx="2" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
      <rect x="82" y="122" width="3" height="13" rx="1" fill="#7c3aed" />
      <rect x="87" y="122" width="3" height="11" rx="1" fill="#ef4444" />
      {/* Arms */}
      <path d="M 26 116 L 14 144 L 22 148 L 32 124" fill="white" stroke="#e2e8f0" strokeWidth="1.5" />
      <path d="M 104 116 L 116 144 L 108 148 L 98 124" fill="white" stroke="#e2e8f0" strokeWidth="1.5" />
      <circle cx="18" cy="150" r="7" fill="white" stroke="#7c3aed" strokeWidth="1.5" />
      <circle cx="112" cy="150" r="7" fill="white" stroke="#7c3aed" strokeWidth="1.5" />
      {/* Legs */}
      <rect x="33" y="153" width="22" height="8" rx="3" fill="#1c1917" />
      <rect x="75" y="153" width="22" height="8" rx="3" fill="#1c1917" />
    </svg>
  )
}
