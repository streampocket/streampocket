'use client'

import { cn } from '@/lib/utils'
import type { GcoinOrderStatusCounts, GcoinOrderTabStatus } from '../_types'

type Tab = {
  value: GcoinOrderTabStatus
  label: string
}

const TABS: Tab[] = [
  { value: 'pending', label: '대기' },
  { value: 'approved', label: '승인' },
  { value: 'rejected', label: '거절' },
  { value: 'all', label: '전체' },
]

type OrderFilterBarProps = {
  activeTab: GcoinOrderTabStatus
  onTabChange: (tab: GcoinOrderTabStatus) => void
  counts: GcoinOrderStatusCounts | undefined
  search: string
  onSearchChange: (value: string) => void
}

export function OrderFilterBar({
  activeTab,
  onTabChange,
  counts,
  search,
  onSearchChange,
}: OrderFilterBarProps) {
  const countFor = (tab: GcoinOrderTabStatus): number | null => {
    if (!counts) return null
    if (tab === 'all') return counts.pending + counts.approved + counts.rejected
    return counts[tab]
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-1 overflow-x-auto">
        {TABS.map((tab) => {
          const count = countFor(tab.value)
          return (
            <button
              key={tab.value}
              type="button"
              onClick={() => onTabChange(tab.value)}
              className={cn(
                'text-body-md shrink-0 rounded-lg px-4 py-2 font-medium transition-colors',
                activeTab === tab.value
                  ? 'bg-brand text-white'
                  : 'bg-gray-100 text-text-secondary hover:bg-gray-200',
              )}
            >
              {tab.label}
              {count !== null && <span className="ml-1 text-caption-md">({count})</span>}
            </button>
          )
        })}
      </div>

      <input
        type="text"
        placeholder="주문번호·상품명·전화번호 검색..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        className="text-body-md w-full rounded-lg border border-border bg-card-bg px-4 py-2 text-text-primary placeholder:text-text-muted focus:border-brand focus:outline-none md:max-w-xs"
      />
    </div>
  )
}
