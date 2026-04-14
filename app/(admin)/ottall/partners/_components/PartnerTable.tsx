'use client'

import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import type { BadgeVariant } from '@/components/ui/Badge'
import type { PartnerStatus } from '@/types/domain'
import type { AdminPartnerWithUser, PartnerTabStatus } from '../_types'

type PartnerTableProps = {
  partners: AdminPartnerWithUser[]
  activeTab: PartnerTabStatus
  onApprove: (id: string) => void
  onReject: (id: string) => void
  onViewDetail: (id: string) => void
  approvingId: string | null
  rejectingId: string | null
}

const STATUS_BADGE: Record<PartnerStatus, { variant: BadgeVariant; label: string }> = {
  pending: { variant: 'yellow', label: '대기' },
  approved: { variant: 'green', label: '승인' },
  rejected: { variant: 'red', label: '거절' },
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    timeZone: 'Asia/Seoul',
  })
}

export function PartnerTable({
  partners,
  activeTab,
  onApprove,
  onReject,
  onViewDetail,
  approvingId,
  rejectingId,
}: PartnerTableProps) {
  if (partners.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="text-body-md text-text-muted">파트너가 없습니다.</p>
      </div>
    )
  }

  return (
    <>
      {/* 데스크탑 테이블 */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border text-left">
              <th className="text-caption-md px-4 py-3 font-medium text-text-muted">이름</th>
              <th className="text-caption-md px-4 py-3 font-medium text-text-muted">연락처</th>
              <th className="text-caption-md px-4 py-3 font-medium text-text-muted">은행</th>
              <th className="text-caption-md px-4 py-3 font-medium text-text-muted">상태</th>
              <th className="text-caption-md px-4 py-3 font-medium text-text-muted">신청일</th>
              <th className="text-caption-md px-4 py-3 font-medium text-text-muted">액션</th>
            </tr>
          </thead>
          <tbody>
            {partners.map((partner) => {
              const badge = STATUS_BADGE[partner.status]
              return (
                <tr
                  key={partner.id}
                  className="border-b border-border transition-colors hover:bg-gray-50"
                >
                  <td className="text-body-md px-4 py-3 text-text-primary">{partner.name}</td>
                  <td className="text-body-md px-4 py-3 text-text-secondary">{partner.phone}</td>
                  <td className="text-body-md px-4 py-3 text-text-secondary">{partner.bankName}</td>
                  <td className="px-4 py-3">
                    <Badge variant={badge.variant}>{badge.label}</Badge>
                  </td>
                  <td className="text-body-md px-4 py-3 text-text-muted">
                    {formatDate(partner.createdAt)}
                  </td>
                  <td className="px-4 py-3">
                    <PartnerActions
                      partner={partner}
                      activeTab={activeTab}
                      onApprove={onApprove}
                      onReject={onReject}
                      onViewDetail={onViewDetail}
                      approvingId={approvingId}
                      rejectingId={rejectingId}
                    />
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* 모바일 카드 */}
      <div className="space-y-3 md:hidden">
        {partners.map((partner) => {
          const badge = STATUS_BADGE[partner.status]
          return (
            <div
              key={partner.id}
              className="rounded-lg border border-border bg-card-bg p-4"
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="text-body-md font-medium text-text-primary">
                  {partner.name}
                </span>
                <Badge variant={badge.variant}>{badge.label}</Badge>
              </div>
              <p className="text-caption-md text-text-secondary">{partner.phone}</p>
              <p className="text-caption-md text-text-secondary">{partner.bankName}</p>
              <p className="text-caption-sm mt-1 text-text-muted">
                {formatDate(partner.createdAt)}
              </p>
              <div className="mt-3">
                <PartnerActions
                  partner={partner}
                  activeTab={activeTab}
                  onApprove={onApprove}
                  onReject={onReject}
                  onViewDetail={onViewDetail}
                  approvingId={approvingId}
                  rejectingId={rejectingId}
                />
              </div>
            </div>
          )
        })}
      </div>
    </>
  )
}

type PartnerActionsProps = {
  partner: AdminPartnerWithUser
  activeTab: PartnerTabStatus
  onApprove: (id: string) => void
  onReject: (id: string) => void
  onViewDetail: (id: string) => void
  approvingId: string | null
  rejectingId: string | null
}

function PartnerActions({
  partner,
  activeTab,
  onApprove,
  onReject,
  onViewDetail,
  approvingId,
  rejectingId,
}: PartnerActionsProps) {
  if (partner.status === 'pending' && (activeTab === 'pending' || activeTab === 'all')) {
    return (
      <div className="flex gap-2">
        <Button
          variant="primary"
          size="sm"
          loading={approvingId === partner.id}
          onClick={() => onApprove(partner.id)}
        >
          승인
        </Button>
        <Button
          variant="danger"
          size="sm"
          loading={rejectingId === partner.id}
          onClick={() => onReject(partner.id)}
        >
          거절
        </Button>
      </div>
    )
  }

  if (partner.status === 'approved') {
    return (
      <Button variant="secondary" size="sm" onClick={() => onViewDetail(partner.id)}>
        상세
      </Button>
    )
  }

  return null
}
