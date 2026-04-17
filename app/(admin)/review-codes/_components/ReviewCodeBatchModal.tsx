'use client'

import { useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import { useCreateReviewCodeBatch } from '../_hooks/useCreateReviewCodeBatch'

type ReviewCodeBatchModalProps = {
  onClose: () => void
}

const inputClass = cn(
  'w-full rounded-lg border border-border bg-white px-3 py-2',
  'text-body-md text-text-primary placeholder:text-text-muted',
  'outline-none transition-colors focus:border-brand focus:ring-2 focus:ring-brand-light',
)

export function ReviewCodeBatchModal({ onClose }: ReviewCodeBatchModalProps) {
  const batch = useCreateReviewCodeBatch()
  const [gameName, setGameName] = useState('')
  const [codesText, setCodesText] = useState('')

  const parsedCodes = codesText
    .split('\n')
    .map((line) => {
      const trimmed = line.trim()
      if (!trimmed.includes('|')) return trimmed
      const afterPipe = trimmed.split('|').pop()
      return afterPipe ? afterPipe.trim() : ''
    })
    .filter((code) => code.length > 0)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (parsedCodes.length === 0) return
    batch.mutate(
      {
        gameName: gameName.trim() || undefined,
        codes: parsedCodes,
      },
      { onSuccess: onClose },
    )
  }

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title="코드 일괄 등록"
      footer={
        <div className="flex w-full items-center justify-between">
          <p className="text-caption-md text-text-muted">
            {parsedCodes.length}개 코드 감지됨
          </p>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={onClose} disabled={batch.isPending}>
              취소
            </Button>
            <Button
              form="review-code-batch-form"
              type="submit"
              loading={batch.isPending}
              disabled={parsedCodes.length === 0}
            >
              {parsedCodes.length}개 등록
            </Button>
          </div>
        </div>
      }
    >
      <form id="review-code-batch-form" onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-caption-md mb-1.5 block font-semibold text-text-secondary">
            게임명 (공통)
          </label>
          <input
            className={inputClass}
            placeholder="예) Stardew Valley"
            value={gameName}
            onChange={(e) => setGameName(e.target.value)}
          />
        </div>
        <div>
          <label className="text-caption-md mb-1.5 block font-semibold text-text-secondary">
            코드 목록 <span className="text-danger">*</span>
          </label>
          <textarea
            className={cn(inputClass, 'h-48 resize-y font-mono text-sm')}
            placeholder={'코드만 또는 공급처 원본 형식 모두 붙여넣을 수 있습니다\n\nXXXXX-YYYYY-ZZZZZ\n또는\n卡号：게임명 | XXXXX-YYYYY-ZZZZZ'}
            value={codesText}
            onChange={(e) => setCodesText(e.target.value)}
          />
          <p className="text-caption-sm mt-1 text-text-muted">
            줄바꿈으로 구분하여 여러 코드를 한번에 입력할 수 있습니다. (최대 500개) `|` 포함 시 뒤 코드만 자동 추출됩니다.
          </p>
        </div>
      </form>
    </Modal>
  )
}
