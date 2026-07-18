'use client'

import { useState } from 'react'
import { Card, CardHeader, CardBody } from '@/components/ui/Card'
import { cn, getTodayStringKST } from '@/lib/utils'
import { useStoreParam } from '@/hooks/useStoreParam'
import { useRevenueCalendar } from '../_hooks/useRevenueCalendar'
import { DailyReportModal } from './DailyReportModal'
import type { RevenueCalendarItem } from '../_types'

const WEEKDAY_LABELS = ['일', '월', '화', '수', '목', '금', '토']

/** 캘린더 셀용 축약 금액 — 1만 이상은 만원 단위(소수 1자리), 미만은 원 단위 */
function formatCompactWon(value: number): string {
  if (Math.abs(value) < 10_000) return value.toLocaleString('ko-KR')
  const man = Math.round((value / 10_000) * 10) / 10
  return `${man.toLocaleString('ko-KR')}만`
}

/** 'YYYY-MM' 기준 이전/다음 달 */
function shiftYearMonth(yearMonth: string, diff: number): string {
  const [year, month] = yearMonth.split('-').map(Number)
  const shifted = new Date(Date.UTC(year, month - 1 + diff, 1))
  return `${shifted.getUTCFullYear()}-${String(shifted.getUTCMonth() + 1).padStart(2, '0')}`
}

/** 날짜 문자열(YYYY-MM-DD)의 요일 (0=일) — 타임존 무관 계산 */
function weekdayOf(dateStr: string): number {
  return new Date(`${dateStr}T00:00:00Z`).getUTCDay()
}

export function RevenueCalendar() {
  const today = getTodayStringKST()
  const [yearMonth, setYearMonth] = useState(today.slice(0, 7))
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const store = useStoreParam()
  const { data: items, isLoading } = useRevenueCalendar(yearMonth, store)

  const [year, month] = yearMonth.split('-').map(Number)
  // 1일 앞의 빈 칸 수 = 1일의 요일
  const leadingBlanks = items && items.length > 0 ? weekdayOf(items[0].date) : 0

  return (
    <>
      <Card>
        <CardHeader>
          <h2 className="text-heading-md text-text-primary">매출 캘린더</h2>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setYearMonth((prev) => shiftYearMonth(prev, -1))}
              aria-label="이전 달"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-text-muted transition-colors hover:bg-gray-100 hover:text-text-primary"
            >
              ◀
            </button>
            <span className="min-w-28 text-center text-body-md font-semibold text-text-primary">
              {year}년 {month}월
            </span>
            <button
              onClick={() => setYearMonth((prev) => shiftYearMonth(prev, 1))}
              aria-label="다음 달"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-text-muted transition-colors hover:bg-gray-100 hover:text-text-primary"
            >
              ▶
            </button>
          </div>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-7 gap-1">
            {WEEKDAY_LABELS.map((label, i) => (
              <div
                key={label}
                className={cn(
                  'pb-1 text-center text-caption-sm font-medium',
                  i === 0 ? 'text-red-500' : i === 6 ? 'text-blue-500' : 'text-text-muted',
                )}
              >
                {label}
              </div>
            ))}

            {isLoading || !items ? (
              <div className="col-span-7 py-16 text-center text-body-md text-text-muted">
                캘린더를 불러오는 중...
              </div>
            ) : (
              <>
                {Array.from({ length: leadingBlanks }, (_, i) => (
                  <div key={`blank-${i}`} />
                ))}
                {items.map((item) => (
                  <CalendarCell
                    key={item.date}
                    item={item}
                    isToday={item.date === today}
                    onClick={() => setSelectedDate(item.date)}
                  />
                ))}
              </>
            )}
          </div>

          <p className="mt-3 text-caption-sm text-text-muted">
            칸의 위 숫자는 매출, 아래는 순수익입니다. 날짜를 클릭하면 일일 종합 리포트를 볼 수
            있습니다.
          </p>
        </CardBody>
      </Card>

      {selectedDate && (
        <DailyReportModal date={selectedDate} onClose={() => setSelectedDate(null)} />
      )}
    </>
  )
}

type CalendarCellProps = {
  item: RevenueCalendarItem
  isToday: boolean
  onClick: () => void
}

function CalendarCell({ item, isToday, onClick }: CalendarCellProps) {
  const day = Number(item.date.slice(8, 10))
  const hasData = item.totalRevenue !== 0 || item.netProfit !== 0

  return (
    <button
      onClick={onClick}
      className={cn(
        'flex min-h-16 flex-col items-center gap-0.5 rounded-lg border p-1 text-center transition-colors sm:min-h-18',
        isToday ? 'border-brand bg-brand/5' : 'border-transparent hover:border-border hover:bg-gray-50',
      )}
    >
      <span className="flex items-center gap-0.5">
        <span
          className={cn(
            'flex h-5 w-5 items-center justify-center rounded-full text-caption-sm',
            isToday ? 'bg-brand font-semibold text-white' : 'text-text-secondary',
          )}
        >
          {day}
        </span>
        {item.hasMemo && <span className="text-caption-sm">📝</span>}
      </span>
      {hasData && (
        <>
          <span className="w-full truncate text-caption-sm text-text-muted">
            {formatCompactWon(item.totalRevenue)}
          </span>
          <span
            className={cn(
              'w-full truncate text-caption-sm font-semibold',
              item.netProfit >= 0 ? 'text-emerald-600' : 'text-red-500',
            )}
          >
            {formatCompactWon(item.netProfit)}
          </span>
        </>
      )}
    </button>
  )
}
