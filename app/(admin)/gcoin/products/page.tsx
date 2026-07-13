'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/Button'
import { PAGE_SIZE } from '@/constants/app'
import { ProductFilterBar } from './_components/ProductFilterBar'
import { ProductTable } from './_components/ProductTable'
import { ProductFormModal } from './_components/ProductFormModal'
import { useAdminGcoinProducts } from './_hooks/useAdminGcoinProducts'
import { useDeleteGcoinProduct } from './_hooks/useDeleteGcoinProduct'
import type { GcoinProduct, GcoinProductTabCategory, GcoinProductTabStatus } from './_types'

export default function GcoinProductsPage() {
  const [activeTab, setActiveTab] = useState<GcoinProductTabStatus>('all')
  const [activeCategory, setActiveCategory] = useState<GcoinProductTabCategory>('all')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [formOpen, setFormOpen] = useState(false)
  const [formProduct, setFormProduct] = useState<GcoinProduct | null>(null)

  const queryStatus = activeTab === 'all' ? undefined : activeTab
  const queryCategory = activeCategory === 'all' ? undefined : activeCategory
  const { data, isLoading } = useAdminGcoinProducts({
    status: queryStatus,
    category: queryCategory,
    search: search || undefined,
    page,
    pageSize: PAGE_SIZE,
  })
  const deleteMutation = useDeleteGcoinProduct()

  const handleTabChange = (tab: GcoinProductTabStatus) => {
    setActiveTab(tab)
    setPage(1)
  }

  const handleCategoryChange = (category: GcoinProductTabCategory) => {
    setActiveCategory(category)
    setPage(1)
  }

  const handleSearchChange = (value: string) => {
    setSearch(value)
    setPage(1)
  }

  const openCreate = () => {
    setFormProduct(null)
    setFormOpen(true)
  }

  const openEdit = (product: GcoinProduct) => {
    setFormProduct(product)
    setFormOpen(true)
  }

  const handleDelete = (product: GcoinProduct) => {
    if (!window.confirm(`'${product.name}' 상품을 삭제할까요?`)) return
    deleteMutation.mutate(product.id, {
      onSuccess: () => toast.success('상품이 삭제되었습니다.'),
      onError: (err: Error) => toast.error(err.message ?? '상품 삭제에 실패했습니다.'),
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end">
        <Button variant="primary" size="sm" onClick={openCreate}>
          + 상품 등록
        </Button>
      </div>

      <ProductFilterBar
        activeTab={activeTab}
        onTabChange={handleTabChange}
        activeCategory={activeCategory}
        onCategoryChange={handleCategoryChange}
        search={search}
        onSearchChange={handleSearchChange}
      />

      {isLoading ? (
        <div className="py-16 text-center">
          <p className="text-body-md text-text-muted">로딩 중...</p>
        </div>
      ) : (
        <ProductTable
          products={data?.data ?? []}
          total={data?.total ?? 0}
          page={data?.page ?? 1}
          totalPages={data?.totalPages ?? 1}
          onPageChange={setPage}
          onEdit={openEdit}
          onDelete={handleDelete}
        />
      )}

      <ProductFormModal
        isOpen={formOpen}
        product={formProduct}
        onClose={() => setFormOpen(false)}
      />
    </div>
  )
}
