'use client'

import { useQuery } from '@tanstack/react-query'
import { userApi } from '@/lib/userApi'
import { QUERY_KEYS } from '@/constants/queryKeys'
import type { OwnProduct } from '@/types/domain'

type MyProductsResponse = {
  data: OwnProduct[]
}

export function useMyOwnProducts() {
  return useQuery({
    queryKey: QUERY_KEYS.ownProducts.my(),
    queryFn: () => userApi.get<MyProductsResponse>('/own/products/my'),
    select: (res) => res.data,
  })
}
