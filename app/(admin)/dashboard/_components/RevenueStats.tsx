'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card, CardHeader, CardBody } from '@/components/ui/Card'
import { StatCard } from '@/components/ui/StatCard'
import { useDashboardStats } from '../_hooks/useDashboardStats'

type Period = 'today' | 'week' | 'month' | 'all'

const PERIOD_LABELS: Record<Period, string> = {
  today: '오늘',
  week: '이번 주',
  month: '이번 달',
  all: '전체',
}

function formatCurrency(value: number): string {
  return `${value.toLocaleString('ko-KR')}원`
}

export function RevenueStats() {
  const [period, setPeriod] = useState<Period>('all')
  const { data, isLoading } = useDashboardStats(period)

  const revenue = data?.revenue

  return (
    <Card>
      <CardHeader>
        <h2 className="text-heading-md text-text-primary">매출 통계</h2>
        <div className="flex items-center gap-2">
          <div className="flex flex-wrap gap-1">
            {(Object.keys(PERIOD_LABELS) as Period[]).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`rounded-lg px-3 py-1.5 text-caption-md font-medium transition-colors ${
                  period === p
                    ? 'bg-brand text-white'
                    : 'text-text-muted hover:bg-gray-100'
                }`}
              >
                {PERIOD_LABELS[p]}
              </button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardBody>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <StatCard
            label="총 판매금"
            value={isLoading ? '-' : formatCurrency(revenue?.totalRevenue ?? 0)}
          />
          <StatCard
            label="정산금"
            value={isLoading ? '-' : formatCurrency(revenue?.totalSettlement ?? 0)}
          />
          <StatCard
            label="순수익"
            value={isLoading ? '-' : formatCurrency(revenue?.netProfit ?? 0)}
          />
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
          <StatCard
            label="총 비용"
            value={isLoading ? '-' : formatCurrency(revenue?.totalCosts ?? 0)}
          />
          <StatCard
            label="인당 비용"
            value={isLoading ? '-' : formatCurrency(Math.round((revenue?.totalCosts ?? 0) / 2))}
          />
          <StatCard
            label="인당 수익"
            value={isLoading ? '-' : formatCurrency(Math.round((revenue?.netProfit ?? 0) / 2))}
          />
        </div>

        {!isLoading && (revenue?.pendingSettlement ?? 0) > 0 && (
          <p className="mt-2 text-caption-md text-text-muted">
            구매확정 대기: {formatCurrency(revenue?.pendingSettlement ?? 0)}
          </p>
        )}

        <div className="mt-3 flex justify-end">
          <Link
            href="/revenue"
            className="text-caption-md text-text-muted hover:text-brand"
          >
            상세보기 →
          </Link>
        </div>
      </CardBody>
    </Card>
  )
}
