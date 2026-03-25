import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { QUERY_KEYS } from '@/constants/queryKeys'
import type { SteamProduct } from '@/types/domain'
import type { PaginatedResponse } from '@/types/api'
import type { ProductListParams } from '../_types'

export function useProducts(params: ProductListParams = {}) {
  const { status } = params
  const searchParams = new URLSearchParams()
  if (status) searchParams.set('status', status)

  return useQuery({
    queryKey: QUERY_KEYS.products.list(params),
    queryFn: () =>
      api.get<PaginatedResponse<SteamProduct>>(
        `/steam/admin/products${searchParams.toString() ? `?${searchParams.toString()}` : ''}`,
      ),
  })
}
