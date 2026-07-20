'use client'

import { Card, CardHeader, CardBody } from '@/components/ui/Card'
import { formatMonthDay } from '@/lib/utils'
import type { DailyVisit } from '../_types'

type DailyVisitsChartProps = {
  daily: DailyVisit[]
}

// 라이브러리 없는 커스텀 세로 막대 — 기존 대시보드 카드 스타일. 모바일은 가로 스크롤.
export function DailyVisitsChart({ daily }: DailyVisitsChartProps) {
  const max = Math.max(...daily.map((d) => d.count), 1)

  return (
    <Card>
      <CardHeader>
        <h3 className="text-heading-sm text-text-primary">일별 방문 추이</h3>
      </CardHeader>
      <CardBody>
        {daily.length === 0 ? (
          <p className="py-8 text-center text-caption-md text-text-muted">데이터가 없습니다</p>
        ) : (
          <div className="overflow-x-auto">
            <div
              className="flex h-40 items-end gap-1"
              style={{ minWidth: `${daily.length * 14}px` }}
            >
              {daily.map((d) => (
                <div
                  key={d.date}
                  className="group relative flex h-full min-w-[10px] flex-1 flex-col justify-end"
                  title={`${d.date} · ${d.count.toLocaleString()}명`}
                >
                  <div
                    className="rounded-t-sm bg-brand transition-colors group-hover:bg-brand-dark"
                    style={{ height: `${Math.max((d.count / max) * 100, d.count > 0 ? 3 : 0)}%` }}
                  />
                  {/* 방문 0일도 바닥선이 보이도록 최소 높이 */}
                  {d.count === 0 && <div className="h-[2px] rounded-t-sm bg-gray-200" />}
                </div>
              ))}
            </div>
            <div className="mt-2 flex justify-between text-caption-sm text-text-muted">
              <span>{formatMonthDay(daily[0].date)}</span>
              {daily.length > 2 && (
                <span>{formatMonthDay(daily[Math.floor(daily.length / 2)].date)}</span>
              )}
              <span>{formatMonthDay(daily[daily.length - 1].date)}</span>
            </div>
          </div>
        )}
      </CardBody>
    </Card>
  )
}
