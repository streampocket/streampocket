'use client'

import { useState, useEffect } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import { useProductForm } from '../_hooks/useProductForm'
import { useDeleteProduct } from '../_hooks/useDeleteProduct'
import type { SteamProduct, ProductStatus } from '@/types/domain'
import type { ProductFormData } from '../_types'

type ProductFormModalProps = {
  product?: SteamProduct | null
  onClose: () => void
}

const STATUS_OPTIONS: { value: ProductStatus; label: string }[] = [
  { value: 'draft', label: '임시저장' },
  { value: 'active', label: '판매 중' },
  { value: 'inactive', label: '판매 중지' },
]

const inputClass = cn(
  'w-full rounded-lg border border-border bg-white px-3 py-2',
  'text-body-md text-text-primary placeholder:text-text-muted',
  'outline-none transition-colors focus:border-brand focus:ring-2 focus:ring-brand-light',
)

export function ProductFormModal({ product, onClose }: ProductFormModalProps) {
  const isEdit = product !== null && product !== undefined
  const { create, update } = useProductForm()
  const deleteProduct = useDeleteProduct(onClose)

  const [form, setForm] = useState<ProductFormData>({
    name: '',
    naverProductId: '',
    status: 'draft',
  })
  const [isConfirming, setIsConfirming] = useState(false)

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name,
        naverProductId: product.naverProductId,
        status: product.status,
      })
    } else {
      setForm({ name: '', naverProductId: '', status: 'draft' })
    }
  }, [product])

  const isLoading = create.isPending || update.isPending

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isEdit && product) {
      update.mutate({ id: product.id, data: form }, { onSuccess: onClose })
    } else {
      create.mutate(form, { onSuccess: onClose })
    }
  }

  const setField = <K extends keyof ProductFormData>(key: K, value: ProductFormData[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }))

  const handleClose = () => {
    setIsConfirming(false)
    onClose()
  }

  if (isConfirming && isEdit && product) {
    return (
      <Modal
        isOpen={true}
        onClose={handleClose}
        title="상품 삭제"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsConfirming(false)} disabled={deleteProduct.isPending}>
              취소
            </Button>
            <Button
              variant="danger"
              loading={deleteProduct.isPending}
              onClick={() => deleteProduct.mutate(product.id)}
            >
              삭제 확인
            </Button>
          </>
        }
      >
        <div className="space-y-3">
          <p className="text-body-md text-text-primary">
            <span className="font-semibold">"{product.name}"</span>을 삭제하시겠습니까?
          </p>
          <p className="text-caption-md text-text-muted">이 작업은 되돌릴 수 없습니다.</p>
          {product.stockCount > 0 && (
            <p className="text-caption-md text-warning">
              연결된 계정 {product.stockCount}개의 상품 연결이 해제됩니다.
            </p>
          )}
        </div>
      </Modal>
    )
  }

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={isEdit ? '상품 수정' : '상품 등록'}
      footer={
        <div className="flex w-full items-center justify-between">
          <div>
            {isEdit && (
              <Button variant="danger" size="sm" onClick={() => setIsConfirming(true)} disabled={isLoading}>
                삭제
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={onClose} disabled={isLoading}>
              취소
            </Button>
            <Button form="product-form" type="submit" loading={isLoading}>
              {isEdit ? '저장' : '등록'}
            </Button>
          </div>
        </div>
      }
    >
      <form id="product-form" onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-caption-md mb-1.5 block font-semibold text-text-secondary">
            상품명 <span className="text-danger">*</span>
          </label>
          <input
            className={inputClass}
            value={form.name}
            onChange={(e) => setField('name', e.target.value)}
            required
          />
        </div>

        <div>
          <label className="text-caption-md mb-1.5 block font-semibold text-text-secondary">
            네이버 상품 ID <span className="text-danger">*</span>
          </label>
          <input
            className={inputClass}
            value={form.naverProductId}
            onChange={(e) => setField('naverProductId', e.target.value)}
            required
          />
        </div>

        <div>
          <label className="text-caption-md mb-1.5 block font-semibold text-text-secondary">
            상태
          </label>
          <select
            className={inputClass}
            value={form.status}
            onChange={(e) => setField('status', e.target.value as ProductStatus)}
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </form>
    </Modal>
  )
}
