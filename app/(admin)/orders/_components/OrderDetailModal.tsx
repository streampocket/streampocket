'use client'

import { Modal } from '@/components/ui/Modal'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import type { BadgeVariant } from '@/components/ui/Badge'
import { useOrderDetail } from '../_hooks/useOrderDetail'
import { useRetryOrder } from '../_hooks/useRetryOrder'
import { formatDate } from '@/lib/utils'
import type { FulfillmentStatus } from '@/types/domain'

type OrderDetailModalProps = {
  orderId: string | null
  onClose: () => void
}

const STATUS_MAP: Record<FulfillmentStatus, { label: string; variant: BadgeVariant }> = {
  pending: { label: '처리 대기', variant: 'yellow' },
  completed: { label: '처리 완료', variant: 'green' },
  manual_review: { label: '수동 처리 필요', variant: 'red' },
  failed: { label: '처리 실패', variant: 'gray' },
}

export function OrderDetailModal({ orderId, onClose }: OrderDetailModalProps) {
  const { data: order, isLoading } = useOrderDetail(orderId)
  const { mutate: retry, isPending: isRetrying } = useRetryOrder()

  const status = order ? STATUS_MAP[order.fulfillmentStatus] : null
  const canRetry =
    order?.fulfillmentStatus === 'manual_review' || order?.fulfillmentStatus === 'failed'

  return (
    <Modal
      isOpen={orderId !== null}
      onClose={onClose}
      title="주문 상세"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            닫기
          </Button>
          {canRetry && (
            <Button
              variant="primary"
              loading={isRetrying}
              onClick={() => {
                if (order) retry(order.id)
              }}
            >
              재처리
            </Button>
          )}
        </>
      }
    >
      {isLoading ? (
        <p className="text-caption-md py-8 text-center text-text-muted">로딩 중...</p>
      ) : order ? (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-body-md font-semibold text-text-primary">{order.productName}</span>
            {status && <Badge variant={status.variant}>{status.label}</Badge>}
          </div>

          <dl className="grid grid-cols-2 gap-x-4 gap-y-3">
            <div>
              <dt className="text-caption-md text-text-muted">상품주문번호</dt>
              <dd className="font-mono text-caption-md mt-0.5 text-text-secondary">
                {order.productOrderId}
              </dd>
            </div>
            <div>
              <dt className="text-caption-md text-text-muted">네이버 주문번호</dt>
              <dd className="font-mono text-caption-md mt-0.5 text-text-secondary">
                {order.naverOrderId}
              </dd>
            </div>
            <div>
              <dt className="text-caption-md text-text-muted">구매자 이메일</dt>
              <dd className="text-caption-md mt-0.5 text-text-primary">
                {order.buyerEmail ?? <span className="text-danger">이메일 미확인</span>}
              </dd>
            </div>
            <div>
              <dt className="text-caption-md text-text-muted">결제금액</dt>
              <dd className="text-caption-md mt-0.5 text-text-primary">
                {order.unitPrice.toLocaleString()}원
              </dd>
            </div>
            <div>
              <dt className="text-caption-md text-text-muted">결제일시</dt>
              <dd className="text-caption-md mt-0.5 text-text-secondary">
                {order.paidAt ? formatDate(order.paidAt) : '-'}
              </dd>
            </div>
            <div>
              <dt className="text-caption-md text-text-muted">최종 수정</dt>
              <dd className="text-caption-md mt-0.5 text-text-secondary">
                {formatDate(order.updatedAt)}
              </dd>
            </div>
          </dl>

          {order.errorMessage && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3">
              <p className="text-caption-md font-semibold text-danger">오류 사유</p>
              <p className="text-caption-md mt-1 text-text-primary">{order.errorMessage}</p>
            </div>
          )}
        </div>
      ) : null}
    </Modal>
  )
}
