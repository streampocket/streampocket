'use client'

import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { userApi } from '@/lib/userApi'

type VerifyResponse = {
  data: {
    verified: boolean
    verificationId: string
  }
}

export function useVerifyPhoneCode() {
  const mutation = useMutation({
    mutationFn: async (input: { phone: string; code: string }) => {
      return userApi.post<VerifyResponse>('/own/auth/phone/verify', input)
    },
    onSuccess: () => {
      toast.success('전화번호 인증이 완료되었습니다.')
    },
    onError: (err: Error) => {
      toast.error(err.message)
    },
  })

  return {
    verifyCode: mutation.mutate,
    isVerifying: mutation.isPending,
    verificationId: mutation.data?.data.verificationId ?? null,
    isVerified: mutation.data?.data.verified ?? false,
  }
}
