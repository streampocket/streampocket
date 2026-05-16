'use client'

import { useEffect, useState } from 'react'
import { Card, CardHeader, CardBody } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { DURATION_OPTIONS } from '@/constants/app'
import { cn } from '@/lib/utils'
import { useSystemSettings } from '../_hooks/useSystemSettings'

export function SystemSettings() {
  const { query, mutation } = useSystemSettings()
  const [selected, setSelected] = useState<number | null>(null)

  useEffect(() => {
    if (query.data) setSelected(query.data.defaultDurationMinutes)
  }, [query.data])

  const handleSave = () => {
    if (selected === null) return
    mutation.mutate({ defaultDurationMinutes: selected })
  }

  const isUnchanged = selected === query.data?.defaultDurationMinutes

  return (
    <Card>
      <CardHeader>
        <h2 className="text-heading-md text-text-primary">진행중 기본 소요시간</h2>
      </CardHeader>
      <CardBody>
        <p className="mb-3 text-caption-sm text-text-muted">
          주문을 &lsquo;진행중&rsquo;으로 전환할 때 적용되는 전역 기본 소요시간입니다. 구매자
          진행상황 페이지의 카운트다운에 사용되며, 이미 진행중인 주문에는 영향을 주지 않습니다.
        </p>
        {query.isLoading ? (
          <p className="text-caption-md text-text-muted">불러오는 중...</p>
        ) : (
          <>
            <div className="flex flex-wrap gap-2">
              {DURATION_OPTIONS.map((opt) => (
                <button
                  key={opt.minutes}
                  type="button"
                  onClick={() => setSelected(opt.minutes)}
                  className={cn(
                    'rounded-lg border px-4 py-2 text-body-md transition-colors',
                    selected === opt.minutes
                      ? 'border-brand bg-brand font-semibold text-white'
                      : 'border-border bg-card-bg text-text-primary hover:border-brand',
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            <Button
              variant="primary"
              loading={mutation.isPending}
              disabled={selected === null || isUnchanged}
              onClick={handleSave}
              className="mt-4"
            >
              저장
            </Button>
          </>
        )}
      </CardBody>
    </Card>
  )
}
