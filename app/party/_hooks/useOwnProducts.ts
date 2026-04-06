'use client'

import { useQuery } from '@tanstack/react-query'
import { userApi } from '@/lib/userApi'
import { QUERY_KEYS } from '@/constants/queryKeys'
import type { OwnProduct } from '@/types/domain'
import type { ProductListParams } from '../_types'

type ProductsResponse = {
  data: OwnProduct[]
}

export function useOwnProducts(params: ProductListParams = {}) {
  const searchParams = new URLSearchParams()
  if (params.categoryId) searchParams.set('categoryId', params.categoryId)
  if (params.status) searchParams.set('status', params.status)
  const qs = searchParams.toString()

  return useQuery({
    queryKey: QUERY_KEYS.ownProducts.list(params),
    queryFn: () =>
      userApi.get<ProductsResponse>(`/own/products${qs ? `?${qs}` : ''}`),
    select: (res) => res.data,
  })
}
