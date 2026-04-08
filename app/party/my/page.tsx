import type { Metadata } from 'next'
import { USER_BRAND_NAME } from '@/constants/app'
import { UserAuthGuard } from '@/components/auth/UserAuthGuard'
import { MyProductList } from './_components/MyProductList'

export const metadata: Metadata = {
  title: `내 파티 관리 | ${USER_BRAND_NAME}`,
  description: '내가 등록한 파티를 관리합니다.',
}

export default function MyProductsPage() {
  return (
    <UserAuthGuard>
      <section className="py-4">
        <MyProductList />
      </section>
    </UserAuthGuard>
  )
}
