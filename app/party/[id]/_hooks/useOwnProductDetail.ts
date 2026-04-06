'use client'

import { useQuery } from '@tanstack/react-query'
import { userApi } from '@/lib/userApi'
import { QUERY_KEYS } from '@/constants/queryKeys'
import type { OwnProduct } from '@/types/domain'

type ProductDetailResponse = {
  data: OwnProduct
}

export function useOwnProductDetail(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.ownProducts.detail(id),
    queryFn: () => userApi.get<ProductDetailResponse>(`/own/products/${id}`),
    select: (res) => res.data,
    enabled: !!id,
  })
}
