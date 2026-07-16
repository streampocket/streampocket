'use client'

import { useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import type { BadgeVariant } from '@/components/ui/Badge'
import type {
  AuthProvider,
  PartyApplicationStatus,
} from '@/types/domain'
import { useAdminUserDetail } from '../_hooks/useAdminUserDetail'
import { useAdminWithdrawUser } from '../_hooks/useAdminWithdrawUser'
import { AdminWithdrawModal } from './AdminWithdrawModal'

type UserDetailModalProps = {
  userId: string | null
  onClose: () => void
}

const PROVIDER_BADGE: Record<AuthProvider, { variant: BadgeVariant; label: string }> = {
  local: { variant: 'gray', label: '일반' },
  kakao: { variant: 'yellow', label: '카카오' },
  google: { variant: 'blue', label: '구글' },
}

const APP_STATUS_BADGE: Record<PartyApplicationStatus, { variant: BadgeVariant; label: string }> = {
  pending: { variant: 'yellow', label: '대기' },
  confirmed: { variant: 'green', label: '확정' },
  cancelled: { variant: 'red', label: '취소' },
  expired: { variant: 'gray', label: '만료' },
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    timeZone: 'Asia/Seoul',
  })
}

function formatDateTime(dateStr: string): string {
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

export function UserDetailModal({ userId, onClose }: UserDetailModalProps) {
  const { data: detail, isLoading } = useAdminUserDetail(userId)
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false)
  const withdrawMutation = useAdminWithdrawUser()

  const isWithdrawn = !!detail?.user.deletedAt

  const handleWithdraw = (reason: string) => {
    if (!userId) return
    withdrawMutation.mutate(
      { userId, reason },
      { onSuccess: () => setIsWithdrawOpen(false) },
    )
  }

  return (
    <Modal isOpen={!!userId} onClose={onClose} title="회원 상세">
      {isLoading || !detail ? (
        <div className="py-10 text-center">
          <p className="text-body-md text-text-muted">로딩 중...</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* 기본 정보 */}
          <section className="space-y-2">
            <div className="flex items-center gap-2">
              <h3 className="text-body-md font-semibold text-text-primary">기본 정보</h3>
              {isWithdrawn && (
                <Badge variant="red">
                  {detail.user.withdrawnByAdmin ? '탈퇴 (관리자 처리)' : '탈퇴'}
                </Badge>
              )}
            </div>
            <InfoRow label="이름" value={detail.user.name} />
            <InfoRow
              label="이메일"
              value={isWithdrawn ? (detail.user.originalEmail ?? '-') : detail.user.email}
            />
            <InfoRow
              label="전화번호"
              value={isWithdrawn ? (detail.user.originalPhone ?? '-') : detail.user.phone}
            />
            <div className="flex items-center gap-3">
              <span className="text-body-md w-24 shrink-0 text-text-muted">인증 여부</span>
              <Badge variant={detail.user.phoneVerified ? 'green' : 'red'}>
                {detail.user.phoneVerified ? '완료' : '미인증'}
              </Badge>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-body-md w-24 shrink-0 text-text-muted">가입 방식</span>
              <Badge variant={PROVIDER_BADGE[detail.user.provider].variant}>
                {PROVIDER_BADGE[detail.user.provider].label}
              </Badge>
            </div>
            <InfoRow label="가입일" value={formatDateTime(detail.user.createdAt)} />
          </section>

          {/* 탈퇴 정보 */}
          {isWithdrawn && (
            <section className="space-y-2 rounded-lg border border-red-200 bg-red-50 p-3">
              <h3 className="text-body-md font-semibold text-red-700">탈퇴 정보</h3>
              <InfoRow
                label="탈퇴일"
                value={detail.user.deletedAt ? formatDateTime(detail.user.deletedAt) : '-'}
              />
              <InfoRow label="사유" value={detail.user.withdrawalReason ?? '-'} />
              <InfoRow
                label="삭제 예정일"
                value={
                  detail.user.purgeScheduledAt
                    ? formatDateTime(detail.user.purgeScheduledAt)
                    : '-'
                }
              />
            </section>
          )}

          {/* 통계 요약 */}
          <section className="space-y-2">
            <h3 className="text-body-md font-semibold text-text-primary">통계 요약</h3>
            <div className="grid grid-cols-2 gap-3">
              <StatBox label="총 결제금액" value={`${formatPrice(detail.stats.totalPaidAmount)}원`} />
              <StatBox label="파티 참여" value={`${detail.stats.partyCount}건`} />
              <StatBox label="활성 파티" value={`${detail.stats.activePartyCount}건`} />
            </div>
          </section>

          {/* 참여 파티 */}
          <section className="space-y-2">
            <h3 className="text-body-md font-semibold text-text-primary">
              참여 파티 ({detail.partyApplications.length})
            </h3>
            {detail.partyApplications.length === 0 ? (
              <p className="text-caption-md text-text-muted">참여 중인 파티가 없습니다.</p>
            ) : (
              <div className="space-y-2">
                {detail.partyApplications.map((app) => {
                  const statusBadge = APP_STATUS_BADGE[app.status]
                  return (
                    <div
                      key={app.id}
                      className="rounded-lg border border-border bg-card-bg p-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-body-md font-medium text-text-primary">
                          {app.product.name}
                        </span>
                        <Badge variant={statusBadge.variant}>{statusBadge.label}</Badge>
                      </div>
                      <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1">
                        <span className="text-caption-md text-text-secondary">
                          {formatPrice(app.totalAmount)}원
                        </span>
                        {app.startedAt && (
                          <span className="text-caption-md text-text-muted">
                            {formatDate(app.startedAt)}
                            {app.expiresAt && ` ~ ${formatDate(app.expiresAt)}`}
                          </span>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </section>

          {/* 약관 동의 */}
          {detail.termsAgreements.length > 0 && (
            <section className="space-y-2">
              <h3 className="text-body-md font-semibold text-text-primary">약관 동의</h3>
              {detail.termsAgreements.map((term) => (
                <InfoRow
                  key={term.type}
                  label={term.type === 'service' ? '서비스' : term.type === 'privacy' ? '개인정보' : term.type}
                  value={formatDateTime(term.agreedAt)}
                />
              ))}
            </section>
          )}

          {/* 관리자 강제 탈퇴 — 활성 회원만 */}
          {!isWithdrawn && (
            <section className="border-t border-border pt-4">
              <Button
                variant="danger"
                size="sm"
                onClick={() => setIsWithdrawOpen(true)}
              >
                회원 탈퇴 처리
              </Button>
              <p className="text-caption-sm mt-2 text-text-muted">
                탈퇴 처리 시 30일 보관 후 완전 삭제됩니다. 진행 중/대기 중 파티가 있으면 처리할 수
                없습니다.
              </p>
            </section>
          )}
        </div>
      )}

      <AdminWithdrawModal
        isOpen={isWithdrawOpen}
        userName={detail?.user.name ?? ''}
        isPending={withdrawMutation.isPending}
        onConfirm={handleWithdraw}
        onClose={() => setIsWithdrawOpen(false)}
      />
    </Modal>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-body-md w-24 shrink-0 text-text-muted">{label}</span>
      <span className="text-body-md text-text-primary">{value}</span>
    </div>
  )
}

function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-card-bg p-3 text-center">
      <p className="text-caption-md text-text-muted">{label}</p>
      <p className="text-body-md mt-1 font-semibold text-text-primary">{value}</p>
    </div>
  )
}
