import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { api } from '@/lib/api'
import { QUERY_KEYS } from '@/constants/queryKeys'

// 파티 OTP 발급 횟수 초기화 — 구매자에게 다시 3회 부여 (발급 로그는 보존)
export function useResetPartyOtpCount(orderId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => api.post(`/steam/admin/orders/${orderId}/party-otp/reset`),
    onSuccess: () => {
      toast.success('발급 횟수가 초기화되었습니다.')
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.partyOtp.detail(orderId) })
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : '초기화에 실패했습니다.')
    },
  })
}
