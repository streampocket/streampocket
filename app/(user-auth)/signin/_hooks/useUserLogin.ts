'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import { userApi } from '@/lib/userApi'
import { setUserAuthSession } from '@/lib/userAuth'
import { USER_MYPAGE_PATH } from '@/constants/app'

type LoginResponse = {
  data: {
    token: string
    user: {
      id: string
      email: string
      name: string
    }
  }
}

export function useUserLogin() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (email: string, password: string) => {
    setIsLoading(true)

    try {
      const result = await userApi.post<LoginResponse>('/own/auth/login', {
        email,
        password,
      })

      setUserAuthSession({
        token: result.data.token,
        user: result.data.user,
      })

      const next = searchParams.get('next')
      router.push(next?.startsWith('/') ? next : USER_MYPAGE_PATH)
      router.refresh()
    } catch (err) {
      const message = err instanceof Error ? err.message : '로그인에 실패했습니다.'
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  return { handleLogin, isLoading }
}
