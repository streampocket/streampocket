'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Card, CardBody, CardFooter } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import type { BadgeVariant } from '@/components/ui/Badge'
import { ExportButton } from './ExportButton'
import { OrderDetailModal } from './OrderDetailModal'
import { ManualOrderCreateModal } from './ManualOrderCreateModal'
import { ManualOrderDetailModal } from './ManualOrderDetailModal'
import { useOrders } from '@/hooks/useOrders'
import { formatDate } from '@/lib/utils'
import { PAGE_SIZE } from '@/constants/app'
import type { FulfillmentStatus, OrderSource, SteamOrderItem, Store } from '@/types/domain'

const STATUS_MAP: Record<FulfillmentStatus, { label: string; variant: BadgeVariant }> = {
  pending: { label: '대기', variant: 'yellow' },
  in_progress: { label: '진행중', variant: 'pink' },
  completed: { label: '완료', variant: 'green' },
  purchase_decided: { label: '구매확정', variant: 'blue' },
  manual_review: { label: '수동처리', variant: 'red' },
  failed: { label: '실패', variant: 'gray' },
  returned: { label: '반품', variant: 'purple' },
}

type SelectedOrder = { id: string; source: OrderSource }

// 행 왼쪽 색띠로 출처/스토어 한눈에 구분 — 수동=노랑, 파티=보라, 스트림포켓=파랑, 포켓몬스팀=빨강.
// (Tailwind JIT 때문에 클래스 문자열은 리터럴로 둠)
const ROW_ACCENT: Record<'manual' | 'party' | Store, string> = {
  manual: 'border-l-[#FEE500]',
  party: 'border-l-[#a855f7]',
  streampocket: 'border-l-[#3b82f6]',
  pokemon_steam: 'border-l-[#ef4444]',
}
function rowAccentClass(order: SteamOrderItem): string {
  // 수동=노랑, 파티=보라. 네이버는 항상 store 값이 있으나 타입(Store|null) 충족 위해 streampocket 폴백.
  const key =
    order.source === 'manual'
      ? 'manual'
      : order.source === 'party'
        ? 'party'
        : order.store ?? 'streampocket'
  return `border-l-4 ${ROW_ACCENT[key]}`
}

// 상품주문번호 — 수동 주문은 카카오 노란색, 파티 주문은 보라색 배지로 구분
function ProductOrderId({ order }: { order: SteamOrderItem }) {
  if (order.source === 'party') {
    return (
      <span className="inline-block rounded bg-[#a855f7] px-1.5 py-0.5 font-mono text-caption-sm font-semibold text-white">
        {order.productOrderId}
      </span>
    )
  }
  if (order.source === 'manual') {
    return (
      <span className="inline-block rounded bg-[#FEE500] px-1.5 py-0.5 font-mono text-caption-sm font-semibold text-[#3C1E1E]">
        {order.productOrderId}
      </span>
    )
  }
  return (
    <span className="font-mono text-caption-md text-text-secondary">{order.productOrderId}</span>
  )
}

