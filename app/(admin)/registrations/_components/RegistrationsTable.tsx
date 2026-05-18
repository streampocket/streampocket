'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Card, CardBody } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import type { BadgeVariant } from '@/components/ui/Badge'
import { formatDate } from '@/lib/utils'
import type { SteamRegistrationMatchStatus, SteamRegistrationStatus } from '@/types/domain'
import { useRegistrations } from '../_hooks/useRegistrations'
import { RegistrationDetailModal } from './RegistrationDetailModal'

const STATUS_VALUES = ['received', 'needs_info', 'completed']
const MATCH_VALUES = ['unmatched', 'auto_matched', 'manual_matched']

const STATUS_MAP: Record<SteamRegistrationStatus, { label: string; variant: BadgeVariant }> = {
  received: { label: '접수됨', variant: 'blue' },
  needs_info: { label: '정보 부족', variant: 'yellow' },
  completed: { label: '완료', variant: 'green' },
}

const MATCH_MAP: Record<SteamRegistrationMatchStatus, { label: string; variant: BadgeVariant }> = {
  unmatched: { label: '미연결', variant: 'gray' },
  auto_matched: { label: '자동매칭', variant: 'green' },
  manual_matched: { label: '수동연결', variant: 'blue' },
}

export function RegistrationsTable() {
  const searchParams = useSearchParams()
  const rawStatus = searchParams.get('status') ?? ''
  const rawMatch = searchParams.get('matchStatus') ?? ''
  const status = STATUS_VALUES.includes(rawStatus) ? rawStatus : undefined
  const matchStatus = MATCH_VALUES.includes(rawMatch) ? rawMatch : undefined

  const { data, isLoading } = useRegistrations({ status, matchStatus })
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const rows = data?.data ?? []

  return (
    <>
      <Card>
        <div className="border-b border-border px-5 py-4">
          <p className="text-caption-md text-text-secondary">
            총 <strong className="text-text-primary">{data?.total ?? 0}</strong>건
          </p>
        </div>

        <CardBody className="p-0">
          {/* 데스크탑 테이블 */}
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-gray-50">
                  <th className="text-label-md px-5 py-3 text-left text-text-secondary">접수일시</th>
                  <th className="text-label-md px-5 py-3 text-left text-text-secondary">구매자</th>
                  <th className="text-label-md px-5 py-3 text-left text-text-secondary">게임</th>
                  <th className="text-label-md px-5 py-3 text-left text-text-secondary">상태</th>
                  <th className="text-label-md px-5 py-3 text-left text-text-secondary">매칭</th>
                  <th className="text-label-md px-5 py-3 text-left text-text-secondary">연결 주문</th>
                  <th className="text-label-md px-5 py-3 text-left text-text-secondary"></th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={7} className="text-caption-md px-5 py-10 text-center text-text-muted">
                      로딩 중...
                    </td>
                  </tr>
                ) : rows.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-caption-md px-5 py-10 text-center text-text-muted">
                      접수 내역이 없습니다
                    </td>
                  </tr>
                ) : (
                  rows.map((row) => {
                    const st = STATUS_MAP[row.status]
                    const mt = MATCH_MAP[row.matchStatus]
                    return (
                      <tr
                        key={row.id}
                        className="border-b border-border last:border-0 hover:bg-gray-50"
                      >
                        <td className="text-caption-md px-5 py-3 text-text-secondary">
                          {formatDate(row.createdAt)}
                        </td>
                        <td className="text-caption-md px-5 py-3 text-text-primary">
                          {row.buyerName ?? <span className="text-text-muted">미파악</span>}
                        </td>
                        <td className="text-caption-md px-5 py-3 text-text-secondary">
                          {row.gameName ?? <span className="text-text-muted">미파악</span>}
                        </td>
                        <td className="px-5 py-3">
                          <Badge variant={st.variant}>{st.label}</Badge>
                        </td>
                        <td className="px-5 py-3">
                          <Badge variant={mt.variant}>{mt.label}</Badge>
                        </td>
                        <td className="font-mono text-caption-md px-5 py-3 text-text-secondary">
                          {row.orderItem?.productOrderId ?? '-'}
                        </td>
                        <td className="px-5 py-3">
                          <Button variant="secondary" size="xs" onClick={() => setSelectedId(row.id)}>
                            상세
                          </Button>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* 모바일 카드 */}
          <div className="space-y-3 p-4 md:hidden">
            {isLoading ? (
              <p className="py-8 text-center text-text-muted">로딩 중...</p>
            ) : rows.length === 0 ? (
              <p className="py-8 text-center text-text-muted">접수 내역이 없습니다</p>
            ) : (
              rows.map((row) => {
                const st = STATUS_MAP[row.status]
                const mt = MATCH_MAP[row.matchStatus]
                return (
                  <button
                    key={row.id}
                    type="button"
                    onClick={() => setSelectedId(row.id)}
                    className="w-full rounded-lg border border-border bg-card-bg p-4 text-left transition-colors hover:bg-gray-50"
                  >
                    <div className="mb-2 flex items-center justify-between gap-2">
                      <span className="text-body-md font-medium text-text-primary">
                        {row.buyerName ?? '미파악'}
                      </span>
                      <div className="flex shrink-0 gap-1">
                        <Badge variant={st.variant}>{st.label}</Badge>
                        <Badge variant={mt.variant}>{mt.label}</Badge>
                      </div>
                    </div>
                    <p className="text-caption-md text-text-secondary">
                      {row.gameName ?? '게임 미파악'}
                    </p>
                    <p className="text-caption-sm text-text-muted">{formatDate(row.createdAt)}</p>
                  </button>
                )
              })
            )}
          </div>
        </CardBody>
      </Card>

      <RegistrationDetailModal
        registrationId={selectedId}
        onClose={() => setSelectedId(null)}
      />
    </>
  )
}
