'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { userApi } from '@/lib/userApi'
import { QUERY_KEYS } from '@/constants/queryKeys'
import type { Partner } from '@/types/domain'

type ApplyPartnerPayload = {
  name: string
  phone: string
  bankName: string
  bankAccount: string
  agreedToTerms: true
}

type ApplyPartnerResponse = {
  data: Partner
}

export function useApplyPartner() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: ApplyPartnerPayload) =>
      userApi.post<ApplyPartnerResponse>('/own/partners/apply', payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.partner.me() })
      toast.success('파트너 신청이 완료되었습니다.')
    },
    onError: (error: Error) => {
      toast.error(error.message || '파트너 신청에 실패했습니다.')
    },
  })
}
