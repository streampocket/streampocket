'use client'

import { useState } from 'react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { cn, formatDate } from '@/lib/utils'
import { usePartyOtpInfo } from '../_hooks/usePartyOtpInfo'
import { useSetPartyOtpSecret } from '../_hooks/useSetPartyOtpSecret'
import { useResetPartyOtpCount } from '../_hooks/useResetPartyOtpCount'

type PartyOtpSectionProps = {
  orderId: string
}

const secretInputClass = cn(
  'w-full rounded-lg border border-border bg-white px-3 py-2',
  'font-mono text-caption-md text-text-primary placeholder:text-text-muted',
  'outline-none transition-colors focus:border-brand focus:ring-2 focus:ring-brand-light',
)

// 파티 주문 상세 모달의 "OTP 발급" 탭 — 시크릿 등록/재등록, 발급 횟수, 초기화, 발급 로그(KST)
export function PartyOtpSection({ orderId }: PartyOtpSectionProps) {
  const { data: info, isLoading } = usePartyOtpInfo(orderId, true)
  const setSecretMutation = useSetPartyOtpSecret(orderId)
  const resetMutation = useResetPartyOtpCount(orderId)
  const [secretInput, setSecretInput] = useState('')

  if (isLoading || !info) {
    return <p className="py-8 text-center text-caption-md text-text-muted">로딩 중...</p>
  }

  if (!info.linked) {
    return (
      <div className="rounded-lg border border-border bg-gray-50 p-4">
        <p className="text-caption-md text-text-muted">
          이 주문은 파티 신청과 연결되어 있지 않습니다. (OTP 기능 도입 전에 생성된 주문)
        </p>
      </div>
    )
  }

  const handleSaveSecret = () => {
    const trimmed = secretInput.trim()
    if (trimmed === '') return
    setSecretMutation.mutate(trimmed, {
      onSuccess: () => setSecretInput(''),
    })
  }

  const handleReset = () => {
    if (window.confirm('발급 횟수를 초기화하시겠습니까?\n구매자에게 다시 3회가 부여됩니다. (발급 로그는 유지)')) {
      resetMutation.mutate()
    }
  }

  return (
    <div className="space-y-4">
      {/* 시크릿 등록 — 저장 후에는 원문을 다시 보여주지 않는다 */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-caption-md font-semibold text-text-primary">OTP 시크릿키</span>
          {info.secretRegistered ? (
            <Badge variant="green">등록됨</Badge>
          ) : (
            <Badge variant="gray">미등록</Badge>
          )}
          {info.secretRegistered && info.secretUpdatedAt && (
            <span className="text-caption-sm text-text-muted">
              {formatDate(info.secretUpdatedAt)} 등록
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={secretInput}
            onChange={(e) => setSecretInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSaveSecret()
            }}
            placeholder={
              info.secretRegistered
                ? '새 시크릿키 입력 시 교체됩니다 (Base32)'
                : 'Base32 시크릿키 붙여넣기'
            }
            autoComplete="off"
            spellCheck={false}
            className={secretInputClass}
          />
          <Button
            size="sm"
            variant="primary"
            disabled={secretInput.trim() === ''}
            loading={setSecretMutation.isPending}
            onClick={handleSaveSecret}
          >
            {info.secretRegistered ? '재등록' : '등록'}
          </Button>
        </div>
        <p className="text-caption-sm text-text-muted">
          시크릿은 암호화되어 저장되며, 저장 후에는 원문이 표시되지 않습니다. 구매자에게는 코드만 전달됩니다.
        </p>
      </div>

      {/* 발급 횟수 + 초기화 */}
      <div className="flex items-center justify-between rounded-lg border border-border px-3 py-2">
        <div className="flex items-center gap-2">
          <span className="text-caption-md text-text-muted">발급 횟수</span>
          <span
            className={cn(
              'text-body-md font-semibold tabular-nums',
              info.issueCount >= info.maxIssues ? 'text-danger' : 'text-text-primary',
            )}
          >
            {info.issueCount}/{info.maxIssues}
          </span>
        </div>
        <Button
          size="sm"
          variant="secondary"
          disabled={!info.secretRegistered || info.issueCount === 0}
          loading={resetMutation.isPending}
          onClick={handleReset}
        >
          횟수 초기화
        </Button>
      </div>

      {/* 발급 로그 — 발급·재발급 모두 1건씩 기록 (모든 발급이 횟수 차감) */}
      <div className="space-y-1.5">
        <p className="text-caption-md font-semibold text-text-primary">발급 로그</p>
        {info.logs.length === 0 ? (
          <p className="text-caption-md text-text-muted">아직 발급 이력이 없습니다.</p>
        ) : (
          <ul className="space-y-1">
            {info.logs.map((log, index) => (
              <li
                key={log.id}
                className="flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-1.5"
              >
                <span className="text-caption-sm text-text-muted">#{info.logs.length - index}</span>
                <span className="text-caption-md text-text-secondary">{formatDate(log.issuedAt)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
