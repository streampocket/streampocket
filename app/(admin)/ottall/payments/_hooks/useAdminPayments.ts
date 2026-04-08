'use client'

import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { QUERY_KEYS } from '@/constants/queryKeys'
import type { PaymentWithDetails } from '@/types/domain'
import type { AdminPaymentListParams } from '../_types'

type PaymentsResponse = {
  data: PaymentWithDetails[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export function useAdminPayments(params: AdminPaymentListParams = {}) {
  const searchParams = new URLSearchParams()
  if (params.status) searchParams.set('status', params.status)
  if (params.from) searchParams.set('from', params.from)
  if (params.to) searchParams.set('to', params.to)
  searchParams.set('page', String(params.page ?? 1))
  searchParams.set('pageSize', String(params.pageSize ?? 20))

  const qs = searchParams.toString()

  return useQuery({
    queryKey: QUERY_KEYS.adminPayments.list(params),
    queryFn: () => api.get<PaymentsResponse>(`/own/admin/payments?${qs}`),
  })
}
