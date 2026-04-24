'use client'

import { useQuery } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/constants/queryKeys'
import { api } from '@/lib/api'
import type { ApiResponse } from '@/types/api'
import type { AlimtalkSettings, AlimtalkTemplate } from '@/types/domain'

export function useAlimtalkTemplates() {
  return useQuery({
    queryKey: QUERY_KEYS.alimtalk.settings(),
    queryFn: () => api.get<ApiResponse<AlimtalkSettings>>('/steam/admin/alimtalk'),
    select: (response): AlimtalkTemplate[] => response.data.runtime.templates,
    staleTime: 5 * 60 * 1000,
  })
}
