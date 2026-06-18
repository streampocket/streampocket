'use client'

import { useQuery } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/constants/queryKeys'
import { api } from '@/lib/api'
import type { ApiResponse } from '@/types/api'
import type { AlimtalkSettings, AlimtalkTemplate, Store } from '@/types/domain'

// store별 알림톡 템플릿 목록. store 미지정/null이면 기본 스토어(streampocket).
export function useAlimtalkTemplates(store?: Store | null) {
  return useQuery({
    queryKey: QUERY_KEYS.alimtalk.settings(store ?? undefined),
    queryFn: () =>
      api.get<ApiResponse<AlimtalkSettings>>(
        store ? `/steam/admin/alimtalk?store=${store}` : '/steam/admin/alimtalk',
      ),
    select: (response): AlimtalkTemplate[] => response.data.runtime.templates,
    staleTime: 5 * 60 * 1000,
  })
}
