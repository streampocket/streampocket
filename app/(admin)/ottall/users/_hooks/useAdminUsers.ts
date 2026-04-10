'use client'

import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { QUERY_KEYS } from '@/constants/queryKeys'
import type { AdminUserListItem } from '../_types'
import type { UserListParams } from '../_types'

type UsersResponse = {
  data: AdminUserListItem[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export function useAdminUsers(params: UserListParams = {}) {
  const searchParams = new URLSearchParams()
  if (params.search) searchParams.set('search', params.search)
  if (params.provider) searchParams.set('provider', params.provider)
  searchParams.set('page', String(params.page ?? 1))
  searchParams.set('pageSize', String(params.pageSize ?? 20))

  const qs = searchParams.toString()

  return useQuery({
    queryKey: QUERY_KEYS.adminUsers.list(params),
    queryFn: () => api.get<UsersResponse>(`/own/admin/users?${qs}`),
  })
}
