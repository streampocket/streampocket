'use client'

import { useQuery } from '@tanstack/react-query'
import { userApi } from '@/lib/userApi'
import { QUERY_KEYS } from '@/constants/queryKeys'
import type { OwnProduct } from '@/types/domain'
import type { ProductListParams } from '../_types'

type ProductsResponse = {
  data: OwnProduct[]
}

/**
 * 서버가 미리 받아둔 목록이 이 조회에 해당하는지.
 *
 * 서버는 "필터 없는 모집중 전체"만 미리 받는다. 사용자가 카테고리·정렬을 바꾸면
 * queryKey가 달라지는데, 그때도 initialData를 주면 **필터가 적용되지 않은 목록이
 * 초기값으로 잘못 표시된다.** 그래서 초기 조회일 때만 넘긴다.
 */
function isServerPrefetchedQuery(params: ProductListParams): boolean {
  return !params.categoryId && !params.sort && params.status === 'recruiting'
}

export function useOwnProducts(
  params: ProductListParams = {},
  /** `/party` 페이지가 서버에서 받아 넘긴 목록 (크롤러용 SSR) */
  initialProducts?: OwnProduct[],
) {
  const searchParams = new URLSearchParams()
  if (params.categoryId) searchParams.set('categoryId', params.categoryId)
  if (params.status) searchParams.set('status', params.status)
  if (params.sort) searchParams.set('sort', params.sort)
  const qs = searchParams.toString()

  // select가 래퍼를 벗기므로 initialData도 응답과 같은 `{ data }` 모양이어야 한다
  const initialData =
    initialProducts && initialProducts.length > 0 && isServerPrefetchedQuery(params)
      ? { data: initialProducts }
      : undefined

  return useQuery({
    queryKey: QUERY_KEYS.ownProducts.list(params),
    queryFn: () =>
      userApi.get<ProductsResponse>(`/own/products${qs ? `?${qs}` : ''}`),
    select: (res) => res.data,
    initialData,
  })
}
