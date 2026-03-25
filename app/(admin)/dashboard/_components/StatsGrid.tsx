'use client'

import { StatCard } from '@/components/ui/StatCard'
import { useDashboardStats } from '../_hooks/useDashboardStats'

export function StatsGrid() {
  const { data, isLoading } = useDashboardStats()

  const stats = [
    {
      label: '오늘 주문',
      value: isLoading ? '-' : (data?.todayOrders ?? 0),
      sub: '금일 00:00 이후',
      icon: '📋',
      iconBg: 'bg-brand',
    },
    {
      label: '처리 대기',
      value: isLoading ? '-' : (data?.pendingOrders ?? 0),
      sub: 'pending 상태',
      icon: '⏳',
      iconBg: 'bg-warning',
    },
    {
      label: '수동 처리 필요',
      value: isLoading ? '-' : (data?.manualReviewOrders ?? 0),
      sub: '확인 필요',
      icon: '⚠',
      iconBg: 'bg-danger',
    },
    {
      label: '재고 부족 상품',
      value: isLoading ? '-' : (data?.lowStockProducts ?? 0),
      sub: '2개 이하',
      icon: '📦',
      iconBg: 'bg-info',
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
