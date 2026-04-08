'use client'

import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card, CardBody, CardFooter } from '@/components/ui/Card'
import type { BadgeVariant } from '@/components/ui/Badge'
import type { PaymentWithDetails, PaymentStatus, PaymentMethod } from '@/types/domain'

type PaymentTableProps = {
  payments: PaymentWithDetails[]
  total: number
  page: number
  totalPages: number
  onPageChange: (page: number) => void
  onViewDetail: (id: string) => void
}

const STATUS_BADGE: Record<PaymentStatus, { variant: BadgeVariant; label: string }> = {
  pending: { variant: 'yellow', label: '대기중' },
  paid: { variant: 'green', label: '완료' },
  cancelled: { variant: 'red', label: '취소' },
}

const METHOD_LABEL: Record<PaymentMethod, string> = {
  manual: '수동',
  pg: 'PG',
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
}

function formatPrice(amount: number): string {
  return amount.toLocaleString('ko-KR')
}

export function PaymentTable({
  payments,
  total,
  page,
  totalPages,
  onPageChange,
  onViewDetail,
}: PaymentTableProps) {
  if (payments.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="text-body-md text-text-muted">결제 내역이 없습니다.</p>
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
                <th className="text-caption-md px-4 py-3 font-medium text-text-muted">파티명</th>
                <th className="text-caption-md px-4 py-3 font-medium text-text-muted">금액</th>
                <th className="text-caption-md px-4 py-3 font-medium text-text-muted">수수료</th>
                <th className="text-caption-md px-4 py-3 font-medium text-text-muted">합계</th>
                <th className="text-caption-md px-4 py-3 font-medium text-text-muted">결제방법</th>
                <th className="text-caption-md px-4 py-3 font-medium text-text-muted">상태</th>
                <th className="text-caption-md px-4 py-3 font-medium text-text-muted">신청일</th>
                <th className="text-caption-md px-4 py-3 font-medium text-text-muted">액션</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment) => {
                const badge = STATUS_BADGE[payment.status]
                const isPending = payment.status === 'pending'
                return (
                  <tr
                    key={payment.id}
                    className={`border-b border-border transition-colors hover:bg-gray-50 ${
                      isPending ? 'border-l-2 border-l-yellow-400' : ''
                    }`}
                  >
                    <td className="text-body-md px-4 py-3 text-text-primary">
                      {payment.application.user.name}
                    </td>
                    <td className="text-body-md px-4 py-3 text-text-secondary">
                      {payment.application.product.name}
                    </td>
                    <td className="text-body-md px-4 py-3 text-text-secondary">
                      {formatPrice(payment.application.price)}원
                    </td>
                    <td className="text-body-md px-4 py-3 text-text-secondary">
                      {formatPrice(payment.application.fee)}원
                    </td>
                    <td className="text-body-md px-4 py-3 font-medium text-text-primary">
                      {formatPrice(payment.amount)}원
                    </td>
                    <td className="text-body-md px-4 py-3 text-text-secondary">
                      {METHOD_LABEL[payment.method]}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={badge.variant}>{badge.label}</Badge>
                    </td>
                    <td className="text-body-md px-4 py-3 text-text-muted">
                      {formatDate(payment.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => onViewDetail(payment.id)}
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
          {payments.map((payment) => {
            const badge = STATUS_BADGE[payment.status]
            const isPending = payment.status === 'pending'
            return (
              <button
                key={payment.id}
                type="button"
                onClick={() => onViewDetail(payment.id)}
                className={`w-full rounded-lg border border-border bg-card-bg p-4 text-left transition-colors hover:bg-gray-50 ${
                  isPending ? 'border-l-2 border-l-yellow-400' : ''
                }`}
              >
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-body-md font-medium text-text-primary">
                    {payment.application.user.name}
                  </span>
                  <Badge variant={badge.variant}>{badge.label}</Badge>
                </div>
                <p className="text-caption-md text-text-secondary">
                  {payment.application.product.name}
                </p>
                <p className="text-caption-md mt-1 text-text-secondary">
                  {formatPrice(payment.application.price)}원 + {formatPrice(payment.application.fee)}원 수수료
                </p>
                <p className="text-body-md mt-1 font-medium text-text-primary">
                  합계: {formatPrice(payment.amount)}원
                </p>
                <p className="text-caption-sm mt-1 text-text-muted">
                  {formatDate(payment.createdAt)}
                </p>
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
