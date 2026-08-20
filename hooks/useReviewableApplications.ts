'use client'

import { useQuery } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/constants/queryKeys'
import { userApi } from '@/lib/userApi'
import type { ReviewableApplication } from '@/types/domain'

type Response = { data: ReviewableApplication[] }

// enabled 가드 주의: userApi는 401이면 로그인 페이지로 강제 이동시킨다 —
// 비로그인 상태에서 호출될 수 있는 곳(리뷰 유도 모달)은 반드시 enabled로 조회를 막아야 한다.
// 추가로 공개 페이지 배경 조회는 redirectOn401: false — 만료 토큰이 남은 방문자를 튕겨내지 않는다.
export function useReviewableApplications(options?: {
  enabled?: boolean
  redirectOn401?: boolean
}) {
  return useQuery({
    queryKey: QUERY_KEYS.ownReviews.eligible(),
    queryFn: () =>
      userApi.get<Response>('/own/reviews/eligible', { redirectOn401: options?.redirectOn401 }),
    select: (res) => res.data,
    enabled: options?.enabled ?? true,
    // 인증 만료로 실패한 조회를 재시도해봐야 결과가 같다 — 401 반복 호출 방지
    retry: false,
  })
}
