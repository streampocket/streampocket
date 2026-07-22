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
      name: string
    }
    // 계정 통합 — 같은 번호의 기존 계정에 소셜 수단이 자동 연결된 경우
    linked: boolean
    existingProvider: 'local' | 'kakao' | 'google' | null
  }
}

const PROVIDER_LABELS: Record<string, string> = {
  local: '이메일',
  kakao: '카카오',
  google: '구글',
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
          name: result.data.user.name,
        },
      })

      if (result.data.linked) {
        const providerLabel = result.data.existingProvider
          ? PROVIDER_LABELS[result.data.existingProvider] ?? result.data.existingProvider
          : '기존'
        toast.success(`기존 ${providerLabel} 계정에 연결되어 로그인되었습니다.`)
      } else {
        toast.success('회원가입이 완료되었습니다!')
      }
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
