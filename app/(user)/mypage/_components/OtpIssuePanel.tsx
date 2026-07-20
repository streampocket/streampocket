'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import { PARTY_OTP_MAX_ISSUES } from '@/constants/app'
import { useIssuePartyOtp } from '../_hooks/useIssuePartyOtp'
import type { OtpIssueResult } from '../_types'

const RING_RADIUS = 26
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS

type OtpIssuePanelProps = {
  applicationId: string
  otpRegistered: boolean
  otpIssueCount: number
}

// 확정 + 이용 기간 중인 신청 카드에서만 렌더 (조건은 부모에서 판정)
// 발급·재발급 모두 3회 한도에서 1회씩 차감. 코드는 발급당 1개(교체 없음), 카운트다운은 항상 30초부터.
// 발급된 코드는 10분(viewExpiresAt)까지 표시 유지
export function OtpIssuePanel({ applicationId, otpRegistered, otpIssueCount }: OtpIssuePanelProps) {
  const issueMutation = useIssuePartyOtp(applicationId)
  const [result, setResult] = useState<OtpIssueResult | null>(null)
  // 코드 유효시간 만료 시각(ms) — expiresIn(초)을 수신 시점 기준 절대 시각으로 환산해 카운트다운
  const [codeExpiresAt, setCodeExpiresAt] = useState<number>(0)
  const [remaining, setRemaining] = useState<number>(0)

  useEffect(() => {
    if (!result) return
    const viewExpiresAtMs = new Date(result.viewExpiresAt).getTime()
    const tick = () => {
      const now = Date.now()
      setRemaining(Math.max(0, Math.ceil((codeExpiresAt - now) / 1000)))
      // 표시 유지 시간(10분) 경과 → 패널 초기화 (발급 버튼 상태로 복귀)
      if (now >= viewExpiresAtMs) {
        setResult(null)
      }
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [result, codeExpiresAt])

  const handleIssue = async () => {
    try {
      const res = await issueMutation.mutateAsync()
      setResult(res.data)
      setCodeExpiresAt(Date.now() + res.data.expiresIn * 1000)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'OTP 발급에 실패했습니다.'
      toast.error(message)
    }
  }

  const handleCopy = async () => {
    if (!result) return
    try {
      await navigator.clipboard.writeText(result.code)
      toast.success('코드 복사됨')
    } catch {
      toast.error('복사에 실패했습니다.')
    }
  }

  if (!otpRegistered) {
    return (
      <div className="rounded-lg border border-border bg-gray-50 px-3 py-2">
        <p className="text-caption-md text-text-muted">
          OTP 준비 중입니다 — 관리자에게 문의 주세요.
        </p>
      </div>
    )
  }

  if (!result) {
    const remainingIssues = PARTY_OTP_MAX_ISSUES - otpIssueCount
    if (remainingIssues <= 0) {
      return (
        <div className="rounded-lg border border-border bg-gray-50 px-3 py-2">
          <p className="text-caption-md text-text-muted">
            OTP 발급 횟수를 모두 사용했습니다. 관리자에게 문의 주세요.
          </p>
        </div>
      )
    }
    return (
      <div className="space-y-1.5">
        <Button
          variant="primary"
          className="w-full"
          onClick={handleIssue}
          disabled={issueMutation.isPending}
        >
          {issueMutation.isPending ? '발급 중...' : `OTP 발급 (${remainingIssues}회 남음)`}
        </Button>
        <p className="text-caption-md text-text-muted">
          발급한 코드는 10분 동안 표시됩니다. 재발급 시 횟수가 1회 차감됩니다.
        </p>
      </div>
    )
  }

  const codeExpired = remaining <= 0
  const isLow = remaining <= 5
  const ringOffset = RING_CIRCUMFERENCE * (1 - Math.min(remaining, 30) / 30)

  return (
    <div className="space-y-2 rounded-lg border border-border p-3">
      <div className="flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={handleCopy}
          className="group flex flex-col items-start gap-0.5 text-left"
          title="클릭하여 복사"
        >
          <span
            className={cn(
              'text-heading-lg font-mono tracking-widest tabular-nums group-hover:text-brand',
              codeExpired ? 'text-text-muted line-through' : 'text-text-primary',
            )}
          >
            {result.code.slice(0, 3)} {result.code.slice(3)}
          </span>
          <span className="text-caption-md text-text-muted">클릭하여 복사</span>
        </button>

        {codeExpired ? (
          result.remaining > 0 ? (
            <Button
              variant="primary"
              size="sm"
              onClick={handleIssue}
              disabled={issueMutation.isPending}
            >
              {issueMutation.isPending ? '발급 중...' : `재발급 (${result.remaining}회 남음)`}
            </Button>
          ) : null
        ) : (
          <div className="relative h-16 w-16 shrink-0">
            <svg className="h-16 w-16 -rotate-90" viewBox="0 0 60 60">
              <circle cx="30" cy="30" r={RING_RADIUS} fill="none" strokeWidth="4" className="stroke-gray-200" />
              <circle
                cx="30"
                cy="30"
                r={RING_RADIUS}
                fill="none"
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray={RING_CIRCUMFERENCE}
                strokeDashoffset={ringOffset}
                className={cn('transition-[stroke-dashoffset] duration-1000 ease-linear', isLow ? 'stroke-danger' : 'stroke-brand')}
              />
            </svg>
            <span
              className={cn(
                'text-body-md absolute inset-0 flex items-center justify-center font-semibold tabular-nums',
                isLow ? 'text-danger' : 'text-text-primary',
              )}
            >
              {remaining}
            </span>
          </div>
        )}
      </div>
      {codeExpired ? (
        result.remaining > 0 ? (
          <p className="text-caption-md text-text-muted">
            코드 유효시간이 지났습니다. 재발급 시 횟수가 1회 차감됩니다. ({result.remaining}회 남음)
          </p>
        ) : (
          <p className="text-caption-md text-danger">
            발급 횟수를 모두 사용했습니다. 관리자에게 문의 주세요.
          </p>
        )
      ) : (
        <p className="text-caption-md text-text-muted">
          발급 {result.remaining}회 남음 · 코드는 10분 동안 표시됩니다.
        </p>
      )}
    </div>
  )
}
