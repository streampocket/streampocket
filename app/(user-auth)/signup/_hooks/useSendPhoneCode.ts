'use client'

import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { userApi } from '@/lib/userApi'

type SendResponse = {
  data: {
    expiresIn: number
  }
}

export function useSendPhoneCode() {
  const [cooldown, setCooldown] = useState(0)

  const mutation = useMutation({
    mutationFn: async (phone: string) => {
      return userApi.post<SendResponse>('/own/auth/phone/send', { phone })
    },
    onSuccess: (result) => {
      toast.success('인증번호가 발송되었습니다.')
      setCooldown(result.data.expiresIn)
      const interval = setInterval(() => {
        setCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(interval)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    },
    onError: (err: Error) => {
      toast.error(err.message)
    },
  })

  return {
    sendCode: mutation.mutate,
    isSending: mutation.isPending,
    cooldown,
  }
}
