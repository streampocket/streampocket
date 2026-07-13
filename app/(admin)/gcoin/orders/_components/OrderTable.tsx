'use client'

import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card, CardBody, CardFooter } from '@/components/ui/Card'
import { formatDate } from '@/lib/utils'
import type { BadgeVariant } from '@/components/ui/Badge'
import type { GcoinOrder, GcoinOrderStatus } from '../_types'

type OrderTableProps = {
  orders: GcoinOrder[]
  total: number
  page: number
  totalPages: number
  onPageChange: (page: number) => void
  onApprove: (order: GcoinOrder) => void
  onReject: (order: GcoinOrder) => void
}

export const GCOIN_ORDER_STATUS_BADGE: Record<
  GcoinOrderStatus,
  { variant: BadgeVariant; label: string }
> = {
  pending: { variant: 'yellow', label: '대기' },
  approved: { variant: 'green', label: '승인' },
  rejected: { variant: 'red', label: '거절' },
}

function formatPrice(amount: number): string {
  return amount.toLocaleString('ko-KR')
}

function formatPhone(phone: string): string {
  if (!/^010\d{8}$/.test(phone)) return phone
  return `${phone.slice(0, 3)}-${phone.slice(3, 7)}-${phone.slice(7)}`
}

export function OrderTable({
  orders,
  total,
  page,
  totalPages,
  onPageChange,
  onApprove,
  onReject,
}: OrderTableProps) {
  if (orders.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="text-body-md text-text-muted">주문이 없습니다.</p>
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
                <th className="text-caption-md px-4 py-3 font-medium text-text-muted">주문번호</th>
                <th className="text-caption-md px-4 py-3 font-medium text-text-muted">상품명</th>
                <th className="text-caption-md px-4 py-3 font-medium text-text-muted">금액</th>
                <th className="text-caption-md px-4 py-3 font-medium text-text-muted">전화번호</th>
                <th className="text-caption-md px-4 py-3 font-medium text-text-muted">신청일</th>
                <th className="text-caption-md px-4 py-3 font-medium text-text-muted">상태</th>
                <th className="text-caption-md px-4 py-3 font-medium text-text-muted">관리</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => {
                const badge = GCOIN_ORDER_STATUS_BADGE[order.status]
                return (
                  <tr
                    key={order.id}
                    className="border-b border-border transition-colors hover:bg-gray-50"
                  >
                    <td className="text-caption-md px-4 py-3 font-mono text-text-secondary">
                      {order.orderNo}
                    </td>
                    <td className="text-body-md px-4 py-3 font-medium text-text-primary">
                      {order.productName}
                    </td>
                    <td className="text-body-md px-4 py-3 text-text-secondary">
                      {formatPrice(order.salePrice)}원
                    </td>
                    <td className="text-body-md px-4 py-3 text-text-secondary">
                      {formatPhone(order.buyerPhone)}
                    </td>
                    <td className="text-caption-md px-4 py-3 text-text-secondary">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={badge.variant}>{badge.label}</Badge>
                      {order.status === 'rejected' && order.rejectReason && (
                        <p className="text-caption-sm mt-1 text-text-muted">
                          {order.rejectReason}
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {order.status === 'pending' ? (
                        <div className="flex gap-1">
                          <Button variant="primary" size="sm" onClick={() => onApprove(order)}>
                            승인
                          </Button>
                          <Button variant="danger" size="sm" onClick={() => onReject(order)}>
                            거절
                          </Button>
                        </div>
                      ) : (
                        <span className="text-caption-md text-text-muted">—</span>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* 모바일 카드 */}
        <div className="space-y-3 p-4 md:hidden">
          {orders.map((order) => {
            const badge = GCOIN_ORDER_STATUS_BADGE[order.status]
            return (
              <div key={order.id} className="rounded-lg border border-border bg-card-bg p-4">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <span className="text-body-md min-w-0 truncate font-medium text-text-primary">
                    {order.productName}
                  </span>
                  <Badge variant={badge.variant}>{badge.label}</Badge>
                </div>
                <p className="text-caption-md font-mono text-text-muted">{order.orderNo}</p>
                <p className="text-caption-md mt-1 text-text-secondary">
                  {formatPrice(order.salePrice)}원 · {formatPhone(order.buyerPhone)}
                </p>
                <p className="text-caption-md mt-1 text-text-secondary">
                  신청 {formatDate(order.createdAt)}
                </p>
                {order.status === 'rejected' && order.rejectReason && (
                  <p className="text-caption-sm mt-1 text-text-muted">사유: {order.rejectReason}</p>
                )}
                {order.status === 'pending' && (
                  <div className="mt-3 flex gap-2">
                    <Button variant="primary" size="sm" onClick={() => onApprove(order)}>
                      승인
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => onReject(order)}>
                      거절
                    </Button>
                  </div>
                )}
              </div>
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
