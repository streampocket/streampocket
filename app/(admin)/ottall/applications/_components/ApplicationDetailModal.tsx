'use client'

import { Modal } from '@/components/ui/Modal'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import type { BadgeVariant } from '@/components/ui/Badge'
import type { PartyApplicationStatus } from '@/types/domain'
import { useAdminApplicationDetail } from '../_hooks/useAdminApplicationDetail'
import { useApproveApplication } from '../_hooks/useApproveApplication'
import { useRejectApplication } from '../_hooks/useRejectApplication'

type ApplicationDetailModalProps = {
  applicationId: string | null
  onClose: () => void
}

const STATUS_BADGE: Record<PartyApplicationStatus, { variant: BadgeVariant; label: string }> = {
  pending: { variant: 'yellow', label: '대기' },
  confirmed: { variant: 'green', label: '확정' },
  cancelled: { variant: 'red', label: '거절' },
  expired: { variant: 'gray', label: '만료' },
}

function formatDateTime(dateStr: string): string {
  return new Date(dateStr).toLocaleString('ko-KR', {
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

export function ApplicationDetailModal({ applicationId, onClose }: ApplicationDetailModalProps) {
  const { data: detail, isLoading } = useAdminApplicationDetail(applicationId)
  const approveMutation = useApproveApplication()
  const rejectMutation = useRejectApplication()

  const handleApprove = () => {
    if (!applicationId) return
    if (!confirm('이 신청을 승인하시겠습니까? 승인 시점부터 이용 기간이 시작됩니다.')) return
    approveMutation.mutate(applicationId, { onSuccess: onClose })
  }

  const handleReject = () => {
    if (!applicationId) return
    if (!confirm('이 신청을 거절하시겠습니까? 슬롯이 원복됩니다.')) return
    rejectMutation.mutate(applicationId, { onSuccess: onClose })
  }

  return (
    <Modal isOpen={!!applicationId} onClose={onClose} title="신청 상세">
      {isLoading || !detail ? (
        <div className="py-10 text-center">
          <p className="text-body-md text-text-muted">로딩 중...</p>
        </div>
      ) : (
        <div className="space-y-5">
          {/* 상태 */}
          <div className="flex items-center gap-2">
            <span className="text-body-md text-text-muted">상태</span>
            <Badge variant={STATUS_BADGE[detail.status].variant}>
              {STATUS_BADGE[detail.status].label}
            </Badge>
          </div>

          {/* 신청자 */}
          <section className="space-y-2">
            <h3 className="text-body-md font-semibold text-text-primary">신청자 정보</h3>
            <InfoRow label="이름" value={detail.user.name} />
            <InfoRow label="이메일" value={detail.user.email} />
            <InfoRow label="연락처" value={detail.user.phone} />
          </section>

          {/* 파티 */}
          <section className="space-y-2">
            <h3 className="text-body-md font-semibold text-text-primary">파티 정보</h3>
            <InfoRow label="파티명" value={detail.product.name} />
            <InfoRow label="카테고리" value={detail.product.category.name} />
            <InfoRow label="이용 기간" value={`${detail.product.durationDays}일`} />
            <InfoRow
              label="모집 현황"
              value={`${detail.product.filledSlots}/${detail.product.totalSlots}명`}
            />
          </section>

          {/* 금액 */}
          <section className="space-y-2">
            <h3 className="text-body-md font-semibold text-text-primary">금액</h3>
            <div className="grid grid-cols-3 gap-2 rounded-lg bg-gray-50 p-3 text-center">
              <div>
                <p className="text-caption-md text-text-muted">가격</p>
                <p className="text-body-md font-semibold text-text-primary">
                  {formatPrice(detail.price)}원
                </p>
              </div>
              <div>
                <p className="text-caption-md text-text-muted">수수료</p>
                <p className="text-body-md font-semibold text-text-primary">
                  {formatPrice(detail.fee)}원
                </p>
              </div>
              <div>
                <p className="text-caption-md text-text-muted">합계</p>
                <p className="text-body-md font-semibold text-brand">
                  {formatPrice(detail.totalAmount)}원
                </p>
              </div>
            </div>
          </section>

          {/* 일정 */}
          <section className="space-y-2">
            <h3 className="text-body-md font-semibold text-text-primary">일정</h3>
            <InfoRow label="신청일시" value={formatDateTime(detail.createdAt)} />
            {detail.startedAt && (
              <InfoRow label="시작일시" value={formatDateTime(detail.startedAt)} />
            )}
            {detail.expiresAt && (
              <InfoRow label="만료일시" value={formatDateTime(detail.expiresAt)} />
            )}
          </section>

          {/* 액션 (대기 상태에서만) */}
          {detail.status === 'pending' && (
            <div className="flex justify-end gap-2 border-t border-border pt-4">
              <Button
                variant="danger"
                loading={rejectMutation.isPending}
                disabled={approveMutation.isPending}
                onClick={handleReject}
              >
                거절
              </Button>
              <Button
                variant="primary"
                loading={approveMutation.isPending}
                disabled={rejectMutation.isPending}
                onClick={handleApprove}
              >
                승인
              </Button>
            </div>
          )}
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
