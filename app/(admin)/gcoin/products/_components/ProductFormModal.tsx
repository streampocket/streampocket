'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { MarkdownEditor } from '@/components/ui/MarkdownEditor'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { useCreateGcoinProduct } from '../_hooks/useCreateGcoinProduct'
import { useUpdateGcoinProduct } from '../_hooks/useUpdateGcoinProduct'
import { uploadGcoinProductImage } from '../_hooks/uploadGcoinProductImage'
import { GCOIN_STATUS_BADGE } from './ProductTable'
import type { GcoinProduct, GcoinProductStatus } from '../_types'

type ProductFormModalProps = {
  isOpen: boolean
  /** null이면 등록 모드, 값이 있으면 수정 모드 */
  product: GcoinProduct | null
  onClose: () => void
}

type FormState = {
  name: string
  gcoinAmount: string
  salePrice: string
  listPrice: string
  sortOrder: string
  status: GcoinProductStatus
  imageUrl: string | null
  description: string
}

const INITIAL_FORM: FormState = {
  name: '',
  gcoinAmount: '',
  salePrice: '',
  listPrice: '',
  sortOrder: '',
  status: 'hidden',
  imageUrl: null,
  description: '',
}

const STATUS_OPTIONS: GcoinProductStatus[] = ['on_sale', 'hidden', 'sold_out']

function buildInitial(product: GcoinProduct | null): FormState {
  if (!product) return INITIAL_FORM
  return {
    name: product.name,
    gcoinAmount: String(product.gcoinAmount),
    salePrice: String(product.salePrice),
    listPrice: product.listPrice !== null ? String(product.listPrice) : '',
    sortOrder: String(product.sortOrder),
    status: product.status,
    imageUrl: product.imageUrl,
    description: product.description ?? '',
  }
}

