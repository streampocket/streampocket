'use client'

import { StatCard } from '@/components/ui/StatCard'
import { useDashboardStats } from '../_hooks/useDashboardStats'

export function StatsGrid() {
  const { data, isLoading } = useDashboardStats()

  const stats = [
    {
      label: '총 주문',
      value: isLoading ? '-' : (data?.totalOrders ?? 0),
      sub: '전체 누적',
      icon: '📋',
      iconBg: 'bg-brand',
    },
    {
      label: '구매 확정',
      value: isLoading ? '-' : (data?.confirmedOrders ?? 0),
      sub: '확정 완료',
      icon: '✅',
      iconBg: 'bg-success',
    },
    {
      label: '확정 대기',
      value: isLoading ? '-' : (data?.pendingDecisionOrders ?? 0),
      sub: '발송 완료, 미확정',
      icon: '⏳',
      iconBg: 'bg-warning',
    },
    {
      label: '반품',
      value: isLoading ? '-' : (data?.returnedOrders ?? 0),
      sub: '반품 처리됨',
      icon: '↩',
      iconBg: 'bg-danger',
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {stats.map((stat) => (
        <StatCard
          key={stat.label}
          label={stat.label}
          value={stat.value}
          sub={stat.sub}
          icon={stat.icon}
          iconBg={stat.iconBg}
        />
      ))}
    </div>
  )
}
