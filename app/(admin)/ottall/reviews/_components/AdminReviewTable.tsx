'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card, CardBody, CardFooter } from '@/components/ui/Card'
import { Modal } from '@/components/ui/Modal'
import { formatDateOnly } from '@/lib/utils'
import type { OwnAdminReview } from '@/types/domain'
import { useDeleteAdminOwnReview } from '../_hooks/useAdminOwnReviews'

type AdminReviewTableProps = {
  reviews: OwnAdminReview[]
  total: number
  page: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function AdminReviewTable({
  reviews,
  total,
  page,
  totalPages,
  onPageChange,
}: AdminReviewTableProps) {
  const deleteMutation = useDeleteAdminOwnReview()
  const [confirmId, setConfirmId] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  async function handleDelete(): Promise<void> {
    if (!confirmId) return
    try {
      await deleteMutation.mutateAsync(confirmId)
      setConfirmId(null)
    } catch (e) {
      setErrorMessage(e instanceof Error ? e.message : '리뷰 삭제에 실패했어요.')
    }
  }

  if (reviews.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="text-body-md text-text-muted">조건에 맞는 리뷰가 없어요.</p>
      </div>
    )
  }

  return (
    <Card>
      <div className="px-5 py-4">
        <p className="text-body-md text-text-secondary">총 {total}건</p>
      </div>

      <CardBody className="p-0">
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="text-caption-md px-4 py-3 font-medium text-text-muted">이미지</th>
                <th className="text-caption-md px-4 py-3 font-medium text-text-muted">상품</th>
                <th className="text-caption-md px-4 py-3 font-medium text-text-muted">별점</th>
                <th className="text-caption-md px-4 py-3 font-medium text-text-muted">본문</th>
                <th className="text-caption-md px-4 py-3 font-medium text-text-muted">작성자</th>
                <th className="text-caption-md px-4 py-3 font-medium text-text-muted">작성일</th>
                <th className="text-caption-md px-4 py-3 font-medium text-text-muted">관리</th>
              </tr>
            </thead>
            <tbody>
              {reviews.map((r) => (
                <tr key={r.id} className="border-b border-border transition-colors hover:bg-gray-50">
                  <td className="px-4 py-3">
                    {r.imageUrl ? (
                      <div className="relative h-12 w-12 overflow-hidden rounded-md bg-gray-100">
                        <Image src={r.imageUrl} alt="" fill sizes="48px" className="object-cover" />
                      </div>
                    ) : (
                      <span className="text-caption-sm text-text-muted">없음</span>
                    )}
                  </td>
                  <td className="text-body-md px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Badge variant="purple">{r.product.category.name}</Badge>
                      <Link
                        href={`/reviews/${r.id}`}
                        target="_blank"
                        className="font-medium text-text-primary hover:underline"
                      >
                        {r.product.name}
                      </Link>
                    </div>
                  </td>
                  <td className="text-body-md px-4 py-3 text-text-secondary">
                    <span className="text-amber-400">★</span> {r.rating.toFixed(1)}
                  </td>
                  <td className="px-4 py-3">
                    <p className="line-clamp-1 max-w-[280px] text-body-md text-text-secondary">
                      {r.content}
                    </p>
                  </td>
                  <td className="text-body-md px-4 py-3 text-text-primary">{r.user.name}</td>
                  <td className="text-caption-md px-4 py-3 text-text-muted">
                    {formatDateOnly(r.createdAt)}
                  </td>
                  <td className="px-4 py-3">
                    <Button variant="danger" size="xs" onClick={() => setConfirmId(r.id)}>
                      삭제
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="space-y-3 p-4 md:hidden">
          {reviews.map((r) => (
            <div key={r.id} className="rounded-lg border border-border bg-card-bg p-4">
              <div className="mb-2 flex items-center justify-between gap-2">
                <Badge variant="purple">{r.product.category.name}</Badge>
                <span className="text-caption-sm text-text-muted">
                  {formatDateOnly(r.createdAt)}
                </span>
              </div>
              <div className="text-body-md font-semibold text-text-primary">{r.product.name}</div>
              <div className="text-caption-md mt-1 text-text-secondary">
                {r.user.name} · <span className="text-amber-400">★</span> {r.rating.toFixed(1)}
              </div>
              <p className="mt-2 line-clamp-2 text-caption-md text-text-secondary">{r.content}</p>
              <div className="mt-3 flex justify-end">
                <Button variant="danger" size="xs" onClick={() => setConfirmId(r.id)}>
                  삭제
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardBody>

      {totalPages > 1 && (
        <CardFooter className="flex items-center justify-center gap-2 px-5 py-4">
          <Button variant="secondary" size="sm" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
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

      <Modal isOpen={confirmId !== null} onClose={() => setConfirmId(null)} title="리뷰 영구 삭제">
        <div className="space-y-3">
          <p className="text-body-md text-text-primary">
            이 리뷰를 영구 삭제할까요? 삭제된 리뷰와 첨부 이미지는 복구할 수 없어요.
          </p>
          {errorMessage ? (
            <p className="text-caption-md text-danger">{errorMessage}</p>
          ) : null}
          <div className="flex justify-end gap-2">
            <Button variant="secondary" size="sm" onClick={() => setConfirmId(null)}>
              취소
            </Button>
            <Button variant="danger" size="sm" loading={deleteMutation.isPending} onClick={handleDelete}>
              삭제
            </Button>
          </div>
        </div>
      </Modal>
    </Card>
  )
}
