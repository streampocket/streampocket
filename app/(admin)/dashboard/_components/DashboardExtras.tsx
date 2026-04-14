'use client'

import { Card, CardHeader, CardBody } from '@/components/ui/Card'
import { useDashboardExtras } from '../_hooks/useDashboardExtras'

function formatCurrency(value: number): string {
  return `${value.toLocaleString('ko-KR')}원`
}

export function DashboardExtras() {
  const { data, isLoading } = useDashboardExtras()

  const ranking = data?.productRanking ?? []
  const maxRevenue = ranking.length > 0 ? ranking[0].totalRevenue : 0

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <h2 className="text-heading-md text-text-primary">상품별 매출 Top 5</h2>
        </CardHeader>
        <CardBody>
          {isLoading ? (
            <p className="text-text-muted">로딩 중...</p>
          ) : ranking.length === 0 ? (
            <p className="text-text-muted">데이터가 없습니다</p>
          ) : (
            <div className="space-y-4">
              {ranking.map((item, idx) => {
                const percent = maxRevenue > 0
                  ? (item.totalRevenue / maxRevenue) * 100
                  : 0

                return (
                  <div key={item.productName}>
                    <div className="mb-1 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand/10 text-caption-md font-bold text-brand">
                          {idx + 1}
                        </span>
                        <span className="text-body-sm text-text-primary line-clamp-1">
                          {item.productName}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-caption-md text-text-muted">
                        <span>{item.orderCount}건</span>
                        <span className="font-medium text-text-primary">
                          {formatCurrency(item.totalRevenue)}
                        </span>
                      </div>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
                      <div
                        className="h-full rounded-full bg-brand transition-all"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="text-heading-md text-text-primary">주요 지표</h2>
        </CardHeader>
        <CardBody>
          {isLoading ? (
            <p className="text-text-muted">로딩 중...</p>
          ) : (
            <div className="flex flex-col items-center justify-center py-8">
              <p className="text-caption-md text-text-muted">평균 구매확정 소요일</p>
              <p className="mt-2 text-display font-bold text-text-primary">
                {data?.averageDecisionDays ?? 0}
                <span className="ml-1 text-heading-md font-normal text-text-muted">일</span>
              </p>
              <p className="mt-3 text-caption-md text-text-muted">
                결제 → 구매확정까지 평균 소요 기간
              </p>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  )
}
