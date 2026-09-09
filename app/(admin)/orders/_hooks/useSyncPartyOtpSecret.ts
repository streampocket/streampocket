import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { api } from '@/lib/api'
import { QUERY_KEYS } from '@/constants/queryKeys'

/**
 * 계정의 현재 OTP 시크릿을 신청 복사본에 다시 복사한다.
 *
 * 배정 시점에 시크릿을 복사하는 구조라, 이후 계정 시크릿이 바뀌면 두 값이 갈라져
 * 구매자가 틀린 코드를 받는다. 이 동작이 그 상태를 해소한다 (발급 횟수는 유지).
 */
export function useSyncPartyOtpSecret(orderId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => api.post(`/steam/admin/orders/${orderId}/party-otp/sync-secret`, {}),
    onSuccess: () => {
      toast.success('계정의 현재 시크릿으로 동기화했습니다.')
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.partyOtp.detail(orderId) })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.adminApplications.all() })
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : '시크릿 동기화에 실패했습니다.')
    },
  })
}
