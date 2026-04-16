'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useCallback, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import type { FulfillmentStatus } from '@/types/domain'

const STATUS_OPTIONS: { value: FulfillmentStatus | ''; label: string }[] = [
  { value: '', label: '전체' },
  { value: 'pending', label: '대기' },
  { value: 'completed', label: '완료' },
  { value: 'manual_review', label: '수동처리' },
  { value: 'failed', label: '실패' },
  { value: 'returned', label: '반품' },
]

function toStartOfDay(date: string): string {
  return `${date}T00:00:00+09:00`
}

function toEndOfDay(date: string): string {
  return `${date}T23:59:59+09:00`
}

function toDateInput(iso: string): string {
  return iso.slice(0, 10)
}

function getMonthRange(): { from: string; to: string } {
  const now = new Date()
  const koNow = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Seoul' }))
  const year = koNow.getFullYear()
  const month = koNow.getMonth()

  const firstDay = `${year}-${String(month + 1).padStart(2, '0')}-01`
  const lastDate = new Date(year, month + 1, 0).getDate()
  const lastDay = `${year}-${String(month + 1).padStart(2, '0')}-${String(lastDate).padStart(2, '0')}`

  return { from: firstDay, to: lastDay }
}

export function OrdersFilterBar() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const currentFrom = searchParams.get('from') ?? ''
  const currentTo = searchParams.get('to') ?? ''
  const currentStatus = searchParams.get('status') ?? ''

  useEffect(() => {
    if (!currentFrom && !currentTo) {
      const { from, to } = getMonthRange()
      const params = new URLSearchParams(searchParams.toString())
      params.set('from', toStartOfDay(from))
      params.set('to', toEndOfDay(to))
      router.replace(`${pathname}?${params.toString()}`)
    }
  }, [currentFrom, currentTo, pathname, router, searchParams])

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

  const handleReset = () => {
    router.push(pathname)
  }

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-xl border border-border bg-card-bg p-4">
      <div className="flex flex-wrap items-center gap-1.5">
        {STATUS_OPTIONS.map((opt) => (
          <button
            key={opt.value}
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

      <div className="flex flex-wrap items-center gap-2">
        <input
          type="date"
          value={currentFrom ? toDateInput(currentFrom) : ''}
          onChange={(e) =>
            updateParams({ from: e.target.value ? toStartOfDay(e.target.value) : '' })
          }
          className="text-body-md rounded-lg border border-border px-3 py-1.5 text-text-primary outline-none focus:border-brand"
        />
        <span className="text-caption-md text-text-muted">~</span>
        <input
          type="date"
          value={currentTo ? toDateInput(currentTo) : ''}
          onChange={(e) => updateParams({ to: e.target.value ? toEndOfDay(e.target.value) : '' })}
          className="text-body-md rounded-lg border border-border px-3 py-1.5 text-text-primary outline-none focus:border-brand"
        />
      </div>

      {(currentStatus || currentFrom || currentTo) && (
        <Button variant="secondary" size="sm" onClick={handleReset}>
          초기화
        </Button>
      )}
    </div>
  )
}
