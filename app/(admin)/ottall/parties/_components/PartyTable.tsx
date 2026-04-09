'use client'

import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card, CardBody, CardFooter } from '@/components/ui/Card'
import type { BadgeVariant } from '@/components/ui/Badge'
import type { OwnProduct, OwnProductStatus } from '@/types/domain'

type PartyTableProps = {
  parties: OwnProduct[]
  total: number
  page: number
  totalPages: number
  onPageChange: (page: number) => void
  onViewDetail: (id: string) => void
}

const STATUS_BADGE: Record<OwnProductStatus, { variant: BadgeVariant; label: string }> = {
  recruiting: { variant: 'green', label: '모집중' },
  closed: { variant: 'blue', label: '모집완료' },
  expired: { variant: 'gray', label: '만료' },
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
}

function formatPrice(amount: number): string {
  return amount.toLocaleString('ko-KR')
}

export function PartyTable({
  parties,
  total,
  page,
  totalPages,
  onPageChange,
  onViewDetail,
}: PartyTableProps) {
  if (parties.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="text-body-md text-text-muted">파티가 없습니다.</p>
      </div>
    )
  }

  return (
    <Card>
      <div className="px-5 py-4">
        <p className="text-body-md text-text-secondary">총 {total}건</p>
      </div>

      <CardBody className="p-0">
        {/* 데스크탑 테이블 */}
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="text-caption-md px-4 py-3 font-medium text-text-muted">파티명</th>
                <th className="text-caption-md px-4 py-3 font-medium text-text-muted">카테고리</th>
                <th className="text-caption-md px-4 py-3 font-medium text-text-muted">파티장</th>
                <th className="text-caption-md px-4 py-3 font-medium text-text-muted">가격</th>
                <th className="text-caption-md px-4 py-3 font-medium text-text-muted">모집 현황</th>
                <th className="text-caption-md px-4 py-3 font-medium text-text-muted">상태</th>
                <th className="text-caption-md px-4 py-3 font-medium text-text-muted">생성일</th>
                <th className="text-caption-md px-4 py-3 font-medium text-text-muted">액션</th>
              </tr>
            </thead>
            <tbody>
              {parties.map((party) => {
                const badge = STATUS_BADGE[party.status]
                return (
                  <tr
                    key={party.id}
                    className="border-b border-border transition-colors hover:bg-gray-50"
                  >
                    <td className="text-body-md px-4 py-3 font-medium text-text-primary">
                      {party.name}
                    </td>
                    <td className="text-body-md px-4 py-3 text-text-secondary">
                      {party.category.name}
                    </td>
                    <td className="text-body-md px-4 py-3 text-text-secondary">
                      {party.user.name}
                    </td>
                    <td className="text-body-md px-4 py-3 text-text-secondary">
                      {party.currentPrice != null && party.currentPrice < party.price ? (
                        <span>
                          <span className="text-text-muted line-through">{formatPrice(party.price)}</span>{' '}
                          <span className="font-medium text-brand">{formatPrice(party.currentPrice)}원</span>
                        </span>
                      ) : (
                        <span>{formatPrice(party.price)}원</span>
                      )}
                    </td>
                    <td className="text-body-md px-4 py-3 text-text-secondary">
                      <span className="font-medium text-text-primary">{party.filledSlots}</span>
                      /{party.totalSlots}명
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={badge.variant}>{badge.label}</Badge>
                    </td>
                    <td className="text-body-md px-4 py-3 text-text-muted">
                      {formatDate(party.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => onViewDetail(party.id)}
                      >
                        상세
                      </Button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* 모바일 카드 */}
        <div className="space-y-3 p-4 md:hidden">
          {parties.map((party) => {
            const badge = STATUS_BADGE[party.status]
            return (
              <button
                key={party.id}
                type="button"
                onClick={() => onViewDetail(party.id)}
                className="w-full rounded-lg border border-border bg-card-bg p-4 text-left transition-colors hover:bg-gray-50"
              >
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-body-md font-medium text-text-primary">{party.name}</span>
                  <Badge variant={badge.variant}>{badge.label}</Badge>
                </div>
                <p className="text-caption-md text-text-secondary">
                  {party.category.name} · {party.user.name}
                </p>
                <p className="text-caption-md mt-1 text-text-secondary">
                  {party.currentPrice != null && party.currentPrice < party.price
                    ? `${formatPrice(party.currentPrice)}원(원가 ${formatPrice(party.price)}원)`
                    : `${formatPrice(party.price)}원`} · {party.filledSlots}/{party.totalSlots}명
                </p>
                <p className="text-caption-sm mt-1 text-text-muted">
                  {formatDate(party.createdAt)}
                </p>
              </button>
            )
          })}
        </div>
      </CardBody>

      {totalPages > 1 && (
        <CardFooter className="flex items-center justify-center gap-2 px-5 py-4">
          <Button
            variant="secondary"
            size="sm"
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
          >
            이전
          </Button>
          <span className="text-body-md text-text-secondary">
            {page} / {totalPages}
          </span>
          <Button
            variant="secondary"
            size="sm"
            disabled={page >= totalPages}
            onClick={() => onPageChange(page + 1)}
          >
            다음
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}
