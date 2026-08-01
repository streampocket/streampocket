import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { QUERY_KEYS } from '@/constants/queryKeys'
import type { ApplicationHourStats, RangeParams } from '../_types'

/**
 * 파티 신청이 들어온 시간대 분포.
 * 파티는 OTTALL 전용이라 지코인 탭에서는 `enabled: false`로 요청 자체를 보내지 않는다.
 */
export function useApplicationHours(params: RangeParams, enabled: boolean) {
  const searchParams = new URLSearchParams({ from: params.from, to: params.to })

  return useQuery({
    queryKey: QUERY_KEYS.adminPartyApplications.hourly(params),
    queryFn: () =>
      api.get<{ data: ApplicationHourStats }>(
        `/own/admin/applications/hourly?${searchParams.toString()}`,
      ),
    enabled,
  })
}
