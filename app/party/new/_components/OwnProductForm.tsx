'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardBody, CardHeader } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { MarkdownEditor } from '@/components/ui/MarkdownEditor'
import { ImageSelector } from './ImageSelector'
import { useCreateOwnProduct } from '../_hooks/useCreateOwnProduct'
import type { OwnProductFormData } from '../_types'

export function OwnProductForm() {
  const router = useRouter()
  const createMutation = useCreateOwnProduct()

  const [form, setForm] = useState<OwnProductFormData>({
    name: '',
    durationDays: '',
    price: '',
    totalSlots: '',
    imagePath: null,
    notes: '',
  })

  const setField = <K extends keyof OwnProductFormData>(key: K, value: OwnProductFormData[K]) =>
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
    if (isNaN(totalSlots) || totalSlots < 2) return

    createMutation.mutate(
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
          router.push('/party/my')
        },
      },
    )
  }

  return (
    <Card className="mx-auto max-w-2xl">
      <CardHeader>
        <h1 className="text-heading-lg text-text-primary">상품 등록</h1>
      </CardHeader>
      <CardBody>
        <form id="own-product-form" onSubmit={handleSubmit} className="space-y-5">
          {/* 상품 선택 (이미지 + 이름) */}
          <div>
            <label className="text-body-md mb-1.5 block font-medium text-text-primary">
              상품 선택 <span className="text-danger">*</span>
            </label>
            <ImageSelector
              value={form.imagePath}
              onChange={handleImageSelect}
            />
            {!form.imagePath && (
              <p className="text-caption-sm mt-2 text-text-muted">상품을 선택해주세요.</p>
            )}
            {form.imagePath && (
              <p className="text-caption-sm mt-2 text-brand-dark font-medium">
                선택된 상품: {form.name}
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
                  placeholder="30"
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
                  placeholder="15000"
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
                placeholder="4"
                required
                min={2}
                className="text-body-md w-full max-w-[200px] rounded-lg border border-gray-300 px-3 py-2 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
              />
              <span className="text-body-md shrink-0 text-text-secondary">명 (최소 2명)</span>
            </div>
          </div>

          {/* 상품 주의사항 */}
          <div>
            <label className="text-body-md mb-1.5 block font-medium text-text-primary">
              상품 주의사항
            </label>
            <MarkdownEditor
              value={form.notes}
              onChange={(v) => setField('notes', v)}
              placeholder="마크다운으로 입력 가능합니다. 예: - 프리미엄 요금제 4인 공유&#10;- 비밀번호 변경 금지"
            />
          </div>

          {/* 등록 버튼 */}
          <Button
            type="submit"
            variant="primary"
            loading={createMutation.isPending}
            className="w-full"
          >
            상품 등록
          </Button>
        </form>
      </CardBody>
    </Card>
  )
}
