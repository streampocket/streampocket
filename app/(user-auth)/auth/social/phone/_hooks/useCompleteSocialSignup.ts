'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { userApi } from '@/lib/userApi'
import { setUserAuthSession } from '@/lib/userAuth'
import { USER_MYPAGE_PATH } from '@/constants/app'

type CompleteResponse = {
  data: {
    token: string
    user: {
      id: string
      email: string
    }
  }
}

type CompleteInput = {
  tempToken: string
  phone: string
  verificationId: string
  termsAgreed: true
}

export function useCompleteSocialSignup() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleComplete = async (input: CompleteInput) => {
    setIsLoading(true)

    try {
      const result = await userApi.post<CompleteResponse>('/own/auth/social/complete', input)

      setUserAuthSession({
        token: result.data.token,
        user: {
          id: result.data.user.id,
          email: result.data.user.email,
          name: result.data.user.email,
        },
      })

      toast.success('회원가입이 완료되었습니다!')
      router.push(USER_MYPAGE_PATH)
      router.refresh()
    } catch (err) {
      const message = err instanceof Error ? err.message : '처리에 실패했습니다.'
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  return { handleComplete, isLoading }
}
