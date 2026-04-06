'use client'

import { cn } from '@/lib/utils'
import type { PartnerTabStatus } from '../_types'

type Tab = {
  value: PartnerTabStatus
  label: string
}

const TABS: Tab[] = [
  { value: 'all', label: '전체' },
  { value: 'pending', label: '신청' },
  { value: 'approved', label: '승인됨' },
  { value: 'rejected', label: '거절' },
]

type PartnerStatusTabsProps = {
  activeTab: PartnerTabStatus
  onTabChange: (tab: PartnerTabStatus) => void
}

export function PartnerStatusTabs({ activeTab, onTabChange }: PartnerStatusTabsProps) {
  return (
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
  )
}
