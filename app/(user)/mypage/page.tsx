import { Suspense } from 'react'
import type { Metadata } from 'next'
import { USER_BRAND_NAME } from '@/constants/app'
import { MyPageTabs } from './_components/MyPageTabs'

export const metadata: Metadata = {
  title: `마이페이지 | ${USER_BRAND_NAME}`,
  description: '내 정보를 확인하고 관리합니다.',
}

export default function MyPage() {
  // MyPageTabs가 useSearchParams를 사용하므로 Suspense 경계 필수 (Next 14 정적 프리렌더)
  return (
    <Suspense>
      <MyPageTabs />
    </Suspense>
  )
}
