import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { QUERY_KEYS } from '@/constants/queryKeys'
import type { ProductListParams, ProductListResponse } from '../_types'

export function useProducts(params: ProductListParams = {}) {
  const { status, search } = params
  const searchParams = new URLSearchParams()
  if (status) searchParams.set('status', status)
  if (search) searchParams.set('search', search)

  return useQuery({
    queryKey: QUERY_KEYS.products.list(params),
    queryFn: () =>
      api.get<ProductListResponse>(
        `/steam/admin/products${searchParams.toString() ? `?${searchParams.toString()}` : ''}`,
      ),
  })
}
