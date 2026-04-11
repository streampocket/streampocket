'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { useSearchParams } from 'next/navigation'
import { Card, CardBody, CardFooter } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import type { BadgeVariant } from '@/components/ui/Badge'
import { formatDate } from '@/lib/utils'
import { useReviewCodes } from '../_hooks/useReviewCodes'
import { ReviewCodeBatchModal } from './ReviewCodeBatchModal'
import { ReviewCodeFormModal } from './ReviewCodeFormModal'
import { ReviewCodeStatusModal } from './ReviewCodeStatusModal'
import type { ReviewCode, ReviewCodeStatus } from '@/types/domain'

const PAGE_SIZE = 10

const STATUS_MAP: Record<ReviewCodeStatus, { label: string; variant: BadgeVariant }> = {
  unused: { label: '미사용', variant: 'gray' },
  used: { label: '사용', variant: 'green' },
}

export function ReviewCodesTable() {
  const searchParams = useSearchParams()
  const [editingCode, setEditingCode] = useState<ReviewCode | null | undefined>(undefined)
  const [isBatchOpen, setIsBatchOpen] = useState(false)
  const [statusCode, setStatusCode] = useState<ReviewCode | null>(null)

  const status = (searchParams.get('status') as ReviewCodeStatus) || undefined
  const gameName = searchParams.get('gameName') || undefined
  const dateOrder = (searchParams.get('dateOrder') as 'asc' | 'desc') || 'desc'
  const page = Number(searchParams.get('page') ?? 1)

  const { data, isLoading } = useReviewCodes({ status, gameName, dateOrder, page, pageSize: PAGE_SIZE })

  const isFormModalOpen = editingCode !== undefined

  return (
    <>
      <Card>
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <p className="text-caption-md text-text-secondary">
            총 <strong className="text-text-primary">{data?.total ?? 0}</strong>건
          </p>
          <div className="flex gap-2">
            <Button size="sm" variant="secondary" onClick={() => setIsBatchOpen(true)}>
              일괄 등록
            </Button>
            <Button size="sm" onClick={() => setEditingCode(null)}>
              + 코드 등록
            </Button>
          </div>
        </div>

        <CardBody className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-gray-50">
                  <th className="text-label-md px-5 py-3 text-left text-text-secondary">게임명</th>
                  <th className="text-label-md px-5 py-3 text-left text-text-secondary">코드</th>
                  <th className="text-label-md px-5 py-3 text-left text-text-secondary">상태</th>
                  <th className="text-label-md hidden px-5 py-3 text-left text-text-secondary md:table-cell">
                    받은 사람
                  </th>
                  <th className="text-label-md hidden px-5 py-3 text-left text-text-secondary md:table-cell">
                    등록일
                  </th>
                  <th className="text-label-md hidden px-5 py-3 text-left text-text-secondary md:table-cell">
                    사용일
                  </th>
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
                ) : data?.data.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-caption-md px-5 py-10 text-center text-text-muted">
                      코드가 없습니다
                    </td>
                  </tr>
                ) : (
                  data?.data.map((item) => {
                    const s = STATUS_MAP[item.status]
                    return (
                      <tr
                        key={item.id}
                        className="border-b border-border last:border-0 hover:bg-gray-50"
                      >
                        <td className="text-body-md max-w-36 truncate px-5 py-3 text-text-primary">
                          {item.gameName}
                        </td>
                        <td className="px-5 py-3">
                          <span
                            className="cursor-pointer font-mono text-caption-md text-text-secondary transition-colors hover:text-text-primary"
                            onClick={() => {
                              navigator.clipboard.writeText(item.code)
                              toast.success('코드가 복사되었습니다.')
                            }}
                          >
                            {item.code}
                          </span>
                        </td>
                        <td className="px-5 py-3">
                          <Badge variant={s.variant}>{s.label}</Badge>
                        </td>
                        <td className="text-caption-md hidden px-5 py-3 text-text-secondary md:table-cell">
                          {item.usedBy ?? '-'}
                        </td>
                        <td className="text-caption-md hidden px-5 py-3 text-text-secondary md:table-cell">
                          {formatDate(item.createdAt)}
                        </td>
                        <td className="text-caption-md hidden px-5 py-3 text-text-secondary md:table-cell">
                          {item.usedAt ? formatDate(item.usedAt) : '-'}
                        </td>
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-1.5">
                            <Button
                              variant="secondary"
                              size="xs"
                              onClick={() => setEditingCode(item)}
                            >
                              수정
                            </Button>
                            <Button
                              variant={item.status === 'unused' ? 'primary' : 'secondary'}
                              size="xs"
                              onClick={() => setStatusCode(item)}
                            >
                              {item.status === 'unused' ? '사용' : '복원'}
                            </Button>
                          </div>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </CardBody>

        {data && data.totalPages > 1 && (
          <CardFooter>
            <div className="flex w-full items-center justify-center gap-2">
              <Button
                variant="secondary"
                size="xs"
                disabled={page <= 1}
                onClick={() => {
                  const params = new URLSearchParams(window.location.search)
                  params.set('page', String(page - 1))
                  window.history.pushState(null, '', `?${params.toString()}`)
                }}
              >
                이전
              </Button>
              <span className="text-caption-md text-text-secondary">
                {page} / {data.totalPages}
              </span>
              <Button
                variant="secondary"
                size="xs"
                disabled={page >= data.totalPages}
                onClick={() => {
                  const params = new URLSearchParams(window.location.search)
                  params.set('page', String(page + 1))
                  window.history.pushState(null, '', `?${params.toString()}`)
                }}
              >
                다음
              </Button>
            </div>
          </CardFooter>
        )}
      </Card>

      {isFormModalOpen && (
        <ReviewCodeFormModal
          reviewCode={editingCode}
          onClose={() => setEditingCode(undefined)}
        />
      )}

      {isBatchOpen && (
        <ReviewCodeBatchModal onClose={() => setIsBatchOpen(false)} />
      )}

      {statusCode && (
        <ReviewCodeStatusModal
          reviewCode={statusCode}
          onClose={() => setStatusCode(null)}
        />
      )}
    </>
  )
}
