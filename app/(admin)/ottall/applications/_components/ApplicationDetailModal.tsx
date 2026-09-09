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
import { usePartyAutoAssignSetting } from '../_hooks/usePartyAutoAssignSetting'
import { useRejectApplication } from '../_hooks/useRejectApplication'
import { PartyAccountCredentials } from '@/components/PartyAccountCredentials'
import { CopyTextButton } from '@/components/CopyTextButton'
import type { PartyAccountCredentials as PartyAccountCredentialsType } from '@/types/domain'
import type { AdminAlimtalkLog, AdminApplicationDetail, AssignedDramaAccount } from '../_types'
import {
  PARTY_TYPE_META,
  PARTY_DURATION_MODE_META,
  describeAutoAssignReason,
} from '@/constants/app'
import {
  PARTY_MESSAGE_TEMPLATES,
  buildAccountCredentialText,
} from '@/constants/partyTemplates'
import { formatDateOnly, formatMonthDay } from '@/lib/utils'
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

/** 지금부터 그 시각까지 남은 일수 (올림 — "오늘까지"를 0일로 보이지 않게) */
function daysUntil(dateStr: string): number {
  const ms = new Date(dateStr).getTime() - Date.now()
  return Math.max(0, Math.ceil(ms / (24 * 60 * 60 * 1000)))
}

