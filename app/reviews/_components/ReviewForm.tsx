'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { REVIEW_CONTENT_MAX_LENGTH } from '@/constants/app'
import { useCreateReview, useUpdateReview } from '../_hooks/useOwnReview'
import { useReviewableApplications } from '../_hooks/useReviewableApplications'
import { ReviewImageUploader } from './ReviewImageUploader'
import { StarRating } from './StarRating'

type ReviewFormProps =
  | {
      mode: 'create'
      reviewId?: never
      initial?: never
      lockedApplicationId?: never
    }
  | {
      mode: 'edit'
      reviewId: string
      initial: {
        applicationId: string
        productName: string
        content: string
        rating: number
        imageUrl: string | null
      }
      lockedApplicationId: string
    }

export function ReviewForm(props: ReviewFormProps) {
  const router = useRouter()
  const isEdit = props.mode === 'edit'

  const eligibleQuery = useReviewableApplications()
  const createMutation = useCreateReview()
  const updateMutation = useUpdateReview()

  const [applicationId, setApplicationId] = useState<string>(isEdit ? props.initial.applicationId : '')
  const [rating, setRating] = useState<number>(isEdit ? props.initial.rating : 5)
  const [content, setContent] = useState<string>(isEdit ? props.initial.content : '')
  const [imageUrl, setImageUrl] = useState<string | null>(isEdit ? props.initial.imageUrl : null)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const trimmedContent = content.trim()
  const isSubmitting = createMutation.isPending || updateMutation.isPending
  const canSubmit =
    !isSubmitting &&
    trimmedContent.length > 0 &&
    trimmedContent.length <= REVIEW_CONTENT_MAX_LENGTH &&
    rating >= 1 &&
    rating <= 5 &&
    (isEdit || applicationId !== '')

  async function handleSubmit(e: React.FormEvent): Promise<void> {
    e.preventDefault()
    setSubmitError(null)
    try {
      if (isEdit) {
        const updated = await updateMutation.mutateAsync({
          reviewId: props.reviewId,
          content: trimmedContent,
          rating,
          imageUrl,
        })
        router.push(`/reviews/${updated.data.id}`)
        router.refresh()
      } else {
        const created = await createMutation.mutateAsync({
          applicationId,
          content: trimmedContent,
          rating,
          imageUrl,
        })
        router.push(`/reviews/${created.data.id}`)
        router.refresh()
      }
    } catch (e) {
      setSubmitError(e instanceof Error ? e.message : '리뷰 저장에 실패했어요.')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="review-application" className="mb-1.5 block text-caption-md font-semibold text-gray-700">
          리뷰 대상 파티
        </label>
        {isEdit ? (
          <input
            id="review-application"
            value={props.initial.productName}
            readOnly
            className="h-10 w-full rounded-lg border border-border bg-gray-50 px-3 text-body-md text-text-secondary"
          />
        ) : (
          <select
            id="review-application"
            value={applicationId}
            onChange={(e) => setApplicationId(e.target.value)}
            className="h-10 w-full rounded-lg border border-border bg-white px-3 text-body-md focus:border-brand focus:outline-none focus:ring-3 focus:ring-brand/15"
          >
            <option value="">— 파티를 선택해주세요 —</option>
            {eligibleQuery.data?.map((app) => (
              <option key={app.id} value={app.id}>
                {app.product.name}
              </option>
            ))}
          </select>
        )}
        {!isEdit ? (
          <p className="mt-1.5 text-caption-sm text-text-muted">
            참여 확정된 파티 중 아직 리뷰가 없는 항목만 표시돼요.
          </p>
        ) : null}
      </div>

      <div>
        <label className="mb-1.5 block text-caption-md font-semibold text-gray-700">별점</label>
        <StarRating value={rating} size="lg" onChange={setRating} />
      </div>

      <div>
        <label htmlFor="review-content" className="mb-1.5 block text-caption-md font-semibold text-gray-700">
          본문
        </label>
        <textarea
          id="review-content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          maxLength={REVIEW_CONTENT_MAX_LENGTH}
          rows={8}
          placeholder="이용해보신 경험을 자유롭게 적어주세요."
          className="w-full rounded-lg border border-border bg-white px-3 py-2.5 text-body-md leading-6 focus:border-brand focus:outline-none focus:ring-3 focus:ring-brand/15"
        />
        <div className="mt-1 text-right text-caption-sm text-text-muted">
          {content.length} / {REVIEW_CONTENT_MAX_LENGTH}
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-caption-md font-semibold text-gray-700">
          이미지 (선택, 1장)
        </label>
        <ReviewImageUploader value={imageUrl} onChange={setImageUrl} />
      </div>

      {submitError ? (
        <p className="text-caption-md text-danger" role="alert">
          {submitError}
        </p>
      ) : null}

      <div className="flex justify-end gap-2 border-t border-border pt-4">
        <Button type="button" variant="secondary" onClick={() => router.back()} disabled={isSubmitting}>
          취소
        </Button>
        <Button type="submit" variant="primary" disabled={!canSubmit} loading={isSubmitting}>
          {isEdit ? '수정 저장' : '리뷰 등록'}
        </Button>
      </div>
    </form>
  )
}
