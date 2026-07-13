'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { MarkdownEditor } from '@/components/ui/MarkdownEditor'
import { toast } from 'sonner'
import { cn, formatDate } from '@/lib/utils'
import { useCreateGcoinProduct } from '../_hooks/useCreateGcoinProduct'
import { useUpdateGcoinProduct } from '../_hooks/useUpdateGcoinProduct'
import { useExchangeRate } from '../_hooks/useExchangeRate'
import { uploadGcoinProductImage } from '../_hooks/uploadGcoinProductImage'
import { GCOIN_STATUS_BADGE, GCOIN_CATEGORY_LABEL } from './ProductTable'
import type { GcoinProduct, GcoinProductCategory, GcoinProductStatus } from '../_types'

type ProductFormModalProps = {
  isOpen: boolean
  /** null이면 등록 모드, 값이 있으면 수정 모드 */
  product: GcoinProduct | null
  onClose: () => void
}

type FormState = {
  name: string
  category: GcoinProductCategory
  gcoinAmount: string
  salePrice: string
  listPrice: string
  listPriceUsd: string
  sortOrder: string
  status: GcoinProductStatus
  imageUrl: string | null
  description: string
}

const INITIAL_FORM: FormState = {
  name: '',
  category: 'gcoin',
  gcoinAmount: '',
  salePrice: '',
  listPrice: '',
  listPriceUsd: '',
  sortOrder: '',
  status: 'hidden',
  imageUrl: null,
  description: '',
}

/** 달러 정가 → 원화 환산 (BE의 toKrwListPrice와 동일: 100원 단위 반올림) */
function toKrwListPrice(usd: number, rate: number): number {
  return Math.round((usd * rate) / 100) * 100
}

const STATUS_OPTIONS: GcoinProductStatus[] = ['on_sale', 'hidden', 'sold_out']
const CATEGORY_OPTIONS: GcoinProductCategory[] = ['gcoin', 'item']

function buildInitial(product: GcoinProduct | null): FormState {
  if (!product) return INITIAL_FORM
  return {
    name: product.name,
    category: product.category,
    gcoinAmount: product.gcoinAmount !== null ? String(product.gcoinAmount) : '',
    salePrice: String(product.salePrice),
    // 달러 정가 상품은 listPrice가 환산값이므로 폼에는 채우지 않는다 (달러란만 프리필)
    listPrice: product.listPriceUsd === null && product.listPrice !== null ? String(product.listPrice) : '',
    listPriceUsd: product.listPriceUsd !== null ? String(product.listPriceUsd) : '',
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
  const { data: fxData } = useExchangeRate()
  const fxRate = fxData?.data?.rate ?? null
  const fxFetchedAt = fxData?.data?.fetchedAt ?? null

  // 환율 갱신 확인용 표시 — 예: "현재 환율 $1 = 1,501.33원 (2026-07-13 20:19 갱신)"
  const fxInfo =
    fxRate !== null
      ? `현재 환율 $1 = ${fxRate.toLocaleString('ko-KR', { maximumFractionDigits: 2 })}원${fxFetchedAt !== null ? ` (${formatDate(fxFetchedAt)} 갱신)` : ''}`
      : null
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

  const isGcoinCategory = form.category === 'gcoin'

  // 할인율 미리보기 — 지코인: 달러 정가 × 환율(100원 단위 반올림), 아이템: 원화 정가
  const salePriceNum = Number(form.salePrice)
  const listPriceUsdNum = Number(form.listPriceUsd)
  const convertedKrw =
    isGcoinCategory && form.listPriceUsd !== '' && fxRate !== null && listPriceUsdNum > 0
      ? toKrwListPrice(listPriceUsdNum, fxRate)
      : null
  const effectiveListPrice = isGcoinCategory
    ? convertedKrw
    : form.listPrice !== ''
      ? Number(form.listPrice)
      : null
  const discountRate =
    effectiveListPrice !== null && effectiveListPrice > salePriceNum && salePriceNum >= 0
      ? Math.round((1 - salePriceNum / effectiveListPrice) * 100)
      : null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!form.name.trim()) return toast.error('상품명을 입력해 주세요.')

    // 아이템 상품은 지코인 수량 없음 (null 전송)
    let gcoinAmount: number | null = null
    if (isGcoinCategory) {
      gcoinAmount = Number(form.gcoinAmount)
      if (!Number.isInteger(gcoinAmount) || gcoinAmount <= 0)
        return toast.error('지코인 수량을 올바르게 입력해 주세요.')
    }

    const salePrice = Number(form.salePrice)
    if (!Number.isInteger(salePrice) || salePrice < 0)
      return toast.error('판매가를 올바르게 입력해 주세요.')

    // 정가 — 지코인: 달러 입력(listPriceUsd), 아이템: 원화 입력(listPrice)
    let listPrice: number | null = null
    let listPriceUsd: number | null = null
    if (isGcoinCategory) {
      if (form.listPriceUsd !== '') {
        listPriceUsd = Math.round(Number(form.listPriceUsd) * 100) / 100
        if (!Number.isFinite(listPriceUsd) || listPriceUsd <= 0)
          return toast.error('달러 정가를 올바르게 입력해 주세요.')
        if (convertedKrw !== null && convertedKrw <= salePrice)
          return toast.error('달러 정가의 원화 환산액이 판매가보다 커야 합니다.')
      }
    } else if (form.listPrice !== '') {
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
      category: form.category,
      gcoinAmount,
      salePrice,
      listPrice,
      listPriceUsd,
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
        <Field label="카테고리" required>
          <div className="flex gap-2">
            {CATEGORY_OPTIONS.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setForm((prev) => ({ ...prev, category }))}
                className={cn(
                  'flex-1 rounded-full px-4 py-2 text-body-md font-medium transition-colors',
                  form.category === category
                    ? 'bg-brand text-white'
                    : 'bg-gray-100 text-text-secondary hover:bg-gray-200',
                )}
              >
                {GCOIN_CATEGORY_LABEL[category]}
              </button>
            ))}
          </div>
        </Field>

        <Field label="상품명" required>
          <input
            type="text"
            value={form.name}
            onChange={updateField('name')}
            placeholder={isGcoinCategory ? '예: 지코인 1,100' : '예: 성장형 무기 스킨'}
            maxLength={255}
            className={INPUT_CLASS}
          />
        </Field>

        {isGcoinCategory && (
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
        )}

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
          {isGcoinCategory ? (
            <Field
              label="정가($)"
              hint={
                form.listPriceUsd === ''
                  ? fxInfo !== null
                    ? `${fxInfo} · 달러로 입력하면 원화로 환산되어 표시됩니다.`
                    : '환율 정보가 아직 없습니다. 달러로 입력하면 원화로 환산되어 표시됩니다.'
                  : fxRate === null
                    ? '환율 정보가 아직 없어 미리보기를 표시할 수 없습니다.'
                    : convertedKrw !== null
                      ? `${fxInfo} · ≈ ${convertedKrw.toLocaleString('ko-KR')}원${discountRate !== null ? ` · 할인율 ${discountRate}%로 표시됩니다.` : ' — 판매가보다 커야 할인 표시됩니다.'}`
                      : '달러 정가를 올바르게 입력해 주세요.'
              }
            >
              <input
                type="number"
                min={0}
                step={0.01}
                value={form.listPriceUsd}
                onChange={updateField('listPriceUsd')}
                placeholder="예: 9.99 (할인 없으면 비워두세요)"
                className={INPUT_CLASS}
              />
            </Field>
          ) : (
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
          )}
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
