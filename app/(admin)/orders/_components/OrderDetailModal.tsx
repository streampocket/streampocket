'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/Badge'
import type { BadgeVariant } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { formatDate, cn } from '@/lib/utils'
import { isAaProduct } from '@/lib/productType'
import type { DeliveryLogStatus, FulfillmentStatus, SteamOrderItem } from '@/types/domain'
import { useAlimtalkTemplates } from '@/hooks/useAlimtalkTemplates'
import { useOrderDetail } from '../_hooks/useOrderDetail'
import { useRetryOrder } from '../_hooks/useRetryOrder'
import { useManualReturn } from '../_hooks/useManualReturn'
import { useSendReviewGame } from '../_hooks/useSendReviewGame'
import { useUpdateFriendLinks } from '../_hooks/useUpdateFriendLinks'
import { useMarkGiftCompleted } from '../_hooks/useMarkGiftCompleted'

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
  returned: { label: '반품', variant: 'purple' },
}

const REVIEW_GAME_PATTERN = /(\d+)\s*\+\s*(\d+)/

function parseReviewGameCount(productName: string): number | null {
  const match = productName.match(REVIEW_GAME_PATTERN)
  if (!match) return null
  const count = Number(match[2])
  return count > 0 ? count : null
}

const giftInputClass = cn(
  'w-full rounded-lg border border-border bg-white px-3 py-2',
  'text-body-md text-text-primary placeholder:text-text-muted',
  'outline-none transition-colors focus:border-brand focus:ring-2 focus:ring-brand-light',
)

function GiftSection({ order }: { order: SteamOrderItem }) {
  const [link1, setLink1] = useState(order.friendLink1 ?? '')
  const [link2, setLink2] = useState(order.friendLink2 ?? '')
  const { mutate: updateLinks, isPending: isSaving } = useUpdateFriendLinks()
  const { mutate: markCompleted, isPending: isCompleting } = useMarkGiftCompleted()

  useEffect(() => {
    setLink1(order.friendLink1 ?? '')
    setLink2(order.friendLink2 ?? '')
  }, [order.friendLink1, order.friendLink2])

  const normalized1 = link1.trim()
  const normalized2 = link2.trim()
  const isDirty =
    normalized1 !== (order.friendLink1 ?? '') || normalized2 !== (order.friendLink2 ?? '')

  const handleCopy = async (value: string) => {
    if (!value) return
    try {
      await navigator.clipboard.writeText(value)
      toast.success('복사되었습니다.')
    } catch {
      toast.error('복사에 실패했습니다.')
    }
  }

  const handleSave = () => {
    updateLinks({
      id: order.id,
      friendLink1: normalized1 ? normalized1 : null,
      friendLink2: normalized2 ? normalized2 : null,
    })
  }

  const handleComplete = () => {
    if (!window.confirm('선물 접수 완료 처리하시겠습니까? 되돌릴 수 없습니다.')) return
    markCompleted(order.id)
  }

  return (
    <div className="space-y-3 rounded-lg border border-border bg-surface-secondary p-3">
      <div className="flex items-center justify-between">
        <p className="text-caption-md font-semibold text-text-primary">선물 처리 (AA)</p>
        {order.giftCompletedAt ? (
          <Badge variant="green">선물 접수 완료 ({formatDate(order.giftCompletedAt)})</Badge>
        ) : (
          <Button
            size="sm"
            variant="primary"
            loading={isCompleting}
            onClick={handleComplete}
          >
            선물 접수 완료
          </Button>
        )}
      </div>

      {[
        { idx: 1, value: link1, setValue: setLink1, saved: order.friendLink1 },
        { idx: 2, value: link2, setValue: setLink2, saved: order.friendLink2 },
      ].map(({ idx, value, setValue, saved }) => (
        <div key={idx}>
          <label className="text-caption-md mb-1 block text-text-muted">친구 추가 링크 {idx}</label>
          <div className="flex gap-2">
            <input
              className={giftInputClass}
              placeholder="https://..."
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
            <Button
              size="sm"
              variant="secondary"
              disabled={!saved}
              onClick={() => saved && handleCopy(saved)}
            >
              복사
            </Button>
            <Button
              size="sm"
              variant="secondary"
              disabled={!value}
              onClick={() => setValue('')}
            >
              ✕
            </Button>
          </div>
        </div>
      ))}

      <div className="flex justify-end">
        <Button
          size="sm"
          variant="primary"
          disabled={!isDirty}
          loading={isSaving}
          onClick={handleSave}
        >
          저장
        </Button>
      </div>
    </div>
  )
}

