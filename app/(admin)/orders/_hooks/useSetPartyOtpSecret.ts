import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { api } from '@/lib/api'
import { QUERY_KEYS } from '@/constants/queryKeys'

// 파티 OTP 시크릿 등록/재등록 — 서버가 Base32 검증 후 암호화 저장 (재등록해도 발급 횟수 유지)
export function useSetPartyOtpSecret(orderId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (secret: string) =>
      api.post(`/steam/admin/orders/${orderId}/party-otp/secret`, { secret }),
    onSuccess: () => {
      toast.success('OTP 시크릿키가 등록되었습니다.')
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.partyOtp.detail(orderId) })
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : '시크릿키 등록에 실패했습니다.')
    },
  })
}
