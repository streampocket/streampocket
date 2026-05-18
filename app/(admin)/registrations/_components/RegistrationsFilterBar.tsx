'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'

const STATUS_OPTIONS: { value: string; label: string }[] = [
  { value: '', label: '전체' },
  { value: 'received', label: '접수됨' },
  { value: 'needs_info', label: '정보 부족' },
  { value: 'completed', label: '완료' },
]

const MATCH_OPTIONS: { value: string; label: string }[] = [
  { value: '', label: '전체' },
  { value: 'unmatched', label: '미연결' },
  { value: 'auto_matched', label: '자동매칭' },
  { value: 'manual_matched', label: '수동연결' },
]

export function RegistrationsFilterBar() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const currentStatus = searchParams.get('status') ?? ''
  const currentMatch = searchParams.get('matchStatus') ?? ''

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
      router.push(`${pathname}?${params.toString()}`)
    },
    [router, pathname, searchParams],
  )

  return (
    <div className="flex flex-wrap items-center gap-4 rounded-xl border border-border bg-card-bg p-4">
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="text-caption-md mr-1 text-text-muted">상태</span>
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

      <div className="flex flex-wrap items-center gap-1.5">
        <span className="text-caption-md mr-1 text-text-muted">매칭</span>
        {MATCH_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => updateParams({ matchStatus: opt.value })}
            className={`text-caption-md rounded-lg px-3 py-1.5 font-semibold transition-colors ${
              currentMatch === opt.value
                ? 'bg-brand text-white'
                : 'bg-gray-100 text-text-secondary hover:bg-gray-200'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  )
}
