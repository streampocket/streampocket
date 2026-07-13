'use client'

import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { QUERY_KEYS } from '@/constants/queryKeys'
import type { GcoinProduct, AdminGcoinProductListParams } from '../_types'

type GcoinProductsResponse = {
  data: GcoinProduct[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export function useAdminGcoinProducts(params: AdminGcoinProductListParams = {}) {
  const searchParams = new URLSearchParams()
  if (params.status) searchParams.set('status', params.status)
  if (params.category) searchParams.set('category', params.category)
  if (params.search) searchParams.set('search', params.search)
  searchParams.set('page', String(params.page ?? 1))
  searchParams.set('pageSize', String(params.pageSize ?? 20))

  const qs = searchParams.toString()

  return useQuery({
    queryKey: QUERY_KEYS.adminGcoinProducts.list(params),
    queryFn: () => api.get<GcoinProductsResponse>(`/gcoin/admin/products?${qs}`),
  })
}
