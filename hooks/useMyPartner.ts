'use client'

import { useQuery } from '@tanstack/react-query'
import { userApi } from '@/lib/userApi'
import { QUERY_KEYS } from '@/constants/queryKeys'
import type { Partner } from '@/types/domain'

type MyPartnerResponse = {
  data: Partner | null
}

export function useMyPartner() {
  return useQuery({
    queryKey: QUERY_KEYS.partner.me(),
    queryFn: () => userApi.get<MyPartnerResponse>('/own/partners/me'),
    select: (res) => res.data,
  })
}
