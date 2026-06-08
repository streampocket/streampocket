'use client'

import Link from 'next/link'
import { Card, CardHeader, CardBody, CardFooter } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import type { BadgeVariant } from '@/components/ui/Badge'
import { useOrders } from '@/hooks/useOrders'
import { formatDate } from '@/lib/utils'
import type { SteamOrderItem, FulfillmentStatus, Store } from '@/types/domain'
import { useStoreParam } from '@/hooks/useStoreParam'

const STATUS_MAP: Record<FulfillmentStatus, { label: string; variant: BadgeVariant }> = {
  pending: { label: '대기', variant: 'yellow' },
  in_progress: { label: '진행중', variant: 'indigo' },
  completed: { label: '완료', variant: 'green' },
  purchase_decided: { label: '구매확정', variant: 'blue' },
  manual_review: { label: '수동처리', variant: 'red' },
  failed: { label: '실패', variant: 'gray' },
  returned: { label: '반품', variant: 'purple' },
}

// 행 왼쪽 색띠로 스토어 한눈에 구분 — 스트림포켓=파랑, 포켓몬스팀=빨강 (최근주문은 네이버 전용).
// (Tailwind JIT 때문에 클래스 문자열은 리터럴로 둠)
const ROW_ACCENT: Record<Store, string> = {
  streampocket: 'border-l-[#3b82f6]',
  pokemon_steam: 'border-l-[#ef4444]',
}
function rowAccentClass(order: SteamOrderItem): string {
  return `border-l-4 ${ROW_ACCENT[order.store]}`
}

export function RecentOrdersTable() {
  const storeParam = useStoreParam()
  const store: Store | undefined =
    storeParam === 'streampocket' || storeParam === 'pokemon_steam' ? storeParam : undefined
  const { data, isLoading } = useOrders({ page: 1, pageSize: 5, source: 'naver', store })

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
                      <td className={`px-5 py-3 ${rowAccentClass(order)}`}>
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
                  className={`rounded-lg border border-border bg-card-bg p-4 ${rowAccentClass(order)}`}
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
