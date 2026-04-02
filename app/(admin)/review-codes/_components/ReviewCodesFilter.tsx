'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'
import { Button } from '@/components/ui/Button'
import type { ReviewCodeStatus } from '@/types/domain'

const STATUS_OPTIONS: { value: ReviewCodeStatus | ''; label: string }[] = [
  { value: '', label: '전체' },
  { value: 'unused', label: '미사용' },
  { value: 'used', label: '사용' },
]

const DATE_ORDER_OPTIONS: { value: 'desc' | 'asc'; label: string }[] = [
  { value: 'desc', label: '최신순' },
  { value: 'asc', label: '오래된순' },
]

export function ReviewCodesFilter() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const currentStatus = searchParams.get('status') ?? ''
  const currentDateOrder = (searchParams.get('dateOrder') as 'desc' | 'asc') ?? 'desc'
  const currentGameName = searchParams.get('gameName') ?? ''

  const updateParams = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString())
      Object.entries(updates).forEach(([key, value]) => {
        if (value) {
          params.set(key, value)
        } else {
          params.delete(key)
        }
      })
      params.delete('page')
      router.push(`${pathname}?${params.toString()}`)
    },
    [router, pathname, searchParams],
  )

  const hasFilter = Boolean(currentStatus || currentGameName || currentDateOrder !== 'desc')

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-xl border border-border bg-card-bg p-4">
      <div className="flex items-center gap-1.5">
        {STATUS_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => updateParams({ status: opt.value })}
            className={`text-caption-md rounded-lg px-3 py-1.5 font-semibold transition-colors ${
              currentStatus === opt.value
                ? 'bg-brand text-white'
                : 'bg-gray-100 text-text-secondary hover:bg-gray-200'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-1.5">
        {DATE_ORDER_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => updateParams({ dateOrder: opt.value })}
            className={`text-caption-md rounded-lg px-3 py-1.5 font-semibold transition-colors ${
              currentDateOrder === opt.value
                ? 'bg-brand text-white'
                : 'bg-gray-100 text-text-secondary hover:bg-gray-200'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <input
        type="text"
        placeholder="게임명 검색"
        value={currentGameName}
        onChange={(e) => updateParams({ gameName: e.target.value })}
        className="text-body-md rounded-lg border border-border px-3 py-1.5 text-text-primary outline-none focus:border-brand"
      />

      {hasFilter && (
        <Button variant="secondary" size="sm" onClick={() => router.push(pathname)}>
          초기화
        </Button>
      )}
    </div>
  )
}
