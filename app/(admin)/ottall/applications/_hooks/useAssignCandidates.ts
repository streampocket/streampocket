'use client'

import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { QUERY_KEYS } from '@/constants/queryKeys'
import type { ApiResponse } from '@/types/api'
import type { AssignCandidate } from '../_types'

/**
 * 승인 시 배정할 계정 후보 목록.
 *
 * `enabled`로 지연 로드하는 이유가 두 가지다:
 * 1. 응답에 후보 **전건**의 비밀번호·OTP 시크릿이 평문으로 실린다 — 필요할 때만 받는다.
 * 2. 모달을 열기만 한 관리자에게는 불필요한 조회다 (기본 경로는 자동 선택이다).
 *
 * `staleTime: 0`인 이유: 빈자리·파티원은 다른 관리자 작업으로 계속 바뀐다. 낡은 목록을 보고
 * 고르면 승인 시점에 `chosen_unavailable`로 실패하므로, 열 때마다 현재 상태를 받는다.
 */
export function useAssignCandidates(applicationId: string, enabled: boolean) {
  return useQuery({
    queryKey: QUERY_KEYS.adminApplications.assignCandidates(applicationId),
    queryFn: () =>
      api.get<ApiResponse<AssignCandidate[]>>(
        `/own/admin/applications/${applicationId}/assign-candidates`,
      ),
    select: (res) => res.data,
    enabled,
    staleTime: 0,
    // 후보를 못 가져오는 사유(이미 배정됨·조건 계정 0건 등)는 재시도해도 같다
    retry: false,
  })
}
