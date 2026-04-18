'use client'

import { useState, Suspense } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { PRODUCTS_PAGE_SIZE } from '@/constants/app'
import { ProductTabs } from './_components/ProductTabs'
import { ProductCard } from './_components/ProductCard'
import { ProductFormModal } from './_components/ProductFormModal'
import { useProducts } from './_hooks/useProducts'
import { useSyncProducts } from './_hooks/useSyncProducts'
import type { SteamProduct, ProductStatus } from '@/types/domain'

function ProductsContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const [editingProduct, setEditingProduct] = useState<SteamProduct | null | undefined>(undefined)
  const [search, setSearch] = useState(searchParams.get('search') ?? '')
  const status = (searchParams.get('status') as ProductStatus) || undefined
  const page = Number(searchParams.get('page') ?? 1)

  const { data, isLoading } = useProducts({
    status,
    search: search || undefined,
    page,
    pageSize: PRODUCTS_PAGE_SIZE,
  })
  const { mutate: sync, isPending: isSyncing } = useSyncProducts()

  const isModalOpen = editingProduct !== undefined

  const handleSearchChange = (value: string) => {
    setSearch(value)
    const params = new URLSearchParams(searchParams.toString())
    if (value) params.set('search', value)
    else params.delete('search')
    params.delete('page')
    router.push(`${pathname}${params.toString() ? `?${params.toString()}` : ''}`)
  }

  const handlePageChange = (nextPage: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', String(nextPage))
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <>
      <input
        type="text"
        placeholder="상품명 검색..."
        value={search}
        onChange={(e) => handleSearchChange(e.target.value)}
        className="text-body-md w-full rounded-lg border border-border bg-card-bg px-4 py-2 text-text-primary placeholder:text-text-muted focus:border-brand focus:outline-none md:max-w-xs"
      />
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-heading-md text-text-primary">
          {data?.total ?? 0}개 상품
        </h2>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" loading={isSyncing} onClick={() => sync()}>
            네이버 동기화
          </Button>
          <Button size="sm" onClick={() => setEditingProduct(null)}>
            + 상품 등록
          </Button>
        </div>
      </div>

      {isLoading ? (
        <p className="text-caption-md py-16 text-center text-text-muted">로딩 중...</p>
      ) : data?.data.length === 0 ? (
        <p className="text-caption-md py-16 text-center text-text-muted">상품이 없습니다</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {data?.data.map((product) => (
            <ProductCard key={product.id} product={product} onEdit={setEditingProduct} />
          ))}
        </div>
      )}

      {data && data.totalPages > 1 && (
        <div className="flex w-full items-center justify-center gap-2 pt-4">
          <Button
            variant="secondary"
            size="sm"
            disabled={page <= 1}
            onClick={() => handlePageChange(page - 1)}
          >
            이전
          </Button>
          <span className="text-caption-md text-text-secondary">
            {page} / {data.totalPages}
          </span>
          <Button
            variant="secondary"
            size="sm"
            disabled={page >= data.totalPages}
            onClick={() => handlePageChange(page + 1)}
          >
            다음
          </Button>
        </div>
      )}

      {isModalOpen && (
        <ProductFormModal
          product={editingProduct}
          onClose={() => setEditingProduct(undefined)}
        />
      )}
    </>
  )
}

export default function ProductsPage() {
  return (
    <div className="space-y-4">
      <Suspense>
        <ProductTabs />
      </Suspense>
      <Suspense>
        <ProductsContent />
      </Suspense>
    </div>
  )
}
