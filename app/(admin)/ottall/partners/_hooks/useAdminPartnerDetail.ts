'use client'

import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { QUERY_KEYS } from '@/constants/queryKeys'
import type { AdminPartnerDetail } from '../_types'

type PartnerDetailResponse = {
  data: AdminPartnerDetail
}

export function useAdminPartnerDetail(id: string | null) {
  return useQuery({
    queryKey: QUERY_KEYS.adminPartners.detail(id ?? ''),
    queryFn: () => api.get<PartnerDetailResponse>(`/own/admin/partners/${id}`),
    select: (res) => res.data,
    enabled: !!id,
  })
}
