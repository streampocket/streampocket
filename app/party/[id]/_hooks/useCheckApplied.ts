'use client'

import { useQuery } from '@tanstack/react-query'
import { userApi } from '@/lib/userApi'
import { QUERY_KEYS } from '@/constants/queryKeys'
import { getUserInfo } from '@/lib/userAuth'
import type { PartyApplicationStatus } from '@/types/domain'

type CheckData = {
  applied: boolean
  applicationStatus: PartyApplicationStatus | null
}

type CheckResponse = {
  data: CheckData
}

export function useCheckApplied(productId: string) {
  const userInfo = getUserInfo()

  return useQuery({
    queryKey: QUERY_KEYS.partyApplications.check(productId),
    queryFn: () => userApi.get<CheckResponse>(`/own/products/${productId}/apply/check`),
    select: (res) => res.data,
    enabled: !!productId && !!userInfo,
  })
}
