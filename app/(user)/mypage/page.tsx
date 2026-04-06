import type { Metadata } from 'next'
import { USER_BRAND_NAME } from '@/constants/app'
import { UserProfile } from './_components/UserProfile'

export const metadata: Metadata = {
  title: `마이페이지 | ${USER_BRAND_NAME}`,
  description: '내 정보를 확인하고 관리합니다.',
}

export default function MyPage() {
  return <UserProfile />
}
