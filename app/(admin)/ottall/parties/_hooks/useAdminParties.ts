'use client'

import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { QUERY_KEYS } from '@/constants/queryKeys'
import type { OwnProduct } from '@/types/domain'
import type { AdminPartyListParams } from '../_types'

type PartiesResponse = {
  data: OwnProduct[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export function useAdminParties(params: AdminPartyListParams = {}) {
  const searchParams = new URLSearchParams()
  if (params.status) searchParams.set('status', params.status)
  if (params.search) searchParams.set('search', params.search)
  searchParams.set('page', String(params.page ?? 1))
  searchParams.set('pageSize', String(params.pageSize ?? 20))

  const qs = searchParams.toString()

  return useQuery({
    queryKey: QUERY_KEYS.adminParties.list(params),
    queryFn: () => api.get<PartiesResponse>(`/own/admin/products?${qs}`),
  })
}
