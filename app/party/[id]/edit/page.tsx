import type { Metadata } from 'next'
import { USER_BRAND_NAME } from '@/constants/app'
import { UserAuthGuard } from '@/components/auth/UserAuthGuard'
import { OwnProductEditForm } from './_components/OwnProductEditForm'

export const metadata: Metadata = {
  title: `파티 수정 | ${USER_BRAND_NAME}`,
  description: '파티 정보를 수정합니다.',
}

export default function EditProductPage() {
  return (
    <UserAuthGuard>
      <section className="py-4">
        <OwnProductEditForm />
      </section>
    </UserAuthGuard>
  )
}
