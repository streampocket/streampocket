'use client'

import { cn } from '@/lib/utils'
import type { GcoinProductTabCategory, GcoinProductTabStatus } from '../_types'

type StatusTab = {
  value: GcoinProductTabStatus
  label: string
}

const STATUS_TABS: StatusTab[] = [
  { value: 'all', label: '전체' },
  { value: 'on_sale', label: '판매중' },
  { value: 'hidden', label: '숨김' },
  { value: 'sold_out', label: '품절' },
]

type CategoryTab = {
  value: GcoinProductTabCategory
  label: string
}

const CATEGORY_TABS: CategoryTab[] = [
  { value: 'all', label: '전체 카테고리' },
  { value: 'gcoin', label: '지코인' },
  { value: 'item', label: '아이템' },
]

type ProductFilterBarProps = {
  activeTab: GcoinProductTabStatus
  onTabChange: (tab: GcoinProductTabStatus) => void
  activeCategory: GcoinProductTabCategory
  onCategoryChange: (category: GcoinProductTabCategory) => void
  search: string
  onSearchChange: (value: string) => void
}

export function ProductFilterBar({
  activeTab,
  onTabChange,
  activeCategory,
  onCategoryChange,
  search,
  onSearchChange,
}: ProductFilterBarProps) {
  return (
    <div className="space-y-3">
      <div className="flex gap-1 overflow-x-auto">
        {STATUS_TABS.map((tab) => (
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

      <div className="flex gap-1 overflow-x-auto">
        {CATEGORY_TABS.map((tab) => (
          <button
            key={tab.value}
            type="button"
            onClick={() => onCategoryChange(tab.value)}
            className={cn(
              'text-caption-md shrink-0 rounded-full px-3.5 py-1.5 font-medium transition-colors',
              activeCategory === tab.value
                ? 'bg-gray-800 text-white'
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
