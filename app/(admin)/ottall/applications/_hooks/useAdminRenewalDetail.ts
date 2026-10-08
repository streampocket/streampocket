'use client'

import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { QUERY_KEYS } from '@/constants/queryKeys'
import type { AdminRenewalDetail } from '../_types'

type DetailResponse = {
  data: AdminRenewalDetail
}

export function useAdminRenewalDetail(renewalId: string | null) {
  return useQuery({
    queryKey: QUERY_KEYS.adminApplications.renewalDetail(renewalId ?? ''),
    queryFn: () => api.get<DetailResponse>(`/own/admin/renewals/${renewalId}`),
    select: (res) => res.data,
    enabled: !!renewalId,
    // 대기 건의 연장 구간은 "지금 승인하면"으로 매번 다시 계산된 값이라 모달을 열 때마다 새로 받는다
    staleTime: 0,
    refetchOnMount: 'always',
  })
}
