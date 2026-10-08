'use client'

import { useEffect, useState } from 'react'
import { Card, CardHeader, CardBody } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { formatWon } from '@/lib/points'
import { getTodayStringKST } from '@/lib/utils'
import { useSystemSettings } from '../_hooks/useSystemSettings'
import type { RenewalDiscount } from '@/types/domain'

/**
 * 재구매 이벤트 — 원할 때만 켜는 정액 할인.
 * 기간을 넣어 두면 그 기간에만 자동 적용된다(비우면 켜 둔 동안 계속). 연휴 이벤트를 미리 걸어 두고 잊어도
 * 끝나면 알아서 꺼진 것처럼 동작한다 — 스위치를 직접 끄지 않아도 된다.
 */
export function RenewalDiscountSettings() {
  const { query, mutation } = useSystemSettings()
  const [draft, setDraft] = useState<RenewalDiscount | null>(null)

  useEffect(() => {
    if (query.data) setDraft(query.data.renewalDiscount)
  }, [query.data])

  const saved = query.data?.renewalDiscount
  const isUnchanged =
    draft !== null &&
    saved !== undefined &&
    draft.enabled === saved.enabled &&
    draft.amount === saved.amount &&
    draft.startDate === saved.startDate &&
    draft.endDate === saved.endDate
  // 'YYYY-MM-DD'는 사전순 = 날짜순. 서버도 막지만 저장 전에 알려주는 게 낫다
  const rangeInvalid =
    draft !== null && draft.startDate !== null && draft.endDate !== null && draft.startDate > draft.endDate
  const amountMissing = draft !== null && draft.enabled && draft.amount <= 0

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <h2 className="text-heading-md text-text-primary">재구매 이벤트</h2>
          {saved && <StatusBadge discount={saved} />}
        </div>
      </CardHeader>
      <CardBody>
        <p className="text-caption-sm mb-3 text-text-muted">
          이용 중인 <b>기간 유지형</b> 파티를 재구매(기간 연장)할 때 정가에서 빼 주는 할인입니다. 할인액은
          재구매를 <b>요청하는 순간</b> 확정되므로, 바꾼 값은 다음 요청부터 적용되고 이미 요청한 건은 그대로입니다.
        </p>

        {query.isLoading || !draft ? (
          <p className="text-caption-md text-text-muted">불러오는 중...</p>
        ) : (
          <div className="space-y-3">
            <label className="flex items-center justify-between rounded-lg border border-border bg-surface-secondary px-4 py-3">
              <div>
                <p className="text-body-md font-semibold text-text-primary">이벤트 켜기</p>
                <p className="text-caption-md text-text-muted">끄면 기간과 관계없이 할인하지 않습니다.</p>
              </div>
              <input
                type="checkbox"
                className="h-4 w-4 accent-brand"
                checked={draft.enabled}
                onChange={(e) => setDraft({ ...draft, enabled: e.target.checked })}
              />
            </label>

            <div className="flex flex-wrap items-center gap-2">
              <span className="text-body-md w-20 shrink-0 text-text-muted">할인 금액</span>
              <label className="flex w-40 items-center gap-1.5">
                <input
                  type="text"
                  name="renewalDiscountAmount"
                  inputMode="numeric"
                  value={draft.amount.toLocaleString('ko-KR')}
                  onChange={(e) =>
                    setDraft({ ...draft, amount: Number(e.target.value.replace(/[^\d]/g, '')) || 0 })
                  }
                  className="border-border focus:border-brand text-body-md w-full rounded-lg border px-2.5 py-1.5 text-right tabular-nums outline-none"
                />
                <span className="text-caption-md shrink-0 text-text-muted">원</span>
              </label>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="text-body-md w-20 shrink-0 text-text-muted">이벤트 기간</span>
              <DateInput
                name="renewalDiscountStartDate"
                value={draft.startDate}
                onChange={(v) => setDraft({ ...draft, startDate: v })}
              />
              <span className="text-text-muted">~</span>
              <DateInput
                name="renewalDiscountEndDate"
                value={draft.endDate}
                onChange={(v) => setDraft({ ...draft, endDate: v })}
              />
            </div>
            <p className="text-caption-sm text-text-muted">
              기간은 한국 시간 기준 시작일 00:00 ~ 종료일 23:59입니다. 비워 두면 그쪽은 제한이 없습니다.
            </p>

            {rangeInvalid && (
              <p className="text-caption-md text-danger">시작일이 종료일보다 늦습니다. 이대로면 할인이 적용되지 않습니다.</p>
            )}
            {amountMissing && (
              <p className="text-caption-md text-warning">이벤트를 켜려면 할인 금액을 입력해 주세요.</p>
            )}

            <div className="flex justify-end">
              <Button
                onClick={() => mutation.mutate({ renewalDiscount: draft })}
                loading={mutation.isPending}
                disabled={rangeInvalid || amountMissing || isUnchanged}
              >
                저장
              </Button>
            </div>
          </div>
        )}
      </CardBody>
    </Card>
  )
}

/** 저장된 설정 기준 "지금 적용 중인지" — 서버 판정(resolveRenewalDiscount)과 같은 날짜 비교 */
function StatusBadge({ discount }: { discount: RenewalDiscount }) {
  if (!discount.enabled || discount.amount <= 0) return <Badge variant="gray">꺼짐</Badge>
  const today = getTodayStringKST()
  if (discount.startDate && today < discount.startDate) return <Badge variant="yellow">예약됨</Badge>
  if (discount.endDate && today > discount.endDate) return <Badge variant="gray">기간 종료</Badge>
  return <Badge variant="green">진행 중 · {formatWon(discount.amount)} 할인</Badge>
}

function DateInput({
  name,
  value,
  onChange,
}: {
  name: string
  value: string | null
  onChange: (value: string | null) => void
}) {
  return (
    <input
      type="date"
      name={name}
      value={value ?? ''}
      onChange={(e) => onChange(e.target.value === '' ? null : e.target.value)}
      className="border-border focus:border-brand text-body-md rounded-lg border px-2.5 py-1.5 outline-none"
    />
  )
}
