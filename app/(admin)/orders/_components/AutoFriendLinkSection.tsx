'use client'

import { useEffect, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import { QUERY_KEYS } from '@/constants/queryKeys'
import type { SteamOrderItem } from '@/types/domain'
import { useOrderRegistration } from '../_hooks/useOrderRegistration'
import {
  useAutoFriendLink,
  type AuthType,
  type GuardOptions,
} from '../_hooks/useAutoFriendLink'
import { useSubmitGuardCode } from '../_hooks/useSubmitGuardCode'
import { useGuardConfirmPoll } from '../_hooks/useGuardConfirmPoll'

const inputClass = cn(
  'w-full rounded-lg border border-border bg-white px-3 py-2',
  'text-body-md text-text-primary placeholder:text-text-muted',
  'outline-none transition-colors focus:border-brand focus:ring-2 focus:ring-brand-light',
)

const AUTH_TYPE_OPTIONS: { value: AuthType; label: string }[] = [
  { value: 'guard_disabled', label: '가드 해제' },
  { value: 'backup_code', label: '백업코드' },
  { value: 'guard_live', label: '인증번호(반자동)' },
]

// 저장된 등록 접수(formVariant/steamGuardDisabled)로부터 인증 방식 추론
function authTypeFromRegistration(
  formVariant: string | null,
  steamGuardDisabled: boolean | null,
): AuthType {
  if (formVariant === 'A') return 'backup_code'
  if (formVariant === 'C') return 'guard_live'
  if (formVariant === 'B' || steamGuardDisabled) return 'guard_disabled'
  return 'guard_disabled'
}

type AutoFriendLinkSectionProps = {
  order: SteamOrderItem
}

// 주문 상세 모달의 '친구링크 자동' 탭 내용 — 자격증명 입력 → 로그인 → 친구링크 2개 생성·저장
export function AutoFriendLinkSection({ order }: AutoFriendLinkSectionProps) {
  const queryClient = useQueryClient()
  const { data: registration } = useOrderRegistration(order.id)

  const [steamId, setSteamId] = useState('')
  const [steamPassword, setSteamPassword] = useState('')
  const [authType, setAuthType] = useState<AuthType>('guard_disabled')
  const [backupCode, setBackupCode] = useState('')

  // 양식 C 진행 상태
  const [guardSessionId, setGuardSessionId] = useState<string | null>(null)
  const [guardOptions, setGuardOptions] = useState<GuardOptions | null>(null)
  const [guardCode, setGuardCode] = useState('')

  // 저장된 자격증명 프리필
  useEffect(() => {
    if (!registration) return
    setSteamId(registration.steamId ?? '')
    setSteamPassword(registration.steamPassword ?? '')
    setAuthType(
      authTypeFromRegistration(registration.formVariant, registration.steamGuardDisabled),
    )
    setBackupCode(registration.steamGuardCodes ?? '')
  }, [registration])

  const autoFetch = useAutoFriendLink(order.id)
  const submitCode = useSubmitGuardCode(order.id)
  const poll = useGuardConfirmPoll(
    order.id,
    guardSessionId,
    guardOptions?.confirmation ?? false,
  )

  const resetGuard = (): void => {
    setGuardSessionId(null)
    setGuardOptions(null)
    setGuardCode('')
  }

  // 폰 승인 완료 감지 → 세션 초기화(폴링 중단). 주문 무효화는 폴링 응답 자체로 충분치 않아 수동 처리.
  useEffect(() => {
    if (poll.data?.status === 'completed') {
      toast.success('폰 승인 완료 — 친구링크 2개를 저장했습니다.')
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.orders.detail(order.id) })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.orders.all() })
      resetGuard()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [poll.data?.status])

  const handleFetch = (): void => {
    if (!steamId.trim() || !steamPassword.trim()) {
      toast.error('스팀 ID와 비밀번호를 입력하세요.')
      return
    }
    if (authType === 'backup_code' && !backupCode.trim()) {
      toast.error('백업코드를 입력하세요.')
      return
    }
    resetGuard()
    autoFetch.mutate(
      {
        steamId: steamId.trim(),
        steamPassword,
        authType,
        ...(authType === 'backup_code' ? { backupCode: backupCode.trim() } : {}),
      },
      {
        onSuccess: (res) => {
          if (res.data.status === 'guard_required') {
            setGuardSessionId(res.data.sessionId)
            setGuardOptions(res.data.guardOptions)
            if (res.data.guardOptions.confirmation) {
              toast.info('구매자가 스팀 모바일 앱에서 로그인 승인을 누르면 자동 완료됩니다.')
            } else {
              toast.info('구매자에게 받은 인증번호를 입력하세요.')
            }
          }
        },
      },
    )
  }

  const handleSubmitCode = (): void => {
    if (!guardSessionId || !guardCode.trim()) return
    submitCode.mutate(
      { sessionId: guardSessionId, code: guardCode.trim() },
      { onSuccess: () => resetGuard() },
    )
  }

  const showCodeInput = guardSessionId !== null && !!guardOptions?.codeType
  const showConfirmWait = guardSessionId !== null && !!guardOptions?.confirmation
  const codeTypeLabel = guardOptions?.codeType === 'email' ? '이메일' : '스팀 앱'

  return (
    <div className="space-y-3 rounded-lg border border-border bg-surface-secondary p-3">
      <div>
        <p className="text-caption-md font-semibold text-text-primary">친구링크 자동 가져오기</p>
        <p className="text-caption-sm mt-0.5 text-text-muted">
          구매자 자격증명으로 로그인해 친구추가 링크 2개를 생성·저장합니다. 입력값은 주문에 저장됩니다.
        </p>
      </div>

      <div>
        <label className="text-caption-md mb-1 block text-text-muted">스팀 ID</label>
        <input
          className={inputClass}
          placeholder="스팀 로그인 아이디"
          value={steamId}
          autoComplete="off"
          onChange={(e) => setSteamId(e.target.value)}
        />
      </div>

      <div>
        <label className="text-caption-md mb-1 block text-text-muted">스팀 비밀번호</label>
        <input
          className={inputClass}
          type="password"
          placeholder="스팀 비밀번호"
          value={steamPassword}
          autoComplete="off"
          onChange={(e) => setSteamPassword(e.target.value)}
        />
      </div>

      <div>
        <label className="text-caption-md mb-1 block text-text-muted">인증 방식</label>
        <select
          className={inputClass}
          value={authType}
          onChange={(e) => {
            const v = e.target.value
            if (v === 'guard_disabled' || v === 'backup_code' || v === 'guard_live') {
              setAuthType(v)
            }
          }}
        >
          {AUTH_TYPE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {authType === 'backup_code' && (
        <div>
          <label className="text-caption-md mb-1 block text-text-muted">백업코드</label>
          <input
            className={inputClass}
            placeholder="모바일 인증기 백업코드 (1개)"
            value={backupCode}
            autoComplete="off"
            onChange={(e) => setBackupCode(e.target.value)}
          />
        </div>
      )}

      <div className="flex justify-end">
        <Button
          size="sm"
          variant="primary"
          loading={autoFetch.isPending}
          disabled={guardSessionId !== null}
          onClick={handleFetch}
        >
          친구링크 2개 가져오기
        </Button>
      </div>

      {/* 양식 C 코드 방식 — 인증번호 입력 */}
      {showCodeInput && (
        <div className="space-y-2 rounded-lg border border-brand-light bg-white p-3">
          <p className="text-caption-md text-text-secondary">
            {codeTypeLabel}로 전송된 인증번호를 입력하세요.
          </p>
          <div className="flex gap-2">
            <input
              className={inputClass}
              placeholder="인증번호"
              value={guardCode}
              autoComplete="off"
              onChange={(e) => setGuardCode(e.target.value)}
            />
            <Button
              size="sm"
              variant="primary"
              loading={submitCode.isPending}
              disabled={!guardCode.trim()}
              onClick={handleSubmitCode}
            >
              제출
            </Button>
          </div>
        </div>
      )}

      {/* 양식 C 승인 방식 — 폰 승인 대기(자동 감지) */}
      {showConfirmWait && (
        <div className="rounded-lg border border-brand-light bg-white p-3">
          <p className="text-caption-md text-text-secondary">
            📱 구매자가 스팀 모바일 앱에서 로그인 승인을 누르면 자동으로 완료됩니다. (자동 감지 중…)
          </p>
        </div>
      )}
    </div>
  )
}
