'use client'

import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { QUERY_KEYS } from '@/constants/queryKeys'

type CredentialsResponse = {
  data: {
    accountId: string | null
    accountPassword: string | null
  }
}

export function useAdminPartyCredentials(id: string | null, enabled: boolean) {
  return useQuery({
    queryKey: QUERY_KEYS.adminParties.credentials(id ?? ''),
    queryFn: () => api.get<CredentialsResponse>(`/own/admin/products/${id}/credentials`),
    select: (res) => res.data,
    enabled: !!id && enabled,
  })
}
