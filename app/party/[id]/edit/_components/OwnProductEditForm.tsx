'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardBody, CardHeader } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { MarkdownEditor } from '@/components/ui/MarkdownEditor'
import { ImageSelector } from '../../../new/_components/ImageSelector'
import { useOwnProductDetail } from '../../_hooks/useOwnProductDetail'
import { useUpdateOwnProduct } from '../_hooks/useUpdateOwnProduct'
import type { OwnProductEditFormData } from '../_types'

export function OwnProductEditForm() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  const { data: product, isLoading } = useOwnProductDetail(id)
  const updateMutation = useUpdateOwnProduct(id)

  const [form, setForm] = useState<OwnProductEditFormData>({
    name: '',
    durationDays: '',
    price: '',
    totalSlots: '',
    imagePath: null,
    notes: '',
  })

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name,
        durationDays: String(product.durationDays),
        price: String(product.price),
        totalSlots: String(product.totalSlots),
        imagePath: product.imagePath,
        notes: product.notes ?? '',
      })
    }
  }, [product])

  const setField = <K extends keyof OwnProductEditFormData>(key: K, value: OwnProductEditFormData[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }))

  const handleImageSelect = (path: string | null, label: string) => {
    setForm((prev) => ({
      ...prev,
      imagePath: path,
      name: path ? label : '',
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!form.name || !form.imagePath) return

    const durationDays = parseInt(form.durationDays, 10)
    const price = parseInt(form.price, 10)
    const totalSlots = parseInt(form.totalSlots, 10)

    if (isNaN(durationDays) || durationDays <= 0) return
    if (isNaN(price) || price <= 0) return
    if (isNaN(totalSlots) || totalSlots < 1) return

    updateMutation.mutate(
      {
        name: form.name,
        durationDays,
        price,
        totalSlots,
        imagePath: form.imagePath || null,
        notes: form.notes.trim() || null,
      },
      {
        onSuccess: () => {
          router.push(`/party/${id}`)
        },
      },
    )
  }

  if (isLoading) {
    return <div className="py-20 text-center text-text-muted">파티를 불러오는 중...</div>
  }

  if (!product) {
    return <div className="py-20 text-center text-text-muted">파티를 찾을 수 없습니다.</div>
  }

  return (
    <Card className="mx-auto max-w-2xl">
      <CardHeader>
        <h1 className="text-heading-lg text-text-primary">파티 수정</h1>
      </CardHeader>
      <CardBody>
        <form id="own-product-edit-form" onSubmit={handleSubmit} className="space-y-5">
          {/* 파티 선택 (이미지 + 이름) */}
          <div>
            <label className="text-body-md mb-1.5 block font-medium text-text-primary">
              파티 선택 <span className="text-danger">*</span>
            </label>
            <ImageSelector
              value={form.imagePath}
              onChange={handleImageSelect}
            />
            {form.imagePath && (
              <p className="text-caption-sm mt-2 text-brand-dark font-medium">
                선택된 파티: {form.name}
              </p>
            )}
          </div>

          {/* 사용기간 + 가격 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-body-md mb-1.5 block font-medium text-text-primary">
                사용기간 <span className="text-danger">*</span>
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={form.durationDays}
                  onChange={(e) => setField('durationDays', e.target.value)}
                  required
                  min={1}
                  className="text-body-md w-full rounded-lg border border-gray-300 px-3 py-2 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
                />
                <span className="text-body-md shrink-0 text-text-secondary">일</span>
              </div>
            </div>
            <div>
              <label className="text-body-md mb-1.5 block font-medium text-text-primary">
                인당 가격 <span className="text-danger">*</span>
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={form.price}
                  onChange={(e) => setField('price', e.target.value)}
                  required
                  min={1}
                  className="text-body-md w-full rounded-lg border border-gray-300 px-3 py-2 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
                />
                <span className="text-body-md shrink-0 text-text-secondary">원</span>
              </div>
            </div>
          </div>

          {/* 모집 총인원 */}
          <div>
            <label className="text-body-md mb-1.5 block font-medium text-text-primary">
              모집 총인원 <span className="text-danger">*</span>
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={form.totalSlots}
                onChange={(e) => setField('totalSlots', e.target.value)}
                required
                min={1}
                className="text-body-md w-full max-w-[200px] rounded-lg border border-gray-300 px-3 py-2 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
              />
              <span className="text-body-md shrink-0 text-text-secondary">명 (최소 1명)</span>
            </div>
          </div>

          {/* 파티 규칙 */}
          <div>
            <label className="text-body-md mb-1.5 block font-medium text-text-primary">
              파티 규칙
            </label>
            <MarkdownEditor
              value={form.notes}
              onChange={(v) => setField('notes', v)}
              placeholder="마크다운으로 입력 가능합니다."
            />
          </div>

          {/* 버튼 */}
          <div className="flex gap-3">
            <Button
              type="button"
              variant="secondary"
              className="flex-1"
              onClick={() => router.back()}
            >
              취소
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="flex-1"
              loading={updateMutation.isPending}
            >
              수정 완료
            </Button>
          </div>
        </form>
      </CardBody>
    </Card>
  )
}
