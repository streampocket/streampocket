import Link from 'next/link'
import { cn } from '@/lib/utils'

type ReviewPaginationProps = {
  page: number
  totalPages: number
  buildHref: (nextPage: number) => string
}

export function ReviewPagination({ page, totalPages, buildHref }: ReviewPaginationProps) {
  if (totalPages <= 1) return null

  const pages: number[] = []
  const start = Math.max(1, page - 2)
  const end = Math.min(totalPages, start + 4)
  for (let i = start; i <= end; i += 1) pages.push(i)

  return (
    <nav className="flex justify-center gap-1.5" aria-label="페이지네이션">
      {page > 1 && (
        <Link href={buildHref(page - 1)} className={btn(false)} aria-label="이전 페이지">
          ‹
        </Link>
      )}
      {pages.map((p) => (
        <Link key={p} href={buildHref(p)} className={btn(p === page)} aria-current={p === page ? 'page' : undefined}>
          {p}
        </Link>
      ))}
      {page < totalPages && (
        <Link href={buildHref(page + 1)} className={btn(false)} aria-label="다음 페이지">
          ›
        </Link>
      )}
    </nav>
  )
}

function btn(active: boolean): string {
  return cn(
    'inline-flex h-9 min-w-9 items-center justify-center rounded-lg border px-3 text-caption-md font-semibold transition-colors',
    active
      ? 'border-brand bg-brand text-white'
      : 'border-border bg-white text-gray-700 hover:bg-gray-50',
  )
}
