'use client'

import { Badge } from '@/components/ui/Badge'
import type { BadgeVariant } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { formatDate } from '@/lib/utils'
import type { DeliveryLogStatus, FulfillmentStatus } from '@/types/domain'
import { useOrderDetail } from '../_hooks/useOrderDetail'
import { useRetryOrder } from '../_hooks/useRetryOrder'

type OrderDetailModalProps = {
  orderId: string | null
  onClose: () => void
}

const DELIVERY_STATUS_MAP: Record<DeliveryLogStatus, { label: string; variant: BadgeVariant }> = {
  queued: { label: '대기', variant: 'yellow' },
  sent: { label: '발송 완료', variant: 'green' },
  failed: { label: '발송 실패', variant: 'red' },
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
                if (order) {
                  retry(order.id)
                }
              }}
            >
              알림톡 재발송
            </Button>
          )}
        </>
      }
    >
      {isLoading ? (
        <p className="py-8 text-center text-caption-md text-text-muted">로딩 중...</p>
      ) : order ? (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-body-md font-semibold text-text-primary">{order.productName}</span>
            {status && <Badge variant={status.variant}>{status.label}</Badge>}
          </div>

          <dl className="grid grid-cols-2 gap-x-4 gap-y-3">
            <div>
              <dt className="text-caption-md text-text-muted">상품주문번호</dt>
              <dd className="mt-0.5 font-mono text-caption-md text-text-secondary">
                {order.productOrderId}
              </dd>
            </div>
            <div>
              <dt className="text-caption-md text-text-muted">네이버 주문번호</dt>
              <dd className="mt-0.5 font-mono text-caption-md text-text-secondary">
                {order.naverOrderId}
              </dd>
            </div>
            <div>
              <dt className="text-caption-md text-text-muted">수신전화번호</dt>
              <dd className="mt-0.5 text-caption-md text-text-primary">
                {order.receiverPhoneNumber ?? <span className="text-danger">전화번호 미확인</span>}
              </dd>
            </div>
            <div>
              <dt className="text-caption-md text-text-muted">수신자명</dt>
              <dd className="mt-0.5 text-caption-md text-text-primary">{order.receiverName ?? '-'}</dd>
            </div>
            <div>
              <dt className="text-caption-md text-text-muted">결제금액</dt>
              <dd className="mt-0.5 text-caption-md text-text-primary">
                {order.unitPrice.toLocaleString()}원
              </dd>
            </div>
            <div>
              <dt className="text-caption-md text-text-muted">결제일시</dt>
              <dd className="mt-0.5 text-caption-md text-text-secondary">
                {order.paidAt ? formatDate(order.paidAt) : '-'}
              </dd>
            </div>
            <div>
              <dt className="text-caption-md text-text-muted">최종 수정</dt>
              <dd className="mt-0.5 text-caption-md text-text-secondary">
                {formatDate(order.updatedAt)}
              </dd>
            </div>
          </dl>

          {order.errorMessage && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3">
              <p className="text-caption-md font-semibold text-danger">오류 사유</p>
              <p className="mt-1 text-caption-md text-text-primary">{order.errorMessage}</p>
            </div>
          )}

          {order.deliveryLogs && order.deliveryLogs.length > 0 && (
            <div>
              <p className="mb-2 text-caption-md font-semibold text-text-primary">알림톡 발송 이력</p>
              <div className="space-y-2">
                {[...order.deliveryLogs]
                  .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                  .map((log) => {
                    const deliveryStatus = DELIVERY_STATUS_MAP[log.status]

                    return (
                      <div
                        key={log.id}
                        className="space-y-1 rounded-lg border border-border bg-surface-secondary p-3"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-mono text-caption-md text-text-secondary">
                            {log.recipient}
                          </span>
                          <Badge variant={deliveryStatus.variant}>{deliveryStatus.label}</Badge>
                        </div>
                        <p className="text-caption-md text-text-muted">
                          {log.sentAt ? formatDate(log.sentAt) : formatDate(log.createdAt)}
                        </p>
                        {log.providerMessageId && (
                          <p className="text-caption-md text-text-muted">
                            메시지 ID: {log.providerMessageId}
                          </p>
                        )}
                        {log.errorMessage && (
                          <p className="text-caption-md text-danger">{log.errorMessage}</p>
                        )}
                      </div>
                    )
                  })}
              </div>
            </div>
          )}
        </div>
      ) : null}
    </Modal>
  )
}
