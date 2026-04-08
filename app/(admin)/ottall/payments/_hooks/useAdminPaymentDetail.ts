'use client'

import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { QUERY_KEYS } from '@/constants/queryKeys'
import type { PaymentWithDetails } from '@/types/domain'

type DetailResponse = {
  data: PaymentWithDetails
}

export function useAdminPaymentDetail(id: string | null) {
  return useQuery({
    queryKey: QUERY_KEYS.adminPayments.detail(id ?? ''),
    queryFn: () => api.get<DetailResponse>(`/own/admin/payments/${id}`),
    select: (res) => res.data,
    enabled: !!id,
  })
}
