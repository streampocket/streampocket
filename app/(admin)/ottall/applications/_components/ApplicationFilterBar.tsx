'use client'

import { cn } from '@/lib/utils'
import type { ApplicationTabStatus } from '../_types'

type Tab = {
  value: ApplicationTabStatus
  label: string
}

const TABS: Tab[] = [
  { value: 'all', label: '전체' },
  { value: 'pending', label: '대기' },
  { value: 'confirmed', label: '확정' },
  { value: 'cancelled', label: '거절' },
  { value: 'expired', label: '만료' },
]

type ApplicationFilterBarProps = {
  activeTab: ApplicationTabStatus
  onTabChange: (tab: ApplicationTabStatus) => void
  search: string
  onSearchChange: (value: string) => void
}

export function ApplicationFilterBar({
  activeTab,
  onTabChange,
  search,
  onSearchChange,
}: ApplicationFilterBarProps) {
  return (
    <div className="space-y-3">
      <div className="flex gap-1 overflow-x-auto">
        {TABS.map((tab) => (
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
          </button>
        ))}
      </div>

      <input
        type="text"
        placeholder="신청자명/연락처 또는 파티명 검색..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        className="text-body-md w-full rounded-lg border border-border bg-card-bg px-4 py-2 text-text-primary placeholder:text-text-muted focus:border-brand focus:outline-none md:max-w-xs"
      />
    </div>
  )
}
