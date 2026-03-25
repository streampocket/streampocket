'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'
import type { AccountStatus } from '@/types/domain'
import { useProducts } from '../../products/_hooks/useProducts'

const STATUS_OPTIONS: { value: AccountStatus | ''; label: string }[] = [
  { value: '', label: '전체' },
  { value: 'available', label: '사용 가능' },
  { value: 'reserved', label: '선점됨' },
  { value: 'sent', label: '발송 완료' },
  { value: 'disabled', label: '비활성화' },
]

export function CodesFilterBar() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const currentProductId = searchParams.get('productId') ?? ''
  const currentStatus = searchParams.get('status') ?? ''

  const { data: productsData } = useProducts()

  const updateParams = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString())
      Object.entries(updates).forEach(([key, value]) => {
        if (value) {
          params.set(key, value)
        } else {
          params.delete(key)
        }
      })
      router.push(`${pathname}?${params.toString()}`)
    },
    [router, pathname, searchParams],
  )

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-xl border border-border bg-card-bg p-4">
      {/* 상품 필터 */}
      <select
        value={currentProductId}
        onChange={(e) => updateParams({ productId: e.target.value })}
        className="text-body-md rounded-lg border border-border px-3 py-1.5 text-text-primary outline-none focus:border-brand"
      >
        <option value="">전체 상품</option>
        {productsData?.data.map((product) => (
          <option key={product.id} value={product.id}>
            {product.name}
          </option>
        ))}
      </select>

      {/* 상태 필터 */}
      <div className="flex items-center gap-1.5">
        {STATUS_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => updateParams({ status: opt.value })}
            className={`text-caption-md rounded-lg px-3 py-1.5 font-semibold transition-colors ${
              currentStatus === opt.value
                ? 'bg-brand text-white'
                : 'bg-gray-100 text-text-secondary hover:bg-gray-200'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  )
}
