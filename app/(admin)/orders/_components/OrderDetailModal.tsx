'use client'

import { useEffect, useState } from 'react'
import { Badge } from '@/components/ui/Badge'
import type { BadgeVariant } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { formatDate, cn } from '@/lib/utils'
import { isAaProduct, parseReviewGameCount } from '@/lib/productType'
import type { DeliveryLog, DeliveryLogStatus, FulfillmentStatus } from '@/types/domain'
import { useAlimtalkTemplates } from '@/hooks/useAlimtalkTemplates'
import { useOrderDetail } from '../_hooks/useOrderDetail'
import { useRetryOrder } from '../_hooks/useRetryOrder'
import { useMarkInProgress } from '../_hooks/useMarkInProgress'
import { useExtendOrderTime } from '../_hooks/useExtendOrderTime'
import { useCompleteOrder } from '../_hooks/useCompleteOrder'
import { useManualReturn } from '../_hooks/useManualReturn'
import { useSendReviewGame } from '../_hooks/useSendReviewGame'
import { GiftSection } from './GiftSection'
import { AutoFriendLinkSection } from './AutoFriendLinkSection'

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
  in_progress: { label: '진행중', variant: 'pink' },
  completed: { label: '처리 완료', variant: 'green' },
  purchase_decided: { label: '구매확정', variant: 'blue' },
  manual_review: { label: '수동 처리 필요', variant: 'red' },
  failed: { label: '처리 실패', variant: 'gray' },
  returned: { label: '반품', variant: 'purple' },
}

function DeliveryLogItem({
  log,
  templateName,
}: {
  log: DeliveryLog
  templateName: string | null
}) {
  const [expanded, setExpanded] = useState(false)
  const deliveryStatus = DELIVERY_STATUS_MAP[log.status]
  const sentAt = log.sentAt ?? log.createdAt

  return (
    <div className="space-y-1 rounded-lg border border-border bg-surface-secondary p-3">
      <div className="flex items-center justify-between gap-2">
        {templateName ? (
          <span className="min-w-0 flex-1 text-body-md font-semibold text-text-primary">
            {templateName}
          </span>
        ) : log.templateCode ? (
          <span className="min-w-0 flex-1 font-mono text-body-md font-semibold text-text-primary">
            {log.templateCode}
          </span>
        ) : (
          <span className="min-w-0 flex-1 text-body-md font-semibold text-text-muted">
            템플릿 정보 없음
          </span>
        )}
        <Badge variant={deliveryStatus.variant}>{deliveryStatus.label}</Badge>
      </div>
      {templateName && log.templateCode && (
        <p className="text-caption-sm font-mono text-text-muted">{log.templateCode}</p>
      )}
      <p className="text-caption-md text-text-muted">
        <span className="font-mono">{log.recipient}</span>
        {' · '}
        {formatDate(sentAt)}
      </p>
      {log.providerMessageId && (
        <p className="text-caption-md text-text-muted">메시지 ID: {log.providerMessageId}</p>
      )}
      {log.errorMessage && <p className="text-caption-md text-danger">{log.errorMessage}</p>}

      <button
        type="button"
        onClick={() => setExpanded((prev) => !prev)}
        className="flex items-center gap-1 pt-1 text-caption-md text-text-secondary transition-colors hover:text-text-primary"
      >
        <span className="text-[10px]">{expanded ? '▲' : '▼'}</span>
        {expanded ? '발송 내용 닫기' : '발송 내용 보기'}
      </button>
      {expanded && (
        <pre className="mt-1 whitespace-pre-wrap rounded-lg bg-card-bg p-3 text-caption-md text-text-secondary">
          {log.message ?? '저장된 발송 내용이 없습니다.'}
        </pre>
      )}
    </div>
  )
}

