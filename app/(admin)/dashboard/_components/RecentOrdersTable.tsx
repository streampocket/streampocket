'use client'

import Link from 'next/link'
import { Card, CardHeader, CardBody, CardFooter } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import type { BadgeVariant } from '@/components/ui/Badge'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { QUERY_KEYS } from '@/constants/queryKeys'
import { formatDate } from '@/lib/utils'
import type { SteamOrderItem, FulfillmentStatus } from '@/types/domain'
import type { PaginatedResponse } from '@/types/api'

const STATUS_MAP: Record<FulfillmentStatus, { label: string; variant: BadgeVariant }> = {
  pending: { label: '대기', variant: 'yellow' },
  completed: { label: '완료', variant: 'green' },
  manual_review: { label: '수동처리', variant: 'red' },
  failed: { label: '실패', variant: 'gray' },
  returned: { label: '반품', variant: 'purple' },
}

export function RecentOrdersTable() {
  const { data, isLoading } = useQuery({
    queryKey: QUERY_KEYS.orders.list({ page: 1, pageSize: 5 }),
    queryFn: () =>
      api.get<PaginatedResponse<SteamOrderItem>>('/steam/admin/orders?page=1&pageSize=5'),
  })

  return (
    <Card>
      <CardHeader>
        <h2 className="text-heading-sm text-text-primary">최근 주문</h2>
        <Link href="/orders" className="text-caption-md text-brand hover:underline">
          전체 보기 →
        </Link>
      </CardHeader>
      <CardBody className="p-0">
        {/* 데스크탑 테이블 */}
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-gray-50">
                <th className="text-label-md px-5 py-3 text-left text-text-secondary">주문번호</th>
                <th className="text-label-md px-5 py-3 text-left text-text-secondary">상품명</th>
                <th className="text-label-md px-5 py-3 text-left text-text-secondary">상태</th>
                <th className="text-label-md px-5 py-3 text-left text-text-secondary">결제일시</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="text-caption-md px-5 py-8 text-center text-text-muted">
                    로딩 중...
                  </td>
                </tr>
              ) : data?.data.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-caption-md px-5 py-8 text-center text-text-muted">
                    주문이 없습니다
                  </td>
                </tr>
              ) : (
                data?.data.map((order) => {
                  const status = STATUS_MAP[order.fulfillmentStatus]
                  return (
                    <tr key={order.id} className="border-b border-border last:border-0 hover:bg-gray-50">
                      <td className="px-5 py-3">
                        <span className="font-mono text-caption-md text-text-secondary">
                          {order.productOrderId}
                        </span>
                      </td>
                      <td className="text-body-md px-5 py-3 text-text-primary">{order.productName}</td>
                      <td className="px-5 py-3">
                        <Badge variant={status.variant}>{status.label}</Badge>
                      </td>
                      <td className="text-caption-md px-5 py-3 text-text-secondary">
                        {order.paidAt ? formatDate(order.paidAt) : '-'}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {/* 모바일 카드 */}
        <div className="space-y-3 p-4 md:hidden">
          {isLoading ? (
            <p className="py-8 text-center text-text-muted">로딩 중...</p>
          ) : data?.data.length === 0 ? (
            <p className="py-8 text-center text-text-muted">주문이 없습니다</p>
          ) : (
            data?.data.map((order) => {
              const status = STATUS_MAP[order.fulfillmentStatus]
              return (
                <div
                  key={order.id}
                  className="rounded-lg border border-border bg-card-bg p-4"
                >
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-body-md font-medium text-text-primary">
                      {order.productName}
                    </span>
                    <Badge variant={status.variant}>{status.label}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-caption-sm font-mono text-text-muted">
                      {order.productOrderId}
                    </span>
                    <span className="text-caption-md text-text-secondary">
                      {order.paidAt ? formatDate(order.paidAt) : '-'}
                    </span>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </CardBody>
      <CardFooter>
        <Link href="/orders" className="text-caption-md text-brand hover:underline">
          주문 관리 페이지에서 전체 보기 →
        </Link>
      </CardFooter>
    </Card>
  )
}
