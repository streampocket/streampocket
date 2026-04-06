'use client'

import { useQuery } from '@tanstack/react-query'
import { userApi } from '@/lib/userApi'
import { QUERY_KEYS } from '@/constants/queryKeys'
import type { OwnCategory } from '@/types/domain'

type CategoriesResponse = {
  data: OwnCategory[]
}

export function useOwnCategories() {
  return useQuery({
    queryKey: QUERY_KEYS.ownCategories.list(),
    queryFn: () => userApi.get<CategoriesResponse>('/own/categories'),
    select: (res) => res.data,
  })
}
