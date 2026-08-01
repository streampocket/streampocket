import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { QUERY_KEYS } from '@/constants/queryKeys'
import type { RangeParams, SignupStats } from '../_types'

/**
 * OTTALL 가입자 수 (오늘 + 조회 기간).
 * 지코인은 회원가입 기능이 없어 그 탭에서는 요청하지 않는다.
 */
export function useSignupStats(params: RangeParams, enabled: boolean) {
  const searchParams = new URLSearchParams({ from: params.from, to: params.to })

  return useQuery({
    queryKey: QUERY_KEYS.adminOwnUsers.signupStats(params),
    queryFn: () =>
      api.get<{ data: SignupStats }>(`/own/admin/users/signup-stats?${searchParams.toString()}`),
    enabled,
  })
}
