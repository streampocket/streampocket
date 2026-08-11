'use client'

import { useQuery } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/constants/queryKeys'
import { userApi } from '@/lib/userApi'
import type { ReviewableApplication } from '@/types/domain'

type Response = { data: ReviewableApplication[] }

// enabled 가드 주의: userApi는 401이면 로그인 페이지로 강제 이동시킨다 —
// 비로그인 상태에서 호출될 수 있는 곳(리뷰 유도 모달)은 반드시 enabled로 조회를 막아야 한다.
export function useReviewableApplications(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: QUERY_KEYS.ownReviews.eligible(),
    queryFn: () => userApi.get<Response>('/own/reviews/eligible'),
    select: (res) => res.data,
    enabled: options?.enabled ?? true,
  })
}
