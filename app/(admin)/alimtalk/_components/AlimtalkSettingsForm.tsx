'use client'

import { useEffect, useState } from 'react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card, CardBody, CardFooter, CardHeader } from '@/components/ui/Card'
import { useAlimtalkSettings } from '../_hooks/useAlimtalkSettings'

export function AlimtalkSettingsForm() {
  const { query, mutation, testMutation } = useAlimtalkSettings()
  const [enabled, setEnabled] = useState(true)

  useEffect(() => {
    if (!query.data) {
      return
    }

    setEnabled(query.data.enabled)
  }, [query.data])

  const runtime = query.data?.runtime
  const templates = runtime?.templates ?? []
  const isDirty = enabled !== (query.data?.enabled ?? true)

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div>
            <h2 className="text-heading-sm text-text-primary">알림톡 운영 설정</h2>
            <p className="mt-1 text-caption-md text-text-muted">
              주문 자동 처리 시 알리고 알림톡 발송 여부를 제어합니다.
            </p>
          </div>
          {runtime && (
            <Badge variant={runtime.providerConnected ? 'green' : 'red'}>
              {runtime.providerConnected ? '연결 정상' : '연결 확인 필요'}
            </Badge>
          )}
        </CardHeader>
        <CardBody className="space-y-5">
          <label className="flex items-center justify-between rounded-lg border border-border bg-surface-secondary px-4 py-3">
            <div>
              <p className="text-body-md font-semibold text-text-primary">알림톡 자동 발송</p>
              <p className="text-caption-md text-text-muted">
                꺼두면 주문은 수동 처리 상태로 전환됩니다.
              </p>
            </div>
            <input
              type="checkbox"
              className="h-4 w-4 accent-brand"
              checked={enabled}
              onChange={(event) => setEnabled(event.target.checked)}
            />
          </label>
        </CardBody>
        <CardFooter>
          <div className="flex w-full items-center justify-between gap-3">
            <p className="text-caption-md text-text-muted">
              테스트 전송은 현재 설정된 발신번호로 수행됩니다.
            </p>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                loading={testMutation.isPending}
                onClick={() => testMutation.mutate()}
              >
                전송 점검
              </Button>
              <Button
                loading={mutation.isPending}
                disabled={!isDirty}
                onClick={() => mutation.mutate({ enabled })}
              >
                저장
              </Button>
            </div>
          </div>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="text-heading-sm text-text-primary">알리고 연동 상태</h2>
          {runtime && <span className="text-caption-md text-text-muted">{runtime.providerMessage}</span>}
        </CardHeader>
        <CardBody className="grid gap-3 md:grid-cols-2">
          <InfoRow label="API Key 설정" value={runtime?.apiKeyConfigured ? '설정됨' : '미설정'} />
          <InfoRow label="User ID" value={runtime?.userId ?? '-'} />
          <InfoRow label="발신 프로필 키" value={runtime?.senderKey ?? '-'} />
          <InfoRow label="템플릿 코드 (NA)" value={runtime?.templateCodeNA ?? '-'} />
          <InfoRow label="템플릿 코드 (AA)" value={runtime?.templateCodeAA ?? '-'} />
          <InfoRow label="템플릿 코드 (NA 2차이메일)" value={runtime?.templateCodeNASecondary ?? '-'} />
          <InfoRow label="템플릿 코드 (NA 재고없음 안내)" value={runtime?.templateCodeNAOutOfStock ?? '-'} />
          <InfoRow label="템플릿 코드 (리뷰게임)" value={runtime?.templateCodeReviewGame ?? '-'} />
          <InfoRow label="템플릿 코드 (선물 접수 완료)" value={runtime?.templateCodeGiftCompleted ?? '-'} />
          <InfoRow label="발신번호" value={runtime?.sender ?? '-'} />
          <InfoRow
            label="선택 템플릿"
            value={runtime?.activeTemplate?.templateName ?? runtime?.activeTemplate?.templateCode ?? '-'}
          />
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="text-heading-sm text-text-primary">등록된 알림톡 템플릿</h2>
          <span className="text-caption-md text-text-muted">알리고에 등록된 템플릿 목록입니다.</span>
        </CardHeader>
        <CardBody className="space-y-3">
          {templates.length === 0 ? (
            <p className="text-caption-md text-text-muted">조회된 템플릿이 없습니다.</p>
          ) : (
            templates.map((template, index) => {
              const isActive =
                template.templateCode === runtime?.templateCodeNA ||
                template.templateCode === runtime?.templateCodeAA ||
                template.templateCode === runtime?.templateCodeNASecondary ||
                template.templateCode === runtime?.templateCodeNAOutOfStock ||
                template.templateCode === runtime?.templateCodeReviewGame ||
                template.templateCode === runtime?.templateCodeGiftCompleted

              return (
                <div
                  key={template.templateCode ?? template.templateName ?? `template-${index}`}
                  className="rounded-lg border border-border bg-card-bg p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-body-md font-semibold text-text-primary">
                          {template.templateName ?? '이름 없음'}
                        </p>
                        {isActive && <Badge variant="blue">사용 중</Badge>}
                      </div>
                      <p className="mt-1 font-mono text-caption-md text-text-secondary">
                        {template.templateCode ?? '-'}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant={template.status === 'APR' ? 'green' : 'yellow'}>
                        상태: {template.status ?? '-'}
                      </Badge>
                      <Badge variant={template.inspectStatus === 'APR' ? 'green' : 'gray'}>
                        검수: {template.inspectStatus ?? '-'}
                      </Badge>
                    </div>
                  </div>
                  <pre className="mt-3 whitespace-pre-wrap rounded-lg bg-surface-secondary p-3 text-caption-md text-text-secondary">
                    {template.templateContent ?? '템플릿 본문 없음'}
                  </pre>
                </div>
              )
            })
          )}
        </CardBody>
      </Card>
    </div>
  )
}

type InfoRowProps = {
  label: string
  value: string
}

function InfoRow({ label, value }: InfoRowProps) {
  return (
    <div className="rounded-lg border border-border bg-card-bg px-4 py-3">
      <p className="text-caption-md text-text-muted">{label}</p>
      <p className="mt-1 font-mono text-caption-md text-text-primary">{value}</p>
    </div>
  )
}
