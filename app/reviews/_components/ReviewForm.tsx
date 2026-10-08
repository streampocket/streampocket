'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { REVIEW_CONTENT_MAX_LENGTH, REVIEW_CONTENT_MIN_LENGTH } from '@/constants/app'
import { useCreateReview, useUpdateReview } from '../_hooks/useOwnReview'
import { useReviewableApplications } from '@/hooks/useReviewableApplications'
import { ReviewImageUploader } from './ReviewImageUploader'
import { StarRating } from '@/components/own/StarRating'
import { formatPoint } from '@/lib/points'

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

  // 선택값은 신청 id 또는 재구매 id(둘 다 UUID라 겹치지 않는다) — 보낼 때 kind로 구분한다
  const selectedTarget = eligibleQuery.data?.find((app) => app.id === applicationId) ?? null
  // 지급액은 파티의 실결제액 구간에 따라 달라진다 — 고른 파티 기준으로 안내한다
  const selectedReward = selectedTarget?.rewardPoint ?? null

  const trimmedContent = content.trim()
  // 공백(띄어쓰기·줄바꿈)을 빼고 코드포인트 단위로 센다 — be(countReviewContentChars)와 같은 식.
  // `.length`는 이모지를 2자로 세서 짧은 이모지 리뷰가 통과하므로 Array.from으로 펼쳐서 센다
  // (fe tsconfig target에선 문자열 spread가 막혀 Array.from 사용 — 결과는 be의 [...s]와 동일).
  const contentCharCount = Array.from(content.replace(/\s/g, '')).length
  const isContentTooShort = contentCharCount < REVIEW_CONTENT_MIN_LENGTH
  const isSubmitting = createMutation.isPending || updateMutation.isPending
  const canSubmit =
    !isSubmitting &&
    !isContentTooShort &&
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
        const target =
          selectedTarget?.kind === 'renewal' ? { renewalId: applicationId } : { applicationId }
        const created = await createMutation.mutateAsync({
          ...target,
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
                {app.kind === 'renewal' ? ' (재구매)' : ''} (리뷰 작성 시 {formatPoint(app.rewardPoint)} 적립)
              </option>
            ))}
          </select>
        )}
        {!isEdit ? (
          <>
            <p className="mt-1.5 text-caption-sm text-text-muted">
              참여 확정된 파티 중 아직 리뷰가 없는 항목만 표시돼요.
            </p>
            {/* 지급액은 파티마다 다르다(결제 금액 구간) — 고른 파티의 실제 금액을 보여준다 */}
            {selectedReward !== null && (
              <p className="mt-1.5 text-caption-md font-semibold text-brand">
                리뷰를 등록하면 {formatPoint(selectedReward)}가 적립됩니다.
              </p>
            )}
          </>
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
          placeholder={`이용해보신 경험을 자유롭게 적어주세요. (공백 제외 ${REVIEW_CONTENT_MIN_LENGTH}자 이상)`}
          className="w-full rounded-lg border border-border bg-white px-3 py-2.5 text-body-md leading-6 focus:border-brand focus:outline-none focus:ring-3 focus:ring-brand/15"
        />
        <div className="mt-1 flex items-start justify-between gap-2 text-caption-sm text-text-muted">
          {/* 등록 버튼이 왜 안 눌리는지 보이게 — 입력을 시작한 뒤 기준 미달일 때만 안내 */}
          <span className="text-danger">
            {content.length > 0 && isContentTooShort
              ? `공백 제외 ${REVIEW_CONTENT_MIN_LENGTH}자 이상 입력해 주세요 (현재 ${contentCharCount}자)`
              : ''}
          </span>
          <span className="shrink-0">{`${content.length} / ${REVIEW_CONTENT_MAX_LENGTH}`}</span>
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
