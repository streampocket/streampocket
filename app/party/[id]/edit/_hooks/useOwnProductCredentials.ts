'use client'

import { useQuery } from '@tanstack/react-query'
import { userApi } from '@/lib/userApi'
import { QUERY_KEYS } from '@/constants/queryKeys'

type CredentialsResponse = {
  data: {
    accountId: string | null
    accountPassword: string | null
  }
}

export function useOwnProductCredentials(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.ownProducts.credentials(id),
    queryFn: () => userApi.get<CredentialsResponse>(`/own/products/${id}/credentials`),
    select: (res) => res.data,
    enabled: !!id,
  })
}
