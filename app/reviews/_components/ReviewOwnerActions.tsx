'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { getUserInfo } from '@/lib/userAuth'

type ReviewOwnerActionsProps = {
  reviewId: string
  authorId: string
}

export function ReviewOwnerActions({ reviewId, authorId }: ReviewOwnerActionsProps) {
  const [isOwner, setIsOwner] = useState(false)

  useEffect(() => {
    const user = getUserInfo()
    setIsOwner(Boolean(user && user.id === authorId))
  }, [authorId])

  if (!isOwner) return null

  return (
    <Link href={`/reviews/${reviewId}/edit`}>
      <Button variant="secondary" size="sm">
        수정
      </Button>
    </Link>
  )
}
