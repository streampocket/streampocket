'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { PAGE_SIZE } from '@/constants/app'
import type { FulfillmentStatus } from '@/types/domain'
import { useOrders } from '../_hooks/useOrders'
import type { OrderStatusCounts } from '../_types'

const STATUS_OPTIONS: {
  value: FulfillmentStatus | ''
  label: string
  countKey: keyof OrderStatusCounts
}[] = [
  { value: '', label: '전체', countKey: 'total' },
  { value: 'pending', label: '대기', countKey: 'pending' },
  { value: 'in_progress', label: '진행중', countKey: 'in_progress' },
  { value: 'completed', label: '완료', countKey: 'completed' },
  { value: 'purchase_decided', label: '구매확정', countKey: 'purchase_decided' },
  { value: 'manual_review', label: '수동처리', countKey: 'manual_review' },
  { value: 'failed', label: '실패', countKey: 'failed' },
  { value: 'returned', label: '반품', countKey: 'returned' },
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
  const currentReceiverName = searchParams.get('receiverName') ?? ''
  const currentPage = Number(searchParams.get('page') ?? 1)
  const [nameInput, setNameInput] = useState(currentReceiverName)

  const { data } = useOrders({
    status: (currentStatus as FulfillmentStatus) || undefined,
    from: currentFrom || undefined,
    to: currentTo || undefined,
    receiverName: currentReceiverName || undefined,
    page: currentPage,
    pageSize: PAGE_SIZE,
  })
  const counts = data?.counts

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
            {opt.label}{counts ? ` (${counts[opt.countKey]})` : ''}
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

      <div className="flex items-center gap-2">
        <input
          type="text"
          value={nameInput}
          onChange={(e) => setNameInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              updateParams({ receiverName: nameInput.trim() })
            }
          }}
          placeholder="수신자명 검색"
          className="text-body-md rounded-lg border border-border px-3 py-1.5 text-text-primary outline-none focus:border-brand"
        />
      </div>

      {(currentStatus || currentFrom || currentTo || currentReceiverName) && (
        <Button
          variant="secondary"
          size="sm"
          onClick={() => {
            setNameInput('')
            handleReset()
          }}
        >
          초기화
        </Button>
      )}
    </div>
  )
}
