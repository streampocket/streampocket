'use client'

import { cn } from '@/lib/utils'
import type { PartyTabStatus } from '../_types'

type Tab = {
  value: PartyTabStatus
  label: string
}

const TABS: Tab[] = [
  { value: 'all', label: '전체' },
  { value: 'recruiting', label: '모집중' },
  { value: 'closed', label: '모집완료' },
  { value: 'expired', label: '만료' },
]

type PartyFilterBarProps = {
  activeTab: PartyTabStatus
  onTabChange: (tab: PartyTabStatus) => void
  search: string
  onSearchChange: (value: string) => void
}

export function PartyFilterBar({
  activeTab,
  onTabChange,
  search,
  onSearchChange,
}: PartyFilterBarProps) {
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
        placeholder="파티명 또는 파티장명 검색..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        className="text-body-md w-full rounded-lg border border-border bg-card-bg px-4 py-2 text-text-primary placeholder:text-text-muted focus:border-brand focus:outline-none md:max-w-xs"
      />
    </div>
  )
}
