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
    // 계정 통합 — 같은 번호의 기존 소셜 계정에 이메일/비밀번호가 합쳐진 경우
    merged: boolean
    previousProvider: 'local' | 'kakao' | 'google' | null
  }
}

const PROVIDER_LABELS: Record<string, string> = {
  local: '이메일',
  kakao: '카카오',
  google: '구글',
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

      if (result.data.merged) {
        const providerLabel = result.data.previousProvider
          ? PROVIDER_LABELS[result.data.previousProvider] ?? result.data.previousProvider
          : '기존'
        toast.success(`기존 ${providerLabel} 계정과 통합되었습니다. 이제 이메일 로그인도 사용할 수 있어요.`)
      } else {
        toast.success('회원가입이 완료되었습니다!')
      }
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
