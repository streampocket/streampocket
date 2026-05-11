'use client'

type AdminReviewFilterBarProps = {
  search: string
  onSearchChange: (value: string) => void
  rating: number | undefined
  onRatingChange: (value: number | undefined) => void
}

export function AdminReviewFilterBar({
  search,
  onSearchChange,
  rating,
  onRatingChange,
}: AdminReviewFilterBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <input
        type="text"
        placeholder="본문/작성자/상품 검색..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        className="text-body-md w-full rounded-lg border border-border bg-card-bg px-4 py-2 text-text-primary placeholder:text-text-muted focus:border-brand focus:outline-none md:max-w-xs"
      />
      <select
        value={rating ?? ''}
        onChange={(e) => onRatingChange(e.target.value === '' ? undefined : Number(e.target.value))}
        className="text-body-md h-10 rounded-lg border border-border bg-card-bg px-3 text-text-primary focus:border-brand focus:outline-none"
      >
        <option value="">전체 별점</option>
        {[5, 4, 3, 2, 1].map((n) => (
          <option key={n} value={n}>
            {n}점
          </option>
        ))}
      </select>
    </div>
  )
}
