'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/Button'
import { useAdminMe } from '@/hooks/useAdminMe'
import { canAccessPath, getFirstAccessiblePath } from '@/lib/adminAccess'
import { clearAuthSession, isAuthenticated } from '@/lib/auth'

type AuthGuardProps = {
  children: React.ReactNode
}

function GuardMessage({ message }: { message: string }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-content-bg">
      <p className="text-body-md text-text-secondary">{message}</p>
    </div>
  )
}

// 권한이 하나도 없는 직원 계정 — 메뉴가 비어 있으므로 안내와 로그아웃만 보여준다
function NoPermission() {
  const router = useRouter()
  const queryClient = useQueryClient()

  const handleLogout = () => {
    clearAuthSession()
    queryClient.clear()
    router.replace('/login')
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-content-bg">
      <p className="text-body-md text-text-secondary">
        볼 수 있는 페이지가 없습니다. 사장님께 권한을 요청해 주세요.
      </p>
      <Button variant="secondary" onClick={handleLogout}>
        로그아웃
      </Button>
    </div>
  )
}

// 페이지 권한 확인 — 화면 표시용이며 실제 차단은 서버가 API마다 한다
function AdminAccessGate({ children }: AuthGuardProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { data: me, isError, refetch } = useAdminMe()
  const isFirstPath = useRef(true)

  // 메뉴 이동마다 권한을 다시 받는다 — 사장이 권한을 바꾸면 직원의 다음 클릭부터 메뉴·접근이 바뀐다
  // (첫 렌더는 useQuery가 이미 받아오므로 건너뜀)
  useEffect(() => {
    if (isFirstPath.current) {
      isFirstPath.current = false
      return
    }
    void refetch()
  }, [pathname, refetch])

  const allowed = me ? canAccessPath(me, pathname) : false
  const fallbackPath = me ? getFirstAccessiblePath(me) : null

  // 권한 없는 페이지(로그인 직후 기본 대시보드 포함)는 볼 수 있는 첫 페이지로 보낸다
  useEffect(() => {
    if (me && !allowed && fallbackPath) router.replace(fallbackPath)
  }, [me, allowed, fallbackPath, router])

  if (isError) return <GuardMessage message="계정 정보를 불러오지 못했습니다. 새로고침해 주세요." />
  if (!me) return <GuardMessage message="인증 상태를 확인하는 중입니다." />
  if (!allowed) return fallbackPath ? <GuardMessage message="이동하는 중입니다." /> : <NoPermission />

  return <>{children}</>
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

  if (!ready) return <GuardMessage message="인증 상태를 확인하는 중입니다." />

  return <AdminAccessGate>{children}</AdminAccessGate>
}
