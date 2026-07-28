'use client'

import { useQuery } from '@tanstack/react-query'
import { userApi } from '@/lib/userApi'
import { QUERY_KEYS } from '@/constants/queryKeys'
import type { OwnProduct } from '@/types/domain'

type ProductDetailResponse = {
  data: OwnProduct
}

// initialProduct는 페이지(서버 컴포넌트)가 JSON-LD를 만들며 이미 가져온 파티다.
// 넘겨주면 서버 렌더 시점부터 실제 내용이 HTML에 담기고(구글봇·초기 표시), 같은 API를 다시 부르지 않는다.
// select가 응답 래퍼를 벗기므로 initialData도 동일한 래퍼 모양으로 맞춘다.
export function useOwnProductDetail(id: string, initialProduct?: OwnProduct) {
  return useQuery({
    queryKey: QUERY_KEYS.ownProducts.detail(id),
    queryFn: () => userApi.get<ProductDetailResponse>(`/own/products/${id}`),
    select: (res) => res.data,
    enabled: !!id,
    initialData: initialProduct ? { data: initialProduct } : undefined,
  })
}
