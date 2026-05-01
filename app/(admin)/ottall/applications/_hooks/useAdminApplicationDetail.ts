'use client'

import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { QUERY_KEYS } from '@/constants/queryKeys'
import type { AdminApplicationDetail } from '../_types'

type DetailResponse = {
  data: AdminApplicationDetail
}

export function useAdminApplicationDetail(applicationId: string | null) {
  return useQuery({
    queryKey: QUERY_KEYS.adminApplications.detail(applicationId ?? ''),
    queryFn: () =>
      api.get<DetailResponse>(`/own/admin/applications/${applicationId}`),
    select: (res) => res.data,
    enabled: !!applicationId,
  })
}
