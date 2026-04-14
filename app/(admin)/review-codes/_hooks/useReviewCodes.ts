import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { QUERY_KEYS } from '@/constants/queryKeys'
import type { ReviewCodeListParams, ReviewCodeListResponse } from '../_types'

export function useReviewCodes(params: ReviewCodeListParams = {}) {
  const { status, gameName, sortField = 'createdAt', dateOrder = 'desc', page = 1, pageSize = 10 } = params

  const searchParams = new URLSearchParams()
  searchParams.set('page', String(page))
  searchParams.set('pageSize', String(pageSize))
  searchParams.set('sortField', sortField)
  searchParams.set('dateOrder', dateOrder)
  if (status) searchParams.set('status', status)
  if (gameName) searchParams.set('gameName', gameName)

  return useQuery({
    queryKey: QUERY_KEYS.reviewCodes.list(params),
    queryFn: () =>
      api.get<ReviewCodeListResponse>(`/steam/admin/review-codes?${searchParams.toString()}`),
  })
}
