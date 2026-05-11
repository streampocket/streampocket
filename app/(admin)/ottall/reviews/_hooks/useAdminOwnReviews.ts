'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { QUERY_KEYS } from '@/constants/queryKeys'
import type { OwnAdminReview } from '@/types/domain'

type ListResponse = {
  data: {
    items: OwnAdminReview[]
    total: number
    page: number
    pageSize: number
    totalPages: number
  }
}

export type AdminReviewListParams = {
  search?: string
  categoryId?: string
  rating?: number
  page?: number
  pageSize?: number
}

export function useAdminOwnReviews(params: AdminReviewListParams = {}) {
  const searchParams = new URLSearchParams()
  if (params.search) searchParams.set('search', params.search)
  if (params.categoryId) searchParams.set('categoryId', params.categoryId)
  if (typeof params.rating === 'number') searchParams.set('rating', String(params.rating))
  searchParams.set('page', String(params.page ?? 1))
  searchParams.set('pageSize', String(params.pageSize ?? 20))

  return useQuery({
    queryKey: QUERY_KEYS.adminOwnReviews.list(params),
    queryFn: () => api.get<ListResponse>(`/own/admin/reviews?${searchParams.toString()}`),
    select: (res) => res.data,
  })
}

export function useDeleteAdminOwnReview() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.delete<void>(`/own/admin/reviews/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.adminOwnReviews.all() })
    },
  })
}
