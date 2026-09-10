'use client'

import { useQuery } from '@tanstack/react-query'
import { userApi } from '@/lib/userApi'
import { QUERY_KEYS } from '@/constants/queryKeys'
import type { OwnCategory } from '@/types/domain'

type CategoriesResponse = {
  data: OwnCategory[]
}

export function useOwnCategories(
  /** `/party` 페이지가 서버에서 받아 넘긴 카테고리 (크롤러용 SSR) */
  initialCategories?: OwnCategory[],
) {
  // 파라미터가 없는 단일 쿼리라 조건 없이 넘겨도 다른 조회에 섞이지 않는다.
  // select가 래퍼를 벗기므로 initialData도 `{ data }` 모양이어야 한다.
  const initialData =
    initialCategories && initialCategories.length > 0 ? { data: initialCategories } : undefined

  return useQuery({
    queryKey: QUERY_KEYS.ownCategories.list(),
    queryFn: () => userApi.get<CategoriesResponse>('/own/categories'),
    select: (res) => res.data,
    initialData,
  })
}
