'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { userApi } from '@/lib/userApi'
import { QUERY_KEYS } from '@/constants/queryKeys'
import type { RenewalQuote } from '../_types'

type QuoteResponse = { data: RenewalQuote }

/**
 * 재구매 견적 — 할인 이벤트가 켜졌는지(카드 배지)와 확인 창 금액에 쓴다.
 * 재구매 가능한 카드에서만 조회한다 (enabled).
 */
export function useRenewalQuote(applicationId: string, enabled: boolean) {
  return useQuery({
    queryKey: QUERY_KEYS.partyApplications.renewalQuote(applicationId),
    queryFn: () => userApi.get<QuoteResponse>(`/own/applications/${applicationId}/renewal-quote`),
    select: (res) => res.data,
    enabled,
  })
}

type RequestResponse = {
  data: { renewalId: string; payableAmount: number }
}

export function useRequestRenewal(applicationId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    // 금액은 서버가 정한다 — 화면은 포인트를 쓸지 말지만 보낸다
    mutationFn: (usePoint: boolean) =>
      userApi.post<RequestResponse>(`/own/applications/${applicationId}/renewals`, { usePoint }),
    onSuccess: () => {
      toast.success('재구매를 요청했습니다. 안내 알림톡을 확인해 주세요.')
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.partyApplications.my() })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.partyApplications.renewalQuote(applicationId) })
      // 포인트를 썼으면 잔액이 바뀐다
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.userAuth.me() })
    },
    onError: (error: Error) => {
      toast.error(error.message ?? '재구매 요청에 실패했습니다.')
    },
  })
}
