'use client'

import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card, CardBody, CardFooter } from '@/components/ui/Card'
import type { BadgeVariant } from '@/components/ui/Badge'
import type { AuthProvider } from '@/types/domain'
import type { AdminUserListItem } from '../_types'

type UserTableProps = {
  users: AdminUserListItem[]
  total: number
  page: number
  totalPages: number
  onPageChange: (page: number) => void
  onViewDetail: (id: string) => void
}

const PROVIDER_BADGE: Record<AuthProvider, { variant: BadgeVariant; label: string }> = {
  local: { variant: 'gray', label: '일반' },
  kakao: { variant: 'yellow', label: '카카오' },
  google: { variant: 'blue', label: '구글' },
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
}

export function UserTable({
  users,
  total,
  page,
  totalPages,
  onPageChange,
  onViewDetail,
}: UserTableProps) {
  if (users.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="text-body-md text-text-muted">회원이 없습니다.</p>
      </div>
    )
  }

  return (
    <Card>
      <div className="px-5 py-4">
        <p className="text-body-md text-text-secondary">총 {total}명</p>
      </div>

      <CardBody className="p-0">
        {/* 데스크탑 테이블 */}
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="text-caption-md px-4 py-3 font-medium text-text-muted">이름</th>
                <th className="text-caption-md px-4 py-3 font-medium text-text-muted">이메일</th>
                <th className="text-caption-md px-4 py-3 font-medium text-text-muted">전화번호</th>
                <th className="text-caption-md px-4 py-3 font-medium text-text-muted">가입방식</th>
                <th className="text-caption-md px-4 py-3 font-medium text-text-muted">파트너</th>
                <th className="text-caption-md px-4 py-3 font-medium text-text-muted">상품</th>
                <th className="text-caption-md px-4 py-3 font-medium text-text-muted">파티</th>
                <th className="text-caption-md px-4 py-3 font-medium text-text-muted">가입일</th>
                <th className="text-caption-md px-4 py-3 font-medium text-text-muted">액션</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => {
                const providerBadge = PROVIDER_BADGE[user.provider]
                return (
                  <tr
                    key={user.id}
                    className="border-b border-border transition-colors hover:bg-gray-50"
                  >
                    <td className="text-body-md px-4 py-3 font-medium text-text-primary">
                      {user.name}
                    </td>
                    <td className="text-body-md px-4 py-3 text-text-secondary">{user.email}</td>
                    <td className="text-body-md px-4 py-3 text-text-secondary">{user.phone}</td>
                    <td className="px-4 py-3">
                      <Badge variant={providerBadge.variant}>{providerBadge.label}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      {user.hasPartner ? (
                        <Badge variant="green">Y</Badge>
                      ) : (
                        <span className="text-body-md text-text-muted">-</span>
                      )}
                    </td>
                    <td className="text-body-md px-4 py-3 text-text-secondary">
                      {user._count.ownProducts}
                    </td>
                    <td className="text-body-md px-4 py-3 text-text-secondary">
                      {user._count.partyApplications}
                    </td>
                    <td className="text-body-md px-4 py-3 text-text-muted">
                      {formatDate(user.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => onViewDetail(user.id)}
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
          {users.map((user) => {
            const providerBadge = PROVIDER_BADGE[user.provider]
            return (
              <button
                key={user.id}
                type="button"
                onClick={() => onViewDetail(user.id)}
                className="w-full rounded-lg border border-border bg-card-bg p-4 text-left transition-colors hover:bg-gray-50"
              >
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-body-md font-medium text-text-primary">{user.name}</span>
                  <Badge variant={providerBadge.variant}>{providerBadge.label}</Badge>
                </div>
                <p className="text-caption-md text-text-secondary">{user.email}</p>
                <p className="text-caption-md text-text-secondary">{user.phone}</p>
                <div className="mt-2 flex gap-3">
                  <span className="text-caption-md text-text-muted">
                    상품 {user._count.ownProducts}
                  </span>
                  <span className="text-caption-md text-text-muted">
                    파티 {user._count.partyApplications}
                  </span>
                  {user.hasPartner && (
                    <Badge variant="green">파트너</Badge>
                  )}
                </div>
                <p className="text-caption-sm mt-1 text-text-muted">{formatDate(user.createdAt)}</p>
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
