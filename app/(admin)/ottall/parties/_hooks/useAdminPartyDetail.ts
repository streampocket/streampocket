'use client'

import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { QUERY_KEYS } from '@/constants/queryKeys'
import type { AdminPartyDetail } from '@/types/domain'

type DetailResponse = {
  data: AdminPartyDetail
}

export function useAdminPartyDetail(id: string | null) {
  return useQuery({
    queryKey: QUERY_KEYS.adminParties.detail(id ?? ''),
    queryFn: () => api.get<DetailResponse>(`/own/admin/products/${id}`),
    select: (res) => res.data,
    enabled: !!id,
  })
}
