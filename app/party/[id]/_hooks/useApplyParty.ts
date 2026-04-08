'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { userApi } from '@/lib/userApi'
import { QUERY_KEYS } from '@/constants/queryKeys'
import { toast } from 'sonner'
import type { PartyApplication } from '@/types/domain'

type ApplyResponse = {
  data: PartyApplication
}

export function useApplyParty(productId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () =>
      userApi.post<ApplyResponse>(`/own/products/${productId}/apply`),
    onSuccess: () => {
      toast.success('파티 참여 신청이 완료되었습니다. 관리자가 확인 후 연락드리겠습니다.')
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ownProducts.detail(productId) })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.partyApplications.check(productId) })
    },
    onError: (error: Error) => {
      toast.error(error.message ?? '파티 신청에 실패했습니다.')
    },
  })
}
