'use client'

import { useEffect, useState } from 'react'
import { Card, CardHeader, CardBody } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { formatPoint, formatWon } from '@/lib/points'
import { useSystemSettings } from '../_hooks/useSystemSettings'
import type { ReviewPointTiers } from '@/types/domain'

// 구간 개수는 3으로 고정이다 — 가변이면 추가·삭제·순서·겹침 검증이 전부 붙는데,
// 실제 결제액이 두 덩어리로 몰려 있어 잘게 나눌 값어치가 없다. 그래서 입력칸 5개짜리 폼이다.
export function ReviewPointSettings() {
  const { query, mutation } = useSystemSettings()
  const [tiers, setTiers] = useState<ReviewPointTiers | null>(null)

  useEffect(() => {
    if (query.data) setTiers(query.data.reviewPointTiers)
  }, [query.data])

  const setField = (key: keyof ReviewPointTiers, value: string) => {
    setTiers((prev) => (prev ? { ...prev, [key]: Number(value.replace(/[^\d]/g, '')) || 0 } : prev))
  }

  // 경계가 뒤집히면 2구간이 영영 안 나간다. 서버도 막지만 저장 전에 알려주는 게 낫다
  const boundaryInvalid = tiers !== null && tiers.tier1Max >= tiers.tier2Max
  const isUnchanged =
    tiers !== null &&
    query.data !== undefined &&
    (Object.keys(tiers) as (keyof ReviewPointTiers)[]).every(
      (key) => tiers[key] === query.data.reviewPointTiers[key],
    )

  return (
    <Card>
      <CardHeader>
        <h2 className="text-heading-md text-text-primary">리뷰 적립 포인트</h2>
      </CardHeader>
      <CardBody>
        <p className="text-caption-sm mb-3 text-text-muted">
          리뷰를 쓰면 지급하는 포인트입니다. <b>실결제액</b>(총액 − 사용한 포인트) 기준이라,
          포인트로 깎아서 산 건은 그만큼 낮은 구간이 적용됩니다. 바꾼 값은 다음 지급부터 적용되고
          이미 지급된 건은 그대로입니다.
        </p>

        {query.isLoading || !tiers ? (
          <p className="text-caption-md text-text-muted">불러오는 중...</p>
        ) : (
          <>
            <div className="space-y-2">
              <TierRow
                label="1구간"
                boundary={
                  <NumberInput
                    name="tier1Max"
                    value={tiers.tier1Max}
                    onChange={(v) => setField('tier1Max', v)}
                    suffix="원 이하"
                  />
                }
                point={
                  <NumberInput
                    name="tier1Point"
                    value={tiers.tier1Point}
                    onChange={(v) => setField('tier1Point', v)}
                    suffix="P"
                  />
                }
              />
              <TierRow
                label="2구간"
                boundary={
                  <NumberInput
                    name="tier2Max"
                    value={tiers.tier2Max}
                    onChange={(v) => setField('tier2Max', v)}
                    suffix="원 이하"
                  />
                }
                point={
                  <NumberInput
                    name="tier2Point"
                    value={tiers.tier2Point}
                    onChange={(v) => setField('tier2Point', v)}
                    suffix="P"
                  />
                }
              />
              <TierRow
                label="3구간"
                boundary={
                  <span className="text-body-md text-text-secondary">
                    {formatWon(tiers.tier2Max)} 초과
                  </span>
                }
                point={
                  <NumberInput
                    name="tier3Point"
                    value={tiers.tier3Point}
                    onChange={(v) => setField('tier3Point', v)}
                    suffix="P"
                  />
                }
              />
            </div>

            {boundaryInvalid && (
              <p className="text-caption-md mt-2 text-danger">
                1구간 상한은 2구간 상한보다 작아야 합니다. 지금 값이면 2구간({formatPoint(tiers.tier2Point)})이
                영영 지급되지 않습니다.
              </p>
            )}

            <div className="mt-4 flex justify-end">
              <Button
                onClick={() => mutation.mutate({ reviewPointTiers: tiers })}
                loading={mutation.isPending}
                disabled={boundaryInvalid || isUnchanged}
              >
                저장
              </Button>
            </div>
          </>
        )}
      </CardBody>
    </Card>
  )
}

function TierRow({
  label,
  boundary,
  point,
}: {
  label: string
  boundary: React.ReactNode
  point: React.ReactNode
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-body-md w-14 shrink-0 text-text-muted">{label}</span>
      <div className="min-w-40 flex-1">{boundary}</div>
      <span className="text-text-muted">→</span>
      <div className="w-28">{point}</div>
    </div>
  )
}

function NumberInput({
  name,
  value,
  onChange,
  suffix,
}: {
  name: string
  value: number
  onChange: (value: string) => void
  suffix: string
}) {
  return (
    <label className="flex items-center gap-1.5">
      <input
        type="text"
        name={name}
        inputMode="numeric"
        value={value.toLocaleString('ko-KR')}
        onChange={(e) => onChange(e.target.value)}
        className="border-border focus:border-brand text-body-md w-full rounded-lg border px-2.5 py-1.5 text-right tabular-nums outline-none"
      />
      <span className="text-caption-md shrink-0 text-text-muted">{suffix}</span>
    </label>
  )
}
