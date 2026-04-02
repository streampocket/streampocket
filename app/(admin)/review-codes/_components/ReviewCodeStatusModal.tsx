'use client'

import { useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import { useUpdateReviewCodeStatus } from '../_hooks/useUpdateReviewCodeStatus'
import type { ReviewCode } from '@/types/domain'

type ReviewCodeStatusModalProps = {
  reviewCode: ReviewCode
  onClose: () => void
}

const inputClass = cn(
  'w-full rounded-lg border border-border bg-white px-3 py-2',
  'text-body-md text-text-primary placeholder:text-text-muted',
  'outline-none transition-colors focus:border-brand focus:ring-2 focus:ring-brand-light',
)

export function ReviewCodeStatusModal({ reviewCode, onClose }: ReviewCodeStatusModalProps) {
  const updateStatus = useUpdateReviewCodeStatus()
  const isUsed = reviewCode.status === 'used'
  const [usedBy, setUsedBy] = useState(reviewCode.usedBy ?? '')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isUsed) {
      updateStatus.mutate(
        { id: reviewCode.id, data: { status: 'unused' } },
        { onSuccess: onClose },
      )
    } else {
      updateStatus.mutate(
        { id: reviewCode.id, data: { status: 'used', usedBy: usedBy || undefined } },
        { onSuccess: onClose },
      )
    }
  }

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={isUsed ? '미사용으로 복원' : '사용 처리'}
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={updateStatus.isPending}>
            취소
          </Button>
          <Button
            form="review-code-status-form"
            type="submit"
            variant={isUsed ? 'secondary' : 'primary'}
            loading={updateStatus.isPending}
          >
            {isUsed ? '미사용으로 복원' : '사용 처리'}
          </Button>
        </>
      }
    >
      <form id="review-code-status-form" onSubmit={handleSubmit} className="space-y-4">
        <p className="text-body-md text-text-primary">
          <span className="font-semibold">&quot;{reviewCode.gameName}&quot;</span>{' '}
          {isUsed ? '코드를 미사용으로 복원하시겠습니까?' : '코드를 사용 처리하시겠습니까?'}
        </p>
        {!isUsed && (
          <div>
            <label className="text-caption-md mb-1.5 block font-semibold text-text-secondary">
              받은 사람 <span className="text-text-muted">(선택)</span>
            </label>
            <input
              className={inputClass}
              placeholder="예) 홍길동"
              value={usedBy}
              onChange={(e) => setUsedBy(e.target.value)}
            />
          </div>
        )}
        {isUsed && (
          <p className="text-caption-md text-text-muted">
            usedBy, 사용일이 초기화됩니다.
          </p>
        )}
      </form>
    </Modal>
  )
}
