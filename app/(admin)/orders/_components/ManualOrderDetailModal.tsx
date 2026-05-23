'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/Badge'
import type { BadgeVariant } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { cn, formatDate } from '@/lib/utils'
import type { FulfillmentStatus } from '@/types/domain'
import { useOrderDetail } from '../_hooks/useOrderDetail'
import { useMarkInProgress } from '../_hooks/useMarkInProgress'
import { useExtendOrderTime } from '../_hooks/useExtendOrderTime'
import { useCompleteOrder } from '../_hooks/useCompleteOrder'
import { useManualReturn } from '../_hooks/useManualReturn'
import { GiftSection } from './GiftSection'

type ManualOrderDetailModalProps = {
  orderId: string | null
  onClose: () => void
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

export function ManualOrderDetailModal({ orderId, onClose }: ManualOrderDetailModalProps) {
  const { data: order, isLoading } = useOrderDetail(orderId)
  const { mutate: markInProgress, isPending: isMarkingInProgress } = useMarkInProgress()
  const { mutate: extendTime, isPending: isExtendingTime } = useExtendOrderTime()
  const { mutate: complete, isPending: isCompleting } = useCompleteOrder()
  const { mutate: manualReturn, isPending: isReturning } = useManualReturn()

  const [activeTab, setActiveTab] = useState<'input' | 'status'>('input')

  useEffect(() => {
    setActiveTab('input')
  }, [orderId])

  const status = order ? STATUS_MAP[order.fulfillmentStatus] : null
  const canMarkInProgress = order?.fulfillmentStatus === 'pending'
  const canExtendTime =
    order?.fulfillmentStatus === 'in_progress' && order.estimatedCompletedAt !== null
  const canComplete =
    order != null &&
    order.completedAt === null &&
    (order.fulfillmentStatus === 'pending' || order.fulfillmentStatus === 'in_progress')
  const canReturn = order != null && order.fulfillmentStatus !== 'returned'

  const handleCopyOrderId = async () => {
    if (!order) return
    try {
      await navigator.clipboard.writeText(order.productOrderId)
      toast.success('상품주문번호가 복사되었습니다.')
    } catch {
      toast.error('복사에 실패했습니다.')
    }
  }

  return (
    <Modal
      isOpen={orderId !== null}
      onClose={onClose}
      title="수동 주문 상세"
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

          <div className="flex gap-1">
            {(
              [
                { v: 'input', l: '입력/저장' },
                { v: 'status', l: '상태' },
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

          {/* 입력/저장 — 네이버 상세 모달과 동일 (전화번호 없어 알림톡 버튼 제외) */}
          <div className={cn(activeTab !== 'input' && 'hidden')}>
            <GiftSection order={order} title="선물 처리" showOrderStatusAlimtalk={false} />
          </div>

          {/* 상태 — 수동 주문 정보만 표시 */}
          <div className={cn(activeTab !== 'status' && 'hidden')}>
            <dl className="grid grid-cols-2 gap-x-4 gap-y-3">
              <div className="col-span-2">
                <dt className="text-caption-md text-text-muted">상품주문번호</dt>
                <dd className="mt-0.5 flex items-center gap-2">
                  <span className="font-mono text-caption-md text-text-secondary">
                    {order.productOrderId}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyOrderId}
                    className="text-caption-sm rounded-md bg-gray-100 px-2 py-0.5 text-text-secondary hover:bg-gray-200"
                  >
                    복사
                  </button>
                </dd>
              </div>
              <div>
                <dt className="text-caption-md text-text-muted">상품명</dt>
                <dd className="mt-0.5 text-caption-md text-text-primary">{order.productName}</dd>
              </div>
              <div>
                <dt className="text-caption-md text-text-muted">수신자명</dt>
                <dd className="mt-0.5 text-caption-md text-text-primary">
                  {order.receiverName ?? <span className="text-danger">이름 미확인</span>}
                </dd>
              </div>
              <div>
                <dt className="text-caption-md text-text-muted">순수익</dt>
                <dd className="mt-0.5 text-caption-md text-text-primary">
                  {(order.settlementAmount ?? 0).toLocaleString()}원
                </dd>
              </div>
              <div>
                <dt className="text-caption-md text-text-muted">상태</dt>
                <dd className="mt-0.5 text-caption-md">
                  {status && <Badge variant={status.variant}>{status.label}</Badge>}
                </dd>
              </div>
              <div>
                <dt className="text-caption-md text-text-muted">결제일시</dt>
                <dd className="mt-0.5 text-caption-md text-text-secondary">
                  {order.paidAt ? formatDate(order.paidAt) : '-'}
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
              {order.returnedAt && (
                <div>
                  <dt className="text-caption-md text-text-muted">반품일시</dt>
                  <dd className="mt-0.5 text-caption-md text-text-secondary">
                    {formatDate(order.returnedAt)}
                  </dd>
                </div>
              )}
            </dl>
          </div>
        </div>
      ) : null}
    </Modal>
  )
}
