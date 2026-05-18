'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/Badge'
import type { BadgeVariant } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { cn, formatDate } from '@/lib/utils'
import type {
  SteamRegistration,
  SteamRegistrationMatchStatus,
  SteamRegistrationStatus,
} from '@/types/domain'
import { useUpdateRegistration } from '@/hooks/useUpdateRegistration'

const inputClass = cn(
  'w-full rounded-lg border border-border bg-white px-3 py-2',
  'text-body-md text-text-primary placeholder:text-text-muted',
  'outline-none transition-colors focus:border-brand focus:ring-2 focus:ring-brand-light',
)

const MATCH_STATUS_MAP: Record<
  SteamRegistrationMatchStatus,
  { label: string; variant: BadgeVariant }
> = {
  unmatched: { label: '미연결', variant: 'gray' },
  auto_matched: { label: '자동매칭', variant: 'green' },
  manual_matched: { label: '수동연결', variant: 'blue' },
}

const STATUS_MAP: Record<SteamRegistrationStatus, { label: string; variant: BadgeVariant }> = {
  received: { label: '접수됨', variant: 'blue' },
  needs_info: { label: '정보 부족', variant: 'yellow' },
  completed: { label: '완료', variant: 'green' },
}

const FIELD_LABEL_KO: Record<string, string> = {
  steamId: '스팀 ID',
  steamPassword: '스팀 비밀번호',
  gameName: '구매하신 게임',
  buyerName: '구매자 성함',
}

type GuardSelectValue = '' | 'true' | 'false'

