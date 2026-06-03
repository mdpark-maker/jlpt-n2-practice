// Hello Kitty-themed UI primitives

export function KittyBow({ size = 24, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 60 40" className={className} aria-hidden>
      {/* Left wing */}
      <ellipse cx="16" cy="20" rx="14" ry="9" fill="#FF6B9D" />
      <ellipse cx="16" cy="20" rx="9" ry="5" fill="#FFB3D1" opacity="0.7" />
      {/* Right wing */}
      <ellipse cx="44" cy="20" rx="14" ry="9" fill="#FF6B9D" />
      <ellipse cx="44" cy="20" rx="9" ry="5" fill="#FFB3D1" opacity="0.7" />
      {/* Center knot */}
      <ellipse cx="30" cy="20" rx="6" ry="6" fill="#FF3D7F" />
      <ellipse cx="30" cy="20" rx="3" ry="3" fill="#FF6B9D" />
    </svg>
  )
}

export function KittyMascot({ size = 120 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" aria-label="Hello Kitty">
      {/* Ears */}
      <polygon points="22,48 15,18 45,35" fill="white" stroke="#FFB3D1" strokeWidth="2" />
      <polygon points="98,48 105,18 75,35" fill="white" stroke="#FFB3D1" strokeWidth="2" />
      {/* Ear inner */}
      <polygon points="25,46 20,25 42,37" fill="#FFB3D1" />
      <polygon points="95,46 100,25 78,37" fill="#FFB3D1" />
      {/* Head */}
      <ellipse cx="60" cy="68" rx="44" ry="40" fill="white" stroke="#FFB3D1" strokeWidth="2.5" />
      {/* Eyes */}
      <ellipse cx="45" cy="58" rx="6" ry="7" fill="#1c1917" />
      <ellipse cx="75" cy="58" rx="6" ry="7" fill="#1c1917" />
      <circle cx="47" cy="56" r="2" fill="white" />
      <circle cx="77" cy="56" r="2" fill="white" />
      {/* Nose */}
      <ellipse cx="60" cy="68" rx="4" ry="3" fill="#FF6B9D" />
      {/* Whiskers left */}
      <line x1="10" y1="62" x2="50" y2="65" stroke="#ccc" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="10" y1="68" x2="50" y2="68" stroke="#ccc" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="10" y1="74" x2="50" y2="71" stroke="#ccc" strokeWidth="1.5" strokeLinecap="round" />
      {/* Whiskers right */}
      <line x1="110" y1="62" x2="70" y2="65" stroke="#ccc" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="110" y1="68" x2="70" y2="68" stroke="#ccc" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="110" y1="74" x2="70" y2="71" stroke="#ccc" strokeWidth="1.5" strokeLinecap="round" />
      {/* Bow on ear */}
      <ellipse cx="82" cy="34" rx="9" ry="6" fill="#FF3D7F" />
      <ellipse cx="98" cy="34" rx="9" ry="6" fill="#FF3D7F" />
      <ellipse cx="90" cy="34" rx="4" ry="4" fill="#FF6B9D" />
      {/* Body suggestion */}
      <ellipse cx="60" cy="105" rx="28" ry="12" fill="#FFE4F0" stroke="#FFB3D1" strokeWidth="2" />
    </svg>
  )
}

export function KittyHeader({
  title,
  backHref,
  backLabel = '← 뒤로',
  right,
}: {
  title: string
  backHref?: string
  backLabel?: string
  right?: React.ReactNode
}) {
  return (
    <header className="bg-pink-500 text-white shadow sticky top-0 z-10">
      <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
        {backHref && (
          <a href={backHref} className="text-pink-200 hover:text-white text-sm shrink-0">{backLabel}</a>
        )}
        <div className="flex items-center gap-2 flex-1">
          <KittyBow size={22} />
          <h1 className="text-sm font-black tracking-wide">{title}</h1>
        </div>
        {right}
      </div>
    </header>
  )
}

export function KittyScoreBar({ pct }: { pct: number }) {
  const color = pct >= 70 ? '#22c55e' : pct >= 40 ? '#f59e0b' : '#ef4444'
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-black text-gray-400 w-5">♡</span>
      <div className="flex-1 bg-pink-100 rounded-full h-3 overflow-hidden">
        <div className="h-3 rounded-full transition-all" style={{ width: `${pct}%`, background: color }} />
      </div>
      <span className="text-xs font-bold tabular-nums" style={{ color }}>{pct}%</span>
    </div>
  )
}
