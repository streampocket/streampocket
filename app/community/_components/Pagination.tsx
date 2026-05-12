import Link from 'next/link'
import { cn } from '@/lib/utils'

type Props = {
  page: number
  pageSize: number
  total: number
  basePath: string
  searchParams?: Record<string, string | undefined>
}

function buildHref(basePath: string, params: Record<string, string | undefined>): string {
  const sp = new URLSearchParams()
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== '') sp.set(k, v)
  }
  const qs = sp.toString()
  return qs ? `${basePath}?${qs}` : basePath
}

export function Pagination({ page, pageSize, total, basePath, searchParams = {} }: Props) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  if (totalPages <= 1) return null

  const start = Math.max(1, page - 2)
  const end = Math.min(totalPages, start + 4)
  const pages: number[] = []
  for (let p = start; p <= end; p += 1) pages.push(p)

  return (
    <nav aria-label="페이지" className="flex items-center justify-center gap-1 py-6">
      {page > 1 ? (
        <Link
          href={buildHref(basePath, { ...searchParams, page: String(page - 1) })}
          className="rounded-md border border-border px-3 py-1.5 text-caption-md hover:bg-gray-50"
          rel="prev"
        >
          이전
        </Link>
      ) : null}
      {pages.map((p) => (
        <Link
          key={p}
          href={buildHref(basePath, { ...searchParams, page: String(p) })}
          aria-current={p === page ? 'page' : undefined}
          className={cn(
            'min-w-9 rounded-md border px-3 py-1.5 text-center text-caption-md',
            p === page
              ? 'border-brand bg-brand text-white'
              : 'border-border bg-white hover:bg-gray-50',
          )}
        >
          {p}
        </Link>
      ))}
      {page < totalPages ? (
        <Link
          href={buildHref(basePath, { ...searchParams, page: String(page + 1) })}
          className="rounded-md border border-border px-3 py-1.5 text-caption-md hover:bg-gray-50"
          rel="next"
        >
          다음
        </Link>
      ) : null}
    </nav>
  )
}
