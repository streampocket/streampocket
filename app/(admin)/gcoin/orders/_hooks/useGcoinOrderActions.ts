'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { QUERY_KEYS } from '@/constants/queryKeys'
import type { GcoinOrder } from '../_types'

type ActionResponse = {
  data: GcoinOrder
}

export function useApproveGcoinOrder() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.post<ActionResponse>(`/gcoin/admin/orders/${id}/approve`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.adminGcoinOrders.all() })
      // 승인 시 통합 주문·상품 구매수도 변하므로 함께 무효화
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.adminGcoinProducts.all() })
    },
  })
}

export function useRejectGcoinOrder() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string | null }) =>
      api.post<ActionResponse>(`/gcoin/admin/orders/${id}/reject`, { reason }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.adminGcoinOrders.all() })
    },
  })
}
