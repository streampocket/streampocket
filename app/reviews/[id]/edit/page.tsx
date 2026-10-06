'use client'

import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Card, CardBody } from '@/components/ui/Card'
import { USER_LOGIN_PATH } from '@/constants/app'
import { getUserInfo, isUserAuthenticated } from '@/lib/userAuth'
import { ReviewForm } from '../../_components/ReviewForm'
import { useOwnReview } from '../../_hooks/useOwnReview'

export default function EditReviewPage() {
  // 클라이언트 페이지라 params를 props로 받지 않고 훅으로 읽는다 — Next 14에선 params가 Promise가
  // 아닌 일반 객체로 와서 use(params)가 "unsupported type" 에러로 페이지 전체가 깨졌다 (14·15 모두 동작)
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [authChecked, setAuthChecked] = useState(false)
  const reviewQuery = useOwnReview(authChecked ? id : undefined)

  useEffect(() => {
    if (!isUserAuthenticated()) {
      const next = encodeURIComponent(`/reviews/${id}/edit`)
      router.replace(`${USER_LOGIN_PATH}?next=${next}`)
      return
    }
    setAuthChecked(true)
  }, [router, id])

  if (!authChecked || reviewQuery.isLoading) {
    return (
      <section className="py-20 text-center text-body-md text-text-muted">
        리뷰를 불러오는 중...
      </section>
    )
  }

  if (reviewQuery.isError || !reviewQuery.data) {
    return (
      <section className="py-20 text-center text-body-md text-text-muted">
        리뷰를 찾을 수 없어요.
      </section>
    )
  }

  const review = reviewQuery.data
  const me = getUserInfo()
  if (!me || me.id !== review.userId) {
    return (
      <section className="py-20 text-center text-body-md text-text-muted">
        본인이 작성한 리뷰만 수정할 수 있어요.
      </section>
    )
  }

  return (
    <section className="mx-auto max-w-2xl space-y-4 py-4">
      <header>
        <h1 className="text-display text-text-primary">리뷰 수정</h1>
        <p className="mt-1 text-body-md text-text-secondary">{review.product.name}</p>
      </header>
      <Card>
        <CardBody>
          <ReviewForm
            mode="edit"
            reviewId={review.id}
            lockedApplicationId={review.applicationId}
            initial={{
              applicationId: review.applicationId,
              productName: review.product.name,
              content: review.content,
              rating: review.rating,
              imageUrl: review.imageUrl,
            }}
          />
        </CardBody>
      </Card>
    </section>
  )
}
