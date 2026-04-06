'use client'

import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { QUERY_KEYS } from '@/constants/queryKeys'
import type { AdminPartnerWithUser } from '../_types'

type PartnersResponse = {
  data: AdminPartnerWithUser[]
}

type UseAdminPartnersParams = {
  status?: 'pending' | 'approved' | 'rejected'
}

export function useAdminPartners(params?: UseAdminPartnersParams) {
  const queryParams = params?.status ? `?status=${params.status}` : ''

  return useQuery({
    queryKey: QUERY_KEYS.adminPartners.list(params),
    queryFn: () => api.get<PartnersResponse>(`/own/admin/partners${queryParams}`),
    select: (res) => res.data,
  })
}
