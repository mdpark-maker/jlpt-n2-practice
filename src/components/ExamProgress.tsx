type Props = {
  current: number
  total: number
  answered: number
}

export default function ExamProgress({ current, total, answered }: Props) {
  const pct = Math.round((answered / total) * 100)
  return (
    <div className="mb-6">
      <div className="flex justify-between text-sm text-gray-600 mb-1.5">
        <span>{current + 1} / {total} 問</span>
        <span>{answered} 問回答済み ({pct}%)</span>
      </div>
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-indigo-500 rounded-full transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
