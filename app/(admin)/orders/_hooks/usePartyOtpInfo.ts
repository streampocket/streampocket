import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { QUERY_KEYS } from '@/constants/queryKeys'
import type { ApiResponse } from '@/types/api'
import type { PartyOtpInfo } from '../_types'

export function usePartyOtpInfo(orderId: string | null, enabled: boolean) {
  return useQuery({
    queryKey: QUERY_KEYS.partyOtp.detail(orderId ?? ''),
    queryFn: () => api.get<ApiResponse<PartyOtpInfo>>(`/steam/admin/orders/${orderId}/party-otp`),
    select: (res) => res.data,
    enabled: orderId !== null && enabled,
  })
}
