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
    dailyDiscount: '',
    totalSlots: '',
    imagePath: null,
    notes: '',
    accountId: '',
    accountPassword: '',
  })
  const [showPassword, setShowPassword] = useState(false)

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
    const dailyDiscount = form.dailyDiscount ? parseInt(form.dailyDiscount, 10) : 0
    const totalSlots = parseInt(form.totalSlots, 10)

    if (isNaN(durationDays) || durationDays <= 0) return
    if (isNaN(price) || price <= 0) return
    if (isNaN(dailyDiscount) || dailyDiscount < 0) return
    if (isNaN(totalSlots) || totalSlots < 1) return

    createMutation.mutate(
      {
        name: form.name,
        durationDays,
        price,
        dailyDiscount,
        totalSlots,
        imagePath: form.imagePath || null,
        notes: form.notes.trim() || null,
        accountId: form.accountId.trim() || null,
        accountPassword: form.accountPassword.trim() || null,
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
        <h1 className="text-heading-lg text-text-primary">파티 등록</h1>
      </CardHeader>
      <CardBody>
        <form id="own-product-form" onSubmit={handleSubmit} className="space-y-5">
          {/* 파티 선택 (이미지 + 이름) */}
          <div>
            <label className="text-body-md mb-1.5 block font-medium text-text-primary">
              파티 선택 <span className="text-danger">*</span>
            </label>
            <ImageSelector
              value={form.imagePath}
              onChange={handleImageSelect}
            />
            {!form.imagePath && (
              <p className="text-caption-sm mt-2 text-text-muted">파티를 선택해주세요.</p>
            )}
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
                가격 <span className="text-danger">*</span>
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

          {/* 하루 할인 금액 */}
          <div>
            <label className="text-body-md mb-1.5 block font-medium text-text-primary">
              하루 할인 금액
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={form.dailyDiscount}
                onChange={(e) => setField('dailyDiscount', e.target.value)}
                placeholder="0"
                min={0}
                className="text-body-md w-full max-w-[200px] rounded-lg border border-gray-300 px-3 py-2 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
              />
              <span className="text-body-md shrink-0 text-text-secondary">원/일</span>
            </div>
            <p className="text-caption-sm mt-1 text-text-muted">
              파티 시작 후 매일 이 금액만큼 가격이 감소합니다 (0이면 할인 없음)
            </p>
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
                min={1}
                className="text-body-md w-full max-w-[200px] rounded-lg border border-gray-300 px-3 py-2 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
              />
              <span className="text-body-md shrink-0 text-text-secondary">명 (최소 1명)</span>
            </div>
          </div>

          {/* 공유 계정 정보 */}
          <div className="space-y-3">
            <div>
              <label className="text-body-md mb-1.5 block font-medium text-text-primary">
                공유 계정 정보
              </label>
              <p className="text-caption-sm mb-2 text-text-muted">
                파티원 참여 후 영업시간 6시간 내 필수 등록 (지금 입력하지 않아도 됩니다)
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-body-sm mb-1 block text-text-secondary">아이디</label>
                <input
                  type="text"
                  value={form.accountId}
                  onChange={(e) => setField('accountId', e.target.value)}
                  placeholder="공유 계정 아이디"
                  className="text-body-md w-full rounded-lg border border-gray-300 px-3 py-2 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
                />
              </div>
              <div>
                <label className="text-body-sm mb-1 block text-text-secondary">비밀번호</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={form.accountPassword}
                    onChange={(e) => setField('accountPassword', e.target.value)}
                    placeholder="공유 계정 비밀번호"
                    className="text-body-md w-full rounded-lg border border-gray-300 px-3 py-2 pr-10 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary"
                  >
                    {showPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12c1.292 4.338 5.31 7.5 10.066 7.5.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
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
            파티 등록
          </Button>
        </form>
      </CardBody>
    </Card>
  )
}
