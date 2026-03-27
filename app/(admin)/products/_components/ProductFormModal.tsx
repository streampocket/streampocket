'use client'

import { useState, useEffect } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import { useProductForm } from '../_hooks/useProductForm'
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

  const [form, setForm] = useState<ProductFormData>({
    name: '',
    naverProductId: '',
    status: 'draft',
  })

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

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={isEdit ? '상품 수정' : '상품 등록'}
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={isLoading}>
            취소
          </Button>
          <Button form="product-form" type="submit" loading={isLoading}>
            {isEdit ? '저장' : '등록'}
          </Button>
        </>
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
