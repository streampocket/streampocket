'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Card, CardBody, CardFooter } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import type { BadgeVariant } from '@/components/ui/Badge'
import { ExportButton } from './ExportButton'
import { OrderDetailModal } from './OrderDetailModal'
import { useOrders } from '../_hooks/useOrders'
import { formatDate } from '@/lib/utils'
import { PAGE_SIZE } from '@/constants/app'
import type { FulfillmentStatus } from '@/types/domain'

const STATUS_MAP: Record<FulfillmentStatus, { label: string; variant: BadgeVariant }> = {
  pending: { label: '대기', variant: 'yellow' },
  completed: { label: '완료', variant: 'green' },
  manual_review: { label: '수동처리', variant: 'red' },
  failed: { label: '실패', variant: 'gray' },
  returned: { label: '반품', variant: 'purple' },
}

export function OrdersTable() {
  const searchParams = useSearchParams()
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null)

  const status = (searchParams.get('status') as FulfillmentStatus) || undefined
  const from = searchParams.get('from') || undefined
  const to = searchParams.get('to') || undefined
  const page = Number(searchParams.get('page') ?? 1)

  const { data, isLoading } = useOrders({ status, from, to, page, pageSize: PAGE_SIZE })

  return (
    <>
      <Card>
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <p className="text-caption-md text-text-secondary">
            총 <strong className="text-text-primary">{data?.total ?? 0}</strong>건
          </p>
          <ExportButton status={status} from={from} to={to} />
        </div>

        <CardBody className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-gray-50">
                  <th className="text-label-md px-5 py-3 text-left text-text-secondary">상품주문번호</th>
                  <th className="text-label-md px-5 py-3 text-left text-text-secondary">상품명</th>
                  <th className="text-label-md px-5 py-3 text-left text-text-secondary">수신전화번호</th>
                  <th className="text-label-md px-5 py-3 text-left text-text-secondary">금액</th>
                  <th className="text-label-md px-5 py-3 text-left text-text-secondary">상태</th>
                  <th className="text-label-md px-5 py-3 text-left text-text-secondary">결제일시</th>
                  <th className="text-label-md px-5 py-3 text-left text-text-secondary"></th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={7} className="text-caption-md px-5 py-10 text-center text-text-muted">
                      로딩 중...
                    </td>
                  </tr>
                ) : data?.data.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-caption-md px-5 py-10 text-center text-text-muted">
                      주문이 없습니다
                    </td>
                  </tr>
                ) : (
                  data?.data.map((order) => {
                    const orderStatus = STATUS_MAP[order.fulfillmentStatus]
                    return (
                      <tr
                        key={order.id}
                        className="border-b border-border last:border-0 hover:bg-gray-50"
                      >
                        <td className="px-5 py-3">
                          <span className="font-mono text-caption-md text-text-secondary">
                            {order.productOrderId}
                          </span>
                        </td>
                        <td className="text-body-md max-w-40 truncate px-5 py-3 text-text-primary">
                          {order.productName}
                        </td>
                        <td className="text-caption-md px-5 py-3 text-text-secondary">
                          {order.receiverPhoneNumber ?? <span className="text-danger">미확인</span>}
                        </td>
                        <td className="text-body-md px-5 py-3 text-text-primary">
                          {order.unitPrice.toLocaleString()}원
                        </td>
                        <td className="px-5 py-3">
                          <Badge variant={orderStatus.variant}>{orderStatus.label}</Badge>
                        </td>
                        <td className="text-caption-md px-5 py-3 text-text-secondary">
                          {order.paidAt ? formatDate(order.paidAt) : '-'}
                        </td>
                        <td className="px-5 py-3">
                          <Button
                            variant="secondary"
                            size="xs"
                            onClick={() => setSelectedOrderId(order.id)}
                          >
                            상세
                          </Button>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </CardBody>

        {data && data.totalPages > 1 && (
          <CardFooter>
            <div className="flex w-full items-center justify-center gap-2">
              <Button
                variant="secondary"
                size="xs"
                disabled={page <= 1}
                onClick={() => {
                  const params = new URLSearchParams(window.location.search)
                  params.set('page', String(page - 1))
                  window.history.pushState(null, '', `?${params.toString()}`)
                }}
              >
                이전
              </Button>
              <span className="text-caption-md text-text-secondary">
                {page} / {data.totalPages}
              </span>
              <Button
                variant="secondary"
                size="xs"
                disabled={page >= data.totalPages}
                onClick={() => {
                  const params = new URLSearchParams(window.location.search)
                  params.set('page', String(page + 1))
                  window.history.pushState(null, '', `?${params.toString()}`)
                }}
              >
                다음
              </Button>
            </div>
          </CardFooter>
        )}
      </Card>

      <OrderDetailModal orderId={selectedOrderId} onClose={() => setSelectedOrderId(null)} />
    </>
  )
}
