'use client'

import { useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import type { BadgeVariant } from '@/components/ui/Badge'
import type { OwnProductStatus, PartyApplicationStatus } from '@/types/domain'
import { useAdminPartyDetail } from '../_hooks/useAdminPartyDetail'
import { useCancelPartyMember } from '../_hooks/useCancelPartyMember'
import { useUpdatePartyStatus } from '../_hooks/useUpdatePartyStatus'
import { PartyEditForm } from './PartyEditForm'
import { PARTY_TYPE_META, PARTY_DURATION_MODE_META } from '@/constants/app'

type PartyDetailModalProps = {
  partyId: string | null
  onClose: () => void
}

const STATUS_BADGE: Record<OwnProductStatus, { variant: BadgeVariant; label: string }> = {
  recruiting: { variant: 'green', label: '모집중' },
  closed: { variant: 'blue', label: '모집완료' },
  expired: { variant: 'gray', label: '만료' },
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

// 참여자 표에서 가로 폭을 아끼기 위한 축약 표기 (MM.DD) — 전체 날짜는 title 툴팁으로 제공
function formatCompactDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('ko-KR', {
    month: '2-digit',
    day: '2-digit',
    timeZone: 'Asia/Seoul',
  })
}

function formatPrice(amount: number): string {
  return amount.toLocaleString('ko-KR')
}

export function PartyDetailModal({ partyId, onClose }: PartyDetailModalProps) {
  const { data: party, isLoading } = useAdminPartyDetail(partyId)
  const statusMutation = useUpdatePartyStatus()
  const cancelMemberMutation = useCancelPartyMember()
  const [selectedStatus, setSelectedStatus] = useState<OwnProductStatus | ''>('')
  const [mode, setMode] = useState<'view' | 'edit'>('view')

  // 확정 파티원 제거 — 인원 감소 + 연결된 파티 주문 자동 반품 (되돌릴 수 없음)
  const handleCancelMember = (applicationId: string, userName: string) => {
    if (
      !window.confirm(
        `${userName} 님을 파티에서 제거하시겠습니까?\n\n· 모집 인원이 1명 줄어듭니다\n· 연결된 파티 주문이 자동으로 반품 처리됩니다\n· 되돌릴 수 없습니다`,
      )
    ) {
      return
    }
    cancelMemberMutation.mutate(applicationId)
  }

  const handleStatusChange = () => {
    if (!partyId || !selectedStatus) return
    statusMutation.mutate(
      { id: partyId, status: selectedStatus },
      {
        onSuccess: () => setSelectedStatus(''),
      },
    )
  }

  return (
    <Modal
      isOpen={!!partyId}
      onClose={() => {
        onClose()
        setSelectedStatus('')
        setMode('view')
      }}
      title={mode === 'edit' ? '파티 수정' : '파티 상세'}
      // 참여자 표(이름·연락처·금액·상태·기간·신청일·관리)가 가로 스크롤 없이 들어가도록 넓게.
      // cn()이 tailwind-merge를 쓰지 않아 Modal 기본 max-w를 덮으려면 important(v4 접미사)가 필요하다.
      className="max-w-4xl!"
    >
      {isLoading || !party ? (
        <div className="py-10 text-center">
          <p className="text-body-md text-text-muted">로딩 중...</p>
        </div>
      ) : mode === 'edit' ? (
        <PartyEditForm
          party={party}
          onCancel={() => setMode('view')}
          onSuccess={() => setMode('view')}
        />
      ) : (
        <div className="space-y-5">
          <div className="flex justify-end">
            <Button variant="secondary" size="sm" onClick={() => setMode('edit')}>
              수정
            </Button>
          </div>
          {/* 기본 정보 */}
          <section className="space-y-2">
            <h3 className="text-body-md font-semibold text-text-primary">기본 정보</h3>
            <InfoRow label="파티명" value={party.name} />
            <InfoRow label="카테고리" value={party.category.name} />
            <div className="flex items-center gap-3">
              <span className="text-body-md w-20 shrink-0 text-text-muted">타입</span>
              <Badge variant={(PARTY_TYPE_META[party.partyType] ?? PARTY_TYPE_META.shared).variant}>
                {(PARTY_TYPE_META[party.partyType] ?? PARTY_TYPE_META.shared).label}
              </Badge>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-body-md w-20 shrink-0 text-text-muted">기간 방식</span>
              <Badge variant={(PARTY_DURATION_MODE_META[party.durationMode] ?? PARTY_DURATION_MODE_META.countdown).variant}>
                {(PARTY_DURATION_MODE_META[party.durationMode] ?? PARTY_DURATION_MODE_META.countdown).label}
              </Badge>
            </div>
            <InfoRow label="가격" value={`${formatPrice(party.price)}원`} />
            {party.dailyDiscount > 0 && (
              <InfoRow label="하루할인" value={`${formatPrice(party.dailyDiscount)}원/일`} />
            )}
            {party.currentPrice < party.price && (
              <InfoRow label="현재가격" value={`${formatPrice(party.currentPrice)}원`} />
            )}
            <InfoRow label="기간" value={`${party.durationDays}일`} />
            {party.startedAt && (
              <InfoRow label="남은기간" value={`${party.remainingDays}일`} />
            )}
            <InfoRow label="모집" value={`${party.filledSlots}/${party.totalSlots}명`} />
            <div className="flex items-center gap-3">
              <span className="text-body-md w-20 shrink-0 text-text-muted">상태</span>
              <Badge variant={STATUS_BADGE[party.status].variant}>
                {STATUS_BADGE[party.status].label}
              </Badge>
            </div>
            <InfoRow label="생성일" value={formatDate(party.createdAt)} />

          </section>

          {/* 파티장 정보 */}
          <section className="space-y-2">
            <h3 className="text-body-md font-semibold text-text-primary">파티장 정보</h3>
            <InfoRow label="이름" value={party.leaderName} />
          </section>

          {/* 참여자 목록 */}
          <section>
            <h3 className="text-body-md mb-2 font-semibold text-text-primary">
              참여자 ({party.applications.length})
            </h3>
            {party.applications.length === 0 ? (
              <p className="text-caption-md text-text-muted">참여자가 없습니다.</p>
            ) : (
              <>
                {/* 데스크탑 테이블 */}
                <div className="hidden overflow-x-auto md:block">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border text-left">
                        <th className="text-caption-md px-3 py-2 font-medium text-text-muted">
                          이름
                        </th>
                        <th className="text-caption-md px-3 py-2 font-medium text-text-muted">
                          연락처
                        </th>
                        <th className="text-caption-md px-3 py-2 font-medium text-text-muted">
                          금액
                        </th>
                        <th className="text-caption-md px-3 py-2 font-medium text-text-muted">
                          신청상태
                        </th>
                        <th className="text-caption-md whitespace-nowrap px-3 py-2 font-medium text-text-muted">
                          이용기간
                        </th>
                        <th className="text-caption-md whitespace-nowrap px-3 py-2 font-medium text-text-muted">
                          신청일
                        </th>
                        <th className="text-caption-md whitespace-nowrap px-3 py-2 font-medium text-text-muted">
                          관리
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {party.applications.map((app) => {
                        const appBadge = APP_STATUS_BADGE[app.status]
                        return (
                          <tr key={app.id} className="border-b border-border">
                            <td className="text-body-md whitespace-nowrap px-3 py-2 text-text-primary">
                              {app.user.name}
                            </td>
                            <td className="text-body-md whitespace-nowrap px-3 py-2 text-text-secondary">
                              {app.user.phone}
                            </td>
                            <td className="text-body-md whitespace-nowrap px-3 py-2 text-text-secondary">
                              {formatPrice(app.totalAmount)}원
                            </td>
                            <td className="whitespace-nowrap px-3 py-2">
                              <Badge variant={appBadge.variant}>{appBadge.label}</Badge>
                            </td>
                            <td
                              className="text-body-md whitespace-nowrap px-3 py-2 text-text-muted"
                              title={`${app.startedAt ? formatDate(app.startedAt) : '-'} ~ ${app.expiresAt ? formatDate(app.expiresAt) : '-'}`}
                            >
                              {app.startedAt || app.expiresAt
                                ? `${app.startedAt ? formatCompactDate(app.startedAt) : '-'} ~ ${app.expiresAt ? formatCompactDate(app.expiresAt) : '-'}`
                                : '-'}
                            </td>
                            <td
                              className="text-body-md whitespace-nowrap px-3 py-2 text-text-muted"
                              title={formatDate(app.createdAt)}
                            >
                              {formatCompactDate(app.createdAt)}
                            </td>
                            <td className="whitespace-nowrap px-3 py-2">
                              {app.status === 'confirmed' && (
                                <Button
                                  variant="danger"
                                  size="sm"
                                  loading={
                                    cancelMemberMutation.isPending &&
                                    cancelMemberMutation.variables === app.id
                                  }
                                  disabled={cancelMemberMutation.isPending}
                                  onClick={() => handleCancelMember(app.id, app.user.name)}
                                >
                                  파티원 제거
                                </Button>
                              )}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>

                {/* 모바일 카드 */}
                <div className="space-y-2 md:hidden">
                  {party.applications.map((app) => {
                    const appBadge = APP_STATUS_BADGE[app.status]
                    return (
                      <div
                        key={app.id}
                        className="rounded-lg border border-border p-3"
                      >
                        <div className="mb-1 flex items-center justify-between">
                          <span className="text-body-md font-medium text-text-primary">
                            {app.user.name}
                          </span>
                          <div className="flex gap-1">
                            <Badge variant={appBadge.variant}>{appBadge.label}</Badge>
                          </div>
                        </div>
                        <p className="text-caption-md text-text-secondary">{app.user.phone}</p>
                        <p className="text-caption-md text-text-secondary">
                          {formatPrice(app.totalAmount)}원
                        </p>
                        {(app.startedAt || app.expiresAt) && (
                          <p className="text-caption-md mt-1 text-text-secondary">
                            {app.startedAt ? formatDate(app.startedAt) : '-'} ~ {app.expiresAt ? formatDate(app.expiresAt) : '-'}
                          </p>
                        )}
                        <p className="text-caption-sm mt-1 text-text-muted">
                          {formatDate(app.createdAt)}
                        </p>
                        {app.status === 'confirmed' && (
                          <div className="mt-2 flex justify-end">
                            <Button
                              variant="danger"
                              size="sm"
                              loading={
                                cancelMemberMutation.isPending &&
                                cancelMemberMutation.variables === app.id
                              }
                              disabled={cancelMemberMutation.isPending}
                              onClick={() => handleCancelMember(app.id, app.user.name)}
                            >
                              파티원 제거
                            </Button>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </>
            )}
          </section>

          {/* 상태 변경 */}
          <section className="space-y-2">
            <h3 className="text-body-md font-semibold text-text-primary">상태 변경</h3>
            <div className="flex flex-col gap-2 sm:flex-row">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value as OwnProductStatus | '')}
                className="text-body-md rounded-lg border border-border bg-card-bg px-3 py-2 text-text-primary"
              >
                <option value="">상태 선택</option>
                <option value="recruiting">모집중</option>
                <option value="closed">모집완료</option>
                <option value="expired">만료</option>
              </select>
              <Button
                variant="primary"
                size="sm"
                disabled={!selectedStatus || selectedStatus === party.status}
                loading={statusMutation.isPending}
                onClick={handleStatusChange}
              >
                변경
              </Button>
            </div>
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
