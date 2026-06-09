'use client'

import { useState } from 'react'
import { StoreTabs } from '@/components/StoreTabs'
import { useStoreParam } from '@/hooks/useStoreParam'
import { RevenueSummary } from './RevenueSummary'
import { ExpenseTable } from './ExpenseTable'
import { ManualRevenueTable } from './ManualRevenueTable'

function getCurrentYearMonth(): string {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
}

export function RevenuePageClient() {
  const [yearMonth, setYearMonth] = useState(getCurrentYearMonth())
  const store = useStoreParam()

  return (
    <div className="space-y-6">
      <StoreTabs />
      <RevenueSummary yearMonth={yearMonth} store={store} />
      <ExpenseTable yearMonth={yearMonth} store={store} onYearMonthChange={setYearMonth} />
      <ManualRevenueTable yearMonth={yearMonth} store={store} />
    </div>
  )
}
