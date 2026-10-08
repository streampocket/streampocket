'use client'

import { useState } from 'react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { useUserProfile } from '@/hooks/useUserProfile'
import { formatPoint, formatWon, payableAmount, usablePoint } from '@/lib/points'
import { formatDateOnly } from '@/lib/utils'
import { useRenewalQuote, useRequestRenewal } from '../_hooks/usePartyRenewal'
import type { MyApplication } from '../_types'

/**
 * 구매내역 카드의 재구매(기간 연장) 영역.
 * 이용 중인 기간 유지형 파티만 보인다(서버가 renewable로 판정). 승인 대기 중이면 버튼 대신 대기 안내.
 * 같은 계정·자리를 그대로 이어 쓰고, 관리자가 승인하면 만료일이 늘어난다.
 */
export function RenewalPanel({ application }: { application: MyApplication }) {
  const [open, setOpen] = useState(false)
  const [usePoint, setUsePoint] = useState(false)
  const pending = application.pendingRenewal
  const { data: quote } = useRenewalQuote(application.id, application.renewable && !pending)
  const { data: profile } = useUserProfile({ enabled: open })
  const requestMutation = useRequestRenewal(application.id)

  if (!application.renewable) return null

  if (pending) {
    return (
      <div className="flex items-center justify-between rounded-lg border border-border bg-gray-50 px-3 py-2">
        <span className="text-caption-md text-text-secondary">
          재구매 승인 대기중 · 결제 {formatWon(pending.payableAmount)}
        </span>
        <Badge variant="yellow">대기중</Badge>
      </div>
    )
  }

  const pointBalance = profile?.pointBalance ?? 0
  const pointToUse = quote ? usablePoint(pointBalance, quote.totalAmount) : 0

  const handleSubmit = () => {
    requestMutation.mutate(usePoint && pointToUse > 0, {
      onSuccess: () => {
        setOpen(false)
        setUsePoint(false)
      },
    })
  }

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border px-3 py-2">
        <span className="text-caption-md text-text-secondary">
          같은 계정으로 {application.product.durationDays}일 더 이용할 수 있어요.
        </span>
        <div className="flex items-center gap-1.5">
          {quote && quote.discount > 0 && (
            <Badge variant="pink">재구매 {formatWon(quote.discount)} 할인</Badge>
          )}
          <Button size="sm" variant="primary" onClick={() => setOpen(true)} disabled={!quote}>
            재구매 요청
          </Button>
        </div>
      </div>

      <Modal isOpen={open} onClose={() => setOpen(false)} title="재구매 요청">
        {!quote ? (
          <p className="text-body-md py-6 text-center text-text-muted">불러오는 중...</p>
        ) : (
          <div className="space-y-4">
            <div>
              <p className="text-body-lg font-semibold text-text-primary">{application.product.name}</p>
              <p className="text-caption-md text-text-muted">
                같은 계정·자리 그대로 {quote.durationDays}일 연장됩니다.
              </p>
            </div>

            <div className="space-y-1 rounded-lg border border-border px-3 py-2 text-body-md">
              <Row label="현재 만료" value={quote.currentExpiresAt ? formatDateOnly(quote.currentExpiresAt) : '-'} />
              <Row label="연장 후 만료(예상)" value={formatDateOnly(quote.expiresAtIfApproved)} />
              <p className="text-caption-sm pt-1 text-text-muted">
                관리자 승인 후 연장됩니다. 만료 전에 승인되면 지금 만료일부터 이어지고, 만료 후 승인되면 승인 시점부터
                {` ${quote.durationDays}일`}입니다.
              </p>
            </div>

            <div className="space-y-1 rounded-lg bg-gray-50 p-3 text-body-md">
              <Row label="정가" value={formatWon(quote.price)} />
              {quote.discount > 0 && (
                <Row label="재구매 할인" value={`-${formatWon(quote.discount)}`} accent />
              )}
              <Row label="수수료" value={formatWon(quote.fee)} />
              {usePoint && pointToUse > 0 && <Row label="포인트 사용" value={`-${formatPoint(pointToUse)}`} accent />}
              <div className="flex justify-between border-t border-border pt-1.5 font-bold text-text-primary">
                <span>결제 금액</span>
                <span>{formatWon(payableAmount(quote.totalAmount, usePoint ? pointToUse : 0))}</span>
              </div>
            </div>

            {/* 잔액이 없으면 숨긴다 — 0P짜리 빈 체크박스가 보이면 혼란만 준다 (파티 신청과 같은 규칙) */}
            {pointToUse > 0 && (
              <label className="flex cursor-pointer items-start gap-2">
                <input
                  type="checkbox"
                  checked={usePoint}
                  onChange={(e) => setUsePoint(e.target.checked)}
                  className="mt-1 h-4 w-4 shrink-0 rounded border-gray-300 text-brand focus:ring-brand"
                />
                <span className="text-body-md text-text-secondary">
                  보유 포인트 사용 <b className="text-text-primary">{formatPoint(pointBalance)}</b>
                </span>
              </label>
            )}

            <div className="flex justify-end gap-2 border-t border-border pt-3">
              <Button variant="secondary" onClick={() => setOpen(false)} disabled={requestMutation.isPending}>
                취소
              </Button>
              <Button variant="primary" onClick={handleSubmit} loading={requestMutation.isPending}>
                재구매 요청하기
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </>
  )
}

function Row({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex justify-between text-text-secondary">
      <span>{label}</span>
      <span className={accent ? 'text-brand' : undefined}>{value}</span>
    </div>
  )
}
