'use client'

import { Modal } from '@/components/ui/Modal'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import type { BadgeVariant } from '@/components/ui/Badge'
import type { PartyApplicationStatus } from '@/types/domain'
import { PARTY_TYPE_META } from '@/constants/app'
import { formatMonthDay } from '@/lib/utils'
import { formatPoint, payableAmount } from '@/lib/points'
import { useAdminRenewalDetail } from '../_hooks/useAdminRenewalDetail'
import { useApproveRenewal, useRejectRenewal } from '../_hooks/useDecideRenewal'
import { AlimtalkLogList, InfoRow } from './ApplicationDetailModal'

type RenewalDetailModalProps = {
  renewalId: string | null
  onClose: () => void
}

// 재구매는 만료(expired)를 쓰지 않는다 — 취소는 거절 또는 반품(returnedAt)
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

/**
 * 재구매(기간 연장) 상세 — 일반 신청 상세와 같은 자리(신청관리)에서 열린다.
 * 정원 확인·계정 배정이 없으므로 자동 배정 영역은 없고, 대신 "지금 만료 → 연장 후 만료"와 경고를 보여준다.
 */
export function RenewalDetailModal({ renewalId, onClose }: RenewalDetailModalProps) {
  const { data: detail, isLoading } = useAdminRenewalDetail(renewalId)
  const approveMutation = useApproveRenewal()
  const rejectMutation = useRejectRenewal()

  const handleApprove = () => {
    if (!renewalId || !detail) return
    const until = detail.extendedTo ? formatDateTime(detail.extendedTo) : '-'
    if (!confirm(`이 재구매를 승인하시겠습니까?\n만료일이 ${until}까지 연장되고 주문이 생성됩니다.`)) return
    approveMutation.mutate(renewalId, { onSuccess: onClose })
  }

  const handleReject = () => {
    if (!renewalId) return
    if (!confirm('이 재구매를 거절하시겠습니까? 사용한 포인트는 반환됩니다.')) return
    rejectMutation.mutate(renewalId, { onSuccess: onClose })
  }

  const statusBadge = detail
    ? detail.status === 'cancelled' && detail.returnedAt
      ? { variant: 'red' as const, label: '반품' }
      : STATUS_BADGE[detail.status]
    : null

  return (
    <Modal isOpen={!!renewalId} onClose={onClose} title="재구매 상세">
      {isLoading || !detail || !statusBadge ? (
        <div className="py-10 text-center">
          <p className="text-body-md text-text-muted">로딩 중...</p>
        </div>
      ) : (
        <div className="space-y-5">
          <div className="flex items-center gap-2">
            <span className="text-body-md text-text-muted">상태</span>
            <Badge variant={statusBadge.variant}>{statusBadge.label}</Badge>
            <Badge variant="blue">재구매</Badge>
          </div>

          <section className="space-y-2">
            <h3 className="text-body-md font-semibold text-text-primary">신청자 정보</h3>
            <InfoRow label="이름" value={detail.user.name} />
            <InfoRow label="이메일" value={detail.user.email} />
            <InfoRow label="연락처" value={detail.user.phone} />
          </section>

          <section className="space-y-2">
            <h3 className="text-body-md font-semibold text-text-primary">파티 정보</h3>
            <InfoRow label="파티명" value={detail.product.name} />
            <div className="flex items-center gap-3">
              <span className="text-body-md w-20 shrink-0 text-text-muted">타입</span>
              <Badge variant={(PARTY_TYPE_META[detail.product.partyType] ?? PARTY_TYPE_META.shared).variant}>
                {(PARTY_TYPE_META[detail.product.partyType] ?? PARTY_TYPE_META.shared).label}
              </Badge>
            </div>
            <InfoRow label="카테고리" value={detail.product.category.name} />
            <InfoRow label="연장 기간" value={`${detail.product.durationDays}일`} />
          </section>

          {/* 연장 구간 — 대기 건은 "지금 승인하면"의 미리보기 */}
          <section className="space-y-2">
            <h3 className="text-body-md font-semibold text-text-primary">기간</h3>
            <InfoRow
              label="현재 만료"
              value={detail.application.expiresAt ? formatDateTime(detail.application.expiresAt) : '-'}
            />
            <InfoRow
              label={detail.status === 'pending' ? '승인 시 만료' : '연장 후 만료'}
              value={detail.extendedTo ? formatDateTime(detail.extendedTo) : '-'}
            />
            {detail.status === 'pending' &&
              detail.application.expiresAt &&
              new Date(detail.application.expiresAt).getTime() < Date.now() && (
                <p className="text-caption-md text-text-muted">
                  이미 만료된 신청이라 승인 시각부터 {detail.product.durationDays}일이 연장됩니다.
                </p>
              )}
          </section>

          {(detail.warnings.accountDueBeforeExpiry || detail.warnings.memberMissing) &&
            detail.status === 'pending' && (
              <section className="space-y-1.5 rounded-lg border border-warning/40 bg-warning/5 p-3">
                {detail.warnings.accountDueBeforeExpiry && detail.extendedTo && (
                  <p className="text-caption-md text-warning">
                    ⚠ 계정 마감일 {formatMonthDay(detail.warnings.accountDueBeforeExpiry.accountDueAt)} &lt; 연장 후 만료{' '}
                    {formatMonthDay(detail.extendedTo)} — 계정
                    {detail.warnings.accountDueBeforeExpiry.accountEmail
                      ? `(${detail.warnings.accountDueBeforeExpiry.accountEmail})`
                      : ''}{' '}
                    멤버십 연장이 필요합니다. 승인은 가능합니다.
                  </p>
                )}
                {detail.warnings.memberMissing && (
                  <p className="text-caption-md text-warning">
                    ⚠ 연결된 파티원 메모가 없어 만료일만 연장되고 드라마 계정 메모는 갱신되지 않습니다. 필요하면 승인 후
                    계정을 확인해 주세요.
                  </p>
                )}
              </section>
            )}

          <section className="space-y-2">
            <h3 className="text-body-md font-semibold text-text-primary">금액</h3>
            <div className="space-y-1.5 rounded-lg bg-gray-50 p-3">
              <AmountRow label="정가" value={`${detail.price.toLocaleString('ko-KR')}원`} />
              {detail.discount > 0 && (
                <AmountRow
                  label="재구매 할인"
                  value={`-${detail.discount.toLocaleString('ko-KR')}원`}
                  accent
                />
              )}
              <AmountRow label="수수료" value={`${detail.fee.toLocaleString('ko-KR')}원`} />
              {detail.usedPoint > 0 && (
                <AmountRow label="포인트 사용" value={`-${formatPoint(detail.usedPoint)}`} accent />
              )}
              <div className="text-body-md flex justify-between border-t border-border pt-1.5 font-semibold text-text-primary">
                <span>{detail.usedPoint > 0 ? '실결제 금액' : '합계'}</span>
                <span className="text-brand">
                  {payableAmount(detail.totalAmount, detail.usedPoint).toLocaleString('ko-KR')}원
                </span>
              </div>
            </div>
          </section>

          <section className="space-y-2">
            <h3 className="text-body-md font-semibold text-text-primary">일정</h3>
            <InfoRow label="신청일시" value={formatDateTime(detail.createdAt)} />
            {detail.decidedAt && <InfoRow label="처리일시" value={formatDateTime(detail.decidedAt)} />}
            {detail.returnedAt && <InfoRow label="반품일시" value={formatDateTime(detail.returnedAt)} />}
          </section>

          <section className="space-y-2">
            <h3 className="text-body-md font-semibold text-text-primary">알림톡 발송 이력</h3>
            <AlimtalkLogList logs={detail.alimtalkLogs} />
          </section>

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

function AmountRow({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="text-body-md flex justify-between text-text-secondary">
      <span>{label}</span>
      <span className={accent ? 'text-brand' : undefined}>{value}</span>
    </div>
  )
}
