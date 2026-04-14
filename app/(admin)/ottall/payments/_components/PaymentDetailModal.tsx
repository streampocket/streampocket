'use client'

import { useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import type { BadgeVariant } from '@/components/ui/Badge'
import type { PaymentStatus, PaymentMethod } from '@/types/domain'
import { useAdminPaymentDetail } from '../_hooks/useAdminPaymentDetail'
import { useApprovePayment } from '../_hooks/useApprovePayment'
import { useRejectPayment } from '../_hooks/useRejectPayment'
import { useDeletePayment } from '../_hooks/useDeletePayment'

type PaymentDetailModalProps = {
  paymentId: string | null
  onClose: () => void
}

const STATUS_BADGE: Record<PaymentStatus, { variant: BadgeVariant; label: string }> = {
  pending: { variant: 'yellow', label: '대기중' },
  paid: { variant: 'green', label: '완료' },
  cancelled: { variant: 'red', label: '취소' },
}

const METHOD_LABEL: Record<PaymentMethod, string> = {
  manual: '수동 입금 확인',
  pg: 'PG 결제',
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Seoul',
  })
}

function formatPrice(amount: number): string {
  return amount.toLocaleString('ko-KR')
}

export function PaymentDetailModal({ paymentId, onClose }: PaymentDetailModalProps) {
  const { data: payment, isLoading } = useAdminPaymentDetail(paymentId)
  const approveMutation = useApprovePayment()
  const rejectMutation = useRejectPayment()
  const deleteMutation = useDeletePayment()
  const [rejectNote, setRejectNote] = useState('')
  const [showRejectForm, setShowRejectForm] = useState(false)
  const [confirmApprove, setConfirmApprove] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  const handleApprove = () => {
    if (!paymentId) return
    if (!confirmApprove) {
      setConfirmApprove(true)
      return
    }
    approveMutation.mutate(
      { id: paymentId },
      {
        onSuccess: () => {
          setConfirmApprove(false)
          onClose()
        },
      },
    )
  }

  const handleReject = () => {
    if (!paymentId) return
    rejectMutation.mutate(
      { id: paymentId, adminNote: rejectNote || undefined },
      {
        onSuccess: () => {
          setShowRejectForm(false)
          setRejectNote('')
          onClose()
        },
      },
    )
  }

  const handleDelete = () => {
    if (!paymentId) return
    if (!confirmDelete) {
      setConfirmDelete(true)
      return
    }
    deleteMutation.mutate(
      { id: paymentId },
      {
        onSuccess: () => {
          setConfirmDelete(false)
          onClose()
        },
      },
    )
  }

  const handleClose = () => {
    onClose()
    setShowRejectForm(false)
    setRejectNote('')
    setConfirmApprove(false)
    setConfirmDelete(false)
  }

  const isPending = payment?.status === 'pending'
  const isManual = payment?.method === 'manual'

  const deleteSection = isManual ? (
    <div className="flex w-full flex-col gap-2 border-t border-border pt-3">
      {confirmDelete ? (
        <div className="flex flex-col gap-2">
          {payment?.status === 'paid' && (
            <p className="text-caption-md text-warning">
              승인된 결제를 삭제하면 파티 슬롯이 복원됩니다.
            </p>
          )}
          <div className="flex items-center gap-2">
            <p className="text-caption-md text-text-secondary">정말 삭제하시겠습니까?</p>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setConfirmDelete(false)}
            >
              취소
            </Button>
            <Button
              variant="danger"
              size="sm"
              loading={deleteMutation.isPending}
              onClick={handleDelete}
            >
              삭제 확인
            </Button>
          </div>
        </div>
      ) : (
        <Button variant="danger" size="sm" onClick={handleDelete}>
          삭제
        </Button>
      )}
    </div>
  ) : null

  return (
    <Modal
      isOpen={!!paymentId}
      onClose={handleClose}
      title="결제 상세"
      footer={
        <div className="flex w-full flex-col gap-3">
          {isPending && (
            <div className="flex w-full flex-col gap-2 sm:flex-row sm:justify-end">
              {showRejectForm ? (
                <div className="flex w-full flex-col gap-2">
                  <textarea
                    placeholder="거절 사유 (선택)"
                    value={rejectNote}
                    onChange={(e) => setRejectNote(e.target.value)}
                    rows={2}
                    className="text-body-md w-full rounded-lg border border-border bg-card-bg px-3 py-2 text-text-primary placeholder:text-text-muted focus:border-brand focus:outline-none"
                  />
                  <div className="flex gap-2 self-end">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setShowRejectForm(false)}
                    >
                      취소
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      loading={rejectMutation.isPending}
                      onClick={handleReject}
                    >
                      거절 확인
                    </Button>
                  </div>
                </div>
              ) : confirmApprove ? (
                <div className="flex items-center gap-2">
                  <p className="text-caption-md text-text-secondary">결제를 승인하시겠습니까?</p>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setConfirmApprove(false)}
                  >
                    취소
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    loading={approveMutation.isPending}
                    onClick={handleApprove}
                  >
                    승인 확인
                  </Button>
                </div>
              ) : (
                <>
                  <Button variant="primary" onClick={handleApprove}>
                    승인
                  </Button>
                  <Button variant="danger" onClick={() => setShowRejectForm(true)}>
                    거절
                  </Button>
                </>
              )}
            </div>
          )}
          {deleteSection}
        </div>
      }
    >
      {isLoading || !payment ? (
        <div className="py-10 text-center">
          <p className="text-body-md text-text-muted">로딩 중...</p>
        </div>
      ) : (
        <div className="space-y-5">
          {/* 결제 정보 */}
          <section className="space-y-2">
            <h3 className="text-body-md font-semibold text-text-primary">결제 정보</h3>
            <InfoRow label="금액" value={`${formatPrice(payment.application.price)}원`} />
            <InfoRow label="수수료" value={`${formatPrice(payment.application.fee)}원`} />
            <InfoRow label="합계" value={`${formatPrice(payment.amount)}원`} />
            <InfoRow label="결제방법" value={METHOD_LABEL[payment.method]} />
            <div className="flex items-center gap-3">
              <span className="text-body-md w-20 shrink-0 text-text-muted">상태</span>
              <Badge variant={STATUS_BADGE[payment.status].variant}>
                {STATUS_BADGE[payment.status].label}
              </Badge>
            </div>
            {payment.paidAt && (
              <InfoRow label="결제일" value={formatDate(payment.paidAt)} />
            )}
            {payment.adminNote && (
              <InfoRow label="관리자 메모" value={payment.adminNote} />
            )}
            <InfoRow label="신청일" value={formatDate(payment.createdAt)} />
          </section>

          {/* 신청자 정보 */}
          <section className="space-y-2">
            <h3 className="text-body-md font-semibold text-text-primary">신청자 정보</h3>
            <InfoRow label="이름" value={payment.application.user.name} />
            <InfoRow label="이메일" value={payment.application.user.email} />
            <InfoRow label="연락처" value={payment.application.user.phone} />
          </section>

          {/* 파티 정보 */}
          <section className="space-y-2">
            <h3 className="text-body-md font-semibold text-text-primary">파티 정보</h3>
            <InfoRow label="파티명" value={payment.application.product.name} />
            <InfoRow label="파티장" value={payment.application.product.user.name} />
            <InfoRow
              label="모집 현황"
              value={`${payment.application.product.filledSlots}/${payment.application.product.totalSlots}명`}
            />
          </section>
        </div>
      )}
    </Modal>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-body-md w-20 shrink-0 text-text-muted">{label}</span>
      <span className="text-body-md text-text-primary">{value}</span>
    </div>
  )
}
