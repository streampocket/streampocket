import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { QUERY_KEYS } from '@/constants/queryKeys'
import type { SteamAccount } from '@/types/domain'
import type { PaginatedResponse } from '@/types/api'
import type { AccountListParams } from '../_types'

export function useAccounts(params: AccountListParams = {}) {
  const { productId, status } = params
  const searchParams = new URLSearchParams()
  if (productId) searchParams.set('productId', productId)
  if (status) searchParams.set('status', status)

  return useQuery({
    queryKey: QUERY_KEYS.accounts.list(params),
    queryFn: () =>
      api.get<PaginatedResponse<SteamAccount>>(
        `/steam/admin/accounts${searchParams.toString() ? `?${searchParams.toString()}` : ''}`,
      ),
  })
}
