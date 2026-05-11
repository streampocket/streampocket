'use client'

import { useQuery } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/constants/queryKeys'
import { userApi } from '@/lib/userApi'
import type { ReviewableApplication } from '@/types/domain'

type Response = { data: ReviewableApplication[] }

export function useReviewableApplications() {
  return useQuery({
    queryKey: QUERY_KEYS.ownReviews.eligible(),
    queryFn: () => userApi.get<Response>('/own/reviews/eligible'),
    select: (res) => res.data,
  })
}
