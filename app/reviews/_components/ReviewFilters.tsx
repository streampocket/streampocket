'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useTransition } from 'react'
import type { OwnCategory } from '@/types/domain'

type ReviewFiltersProps = {
  categories: OwnCategory[]
  products: { id: string; name: string }[]
  currentCategoryId?: string
  currentProductId?: string
  currentSort: 'latest' | 'rating'
}

export function ReviewFilters({
  categories,
  products,
  currentCategoryId,
  currentProductId,
  currentSort,
}: ReviewFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [, startTransition] = useTransition()

  function updateParam(key: string, value: string | null): void {
    const next = new URLSearchParams(searchParams.toString())
    if (value && value !== '') {
      next.set(key, value)
    } else {
      next.delete(key)
    }
    // 필터 변경 시 1페이지로 리셋
    if (key !== 'page') next.delete('page')
    startTransition(() => {
      router.push(`/reviews${next.toString() ? `?${next.toString()}` : ''}`)
    })
  }

  return (
    <div className="rounded-xl border border-border bg-card-bg p-4 shadow-[0_1px_3px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.06)]">
      <div className="flex flex-wrap items-end gap-3">
        <div className="min-w-[160px] flex-1">
          <label htmlFor="filter-category" className="mb-1.5 block text-caption-md font-semibold text-gray-700">
            카테고리
          </label>
          <select
            id="filter-category"
            value={currentCategoryId ?? ''}
            onChange={(e) => updateParam('categoryId', e.target.value || null)}
            className="h-9 w-full rounded-lg border border-border bg-white px-3 text-body-md focus:border-brand focus:outline-none focus:ring-3 focus:ring-brand/15"
          >
            <option value="">전체</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="min-w-[200px] flex-1">
          <label htmlFor="filter-product" className="mb-1.5 block text-caption-md font-semibold text-gray-700">
            상품
          </label>
          <select
            id="filter-product"
            value={currentProductId ?? ''}
            onChange={(e) => updateParam('productId', e.target.value || null)}
            className="h-9 w-full rounded-lg border border-border bg-white px-3 text-body-md focus:border-brand focus:outline-none focus:ring-3 focus:ring-brand/15"
          >
            <option value="">전체</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        <div className="min-w-[140px]">
          <label htmlFor="filter-sort" className="mb-1.5 block text-caption-md font-semibold text-gray-700">
            정렬
          </label>
          <select
            id="filter-sort"
            value={currentSort}
            onChange={(e) => updateParam('sort', e.target.value === 'latest' ? null : e.target.value)}
            className="h-9 w-full rounded-lg border border-border bg-white px-3 text-body-md focus:border-brand focus:outline-none focus:ring-3 focus:ring-brand/15"
          >
            <option value="latest">최신순</option>
            <option value="rating">별점 높은순</option>
          </select>
        </div>
      </div>
    </div>
  )
}
