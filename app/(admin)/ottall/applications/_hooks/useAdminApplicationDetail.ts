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
    // 전역 기본값(1분)을 쓰지 않는 이유: 응답의 autoAssignPreview가 "지금 승인하면 어떤 계정이
    // 배정되는지"를 매번 다시 계산한 값이라, 캐시가 살아 있으면 이미 차 버린 계정을
    // 그대로 보여주게 된다. 모달을 열 때마다 최신 후보를 다시 찾도록 캐시를 끈다.
    staleTime: 0,
    refetchOnMount: 'always',
  })
}
