'use client'

import { StatCard } from '@/components/ui/StatCard'
import { Card, CardHeader, CardBody } from '@/components/ui/Card'
import { useExpenseSummary } from '../_hooks/useExpenseSummary'

type RevenueSummaryProps = {
  yearMonth: string
}

function fmt(n: number): string {
  return `${n.toLocaleString('ko-KR')}원`
}

export function RevenueSummary({ yearMonth }: RevenueSummaryProps) {
  const { data, isLoading } = useExpenseSummary(yearMonth)

  const loading = isLoading || !data

  return (
    <Card>
      <CardHeader>
        <h2 className="text-heading-md text-text-primary">수익 요약</h2>
      </CardHeader>
      <CardBody>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <StatCard
            label="총 판매금"
            value={loading ? '-' : fmt(data.totalRevenue)}
          />
          <StatCard
            label="정산금"
            value={loading ? '-' : fmt(data.totalSettlement)}
          />
          <StatCard
            label="순수익"
            value={loading ? '-' : fmt(data.netProfit)}
          />
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
          <StatCard
            label="총 비용"
            value={loading ? '-' : fmt(data.totalCosts)}
          />
          <StatCard
            label="인당 비용"
            value={loading ? '-' : fmt(Math.round(data.totalCosts / 2))}
          />
          <StatCard
            label="인당 수익"
            value={loading ? '-' : fmt(Math.round(data.netProfit / 2))}
          />
        </div>

        {!loading && data.pendingSettlement > 0 && (
          <p className="mt-3 text-caption-md text-text-muted">
            구매확정 대기: {fmt(data.pendingSettlement)}
          </p>
        )}

        {!loading && (
          <div className="mt-4 rounded-lg border border-border p-4">
            <h3 className="mb-3 text-body-md font-semibold text-text-primary">비용 상세</h3>
            <div className="space-y-2 text-body-sm text-text-secondary">
              <div className="flex justify-between">
                <span>
                  네이버 수수료 ({data.totalRevenue > 0 ? ((data.costs.naverCommission / data.totalRevenue) * 100).toFixed(1) : '0.0'}%)
                </span>
                <span>{fmt(data.costs.naverCommission)}</span>
              </div>
              <div className="flex justify-between">
                <span>
                  알림톡 ({data.alimtalkCount}건 × {data.alimtalkUnitCost}원)
                </span>
                <span>{fmt(data.costs.alimtalk)}</span>
              </div>
              <div className="flex justify-between">
                <span>게임 구매비</span>
                <span>{fmt(data.costs.gamePurchase)}</span>
              </div>
              <div className="flex justify-between">
                <span>국가변경</span>
                <span>{fmt(data.costs.countryChange)}</span>
              </div>
              <div className="flex justify-between">
                <span>리뷰 게임</span>
                <span>{fmt(data.costs.reviewGame)}</span>
              </div>
              <div className="flex justify-between">
                <span>기타</span>
                <span>{fmt(data.costs.other)}</span>
              </div>
            </div>
          </div>
        )}
      </CardBody>
    </Card>
  )
}
