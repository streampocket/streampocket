'use client'

import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { ProductTabs } from './_components/ProductTabs'
import { ProductCard } from './_components/ProductCard'
import { ProductFormModal } from './_components/ProductFormModal'
import { useProducts } from './_hooks/useProducts'
import { useSyncProducts } from './_hooks/useSyncProducts'
import type { SteamProduct, ProductStatus } from '@/types/domain'

function ProductsContent() {
  const searchParams = useSearchParams()
  const [editingProduct, setEditingProduct] = useState<SteamProduct | null | undefined>(undefined)
  const status = (searchParams.get('status') as ProductStatus) || undefined

  const { data, isLoading } = useProducts({ status })
  const { mutate: sync, isPending: isSyncing } = useSyncProducts()

  const isModalOpen = editingProduct !== undefined

  return (
    <>
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
