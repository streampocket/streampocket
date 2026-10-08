'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { api } from '@/lib/api'
import { QUERY_KEYS } from '@/constants/queryKeys'

/** 재구매 승인 — 원 신청 만료 연장 + 파티 주문 자동 생성 */
export function useApproveRenewal() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (renewalId: string) => api.post(`/own/admin/renewals/${renewalId}/approve`, {}),
    onSuccess: () => {
      toast.success('재구매를 승인했습니다. 만료일이 연장되고 주문이 생성되었습니다.')
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.adminApplications.all() })
      // 재구매 주문이 주문관리에 생기고, 만료 처리됐던 파티가 다시 닫힘(closed)으로 돌아올 수 있다
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.orders.all() })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.adminParties.all() })
    },
    onError: (error: Error) => {
      toast.error(error.message ?? '재구매 승인에 실패했습니다.')
    },
  })
}

/** 재구매 거절 — 이 재구매에 쓴 포인트만 반환 (원 신청은 그대로) */
export function useRejectRenewal() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (renewalId: string) => api.post(`/own/admin/renewals/${renewalId}/reject`, {}),
    onSuccess: () => {
      toast.success('재구매를 거절했습니다.')
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.adminApplications.all() })
    },
    onError: (error: Error) => {
      toast.error(error.message ?? '재구매 거절에 실패했습니다.')
    },
  })
}
