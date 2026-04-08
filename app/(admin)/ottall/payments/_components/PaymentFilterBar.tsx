'use client'

import { cn } from '@/lib/utils'
import type { PaymentTabStatus } from '../_types'

type Tab = {
  value: PaymentTabStatus
  label: string
}

const TABS: Tab[] = [
  { value: 'all', label: '전체' },
  { value: 'pending', label: '대기중' },
  { value: 'paid', label: '완료' },
  { value: 'cancelled', label: '취소' },
]

type PaymentFilterBarProps = {
  activeTab: PaymentTabStatus
  onTabChange: (tab: PaymentTabStatus) => void
  from: string
  to: string
  onFromChange: (value: string) => void
  onToChange: (value: string) => void
}

export function PaymentFilterBar({
  activeTab,
  onTabChange,
  from,
  to,
  onFromChange,
  onToChange,
}: PaymentFilterBarProps) {
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

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <input
          type="date"
          value={from}
          onChange={(e) => onFromChange(e.target.value)}
          className="text-body-md rounded-lg border border-border bg-card-bg px-3 py-2 text-text-primary focus:border-brand focus:outline-none"
        />
        <span className="text-body-md hidden text-text-muted sm:block">~</span>
        <input
          type="date"
          value={to}
          onChange={(e) => onToChange(e.target.value)}
          className="text-body-md rounded-lg border border-border bg-card-bg px-3 py-2 text-text-primary focus:border-brand focus:outline-none"
        />
      </div>
    </div>
  )
}
