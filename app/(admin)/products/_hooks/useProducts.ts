import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { QUERY_KEYS } from '@/constants/queryKeys'
import { PRODUCTS_PAGE_SIZE } from '@/constants/app'
import type { ProductListParams, ProductListResponse } from '../_types'

export function useProducts(params: ProductListParams = {}) {
  const { status, search, page = 1, pageSize = PRODUCTS_PAGE_SIZE } = params
  const searchParams = new URLSearchParams()
  searchParams.set('page', String(page))
  searchParams.set('pageSize', String(pageSize))
  if (status) searchParams.set('status', status)
  if (search) searchParams.set('search', search)

  return useQuery({
    queryKey: QUERY_KEYS.products.list({ status, search, page, pageSize }),
    queryFn: () =>
      api.get<ProductListResponse>(`/steam/admin/products?${searchParams.toString()}`),
  })
}
