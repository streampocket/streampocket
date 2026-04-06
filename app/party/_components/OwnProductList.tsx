'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { OwnProductCard } from './OwnProductCard'
import { useOwnProducts } from '../_hooks/useOwnProducts'
import { useOwnCategories } from '../_hooks/useOwnCategories'
import { cn } from '@/lib/utils'

export function OwnProductList() {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | undefined>()
  const { data: products, isLoading: productsLoading } = useOwnProducts({
    categoryId: selectedCategoryId,
  })
  const { data: categories } = useOwnCategories()

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <h1 className="text-heading-lg text-text-primary">파티 모집 상품</h1>
        <Link href="/party/new">
          <Button variant="primary" size="sm">+ 상품 등록하기</Button>
        </Link>
      </div>

      {/* 카테고리 필터 */}
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setSelectedCategoryId(undefined)}
          className={cn(
            'rounded-full px-4 py-1.5 text-body-md font-medium transition-colors',
            selectedCategoryId === undefined
              ? 'bg-brand text-white'
              : 'bg-gray-100 text-text-secondary hover:bg-gray-200',
          )}
        >
          전체
        </button>
        {categories?.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setSelectedCategoryId(cat.id)}
            className={cn(
              'rounded-full px-4 py-1.5 text-body-md font-medium transition-colors',
              selectedCategoryId === cat.id
                ? 'bg-brand text-white'
                : 'bg-gray-100 text-text-secondary hover:bg-gray-200',
            )}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* 상품 그리드 */}
      {productsLoading ? (
        <div className="py-20 text-center text-text-muted">상품을 불러오는 중...</div>
      ) : products && products.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <OwnProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center text-text-muted">
          등록된 상품이 없습니다.
        </div>
      )}
    </div>
  )
}
