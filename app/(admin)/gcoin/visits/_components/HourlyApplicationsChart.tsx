'use client'

import { Card, CardHeader, CardBody } from '@/components/ui/Card'
import { cn } from '@/lib/utils'
import type { ApplicationHourStats } from '../_types'

type HourlyApplicationsChartProps = {
  stats: ApplicationHourStats | undefined
  isLoading: boolean
}

// 6시간 단위로 눈금을 찍는다 — 24칸에 라벨을 전부 달면 모바일에서 겹친다
const AXIS_HOURS = [0, 6, 12, 18, 23]

/**
 * 신청이 들어온 시간대 분포.
 *
 * 기준은 이용자가 신청 버튼을 누른 시각이다(관리자 승인 시각이 아니다).
 * 라이브러리 없는 커스텀 막대 — 같은 화면의 DailyVisitsChart와 같은 방식이다.
 */
export function HourlyApplicationsChart({ stats, isLoading }: HourlyApplicationsChartProps) {
  const hourly = stats?.hourly ?? []
  // 전부 0일 때 0으로 나누지 않도록 최소 1
  const max = Math.max(...hourly.map((h) => h.count), 1)

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
          <h3 className="text-heading-sm text-text-primary">시간대별 파티 신청</h3>
          {stats && stats.total > 0 && (
            <span className="text-caption-md text-text-secondary">
              가장 많은 시간{' '}
              <b className="text-text-primary tabular-nums">{stats.peakHour}시</b>
              <span className="text-text-muted">
                {' '}
                ({hourly[stats.peakHour ?? 0]?.count.toLocaleString()}건)
              </span>
            </span>
          )}
        </div>
        {stats && (
          <span className="text-caption-md text-text-secondary">
            총 <b className="text-text-primary tabular-nums">{stats.total.toLocaleString()}</b>건
          </span>
        )}
      </CardHeader>
      <CardBody>
        {isLoading ? (
          <p className="py-8 text-center text-caption-md text-text-muted">로딩 중...</p>
        ) : !stats || stats.total === 0 ? (
          <p className="py-8 text-center text-caption-md text-text-muted">
            이 기간에 들어온 신청이 없습니다
          </p>
        ) : (
          <div className="overflow-x-auto">
            <div className="flex h-40 items-end gap-1" style={{ minWidth: '360px' }}>
              {hourly.map((item) => {
                const isPeak = item.hour === stats.peakHour
                return (
                  <div
                    key={item.hour}
                    className="group relative flex h-full min-w-[10px] flex-1 flex-col justify-end"
                    title={`${item.hour}시 · ${item.count.toLocaleString()}건`}
                  >
                    <div
                      className={cn(
                        'rounded-t-sm transition-colors',
                        // 피크만 진하게 — "언제 몰리나"가 한눈에 들어와야 한다
                        isPeak ? 'bg-brand-dark' : 'bg-brand group-hover:bg-brand-dark',
                      )}
                      style={{
                        height: `${Math.max((item.count / max) * 100, item.count > 0 ? 3 : 0)}%`,
                      }}
                    />
                    {item.count === 0 && <div className="h-[2px] rounded-t-sm bg-gray-200" />}
                  </div>
                )
              })}
            </div>
            <div
              className="mt-2 flex justify-between text-caption-sm text-text-muted"
              style={{ minWidth: '360px' }}
            >
              {AXIS_HOURS.map((hour) => (
                <span key={hour} className="tabular-nums">
                  {hour}시
                </span>
              ))}
            </div>
            <p className="mt-3 text-caption-sm text-text-muted">
              이용자가 신청한 시각(한국시간) 기준입니다. 취소·만료된 신청도 포함합니다.
            </p>
          </div>
        )}
      </CardBody>
    </Card>
  )
}
