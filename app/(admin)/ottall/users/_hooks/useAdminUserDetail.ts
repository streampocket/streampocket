'use client'

import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { QUERY_KEYS } from '@/constants/queryKeys'
import type { AdminUserDetail } from '../_types'

type DetailResponse = {
  data: AdminUserDetail
}

export function useAdminUserDetail(id: string | null) {
  return useQuery({
    queryKey: QUERY_KEYS.adminUsers.detail(id ?? ''),
    queryFn: () => api.get<DetailResponse>(`/own/admin/users/${id}`),
    select: (res) => res.data,
    enabled: !!id,
  })
}
