'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { setUserAuthSession } from '@/lib/userAuth'
import { USER_MYPAGE_PATH, USER_LOGIN_PATH } from '@/constants/app'

function parseJwtPayload(token: string): { id: string; email: string; name?: string } | null {
  try {
    const parts = token.split('.')
    if (parts.length !== 3 || !parts[1]) return null
    const payload = JSON.parse(atob(parts[1]))
    if (typeof payload.id === 'string' && typeof payload.email === 'string') {
      return {
        id: payload.id,
        email: payload.email,
        name: typeof payload.name === 'string' ? payload.name : payload.email,
      }
    }
    return null
  } catch {
    return null
  }
}

export function SocialCallbackHandler() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const token = searchParams.get('token')

    if (!token) {
      router.replace(USER_LOGIN_PATH)
      return
    }

    const payload = parseJwtPayload(token)
    if (!payload) {
      router.replace(USER_LOGIN_PATH)
      return
    }

    setUserAuthSession({
      token,
      user: {
        id: payload.id,
        email: payload.email,
        name: payload.name ?? payload.email,
      },
    })

    router.replace(USER_MYPAGE_PATH)
  }, [router, searchParams])

  return (
    <div className="flex flex-col items-center gap-3 py-12">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand border-t-transparent" />
      <p className="text-body-md text-text-secondary">로그인 처리 중...</p>
    </div>
  )
}
