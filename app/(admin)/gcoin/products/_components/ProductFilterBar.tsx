'use client'

import { cn } from '@/lib/utils'
import type { GcoinProductTabStatus } from '../_types'

type Tab = {
  value: GcoinProductTabStatus
  label: string
}

const TABS: Tab[] = [
  { value: 'all', label: '전체' },
  { value: 'on_sale', label: '판매중' },
  { value: 'hidden', label: '숨김' },
  { value: 'sold_out', label: '품절' },
]

type ProductFilterBarProps = {
  activeTab: GcoinProductTabStatus
  onTabChange: (tab: GcoinProductTabStatus) => void
  search: string
  onSearchChange: (value: string) => void
}

export function ProductFilterBar({
  activeTab,
  onTabChange,
  search,
  onSearchChange,
}: ProductFilterBarProps) {
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
        placeholder="상품명 검색..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        className="text-body-md w-full rounded-lg border border-border bg-card-bg px-4 py-2 text-text-primary placeholder:text-text-muted focus:border-brand focus:outline-none md:max-w-xs"
      />
    </div>
  )
}
