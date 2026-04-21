'use client'

import { useMemo } from 'react'
import { Badge, type BadgeVariant } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { formatDate } from '@/lib/utils'
import { useGoofishReport } from '../_hooks/useGoofishReport'
import type { GoofishReportItem, GoofishReportStatus } from '../_types'

const STATUS_META: Record<GoofishReportStatus, { label: string; variant: BadgeVariant }> = {
  down: { label: '하락', variant: 'green' },
  up: { label: '상승', variant: 'red' },
  same: { label: '변동없음', variant: 'gray' },
  new: { label: '신규등장', variant: 'blue' },
  gone: { label: '매물소진', variant: 'yellow' },
  first: { label: '첫수집', variant: 'gray' },
}

const STATUS_PRIORITY: Record<GoofishReportStatus, number> = {
  down: 0,
  up: 1,
  new: 2,
  gone: 3,
  first: 4,
  same: 5,
}

function sortItems(items: GoofishReportItem[]): GoofishReportItem[] {
  return [...items].sort((a, b) => {
    const priorityDiff = STATUS_PRIORITY[a.status] - STATUS_PRIORITY[b.status]
    if (priorityDiff !== 0) return priorityDiff
    if (a.status === 'down' || a.status === 'up') {
      const deltaA = Math.abs(a.deltaYuan ?? 0)
      const deltaB = Math.abs(b.deltaYuan ?? 0)
      if (deltaA !== deltaB) return deltaB - deltaA
    }
    return a.name.localeCompare(b.name, 'ko')
  })
}

function formatYuan(value: number | null): string {
  if (value === null) return '-'
  return `${value.toFixed(2)}元`
}

function formatDelta(value: number | null, status: GoofishReportStatus): string {
  if (value === null) return '-'
  if (status === 'same') return '0.00元'
  const arrow = value < 0 ? '▼' : value > 0 ? '▲' : ''
  return `${arrow} ${Math.abs(value).toFixed(2)}元`
}

function deltaClass(status: GoofishReportStatus): string {
  if (status === 'down') return 'text-success'
  if (status === 'up') return 'text-danger'
  return 'text-text-muted'
}

export function GoofishReportTable() {
  const { data, isLoading, isError, error } = useGoofishReport()

  const rows = useMemo(() => (data ? sortItems(data.products) : []), [data])

  if (isLoading) {
    return (
      <Card className="p-6 text-center text-body-md text-text-muted">
        불러오는 중...
      </Card>
    )
  }

  if (isError) {
    return (
      <Card className="p-6 text-center text-body-md text-danger">
        {error instanceof Error ? error.message : '리포트를 불러오지 못했습니다.'}
      </Card>
    )
  }

  if (rows.length === 0) {
    return (
      <Card className="p-6 text-center text-body-md text-text-muted">
        모니터링 대상 상품이 없습니다. 상품 관리에서 Goofish 모니터링을 켜주세요.
      </Card>
    )
  }

  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-body-md">
          <thead className="bg-background-muted text-caption-md text-text-secondary">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">상품명</th>
              <th className="px-4 py-3 text-right font-semibold">오늘 최저가</th>
              <th className="px-4 py-3 text-right font-semibold">전일 최저가</th>
              <th className="px-4 py-3 text-right font-semibold">변동</th>
              <th className="px-4 py-3 text-center font-semibold">상태</th>
              <th className="px-4 py-3 text-left font-semibold">오늘 수집</th>
              <th className="px-4 py-3 text-left font-semibold">전일 수집</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rows.map((row) => {
              const meta = STATUS_META[row.status]
              return (
                <tr key={row.productId} className="hover:bg-background-muted/50">
                  <td className="px-4 py-3 text-text-primary">{row.name}</td>
                  <td className="px-4 py-3 text-right text-text-primary">
                    {formatYuan(row.todayMinYuan)}
                  </td>
                  <td className="px-4 py-3 text-right text-text-secondary">
                    {formatYuan(row.prevMinYuan)}
                  </td>
                  <td className={`px-4 py-3 text-right font-semibold ${deltaClass(row.status)}`}>
                    {formatDelta(row.deltaYuan, row.status)}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Badge variant={meta.variant}>{meta.label}</Badge>
                  </td>
                  <td className="px-4 py-3 text-caption-md text-text-muted">
                    {row.todayCheckedAt ? formatDate(row.todayCheckedAt) : '-'}
                  </td>
                  <td className="px-4 py-3 text-caption-md text-text-muted">
                    {row.prevCheckedAt ? formatDate(row.prevCheckedAt) : '-'}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
