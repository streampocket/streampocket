import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { api } from '@/lib/api'
import { QUERY_KEYS } from '@/constants/queryKeys'
import type { ApiResponse } from '@/types/api'

type AutoAssignResponse = {
  assigned: true
  account: { id: string; email: string; dueAt: string | null; freeSlots: number } | null
}

/**
 * 계정 자동 배정 재시도 — 승인 시 자동 배정이 꺼져 있었거나 실패한 건 보정용.
 * 실패하면 서버가 사유 문구를 담아 409로 돌려주므로 onError에서 그대로 보여준다.
 */
export function useAutoAssignPartyAccount(orderId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () =>
      api.post<ApiResponse<AutoAssignResponse>>(
        `/steam/admin/orders/${orderId}/party-otp/auto-assign`,
        {},
      ),
    onSuccess: (response) => {
      const email = response.data.account?.email
      toast.success(
        email ? `계정을 배정했습니다. (${email})` : '계정을 배정했습니다.',
      )
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.partyOtp.detail(orderId) })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.adminApplications.all() })
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : '자동 배정에 실패했습니다.')
    },
  })
}