export function ProductFormModal({ isOpen, product, onClose }: ProductFormModalProps) {
  const isEdit = product !== null
  const [form, setForm] = useState<FormState>(() => buildInitial(product))
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const createMutation = useCreateGcoinProduct()
  const updateMutation = useUpdateGcoinProduct()
  const isPending = createMutation.isPending || updateMutation.isPending

  // 모달이 열릴 때마다 대상 상품 기준으로 폼 초기화
  useEffect(() => {
    if (isOpen) setForm(buildInitial(product))
  }, [isOpen, product])

  const updateField = (key: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [key]: e.target.value }))
  }

  const handleClose = () => {
    if (isPending || uploading) return
    onClose()
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const objectUrl = await uploadGcoinProductImage(file)
      setForm((prev) => ({ ...prev, imageUrl: objectUrl }))
      toast.success('이미지가 업로드되었습니다.')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : '이미지 업로드에 실패했습니다.')
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  // 할인율 미리보기 (정가가 있을 때만)
  const salePriceNum = Number(form.salePrice)
  const listPriceNum = Number(form.listPrice)
  const discountRate =
    form.listPrice !== '' && listPriceNum > salePriceNum && salePriceNum >= 0
      ? Math.round((1 - salePriceNum / listPriceNum) * 100)
      : null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!form.name.trim()) return toast.error('상품명을 입력해 주세요.')

    const gcoinAmount = Number(form.gcoinAmount)
    if (!Number.isInteger(gcoinAmount) || gcoinAmount <= 0)
      return toast.error('지코인 수량을 올바르게 입력해 주세요.')

    const salePrice = Number(form.salePrice)
    if (!Number.isInteger(salePrice) || salePrice < 0)
      return toast.error('판매가를 올바르게 입력해 주세요.')

    let listPrice: number | null = null
    if (form.listPrice !== '') {
      listPrice = Number(form.listPrice)
      if (!Number.isInteger(listPrice) || listPrice < 0)
        return toast.error('정가를 올바르게 입력해 주세요.')
      if (listPrice <= salePrice) return toast.error('정가는 판매가보다 커야 합니다.')
    }

    let sortOrder: number | undefined
    if (form.sortOrder !== '') {
      sortOrder = Number(form.sortOrder)
      if (!Number.isInteger(sortOrder) || sortOrder < 0)
        return toast.error('진열 순서를 올바르게 입력해 주세요.')
    }

    const payload = {
      name: form.name.trim(),
      gcoinAmount,
      salePrice,
      listPrice,
      description: form.description.trim() || null,
      imageUrl: form.imageUrl,
      ...(sortOrder !== undefined ? { sortOrder } : {}),
      status: form.status,
    }

    const options = {
      onSuccess: () => {
        toast.success(isEdit ? '상품이 수정되었습니다.' : '상품이 등록되었습니다.')
        onClose()
      },
      onError: (err: Error) => {
        toast.error(err.message ?? (isEdit ? '상품 수정에 실패했습니다.' : '상품 등록에 실패했습니다.'))
      },
    }

    if (isEdit) {
      updateMutation.mutate({ id: product.id, input: payload }, options)
    } else {
      createMutation.mutate(payload, options)
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={isEdit ? '배그상품 수정' : '배그상품 등록'}
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={handleClose} disabled={isPending || uploading}>
            취소
          </Button>
          <Button variant="primary" onClick={handleSubmit} loading={isPending}>
            {isEdit ? '수정' : '등록'}
          </Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label="상품명" required>
          <input
            type="text"
            value={form.name}
            onChange={updateField('name')}
            placeholder="예: 지코인 1,100"
            maxLength={255}
            className={INPUT_CLASS}
          />
        </Field>

        <Field label="지코인 수량" required>
          <input
            type="number"
            min={1}
            value={form.gcoinAmount}
            onChange={updateField('gcoinAmount')}
            placeholder="예: 1100"
            className={INPUT_CLASS}
          />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="판매가(원)" required>
            <input
              type="number"
              min={0}
              value={form.salePrice}
              onChange={updateField('salePrice')}
              placeholder="예: 13500"
              className={INPUT_CLASS}
            />
          </Field>
          <Field
            label="정가(원)"
            hint={
              discountRate !== null
                ? `할인율 ${discountRate}% 로 표시됩니다.`
                : '입력 시 취소선 정가 + 할인율이 표시됩니다.'
            }
          >
            <input
              type="number"
              min={0}
              value={form.listPrice}
              onChange={updateField('listPrice')}
              placeholder="할인 없으면 비워두세요"
              className={INPUT_CLASS}
            />
          </Field>
        </div>

        <Field label="진열 순서" hint="비워두면 자동으로 맨 뒤에 배치됩니다. 숫자가 작을수록 앞에 진열됩니다.">
          <input
            type="number"
            min={0}
            value={form.sortOrder}
            onChange={updateField('sortOrder')}
            placeholder="자동"
            className={INPUT_CLASS}
          />
        </Field>

        <Field label="판매 상태" required>
          <div className="flex gap-2">
            {STATUS_OPTIONS.map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setForm((prev) => ({ ...prev, status }))}
                className={cn(
                  'flex-1 rounded-full px-4 py-2 text-body-md font-medium transition-colors',
                  form.status === status
                    ? 'bg-brand text-white'
                    : 'bg-gray-100 text-text-secondary hover:bg-gray-200',
                )}
              >
                {GCOIN_STATUS_BADGE[status].label}
              </button>
            ))}
          </div>
        </Field>

        <Field label="대표 이미지" hint="jpg, png, webp / 최대 5MB">
          <div className="flex items-center gap-3">
            {form.imageUrl ? (
              <Image
                src={form.imageUrl}
                alt="상품 이미지 미리보기"
                width={64}
                height={64}
                className="h-16 w-16 rounded-lg border border-border object-cover"
              />
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-lg border border-dashed border-border text-caption-sm text-text-muted">
                없음
              </div>
            )}
            <div className="flex flex-col gap-1">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                loading={uploading}
                onClick={() => fileInputRef.current?.click()}
              >
                파일 선택
              </Button>
              {form.imageUrl && (
                <Button
                  type="button"
                  variant="danger"
                  size="sm"
                  disabled={uploading}
                  onClick={() => setForm((prev) => ({ ...prev, imageUrl: null }))}
                >
                  이미지 제거
                </Button>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>
        </Field>

        <Field label="상세 설명" hint="상품 상세 페이지에 마크다운으로 표시됩니다.">
          <MarkdownEditor
            value={form.description}
            onChange={(value) => setForm((prev) => ({ ...prev, description: value }))}
            placeholder="상품 설명, 이용 안내, 주의사항 등을 입력하세요."
            rows={6}
          />
        </Field>
      </form>
    </Modal>
  )
}

const INPUT_CLASS =
  'text-body-md w-full rounded-lg border border-border bg-card-bg px-3 py-2 text-text-primary placeholder:text-text-muted focus:border-brand focus:outline-none'

type FieldProps = {
  label: string
  required?: boolean
  hint?: string
  children: React.ReactNode
}

function Field({ label, required, hint, children }: FieldProps) {
  return (
    <label className="block space-y-1">
      <span className="text-caption-md font-medium text-text-secondary">
        {label}
        {required && <span className="ml-0.5 text-red-500">*</span>}
      </span>
      {children}
      {hint && <span className="block text-caption-sm text-text-muted">{hint}</span>}
    </label>
  )
}
