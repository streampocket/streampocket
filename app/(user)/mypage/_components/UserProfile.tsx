'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { clearUserAuthSession } from '@/lib/userAuth'
import { USER_LOGIN_PATH } from '@/constants/app'
import { useUserProfile } from '@/hooks/useUserProfile'

const PROVIDER_LABELS: Record<string, string> = {
  local: '이메일',
  kakao: '카카오',
  google: '구글',
}

export function UserProfile() {
  const router = useRouter()
  const { data: user, isLoading, error } = useUserProfile()

  const handleLogout = () => {
    clearUserAuthSession()
    router.replace(USER_LOGIN_PATH)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-body-md text-text-secondary">로딩 중...</p>
      </div>
    )
  }

  if (error || !user) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-body-md text-red-500">정보를 불러올 수 없습니다.</p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-md">
      <h1 className="mb-6 text-heading-lg text-text-primary">마이페이지</h1>

      <div className="rounded-xl border border-border bg-card-bg p-6 shadow-[0_1px_3px_rgba(0,0,0,.08),0_1px_2px_rgba(0,0,0,.06)]">
        <div className="mb-6 flex flex-col gap-4">
          <div>
            <p className="text-caption-md font-semibold text-text-muted">이름</p>
            <p className="text-body-lg text-text-primary">{user.name}</p>
          </div>

          <div>
            <p className="text-caption-md font-semibold text-text-muted">이메일</p>
            <p className="text-body-lg text-text-primary">{user.email}</p>
          </div>

          <div>
            <p className="text-caption-md font-semibold text-text-muted">전화번호</p>
            <p className="text-body-lg text-text-primary">{user.phone}</p>
          </div>

          <div>
            <p className="text-caption-md mb-1 font-semibold text-text-muted">가입 방식</p>
            <Badge variant="blue">
              {PROVIDER_LABELS[user.provider] ?? user.provider}
            </Badge>
          </div>
        </div>

        <Button variant="secondary" onClick={handleLogout} className="w-full">
          로그아웃
        </Button>
      </div>
    </div>
  )
}
