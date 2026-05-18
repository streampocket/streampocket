import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { QUERY_KEYS } from '@/constants/queryKeys'
import type { SteamRegistration } from '@/types/domain'
import type { ApiResponse } from '@/types/api'

export function useRegistrationDetail(id: string | null) {
  return useQuery({
    queryKey: QUERY_KEYS.steamRegistrations.detail(id ?? ''),
    queryFn: () => api.get<ApiResponse<SteamRegistration>>(`/steam/admin/registrations/${id}`),
    select: (res) => res.data,
    enabled: id !== null,
  })
}