export function OrderDetailModal({ orderId, onClose }: OrderDetailModalProps) {
  const { data: order, isLoading } = useOrderDetail(orderId)
  const { data: alimtalkTemplates } = useAlimtalkTemplates()
  const { mutate: retry, isPending: isRetrying } = useRetryOrder()
  const { mutate: markInProgress, isPending: isMarkingInProgress } = useMarkInProgress()
  const { mutate: extendTime, isPending: isExtendingTime } = useExtendOrderTime()
  const { mutate: complete, isPending: isCompleting } = useCompleteOrder()
  const { mutate: manualReturn, isPending: isReturning } = useManualReturn()
  const { mutate: sendReviewGame, isPending: isSendingReviewGame } = useSendReviewGame()

  const [activeTab, setActiveTab] = useState<'input' | 'status' | 'autolink'>('input')

  useEffect(() => {
    setActiveTab('input')
  }, [orderId])

  const resolveTemplateName = (code: string | null): string | null => {
    if (!code) return null
    const found = alimtalkTemplates?.find((template) => template.templateCode === code)
    return found?.templateName ?? null
  }

  const status = order ? STATUS_MAP[order.fulfillmentStatus] : null
  const showTabs = order ? isAaProduct(order.productName) : false
  const canMarkInProgress = order?.fulfillmentStatus === 'pending'
  const canExtendTime =
    order?.fulfillmentStatus === 'in_progress' && order.estimatedCompletedAt !== null
  // 구매자가 먼저 구매확정(purchase_decided)한 주문도 아직 발송완료 전이면 완료 처리 가능
  const canComplete =
    order != null &&
    order.completedAt === null &&
    (order.fulfillmentStatus === 'pending' ||
      order.fulfillmentStatus === 'in_progress' ||
      order.fulfillmentStatus === 'purchase_decided')
  const canRetry =
    order?.fulfillmentStatus === 'manual_review' || order?.fulfillmentStatus === 'failed'
  const canReturn =
    order?.fulfillmentStatus === 'pending' ||
    order?.fulfillmentStatus === 'in_progress' ||
    order?.fulfillmentStatus === 'completed' ||
    order?.fulfillmentStatus === 'purchase_decided' ||
    order?.fulfillmentStatus === 'manual_review' ||
    order?.fulfillmentStatus === 'failed'

  const reviewGameCount = order ? parseReviewGameCount(order.productName) : null
  const canSendReviewGame =
    order?.fulfillmentStatus === 'purchase_decided' &&
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
          {canMarkInProgress && (
            <Button
              variant="secondary"
              loading={isMarkingInProgress}
              onClick={() => {
                if (order && window.confirm('이 주문을 진행중으로 전환하시겠습니까?')) {
                  markInProgress(order.id)
                }
              }}
            >
              진행중으로 전환
            </Button>
          )}
          {canExtendTime && (
            <Button
              variant="secondary"
              loading={isExtendingTime}
              onClick={() => {
                if (order && window.confirm('예상 완료시각을 10분 연장하시겠습니까?')) {
                  extendTime(order.id)
                }
              }}
            >
              +10분
            </Button>
          )}
          {canComplete && (
            <Button
              variant="primary"
              loading={isCompleting}
              onClick={() => {
                if (order && window.confirm('이 주문을 완료 처리하시겠습니까?')) {
                  complete(order.id)
                }
              }}
            >
              완료 처리
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

          {order.fulfillmentStatus === 'in_progress' && order.estimatedCompletedAt && (
            <p className="text-caption-md text-text-secondary">
              예상 완료시각: {formatDate(order.estimatedCompletedAt)}
            </p>
          )}

          {showTabs && (
            <div className="flex gap-1">
              {(
                [
                  { v: 'input', l: '입력/저장' },
                  { v: 'status', l: '상태' },
                  { v: 'autolink', l: '친구링크 자동' },
                ] as const
              ).map((t) => (
                <button
                  key={t.v}
                  type="button"
                  onClick={() => setActiveTab(t.v)}
                  className={cn(
                    'text-body-md shrink-0 rounded-lg px-4 py-2 font-medium transition-colors',
                    activeTab === t.v
                      ? 'bg-brand text-white'
                      : 'bg-gray-100 text-text-secondary hover:bg-gray-200',
                  )}
                >
                  {t.l}
                </button>
              ))}
            </div>
          )}

          {showTabs && (
            <div className={cn(activeTab !== 'input' && 'hidden')}>
              <GiftSection order={order} />
            </div>
          )}

          {showTabs && (
            <div className={cn(activeTab !== 'autolink' && 'hidden')}>
              <AutoFriendLinkSection order={order} />
            </div>
          )}

          <div className={cn('space-y-4', showTabs && activeTab !== 'status' && 'hidden')}>
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
                {order.paymentAmount != null && order.paymentAmount !== order.unitPrice ? (
                  <>
                    <span className="mr-2 text-text-muted line-through">
                      {order.unitPrice.toLocaleString()}원
                    </span>
                    {order.paymentAmount.toLocaleString()}원
                  </>
                ) : (
                  <>{(order.paymentAmount ?? order.unitPrice).toLocaleString()}원</>
                )}
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
              <dt className="text-caption-md text-text-muted">발송완료</dt>
              <dd className="mt-0.5 text-caption-md text-text-secondary">
                {order.completedAt ? (
                  formatDate(order.completedAt)
                ) : (
                  <span className="text-text-muted">미완료</span>
                )}
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

          {!showTabs && isAaProduct(order.productName) && <GiftSection order={order} />}

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
                  .map((log) => (
                    <DeliveryLogItem
                      key={log.id}
                      log={log}
                      templateName={resolveTemplateName(log.templateCode)}
                    />
                  ))}
              </div>
            </div>
          )}
          </div>
        </div>
      ) : null}
    </Modal>
  )
}