// 스팀 등록 접수의 파싱 항목을 표시·수정하는 폼.
// 주문 상세 모달과 접수 관리 페이지에서 공용으로 사용한다.
export function RegistrationEditFields({ registration }: { registration: SteamRegistration }) {
  const { mutate: update, isPending: isSaving } = useUpdateRegistration()

  const [steamId, setSteamId] = useState('')
  const [steamPassword, setSteamPassword] = useState('')
  const [gameName, setGameName] = useState('')
  const [buyerName, setBuyerName] = useState('')
  const [steamGuardCodes, setSteamGuardCodes] = useState('')
  const [steamGuardDisabled, setSteamGuardDisabled] = useState<GuardSelectValue>('')
  const [refundConsent, setRefundConsent] = useState(false)
  const [adminMemo, setAdminMemo] = useState('')

  useEffect(() => {
    setSteamId(registration.steamId ?? '')
    setSteamPassword(registration.steamPassword ?? '')
    setGameName(registration.gameName ?? '')
    setBuyerName(registration.buyerName ?? '')
    setSteamGuardCodes(registration.steamGuardCodes ?? '')
    setSteamGuardDisabled(
      registration.steamGuardDisabled === null
        ? ''
        : registration.steamGuardDisabled
          ? 'true'
          : 'false',
    )
    setRefundConsent(registration.refundConsent)
    setAdminMemo(registration.adminMemo ?? '')
  }, [registration])

  const handleCopy = async (value: string) => {
    if (!value) return
    try {
      await navigator.clipboard.writeText(value)
      toast.success('복사되었습니다.')
    } catch {
      toast.error('복사에 실패했습니다.')
    }
  }

  const guardValue: boolean | null = steamGuardDisabled === '' ? null : steamGuardDisabled === 'true'
  const isDirty =
    steamId.trim() !== (registration.steamId ?? '') ||
    steamPassword.trim() !== (registration.steamPassword ?? '') ||
    gameName.trim() !== (registration.gameName ?? '') ||
    buyerName.trim() !== (registration.buyerName ?? '') ||
    steamGuardCodes.trim() !== (registration.steamGuardCodes ?? '') ||
    guardValue !== registration.steamGuardDisabled ||
    refundConsent !== registration.refundConsent ||
    adminMemo.trim() !== (registration.adminMemo ?? '')

  const handleSave = () => {
    update({
      id: registration.id,
      steamId: steamId.trim() ? steamId.trim() : null,
      steamPassword: steamPassword.trim() ? steamPassword.trim() : null,
      gameName: gameName.trim() ? gameName.trim() : null,
      buyerName: buyerName.trim() ? buyerName.trim() : null,
      steamGuardCodes: steamGuardCodes.trim() ? steamGuardCodes.trim() : null,
      steamGuardDisabled: guardValue,
      refundConsent,
      adminMemo: adminMemo.trim() ? adminMemo.trim() : null,
    })
  }

  const matchStatus = MATCH_STATUS_MAP[registration.matchStatus]
  const status = STATUS_MAP[registration.status]

  return (
    <div className="space-y-3 rounded-lg border border-border bg-surface-secondary p-3">
      <div className="flex items-center justify-between gap-2">
        <p className="text-caption-md font-semibold text-text-primary">스팀 등록 접수</p>
        <div className="flex shrink-0 items-center gap-1">
          <Badge variant={status.variant}>{status.label}</Badge>
          <Badge variant={matchStatus.variant}>{matchStatus.label}</Badge>
        </div>
      </div>

      <p className="text-caption-sm text-text-muted">
        접수일시: {formatDate(registration.createdAt)}
      </p>

      {registration.missingFields.length > 0 && (
        <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-2">
          <p className="text-caption-md text-text-primary">
            누락 항목:{' '}
            {registration.missingFields.map((field) => FIELD_LABEL_KO[field] ?? field).join(', ')}
          </p>
        </div>
      )}

      {[
        { label: '스팀 ID', value: steamId, setValue: setSteamId, saved: registration.steamId },
        {
          label: '스팀 비밀번호',
          value: steamPassword,
          setValue: setSteamPassword,
          saved: registration.steamPassword,
        },
      ].map(({ label, value, setValue, saved }) => (
        <div key={label}>
          <label className="text-caption-md mb-1 block text-text-muted">{label}</label>
          <div className="flex gap-2">
            <input className={inputClass} value={value} onChange={(e) => setValue(e.target.value)} />
            <Button
              size="sm"
              variant="secondary"
              disabled={!saved}
              onClick={() => saved && handleCopy(saved)}
            >
              복사
            </Button>
            <Button size="sm" variant="secondary" disabled={!value} onClick={() => setValue('')}>
              ✕
            </Button>
          </div>
        </div>
      ))}

      <div>
        <label className="text-caption-md mb-1 block text-text-muted">구매하신 게임</label>
        <input className={inputClass} value={gameName} onChange={(e) => setGameName(e.target.value)} />
      </div>

      <div>
        <label className="text-caption-md mb-1 block text-text-muted">구매자 성함</label>
        <input className={inputClass} value={buyerName} onChange={(e) => setBuyerName(e.target.value)} />
      </div>

      <div>
        <label className="text-caption-md mb-1 block text-text-muted">스팀 가드 코드 (1회용)</label>
        <div className="flex gap-2">
          <input
            className={inputClass}
            value={steamGuardCodes}
            onChange={(e) => setSteamGuardCodes(e.target.value)}
          />
          <Button
            size="sm"
            variant="secondary"
            disabled={!registration.steamGuardCodes}
            onClick={() => registration.steamGuardCodes && handleCopy(registration.steamGuardCodes)}
          >
            복사
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-caption-md mb-1 block text-text-muted">스팀 가드 해제 여부</label>
          <select
            className={inputClass}
            value={steamGuardDisabled}
            onChange={(e) => {
              const next = e.target.value
              setSteamGuardDisabled(next === 'true' || next === 'false' ? next : '')
            }}
          >
            <option value="">미확인</option>
            <option value="true">해제함</option>
            <option value="false">해제 안 함</option>
          </select>
        </div>
        <div>
          <label className="text-caption-md mb-1 block text-text-muted">환불 불가 동의</label>
          <select
            className={inputClass}
            value={refundConsent ? 'true' : 'false'}
            onChange={(e) => setRefundConsent(e.target.value === 'true')}
          >
            <option value="true">동의함</option>
            <option value="false">미동의</option>
          </select>
        </div>
      </div>

      <div>
        <label className="text-caption-md mb-1 block text-text-muted">관리자 메모</label>
        <textarea
          className={cn(inputClass, 'min-h-20 resize-y')}
          rows={3}
          maxLength={2000}
          placeholder="자유 메모 (최대 2000자)"
          value={adminMemo}
          onChange={(e) => setAdminMemo(e.target.value)}
        />
      </div>

      <details>
        <summary className="text-caption-md cursor-pointer text-text-muted">원본 메시지 보기</summary>
        <pre className="mt-1 max-h-48 overflow-auto whitespace-pre-wrap rounded-lg border border-border bg-white p-2 text-caption-sm text-text-secondary">
          {registration.rawMessage}
        </pre>
      </details>

      <div className="flex justify-end">
        <Button
          size="sm"
          variant="primary"
          disabled={!isDirty}
          loading={isSaving}
          onClick={handleSave}
        >
          저장
        </Button>
      </div>
    </div>
  )
}
