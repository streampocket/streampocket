'use client'

import { Modal } from '@/components/ui/Modal'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import type { BadgeVariant } from '@/components/ui/Badge'
import type { PartyApplicationStatus } from '@/types/domain'
import { useAdminApplicationDetail } from '../_hooks/useAdminApplicationDetail'
import { useApproveApplication } from '../_hooks/useApproveApplication'
import { useDuplicateParty } from '../_hooks/useDuplicateParty'
import { useExpandPartySlots } from '../_hooks/useExpandPartySlots'
import { usePartyAutoDeliverSetting } from '../_hooks/usePartyAutoDeliverSetting'
import { useRejectApplication } from '../_hooks/useRejectApplication'
import type { AdminAlimtalkLog, AdminApplicationDetail } from '../_types'
import {
  PARTY_TYPE_META,
  PARTY_DURATION_MODE_META,
  describeAutoDeliverReason,
} from '@/constants/app'
import { formatPoint, payableAmount } from '@/lib/points'

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
  const duplicateMutation = useDuplicateParty()
  const rejectMutation = useRejectApplication()
  const expandMutation = useExpandPartySlots()

  const autoDeliverSetting = usePartyAutoDeliverSetting()

  // 정원 만석 — 이 상태에서 승인 API를 부르면 승인이 아니라 자동 거절되므로 버튼을 막는다
  const isFull = detail ? detail.product.filledSlots >= detail.product.totalSlots : false

  // 조건에 맞는 계정이 없으면 토글을 켠 채로 둘 수 없다 — 전역 설정이 ON이어도 강제로 끈다.
  // 승인 자체는 그대로 진행된다 (자동발송만 생략).
  const canAutoDeliver = detail?.autoDeliverPreview.eligible ?? false
  const autoDeliver = canAutoDeliver && autoDeliverSetting.enabled

  const handleApprove = () => {
    if (!applicationId) return
    const notice = autoDeliver
      ? '\n승인과 동시에 계정을 배정하고 알림톡을 보냅니다.'
      : ''
    if (!confirm(`이 신청을 승인하시겠습니까? 승인 시점부터 이용 기간이 시작됩니다.${notice}`)) return
    approveMutation.mutate(
      { applicationId, autoDeliver },
      {
        onSuccess: (res) => {
          onClose()
          // 이번 승인으로 파티가 정원을 채워 모집완료된 경우 — 동일 파티 재생성 여부 확인
          if (
            res.partyClosed &&
            res.productId &&
            confirm('파티가 정원을 채워 모집완료되었습니다.\n똑같은 파티를 새로 생성하시겠습니까?')
          ) {
            duplicateMutation.mutate(res.productId)
          }
        },
      },
    )
  }

  const handleReject = () => {
    if (!applicationId) return
    if (!confirm('이 신청을 거절하시겠습니까?')) return
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
            <div className="flex items-center gap-3">
              <span className="text-body-md w-20 shrink-0 text-text-muted">타입</span>
              <Badge variant={(PARTY_TYPE_META[detail.product.partyType] ?? PARTY_TYPE_META.shared).variant}>
                {(PARTY_TYPE_META[detail.product.partyType] ?? PARTY_TYPE_META.shared).label}
              </Badge>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-body-md w-20 shrink-0 text-text-muted">기간 방식</span>
              <Badge variant={(PARTY_DURATION_MODE_META[detail.product.durationMode] ?? PARTY_DURATION_MODE_META.countdown).variant}>
                {(PARTY_DURATION_MODE_META[detail.product.durationMode] ?? PARTY_DURATION_MODE_META.countdown).label}
              </Badge>
            </div>
            <InfoRow label="카테고리" value={detail.product.category.name} />
            <InfoRow label="이용 기간" value={`${detail.product.durationDays}일`} />
            <div className="flex items-center gap-3">
              <span className="text-body-md w-20 shrink-0 text-text-muted">모집 현황</span>
              <span className="text-body-md text-text-primary">
                {detail.product.filledSlots}/{detail.product.totalSlots}명
              </span>
              {isFull && detail.status === 'pending' && (
                <Button
                  size="xs"
                  variant="secondary"
                  loading={expandMutation.isPending}
                  onClick={() =>
                    expandMutation.mutate({
                      productId: detail.product.id,
                      currentTotalSlots: detail.product.totalSlots,
                    })
                  }
                >
                  +1 늘리기
                </Button>
              )}
            </div>
            {isFull && detail.status === 'pending' && (
              <p className="text-caption-md text-danger">
                정원이 가득 찼습니다. 정원을 늘리면 승인할 수 있습니다.
              </p>
            )}
          </section>

          {/* 금액 */}
          <section className="space-y-2">
            <h3 className="text-body-md font-semibold text-text-primary">금액</h3>
            <div className="space-y-1.5 rounded-lg bg-gray-50 p-3">
              <div className="text-body-md flex justify-between text-text-secondary">
                <span>가격</span>
                <span>{formatPrice(detail.price)}원</span>
              </div>
              <div className="text-body-md flex justify-between text-text-secondary">
                <span>수수료</span>
                <span>{formatPrice(detail.fee)}원</span>
              </div>
              {detail.usedPoint > 0 && (
                <div className="text-body-md flex justify-between text-text-secondary">
                  <span>포인트 사용</span>
                  <span className="text-brand">-{formatPoint(detail.usedPoint)}</span>
                </div>
              )}
              <div className="text-body-md flex justify-between border-t border-border pt-1.5 font-semibold text-text-primary">
                <span>{detail.usedPoint > 0 ? '실결제 금액' : '합계'}</span>
                <span className="text-brand">
                  {formatPrice(payableAmount(detail.totalAmount, detail.usedPoint))}원
                </span>
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

          {/* 알림톡 발송 이력 */}
          <section className="space-y-2">
            <h3 className="text-body-md font-semibold text-text-primary">알림톡 발송 이력</h3>
            <AlimtalkLogList logs={detail.alimtalkLogs} />
          </section>

          {/* 배정된 계정 (확정 건) */}
          {detail.dramaAccount && (
            <section className="space-y-2">
              <h3 className="text-body-md font-semibold text-text-primary">배정된 계정</h3>
              <InfoRow label="아이디" value={detail.dramaAccount.email} />
              {detail.dramaAccount.platform && (
                <InfoRow label="플랫폼" value={detail.dramaAccount.platform} />
              )}
              {detail.dramaAccount.dueAt && (
                <InfoRow label="계정 마감일" value={detail.dramaAccount.dueAt} />
              )}
            </section>
          )}

          {/* 액션 (대기 상태에서만) */}
          {detail.status === 'pending' && (
            <div className="space-y-3 border-t border-border pt-4">
              <AutoDeliverToggle
                detail={detail}
                checked={autoDeliver}
                disabled={
                  !canAutoDeliver ||
                  autoDeliverSetting.isLoading ||
                  approveMutation.isPending ||
                  rejectMutation.isPending
                }
                onChange={autoDeliverSetting.save}
              />
              <div className="flex justify-end gap-2">
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
                  disabled={rejectMutation.isPending || isFull}
                  onClick={handleApprove}
                >
                  승인
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </Modal>
  )
}

type AutoDeliverToggleProps = {
  detail: AdminApplicationDetail
  checked: boolean
  disabled: boolean
  onChange: (next: boolean) => void
}

/**
 * 승인 시 계정 자동 배정 + 알림톡 발송 토글.
 * 배정 가능할 때는 어떤 계정이 나갈지 미리 보여주고, 불가할 때는 사유를 보여주며 꺼진 채로 잠긴다.
 */
function AutoDeliverToggle({ detail, checked, disabled, onChange }: AutoDeliverToggleProps) {
  const { eligible, reason, account } = detail.autoDeliverPreview

  return (
    <div className="rounded-lg border border-border bg-gray-50 p-3">
      <label className="flex cursor-pointer items-center gap-2">
        <input
          type="checkbox"
          className="h-4 w-4 accent-brand disabled:cursor-not-allowed"
          checked={checked}
          disabled={disabled}
          onChange={(e) => onChange(e.target.checked)}
        />
        <span className="text-body-md font-medium text-text-primary">
          승인 시 계정 자동 배정 + 알림톡 발송
        </span>
        {!eligible && <Badge variant="gray">자동발송 불가</Badge>}
      </label>

      {eligible && account ? (
        <p className="text-caption-md mt-1.5 pl-6 text-text-secondary">
          배정 예정: {account.email}
          {account.dueAt && ` (마감 ${account.dueAt}`}
          {account.dueAt && `, 빈자리 ${account.freeSlots}개)`}
        </p>
      ) : (
        <p className="text-caption-md mt-1.5 pl-6 text-danger">
          ⚠ {describeAutoDeliverReason(reason)}
        </p>
      )}
    </div>
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

const ALIMTALK_STATUS_BADGE: Record<
  AdminAlimtalkLog['status'],
  { variant: BadgeVariant; label: string }
> = {
  sent: { variant: 'green', label: '발송완료' },
  failed: { variant: 'red', label: '실패' },
  queued: { variant: 'yellow', label: '대기' },
}

function AlimtalkLogList({ logs }: { logs: AdminAlimtalkLog[] }) {
  if (logs.length === 0) {
    return <p className="text-body-md text-text-muted">발송 이력이 없습니다.</p>
  }
  return (
    <ul className="space-y-2">
      {logs.map((log) => {
        const badge = ALIMTALK_STATUS_BADGE[log.status]
        const timestamp = log.sentAt ?? log.createdAt
        return (
          <li
            key={log.id}
            className="flex flex-col gap-1 rounded-lg border border-border bg-gray-50 p-3"
          >
            <div className="flex items-center gap-2">
              <span className="text-body-md text-text-primary">{formatDateTime(timestamp)}</span>
              <Badge variant={badge.variant}>{badge.label}</Badge>
              {log.templateCode && (
                <span className="text-caption-md text-text-muted">{log.templateCode}</span>
              )}
            </div>
            {log.status === 'failed' && log.errorMessage && (
              <p className="text-caption-md text-text-muted">{log.errorMessage}</p>
            )}
          </li>
        )
      })}
    </ul>
  )
}
