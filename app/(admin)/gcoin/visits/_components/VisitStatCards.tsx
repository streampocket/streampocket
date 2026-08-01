'use client'

import { StatCard } from '@/components/ui/StatCard'
import { cn } from '@/lib/utils'
import type { SignupStats, VisitStats } from '../_types'

type VisitStatCardsProps = {
  stats: VisitStats | undefined
  /** OTTALL 탭에서만 내려온다 — 지코인은 회원가입 기능이 없다 */
  signup?: SignupStats
  showSignup: boolean
}

export function VisitStatCards({ stats, signup, showSignup }: VisitStatCardsProps) {
  const dayCount = stats?.daily.length ?? 0
  const average =
    stats && dayCount > 0 ? Math.round((stats.totalVisits / dayCount) * 10) / 10 : 0

  return (
    <div
      className={cn(
        'grid grid-cols-1 gap-3',
        showSignup ? 'sm:grid-cols-2 lg:grid-cols-4' : 'sm:grid-cols-3',
      )}
    >
      <StatCard
        label="오늘 방문"
        value={stats ? stats.todayVisits.toLocaleString() : '-'}
        icon="👥"
        iconBg="bg-brand-light"
      />
      {/* 오늘 방문 바로 옆에 둔다 — 나란히 있어야 전환이 눈에 들어온다 */}
      {showSignup && (
        <StatCard
          label="오늘 가입"
          value={signup ? signup.today.toLocaleString() : '-'}
          sub={signup ? `기간 합계 ${signup.rangeTotal.toLocaleString()}명` : undefined}
          icon="🙋"
          iconBg="bg-brand-light"
        />
      )}
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
