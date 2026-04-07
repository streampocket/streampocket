'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { userApi } from '@/lib/userApi'
import { setUserAuthSession } from '@/lib/userAuth'
import { USER_MYPAGE_PATH } from '@/constants/app'

type SignupInput = {
  name: string
  email: string
  password: string
  phone: string
  verificationId: string
  termsAgreed: true
}

type SignupResponse = {
  data: {
    token: string
    user: {
      id: string
      email: string
      name: string
    }
  }
}

export function useSignup() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleSignup = async (input: SignupInput) => {
    setIsLoading(true)

    try {
      const result = await userApi.post<SignupResponse>('/own/auth/signup', input)

      setUserAuthSession({
        token: result.data.token,
        user: result.data.user,
      })

      toast.success('회원가입이 완료되었습니다!')
      router.push(USER_MYPAGE_PATH)
      router.refresh()
    } catch (err) {
      const message = err instanceof Error ? err.message : '회원가입에 실패했습니다.'
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  return { handleSignup, isLoading }
}
