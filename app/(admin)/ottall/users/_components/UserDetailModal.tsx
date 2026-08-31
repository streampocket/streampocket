'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Modal } from '@/components/ui/Modal'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import type { BadgeVariant } from '@/components/ui/Badge'
import { USER_SITE_URL } from '@/constants/app'
import { formatPoint, payableAmount } from '@/lib/points'
import type {
  AuthProvider,
  OwnProductStatus,
  PartyApplicationStatus,
} from '@/types/domain'
import type { AdminUserDetailApplication } from '../_types'
import { useAdminUserDetail } from '../_hooks/useAdminUserDetail'
import { useAdminWithdrawUser } from '../_hooks/useAdminWithdrawUser'
import { useReleaseReturnCooldown } from '../_hooks/useReleaseReturnCooldown'
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

// 파티 자체의 상태 — 위 신청 상태와 다른 축이다. 라벨에 "파티"를 붙여 구분한다
const PARTY_STATUS_LABEL: Record<OwnProductStatus, string> = {
  recruiting: '모집중',
  closed: '모집완료',
  expired: '만료',
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
  const releaseCooldownMutation = useReleaseReturnCooldown()

  const isWithdrawn = !!detail?.user.deletedAt

  const handleWithdraw = (reason: string) => {
    if (!userId) return
    withdrawMutation.mutate(
      { userId, reason },
      { onSuccess: () => setIsWithdrawOpen(false) },
    )
  }

  const handleReleaseCooldown = () => {
    if (!userId || !detail) return
    const count = detail.returnCooldowns.length
    if (
      !window.confirm(
        `${detail.user.name}님의 재신청 차단 ${count}건을 모두 해제할까요?\n해제 즉시 재신청이 가능해집니다.`,
      )
    ) {
      return
    }
    releaseCooldownMutation.mutate({ userId })
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

          {/* 재신청 차단 — 유효한(12시간 이내) 반품 쿨다운이 있을 때만 */}
          {detail.returnCooldowns.length > 0 && (
            <section className="space-y-2 rounded-lg border border-yellow-200 bg-yellow-50 p-3">
              <h3 className="text-body-md font-semibold text-yellow-700">
                재신청 차단 ({detail.returnCooldowns.length})
              </h3>
              {detail.returnCooldowns.map((cooldown) => (
                <p key={cooldown.categoryId} className="text-caption-md text-text-secondary">
                  <span className="font-medium text-text-primary">{cooldown.categoryName}</span>
                  {' — '}&lsquo;{cooldown.partyName}&rsquo; 반품 ·{' '}
                  {formatDateTime(cooldown.returnedAt)} 반품 →{' '}
                  <span className="font-medium text-text-primary">
                    {formatDateTime(cooldown.retryAt)}
                  </span>
                  까지 차단
                </p>
              ))}
              <div className="pt-1">
                <Button
                  variant="danger"
                  size="sm"
                  disabled={releaseCooldownMutation.isPending}
                  onClick={handleReleaseCooldown}
                >
                  전체 차단 해제
                </Button>
                <p className="text-caption-sm mt-2 text-text-muted">
                  해제 즉시 같은 카테고리 파티에 다시 신청할 수 있습니다.
                </p>
              </div>
            </section>
          )}

          {/* 통계 요약 */}
          <section className="space-y-2">
            <h3 className="text-body-md font-semibold text-text-primary">통계 요약</h3>
            <div className="grid grid-cols-2 gap-3">
              <StatBox label="총 결제금액" value={`${formatPrice(detail.stats.totalPaidAmount)}원`} />
              <StatBox label="파티 참여" value={`${detail.stats.partyCount}건`} />
              <StatBox label="활성 파티" value={`${detail.stats.activePartyCount}건`} />
              <StatBox label="보유 포인트" value={formatPoint(detail.user.pointBalance)} />
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
                {detail.partyApplications.map((app) => (
                  <PartyApplicationCard key={app.id} app={app} />
                ))}
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

/**
 * 참여 파티 한 건.
 *
 * 카드 전체가 유저용 파티 상세로 가는 링크다 — 관리자 파티 상세는 모달이라 URL이 없고,
 * 유저 페이지는 모집완료·만료 파티도 열린다. 새 창이라 회원 상세 모달이 그대로 남는다.
 */
function PartyApplicationCard({ app }: { app: AdminUserDetailApplication }) {
  // 반품은 취소의 하위 구분 — returnedAt이 있으면 라벨만 "반품"으로 바꾼다 (거절·제거와 구분)
  const statusBadge =
    app.status === 'cancelled' && app.returnedAt
      ? { variant: 'red' as const, label: '반품' }
      : APP_STATUS_BADGE[app.status]
  const { product } = app
  // 정가보다 "싸게" 산 경우에만 정가를 함께 보여준다.
  //  - 차감형이어도 경과일 0이면 정가와 같아서 `!==`로는 같은 숫자를 두 번 찍는다
  //  - product.price는 '현재' 정가라 관리자가 값을 내리면 신청가가 더 클 수 있는데,
  //    그때 화살표를 그리면 "정가보다 비싸게 냈다"로 잘못 읽힌다
  const discounted = app.price < product.price

  return (
    <Link
      href={`${USER_SITE_URL}/party/${product.id}`}
      target="_blank"
      rel="noopener noreferrer"
      className="block rounded-lg border border-border bg-card-bg p-3 transition-colors hover:border-brand hover:bg-gray-50"
    >
      <div className="flex items-start justify-between gap-2">
        <span className="text-body-md font-medium text-text-primary">
          {product.name}
          <span className="text-text-muted ml-1 text-caption-md">↗</span>
        </span>
        <span className="flex shrink-0 flex-wrap justify-end gap-1">
          <Badge variant={statusBadge.variant}>{statusBadge.label}</Badge>
          <Badge variant="gray">파티 {PARTY_STATUS_LABEL[product.status]}</Badge>
        </span>
      </div>

      <p className="text-caption-md text-text-secondary mt-1">
        {product.category.name} · 파티장 {product.leaderName} · {product.filledSlots}/
        {product.totalSlots}명
      </p>

      <p className="text-caption-md text-text-secondary mt-1">
        {discounted && (
          <>
            <span className="text-text-muted line-through">{formatPrice(product.price)}원</span>
            <span className="mx-1">→</span>
          </>
        )}
        <span className="text-text-primary font-medium">{formatPrice(app.price)}원</span>
        <span className="text-text-muted"> + 수수료 {formatPrice(app.fee)}원</span>
        {app.usedPoint > 0 && (
          <span className="text-brand"> − 포인트 {formatPoint(app.usedPoint)}</span>
        )}
        <span className="text-text-primary font-semibold">
          {' '}
          · 결제 {formatPrice(payableAmount(app.totalAmount, app.usedPoint))}원
        </span>
      </p>

      <p className="text-caption-md text-text-muted mt-1">
        신청 {formatDateTime(app.createdAt)}
        {app.startedAt && (
          <>
            {' · 이용 '}
            {formatDate(app.startedAt)}
            {app.expiresAt && ` ~ ${formatDate(app.expiresAt)}`}
          </>
        )}
      </p>
    </Link>
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
