// Shared Pokemon-themed UI primitives

export function Pokeball({ size = 24, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className={className} aria-hidden>
      <circle cx="50" cy="50" r="46" fill="white" stroke="#374151" strokeWidth="4" />
      <path d="M 4 50 A 46 46 0 0 1 96 50 Z" fill="#DC2626" />
      <rect x="4" y="47" width="92" height="6" fill="#374151" />
      <circle cx="50" cy="50" r="13" fill="white" stroke="#374151" strokeWidth="4" />
      <circle cx="50" cy="50" r="6" fill="#f3f4f6" />
    </svg>
  )
}

export function HpBar({ pct }: { pct: number }) {
  const color = pct >= 70 ? '#22c55e' : pct >= 40 ? '#f59e0b' : '#ef4444'
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-black text-gray-400 w-5">HP</span>
      <div className="hp-bar flex-1">
        <div className="hp-bar-fill" style={{ width: `${pct}%`, background: color }} />
      </div>
      <span className="text-xs font-bold tabular-nums" style={{ color }}>{pct}%</span>
    </div>
  )
}

// Simple Pikachu mascot (SVG, no copyrighted assets)
export function PikachuMascot({ size = 120 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" aria-label="Pikachu">
      {/* Ears */}
      <polygon points="22,45 10,8 42,28" fill="#FBBF24" />
      <polygon points="24,43 14,14 40,30" fill="#1c1917" />
      <polygon points="98,45 110,8 78,28" fill="#FBBF24" />
      <polygon points="96,43 106,14 80,30" fill="#1c1917" />
      {/* Body/face */}
      <ellipse cx="60" cy="68" rx="42" ry="36" fill="#FBBF24" />
      <ellipse cx="60" cy="56" rx="36" ry="30" fill="#FDE68A" />
      {/* Eyes */}
      <circle cx="46" cy="52" r="7" fill="#1c1917" />
      <circle cx="74" cy="52" r="7" fill="#1c1917" />
      <circle cx="48" cy="50" r="2.5" fill="white" />
      <circle cx="76" cy="50" r="2.5" fill="white" />
      {/* Nose */}
      <ellipse cx="60" cy="60" rx="3" ry="2" fill="#92400e" />
      {/* Mouth */}
      <path d="M 50 65 Q 60 74 70 65" stroke="#92400e" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      {/* Cheeks */}
      <circle cx="36" cy="66" r="9" fill="#F87171" opacity="0.75" />
      <circle cx="84" cy="66" r="9" fill="#F87171" opacity="0.75" />
      {/* Tail hint */}
      <path d="M 100 75 L 114 62 L 118 72 L 108 82 Z" fill="#FBBF24" />
      {/* Lightning bolt on tail */}
      <path d="M 106 65 L 112 68 L 108 72 Z" fill="#1c1917" opacity="0.3" />
    </svg>
  )
}

export function PokeHeader({
  title,
  backHref,
  backLabel = '← 戻る',
  right,
}: {
  title: string
  backHref?: string
  backLabel?: string
  right?: React.ReactNode
}) {
  return (
    <header className="bg-red-600 text-white shadow sticky top-0 z-10">
      <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
        {backHref && (
          <a href={backHref} className="text-red-200 hover:text-white text-sm shrink-0">{backLabel}</a>
        )}
        <div className="flex items-center gap-2 flex-1">
          <Pokeball size={20} />
          <h1 className="text-sm font-black tracking-wide">{title}</h1>
        </div>
        {right}
      </div>
    </header>
  )
}
