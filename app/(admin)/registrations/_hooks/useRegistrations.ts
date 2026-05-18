import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { QUERY_KEYS } from '@/constants/queryKeys'
import type { SteamRegistration } from '@/types/domain'
import type { PaginatedResponse } from '@/types/api'
import type { RegistrationListParams } from '../_types'

export function useRegistrations(params: RegistrationListParams = {}) {
  const search = new URLSearchParams()
  if (params.status) search.set('status', params.status)
  if (params.matchStatus) search.set('matchStatus', params.matchStatus)
  if (params.page) search.set('page', String(params.page))

  return useQuery({
    queryKey: QUERY_KEYS.steamRegistrations.list(params),
    queryFn: () =>
      api.get<PaginatedResponse<SteamRegistration>>(
        `/steam/admin/registrations${search.toString() ? `?${search.toString()}` : ''}`,
      ),
  })
}
