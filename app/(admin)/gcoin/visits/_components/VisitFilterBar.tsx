'use client'

import { getTodayStringKST } from '@/lib/utils'
import { DEFAULT_RANGE_DAYS, SITE_TABS } from '../_types'
import type { VisitSite } from '../_types'

type VisitFilterBarProps = {
  site: VisitSite
  onSiteChange: (site: VisitSite) => void
  from: string
  to: string
  onRangeChange: (from: string, to: string) => void
}

const PRESETS: { label: string; days: number }[] = [
  { label: '오늘', days: 1 },
  { label: '7일', days: 7 },
  { label: '30일', days: 30 },
  { label: '90일', days: 90 },
]

// KST 오늘 기준 days일 전 'YYYY-MM-DD'
function kstDaysAgo(days: number): string {
  const todayKst = new Date(`${getTodayStringKST()}T00:00:00.000Z`)
  todayKst.setUTCDate(todayKst.getUTCDate() - days)
  return todayKst.toISOString().slice(0, 10)
}

export function VisitFilterBar({
  site,
  onSiteChange,
  from,
  to,
  onRangeChange,
}: VisitFilterBarProps) {
  const today = getTodayStringKST()

  return (
    <div className="space-y-3">
      {/* 사이트 탭 */}
      <div className="flex items-center gap-1.5">
        {SITE_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => onSiteChange(tab.value)}
            className={`text-caption-md rounded-lg px-4 py-2 font-semibold transition-colors ${
              site === tab.value
                ? 'bg-brand text-white'
                : 'bg-gray-100 text-text-secondary hover:bg-gray-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 기간 필터 */}
      <div className="flex flex-wrap items-center gap-2 rounded-xl border border-border bg-card-bg p-4">
        {PRESETS.map((preset) => (
          <button
            key={preset.days}
            onClick={() => onRangeChange(kstDaysAgo(preset.days - 1), today)}
            className="text-caption-md rounded-lg bg-gray-100 px-3 py-1.5 font-semibold text-text-secondary transition-colors hover:bg-gray-200"
          >
            {preset.label}
          </button>
        ))}
        <div className="flex items-center gap-1.5">
          <input
            type="date"
            value={from}
            max={to}
            onChange={(e) => e.target.value && onRangeChange(e.target.value, to)}
            className="text-caption-md rounded-lg border border-border px-2 py-1.5 text-text-primary outline-none focus:border-brand"
          />
          <span className="text-text-muted">~</span>
          <input
            type="date"
            value={to}
            min={from}
            max={today}
            onChange={(e) => e.target.value && onRangeChange(from, e.target.value)}
            className="text-caption-md rounded-lg border border-border px-2 py-1.5 text-text-primary outline-none focus:border-brand"
          />
        </div>
        <button
          onClick={() => onRangeChange(kstDaysAgo(DEFAULT_RANGE_DAYS - 1), today)}
          className="text-caption-md ml-auto shrink-0 rounded-lg px-3 py-1.5 font-medium text-text-muted transition-colors hover:bg-gray-100 hover:text-text-primary"
        >
          ↺ 초기화
        </button>
      </div>
    </div>
  )
}