export function OrderDetailModal({ orderId, onClose }: OrderDetailModalProps) {
  const { data: order, isLoading } = useOrderDetail(orderId)
  const { data: alimtalkTemplates } = useAlimtalkTemplates()
  const { mutate: retry, isPending: isRetrying } = useRetryOrder()
  const { mutate: manualReturn, isPending: isReturning } = useManualReturn()
  const { mutate: sendReviewGame, isPending: isSendingReviewGame } = useSendReviewGame()

  const resolveTemplateName = (code: string | null): string | null => {
    if (!code) return null
    const found = alimtalkTemplates?.find((template) => template.templateCode === code)
    return found?.templateName ?? null
  }

  const status = order ? STATUS_MAP[order.fulfillmentStatus] : null
  const canRetry =
    order?.fulfillmentStatus === 'manual_review' || order?.fulfillmentStatus === 'failed'
  const canReturn =
    order?.fulfillmentStatus === 'completed' ||
    order?.fulfillmentStatus === 'manual_review' ||
    order?.fulfillmentStatus === 'failed'

  const reviewGameCount = order ? parseReviewGameCount(order.productName) : null
  const canSendReviewGame =
    order?.fulfillmentStatus === 'completed' &&
    order.decisionDate !== null &&
    order.reviewGameSentAt === null &&
    reviewGameCount !== null

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
          {canReturn && (
            <Button
              variant="danger"
              loading={isReturning}
              onClick={() => {
                if (order && window.confirm('이 주문을 반품 처리하시겠습니까?')) {
                  manualReturn(order.id)
                }
              }}
            >
              반품 처리
            </Button>
          )}
          {canSendReviewGame && (
            <Button
              variant="primary"
              loading={isSendingReviewGame}
              onClick={() => {
                if (order && window.confirm(`리뷰게임 코드 ${reviewGameCount}개를 발송하시겠습니까?`)) {
                  sendReviewGame(order.id)
                }
              }}
            >
              리뷰게임 발송 ({reviewGameCount}개)
            </Button>
          )}
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
              <dt className="text-caption-md text-text-muted">수신자명</dt>
              <dd className="mt-0.5 text-caption-md text-text-primary">
                {order.receiverName ?? <span className="text-danger">이름 미확인</span>}
              </dd>
            </div>
            <div>
              <dt className="text-caption-md text-text-muted">수신전화번호</dt>
              <dd className="mt-0.5 text-caption-md text-text-primary">
                {order.receiverPhoneNumber ?? <span className="text-danger">전화번호 미확인</span>}
              </dd>
            </div>
            <div>
              <dt className="text-caption-md text-text-muted">결제금액</dt>
              <dd className="mt-0.5 text-caption-md text-text-primary">
                {order.unitPrice.toLocaleString()}원
              </dd>
            </div>
            <div>
              <dt className="text-caption-md text-text-muted">정산금</dt>
              <dd className="mt-0.5 text-caption-md text-text-primary">
                {order.settlementAmount != null
                  ? `${order.settlementAmount.toLocaleString()}원`
                  : '-'}
              </dd>
            </div>
            <div>
              <dt className="text-caption-md text-text-muted">결제일시</dt>
              <dd className="mt-0.5 text-caption-md text-text-secondary">
                {order.paidAt ? formatDate(order.paidAt) : '-'}
              </dd>
            </div>
            <div>
              <dt className="text-caption-md text-text-muted">구매확정일</dt>
              <dd className="mt-0.5 text-caption-md text-text-secondary">
                {order.decisionDate ? formatDate(order.decisionDate) : '대기중'}
              </dd>
            </div>
            <div>
              <dt className="text-caption-md text-text-muted">최종 수정</dt>
              <dd className="mt-0.5 text-caption-md text-text-secondary">
                {formatDate(order.updatedAt)}
              </dd>
            </div>
            {order.returnedAt && (
              <div>
                <dt className="text-caption-md text-text-muted">반품일시</dt>
                <dd className="mt-0.5 text-caption-md text-text-secondary">
                  {formatDate(order.returnedAt)}
                </dd>
              </div>
            )}
            {reviewGameCount !== null && (
              <div>
                <dt className="text-caption-md text-text-muted">리뷰게임</dt>
                <dd className="mt-0.5 text-caption-md">
                  {order.reviewGameSentAt ? (
                    <Badge variant="green">발송 완료 ({formatDate(order.reviewGameSentAt)})</Badge>
                  ) : (
                    <Badge variant="yellow">미발송 ({reviewGameCount}개)</Badge>
                  )}
                </dd>
              </div>
            )}
          </dl>

          {isAaProduct(order.productName) && <GiftSection order={order} />}

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
                    const templateName = resolveTemplateName(log.templateCode)
                    const templateLabel = log.templateCode
                      ? templateName
                        ? `${templateName} (${log.templateCode})`
                        : log.templateCode
                      : null

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
                        {templateLabel && (
                          <p className="text-caption-md font-medium text-text-primary">
                            {templateLabel}
                          </p>
                        )}
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
