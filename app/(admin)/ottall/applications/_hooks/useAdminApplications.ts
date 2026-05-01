'use client'

import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { QUERY_KEYS } from '@/constants/queryKeys'
import type { AdminApplicationListItem, AdminApplicationListParams } from '../_types'

type ListResponse = {
  data: {
    items: AdminApplicationListItem[]
    total: number
    page: number
    pageSize: number
    totalPages: number
  }
}

export function useAdminApplications(params: AdminApplicationListParams = {}) {
  const searchParams = new URLSearchParams()
  if (params.status) searchParams.set('status', params.status)
  if (params.search) searchParams.set('search', params.search)
  searchParams.set('page', String(params.page ?? 1))
  searchParams.set('pageSize', String(params.pageSize ?? 20))

  return useQuery({
    queryKey: QUERY_KEYS.adminApplications.list(params),
    queryFn: () =>
      api.get<ListResponse>(`/own/admin/applications?${searchParams.toString()}`),
    select: (res) => res.data,
  })
}
