'use client'

import { useState } from 'react'
import { REVIEW_ADMIN_PAGE_SIZE } from '@/constants/app'
import { AdminReviewFilterBar } from './_components/AdminReviewFilterBar'
import { AdminReviewTable } from './_components/AdminReviewTable'
import { useAdminOwnReviews } from './_hooks/useAdminOwnReviews'

export default function AdminOwnReviewsPage() {
  const [search, setSearch] = useState('')
  const [rating, setRating] = useState<number | undefined>(undefined)
  const [page, setPage] = useState(1)

  const { data, isLoading } = useAdminOwnReviews({
    search: search.trim() || undefined,
    rating,
    page,
    pageSize: REVIEW_ADMIN_PAGE_SIZE,
  })

  function handleSearchChange(value: string): void {
    setSearch(value)
    setPage(1)
  }
  function handleRatingChange(value: number | undefined): void {
    setRating(value)
    setPage(1)
  }

  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-display text-text-primary">리뷰 관리</h1>
        <p className="mt-1 text-body-md text-text-secondary">
          전체 리뷰를 조회하고 부적절한 리뷰를 삭제할 수 있어요.
        </p>
      </header>

      <AdminReviewFilterBar
        search={search}
        onSearchChange={handleSearchChange}
        rating={rating}
        onRatingChange={handleRatingChange}
      />

      {isLoading ? (
        <div className="py-16 text-center">
          <p className="text-body-md text-text-muted">로딩 중...</p>
        </div>
      ) : (
        <AdminReviewTable
          reviews={data?.items ?? []}
          total={data?.total ?? 0}
          page={data?.page ?? 1}
          totalPages={data?.totalPages ?? 1}
          onPageChange={setPage}
        />
      )}
    </div>
  )
}
