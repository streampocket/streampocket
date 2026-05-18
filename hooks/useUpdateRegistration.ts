import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { api } from '@/lib/api'
import { QUERY_KEYS } from '@/constants/queryKeys'

// 스팀 등록 접수 정보 수정 — 주문 상세 모달과 접수 관리 페이지에서 공용으로 사용
type UpdateRegistrationInput = {
  id: string
  steamId: string | null
  steamPassword: string | null
  gameName: string | null
  buyerName: string | null
  steamGuardCodes: string | null
  steamGuardDisabled: boolean | null
  refundConsent: boolean
  adminMemo: string | null
}

export function useUpdateRegistration() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, ...body }: UpdateRegistrationInput) =>
      api.patch(`/steam/admin/registrations/${id}`, body),
    onSuccess: () => {
      toast.success('스팀 등록 접수 정보가 저장되었습니다.')
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.steamRegistrations.all() })
    },
    onError: (error: Error) => {
      toast.error(error.message ?? '저장에 실패했습니다.')
    },
  })
}
