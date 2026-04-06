'use client'

import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { isUserAuthenticated } from '@/lib/userAuth'
import { USER_LOGIN_PATH } from '@/constants/app'

type UserAuthGuardProps = {
  children: React.ReactNode
}

export function UserAuthGuard({ children }: UserAuthGuardProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (!isUserAuthenticated()) {
      const next = pathname ? `?next=${encodeURIComponent(pathname)}` : ''
      router.replace(`${USER_LOGIN_PATH}${next}`)
      return
    }

    setReady(true)
  }, [pathname, router])

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-body-md text-text-secondary">인증 상태를 확인하는 중입니다.</p>
      </div>
    )
  }

  return <>{children}</>
}
