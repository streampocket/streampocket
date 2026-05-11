'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Card, CardBody } from '@/components/ui/Card'
import { USER_LOGIN_PATH } from '@/constants/app'
import { isUserAuthenticated } from '@/lib/userAuth'
import { ReviewForm } from '../_components/ReviewForm'

export default function NewReviewPage() {
  const router = useRouter()
  const [authChecked, setAuthChecked] = useState(false)

  useEffect(() => {
    if (!isUserAuthenticated()) {
      const next = encodeURIComponent('/reviews/new')
      router.replace(`${USER_LOGIN_PATH}?next=${next}`)
      return
    }
    setAuthChecked(true)
  }, [router])

  if (!authChecked) {
    return (
      <section className="py-20 text-center text-body-md text-text-muted">
        로그인 확인 중...
      </section>
    )
  }

  return (
    <section className="mx-auto max-w-2xl space-y-4 py-4">
      <header>
        <h1 className="text-display text-text-primary">리뷰 작성</h1>
        <p className="mt-1 text-body-md text-text-secondary">
          참여 확정된 파티에 대한 솔직한 후기를 남겨주세요. (파티당 1회)
        </p>
      </header>
      <Card>
        <CardBody>
          <ReviewForm mode="create" />
        </CardBody>
      </Card>
    </section>
  )
}
