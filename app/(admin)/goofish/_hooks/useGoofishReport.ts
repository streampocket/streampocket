'use client'

import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { QUERY_KEYS } from '@/constants/queryKeys'
import type { GoofishReportResponse } from '../_types'

export function useGoofishReport() {
  return useQuery({
    queryKey: QUERY_KEYS.goofish.report(),
    queryFn: () => api.get<GoofishReportResponse>('/steam/admin/goofish/report'),
    refetchOnWindowFocus: false,
  })
}
