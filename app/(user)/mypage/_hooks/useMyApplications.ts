'use client'

import { useQuery } from '@tanstack/react-query'
import { userApi } from '@/lib/userApi'
import { QUERY_KEYS } from '@/constants/queryKeys'
import type { MyApplication } from '../_types'

type MyApplicationsResponse = {
  data: MyApplication[]
}

export function useMyApplications() {
  return useQuery({
    queryKey: QUERY_KEYS.partyApplications.my(),
    queryFn: () => userApi.get<MyApplicationsResponse>('/own/applications/my'),
    select: (res) => res.data,
  })
}
