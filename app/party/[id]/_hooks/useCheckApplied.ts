'use client'

import { useQuery } from '@tanstack/react-query'
import { userApi } from '@/lib/userApi'
import { QUERY_KEYS } from '@/constants/queryKeys'
import { getUserInfo } from '@/lib/userAuth'
import type { PartyApplicationStatus } from '@/types/domain'

export type ApplyRestriction = {
  type: 'category_pending' | 'return_cooldown'
  /** 차단 원인 파티명 (pending 중인 파티 / 반품된 파티) */
  partyName: string
  /** return_cooldown일 때 재신청 가능 시각(ISO). category_pending은 null */
  retryAt: string | null
}

type CheckData = {
  applied: boolean
  applicationStatus: PartyApplicationStatus | null
  /** 신청 불가 사유 — 미신청(applied=false)일 때만 계산됨. 신청 가능하면 null */
  restriction: ApplyRestriction | null
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
