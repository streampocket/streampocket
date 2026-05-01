'use client'

import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card, CardBody, CardFooter } from '@/components/ui/Card'
import type { BadgeVariant } from '@/components/ui/Badge'
import type { PartyApplicationStatus } from '@/types/domain'
import type { AdminApplicationListItem } from '../_types'

type ApplicationTableProps = {
  applications: AdminApplicationListItem[]
  total: number
  page: number
  totalPages: number
  onPageChange: (page: number) => void
  onViewDetail: (id: string) => void
}

const STATUS_BADGE: Record<PartyApplicationStatus, { variant: BadgeVariant; label: string }> = {
  pending: { variant: 'yellow', label: '대기' },
  confirmed: { variant: 'green', label: '확정' },
  cancelled: { variant: 'red', label: '거절' },
  expired: { variant: 'gray', label: '만료' },
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    timeZone: 'Asia/Seoul',
  })
}

function formatPrice(amount: number): string {
  return amount.toLocaleString('ko-KR')
}

export function ApplicationTable({
  applications,
  total,
  page,
  totalPages,
  onPageChange,
  onViewDetail,
}: ApplicationTableProps) {
  if (applications.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="text-body-md text-text-muted">신청이 없습니다.</p>
      </div>
    )
  }

  return (
    <Card>
      <div className="px-5 py-4">
        <p className="text-body-md text-text-secondary">총 {total}건</p>
      </div>

      <CardBody className="p-0">
        {/* 데스크탑 테이블 */}
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="text-caption-md px-4 py-3 font-medium text-text-muted">신청자</th>
                <th className="text-caption-md px-4 py-3 font-medium text-text-muted">연락처</th>
                <th className="text-caption-md px-4 py-3 font-medium text-text-muted">파티</th>
                <th className="text-caption-md px-4 py-3 font-medium text-text-muted">금액</th>
                <th className="text-caption-md px-4 py-3 font-medium text-text-muted">상태</th>
                <th className="text-caption-md px-4 py-3 font-medium text-text-muted">신청일</th>
                <th className="text-caption-md px-4 py-3 font-medium text-text-muted">액션</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => {
                const badge = STATUS_BADGE[app.status]
                return (
                  <tr
                    key={app.id}
                    className="border-b border-border transition-colors hover:bg-gray-50"
                  >
                    <td className="text-body-md px-4 py-3 font-medium text-text-primary">
                      {app.user.name}
                    </td>
                    <td className="text-body-md px-4 py-3 text-text-secondary">
                      {app.user.phone}
                    </td>
                    <td className="text-body-md px-4 py-3 text-text-secondary">
                      {app.product.name}
                    </td>
                    <td className="text-body-md px-4 py-3 text-text-secondary">
                      {formatPrice(app.totalAmount)}원
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={badge.variant}>{badge.label}</Badge>
                    </td>
                    <td className="text-body-md px-4 py-3 text-text-muted">
                      {formatDate(app.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => onViewDetail(app.id)}
                      >
                        상세
                      </Button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* 모바일 카드 */}
        <div className="space-y-3 p-4 md:hidden">
          {applications.map((app) => {
            const badge = STATUS_BADGE[app.status]
            return (
              <button
                key={app.id}
                type="button"
                onClick={() => onViewDetail(app.id)}
                className="w-full rounded-lg border border-border bg-card-bg p-4 text-left transition-colors hover:bg-gray-50"
              >
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-body-md font-medium text-text-primary">{app.user.name}</span>
                  <Badge variant={badge.variant}>{badge.label}</Badge>
                </div>
                <p className="text-caption-md text-text-secondary">{app.product.name}</p>
                <p className="text-caption-md mt-1 text-text-secondary">
                  {app.user.phone} · {formatPrice(app.totalAmount)}원
                </p>
                <p className="text-caption-sm mt-1 text-text-muted">{formatDate(app.createdAt)}</p>
              </button>
            )
          })}
        </div>
      </CardBody>

      {totalPages > 1 && (
        <CardFooter className="flex items-center justify-center gap-2 px-5 py-4">
          <Button
            variant="secondary"
            size="sm"
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
          >
            이전
          </Button>
          <span className="text-body-md text-text-secondary">
            {page} / {totalPages}
          </span>
          <Button
            variant="secondary"
            size="sm"
            disabled={page >= totalPages}
            onClick={() => onPageChange(page + 1)}
          >
            다음
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}
