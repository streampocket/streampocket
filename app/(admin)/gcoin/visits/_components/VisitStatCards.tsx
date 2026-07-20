'use client'

import { StatCard } from '@/components/ui/StatCard'
import type { VisitStats } from '../_types'

type VisitStatCardsProps = {
  stats: VisitStats | undefined
}

export function VisitStatCards({ stats }: VisitStatCardsProps) {
  const dayCount = stats?.daily.length ?? 0
  const average =
    stats && dayCount > 0 ? Math.round((stats.totalVisits / dayCount) * 10) / 10 : 0

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      <StatCard
        label="오늘 방문"
        value={stats ? stats.todayVisits.toLocaleString() : '-'}
        icon="👥"
        iconBg="bg-brand-light"
      />
      <StatCard
        label="기간 총 방문"
        value={stats ? stats.totalVisits.toLocaleString() : '-'}
        sub={stats ? `${stats.range.from} ~ ${stats.range.to}` : undefined}
        icon="📈"
        iconBg="bg-brand-light"
      />
      <StatCard
        label="일평균 방문"
        value={stats ? average.toLocaleString() : '-'}
        sub={stats ? `${dayCount}일 기준` : undefined}
        icon="📊"
        iconBg="bg-brand-light"
      />
    </div>
  )
}