export function ApplicationDetailModal({ applicationId, onClose }: ApplicationDetailModalProps) {
  const { data: detail, isLoading } = useAdminApplicationDetail(applicationId)
  const approveMutation = useApproveApplication()
  const duplicateMutation = useDuplicateParty()
  const rejectMutation = useRejectApplication()
  const expandMutation = useExpandPartySlots()

  const autoAssignSetting = usePartyAutoAssignSetting()

  // 정원 만석 — 이 상태에서 승인 API를 부르면 승인이 아니라 자동 거절되므로 버튼을 막는다
  const isFull = detail ? detail.product.filledSlots >= detail.product.totalSlots : false

  // 조건에 맞는 계정이 없으면 토글을 켠 채로 둘 수 없다 — 전역 설정이 ON이어도 강제로 끈다.
  // 승인 자체는 그대로 진행된다 (자동 배정만 생략).
  const canAutoAssign = detail?.autoAssignPreview.eligible ?? false
  const autoAssign = canAutoAssign && autoAssignSetting.enabled

  const handleApprove = () => {
    if (!applicationId) return
    const notice = autoAssign ? '\n승인과 동시에 계정을 배정합니다.' : ''
    if (!confirm(`이 신청을 승인하시겠습니까? 승인 시점부터 이용 기간이 시작됩니다.${notice}`)) return
    approveMutation.mutate(
      { applicationId, autoAssign },
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
            <PartyPeriodRow detail={detail} />
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
            {/* 대기 건은 만료일시가 아직 없다 — 승인하면 언제까지인지 미리 알려준다.
                특히 차감형은 파티 종료일에 맞춰 잘리므로 남은 일수가 이용 기간보다 짧다. */}
            {detail.status === 'pending' && detail.expiresAtIfApprovedNow && (
              <InfoRow
                label="승인 시 만료"
                value={`${formatDateTime(detail.expiresAtIfApprovedNow)} (${daysUntil(detail.expiresAtIfApprovedNow)}일)`}
              />
            )}
          </section>

          {/* 신청 접수 알림톡(UJ_2053) 발송 이력 — 계정 안내는 아래 양식으로 직접 전달한다 */}
          <section className="space-y-2">
            <h3 className="text-body-md font-semibold text-text-primary">알림톡 발송 이력</h3>
            <AlimtalkLogList logs={detail.alimtalkLogs} />
          </section>

          {/* 배정된 계정 — 아이디·비밀번호·OTP 시크릿까지 (시크릿 동기화는 주문 관리에서) */}
          {detail.dramaAccount && (
            <section className="space-y-2">
              <h3 className="text-body-md font-semibold text-text-primary">계정 정보</h3>
              <PartyAccountCredentials credentials={detail.dramaAccount} />
            </section>
          )}

          {/* 고객 안내 양식 — 확정 건에만. 제목만 보고 복사해 채팅으로 전달한다 */}
          {detail.status === 'confirmed' && <CustomerGuideSection detail={detail} />}

          {/* 액션 (대기 상태에서만) */}
          {detail.status === 'pending' && (
            <div className="space-y-3 border-t border-border pt-4">
              <AutoAssignToggle
                detail={detail}
                checked={autoAssign}
                disabled={
                  !canAutoAssign ||
                  autoAssignSetting.isLoading ||
                  approveMutation.isPending ||
                  rejectMutation.isPending
                }
                onChange={autoAssignSetting.save}
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

/**
 * 미리보기 후보를 자격증명 블록이 받는 형태로 맞춘다.
 * 아직 배정 전이라 실제 배정 계정과 다를 수 있으므로 tentative로 표시한다.
 * secretMismatch/ambiguous는 배정 이후에만 생기는 상태라 여기선 항상 false다.
 */
function toPreviewCredentials(account: AssignedDramaAccount): PartyAccountCredentialsType {
  return {
    source: 'assigned',
    accountId: account.id,
    email: account.email,
    password: account.password,
    otpSecret: account.otpSecret,
    platform: account.platform,
    dueAt: account.dueAt,
    secretMismatch: false,
    ambiguous: false,
  }
}

type AutoAssignToggleProps = {
  detail: AdminApplicationDetail
  checked: boolean
  disabled: boolean
  onChange: (next: boolean) => void
}

/**
 * 승인 시 계정 자동 배정 토글.
 * 배정 가능할 때는 어떤 계정이 나갈지 미리 보여주고, 불가할 때는 사유를 보여주며 꺼진 채로 잠긴다.
 */
function AutoAssignToggle({ detail, checked, disabled, onChange }: AutoAssignToggleProps) {
  const { eligible, reason, account } = detail.autoAssignPreview

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
        <span className="text-body-md font-medium text-text-primary">승인 시 계정 자동 배정</span>
        {!eligible && <Badge variant="gray">자동 배정 불가</Badge>}
      </label>

      {eligible && account ? (
        <div className="mt-2 pl-6">
          <PartyAccountCredentials credentials={toPreviewCredentials(account)} tentative />
          <p className="text-caption-sm mt-1 text-text-muted">빈자리 {account.freeSlots}개</p>
        </div>
      ) : (
        <p className="text-caption-md mt-1.5 pl-6 text-danger">
          ⚠ {describeAutoAssignReason(reason)}
        </p>
      )}
    </div>
  )
}

/**
 * 고객 안내 양식 — 제목 버튼만 두고 누르면 본문이 클립보드에 담긴다.
 * 본문을 화면에 펼치지 않는 이유: 관리자는 어떤 양식인지만 알면 되고, 모달이 길어지면 승인 버튼이 밀린다.
 */
function CustomerGuideSection({ detail }: { detail: AdminApplicationDetail }) {
  // 저장된 expiresAt이 곧 실제 이용 종료일이다 — 만료 크론·OTP 발급 가능 판정·유저 마이페이지가
  // 모두 이 값만 본다. 다시 계산한 값을 쓰면 고객이 보는 기간과 안내가 어긋난다.
  // 없으면(이론상 확정 건엔 없음) 날짜를 비워 관리자가 직접 채우게 둔다.
  const expiresAtLabel = detail.expiresAt ? formatMonthDay(detail.expiresAt) : ''
  const account = detail.dramaAccount
  const templates = PARTY_MESSAGE_TEMPLATES.filter(
    (template) => !template.sharedOnly || detail.product.partyType === 'shared',
  )

  return (
    <section className="space-y-2 border-t border-border pt-4">
      <h3 className="text-body-md font-semibold text-text-primary">고객 안내 양식</h3>
      <p className="text-caption-sm text-text-muted">
        누르면 본문이 복사됩니다. 채팅에 붙여넣어 전달해 주세요.
      </p>
      <div className="flex flex-wrap gap-2">
        {account?.email && account.password && (
          <CopyTextButton
            label="아이디·비밀번호"
            variant="primary"
            getText={() => buildAccountCredentialText(account.email ?? '', account.password ?? '')}
          />
        )}
        {templates.map((template) => (
          <CopyTextButton
            key={template.id}
            label={template.title}
            getText={() => template.build({ expiresAtLabel })}
          />
        ))}
      </div>
      {!expiresAtLabel && (
        <p className="text-caption-md text-warning">
          ⚠ 만료일을 알 수 없어 &quot;구매 안내사항&quot;의 이용 기간이 비어 있습니다. 붙여넣은 뒤 직접 채워
          주세요.
        </p>
      )}
    </section>
  )
}

/**
 * 파티 자체의 시작~종료 — 신청자 개인 기간(일정 섹션)과 헷갈리지 않게 파티 정보 쪽에 둔다.
 *
 * 기간 차감형은 늦게 들어온 사람도 이 종료일을 넘길 수 없어, 관리자가 "이 사람 며칠 받나"를
 * 판단하려면 이 값이 필요하다. 유지형은 각자 따로 계산되므로 참고용이다.
 */
function PartyPeriodRow({ detail }: { detail: AdminApplicationDetail }) {
  const { startedAt, partyExpiresAt, partyRemainingDays } = detail.product

  // 아직 아무도 승인되지 않은 파티는 종료일이 정해지지 않았다 (첫 승인 시각부터 센다)
  if (!startedAt || !partyExpiresAt) {
    return (
      <div className="flex items-center gap-3">
        <span className="text-body-md w-20 shrink-0 text-text-muted">파티 기간</span>
        <span className="text-body-md text-text-muted">시작 전 — 첫 승인 시점부터 시작됩니다</span>
      </div>
    )
  }

  const ended = partyRemainingDays === 0
  return (
    <div className="flex items-center gap-3">
      <span className="text-body-md w-20 shrink-0 text-text-muted">파티 기간</span>
      <span className="text-body-md text-text-primary">
        {formatDateOnly(startedAt)} ~ {formatDateOnly(partyExpiresAt)}
      </span>
      <Badge variant={ended ? 'red' : partyRemainingDays <= 3 ? 'yellow' : 'gray'}>
        {ended ? '종료' : `${partyRemainingDays}일 남음`}
      </Badge>
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