export function OrdersTable() {
  const searchParams = useSearchParams()
  const [selected, setSelected] = useState<SelectedOrder | null>(null)
  const [createOpen, setCreateOpen] = useState(false)

  const status = (searchParams.get('status') as FulfillmentStatus) || undefined
  const from = searchParams.get('from') || undefined
  const to = searchParams.get('to') || undefined
  const receiverName = searchParams.get('receiverName') || undefined
  const store = (searchParams.get('store') as Store) || undefined
  const source = (searchParams.get('source') as OrderSource) || undefined
  const page = Number(searchParams.get('page') ?? 1)

  const { data, isLoading } = useOrders({ status, from, to, receiverName, store, source, page, pageSize: PAGE_SIZE })

  return (
    <>
      <Card>
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <p className="text-caption-md text-text-secondary">
            총 <strong className="text-text-primary">{data?.total ?? 0}</strong>건
          </p>
          <div className="flex items-center gap-2">
            <Button variant="primary" size="sm" onClick={() => setCreateOpen(true)}>
              + 수동 주문 생성
            </Button>
            <ExportButton status={status} from={from} to={to} />
          </div>
        </div>

        <CardBody className="p-0">
          {/* 데스크탑 테이블 */}
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-gray-50">
                  <th className="text-label-md px-5 py-3 text-left text-text-secondary">상품주문번호</th>
                  <th className="text-label-md px-5 py-3 text-left text-text-secondary">상품명</th>
                  <th className="text-label-md px-5 py-3 text-left text-text-secondary">수신자명</th>
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
                        <td className={`px-5 py-3 ${rowAccentClass(order)}`}>
                          <ProductOrderId order={order} />
                        </td>
                        <td className="text-body-md max-w-40 truncate px-5 py-3 text-text-primary">
                          {order.productName}
                        </td>
                        <td className="text-caption-md px-5 py-3 text-text-secondary">
                          {order.receiverName ?? <span className="text-danger">미확인</span>}
                        </td>
                        <td className="text-body-md px-5 py-3 text-text-primary">
                          {order.paymentAmount != null && order.paymentAmount !== order.unitPrice ? (
                            <>
                              <div className="text-caption-sm text-text-muted line-through">
                                {order.unitPrice.toLocaleString()}원
                              </div>
                              <div>{order.paymentAmount.toLocaleString()}원</div>
                            </>
                          ) : (
                            <>{(order.paymentAmount ?? order.unitPrice).toLocaleString()}원</>
                          )}
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
                            onClick={() => setSelected({ id: order.id, source: order.source })}
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

          {/* 모바일 카드 */}
          <div className="space-y-3 p-4 md:hidden">
            {isLoading ? (
              <p className="py-8 text-center text-text-muted">로딩 중...</p>
            ) : data?.data.length === 0 ? (
              <p className="py-8 text-center text-text-muted">주문이 없습니다</p>
            ) : (
              data?.data.map((order) => {
                const orderStatus = STATUS_MAP[order.fulfillmentStatus]
                return (
                  <button
                    key={order.id}
                    type="button"
                    onClick={() => setSelected({ id: order.id, source: order.source })}
                    className={`w-full rounded-lg border border-border ${rowAccentClass(order)} bg-card-bg p-4 text-left transition-colors hover:bg-gray-50`}
                  >
                    <div className="mb-2 flex items-center justify-between gap-2">
                      <span className="text-body-md flex-1 truncate font-medium text-text-primary">
                        {order.productName}
                      </span>
                      <Badge variant={orderStatus.variant}>{orderStatus.label}</Badge>
                    </div>
                    {order.paymentAmount != null && order.paymentAmount !== order.unitPrice ? (
                      <p className="text-body-md font-semibold text-text-primary">
                        <span className="mr-2 text-caption-sm font-normal text-text-muted line-through">
                          {order.unitPrice.toLocaleString()}원
                        </span>
                        {order.paymentAmount.toLocaleString()}원
                      </p>
                    ) : (
                      <p className="text-body-md font-semibold text-text-primary">
                        {(order.paymentAmount ?? order.unitPrice).toLocaleString()}원
                      </p>
                    )}
                    <div className="mt-1 flex items-center justify-between">
                      <span className="text-caption-md text-text-secondary">
                        {order.receiverName ?? '미확인'}
                      </span>
                      <span className="text-caption-md text-text-muted">
                        {order.paidAt ? formatDate(order.paidAt) : '-'}
                      </span>
                    </div>
                    <div className="mt-1">
                      <ProductOrderId order={order} />
                    </div>
                  </button>
                )
              })
            )}
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

      {/* 출처에 따라 상세 모달 분기 — 수동·파티 주문은 동일 모달(순수익 편집·삭제) 재사용 */}
      {selected?.source === 'naver' && (
        <OrderDetailModal orderId={selected.id} onClose={() => setSelected(null)} />
      )}
      {(selected?.source === 'manual' || selected?.source === 'party') && (
        <ManualOrderDetailModal
          orderId={selected.id}
          source={selected.source}
          onClose={() => setSelected(null)}
        />
      )}

      <ManualOrderCreateModal isOpen={createOpen} onClose={() => setCreateOpen(false)} />
    </>
  )
}
