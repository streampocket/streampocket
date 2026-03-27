'use client'

import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { isAuthenticated } from '@/lib/auth'

type AuthGuardProps = {
  children: React.ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (!isAuthenticated()) {
      const next = pathname ? `?next=${encodeURIComponent(pathname)}` : ''
      router.replace(`/login${next}`)
      return
    }

    setReady(true)
  }, [pathname, router])

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-content-bg">
        <p className="text-body-md text-text-secondary">인증 상태를 확인하는 중입니다.</p>
      </div>
    )
  }

  return <>{children}</>
}
