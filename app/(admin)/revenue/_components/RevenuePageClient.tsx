'use client'

import { useState } from 'react'
import { RevenueSummary } from './RevenueSummary'
import { ExpenseTable } from './ExpenseTable'
import { ManualRevenueTable } from './ManualRevenueTable'

function getCurrentYearMonth(): string {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
}

export function RevenuePageClient() {
  const [yearMonth, setYearMonth] = useState(getCurrentYearMonth())

  return (
    <div className="space-y-6">
      <RevenueSummary yearMonth={yearMonth} />
      <ExpenseTable yearMonth={yearMonth} onYearMonthChange={setYearMonth} />
      <ManualRevenueTable yearMonth={yearMonth} />
    </div>
  )
}
