'use client'

import { useState, useEffect } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import { useCreateReviewCode } from '../_hooks/useCreateReviewCode'
import { useUpdateReviewCode } from '../_hooks/useUpdateReviewCode'
import { useDeleteReviewCode } from '../_hooks/useDeleteReviewCode'
import type { ReviewCode } from '@/types/domain'
import type { ReviewCodeFormData } from '../_types'

type ReviewCodeFormModalProps = {
  reviewCode?: ReviewCode | null
  onClose: () => void
}

const inputClass = cn(
  'w-full rounded-lg border border-border bg-white px-3 py-2',
  'text-body-md text-text-primary placeholder:text-text-muted',
  'outline-none transition-colors focus:border-brand focus:ring-2 focus:ring-brand-light',
)

export function ReviewCodeFormModal({ reviewCode, onClose }: ReviewCodeFormModalProps) {
  const isEdit = reviewCode !== null && reviewCode !== undefined
  const create = useCreateReviewCode()
  const update = useUpdateReviewCode()
  const deleteCode = useDeleteReviewCode()

  const [form, setForm] = useState<ReviewCodeFormData>({ gameName: '', code: '' })
  const [isConfirming, setIsConfirming] = useState(false)

  useEffect(() => {
    if (reviewCode) {
      setForm({ gameName: reviewCode.gameName ?? '', code: reviewCode.code })
    } else {
      setForm({ gameName: '', code: '' })
    }
  }, [reviewCode])

  const isLoading = create.isPending || update.isPending

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isEdit && reviewCode) {
      update.mutate({ id: reviewCode.id, data: form }, { onSuccess: onClose })
    } else {
      create.mutate(form, { onSuccess: onClose })
    }
  }

  const setField = <K extends keyof ReviewCodeFormData>(key: K, value: ReviewCodeFormData[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }))

  if (isConfirming && isEdit && reviewCode) {
    return (
      <Modal
        isOpen={true}
        onClose={() => setIsConfirming(false)}
        title="코드 삭제"
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setIsConfirming(false)}
              disabled={deleteCode.isPending}
            >
              취소
            </Button>
            <Button
              variant="danger"
              loading={deleteCode.isPending}
              onClick={() => deleteCode.mutate(reviewCode.id, { onSuccess: onClose })}
            >
              삭제 확인
            </Button>
          </>
        }
      >
        <div className="space-y-3">
          <p className="text-body-md text-text-primary">
            <span className="font-semibold">&quot;{reviewCode.gameName ?? '(게임명 없음)'}&quot;</span> 코드를
            삭제하시겠습니까?
          </p>
          <p className="text-caption-md text-text-muted">이 작업은 되돌릴 수 없습니다.</p>
        </div>
      </Modal>
    )
  }

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={isEdit ? '코드 수정' : '코드 등록'}
      footer={
        <div className="flex w-full items-center justify-between">
          <div>
            {isEdit && (
              <Button
                variant="danger"
                size="sm"
                onClick={() => setIsConfirming(true)}
                disabled={isLoading}
              >
                삭제
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={onClose} disabled={isLoading}>
              취소
            </Button>
            <Button form="review-code-form" type="submit" loading={isLoading}>
              {isEdit ? '수정' : '등록'}
            </Button>
          </div>
        </div>
      }
    >
      <form id="review-code-form" onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-caption-md mb-1.5 block font-semibold text-text-secondary">
            게임명
          </label>
          <input
            className={inputClass}
            placeholder="예) Stardew Valley"
            value={form.gameName ?? ''}
            onChange={(e) => setField('gameName', e.target.value)}
          />
        </div>
        <div>
          <label className="text-caption-md mb-1.5 block font-semibold text-text-secondary">
            코드 <span className="text-danger">*</span>
          </label>
          <input
            className={inputClass}
            placeholder="예) XXXXX-YYYYY-ZZZZZ"
            value={form.code}
            onChange={(e) => setField('code', e.target.value)}
            required
          />
        </div>
      </form>
    </Modal>
  )
}
