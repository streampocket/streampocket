import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { QUERY_KEYS } from '@/constants/queryKeys'
import type { VisitStats, VisitStatsParams } from '../_types'

export function useVisitStats(params: VisitStatsParams) {
  const searchParams = new URLSearchParams()
  searchParams.set('site', params.site)
  if (params.from) searchParams.set('from', params.from)
  if (params.to) searchParams.set('to', params.to)

  return useQuery({
    queryKey: QUERY_KEYS.adminSiteVisits.stats(params),
    queryFn: () => api.get<{ data: VisitStats }>(`/admin/visits?${searchParams.toString()}`),
  })
}
