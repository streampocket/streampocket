'use client'

import { useQuery } from '@tanstack/react-query'
import { userApi } from '@/lib/userApi'
import { QUERY_KEYS } from '@/constants/queryKeys'
import type { ApplicationCredentials } from '../_types'

type CredentialsResponse = {
  data: ApplicationCredentials
}

export function useApplicationCredentials(applicationId: string | null) {
  return useQuery({
    queryKey: QUERY_KEYS.partyApplications.credentials(applicationId ?? ''),
    queryFn: () => userApi.get<CredentialsResponse>(`/own/applications/${applicationId}/credentials`),
    select: (res) => res.data,
    enabled: !!applicationId,
    staleTime: 0,
    gcTime: 0,
  })
}
