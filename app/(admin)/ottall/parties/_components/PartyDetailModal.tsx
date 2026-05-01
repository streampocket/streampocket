'use client'

import { useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import type { BadgeVariant } from '@/components/ui/Badge'
import type { OwnProductStatus, PartyApplicationStatus } from '@/types/domain'
import { useAdminPartyDetail } from '../_hooks/useAdminPartyDetail'
import { useAdminPartyCredentials } from '../_hooks/useAdminPartyCredentials'
import { useUpdatePartyStatus } from '../_hooks/useUpdatePartyStatus'

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

function formatPrice(amount: number): string {
  return amount.toLocaleString('ko-KR')
}

export function PartyDetailModal({ partyId, onClose }: PartyDetailModalProps) {
  const { data: party, isLoading } = useAdminPartyDetail(partyId)
  const [showCredentials, setShowCredentials] = useState(false)
  const { data: credentials, isLoading: credLoading } = useAdminPartyCredentials(
    partyId,
    showCredentials,
  )
  const statusMutation = useUpdatePartyStatus()
  const [selectedStatus, setSelectedStatus] = useState<OwnProductStatus | ''>('')

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
        setShowCredentials(false)
        setSelectedStatus('')
      }}
      title="파티 상세"
    >
      {isLoading || !party ? (
        <div className="py-10 text-center">
          <p className="text-body-md text-text-muted">로딩 중...</p>
        </div>
      ) : (
        <div className="space-y-5">
          {/* 기본 정보 */}
          <section className="space-y-2">
            <h3 className="text-body-md font-semibold text-text-primary">기본 정보</h3>
            <InfoRow label="파티명" value={party.name} />
            <InfoRow label="카테고리" value={party.category.name} />
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
            <InfoRow label="이름" value={party.user.name} />
            <InfoRow label="연락처" value={party.user.phone} />
            {party.user.partner && (
              <>
                <InfoRow label="은행" value={party.user.partner.bankName} />
                <InfoRow label="계좌" value={party.user.partner.bankAccount} />
              </>
            )}
          </section>

          {/* 계정 정보 */}
          <section className="space-y-2">
            <h3 className="text-body-md font-semibold text-text-primary">계정 정보</h3>
            {!showCredentials ? (
              <Button variant="secondary" size="sm" onClick={() => setShowCredentials(true)}>
                계정 정보 보기
              </Button>
            ) : credLoading ? (
              <p className="text-caption-md text-text-muted">로딩 중...</p>
            ) : credentials ? (
              <div className="space-y-2 rounded-lg border border-border bg-gray-50 p-3">
                <InfoRow label="계정 ID" value={credentials.accountId ?? '미등록'} />
                <InfoRow label="비밀번호" value={credentials.accountPassword ?? '미등록'} />
              </div>
            ) : (
              <p className="text-caption-md text-text-muted">계정 정보가 없습니다.</p>
            )}
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
                        <th className="text-caption-md px-3 py-2 font-medium text-text-muted">
                          시작일
                        </th>
                        <th className="text-caption-md px-3 py-2 font-medium text-text-muted">
                          만료일
                        </th>
                        <th className="text-caption-md px-3 py-2 font-medium text-text-muted">
                          신청일
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {party.applications.map((app) => {
                        const appBadge = APP_STATUS_BADGE[app.status]
                        return (
                          <tr key={app.id} className="border-b border-border">
                            <td className="text-body-md px-3 py-2 text-text-primary">
                              {app.user.name}
                            </td>
                            <td className="text-body-md px-3 py-2 text-text-secondary">
                              {app.user.phone}
                            </td>
                            <td className="text-body-md px-3 py-2 text-text-secondary">
                              {formatPrice(app.totalAmount)}원
                            </td>
                            <td className="px-3 py-2">
                              <Badge variant={appBadge.variant}>{appBadge.label}</Badge>
                            </td>
                            <td className="text-body-md px-3 py-2 text-text-muted">
                              {app.startedAt ? formatDate(app.startedAt) : '-'}
                            </td>
                            <td className="text-body-md px-3 py-2 text-text-muted">
                              {app.expiresAt ? formatDate(app.expiresAt) : '-'}
                            </td>
                            <td className="text-body-md px-3 py-2 text-text-muted">
                              {formatDate(app.createdAt)}
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
