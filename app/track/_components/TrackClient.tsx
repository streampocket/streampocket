'use client'

import { useState } from 'react'
import type { FormEvent } from 'react'
import { Card, CardBody } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { KAKAO_OPEN_CHAT_URL } from '@/constants/app'
import { formatDate } from '@/lib/utils'
import { useOrderTracking } from '../_hooks/useOrderTracking'
import { resolveTrackView } from '../_types'
import type { OrderTracking } from '../_types'
import { OrderStepIndicator } from './OrderStepIndicator'

export function TrackClient() {
  const [input, setInput] = useState('')
  const [queryId, setQueryId] = useState<string | null>(null)
  const { data, isLoading, isError, error } = useOrderTracking(queryId)

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const trimmed = input.trim()
    if (trimmed) setQueryId(trimmed)
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardBody>
          <form onSubmit={handleSubmit} className="space-y-3">
            <label htmlFor="productOrderId" className="block text-caption-md text-text-secondary">
              상품주문번호
            </label>
            <input
              id="productOrderId"
              type="text"
              inputMode="numeric"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="네이버 상품주문번호를 입력하세요"
              aria-describedby="productOrderId-hint"
              className="w-full rounded-lg border border-border bg-gray-50 px-4 py-3 text-body-md text-text-primary outline-none transition-colors placeholder:text-text-muted focus:border-brand focus:bg-white"
            />
            <p id="productOrderId-hint" className="text-caption-sm text-text-muted">
              &lsquo;주문번호&rsquo;가 아닌 &lsquo;상품주문번호&rsquo;입니다. 판매자가 안내한 번호를
              입력해 주세요.
            </p>
            <Button
              type="submit"
              variant="primary"
              loading={isLoading}
              disabled={!input.trim()}
              className="w-full"
            >
              조회
            </Button>
          </form>
        </CardBody>
      </Card>

      {queryId && isError && (
        <Card>
          <CardBody>
            <p className="text-center text-body-md text-danger">
              {error instanceof Error ? error.message : '조회에 실패했습니다.'}
            </p>
          </CardBody>
        </Card>
      )}

      {queryId && data && <TrackResult productOrderId={queryId} data={data} />}
    </div>
  )
}

type TrackResultProps = {
  productOrderId: string
  data: OrderTracking
}

function TrackResult({ productOrderId, data }: TrackResultProps) {
  const view = resolveTrackView(data.fulfillmentStatus)

  return (
    <Card>
      <CardBody>
        <dl className="mb-5 space-y-1.5">
          <div className="flex justify-between gap-3">
            <dt className="shrink-0 text-caption-md text-text-muted">상품주문번호</dt>
            <dd className="text-right font-mono text-caption-md text-text-secondary">
              {productOrderId}
            </dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="shrink-0 text-caption-md text-text-muted">상품명</dt>
            <dd className="text-right text-caption-md text-text-primary">{data.productName}</dd>
          </div>
          {data.paidAt && (
            <div className="flex justify-between gap-3">
              <dt className="shrink-0 text-caption-md text-text-muted">결제일시</dt>
              <dd className="text-right text-caption-md text-text-secondary">
                {formatDate(data.paidAt)}
              </dd>
            </div>
          )}
        </dl>

        {view.kind === 'step' && (
          <>
            <OrderStepIndicator currentStep={view.step} done={view.done} />
            <p className="mt-5 text-center text-body-md font-semibold text-text-primary">
              {view.done
                ? '처리가 완료되었습니다.'
                : view.step === 1
                  ? '주문이 접수되어 처리를 기다리고 있어요.'
                  : '주문을 처리하고 있어요. 잠시만 기다려 주세요.'}
            </p>
            {!view.done && (
              <p className="mt-1 text-center text-caption-md text-text-muted">
                상태가 바뀌면 자동으로 갱신됩니다.
              </p>
            )}
          </>
        )}

        {view.kind === 'cancelled' && (
          <div className="rounded-lg border border-border bg-gray-50 p-4 text-center">
            <p className="text-body-md font-semibold text-text-primary">
              취소·환불 처리된 주문입니다.
            </p>
            <p className="mt-1 text-caption-md text-text-muted">
              {data.returnedAt ? `${formatDate(data.returnedAt)} 처리됨` : ''}
            </p>
          </div>
        )}

        {view.kind === 'inquiry' && (
          <div className="rounded-lg border border-border bg-gray-50 p-4 text-center">
            <p className="text-body-md font-semibold text-text-primary">
              확인이 필요한 주문입니다.
            </p>
            <p className="mt-1 text-caption-md text-text-muted">
              처리 중 확인이 필요한 사항이 있어요. 고객센터로 문의해 주세요.
            </p>
            <a
              href={KAKAO_OPEN_CHAT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-block rounded-lg bg-brand px-4 py-2 text-caption-md font-semibold text-white transition-colors hover:bg-brand-dark"
            >
              고객센터 문의하기
            </a>
          </div>
        )}
      </CardBody>
    </Card>
  )
}
