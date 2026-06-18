'use client'

import { useEffect, useState } from 'react'
import { STORES, STORE_META } from '@/constants/app'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card, CardBody, CardFooter, CardHeader } from '@/components/ui/Card'
import type { Store } from '@/types/domain'
import { useAlimtalkSettings } from '../_hooks/useAlimtalkSettings'

export function AlimtalkSettingsForm() {
  const [activeStore, setActiveStore] = useState<Store>('streampocket')

  return (
    <div className="space-y-6">
      <nav className="flex gap-2" aria-label="스토어 선택">
        {STORES.map((store) => {
          const isActive = store.value === activeStore
          return (
            <button
              key={store.value}
              type="button"
              onClick={() => setActiveStore(store.value)}
              className={`rounded-lg px-4 py-2 text-body-md font-semibold transition-colors ${
                isActive
                  ? 'bg-brand text-white'
                  : 'border border-border bg-card-bg text-text-secondary hover:bg-surface-secondary'
              }`}
            >
              {store.label}
            </button>
          )
        })}
      </nav>

      {/* key로 스토어 전환 시 패널을 리마운트 → 토글/펼침 로컬 상태 초기화 */}
      <StoreAlimtalkPanel key={activeStore} store={activeStore} />
    </div>
  )
}

type StoreAlimtalkPanelProps = {
  store: Store
}

function StoreAlimtalkPanel({ store }: StoreAlimtalkPanelProps) {
  const { query, mutation, testMutation } = useAlimtalkSettings(store)
  const [enabled, setEnabled] = useState(true)
  const [expandedCodes, setExpandedCodes] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (!query.data) {
      return
    }

    setEnabled(query.data.enabled)
  }, [query.data])

  const runtime = query.data?.runtime
  const templates = runtime?.templates ?? []
  const isDirty = enabled !== (query.data?.enabled ?? true)
  const storeLabel = STORE_META[store].label

  const toggleExpanded = (code: string) => {
    setExpandedCodes((prev) => {
      const next = new Set(prev)
      if (next.has(code)) {
        next.delete(code)
      } else {
        next.add(code)
      }
      return next
    })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div>
            <h2 className="text-heading-sm text-text-primary">{storeLabel} 알림톡 운영 설정</h2>
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
          {runtime && !runtime.apiKeyConfigured && (
            <p className="rounded-lg border border-border bg-surface-secondary px-4 py-3 text-caption-md text-danger">
              {storeLabel} 알리고 자격증명이 설정되지 않았습니다. 발송이 필요한 주문은 수동 처리로
              전환됩니다.
            </p>
          )}
          <label className="flex items-center justify-between rounded-lg border border-border bg-surface-secondary px-4 py-3">
            <div>
              <p className="text-body-md font-semibold text-text-primary">알림톡 자동 발송</p>
              <p className="text-caption-md text-text-muted">
                꺼두면 {storeLabel} 주문은 수동 처리 상태로 전환됩니다.
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
              테스트 전송은 {storeLabel}의 발신번호로 수행됩니다.
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
          <InfoRow label="템플릿 코드 (배틀그라운드)" value={runtime?.templateCodeBG ?? '-'} />
          <InfoRow label="템플릿 코드 (파티 신청)" value={runtime?.templateCodePartyApply ?? '-'} />
          <InfoRow label="템플릿 코드 (주문상황 조회)" value={runtime?.templateCodeOrderStatus ?? '-'} />
          <InfoRow label="템플릿 코드 (게임선물 완료)" value={runtime?.templateCodeOrderCompleted ?? '-'} />
          <InfoRow label="템플릿 코드 (휴대폰 인증)" value={runtime?.templateCodePhoneVerify ?? '-'} />
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
          <span className="text-caption-md text-text-muted">
            제목을 누르면 본문이 펼쳐집니다. ({templates.length}개)
          </span>
        </CardHeader>
        <CardBody className="space-y-3">
          {query.isLoading ? (
            <p className="text-caption-md text-text-muted">템플릿을 불러오는 중입니다…</p>
          ) : templates.length === 0 ? (
            <p className="text-caption-md text-text-muted">조회된 템플릿이 없습니다.</p>
          ) : (
            templates.map((template, index) => {
              const code = template.templateCode ?? template.templateName ?? `template-${index}`
              const isExpanded = expandedCodes.has(code)
              const isActive =
                template.templateCode === runtime?.templateCodeNA ||
                template.templateCode === runtime?.templateCodeAA ||
                template.templateCode === runtime?.templateCodeNASecondary ||
                template.templateCode === runtime?.templateCodeNAOutOfStock ||
                template.templateCode === runtime?.templateCodeReviewGame ||
                template.templateCode === runtime?.templateCodeBG ||
                template.templateCode === runtime?.templateCodePartyApply ||
                template.templateCode === runtime?.templateCodeOrderStatus ||
                template.templateCode === runtime?.templateCodeOrderCompleted ||
                template.templateCode === runtime?.templateCodePhoneVerify

              return (
                <div key={code} className="rounded-lg border border-border bg-card-bg">
                  <button
                    type="button"
                    onClick={() => toggleExpanded(code)}
                    aria-expanded={isExpanded}
                    className="flex w-full items-start justify-between gap-3 p-4 text-left"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-text-muted">{isExpanded ? '▾' : '▸'}</span>
                        <p className="text-body-md font-semibold text-text-primary">
                          {template.templateName ?? '이름 없음'}
                        </p>
                        {isActive && <Badge variant="blue">사용 중</Badge>}
                      </div>
                      <p className="mt-1 pl-5 font-mono text-caption-md text-text-secondary">
                        {template.templateCode ?? '-'}
                      </p>
                    </div>
                    <div className="flex shrink-0 gap-2">
                      <Badge variant={template.status === 'APR' ? 'green' : 'yellow'}>
                        상태: {template.status ?? '-'}
                      </Badge>
                      <Badge variant={template.inspectStatus === 'APR' ? 'green' : 'gray'}>
                        검수: {template.inspectStatus ?? '-'}
                      </Badge>
                    </div>
                  </button>
                  {isExpanded && (
                    <pre className="mx-4 mb-4 whitespace-pre-wrap rounded-lg bg-surface-secondary p-3 text-caption-md text-text-secondary">
                      {template.templateContent ?? '템플릿 본문 없음'}
                    </pre>
                  )}
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
